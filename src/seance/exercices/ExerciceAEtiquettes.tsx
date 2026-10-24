import { type DragEvent, useEffect, useRef, useState } from "react";
import type { Exercice } from "@domain/catalogue";
import { TexteEnSyllabes } from "../../reglages/index.ts";

type Props = {
  readonly exercice: Extract<Exercice, { type: "classer" | "ordre" }>;
  /** Les étiquettes qui attendent encore d'être posées. */
  readonly etiquettesAPlacer: readonly string[];
  /** Ce que « Je ne sais pas » a montré : la maison (classer) de chaque étiquette aidée, ou l'étiquette qui vient ensuite (ordre, clé vide). */
  readonly bonnesReponsesMontrees: Readonly<Record<string, string>>;
  readonly onPoser: (etiquette: string, groupe?: string) => void;
  readonly onJeNeSaisPas: (etiquette?: string) => void;
};

type Posee = { readonly texte: string; readonly groupe: string };

/** Les étiquettes déjà bien posées : ce qui a quitté le plateau est dans la maison de son groupe. */
function etiquettesPosees(exercice: Extract<Exercice, { type: "classer" }>, aPlacer: readonly string[]): Posee[] {
  const restantes = [...aPlacer];
  return exercice.items.flatMap((item) => {
    const rang = restantes.indexOf(item.texte);
    if (rang === -1) return [{ texte: item.texte, groupe: item.groupe }];
    restantes.splice(rang, 1);
    return [];
  });
}

export function ExerciceAEtiquettes({ exercice, etiquettesAPlacer, bonnesReponsesMontrees, onPoser, onJeNeSaisPas }: Props) {
  const [choisie, setChoisie] = useState<string | undefined>();
  const premiere = useRef<HTMLButtonElement>(null);
  const nombreRestant = etiquettesAPlacer.length;
  const dejaMonte = useRef(false);
  useEffect(() => {
    if (dejaMonte.current) premiere.current?.focus();
    dejaMonte.current = true;
  }, [nombreRestant]);

  const poser = (etiquette: string, groupe?: string) => {
    setChoisie(undefined);
    onPoser(etiquette, groupe);
  };

  const etiquetteVisee = exercice.type === "classer" ? choisie ?? etiquettesAPlacer[0] : undefined;
  const bonneReponseMontree = bonnesReponsesMontrees[etiquetteVisee ?? ""];
  const jeNeSaisPas = () => {
    setChoisie(etiquetteVisee);
    onJeNeSaisPas(etiquetteVisee);
  };
  const brille = (etiquette: string, rang: number) =>
    exercice.type === "ordre" && etiquette === bonneReponseMontree && rang === etiquettesAPlacer.indexOf(etiquette);

  return (
    <div className="etiquettes" data-testid="etiquettes">
      <ul className="etiquettes-a-placer" aria-label="Étiquettes à poser" data-testid="etiquettes-a-placer">
        {etiquettesAPlacer.map((etiquette, rang) => (
          <li
            key={`${etiquette}-${rang}`}
            draggable={exercice.type === "classer"}
            onDragStart={(evenement) => evenement.dataTransfer.setData("text/plain", etiquette)}
          >
            <button
              ref={rang === 0 ? premiere : undefined}
              type="button"
              className="etiquette"
              data-testid="etiquette"
              data-brille={brille(etiquette, rang) ? "true" : undefined}
              aria-pressed={exercice.type === "classer" ? choisie === etiquette : undefined}
              onClick={() => exercice.type === "ordre" ? poser(etiquette) : setChoisie(choisie === etiquette ? undefined : etiquette)}
            >
              <TexteEnSyllabes texte={etiquette} />
            </button>
          </li>
        ))}
      </ul>
      {nombreRestant > 0 && bonneReponseMontree === undefined && (
        <button type="button" className="je-ne-sais-pas" data-testid="je-ne-sais-pas" onClick={jeNeSaisPas}>
          Je ne sais pas
        </button>
      )}
      {exercice.type === "classer"
        ? (
          <Maisons
            exercice={exercice}
            posees={etiquettesPosees(exercice, etiquettesAPlacer)}
            choisie={choisie}
            maisonQuiBrille={bonneReponseMontree}
            onPoser={poser}
          />
        )
        : <Places exercice={exercice} nombrePosees={exercice.elements.length - nombreRestant} />}
    </div>
  );
}

type PropsDesMaisons = {
  readonly exercice: Extract<Exercice, { type: "classer" }>;
  readonly posees: readonly Posee[];
  readonly choisie: string | undefined;
  readonly maisonQuiBrille: string | undefined;
  readonly onPoser: (etiquette: string, groupe: string) => void;
};

function Maisons({ exercice, posees, choisie, maisonQuiBrille, onPoser }: PropsDesMaisons) {
  const lacher = (evenement: DragEvent, groupe: string) => {
    evenement.preventDefault();
    const etiquette = evenement.dataTransfer.getData("text/plain");
    if (etiquette) onPoser(etiquette, groupe);
  };
  return (
    <div className="maisons">
      {exercice.groupes.map((groupe) => (
        <section
          key={groupe.id}
          className="maison"
          role="group"
          aria-label={`Maison « ${groupe.nom} »`}
          data-testid="maison"
          data-groupe={groupe.id}
          data-brille={groupe.id === maisonQuiBrille ? "true" : undefined}
          onDragOver={(evenement) => evenement.preventDefault()}
          onDrop={(evenement) => lacher(evenement, groupe.id)}
        >
          <button
            type="button"
            className="porte-de-la-maison"
            aria-label={`Poser dans la maison « ${groupe.nom} »`}
            aria-disabled={choisie === undefined ? true : undefined}
            onClick={() => choisie !== undefined && onPoser(choisie, groupe.id)}
          >
            <TexteEnSyllabes texte={groupe.nom} />
          </button>
          <ul aria-label={`Étiquettes dans la maison « ${groupe.nom} »`}>
            {posees.filter((posee) => posee.groupe === groupe.id).map((posee, rang) => (
              <li key={`${posee.texte}-${rang}`} className="etiquette posee" data-testid="etiquette-posee">
                <TexteEnSyllabes texte={posee.texte} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Places({ exercice, nombrePosees }: { readonly exercice: Extract<Exercice, { type: "ordre" }>; readonly nombrePosees: number }) {
  return (
    <ol className="places" aria-label="Ordre des étiquettes" data-testid="places">
      {exercice.elements.map((element, rang) => (
        <li key={rang} className="place" data-testid="place" data-remplie={rang < nombrePosees ? "true" : undefined}>
          {rang < nombrePosees ? <TexteEnSyllabes texte={element} /> : <span className="visuellement-cache">place libre</span>}
        </li>
      ))}
    </ol>
  );
}
