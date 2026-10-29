import { useEffect, useRef, useState } from "react";
import { leconDuJour, tuilesDeMatiere, tuilesDuJour } from "@domain/apprentissage";
import type { CodeDeMatiere } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import {
  paroleDeLaQueteALAccueil,
  type QueteDuJour,
  reponseAuRefusDeLaQuete,
  saluer,
  saluerAvecLaSerie,
  type Serie,
  type Univers,
} from "@domain/motivation";
import { dateDuJourPourLesMachines, dateEnToutesLettres } from "../accueil/date-du-jour.ts";
import { PastilleDeSerie } from "../accueil/PastilleDeSerie.tsx";
import { QueteDuJourDeLAccueil } from "../accueil/QueteDuJourDeLAccueil.tsx";
import { useQueteDuJour } from "../accueil/useQueteDuJour.ts";
import { useSerie } from "../accueil/useSerie.ts";
import { ObjectifDuJourDeLAccueil } from "../accueil/ObjectifDuJourDeLAccueil.tsx";
import { useObjectifDuJour } from "../accueil/useObjectifDuJour.ts";
import { LeconDuJourDeLAccueil } from "../accueil/LeconDuJourDeLAccueil.tsx";
import { TuilesDeMatiereDeLAccueil } from "../accueil/TuilesDeMatiereDeLAccueil.tsx";
import { TuilesDuJourDeLAccueil } from "../accueil/TuilesDuJourDeLAccueil.tsx";
import { useEntreesDuJour } from "../accueil/useEntreesDuJour.ts";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { DELAI_MAXIMAL_DE_LECTURE_EN_MS } from "../reseau/delai-maximal-de-lecture.ts";
import { horlogeDuNavigateur } from "../seance/horloge.ts";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { QuestionsDuesALAccueil } from "../revision/index.ts";
import type { Voix } from "../voix/index.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly univers: Univers;
  readonly voix: Voix;
  /** Faux quand l'enfant revient par l'historique : le personnage guide ne le salue pas une seconde fois. */
  readonly saluer: boolean;
  /** Vrai tant que le test de départ n'est pas fait et qu'il a des questions à poser. */
  readonly testDeDepartAProposer: boolean;
  readonly onMonTestDeDepart: () => void;
  /** Les questions dues de la file de révision ; sans nombre tant que la file n'est pas connue. */
  readonly questionsDues: QuestionsDuesALAccueil;
  /** Vrai quand l'enfant a choisi « Autre chose » à la quête du jour pendant cette utilisation. */
  readonly queteRefusee: boolean;
  readonly onRefuserLaQuete: () => void;
  readonly onJeRevise: () => void;
  readonly onCommencerLaLecon: (leconId: string) => void;
  readonly onOuvrirLaMatiere: (matiere: CodeDeMatiere) => void;
  readonly onChangerDEnfant: () => void;
};

/**
 * Ce que dit le personnage guide en arrivant. Avec « tout lire à voix haute », une seule lecture : la salutation, la pastille de série
 * puis la quête du jour, qu'il faut donc attendre (`undefined` tant que la série ou la quête n'est pas lue) ;
 * sans série connue (`null`) ni quête (`null`, ou rien à proposer), elles ne sont pas dites.
 */
function phraseDeLaSalutation(
  prenom: string,
  toutLire: boolean,
  serie: Serie | null | undefined,
  quete: QueteDuJour | null | undefined,
  queteRefusee: boolean,
): string | undefined {
  if (!toutLire) return saluer(prenom);
  if (serie === undefined || quete === undefined) return undefined;
  const salutation = serie === null ? saluer(prenom) : saluerAvecLaSerie(prenom, serie);
  const proposition = quete && paroleDeLaQueteALAccueil(quete, queteRefusee);
  return proposition ? `${salutation} ${proposition}` : salutation;
}

