import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { CleDeQuestion } from "../../supabase/functions/_shared/apprentissage/domain/cle-de-question.ts";
import { ecrireLaFileDeRevision } from "../support/revision-api.ts";
import { Before, test } from "./fixtures.ts";
import { bulle, injecter, leconDeTest, leconDeTitre, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import {
  type Item,
  type Mecanique,
  bonneReponseCourante,
  laBoiteEstFermeeEtLEnfantPeutRepondre,
  partie21,
  repondreJusteAuxQuestionsQuiPrecedent,
} from "./boite-et-barres.steps.ts";
import { demarrer, etatDesChoix, lancer, leconDeLExercice, positionDeLExercice, questionsReussies, textesDesChoixPossibles } from "./exercices-a-choix.steps.ts";
import { choixDeLaQuestion, clavier, finDeSeance, lancerLExerciceDeTest, partie20, repondreAuNombre } from "./calcul-fluence-addition.steps.ts";
import { installerLesFauxDeLaStory97 } from "./retours-animes-et-sonores.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { choisirSonProfil, modifierLeProfil, profilDe } from "./profils-enfants.steps.ts";
import { cleDe } from "./univers.steps.ts";
import { journal, laisserPasserLeDelaiDeLecture, normaliser, terminerLaLecture, terminerLaLectureSiCenEstPas } from "./voix.steps.ts";

// Story #131, tranche 98c-boîte et barres de #98 : la boîte à jetons et le schéma en barres aux couleurs et au dessin de l'univers.
//
// CONTRAT D'ATTRIBUTS entre ces étapes et l'application (tout se lit par des attributs et des data-testid, jamais par un tracé) :
//   - boîte (data-testid="boite", existant) : data-etat = "fermee" | "ouverte" (existant) et data-univers = clé de l'univers
//     (animaux | princesse | sports | police | pompier | danse) ; elle contient data-testid="dessin-de-la-boite" (aria-hidden="true") ;
//     son nom accessible reste « Boîte fermée », « Boîte ouverte », « Boîte ouverte : 7 jetons » ;
//   - jeton (data-testid="jeton", existant) : data-univers, data-etat = "nouveau" | "sortant" | absent (existant),
//     data-cinquieme (existant), et data-mouvement = "tombe" (le jeton entre dans la boîte en tombant, avec un petit rebond :
//     sa position verticale change de sens au moins une fois) | "s-en-va" (il pâlit et bouge en douceur, sans quitter le DOM ni
//     devenir invisible d'un coup) | "pose" (il est posé à sa place, sans mouvement : mouvements réduits, boîte ouverte après la
//     bonne réponse, jeton déjà là). Aucun jeton ne tombe à l'ouverture de la boîte. Un jeton retiré reste dans la boîte, pâle
//     (opacité du jeton entre 0 et 1) jusqu'à la fermeture. Il contient data-testid="dessin-du-jeton" (aria-hidden="true",
//     le même contenu pour tous les jetons de la boîte). Le cinquième jeton de chaque rangée contient en plus
//     data-testid="marque-du-cinquieme" (data-marque="commune", la même couleur dans les 6 univers) ;
//   - les jetons gardent data-testid="jetons" (data-nombre), "rangee-de-jetons" (existants) : les jetons ajoutés forment un
//     groupe à part des premiers (le groupe ajouté ne complète pas la rangée du premier) ;
//   - schéma (data-testid="schema-en-barres", existant) : data-univers ;
//   - barre (data-testid="barre", existant, avec data-role, data-valeur, data-cherchee) : data-univers et
//     data-jauge = "vide" | "se-remplit" | "pleine". Une barre connue est "vide" jusqu'à l'explication du schéma (ou "pleine" tout de suite
//     avec les mouvements réduits), puis "se-remplit" (400 ms au plus), puis "pleine". La barre « ? » (data-cherchee="true",
//     data-valeur="?", « ? » écrit dans data-testid="valeur-cherchee") reste "vide" (jamais "se-remplit" ni "pleine") jusqu'à la bonne
//     réponse de l'enfant, puis sa valeur devient le nombre trouvé et elle se remplit comme une barre connue. Une barre "vide" porte un
//     contour en pointillés. La jauge est un élément data-testid="jauge" (aria-hidden="true", data-univers, fond uni
//     en background-color) enfant de la barre, absent d'une barre "vide" ; pleine, elle occupe toute la largeur de la barre, et la
//     largeur de la barre ne change jamais ;
//   - l'écart d'une comparaison (data-testid="ecart-du-schema", existant) et la suite des parts ne portent ni data-jauge ni jauge ; ils
//     restent en pointillés (border-style dashed), même quand l'écart est la valeur cherchée et reçoit la réponse ;
//   - les parts (data-role="part") apparaissent pleines d'un coup à la bonne réponse quand le nombre de parts est cherché.
// Le contrat de mouvement se lit dans un journal tenu par le navigateur (installerLEnregistreurDeLaStory131) : apparitions et
// changements d'attributs, positions et opacités des jetons à chaque image, largeurs de la barre et de sa jauge, effets sonores
// (au moment de l'appel à play) et paroles de la fausse voix.

const { Given, When, Then } = createBdd(test, { tags: "@issue-131" });

const DELAI_MS = 20_000;
const DELAI_D_UN_MOUVEMENT_MS = 8000;
const TOLERANCE_PX = 1.5;
const TOLERANCE_DU_BOUT_PX = 6;

// --- Ce que le navigateur voit passer, noté dès le départ

type EvenementDeJeton = { t: number; genre: "jeton"; id: number; mouvement: string; etat: string; nombre: number; groupe: number; univers: string };
type EvenementDeBoite = { t: number; genre: "boite"; etat: string; univers: string };
type EvenementDeBarre = { t: number; genre: "barre"; index: number; role: string; valeur: string; jauge: string; cherchee: string; univers: string };
type EvenementDeSon = { t: number; genre: "son"; nom: string };
type EvenementDeParole = { t: number; genre: "parole"; texte: string };
type EvenementDisparu = { t: number; genre: "disparu"; id: number };
type Evenement = EvenementDeJeton | EvenementDeBoite | EvenementDeBarre | EvenementDeSon | EvenementDeParole | EvenementDisparu;
type Position = { t: number; id: number; y: number; o: number };
type Contenu = { t: number; groupes: number[][]; etat: string };
type Largeur = { t: number; index: number; valeur: string; jauge: string; w: number; jw: number };
type Journal131 = { evenements: Evenement[]; positions: Position[]; contenus: Contenu[]; largeurs: Largeur[]; marque: number; debutDeQuestion: number };

export function installerLEnregistreurDeLaStory131() {
  type Faux = { journal: Array<{ type: string; texte: string }> };
  const journal: Journal131Local = { evenements: [], positions: [], contenus: [], largeurs: [], marque: 0, debutDeQuestion: 0 };
  type Journal131Local = {
    evenements: Array<Record<string, string | number>>;
    positions: Array<Record<string, number>>;
    contenus: Array<{ t: number; groupes: number[][]; etat: string }>;
    largeurs: Array<Record<string, string | number>>;
    marque: number;
    debutDeQuestion: number;
  };
  Reflect.set(window, "__jeu131", journal);
  const attribut = (element: Element, nom: string) => element.getAttribute(nom) ?? "";
  const identifiants = new WeakMap<Element, number>();
  const suivis = new Map<number, Element>();
  let prochain = 0;
  const identifiantDe = (element: Element) => {
    let id = identifiants.get(element);
    if (id === undefined) {
      id = ++prochain;
      identifiants.set(element, id);
    }
    return id;
  };
  const jetons = () => [...document.querySelectorAll('[data-testid="jetons"]')];
  const noter = (element: Element) => {
    const identifiant = element.getAttribute("data-testid");
    const t = performance.now();
    if (identifiant === "jeton") {
      const groupe = element.closest('[data-testid="jetons"]');
      journal.evenements.push({
        t,
        genre: "jeton",
        id: identifiantDe(element),
        mouvement: attribut(element, "data-mouvement"),
        etat: attribut(element, "data-etat"),
        nombre: Number(groupe?.getAttribute("data-nombre") ?? "0"),
        groupe: groupe === null ? -1 : jetons().indexOf(groupe),
        univers: attribut(element, "data-univers"),
      });
    }
    if (identifiant === "boite") journal.evenements.push({ t, genre: "boite", etat: attribut(element, "data-etat"), univers: attribut(element, "data-univers") });
    if (identifiant === "barre") {
      journal.evenements.push({
        t,
        genre: "barre",
        index: [...document.querySelectorAll('[data-testid="barre"]')].indexOf(element),
        role: attribut(element, "data-role"),
        valeur: attribut(element, "data-valeur"),
        jauge: attribut(element, "data-jauge"),
        cherchee: attribut(element, "data-cherchee"),
        univers: attribut(element, "data-univers"),
      });
    }
  };
  const SELECTEUR = '[data-testid="jeton"],[data-testid="boite"],[data-testid="barre"]';
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
    attributeFilter: ["data-mouvement", "data-etat", "data-jauge", "data-valeur", "data-univers"],
  });
  // Les effets sonores de #97 : l'instant exact de l'appel à play, noté avant que le faux ne le prenne.
  const jouer = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
    const nom = /\/sons\/([a-z-]+)\.mp3/.exec(this.getAttribute("src") ?? this.src)?.[1];
    if (nom !== undefined && !this.muted) journal.evenements.push({ t: performance.now(), genre: "son", nom });
    return jouer.call(this);
  };
  let paroles = 0;
  let contenu = "";
  const derniereLargeur = new Map<number, string>();
  const dernierePosition = new Map<number, string>();
  let enonce = "";
  const regarder = () => {
    const t = performance.now();
    // Une nouvelle question du problème en barres : le journal des barres repart de là.
    const enonceLu = (document.querySelector('[data-testid="enonce-du-probleme"]')?.textContent ?? "").trim();
    if (enonceLu !== "" && enonceLu !== enonce) {
      enonce = enonceLu;
      journal.debutDeQuestion = t - 100;
    }
    const faux = Reflect.get(window, "__faux") as Faux | undefined;
    if (faux && faux.journal.length > paroles) {
      for (let rang = paroles; rang < faux.journal.length; rang++) {
        const entree = faux.journal[rang];
        if (entree?.type === "speak") journal.evenements.push({ t, genre: "parole", texte: entree.texte });
      }
      paroles = faux.journal.length;
    }
    const groupes = jetons().map((groupe) =>
      [...groupe.querySelectorAll('[data-testid="rangee-de-jetons"]')].map((rangee) => rangee.querySelectorAll('[data-testid="jeton"]').length)
    );
    const etatDeLaBoite = document.querySelector('[data-testid="boite"]')?.getAttribute("data-etat") ?? "";
    const signature = JSON.stringify([groupes, etatDeLaBoite]);
    if (signature !== contenu) {
      contenu = signature;
      journal.contenus.push({ t, groupes, etat: etatDeLaBoite });
    }
    const enMouvement = document.querySelectorAll(
      '[data-testid="jeton"][data-etat="nouveau"],[data-testid="jeton"][data-etat="sortant"],[data-testid="jeton"][data-mouvement="tombe"],[data-testid="jeton"][data-mouvement="s-en-va"]',
    );
    const vusCetteFois = new Set<number>();
    for (const jeton of enMouvement) {
      const id = identifiantDe(jeton);
      vusCetteFois.add(id);
      suivis.set(id, jeton);
      const rect = jeton.getBoundingClientRect();
      const o = Number(getComputedStyle(jeton).opacity);
      const cle = `${rect.top.toFixed(2)}/${o.toFixed(3)}`;
      if (dernierePosition.get(id) !== cle) {
        dernierePosition.set(id, cle);
        journal.positions.push({ t, id, y: rect.top, o });
      }
    }
    for (const [id, element] of suivis) {
      if (!element.isConnected) {
        journal.evenements.push({ t, genre: "disparu", id });
        suivis.delete(id);
      }
    }
    [...document.querySelectorAll('[data-testid="barre"]')].forEach((barre, index) => {
      const jauge = barre.querySelector('[data-testid="jauge"]');
      const w = barre.getBoundingClientRect().width;
      const jw = jauge === null ? 0 : jauge.getBoundingClientRect().width;
      const valeur = attribut(barre, "data-valeur");
      const etatDeLaJauge = attribut(barre, "data-jauge");
      const cle = `${valeur}/${etatDeLaJauge}/${w.toFixed(1)}/${jw.toFixed(1)}`;
      if (derniereLargeur.get(index) !== cle) {
        derniereLargeur.set(index, cle);
        journal.largeurs.push({ t, index, valeur, jauge: etatDeLaJauge, w, jw });
      }
    });
    requestAnimationFrame(regarder);
  };
  requestAnimationFrame(regarder);
  // Début du geste de l'enfant : le dernier toucher d'un bouton.
  document.addEventListener("click", (evenement) => {
    const cible = evenement.target;
    if (cible instanceof Element && cible.closest("button") !== null) journal.marque = journal.evenements.length;
  }, true);
}

