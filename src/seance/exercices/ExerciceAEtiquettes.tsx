import { useEffect, useRef, useState } from "react";
import type { EtiquettePosee } from "@domain/apprentissage";
import type { Exercice } from "@domain/catalogue";
import { Etiquette } from "./etiquettes/Etiquette.tsx";
import { groupeSousLePoint, type Point } from "./maisons/groupe-sous-le-doigt.ts";
import { Maisons } from "./maisons/Maisons.tsx";
import { PetitTrain } from "./petit-train/PetitTrain.tsx";
import { DansLaBarreDAction } from "../BarreDActionDeLaSeance.tsx";

type Props = {
  readonly exercice: Extract<Exercice, { type: "classer" | "ordre" }>;
  /** Les étiquettes qui attendent encore d'être posées. */
  readonly etiquettesAPlacer: readonly string[];
  /** Les étiquettes déjà posées, dans l'ordre de pose. */
  readonly etiquettesPosees: readonly EtiquettePosee[];
  /** L'étiquette dont « Je ne sais pas » montrera la bonne réponse. */
  readonly etiquetteViseeParJeNeSaisPas: (choisie?: string) => string | undefined;
  /** Ce que « Je ne sais pas » a montré : la maison (classer) de chaque étiquette aidée, ou l'étiquette qui vient ensuite (ordre, clé vide). */
  readonly bonnesReponsesMontrees: Readonly<Record<string, string>>;
  readonly onPoser: (etiquette: string, groupe?: string) => void;
  readonly onJeNeSaisPas: (etiquette?: string) => void;
  /** Les places de l'ordre sont les vers d'une poésie : un vers par wagon, sur toute la largeur. */
  readonly versDeLaPoesie?: boolean;
};

export function ExerciceAEtiquettes({ exercice, etiquettesAPlacer, etiquettesPosees, etiquetteViseeParJeNeSaisPas, bonnesReponsesMontrees, onPoser, onJeNeSaisPas, versDeLaPoesie = false }: Props) {
  const [choisie, setChoisie] = useState<string | undefined>();
  const [maisonSurvolee, setMaisonSurvolee] = useState<string | undefined>();
  const premiere = useRef<HTMLButtonElement>(null);
  const conteneurDesMaisons = useRef<HTMLDivElement>(null);
  const plateau = useRef<HTMLUListElement>(null);
  const departDeLEtiquette = useRef<Point | undefined>(undefined);
  const nombreRestant = etiquettesAPlacer.length;
  const dejaMonte = useRef(false);
  useEffect(() => {
    if (dejaMonte.current) premiere.current?.focus();
    dejaMonte.current = true;
  }, [nombreRestant]);

  const poser = (etiquette: string, groupe?: string) => {
    departDeLEtiquette.current = centreDeLEtiquette(plateau.current, etiquettesAPlacer.indexOf(etiquette));
    setChoisie(undefined);
    onPoser(etiquette, groupe);
  };

  const etiquetteVisee = etiquetteViseeParJeNeSaisPas(choisie);
  const bonneReponseMontree = bonnesReponsesMontrees[etiquetteVisee ?? ""];
  const jeNeSaisPas = () => {
    setChoisie(etiquetteVisee);
    onJeNeSaisPas(etiquetteVisee);
  };
  const survoler = (point: Point | undefined) =>
    setMaisonSurvolee(point === undefined ? undefined : groupeSousLePoint(conteneurDesMaisons.current, point));
  const lacher = (etiquette: string, point: Point) => {
    const groupe = groupeSousLePoint(conteneurDesMaisons.current, point);
    if (groupe !== undefined) poser(etiquette, groupe);
  };
  const brille = (etiquette: string, rang: number) =>
    exercice.type === "ordre" && etiquette === bonneReponseMontree && rang === etiquettesAPlacer.indexOf(etiquette);

  return (
    <div className="etiquettes" data-testid="etiquettes" data-type={exercice.type}>
      <ul ref={plateau} className="etiquettes-a-placer" aria-label="Étiquettes à poser" data-testid="etiquettes-a-placer">
        {etiquettesAPlacer.map((etiquette, rang) => (
          <li key={`${etiquette}-${rang}`}>
            <Etiquette
              texte={etiquette}
              aFocaliser={rang === 0 ? premiere : undefined}
              brille={brille(etiquette, rang)}
              appuyee={exercice.type === "classer" ? choisie === etiquette : undefined}
              poseALeToucher={exercice.type === "ordre"}
              glissable={exercice.type === "classer"}
              onToucher={() => exercice.type === "ordre" ? poser(etiquette) : setChoisie(choisie === etiquette ? undefined : etiquette)}
              onSurvol={survoler}
              onLacher={(point) => lacher(etiquette, point)}
            />
          </li>
        ))}
      </ul>
      {nombreRestant > 0 && bonneReponseMontree === undefined && (
        <DansLaBarreDAction>
          <button type="button" className="je-ne-sais-pas" data-testid="je-ne-sais-pas" onClick={jeNeSaisPas}>
            Je ne sais pas
          </button>
        </DansLaBarreDAction>
      )}
      {exercice.type === "classer"
        ? (
          <Maisons
            exercice={exercice}
            posees={etiquettesPosees}
            choisie={choisie}
            maisonQuiBrille={bonneReponseMontree}
            maisonSurvolee={maisonSurvolee}
            conteneur={conteneurDesMaisons}
            onPoser={poser}
          />
        )
        : <PetitTrain elements={exercice.elements} nombrePosees={exercice.elements.length - nombreRestant} versDeLaPoesie={versDeLaPoesie} depart={departDeLEtiquette} />}
    </div>
  );
}

function centreDeLEtiquette(plateau: HTMLElement | null, rang: number): Point | undefined {
  const boite = plateau?.children[rang]?.getBoundingClientRect();
  return boite === undefined ? undefined : { x: boite.left + boite.width / 2, y: boite.top + boite.height / 2 };
}
