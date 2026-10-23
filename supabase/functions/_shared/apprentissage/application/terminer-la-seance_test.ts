import { assertEquals, assertRejects } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { leconDeCalcul } from "../test_utils/lecons-de-test.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { ResultatsDesLeconsEnMemoire } from "../test_utils/resultats-des-lecons-en-memoire.ts";
import { SeancesTermineesEnMemoire } from "../test_utils/seances-terminees-en-memoire.ts";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { LeconIntrouvable, ParentNonRattache, SeanceIncoherente } from "../domain/erreurs.ts";
import { Reponse } from "../domain/reponse.ts";
import { Seance } from "../domain/seance.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import { EnregistrerLesEtoilesDeLaLecon } from "./enregistrer-les-etoiles-de-la-lecon.ts";
import { TerminerLaSeance } from "./terminer-la-seance.ts";

function envoiAvecUneErreur(): SeanceTermineeAEnregistrer {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardFixe(0, 0, 0),
    "profil-lea",
    leconDeCalcul(),
    ChoixDeSeance.complete(),
  );
  seance.repondre(Reponse.choix("8"));
  seance.repondre(Reponse.choix("7"));
  seance.terminer(new Date("2026-10-23T10:30:00Z"));
  return seance.aEnregistrer();
}

function monde(lecons = new LeconsDuCatalogueEnMemoire(leconDeCalcul())) {
  const seances = new SeancesTermineesEnMemoire();
  const resultats = new ResultatsDesLeconsEnMemoire();
  const terminer = new TerminerLaSeance(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    lecons,
    seances,
    new EnregistrerLesEtoilesDeLaLecon(lecons, resultats),
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
