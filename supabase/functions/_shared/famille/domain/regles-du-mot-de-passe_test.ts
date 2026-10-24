import { assertEquals } from "@std/assert";
import {
  CARACTERES_SPECIAUX_ACCEPTES,
  type EtatDesRegles,
  ReglesDuMotDePasse,
} from "./regles-du-mot-de-passe.ts";

function reglesRespectees(etat: EtatDesRegles): string[] {
  return etat.filter((regle) => regle.respectee).map((regle) => regle.regle);
}

Deno.test("une saisie vide ne respecte aucune des 4 règles", () => {
  const etat = ReglesDuMotDePasse.verifier("");

  assertEquals(etat.length, 4);
  assertEquals(reglesRespectees(etat), []);
});

Deno.test("les règles sont rendues dans l'ordre d'affichage", () => {
  const etat = ReglesDuMotDePasse.verifier("");

  assertEquals(etat.map((regle) => regle.regle), [
    "huitCaracteres",
    "uneMajuscule",
    "uneMinuscule",
    "unCaractereSpecial",
  ]);
});

Deno.test("chaque règle porte son libellé court", () => {
  const etat = ReglesDuMotDePasse.verifier("");

  assertEquals(etat.map((regle) => regle.libelle), [
    "8 caractères",
    "une majuscule",
    "une minuscule",
    "un caractère spécial",
  ]);
});

Deno.test("vérifier ne lève jamais d'erreur, même sur une saisie très longue ou étrange", () => {
  const saisies = ["", " ", "\u0000", "😀".repeat(500), "A".repeat(10_000)];

  for (const saisie of saisies) {
    assertEquals(ReglesDuMotDePasse.verifier(saisie).length, 4);
  }
});

Deno.test("vérifier est pure : la même saisie rend le même état", () => {
  assertEquals(
    ReglesDuMotDePasse.verifier("Abcdefg%"),
    ReglesDuMotDePasse.verifier("Abcdefg%"),
  );
});

Deno.test("huit minuscules respectent seulement 8 caractères et une minuscule", () => {
  const etat = ReglesDuMotDePasse.verifier("abcdefgh");

  assertEquals(reglesRespectees(etat), ["huitCaracteres", "uneMinuscule"]);
});

Deno.test("sept caractères ne respectent pas la règle des 8 caractères", () => {
  const etat = ReglesDuMotDePasse.verifier("Abcde%g");

  assertEquals(reglesRespectees(etat), [
    "uneMajuscule",
    "uneMinuscule",
    "unCaractereSpecial",
  ]);
});

Deno.test("sans minuscule, seules 8 caractères, une majuscule et un caractère spécial sont respectées", () => {
  const etat = ReglesDuMotDePasse.verifier("ABCDEFG%");

  assertEquals(reglesRespectees(etat), [
    "huitCaracteres",
    "uneMajuscule",
    "unCaractereSpecial",
  ]);
});

Deno.test("un mot de passe complet respecte les 4 règles", () => {
  const etat = ReglesDuMotDePasse.verifier("Abcdefg%");

  assertEquals(reglesRespectees(etat), [
    "huitCaracteres",
    "uneMajuscule",
    "uneMinuscule",
    "unCaractereSpecial",
  ]);
});

Deno.test("une minuscule accentuée compte comme minuscule mais pas comme caractère spécial", () => {
  const etat = ReglesDuMotDePasse.verifier("Abcdefgù");

  assertEquals(reglesRespectees(etat), [
    "huitCaracteres",
    "uneMajuscule",
    "uneMinuscule",
  ]);
});

Deno.test("une majuscule accentuée compte comme majuscule", () => {
  const etat = ReglesDuMotDePasse.verifier("Écolier%");

  assertEquals(reglesRespectees(etat), [
    "huitCaracteres",
    "uneMajuscule",
    "uneMinuscule",
    "unCaractereSpecial",
  ]);
});

Deno.test("la liste des caractères spéciaux acceptés contient exactement les 14 caractères du modèle", () => {
  assertEquals(
    [...CARACTERES_SPECIAUX_ACCEPTES].sort(),
    [..."&#{}()[]$€%@!?"].sort(),
  );
  assertEquals(CARACTERES_SPECIAUX_ACCEPTES.length, 14);
});

for (const caractere of "&#{}()[]$€%@!?") {
  Deno.test(`le caractère ${caractere} compte comme caractère spécial`, () => {
    const etat = ReglesDuMotDePasse.verifier(`Abcdefg${caractere}`);

    assertEquals(reglesRespectees(etat).includes("unCaractereSpecial"), true);
  });
}

for (const [description, saisie] of [
  ["un chiffre et un tiret", "Abcdef1-"],
  ["une étoile", "Abcdefg*"],
  ["un tiret bas", "Abcdefg_"],
  ["un point", "Abcdefg."],
  ["une espace", "Abcdefg "],
] as const) {
  Deno.test(`${description} ne compte pas comme caractère spécial`, () => {
    const etat = ReglesDuMotDePasse.verifier(saisie);

    assertEquals(reglesRespectees(etat).includes("unCaractereSpecial"), false);
  });
}

Deno.test("le symbole € compte pour un seul caractère dans la longueur", () => {
  const etat = ReglesDuMotDePasse.verifier("Abcdef€");

  assertEquals(reglesRespectees(etat).includes("huitCaracteres"), false);
});

Deno.test("huit caractères dont un € respectent la règle des 8 caractères", () => {
  const etat = ReglesDuMotDePasse.verifier("Abcdefg€");

  assertEquals(reglesRespectees(etat).includes("huitCaracteres"), true);
});
