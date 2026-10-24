import { assertEquals } from "@std/assert";
import { RecordDeFluence } from "./record-de-fluence.ts";

const profilDeLea = "profil-lea";
const lecon = "maths-cp-additions";
const exercice = "Calcul rapide";

function recordSansScore(): RecordDeFluence {
  return RecordDeFluence.commencer(profilDeLea, lecon, exercice);
}

function recordDe(meilleurScore: number): RecordDeFluence {
  return RecordDeFluence.reconstituer({ enfant: profilDeLea, lecon, exercice, meilleurScore });
}

Deno.test("un record de fluence est identifié par le profil enfant, la leçon et l'exercice", () => {
  const record = recordSansScore();

  assertEquals([record.enfant, record.lecon, record.exercice], [profilDeLea, lecon, exercice]);
});

Deno.test("un exercice de fluence jamais joué n'a pas de record", () => {
  assertEquals(recordSansScore().meilleurScore, undefined);
});

Deno.test("un premier score de fluence positif est le premier record", () => {
  const record = recordSansScore();

  const issue = record.proposer(4);

  assertEquals([issue, record.meilleurScore], ["premierRecord", 4]);
});

Deno.test("un score de fluence de 0 n'est jamais un record, même sans record existant", () => {
  const record = recordSansScore();

  const issue = record.proposer(0);

  assertEquals([issue, record.meilleurScore], ["aucunRecord", undefined]);
});

Deno.test("un score de fluence de 0 ne change pas le record existant", () => {
  const record = recordDe(6);

  const issue = record.proposer(0);

  assertEquals([issue, record.meilleurScore], ["aucunRecord", 6]);
});

Deno.test("un score de fluence plus haut que le record est un nouveau record", () => {
  const record = recordDe(5);

  const issue = record.proposer(8);

  assertEquals([issue, record.meilleurScore], ["nouveauRecord", 8]);
});

Deno.test("un score de fluence plus bas que le record laisse le record inchangé", () => {
  const record = recordDe(9);

  const issue = record.proposer(4);

  assertEquals([issue, record.meilleurScore], ["recordInchange", 9]);
});

Deno.test("un score de fluence égal au record laisse le record inchangé", () => {
  const record = recordDe(7);

  const issue = record.proposer(7);

  assertEquals([issue, record.meilleurScore], ["recordInchange", 7]);
});

Deno.test("un nouveau record émet le fait NouveauRecordDeFluence avec l'ancien et le nouveau record", () => {
  const record = recordDe(5);
  record.proposer(8);

  assertEquals(record.retirerFaits(), [
    {
      type: "NouveauRecordDeFluence",
      enfant: profilDeLea,
      lecon,
      exercice,
      ancienRecord: 5,
      nouveauRecord: 8,
    },
  ]);
});

Deno.test("un record qui reste n'émet aucun fait", () => {
  const record = recordDe(9);
  record.proposer(4);

  assertEquals(record.retirerFaits(), []);
});
