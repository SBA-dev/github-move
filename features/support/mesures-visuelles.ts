import type { ElementHandle, Locator, Page } from "@playwright/test";
import type { Excursion } from "./enregistreurs-visuels.ts";

// Story #96 : mesures objectives faites dans le navigateur (couleurs calculées, polices, mouvements).

// --- Couleurs

/** « rgb(r, g, b) » de chaque couleur donnée en hexadécimal. */
export function rgbDe(hexa: string): string {
  const n = parseInt(hexa.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

/** Nombre d'éléments visibles (hors paysage et personnage guide) qui portent l'une de ces couleurs : texte, fond ou bordure. */
export async function elementsAvecCesCouleurs(page: Page, couleurs: readonly string[], dans?: Locator): Promise<number> {
  const racine = dans ? await dans.elementHandle() : null;
  return await page.evaluate(([cibles, debut]) => {
    const racineDeRecherche = (debut as Element | null) ?? document.body;
    const canvas = document.createElement("canvas").getContext("2d");
    const normaliser = (valeur: string): string => {
      if (!canvas) return valeur;
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = "#000";
      canvas.fillStyle = valeur;
      canvas.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
      return a === 255 ? `rgb(${r}, ${g}, ${b})` : "";
    };
    const voulues = new Set(cibles as string[]);
    const porte = (el: Element): boolean => {
      const s = getComputedStyle(el);
      const aDuTexte = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim() !== "");
      const candidates: string[] = [s.backgroundColor];
      if (aDuTexte) candidates.push(s.color);
      for (const cote of ["Top", "Bottom", "Left", "Right"] as const) {
        const largeur = parseFloat(s.getPropertyValue(`border-${cote.toLowerCase()}-width`));
        if (largeur > 0 && s.getPropertyValue(`border-${cote.toLowerCase()}-style`) !== "none") {
          candidates.push(s.getPropertyValue(`border-${cote.toLowerCase()}-color`));
        }
      }
      return candidates.some((c) => voulues.has(normaliser(c)));
    };
    let total = 0;
    const tous = [racineDeRecherche, ...Array.from(racineDeRecherche.querySelectorAll("*"))];
    for (const el of tous) {
      if (el.closest('[data-testid="paysage"], [data-testid="personnage-guide"]')) continue;
      const boite = el.getBoundingClientRect();
      if (boite.width === 0 || boite.height === 0) continue;
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none") continue;
      if (porte(el)) total++;
    }
    return total;
  }, [couleurs as string[], racine] as const);
}

export type ContrasteInsuffisant = { selecteur: string; texte: string; rapport: number; couleur: string; fond: string };

/** Les textes et boutons visibles dont le contraste avec leur fond effectif est inférieur à 4,5:1. */
export async function contrastesInsuffisants(page: Page): Promise<{ insuffisants: ContrasteInsuffisant[]; mesures: number }> {
  return await page.evaluate(() => {
    const canvas = document.createElement("canvas").getContext("2d");
    type Rgba = [number, number, number, number];
    const lire = (valeur: string): Rgba => {
      if (!canvas) return [0, 0, 0, 1];
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = "#000";
      canvas.fillStyle = valeur;
      canvas.globalCompositeOperation = "copy";
      canvas.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
      return [r ?? 0, g ?? 0, b ?? 0, (a ?? 255) / 255];
    };
    const sur = (dessus: Rgba, dessous: Rgba): Rgba => {
      const a = dessus[3] + dessous[3] * (1 - dessus[3]);
      if (a === 0) return [0, 0, 0, 0];
      const c = (i: 0 | 1 | 2) => (dessus[i] * dessus[3] + dessous[i] * dessous[3] * (1 - dessus[3])) / a;
      return [c(0), c(1), c(2), a];
    };
    const luminance = ([r, g, b]: Rgba): number => {
      const l = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * l(r) + 0.7152 * l(g) + 0.0722 * l(b);
    };
    const rapport = (a: Rgba, b: Rgba): number => {
      const [clair, fonce] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
      return (clair + 0.05) / (fonce + 0.05);
    };
    const couleursDuDegrade = (image: string): Rgba[] =>
      (image.match(/rgba?\([^)]*\)|color\([^)]*\)/g) ?? []).map(lire);
    // Les fonds possibles du texte : une couleur, ou toutes les couleurs d'un dégradé (le pire cas compte).
    // Les couleurs du paysage de l'univers (ciel, lointain, collines, arbres), lues dans le DOM de son SVG : le pire cas compte.
    const couleursDuPaysage = (): Rgba[] => {
      const paysage = document.querySelector('[data-testid="paysage"]');
      if (!paysage) return [];
      const couleurs = [lire(getComputedStyle(paysage).backgroundColor)];
      for (const forme of Array.from(paysage.querySelectorAll("svg stop, svg path, svg g, svg rect"))) {
        const s = getComputedStyle(forme);
        const brute = forme.tagName === "stop" ? s.stopColor : s.fill;
        if (brute && brute !== "none" && !brute.startsWith("url(")) couleurs.push(lire(brute));
      }
      return couleurs.filter((c) => c[3] >= 0.999);
    };
    // Les fonds possibles du texte : une couleur, ou toutes les couleurs d'un dégradé (le pire cas compte).
    // Sans fond opaque parmi les ancêtres (le fond du body est caché par le décor), le texte est sur le paysage.
    const fondsPossibles = (el: Element): Rgba[][] => {
      const pile: Rgba[][] = [];
      const paysage = couleursDuPaysage();
      for (let courant: Element | null = el; courant; courant = courant.parentElement) {
        if (paysage.length > 0 && (courant === document.body || courant === document.documentElement)) {
          pile.push(paysage);
          return pile;
        }
        const s = getComputedStyle(courant);
        const couches: Rgba[] = [];
        const image = s.backgroundImage;
        if (image !== "none" && /gradient/.test(image)) couches.push(...couleursDuDegrade(image));
        const unie = lire(s.backgroundColor);
        pile.push(couches.length > 0 ? couches : [unie]);
        if (couches.length === 0 && unie[3] >= 0.999) break;
        if (couches.length > 0 && couches.every((c) => c[3] >= 0.999)) break;
      }
      return pile;
    };
    const opaciteEffective = (el: Element): number => {
      let o = 1;
      for (let c: Element | null = el; c; c = c.parentElement) o *= parseFloat(getComputedStyle(c).opacity);
      return o;
    };
    const decrire = (e: Element): string => {
      const id = e.getAttribute("data-testid");
      return e.tagName.toLowerCase() + (id ? `[data-testid=${id}]` : "") + (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/).join(".") : "");
    };
    const resultats: Array<{ selecteur: string; texte: string; rapport: number; couleur: string; fond: string }> = [];
    let mesures = 0;
    const racine = document.querySelector(".application") ?? document.body;
    for (const el of [racine, ...Array.from(racine.querySelectorAll("*"))]) {
      if (el.closest('[data-testid="paysage"], [data-testid="personnage-guide"], svg')) continue;
      const texte = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent ?? "").join("").trim();
      if (texte === "") continue;
      const boite = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (boite.width === 0 || boite.height === 0 || s.visibility === "hidden" || s.display === "none") continue;
      if (el.closest("[disabled], [aria-disabled='true']")) continue;
      mesures++;
      const opacite = opaciteEffective(el);
      const couleur = lire(s.color);
      const couches = fondsPossibles(el);
      // Toutes les combinaisons de fonds (un dégradé donne plusieurs possibilités).
      let combinaisons: Rgba[] = [[255, 255, 255, 1]];
      for (const couche of couches.slice().reverse()) {
        combinaisons = couche.flatMap((dessus) => combinaisons.map((dessous) => sur(dessus, dessous)));
      }
      for (const fond of combinaisons) {
        const texteVisible = sur([couleur[0], couleur[1], couleur[2], couleur[3] * opacite], fond);
        const r = rapport(texteVisible, fond);
        if (r < 4.5) {
          resultats.push({ selecteur: decrire(el), texte: texte.slice(0, 40), rapport: Math.round(r * 100) / 100, couleur: s.color, fond: `rgb(${fond.slice(0, 3).map(Math.round).join(", ")})` });
          break;
        }
      }
    }
    return { insuffisants: resultats, mesures };
  });
}

