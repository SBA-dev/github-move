export class SeanceId {
  private constructor(readonly valeur: string) {}

  static de(valeur: string): SeanceId {
    if (valeur.trim() === "") throw new Error("Un identifiant de séance ne peut pas être vide.");
    return new SeanceId(valeur);
  }
}