Before({ tags: "@issue-131" }, async ({ page, $testInfo }) => {
  // Le vrai profil de Léa, les séances jouées jusqu'à leur fin et les écrans de fin passent par le serveur.
  $testInfo.setTimeout(Math.max($testInfo.timeout, 120_000));
  await page.addInitScript(installerLesFauxDeLaStory97, { echec: false, retenir: [] });
  await page.addInitScript(installerLEnregistreurDeLaStory131);
});

/** Le journal du navigateur ; les barres et leurs largeurs ne sont que celles de la question en cours. */
async function lireLeJournal(page: Page): Promise<Journal131> {
  const lu = await page.evaluate(() => {
    const brut = Reflect.get(window, "__jeu131") as Journal131 | undefined;
    return brut === undefined
      ? { evenements: [], positions: [], contenus: [], largeurs: [], marque: 0, debutDeQuestion: 0 }
      : { evenements: [...brut.evenements], positions: [...brut.positions], contenus: [...brut.contenus], largeurs: [...brut.largeurs], marque: brut.marque, debutDeQuestion: brut.debutDeQuestion };
  });
  const deLaQuestion = (e: Evenement) => e.genre !== "barre" || e.t >= lu.debutDeQuestion;
  return {
    ...lu,
    evenements: lu.evenements.filter(deLaQuestion),
    largeurs: lu.largeurs.filter((l) => l.t >= lu.debutDeQuestion),
    marque: lu.evenements.slice(0, lu.marque).filter(deLaQuestion).length,
  };
}

/** Attend que le journal (ou l'écran) dise ce qu'on attend, en laissant finir la parole en cours au plus `terminaisons` fois. */
async function attendreQue(page: Page, vrai: () => Promise<boolean>, message: string, terminaisons = 3): Promise<void> {
  let restantes = terminaisons;
  await expect.poll(async () => {
    if (await vrai()) return true;
    if (restantes > 0) {
      restantes--;
      await terminerLaLecture(page);
    }
    return false;
  }, { message, intervals: [100], timeout: DELAI_D_UN_MOUVEMENT_MS }).toBe(true);
}

async function laisserFinirLeMouvement(page: Page): Promise<void> {
  await laisserPasserLeDelaiDeLecture(page);
  await laisserPasserLeDelaiDeLecture(page);
}

// --- Les écrans

const boite = (page: Page) => page.getByTestId("boite");
const jetons = (page: Page) => page.getByTestId("jeton");
const schema = (page: Page) => page.getByTestId("schema-en-barres");
const barres = (page: Page) => page.getByTestId("barre");
const barreCherchee = (page: Page) => page.locator('[data-testid="barre"][data-cherchee="true"]');
const barresDeValeur = (page: Page, valeur: string | number) => page.locator(`[data-testid="barre"][data-valeur="${valeur}"]`);
const ecartDe = (page: Page, valeur: string | number) => page.locator(`[data-testid="ecart-du-schema"][data-valeur="${valeur}"]`);
const barresConnues = (page: Page) => page.locator('[data-testid="barre"]:not([data-cherchee="true"]):not([data-role="suite"])');
const jaugeDe = (barre: Locator) => barre.getByTestId("jauge");

function jetonsDuJournal(evenements: readonly Evenement[]): EvenementDeJeton[] {
  return evenements.filter((e): e is EvenementDeJeton => e.genre === "jeton");
}

function barresDuJournal(evenements: readonly Evenement[]): EvenementDeBarre[] {
  return evenements.filter((e): e is EvenementDeBarre => e.genre === "barre");
}

function sonsDuJournal(evenements: readonly Evenement[]): EvenementDeSon[] {
  return evenements.filter((e): e is EvenementDeSon => e.genre === "son");
}

/** Le dernier état connu de chaque jeton du journal. */
function dernierEtatDesJetons(evenements: readonly Evenement[]): Map<number, EvenementDeJeton> {
  const derniers = new Map<number, EvenementDeJeton>();
  for (const jeton of jetonsDuJournal(evenements)) derniers.set(jeton.id, jeton);
  return derniers;
}

function jetonsQui(evenements: readonly Evenement[], condition: (jeton: EvenementDeJeton) => boolean): EvenementDeJeton[] {
  return [...dernierEtatDesJetons(evenements).values()].filter(condition);
}

