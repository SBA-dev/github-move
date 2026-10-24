import { assert, assertEquals, assertThrows } from "@std/assert";
import {
  affichageDesCases,
  ecrire,
  leconDeDicteeDArcEnCiel,
  leconDeDicteeDAujourdhui,
  leconDeDicteeDeChatEtLapin,
  leconDeDicteeDeParis,
  leconDeDicteeDuChat,
  profilDeDictee,
  seanceDeDictee,
} from "../../test_utils/lecons-de-dictee.ts";
import { CleDeQuestion } from "../cle-de-question.ts";
import { JeNeSaisPasDejaDit, MotIncomplet, PasDeLettreAEffacer, ToucheDejaUtilisee } from "../erreurs.ts";
import { Reponse } from "../reponse.ts";

const CLAVIER_COMPLET_CP = profilDeDictee("clavierComplet", "CP");

function questionEnCours(seance: ReturnType<typeof seanceDeDictee>) {
  const question = seance.questionDeDicteeEnCours();
  assert(question);
  return question;
}

Deno.test("une dictée pose une question par mot, avec une case par lettre et aucune lettre écrite", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  assertEquals(affichageDesCases(questionEnCours(seance)), "____");
});

Deno.test("les caractères déjà écrits sont dans les cases dès le début", () => {
  const seance = seanceDeDictee(leconDeDicteeDAujourdhui());

  assertEquals(affichageDesCases(questionEnCours(seance)), "_______'___");
});

Deno.test("chaque lettre tapée remplit la case à écrire suivante, en sautant les caractères déjà écrits", () => {
  const seance = seanceDeDictee(leconDeDicteeDArcEnCiel());

  ecrire(seance, "arcen");

  assertEquals(affichageDesCases(questionEnCours(seance)), "arc-en-____");
});

Deno.test("une lettre tapée en majuscule est montrée en minuscule", () => {
  const seance = seanceDeDictee(leconDeDicteeDeParis());

  seance.taper("P");

  assertEquals(affichageDesCases(questionEnCours(seance)), "p____");
});

Deno.test("avec les lettres du mot, une touche déjà utilisée ne sert pas une seconde fois", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  seance.taper("c");

  assertThrows(() => seance.taper("c"), ToucheDejaUtilisee);
});

Deno.test("avec les lettres du mot, « Effacer » retire la dernière lettre et rend sa touche", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  seance.taper("c");

  seance.effacer();

  assertEquals(affichageDesCases(questionEnCours(seance)), "____");
  seance.taper("c");
  assertEquals(affichageDesCases(questionEnCours(seance)), "c___");
});

Deno.test("avec le clavier complet, une même touche sert autant de fois qu'on veut", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);

  ecrire(seance, "cc");

  assertEquals(affichageDesCases(questionEnCours(seance)), "cc__");
});

Deno.test("« Effacer » sans lettre écrite est refusé", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  assertThrows(() => seance.effacer(), PasDeLettreAEffacer);
});

Deno.test("le mot est corrigé dès que la dernière case est remplie : une lettre de moins, rien n'est corrigé", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  assertEquals(ecrire(seance, "cha"), undefined);
  assertEquals(seance.erreurs(), 0);
});

Deno.test("le mot bien écrit est réussi dès sa dernière lettre", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  const resultat = ecrire(seance, "chat");

  assertEquals(resultat, "juste");
  assertEquals(seance.estFinie(), true);
});

Deno.test("la correction ne tient pas compte des majuscules : « Paris » s'écrit « paris »", () => {
  const seance = seanceDeDictee(leconDeDicteeDeParis());

  assertEquals(ecrire(seance, "paris"), "juste");
});

Deno.test("un mot mal écrit est une réponse fausse, et la question reste posée", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);

  assertEquals(ecrire(seance, "chas"), "fausse");
  assertEquals(seance.estFinie(), false);
});

Deno.test("après une faute, le début juste est gardé et les lettres fausses sont signalées", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);

  ecrire(seance, "chas");

  assertEquals(affichageDesCases(questionEnCours(seance)), "cha_");
  assertEquals(seance.derniereCorrection()?.lettresFausses, [{ position: 3, lettre: "s" }]);
});

Deno.test("après une faute, les touches des lettres retirées reviennent, pas celles des lettres gardées", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  ecrire(seance, "chta");

  seance.taper("t");
  assertEquals(affichageDesCases(questionEnCours(seance)), "cht_");
  assertThrows(() => seance.taper("c"), ToucheDejaUtilisee);
});

Deno.test("un mot mal écrit coûte une seule erreur, quel que soit le nombre de lettres fausses", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);

  ecrire(seance, "bxyz");

  assertEquals(seance.erreurs(), 1);
});

Deno.test("un mot réussi après une erreur garde cette erreur", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);
  ecrire(seance, "bxyz");

  ecrire(seance, "chat");

  assertEquals(seance.erreurs(), 1);
  assertEquals(seance.etoiles().nombre, 2);
});

Deno.test("un mot bien écrit n'a aucune lettre fausse", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  ecrire(seance, "chat");

  assertEquals(seance.derniereCorrection()?.lettresFausses, []);
});

