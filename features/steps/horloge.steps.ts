import { expect, type Locator, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { LECONS_DE_L_HORLOGE, leconDHorlogeDeTest, servirLaBibliothequeDeLHorloge } from "../support/bibliotheque-de-l-horloge.ts";
import { HeureDeLHorloge, Niveau, PrecisionDeLHeure } from "../../supabase/functions/_shared/catalogue/domain/index.ts";
import { heuresProposees } from "../../supabase/functions/_shared/apprentissage/domain/choix-d-heures.ts";
import { ecrireLaFileDeRevision } from "../support/revision-api.ts";
import type { Famille } from "../support/famille.ts";
import { avancerJusquAuxChoix, bulleDeChoix, demarrer, etatDesChoix, finirLaParoleJusqua, lancer, questionsReussies, repondre, textesDesChoix, textesDesChoixPossibles } from "./exercices-a-choix.steps.ts";
import { type LeconBrute, etat, entendu, leconDeTitre, recipient } from "./etapes-puis-exercices.steps.ts";
import { type Monde, test } from "./fixtures.ts";
import { estSurUnProfilReel, jouerAvecLeProfilReel, rechargerAvecLeProfilReel } from "./profil-reel.ts";
import { profilDe } from "./profils-enfants.steps.ts";
import { cleDe, preparerProfil } from "./univers.steps.ts";
import { journal, laisserPasserLeDelaiDeLecture, normaliser, terminerLaLecture } from "./voix.steps.ts";
import { toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";

// Story #190 : exercice « horloge », mode lire. La bibliothèque de test (identifiants « e2e-190- ») remplace celle de
// l'application dans le navigateur (features/support/bibliotheque-de-l-horloge.ts).
//
// Les repères du DOM lus par ces étapes : data-testid « exercice-horloge » (data-mode = choix | clavierDeCristaux), « horloge »
// (svg, aria-label), « petite-aiguille » et « grande-aiguille » (attribut transform = rotate(<angle> 100 100)),
// « affichage-digital », « choix-de-la-question » et « choix », « clavier-de-cristaux », « champ-heures », « champ-minutes »,
// « champ-secondes », « heure-impossible », « je-ne-sais-pas ». L'heure montrée se lit sur les angles des aiguilles, jamais dans un texte.

const { Given, When, Then } = createBdd(test, { tags: "@issue-190" });

type Acteur = "Léa" | "Tom";
type ItemDeTest = { heure: string; moment?: string; aide?: string };

type PartieHorloge = {
  lecon: LeconBrute | undefined;
  position: number | undefined;
  acteur: Acteur;
  tomPrepare: boolean;
  dernierChoixTouche: string | undefined;
};

const parties = new WeakMap<Page, PartieHorloge>();

function partie(page: Page): PartieHorloge {
  let courante = parties.get(page);
  if (!courante) {
    courante = { lecon: undefined, position: undefined, acteur: "Léa", tomPrepare: false, dernierChoixTouche: undefined };
    parties.set(page, courante);
  }
  return courante;
}

/** Vrai quand le scénario en cours joue un exercice horloge préparé par ces étapes. */
export function jouePourLHorloge(page: Page): boolean {
  return partie(page).lecon !== undefined;
}

// --- Heures : écriture « H:MM », « 3 h », « 2 h 15 », angles des aiguilles

type Heure = { heures: number; minutes: number; secondes: number };

function lireUneHeureBrute(brute: string): Heure {
  const [heures, minutes, secondes] = brute.split(":").map(Number);
  return { heures: heures ?? 0, minutes: minutes ?? 0, secondes: secondes ?? 0 };
}

function lireUneHeureEcrite(ecrite: string): Heure {
  const lue = /^(\d+) h(?: (\d+))?(?: min)?(?: (\d+) s)?$/.exec(ecrite.trim());
  if (!lue) throw new Error(`Heure écrite illisible : « ${ecrite} »`);
  return { heures: Number(lue[1]), minutes: Number(lue[2] ?? 0), secondes: Number(lue[3] ?? 0) };
}

function ecriture({ heures, minutes, secondes }: Heure): string {
  if (secondes > 0) return `${heures} h ${minutes} min ${secondes} s`;
  if (minutes > 0) return `${heures} h ${minutes}`;
  return `${heures} h`;
}

function anglesDe({ heures, minutes, secondes }: Heure): { petite: number; grande: number } {
  const minutesSurLeCadran = (heures % 12) * 60 + minutes + secondes / 60;
  return { petite: minutesSurLeCadran * 0.5, grande: (minutesSurLeCadran % 60) * 6 };
}

async function angleDe(page: Page, aiguille: "petite-aiguille" | "grande-aiguille"): Promise<number | undefined> {
  const transform = await page.getByTestId(aiguille).getAttribute("transform", { timeout: 1_000 }).catch(() => null);
  const lu = transform === null ? null : /rotate\(([-\d.]+)/.exec(transform);
  return lu ? Number(lu[1]) : undefined;
}

function proches(a: number | undefined, b: number): boolean {
  if (a === undefined) return false;
  const ecart = Math.abs(a - b) % 360;
  return Math.min(ecart, 360 - ecart) < 0.6;
}

async function horlogeMontre(page: Page, heure: Heure): Promise<boolean> {
  const attendus = anglesDe(heure);
  return proches(await angleDe(page, "petite-aiguille"), attendus.petite) && proches(await angleDe(page, "grande-aiguille"), attendus.grande);
}

/** Laisse l'application finir de parler jusqu'à ce que l'horloge montre cette heure (on ne coupe jamais la parole avant). */
async function attendreQueLHorlogeMontre(page: Page, heure: Heure): Promise<void> {
  await expect.poll(async () => {
    if (await horlogeMontre(page, heure)) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 20_000, message: `l'horloge montre ${ecriture(heure)}` }).toBe(true);
}

// --- Leçons de test

function exerciceDe(lecon: LeconBrute, position: number): { items: ItemDeTest[]; mode: string | undefined } {
  const exercice = lecon.exercices[position] as { items?: ItemDeTest[]; mode?: string } | undefined;
  return { items: exercice?.items ?? [], mode: exercice?.mode };
}

function itemsDeLExercice(page: Page): ItemDeTest[] {
  const { lecon, position } = partie(page);
  if (!lecon || position === undefined) throw new Error("Aucun exercice d'horloge n'est joué");
  return exerciceDe(lecon, position).items;
}

function positionDeLExercice(lecon: LeconBrute, titre: string): number {
  const position = lecon.exercices.findIndex((exercice) => exercice.titre === titre);
  if (position < 0) throw new Error(`La leçon « ${lecon.titre} » n'a pas d'exercice « ${titre} »`);
  return position;
}

/** L'heure de la question en cours : une bonne réponse fait passer à l'item suivant. */
async function itemEnCours(page: Page): Promise<ItemDeTest> {
  const item = itemsDeLExercice(page)[await questionsReussies(page)];
  if (!item) throw new Error("Plus aucune question d'horloge à poser");
  return item;
}

function servir(page: Page, lecons: readonly LeconBrute[]): void {
  etat(page).injectees.push(...lecons);
}

// --- Le clavier de cristaux

const clavier = (page: Page) => page.getByTestId("clavier-de-cristaux");
const horloge = (page: Page) => page.getByTestId("exercice-horloge");

async function taper(page: Page, chiffres: string): Promise<void> {
  for (const chiffre of chiffres) await clavier(page).getByRole("button", { name: chiffre, exact: true }).click();
}

const PREMIERS_CHIFFRES_D_UNE_HEURE_A_UN_CHIFFRE = "3456789";

/** Écrit l'heure comme un enfant : les chiffres des heures, puis on touche le champ des minutes si la saisie n'y est pas passée seule. */
async function ecrireLHeure(page: Page, ecrite: string): Promise<void> {
  const { heures, minutes } = lireUneHeureEcrite(ecrite);
  const chiffresDesHeures = String(heures);
  await expect(clavier(page)).toBeVisible();
  await taper(page, chiffresDesHeures);
  const aMinutes = /h \d/.test(ecrite);
  if (aMinutes) {
    const passeSeule = chiffresDesHeures.length === 2 || PREMIERS_CHIFFRES_D_UNE_HEURE_A_UN_CHIFFRE.includes(chiffresDesHeures);
    if (!passeSeule) await page.getByTestId("champ-minutes").click();
    await taper(page, String(minutes));
  }
}

async function validerLHeure(page: Page): Promise<void> {
  await clavier(page).getByRole("button", { name: "Valider", exact: true }).click();
}

async function ecrireEtValider(page: Page, ecrite: string): Promise<void> {
  await demarrer(page);
  await expect(clavier(page)).toBeVisible();
  await expect(clavier(page).getByTestId("cristal").first()).not.toHaveAttribute("aria-disabled", "true");
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  await ecrireLHeure(page, ecrite);
  await validerLHeure(page);
}

// --- Aller jusqu'à une heure

async function repondreJusteALaQuestionEnCours(page: Page): Promise<void> {
  const item = await itemEnCours(page);
  const bonne = ecriture(lireUneHeureBrute(item.heure));
  const rang = await questionsReussies(page);
  if ((await horloge(page).getAttribute("data-mode")) === "clavierDeCristaux") {
    await ecrireEtValider(page, bonne);
  } else {
    await repondre(page, bonne);
  }
  await expect.poll(async () => {
    const fin = await page.getByTestId("fin-de-seance").isVisible();
    return fin || (await recipient(page).getAttribute("data-questions-reussies", { timeout: 1_000 }).catch(() => null)) === String(rang + 1);
  }).toBe(true);
}

async function allerALHeure(page: Page, heureVoulue: string): Promise<void> {
  await demarrer(page);
  const cible = lireUneHeureEcrite(heureVoulue);
  const items = itemsDeLExercice(page);
  const rangCible = items.findIndex((item) => ecriture(lireUneHeureBrute(item.heure)) === ecriture(cible));
  if (rangCible < 0) throw new Error(`Aucune question ne montre ${heureVoulue}`);
  await expect(horloge(page)).toBeVisible();
  for (let rang = await questionsReussies(page); rang < rangCible; rang++) {
    await attendreQueLHorlogeMontre(page, lireUneHeureBrute((items[rang] as ItemDeTest).heure));
    await repondreJusteALaQuestionEnCours(page);
  }
  await attendreQueLHorlogeMontre(page, cible);
}

async function repondreUneAutreHeureQue(page: Page, heure: string): Promise<void> {
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  const bonne = ecriture(lireUneHeureEcrite(heure));
  const fausse = (await textesDesChoixPossibles(page)).find((texte) => texte !== bonne);
  if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
  partie(page).dernierChoixTouche = fausse;
  await repondre(page, fausse);
}

// --- Préparation du jeu

/** Tom joue avec son profil préparé (CE1) : appelé avant l'ouverture de la page de la leçon. */
export async function preparerTomPourLHorloge(page: Page, monde: Monde): Promise<void> {
  const courante = partie(page);
  if (courante.tomPrepare || estSurUnProfilReel(page)) return;
  courante.tomPrepare = true;
  courante.acteur = "Tom";
  const prepare = monde.profils.get("Tom") ?? { prenom: "Tom", niveau: "CE1", univers: cleDe("Animaux de la forêt") };
  await preparerProfil(page, prepare);
}

/** « Léa joue seulement l'exercice … » : la séance commence au premier pas qui en a besoin. */
export function jouerSeulementLExerciceDHorloge(page: Page, monde: Monde, acteur: Acteur, lecon: LeconBrute, exercice: string): void {
  const courante = partie(page);
  courante.lecon = lecon;
  courante.position = positionDeLExercice(lecon, exercice);
  courante.acteur = acteur;
  etatDesChoix(page).demarrage = async () => {
    if (acteur === "Tom") await preparerTomPourLHorloge(page, monde);
    await lancer(page, lecon, exercice);
  };
}

async function passerEnProfilReel(famille: Famille, monde: Monde, page: Page, prenom: string): Promise<void> {
  if ((await famille.session(page)) === null) await famille.connecterSansEmail("tablette", "Paul");
  await jouerAvecLeProfilReel(famille, monde, page, prenom);
}

/** Tom, ou Inès, est un vrai profil de Paul : son parcours se lit sous RLS. */
export async function jouerEnProfilReelPourLHorloge(famille: Famille, monde: Monde, page: Page, prenom: string): Promise<void> {
  await passerEnProfilReel(famille, monde, page, prenom);
}

/** Les heures proposées au départ du tirage : celles que calcule le domaine pour l'item joué. */
function heuresDeDepartDuTirage(page: Page): string[] {
  const { lecon, position } = partie(page);
  if (!lecon || position === undefined) throw new Error("Aucun exercice d'horloge n'est joué");
  const exercice = lecon.exercices[position] as { precision?: string };
  const precision = exercice.precision === undefined ? PrecisionDeLHeure.parDefaut(Niveau.de(lecon.niveau)) : PrecisionDeLHeure.lire(exercice.precision);
  const item = itemsDeLExercice(page)[0];
  if (!item) throw new Error("L'exercice d'horloge n'a pas d'item");
  return heuresProposees(HeureDeLHorloge.lire(item.heure), precision).map((heure) => heure.ecriture());
}

/**
 * « Les choix sont affichés dans l'ordre … » : le tirage du début de séance part des heures calculées par le domaine
 * (la bonne heure et deux heures voisines) et est forcé pour donner l'ordre annoncé par le scénario.
 */
export async function verifierLesChoixDeLHorloge(page: Page, ordre: readonly string[]): Promise<void> {
  const choix = etatDesChoix(page);
  choix.ordre = [...ordre];
  choix.depart = heuresDeDepartDuTirage(page);
  await demarrer(page);
  await avancerJusquAuxChoix(page);
  expect(await textesDesChoix(page)).toEqual([...ordre]);
}

// --- Contexte

Given(/^la bibliothèque de test de l'horloge est servie$/, async ({ page }) => {
  servir(page, LECONS_DE_L_HORLOGE as LeconBrute[]);
  await servirLaBibliothequeDeLHorloge(page, () => etat(page).injectees);
});

Given(/^(Inès) a un profil enfant préparé de niveau (\S+) dans l'univers « (.+) »$/, async ({ monde }, prenom: string, niveau: string, univers: string) => {
  monde.profils.set(prenom, { prenom, niveau, univers: cleDe(univers) });
});

// --- Règle 1 : les leçons mal formées

const IDENTIFIANT_DE_LA_LECON_DE_TEST = "e2e-190-lecon-de-test";
const ORDRE_DE_LA_LECON_DE_TEST = 30;

function leconDeTestAvec(niveau: string, titre: string, exercice: Record<string, unknown>): LeconBrute {
  return leconDHorlogeDeTest(IDENTIFIANT_DE_LA_LECON_DE_TEST, titre, niveau, ORDRE_DE_LA_LECON_DE_TEST, exercice) as LeconBrute;
}

Given(
  /^une leçon de test « ([^«»]+) » de niveau (\S+) a un exercice horloge à lire à « (\d+:\d+(?::\d+)?) » (sans précision|de précision (?:heure|minute|seconde))$/,
  async ({ page }, titre: string, niveau: string, heure: string, precisionDite: string) => {
    const precision = precisionDite === "sans précision" ? undefined : precisionDite.replace("de précision ", "");
    servir(page, [
      leconDeTestAvec(niveau, titre, {
        type: "horloge",
        titre: "Lire l'heure de test",
        mode: "lire",
        ...(precision === undefined ? {} : { precision }),
        items: [{ heure }],
      }),
    ]);
  },
);

function exerciceAvecLeDefaut(defaut: string): Record<string, unknown> {
  const base = { type: "horloge", titre: "Lire l'heure de test", mode: "lire" };
  const heureDemandee = /^demande l'heure « (.+) »(?:, qui n'est pas écrite « H:MM »)?$/.exec(defaut);
  if (defaut === "a le mode « regarder »") return { ...base, mode: "regarder", items: [{ heure: "3:00" }] };
  if (defaut === "n'a pas de mode") return { type: "horloge", titre: base.titre, items: [{ heure: "3:00" }] };
  if (defaut === "n'a aucune heure") return { ...base, items: [] };
  if (heureDemandee) return { ...base, items: [{ heure: heureDemandee[1] }] };
  if (defaut === "a la précision « dix minutes »") return { ...base, precision: "dix minutes", items: [{ heure: "3:00" }] };
  const doublon = /^demande « (.+) » et « (.+) »$/.exec(defaut);
  if (doublon) return { ...base, items: [{ heure: doublon[1] }, { heure: doublon[2] }] };
  throw new Error(`Défaut d'exercice horloge inconnu : « ${defaut} »`);
}