function positionsDuJeton(positions: readonly Position[], id: number): Position[] {
  return positions.filter((p) => p.id === id).sort((a, b) => a.t - b.t);
}

/** Un rebond : après être descendu, le jeton remonte (la position verticale change de sens). */
function aRebondi(positions: readonly Position[]): boolean {
  const ys = positions.map((p) => p.y);
  const premier = ys[0];
  if (premier === undefined) return false;
  const descendu = ys.findIndex((y) => y - premier > 1);
  if (descendu < 0) return false;
  return ys.slice(descendu).some((y) => y < Math.max(...ys.slice(descendu)) - 0.5);
}

function debutDuMouvement(positions: readonly Position[]): number | undefined {
  const premier = positions[0];
  if (premier === undefined) return undefined;
  return positions.find((p) => Math.abs(p.y - premier.y) > 0.5 || Math.abs(p.o - premier.o) > 0.02)?.t;
}

// =====================================================================================================
// Étant donné : la séance de l'exercice, les erreurs d'avant
// =====================================================================================================

Given(/^Léa joue seulement l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/, async ({ page, monde }, exercice: string, titre: string) => {
  const p = partie20(page);
  const lecon = leconDeTitre(page, titre);
  p.lecon = lecon;
  p.titreExercice = exercice;
  const donnee = lecon.exercices.find((e) => e.titre === exercice);
  const courante = partie21(page);
  courante.lecon = lecon;
  courante.titreDeLExercice = exercice;
  courante.mecanique = donnee?.type === "barres" ? "barres" : "boite";
  courante.rang = 0;
  etatDesChoix(page).demarrage = () => lancerLExerciceDeTest(page, monde);
});

async function attendreQueLEnfantPuisseRepondre(page: Page): Promise<void> {
  await expect.poll(async () => {
    const prete = (await clavier(page).isVisible()) || (await choixDeLaQuestion(page).isVisible() && (await textesDesChoixPossibles(page)).length > 0);
    if (!prete) await terminerLaLecture(page);
    return prete;
  }, { intervals: [100], timeout: DELAI_MS }).toBe(true);
}

async function repondreFaux(page: Page): Promise<void> {
  await attendreQueLEnfantPuisseRepondre(page);
  const bonne = bonneReponseCourante(page);
  const avant = (await journal(page)).speaks;
  if (await clavier(page).isVisible()) await repondreAuNombre(page, bonne + 1);
  else {
    const fausse = (await textesDesChoixPossibles(page)).find((texte) => texte !== String(bonne));
    if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
    await repondreAuNombre(page, fausse);
  }
  await expect.poll(async () => (await journal(page)).speaks, { timeout: DELAI_MS }).toBeGreaterThan(avant);
  await terminerLaLecture(page);
}

Given(/^Léa a répondu faux (\d+) fois à la première question$/, async ({ page }, fois: string) => {
  await demarrer(page);
  for (let i = 0; i < Number(fois); i++) await repondreFaux(page);
});

When(/^Léa termine l'exercice sans autre erreur$/, async ({ page }) => {
  await demarrer(page);
  for (let essai = 0; essai < 12 && !(await finDeSeance(page).isVisible()); essai++) {
    await attendreQueLEnfantPuisseRepondre(page).catch(async () => {
      if (!(await finDeSeance(page).isVisible())) throw new Error("Aucune question à laquelle répondre");
    });
    if (await finDeSeance(page).isVisible()) return;
    const reussies = await questionsReussies(page);
    partie21(page).rang = reussies;
    await repondreAuNombre(page, bonneReponseCourante(page));
    await expect.poll(async () => {
      if (await finDeSeance(page).isVisible()) return true;
      if ((await questionsReussies(page)) > reussies) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [100], timeout: DELAI_MS }).toBe(true);
  }
  await expect(finDeSeance(page)).toBeVisible({ timeout: DELAI_MS });
});

async function direJeNeSaisPas(page: Page): Promise<void> {
  await demarrer(page);
  await attendreQueLEnfantPuisseRepondre(page);
  await page.getByTestId("je-ne-sais-pas").click();
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
}

Given(/^Léa a dit « Je ne sais pas »$/, async ({ page }) => {
  await direJeNeSaisPas(page);
});

When(/^Léa dit « Je ne sais pas »$/, async ({ page }) => {
  await direJeNeSaisPas(page);
});

When(/^Léa demande à réécouter la question$/, async ({ page }) => {
  await demarrer(page);
  await page.getByRole("button", { name: "Réécouter", exact: true }).click();
});

// --- Noisette dit, ne dit rien

Then(/^Noisette dit « (?!C'est parti)([^«»]+) »$/, async ({ page }, texte: string) => {
  const voulu = normaliser(texte);
  await expect.poll(async () => {
    if (normaliser((await toutesLesParoles(page)).join(" ")).includes(voulu)) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_MS }).toBe(true);
});

const parolesAvantLeToucher = new WeakMap<Page, number>();

Then(/^Noisette ne dit aucun encouragement$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  const avant = parolesAvantLeToucher.get(page);
  if (avant === undefined) throw new Error("Aucun toucher n'a été fait avant cette vérification");
  expect((await journal(page)).speaks).toBe(avant);
  await expect(bulle(page)).not.toHaveAttribute("data-nature", "encouragement");
});

// =====================================================================================================
// Toucher la boîte ou une barre : ni l'une ni l'autre n'est une cible
// =====================================================================================================

async function noterLaSituationAvantDeToucher(page: Page): Promise<void> {
  parolesAvantLeToucher.set(page, (await journal(page)).speaks);
}

When(/^Léa touche la boîte$/, async ({ page }) => {
  await laBoiteEstFermeeEtLEnfantPeutRepondre(page);
  await noterLaSituationAvantDeToucher(page);
  await boite(page).click();
});

When(/^Léa touche la barre de (\d+)$/, async ({ page }, valeur: string) => {
  await demarrer(page);
  await expect(barresDeValeur(page, valeur)).toHaveCount(1, { timeout: DELAI_MS });
  await noterLaSituationAvantDeToucher(page);
  await barresDeValeur(page, valeur).click();
});

const touchesDeLaFelicitation = new WeakMap<Page, { reussies: number; paroles: number }>();

When(/^Léa touche la boîte ouverte pendant la félicitation$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  await expect(boite(page)).toHaveAttribute("data-etat", "ouverte");
  touchesDeLaFelicitation.set(page, { reussies: await questionsReussies(page), paroles: (await journal(page)).speaks });
  await noterLaSituationAvantDeToucher(page);
  await boite(page).click();
});

Then(/^Léa voit toujours la boîte ouverte et ses (\d+) jetons$/, async ({ page }, total: string) => {
  const avant = touchesDeLaFelicitation.get(page);
  if (avant === undefined) throw new Error("Aucun toucher n'a été fait pendant la félicitation");
  await laisserPasserLeDelaiDeLecture(page);
  await expect(boite(page)).toHaveAttribute("data-etat", "ouverte");
  await expect(jetons(page)).toHaveCount(Number(total));
  await expect(page.getByTestId("jetons")).toHaveAttribute("data-nombre", String(total));
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  expect(await questionsReussies(page)).toBe(avant.reussies);
  expect((await journal(page)).speaks).toBe(avant.paroles);
});

// =====================================================================================================
// Séance de révision : la boîte et le schéma sont les mêmes
// =====================================================================================================

function aujourdhui(): { jour: string; hier: Date } {
  const maintenant = new Date();
  const deux = (n: number) => String(n).padStart(2, "0");
  return {
    jour: `${maintenant.getFullYear()}-${deux(maintenant.getMonth() + 1)}-${deux(maintenant.getDate())}`,
    hier: new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() - 1, 9),
  };
}

async function retenirUneQuestion(
  { famille, page }: { famille: Parameters<typeof profilDe>[0]; page: Page },
  titreDeLExercice: string,
  type: Mecanique,
  cle: string,
): Promise<void> {
  const lecon = leconDeLExercice(page, titreDeLExercice);
  const position = positionDeLExercice(lecon, titreDeLExercice);
  const { jour, hier } = aujourdhui();
  await ecrireLaFileDeRevision(profilDe(famille, "Léa").id, [{
    cle,
    leconDOrigine: lecon.id,
    position,
    type,
    intervalle: 1,
    dateDeRevision: jour,
    derniereErreurLe: hier.toISOString(),
  }]);
  // La file du serveur n'est lue qu'une fois par profil : on recharge pour qu'elle soit lue avec cette question.
  await rechargerAvecLeProfilReel(page);
}

