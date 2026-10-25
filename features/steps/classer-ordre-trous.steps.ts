import { additionAPoserAffichee, preparerLaFluence, verifierQueLAdditionResteAPoser } from "./calcul-pour-les-autres-stories.steps.ts";
import { expect, type Page } from "@playwright/test";
import { Given, Then, When } from "./fixtures.ts";
import {
  bulle,
  commencerSeulementLExercice,
  entendu,
  etat,
  injecter,
  leconCourante,
  leconDeTest,
  leconDeTitre,
  ouvrirLaPageDeLaLecon,
  recipient,
  toutesLesParoles,
} from "./etapes-puis-exercices.steps.ts";
import {
  avancerJusquAuxChoix,
  bulleDeChoix,
  demarrageDeLExercice,
  demarrer,
  etatDesChoix,
  nombresPourMelanger,
  positionDeLExercice,
  questionsDeLaLecon,
  questionsReussies,
  textesDesChoix,
} from "./exercices-a-choix.steps.ts";
import { creerLeProfil } from "./profils-enfants.steps.ts";
import { cleDe, EXPRESSIONS_PAR_PERSONNAGE, FELICITATIONS_COMMUNES, listeDe, preparerProfil } from "./univers.steps.ts";
import { tirageDeLaConjugaison, verifierQueLaDicteeAttendLaReponse } from "./dictee-et-conjugaison.steps.ts";
import { journal, laisserPasserLeDelaiDeLecture, normaliser, terminerLaLecture } from "./voix.steps.ts";

// Story #18 : classer (maisons), ordre et texte à trous. Les étiquettes se posent comme un enfant : en touchant
// l'étiquette puis la maison (par défaut), en la faisant glisser, ou au clavier. Les trous sont des choix, comme en #17.

type Exercice = Record<string, unknown>;
type Groupe = { id: string; nom: string };
type Item = { texte: string; groupe: string; aide?: string };
type Geste = "toucher" | "glisser" | "clavier";

const TYPES_JOUES = ["classer", "ordre", "trous", "conjugaison", "dictee", "memoriser"];
const EXERCICE_DE_TEST = "Exercice";
const GROUPE_PAR_DEFAUT = [{ id: "1", nom: "Fruits" }, { id: "2", nom: "Légumes" }];
const RELANCES_DE_L_ORDRE = ["Oui ! Et après ?", "Bien ! Et ensuite ?", "Super ! La suite ?"];
const FELICITATIONS_DE_NOISETTE = [...FELICITATIONS_COMMUNES, ...(EXPRESSIONS_PAR_PERSONNAGE["Noisette"] ?? [])];

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactement(texte: string): RegExp {
  return new RegExp(`^\\s*${echapper(texte)}\\s*$`);
}

// --- Les exercices : lecture des données de la leçon

function groupesDe(exercice: Exercice): Groupe[] {
  return exercice.groupes as Groupe[];
}

function itemsDe(exercice: Exercice): Item[] {
  return exercice.items as Item[];
}

function elementsDe(exercice: Exercice): string[] {
  return exercice.elements as string[];
}

function motsAttendusDe(exercice: Exercice): string[] {
  return [...(exercice.texte as string).matchAll(/\[([^\]]+)\]/g)].flatMap((m) => (m[1] === undefined ? [] : [m[1]]));
}

async function exerciceEnCours(page: Page): Promise<Exercice> {
  const zone = page.getByTestId("exercice-en-cours");
  await expect(zone).toBeVisible();
  const position = Number(await zone.getAttribute("data-position"));
  const exercice = leconCourante(page).exercices[position];
  if (!exercice) throw new Error(`Aucun exercice à la position ${position}`);
  return exercice;
}

// --- Les écrans

function plateau(page: Page) {
  return page.getByTestId("etiquettes-a-placer");
}

function etiquetteAPlacer(page: Page, texte: string) {
  return plateau(page).getByRole("button", { name: texte, exact: true });
}

function maison(page: Page, nom: string) {
  return page.getByRole("group", { name: `Maison « ${nom} »`, exact: true });
}

