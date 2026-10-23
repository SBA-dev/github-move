// Connexion d'un parent de test SANS envoyer d'e-mail (le projet savanturier-dev limite les e-mails de connexion).
// Service partagé par les stories qui ont seulement besoin d'un parent connecté en préparation (#10, #15…).
// Les scénarios qui testent la connexion elle-même (#5) passent toujours par « a demandé un lien de connexion ».
//
// Principe : l'API d'administration de Supabase Auth (clé service_role, préparation seulement) génère un lien magique
// sans l'envoyer ni appeler le hook d'e-mail ; on l'échange (/auth/v1/verify, clé anon) contre une vraie session ;
// on la dépose dans le stockage du navigateur, au format de supabase-js. L'application la lit comme une connexion
// ordinaire : jeton valide côté serveur, RLS appliquée.

import type { Page } from "@playwright/test";

type SessionSupabase = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: { id: string; email: string };
};

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

async function appelerAuth(chemin: string, cle: string, corps: object): Promise<Response> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/auth/v1${chemin}`, {
    method: "POST",
    headers: { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify(corps),
  });
  if (!reponse.ok) throw new Error(`Supabase Auth POST ${chemin} : ${reponse.status} ${await reponse.text()}`);
  return reponse;
}

export async function ouvrirUneSessionSansEmail(adresse: string): Promise<SessionSupabase> {
  const lien = await appelerAuth("/admin/generate_link", variable("SUPABASE_SERVICE_ROLE_KEY"), {
    type: "magiclink",
    email: adresse,
  });
  const { hashed_token: jeton } = (await lien.json()) as { hashed_token: string };
  const session = await appelerAuth("/verify", variable("SUPABASE_ANON_KEY"), { type: "magiclink", token_hash: jeton });
  const lue = (await session.json()) as SessionSupabase;
  return { ...lue, expires_at: lue.expires_at ?? Math.floor(Date.now() / 1000) + lue.expires_in };
}

function cleDeStockage(): string {
  return `sb-${new URL(variable("SUPABASE_URL")).hostname.split(".")[0]}-auth-token`;
}

/** Dépose la session dans le navigateur, puis recharge l'application : le parent est connecté comme après un lien. */
export async function deposerLaSession(page: Page, session: SessionSupabase): Promise<void> {
  await page.goto("/");
  await page.evaluate(([cle, valeur]) => localStorage.setItem(cle as string, valeur as string), [
    cleDeStockage(),
    JSON.stringify(session),
  ]);
  await page.goto("/");
}
