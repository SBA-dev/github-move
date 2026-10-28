import type { EffetSonore, LecteurDEffetsSonores } from "@domain/voix";

export const FICHIER_DE_L_EFFET: Readonly<Record<EffetSonore, string>> = {
  reponseJuste: "reponse-juste",
  reponseFausse: "reponse-fausse",
  pointDuRecipient: "point-du-recipient",
  texteComplet: "texte-complet",
  seanceTerminee: "seance-terminee",
  grandeVictoire: "grande-victoire",
  decouverte: "decouverte",
  boutonTouche: "bouton-touche",
};

// Un son qui ne finit jamais (bloqué par le navigateur) ne doit pas retenir la parole.
const GARDE_DE_DUREE_MS = 3000;

function ignorerLEchec(action: () => unknown): void {
  try {
    const resultat = action();
    if (resultat instanceof Promise) resultat.catch(() => undefined);
  } catch {
    // Un effet sonore est un plus : son absence ne bloque rien.
  }
}

export class LecteurDEffetsSonoresDuNavigateur implements LecteurDEffetsSonores {
  private readonly sons = new Map<EffetSonore, HTMLAudioElement>();
  private enCours: { readonly son: HTMLAudioElement; readonly terminer: () => void } | undefined;

  constructor() {
    for (const [effet, fichier] of Object.entries(FICHIER_DE_L_EFFET) as [EffetSonore, string][]) {
      const son = new Audio(`/sons/${fichier}.mp3`);
      son.preload = "auto";
      this.sons.set(effet, son);
    }
  }

  /** À appeler pendant un toucher : iPhone et iPad n'autorisent ensuite chaque son qu'après l'avoir démarré une fois. */
  amorcer(): void {
    for (const son of this.sons.values()) {
      ignorerLEchec(() => {
        son.muted = true;
        return son.play()?.then(() => {
          son.pause();
          son.currentTime = 0;
          son.muted = false;
        });
      });
    }
  }

  jouer(effet: EffetSonore): Promise<void> {
    const son = this.sons.get(effet);
    if (!son) return Promise.resolve();
    this.arreter();
    return new Promise<void>((resolve, reject) => {
      const garde = setTimeout(() => terminer(), GARDE_DE_DUREE_MS);
      const nettoyer = () => {
        clearTimeout(garde);
        son.removeEventListener("ended", terminer);
        son.removeEventListener("error", echouer);
        if (this.enCours?.son === son) this.enCours = undefined;
      };
      const terminer = () => {
        nettoyer();
        resolve();
      };
      const echouer = () => {
        nettoyer();
        reject(new Error(`Effet sonore illisible : ${effet}`));
      };
      son.addEventListener("ended", terminer);
      son.addEventListener("error", echouer);
      this.enCours = { son, terminer };
      son.muted = false;
      son.currentTime = 0;
      son.play().catch(echouer);
    });
  }

  arreter(): void {
    const lecture = this.enCours;
    if (!lecture) return;
    ignorerLEchec(() => lecture.son.pause());
    lecture.son.currentTime = 0;
    lecture.terminer();
  }
}
