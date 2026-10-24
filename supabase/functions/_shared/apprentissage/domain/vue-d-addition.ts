import type { AdditionPosee } from "./addition-posee.ts";
import type { EtapeCalculer } from "./etape-calculer.ts";
import type { EtapePoser } from "./etape-poser.ts";
import type { CalculEnCours } from "./question-de-calcul.ts";
import type { Couleur, Rang } from "./rangs-d-addition.ts";

export type VueColonne = Readonly<{
  rang: Rang;
  couleur: Couleur;
  chiffresPoses: readonly string[];
  retenue?: number;
  chiffreEcrit?: string;
}>;

export type VueAddition = Readonly<{
  nombres: readonly number[];
  etape: "poser" | "calculer";
  consigne?: string;
  invite?: string;
  nombreAPoser?: number;
  chiffresAPoser?: readonly string[];
  colonnes: readonly VueColonne[];
  colonneEnCours?: Rang;
  calcul?: CalculEnCours;
  resultatEcrit: string;
  parole?: string;
}>;

export type AdditionEnJeu = Readonly<{ addition: AdditionPosee; poser?: EtapePoser; calculer?: EtapeCalculer }>;

export function vueDeLAddition({ addition, poser, calculer }: AdditionEnJeu): VueAddition {
  const aPoser = poser && !poser.terminee ? poser : undefined;
  const calcul = calculer?.calculEnCours();
  const colonneEnCours = calculer && !calculer.terminee ? calculer.colonneEnCours.rang : undefined;
  return {
    nombres: addition.nombres,
    etape: aPoser ? "poser" : "calculer",
    ...(aPoser ? donneesDePose(aPoser) : {}),
    colonnes: addition.colonnes.map(({ rang, couleur, chiffres }): VueColonne => {
      const retenue = calculer?.retenues[rang];
      const chiffreEcrit = calculer?.chiffreEcrit(rang);
      return {
        rang,
        couleur,
        chiffresPoses: poser ? poser.chiffresPoses(rang) : chiffres.map(String),
        ...(retenue === undefined ? {} : { retenue }),
        ...(chiffreEcrit === undefined ? {} : { chiffreEcrit }),
      };
    }),
    ...(colonneEnCours ? { colonneEnCours } : {}),
    ...(calcul ? { calcul } : {}),
    resultatEcrit: calculer?.resultatEcrit ?? "",
    parole: calculer?.paroleApresLaDerniereReponse,
  };
}

function donneesDePose(
  poser: EtapePoser,
): Pick<VueAddition, "consigne" | "invite" | "nombreAPoser" | "chiffresAPoser"> {
  return {
    consigne: poser.consigne,
    invite: poser.invite,
    nombreAPoser: poser.nombreCourant,
    chiffresAPoser: poser.chiffresAPoser(),
  };
}
