// Story #30. Préparation des jours de séance (clé service_role, réservée à cela) et lecture faite comme un parent :
// avec son jeton, sous RLS. Les lignes partent en cascade avec le profil enfant.

const LECON_DES_SEANCES_PREPAREES = "fr-cp-sons-ou-on-an";

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

async function ecrire(table: string, corps: readonly object[]): Promise<void> {
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify(corps),
  });
  if (!reponse.ok) throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`);
}

/** Un jour du calendrier de l'appareil : sa date (« 2026-10-26 ») et le moment, ce jour-là à 10 h, où la séance s'est finie. */
export type JourPrepare = { readonly jour: string; readonly termineLe: string };

function deuxChiffres(n: number): string {
  return String(n).padStart(2, "0");
}

/** Le jour du calendrier de l'appareil situé `decalage` jours d'aujourd'hui (négatif : dans le passé). */
export function jourPrepare(decalage: number, maintenant: Date = new Date()): JourPrepare {
  const dix = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() + decalage, 10, 0, 0);
  return {
    jour: `${dix.getFullYear()}-${deuxChiffres(dix.getMonth() + 1)}-${deuxChiffres(dix.getDate())}`,
    termineLe: dix.toISOString(),
  };
}

/** « aujourd'hui », « hier », « il y a 3 jours » : le nombre de jours depuis aujourd'hui, en négatif. */
export function decalageDuJourDit(texte: string): number {
  if (texte === "aujourd'hui") return 0;
  if (texte === "hier") return -1;
  const passe = /^il y a (\d+) jours?$/.exec(texte);
  if (passe) return -Number(passe[1]);
  throw new Error(`Jour de séance inconnu : « ${texte} »`);
}

/** « aujourd'hui, hier et il y a 2 jours » : les décalages cités, dans l'ordre. */
export function decalagesDesJoursDits(liste: string): number[] {
  return liste.split(/\s*,\s*|\s+et\s+/).map(decalageDuJourDit);
}

/** Une séance terminée par jour, de la vraie leçon « Les sons ou, on, an », avec 2 étoiles. */
export async function ecrireDesSeancesTermineesPourLaSerie(profil: string, jours: readonly JourPrepare[]): Promise<void> {
  await ecrire(
    "seances_terminees",
    jours.map(({ jour, termineLe }) => ({
      id: crypto.randomUUID(),
      profil,
      lecon: LECON_DES_SEANCES_PREPAREES,
      choix: { genre: "complete" },
      termine_le: termineLe,
      jour,
      etoiles: 2,
      erreurs: 1,
    })),
  );
}

/** Une séance de révision terminée par jour. */
export async function ecrireDesSeancesDeRevisionPourLaSerie(profil: string, jours: readonly JourPrepare[]): Promise<void> {
  await ecrire(
    "seances_de_revision_terminees",
    jours.map(({ jour, termineLe }) => ({
      id: crypto.randomUUID(),
      profil,
      termine_le: termineLe,
      jour,
      nombre_de_questions: 5,
      nombre_de_questions_justes: 5,
    })),
  );
}

function entetes(jeton: string): Record<string, string> {
  return { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" };
}

/** Les séances terminées et les séances de révision terminées du profil, lues avec le jeton d'un parent (RLS). */
export async function lireLesJoursDeSeanceEnRest(
  jeton: string,
  profil: string,
): Promise<{ statut: number; lignes: Record<string, unknown>[] }> {
  let statut = 200;
  const lignes: Record<string, unknown>[] = [];
  for (const table of ["seances_terminees", "seances_de_revision_terminees"]) {
    const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/${table}?select=*&profil=eq.${encodeURIComponent(profil)}`, {
      headers: entetes(jeton),
    });
    statut = Math.max(statut, reponse.status);
    if (reponse.ok) lignes.push(...((await reponse.json()) as Record<string, unknown>[]));
  }
  return { statut, lignes };
}
