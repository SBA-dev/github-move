import { assertEquals } from "@std/assert";
import {
  leconDeClasserAvecDeuxEtiquettesIdentiques,
  leconDeClasserLesSons,
  leconDOrdreDuMot,
  seanceCommencee,
} from "../test_utils/lecons-de-classer-et-ordre.ts";
import type { ExerciceJoue } from "./exercice-joue.ts";
import { Reponse } from "./reponse.ts";

function exerciceEnCours(seance: ReturnType<typeof seanceCommencee>): ExerciceJoue {
  const exercice = seance.exerciceEnCours();
  if (!exercice) throw new Error("Aucun exercice en cours");
  return exercice;
}

Deno.test("un classer sans étiquette posée n'a rien dans ses maisons", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  assertEquals(exerciceEnCours(seance).etiquettesPosees(), []);
});

Deno.test("les étiquettes bien posées d'un classer sont rendues avec leur groupe, dans l'ordre de pose", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("savon", "g-on"));
  seance.repondre(Reponse.placement("loup", "g-ou"));

  assertEquals(exerciceEnCours(seance).etiquettesPosees(), [
    { texte: "savon", groupe: "g-on" },
    { texte: "loup", groupe: "g-ou" },
  ]);
});

Deno.test("une étiquette posée dans le mauvais groupe n'est pas rendue comme posée", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-on"));

  assertEquals(exerciceEnCours(seance).etiquettesPosees(), []);
});

Deno.test("deux étiquettes de même texte posées dans deux groupes sont toutes deux rendues", () => {
  const seance = seanceCommencee(leconDeClasserAvecDeuxEtiquettesIdentiques());
  seance.repondre(Reponse.placement("a", "g-mot"));
  seance.repondre(Reponse.placement("a", "g-lettre"));

  assertEquals(exerciceEnCours(seance).etiquettesPosees(), [
    { texte: "a", groupe: "g-mot" },
    { texte: "a", groupe: "g-lettre" },
  ]);
});

Deno.test("les étiquettes bien posées d'un ordre sont rendues dans l'ordre de pose, sans groupe", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("mi"));
  seance.repondre(Reponse.placement("do"));
  seance.repondre(Reponse.placement("mi"));

  assertEquals(exerciceEnCours(seance).etiquettesPosees(), [{ texte: "do" }, { texte: "mi" }]);
});

Deno.test("« Je ne sais pas » vise l'étiquette choisie d'un classer", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  assertEquals(exerciceEnCours(seance).etiquetteViseeParJeNeSaisPas("savon"), "savon");
});

Deno.test("« Je ne sais pas » sans étiquette choisie vise la première étiquette du plateau d'un classer", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));

  assertEquals(exerciceEnCours(seance).etiquetteViseeParJeNeSaisPas(), "pont");
});

Deno.test("« Je ne sais pas » ne vise aucune étiquette en particulier dans un ordre", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  assertEquals(exerciceEnCours(seance).etiquetteViseeParJeNeSaisPas(), undefined);
});
