type IssueDuRecord = "premierRecord" | "nouveauRecord" | "recordInchange" | "aucunRecord";

export type FinDeFluence = { score: number; issue: IssueDuRecord; record?: number };

function calculs(nombre: number): string {
  return `${nombre} ${nombre > 1 ? "calculs" : "calcul"}`;
}

function reussis(nombre: number): string {
  return `${calculs(nombre)} ${nombre > 1 ? "réussis" : "réussi"} !`;
}

function commentaire({ score, issue, record }: FinDeFluence): string {
  switch (issue) {
    case "premierRecord":
      return `Ton premier record : ${calculs(score)} ! Essaie de le battre la prochaine fois.`;
    case "nouveauRecord":
      return `Nouveau record ! ${calculs(score)}, bravo !`;
    case "recordInchange":
      return `${calculs(score)} ! Ton record reste ${record}. Tu y es presque !`;
    case "aucunRecord":
      return "Bien joué !";
  }
}

export function parolesDeFinDeFluence(fin: FinDeFluence): string {
  if (fin.score === 0) return "Pas encore de calcul réussi : on réessaie quand tu veux !";
  return `${reussis(fin.score)} ${commentaire(fin)}`;
}
