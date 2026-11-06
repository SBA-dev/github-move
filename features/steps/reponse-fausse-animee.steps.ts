import { expect, type Page } from "@playwright/test";
import { Before, Given, Then, When } from "./fixtures.ts";
import { bulle, commencerSeulementLExercice, injecter, ouvrirLaPageDeLaLecon } from "./etapes-puis-exercices.steps.ts";
import {
  avancerJusquAuxChoix,
  bulleDeChoix,
  demarrageDeLExercice,
  demarrer,
  etatDesChoix,
  leconAChoix,
  leconDeLExercice,
  positionDeLExercice,
  questionsDeLaLecon,
  questionsReussies,
  repondre,
  textesDesChoixPossibles,
} from "./exercices-a-choix.steps.ts";
import { ecrire } from "./dictee-et-conjugaison.steps.ts";
import { direJeNeSaisPas, donnerLaBonneReponse, faireUneErreur } from "./aide-et-je-ne-sais-pas.steps.ts";
import { jouerLeDefi, leconDeLaQuestion, TOUT_JUSTE } from "./defi-de-fin-de-partie.steps.ts";
import { attendreLaFinDeLaSeance, jouerJusquALaFinDeLaSeance, partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { DELAI_DE_L_ATTENTE_MS, laisserSeDerouler } from "./retours-animes-et-sonores.steps.ts";
import { normaliser } from "./voix.steps.ts";
import { cleDeLaTenue } from "./tenues.steps.ts";

// Story #163 : la scène de réponse fausse du personnage guide (livraison 163a : le mécanisme et Coach Léo).
//
// La scène ne dure que 1,5 s et disparaît du DOM : une étape qui arrive après la manquerait. Un enregistreur, injecté dans la page
// avant tout chargement, note donc dans l'ordre chaque scène qui apparaît (`data-testid="scene-de-reponse-fausse"`), ce que l'écran
// montrait à son apparition (question, choix, personnage guide, bulle écrite, police), ses dernières images (le sourire de la fin)
// et son instant de fin. Une scène est « arrêtée » quand elle disparaît bien avant ses 1,5 s : l'enfant a agi.
// La « marque » est le dernier geste de l'enfant (bouton ou touche) : « ne joue pas de scène » regarde ce qui apparaît depuis.

type EntreeDeScene = {
  debut: number;
  fin: number | null;
  marqueAuDebut: number;
  univers: string | null;
  mouvements: string | null;
  bulleEcrite: string | null;
  etatAuDebut: string | null;
  tenue: string | null;
  tracesDeTenue: string[];
  masqueeAuxLecteursDEcran: boolean;
  zonesVocalesDansLaScene: number;
  questionAuDebut: string | null;
  choixVisiblesAuDebut: number;
  guideAbsentAuDebut: boolean;
  poteau: boolean;
  ballon: boolean;
  bullesEcrites: number;
  texteDeLaScene: string;
  policeDeLaBulleEcrite: { famille: string; lettres: string; mots: string } | null;
  animationsEnCoursAuDebut: number;
  criDeVictoire: boolean;
  confettis: boolean;
  sons: number;
  sourireALaFin: boolean;
  debordementAuDebut: number;
};

type EtatDeLEnregistreur = { entrees: EntreeDeScene[]; marque: number; actions: number[] };

// --- L'enregistreur de la scène, installé avant le chargement de la page (s'exécute dans le navigateur)

export function installerLEnregistreurDeLaScene() {
  if (Reflect.get(window, "__scene163")) return;
  const etat: EtatDeLEnregistreur = { entrees: [], marque: 0, actions: [] };
  Reflect.set(window, "__scene163", etat);
  const SCENE = '[data-testid="scene-de-reponse-fausse"]';

  const aUneBoite = (element: Element) => {
    const boite = element.getBoundingClientRect();
    return boite.width > 0 && boite.height > 0 && getComputedStyle(element).visibility !== "hidden";
  };
  const texteDe = (element: Element | null) => (element?.textContent ?? "").replace(/\s+/g, " ").trim();

  const noterLeGeste = () => {
    etat.marque = etat.entrees.length;
    etat.actions.push(performance.now());
  };
  document.addEventListener("click", (evenement) => {
    if (evenement.target instanceof Element && evenement.target.closest("button") !== null) noterLeGeste();
  }, true);
  document.addEventListener("keydown", noterLeGeste, true);
  document.addEventListener("pointerdown", () => etat.actions.push(performance.now()), true);

  const sourireVisible = (scene: Element) =>
    [...scene.querySelectorAll("[data-emo]")].some((bouche) =>
      bouche.getAttribute("data-emo") === "sourire" && Number(getComputedStyle(bouche).opacity) >= 0.99
    );

  const ouvrir = (scene: Element): EntreeDeScene => {
    const bulleEcrite = scene.querySelector('[data-testid="bulle-ecrite-de-la-scene"]');
    const texteEcrit = scene.querySelector(".ecrit-de-la-scene");
    const style = texteEcrit ? getComputedStyle(texteEcrit) : null;
    return {
      debut: performance.now(),
      fin: null,
      marqueAuDebut: etat.marque,
      univers: scene.getAttribute("data-scene-de-reponse-fausse"),
      mouvements: scene.getAttribute("data-mouvements"),
      bulleEcrite: scene.getAttribute("data-bulle-ecrite"),
      etatAuDebut: scene.getAttribute("data-etat"),
      tenue: scene.getAttribute("data-tenue"),
      tracesDeTenue: [...scene.querySelectorAll("[data-tenue-dessin]")].map((trace) => trace.getAttribute("data-tenue-dessin") ?? ""),
      masqueeAuxLecteursDEcran: scene.closest('[aria-hidden="true"]') !== null,
      zonesVocalesDansLaScene: scene.querySelectorAll('[aria-live], [role="status"], [role="alert"], [role="img"], [aria-label]').length,
      questionAuDebut: texteDe(document.querySelector('[data-testid="question"]')),
      choixVisiblesAuDebut: [...document.querySelectorAll('[data-testid="choix"]')].filter(aUneBoite).length,
      guideAbsentAuDebut: document.querySelector('[data-testid="personnage-guide"]') === null,
      poteau: scene.querySelector('[id$="-poteau"]') !== null,
      ballon: scene.querySelector('[id$="-ballon-couche"]') !== null,
      bullesEcrites: bulleEcrite ? 1 : 0,
      texteDeLaScene: texteDe(scene),
      policeDeLaBulleEcrite: style ? { famille: style.fontFamily, lettres: style.letterSpacing, mots: style.wordSpacing } : null,
      animationsEnCoursAuDebut: scene.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length,
      criDeVictoire: scene.querySelector('[data-testid="cri-de-victoire"]') !== null,
      confettis: scene.querySelector('[data-testid^="confettis"]') !== null || document.querySelector('[data-testid="confettis"]') !== null,
      sons: scene.querySelectorAll("audio, video").length,
      sourireALaFin: sourireVisible(scene),
      debordementAuDebut: document.documentElement.scrollWidth - window.innerWidth,
    };
  };

  new MutationObserver(() => {
    const scene = document.querySelector(SCENE);
    const courante = etat.entrees.at(-1);
    const ouverte = courante && courante.fin === null ? courante : undefined;
    if (scene && !ouverte) etat.entrees.push(ouvrir(scene));
    else if (scene && ouverte) ouverte.sourireALaFin = sourireVisible(scene);
    else if (!scene && ouverte) ouverte.fin = performance.now();
  }).observe(document, { subtree: true, childList: true, attributes: true });
}

Before({ tags: "@issue-163" }, async ({ page }) => {
  await page.addInitScript(installerLEnregistreurDeLaScene);
});

// --- Lire l'enregistreur

// Une scène finie d'elle-même dure 1,5 s ; une lettre de dictée ne peut être écrite qu'après les 1,3 s des lettres fausses (#23).
const SCENE_ARRETEE_EN_MOINS_DE_MS = 1450;
const SCENE_JOUEE_AU_MOINS_MS = 1300;

async function lireLEnregistreur(page: Page): Promise<{ entrees: EntreeDeScene[]; marque: number; actions: number[] }> {
  return await page.evaluate(() => {
    const etat = Reflect.get(window, "__scene163") as { entrees: unknown[]; marque: number; actions: number[] } | undefined;
    return JSON.parse(JSON.stringify(etat ?? { entrees: [], marque: 0, actions: [] }));
  });
}

async function attendreUneScene(page: Page): Promise<EntreeDeScene> {
  let trouvee: EntreeDeScene | undefined;
  await expect.poll(async () => {
    trouvee = (await lireLEnregistreur(page)).entrees.at(-1);
    return trouvee !== undefined;
  }, { intervals: [50], timeout: DELAI_DE_L_ATTENTE_MS, message: "la scène de réponse fausse apparaît" }).toBe(true);
  return trouvee as EntreeDeScene;
}

async function attendreLaFinDeLaScene(page: Page): Promise<EntreeDeScene> {
  let finie: EntreeDeScene | undefined;
  await expect.poll(async () => {
    finie = (await lireLEnregistreur(page)).entrees.at(-1);
    return finie?.fin !== null && finie?.fin !== undefined;
  }, { intervals: [50], timeout: DELAI_DE_L_ATTENTE_MS, message: "la scène de réponse fausse finit" }).toBe(true);
  return finie as EntreeDeScene;
}

const duree = (entree: EntreeDeScene) => (entree.fin ?? Infinity) - entree.debut;

/** Laisse deux images passer : les effets de React qui décident de jouer la scène ont alors tous couru. */
async function laisserDecider(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((fini) => requestAnimationFrame(() => requestAnimationFrame(() => fini()))));
}

