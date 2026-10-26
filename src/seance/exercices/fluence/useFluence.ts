import { type MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { type FluenceEnCours, RecordDeFluence, Reponse, type Seance } from "@domain/apprentissage";
import {
  accueilDeLaFluence,
  type FinDeFluence,
  humeurApresReponse,
  parolesDeFinDeFluence,
  SIGNAL_DE_DEPART,
} from "@domain/motivation";
import type { Horloge } from "../../horloge.ts";
import type { ParoleADire } from "../../usePersonnageQuiParle.ts";
import type { SuiteDuCalcul } from "../useCalcul.ts";
import type { QuestionFigee } from "../useQuestionFigee.ts";
import { lireLeRecordDeFluence } from "./lecture-du-record-supabase.ts";

const BATTEMENT_EN_MS = 250;

type Dependances = {
  readonly seance: Seance;
  readonly horloge: Horloge;
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly faireSilence: () => void;
  readonly sequence: MutableRefObject<number>;
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

/** Ce que Noisette dit à la fin : le score, puis l'issue du record. L'issue se calcule dans le domaine. */
function finDeFluence(seance: Seance, exercice: string, score: number, recordConnu: number | undefined) {
  const record = RecordDeFluence.reconstituer({
    enfant: seance.enfant,
    lecon: seance.lecon,
    exercice,
    ...(recordConnu === undefined ? {} : { meilleurScore: recordConnu }),
  });
  const issue = record.proposer(score);
  const meilleurScore = record.meilleurScore;
  if (issue === "recordInchange") {
    if (meilleurScore === undefined) throw new Error("Un record inchangé suppose un record connu");
    return { texte: parolesDeFinDeFluence({ score, issue, record: meilleurScore }), meilleurScore };
  }
  const fin: FinDeFluence = { score, issue };
  return { texte: parolesDeFinDeFluence(fin), meilleurScore };
}

/** Le déroulé d'une fluence : l'accueil et le record, le signal de départ, le temps qui passe, puis la phrase de fin. */
export function useFluence(
  { seance, horloge, dire, faireSilence, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  const [record, setRecord] = useState<number | undefined>();
  const [demarree, setDemarree] = useState(false);
  /** La fluence finie, montrée telle quelle le temps de dire sa phrase de fin. */
  const [fluenceFinie, setFluenceFinie] = useState<FluenceEnCours | undefined>();
  const derniereSeconde = useRef<number | undefined>(undefined);
  /** Les paroles de fin de la fluence, gardées pour que l'écran de fin d'une fluence seule y ajoute les nouveautés. */
  const parolesDeFin = useRef<string | undefined>(undefined);

  const presenter = useCallback(async () => {
    const nom = seance.exerciceEnCours()?.scoreDeFluence()?.nom;
    const fluence = seance.fluenceEnCours(horloge.maintenant());
    if (nom === undefined || !fluence || fluence.demarree) return;
    const recordLu = await lireLeRecordDeFluence(seance.enfant, seance.lecon, nom);
    if (!vivant.current) return;
    setRecord(recordLu);
    await dire({ texte: accueilDeLaFluence({ duree: fluence.tempsRestant, ...(recordLu === undefined ? {} : { record: recordLu }) }), nature: "annonce" });
  }, [seance, horloge, vivant, dire]);

  const demarrer = useCallback(() => {
    const fluence = seance.fluenceEnCours(horloge.maintenant());
    if (!fluence || fluence.demarree || estFigee.current) return;
    sequence.current++;
    faireSilence();
    seance.demarrerLaFluence(horloge.maintenant());
    setDemarree(true);
    redessiner();
    void dire({ texte: SIGNAL_DE_DEPART, nature: "annonce" });
  }, [seance, horloge, estFigee, sequence, faireSilence, redessiner, dire]);

  const terminer = useCallback(async (suite: SuiteDuCalcul) => {
    const maintenant = horloge.maintenant();
    const exercice = seance.exerciceEnCours();
    const fluence = seance.fluenceEnCours(maintenant);
    const nom = exercice?.scoreDeFluence()?.nom;
    if (!exercice || !fluence || nom === undefined || estFigee.current) return;
    figer({ position: exercice.position, exercice, question: undefined });
    setFluenceFinie({ ...fluence, tempsRestant: 0, finie: true });
    setDemarree(false);
    seance.finirLaFluence();
    sequence.current++;
    faireSilence();
    annoncerLAvancement(seance.avancement());
    const fin = finDeFluence(seance, nom, fluence.score, record);
    setRecord(fin.meilleurScore);
    parolesDeFin.current = fin.texte;
    await dire({ texte: fin.texte, nature: "felicitation", humeur: humeurApresReponse(fluence.score > 0) });
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    setFluenceFinie(undefined);
    await suite(++sequence.current, seance.retirerFaits(), true);
  }, [seance, horloge, record, estFigee, figer, sequence, faireSilence, annoncerLAvancement, dire, vivant, attendreLEcranSuivant]);

  /** Une réponse fausse s'efface sans rien dire ; une réponse donnée après la fin du temps n'est pas prise. */
  const repondre = useCallback(async (nombre: number, suite: SuiteDuCalcul) => {
    const maintenant = horloge.maintenant();
    const fluence = seance.fluenceEnCours(maintenant);
    if (!fluence?.demarree || estFigee.current) return;
    if (fluence.finie) return await terminer(suite);
    seance.repondre(Reponse.nombre(nombre), maintenant);
    redessiner();
  }, [seance, horloge, estFigee, terminer, redessiner]);

  const battre = useCallback(async (suite: SuiteDuCalcul) => {
    const fluence = seance.fluenceEnCours(horloge.maintenant());
    if (!fluence || estFigee.current) return;
    if (fluence.finie) return await terminer(suite);
    if (fluence.tempsRestant === derniereSeconde.current) return;
    derniereSeconde.current = fluence.tempsRestant;
    redessiner();
  }, [seance, horloge, estFigee, terminer, redessiner]);

  return { demarree, fluenceFinie, parolesDeFin, presenter, demarrer, repondre, battre };
}

/** Fait battre l'horloge tant que la fluence court : chaque battement redessine le temps, ou finit la fluence. */
export function useBattementDeLaFluence(
  horloge: Horloge,
  demarree: boolean,
  battre: (suite: SuiteDuCalcul) => Promise<void>,
  suite: SuiteDuCalcul,
): void {
  useEffect(() => {
    if (!demarree) return;
    return horloge.battre(() => void battre(suite), BATTEMENT_EN_MS);
  }, [horloge, demarree, battre, suite]);
}
