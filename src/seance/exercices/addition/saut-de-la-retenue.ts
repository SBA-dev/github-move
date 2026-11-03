import type { VueAddition, VueColonne } from "@domain/apprentissage";

type Rang = VueColonne["rang"];

/** Pour chaque colonne qui porte une retenue : la colonne dont le chiffre a été écrit pour la poser. */
export type DepartsDesRetenues = Readonly<Partial<Record<Rang, Rang>>>;

/**
 * Compare l'addition avant et après une réponse juste : la retenue qui apparaît vient de la colonne dont le chiffre vient d'être écrit.
 * Le domaine donne les deux faits dans la même réponse ; rien n'est déduit de l'ordre des colonnes.
 */
export function departsDesRetenuesPoseesParLaReponse(avant: VueAddition, apres: VueAddition): DepartsDesRetenues {
  const colonneDuChiffreEcrit = apres.colonnes.find(({ rang, chiffreEcrit }) =>
    chiffreEcrit !== undefined && avant.colonnes.find((colonne) => colonne.rang === rang)?.chiffreEcrit === undefined
  );
  if (colonneDuChiffreEcrit === undefined) return {};
  const arrivees = apres.colonnes.filter(({ rang, retenue }) =>
    retenue !== undefined && avant.colonnes.find((colonne) => colonne.rang === rang)?.retenue === undefined
  );
  return Object.fromEntries(arrivees.map(({ rang }) => [rang, colonneDuChiffreEcrit.rang]));
}
