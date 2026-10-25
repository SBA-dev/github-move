import { assertEquals, assertThrows } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import type { ExerciceMemoriser } from "../../catalogue/domain/exercices/memoriser.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { ExerciceJoue } from "./exercice-joue.ts";
import { ReponseIncompatible } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { type Tireur, tireurAuHasard } from "./tireur.ts";

const NIVEAU = Niveau.de("CE1");

function poesie(titre: string, vers: readonly string[]): ExerciceMemoriser {
  return { type: "memoriser", titre, vers };
}

const versDuClair = ["Au clair de la lune,", "Mon ami Pierrot,", "Ma chandelle est morte,"];
const auClairDeLaLune = poesie("Au clair de la lune", versDuClair);

function tireurQuiRetourneLesVers(): Tireur {
  return {
    ...tireurAuHasard(hasardSansMelange()),
    etiquettesMelangees: (etiquettes) => [...etiquettes].reverse(),
  };
}

function jouer(exercice: ExerciceMemoriser): ExerciceJoue {
  return ExerciceJoue.depuis(0, exercice, tireurAuHasard(hasardSansMelange()), NIVEAU);
}

function placerLesVers(exerciceJoue: ExerciceJoue, vers: readonly string[]): void {
  vers.forEach((unVers) => exerciceJoue.repondre(Reponse.placement(unVers)));
}

Deno.test("la poésie commence par l'entraînement de l'ordre des vers", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  assertEquals(exerciceJoue.entrainementDeMemorisation(), "ordreDesVers");
});

Deno.test("au début, les vers à placer sont mélangés par le tireur et aucun mot n'est encore caché", () => {
  const exerciceJoue = ExerciceJoue.depuis(0, auClairDeLaLune, tireurQuiRetourneLesVers(), NIVEAU);

  assertEquals(exerciceJoue.etiquettesAPlacer(), [
    "Ma chandelle est morte,",
    "Mon ami Pierrot,",
    "Au clair de la lune,",
  ]);
  assertEquals(exerciceJoue.questionEnCours(), undefined);
  assertEquals(exerciceJoue.texteATrous(), []);
});

Deno.test("chaque vers placé dans l'ordre est une question réussie", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  placerLesVers(exerciceJoue, versDuClair.slice(0, 2));

  assertEquals(exerciceJoue.questionsReussies, 2);
});

Deno.test("un vers placé trop tôt est faux et l'aide redit que ce n'est pas le début", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  const resultat = exerciceJoue.repondre(Reponse.placement("Mon ami Pierrot,"));

  assertEquals(resultat, "fausse");
  assertEquals(exerciceJoue.aideApresLaDerniereErreur(), "Ce n'est pas le début. Lequel vient en premier ?");
});

Deno.test("deux vers identiques sont interchangeables", () => {
  const vers = ["Une poule sur un mur", "Qui picore du pain dur", "Picoti, picota", "Picoti, picota"];
  const exerciceJoue = jouer(poesie("Une poule sur un mur", vers));

  placerLesVers(exerciceJoue, vers);

  assertEquals(exerciceJoue.questionsReussies, 4);
});

Deno.test("une fois les vers placés, il ne reste aucun vers à placer", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  placerLesVers(exerciceJoue, versDuClair);

  assertEquals(exerciceJoue.etiquettesAPlacer(), []);
  assertEquals(exerciceJoue.entrainementDeMemorisation(), "motsCaches");
});

Deno.test("les mots cachés commencent par le premier : la réponse et deux autres mots cachés au choix", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  placerLesVers(exerciceJoue, versDuClair);

  const question = exerciceJoue.questionEnCours();
  assertEquals(question?.choix.textes().toSorted(), ["Pierrot", "chandelle", "clair"]);
});

Deno.test("les mots cachés se lisent dans les vers joints par « / », les trous encore vides", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  placerLesVers(exerciceJoue, versDuClair);

  assertEquals(exerciceJoue.texteATrous(), [
    { type: "texte", texte: "Au " },
    { type: "trou", mot: undefined },
    { type: "texte", texte: " de la lune, / Mon ami " },
    { type: "trou", mot: undefined },
    { type: "texte", texte: ", / Ma " },
    { type: "trou", mot: undefined },
    { type: "texte", texte: " est morte," },
  ]);
});

Deno.test("un vers sans mot caché compte réussi dès que les mots cachés commencent", () => {
  const vers = ["Le chat dort.", "Il a vu.", "La souris file."];
  const exerciceJoue = jouer(poesie("Sans titre", vers));

  placerLesVers(exerciceJoue, vers);

  assertEquals(exerciceJoue.questions, 6);
  assertEquals(exerciceJoue.questionsReussies, 4);
});

Deno.test("retrouver tous les mots cachés après avoir remis les vers dans l'ordre réussit l'exercice", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);

  ["clair", "Pierrot", "chandelle"].forEach((mot) => exerciceJoue.repondre(Reponse.choix(mot)));

  assertEquals(exerciceJoue.estReussi(), true);
  assertEquals(exerciceJoue.questionsReussies, exerciceJoue.questions);
});

Deno.test("les questions jouées comptent les vers placés et les mots cachés", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);

  assertEquals(exerciceJoue.questionsJouees().length, 6);
});

Deno.test("une erreur en plaçant les vers fait partie des questions ratées", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  exerciceJoue.repondre(Reponse.placement("Mon ami Pierrot,"));
  placerLesVers(exerciceJoue, versDuClair);

  assertEquals(exerciceJoue.questionsRatees().length, 1);
});

