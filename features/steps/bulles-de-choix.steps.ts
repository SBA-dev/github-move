import { expect, type Page } from "@playwright/test";
import { Before, Given, Then, When } from "./fixtures.ts";
import { etat as etatDeLaLecon, leconDeTitre } from "./etapes-puis-exercices.steps.ts";
import {
  allerALaQuestion,
  avancerJusquAuxChoix,
  bulleDeChoix,
  demarrer,
  etatDesChoix,
  lancer,
  nombresPourMelanger,
  questionsDeLaLecon,
  questionsReussies,
  textesDesChoix,
} from "./exercices-a-choix.steps.ts";
import { rechoisirLeaApresUnReglage } from "./profil-reel.ts";
import { allerAuCalcul, lancerLExerciceDeTest, partie20 } from "./calcul-fluence-addition.steps.ts";
import { choisirSonProfil, modifierLeProfil } from "./profils-enfants.steps.ts";
import { cleDe, listeDe } from "./univers.steps.ts";
import { journal, terminerLaLecture } from "./voix.steps.ts";

// Story #126, tranche 98b de #98 : les choix de réponse sont des bulles de l'univers de l'enfant, qui flottent doucement.
//
// Le contrat entre ces étapes et l'application (tout se lit par des attributs, des data-testid, des styles calculés et des
// positions, jamais par un tracé SVG) :
//   - data-testid="choix" (le bouton, zone de toucher qui ne bouge jamais) :
//       data-univers = clé de l'univers (animaux, princesse, sports, police, pompier, danse) sur CHAQUE bulle de choix, y compris
//         au calcul par choix ; data-flotte="true" tant que la bulle flotte (absent sinon) ; data-ecarte, data-brille, data-retour
//         et data-eclatee gardés ; data-vide="true" quand le mot juste a quitté la bulle pour son trou ;
//   - data-testid="dessin-de-la-bulle" (aria-hidden="true", un par bulle) : le dessin de l'univers ;
//   - data-testid="flottement" (un par bulle, dans le bouton) : le seul calque qui bouge (animation CSS ou WAAPI, même nom, même
//       durée, mêmes itérations sur chaque bulle ; un décalage régulier selon le rang est permis) ;
//   - data-testid="signal-brille" dans la bulle de la bonne réponse montrée (le signal commun de la maison de #98) ;
//   - data-testid="mot-qui-voyage" (aria-hidden) : le mot juste en chemin vers son trou ou sa ligne, présent seulement pendant
//       le trajet ; data-testid="trou-rempli" : un trou rempli ; data-eclat="true" : l'éclat bref de la place qui reçoit le mot
//       (sur trou-rempli, ou sur ligne-de-conjugaison à l'état « ecrite »).

// --- Ce que le navigateur voit passer, noté dès le départ

type Boite = { x: number; y: number; width: number; height: number };

type PassageDeBulle =
  | { t: number; genre: "choix"; rang: number; texte: string; retour: string; eclatee: string; flotte: string; vide: string; reussite: string; fondDuDessin: string }
  | { t: number; genre: "eclat"; testid: string; texte: string; eclat: string; boite: Boite }
  | { t: number; genre: "brille"; testid: string };

type Voyage = { t: number; texte: string; boite: Boite };

type Clic = {
  t: number;
  rang: number;
  texte: string;
  boites: Record<string, Boite>;
  boiteDuChoix: Boite | null;
  annonceDuTrou: string;
  ligneEnCours: string;
  flotteAvant: boolean;
};

type Journal126 = { passages: PassageDeBulle[]; voyages: Voyage[]; dernierClic: Clic | null };

