import { assertEquals, assertMatch } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeSoustractionsAuCE1, leconLesDoublesAuCP } from "../test_utils/lecons-de-calcul.ts";
import { leconDUneSeuleFluenceAuCP } from "../test_utils/lecons-de-fluence.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

const debut = new Date("2026-10-23T10:00:00Z");
const apres = (secondes: number) => new Date(debut.getTime() + secondes * 1000);

function commencer(lecon: Lecon): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
  );
}

function calculEnCours(seance: Seance) {
  const calcul = seance.calculEnCours();
  if (!calcul) throw new Error("Aucun calcul en cours");
  return calcul;
}

function fluenceEnCours(seance: Seance, maintenant: Date) {
  const fluence = seance.fluenceEnCours(maintenant);
  if (!fluence) throw new Error("Aucune fluence en cours");
  return fluence;
}

Deno.test("un calcul des doubles au CP montre la carte, la phrase à lire et des choix autour du résultat", () => {
  const seance = commencer(leconLesDoublesAuCP());

  const calcul = calculEnCours(seance);

  assertEquals(
    [calcul.carte, calcul.phrase, calcul.mode.genre, calcul.jeNeSaisPasPropose],
    ["2 + 2 = ?", "Combien font 2 plus 2 ?", "choix", true],
  );
  assertEquals(calcul.mode.genre === "choix" ? [...calcul.mode.choix].sort() : [], ["3", "4", "5", "6"]);
});

Deno.test("un calcul du CE1 se répond au clavier de cristaux, sans aucun choix", () => {
  const seance = commencer(leconDeSoustractionsAuCE1());

  const calcul = calculEnCours(seance);

  assertEquals([calcul.carte, calcul.phrase, calcul.mode], [
    "12 − 5 = ?",
    "Combien font 12 moins 5 ?",
    { genre: "clavierDeCristaux" },
  ]);
});

Deno.test("la séance ne montre plus de calcul quand la question en cours n'en est pas un", () => {
  const seance = commencer(leconDUneSeuleFluenceAuCP());

  assertEquals(seance.calculEnCours(), undefined);
});

Deno.test("après une erreur de calcul, la séance rend l'aide de l'opération", () => {
  const seance = commencer(leconLesDoublesAuCP());
  seance.repondre(Reponse.choix("4"));

  seance.repondre(Reponse.choix("5"));

  assertEquals(seance.aideApresLaDerniereErreur(), "Pars du plus grand nombre, et avance du plus petit.");
});

Deno.test("« Je ne sais pas » au clavier de cristaux montre la réponse à taper", () => {
  const seance = commencer(leconDeSoustractionsAuCE1());

  seance.direJeNeSaisPas();

  assertEquals(calculEnCours(seance).reponseATaper, "7");
});

Deno.test("une fluence pas encore démarrée montre son temps entier, un score nul et n'est pas finie", () => {
  const seance = commencer(leconDUneSeuleFluenceAuCP());

  const fluence = fluenceEnCours(seance, debut);

  assertEquals(
    [fluence.demarree, fluence.tempsRestant, fluence.score, fluence.finie, fluence.jeNeSaisPasPropose],
    [false, 45, 0, false, false],
  );
});

Deno.test("une fluence en cours montre l'opération à résoudre, le temps restant et le score", () => {
  const seance = commencer(leconDUneSeuleFluenceAuCP());
  seance.demarrerLaFluence(debut);
  const premiereOperation = fluenceEnCours(seance, apres(0)).carte;
  const nombre = Number(premiereOperation.split(" ")[0]) * 2;
  seance.repondre(Reponse.nombre(nombre), apres(5));

  const fluence = fluenceEnCours(seance, apres(10));

  assertMatch(fluence.carte, /^\d+ × 2 = \?$/);
  assertEquals([fluence.demarree, fluence.tempsRestant, fluence.score, fluence.finie], [true, 35, 1, false]);
});

Deno.test("une fluence dont les 45 secondes sont écoulées est finie et garde son score", () => {
  const seance = commencer(leconDUneSeuleFluenceAuCP());
  seance.demarrerLaFluence(debut);
  const nombre = Number(fluenceEnCours(seance, apres(0)).carte.split(" ")[0]) * 2;
  seance.repondre(Reponse.nombre(nombre), apres(5));

  const fluence = fluenceEnCours(seance, apres(45));

  assertEquals([fluence.finie, fluence.tempsRestant, fluence.score], [true, 0, 1]);
});
