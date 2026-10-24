import { assertThrows } from "@std/assert";
import { leconDeClasserLesSons, leconDOrdreDuMot, seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { leconDeCalcul } from "../test_utils/lecons-de-test.ts";
import { EtiquetteDejaPlacee, EtiquetteInconnue, GroupeInconnu, PasDeQuestionEnCours } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";

Deno.test("poser une étiquette dans un groupe qui n'existe pas est refusé", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  assertThrows(() => seance.repondre(Reponse.placement("loup", "g-inconnu")), GroupeInconnu);
});

Deno.test("poser une étiquette sans dire dans quel groupe est refusé", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  assertThrows(() => seance.repondre(Reponse.placement("loup")), GroupeInconnu);
});

Deno.test("une étiquette déjà bien placée ne peut plus être posée", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));

  assertThrows(() => seance.repondre(Reponse.placement("loup", "g-ou")), EtiquetteDejaPlacee);
});

Deno.test("une étiquette inconnue de l'ordre est refusée", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  assertThrows(() => seance.repondre(Reponse.placement("tigre")), EtiquetteInconnue);
});

Deno.test("poser une étiquette dans un exercice à choix est refusé", () => {
  const seance = seanceCommencee(leconDeCalcul());

  assertThrows(() => seance.repondre(Reponse.placement("8")), PasDeQuestionEnCours);
});