function porteDeLaMaison(page: Page, nom: string) {
  return page.getByRole("button", { name: `Poser dans la maison « ${nom} »`, exact: true });
}

function etiquettesPoseesDans(page: Page, nom: string, texte: string) {
  return maison(page, nom).getByTestId("etiquette-posee").filter({ hasText: exactement(texte) });
}

const dernieresPosees = new WeakMap<Page, string>();
const etiquettesVisees = new WeakMap<Page, string>();

// --- Poser une étiquette

async function focalise(page: Page, repere: { testid?: string; label?: string; texte?: string }): Promise<boolean> {
  return await page.evaluate(({ testid, label, texte }) => {
    const element = document.activeElement;
    if (!element) return false;
    if (testid && element.getAttribute("data-testid") !== testid) return false;
    if (label && element.getAttribute("aria-label") !== label) return false;
    return !texte || (element.textContent ?? "").replace(/\s+/g, " ").trim() === texte;
  }, repere);
}

async function atteindreAuClavier(page: Page, repere: { testid?: string; label?: string; texte?: string }) {
  for (let essai = 0; essai < 40 && !(await focalise(page, repere)); essai++) await page.keyboard.press("Tab");
  expect(await focalise(page, repere), `élément atteint au clavier : ${JSON.stringify(repere)}`).toBe(true);
}

async function poserDansLaMaison(page: Page, etiquette: string, nomDeLaMaison: string, geste: Geste) {
  await demarrer(page);
  dernieresPosees.set(page, etiquette);
  if (geste === "glisser") {
    const emplacement = plateau(page).getByRole("listitem").filter({ has: page.getByRole("button", { name: etiquette, exact: true }) });
    // À 360 px, la maison est sous l'écran : on la fait apparaître avant de saisir l'étiquette, pour ne pas défiler pendant le glisser.
    await maison(page, nomDeLaMaison).scrollIntoViewIfNeeded();
    await emplacement.dragTo(maison(page, nomDeLaMaison));
  } else if (geste === "clavier") {
    await atteindreAuClavier(page, { testid: "etiquette", texte: etiquette });
    await page.keyboard.press("Enter");
    await atteindreAuClavier(page, { label: `Poser dans la maison « ${nomDeLaMaison} »` });
    await page.keyboard.press("Enter");
  } else {
    await etiquetteAPlacer(page, etiquette).click();
    await porteDeLaMaison(page, nomDeLaMaison).click();
  }
}

async function nombreAPoser(page: Page): Promise<number> {
  return await page.getByTestId("etiquette").count();
}

async function poserEtAttendre(page: Page, etiquette: string, nomDeLaMaison: string, issue: "bien" | "mal") {
  await demarrer(page);
  const avant = await nombreAPoser(page);
  const paroles = (await journal(page)).speaks;
  await poserDansLaMaison(page, etiquette, nomDeLaMaison, "toucher");
  if (issue === "bien") await expect.poll(() => nombreAPoser(page)).toBe(avant - 1);
  else await expect.poll(async () => (await journal(page)).speaks).toBeGreaterThan(paroles);
}

async function toucherUneEtiquetteDeLOrdre(page: Page, etiquette: string, quelle: "premiere" | "derniere" = "premiere") {
  await demarrer(page);
  dernieresPosees.set(page, etiquette);
  const boutons = etiquetteAPlacer(page, etiquette);
  await (quelle === "premiere" ? boutons.first() : boutons.last()).click();
}

async function poserEtAttendreLOrdre(page: Page, etiquette: string) {
  const avant = await page.locator('[data-testid="place"][data-remplie="true"]').count();
  await toucherUneEtiquetteDeLOrdre(page, etiquette);
  await expect(page.locator('[data-testid="place"][data-remplie="true"]')).toHaveCount(avant + 1);
}

// --- Leçons de test

function injecterEtPreparer(page: Page, id: string, exercice: Exercice) {
  const lecon = leconDeTest(id, `Leçon de test ${id}`, [exercice]);
  return injecter(page, lecon).then(() => {
    etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, EXERCICE_DE_TEST);
    return lecon;
  });
}

