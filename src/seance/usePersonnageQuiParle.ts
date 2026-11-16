import { useCallback, useEffect, useRef, useState } from "react";
import { attenteAvantLEcranSuivant } from "@domain/apprentissage";
import { HUMEUR_PAR_DEFAUT, type Humeur } from "@domain/motivation";
import type { EffetSonore } from "@domain/voix";
import type { Voix } from "../voix/index.ts";
import { attendre } from "./exercices/attendre.ts";

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

/** Les paroles qui posent la question : tout le reste (félicitation, encouragement, aide, annonce, étape…) est le personnage guide qui réagit. */
const NATURES_DE_LA_QUESTION: readonly NatureDeParole[] = ["consigne", "question", "dictee"];

export const estUneReactionDuPersonnageGuide = (nature: NatureDeParole | undefined) =>
  nature !== undefined && !NATURES_DE_LA_QUESTION.includes(nature);

export type ParoleADire = {
  readonly texte: string;
  readonly nature: NatureDeParole;
  /** Ce que la voix prononce, quand ce n'est pas exactement le texte affiché (les exemples d'une étape de leçon). */
  readonly aLire?: string;
  readonly humeur?: Humeur;
  /** Effets sonores joués avant la parole, qui n'est dite qu'une fois ces effets terminés. */
  readonly effetsAvant?: readonly EffetSonore[];
};

/**
 * Durée pendant laquelle le personnage guide reste montré quand il réagit par un geste, sans rien dire.
 * Volontairement indépendante de `PAUSE_DES_APPLAUDISSEMENTS_MS` : elle règle le geste muet seul, pas la pause laissée aux applaudissements dans les questions à choix.
 */
const DUREE_DU_GESTE_MUET_MS = 1500;

async function attendreLaFinDeLAffichage(entendue: boolean) {
  const attente = attenteAvantLEcranSuivant({ entendue, seanceTerminee: false });
  if (attente.genre === "dureeDAffichageSansVoix") await attendre(attente.millisecondes);
}

/** La bulle du personnage guide : la phrase affichée, le mot prononcé et l'humeur. */
export function usePersonnageQuiParle({ lire, jouer, couperLaVoix }: Pick<Voix, "lire" | "jouer" | "couperLaVoix">) {
  const [parole, setParole] = useState<ParoleADire | undefined>();
  const [rangDuMotPrononce, setRangDuMotPrononce] = useState<number | undefined>();
  const [humeur, setHumeur] = useState<Humeur>(HUMEUR_PAR_DEFAUT);
  /** Vrai de la prise de parole jusqu'à la fin de la voix ; sans voix entendue, jusqu'à la durée d'affichage. */
  const [enParole, setEnParole] = useState(false);
  /** Vrai le temps d'un geste sans parole (il applaudit en silence) : le personnage guide est montré quand même. */
  const [gesteMuet, setGesteMuet] = useState(false);
  const numeroDuGeste = useRef(0);
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
    setEnParole(true);
    numeroDuGeste.current++;
    setGesteMuet(false);
    setHumeur(aDire.humeur ?? HUMEUR_PAR_DEFAUT);
    setRangDuMotPrononce(undefined);
    const { entendue } = await lire(aDire.aLire ?? aDire.texte, {
      onMot: (rang) => estLaDerniere() && setRangDuMotPrononce(rang),
      onFin: () => estLaDerniere() && setRangDuMotPrononce(undefined),
      ...(aDire.effetsAvant ? { effetsAvant: aDire.effetsAvant } : {}),
    });
    if (estLaDerniere()) {
      paroleEntendue.current = entendue;
      void attendreLaFinDeLAffichage(entendue).then(() => estLaDerniere() && setEnParole(false));
    }
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
  const montrerHumeur = useCallback((nouvelleHumeur: Humeur) => {
    const numero = ++numeroDuGeste.current;
    setHumeur(nouvelleHumeur);
    setGesteMuet(true);
    void attendre(DUREE_DU_GESTE_MUET_MS).then(() => numero === numeroDuGeste.current && setGesteMuet(false));
  }, []);

  useEffect(() => () => {
    numeroDuGeste.current++;
  }, []);

  const faireSilence = useCallback(() => {
    derniereLecture.current++;
    numeroDuGeste.current++;
    setEnParole(false);
    setGesteMuet(false);
    paroleEntendue.current = true;
    couperLaVoix();
  }, [couperLaVoix]);

  return { parole, enParole, gesteMuet, rangDuMotPrononce, humeur, paroleEntendue, dire, jouer, reecouter, faireSilence, montrerHumeur, montrer };
}