const zoneDuPersonnageGuide = (page: Page) => page.locator(".personnage-guide-et-sa-scene");

// --- Étant donné : le chargement de la scène

const motifDeLaScene = /SceneDeCoachLeo/;
const bloqueurs = new WeakMap<Page, Parameters<Page["route"]>[1]>();

Given(/^la scène de réponse fausse de Coach Léo ne peut pas être chargée$/, async ({ page }) => {
  const bloquer: Parameters<Page["route"]>[1] = (route) => route.abort("failed");
  bloqueurs.set(page, bloquer);
  await page.route(motifDeLaScene, bloquer);
});

Given(/^la scène de réponse fausse de Coach Léo peut de nouveau être chargée$/, async ({ page }) => {
  const bloquer = bloqueurs.get(page);
  if (bloquer) await page.unroute(motifDeLaScene, bloquer);
  bloqueurs.delete(page);
});

// --- Étant donné : une scène en train de se jouer. Le geste est fait au plus vite : la scène ne dure que 1,5 s.

async function repondreEtVoirLaScene(page: Page, reponse: string): Promise<void> {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  const choix = etatDesChoix(page);
  choix.reussiesAvant = await questionsReussies(page);
  await bulleDeChoix(page, reponse).click();
  await attendreUneScene(page);
}

