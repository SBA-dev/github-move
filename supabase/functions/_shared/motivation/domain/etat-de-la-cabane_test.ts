import { assertEquals, assertThrows } from "@std/assert";
import { cabaneDe, PALIERS_DE_LA_CABANE, TotalDEtoilesInvalide } from "./cabane.ts";

type Exemple = {
  total: number;
  nombreDObjets: number;
  prochain?: { nom: string; etoilesManquantes: number };
};

const EXEMPLES: readonly Exemple[] = [
  { total: 0, nombreDObjets: 0, prochain: { nom: "une lanterne", etoilesManquantes: 3 } },
  { total: 1, nombreDObjets: 0, prochain: { nom: "une lanterne", etoilesManquantes: 2 } },
  { total: 2, nombreDObjets: 0, prochain: { nom: "une lanterne", etoilesManquantes: 1 } },
  { total: 3, nombreDObjets: 1, prochain: { nom: "un tapis tout doux", etoilesManquantes: 3 } },
  { total: 5, nombreDObjets: 1, prochain: { nom: "un tapis tout doux", etoilesManquantes: 1 } },
  { total: 6, nombreDObjets: 2, prochain: { nom: "un pot de fleurs", etoilesManquantes: 4 } },
  { total: 9, nombreDObjets: 2, prochain: { nom: "un pot de fleurs", etoilesManquantes: 1 } },
  { total: 10, nombreDObjets: 3, prochain: { nom: "une étagère de livres", etoilesManquantes: 5 } },
  { total: 14, nombreDObjets: 3, prochain: { nom: "une étagère de livres", etoilesManquantes: 1 } },
  { total: 15, nombreDObjets: 4, prochain: { nom: "un tableau", etoilesManquantes: 5 } },
  { total: 19, nombreDObjets: 4, prochain: { nom: "un tableau", etoilesManquantes: 1 } },
  { total: 20, nombreDObjets: 5, prochain: { nom: "un gros coussin", etoilesManquantes: 6 } },
  { total: 25, nombreDObjets: 5, prochain: { nom: "un gros coussin", etoilesManquantes: 1 } },
  { total: 26, nombreDObjets: 6, prochain: { nom: "une guirlande", etoilesManquantes: 7 } },
  { total: 32, nombreDObjets: 6, prochain: { nom: "une guirlande", etoilesManquantes: 1 } },
  { total: 33, nombreDObjets: 7, prochain: { nom: "un télescope", etoilesManquantes: 7 } },
  { total: 39, nombreDObjets: 7, prochain: { nom: "un télescope", etoilesManquantes: 1 } },
  { total: 40, nombreDObjets: 8, prochain: { nom: "un globe", etoilesManquantes: 8 } },
  { total: 47, nombreDObjets: 8, prochain: { nom: "un globe", etoilesManquantes: 1 } },
  { total: 48, nombreDObjets: 9, prochain: { nom: "une boîte à trésor", etoilesManquantes: 8 } },
  { total: 55, nombreDObjets: 9, prochain: { nom: "une boîte à trésor", etoilesManquantes: 1 } },
  { total: 56, nombreDObjets: 10, prochain: { nom: "une coupe dorée", etoilesManquantes: 9 } },
  { total: 64, nombreDObjets: 10, prochain: { nom: "une coupe dorée", etoilesManquantes: 1 } },
  { total: 65, nombreDObjets: 11, prochain: { nom: "l'étoile magique", etoilesManquantes: 10 } },
  { total: 74, nombreDObjets: 11, prochain: { nom: "l'étoile magique", etoilesManquantes: 1 } },
  { total: 75, nombreDObjets: 12 },
  { total: 100, nombreDObjets: 12 },
  { total: 795, nombreDObjets: 12 },
];

for (const { total, nombreDObjets, prochain } of EXEMPLES) {
  Deno.test(
    `avec ${total} étoiles, la cabane a ${nombreDObjets} objet(s) et ${
      prochain ? `attend ${prochain.nom} (encore ${prochain.etoilesManquantes})` : "est complète"
    }`,
    () => {
      const etat = cabaneDe(total);

      assertEquals(etat.total, total);
      assertEquals(etat.objetsRecus, PALIERS_DE_LA_CABANE.slice(0, nombreDObjets).map((palier) => palier.objet));
      assertEquals(
        etat.prochainPalier && {
          nom: etat.prochainPalier.objet.nom,
          etoilesManquantes: etat.prochainPalier.etoilesManquantes,
        },
        prochain,
      );
      assertEquals(etat.complete, prochain === undefined);
    },
  );
}

for (const total of [-1, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
  Deno.test(`un total de ${total} étoiles n'est pas un total valide pour la cabane`, () => {
    assertThrows(() => cabaneDe(total), TotalDEtoilesInvalide);
  });
}

Deno.test("les mêmes meilleures étoiles donnent toujours la même cabane", () => {
  assertEquals(cabaneDe(33), cabaneDe(33));
});
