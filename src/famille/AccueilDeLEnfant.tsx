import { useEffect, useState } from "react";
import { leconDuJour, tuilesDeMatiere, tuilesDuJour } from "@domain/apprentissage";
import type { CodeDeMatiere } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import { saluer, type Univers } from "@domain/motivation";
import { dateDuJourPourLesMachines, dateEnToutesLettres } from "../accueil/date-du-jour.ts";
import { ObjectifDuJourDeLAccueil } from "../accueil/ObjectifDuJourDeLAccueil.tsx";
import { useObjectifDuJour } from "../accueil/useObjectifDuJour.ts";
import { LeconDuJourDeLAccueil } from "../accueil/LeconDuJourDeLAccueil.tsx";
import { TuilesDeMatiereDeLAccueil } from "../accueil/TuilesDeMatiereDeLAccueil.tsx";
import { TuilesDuJourDeLAccueil } from "../accueil/TuilesDuJourDeLAccueil.tsx";
import { useEntreesDuJour } from "../accueil/useEntreesDuJour.ts";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { horlogeDuNavigateur } from "../seance/horloge.ts";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
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
  /** Le nombre de questions dues de la file de révision ; zéro tant que la file n'est pas connue. */
  readonly questionsDuesALaRevision: number;
  readonly onJeRevise: () => void;
  readonly onCommencerLaLecon: (leconId: string) => void;
  readonly onOuvrirLaMatiere: (matiere: CodeDeMatiere) => void;
  readonly onChangerDEnfant: () => void;
};

/** Là où arrive l'enfant qui vient de choisir son profil : la date, son personnage guide qui le salue, puis ce qu'il peut faire aujourd'hui. */
export function AccueilDeLEnfant(
  { profil, univers, voix, saluer: aSaluer, testDeDepartAProposer, questionsDuesALaRevision, onMonTestDeDepart, onJeRevise, onCommencerLaLecon, onOuvrirLaMatiere, onChangerDEnfant }: Props,
) {
  const { parole, rangDuMotPrononce, humeur, dire, faireSilence } = usePersonnageQuiParle(voix);
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
  useEffect(() => {
    if (salutationALire) void dire({ texte: saluer(profil.prenom), nature: "accueil" });
    return faireSilence;
  }, [salutationALire, profil.prenom, dire, faireSilence]);

  return (
    <section className="accueil-de-l-enfant" aria-label={`Accueil de ${profil.prenom}`}>
      <p className="date-du-jour">
        <time dateTime={dateDuJourPourLesMachines(maintenant)}>{dateEnToutesLettres(maintenant)}</time>
      </p>
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={humeur} />
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      <TuilesDuJourDeLAccueil
        tuiles={tuilesDuJour({ nombreDeQuestionsDues: questionsDuesALaRevision, testDeDepartAProposer })}
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
