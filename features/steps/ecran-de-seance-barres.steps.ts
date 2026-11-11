import { expect, type Locator, type Page } from "@playwright/test";
import { Given, type ProfilPrepare, Then, When } from "./fixtures.ts";
import { allerALaQuestion, avancerJusquAuxChoix, finirLaParoleJusqua, verifierLaFelicitationEnEntier } from "./exercices-a-choix.steps.ts";
import { poserEtAttendre } from "./classer-ordre-trous.steps.ts";
import { direJeNeSaisPas, faireUneErreur } from "./aide-et-je-ne-sais-pas.steps.ts";
import { fluence } from "./calcul-fluence-addition.steps.ts";
import { boutonRetour, laPause, leconCourante, ouvrirLaPageDeLaLecon, commencerLaSeanceComplete, recipient, bulle, entendu } from "./etapes-puis-exercices.steps.ts";
import { DELAI_DE_L_ATTENTE_MS, effetPuisParole, observer } from "./retours-animes-et-sonores.steps.ts";
import { preparerProfil, cleDe } from "./univers.steps.ts";
import { leGuide } from "./univers.steps.ts";
import { consigneAffichee, journal, normaliser, scenario, terminerLaLecture } from "./voix.steps.ts";

// Story #183 : l'écran de séance de leçon. La barre du haut remplace l'en-tête de l'application (Retour, nom de la
// leçon, son, barre de progression et compteur) ; la pause s'ouvre à partir de la première réponse ; la barre d'action
// porte le bouton principal (`data-testid="barre-d-action"`, partie 3 de la story).

// --- Repères de l'écran

function barreDuHaut(page: Page): Locator {
  return page.getByRole("banner");
}

function compteur(page: Page): Locator {
  return page.getByTestId("compteur");
}

function remplissage(page: Page): Locator {
  return page.locator(".remplissage-de-la-seance");
}

function barreDAction(page: Page): Locator {
  return page.getByTestId("barre-d-action");
}

function personnageGuideAffiche(page: Page): Locator {
  return page.getByTestId("personnage-guide");
}

function zoneDuPersonnageGuide(page: Page): Locator {
  return page.locator(".personnage-guide-et-sa-scene");
}

function boutonReecouter(page: Page): Locator {
  return page.getByRole("button", { name: "Réécouter", exact: true });
}

/** Le personnage guide prend la place de la consigne : la zone du personnage est là une seule fois, la consigne n'y est plus. */
async function verifierQueLePersonnageGuideALaPlaceDeLaConsigne(page: Page, nom: string): Promise<void> {
  await expect(zoneDuPersonnageGuide(page)).toHaveCount(1);
  await expect(leGuide(page, nom)).toBeVisible();
  await expect(consigneAffichee(page)).toHaveCount(0);
}

/** La voix factice ne finit jamais seule : on termine ses lectures, puis la consigne revient et le personnage guide disparaît. En Muet, sans voix à finir, c'est la durée d'affichage qui la ramène. */
async function laConsigneRevientSansLePersonnageGuide(page: Page): Promise<void> {
  await expect.poll(async () => {
    const revenue = (await consigneAffichee(page).count()) === 1 && (await zoneDuPersonnageGuide(page).count()) === 0;
    if (!revenue && !scenario(page).muet) await terminerLaLecture(page);
    return revenue;
  }, { intervals: [200] }).toBe(true);
  await expect(personnageGuideAffiche(page)).toHaveCount(0);
}

const lotsAvantLaReecoute = new WeakMap<Page, number>();

// --- Étant donné : la page et l'appareil

Given(/^l'écran de l'appareil mesure (\d+) px de large et (\d+) px de haut$/, async ({ page }, largeur: string, hauteur: string) => {
  await page.setViewportSize({ width: Number(largeur), height: Number(hauteur) });
});

Given(/^la question « (.+) » s'est affichée$/, async ({ page }, question: string) => {
  await allerALaQuestion(page, question, false);
  await expect(page.getByTestId("exercice-en-cours")).toBeVisible();
});

Given(
  /^Léa a dit « Je ne sais pas » à la question « (?!.*» dont la réponse est)(.+) »$/,
  async ({ page }, question: string) => {
    await allerALaQuestion(page, question, true);
    await direJeNeSaisPas(page);
  },
);