/** Là où arrive l'enfant qui vient de choisir son profil : la date, son personnage guide qui le salue, puis ce qu'il peut faire aujourd'hui. */
export function AccueilDeLEnfant(
  { profil, univers, voix, saluer: aSaluer, testDeDepartAProposer, questionsDues, queteRefusee, onRefuserLaQuete, onMonTestDeDepart, onJeRevise, onCommencerLaLecon, onOuvrirLaMatiere, onChangerDEnfant }: Props,
) {
  const { parole, rangDuMotPrononce, humeur, dire, montrer, faireSilence } = usePersonnageQuiParle(voix);
  const [salutationALire] = useState(aSaluer);
  const [maintenant, setMaintenant] = useState(() => horlogeDuNavigateur.maintenant());
  useEffect(() => {
    const auRetourDeLApplication = () => {
      if (document.visibilityState === "visible") setMaintenant(horlogeDuNavigateur.maintenant());
    };
    document.addEventListener("visibilitychange", auRetourDeLApplication);
    return () => document.removeEventListener("visibilitychange", auRetourDeLApplication);
  }, []);
  const entrees = useEntreesDuJour(profil);
  const objectif = useObjectifDuJour(profil.id, maintenant);
  const serie = useSerie(profil.id, maintenant);
  const [serieDeLaSalutation, setSerieDeLaSalutation] = useState(serie);
  if (serieDeLaSalutation === undefined && serie !== undefined) setSerieDeLaSalutation(serie);
  const quete = useQueteDuJour(profil.id, maintenant, entrees, questionsDues.nombre, questionsDues.lue);
  const [queteDeLaSalutation, setQueteDeLaSalutation] = useState(quete);
  if (queteDeLaSalutation === undefined && quete !== undefined) setQueteDeLaSalutation(quete);
  useEffect(() => {
    const abandon = setTimeout(() => setQueteDeLaSalutation((attendue) => attendue ?? null), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
    return () => clearTimeout(abandon);
  }, []);
  const [queteRefuseeALArrivee] = useState(queteRefusee);
  const phraseALire = phraseDeLaSalutation(profil.prenom, profil.reglages.toutLireAVoixHaute, serieDeLaSalutation, queteDeLaSalutation, queteRefuseeALArrivee);
  useEffect(() => {
    if (salutationALire) {
      const salutation = { texte: saluer(profil.prenom), nature: "accueil" } as const;
      if (phraseALire === undefined) montrer(salutation);
      else void dire({ ...salutation, aLire: phraseALire });
    }
    return faireSilence;
  }, [salutationALire, profil.prenom, phraseALire, dire, montrer, faireSilence]);

  const paroleDeLaQuete = quete ? paroleDeLaQueteALAccueil(quete, queteRefusee) : undefined;
  const guideEtParole = useRef<HTMLDivElement>(null);
  const accepterLaQuete = () => {
    if (quete?.genre === "revision") onJeRevise();
    else if (quete?.genre === "lecon") onCommencerLaLecon(quete.lecon);
  };
  const refuserLaQuete = () => {
    onRefuserLaQuete();
    void dire({ texte: reponseAuRefusDeLaQuete(), nature: "accueil" });
    guideEtParole.current?.focus();
  };

  return (
    <section className="accueil-de-l-enfant" aria-label={`Accueil de ${profil.prenom}`}>
      <p className="date-du-jour">
        <time dateTime={dateDuJourPourLesMachines(maintenant)}>{dateEnToutesLettres(maintenant)}</time>
      </p>
      <div className="guide-et-parole" ref={guideEtParole} tabIndex={-1}>
        <PersonnageGuide univers={univers} humeur={humeur} />
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      {quete && paroleDeLaQuete && (
        <QueteDuJourDeLAccueil parole={paroleDeLaQuete} accomplie={quete.genre === "accomplie"} onAccepter={accepterLaQuete} onAutreChose={refuserLaQuete} />
      )}
      {serie && <PastilleDeSerie serie={serie} />}
      <TuilesDuJourDeLAccueil
        tuiles={tuilesDuJour({ nombreDeQuestionsDues: questionsDues.nombre ?? 0, testDeDepartAProposer })}
        onMonTestDeDepart={onMonTestDeDepart}
        onJeRevise={onJeRevise}
      />
      {entrees && <LeconDuJourDeLAccueil lecon={leconDuJour(entrees)} personnageGuide={univers.personnageGuide.nom} onCommencer={onCommencerLaLecon} />}
      {objectif && <ObjectifDuJourDeLAccueil objectif={objectif} />}
      {entrees && (
        <>
          {entrees.parcours && <TuilesDeMatiereDeLAccueil tuiles={tuilesDeMatiere(entrees.parcours)} onOuvrir={onOuvrirLaMatiere} />}
        </>
      )}
      <button type="button" className="secondaire" onClick={onChangerDEnfant}>Changer d'enfant</button>
    </section>
  );
}
