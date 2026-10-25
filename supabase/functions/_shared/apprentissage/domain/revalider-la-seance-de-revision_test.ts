import { assertEquals } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { FileDeRevision } from "./file-de-revision.ts";
import { Jour } from "./jour.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeanceDeRevision } from "./revalider-la-seance-de-revision.ts";
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
    tireur: tireurAuHasard(hasardSansMelange()),
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
