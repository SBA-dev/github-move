import { assertEquals } from "@std/assert";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import {
  NOM_DE_L_ECRAN_DES_MEDAILLES,
  parolesALOuverture,
  parolesDeLaSectionDesRecords,
  parolesDuGuideALOuverture,
  phraseLueDeLaPastille,
  TITRE_DES_RECORDS_DE_CALCUL_RAPIDE,
} from "./paroles-de-l-ecran-des-medailles.ts";

function pastille(meilleurScore: number): PastilleDeRecord {
  return {
    lecon: "lecon-1",
    exercice: "exercice-1",
    libelle: "Calcul rapide : tables de 3 et 4",
    meilleurScore,
  };
}

Deno.test("l'écran des médailles s'appelle « Mes médailles »", () => {
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

Deno.test("la section des records s'appelle « Mes records de calcul rapide »", () => {
  assertEquals(TITRE_DES_RECORDS_DE_CALCUL_RAPIDE, "Mes records de calcul rapide");
});

Deno.test("le bouton « Écouter » de la section des records lit son titre puis la phrase de chaque pastille dans l'ordre reçu", () => {
  const premiere = pastille(12);
  const seconde = { ...pastille(1), libelle: "Calcul rapide : tables de 5" };

  const paroles = parolesDeLaSectionDesRecords([premiere, seconde]);

  assertEquals(paroles, [
    "Mes records de calcul rapide",
    "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs",
    "Calcul rapide : tables de 5 : ton record est de 1 calcul",
  ]);
});

Deno.test("sans « Tout lire à voix haute », seule la phrase du personnage guide est lue à l'ouverture", () => {
  const paroles = parolesALOuverture({ toutLire: false, pastilles: [pastille(12)] });

  assertEquals(paroles, ["Regarde tout ce que tu as gagné !"]);
});

Deno.test("avec « Tout lire à voix haute », l'ouverture lit le personnage guide, le nom de l'écran puis la section des records", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [pastille(12)] });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "Mes records de calcul rapide",
    "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs",
  ]);
});

Deno.test("avec « Tout lire à voix haute » et rien à montrer, la phrase du premier record remplace celle de l'ouverture", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [] });

  assertEquals(paroles, [
    "Fais un calcul rapide pour gagner ton premier record !",
    "Mes médailles",
  ]);
});
