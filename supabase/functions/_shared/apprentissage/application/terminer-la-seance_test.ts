import type { Lecon } from "../../catalogue/domain/index.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { leconDeCalcul, leconDeCalculAvecCompetence } from "../test_utils/lecons-de-test.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { RecordsDeFluenceEnMemoire } from "../test_utils/records-de-fluence-en-memoire.ts";
import { ResultatsDesLeconsEnMemoire } from "../test_utils/resultats-des-lecons-en-memoire.ts";
import { SeancesTermineesEnMemoire } from "../test_utils/seances-terminees-en-memoire.ts";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { LeconIntrouvable, ParentNonRattache, SeanceIncoherente } from "../domain/erreurs.ts";
import { Reponse } from "../domain/reponse.ts";
import { Seance } from "../domain/seance.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import { TerminerLaSeance } from "./terminer-la-seance.ts";

function envoiAvecUneErreur(
  identifiant = "seance-1",
  lecon: Lecon = leconDeCalcul(),
): SeanceTermineeAEnregistrer {
  const seance = Seance.commencer(
    generateurIdFixe(identifiant),
    hasardFixe(0, 0, 0),
    "profil-lea",
    lecon,
    ChoixDeSeance.complete(),
  );
  seance.repondre(Reponse.choix("8"));
  seance.repondre(Reponse.choix("7"));
  seance.terminer(new Date("2026-10-23T10:30:00Z"));
  return seance.aEnregistrer();
}

function monde(lecons = new LeconsDuCatalogueEnMemoire(leconDeCalcul())) {
  const resultats = new ResultatsDesLeconsEnMemoire();
  const seances = new SeancesTermineesEnMemoire(resultats);
  const terminer = new TerminerLaSeance(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    lecons,
    seances,
    resultats,
    new RecordsDeFluenceEnMemoire(),
  );
  return { seances, resultats, terminer };
}

Deno.test("un parent rattaché termine une séance : elle est revalidée, enregistrée avec ses étoiles recalculées et annoncée", async () => {
  const { seances, terminer } = monde();

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() });

  assertEquals(seances.toutes().map((s) => [s.seance, s.enfant, s.etoiles, s.erreurs]), [
    ["seance-1", "profil-lea", 2, 1],
  ]);
  assertEquals(faits.map((fait) => fait.type), ["SeanceTerminee", "LeconReussie", "LeconAcquise"]);
});

Deno.test("la séance terminée met à jour le résultat de la leçon : meilleures étoiles, dernières étoiles, nombre de séances", async () => {
  const { resultats, terminer } = monde();

  await terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() });

  const resultat = await resultats.de("profil-lea", "ma-cp-calcul");
  assertEquals([resultat?.meilleures, resultat?.dernieres, resultat?.nombreDeSeances], [2, 2, 1]);
});

Deno.test("une même séance envoyée deux fois n'est comptée qu'une fois", async () => {
  const { seances, resultats, terminer } = monde();
  await terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() });

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() });

  assertEquals(faits, []);
  assertEquals(seances.toutes().length, 1);
  assertEquals((await resultats.de("profil-lea", "ma-cp-calcul"))?.nombreDeSeances, 1);
});

Deno.test("un parent non rattaché au profil ne peut rien enregistrer", async () => {
  const { seances, terminer } = monde();

  await assertRejects(
    () => terminer.executer({ parent: "parent-intrus", seance: envoiAvecUneErreur() }),
    ParentNonRattache,
  );
  assertEquals(seances.toutes(), []);
});

Deno.test("une leçon absente du catalogue empêche d'enregistrer la séance", async () => {
  const { seances, terminer } = monde(new LeconsDuCatalogueEnMemoire());

  await assertRejects(
    () => terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() }),
    LeconIntrouvable,
  );
  assertEquals(seances.toutes(), []);
});

Deno.test("une séance incohérente est refusée sans rien enregistrer", async () => {
  const { seances, resultats, terminer } = monde();
  const sansLaBonneReponse = { ...envoiAvecUneErreur(), reponses: [[Reponse.choix("8")]] };

  await assertRejects(
    () => terminer.executer({ parent: "parent-paul", seance: sansLaBonneReponse }),
    SeanceIncoherente,
  );
  assertEquals(seances.toutes(), []);
  assertEquals(await resultats.de("profil-lea", "ma-cp-calcul"), null);
});

Deno.test("un échec d'écriture n'enregistre ni la séance ni ses étoiles, et le renvoi compte les étoiles une seule fois", async () => {
  const { seances, resultats, terminer } = monde();
  seances.echouerAuProchainAppel();

  await assertRejects(() => terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() }));
  assertEquals(seances.toutes(), []);
  assertEquals(await resultats.de("profil-lea", "ma-cp-calcul"), null);

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() });

  const resultat = await resultats.de("profil-lea", "ma-cp-calcul");
  assertEquals([resultat?.meilleures, resultat?.nombreDeSeances], [2, 1]);
  assertEquals(faits.map((fait) => fait.type), ["SeanceTerminee", "LeconReussie", "LeconAcquise"]);
});

Deno.test("deux séances concurrentes de la même leçon comptent chacune une fois et LeconAcquise n'est émis qu'une fois", async () => {
  const { seances, resultats, terminer } = monde();

  const [premiers, seconds] = await Promise.all([
    terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur("seance-1") }),
    terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur("seance-2") }),
  ]);

  assertEquals(seances.toutes().length, 2);
  assertEquals((await resultats.de("profil-lea", "ma-cp-calcul"))?.nombreDeSeances, 2);
  const types = [...premiers, ...seconds].map((fait) => fait.type);
  assertEquals(types.filter((type) => type === "LeconAcquise").length, 1);
  assertEquals(types.filter((type) => type === "LeconReussie").length, 1);
});

Deno.test("LeconAcquise porte la compétence de la leçon", async () => {
  const lecon = leconDeCalculAvecCompetence();
  const { terminer } = monde(new LeconsDuCatalogueEnMemoire(lecon));

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur("seance-1", lecon) });

  assertEquals(competencesAcquises(faits), ["Calculer des sommes"]);
});

Deno.test("une leçon sans compétence est acquise sans compétence", async () => {
  const { terminer } = monde();

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiAvecUneErreur() });

  assertEquals(competencesAcquises(faits), [undefined]);
});

function competencesAcquises(faits: { type: string }[]): (string | undefined)[] {
  return faits
    .filter((fait) => fait.type === "LeconAcquise")
    .map((fait) => (fait as { competence?: string }).competence);
}