Given(/^le chrono de la fluence a démarré, sans aucune réponse de Léa$/, async ({ page }) => {
  await expect(fluence(page)).toHaveAttribute("data-etat", "en-cours");
  await expect(page.getByTestId("calculs-reussis")).toHaveAttribute("data-score", "0");
});

Given(/^Léa a déjà fait une erreur dans la séance$/, async ({ page }) => {
  await faireUneErreur(page);
});

Given(/^Léa a ouvert la pause$/, async ({ page }) => {
  await boutonRetour(page).click();
  await expect(laPause(page)).toBeVisible();
});

Given(/^Noisette est en train de dire sa félicitation$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  await expect.poll(async () => (await journal(page)).actifs).toBeGreaterThan(0);
});

Given(/^Tom commence la séance complète de la leçon « ([^«»]+) »$/, async ({ page, monde }, titre: string) => {
  const profil: ProfilPrepare = monde.profils.get("Tom") ?? { prenom: "Tom", niveau: "CM2", univers: cleDe("Animaux de la forêt") };
  await preparerProfil(page, profil);
  await ouvrirLaPageDeLaLecon(page, titre);
  await commencerLaSeanceComplete(page);
});

Given(
  /^Léa a posé l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) »$/,
  async ({ page }, etiquette: string, nomDeLaMaison: string) => {
    await poserEtAttendre(page, etiquette, nomDeLaMaison, "mal");
  },
);

// --- Quand : les gestes de retour

When(/^Léa touche Retour$/, async ({ page }) => {
  await boutonRetour(page).click();
});

When(/^Léa fait le geste retour du navigateur$/, async ({ page }) => {
  await page.goBack();
});

When(/^Léa choisit « (Je continue la leçon|Retour à la leçon) »$/, async ({ page }, choix: string) => {
  await laPause(page).getByRole("button", { name: choix, exact: true }).click();
});

When(/^Léa appuie sur Échap, au clavier$/, async ({ page }) => {
  await page.keyboard.press("Escape");
});

// --- Alors : la barre du haut

Then(/^Léa voit en haut de l'écran Retour, le nom de la leçon « ([^«»]+) » et le son$/, async ({ page }, titre: string) => {
  const barre = barreDuHaut(page);
  await expect(barre).toBeVisible();
  await expect(barre.getByRole("button", { name: "Retour", exact: true })).toBeVisible();
  await expect(barre.getByRole("heading", { level: 2, name: titre, exact: true })).toBeVisible();
  await expect(barre.getByRole("button", { name: "Son" })).toBeVisible();
  const boite = await barre.boundingBox();
  expect(boite?.y ?? Number.POSITIVE_INFINITY, "la barre du haut est collée en haut de l'écran").toBeLessThanOrEqual(1);
});

Then(/^Léa ne voit ni « Savanturier », ni son prénom et sa classe, ni « Espace parent »$/, async ({ page }) => {
  await expect(page.getByText("Savanturier", { exact: true })).toHaveCount(0);
  await expect(page.getByTestId("enfant-en-cours")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Espace parent" })).toHaveCount(0);
});

Then(/^Léa ne voit ni la classe ni la matière de la leçon$/, async ({ page }) => {
  await expect(page.getByTestId("niveau-et-matiere")).toHaveCount(0);
});

Then(/^les lecteurs d'écran annoncent la séance sous le nom « ([^«»]+) »$/, async ({ page }, titre: string) => {
  const seance = page.getByRole("region", { name: titre, exact: true });
  await expect(seance).toBeVisible();
  await expect(seance.locator("h2")).toHaveText(titre);
  await expect(seance.getByTestId("recipient")).toBeVisible();
});

// --- Quand : « Réécouter » pendant que le personnage guide répond

When(/^Léa demande à réécouter pendant que (.+) lui répond$/, async ({ page }, nom: string) => {
  await expect(leGuide(page, nom)).toBeVisible();
  const reecouter = boutonReecouter(page);
  await expect(reecouter).not.toHaveAttribute("aria-disabled", "true");
  lotsAvantLaReecoute.set(page, (await journal(page)).lots);
  await reecouter.click();
});

// --- Alors : la consigne et le personnage guide dans la bulle

