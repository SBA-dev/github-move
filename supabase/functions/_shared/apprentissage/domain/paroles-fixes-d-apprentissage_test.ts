import { assert } from "@std/assert";
import { INTRODUCTION_DE_LA_LECTURE } from "./exercices/phrases-des-exercices-a-choix.ts";
import { parolesFixesDApprentissage } from "./paroles-fixes-d-apprentissage.ts";

Deno.test("les paroles fixes d'Apprentissage contiennent l'introduction de la lecture d'un texte", () => {
  assert(parolesFixesDApprentissage().includes(INTRODUCTION_DE_LA_LECTURE));
});
