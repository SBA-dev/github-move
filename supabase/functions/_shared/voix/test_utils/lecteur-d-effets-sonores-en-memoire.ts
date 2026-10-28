import type { EffetSonore } from "../domain/effet-sonore.ts";
import type { LecteurDEffetsSonores } from "../domain/lecteur-d-effets-sonores.ts";

export class LecteurDEffetsSonoresEnMemoire implements LecteurDEffetsSonores {
  readonly effetsJoues: EffetSonore[] = [];
  readonly arrets: number[] = [];
  private finsEnAttente: Array<() => void> = [];
  private finAutomatique = true;

  constructor(private readonly journal: string[] = []) {}

  jouerSansTerminerAutomatiquement(): void {
    this.finAutomatique = false;
  }

  terminerLEffetEnCours(): void {
    this.finsEnAttente.shift()?.();
  }

  private echec = false;

  faireEchouerLesEffets(): void {
    this.echec = true;
  }

  jouer(effet: EffetSonore): Promise<void> {
    this.effetsJoues.push(effet);
    this.journal.push(`effet:${effet}`);
    if (this.echec) return Promise.reject(new Error("effet sonore impossible"));
    if (this.finAutomatique) return Promise.resolve();
    return new Promise((resolve) => this.finsEnAttente.push(resolve));
  }

  arreter(): void {
    this.arrets.push(1);
    this.journal.push("arret-effet");
  }
}
