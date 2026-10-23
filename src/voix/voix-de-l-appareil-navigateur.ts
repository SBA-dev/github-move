import type { VoixDeLAppareil, VoixDisponible } from "@domain/voix";
import { syntheseVocale } from "./lecteur-synthese-vocale.ts";

export class VoixDeLAppareilNavigateur implements VoixDeLAppareil {
  private voix: readonly VoixDisponible[] = [];
  private ecouteInstallee = false;
  private readonly abonnes = new Set<() => void>();

  voixDisponibles(): readonly VoixDisponible[] {
    this.ecouterLesChangements();
    if (this.voix.length === 0) this.recharger();
    return this.voix;
  }

  surChangement(rappel: () => void): () => void {
    this.ecouterLesChangements();
    this.abonnes.add(rappel);
    return () => this.abonnes.delete(rappel);
  }

  private ecouterLesChangements(): void {
    const synthese = syntheseVocale();
    if (!synthese || this.ecouteInstallee) return;
    this.ecouteInstallee = true;
    synthese.onvoiceschanged = () => {
      this.recharger();
      this.abonnes.forEach((rappel) => rappel());
    };
  }

  private recharger(): void {
    this.voix = (syntheseVocale()?.getVoices() ?? []).map(({ name, lang }) => ({ nom: name, langue: lang }));
  }
}
