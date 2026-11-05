import { assertEquals } from "@std/assert";
import {
  type FaitsDeLaReponseFausse,
  type SceneDeReponseFausse,
  sceneDeReponseFausse,
  sceneJoueeDansLaSeanceApres,
  SCENES_DE_REPONSE_FAUSSE,
} from "./scene-de-reponse-fausse.ts";
import {
  type FaitsDeLaReponseFausse as FaitsExportes,
  type SceneDeReponseFausse as SceneExportee,
  sceneDeReponseFausse as sceneDeReponseFausseExportee,
  sceneJoueeDansLaSeanceApres as sceneJoueeExportee,
  SCENES_DE_REPONSE_FAUSSE as SCENES_EXPORTEES,
} from "./index.ts";

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

Deno.test("une scène déjà jouée dans la séance ne se rejoue pas, même dans l'univers Sports", () => {
  const faits = { ...FAITS_NEUTRES, sceneDejaJoueeDansLaSeance: true };

  assertEquals(sceneDeReponseFausse(faits, "sports"), undefined);
});

Deno.test("pendant le chrono d'une fluence, aucune scène de réponse fausse n'est jouée", () => {
  const faits = { ...FAITS_NEUTRES, pendantLeChronoDUneFluence: true };

  assertEquals(sceneDeReponseFausse(faits, "sports"), undefined);
});

Deno.test("au test de départ, aucune scène de réponse fausse n'est jouée", () => {
  const faits = { ...FAITS_NEUTRES, dansLeTestDeDepart: true };

  assertEquals(sceneDeReponseFausse(faits, "sports"), undefined);
});

Deno.test("avec le personnage guide en petit, aucune scène de réponse fausse n'est jouée", () => {
  const faits = { ...FAITS_NEUTRES, personnageGuideEnPetit: true };

  assertEquals(sceneDeReponseFausse(faits, "sports"), undefined);
});

Deno.test("un univers dont la scène n'est pas encore livrée ne joue aucune scène", () => {
  assertEquals(sceneDeReponseFausse(FAITS_NEUTRES, "danse"), undefined);
});

Deno.test("une clé d'univers inconnue donne le résultat de l'univers Animaux : aucune scène", () => {
  assertEquals(sceneDeReponseFausse(FAITS_NEUTRES, "inconnu"), undefined);
});

Deno.test("sans clé d'univers, le résultat est celui de l'univers Animaux : aucune scène", () => {
  assertEquals(sceneDeReponseFausse(FAITS_NEUTRES, undefined), undefined);
});

Deno.test("une scène rendue pour la première fois marque la scène comme jouée dans la séance", () => {
  const scene: SceneDeReponseFausse = { univers: "sports" };

  assertEquals(sceneJoueeDansLaSeanceApres(false, scene), true);
});

Deno.test("sans scène rendue, la scène n'est pas marquée comme jouée : la prochaine réponse fausse pourra la jouer", () => {
  assertEquals(sceneJoueeDansLaSeanceApres(false, undefined), false);
});

Deno.test("une scène déjà jouée dans la séance le reste, même sans nouvelle scène rendue", () => {
  assertEquals(sceneJoueeDansLaSeanceApres(true, undefined), true);
});

Deno.test("le domaine de Motivation expose la scène de réponse fausse à ses consommateurs", () => {
  const faits: FaitsExportes = FAITS_NEUTRES;
  const scene: SceneExportee | undefined = sceneDeReponseFausseExportee(faits, "sports");

  assertEquals(
    [
      sceneDeReponseFausseExportee === sceneDeReponseFausse,
      sceneJoueeExportee === sceneJoueeDansLaSeanceApres,
      SCENES_EXPORTEES === SCENES_DE_REPONSE_FAUSSE,
      scene,
    ],
    [true, true, true, { univers: "sports" }],
  );
});
