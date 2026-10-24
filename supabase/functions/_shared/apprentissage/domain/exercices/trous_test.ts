import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../../test_utils/generateur-id-fixe.ts";
import { hasardFixe, hasardSansMelange } from "../../test_utils/hasard-fixe.ts";
import {
  leconAOuAAccent,
  leconDeDeuxTrous,
  leconDeTrousAvecBeaucoupDeCandidats,
} from "../../test_utils/lecons-de-trous.ts";
import { ChoixDeSeance } from "../choix-de-seance.ts";
import { CleDeQuestion } from "../cle-de-question.ts";
import { SeanceIncoherente } from "../erreurs.ts";
import type { Hasard } from "../hasard.ts";
import { type QuestionJouee, questionsJoueesDe } from "../question-jouee.ts";
import { Reponse } from "../reponse.ts";
import { revaliderLaSeance } from "../revalider-la-seance.ts";
import { Seance } from "../seance.ts";

function questionsDe(lecon: Lecon, hasard: Hasard = hasardSansMelange()): QuestionJouee[] {
  return questionsJoueesDe(lecon.exercices[0], hasard);
}

function commencer(lecon: Lecon, hasard: Hasard = hasardSansMelange()): Seance {
  const seance = Seance.commencer(generateurIdFixe("seance-1"), hasard, "profil-lea", lecon, ChoixDeSeance.complete());
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

Deno.test("un texte à trous pose une question par trou, dans l'ordre du texte", () => {
  const questions = questionsDe(leconDeDeuxTrous());

  assertEquals(questions.map((question) => question.enonce), ["Je … ici.", "Tu … là."]);
});

Deno.test("la clé d'une question de trou est faite avec la phrase qui contient le trou", () => {
  const [premiere] = questionsDe(leconDeDeuxTrous());

  assertEquals(premiere.cle, CleDeQuestion.de("trous", "Je … ici."));
});

Deno.test("un trou propose le mot attendu et deux autres mots tous différents", () => {
  const [premiere] = questionsDe(leconDeTrousAvecBeaucoupDeCandidats());
  const choix = premiere.choix.textes();

  assertEquals(choix.length, 3);
  assertEquals(new Set(choix).size, 3);
  assertEquals(choix.includes("suis"), true);
});

Deno.test("les autres mots d'un trou viennent des distracteurs et des autres mots attendus", () => {
  const [, deuxieme] = questionsDe(leconDeDeuxTrous());

  assertEquals([...deuxieme.choix.textes()].sort(), ["es", "sont", "suis"]);
});

Deno.test("« a » et « à » sont proposés ensemble à chaque trou", () => {
  const questions = questionsDe(leconAOuAAccent());

  assertEquals(questions.map((question) => [...question.choix.textes()].sort()), [["a", "à"], ["a", "à"]]);
});

Deno.test("les choix d'un trou sont mélangés une seule fois, au début de la séance", () => {
  const sansMelange = questionsDe(leconDeTrousAvecBeaucoupDeCandidats(), hasardSansMelange())[0];
  const melange = questionsDe(leconDeTrousAvecBeaucoupDeCandidats(), { entre0et1: () => 0 })[0];

  assertEquals(melange.choix.textes().join() === sansMelange.choix.textes().join(), false);
  assertEquals(melange.tirage(), melange.choix.textes());
});

Deno.test("un mauvais mot est écarté, et l'aide invite à relire la phrase en entier", () => {
  const [premiere] = questionsDe(leconDeDeuxTrous());

  const resultat = premiere.repondre(Reponse.choix("es"));

  assertEquals([resultat, premiere.choix.ecartes(), premiere.aideApresErreur()], [
    "fausse",
    ["es"],
    "Relis la phrase en entier : quel mot va bien ?",
  ]);
});

Deno.test("après deux erreurs, il ne reste que le mot attendu", () => {
  const [premiere] = questionsDe(leconDeDeuxTrous());

  premiere.repondre(Reponse.choix("es"));
  premiere.repondre(Reponse.choix("sont"));

  assertEquals(premiere.choix.possibles(), ["suis"]);
});

Deno.test("« Je ne sais pas » montre le mot attendu d'un trou et coûte une erreur", () => {
  const [premiere] = questionsDe(leconDeDeuxTrous());

  const aide = premiere.direJeNeSaisPas();

  assertEquals([aide.bonneReponse, premiere.choix.possibles(), premiere.erreurs], ["suis", ["suis"], 1]);
});

Deno.test("le bon mot s'écrit dans le trou et le trou suivant devient le trou en cours", () => {
  const seance = commencer(leconDeDeuxTrous());

  seance.repondre(Reponse.choix("suis"));

  assertEquals(seance.exerciceEnCours()?.texteATrous(), [
    { type: "texte", texte: "Je " },
    { type: "trou", mot: "suis" },
    { type: "texte", texte: " ici. Tu " },
    { type: "trou", mot: undefined },
    { type: "texte", texte: " là." },
  ]);
  assertEquals(seance.exerciceEnCours()?.questionEnCours()?.enonce, "Tu … là.");
});

Deno.test("quand le dernier trou est rempli, le texte est complet", () => {
  const seance = commencer(leconDeDeuxTrous());
  const exercice = seance.exerciceEnCours();

  seance.repondre(Reponse.choix("suis"));
  seance.repondre(Reponse.choix("es"));

  assertEquals(exercice?.texteATrous().every((segment) => segment.type === "texte" || segment.mot !== undefined), true);
  assertEquals(exercice?.estReussi(), true);
});

Deno.test("un texte à trous rejoué avec ses tirages et ses réponses donne la même séance terminée", () => {
  const seance = commencer(leconDeDeuxTrous(), hasardFixe(0, 0, 0, 0));
  seance.repondre(Reponse.choix("es"));
  seance.repondre(Reponse.choix("suis"));
  seance.repondre(Reponse.choix("es"));
  const fait = seance.terminer(new Date("2026-10-23T10:30:00Z"));

  assertEquals(revaliderLaSeance(leconDeDeuxTrous(), seance.aEnregistrer()), fait);
});

Deno.test("un mot qui n'est pas proposé au trou rend la séance incohérente", () => {
  const seance = commencer(leconDeDeuxTrous());
  seance.repondre(Reponse.choix("suis"));
  seance.repondre(Reponse.choix("es"));
  seance.terminer(new Date("2026-10-23T10:30:00Z"));
  const envoi = seance.aEnregistrer();
  const falsifie = { ...envoi, reponses: [[Reponse.choix("chat")], envoi.reponses[1]] };

  assertThrows(() => revaliderLaSeance(leconDeDeuxTrous(), falsifie), SeanceIncoherente);
});
