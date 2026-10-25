// Story #20 : préparations côté serveur des scénarios de calcul et de fluence, et lecture d'un record sous RLS.
//
// La clé service_role ne sert ici qu'à PRÉPARER l'état de départ d'un profil enfant de test (un historique de réponses
// de calcul, un record déjà gagné). Aucune action d'un parent ou d'un enfant ne passe par elle : la lecture d'un record
// par un parent se fait avec le jeton de ce parent, comme l'application. Tout part en cascade avec le profil enfant,
// que la fixture `famille` supprime en fin de scénario.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

function entetesDePreparation(): Record<string, string> {
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" };
}

async function ecrire(table: string, ligne: object): Promise<void> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/${table}`, {
    method: "POST",
    headers: entetesDePreparation(),
    body: JSON.stringify(ligne),
  });
  if (!reponse.ok) throw new Error(`Préparation de ${table} impossible : ${reponse.status} ${await reponse.text()}`);
}

const LECON_DE_L_HISTORIQUE = "e2e-20-historique-de-calcul";
const UN_JOUR_EN_MS = 86_400_000;

/** Une séance terminée il y a `ilYaJours` jours, dont les réponses de calcul comptent ces réussites et ces erreurs. */
export async function inscrireUneSeanceDeCalcul(
  profil: string,
  seance: { reussites: number; erreurs: number; ilYaJours: number },
): Promise<void> {
  await ecrire("seances_terminees", {
    id: crypto.randomUUID(),
    profil,
    lecon: LECON_DE_L_HISTORIQUE,
    choix: { genre: "complete" },
    termine_le: new Date(Date.now() - seance.ilYaJours * UN_JOUR_EN_MS).toISOString(),
    etoiles: 1,
    erreurs: seance.erreurs,
    par_type: { calcul: { reussites: seance.reussites, erreurs: seance.erreurs } },
  });
}

export async function inscrireUnRecordDeFluence(profil: string, lecon: string, exercice: string, score: number): Promise<void> {
  await ecrire("records_de_fluence", { profil, lecon, exercice, meilleur_score: score });
}

/** Lecture REST sous RLS, avec le jeton du parent : les records qu'il a le droit de voir pour ce profil. */
export async function lireLesRecordsEnRest(jeton: string, profil: string): Promise<{ statut: number; lignes: Record<string, unknown>[] }> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/records_de_fluence?select=*&profil=eq.${encodeURIComponent(profil)}`, {
    headers: { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" },
  });
  const lues = reponse.ok ? ((await reponse.json()) as Record<string, unknown>[]) : [];
  return { statut: reponse.status, lignes: lues };
}
