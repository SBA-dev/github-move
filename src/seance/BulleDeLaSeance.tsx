import type { Humeur, Univers } from "@domain/motivation";
import { BulleDuPersonnageGuide } from "./BulleDuPersonnageGuide.tsx";
import { PersonnageGuideEtSaScene } from "./PersonnageGuideEtSaScene.tsx";
import { TexteSurligne } from "./TexteSurligne.tsx";
import type { ParoleADire } from "./usePersonnageQuiParle.ts";
import type { useSceneDeReponseFausse } from "./useSceneDeReponseFausse.ts";

type Props = {
  /** Faux pendant une question : la consigne (ou la question) prend alors toute la largeur. */
  readonly personnageGuideVisible: boolean;
  readonly univers: Univers;
  readonly humeur: Humeur;
  readonly reponseFausse: ReturnType<typeof useSceneDeReponseFausse>;
  readonly consigne: string | undefined;
  readonly parole: ParoleADire | undefined;
  readonly rangDuMotPrononce: number | undefined;
  readonly reecouterImpossible: boolean;
  readonly onReecouter: () => void;
};

/**
 * Ce que le personnage guide dit ou ce que la leçon demande. Pendant une question, la consigne seule, sans le personnage guide :
 * il se montre, avec sa parole écrite près de lui, seulement quand il réagit. Un seul « Réécouter » relit ce qui est là.
 */
export function BulleDeLaSeance(
  { personnageGuideVisible, univers, humeur, reponseFausse, consigne, parole, rangDuMotPrononce, reecouterImpossible, onReecouter }: Props,
) {
  const consigneSeule = !personnageGuideVisible && consigne !== undefined;
  const sansTexte = !personnageGuideVisible && consigne === undefined;
  const laConsigneEstLue = consigneSeule && parole?.nature === "consigne" && parole.texte === consigne;
  return (
    <div className="guide-et-parole" data-personnage-guide={personnageGuideVisible ? "visible" : "cache"}>
      {personnageGuideVisible && <PersonnageGuideEtSaScene univers={univers} humeur={humeur} reponseFausse={reponseFausse} />}
      <div className="bulle-de-la-seance" data-sans-texte={sansTexte ? "true" : undefined}>
        {consigneSeule && (
          <div className="consigne-de-l-exercice" aria-live="polite">
            <p className="consigne" data-testid="consigne">
              <TexteSurligne texte={consigne} rangDuMotPrononce={laConsigneEstLue ? rangDuMotPrononce : undefined} />
            </p>
          </div>
        )}
        <BulleDuPersonnageGuide
          texte={laConsigneEstLue ? undefined : parole?.texte}
          nature={parole?.nature}
          rangDuMotPrononce={rangDuMotPrononce}
          cachee={!personnageGuideVisible}
        />
        <button type="button" className="reecouter" aria-label="Réécouter" aria-disabled={reecouterImpossible ? true : undefined} onClick={onReecouter}>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12a8 8 0 1 1-2.5-5.8" />
            <path d="M20 3v5h-5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
