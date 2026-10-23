import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeBullesEtDEcoute, leconDeCalcul, leconDeDeuxExercicesCourts } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { SeanceDejaTerminee, SeanceNonFinie } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-23T10:30:00Z");

function commencer(
  lecon: Lecon,
  choix: ChoixDeSeance = ChoixDeSeance.complete(),
  hasard: Hasard = hasardSansMelange(),
) {
  const seance = Seance.commencer(generateurIdFixe("seance-1"), hasard, "profil-lea", lecon, choix);
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

function repondreFaux(seance: Seance, ...textes: string[]): void {
  textes.forEach((texte) => seance.repondre(Reponse.choix(texte)));
}

function finirSansErreur(seance: Seance): void {
  while (!seance.estFinie()) seance.repondre(Reponse.choix("ou"));
}

function seanceDeTroisQuestionsAvecErreurs(...erreursParQuestion: [number, number, number]): Seance {
  const seance = commencer(leconDeDeuxExercicesCourts());
  const fausses = ["on", "an"];
  erreursParQuestion.forEach((erreurs) => {
    repondreFaux(seance, ...fausses.slice(0, erreurs));
    seance.repondre(Reponse.choix("ou"));
  });
  return seance;
}

function seanceBullesEtEcouteTerminee(): Seance {
  const seance = commencer(leconDeBullesEtDEcoute());
  seance.repondre(Reponse.choix("on"));
  seance.repondre(Reponse.choix("ou"));
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.choix("chat"));
  return seance;
}

Deno.test("les erreurs d'une séance sont la somme des erreurs de toutes ses questions", () => {
  const seance = seanceDeTroisQuestionsAvecErreurs(2, 1, 0);

  assertEquals(seance.erreurs(), 3);
});

Deno.test("dire « Je ne sais pas » compte une erreur dans la séance", () => {
  const seance = commencer(leconDeCalcul());
  seance.direJeNeSaisPas();

  assertEquals(seance.erreurs(), 1);
});

Deno.test("une séance sans erreur donne 3 étoiles", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());
  finirSansErreur(seance);

  assertEquals(seance.etoiles().nombre, 3);
});

Deno.test("une séance avec 3 erreurs réparties sur plusieurs questions donne 2 étoiles", () => {
  assertEquals(seanceDeTroisQuestionsAvecErreurs(2, 1, 0).etoiles().nombre, 2);
});

Deno.test("une séance avec 4 erreurs donne 1 étoile", () => {
  assertEquals(seanceDeTroisQuestionsAvecErreurs(2, 2, 0).etoiles().nombre, 1);
});

Deno.test("une séance dont une question n'est pas réussie ne peut pas être terminée", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());
  seance.repondre(Reponse.choix("ou"));

  assertThrows(() => seance.terminer(fin), SeanceNonFinie);
});

Deno.test("une séance déjà terminée ne peut pas être terminée une seconde fois", () => {
  const seance = commencer(leconDeCalcul());
  seance.repondre(Reponse.choix("7"));
  seance.terminer(fin);

  assertThrows(() => seance.terminer(fin), SeanceDejaTerminee);
});

Deno.test("terminer une séance produit le fait SeanceTerminee avec la séance, le profil, la leçon, le choix et la date de fin", () => {
  const seance = commencer(leconDeCalcul(), ChoixDeSeance.unExercice(0));
  seance.repondre(Reponse.choix("7"));

  const fait = seance.terminer(fin);

  assertEquals(
    [fait.type, fait.seance, fait.enfant, fait.lecon, fait.choix, fait.termineeLe],
    ["SeanceTerminee", "seance-1", "profil-lea", "ma-cp-calcul", ChoixDeSeance.unExercice(0), fin],
  );
});

Deno.test("une séance d'un seul exercice sans erreur donne aussi 3 étoiles", () => {
  const seance = commencer(leconDeCalcul(), ChoixDeSeance.unExercice(0));
  seance.repondre(Reponse.choix("7"));

  const fait = seance.terminer(fin);

  assertEquals([fait.etoiles, fait.erreurs], [3, 0]);
});

Deno.test("le fait SeanceTerminee porte les étoiles et les erreurs de la séance", () => {
  const fait = seanceBullesEtEcouteTerminee().terminer(fin);

  assertEquals([fait.etoiles, fait.erreurs], [2, 2]);
});

Deno.test("le fait SeanceTerminee liste les questions ratées avec leur clé, leurs erreurs et « Je ne sais pas »", () => {
  const fait = seanceBullesEtEcouteTerminee().terminer(fin);

  assertEquals(fait.questionsRatees, [
    {
      cle: CleDeQuestion.de("bulles", "Dans le mot « poule », quel son entends-tu ?ou"),
      erreurs: 1,
      jeNeSaisPas: false,
    },
    { cle: CleDeQuestion.de("ecoute", "cat"), erreurs: 1, jeNeSaisPas: true },
  ]);
});

Deno.test("le fait SeanceTerminee ne liste pas les questions réussies sans erreur", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());
  repondreFaux(seance, "on");
  finirSansErreur(seance);

  assertEquals(seance.terminer(fin).questionsRatees.length, 1);
});

Deno.test("le fait SeanceTerminee compte les réussites et les erreurs par type d'exercice", () => {
  const fait = seanceBullesEtEcouteTerminee().terminer(fin);

  assertEquals(fait.parType, {
    bulles: { reussites: 1, erreurs: 1 },
    ecoute: { reussites: 1, erreurs: 1 },
  });
});

Deno.test("la séance terminée garde les tirages et la suite des réponses de chaque question, « Je ne sais pas » compris", () => {
  const seance = commencer(leconDeCalcul(), ChoixDeSeance.complete(), hasardFixe(0, 0, 0));
  const tirage = seance.exerciceEnCours()?.questionEnCours()?.choix.textes();
  seance.repondre(Reponse.choix("8"));
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.choix("7"));
  seance.terminer(fin);

  assertEquals(seance.aEnregistrer(), {
    seance: "seance-1",
    lecon: "ma-cp-calcul",
    choix: ChoixDeSeance.complete(),
    tirages: [tirage],
    reponses: [[Reponse.choix("8"), { genre: "jeNeSaisPas" }, Reponse.choix("7")]],
    termineeLe: fin,
  });
});
