import { assertEquals } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeBoiteAuCE1, leconDeBoiteAuCP } from "../test_utils/lecons-de-boite-et-barres.ts";
import { leconLesDoublesAuCP } from "../test_utils/lecons-de-calcul.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

function commencer(lecon: Lecon): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
  );
}

function boiteEnCours(seance: Seance) {
  const boite = seance.boiteEnCours();
  if (!boite) throw new Error("Aucune boîte en cours");
  return boite;
}

const deroulementDeQuatrePlusTrois = [
  "Je mets 4 jetons dans la boîte.",
  "Et j'en mets encore 3.",
  "La boîte est fermée. Combien y a-t-il de jetons dedans ? Réfléchis dans ta tête, avec tes doigts, ou en dessinant.",
];

Deno.test("au CP, la boîte 4 + 3 propose des choix autour du résultat", () => {
  const { mode } = boiteEnCours(commencer(leconDeBoiteAuCP()));

  assertEquals(mode.genre === "choix" ? [...mode.choix].sort() : [], ["6", "7", "8", "9"]);
});

Deno.test("au CP, une boîte dont le résultat dépasse 20 se joue au clavier de cristaux", () => {
  const seance = commencer(leconDeBoiteAuCP());
  seance.repondre(Reponse.choix("7"));

  assertEquals(boiteEnCours(seance).mode, { genre: "clavierDeCristaux" });
});

Deno.test("au CE1, la boîte 4 + 3 se joue au clavier de cristaux", () => {
  assertEquals(boiteEnCours(commencer(leconDeBoiteAuCE1())).mode, { genre: "clavierDeCristaux" });
});

Deno.test("la boîte en cours montre son déroulé", () => {
  assertEquals(boiteEnCours(commencer(leconDeBoiteAuCP())).deroulement, deroulementDeQuatrePlusTrois);
});

Deno.test("pendant une boîte, la séance ne montre aucun calcul", () => {
  assertEquals(commencer(leconDeBoiteAuCP()).calculEnCours(), undefined);
});

Deno.test("la séance ne montre plus de boîte quand la question en cours n'en est pas une", () => {
  assertEquals(commencer(leconLesDoublesAuCP()).boiteEnCours(), undefined);
});

Deno.test("une mauvaise réponse à une boîte compte une erreur, et la séance rend l'aide de la boîte", () => {
  const seance = commencer(leconDeBoiteAuCP());

  const resultat = seance.repondre(Reponse.choix("8"));

  assertEquals(resultat, "fausse");
  assertEquals(seance.aideApresLaDerniereErreur(), "Mets 4 dans ta tête, et avance de 3.");
});

Deno.test("une bonne réponse à une boîte passe à la boîte suivante", () => {
  const seance = commencer(leconDeBoiteAuCP());

  const resultat = seance.repondre(Reponse.choix("7"));

  assertEquals(resultat, "juste");
  assertEquals(boiteEnCours(seance).deroulement[0], "Je mets 15 jetons dans la boîte.");
});

Deno.test("« Je ne sais pas » est proposé pendant une boîte", () => {
  assertEquals(boiteEnCours(commencer(leconDeBoiteAuCP())).jeNeSaisPasPropose, true);
});

Deno.test("« Je ne sais pas » à une boîte rend l'aide de la boîte", () => {
  const seance = commencer(leconDeBoiteAuCE1());

  const aide = seance.direJeNeSaisPas();

  assertEquals(aide.aide, "Mets 4 dans ta tête, et avance de 3.");
});

Deno.test("« Je ne sais pas » à une boîte au clavier de cristaux montre la réponse à taper", () => {
  const seance = commencer(leconDeBoiteAuCE1());

  seance.direJeNeSaisPas();

  assertEquals(boiteEnCours(seance).reponseATaper, "7");
});
