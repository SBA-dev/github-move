import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { ecrireLaFileDeRevision } from "../support/revision-api.ts";
import { Before, Given, test, Then, When } from "./fixtures.ts";
import { entendu, leconDeTitre } from "./etapes-puis-exercices.steps.ts";
import {
  demarrer,
  finirLaParoleJusqua,
  positionDeLExercice,
  questionsDeLaSeance,
  repondre,
} from "./exercices-a-choix.steps.ts";
import { marquerLeGeste } from "./exercices-comme-des-jeux.steps.ts";
import { estSurUnProfilReel, rechargerAvecLeProfilReel, rechoisirLeaApresUnReglage } from "./profil-reel.ts";
import { modifierLeProfil, profilDe } from "./profils-enfants.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { cleDe } from "./univers.steps.ts";
import { journal, laisserPasserLeDelaiDeLecture, normaliser, reappliquerLAppareil, scenario, terminerLaLecture } from "./voix.steps.ts";

// Story #129, tranche 98e de #98 : le texte d'une lecture et les vers d'une poésie se dévoilent comme un parchemin.
//
// Le contrat entre ces étapes et l'application (tout se lit par des attributs, des data-testid, des styles calculés et des
// positions, jamais par un tracé SVG) :
//   - data-testid="parchemin" : UN seul élément par exercice, qui contient les phrases d'une lecture ou les vers d'une poésie
//       (dans le texte de lecture, ou autour de la liste des vers). Il porte
//         data-univers = clé de l'univers (animaux, princesse, sports, police, pompier, danse), « animaux » par défaut ;
//         data-deroule = « roule » (rien n'est dévoilé), « en-cours » (une partie), « ouvert » (tout est dévoilé) ;
//   - data-testid="phrase" (lecture) : un élément par phrase, dans l'ordre du texte, coupé comme la lecture à voix haute (après
//       . ! ? … :), qui contient les mots [data-mot] ; le texte de lecture ne change pas : <p> garde tout le texte ;
//   - data-testid="vers" (poésie, existant) : un élément par vers, qui garde data-lu et aria-current ;
//   - sur chaque phrase et chaque vers : data-devoilee = « oui » ou « non ». « non » veut dire caché à l'œil seulement :
//       opacité calculée de l'élément (ou d'un ancêtre) nulle, mais l'élément reste dans la page, à sa place (pas de
//       display:none, pas de visibility:hidden, pas de hidden, pas d'aria-hidden). « oui » : opacité calculée 1
//       (une transition de moins de 400 ms est permise) ;
//   - data-testid="dessin-du-parchemin" (aria-hidden="true", sans titre ni description) : le dessin de l'univers, un ou
//       plusieurs par parchemin ; chaque forme d'ornement (hors fond uni) est dans un élément de classe « decor-du-parchemin »
//       qui ne recouvre jamais une ligne de texte ;
//   - aucune région aria-live, aucun role status, alert ou log dans le parchemin, ni autour ; rien n'y annonce un dévoilement.

const LECON_DU_TEXTE = "Lecture : Le petit chat Plume";
const EXERCICE_DU_TEXTE = "Le petit chat Plume";
const LECON_DE_LA_POESIE = "Poésie : La Cigale et la Fourmi";
const EXERCICE_DE_LA_POESIE = "Le début de la fable";
const GUIDES = "Noisette|Lumi|Coach Léo|Agent Max|Capitaine Sam|Lili";
const AUTRES_GUIDES = "Lumi|Coach Léo|Agent Max|Capitaine Sam|Lili";

// --- Ce que le navigateur voit passer, noté dès le départ

type Point = { x: number; y: number };

type Journal129 = {
  vuCache: boolean;
  recache: boolean;
  cacheOpaque: string[];
  deroules: string[];
  maxOui: number;
  total: number;
  premierEtat: Record<string, string>;
  reveles: Record<string, number>;
  lus: Record<string, number>;
  series: Array<{ oui: number; total: number; hauteur: number; boutons: Record<string, Point> }>;
  annonces: string[];
};