Deno.test("la réponse enregistrée est le mot écrit en entier, une seule fois", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  ecrire(seance, "chat");
  seance.terminer(new Date("2026-10-24T10:30:00Z"));

  assertEquals(seance.aEnregistrer().reponses, [[Reponse.motEcrit(["c", "h", "a", "t"])]]);
});

Deno.test("répondre par le mot écrit en entier corrige comme la saisie lettre à lettre", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  assertEquals(seance.repondre(Reponse.motEcrit(["c", "h", "a", "s"])), "fausse");
  assertEquals(seance.repondre(Reponse.motEcrit(["c", "h", "a", "t"])), "juste");
});

Deno.test("répondre par un mot incomplet est refusé", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  assertThrows(() => seance.repondre(Reponse.motEcrit(["c", "h", "a"])), MotIncomplet);
});

Deno.test("« Je ne sais pas » écrit la lettre juste suivante dans sa case", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  const aide = seance.direJeNeSaisPas();

  assertEquals(affichageDesCases(questionEnCours(seance)), "c___");
  assertEquals(aide.bonneReponse, "c");
  assertEquals(aide.maniere, "ecrire");
});

Deno.test("« Je ne sais pas » écrit la lettre juste après les lettres gardées", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  ecrire(seance, "ch");

  seance.direJeNeSaisPas();

  assertEquals(affichageDesCases(questionEnCours(seance)), "cha_");
});

Deno.test("« Je ne sais pas » remplace les lettres fausses déjà tapées par la lettre juste", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);
  ecrire(seance, "cx");

  seance.direJeNeSaisPas();

  assertEquals(affichageDesCases(questionEnCours(seance)), "ch__");
});

Deno.test("« Je ne sais pas » ne montre jamais le mot en entier : la dernière case reste vide", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  ecrire(seance, "cha");

  seance.direJeNeSaisPas();

  assertEquals(affichageDesCases(questionEnCours(seance)), "cha_");
  assertEquals(seance.estFinie(), false);
});

Deno.test("« Je ne sais pas » compte une erreur, et la question reste à réussir", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  seance.direJeNeSaisPas();

  assertEquals(seance.erreurs(), 1);
  assertEquals(seance.estFinie(), false);
});

Deno.test("« Je ne sais pas » après une erreur n'ajoute pas d'erreur", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);
  ecrire(seance, "chas");

  seance.direJeNeSaisPas();

  assertEquals(seance.erreurs(), 1);
});

Deno.test("après « Je ne sais pas », un mot faux ne coûte plus d'erreur", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);
  seance.direJeNeSaisPas();

  ecrire(seance, "chxx");

  assertEquals(seance.erreurs(), 1);
});

Deno.test("« Je ne sais pas » ne se dit qu'une fois par mot", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  seance.direJeNeSaisPas();

  assertThrows(() => seance.direJeNeSaisPas(), JeNeSaisPasDejaDit);
});

Deno.test("le mot dicté est dit avec sa phrase d'exemple, puis redemandé", () => {
  const seance = seanceDeDictee(leconDeDicteeDeChatEtLapin());

  assertEquals(questionEnCours(seance).texteDit(), "Écoute bien. chat. Le chat dort sur le lit. Écris : chat.");
});

Deno.test("sans phrase d'exemple, le mot dicté est dit sans phrase", () => {
  const seance = seanceDeDictee(leconDeDicteeDeChatEtLapin());
  ecrire(seance, "chat");

  assertEquals(questionEnCours(seance).texteDit(), "Écoute bien. lapin. Écris : lapin.");
});

Deno.test("réécouter le mot ne dit que le mot", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  assertEquals(questionEnCours(seance).motADire(), "chat");
});

Deno.test("le texte affiché ne contient pas le mot dicté", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  const texte = questionEnCours(seance).texteAffiche();

  assertEquals(texte, "Écoute bien et écris le mot que tu entends.");
  assertEquals(texte.includes("chat"), false);
});

Deno.test("après une erreur, l'aide est de regarder les lettres en rouge et d'écouter encore", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);

  ecrire(seance, "chas");

  assertEquals(seance.aideApresLaDerniereErreur(), "Regarde les lettres en rouge et écoute encore.");
  assertEquals(seance.paroleDueApresLaDerniereReponse(), undefined);
});

Deno.test("après le mot bien écrit, le personnage guide félicite puis dit que le mot est bien écrit", () => {
  const seance = seanceDeDictee(leconDeDicteeDeParis());

  ecrire(seance, "paris");

  assertEquals(seance.paroleDueApresLaDerniereReponse(), "felicitation");
  assertEquals(seance.suiteDeLaFelicitation(), "« Paris » est bien écrit !");
  assertEquals(seance.aideApresLaDerniereErreur(), undefined);
});

Deno.test("la clé de révision d'un mot dicté commence par « d: »", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);
  ecrire(seance, "chas");
  ecrire(seance, "t");

  assertEquals(seance.clesDesQuestionsRatees(), [CleDeQuestion.de("dictee", "chat")]);
  assertEquals(CleDeQuestion.de("dictee", "chat").valeur, "d:chat");
});
