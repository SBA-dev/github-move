import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { LECONS_DU_PARCOURS, servirLaBibliothequeDuParcours } from "../support/bibliotheque-du-parcours.ts";
import { servirLaBibliothequeDuTestDeDepart } from "../support/bibliotheque-du-test-de-depart.ts";
import type { Famille } from "../support/famille.ts";
import { lireEnRestLeNiveauDuProfil } from "../support/profils-api.ts";
import { ecrireUnResultatDeLecon } from "../support/supabase-test.ts";
import { attendreLaFinDeLaSeance } from "./etoiles-et-fin-de-seance.steps.ts";
import { utiliseLaBibliothequeDeLAccueil } from "../support/bibliotheque-de-l-accueil.ts";
import { commencerLaSeanceComplete, etat, type LeconBrute, leconDeTitre, ouvrirLaPageDeLaLecon, recipient } from "./etapes-puis-exercices.steps.ts";
import {
  avancerJusquAuxChoix,
  bulleDeChoix,
  questionsDeLaSeance,
  questionsReussies,
  repondre,
  textesDesChoixPossibles,
} from "./exercices-a-choix.steps.ts";
import { choisirLeaSur } from "./profil-reel.ts";
import { jetonDe, choisirSonProfil, ouvrirQuiJoue, profilDe } from "./profils-enfants.steps.ts";
import { Given, Then, When } from "./fixtures.ts";

// Story #25 : parcours par matière (aucun verrou).
// La bibliothèque de test (identifiants « e2e-25- ») remplace celle de l'application dans le navigateur de Léa.
// La progression qui fait le parcours est préparée directement dans `resultats_des_lecons` (clé service_role réservée
// à cette préparation) ; les étoiles d'une séance jouée restent en mémoire dans le navigateur (le serveur ne connaît
// pas les leçons de test). L'enfant, lui, agit toujours par l'interface.

// --- Page où se lit le parcours (la tablette, sauf « sur le téléphone de Marie »)

const pagesDuParcours = new WeakMap<Famille, Page>();

function pageDuParcours(famille: Famille, page: Page): Page {
  return pagesDuParcours.get(famille) ?? page;
}

// --- Ouvrir le parcours, choisir une matière

const DELAI_DE_LA_LECTURE_SANS_RESEAU_MS = 25_000;
const ETOILES_PAR_SEANCE: Readonly<Record<number, number>> = { 1: 4, 2: 1, 3: 0 };

function boutonMonParcours(page: Page): Locator {
  return page.getByRole("button", { name: "Mon parcours", exact: true });
}

function ongletsDesMatieres(page: Page): Locator {
  return page.getByRole("tablist", { name: "Matières" }).getByRole("tab");
}

function ongletDe(page: Page, matiere: string): Locator {
  return page.getByRole("tab", { name: matiere, exact: true });
}

function titreDuParcours(page: Page): Locator {
  return page.getByTestId("titre-du-parcours");
}

function leconsDuParcours(page: Page): Locator {
  return page.getByTestId("lecon-du-parcours");
}

// « Qui joue ? » montre d'abord la copie gardée sur l'appareil, puis la relit sur le serveur : après un changement de
// niveau fait par le parent, on attend que la liste ait rattrapé le niveau enregistré avant de choisir Léa.
export async function choisirLea(famille: Famille, page: Page): Promise<void> {
  const profil = profilDe(famille, "Léa");
  const niveau = await lireEnRestLeNiveauDuProfil(await jetonDe(famille, profil.parent), profil.id);
  const quiJoue = await ouvrirQuiJoue(page);
  await expect(quiJoue.getByTestId("profil-a-choisir").filter({ hasText: "Léa" }).first()).toContainText(`${niveau} ·`);
  await choisirSonProfil(page, "Léa");
}

async function ouvrirLeParcours(famille: Famille, page: Page): Promise<void> {
  if (await page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true }).isVisible()) return;
  if (!(await boutonMonParcours(page).isVisible())) await choisirLea(famille, page);
  await boutonMonParcours(page).click();
  await expect(page.getByRole("heading", { level: 2, name: "Mon parcours", exact: true })).toBeVisible();
  // Sans réseau, la lecture des étoiles sur le serveur échoue avant que le parcours ne s'affiche (environ 8 s mesurées).
  await expect(page.getByText("Chargement du parcours")).toHaveCount(0, { timeout: DELAI_DE_LA_LECTURE_SANS_RESEAU_MS });
}

