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

  constructor() {
    void this.charger();
  }

  sonDe(cle: CleDeLaPhrase): SonDePhrase | undefined {
    return this.sons.get(cle.valeur);
  }

  private async charger(): Promise<void> {
    try {
      const reponse = await fetch(ADRESSE_DU_REPERTOIRE);
      if (!reponse.ok) return;
      this.sons = sonsDe(await reponse.json() as FichierDuRepertoire);
    } catch {
      // Sans répertoire, aucun son n'est connu : la voix de l'appareil prend le relais.
    }
  }
}
