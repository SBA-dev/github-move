import { createBdd } from "playwright-bdd";
import { expect, type Page } from "@playwright/test";
import { inscrireUnRecordDeFluence } from "../support/calcul-api.ts";
import { ecrireDesSeancesTermineesPourLaSerie, jourPrepare } from "../support/serie-api.ts";
import { ecrireDesResultatsDeLecons } from "../support/supabase-test.ts";
import {
  donnerLeSignalDeDepart,
  fluence,
  laisserPasserLeTemps,
  lireLaCarte,
  ouvrirLaFluence,
  partie20,
  repondreAuNombre,
  resultatDeLaCarte,
  reussirDesCalculsDeFluence,
  taperLesChiffres,
  valider,
} from "./calcul-fluence-addition.steps.ts";
import { BIBLIOTHEQUE, bulle, entendu, etat, injecter, jouerLaSeanceComplete, type LeconBrute } from "./etapes-puis-exercices.steps.ts";
import { attendreLaFinDeLaSeance, injecterLesLeconsDeTestDesSons, jouerJusquALaFinDeLaSeance, jouerUnExerciceSeul, partie } from "./etoiles-et-fin-de-seance.steps.ts";
import {
  avancerJusquAuxChoix,
  bulleDeChoix,
  demarrageDeLExercice,
  demarrer,
  etatDesChoix,
  leconAChoix,
  leconDeLExercice,
  positionDeLExercice,
  QUESTIONS_DE_TEST,
  textesDesChoix,
} from "./exercices-a-choix.steps.ts";
import { Before, BeforeStep, Given, test, Then, When } from "./fixtures.ts";
import { motsCachesDe, poesieJouee, remettreTousLesVersDansLOrdre } from "./memoriser-une-poesie.steps.ts";
import { LECONS_DU_TEST_DE_DEPART, servirLaBibliothequeDuTestDeDepart, suivreLesLecturesDuResultat } from "../support/bibliotheque-du-test-de-depart.ts";
import { estSurUnProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { profilDe } from "./profils-enfants.steps.ts";
import { laisserPasserLeDelaiDeLecture, normaliser, reappliquerLAppareil, scenario, terminerLaLecture } from "./voix.steps.ts";

// Story #97 : retours animés et sonores pendant la séance.
//
// Aucun code de test n'est dans l'application. Le navigateur du test reçoit, avant tout chargement, un faux des lecteurs
// audio (HTMLMediaElement.play / pause) qui journalise les effets sonores « /sons/<nom>.mp3 » dans l'ordre, avec la
// position du journal de la synthèse vocale (installerLeFaux, voix.steps.ts) : on en tire « effet avant parole, jamais en
// même temps ». La piste silencieuse du déverrouillage audio (data:) et l'amorçage (son coupé) ne sont pas des effets.
// Le même script note, dans l'ordre, ce que l'écran montre de passager (rebond, balancement, point qui vole, étincelles,
// étoiles, confettis, compteur, annonce) : ces retours durent moins d'une seconde, une étape qui arrive après les manquerait.
//
// Les verbes « entend » d'un Alors regardent ce qui s'est passé depuis le dernier toucher d'un bouton (la marque), c'est-à-dire
// depuis le geste de l'enfant du Quand.

type Configuration = { echec: boolean; retenir: string[] };

type Entree = {
  nom: string;
  debut: number;
  fin: number | null;
  arrete: boolean;
  paroleEnCours: boolean;
  autreEffetEnCours: boolean;
};

type Observation = {
  entrees: Entree[];
  vu: string[];
  annonces: string[];
  marque: number;
  marqueParoles: number;
  paroles: Array<{ index: number; texte: string }>;
};

const DELAI_DE_L_ATTENTE_MS = 20_000;
const EFFETS_DE_FIN = ["seance-terminee", "grande-victoire", "decouverte"];

// --- Le faux des effets sonores et l'enregistreur de l'écran, installés avant le chargement de la page

export function installerLesFauxDeLaStory97(config: Configuration) {
  const DUREE_DE_LA_GARDE_DE_L_APPLICATION_MS = 3000;
  const DUREE_DE_LA_GARDE_ALLONGEE_MS = 60_000;
  const DUREE_DU_FAUX_MS = 40;
  type EntreeDuFaux = {
    nom: string;
    debut: number;
    fin: number | null;
    arrete: boolean;
    paroleEnCours: boolean;
    autreEffetEnCours: boolean;
  };
  type EtatDuFaux = {
    entrees: EntreeDuFaux[];
    actives: Map<HTMLMediaElement, EntreeDuFaux>;
    echec: boolean;
    retenir: string[];
    marque: number;
    marqueParoles: number;
    vu: string[];
    annonces: string[];
  };
  type FauxDeLaVoix = { journal: unknown[]; actifs: unknown[] };

  const faux = () => Reflect.get(window, "__faux") as FauxDeLaVoix | undefined;
  const longueurDuJournal = () => faux()?.journal.length ?? 0;
  const etat = () => Reflect.get(window, "__effets") as EtatDuFaux;

  Reflect.set(window, "__effets", {
    entrees: [],
    actives: new Map(),
    echec: config.echec,
    retenir: config.retenir,
    marque: 0,
    marqueParoles: 0,
    vu: [],
    annonces: [],
  } satisfies EtatDuFaux);

  // Les fonctions de page se réinstallent à chaque ajout de script d'initialisation : la dernière configuration gagne.
  const nomDeLEffet = (media: HTMLMediaElement) => /\/sons\/([a-z-]+)\.mp3/.exec(media.getAttribute("src") ?? media.src)?.[1] ?? null;

  const terminer = (media: HTMLMediaElement, entree: EntreeDuFaux) => {
    const courant = etat();
    if (courant.actives.get(media) !== entree) return;
    courant.actives.delete(media);
    entree.fin = longueurDuJournal();
    media.dispatchEvent(new Event("ended"));
  };

  HTMLMediaElement.prototype.play = function () {
    const courant = etat();
    const nom = nomDeLEffet(this);
    if (nom === null || this.muted) return Promise.resolve();
    if (courant.echec) return Promise.reject(new DOMException("Fichier introuvable", "NotSupportedError"));
    const entree: EntreeDuFaux = {
      nom,
      debut: longueurDuJournal(),
      fin: null,
      arrete: false,
      paroleEnCours: (faux()?.actifs.length ?? 0) > 0,
      autreEffetEnCours: courant.actives.size > 0,
    };
    courant.entrees.push(entree);
    courant.actives.set(this, entree);
    if (!courant.retenir.includes(nom)) setTimeout(() => terminer(this, entree), DUREE_DU_FAUX_MS);
    return Promise.resolve();
  };

  HTMLMediaElement.prototype.pause = function () {
    const courant = etat();
    const entree = courant.actives.get(this);
    if (!entree) return;
    courant.actives.delete(this);
    entree.arrete = true;
    entree.fin = longueurDuJournal();
  };

  Reflect.set(window, "__terminerLesEffets", () => {
    for (const [media, entree] of [...etat().actives]) terminer(media, entree);
  });

  // Un effet retenu par le test (pour le toucher pendant qu'il joue) ne doit pas être libéré par la garde de 3 s de l'application.
  if (!Reflect.get(window, "__gardePatchee")) {
    Reflect.set(window, "__gardePatchee", true);
    const original = window.setTimeout.bind(window);
    window.setTimeout = ((gestionnaire: TimerHandler, delai?: number, ...reste: unknown[]) =>
      original(
        gestionnaire,
        delai === DUREE_DE_LA_GARDE_DE_L_APPLICATION_MS && etat().retenir.length > 0 ? DUREE_DE_LA_GARDE_ALLONGEE_MS : delai,
        ...reste,
      )) as typeof window.setTimeout;
  }

  // La marque : le dernier toucher d'un bouton, début du geste de l'enfant.
  if (!Reflect.get(window, "__marqueur")) {
    Reflect.set(window, "__marqueur", true);
    document.addEventListener("click", (evenement) => {
      const cible = evenement.target;
      if (!(cible instanceof Element) || cible.closest("button") === null) return;
      const courant = etat();
      courant.marque = courant.entrees.length;
      courant.marqueParoles = longueurDuJournal();
    }, true);
  }

  // L'enregistreur de l'écran.
  if (!Reflect.get(window, "__enregistreur")) {
    Reflect.set(window, "__enregistreur", true);
    const noter = (cle: string) => {
      const vu = etat().vu;
      if (vu[vu.length - 1] !== cle) vu.push(cle);
    };
    const texteDe = (element: Element) => (element.textContent ?? "").replace(/\s+/g, " ").trim();
    const dernieresAnnonces = new WeakMap<Element, string>();
    const examinerLAnnonce = (element: Element) => {
      const texte = texteDe(element);
      if (texte === "" || dernieresAnnonces.get(element) === texte) return;
      dernieresAnnonces.set(element, texte);
      etat().annonces.push(texte);
    };
    const examiner = (element: Element) => {
      const retour = element.getAttribute("data-retour");
      if (retour) noter(`retour:${retour}:${texteDe(element)}`);
      if (element.getAttribute("data-reussite") === "true") noter(`reussite:${texteDe(element)}`);
      if (element.getAttribute("data-point-qui-vole") === "true") noter("point-qui-vole");
      const identifiant = element.getAttribute("data-testid");
      if (identifiant === "etincelles-du-texte") {
        noter(`etincelles:${element.getAttribute("data-etincelles")}`);
        requestAnimationFrame(() => {
          const etincelle = element.querySelector("span");
          if (!etincelle) return;
          const boite = etincelle.getBoundingClientRect();
          const style = getComputedStyle(etincelle);
          if (boite.width > 0 && boite.height > 0 && style.visibility !== "hidden" && style.display !== "none") noter("etincelles:visibles");
        });
      }
      if (identifiant === "confettis") noter(`confettis:${element.getAttribute("data-etat")}`);
      if (identifiant === "etoiles-dessinees") noter(`etoiles:${element.getAttribute("data-etat")}`);
      if (identifiant === "etoile" && element.getAttribute("data-apparue") === "true") {
        const rang = [...(element.parentElement?.querySelectorAll('[data-testid="etoile"]') ?? [])].indexOf(element) + 1;
        noter(`etoile-apparue:${rang}`);
      }
      if (identifiant === "compteur-du-record") noter(`compteur:${element.getAttribute("data-etat")}:${element.getAttribute("data-record")}`);
      if (identifiant === "annonce-des-etoiles") examinerLAnnonce(element);
    };
    const SELECTEUR = "[data-testid],[data-retour],[data-reussite],[data-point-qui-vole]";
    new MutationObserver((enregistrements) => {
      for (const enregistrement of enregistrements) {
        if (enregistrement.type === "attributes" && enregistrement.target instanceof Element) examiner(enregistrement.target);
        for (const ajoute of enregistrement.addedNodes) {
          if (!(ajoute instanceof Element)) continue;
          examiner(ajoute);
          ajoute.querySelectorAll(SELECTEUR).forEach(examiner);
        }
        const cible = enregistrement.target instanceof Element ? enregistrement.target : enregistrement.target.parentElement;
        const annonce = cible?.closest('[data-testid="annonce-des-etoiles"]');
        if (annonce) examinerLAnnonce(annonce);
      }
    }).observe(document, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-retour", "data-reussite", "data-point-qui-vole", "data-etat", "data-apparue", "data-record"],
    });
  }
}

