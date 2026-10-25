import { useCallback, useState } from "react";
import type { CodeDeMatiere } from "@domain/catalogue";

/** Ce que l'enfant a choisi dans « Toutes les leçons », gardé en mémoire pendant l'utilisation en cours. */
export type ChoixDeToutesLesLecons = {
  readonly matiere: CodeDeMatiere | undefined;
  readonly niveau: string | undefined;
  readonly sectionDesClassesDAvantDeployee: boolean;
};

const AUCUN_CHOIX: ChoixDeToutesLesLecons = { matiere: undefined, niveau: undefined, sectionDesClassesDAvantDeployee: false };

export function useChoixDeToutesLesLecons() {
  const [choix, setChoix] = useState(AUCUN_CHOIX);
  const choisirLaMatiere = useCallback((matiere: CodeDeMatiere | undefined) => setChoix((actuel) => ({ ...actuel, matiere })), []);
  const choisirLeNiveau = useCallback((niveau: string | undefined) => setChoix((actuel) => ({ ...actuel, niveau })), []);
  const basculerLaSection = useCallback(
    () => setChoix((actuel) => ({ ...actuel, sectionDesClassesDAvantDeployee: !actuel.sectionDesClassesDAvantDeployee })),
    [],
  );
  const oublier = useCallback(() => setChoix(AUCUN_CHOIX), []);
  return { choix, choisirLaMatiere, choisirLeNiveau, basculerLaSection, oublier };
}

export type ChoixEnCours = ReturnType<typeof useChoixDeToutesLesLecons>;
