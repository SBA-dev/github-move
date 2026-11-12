import { assertEquals } from "@std/assert";
import { parolesFixes } from "../../motivation/domain/index.ts";
import { parolesFixesDApprentissage } from "../../apprentissage/domain/index.ts";
import type { RepertoireDesPhrasesEnregistrees } from "../domain/index.ts";
import { lireLecon } from "../../catalogue/domain/index.ts";
import { phrasesAFabriquer } from "./phrases-a-fabriquer.ts";
import { phrasesNonCouvertes } from "./phrases-non-couvertes.ts";
import bibliotheque from "../../../../../app/bibliotheque.json" with { type: "json" };
import repertoire from "../../../../../public/voix/repertoire.json" with { type: "json" };

// Élargir à chaque livraison de niveau (182b à 182e).
const NIVEAUX_FABRIQUES = ["commun", "CP", "CE1", "CE2"];

const NOMBRE_DE_PHRASES_CITEES = 5;

const phrasesDesNiveauxFabriques = () =>
  NIVEAUX_FABRIQUES.flatMap((niveau) =>
    phrasesAFabriquer(bibliotheque.map(lireLecon), [...parolesFixes(), ...parolesFixesDApprentissage()], { niveau })
  );

Deno.test("chaque phrase des niveaux fabriqués a son MP3 au répertoire, à chaque allure", () => {
  const manquantes = phrasesNonCouvertes(phrasesDesNiveauxFabriques(), repertoire as RepertoireDesPhrasesEnregistrees);

  const premieres = manquantes.slice(0, NOMBRE_DE_PHRASES_CITEES).map(({ phrase }) => `« ${phrase} »`);
  assertEquals(
    manquantes.length,
    0,
    `${manquantes.length} phrase(s) sans MP3 au répertoire, dont : ${premieres.join(", ")}`,
  );
});