Given(/^une leçon de test « ([^«»]+) » de niveau (\S+) a un exercice horloge qui (.+)$/, async ({ page }, titre: string, niveau: string, defaut: string) => {
  servir(page, [leconDeTestAvec(niveau, titre, exerciceAvecLeDefaut(defaut))]);
});

// --- Le parcours

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

When(/^Inès choisit « Maths » dans son parcours$/, async ({ famille, monde, page }) => {
  await passerEnProfilReel(famille, monde, page, "Inès");
  await ouvrirLeParcoursDeMathsSansLecon(page, "Inès");
});

/** Ouvre « Mon parcours » puis l'onglet Maths s'il existe : un parcours sans leçon de la classe n'en a pas forcément. */
export async function ouvrirLeParcoursDeMathsSansLecon(page: Page, enfant: string): Promise<void> {
  const titre = page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true });
  if (!(await titre.isVisible())) {
    const bouton = page.getByRole("button", { name: "Mon parcours", exact: true });
    await bouton.click();
    await expect(titre).toBeVisible();
  }
  await expect(page.getByText("Chargement du parcours")).toHaveCount(0, { timeout: 25_000 });
  const onglet = page.getByRole("tab", { name: "Maths", exact: true });
  if ((await onglet.count()) > 0 && (await onglet.getAttribute("aria-selected")) !== "true") await onglet.click();
  void enfant;
}

