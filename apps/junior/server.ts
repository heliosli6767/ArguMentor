import express from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { requestSchema, responseSchema, demoTurn, buildPrompt, normalizeQuote } from "./src/learning";
import { topics } from "./src/curriculum";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "24kb" }));
app.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff"); next(); });
const key = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "";
const router = Boolean(process.env.OPENROUTER_API_KEY);
const model = process.env.DEBATE_MODEL || (router ? "openai/gpt-4.1-mini" : "gpt-4.1-mini");
app.get("/api/status", (_req, res) => { res.json({ live: Boolean(key), provider: key ? router ? "OpenRouter" : "OpenAI" : null }); });
const requests = new Map<string, number[]>();
let inflight = 0;
app.post("/api/turn", async (req, res) => {
  // Same-origin only; do not accept cross-site POSTs to a local API with a parent key.
  const origin = req.headers.origin;
  if (origin && origin !== `http://${req.headers.host}` && origin !== `https://${req.headers.host}`) { res.status(403).json({ error: "请在练习网页中提交。" }); return; }
  const result = requestSchema.safeParse(req.body);
  if (!result.success || !topics.some(t => t.id === result.data?.topicId)) { res.status(400).json({ error: "请检查议题和发言内容。" }); return; }
  const input = result.data;
  const topic = topics.find(t => t.id === input.topicId)!;
  input.level = topic.level; // Never trust a client to bypass the curriculum.
  if (input.demo) { res.json(demoTurn(input)); return; }
  if (!key) { res.status(503).json({ error: "还没有连接模型。请让家长在本地配置密钥，或返回选择示范练习。" }); return; }
  const now = Date.now();
  const ip = req.ip || "local";
  const recent = (requests.get(ip) || []).filter(t => now - t < 60000);
  if (recent.length >= 12 || inflight >= 2) { res.status(429).json({ error: "请稍等片刻再提交。" }); return; }
  recent.push(now); requests.set(ip, recent); inflight++;
  try {
    const response = await fetch(router ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/chat/completions", {
      method: "POST", signal: AbortSignal.timeout(45000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "system", content: buildPrompt(input) }, { role: "user", content: JSON.stringify({ history: input.history, speech: input.text }) }], response_format: { type: "json_object" }, max_tokens: 1300 })
    });
    if (!response.ok) { res.status(502).json({ error: `模型服务暂时不可用（${response.status}）。发言已保留，可稍后重试。` }); return; }
    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content || "";
    const parsed = responseSchema.parse(JSON.parse(content.replace(/^```json\s*|\s*```$/g, "")));
    res.json({ ...parsed, feedback: normalizeQuote(parsed.feedback, input.text), mode: "live" });
  } catch {
    res.status(502).json({ error: "这次没有收到完整反馈。发言已保留，请重试；不会用示范内容代替真实反馈。" });
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
