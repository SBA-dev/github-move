import { expect, type Page } from "@playwright/test";
import type { Famille } from "../support/famille.ts";
import { adressesDesParolesCommunes, adressesDesSonsDeLaLecon } from "../support/sons-de-phrases.ts";
import {
  BIBLIOTHEQUE,
  commencerLaSeanceComplete,
  commencerSeulementLExercice,
  etat,
  jouerLaSeanceComplete,
  leconDeTitre,
  ouvrirLaPageDeLaLecon,
  texteLuDeLEtape,
} from "./etapes-puis-exercices.steps.ts";
import { exerciceEnCours, poserDansLaMaison } from "./classer-ordre-trous.steps.ts";
import { allerALaQuestion, bulleDeChoix, questionsDeLaSeance } from "./exercices-a-choix.steps.ts";
import { Given, type Monde, Then, When } from "./fixtures.ts";
import { jouerAvecLeProfilReel } from "./profil-reel.ts";
import { verifierQueLaVoixDeLApplicationLit } from "./voix-de-l-application.steps.ts";
import { preparerLaPage, scenario, terminerLaLecture } from "./voix.steps.ts";

// Story #182, règle R8 (scénarios @pwa, build de production) : une leçon lancée avec le réseau se lit jusqu'au bout sans réseau.
// Le répertoire des sons est le vrai (celui du build) et le service worker garde les sons de la leçon (réserve « savanturier-voix »).
// Hors ligne, le profil de Léa ne se choisit plus : Léa est choisie avec le réseau, puis l'application est utilisée sans recharger.

const CACHE_DES_SONS_DE_PHRASES = "savanturier-voix";
const DELAI_DE_LA_RESERVE_MS = 30_000;
const DUREE_D_UNE_SEANCE_COMPLETE_MS = 240_000;

async function sonsEnReserve(page: Page): Promise<string[]> {
  return await page.evaluate(async (nom) => {
    const cache = await caches.open(nom);
    return (await cache.keys()).map((requete) => new URL(requete.url).pathname).filter((chemin) => chemin.endsWith(".mp3"));
  }, CACHE_DES_SONS_DE_PHRASES);
}

async function attendreQueLesSonsSoientEnReserve(page: Page, adresses: readonly string[]) {
  await expect.poll(async () => {
    const gardes = await sonsEnReserve(page);
    return adresses.filter((adresse) => !gardes.includes(adresse));
  }, { intervals: [300], timeout: DELAI_DE_LA_RESERVE_MS, message: "le service worker garde les sons de la leçon" }).toEqual([]);
}

/** La mise en réserve de la leçon suivante est lancée par l'écran de fin : on attend que la réserve ne grossisse plus. */
async function attendreQueLaReserveSeStabilise(page: Page) {
  let precedent = -1;
  let stables = 0;
  await expect.poll(async () => {
    const nombre = (await sonsEnReserve(page)).length;
    stables = nombre === precedent ? stables + 1 : 0;
    precedent = nombre;
    return stables >= 4;
  }, { intervals: [400], timeout: DELAI_DE_LA_RESERVE_MS }).toBe(true);
}

/**
 * Joue la séance en cours jusqu'à l'écran de fin, sans erreur, comme un enfant : continuer, dire « J'ai écouté », répondre aux
 * questions à choix et ranger chaque étiquette dans sa maison.
 */
async function jouerLaSeanceJusquALaFin(page: Page) {
  const questions = questionsDeLaSeance(page);
  await expect.poll(async () => {
    if (await page.getByTestId("fin-de-seance").isVisible()) return true;
    // Le faux navigateur ne termine une parole que sur demande : l'enfant a écouté, la séance continue.
    await terminerLaLecture(page);
    const continuer = page.getByRole("button", { name: "Continuer", exact: true });
    if (await continuer.isVisible()) {
      await continuer.click();
      return false;
    }
    const jAiEcoute = page.getByTestId("j-ai-ecoute");
    if (await jAiEcoute.isVisible()) {
      await jAiEcoute.click();
      return false;
    }
    const etiquette = page.getByTestId("etiquette").first();
    if (await etiquette.isVisible()) {
      const exercice = await exerciceEnCours(page);
      const groupes = exercice.groupes as Array<{ id: string; nom: string }>;
      const items = exercice.items as Array<{ texte: string; groupe: string }>;
      const texte = ((await etiquette.textContent()) ?? "").trim();
      const nomDeLaMaison = groupes.find((groupe) => groupe.id === items.find((item) => item.texte === texte)?.groupe)?.nom;
      if (nomDeLaMaison === undefined) throw new Error(`Aucune maison pour l'étiquette « ${texte} »`);
      await poserDansLaMaison(page, texte, nomDeLaMaison, "toucher");
      return false;
    }
    if (await page.getByTestId("choix-de-la-question").isVisible()) {
      const affichee = ((await page.getByTestId("question").textContent()) ?? "").trim();
      const question = questions.find((candidate) => candidate.enonce === affichee);
      if (question === undefined) throw new Error(`Question inconnue : « ${affichee} »`);
      const reponse = bulleDeChoix(page, question.reponse);
      if ((await reponse.getAttribute("aria-disabled")) !== "true") await reponse.click();
    }
    return false;
  }, { intervals: [100], timeout: DUREE_D_UNE_SEANCE_COMPLETE_MS - 60_000 }).toBe(true);
}

