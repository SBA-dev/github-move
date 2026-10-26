import { readFileSync } from "node:fs";
import { expect, type Locator, type Page } from "@playwright/test";
import type { DataTable } from "playwright-bdd";
import type { Famille } from "../support/famille.ts";
import { lireEnRestLeNiveauDuProfil } from "../support/profils-api.ts";
import { meilleuresEtoilesEnRest } from "../support/seances-api.ts";
import { After, Given, Then, When } from "./fixtures.ts";
import { commencerLaSeanceComplete, etat as etatDeLaLecon, type LeconBrute, leconDeTitre, ouvrirLaPageDeLaLecon } from "./etapes-puis-exercices.steps.ts";
import { gagnerDesEtoilesParUnExerciceSeul } from "./etoiles-et-fin-de-seance.steps.ts";
import { choisirLeaSur } from "./profil-reel.ts";
import { choisirSonProfil, connecterSiBesoin, etat as etatDeLaFamille, jetonDe, ouvrirQuiJoue, profilDe } from "./profils-enfants.steps.ts";
import { preparerLaPage, scenario, terminerLaLecture } from "./voix.steps.ts";

// Story #39 : leçons personnelles. Les leçons personnelles sont réelles : elles demandent un vrai profil enfant
// (décision 0021), joué dans « Qui joue ? » avec la session du parent. Le parent agit par l'écran (espace parent,
// onglets « Créer une leçon » et « Mes leçons »). Les préparations passent par les Edge Functions avec le jeton du
// parent (jamais la clé service_role) : la RLS s'applique.

const DELAI_DU_SERVEUR_MS = 30_000; // démarrage à froid possible d'une Edge Function

// --- Appels au serveur, avec le jeton d'un parent (ou la seule clé publique pour un visiteur)

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

type ReponseDeLaFonction = { readonly statut: number; readonly message: string | undefined; readonly id: string | undefined };

async function appelerLaFonction(
  fonction: "creer-une-lecon-personnelle" | "supprimer-une-lecon-personnelle",
  jeton: string | undefined,
  corps: object,
): Promise<ReponseDeLaFonction> {
  const cle = variable("SUPABASE_ANON_KEY");
  const reponse = await fetch(`${variable("SUPABASE_URL")}/functions/v1/${fonction}`, {
    method: "POST",
    headers: { apikey: cle, Authorization: `Bearer ${jeton ?? cle}`, "Content-Type": "application/json" },
    body: JSON.stringify(corps),
  });
  const lu = (await reponse.json().catch(() => ({}))) as { error?: { message?: string }; id?: string };
  return { statut: reponse.status, message: lu.error?.message, id: lu.id };
}

type LigneDeLeconPersonnelle = { id: string; profil: string; texte_du_parent: string; lecon: LeconBrute };

/** Lecture REST sous RLS : les leçons personnelles que le jeton du parent a le droit de voir. */
async function lireLesLeconsPersonnelles(jeton: string): Promise<LigneDeLeconPersonnelle[]> {
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/lecons_personnelles?select=id,profil,texte_du_parent,lecon&order=cree_le`, {
    headers: { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}` },
  });
  expect(reponse.status, "lecture REST des leçons personnelles").toBe(200);
  return (await reponse.json()) as LigneDeLeconPersonnelle[];
}

async function insertionDirecteDeLeconPersonnelle(jeton: string, profil: string): Promise<number> {
  const identifiant = `perso-${crypto.randomUUID()}`;
  const reponse = await fetch(`${variable("SUPABASE_URL")}/rest/v1/lecons_personnelles`, {
    method: "POST",
    headers: { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: identifiant, profil, texte_du_parent: "intrusion", lecon: { id: identifiant } }),
  });
  return reponse.status;
}

// --- État du scénario

type Partie = { reponse: ReponseDeLaFonction | undefined; attendu: string | undefined };
const parties = new WeakMap<Famille, Partie>();

function partie(famille: Famille): Partie {
  let courante = parties.get(famille);
  if (!courante) {
    courante = { reponse: undefined, attendu: undefined };
    parties.set(famille, courante);
  }
  return courante;
}

// Les leçons créées pendant le scénario sont supprimées à la fin, par l'Edge Function et avec le jeton de Paul.
After({ tags: "@issue-39" }, async ({ famille }) => {
  const jeton = etatDeLaFamille(famille).jetons.get("Paul");
  if (jeton === undefined) return;
  for (const { id } of await lireLesLeconsPersonnelles(jeton).catch(() => [])) {
    await appelerLaFonction("supprimer-une-lecon-personnelle", jeton, { lecon: id }).catch(() => undefined);
  }
});