// --- Polices

export type StylesDuTexte = { famille: string; texte: string };

export async function famillesDe(locator: Locator): Promise<StylesDuTexte[]> {
  return await locator.evaluateAll((elements) =>
    elements.filter((el) => {
      const boite = el.getBoundingClientRect();
      return boite.width > 0 && boite.height > 0 && getComputedStyle(el).visibility !== "hidden";
    }).map((el) => ({
      famille: getComputedStyle(el).fontFamily.split(",")[0]?.replace(/["']/g, "").trim() ?? "",
      texte: (el.textContent ?? "").trim().slice(0, 30),
    }))
  );
}

// --- Mouvements enregistrés pendant un changement d'écran

export type BilanDesMouvements = { recents: Excursion[]; tous: Excursion[]; termine: boolean };

/** Les excursions des éléments qui contiennent la racine de l'écran (ou qu'elle contient), les plus récentes à part. */
export async function bilanDesMouvementsDe(page: Page, racine: ElementHandle<Element>): Promise<BilanDesMouvements> {
  return await page.evaluate((cible) => {
    // L'arrivée est le mouvement de l'écran lui-même ou de son enveloppe (`data-transition`), pas ceux de son contenu :
    // le contenu d'un écran peut s'insérer plus tard que l'enveloppe qui glisse ou apparaît.
    const enveloppe = cible.closest("[data-transition]") ?? cible;
    const depuis = (window.__mouvements?.insertion(enveloppe) ?? 0) - 50;
    const liees = (window.__mouvements?.excursions ?? []).filter((e) =>
      e.element.isConnected && e.debut >= depuis && e.element.contains(cible)
    );
    const copie = (e: (typeof liees)[number]): Excursion => ({
      debut: e.debut,
      fin: e.fin,
      txDepart: e.txDepart,
      txMax: e.txMax,
      tyMax: e.tyMax,
      echelleMax: e.echelleMax,
      echelleMin: e.echelleMin,
      opaciteMin: e.opaciteMin,
      parti: e.parti,
    });
    const dernier = Math.max(0, ...liees.map((e) => e.debut));
    const recents = liees.filter((e) => e.debut >= dernier - 150);
    return { recents: recents.map(copie), tous: liees.map(copie), termine: liees.every((e) => e.fin !== null) };
  }, racine);
}

// --- Bouton qui s'enfonce

export type Echantillon = { haut: number; gauche: number; transform: string; fond: string; filtre: string; present: boolean };

/** Observe un élément à chaque image jusqu'à l'arrêt : sa position, sa transformation, son fond. */
export async function suivreUnElement(page: Page, element: ElementHandle<Element>): Promise<void> {
  await page.evaluate((el) => {
    const suivi = { echantillons: [] as Array<{ haut: number; gauche: number; transform: string; fond: string; filtre: string; present: boolean }>, arret: false };
    Reflect.set(window, "__suivi", suivi);
    const image = () => {
      const boite = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      suivi.echantillons.push({ haut: boite.top, gauche: boite.left, transform: s.transform, fond: s.backgroundColor, filtre: s.filter, present: el.isConnected });
      if (!suivi.arret) requestAnimationFrame(image);
    };
    image();
  }, element);
}

/**
 * Attend, après une action, que l'élément ait réagi puis se soit stabilisé (six images identiques de suite), qu'il ait quitté
 * la page, ou que quarante images se soient écoulées sans changement (aucune réaction).
 */
export async function attendreQueLElementSeStabilise(page: Page, depuis: number): Promise<void> {
  await page.waitForFunction((debut) => {
    const suivi = Reflect.get(window, "__suivi") as { echantillons: Array<{ haut: number; gauche: number; transform: string; fond: string; filtre: string; present: boolean }> };
    const apres = suivi.echantillons.slice(debut);
    const reference = JSON.stringify(suivi.echantillons[debut - 1]);
    const dernier = apres[apres.length - 1];
    if (dernier && !dernier.present) return true;
    if (apres.length >= 40) return true;
    const aReagi = apres.some((e) => JSON.stringify(e) !== reference);
    const dernieres = apres.slice(-6);
    if (!aReagi || dernieres.length < 6) return false;
    return dernieres.every((e) => JSON.stringify(e) === JSON.stringify(dernieres[0]));
  }, depuis);
}

export async function nombreDEchantillons(page: Page): Promise<number> {
  return await page.evaluate(() => (Reflect.get(window, "__suivi") as { echantillons: unknown[] }).echantillons.length);
}

export async function arreterLeSuivi(page: Page): Promise<Echantillon[]> {
  return await page.evaluate(() => {
    const suivi = Reflect.get(window, "__suivi") as { echantillons: Array<{ haut: number; gauche: number; transform: string; fond: string; filtre: string; present: boolean }>; arret: boolean };
    suivi.arret = true;
    return suivi.echantillons;
  });
}

/** Le déplacement vertical et horizontal d'un échantillon par rapport au repos, transformation comprise. */
export function ecartAuRepos(repos: Echantillon, e: Echantillon): number {
  return Math.hypot(e.haut - repos.haut, e.gauche - repos.gauche) + (e.transform !== repos.transform ? 0.0001 : 0);
}