const EXERCICES_DE_TEST: Readonly<Record<string, Exercice>> = {
  classer: {
    type: "classer",
    titre: EXERCICE_DE_TEST,
    groupes: GROUPE_PAR_DEFAUT,
    items: [
      { texte: "pomme", groupe: "1" },
      { texte: "poire", groupe: "1" },
      { texte: "carotte", groupe: "2" },
      { texte: "radis", groupe: "2" },
    ],
  },
  ordre: { type: "ordre", titre: EXERCICE_DE_TEST, elements: ["un", "deux", "trois"] },
  trous: {
    type: "trous",
    titre: EXERCICE_DE_TEST,
    texte: "Le chat [dort] sur le [canapé].",
    distracteurs: ["mange", "lit"],
  },
};

function sansConsigne(type: string): Exercice {
  const exercice = EXERCICES_DE_TEST[type];
  if (!exercice) throw new Error(`Type d'exercice de test inconnu : ${type}`);
  return exercice;
}

Given(
  /^une leçon de test a un exercice classer dont l'étiquette « ([^«»]+) » du groupe « ([^«»]+) » a l'aide « (.+) »$/,
  async ({ page }, etiquette: string, groupe: string, aide: string) => {
    await injecterEtPreparer(page, "test-classer-avec-aide", {
      type: "classer",
      titre: EXERCICE_DE_TEST,
      consigne: "Range chaque animal.",
      groupes: [{ id: "1", nom: groupe }, { id: "2", nom: "Poissons" }],
      items: [{ texte: etiquette, groupe: "1", aide }, { texte: "requin", groupe: "2" }],
    });
  },
);

Given(
  /^une leçon de test a un seul exercice classer de deux étiquettes, « ([^«»]+) » pour « ([^«»]+) » et « ([^«»]+) » pour « ([^«»]+) »$/,
  async ({ page }, premiere: string, premiereMaison: string, seconde: string, secondeMaison: string) => {
    await injecterEtPreparer(page, "test-classer-deux-etiquettes", {
      type: "classer",
      titre: EXERCICE_DE_TEST,
      consigne: "Range chaque mot.",
      groupes: [{ id: "1", nom: premiereMaison }, { id: "2", nom: secondeMaison }],
      items: [{ texte: premiere, groupe: "1" }, { texte: seconde, groupe: "2" }],
    });
  },
);

Given(/^une leçon de test a un exercice (classer|ordre|trous) sans consigne$/, async ({ page }, type: string) => {
  await injecterEtPreparer(page, `test-${type}-sans-consigne`, sansConsigne(type));
});

When(/^Léa commence cet exercice$/, async ({ page }) => {
  await demarrer(page);
});

Given(/^Léa joue un exercice (classer|ordre) d'une leçon de test$/, async ({ page }, type: string) => {
  await injecterEtPreparer(page, `test-je-ne-sais-pas-${type}`, { ...sansConsigne(type), consigne: "Joue bien." });
});

// --- Étant donné : séance

Given(
  /^(?:Léa|Tom) joue seulement l'exercice « ([^«»]+) » de la leçon « ([^«»]+) »$/,
  async ({ page }, exercice: string, titreDeLaLecon: string) => {
    const lecon = leconDeTitre(page, titreDeLaLecon);
    const type = lecon.exercices[positionDeLExercice(lecon, exercice)]?.type;
    if (type === "fluence") return preparerLaFluence(page, exercice);
    if (typeof type !== "string" || !TYPES_JOUES.includes(type)) {
      throw new Error(`Étape non implémentée : l'exercice « ${exercice} » (${String(type)}) dépend d'une story à venir (#19 ou #21).`);
    }
    if (type === "conjugaison") etatDesChoix(page).tirage = tirageDeLaConjugaison(lecon.exercices[positionDeLExercice(lecon, exercice)] ?? {});
    etatDesChoix(page).demarrage = demarrageDeLExercice(page, lecon, exercice);
  },
);

