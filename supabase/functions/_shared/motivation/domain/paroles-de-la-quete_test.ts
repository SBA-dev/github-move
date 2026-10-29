import { assertEquals } from "@std/assert";
import {
  feteDeLaQueteAccomplie,
  propositionDeLaQueteDuJour,
  queteAccomplieParLaSeance,
  type QueteDuJour,
  queteDuJour,
  reponseAuRefusDeLaQuete,
} from "./index.ts";

Deno.test("le personnage guide propose la quête du jour avec les paroles validées", () => {
  const revision = (n: number): QueteDuJour => ({ genre: "revision", nombreDeQuestionsDues: n });
  const lecon: QueteDuJour = { genre: "lecon", lecon: "le-son-in", titre: "Le son in" };

  assertEquals(
    propositionDeLaQueteDuJour(revision(1)),
    "Ta quête du jour : réviser 1 petite erreur des jours passés. On y va ?",
  );
  assertEquals(
    propositionDeLaQueteDuJour(revision(3)),
    "Ta quête du jour : réviser 3 petites erreurs des jours passés. On y va ?",
  );
  assertEquals(
    propositionDeLaQueteDuJour(lecon),
    "Ta quête du jour : la leçon « Le son in ». On y va ?",
  );
  assertEquals(
    propositionDeLaQueteDuJour({ genre: "accomplie", quete: "revision" }),
    "Ta quête du jour est accomplie.",
  );
  assertEquals(
    propositionDeLaQueteDuJour({ genre: "accomplie", quete: "lecon" }),
    "Ta quête du jour est accomplie.",
  );
  assertEquals(propositionDeLaQueteDuJour({ genre: "aucune" }), undefined);
  assertEquals(propositionDeLaQueteDuJour({ genre: "sansQuete" }), undefined);
});

Deno.test("le personnage guide fête la quête accomplie et répond au refus sans reproche", () => {
  assertEquals(feteDeLaQueteAccomplie("Léa"), "Quête du jour accomplie ! Bravo Léa !");
  assertEquals(reponseAuRefusDeLaQuete(), "D'accord, choisis ce qui te fait envie !");
});

Deno.test("le module public de Motivation propose la révision puis fête la quête accomplie", () => {
  const leconDuJour = { genre: "aJouer", lecon: "le-son-in", titre: "Le son in" } as const;
  const faitsSansSeance = { leconsDesSeancesTermineesDuJour: [], nombreDeSeancesDeRevisionTermineesDuJour: 0 };
  const faitsApresUneRevision = { leconsDesSeancesTermineesDuJour: [], nombreDeSeancesDeRevisionTermineesDuJour: 1 };

  const avant = queteDuJour({ leconDuJour, nombreDeQuestionsDues: 3 }, faitsSansSeance);
  const apres = queteDuJour({ leconDuJour, nombreDeQuestionsDues: 0 }, faitsApresUneRevision);

  assertEquals(
    propositionDeLaQueteDuJour(avant),
    "Ta quête du jour : réviser 3 petites erreurs des jours passés. On y va ?",
  );
  assertEquals(queteAccomplieParLaSeance(avant, apres), true);
});