Given(
  /^Léa a pour question retenue la boîte à jetons « (\d+) ([+−]) (\d+) » de l'exercice « ([^«»]+) », due aujourd'hui$/,
  async ({ famille, page }, a: string, signe: string, b: string, exercice: string) => {
    await retenirUneQuestion({ famille, page }, exercice, "boite", CleDeQuestion.de("boite", `${a} ${signe} ${b}`).valeur);
  },
);

Given(
  /^Léa a pour question retenue le problème « ([^«»]+) » de l'exercice « ([^«»]+) », due aujourd'hui$/,
  async ({ famille, page }, enonce: string, exercice: string) => {
    await retenirUneQuestion({ famille, page }, exercice, "barres", CleDeQuestion.de("barres", enonce).valeur);
  },
);

// =====================================================================================================
// Le dessin de l'univers
// =====================================================================================================

const DESSIN_CACHE = "aria-hidden";

async function verifierQueLeDessinEstCacheAuxLecteursDEcran(page: Page, identifiant: string): Promise<void> {
  const dessins = page.getByTestId(identifiant);
  expect(await dessins.count(), `éléments « ${identifiant} »`).toBeGreaterThan(0);
  for (const dessin of await dessins.all()) await expect(dessin).toHaveAttribute(DESSIN_CACHE, "true");
}

Then(/^la boîte a le dessin de l'univers « ([^«»]+) »$/, async ({ page }, univers: string) => {
  await laBoiteEstFermeeEtLEnfantPeutRepondre(page);
  await expect(boite(page)).toHaveAttribute("data-univers", cleDe(univers));
  await verifierQueLeDessinEstCacheAuxLecteursDEcran(page, "dessin-de-la-boite");
});

async function attendreDesJetons(page: Page): Promise<void> {
  await attendreQue(page, async () => (await jetons(page).count()) > 0, "des jetons dans la boîte", 4);
}

Then(/^la boîte et ses jetons ont le dessin de l'univers « ([^«»]+) »$/, async ({ page }, univers: string) => {
  const cle = cleDe(univers);
  await attendreDesJetons(page);
  await expect(boite(page)).toHaveAttribute("data-univers", cle);
  await expect(page.locator(`[data-testid="jeton"]:not([data-univers="${cle}"])`)).toHaveCount(0);
  await verifierQueLeDessinEstCacheAuxLecteursDEcran(page, "dessin-de-la-boite");
  await verifierQueLeDessinEstCacheAuxLecteursDEcran(page, "dessin-du-jeton");
});

Then(/^tous les jetons de la boîte ont le même dessin et la même taille$/, async ({ page }) => {
  const tous = await jetons(page).all();
  expect(tous.length).toBeGreaterThan(1);
  const lus = [];
  for (const jeton of tous) {
    const dessin = jeton.getByTestId("dessin-du-jeton");
    await expect(dessin, "chaque jeton a son dessin").toHaveCount(1);
    const rect = await jeton.boundingBox();
    lus.push({ univers: await jeton.getAttribute("data-univers"), dessin: await dessin.evaluate((e) => e.innerHTML), largeur: rect?.width ?? 0, hauteur: rect?.height ?? 0 });
  }
  const [premier, ...autres] = lus;
  expect(premier?.largeur ?? 0, "un jeton est visible").toBeGreaterThan(0);
  for (const autre of autres) {
    expect(autre.univers).toBe(premier?.univers);
    expect(autre.dessin, "le même dessin").toBe(premier?.dessin);
    expect(Math.abs(autre.largeur - (premier?.largeur ?? 0))).toBeLessThanOrEqual(0.5);
    expect(Math.abs(autre.hauteur - (premier?.hauteur ?? 0))).toBeLessThanOrEqual(0.5);
  }
});

type MarqueLue = { sur: number[]; couleurs: string[]; attendue: string };

async function lesMarquesDuCinquieme(page: Page): Promise<MarqueLue> {
  return await page.evaluate(() => {
    const couleurDuJeton = (variable: string) => {
      const essai = document.createElement("div");
      essai.style.backgroundColor = `var(${variable})`;
      document.body.append(essai);
      const couleur = getComputedStyle(essai).backgroundColor;
      essai.remove();
      return couleur;
    };
    const sur: number[] = [];
    const couleurs: string[] = [];
    document.querySelectorAll('[data-testid="rangee-de-jetons"]').forEach((rangee) => {
      const tous = [...rangee.querySelectorAll('[data-testid="jeton"]')];
      tous.forEach((jeton, rang) => {
        const marque = jeton.querySelector('[data-testid="marque-du-cinquieme"][data-marque="commune"]');
        if (marque !== null) {
          sur.push(rang);
          couleurs.push(getComputedStyle(marque).backgroundColor);
        }
      });
    });
    return { sur, couleurs, attendue: couleurDuJeton("--jeton-cinquieme") };
  });
}

Then(/^le cinquième jeton de chaque rangée porte la même marque que dans l'univers « Animaux de la forêt »$/, async ({ famille, page }) => {
  const dans = await lesMarquesDuCinquieme(page);
  expect(dans.sur.length, "des cinquièmes jetons marqués").toBeGreaterThan(0);
  expect(dans.sur.every((rang) => rang === 4), "la marque n'est que sur le cinquième jeton de la rangée").toBe(true);
  expect(await page.locator('[data-testid="rangee-de-jetons"]').count(), "une marque par rangée pleine").toBe(dans.sur.length);
  await rejouerDansLUnivers(page, famille, "animaux");
  await expect(boite(page)).toHaveAttribute("data-etat", "ouverte");
  const reference = await lesMarquesDuCinquieme(page);
  expect(dans.couleurs, "même marque que dans l'univers « Animaux de la forêt »").toEqual(reference.couleurs);
  expect(dans.attendue).toBe(reference.attendue);
});

/** L'univers de Léa change sur le serveur, elle se choisit de nouveau et rejoue la même question, comme avant. */
async function rejouerDansLUnivers(page: Page, famille: Parameters<typeof modifierLeProfil>[0], univers: string): Promise<void> {
  await modifierLeProfil(famille, "Léa", { univers });
  const liste = page.waitForResponse((reponse) => reponse.url().includes("/rest/v1/profils_enfants"));
  await page.goto("/");
  await liste;
  await choisirSonProfil(page, "Léa");
  await expect(page.getByTestId("paysage")).toHaveAttribute("data-univers", univers);
  const partie = partie21(page);
  if (partie.lecon === undefined) throw new Error("Aucune leçon à rejouer");
  await lancer(page, partie.lecon, partie.titreDeLExercice);
  await repondreJusteAuxQuestionsQuiPrecedent(page);
  if (partie.mecanique === "boite") {
    await attendreQueLEnfantPuisseRepondre(page);
    await repondreAuNombre(page, bonneReponseCourante(page));
  }
}

Then(/^les barres du schéma ont la jauge de l'univers « ([^«»]+) »$/, async ({ page }, univers: string) => {
  const cle = cleDe(univers);
  await attendreQue(page, async () => {
    const connues = await barresConnues(page).count();
    return connues > 0 && (await barresConnues(page).locator('[data-testid="jauge"]').count()) === connues;
  }, "une jauge dans chaque barre connue", 4);
  await expect(schema(page)).toHaveAttribute("data-univers", cle);
  await expect(page.locator(`[data-testid="barre"]:not([data-univers="${cle}"])`)).toHaveCount(0);
  await expect(page.locator(`[data-testid="jauge"]:not([data-univers="${cle}"])`)).toHaveCount(0);
  await verifierQueLeDessinEstCacheAuxLecteursDEcran(page, "jauge");
});

type VideLue = Record<string, string | number | boolean>;

async function lireLaBarreVide(page: Page): Promise<VideLue> {
  await expect(barreCherchee(page)).toHaveCount(1);
  return await barreCherchee(page).evaluate((barre) => {
    const style = getComputedStyle(barre);
    const rect = barre.getBoundingClientRect();
    return {
      jauge: barre.getAttribute("data-jauge") ?? "",
      jaugeDansLaBarre: barre.querySelector('[data-testid="jauge"]') !== null,
      contour: style.borderTopStyle,
      epaisseur: style.borderTopWidth,
      fond: style.backgroundColor,
      couleur: style.color,
      opacite: style.opacity,
      largeur: Math.round(rect.width),
      hauteur: Math.round(rect.height),
      texte: (barre.textContent ?? "").trim(),
    };
  });
}

Then(/^la barre « \? » vide se voit de la même façon que dans l'univers « Animaux de la forêt »$/, async ({ famille, page }) => {
  const dans = await lireLaBarreVide(page);
  await rejouerDansLUnivers(page, famille, "animaux");
  await expect(schema(page)).toBeVisible({ timeout: DELAI_MS });
  const reference = await lireLaBarreVide(page);
  expect(dans, "même barre « ? » vide que dans l'univers « Animaux de la forêt »").toEqual(reference);
});

