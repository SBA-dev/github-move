import type { Univers } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { PersonnageGuide } from "../univers/index.ts";
import type { Personnage } from "./useDeroulementDuTestDeDepart.ts";

type Props = {
  readonly personnage: Personnage;
  readonly univers: Univers;
  readonly onReecouter: () => void;
};

/** Le personnage guide, sa bulle et « Réécouter » : ce que l'enfant entend et lit pendant tout le test de départ. */
export function ParoleDuGuide({ personnage, univers, onReecouter }: Props) {
  const { parole, rangDuMotPrononce, humeur } = personnage;
  return (
    <>
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={humeur} />
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      <button type="button" className="reecouter" onClick={onReecouter}>Réécouter</button>
    </>
  );
}