Given(/^Tom a un profil enfant préparé de niveau (\S+)$/, async ({ page, monde, famille, $tags }, niveau: string) => {
  // Story #25 : Tom est un vrai second profil de Paul (sa progression est lue sous RLS) ; la page de Léa n'est pas touchée.
  // Story #27 : le résultat du test de départ de Tom est lu sous RLS, comme sa progression.
  // Story #65 : ses records sont lus sous RLS. Story #32 : ses étoiles ne comptent pas dans la cabane de Léa.
  if ($tags.includes("@issue-25") || $tags.includes("@issue-27") || $tags.includes("@issue-65") || $tags.includes("@issue-32")) {
    await creerLeProfil(famille, "Paul", { prenom: "Tom", niveau, libelleUnivers: "Animaux de la forêt" });
    return;
  }
  const profil = { prenom: "Tom", niveau, univers: cleDe("Animaux de la forêt") };
  monde.profils.set("Tom", profil);
  await preparerProfil(page, profil);
});

Given(/^Tom est sur la page de la leçon « (.+) »$/, async ({ page }, titre: string) => {
  await ouvrirLaPageDeLaLecon(page, titre);
});

When(/^Tom choisit seulement l'exercice « (.+) »$/, async ({ page }, titre: string) => {
  await commencerSeulementLExercice(page, titre);
});

async function jouerJusquAuxEtiquettes(page: Page) {
  const continuer = page.getByRole("button", { name: "Continuer", exact: true });
  await expect.poll(async () => {
    if (await page.getByTestId("etiquettes").isVisible()) return true;
    if (await continuer.isVisible()) {
      await continuer.click();
      return false;
    }
    if (await page.getByTestId("choix-de-la-question").isVisible()) {
      const enonce = normaliser((await page.getByTestId("question").textContent()) ?? "");
      const question = questionsDeLaLecon(leconCourante(page)).find((q) => q.enonce === enonce);
      if (question) await bulleDeChoix(page, question.reponse).click({ timeout: 2_000 }).catch(() => undefined);
    }
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: 25_000 }).toBe(true);
}

Given(/^il ne reste que l'étiquette « ([^«»]+) » à poser$/, async ({ page }, derniere: string) => {
  await demarrer(page);
  await jouerJusquAuxEtiquettes(page);
  const exercice = await exerciceEnCours(page);
  const groupes = groupesDe(exercice);
  for (const item of itemsDe(exercice).filter((candidat) => candidat.texte !== derniere)) {
    const nom = groupes.find((groupe) => groupe.id === item.groupe)?.nom ?? "";
    await poserEtAttendre(page, item.texte, nom, "bien");
  }
  await expect(page.getByTestId("etiquette")).toHaveCount(1);
  await expect(etiquetteAPlacer(page, derniere)).toBeVisible();
});

Given(
  /^Léa a posé (\d+) fois l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) »$/,
  async ({ page }, fois: string, etiquette: string, nomDeLaMaison: string) => {
    for (let i = 0; i < Number(fois); i++) await poserEtAttendre(page, etiquette, nomDeLaMaison, "mal");
  },
);

Given(/^Léa a ensuite posé « ([^«»]+) » dans « ([^«»]+) »$/, async ({ page }, etiquette: string, nomDeLaMaison: string) => {
  await poserEtAttendre(page, etiquette, nomDeLaMaison, "bien");
});

Given(/^(?:Léa|Tom) a posé l'étiquette « ([^«»]+) »$/, async ({ page }, etiquette: string) => {
  await poserEtAttendreLOrdre(page, etiquette);
});

Given(/^Léa a posé les étiquettes « ([^«»]+) » et « ([^«»]+) »$/, async ({ page }, premiere: string, seconde: string) => {
  await poserEtAttendreLOrdre(page, premiere);
  await poserEtAttendreLOrdre(page, seconde);
});

Given(/^Tom a posé « ([^«»]+) » et « ([^«»]+) »$/, async ({ page }, premiere: string, seconde: string) => {
  await poserEtAttendreLOrdre(page, premiere);
  await poserEtAttendreLOrdre(page, seconde);
});

