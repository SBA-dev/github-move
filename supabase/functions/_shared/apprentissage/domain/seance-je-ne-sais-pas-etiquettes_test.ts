import { assertEquals, assertThrows } from "@std/assert";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import {
  leconDeClasserAvecUneAide,
  leconDeClasserLesSons,
  leconDOrdreDuMot,
  seanceCommencee,
} from "../test_utils/lecons-de-classer-et-ordre.ts";
import { EtiquetteInconnue, JeNeSaisPasDejaDit } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";

const fin = new Date("2026-10-24T10:30:00Z");

Deno.test("« Je ne sais pas » sur une étiquette de classer fait briller sa maison, identifiée par son id", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  assertEquals(seance.direJeNeSaisPas("pont"), { aide: undefined, bonneReponse: "g-on", maniere: "briller" });
});

Deno.test("« Je ne sais pas » sur une étiquette de classer rend l'aide de l'item quand il en a une", () => {
  const seance = seanceCommencee(leconDeClasserAvecUneAide());

  assertEquals(seance.direJeNeSaisPas("baleine").aide, "La baleine respire avec des poumons.");
});

Deno.test("« Je ne sais pas » en classer sans étiquette choisie vise la première du plateau", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  const premiere = seance.exerciceEnCours()?.etiquettesAPlacer()[0];

  const aide = seance.direJeNeSaisPas();

  assertEquals(aide.bonneReponse, premiere === "loup" ? "g-ou" : "g-on");
});

Deno.test("« Je ne sais pas » sur une étiquette de classer coûte une erreur", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.direJeNeSaisPas("loup");

  assertEquals(seance.erreurs(), 1);
});

Deno.test("« Je ne sais pas » sur une étiquette de classer ne la place pas : elle reste à placer", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.direJeNeSaisPas("loup");

  assertEquals(seance.avancement().questionsReussies, 0);
  assertEquals(seance.exerciceEnCours()?.etiquettesAPlacer().includes("loup"), true);
});

Deno.test("« Je ne sais pas » après une erreur sur la même étiquette ne coûte pas d'erreur de plus", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-on"));

  seance.direJeNeSaisPas("loup");

  assertEquals(seance.erreurs(), 1);
});

Deno.test("après « Je ne sais pas », une mauvaise maison pour cette étiquette ne coûte plus d'erreur", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.direJeNeSaisPas("loup");

  const resultat = seance.repondre(Reponse.placement("loup", "g-on"));

  assertEquals(resultat, "fausse");
  assertEquals(seance.erreurs(), 1);
});

Deno.test("après « Je ne sais pas », l'étiquette ne se réussit qu'avec la bonne maison donnée par l'enfant", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.direJeNeSaisPas("loup");

  const resultat = seance.repondre(Reponse.placement("loup", "g-ou"));

  assertEquals(resultat, "juste");
  assertEquals(seance.avancement().questionsReussies, 1);
});

Deno.test("« Je ne sais pas » ne se dit qu'une fois sur la même étiquette de classer", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.direJeNeSaisPas("loup");

  assertThrows(() => seance.direJeNeSaisPas("loup"), JeNeSaisPasDejaDit);
});

Deno.test("« Je ne sais pas » sur une autre étiquette de classer coûte sa propre erreur", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.direJeNeSaisPas("loup");

  seance.direJeNeSaisPas("pont");

  assertEquals(seance.erreurs(), 2);
});

Deno.test("« Je ne sais pas » sur une étiquette qui n'est pas au plateau est une étiquette inconnue", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  assertThrows(() => seance.direJeNeSaisPas("tigre"), EtiquetteInconnue);
});

Deno.test("« Je ne sais pas » sur une étiquette de classer déjà placée est une étiquette inconnue", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));

  assertThrows(() => seance.direJeNeSaisPas("loup"), EtiquetteInconnue);
});

Deno.test("« Je ne sais pas » en ordre fait briller l'étiquette qui vient ensuite", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("do"));

  assertEquals(seance.direJeNeSaisPas(), { aide: undefined, bonneReponse: "mi", maniere: "briller" });
});

Deno.test("« Je ne sais pas » en ordre coûte une erreur, une seule pour la question", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  seance.direJeNeSaisPas();
  seance.repondre(Reponse.placement("mi"));

  assertEquals(seance.erreurs(), 1);
});

Deno.test("après « Je ne sais pas » en ordre, la question ne se réussit qu'en posant l'étiquette demandée", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.direJeNeSaisPas();

  const resultat = seance.repondre(Reponse.placement("do"));

  assertEquals(resultat, "juste");
  assertEquals(seance.avancement().questionsReussies, 1);
});

Deno.test("rejouer des « Je ne sais pas » en classer, dans le désordre, et en ordre redonne le fait d'origine", () => {
  const classer = seanceCommencee(leconDeClasserLesSons(), hasardFixe(0, 0));
  classer.repondre(Reponse.placement("savon", "g-on"));
  classer.direJeNeSaisPas("pont");
  classer.repondre(Reponse.placement("pont", "g-on"));
  classer.repondre(Reponse.placement("loup", "g-on"));
  classer.direJeNeSaisPas("loup");
  classer.repondre(Reponse.placement("loup", "g-ou"));
  const faitDeClasser = classer.terminer(fin);
  const ordre = seanceCommencee(leconDOrdreDuMot(), hasardFixe(0, 0));
  ordre.repondre(Reponse.placement("do"));
  ordre.direJeNeSaisPas();
  ordre.repondre(Reponse.placement("mi"));
  ordre.repondre(Reponse.placement("no"));
  const faitDOrdre = ordre.terminer(fin);

  assertEquals(revaliderLaSeance(leconDeClasserLesSons(), classer.aEnregistrer()), faitDeClasser);
  assertEquals(revaliderLaSeance(leconDOrdreDuMot(), ordre.aEnregistrer()), faitDOrdre);
});