// --- L'état du scénario : la configuration des faux, réappliquée après chaque changement

const configurations = new WeakMap<Page, Configuration>();

function configuration(page: Page): Configuration {
  let courante = configurations.get(page);
  if (!courante) {
    courante = { echec: false, retenir: [] };
    configurations.set(page, courante);
  }
  return courante;
}

async function configurer(page: Page, changement: Partial<Configuration>): Promise<void> {
  const courante = Object.assign(configuration(page), changement);
  await page.addInitScript(installerLesFauxDeLaStory97, { ...courante, retenir: [...courante.retenir] });
  // La page déjà chargée garde son faux : seuls les réglages changent, ni le journal ni la marque.
  await page.evaluate((nouvelle) => {
    const etat = Reflect.get(window, "__effets") as { echec: boolean; retenir: string[] } | undefined;
    if (etat) Object.assign(etat, nouvelle);
  }, { ...courante, retenir: [...courante.retenir] }).catch(() => undefined);
}

Before({ tags: "@issue-97 or @issue-102" }, async ({ page, $testInfo }) => {
  // Le vrai profil de Léa, les séances jouées jusqu'à leur fin et les écrans de fin passent par le serveur.
  $testInfo.setTimeout(120_000);
  await page.addInitScript(installerLesFauxDeLaStory97, { ...configuration(page) });
});

