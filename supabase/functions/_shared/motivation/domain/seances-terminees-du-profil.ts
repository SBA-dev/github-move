export class SeancesTermineesDuProfil {
  private constructor(private readonly identifiants: ReadonlySet<string>) {}

  static reunir(...sources: readonly (readonly string[])[]): SeancesTermineesDuProfil {
    return new SeancesTermineesDuProfil(new Set(sources.flat()));
  }

  nombre(): number {
    return this.identifiants.size;
  }
}
