import { assertEquals } from "@std/assert";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import {
  NOM_DE_L_ECRAN_DES_MEDAILLES,
  parolesDuGuideALOuverture,
  phraseLueDeLaPastille,
} from "./paroles-de-l-ecran-des-medailles.ts";

function pastille(meilleurScore: number): PastilleDeRecord {
  return {
    lecon: "lecon-1",
    exercice: "exercice-1",
    libelle: "Calcul rapide : tables de 3 et 4",
    meilleurScore,
  };
}

Deno.test("l'écran des trophées s'appelle « Mes médailles »", () => {
  assertEquals(NOM_DE_L_ECRAN_DES_MEDAILLES, "Mes médailles");
});

Deno.test("le personnage guide invite l'enfant à regarder ce qu'il a gagné quand l'écran a une section à montrer", () => {
  const paroles = parolesDuGuideALOuverture(["badges"]);

  assertEquals(paroles, "Regarde tout ce que tu as gagné !");
});

Deno.test("le personnage guide invite l'enfant à gagner son premier record quand l'écran n'a rien à montrer", () => {
  const paroles = parolesDuGuideALOuverture([]);

  assertEquals(paroles, "Fais un calcul rapide pour gagner ton premier record !");
});

Deno.test("la pastille de record est lue avec le libellé et le record au pluriel", () => {
  const phrase = phraseLueDeLaPastille(pastille(12));

  assertEquals(phrase, "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs");
});

Deno.test("la pastille d'un record de 1 calcul est lue au singulier", () => {
  const phrase = phraseLueDeLaPastille(pastille(1));

  assertEquals(phrase, "Calcul rapide : tables de 3 et 4 : ton record est de 1 calcul");
});
