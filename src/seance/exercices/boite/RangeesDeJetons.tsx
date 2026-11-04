import { useReducedMotion } from "motion/react";
import { useUnivers } from "../../../univers/index.ts";
import { DESSINS_DES_JETONS } from "./dessins/jetons.tsx";

type Props = {
  readonly nombre: number;
  /** Tous ces jetons viennent d'entrer dans la boîte. */
  readonly nouveaux?: boolean;
  /** Les derniers jetons qui sortent de la boîte. */
  readonly sortants?: number;
  /** Comment les jetons arrivent : ils tombent dans la boîte, ou ils y sont déjà posés (boîte ouverte après la bonne réponse). */
  readonly mouvement: "tombe" | "pose";
};

const JETONS_PAR_RANGEE = 5;

/** Des jetons rangés par 5, le cinquième de chaque rangée marqué. Avec les mouvements réduits, rien ne tombe ni ne bouge. */
export function RangeesDeJetons({ nombre, nouveaux = false, sortants = 0, mouvement }: Props) {
  const univers = useUnivers();
  const mouvementsReduits = useReducedMotion() ?? false;
  const rangees = Array.from({ length: Math.ceil(nombre / JETONS_PAR_RANGEE) }, (_, rang) => rang);
  const etatDuJeton = (rang: number) => nouveaux ? "nouveau" : rang >= nombre - sortants ? "sortant" : undefined;
  const mouvementDuJeton = (etat: string | undefined) => {
    if (mouvementsReduits) return "pose";
    return etat === "sortant" ? "s-en-va" : mouvement;
  };
  return (
    <div className="jetons" data-testid="jetons" data-nombre={nombre}>
      {rangees.map((rangee) => (
        <div key={rangee} className="rangee-de-jetons" data-testid="rangee-de-jetons">
          {Array.from(
            { length: Math.min(JETONS_PAR_RANGEE, nombre - rangee * JETONS_PAR_RANGEE) },
            (_, place) => {
              const rang = rangee * JETONS_PAR_RANGEE + place;
              const cinquieme = place === JETONS_PAR_RANGEE - 1;
              const etat = etatDuJeton(rang);
              return (
                <span
                  key={rang}
                  className="jeton"
                  data-testid="jeton"
                  data-univers={univers}
                  data-cinquieme={cinquieme ? "true" : undefined}
                  data-etat={etat}
                  data-mouvement={mouvementDuJeton(etat)}
                >
                  <svg className="dessin-du-jeton" data-testid="dessin-du-jeton" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                    {DESSINS_DES_JETONS[univers]}
                  </svg>
                  {cinquieme && <span className="marque-du-cinquieme" data-testid="marque-du-cinquieme" data-marque="commune" />}
                </span>
              );
            },
          )}
        </div>
      ))}
    </div>
  );
}
