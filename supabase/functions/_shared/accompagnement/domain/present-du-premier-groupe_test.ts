import { assertEquals } from "@std/assert";
import { presentDuPremierGroupe, verbeAConjuguer } from "./present-du-premier-groupe.ts";

const formes = (infinitif: string) =>
  presentDuPremierGroupe(infinitif).map(({ pronom, forme }) => `${pronom} ${forme}`);

Deno.test("le présent de « chanter » donne les six formes, de je à ils", () => {
  assertEquals(presentDuPremierGroupe("chanter"), [
    { pronom: "je", forme: "chante" },
    { pronom: "tu", forme: "chantes" },
    { pronom: "il", forme: "chante" },
    { pronom: "nous", forme: "chantons" },
    { pronom: "vous", forme: "chantez" },
    { pronom: "ils", forme: "chantent" },
  ]);
});

Deno.test("un verbe en -ger garde le e à « nous » : nous mangeons", () => {
  assertEquals(formes("manger")[3], "nous mangeons");
});

Deno.test("un verbe en -cer prend un ç à « nous » : nous lançons", () => {
  assertEquals(formes("lancer")[3], "nous lançons");
});

Deno.test("« je » devient « j' » devant une voyelle : j'aime", () => {
  assertEquals(formes("aimer")[0], "j' aime");
});

Deno.test("« je » devient « j' » devant un h muet : j'habite", () => {
  assertEquals(formes("habiter")[0], "j' habite");
});

for (const verbe of ["hurler", "hacher", "hisser", "hausser", "heurter"]) {
  Deno.test(`« je » reste « je » devant le h aspiré de « ${verbe} »`, () => {
    assertEquals(presentDuPremierGroupe(verbe)[0].pronom, "je");
  });
}

Deno.test("le premier verbe régulier du 1er groupe est celui à conjuguer", () => {
  assertEquals(verbeAConjuguer(["finir", "chanter", "manger"]), "chanter");
});

Deno.test("les verbes irréguliers du 1er groupe ne sont pas à conjuguer", () => {
  assertEquals(
    verbeAConjuguer(["lever", "payer", "appeler", "jeter", "céder", "aller", "aimer"]),
    "aimer",
  );
});

Deno.test("sans verbe régulier du 1er groupe, il n'y a rien à conjuguer", () => {
  assertEquals(verbeAConjuguer(["finir", "prendre"]), undefined);
});
