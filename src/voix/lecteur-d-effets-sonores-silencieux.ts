import type { LecteurDEffetsSonores } from "@domain/voix";

export class LecteurDEffetsSonoresSilencieux implements LecteurDEffetsSonores {
  jouer(): Promise<void> {
    return Promise.resolve();
  }

  arreter(): void {}
}