// --- L'espace parent : onglets « Créer une leçon » et « Mes leçons »

function section(page: Page): Locator {
  return page.getByTestId("lecons-personnelles-du-parent");
}

function formulaire(page: Page): Locator {
  return section(page).getByRole("form", { name: "Créer une leçon" });
}

function apercu(page: Page): Locator {
  return page.getByTestId("apercu-de-la-lecon");
}

async function ouvrirLOnglet(page: Page, nom: "Créer une leçon" | "Mes leçons"): Promise<void> {
  const onglet = section(page).getByRole("tab", { name: nom, exact: true });
  await expect(onglet).toBeVisible({ timeout: DELAI_DU_SERVEUR_MS });
  if ((await onglet.getAttribute("aria-selected")) !== "true") await onglet.click();
  await expect(onglet).toHaveAttribute("aria-selected", "true");
}

async function entrerDansLesLecons(famille: Famille, appareil: "tablette" | "telephone", parent: string): Promise<Page> {
  const page = await connecterSiBesoin(famille, appareil, parent);
  await famille.allerDansLEspaceParent(appareil);
  return page;
}

async function remplirLeFormulaire(
  page: Page,
  demande: { enfant: string; classe: string | undefined; matiere: string | undefined; texte: string },
): Promise<void> {
  const form = formulaire(page);
  await expect(form).toBeVisible({ timeout: DELAI_DU_SERVEUR_MS });
  const enfant = form.getByLabel("Enfant", { exact: true });
  if (await enfant.count() > 0) await enfant.selectOption({ label: demande.enfant });
  if (demande.classe !== undefined) await form.getByLabel("Classe", { exact: true }).selectOption({ label: demande.classe });
  if (demande.matiere !== undefined) await form.getByLabel("Matière", { exact: true }).selectOption({ label: demande.matiere });
  await form.getByLabel("Texte", { exact: true }).fill(demande.texte);
}

async function demanderLApercu(page: Page): Promise<void> {
  await formulaire(page).getByRole("button", { name: "Préparer la leçon", exact: true }).click();
  await expect(apercu(page).or(page.getByRole("alert"))).toBeVisible({ timeout: DELAI_DU_SERVEUR_MS });
}

type DemandeDeLecon = { enfant: string; classe?: string; matiere?: string; texte: string };

/**
 * Paul prépare la leçon dans l'onglet « Créer une leçon ». Quand le réseau est déjà coupé à l'ouverture (la page est encore
 * vide), l'application ne peut pas se charger : on la charge réseau rétabli, on y prépare une première fois (l'index des
 * programmes est alors gardé en mémoire par la page), puis on recoupe le réseau avant la préparation qui compte.
 */
async function preparerLaLecon(famille: Famille, demande: DemandeDeLecon): Promise<void> {
  const tablette = await famille.page("tablette");
  const reseauCoupe = tablette.url() === "about:blank" && !(await tablette.evaluate(() => navigator.onLine));
  if (reseauCoupe) await tablette.context().setOffline(false);
  const page = await entrerDansLesLecons(famille, "tablette", "Paul");
  await ouvrirLOnglet(page, "Créer une leçon");
  await remplirLeFormulaire(page, { enfant: demande.enfant, classe: demande.classe, matiere: demande.matiere, texte: demande.texte });
  if (reseauCoupe) {
    await demanderLApercu(page);
    await page.context().setOffline(true);
  }
  await demanderLApercu(page);
}

// --- Étant donné : la leçon préparée ou créée

const TEXTE_INLINE = "à partir du texte « (.*) »";
const TEXTE_EN_BLOC = "à partir de ce texte :";

Given(new RegExp(`^Paul a préparé une leçon pour (Léa) ${TEXTE_INLINE}$`), async ({ famille }, enfant: string, texte: string) => {
  await preparerLaLecon(famille, { enfant, texte });
});

Given(new RegExp(`^Paul a créé pour (Léa) une leçon personnelle ${TEXTE_INLINE}$`), async ({ famille, page }, enfant: string, texte: string) => {
  const profil = profilDe(famille, enfant);
  const jeton = await jetonDe(famille, "Paul");
  const niveau = await lireEnRestLeNiveauDuProfil(jeton, profil.id);
  const reponse = await appelerLaFonction("creer-une-lecon-personnelle", jeton, { profil: profil.id, texte, niveau });
  expect(reponse.statut, `création de la leçon personnelle : ${reponse.message ?? ""}`).toBe(200);
  const creee = (await lireLesLeconsPersonnelles(jeton)).find(({ id }) => id === reponse.id);
  expect(creee, "la leçon créée est lisible de Paul sous RLS").toBeDefined();
  etatDeLaLecon(page).injectees.push((creee as LigneDeLeconPersonnelle).lecon);
  await connecterSiBesoin(famille, "tablette", "Paul");
});

