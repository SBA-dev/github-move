import type { Page, Route } from "@playwright/test";
import type { LeconDuParcours } from "./bibliotheque-du-parcours.ts";

// Story #190 : bibliothèque de test de l'horloge, servie au navigateur À LA PLACE de la vraie bibliothèque
// (interception réseau de `/bibliotheque.json`). Identifiants préfixés « e2e-190- ».
// Toutes les leçons sont des maths. Les leçons mal formées ou à la précision particulière des scénarios sont ajoutées
// par les étapes (voir `leconDHorlogeDeTest`).

const SECTION_DE_TEST = "c2-mathematiques-cp-les-quatre-operations";
const CITATION_DE_TEST =
  "Les quatre opérations sont mobilisées au CP lors de la résolution de problèmes qui fournit un cadre permettant de donner du sens aux opérations.";

export type ItemDHorlogeDeTest = { heure: string; moment?: "matin" | "apres-midi"; aide?: string };
export type ExerciceDHorlogeDeTest = Record<string, unknown> & { titre: string; items?: readonly ItemDHorlogeDeTest[] };

export function leconDHorlogeDeTest(
  id: string,
  titre: string,
  niveau: string,
  ordre: number,
  exercice: Record<string, unknown>,
): LeconDuParcours {
  return {
    id,
    titre,
    matiere: "maths",
    niveau,
    ordre,
    programme: { section: SECTION_DE_TEST, citation: CITATION_DE_TEST },
    lecon: [],
    exercices: [exercice],
  };
}

export const LECONS_DE_L_HORLOGE: readonly LeconDuParcours[] = [
  leconDHorlogeDeTest("e2e-190-cp-heure-pile", "Lire l'heure pile", "CP", 10, {
    type: "horloge",
    titre: "L'heure pile",
    mode: "lire",
    items: [
      { heure: "3:00" },
      { heure: "9:00", aide: "La petite aiguille est sur le 9." },
      { heure: "12:00" },
    ],
  }),
  leconDHorlogeDeTest("e2e-190-ce1-quarts-d-heure", "Les quarts d'heure", "CE1", 10, {
    type: "horloge",
    titre: "Je lis les quarts d'heure",
    mode: "lire",
    items: [{ heure: "2:15" }, { heure: "9:45" }, { heure: "15:00" }],
  }),
  leconDHorlogeDeTest("e2e-190-ce1-matin-apres-midi", "Le matin et l'après-midi", "CE1", 20, {
    type: "horloge",
    titre: "Matin ou après-midi ?",
    mode: "lire",
    items: [{
      heure: "15:00",
      moment: "apres-midi",
      aide: "L'après-midi, on continue de compter après 12 : 13 h, 14 h, 15 h.",
    }],
  }),
];

/** La page prend le pas sur le contexte ; la route du contexte sert les pages ouvertes à côté. */
export async function servirLaBibliothequeDeLHorloge(page: Page, leconsServies: () => readonly LeconDuParcours[]): Promise<void> {
  const servir = (route: Route) => route.fulfill({ json: leconsServies() });
  await page.context().route("**/bibliotheque.json", servir);
  await page.route("**/bibliotheque.json", servir);
}
