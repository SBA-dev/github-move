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
  { total: 74, nombreDObjets: 11, prochain: { nom: "l'étoile magique", etoilesManquantes: 1 } },
  { total: 75, nombreDObjets: 12 },
  { total: 100, nombreDObjets: 12 },
  { total: 795, nombreDObjets: 12 },
];

for (const { total, nombreDObjets, prochain } of EXEMPLES) {
  Deno.test(`avec ${total} étoiles, la cabane a ${nombreDObjets} objet(s) et ${
    prochain ? `attend ${prochain.nom} (encore ${prochain.etoilesManquantes})` : "est complète"
  }`, () => {
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
  });
}

for (const total of [-1, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
  Deno.test(`un total de ${total} étoiles n'est pas un total valide pour la cabane`, () => {
    assertThrows(() => cabaneDe(total), TotalDEtoilesInvalide);
  });
}
