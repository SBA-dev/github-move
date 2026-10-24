import { expect, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import { bulle, entendu, injecter, leconCourante, leconDeTest, recipient, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { avancerJusquAuxChoix, demarrageDeLExercice, demarrer, etatDesChoix, leconDeLExercice, textesDesChoix } from "./exercices-a-choix.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { journal, laisserPasserLeDelaiDeLecture, normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #22 : mémoriser une poésie ou une chanson. Le personnage guide dit la poésie vers par vers, Léa dit qu'elle est
// prête, puis elle remet les vers dans l'ordre (étiquettes de l'exercice ordre) et retrouve les mots cachés (trous).
// La voix est la fausse synthèse de voix.steps.ts : une lecture ne finit que quand le test la termine.

type ObservationDUnVers = {
  /** Texte lu à voix haute pendant que ce vers est le vers lu de l'écran. */
  lu: string;
  /** Rangs des vers mis en avant (data-lu et aria-current) à ce moment. */
  misEnAvant: number[];
  mots: string[];
  /** Mot surligné après que la voix a prononcé le mot de même rang. */
  surlignes: string[];
};

const observations = new WeakMap<Page, ObservationDUnVers[]>();

// --- Lire les données de la poésie jouée

function poesieJouee(page: Page): { titre: string; vers: string[] } {
  const exercice = leconCourante(page).exercices.find((candidat) => candidat.type === "memoriser");
  if (!exercice) throw new Error("La leçon ouverte n'a pas d'exercice memoriser");
  return { titre: exercice.titre as string, vers: exercice.vers as string[] };
}

const MOTS = /[\p{L}'’-]+/gu;
const ELISION = /^(?:qu|\p{L})['’]/iu;

/** Le plus long mot d'au moins 3 lettres, le premier à égalité, sans l'article élidé (Q61). */
function motCacheDe(vers: string): { mot: string; debut: number } | undefined {
  let plusLong: { mot: string; debut: number } | undefined;
  for (const brut of vers.matchAll(MOTS)) {
    const mot = brut[0].replace(ELISION, "");
    const debut = (brut.index ?? 0) + brut[0].length - mot.length;
    if (mot.length >= 3 && mot.length > (plusLong?.mot.length ?? 0)) plusLong = { mot, debut };
  }
  return plusLong;
}

function versATrou(vers: string): string {
  const cache = motCacheDe(vers);
  return cache ? `${vers.slice(0, cache.debut)}…${vers.slice(cache.debut + cache.mot.length)}` : vers;
}

function motsDe(vers: readonly string[]): string[] {
  return vers.flatMap((unVers) => [...unVers.matchAll(MOTS)].map((brut) => brut[0].replace(ELISION, "")).filter((mot) => mot.length >= 3));
}

function motsCachesDe(vers: readonly string[]): string[] {
  return vers.flatMap((unVers) => motCacheDe(unVers)?.mot ?? []);
}

function citations(liste: string): string[] {
  return [...liste.matchAll(/«\s*([^«»]+?)\s*»/g)].flatMap((m) => (m[1] === undefined ? [] : [m[1]]));
}

// --- Les écrans

function poesie(page: Page) {
  return page.getByTestId("poesie");
}

function versALire(page: Page) {
  return page.getByTestId("vers");
}

function etiquettesDeVers(page: Page) {
  return page.getByTestId("etiquettes-a-placer");
}

function etiquetteDeVers(page: Page, vers: string) {
  return etiquettesDeVers(page).getByRole("button", { name: vers, exact: true });
}

function placesRemplies(page: Page) {
  return page.locator('[data-testid="place"][data-remplie="true"]');
}

function texteATrous(page: Page) {
  return page.getByTestId("texte-a-trous");
}

// --- Lire la poésie : on termine la lecture en cours jusqu'à ce que ce qu'on attend soit là

/**
 * Vrai si le vers de ce rang est celui qui est lu (mis en avant, et dit en entier par la voix). Sinon, la lecture en cours
 * est terminée dans le même appel au navigateur : on ne coupe jamais la parole qu'on observe.
 */
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

async function prononcerLeMot(page: Page, rangDuMot: number) {
  await page.evaluate((rangDuMotAPrononcer) => {
    const faux = Reflect.get(window, "__faux") as {
      enonces: Array<{ lot: number; enonce: { text: string; onboundary: ((e: { name: string; charIndex: number }) => void) | null } }>;
      lot: number;
    };
    let motsAvant = 0;
    for (const { lot, enonce } of faux.enonces) {
      if (lot !== faux.lot) continue;
      const debuts = [...enonce.text.matchAll(/\S+/g)].map((m) => m.index);
      if (rangDuMotAPrononcer < motsAvant + debuts.length) {
        enonce.onboundary?.({ name: "word", charIndex: debuts[rangDuMotAPrononcer - motsAvant] ?? 0 });
        return;
      }
      motsAvant += debuts.length;
    }
  }, rangDuMot);
}

async function observerLeVersLu(page: Page, rang: number): Promise<ObservationDUnVers> {
  const vers = versALire(page);
  const misEnAvant: number[] = [];
  for (let i = 0; i < (await vers.count()); i++) {
    const enAvant = (await vers.nth(i).getAttribute("data-lu")) === "true" && (await vers.nth(i).getAttribute("aria-current")) === "true";
    if (enAvant) misEnAvant.push(i);
  }
  const mots = (await vers.nth(rang).locator("[data-mot]").allTextContents()).map((mot) => mot.trim());
  const surlignes: string[] = [];
  for (let rangDuMot = 0; rangDuMot < mots.length; rangDuMot++) {
    await prononcerLeMot(page, rangDuMot);
    const surligne = vers.nth(rang).locator("[data-prononce='true']");
    await surligne.first().waitFor({ timeout: 2_000 }).catch(() => undefined);
    surlignes.push((await surligne.allTextContents()).map((mot) => mot.trim()).join("|"));
  }
  const { lecture } = await journal(page);
  return { lu: lecture.texte, misEnAvant, mots, surlignes };
}

/** Noisette lit la poésie jusqu'au dernier vers : l'annonce et chaque vers sont terminés un à un. */
async function lireLaPoesieVersParVers(page: Page) {
  await demarrer(page);
  await expect(poesie(page)).toBeVisible();
  const { vers } = poesieJouee(page);
  const vus: ObservationDUnVers[] = [];
  for (const [rang, unVers] of vers.entries()) {
    await expect.poll(() => leVersEstLuSinonTermine(page, rang, entendu(unVers)), { intervals: [100], timeout: 20_000 }).toBe(true);
    vus.push(await observerLeVersLu(page, rang));
  }
  observations.set(page, vus);
  await terminerLaLecture(page);
  await expect(poesie(page)).toHaveAttribute("data-temps", "redire");
}

/** Sans rien observer : on laisse Noisette dire l'annonce et tous les vers. */
async function laisserLireTousLesVers(page: Page) {
  await demarrer(page);
  await expect(poesie(page)).toBeVisible();
  await expect.poll(async () => {
    if ((await poesie(page).getAttribute("data-temps")) === "redire") return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 25_000 }).toBe(true);
}

async function direQueLEnfantEstPrete(page: Page) {
  await page.getByTestId("je-suis-pret").click();
  await expect(poesie(page)).toHaveAttribute("data-temps", "entrainement");
}

async function entrerDansLOrdreDesVers(page: Page) {
  await laisserLireTousLesVers(page);
  await direQueLEnfantEstPrete(page);
  await expect(etiquettesDeVers(page)).toBeVisible();
}

async function poserLeVers(page: Page, vers: string, quelle: "premier" | "dernier" = "premier") {
  const etiquettes = etiquetteDeVers(page, vers);
  await (quelle === "premier" ? etiquettes.first() : etiquettes.last()).click();
}

async function poserLesVersDansLOrdre(page: Page, vers: readonly string[]) {
  for (const [rang, unVers] of vers.entries()) {
    await poserLeVers(page, unVers);
    if (rang < vers.length - 1) await expect(placesRemplies(page)).toHaveCount(rang + 1);
  }
}

async function remettreTousLesVersDansLOrdre(page: Page) {
  await entrerDansLOrdreDesVers(page);
  await poserLesVersDansLOrdre(page, poesieJouee(page).vers);
  await expect(texteATrous(page)).toBeVisible({ timeout: 10_000 });
}

// --- Poésies de test

function poesieDeTest(page: Page, vers: string[]) {
  const titre = "Poème de test";
  const lecon = leconDeTest(`test-poesie-${vers.length}-${vers[0]?.length ?? 0}`, "Leçon de test d'une poésie", [
    { type: "memoriser", titre, auteur: "Auteur de test", vers },
  ]);
  return injecter(page, lecon).then(() => {
    etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, titre);
  });
}

Given(/^une poésie de test a les vers (.+)$/, async ({ page }, liste: string) => {
  await poesieDeTest(page, citations(liste));
});

// --- Étant donné

Given(/^Noisette a lu tous les vers de « ([^«»]+) »$/, async ({ page }, exercice: string) => {
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, leconDeLExercice(page, exercice), exercice);
  await laisserLireTousLesVers(page);
});

Given(/^Léa remet dans l'ordre les vers de « ([^«»]+) »$/, async ({ page }, exercice: string) => {
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, leconDeLExercice(page, exercice), exercice);
  await entrerDansLOrdreDesVers(page);
});

