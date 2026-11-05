import { assertEquals } from "@std/assert";
import { momentDeCelebrationDeLaFin } from "./moment-de-celebration.ts";
import { titreDeLaMatiereReussie } from "./index.ts";

Deno.test("un défi relevé pour la première fois est un moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: true,
    matiereReussieParLaSeance: false,
  });

  assertEquals(moment, "defiReleve");
});

Deno.test("un défi rejoué, déjà relevé, n'a pas de moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: false,
    matiereReussieParLaSeance: false,
  });

  assertEquals(moment, undefined);
});

Deno.test("une matière réussie par la séance est un moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({
    defiRelevePourLaPremiereFois: false,
    matiereReussieParLaSeance: true,
  });

  assertEquals(moment, "matiereReussie");
});

Deno.test("l'annonce d'une matière réussie s'intitule « Matière réussie ! »", () => {
  assertEquals(titreDeLaMatiereReussie(), "Matière réussie !");
});