// =====================================================================================================
// Les jetons qui tombent, ceux qui s'en vont
// =====================================================================================================

function lesJetonsQuiTombent(journal131: Journal131, nombre: number, ajoutes: boolean): EvenementDeJeton[] {
  return jetonsQui(journal131.evenements, (j) => j.mouvement === "tombe" && j.nombre === nombre && (ajoutes ? j.etat === "nouveau" : j.etat !== "nouveau"));
}

async function verifierLaChute(page: Page, nombre: number, ajoutes: boolean): Promise<EvenementDeJeton[]> {
  await attendreQue(page, async () => lesJetonsQuiTombent(await lireLeJournal(page), nombre, ajoutes).length >= nombre,
    `${nombre} jetons ${ajoutes ? "ajoutés" : "premiers"} (data-mouvement="tombe") sont vus`);
  await laisserFinirLeMouvement(page);
  const lu = await lireLeJournal(page);
  const qui = lesJetonsQuiTombent(lu, nombre, ajoutes);
  expect(qui.length).toBeGreaterThanOrEqual(nombre);
  for (const jeton of qui) {
    const positions = positionsDuJeton(lu.positions, jeton.id);
    expect(positions.length, `positions vues du jeton ${jeton.id}`).toBeGreaterThan(2);
    expect(aRebondi(positions), `le jeton ${jeton.id} tombe avec un petit rebond`).toBe(true);
  }
  return qui;
}

Then(/^les (\d+) jetons ajoutés tombent dans la boîte, avec un petit rebond$/, async ({ page }, nombre: string) => {
  await verifierLaChute(page, Number(nombre), true);
});

Then(/^les (\d+) premiers jetons tombent dans la boîte, avec un petit rebond$/, async ({ page }, nombre: string) => {
  await verifierLaChute(page, Number(nombre), false);
});

Then(/^les (\d+) jetons ajoutés commencent à tomber en même temps$/, async ({ page }, nombre: string) => {
  const qui = await verifierLaChute(page, Number(nombre), true);
  const lu = await lireLeJournal(page);
  const debuts = qui.map((jeton) => debutDuMouvement(positionsDuJeton(lu.positions, jeton.id)));
  expect(debuts.every((debut) => debut !== undefined), "chaque jeton ajouté se met à bouger").toBe(true);
  const temps = debuts.map((debut) => debut ?? 0);
  expect(Math.max(...temps) - Math.min(...temps), "écart entre les débuts de chute").toBeLessThanOrEqual(80);
});

Then(/^les (\d+) jetons ajoutés sont posés dans la boîte, sans tomber$/, async ({ page }, nombre: string) => {
  await attendreQue(page, async () => jetonsQui((await lireLeJournal(page)).evenements, (j) => j.etat === "nouveau" && j.mouvement === "pose").length >= Number(nombre),
    `${nombre} jetons ajoutés (data-mouvement="pose") sont vus`);
  await laisserFinirLeMouvement(page);
  const lu = await lireLeJournal(page);
  expect(jetonsDuJournal(lu.evenements).filter((j) => j.mouvement === "tombe"), "aucun jeton ne tombe").toEqual([]);
  const ajoutes = page.locator('[data-testid="jeton"][data-etat="nouveau"]');
  if ((await ajoutes.count()) > 0) {
    await expect(ajoutes).toHaveCount(Number(nombre));
    for (const jeton of await ajoutes.all()) {
      await expect(jeton).toHaveAttribute("data-mouvement", "pose");
      await expect(jeton).toHaveCSS("animation-name", "none");
      await expect(jeton).toHaveCSS("transition-duration", "0s");
    }
  }
  for (const jeton of jetonsQui(lu.evenements, (j) => j.etat === "nouveau")) {
    const ys = positionsDuJeton(lu.positions, jeton.id).map((p) => p.y);
    expect(Math.max(...ys) - Math.min(...ys), `le jeton ${jeton.id} ne bouge pas`).toBeLessThanOrEqual(1);
  }
});

Then(/^les (\d+) derniers jetons s'en vont en douceur, sans disparaître d'un coup$/, async ({ page }, nombre: string) => {
  await attendreQue(page, async () => jetonsQui((await lireLeJournal(page)).evenements, (j) => j.etat === "sortant" && j.mouvement === "s-en-va").length >= Number(nombre),
    `${nombre} jetons retirés (data-mouvement="s-en-va") sont vus`);
  await laisserFinirLeMouvement(page);
  const lu = await lireLeJournal(page);
  const partants = jetonsQui(lu.evenements, (j) => j.etat === "sortant" && j.mouvement === "s-en-va");
  expect(partants.length).toBeGreaterThanOrEqual(Number(nombre));
  for (const jeton of partants) {
    const positions = positionsDuJeton(lu.positions, jeton.id);
    const etats = new Set(positions.map((p) => `${p.y.toFixed(1)}/${p.o.toFixed(2)}`));
    expect(etats.size, `le jeton ${jeton.id} change progressivement`).toBeGreaterThanOrEqual(3);
    expect(lu.evenements.filter((e) => e.genre === "disparu" && e.id === jeton.id), `le jeton ${jeton.id} ne quitte pas l'écran`).toEqual([]);
    expect(positions.every((p) => p.o > 0), "jamais invisible").toBe(true);
  }
});

async function lireLesJetons(page: Page): Promise<Array<{ etat: string; mouvement: string; opacite: number; animation: string; transition: string }>> {
  return await jetons(page).evaluateAll((elements) =>
    elements.map((jeton) => {
      const style = getComputedStyle(jeton);
      return {
        etat: jeton.getAttribute("data-etat") ?? "",
        mouvement: jeton.getAttribute("data-mouvement") ?? "",
        opacite: Number(style.opacity),
        animation: style.animationName,
        transition: style.transitionDuration,
      };
    })
  );
}

async function verifierLesJetonsPales(page: Page, restants: number, retires: number, sansMouvement: boolean): Promise<void> {
  await attendreQue(page, async () => (await jetons(page).count()) === restants + retires && (await page.locator('[data-testid="jeton"][data-etat="sortant"]').count()) === retires,
    `${restants} jetons et, à leur suite, ${retires} jetons retirés (data-etat="sortant")`);
  await laisserFinirLeMouvement(page);
  const lus = await lireLesJetons(page);
  expect(lus).toHaveLength(restants + retires);
  lus.forEach((jeton, rang) => {
    if (rang < restants) {
      expect(jeton.etat, `jeton ${rang + 1} resté`).not.toBe("sortant");
      expect(jeton.opacite, `jeton ${rang + 1} resté, pas pâle`).toBeGreaterThan(0.99);
    } else {
      expect(jeton.etat, `jeton ${rang + 1} retiré`).toBe("sortant");
      expect(jeton.opacite, `jeton ${rang + 1} retiré, pâle`).toBeLessThan(1);
      expect(jeton.opacite, `jeton ${rang + 1} retiré, encore visible`).toBeGreaterThan(0);
    }
    if (sansMouvement) {
      expect(jeton.mouvement, `jeton ${rang + 1}`).toBe("pose");
      expect(jeton.animation).toBe("none");
      expect(jeton.transition).toBe("0s");
    }
  });
  if (sansMouvement) {
    const lu = await lireLeJournal(page);
    expect(jetonsDuJournal(lu.evenements).filter((j) => j.mouvement === "s-en-va" || j.mouvement === "tombe"), "aucun mouvement").toEqual([]);
    for (const jeton of jetonsQui(lu.evenements, (j) => j.etat === "sortant")) {
      const ys = positionsDuJeton(lu.positions, jeton.id).map((p) => p.y);
      expect(Math.max(...ys) - Math.min(...ys), `le jeton retiré ${jeton.id} ne bouge pas`).toBeLessThanOrEqual(1);
    }
  }
}

Then(/^Léa voit (\d+) jetons et, à leur suite, (\d+) jetons pâles$/, async ({ page }, restants: string, retires: string) => {
  await verifierLesJetonsPales(page, Number(restants), Number(retires), false);
});

Then(/^Léa voit (\d+) jetons et, à leur suite, (\d+) jetons pâles, sans mouvement$/, async ({ page }, restants: string, retires: string) => {
  await verifierLesJetonsPales(page, Number(restants), Number(retires), true);
});

Then(/^Léa voit une rangée de (\d+) jetons et, à part, une rangée de (\d+) jetons$/, async ({ page }, premiers: string, ajoutes: string) => {
  await attendreQue(page, async () => (await lireLeJournal(page)).contenus.some((c) => JSON.stringify(c.groupes) === JSON.stringify([[Number(premiers)], [Number(ajoutes)]])),
    `la boîte montre une rangée de ${premiers} et, à part, une rangée de ${ajoutes}`);
});