Then(/^« ([^«»]+) » apparaît dans le parcours$/, async ({ page }, titre: string) => {
  await expect(page.getByRole("button", { name: new RegExp(`^${echapper(titre)}(?:, [A-Z0-9]+)? : `) })).toHaveCount(1);
});

// --- Règle 2 : lire l'heure

Then(/^Léa voit une horloge à aiguilles, la petite aiguille sur le (\d+) et la grande sur le (\d+)$/, async ({ page }, petite: string, grande: string) => {
  await expect(page.getByTestId("horloge")).toBeVisible();
  const heures = Number(petite);
  const minutes = (Number(grande) % 12) * 5;
  await attendreQueLHorlogeMontre(page, { heures, minutes, secondes: 0 });
});

Then(/^(Léa|Tom) voit une horloge à aiguilles qui montre (\d+ h(?: \d+)?)$/, async ({ page }, _acteur: string, ecrite: string) => {
  await expect(page.getByTestId("horloge")).toBeVisible();
  await attendreQueLHorlogeMontre(page, lireUneHeureEcrite(ecrite));
});

Then(/^Léa voit trois choix, dont « ([^«»]+) », tous des heures entières différentes sur le cadran$/, async ({ page }, heure: string) => {
  await avancerJusquAuxChoix(page);
  await expect(page.getByTestId("choix")).toHaveCount(3);
  const textes = await textesDesChoix(page);
  expect(textes).toContain(heure);
  const surLeCadran = textes.map((texte) => {
    expect(texte, "une heure entière").toMatch(/^\d+ h$/);
    return lireUneHeureEcrite(texte).heures % 12;
  });
  expect(new Set(surLeCadran).size, `trois heures différentes sur le cadran : ${textes.join(", ")}`).toBe(3);
});

