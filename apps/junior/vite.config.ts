import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  esbuild: { tsconfigRaw: { compilerOptions: { target: "ES2022", useDefineForClassFields: true } } },
  resolve: { alias: { zod: fileURLToPath(new URL("./node_modules/zod/index.js", import.meta.url)) } },
  server: { host: "127.0.0.1", port: 4187, strictPort: true },
  build: { outDir: "../../dist", emptyOutDir: true, chunkSizeWarningLimit: 1600 }
});
