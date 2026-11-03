import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import type { CorrectionDuMot, QuestionDeDictee } from "@domain/apprentissage";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, useRetourDe } from "../../retours/index.ts";
import { useMouvementsReduits } from "../../transitions/mouvements-reduits.ts";
import { useUnivers } from "../../univers/index.ts";
import { DessinDeLUnivers } from "./claviers/DessinDeLUnivers.tsx";
import { dessinDeLaCase, type EtatDeLaCase } from "./claviers/dessins-des-claviers.ts";

/** Le mot juste s'illumine case après case, en 400 ms au plus quelle que soit sa longueur. */
const DUREE_DE_L_ILLUMINATION_MS = 400;

type Props = {
  readonly question: QuestionDeDictee;
  /** Juste après une faute : le début juste et les lettres fausses, ces dernières en rouge. */
  readonly lettresFausses: CorrectionDuMot | undefined;
  /** Le mot est juste : les cases s'illuminent, la première d'abord. */
  readonly illuminee: boolean;
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

/** Combien de cases sont illuminées : une de plus à chaque minuteur, ou toutes d'un coup avec les mouvements réduits. */
function useCasesIlluminees(illuminee: boolean, nombreDeCases: number): number {
  const mouvementsReduits = useMouvementsReduits();
  const [illuminees, setIlluminees] = useState(0);
  useEffect(() => {
    if (!illuminee) {
      setIlluminees(0);
      return;
    }
    if (mouvementsReduits) {
      setIlluminees(nombreDeCases);
      return;
    }
    const pas = DUREE_DE_L_ILLUMINATION_MS / nombreDeCases;
    const minuteries = Array.from(
      { length: nombreDeCases },
      (_, rang) => setTimeout(() => flushSync(() => setIlluminees(rang + 1)), rang * pas),
    );
    return () => minuteries.forEach(clearTimeout);
  }, [illuminee, mouvementsReduits, nombreDeCases]);
  return illuminees;
}

function etatDuDessin(etat: string, illuminee: boolean): EtatDeLaCase {
  if (illuminee) return "illuminee";
  return etat === "ecrite" ? "allumee" : "vide";
}

/** Une case par lettre à écrire ; espaces, apostrophes, tirets et points sont déjà écrits. Le mot n'apparaît que lettre après lettre. */
export function CasesDeLaDictee({ question, lettresFausses, illuminee }: Props) {
  let rang = 0;
  const univers = useUnivers();
  const nombreDeCases = question.cases().filter((une) => une.genre !== "dejaEcrit").length;
  const casesIlluminees = useCasesIlluminees(illuminee, nombreDeCases);
  const retour = useRetourDe<HTMLOListElement>(CIBLE_DE_LA_ZONE_DE_REPONSE);
  return (
    <ol ref={retour.ref} {...retour.attributs} className="mot-a-ecrire" aria-label="Mot à écrire" data-testid="mot-a-ecrire">
      {question.cases().map((une, position) => {
        if (une.genre === "dejaEcrit") {
          return <li key={position} className="caractere-deja-ecrit" data-testid="caractere-deja-ecrit">{une.caractere}</li>;
        }
        const rangDeLaCase = rang++;
        const contenu = lettreDeLaCase(rangDeLaCase, une.lettre, une.montree === true, lettresFausses);
        const etat = etatDeLaCase(contenu);
        const estIlluminee = rangDeLaCase < casesIlluminees;
        return (
          <li
            key={position}
            className="case-a-ecrire"
            data-testid="case-a-ecrire"
            data-etat={etat}
            data-univers={univers}
            data-allumee={etat === "ecrite" ? "true" : undefined}
            data-illuminee={estIlluminee ? "true" : undefined}
            aria-label={descriptionDeLaCase(rangDeLaCase, contenu)}
          >
            <DessinDeLUnivers identifiant="dessin-de-la-case" contenu={dessinDeLaCase(univers, etatDuDessin(etat, estIlluminee))} />
            <span className="lettre-de-la-case">{contenu.lettre}</span>
          </li>
        );
      })}
    </ol>
  );
}
