import { assertEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { exerciceDHorloge, leconDHorloge } from "../test_utils/lecons-d-horloge.ts";
import { cleDeLHorloge } from "./cles-des-questions.ts";
import { questionDeRevision } from "./question-de-revision.ts";
import { Reponse } from "./reponse.ts";
import { tireurAuHasard } from "./tireur.ts";

const tireur = tireurAuHasard(hasardSansMelange());
const origine = { leconDOrigine: "ma-ce1-heures", position: 0, type: "horloge" } as const;

Deno.test("une question d'horloge ratée est reposée en révision, dans le même mode, depuis sa clé", () => {
  const items = [{ heure: "2:15" }, { heure: "9:45" }];
  const exercice = exerciceDHorloge("CE1", { mode: "lire", items });
  const lecon = leconDHorloge("CE1", { mode: "lire", items });
  const identite = cleDeLHorloge("lire", exercice.items[1]!);

  const revision = questionDeRevision(lecon, origine, identite, tireur, Niveau.de("CE1"));

  assertEquals(revision?.identite, identite);
  assertEquals(revision?.question?.repondre(Reponse.heureEcrite(9, 45)), "juste");
});

Deno.test("au CP, la question d'horloge reposée en révision est à choix", () => {
  const items = [{ heure: "3:00" }, { heure: "7:00" }];
  const exercice = exerciceDHorloge("CP", { mode: "lire", items });
  const lecon = leconDHorloge("CP", { mode: "lire", items });
  const identite = cleDeLHorloge("lire", exercice.items[0]!);

  const revision = questionDeRevision(
    lecon,
    { ...origine, leconDOrigine: "ma-cp-heures" },
    identite,
    tireur,
    Niveau.de("CP"),
  );

  assertEquals(revision?.question?.repondre(Reponse.choix("3 h")), "juste");
});
