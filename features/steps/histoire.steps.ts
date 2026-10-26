import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { ecrireDesSeancesTermineesPourLaSerie, jourPrepare } from "../support/serie-api.ts";
import { lireEnRest } from "../support/seances-api.ts";
import { EXPRESSIONS_PAR_PERSONNAGE, FELICITATIONS_COMMUNES } from "./univers.steps.ts";
import { bulle, entendu, jouerLaSeanceComplete, toutesLesParoles } from "./etapes-puis-exercices.steps.ts";
import { ecranDe, leaJoueAvecSonVraiProfil, lecturesParLot, ouvrirLEcran } from "./ecran-mes-medailles.steps.ts";
import { demarrer } from "./exercices-a-choix.steps.ts";
import { Given, Then, When } from "./fixtures.ts";
import { donnerLeSignalDeDepart, laisserPasserLeTemps, reussirDesCalculsDeFluence } from "./calcul-fluence-addition.steps.ts";
import { attendreLaFinDeLaSeance, jouerJusquALaFinDeLaSeance, partie } from "./etoiles-et-fin-de-seance.steps.ts";
import { estSurUnProfilReel } from "./profil-reel.ts";
import { jetonDe, profilDe } from "./profils-enfants.steps.ts";
import { verifierModeDys } from "./reglages.steps.ts";
import { journal, normaliser, terminerLaLecture } from "./voix.steps.ts";
import { preparerLaFluence } from "./calcul-pour-les-autres-stories.steps.ts";

// Story #33 : l'histoire des Savanturiers dans « Mes médailles », la fin de séance et l'écran d'un épisode.
//
// Les séances terminées sont préparées en base (clé service_role réservée à la préparation) pour le vrai profil de l'enfant ;
// elles partent avec lui. Les séances d'aujourd'hui sont jouées par l'interface, avec les étapes des autres stories.

const DELAI_D_UN_APPEL_SERVEUR_MS = 20_000;
const DELAI_DE_L_ENVOI_DIFFERE_MS = 30_000;
const A_DECOUVRIR = "À découvrir";
const TITRE_DE_LA_SECTION = "L'histoire des Savanturiers";

// --- Les éléments

const sectionDeLHistoire = (page: Page): Locator => ecranDe(page).getByTestId("section-de-l-histoire");
const tuileNumero = (page: Page, numero: number): Locator => sectionDeLHistoire(page).getByTestId(`tuile-d-episode-${numero}`);
const toutesLesTuiles = (page: Page): Locator => sectionDeLHistoire(page).getByTestId(/^tuile-d-episode-\d+$/);
const ecranDeLEpisode = (page: Page): Locator => ecranDe(page).getByTestId("ecran-de-l-episode");
const texteDeLEpisode = (page: Page): Locator => ecranDe(page).getByTestId("texte-de-l-episode");
const annonceDuNouvelEpisode = (page: Page): Locator => page.getByTestId("annonce-du-nouvel-episode");
const finDeSeance = (page: Page): Locator => page.getByTestId("fin-de-seance");

