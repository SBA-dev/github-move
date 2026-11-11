import type { RepertoireDesPhrasesEnregistrees } from "@domain/voix";

const REPERTOIRE_VIDE: RepertoireDesPhrasesEnregistrees = { voixEnregistree: "", phrases: {} };

export class RepertoireDesPhrasesEnregistreesDuNavigateur implements RepertoireDesPhrasesEnregistrees {
  private contenu = REPERTOIRE_VIDE;
  private chargement: Promise<void> | undefined;

  get voixEnregistree(): string {
    return this.contenu.voixEnregistree;
  }

  get phrases(): RepertoireDesPhrasesEnregistrees["phrases"] {
    return this.contenu.phrases;
  }

  get charge(): boolean {
    return this.contenu !== REPERTOIRE_VIDE;
  }

  /** Sans répertoire lisible, toutes les phrases partent à la voix de l'appareil, sans erreur visible. */
  charger(): Promise<void> {
    this.chargement ??= this.lire();
    return this.chargement;
  }

  private async lire(): Promise<void> {
    try {
      const reponse = await fetch("/voix/repertoire.json");
      if (!reponse.ok) return;
      const lu = await reponse.json() as RepertoireDesPhrasesEnregistrees;
      if (typeof lu.voixEnregistree === "string" && typeof lu.phrases === "object" && lu.phrases !== null) this.contenu = lu;
    } catch {
      // Répertoire absent ou illisible : répertoire vide.
    }
  }
}

/** Un seul répertoire pour l'application : le fichier n'est lu qu'une fois. */
export const repertoireDuNavigateur = new RepertoireDesPhrasesEnregistreesDuNavigateur();