Then(/^Léa voit la consigne « (.+) » sur toute la largeur de la bulle$/, async ({ page }, texte: string) => {
  const consigne = consigneAffichee(page);
  await expect(consigne).toHaveText(normaliser(texte));
  const texteDeLaBulle = await page.locator(".texte-de-la-bulle").boundingBox();
  const boite = await consigne.boundingBox();
  expect(boite, "consigne visible").not.toBeNull();
  expect(texteDeLaBulle, "bulle visible").not.toBeNull();
  expect(boite?.x ?? 0, "bord gauche de la consigne").toBeLessThanOrEqual((texteDeLaBulle?.x ?? 0) + 1);
  expect((boite?.x ?? 0) + (boite?.width ?? 0), "bord droit de la consigne").toBeGreaterThanOrEqual(
    (texteDeLaBulle?.x ?? 0) + (texteDeLaBulle?.width ?? 0) - 1,
  );
});

Then(/^Léa ne voit pas (?:.+) à côté de la consigne$/, async ({ page }) => {
  await expect(consigneAffichee(page)).toBeVisible();
  await expect(personnageGuideAffiche(page)).toHaveCount(0);
  await expect(zoneDuPersonnageGuide(page)).toHaveCount(0);
});

Then(/^(.+) apparaît à la place de la bulle et dit une félicitation commune ou l'une de ses expressions, en entier$/, async ({ page }, nom: string) => {
  await verifierQueLePersonnageGuideALaPlaceDeLaConsigne(page, nom);
  await verifierLaFelicitationEnEntier(page);
});

Then(
  /^(.+) apparaît à la place de la bulle, réfléchit en penchant la tête et dit un encouragement$/,
  async ({ page }, nom: string) => {
    await verifierQueLePersonnageGuideALaPlaceDeLaConsigne(page, nom);
    await expect(leGuide(page, nom)).toHaveAttribute("data-humeur", "reflechit");
    await expect(leGuide(page, nom)).toHaveAttribute("data-geste", "penche");
    await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
    expect(normaliser((await bulle(page).textContent()) ?? "")).not.toBe("");
  },
);

Then(
  /^ensuite seulement, la question « (.+) » s'affiche, avec sa consigne et sans (?:.+)$/,
  async ({ page }, question: string) => {
    await expect(page.getByTestId("question")).not.toHaveText(question);
    await finirLaParoleJusqua(page, { type: "question", texte: question });
    await expect(page.getByTestId("question")).toHaveText(question);
    await laConsigneRevientSansLePersonnageGuide(page);
    await expect(consigneAffichee(page)).toBeVisible();
    await expect(personnageGuideAffiche(page)).toHaveCount(0);
    await expect(zoneDuPersonnageGuide(page)).toHaveCount(0);
  },
);

Then(/^ensuite, Léa voit de nouveau la consigne, sans (?:.+)$/, async ({ page }) => {
  await laConsigneRevientSansLePersonnageGuide(page);
});

Then(/^ensuite, Léa voit de nouveau la consigne « (.+) »$/, async ({ page }, texte: string) => {
  await laConsigneRevientSansLePersonnageGuide(page);
  await expect(consigneAffichee(page)).toHaveText(normaliser(texte));
});

// --- Alors : un seul bouton « Réécouter »

Then(/^Léa voit un seul bouton « Réécouter »$/, async ({ page }) => {
  await expect(boutonReecouter(page)).toHaveCount(1);
  await expect(boutonReecouter(page)).toBeVisible();
});

Then(/^Léa ne voit pas de bouton « Relire la consigne »$/, async ({ page }) => {
  await expect(page.getByRole("button", { name: "Relire la consigne" })).toHaveCount(0);
});

Then(/^Léa entend de nouveau Noisette lire « ([^«»]+) », puis « ([^«»]+) »$/, async ({ page }, consigne: string, question: string) => {
  await expect.poll(async () => (await journal(page)).lots).toBeGreaterThanOrEqual(2);
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(normaliser(consigne));
  await terminerLaLecture(page);
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(normaliser(question));
});

Then(/^Léa entend de nouveau (.+) dire « (.*[«»].*) »$/, async ({ page }, _nom: string, texte: string) => {
  await expect.poll(async () => (await journal(page)).lots).toBeGreaterThan(lotsAvantLaReecoute.get(page) ?? 1);
  // La phrase de réponse commence par une expression d'encouragement tirée au hasard.
  await expect.poll(async () => (await journal(page)).lecture.texte.endsWith(entendu(texte))).toBe(true);
});

// --- Alors : la progression et le compteur