export function installerLEnregistreurDeLaStory126() {
  type BoiteLocale = { x: number; y: number; width: number; height: number };
  const journal126 = { passages: [] as Array<Record<string, unknown>>, voyages: [] as Array<Record<string, unknown>>, dernierClic: null as Record<string, unknown> | null };
  Reflect.set(window, "__bulles126", journal126);
  const texteDe = (element: Element) => (element.textContent ?? "").replace(/\s+/g, " ").trim();
  const attribut = (element: Element, nom: string) => element.getAttribute(nom) ?? "";
  const boiteDe = (element: Element): BoiteLocale => {
    const boite = element.getBoundingClientRect();
    return { x: boite.x, y: boite.y, width: boite.width, height: boite.height };
  };
  const tousLesChoix = () => [...document.querySelectorAll('[data-testid="choix"]')];
  const tracePourLeFond = (choix: Element) => choix.querySelector('[data-testid="dessin-de-la-bulle"] svg > path:first-of-type');

  document.addEventListener("click", (evenement) => {
    const cible = evenement.target;
    if (!(cible instanceof Element) || cible.closest("button") === null) return;
    const choix = tousLesChoix();
    const touche = cible.closest('[data-testid="choix"]');
    const boites: Record<string, BoiteLocale> = {};
    for (const unChoix of choix) boites[texteDe(unChoix)] = boiteDe(unChoix);
    const annonce = document.querySelector('[data-testid="trou-annonce"]');
    const ligne = document.querySelector('[data-testid="ligne-de-conjugaison"][data-etat="en-cours"]');
    journal126.dernierClic = {
      t: performance.now(),
      rang: touche === null ? -1 : choix.indexOf(touche),
      texte: touche === null ? "" : texteDe(touche),
      boites,
      boiteDuChoix: touche === null ? null : boiteDe(touche),
      annonceDuTrou: annonce === null ? "" : texteDe(annonce),
      ligneEnCours: ligne === null ? "" : texteDe(ligne),
      flotteAvant: choix.some((unChoix) => unChoix.getAttribute("data-flotte") === "true"),
    };
  }, true);

  const noter = (element: Element) => {
    const identifiant = attribut(element, "data-testid");
    if (identifiant === "choix") {
      journal126.passages.push({
        t: performance.now(),
        genre: "choix",
        rang: tousLesChoix().indexOf(element),
        texte: texteDe(element),
        retour: attribut(element, "data-retour"),
        eclatee: attribut(element, "data-eclatee"),
        flotte: attribut(element, "data-flotte"),
        vide: attribut(element, "data-vide"),
        reussite: attribut(element, "data-reussite"),
        // Le tracé du fond du dessin est opaque : c'est lui, et non le fond du bouton, que l'enfant voit.
        fondDuDessin: tracePourLeFond(element) ? getComputedStyle(tracePourLeFond(element) as Element).fill : "sans dessin",
      });
    }
    if (element.hasAttribute("data-eclat")) {
      journal126.passages.push({ t: performance.now(), genre: "eclat", testid: identifiant, texte: texteDe(element), eclat: attribut(element, "data-eclat"), boite: boiteDe(element) });
    }
    if (attribut(element, "data-brille") === "true") journal126.passages.push({ t: performance.now(), genre: "brille", testid: identifiant });
  };
  const SELECTEUR = '[data-testid="choix"],[data-eclat],[data-brille]';
  new MutationObserver((enregistrements) => {
    for (const enregistrement of enregistrements) {
      if (enregistrement.type === "attributes" && enregistrement.target instanceof Element) noter(enregistrement.target);
      for (const ajoute of enregistrement.addedNodes) {
        if (!(ajoute instanceof Element)) continue;
        noter(ajoute);
        ajoute.querySelectorAll(SELECTEUR).forEach(noter);
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-retour", "data-eclatee", "data-flotte", "data-vide", "data-eclat", "data-brille", "data-reussite"],
  });

  // Le mot juste en chemin : sa position est notée à chaque image, et à chaque fois que la page le déplace (son style change).
  // Quand le navigateur est chargé, les images de l'échantillonnage se font rares : le style, lui, ne bouge que dans les images de la page,
  // et l'observateur le voit tout de suite, jusqu'à l'arrivée.
  const noterLeVoyage = (mot: Element) => {
    journal126.voyages.push({ t: performance.now(), texte: texteDe(mot), boite: boiteDe(mot) });
  };
  const echantillonner = () => {
    // Une bulle de choix juste est notée à chaque image : sa couleur peut changer (transition) sans que ses attributs bougent.
    document.querySelectorAll('[data-testid="choix"][data-reussite="true"]').forEach(noter);
    document.querySelectorAll('[data-testid="mot-qui-voyage"]').forEach(noterLeVoyage);
    requestAnimationFrame(echantillonner);
  };
  requestAnimationFrame(echantillonner);
  const estUnMotQuiVoyage = (element: Element) => element.getAttribute("data-testid") === "mot-qui-voyage";
  new MutationObserver((enregistrements) => {
    for (const enregistrement of enregistrements) {
      if (enregistrement.target instanceof Element && estUnMotQuiVoyage(enregistrement.target)) noterLeVoyage(enregistrement.target);
    }
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ["style"] });
}

Before({ tags: "@issue-126" }, async ({ page }) => {
  await page.addInitScript(installerLEnregistreurDeLaStory126);
});

async function lireLeJournal(page: Page): Promise<Journal126> {
  return await page.evaluate(() => {
    const brut = Reflect.get(window, "__bulles126") as { passages: unknown[]; voyages: unknown[]; dernierClic: unknown } | undefined;
    return JSON.parse(JSON.stringify(brut ?? { passages: [], voyages: [], dernierClic: null }));
  }) as Journal126;
}

async function leDernierClic(page: Page): Promise<Clic> {
  const { dernierClic } = await lireLeJournal(page);
  if (dernierClic === null) throw new Error("Léa n'a encore rien touché");
  return dernierClic;
}

// --- Les écrans

const bulles = (page: Page) => page.getByTestId("choix");

async function bullesDeLaQuestion(page: Page) {
  await avancerJusquAuxChoix(page);
  await expect(bulles(page).first()).toBeVisible();
}

/** Ce que les bulles de choix font pendant `images` images affichées de suite. */
async function observerLeFlottement(page: Page, images: number): Promise<{ bulles: number; flottent: number; animees: number }> {
  return await page.evaluate(async (nombreDImages) => {
    let flottent = 0;
    let animees = 0;
    let bulles = 0;
    for (let image = 0; image < nombreDImages; image++) {
      await new Promise<void>((fait) => requestAnimationFrame(() => fait()));
      const lesBulles = [...document.querySelectorAll('[data-testid="choix"]')];
      bulles = Math.max(bulles, lesBulles.length);
      flottent = Math.max(flottent, lesBulles.filter((bulle) => bulle.getAttribute("data-flotte") === "true").length);
      animees = Math.max(
        animees,
        [...document.querySelectorAll('[data-testid="flottement"]')].filter((calque) => calque.getAnimations().length > 0).length,
      );
    }
    return { bulles, flottent, animees };
  }, images);
}

const IMAGES_POUR_PROUVER_L_IMMOBILITE = 60;

async function verifierQueRienNeFlotte(page: Page): Promise<void> {
  const vu = await observerLeFlottement(page, IMAGES_POUR_PROUVER_L_IMMOBILITE);
  expect(vu.flottent, "bulles de choix qui flottent (data-flotte)").toBe(0);
  expect(vu.animees, "calques « flottement » en mouvement").toBe(0);
}

const normaliser = (texte: string) => texte.replace(/\s+/g, " ").trim();

// --- Flotter ou non

Then(/^aucune bulle de choix ne flotte tant que Noisette lit la question$/, async ({ page }) => {
  await expect(page.getByTestId("question")).toBeVisible();
  await expect.poll(async () => (await journal(page)).actifs, { message: "Noisette lit encore la question" }).toBeGreaterThan(0);
  await verifierQueRienNeFlotte(page);
});

Then(/^ensuite, les bulles de choix flottent doucement, toutes de la même façon$/, async ({ page }) => {
  if ((await journal(page)).actifs > 0) await terminerLaLecture(page);
  await bullesDeLaQuestion(page);
  const nombre = await bulles(page).count();
  expect(nombre, "au moins deux bulles de choix").toBeGreaterThanOrEqual(2);
  for (let rang = 0; rang < nombre; rang++) await expect(bulles(page).nth(rang)).toHaveAttribute("data-flotte", "true");
  const signatures = await bulles(page).evaluateAll((elements) =>
    elements.map((bulle) => {
      const calque = bulle.querySelector('[data-testid="flottement"]');
      if (calque === null) return "sans calque « flottement »";
      const animations = calque.getAnimations();
      if (animations.length === 0) return "aucune animation";
      return animations
        .map((animation) => {
          const duree = animation.effect?.getTiming().duration;
          const iterations = animation.effect?.getTiming().iterations;
          const nom = animation instanceof CSSAnimation ? animation.animationName : "waapi";
          return `${nom}|${String(duree)}|${String(iterations)}`;
        })
        .join(";");
    })
  );
  expect(new Set(signatures).size, `même animation sur chaque bulle de choix : ${signatures.join(" / ")}`).toBe(1);
  expect(signatures[0], "une animation tourne sur le calque").not.toMatch(/^aucune|^sans/);
});

async function verifierQueLesBullesOntArreteDeFlotter(page: Page, quand: string): Promise<void> {
  const clic = await leDernierClic(page);
  expect(clic.flotteAvant, `les bulles de choix flottaient avant ${quand}`).toBe(true);
  await expect.poll(async () => (await observerLeFlottement(page, 3)).flottent, { message: `les bulles s'arrêtent ${quand}` }).toBe(0);
  await verifierQueRienNeFlotte(page);
}

Then(/^aucune bulle de choix ne flotte plus jusqu'à la fin de la question$/, async ({ page }) => {
  await verifierQueLesBullesOntArreteDeFlotter(page, "le premier toucher");
});

Then(
  /^aucune bulle de choix ne flotte pendant que (?:Noisette relit la question|la voix anglaise redit « ([^«»]+) »)$/,
  async ({ page }, mot: string | null | undefined) => {
    await expect.poll(async () => (await journal(page)).actifs, { message: "une parole est en cours" }).toBeGreaterThan(0);
    if (mot != null) expect((await journal(page)).lecture.texte, "la voix anglaise redit le mot").toContain(mot);
    await verifierQueLesBullesOntArreteDeFlotter(page, "la demande de relecture");
  },
);

Then(/^aucune bulle de choix ne flotte$/, async ({ page }) => {
  await bullesDeLaQuestion(page);
  await verifierQueRienNeFlotte(page);
});

Then(/^la zone de toucher de chaque bulle de choix reste immobile pendant que son dessin flotte$/, async ({ page }) => {
  await bullesDeLaQuestion(page);
  const nombre = await bulles(page).count();
  for (let rang = 0; rang < nombre; rang++) await expect(bulles(page).nth(rang)).toHaveAttribute("data-flotte", "true");
  const mesures = await page.evaluate(async () => {
    const lesBulles = [...document.querySelectorAll('[data-testid="choix"]')];
    const boite = (element: Element | null) => {
      const b = element?.getBoundingClientRect();
      return b === undefined ? null : { x: b.x, y: b.y, width: b.width, height: b.height };
    };
    const mesures = lesBulles.map(() => ({ zone: [] as Array<ReturnType<typeof boite>>, dessin: [] as Array<ReturnType<typeof boite>> }));
    for (let image = 0; image < 72; image++) {
      await new Promise<void>((fait) => requestAnimationFrame(() => fait()));
      lesBulles.forEach((bulle, rang) => {
        mesures[rang]?.zone.push(boite(bulle));
        mesures[rang]?.dessin.push(boite(bulle.querySelector('[data-testid="flottement"]')));
      });
    }
    return mesures;
  });
  const ecart = (valeurs: number[]) => Math.max(...valeurs) - Math.min(...valeurs);
  mesures.forEach((mesure, rang) => {
    const zone = mesure.zone.filter((b) => b !== null);
    const dessin = mesure.dessin.filter((b) => b !== null);
    expect(zone.length, `zone de toucher de la bulle ${rang + 1}`).toBeGreaterThan(0);
    expect(dessin.length, `calque « flottement » de la bulle ${rang + 1}`).toBeGreaterThan(0);
    for (const cle of ["x", "y", "width", "height"] as const) {
      expect(ecart(zone.map((b) => b[cle])), `la zone de toucher bouge (${cle}, bulle ${rang + 1})`).toBeLessThan(0.01);
    }
    const deplacement = Math.max(ecart(dessin.map((b) => b.x)), ecart(dessin.map((b) => b.y)));
    expect(deplacement, `le dessin de la bulle ${rang + 1} flotte`).toBeGreaterThan(0.2);
    expect(deplacement, `le dessin de la bulle ${rang + 1} ne flotte que de quelques pixels`).toBeLessThanOrEqual(6);
  });
});

// --- Le dessin de l'univers et ce que lisent les lecteurs d'écran

Then(/^les bulles de choix de la question ont le dessin de l'univers « ([^«»]+) »$/, async ({ page }, univers: string) => {
  const cle = cleDe(univers);
  await bullesDeLaQuestion(page);
  const nombre = await bulles(page).count();
  expect(nombre).toBeGreaterThan(0);
  await expect(page.locator(`[data-testid="choix"][data-univers="${cle}"]`)).toHaveCount(nombre);
  await expect(page.locator(`[data-testid="choix"]:not([data-univers="${cle}"])`)).toHaveCount(0);
  await expect(bulles(page).getByTestId("dessin-de-la-bulle")).toHaveCount(nombre);
  await verifierQueLeDecorNeRecouvrePasLeTexte(page);
});

