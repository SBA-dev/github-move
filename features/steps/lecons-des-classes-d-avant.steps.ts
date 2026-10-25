import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import { LECONS_DES_CLASSES_D_AVANT } from "../support/bibliotheque-des-classes-d-avant.ts";
import type { Famille } from "../support/famille.ts";
import { etat, leconDeTitre, type LeconBrute } from "./etapes-puis-exercices.steps.ts";
import { annonceDeLEtatDUneLeconDuBloc, choisirLea, ouvrirLeParcoursDeFrancais } from "./parcours.steps.ts";
import { Given, Then, When } from "./fixtures.ts";

// Story #26 : leçons des classes d'avant dans « Mon parcours » et écran « Toutes les leçons ».
// La bibliothèque de test (identifiants « e2e-26- ») remplace celle de l'application dans le navigateur de Léa
// (features/support/bibliotheque-des-classes-d-avant.ts, servie par l'étape « Léa a un profil enfant préparé… »).
// La progression est préparée par les étapes de #25 et #27 ; l'enfant, lui, agit toujours par l'interface.

const DELAI_DE_LA_LECTURE_SANS_RESEAU_MS = 25_000;
const TITRE_DE_TOUTES_LES_LECONS = "Toutes les leçons";

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function titresCites(liste: string): string[] {
  return [...liste.matchAll(/« ([^«»]+) »/g)].map((m) => m[1] as string);
}

// --- Bibliothèque

Given(/^la bibliothèque de test des leçons des classes d'avant est servie$/, async ({ page }) => {
  etat(page).injectees.push(...(LECONS_DES_CLASSES_D_AVANT as LeconBrute[]));
});

// --- Régions « Leçons des classes d'avant » (le bloc de « Mon parcours », la section de « Toutes les leçons »)

function region(page: Page, nom: string): Locator {
  return page.getByRole("region", { name: nom, exact: true });
}

function bascule(page: Page, nom: string): Locator {
  return region(page, nom).getByRole("button", { name: new RegExp(`^${echapper(nom)}, \\d+ leçons?$`) });
}

/** Les leçons d'une région : le bouton qui la plie et la déplie (`aria-expanded`) n'en est pas une. */
function leconsDe(page: Page, nom: string): Locator {
  return region(page, nom).locator("button:not([aria-expanded])");
}

async function deplier(page: Page, nom: string, auClavier = false): Promise<void> {
  const bouton = bascule(page, nom);
  await expect(bouton).toBeVisible();
  if ((await bouton.getAttribute("aria-expanded")) !== "true") {
    if (auClavier) {
      await bouton.focus();
      await page.keyboard.press("Enter");
    } else {
      await bouton.click();
    }
  }
  await expect(bouton).toHaveAttribute("aria-expanded", "true");
}

async function verifierQueLaRegionEstRepliee(page: Page, nom: string, titre: string): Promise<void> {
  await expect(region(page, nom)).toBeVisible();
  await expect(bascule(page, nom)).toHaveAttribute("aria-expanded", "false");
  await expect(bascule(page, nom)).toHaveText(titre);
}

// --- « Mon parcours » : le bloc des leçons des classes d'avant

function leconsDuParcours(page: Page): Locator {
  return page.getByTestId("lecon-du-parcours");
}

async function attendreLesLeconsDuParcours(page: Page): Promise<void> {
  await expect(leconsDuParcours(page).first()).toBeVisible();
}

When(/^Léa déplie le bloc « ([^«»]+) »(, au clavier seulement)?$/, async ({ page }, nom: string, clavier: string | undefined) => {
  await deplier(page, nom, clavier != null);
});

Given(
  /^Léa a déplié le bloc « ([^«»]+) » du parcours de français(, puis est revenue à son accueil)?$/,
  async ({ famille, page }, nom: string, retour: string | undefined) => {
    await ouvrirLeParcoursDeFrancais(famille, page);
    await deplier(page, nom);
    if (retour != null) {
      await page.goBack();
      await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
    }
  },
);

