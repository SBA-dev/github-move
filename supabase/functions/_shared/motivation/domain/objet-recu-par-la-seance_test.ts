import { assertEquals, assertThrows } from "@std/assert";
import { NombreDEtoilesInvalide, objetRecuParLaSeance } from "./cabane.ts";

function meilleuresEtoilesPourUnTotalDe(total: number): Map<string, number> {
  const meilleures = new Map<string, number>();
  let reste = total;
  for (let numero = 1; reste > 0; numero++) {
    const etoiles = Math.min(3, reste);
    meilleures.set(`lecon-existante-${numero}`, etoiles);
    reste -= etoiles;
  }
  return meilleures;
}

Deno.test("une leçon nouvelle à 1 étoile qui fait passer le total de 5 à 6 fait recevoir un tapis tout doux", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(5);

  const objet = objetRecuParLaSeance(meilleuresAvant, "lecon-nouvelle", 1);

  assertEquals(objet?.nom, "un tapis tout doux");
});

Deno.test("rejouer une leçon de 2 à 3 étoiles n'ajoute que l'étoile en plus et fait recevoir une lanterne", () => {
  const meilleuresAvant = new Map([["lecon-rejouee", 2]]);

  const objet = objetRecuParLaSeance(meilleuresAvant, "lecon-rejouee", 3);

  assertEquals(objet?.nom, "une lanterne");
});

Deno.test("rejouer une leçon à 3 étoiles avec 1 étoile ne fait recevoir aucun objet", () => {
  const meilleuresAvant = new Map([["lecon-rejouee", 3], ["lecon-b", 3]]);

  const objet = objetRecuParLaSeance(meilleuresAvant, "lecon-rejouee", 1);

  assertEquals(objet, undefined);
});

Deno.test("rejouer une leçon avec autant d'étoiles ne fait recevoir aucun objet", () => {
  const meilleuresAvant = new Map([["lecon-rejouee", 2], ["lecon-b", 3], ["lecon-c", 1]]);

  const objet = objetRecuParLaSeance(meilleuresAvant, "lecon-rejouee", 2);

  assertEquals(objet, undefined);
});

Deno.test("une séance sans étoiles, faite seulement d'une fluence, ne fait recevoir aucun objet", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(5);

  const objet = objetRecuParLaSeance(meilleuresAvant, "lecon-nouvelle", undefined);

  assertEquals(objet, undefined);
});

Deno.test("une leçon nouvelle à 3 étoiles qui fait passer le total de 74 à 77 fait recevoir l'étoile magique", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(74);

  const objet = objetRecuParLaSeance(meilleuresAvant, "lecon-nouvelle", 3);

  assertEquals(objet?.nom, "l'étoile magique");
});

Deno.test("une cabane complète à 75 étoiles ne fait plus recevoir aucun objet", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(75);

  const objet = objetRecuParLaSeance(meilleuresAvant, "lecon-nouvelle", 3);

  assertEquals(objet, undefined);
});

for (const invalide of [0, 4, 1.5]) {
  Deno.test(`${invalide} étoile(s) pour la séance n'est pas un nombre d'étoiles valide`, () => {
    const meilleuresAvant = new Map<string, number>();

    assertThrows(() => objetRecuParLaSeance(meilleuresAvant, "lecon-nouvelle", invalide), NombreDEtoilesInvalide);
  });
}