Given(/^l'horloge montre (\d+ h(?: \d+)?)$/, async ({ page }, ecrite: string) => {
  await allerALHeure(page, ecrite);
});

Then(/^l'horloge montre ensuite (\d+ h(?: \d+)?)$/, async ({ page }, ecrite: string) => {
  await attendreQueLHorlogeMontre(page, lireUneHeureEcrite(ecrite));
});

Then(/^la question est réussie$/, async ({ page }) => {
  const avant = etatDesChoix(page).reussiesAvant;
  await expect.poll(async () => {
    if (await page.getByTestId("fin-de-seance").isVisible()) return true;
    return (await recipient(page).getAttribute("data-questions-reussies", { timeout: 1_000 }).catch(() => null)) === String(avant + 1);
  }, { message: "la question est comptée réussie" }).toBe(true);
});

Then(/^la question reste posée$/, async ({ page }) => {
  expect(await questionsReussies(page)).toBe(etatDesChoix(page).reussiesAvant);
  await expect(horloge(page)).toBeVisible();
});

When(/^(Tom) écrit « (\d+ h(?: \d+)?) » sur le clavier de cristaux et valide$/, async ({ page, monde }, _tom: string, ecrite: string) => {
  await preparerTomPourLHorloge(page, monde);
  await ecrireEtValider(page, ecrite);
});

