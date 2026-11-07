import { CleDeLaPhrase, type RepertoireDesSons, type SonDePhrase } from "@domain/voix";

const ADRESSE_DU_REPERTOIRE = "/voix/repertoire.json";

type SonDuRepertoire = { readonly fichier: string; readonly dureeMs: number };
type FichierDuRepertoire = { readonly sons: Readonly<Record<string, SonDuRepertoire>> };

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
    try {
      const reponse = await fetch(ADRESSE_DU_REPERTOIRE);
      if (!reponse.ok) return;
      this.sons = sonsDe(await reponse.json() as FichierDuRepertoire);
      this.charge = true;
      this.ecouteurs.forEach((rappel) => rappel());
    } catch {
      // Sans répertoire, aucun son n'est connu : la voix de l'appareil prend le relais.
    }
  }
}