export function installerLEnregistreurDeLaStory129() {
  const journal129 = {
    vuCache: false,
    recache: false,
    cacheOpaque: [] as string[],
    deroules: [] as string[],
    maxOui: 0,
    total: 0,
    premierEtat: {} as Record<string, string>,
    reveles: {} as Record<string, number>,
    lus: {} as Record<string, number>,
    series: [] as Array<{ oui: number; total: number; hauteur: number; boutons: Record<string, { x: number; y: number }> }>,
    annonces: [] as string[],
  };
  Reflect.set(window, "__parchemin129", journal129);

  const opaciteEffective = (depart: Element | null): number => {
    let opacite = 1;
    for (let noeud = depart; noeud !== null; noeud = noeud.parentElement) opacite *= Number.parseFloat(getComputedStyle(noeud).opacity);
    return opacite;
  };
  const positionAbsolue = (element: Element | null): { x: number; y: number } | null => {
    if (element === null) return null;
    const boite = element.getBoundingClientRect();
    return { x: boite.left + window.scrollX, y: boite.top + window.scrollY };
  };
  const boutonParTexte = (texte: string): Element | null =>
    [...document.querySelectorAll("button")].find((bouton) => (bouton.textContent ?? "").trim() === texte) ?? null;

  const regarder = () => {
    const parchemin = document.querySelector('[data-testid="parchemin"]');
    if (parchemin === null) return;
    const maintenant = performance.now();
    const deroule = parchemin.getAttribute("data-deroule") ?? "absent";
    if (!journal129.deroules.includes(deroule)) journal129.deroules.push(deroule);
    const unites = [...parchemin.querySelectorAll('[data-testid="phrase"],[data-testid="vers"]')];
    if (unites.length === 0) return;
    let oui = 0;
    unites.forEach((unite, rang) => {
      const cle = `${unite.getAttribute("data-testid")}${rang}`;
      const etat = unite.getAttribute("data-devoilee") ?? "absent";
      journal129.premierEtat[cle] ??= etat;
      if (etat === "oui") {
        oui += 1;
        journal129.reveles[cle] ??= maintenant;
      }
      if (etat === "non") {
        journal129.vuCache = true;
        if (opaciteEffective(unite) > 0.02) journal129.cacheOpaque.push(cle);
      }
      if (unite.getAttribute("data-lu") === "true") journal129.lus[cle] ??= maintenant;
    });
    if (oui < journal129.maxOui) journal129.recache = true;
    journal129.maxOui = Math.max(journal129.maxOui, oui);
    journal129.total = unites.length;
    const boutons: Record<string, { x: number; y: number }> = {};
    const jAiEcoute = positionAbsolue(document.querySelector('[data-testid="j-ai-ecoute"]'));
    const reecouter = positionAbsolue(boutonParTexte("Réécouter"));
    if (jAiEcoute !== null) boutons["J'ai écouté"] = jAiEcoute;
    if (reecouter !== null) boutons["Réécouter"] = reecouter;
    const echantillon = { oui, total: unites.length, hauteur: parchemin.getBoundingClientRect().height, boutons };
    const dernier = journal129.series[journal129.series.length - 1];
    if (dernier === undefined || JSON.stringify(dernier) !== JSON.stringify(echantillon)) journal129.series.push(echantillon);
  };

  const REGIONS_VIVANTES = '[aria-live]:not([aria-live="off"]),[role="status"],[role="alert"],[role="log"]';
  new MutationObserver((enregistrements) => {
    regarder();
    for (const enregistrement of enregistrements) {
      const noeud = enregistrement.target;
      const element = noeud instanceof Element ? noeud : noeud.parentElement;
      const region = element?.closest(REGIONS_VIVANTES);
      if (region && journal129.annonces.length < 400) journal129.annonces.push((region.textContent ?? "").replace(/\s+/g, " ").trim());
    }
  }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
  const echantillonner = () => {
    regarder();
    requestAnimationFrame(echantillonner);
  };
  requestAnimationFrame(echantillonner);
}

Before({ tags: "@issue-129" }, async ({ page }) => {
  await page.addInitScript(installerLEnregistreurDeLaStory129);
});

async function lireLeJournal(page: Page): Promise<Journal129> {
  return await page.evaluate(() => {
    const brut = Reflect.get(window, "__parchemin129") as unknown;
    return JSON.parse(JSON.stringify(brut ?? null));
  }) as Journal129;
}

// --- Ce que Léa voit des phrases et des vers

type Genre = "phrase" | "vers";

type Unite = {
  texte: string;
  devoilee: string;
  opacite: number;
  visibilite: string;
  opaciteMinDesMots: number;
  lisible: boolean;
};

async function lesUnites(page: Page, genre: Genre): Promise<Unite[]> {
  return await page.evaluate((genreCherche) => {
    const opaciteEffective = (depart: Element | null): number => {
      let opacite = 1;
      for (let noeud = depart; noeud !== null; noeud = noeud.parentElement) opacite *= Number.parseFloat(getComputedStyle(noeud).opacity);
      return opacite;
    };
    const lisibleParUnLecteurDEcran = (element: Element): boolean => {
      for (let noeud: Element | null = element; noeud !== null; noeud = noeud.parentElement) {
        const style = getComputedStyle(noeud);
        if (noeud.getAttribute("aria-hidden") === "true" || noeud.hasAttribute("hidden") || noeud.hasAttribute("inert")) return false;
        if (style.display === "none" || style.visibility === "hidden") return false;
      }
      return true;
    };
    const parchemin = document.querySelector('[data-testid="parchemin"]');
    if (parchemin === null) return [];
    return [...parchemin.querySelectorAll(`[data-testid="${genreCherche}"]`)].map((unite) => {
      const mots = [...unite.querySelectorAll("[data-mot]")];
      return {
        texte: (unite.textContent ?? "").replace(/\s+/g, " ").trim(),
        devoilee: unite.getAttribute("data-devoilee") ?? "absent",
        opacite: opaciteEffective(unite),
        visibilite: getComputedStyle(unite).visibility,
        opaciteMinDesMots: mots.length === 0 ? 1 : Math.min(...mots.map(opaciteEffective)),
        lisible: lisibleParUnLecteurDEcran(unite),
      };
    });
  }, genre);
}

const estVisible = (unite: Unite) => unite.devoilee === "oui" && unite.opacite >= 0.99 && unite.visibilite === "visible";
const estCachee = (unite: Unite) => unite.devoilee === "non" && unite.opacite <= 0.01;

function resume(unites: readonly Unite[]): string {
  if (unites.length === 0) return "aucune phrase ni aucun vers dans le parchemin (data-testid=parchemin / phrase / vers)";
  return unites.map((unite, rang) => `${rang + 1}:${unite.devoilee}/${unite.opacite.toFixed(2)}`).join(" ");
}

async function genreAffiche(page: Page): Promise<Genre> {
  await expect.poll(async () => (await lesUnites(page, "phrase")).length + (await lesUnites(page, "vers")).length, {
    message: "le parchemin contient des phrases (data-testid=phrase) ou des vers (data-testid=vers)",
  }).toBeGreaterThan(0);
  return (await lesUnites(page, "phrase")).length > 0 ? "phrase" : "vers";
}

function citations(liste: string): string[] {
  return [...liste.matchAll(/«\s*([^«»]+?)\s*»/g)].flatMap((m) => (m[1] === undefined ? [] : [m[1]]));
}

function unePhrase(unites: readonly Unite[], texte: string): Unite {
  const trouvee = unites.find((unite) => unite.texte === normaliser(texte));
  if (trouvee === undefined) throw new Error(`« ${texte} » n'est pas dans le parchemin : ${unites.map((unite) => unite.texte).join(" | ")}`);
  return trouvee;
}

async function attendreQue<T>(page: Page, genre: Genre, message: string, verifie: (unites: Unite[]) => T | false, timeout?: number): Promise<T> {
  let resultat: T | false = false;
  await expect.poll(async () => {
    const unites = await lesUnites(page, genre);
    resultat = verifie(unites);
    return resultat === false ? resume(unites) : "ok";
  }, { message, ...(timeout === undefined ? {} : { timeout }) }).toBe("ok");
  return resultat as T;
}

// --- Les textes joués

function texteDeLaLecture(page: Page): string {
  const lecon = leconDeTitre(page, LECON_DU_TEXTE);
  return (lecon.exercices[positionDeLExercice(lecon, EXERCICE_DU_TEXTE)] as { texte: string }).texte;
}

function versDeLaPoesie(page: Page): string[] {
  const lecon = leconDeTitre(page, LECON_DE_LA_POESIE);
  return (lecon.exercices[positionDeLExercice(lecon, EXERCICE_DE_LA_POESIE)] as { vers: string[] }).vers;
}

/** Les phrases du texte, coupées comme la lecture à voix haute (après . ! ? … :). */
function phrasesDuTexte(texte: string): string[] {
  return (texte.match(/[^.!?…:]+[.!?…:]+|[^.!?…:]+$/g) ?? []).map(normaliser).filter((phrase) => phrase !== "");
}

const nombreDeMots = (phrase: string) => phrase.split(/\s+/).filter((mot) => mot !== "").length;

async function prononcerLeMot(page: Page, rangDuMot: number) {
  await page.evaluate((rang) => {
    const faux = Reflect.get(window, "__faux") as {
      enonces: Array<{ lot: number; enonce: { text: string; onboundary: ((e: { name: string; charIndex: number }) => void) | null } }>;
      lot: number;
    };
    let motsAvant = 0;
    for (const { lot, enonce } of faux.enonces) {
      if (lot !== faux.lot) continue;
      const debuts = [...enonce.text.matchAll(/\S+/g)].map((m) => m.index);
      if (rang < motsAvant + debuts.length) {
        enonce.onboundary?.({ name: "word", charIndex: debuts[rang - motsAvant] ?? 0 });
        return;
      }
      motsAvant += debuts.length;
    }
  }, rangDuMot);
}

/** Le texte de la lecture est affiché (même caché à l'œil) : c'est lui, et non la bibliothèque, qui dit quel texte Noisette lit. */
async function texteAffiche(page: Page): Promise<string> {
  const texte = page.getByTestId("texte-de-lecture").locator("p");
  await expect(texte, "le texte de lecture est dans la page").toHaveCount(1);
  return normaliser((await texte.textContent()) ?? "");
}

// --- Lire le texte de la lecture en regardant les phrases se dévoiler

type PassageDePhrase = { rang: number; avant: Unite[]; apres: Unite[] };

const lecturesObservees = new WeakMap<Page, Promise<PassageDePhrase[]>>();
const reprisesObservees = new WeakMap<Page, { dejaVisibles: number; passages: PassageDePhrase[] }>();

/** Attend que Noisette lise le texte (les paroles d'avant sont finies une à une), puis dit les mots un à un, phrase après phrase. */
async function lireLeTexteEnObservant(page: Page): Promise<PassageDePhrase[]> {
  await demarrer(page);
  const texte = await texteAffiche(page);
  const phrases = phrasesDuTexte(texte);
  const affichees = await attendreQue(page, "phrase", "les phrases du parchemin", (unites) => unites.length > 0 && unites);
  expect(affichees.map((unite) => unite.texte), "les phrases du parchemin sont coupées comme la lecture à voix haute").toEqual(phrases);
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: entendu(texte) });
  const passages: PassageDePhrase[] = [];
  let rangDuMot = 0;
  for (const [rang, phrase] of phrases.entries()) {
    const avant = await lesUnites(page, "phrase");
    await prononcerLeMot(page, rangDuMot);
    rangDuMot += 1;
    // La phrase doit apparaître quand son premier mot est prononcé : on lui laisse le temps, sans jamais dépasser 1,5 s.
    await expect.poll(async () => estVisible((await lesUnites(page, "phrase"))[rang] as Unite), { timeout: 1_500 }).toBe(true).catch(() => undefined);
    const apres = await lesUnites(page, "phrase");
    passages.push({ rang, avant, apres });
    for (let mot = 1; mot < nombreDeMots(phrase); mot++) {
      await prononcerLeMot(page, rangDuMot);
      rangDuMot += 1;
    }
  }
  return passages;
}

