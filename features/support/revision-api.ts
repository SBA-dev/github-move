// Story #28. Préparation (clé service_role, réservée à cela) et appels faits comme l'application : avec le jeton du parent.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

function entetesServiceRole(): Record<string, string> {
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" };
}

function entetes(jeton: string): Record<string, string> {
  return { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" };
}

export type QuestionRetenueEnBase = {
  readonly cle: string;
  readonly leconDOrigine: string;
  readonly position: number;
  readonly type: string;
  readonly intervalle: 1 | 3 | 7;
  readonly dateDeRevision: string;
  readonly derniereErreurLe: string;
};

/** Écrit la file du profil (version 1) et ses questions retenues. Part en cascade avec le profil. */
export async function ecrireLaFileDeRevision(profil: string, questions: readonly QuestionRetenueEnBase[]): Promise<void> {
  const url = variable("SUPABASE_URL");
  const reponse = await fetch(`${url}/rest/v1/files_de_revision?on_conflict=profil`, {
    method: "POST",
    headers: { ...entetesServiceRole(), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ profil, erreurs_corrigees_pour_de_bon: 0, version: 1 }),
  });
  if (!reponse.ok) throw new Error(`files_de_revision : ${reponse.status} ${await reponse.text()}`);
  if (questions.length === 0) return;
  const lignes = questions.map((q) => ({
    profil,
    cle: q.cle,
    lecon_d_origine: q.leconDOrigine,
    position: q.position,
    type: q.type,
    intervalle: q.intervalle,
    date_de_revision: q.dateDeRevision,
    derniere_erreur_le: q.derniereErreurLe,
    nombre_de_fois_ratee: 1,
  }));
  const ecrites = await fetch(`${url}/rest/v1/questions_retenues`, {
    method: "POST",
    headers: entetesServiceRole(),
    body: JSON.stringify(lignes),
  });
  if (!ecrites.ok) throw new Error(`questions_retenues : ${ecrites.status} ${await ecrites.text()}`);
}

export type ReponseDeLaRevision = { readonly statut: number; readonly message: string | undefined };

export async function envoyerUneSeanceDeRevisionTerminee(jeton: string, corps: object): Promise<ReponseDeLaRevision> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/functions/v1/terminer-la-seance-de-revision`, {
    method: "POST",
    headers: entetes(jeton),
    body: JSON.stringify(corps),
  });
  const lu = (await reponse.json().catch(() => ({}))) as { error?: { message?: string } };
  return { statut: reponse.status, message: lu.error?.message };
}

export async function lireLaFileEnRest(jeton: string, profil: string): Promise<{ statut: number; lignes: Record<string, unknown>[] }> {
  const url = variable("SUPABASE_URL");
  let statut = 200;
  const lignes: Record<string, unknown>[] = [];
  for (const table of ["files_de_revision", "questions_retenues", "seances_de_revision_terminees"]) {
    const reponse = await fetch(`${url}/rest/v1/${table}?select=*&profil=eq.${encodeURIComponent(profil)}`, { headers: entetes(jeton) });
    statut = Math.max(statut, reponse.status);
    if (reponse.ok) lignes.push(...((await reponse.json()) as Record<string, unknown>[]));
  }
  return { statut, lignes };
}