// Les leçons jouées par l'enfant : le profil réel de Léa est choisi dans « Qui joue ? » (la voix est remplacée par le faux
// de voix.steps.ts, comme pour les autres stories de séance). Même sens que l'étape générique, pour une leçon du serveur.
async function jouerAvecLeaReelle(page: Page): Promise<void> {
  await preparerLaPage(page, scenario(page));
  await choisirLeaSur(page);
}

Given(/^Léa joue la séance complète de la leçon « (.+) »$/, { tags: "@issue-39" }, async ({ page }, titre: string) => {
  await jouerAvecLeaReelle(page);
  await ouvrirLaPageDeLaLecon(page, titre);
  await commencerLaSeanceComplete(page);
});

// Léa joue comme une enfant jusqu'à l'écran de fin : elle continue, touche les lettres de la dictée, touche l'étiquette puis la
// maison du classement, touche la bonne forme de la conjugaison. Un seul aller-retour au navigateur lit l'écran à chaque pas.
type Exercice = Record<string, unknown>;

type EcranDeSeance = {
  fin: boolean;
  continuer: boolean;
  dictee: boolean;
  position: number;
  reussies: number;
  etiquette: string | undefined;
  choix: boolean;
  question: string;
};

async function lireLEcran(page: Page): Promise<EcranDeSeance> {
  return await page.evaluate(() => {
    const texte = (selecteur: string) => (document.querySelector(selecteur)?.textContent ?? "").replace(/\s+/g, " ").trim();
    const present = (selecteur: string) => document.querySelector(selecteur) !== null;
    const premiere = document.querySelector('[data-testid="etiquettes-a-placer"] button');
    return {
      fin: present('[data-testid="fin-de-seance"]'),
      continuer: [...document.querySelectorAll("button")].some((bouton) => (bouton.textContent ?? "").trim() === "Continuer"),
      dictee: present('[data-testid="dictee"]'),
      position: Number(document.querySelector('[data-testid="exercice-en-cours"]')?.getAttribute("data-position") ?? -1),
      reussies: Number(document.querySelector('[data-testid="recipient"]')?.getAttribute("data-questions-reussies") ?? -1),
      etiquette: premiere ? (premiere.textContent ?? "").trim() : undefined,
      choix: present('[data-testid="choix-de-la-question"]'),
      question: texte('[data-testid="question"]'),
    };
  });
}

function motsDictes(lecon: LeconBrute): string[] {
  return lecon.exercices.flatMap((exercice) => exercice.type === "dictee" ? (exercice.mots as Array<{ mot: string }>).map(({ mot }) => mot) : []);
}

async function ecrireLeMotDicte(page: Page, mot: string, avecUneErreur: boolean): Promise<void> {
  const lettres = [...mot].filter((caractere) => !" '’-.,".includes(caractere)).map((lettre) => lettre.toLowerCase());
  const touche = (lettre: string) => page.locator(`[data-testid="touche"][data-lettre="${lettre}"]:not([aria-disabled="true"])`).first();
  const fausses = page.locator('[data-testid="case-a-ecrire"][data-etat="fausse"]');
  const taper = async (aTaper: readonly string[]) => {
    for (const [rang, lettre] of aTaper.entries()) {
      await touche(lettre).click();
      if (rang < aTaper.length - 1) await expect(page.locator('[data-testid="case-a-ecrire"]:not([data-etat="vide"])')).toHaveCount(rang + 1);
    }
  };
  // Tant que Noisette félicite pour le mot précédent, ses cases restent à l'écran : on attend les cases vides du mot suivant.
  await expect.poll(async () => {
    const [cases, vides] = await Promise.all([
      page.getByTestId("case-a-ecrire").count(),
      page.locator('[data-testid="case-a-ecrire"][data-etat="vide"]').count(),
    ]);
    if (cases === lettres.length && vides === lettres.length) return true;
    await terminerLaLecture(page);
    return false;
  }, { intervals: [50], timeout: 15_000 }).toBe(true);
  if (avecUneErreur) {
    // Le mot n'est jugé qu'une fois toutes les cases remplies : on écrit une lettre absente du mot à la place de la première.
    const proposees = await page.getByTestId("touche").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-lettre") ?? ""));
    const intruse = proposees.find((lettre) => !lettres.includes(lettre));
    expect(intruse, "une touche absente du mot est proposée").toBeDefined();
    await taper([intruse as string, ...lettres.slice(1)]);
    await expect(fausses.first()).toBeVisible();
    await expect.poll(async () => {
      if ((await fausses.count()) === 0) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [50] }).toBe(true);
  }
  await taper(lettres);
}