When(/^(Tom) écrit « (\d+ h(?: \d+)?) » sur le clavier de cristaux$/, async ({ page, monde }, _tom: string, ecrite: string) => {
  await preparerTomPourLHorloge(page, monde);
  await demarrer(page);
  await expect(clavier(page)).toBeVisible();
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  await ecrireLHeure(page, ecrite);
});

Then(/^Tom ne peut pas valider « (\d+ h(?: \d+)?) »$/, async ({ page }, ecrite: string) => {
  const { minutes } = lireUneHeureEcrite(ecrite);
  await validerLHeure(page);
  await expect(page.getByTestId("heure-impossible")).not.toHaveText("");
  await expect(page.getByTestId("champ-minutes")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByTestId("champ-minutes")).toHaveAttribute("data-valeur", String(minutes));
});

Then(/^aucune erreur n'est comptée$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect(await questionsReussies(page)).toBe(etatDesChoix(page).reussiesAvant);
  await expect(page.getByTestId("parole")).not.toHaveAttribute("data-nature", "encouragement");
  await expect(page.getByTestId("choix")).toHaveCount(0);
});

Given(/^Tom a entendu Noisette lire « ([^«»]+) »$/, async ({ page, monde }, texte: string) => {
  await preparerTomPourLHorloge(page, monde);
  await demarrer(page);
  await finirLaParoleJusqua(page, { type: "texte-lu", texte: entendu(texte) });
  await terminerLaLecture(page);
});

