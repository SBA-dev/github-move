import type { Page } from "@playwright/test";
import { readFileSync } from "node:fs";

// Outils communs aux tests de caractérisation de l'application actuelle (app/).
// Hors de claude.ai, l'application range tout dans localStorage, sous la clé « ecole-v1 ».

export type Docs = Record<string, Record<string, unknown>>;

export type Lecon = {
  id: string;
  titre: string;
  niveau: string;
  matiere: string;
  ordre?: number;
  lecon?: unknown[];
  exercices: { type: string; questions?: { question: string; reponse: string }[] }[];
};

export const bibliotheque: Lecon[] = JSON.parse(
  readFileSync(new URL("../../app/bibliotheque.json", import.meta.url), "utf8"),
);

export const leconParId = (id: string): Lecon => {
  const lecon = bibliotheque.find((l) => l.id === id);
  if (!lecon) throw new Error(`Leçon introuvable : ${id}`);
  return lecon;
};

export function profilEnfant(id: string, champs: Record<string, unknown> = {}): Docs {
  return {
    [id]: {
      kind: "enfant",
      id,
      prenom: "Léa",
      niveau: "CP",
      univers: "animaux",
      cree: 1,
      testFait: true,
      dys: false,
      toutLire: false,
      libre: false,
      clavier: "auto",
      langueParent: "",
      ...champs,
    },
  };
}

export function progression(enfant: string, lecon: Lecon, champs: Record<string, unknown> = {}): Docs {
  return {
    [`progres_${enfant}_${lecon.id}`]: {
      kind: "progres",
      enfant,
      lecon: lecon.id,
      titre: lecon.titre,
      matiere: lecon.matiere,
      niveau: lecon.niveau,
      etoiles: 1,
      essais: 1,
      parType: {},
      maj: Date.now(),
      ...champs,
    },
  };
}

/** Questions à choix d'une leçon, et leur bonne réponse (bulles et lecture). */
export function reponsesDe(lecon: Lecon): Record<string, string> {
  return Object.fromEntries(
    lecon.exercices.flatMap((ex) => ex.questions ?? []).map((q) => [q.question, String(q.reponse)]),
  );
}

/**
 * Prépare le navigateur avant le chargement de l'application :
 * - écrit les profils et la progression dans localStorage (une seule fois par onglet) ;
 * - remplace la synthèse vocale par une voix silencieuse qui finit tout de suite ;
 * - rend le hasard déterministe (graine) ;
 * - active prefers-reduced-motion : les pauses de l'application sont alors courtes.
 */
export async function preparerNavigateur(page: Page, { docs = {}, graine = 1 }: { docs?: Docs; graine?: number } = {}) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.addInitScript(({ docs, graine }) => {
    if (!sessionStorage.getItem("tests-prepares")) {
      sessionStorage.setItem("tests-prepares", "1");
      localStorage.setItem("ecole-v1", JSON.stringify(docs));
    }
    let etat = graine >>> 0;
    Math.random = () => {
      etat = (etat + 0x6d2b79f5) >>> 0;
      let t = etat;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const voixSilencieuse = {
      speaking: false,
      pending: false,
      paused: false,
      onvoiceschanged: null,
      speak(enonce: SpeechSynthesisUtterance) {
        setTimeout(() => enonce.onend?.(new Event("end") as SpeechSynthesisEvent), 0);
      },
      cancel() {},
      pause() {},
      resume() {},
      getVoices: () => [],
      addEventListener() {},
      removeEventListener() {},
    };
    Object.defineProperty(window, "speechSynthesis", { value: voixSilencieuse, configurable: true });
  }, { docs, graine });
}

export async function lireDocs(page: Page): Promise<Docs> {
  return page.evaluate(() => JSON.parse(localStorage.getItem("ecole-v1") || "{}"));
}

/** Retient les erreurs JavaScript de la page (exceptions et promesses rejetées non traitées). */
export function surveillerErreurs(page: Page): string[] {
  const erreurs: string[] = [];
  page.on("pageerror", (e) => erreurs.push(e.message));
  return erreurs;
}

