import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "fr-cp-dictee-animaux",
    matiere: "francais",
    niveau: "CP",
    titre: "J'écris les animaux",
    ordre: 10,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

const leVerbeEtre = {
  type: "conjugaison",
  titre: "Le verbe être",
  verbe: "être",
  temps: "présent",
  formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu", forme: "es" }, { pronom: "il", forme: "est" }],
};

function exerciceConjugaison(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "conjugaison") throw new Error("exercice « conjugaison » attendu");
  return lu;
}

Deno.test("un exercice de conjugaison donne son verbe, son temps et une forme par pronom", () => {
  const exercice = exerciceConjugaison(leVerbeEtre);

  assertEquals(exercice.verbe, "être");
  assertEquals(exercice.temps, "présent");
  assertEquals(exercice.formes, [
    { pronom: "je", forme: "suis" },
    { pronom: "tu", forme: "es" },
    { pronom: "il", forme: "est" },
  ]);
});

Deno.test("un exercice de conjugaison sans distracteurs n'en a aucun", () => {
  assertEquals(exerciceConjugaison(leVerbeEtre).distracteurs, []);
});

Deno.test("un exercice de conjugaison garde ses distracteurs", () => {
  const exercice = exerciceConjugaison({ ...leVerbeEtre, distracteurs: ["étais", "serai"] });

  assertEquals(exercice.distracteurs, ["étais", "serai"]);
});

Deno.test("un exercice de conjugaison garde la consigne de la leçon", () => {
  const exercice = exerciceConjugaison({ ...leVerbeEtre, consigne: "Choisis les formes." });

  assertEquals(exercice.consigne, "Choisis les formes.");
});

Deno.test("un exercice de conjugaison sans consigne a la consigne par défaut, avec son verbe et son temps", () => {
  const exercice = exerciceConjugaison(leVerbeEtre);

  assertEquals(exercice.consigne, "Conjuguons le verbe être au présent. Choisis la bonne forme pour chaque personne.");
});

Deno.test("un exercice de conjugaison mal formé rend la leçon mal formée", () => {
  const malFormes = [
    { ...leVerbeEtre, verbe: "" },
    { ...leVerbeEtre, verbe: undefined },
    { ...leVerbeEtre, temps: "" },
    { ...leVerbeEtre, temps: undefined },
    { ...leVerbeEtre, formes: undefined },
    { ...leVerbeEtre, formes: [] },
    { ...leVerbeEtre, formes: [{ pronom: "je", forme: "suis" }] },
    { ...leVerbeEtre, formes: [{ pronom: "", forme: "suis" }, { pronom: "tu", forme: "es" }] },
    { ...leVerbeEtre, formes: [{ pronom: "je", forme: "" }, { pronom: "tu", forme: "es" }] },
    { ...leVerbeEtre, formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu" }] },
    { ...leVerbeEtre, formes: [{ pronom: "je", forme: "suis" }, "es"] },
    { ...leVerbeEtre, distracteurs: "étais" },
    { ...leVerbeEtre, distracteurs: [3] },
  ];
  for (const exercice of malFormes) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});

Deno.test("une personne qui ne peut proposer qu'une seule forme rend la leçon mal formée", () => {
  const memeFormePartout = {
    ...leVerbeEtre,
    formes: [{ pronom: "je", forme: "mange" }, { pronom: "il", forme: "mange" }],
  };

  assertThrows(() => lireLecon(leconAvec(memeFormePartout)), LeconMalFormee);
});

Deno.test("un distracteur différent permet à chaque personne de proposer deux formes", () => {
  const exercice = exerciceConjugaison({
    ...leVerbeEtre,
    formes: [{ pronom: "je", forme: "mange" }, { pronom: "il", forme: "mange" }],
    distracteurs: ["mangent"],
  });

  assertEquals(exercice.formes.length, 2);
});

Deno.test("un distracteur égal à la forme attendue ne compte pas comme un autre choix", () => {
  const memeFormePartout = {
    ...leVerbeEtre,
    formes: [{ pronom: "je", forme: "mange" }, { pronom: "il", forme: "mange" }],
    distracteurs: ["mange"],
  };

  assertThrows(() => lireLecon(leconAvec(memeFormePartout)), LeconMalFormee);
});
