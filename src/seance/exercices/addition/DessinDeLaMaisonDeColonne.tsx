import { useId } from "react";
import { motion } from "motion/react";
import type { VueColonne } from "@domain/apprentissage";
import type { CleUnivers } from "@domain/motivation";
import { DUREE_DE_L_OUVERTURE_S } from "../maisons/DessinDeLaMaison.tsx";
import { useMouvementsReduits } from "../../../transitions/mouvements-reduits.ts";
import { avecSesIdentifiants, dessinDeLaMaison, type EtatDeLaMaison } from "./dessins-de-l-addition.ts";

type Props = {
  readonly univers: CleUnivers;
  readonly couleur: VueColonne["couleur"];
  readonly ouverte: boolean;
  readonly allumee: boolean;
};

/**
 * Le dessin de la maison d'une colonne : décor pour les yeux, jamais annoncé. Trois dessins s'empilent (porte fermée, porte ouverte,
 * maison allumée) ; chacun apparaît par-dessus le précédent, qui ne disparaît qu'ensuite. Avec les mouvements réduits, tout change d'un coup.
 */
export function DessinDeLaMaisonDeColonne({ univers, couleur, ouverte, allumee }: Props) {
  const prefixe = useId();
  const mouvementsReduits = useMouvementsReduits();
  const duree = mouvementsReduits ? 0 : DUREE_DE_L_OUVERTURE_S;
  const couche = (etat: EtatDeLaMaison, visible: boolean, identifiant?: string) => (
    <motion.g
      data-testid={identifiant}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: duree, ease: "easeOut", delay: visible ? 0 : duree }}
      dangerouslySetInnerHTML={{ __html: avecSesIdentifiants(dessinDeLaMaison(univers, couleur, etat), `${prefixe}-${etat}`) }}
    />
  );
  return (
    <svg className="dessin-de-la-maison" data-testid="dessin-de-la-maison" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {couche("fermee", !ouverte && !allumee)}
      {couche("ouverte", ouverte && !allumee, "porte")}
      {couche("allumee", allumee)}
    </svg>
  );
}
