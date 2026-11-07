import { expect, type Locator, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import { recipient } from "./etapes-puis-exercices.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import {
  dureeDeLaFluence,
  donnerLeSignalDeDepart,
  exerciceDeCalcul,
  lireLaCarte,
  ouvrirLaFluence,
  partie20,
  preparerUnExercice,
} from "./calcul-fluence-addition.steps.ts";
import { avancerJusquAuxChoix, bulleDeChoix, demarrer, questionsDeLaSeance, questionsReussies } from "./exercices-a-choix.steps.ts";
import { terminerLaLecture } from "../support/lecture-vocale.ts";
import { normaliser } from "./voix.steps.ts";

// Story #183 : une barre du haut et une barre d'action en bas, la pause de la séance.
//
// Hooks de l'interface : barre du haut `barre-du-haut` (Retour, titre `titre-de-la-seance`, Son), avancement `recipient` en barre
// (`data-questions-reussies`, `data-total`, segments `point`, compteur `.compte`), pause `pause-de-la-seance` (role dialog),
// bulle `.guide-et-parole[data-personnage-guide]`, barre d'action `barre-d-action` (« Valider » `valider`, « Je ne sais pas »
// `je-ne-sais-pas`, bouton principal `.action-principale`).

const barreDuHaut = (page: Page) => page.getByTestId("barre-du-haut");
const pause = (page: Page) => page.getByTestId("pause-de-la-seance");
const barreDAction = (page: Page) => page.getByTestId("barre-d-action");
const titreDeLaSeance = (page: Page) => page.locator("#titre-de-la-seance");
const bulleEtPersonnage = (page: Page) => page.locator(".guide-et-parole");

const CHOIX_DE_LA_PAUSE = ["Je continue la leçon", "Retour à la leçon"] as const;
const LARGEUR_ET_HAUTEUR_DES_TELEPHONES = { largeur: 360, hauteur: 740 } as const;

async function boite(element: Locator, nom: string) {
  const mesure = await element.boundingBox();
  expect(mesure, `« ${nom} » est affiché`).not.toBeNull();
  return mesure as NonNullable<typeof mesure>;
}

async function ouvrirLaPause(page: Page) {
  await barreDuHaut(page).getByRole("button", { name: "Retour", exact: true }).click();
  await expect(pause(page)).toBeVisible();
}

// --- Étant donné

Given(/^l'écran de l'appareil mesure 360 px de large et 740 px de haut$/, async ({ page }) => {
  await page.setViewportSize({ width: LARGEUR_ET_HAUTEUR_DES_TELEPHONES.largeur, height: LARGEUR_ET_HAUTEUR_DES_TELEPHONES.hauteur });
});

Given(/^la pause de la séance est ouverte$/, async ({ page }) => {
  await ouvrirLaPause(page);
});

Given(/^Léa a fermé la pause de la séance en choisissant « Je continue la leçon »$/, async ({ page }) => {
  await ouvrirLaPause(page);
  await pause(page).getByRole("button", { name: "Je continue la leçon", exact: true }).click();
  await expect(pause(page)).toHaveCount(0);
});

// Les étapes de calcul et de fluence de #20 sont réservées par tags à d'autres stories : #183 les rejoue avec les mêmes aides.
// Avec des calculs réussis, l'étape de #97 sert déjà (mêmes gestes).
Given(/^Léa fait la fluence « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await ouvrirLaFluence(page, titre);
  await donnerLeSignalDeDepart(page);
});

Given(
  /^une leçon de test de niveau (CP|CE1) a un exercice calcul « ([^«»]+) », de résultat ([0-9]+), sans aide$/,
  async ({ page, monde }, niveau: string, enonce: string, resultat: string) => {
    preparerUnExercice(page, monde, exerciceDeCalcul([{ q: enonce, r: Number(resultat) }]), niveau);
  },
);

// --- Quand

When(/^Tom commence cet exercice$/, async ({ page }) => {
  partie20(page).acteur = "Tom";
  await demarrer(page);
  await lireLaCarte(page);
});

When(/^Léa répond faux$/, async ({ page }) => {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  const bonne = (questionsDeLaSeance(page)[await questionsReussies(page)] as { reponse: string }).reponse;
  const textes = (await page.getByTestId("choix").allTextContents()).map(normaliser);
  const fausse = textes.find((texte) => texte !== bonne);
  if (fausse === undefined) throw new Error("Tous les choix sont la bonne réponse");
  await bulleDeChoix(page, fausse).click();
});

