// Appels de la story #27 faits comme le ferait l'application : avec le jeton du parent (jamais la clé service_role).
// La RLS et les règles de la fonction `terminer-le-test-de-depart` s'appliquent.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

function entetes(jeton: string): Record<string, string> {
  return { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" };
}

export type ReponseDuTestDeDepart = {
  readonly statut: number;
  readonly message: string | undefined;
  readonly enregistre: boolean | undefined;
};

export async function envoyerUnTestDeDepartTermine(jeton: string, corps: object): Promise<ReponseDuTestDeDepart> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/functions/v1/terminer-le-test-de-depart`, {
    method: "POST",
    headers: entetes(jeton),
    body: JSON.stringify(corps),
  });
  const lu = (await reponse.json().catch(() => ({}))) as { error?: { message?: string }; enregistre?: boolean };
  return { statut: reponse.status, message: lu.error?.message, enregistre: lu.enregistre };
}

/** Lecture REST sous RLS du résultat du test de départ d'un profil. */
export async function lireLeResultatDuTestEnRest(jeton: string, profil: string): Promise<
  { statut: number; lignes: Record<string, unknown>[] }
> {
  const reponse = await fetch(
    `${variable("SUPABASE_URL")}/rest/v1/resultats_des_tests_de_depart?select=*&profil=eq.${encodeURIComponent(profil)}`,
    { headers: entetes(jeton) },
  );
  const lues = reponse.ok ? ((await reponse.json()) as Record<string, unknown>[]) : [];
  return { statut: reponse.status, lignes: lues };
}