Then(/^le bloc « ([^«»]+) » est replié et s'intitule « ([^«»]+) »$/, async ({ page }, nom: string, titre: string) => {
  await verifierQueLaRegionEstRepliee(page, nom, titre);
});

Then(/^le bloc « ([^«»]+) » est déplié$/, async ({ page }, nom: string) => {
  await expect(bascule(page, nom)).toHaveAttribute("aria-expanded", "true");
});

Then(/^aucun bloc « ([^«»]+) » n'est proposé$/, async ({ page }, nom: string) => {
  await attendreLesLeconsDuParcours(page);
  await expect(region(page, nom)).toHaveCount(0);
});

Then(/^les blocs du parcours se suivent ainsi : « ([^«»]+) », puis « ([^«»]+) »$/, async ({ page }, premier: string, second: string) => {
  await attendreLesLeconsDuParcours(page);
  const haut = (nom: string) => region(page, nom).evaluate((element) => element.getBoundingClientRect().top);
  await expect(region(page, premier)).toBeVisible();
  await expect(region(page, second)).toBeVisible();
  expect(await haut(premier), `« ${premier} » est au-dessus de « ${second} »`).toBeLessThan(await haut(second));
});

Then(/^« ([^«»]+) » n'apparaît pas dans le parcours$/, async ({ page }, titre: string) => {
  await attendreLesLeconsDuParcours(page);
  await expect(page.getByRole("button", { name: new RegExp(`^${echapper(titre)}(?:, [A-Z0-9]+)? : `) })).toHaveCount(0);
});

Then(/^les lecteurs d'écran annoncent le bouton « ([^«»]+) », (replié|déplié)$/, async ({ page }, nom: string, forme: string) => {
  await expect(page.getByRole("button", { name: nom, exact: true, expanded: forme === "déplié" })).toBeVisible();
});

