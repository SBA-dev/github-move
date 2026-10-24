import type { CorrectionDuMot, QuestionDeDictee } from "@domain/apprentissage";
import { LIBELLE_DU_BOUTON_ACTIVER_LE_SON } from "@domain/apprentissage";
import { TexteEnSyllabes } from "../../reglages/index.ts";
import { CasesDeLaDictee } from "./CasesDeLaDictee.tsx";
import { ClavierDeLaDictee } from "./ClavierDeLaDictee.tsx";
import { useClavierPhysique } from "./useClavierPhysique.ts";

type Props = {
  readonly question: QuestionDeDictee | undefined;
  readonly lettresFausses: CorrectionDuMot | undefined;
  readonly toucheQuiBrille: string | undefined;
  /** Le mot est bien écrit : on le félicite avant de passer au suivant. */
  readonly reussie: boolean;
  /** Ce que la dictée dit à l'enfant quand la voix manque (son coupé, navigateur sans voix). */
  readonly messageSansVoix: string | undefined;
  readonly sonCoupe: boolean;
  readonly onRelire: () => void;
  readonly onReecouterLeMot: () => void;
  readonly onEcouterPlusLentement: () => void;
  readonly onTaper: (lettre: string) => void;
  readonly onEffacer: () => void;
  readonly onJeNeSaisPas: () => void;
  readonly onActiverLeSon: () => void;
};

export function ExerciceDeDictee(props: Props) {
  const { question, lettresFausses, reussie, messageSansVoix, sonCoupe } = props;
  useClavierPhysique(question !== undefined && !reussie, props.onTaper, props.onEffacer);
  if (!question) return null;
  return (
    <div className="dictee" data-testid="dictee">
      <button type="button" className="question" data-testid="question" onClick={props.onRelire}>
        <TexteEnSyllabes texte={question.texteAffiche()} />
      </button>
      {messageSansVoix !== undefined && (
        <div className="ecoute" data-testid="dictee-sans-son">
          <p className="ecoute-sans-son" role="status">{messageSansVoix}</p>
          {sonCoupe && (
            <button type="button" data-testid="activer-le-son" onClick={props.onActiverLeSon}>
              {LIBELLE_DU_BOUTON_ACTIVER_LE_SON}
            </button>
          )}
        </div>
      )}
      <CasesDeLaDictee question={question} lettresFausses={lettresFausses} />
      <button type="button" className="secondaire" data-testid="reecouter-le-mot" onClick={props.onReecouterLeMot}>
        Réécouter le mot
      </button>
      <button type="button" className="secondaire" data-testid="ecouter-plus-lentement" onClick={props.onEcouterPlusLentement}>
        Écouter plus lentement
      </button>
      <ClavierDeLaDictee question={question} toucheQuiBrille={props.toucheQuiBrille} onTaper={props.onTaper} onEffacer={props.onEffacer} />
      {!question.bonneReponseMontree && !reussie && (
        <button type="button" className="je-ne-sais-pas" data-testid="je-ne-sais-pas" onClick={props.onJeNeSaisPas}>
          Je ne sais pas
        </button>
      )}
    </div>
  );
}