async function choisirLaMatiere(page: Page, matiere: string): Promise<void> {
  const onglet = ongletDe(page, matiere);
  if ((await onglet.getAttribute("aria-selected")) !== "true") await onglet.click();
  await expect(onglet).toHaveAttribute("aria-selected", "true");
}

export async function ouvrirLeParcoursDeFrancais(famille: Famille, page: Page): Promise<void> {
  await ouvrirLeParcours(famille, page);
  await choisirLaMatiere(page, "Français");
}

async function revenirEnArriere(page: Page): Promise<void> {
  await page.goBack();
}

// --- Séance jouée par l'interface

function repartir(total: number, questions: number): number[] {
  const parQuestion = Array.from({ length: questions }, () => 0);
  for (let rang = 0; rang < total && questions > 0; rang++) parQuestion[rang % questions]! += 1;
  return parQuestion;
}

async function faireUneErreur(page: Page): Promise<void> {
  await avancerJusquAuxChoix(page);
  const bonne = questionsDeLaSeance(page)[await questionsReussies(page)]?.reponse;
  const fausse = (await textesDesChoixPossibles(page)).find((texte) => texte !== bonne);
  if (fausse === undefined) throw new Error("Aucun mauvais choix possible");
  await repondre(page, fausse);
}

async function jouerLaSeanceCompleteAvecErreurs(page: Page, titre: string, erreurs: number): Promise<void> {
  await ouvrirLaPageDeLaLecon(page, titre);
  await commencerLaSeanceComplete(page);
  const questions = questionsDeLaSeance(page);
  const parQuestion = repartir(erreurs, questions.length);
  for (const [rang, question] of questions.entries()) {
    for (let i = 0; i < (parQuestion[rang] ?? 0); i++) await faireUneErreur(page);
    await avancerJusquAuxChoix(page);
    await bulleDeChoix(page, question.reponse).click();
    if (rang < questions.length - 1) await expect(recipient(page)).toHaveAttribute("data-questions-reussies", String(rang + 1));
  }
  await attendreLaFinDeLaSeance(page);
}

// --- Étant donné

Given(/^la bibliothèque de test du parcours est servie$/, async ({ page }) => {
  etat(page).injectees.push(...(LECONS_DU_PARCOURS as LeconBrute[]));
});

async function preparerLesEtoiles(famille: Famille, page: Page, prenom: string, lecons: ReadonlyArray<{ titre: string; etoiles: number }>) {
  const profil = profilDe(famille, prenom);
  for (const { titre, etoiles } of lecons) await ecrireUnResultatDeLecon(profil.id, leconDeTitre(page, titre).id, etoiles);
}

Given(/^(Léa|Tom) a pour meilleures étoiles :$/, async ({ famille, page }, prenom: string, tableau: DataTable) => {
  const lecons = tableau.hashes().map((ligne) => ({ titre: String(ligne["leçon"]), etoiles: Number(ligne["étoiles"]) }));
  await preparerLesEtoiles(famille, page, prenom, lecons);
});

Given(/^Léa a réussi (\d+) leçons?(?:\(s\))? de français du CE1$/, async ({ famille, page, $tags }, nombre: string) => {
  // Story #26 : la bibliothèque de test des leçons des classes d'avant a ses propres identifiants (étape « … est servie »).
  const bibliotheque = $tags.includes("@issue-26") || utiliseLaBibliothequeDeLAccueil($tags) ? etat(page).injectees : LECONS_DU_PARCOURS;
  const lecons = bibliotheque.filter((l) => l.matiere === "francais" && l.niveau === "CE1")
    .sort((a, b) => a.ordre - b.ordre)
    .slice(0, Number(nombre))
    .map((l) => ({ titre: l.titre, etoiles: 1 }));
  await preparerLesEtoiles(famille, page, "Léa", lecons);
});

Given(/^Léa a terminé une séance de la leçon « ([^«»]+) » avec (\d) étoiles?$/, async ({ page }, titre: string, etoiles: string) => {
  await jouerLaSeanceCompleteAvecErreurs(page, titre, ETOILES_PAR_SEANCE[Number(etoiles)] ?? 0);
  await page.getByTestId("fin-de-seance").getByRole("button", { name: "Accueil", exact: true }).click();
});

