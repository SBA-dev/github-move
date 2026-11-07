import { assertEquals } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { leconDeCalcul, leconDeDeuxExercicesCourts } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

const BONNE_REPONSE_DU_CALCUL = "7";
const MAUVAISE_REPONSE_DU_CALCUL = "8";
const fin = new Date("2026-10-23T10:30:00Z");

function commencer(lecon: Lecon): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardFixe(0, 0, 0, 0, 0, 0, 0, 0, 0),
    "profil-lea",
    lecon,
    ChoixDeSeance.complete(),
  );
}

function commencerSansLesEtapesDeLecon(lecon: Lecon): Seance {
  const seance = commencer(lecon);
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

Deno.test("une séance qui vient de commencer n'a reçu aucune réponse", () => {
  const seance = commencer(leconDeCalcul());

  assertEquals(seance.aRecuUneReponse(), false);
});

Deno.test("une séance complète dont l'enfant n'a lu que les étapes de leçon n'a reçu aucune réponse", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());

  seance.continuer();

  assertEquals(seance.aRecuUneReponse(), false);
});

Deno.test("après une réponse juste, la séance a reçu une réponse", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());

  seance.repondre(Reponse.choix(BONNE_REPONSE_DU_CALCUL));

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("après une réponse fausse, la séance a reçu une réponse même si son avancement reste à 0", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());

  seance.repondre(Reponse.choix(MAUVAISE_REPONSE_DU_CALCUL));

  assertEquals(seance.avancement().questionsReussies, 0);
  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("après « Je ne sais pas » seul, la séance a reçu une réponse", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());

  seance.direJeNeSaisPas();

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("après la dernière bonne réponse, la séance finie a reçu une réponse", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());
  seance.repondre(Reponse.choix(MAUVAISE_REPONSE_DU_CALCUL));
  seance.repondre(Reponse.choix(BONNE_REPONSE_DU_CALCUL));

  assertEquals(seance.estFinie(), true);
  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("une séance reconstituée puis rejouée avec une réponse a reçu une réponse", () => {
  const origine = commencerSansLesEtapesDeLecon(leconDeCalcul());
  origine.repondre(Reponse.choix(MAUVAISE_REPONSE_DU_CALCUL));
  origine.repondre(Reponse.choix(BONNE_REPONSE_DU_CALCUL));
  origine.terminer(fin);
  const reconstituee = Seance.reconstituer(leconDeCalcul(), origine.aEnregistrer());
  while (reconstituee.etapeDeLeconEnCours()) reconstituee.continuer();

  reconstituee.repondre(Reponse.choix(MAUVAISE_REPONSE_DU_CALCUL));

  assertEquals(reconstituee.aRecuUneReponse(), true);
});
