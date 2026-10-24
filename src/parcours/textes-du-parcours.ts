import type { CodeDeMatiere } from "@domain/catalogue";
import type { LeconDuParcours } from "@domain/apprentissage";
import { etoilesSurTrois } from "../seance/fin-de-seance/texte-des-etoiles.ts";

export const AUCUNE_LECON_POUR_LA_CLASSE = "Aucune leçon pour ta classe pour l'instant.";

const LIBELLES_DES_ONGLETS: Readonly<Record<CodeDeMatiere, string>> = {
  francais: "Français",
  maths: "Maths",
  sciences: "Sciences",
  histoire: "Histoire-géo",
  anglais: "Anglais",
  emc: "Vivre ensemble",
};

export function libelleDeLOnglet(matiere: CodeDeMatiere): string {
  return LIBELLES_DES_ONGLETS[matiere];
}

export function compteurDuParcours(reussies: number, total: number): string {
  return `${reussies} leçon${reussies > 1 ? "s réussies" : " réussie"} sur ${total}`;
}

export function libelleDeLEtat(lecon: LeconDuParcours): string {
  switch (lecon.etat.genre) {
    case "reussie":
      return "Réussie";
    case "prochaine":
      return "À toi !";
    case "aDecouvrir":
      return "À découvrir";
  }
}

/** Ce que lit un lecteur d'écran pour une leçon du parcours. */
export function annonceDeLaLecon(lecon: LeconDuParcours): string {
  switch (lecon.etat.genre) {
    case "reussie":
      return `${lecon.titre} : réussie, ${etoilesSurTrois(lecon.etat.etoiles.nombre)}`;
    case "prochaine":
      return `${lecon.titre} : à toi !`;
    case "aDecouvrir":
      return `${lecon.titre} : à découvrir`;
  }
}
