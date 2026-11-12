import type { EtatDuSon } from "@domain/voix";

type Props = {
  readonly son: EtatDuSon;
  readonly onBasculer: () => void;
};

/** Le seul bouton Son / Muet de l'application : l'en-tête et la barre du haut de la séance le partagent. */
export function BoutonSon({ son, onBasculer }: Props) {
  return (
    <button type="button" aria-label="Son" aria-pressed={son === "son"} data-son={son} data-bascule-du-son="true" onClick={onBasculer}>
      <span aria-hidden="true">{son === "son" ? "🔊" : "🔇"}</span> Son
    </button>
  );
}
