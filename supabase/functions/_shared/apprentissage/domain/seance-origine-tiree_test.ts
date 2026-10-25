import { assertEquals } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDAdditionsTireesDe1a5AuCE1, leconLesDoublesAuCP } from "../test_utils/lecons-de-calcul.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-25T10:30:00Z");

Deno.test("une question ratée d'un calcul tiré garde dans son origine l'opération tirée qui permet de la reposer", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardFixe(0, 0.2, 0.4, 0.6, 0.8, 0.999),
    "profil-tom",
    leconDAdditionsTireesDe1a5AuCE1(),
    ChoixDeSeance.complete(),
  );
  seance.repondre(Reponse.nombre(3));
  seance.repondre(Reponse.nombre(9));
  seance.repondre(Reponse.nombre(7));
  seance.repondre(Reponse.nombre(10));

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRateesARetenir, [{
    identite: CleDeQuestion.de("calcul", "3 + 4"),
    origine: { leconDOrigine: "ma-ce1-additions-tirees", position: 0, type: "calcul", tirage: "3 + 4 = 7" },
  }]);
});

Deno.test("une question ratée d'un calcul écrit dans la leçon n'a pas de tirage dans son origine", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    leconLesDoublesAuCP(),
    ChoixDeSeance.complete(),
  );
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.choix("4"));
  seance.repondre(Reponse.choix("6"));

  const fait = seance.terminer(fin);

  assertEquals(fait.questionsRateesARetenir, [{
    identite: CleDeQuestion.de("calcul", "2 + 2"),
    origine: { leconDOrigine: "ma-cp-les-doubles", position: 0, type: "calcul" },
  }]);
});
