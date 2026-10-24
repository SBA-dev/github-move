import { assertEquals } from "@std/assert";
import {
  exerciceDemandeLeSon,
  LIBELLE_DU_BOUTON_ACTIVER_LE_SON,
  messageDeLaDicteeSansVoix,
} from "./dictee-sans-voix.ts";

Deno.test("son coupé, la dictée demande d'activer le son", () => {
  assertEquals(
    messageDeLaDicteeSansVoix("muet"),
    "Pour la dictée, j'ai besoin du son : active-le avec le bouton ci-dessous.",
  );
});

Deno.test("navigateur sans voix, la dictée se fait avec un adulte", () => {
  assertEquals(
    messageDeLaDicteeSansVoix("lectureImpossible"),
    "Ce navigateur ne sait pas lire à voix haute : fais cette dictée avec un adulte, qui te dira les mots.",
  );
});

Deno.test("voix disponible, la dictée n'a aucun message à afficher", () => {
  assertEquals(messageDeLaDicteeSansVoix("disponible"), undefined);
});

Deno.test("le bouton qui rend le son à la dictée s'appelle « Activer le son »", () => {
  assertEquals(LIBELLE_DU_BOUTON_ACTIVER_LE_SON, "Activer le son");
});

Deno.test("la dictée est le seul type d'exercice qui demande le son", () => {
  assertEquals(exerciceDemandeLeSon("dictee"), true);
  assertEquals(
    (["ecoute", "bulles", "lecture", "trous", "conjugaison", "classer", "ordre"] as const)
      .filter(exerciceDemandeLeSon),
    [],
  );
});
