import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "fr-cp-sons-ou-on-an",
    matiere: "francais",
    niveau: "CP",
    titre: "Les sons ou, on, an",
    ordre: 5,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

const aOuA = {
  type: "trous",
  titre: "a ou à ?",
  consigne: "Choisis « a » ou « à » pour chaque trou.",
  texte: "Lina [a] un chat. Elle va [à] la piscine.",
  distracteurs: ["a", "à"],
};

function exerciceTrous(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "trous") throw new Error("exercice « trous » attendu");
  return lu;
}

Deno.test("un texte à trous est découpé en segments de texte et en trous, dans l'ordre", () => {
  const exercice = exerciceTrous(aOuA);

  assertEquals(exercice.segments, [
    { type: "texte", texte: "Lina " },
    { type: "trou", motAttendu: "a" },
    { type: "texte", texte: " un chat. Elle va " },
    { type: "trou", motAttendu: "à" },
    { type: "texte", texte: " la piscine." },
  ]);
});

Deno.test("un texte à trous donne ses mots attendus et ses distracteurs", () => {
  const exercice = exerciceTrous({ ...aOuA, distracteurs: ["ah"] });

  assertEquals(exercice.motsAttendus, ["a", "à"]);
  assertEquals(exercice.distracteurs, ["ah"]);
});

Deno.test("un texte à trous sans distracteur donne une liste de distracteurs vide", () => {
  const exercice = exerciceTrous({ type: "trous", texte: "Le [chat] et le [chien] dorment." });

  assertEquals(exercice.distracteurs, []);
});

Deno.test("un texte qui commence ou finit par un trou n'a pas de segment de texte vide", () => {
  const exercice = exerciceTrous({ type: "trous", texte: "[Le] chat [dort]", distracteurs: ["la"] });

  assertEquals(exercice.segments, [
    { type: "trou", motAttendu: "Le" },
    { type: "texte", texte: " chat " },
    { type: "trou", motAttendu: "dort" },
  ]);
});

Deno.test("un exercice « trous » sans consigne a la consigne par défaut", () => {
  const exercice = exerciceTrous({ type: "trous", texte: "Au clair de la [lune]", distracteurs: ["soleil"] });

  assertEquals(exercice.consigne, "Complète le texte : choisis le mot qui manque.");
});

Deno.test("« a » et « à » sont deux choix : un trou dont le seul autre mot est écrit avec un accent est bien formé", () => {
  const exercice = exerciceTrous({ type: "trous", texte: "Lina [a] un chat.", distracteurs: ["à"] });

  assertEquals(exercice.motsAttendus, ["a"]);
});

Deno.test("un texte à trous sans trou, avec un trou vide ou des crochets mal fermés rend la leçon mal formée", () => {
  const textes = [
    "Au clair de la lune",
    "Au clair de la [] ",
    "Au clair de la [lune",
    "Au clair de la lune]",
    "Au [clair de la [lune]",
    "",
  ];
  for (const texte of textes) {
    const exercice = { type: "trous", texte, distracteurs: ["soleil"] };
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, texte);
  }
});

Deno.test("un trou qui ne peut proposer qu'un seul choix rend la leçon mal formée", () => {
  const sansAssezDeChoix = [
    { type: "trous", texte: "Au clair de la [lune]" },
    { type: "trous", texte: "Au clair de la [lune]", distracteurs: ["lune"] },
    { type: "trous", texte: "La [lune] et la [lune]", distracteurs: ["lune"] },
  ];
  for (const exercice of sansAssezDeChoix) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});

Deno.test("les autres mots attendus comptent comme choix : deux trous aux mots différents suffisent", () => {
  const exercice = exerciceTrous({ type: "trous", texte: "Le [chat] et le [chien] dorment." });

  assertEquals(exercice.motsAttendus, ["chat", "chien"]);
});
