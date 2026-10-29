import { assertEquals } from "@std/assert";
import { PALIERS_DES_TENUES, tenuesDe } from "./tenues.ts";
import { pastillesDesTenues } from "./pastilles-des-tenues.ts";

Deno.test("à 12 étoiles, les deux premières pastilles des tenues sont reçues et les suivantes affichent leur seuil", () => {
  const pastilles = pastillesDesTenues(tenuesDe(12));

  assertEquals(pastilles.length, PALIERS_DES_TENUES.length);
  assertEquals(pastilles[0], {
    cle: "echarpe-rayee",
    libelle: "une écharpe rayée",
    libelleLu: "une écharpe rayée",
    recue: true,
  });
  assertEquals(pastilles[1], {
    cle: "noeud-papillon",
    libelle: "un nœud papillon",
    libelleLu: "un nœud papillon",
    recue: true,
  });
  assertEquals(pastilles[2], {
    cle: "sac-a-dos-d-explorateur",
    libelle: "23 ★",
    libelleLu: "23 étoiles",
    recue: false,
  });
  assertEquals(pastilles[3], {
    cle: "bottes-de-pluie",
    libelle: "37 ★",
    libelleLu: "37 étoiles",
    recue: false,
  });
});
