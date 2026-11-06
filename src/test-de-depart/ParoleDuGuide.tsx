import type { Univers } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { PersonnageGuideEtSaScene } from "../seance/PersonnageGuideEtSaScene.tsx";
import { useSceneDeReponseFausse } from "../seance/useSceneDeReponseFausse.ts";
import type { Personnage } from "./useDeroulementDuTestDeDepart.ts";

type Props = {
  readonly personnage: Personnage;
  readonly univers: Univers;
  readonly onReecouter: () => void;
  readonly sansPersonnageGuide?: boolean;
  /** Au test de départ, une réponse fausse garde l'encouragement, sans scène (163.6). */
  readonly dansLeTestDeDepart?: boolean;
};

/** Le personnage guide, sa bulle et « Réécouter » : ce que l'enfant entend et lit pendant tout le test de départ, une révision ou un défi. */
export function ParoleDuGuide({ personnage, univers, onReecouter, sansPersonnageGuide = false, dansLeTestDeDepart = false }: Props) {
  const { parole, rangDuMotPrononce, humeur } = personnage;
  const reponseFausse = useSceneDeReponseFausse({ parole, cleUnivers: univers.cle, dansLeTestDeDepart });
  return (
    <>
      <div className="guide-et-parole">
        {!sansPersonnageGuide && <PersonnageGuideEtSaScene univers={univers} humeur={humeur} reponseFausse={reponseFausse} />}
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      <button type="button" className="reecouter" onClick={onReecouter}>Réécouter</button>
    </>
  );
}
