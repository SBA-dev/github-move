import { type MutableRefObject, useCallback, useRef, useState } from "react";
import type {
  BoiteEnCours,
  BoiteOuverte,
  Reponse,
  SchemaEnCours,
  SchemaResolu,
  Seance,
} from "@domain/apprentissage";
import type { PersonnageGuide } from "@domain/motivation";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import {
  aiderQuandOnNeSaitPas,
  encouragerApresUneErreurDeCalcul,
  feliciterPuisExpliquer,
  feliciterUnCalcul,
} from "./paroles-du-calcul.ts";
import type { SuiteDuCalcul } from "./useCalcul.ts";
import type { QuestionFigee } from "./useQuestionFigee.ts";

type Dependances = {
  readonly seance: Seance;
  readonly personnageGuide: PersonnageGuide;
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly faireSilence: () => void;
  readonly sequence: MutableRefObject<number>;
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

export type BoiteReussie = Readonly<{ enCours: BoiteEnCours; ouverte: BoiteOuverte }>;
export type SchemaReussi = Readonly<{ enCours: SchemaEnCours; resolu: SchemaResolu }>;

/** La boîte à jetons et le problème en barres se jouent comme un calcul, avec une présentation illustrée. */
export function seJoueCommeUneQuestionIllustree(type: string | undefined): boolean {
  return type === "boite" || type === "barres";
}

/**
 * Le déroulé d'une boîte à jetons ou d'un problème en barres : le personnage guide pose la question,
 * la réponse est corrigée comme un calcul, puis la boîte s'ouvre ou le « ? » du schéma est remplacé.
 */
export function useQuestionIllustree(
  { seance, personnageGuide, dire, faireSilence, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  const [phrasesDites, setPhrasesDites] = useState(0);
  const [boiteReussie, setBoiteReussie] = useState<BoiteReussie | undefined>();
  const [schemaReussi, setSchemaReussi] = useState<SchemaReussi | undefined>();
  const numeroDePresentation = useRef(0);

  const presenter = useCallback(async () => {
    const boite = seance.boiteEnCours();
    const schema = seance.schemaEnCours();
    const phrases = boite?.deroulement ?? (schema ? [schema.enonce, schema.explicationDuSchema] : []);
    const numero = ++numeroDePresentation.current;
    setPhrasesDites(0);
    for (const texte of phrases) {
      if (!(await dire({ texte, nature: "question" }))) {
        // Une présentation interrompue ne laisse jamais l'enfant sans moyen de répondre,
        // sauf si une présentation plus récente a pris le relais.
        if (numero === numeroDePresentation.current) setPhrasesDites(phrases.length);
        return;
      }
      setPhrasesDites((dites) => dites + 1);
    }
  }, [seance, dire]);

  /** « Réécouter » : la présentation reprend en entier. */
  const relireLaPresentation = useCallback((): boolean => {
    if (!(seance.boiteEnCours() ?? seance.schemaEnCours()) || estFigee.current) return false;
    sequence.current++;
    faireSilence();
    void presenter();
    return true;
  }, [seance, estFigee, sequence, faireSilence, presenter]);

  const feliciterLaBoite = useCallback(
    (ouverte: BoiteOuverte) => dire(feliciterUnCalcul(personnageGuide, ouverte.ouverture)),
    [dire, personnageGuide],
  );

  const feliciterLeSchema = useCallback(
    (resolu: SchemaResolu) => dire(feliciterPuisExpliquer(personnageGuide, resolu.explication)),
    [dire, personnageGuide],
  );

  const repondre = useCallback(async (reponse: Reponse, suite: SuiteDuCalcul) => {
    const boite = seance.boiteEnCours();
    const schema = seance.schemaEnCours();
    const exercice = seance.exerciceEnCours();
    if (!(boite ?? schema) || !exercice || estFigee.current) return;
    const resultat = seance.repondre(reponse);
    if (resultat === "dejaEcartee") return;
    sequence.current++;
    redessiner();
    if (resultat === "fausse") {
      await dire(encouragerApresUneErreurDeCalcul(personnageGuide, seance.aideApresLaDerniereErreur()));
      return;
    }
    figer({ position: exercice.position, exercice, question: undefined });
    annoncerLAvancement(seance.avancement());
    const ouverte = seance.boiteApresLaDerniereReponse();
    const resolu = seance.schemaApresLaDerniereReponse();
    if (boite && ouverte) {
      setBoiteReussie({ enCours: boite, ouverte });
      await feliciterLaBoite(ouverte);
    } else if (schema && resolu) {
      setSchemaReussi({ enCours: schema, resolu });
      await feliciterLeSchema(resolu);
    }
    await attendreLEcranSuivant();
    if (!vivant.current) return;
    figer(undefined);
    setBoiteReussie(undefined);
    setSchemaReussi(undefined);
    setPhrasesDites(0);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [
    seance,
    personnageGuide,
    dire,
    sequence,
    redessiner,
    figer,
    annoncerLAvancement,
    vivant,
    estFigee,
    feliciterLaBoite,
    feliciterLeSchema,
    attendreLEcranSuivant,
  ]);

  const jeNeSaisPas = useCallback(async () => {
    const enCours = seance.boiteEnCours() ?? seance.schemaEnCours();
    if (!enCours?.jeNeSaisPasPropose || estFigee.current) return;
    const { aide, bonneReponse } = seance.direJeNeSaisPas();
    sequence.current++;
    faireSilence();
    redessiner();
    await dire(aiderQuandOnNeSaitPas(enCours, aide, bonneReponse));
  }, [seance, sequence, faireSilence, redessiner, dire, estFigee]);

  return { phrasesDites, boiteReussie, schemaReussi, presenter, relireLaPresentation, repondre, jeNeSaisPas };
}
