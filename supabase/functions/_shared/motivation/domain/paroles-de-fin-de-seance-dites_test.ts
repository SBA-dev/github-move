import { assertEquals, assertFalse } from "@std/assert";
import { matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { Defi } from "../../apprentissage/domain/index.ts";
import type { Hasard } from "./hasard.ts";
import { HISTOIRE_DES_SAVANTURIERS } from "./histoire.ts";
import { parolesDeFinDeSeanceAvecTexteDit } from "./paroles-de-fin-de-seance-dites.ts";
import { phraseDeFinAvecLaQuete, phraseDeFinAvecLaQueteSansPrenom } from "./paroles-de-la-quete.ts";
import { phraseDeFinAvecLesNouveautes } from "./paroles-des-badges.ts";
import { parolesDeFinDeSeance, parolesDeFinDeSeanceSansPrenom } from "./paroles-de-seance.ts";
import { phraseDeFinAvecLeDefiOuvert, phraseDeFinAvecLeDefiOuvertSansPrenom } from "./paroles-du-defi.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

// Le texte dit est la même parole que le texte affiché, sans le prénom, avec la même félicitation :
// Motivation la compose d'un seul tirage du hasard.

const noisette = universDe("animaux").personnageGuide;
const premierEpisode = HISTOIRE_DES_SAVANTURIERS[0];
const defiNumero2: Defi = {
  matiere: matiereDeCode("maths"),
  niveau: Niveau.de("CE1"),
  numero: 2,
  lecons: ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"],
};

function hasardCompteur(valeur: number): Hasard & { readonly appels: () => number } {
  let appels = 0;
  return {
    entre0et1() {
      appels += 1;
      return valeur;
    },
    appels: () => appels,
  };
}

function tiragesPour(etoiles: number): number[] {
  return etoiles === 3 ? [0.99] : [0.5, 0];
}

Deno.test("avec 1 étoile, la fin de séance affiche la parole avec le prénom et dit la même sans « Léa »", () => {
  const { texte, texteDit } = parolesDeFinDeSeanceAvecTexteDit({
    etoiles: 1,
    prenom: "Léa",
    personnageGuide: noisette,
    hasard: hasardFixe(...tiragesPour(1)),
  });

  assertEquals(
    [texte, texteDit],
    [
      parolesDeFinDeSeance(1, "Léa", noisette, hasardFixe(...tiragesPour(1))),
      parolesDeFinDeSeanceSansPrenom(1, noisette, hasardFixe(...tiragesPour(1))),
    ],
  );
  assertFalse(texteDit.includes("Léa"));
});

Deno.test("avec 2 étoiles, la fin de séance affiche la parole avec le prénom et dit la même sans « Léa »", () => {
  const { texte, texteDit } = parolesDeFinDeSeanceAvecTexteDit({
    etoiles: 2,
    prenom: "Léa",
    personnageGuide: noisette,
    hasard: hasardFixe(...tiragesPour(2)),
  });

  assertEquals(
    [texte, texteDit],
    [
      parolesDeFinDeSeance(2, "Léa", noisette, hasardFixe(...tiragesPour(2))),
      parolesDeFinDeSeanceSansPrenom(2, noisette, hasardFixe(...tiragesPour(2))),
    ],
  );
  assertFalse(texteDit.includes("Léa"));
});

Deno.test("avec 3 étoiles, la fin de séance affiche la parole avec le prénom et dit la même sans « Léa »", () => {
  const { texte, texteDit } = parolesDeFinDeSeanceAvecTexteDit({
    etoiles: 3,
    prenom: "Léa",
    personnageGuide: noisette,
    hasard: hasardFixe(...tiragesPour(3)),
  });

  assertEquals(
    [texte, texteDit],
    [
      parolesDeFinDeSeance(3, "Léa", noisette, hasardFixe(...tiragesPour(3))),
      parolesDeFinDeSeanceSansPrenom(3, noisette, hasardFixe(...tiragesPour(3))),
    ],
  );
  assertFalse(texteDit.includes("Léa"));
});

Deno.test("quand la séance accomplit la quête et ouvre un épisode, la parole dite reprend les nouveautés sans le prénom", () => {
  const nouveautes = { episode: premierEpisode };
  const { texte, texteDit } = parolesDeFinDeSeanceAvecTexteDit({
    etoiles: 2,
    prenom: "Léa",
    personnageGuide: noisette,
    hasard: hasardFixe(...tiragesPour(2)),
    nouveautes,
    queteAccomplie: true,
  });

  const attendu = phraseDeFinAvecLaQuete(
    phraseDeFinAvecLesNouveautes(parolesDeFinDeSeance(2, "Léa", noisette, hasardFixe(...tiragesPour(2))), nouveautes),
    "Léa",
    true,
  );
  const attenduDit = phraseDeFinAvecLaQueteSansPrenom(
    phraseDeFinAvecLesNouveautes(
      parolesDeFinDeSeanceSansPrenom(2, noisette, hasardFixe(...tiragesPour(2))),
      nouveautes,
    ),
    true,
  );
  assertEquals([texte, texteDit], [attendu, attenduDit]);
  assertFalse(texteDit.includes("Léa"));
});

Deno.test("quand la séance ouvre un défi, la parole dite le propose sans le prénom", () => {
  const { texte, texteDit } = parolesDeFinDeSeanceAvecTexteDit({
    etoiles: 3,
    prenom: "Léa",
    personnageGuide: noisette,
    hasard: hasardFixe(...tiragesPour(3)),
    defiOuvert: defiNumero2,
  });

  assertEquals(
    [texte, texteDit],
    [
      phraseDeFinAvecLeDefiOuvert(
        parolesDeFinDeSeance(3, "Léa", noisette, hasardFixe(...tiragesPour(3))),
        "Léa",
        defiNumero2,
      ),
      phraseDeFinAvecLeDefiOuvertSansPrenom(
        parolesDeFinDeSeanceSansPrenom(3, noisette, hasardFixe(...tiragesPour(3))),
        defiNumero2,
      ),
    ],
  );
  assertFalse(texteDit.includes("Léa"));
});

Deno.test("la fin de séance et son texte dit ne tirent au hasard qu'une seule fois la félicitation", () => {
  const pourUneSeuleComposition = hasardCompteur(0.5);
  parolesDeFinDeSeance(2, "Léa", noisette, pourUneSeuleComposition);

  const hasard = hasardCompteur(0.5);
  parolesDeFinDeSeanceAvecTexteDit({ etoiles: 2, prenom: "Léa", personnageGuide: noisette, hasard });

  assertEquals(hasard.appels(), pourUneSeuleComposition.appels());
});
