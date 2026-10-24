import { assertEquals, assertNotEquals } from "@std/assert";
import { hasardSansMelange } from "../../test_utils/hasard-fixe.ts";
import { leconDeTrousAvecBeaucoupDeCandidats } from "../../test_utils/lecons-de-trous.ts";
import { seanceCommencee } from "../../test_utils/lecons-de-classer-et-ordre.ts";
import type { Hasard } from "../hasard.ts";
import { Reponse } from "../reponse.ts";
import { revaliderLaSeance } from "../revalider-la-seance.ts";

const hasardToujoursEnTete: Hasard = { entre0et1: () => 0 };

function choixDuPremierTrou(hasard: Hasard): string[] {
  const seance = seanceCommencee(leconDeTrousAvecBeaucoupDeCandidats(), hasard);
  return seance.exerciceEnCours()?.questionEnCours()?.choix.textes().sort() ?? [];
}

Deno.test("les deux autres mots d'un trou sont tirés par le hasard parmi les candidats", () => {
  const avecUnHasard = choixDuPremierTrou(hasardSansMelange());
  const avecUnAutreHasard = choixDuPremierTrou(hasardToujoursEnTete);

  assertNotEquals(avecUnHasard, avecUnAutreHasard);
});

Deno.test("le tirage enregistré d'un trou suffit à le rejouer, sans hasard", () => {
  const seance = seanceCommencee(leconDeTrousAvecBeaucoupDeCandidats(), hasardToujoursEnTete);
  for (const mot of ["suis", "as", "sommes", "ont"]) seance.repondre(Reponse.choix(mot));
  seance.terminer(new Date("2026-10-24T10:30:00Z"));
  const envoi = seance.aEnregistrer();
  const tirageDuPremierTrou = ["avons", "suis", "ont"];

  const fait = revaliderLaSeance(leconDeTrousAvecBeaucoupDeCandidats(), {
    ...envoi,
    tirages: [tirageDuPremierTrou, ...envoi.tirages.slice(1)],
  });

  assertEquals(fait.erreurs, 0);
});