// Un bouton touché pendant que le personnage guide parle ne joue rien : dans le vrai navigateur la parole finit d'elle-même,
// la fausse synthèse ne finit que sur demande. Avant ces gestes, Léa a donc attendu la fin de la parole.
const GESTES_APRES_LA_PAROLE = ["Léa rejoue", "Léa ouvre « Mes médailles » depuis son accueil"];

BeforeStep({ tags: "@issue-97 or @issue-102" }, async ({ page, $step }) => {
  if (GESTES_APRES_LA_PAROLE.includes($step.title.replace(/^(Étant donné que|Quand|Alors|Et que|Et|Mais) /, ""))) await laisserLaParoleFinir(page);
});

/** Finit les paroles une à une (la phrase de fin en a plusieurs), jusqu'à ce que plus rien ne se dise pendant un moment. */
async function laisserLaParoleFinir(page: Page): Promise<void> {
  let precedent = -1;
  await expect.poll(async () => {
    await terminerLaLecture(page);
    await laisserPasserLeDelaiDeLecture(page);
    const { paroles } = await observer(page);
    const stable = paroles.length === precedent;
    precedent = paroles.length;
    return stable;
  }, { intervals: [100], timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
}

// --- Lire ce que le navigateur a noté

const OBSERVATION_VIDE: Observation = { entrees: [], vu: [], annonces: [], marque: 0, marqueParoles: 0, paroles: [] };

async function observer(page: Page): Promise<Observation> {
  return await page.evaluate(() => {
    const etat = Reflect.get(window, "__effets") as
      | { entrees: unknown[]; vu: string[]; annonces: string[]; marque: number; marqueParoles: number }
      | undefined;
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; texte: string }> } | undefined;
    if (!etat) return null;
    const paroles = (faux?.journal ?? []).flatMap((entree, index) => entree.type === "speak" ? [{ index, texte: entree.texte }] : []);
    return {
      entrees: JSON.parse(JSON.stringify(etat.entrees)),
      vu: [...etat.vu],
      annonces: [...etat.annonces],
      marque: etat.marque,
      marqueParoles: etat.marqueParoles,
      paroles,
    };
  }) as Observation ?? OBSERVATION_VIDE;
}

function fichierDe(nom: string): string {
  return nom.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "-");
}

function depuisLaMarque(observation: Observation): Entree[] {
  return observation.entrees.slice(observation.marque);
}

function noms(entrees: readonly Entree[]): string[] {
  return entrees.map((entree) => entree.nom);
}

