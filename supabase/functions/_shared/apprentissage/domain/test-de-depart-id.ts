export class TestDeDepartId {
  private constructor(readonly valeur: string) {}

  static de(valeur: string): TestDeDepartId {
    if (valeur.trim() === "") throw new Error("Un identifiant de test de départ ne peut pas être vide.");
    return new TestDeDepartId(valeur);
  }
}
