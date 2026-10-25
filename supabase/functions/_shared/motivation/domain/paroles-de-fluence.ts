export const SIGNAL_DE_DEPART = "C'est parti !";

export type FinDeFluence =
  | { score: number; issue: "premierRecord" | "nouveauRecord" | "aucunRecord" }
  | { score: number; issue: "recordInchange"; record: number };

const ENCOURAGEMENT = "Pas encore de calcul réussi : on réessaie quand tu veux !";

export function secondes(nombre: number): string {
  return `${nombre} seconde${nombre > 1 ? "s" : ""}`;
}

export function calculs(nombre: number): string {
  return `${nombre} ${nombre > 1 ? "calculs" : "calcul"}`;
}

export function calculsReussis(nombre: number): string {
  return `${calculs(nombre)} ${nombre > 1 ? "réussis" : "réussi"}`;
}

/** L'accueil de la fluence : la durée, le record quand on le connaît. */
export function accueilDeLaFluence({ duree, record }: { duree: number; record?: number }): string {
  const rappel = record === undefined ? "" : `Ton record est de ${record}. `;
  return `Calcul rapide ! Tu as ${secondes(duree)} pour réussir le plus de calculs possible. ${rappel}Prêt ?`;
}

function commentaire(fin: FinDeFluence): string {
  switch (fin.issue) {
    case "premierRecord":
      return `Ton premier record : ${calculs(fin.score)} ! Essaie de le battre la prochaine fois.`;
    case "nouveauRecord":
      return `Nouveau record ! ${calculs(fin.score)}, bravo !`;
    case "recordInchange":
      return `${calculs(fin.score)} ! Ton record reste ${fin.record}. Tu y es presque !`;
    case "aucunRecord":
      return ENCOURAGEMENT;
  }
}

export function parolesDeFinDeFluence(fin: FinDeFluence): string {
  if (fin.score === 0 || fin.issue === "aucunRecord") return ENCOURAGEMENT;
  return `${calculsReussis(fin.score)} ! ${commentaire(fin)}`;
}
