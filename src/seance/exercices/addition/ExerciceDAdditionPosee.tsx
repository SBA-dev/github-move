import { type DragEvent, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { VueAddition, VueColonne } from "@domain/apprentissage";
import { ReponseAuCalcul } from "../ReponseAuCalcul.tsx";

type Rang = VueColonne["rang"];

type Props = {
  readonly addition: VueAddition;
  /** L'addition est terminée : on la félicite avant de passer à la suivante. */
  readonly reussie: boolean;
  readonly colonneQuiBrille: Rang | undefined;
  readonly onPoser: (chiffre: string, rang: Rang) => void;
  readonly onRelire: (phrase: string) => void;
  readonly onChoisir: (texte: string) => void;
  readonly onValider: (nombre: number) => void;
  readonly onJeNeSaisPas: (chiffre?: string) => void;
};

const NOMS_DES_COLONNES: Record<Rang, { readonly maison: string; readonly des: string }> = {
  unites: { maison: "Unités", des: "unités" },
  dizaines: { maison: "Dizaines", des: "dizaines" },
  centaines: { maison: "Centaines", des: "centaines" },
};

const TYPE_DU_CHIFFRE = "application/x-savanturier-chiffre";

export function ExerciceDAdditionPosee(props: Props) {
  const { addition, reussie, colonneQuiBrille, onPoser, onRelire, onJeNeSaisPas } = props;
  const [choisi, setChoisi] = useState<number | undefined>();
  const chiffresAPoser = addition.chiffresAPoser ?? [];
  const chiffreChoisi = choisi === undefined ? undefined : chiffresAPoser[choisi];

  const poser = (chiffre: string, rang: Rang) => {
    setChoisi(undefined);
    onPoser(chiffre, rang);
  };

  return (
    <div className="addition-posee" data-testid="addition-posee" data-etape={addition.etape}>
      <p className="operation-posee" data-testid="operation-posee">{addition.nombres.join(" + ")}</p>
      <div className="colonnes" role="group" aria-label="Addition en colonnes" data-testid="colonnes">
        {[...addition.colonnes].reverse().map((colonne) => (
          <Colonne
            key={colonne.rang}
            colonne={colonne}
            brille={colonne.rang === colonneQuiBrille}
            enCours={colonne.rang === addition.colonneEnCours}
            pose={addition.etape === "poser" && !reussie}
            chiffreChoisi={chiffreChoisi}
            chiffresAPoser={chiffresAPoser}
            onPoser={poser}
          />
        ))}
      </div>
      {addition.resultatEcrit !== "" && (
        <output className="resultat-de-l-addition" data-testid="resultat" aria-label="Résultat">
          {addition.resultatEcrit}
        </output>
      )}
      {addition.etape === "poser" && !reussie && (
        <>
          <p className="invite-de-pose" data-testid="invite-de-pose">{addition.invite}</p>
          <ul className="chiffres-a-poser" aria-label="Chiffres à poser" data-testid="chiffres-a-poser">
            {chiffresAPoser.map((chiffre, rang) => (
              <li
                key={`${chiffre}-${rang}`}
                draggable
                onDragStart={(evenement) => {
                  evenement.dataTransfer.setData(TYPE_DU_CHIFFRE, chiffre);
                }}
              >
                <button
                  type="button"
                  className="etiquette chiffre-a-poser"
                  data-testid="chiffre-a-poser"
                  aria-pressed={choisi === rang}
                  onClick={() => setChoisi(choisi === rang ? undefined : rang)}
                >
                  {chiffre}
                </button>
              </li>
            ))}
          </ul>
          {colonneQuiBrille === undefined && (
            <button
              type="button"
              className="je-ne-sais-pas"
              data-testid="je-ne-sais-pas"
              onClick={() => onJeNeSaisPas(chiffreChoisi)}
            >
              Je ne sais pas
            </button>
          )}
        </>
      )}
      {addition.etape === "calculer" && addition.calcul && (
        <>
          <button
            type="button"
            className="question"
            data-testid="phrase-de-la-colonne"
            onClick={() => addition.calcul && onRelire(addition.calcul.phrase)}
          >
            {addition.calcul.phrase}
          </button>
          <ReponseAuCalcul
            calcul={addition.calcul}
            reussi={reussie}
            onChoisir={props.onChoisir}
            onValider={props.onValider}
            onJeNeSaisPas={() => onJeNeSaisPas()}
          />
        </>
      )}
    </div>
  );
}

type PropsDeLaColonne = {
  readonly colonne: VueColonne;
  readonly brille: boolean;
  readonly enCours: boolean;
  readonly pose: boolean;
  readonly chiffreChoisi: string | undefined;
  readonly chiffresAPoser: readonly string[];
  readonly onPoser: (chiffre: string, rang: Rang) => void;
};

/** Une colonne : sa maison, la retenue en haut, les chiffres posés, le chiffre écrit en bas. Ses couleurs ne changent jamais. */
function Colonne({ colonne, brille, enCours, pose, chiffreChoisi, chiffresAPoser, onPoser }: PropsDeLaColonne) {
  const mouvementsReduits = useReducedMotion() ?? false;
  const { rang, couleur, chiffresPoses, retenue, chiffreEcrit } = colonne;
  const lacher = (evenement: DragEvent) => {
    evenement.preventDefault();
    const chiffre = evenement.dataTransfer.getData(TYPE_DU_CHIFFRE);
    if (chiffresAPoser.includes(chiffre)) onPoser(chiffre, rang);
  };
  return (
    <section
      className="colonne"
      role="group"
      aria-label={`Colonne des ${NOMS_DES_COLONNES[rang].des}`}
      data-testid="colonne"
      data-rang={rang}
      data-couleur={couleur}
      data-brille={brille ? "true" : undefined}
      data-en-cours={enCours ? "true" : undefined}
      onDragOver={(evenement) => evenement.preventDefault()}
      onDrop={lacher}
    >
      <button
        type="button"
        className="maison-de-la-colonne"
        data-testid="maison-de-la-colonne"
        aria-label={`Poser dans la colonne des ${NOMS_DES_COLONNES[rang].des}`}
        aria-disabled={pose && chiffreChoisi !== undefined ? undefined : true}
        onClick={() => pose && chiffreChoisi !== undefined && onPoser(chiffreChoisi, rang)}
      >
        {NOMS_DES_COLONNES[rang].maison}
      </button>
      <div className="place-de-la-retenue">
        {retenue !== undefined && (
          <span
            key={retenue}
            className="retenue"
            data-testid="retenue"
            data-mouvement={mouvementsReduits ? "aucun" : "monte"}
            role="img"
            aria-label={`Retenue ${retenue}`}
          >
            {retenue}
          </span>
        )}
      </div>
      <ul className="chiffres-poses" aria-label="Chiffres posés" data-testid="chiffres-poses">
        {chiffresPoses.map((chiffre, position) => (
          <li key={`${chiffre}-${position}`} data-testid="chiffre-pose">{chiffre}</li>
        ))}
      </ul>
      <output className="chiffre-ecrit" data-testid="chiffre-ecrit" aria-label="Chiffre écrit">{chiffreEcrit}</output>
    </section>
  );
}