Given(/^Léa a ouvert (?:son parcours|le parcours de français)(?: depuis son accueil)?$/, async ({ famille, page }) => {
  await ouvrirLeParcoursDeFrancais(famille, page);
});

Given(/^Léa a choisi « ([^«»]+) » dans son parcours, puis est revenue à son accueil$/, async ({ famille, page }, matiere: string) => {
  await ouvrirLeParcours(famille, page);
  await choisirLaMatiere(page, matiere);
  await revenirEnArriere(page);
  await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
});

// --- Quand

When(/^Léa ouvre son parcours$/, async ({ famille, page }) => {
  await ouvrirLeParcours(famille, page);
});

When(/^Léa ouvre le parcours de français$/, async ({ famille, page }) => {
  await ouvrirLeParcoursDeFrancais(famille, page);
});

When(/^Léa ouvre le parcours de français sur le téléphone de Marie$/, async ({ famille, $tags }) => {
  const telephone = await famille.page("telephone");
  if ((await famille.session(telephone)) === null) await famille.connecterSansEmail("telephone", "Marie");
  if ($tags.includes("@issue-27")) await servirLaBibliothequeDuTestDeDepart(telephone);
  else await servirLaBibliothequeDuParcours(telephone);
  await choisirLeaSur(telephone);
  pagesDuParcours.set(famille, telephone);
  await ouvrirLeParcoursDeFrancais(famille, telephone);
});

When(/^Léa choisit « ([^«»]+) » dans son parcours$/, async ({ famille, page }, matiere: string) => {
  await ouvrirLeParcours(famille, page);
  await choisirLaMatiere(page, matiere);
});

When(/^Léa revient en arrière$/, async ({ page }) => {
  await revenirEnArriere(page);
});

When(
  /^Léa ouvre la leçon « ([^«»]+) » depuis son parcours(?: (au toucher|au clavier))?$/,
  async ({ page }, titre: string, moyen: string | undefined) => {
    const lecon = page.getByRole("button", { name: new RegExp(`^${echapper(titre)}(?:, [A-Z0-9]+)? : `) });
    etat(page).courante = leconDeTitre(page, titre);
    if (moyen === "au clavier") {
      await lecon.focus();
      await page.keyboard.press("Enter");
    } else {
      await lecon.click();
    }
  },
);

When(/^Léa passe à l'onglet de matière suivant au clavier$/, async ({ page }) => {
  await page.getByRole("tab", { selected: true }).focus();
  await page.keyboard.press("ArrowRight");
});

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- Alors : titre, onglets

function titresCites(liste: string): string[] {
  return [...liste.matchAll(/« ([^«»]+) »/g)].map((m) => m[1] as string);
}

Then(/^le titre du parcours est « ([^«»]+) »$/, async ({ famille, page }, titre: string) => {
  await expect(titreDuParcours(pageDuParcours(famille, page))).toHaveText(titre);
});

Then(/^les onglets du parcours sont (« .+ »)$/, async ({ famille, page }, liste: string) => {
  const cible = pageDuParcours(famille, page);
  await expect(ongletsDesMatieres(cible)).toHaveText(titresCites(liste));
});

Then(/^aucun onglet « ([^«»]+) » n'est proposé$/, async ({ famille, page }, matiere: string) => {
  const cible = pageDuParcours(famille, page);
  await expect(ongletsDesMatieres(cible).first()).toBeVisible();
  await expect(ongletDe(cible, matiere)).toHaveCount(0);
});

Then(/^Léa lit « ([^«»]+) »$/, async ({ page }, message: string) => {
  await expect(page.getByText(message, { exact: true })).toBeVisible();
});

Then(/^aucun onglet de matière n'est proposé$/, async ({ page }) => {
  await expect(page.getByRole("tablist", { name: "Matières" })).toHaveCount(0);
  await expect(page.getByRole("tab")).toHaveCount(0);
});

// --- Alors : leçons

Then(/^le parcours montre, dans l'ordre, (« .+ »)$/, async ({ famille, page }, liste: string) => {
  const cible = pageDuParcours(famille, page);
  const titres = titresCites(liste);
  await expect(leconsDuParcours(cible)).toHaveCount(titres.length);
  for (const [rang, titre] of titres.entries()) {
    await expect(leconsDuParcours(cible).nth(rang)).toHaveAccessibleName(new RegExp(`^${echapper(titre)}(?:, [A-Z0-9]+)? : `));
  }
});

