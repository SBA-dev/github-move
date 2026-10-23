import { useCallback, useRef, useState } from "react";
import type { Voix } from "../voix/index.ts";

type MotPrononce = { readonly texteAffiche: string; readonly rang: number };

/** Lit une phrase à voix haute et suit le mot prononcé. Une lecture plus récente ou coupée rend la précédente caduque. */
export function useParoleLue({ lire, couperLaVoix }: Pick<Voix, "lire" | "couperLaVoix">) {
  const derniereLecture = useRef(0);
  const [motPrononce, setMotPrononce] = useState<MotPrononce | undefined>();

  const lireLaParole = useCallback(async (aLire: string, texteAffiche: string = aLire): Promise<boolean> => {
    const numero = ++derniereLecture.current;
    const estLaDerniere = () => numero === derniereLecture.current;
    setMotPrononce(undefined);
    await lire(aLire, {
      onMot: (rang) => estLaDerniere() && setMotPrononce({ texteAffiche, rang }),
      onFin: () => estLaDerniere() && setMotPrononce(undefined),
    });
    return estLaDerniere();
  }, [lire]);

  const arreter = useCallback(() => {
    derniereLecture.current++;
    setMotPrononce(undefined);
    couperLaVoix();
  }, [couperLaVoix]);

  const rangDuMotPrononceDans = (texteAffiche: string): number | undefined =>
    motPrononce?.texteAffiche === texteAffiche ? motPrononce.rang : undefined;

  return { lireLaParole, arreter, rangDuMotPrononceDans };
}

export type ParoleLue = ReturnType<typeof useParoleLue>;
