import { assertEquals } from "@std/assert";
import { ResultatDeLaLecon } from "./resultat-de-la-lecon.ts";

const profilDeLea = "profil-lea";
const lecon = "fr-cp-sons-ou-on-an";
const competence = "Lire les sons ou, on, an";

function nouveauResultat(): ResultatDeLaLecon {
  return ResultatDeLaLecon.commencer(profilDeLea, lecon, competence);
}

Deno.test("un résultat de la leçon est identifié par le profil enfant et la leçon", () => {
  const resultat = nouveauResultat();

  assertEquals([resultat.enfant, resultat.lecon], [profilDeLea, lecon]);
});

Deno.test("une leçon jamais jouée n'est ni réussie ni acquise, sans étoiles ni séance", () => {
  const resultat = nouveauResultat();

  assertEquals(
    [resultat.estReussie(), resultat.estAcquise(), resultat.meilleures, resultat.dernieres, resultat.nombreDeSeances],
    [false, false, undefined, undefined, 0],
  );
});

Deno.test("enregistrer une séance retient les étoiles gagnées et compte la séance", () => {
  const resultat = nouveauResultat();

  resultat.enregistrerSeance(2);

  assertEquals([resultat.dernieres, resultat.meilleures, resultat.nombreDeSeances], [2, 2, 1]);
});

Deno.test("une séance moins bonne ne fait pas baisser les meilleures étoiles", () => {
  const resultat = nouveauResultat();
  resultat.enregistrerSeance(3);

  resultat.enregistrerSeance(1);

  assertEquals([resultat.dernieres, resultat.meilleures, resultat.nombreDeSeances], [1, 3, 2]);
});

Deno.test("une séance meilleure fait monter les meilleures étoiles", () => {
  const resultat = nouveauResultat();
  resultat.enregistrerSeance(1);

  resultat.enregistrerSeance(2);

  assertEquals(resultat.meilleures, 2);
});

Deno.test("une leçon est réussie dès 1 meilleure étoile, sans être acquise", () => {
  const resultat = nouveauResultat();

  resultat.enregistrerSeance(1);

  assertEquals([resultat.estReussie(), resultat.estAcquise()], [true, false]);
});

Deno.test("une leçon est acquise dès 2 meilleures étoiles", () => {
  const resultat = nouveauResultat();

  resultat.enregistrerSeance(2);

  assertEquals([resultat.estReussie(), resultat.estAcquise()], [true, true]);
});

Deno.test("une leçon reste acquise après une séance à 1 étoile", () => {
  const resultat = nouveauResultat();
  resultat.enregistrerSeance(2);

  resultat.enregistrerSeance(1);

  assertEquals(resultat.estAcquise(), true);
});

Deno.test("la première séance à 1 étoile publie LeconReussie seulement", () => {
  const resultat = nouveauResultat();

  resultat.enregistrerSeance(1);

  assertEquals(resultat.retirerFaits(), [{ type: "LeconReussie", enfant: profilDeLea, lecon }]);
});

Deno.test("la première séance à 2 étoiles publie LeconReussie puis LeconAcquise avec la compétence", () => {
  const resultat = nouveauResultat();

  resultat.enregistrerSeance(2);

  assertEquals(resultat.retirerFaits(), [
    { type: "LeconReussie", enfant: profilDeLea, lecon },
    { type: "LeconAcquise", enfant: profilDeLea, lecon, competence },
  ]);
});

Deno.test("passer de 1 à 3 étoiles publie LeconAcquise sans republier LeconReussie", () => {
  const resultat = nouveauResultat();
  resultat.enregistrerSeance(1);
  resultat.retirerFaits();

  resultat.enregistrerSeance(3);

  assertEquals(resultat.retirerFaits(), [{ type: "LeconAcquise", enfant: profilDeLea, lecon, competence }]);
});

Deno.test("une leçon déjà acquise ne republie ni LeconReussie ni LeconAcquise", () => {
  const resultat = nouveauResultat();
  resultat.enregistrerSeance(2);
  resultat.retirerFaits();

  resultat.enregistrerSeance(3);

  assertEquals(resultat.retirerFaits(), []);
});

Deno.test("un résultat reconstitué depuis l'état enregistré garde ses étoiles et ne republie rien", () => {
  const resultat = ResultatDeLaLecon.reconstituer({
    enfant: profilDeLea,
    lecon,
    competence,
    meilleures: 2,
    dernieres: 1,
    nombreDeSeances: 4,
  });

  resultat.enregistrerSeance(2);

  assertEquals(
    [resultat.meilleures, resultat.dernieres, resultat.nombreDeSeances, resultat.retirerFaits()],
    [2, 2, 5, []],
  );
});
