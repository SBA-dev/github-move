import { assertEquals } from "@std/assert";
import { tenueDeLaCelebrationDeLUnivers } from "./tenue-de-la-celebration.ts";
import { PALIERS_DES_TENUES, type TenueDuPersonnageGuide } from "./tenues.ts";
import type { FaitsDeLaFinPourLaCelebration } from "./moment-de-celebration.ts";

const echarpe: TenueDuPersonnageGuide = PALIERS_DES_TENUES[0].tenue;
const noeudPapillon: TenueDuPersonnageGuide = PALIERS_DES_TENUES[1].tenue;

const aucunFait: FaitsDeLaFinPourLaCelebration = {
  defiRelevePourLaPremiereFois: false,
  matiereReussieParLaSeance: false,
  tenueRecue: undefined,
};

Deno.test("la tenue reçue par la séance est portée dans la scène, même si une autre tenue est portée", () => {
  const tenue = tenueDeLaCelebrationDeLUnivers({ ...aucunFait, tenueRecue: noeudPapillon }, echarpe.cle);

  assertEquals(tenue, noeudPapillon);
});

Deno.test("la tenue reçue est portée aussi quand la matière est réussie à la même fin", () => {
  const tenue = tenueDeLaCelebrationDeLUnivers(
    { ...aucunFait, matiereReussieParLaSeance: true, tenueRecue: noeudPapillon },
    undefined,
  );

  assertEquals(tenue, noeudPapillon);
});

Deno.test("sans tenue reçue, la scène montre la tenue portée", () => {
  const tenue = tenueDeLaCelebrationDeLUnivers(aucunFait, echarpe.cle);

  assertEquals(tenue, echarpe);
});

Deno.test("au premier défi relevé, la scène montre la tenue portée", () => {
  const tenue = tenueDeLaCelebrationDeLUnivers({ ...aucunFait, defiRelevePourLaPremiereFois: true }, echarpe.cle);

  assertEquals(tenue, echarpe);
});

Deno.test("sans tenue portée ni tenue reçue, la scène ne montre aucune tenue", () => {
  assertEquals(tenueDeLaCelebrationDeLUnivers(aucunFait, undefined), undefined);
});

Deno.test("une clé de tenue portée inconnue ne montre aucune tenue", () => {
  assertEquals(tenueDeLaCelebrationDeLUnivers(aucunFait, "chapeau-inconnu"), undefined);
});
