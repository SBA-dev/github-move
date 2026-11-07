import { assertEquals } from "@std/assert";
import { matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { Defi, DefiReleve, GrandDefi } from "../../apprentissage/domain/index.ts";
import { saluerSansPrenom } from "./paroles.ts";
import { saluerAvecLaSerieSansPrenom } from "./paroles-de-la-serie.ts";
import { feteDeLaQueteAccomplieSansPrenom, phraseDeFinAvecLaQueteSansPrenom } from "./paroles-de-la-quete.ts";
import { accueillirSurLaPageDeLaLeconSansPrenom, parolesDeFinDeSeanceSansPrenom } from "./paroles-de-seance.ts";
import { parolesDeFinDeRevisionSansPrenom } from "./paroles-de-revision.ts";
import {
  inviterAReleverLeGrandDefiSansPrenom,
  inviterAReleverSansPrenom,
  parolesDeFinDeDefiSansPrenom,
  parolesDeFinDeGrandDefiSansPrenom,
  parolesDeFinDuDefiReleveSansPrenom,
  phraseDeFinAvecLeDefiOuvertSansPrenom,
} from "./paroles-du-defi.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

// Le texte dit est le texte affiché sans le prénom : le prénom de l'enfant et la virgule
// ou l'espace qui l'introduisait disparaissent, la phrase reste correcte (« Trois étoiles, Léa ! » → « Trois étoiles ! »).

const noisette = universDe("animaux").personnageGuide;
const maths = matiereDeCode("maths");
const niveau = Niveau.de("CE1");
const defiNumero2: Defi = { matiere: maths, niveau, numero: 2, lecons: ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"] };
const grandDefiDesMaths: GrandDefi = { matiere: maths, niveau, grandDefi: true, lecons: ["ma-ce1-1", "ma-ce1-2"] };

Deno.test("le salut dit par la voix de l'application est « Bonjour ! », sans le prénom", () => {
  assertEquals(saluerSansPrenom(), "Bonjour !");
});

Deno.test("le salut avec la série dit « Bonjour ! » puis la pastille, sans le prénom", () => {
  const texte = saluerAvecLaSerieSansPrenom({ nombreDeJours: 3, aJoueAujourdhui: true });

  assertEquals(texte, "Bonjour ! 3 jours d'affilée, bravo !");
});

Deno.test("la fête de la quête accomplie dit « Bravo ! » sans le prénom", () => {
  assertEquals(feteDeLaQueteAccomplieSansPrenom(), "Quête du jour accomplie ! Bravo !");
});

Deno.test("la phrase de fin avec la quête accomplie dit la fête sans le prénom, et la phrase seule sinon", () => {
  assertEquals(
    [
      phraseDeFinAvecLaQueteSansPrenom("À demain !", true),
      phraseDeFinAvecLaQueteSansPrenom("À demain !", false),
    ],
    ["À demain ! Quête du jour accomplie ! Bravo !", "À demain !"],
  );
});

Deno.test("l'accueil sur la page de la leçon dit « Coucou ! » sans le prénom", () => {
  assertEquals(
    accueillirSurLaPageDeLaLeconSansPrenom(),
    "Coucou ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu.",
  );
});

Deno.test("avec 3 étoiles, la voix dit « Trois étoiles ! » sans le prénom ni sa virgule", () => {
  const texte = parolesDeFinDeSeanceSansPrenom(3, noisette, hasardFixe(0.99));

  assertEquals(texte, "Trop fort, ça ! Trois étoiles ! Tu es incroyable !");
});

Deno.test("avec 2 étoiles, la voix dit « Tu gagnes 2 étoiles. » sans le prénom ni sa virgule", () => {
  const texte = parolesDeFinDeSeanceSansPrenom(2, noisette, hasardFixe(0.5, 0));

  assertEquals(texte, "Bravo ! Tu gagnes 2 étoiles. Tu rejoues pour aller chercher les autres ?");
});

Deno.test("en fin de révision, la voix dit « Bravo ! » ou « Merci ! » sans le prénom", () => {
  assertEquals(
    [
      parolesDeFinDeRevisionSansPrenom({ questionsJustes: 2 }),
      parolesDeFinDeRevisionSansPrenom({ questionsJustes: 0 }),
    ],
    [
      "Bravo ! 2 erreurs s'effacent un peu plus.",
      "Merci ! Ces erreurs reviendront demain : on les effacera ensemble.",
    ],
  );
});

Deno.test("l'invitation à relever le défi dit « Bravo ! » sans le prénom", () => {
  assertEquals(
    inviterAReleverSansPrenom({ numeroDuDefi: 2 }),
    "Bravo ! Tu as réussi toutes les leçons avant le défi 2. Tu veux le relever ?",
  );
});

Deno.test("l'invitation à relever le grand défi dit « Bravo ! » sans le prénom", () => {
  assertEquals(
    inviterAReleverLeGrandDefiSansPrenom({ matiere: "maths" }),
    "Bravo ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend !",
  );
});

Deno.test("la fin d'un défi relevé dit « Bravo ! » sans le prénom", () => {
  assertEquals(
    parolesDeFinDeDefiSansPrenom({ numeroDuDefi: 2, dejaReleve: true }),
    "Bravo ! Tu as encore relevé le défi 2 !",
  );
});

Deno.test("la fin du grand défi relevé dit « Bravo ! » sans le prénom", () => {
  assertEquals(
    parolesDeFinDeGrandDefiSansPrenom({ matiere: "maths", dejaReleve: false }),
    "Bravo ! Tu as relevé le grand défi des maths !",
  );
});

Deno.test("la phrase de fin propose le défi ouvert, ou le grand défi, sans le prénom", () => {
  assertEquals(
    [
      phraseDeFinAvecLeDefiOuvertSansPrenom("À demain !", defiNumero2),
      phraseDeFinAvecLeDefiOuvertSansPrenom("À demain !", grandDefiDesMaths),
      phraseDeFinAvecLeDefiOuvertSansPrenom("À demain !", undefined),
    ],
    [
      "À demain ! Bravo ! Tu as réussi toutes les leçons avant le défi 2. Tu veux le relever ?",
      "À demain ! Bravo ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend !",
      "À demain !",
    ],
  );
});

Deno.test("la fin d'un défi relevé ou du grand défi relevé dit « Bravo ! » sans le prénom", () => {
  const defiReleve: DefiReleve = { matiere: maths, niveau, numero: 2 };
  const grandDefiReleve: DefiReleve = { matiere: maths, niveau, grandDefi: true };

  assertEquals(
    [
      parolesDeFinDuDefiReleveSansPrenom({ defi: defiReleve, dejaReleve: false }),
      parolesDeFinDuDefiReleveSansPrenom({ defi: grandDefiReleve, dejaReleve: true }),
    ],
    [
      "Bravo ! Tu as relevé le défi 2 !",
      "Bravo ! Tu as encore relevé le grand défi des maths !",
    ],
  );
});
