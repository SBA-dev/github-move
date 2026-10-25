// Story #34. Préparation des faits d'Apprentissage lus par le suivi : écrits avec la clé service_role, réservée à cela,
// pour le profil réel de l'enfant. Le suivi, lui, lit sous RLS avec le jeton du parent. Tout part en cascade avec le profil.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

async function ecrire(table: string, corps: object, entetesEnPlus: Record<string, string> = {}): Promise<void> {
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json", ...entetesEnPlus },
    body: JSON.stringify(corps),
  });
  if (!reponse.ok) throw new Error(`${table} : ${reponse.status} ${await reponse.text()}`);
}

/** « 14/10/2026 » devient le 14 octobre 2026 à 10 h UTC : le même jour dans tous les fuseaux d'Europe. */
export function instantDuJour(jourEnFrancais: string): string {
  const [jour, mois, annee] = jourEnFrancais.split("/");
  if (!jour || !mois || !annee) throw new Error(`Date attendue au format jj/mm/aaaa : ${jourEnFrancais}`);
  return `${annee}-${mois}-${jour}T10:00:00.000Z`;
}

export type SeancePreparee = {
  readonly lecon: string;
  readonly termineLe: string;
  readonly erreurs: number;
  /** `undefined` : séance de fluence seule, sans étoile. */
  readonly etoiles: 1 | 2 | 3 | undefined;
};

/** Une ligne par séance, et le résultat de chaque leçon comme le serveur l'écrirait (sauf pour la fluence seule). */
export async function ecrireDesSeancesTerminees(profil: string, seances: readonly SeancePreparee[]): Promise<void> {
  if (seances.length === 0) return;
  await ecrire(
    "seances_terminees",
    seances.map((s) => ({
      id: crypto.randomUUID(),
      profil,
      lecon: s.lecon,
      choix: { genre: s.etoiles === undefined ? "unExercice" : "complete" },
      termine_le: s.termineLe,
      etoiles: s.etoiles ?? null,
      erreurs: s.erreurs,
    })),
  );
  const avecEtoiles = seances.filter((s) => s.etoiles !== undefined);
  const parLecon = new Map<string, SeancePreparee[]>();
  for (const seance of avecEtoiles) parLecon.set(seance.lecon, [...(parLecon.get(seance.lecon) ?? []), seance]);
  const resultats = [...parLecon].map(([lecon, jouees]) => {
    const chronologie = [...jouees].sort((a, b) => a.termineLe.localeCompare(b.termineLe));
    return {
      profil,
      lecon,
      meilleures_etoiles: Math.max(...jouees.map((s) => s.etoiles ?? 0)),
      dernieres_etoiles: chronologie[chronologie.length - 1]?.etoiles,
      nombre_de_seances: jouees.length,
    };
  });
  if (resultats.length > 0) await ecrire("resultats_des_lecons", resultats);
}

export async function ecrireUnTestDeDepartFaitLe(profil: string, faitLe: string, leconsReussies: readonly string[]): Promise<void> {
  await ecrire("resultats_des_tests_de_depart", { profil, fait_le: faitLe, lecons_reussies: leconsReussies });
}

export async function ecrireDesSeancesDeRevision(profil: string, nombre: number): Promise<void> {
  const maintenant = new Date();
  await ecrire(
    "seances_de_revision_terminees",
    Array.from({ length: nombre }, () => ({
      id: crypto.randomUUID(),
      profil,
      termine_le: maintenant.toISOString(),
      jour: maintenant.toISOString().slice(0, 10),
      nombre_de_questions: 5,
      nombre_de_questions_justes: 5,
    })),
  );
}

export async function ecrireLesErreursCorrigeesPourDeBon(profil: string, nombre: number): Promise<void> {
  await ecrire(
    "files_de_revision?on_conflict=profil",
    { profil, erreurs_corrigees_pour_de_bon: nombre, version: 1 },
    { Prefer: "resolution=merge-duplicates" },
  );
}