function observerLaLecture(page: Page): Promise<PassageDePhrase[]> {
  const deja = lecturesObservees.get(page);
  if (deja !== undefined) return deja;
  const lecture = lireLeTexteEnObservant(page);
  lecturesObservees.set(page, lecture);
  return lecture;
}

/** Va jusqu'à la phrase donnée : Noisette lit le texte et son premier mot est prononcé (les mots d'avant l'ont été aussi). */
async function commencerLaPhrase(page: Page, phrase: string): Promise<void> {
  await demarrer(page);
  const texte = await texteAffiche(page);
  const phrases = phrasesDuTexte(texte);
  const rang = phrases.indexOf(normaliser(phrase));
  if (rang < 0) throw new Error(`« ${phrase} » n'est pas une phrase du texte : ${phrases.join(" | ")}`);
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: entendu(texte) });
  const premierMot = phrases.slice(0, rang).reduce((total, avant) => total + nombreDeMots(avant), 0);
  for (let mot = 0; mot <= premierMot; mot++) await prononcerLeMot(page, mot);
}

Given(/^Noisette en est à la phrase « ([^«»]+) »$/, async ({ page }, phrase: string) => {
  await commencerLaPhrase(page, phrase);
});

When(/^Noisette commence à lire la phrase « ([^«»]+) »$/, async ({ page }, phrase: string) => {
  await commencerLaPhrase(page, phrase);
});

When(new RegExp(`^(?:${GUIDES}) lit le texte$`), async ({ page }) => {
  await observerLaLecture(page);
});

When(/^Noisette commence à lire le texte$/, async ({ page }) => {
  // La voix factice ne signale aucun mot tant que le test n'en dit pas : on attend seulement que le texte soit lu.
  await demarrer(page);
  const texte = await texteAffiche(page);
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: entendu(texte) });
});

When(new RegExp(`^(?:${GUIDES}) a fini de lire le texte$`), async ({ page }) => {
  await demarrer(page);
  const texte = await texteAffiche(page);
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: entendu(texte) });
  await terminerLaLecture(page);
});

// --- Alors : le dévoilement phrase après phrase

