import { assertEquals } from "@std/assert";
import {
  leconDeClasserAvecUneAide,
  leconDeClasserLesSons,
  seanceCommencee,
} from "../test_utils/lecons-de-classer-et-ordre.ts";
import { Reponse } from "./reponse.ts";

function etiquettesAPlacer(seance: ReturnType<typeof seanceCommencee>): string[] {
  const exercice = seance.exerciceEnCours();
  if (!exercice) throw new Error("Aucun exercice en cours");
  return exercice.etiquettesAPlacer();
}

Deno.test("une étiquette posée dans le groupe visé est juste et quitte le plateau", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  const resultat = seance.repondre(Reponse.placement("loup", "g-ou"));

  assertEquals(resultat, "juste");
  assertEquals(etiquettesAPlacer(seance), ["pont", "savon"]);
});

Deno.test("l'enfant réussit les étiquettes dans l'ordre qu'il choisit", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.repondre(Reponse.placement("savon", "g-on"));

  assertEquals(seance.avancement().questionsReussies, 1);
  assertEquals(etiquettesAPlacer(seance), ["loup", "pont"]);
});

Deno.test("une étiquette posée dans un mauvais groupe est fausse, revient au plateau et coûte une erreur", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  const resultat = seance.repondre(Reponse.placement("loup", "g-on"));

  assertEquals(resultat, "fausse");
  assertEquals(etiquettesAPlacer(seance), ["loup", "pont", "savon"]);
  assertEquals(seance.erreurs(), 1);
});

Deno.test("reposer la même étiquette dans la même mauvaise maison coûte une nouvelle erreur", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.repondre(Reponse.placement("loup", "g-on"));
  const resultat = seance.repondre(Reponse.placement("loup", "g-on"));

  assertEquals(resultat, "fausse");
  assertEquals(seance.erreurs(), 2);
});

Deno.test("après une erreur sans aide propre, le groupe touché est nommé", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.repondre(Reponse.placement("loup", "g-on"));

  assertEquals(
    seance.aideApresLaDerniereErreur(),
    "« loup » n'habite pas dans la maison « on ». Essaie une autre maison.",
  );
});

Deno.test("l'aide de l'étiquette passe avant l'aide par défaut", () => {
  const seance = seanceCommencee(leconDeClasserAvecUneAide());

  seance.repondre(Reponse.placement("baleine", "g-poissons"));

  assertEquals(seance.aideApresLaDerniereErreur(), "La baleine respire avec des poumons.");
});

Deno.test("après chaque bonne étiquette d'un classement, la félicitation est due une fois sur deux", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.repondre(Reponse.placement("loup", "g-ou"));
  const apresLaPremiere = seance.paroleDueApresLaDerniereReponse();
  seance.repondre(Reponse.placement("pont", "g-on"));
  const apresLaSeconde = seance.paroleDueApresLaDerniereReponse();

  assertEquals([apresLaPremiere, apresLaSeconde], ["felicitationUneFoisSurDeux", "felicitationUneFoisSurDeux"]);
});

Deno.test("après la dernière bonne étiquette d'un classement, la félicitation est toujours due", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));

  seance.repondre(Reponse.placement("savon", "g-on"));

  assertEquals(seance.paroleDueApresLaDerniereReponse(), "felicitation");
});

Deno.test("après une étiquette fausse d'un classement, aucune parole n'est due", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.repondre(Reponse.placement("loup", "g-on"));

  assertEquals(seance.paroleDueApresLaDerniereReponse(), undefined);
});