Given(/^Coach Léo joue sa scène de réponse fausse après la réponse « ([^«»]+) » de Léa$/, async ({ page }, reponse: string) => {
  await repondreEtVoirLaScene(page, reponse);
});

Given(/^Coach Léo joue sa scène de réponse fausse après le mot « ([^«»]+) » écrit par Léa$/, async ({ page }, mot: string) => {
  await ecrire(page, mot);
  await attendreUneScene(page);
});

// --- Tom joue la même question de test que Léa (son profil et son univers sont préparés par les étapes du Contexte)

Given(/^Tom joue la question de test « ([^«»]+) »$/, async ({ page }, question: string) => {
  if (question !== QUESTION_DE_TEST) throw new Error(`Question de test inconnue : ${question}`);
  await preparerLaQuestionDeTest(page);
});

When(/^Tom répond « ([^«»]+) » à « ([^«»]+) »$/, { tags: "@issue-163" }, async ({ page }, reponse: string, question: string) => {
  await repondre(page, reponse, question);
});

// --- Les erreurs d'une leçon de test de plusieurs questions

Given(/^à la première question, Léa a fait une erreur, puis a donné la bonne réponse$/, async ({ page }) => {
  await faireUneErreur(page);
  await donnerLaBonneReponse(page);
});

Given(/^à la première question, Léa a dit « Je ne sais pas », puis a donné la bonne réponse$/, { tags: "@issue-163" }, async ({ page }) => {
  await demarrer(page);
  await direJeNeSaisPas(page);
  await donnerLaBonneReponse(page);
});

Given(/^Léa a fait une erreur à cette question$/, async ({ page }) => {
  await faireUneErreur(page);
});

When(/^Léa fait une erreur à la deuxième question$/, async ({ page }) => {
  await faireUneErreur(page);
});

When(/^Léa se trompe à la première question du grand défi$/, async ({ page }) => {
  await jouerLeDefi(page, TOUT_JUSTE, { nombre: 0 });
  const enonce = ((await page.getByTestId("question").first().textContent()) ?? "").replace(/\s+/g, " ").trim();
  const question = questionsDeLaLecon(leconDeLaQuestion(enonce)).find((candidate) => candidate.enonce === enonce);
  if (question === undefined) throw new Error(`Question inconnue du grand défi : « ${enonce} »`);
  const fausse = (await textesDesChoixPossibles(page)).find((texte) => texte !== question.reponse);
  if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
  await bulleDeChoix(page, fausse).click();
});