Then(/^aucun jeton ne tombe à l'ouverture de la boîte$/, async ({ page }) => {
  await expect(boite(page)).toHaveAttribute("data-etat", "ouverte");
  await expect(jetons(page).first()).toBeVisible();
  await laisserFinirLeMouvement(page);
  const lu = await lireLeJournal(page);
  const ouverture = ouvertureDeLaBoite(lu.evenements);
  expect(ouverture, "la boîte s'est ouverte après avoir été fermée").toBeDefined();
  expect(jetonsDuJournal(lu.evenements).filter((j) => j.t >= (ouverture?.t ?? Infinity) && j.mouvement === "tombe"), "jetons tombés à l'ouverture").toEqual([]);
  await expect(page.locator('[data-testid="jeton"][data-mouvement="tombe"]')).toHaveCount(0);
});

/** L'ouverture après la bonne réponse : la dernière fois que la boîte passe de fermée à ouverte. */
function ouvertureDeLaBoite(evenements: readonly Evenement[]): EvenementDeBoite | undefined {
  const etats = evenements.filter((e): e is EvenementDeBoite => e.genre === "boite");
  let ouverture: EvenementDeBoite | undefined;
  etats.forEach((courant, rang) => {
    if (courant.etat === "ouverte" && etats[rang - 1]?.etat === "fermee") ouverture = courant;
  });
  return ouverture;
}

Then(/^l'effet sonore « réponse juste » commence avant que la boîte s'ouvre$/, async ({ page }) => {
  await expect(boite(page)).toHaveAttribute("data-etat", "ouverte");
  const lu = await lireLeJournal(page);
  const ouverture = ouvertureDeLaBoite(lu.evenements);
  expect(ouverture, "la boîte s'est ouverte après avoir été fermée").toBeDefined();
  const son = sonsDuJournal(lu.evenements).find((s) => s.nom === "reponse-juste");
  expect(son, "l'effet sonore « réponse juste » a été entendu").toBeDefined();
  expect(son?.t ?? Infinity, "le son commence avant l'ouverture").toBeLessThan(ouverture?.t ?? 0);
});

Then(/^la boîte fermée a la même taille, quel que soit le nombre de jetons dedans$/, async ({ page }) => {
  const taille = async () => {
    const rect = await boite(page).boundingBox();
    return { largeur: rect?.width ?? 0, hauteur: rect?.height ?? 0 };
  };
  const ici = await taille();
  expect(ici.largeur).toBeGreaterThan(0);
  const premier = (partie21(page).lecon?.exercices.find((e) => e.titre === partie21(page).titreDeLExercice)?.items as Item[] | undefined)?.[0];
  const autre = premier?.a === 4 ? { a: 12, op: "+", b: 8 } : { a: 4, op: "+", b: 3 };
  const reference = { ...leconDeTest("e2e-131-boite-de-reference", "Leçon de test e2e-131 de référence", [{ type: "boite", titre: "Boîte de référence", items: [autre] }]), niveau: "CP" };
  await injecter(page, reference);
  await lancer(page, reference, "Boîte de référence");
  await laBoiteEstFermeeEtLEnfantPeutRepondre(page);
  const la = await taille();
  expect(Math.abs(la.largeur - ici.largeur), "largeur de la boîte fermée").toBeLessThanOrEqual(0.5);
  expect(Math.abs(la.hauteur - ici.hauteur), "hauteur de la boîte fermée").toBeLessThanOrEqual(0.5);
});

// =====================================================================================================
// Les barres qui se remplissent, la barre « ? » qui reste vide
// =====================================================================================================

async function lireLesBarres(page: Page) {
  return await barres(page).evaluateAll((elements) =>
    elements.map((barre, index) => ({
      index,
      role: barre.getAttribute("data-role") ?? "",
      valeur: barre.getAttribute("data-valeur") ?? "",
      jauge: barre.getAttribute("data-jauge") ?? "",
      cherchee: barre.getAttribute("data-cherchee") === "true",
      texte: (barre.textContent ?? "").trim(),
    }))
  );
}

/** Une barre qui n'est pas remplie : sa jauge n'est ni en train de se remplir ni pleine (un attribut absent vaut « vide »). */
function estVide(jauge: string): boolean {
  return jauge === "" || jauge === "vide";
}

Then(/^la barre « \? » reste vide, avec son « \? »$/, async ({ page }) => {
  await expect(barreCherchee(page)).toHaveCount(1);
  await expect(barreCherchee(page)).toHaveAttribute("data-valeur", "?");
  await expect(barreCherchee(page).getByTestId("valeur-cherchee")).toHaveText("?");
  await expect(barreCherchee(page)).toHaveCSS("border-top-style", "dashed");
  const jauge = (await barreCherchee(page).getAttribute("data-jauge")) ?? "";
  expect(estVide(jauge), `la jauge de la barre « ? » est « ${jauge} »`).toBe(true);
  expect(await jaugeDe(barreCherchee(page)).evaluateAll((js) => js.map((j) => j.getBoundingClientRect().width)), "aucune jauge dans la barre « ? »").toEqual([]);
  const lu = await lireLeJournal(page);
  const remplie = barresDuJournal(lu.evenements).filter((b) => b.cherchee === "true" && !estVide(b.jauge));
  expect(remplie, "la barre « ? » n'a jamais été remplie").toEqual([]);
});

/**
 * Attend que les barres soient pleines. Après la réponse, on ne termine aucune lecture : la félicitation se lit jusqu'au bout
 * et la question suivante ne doit pas apparaître avant l'état « pleine ».
 */
async function attendreLeRemplissage(page: Page, valeurs: readonly string[], apresLaReponse = false): Promise<void> {
  await attendreQue(page, async () => {
    for (const valeur of valeurs) {
      if ((await barresDeValeur(page, valeur).getAttribute("data-jauge")) !== "pleine") return false;
    }
    return true;
  }, `les barres de ${valeurs.join(" et de ")} sont pleines`, apresLaReponse ? 0 : 4);
  await laisserFinirLeMouvement(page);
}

/** La jauge d'une barre pleine va jusqu'au bout de sa barre, sans que la barre change de largeur. */
async function verifierQueLaJaugeVaJusquAuBout(page: Page, valeur: string, depuis: Journal131): Promise<void> {
  const barre = barresDeValeur(page, valeur);
  await expect(barre).toHaveCount(1);
  await expect(barre).toHaveAttribute("data-jauge", "pleine");
  const jauge = jaugeDe(barre);
  await expect(jauge, `jauge de la barre de ${valeur}`).toHaveCount(1);
  const [boiteBarre, boiteJauge] = [await barre.boundingBox(), await jauge.boundingBox()];
  expect(boiteBarre).not.toBeNull();
  expect(boiteJauge).not.toBeNull();
  expect(Math.abs((boiteJauge?.x ?? 0) + (boiteJauge?.width ?? 0) - ((boiteBarre?.x ?? 0) + (boiteBarre?.width ?? 0))), `la jauge de ${valeur} va jusqu'au bout`).toBeLessThanOrEqual(TOLERANCE_DU_BOUT_PX);
  expect(boiteJauge?.width ?? 0, `la jauge de ${valeur} occupe la barre`).toBeGreaterThanOrEqual((boiteBarre?.width ?? 0) - 2 * TOLERANCE_DU_BOUT_PX);
  const largeurs = depuis.largeurs.filter((l) => l.valeur === String(valeur)).map((l) => l.w);
  expect(Math.max(...largeurs) - Math.min(...largeurs), `la barre de ${valeur} garde sa largeur`).toBeLessThanOrEqual(TOLERANCE_PX);
}

function etatsDeLaJaugeDeLaBarre(lu: Journal131, valeur: string): string[] {
  return barresDuJournal(lu.evenements).filter((b) => b.valeur === String(valeur)).map((b) => b.jauge);
}

Then(/^les barres de (\d+) et de (\d+) se remplissent comme une jauge, jusqu'au bout de leur barre$/, async ({ page }, premiere: string, seconde: string) => {
  await attendreLeRemplissage(page, [premiere, seconde]);
  const lu = await lireLeJournal(page);
  for (const valeur of [premiere, seconde]) {
    expect(etatsDeLaJaugeDeLaBarre(lu, valeur), `la barre de ${valeur} se remplit avant d'être pleine`).toContain("se-remplit");
    await verifierQueLaJaugeVaJusquAuBout(page, valeur, lu);
  }
});

Then(/^la barre de (\d+) se remplit comme une jauge, jusqu'au bout de sa barre$/, async ({ page }, valeur: string) => {
  await attendreLeRemplissage(page, [valeur], true);
  const lu = await lireLeJournal(page);
  expect(etatsDeLaJaugeDeLaBarre(lu, valeur), `la barre de ${valeur} se remplit avant d'être pleine`).toContain("se-remplit");
  await verifierQueLaJaugeVaJusquAuBout(page, valeur, lu);
});