Then(new RegExp(`^chaque phrase du texte apparaît en entier quand (?:${GUIDES}) commence à la lire$`), async ({ page }) => {
  const passages = await observerLaLecture(page);
  const phrases = phrasesDuTexte(await texteAffiche(page));
  expect(passages).toHaveLength(phrases.length);
  for (const { rang, avant, apres } of passages) {
    const phrase = phrases[rang] as string;
    expect(estCachee(avant[rang] as Unite), `« ${phrase} » est cachée avant son premier mot (${resume(avant)})`).toBe(true);
    const arrivee = apres[rang] as Unite;
    expect(estVisible(arrivee), `« ${phrase} » apparaît quand son premier mot est prononcé (${resume(apres)})`).toBe(true);
    expect(arrivee.texte, "la phrase apparaît en entier").toBe(phrase);
    expect(arrivee.opaciteMinDesMots, `aucun mot de « ${phrase} » n'apparaît après les autres`).toBeGreaterThanOrEqual(0.99);
    for (let avantElle = 0; avantElle < rang; avantElle++) {
      expect(estVisible(apres[avantElle] as Unite), `la phrase ${avantElle + 1} reste visible (${resume(apres)})`).toBe(true);
    }
  }
});

Then(/^les phrases que Noisette n'a pas encore commencées restent cachées$/, async ({ page }) => {
  const passages = await observerLaLecture(page);
  const phrases = phrasesDuTexte(await texteAffiche(page));
  for (const { rang, avant, apres } of passages) {
    for (let suivante = rang; suivante < phrases.length; suivante++) {
      expect(estCachee(avant[suivante] as Unite), `avant le premier mot de la phrase ${rang + 1}, la phrase ${suivante + 1} est cachée (${resume(avant)})`).toBe(true);
      if (suivante > rang) {
        expect(estCachee(apres[suivante] as Unite), `au premier mot de la phrase ${rang + 1}, la phrase ${suivante + 1} est cachée (${resume(apres)})`).toBe(true);
      }
      expect((avant[suivante] as Unite).texte, "la phrase cachée reste dans la page").toBe(phrases[suivante]);
    }
  }
});

Then(/^ensuite, chaque phrase suivante apparaît en entier quand Noisette commence à la lire$/, async ({ page }) => {
  const phrases = phrasesDuTexte(await texteAffiche(page));
  const visiblesAuDepart = (await lesUnites(page, "phrase")).filter(estVisible).length;
  expect(visiblesAuDepart, "des phrases sont déjà dévoilées").toBeGreaterThan(0);
  expect(visiblesAuDepart, "il reste des phrases à dévoiler").toBeLessThan(phrases.length);
  const passages = await lireLeTexteEnObservant(page);
  reprisesObservees.set(page, { dejaVisibles: visiblesAuDepart, passages });
  for (const { rang, avant, apres } of passages) {
    const phrase = phrases[rang] as string;
    if (rang < visiblesAuDepart) {
      expect(estVisible(avant[rang] as Unite), `« ${phrase} » ne se cache pas de nouveau (${resume(avant)})`).toBe(true);
      continue;
    }
    expect(estCachee(avant[rang] as Unite), `« ${phrase} » est cachée avant son premier mot (${resume(avant)})`).toBe(true);
    expect(estVisible(apres[rang] as Unite), `« ${phrase} » apparaît quand son premier mot est prononcé (${resume(apres)})`).toBe(true);
    expect((apres[rang] as Unite).texte).toBe(phrase);
  }
});

Then(/^les phrases (« .+) sont visibles$/, async ({ page }, liste: string) => {
  const attendues = citations(liste);
  await attendreQue(page, "phrase", `les phrases ${attendues.join(", ")} sont visibles`, (unites) =>
    attendues.every((texte) => estVisible(unePhrase(unites, texte))) && true);
});

Then(/^la phrase « ([^«»]+) » n'est pas encore visible$/, async ({ page }, texte: string) => {
  await attendreQue(page, "phrase", `la phrase « ${texte} » n'est pas encore visible`, (unites) => estCachee(unePhrase(unites, texte)) && true);
});

// --- Alors : le parchemin est roulé pendant la présentation

async function verifierQueLeParcheminResteRoule(page: Page, genre: Genre, premier: string) {
  const unites = await attendreQue(page, genre, "le parchemin est roulé : tout est caché (data-devoilee=non, opacité nulle)", (liste) => liste.length > 0 && liste.every(estCachee) && liste);
  expect(unites.every((unite) => unite.texte !== ""), "le texte caché reste dans la page").toBe(true);
  await expect(page.getByTestId("parchemin")).toHaveAttribute("data-deroule", "roule");
  const vu = await journal(page);
  expect(vu.actifs, "Noisette parle encore").toBeGreaterThan(0);
  expect(vu.lecture.texte, "Noisette présente encore : elle n'a pas commencé le texte").not.toContain(normaliser(premier));
}

Then(/^aucune phrase du texte n'est visible tant que Noisette présente l'histoire$/, async ({ page }) => {
  await verifierQueLeParcheminResteRoule(page, "phrase", phrasesDuTexte(texteDeLaLecture(page))[0] as string);
});

Then(/^aucun vers n'est visible tant que Noisette annonce l'écoute$/, async ({ page }) => {
  await verifierQueLeParcheminResteRoule(page, "vers", versDeLaPoesie(page)[0] as string);
});

// --- Alors : tout est visible

async function toutEstVisible(page: Page, genre: Genre, premier: string, dernier: string, quand: string | undefined) {
  const delai = quand === "aussitôt" ? 1_500 : undefined;
  const unites = await attendreQue(page, genre, `tout est visible ${quand ?? ""}`, (liste) => liste.length > 0 && liste.every(estVisible) && liste, delai);
  expect(unites[0]?.texte, "la première phrase ou le premier vers").toBe(normaliser(premier));
  expect(unites[unites.length - 1]?.texte, "la dernière phrase ou le dernier vers").toBe(normaliser(dernier));
  if (genre === "vers") expect(unites.map((unite) => unite.texte)).toEqual(versDeLaPoesie(page).map(normaliser));
  else expect(unites.map((unite) => unite.texte)).toEqual(phrasesDuTexte(texteDeLaLecture(page)));
  if (quand === "tout de suite") await verifierQueRienNeSeDeroule(page);
  if (quand === "bien avant la fin de la lecture") {
    expect((await journal(page)).actifs, "Noisette lit encore").toBeGreaterThan(0);
  }
}

