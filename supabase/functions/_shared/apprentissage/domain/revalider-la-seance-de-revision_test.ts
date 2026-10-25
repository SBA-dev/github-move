import { assertEquals, assertThrows } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { SeanceDeRevisionIncoherente } from "./erreurs.ts";
import { FileDeRevision, type QuestionRetenue } from "./file-de-revision.ts";
import { Jour } from "./jour.ts";
import { Reponse, type ReponseDonnee } from "./reponse.ts";
import { revaliderLaSeanceDeRevision } from "./revalider-la-seance-de-revision.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "./seance-de-revision-terminee-a-enregistrer.ts";
import { SeanceDeRevision } from "./seance-de-revision.ts";
import { tireurAuHasard } from "./tireur.ts";

const CE1 = Niveau.de("CE1");
const jourDesErreurs = Jour.de("2026-10-24");
const jourDeLaRevision = Jour.de("2026-10-25");
const erreursFaitesLe = new Date("2026-10-24T16:30:00Z");
const finDeLaRevision = new Date("2026-10-25T17:00:00Z");

const leconDesSyllabes: Lecon = lireLecon({
  id: "fr-ce1-syllabes",
  matiere: "francais",
  niveau: "CE1",
  titre: "Les syllabes",
  ordre: 1,
  programme: { section: "c2-test", citation: "Citation de test." },
  lecon: [],
  exercices: [{
    type: "bulles",
    questions: [
      { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2"], reponse: "2" },
      { question: "Combien de syllabes dans « chat » ?", choix: ["1", "2"], reponse: "1" },
    ],
  }],
});

const bateau = CleDeQuestion.de("bulles", "Combien de syllabes dans « bateau » ?2");
const chat = CleDeQuestion.de("bulles", "Combien de syllabes dans « chat » ?1");

function laFileDuProfil(): FileDeRevision {
  const file = FileDeRevision.vide("profil-lea");
  file.retenir(
    [bateau, chat].map((identite) => ({
      identite,
      origine: { leconDOrigine: leconDesSyllabes.id, position: 0, type: "bulles" as const },
    })),
    jourDesErreurs,
    erreursFaitesLe,
  );
  return file;
}

function bonneReponseDe(identite: CleDeQuestion) {
  return Reponse.choix(identite.valeur === bateau.valeur ? "2" : "1");
}

Deno.test("un envoi cohérent de séance de révision est revalidé et redonne les mêmes résultats juste ou faux", () => {
  const fileDuNavigateur = laFileDuProfil();
  const seance = SeanceDeRevision.commencer({
    id: "revision-1",
    enfant: "profil-lea",
    plan: fileDuNavigateur.planDeLaSeanceDeRevision(jourDeLaRevision),
    lecons: [leconDesSyllabes],
    tireurDe: () => tireurAuHasard(hasardSansMelange()),
    niveau: CE1,
  });
  const [premiere, seconde] = seance.resultats().map(({ identite }) => identite);
  seance.direJeNeSaisPas();
  seance.repondre(bonneReponseDe(premiere));
  seance.repondre(bonneReponseDe(seconde));
  const fait = seance.terminer(finDeLaRevision, jourDeLaRevision);
  const envoi = seance.aEnregistrer();
  const fileDuServeur = FileDeRevision.reconstituer({
    enfant: "profil-lea",
    questions: laFileDuProfil().questions,
    erreursCorrigeesPourDeBon: 0,
  });

  const revalide = revaliderLaSeanceDeRevision(envoi, fileDuServeur, [leconDesSyllabes], CE1);

  assertEquals(revalide.resultats.map(({ juste }) => juste), [false, true]);
  assertEquals(revalide, fait);
});

const jeNeSaisPas: ReponseDonnee = { genre: "jeNeSaisPas" };

function jouer(
  { questions, maintenant = finDeLaRevision, jour = jourDeLaRevision }: {
    questions?: readonly QuestionRetenue[];
    maintenant?: Date;
    jour?: Jour;
  } = {},
) {
  const file = laFileDuProfil();
  const seance = SeanceDeRevision.commencer({
    id: "revision-1",
    enfant: "profil-lea",
    plan: { questions: questions ?? file.planDeLaSeanceDeRevision(jourDeLaRevision).questions },
    lecons: [leconDesSyllabes],
    tireurDe: () => tireurAuHasard(hasardSansMelange()),
    niveau: CE1,
  });
  seance.resultats().forEach(({ identite }, rang) => {
    if (rang === 0) seance.direJeNeSaisPas();
    seance.repondre(bonneReponseDe(identite));
  });
  seance.terminer(maintenant, jour);
  return seance.aEnregistrer();
}

function revalider(envoi: SeanceDeRevisionTermineeAEnregistrer) {
  const file = FileDeRevision.reconstituer({
    enfant: "profil-lea",
    questions: laFileDuProfil().questions,
    erreursCorrigeesPourDeBon: 0,
  });
  return revaliderLaSeanceDeRevision(envoi, file, [leconDesSyllabes], CE1);
}

function assertIncoherent(envoi: SeanceDeRevisionTermineeAEnregistrer) {
  assertThrows(() => revalider(envoi), SeanceDeRevisionIncoherente);
}

Deno.test("une séance de révision de plus de 10 questions est refusée comme incohérente", () => {
  const onzeQuestions = Array.from({ length: 11 }, (_, rang) => `Question ${rang} ?`);
  const grandeLecon = lireLecon({
    id: "fr-ce1-grande",
    matiere: "francais",
    niveau: "CE1",
    titre: "Une grande leçon",
    ordre: 2,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{
      type: "bulles",
      questions: onzeQuestions.map((question) => ({ question, choix: ["a", "b"], reponse: "a" })),
    }],
  });
  const file = FileDeRevision.vide("profil-lea");
  file.retenir(
    onzeQuestions.map((question) => ({
      identite: CleDeQuestion.de("bulles", `${question}a`),
      origine: { leconDOrigine: grandeLecon.id, position: 0, type: "bulles" as const },
    })),
    jourDesErreurs,
    erreursFaitesLe,
  );
  const seance = SeanceDeRevision.commencer({
    id: "revision-1",
    enfant: "profil-lea",
    plan: { questions: file.questions },
    lecons: [grandeLecon],
    tireurDe: () => tireurAuHasard(hasardSansMelange()),
    niveau: CE1,
  });
  file.questions.forEach(() => seance.repondre(Reponse.choix("a")));
  seance.terminer(finDeLaRevision, jourDeLaRevision);

  assertThrows(
    () => revaliderLaSeanceDeRevision(seance.aEnregistrer(), file, [grandeLecon], CE1),
    SeanceDeRevisionIncoherente,
  );
});