// --- Étant donné : une séance précédente où Léa a vu la scène

const QUESTION_DE_TEST = "Combien font 3 + 4 ?";

async function preparerLaQuestionDeTest(page: Page): Promise<void> {
  const lecon = leconAChoix("test-question-a-choix", QUESTION_DE_TEST, ["6", "7", "8", "9"], "7");
  await injecter(page, lecon);
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
}

Given(/^Léa a vu la scène de réponse fausse de Coach Léo dans une séance terminée aujourd'hui$/, async ({ page }) => {
  await preparerLaQuestionDeTest(page);
  await repondreEtVoirLaScene(page, "8");
  await repondre(page, "7");
  await attendreLaFinDeLaSeance(page);
});

Given(/^Léa a vu la scène de réponse fausse de Coach Léo dans une séance quittée avant la fin, aujourd'hui$/, async ({ page }) => {
  await preparerLaQuestionDeTest(page);
  await repondreEtVoirLaScene(page, "8");
  await page.getByRole("button", { name: "Retour", exact: true }).click();
  await expect(page.getByTestId("recipient")).toHaveCount(0);
});

Given(
  /^Léa a vu la scène de réponse fausse de Coach Léo dans l'exercice « ([^«»]+) » joué seul et terminé aujourd'hui$/,
  async ({ famille, page }, exercice: string) => {
    const lecon = leconDeLExercice(page, exercice);
    const position = positionDeLExercice(lecon, exercice);
    const courante = partie(famille);
    courante.erreursEnTout = 0;
    courante.erreursParExercice.clear();
    await ouvrirLaPageDeLaLecon(page, lecon.titre);
    etatDesChoix(page).exerciceUnique = position;
    await commencerSeulementLExercice(page, String(lecon.exercices[position]?.titre));
    // La scène ne se joue qu'une fois l'encouragement dit : la bonne réponse attend qu'on l'ait vue.
    await faireUneErreur(page);
    await attendreUneScene(page);
    await attendreLaFinDeLaScene(page);
    await jouerJusquALaFinDeLaSeance(famille, page);
  },
);

// --- Quand

When(/^la scène de réponse fausse est finie$/, async ({ page }) => {
  await attendreLaFinDeLaScene(page);
});

// --- Alors : la scène est jouée, ou ne l'est pas

async function verifierQueLaSceneDeLeoSeJoue(page: Page): Promise<EntreeDeScene> {
  const scene = await verifierQueLaSceneSeJoue(page, "sports");
  expect(scene.poteau && scene.ballon, "le décor de la scène de Coach Léo : le ballon et le petit poteau").toBe(true);
  return scene;
}

async function verifierQueLaSceneSeJoue(page: Page, univers: string): Promise<EntreeDeScene> {
  const scene = await attendreUneScene(page);
  expect(scene.univers, "la scène de l'univers du profil").toBe(univers);
  expect(scene.guideAbsentAuDebut, "le personnage guide n'apparaît pas en double pendant la scène").toBe(true);
  if ((page.viewportSize()?.width ?? Infinity) <= 360) expect(scene.debordementAuDebut, "la scène tient dans la largeur de l'écran").toBeLessThanOrEqual(0);
  return scene;
}

// Lili (Danse, 163b) : la scène de l'univers du profil, sans doublon du dessin fixe du personnage guide.
async function verifierQueLaSceneDeLiliSeJoue(page: Page): Promise<EntreeDeScene> {
  return await verifierQueLaSceneSeJoue(page, "danse");
}

// Noisette (Animaux de la forêt, 163c) : la scène de l'univers du profil, sans doublon du dessin fixe du personnage guide.
async function verifierQueLaSceneDeNoisetteSeJoue(page: Page): Promise<EntreeDeScene> {
  return await verifierQueLaSceneSeJoue(page, "animaux");
}

Then(/^(Coach Léo|Lili|Noisette) joue sa scène de réponse fausse(?: : (?!.*avec «).+)?$/, async ({ page }, personnage: string) => {
  if (personnage === "Lili") await verifierQueLaSceneDeLiliSeJoue(page);
  else if (personnage === "Noisette") await verifierQueLaSceneDeNoisetteSeJoue(page);
  else await verifierQueLaSceneDeLeoSeJoue(page);
});

