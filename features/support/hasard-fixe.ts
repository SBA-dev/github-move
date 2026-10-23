// Fixe le tirage de la question du contrôle parental dans le navigateur (le front tire ses deux facteurs avec
// Math.random, via src/hasard-navigateur.ts : voir docs/stories/10/journal.md, « hasard figé par Math.random »).
//
// Honnêteté : on ne remplace pas le tirage de l'application, on lui donne des valeurs. Math.random n'est détourné que
// pour les appels qui viennent de hasard-navigateur (lu dans la pile d'appels) ; tous les autres appels (animations,
// identifiants…) gardent le vrai hasard. Une file de facteurs est déposée juste avant l'entrée dans l'espace parent.

import type { Page } from "@playwright/test";

const FACTEURS_PREVUS = "__facteursDuControleParental";

export async function installerLeHasardFixe(page: Page): Promise<void> {
  await page.addInitScript((cle) => {
    const reel = Math.random.bind(Math);
    Math.random = () => {
      const file = (window as unknown as Record<string, number[] | undefined>)[cle];
      if (file && file.length > 0 && new Error().stack?.includes("hasard-navigateur")) return file.shift() as number;
      return reel();
    };
  }, FACTEURS_PREVUS);
}

/** Facteur 6..9 -> valeur de Math.random qui fait tirer ce facteur par `min + floor(r * (max - min + 1))`. */
function valeurPourLeFacteur(facteur: number): number {
  return (facteur - 6) / 4 + 0.125;
}

export async function fixerLaProchaineQuestion(page: Page, premier: number, second: number): Promise<void> {
  await page.evaluate(
    ([cle, valeurs]) => {
      (window as unknown as Record<string, number[]>)[cle as string] = valeurs as number[];
    },
    [FACTEURS_PREVUS, [valeurPourLeFacteur(premier), valeurPourLeFacteur(second)]],
  );
}
