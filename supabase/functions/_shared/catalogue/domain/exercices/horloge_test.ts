import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";
import { estUnTypeDExercice, libelleDuType } from "../type-d-exercice.ts";

function leconAvec(niveau: string, exercice: unknown): Record<string, unknown> {
  return {
    id: "ma-test-horloge",
    matiere: "maths",
    niveau,
    titre: "Lire l'heure",
    ordre: 4,
    programme: {
      section: "c2-mathematiques-cp-le-reperage-dans-le-temps",
      citation: "Lire l'heure.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

function exerciceHorloge(niveau: string, exercice: Record<string, unknown>) {
  const lu = lireLecon(leconAvec(niveau, { type: "horloge", ...exercice })).exercices[0];
  if (lu.type !== "horloge") throw new Error("exercice « horloge » attendu");
  return lu;
}

function lire(niveau: string, exercice: Record<string, unknown>) {
  return () => exerciceHorloge(niveau, exercice);
}

Deno.test("« horloge » est un type d'exercice connu, de libellé « L'horloge »", () => {
  assertEquals(estUnTypeDExercice("horloge"), true);
  assertEquals(libelleDuType("horloge"), "L'horloge");
});

Deno.test("un exercice « horloge » à lire donne son mode, sa consigne et ses items avec leur heure, moment et aide", () => {
  const exercice = exerciceHorloge("CE1", {
    consigne: "Quelle heure est-il ?",
    mode: "lire",
    precision: "quart-d-heure",
    items: [
      { heure: "2:15" },
      { heure: "14:30", moment: "apres-midi", aide: "La grande aiguille est sur le 6." },
    ],
  });

  assertEquals(exercice.mode, "lire");
  assertEquals(exercice.consigne, "Quelle heure est-il ?");
  assertEquals(exercice.precision.ecriture(), "quart-d-heure");
  assertEquals(exercice.items.map((item) => item.heure.ecriture()), ["2 h 15", "14 h 30"]);
  assertEquals(exercice.items.map((item) => item.moment), [undefined, "apres-midi"]);
  assertEquals(exercice.items.map((item) => item.aide), [undefined, "La grande aiguille est sur le 6."]);
});

Deno.test("un exercice « horloge » sans précision prend celle du niveau de la leçon", () => {
  assertEquals(exerciceHorloge("CP", { mode: "lire", items: [{ heure: "3:00" }] }).precision.ecriture(), "heure");
  assertEquals(
    exerciceHorloge("CE1", { mode: "lire", items: [{ heure: "3:15" }] }).precision.ecriture(),
    "quart-d-heure",
  );
  assertEquals(exerciceHorloge("CM2", { mode: "lire", items: [{ heure: "3:15:20" }] }).precision.ecriture(), "seconde");
});

Deno.test("un exercice « horloge » à placer est lu, sans consigne si elle est absente", () => {
  const exercice = exerciceHorloge("CP", { mode: "placer", items: [{ heure: "3:00" }, { heure: "12:00" }] });

  assertEquals(exercice.mode, "placer");
  assertEquals(exercice.consigne, undefined);
  assertEquals(exercice.items.map((item) => item.heure.ecriture()), ["3 h", "12 h"]);
});

Deno.test("un exercice « horloge » accepte une précision plus grossière que celle du niveau", () => {
  const exercice = exerciceHorloge("CE2", { mode: "lire", precision: "heure", items: [{ heure: "3:00" }] });

  assertEquals(exercice.precision.ecriture(), "heure");
});

const exercicesMalFormes: ReadonlyArray<[string, string, Record<string, unknown>]> = [
  ["un mode inconnu", "CE1", { mode: "regarder", items: [{ heure: "3:00" }] }],
  ["un mode absent", "CE1", { items: [{ heure: "3:00" }] }],
  ["aucun item", "CE1", { mode: "lire", items: [] }],
  ["un item qui n'est pas un objet", "CE1", { mode: "lire", items: [null] }],
  ["une heure mal écrite", "CE1", { mode: "lire", items: [{ heure: "3 h 30" }] }],
  ["une heure absente", "CE1", { mode: "lire", items: [{ aide: "Regarde." }] }],
  ["une heure hors de la journée", "CE1", { mode: "lire", items: [{ heure: "25:00" }] }],
  ["des minutes hors de l'heure", "CE1", { mode: "lire", items: [{ heure: "3:60" }] }],
  ["minuit, qui n'est pas permis", "CE1", { mode: "lire", items: [{ heure: "0:00" }] }],
  ["une précision inconnue", "CE1", { mode: "lire", precision: "dix-minutes", items: [{ heure: "3:00" }] }],
  ["une heure qui ne respecte pas la précision du niveau", "CP", { mode: "lire", items: [{ heure: "3:30" }] }],
  ["une heure qui ne respecte pas la précision demandée", "CE2", {
    mode: "lire",
    precision: "heure",
    items: [{ heure: "3:30" }],
  }],
  ["une précision plus fine que le niveau", "CE1", { mode: "lire", precision: "minute", items: [{ heure: "3:00" }] }],
  ["des secondes au CM1", "CM1", { mode: "lire", items: [{ heure: "4:41:10" }] }],
  ["deux heures égales sur le cadran", "CE1", { mode: "lire", items: [{ heure: "3:00" }, { heure: "15:00" }] }],
  ["un moment de la journée inconnu", "CE1", { mode: "lire", items: [{ heure: "15:00", moment: "soir" }] }],
  ["au CP en mode placer, une heure après midi", "CP", { mode: "placer", items: [{ heure: "15:00" }] }],
];

for (const [defaut, niveau, exercice] of exercicesMalFormes) {
  Deno.test(`un exercice « horloge » refuse ${defaut}`, () => {
    assertThrows(lire(niveau, exercice), LeconMalFormee);
  });
}

Deno.test("au CP, une heure après midi est permise en mode lire", () => {
  const exercice = exerciceHorloge("CP", { mode: "lire", items: [{ heure: "15:00" }] });

  assertEquals(exercice.items[0].heure.ecriture(), "15 h");
});