When(/^Léa choisit « (Retour|Je continue la leçon|Retour à la leçon) »$/, async ({ page }, choix: string) => {
  if (choix === "Retour") await barreDuHaut(page).getByRole("button", { name: "Retour", exact: true }).click();
  else await pause(page).getByRole("button", { name: choix, exact: true }).click();
});

When(/^Léa appuie sur la touche Échap$/, async ({ page }) => {
  await page.keyboard.press("Escape");
});

// --- Alors : la barre du haut

Then(/^Léa ne voit ni « Savanturier », ni son prénom et sa classe, ni l'« Espace parent »$/, async ({ page }) => {
  await expect(recipient(page)).toBeVisible();
  await expect(page.getByRole("banner")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Savanturier", exact: true })).toHaveCount(0);
  await expect(page.getByTestId("enfant-en-cours")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Espace parent", exact: true })).toHaveCount(0);
});

Then(/^Léa voit en haut de la séance « Retour », le titre « ([^«»]+) » et le choix Son\/Muet$/, async ({ page }, titre: string) => {
  const barre = barreDuHaut(page);
  await expect(barre.getByRole("button", { name: "Retour", exact: true })).toBeVisible();
  await expect(barre.getByRole("heading", { level: 2, name: titre, exact: true })).toBeVisible();
  await expect(barre.getByRole("button", { name: "Son", exact: true })).toBeVisible();
  const haut = await boite(barre, "la barre du haut");
  expect(haut.y, "la barre du haut est tout en haut de l'écran").toBeLessThanOrEqual(1);
});

Then(/^le titre de la séance ne dit ni « ([^«»]+) » ni « ([^«»]+) »$/, async ({ page }, classe: string, matiere: string) => {
  const titre = (await titreDeLaSeance(page).textContent()) ?? "";
  expect(titre).not.toContain(classe);
  expect(titre).not.toContain(matiere);
});

Then(/^le titre « ([^«»]+) » tient sur deux lignes au plus, sans mot coupé$/, async ({ page }, titre: string) => {
  const h2 = titreDeLaSeance(page);
  await expect(h2).toHaveText(titre);
  const mesure = await h2.evaluate((titreDuHaut) => {
    const style = getComputedStyle(titreDuHaut);
    const hauteurDeLigne = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.2;
    const motsCoupes: string[] = [];
    const parcours = document.createTreeWalker(titreDuHaut, NodeFilter.SHOW_TEXT);
    for (let noeud = parcours.nextNode(); noeud; noeud = parcours.nextNode()) {
      const texte = noeud.textContent ?? "";
      for (const mot of texte.matchAll(/\S+/g)) {
        const plage = document.createRange();
        plage.setStart(noeud, mot.index);
        plage.setEnd(noeud, mot.index + mot[0].length);
        const lignes = new Set(Array.from(plage.getClientRects(), (r) => Math.round(r.top)));
        if (lignes.size > 1) motsCoupes.push(mot[0]);
      }
    }
    return {
      lignes: Math.round(titreDuHaut.getBoundingClientRect().height / hauteurDeLigne),
      motsCoupes,
      debordement: titreDuHaut.scrollWidth - titreDuHaut.clientWidth,
      coupure: `${style.overflowWrap}/${style.wordBreak}`,
    };
  });
  expect(mesure.lignes, "nombre de lignes du titre").toBeLessThanOrEqual(2);
  expect(mesure.motsCoupes, "mots coupés en fin de ligne").toEqual([]);
  expect(mesure.debordement, "le titre ne déborde pas de sa boîte").toBeLessThanOrEqual(0);
  expect(mesure.coupure, "le navigateur ne coupe pas les mots").not.toMatch(/break-word|anywhere|break-all/);
});

Then(/^les lecteurs d'écran nomment la séance par le titre « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await expect(titreDeLaSeance(page)).toHaveText(titre);
  const region = page.getByRole("region", { name: titre, exact: true });
  await expect(region).toHaveCount(1);
  await expect(region).toHaveAttribute("aria-labelledby", "titre-de-la-seance");
});

// --- Alors : l'avancement

