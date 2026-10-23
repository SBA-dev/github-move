// Quand Supabase refuse un lien de connexion (déjà utilisé, expiré), il revient sur la page
// avec l'erreur dans l'adresse (fragment en flux implicit, paramètres si le serveur redirige).
export function lienDeConnexionRefuse(adresse: URL): boolean {
  const fragment = new URLSearchParams(adresse.hash.replace(/^#/, ""));
  return [adresse.searchParams, fragment].some((parametres) => parametres.has("error") || parametres.has("error_code"));
}

export function lienDeConnexionSuivi(adresse: URL): boolean {
  return new URLSearchParams(adresse.hash.replace(/^#/, "")).has("access_token");
}