function echapper(texte: string): RegExp {
  return new RegExp(`^${texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
}

function tuileDeTitre(page: Page, titre: string): Locator {
  return toutesLesTuiles(page).filter({ hasText: echapper(titre) });
}

// --- Étant donné : les séances terminées

Given(/^(Léa|Tom) a terminé (\d+) séances?$/, async ({ famille, monde, page }, prenom: string, nombre: string) => {
  if (prenom === "Léa") await leaJoueAvecSonVraiProfil(famille, monde, page);
  // Un jour différent par séance, tous avant aujourd'hui : l'exemple ne dépend ni du jour ni des étoiles.
  const jours = Array.from({ length: Number(nombre) }, (_, rang) => jourPrepare(-(rang + 1)));
  await ecrireDesSeancesTermineesPourLaSerie(profilDe(famille, prenom).id, jours);
});

Given(
  /^Léa a fini la fluence « ([^«»]+) », jouée seule, avec (\d+) calculs? réussis?$/,
  async ({ page }, exercice: string, reussis: string) => {
    preparerLaFluence(page, exercice);
    await jouerLaFluenceSeule(page, Number(reussis));
    await attendreLaFinDeLaSeance(page);
  },
);

async function jouerLaFluenceSeule(page: Page, reussis: number): Promise<void> {
  await demarrer(page);
  await donnerLeSignalDeDepart(page);
  await reussirDesCalculsDeFluence(page, reussis);
  await laisserPasserLeTemps(page);
}

When(/^le temps de la fluence est écoulé avec (\d+) calculs? réussis?$/, { tags: "@issue-33" }, async ({ page }, reussis: string) => {
  await jouerLaFluenceSeule(page, Number(reussis));
  await attendreLaFinDeLaSeance(page);
});

Given(/^le réseau est revenu sur la tablette$/, async ({ famille, page }) => {
  await page.context().setOffline(false);
  const jeton = await jetonDe(famille, "Paul");
  await expect.poll(async () => (await lireEnRest(jeton, "seances_terminees", profilDe(famille, "Léa").id)).lignes.length, {
    message: "la séance gardée sur la tablette est envoyée au retour du réseau",
    intervals: [500],
    timeout: DELAI_DE_L_ENVOI_DIFFERE_MS,
  }).toBeGreaterThan(0);
});

Given(/^Léa joue avec un profil de démonstration, sans compte parent$/, async ({ page }) => {
  // Le profil de démonstration est le profil préparé du Contexte, sans parent connecté : aucun profil réel, aucune session.
  expect(estSurUnProfilReel(page), "aucun profil réel n'est créé pour Léa").toBe(false);
  const oublierLaSession = () => {
    for (const cle of Object.keys(localStorage)) if (cle.startsWith("sb-")) localStorage.removeItem(cle);
  };
  await page.addInitScript(oublierLaSession);
  if (page.url() !== "about:blank") await page.evaluate(oublierLaSession);
});

// --- Les tuiles de l'histoire

async function attendreLaSection(page: Page): Promise<void> {
  await expect(sectionDeLHistoire(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(toutesLesTuiles(page)).toHaveCount(20);
}

async function verifierLaTuile(page: Page, numero: number, libelle: string): Promise<void> {
  const tuile = tuileNumero(page, numero);
  await expect(tuile, `tuile ${numero}`).toHaveText(libelle);
  if (libelle === A_DECOUVRIR) {
    await expect(tuile).toBeDisabled();
    await expect(tuile).toHaveAttribute("data-ouvert", "false");
  } else {
    await expect(tuile).toBeEnabled();
    await expect(tuile).toHaveAttribute("data-ouvert", "true");
  }
}

async function verifierLesTuiles(page: Page, de: number, a: number, libelle: string): Promise<void> {
  await attendreLaSection(page);
  for (let numero = de; numero <= a; numero++) await verifierLaTuile(page, numero, libelle);
}

Then(/^les (\d+) tuiles de l'histoire montrent « À découvrir »$/, async ({ page }, nombre: string) => {
  await verifierLesTuiles(page, 1, Number(nombre), A_DECOUVRIR);
});

Then(/^les tuiles (\d+) à (\d+) de l'histoire montrent « À découvrir »$/, async ({ page }, de: string, a: string) => {
  await verifierLesTuiles(page, Number(de), Number(a), A_DECOUVRIR);
});

Then(
  /^les tuiles (\d+) et (\d+) de l'histoire montrent « ([^«»]+) » et « ([^«»]+) »$/,
  async ({ page }, premiere: string, seconde: string, titre1: string, titre2: string) => {
    await attendreLaSection(page);
    await verifierLaTuile(page, Number(premiere), titre1);
    await verifierLaTuile(page, Number(seconde), titre2);
  },
);

Then(/^la tuile (\d+) de l'histoire montre « ([^«»]+) »$/, async ({ page }, numero: string, titre: string) => {
  await attendreLaSection(page);
  await verifierLaTuile(page, Number(numero), titre);
});

Then(/^les tuiles de l'histoire montrent, dans l'ordre :$/, async ({ page }, tableau: DataTable) => {
  const attendues = tableau.hashes().map((ligne) => String(ligne["tuile"]));
  await attendreLaSection(page);
  expect(attendues).toHaveLength(20);
  for (const [rang, titre] of attendues.entries()) await verifierLaTuile(page, rang + 1, titre);
});

Then(/^aucune section « L'histoire des Savanturiers » n'apparaît$/, async ({ page }) => {
  const ecran = ecranDe(page);
  // La bulle du personnage guide n'apparaît qu'une fois la lecture des sections terminée.
  await expect(ecran.getByTestId("parole")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(sectionDeLHistoire(page)).toHaveCount(0);
  await expect(ecran.getByRole("heading", { level: 2, name: TITRE_DE_LA_SECTION })).toHaveCount(0);
});

Then(/^chaque tuile de l'histoire mesure au moins 44 px de haut$/, async ({ page }) => {
  await attendreLaSection(page);
  for (const tuile of await toutesLesTuiles(page).all()) {
    const boite = await tuile.boundingBox();
    const nom = (await tuile.textContent()) ?? "";
    expect(boite, `tuile « ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de la tuile « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, { tags: "@issue-33" }, async ({ page }, annonce: string) => {
  if (annonce.startsWith("Nouvel épisode !")) {
    await expect(annonceDuNouvelEpisode(page)).toHaveAttribute("role", "status", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await expect(annonceDuNouvelEpisode(page)).toHaveAccessibleName(annonce);
    return;
  }
  await attendreLaSection(page);
  await expect(sectionDeLHistoire(page).getByRole("button", { name: annonce, exact: true })).toHaveCount(1);
});

// --- Choisir une tuile

When(/^Léa choisit la tuile « ([^«»]+) »$/, async ({ page }, titre: string) => {
  await attendreLaSection(page);
  await tuileDeTitre(page, titre).click();
});

When(/^Léa choisit la tuile « ([^«»]+) », au clavier seulement$/, async ({ page }, titre: string) => {
  await attendreLaSection(page);
  await tuileDeTitre(page, titre).focus();
  await page.keyboard.press("Enter");
});

When(/^Léa choisit la tuile (\d+) de l'histoire$/, async ({ page }, numero: string) => {
  await attendreLaSection(page);
  // Une tuile « À découvrir » est désactivée : l'enfant a beau la toucher, rien ne s'ouvre.
  await tuileNumero(page, Number(numero)).click({ force: true });
});

// --- L'écran d'un épisode

async function ouvrirLEpisodeDepuisMesMedailles(famille: Parameters<typeof ouvrirLEcran>[0], page: Page, titre: string): Promise<void> {
  await ouvrirLEcran(famille, page, "toucher");
  await attendreLaSection(page);
  await tuileDeTitre(page, titre).click();
  await expect(ecranDeLEpisode(page)).toBeVisible();
}

Given(/^Léa lit l'épisode « ([^«»]+) » depuis « Mes médailles »$/, async ({ famille, page }, titre: string) => {
  await ouvrirLEpisodeDepuisMesMedailles(famille, page, titre);
});

