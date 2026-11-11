import type { MorceauDeLecture } from "../domain/plan-de-lecture.ts";
import type { LecteurDePhrasesEnregistrees, SuiviDUnMorceau } from "../domain/lecteur-de-phrases-enregistrees.ts";
import { VoixBloquee } from "../domain/erreurs.ts";

export class LecteurDePhrasesEnregistreesEnMemoire implements LecteurDePhrasesEnregistrees {
  readonly morceauxJoues: MorceauDeLecture[] = [];
  nombreDArrets = 0;
  private phrasesIllisibles = new Set<string>();
  private refus = false;
  private dureeMs = 1000;
  private progressions: number[] = [];
  private finDuMorceau: (() => void) | undefined;
  private finAutomatique = true;

  constructor(private readonly journal: string[] = []) {}

  rendreIllisible(phrase: string): void {
    this.phrasesIllisibles.add(phrase);
  }

  refuserDeJouer(): void {
    this.refus = true;
  }

  avecUneDuree(dureeMs: number): void {
    this.dureeMs = dureeMs;
  }

  avecLeTempsQuiPasse(...ecoulesMs: number[]): void {
    this.progressions = ecoulesMs;
  }

  jouerSansTerminerAutomatiquement(): void {
    this.finAutomatique = false;
  }

  jouer(morceau: MorceauDeLecture, suivi: SuiviDUnMorceau): Promise<void> {
    if (this.refus) return Promise.reject(new VoixBloquee());
    if (this.phrasesIllisibles.has(morceau.phrase)) return Promise.reject(new Error("illisible"));
    this.morceauxJoues.push(morceau);
    this.journal.push(`mp3:${morceau.phrase}`);
    suivi.onDebut(this.dureeMs);
    for (const ecouleMs of this.progressions) suivi.onProgression(ecouleMs);
    if (this.finAutomatique) return Promise.resolve();
    return new Promise((resolve) => this.finDuMorceau = resolve);
  }

  arreter(): void {
    this.nombreDArrets++;
    this.finDuMorceau?.();
    this.finDuMorceau = undefined;
  }
}
