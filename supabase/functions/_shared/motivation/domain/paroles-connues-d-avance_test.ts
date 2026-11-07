import { assert, assertEquals, assertFalse } from "@std/assert";
import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
import { parolesConnuesDAvance } from "./paroles-connues-d-avance.ts";
import { propositionDeLaQueteDuJour } from "./paroles-de-la-quete.ts";
import { UNIVERS } from "./univers.ts";

// Les paroles connues à l'avance : celles dont toutes les variantes sont finies (nom du personnage guide,
// nombre d'étoiles de 0 à 3, matière…), dans leur texte dit, c'est-à-dire sans le prénom de l'enfant.

const paroles: readonly string[] = parolesConnuesDAvance();
const personnagesGuides = UNIVERS.map((univers) => univers.personnageGuide);

const FELICITATIONS_COMMUNES = [
  "Bravo !",
  "Super !",
  "Ouah, bien joué !",
  "Exactement !",
  "Génial !",
  "Tu gères !",
  "Parfait !",
  "Oui, c'est ça !",
];
const ENCOURAGEMENTS = [
  "Oups, presque !",
  "Hmm, pas tout à fait…",
  "Pas grave, on réessaie !",
  "Ah, celle-là est piégeuse !",
  "Presque ! Regarde bien.",
];
const RELANCES = ["Oui ! Et après ?", "Bien ! Et ensuite ?", "Super ! La suite ?"];
const INVITATIONS_A_JOUER = ["À toi de jouer maintenant !", "C'est parti, à toi !", "Prêt ? On joue !"];

function manquantes(attendues: readonly string[]): string[] {
  return attendues.filter((attendue) => !paroles.includes(attendue));
}

Deno.test("chaque félicitation, commune ou propre à un personnage guide, fait partie des paroles connues à l'avance", () => {
  const expressions = personnagesGuides.flatMap((personnage) => personnage.expressions);

  assertEquals(manquantes([...FELICITATIONS_COMMUNES, ...expressions]), []);
});

Deno.test("chaque encouragement, relance et invitation à jouer fait partie des paroles connues à l'avance", () => {
  assertEquals(manquantes([...ENCOURAGEMENTS, ...RELANCES, ...INVITATIONS_A_JOUER]), []);
});

Deno.test("le salut et l'accueil de la leçon sont connus à l'avance sans le prénom", () => {
  assertEquals(
    manquantes([
      "Bonjour !",
      "Coucou ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu.",
    ]),
    [],
  );
});

Deno.test("la présentation de chaque personnage guide est connue à l'avance", () => {
  const attendues = personnagesGuides.map(({ nom }) => `Je t'entends ! Je suis ${nom}.`);

  assertEquals(manquantes(attendues), []);
  assert(paroles.includes("Je suis Noisette, l'écureuil savant de la Forêt des Savanturiers."));
});

Deno.test("la fin de séance est connue à l'avance pour chaque nombre d'étoiles et chaque personnage guide, sans le prénom", () => {
  const attendues = personnagesGuides.flatMap(({ expressions }) => [
    ...expressions.map((expression) => `${expression} Trois étoiles ! Tu es incroyable !`),
    ...[0, 1, 2].flatMap((etoiles) =>
      expressions.map((expression) =>
        `${expression} Tu gagnes ${etoiles} étoile${
          etoiles > 1 ? "s" : ""
        }. Tu rejoues pour aller chercher les autres ?`
      )
    ),
  ]);
  const communes = FELICITATIONS_COMMUNES.map((felicitation) =>
    `${felicitation} Tu gagnes 1 étoile. Tu rejoues pour aller chercher les autres ?`
  );

  assertEquals(manquantes([...attendues, ...communes]), []);
});

Deno.test("le grand défi est connu à l'avance pour chaque matière, sans le prénom", () => {
  const matieres = [
    { avecArticle: "du français", avecDe: "de français" },
    { avecArticle: "des maths", avecDe: "de maths" },
    { avecArticle: "des sciences", avecDe: "de sciences" },
    { avecArticle: "de l'histoire-géo", avecDe: "d'histoire-géo" },
    { avecArticle: "de l'anglais", avecDe: "d'anglais" },
    { avecArticle: "du vivre ensemble", avecDe: "de vivre ensemble" },
  ];
  assertEquals(matieres.length, toutesLesMatieres().length);

  const attendues = matieres.flatMap(({ avecArticle, avecDe }) => [
    `Bravo ! Tu as réussi toutes les leçons ${avecDe}. Le grand défi t'attend !`,
    `Bravo ! Tu as relevé le grand défi ${avecArticle} !`,
    `Bravo ! Tu as encore relevé le grand défi ${avecArticle} !`,
  ]);

  assertEquals(manquantes(attendues), []);
});

Deno.test("la série n'est connue à l'avance que pour 0 et 1 jour joué", () => {
  assertEquals(
    manquantes([
      "Bonjour ! Une petite leçon pour bien commencer ?",
      "Bonjour ! Tu as joué aujourd'hui !",
      "Bonjour ! Tu as joué hier. Une petite leçon aujourd'hui ?",
    ]),
    [],
  );
});

Deno.test("la fête de la quête accomplie est connue à l'avance sans le prénom", () => {
  assert(paroles.includes("Quête du jour accomplie ! Bravo !"));
});

Deno.test("la proposition de la quête accomplie est connue à l'avance", () => {
  const proposition = propositionDeLaQueteDuJour({ genre: "accomplie", quete: "lecon" });

  assert(proposition !== undefined);
  assert(paroles.includes(proposition));
});

Deno.test("les paroles qui dépendent d'un nombre non borné ne sont pas connues à l'avance", () => {
  const nonBornees = paroles.filter((parole) =>
    /défi \d/.test(parole) || parole.includes("jours d'affilée") || parole.includes("s'effacent") ||
    parole.includes("petites erreurs")
  );

  assertEquals(nonBornees, []);
});

Deno.test("aucune parole connue à l'avance ne contient de prénom ni de reste de gabarit", () => {
  const suspectes = paroles.filter((parole) =>
    parole.includes("{") || parole.includes("}") || parole.includes("undefined") || parole.includes(" ,") ||
    parole.includes(" !  ")
  );

  assertEquals(suspectes, []);
});

Deno.test("aucune parole connue à l'avance n'est vide ni en double", () => {
  assertFalse(paroles.some((parole) => parole.trim() === ""));
  assertEquals(new Set(paroles).size, paroles.length);
});