Then(/^Léa voit le compteur « (\d+) \/ (\d+) » sous la barre de progression$/, async ({ page }, reussies: string, total: string) => {
  await expect(compteur(page)).toHaveText(`${reussies} / ${total}`);
  const compteurBoite = await compteur(page).boundingBox();
  const barreBoite = await page.locator(".piste-de-la-seance").boundingBox();
  // L'éclat agrandit le compteur pendant un instant : on compare son centre, pas son bord.
  const centreDuCompteur = (compteurBoite?.y ?? 0) + (compteurBoite?.height ?? 0) / 2;
  expect(centreDuCompteur, "le compteur est sous la barre").toBeGreaterThanOrEqual((barreBoite?.y ?? 0) + (barreBoite?.height ?? 0));
});

Then(/^les lecteurs d'écran trouvent une barre de progression à (\d+) sur (\d+)$/, async ({ page }, reussies: string, total: string) => {
  const barre = page.getByRole("progressbar");
  await expect(barre).toHaveCount(1);
  await expect(barre).toHaveAttribute("aria-valuemin", "0");
  await expect(barre).toHaveAttribute("aria-valuenow", String(reussies));
  await expect(barre).toHaveAttribute("aria-valuemax", String(total));
});

async function leCompteurABrille(page: Page): Promise<void> {
  await expect.poll(async () => (await observer(page)).vu, { timeout: DELAI_DE_L_ATTENTE_MS }).toContain("eclat-du-compteur");
}

async function aucunEclatSurLeCompteur(page: Page): Promise<void> {
  await expect(compteur(page)).not.toHaveAttribute("data-eclat", "true");
  expect((await observer(page)).vu.filter((vu) => vu === "eclat-du-compteur")).toEqual([]);
}

async function avancementsVus(page: Page): Promise<string[]> {
  const { vu } = await observer(page);
  return [...new Set(vu.filter((observe) => observe.startsWith("avancement:")))];
}

async function dureeDeLaTransition(page: Page): Promise<number> {
  const duree = await remplissage(page).evaluate((element) => getComputedStyle(element).transitionDuration);
  return Math.max(...duree.split(",").map((valeur) => Number.parseFloat(valeur)));
}

Then(/^la barre de progression (?:avance|s'allonge), avec un éclat sur le compteur$/, async ({ page }) => {
  await leCompteurABrille(page);
  expect((await avancementsVus(page)).length, "la barre a avancé").toBeGreaterThan(1);
});

Then(/^la barre de progression s'allonge et un éclat brille sur le compteur$/, async ({ page }) => {
  await leCompteurABrille(page);
  expect((await avancementsVus(page)).length, "la barre a avancé").toBeGreaterThan(1);
  expect(await dureeDeLaTransition(page), "la barre s'allonge en douceur").toBeGreaterThan(0);
});

Then(/^la barre de progression n'avance pas$/, async ({ page }) => {
  await aucunEclatSurLeCompteur(page);
  expect((await avancementsVus(page)).length, "la barre n'a pas avancé").toBeLessThanOrEqual(1);
});

Then(/^la barre de progression avance d'un coup, sans éclat$/, async ({ page }) => {
  expect(await avancementsVus(page)).toHaveLength(2);
  await aucunEclatSurLeCompteur(page);
  expect(await dureeDeLaTransition(page), "la barre n'a aucune transition").toBe(0);
});

Then(/^la barre de progression montre « (\d+) \/ (\d+) » d'un coup, sans s'allonger ni briller$/, async ({ page }, reussies: string, total: string) => {
  await expect(compteur(page)).toHaveText(`${reussies} / ${total}`);
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(reussies));
  await aucunEclatSurLeCompteur(page);
  expect(await dureeDeLaTransition(page), "la barre n'a aucune transition").toBe(0);
});

Then(/^Léa entend les effets sonores « ([^«»]+) » puis « ([^«»]+) »$/, async ({ page }, premier: string, second: string) => {
  await effetPuisParole(page, [premier, second], "felicitation", false);
});

Then(/^tous les choix de la question restent visibles en entier$/, async ({ page }) => {
  const largeur = page.viewportSize()?.width ?? 360;
  const choix = await page.getByTestId("choix").all();
  expect(choix.length, "choix de la question").toBeGreaterThan(0);
  for (const element of choix) {
    await element.scrollIntoViewIfNeeded();
    const boite = await element.boundingBox();
    expect(boite, "choix affiché").not.toBeNull();
    if (!boite) continue;
    expect(boite.x, "bord gauche du choix").toBeGreaterThanOrEqual(0);
    expect(boite.x + boite.width, "bord droit du choix").toBeLessThanOrEqual(largeur + 0.5);
    const libre = await element.evaluate((choisi) => {
      const rectangle = choisi.getBoundingClientRect();
      const dessus = document.elementFromPoint(rectangle.x + rectangle.width / 2, rectangle.y + rectangle.height / 2);
      return dessus !== null && choisi.contains(dessus);
    });
    expect(libre, `rien ne cache le choix « ${await element.textContent()} »`).toBe(true);
  }
});