async function jouerUnPas(page: Page, lecon: LeconBrute, erreursRestantes: { nombre: number }): Promise<boolean> {
  const ecran = await lireLEcran(page);
  if (ecran.fin) return true;
  if (ecran.continuer) {
    await page.getByRole("button", { name: "Continuer", exact: true }).click();
    return false;
  }
  const exercice: Exercice | undefined = lecon.exercices[ecran.position];
  if (ecran.dictee) {
    const mot = motsDictes(lecon)[ecran.reussies];
    if (mot === undefined) {
      // Tous les mots sont écrits : Noisette félicite encore, l'écran de fin vient ensuite.
      await terminerLaLecture(page);
      return false;
    }
    const avecUneErreur = erreursRestantes.nombre > 0;
    if (avecUneErreur) erreursRestantes.nombre -= 1;
    await ecrireLeMotDicte(page, mot, avecUneErreur);
    await expect.poll(async () => {
      const apres = await lireLEcran(page);
      if (apres.fin || apres.reussies > ecran.reussies) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [50] }).toBe(true);
    return false;
  }
  if (exercice?.type === "classer" && ecran.etiquette !== undefined) {
    const items = exercice.items as Array<{ texte: string; groupe: string }>;
    const groupes = exercice.groupes as Array<{ id: string; nom: string }>;
    const item = items.find((candidat) => candidat.texte === ecran.etiquette);
    const groupe = groupes.find(({ id }) => id === item?.groupe);
    if (item === undefined || groupe === undefined) throw new Error(`Étiquette « ${ecran.etiquette} » inconnue de l'exercice`);
    await page.getByTestId("etiquettes-a-placer").getByRole("button", { name: ecran.etiquette, exact: true }).click();
    await page.getByRole("button", { name: `Poser dans la maison « ${groupe.nom} »`, exact: true }).click();
    return false;
  }
  if (exercice?.type === "conjugaison" && ecran.choix) {
    const formes = exercice.formes as Array<{ pronom: string; forme: string }>;
    const attendue = formes.find(({ pronom }) => ecran.question === `${pronom} … ?`);
    if (attendue === undefined) throw new Error(`Question de conjugaison inattendue : « ${ecran.question} »`);
    await page.getByTestId("choix-de-la-question").getByRole("button", { name: attendue.forme, exact: true }).click();
    // La bonne forme est enregistrée : on laisse Noisette finir, jusqu'à la personne suivante (ou l'écran de fin).
    await expect.poll(async () => {
      const apres = await lireLEcran(page);
      if (apres.fin || apres.position !== ecran.position || (apres.question !== ecran.question && apres.choix)) return true;
      await terminerLaLecture(page);
      return false;
    }, { intervals: [20] }).toBe(true);
    return false;
  }
  await terminerLaLecture(page);
  return false;
}

async function jouerLaSeanceJusquALaFin(page: Page, lecon: LeconBrute, erreurs: number): Promise<void> {
  const restantes = { nombre: erreurs };
  await expect.poll(() => jouerUnPas(page, lecon, restantes), { intervals: [20], timeout: 60_000 }).toBe(true);
}

Given(
  /^Léa a gagné 2 étoiles à la leçon « ([^«»]+) » sur la tablette$/,
  { tags: "@issue-39 or @issue-31" },
  async ({ famille, page, $tags }, titre: string) => {
    const lecon = leconDeTitre(page, titre);
    // Story #31 : une leçon de la bibliothèque se joue par un exercice seul (la séance complète dépasse le délai d'un scénario).
    if ($tags.includes("@issue-31") && !lecon.id.startsWith("perso-")) {
      await gagnerDesEtoilesParUnExerciceSeul(famille, page, titre, 2);
      return;
    }
    await jouerAvecLeaReelle(page);
    await ouvrirLaPageDeLaLecon(page, titre);
    await commencerLaSeanceComplete(page);
    await jouerLaSeanceJusquALaFin(page, lecon, 1);
    const jeton = await jetonDe(famille, "Paul");
    await expect.poll(() => meilleuresEtoilesEnRest(jeton, profilDe(famille, "Léa").id, lecon.id), { timeout: DELAI_DU_SERVEUR_MS }).toBe(2);
  },
);

When(/^Léa réussit la dernière question de la séance$/, { tags: "@issue-39" }, async ({ page }) => {
  const lecon = etatDeLaLecon(page).courante;
  if (!lecon) throw new Error("Aucune leçon ouverte");
  await jouerLaSeanceJusquALaFin(page, lecon, 0);
});

