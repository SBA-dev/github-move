import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Avancement } from "@domain/apprentissage";

type Props = {
  readonly avancement: Avancement;
};

type StyleDeLaBarre = CSSProperties & { readonly "--avancement": number };

/** Durée de l'éclat sur le compteur, en millisecondes. */
const DUREE_DE_L_ECLAT_EN_MS = 600;

/**
 * Avancement de la séance de leçon : une fine barre continue, et dessous le compteur « 2 / 6 » dans une pastille.
 * Une question réussie allonge la barre et fait briller le compteur (`data-eclat`) ; avec les mouvements réduits, la barre avance d'un coup, sans éclat.
 */
export function BarreDeProgressionDeLaSeance({ avancement }: Props) {
  const { questionsReussies, total } = avancement;
  const eclat = useEclatDuCompteur(questionsReussies);
  const style: StyleDeLaBarre = { "--avancement": total > 0 ? questionsReussies / total : 0 };
  return (
    <div
      className="progression-de-la-seance"
      role="progressbar"
      aria-label="Avancement de la séance"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={questionsReussies}
      aria-valuetext={`${questionsReussies} sur ${total}`}
      data-testid="recipient"
      data-questions-reussies={questionsReussies}
      data-total={total}
      data-complet={avancement.estComplet() ? "true" : "false"}
      style={style}
    >
      <div className="piste-de-la-seance" aria-hidden="true">
        <div className="remplissage-de-la-seance" />
      </div>
      <span className="compteur-de-la-seance" data-testid="compteur" data-eclat={eclat ? "true" : undefined} aria-hidden="true">
        {questionsReussies} / {total}
      </span>
    </div>
  );
}

/** Le compteur brille un instant quand une question vient d'être réussie : jamais au premier affichage, jamais avec les mouvements réduits. */
function useEclatDuCompteur(questionsReussies: number): boolean {
  const mouvementsReduits = useReducedMotion();
  const [eclat, setEclat] = useState(false);
  const dejaVues = useRef(questionsReussies);
  useEffect(() => {
    const gagnee = questionsReussies > dejaVues.current;
    dejaVues.current = questionsReussies;
    if (!gagnee || mouvementsReduits) {
      setEclat(false);
      return;
    }
    setEclat(true);
    const minuteur = setTimeout(() => setEclat(false), DUREE_DE_L_ECLAT_EN_MS);
    return () => clearTimeout(minuteur);
  }, [questionsReussies, mouvementsReduits]);
  return eclat;
}
