import type { Page, Route } from "@playwright/test";
import type { LeconDuParcours } from "./bibliotheque-du-parcours.ts";

// Story #26 : bibliothèque de test des leçons des classes d'avant, servie au navigateur À LA PLACE de la vraie bibliothèque
// (interception réseau de `/bibliotheque.json` : le fichier de l'application reste intact).
// Deux chemins, deux usages : la route réseau (ci-dessous) sert la bibliothèque au navigateur ; l'étape « … est servie » range les mêmes
// leçons dans `injectees`, que les étapes de préparation (étoiles, test de départ) lisent pour retrouver un identifiant par son titre.
// Identifiants préfixés « e2e-26- » ; chaque leçon est faite d'un exercice bulles de deux questions à quatre choix.

const SECTION_DE_TEST = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST = "Décoder et encoder de 25 à 30 CGP.";
const MOTS = ["loup", "mouton", "ballon", "maman"];

function leconDeTest(id: string, matiere: string, niveau: string, ordre: number, titre: string): LeconDuParcours {
  return {
    id: `e2e-26-${id}`,
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

// Servies dans le désordre, pour vérifier les tris. Aucune leçon d'histoire, d'anglais, ni de CM2.
export const LECONS_DES_CLASSES_D_AVANT: readonly LeconDuParcours[] = [
  leconDeTest("fr-ce1-mots-contraires", "francais", "CE1", 30, "Les mots contraires"),
  leconDeTest("ma-cm1-fractions", "maths", "CM1", 10, "Les fractions"),
  leconDeTest("fr-ce2-imparfait", "francais", "CE2", 20, "L'imparfait"),
  leconDeTest("sc-cp-cinq-sens", "sciences", "CP", 10, "Les cinq sens"),
  leconDeTest("fr-ce1-son-in", "francais", "CE1", 10, "Le son in"),
  leconDeTest("emc-ce2-regles-classe", "emc", "CE2", 10, "Les règles de la classe"),
  leconDeTest("fr-cp-syllabes", "francais", "CP", 20, "Les syllabes"),
  leconDeTest("ma-ce2-tables-2", "maths", "CE2", 10, "Les tables de 2"),
  leconDeTest("fr-ce2-futur", "francais", "CE2", 10, "Le futur"),
  leconDeTest("ma-cp-compter-10", "maths", "CP", 10, "Compter jusqu'à 10"),
  leconDeTest("fr-ce1-ordre-alphabetique", "francais", "CE1", 20, "L'ordre alphabétique"),
  leconDeTest("fr-cp-voyelles", "francais", "CP", 10, "Les voyelles"),
  leconDeTest("ma-ce1-nombres-100", "maths", "CE1", 10, "Les nombres jusqu'à 100"),
];

/**
 * La page prend le pas sur le contexte : la route de la page passe avant l'interception « ajout de leçons » des autres
 * stories. La route du contexte sert les pages que l'étape « Léa voit la page de la leçon » ouvre à côté.
 */
export async function servirLaBibliothequeDesClassesDAvant(page: Page): Promise<void> {
  const servir = (route: Route) => route.fulfill({ json: LECONS_DES_CLASSES_D_AVANT });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}
