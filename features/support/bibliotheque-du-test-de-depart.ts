import type { Page, Route } from "@playwright/test";
import type { LeconDuParcours } from "./bibliotheque-du-parcours.ts";

// Story #27 : bibliothèque de test du test de départ, servie au navigateur À LA PLACE de la vraie bibliothèque
// (interception réseau de `/bibliotheque.json` : le fichier de l'application reste intact).
// Identifiants préfixés « e2e-27- » ; chaque leçon a une étape de leçon et un seul exercice bulles d'une seule question
// « <titre> : quelle est la bonne réponse ? », de choix « oui », « non » et « peut-être », de réponse « oui », sans aide.
// Seule « La dictée des sons » a un seul exercice de dictée : aucune question n'est possible dans cette leçon.

export const REPONSE_JUSTE = "oui";
export const CHOIX_FAUX = ["non", "peut-être"] as const;

const SECTION_DE_TEST = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST = "Décoder et encoder de 25 à 30 CGP.";

export function enonceDeLaQuestion(titre: string): string {
  return `${titre} : quelle est la bonne réponse ?`;
}

export function titreDeLaQuestion(enonce: string): string {
  return enonce.replace(/ : quelle est la bonne réponse \?$/, "");
}

function exerciceDe(titre: string, dictee: boolean): Record<string, unknown> {
  if (dictee) return { type: "dictee", titre: `Dictée de « ${titre} »`, mots: [{ mot: "ami" }] };
  return {
    type: "bulles",
    titre: `Bulles de « ${titre} »`,
    questions: [{ question: enonceDeLaQuestion(titre), choix: [REPONSE_JUSTE, ...CHOIX_FAUX], reponse: REPONSE_JUSTE }],
  };
}

function leconDeTest(matiere: string, niveau: string, ordre: number, titre: string, dictee = false): LeconDuParcours {
  return {
    id: `e2e-27-${matiere}-${niveau.toLowerCase()}-${ordre}`,
    titre,
    matiere,
    niveau,
    ordre,
    programme: { section: SECTION_DE_TEST, citation: CITATION_DE_TEST },
    lecon: [{ texte: `Voici la leçon « ${titre} ».`, exemples: [] }],
    exercices: [exerciceDe(titre, dictee)],
  };
}

// Servies dans le désordre, pour vérifier les tris par niveau, par `ordre` et par matière.
export const LECONS_DU_TEST_DE_DEPART: readonly LeconDuParcours[] = [
  leconDeTest("maths", "CE1", 35, "La soustraction"),
  leconDeTest("francais", "CE2", 10, "Le futur"),
  leconDeTest("francais", "CP", 40, "Le son on"),
  leconDeTest("maths", "CP", 25, "Les nombres jusqu'à 20"),
  leconDeTest("francais", "CE1", 40, "Le pluriel des noms"),
  leconDeTest("sciences", "CP", 10, "Les cinq sens"),
  leconDeTest("francais", "CP", 10, "Les voyelles"),
  leconDeTest("maths", "CE1", 45, "Les tables de 2"),
  leconDeTest("francais", "CE1", 10, "Le son in"),
  leconDeTest("maths", "CP", 45, "Les additions"),
  leconDeTest("francais", "CP", 18, "La dictée des sons", true),
  leconDeTest("francais", "CE1", 30, "Les mots contraires"),
  leconDeTest("maths", "CP", 15, "Compter jusqu'à 10"),
  leconDeTest("francais", "CP", 50, "Le son an"),
  leconDeTest("maths", "CE1", 15, "Les nombres jusqu'à 100"),
  leconDeTest("francais", "CE1", 20, "L'ordre alphabétique"),
  leconDeTest("francais", "CP", 30, "Le son ou"),
  leconDeTest("maths", "CP", 35, "Les doubles"),
  leconDeTest("francais", "CE1", 50, "Le féminin des noms"),
  leconDeTest("maths", "CE1", 25, "Les compléments à 10"),
  leconDeTest("francais", "CP", 20, "Les syllabes"),
];

/**
 * La page prend le pas sur le contexte : la route de la page passe avant l'interception « ajout de leçons » des autres
 * stories. La route du contexte sert les pages que le scénario ouvre à côté.
 */
export async function servirLaBibliothequeDuTestDeDepart(page: Page): Promise<void> {
  const servir = (route: Route) => route.fulfill({ json: LECONS_DU_TEST_DE_DEPART });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}

/** La bibliothèque ne peut pas être chargée : la dernière route déclarée l'emporte sur celles qui servent des leçons. */
export async function refuserLaBibliotheque(page: Page): Promise<void> {
  const refuser = (route: Route) => route.abort("failed");
  await page.context().route("**/bibliotheque.json", refuser);
  await page.route("**/bibliotheque.json", refuser);
}

// --- Lectures du résultat du test de départ en cours : l'accueil de l'enfant ne connaît « Mon test de départ » qu'une fois lues.

const ADRESSE_DU_RESULTAT = "/rest/v1/resultats_des_tests_de_depart";
const lecturesEnCours = new WeakMap<Page, { enCours: number }>();

/** À appeler avant la première navigation de la page : compte les lectures du résultat du test de départ qui n'ont pas fini. */
export function suivreLesLecturesDuResultat(page: Page): void {
  if (lecturesEnCours.has(page)) return;
  const suivi = { enCours: 0 };
  lecturesEnCours.set(page, suivi);
  const concerne = (url: string) => url.includes(ADRESSE_DU_RESULTAT);
  page.on("request", (requete) => {
    if (concerne(requete.url())) suivi.enCours += 1;
  });
  const fini = (requete: { url(): string }) => {
    if (concerne(requete.url())) suivi.enCours = Math.max(0, suivi.enCours - 1);
  };
  page.on("requestfinished", fini);
  page.on("requestfailed", fini);
}

export function lecturesDuResultatEnCours(page: Page): number {
  return lecturesEnCours.get(page)?.enCours ?? 0;
}
