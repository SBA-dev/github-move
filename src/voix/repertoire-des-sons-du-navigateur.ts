import { CleDeLaPhrase, type RepertoireDesSons, type SonDePhrase } from "@domain/voix";

import { type FichierDuRepertoire, lireLeRepertoireDesSons } from "./repertoire-des-sons-lu.ts";

function sonsDe(fichier: FichierDuRepertoire): Map<string, SonDePhrase> {
  return new Map(
    Object.entries(fichier.sons).map(([cle, son]) => {
      const cleDeLaPhrase = CleDeLaPhrase.de(cle);
      return [cleDeLaPhrase.valeur, { cle: cleDeLaPhrase, fichier: `/voix/${son.fichier}`, dureeMs: son.dureeMs }];
    }),
  );
}

export class RepertoireDesSonsDuNavigateur implements RepertoireDesSons {
  private sons = new Map<string, SonDePhrase>();
  private charge = false;
  private readonly ecouteurs = new Set<() => void>();

  constructor() {
    void this.charger();
  }

  sonDe(cle: CleDeLaPhrase): SonDePhrase | undefined {
    return this.sons.get(cle.valeur);
  }

  /** Rappelle dès que le répertoire est chargé (tout de suite s'il l'est déjà) : la voix de l'application est alors disponible. */
  surChargement(rappel: () => void): () => void {
    if (this.charge) {
      rappel();
      return () => undefined;
    }
    this.ecouteurs.add(rappel);
    return () => this.ecouteurs.delete(rappel);
  }

  private async charger(): Promise<void> {
    const fichier = await lireLeRepertoireDesSons();
    if (fichier === undefined) return;
    this.sons = sonsDe(fichier);
    this.charge = true;
    this.ecouteurs.forEach((rappel) => rappel());
  }
}
