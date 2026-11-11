import { assertEquals } from "@std/assert";
import { lireLecon } from "../../catalogue/domain/lire-lecon.ts";
import { NIVEAU_DES_PAROLES_FIXES, phrasesAFabriquer } from "./phrases-a-fabriquer.ts";
import { cleDePhrase } from "../domain/cle-de-phrase.ts";

function uneLecon(id: string, niveau: string, consigne: string) {
  return lireLecon({
    id,
    matiere: "francais",
    niveau,
    titre: "Les animaux de la ferme",
    ordre: 1,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [],
    exercices: [{
      type: "bulles",
      consigne,
      questions: [{ question: "Quel animal donne du lait ?", choix: ["vache", "poule"], reponse: "vache" }],
    }],
  });
}

const phrasesDe = (liste: ReturnType<typeof phrasesAFabriquer>) => liste.map(({ phrase }) => phrase);

Deno.test("chaque phrase dite dans une leçon donne une entrée avec sa clé, son niveau et sa leçon", () => {
  const lecon = uneLecon("fr-cp-ferme", "CP", "Choisis la bonne bulle. Prends ton temps.");

  const liste = phrasesAFabriquer([lecon], []);

  assertEquals(
    liste.find(({ phrase }) => phrase === "Choisis la bonne bulle."),
    { cle: cleDePhrase("Choisis la bonne bulle."), phrase: "Choisis la bonne bulle.", niveau: "CP", lecons: ["fr-cp-ferme"] },
  );
  assertEquals(phrasesDe(liste).includes("Prends ton temps."), true);
});

Deno.test("une phrase commune à deux leçons n'apparaît qu'une fois, avec les deux leçons", () => {
  const premiere = uneLecon("fr-cp-ferme", "CP", "Choisis la bonne bulle.");
  const seconde = uneLecon("fr-cp-jardin", "CP", "Choisis la bonne bulle.");

  const entrees = phrasesAFabriquer([premiere, seconde], []).filter(({ phrase }) => phrase === "Choisis la bonne bulle.");

  assertEquals(entrees.map(({ lecons }) => lecons), [["fr-cp-ferme", "fr-cp-jardin"]]);
});

Deno.test("les paroles fixes sont fabriquées avec le niveau commun", () => {
  const liste = phrasesAFabriquer([], ["Bravo, tu as réussi !"]);

  assertEquals(liste, [
    { cle: cleDePhrase("Bravo, tu as réussi !"), phrase: "Bravo, tu as réussi !", niveau: NIVEAU_DES_PAROLES_FIXES, lecons: [] },
  ]);
  assertEquals(NIVEAU_DES_PAROLES_FIXES, "commun");
});

Deno.test("un filtre par niveau ne garde que les phrases de ce niveau et les paroles fixes", () => {
  const cp = uneLecon("fr-cp-ferme", "CP", "Choisis la bonne bulle.");
  const ce1 = uneLecon("fr-ce1-ferme", "CE1", "Trouve la bonne réponse.");

  const phrases = phrasesDe(phrasesAFabriquer([cp, ce1], ["Bravo !"], { niveau: "CP" }));

  assertEquals(phrases.includes("Choisis la bonne bulle."), true);
  assertEquals(phrases.includes("Bravo !"), true);
  assertEquals(phrases.includes("Trouve la bonne réponse."), false);
});

Deno.test("la liste est triée par clé, quel que soit l'ordre des leçons", () => {
  const a = uneLecon("fr-cp-ferme", "CP", "Choisis la bonne bulle.");
  const b = uneLecon("fr-cp-jardin", "CP", "Trouve la bonne réponse.");

  const cles = phrasesAFabriquer([b, a], ["Bravo !"]).map(({ cle }) => cle);

  assertEquals(cles, [...cles].sort());
  assertEquals(phrasesAFabriquer([a, b], ["Bravo !"]), phrasesAFabriquer([b, a], ["Bravo !"]));
});

Deno.test("une phrase sans lettre ni chiffre n'est pas fabriquée", () => {
  const liste = phrasesAFabriquer([], ["...", "Bravo !", "  "]);

  assertEquals(phrasesDe(liste), ["Bravo !"]);
});
