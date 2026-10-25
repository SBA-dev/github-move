import { NOM_DE_L_ECRAN_DES_MEDAILLES } from "@domain/motivation";
import type { Ecran } from "../navigation.ts";
import { TITRE_DU_DOCK } from "./textes-de-l-accueil.ts";

export type EcranDuDock = "jeu" | "parcours" | "toutes-les-lecons" | "medailles";

const ECRANS_DU_DOCK: readonly { readonly ecran: EcranDuDock; readonly libelle: string }[] = [
  { ecran: "jeu", libelle: "Accueil" },
  { ecran: "parcours", libelle: "Mon parcours" },
  { ecran: "toutes-les-lecons", libelle: "Toutes les leçons" },
  { ecran: "medailles", libelle: NOM_DE_L_ECRAN_DES_MEDAILLES },
];

export function estUnEcranDuDock(ecran: Ecran): ecran is EcranDuDock {
  return ECRANS_DU_DOCK.some((candidat) => candidat.ecran === ecran);
}

type Props = {
  readonly ecranEnCours: EcranDuDock;
  readonly onOuvrir: (ecran: EcranDuDock) => void;
};

/** Le dock de l'enfant : quatre écrans à un toucher, celui en cours est marqué. */
export function DockDeLEnfant({ ecranEnCours, onOuvrir }: Props) {
  return (
    <nav className="dock" aria-label={TITRE_DU_DOCK}>
      {ECRANS_DU_DOCK.map(({ ecran, libelle }) => (
        <button
          key={ecran}
          type="button"
          aria-current={ecran === ecranEnCours ? "page" : undefined}
          onClick={() => onOuvrir(ecran)}
        >
          {libelle}
        </button>
      ))}
    </nav>
  );
}
