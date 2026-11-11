import { assertArrayIncludes, assertEquals, assertFalse } from "@std/assert";
import { lireLecon } from "../../catalogue/domain/lire-lecon.ts";
import { textesDitsDansLaLecon } from "./textes-dits-dans-la-lecon.ts";

function leconAvec(...exercices: unknown[]) {
  return uneLecon([], ...exercices);
}

function uneLecon(etapes: unknown[], ...exercices: unknown[]) {
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
    lecon: etapes,
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

Deno.test("l'indication du geste d'un exercice à ranger fait partie des textes dits", () => {
  const lecon = leconAvec({ type: "ordre", consigne: "Mets dans l'ordre.", elements: ["un", "deux"] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Touche d'abord celle qui vient en premier."]);
});

Deno.test("la question d'une écoute est dite en français, avec sa valeur par défaut quand l'item n'en a pas", () => {
  const lecon = leconAvec({
    type: "ecoute",
    langue: "en-GB",
    items: [{ dire: "cat", choix: ["chat", "chien"], reponse: "chat" }],
  });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Écoute bien ! Que veut dire ce mot ?"]);
});

Deno.test("la phrase de chaque trou d'un texte à trous est dite avec le mot manquant remplacé par « … »", () => {
  const lecon = leconAvec({ type: "trous", texte: "Le chat dort. Le chien [mange] sa soupe.", distracteurs: ["boit"] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Le chien … sa soupe."]);
});

Deno.test("chaque personne d'une conjugaison est dite : « je … ? »", () => {
  const lecon = leconAvec({
    type: "conjugaison",
    verbe: "chanter",
    temps: "présent",
    formes: [{ pronom: "je", forme: "chante" }, { pronom: "tu", forme: "chantes" }],
  });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["je … ?", "tu … ?"]);
});

Deno.test("une étape de la leçon est dite comme l'écran la dit : son texte, puis ses exemples", () => {
  const lecon = uneLecon([{ texte: "Écoute bien chaque mot.", exemples: ["ou", "on", "an"] }], bullesDuSon());

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Écoute bien chaque mot. ou. on. an"]);
});

Deno.test("chaque vers d'une poésie à mémoriser est dit", () => {
  const lecon = leconAvec({ type: "memoriser", titre: "Poème", vers: ["Un petit chat dort", "Sur le tapis rouge"] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Un petit chat dort", "Sur le tapis rouge"]);
});

Deno.test("le texte d'un exercice de lecture est dit en entier", () => {
  const lecon = leconAvec({
    type: "lecture",
    titre: "Le loup",
    texte: "Le loup dort. La poule picore.",
    questions: [{ question: "Qui dort ?", choix: ["le loup", "la poule"], reponse: "le loup" }],
  });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Le loup dort. La poule picore."]);
});

Deno.test("la lecture des choix n'est pas rendue : leur ordre est tiré au hasard, elle reste au repli", () => {
  const lecon = leconAvec(bullesDuSon());

  assertFalse(textesDitsDansLaLecon(lecon).some((texte) => texte.startsWith("Est-ce ")));
});

Deno.test("l'aide d'une question à choix, dite après une erreur, fait partie des textes dits", () => {
  const lecon = leconAvec({
    type: "bulles",
    questions: [{
      question: "Dans le mot « poule », quel son entends-tu ?",
      choix: ["ou", "on", "an"],
      reponse: "ou",
      aide: "Dis le mot doucement.",
    }],
  });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Dis le mot doucement."]);
});

Deno.test("l'aide par défaut des bulles est dite quand la question n'a pas d'aide", () => {
  const lecon = leconAvec(bullesDuSon());

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Essaie une autre bulle."]);
});

Deno.test("l'aide par défaut d'une écoute est dite quand l'item n'a pas d'aide", () => {
  const lecon = leconAvec({
    type: "ecoute",
    langue: "en-GB",
    items: [{ dire: "cat", choix: ["chat", "chien"], reponse: "chat" }],
  });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Écoute encore."]);
});

Deno.test("l'aide par défaut d'un texte à trous est dite", () => {
  const lecon = leconAvec({ type: "trous", texte: "Au clair de la [lune]", distracteurs: ["soleil"] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Relis la phrase en entier : quel mot va bien ?"]);
});

Deno.test("l'aide de chaque personne d'une conjugaison est dite : « Avec « je », quelle forme va ? »", () => {
  const lecon = leconAvec({
    type: "conjugaison",
    verbe: "chanter",
    temps: "présent",
    formes: [{ pronom: "je", forme: "chante" }],
  });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Avec « je », quelle forme va ?"]);
});

Deno.test("la félicitation d'une écoute est dite : « c'est » suivi de la réponse", () => {
  const lecon = leconAvec({
    type: "ecoute",
    langue: "en-GB",
    items: [{ dire: "cat", choix: ["chat", "chien"], reponse: "chat" }],
  });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["c'est chat."]);
});

Deno.test("la félicitation d'un mot de dictée est dite : « mot » est bien écrit", () => {
  const lecon = leconAvec({ type: "dictee", mots: [{ mot: "chat", phrase: "Le chat dort." }] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["« chat » est bien écrit !"]);
});

Deno.test("l'aide après une erreur de dictée est dite", () => {
  const lecon = leconAvec({ type: "dictee", mots: [{ mot: "chat", phrase: "Le chat dort." }] });

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Regarde les lettres en rouge et écoute encore."]);
});

const poesieDuChat = { type: "memoriser", titre: "Poème", vers: ["Un petit chat dort", "Sur le tapis rouge"] };

Deno.test("l'annonce de l'écoute d'une poésie est dite", () => {
  const lecon = leconAvec(poesieDuChat);

  assertArrayIncludes(textesDitsDansLaLecon(lecon), [
    "Écoute bien, je te le dis vers par vers. Ensuite, à toi de le redire !",
  ]);
});

Deno.test("l'invitation à redire la poésie après le dernier vers est dite", () => {
  const lecon = leconAvec(poesieDuChat);

  assertArrayIncludes(textesDitsDansLaLecon(lecon), [
    "À toi ! Redis tout le texte, tranquillement. Quand c'est bon, on joue !",
  ]);
});

Deno.test("la consigne de remettre les vers dans l'ordre est dite pour une poésie", () => {
  const lecon = leconAvec(poesieDuChat);

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Remets les vers dans l'ordre."]);
});

Deno.test("la consigne des mots cachés est dite pour une poésie", () => {
  const lecon = leconAvec(poesieDuChat);

  assertArrayIncludes(textesDitsDansLaLecon(lecon), ["Des mots se sont envolés ! Retrouve-les."]);
});
