import type { InstantsDesMots } from "../domain/instants-des-mots.ts";
import type { LecteurDeSonsDePhrases } from "../domain/lecteur-de-sons-de-phrases.ts";
import type { SonDePhrase } from "../domain/son-de-phrase.ts";

export type SonJoue = {
  readonly son: SonDePhrase;
  readonly rythme: number;
  readonly instantsDesMots: InstantsDesMots | undefined;
};

export class LecteurDeSonsDePhrasesEnMemoire implements LecteurDeSonsDePhrases {
  readonly sonsJoues: SonJoue[] = [];
  readonly appels: Array<"jouer" | "arreter"> = [];
  nombreDArrets = 0;
  private echec: Error | undefined;
  private finsEnAttente: Array<() => void> = [];
  private finAutomatique = true;
  private motsAnnonces: number[] = [];

  constructor(private readonly journal: string[] = []) {}

  jouerSansTerminerAutomatiquement(): void {
    this.finAutomatique = false;
  }

  terminerLeSonEnCours(): void {
    this.finsEnAttente.shift()?.();
  }

  faireEchouerLesSons(erreur: Error): void {
    this.echec = erreur;
  }

  annoncerLesMots(...rangs: number[]): void {
    this.motsAnnonces = rangs;
  }

  jouer(
    son: SonDePhrase,
    rythme: number,
    instantsDesMots?: InstantsDesMots,
    onMot?: (rang: number) => void,
  ): Promise<void> {
    this.sonsJoues.push({ son, rythme, instantsDesMots });
    this.appels.push("jouer");
    this.journal.push(`son:${son.cle.valeur}`);
    if (this.echec) return Promise.reject(this.echec);
    this.motsAnnonces.forEach((rang) => onMot?.(rang));
    if (this.finAutomatique) return Promise.resolve();
    return new Promise((resolve) => this.finsEnAttente.push(resolve));
  }

  arreter(): void {
    this.nombreDArrets++;
    this.appels.push("arreter");
    this.journal.push("arret-son");
  }
}
