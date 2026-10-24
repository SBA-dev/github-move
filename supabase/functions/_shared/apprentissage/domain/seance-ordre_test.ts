import { assertEquals } from "@std/assert";
import {
  leconDOrdreAvecDeuxElementsIdentiques,
  leconDOrdreDuMot,
  seanceCommencee,
} from "../test_utils/lecons-de-classer-et-ordre.ts";
import { Reponse } from "./reponse.ts";

Deno.test("l'étiquette qui vient en premier est juste et prend la première place", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  const resultat = seance.repondre(Reponse.placement("do"));

  assertEquals(resultat, "juste");
  assertEquals(seance.avancement().questionsReussies, 1);
});

Deno.test("une étiquette qui ne vient pas en premier est fausse et revient au plateau", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  const resultat = seance.repondre(Reponse.placement("mi"));

  assertEquals(resultat, "fausse");
  assertEquals(seance.erreurs(), 1);
  assertEquals(seance.exerciceEnCours()?.etiquettesAPlacer(), ["do", "mi", "no"]);
});

Deno.test("seule l'étiquette suivante est acceptée", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("do"));

  const resultat = seance.repondre(Reponse.placement("no"));

  assertEquals(resultat, "fausse");
});

Deno.test("l'aide d'une erreur sur la première position demande ce qui vient en premier", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  seance.repondre(Reponse.placement("mi"));

  assertEquals(seance.aideApresLaDerniereErreur(), "Ce n'est pas le début. Lequel vient en premier ?");
});

Deno.test("l'aide d'une erreur sur une position suivante demande ce qui vient juste après", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("do"));

  seance.repondre(Reponse.placement("no"));

  assertEquals(seance.aideApresLaDerniereErreur(), "Pas encore celui-là. Lequel vient juste après ?");
});

Deno.test("deux éléments de même texte sont interchangeables", () => {
  const seance = seanceCommencee(leconDOrdreAvecDeuxElementsIdentiques());
  seance.repondre(Reponse.placement("Avancer de 2 cases"));
  seance.repondre(Reponse.placement("Tourner à droite"));

  const resultat = seance.repondre(Reponse.placement("Avancer de 1 case"));

  assertEquals(resultat, "juste");
  assertEquals(seance.erreurs(), 0);
});

Deno.test("après une bonne étiquette qui n'est pas la dernière, une relance est due", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  seance.repondre(Reponse.placement("do"));

  assertEquals(seance.paroleDueApresLaDerniereReponse(), "relance");
});

Deno.test("après la dernière étiquette, une félicitation est due", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("do"));
  seance.repondre(Reponse.placement("mi"));

  seance.repondre(Reponse.placement("no"));

  assertEquals(seance.paroleDueApresLaDerniereReponse(), "felicitation");
});

Deno.test("après une étiquette fausse d'un ordre, aucune parole n'est due", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  seance.repondre(Reponse.placement("mi"));

  assertEquals(seance.paroleDueApresLaDerniereReponse(), undefined);
});
