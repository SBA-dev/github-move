import { type ReactNode, useId, useState } from "react";

type Props = {
  readonly titre: string;
  readonly children: ReactNode;
};

/** Un bloc du suivi, replié à l'ouverture : le bouton porte le titre et dit s'il est déplié. */
export function BlocReplie({ titre, children }: Props) {
  const [deplie, setDeplie] = useState(false);
  const contenu = useId();
  return (
    <div className="bloc-replie">
      <h4>
        <button
          type="button"
          className="secondaire bouton-du-bloc"
          aria-expanded={deplie}
          aria-controls={contenu}
          onClick={() => setDeplie((ouvert) => !ouvert)}
        >
          {titre}
        </button>
      </h4>
      <div id={contenu} hidden={!deplie}>{children}</div>
    </div>
  );
}
