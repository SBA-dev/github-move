import { assertEquals, assertThrows } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { ParentNonRattache } from "./erreurs.ts";
import { ParentId } from "./parent-id.ts";
import { Prenom } from "./prenom.ts";
import { ProfilEnfant } from "./profil-enfant.ts";
import { ProfilEnfantId } from "./profil-enfant-id.ts";

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