/** Invariant 18 de la story 98 : le décor habille le texte du choix sans le cacher (tolérance de 1 px). */
async function verifierQueLeDecorNeRecouvrePasLeTexte(page: Page) {
  const recouvrements = await page.evaluate(() => {
    const TOLERANCE = 1;
    const PAS = 1;
    const trouves: string[] = [];
    for (const choix of document.querySelectorAll('[data-testid="choix"]')) {
      // Une bande par ligne de texte : l'union des lignes couvrirait aussi le vide à côté d'une ligne courte centrée.
      const lignes: DOMRect[] = [];
      const intervalle = document.createRange();
      const lecteur = document.createTreeWalker(choix, NodeFilter.SHOW_TEXT);
      for (let texte = lecteur.nextNode(); texte !== null; texte = lecteur.nextNode()) {
        intervalle.selectNodeContents(texte);
        // Seule la bande de la police compte (zone où se dessinent les lettres), centrée dans la ligne : pas l'interligne.
        const taillePolice = parseFloat(getComputedStyle(texte.parentElement ?? (choix as Element)).fontSize);
        for (const ligne of intervalle.getClientRects()) {
          if (ligne.width <= 0 || ligne.height <= 0) continue;
          const hauteurBande = Math.min(taillePolice, ligne.height);
          const haut = ligne.top + (ligne.height - hauteurBande) / 2;
          lignes.push(new DOMRect(ligne.left, haut, ligne.width, hauteurBande));
        }
      }
      if (lignes.length === 0) continue;
      const mot = (choix.textContent ?? "").replace(/\s+/g, " ").trim();
      // La boîte d'un reflet en arc est bien plus grande que son trait : on teste donc la forme elle-même (remplissage et trait),
      // sur une grille de points posée sur chaque ligne du texte.
      for (const forme of choix.querySelectorAll(".decor-de-la-bulle *")) {
        if (!(forme instanceof SVGGeometryElement)) continue;
        // Un clipPath, un masque ou un défilé de dégradé ne se dessine pas : seul ce qui est peint peut cacher le texte.
        if (forme.closest("clipPath, mask, defs") !== null) continue;
        const matrice = forme.getScreenCTM();
        if (matrice === null) continue;
        const inverse = matrice.inverse();
        const style = getComputedStyle(forme);
        const rempli = style.fill !== "none" && style.fillOpacity !== "0";
        const trace = style.stroke !== "none" && style.strokeOpacity !== "0";
        lignes.forEach((ligne, rang) => {
          let gauche = Infinity, droite = -Infinity, haut = Infinity, bas = -Infinity;
          for (let x = ligne.left; x <= ligne.right; x += PAS) {
            for (let y = ligne.top; y <= ligne.bottom; y += PAS) {
              const point = new DOMPoint(x, y).matrixTransform(inverse);
              if ((rempli && forme.isPointInFill(point)) || (trace && forme.isPointInStroke(point))) {
                gauche = Math.min(gauche, x); droite = Math.max(droite, x); haut = Math.min(haut, y); bas = Math.max(bas, y);
              }
            }
          }
          const largeur = droite - gauche;
          const hauteur = bas - haut;
          if (largeur > TOLERANCE && hauteur > TOLERANCE) {
            trouves.push(`[${choix.getAttribute("data-univers")}] « ${mot} » : <${forme.tagName.toLowerCase()}> du décor recouvre le morceau de ligne ${rang + 1}/${lignes.length} du texte de ${largeur.toFixed(1)} px sur ${hauteur.toFixed(1)} px`);
          }
        });
      }
    }
    return trouves;
  });
  expect(recouvrements, "le décor des bulles de choix ne recouvre pas leur texte").toEqual([]);
}

