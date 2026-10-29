import { assertEquals, assertThrows } from "@std/assert";
import { NombreDEtoilesInvalide } from "./cabane.ts";
import { tenueRecueParLaSeance } from "./tenues.ts";

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

Deno.test("une leçon nouvelle à 1 étoile qui fait passer le total de 4 à 5 fait recevoir l'écharpe rayée", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(4);

  const tenue = tenueRecueParLaSeance(meilleuresAvant, "lecon-nouvelle", 1);

  assertEquals(tenue?.nom, "une écharpe rayée");
});

Deno.test("une leçon nouvelle à 1 étoile qui fait passer le total de 11 à 12 fait recevoir le nœud papillon", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(11);

  const tenue = tenueRecueParLaSeance(meilleuresAvant, "lecon-nouvelle", 1);

  assertEquals(tenue?.nom, "un nœud papillon");
});

Deno.test("rejouer une leçon avec moins d'étoiles ne fait perdre ni gagner aucune tenue", () => {
  const meilleuresAvant = new Map([["lecon-rejouee", 3], ["lecon-b", 3]]);

  const tenue = tenueRecueParLaSeance(meilleuresAvant, "lecon-rejouee", 1);

  assertEquals(tenue, undefined);
});

Deno.test("rejouer une leçon avec autant d'étoiles ne fait recevoir aucune tenue", () => {
  const meilleuresAvant = new Map([["lecon-rejouee", 2], ["lecon-b", 2]]);

  const tenue = tenueRecueParLaSeance(meilleuresAvant, "lecon-rejouee", 2);

  assertEquals(tenue, undefined);
});

for (const [avant, apres] of [[2, 3], [5, 6]]) {
  Deno.test(`un palier de la cabane atteint en passant de ${avant} à ${apres} étoiles, sans palier des tenues, ne fait recevoir aucune tenue`, () => {
    const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(avant);

    const tenue = tenueRecueParLaSeance(meilleuresAvant, "lecon-nouvelle", apres - avant);

    assertEquals(tenue, undefined);
  });
}

Deno.test("un total déjà au-delà de 37 étoiles ne fait recevoir aucune tenue", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(40);

  const tenue = tenueRecueParLaSeance(meilleuresAvant, "lecon-nouvelle", 3);

  assertEquals(tenue, undefined);
});

Deno.test("une séance sans étoiles, faite seulement d'une fluence, ne fait recevoir aucune tenue", () => {
  const meilleuresAvant = meilleuresEtoilesPourUnTotalDe(4);

  const tenue = tenueRecueParLaSeance(meilleuresAvant, "lecon-nouvelle", undefined);

  assertEquals(tenue, undefined);
});

for (const invalide of [0, 4, 1.5]) {
  Deno.test(`${invalide} étoile(s) pour la séance n'est pas un nombre d'étoiles valide`, () => {
    const meilleuresAvant = new Map<string, number>();

    assertThrows(() => tenueRecueParLaSeance(meilleuresAvant, "lecon-nouvelle", invalide), NombreDEtoilesInvalide);
  });
}
