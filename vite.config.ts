import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Le domaine (TypeScript pur) est partagé avec les Edge Functions : voir docs/decisions/0003.
const partage = fileURLToPath(new URL("./supabase/functions/_shared", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^@domain\/([^/]+)$/, replacement: `${partage}/$1/domain/index.ts` }],
  },
  server: { port: 5173, strictPort: true },
});
