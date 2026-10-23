import { useCallback, useRef, useState } from "react";
import { HUMEUR_PAR_DEFAUT, type Humeur } from "@domain/motivation";
import type { Voix } from "../voix/index.ts";

export type NatureDeParole =
  | "accueil"
  | "etape"
  | "invitation"
  | "annonce"
  | "consigne"
  | "question"
  | "introduction"
  | "felicitation"
  | "encouragement"
  | "aide";

export type ParoleADire = {
  readonly texte: string;
  readonly nature: NatureDeParole;
  /** Ce que la voix prononce, quand ce n'est pas exactement le texte affiché (les exemples d'une étape de leçon). */
  readonly aLire?: string;
  readonly humeur?: Humeur;
};

/** La bulle du personnage guide : la phrase affichée, le mot prononcé et l'humeur. */
export function usePersonnageQuiParle({ lire, couperLaVoix }: Pick<Voix, "lire" | "couperLaVoix">) {
  const [parole, setParole] = useState<ParoleADire | undefined>();
  const [rangDuMotPrononce, setRangDuMotPrononce] = useState<number | undefined>();
  const [humeur, setHumeur] = useState<Humeur>(HUMEUR_PAR_DEFAUT);
  const derniereLecture = useRef(0);
  const derniereParole = useRef<ParoleADire | undefined>(undefined);

  /** Rend `true` si la phrase est allée jusqu'au bout, `false` si une autre parole ou le silence l'a interrompue. */
  const dire = useCallback(async (aDire: ParoleADire): Promise<boolean> => {
    const numero = ++derniereLecture.current;
    const estLaDerniere = () => numero === derniereLecture.current;
    derniereParole.current = aDire;
    setParole(aDire);
    setHumeur(aDire.humeur ?? HUMEUR_PAR_DEFAUT);
    setRangDuMotPrononce(undefined);
    await lire(aDire.aLire ?? aDire.texte, {
      onMot: (rang) => estLaDerniere() && setRangDuMotPrononce(rang),
      onFin: () => estLaDerniere() && setRangDuMotPrononce(undefined),
    });
    return estLaDerniere();
  }, [lire]);

  const reecouter = useCallback(() => {
    if (derniereParole.current) void dire(derniereParole.current);
  }, [dire]);

  const faireSilence = useCallback(() => {
    derniereLecture.current++;
    couperLaVoix();
  }, [couperLaVoix]);

  return { parole, rangDuMotPrononce, humeur, dire, reecouter, faireSilence };
}
