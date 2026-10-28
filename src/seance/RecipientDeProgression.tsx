import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { useReducedMotion } from "motion/react";
import type { Avancement } from "@domain/apprentissage";

type Props = {
  readonly avancement: Avancement;
  /** Ce que lit un lecteur d'écran : « Avancement de la séance » par défaut. */
  readonly libelle?: string;
};

/** Le point part d'un peu plus bas, là où se joue l'exercice, et arrive à sa place en 400 ms. */
const DEPART_DU_POINT_EN_PX = 96;

export function RecipientDeProgression({ avancement, libelle = "Avancement de la séance" }: Props) {
  const { questionsReussies, total } = avancement;
  const rangDuPointQuiArrive = useRangDuPointQuiArrive(questionsReussies);
  return (
    <div
      className="recipient"
      role="progressbar"
      aria-label={libelle}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={questionsReussies}
      aria-valuetext={`${questionsReussies} sur ${total}`}
      data-testid="recipient"
      data-questions-reussies={questionsReussies}
      data-total={total}
      data-complet={avancement.estComplet() ? "true" : "false"}
    >
      <div className="points" aria-hidden="true">
        {Array.from({ length: total }, (_, rang) => (
          <Point key={rang} reussi={rang < questionsReussies} arrive={rang === rangDuPointQuiArrive} />
        ))}
      </div>
      <span className="compte" aria-hidden="true">{questionsReussies} / {total}</span>
    </div>
  );
}

/** Le rang du point gagné par la dernière réponse : le premier affichage n'en a pas. */
function useRangDuPointQuiArrive(questionsReussies: number): number | undefined {
  const [vu, setVu] = useState({ questionsReussies, rangQuiArrive: undefined as number | undefined });
  if (vu.questionsReussies !== questionsReussies) {
    setVu({ questionsReussies, rangQuiArrive: questionsReussies > vu.questionsReussies ? questionsReussies - 1 : undefined });
  }
  return vu.rangQuiArrive;
}

function Point({ reussi, arrive }: { readonly reussi: boolean; readonly arrive: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mouvementsReduits = useReducedMotion();
  const [envol, setEnvol] = useState(false);

  useEffect(() => {
    if (!arrive || !ref.current || mouvementsReduits) return;
    setEnvol(true);
    const vol = animate(
      ref.current,
      { y: [DEPART_DU_POINT_EN_PX, 0], scale: [2, 1], opacity: [0.4, 1] },
      { type: "spring", visualDuration: 0.4, bounce: 0.25 },
    );
    void vol.then(() => setEnvol(false));
    return () => vol.cancel();
  }, [arrive]);

  return (
    <span
      ref={ref}
      className="point"
      data-testid="point"
      data-reussi={reussi ? "true" : "false"}
      data-point-qui-vole={envol ? "true" : undefined}
    />
  );
}