Then(/^aucune leçon du CP ni du CE2 n'y apparaît$/, async ({ famille, page }) => {
  const cible = pageDuParcours(famille, page);
  await expect(leconsDuParcours(cible).first()).toBeVisible();
  for (const lecon of LECONS_DU_PARCOURS.filter((l) => l.niveau === "CP" || l.niveau === "CE2")) {
    await expect(cible.getByRole("button", { name: new RegExp(`^${echapper(lecon.titre)} : `) })).toHaveCount(0);
  }
});

Then(/^les leçons du parcours sont numérotées (« .+ »)$/, async ({ famille, page }, liste: string) => {
  const cible = pageDuParcours(famille, page);
  await expect(cible.getByTestId("place-de-la-lecon")).toHaveText(titresCites(liste));
});

const ETATS_DU_PARCOURS = /^(à toi|à découvrir|réussie au test de départ|réussie, (\d) étoiles?)$/;

async function verifierUneLecon(cible: Page, rang: number, titre: string, etatAttendu: string): Promise<void> {
  const lecon = leconsDuParcours(cible).nth(rang);
  const correspondance = ETATS_DU_PARCOURS.exec(etatAttendu);
  if (!correspondance) throw new Error(`État de leçon inconnu : « ${etatAttendu} »`);
  if (correspondance[1] === "à toi") {
    await expect(lecon).toHaveAttribute("data-etat", "prochaine");
    await expect(lecon).toHaveAccessibleName(`${titre} : à toi !`);
    await expect(lecon.getByTestId("etat-de-la-lecon")).toHaveText("À toi !");
  } else if (correspondance[1] === "réussie au test de départ") {
    await expect(lecon).toHaveAttribute("data-etat", "reussieAuTestDeDepart");
    await expect(lecon).toHaveAccessibleName(`${titre} : réussie au test de départ`);
    await expect(lecon.getByTestId("etat-de-la-lecon")).toHaveText("✓ Test de départ");
  } else if (correspondance[1] === "à découvrir") {
    await expect(lecon).toHaveAttribute("data-etat", "aDecouvrir");
    await expect(lecon).toHaveAccessibleName(`${titre} : à découvrir`);
    await expect(lecon.getByTestId("etat-de-la-lecon")).toHaveText("À découvrir");
  } else {
    const etoiles = Number(correspondance[2]);
    await expect(lecon).toHaveAttribute("data-etat", "reussie");
    await expect(lecon).toHaveAccessibleName(`${titre} : réussie, ${etoiles} étoile${etoiles > 1 ? "s" : ""} sur 3`);
    await expect(lecon.getByTestId("etat-de-la-lecon")).toContainText("★".repeat(etoiles));
  }
}

Then(/^le parcours montre :$/, async ({ famille, page }, tableau: DataTable) => {
  const cible = pageDuParcours(famille, page);
  const lignes = tableau.hashes();
  await expect(leconsDuParcours(cible)).toHaveCount(lignes.length);
  for (const [rang, ligne] of lignes.entries()) {
    await expect(cible.getByTestId("place-de-la-lecon").nth(rang)).toHaveText(`Leçon ${String(ligne["place"])}`);
    await verifierUneLecon(cible, rang, String(ligne["leçon"]), String(ligne["état"]));
  }
});

async function lecon(cible: Page, titre: string): Promise<Locator> {
  const bouton = cible.getByRole("button", { name: new RegExp(`^${echapper(titre)}(?:, [A-Z0-9]+)? : `) });
  await expect(bouton).toHaveCount(1);
  return bouton;
}

Then(/^le parcours montre « ([^«»]+) » réussie avec (\d) étoiles?$/, async ({ famille, page }, titre: string, etoiles: string) => {
  const cible = pageDuParcours(famille, page);
  const nombre = Number(etoiles);
  const bouton = await lecon(cible, titre);
  await expect(bouton).toHaveAttribute("data-etat", "reussie");
  await expect(bouton).toHaveAccessibleName(`${titre} : réussie, ${nombre} étoile${nombre > 1 ? "s" : ""} sur 3`);
});