Deno.test("une erreur sur un mot caché fait partie des questions ratées", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);
  exerciceJoue.repondre(Reponse.choix("Pierrot"));

  assertEquals(exerciceJoue.questionsRatees().length, 1);
});

Deno.test("« Je ne sais pas » pendant l'ordre des vers fait briller le vers qui vient ensuite", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  exerciceJoue.repondre(Reponse.placement("Au clair de la lune,"));

  assertEquals(exerciceJoue.direJeNeSaisPas(), {
    aide: undefined,
    bonneReponse: "Mon ami Pierrot,",
    maniere: "briller",
  });
});

Deno.test("« Je ne sais pas » pendant les mots cachés fait briller le mot à retrouver", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);

  assertEquals(exerciceJoue.direJeNeSaisPas(), { aide: undefined, bonneReponse: "clair", maniere: "briller" });
});

Deno.test("pendant l'ordre des vers, les vers déjà posés se lisent dans l'ordre", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  placerLesVers(exerciceJoue, versDuClair.slice(0, 2));

  assertEquals(exerciceJoue.etiquettesPosees(), [{ texte: "Au clair de la lune," }, { texte: "Mon ami Pierrot," }]);
});

Deno.test("les tirages d'une poésie sont les vers mélangés, puis les choix proposés de chaque mot caché dans l'ordre des vers", () => {
  const exerciceJoue = ExerciceJoue.depuis(0, auClairDeLaLune, tireurQuiRetourneLesVers(), NIVEAU);

  const [vers, ...choixDesMotsCaches] = exerciceJoue.tirages();

  assertEquals(vers, ["Ma chandelle est morte,", "Mon ami Pierrot,", "Au clair de la lune,"]);
  assertEquals(choixDesMotsCaches.map((choix) => choix.toSorted()), [
    ["Pierrot", "chandelle", "clair"],
    ["Pierrot", "chandelle", "clair"],
    ["Pierrot", "chandelle", "clair"],
  ]);
});

Deno.test("dans une poésie à refrain, chaque mot caché offre trois choix", () => {
  const vers = ["Picoti, picota", "Picoti, picota", "Le chat dort."];
  const exerciceJoue = jouer(poesie("Refrain", vers));
  placerLesVers(exerciceJoue, vers);

  const [, ...choixDesMotsCaches] = exerciceJoue.tirages();

  assertEquals(choixDesMotsCaches.map((choix) => choix.length), [3, 3, 3]);
});

Deno.test("pendant l'ordre des vers, une relance est due après un vers bien posé et une félicitation après le dernier", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  exerciceJoue.repondre(Reponse.placement(versDuClair[0]));
  assertEquals(exerciceJoue.paroleDueApresLaDerniereReponse(), "relance");

  exerciceJoue.repondre(Reponse.placement(versDuClair[1]));
  exerciceJoue.repondre(Reponse.placement(versDuClair[2]));
  assertEquals(exerciceJoue.paroleDueApresLaDerniereReponse(), "felicitation");
});

Deno.test("pendant l'ordre des vers, aucune parole n'est due après un vers mal posé", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  exerciceJoue.repondre(Reponse.placement(versDuClair[1]));

  assertEquals(exerciceJoue.paroleDueApresLaDerniereReponse(), undefined);
});

Deno.test("pendant les mots cachés, une félicitation est due après un bon mot et aucune parole après une erreur", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);

  exerciceJoue.repondre(Reponse.choix("Pierrot"));
  assertEquals(exerciceJoue.paroleDueApresLaDerniereReponse(), undefined);

  exerciceJoue.repondre(Reponse.choix("clair"));
  assertEquals(exerciceJoue.paroleDueApresLaDerniereReponse(), "felicitation");
});

Deno.test("le bon mot caché qui n'est pas le dernier ne complète pas le texte", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);

  exerciceJoue.repondre(Reponse.choix("clair"));

  assertEquals(exerciceJoue.texteCompleteParLaDerniereReponse(), false);
});

Deno.test("le bon mot caché du dernier vers complète le texte", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);
  ["clair", "Pierrot"].forEach((mot) => exerciceJoue.repondre(Reponse.choix(mot)));

  exerciceJoue.repondre(Reponse.choix("chandelle"));

  assertEquals(exerciceJoue.texteCompleteParLaDerniereReponse(), true);
});

Deno.test("une réponse écrite à une poésie est incompatible", () => {
  const exerciceJoue = jouer(auClairDeLaLune);

  assertThrows(() => exerciceJoue.repondre(Reponse.motEcrit(["c", "l", "a", "i", "r"])), ReponseIncompatible);
});

Deno.test("l'énoncé d'un mot caché est le vers qui contient le trou, sans séparateur", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  placerLesVers(exerciceJoue, versDuClair);
  exerciceJoue.repondre(Reponse.choix("clair"));
  assertEquals(exerciceJoue.questionEnCours()?.enonce, "Mon ami …,");

  exerciceJoue.repondre(Reponse.choix("Pierrot"));
  assertEquals(exerciceJoue.questionEnCours()?.enonce, "Ma … est morte,");
});

Deno.test("les erreurs sur les vers et sur les mots cachés d'une poésie ne sont jamais retenues", () => {
  const exerciceJoue = jouer(auClairDeLaLune);
  exerciceJoue.repondre(Reponse.placement("Mon ami Pierrot,"));
  placerLesVers(exerciceJoue, versDuClair);
  exerciceJoue.repondre(Reponse.choix("Pierrot"));

  assertEquals(exerciceJoue.questionsRatees().length, 2);
  assertEquals(exerciceJoue.questionsRateesARetenir(), []);
});
