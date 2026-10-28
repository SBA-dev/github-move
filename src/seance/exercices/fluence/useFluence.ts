import { type MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { type FluenceEnCours, type IssueDuRecord, RecordDeFluence, Reponse, type Seance } from "@domain/apprentissage";
import {
  accueilDeLaFluence,
  type FinDeFluence,
  effetSonoreDuRecord,
  effetsSonoresApresUneBonneReponse,
  humeurApresReponse,
  parolesDeFinDeFluence,
  type PersonnageGuide,
  reagirALaReponse,
  SIGNAL_DE_DEPART,
} from "@domain/motivation";
import { hasardDuNavigateur } from "../../../hasard-navigateur.ts";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, type SignalerUnRetour } from "../../../retours/index.ts";
import type { Voix } from "../../../voix/index.ts";
import type { Horloge } from "../../horloge.ts";
import type { ParoleADire } from "../../usePersonnageQuiParle.ts";
import type { SuiteDuCalcul } from "../useCalcul.ts";
import type { QuestionFigee } from "../useQuestionFigee.ts";
import { lireLeRecordDeFluence } from "./lecture-du-record-supabase.ts";

const BATTEMENT_EN_MS = 250;

type Dependances = {
  readonly seance: Seance;
  readonly personnageGuide: PersonnageGuide;
  readonly horloge: Horloge;
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly jouer: Voix["jouer"];
  readonly signaler: SignalerUnRetour;
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
    return { texte: parolesDeFinDeFluence({ score, issue, record: meilleurScore }), meilleurScore, issue };
  }
  const fin: FinDeFluence = { score, issue };
  return { texte: parolesDeFinDeFluence(fin), meilleurScore, issue };
}

/** Le déroulé d'une fluence : l'accueil et le record, le signal de départ, le temps qui passe, puis la phrase de fin. */
export function useFluence(
  { seance, personnageGuide, horloge, dire, jouer, signaler, faireSilence, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  const [record, setRecord] = useState<number | undefined>();
  const [demarree, setDemarree] = useState(false);
  /** La fluence finie, montrée telle quelle le temps de dire sa phrase de fin. */
  const [fluenceFinie, setFluenceFinie] = useState<FluenceEnCours | undefined>();
  const derniereSeconde = useRef<number | undefined>(undefined);
  /** Les paroles de fin de la fluence, gardées pour que l'écran de fin d'une fluence seule y ajoute les nouveautés. */
  const parolesDeFin = useRef<string | undefined>(undefined);
  /** L'issue du record de la dernière fluence, gardée pour que l'écran de fin sache si « grande victoire » a déjà été entendue. */
  const issueDuRecord = useRef<IssueDuRecord>("aucunRecord");
  /** Le record que la fluence vient de battre, que le compteur rejoint en défilant ; `undefined` quand le record reste ou qu'il n'y a pas de score. */
  const [recordBattu, setRecordBattu] = useState<number | undefined>();

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
    issueDuRecord.current = fin.issue;
    const effetDuRecord = effetSonoreDuRecord(fin.issue);
    setRecordBattu(effetDuRecord === undefined ? undefined : fin.meilleurScore);
    await dire({
      texte: fin.texte,
      nature: "felicitation",
      humeur: humeurApresReponse(fluence.score > 0),
      ...(effetDuRecord === undefined ? {} : { effetsAvant: [effetDuRecord] }),
    });
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    setRecordBattu(undefined);
    setFluenceFinie(undefined);
    await suite(++sequence.current, seance.retirerFaits(), true);
  }, [seance, horloge, record, estFigee, figer, sequence, faireSilence, annoncerLAvancement, dire, vivant, attendreLEcranSuivant]);

  /** Pendant le chrono, chaque calcul a son effet sonore, sans point du récipient et sans parole ; une réponse donnée après la fin du temps n'est pas prise. */
  const reagirAuCalcul = useCallback((juste: boolean) => {
    const questionsReussies = seance.avancement().questionsReussies;
    const effets = juste
      ? effetsSonoresApresUneBonneReponse({
        questionsReussiesAvant: questionsReussies,
        questionsReussiesApres: questionsReussies,
        exerciceComplete: false,
        pendantLeChronoDUneFluence: true,
      })
      : [reagirALaReponse(false, personnageGuide, hasardDuNavigateur).effetSonore];
    signaler(juste ? "juste" : "fausse", CIBLE_DE_LA_ZONE_DE_REPONSE);
    void jouer(effets);
  }, [seance, personnageGuide, signaler, jouer]);

  /** Une réponse fausse s'efface sans rien dire. */
  const repondre = useCallback(async (nombre: number, suite: SuiteDuCalcul) => {
    const maintenant = horloge.maintenant();
    const fluence = seance.fluenceEnCours(maintenant);
    if (!fluence?.demarree || estFigee.current) return;
    if (fluence.finie) return await terminer(suite);
    const resultat = seance.repondre(Reponse.nombre(nombre), maintenant);
    if (resultat !== "dejaEcartee") reagirAuCalcul(resultat === "juste");
    redessiner();
  }, [seance, horloge, estFigee, terminer, reagirAuCalcul, redessiner]);

  const battre = useCallback(async (suite: SuiteDuCalcul) => {
    const fluence = seance.fluenceEnCours(horloge.maintenant());
    if (!fluence || estFigee.current) return;
    if (fluence.finie) return await terminer(suite);
    if (fluence.tempsRestant === derniereSeconde.current) return;
    derniereSeconde.current = fluence.tempsRestant;
    redessiner();
  }, [seance, horloge, estFigee, terminer, redessiner]);

  return { demarree, fluenceFinie, recordBattu, parolesDeFin, issueDuRecord, presenter, demarrer, repondre, battre };
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
