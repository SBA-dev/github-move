import type { CalculEnCours } from "@domain/apprentissage";
import { ChoixDeLaQuestion } from "./ChoixDeLaQuestion.tsx";
import { ClavierDeCristaux } from "./ClavierDeCristaux.tsx";

type Props = {
  readonly calcul: CalculEnCours;
  /** Le calcul est réussi : on le félicite avant de passer au suivant. */
  readonly reussi: boolean;
  readonly onChoisir: (texte: string) => void;
  readonly onValider: (nombre: number) => void;
  readonly onJeNeSaisPas: () => void;
};

/** De quoi répondre à un calcul : des choix au CP, le clavier de cristaux ensuite, et « Je ne sais pas ». */
export function ReponseAuCalcul({ calcul, reussi, onChoisir, onValider, onJeNeSaisPas }: Props) {
  const { mode } = calcul;
  const possibles = mode.genre === "choix" ? mode.choix.filter((texte) => !mode.ecartes.includes(texte)) : [];
  return (
    <>
      {mode.genre === "choix"
        ? (
          <ChoixDeLaQuestion
            textes={mode.choix}
            ecartes={mode.ecartes}
            possibles={possibles}
            reponseQuiBrille={calcul.jeNeSaisPasPropose ? undefined : possibles[0]}
            reussie={reussi}
            bulleEclatee={undefined}
            onChoisir={onChoisir}
          />
        )
        : (
          <ClavierDeCristaux
            onValider={onValider}
            chiffresQuiBrillent={reussi ? [] : [...(calcul.reponseATaper ?? "")]}
            desactive={reussi}
          />
        )}
      {calcul.jeNeSaisPasPropose && !reussi && (
        <button type="button" className="je-ne-sais-pas" data-testid="je-ne-sais-pas" onClick={onJeNeSaisPas}>
          Je ne sais pas
        </button>
      )}
    </>
  );
}