Given(/^Léa a remis dans l'ordre les vers de « ([^«»]+) »$/, async ({ page }, exercice: string) => {
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, leconDeLExercice(page, exercice), exercice);
  await remettreTousLesVersDansLOrdre(page);
});

Given(/^Léa retrouve les mots cachés de « ([^«»]+) »$/, async ({ page }, exercice: string) => {
  etatDesChoix(page).demarrage = demarrageDeLExercice(page, leconDeLExercice(page, exercice), exercice);
  await remettreTousLesVersDansLOrdre(page);
});

Given(/^Léa a remis ces vers dans l'ordre$/, async ({ page }) => {
  await remettreTousLesVersDansLOrdre(page);
});

Given(/^Léa a remis en place les deux premiers vers$/, async ({ page }) => {
  await entrerDansLOrdreDesVers(page);
  const [premier, second] = poesieJouee(page).vers;
  await poserLeVers(page, premier ?? "");
  await expect(placesRemplies(page)).toHaveCount(1);
  await poserLeVers(page, second ?? "");
  await expect(placesRemplies(page)).toHaveCount(2);
});

// --- Quand

When(/^Noisette lit la poésie vers par vers$/, async ({ page }) => {
  await lireLaPoesieVersParVers(page);
});

When(/^Noisette a (?:lu|fini de lire) le dernier vers$/, async ({ page }) => {
  await laisserLireTousLesVers(page);
});