Then(/^« ([^«»]+) » est la prochaine leçon$/, async ({ famille, page }, titre: string) => {
  const cible = pageDuParcours(famille, page);
  const bouton = await lecon(cible, titre);
  await expect(bouton).toHaveAttribute("data-etat", "prochaine");
  await expect(bouton).toHaveAccessibleName(`${titre} : à toi !`);
});

Then(/^aucune leçon du parcours n'est marquée « À toi ! »$/, async ({ page }) => {
  await expect(leconsDuParcours(page).first()).toBeVisible();
  await expect(page.locator('[data-testid="lecon-du-parcours"][data-etat="prochaine"]')).toHaveCount(0);
  await expect(page.getByTestId("etat-de-la-lecon").filter({ hasText: "À toi !" })).toHaveCount(0);
});

Then(/^aucune leçon du parcours n'est à découvrir$/, async ({ page }) => {
  await expect(leconsDuParcours(page).first()).toBeVisible();
  await expect(page.locator('[data-testid="lecon-du-parcours"][data-etat="aDecouvrir"]')).toHaveCount(0);
  await expect(page.getByTestId("etat-de-la-lecon").filter({ hasText: "À découvrir" })).toHaveCount(0);
});

Then(/^le parcours indique « ([^«»]+) »$/, async ({ famille, page }, compteur: string) => {
  await expect(pageDuParcours(famille, page).getByTestId("compteur-du-parcours")).toHaveText(compteur);
});

/** Ce que lit un lecteur d'écran de l'état d'une leçon d'un bloc (« Leçons des classes d'avant », « Déjà réussies en … »). */
export function annonceDeLEtatDUneLeconDuBloc(etatAttendu: string): string {
  if (etatAttendu === "réussie au test de départ" || etatAttendu === "à découvrir") return etatAttendu;
  const etoiles = Number(/(\d)/.exec(etatAttendu)?.[1]);
  return `réussie, ${etoiles} étoile${etoiles > 1 ? "s" : ""} sur 3`;
}

Then(/^le bloc « ([^«»]+) » du parcours montre, et seulement elles :$/, async ({ page }, nom: string, tableau: DataTable) => {
  const bloc = page.getByRole("region", { name: nom, exact: true });
  const lignes = tableau.hashes();
  // Le bouton qui plie et déplie le bloc (`aria-expanded`) n'est pas une leçon du bloc.
  await expect(bloc.locator("button:not([aria-expanded])")).toHaveCount(lignes.length);
  for (const ligne of lignes) {
    const annonce = annonceDeLEtatDUneLeconDuBloc(String(ligne["état"]));
    await expect(bloc.getByRole("button", { name: `${String(ligne["leçon"])}, ${String(ligne["niveau"])} : ${annonce}` })).toBeVisible();
  }
});

// --- Alors : accessibilité

Then(/^les lecteurs d'écran annoncent les leçons du parcours ainsi :$/, async ({ page }, tableau: DataTable) => {
  const annonces = tableau.hashes().map((ligne) => String(ligne["annonce"]));
  await expect(leconsDuParcours(page)).toHaveCount(annonces.length);
  for (const [rang, annonce] of annonces.entries()) {
    await expect(leconsDuParcours(page).nth(rang)).toHaveAccessibleName(annonce);
  }
});

Then(/^les lecteurs d'écran annoncent « ([^«»]+) »$/, async ({ page }, annonce: string) => {
  await expect(page.getByRole("button", { name: annonce, exact: true })).toBeVisible();
});

// Même texte que l'étape de la fin de séance (#24), qui vérifie un bouton de l'écran de fin : ici, c'est l'onglet de matière.
Then(/^le focus est sur « ([^«»]+) »$/, { tags: "@issue-25" }, async ({ page }, matiere: string) => {
  await expect(ongletDe(page, matiere)).toBeFocused();
});

Then(/^chaque onglet de matière et chaque leçon du parcours mesurent au moins 44 px de haut$/, async ({ page }) => {
  const cibles = [...(await ongletsDesMatieres(page).all()), ...(await leconsDuParcours(page).all())];
  expect(cibles.length).toBeGreaterThan(0);
  for (const cible of cibles) {
    const boite = await cible.boundingBox();
    const nom = (await cible.textContent()) ?? "";
    expect(boite, `cible « ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});

Then(/^Léa voit son accueil$/, async ({ page }) => {
  await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
  await expect(boutonMonParcours(page)).toBeVisible();
});