/** La lecture n'a laissé voir aucun état caché ni parchemin roulé : tout était ouvert dès que le texte s'est affiché. */
async function verifierQueRienNeSeDeroule(page: Page) {
  const vu = await lireLeJournal(page);
  expect(vu.total, "des phrases ou des vers ont été affichés").toBeGreaterThan(0);
  expect(vu.vuCache, "une phrase ou un vers a été vu caché (data-devoilee=non)").toBe(false);
  expect(vu.deroules.filter((etat) => etat !== "ouvert"), "états du parchemin vus (data-deroule)").toEqual([]);
  expect(vu.cacheOpaque, "une phrase cachée devait avoir une opacité nulle").toEqual([]);
}

Then(
  /^(ensuite, )?tout le texte est visible(?: (tout de suite|aussitôt|bien avant la fin de la lecture))?, de « ([^«»]+) » à « ([^«»]+) »$/,
  async ({ page }, ensuite: string | null | undefined, quand: string | null | undefined, premier: string, dernier: string) => {
    if (ensuite != null) {
      // Le texte est lu jusqu'au bout avant de regarder : on lit en observant s'il ne l'a pas encore été.
      await observerLaLecture(page);
      await terminerLaLecture(page);
    }
    await toutEstVisible(page, "phrase", premier, dernier, quand ?? undefined);
  },
);

Then(
  /^les 6 vers sont visibles(?: (tout de suite|aussitôt))?, de « ([^«»]+) » à « ([^«»]+) »$/,
  async ({ page }, quand: string | null | undefined, premier: string, dernier: string) => {
    await toutEstVisible(page, "vers", premier, dernier, quand ?? undefined);
  },
);

Then(/^rien ne se déroule$/, async ({ page }) => {
  await verifierQueRienNeSeDeroule(page);
});

Then(/^aucune phrase ne se cache de nouveau pendant que Noisette relit$/, async ({ page }) => {
  // Noisette relit pendant un moment, puis la relecture est finie : rien ne doit s'être caché de nouveau depuis l'ouverture.
  await laisserPasserLeDelaiDeLecture(page);
  await terminerLaLecture(page);
  const vu = await lireLeJournal(page);
  expect(vu.recache, "une phrase déjà dévoilée s'est cachée de nouveau").toBe(false);
  await toutEstVisible(page, "phrase", phrasesDuTexte(texteDeLaLecture(page))[0] as string, phrasesDuTexte(texteDeLaLecture(page)).at(-1) as string, undefined);
});

// --- Ce que le texte lu à haute voix ne change pas

Given(/^Léa n'a pas encore dit qu'elle a écouté$/, async () => {
  // État de départ : la question n'est posée qu'après « J'ai écouté ».
});

Then(/^Léa entend toujours Noisette lire le texte jusqu'au bout$/, async ({ page }) => {
  const texte = await texteAffiche(page);
  await expect.poll(async () => (await journal(page)).lecture.texte, { message: "Noisette lit tout le texte" }).toBe(entendu(texte));
  const vu = await journal(page);
  expect(vu.actifs, "la lecture n'est pas finie").toBeGreaterThan(0);
  expect(vu.coupeApresLaDerniereParole, "la lecture n'est pas coupée").toBe(false);
});

Given(/^la voix de l'appareil lit sans signaler les mots qu'elle prononce$/, async () => {
  // La voix factice ne signale un mot que lorsque le test le demande : cette étape garantit seulement que ce scénario n'en demande aucun.
});

Then(new RegExp(`^chaque mot du texte est surligné au moment où (?:${AUTRES_GUIDES}) le prononce$`), async ({ page }) => {
  const texte = page.getByTestId("texte-de-lecture");
  const mots = await texte.locator("[data-mot]").allTextContents();
  expect(mots.length).toBeGreaterThan(0);
  for (const [rang, mot] of mots.entries()) {
    await prononcerLeMot(page, rang);
    const surligne = texte.locator("[data-prononce='true']");
    await expect(surligne).toHaveCount(1);
    await expect(surligne).toHaveText(mot);
    await expect(surligne).toHaveAttribute("aria-current", "true");
  }
});

// --- Poésie

function versEnvoyes(page: Page, rang: number): string {
  return entendu(versDeLaPoesie(page)[rang] as string);
}

/** Vrai si le vers de ce rang est celui qui est lu et dit en entier ; sinon la lecture en cours est terminée, dans le même appel au navigateur. */
async function leVersEstLuSinonTermine(page: Page, rang: number, lu: string): Promise<boolean> {
  return await page.evaluate(([rangDuVers, texteAttendu]) => {
    const faux = Reflect.get(window, "__faux") as {
      journal: Array<{ type: string; lot: number; texte: string }>;
      enonces: Array<{ enonce: { onend: (() => void) | null } }>;
      actifs: unknown[];
      lot: number;
    };
    const vers = document.querySelectorAll('[data-testid="vers"]')[Number(rangDuVers)];
    const dit = faux.journal.filter((e) => e.type === "speak" && e.lot === faux.lot).map((e) => e.texte).join(" ").replace(/\s+/g, " ").trim();
    const satisfait = vers?.getAttribute("data-lu") === "true" && dit === texteAttendu;
    if (!satisfait) {
      faux.actifs = [];
      faux.enonces[faux.enonces.length - 1]?.enonce.onend?.();
    }
    return satisfait;
  }, [String(rang), lu] as const);
}

async function commencerLeVers(page: Page, rang: number) {
  await demarrer(page);
  await expect(page.getByTestId("poesie")).toBeVisible();
  await expect.poll(() => leVersEstLuSinonTermine(page, rang, versEnvoyes(page, rang)), { intervals: [100], timeout: 20_000 }).toBe(true);
}

function rangDuVers(page: Page, vers: string): number {
  const rang = versDeLaPoesie(page).map(normaliser).indexOf(normaliser(vers));
  if (rang < 0) throw new Error(`« ${vers} » n'est pas un vers de la poésie`);
  return rang;
}

