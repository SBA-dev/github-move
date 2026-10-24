import type { CalculEnCours } from "@domain/apprentissage";
import { ReponseAuCalcul } from "./ReponseAuCalcul.tsx";

type Props = {
  readonly calcul: CalculEnCours;
  readonly reussi: boolean;
  readonly onRelire: () => void;
  readonly onChoisir: (texte: string) => void;
  readonly onValider: (nombre: number) => void;
  readonly onJeNeSaisPas: () => void;
};

export function ExerciceDeCalcul({ calcul, reussi, onRelire, ...reponse }: Props) {
  return (
    <div className="calcul" data-testid="calcul" data-mode={calcul.mode.genre}>
      <button type="button" className="question carte-du-calcul" data-testid="carte-du-calcul" onClick={onRelire}>
        {calcul.carte}
      </button>
      <ReponseAuCalcul calcul={calcul} reussi={reussi} {...reponse} />
    </div>
  );
}