Then(/^le décor des bulles de choix ne cache pas leur texte$/, async ({ page }) => {
  await bullesDeLaQuestion(page);
  expect(await bulles(page).count()).toBeGreaterThan(0);
  await verifierQueLeDecorNeRecouvrePasLeTexte(page);
});

Then(/^les lecteurs d'écran annoncent les choix (.+), sans décrire leur dessin ni leur mouvement$/, async ({ page }, liste: string) => {
  const attendus = listeDe(liste);
  await bullesDeLaQuestion(page);
  await expect(bulles(page)).toHaveCount(attendus.length);
  for (const texte of attendus) await expect(page.getByRole("button", { name: texte, exact: true })).toHaveCount(1);
  const dessins = bulles(page).getByTestId("dessin-de-la-bulle");
  await expect(dessins).toHaveCount(attendus.length);
  for (const dessin of await dessins.all()) await expect(dessin).toHaveAttribute("aria-hidden", "true");
  const arbre = await page.getByTestId("choix-de-la-question").ariaSnapshot();
  expect(arbre, "ce que lisent les lecteurs d'écran").not.toMatch(/img|image|dessin|univers|flott|bulle|anim|mouvement/i);
});

// --- Largeur commune des bulles de choix

Then(/^les bulles de choix (.+) ont la même largeur et la même hauteur$/, async ({ page }, liste: string) => {
  const attendus = listeDe(liste);
  await bullesDeLaQuestion(page);
  const boites = await Promise.all(attendus.map(async (texte) => {
    const boite = await bulleDeChoix(page, texte).boundingBox();
    expect(boite, `bulle de choix « ${texte} » visible`).not.toBeNull();
    return boite as NonNullable<typeof boite>;
  }));
  for (const boite of boites) {
    expect(Math.abs(boite.width - (boites[0]?.width ?? 0)), `largeurs ${boites.map((b) => b.width).join(", ")}`).toBeLessThanOrEqual(1);
    expect(Math.abs(boite.height - (boites[0]?.height ?? 0)), `hauteurs ${boites.map((b) => b.height).join(", ")}`).toBeLessThanOrEqual(1);
  }
});

// --- Le calcul au CP : les étapes de #20 sont réservées à @issue-20

Given(
  /^Léa joue seulement l'exercice « (Les doubles) » de la leçon « (Les doubles) »$/,
  { tags: "@issue-126" },
  async ({ page, monde }, exercice: string, titre: string) => {
    const partie = partie20(page);
    partie.lecon = leconDeTitre(page, titre);
    partie.titreExercice = exercice;
    etatDesChoix(page).demarrage = () => lancerLExerciceDeTest(page, monde);
  },
);

When(/^le calcul « ([^«»]+) » s'affiche$/, { tags: "@issue-126" }, async ({ page }, enonce: string) => {
  await demarrer(page);
  await allerAuCalcul(page, enonce);
});

// --- La bulle de choix juste s'efface en douceur

function passagesDeLaBulle(journal126: Journal126, rang: number) {
  return journal126.passages.flatMap((passage) => passage.genre === "choix" && passage.rang === rang ? [passage] : []);
}