Given(/^Noisette en est au vers « ([^«»]+) »$/, async ({ page }, vers: string) => {
  await commencerLeVers(page, rangDuVers(page, vers));
});

When(/^Noisette commence à lire le vers « ([^«»]+) »$/, async ({ page }, vers: string) => {
  await commencerLeVers(page, rangDuVers(page, vers));
});

Given(/^Noisette a lu les (\d+) premiers vers de « ([^«»]+) »$/, async ({ page }, nombre: string, _titre: string) => {
  await commencerLeVers(page, Number(nombre));
});

When(new RegExp(`^(?:${AUTRES_GUIDES}) a lu le dernier vers$`), async ({ page }) => {
  await demarrer(page);
  await expect(page.getByTestId("poesie")).toBeVisible();
  await expect.poll(async () => {
    if ((await page.getByTestId("poesie").getAttribute("data-temps")) === "redire") return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 25_000 }).toBe(true);
});

Then(/^les vers (« .+) sont visibles$/, async ({ page }, liste: string) => {
  const attendus = citations(liste);
  await attendreQue(page, "vers", `les vers ${attendus.join(", ")} sont visibles`, (unites) => attendus.every((texte) => estVisible(unePhrase(unites, texte))) && true);
});

Then(/^le vers « ([^«»]+) » n'est pas encore visible$/, async ({ page }, texte: string) => {
  await attendreQue(page, "vers", `le vers « ${texte} » n'est pas encore visible`, (unites) => estCachee(unePhrase(unites, texte)) && true);
});

Then(/^chaque vers apparaît quand Noisette commence à le lire$/, async ({ page }) => {
  const vu = await lireLeJournal(page);
  const vers = versDeLaPoesie(page);
  for (const [rang, unVers] of vers.entries()) {
    const lu = vu.lus[`vers${rang}`];
    const revele = vu.reveles[`vers${rang}`];
    expect(lu, `le vers « ${unVers} » a été lu (data-lu)`).toBeDefined();
    expect(revele, `le vers « ${unVers} » s'est dévoilé (data-devoilee=oui)`).toBeDefined();
    const ecart = (revele as number) - (lu as number);
    expect(ecart, `le vers « ${unVers} » ne se dévoile pas avant qu'il soit lu`).toBeGreaterThanOrEqual(-80);
    expect(ecart, `le vers « ${unVers} » se dévoile dès qu'il est lu`).toBeLessThanOrEqual(400);
  }
});

Then(/^les vers que Noisette n'a pas encore commencés restent cachés$/, async ({ page }) => {
  const vu = await lireLeJournal(page);
  const vers = versDeLaPoesie(page);
  for (const [rang, unVers] of vers.entries()) {
    expect(vu.premierEtat[`vers${rang}`], `le vers « ${unVers} » est caché dès l'ouverture`).toBe("non");
  }
  expect(vu.cacheOpaque, "un vers caché devait avoir une opacité nulle").toEqual([]);
  expect(vu.recache, "un vers dévoilé s'est caché de nouveau").toBe(false);
  expect((await lesUnites(page, "vers")).map((unite) => unite.texte), "les vers cachés restent dans la page").toEqual(vers.map(normaliser));
});

Then(/^le vers « ([^«»]+) » est de nouveau mis en avant$/, async ({ page }, vers: string) => {
  const rang = rangDuVers(page, vers);
  await expect(page.getByTestId("vers").nth(rang)).toHaveAttribute("data-lu", "true");
  await expect(page.getByTestId("vers").nth(rang)).toHaveAttribute("aria-current", "true");
});

Then(/^ensuite, le vers « ([^«»]+) » apparaît quand Noisette commence à le lire$/, async ({ page }, vers: string) => {
  const rang = rangDuVers(page, vers);
  await commencerLeVers(page, rang);
  await attendreQue(page, "vers", `le vers « ${vers} » apparaît`, (unites) => estVisible(unePhrase(unites, vers)) && true);
  const unites = await lesUnites(page, "vers");
  for (let suivant = rang + 1; suivant < unites.length; suivant++) {
    expect(estCachee(unites[suivant] as Unite), `le vers ${suivant + 1} reste caché (${resume(unites)})`).toBe(true);
  }
  expect((await lireLeJournal(page)).recache, "un vers dévoilé s'est caché de nouveau").toBe(false);
});

// --- Aucune voix, voix coupée, mouvements réduits

const { Given: GivenDe129 } = createBdd(test, { tags: "@issue-129" });

GivenDe129(/^la tablette est en Muet$/, async ({ page }) => {
  scenario(page).muet = true;
  await reappliquerLAppareil(page);
  if (!estSurUnProfilReel(page)) return;
  await page.evaluate(() => localStorage.setItem("savanturier:son", "muet"));
  await rechargerAvecLeProfilReel(page);
});

GivenDe129(/^Paul a réglé « mode dys » sur « oui » pour Léa$/, async ({ famille, page }) => {
  await modifierLeProfil(famille, "Léa", { reglages: { modeDys: true } });
  // Léa joue déjà avec son vrai profil : elle se choisit de nouveau pour que le réglage s'applique.
  await rechoisirLeaApresUnReglage(page);
});

When(/^le navigateur bloque la voix pendant que Noisette lit$/, async ({ page }) => {
  await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { bloque: boolean; actifs: Array<{ onerror: ((e: { error: string }) => void) | null }> };
    faux.bloque = true;
    const enCours = [...faux.actifs];
    faux.actifs = [];
    for (const enonce of enCours) enonce.onerror?.({ error: "not-allowed" });
  });
});

