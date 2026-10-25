import { assertEquals, assertRejects } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { FilesDeRevisionEnMemoire } from "../test_utils/files-de-revision-en-memoire.ts";
import { LeconsDuCatalogueEnMemoire } from "../test_utils/lecons-du-catalogue-en-memoire.ts";
import { NiveauxDesProfilsEnMemoire } from "../test_utils/niveaux-des-profils-en-memoire.ts";
import { RattachementsEnMemoire } from "../test_utils/rattachements-en-memoire.ts";
import { SeancesDeRevisionTermineesEnMemoire } from "../test_utils/seances-de-revision-terminees-en-memoire.ts";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { ParentNonRattache, SeanceDeRevisionIncoherente } from "../domain/erreurs.ts";
import { FileDeRevision, type QuestionRetenue } from "../domain/file-de-revision.ts";
import { IntervalleDeRevision } from "../domain/intervalle-de-revision.ts";
import { Jour } from "../domain/jour.ts";
import { Reponse } from "../domain/reponse.ts";
import { SeanceDeRevision } from "../domain/seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "../domain/seance-de-revision-terminee-a-enregistrer.ts";
import { tireurAuHasard } from "../domain/tireur.ts";
import { TerminerLaSeanceDeRevision } from "./terminer-la-seance-de-revision.ts";

const CE1 = Niveau.de("CE1");
const jourDeLaRevision = Jour.de("2026-10-25");
const finDeLaRevision = new Date("2026-10-25T17:00:00Z");
const erreursFaitesLe = new Date("2026-10-24T16:30:00Z");

function uneLecon(questions: { question: string; choix: string[]; reponse: string }[]): Lecon {
  return lireLecon({
    id: "fr-ce1-syllabes",
    matiere: "francais",
    niveau: "CE1",
    titre: "Les syllabes",
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{ type: "bulles", questions }],
  });
}

const questionBateau = { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2"], reponse: "2" };
const questionChat = { question: "Combien de syllabes dans « chat » ?", choix: ["1", "2"], reponse: "1" };
const leconDesSyllabes = uneLecon([questionBateau, questionChat]);
const bateau = CleDeQuestion.de("bulles", "Combien de syllabes dans « bateau » ?2");
const chat = CleDeQuestion.de("bulles", "Combien de syllabes dans « chat » ?1");

function retenue(identite: CleDeQuestion, jours: 1 | 3 | 7): QuestionRetenue {
  return {
    identite,
    origine: { leconDOrigine: leconDesSyllabes.id, position: 0, type: "bulles" },
    intervalle: IntervalleDeRevision.de(jours),
    dateDeRevision: Jour.de("2026-10-25"),
    derniereErreurLe: erreursFaitesLe,
    nombreDeFoisRatee: 1,
  };
}

function laFileDuProfil(...questions: QuestionRetenue[]): FileDeRevision {
  return FileDeRevision.reconstituer({ enfant: "profil-lea", questions, erreursCorrigeesPourDeBon: 0 });
}

function laBonneReponse(identite: CleDeQuestion) {
  return Reponse.choix(identite.valeur === bateau.valeur ? "2" : "1");
}

function envoiJoue(
  file: FileDeRevision,
  { fausses = [], id = "revision-1", jour = jourDeLaRevision }: {
    fausses?: CleDeQuestion[];
    id?: string;
    jour?: Jour;
  } = {},
): SeanceDeRevisionTermineeAEnregistrer {
  const seance = SeanceDeRevision.commencer({
    id,
    enfant: "profil-lea",
    plan: file.planDeLaSeanceDeRevision(jourDeLaRevision),
    lecons: [leconDesSyllabes],
    tireurDe: () => tireurAuHasard(hasardSansMelange()),
    niveau: CE1,
  });
  seance.resultats().forEach(({ identite }) => {
    if (fausses.some(({ valeur }) => valeur === identite.valeur)) seance.direJeNeSaisPas();
    seance.repondre(laBonneReponse(identite));
  });
  seance.terminer(finDeLaRevision, jour);
  return seance.aEnregistrer();
}

function monde(file: FileDeRevision, lecons: Lecon[] = [leconDesSyllabes]) {
  const files = new FilesDeRevisionEnMemoire();
  files.ecrire(file);
  const seances = new SeancesDeRevisionTermineesEnMemoire(files);
  const terminer = new TerminerLaSeanceDeRevision(
    new RattachementsEnMemoire(["parent-paul", "profil-lea"]),
    new LeconsDuCatalogueEnMemoire(...lecons),
    new NiveauxDesProfilsEnMemoire(["profil-lea", CE1]),
    files,
    seances,
  );
  return { files, seances, terminer };
}

function laFileApres(files: FilesDeRevisionEnMemoire) {
  return (files.fileDe("profil-lea")?.questions ?? []).map((
    { identite, intervalle, dateDeRevision },
  ) => [identite.valeur, intervalle.jours, dateDeRevision.toString()]);
}

Deno.test("une séance de révision terminée espace la question juste à 3 jours et ramène la question fausse à 1 jour", async () => {
  const fileDuProfil = laFileDuProfil(retenue(bateau, 1), retenue(chat, 1));
  const { files, seances, terminer } = monde(fileDuProfil);

  const faits = await terminer.executer({
    parent: "parent-paul",
    seance: envoiJoue(fileDuProfil, { fausses: [bateau] }),
  });

  assertEquals(laFileApres(files).sort(), [[bateau.valeur, 1, "2026-10-26"], [chat.valeur, 3, "2026-10-28"]].sort());
  assertEquals(faits.map((fait) => fait.type), ["SeanceDeRevisionTerminee"]);
  assertEquals(
    seances.toutes().map(({ id, nombreDeQuestions, nombreDeQuestionsJustes }) => [
      id,
      nombreDeQuestions,
      nombreDeQuestionsJustes,
    ]),
    [["revision-1", 2, 1]],
  );
});

Deno.test("une question juste après son intervalle de 7 jours est corrigée pour de bon : elle sort de la file et l'événement est publié", async () => {
  const fileDuProfil = laFileDuProfil(retenue(chat, 7));
  const { files, terminer } = monde(fileDuProfil);

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiJoue(fileDuProfil) });

  assertEquals(laFileApres(files), []);
  assertEquals(files.fileDe("profil-lea")?.erreursCorrigeesPourDeBon, 1);
  assertEquals(faits.map((fait) => fait.type), ["SeanceDeRevisionTerminee", "ErreursCorrigeesPourDeBon"]);
  assertEquals(faits[1], {
    type: "ErreursCorrigeesPourDeBon",
    enfant: "profil-lea",
    nombre: 1,
    leconsDOrigine: [leconDesSyllabes.id],
  });
});