/** Léa joue avec son vrai profil (créé pour Paul) : Paul est connecté et Léa s'est choisie dans « Qui joue ? ». */
async function jouerAvecLeProfilDeLaTablette(page: Page, famille: Famille, monde: Monde) {
  await preparerLaPage(page, scenario(page));
  if ((await famille.session(page)) === null) await famille.connecterSansEmail("tablette", "Paul");
  await jouerAvecLeProfilReel(famille, monde, page);
}

Given(
  /^Léa a commencé avec le réseau la séance complète de la leçon « ([^«»]+) »$/,
  async ({ page, famille, monde, $testInfo }, titre: string) => {
    $testInfo.setTimeout(DUREE_D_UNE_SEANCE_COMPLETE_MS);
    await jouerAvecLeProfilDeLaTablette(page, famille, monde);
    await jouerLaSeanceComplete(page, titre);
    await attendreQueLesSonsSoientEnReserve(page, adressesDesSonsDeLaLecon(leconDeTitre(page, titre).id));
  },
);

Given(
  /^Léa n'a jamais joué la leçon « ([^«»]+) » sur la tablette$/,
  async ({ page, famille, monde, $testInfo }, titre: string) => {
    $testInfo.setTimeout(DUREE_D_UNE_SEANCE_COMPLETE_MS);
    await jouerAvecLeProfilDeLaTablette(page, famille, monde);
    const communs = new Set(adressesDesParolesCommunes());
    const propresALaLecon = adressesDesSonsDeLaLecon(leconDeTitre(page, titre).id).filter((adresse) => !communs.has(adresse));
    const gardes = await sonsEnReserve(page);
    expect(propresALaLecon.filter((adresse) => gardes.includes(adresse)), `aucun son de « ${titre} » n'est sur l'appareil`).toEqual([]);
  },
);

Given(
  /^Léa a terminé avec le réseau la séance de la leçon « ([^«»]+) »$/,
  async ({ page, famille, monde, $testInfo }, titre: string) => {
    $testInfo.setTimeout(DUREE_D_UNE_SEANCE_COMPLETE_MS);
    await jouerAvecLeProfilDeLaTablette(page, famille, monde);
    await jouerLaSeanceComplete(page, titre);
    await jouerLaSeanceJusquALaFin(page);
    await expect(page.getByTestId("fin-de-seance").getByRole("button", { name: "Leçon suivante", exact: true })).toBeVisible();
    await attendreQueLaReserveSeStabilise(page);
  },
);

When(/^Léa en arrive à la question « (.+) »$/, async ({ page }, question: string) => {
  await allerALaQuestion(page, question, false);
});

When(
  /^Léa choisit seulement l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/,
  async ({ page }, exercice: string, titre: string) => {
    await ouvrirLaPageDeLaLecon(page, titre);
    await commencerSeulementLExercice(page, exercice);
  },
);

When(/^Léa commence la séance de la leçon suivante de son parcours$/, async ({ page }) => {
  const precedente = etat(page).courante?.titre;
  await page.getByTestId("fin-de-seance").getByRole("button", { name: "Leçon suivante", exact: true }).click();
  const titreAffiche = async () => ((await page.getByRole("heading", { level: 2 }).first().textContent()) ?? "").trim();
  await expect.poll(async () => {
    const affiche = await titreAffiche();
    return affiche !== precedente && BIBLIOTHEQUE.some((lecon) => lecon.titre === affiche);
  }).toBe(true);
  const titre = await titreAffiche();
  etat(page).courante = BIBLIOTHEQUE.find((lecon) => lecon.titre === titre);
  await commencerLaSeanceComplete(page);
});

Then(/^Léa entend Noisette lire la première étape de leçon avec la voix de l'application$/, async ({ page }) => {
  const lecon = etat(page).courante;
  if (!lecon) throw new Error("Aucune leçon ouverte");
  await verifierQueLaVoixDeLApplicationLit(page, texteLuDeLEtape(lecon, 0));
});
