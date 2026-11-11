import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { lireLecon } from "../../catalogue/domain/lire-lecon.ts";
import { textesDitsDansLaLecon } from "./textes-dits-dans-la-lecon.ts";

function leconAvec(...exercices: unknown[]) {
  return lireLecon({
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
    exercices,
  });
}

const bullesDuSon = (consigne?: string) => ({
  type: "bulles",
  ...(consigne !== undefined && { consigne }),
  questions: [{ question: "Dans le mot « poule », quel son entends-tu ?", choix: ["ou", "on", "an"], reponse: "ou" }],
});

Deno.test("la consigne d'un exercice fait partie des textes dits dans la leçon", () => {
  const lecon = leconAvec(bullesDuSon("Choisis la bonne bulle."));

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Choisis la bonne bulle."]);
});

Deno.test("la consigne par défaut du type fait partie des textes dits quand l'exercice n'a pas de consigne", () => {
  const lecon = leconAvec({ type: "trous", texte: "Au clair de la [lune]", distracteurs: ["soleil"] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Complète le texte : choisis le mot qui manque."]);
});

Deno.test("la question de chaque exercice fait partie des textes dits dans la leçon", () => {
  const lecon = leconAvec(bullesDuSon());

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Dans le mot « poule », quel son entends-tu ?"]);
});

Deno.test("une dictée est dite comme l'écran la dit : écoute, mot, phrase, puis écris", () => {
  const lecon = leconAvec({ type: "dictee", mots: [{ mot: "chat", phrase: "Le chat dort." }] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Écoute bien. chat. Le chat dort. Écris : chat."]);
});

Deno.test("un calcul à opérations fixes est dit comme l'écran le dit : « Combien font … ? »", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "12 − 5", r: 7 }] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Combien font 12 moins 5 ?"]);
});

Deno.test("un texte dit deux fois dans la leçon n'est rendu qu'une fois", () => {
  const lecon = leconAvec(bullesDuSon("Choisis la bonne bulle."), bullesDuSon("Choisis la bonne bulle."));

  const textes = textesDitsDansLaLecon(lecon);

  assertEquals(textes.filter((texte) => texte === "Choisis la bonne bulle."), ["Choisis la bonne bulle."]);
});

Deno.test("un mot à écouter en anglais n'est pas rendu : seul le français est fabriqué à l'avance", () => {
  const lecon = leconAvec({
    type: "ecoute",
    langue: "en-GB",
    items: [{ dire: "cat", choix: ["chat", "chien"], reponse: "chat" }],
  });

  assertFalse(textesDitsDansLaLecon(lecon).includes("cat"));
});

Deno.test("un calcul tiré au hasard n'est pas rendu : son texte est fabriqué à la volée", () => {
  const lecon = leconAvec({ type: "calcul", generateur: { op: "+", a: [1, 9], b: [1, 9], combien: 3 } });

  assertEquals(textesDitsDansLaLecon(lecon), []);
});
