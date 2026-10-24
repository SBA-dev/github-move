import { type MutableRefObject, useCallback, useState } from "react";
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

/**
 * Le déroulé d'une boîte à jetons ou d'un problème en barres : le personnage guide pose la question,
 * la réponse est corrigée comme un calcul, puis la boîte s'ouvre ou le « ? » du schéma est remplacé.
 */
export function useQuestionIllustree(
  { seance, personnageGuide, dire, faireSilence, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement } = reussite;
  const [phrasesDites, setPhrasesDites] = useState(0);
  const [boiteReussie, setBoiteReussie] = useState<BoiteReussie | undefined>();
  const [schemaReussi, setSchemaReussi] = useState<SchemaReussi | undefined>();

  const presenter = useCallback(async () => {
    const boite = seance.boiteEnCours();
    const schema = seance.schemaEnCours();
    setPhrasesDites(0);
    const phrases = boite?.deroulement ?? (schema ? [schema.enonce, schema.explicationDuSchema] : []);
    for (const texte of phrases) {
      if (!(await dire({ texte, nature: "question" }))) return;
      setPhrasesDites((dites) => dites + 1);
    }
  }, [seance, dire]);

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
    const ouverte = seance.boiteApresLaDerniereReponse();
    const resolu = seance.schemaApresLaDerniereReponse();
    if (boite && ouverte) setBoiteReussie({ enCours: boite, ouverte });
    if (schema && resolu) setSchemaReussi({ enCours: schema, resolu });
    annoncerLAvancement(seance.avancement());
    await dire(ouverte ? feliciterUnCalcul(personnageGuide, ouverte.ouverture) : feliciterPuisExpliquer(personnageGuide, resolu?.explication ?? ""));
    if (!vivant.current) return;
    figer(undefined);
    setBoiteReussie(undefined);
    setSchemaReussi(undefined);
    setPhrasesDites(0);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [seance, personnageGuide, dire, sequence, redessiner, figer, annoncerLAvancement, vivant, estFigee]);

  const jeNeSaisPas = useCallback(async () => {
    const enCours = seance.boiteEnCours() ?? seance.schemaEnCours();
    if (!enCours?.jeNeSaisPasPropose || estFigee.current) return;
    const { aide, bonneReponse } = seance.direJeNeSaisPas();
    sequence.current++;
    faireSilence();
    redessiner();
    await dire(aiderQuandOnNeSaitPas(enCours, aide, bonneReponse));
  }, [seance, sequence, faireSilence, redessiner, dire, estFigee]);

  return { phrasesDites, boiteReussie, schemaReussi, presenter, repondre, jeNeSaisPas };
}
