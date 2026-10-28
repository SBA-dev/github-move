import type { CorrectionDuMot, QuestionDeDictee } from "@domain/apprentissage";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, useRetourDe } from "../../retours/index.ts";

type Props = {
  readonly question: QuestionDeDictee;
  /** Juste après une faute : le début juste et les lettres fausses, ces dernières en rouge. */
  readonly lettresFausses: CorrectionDuMot | undefined;
};

type LettreDeLaCase = { readonly lettre: string | undefined; readonly fausse: boolean; readonly montree: boolean };

function lettreDeLaCase(rang: number, ecrite: string | undefined, montree: boolean, correction: CorrectionDuMot | undefined): LettreDeLaCase {
  if (correction === undefined) return { lettre: ecrite, fausse: false, montree };
  const gardee = correction.lettresGardees[rang];
  if (gardee !== undefined) return { lettre: gardee, fausse: false, montree: false };
  const fausse = correction.lettresFausses.find(({ position }) => position === rang);
  return { lettre: fausse?.lettre, fausse: fausse !== undefined, montree: false };
}

function etatDeLaCase({ lettre, fausse, montree }: LettreDeLaCase): string {
  if (fausse) return "fausse";
  if (montree) return "montree";
  return lettre === undefined ? "vide" : "ecrite";
}

function descriptionDeLaCase(rang: number, { lettre, fausse, montree }: LettreDeLaCase): string {
  if (lettre === undefined) return `Case ${rang + 1}, vide`;
  return `Case ${rang + 1} : ${lettre}${fausse ? ", fausse" : ""}${montree ? ", lettre montrée par le personnage guide" : ""}`;
}

/** Une case par lettre à écrire ; espaces, apostrophes, tirets et points sont déjà écrits. Le mot n'apparaît que lettre après lettre. */
export function CasesDeLaDictee({ question, lettresFausses }: Props) {
  let rang = 0;
  const retour = useRetourDe<HTMLOListElement>(CIBLE_DE_LA_ZONE_DE_REPONSE);
  return (
    <ol ref={retour.ref} {...retour.attributs} className="mot-a-ecrire" aria-label="Mot à écrire" data-testid="mot-a-ecrire">
      {question.cases().map((une, position) => {
        if (une.genre === "dejaEcrit") {
          return <li key={position} className="caractere-deja-ecrit" data-testid="caractere-deja-ecrit">{une.caractere}</li>;
        }
        const rangDeLaCase = rang++;
        const contenu = lettreDeLaCase(rangDeLaCase, une.lettre, une.montree === true, lettresFausses);
        return (
          <li
            key={position}
            className="case-a-ecrire"
            data-testid="case-a-ecrire"
            data-etat={etatDeLaCase(contenu)}
            aria-label={descriptionDeLaCase(rangDeLaCase, contenu)}
          >
            {contenu.lettre}
          </li>
        );
      })}
    </ol>
  );
}