Then(/^Coach Léo joue sa scène de réponse fausse avec « ([^«»]+) »$/, async ({ page }, tenue: string) => {
  const scene = await verifierQueLaSceneDeLeoSeJoue(page);
  const cle = cleDeLaTenue(tenue);
  expect(scene.tenue, `la scène porte la tenue « ${tenue} »`).toBe(cle);
  expect(scene.tracesDeTenue.some((trace) => trace.startsWith(cle)), `tracé de « ${tenue} » dans la scène`).toBe(true);
});

Then(/^Coach Léo ne joue pas de scène de réponse fausse$/, async ({ page }) => {
  await laisserSeDerouler(page);
  await laisserDecider(page);
  const { entrees, marque } = await lireLEnregistreur(page);
  expect(entrees.length - marque, "aucune scène n'apparaît depuis le dernier geste de Léa").toBe(0);
  await expect(page.getByTestId("scene-de-reponse-fausse")).toHaveCount(0);
});

Then(/^la scène de réponse fausse ne recommence pas$/, async ({ page }) => {
  await laisserDecider(page);
  const { entrees, marque } = await lireLEnregistreur(page);
  expect(entrees.length, "une seule scène dans la séance").toBe(1);
  expect(entrees.length - marque, "aucune scène depuis le dernier geste de Léa").toBe(0);
});

Then(/^(Coach Léo|Lili|Noisette) finit avec le sourire, le pouce levé$/, async ({ page }, personnage: string) => {
  const scene = await attendreLaFinDeLaScene(page);
  expect(duree(scene), "la scène va jusqu'au bout").toBeGreaterThanOrEqual(SCENE_JOUEE_AU_MOINS_MS);
  expect(scene.sourireALaFin, `${personnage} sourit dans la dernière image`).toBe(true);
});

Then(/^Coach Léo continue sa scène de réponse fausse$/, async ({ page }) => {
  const scene = await attendreUneScene(page);
  expect(duree(scene), "la scène n'a pas été arrêtée").toBeGreaterThanOrEqual(SCENE_JOUEE_AU_MOINS_MS);
});

Then(/^la scène de réponse fausse s'arrête$/, async ({ page }) => {
  const scene = await attendreLaFinDeLaScene(page);
  expect(duree(scene), "la scène s'arrête avant ses 1,5 s").toBeLessThan(SCENE_ARRETEE_EN_MOINS_DE_MS);
  await expect(page.getByTestId("scene-de-reponse-fausse")).toHaveCount(0);
});

// --- Alors : le personnage guide à sa place

Then(/^Coach Léo n'apparaît qu'une fois, à sa place, la bulle gardant ses paroles$/, async ({ page }) => {
  await attendreUneScene(page);
  const zone = zoneDuPersonnageGuide(page);
  await expect(zone).toHaveCount(1);
  await expect(zone.locator('[data-testid="personnage-guide"], [data-testid="scene-de-reponse-fausse"]')).toHaveCount(1);
  await expect(page.getByTestId("personnage-guide").or(page.getByTestId("scene-de-reponse-fausse"))).toHaveCount(1);
  await expect(bulle(page)).toBeVisible();
  await expect(bulle(page)).not.toHaveText("");
  await expect(page.getByRole("button", { name: "Réécouter", exact: true })).toBeVisible();
});

// --- Alors : ce que Léa lit

Then(/^Léa ne lit pas « ([^«»]+) »$/, async ({ page }, texte: string) => {
  const scene = await attendreUneScene(page);
  expect(scene.texteDeLaScene, "la scène n'affiche aucun titre").not.toContain(texte);
  await expect(page.getByText(texte)).toHaveCount(0);
});

Then(/^la question « ([^«»]+) » et ses quatre choix restent visibles$/, async ({ page }, question: string) => {
  const scene = await attendreUneScene(page);
  expect(normaliser(scene.questionAuDebut ?? ""), "la question est visible dès la première image").toBe(question);
  expect(scene.choixVisiblesAuDebut, "les quatre choix sont visibles dès la première image").toBe(4);
});

// --- Alors : sobriété de la scène

