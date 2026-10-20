import { useEffect, useState } from "react";
import { Download, Code2, Network, Check, RotateCcw } from "lucide-react";
import { makeArgdown, type Session } from "./learning";

type Graph = { nodes: { id: string; text: string }[]; edges: { from: string; to: string; type: string }[] };
export async function parseGraph(source: string): Promise<Graph> {
  if (!source.trim()) throw new Error("Keep at least one [Statement]: sentence.");
  const { ArgdownApplication, ParserPlugin, ModelPlugin } = await import("@argdown/core");
  const app = new ArgdownApplication();
  app.addPlugin(new ParserPlugin(), "parse");
  app.addPlugin(new ModelPlugin(), "model");
  const result = app.run({ input: source, process: ["parse", "model"] });
  if (result.parserErrors?.length || result.lexerErrors?.length) throw new Error("The syntax could not be parsed. Check brackets, indentation and blank lines.");
  if (!result.statements || !Object.keys(result.statements).length) throw new Error("Keep at least one [Statement]: sentence.");
  return {
    nodes: Object.entries(result.statements).map(([id, item]) => ({ id, text: item.members?.[0]?.text || id })),
    edges: (result.relations || []).flatMap(edge => edge.from?.title && edge.to?.title ? [{ from: edge.from.title, to: edge.to.title, type: String(edge.relationType) }] : [])
  };
}
function download(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function ArgumentMap({ session }: { session: Session }) {
  const [source, setSource] = useState(() => makeArgdown(session));
  const [graph, setGraph] = useState<Graph | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState("Position");
  const [busy, setBusy] = useState(true);
  async function update() {
    setBusy(true);
    try { setGraph(await parseGraph(source)); setError(""); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  useEffect(() => { void update(); }, []); // Source is applied explicitly while editing.
  const selectedNode = graph?.nodes.find(n => n.id === selected);
  const positions = new Map<string, { x: number; y: number }>();
  graph?.nodes.forEach((node, i) => positions.set(node.id, i === 0 ? { x: 320, y: 58 } : { x: i % 2 ? 160 : 480, y: 170 + Math.floor((i - 1) / 2) * 115 }));
  const height = Math.max(280, 230 + Math.ceil(((graph?.nodes.length || 1) - 1) / 2) * 115);
  return <div className="map-section">
    <div className="section-heading"><div><h3>See how your ideas connect</h3><p>Select a node to revisit the exact sentence. Blue supports; amber challenges.</p></div><div className="button-row">
      <button className="icon-button" title="Edit Argdown" aria-label="Edit Argdown" onClick={() => setEditing(!editing)}><Code2 size={17} /></button>
      <button className="icon-button" title="Download Argdown file" aria-label="Download Argdown file" onClick={() => download(source, `debate-${session.topicId}.argdown`)}><Download size={17} /></button>
    </div></div>
    <p className="map-disclosure">Connections follow each speaker’s role and turn order; they are not automatic proof of meaning. You can edit them below.</p>
    {editing && <div className="map-editor"><label htmlFor="argdown-source">Argdown source · + supports / - challenges</label><textarea id="argdown-source" value={source} onChange={e => setSource(e.target.value)} rows={12} maxLength={12000} spellCheck={false} /><div className="button-row"><button className="secondary small" onClick={update}><Check size={15} /> Update map</button><button className="text-button" onClick={() => setSource(makeArgdown(session))}><RotateCcw size={14} /> Restore this debate</button></div></div>}
    {error && <p className="error" role="alert">{error}</p>}
    {busy ? <p className="empty-inline">Mapping your ideas…</p> : graph && <div className="map-canvas">
      <svg viewBox={`0 0 640 ${height}`} role="img" aria-label="Support and challenge map for this debate">
        <defs><marker id="support-tip" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#638ec0"/></marker><marker id="attack-tip" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#c7966b"/></marker></defs>
        {graph.edges.map((edge, i) => {
          const from = positions.get(edge.from), to = positions.get(edge.to);
          if (!from || !to) return null;
          const attack = /attack|contrary|contradict/i.test(edge.type);
          return <path key={i} d={`M${from.x},${from.y - 30} C${from.x},${from.y - 70} ${to.x},${to.y + 75} ${to.x},${to.y + 35}`} stroke={attack ? "#c7966b" : "#638ec0"} strokeWidth="1.5" fill="none" markerEnd={`url(#${attack ? "attack" : "support"}-tip)`} />;
        })}
        {graph.nodes.map((node, i) => {
          const p = positions.get(node.id)!;
          return <g key={node.id} role="button" tabIndex={0} aria-label={node.id + ": " + node.text} onClick={() => setSelected(node.id)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(node.id); } }} className="graph-node">
            <rect x={p.x - 136} y={p.y - 31} width="272" height="68" rx="14" fill={i === 0 ? "#283344" : "#fff"} stroke={selected === node.id ? "#5985c9" : "#dfe5ec"} strokeWidth={selected === node.id ? 2 : 1} />
            <text x={p.x - 120} y={p.y - 9} fill={i === 0 ? "#bdcce0" : "#7b8795"} fontSize="10">{i === 0 ? "My position" : node.id}</text>
            <text x={p.x - 120} y={p.y + 13} fill={i === 0 ? "#fff" : "#334154"} fontSize="12">{node.text.slice(0, 34)}{node.text.length > 34 ? "…" : ""}</text>
          </g>;
        })}
      </svg>
    </div>}
    {selectedNode && <div className="node-detail"><Network size={18} /><div><span>{selectedNode.id.replace("Position", "My position")}</span><p>{selectedNode.text}</p></div></div>}
    <div className="map-credit">Support and challenge relations parsed with Argdown</div>
  </div>;
}
