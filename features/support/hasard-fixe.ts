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

// Story #106 : le tirage de la variante de la célébration de l'univers. Même principe : on ne remplace pas le tirage de
// l'application, on lui donne une valeur, et seulement pour le tirage fait par la fin du défi (lu dans la pile d'appels).
// Le tirage prend la forme `floor(r * 3)` (src/hasard-navigateur.ts) : 0.1 -> glissade, 0.5 -> avion, 0.9 -> danse.

const TIRAGE_DE_LA_CELEBRATION = "__tirageDeLaCelebration";

export type VarianteTiree = "glissade" | "avion" | "danse";

const VALEUR_POUR_LA_VARIANTE: Record<VarianteTiree, number> = { glissade: 0.1, avion: 0.5, danse: 0.9 };

export async function installerLeHasardDeLaCelebration(page: Page): Promise<void> {
  await page.addInitScript((cle) => {
    const reel = Math.random.bind(Math);
    Math.random = () => {
      const fenetre = window as unknown as Record<string, number | undefined>;
      const prevu = fenetre[cle];
      if (prevu === undefined) return reel();
      const limite = Error.stackTraceLimit;
      Error.stackTraceLimit = 50;
      const pile = new Error().stack ?? "";
      Error.stackTraceLimit = limite;
      if (!pile.includes("hasard-navigateur") || !pile.includes("FinDuDefi")) return reel();
      delete fenetre[cle];
      return prevu;
    };
  }, TIRAGE_DE_LA_CELEBRATION);
}

export async function fixerLeTirageDeLaCelebration(page: Page, variante: VarianteTiree): Promise<void> {
  await page.evaluate(
    ([cle, valeur]) => {
      (window as unknown as Record<string, number>)[cle as string] = valeur as number;
    },
    [TIRAGE_DE_LA_CELEBRATION, VALEUR_POUR_LA_VARIANTE[variante]],
  );
}
