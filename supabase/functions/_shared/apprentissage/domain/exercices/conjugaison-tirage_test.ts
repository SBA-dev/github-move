import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import type { Lecon } from "../../../catalogue/domain/index.ts";
import { seanceCommencee } from "../../test_utils/lecons-de-classer-et-ordre.ts";
import {
  leconDeConjugaisonAvecUneFormeRepetee,
  leconDeConjugaisonDuVerbeEtre,
} from "../../test_utils/lecons-de-conjugaison.ts";
import { SeanceIncoherente, TirageInvalide } from "../erreurs.ts";
import type { Hasard } from "../hasard.ts";
import { Reponse } from "../reponse.ts";
import { revaliderLaSeance } from "../revalider-la-seance.ts";

const hasardToujoursEnTete: Hasard = { entre0et1: () => 0 };
const FORMES_DE_L_ETRE = ["suis", "es", "est", "sommes", "êtes", "sont"];
const DATE = new Date("2026-10-24T10:30:00Z");

function enregistrer(lecon: Lecon, formes: string[]) {
  const seance = seanceCommencee(lecon, hasardToujoursEnTete);
  for (const forme of formes) seance.repondre(Reponse.choix(forme));
  seance.terminer(DATE);
  return seance.aEnregistrer();
}

function revaliderAvecLeTirageDeLaPremierePersonne(lecon: Lecon, formes: string[], tirage: string[]) {
  const envoi = enregistrer(lecon, formes);
  return revaliderLaSeance(lecon, { ...envoi, tirages: [tirage, ...envoi.tirages.slice(1)] });
}

function assertTirageRefuse(tirage: string[]): void {
  const erreur = assertThrows(
    () => revaliderAvecLeTirageDeLaPremierePersonne(leconDeConjugaisonDuVerbeEtre(), FORMES_DE_L_ETRE, tirage),
    SeanceIncoherente,
  );
  assertInstanceOf(erreur.cause, TirageInvalide);
}

Deno.test("une conjugaison rejouée avec ses tirages et ses réponses donne la même séance terminée", () => {
  const seance = seanceCommencee(leconDeConjugaisonDuVerbeEtre(), hasardToujoursEnTete);
  const mauvaiseForme = seance.exerciceEnCours()?.questionEnCours()?.choix.textes().find((forme) => forme !== "suis");
  seance.repondre(Reponse.choix(mauvaiseForme ?? ""));
  for (const forme of FORMES_DE_L_ETRE) seance.repondre(Reponse.choix(forme));
  const fait = seance.terminer(DATE);

  assertEquals(revaliderLaSeance(leconDeConjugaisonDuVerbeEtre(), seance.aEnregistrer()), fait);
});

Deno.test("le tirage enregistré d'une personne suffit à la rejouer, sans hasard", () => {
  const fait = revaliderAvecLeTirageDeLaPremierePersonne(leconDeConjugaisonDuVerbeEtre(), FORMES_DE_L_ETRE, [
    "est",
    "suis",
    "sont",
  ]);

  assertEquals(fait.erreurs, 0);
});

Deno.test("le tirage d'une personne avec une forme étrangère aux candidats rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "chante", "est"]);
});

Deno.test("le tirage d'une personne avec une autre forme en double rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "est", "est"]);
});

Deno.test("le tirage d'une personne sans la forme attendue rend la séance incohérente", () => {
  assertTirageRefuse(["es", "sont"]);
});

Deno.test("le tirage d'une personne avec la forme attendue en double rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "suis", "est", "sont"]);
});

Deno.test("le tirage d'une personne avec trop d'autres formes rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "es", "est", "sont"]);
});

Deno.test("le tirage d'une personne avec trop peu d'autres formes rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "est"]);
});

Deno.test("le tirage d'une personne à une seule autre forme possible sans cette forme rend la séance incohérente", () => {
  const lecon = leconDeConjugaisonAvecUneFormeRepetee();
  const envoi = enregistrer(lecon, ["chante", "chantes", "chante"]);

  const erreur = assertThrows(
    () => revaliderLaSeance(lecon, { ...envoi, tirages: [["chante"], ...envoi.tirages.slice(1)] }),
    SeanceIncoherente,
  );
  assertInstanceOf(erreur.cause, TirageInvalide);
});
