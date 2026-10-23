import { useEffect, useState } from "react";
import type { ProfilEnCours } from "@domain/famille";
import { saluer, type Univers } from "@domain/motivation";
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
  readonly onChangerDEnfant: () => void;
};

/** Là où arrive l'enfant qui vient de choisir son profil : son personnage guide le salue par son prénom. */
export function AccueilDeLEnfant({ profil, univers, voix, saluer: aSaluer, onChangerDEnfant }: Props) {
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
      <button type="button" className="secondaire" onClick={onChangerDEnfant}>Changer d'enfant</button>
    </section>
  );
}
