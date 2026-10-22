export class ParentId {
  private constructor(readonly valeur: string) {}

  static de(valeur: string): ParentId {
    return new ParentId(valeur);
  }
}
