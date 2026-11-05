import { type EntreesDuParcours, Etoiles, meilleuresEtoilesReunies } from "@domain/apprentissage";
import type { Matiere } from "@domain/catalogue";
import type { MeilleuresEtoilesDuProfil } from "@domain/motivation";
import { niveauDuProfil } from "../../parcours/niveau-du-profil.ts";
import { chargerToutesLesLecons } from "../bibliotheque.ts";
import { lireLEtatDuTestDeDepart } from "../../test-de-depart/etat-du-test-de-depart.ts";
import { etoilesGagneesPendantLUtilisation } from "./etoiles-gagnees-pendant-l-utilisation.ts";

export type Seance = { readonly enfant: string; readonly lecon: string };

/** Le parcours de l'enfant tel qu'il était avant la séance et tel qu'il est après elle, pour la matière de la leçon jouée. */
export type EntreesAvantEtApres = {
  readonly avant: EntreesDuParcours;
  readonly apres: EntreesDuParcours;
  readonly matiere: Matiere;
  readonly niveau: NonNullable<ReturnType<typeof niveauDuProfil>>;
};

function enEtoiles(meilleures: MeilleuresEtoilesDuProfil): ReadonlyMap<string, Etoiles> {
  const etoiles = [...meilleures].flatMap(([lecon, nombre]): [string, Etoiles][] =>
    nombre === 1 || nombre === 2 || nombre === 3 ? [[lecon, Etoiles.de(nombre)]] : []
  );
  return new Map(etoiles);
}

/** `undefined` sans niveau reconnu, sans meilleures étoiles d'avant (lecture impossible) ou sans la leçon dans la bibliothèque. */
export async function entreesAvantEtApresLaSeance(
  { enfant, lecon: leconId }: Seance,
  niveau: string,
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
): Promise<EntreesAvantEtApres | undefined> {
  const niveauDeLEnfant = niveauDuProfil(niveau);
  const [avant, lecons, testDeDepart] = await Promise.all([
    meilleuresAvant,
    chargerToutesLesLecons(),
    lireLEtatDuTestDeDepart(enfant),
  ]);
  const lecon = lecons.find(({ id }) => id === leconId);
  if (!niveauDeLEnfant || !avant || !lecon) return undefined;
  const entrees = { lecons, niveau: niveauDeLEnfant, leconsReussiesAuTestDeDepart: testDeDepart.leconsReussies };
  const etoilesAvant = enEtoiles(avant);
  const etoilesApres = meilleuresEtoilesReunies(etoilesAvant, etoilesGagneesPendantLUtilisation(enfant));
  return {
    avant: { ...entrees, meilleuresEtoiles: etoilesAvant },
    apres: { ...entrees, meilleuresEtoiles: etoilesApres },
    matiere: lecon.matiere,
    niveau: niveauDeLEnfant,
  };
}