Then(/^les barres de (\d+) et de (\d+) sont pleines dès l'affichage, sans mouvement$/, async ({ page }, premiere: string, seconde: string) => {
  await attendreQue(page, async () => (await barresDeValeur(page, premiere).getAttribute("data-jauge")) === "pleine"
    && (await barresDeValeur(page, seconde).getAttribute("data-jauge")) === "pleine", `les barres de ${premiere} et de ${seconde} sont pleines`, 0);
  const lu = await lireLeJournal(page);
  for (const valeur of [premiere, seconde]) {
    expect(etatsDeLaJaugeDeLaBarre(lu, valeur), `la barre de ${valeur} ne se remplit pas progressivement`).not.toContain("se-remplit");
    await expect(jaugeDe(barresDeValeur(page, valeur))).toHaveCSS("animation-name", "none");
    await expect(jaugeDe(barresDeValeur(page, valeur))).toHaveCSS("transition-duration", "0s");
  }
});

Then(/^la barre de (\d+) est pleine d'un coup, sans mouvement$/, async ({ page }, valeur: string) => {
  await attendreQue(page, async () => (await barresDeValeur(page, valeur).getAttribute("data-jauge")) === "pleine", `la barre de ${valeur} est pleine`, 0);
  const lu = await lireLeJournal(page);
  expect(etatsDeLaJaugeDeLaBarre(lu, valeur), `la barre de ${valeur} ne se remplit pas progressivement`).not.toContain("se-remplit");
  await expect(jaugeDe(barresDeValeur(page, valeur))).toHaveCSS("animation-name", "none");
  await expect(jaugeDe(barresDeValeur(page, valeur))).toHaveCSS("transition-duration", "0s");
});

async function parolesDites(page: Page): Promise<string[]> {
  return (await toutesLesParoles(page)).map(normaliser);
}

Then(/^les barres de (\d+) et de (\d+) sont encore vides pendant que Noisette lit l'énoncé du problème$/, async ({ page }, premiere: string, seconde: string) => {
  const enonce = normaliser((await page.getByTestId("enonce-du-probleme").textContent()) ?? "");
  await expect.poll(() => terminerLaLectureSiCenEstPas(page, enonce), { intervals: [100], timeout: DELAI_MS }).toBe(true);
  for (const valeur of [premiere, seconde]) {
    const jauge = (await barresDeValeur(page, valeur).getAttribute("data-jauge")) ?? "";
    expect(estVide(jauge), `la barre de ${valeur} est « ${jauge} » pendant l'énoncé`).toBe(true);
  }
  const lu = await lireLeJournal(page);
  expect(barresDuJournal(lu.evenements).filter((b) => !b.cherchee.includes("true") && !estVide(b.jauge)), "aucune barre ne se remplit pendant l'énoncé").toEqual([]);
});

Then(/^les barres de (\d+) et de (\d+) se remplissent quand Noisette dit « ([^«»]+) »$/, async ({ page }, premiere: string, seconde: string, texte: string) => {
  const voulu = normaliser(texte);
  const avantLExplication = (await lireLeJournal(page)).evenements.filter((e): e is EvenementDeParole => e.genre === "parole").at(-1)?.t ?? 0;
  await expect.poll(async () => {
    const dites = await parolesDites(page);
    // La voix découpe la phrase en morceaux : la parole est commencée dès son premier morceau.
    const dernier = dites.at(-1) ?? "";
    if (dernier === voulu || (dernier.length > 8 && voulu.startsWith(dernier)) || dites.slice(-2).join(" ") === voulu) return true;
    await terminerLaLecture(page);
    return false;
  }, { message: `Noisette dit « ${texte} »`, intervals: [100], timeout: DELAI_D_UN_MOUVEMENT_MS }).toBe(true).catch(async (erreur: unknown) => {
    throw new Error(`${String(erreur)}\nParoles dites : ${JSON.stringify(await parolesDites(page))}`);
  });
  await attendreLeRemplissage(page, [premiere, seconde]);
  const lu = await lireLeJournal(page);
  for (const valeur of [premiere, seconde]) {
    const debut = barresDuJournal(lu.evenements).find((b) => b.valeur === String(valeur) && !estVide(b.jauge));
    expect(debut, `la barre de ${valeur} se remplit`).toBeDefined();
    expect(debut?.t ?? 0, `la barre de ${valeur} se remplit après l'énoncé`).toBeGreaterThanOrEqual(avantLExplication);
  }
});

Given(/^les barres de (\d+) et de (\d+) sont pleines$/, async ({ page }, premiere: string, seconde: string) => {
  await demarrer(page);
  await expect(schema(page)).toBeVisible({ timeout: DELAI_MS });
  await attendreLeRemplissage(page, [premiere, seconde]);
});

Then(/^les barres de (\d+) et de (\d+) restent pleines, sans se remplir de nouveau$/, async ({ page }, premiere: string, seconde: string) => {
  await laisserFinirLeMouvement(page);
  const lu = await lireLeJournal(page);
  const depuis = lu.evenements.slice(lu.marque);
  for (const valeur of [premiere, seconde]) {
    await expect(barresDeValeur(page, valeur)).toHaveAttribute("data-jauge", "pleine");
    const etats = barresDuJournal(depuis).filter((b) => b.valeur === String(valeur)).map((b) => b.jauge);
    expect(etats.filter((etat) => etat !== "pleine"), `la barre de ${valeur} ne se vide ni ne se remplit de nouveau`).toEqual([]);
  }
});

Then(/^la barre de (\d+) a la même largeur que la barre « \? » avant la réponse$/, async ({ page }, valeur: string) => {
  await attendreLeRemplissage(page, [valeur], true);
  const lu = await lireLeJournal(page);
  const avant = lu.largeurs.filter((l) => l.valeur === "?").at(-1);
  const apres = lu.largeurs.filter((l) => l.valeur === String(valeur)).at(-1);
  expect(avant, "la barre « ? » a été vue avant la réponse").toBeDefined();
  expect(apres, `la barre de ${valeur} a été vue`).toBeDefined();
  expect(Math.abs((apres?.w ?? 0) - (avant?.w ?? Infinity)), "largeur de la barre avant et après la réponse").toBeLessThanOrEqual(TOLERANCE_PX);
});

Then(/^l'effet sonore « réponse juste » commence avant que la barre de (\d+) se remplisse$/, async ({ page }, valeur: string) => {
  await attendreLeRemplissage(page, [valeur], true);
  const lu = await lireLeJournal(page);
  const son = sonsDuJournal(lu.evenements).find((s) => s.nom === "reponse-juste");
  expect(son, "l'effet sonore « réponse juste » a été entendu").toBeDefined();
  const debut = barresDuJournal(lu.evenements).find((b) => b.valeur === String(valeur) && !estVide(b.jauge));
  expect(debut, `la barre de ${valeur} se remplit`).toBeDefined();
  expect(son?.t ?? Infinity, "le son commence avant le remplissage").toBeLessThan(debut?.t ?? 0);
});

Then(/^le nombre (\d+) n'est écrit sur aucune barre du schéma$/, async ({ page }, nombre: string) => {
  await expect(barreCherchee(page)).toHaveCount(1);
  const lues = await lireLesBarres(page);
  expect(lues.filter((b) => b.valeur === String(nombre) || b.texte === String(nombre)), "barres qui portent la réponse").toEqual([]);
  await expect(page.locator(`[data-testid="ecart-du-schema"][data-valeur="${nombre}"]`)).toHaveCount(0);
  await expect(schema(page)).not.toHaveAttribute("data-resolu", "true");
});

Then(/^l'écart de (\d+) reste en pointillés, sans jauge$/, async ({ page }, valeur: string) => {
  const ecart = ecartDe(page, valeur);
  await expect(ecart).toHaveCount(1);
  await expect(ecart).toHaveCSS("border-top-style", "dashed");
  await expect(ecart).not.toHaveAttribute("data-jauge", /./);
  await expect(jaugeDe(ecart)).toHaveCount(0);
});

Then(/^Léa voit (\d+) parts, toutes pleines de la jauge$/, async ({ page }, nombre: string) => {
  const parts = page.locator('[data-testid="barre"][data-role="part"]');
  await attendreQue(page, async () => (await parts.count()) === Number(nombre), `${nombre} parts à l'écran`, 4);
  for (const part of await parts.all()) {
    await expect(part).toHaveAttribute("data-jauge", "pleine");
    await expect(jaugeDe(part)).toHaveCount(1);
  }
});