/** La bulle effacée reste à sa place et ne grandit pas : sa boîte n'a jamais dépassé celle d'avant le toucher (une fois le rebond fini). */
async function verifierQueLaBulleSEffaceSurPlace(page: Page, texte: string): Promise<void> {
  const clic = await leDernierClic(page);
  const avant = clic.boites[texte];
  expect(avant, `boîte de « ${texte} » avant le toucher`).toBeDefined();
  const rang = clic.rang;
  await expect.poll(async () => passagesDeLaBulle(await lireLeJournal(page), rang).some((p) => p.eclatee === "true"), {
    message: `la bulle de choix « ${texte} » s'efface (data-eclatee)`,
    timeout: 20_000,
  }).toBe(true);
  const grandit = await page.evaluate(async ([rangDeLaBulleJuste, largeur, hauteur]) => {
    let maximum = 0;
    for (let image = 0; image < 45; image++) {
      await new Promise<void>((fait) => requestAnimationFrame(() => fait()));
      const bulle = document.querySelectorAll('[data-testid="choix"]')[rangDeLaBulleJuste as number];
      if (bulle === undefined || bulle.hasAttribute("data-retour")) continue;
      const boite = bulle.getBoundingClientRect();
      maximum = Math.max(maximum, boite.width - (largeur as number), boite.height - (hauteur as number));
    }
    return maximum;
  }, [rang, avant?.width ?? 0, avant?.height ?? 0]);
  expect(grandit, "la bulle de choix ne grandit pas en s'effaçant").toBeLessThanOrEqual(1);
  const bulle = bulles(page).nth(rang);
  await expect.poll(async () => Number(await bulle.evaluate((element) => getComputedStyle(element).opacity)), {
    message: "la bulle de choix a disparu (fondu)",
  }).toBeLessThanOrEqual(0.01);
  await expect(bulle, "la bulle effacée garde sa place dans la page").toHaveCount(1);
  const apres = await bulle.boundingBox();
  expect(Math.abs((apres?.x ?? 0) - (avant?.x ?? 0)), "la bulle effacée n'a pas bougé (x)").toBeLessThanOrEqual(1);
  expect(Math.abs((apres?.y ?? 0) - (avant?.y ?? 0)), "la bulle effacée n'a pas bougé (y)").toBeLessThanOrEqual(1);
  expect(await bulle.evaluate((element) => getComputedStyle(element).scale), "la bulle effacée ne grandit pas").toMatch(/^(none|1)$/);
}

/**
 * La couleur de réussite se voit sur le dessin de la bulle : son tracé de fond, opaque, cache le fond du bouton.
 * Elle doit y être pendant que la bulle est juste (data-reussite), avant que la bulle s'efface.
 */
async function verifierQueLaBulleJustePrendLaCouleurDeReussite(page: Page, rang: number, texte: string): Promise<void> {
  const attendue = await page.evaluate(() => {
    const sonde = document.createElement("span");
    sonde.style.backgroundColor = "var(--succes-fond)";
    document.body.append(sonde);
    const couleur = getComputedStyle(sonde).backgroundColor;
    sonde.remove();
    return couleur;
  });
  expect(attendue, "la couleur de réussite (--succes-fond) est définie").not.toBe("rgba(0, 0, 0, 0)");
  const justes = passagesDeLaBulle(await lireLeJournal(page), rang).flatMap((passage) =>
    passage.genre === "choix" && passage.reussite === "true" ? [passage] : []
  );
  // Avec les mouvements réduits, la bulle s'efface dès qu'elle est juste (même instant) : son fond se lit alors au premier relevé.
  const avantLEffacement = justes.filter((passage) => passage.eclatee !== "true");
  const vus = (avantLEffacement.length > 0 ? avantLEffacement : justes.slice(0, 1)).map((passage) => passage.fondDuDessin);
  expect(vus, `la bulle de choix « ${texte} » est juste (data-reussite) avant de s'effacer`).not.toEqual([]);
  expect(vus, `le tracé du fond du dessin de « ${texte} » prend la couleur de réussite ${attendue} (il cache le fond du bouton)`).toContain(attendue);
}

Then(/^le choix « ([^«»]+) » rebondit, puis sa bulle de choix s'efface en douceur à sa place, sans éclater$/, async ({ page }, texte: string) => {
  const clic = await leDernierClic(page);
  expect(clic.texte, "Léa a touché ce choix").toBe(texte);
  await expect.poll(async () => passagesDeLaBulle(await lireLeJournal(page), clic.rang).some((p) => p.retour === "rebond"), {
    message: `la bulle de choix « ${texte} » rebondit (data-retour="rebond")`,
    timeout: 20_000,
  }).toBe(true);
  await verifierQueLaBulleSEffaceSurPlace(page, texte);
  await verifierQueLaBulleJustePrendLaCouleurDeReussite(page, clic.rang, texte);
  const passages = passagesDeLaBulle(await lireLeJournal(page), clic.rang);
  const rebond = passages.findIndex((p) => p.retour === "rebond");
  const efface = passages.findIndex((p) => p.eclatee === "true");
  expect(efface, "la bulle s'efface après le rebond, jamais avant ni en même temps").toBeGreaterThan(rebond);
});

Then(/^les bulles de choix « ([^«»]+) » et « ([^«»]+) » restent à leur place$/, async ({ page }, premiere: string, seconde: string) => {
  const clic = await leDernierClic(page);
  for (const texte of [premiere, seconde]) {
    const avant = clic.boites[texte];
    expect(avant, `boîte de « ${texte} » avant le toucher`).toBeDefined();
    const bulle = bulleDeChoix(page, texte);
    await expect(bulle).toBeVisible();
    await expect(bulle).not.toHaveAttribute("data-eclatee", "true");
    const apres = await bulle.boundingBox();
    for (const cle of ["x", "y", "width", "height"] as const) {
      expect(Math.abs((apres?.[cle] ?? 0) - (avant?.[cle] ?? 0)), `« ${texte} » a bougé (${cle})`).toBeLessThanOrEqual(1);
    }
  }
});

Then(/^sa bulle de choix disparaît en fondu, sans grandir$/, async ({ page }) => {
  const clic = await leDernierClic(page);
  await verifierQueLaBulleSEffaceSurPlace(page, clic.texte);
  await verifierQueLaBulleJustePrendLaCouleurDeReussite(page, clic.rang, clic.texte);
  const passages = passagesDeLaBulle(await lireLeJournal(page), clic.rang);
  expect(passages.filter((p) => p.retour === "rebond"), "aucun rebond avec les mouvements réduits").toEqual([]);
});

