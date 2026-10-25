import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { CodeDeMatiere, Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { leconDuJour } from "./lecon-du-jour.ts";
import type { EntreesDuJour } from "./lecon-du-jour.ts";

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
const maths1 = lecon("ma-ce1-1", "maths", "CE1", 1);
const maths2 = lecon("ma-ce1-2", "maths", "CE1", 2);
const sciences1 = lecon("sc-ce1-1", "sciences", "CE1", 1);
const histoire1 = lecon("hi-ce1-1", "histoire", "CE1", 1);
const emc1 = lecon("em-ce1-1", "emc", "CE1", 1);
const francaisDuCP = lecon("fr-cp-1", "francais", "CP", 1);
const mathsDuCE2 = lecon("ma-ce2-1", "maths", "CE2", 1);

const toutesLesLecons = [francais1, francais2, maths1, maths2, sciences1, histoire1, emc1, francaisDuCP, mathsDuCE2];

function entreesDuJour(
  options: { reussies?: string[]; testDeDepart?: string[]; derniere?: CodeDeMatiere; niveau?: string } = {},
  lecons: Lecon[] = toutesLesLecons,
): EntreesDuJour {
  return {
    parcours: {
      lecons,
      niveau: Niveau.de(options.niveau ?? "CE1"),
      meilleuresEtoiles: new Map((options.reussies ?? []).map((id) => [id, Etoiles.de(1)] as [string, Etoiles])),
      leconsReussiesAuTestDeDepart: new Set(options.testDeDepart ?? []),
    },
    matiereDeLaDerniereSeance: options.derniere,
  };
}

function idDeLaLeconDuJour(entrees: EntreesDuJour): string | undefined {
  const jour = leconDuJour(entrees);
  return jour.genre === "aJouer" ? jour.lecon : undefined;
}

Deno.test("sans bibliothèque chargée, la leçon du jour est inconnue et jamais un parcours fini", () => {
  assertEquals(leconDuJour({ parcours: undefined }), { genre: "inconnue" });
});

Deno.test("quand aucune leçon n'existe dans la classe de l'enfant, aucune leçon n'est proposée pour sa classe", () => {
  const jour = leconDuJour(entreesDuJour({ niveau: "CM2" }));

  assertEquals(jour, { genre: "aucuneLeconPourTaClasse" });
});

Deno.test("un enfant de CE1 sans progression ni séance commence par la première leçon de français du CE1", () => {
  const jour = leconDuJour(entreesDuJour());

  assertEquals(jour, {
    genre: "aJouer",
    lecon: "fr-ce1-1",
    matiere: francais1.matiere,
    niveau: Niveau.de("CE1"),
    titre: "Titre de fr-ce1-1",
  });
});

Deno.test("après une séance de français, la leçon du jour est la prochaine leçon de maths", () => {
  assertEquals(idDeLaLeconDuJour(entreesDuJour({ derniere: "francais" })), "ma-ce1-1");
});

Deno.test("après une séance de maths, la leçon du jour est la prochaine leçon de français", () => {
  assertEquals(idDeLaLeconDuJour(entreesDuJour({ derniere: "maths" })), "fr-ce1-1");
});

Deno.test("après une séance de sciences, la leçon du jour est la prochaine leçon de français", () => {
  assertEquals(idDeLaLeconDuJour(entreesDuJour({ derniere: "sciences" })), "fr-ce1-1");
});

Deno.test("quand le français est réussi, la leçon du jour est en maths même après une séance de maths", () => {
  const entrees = entreesDuJour({ reussies: [francais1.id], testDeDepart: [francais2.id], derniere: "maths" });

  assertEquals(idDeLaLeconDuJour(entrees), "ma-ce1-1");
});

Deno.test("quand les maths sont réussies, la leçon du jour reste en français même après une séance de français", () => {
  const entrees = entreesDuJour({ reussies: [maths1.id, maths2.id], derniere: "francais" });

  assertEquals(idDeLaLeconDuJour(entrees), "fr-ce1-1");
});

Deno.test("quand le français et les maths sont réussis, la leçon du jour suit l'ordre du Catalogue : sciences avant EMC", () => {
  const reussies = [francais1.id, francais2.id, maths1.id, maths2.id];

  assertEquals(idDeLaLeconDuJour(entreesDuJour({ reussies })), "sc-ce1-1");
});

Deno.test("une matière sans leçon dans la classe de l'enfant est sautée", () => {
  const sansHistoire = toutesLesLecons.filter((l) => l.matiere.code !== "histoire");
  const reussies = [francais1.id, francais2.id, maths1.id, maths2.id, sciences1.id];

  assertEquals(idDeLaLeconDuJour(entreesDuJour({ reussies }, sansHistoire)), "em-ce1-1");
});

Deno.test("quand toutes les matières du parcours sont réussies, le parcours est fini sans repli vers une autre classe", () => {
  const reussies = [francais1, francais2, maths1, maths2, sciences1, histoire1, emc1].map((l) => l.id);

  assertEquals(leconDuJour(entreesDuJour({ reussies })), { genre: "parcoursFini" });
});

Deno.test("une leçon réussie au test de départ n'est jamais la leçon du jour", () => {
  const entrees = entreesDuJour({ testDeDepart: [francais1.id] });

  assertEquals(idDeLaLeconDuJour(entrees), "fr-ce1-2");
});

Deno.test("la leçon du jour est déterministe : mêmes entrées, même résultat", () => {
  const entrees = entreesDuJour({ reussies: [francais1.id], derniere: "francais" });

  assertEquals(leconDuJour(entrees), leconDuJour(entrees));
});