type TeinteLue = { role: string; teinte: string };

Then(/^la barre du tout n'a pas la même teinte que les barres des parties$/, async ({ page }) => {
  await attendreQue(page, async () => (await barres(page).count()) > 0 && (await jaugeDe(barres(page)).count()) === (await barres(page).count()), "une jauge dans chaque barre", 4);
  const teintes: TeinteLue[] = await barres(page).evaluateAll((elements) =>
    elements.map((barre) => {
      const jauge = barre.querySelector('[data-testid="jauge"]');
      const style = jauge === null ? undefined : getComputedStyle(jauge);
      return { role: barre.getAttribute("data-role") ?? "", teinte: style === undefined ? "" : `${style.backgroundColor}|${style.backgroundImage}` };
    })
  );
  const tout = teintes.filter((t) => t.role === "tout").map((t) => t.teinte);
  const parties = teintes.filter((t) => t.role === "partie").map((t) => t.teinte);
  expect(tout.length, "la barre du tout").toBeGreaterThan(0);
  expect(parties.length, "les barres des parties").toBeGreaterThan(0);
  for (const teinte of tout) {
    expect(teinte, "la jauge du tout a une teinte").not.toBe("");
    expect(parties, "teinte du tout parmi celles des parties").not.toContain(teinte);
  }
});

// --- Contraste et mode dys des nombres écrits sur les barres

type Rgba = { r: number; g: number; b: number; a: number };

function lireLaCouleur(css: string): Rgba {
  const lue = /rgba?\(([^)]+)\)/.exec(css);
  if (!lue) throw new Error(`Couleur illisible : « ${css} »`);
  const [r = 0, g = 0, b = 0, a = 1] = (lue[1] ?? "").split(/[ ,/]+/).filter((x) => x !== "").map(Number);
  return { r, g, b, a };
}

function sur(dessus: Rgba, dessous: Rgba): Rgba {
  const a = dessus.a + dessous.a * (1 - dessus.a);
  const melange = (premier: number, second: number) => (premier * dessus.a + second * dessous.a * (1 - dessus.a)) / (a === 0 ? 1 : a);
  return { r: melange(dessus.r, dessous.r), g: melange(dessus.g, dessous.g), b: melange(dessus.b, dessous.b), a };
}

function luminance({ r, g, b }: Rgba): number {
  const canal = (valeur: number) => {
    const c = valeur / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(a: Rgba, b: Rgba): number {
  const [haut, bas] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((haut ?? 0) + 0.05) / ((bas ?? 0) + 0.05);
}

Then(/^chaque nombre écrit sur une barre se détache de sa jauge avec un contraste d'au moins 4,5:1$/, async ({ page }) => {
  await attendreQue(page, async () => (await barres(page).count()) > 0 && (await jaugeDe(barres(page)).count()) === (await barres(page).count()), "une jauge dans chaque barre", 4);
  await laisserFinirLeMouvement(page);
  const lues = await barres(page).evaluateAll((elements) =>
    elements.map((barre) => {
      const nombre = barre.querySelector(".valeur-de-la-barre") ?? barre;
      const jauge = barre.querySelector('[data-testid="jauge"]');
      const dessous: string[] = [];
      for (let courant: Element | null = jauge ?? barre; courant !== null; courant = courant.parentElement) dessous.push(getComputedStyle(courant).backgroundColor);
      return { texte: (nombre.textContent ?? "").trim(), couleur: getComputedStyle(nombre).color, fonds: dessous };
    })
  );
  expect(lues.length).toBeGreaterThan(0);
  for (const lue of lues) {
    const fond = lue.fonds.map(lireLaCouleur).reduceRight<Rgba>((dessous, dessus) => sur(dessus, dessous), { r: 255, g: 255, b: 255, a: 1 });
    const rapport = contraste(sur(lireLaCouleur(lue.couleur), fond), fond);
    expect(rapport, `contraste du nombre « ${lue.texte} » sur sa jauge`).toBeGreaterThanOrEqual(4.5);
  }
});

Then(/^Léa voit les nombres écrits sur les barres en mode dys : police Andika$/, async ({ page }) => {
  await expect(barres(page).first()).toBeVisible({ timeout: DELAI_MS });
  const nombres = page.locator('[data-testid="barre"] .valeur-de-la-barre');
  expect(await nombres.count()).toBeGreaterThan(0);
  for (const nombre of await nombres.all()) {
    const dansUnTrace = await nombre.evaluate((element) => element.closest("svg") !== null || element.namespaceURI !== "http://www.w3.org/1999/xhtml");
    expect(dansUnTrace, "le nombre est un texte, pas un tracé").toBe(false);
  }
  await verifierModeDys(page, await nombres.all(), true);
});

// =====================================================================================================
// Écran de 360 px, lecteurs d'écran, sons
// =====================================================================================================

Then(/^la boîte, les choix et « Je ne sais pas » se voient sans faire défiler l'écran$/, async ({ page }) => {
  const taille = page.viewportSize() ?? { width: 360, height: 740 };
  const elements: Locator[] = [boite(page), choixDeLaQuestion(page), page.getByTestId("je-ne-sais-pas")];
  for (const element of elements) {
    await expect(element).toBeVisible();
    const rect = await element.boundingBox();
    const nom = (await element.getAttribute("data-testid")) ?? "";
    expect(rect, `« ${nom} » est à l'écran`).not.toBeNull();
    expect((rect?.y ?? -1) + (rect?.height ?? 0), `bas de « ${nom} » dans la fenêtre de ${taille.height} px`).toBeLessThanOrEqual(taille.height);
    expect(rect?.y ?? -1, `haut de « ${nom} »`).toBeGreaterThanOrEqual(0);
    expect((rect?.x ?? 0) + (rect?.width ?? 0), `droite de « ${nom} »`).toBeLessThanOrEqual(taille.width);
  }
  expect(await page.evaluate(() => window.scrollY), "la page n'a pas défilé").toBe(0);
});

Then(/^les lecteurs d'écran annoncent « Boîte ouverte : 7 jetons »$/, async ({ page }) => {
  await expect(page.getByRole("img", { name: "Boîte ouverte : 7 jetons", exact: true })).toHaveCount(1);
});

Then(/^les lecteurs d'écran n'annoncent ni le dessin de la boîte, ni celui des jetons, ni l'univers du dessin$/, async ({ page }) => {
  await verifierQueLeDessinEstCacheAuxLecteursDEcran(page, "dessin-de-la-boite");
  await verifierQueLeDessinEstCacheAuxLecteursDEcran(page, "dessin-du-jeton");
  const arbre = await boite(page).ariaSnapshot();
  expect(arbre.split("\n").filter((ligne) => ligne.trim() !== ""), "ce que lisent les lecteurs d'écran").toEqual(['- img "Boîte ouverte : 7 jetons"']);
  expect(arbre).not.toMatch(/univers|dessin/i);
});

Then(/^les lecteurs d'écran n'annoncent ni la jauge, ni l'univers du dessin$/, async ({ page }) => {
  await attendreQue(page, async () => (await jaugeDe(barres(page)).count()) > 0, "des jauges dans le schéma", 4);
  await verifierQueLeDessinEstCacheAuxLecteursDEcran(page, "jauge");
  const arbre = await schema(page).ariaSnapshot();
  expect(arbre).not.toMatch(/jauge|univers|dessin/i);
});

const MOUVEMENTS_SANS_BRUIT = {
  "la chute des jetons ajoutés": async (page: Page) =>
    await attendreQue(page, async () => jetonsQui((await lireLeJournal(page)).evenements, (j) => j.etat === "nouveau" && j.mouvement === "tombe").length > 0, "des jetons ajoutés tombent"),
  "la sortie des jetons retirés": async (page: Page) =>
    await attendreQue(page, async () => jetonsQui((await lireLeJournal(page)).evenements, (j) => j.etat === "sortant" && j.mouvement === "s-en-va").length > 0, "des jetons retirés s'en vont"),
  "le remplissage des barres": async (page: Page) =>
    await attendreQue(page, async () => barresDuJournal((await lireLeJournal(page)).evenements).some((b) => b.jauge === "se-remplit"), "des barres se remplissent"),
} as const;

Then(
  /^Léa n'entend aucun effet sonore pendant que (la chute des jetons ajoutés|la sortie des jetons retirés|le remplissage des barres) a lieu$/,
  async ({ page }, mouvement: keyof typeof MOUVEMENTS_SANS_BRUIT) => {
    await MOUVEMENTS_SANS_BRUIT[mouvement](page);
    await laisserFinirLeMouvement(page);
    const lu = await lireLeJournal(page);
    expect(sonsDuJournal(lu.evenements), "effets sonores entendus pendant le mouvement").toEqual([]);
  },
);
