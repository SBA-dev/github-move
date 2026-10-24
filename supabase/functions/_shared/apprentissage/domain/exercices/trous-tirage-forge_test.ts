import { assertInstanceOf, assertThrows } from "@std/assert";
import { leconAOuAAccent, leconDeTrousAvecBeaucoupDeCandidats } from "../../test_utils/lecons-de-trous.ts";
import { seanceCommencee } from "../../test_utils/lecons-de-classer-et-ordre.ts";
import type { Lecon } from "../../../catalogue/domain/index.ts";
import { SeanceIncoherente, TirageInvalide } from "../erreurs.ts";
import type { Hasard } from "../hasard.ts";
import { Reponse } from "../reponse.ts";
import { revaliderLaSeance } from "../revalider-la-seance.ts";

const hasardToujoursEnTete: Hasard = { entre0et1: () => 0 };

function revaliderAvecLeTirageDuPremierTrou(lecon: Lecon, motsAttendus: string[], tirage: string[]): void {
  const seance = seanceCommencee(lecon, hasardToujoursEnTete);
  for (const mot of motsAttendus) seance.repondre(Reponse.choix(mot));
  seance.terminer(new Date("2026-10-24T10:30:00Z"));
  const envoi = seance.aEnregistrer();

  revaliderLaSeance(lecon, { ...envoi, tirages: [tirage, ...envoi.tirages.slice(1)] });
}

function assertTirageRefuse(tirage: string[], lecon = leconDeTrousAvecBeaucoupDeCandidats()): void {
  const motsAttendus = lecon.id === "fr-ce1-a-ou-a" ? ["a", "à"] : ["suis", "as", "sommes", "ont"];
  const erreur = assertThrows(
    () => revaliderAvecLeTirageDuPremierTrou(lecon, motsAttendus, tirage),
    SeanceIncoherente,
  );
  assertInstanceOf(erreur.cause, TirageInvalide);
}

Deno.test("le tirage d'un trou avec un mot étranger aux candidats rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "chat", "ont"]);
});

Deno.test("le tirage d'un trou avec un autre mot en double rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "ont", "ont"]);
});

Deno.test("le tirage d'un trou sans le mot attendu rend la séance incohérente", () => {
  assertTirageRefuse(["es", "sont"]);
});

Deno.test("le tirage d'un trou avec le mot attendu en double rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "suis", "ont", "es"]);
});

Deno.test("le tirage d'un trou avec trop d'autres mots rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "es", "sont", "ont"]);
});

Deno.test("le tirage d'un trou avec trop peu d'autres mots rend la séance incohérente", () => {
  assertTirageRefuse(["suis", "ont"]);
});

Deno.test("le tirage d'un trou à un seul candidat sans cet autre mot rend la séance incohérente", () => {
  assertTirageRefuse(["a"], leconAOuAAccent());
});
