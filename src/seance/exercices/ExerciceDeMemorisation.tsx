import { carteDeLaPoesie, type ExerciceJoue, PlanDeMemorisation, type QuestionJouee } from "@domain/apprentissage";
import type { ExerciceMemoriser } from "@domain/catalogue";
import { TexteEnSyllabes } from "../../reglages/index.ts";
import { TexteSurligne } from "../TexteSurligne.tsx";
import { Parchemin } from "../parchemin/Parchemin.tsx";
import { useDeroulementDuParchemin } from "../parchemin/useDeroulementDuParchemin.ts";
import { ExerciceAChoix } from "./ExerciceAChoix.tsx";
import { ExerciceAEtiquettes } from "./ExerciceAEtiquettes.tsx";
import type { TempsDeLaMemorisation, VersLu } from "./useMemorisation.ts";

type PropsDeLEntrainement = {
  readonly exerciceJoue: ExerciceJoue | undefined;
  readonly question: QuestionJouee | undefined;
  readonly choixVisibles: boolean;
  readonly reussie: boolean;
  readonly bulleEclatee: string | undefined;
  /** La félicitation du dernier vers est finie : le train complet laisse la place aux mots cachés sans attendre. */
  readonly felicitationFinie: boolean;
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
  /** Muet, voix bloquée ou absente : les vers sont lus par l'enfant seul. */
  readonly voixCoupee: boolean;
  readonly onJeSuisPret: () => void;
};

/** La poésie : sa carte, ses vers (le vers lu est mis en avant), puis les deux entraînements une fois l'enfant prêt. */
export function ExerciceDeMemorisation({ exercice, temps, versLu, voixCoupee, onJeSuisPret, ...entrainement }: Props) {
  return (
    <div className="poesie" data-testid="poesie" data-temps={temps}>
      <article className="carte-de-la-poesie" data-testid="carte-de-la-poesie">
        <h3>
          <TexteEnSyllabes texte={carteDeLaPoesie(exercice)} />
        </h3>
        {temps !== "entrainement" && <VersDeLaPoesie vers={exercice.vers} temps={temps} versLu={versLu} voixCoupee={voixCoupee} />}
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

function VersDeLaPoesie({ vers, temps, versLu, voixCoupee }: { readonly vers: readonly string[]; readonly temps: TempsDeLaMemorisation; readonly versLu: VersLu | undefined; readonly voixCoupee: boolean }) {
  const { deroule, devoilee } = useDeroulementDuParchemin({
    rangCommence: versLu?.rang,
    texteEnLecture: false,
    toutOuvrir: temps !== "ecoute" || voixCoupee,
  });
  return (
    <Parchemin deroule={deroule}>
      <ol className="vers" aria-label="Vers de la poésie">
        {vers.map((unVers, rang) => {
          const lu = versLu?.rang === rang;
          return (
            <li
              key={rang}
              className="un-vers"
              data-testid="vers"
              data-lu={lu ? "true" : undefined}
              data-devoilee={devoilee(rang) ? "oui" : "non"}
              aria-current={lu ? "true" : undefined}
            >
              {lu ? <TexteSurligne texte={unVers} rangDuMotPrononce={versLu.rangDuMot} /> : <TexteEnSyllabes texte={unVers} />}
            </li>
          );
        })}
      </ol>
    </Parchemin>
  );
}

function Entrainement({ exercice, exerciceJoue, ...reste }: PropsDeLEntrainement & { readonly exercice: ExerciceMemoriser }) {
  const plan = PlanDeMemorisation.de(exercice);
  const motsCaches = exerciceJoue?.entrainementDeMemorisation() === "motsCaches";
  /** Le dernier wagon reste à l'écran tant que la félicitation du dernier vers n'est pas finie (#130.5). */
  if (motsCaches && reste.felicitationFinie) {
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
        lectureDuTexte="avant"
        voixCoupee={false}
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
      etiquettesAPlacer={motsCaches ? [] : exerciceJoue?.etiquettesAPlacer() ?? []}
      etiquettesPosees={exerciceJoue?.etiquettesPosees() ?? []}
      etiquetteViseeParJeNeSaisPas={(choisie) => exerciceJoue?.etiquetteViseeParJeNeSaisPas(choisie)}
      bonnesReponsesMontrees={reste.bonnesReponsesMontrees}
      onPoser={reste.onPoser}
      onJeNeSaisPas={reste.onJeNeSaisPasDUneEtiquette}
      versDeLaPoesie
    />
  );
}