Then(/^le compteur de l'avancement de la séance affiche (?:toujours )?« (\d+) \/ (\d+) »$/, async ({ page }, reussies: string, total: string) => {
  await expect(recipient(page).locator(".compte")).toHaveText(`${reussies} / ${total}`);
});

Then(/^la barre de l'avancement de la séance est remplie à (\d+) sur (\d+)$/, async ({ page }, reussies: string, total: string) => {
  const avancement = recipient(page);
  await expect(avancement).toHaveAttribute("data-forme", "barre");
  await expect(avancement).toHaveAttribute("data-questions-reussies", String(reussies));
  await expect(avancement).toHaveAttribute("data-total", String(total));
  await expect(avancement.getByTestId("point")).toHaveCount(Number(total));
  await expect(avancement.locator('[data-testid="point"][data-reussi="true"]')).toHaveCount(Number(reussies));
  await expect(avancement).toHaveAttribute("data-complet", String(reussies) === String(total) ? "true" : "false");
});

Then(/^l'avancement de la séance reste lu par les lecteurs d'écran : (\d+) sur (\d+)$/, async ({ page }, reussies: string, total: string) => {
  const barre = page.getByRole("progressbar", { name: "Avancement de la séance", exact: true });
  await expect(barre).toHaveAttribute("aria-valuetext", `${reussies} sur ${total}`);
  await expect(barre).toHaveAttribute("aria-valuenow", String(reussies));
  await expect(barre).toHaveAttribute("aria-valuemax", String(total));
});

// --- Alors : la pause de la séance

Then(/^la pause de la séance ne s'ouvre pas$/, async ({ page }) => {
  await expect(pause(page)).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

Then(
  /^la pause de la séance s'ouvre : « On fait une pause \? », avec « Je continue la leçon » et « Retour à la leçon »$/,
  async ({ page }) => {
    await expect(pause(page)).toBeVisible();
    await expect(pause(page).getByRole("heading", { name: "On fait une pause ?", exact: true })).toBeVisible();
    for (const choix of CHOIX_DE_LA_PAUSE) await expect(pause(page).getByRole("button", { name: choix, exact: true })).toBeVisible();
    await expect(pause(page).getByRole("button")).toHaveCount(CHOIX_DE_LA_PAUSE.length);
  },
);

Then(/^la pause de la séance n'affiche ni compte à rebours, ni reproche, ni avertissement$/, async ({ page }) => {
  const feuille = pause(page);
  await expect(feuille).toHaveText(["On fait une pause ?", ...CHOIX_DE_LA_PAUSE].join(""));
  await expect(feuille.getByRole("progressbar")).toHaveCount(0);
  await expect(feuille.getByRole("timer")).toHaveCount(0);
  await expect(feuille.getByRole("alert")).toHaveCount(0);
  await expect(feuille.getByRole("status")).toHaveCount(0);
});

Then(/^la pause de la séance se ferme$/, async ({ page }) => {
  await expect(pause(page)).toHaveCount(0);
});

Then(/^les lecteurs d'écran annoncent la fenêtre « On fait une pause \? »$/, async ({ page }) => {
  const fenetre = page.getByRole("dialog", { name: "On fait une pause ?", exact: true });
  await expect(fenetre).toBeVisible();
  await expect(fenetre).toHaveAttribute("aria-modal", "true");
});

Then(/^« Je continue la leçon » est le choix mis en avant, atteint en premier au clavier$/, async ({ page }) => {
  const premier = pause(page).getByRole("button").first();
  await expect(premier).toHaveText("Je continue la leçon");
  await expect(premier).toBeFocused();
});

Then(
  /^Léa voit « On fait une pause \? » et ses deux choix en mode dys : police Andika, lettres, mots et lignes espacés$/,
  async ({ page }) => {
    await expect(pause(page).locator("xpath=..")).toHaveAttribute("data-mode-dys", "true");
    const choix = CHOIX_DE_LA_PAUSE.map((nom) => pause(page).getByRole("button", { name: nom, exact: true }));
    await verifierModeDys(page, [pause(page).getByRole("heading", { name: "On fait une pause ?" }), ...choix], true);
  },
);

Then(/^la pause de la séance apparaît sans glisser$/, async ({ page }) => {
  await expect(pause(page)).toBeVisible();
  await expect(pause(page)).toHaveCSS("animation-name", "none");
  await expect(pause(page)).toHaveCSS("transform", "none");
});