When(/^Léa touche la bulle de choix « ([^«»]+) » pendant que Noisette la félicite$/, async ({ page }, texte: string) => {
  await expect(page.getByTestId("parole")).toHaveAttribute("data-nature", "felicitation");
  await bulleDeChoix(page, texte).click({ force: true });
});

// --- Le mot juste rejoint son trou ou sa ligne

const proche = (point: { x: number; y: number }, boite: Boite, marge: number) =>
  point.x >= boite.x - marge && point.x <= boite.x + boite.width + marge && point.y >= boite.y - marge && point.y <= boite.y + boite.height + marge;

const centre = (boite: Boite) => ({ x: boite.x + boite.width / 2, y: boite.y + boite.height / 2 });

async function attendreLeMotQuiVoyage(page: Page, mot: string): Promise<Voyage[]> {
  await expect.poll(async () => (await lireLeJournal(page)).voyages.some((voyage) => voyage.texte === mot), {
    message: `le mot « ${mot} » voyage (data-testid="mot-qui-voyage")`,
    timeout: 20_000,
  }).toBe(true);
  return (await lireLeJournal(page)).voyages.filter((voyage) => voyage.texte === mot);
}

Then(
  /^le mot « ([^«»]+) » rejoint (?:le trou de « ([^«»]+) »|la ligne « ([^«»]+) » du tableau), puis s'y illumine$/,
  async ({ page }, mot: string, phraseDuTrou: string | null | undefined, ligne: string | null | undefined) => {
    const clic = await leDernierClic(page);
    // playwright-bdd rend `null` pour un groupe absent de l'expression.
    if (phraseDuTrou != null) expect(clic.annonceDuTrou, "le trou visé").toBe(`Mot manquant dans « ${phraseDuTrou} »`);
    // Le tableau écrit « je … » ; le scénario dit « je … ? », la question posée.
    if (ligne != null) expect(normaliser(clic.ligneEnCours), "la ligne visée").toBe(normaliser(ligne.replace(/\s*\?$/, "")));
    const voyages = await attendreLeMotQuiVoyage(page, mot);
    const depart = voyages[0] as Voyage;
    expect(clic.boiteDuChoix, "boîte de la bulle touchée").not.toBeNull();
    expect(proche(centre(depart.boite), clic.boiteDuChoix as Boite, 60), "le mot part de la bulle de choix").toBe(true);
    const testidDeLaPlace = ligne != null ? "ligne-de-conjugaison" : "trou-rempli";
    await expect.poll(async () => (await lireLeJournal(page)).passages.some((p) => p.genre === "eclat" && p.eclat === "true" && p.testid === testidDeLaPlace && p.texte.includes(mot)), {
      message: `la place du mot « ${mot} » s'illumine (data-eclat sur ${testidDeLaPlace})`,
      timeout: 20_000,
    }).toBe(true);
    // L'éclat vient quand le mot est posé : le journal est relu alors, pas avant (au premier relevé, le mot était encore en chemin).
    const apresLEclat = await lireLeJournal(page);
    const eclat = apresLEclat.passages.find((p) => p.genre === "eclat" && p.eclat === "true" && p.testid === testidDeLaPlace && p.texte.includes(mot));
    if (eclat?.genre !== "eclat") throw new Error("éclat introuvable");
    const arrivee = apresLEclat.voyages.filter((voyage) => voyage.texte === mot).at(-1) as Voyage;
    expect(proche(centre(arrivee.boite), eclat.boite, 40), "le mot arrive à sa place").toBe(true);
    expect(Math.hypot(centre(arrivee.boite).x - centre(depart.boite).x, centre(arrivee.boite).y - centre(depart.boite).y), "le mot a voyagé").toBeGreaterThan(2);
    expect(eclat.t, "la place s'illumine après le départ du mot").toBeGreaterThan(depart.t);
    await expect(page.getByTestId("mot-qui-voyage"), "le mot en chemin disparaît à l'arrivée").toHaveCount(0);
    await expect(page.locator("[data-eclat='true']"), "l'éclat est bref").toHaveCount(0);
  },
);

Then(/^il ne brille pas comme une bonne réponse montrée$/, async ({ page }) => {
  const clic = await leDernierClic(page);
  const { passages } = await lireLeJournal(page);
  expect(passages.filter((passage) => passage.genre === "brille" && passage.t > clic.t), "rien n'a brillé depuis le toucher").toEqual([]);
  await expect(page.getByTestId("signal-brille")).toHaveCount(0);
  await expect(page.locator("[data-brille='true']")).toHaveCount(0);
});

Then(/^le mot « ([^«»]+) » apparaît dans le trou de « ([^«»]+) », sans voyager$/, async ({ page }, mot: string, phrase: string) => {
  const clic = await leDernierClic(page);
  expect(clic.annonceDuTrou, "le trou visé").toBe(`Mot manquant dans « ${phrase} »`);
  await expect(page.getByTestId("trou-rempli").filter({ hasText: mot })).toBeVisible();
  await verifierQueRienNeFlotte(page);
  expect((await lireLeJournal(page)).voyages, "aucun mot en chemin").toEqual([]);
});

Then(/^seul le mot « ([^«»]+) » voyage jusqu'au trou de « ([^«»]+) »$/, async ({ page }, mot: string, phrase: string) => {
  const clic = await leDernierClic(page);
  expect(clic.annonceDuTrou, "le trou visé").toBe(`Mot manquant dans « ${phrase} »`);
  const voyages = await attendreLeMotQuiVoyage(page, mot);
  const bulleTouchee = clic.boiteDuChoix as Boite;
  expect((voyages[0] as Voyage).boite.width, "seul le mot voyage, pas toute la bulle de choix").toBeLessThan(bulleTouchee.width);
  expect((await lireLeJournal(page)).voyages.filter((voyage) => voyage.texte !== mot), "rien d'autre ne voyage").toEqual([]);
});

