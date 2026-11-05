import { assertEquals } from "@std/assert";
import { lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { defiOuvertParLaSeance, estUnGrandDefi, matiereReussieParLaSeance } from "./index.ts";
import type { EntreesDuParcours } from "./index.ts";
import { Etoiles } from "./etoiles.ts";
import { parcoursDeLaMatiere } from "./parcours.ts";

const maths = matiereDeCode("maths");
const francais = matiereDeCode("francais");
const ce1 = Niveau.de("CE1");

function lecon(id: string, matiere: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau: "CE1",
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const lecons = [
  ...Array.from({ length: 3 }, (_, index) => lecon(`ma-ce1-${index + 1}`, "maths", index + 1)),
  ...Array.from({ length: 2 }, (_, index) => lecon(`fr-ce1-${index + 1}`, "francais", index + 1)),
];

function entrees(reussies: string[], auTestDeDepart: string[] = []): EntreesDuParcours {
  return {
    lecons,
    niveau: ce1,
    meilleuresEtoiles: new Map(reussies.map((id) => [id, Etoiles.de(1)])),
    leconsReussiesAuTestDeDepart: new Set(auTestDeDepart),
  };
}

Deno.test("la séance qui réussit la dernière leçon de la classe dans la matière rend la matière réussie", () => {
  const avant = entrees(["ma-ce1-1", "ma-ce1-2"]);
  const apres = entrees(["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"]);

  assertEquals(matiereReussieParLaSeance(avant, apres, maths), true);
});

Deno.test("une matière déjà réussie avant la séance n'est pas réussie par la séance", () => {
  const avant = entrees(["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"]);
  const apres = entrees(["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"]);

  assertEquals(matiereReussieParLaSeance(avant, apres, maths), false);
});

Deno.test("une séance qui laisse une leçon de la matière à réussir ne la rend pas réussie", () => {
  const avant = entrees(["ma-ce1-1"]);
  const apres = entrees(["ma-ce1-1", "ma-ce1-2"]);

  assertEquals(matiereReussieParLaSeance(avant, apres, maths), false);
});

Deno.test("la séance qui réussit une leçon de français ne rend pas les maths réussies", () => {
  const avant = entrees(["ma-ce1-1", "ma-ce1-2", "fr-ce1-1"]);
  const apres = entrees(["ma-ce1-1", "ma-ce1-2", "fr-ce1-1", "fr-ce1-2"]);

  assertEquals(matiereReussieParLaSeance(avant, apres, maths), false);
});

Deno.test("la séance qui réussit la dernière leçon du français rend le français réussi", () => {
  const avant = entrees(["fr-ce1-1"]);
  const apres = entrees(["fr-ce1-1", "fr-ce1-2"]);

  assertEquals(matiereReussieParLaSeance(avant, apres, francais), true);
});

Deno.test("les leçons réussies au test de départ comptent pour rendre la matière réussie", () => {
  const avant = entrees([], ["ma-ce1-1", "ma-ce1-2"]);
  const apres = entrees(["ma-ce1-3"], ["ma-ce1-1", "ma-ce1-2"]);

  assertEquals(matiereReussieParLaSeance(avant, apres, maths), true);
});

Deno.test("une matière sans leçon dans la classe n'est pas réussie par la séance", () => {
  const sciences = matiereDeCode("sciences");
  const avant = entrees(["ma-ce1-1"]);
  const apres = entrees(["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"]);

  assertEquals(matiereReussieParLaSeance(avant, apres, sciences), false);
});

Deno.test("une matière réussie par le test de départ lui-même n'est réussie par aucune séance", () => {
  const apresLeTest = entrees([], ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"]);

  assertEquals(matiereReussieParLaSeance(apresLeTest, apresLeTest, maths), false);
});

const sequences: { nom: string; avant: string[]; apres: string[] }[] = [
  { nom: "dernière leçon réussie", avant: ["ma-ce1-1", "ma-ce1-2"], apres: ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"] },
  { nom: "leçon rejouée", avant: ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"], apres: ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"] },
  { nom: "leçon manquante restante", avant: ["ma-ce1-1"], apres: ["ma-ce1-1", "ma-ce1-2"] },
];

for (const { nom, avant, apres } of sequences) {
  Deno.test(`le grand défi non relevé est ouvert par la séance si et seulement si la matière est réussie par la séance (${nom})`, () => {
    const entreesAvant = entrees(avant);
    const entreesApres = entrees(apres);

    const defi = defiOuvertParLaSeance(
      parcoursDeLaMatiere(entreesAvant, maths),
      parcoursDeLaMatiere(entreesApres, maths),
      maths,
      ce1,
      [],
    );

    assertEquals(
      defi !== undefined && estUnGrandDefi(defi),
      matiereReussieParLaSeance(entreesAvant, entreesApres, maths),
    );
  });
}

Deno.test("le grand défi déjà relevé n'est pas ouvert, même si la séance rend la matière réussie", () => {
  const avant = entrees(["ma-ce1-1", "ma-ce1-2"]);
  const apres = entrees(["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"]);

  const defi = defiOuvertParLaSeance(
    parcoursDeLaMatiere(avant, maths),
    parcoursDeLaMatiere(apres, maths),
    maths,
    ce1,
    [{ matiere: maths, niveau: ce1, grandDefi: true as const }],
  );

  assertEquals([defi, matiereReussieParLaSeance(avant, apres, maths)], [undefined, true]);
});
