const APPAREILS_APPLE = /iPad|iPhone|iPod/;

type Navigateur = {
  readonly userAgent: string;
  readonly standalone?: boolean;
};

// Safari sur iPad et iPhone ne propose pas d'installer l'application : on explique comment faire.
export function aideEcranDAccueilNecessaire(navigateur: Navigateur, affichageInstalle: boolean): boolean {
  return APPAREILS_APPLE.test(navigateur.userAgent) && navigateur.standalone !== true && !affichageInstalle;
}
