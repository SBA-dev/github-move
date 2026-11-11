import { motsDitsLentementDansLaLecon, textesDitsDansLaLecon } from "../../apprentissage/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Niveau } from "../../catalogue/domain/index.ts";
import { phrasesAvecCle } from "../domain/index.ts";

export const NIVEAU_DES_PAROLES_FIXES = "commun";

export type PhraseAFabriquer = {
  readonly cle: string;
  readonly phrase: string;
  readonly niveau: string;
  readonly lecons: readonly string[];
  readonly allures?: readonly ["normale", "lente"];
};

type PhraseEnCours =
  & {
    -readonly [Champ in keyof PhraseAFabriquer]: PhraseAFabriquer[Champ];
  }
  & { lecons: string[] };

type Options = { readonly niveau?: string };

function estPlusBas(niveau: string, reference: string): boolean {
  if (reference === NIVEAU_DES_PAROLES_FIXES || niveau === NIVEAU_DES_PAROLES_FIXES) return false;
  return Niveau.de(reference).estAuDessusDe(Niveau.de(niveau));
}

export function phrasesAFabriquer(
  lecons: readonly Lecon[],
  paroles: readonly string[],
  options: Options = {},
): PhraseAFabriquer[] {
  const parCle = new Map<string, PhraseEnCours>();

  const ajouter = (brut: string, niveau: string, idDeLecon?: string, lente = false) => {
    for (const { cle, texte } of phrasesAvecCle(brut)) {
      const entree = parCle.get(cle) ?? { cle, phrase: texte, niveau, lecons: [] };
      if (estPlusBas(niveau, entree.niveau)) entree.niveau = niveau;
      if (lente) entree.allures = ["normale", "lente"];
      if (idDeLecon !== undefined && !entree.lecons.includes(idDeLecon)) entree.lecons.push(idDeLecon);
      parCle.set(cle, entree);
    }
  };

  for (const lecon of lecons) {
    for (const texte of textesDitsDansLaLecon(lecon)) ajouter(texte, lecon.niveau.valeur, lecon.id);
    for (const mot of motsDitsLentementDansLaLecon(lecon)) ajouter(mot, lecon.niveau.valeur, lecon.id, true);
  }
  for (const parole of paroles) ajouter(parole, NIVEAU_DES_PAROLES_FIXES);

  return [...parCle.values()]
    .map((entree) => ({ ...entree, lecons: entree.lecons.toSorted() }))
    .filter(({ niveau }) =>
      options.niveau === undefined || niveau === options.niveau || niveau === NIVEAU_DES_PAROLES_FIXES
    )
    .sort((a, b) => a.cle < b.cle ? -1 : a.cle > b.cle ? 1 : 0);
}
