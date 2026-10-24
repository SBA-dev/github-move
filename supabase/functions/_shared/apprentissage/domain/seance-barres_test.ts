import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeBarresAuCE1, leconDeBarresAuCP } from "../test_utils/lecons-de-boite-et-barres.ts";
import { leconLesDoublesAuCP } from "../test_utils/lecons-de-calcul.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { SeanceIncoherente } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const enonceDuMarche = "Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ?";
const enonceDesCrayons = "Lina a 9 crayons, dont 6 rouges. Combien de bleus ?";

function commencer(lecon: Lecon): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
  );
}

function schemaEnCours(seance: Seance) {
  const schema = seance.schemaEnCours();
  if (!schema) throw new Error("Aucun schéma en cours");
  return schema;
}

Deno.test("le schéma en cours montre l'énoncé du problème, son explication, sa forme et sa description", () => {
  const schema = schemaEnCours(commencer(leconDeBarresAuCP()));

  assertEquals(schema.enonce, enonceDuMarche);
  assertEquals(schema.explicationDuSchema, "Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche.");
  assertEquals(schema.forme, { genre: "partiesEtTout", parties: [4, 2], tout: null });
  assertEquals(schema.description, "Le tout : ?. Une partie : 4. L'autre partie : 2.");
});

Deno.test("au CP, un problème en barres propose des choix autour du résultat", () => {
  const { mode } = schemaEnCours(commencer(leconDeBarresAuCP()));

  assertEquals(mode.genre === "choix" ? [...mode.choix].sort() : [], ["5", "6", "7", "8"]);
});

Deno.test("au CP, un problème en barres dont le résultat dépasse 20 se joue au clavier de cristaux", () => {
  const seance = commencer(leconDeBarresAuCP());
  seance.repondre(Reponse.choix("6"));
  seance.repondre(Reponse.choix("3"));

  assertEquals(schemaEnCours(seance).mode, { genre: "clavierDeCristaux" });
});

Deno.test("au CE1, un problème en barres se joue au clavier de cristaux", () => {
  assertEquals(schemaEnCours(commencer(leconDeBarresAuCE1())).mode, { genre: "clavierDeCristaux" });
});

Deno.test("hors schéma en barres, la séance ne montre aucun schéma", () => {
  assertEquals(commencer(leconLesDoublesAuCP()).schemaEnCours(), undefined);
});

Deno.test("pendant un schéma en barres, la séance ne montre ni calcul ni boîte", () => {
  const seance = commencer(leconDeBarresAuCP());

  assertEquals([seance.calculEnCours(), seance.boiteEnCours()], [undefined, undefined]);
});

Deno.test("« Je ne sais pas » est proposé pendant un schéma en barres", () => {
  assertEquals(schemaEnCours(commencer(leconDeBarresAuCP())).jeNeSaisPasPropose, true);
});

Deno.test("après une mauvaise réponse, l'aide est celle de la forme du schéma quand le problème n'a pas d'aide", () => {
  const seance = commencer(leconDeBarresAuCP());

  const resultat = seance.repondre(Reponse.choix("7"));

  assertEquals(resultat, "fausse");
  assertEquals(seance.aideApresLaDerniereErreur(), "Regarde le schéma : cherches-tu le tout, ou une partie ?");
});

Deno.test("après une mauvaise réponse, l'aide est celle du problème quand il en a une", () => {
  const seance = commencer(leconDeBarresAuCP());
  seance.repondre(Reponse.choix("6"));

  seance.repondre(Reponse.choix("4"));

  assertEquals(
    seance.aideApresLaDerniereErreur(),
    "On connaît le tout, 9, et une partie, 6. On cherche l'autre partie.",
  );
});

Deno.test("« Je ne sais pas » à un problème en barres rend la même aide", () => {
  const aide = commencer(leconDeBarresAuCE1()).direJeNeSaisPas();

  assertEquals(aide.aide, "Regarde le schéma : cherches-tu le tout, ou une partie ?");
});