Deno.test("une séance de révision renvoyée une seconde fois ne fait rien avancer de plus", async () => {
  const fileDuProfil = laFileDuProfil(retenue(chat, 1));
  const { files, seances, terminer } = monde(fileDuProfil);
  const envoi = envoiJoue(fileDuProfil);
  await terminer.executer({ parent: "parent-paul", seance: envoi });
  const versionApresLePremierEnvoi = files.version("profil-lea");

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoi });

  assertEquals(faits, []);
  assertEquals(seances.toutes().length, 1);
  assertEquals(files.version("profil-lea"), versionApresLePremierEnvoi);
  assertEquals(laFileApres(files), [[chat.valeur, 3, "2026-10-28"]]);
});

Deno.test("un parent non rattaché au profil ne peut rien enregistrer", async () => {
  const fileDuProfil = laFileDuProfil(retenue(chat, 1));
  const { files, seances, terminer } = monde(fileDuProfil);

  await assertRejects(
    () => terminer.executer({ parent: "parent-intrus", seance: envoiJoue(fileDuProfil) }),
    ParentNonRattache,
  );
  assertEquals(seances.toutes(), []);
  assertEquals(laFileApres(files), [[chat.valeur, 1, "2026-10-25"]]);
});

Deno.test("un envoi incohérent est refusé sans rien écrire", async () => {
  const fileDuProfil = laFileDuProfil(retenue(chat, 1));
  const { files, seances, terminer } = monde(fileDuProfil);
  const incoherent = { ...envoiJoue(fileDuProfil), jour: "demain" };

  await assertRejects(
    () => terminer.executer({ parent: "parent-paul", seance: incoherent }),
    SeanceDeRevisionIncoherente,
  );
  assertEquals(seances.toutes(), []);
  assertEquals(files.version("profil-lea"), 1);
});

Deno.test("une question dont la leçon n'a plus ce texte est oubliée de la file, les autres sont appliquées", async () => {
  const fileDuProfil = laFileDuProfil(retenue(bateau, 1), retenue(chat, 1));
  const { files, terminer } = monde(fileDuProfil, [uneLecon([questionBateau])]);

  await terminer.executer({ parent: "parent-paul", seance: envoiJoue(fileDuProfil) });

  assertEquals(laFileApres(files), [[bateau.valeur, 3, "2026-10-28"]]);
});

Deno.test("une file modifiée entre-temps par un autre appareil est relue : la séance est appliquée sur la file à jour", async () => {
  const fileDuProfil = laFileDuProfil(retenue(chat, 1));
  const { files, seances, terminer } = monde(fileDuProfil);
  const ailleurs = CleDeQuestion.de("bulles", "Une question ratée ailleurs ?oui");
  files.apresLaProchaineLecture((file) =>
    file.retenir(
      [{ identite: ailleurs, origine: { leconDOrigine: "fr-ce1-autre", position: 0, type: "bulles" } }],
      Jour.de("2026-10-25"),
      new Date("2026-10-25T09:00:00Z"),
    )
  );

  const faits = await terminer.executer({ parent: "parent-paul", seance: envoiJoue(fileDuProfil) });

  assertEquals(laFileApres(files).map(([cle]) => cle).sort(), [ailleurs.valeur, chat.valeur].sort());
  assertEquals(
    files.fileDe("profil-lea")?.questions.find(({ identite }) => identite.valeur === chat.valeur)
      ?.intervalle.jours,
    3,
  );
  assertEquals(seances.toutes().length, 1);
  assertEquals(faits.map((fait) => fait.type), ["SeanceDeRevisionTerminee"]);
});
