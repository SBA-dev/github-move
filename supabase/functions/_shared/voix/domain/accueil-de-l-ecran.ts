/** L'accueil d'un écran ne passe jamais devant une lecture demandée par l'enfant. */
export class AccueilDeLEcran {
  private lectureDemandee = false;

  noterUneLectureDemandeeParLEnfant(): void {
    this.lectureDemandee = true;
  }

  peutEtreDit(): boolean {
    return !this.lectureDemandee;
  }
}
