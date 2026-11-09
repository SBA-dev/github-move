import { assertEquals, assertNotMatch } from "@std/assert";
import { HeureDeLHorloge, Niveau } from "../../catalogue/domain/index.ts";
import { heureDite } from "./heure-dite.ts";

function dire(ecriture: string, niveau: string): string {
  return heureDite(HeureDeLHorloge.lire(ecriture), Niveau.de(niveau));
}

Deno.test("une heure pleine se dit avec le mot « heures »", () => {
  assertEquals(dire("3:00", "CP"), "trois heures");
});

Deno.test("une heure pleine au singulier se dit « une heure »", () => {
  assertEquals(dire("1:00", "CP"), "une heure");
});

Deno.test("12:00 se dit « midi »", () => {
  assertEquals(dire("12:00", "CE1"), "midi");
});

Deno.test("l'après-midi, l'heure se dit sur vingt-quatre heures", () => {
  assertEquals(dire("15:00", "CE1"), "quinze heures");
});

Deno.test("le quart se dit « et quart », même l'après-midi", () => {
  assertEquals(dire("3:15", "CE1"), "trois heures et quart");
  assertEquals(dire("14:15", "CE2"), "quatorze heures et quart");
});

Deno.test("la demi-heure se dit « et demie »", () => {
  assertEquals(dire("3:30", "CE1"), "trois heures et demie");
});

Deno.test("avant le CE2, 7:45 se dit avec les minutes en nombre", () => {
  assertEquals(dire("7:45", "CE1"), "sept heures quarante-cinq");
});

Deno.test("à partir du CE2, 6:45 se dit « sept heures moins le quart »", () => {
  assertEquals(dire("6:45", "CE2"), "sept heures moins le quart");
});

Deno.test("à partir du CE2, les dernières minutes se disent avec « moins »", () => {
  assertEquals(dire("3:40", "CE2"), "quatre heures moins vingt");
  assertEquals(dire("3:50", "CM1"), "quatre heures moins dix");
  assertEquals(dire("3:55", "CM2"), "quatre heures moins cinq");
});

Deno.test("11:45 se dit « midi moins le quart » à partir du CE2", () => {
  assertEquals(dire("11:45", "CE2"), "midi moins le quart");
});

Deno.test("les autres minutes se disent en nombre", () => {
  assertEquals(dire("10:35", "CE2"), "dix heures trente-cinq");
  assertEquals(dire("6:18", "CE2"), "six heures dix-huit");
});

Deno.test("au CM2, les secondes se disent après les minutes", () => {
  assertEquals(dire("6:18:20", "CM2"), "six heures dix-huit minutes et vingt secondes");
});

Deno.test("l'heure dite ne contient aucun chiffre", () => {
  assertNotMatch(dire("14:35", "CM1"), /\d/);
});
