import type { Page } from "@playwright/test";

// Story #96 : deux enregistreurs posés avant toute navigation, pour mesurer ce que les scénarios décrivent.
// - les mouvements des écrans (glissement, fondu, rebond) : une « excursion » commence quand un élément de l'application
//   quitte son état de repos (transform identité, opacité 1) et se termine quand il y revient ;
// - les requêtes réseau (polices demandées à un autre site).

export type Excursion = {
  debut: number;
  fin: number | null;
  txDepart: number;
  txMax: number;
  tyMax: number;
  echelleMax: number;
  echelleMin: number;
  opaciteMin: number;
  parti: boolean;
};

declare global {
  interface Window {
    __mouvements?: { excursions: Array<Excursion & { element: Element }>; insertion: (element: Element) => number };
  }
}

function enregistrerLesMouvements(): void {
  if (window.__mouvements) return;
  const excursions: Array<Excursion & { element: Element }> = [];
  const inseres = new WeakMap<Node, number>();
  new MutationObserver((mutations) => {
    for (const mutation of mutations) for (const noeud of Array.from(mutation.addedNodes)) inseres.set(noeud, performance.now());
  }).observe(document, { childList: true, subtree: true });
  const insertion = (element: Element): number => {
    for (let courant: Element | null = element; courant; courant = courant.parentElement) {
      const quand = inseres.get(courant);
      if (quand !== undefined) return quand;
    }
    return 0;
  };
  window.__mouvements = { excursions, insertion };
  const encours = new Map<Element, Excursion & { element: Element }>();
  const ignore = (el: Element) => el.closest('[data-testid="personnage-guide"], [data-testid="paysage"], [aria-hidden="true"]') !== null;

  function elementsSuivis(): Element[] {
    const racine = document.querySelector(".application") ?? document.body;
    const liste: Element[] = [];
    const parcourir = (el: Element, profondeur: number) => {
      if (profondeur > 5) return;
      for (const enfant of Array.from(el.children)) {
        if (ignore(enfant) || enfant.matches("header, [role=banner]")) continue;
        liste.push(enfant);
        parcourir(enfant, profondeur + 1);
      }
    };
    parcourir(racine, 0);
    return liste;
  }

  function image(maintenant: number) {
    const vus = new Set<Element>();
    for (const el of elementsSuivis()) {
      vus.add(el);
      const style = getComputedStyle(el);
      const t = style.transform;
      const m = t && t !== "none" ? new DOMMatrix(t) : new DOMMatrix();
      const opacite = parseFloat(style.opacity);
      const repos = Math.abs(m.e) < 0.5 && Math.abs(m.f) < 0.5 && Math.abs(m.a - 1) < 0.005 && Math.abs(m.d - 1) < 0.005 &&
        opacite > 0.995;
      const courante = encours.get(el);
      if (!repos && !courante) {
        const neuve = {
          element: el,
          debut: maintenant,
          fin: null,
          txDepart: m.e,
          txMax: Math.abs(m.e),
          tyMax: Math.abs(m.f),
          echelleMax: m.a,
          echelleMin: m.a,
          opaciteMin: opacite,
          parti: false,
        };
        encours.set(el, neuve);
        excursions.push(neuve);
      } else if (courante) {
        courante.txMax = Math.max(courante.txMax, Math.abs(m.e));
        courante.tyMax = Math.max(courante.tyMax, Math.abs(m.f));
        courante.echelleMax = Math.max(courante.echelleMax, m.a);
        courante.echelleMin = Math.min(courante.echelleMin, m.a);
        courante.opaciteMin = Math.min(courante.opaciteMin, opacite);
        if (repos) {
          courante.fin = maintenant;
          encours.delete(el);
        }
      }
    }
    for (const [el, courante] of encours) {
      if (!vus.has(el) || !el.isConnected) {
        courante.fin = maintenant;
        courante.parti = true;
        encours.delete(el);
      }
    }
  }

  const boucle = (maintenant: number) => {
    image(maintenant);
    requestAnimationFrame(boucle);
  };
  requestAnimationFrame(boucle);
}

export async function installerLesEnregistreurs(page: Page): Promise<void> {
  await page.addInitScript(enregistrerLesMouvements);
}

export class RequetesVues {
  readonly polices: Array<{ url: string; origine: string }> = [];
  constructor(page: Page) {
    page.on("request", (requete) => {
      const url = requete.url();
      const estUnePolice = requete.resourceType() === "font" || /\.(woff2?|ttf|otf)(\?|$)/i.test(url) ||
        /fonts\.(googleapis|gstatic)\.com|use\.typekit\.net|fonts\.bunny\.net|use\.fontawesome\.com/i.test(url);
      if (estUnePolice) this.polices.push({ url, origine: new URL(url).origin });
    });
  }
}
