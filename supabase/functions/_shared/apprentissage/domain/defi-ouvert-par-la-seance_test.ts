import { assertEquals } from "@std/assert";
import { lireLecon, matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { defiOuvertParLaSeance, estUnGrandDefi } from "./defis-de-la-matiere.ts";
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

function parcoursAvecReussies(reussies: number[]) {
  const meilleuresEtoiles = new Map(reussies.map((i) => [`ma-ce1-${i}`, Etoiles.de(1)]));
  return parcoursDeLaMatiere(
    { lecons, niveau: ce1, meilleuresEtoiles, leconsReussiesAuTestDeDepart: new Set<string>() },
    maths,
  );
}

Deno.test("la séance qui réussit la dernière leçon manquante du défi 1 ouvre le défi 1", () => {
  const avant = parcoursAvecReussies([1, 2, 3, 4]);
  const apres = parcoursAvecReussies([1, 2, 3, 4, 5]);

  const defi = defiOuvertParLaSeance(avant, apres, maths, ce1, []);

  assertEquals(defi?.numero, 1);
});

Deno.test("une séance qui laisse des leçons du défi à réussir n'ouvre aucun défi", () => {
  const avant = parcoursAvecReussies([1, 2, 3]);
  const apres = parcoursAvecReussies([1, 2, 3, 4]);

  assertEquals(defiOuvertParLaSeance(avant, apres, maths, ce1, []), undefined);
});

Deno.test("rejouer une leçon d'un défi déjà ouvert n'ouvre pas le défi de nouveau", () => {
  const avant = parcoursAvecReussies([1, 2, 3, 4, 5]);
  const apres = parcoursAvecReussies([1, 2, 3, 4, 5]);

  assertEquals(defiOuvertParLaSeance(avant, apres, maths, ce1, []), undefined);
});

Deno.test("un défi déjà relevé ne s'ouvre pas de nouveau", () => {
  const avant = parcoursAvecReussies([1, 2, 3, 4]);
  const apres = parcoursAvecReussies([1, 2, 3, 4, 5]);
  const defisReleves = [{ matiere: maths, niveau: ce1, numero: 1 }];

  assertEquals(defiOuvertParLaSeance(avant, apres, maths, ce1, defisReleves), undefined);
});

Deno.test("la séance qui réussit la dernière leçon manquante de la matière ouvre le grand défi", () => {
  const avant = parcoursAvecReussies([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const apres = parcoursAvecReussies([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const defi = defiOuvertParLaSeance(avant, apres, maths, ce1, []);

  assertEquals(defi !== undefined && estUnGrandDefi(defi), true);
});

Deno.test("la séance qui ouvre le défi 1 et le grand défi ne rend que le grand défi", () => {
  const avant = parcoursAvecReussies([1, 2, 3, 4, 6, 7, 8, 9, 10]);
  const apres = parcoursAvecReussies([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const defi = defiOuvertParLaSeance(avant, apres, maths, ce1, []);

  assertEquals(defi !== undefined && estUnGrandDefi(defi), true);
});

Deno.test("un grand défi déjà relevé ne s'ouvre pas de nouveau", () => {
  const avant = parcoursAvecReussies([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const apres = parcoursAvecReussies([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const defisReleves = [{ matiere: maths, niveau: ce1, grandDefi: true as const }];

  assertEquals(defiOuvertParLaSeance(avant, apres, maths, ce1, defisReleves), undefined);
});

Deno.test("une matière déjà réussie avant la séance n'ouvre pas le grand défi", () => {
  const avant = parcoursAvecReussies([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const apres = parcoursAvecReussies([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  assertEquals(defiOuvertParLaSeance(avant, apres, maths, ce1, []), undefined);
});