function sansPonctuation(texte: string): string {
  return normaliser(texte).replace(/[\s,.!?…:;'’«»-]+/g, "").toLowerCase();
}

/** Laisse la scène se dérouler : plus aucun effet en cours, et rien de nouveau pendant deux lectures espacées. */
async function laisserSeDerouler(page: Page): Promise<void> {
  let precedent = -1;
  await expect.poll(async () => {
    const { entrees } = await observer(page);
    const enCours = entrees.filter((entree) => entree.fin === null).length;
    const stable = entrees.length === precedent && enCours === 0;
    precedent = entrees.length;
    return stable;
  }, { intervals: [300], timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
}

/** Attend une condition sur le journal en finissant les paroles qui précèdent : on ne coupe jamais celle qu'on attend (elle n'est vérifiée qu'une fois commencée). */
async function attendre(page: Page, condition: (observation: Observation) => boolean): Promise<Observation> {
  let derniere = OBSERVATION_VIDE;
  try {
    await expect.poll(async () => {
      derniere = await observer(page);
      if (condition(derniere)) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100], timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
  } catch (erreur) {
    const effets = derniere.entrees.map((e) => `${e.nom}[${e.debut}-${e.fin}${e.arrete ? " arrêté" : ""}]`).join(", ");
    const paroles = derniere.paroles.map((p) => `${p.index}:${p.texte}`).join(" | ");
    throw new Error(`${(erreur as Error).message}\neffets : ${effets}\nparoles : ${paroles}\nmarque : ${derniere.marque}`);
  }
  return derniere;
}

async function terminerLesEffets(page: Page): Promise<void> {
  await page.evaluate(() => (Reflect.get(window, "__terminerLesEffets") as (() => void) | undefined)?.());
}

function bulleDuPersonnage(page: Page) {
  return bulle(page);
}

// --- Étant donné : l'appareil

Given(/^l'appareil ne peut pas jouer les effets sonores$/, async ({ page }) => {
  await configurer(page, { echec: true });
});

// --- Les paroles qui suivent un effet

type NatureAttendue = "felicitation" | "encouragement" | undefined;

/** La première parole dite une fois l'effet fini. */
function paroleApres(observation: Observation, effet: Entree) {
  return observation.paroles.find((parole) => effet.fin !== null && parole.index >= effet.fin);
}

function dernierEffet(observation: Observation, nom: string): Entree | undefined {
  return depuisLaMarque(observation).filter((entree) => entree.nom === fichierDe(nom)).at(-1);
}

/** Aucune parole ne commence pendant l'effet et aucun autre effet ne joue en même temps. */
function sansChevauchement(observation: Observation, effet: Entree): boolean {
  if (effet.autreEffetEnCours) return false;
  return !observation.paroles.some((parole) => parole.index >= effet.debut && (effet.fin === null || parole.index < effet.fin));
}

/** En plus : la parole d'avant est finie quand l'effet commence (sinon l'effet joue par-dessus la fin de sa lecture). */
function sansParoleEnCours(effet: Entree): boolean {
  return !effet.paroleEnCours;
}

async function verifierLaNature(page: Page, nature: NatureAttendue) {
  if (nature) await expect(bulleDuPersonnage(page)).toHaveAttribute("data-nature", nature);
}

async function verifierQueLaParoleEstCelleDeLaBulle(page: Page, parole: string) {
  const dite = sansPonctuation(parole);
  const affichee = sansPonctuation(entendu((await bulleDuPersonnage(page).textContent()) ?? ""));
  expect(affichee, `la parole dite « ${parole} » est celle de la bulle`).toContain(dite);
}

export async function effetPuisParole(page: Page, effets: readonly string[], nature: NatureAttendue, strict: boolean): Promise<Entree> {
  const fichiers = effets.map(fichierDe);
  let trouve: { effet: Entree; parole: string } | undefined;
  await attendre(page, (observation) => {
    const entrees = depuisLaMarque(observation);
    const debut = entrees.findIndex((_, rang) => fichiers.every((fichier, i) => entrees[rang + i]?.nom === fichier));
    if (debut < 0) return false;
    const dernier = entrees[debut + fichiers.length - 1] as Entree;
    const parole = paroleApres(observation, dernier);
    if (!parole) return false;
    if (strict && entrees.slice(debut + fichiers.length).some((entree) => entree.debut <= parole.index)) return false;
    trouve = { effet: dernier, parole: parole.texte };
    return true;
  });
  const observation = await observer(page);
  const effet = trouve?.effet as Entree;
  for (const entree of depuisLaMarque(observation).filter((candidat) => fichiers.includes(candidat.nom))) {
    expect(sansChevauchement(observation, entree) && sansParoleEnCours(entree), `l'effet « ${entree.nom} » joue seul, avant toute parole`).toBe(true);
  }
  await verifierLaNature(page, nature);
  await verifierQueLaParoleEstCelleDeLaBulle(page, trouve?.parole ?? "");
  return effet;
}

// --- Alors : un effet sonore

Then(/^Léa entend l'effet sonore « ([^«»]+) »$/, async ({ page }, effet: string) => {
  await expect.poll(async () => noms(depuisLaMarque(await observer(page))), { timeout: DELAI_DE_L_ATTENTE_MS }).toContain(fichierDe(effet));
});

Then(/^Léa entend l'effet sonore « ([^«»]+) » avant que Noisette dise une félicitation$/, async ({ page }, effet: string) => {
  await effetPuisParole(page, [effet], "felicitation", false);
});

Then(/^Léa entend l'effet sonore « ([^«»]+) » avant que Noisette parle$/, async ({ page }, effet: string) => {
  await effetPuisParole(page, [effet], undefined, false);
});

Then(/^Léa entend l'effet sonore « ([^«»]+) », puis Noisette dit un encouragement$/, async ({ page }, effet: string) => {
  await effetPuisParole(page, [effet], "encouragement", true);
});

Then(
  /^Léa entend l'effet sonore « ([^«»]+) », puis Noisette dit un encouragement, suivi de « ([^«»]+) »$/,
  async ({ page }, effet: string, complement: string) => {
    await effetPuisParole(page, [effet], "encouragement", true);
    const texte = normaliser((await bulleDuPersonnage(page).textContent()) ?? "");
    expect(texte.endsWith(` ${complement}`), texte).toBe(true);
  },
);

Then(/^Léa entend l'effet sonore « ([^«»]+) », puis Noisette dit sa phrase de fin$/, async ({ page }, effet: string) => {
  await effetPuisParole(page, [effet], "felicitation", true);
});

Then(
  /^Léa entend les effets sonores « ([^«»]+) » puis « ([^«»]+) », puis Noisette dit (une félicitation|sa phrase de fin)$/,
  async ({ page }, premier: string, second: string, _parole: string) => {
    await effetPuisParole(page, [premier, second], "felicitation", true);
  },
);

Then(
  /^Léa entend l'effet sonore « texte complet » avant que Noisette dise une félicitation, suivie de « ([^«»]+) »$/,
  async ({ page }, explication: string) => {
    await effetPuisParole(page, ["texte complet"], "felicitation", false);
    const texte = normaliser((await bulleDuPersonnage(page).textContent()) ?? "");
    expect(texte.endsWith(` ${explication}`), texte).toBe(true);
  },
);

