// Story #101. Préparation d'une séance terminée d'AUTRE enfant que Léa (clé service_role, réservée à cette préparation) :
// la séance de Léa, elle, se joue toujours par l'interface. La ligne part en cascade avec le profil enfant.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

function deuxChiffres(n: number): string {
  return String(n).padStart(2, "0");
}

/** Une séance de la leçon donnée, finie aujourd'hui à 10 h (jour du calendrier de l'appareil), avec le nombre d'étoiles demandé. */
export async function ecrireUneSeanceTermineePourLeProfil(profil: string, lecon: string, etoiles: number): Promise<void> {
  const maintenant = new Date();
  const dix = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate(), 10, 0, 0);
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/seances_terminees`, {
    method: "POST",
    headers: { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      profil,
      lecon,
      choix: { genre: "complete" },
      termine_le: dix.toISOString(),
      jour: `${dix.getFullYear()}-${deuxChiffres(dix.getMonth() + 1)}-${deuxChiffres(dix.getDate())}`,
      etoiles,
      erreurs: 3 - etoiles,
    }),
  });
  if (!reponse.ok) throw new Error(`seances_terminees : ${reponse.status} ${await reponse.text()}`);
}