Then(
  /^l'écran de l'épisode s'intitule « ([^«»]+) », avec « ([^«»]+) »$/,
  { tags: "@issue-33" },
  async ({ page }, titre: string, position: string) => {
    await expect(ecranDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await expect(ecranDeLEpisode(page).getByRole("heading", { level: 1, name: titre, exact: true })).toBeVisible();
    await expect(ecranDe(page).getByTestId("position-de-l-episode")).toHaveText(position);
  },
);

Then(/^l'écran de l'épisode propose « ([^«»]+) » et « ([^«»]+) »$/, async ({ page }, premier: string, second: string) => {
  await expect(ecranDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (const nom of [premier, second]) {
    await expect(ecranDeLEpisode(page).getByRole("button", { name: nom, exact: true })).toBeVisible();
  }
});

Then(/^l'écran de l'épisode ne propose pas « ([^«»]+) »$/, async ({ page }, nom: string) => {
  await expect(ecranDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(ecranDeLEpisode(page).getByRole("button", { name: nom, exact: true })).toHaveCount(0);
});

Then(/^« Réécouter » et « Fermer le livre » mesurent au moins 44 px de haut$/, async ({ page }) => {
  await expect(ecranDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (const nom of ["Réécouter", "Fermer le livre"]) {
    const boite = await ecranDeLEpisode(page).getByRole("button", { name: nom, exact: true }).boundingBox();
    expect(boite, `bouton « ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

When(/^Léa (?:choisit|a choisi) « (Lire l'épisode|Épisode suivant|Fermer le livre) »$/, async ({ page }, nom: string) => {
  const conteneur = nom === "Lire l'épisode" ? finDeSeance(page) : ecranDeLEpisode(page);
  await conteneur.getByRole("button", { name: nom, exact: true }).click();
});

Then(/^le texte de l'épisode se termine par « ([^«»]+) »$/, async ({ page }, fin: string) => {
  await expect(texteDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  expect(normaliser((await texteDeLEpisode(page).textContent()) ?? "").endsWith(fin)).toBe(true);
});

Then(/^Léa lit « ([^«»]+) » dans le texte de l'épisode$/, async ({ page }, phrase: string) => {
  await expect(texteDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  expect(normaliser((await texteDeLEpisode(page).textContent()) ?? "")).toContain(phrase);
});

Then(
  /^elle voit (Noisette|Coach Léo|Capitaine Sam|Lumi) sur l'écran de l'épisode « ([^«»]+) »$/,
  async ({ page }, personnage: string, titre: string) => {
    await expect(ecranDeLEpisode(page).getByRole("heading", { level: 1, name: titre, exact: true })).toBeVisible({
      timeout: DELAI_D_UN_APPEL_SERVEUR_MS,
    });
    await expect(ecranDeLEpisode(page).getByRole("img", { name: personnage, exact: true })).toBeVisible();
  },
);

Then(
  /^Léa voit le titre et le texte de l'épisode en mode dys : police Andika, lettres, mots et lignes espacés$/,
  async ({ page }) => {
    await expect(texteDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await verifierModeDys(page, [ecranDeLEpisode(page).getByRole("heading", { level: 1 }), texteDeLEpisode(page)], true);
  },
);

// --- La voix : le texte de l'épisode

async function lotsContenant(page: Page, fragment: string): Promise<boolean> {
  const voulu = normaliser(entendu(fragment));
  const lots = await lecturesParLot(page);
  if (lots.some((lot) => lot.includes(voulu))) return true;
  await terminerLaLecture(page);
  return false;
}

Then(
  /^Léa entend (Noisette|Coach Léo|Capitaine Sam|Lumi) lire le texte de l'épisode, qui commence par « ([^«»]+) »$/,
  async ({ page }, _personnage: string, debut: string) => {
    await expect.poll(() => lotsContenant(page, debut), { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
  },
);

Then(/^Léa entend Noisette lire « ([^«»]+) », puis le texte de l'épisode$/, async ({ page }, titre: string) => {
  await expect(texteDeLEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const premierePhrase = normaliser((await texteDeLEpisode(page).textContent()) ?? "").split(/(?<=[.!?])\s/)[0] ?? "";
  await expect.poll(async () => {
    const lots = await lecturesParLot(page);
    const lot = lots.find((candidat) => candidat.startsWith(normaliser(entendu(titre))));
    if (lot !== undefined && lot.includes(normaliser(entendu(premierePhrase)))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

const lecturesAvantLaRelecture = new WeakMap<Page, number>();

When(/^Léa demande à réécouter l'épisode$/, async ({ page }) => {
  await expect.poll(async () => (await lecturesParLot(page)).length).toBeGreaterThan(0);
  lecturesAvantLaRelecture.set(page, (await lecturesParLot(page)).length);
  await ecranDeLEpisode(page).getByRole("button", { name: "Réécouter", exact: true }).click();
});

Then(/^Léa entend Noisette lire de nouveau le texte de l'épisode depuis le début$/, async ({ page }) => {
  const avant = lecturesAvantLaRelecture.get(page) ?? 1;
  const titre = (await ecranDeLEpisode(page).getByRole("heading", { level: 1 }).textContent()) ?? "";
  await expect.poll(async () => {
    const lots = await lecturesParLot(page);
    if (lots.length > avant && (lots[lots.length - 1] ?? "").startsWith(normaliser(entendu(titre)))) return true;
    if (lots.length === avant) await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Given(/^Noisette est en train de lire le texte de l'épisode$/, async ({ page }) => {
  await expect.poll(async () => (await journal(page)).actifs, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBeGreaterThan(0);
});

Then(/^chaque mot du texte de l'épisode est surligné au moment où Noisette le prononce$/, async ({ page }) => {
  await expect.poll(async () => (await journal(page)).speaks, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBeGreaterThan(0);
  const titre = (await ecranDeLEpisode(page).getByRole("heading", { level: 1 }).textContent()) ?? "";
  const motsDuTitre = titre.split(/\s+/).filter((mot) => /[\p{L}\p{N}]/u.test(mot)).length;
  const mots = await texteDeLEpisode(page).locator("[data-mot]").allTextContents();
  expect(mots.length).toBeGreaterThan(0);
  const surlignes = texteDeLEpisode(page).locator("[data-prononce='true']");
  for (const [rang, mot] of mots.entries()) {
    await page.evaluate((rangDuMot) => {
      const faux = Reflect.get(window, "__faux") as {
        enonces: Array<{ lot: number; enonce: { text: string; onboundary: ((e: { name: string; charIndex: number }) => void) | null } }>;
        lot: number;
      };
      let motsAvant = 0;
      for (const { lot, enonce } of faux.enonces) {
        if (lot !== faux.lot) continue;
        const debuts = [...enonce.text.matchAll(/\S+/gu)].filter((m) => /[\p{L}\p{N}]/u.test(m[0])).map((m) => m.index);
        if (rangDuMot < motsAvant + debuts.length) {
          enonce.onboundary?.({ name: "word", charIndex: debuts[rangDuMot - motsAvant] ?? 0 });
          return;
        }
        motsAvant += debuts.length;
      }
    }, motsDuTitre + rang);
    await expect(surlignes).toHaveCount(1);
    await expect(surlignes).toHaveText(mot);
    await expect(surlignes).toHaveAttribute("data-mot", String(rang));
  }
});

Then(/^plus aucun mot n'est surligné quand la lecture est finie$/, { tags: "@issue-33" }, async ({ page }) => {
  await expect.poll(async () => {
    await terminerLaLecture(page);
    return await texteDeLEpisode(page).locator("[data-prononce='true']").count();
  }, { intervals: [100] }).toBe(0);
});

// --- La voix : la section

When(/^Léa demande à écouter l'histoire$/, async ({ page }) => {
  await attendreLaSection(page);
  await sectionDeLHistoire(page).getByRole("button", { name: "Écouter", exact: true }).click();
});

// --- La fin de la séance

async function verifierLAnnonce(page: Page, titre: string): Promise<void> {
  const annonce = annonceDuNouvelEpisode(page);
  await expect(annonce).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonce.getByText("Nouvel épisode !", { exact: true })).toBeVisible();
  await expect(annonce.getByText(titre, { exact: true })).toBeVisible();
}

Then(
  /^la fin de la séance(?: de révision)? annonce « Nouvel épisode ! » avec « ([^«»]+) »$/,
  { tags: "@issue-33" },
  async ({ page }, titre: string) => {
    await verifierLAnnonce(page, titre);
  },
);

Then(/^la fin de la séance propose « Lire l'épisode »$/, async ({ page }) => {
  await expect(finDeSeance(page).locator(".actions-de-fin").getByRole("button", { name: "Lire l'épisode", exact: true })).toBeVisible({
    timeout: DELAI_D_UN_APPEL_SERVEUR_MS,
  });
});

async function verifierQuAucuneAnnonceNApparait(page: Page): Promise<void> {
  // Le personnage guide ne dit sa phrase de fin qu'une fois décidé s'il y a un épisode ouvert : on l'attend.
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDuNouvelEpisode(page)).toBeEmpty();
  await expect(annonceDuNouvelEpisode(page)).toBeHidden();
}

Then(/^aucune annonce de nouvel épisode n'apparaît à la fin de la séance$/, async ({ page }) => {
  await verifierQuAucuneAnnonceNApparait(page);
});

Then(/^aucune annonce de nouvel épisode n'apparaît à la fin du test de départ$/, async ({ page }) => {
  await expect(page.getByTestId("fin-du-test-de-depart")).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDuNouvelEpisode(page)).toHaveCount(0);
});

Given(
  /^la fin de la séance de la leçon « ([^«»]+) » vient d'annoncer « ([^«»]+) »$/,
  async ({ famille, page }, titreDeLaLecon: string, titreDeLEpisode: string) => {
    await jouerLaSeanceComplete(page, titreDeLaLecon);
    const courante = partie(famille);
    courante.erreursEnTout = 0;
    courante.erreursParExercice.clear();
    await jouerJusquALaFinDeLaSeance(famille, page);
    await verifierLAnnonce(page, titreDeLEpisode);
  },
);

async function positionVerticale(element: Locator, nom: string): Promise<number> {
  await expect(element, nom).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const boite = await element.boundingBox();
  expect(boite, `${nom} visible`).not.toBeNull();
  return boite?.y ?? 0;
}

Then(
  /^la fin de la séance annonce, dans l'ordre, « ([^«»]+) » puis « Nouvel épisode ! » avec « ([^«»]+) »$/,
  async ({ page }, objet: string, titre: string) => {
    const cabane = page.getByTestId("annonce-de-la-cabane");
    await expect(cabane.getByText(objet, { exact: true })).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
    await verifierLAnnonce(page, titre);
    expect(await positionVerticale(cabane, "annonce pour la cabane"), "la cabane est au-dessus de l'épisode").toBeLessThan(
      await positionVerticale(annonceDuNouvelEpisode(page), "annonce du nouvel épisode"),
    );
  },
);

Then(
  /^la zone des nouveautés de la fin de la séance montre, dans l'ordre, l'objet de la cabane, le nouvel épisode, puis le badge$/,
  async ({ page }) => {
    const [cabane, episode, badge] = [
      await positionVerticale(page.getByTestId("annonce-de-la-cabane"), "annonce pour la cabane"),
      await positionVerticale(annonceDuNouvelEpisode(page), "annonce du nouvel épisode"),
      await positionVerticale(page.getByTestId("annonce-de-nouveau-badge"), "annonce de nouveau badge"),
    ];
    expect(cabane, "la cabane est au-dessus de l'épisode").toBeLessThan(episode);
    expect(episode, "l'épisode est au-dessus du badge").toBeLessThan(badge);
  },
);

Then(/^l'annonce du nouvel épisode apparaît sans mouvement$/, async ({ page }) => {
  await expect(annonceDuNouvelEpisode(page)).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  await expect(annonceDuNouvelEpisode(page)).toHaveCSS("animation-name", "none");
});

Then(/^Noisette termine les paroles de fin de fluence par « ([^«»]+) »$/, async ({ page }, fin: string) => {
  await expect(bulle(page)).toContainText(fin, { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  expect(normaliser((await bulle(page).textContent()) ?? "").endsWith(fin)).toBe(true);
  const sansEspace = (t: string) => t.replace(/[\s,]+/g, "");
  await expect.poll(async () => {
    const dites = sansEspace((await toutesLesParoles(page)).join(""));
    if (dites.endsWith(sansEspace(entendu(fin))) || dites.includes(sansEspace(entendu(fin)))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Then(/^Capitaine Sam dit une félicitation, suivie de « (.+) »$/, async ({ page }, explication: string) => {
  await expect(bulle(page)).toHaveAttribute("data-nature", "felicitation", { timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  const texte = normaliser((await bulle(page).textContent()) ?? "");
  expect(texte.endsWith(` ${explication}`), texte).toBe(true);
  const felicitations = [...FELICITATIONS_COMMUNES, ...(EXPRESSIONS_PAR_PERSONNAGE["Capitaine Sam"] ?? [])];
  expect(felicitations).toContain(texte.slice(0, texte.length - explication.length - 1));
  const sansEspace = (t: string) => t.replace(/[\s,]+/g, "");
  await expect.poll(async () => {
    const dites = (await toutesLesParoles(page)).join("");
    if (sansEspace(dites).includes(sansEspace(entendu(texte)))) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [100], timeout: DELAI_D_UN_APPEL_SERVEUR_MS }).toBe(true);
});

Then(/^Léa atteint « Lire l'épisode » au clavier seulement$/, async ({ page }) => {
  const bouton = finDeSeance(page).getByRole("button", { name: "Lire l'épisode", exact: true });
  await expect(bouton).toBeVisible({ timeout: DELAI_D_UN_APPEL_SERVEUR_MS });
  for (let essai = 0; essai < 10; essai++) {
    if (await bouton.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  await expect(bouton).toBeFocused();
});