Deno.test("« Je ne sais pas » à un problème en barres au clavier de cristaux montre la réponse à taper", () => {
  const seance = commencer(leconDeBarresAuCE1());

  seance.direJeNeSaisPas();

  assertEquals(schemaEnCours(seance).reponseATaper, "6");
});

Deno.test("après la bonne réponse, le schéma garde sa forme et donne la réponse et l'explication", () => {
  const seance = commencer(leconDeBarresAuCP());

  seance.repondre(Reponse.choix("6"));

  assertEquals(seance.schemaApresLaDerniereReponse(), {
    forme: { genre: "partiesEtTout", parties: [4, 2], tout: null },
    reponse: 6,
    explication: "4 + 2 = 6. J'ai 6 pommes.",
  });
});

Deno.test("après une mauvaise réponse, aucun schéma n'est donné comme résolu", () => {
  const seance = commencer(leconDeBarresAuCP());

  seance.repondre(Reponse.choix("7"));

  assertEquals(seance.schemaApresLaDerniereReponse(), undefined);
});

Deno.test("une séance de barres terminée compte ses questions sous le type « barres » et garde le problème raté", () => {
  const seance = commencer(leconDeBarresAuCP());
  seance.repondre(Reponse.choix("7"));
  seance.repondre(Reponse.choix("6"));
  seance.repondre(Reponse.choix("3"));
  seance.repondre(Reponse.nombre(24));

  const fait = seance.terminer(new Date("2026-10-23T10:30:00Z"));

  assertEquals(fait.parType.barres, { reussites: 3, erreurs: 1 });
  assertEquals(fait.questionsRatees.map(({ cle }) => cle.valeur), [CleDeQuestion.de("barres", enonceDuMarche).valeur]);
  assertEquals(CleDeQuestion.de("barres", enonceDesCrayons).valeur.startsWith("p:"), true);
});

const fin = new Date("2026-10-23T10:30:00Z");

function seanceDeBarresAuCPTerminee(lecon: Lecon): Seance {
  const seance = commencer(lecon);
  seance.repondre(Reponse.choix("7"));
  seance.repondre(Reponse.choix("6"));
  seance.repondre(Reponse.choix("3"));
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.nombre(24));
  return seance;
}

function seanceDeBarresAuCE1Terminee(lecon: Lecon): Seance {
  const seance = commencer(lecon);
  seance.repondre(Reponse.nombre(7));
  seance.repondre(Reponse.nombre(6));
  seance.repondre(Reponse.nombre(3));
  seance.repondre(Reponse.nombre(24));
  return seance;
}

Deno.test("rejouer une séance de barres au CP, avec une erreur, un « Je ne sais pas » et un clavier, redonne le même résultat", () => {
  const lecon = leconDeBarresAuCP();
  const seance = seanceDeBarresAuCPTerminee(lecon);
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(lecon, seance.aEnregistrer()), fait);
});

Deno.test("rejouer une séance de barres au CE1, faite au clavier de cristaux, redonne le même résultat", () => {
  const lecon = leconDeBarresAuCE1();
  const seance = seanceDeBarresAuCE1Terminee(lecon);
  const fait = seance.terminer(fin);

  assertEquals(revaliderLaSeance(lecon, seance.aEnregistrer()), fait);
});

Deno.test("une réponse par choix là où le problème en barres attend le clavier de cristaux rend la séance incohérente", () => {
  const lecon = leconDeBarresAuCE1();
  const seance = seanceDeBarresAuCE1Terminee(lecon);
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const reponses = envoi.reponses.map((donnees, rang) => rang === 1 ? [Reponse.choix("6")] : donnees);

  assertThrows(() => revaliderLaSeance(lecon, { ...envoi, reponses }), SeanceIncoherente);
});

Deno.test("une réponse en trop à un problème en barres rend la séance incohérente", () => {
  const lecon = leconDeBarresAuCP();
  const seance = seanceDeBarresAuCPTerminee(lecon);
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const reponses = envoi.reponses.map((donnees, rang) => rang === 1 ? [...donnees, Reponse.choix("3")] : donnees);

  assertThrows(() => revaliderLaSeance(lecon, { ...envoi, reponses }), SeanceIncoherente);
});
