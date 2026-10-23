import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { pwa } from "./vite-plugins/pwa.ts";

// Le domaine (TypeScript pur) est partagé avec les Edge Functions : voir docs/decisions/0003.
const partage = fileURLToPath(new URL("./supabase/functions/_shared", import.meta.url));

// Le front reçoit l'URL et la clé anon (publiques) à partir de SUPABASE_URL et SUPABASE_ANON_KEY de l'environnement.
// Seules ces deux valeurs sont exposées : jamais la clé service_role.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), pwa()],
    resolve: {
      alias: [{ find: /^@domain\/([^/]+)$/, replacement: `${partage}/$1/domain/index.ts` }],
    },
    server: { port: 5173, strictPort: true },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL || env.SUPABASE_URL || ""),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || ""),
    },
  };
});
