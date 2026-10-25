import { assert, assertEquals } from "@std/assert";
import { PALIERS_DE_LA_CABANE } from "./cabane.ts";

Deno.test("la cabane a douze paliers, dans l'ordre, avec leur seuil et leur objet", () => {
  const paliers = PALIERS_DE_LA_CABANE.map((palier) => [palier.seuil, palier.objet.nom]);

  assertEquals(paliers, [
    [3, "une lanterne"],
    [6, "un tapis tout doux"],
    [10, "un pot de fleurs"],
    [15, "une étagère de livres"],
    [20, "un tableau"],
    [26, "un gros coussin"],
    [33, "une guirlande"],
    [40, "un télescope"],
    [48, "un globe"],
    [56, "une boîte à trésor"],
    [65, "une coupe dorée"],
    [75, "l'étoile magique"],
  ]);
});

Deno.test("les seuils des paliers de la cabane sont strictement croissants", () => {
  const seuils = PALIERS_DE_LA_CABANE.map((palier) => palier.seuil);

  seuils.slice(1).forEach((seuil, i) => assert(seuil > seuils[i], `${seuil} ne dépasse pas ${seuils[i]}`));
});

Deno.test("deux paliers consécutifs de la cabane sont écartés d'au moins 3 étoiles, pour qu'une séance fasse recevoir au plus un objet", () => {
  const seuils = PALIERS_DE_LA_CABANE.map((palier) => palier.seuil);

  seuils.slice(1).forEach((seuil, i) => assert(seuil - seuils[i] >= 3, `${seuils[i]} puis ${seuil} : écart < 3`));
});

Deno.test("chaque objet de la cabane a une clé unique", () => {
  const cles = PALIERS_DE_LA_CABANE.map((palier) => palier.objet.cle);

  assertEquals(new Set(cles).size, PALIERS_DE_LA_CABANE.length);
});

Deno.test("aucun objet de la cabane n'est un trophée", () => {
  const noms = PALIERS_DE_LA_CABANE.map((palier) => palier.objet.nom.toLowerCase());

  assertEquals(noms.filter((nom) => nom.includes("trophée")), []);
});
