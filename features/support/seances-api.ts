// Appels de la story #24 faits comme le ferait l'application : avec le jeton du parent (jamais la clé service_role).
// La RLS et les règles de la fonction `terminer-la-seance` s'appliquent. Les séances ne s'écrivent que par la fonction.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

function entetes(jeton: string): Record<string, string> {
  return { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" };
}

export type ReponseDeLEnregistrement = { readonly statut: number; readonly message: string | undefined };

export async function envoyerUneSeanceTerminee(jeton: string, corps: object): Promise<ReponseDeLEnregistrement> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/functions/v1/terminer-la-seance`, {
    method: "POST",
    headers: entetes(jeton),
    body: JSON.stringify(corps),
  });
  const lu = (await reponse.json().catch(() => ({}))) as { error?: { message?: string } };
  return { statut: reponse.status, message: lu.error?.message };
}

/** Lecture REST sous RLS d'une table de la story. */
export async function lireEnRest(jeton: string, table: "resultats_des_lecons" | "seances_terminees", profil: string): Promise<
  { statut: number; lignes: Record<string, unknown>[] }
> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/${table}?select=*&profil=eq.${encodeURIComponent(profil)}`, {
    headers: entetes(jeton),
  });
  const lu = reponse.ok ? ((await reponse.json()) as Record<string, unknown>[]) : [];
  return { statut: reponse.status, lignes: lu };
}

export async function meilleuresEtoilesEnRest(jeton: string, profil: string, lecon: string): Promise<number | undefined> {
  const { lignes } = await lireEnRest(jeton, "resultats_des_lecons", profil);
  const ligne = lignes.find((l) => l.lecon === lecon);
  return typeof ligne?.meilleures_etoiles === "number" ? ligne.meilleures_etoiles : undefined;
}

/** Un parent, même rattaché, n'écrit jamais lui-même une séance terminée : seule la fonction le fait. */
export async function insertionDirecteDeSeance(jeton: string, profil: string, lecon: string): Promise<number> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/seances_terminees`, {
    method: "POST",
    headers: entetes(jeton),
    body: JSON.stringify({
      id: crypto.randomUUID(),
      profil,
      lecon,
      choix: { genre: "complete" },
      termine_le: new Date().toISOString(),
      etoiles: 3,
      erreurs: 0,
    }),
  });
  return reponse.status;
}
