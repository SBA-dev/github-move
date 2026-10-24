import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { type Monde, type ProfilPrepare, test } from "./fixtures.ts";
import { bulle, injecter, type LeconBrute, leconDeTest, leconDeTitre } from "./etapes-puis-exercices.steps.ts";
import { avancerJusquAuxChoix, demarrer, etatDesChoix, lancer, questionsReussies } from "./exercices-a-choix.steps.ts";
import { figee, repondreAuNombre } from "./calcul-fluence-addition.steps.ts";
import { cleDe, EXPRESSIONS_PAR_PERSONNAGE, FELICITATIONS_COMMUNES, preparerProfil } from "./univers.steps.ts";
import { journal, normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #21 : boîte à jetons et schéma en barres.
//
// L'enfant joue comme à l'écran : il touche un choix ou tape sur les cristaux. Les bonnes réponses des questions qui
// précèdent celle d'un scénario sont calculées par le test, à partir de la leçon, jamais lues dans l'application.
// Les leçons de test sont ajoutées à la réponse de /bibliotheque.json par le navigateur du test (voir #16).

const { Given, When, Then } = createBdd(test, { tags: "@issue-21" });

type Acteur = "Léa" | "Tom";
type Mecanique = "boite" | "barres";
type Item = Record<string, unknown>;

type Partie21 = {
  acteur: Acteur;
  lecon: LeconBrute | undefined;
  mecanique: Mecanique;
  /** Le rang de la question que le scénario joue, dans l'exercice. */
  rang: number;
  titreDeLExercice: string;
  tomPrepare: boolean;
  /** Une leçon de test n'est injectée qu'au démarrage : son niveau est celui de l'enfant qui la joue. */
  leconDeTest: boolean;
};

const parties = new WeakMap<Page, Partie21>();

function partie21(page: Page): Partie21 {
  let courante = parties.get(page);
  if (!courante) {
    courante = { acteur: "Léa", lecon: undefined, mecanique: "boite", rang: 0, titreDeLExercice: "", tomPrepare: false, leconDeTest: false };
    parties.set(page, courante);
  }
  return courante;
}

const FELICITATIONS_DE_NOISETTE = [...FELICITATIONS_COMMUNES, ...(EXPRESSIONS_PAR_PERSONNAGE["Noisette"] ?? [])];
const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;

// --- Les écrans

const boiteAJetons = (page: Page) => page.getByTestId("boite-a-jetons");
const boite = (page: Page) => page.getByTestId("boite");
const jetons = (page: Page) => page.getByTestId("jeton");
const probleme = (page: Page) => page.getByTestId("probleme-en-barres");
const schema = (page: Page) => page.getByTestId("schema-en-barres");
const barres = (page: Page, role: string) => schema(page).getByTestId("barre").and(page.locator(`[data-role="${role}"]`));
const clavier = (page: Page) => page.getByTestId("clavier-de-cristaux");
const choixDeLaQuestion = (page: Page) => page.getByTestId("choix-de-la-question");

// --- Les bonnes réponses, calculées à partir des items de la leçon

function nombre(item: Item, cle: string): number | null {
  const valeur = item[cle];
  return typeof valeur === "number" ? valeur : null;
}

function reponseDeLaBoite(item: Item): number {
  const [a, b] = [nombre(item, "a") ?? 0, nombre(item, "b") ?? 0];
  return item.op === "+" ? a + b : a - b;
}

function reponseDuProbleme(item: Item): number {
  if (item.type === "comparaison") {
    const [grand, petit, ecart] = [nombre(item, "grand"), nombre(item, "petit"), nombre(item, "ecart")];
    if (grand === null) return (petit ?? 0) + (ecart ?? 0);
    if (petit === null) return grand - (ecart ?? 0);
    return grand - petit;
  }
  if (item.type === "parts") {
    const [nb, valeur, total] = [nombre(item, "nb"), nombre(item, "valeur"), nombre(item, "total")];
    if (total === null) return (nb ?? 0) * (valeur ?? 0);
    if (valeur === null) return total / (nb ?? 1);
    return total / (valeur ?? 1);
  }
  const parties = item.parties as Array<number | null>;
  const tout = nombre(item, "tout");
  if (tout === null) return parties.reduce<number>((somme, partie) => somme + (partie ?? 0), 0);
  return tout - (parties.find((partie) => partie !== null) ?? 0);
}

function reponseDe(mecanique: Mecanique, item: Item): number {
  return mecanique === "boite" ? reponseDeLaBoite(item) : reponseDuProbleme(item);
}

function itemsDe(partie: Partie21): Item[] {
  const exercice = partie.lecon?.exercices.find((e) => e.titre === partie.titreDeLExercice);
  return (exercice?.items ?? []) as Item[];
}

function bonneReponseCourante(page: Page): number {
  const partie = partie21(page);
  const item = itemsDe(partie)[partie.rang];
  if (!item) throw new Error(`Pas de question n°${partie.rang + 1} dans « ${partie.titreDeLExercice} »`);
  return reponseDe(partie.mecanique, item);
}

// --- Préparer une partie

function exerciceDe(lecon: LeconBrute, mecanique: Mecanique): Record<string, unknown> {
  const exercice = lecon.exercices.find((e) => e.type === mecanique);
  if (!exercice) throw new Error(`La leçon « ${lecon.titre} » n'a pas d'exercice ${mecanique}`);
  return exercice;
}

async function preparerTomSiBesoin(page: Page, monde: Monde): Promise<void> {
  const partie = partie21(page);
  if (partie.acteur !== "Tom" || partie.tomPrepare) return;
  partie.tomPrepare = true;
  const prepare: ProfilPrepare = monde.profils.get("Tom") ?? { prenom: "Tom", niveau: "CE1", univers: cleDe("Animaux de la forêt") };
  await preparerProfil(page, prepare);
}

async function repondreJusteAuxQuestionsQuiPrecedent(page: Page): Promise<void> {
  const partie = partie21(page);
  const items = itemsDe(partie);
  for (let rang = 0; rang < partie.rang; rang++) {
    await expect.poll(async () => {
      const prete = (await questionsReussies(page)) === rang
        && (await clavier(page).or(choixDeLaQuestion(page)).isVisible())
        && !(await figee(page));
      if (!prete) await terminerLaLecture(page);
      return prete;
    }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
    await repondreAuNombre(page, reponseDe(partie.mecanique, items[rang] as Item));
    await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
    await expect.poll(async () => {
      const suivante = (await questionsReussies(page)) === rang + 1 && (await bulle(page).getAttribute("data-nature")) === "question";
      if (!suivante) await terminerLaLecture(page);
      return suivante;
    }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
  }
}

/** La séance (cet exercice seulement) commence au premier pas qui en a besoin : l'enfant arrive à la question voulue. */
function preparerLaPartie(page: Page, monde: Monde, lecon: LeconBrute, mecanique: Mecanique, rang: number, deTest = false): void {
  const partie = partie21(page);
  partie.lecon = lecon;
  partie.leconDeTest = deTest;
  partie.mecanique = mecanique;
  partie.rang = rang;
  partie.titreDeLExercice = String(exerciceDe(lecon, mecanique).titre);
  etatDesChoix(page).demarrage = async () => {
    await preparerTomSiBesoin(page, monde);
    if (partie.leconDeTest) {
      partie.lecon = { ...lecon, niveau: partie.acteur === "Tom" ? "CE1" : "CP" };
      await injecter(page, partie.lecon);
    }
    await lancer(page, partie.lecon ?? lecon, partie.titreDeLExercice);
    await repondreJusteAuxQuestionsQuiPrecedent(page);
  };
}

function operationDe(signe: string): string {
  return signe === "+" ? "+" : "-";
}

function rangDeLaBoite(lecon: LeconBrute, a: number, signe: string, b: number): number {
  const rang = (exerciceDe(lecon, "boite").items as Item[]).findIndex(
    (item) => item.a === a && item.op === operationDe(signe) && item.b === b,
  );
  if (rang < 0) throw new Error(`La leçon « ${lecon.titre} » n'a pas la boîte « ${a} ${signe} ${b} »`);
  return rang;
}

function rangDuProbleme(lecon: LeconBrute, enonce: string): number {
  const rang = (exerciceDe(lecon, "barres").items as Item[]).findIndex((item) => item.enonce === enonce);
  if (rang < 0) throw new Error(`La leçon « ${lecon.titre} » n'a pas le problème « ${enonce} »`);
  return rang;
}

// --- Attendre que Noisette dise ce qu'on attend, sans couper la parole attendue

/** La bulle de Noisette dit ce texte : on laisse finir ce qui précède, jamais la parole attendue (vérifié et terminé dans le même appel). */
async function attendreQueLaBulleDise(page: Page, texte: string): Promise<void> {
  const attendu = normaliser(texte);
  await expect.poll(async () =>
    await page.evaluate((voulu) => {
      const dit = (document.querySelector('[data-testid="parole"]')?.textContent ?? "").replace(/\s+/g, " ").trim();
      if (dit === voulu) return true;
      const faux = Reflect.get(window, "__faux") as { enonces: Array<{ enonce: { onend: (() => void) | null } }>; actifs: unknown[] };
      faux.actifs = [];
      faux.enonces[faux.enonces.length - 1]?.enonce.onend?.();
      return false;
    }, attendu), { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
}

/** Toutes ces paroles sont dites, dans cet ordre : la dernière reste en cours de lecture. */
async function attendreLesParolesDansLOrdre(page: Page, textes: string[]): Promise<void> {
  const voulues = textes.map(normaliser);
  await expect.poll(async () => {
    const dites = (await toutesLesParoles(page)).map(normaliser);
    let position = -1;
    let trouvees = 0;
    for (const voulue of voulues) {
      const rang = dites.indexOf(voulue, position + 1);
      if (rang < 0) break;
      position = rang;
      trouvees++;
    }
    if (trouvees === voulues.length) return true;
    if (trouvees > 0) await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
}

async function toutesLesParoles(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<{ type: string; texte: string }> };
    return faux.journal.filter((entree) => entree.type === "speak").map((entree) => entree.texte);
  });
}

async function laBoiteEstFermeeEtLEnfantPeutRepondre(page: Page): Promise<void> {
  await expect.poll(async () => {
    const prete = (await boite(page).getAttribute("data-etat")) === "fermee" && (await clavier(page).or(choixDeLaQuestion(page)).isVisible());
    if (!prete) await terminerLaLecture(page);
    return prete;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
}

// --- Étant donné : la boîte à jetons

Given(
  /^Léa joue la boîte à jetons « (\d+) ([+−]) (\d+) » de la leçon « ([^«»]+) »$/,
  async ({ page, monde }, a: string, signe: string, b: string, titre: string) => {
    const lecon = leconDeTitre(page, titre);
    preparerLaPartie(page, monde, lecon, "boite", rangDeLaBoite(lecon, Number(a), signe, Number(b)));
  },
);

Given(/^une leçon de test a une boîte à jetons « (\d+) ([+−]) (\d+) »$/, async ({ page, monde }, a: string, signe: string, b: string) => {
  const exercice = { type: "boite", titre: "Boîte de test", items: [{ a: Number(a), op: operationDe(signe), b: Number(b) }] };
  const lecon = leconDeTest("e2e-21-boite", "Leçon de test e2e-21", [exercice]);
  preparerLaPartie(page, monde, lecon, "boite", 0, true);
});

// --- Étant donné : le problème en barres

Given(
  /^Léa joue le problème « ([^«»]+) » de la leçon « ([^«»]+) »$/,
  async ({ page, monde }, enonce: string, titre: string) => {
    const lecon = leconDeTitre(page, titre);
    preparerLaPartie(page, monde, lecon, "barres", rangDuProbleme(lecon, enonce));
  },
);

// --- Quand

When(/^(Léa|Tom) joue cette boîte à jetons et que la boîte est fermée$/, async ({ page }, enfant: string) => {
  partie21(page).acteur = enfant as Acteur;
  await demarrer(page);
  await laBoiteEstFermeeEtLEnfantPeutRepondre(page);
});

When(/^le schéma s'affiche$/, async ({ page }) => {
  await demarrer(page);
  await expect(schema(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
});

When(/^Léa répond faux$/, async ({ page }) => {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  const bonne = bonneReponseCourante(page);
  const avant = (await journal(page)).speaks;
  if (await clavier(page).isVisible()) await repondreAuNombre(page, bonne + 1);
  else {
    const textes = (await page.getByTestId("choix").allTextContents()).map(normaliser);
    const fausse = textes.find((texte) => texte !== String(bonne));
    if (fausse === undefined) throw new Error("Tous les choix sont la bonne réponse");
    await repondreAuNombre(page, fausse);
  }
  await expect.poll(async () => (await journal(page)).speaks, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBeGreaterThan(avant);
});

// --- Alors : la boîte à jetons

Then(/^Noisette dit « ([^«»]+) », puis « ([^«»]+) »$/, async ({ page }, premiere: string, seconde: string) => {
  await attendreLesParolesDansLOrdre(page, [premiere, seconde]);
});

Then(/^Noisette dit ensuite « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await attendreQueLaBulleDise(page, texte);
});

Then(/^Léa ne voit plus les jetons$/, async ({ page }) => {
  await laBoiteEstFermeeEtLEnfantPeutRepondre(page);
  await expect(boite(page)).toHaveAttribute("data-etat", "fermee");
  await expect(jetons(page)).toHaveCount(0);
  await expect(page.getByTestId("jetons")).toHaveCount(0);
});

async function verifierLesJetonsRangesParCinq(page: Page, total: number): Promise<void> {
  await expect(boite(page)).toHaveAttribute("data-etat", "ouverte");
  await expect(page.getByTestId("jetons")).toHaveAttribute("data-nombre", String(total));
  await expect(jetons(page)).toHaveCount(total);
  const rangees = page.getByTestId("rangee-de-jetons");
  await expect(rangees).toHaveCount(Math.ceil(total / 5));
  for (let rang = 0; rang < Math.ceil(total / 5); rang++) {
    const attendus = Math.min(5, total - rang * 5);
    await expect(rangees.nth(rang).getByTestId("jeton")).toHaveCount(attendus);
    await expect(rangees.nth(rang).locator('[data-cinquieme="true"]')).toHaveCount(attendus === 5 ? 1 : 0);
  }
}

Then(/^la boîte s'ouvre et Léa voit (\d+) jetons, rangés par 5$/, async ({ page }, total: string) => {
  await verifierLesJetonsRangesParCinq(page, Number(total));
});

async function verifierQueNoisetteFelicite(page: Page, debut: string): Promise<void> {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.startsWith(`${debut} `), texte).toBe(true);
  expect(FELICITATIONS_DE_NOISETTE).toContain(texte.slice(debut.length + 1));
}

Then(
  /^Noisette dit « (On ouvre la boîte pour vérifier… \d+ jetons ! \d+ [+−] \d+ = \d+\.) », puis une félicitation$/,
  async ({ page }, debut: string) => {
    await verifierQueNoisetteFelicite(page, debut);
  },
);

/** Ce que la voix prononce : « + » se lit « plus » et « = » se lit « égale » (story #7). */
function prononce(texte: string): string {
  return normaliser(texte.replace(/\+/g, " plus ").replace(/=/g, " égale "));
}

Then(/^Noisette dit une félicitation, suivie de « (.+) »$/, async ({ page }, explication: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.endsWith(` ${explication}`), texte).toBe(true);
  expect(FELICITATIONS_DE_NOISETTE).toContain(texte.slice(0, texte.length - explication.length - 1));
  const sansEspace = (t: string) => t.replace(/[\s,]+/g, "");
  await expect.poll(async () => {
    const dites = (await toutesLesParoles(page)).join("");
    if (sansEspace(dites).includes(sansEspace(prononce(texte)))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Then(/^la boîte reste fermée$/, async ({ page }) => {
  await expect(boite(page)).toHaveAttribute("data-etat", "fermee");
  await expect(jetons(page)).toHaveCount(0);
  expect(await questionsReussies(page)).toBe(partie21(page).rang);
});

// --- Alors : au CP une réponse de 20 au plus se donne par choix, sinon au clavier de cristaux

async function repondreJuste(page: Page): Promise<void> {
  const bonne = bonneReponseCourante(page);
  await repondreAuNombre(page, bonne);
  await expect(boite(page)).toHaveAttribute("data-etat", "ouverte");
  await expect(page.getByTestId("jetons")).toHaveAttribute("data-nombre", String(bonne));
}

Then(/^(Léa|Tom) répond avec les choix (.+)$/, async ({ page }, _enfant: string, liste: string) => {
  const attendus = [...liste.matchAll(/« ([^«»]+) »/g)].map((trouve) => trouve[1] as string);
  await expect(boiteAJetons(page)).toHaveAttribute("data-mode", "choix");
  await expect(clavier(page)).toHaveCount(0);
  await expect(page.getByTestId("choix")).toHaveCount(attendus.length);
  expect((await page.getByTestId("choix").allTextContents()).map(normaliser).sort()).toEqual([...attendus].sort());
  await repondreJuste(page);
});

Then(/^(Léa|Tom) répond au clavier de cristaux$/, async ({ page }, _enfant: string) => {
  await expect(boiteAJetons(page)).toHaveAttribute("data-mode", "clavierDeCristaux");
  await expect(clavier(page)).toBeVisible();
  await expect(choixDeLaQuestion(page)).toHaveCount(0);
  await expect(page.getByTestId("choix")).toHaveCount(0);
  await repondreJuste(page);
});

// --- Alors : le schéma en barres

Then(/^Léa entend Noisette lire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  const voulu = normaliser(texte);
  await expect.poll(async () => {
    const lue = (await journal(page)).lecture.texte;
    if (lue === voulu) return true;
    if (lue !== "") await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
  await expect(page.getByTestId("enonce-du-probleme")).toHaveText(voulu);
});

Then(/^Léa voit deux barres de (\d+) et de (\d+), et au-dessus le tout, marqué « \? »$/, async ({ page }, premiere: string, seconde: string) => {
  await expect(probleme(page)).toBeVisible();
  const parties = barres(page, "partie");
  await expect(parties).toHaveCount(2);
  expect(await parties.evaluateAll((barresDeLEcran) => barresDeLEcran.map((barre) => barre.getAttribute("data-valeur")))).toEqual([String(premiere), String(seconde)]);
  const tout = barres(page, "tout");
  await expect(tout).toHaveCount(1);
  await expect(tout).toHaveAttribute("data-valeur", "?");
  await expect(tout.getByTestId("valeur-cherchee")).toHaveText("?");
  const [haut, bas] = [await tout.boundingBox(), await parties.first().boundingBox()];
  expect(haut).not.toBeNull();
  expect(bas).not.toBeNull();
  expect((haut?.y ?? 0) + (haut?.height ?? 0)).toBeLessThanOrEqual(bas?.y ?? 0);
});

Then(/^le « \? » du schéma est remplacé par (\d+)$/, async ({ page }, reponse: string) => {
  await expect(schema(page)).toHaveAttribute("data-resolu", "true");
  await expect(page.getByTestId("valeur-cherchee")).toHaveCount(0);
  await expect(schema(page).locator('[data-valeur="?"]')).toHaveCount(0);
  await expect(schema(page)).not.toHaveAttribute("aria-label", /\?/);
  await expect(schema(page)).toHaveAttribute("aria-label", new RegExp(`\\b${reponse}\\b`));
  // La valeur trouvée s'écrit sur sa barre ; quand on cherchait le nombre de parts, ce sont les parts dessinées qui la montrent.
  const surUneBarre = await schema(page).locator(`[data-valeur="${reponse}"]`).filter({ hasText: String(reponse) }).count();
  const parts = await barres(page, "part").count();
  expect(surUneBarre > 0 || parts === Number(reponse), `${surUneBarre} barre(s) à ${reponse}, ${parts} part(s)`).toBe(true);
});

Then(/^les lecteurs d'écran lisent « ([^«»]+) »$/, async ({ page }, description: string) => {
  await expect(schema(page)).toHaveAttribute("role", "img");
  await expect(schema(page)).toHaveAttribute("aria-label", new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

// --- Alors : sans mouvement, sur un écran de 360 px

Then(/^Léa voit la boîte ouverte et ses (\d+) jetons, sans mouvement$/, async ({ page }, total: string) => {
  await expect(boiteAJetons(page)).toHaveAttribute("data-mouvements-reduits", "true");
  await verifierLesJetonsRangesParCinq(page, Number(total));
  for (const element of [boite(page), jetons(page).first()]) {
    await expect(element).toHaveCSS("animation-name", "none");
    await expect(element).toHaveCSS("transition-duration", "0s");
  }
  const couvercle = await boite(page).evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return { transition: style.transitionDuration, animation: style.animationName };
  });
  expect(couvercle).toEqual({ transition: "0s", animation: "none" });
});

Then(/^les barres du schéma restent proportionnelles aux nombres (\d+) et (\d+)$/, async ({ page }, petit: string, grand: string) => {
  const [largeurDuGrand, largeurDuPetit] = [await largeurDe(barres(page, "grand")), await largeurDe(barres(page, "petit"))];
  expect(largeurDuGrand).toBeGreaterThan(0);
  expect(largeurDuPetit / largeurDuGrand).toBeCloseTo(Number(petit) / Number(grand), 1);
  expect(Math.abs(largeurDuPetit / largeurDuGrand - Number(petit) / Number(grand))).toBeLessThan(0.02);
});

async function largeurDe(barre: Locator): Promise<number> {
  await expect(barre).toHaveCount(1);
  const boiteDeLaBarre = await barre.boundingBox();
  expect(boiteDeLaBarre).not.toBeNull();
  return boiteDeLaBarre?.width ?? 0;
}

// --- Pour #23 : « Je ne sais pas » proposé dans une boîte ou un problème en barres

const BOITE_DE_TEST = { a: 4, op: "+", b: 3 };
const PROBLEME_DE_TEST = { enonce: "Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ?", parties: [4, 2], tout: null };

/** L'enfant commence un exercice de ce type, dans une leçon de test (niveau CP pour Léa, CE1 pour Tom). */
export async function commencerUneQuestionIllustreeDeTest(
  page: Page,
  monde: Monde,
  mecanique: Mecanique,
  enfant: Acteur,
): Promise<void> {
  partie21(page).acteur = enfant;
  const exercice = mecanique === "boite"
    ? { type: "boite", titre: "Boîte de test", items: [BOITE_DE_TEST] }
    : { type: "barres", titre: "Problème de test", items: [PROBLEME_DE_TEST] };
  const lecon = leconDeTest(`e2e-21-${mecanique}-de-test`, `Leçon de test ${mecanique}`, [exercice]);
  preparerLaPartie(page, monde, lecon, mecanique, 0, true);
  await demarrer(page);
  await expect(boiteAJetons(page).or(probleme(page))).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
}

export async function uneQuestionIllustreeEstAffichee(page: Page): Promise<boolean> {
  return await boiteAJetons(page).or(probleme(page)).isVisible();
}

/** Laisse Noisette finir de poser la question, jusqu'à ce que l'enfant puisse répondre. */
export async function attendreQueLEnfantPuisseRepondreALaQuestionIllustree(page: Page): Promise<void> {
  await expect.poll(async () => {
    const prete = await clavier(page).or(choixDeLaQuestion(page)).isVisible();
    if (!prete) await terminerLaLecture(page);
    return prete;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
}