Then(/^chaque choix de la pause de la séance mesure au moins (\d+) px de haut$/, async ({ page }, minimum: string) => {
  for (const nom of CHOIX_DE_LA_PAUSE) {
    const mesure = await boite(pause(page).getByRole("button", { name: nom, exact: true }), nom);
    expect(mesure.height, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(Number(minimum));
  }
});

// --- Alors : fluence

Then(/^Léa voit toujours ([0-9]+) calculs? réussis?$/, async ({ page }, reussis: string) => {
  await expect(page.getByTestId("calculs-reussis")).toHaveAttribute("data-score", reussis);
});

Then(/^le temps de la fluence a continué de passer pendant la pause de la séance$/, async ({ page }) => {
  // Le temps vient de l'horloge du navigateur, figée par le test : la pause de la séance ne l'arrête ni ne le remet à zéro.
  const p = partie20(page);
  const secondesPassees = 10;
  p.maintenant = new Date(p.maintenant.getTime() + secondesPassees * 1000);
  await page.clock.setFixedTime(p.maintenant);
  await expect(page.getByTestId("fluence")).toHaveAttribute("data-etat", "en-cours");
  await expect(page.getByTestId("temps-restant")).toHaveText(`${dureeDeLaFluence(page) - secondesPassees} secondes`);
});

// --- Alors : la bulle

Then(/^Léa ne voit pas Noisette à côté de la consigne$/, async ({ page }) => {
  await expect(bulleEtPersonnage(page)).toHaveAttribute("data-personnage-guide", "cache");
  await expect(page.getByTestId("consigne")).toBeVisible();
});

Then(/^Noisette se montre à la place de la consigne, avec (?:sa|son) (félicitation|encouragement)$/, async ({ page }, nature: string) => {
  await expect(bulleEtPersonnage(page)).toHaveAttribute("data-personnage-guide", "visible");
  await expect(page.getByTestId("parole")).toHaveAttribute("data-nature", nature === "félicitation" ? "felicitation" : "encouragement");
  await expect(page.getByTestId("parole")).toBeVisible();
  await expect(page.getByTestId("consigne")).toHaveCount(0);
});

Then(/^la séance propose un seul « Réécouter » et aucun « Relire la consigne »$/, async ({ page }) => {
  await expect(page.getByRole("button", { name: "Réécouter", exact: true })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Relire la consigne/ })).toHaveCount(0);
});

// --- Alors : la barre d'action

