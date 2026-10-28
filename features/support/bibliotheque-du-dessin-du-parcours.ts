import type { Page, Route } from "@playwright/test";
import type { LeconDuParcours } from "./bibliotheque-du-parcours.ts";

// Story #99 : bibliothèque de test du dessin du parcours, servie au navigateur À LA PLACE de la vraie bibliothèque
// (interception réseau de `/bibliotheque.json` : le fichier de l'application reste intact).
// Identifiants préfixés « e2e-99- » ; chaque leçon est faite d'un exercice bulles de deux questions à quatre choix.

const SECTION_DE_TEST = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST = "Décoder et encoder de 25 à 30 CGP.";
const MOTS = ["loup", "lapin", "ballon", "maman"];
const NOMBRE_DE_LECONS_DE_MATHS = 31;

function leconDeTest(matiere: string, niveau: string, ordre: number, titre: string): LeconDuParcours {
  return {
    id: `e2e-99-${matiere}-${niveau.toLowerCase()}-${ordre}`,
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

const MATHS_DU_CE1 = Array.from({ length: NOMBRE_DE_LECONS_DE_MATHS }, (_, rang) => leconDeTest("maths", "CE1", (rang + 1) * 10, `Maths ${rang + 1}`));

// Servies dans le désordre, pour vérifier le tri par `ordre`.
export const LECONS_DU_DESSIN: readonly LeconDuParcours[] = [
  leconDeTest("francais", "CE1", 30, "Les mots contraires"),
  ...MATHS_DU_CE1.slice(15),
  leconDeTest("francais", "CE2", 20, "L'imparfait"),
  leconDeTest("francais", "CE1", 10, "Le son in"),
  leconDeTest("francais", "CE1", 60, "Les accents"),
  leconDeTest("francais", "CE1", 40, "Le pluriel des noms"),
  ...MATHS_DU_CE1.slice(0, 15),
  leconDeTest("francais", "CE2", 10, "Le futur"),
  leconDeTest("francais", "CE1", 50, "Le féminin des noms"),
  leconDeTest("francais", "CE1", 20, "L'ordre alphabétique"),
  leconDeTest("francais", "CP", 10, "Les voyelles"),
];

/**
 * La page prend le pas sur le contexte : la route de la page passe avant l'interception « ajout de leçons » des autres
 * stories. La route du contexte sert les pages que l'étape « Léa voit la page de la leçon » ouvre à côté.
 */
export async function servirLaBibliothequeDuDessin(page: Page): Promise<void> {
  const servir = (route: Route) => route.fulfill({ json: LECONS_DU_DESSIN });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}
