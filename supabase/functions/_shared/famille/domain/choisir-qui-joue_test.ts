import { assertEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { ProfilEnCoursSurLAppareilEnMemoire } from "../test_utils/profil-en-cours-sur-l-appareil-en-memoire.ts";
import { ChoisirQuiJoue } from "./choisir-qui-joue.ts";
import { ParentId } from "./parent-id.ts";
import { Prenom } from "./prenom.ts";
import { ProfilEnfant } from "./profil-enfant.ts";
import { ProfilEnfantId } from "./profil-enfant-id.ts";
import { Reglages } from "./reglages.ts";

Deno.test("choisir son profil enfant dans « Qui joue ? » le rend profil en cours, avec son identifiant, son prénom, son niveau et son univers", () => {
  const lea = ProfilEnfant.creer(
    ProfilEnfantId.de("profil-lea"),
    ParentId.de("parent-paul"),
    Prenom.de("Léa"),
    Niveau.de("CE1"),
    "danse",
    new Date("2026-09-01T08:00:00Z"),
  );
  const appareil = new ProfilEnCoursSurLAppareilEnMemoire();

  new ChoisirQuiJoue(appareil).executer(lea);

  assertEquals(appareil.profilEnCours, {
    id: "profil-lea",
    prenom: "Léa",
    niveau: "CE1",
    univers: "danse",
    reglages: Reglages.parDefaut(),
  });
});

Deno.test("choisir son profil enfant rend ses réglages disponibles pour le mode dys et tout lire à voix haute", () => {
  const paul = ParentId.de("parent-paul");
  const lea = ProfilEnfant.creer(
    ProfilEnfantId.de("profil-lea"),
    paul,
    Prenom.de("Léa"),
    Niveau.de("CE1"),
    "danse",
    new Date("2026-09-01T08:00:00Z"),
  );
  const reglages = Reglages.depuis({ modeDys: true, toutLireAVoixHaute: true });
  lea.changerLesReglages(paul, reglages);
  const appareil = new ProfilEnCoursSurLAppareilEnMemoire();

  new ChoisirQuiJoue(appareil).executer(lea);

  assertEquals(appareil.profilEnCours?.reglages, reglages);
});
