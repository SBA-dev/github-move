import { expect, type Page } from "@playwright/test";
import type { Famille } from "../support/famille.ts";
import type { Monde } from "./fixtures.ts";
import { assurerLeProfil, choisirSonProfil, type ProfilCree } from "./profils-enfants.steps.ts";
import { libelleDe } from "./univers.steps.ts";

// Story #24 : les séances terminées ne s'enregistrent que pour un vrai profil (UUID) d'un parent connecté.
// Le profil « préparé » du Contexte n'existe pas côté serveur : on crée le même profil pour Paul (Edge Function,
// avec son jeton), et Léa le choisit dans « Qui joue ? ». Ensuite, l'application ne se recharge plus (un rechargement
// ramènerait le profil préparé, sans identifiant) : on ouvre les pages de leçon dans l'application, comme un lien interne.

const surUnProfilReel = new WeakMap<Page, string>();

export function estSurUnProfilReel(page: Page): boolean {
  return surUnProfilReel.has(page);
}

export async function jouerAvecLeProfilReel(famille: Famille, monde: Monde, page: Page, prenom = "Léa"): Promise<ProfilCree> {
  const prepare = monde.profils.get(prenom);
  const profil = await assurerLeProfil(famille, "Paul", {
    prenom,
    niveau: prepare?.niveau ?? "CP",
    libelleUnivers: libelleDe(prepare?.univers ?? "animaux"),
  });
  await page.goto("/");
  await choisirSonProfil(page, prenom);
  surUnProfilReel.set(page, prenom);
  return profil;
}

/**
 * Story #27 : l'accueil de l'enfant charge la bibliothèque et la garde pour toute la session. Une leçon de test ajoutée après
 * l'accueil n'y serait pas : on recharge l'application et Léa se choisit de nouveau, comme si les leçons étaient là dès le départ.
 */
export async function rechargerAvecLeProfilReel(page: Page, prenom = surUnProfilReel.get(page) ?? "Léa"): Promise<void> {
  await page.goto("/");
  await choisirSonProfil(page, prenom);
}

/** Sur une autre page (le téléphone d'un parent connecté) : le profil de Léa est choisi dans « Qui joue ? ». */
export async function choisirLeaSur(page: Page): Promise<void> {
  await page.goto("/");
  await choisirSonProfil(page, "Léa");
  surUnProfilReel.set(page, "Léa");
}

async function allerDansLApplication(page: Page, chemin: string): Promise<void> {
  await page.evaluate((cible) => {
    history.pushState({ profondeur: 2, precedent: "/jeu" }, "", cible);
    dispatchEvent(new PopStateEvent("popstate"));
  }, chemin);
}

/** Ouvre la page de la leçon sans recharger l'application. Déjà sur cette page : on repasse par l'accueil de l'enfant. */
export async function ouvrirLaLeconDansLApplication(page: Page, leconId: string): Promise<void> {
  const chemin = `/lecon/${encodeURIComponent(leconId)}`;
  if (new URL(page.url()).pathname === chemin) {
    await allerDansLApplication(page, "/jeu");
    await expect(page.getByRole("region", { name: /^Accueil de / })).toBeVisible();
  }
  await allerDansLApplication(page, chemin);
}
