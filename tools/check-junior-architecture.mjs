import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "apps/junior/src/App.tsx",
  "apps/wechat-miniapp/miniprogram/app.json",
  "apps/wechat-miniapp/miniprogram/pages/debate/index.ts",
  "apps/mobile/app/(tabs)/index.tsx",
  "apps/mobile/app/debate/[sessionId].tsx",
  "packages/junior-contracts/src/index.ts",
  "services/junior-api/openapi.yaml",
  "docs/junior-platform/README.md"
];
for (const item of required) assert.ok(fs.existsSync(path.join(root, item)), `Missing architecture path: ${item}`);

const clientRoots = ["apps/junior/src", "apps/wechat-miniapp/miniprogram", "apps/mobile"];
const secretPattern = /(sk-[A-Za-z0-9_-]{20,}|OPENAI_API_KEY\s*=\s*[^\s])/;
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (["node_modules", ".expo", "dist"].includes(entry.name)) continue;
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(ts|tsx|js|json|wxml|wxss|css)$/.test(entry.name)) assert.doesNotMatch(fs.readFileSync(file, "utf8"), secretPattern, `Client secret in ${file}`);
  }
}
for (const folder of clientRoots) walk(path.join(root, folder));
console.log(`Junior architecture OK: ${required.length} required paths, no client secrets.`);