When(/^Léa dit qu'elle est prête$/, async ({ page }) => {
  await demarrer(page);
  await direQueLEnfantEstPrete(page);
});

When(/^Léa pose le vers « ([^«»]+) » en premier$/, async ({ page }, vers: string) => {
  await poserLeVers(page, vers);
});

When(/^Léa pose l'un ou l'autre des deux vers « ([^«»]+) »$/, async ({ page }, vers: string) => {
  await expect(etiquetteDeVers(page, vers)).toHaveCount(2);
  await poserLeVers(page, vers, "dernier");
});

When(/^l'entraînement des mots cachés commence$/, async ({ page }) => {
  await expect(texteATrous(page)).toBeVisible({ timeout: 10_000 });
});

When(/^le trou du premier vers est mis en avant$/, async ({ page }) => {
  await expect(texteATrous(page)).toBeVisible({ timeout: 10_000 });
  const premier = page.getByTestId("trou").first();
  await expect(premier).toHaveAttribute("data-etat", "en-cours");
  await expect(premier).toHaveAttribute("aria-current", "true");
});

// --- Alors : l'écoute

Then(/^Léa voit les (\d+) vers, un par ligne$/, async ({ page }, nombre: string) => {
  const { vers } = poesieJouee(page);
  expect(vers).toHaveLength(Number(nombre));
  const liste = page.getByRole("list", { name: "Vers de la poésie" });
  await expect(liste.getByRole("listitem")).toHaveCount(Number(nombre));
  await expect(liste.getByRole("listitem")).toHaveText(vers);
  const hauteurs: number[] = [];
  for (const unVers of await versALire(page).all()) hauteurs.push((await unVers.boundingBox())?.y ?? Number.NaN);
  hauteurs.forEach((y, rang) => {
    if (rang > 0) expect(y, `le vers ${rang + 1} est sous le précédent`).toBeGreaterThan(hauteurs[rang - 1] ?? Number.POSITIVE_INFINITY);
  });
});

Then(/^Léa entend les (\d+) vers dans l'ordre, de « ([^«»]+) » à « ([^«»]+) »$/, async ({ page }, nombre: string, premier: string, dernier: string) => {
  const { vers } = poesieJouee(page);
  expect(vers).toHaveLength(Number(nombre));
  expect(vers[0]).toBe(premier);
  expect(vers[vers.length - 1]).toBe(dernier);
  const attendus = vers.map(normaliser);
  const dits = (await toutesLesParoles(page)).map(normaliser).filter((parole) => attendus.includes(parole));
  expect(dits).toEqual(attendus);
});

Then(/^chaque vers est mis en avant pendant que Noisette le lit$/, async ({ page }) => {
  const { vers } = poesieJouee(page);
  const vus = observations.get(page) ?? [];
  expect(vus).toHaveLength(vers.length);
  for (const [rang, observation] of vus.entries()) {
    expect(observation.misEnAvant, `seul le vers ${rang + 1} est mis en avant`).toEqual([rang]);
    expect(observation.lu).toBe(normaliser(vers[rang] ?? ""));
  }
});

