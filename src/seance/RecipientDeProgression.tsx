import type { Avancement } from "@domain/apprentissage";

export function RecipientDeProgression({ avancement }: { readonly avancement: Avancement }) {
  const { questionsReussies, total } = avancement;
  return (
    <div
      className="recipient"
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
