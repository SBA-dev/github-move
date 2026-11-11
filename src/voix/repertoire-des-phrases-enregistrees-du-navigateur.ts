import type { RepertoireDesPhrasesEnregistrees } from "@domain/voix";

const REPERTOIRE_VIDE: RepertoireDesPhrasesEnregistrees = { voixEnregistree: "", phrases: {} };

export class RepertoireDesPhrasesEnregistreesDuNavigateur implements RepertoireDesPhrasesEnregistrees {
  private contenu = REPERTOIRE_VIDE;

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
  async charger(): Promise<void> {
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