Then(/^chaque mot est surligné au moment où Noisette le prononce$/, async ({ page }) => {
  const vus = observations.get(page) ?? [];
  expect(vus.length).toBeGreaterThan(0);
  for (const [rang, observation] of vus.entries()) {
    expect(observation.mots.length, `mots du vers ${rang + 1}`).toBeGreaterThan(0);
    expect(observation.surlignes, `mots surlignés du vers ${rang + 1}`).toEqual(observation.mots);
  }
});

// --- Alors : redire seul

Then(/^Léa peut dire qu'elle est prête$/, async ({ page }) => {
  await expect(page.getByTestId("je-suis-pret")).toBeVisible();
  await expect(page.getByRole("button", { name: "Je suis prêt", exact: true })).toBeVisible();
});

Then(/^l'entraînement n'a pas commencé$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  await expect(poesie(page)).toHaveAttribute("data-temps", "redire");
  await expect(etiquettesDeVers(page)).toHaveCount(0);
  await expect(texteATrous(page)).toHaveCount(0);
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", "0");
});

// --- Alors : ordre des vers

Then(/^Léa voit les (\d+) vers mélangés, à poser$/, async ({ page }, nombre: string) => {
  const { vers } = poesieJouee(page);
  expect(vers).toHaveLength(Number(nombre));
  const etiquettes = page.getByTestId("etiquette");
  await expect(etiquettes).toHaveCount(Number(nombre));
  expect([...(await etiquettes.allTextContents()).map((texte) => texte.trim())].sort()).toEqual([...vers].sort());
  await expect(placesRemplies(page)).toHaveCount(0);
});

Then(/^le vers revient parmi les vers à poser$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
  await expect(page.getByTestId("etiquette")).toHaveCount(poesieJouee(page).vers.length);
  await expect(placesRemplies(page)).toHaveCount(0);
});

Then(/^le vers prend la troisième place$/, async ({ page }) => {
  const place = page.getByTestId("place").nth(2);
  await expect(place).toHaveAttribute("data-remplie", "true");
  await expect(place).toHaveText("Picoti, picota");
});

// --- Alors : mots cachés

Then(/^Léa voit les vers joints par « \/ », avec un trou dans chaque vers$/, async ({ page }) => {
  const { vers } = poesieJouee(page);
  await expect(texteATrous(page)).toHaveText(vers.map(versATrou).join(" / "));
  await expect(page.getByTestId("trou")).toHaveCount(vers.length);
});

Then(/^le vers « ([^«»]+) » devient « ([^«»]+) »$/, async ({ page }, vers: string, versAvecTrou: string) => {
  expect(poesieJouee(page).vers).toContain(vers);
  await expect(texteATrous(page)).toContainText(versAvecTrou);
});

Then(/^il propose « ([^«»]+) » et deux autres mots cachés de la chanson$/, async ({ page }, attendu: string) => {
  await avancerJusquAuxChoix(page);
  const choix = await textesDesChoix(page);
  expect(choix).toHaveLength(3);
  expect(new Set(choix).size).toBe(3);
  expect(choix).toContain(attendu);
  const caches = motsCachesDe(poesieJouee(page).vers);
  for (const mot of choix) expect(caches, `« ${mot} » est un mot caché de la chanson`).toContain(mot);
});

Then(/^il propose « ([^«»]+) » et deux autres mots de la poésie$/, async ({ page }, attendu: string) => {
  await avancerJusquAuxChoix(page);
  const choix = await textesDesChoix(page);
  expect(choix).toHaveLength(3);
  expect(new Set(choix).size).toBe(3);
  expect(choix).toContain(attendu);
  const mots = motsDe(poesieJouee(page).vers);
  for (const mot of choix) expect(mots, `« ${mot} » est un mot de la poésie`).toContain(mot);
});

Then(/^le vers « ([^«»]+) » n'a pas de trou$/, async ({ page }, vers: string) => {
  const poesieDeTestJouee = poesieJouee(page).vers;
  expect(poesieDeTestJouee).toContain(vers);
  expect(motCacheDe(vers)).toBeUndefined();
  await expect(texteATrous(page)).toHaveText(poesieDeTestJouee.map(versATrou).join(" / "));
  await expect(page.getByTestId("trou")).toHaveCount(motsCachesDe(poesieDeTestJouee).length);
});

Then(/^l'avancement de la séance compte ce vers comme réussi$/, async ({ page }) => {
  const { vers } = poesieJouee(page);
  await expect(recipient(page)).toHaveAttribute("data-total", String(vers.length * 2));
  await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(vers.length + (vers.length - motsCachesDe(vers).length)));
});

// --- Alors : mode dys

Then(/^Léa voit les vers en mode dys : .+$/, async ({ page }) => {
  await expect(versALire(page).first()).toBeVisible();
  await verifierModeDys(page, await versALire(page).all(), true);
});
