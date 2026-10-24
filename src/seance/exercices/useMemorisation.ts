import { type MutableRefObject, useCallback, useRef, useState } from "react";
import {
  annonceDeLEcoute,
  indicationDuGeste,
  invitationApresLeDernierVers,
  PlanDeMemorisation,
  type Seance,
} from "@domain/apprentissage";
import type { ExerciceMemoriser, Lecon } from "@domain/catalogue";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import { attendre } from "./attendre.ts";

type Dependances = {
  readonly seance: Seance;
  readonly lecon: Lecon;
  readonly lire: Voix["lire"];
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly sequence: MutableRefObject<number>;
  readonly redessiner: () => void;
  /** Présente la question en cours des mots cachés (comme pour un exercice à trous). */
  readonly presenterUneQuestion: (numero: number) => Promise<void>;
};

/** Les trois temps d'une poésie : écouter vers par vers, redire seul (« Je suis prêt »), puis s'entraîner. */
export type TempsDeLaMemorisation = "ecoute" | "redire" | "entrainement";

export type VersLu = { readonly rang: number; readonly rangDuMot: number | undefined };

const PAUSE_ENTRE_DEUX_VERS_MS = 250;

/** Le déroulé de l'exercice « memoriser » : le personnage guide dit la poésie, puis lance les deux entraînements. */
export function useMemorisation(
  { seance, lecon, lire, dire, sequence, redessiner, presenterUneQuestion }: Dependances,
) {
  const [versLu, setVersLu] = useState<VersLu | undefined>();
  const motsCachesAnnonces = useRef(false);
  const temps = useRef<{ readonly position: number; readonly temps: TempsDeLaMemorisation } | undefined>(undefined);

  const changerDeTemps = useCallback((position: number, nouveau: TempsDeLaMemorisation) => {
    temps.current = { position, temps: nouveau };
    redessiner();
  }, [redessiner]);

  const exerciceEnCours = useCallback((): { position: number; exercice: ExerciceMemoriser } | undefined => {
    const position = seance.exerciceEnCours()?.position;
    const exercice = position === undefined ? undefined : lecon.exercices[position];
    return position !== undefined && exercice?.type === "memoriser" ? { position, exercice } : undefined;
  }, [seance, lecon]);

  const lireLesVers = useCallback(async (numero: number, vers: readonly string[]) => {
    const estLaDerniere = () => numero === sequence.current;
    for (const [rang, unVers] of vers.entries()) {
      setVersLu({ rang, rangDuMot: undefined });
      await lire(unVers, {
        onMot: (rangDuMot) => estLaDerniere() && setVersLu({ rang, rangDuMot }),
      });
      if (!estLaDerniere()) return false;
      await attendre(PAUSE_ENTRE_DEUX_VERS_MS);
      if (!estLaDerniere()) return false;
    }
    setVersLu(undefined);
    return true;
  }, [lire, sequence]);

  const ecouter = useCallback(async (numero: number) => {
    const courant = exerciceEnCours();
    if (!courant) return;
    changerDeTemps(courant.position, "ecoute");
    if (!(await dire({ texte: annonceDeLEcoute(courant.exercice), nature: "introduction" }))) return;
    if (!(await lireLesVers(numero, courant.exercice.vers))) return;
    changerDeTemps(courant.position, "redire");
    await dire({ texte: invitationApresLeDernierVers(courant.exercice), nature: "invitation" });
  }, [exerciceEnCours, changerDeTemps, dire, lireLesVers]);

  const direLaConsigneDeLOrdre = useCallback(async (exercice: ExerciceMemoriser) => {
    const { consigne } = PlanDeMemorisation.de(exercice).ordreDesVers;
    if (!(await dire({ texte: consigne, nature: "consigne" }))) return;
    const indication = indicationDuGeste("memoriser");
    if (indication) await dire({ texte: indication, nature: "consigne" });
  }, [dire]);

  const jeSuisPret = useCallback(async () => {
    const courant = exerciceEnCours();
    if (!courant) return;
    sequence.current++;
    motsCachesAnnonces.current = false;
    changerDeTemps(courant.position, "entrainement");
    await direLaConsigneDeLOrdre(courant.exercice);
  }, [exerciceEnCours, sequence, changerDeTemps, direLaConsigneDeLOrdre]);

  /** Quand le dernier vers est remis en place, les mots cachés commencent : une seule fois, après la consigne. */
  const apresUnPlacement = useCallback(async () => {
    const courant = exerciceEnCours();
    const motsCaches = seance.exerciceEnCours()?.entrainementDeMemorisation() === "motsCaches";
    if (!courant || !motsCaches || temps.current?.temps !== "entrainement" || motsCachesAnnonces.current) return;
    motsCachesAnnonces.current = true;
    const numero = ++sequence.current;
    const { consigne } = PlanDeMemorisation.de(courant.exercice).motsCaches;
    if (await dire({ texte: consigne, nature: "consigne" })) await presenterUneQuestion(numero);
  }, [exerciceEnCours, seance, sequence, dire, presenterUneQuestion]);

  /** « Réécouter » pendant l'écoute reprend la poésie au premier vers ; sinon c'est la dernière parole qui est relue. */
  const reecouter = useCallback((): boolean => {
    if (!exerciceEnCours() || temps.current?.temps !== "ecoute") return false;
    void ecouter(++sequence.current);
    return true;
  }, [exerciceEnCours, ecouter, sequence]);

  const tempsDe = (position: number): TempsDeLaMemorisation =>
    temps.current?.position === position ? temps.current.temps : "ecoute";

  return { presenter: ecouter, jeSuisPret, apresUnPlacement, reecouter, versLu, tempsDe };
}
