import { useCallback, useRef, useState } from "react";
import type { ChampDeLHeure } from "@domain/apprentissage";
import { PaveDeCristaux } from "../PaveDeCristaux.tsx";

const CHIFFRES_PAR_CHAMP = 2;
const PREMIERS_CHIFFRES_D_UNE_HEURE_A_UN_CHIFFRE = "3456789";

function saisieTerminee(champ: ChampDeLHeure, valeur: string): boolean {
  if (valeur.length === CHIFFRES_PAR_CHAMP) return true;
  return champ === "heures" && PREMIERS_CHIFFRES_D_UNE_HEURE_A_UN_CHIFFRE.includes(valeur);
}

const CHAMPS: Readonly<Record<ChampDeLHeure, { readonly libelle: string; readonly unite: string }>> = {
  heures: { libelle: "Heures", unite: "h" },
  minutes: { libelle: "Minutes", unite: "min" },
  secondes: { libelle: "Secondes", unite: "s" },
};

type Saisie = Readonly<{ valeurs: Readonly<Record<ChampDeLHeure, string>>; actif: ChampDeLHeure; refusee: boolean }>;

const SAISIE_VIDE: Saisie = { valeurs: { heures: "", minutes: "", secondes: "" }, actif: "heures", refusee: false };

type Props = {
  readonly champs: readonly ChampDeLHeure[];
  /** Reçoit l'heure écrite ; rend `false` si elle est impossible : elle reste affichée pour être corrigée. */
  readonly onValider: (heures: number, minutes: number, secondes: number) => boolean;
  /** Les touches qui brillent : l'heure montrée par « Je ne sais pas ». */
  readonly chiffresQuiBrillent: readonly string[];
  readonly desactive: boolean;
};

/** La saisie d'une heure : un champ par unité, celui qu'on touche reçoit les chiffres, puis la saisie passe au champ suivant. */
function useSaisieDeLHeure(champs: readonly ChampDeLHeure[], onValider: Props["onValider"]) {
  const [saisie, setSaisie] = useState<Saisie>(SAISIE_VIDE);
  const courante = useRef<Saisie>(SAISIE_VIDE);
  const changer = useCallback((nouvelle: Saisie) => {
    courante.current = nouvelle;
    setSaisie(nouvelle);
  }, []);
  const voisin = useCallback((sens: 1 | -1): ChampDeLHeure | undefined => champs[champs.indexOf(courante.current.actif) + sens], [champs]);

  const choisir = useCallback((champ: ChampDeLHeure) => changer({ ...courante.current, actif: champ, refusee: false }), [changer]);

  const taper = useCallback((chiffre: string): boolean => {
    const { valeurs, actif } = courante.current;
    if (valeurs[actif].length >= CHIFFRES_PAR_CHAMP) return false;
    const valeur = valeurs[actif] + chiffre;
    const suivant = saisieTerminee(actif, valeur) ? voisin(1) : undefined;
    changer({ valeurs: { ...valeurs, [actif]: valeur }, actif: suivant ?? actif, refusee: false });
    return true;
  }, [changer, voisin]);

  const effacer = useCallback((): boolean => {
    const { valeurs, actif } = courante.current;
    if (valeurs[actif] !== "") {
      changer({ valeurs: { ...valeurs, [actif]: valeurs[actif].slice(0, -1) }, actif, refusee: false });
      return true;
    }
    const precedent = voisin(-1);
    if (precedent === undefined) return false;
    choisir(precedent);
    return true;
  }, [changer, choisir, voisin]);

  const valider = useCallback(() => {
    const { valeurs } = courante.current;
    if (valeurs.heures === "") return;
    const acceptee = onValider(Number(valeurs.heures), Number(valeurs.minutes), Number(valeurs.secondes));
    changer(acceptee ? SAISIE_VIDE : { ...courante.current, refusee: true });
  }, [changer, onValider]);

  const autreTouche = useCallback((touche: string): boolean => {
    const suivant = touche === "ArrowRight" || touche === ":" || touche === "h" ? voisin(1) : touche === "ArrowLeft" ? voisin(-1) : undefined;
    if (suivant === undefined) return false;
    choisir(suivant);
    return true;
  }, [choisir, voisin]);

  return { saisie, choisir, taper, effacer, valider, autreTouche };
}

/** Le clavier de cristaux de l'horloge : les champs de l'heure au-dessus des cristaux. */
export function ClavierDeLHeure({ champs, onValider, chiffresQuiBrillent, desactive }: Props) {
  const { saisie, choisir, taper, effacer, valider, autreTouche } = useSaisieDeLHeure(champs, onValider);
  return (
    <div className="clavier-de-cristaux clavier-de-l-heure" role="group" aria-label="Clavier de cristaux" data-testid="clavier-de-cristaux">
      <div className="champs-de-l-heure" role="group" aria-label="Heure tapée">
        {champs.map((champ) => (
          <button
            key={champ}
            type="button"
            className="champ-de-l-heure"
            data-testid={`champ-${champ}`}
            data-valeur={saisie.valeurs[champ]}
            data-actif={saisie.actif === champ ? "true" : undefined}
            aria-current={saisie.actif === champ ? "true" : undefined}
            aria-invalid={saisie.refusee ? true : undefined}
            aria-label={`${CHAMPS[champ].libelle}${saisie.valeurs[champ] === "" ? ", vide" : ` : ${saisie.valeurs[champ]}`}`}
            aria-disabled={desactive ? true : undefined}
            onClick={() => !desactive && choisir(champ)}
          >
            <span className="valeur-du-champ" aria-hidden="true">{saisie.valeurs[champ]}</span>
            <span className="unite-du-champ" aria-hidden="true">{CHAMPS[champ].unite}</span>
          </button>
        ))}
      </div>
      <p className="heure-impossible" role="status" data-testid="heure-impossible">
        {saisie.refusee ? "Cette heure n'existe pas. Essaie encore !" : ""}
      </p>
      <PaveDeCristaux
        onTaper={taper}
        onEffacer={effacer}
        onValider={valider}
        chiffresQuiBrillent={chiffresQuiBrillent}
        desactive={desactive}
        onAutreTouche={autreTouche}
      />
    </div>
  );
}
