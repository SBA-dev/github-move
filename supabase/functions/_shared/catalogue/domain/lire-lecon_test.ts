import { assertEquals, assertThrows } from "@std/assert";
import { lireLecon } from "./lire-lecon.ts";
import { LeconMalFormee } from "./erreurs.ts";
import { uneLeconBrute, uneLeconBruteSans, unExerciceBrut, unGuideBrut } from "../test_utils/lecons-de-test.ts";

Deno.test("une leçon valide est lue avec son identifiant, son titre, sa matière, son niveau et son ordre", () => {
  const lecon = lireLecon(uneLeconBrute());

  assertEquals(
    [lecon.id, lecon.titre, lecon.matiere, lecon.niveau, lecon.ordre],
    ["fr-cp-sons-ou-on-an", "Les sons ou, on, an", "francais", "CP", 5],
  );
});

Deno.test("les étapes de leçon sont lues dans l'ordre, avec leur texte et leurs exemples", () => {
  const lecon = lireLecon(uneLeconBrute());

  assertEquals(lecon.etapes.length, 3);
  assertEquals(lecon.etapes[2], {
    texte: "Écoute bien chaque mot, et cherche le son que tu entends.",
    exemples: ["ou", "on", "an"],
  });
});

Deno.test("les exercices sont lus dans l'ordre de la leçon", () => {
  const lecon = lireLecon(uneLeconBrute());

  assertEquals(lecon.exercices.map((exercice) => exercice.type), ["bulles", "ordre"]);
});

Deno.test("une leçon sans étape de leçon est valide", () => {
  const lecon = lireLecon(uneLeconBrute({ lecon: [] }));

  assertEquals(lecon.etapes, []);
});

Deno.test("une étape de leçon sans exemples est lue avec une liste d'exemples vide", () => {
  const lecon = lireLecon(uneLeconBrute({ lecon: [{ texte: "Un son s'écrit avec une ou deux lettres." }] }));

  assertEquals(lecon.etapes[0].exemples, []);
});

Deno.test("un exercice garde son type, son titre, sa consigne et son contenu brut", () => {
  const brut = unExerciceBrut("ordre", {
    titre: "Remets les sons dans l'ordre",
    consigne: "Touche les sons dans l'ordre.",
    elements: ["ou", "on", "an"],
  });

  const exercice = lireLecon(uneLeconBrute({ exercices: [brut] })).exercices[0];

  assertEquals(exercice.type, "ordre");
  assertEquals(exercice.titre, "Remets les sons dans l'ordre");
  assertEquals(exercice.consigne, "Touche les sons dans l'ordre.");
  assertEquals(exercice.contenu, brut);
});

Deno.test("le titre et la consigne d'un exercice sont facultatifs", () => {
  const brut = { type: "dictee", mots: [{ mot: "loup" }] };

  const exercice = lireLecon(uneLeconBrute({ exercices: [brut] })).exercices[0];

  assertEquals([exercice.titre, exercice.consigne], [undefined, undefined]);
});

Deno.test("le contenu propre à un type n'est pas validé par la lecture de la leçon", () => {
  const lecon = lireLecon(uneLeconBrute({ exercices: [{ type: "bulles" }] }));

  assertEquals(lecon.exercices.length, 1);
});

Deno.test("un exercice de type inconnu est écarté et les autres gardent leur ordre", () => {
  const lecon = lireLecon(uneLeconBrute({
    exercices: [
      unExerciceBrut("bulles"),
      unExerciceBrut("puzzle"),
      unExerciceBrut("ordre"),
      unExerciceBrut("trous"),
    ],
  }));

  assertEquals(lecon.exercices.map((exercice) => exercice.type), ["bulles", "ordre", "trous"]);
});

Deno.test("le programme cité par la leçon est lu avec sa section et sa citation", () => {
  const lecon = lireLecon(uneLeconBrute());

  assertEquals(lecon.programme, {
    section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
    citation: "Décoder et encoder de 25 à 30 CGP.",
  });
});

Deno.test("le guide fondamental facultatif est lu avec son titre, sa page et son extrait", () => {
  const lecon = lireLecon(uneLeconBrute({ guide: unGuideBrut() }));

  assertEquals(lecon.guide?.titre, "Pour enseigner les nombres, le calcul et la résolution de problèmes au CP");
  assertEquals(lecon.guide?.page, 53);
  assertEquals(lecon.guide?.extrait.startsWith("La situation de la boîte"), true);
});

Deno.test("une leçon sans guide fondamental est lue sans guide", () => {
  assertEquals(lireLecon(uneLeconBrute()).guide, undefined);
});

const leconsMalFormees: ReadonlyArray<readonly [string, unknown]> = [
  ["qui n'est pas un objet", null],
  ["sans identifiant", uneLeconBruteSans("id")],
  ["sans titre", uneLeconBruteSans("titre")],
  ["dont le titre n'est pas un texte", uneLeconBrute({ titre: 12 })],
  ["sans matière", uneLeconBruteSans("matiere")],
  ["sans niveau", uneLeconBruteSans("niveau")],
  ["dont le niveau est inconnu", uneLeconBrute({ niveau: "6e" })],
  ["sans ordre", uneLeconBruteSans("ordre")],
  ["dont l'ordre n'est pas un nombre", uneLeconBrute({ ordre: "5" })],
  ["sans liste d'étapes de leçon", uneLeconBruteSans("lecon")],
  ["dont une étape de leçon n'a pas de texte", uneLeconBrute({ lecon: [{ exemples: ["ou"] }] })],
  [
    "dont les exemples d'une étape ne sont pas une liste",
    uneLeconBrute({ lecon: [{ texte: "Un son.", exemples: "ou" }] }),
  ],
  ["sans liste d'exercices", uneLeconBruteSans("exercices")],
  ["sans programme", uneLeconBruteSans("programme")],
  ["dont le programme n'a pas de citation", uneLeconBrute({ programme: { section: "c2-francais-cp" } })],
  ["dont le programme n'a pas de section", uneLeconBrute({ programme: { citation: "Décoder." } })],
  ["dont le guide fondamental n'a pas de page", uneLeconBrute({ guide: { ...unGuideBrut(), page: undefined } })],
];

for (const [description, brute] of leconsMalFormees) {
  Deno.test(`une leçon ${description} est refusée comme mal formée`, () => {
    assertThrows(() => lireLecon(brute), LeconMalFormee);
  });
}