// Le tirage des autres mots du trou : on lui donne les nombres qui amènent ces mots (voir exercices-a-choix.steps.ts).
Given(
  /^le premier trou propose « ([^«»]+) », « ([^«»]+) » et « ([^«»]+) »$/,
  async ({ page }, attendu: string, premier: string, second: string) => {
    const lecon = etat(page).courante ?? leconDeTitre(page, "Être et avoir au présent");
    const exercice = lecon.exercices.find((candidat) => candidat.type === "trous") as Exercice;
    expect(motsAttendusDe(exercice)[0]).toBe(attendu);
    const candidats = [...new Set([...(exercice.distracteurs as string[]), ...motsAttendusDe(exercice)])].filter((mot) => mot !== attendu);
    const autres = nombresPourMelanger(candidats, (melange) => melange[0] === premier && melange[1] === second);
    const choix = nombresPourMelanger([attendu, premier, second], () => true);
    etatDesChoix(page).tirage = [...autres, ...choix];
  },
);

Given(/^Léa a rempli les trois premiers trous$/, async ({ page }) => {
  await demarrer(page);
  const mots = motsAttendusDe(await exerciceEnCours(page));
  for (const [rang, mot] of mots.slice(0, 3).entries()) {
    await avancerJusquAuxChoix(page);
    await bulleDeChoix(page, mot).click();
    await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(rang + 1));
  }
});

// --- Quand

When(/^Léa pose (?:d'abord )?l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) »$/, async ({ page }, etiquette: string, nomDeLaMaison: string) => {
  await poserDansLaMaison(page, etiquette, nomDeLaMaison, "toucher");
});

When(
  /^Léa pose l'étiquette « ([^«»]+) » dans la maison « ([^«»]+) » (en la faisant glisser|en la touchant, puis en touchant la maison|au clavier seulement)$/,
  async ({ page }, etiquette: string, nomDeLaMaison: string, geste: string) => {
    const gestes: Record<string, Geste> = {
      "en la faisant glisser": "glisser",
      "en la touchant, puis en touchant la maison": "toucher",
      "au clavier seulement": "clavier",
    };
    await poserDansLaMaison(page, etiquette, nomDeLaMaison, gestes[geste] ?? "toucher");
  },
);

When(/^(?:Léa|Tom) pose l'étiquette « ([^«»]+) »$/, async ({ page }, etiquette: string) => {
  await toucherUneEtiquetteDeLOrdre(page, etiquette);
});

When(/^Tom pose l'une ou l'autre des deux étiquettes « ([^«»]+) »$/, async ({ page }, etiquette: string) => {
  await expect(etiquetteAPlacer(page, etiquette)).toHaveCount(2);
  await toucherUneEtiquetteDeLOrdre(page, etiquette, "derniere");
});

When(/^le premier trou est mis en avant$/, async ({ page }) => {
  await demarrer(page);
  await expect(page.getByTestId("trou").first()).toHaveAttribute("aria-current", "true");
});

// --- Alors : classer

Then(/^Léa voit les maisons (.+), et (\d+) étiquettes à poser$/, async ({ page }, liste: string, nombre: string) => {
  const noms = listeDe(liste);
  await expect(page.getByTestId("maison")).toHaveCount(noms.length);
  for (const nom of noms) await expect(maison(page, nom)).toBeVisible();
  await expect(page.getByTestId("etiquette")).toHaveCount(Number(nombre));
});

Then(/^l'étiquette « ([^«»]+) » reste dans la maison « ([^«»]+) »$/, async ({ page }, etiquette: string, nomDeLaMaison: string) => {
  await expect(etiquettesPoseesDans(page, nomDeLaMaison, etiquette)).toHaveCount(1);
  await expect(etiquetteAPlacer(page, etiquette)).toHaveCount(0);
});

Then(/^il reste (\d+) étiquettes à poser$/, async ({ page }, nombre: string) => {
  await expect(page.getByTestId("etiquette")).toHaveCount(Number(nombre));
});

Then(/^l'étiquette « ([^«»]+) » revient parmi les étiquettes à poser$/, async ({ page }, etiquette: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "encouragement");
  await expect(etiquetteAPlacer(page, etiquette)).toHaveCount(1);
  await expect(page.getByTestId("etiquette-posee").filter({ hasText: exactement(etiquette) })).toHaveCount(0);
  await expect(page.locator('[data-testid="place"][data-remplie="true"]').filter({ hasText: exactement(etiquette) })).toHaveCount(0);
});

