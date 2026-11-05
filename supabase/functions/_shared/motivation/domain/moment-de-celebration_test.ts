import { assertEquals } from "@std/assert";
import { momentDeCelebrationDeLaFin } from "./moment-de-celebration.ts";
import { titreDeLaMatiereReussie } from "./index.ts";
import { PALIERS_DES_TENUES } from "./tenues.ts";

const echarpeRayee = PALIERS_DES_TENUES[0].tenue;

Deno.test("un défi relevé pour la première fois est un moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: true,
    matiereReussieParLaSeance: false,
    tenueRecue: undefined,
  });

  assertEquals(moment, "defiReleve");
});

Deno.test("un défi rejoué, déjà relevé, n'a pas de moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: false,
    matiereReussieParLaSeance: false,
    tenueRecue: undefined,
  });

  assertEquals(moment, undefined);
});

Deno.test("une matière réussie par la séance est un moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: false,
    matiereReussieParLaSeance: true,
    tenueRecue: undefined,
  });

  assertEquals(moment, "matiereReussie");
});

Deno.test("une tenue reçue seule est un moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: false,
    matiereReussieParLaSeance: false,
    tenueRecue: echarpeRayee,
  });

  assertEquals(moment, "tenueRecue");
});

Deno.test("une matière réussie avec une tenue reçue à la même fin garde la célébration de la matière", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: false,
    matiereReussieParLaSeance: true,
    tenueRecue: echarpeRayee,
  });

  assertEquals(moment, "matiereReussie");
});

Deno.test("l'annonce d'une matière réussie s'intitule « Matière réussie ! »", () => {
  assertEquals(titreDeLaMatiereReussie(), "Matière réussie !");
});
