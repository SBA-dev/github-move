import { assert, assertEquals } from "@std/assert";
import { PALIERS_DE_LA_CABANE } from "./cabane.ts";
import { PALIERS_DES_TENUES } from "./tenues.ts";

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
