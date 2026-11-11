import { assert, assertEquals } from "@std/assert";
import { parolesFixes } from "./paroles-fixes.ts";
import {
  ANNONCES_D_EXERCICE,
  INVITATIONS_A_JOUER,
} from "./paroles-de-seance.ts";
import {
  ENCOURAGEMENTS,
  FELICITATIONS_COMMUNES,
  presentation,
  presentationAuRetourDuSon,
  RELANCES,
} from "./paroles.ts";
import { UNIVERS } from "./univers.ts";

Deno.test("les paroles fixes contiennent chaque félicitation commune", () => {
  const paroles = parolesFixes();
  for (const felicitation of FELICITATIONS_COMMUNES) assert(paroles.includes(felicitation), felicitation);
});

Deno.test("les paroles fixes contiennent chaque encouragement", () => {
  const paroles = parolesFixes();
  for (const encouragement of ENCOURAGEMENTS) assert(paroles.includes(encouragement), encouragement);
});

Deno.test("les paroles fixes contiennent chaque relance", () => {
  const paroles = parolesFixes();
  for (const relance of RELANCES) assert(paroles.includes(relance), relance);
});

Deno.test("les paroles fixes contiennent chaque invitation à jouer", () => {
  const paroles = parolesFixes();
  for (const invitation of INVITATIONS_A_JOUER) assert(paroles.includes(invitation), invitation);
});

Deno.test("les paroles fixes contiennent chaque annonce d'exercice", () => {
  const paroles = parolesFixes();
  for (const annonce of ANNONCES_D_EXERCICE) assert(paroles.includes(annonce), annonce);
});

Deno.test("les paroles fixes contiennent les expressions de chaque personnage guide", () => {
  const paroles = parolesFixes();
  for (const { personnageGuide } of UNIVERS) {
    for (const expression of personnageGuide.expressions) assert(paroles.includes(expression), expression);
  }
});

Deno.test("les paroles fixes contiennent la présentation de chaque personnage guide, y compris au retour du son", () => {
  const paroles = parolesFixes();
  for (const univers of UNIVERS) {
    assert(paroles.includes(presentation(univers)), presentation(univers));
    assert(
      paroles.includes(presentationAuRetourDuSon(univers.personnageGuide)),
      presentationAuRetourDuSon(univers.personnageGuide),
    );
  }
});

Deno.test("les paroles fixes ne contiennent aucun prénom ni aucun nombre", () => {
  const prenom = "Zéphyrine";
  for (const parole of parolesFixes()) {
    assert(!parole.includes(prenom), parole);
    assert(!/\d/.test(parole), parole);
  }
});

Deno.test("les paroles fixes ne contiennent aucun doublon", () => {
  const paroles = parolesFixes();
  assertEquals(new Set(paroles).size, paroles.length);
});