// --- Alors : la pause

Then(/^Léa voit la pause « ([^«»]+) »$/, async ({ page }, titre: string) => {
  const pause = laPause(page);
  await expect(pause).toBeVisible();
  await expect(pause.getByRole("heading", { name: titre, exact: true })).toBeVisible();
});

Then(
  /^Léa voit la pause « ([^«»]+) », qui propose d'abord « ([^«»]+) », puis « ([^«»]+) »$/,
  async ({ page }, titre: string, premier: string, second: string) => {
    const pause = laPause(page);
    await expect(pause).toBeVisible();
    await expect(pause.getByRole("heading", { name: titre, exact: true })).toBeVisible();
    await expect(pause.getByRole("button")).toHaveText([premier, second]);
    await expect(pause.getByRole("button", { name: premier, exact: true }), "le focus est sur le premier choix").toBeFocused();
  },
);

Then(/^Léa ne voit aucun compte à rebours$/, async ({ page }) => {
  const pause = laPause(page);
  await expect(pause).toBeVisible();
  await expect(pause.getByRole("timer")).toHaveCount(0);
  await expect(pause.getByRole("progressbar")).toHaveCount(0);
  await expect(pause.getByText(/\d+\s*(?:s\b|secondes?)/)).toHaveCount(0);
});

Then(/^Léa ne voit (?:plus|pas) la pause$/, async ({ page }) => {
  await expect(laPause(page)).toHaveCount(0);
});

Then(/^la pause « ([^«»]+) » apparaît sans glisser$/, async ({ page }, titre: string) => {
  const pause = laPause(page);
  await expect(pause).toBeVisible();
  await expect(pause.getByRole("heading", { name: titre, exact: true })).toBeVisible();
  const animations = await pause.evaluate((element) => element.getAnimations({ subtree: true }).length);
  expect(animations, "aucune animation sur la feuille de pause").toBe(0);
});

// --- Alors : la géométrie sur un téléphone

Then(/^l'exercice commence au plus à (\d+) px du haut de l'écran$/, async ({ page }, limite: string) => {
  const exercice = page.getByTestId("exercice-en-cours");
  await expect(exercice).toBeVisible();
  // Le bloc « consigne + exercice » commence au premier des éléments visibles : la consigne, la bulle qui la dit, sinon l'exercice.
  const hauts: number[] = [];
  for (const element of [consigneAffichee(page), page.getByTestId("parole"), exercice]) {
    if ((await element.count()) === 0 || !(await element.first().isVisible())) continue;
    const boite = await element.first().boundingBox();
    if (boite) hauts.push(boite.y);
  }
  expect(hauts.length, "l'exercice est mesurable").toBeGreaterThan(0);
  expect(Math.min(...hauts), "haut du bloc consigne et exercice").toBeLessThanOrEqual(Number(limite));
});