Then(/^sa bulle de choix, vide, s'efface en douceur à sa place$/, async ({ page }) => {
  const clic = await leDernierClic(page);
  await expect.poll(async () => passagesDeLaBulle(await lireLeJournal(page), clic.rang).some((p) => p.vide === "true"), {
    message: "la bulle de choix est vide pendant que le mot voyage (data-vide)",
    timeout: 20_000,
  }).toBe(true);
  await verifierQueLaBulleSEffaceSurPlace(page, clic.texte);
});

// --- Choix écarté et bonne réponse montrée : un signal commun aux 6 univers, comparé à celui d'Animaux de la forêt

type SignatureDuSignal = Record<string, string>;

async function signatureDe(page: Page, selecteur: string): Promise<SignatureDuSignal> {
  const bulle = page.locator(selecteur);
  await expect(bulle, `bulle de choix ${selecteur}`).toHaveCount(1);
  return await bulle.evaluate(async (element) => {
    // Les transitions en cours (pâlir) sont finies avant de lire les styles.
    await Promise.all(element.getAnimations({ subtree: true }).filter((animation) => animation instanceof CSSTransition).map((animation) => animation.finished.catch(() => undefined)));
    const sansCouleur = (valeur: string) => valeur.replace(/rgba?\([^)]*\)/g, "couleur");
    const style = getComputedStyle(element);
    const dessin = element.querySelector('[data-testid="dessin-de-la-bulle"]');
    const signal = element.querySelector('[data-testid="signal-brille"]');
    const dessinStyle = dessin ? getComputedStyle(dessin) : null;
    const signalStyle = signal ? getComputedStyle(signal) : null;
    return {
      opacite: style.opacity,
      filtre: sansCouleur(style.filter),
      couleurDuTexte: style.color,
      dessinOpacite: dessinStyle?.opacity ?? "sans dessin",
      dessinFiltre: sansCouleur(dessinStyle?.filter ?? "sans dessin"),
      dessinAffiche: dessinStyle ? `${dessinStyle.display}/${dessinStyle.visibility}` : "sans dessin",
      signalBalise: signal?.tagName ?? "sans signal",
      signalAnimation: signalStyle ? `${signalStyle.animationName}/${signalStyle.animationDuration}/${signalStyle.animationIterationCount}/${signalStyle.animationTimingFunction}` : "sans signal",
      signalOmbre: sansCouleur(signalStyle?.boxShadow ?? "sans signal"),
      signalContour: signalStyle ? `${signalStyle.outlineWidth}/${signalStyle.outlineStyle}` : "sans signal",
      signalFiltre: sansCouleur(signalStyle?.filter ?? "sans signal"),
      signalOpacite: signalStyle?.opacity ?? "sans signal",
    };
  });
}

/** Ce que montre le dessin d'un choix écarté : le même contour gris, sans décor ni dégradé, quel que soit l'univers. */
async function signatureDuChoixEcarte(page: Page, selecteur: string): Promise<SignatureDuSignal> {
  const commune = await signatureDe(page, selecteur);
  const dessin = await page.locator(selecteur).evaluate((element) => {
    const calque = element.querySelector('[data-testid="dessin-de-la-bulle"]');
    const fond = calque?.querySelector("svg > path:first-of-type") ?? null;
    if (calque === null || fond === null) return { dessin: "sans dessin" } as Record<string, string>;
    const fondStyle = getComputedStyle(fond);
    const decors = [...calque.querySelectorAll(".decor-de-la-bulle")];
    return {
      dessin: "présent",
      fondRemplissage: fondStyle.fill,
      fondContour: fondStyle.stroke,
      fondEnDegrade: String(fondStyle.fill.startsWith("url(") || fondStyle.stroke.startsWith("url(")),
      degradesDefinis: String(calque.querySelectorAll("defs > *").length),
      // Sans décor : aucun élément de décor dans le dessin (un décor masqué par le style compterait comme un décor gardé).
      decorsPresents: String(decors.length),
      elementsDeDecor: String(decors.reduce((total, decor) => total + decor.querySelectorAll("*").length, 0)),
    };
  });
  return { ...commune, ...dessin };
}

/** Revient à l'univers « Animaux de la forêt » (même profil, même niveau), rejoue la même scène et rend la signature du signal. */
async function signatureDansLUniversDeReference(
  page: Page,
  famille: Parameters<typeof modifierLeProfil>[0],
  rejouer: () => Promise<void>,
  selecteur: string,
  titreDeLExercice: string | undefined,
  signature: (page: Page, selecteur: string) => Promise<SignatureDuSignal> = signatureDe,
): Promise<SignatureDuSignal> {
  const lecon = etatDeLaLecon(page).courante;
  if (lecon === undefined) throw new Error("Aucune leçon en cours");
  await modifierLeProfil(famille, "Léa", { univers: "animaux" });
  const liste = page.waitForResponse((reponse) => reponse.url().includes("/rest/v1/profils_enfants"));
  await page.goto("/");
  await liste;
  await choisirSonProfil(page, "Léa");
  await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", "animaux");
  etatDesChoix(page).demarrage = undefined;
  await lancer(page, lecon, titreDeLExercice);
  await rejouer();
  return await signature(page, selecteur);
}

Then(/^il est écarté de la même façon que dans l'univers « Animaux de la forêt »$/, async ({ page, famille }) => {
  const clic = await leDernierClic(page);
  const lecon = etatDeLaLecon(page).courante;
  if (lecon === undefined) throw new Error("Aucune leçon en cours");
  const position = Number(await page.getByTestId("exercice-en-cours").getAttribute("data-position"));
  const titre = lecon.exercices[position]?.titre;
  if (typeof titre !== "string") throw new Error("L'exercice en cours n'a pas de titre");
  const question = normaliser((await page.getByTestId("question").textContent()) ?? "");
  const ecarte = await page.locator("[data-testid='choix'][data-ecarte='true']").first().textContent();
  const texte = normaliser(ecarte ?? clic.texte);
  const selecteur = "[data-testid='choix'][data-ecarte='true']";
  const dans = await signatureDuChoixEcarte(page, selecteur);
  expect(dans.dessin, "le choix écarté a son dessin (data-testid=dessin-de-la-bulle)").toBe("présent");
  expect(dans.decorsPresents, "le choix écarté n'a plus le décor de son univers").toBe("0");
  expect(dans.elementsDeDecor, "le choix écarté n'a plus d'élément de décor").toBe("0");
  expect(dans.fondEnDegrade, "le choix écarté n'a ni dégradé ni couleur d'univers").toBe("false");
  const reference = await signatureDansLUniversDeReference(page, famille, async () => {
    await allerALaQuestion(page, question, true);
    await bulleDeChoix(page, texte).click();
    await expect(bulleDeChoix(page, texte)).toHaveAttribute("data-ecarte", "true");
  }, selecteur, titre, signatureDuChoixEcarte);
  expect(dans, "même signal d'état « écarté » que dans l'univers « Animaux de la forêt »").toEqual(reference);
});

