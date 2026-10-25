import { useEffect, useState } from "react";
import type { ProfilEnCours } from "@domain/famille";
import { annonceDeLaSeanceDeRevision, NOM_DE_L_ECRAN_DES_MEDAILLES, saluer, type Univers } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly univers: Univers;
  readonly voix: Voix;
  /** Faux quand l'enfant revient par l'historique : le personnage guide ne le salue pas une seconde fois. */
  readonly saluer: boolean;
  readonly onMonParcours: () => void;
  /** Absent tant que le test de départ n'a rien à proposer (déjà fait, ou bibliothèque indisponible). */
  readonly onMonTestDeDepart?: () => void;
  readonly onMesMedailles: () => void;
  /** Le nombre de questions dues de la file de révision ; le bouton « Je révise mes erreurs » n'est proposé qu'à partir d'une (zéro sans file connue). */
  readonly questionsDuesALaRevision?: number;
  readonly onJeRevise?: () => void;
  readonly onChangerDEnfant: () => void;
};

/** Là où arrive l'enfant qui vient de choisir son profil : son personnage guide le salue par son prénom. */
export function AccueilDeLEnfant({ profil, univers, voix, saluer: aSaluer, onMonParcours, onMonTestDeDepart, onMesMedailles, questionsDuesALaRevision = 0, onJeRevise, onChangerDEnfant }: Props) {
  const { parole, rangDuMotPrononce, humeur, dire, faireSilence } = usePersonnageQuiParle(voix);
  const [salutationALire] = useState(aSaluer);
  useEffect(() => {
    if (salutationALire) void dire({ texte: saluer(profil.prenom), nature: "accueil" });
    return faireSilence;
  }, [salutationALire, profil.prenom, dire, faireSilence]);

  return (
    <section className="accueil-de-l-enfant" aria-label={`Accueil de ${profil.prenom}`}>
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={humeur} />
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      <button type="button" onClick={onMonParcours}>Mon parcours</button>
      <button type="button" onClick={onMesMedailles}>{NOM_DE_L_ECRAN_DES_MEDAILLES}</button>
      {onMonTestDeDepart && <button type="button" onClick={onMonTestDeDepart}>Mon test de départ</button>}
      {onJeRevise && questionsDuesALaRevision > 0 && (
        <div className="proposition-de-revision">
          <button type="button" aria-describedby="annonce-de-la-revision" onClick={onJeRevise}>Je révise mes erreurs</button>
          <p id="annonce-de-la-revision" data-testid="annonce-de-la-revision">
            {annonceDeLaSeanceDeRevision(questionsDuesALaRevision)}
          </p>
        </div>
      )}
      <button type="button" className="secondaire" onClick={onChangerDEnfant}>Changer d'enfant</button>
    </section>
  );
}