Then(
  /^chaque commande de la séance mesure au moins 44 px de haut et de large, et les boutons de la barre d'action au moins 52 px de haut$/,
  async ({ page }) => {
    // La barre d'action n'a pas de bouton tant que la voix lit la question : on termine la lecture pour que les choix arrivent.
    await expect.poll(async () => {
      const prete = (await barreDAction(page).getByRole("button").count()) > 0;
      if (!prete && !scenario(page).muet) await terminerLaLecture(page);
      return prete;
    }, { intervals: [200] }).toBe(true);
    const seance = page.getByRole("region").filter({ has: recipient(page) });
    // La barre d'action est posée dans l'application, hors de la région de la séance : ses boutons comptent aussi.
    const commandes = [...(await seance.getByRole("button").all()), ...(await barreDAction(page).getByRole("button").all())];
    expect(commandes.length).toBeGreaterThan(0);
    for (const commande of commandes) {
      const boite = await commande.boundingBox();
      const nom = (await commande.textContent()) || (await commande.getAttribute("aria-label"));
      expect(boite, `commande « ${nom} » visible`).not.toBeNull();
      expect(boite?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
      expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
    }
    const boutonsDeLaBarre = await barreDAction(page).getByRole("button").all();
    expect(boutonsDeLaBarre.length, "la barre d'action porte au moins un bouton").toBeGreaterThan(0);
    for (const bouton of boutonsDeLaBarre) {
      const boite = await bouton.boundingBox();
      expect(boite?.height ?? 0, `hauteur de « ${await bouton.textContent()} »`).toBeGreaterThanOrEqual(52);
    }
  },
);

// --- Alors : le mode dys sur 360 px

type MesuresDuTexte = { lignes: number; motsCoupes: string[]; debordement: number; cesureAutomatique: boolean };

/** Compte les lignes du texte, repère les mots répartis sur deux lignes et le débordement horizontal de l'élément. */
async function mesurerLeTexte(element: Locator): Promise<MesuresDuTexte> {
  return await element.evaluate((racine): MesuresDuTexte => {
    const marcheur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
    const hauts = new Set<number>();
    const motsCoupes: string[] = [];
    for (let noeud = marcheur.nextNode(); noeud; noeud = marcheur.nextNode()) {
      for (const mot of (noeud.textContent ?? "").matchAll(/\S+/g)) {
        const intervalle = document.createRange();
        intervalle.setStart(noeud, mot.index ?? 0);
        intervalle.setEnd(noeud, (mot.index ?? 0) + mot[0].length);
        const lignesDuMot = new Set([...intervalle.getClientRects()].map((rectangle) => Math.round(rectangle.top)));
        if (lignesDuMot.size > 1) motsCoupes.push(mot[0]);
        for (const haut of lignesDuMot) hauts.add(haut);
      }
    }
    const style = getComputedStyle(racine);
    return {
      lignes: hauts.size,
      motsCoupes,
      debordement: racine.scrollWidth - racine.clientWidth,
      cesureAutomatique: style.hyphens === "auto" || style.overflowWrap === "anywhere" || style.wordBreak === "break-all",
    };
  });
}

Then(
  /^Tom lit le nom de la leçon en entier, sur deux lignes au plus, sans mot coupé, en mode dys$/,
  async ({ page }) => {
    await expect(page.getByRole("main")).toHaveAttribute("data-mode-dys", "true");
    const titre = barreDuHaut(page).getByRole("heading", { level: 2 });
    await expect(titre).toHaveText(leconCourante(page).titre);
    const famille = await titre.evaluate((element) => getComputedStyle(element).fontFamily);
    expect(famille, "police du mode dys").toContain("Andika");
    const mesures = await mesurerLeTexte(titre);
    expect(mesures.lignes, "lignes du nom de la leçon").toBeLessThanOrEqual(2);
    expect(mesures.motsCoupes, "mots coupés").toEqual([]);
    expect(mesures.debordement, "débordement horizontal").toBeLessThanOrEqual(0);
    expect(mesures.cesureAutomatique, "ni césure ni coupure de mot").toBe(false);
  },
);

Then(/^les libellés de la barre d'action passent à la ligne sans couper un mot$/, async ({ page }) => {
  await expect(barreDAction(page)).toHaveAttribute("data-mode-dys", "true");
  const boutons = await barreDAction(page).getByRole("button").all();
  expect(boutons.length, "la barre d'action porte au moins un bouton").toBeGreaterThan(0);
  for (const bouton of boutons) {
    const famille = await bouton.evaluate((element) => getComputedStyle(element).fontFamily);
    expect(famille, `police du mode dys sur « ${await bouton.textContent()} »`).toContain("Andika");
    const mesures = await mesurerLeTexte(bouton);
    expect(mesures.motsCoupes, `mots coupés dans « ${await bouton.textContent()} »`).toEqual([]);
    expect(mesures.debordement, "débordement horizontal").toBeLessThanOrEqual(0);
  }
});

// --- Alors : la barre d'action, en bas de l'écran

function boutonDeLaBarre(page: Page, nom: string): Locator {
  return barreDAction(page).getByRole("button", { name: nom, exact: true });
}

/** La barre d'action monte en glissant à son apparition : on mesure une fois sa position arrêtée. */
async function boiteArretee(element: Locator) {
  let precedente = await element.boundingBox();
  let courante = precedente;
  await expect.poll(async () => {
    courante = await element.boundingBox();
    const arretee = precedente !== null && courante !== null && precedente.y === courante.y && precedente.height === courante.height;
    precedente = courante;
    return arretee;
  }, { intervals: [150] }).toBe(true);
  return courante;
}

