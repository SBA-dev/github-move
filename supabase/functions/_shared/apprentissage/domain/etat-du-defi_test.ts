import { assertEquals } from "@std/assert";
import { lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { type DefiReleve, defisDeLaMatiere, etatDuDefi, grandDefiDeLaMatiere } from "./defis-de-la-matiere.ts";
import { Etoiles } from "./etoiles.ts";
import { parcoursDeLaMatiere } from "./parcours.ts";

const maths = matiereDeCode("maths");
const ce1 = Niveau.de("CE1");

function lecon(index: number): Lecon {
  return lireLecon({
    id: `ma-ce1-${index}`,
    matiere: "maths",
    niveau: "CE1",
    titre: `Titre de ma-ce1-${index}`,
    ordre: index,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const lecons = Array.from({ length: 10 }, (_, index) => lecon(index + 1));

function etatDuDefi1(
  options: { reussies?: number[]; auTestDeDepart?: number[]; releves?: { numero: number }[] } = {},
) {
  const meilleuresEtoiles = new Map((options.reussies ?? []).map((i) => [`ma-ce1-${i}`, Etoiles.de(1)]));
  const leconsReussiesAuTestDeDepart = new Set((options.auTestDeDepart ?? []).map((i) => `ma-ce1-${i}`));
  const parcours = parcoursDeLaMatiere({ lecons, niveau: ce1, meilleuresEtoiles, leconsReussiesAuTestDeDepart }, maths);
  const [defi] = defisDeLaMatiere(parcours, maths, ce1);
  const defisReleves = (options.releves ?? []).map(({ numero }) => ({ matiere: maths, niveau: ce1, numero }));
  return etatDuDefi(defi, parcours, defisReleves);
}

Deno.test("un défi dont toutes les leçons sont réussies est ouvert", () => {
  assertEquals(etatDuDefi1({ reussies: [1, 2, 3, 4, 5] }), { genre: "ouvert" });
});

Deno.test("un défi dont 4 leçons sur 5 sont réussies est à venir, avec 1 leçon qui manque", () => {
  assertEquals(etatDuDefi1({ reussies: [1, 2, 3, 4] }), { genre: "aVenir", leconsRestantes: 1 });
});

Deno.test("un défi dont aucune leçon n'est réussie est à venir, avec 5 leçons qui manquent", () => {
  assertEquals(etatDuDefi1(), { genre: "aVenir", leconsRestantes: 5 });
});

Deno.test("des leçons réussies au test de départ comptent pour ouvrir le défi", () => {
  assertEquals(etatDuDefi1({ reussies: [3, 4, 5], auTestDeDepart: [1, 2] }), { genre: "ouvert" });
});

Deno.test("un défi figurant parmi les défis relevés est relevé", () => {
  assertEquals(etatDuDefi1({ reussies: [1, 2, 3, 4, 5], releves: [{ numero: 1 }] }), { genre: "releve" });
});

Deno.test("un défi relevé reste relevé même si ses leçons ne sont plus toutes réussies", () => {
  assertEquals(etatDuDefi1({ reussies: [1, 2], releves: [{ numero: 1 }] }), { genre: "releve" });
});

Deno.test("le défi relevé d'un autre numéro ne rend pas ce défi relevé", () => {
  assertEquals(etatDuDefi1({ reussies: [1, 2, 3, 4, 5], releves: [{ numero: 2 }] }), { genre: "ouvert" });
});

function etatDuGrandDefi(
  options: { nombreDeLecons?: number; reussies?: number[]; releves?: DefiReleve[] } = {},
) {
  const lesLecons = Array.from({ length: options.nombreDeLecons ?? 10 }, (_, index) => lecon(index + 1));
  const meilleuresEtoiles = new Map((options.reussies ?? []).map((i) => [`ma-ce1-${i}`, Etoiles.de(1)]));
  const parcours = parcoursDeLaMatiere({ lecons: lesLecons, niveau: ce1, meilleuresEtoiles }, maths);
  const grandDefi = grandDefiDeLaMatiere(parcours, maths, ce1);
  if (grandDefi === undefined) throw new Error("la matière a des leçons dans la classe");
  return etatDuDefi(grandDefi, parcours, options.releves ?? []);
}

Deno.test("un grand défi dont 4 leçons de la classe sur 10 sont réussies est à venir, avec encore 6 leçons", () => {
  assertEquals(etatDuGrandDefi({ reussies: [1, 2, 3, 4] }), { genre: "aVenir", leconsRestantes: 6 });
});

Deno.test("le grand défi est ouvert quand toutes les leçons de la classe sont réussies, même si le défi d'une partie n'est pas relevé", () => {
  const tout = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  assertEquals(etatDuGrandDefi({ reussies: tout, releves: [] }), { genre: "ouvert" });
});

const grandDefiReleve = (matiere = maths, niveau = ce1): DefiReleve => ({ matiere, niveau, grandDefi: true });

Deno.test("le grand défi relevé de la même matière et de la même classe rend le grand défi relevé", () => {
  assertEquals(etatDuGrandDefi({ reussies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], releves: [grandDefiReleve()] }), {
    genre: "releve",
  });
});

Deno.test("le grand défi relevé d'une autre classe ou d'une autre matière ne rend pas ce grand défi relevé", () => {
  const releves = [grandDefiReleve(maths, Niveau.de("CE2")), grandDefiReleve(matiereDeCode("francais"), ce1)];

  assertEquals(etatDuGrandDefi({ reussies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], releves }), { genre: "ouvert" });
});