When(/^l'appareil se met à demander des mouvements réduits$/, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

Then(/^Noisette continue de lire « ([^«»]+) »$/, async ({ page }, lu: string) => {
  const vu = await journal(page);
  expect(vu.actifs, "Noisette lit encore").toBeGreaterThan(0);
  expect(vu.coupeApresLaDerniereParole, "la lecture n'est pas coupée").toBe(false);
  await expect.poll(() =>
    page.evaluate(() => {
      const mot = document.querySelector("[data-prononce='true']");
      const phrase = mot?.closest('[data-testid="phrase"]') ?? document.querySelector('[data-testid="vers"][data-lu="true"]');
      return (phrase?.textContent ?? "").replace(/\s+/g, " ").trim();
    }), { message: "ce que Noisette lit (mot surligné ou vers mis en avant)" }).toBe(normaliser(lu));
});

When(/^Léa touche le parchemin$/, async ({ page }) => {
  await marquerLeGeste(page);
  await page.getByTestId("parchemin").click();
});

// --- Le dessin de l'univers

Then(/^le parchemin a le dessin de l'univers « ([^«»]+) »$/, async ({ page }, univers: string) => {
  const parchemin = page.getByTestId("parchemin");
  await expect(parchemin, "un seul parchemin").toHaveCount(1);
  await expect(parchemin).toHaveAttribute("data-univers", cleDe(univers));
  const dessins = parchemin.getByTestId("dessin-du-parchemin");
  expect(await dessins.count(), "le parchemin a son dessin (data-testid=dessin-du-parchemin)").toBeGreaterThan(0);
  for (const dessin of await dessins.all()) await expect(dessin).toHaveAttribute("aria-hidden", "true");
});

/** Invariant 18 de la story 98 : le décor habille le texte sans le cacher (tolérance de 1 px). */
Then(/^le décor du parchemin ne cache pas le texte$/, async ({ page }) => {
  const parchemin = page.getByTestId("parchemin");
  await expect(parchemin).toHaveCount(1);
  expect(await parchemin.getByTestId("dessin-du-parchemin").count(), "le parchemin a son dessin").toBeGreaterThan(0);
  const recouvrements = await page.evaluate(() => {
    const TOLERANCE = 1;
    const PAS = 2;
    const trouves: string[] = [];
    const racine = document.querySelector('[data-testid="parchemin"]');
    if (racine === null) return ["aucun parchemin"];
    const lignes: DOMRect[] = [];
    const intervalle = document.createRange();
    const lecteur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
    for (let texte = lecteur.nextNode(); texte !== null; texte = lecteur.nextNode()) {
      const parent = texte.parentElement;
      if (parent === null || parent.closest('[data-testid="dessin-du-parchemin"]') !== null || (texte.textContent ?? "").trim() === "") continue;
      intervalle.selectNodeContents(texte);
      // Seule la bande de la police compte (zone où se dessinent les lettres), centrée dans la ligne : pas l'interligne.
      const taillePolice = parseFloat(getComputedStyle(parent).fontSize);
      for (const ligne of intervalle.getClientRects()) {
        if (ligne.width <= 0 || ligne.height <= 0) continue;
        const hauteurBande = Math.min(taillePolice, ligne.height);
        lignes.push(new DOMRect(ligne.left, ligne.top + (ligne.height - hauteurBande) / 2, ligne.width, hauteurBande));
      }
    }
    if (lignes.length === 0) return ["aucune ligne de texte dans le parchemin"];
    const univers = racine.getAttribute("data-univers");
    for (const forme of racine.querySelectorAll('[data-testid="dessin-du-parchemin"] .decor-du-parchemin, [data-testid="dessin-du-parchemin"] .decor-du-parchemin *')) {
      if (!(forme instanceof SVGGeometryElement)) continue;
      // Un clipPath, un masque ou un défilé de dégradé ne se dessine pas : seul ce qui est peint peut cacher le texte.
      if (forme.closest("clipPath, mask, defs") !== null) continue;
      const matrice = forme.getScreenCTM();
      if (matrice === null) continue;
      const inverse = matrice.inverse();
      const style = getComputedStyle(forme);
      const rempli = style.fill !== "none" && style.fillOpacity !== "0";
      const trace = style.stroke !== "none" && style.strokeOpacity !== "0";
      if (!rempli && !trace) continue;
      const boite = forme.getBoundingClientRect();
      lignes.forEach((ligne, rang) => {
        // La grille de points ne couvre que la partie de la ligne que la boîte de la forme touche.
        const gauche = Math.max(ligne.left, boite.left);
        const droite = Math.min(ligne.right, boite.right);
        const haut = Math.max(ligne.top, boite.top);
        const bas = Math.min(ligne.bottom, boite.bottom);
        if (droite <= gauche || bas <= haut) return;
        let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
        for (let x = gauche; x <= droite; x += PAS) {
          for (let y = haut; y <= bas; y += PAS) {
            const point = new DOMPoint(x, y).matrixTransform(inverse);
            if ((rempli && forme.isPointInFill(point)) || (trace && forme.isPointInStroke(point))) {
              xMin = Math.min(xMin, x); xMax = Math.max(xMax, x); yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
            }
          }
        }
        if (xMax - xMin > TOLERANCE && yMax - yMin > TOLERANCE) {
          trouves.push(`[${univers}] <${forme.tagName.toLowerCase()}> du décor recouvre la ligne ${rang + 1}/${lignes.length} du texte de ${(xMax - xMin).toFixed(1)} px sur ${(yMax - yMin).toFixed(1)} px`);
        }
      });
    }
    return trouves;
  });
  expect(recouvrements, "le décor du parchemin ne recouvre pas son texte").toEqual([]);
});

// --- Ce que lisent les lecteurs d'écran

const REGIONS_VIVANTES = '[aria-live]:not([aria-live="off"]),[role="status"],[role="alert"],[role="log"]';

