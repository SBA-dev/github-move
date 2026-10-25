import type { Avancement } from "@domain/apprentissage";

type Props = {
  readonly avancement: Avancement;
  /** Ce que lit un lecteur d'écran : « Avancement de la séance » par défaut. */
  readonly libelle?: string;
};

export function RecipientDeProgression({ avancement, libelle = "Avancement de la séance" }: Props) {
  const { questionsReussies, total } = avancement;
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
          <span key={rang} className="point" data-testid="point" data-reussi={rang < questionsReussies ? "true" : "false"} />
        ))}
      </div>
      <span className="compte" aria-hidden="true">{questionsReussies} / {total}</span>
    </div>
  );
}