Then(
  /^Léa entend l'effet sonore « grande victoire » avant que Noisette annonce son (premier|nouveau) record, (\d+)$/,
  async ({ page }, genre: string, record: string) => {
    const calculs = `${record} calcul${Number(record) > 1 ? "s" : ""}`;
    const phrase = sansPonctuation(genre === "premier" ? `Ton premier record : ${calculs}` : `Nouveau record ! ${calculs}`);
    const dit = (observation: Observation, depuis: number, jusqua: number) =>
      sansPonctuation(observation.paroles.filter((parole) => parole.index >= depuis && parole.index < jusqua).map((parole) => parole.texte).join(" "));
    await attendre(page, (observation) => {
      const effet = dernierEffet(observation, "grande victoire");
      if (!effet || effet.fin === null) return false;
      return dit(observation, effet.fin, Infinity).includes(phrase);
    });
    const observation = await observer(page);
    const effet = dernierEffet(observation, "grande victoire") as Entree;
    expect(sansChevauchement(observation, effet)).toBe(true);
    expect(dit(observation, 0, effet.debut), "le record n'est pas annoncé avant l'effet").not.toContain(phrase);
  },
);

Then(/^Léa entend une seule fois l'effet sonore « ([^«»]+) »$/, async ({ page }, effet: string) => {
  await attendreLaFinDeLaSeance(page);
  await laisserSeDerouler(page);
  expect(noms((await observer(page)).entrees).filter((nom) => nom === fichierDe(effet))).toHaveLength(1);
});

async function verifierQueLEffetNEstPasJoue(page: Page, effets: readonly string[]) {
  await laisserSeDerouler(page);
  const jouees = noms(depuisLaMarque(await observer(page)));
  for (const effet of effets) expect(jouees, `l'effet « ${effet} » ne se fait pas entendre`).not.toContain(fichierDe(effet));
}

Then(/^Léa n'entend pas l'effet sonore « ([^«»]+) »$/, async ({ page }, effet: string) => {
  await verifierQueLEffetNEstPasJoue(page, [effet]);
});

Then(/^Léa n'entend ni l'effet sonore « ([^«»]+) » ni l'effet sonore « ([^«»]+) »$/, async ({ page }, premier: string, second: string) => {
  await verifierQueLEffetNEstPasJoue(page, [premier, second]);
});

Then(/^Léa n'entend aucun effet sonore$/, async ({ page }) => {
  await laisserSeDerouler(page);
  expect(noms(depuisLaMarque(await observer(page)))).toEqual([]);
});

Then(/^Paul n'entend aucun effet sonore$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect(noms(depuisLaMarque(await observer(page)))).toEqual([]);
});

Then(/^Léa n'entend aucune parole$/, async ({ page }) => {
  await laisserSeDerouler(page);
  await laisserPasserLeDelaiDeLecture(page);
  const observation = await observer(page);
  expect(observation.paroles.filter((parole) => parole.index >= observation.marqueParoles)).toEqual([]);
});

Then(/^Léa n'entend jamais un effet sonore et Noisette en même temps$/, async ({ page }) => {
  const observation = await attendre(page, (vue) => vue.entrees.length > 0 && vue.entrees.every((e) => e.fin !== null) && vue.paroles.some((p) => p.index >= (vue.entrees.at(-1)?.fin ?? Infinity)));
  for (const effet of observation.entrees) {
    expect(sansChevauchement(observation, effet) && sansParoleEnCours(effet), `l'effet « ${effet.nom} » joue sans parole en même temps`).toBe(true);
  }
});

Then(/^Léa n'entend jamais deux effets sonores en même temps$/, async ({ page }) => {
  await laisserSeDerouler(page);
  const { entrees } = await observer(page);
  expect(entrees.length).toBeGreaterThanOrEqual(2);
  for (const effet of entrees) expect(effet.autreEffetEnCours, `l'effet « ${effet.nom} » commence quand un autre joue encore`).toBe(false);
});

// --- Les effets de la fin, retenus le temps de les toucher

async function retenirLesEffetsDeLaFin(page: Page): Promise<void> {
  await configurer(page, { retenir: EFFETS_DE_FIN });
}

function dernierEffetDeFin(observation: Observation): Entree | undefined {
  return observation.entrees.filter((entree) => EFFETS_DE_FIN.includes(entree.nom)).at(0);
}


