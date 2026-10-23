import type { ChargeDuHookSendEmail } from "./demande-d-email-supabase.ts";

export class ChargeDuHookIncomplete extends Error {
  constructor(champ: string) {
    super(`La charge du hook est incomplète : « ${champ} » manque.`);
    this.name = "ChargeDuHookIncomplete";
  }
}

function objet(valeur: unknown, champ: string): Record<string, unknown> {
  if (typeof valeur !== "object" || valeur === null) throw new ChargeDuHookIncomplete(champ);
  return valeur as Record<string, unknown>;
}

function texte(parent: Record<string, unknown>, cle: string, chemin: string): string {
  const valeur = parent[cle];
  if (typeof valeur !== "string" || valeur === "") throw new ChargeDuHookIncomplete(`${chemin}.${cle}`);
  return valeur;
}

export function lireLaChargeDuHook(brute: unknown): ChargeDuHookSendEmail {
  const charge = objet(brute, "charge");
  const user = objet(charge.user, "user");
  const donnees = objet(charge.email_data, "email_data");
  return {
    user: { email: texte(user, "email", "user") },
    email_data: {
      token: texte(donnees, "token", "email_data"),
      token_hash: texte(donnees, "token_hash", "email_data"),
      redirect_to: texte(donnees, "redirect_to", "email_data"),
      email_action_type: texte(donnees, "email_action_type", "email_data"),
      site_url: texte(donnees, "site_url", "email_data"),
    },
  };
}
