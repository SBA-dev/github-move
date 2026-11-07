import { questionDeLEcoute } from "../../supabase/functions/_shared/apprentissage/domain/exercices/phrases-des-exercices-a-choix.ts";
import { texteALireDeLEtape } from "../../supabase/functions/_shared/apprentissage/domain/etape-de-lecon-lue.ts";
import { consigneAffichee } from "../../supabase/functions/_shared/apprentissage/domain/exercices/consigne-affichee.ts";
import { indicationDuGeste } from "../../supabase/functions/_shared/apprentissage/domain/exercices/indication-du-geste.ts";
import { type Exercice, lireLecon } from "../../supabase/functions/_shared/catalogue/domain/index.ts";
import { parolesConnuesDAvance, UNIVERS } from "../../supabase/functions/_shared/motivation/domain/index.ts";
import { phraseDEssai } from "../../supabase/functions/_shared/voix/domain/phrase-d-essai.ts";
import { CleDeLaPhrase } from "../../supabase/functions/_shared/voix/domain/cle-de-la-phrase.ts";
import { texteALire } from "../../supabase/functions/_shared/voix/domain/texte-a-lire.ts";

export type PhraseInventoriee = { cle: string; phrase: string };
export type InventaireDesPhrases = {
  phrases: PhraseInventoriee[];
  lecons: Record<string, string[]>;
};

function enonces(exercice: Exercice): string[] {
  switch (exercice.type) {
    case "bulles":
    case "lecture":
      return exercice.questions.map((q) => q.question);
    case "ecoute":
      return exercice.items.map(questionDeLEcoute);
    default:
      return [];
  }
}

function textesDeLExercice(exercice: Exercice): string[] {
  const textes = [consigneAffichee(exercice), indicationDuGeste(exercice.type), ...enonces(exercice)];
  return textes.filter((texte) => texte !== undefined);
}

function phrasesDe(textes: readonly string[]): string[] {
  return textes.flatMap((texte) => texteALire(texte)?.phrases ?? []);
}

const PAROLES_COMMUNES = "paroles-communes";

export function inventaireDesPhrases(
  lecons: readonly unknown[],
  parolesCommunes: readonly string[] = [],
): InventaireDesPhrases {
  const phrases = new Map<string, string>();
  const clesParLecon: Record<string, string[]> = {};
  const inscrire = (phrase: string): string => {
    const cle = CleDeLaPhrase.de(phrase).valeur;
    if (!phrases.has(cle)) phrases.set(cle, phrase);
    return cle;
  };
  for (const brute of lecons) {
    const lecon = lireLecon(brute);
    const textes = [
      ...lecon.etapes.map((etape) => texteALireDeLEtape(etape).join(" ")),
      ...lecon.exercices.flatMap(textesDeLExercice),
    ];
    clesParLecon[lecon.id] = phrasesDe(textes).map(inscrire);
  }
  clesParLecon[PAROLES_COMMUNES] = phrasesDe(parolesCommunes).map(inscrire);
  return {
    phrases: [...phrases].map(([cle, phrase]) => ({ cle, phrase })),
    lecons: clesParLecon,
  };
}

if (import.meta.main) {
  const bibliotheque = JSON.parse(await Deno.readTextFile("app/bibliotheque.json"));
  const essaisDeVoix = UNIVERS.map((univers) => phraseDEssai(univers.personnageGuide.nom));
  const parolesCommunes = [...parolesConnuesDAvance(), ...essaisDeVoix];
  const json = JSON.stringify(inventaireDesPhrases(bibliotheque, parolesCommunes), null, 2);
  const [sortie] = Deno.args;
  if (sortie) await Deno.writeTextFile(sortie, json);
  else console.log(json);
}
