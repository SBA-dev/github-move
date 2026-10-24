import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";
import { estUneChanson } from "./memoriser.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "fr-cp-chanson-clair-de-lune",
    matiere: "francais",
    niveau: "CP",
    titre: "Au clair de la lune",
    ordre: 40,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

const auClairDeLaLune = {
  type: "memoriser",
  titre: "Au clair de la lune",
  auteur: "Chanson traditionnelle",
  vers: [
    "Au clair de la lune,",
    "Mon ami Pierrot,",
    "Prête-moi ta plume",
    "Pour écrire un mot.",
  ],
};

function exerciceMemoriser(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "memoriser") throw new Error("exercice « memoriser » attendu");
  return lu;
}

function versNumerotes(nombre: number): string[] {
  return Array.from({ length: nombre }, (_, rang) => `vers ${rang}`);
}

Deno.test("un exercice « memoriser » donne ses vers dans l'ordre et son auteur", () => {
  const exercice = exerciceMemoriser(auClairDeLaLune);

  assertEquals(exercice.vers, auClairDeLaLune.vers);
  assertEquals(exercice.auteur, "Chanson traditionnelle");
});

Deno.test("l'auteur d'un exercice « memoriser » est facultatif", () => {
  const exercice = exerciceMemoriser({ type: "memoriser", vers: ["Un vers,", "Deux vers."] });

  assertEquals(exercice.auteur, undefined);
});

Deno.test("un exercice « memoriser » mal formé rend la leçon mal formée", () => {
  const malFormes = [
    { ...auClairDeLaLune, vers: ["Un seul vers."] },
    { ...auClairDeLaLune, vers: [] },
    { ...auClairDeLaLune, vers: undefined },
    { ...auClairDeLaLune, vers: ["Au clair de la lune,", ""] },
    { ...auClairDeLaLune, vers: ["Au clair de la lune,", 3] },
  ];
  for (const exercice of malFormes) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});

Deno.test("un exercice « memoriser » de 20 vers est accepté", () => {
  const exercice = exerciceMemoriser({ ...auClairDeLaLune, vers: versNumerotes(20) });

  assertEquals(exercice.vers.length, 20);
});

Deno.test("un exercice « memoriser » de 21 vers rend la leçon mal formée", () => {
  const exercice = { ...auClairDeLaLune, vers: versNumerotes(21) };

  assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee);
});

Deno.test("un exercice « memoriser » est une chanson quand « chanson » ou « comptine » figure dans son titre ou son auteur, sans tenir compte des majuscules", () => {
  const chansons = [
    auClairDeLaLune,
    { type: "memoriser", titre: "Comptine du loup", vers: ["Un vers,", "Deux vers."] },
    { type: "memoriser", titre: "Le loup", auteur: "COMPTINE traditionnelle", vers: ["Un vers,", "Deux vers."] },
  ];
  const poemes = [
    {
      type: "memoriser",
      titre: "Le début de la fable",
      auteur: "Jean de La Fontaine",
      vers: ["Un vers,", "Deux vers."],
    },
    { type: "memoriser", vers: ["Un vers,", "Deux vers."] },
  ];

  assertEquals(chansons.map((c) => estUneChanson(exerciceMemoriser(c))), [true, true, true]);
  assertEquals(poemes.map((p) => estUneChanson(exerciceMemoriser(p))), [false, false]);
});
