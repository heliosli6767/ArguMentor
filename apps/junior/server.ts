import express from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { requestSchema, responseSchema, demoTurn, buildPrompt, normalizeQuote } from "./src/learning";
import { topics } from "./src/curriculum";

const app = express();
app.disable("x-powered-by");
app.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff"); next(); });
const openAIKey = process.env.OPENAI_API_KEY || "";
const key = process.env.OPENROUTER_API_KEY || openAIKey;
const router = Boolean(process.env.OPENROUTER_API_KEY);
const model = process.env.DEBATE_MODEL || (router ? "openai/gpt-4.1-mini" : "gpt-4.1-mini");
const sameOrigin = (req: express.Request) => {
  const origin = req.headers.origin;
  return !origin || origin === `http://${req.headers.host}` || origin === `https://${req.headers.host}`;
};
app.get("/api/status", (_req, res) => { res.json({ live: Boolean(key), transcription: Boolean(openAIKey), provider: key ? router ? "OpenRouter" : "OpenAI" : null }); });
app.post("/api/transcribe", express.raw({ type: ["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg", "audio/wav"], limit: "12mb" }), async (req, res) => {
  if (!sameOrigin(req)) { res.status(403).json({ error: "Please record from the practice page." }); return; }
  if (!openAIKey) { res.status(503).json({ error: "Voice transcription needs OPENAI_API_KEY in the local app. Browser speech recognition may still work in Chrome." }); return; }
  if (!Buffer.isBuffer(req.body) || req.body.length < 100) { res.status(400).json({ error: "No usable recording was received." }); return; }
  try {
    const mime = String(req.headers["content-type"] || "audio/webm").split(";")[0];
    const extension: Record<string,string> = { "audio/webm":"webm", "audio/mp4":"mp4", "audio/ogg":"ogg", "audio/mpeg":"mp3", "audio/wav":"wav" };
    const form = new FormData();
    const audio = new Uint8Array(req.body.byteLength); audio.set(req.body);
    form.append("file", new Blob([audio.buffer], { type: mime }), `debate.${extension[mime] || "webm"}`);
    form.append("model", process.env.TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
    form.append("language", "en");
    form.append("prompt", "A school English debate by a grade-six learner. Preserve the learner's own wording.");
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", { method:"POST", headers:{ Authorization:`Bearer ${openAIKey}` }, body:form, signal:AbortSignal.timeout(45000) });
    if (!response.ok) { res.status(502).json({ error:`Transcription is temporarily unavailable (${response.status}). Your recording was not stored.` }); return; }
    const data = await response.json() as { text?: string };
    if (!data.text?.trim()) { res.status(502).json({ error:"No speech was detected. Please try again closer to the microphone." }); return; }
    res.json({ text:data.text.trim() });
  } catch { res.status(502).json({ error:"Transcription failed. The recording was not stored; please try again or type your response." }); }
});
app.use(express.json({ limit: "24kb" }));
const requests = new Map<string, number[]>();
let inflight = 0;
app.post("/api/turn", async (req, res) => {
  // Same-origin only; do not accept cross-site POSTs to a local API with a parent key.
  if (!sameOrigin(req)) { res.status(403).json({ error: "Please submit from the practice page." }); return; }
  const result = requestSchema.safeParse(req.body);
  if (!result.success || !topics.some(t => t.id === result.data?.topicId)) { res.status(400).json({ error: "Please check the motion and your response." }); return; }
  const input = result.data;
  const topic = topics.find(t => t.id === input.topicId)!;
  input.level = topic.level; // Never trust a client to bypass the curriculum.
  if (input.demo) { res.json(demoTurn(input)); return; }
  if (!key) { res.status(503).json({ error: "No model is connected. Ask a parent to configure a local API key, or choose Demonstration mode." }); return; }
  const now = Date.now();
  const ip = req.ip || "local";
  const recent = (requests.get(ip) || []).filter(t => now - t < 60000);
  if (recent.length >= 12 || inflight >= 2) { res.status(429).json({ error: "Please wait a moment before submitting again." }); return; }
  recent.push(now); requests.set(ip, recent); inflight++;
  try {
    const response = await fetch(router ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/chat/completions", {
      method: "POST", signal: AbortSignal.timeout(45000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "system", content: buildPrompt(input) }, { role: "user", content: JSON.stringify({ history: input.history, speech: input.text }) }], response_format: { type: "json_object" }, max_tokens: 1300 })
    });
    if (!response.ok) { res.status(502).json({ error: `The model service is temporarily unavailable (${response.status}). Your draft is still here.` }); return; }
    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content || "";
    const parsed = responseSchema.parse(JSON.parse(content.replace(/^```json\s*|\s*```$/g, "")));
    res.json({ ...parsed, feedback: normalizeQuote(parsed.feedback, input.text), mode: "live" });
  } catch {
    res.status(502).json({ error: "The model did not return complete feedback. Your draft is still here; please try again." });
  } finally { inflight--; }
});
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.argv.includes("--production")) {
  app.use(express.static(path.join(root, "../../dist")));
  app.get("/{*path}", (_req, res) => { res.sendFile(path.join(root, "../../dist/index.html")); });
} else {
  const vite = await createViteServer({ configFile: path.join(root, "vite.config.ts"), server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
}
const port = Number(process.env.PORT || 4187);
const server = app.listen(port, "127.0.0.1", () => console.log(`ArguMentor Junior: http://127.0.0.1:${port}\nModel: ${key ? "connected (server-side)" : "not configured — demonstration mode available"}`));
server.on("error", (error) => { console.error(error.message); process.exit(1); });
