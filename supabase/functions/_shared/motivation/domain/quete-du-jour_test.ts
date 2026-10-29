import { assertEquals } from "@std/assert";
import type { FaitsDuJour } from "./objectif-du-jour.ts";
import { type QueteDuJour, queteAccomplieParLaSeance, queteDuJour } from "./quete-du-jour.ts";

const faitsDUnJourSansSeance: FaitsDuJour = {
  leconsDesSeancesTermineesDuJour: [],
  nombreDeSeancesDeRevisionTermineesDuJour: 0,
};

Deno.test("sans quête tant que la leçon du jour est inconnue", () => {
  const quete = queteDuJour(
    { leconDuJour: { genre: "inconnue" }, nombreDeQuestionsDues: 3 },
    faitsDUnJourSansSeance,
  );

  assertEquals(quete, { genre: "sansQuete" });
});

Deno.test("sans quête tant que le nombre de questions dues est inconnu", () => {
  const quete = queteDuJour(
    {
      leconDuJour: { genre: "aJouer", lecon: "lecon-a", titre: "Le son ou" },
      nombreDeQuestionsDues: undefined,
    },
    faitsDUnJourSansSeance,
  );

  assertEquals(quete, { genre: "sansQuete" });
});

Deno.test("la quête du jour propose la révision quand au moins une question est due", () => {
  const quete = queteDuJour(
    {
      leconDuJour: { genre: "aJouer", lecon: "lecon-a", titre: "Le son ou" },
      nombreDeQuestionsDues: 3,
    },
    faitsDUnJourSansSeance,
  );

  assertEquals(quete, { genre: "revision", nombreDeQuestionsDues: 3 });
});

Deno.test("sans question due, la quête du jour propose la leçon du jour", () => {
  const quete = queteDuJour(
    {
      leconDuJour: { genre: "aJouer", lecon: "le-son-in", titre: "Le son in" },
      nombreDeQuestionsDues: 0,
    },
    faitsDUnJourSansSeance,
  );

  assertEquals(quete, { genre: "lecon", lecon: "le-son-in", titre: "Le son in" });
});

Deno.test("parcours fini sans question due ni séance du jour : aucune quête", () => {
  const quete = queteDuJour(
    { leconDuJour: { genre: "parcoursFini" }, nombreDeQuestionsDues: 0 },
    faitsDUnJourSansSeance,
  );

  assertEquals(quete, { genre: "aucune" });
});

Deno.test("une séance de révision terminée aujourd'hui accomplit la quête de révision, même quand plus aucune question n'est due", () => {
  const faitsApresUneRevision: FaitsDuJour = {
    leconsDesSeancesTermineesDuJour: [],
    nombreDeSeancesDeRevisionTermineesDuJour: 1,
  };
  const leconDuJour = {
    genre: "aJouer",
    lecon: "le-son-in",
    titre: "Le son in",
  } as const;

  assertEquals(
    queteDuJour({ leconDuJour, nombreDeQuestionsDues: 0 }, faitsApresUneRevision),
    { genre: "accomplie", quete: "revision" },
  );
  assertEquals(
    queteDuJour({ leconDuJour, nombreDeQuestionsDues: 2 }, faitsApresUneRevision),
    { genre: "accomplie", quete: "revision" },
  );
});

Deno.test("une séance terminée aujourd'hui sur n'importe quelle leçon accomplit la quête de leçon, même quand elle finit le parcours", () => {
  const faitsApresUneSeance: FaitsDuJour = {
    leconsDesSeancesTermineesDuJour: ["une-autre-lecon"],
    nombreDeSeancesDeRevisionTermineesDuJour: 0,
  };

  assertEquals(
    queteDuJour(
      {
        leconDuJour: { genre: "aJouer", lecon: "le-son-in", titre: "Le son in" },
        nombreDeQuestionsDues: 0,
      },
      faitsApresUneSeance,
    ),
    { genre: "accomplie", quete: "lecon" },
  );
  assertEquals(
    queteDuJour(
      { leconDuJour: { genre: "parcoursFini" }, nombreDeQuestionsDues: 0 },
      faitsApresUneSeance,
    ),
    { genre: "accomplie", quete: "lecon" },
  );
});

Deno.test("sans leçon pour sa classe, une séance de leçon n'accomplit aucune quête", () => {
  const leconDuJour = { genre: "aucuneLeconPourTaClasse" } as const;
  const faitsApresUneSeanceDUneAutreClasse: FaitsDuJour = {
    leconsDesSeancesTermineesDuJour: ["une-lecon-d-une-classe-d-avant"],
    nombreDeSeancesDeRevisionTermineesDuJour: 0,
  };

  assertEquals(
    queteDuJour(
      { leconDuJour, nombreDeQuestionsDues: 0 },
      faitsApresUneSeanceDUneAutreClasse,
    ),
    { genre: "sansQuete" },
  );
  assertEquals(
    queteDuJour(
      { leconDuJour, nombreDeQuestionsDues: 0 },
      faitsDUnJourSansSeance,
    ),
    { genre: "sansQuete" },
  );
});

Deno.test("une séance de leçon n'accomplit pas une quête de révision", () => {
  const faitsApresUneSeanceDeLecon: FaitsDuJour = {
    leconsDesSeancesTermineesDuJour: ["une-autre-lecon"],
    nombreDeSeancesDeRevisionTermineesDuJour: 0,
  };

  const quete = queteDuJour(
    {
      leconDuJour: { genre: "aJouer", lecon: "le-son-in", titre: "Le son in" },
      nombreDeQuestionsDues: 2,
    },
    faitsApresUneSeanceDeLecon,
  );

  assertEquals(quete, { genre: "revision", nombreDeQuestionsDues: 2 });
});

Deno.test("la fête est due seulement à la séance qui accomplit la quête du jour", () => {
  const revision = (n: number): QueteDuJour => ({ genre: "revision", nombreDeQuestionsDues: n });
  const lecon: QueteDuJour = { genre: "lecon", lecon: "le-son-in", titre: "Le son in" };
  const revisionAccomplie: QueteDuJour = { genre: "accomplie", quete: "revision" };
  const leconAccomplie: QueteDuJour = { genre: "accomplie", quete: "lecon" };
  const sansQuete: QueteDuJour = { genre: "sansQuete" };

  assertEquals(queteAccomplieParLaSeance(revision(3), revisionAccomplie), true);
  assertEquals(queteAccomplieParLaSeance(lecon, leconAccomplie), true);
  assertEquals(queteAccomplieParLaSeance(leconAccomplie, leconAccomplie), false);
  assertEquals(queteAccomplieParLaSeance(revision(3), revision(2)), false);
  assertEquals(queteAccomplieParLaSeance(sansQuete, sansQuete), false);
});
