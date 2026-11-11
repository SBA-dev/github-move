import { assert, assertEquals } from "@std/assert";
import { avecSonTexteDeRemplacement, sansLePrenom } from "./texte-enregistre-de-remplacement.ts";
import { parolesFixes } from "./paroles-fixes.ts";
import { saluer } from "./paroles.ts";
import { accueillirSurLaPageDeLaLecon, parolesDeFinDeSeance } from "./paroles-de-seance.ts";
import { feteDeLaQueteAccomplie } from "./paroles-de-la-quete.ts";
import { inviterAReleverLeGrandDefi } from "./paroles-du-defi.ts";
import { UNIVERS } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

Deno.test("sans le prénom, « Bravo Léa ! » devient « Bravo ! »", () => {
  assertEquals(sansLePrenom("Bravo Léa !", "Léa"), "Bravo !");
});

Deno.test("sans le prénom, « Coucou Léa ! Je t'explique… » garde le reste de la phrase", () => {
  assertEquals(sansLePrenom("Coucou Léa ! Je t'explique la leçon.", "Léa"), "Coucou ! Je t'explique la leçon.");
});

Deno.test("sans le prénom, « Trois étoiles, Léa ! » perd aussi sa virgule", () => {
  assertEquals(sansLePrenom("Trois étoiles, Léa ! Tu es incroyable !", "Léa"), "Trois étoiles ! Tu es incroyable !");
});

Deno.test("sans le prénom, « Bravo Léa, tu as réussi. » garde la virgule qui suit", () => {
  assertEquals(sansLePrenom("Bravo Léa, tu as réussi.", "Léa"), "Bravo, tu as réussi.");
});

Deno.test("sans le prénom, « étoiles, Léa. » finit par un point", () => {
  assertEquals(sansLePrenom("Tu gagnes des étoiles, Léa. On rejoue ?", "Léa"), "Tu gagnes des étoiles. On rejoue ?");
});

Deno.test("une parole sans prénom reste identique", () => {
  assertEquals(sansLePrenom("Super !", "Léa"), "Super !");
});

Deno.test("une parole avec prénom fournit son texte enregistré de remplacement", () => {
  assertEquals(avecSonTexteDeRemplacement(saluer("Léa"), "Léa"), {
    texte: "Bonjour Léa !",
    texteEnregistreDeRemplacement: "Bonjour !",
  });
});

const paroles = (): string[] => {
  const prenom = "Léa";
  return [
    saluer(prenom),
    accueillirSurLaPageDeLaLecon(prenom),
    feteDeLaQueteAccomplie(prenom),
    inviterAReleverLeGrandDefi({ prenom, matiere: "maths" }),
    ...UNIVERS.map(({ personnageGuide }) => parolesDeFinDeSeance(3, prenom, personnageGuide, hasardFixe(0.99))),
  ];
};

Deno.test("les paroles fixes contiennent le texte de remplacement de chaque parole avec prénom", () => {
  const fixes = parolesFixes();
  for (const parole of paroles()) {
    const { texteEnregistreDeRemplacement } = avecSonTexteDeRemplacement(parole, "Léa");
    assert(fixes.includes(texteEnregistreDeRemplacement), texteEnregistreDeRemplacement);
  }
});

Deno.test("les paroles fixes ne contiennent aucun prénom d'enfant", () => {
  for (const parole of parolesFixes()) assert(!parole.includes("Léa"), parole);
});

Deno.test("sans le prénom, un prénom en début de parole est retiré et la phrase reprend sa majuscule", () => {
  assertEquals(sansLePrenom("Léa, tu as réussi !", "Léa"), "Tu as réussi !");
});

Deno.test("sans le prénom, un pseudo placé après la salutation laisse le même mot qui suit", () => {
  assertEquals(sansLePrenom("Bravo Lune ! Tu as regardé la Lune.", "Lune"), "Bravo ! Tu as regardé la Lune.");
});

Deno.test("sans le prénom, un prénom qui n'est que le début d'un autre mot n'est pas touché", () => {
  assertEquals(sansLePrenom("Bravo Léane !", "Léa"), "Bravo Léane !");
});
