// Utilitaires de test de la story #72 (connexion par mot de passe du parent) sur savanturier-dev.
// La clé service_role ne sert ici qu'à PRÉPARER (parent avec mot de passe, état des essais de réinitialisation) et à
// NETTOYER, toujours pour des adresses de test `@exemple.test`. Jamais pour simuler une action du parent : les essais
// ratés et les réinitialisations de préparation passent par la fonction publique, avec la seule clé anon.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

const ADRESSE_DE_TEST = /^[\w.+-]+@exemple\.test$/;

function verifierAdresseDeTest(adresse: string): void {
  if (!ADRESSE_DE_TEST.test(adresse)) throw new Error(`Adresse hors périmètre des tests : ${adresse}`);
}

function entetesServiceRole(): Record<string, string> {
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" };
}

function entetesAnon(): Record<string, string> {
  const cle = variable("SUPABASE_ANON_KEY");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" };
}

// --- Parent inscrit avec un mot de passe (préparation, API d'administration)

export async function creerUnParentAvecMotDePasse(adresse: string, motDePasse: string): Promise<string> {
  verifierAdresseDeTest(adresse);
  const reponse = await fetch(`${variable("SUPABASE_URL")}/auth/v1/admin/users`, {
    method: "POST",
    headers: entetesServiceRole(),
    body: JSON.stringify({ email: adresse, password: motDePasse, email_confirm: true }),
  });
  if (!reponse.ok) throw new Error(`Création du parent de test : ${reponse.status} ${await reponse.text()}`);
  return ((await reponse.json()) as { id: string }).id;
}

// --- Ce que fait le parent, côté serveur, avec la seule clé publique

export async function appelerLaReinitialisation(adresse: string, prenom: string, motDePasse: string): Promise<number> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/functions/v1/reinitialiser-le-mot-de-passe`, {
    method: "POST",
    headers: entetesAnon(),
    body: JSON.stringify({ adresse, prenom, motDePasse }),
  });
  await reponse.text();
  return reponse.status;
}

export async function leMotDePasseOuvreUneConnexion(adresse: string, motDePasse: string): Promise<boolean> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: entetesAnon(),
    body: JSON.stringify({ email: adresse, password: motDePasse }),
  });
  await reponse.text();
  return reponse.ok;
}

export async function leJetonDeRenouvellementMarche(jetonDeRenouvellement: string): Promise<boolean> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: entetesAnon(),
    body: JSON.stringify({ refresh_token: jetonDeRenouvellement }),
  });
  await reponse.text();
  return reponse.ok;
}

// --- Essais de réinitialisation (table sans policy : service_role seulement)

type LigneDesEssais = { adresse: string; essais_rates: number; dernier_rate_le: string | null; bloque_jusqua: string | null };

const URL_DES_ESSAIS = () => `${variable("SUPABASE_URL")}/rest/v1/essais_de_reinitialisation`;

/** Antidate l'état des essais de cette adresse (dernier raté et fin du blocage) : le vrai serveur juge ensuite. */
export async function reculerLesEssais(adresse: string, minutes: number): Promise<void> {
  verifierAdresseDeTest(adresse);
  const filtre = `?adresse=eq.${encodeURIComponent(adresse)}`;
  const lecture = await fetch(`${URL_DES_ESSAIS()}${filtre}&select=*`, { headers: entetesServiceRole() });
  if (!lecture.ok) throw new Error(`Lecture des essais : ${lecture.status}`);
  const ligne = ((await lecture.json()) as LigneDesEssais[])[0];
  if (!ligne) throw new Error(`Aucun essai de réinitialisation enregistré pour ${adresse}`);
  const reculer = (date: string | null) => (date === null ? null : new Date(Date.parse(date) - minutes * 60_000).toISOString());
  const ecriture = await fetch(`${URL_DES_ESSAIS()}${filtre}`, {
    method: "PATCH",
    headers: entetesServiceRole(),
    body: JSON.stringify({ dernier_rate_le: reculer(ligne.dernier_rate_le), bloque_jusqua: reculer(ligne.bloque_jusqua) }),
  });
  if (!ecriture.ok) throw new Error(`Antidatage des essais : ${ecriture.status}`);
}

/** Nettoyage : seulement les lignes des adresses de ce suffixe de test. */
export async function supprimerLesEssaisDuSuffixe(suffixe: string): Promise<void> {
  const motif = encodeURIComponent(`*+${suffixe}@exemple.test`);
  const reponse = await fetch(`${URL_DES_ESSAIS()}?adresse=like.${motif}`, { method: "DELETE", headers: entetesServiceRole() });
  if (!reponse.ok) throw new Error(`Nettoyage des essais : ${reponse.status}`);
}