Then(/^l'exercice « ([^«»]+) » n'a pas été joué$/, async ({ page }, titre: string) => {
  const lecon = leconCourante(page);
  const questions = questionsDeLaLecon(lecon, positionDeLExercice(lecon, titre));
  expect(questions.length).toBeGreaterThan(0);
  const dites = (await toutesLesParoles(page)).map(normaliser).join(" ");
  for (const question of questions) expect(dites).not.toContain(entendu(question.enonce));
});

// --- Alors : consigne

Then(/^Léa entend Noisette lire « (.+) », puis « (.+) »$/, async ({ page }, consigne: string, indication: string) => {
  const [premiere, seconde] = [entendu(consigne), entendu(indication)];
  await expect.poll(async () => {
    const dites = (await toutesLesParoles(page)).map(normaliser);
    const rangDeLaPremiere = dites.indexOf(premiere);
    if (rangDeLaPremiere >= 0 && dites.indexOf(seconde) > rangDeLaPremiere) return true;
    if (rangDeLaPremiere >= 0) await terminerLaLecture(page);
    return false;
  }, { intervals: [100] }).toBe(true);
});

// --- Alors : ordre

Then(/^l'étiquette « ([^«»]+) » prend la première place$/, async ({ page }, etiquette: string) => {
  const place = page.getByTestId("place").first();
  await expect(place).toHaveAttribute("data-remplie", "true");
  await expect(place).toHaveText(etiquette);
});

Then(/^l'étiquette prend la troisième place$/, async ({ page }) => {
  const place = page.getByTestId("place").nth(2);
  await expect(place).toHaveAttribute("data-remplie", "true");
  await expect(place).toHaveText(dernieresPosees.get(page) ?? "");
});

Then(/^Noisette dit une félicitation$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  expect(FELICITATIONS_DE_NOISETTE).toContain(normaliser((await bulle(page).textContent()) ?? ""));
});

Then(/^Noisette ne demande pas la suite$/, async ({ page }) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation");
  expect(RELANCES_DE_L_ORDRE).not.toContain(normaliser((await bulle(page).textContent()) ?? ""));
});

Then(/^Noisette ne dit aucun encouragement$/, async ({ page }) => {
  await laisserPasserLeDelaiDeLecture(page);
  expect(await bulle(page).getAttribute("data-nature")).not.toBe("encouragement");
  for (const parole of await toutesLesParoles(page)) expect(parole).not.toMatch(/Pas encore celui-là|Ce n'est pas le début/);
});

// --- Alors : texte à trous

Then(/^Léa voit le texte « (.+) », le premier trou mis en avant$/, async ({ page }, texte: string) => {
  await expect(page.getByTestId("texte-a-trous")).toHaveText(texte);
  const premier = page.getByTestId("trou").first();
  await expect(premier).toHaveAttribute("data-etat", "en-cours");
  await expect(premier).toHaveAttribute("aria-current", "true");
  await expect(page.locator('[data-testid="trou"][aria-current="true"]')).toHaveCount(1);
});

Then(/^le premier trou propose « ([^«»]+) » et deux autres mots, tous différents$/, async ({ page }, attendu: string) => {
  await avancerJusquAuxChoix(page);
  const choix = await textesDesChoix(page);
  expect(choix).toHaveLength(3);
  expect(new Set(choix).size).toBe(3);
  expect(choix).toContain(attendu);
});

Then(/^Léa voit « (?!Qui joue \?)([^«»]+) »$/, async ({ page }, phrase: string) => {
  // Story #22 : devant une poésie, c'est la carte de la poésie (titre — auteur) que Léa voit.
  const carte = page.getByTestId("carte-de-la-poesie");
  const texte = page.getByTestId("texte-a-trous");
  await expect(carte.or(texte)).toBeVisible();
  if ((await carte.count()) > 0) await expect(carte.getByRole("heading")).toHaveText(phrase);
  else await expect(texte).toContainText(phrase);
});

Then(/^le trou de « ([^«»]+) » est mis en avant$/, async ({ page }, phrase: string) => {
  await expect(page.getByTestId("trou-annonce")).toHaveText(`Mot manquant dans « ${phrase} »`);
  await expect(page.locator('[data-testid="trou"][data-etat="en-cours"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="trou"][aria-current="true"]')).toHaveCount(1);
});

Then(/^le trou de « ([^«»]+) » propose les choix « ([^«»]+) » et « ([^«»]+) »$/, async ({ page }, phrase: string, premier: string, second: string) => {
  await expect(page.getByTestId("trou-annonce")).toHaveText(`Mot manquant dans « ${phrase} »`);
  await avancerJusquAuxChoix(page);
  expect([...(await textesDesChoix(page))].sort()).toEqual([premier, second].sort());
});

Then(/^les lecteurs d'écran annoncent un mot manquant dans « ([^«»]+) »$/, async ({ page }, phrase: string) => {
  const annonce = page.getByTestId("trou-annonce");
  await expect(annonce).toHaveAttribute("role", "status");
  await expect(annonce).toHaveText(`Mot manquant dans « ${phrase} »`);
});