Then(/^la scène de réponse fausse ne dure pas plus qu'une célébration commune, et moins qu'une célébration de l'univers$/, async ({ page }) => {
  const scene = await attendreLaFinDeLaScene(page);
  const DUREE_MAXIMALE_DE_LA_SCENE_MS = 1700;
  const DUREE_DE_LA_CELEBRATION_DE_L_UNIVERS_MS = 3000;
  expect(duree(scene), "1,5 s au plus, avec la marge de la mesure").toBeLessThanOrEqual(DUREE_MAXIMALE_DE_LA_SCENE_MS);
  expect(duree(scene)).toBeLessThan(DUREE_DE_LA_CELEBRATION_DE_L_UNIVERS_MS);
});

Then(/^la scène de réponse fausse ne montre aucun cri de victoire et ne fait entendre aucun son$/, async ({ page }) => {
  const scene = await attendreUneScene(page);
  expect(scene.criDeVictoire, "aucun cri de victoire").toBe(false);
  expect(scene.confettis, "aucun confetti").toBe(false);
  expect(scene.sons, "aucun lecteur audio dans la scène").toBe(0);
  expect(scene.texteDeLaScene.replace(/oh !/, "").trim(), "la scène n'écrit que sa petite bulle").toBe("");
});

// --- Alors : mouvements réduits, bulle écrite, mode dys, lecteurs d'écran

Then(
  /^Léa voit l'image fixe de la scène de réponse fausse de Coach Léo, souriant, le pouce levé, sans mouvement$/,
  async ({ page }) => {
    const scene = await verifierQueLaSceneDeLeoSeJoue(page);
    expect(scene.mouvements, "mouvements réduits").toBe("reduits");
    expect(scene.etatAuDebut, "l'image fixe est l'état final dès la première image").toBe("terminee");
    expect(scene.sourireALaFin, "Coach Léo sourit").toBe(true);
    expect(scene.animationsEnCoursAuDebut, "aucune animation en cours dans la scène").toBe(0);
  },
);

Then(/^(?:la scène|l'image fixe de la scène) de réponse fausse ne montre aucune bulle écrite$/, async ({ page }) => {
  const scene = await attendreUneScene(page);
  expect(scene.bulleEcrite).toBe("non");
  expect(scene.bullesEcrites, "aucune bulle écrite dans le dessin").toBe(0);
  expect(scene.texteDeLaScene).not.toContain("oh");
});

Then(/^les bulles écrites de la scène de réponse fausse s'affichent en mode dys$/, async ({ page }) => {
  const scene = await attendreUneScene(page);
  expect(scene.bulleEcrite, "la bulle écrite est montrée").toBe("oui");
  expect(scene.policeDeLaBulleEcrite?.famille, "police du mode dys").toContain("Andika");
  await expect(page.getByRole("main")).toHaveAttribute("data-mode-dys", "true");
});

Then(/^Léa voit « ([^«»]+) » dans la bulle de Coach Léo en mode dys$/, async ({ page }, texte: string) => {
  await expect(bulle(page)).toContainText(texte);
  await expect(page.getByRole("main")).toHaveAttribute("data-mode-dys", "true");
  const famille = await bulle(page).evaluate((element) => getComputedStyle(element).fontFamily);
  expect(famille).toContain("Andika");
});

Then(
  /^les lecteurs d'écran annoncent une seule fois l'encouragement de Coach Léo, suivi de « ([^«»]+) »$/,
  async ({ page }, complement: string) => {
    await attendreUneScene(page);
    await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
    const texte = normaliser((await bulle(page).textContent()) ?? "");
    expect(texte.endsWith(` ${complement}`), texte).toBe(true);
    await expect(bulle(page)).toHaveAttribute("aria-live", "polite");
    const regionsQuiLeDisent = page.locator('[aria-live="polite"], [aria-live="assertive"], [role="status"], [role="alert"]').filter({ hasText: complement });
    await expect(regionsQuiLeDisent, "une seule région annonce l'encouragement").toHaveCount(1);
  },
);

Then(/^les lecteurs d'écran n'annoncent ni « oh ! » ni le dessin de la scène de réponse fausse$/, async ({ page }) => {
  const scene = await attendreUneScene(page);
  expect(scene.masqueeAuxLecteursDEcran, "la scène est cachée aux lecteurs d'écran").toBe(true);
  expect(scene.zonesVocalesDansLaScene, "aucune région vocale, image ou étiquette dans la scène").toBe(0);
  await expect(page.locator('[aria-live], [role="status"], [role="alert"]').filter({ hasText: /^\s*oh\s*!\s*$/ })).toHaveCount(0);
  await expect(page.getByRole("img", { name: /ballon|poteau|oh/i })).toHaveCount(0);
});