// --- Quand : le parent prépare la leçon

function classeEtMatiere(classe: string | undefined, matiere: string | undefined): Pick<DemandeDeLecon, "classe" | "matiere"> {
  return { ...(classe == null ? {} : { classe }), ...(matiere == null ? {} : { matiere }) };
}

When(
  new RegExp(`^Paul prépare une leçon pour (Léa)(?: en classe (CP|CE1|CE2|CM1|CM2))?(?: en matière « ([^«»]+) »)? ${TEXTE_INLINE}$`),
  async ({ famille }, enfant: string, classe: string | undefined, matiere: string | undefined, texte: string) => {
    await preparerLaLecon(famille, { enfant, texte, ...classeEtMatiere(classe, matiere) });
  },
);

When(
  new RegExp(`^Paul prépare une leçon pour (Léa)(?: en classe (CP|CE1|CE2|CM1|CM2))?(?: en matière « ([^«»]+) »)? ${TEXTE_EN_BLOC}$`),
  async ({ famille }, enfant: string, classe: string | undefined, matiere: string | undefined, texte: string) => {
    await preparerLaLecon(famille, { enfant, texte, ...classeEtMatiere(classe, matiere) });
  },
);

When(/^Paul prépare une leçon pour (Léa) à partir d'un texte de (\d+) caractères$/, async ({ famille }, enfant: string, nombre: string) => {
  const texte = `${"chaton ".repeat(Math.ceil(Number(nombre) / 7)).slice(0, Number(nombre) - 1)}x`;
  expect(texte).toHaveLength(Number(nombre));
  await preparerLaLecon(famille, { enfant, texte });
});

When(/^Paul choisit (Hugo) pour créer une leçon$/, async ({ famille }, enfant: string) => {
  const page = await entrerDansLesLecons(famille, "tablette", "Paul");
  await ouvrirLOnglet(page, "Créer une leçon");
  const form = formulaire(page);
  await expect(form).toBeVisible({ timeout: DELAI_DU_SERVEUR_MS });
  await form.getByLabel("Enfant", { exact: true }).selectOption({ label: enfant });
});

When(/^Paul enregistre la leçon préparée$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await apercu(page).getByRole("button", { name: /^Enregistrer pour / }).click();
  await expect(page.getByTestId("lecon-enregistree").or(page.getByRole("alert"))).toBeVisible({ timeout: DELAI_DU_SERVEUR_MS });
});

// --- Quand : « Mes leçons »

async function ouvrirMesLecons(famille: Famille, parent: "Paul" | "Claire"): Promise<Page> {
  const page = await entrerDansLesLecons(famille, "tablette", parent);
  await ouvrirLOnglet(page, "Mes leçons");
  await expect(page.getByText("Chargement des leçons")).toHaveCount(0, { timeout: DELAI_DU_SERVEUR_MS });
  return page;
}

When(/^(Paul|Claire) ouvre « Mes leçons »$/, async ({ famille }, parent: "Paul" | "Claire") => {
  await ouvrirMesLecons(famille, parent);
});

function carte(page: Page, titre: string): Locator {
  return page.getByTestId("lecon-personnelle").filter({ has: page.getByTestId("titre-de-la-lecon-personnelle").getByText(titre, { exact: true }) });
}

When(/^Paul demande la suppression de la leçon personnelle « (.+) »$/, async ({ famille }, titre: string) => {
  const page = await ouvrirMesLecons(famille, "Paul");
  await carte(page, titre).getByRole("button", { name: /^Supprimer/ }).click();
});

When(/^Paul supprime la leçon personnelle « (.+) » et confirme la suppression$/, async ({ famille }, titre: string) => {
  const page = await ouvrirMesLecons(famille, "Paul");
  await carte(page, titre).getByRole("button", { name: /^Supprimer/ }).click();
  await carte(page, titre).getByRole("button", { name: "Confirmer la suppression", exact: true }).click();
});

// --- Quand : les enfants

async function ouvrirToutesLesLeconsDe(famille: Famille, page: Page, prenom: string): Promise<void> {
  const bouton = page.getByRole("button", { name: "Toutes les leçons", exact: true });
  if (!(await bouton.isVisible())) {
    await ouvrirQuiJoue(page);
    await choisirSonProfil(page, prenom);
  }
  await bouton.click();
  await expect(page.getByRole("heading", { level: 2, name: "Toutes les leçons", exact: true })).toBeVisible();
  await expect(page.getByText("Chargement des leçons")).toHaveCount(0, { timeout: DELAI_DU_SERVEUR_MS });
  await expect(page.getByTestId("nombre-de-lecons")).toBeVisible();
  void famille;
}

