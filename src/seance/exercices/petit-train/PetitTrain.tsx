import { type CSSProperties, type MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { TexteEnSyllabes } from "../../../reglages/index.ts";
import { useRetourDe } from "../../../retours/index.ts";
import { useMouvementsReduits } from "../../../transitions/mouvements-reduits.ts";
import { useUnivers } from "../../../univers/index.ts";
import type { Point } from "../maisons/groupe-sous-le-doigt.ts";
import { DESSINS_DU_PETIT_TRAIN } from "./dessins/index.ts";
import { useAccrocheDuWagon } from "./useAccrocheDuWagon.ts";

/** Le petit à-coup du train quand un wagon s'accroche : 400 ms au plus (#130.2). */
const DUREE_DU_CRAN_MS = 300;

type Props = {
  /** Le texte de chaque place, dans l'ordre du domaine. */
  readonly elements: readonly string[];
  readonly nombrePosees: number;
  /** Un vers par wagon, sur toute la largeur du petit train. */
  readonly versDeLaPoesie: boolean;
  /** Le centre de la dernière étiquette touchée, d'où elle rejoint son wagon. */
  readonly depart: MutableRefObject<Point | undefined>;
};

/** Les places d'un ordre : une tête de train décorée selon l'univers, puis un wagon par place remplie. Décor pour les yeux : un toucher dessus ne fait rien. */
export function PetitTrain({ elements, nombrePosees, versDeLaPoesie, depart }: Props) {
  const univers = useUnivers();
  const { tete, wagon } = DESSINS_DU_PETIT_TRAIN[univers];
  const [etat, setEtat] = useState<"au-repos" | "avance">("au-repos");
  const finDuCran = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const avancerDUnCran = useCallback(() => {
    clearTimeout(finDuCran.current);
    setEtat("avance");
    finDuCran.current = setTimeout(() => setEtat("au-repos"), DUREE_DU_CRAN_MS);
  }, []);
  useEffect(() => () => clearTimeout(finDuCran.current), []);

  return (
    <div
      className="petit-train"
      data-testid="petit-train"
      data-univers={univers}
      data-etat={etat}
      data-vers={versDeLaPoesie ? "true" : undefined}
      style={{ "--wagon": `url("${wagon}")` } as CSSProperties}
    >
      <img className="tete-du-train" data-testid="tete-du-train" data-univers={univers} src={tete} alt="" aria-hidden="true" width={150} height={110} draggable={false} />
      <ol className="places" aria-label="Ordre des étiquettes" data-testid="places">
        {elements.map((element, rang) => (
          <Place key={rang} element={element} remplie={rang < nombrePosees} univers={univers} depart={depart} onAccroche={avancerDUnCran} />
        ))}
      </ol>
    </div>
  );
}

type PropsDeLaPlace = {
  readonly element: string;
  readonly remplie: boolean;
  readonly univers: string;
  readonly depart: MutableRefObject<Point | undefined>;
  readonly onAccroche: () => void;
};

/** Une place libre reste un contour en pointillés ; remplie, c'est un wagon : l'étiquette posée rebondit (#97), rejoint son wagon, puis il s'accroche. */
function Place({ element, remplie, univers, depart, onAccroche }: PropsDeLaPlace) {
  const retour = useRetourDe<HTMLLIElement>(remplie ? element : "");
  const mouvementsReduits = useMouvementsReduits();
  const { etat, puce } = useAccrocheDuWagon({
    remplie,
    mouvementsReduits,
    enRebond: retour.attributs["data-retour"] === "rebond",
    depart,
    onAccroche,
  });
  return (
    <li
      ref={retour.ref}
      className="place"
      data-testid="place"
      data-univers={univers}
      data-remplie={remplie ? "true" : undefined}
      data-etat={remplie ? etat : undefined}
      {...retour.attributs}
    >
      {remplie
        ? (
          <span ref={puce} className="puce-du-wagon">
            <TexteEnSyllabes texte={element} />
          </span>
        )
        : <span className="visuellement-cache">place libre</span>}
    </li>
  );
}
