import { type DragEvent, type RefObject, useEffect, useRef, useState } from "react";
import type { EtiquettePosee } from "@domain/apprentissage";
import type { Exercice } from "@domain/catalogue";
import { TexteEnSyllabes } from "../../reglages/index.ts";
import { useRetourDe } from "../../retours/index.ts";

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
};

const TYPE_DE_L_ETIQUETTE = "application/x-savanturier-etiquette";

export function ExerciceAEtiquettes({ exercice, etiquettesAPlacer, etiquettesPosees, etiquetteViseeParJeNeSaisPas, bonnesReponsesMontrees, onPoser, onJeNeSaisPas }: Props) {
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

  const etiquetteVisee = etiquetteViseeParJeNeSaisPas(choisie);
  const bonneReponseMontree = bonnesReponsesMontrees[etiquetteVisee ?? ""];
  const jeNeSaisPas = () => {
    setChoisie(etiquetteVisee);
    onJeNeSaisPas(etiquetteVisee);
  };
  const brille = (etiquette: string, rang: number) =>
    exercice.type === "ordre" && etiquette === bonneReponseMontree && rang === etiquettesAPlacer.indexOf(etiquette);

  return (
    <div className="etiquettes" data-testid="etiquettes" data-type={exercice.type}>
      <ul className="etiquettes-a-placer" aria-label="Étiquettes à poser" data-testid="etiquettes-a-placer">
        {etiquettesAPlacer.map((etiquette, rang) => (
          <li
            key={`${etiquette}-${rang}`}
            draggable={exercice.type === "classer"}
            onDragStart={(evenement) => evenement.dataTransfer.setData(TYPE_DE_L_ETIQUETTE, etiquette)}
          >
            <Etiquette
              texte={etiquette}
              aFocaliser={rang === 0 ? premiere : undefined}
              brille={brille(etiquette, rang)}
              appuyee={exercice.type === "classer" ? choisie === etiquette : undefined}
              onToucher={() => exercice.type === "ordre" ? poser(etiquette) : setChoisie(choisie === etiquette ? undefined : etiquette)}
            />
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
            posees={etiquettesPosees}
            choisie={choisie}
            maisonQuiBrille={bonneReponseMontree}
            etiquettesAPlacer={etiquettesAPlacer}
            onPoser={poser}
          />
        )
        : <Places exercice={exercice} nombrePosees={exercice.elements.length - nombreRestant} />}
    </div>
  );
}

type PropsDesMaisons = {
  readonly exercice: Extract<Exercice, { type: "classer" }>;
  readonly posees: readonly EtiquettePosee[];
  readonly etiquettesAPlacer: readonly string[];
  readonly choisie: string | undefined;
  readonly maisonQuiBrille: string | undefined;
  readonly onPoser: (etiquette: string, groupe: string) => void;
};

function Maisons({ exercice, posees, etiquettesAPlacer, choisie, maisonQuiBrille, onPoser }: PropsDesMaisons) {
  const lacher = (evenement: DragEvent, groupe: string) => {
    evenement.preventDefault();
    const etiquette = evenement.dataTransfer.getData(TYPE_DE_L_ETIQUETTE);
    if (etiquettesAPlacer.includes(etiquette)) onPoser(etiquette, groupe);
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
              <EtiquettePosee key={`${posee.texte}-${rang}`} texte={posee.texte} />
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
        <Place key={rang} element={element} remplie={rang < nombrePosees} />
      ))}
    </ol>
  );
}

type PropsDeLEtiquette = {
  readonly texte: string;
  readonly aFocaliser: RefObject<HTMLButtonElement | null> | undefined;
  readonly brille: boolean;
  readonly appuyee: boolean | undefined;
  readonly onToucher: () => void;
};

/** Une étiquette à poser : elle se balance quand elle est mal posée. */
function Etiquette({ texte, aFocaliser, brille, appuyee, onToucher }: PropsDeLEtiquette) {
  const retour = useRetourDe<HTMLButtonElement>(texte);
  return (
    <button
      ref={(bouton) => {
        retour.ref.current = bouton;
        if (aFocaliser) aFocaliser.current = bouton;
      }}
      type="button"
      className="etiquette"
      data-testid="etiquette"
      data-brille={brille ? "true" : undefined}
      {...retour.attributs}
      aria-pressed={appuyee}
      onClick={onToucher}
    >
      <TexteEnSyllabes texte={texte} />
    </button>
  );
}

/** Une étiquette bien posée dans sa maison : elle rebondit. */
function EtiquettePosee({ texte }: { readonly texte: string }) {
  const retour = useRetourDe<HTMLLIElement>(texte);
  return (
    <li ref={retour.ref} className="etiquette posee" data-testid="etiquette-posee" {...retour.attributs}>
      <TexteEnSyllabes texte={texte} />
    </li>
  );
}

/** Une place de l'ordre : l'étiquette qui vient d'y être posée rebondit. */
function Place({ element, remplie }: { readonly element: string; readonly remplie: boolean }) {
  const retour = useRetourDe<HTMLLIElement>(remplie ? element : "");
  return (
    <li ref={retour.ref} className="place" data-testid="place" data-remplie={remplie ? "true" : undefined} {...retour.attributs}>
      {remplie ? <TexteEnSyllabes texte={element} /> : <span className="visuellement-cache">place libre</span>}
    </li>
  );
}