Deno.test("une séance de révision qui pose deux fois la même question est refusée comme incohérente", () => {
  const [bateauRetenue] = laFileDuProfil().questions;

  assertIncoherent(jouer({ questions: [bateauRetenue, bateauRetenue] }));
});

Deno.test("un envoi avec moins de tirages que de questions est refusé comme incohérent", () => {
  const envoi = jouer();

  assertIncoherent({ ...envoi, tirages: envoi.tirages.slice(1) });
});

Deno.test("un envoi avec plus de tirages que de questions est refusé comme incohérent", () => {
  const envoi = jouer();

  assertIncoherent({ ...envoi, tirages: [...envoi.tirages, ["a", "b"]] });
});

Deno.test("un envoi avec plus de listes de réponses que de questions est refusé comme incohérent", () => {
  const envoi = jouer();

  assertIncoherent({ ...envoi, reponses: [...envoi.reponses, []] });
});

Deno.test("un envoi avec moins de listes de réponses que de questions est refusé comme incohérent", () => {
  const envoi = jouer();

  assertIncoherent({ ...envoi, reponses: envoi.reponses.slice(0, 1) });
});

Deno.test("un tirage qui n'est pas un ordre possible des choix est refusé comme incohérent", () => {
  const envoi = jouer();

  assertIncoherent({ ...envoi, tirages: [["inconnue", "autre"], ...envoi.tirages.slice(1)] });
});

Deno.test("des réponses mal réparties entre les questions sont refusées même si elles se suivent dans le bon ordre une fois mises bout à bout", () => {
  const envoi = jouer();
  const [premieres, secondes] = envoi.reponses;
  const [jePasse, bonnePremiere] = premieres;
  const malReparties = [[jePasse], [bonnePremiere, ...secondes]];

  assertEquals(malReparties.flat(), envoi.reponses.flat());
  assertIncoherent({ ...envoi, reponses: malReparties });
});

Deno.test("une question dont les réponses ne finissent pas par la bonne réponse est refusée comme incohérente", () => {
  const envoi = jouer();

  assertIncoherent({ ...envoi, reponses: [envoi.reponses[0], [jeNeSaisPas]] });
});

Deno.test("une réponse donnée après la réussite d'une question est refusée comme incohérente", () => {
  const envoi = jouer();
  const [premieres, secondes] = envoi.reponses;

  assertIncoherent({ ...envoi, reponses: [[...premieres, premieres[1]], secondes] });
});

Deno.test("une question sans aucune réponse est refusée comme incohérente", () => {
  const envoi = jouer();

  assertIncoherent({ ...envoi, reponses: [envoi.reponses[0], []] });
});

Deno.test("une réponse par placement est refusée comme incohérente", () => {
  const envoi = jouer();
  const [premieres, secondes] = envoi.reponses;

  assertIncoherent({ ...envoi, reponses: [[Reponse.placement("etiquette"), ...premieres], secondes] });
});

Deno.test("un jour d'avance de 14 heures sur l'heure UTC de fin (Pacifique, UTC+14) est accepté", () => {
  const maintenant = new Date("2026-10-25T17:00:00Z");

  const revalide = revalider(jouer({ maintenant, jour: Jour.de("2026-10-26") }));

  assertEquals(revalide.jour.toString(), "2026-10-26");
});

Deno.test("un jour de retard de 12 heures sur l'heure UTC de fin (UTC-12) est accepté", () => {
  const maintenant = new Date("2026-10-25T03:00:00Z");

  const revalide = revalider(jouer({ maintenant, jour: Jour.de("2026-10-24") }));

  assertEquals(revalide.jour.toString(), "2026-10-24");
});

Deno.test("un jour trop éloigné de la date de fin, après, est refusé comme incohérent", () => {
  assertIncoherent(jouer({ jour: Jour.de("2026-10-27") }));
});

Deno.test("un jour trop éloigné de la date de fin, avant, est refusé comme incohérent", () => {
  assertIncoherent(jouer({ jour: Jour.de("2026-10-23") }));
});

Deno.test("un jour illisible est refusé comme incohérent", () => {
  assertIncoherent({ ...jouer(), jour: "demain" });
});
