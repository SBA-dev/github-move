import type { Page, Route } from "@playwright/test";
import type { LeconDuParcours } from "./bibliotheque-du-parcours.ts";

// Story #28 : bibliothèque de test des révisions, servie au navigateur À LA PLACE de la vraie bibliothèque
// (interception réseau de `/bibliotheque.json`). Identifiants préfixés « e2e-28- ».
// Chaque leçon a une étape de leçon et un seul exercice, sans aide.

const SECTION_DE_TEST = "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee";
const CITATION_DE_TEST = "Décoder et encoder de 25 à 30 CGP.";

export type QuestionDeRevisionDeTest = {
  readonly leconId: string;
  readonly leconTitre: string;
  readonly position: number;
  readonly type: "bulles" | "trous";
  readonly enonce: string;
  readonly choix: readonly string[];
  readonly reponse: string;
  readonly cle: string;
};

export function normaliserPourLaCle(texte: string): string {
  return texte.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

const ID_SONS = "e2e-28-francais-cp-10";
const ID_NOMBRES = "e2e-28-maths-cp-20";
const ID_TROUS = "e2e-28-francais-cp-30";

const SONS = [
  { question: "Quel mot a le son ou ?", choix: ["loup", "lit", "sac"], reponse: "loup" },
  { question: "Quel mot a le son on ?", choix: ["pont", "lune", "vélo"], reponse: "pont" },
  { question: "Quel mot a le son an ?", choix: ["gant", "bol", "mur"], reponse: "gant" },
];

const NOMBRES = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  return { question: `Combien font ${n} + ${n} ?`, choix: [String(2 * n), String(2 * n + 1), String(2 * n + 2)], reponse: String(2 * n) };
});

function lecon(id: string, matiere: string, ordre: number, titre: string, exercice: Record<string, unknown>): LeconDuParcours {
  return {
    id,
    titre,
    matiere,
    niveau: "CP",
    ordre,
    programme: { section: SECTION_DE_TEST, citation: CITATION_DE_TEST },
    lecon: [{ texte: `Voici la leçon « ${titre} ».`, exemples: [] }],
    exercices: [exercice],
  };
}

export const LECONS_DES_REVISIONS: readonly LeconDuParcours[] = [
  lecon(ID_NOMBRES, "maths", 20, "Les nombres de révision", { type: "bulles", titre: "Les doubles", questions: NOMBRES }),
  lecon(ID_TROUS, "francais", 30, "Le texte à trous de révision", {
    type: "trous",
    titre: "Au clair de la lune",
    consigne: "Complète la phrase.",
    texte: "Au clair de la [lune]",
    distracteurs: ["plume", "porte"],
  }),
  lecon(ID_SONS, "francais", 10, "Les sons de révision", { type: "bulles", titre: "Les sons", questions: SONS }),
];

function questionsBulles(leconId: string, leconTitre: string, liste: typeof SONS): QuestionDeRevisionDeTest[] {
  return liste.map((q) => ({
    leconId,
    leconTitre,
    position: 0,
    type: "bulles",
    enonce: q.question,
    choix: q.choix,
    reponse: q.reponse,
    cle: `b:${normaliserPourLaCle(q.question + q.reponse)}`,
  }));
}

export const QUESTIONS_DE_REVISION: readonly QuestionDeRevisionDeTest[] = [
  ...questionsBulles(ID_SONS, "Les sons de révision", SONS),
  ...questionsBulles(ID_NOMBRES, "Les nombres de révision", NOMBRES),
  {
    leconId: ID_TROUS,
    leconTitre: "Le texte à trous de révision",
    position: 0,
    type: "trous",
    enonce: "Au clair de la …",
    choix: ["lune", "plume", "porte"],
    reponse: "lune",
    cle: `t:${normaliserPourLaCle("Au clair de la …")}`,
  },
];

export function questionDeRevision(enonce: string): QuestionDeRevisionDeTest {
  const trouvee = QUESTIONS_DE_REVISION.find((q) => q.enonce === enonce);
  if (!trouvee) throw new Error(`Question de la bibliothèque de test des révisions inconnue : « ${enonce} »`);
  return trouvee;
}

/** La page prend le pas sur le contexte ; la route du contexte sert les pages ouvertes à côté. */
export async function servirLaBibliothequeDesRevisions(page: Page): Promise<void> {
  const servir = (route: Route) => route.fulfill({ json: LECONS_DES_REVISIONS });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}
