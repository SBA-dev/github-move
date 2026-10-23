const APPAREILS_APPLE = /iPad|iPhone|iPod/;
const MAC_TACTILE = /Macintosh/;

type Navigateur = {
  readonly userAgent: string;
  readonly maxTouchPoints?: number;
  readonly standalone?: boolean;
};

// Safari sur iPad et iPhone ne propose pas d'installer l'application : on explique comment faire.
export function aideEcranDAccueilNecessaire(navigateur: Navigateur, affichageInstalle: boolean): boolean {
  return estUnAppareilApple(navigateur) && navigateur.standalone !== true && !affichageInstalle;
}

// Depuis iPadOS 13, Safari sur iPad se présente comme un Mac : seul l'écran tactile le distingue d'un Mac de bureau.
function estUnAppareilApple({ userAgent, maxTouchPoints = 0 }: Navigateur): boolean {
  return APPAREILS_APPLE.test(userAgent) || (MAC_TACTILE.test(userAgent) && maxTouchPoints > 1);
}
