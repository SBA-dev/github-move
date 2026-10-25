import type { Page, Request } from "@playwright/test";

// Suivi des lectures que l'écran de fin lance pour trouver la leçon suivante : les résultats des leçons (REST) et la
// bibliothèque. Posé dès l'ouverture de la page, il voit les requêtes même quand elles partent avant que le test regarde.

const CHEMIN_DES_RESULTATS = "/rest/v1/resultats_des_lecons";
const CHEMINS_SUIVIS = [CHEMIN_DES_RESULTATS, "/bibliotheque.json"];

const REPERER_L_ECRAN_DE_FIN = `
  new MutationObserver((_, observateur) => {
    if (!document.querySelector('[data-testid="fin-de-seance"]')) return;
    window.__finDeSeanceMontee = Date.now();
    observateur.disconnect();
  }).observe(document, { childList: true, subtree: true });
`;

type Lecture = { readonly debut: number; fin?: number };

export class LecturesDesResultats {
  private readonly lectures = new Map<Request, Lecture>();

  static async suivre(page: Page): Promise<LecturesDesResultats> {
    const suivi = new LecturesDesResultats();
    await page.addInitScript(REPERER_L_ECRAN_DE_FIN);
    page.on("request", (requete) => {
      if (CHEMINS_SUIVIS.some((chemin) => requete.url().includes(chemin))) suivi.lectures.set(requete, { debut: Date.now() });
    });
    const terminer = (requete: Request) => {
      const lecture = suivi.lectures.get(requete);
      if (lecture) lecture.fin = Date.now();
    };
    page.on("requestfinished", terminer);
    page.on("requestfailed", terminer);
    return suivi;
  }

  /** Instant où l'écran de fin est apparu dans la page courante, ou `undefined` s'il n'y est pas encore. */
  static async instantDeLEcranDeFin(page: Page): Promise<number | undefined> {
    return page.evaluate(() => (window as unknown as { __finDeSeanceMontee?: number }).__finDeSeanceMontee);
  }

  /** Vrai quand aucune lecture n'est en cours et, si `resultatsAttendus`, qu'une lecture des résultats lancée depuis l'écran de fin est revenue. */
  sontRevenues(depuisLEcranDeFin: number, resultatsAttendus: boolean): boolean {
    const depuis = [...this.lectures.entries()].filter(([, lecture]) => lecture.debut >= depuisLEcranDeFin);
    const resultatsRevenus = depuis.some(([requete, lecture]) => lecture.fin !== undefined && requete.url().includes(CHEMIN_DES_RESULTATS));
    return (!resultatsAttendus || resultatsRevenus) && depuis.every(([, lecture]) => lecture.fin !== undefined);
  }
}
