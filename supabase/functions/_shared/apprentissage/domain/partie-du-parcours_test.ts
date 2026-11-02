import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { parcoursDeLaMatiere } from "./parcours.ts";
import { partiesDuParcours } from "./partie-du-parcours.ts";

function lecon(id: string, niveau: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau,
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

function leconsDuCE1(nombre: number): Lecon[] {
  return Array.from({ length: nombre }, (_, index) => lecon(`ma-ce1-${index + 1}`, "CE1", index + 1));
}

function partiesPourDesLecons(lecons: readonly Lecon[]) {
  const parcours = parcoursDeLaMatiere(
    { lecons, niveau: Niveau.de("CE1"), meilleuresEtoiles: new Map() },
    lecons[0].matiere,
  );
  return partiesDuParcours(parcours);
}

function tailles(nombre: number): number[] {
  return partiesPourDesLecons(leconsDuCE1(nombre)).map((partie) => partie.lecons.length);
}

Deno.test("un parcours de 10 leçons est découpé en deux parties de 5 leçons", () => {
  const parties = partiesPourDesLecons(leconsDuCE1(10));

  assertEquals(parties.map(({ numero, lecons }) => [numero, lecons[0], lecons[lecons.length - 1]]), [
    [1, "ma-ce1-1", "ma-ce1-5"],
    [2, "ma-ce1-6", "ma-ce1-10"],
  ]);
});

Deno.test("un dernier bloc de 2 leçons est rattaché à la partie précédente", () => {
  const parties = partiesPourDesLecons(leconsDuCE1(12));

  assertEquals(parties.map(({ numero, lecons }) => [numero, lecons[0], lecons[lecons.length - 1]]), [
    [1, "ma-ce1-1", "ma-ce1-5"],
    [2, "ma-ce1-6", "ma-ce1-12"],
  ]);
});

Deno.test("un dernier bloc de 1 leçon est rattaché à la partie précédente", () => {
  assertEquals(tailles(11), [5, 6]);
});

Deno.test("un dernier bloc de 3 leçons forme sa propre partie", () => {
  assertEquals(tailles(13), [5, 5, 3]);
});

Deno.test("une matière de moins de 5 leçons forme une seule partie", () => {
  const parties = partiesPourDesLecons(leconsDuCE1(3));

  assertEquals(parties.map(({ numero, lecons }) => [numero, lecons]), [
    [1, ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"]],
  ]);
});

Deno.test("un parcours de 31 leçons, a cinq parties de 5 leçons et une de 6", () => {
  assertEquals(tailles(31), [5, 5, 5, 5, 5, 6]);
});

Deno.test("les parties sont numérotées à partir de 1 et redonnent le parcours dans l'ordre", () => {
  const parties = partiesPourDesLecons(leconsDuCE1(13));

  assertEquals(parties.map(({ numero }) => numero), [1, 2, 3]);
  assertEquals(
    parties.flatMap(({ lecons }) => lecons),
    leconsDuCE1(13).map(({ id }) => id),
  );
});

Deno.test("les leçons sont découpées dans l'ordre même si la bibliothèque les donne en désordre", () => {
  const ordonnees = leconsDuCE1(10);
  const enDesordre = [...ordonnees].reverse();

  const parties = partiesPourDesLecons(enDesordre);

  assertEquals(parties.map(({ lecons }) => lecons), [
    ordonnees.slice(0, 5).map(({ id }) => id),
    ordonnees.slice(5).map(({ id }) => id),
  ]);
});

Deno.test("les leçons des classes d'avant ne sont dans aucune partie", () => {
  const dUnCP = Array.from({ length: 4 }, (_, index) => lecon(`ma-cp-${index + 1}`, "CP", index + 1));

  const parties = partiesPourDesLecons([...dUnCP, ...leconsDuCE1(5)]);

  assertEquals(parties.flatMap(({ lecons }) => lecons), leconsDuCE1(5).map(({ id }) => id));
});
