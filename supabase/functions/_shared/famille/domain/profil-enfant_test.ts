import { assertEquals, assertThrows } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { ParentNonRattache, RattachementsInvalides } from "./erreurs.ts";
import { ParentId } from "./parent-id.ts";
import { Prenom } from "./prenom.ts";
import { ProfilEnfant } from "./profil-enfant.ts";
import { ProfilEnfantId } from "./profil-enfant-id.ts";
import { Reglages } from "./reglages.ts";

const paul = ParentId.de("parent-paul");
const marie = ParentId.de("parent-marie");
const creeLe = new Date("2026-09-01T08:00:00Z");

function profilDeLea(): ProfilEnfant {
  return ProfilEnfant.creer(
    ProfilEnfantId.de("profil-lea"),
    paul,
    Prenom.de("Léa"),
    Niveau.de("CE1"),
    "animaux",
    creeLe,
  );
}

Deno.test("le parent qui crée un profil enfant y est rattaché d'office", () => {
  assertEquals(profilDeLea().estRattacheA(paul), true);
});

Deno.test("un parent qui n'a pas créé le profil enfant n'y est pas rattaché", () => {
  assertEquals(profilDeLea().estRattacheA(marie), false);
});

Deno.test("un profil enfant garde sa date de création", () => {
  assertEquals(profilDeLea().creeLe, creeLe);
});

Deno.test("créer un profil enfant annonce ProfilEnfantCree", () => {
  assertEquals(profilDeLea().retirerFaits(), [
    { type: "ProfilEnfantCree", profil: "profil-lea", parent: "parent-paul", niveau: "CE1", univers: "animaux" },
  ]);
});

Deno.test("un parent rattaché change le prénom du profil enfant", () => {
  const profil = profilDeLea();

  profil.modifier(paul, { prenom: Prenom.de("Léonie") });

  assertEquals(profil.prenom.valeur, "Léonie");
});

Deno.test("modifier le prénom laisse le niveau et l'univers du profil enfant", () => {
  const profil = profilDeLea();

  profil.modifier(paul, { prenom: Prenom.de("Léonie") });

  assertEquals(profil.niveau.valeur, "CE1");
  assertEquals(profil.univers, "animaux");
});

Deno.test("un parent non rattaché ne peut pas modifier le profil enfant", () => {
  const profil = profilDeLea();

  assertThrows(() => profil.modifier(marie, { prenom: Prenom.de("Zoé") }), ParentNonRattache);
  assertEquals(profil.prenom.valeur, "Léa");
});

Deno.test("changer de niveau annonce NiveauDuProfilChange", () => {
  const profil = profilDeLea();
  profil.retirerFaits();

  profil.modifier(paul, { niveau: Niveau.de("CE2") });

  assertEquals(profil.retirerFaits(), [
    { type: "NiveauDuProfilChange", profil: "profil-lea", ancienNiveau: "CE1", nouveauNiveau: "CE2" },
  ]);
});

Deno.test("garder le même niveau n'annonce aucun changement de niveau", () => {
  const profil = profilDeLea();
  profil.retirerFaits();

  profil.modifier(paul, { niveau: Niveau.de("CE1"), prenom: Prenom.de("Léonie") });

  assertEquals(profil.retirerFaits(), []);
});

Deno.test("les faits d'un profil enfant ne sont annoncés qu'une fois", () => {
  const profil = profilDeLea();
  profil.retirerFaits();

  assertEquals(profil.retirerFaits(), []);
});

function reconstituerAvec(parents: ParentId[]): ProfilEnfant {
  return ProfilEnfant.reconstituer(
    ProfilEnfantId.de("profil-lea"),
    Prenom.de("Léa"),
    Niveau.de("CE1"),
    "animaux",
    creeLe,
    parents,
  );
}

Deno.test("un profil enfant reconstitué sans parent est refusé : il a un ou deux parents", () => {
  assertThrows(() => reconstituerAvec([]), RattachementsInvalides);
});

Deno.test("un profil enfant reconstitué avec trois parents est refusé : il a un ou deux parents", () => {
  assertThrows(() => reconstituerAvec([paul, marie, ParentId.de("parent-jean")]), RattachementsInvalides);
});

Deno.test("un profil enfant reconstitué avec deux parents les rend tous les deux", () => {
  const profil = reconstituerAvec([paul, marie]);

  assertEquals(profil.rattaches.map((parent) => parent.valeur), ["parent-paul", "parent-marie"]);
});

Deno.test("modifier la liste des parents donnée à la reconstitution ne change pas le profil enfant", () => {
  const parents = [paul];
  const profil = reconstituerAvec(parents);

  parents.push(marie);

  assertEquals(profil.estRattacheA(marie), false);
  assertEquals(profil.rattaches.length, 1);
});

Deno.test("un profil enfant créé sans réglages reçoit les réglages par défaut", () => {
  assertEquals(profilDeLea().reglages, Reglages.parDefaut());
});

Deno.test("un parent rattaché change les réglages du profil enfant", () => {
  const profil = profilDeLea();
  const reglages = Reglages.depuis({ modeDys: true, clavierDesDictees: "lettresDuMot" });

  profil.changerLesReglages(paul, reglages);

  assertEquals(profil.reglages, reglages);
});

Deno.test("un parent non rattaché ne peut pas changer les réglages du profil enfant", () => {
  const profil = profilDeLea();

  assertThrows(() => profil.changerLesReglages(marie, Reglages.depuis({ modeDys: true })), ParentNonRattache);

  assertEquals(profil.reglages, Reglages.parDefaut());
});

Deno.test("changer les réglages annonce ReglagesChanges", () => {
  const profil = profilDeLea();
  profil.retirerFaits();

  profil.changerLesReglages(paul, Reglages.depuis({ parcoursLibre: true }));

  assertEquals(profil.retirerFaits().map((fait) => [fait.type, "profil" in fait ? fait.profil : null]), [
    ["ReglagesChanges", "profil-lea"],
  ]);
});

Deno.test("les réglages de Léa ne changent pas ceux de Tom", () => {
  const lea = profilDeLea();
  const tom = ProfilEnfant.creer(
    ProfilEnfantId.de("profil-tom"),
    paul,
    Prenom.de("Tom"),
    Niveau.de("CP"),
    "animaux",
    creeLe,
  );

  lea.changerLesReglages(paul, Reglages.depuis({ modeDys: true }));

  assertEquals(tom.reglages, Reglages.parDefaut());
});