Then(/^Tom voit « (\d+ : \d+) » à côté de l'horloge$/, async ({ page }, digital: string) => {
  const affichage = horloge(page).getByTestId("affichage-digital");
  await expect(affichage).toBeVisible();
  expect(normaliser((await affichage.textContent()) ?? "")).toBe(digital);
});

Then(
  /^ni « ([^«»]+) » ni « ([^«»]+) » ni « ([^«»]+) » n'est écrit à l'écran$/,
  async ({ page }, premiere: string, deuxieme: string, troisieme: string) => {
    await expect(horloge(page)).toBeVisible();
    await expect(page.getByTestId("affichage-digital")).toHaveCount(0);
    const ecran = normaliser(await page.locator("body").innerText());
    for (const interdit of [premiere, deuxieme, troisieme]) expect(ecran, `« ${interdit} » n'est pas écrit`).not.toContain(interdit);
  },
);

// --- Règle 3 : erreurs et « Je ne sais pas »

When(/^Léa répond une autre heure que « ([^«»]+) »$/, async ({ page }, heure: string) => {
  await repondreUneAutreHeureQue(page, heure);
});

Given(/^Léa a répondu une fois une autre heure que « ([^«»]+) »$/, async ({ page }, heure: string) => {
  await repondreUneAutreHeureQue(page, heure);
});

Then(/^le choix touché reste visible, pâle, et ne réagit plus$/, async ({ page }) => {
  const texte = partie(page).dernierChoixTouche;
  if (texte === undefined) throw new Error("Aucun choix n'a été touché");
  const ecarte = bulleDeChoix(page, texte);
  await expect(ecarte).toBeVisible();
  await expect(ecarte).toHaveAttribute("data-ecarte", "true");
  await expect(ecarte).toHaveAttribute("aria-disabled", "true");
  await expect.poll(async () => Number(await ecarte.evaluate((element) => getComputedStyle(element).opacity))).toBeLessThan(1);
  const paroles = (await journal(page)).speaks;
  const reussies = await questionsReussies(page);
  await ecarte.click({ force: true });
  await laisserPasserLeDelaiDeLecture(page);
  expect((await journal(page)).speaks).toBe(paroles);
  expect(await questionsReussies(page)).toBe(reussies);
});

