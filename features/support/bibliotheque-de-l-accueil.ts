import type { Page, Route } from "@playwright/test";
import { enonceDeLaQuestion, REPONSE_JUSTE } from "./bibliotheque-du-test-de-depart.ts";
import { LECONS_DES_REVISIONS } from "./bibliotheque-des-revisions.ts";
import type { LeconDuParcours } from "./bibliotheque-du-parcours.ts";

// Story #29 : bibliothèque de test de l'accueil, servie au navigateur À LA PLACE de la vraie bibliothèque
// (interception réseau de `/bibliotheque.json` : le fichier de l'application reste intact).
// Identifiants préfixés « e2e-29- » ; chaque leçon est faite d'un exercice bulles de deux questions à quatre choix
// (« <titre> : quelle est la bonne réponse ? », réponse « oui »), ce qui permet aussi de jouer le test de départ de #27
// avec ses étapes : la question posée dit de quelle leçon elle vient.
// « Les sons de révision » (reprise de la leçon de #28) a trois questions, une par son (ou, on, an).

const SECTION_DE_TEST = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST = "Décoder et encoder de 25 à 30 CGP.";
const CHOIX = [REPONSE_JUSTE, "non", "peut-être", "jamais"];

function leconDeTest(matiere: string, niveau: string, ordre: number, titre: string, questions = 2): LeconDuParcours {
  return {
    id: `e2e-29-${matiere}-${niveau.toLowerCase()}-${ordre}`,
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
        questions: Array.from({ length: questions }, () => ({ question: enonceDeLaQuestion(titre), choix: CHOIX, reponse: REPONSE_JUSTE })),
      },
    ],
  };
}

// « Les sons de révision » est la leçon de #28 telle quelle (même identifiant, mêmes questions « Quel mot a le son ou ? »…),
// pour que les étapes de #28 préparent et jouent la file de révision ; seul son ordre change.
function leconDesSonsDeRevision(): LeconDuParcours {
  const sons = LECONS_DES_REVISIONS.find((lecon) => lecon.titre === "Les sons de révision");
  if (sons === undefined) throw new Error("La leçon « Les sons de révision » manque à la bibliothèque de test des révisions");
  return { ...sons, ordre: 30 };
}

// Servies dans le désordre, pour vérifier les tris. Aucune leçon d'histoire, d'anglais, ni de CM1 ou de CM2.
export const LECONS_DE_L_ACCUEIL: readonly LeconDuParcours[] = [
  leconDeTest("francais", "CE1", 30, "Les mots contraires"),
  leconDeTest("francais", "CE2", 10, "Le futur"),
  leconDeTest("maths", "CE1", 20, "Les compléments à 10"),
  leconDeTest("francais", "CE1", 10, "Le son in"),
  leconDeTest("francais", "CP", 20, "Les syllabes"),
  leconDeTest("emc", "CE1", 10, "Le respect des autres"),
  leconDeTest("francais", "CE1", 40, "Le pluriel des noms"),
  leconDeTest("sciences", "CP", 10, "Les cinq sens"),
  leconDeTest("francais", "CE1", 20, "L'ordre alphabétique"),
  leconDeTest("sciences", "CE1", 10, "Les êtres vivants"),
  leconDeTest("maths", "CE1", 10, "Les nombres jusqu'à 100"),
  leconDesSonsDeRevision(),
  leconDeTest("francais", "CP", 10, "Les voyelles"),
];

export async function servirLaBibliothequeDeLAccueil(page: Page): Promise<void> {
  const servir = (route: Route) => route.fulfill({ json: LECONS_DE_L_ACCUEIL });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}

/** Les scénarios de #29 qui ne sont pas aussi ceux de #24, #25 ou #26 jouent avec la bibliothèque de test de l'accueil. */
export function utiliseLaBibliothequeDeLAccueil(tags: readonly string[]): boolean {
  return tags.includes("@issue-29") && !["@issue-24", "@issue-25", "@issue-26"].some((tag) => tags.includes(tag));
}
