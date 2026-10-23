// Appels aux Edge Functions de Famille (story #11), faits comme le ferait l'application : avec le jeton du parent
// (jamais la clé service_role). Sert aux préparations des scénarios (« Paul est rattaché au profil enfant… »)
// et aux tentatives d'un parent non rattaché ou d'un visiteur non connecté.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

export type DonneesDeProfil = { prenom: string; niveau?: string; univers?: string };

export type ReponseDeLaFonction = {
  readonly statut: number;
  readonly message: string | undefined;
  readonly profil: { id: string; prenom: string; niveau: string; univers: string } | undefined;
};

/** `jeton` absent : un visiteur non connecté, qui ne présente que la clé publique de l'application. */
export async function appelerUneFonctionDeFamille(
  fonction: "creer-profil-enfant" | "modifier-profil-enfant",
  jeton: string | undefined,
  corps: object,
): Promise<ReponseDeLaFonction> {
  const cle = variable("SUPABASE_ANON_KEY");
  const reponse = await fetch(`${variable("SUPABASE_URL")}/functions/v1/${fonction}`, {
    method: "POST",
    headers: { apikey: cle, Authorization: `Bearer ${jeton ?? cle}`, "Content-Type": "application/json" },
    body: JSON.stringify(corps),
  });
  const lu = (await reponse.json().catch(() => ({}))) as {
    error?: { message?: string };
    message?: string;
    profil?: ReponseDeLaFonction["profil"];
  };
  return { statut: reponse.status, message: lu.error?.message ?? lu.message, profil: lu.profil };
}

/** Écriture REST directe sur `profils_enfants`, avec le jeton du parent (ou la seule clé publique sans jeton). */
export async function ecrireEnRestUnProfil(
  jeton: string | undefined,
  requete: { methode: "POST" | "PATCH"; profil?: string; corps: object },
): Promise<{ statut: number; id: string | undefined }> {
  const cle = variable("SUPABASE_ANON_KEY");
  const filtre = requete.profil === undefined ? "" : `?id=eq.${encodeURIComponent(requete.profil)}`;
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/profils_enfants${filtre}`, {
    method: requete.methode,
    headers: {
      apikey: cle,
      Authorization: `Bearer ${jeton ?? cle}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(requete.corps),
  });
  const lu = reponse.ok ? ((await reponse.json().catch(() => [])) as { id?: string }[]) : [];
  return { statut: reponse.status, id: lu[0]?.id };
}

/** Lecture REST sous RLS : les profils que le jeton du parent a le droit de voir. */
export async function lireEnRestLesProfilsVisibles(jeton: string): Promise<{ id: string; prenom: string }[]> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/profils_enfants?select=id,prenom`, {
    headers: { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}` },
  });
  return (await reponse.json()) as { id: string; prenom: string }[];
}