Given(
  /^une leçon de test de niveau (\S+) a un seul exercice horloge à lire à « (\d+:\d+) »$/,
  async ({ page }, niveau: string, heure: string) => {
    const lecon = leconDeTestAvec(niveau, "Une seule heure", { type: "horloge", titre: "Une seule heure", mode: "lire", items: [{ heure }] });
    servir(page, [lecon]);
    etatDesChoix(page).demarrage = async () => lancer(page, lecon, "Une seule heure");
    partie(page).lecon = lecon;
    partie(page).position = 0;
  },
);

/** Dit si « Je ne sais pas » à l'horloge est proposé (hors du clavier, qui n'a pas de choix à attendre). */
export async function jeNeSaisPasEstProposeALHorloge(page: Page): Promise<void> {
  await demarrer(page);
  await expect(horloge(page)).toBeVisible();
  await expect(page.getByRole("button", { name: "Je ne sais pas", exact: true })).toBeVisible();
}

/** Léa dit « Je ne sais pas » aux choix de l'horloge : l'heure est alors annoncée aux lecteurs d'écran (décision #190.27). */
export async function direJeNeSaisPasAuxChoixDeLHorloge(page: Page): Promise<void> {
  await avancerJusquAuxChoix(page);
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  const item = await itemEnCours(page);
  await page.getByTestId("je-ne-sais-pas").click();
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
  await expect(page.getByTestId("horloge")).toHaveAttribute("aria-label", `Horloge à aiguilles : ${ecriture(lireUneHeureBrute(item.heure))}`);
}

/** Tom dit « Je ne sais pas » au clavier de cristaux de l'horloge. */
export async function direJeNeSaisPasAuClavierDeLHorloge(page: Page): Promise<void> {
  await demarrer(page);
  await expect(clavier(page)).toBeVisible();
  etatDesChoix(page).reussiesAvant = await questionsReussies(page);
  await page.getByTestId("je-ne-sais-pas").click();
}

Then(/^« Je ne sais pas » n'est plus proposé à Tom pour cette question$/, async ({ page }) => {
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
  await expect(horloge(page)).toBeVisible();
});

Then(/^la question reste posée jusqu'à ce que Tom écrive « (\d+ h(?: \d+)?) »$/, async ({ page }, ecrite: string) => {
  expect(await questionsReussies(page)).toBe(etatDesChoix(page).reussiesAvant);
  const brillants = clavier(page).getByTestId("cristal").and(page.locator('[data-brille="true"]'));
  await expect(brillants).toHaveText([...new Set(ecrite.replace(/\D/g, ""))].sort());
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
  await ecrireLHeure(page, ecrite);
  await validerLHeure(page);
  await expect.poll(async () => {
    if (await page.getByTestId("fin-de-seance").isVisible()) return true;
    return (await recipient(page).getAttribute("data-questions-reussies", { timeout: 1_000 }).catch(() => null)) ===
      String(etatDesChoix(page).reussiesAvant + 1);
  }).toBe(true);
});

When(/^(Tom) commence l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/, async ({ page, monde }, _tom: string, exercice: string, titre: string) => {
  const lecon = leconDeTitre(page, titre);
  partie(page).lecon = lecon;
  partie(page).position = positionDeLExercice(lecon, exercice);
  await preparerTomPourLHorloge(page, monde);
  await lancer(page, lecon, exercice);
});

// --- Révision

Given(
  /^Léa a pour question retenue l'horloge qui montre (\d+ h(?: \d+)?) de l'exercice « ([^«»]+) », due aujourd'hui$/,
  async ({ famille, monde, page }, ecrite: string, titreDeLExercice: string) => {
    const lecon = LECONS_DE_L_HORLOGE.find((candidate) => candidate.exercices.some((exercice) => exercice["titre"] === titreDeLExercice));
    if (!lecon) throw new Error(`Aucune leçon n'a l'exercice « ${titreDeLExercice} »`);
    const position = lecon.exercices.findIndex((exercice) => exercice["titre"] === titreDeLExercice);
    if (!estSurUnProfilReel(page)) await passerEnProfilReel(famille, monde, page, "Léa");
    const maintenant = new Date();
    const deux = (n: number) => String(n).padStart(2, "0");
    const jour = `${maintenant.getFullYear()}-${deux(maintenant.getMonth() + 1)}-${deux(maintenant.getDate())}`;
    const hier = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() - 1, 9);
    // La clé de la question est celle du domaine (cleDeLHorloge) : « g: », le mode et l'heure écrite, normalisés.
    await ecrireLaFileDeRevision(profilDe(famille, "Léa").id, [{
      cle: `g:lire ${ecriture(lireUneHeureEcrite(ecrite))}`,
      leconDOrigine: lecon.id,
      position,
      type: "horloge",
      intervalle: 1,
      dateDeRevision: jour,
      derniereErreurLe: hier.toISOString(),
    }]);
    partie(page).lecon = lecon as LeconBrute;
    partie(page).position = position;
    await rechargerAvecLeProfilReel(page);
  },
);

