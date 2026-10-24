import type { Page, Route } from "@playwright/test";

// Story #25 : bibliothèque de test du parcours, servie au navigateur À LA PLACE de la vraie bibliothèque
// (interception réseau de `/bibliotheque.json` : le fichier de l'application reste intact).
// Identifiants préfixés « e2e-25- » ; chaque leçon est faite d'un exercice bulles de deux questions à quatre choix.

export type LeconDuParcours = {
  id: string;
  titre: string;
  matiere: string;
  niveau: string;
  ordre: number;
  programme: { section: string; citation: string };
  lecon: Array<{ texte: string; exemples: string[] }>;
  exercices: Array<Record<string, unknown>>;
};

const SECTION_DE_TEST = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST = "Décoder et encoder de 25 à 30 CGP.";
const MOTS = ["loup", "mouton", "ballon", "maman"];

function leconDeTest(matiere: string, niveau: string, ordre: number, titre: string): LeconDuParcours {
  const id = `e2e-25-${matiere}-${niveau.toLowerCase()}-${ordre}`;
  return {
    id,
    titre,
    matiere,
    niveau,
    ordre,
    programme: { section: SECTION_DE_TEST, citation: CITATION_DE_TEST },
    lecon: [{ texte: `Voici la leçon « ${titre} ».`, exemples: [] }],
    exercices: [
      {
        type: "bulles",
        titre: `Bulles de « ${titre} »`,
        questions: Array.from({ length: 2 }, () => ({ question: "Touche le mot qui a le son ou.", choix: MOTS, reponse: MOTS[0] })),
      },
    ],
  };
}

// Servies dans le désordre, pour vérifier le tri par `ordre`.
export const LECONS_DU_PARCOURS: readonly LeconDuParcours[] = [
  leconDeTest("francais", "CE1", 30, "Les mots contraires"),
  leconDeTest("francais", "CE2", 30, "Le passé composé"),
  leconDeTest("maths", "CE1", 20, "Les compléments à 10"),
  leconDeTest("francais", "CE1", 10, "Le son in"),
  leconDeTest("francais", "CP", 20, "Les syllabes"),
  leconDeTest("emc", "CE2", 10, "Les règles de la classe"),
  leconDeTest("francais", "CE2", 10, "Le futur"),
  leconDeTest("francais", "CE1", 40, "Le pluriel des noms"),
  leconDeTest("sciences", "CP", 10, "Les cinq sens"),
  leconDeTest("francais", "CE1", 20, "L'ordre alphabétique"),
  leconDeTest("maths", "CE1", 10, "Les nombres jusqu'à 100"),
  leconDeTest("francais", "CP", 10, "Les voyelles"),
  leconDeTest("francais", "CE2", 20, "L'imparfait"),
];

/**
 * La page prend le pas sur le contexte : la route de la page passe avant l'interception « ajout de leçons » des autres
 * stories. La route du contexte sert les pages que l'étape « Léa voit la page de la leçon » ouvre à côté.
 */
export async function servirLaBibliothequeDuParcours(page: Page): Promise<void> {
  const servir = (route: Route) => route.fulfill({ json: LECONS_DU_PARCOURS });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}
