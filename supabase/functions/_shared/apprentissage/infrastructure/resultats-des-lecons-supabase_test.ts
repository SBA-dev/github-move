import { assertEquals } from "@std/assert";
import { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import { ligneDuResultat, resultatDepuisLaLigne } from "./resultats-des-lecons-supabase.ts";

Deno.test("le résultat d'une leçon devient une ligne de resultats_des_lecons", () => {
  const resultat = ResultatDeLaLecon.commencer("profil-lea", "ma-cp-calcul", "calculer");
  resultat.enregistrerSeance(3);
  resultat.enregistrerSeance(2);

  assertEquals(ligneDuResultat(resultat), {
    profil: "profil-lea",
    lecon: "ma-cp-calcul",
    meilleures_etoiles: 3,
    dernieres_etoiles: 2,
    nombre_de_seances: 2,
  });
});

Deno.test("un résultat sans séance a des étoiles nulles", () => {
  const resultat = ResultatDeLaLecon.commencer("profil-lea", "ma-cp-calcul", "calculer");

  assertEquals(ligneDuResultat(resultat), {
    profil: "profil-lea",
    lecon: "ma-cp-calcul",
    meilleures_etoiles: null,
    dernieres_etoiles: null,
    nombre_de_seances: 0,
  });
});

Deno.test("la ligne d'un résultat redonne le résultat de la leçon, avec la compétence de la leçon", () => {
  const resultat = resultatDepuisLaLigne({
    profil: "profil-lea",
    lecon: "ma-cp-calcul",
    meilleures_etoiles: 3,
    dernieres_etoiles: 1,
    nombre_de_seances: 4,
  }, "calculer");

  assertEquals(resultat.enfant, "profil-lea");
  assertEquals(resultat.lecon, "ma-cp-calcul");
  assertEquals(resultat.meilleures, 3);
  assertEquals(resultat.dernieres, 1);
  assertEquals(resultat.nombreDeSeances, 4);
  assertEquals(resultat.estAcquise(), true);
});

Deno.test("une ligne aux étoiles nulles redonne un résultat sans étoile ni leçon réussie", () => {
  const resultat = resultatDepuisLaLigne({
    profil: "profil-lea",
    lecon: "ma-cp-calcul",
    meilleures_etoiles: null,
    dernieres_etoiles: null,
    nombre_de_seances: 0,
  }, "calculer");

  assertEquals(resultat.meilleures, undefined);
  assertEquals(resultat.estReussie(), false);
});

Deno.test("un résultat relu puis enrichi d'une séance garde ses meilleures étoiles", () => {
  const resultat = resultatDepuisLaLigne({
    profil: "profil-lea",
    lecon: "ma-cp-calcul",
    meilleures_etoiles: 3,
    dernieres_etoiles: 3,
    nombre_de_seances: 1,
  }, "calculer");

  resultat.enregistrerSeance(1);

  assertEquals(ligneDuResultat(resultat).meilleures_etoiles, 3);
  assertEquals(ligneDuResultat(resultat).dernieres_etoiles, 1);
  assertEquals(ligneDuResultat(resultat).nombre_de_seances, 2);
});
