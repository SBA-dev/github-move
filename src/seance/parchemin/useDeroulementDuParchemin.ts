import { useEffect, useState } from "react";
import { useMouvementsReduits } from "../../transitions/mouvements-reduits.ts";

export type Deroule = "roule" | "en-cours" | "ouvert";

/** Si aucun mot n'est signalé dans ce délai après le début du texte, la voix ne les signalera sans doute pas : tout s'ouvre. */
const DELAI_SANS_MOT_SIGNALE_MS = 2_000;

type Entree = {
  /** Le rang de la dernière phrase (ou du dernier vers) commencée : elle et celles d'avant sont dévoilées. */
  readonly rangCommence: number | undefined;
  /** Le texte est en train d'être lu à voix haute (après la présentation) : le délai sans mot signalé court. */
  readonly texteEnLecture: boolean;
  /** Plus rien à attendre de la voix : lecture finie, texte écouté, voix coupée, bloquée ou absente. */
  readonly toutOuvrir: boolean;
};

/**
 * Où en est le parchemin : roulé (rien n'est dévoilé), en cours (jusqu'à la phrase commencée) ou ouvert (tout).
 * Un dévoilement ne se défait jamais, même si la voix relit.
 */
export function useDeroulementDuParchemin({ rangCommence, texteEnLecture, toutOuvrir }: Entree) {
  const mouvementsReduits = useMouvementsReduits();
  const [ouvert, setOuvert] = useState(false);
  const [rangDevoile, setRangDevoile] = useState(-1);
  const ouvertMaintenant = ouvert || toutOuvrir || mouvementsReduits;
  if (ouvertMaintenant && !ouvert) setOuvert(true);
  if (rangCommence !== undefined && rangCommence > rangDevoile) setRangDevoile(rangCommence);
  const rangAffiche = Math.max(rangDevoile, rangCommence ?? -1);

  useEffect(() => {
    if (!texteEnLecture || ouvertMaintenant || rangAffiche >= 0) return;
    const delai = setTimeout(() => setOuvert(true), DELAI_SANS_MOT_SIGNALE_MS);
    return () => clearTimeout(delai);
  }, [texteEnLecture, ouvertMaintenant, rangAffiche]);

  const deroule: Deroule = ouvertMaintenant ? "ouvert" : rangAffiche >= 0 ? "en-cours" : "roule";
  return { deroule, devoilee: (rang: number) => ouvertMaintenant || rang <= rangAffiche };
}
