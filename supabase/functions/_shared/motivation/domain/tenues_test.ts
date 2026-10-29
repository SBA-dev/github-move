import { assert, assertEquals, assertThrows } from "@std/assert";
import { PALIERS_DE_LA_CABANE, TotalDEtoilesInvalide } from "./cabane.ts";
import { PALIERS_DES_TENUES, tenuesDe } from "./tenues.ts";

Deno.test("le personnage guide a quatre tenues, dans l'ordre, avec leur seuil, leur clé et leur nom", () => {
  const paliers = PALIERS_DES_TENUES.map((palier) => [palier.seuil, palier.tenue.cle, palier.tenue.nom]);

  assertEquals(paliers, [
    [5, "echarpe-rayee", "une écharpe rayée"],
    [12, "noeud-papillon", "un nœud papillon"],
    [23, "sac-a-dos-d-explorateur", "un sac à dos d'explorateur"],
    [37, "bottes-de-pluie", "des bottes de pluie"],
  ]);
});

Deno.test("les seuils des paliers des tenues sont strictement croissants", () => {
  const seuils = PALIERS_DES_TENUES.map((palier) => palier.seuil);

  seuils.slice(1).forEach((seuil, i) => assert(seuil > seuils[i], `${seuil} ne dépasse pas ${seuils[i]}`));
});

Deno.test("deux paliers consécutifs des tenues sont écartés d'au moins 3 étoiles, pour qu'une séance fasse recevoir au plus une tenue", () => {
  const seuils = PALIERS_DES_TENUES.map((palier) => palier.seuil);

  seuils.slice(1).forEach((seuil, i) => assert(seuil - seuils[i] >= 3, `${seuils[i]} puis ${seuil} : écart < 3`));
});

Deno.test("chaque tenue a une clé unique", () => {
  const cles = PALIERS_DES_TENUES.map((palier) => palier.tenue.cle);

  assertEquals(new Set(cles).size, PALIERS_DES_TENUES.length);
});

Deno.test("aucune tenue ne partage sa clé avec un objet de la cabane", () => {
  const clesDeLaCabane = new Set(PALIERS_DE_LA_CABANE.map((palier) => palier.objet.cle));

  PALIERS_DES_TENUES.forEach((palier) =>
    assert(!clesDeLaCabane.has(palier.tenue.cle), `${palier.tenue.cle} est aussi un objet de la cabane`)
  );
});

type Exemple = {
  total: number;
  nombreDeTenues: number;
  prochain?: { nom: string; seuil: number; etoilesManquantes: number };
};

const EXEMPLES: readonly Exemple[] = [
  { total: 0, nombreDeTenues: 0, prochain: { nom: "une écharpe rayée", seuil: 5, etoilesManquantes: 5 } },
  { total: 4, nombreDeTenues: 0, prochain: { nom: "une écharpe rayée", seuil: 5, etoilesManquantes: 1 } },
  { total: 5, nombreDeTenues: 1, prochain: { nom: "un nœud papillon", seuil: 12, etoilesManquantes: 7 } },
  { total: 11, nombreDeTenues: 1, prochain: { nom: "un nœud papillon", seuil: 12, etoilesManquantes: 1 } },
  {
    total: 12,
    nombreDeTenues: 2,
    prochain: { nom: "un sac à dos d'explorateur", seuil: 23, etoilesManquantes: 11 },
  },
  { total: 37, nombreDeTenues: 4 },
  { total: 50, nombreDeTenues: 4 },
];

for (const { total, nombreDeTenues, prochain } of EXEMPLES) {
  Deno.test(
    `avec ${total} étoiles, le personnage guide a reçu ${nombreDeTenues} tenue(s) et ${
      prochain ? `attend ${prochain.nom} (encore ${prochain.etoilesManquantes})` : "a reçu toutes ses tenues"
    }`,
    () => {
      const etat = tenuesDe(total);

      assertEquals(etat.total, total);
      assertEquals(etat.tenuesRecues, PALIERS_DES_TENUES.slice(0, nombreDeTenues).map((palier) => palier.tenue));
      assertEquals(
        etat.prochainPalier && {
          nom: etat.prochainPalier.tenue.nom,
          seuil: etat.prochainPalier.seuil,
          etoilesManquantes: etat.prochainPalier.etoilesManquantes,
        },
        prochain,
      );
      assertEquals(etat.toutesRecues, prochain === undefined);
    },
  );
}

for (const total of [-1, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
  Deno.test(`un total de ${total} étoiles n'est pas un total valide pour les tenues`, () => {
    assertThrows(() => tenuesDe(total), TotalDEtoilesInvalide);
  });
}
