import { animate } from "motion";

const ENFONCEMENT_EN_PX = 3;
const DUREE_MINIMALE_ENFONCE_EN_MS = 90;
const ASSOMBRISSEMENT = "color-mix(in srgb, %COULEUR% 82%, black)";

type Registre = "enfant" | "parent";

type Pression = {
  readonly bouton: HTMLButtonElement;
  readonly depuis: number;
  readonly registre: Registre;
  readonly mouvementsReduits: boolean;
  readonly fondAvant: string;
  readonly reliefAvant: string;
  readonly reliefEnfonce: string | undefined;
  minuteur?: ReturnType<typeof setTimeout>;
};

const MOUVEMENT_DE_RETOUR: Readonly<Record<Registre, Parameters<typeof animate>[2]>> = {
  enfant: { type: "spring", visualDuration: 0.25, bounce: 0.6 },
  parent: { duration: 0.12, ease: "easeOut" },
};

function boutonDe(cible: EventTarget | null): HTMLButtonElement | null {
  return cible instanceof Element ? cible.closest("button") : null;
}

function registreDe(bouton: HTMLButtonElement): Registre {
  return bouton.closest("[data-registre]")?.getAttribute("data-registre") === "parent" ? "parent" : "enfant";
}

function reliefEnfonceDe(bouton: HTMLButtonElement): string | undefined {
  if (getComputedStyle(bouton).boxShadow === "none") return undefined;
  return getComputedStyle(document.documentElement).getPropertyValue("--relief-enfonce").trim() || undefined;
}

function enfoncer(bouton: HTMLButtonElement): Pression {
  const style = getComputedStyle(bouton);
  const pression: Pression = {
    bouton,
    depuis: performance.now(),
    registre: registreDe(bouton),
    mouvementsReduits: matchMedia("(prefers-reduced-motion: reduce)").matches,
    fondAvant: bouton.style.backgroundColor,
    reliefAvant: bouton.style.boxShadow,
    reliefEnfonce: reliefEnfonceDe(bouton),
  };
  bouton.dataset.bouton = "enfonce";
  bouton.style.backgroundColor = ASSOMBRISSEMENT.replace("%COULEUR%", style.backgroundColor);
  if (!pression.mouvementsReduits) {
    if (pression.reliefEnfonce) bouton.style.boxShadow = pression.reliefEnfonce;
    animate(bouton, { y: ENFONCEMENT_EN_PX }, { duration: 0.06, ease: "easeOut" });
  }
  return pression;
}

function laisserRevenir(pression: Pression): void {
  const { bouton } = pression;
  bouton.style.backgroundColor = pression.fondAvant;
  if (pression.mouvementsReduits) {
    delete bouton.dataset.bouton;
    return;
  }
  bouton.style.boxShadow = pression.reliefAvant;
  bouton.dataset.bouton = "revient";
  void animate(bouton, { y: 0 }, MOUVEMENT_DE_RETOUR[pression.registre]).finished.then(() => {
    if (bouton.dataset.bouton !== "revient") return;
    delete bouton.dataset.bouton;
    bouton.style.transform = "";
  });
}

/**
 * Tout bouton s'enfonce quand on le presse (toucher, clic, Entrée ou Espace) puis revient à sa place :
 * avec un rebond léger chez l'enfant, sans rebond dans les écrans du parent, et par la seule couleur avec les mouvements réduits.
 * Un doigt qui glisse hors du bouton le laisse revenir. Retourne la fonction qui débranche l'écoute.
 */
export function brancherLeRessortDesBoutons(): () => void {
  let courante: Pression | undefined;

  const terminer = (pression: Pression) => {
    clearTimeout(pression.minuteur);
    if (courante === pression) courante = undefined;
    laisserRevenir(pression);
  };
  const relacher = () => {
    const pression = courante;
    if (!pression || pression.minuteur !== undefined) return;
    const reste = Math.max(0, DUREE_MINIMALE_ENFONCE_EN_MS - (performance.now() - pression.depuis));
    pression.minuteur = setTimeout(() => terminer(pression), reste);
  };
  const presser = (bouton: HTMLButtonElement | null) => {
    if (!bouton || bouton.disabled) return;
    if (courante) terminer(courante);
    courante = enfoncer(bouton);
  };
  const estUneTouchePourValider = (evenement: KeyboardEvent) => evenement.key === "Enter" || evenement.key === " ";

  const ecouteurs: ReadonlyArray<readonly [string, (evenement: never) => void]> = [
    ["pointerdown", (e: PointerEvent) => e.isPrimary && presser(boutonDe(e.target))],
    ["pointermove", (e: PointerEvent) => {
      if (!courante) return;
      const { left, right, top, bottom } = courante.bouton.getBoundingClientRect();
      if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) relacher();
    }],
    ["pointerup", relacher],
    ["pointercancel", relacher],
    ["keydown", (e: KeyboardEvent) => estUneTouchePourValider(e) && !e.repeat && presser(boutonDe(e.target))],
    ["keyup", (e: KeyboardEvent) => estUneTouchePourValider(e) && relacher()],
    ["focusout", relacher],
  ];
  for (const [nom, ecouteur] of ecouteurs) document.addEventListener(nom, ecouteur as EventListener, true);
  return () => {
    for (const [nom, ecouteur] of ecouteurs) document.removeEventListener(nom, ecouteur as EventListener, true);
  };
}