/** Léa laisse Noisette finir de lire (« Continuer », « J'ai écouté ») jusqu'à ce que le bouton soit là. */
async function verifierLeBoutonDansLaBarre(page: Page, nom: string) {
  const bouton = barreDAction(page).getByRole("button", { name: nom, exact: true });
  await expect.poll(async () => {
    if (await bouton.isVisible()) return true;
    const continuer = page.getByRole("button", { name: "Continuer", exact: true });
    if (await continuer.isVisible()) await continuer.click();
    else if (await page.getByTestId("j-ai-ecoute").isVisible()) await page.getByTestId("j-ai-ecoute").click();
    else await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
  return bouton;
}

async function verifierLaBarreEnBas(page: Page) {
  const barre = await boite(barreDAction(page), "la barre d'action");
  const hauteurDeLEcran = page.viewportSize()?.height ?? 0;
  expect(barre.y + barre.height, "la barre d'action est dans l'écran").toBeLessThanOrEqual(hauteurDeLEcran + 1);
  expect(barre.y, "la barre d'action est dans la moitié basse de l'écran").toBeGreaterThan(hauteurDeLEcran / 2 - barre.height);
}

Then(/^« Continuer » est dans la barre d'action, en bas de l'écran$/, async ({ page }) => {
  await verifierLeBoutonDansLaBarre(page, "Continuer");
  await verifierLaBarreEnBas(page);
});

Then(/^« Je ne sais pas » est dans la barre d'action, en bas de l'écran$/, async ({ page }) => {
  await verifierLeBoutonDansLaBarre(page, "Je ne sais pas");
  await verifierLaBarreEnBas(page);
});

Then(/^la barre d'action ne propose pas « Valider »$/, async ({ page }) => {
  await expect(barreDAction(page).getByRole("button", { name: "Valider", exact: true })).toHaveCount(0);
  await expect(page.getByTestId("valider")).toHaveCount(0);
});

Then(/^« Valider » et « Je ne sais pas » sont dans la barre d'action, en bas de l'écran$/, async ({ page }) => {
  await verifierLeBoutonDansLaBarre(page, "Valider");
  await verifierLeBoutonDansLaBarre(page, "Je ne sais pas");
  await verifierLaBarreEnBas(page);
});

Then(/^« Je ne sais pas » est plus discret que « Valider », placé à côté$/, async ({ page }) => {
  const valider = await boite(barreDAction(page).getByRole("button", { name: "Valider", exact: true }), "Valider");
  const jeNeSaisPas = await boite(barreDAction(page).getByRole("button", { name: "Je ne sais pas", exact: true }), "Je ne sais pas");
  expect(jeNeSaisPas.width, "« Je ne sais pas » est moins large que « Valider »").toBeLessThan(valider.width);
  const memeRangee = Math.abs(jeNeSaisPas.y + jeNeSaisPas.height / 2 - (valider.y + valider.height / 2)) <= 4;
  expect(memeRangee, "les deux boutons sont sur la même rangée").toBe(true);
  const ecart = Math.max(valider.x - (jeNeSaisPas.x + jeNeSaisPas.width), jeNeSaisPas.x - (valider.x + valider.width));
  expect(ecart, "les deux boutons se touchent presque").toBeLessThanOrEqual(24);
});

Then(/^« Valider » et « Je ne sais pas » mesurent au moins (\d+) px de haut$/, async ({ page }, minimum: string) => {
  for (const nom of ["Valider", "Je ne sais pas"]) {
    const mesure = await boite(barreDAction(page).getByRole("button", { name: nom, exact: true }), nom);
    expect(mesure.height, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(Number(minimum));
  }
});

// --- Alors : sur un téléphone de 360 × 740

Then(/^le début de l'exercice est à (\d+) px au plus du haut de l'écran$/, async ({ page }, maximum: string) => {
  const exercice = await boite(page.getByTestId("exercice-en-cours"), "l'exercice");
  expect(exercice.y, "le haut de l'exercice").toBeLessThanOrEqual(Number(maximum));
});

async function verifierQueToutSeVoitSansDefiler(page: Page, elements: ReadonlyArray<readonly [string, Locator]>) {
  const hauteurDeLEcran = page.viewportSize()?.height ?? 0;
  for (const [nom, element] of elements) {
    await expect(element, nom).toBeVisible();
    const mesure = await boite(element, nom);
    expect(mesure.y, `« ${nom} » commence dans l'écran`).toBeGreaterThanOrEqual(0);
    expect(mesure.y + mesure.height, `« ${nom} » finit dans l'écran`).toBeLessThanOrEqual(hauteurDeLEcran);
  }
  expect(await page.evaluate(() => window.scrollY), "la page n'a pas défilé").toBe(0);
}

Then(
  /^la question « (.+) », ses choix et « Je ne sais pas » se voient sans faire défiler l'écran$/,
  async ({ page }, question: string) => {
    await avancerJusquAuxChoix(page);
    await expect(page.getByTestId("question")).toHaveText(normaliser(question));
    const choix = await page.getByTestId("choix").all();
    expect(choix.length, "des choix sont proposés").toBeGreaterThan(0);
    await verifierQueToutSeVoitSansDefiler(page, [
      ["la question", page.getByTestId("question")],
      ...choix.map((c, rang) => [`le choix ${rang + 1}`, c] as const),
      ["Je ne sais pas", barreDAction(page).getByRole("button", { name: "Je ne sais pas", exact: true })],
    ]);
  },
);

Then(
  /^le calcul, le clavier de cristaux, « Valider » et « Je ne sais pas » se voient sans faire défiler l'écran$/,
  async ({ page }) => {
    await verifierQueToutSeVoitSansDefiler(page, [
      ["le calcul", page.getByTestId("carte-du-calcul")],
      ["le clavier de cristaux", page.getByTestId("clavier-de-cristaux")],
      ["Valider", barreDAction(page).getByRole("button", { name: "Valider", exact: true })],
      ["Je ne sais pas", barreDAction(page).getByRole("button", { name: "Je ne sais pas", exact: true })],
    ]);
  },
);