function texteDuSnapshot(snapshot: string): string {
  return normaliser(
    snapshot
      .split("\n")
      .map((ligne) => ligne.replace(/^\s*-\s*[a-z]+(?:\s+"[^"]*")?(?:\s*\[[^\]]*\])*:?\s*/i, ""))
      .join(" ")
      .replace(/["\\]/g, ""),
  );
}

Then(/^les lecteurs d'écran lisent tout le texte, sans décrire le dessin du parchemin$/, async ({ page }) => {
  const genre = await genreAffiche(page);
  const unites = await lesUnites(page, genre);
  expect(unites, "toutes les phrases ou tous les vers sont dans la page").toHaveLength(6);
  for (const unite of unites) expect(unite.lisible, `« ${unite.texte} » est lisible par un lecteur d'écran (ni caché, ni aria-hidden)`).toBe(true);
  const parchemin = page.getByTestId("parchemin");
  const dessins = parchemin.getByTestId("dessin-du-parchemin");
  expect(await dessins.count(), "le parchemin a son dessin").toBeGreaterThan(0);
  for (const dessin of await dessins.all()) await expect(dessin).toHaveAttribute("aria-hidden", "true");
  const arbre = await parchemin.ariaSnapshot();
  const lu = texteDuSnapshot(arbre);
  for (const unite of unites) expect(lu, `le lecteur d'écran lit « ${unite.texte} »`).toContain(unite.texte);
  expect(arbre, "ce que lisent les lecteurs d'écran").not.toMatch(/img|image|dessin|univers|parchemin|décor|dévoil|rouleau/i);
});

Then(/^les lecteurs d'écran n'annoncent aucun dévoilement$/, async ({ page }) => {
  const parchemin = page.getByTestId("parchemin");
  const regions = await parchemin.evaluate((element, selecteur) => ({
    autour: element.closest(selecteur) !== null,
    dedans: element.querySelector(selecteur) !== null,
  }), REGIONS_VIVANTES);
  expect(regions.autour, "le parchemin n'est pas dans une région qui s'annonce (aria-live, status, alert, log)").toBe(false);
  expect(regions.dedans, "le parchemin ne contient aucune région qui s'annonce").toBe(false);
  const textes = [...(await lesUnites(page, "phrase")), ...(await lesUnites(page, "vers"))].map((unite) => unite.texte);
  const { annonces } = await lireLeJournal(page);
  for (const annonce of annonces) {
    for (const texte of textes) expect(annonce, "une région qui s'annonce a redit un texte du parchemin").not.toContain(texte);
  }
});

// --- La place du texte entier est gardée

Then(
  /^le parchemin a, dès (?:la première phrase|le premier vers), la hauteur qu'il a une fois tout le texte visible$/,
  async ({ page }) => {
    await expect.poll(async () => (await lireLeJournal(page)).series.some((s) => s.oui > 0 && s.oui < s.total), {
      message: "le déroulement a été observé (au moins un état à moitié dévoilé)",
    }).toBe(true);
    const depuisLePremier = (await lireLeJournal(page)).series.filter((s) => s.oui > 0);
    const hauteurs = depuisLePremier.map((s) => s.hauteur);
    expect(Math.max(...hauteurs) - Math.min(...hauteurs), `hauteurs du parchemin vues : ${[...new Set(hauteurs)].join(", ")}`).toBeLessThanOrEqual(1);
  },
);

Then(/^« (J'ai écouté|Réécouter) » ne bouge pas pendant que (?:le texte|la poésie) se déroule$/, async ({ page }, bouton: string) => {
  const depuisLePremier = (await lireLeJournal(page)).series.filter((s) => s.oui > 0 && s.boutons[bouton] !== undefined);
  expect(depuisLePremier.length, `« ${bouton} » a été vu pendant le déroulement`).toBeGreaterThan(0);
  const positions = depuisLePremier.map((s) => s.boutons[bouton] as Point);
  const bouge = (cle: "x" | "y") => Math.max(...positions.map((p) => p[cle])) - Math.min(...positions.map((p) => p[cle]));
  expect(bouge("y"), `« ${bouton} » descend ou monte (y)`).toBeLessThanOrEqual(1);
  expect(bouge("x"), `« ${bouton} » se décale (x)`).toBeLessThanOrEqual(1);
});

// --- Mode dys

Then(/^Léa voit le texte en mode dys : .+$/, async ({ page }) => {
  const texte = page.getByTestId("texte-de-lecture");
  await verifierModeDys(page, [texte.locator("p"), texte.getByTestId("phrase").first(), texte.locator("[data-mot]").first()], true);
});

// --- Les étoiles, comme avant

When(
  /^Léa répond aux questions du texte, (?:sans erreur|en se trompant une fois à « ([^«»]+) »)$/,
  async ({ page }, ratee: string | null | undefined) => {
    await demarrer(page);
    for (const question of questionsDeLaSeance(page)) {
      if (ratee != null && question.enonce === ratee) {
        const fausse = question.choix.find((choix) => choix !== question.reponse);
        if (fausse === undefined) throw new Error(`Aucun mauvais choix à « ${question.enonce} »`);
        await repondre(page, fausse);
      }
      await repondre(page, question.reponse);
    }
  },
);

// --- La séance de révision

function aujourdhui(): { jour: string; hier: Date } {
  const maintenant = new Date();
  const deux = (n: number) => String(n).padStart(2, "0");
  return {
    jour: `${maintenant.getFullYear()}-${deux(maintenant.getMonth() + 1)}-${deux(maintenant.getDate())}`,
    hier: new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() - 1, 9),
  };
}

Given(
  /^Léa a pour question retenue la question « ([^«»]+) » de l'exercice « ([^«»]+) », due aujourd'hui$/,
  async ({ famille, page }, enonce: string, titreDeLExercice: string) => {
    const lecon = leconDeTitre(page, LECON_DU_TEXTE);
    const position = positionDeLExercice(lecon, titreDeLExercice);
    const exercice = lecon.exercices[position] as { questions: Array<{ question: string; reponse: string }> };
    const question = exercice.questions.find((candidate) => candidate.question === enonce);
    if (question === undefined) throw new Error(`L'exercice « ${titreDeLExercice} » ne pose pas la question « ${enonce} »`);
    // La clé de la question est celle du domaine (cleDUneQuestionALire) : « l: », la question suivie de sa réponse, normalisée.
    const cle = `l:${(question.question + question.reponse).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim()}`;
    const { jour, hier } = aujourdhui();
    await ecrireLaFileDeRevision(profilDe(famille, "Léa").id, [{
      cle,
      leconDOrigine: lecon.id,
      position,
      type: "lecture",
      intervalle: 1,
      dateDeRevision: jour,
      derniereErreurLe: hier.toISOString(),
    }]);
    // La file du serveur n'est lue qu'une fois par profil : on recharge pour qu'elle soit lue avec cette question.
    await rechargerAvecLeProfilReel(page);
  },
);
