import { assertEquals } from "@std/assert";
import { lireLecon } from "./lire-lecon.ts";
import { lireSectionDuProgramme } from "./lire-section-du-programme.ts";
import { pageDeLaLecon } from "./page-de-la-lecon.ts";

const SECTION_FRANCAIS = {
  id: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
  matiere: "francais",
  niveaux: ["CP"],
  domaine: "Lecture",
  section: "Identifier les mots de manière de plus en plus aisée",
  ordre: 0,
  source: {
    texte: "Programme de français du cycle 2",
    bo: "BO n° 41 du 31 octobre 2024",
    fichier: "sources/pdf/c2-francais.pdf",
  },
  extrait: "Objectifs d’apprentissage",
};

const SECTION_MATHS = {
  id: "c2-mathematiques-cp-les-quatre-operations",
  matiere: "maths",
  niveaux: ["CP"],
  domaine: "Nombres, calcul et résolution de problèmes",
  section: "Les quatre opérations",
  ordre: 1,
  source: {
    texte: "Programme de mathématiques du cycle 2",
    bo: "BO n° 41 du 31 octobre 2024",
    fichier: "sources/pdf/c2-mathematiques.pdf",
  },
  extrait: "Les quatre opérations",
};

function leconSonsOuOnAn() {
  return lireLecon({
    id: "fr-cp-sons-ou-on-an",
    matiere: "francais",
    niveau: "CP",
    titre: "Les sons ou, on, an",
    ordre: 5,
    programme: {
      section: SECTION_FRANCAIS.id,
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [{ texte: "O et U ensemble font le son « ou ».", exemples: [] }],
    exercices: [
      {
        type: "bulles",
        titre: "Quel son entends-tu ?",
        questions: [{ question: "Quel son ?", choix: ["ou", "on"], reponse: "ou" }],
      },
      { type: "classer", titre: "Les maisons des sons", items: [{ texte: "loup", groupe: "1" }] },
    ],
  });
}

function leconBoiteAjouter() {
  return lireLecon({
    id: "ma-cp-boite-ajouter",
    matiere: "maths",
    niveau: "CP",
    titre: "La boîte à jetons : ajouter",
    ordre: 10,
    programme: {
      section: SECTION_MATHS.id,
      citation: "Les quatre opérations sont mobilisées au CP lors de la résolution de problèmes.",
    },
    lecon: [{ texte: "Je vais mettre des jetons dans une boîte.", exemples: [] }],
    exercices: [{ type: "boite", titre: "Combien dans la boîte ?", items: [{ a: 4, op: "+", b: 3 }] }],
    guide: {
      titre: "Pour enseigner les nombres, le calcul et la résolution de problèmes au CP",
      page: 53,
      extrait:
        "La situation de la boîte est une situation de référence pour enseigner ce passage du comptage au calcul.",
      fichier: "sources/guides/guide-boite.pdf",
    },
  });
}

Deno.test("la page de la leçon montre le titre, le niveau et la matière", () => {
  const page = pageDeLaLecon(leconSonsOuOnAn());

  assertEquals(page.titre, "Les sons ou, on, an");
  assertEquals(page.niveauEtMatiere, "CP · Français");
});

Deno.test("la page propose chaque exercice dans l'ordre, avec sa position, le libellé de son type et son titre", () => {
  const page = pageDeLaLecon(leconSonsOuOnAn());

  assertEquals(page.exercicesProposes, [
    { position: 0, libelle: "Bulles-réponses", intitule: "Quel son entends-tu ?" },
    { position: 1, libelle: "Ranger dans les maisons", intitule: "Les maisons des sons" },
  ]);
});

Deno.test("un exercice sans titre est proposé sous le libellé de son type", () => {
  const lecon = lireLecon({
    id: "ma-cp-calcul",
    matiere: "maths",
    niveau: "CP",
    titre: "Calculer",
    ordre: 1,
    programme: { section: SECTION_MATHS.id, citation: "Calculer." },
    lecon: [{ texte: "On calcule.", exemples: [] }],
    exercices: [{ type: "calcul" }],
  });

  assertEquals(pageDeLaLecon(lecon).exercicesProposes, [
    { position: 0, libelle: "Calcul", intitule: "Calcul" },
  ]);
});

Deno.test("le passage pour les adultes donne la citation et la source de la section du programme", () => {
  const section = lireSectionDuProgramme(SECTION_FRANCAIS);

  const passage = pageDeLaLecon(leconSonsOuOnAn(), section).passagePourLesAdultes;

  assertEquals(passage.citation, "Décoder et encoder de 25 à 30 CGP.");
  assertEquals(
    passage.source,
    "Programme de français du cycle 2, BO n° 41 du 31 octobre 2024 — Lecture › Identifier les mots de manière de plus en plus aisée (CP)",
  );
});

Deno.test("les niveaux de la section sont joints par une virgule dans la source", () => {
  const section = lireSectionDuProgramme({ ...SECTION_FRANCAIS, niveaux: ["CP", "CE1"] });

  const passage = pageDeLaLecon(leconSonsOuOnAn(), section).passagePourLesAdultes;

  assertEquals(passage.source?.endsWith("(CP, CE1)"), true);
});

Deno.test("sans section du programme fournie, le passage pour les adultes n'a pas de source", () => {
  const passage = pageDeLaLecon(leconSonsOuOnAn()).passagePourLesAdultes;

  assertEquals(passage.citation, "Décoder et encoder de 25 à 30 CGP.");
  assertEquals(passage.source, undefined);
});

Deno.test("une leçon sans guide fondamental n'a aucun guide dans le passage pour les adultes", () => {
  const passage = pageDeLaLecon(leconSonsOuOnAn()).passagePourLesAdultes;

  assertEquals(passage.guide, undefined);
});

Deno.test("le passage du guide fondamental donne son extrait et sa référence avec la page", () => {
  const section = lireSectionDuProgramme(SECTION_MATHS);

  const passage = pageDeLaLecon(leconBoiteAjouter(), section).passagePourLesAdultes;

  assertEquals(passage.guide, {
    extrait: "La situation de la boîte est une situation de référence pour enseigner ce passage du comptage au calcul.",
    reference:
      "Guide fondamental « Pour enseigner les nombres, le calcul et la résolution de problèmes au CP » (Eduscol), page 53.",
  });
});

Deno.test("la page de la leçon est en lecture seule, y compris ses exercices proposés", () => {
  const page = pageDeLaLecon(leconSonsOuOnAn(), lireSectionDuProgramme(SECTION_FRANCAIS));

  assertEquals(Object.isFrozen(page), true);
  assertEquals(Object.isFrozen(page.exercicesProposes), true);
  assertEquals(Object.isFrozen(page.exercicesProposes[0]), true);
  assertEquals(Object.isFrozen(page.passagePourLesAdultes), true);
});
