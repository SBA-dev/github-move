import { assert, assertEquals } from "@std/assert";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { ClavierPropose } from "./clavier-propose.ts";
import type { Hasard } from "./hasard.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";

const LETTRES_INTRUSES_POSSIBLES = "aeioulnrstcmpbdvé";

function hasardCongruentiel(graine: number): Hasard {
  let etat = graine;
  return {
    entre0et1() {
      etat = (etat * 1103515245 + 12345) % 2147483648;
      return etat / 2147483648;
    },
  };
}

function compter(lettres: readonly string[]): Map<string, number> {
  const comptes = new Map<string, number>();
  for (const lettre of lettres) comptes.set(lettre, (comptes.get(lettre) ?? 0) + 1);
  return comptes;
}

function intrusesDe(touches: readonly string[], mot: string): string[] {
  const restantes = [...MotAEcrire.de(mot).lettresAEcrire()];
  const intruses: string[] = [];
  for (const touche of touches) {
    const rang = restantes.indexOf(touche);
    if (rang === -1) intruses.push(touche);
    else restantes.splice(rang, 1);
  }
  return intruses;
}

Deno.test("le réglage clavier complet propose le clavier complet à tous les niveaux", () => {
  const genres = (["CP", "CE1", "CE2", "CM1", "CM2"] as const).map((niveau) =>
    ClavierPropose.choisir("clavierComplet", niveau, MotAEcrire.de("chat"), hasardSansMelange()).genre
  );

  assertEquals(genres, Array(5).fill("clavierComplet"));
});

Deno.test("le réglage lettres du mot propose les lettres du mot à tous les niveaux", () => {
  const genres = (["CP", "CE1", "CE2", "CM1", "CM2"] as const).map((niveau) =>
    ClavierPropose.choisir("lettresDuMot", niveau, MotAEcrire.de("chat"), hasardSansMelange()).genre
  );

  assertEquals(genres, Array(5).fill("lettresDuMot"));
});

Deno.test("le réglage automatique propose les lettres du mot jusqu'au CE1, puis le clavier complet", () => {
  const genres = (["CP", "CE1", "CE2", "CM1", "CM2"] as const).map((niveau) =>
    ClavierPropose.choisir("automatique", niveau, MotAEcrire.de("chat"), hasardSansMelange()).genre
  );

  assertEquals(genres, ["lettresDuMot", "lettresDuMot", "clavierComplet", "clavierComplet", "clavierComplet"]);
});

Deno.test("le clavier complet a les quatre rangées AZERTY et la touche « œ »", () => {
  const clavier = ClavierPropose.choisir("clavierComplet", "CP", MotAEcrire.de("chat"), hasardSansMelange());

  assertEquals(clavier.rangees.slice(0, 4).map((rangee) => rangee.join("")), [
    "azertyuiop",
    "qsdfghjklm",
    "wxcvbnéèêà",
    "çùëïôâîû",
  ]);
  assert(clavier.touches.includes("œ"));
});

Deno.test("les lettres du mot « chat » sont proposées avec trois lettres intruses : sept touches", () => {
  const clavier = ClavierPropose.choisir("lettresDuMot", "CP", MotAEcrire.de("chat"), hasardSansMelange());

  assertEquals(clavier.touches.length, 7);
  assertEquals(intrusesDe(clavier.touches, "chat").length, 3);
});

Deno.test("le mot « lapin » a trois intruses et le mot « souris » en a deux : huit touches chacun", () => {
  const lapin = ClavierPropose.choisir("lettresDuMot", "CP", MotAEcrire.de("lapin"), hasardSansMelange());
  const souris = ClavierPropose.choisir("lettresDuMot", "CP", MotAEcrire.de("souris"), hasardSansMelange());

  assertEquals([lapin.touches.length, souris.touches.length], [8, 8]);
  assertEquals([intrusesDe(lapin.touches, "lapin").length, intrusesDe(souris.touches, "souris").length], [3, 2]);
});

Deno.test("un long mot reçoit toujours deux lettres intruses, et garde ses lettres répétées", () => {
  const clavier = ClavierPropose.choisir("lettresDuMot", "CP", MotAEcrire.de("arc-en-ciel"), hasardSansMelange());

  assertEquals(clavier.touches.length, 11);
  const comptes = compter(clavier.touches);
  assertEquals([comptes.get("c"), comptes.get("e")], [2, 2]);
});

Deno.test("les lettres intruses sont tirées de la liste prévue et sont absentes du mot", () => {
  for (let graine = 1; graine <= 30; graine++) {
    const clavier = ClavierPropose.choisir("lettresDuMot", "CP", MotAEcrire.de("chat"), hasardCongruentiel(graine));
    const intruses = intrusesDe(clavier.touches, "chat");

    assert(intruses.every((lettre) => LETTRES_INTRUSES_POSSIBLES.includes(lettre)), `graine ${graine}`);
    assert(intruses.every((lettre) => !"chat".includes(lettre)), `graine ${graine}`);
  }
});

Deno.test("le mot peut toujours s'écrire avec les touches proposées", () => {
  for (let graine = 1; graine <= 30; graine++) {
    const clavier = ClavierPropose.choisir(
      "lettresDuMot",
      "CP",
      MotAEcrire.de("arc-en-ciel"),
      hasardCongruentiel(graine),
    );
    const disponibles = compter(clavier.touches);

    for (const [lettre, besoin] of compter(MotAEcrire.de("arc-en-ciel").lettresAEcrire())) {
      assert((disponibles.get(lettre) ?? 0) >= besoin, `graine ${graine}, lettre ${lettre}`);
    }
  }
});

Deno.test("les touches d'un mot à majuscule sont des minuscules", () => {
  const clavier = ClavierPropose.choisir("lettresDuMot", "CP", MotAEcrire.de("Paris"), hasardSansMelange());

  assert(clavier.touches.every((touche) => touche === touche.toLowerCase()));
  assert(clavier.touches.includes("p"));
});

Deno.test("le Hasard mélange les touches : deux tirages différents ne donnent pas toujours le même ordre", () => {
  const ordres = new Set(
    [1, 2, 3, 4, 5, 6, 7, 8].map((graine) =>
      ClavierPropose.choisir("lettresDuMot", "CP", MotAEcrire.de("chat"), hasardCongruentiel(graine)).touches.join("")
    ),
  );

  assert(ordres.size > 1);
});