// --- Règle 4 : voix, lecteurs d'écran, 360 px, dys, hors ligne

Then(/^Léa entend Noisette lire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect.poll(async () => (await journal(page)).lecture.texte).toBe(entendu(texte));
});

Then(/^Léa n'entend pas Noisette dire « ([^«»]+) »$/, async ({ page }, texte: string) => {
  await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(0);
  for (let essai = 0; essai < 3; essai++) {
    await terminerLaLecture(page);
    await laisserPasserLeDelaiDeLecture(page);
  }
  for (const parole of await toutesLesParoles(page)) expect(normaliser(parole)).not.toContain(normaliser(texte));
});

Then(/^les lecteurs d'écran annoncent une horloge à aiguilles$/, async ({ page }) => {
  await expect(page.getByRole("img", { name: "Horloge à aiguilles", exact: true })).toBeVisible();
});

Then(/^les lecteurs d'écran ne disent pas « ([^«»]+) » avant que Léa réponde$/, async ({ page }, heure: string) => {
  await expect(page.getByTestId("horloge")).toHaveAttribute("aria-label", "Horloge à aiguilles");
  const annonces = await page.getByRole("status").allTextContents();
  for (const annonce of annonces) expect(normaliser(annonce)).not.toContain(heure);
  const etiquettes = await horloge(page).locator("[aria-label]").evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label") ?? ""));
  for (const etiquette of etiquettes) if (etiquette !== "Clavier de cristaux") expect(normaliser(etiquette)).not.toContain(heure);
});

Then(
  /^l'horloge à aiguilles, (les trois choix|le clavier de cristaux) et « Je ne sais pas » sont visibles en entier$/,
  async ({ page }, commandes: string) => {
    const aVerifier: Locator[] = [page.getByTestId("horloge"), page.getByTestId("je-ne-sais-pas")];
    if (commandes === "les trois choix") {
      await expect(page.getByTestId("choix")).toHaveCount(3);
      aVerifier.push(...(await page.getByTestId("choix").all()));
    } else {
      aVerifier.push(clavier(page));
    }
    const taille = page.viewportSize() ?? { width: 360, height: 740 };
    // Chaque élément est amené à l'écran, puis mesuré : il tient en entier dans la largeur et dans la hauteur de l'écran.
    for (const cible of aVerifier) {
      await expect(cible).toBeVisible();
      await cible.scrollIntoViewIfNeeded();
      const boite = await cible.boundingBox();
      const nom = ((await cible.textContent()) ?? (await cible.getAttribute("data-testid")) ?? "").trim();
      expect(boite, `« ${nom} » est à l'écran`).not.toBeNull();
      expect((boite?.x ?? -1), `gauche de « ${nom} »`).toBeGreaterThanOrEqual(0);
      expect((boite?.x ?? 0) + (boite?.width ?? 0), `droite de « ${nom} »`).toBeLessThanOrEqual(taille.width);
      expect((boite?.y ?? -1), `haut de « ${nom} »`).toBeGreaterThanOrEqual(0);
      expect((boite?.y ?? 0) + (boite?.height ?? 0), `bas de « ${nom} »`).toBeLessThanOrEqual(taille.height);
    }
  },
);

Then(/^Léa voit la consigne et les choix en mode dys : police Andika, lettres, mots et lignes espacés$/, async ({ page }) => {
  await avancerJusquAuxChoix(page);
  await verifierModeDys(page, [page.getByTestId("consigne"), ...(await page.getByTestId("choix").all())], true);
});
