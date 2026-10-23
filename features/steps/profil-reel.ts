import { expect, type Page } from "@playwright/test";
import type { Famille } from "../support/famille.ts";
import type { Monde } from "./fixtures.ts";
import { assurerLeProfil, choisirSonProfil, type ProfilCree } from "./profils-enfants.steps.ts";
import { libelleDe } from "./univers.steps.ts";

// Story #24 : les séances terminées ne s'enregistrent que pour un vrai profil (UUID) d'un parent connecté.
// Le profil « préparé » du Contexte n'existe pas côté serveur : on crée le même profil pour Paul (Edge Function,
// avec son jeton), et Léa le choisit dans « Qui joue ? ». Ensuite, l'application ne se recharge plus (un rechargement
// ramènerait le profil préparé, sans identifiant) : on ouvre les pages de leçon dans l'application, comme un lien interne.

const surUnProfilReel = new WeakSet<Page>();

export function estSurUnProfilReel(page: Page): boolean {
  return surUnProfilReel.has(page);
}

export async function jouerAvecLeProfilReel(famille: Famille, monde: Monde, page: Page): Promise<ProfilCree> {
  const prepare = monde.profils.get("Léa");
  const profil = await assurerLeProfil(famille, "Paul", {
    prenom: "Léa",
    niveau: prepare?.niveau ?? "CP",
    libelleUnivers: libelleDe(prepare?.univers ?? "animaux"),
  });
  await page.goto("/");
  await choisirSonProfil(page, "Léa");
  surUnProfilReel.add(page);
  return profil;
}

/** Sur une autre page (le téléphone d'un parent connecté) : le profil de Léa est choisi dans « Qui joue ? ». */
export async function choisirLeaSur(page: Page): Promise<void> {
  await page.goto("/");
  await choisirSonProfil(page, "Léa");
  surUnProfilReel.add(page);
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