/** Le bouton principal est le dernier de la barre, à droite de « Je ne sais pas » ; la barre est collée au bas de l'écran. */
async function verifierLeBoutonPrincipalDeLaBarre(page: Page, nom: string): Promise<void> {
  const bouton = boutonDeLaBarre(page, nom);
  await expect(barreDAction(page)).toBeVisible();
  await expect(bouton).toBeVisible();
  const hauteurDeLEcran = page.viewportSize()?.height ?? 0;
  const barre = await boiteArretee(barreDAction(page));
  const boite = await boiteArretee(bouton);
  expect(barre, "barre d'action affichée").not.toBeNull();
  expect((barre?.y ?? 0) + (barre?.height ?? 0), "bas de la barre d'action").toBeGreaterThanOrEqual(hauteurDeLEcran - 1);
  expect((barre?.y ?? 0) + (barre?.height ?? 0), "la barre ne dépasse pas l'écran").toBeLessThanOrEqual(hauteurDeLEcran + 1);
  expect(boite?.y ?? 0, `« ${nom} » est dans la barre`).toBeGreaterThanOrEqual(barre?.y ?? 0);
  expect((boite?.y ?? 0) + (boite?.height ?? 0), `« ${nom} » est dans la barre`).toBeLessThanOrEqual((barre?.y ?? 0) + (barre?.height ?? 0) + 1);
  const autres = await barreDAction(page).getByRole("button").all();
  for (const autre of autres) {
    const nomDeLAutre = ((await autre.textContent()) ?? "").trim();
    if (nomDeLAutre === nom) continue;
    const boiteDeLAutre = await autre.boundingBox();
    expect(boiteDeLAutre?.x ?? 0, `« ${nomDeLAutre} » est à gauche de « ${nom} »`).toBeLessThan(boite?.x ?? 0);
  }
}

Then(/^(?:Tom|Léa) voit « (Valider|Continuer) » en bouton principal de la barre d'action, en bas de l'écran$/, async ({ page }, nom: string) => {
  await verifierLeBoutonPrincipalDeLaBarre(page, nom);
});

Then(/^(?:Tom|Léa) voit « Je ne sais pas » à côté, plus discret$/, async ({ page }) => {
  const jeNeSaisPas = boutonDeLaBarre(page, "Je ne sais pas");
  await expect(jeNeSaisPas).toBeVisible();
  const principal = barreDAction(page).getByRole("button").filter({ hasNotText: "Je ne sais pas" });
  await expect(principal).toHaveCount(1);
  const [petit, grand] = [await jeNeSaisPas.boundingBox(), await principal.boundingBox()];
  expect((petit?.x ?? 0) + (petit?.width ?? 0), "« Je ne sais pas » est à gauche du bouton principal").toBeLessThanOrEqual((grand?.x ?? 0) + 1);
  expect((petit?.width ?? 0) * (petit?.height ?? 0), "« Je ne sais pas » est moins grand que le bouton principal").toBeLessThanOrEqual(
    (grand?.width ?? 0) * (grand?.height ?? 0),
  );
  const fonds = await Promise.all([jeNeSaisPas, principal].map((bouton) => bouton.evaluate((element) => getComputedStyle(element).backgroundColor)));
  expect(fonds[0], "« Je ne sais pas » n'a pas le fond du bouton principal").not.toBe(fonds[1]);
});

Then(/^(?:Tom|Léa) ne voit pas « Je ne sais pas »$/, async ({ page }) => {
  await expect(page.getByTestId("je-ne-sais-pas")).toBeHidden();
  await expect(page.getByRole("button", { name: "Je ne sais pas", exact: true })).toHaveCount(0);
});

Then(/^(?:Tom|Léa) voit « Je ne sais pas » dans la barre d'action$/, async ({ page }) => {
  await avancerJusquAuxChoix(page);
  await expect(barreDAction(page)).toBeVisible();
  await expect(boutonDeLaBarre(page, "Je ne sais pas")).toBeVisible();
});

Then(/^(?:Tom|Léa) ne voit ni « Valider » ni « Continuer »$/, async ({ page }) => {
  await expect(page.getByRole("button", { name: "Valider", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Continuer", exact: true })).toHaveCount(0);
  await expect(barreDAction(page).getByRole("button")).toHaveText(["Je ne sais pas"]);
});