async function verifierLesCiblesDe(cibles: Locator[], intitule: string): Promise<void> {
  expect(cibles.length, intitule).toBeGreaterThan(0);
  for (const cible of cibles) {
    const boite = await cible.boundingBox();
    const nom = (await cible.textContent()) ?? "";
    expect(boite, `cible « ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
}

Then(
  /^le bouton du bloc « ([^«»]+) » et chacune de ses leçons mesurent au moins 44 px de haut$/,
  async ({ page }, nom: string) => {
    await expect(leconsDe(page, nom).first()).toBeVisible();
    await verifierLesCiblesDe([bascule(page, nom), ...(await leconsDe(page, nom).all())], `le bloc « ${nom} » a des cibles`);
  },
);

// --- « Toutes les leçons » : accès

function titreDeToutesLesLecons(page: Page): Locator {
  return page.getByRole("heading", { level: 2, name: TITRE_DE_TOUTES_LES_LECONS, exact: true });
}

async function ouvrirToutesLesLecons(famille: Famille, page: Page): Promise<void> {
  if (await titreDeToutesLesLecons(page).isVisible()) return;
  const bouton = page.getByRole("button", { name: TITRE_DE_TOUTES_LES_LECONS, exact: true });
  if (!(await bouton.isVisible())) await choisirLea(famille, page);
  await bouton.click();
  await expect(titreDeToutesLesLecons(page)).toBeVisible();
  // Sans réseau, la lecture des étoiles sur le serveur échoue avant que les leçons ne s'affichent (environ 8 s mesurées).
  await expect(page.getByText("Chargement des leçons")).toHaveCount(0, { timeout: DELAI_DE_LA_LECTURE_SANS_RESEAU_MS });
  await expect(nombreDeLecons(page)).toBeVisible();
}

When(/^Léa ouvre « Toutes les leçons » depuis son accueil$/, async ({ famille, page }) => {
  await ouvrirToutesLesLecons(famille, page);
});

Given(/^Léa a ouvert « Toutes les leçons » depuis son accueil$/, async ({ famille, page }) => {
  await ouvrirToutesLesLecons(famille, page);
});

// Étape propre à #26 : le step générique de #22 « Léa voit « … » » entrerait en concurrence si elle n'était pas réservée.
Then(/^Léa voit « Toutes les leçons »$/, { tags: "@issue-26" }, async ({ page }) => {
  await expect(titreDeToutesLesLecons(page)).toBeVisible();
  await expect(nombreDeLecons(page)).toBeVisible();
});

// --- « Toutes les leçons » : leçons montrées

function nombreDeLecons(page: Page): Locator {
  return page.getByTestId("nombre-de-lecons");
}

function leconsDuHaut(page: Page): Locator {
  return page.getByTestId("lecon-de-toutes-les-lecons");
}

function boutonDeToutesLesLecons(page: Page, titre: string): Locator {
  return page.getByRole("button", { name: new RegExp(`^${echapper(titre)}, [A-Z0-9]+, [^:]+ : `) });
}

type EtatAttendu = { genre: string; annonce: string };

function etatAttendu(libelle: string): EtatAttendu {
  if (libelle === "à toi") return { genre: "prochaine", annonce: "à toi !" };
  if (libelle === "à découvrir") return { genre: "aDecouvrir", annonce: "à découvrir" };
  if (libelle === "réussie au test de départ") return { genre: "reussieAuTestDeDepart", annonce: libelle };
  if (/^réussie, \d étoiles?$/.test(libelle)) return { genre: "reussie", annonce: annonceDeLEtatDUneLeconDuBloc(libelle) };
  throw new Error(`État de leçon inconnu : « ${libelle} »`);
}

async function verifierUneLeconDuHaut(lecon: Locator, annonce: string, etatDemande: string): Promise<void> {
  const attendu = etatAttendu(etatDemande);
  await expect(lecon).toHaveAccessibleName(`${annonce} : ${attendu.annonce}`);
  await expect(lecon).toHaveAttribute("data-etat", attendu.genre);
}

Then(/^« Toutes les leçons » montre, et seulement elles :$/, async ({ page }, tableau: DataTable) => {
  const lignes = tableau.hashes();
  await expect(leconsDuHaut(page)).toHaveCount(lignes.length);
  for (const [rang, ligne] of lignes.entries()) {
    const annonce = `${String(ligne["leçon"])}, ${String(ligne["niveau"])}, ${String(ligne["matière"])}`;
    await verifierUneLeconDuHaut(leconsDuHaut(page).nth(rang), annonce, String(ligne["état"]));
  }
});

Then(/^« Toutes les leçons » montre, dans l'ordre, (« .+ »)$/, async ({ page }, liste: string) => {
  const titres = titresCites(liste);
  await expect(leconsDuHaut(page)).toHaveCount(titres.length);
  for (const [rang, titre] of titres.entries()) {
    await expect(leconsDuHaut(page).nth(rang)).toHaveAccessibleName(new RegExp(`^${echapper(titre)}, [A-Z0-9]+, [^:]+ : `));
  }
});

Then(
  /^« Toutes les leçons » montre « ([^«»]+) » (réussie avec \d étoiles?|réussie au test de départ|à découvrir)$/,
  async ({ page }, titre: string, etatDemande: string) => {
    const attendu = etatAttendu(etatDemande.replace(/^réussie avec (\d) (étoiles?)$/, "réussie, $1 $2"));
    const lecon = boutonDeToutesLesLecons(page, titre);
    await expect(lecon).toHaveCount(1);
    await expect(lecon).toHaveAttribute("data-etat", attendu.genre);
    await expect(lecon).toHaveAccessibleName(new RegExp(`^${echapper(titre)}, [A-Z0-9]+, [^:]+ : ${echapper(attendu.annonce)}$`));
  },
);

Then(/^« ([^«»]+) » apparaît dans « Toutes les leçons »$/, async ({ page }, titre: string) => {
  await expect(boutonDeToutesLesLecons(page, titre)).toHaveCount(1);
});

Then(/^« ([^«»]+) » n'apparaît pas dans « Toutes les leçons »$/, async ({ page }, titre: string) => {
  await expect(nombreDeLecons(page)).toBeVisible();
  await expect(boutonDeToutesLesLecons(page, titre)).toHaveCount(0);
});

Then(/^aucune leçon du (\S+) n'apparaît dans « Toutes les leçons »$/, async ({ page }, niveau: string) => {
  await expect(nombreDeLecons(page)).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(`^.+, ${echapper(niveau)}, [^:]+ : `) })).toHaveCount(0);
});

Then(/^« Toutes les leçons » indique « ([^«»]+) »$/, async ({ page }, nombre: string) => {
  await expect(nombreDeLecons(page)).toHaveText(nombre);
});

Then(/^« Toutes les leçons » n'indique aucun nombre de leçons réussies$/, async ({ page }) => {
  await expect(nombreDeLecons(page)).toBeVisible();
  await expect(page.getByTestId("compteur-du-parcours")).toHaveCount(0);
  await expect(page.getByText(/réussies? sur \d+/)).toHaveCount(0);
});

// --- « Toutes les leçons » : ouvrir une leçon

async function ouvrirUneLeconDeToutesLesLecons(page: Page, titre: string, moyen: string | undefined): Promise<void> {
  const lecon = boutonDeToutesLesLecons(page, titre);
  etat(page).courante = leconDeTitre(page, titre);
  await expect(lecon).toHaveCount(1);
  if (moyen === "au clavier") {
    await lecon.focus();
    await page.keyboard.press("Enter");
  } else {
    await lecon.click();
  }
}

When(
  /^Léa ouvre la leçon « ([^«»]+) » depuis « Toutes les leçons »(?: (au toucher|au clavier))?$/,
  async ({ page }, titre: string, moyen: string | undefined) => {
    await ouvrirUneLeconDeToutesLesLecons(page, titre, moyen);
  },
);

Given(/^Léa a ouvert la leçon « ([^«»]+) » depuis « Toutes les leçons »$/, async ({ famille, page }, titre: string) => {
  await ouvrirToutesLesLecons(famille, page);
  await ouvrirUneLeconDeToutesLesLecons(page, titre, undefined);
  await expect(page.getByRole("heading", { level: 2, name: titre })).toBeVisible();
});

// --- « Toutes les leçons » : les listes

function liste(page: Page, nom: string): Locator {
  return page.getByLabel(nom, { exact: true });
}

async function choisirDansLaListe(page: Page, nom: string, choix: string, auClavier: boolean): Promise<void> {
  const select = liste(page, nom);
  if (!auClavier) {
    await select.selectOption({ label: choix });
  } else {
    const options = await select.locator("option").allTextContents();
    const actuelle = await select.evaluate((element) => (element as HTMLSelectElement).selectedIndex);
    const voulue = options.indexOf(choix);
    expect(voulue, `« ${choix} » est proposé dans la liste « ${nom} »`).toBeGreaterThanOrEqual(0);
    await select.focus();
    for (let pas = 0; pas < Math.abs(voulue - actuelle); pas++) await page.keyboard.press(voulue > actuelle ? "ArrowDown" : "ArrowUp");
  }
  await expect(select.getByRole("option", { selected: true })).toHaveText(choix);
}

When(
  /^Léa choisit « ([^«»]+) » dans la liste « (Matière|Niveau) »(, au clavier seulement)?$/,
  async ({ page }, choix: string, nom: string, clavier: string | undefined) => {
    await choisirDansLaListe(page, nom, choix, clavier != null);
  },
);

Given(
  /^Léa a choisi « ([^«»]+) » dans la liste « (Matière|Niveau) » de « Toutes les leçons »(, puis est revenue à son accueil)?$/,
  async ({ famille, page }, choix: string, nom: string, retour: string | undefined) => {
    await ouvrirToutesLesLecons(famille, page);
    await choisirDansLaListe(page, nom, choix, false);
    if (retour != null) {
      await page.goBack();
      await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
    }
  },
);

Then(/^la liste « (Matière|Niveau) » est sur « ([^«»]+) »$/, async ({ page }, nom: string, choix: string) => {
  await expect(liste(page, nom).getByRole("option", { selected: true })).toHaveText(choix);
});

Then(/^la liste « (Matière|Niveau) » propose (« .+ »)$/, async ({ page }, nom: string, choix: string) => {
  await expect(liste(page, nom).getByRole("option")).toHaveText(titresCites(choix));
});

// --- « Toutes les leçons » : la section des classes d'avant

When(
  /^Léa déplie la section « ([^«»]+) » de « Toutes les leçons »$/,
  async ({ page }, nom: string) => {
    await deplier(page, nom);
  },
);

Given(/^Léa a déplié la section « ([^«»]+) » de « Toutes les leçons »$/, async ({ famille, page }, nom: string) => {
  await ouvrirToutesLesLecons(famille, page);
  await deplier(page, nom);
});

Then(
  /^la section « ([^«»]+) » de « Toutes les leçons » est repliée et s'intitule « ([^«»]+) »$/,
  async ({ page }, nom: string, titre: string) => {
    await verifierQueLaRegionEstRepliee(page, nom, titre);
  },
);

Then(
  /^la section « ([^«»]+) » de « Toutes les leçons » montre, dans l'ordre :$/,
  async ({ page }, nom: string, tableau: DataTable) => {
    const lignes = tableau.hashes();
    const lecons = leconsDe(page, nom);
    await expect(lecons).toHaveCount(lignes.length);
    for (const [rang, ligne] of lignes.entries()) {
      const annonce = `${String(ligne["leçon"])}, ${String(ligne["classe"])}, ${String(ligne["matière"])}`;
      await verifierUneLeconDuHaut(lecons.nth(rang), annonce, String(ligne["état"]));
    }
    const classes = [...new Set(lignes.map((ligne) => String(ligne["classe"])))];
    await expect(region(page, nom).getByRole("heading", { level: 3 })).toHaveText(classes);
  },
);

Then(
  /^aucune section « ([^«»]+) » n'est proposée dans « Toutes les leçons »$/,
  async ({ page }, nom: string) => {
    await expect(nombreDeLecons(page)).toBeVisible();
    await expect(region(page, nom)).toHaveCount(0);
  },
);

// --- « Toutes les leçons » : accessibilité

Then(/^les lecteurs d'écran annoncent les leçons de « Toutes les leçons » ainsi :$/, async ({ page }, tableau: DataTable) => {
  const annonces = tableau.hashes().map((ligne) => String(ligne["annonce"]));
  await expect(leconsDuHaut(page)).toHaveCount(annonces.length);
  for (const [rang, annonce] of annonces.entries()) {
    await expect(leconsDuHaut(page).nth(rang)).toHaveAccessibleName(annonce);
  }
});

Then(/^les lecteurs d'écran annoncent le nombre de leçons « ([^«»]+) »$/, async ({ page }, nombre: string) => {
  await expect(page.getByRole("status").filter({ hasText: new RegExp(`^${echapper(nombre)}$`) })).toBeVisible();
});

Then(/^chaque liste et chaque leçon de « Toutes les leçons » mesurent au moins 44 px de haut$/, async ({ page }) => {
  await expect(leconsDuHaut(page).first()).toBeVisible();
  const section = page.getByTestId("lecon-des-classes-d-avant");
  await expect(section.first()).toBeVisible();
  const cibles = [liste(page, "Matière"), liste(page, "Niveau"), ...(await leconsDuHaut(page).all()), ...(await section.all())];
  await verifierLesCiblesDe(cibles, "« Toutes les leçons » a des cibles");
});