/**
 * Joue la leçon en cours jusqu'à l'écran de fin (médaille).
 * - questions à choix : la bonne réponse si la question est dans `reponses`, sinon « Je ne sais pas »
 *   puis la bulle qui brille (une erreur comptée) ;
 * - clavier de calcul : la réponse que l'application expose pour les tests (`__ecole.reponse`) ;
 * - dictée : le mot dicté (`__ecole.motDicte`) ;
 * - étiquettes (classer, ordre, addition posée) : la bonne maison, le bon rang, la bonne colonne ;
 * - boutons « Continuer », « J'ai écouté », « Je suis prêt », « C'est parti ! » ;
 * - calcul rapide : durée réduite à 1 seconde (`__ecole.fluenceDuree`).
 */
export async function jouerJusquALaFin(page: Page, { reponses = {}, delai = 90_000 }: { reponses?: Record<string, string>; delai?: number } = {}) {
  await page.evaluate(async ({ reponses, delai }) => {
    type Etiquette = HTMLElement & { _tag: { groupe?: string; i?: number; col?: number } };
    const ecole = (window as unknown as { __ecole: { reponse: number; motDicte: string; fluenceDuree: number } }).__ecole;
    ecole.fluenceDuree = 1;
    const tous = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T & HTMLElement>(s)];
    const un = (s: string) => document.querySelector<HTMLElement>(s);
    const fin = Date.now() + delai;

    const continuer = () => {
      const bouton = un(".scene .acts button.btn.small");
      bouton?.click();
      return !!bouton;
    };
    const bulles = () => {
      if (!un(".play .bubble")) return false;
      const brille = un(".play .bubble.hint");
      if (brille) return brille.click(), true;
      const question = un(".board .card.ask")?.textContent ?? "";
      const bonne = reponses[question];
      const cible = bonne === undefined ? null : tous(".play .bubble").find((b) => b.dataset.v === bonne);
      (cible ?? un(".play .idk"))?.click();
      return true;
    };
    const clavier = () => {
      if (!un(".play .keypad")) return false;
      const touches = tous(".play .crystal");
      for (const chiffre of String(ecole.reponse)) touches.find((t) => t.textContent === chiffre)?.click();
      un(".play .crystal.ok")?.click();
      return true;
    };
    const dictee = () => {
      if (!un(".play .letters")) return false;
      const lettres = [...ecole.motDicte].filter((c) => !/[\s'’\-.]/.test(c));
      const deja = tous(".word-slots .l .dg").length;
      for (const c of lettres.slice(deja)) tous(".play .letter").find((t) => t.textContent === c && !(t as HTMLButtonElement).disabled)?.click();
      return true;
    };
    const etiquettes = () => {
      const pierres = tous<Etiquette>(".tray .stone") as Etiquette[];
      const [premiere] = pierres;
      if (!premiere) return false;
      let pierre = premiere;
      let cible: HTMLElement | null | undefined;
      if (un(".house.drop")) cible = un(`.house.drop[data-g="${pierre._tag.groupe}"]`);
      else if (un(".slots-list.drop")) {
        pierre = pierres.reduce((a, b) => ((b._tag.i ?? 0) < (a._tag.i ?? 0) ? b : a));
        cible = un(".slots-list.drop");
      } else cible = tous(".towers .slot.drop")[pierre._tag.col ?? 0];
      pierre.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      cible?.click();
      return true;
    };

    while (!un(".medal")) {
      if (Date.now() > fin) throw new Error(`Écran de fin non atteint. Écran : ${un("#view")?.innerText.slice(0, 400)}`);
      bulles() || clavier() || dictee() || etiquettes() || continuer();
      await new Promise((r) => setTimeout(r, 30));
    }
  }, { reponses, delai });
}

/** Depuis « Qui joue aujourd'hui ? », choisit l'enfant puis ouvre la leçon par « Toutes les leçons ». */
export async function ouvrirLeconDepuisToutesLesLecons(page: Page, prenom: string, lecon: Lecon) {
  await page.locator(".profile", { hasText: prenom }).click();
  await page.getByRole("button", { name: "Toutes les leçons" }).click();
  await page.getByLabel("Niveau").selectOption(lecon.niveau);
  await page.getByLabel("Matière").selectOption(lecon.matiere);
  await page.locator(`.grid-lessons .lesson:has(.t:text-is(${JSON.stringify(lecon.titre)}))`).click();
  await page.getByRole("button", { name: "Leçon et tous les jeux" }).click();
}