When(/^(Hugo|Tom) ouvre « Toutes les leçons » depuis son accueil$/, async ({ famille, page }, prenom: string) => {
  await ouvrirToutesLesLeconsDe(famille, page, prenom);
});

// --- Quand : tentatives refusées

async function jetonDeLaTablette(famille: Famille): Promise<string | undefined> {
  return (await famille.session(await famille.page("tablette")))?.access_token;
}

When(
  new RegExp(`^(Claire|un visiteur) tente de créer pour (Léa) une leçon personnelle ${TEXTE_INLINE}$`),
  async ({ famille }, acteur: string, enfant: string, texte: string) => {
    const jeton = acteur === "Claire" ? await jetonDeLaTablette(famille) : undefined;
    if (acteur === "Claire") expect(jeton, "Claire doit être connectée sur la tablette").toBeTruthy();
    const profil = profilDe(famille, enfant);
    const reponse = await appelerLaFonction("creer-une-lecon-personnelle", jeton, { profil: profil.id, texte, niveau: "CE1" });
    partie(famille).reponse = reponse;
    etatDeLaFamille(famille).reponse = { statut: reponse.statut, message: reponse.message, profil: undefined };
    if (jeton !== undefined) {
      expect(await insertionDirecteDeLeconPersonnelle(jeton, profil.id), "insertion REST d'une leçon par un parent non rattaché")
        .toBeGreaterThanOrEqual(400);
    }
  },
);

When(/^Claire tente de supprimer la leçon personnelle « (.+) » de Léa$/, async ({ famille }, titre: string) => {
  const jetonDePaul = await jetonDe(famille, "Paul");
  const visee = (await lireLesLeconsPersonnelles(jetonDePaul)).find(({ lecon }) => lecon.titre === titre);
  expect(visee, `la leçon « ${titre} » existe pour Paul`).toBeDefined();
  const jeton = await jetonDeLaTablette(famille);
  expect(jeton, "Claire doit être connectée sur la tablette").toBeTruthy();
  partie(famille).reponse = await appelerLaFonction("supprimer-une-lecon-personnelle", jeton, { lecon: (visee as LigneDeLeconPersonnelle).id });
});

// --- Alors : l'aperçu

Then(/^l'aperçu de la leçon a pour titre « (.+) »$/, async ({ famille }, titre: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("titre-de-l-apercu")).toHaveText(titre);
});

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

Then(/^le titre de l'aperçu de la leçon commence par « (.+) »$/, async ({ famille }, debut: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("titre-de-l-apercu")).toHaveText(new RegExp(`^${echapper(debut)}`));
});

Then(/^l'aperçu de la leçon propose, et seulement eux, les exercices :$/, async ({ famille }, tableau: DataTable) => {
  const page = await famille.page("tablette");
  const lignes = tableau.hashes();
  const exercices = page.getByTestId("exercice-de-l-apercu");
  await expect(exercices).toHaveCount(lignes.length);
  for (const [rang, ligne] of lignes.entries()) {
    await expect(exercices.nth(rang).locator(".libelle-du-type")).toHaveText(String(ligne["exercice"]));
    await expect(exercices.nth(rang).locator(".intitule")).toHaveText(String(ligne["titre"]));
  }
});

Then(/^l'aperçu de la leçon propose un seul exercice, « (.+) »$/, async ({ famille }, libelle: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("exercice-de-l-apercu").locator(".libelle-du-type")).toHaveText(libelle);
});

Then(/^l'aperçu de la leçon indique « (.+) »$/, async ({ famille }, indication: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("niveau-et-matiere-de-l-apercu")).toHaveText(indication);
});

type SectionDeLIndex = { id: string; matiere: string; niveaux: string[]; domaine: string; section: string; extrait: string };
const INDEX_DES_PROGRAMMES: SectionDeLIndex[] = JSON.parse(readFileSync("app/programmes-index.json", "utf-8"));

function espacesNormalises(texte: string): string {
  return texte.replace(/\s+/g, " ").trim();
}

async function sectionsAffichees(page: Page): Promise<SectionDeLIndex[]> {
  const texte = espacesNormalises((await page.getByTestId("section-de-l-apercu").textContent()) ?? "");
  const retenues = INDEX_DES_PROGRAMMES.filter(({ domaine, section }) => espacesNormalises(`${domaine} : ${section}`) === texte);
  expect(retenues, `la section « ${texte} » est dans l'index des programmes`).not.toHaveLength(0);
  return retenues;
}

