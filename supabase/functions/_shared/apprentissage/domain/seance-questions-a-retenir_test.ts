import { assertEquals } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import {
  leconPoserUneAdditionEnColonnesAuCP,
  POSITION_DE_LA_LECON_EN_ACTION,
} from "../test_utils/lecons-d-addition.ts";
import { leconDOrdreDuMot, seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { leconDeBullesEtDEcoute } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-25T10:30:00Z");
const cleDesBulles = CleDeQuestion.de("bulles", "Dans le mot « poule », quel son entends-tu ?ou");
const cleDeLEcoute = CleDeQuestion.de("ecoute", "cat");

function commencer(): Seance {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    leconDeBullesEtDEcoute(),
    ChoixDeSeance.complete(),
  );
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

Deno.test("une séance terminée donne ses questions ratées à retenir avec leur leçon d'origine, la position de leur exercice et leur type", () => {
  const seance = commencer();
  seance.repondre(Reponse.choix("on"));
  seance.repondre(Reponse.choix("ou"));
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.choix("chat"));

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRateesARetenir, [
    {
      identite: cleDesBulles,
      origine: { leconDOrigine: "an-cp-bulles-et-ecoute", position: 0, type: "bulles" },
    },
    {
      identite: cleDeLEcoute,
      origine: { leconDOrigine: "an-cp-bulles-et-ecoute", position: 1, type: "ecoute" },
    },
  ]);
});

Deno.test("une séance terminée sans erreur n'a aucune question à retenir", () => {
  const seance = commencer();
  seance.repondre(Reponse.choix("ou"));
  seance.repondre(Reponse.choix("chat"));

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRateesARetenir, []);
});

function terminerUnOrdreAvecUneErreur() {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("mi"));
  seance.repondre(Reponse.placement("do"));
  seance.repondre(Reponse.placement("mi"));
  seance.repondre(Reponse.placement("no"));
  return seance.terminer(fin);
}

Deno.test("une question ratée d'un exercice d'ordre reste dans les questions ratées mais n'est pas retenue", () => {
  const fait = terminerUnOrdreAvecUneErreur();

  assertEquals(fait.questionsRatees.length > 0, true);
  assertEquals(fait.questionsRateesARetenir, []);
});

Deno.test("une addition posée ratée à l'étape poser et à l'étape calculer donne une seule question à retenir : l'addition en ligne", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    leconPoserUneAdditionEnColonnesAuCP(),
    ChoixDeSeance.unExercice(POSITION_DE_LA_LECON_EN_ACTION),
  );
  seance.repondre(Reponse.placement("4", "unites"));
  seance.repondre(Reponse.placement("4", "dizaines"));
  seance.repondre(Reponse.placement("5", "unites"));
  seance.repondre(Reponse.placement("3", "dizaines"));
  seance.repondre(Reponse.placement("7", "unites"));
  seance.repondre(Reponse.choix("11"));
  seance.repondre(Reponse.choix("12"));
  seance.repondre(Reponse.choix("8"));

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRateesARetenir, [
    {
      identite: CleDeQuestion.de("calcul", "45 + 37"),
      origine: { leconDOrigine: "ma-cp-addition-posee", position: POSITION_DE_LA_LECON_EN_ACTION, type: "calcul" },
    },
  ]);
});
