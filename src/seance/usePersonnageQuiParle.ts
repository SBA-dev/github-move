import { useCallback, useRef, useState } from "react";
import { HUMEUR_PAR_DEFAUT, type Humeur } from "@domain/motivation";
import type { EffetSonore } from "@domain/voix";
import type { Voix } from "../voix/index.ts";

export type NatureDeParole =
  | "accueil"
  | "etape"
  | "invitation"
  | "annonce"
  | "consigne"
  | "dictee"
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
  /** Effets sonores joués avant la parole, qui n'est dite qu'une fois ces effets terminés. */
  readonly effetsAvant?: readonly EffetSonore[];
};

/** La bulle du personnage guide : la phrase affichée, le mot prononcé et l'humeur. */
export function usePersonnageQuiParle({ lire, jouer, couperLaVoix }: Pick<Voix, "lire" | "jouer" | "couperLaVoix">) {
  const [parole, setParole] = useState<ParoleADire | undefined>();
  const [rangDuMotPrononce, setRangDuMotPrononce] = useState<number | undefined>();
  const [humeur, setHumeur] = useState<Humeur>(HUMEUR_PAR_DEFAUT);
  const derniereLecture = useRef(0);
  const derniereParole = useRef<ParoleADire | undefined>(undefined);
  /** Vrai tant que la dernière parole a été entendue, ou qu'il n'y en a pas eu : le silence ne prive l'enfant de rien. */
  const paroleEntendue = useRef(true);

  /** Rend `true` si la phrase est allée jusqu'au bout, `false` si une autre parole ou le silence l'a interrompue. */
  const dire = useCallback(async (aDire: ParoleADire): Promise<boolean> => {
    const numero = ++derniereLecture.current;
    const estLaDerniere = () => numero === derniereLecture.current;
    derniereParole.current = aDire;
    setParole(aDire);
    setHumeur(aDire.humeur ?? HUMEUR_PAR_DEFAUT);
    setRangDuMotPrononce(undefined);
    const { entendue } = await lire(aDire.aLire ?? aDire.texte, {
      onMot: (rang) => estLaDerniere() && setRangDuMotPrononce(rang),
      onFin: () => estLaDerniere() && setRangDuMotPrononce(undefined),
      ...(aDire.effetsAvant ? { effetsAvant: aDire.effetsAvant } : {}),
    });
    if (estLaDerniere()) paroleEntendue.current = entendue;
    return estLaDerniere();
  }, [lire]);

  /** Affiche la phrase dans la bulle sans la dire : la voix la dira plus tard, ou pas. */
  const montrer = useCallback((aMontrer: ParoleADire) => {
    derniereParole.current = aMontrer;
    setParole(aMontrer);
  }, []);

  const reecouter = useCallback(() => {
    if (derniereParole.current) void dire(derniereParole.current);
  }, [dire]);

  /** Change seulement l'humeur : le personnage guide réagit sans rien dire. */
  const montrerHumeur = useCallback((nouvelleHumeur: Humeur) => setHumeur(nouvelleHumeur), []);

  const faireSilence = useCallback(() => {
    derniereLecture.current++;
    paroleEntendue.current = true;
    couperLaVoix();
  }, [couperLaVoix]);

  return { parole, rangDuMotPrononce, humeur, paroleEntendue, dire, jouer, reecouter, faireSilence, montrerHumeur, montrer };
}
