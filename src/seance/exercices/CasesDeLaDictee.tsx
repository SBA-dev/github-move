import type { CorrectionDuMot, QuestionDeDictee } from "@domain/apprentissage";

type Props = {
  readonly question: QuestionDeDictee;
  /** Juste après une faute : le début juste et les lettres fausses, ces dernières en rouge. */
  readonly lettresFausses: CorrectionDuMot | undefined;
};

type LettreDeLaCase = { readonly lettre: string | undefined; readonly fausse: boolean };

function lettreDeLaCase(rang: number, ecrite: string | undefined, correction: CorrectionDuMot | undefined): LettreDeLaCase {
  if (correction === undefined) return { lettre: ecrite, fausse: false };
  const gardee = correction.lettresGardees[rang];
  if (gardee !== undefined) return { lettre: gardee, fausse: false };
  const fausse = correction.lettresFausses.find(({ position }) => position === rang);
  return { lettre: fausse?.lettre, fausse: fausse !== undefined };
}

function descriptionDeLaCase(rang: number, { lettre, fausse }: LettreDeLaCase): string {
  if (lettre === undefined) return `Case ${rang + 1}, vide`;
  return `Case ${rang + 1} : ${lettre}${fausse ? ", fausse" : ""}`;
}

/** Une case par lettre à écrire ; espaces, apostrophes, tirets et points sont déjà écrits. Le mot n'apparaît que lettre après lettre. */
export function CasesDeLaDictee({ question, lettresFausses }: Props) {
  let rang = 0;
  return (
    <ol className="mot-a-ecrire" aria-label="Mot à écrire" data-testid="mot-a-ecrire">
      {question.cases().map((une, position) => {
        if (une.genre === "dejaEcrit") {
          return <li key={position} className="caractere-deja-ecrit" data-testid="caractere-deja-ecrit">{une.caractere}</li>;
        }
        const rangDeLaCase = rang++;
        const contenu = lettreDeLaCase(rangDeLaCase, une.lettre, lettresFausses);
        return (
          <li
            key={position}
            className="case-a-ecrire"
            data-testid="case-a-ecrire"
            data-etat={contenu.fausse ? "fausse" : contenu.lettre === undefined ? "vide" : "ecrite"}
            aria-label={descriptionDeLaCase(rangDeLaCase, contenu)}
          >
            {contenu.lettre}
          </li>
        );
      })}
    </ol>
  );
}
