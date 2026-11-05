import { assertEquals } from "@std/assert";
import {
  type FaitsDeLaReponseFausse,
  SCENES_DE_REPONSE_FAUSSE,
  type SceneDeReponseFausse,
  sceneDeReponseFausse,
} from "./scene-de-reponse-fausse.ts";

const FAITS_NEUTRES: FaitsDeLaReponseFausse = {
  sceneDejaJoueeDansLaSeance: false,
  pendantLeChronoDUneFluence: false,
  dansLeTestDeDepart: false,
  personnageGuideEnPetit: false,
};

Deno.test("le catalogue des scènes de réponse fausse contient l'univers Sports, avec Coach Léo", () => {
  const universAvecScene = Object.keys(SCENES_DE_REPONSE_FAUSSE);

  assertEquals(universAvecScene.includes("sports"), true);
});

Deno.test("le catalogue des scènes de réponse fausse ne contient encore aucun autre univers que Sports", () => {
  const universAvecScene = Object.keys(SCENES_DE_REPONSE_FAUSSE);

  assertEquals(universAvecScene, ["sports"]);
});

Deno.test("une scène de réponse fausse ne porte que l'univers", () => {
  const scene: SceneDeReponseFausse = { univers: "sports" };

  assertEquals(Object.keys(scene), ["univers"]);
});

Deno.test("la première réponse fausse de la séance, dans l'univers Sports, joue la scène de Coach Léo", () => {
  const scene = sceneDeReponseFausse(FAITS_NEUTRES, "sports");

  assertEquals(scene, { univers: "sports" });
});
