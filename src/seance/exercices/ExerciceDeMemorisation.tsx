import { carteDeLaPoesie, type ExerciceJoue, PlanDeMemorisation, type QuestionJouee } from "@domain/apprentissage";
import type { ExerciceMemoriser } from "@domain/catalogue";
import { TexteEnSyllabes } from "../../reglages/index.ts";
import { TexteSurligne } from "../TexteSurligne.tsx";
import { ExerciceAChoix } from "./ExerciceAChoix.tsx";
import { ExerciceAEtiquettes } from "./ExerciceAEtiquettes.tsx";
import type { TempsDeLaMemorisation, VersLu } from "./useMemorisation.ts";

type PropsDeLEntrainement = {
  readonly exerciceJoue: ExerciceJoue | undefined;
  readonly question: QuestionJouee | undefined;
  readonly choixVisibles: boolean;
  readonly reussie: boolean;
  readonly bulleEclatee: string | undefined;
  readonly bonnesReponsesMontrees: Readonly<Record<string, string>>;
  readonly onPoser: (etiquette: string) => void;
  readonly onChoisir: (texte: string) => void;
  readonly onRelireLaQuestion: () => void;
  readonly onJeNeSaisPasDUneEtiquette: (etiquette?: string) => void;
  readonly onJeNeSaisPas: () => void;
};

type Props = PropsDeLEntrainement & {
  readonly exercice: ExerciceMemoriser;
  readonly temps: TempsDeLaMemorisation;
  readonly versLu: VersLu | undefined;
  readonly onJeSuisPret: () => void;
};

/** La poésie : sa carte, ses vers (le vers lu est mis en avant), puis les deux entraînements une fois l'enfant prêt. */
export function ExerciceDeMemorisation({ exercice, temps, versLu, onJeSuisPret, ...entrainement }: Props) {
  return (
    <div className="poesie" data-testid="poesie" data-temps={temps}>
      <article className="carte-de-la-poesie" data-testid="carte-de-la-poesie">
        <h3>
          <TexteEnSyllabes texte={carteDeLaPoesie(exercice)} />
        </h3>
        {temps !== "entrainement" && (
          <ol className="vers" aria-label="Vers de la poésie">
            {exercice.vers.map((unVers, rang) => {
              const lu = versLu?.rang === rang;
              return (
                <li key={rang} className="un-vers" data-testid="vers" data-lu={lu ? "true" : undefined} aria-current={lu ? "true" : undefined}>
                  {lu ? <TexteSurligne texte={unVers} rangDuMotPrononce={versLu.rangDuMot} /> : <TexteEnSyllabes texte={unVers} />}
                </li>
              );
            })}
          </ol>
        )}
      </article>
      {temps === "redire" && (
        <button type="button" className="action-principale" data-testid="je-suis-pret" onClick={onJeSuisPret}>
          Je suis prêt
        </button>
      )}
      {temps === "entrainement" && <Entrainement exercice={exercice} {...entrainement} />}
    </div>
  );
}

function Entrainement({ exercice, exerciceJoue, ...reste }: PropsDeLEntrainement & { readonly exercice: ExerciceMemoriser }) {
  const plan = PlanDeMemorisation.de(exercice);
  if (exerciceJoue?.entrainementDeMemorisation() === "motsCaches") {
    return (
      <ExerciceAChoix
        exercice={plan.motsCaches}
        question={reste.question}
        texteATrous={exerciceJoue.texteATrous()}
        phraseDuTrouEnCours={exerciceJoue.questionEnCours()?.enonce}
        tableauDeConjugaison={[]}
        choixVisibles={reste.choixVisibles}
        reussie={reste.reussie}
        bulleEclatee={reste.bulleEclatee}
        texteEcoute={false}
        rangDuMotDuTexte={undefined}
        sonImpossible={false}
        sonCoupe={false}
        onChoisir={reste.onChoisir}
        onRelireLaQuestion={reste.onRelireLaQuestion}
        onJeNeSaisPas={reste.onJeNeSaisPas}
        onEcouterLeMot={() => undefined}
        onJAiEcoute={() => undefined}
        onActiverLeSon={() => undefined}
      />
    );
  }
  return (
    <ExerciceAEtiquettes
      exercice={plan.ordreDesVers}
      etiquettesAPlacer={exerciceJoue?.etiquettesAPlacer() ?? []}
      etiquettesPosees={exerciceJoue?.etiquettesPosees() ?? []}
      etiquetteViseeParJeNeSaisPas={(choisie) => exerciceJoue?.etiquetteViseeParJeNeSaisPas(choisie)}
      bonnesReponsesMontrees={reste.bonnesReponsesMontrees}
      onPoser={reste.onPoser}
      onJeNeSaisPas={reste.onJeNeSaisPasDUneEtiquette}
    />
  );
}