const couvreLeCE1EnFrancais = ({ matiere, niveaux }: SectionDeLIndex) => matiere === "francais" && niveaux.includes("CE1");

Then(/^l'aperçu de la leçon montre une section du programme de français qui couvre le CE1$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("section-de-l-apercu")).toBeVisible();
  expect((await sectionsAffichees(page)).some(couvreLeCE1EnFrancais), "la section montrée est une section de français du CE1").toBe(true);
});

Then(/^la citation de l'aperçu est recopiée mot pour mot de cette section du programme$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  const citation = espacesNormalises((await page.getByTestId("citation-de-l-apercu").textContent()) ?? "");
  expect(citation.length).toBeGreaterThan(0);
  const sections = (await sectionsAffichees(page)).filter(couvreLeCE1EnFrancais);
  expect(sections.some(({ extrait }) => espacesNormalises(extrait).includes(citation)), "la citation est dans l'extrait de la section").toBe(true);
});

Then(/^l'aperçu de la leçon ne signale aucune citation à vérifier$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(apercu(page)).toBeVisible();
  await expect(apercu(page).getByText(/à vérifier|non vérifiée|citation non/i)).toHaveCount(0);
});

Then(/^aucune leçon préparée n'est proposée à l'enregistrement$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(apercu(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Enregistrer pour / })).toHaveCount(0);
});

// Les messages sans guillemets internes (alertes) sont lus par l'étape générique de la connexion ; celui-ci porte des « » dans son texte.
Then(/^Paul est informé « (.*[«»].*) »$/, async ({ famille }, message: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("alert").or(page.getByTestId("lecon-enregistree")).filter({ hasText: message })).toBeVisible({
    timeout: DELAI_DU_SERVEUR_MS,
  });
});

Then(/^la classe proposée est « (.+) »$/, async ({ famille }, classe: string) => {
  const page = await famille.page("tablette");
  await expect(formulaire(page).getByLabel("Classe", { exact: true })).toHaveValue(classe);
});

// --- Alors : « Mes leçons »

Then(/^« Mes leçons » montre, et seulement elles :$/, async ({ famille }, tableau: DataTable) => {
  const page = await ouvrirMesLecons(famille, "Paul");
  const lignes = tableau.hashes();
  const cartes = page.getByTestId("lecon-personnelle");
  await expect(cartes).toHaveCount(lignes.length);
  for (const [rang, ligne] of lignes.entries()) {
    await expect(cartes.nth(rang).getByTestId("titre-de-la-lecon-personnelle")).toHaveText(String(ligne["leçon"]));
    await expect(cartes.nth(rang).getByTestId("enfant-de-la-lecon-personnelle")).toHaveText(String(ligne["enfant"]));
    await expect(cartes.nth(rang).getByTestId("description-de-la-lecon-personnelle")).toHaveText(String(ligne["description"]));
  }
});

Then(/^(Paul|Claire) lit « (.+) »$/, async ({ famille }, _parent: string, message: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByText(message, { exact: true })).toBeVisible({ timeout: DELAI_DU_SERVEUR_MS });
});

Then(/^la carte de la leçon « (.+) » permet de relire le texte « (.+) »$/, async ({ famille }, titre: string, texte: string) => {
  const page = await famille.page("tablette");
  const fiche = carte(page, titre);
  await expect(fiche).toHaveCount(1);
  await fiche.getByText("Texte collé", { exact: true }).click();
  await expect(fiche.getByTestId("texte-colle")).toBeVisible();
  await expect(fiche.getByTestId("texte-colle")).toHaveText(texte);
});

Then(/^seule la suppression est proposée pour « (.+) »$/, async ({ famille }, titre: string) => {
  const page = await famille.page("tablette");
  const fiche = carte(page, titre);
  await expect(fiche).toHaveCount(1);
  await expect(fiche.getByRole("button")).toHaveCount(1);
  await expect(fiche.getByRole("button", { name: /^Supprimer/ })).toBeVisible();
  await expect(fiche.getByRole("textbox")).toHaveCount(0);
  await expect(fiche.getByRole("link")).toHaveCount(0);
  await expect(fiche.getByRole("button", { name: /Modifier|Éditer|Changer/i })).toHaveCount(0);
});