// --- Alors : petit écran

Then(/^chaque étiquette et chaque maison mesurent au moins 44 px de haut et de large$/, async ({ page }) => {
  const cibles = [
    ...(await page.getByTestId("etiquette").all()),
    ...(await page.getByTestId("maison").all()),
    ...(await page.getByRole("button", { name: /^Poser dans la maison/ }).all()),
  ];
  expect(cibles.length).toBeGreaterThan(0);
  for (const cible of cibles) {
    const boite = await cible.boundingBox();
    const nom = (await cible.textContent())?.trim();
    expect(boite, `« ${nom} » visible`).not.toBeNull();
    expect(boite?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

// --- « Je ne sais pas » en classer et en ordre (appelé par aide-et-je-ne-sais-pas.steps.ts)

export async function aDesEtiquettesAPlacer(page: Page): Promise<boolean> {
  await expect(page.getByTestId("exercice-en-cours")).toBeVisible();
  return await page.getByTestId("etiquettes").isVisible();
}

export async function direJeNeSaisPasSurDesEtiquettes(page: Page): Promise<void> {
  const premiere = (await page.getByTestId("etiquette").first().textContent())?.trim() ?? "";
  etiquettesVisees.set(page, premiere);
  await page.getByTestId("je-ne-sais-pas").click();
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
}

Then(/^la bonne maison de l'étiquette choisie brille$/, async ({ page }) => {
  const exercice = await exerciceEnCours(page);
  const visee = etiquettesVisees.get(page);
  const groupe = itemsDe(exercice).find((item) => item.texte === visee)?.groupe;
  expect(groupe, `groupe de l'étiquette « ${visee} »`).toBeDefined();
  const brillantes = page.locator('[data-testid="maison"][data-brille="true"]');
  await expect(brillantes).toHaveCount(1);
  await expect(brillantes).toHaveAttribute("data-groupe", groupe ?? "");
});

Then(/^l'étiquette qui vient ensuite brille$/, async ({ page }) => {
  const exercice = await exerciceEnCours(page);
  const brillantes = page.locator('[data-testid="etiquette"][data-brille="true"]');
  await expect(brillantes).toHaveCount(1);
  await expect(brillantes).toHaveText(elementsDe(exercice)[0] ?? "");
});

Then(/^Léa doit encore donner elle-même la bonne réponse$/, async ({ page }) => {
  if (await additionAPoserAffichee(page)) return await verifierQueLAdditionResteAPoser(page);
  const exercice = await exerciceEnCours(page);
  if (exercice.type === "dictee") return await verifierQueLaDicteeAttendLaReponse(page);
  expect(await questionsReussies(page)).toBe(0);
  await expect(page.getByTestId("etiquette")).toHaveCount(exercice.type === "classer" ? itemsDe(exercice).length : elementsDe(exercice).length);
  await expect(page.getByTestId("etiquette-posee")).toHaveCount(0);
  await expect(page.locator('[data-testid="place"][data-remplie="true"]')).toHaveCount(0);
  await expect(page.getByTestId("je-ne-sais-pas")).toHaveCount(0);
});
