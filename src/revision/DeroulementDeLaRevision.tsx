import { useEffect } from "react";
import {
  Avancement,
  exerciceDemandeLeSon,
  messageDeLaDicteeSansVoix,
  QuestionDeBoite,
  QuestionDeCalcul,
  QuestionDeProblemeEnBarres,
  QuestionJouee,
  type SeanceDeRevision,
} from "@domain/apprentissage";
import type { ItemDeBoite } from "@domain/catalogue";
import type { Univers } from "@domain/motivation";
import { BoiteAJetons } from "../seance/exercices/boite/BoiteAJetons.tsx";
import { ExerciceDeCalcul } from "../seance/exercices/ExerciceDeCalcul.tsx";
import { ExerciceDeDictee } from "../seance/exercices/ExerciceDeDictee.tsx";
import { QuestionAChoix } from "../seance/exercices/QuestionAChoix.tsx";
import { SchemaDuProbleme } from "../seance/exercices/schema/SchemaDuProbleme.tsx";
import { etatDeLaVoix } from "../seance/etat-de-la-voix.ts";
import { RecipientDeProgression } from "../seance/RecipientDeProgression.tsx";
import { ParoleDuGuide } from "../test-de-depart/ParoleDuGuide.tsx";
import type { Voix } from "../voix/index.ts";
import { TexteDeLecture as AffichageDuTexte } from "../seance/exercices/TexteDeLecture.tsx";
import type { TexteDeLecture } from "./commencer-la-revision.ts";
import { type Personnage, useDeroulementDeRevision } from "./useDeroulementDeRevision.ts";

type Props = {
  readonly seance: SeanceDeRevision;
  readonly boites: ReadonlyMap<string, ItemDeBoite>;
  readonly textes: ReadonlyMap<string, TexteDeLecture>;
  readonly nombreDeQuestions: number;
  readonly personnage: Personnage;
  readonly univers: Univers;
  readonly voix: Voix;
  /** Réglage du profil en cours : les choix proposés sont lus après la question. */
  readonly toutLireAVoixHaute: boolean;
  readonly onFini: () => void;
};

/** La séance de révision en cours : une question à la fois, sans étape de leçon, avec l'avancement de la séance. */
export function DeroulementDeLaRevision(
  { seance, boites, textes, nombreDeQuestions, personnage, univers, voix, toutLireAVoixHaute, onFini }: Props,
) {
  const deroulement = useDeroulementDeRevision({
    seance,
    nombreDeQuestions,
    textes,
    personnage,
    lire: voix.lire,
    personnageGuide: univers.personnageGuide,
    toutLireAVoixHaute,
    onFini,
  });
  const { commencer, abandonner } = deroulement;
  useEffect(() => {
    void commencer();
    return abandonner;
  }, [commencer, abandonner]);

  const courante = deroulement.figee ?? seance.questionEnCours();
  const reussie = deroulement.figee !== undefined;
  const question = courante?.question;
  const dictee = courante?.dictee;
  const repondreParUnChoix = (texte: string) => void deroulement.repondreParUnChoix(texte);
  const repondreParUnNombre = (nombre: number) => void deroulement.repondreParUnNombre(nombre);
  const jeNeSaisPas = () => void deroulement.jeNeSaisPas();
  const texteDeLaQuestion = courante && textes.get(courante.identite.valeur);
  const lectureEnAttente = texteDeLaQuestion !== undefined && deroulement.texteEcoutePour !== courante?.identite.valeur;
  return (
    <>
      <RecipientDeProgression
        avancement={new Avancement(deroulement.questionsReussies, nombreDeQuestions)}
        libelle="Avancement de la révision"
      />
      <ParoleDuGuide personnage={personnage} univers={univers} onReecouter={deroulement.reecouter} />
      <div className="annonce-d-avancement" role="status" data-testid="annonce-d-avancement">
        {deroulement.avancementAnnonce}
      </div>
      {courante && (
        <div className="exercice-en-cours" data-testid="exercice-en-cours">
          {question instanceof QuestionDeCalcul && (
            <ExerciceDeCalcul
              calcul={question.enCours()}
              reussi={reussie}
              onRelire={deroulement.relireLaQuestion}
              onChoisir={repondreParUnChoix}
              onValider={repondreParUnNombre}
              onJeNeSaisPas={jeNeSaisPas}
            />
          )}
          {question instanceof QuestionDeBoite && (
            <BoiteAJetons
              boite={question.enCours()}
              item={boites.get(courante.identite.valeur)}
              phrasesDites={deroulement.phrasesDites}
              ouverte={deroulement.boiteOuverte}
              onChoisir={repondreParUnChoix}
              onValider={repondreParUnNombre}
              onJeNeSaisPas={jeNeSaisPas}
            />
          )}
          {question instanceof QuestionDeProblemeEnBarres && (
            <SchemaDuProbleme
              schema={question.enCours()}
              resolu={deroulement.schemaResolu}
              phrasesDites={deroulement.phrasesDites}
              reussi={reussie}
              onChoisir={repondreParUnChoix}
              onValider={repondreParUnNombre}
              onJeNeSaisPas={jeNeSaisPas}
            />
          )}
          {question instanceof QuestionJouee && texteDeLaQuestion && (
            <AffichageDuTexte
              titre={texteDeLaQuestion.titre}
              texte={texteDeLaQuestion.texte}
              rangDuMotPrononce={deroulement.rangDuMotDuTexte}
            />
          )}
          {question instanceof QuestionJouee && lectureEnAttente && (
            <button type="button" className="action-principale" data-testid="j-ai-ecoute" onClick={() => void deroulement.jAiEcoute()}>
              J'ai écouté
            </button>
          )}
          {question instanceof QuestionJouee && (
            <QuestionAChoix
              question={question}
              avecEcoute={question.motAEcouter !== undefined}
              questionMasquee={lectureEnAttente}
              choixVisibles={deroulement.choixVisiblesPour === question}
              reussie={reussie}
              bulleEclatee={deroulement.bulleEclatee}
              sonImpossible={voix.son === "muet" || !voix.syntheseVocalePresente}
              sonCoupe={voix.son === "muet"}
              onChoisir={repondreParUnChoix}
              onRelireLaQuestion={() => void deroulement.relireLaQuestion()}
              onJeNeSaisPas={jeNeSaisPas}
              onEcouterLeMot={() => void deroulement.ecouterLeMot()}
              onActiverLeSon={voix.basculerLeSon}
            />
          )}
          {dictee && (
            <ExerciceDeDictee
              question={dictee}
              lettresFausses={deroulement.lettresFausses}
              toucheQuiBrille={deroulement.toucheQuiBrille}
              reussie={reussie}
              messageSansVoix={exerciceDemandeLeSon("dictee") ? messageDeLaDicteeSansVoix(etatDeLaVoix(voix)) : undefined}
              sonCoupe={voix.son === "muet"}
              onRelire={deroulement.relireLaQuestion}
              onReecouterLeMot={() => void deroulement.reecouterLeMot()}
              onEcouterPlusLentement={() => void deroulement.reecouterLeMotPlusLentement()}
              onTaper={(lettre) => void deroulement.taper(lettre)}
              onEffacer={deroulement.effacer}
              onJeNeSaisPas={jeNeSaisPas}
              onActiverLeSon={voix.basculerLeSon}
            />
          )}
        </div>
      )}
    </>
  );
}
