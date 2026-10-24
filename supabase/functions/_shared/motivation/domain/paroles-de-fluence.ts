type IssueDuRecord = "premierRecord" | "nouveauRecord" | "recordInchange" | "aucunRecord";

export type FinDeFluence = { score: number; issue: IssueDuRecord; record?: number };

const ENCOURAGEMENT = "Pas encore de calcul réussi : on réessaie quand tu veux !";

function calculs(nombre: number): string {
  return `${nombre} ${nombre > 1 ? "calculs" : "calcul"}`;
}

function reussis(nombre: number): string {
  return `${calculs(nombre)} ${nombre > 1 ? "réussis" : "réussi"} !`;
}

type FinAvecRecord = FinDeFluence & { issue: Exclude<IssueDuRecord, "aucunRecord"> };

function commentaire({ score, issue, record }: FinAvecRecord): string {
  switch (issue) {
    case "premierRecord":
      return `Ton premier record : ${calculs(score)} ! Essaie de le battre la prochaine fois.`;
    case "nouveauRecord":
      return `Nouveau record ! ${calculs(score)}, bravo !`;
    case "recordInchange":
      return `${calculs(score)} ! Ton record reste ${record}. Tu y es presque !`;
  }
}

export function parolesDeFinDeFluence(fin: FinDeFluence): string {
  if (fin.score === 0 || fin.issue === "aucunRecord") return ENCOURAGEMENT;
  return `${reussis(fin.score)} ${commentaire(fin as FinAvecRecord)}`;
}
