export type ParoleAvecSonTexteDeRemplacement = {
  readonly texte: string;
  readonly texteEnregistreDeRemplacement: string;
};

export function sansLePrenom(parole: string, prenom: string): string {
  const prenomEchappe = prenom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return parole
    .replace(new RegExp(`^${prenomEchappe}, (\\p{L})`, "u"), (_, lettre: string) => lettre.toLocaleUpperCase("fr"))
    .replace(new RegExp(`,? ${prenomEchappe}(?=,)`), "")
    .replace(new RegExp(`,? ${prenomEchappe}(?=[ .!?]|$)`), "");
}

export function avecSonTexteDeRemplacement(parole: string, prenom: string): ParoleAvecSonTexteDeRemplacement {
  return { texte: parole, texteEnregistreDeRemplacement: sansLePrenom(parole, prenom) };
}
