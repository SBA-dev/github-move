import { useCallback, useRef, useState } from "react";
import { NOMS_DES_COLONNES_A_L_ECRAN, type VueAddition, type VueColonne } from "@domain/apprentissage";
import { CIBLE_DES_COLONNES, useRetourDe } from "../../../retours/index.ts";
import { useUnivers } from "../../../univers/index.ts";
import { maisonSousLePoint, type Point } from "../maisons/groupe-sous-le-doigt.ts";
import { ActionDeLExercice } from "../ActionDeLExercice.tsx";
import { ReponseAuCalcul } from "../ReponseAuCalcul.tsx";
import { ChiffreAPoser } from "./ChiffreAPoser.tsx";
import { DessinDeLaMaisonDeColonne } from "./DessinDeLaMaisonDeColonne.tsx";
import { RetenueDessinee } from "./RetenueDessinee.tsx";
import type { DepartsDesRetenues } from "./saut-de-la-retenue.ts";

type Rang = VueColonne["rang"];

type Props = {
  readonly addition: VueAddition;
  /** L'addition est terminée : on la félicite avant de passer à la suivante. */
  readonly reussie: boolean;
  readonly colonneQuiBrille: Rang | undefined;
  /** D'où vient chaque retenue posée, pour la faire sauter. */
  readonly departsDesRetenues: DepartsDesRetenues;
  readonly onPoser: (chiffre: string, rang: Rang) => void;
  readonly onRelire: (phrase: string) => void;
  readonly onChoisir: (texte: string) => void;
  readonly onValider: (nombre: number) => void;
  readonly onJeNeSaisPas: (chiffre?: string) => void;
};

const MAISONS_DES_COLONNES = '[data-testid="maison-de-la-colonne"]';

export function ExerciceDAdditionPosee(props: Props) {
  const { addition, reussie, colonneQuiBrille, departsDesRetenues, onPoser, onRelire, onJeNeSaisPas } = props;
  const [choisi, setChoisi] = useState<number | undefined>();
  const [rangSurvole, setRangSurvole] = useState<Rang | undefined>();
  const chiffresAPoser = addition.chiffresAPoser ?? [];
  const chiffreChoisi = choisi === undefined ? undefined : chiffresAPoser[choisi];
  const retourDesColonnes = useRetourDe<HTMLDivElement>(CIBLE_DES_COLONNES);
  const conteneurDesColonnes = useRef<HTMLDivElement | null>(null);
  const refDesColonnes = retourDesColonnes.ref;
  const memoriserLesColonnes = useCallback((conteneur: HTMLDivElement | null) => {
    refDesColonnes.current = conteneur;
    conteneurDesColonnes.current = conteneur;
  }, [refDesColonnes]);

  const poser = (chiffre: string, rang: Rang) => {
    setChoisi(undefined);
    onPoser(chiffre, rang);
  };
  const rangDeLaMaison = (point: Point): Rang | undefined => {
    const rang = maisonSousLePoint(conteneurDesColonnes.current, MAISONS_DES_COLONNES, point)?.dataset.rang;
    return addition.colonnes.find((colonne) => colonne.rang === rang)?.rang;
  };
  const survoler = (point: Point | undefined) =>
    setRangSurvole(point === undefined ? undefined : rangDeLaMaison(point));
  const lacher = (chiffre: string, point: Point) => {
    const rang = rangDeLaMaison(point);
    if (rang !== undefined) poser(chiffre, rang);
  };

  return (
    <div className="addition-posee" data-testid="addition-posee" data-etape={addition.etape}>
      <p className="operation-posee" data-testid="operation-posee">{addition.nombres.join(" + ")}</p>
      <div
        ref={memoriserLesColonnes}
        {...retourDesColonnes.attributs}
        className="colonnes"
        role="group"
        aria-label="Addition en colonnes"
        data-testid="colonnes"
      >
        {[...addition.colonnes].reverse().map((colonne) => (
          <Colonne
            key={colonne.rang}
            colonne={colonne}
            brille={colonne.rang === colonneQuiBrille}
            enCours={colonne.rang === addition.colonneEnCours}
            survolee={colonne.rang === rangSurvole}
            departDeLaRetenue={departsDesRetenues[colonne.rang]}
            pose={addition.etape === "poser" && !reussie}
            chiffreChoisi={chiffreChoisi}
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
              <li key={`${chiffre}-${rang}`}>
                <ChiffreAPoser
                  chiffre={chiffre}
                  choisi={choisi === rang}
                  onToucher={() => setChoisi(choisi === rang ? undefined : rang)}
                  onSurvol={survoler}
                  onLacher={(point) => lacher(chiffre, point)}
                />
              </li>
            ))}
          </ul>
          {colonneQuiBrille === undefined && (
            <ActionDeLExercice>
              <button
                type="button"
                className="je-ne-sais-pas"
                data-testid="je-ne-sais-pas"
                onClick={() => onJeNeSaisPas(chiffreChoisi)}
              >
                Je ne sais pas
              </button>
            </ActionDeLExercice>
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
  readonly survolee: boolean;
  readonly departDeLaRetenue: Rang | undefined;
  readonly pose: boolean;
  readonly chiffreChoisi: string | undefined;
  readonly onPoser: (chiffre: string, rang: Rang) => void;
};

/** Une colonne : sa maison, la retenue en haut, les chiffres posés, le chiffre écrit en bas. Ses couleurs ne changent jamais. */
function Colonne({ colonne, brille, enCours, survolee, departDeLaRetenue, pose, chiffreChoisi, onPoser }: PropsDeLaColonne) {
  const univers = useUnivers();
  const { rang, couleur, chiffresPoses, retenue, chiffreEcrit } = colonne;
  const allumee = chiffreEcrit !== undefined;
  const ouverte = chiffresPoses.length > 0 || allumee;
  return (
    <section
      className="colonne"
      role="group"
      aria-label={`Colonne des ${NOMS_DES_COLONNES_A_L_ECRAN[rang].toLowerCase()}`}
      data-testid="colonne"
      data-rang={rang}
      data-couleur={couleur}
      data-brille={brille ? "true" : undefined}
      data-en-cours={enCours ? "true" : undefined}
    >
      <button
        type="button"
        className="maison-de-la-colonne"
        data-testid="maison-de-la-colonne"
        data-donne-une-reponse="true"
        data-rang={rang}
        data-univers={univers}
        data-ouverte={String(ouverte)}
        data-allumee={String(allumee)}
        data-survolee={survolee ? "true" : undefined}
        aria-label={`Poser dans la colonne des ${NOMS_DES_COLONNES_A_L_ECRAN[rang].toLowerCase()}`}
        aria-disabled={pose && chiffreChoisi !== undefined ? undefined : true}
        onClick={() => pose && chiffreChoisi !== undefined && onPoser(chiffreChoisi, rang)}
      >
        <DessinDeLaMaisonDeColonne univers={univers} couleur={couleur} ouverte={ouverte} allumee={allumee} />
        <span className="nom-de-la-colonne">{NOMS_DES_COLONNES_A_L_ECRAN[rang]}</span>
        {survolee && <span className="signal-de-survol" data-testid="signal-de-survol" aria-hidden="true" />}
      </button>
      {brille && <span className="signal-brille" data-testid="signal-brille" data-brille="true" aria-hidden="true" />}
      <div className="place-de-la-retenue">
        {retenue !== undefined && <RetenueDessinee retenue={retenue} univers={univers} couleur={couleur} depart={departDeLaRetenue} />}
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