async function libererLesEffets(page: Page): Promise<void> {
  let precedent = -1;
  await expect.poll(async () => {
    await terminerLesEffets(page);
    const { entrees } = await observer(page);
    const stable = entrees.length === precedent && entrees.every((entree) => entree.fin !== null);
    precedent = entrees.length;
    return stable;
  }, { intervals: [300], timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
}

/** Les séances d'avant, les étoiles d'avant et les erreurs de la séance qui finit à 1 étoile sans nouveauté (acceptance, « Précisions pour les étapes »). */
async function preparerUneSeanceQuiFinitAUneEtoile(famille: Parameters<typeof profilDe>[0]): Promise<void> {
  const profil = profilDe(famille, "Léa");
  await ecrireDesSeancesTermineesPourLaSerie(profil.id, Array.from({ length: 20 }, (_, rang) => jourPrepare(-(rang + 1))));
  await ecrireDesResultatsDeLecons(profil.id, [
    { lecon: "e2e-97-etoiles-1", meilleuresEtoiles: 3 },
    { lecon: "e2e-97-etoiles-2", meilleuresEtoiles: 3 },
  ]);
  partie(famille).erreursEnTout = 5;
}

Given(
  /^Léa entend l'effet sonore « séance terminée » à la fin de la séance de la leçon « ([^«»]+) »$/,
  async ({ famille, page }, titre: string) => {
    await retenirLesEffetsDeLaFin(page);
    await preparerUneSeanceQuiFinitAUneEtoile(famille);
    await jouerLaSeanceComplete(page, titre);
    await jouerJusquALaFinDeLaSeance(famille, page);
    await attendre(page, (observation) => observation.entrees.some((entree) => entree.nom === "seance-terminee" && entree.fin === null && !entree.arrete));
  },
);

Given(
  /^Léa voit tomber les confettis de la fin de la séance de la leçon « ([^«»]+) »$/,
  async ({ famille, page }, titre: string) => {
    await retenirLesEffetsDeLaFin(page);
    await jouerLaSeanceComplete(page, titre);
    await jouerJusquALaFinDeLaSeance(famille, page);
    await expect(page.getByTestId("confettis")).toHaveAttribute("data-etat", "tombent");
    await attendre(page, (observation) => dernierEffetDeFin(observation) !== undefined);
  },
);

When(/^Léa touche l'écran en dehors des boutons$/, async ({ page }) => {
  const point = await page.evaluate(() => {
    const zone = document.querySelector("main") ?? document.body;
    for (let y = 8; y < window.innerHeight; y += 16) {
      for (let x = 8; x < window.innerWidth; x += 16) {
        const element = document.elementFromPoint(x, y);
        if (element && zone.contains(element) && element.closest("button, a, input, select, textarea") === null) return { x, y };
      }
    }
    return null;
  });
  expect(point, "un point de l'écran hors des boutons").not.toBeNull();
  await page.mouse.click(point?.x ?? 0, point?.y ?? 0);
});

When(/^Léa choisit « Accueil »$/, async ({ page }) => {
  await page.getByTestId("fin-de-seance").getByRole("button", { name: "Accueil", exact: true }).click();
});

When(/^Léa choisit « Accueil » au clavier$/, async ({ page }) => {
  const accueil = page.getByTestId("fin-de-seance").getByRole("button", { name: "Accueil", exact: true });
  await expect(accueil).toBeFocused();
  await page.keyboard.press("Enter");
});

Then(/^les confettis tombent toujours$/, async ({ page }) => {
  await expect(page.getByTestId("confettis")).toHaveCount(1);
});

Then(/^Léa entend l'effet sonore « ([^«»]+) » jusqu'au bout$/, async ({ page }, effet: string) => {
  await attendre(page, (observation) => observation.entrees.some((entree) => entree.nom === fichierDe(effet)));
  await libererLesEffets(page);
  const jouees = (await observer(page)).entrees.filter((entree) => entree.nom === fichierDe(effet));
  expect(jouees.length).toBeGreaterThan(0);
  for (const entree of jouees) expect(entree.arrete, `l'effet « ${effet} » n'est pas coupé`).toBe(false);
});

Then(/^Léa entend l'effet sonore de fin jusqu'au bout$/, async ({ page }) => {
  await libererLesEffets(page);
  const jouees = (await observer(page)).entrees.filter((entree) => EFFETS_DE_FIN.includes(entree.nom));
  expect(jouees.length).toBeGreaterThan(0);
  for (const entree of jouees) expect(entree.arrete, `l'effet « ${entree.nom} » n'est pas coupé`).toBe(false);
});

async function verifierQueLEffetEstCoupe(page: Page, nomsDesEffets: readonly string[]): Promise<void> {
  await expect.poll(async () => {
    const jouees = (await observer(page)).entrees.filter((entree) => nomsDesEffets.includes(entree.nom));
    return jouees.length > 0 && jouees.every((entree) => entree.fin !== null) && jouees.some((entree) => entree.arrete);
  }, { timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
}

Then(/^Léa n'entend plus l'effet sonore « ([^«»]+) »$/, async ({ page }, effet: string) => {
  await verifierQueLEffetEstCoupe(page, [fichierDe(effet)]);
});

Then(/^Léa n'entend plus l'effet sonore de fin$/, async ({ page }) => {
  await verifierQueLEffetEstCoupe(page, EFFETS_DE_FIN);
});

// --- La fluence : mêmes gestes que #20, qui réserve ses étapes à ses propres scénarios

Given(
  /^Léa fait la fluence « ([^«»]+) », avec (\d+) calculs? réussis?$/,
  async ({ page }, titre: string, reussis: string) => {
    await ouvrirLaFluence(page, titre);
    await donnerLeSignalDeDepart(page);
    await reussirDesCalculsDeFluence(page, Number(reussis));
  },
);

When(/^Léa donne une bonne réponse$/, async ({ page }) => {
  const carte = await lireLaCarte(page);
  await taperLesChiffres(page, String(resultatDeLaCarte(partie20(page).lecon, carte)), true);
  await valider(page, true);
});

When(/^Léa donne une réponse fausse$/, async ({ page }) => {
  const carte = await lireLaCarte(page);
  await repondreAuNombre(page, resultatDeLaCarte(partie20(page).lecon, carte) + 1);
});

When(/^Léa donne deux bonnes réponses aussitôt l'une après l'autre$/, async ({ page }) => {
  await configurer(page, { retenir: ["reponse-juste"] });
  await reussirDesCalculsDeFluence(page, 2);
  await libererLesEffets(page);
  await configurer(page, { retenir: [] });
});

Given(
  /^Léa (?:n'a pas encore de record|a un record de (\d+)) à la fluence « ([^«»]+) »$/,
  async ({ famille, page }, record: string | null | undefined, titre: string) => {
    partie20(page).fluence = titre;
    if (record == null) return;
    const lecon = leconDeLExercice(page, titre);
    await inscrireUnRecordDeFluence(profilDe(famille, "Léa").id, lecon.id, titre, Number(record));
  },
);

Given(/^Léa fait cette fluence$/, async ({ page }) => {
  await ouvrirLaFluence(page, partie20(page).fluence ?? "");
  await donnerLeSignalDeDepart(page);
});

When(/^le temps de la fluence est écoulé avec (\d+) calculs? réussis?$/, async ({ page }, reussis: string) => {
  await demarrer(page);
  if ((await fluence(page).getAttribute("data-etat")) === "accueil") await donnerLeSignalDeDepart(page);
  await reussirDesCalculsDeFluence(page, Number(reussis));
  await laisserPasserLeTemps(page);
});

Then(/^le compteur défile jusqu'au nouveau record, (\d+)$/, async ({ page }, record: string) => {
  const compteur = page.getByTestId("compteur-du-record");
  await attendre(page, (observation) => observation.vu.includes(`compteur:defile:${record}`));
  await expect(compteur).toHaveAttribute("data-record", String(record));
  await expect(compteur).toHaveAttribute("data-etat", "arrive");
  const { vu } = await observer(page);
  expect(vu.indexOf(`compteur:defile:${record}`)).toBeLessThan(vu.indexOf(`compteur:arrive:${record}`));
});

Then(/^aucun compteur ne défile jusqu'à un record$/, async ({ page }) => {
  await attendreLaFinDeLaSeance(page);
  await laisserSeDerouler(page);
  await laisserPasserLeDelaiDeLecture(page);
  await expect(page.getByTestId("compteur-du-record")).toHaveCount(0);
  expect((await observer(page)).vu.filter((vu) => vu.startsWith("compteur:"))).toEqual([]);
});

// --- Les retours de réponse

async function nePasVoir(page: Page, motif: RegExp): Promise<void> {
  await laisserSeDerouler(page);
  await laisserPasserLeDelaiDeLecture(page);
  const { vu } = await observer(page);
  expect(vu.filter((observe) => motif.test(observe))).toEqual([]);
}

Then(/^le choix « ([^«»]+) » rebondit$/, async ({ page }, choix: string) => {
  await expect.poll(async () => (await observer(page)).vu, { timeout: DELAI_DE_L_ATTENTE_MS }).toContain(`retour:rebond:${choix}`);
  expect((await observer(page)).vu).toContain(`reussite:${choix}`);
});

Then(/^le choix « ([^«»]+) » se balance doucement$/, async ({ page }, choix: string) => {
  await expect.poll(async () => (await observer(page)).vu, { timeout: DELAI_DE_L_ATTENTE_MS }).toContain(`retour:balancement:${choix}`);
});

Then(/^le choix « ([^«»]+) » prend la couleur de réussite sans rebondir$/, async ({ page }, choix: string) => {
  await expect.poll(async () => (await observer(page)).vu, { timeout: DELAI_DE_L_ATTENTE_MS }).toContain(`reussite:${choix}`);
  await nePasVoir(page, /^retour:rebond:/);
});

Then(/^le choix « ([^«»]+) » ne se balance pas$/, async ({ page }, _choix: string) => {
  await nePasVoir(page, /^retour:balancement:/);
});

Then(/^aucune croix ni aucun rouge plein écran n'apparaît$/, async ({ page }) => {
  await laisserSeDerouler(page);
  const intrus = await page.evaluate(() => {
    const croix = ["×", "✕", "✗", "✖", "❌", "X", "x"];
    const trouves: string[] = [];
    for (const element of document.querySelectorAll("body *")) {
      const texte = (element.textContent ?? "").trim();
      if (element.children.length === 0 && croix.includes(texte)) trouves.push(`croix « ${texte} » dans ${element.tagName}`);
      const boite = element.getBoundingClientRect();
      const couvre = boite.width >= window.innerWidth * 0.9 && boite.height >= window.innerHeight * 0.9;
      const [rouge = 0, vert = 0, bleu = 0, alpha = 1] = (getComputedStyle(element).backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
      if (couvre && alpha > 0.3 && rouge > 180 && vert < 100 && bleu < 100) trouves.push(`fond rouge sur ${element.tagName}`);
    }
    return trouves;
  });
  expect(intrus).toEqual([]);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

Then(/^un point vole jusqu'au récipient$/, async ({ page }) => {
  await expect.poll(async () => (await observer(page)).vu, { timeout: DELAI_DE_L_ATTENTE_MS }).toContain("point-qui-vole");
});

Then(/^aucun point ne vole jusqu'au récipient$/, async ({ page }) => {
  await nePasVoir(page, /^point-qui-vole$/);
});

async function voirDesEtincelles(page: Page): Promise<void> {
  const etincelle = page.getByTestId("etincelles-du-texte").locator("span").first();
  await expect.poll(async () => {
    if (await etincelle.isVisible()) return true;
    return (await observer(page)).vu.includes("etincelles:visibles");
  }, { timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
  expect((await observer(page)).vu).toContain("etincelles:texte-complet");
}

Then(/^des étincelles apparaissent(?: autour (?:du texte|des étiquettes))?$/, async ({ page }) => {
  await voirDesEtincelles(page);
});

Then(/^aucune étincelle n'apparaît$/, async ({ page }) => {
  await nePasVoir(page, /^etincelles:/);
  await expect(page.getByTestId("etincelles-du-texte")).toHaveCount(0);
});

Given(/^il ne reste que le mot caché « ([^«»]+) » à retrouver$/, async ({ page }, dernier: string) => {
  await remettreTousLesVersDansLOrdre(page);
  const mots = motsCachesDe(poesieJouee(page).vers);
  expect(mots.at(-1)).toBe(dernier);
  for (const mot of mots.slice(0, -1)) {
    await avancerJusquAuxChoix(page);
    await bulleDeChoix(page, mot).click();
  }
  await expect.poll(async () => {
    await avancerJusquAuxChoix(page);
    return (await textesDesChoix(page)).includes(dernier);
  }, { intervals: [100], timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
});

// --- La fin de la séance

Then(/^les (\d) étoiles apparaissent une à une, puis des confettis tombent$/, async ({ page }, nombre: string) => {
  await attendre(page, (observation) => observation.vu.includes("etoiles:affichees"));
  await expect.poll(async () => (await observer(page)).vu, { timeout: DELAI_DE_L_ATTENTE_MS }).toContain("confettis:tombent");
  const { vu } = await observer(page);
  const ordre = ["etoiles:apparition", ...Array.from({ length: Number(nombre) }, (_, rang) => `etoile-apparue:${rang + 1}`), "etoiles:affichees", "confettis:tombent"];
  const rangs = ordre.map((observe) => vu.indexOf(observe));
  expect(rangs, `ordre vu : ${vu.join(" > ")}`).not.toContain(-1);
  expect(rangs, `ordre vu : ${vu.join(" > ")}`).toEqual([...rangs].sort((a, b) => a - b));
});

Then(/^Léa voit (\d) étoiles allumées sur 3, sans animation$/, async ({ page }, nombre: string) => {
  await attendreLaFinDeLaSeance(page);
  const fin = page.getByTestId("fin-de-seance");
  await expect(fin.locator('[data-testid="etoile"][data-allumee="true"]')).toHaveCount(Number(nombre));
  await expect(fin.getByTestId("etoiles-dessinees")).toHaveAttribute("data-etat", "affichees");
  for (const etoile of await fin.locator('[data-testid="etoile"][data-allumee="true"]').all()) {
    await expect(etoile).toHaveAttribute("data-apparue", "true");
  }
  expect((await observer(page)).vu).not.toContain("etoiles:apparition");
});

Then(/^aucun confetti ne tombe$/, async ({ page }) => {
  await laisserSeDerouler(page);
  await expect(page.getByTestId("confettis")).toHaveCount(0);
  expect((await observer(page)).vu.filter((vu) => vu.startsWith("confettis:"))).toEqual([]);
});

Then(/^des confettis tombent$/, async ({ page }) => {
  await expect.poll(async () => {
    if ((await page.getByTestId("confettis").count()) > 0) return true;
    return (await observer(page)).vu.includes("confettis:tombent");
  }, { timeout: DELAI_DE_L_ATTENTE_MS }).toBe(true);
});

Then(/^les lecteurs d'écran annoncent une seule fois « ([^«»]+) »$/, async ({ page }, annonce: string) => {
  await attendreLaFinDeLaSeance(page);
  await expect(page.getByTestId("annonce-des-etoiles")).toHaveText(annonce);
  await laisserSeDerouler(page);
  await laisserPasserLeDelaiDeLecture(page);
  expect((await observer(page)).annonces).toEqual([annonce]);
  await expect(page.locator("[aria-live]").filter({ hasText: annonce })).toHaveCount(1);
});

// --- Un effet impossible à jouer ne montre rien de plus (réservé à #97 : l'étape du même texte de #24 vérifie un refus du serveur)

const { Given: GivenDeLaStory97, Then: ThenDeLaStory97 } = createBdd(test, { tags: "@issue-97" });

ThenDeLaStory97(/^Léa ne voit aucun message de plus$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("status").filter({ hasText: /bloqu|impossible|erreur|introuvable|jouer/i })).toHaveCount(0);
});

// --- Étapes de même texte que celles d'autres stories, réservées à #97 : le vrai profil de Léa est déjà ouvert quand elles arrivent
// (le Contexte de #97 le fait pour tous ses scénarios), donc la page n'est pas rechargée toute seule et doit l'être ici.

GivenDeLaStory97(/^la tablette est en Muet$/, async ({ page }) => {
  scenario(page).muet = true;
  await reappliquerLAppareil(page);
  if (!estSurUnProfilReel(page)) return;
  await page.evaluate(() => localStorage.setItem("savanturier:son", "muet"));
  await rechargerAvecLeProfilReel(page);
});

GivenDeLaStory97(/^la bibliothèque de test du test de départ est servie$/, async ({ page }) => {
  etat(page).injectees.push(...(LECONS_DU_TEST_DE_DEPART as LeconBrute[]));
  suivreLesLecturesDuResultat(page);
  await servirLaBibliothequeDuTestDeDepart(page);
  if (estSurUnProfilReel(page)) await rechargerAvecLeProfilReel(page);
});

// Le scénario « Rejouer » de #97 n'annonce pas les leçons de test qu'il utilise (celui de #24 et de #33 le fait dans son Contexte).
GivenDeLaStory97(/^Léa a terminé une séance de l'exercice « ([^«»]+) » seul$/, async ({ famille, page }, exercice: string) => {
  if (!toutesLesLeconsDeLaPage(page).some((lecon) => lecon.exercices.some((e) => e.titre === exercice))) {
    await injecterLesLeconsDeTestDesSons(page);
  }
  const lecon = leconDeLExercice(page, exercice);
  etat(page).courante = lecon;
  await jouerUnExerciceSeul(famille, page, lecon, positionDeLExercice(lecon, exercice), 0);
});

function toutesLesLeconsDeLaPage(page: Page): LeconBrute[] {
  return [...etat(page).injectees, ...BIBLIOTHEQUE];
}

// --- Sans réseau (scénario @pwa, build de production) : l'interception de page ne voit pas les requêtes du service worker.
// Le relais de test (features/support/serveur-pwa.mjs) ajoute donc la leçon de test à la bibliothèque, et le service worker la garde.

const { Given: GivenHorsLigne } = createBdd(test, { tags: "@issue-97 and @pwa" });

GivenHorsLigne(/^Léa joue la question de test « (.+) »$/, async ({ page, baseURL }, question: string) => {
  const donnees = QUESTIONS_DE_TEST[question];
  if (!donnees) throw new Error(`Question de test inconnue : ${question}`);
  const lecon = leconAChoix("test-question-a-choix", question, donnees.choix, donnees.reponse);
  const reponse = await fetch(`${baseURL}/__test/publier-lecon-de-test`, { method: "POST", body: JSON.stringify(lecon) });
  expect(reponse.ok, "le relais de test garde la leçon").toBe(true);
  await injecter(page, lecon);
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, undefined);
});