Then(/^Paul doit confirmer la suppression$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(page.getByRole("button", { name: "Confirmer la suppression", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Annuler", exact: true })).toBeVisible();
});

Then(/^« Mes leçons » montre toujours « (.+) »$/, async ({ famille }, titre: string) => {
  const page = await famille.page("tablette");
  await expect(carte(page, titre)).toHaveCount(1);
});

Then(/^« Mes leçons » ne montre plus « (.+) »$/, async ({ famille }, titre: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByText("Chargement des leçons")).toHaveCount(0, { timeout: DELAI_DU_SERVEUR_MS });
  await expect(carte(page, titre)).toHaveCount(0, { timeout: DELAI_DU_SERVEUR_MS });
});

Then(/^« Mes leçons » ne montre pas le texte « (.+) »$/, async ({ famille }, texte: string) => {
  const page = await famille.page("tablette");
  await expect(page.getByTestId("texte-colle")).toHaveCount(0);
  await expect(page.getByText(texte)).toHaveCount(0);
});

async function mesLeconsDePaulSurLeTelephone(famille: Famille): Promise<Page> {
  const page = await entrerDansLesLecons(famille, "telephone", "Paul");
  await ouvrirLOnglet(page, "Mes leçons");
  await expect(page.getByText("Chargement des leçons")).toHaveCount(0, { timeout: DELAI_DU_SERVEUR_MS });
  return page;
}

Then(/^« Mes leçons » de Paul ne montre aucune leçon$/, async ({ famille }) => {
  const page = await mesLeconsDePaulSurLeTelephone(famille);
  await expect(page.getByText("Aucune leçon créée pour l'instant. Utilise l'onglet « Créer une leçon ».", { exact: true })).toBeVisible();
  await expect(page.getByTestId("lecon-personnelle")).toHaveCount(0);
});

Then(/^« Mes leçons » de Paul montre toujours « (.+) »$/, async ({ famille }, titre: string) => {
  const page = await mesLeconsDePaulSurLeTelephone(famille);
  await expect(carte(page, titre)).toHaveCount(1);
});

// --- Alors : chez l'enfant

function leconsDeToutesLesLecons(page: Page): Locator {
  return page.getByTestId("lecon-de-toutes-les-lecons");
}

Then(/^Léa ne trouve plus « (.+) » dans « Toutes les leçons »$/, async ({ famille, page }, titre: string) => {
  await ouvrirToutesLesLeconsDe(famille, page, "Léa");
  await expect(leconsDeToutesLesLecons(page).filter({ hasText: titre })).toHaveCount(0);
});

Then(/^« Toutes les leçons » montre en premier « (.+) » avec « Pour toi », à découvrir$/, async ({ page }, titre: string) => {
  const premiere = leconsDeToutesLesLecons(page).first();
  await expect(premiere).toBeVisible();
  await expect(premiere).toContainText("Pour toi");
  await expect(premiere).toContainText(titre);
  await expect(premiere).toHaveAttribute("data-etat", "aDecouvrir");
});

Then(/^aucune leçon n'est montrée avec « Pour toi »$/, async ({ page }) => {
  await expect(page.getByTestId("nombre-de-lecons")).toBeVisible();
  await expect(leconsDeToutesLesLecons(page).first()).toBeVisible();
  await expect(leconsDeToutesLesLecons(page).filter({ hasText: "Pour toi" })).toHaveCount(0);
  await expect(page.getByText("Pour toi")).toHaveCount(0);
});

// --- Alors : accès refusés

Then(/^la création est refusée comme pour un profil introuvable$/, async ({ famille }) => {
  const reponse = partie(famille).reponse;
  expect(reponse?.statut).toBe(404);
  expect(reponse?.message).toBe("Ce profil enfant est introuvable.");
});

Then(/^la suppression est refusée comme pour une leçon introuvable$/, async ({ famille }) => {
  const reponse = partie(famille).reponse;
  expect(reponse?.statut).toBe(404);
  expect(reponse?.message).toBe("Cette leçon personnelle est introuvable.");
});

// --- Alors : petit écran

Then(/^chaque champ et chaque bouton de « Créer une leçon » mesurent au moins 44 px de haut$/, async ({ famille }) => {
  const page = await famille.page("tablette");
  await expect(apercu(page)).toBeVisible();
  const panneau = section(page).getByRole("tabpanel");
  const cibles = [
    ...(await panneau.getByRole("textbox").all()),
    ...(await panneau.getByRole("combobox").all()),
    ...(await panneau.getByRole("button").all()),
  ];
  expect(cibles.length, "« Créer une leçon » a des champs et des boutons").toBeGreaterThan(0);
  for (const cible of cibles) {
    await cible.scrollIntoViewIfNeeded();
    const boite = await cible.boundingBox();
    const nom = (await cible.getAttribute("aria-label")) ?? ((await cible.textContent()) ?? "").trim() ?? "";
    expect(boite, `cible « ${nom} » visible`).not.toBeNull();
    expect(boite?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
  }
});