Then(/^il brille de la même façon que dans l'univers « Animaux de la forêt »$/, async ({ page, famille }) => {
  const selecteur = "[data-testid='choix'][data-brille='true']";
  const dans = await signatureDe(page, selecteur);
  expect(dans.signalBalise, "la bulle de choix porte le signal commun « signal-brille »").not.toBe("sans signal");
  const reference = await signatureDansLUniversDeReference(page, famille, async () => {
    await avancerJusquAuxChoix(page);
    await page.getByTestId("je-ne-sais-pas").click();
    await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
    await expect(page.locator(selecteur)).toHaveCount(1);
  }, selecteur, undefined);
  expect(dans, "même signal « bonne réponse montrée » que dans l'univers « Animaux de la forêt »").toEqual(reference);
});

// --- Étapes de #12 et #17 qui ne tiennent pas avec le vrai profil de Léa (réservées à @issue-126, le sens est le même)

Given(/^Paul a réglé « mode dys » sur « oui » pour Léa$/, { tags: "@issue-126" }, async ({ famille, page }) => {
  await modifierLeProfil(famille, "Léa", { reglages: { modeDys: true } });
  // Léa joue déjà avec son vrai profil : elle se choisit de nouveau pour que le réglage s'applique.
  await rechoisirLeaApresUnReglage(page);
});

/**
 * Avec le vrai profil de Léa, d'autres tirages du navigateur (le test de départ à proposer) consomment les nombres forgés de #17 avant
 * le mélange des choix. Ici, seul le mélange des choix proposés (domaine `choix-proposes`) reçoit les nombres.
 */
Given(/^les choix sont affichés dans l'ordre (.+)$/, { tags: "@issue-126" }, async ({ page }, ordre: string) => {
  const voulu = listeDe(ordre);
  const lecon = etatDeLaLecon(page).injectees.at(-1);
  const depart = lecon === undefined ? undefined : questionsDeLaLecon(lecon)[0]?.choix;
  if (depart === undefined) throw new Error("Aucune question de test injectée");
  const nombres = nombresPourMelanger([...new Set(depart)], (melange) => voulu.every((texte, rang) => texte === melange[rang]));
  const forger = (forges: number[]) => {
    Reflect.set(window, "__tirageDesChoix126", [...forges]);
    if (Reflect.get(window, "__tirageDesChoix126Installe")) return;
    Reflect.set(window, "__tirageDesChoix126Installe", true);
    const precedent = Math.random.bind(Math);
    Math.random = () => {
      const file = Reflect.get(window, "__tirageDesChoix126") as number[];
      if (file.length > 0 && new Error().stack?.includes("/domain/choix-proposes")) return file.shift() as number;
      return precedent();
    };
  };
  // La page est peut-être déjà ouverte (le vrai profil de Léa est arrivé sur « /jeu ») : on forge maintenant et à chaque chargement.
  await page.addInitScript(forger, nombres);
  await page.evaluate(forger, nombres);
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  expect(await textesDesChoix(page)).toEqual(voulu);
});

// --- Clavier : les flèches passent d'une bulle de choix à l'autre

const focalisee = (page: Page) => page.evaluate(() => (document.activeElement?.textContent ?? "").replace(/\s+/g, " ").trim());

When(
  /^Léa répond « ([^«»]+) » au clavier, en passant d'une bulle de choix à l'autre avec les flèches$/,
  async ({ page }, reponse: string) => {
    await demarrer(page);
    await avancerJusquAuxChoix(page);
    etatDesChoix(page).reussiesAvant = await questionsReussies(page);
    const premier = (await textesDesChoix(page))[0];
    expect(await focalisee(page), "le focus est sur le premier choix possible").toBe(premier);
    expect(reponse, "le choix visé n'est pas le premier : il faut passer par les flèches").not.toBe(premier);
    for (let essai = 0; essai < 10 && (await focalisee(page)) !== reponse; essai++) await page.keyboard.press("ArrowRight");
    expect(await focalisee(page), "les flèches amènent le focus sur le choix voulu").toBe(reponse);
    await page.keyboard.press("Enter");
    await expect(bulleDeChoix(page, reponse)).toHaveAttribute("aria-disabled", "true");
  },
);

const focusVisites = new WeakMap<Page, string[]>();

When(
  /^Léa passe d'une bulle de choix à l'autre avec la flèche droite, depuis « ([^«»]+) », jusqu'au bout et une fois de plus$/,
  async ({ page }, depuis: string) => {
    await demarrer(page);
    await avancerJusquAuxChoix(page);
    await bulleDeChoix(page, depuis).focus();
    await expect(bulleDeChoix(page, depuis)).toBeFocused();
    const visites = [depuis];
    const nombre = await bulles(page).count();
    for (let pression = 0; pression < nombre; pression++) {
      await page.keyboard.press("ArrowRight");
      visites.push(await focalisee(page));
    }
    focusVisites.set(page, visites);
  },
);

Then(/^le focus passe, dans l'ordre, sur les bulles de choix (.+)$/, async ({ page }, liste: string) => {
  const visites = focusVisites.get(page) ?? [];
  const sansRepetition = visites.filter((texte, rang) => rang === 0 || texte !== visites[rang - 1]);
  expect(sansRepetition, `focus vu : ${visites.join(", ")}`).toEqual(listeDe(liste));
});

Then(/^le focus reste sur la bulle de choix « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect(bulleDeChoix(page, texte)).toBeFocused();
});
