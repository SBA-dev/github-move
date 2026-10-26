import { assertEquals } from "@std/assert";
import { Jour } from "../../apprentissage/domain/jour.ts";
import { JoursDeSeance } from "./jours-de-seance.ts";
import { serieDeJours } from "./serie.ts";

const J = Jour.de("2026-03-10");

function serieAvecSeancesAux(...decalages: number[]) {
  const jours = JoursDeSeance.reunir(decalages.map((decalage) => J.plus(decalage)));
  return serieDeJours(jours, J);
}

Deno.test("sans aucune séance, la série est de 0 jour et l'enfant n'a pas joué aujourd'hui", () => {
  assertEquals(serieAvecSeancesAux(), { nombreDeJours: 0, aJoueAujourdhui: false });
});

Deno.test("une séance aujourd'hui donne une série de 1 jour, jouée aujourd'hui", () => {
  assertEquals(serieAvecSeancesAux(0), { nombreDeJours: 1, aJoueAujourdhui: true });
});

Deno.test("trois jours d'affilée jusqu'à aujourd'hui donnent une série de 3 jours", () => {
  assertEquals(serieAvecSeancesAux(0, -1, -2), { nombreDeJours: 3, aJoueAujourdhui: true });
});

Deno.test("sans séance aujourd'hui, la série court jusqu'à hier", () => {
  assertEquals(serieAvecSeancesAux(-1, -2), { nombreDeJours: 2, aJoueAujourdhui: false });
});

Deno.test("une seule séance hier donne une série de 1 jour, non jouée aujourd'hui", () => {
  assertEquals(serieAvecSeancesAux(-1), { nombreDeJours: 1, aJoueAujourdhui: false });
});

Deno.test("sans séance hier ni aujourd'hui, la série est cassée", () => {
  assertEquals(serieAvecSeancesAux(-2), { nombreDeJours: 0, aJoueAujourdhui: false });
});

Deno.test("un jour sans séance arrête le compte", () => {
  assertEquals(serieAvecSeancesAux(0, -2, -3), { nombreDeJours: 1, aJoueAujourdhui: true });
});

Deno.test("un jour de séance après aujourd'hui (horloge reculée) est ignoré", () => {
  assertEquals(serieAvecSeancesAux(1), { nombreDeJours: 0, aJoueAujourdhui: false });
});

Deno.test("un jour de séance après aujourd'hui n'empêche pas de compter aujourd'hui", () => {
  assertEquals(serieAvecSeancesAux(1, 0), { nombreDeJours: 1, aJoueAujourdhui: true });
});

Deno.test("une longue série de 365 jours d'affilée est comptée en entier", () => {
  const decalages = Array.from({ length: 365 }, (_, i) => -i);

  assertEquals(serieAvecSeancesAux(...decalages), { nombreDeJours: 365, aJoueAujourdhui: true });
});
