import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { CodeDeMatiere, Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { leconSuivanteEnFinDeSeance } from "./lecon-suivante-en-fin-de-seance.ts";

function lecon(id: string, matiere: CodeDeMatiere, niveau: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau,
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const francais1 = lecon("fr-ce1-1", "francais", "CE1", 1);
const francais2 = lecon("fr-ce1-2", "francais", "CE1", 2);
const francais3 = lecon("fr-ce1-3", "francais", "CE1", 3);
const maths1 = lecon("ma-ce1-1", "maths", "CE1", 1);
const maths2 = lecon("ma-ce1-2", "maths", "CE1", 2);
const francaisDuCP = lecon("fr-cp-1", "francais", "CP", 1);
const francaisDuCE2 = lecon("fr-ce2-1", "francais", "CE2", 1);

const toutesLesLecons = [francais1, francais2, francais3, maths1, maths2, francaisDuCP, francaisDuCE2];

function entrees(reussies: string[], niveau = "CE1") {
  return {
    lecons: toutesLesLecons,
    niveau: Niveau.de(niveau),
    meilleuresEtoiles: new Map(reussies.map((id) => [id, Etoiles.de(1)] as [string, Etoiles])),
  };
}

Deno.test("quand le parcours de la matière a une leçon suivante, c'est elle qui est proposée, pas la leçon du jour", () => {
  assertEquals(leconSuivanteEnFinDeSeance(entrees([francais1.id]), francais1.id), francais2.id);
});

Deno.test("après la dernière leçon de français du CE1, la leçon suivante est la leçon du jour en maths", () => {
  const apresLaSeance = entrees([francais1.id, francais2.id, francais3.id]);

  assertEquals(leconSuivanteEnFinDeSeance(apresLaSeance, francais3.id), maths1.id);
});

Deno.test("après une leçon des classes d'avant, la leçon suivante est la leçon du jour de la classe de l'enfant", () => {
  assertEquals(leconSuivanteEnFinDeSeance(entrees([francaisDuCP.id]), francaisDuCP.id), maths1.id);
});

Deno.test("après une leçon d'une classe au-dessus, la leçon suivante est la leçon du jour de la classe de l'enfant", () => {
  assertEquals(leconSuivanteEnFinDeSeance(entrees([francaisDuCE2.id]), francaisDuCE2.id), maths1.id);
});

Deno.test("quand tout le parcours est réussi après la dernière leçon, il n'y a pas de leçon suivante", () => {
  const toutReussi = entrees([francais1, francais2, francais3, maths1, maths2].map((l) => l.id));

  assertEquals(leconSuivanteEnFinDeSeance(toutReussi, francais3.id), undefined);
});

Deno.test("quand la classe de l'enfant n'a aucune leçon, il n'y a pas de leçon suivante après une leçon des classes d'avant", () => {
  assertEquals(leconSuivanteEnFinDeSeance(entrees([francais1.id], "CM2"), francais1.id), undefined);
});

Deno.test("quand la leçon du jour est la leçon qui vient d'être jouée, il n'y a pas de leçon suivante", () => {
  const francaisReussi = entrees([francais1.id, francais2.id, francais3.id, maths1.id]);

  assertEquals(leconSuivanteEnFinDeSeance(francaisReussi, maths2.id), undefined);
});

Deno.test("après une leçon personnelle, qui n'est pas une leçon de la bibliothèque, aucune leçon suivante n'est proposée même s'il y a une leçon du jour", () => {
  const leconPersonnelle = lecon("fr-ce1-perso-chats", "francais", "CE1", 0);

  assertEquals(leconSuivanteEnFinDeSeance(entrees([]), leconPersonnelle.id), undefined);
});
