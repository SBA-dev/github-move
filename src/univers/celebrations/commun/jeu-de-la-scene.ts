/** La célébration de l'univers dure 3 s au plus, quelle que soit la variante (décision 0039). */
export const DUREE_DE_LA_CELEBRATION_S = 3;

type Scene = {
  /** Fin de la scène, en secondes du temps de la maquette (la scène est accélérée pour tenir en `DUREE_DE_LA_CELEBRATION_S`). */
  readonly fin: number;
  /** L'instant où les confettis (ou les pétales) partent. */
  readonly tDesConfettis: number;
  /** Sans toile (mouvements réduits), il n'y en a pas. */
  readonly confettis: { avancer(dt: number): void } | null;
  rendre(t: number): void;
};

/** Joue la scène image par image, accélérée pour tenir en `duree` secondes (par défaut celles de la célébration) ; rend la fonction qui l'arrête. */
export function jouerLaScene(scene: Scene, quandTerminee: () => void, duree = DUREE_DE_LA_CELEBRATION_S): () => void {
  const vitesse = scene.fin / duree;
  const depart = performance.now();
  let precedent = 0, image = 0;
  const boucle = (maintenant: number) => {
    const t = Math.min(scene.fin, Math.max(0, (maintenant - depart) / 1000 * vitesse));
    if (t >= scene.tDesConfettis) scene.confettis?.avancer(Math.min(.05, t - Math.max(precedent, scene.tDesConfettis)));
    precedent = t;
    scene.rendre(t);
    if (t >= scene.fin) quandTerminee();
    else image = requestAnimationFrame(boucle);
  };
  scene.rendre(0);
  image = requestAnimationFrame(boucle);
  return () => cancelAnimationFrame(image);
}
