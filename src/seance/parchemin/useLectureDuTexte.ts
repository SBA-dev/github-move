import { type MutableRefObject, useCallback, useRef, useState } from "react";
import { INTRODUCTION_DE_LA_LECTURE } from "@domain/apprentissage";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import type { LectureDuTexte } from "./LectureDuTexte.ts";

type Dependances = {
  readonly lire: Voix["lire"];
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly faireSilence: () => void;
  /** Numéro de la séquence en cours : une action plus récente interrompt les suites en attente. */
  readonly sequence: MutableRefObject<number>;
};

/**
 * La lecture à voix haute d'un texte : l'introduction, puis le texte mot à mot.
 * Une lecture interrompue autrement que par une relance est finie : rien ne reste roulé sans voix.
 */
export function useLectureDuTexte({ lire, dire, faireSilence, sequence }: Dependances) {
  const [rangDuMotDuTexte, setRangDuMotDuTexte] = useState<number | undefined>();
  const [lectureDuTexte, setLectureDuTexte] = useState<LectureDuTexte>("avant");
  const texteEnLecture = useRef<string | undefined>(undefined);
  const numeroDeLecture = useRef(0);

  const avantLaLecture = useCallback(() => {
    numeroDeLecture.current++;
    texteEnLecture.current = undefined;
    setLectureDuTexte("avant");
    setRangDuMotDuTexte(undefined);
  }, []);

  const lireLeTexte = useCallback(async (numero: number, texte: string) => {
    const lecture = ++numeroDeLecture.current;
    texteEnLecture.current = texte;
    const estLaDerniere = () => numero === sequence.current;
    const terminer = () => {
      if (lecture !== numeroDeLecture.current) return;
      texteEnLecture.current = undefined;
      setLectureDuTexte("finie");
      setRangDuMotDuTexte(undefined);
    };
    if (!(await dire({ texte: INTRODUCTION_DE_LA_LECTURE, nature: "introduction" }))) return terminer();
    setLectureDuTexte("en-cours");
    await lire(texte, {
      onMot: (rang) => estLaDerniere() && setRangDuMotDuTexte(rang),
      onFin: () => estLaDerniere() && setRangDuMotDuTexte(undefined),
    });
    terminer();
  }, [dire, lire, sequence]);

  /** « Réécouter » avant la fin du texte relance la lecture complète. Rend `false` si le texte n'est pas en lecture. */
  const relireLeTexte = useCallback(() => {
    const texte = texteEnLecture.current;
    if (texte === undefined) return false;
    const numero = ++sequence.current;
    faireSilence();
    setRangDuMotDuTexte(undefined);
    void lireLeTexte(numero, texte);
    return true;
  }, [sequence, faireSilence, lireLeTexte]);

  const effacerLeRang = useCallback(() => setRangDuMotDuTexte(undefined), []);

  return { rangDuMotDuTexte, lectureDuTexte, avantLaLecture, lireLeTexte, relireLeTexte, effacerLeRang };
}
