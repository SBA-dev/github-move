import type { Avancement } from "@domain/apprentissage";

export function Recipient({ avancement }: { readonly avancement: Avancement }) {
  const { questionsReussies, total } = avancement;
  const remplissage = total === 0 ? 0 : Math.round((questionsReussies / total) * 100);
  return (
    <div className="avancement" data-testid="avancement" data-questions-reussies={questionsReussies} data-total={total}>
      <div className="recipient" aria-hidden="true">
        <div className="recipient-niveau" style={{ width: `${remplissage}%` }} />
      </div>
      <p className="avancement-texte" aria-hidden="true">{questionsReussies} / {total}</p>
      <p className="lecteurs-d-ecran" role="status" aria-live="polite">
        {questionsReussies > 0 && `${questionsReussies} sur ${total}`}
      </p>
    </div>
  );
}
