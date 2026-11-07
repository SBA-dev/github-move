import { assertEquals } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { type Lecon as LeconDuCatalogue, lireLecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import {
  leconPoserUneAdditionEnColonnesAuCP,
  POSITION_DE_LA_LECON_EN_ACTION,
} from "../test_utils/lecons-d-addition.ts";
import { leconDeClasserLesSons, leconDOrdreDuMot, seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { ecrire, leconDeDicteeDuChat, seanceDeDictee } from "../test_utils/lecons-de-dictee.ts";
import { leconDUneSeuleFluenceAuCP } from "../test_utils/lecons-de-fluence.ts";
import { leconDeCalcul, leconDeDeuxExercicesCourts } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

const BONNE_REPONSE_DU_CALCUL = "7";
const MAUVAISE_REPONSE_DU_CALCUL = "8";
const fin = new Date("2026-10-23T10:30:00Z");
const debutDeLaFluence = new Date("2026-10-23T10:00:00Z");

function leconDeLaPoesie(): LeconDuCatalogue {
  return lireLecon({
    id: "fr-ce1-poesie",
    matiere: "francais",
    niveau: "CE1",
    titre: "Leçon de test",
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{
      type: "memoriser",
      titre: "Au clair de la lune",
      vers: ["Au clair de la lune,", "Mon ami Pierrot,", "Ma chandelle est morte,"],
    }],
  });
}

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

Deno.test("en dictée, une lettre tapée dans un mot incomplet n'est pas encore une réponse", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  ecrire(seance, "c");

  assertEquals(seance.aRecuUneReponse(), false);
});

Deno.test("en dictée, le mot écrit en entier est une réponse", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  ecrire(seance, "chat");

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("en classer, une étiquette posée dans un mauvais groupe est une réponse", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());

  seance.repondre(Reponse.placement("loup", "g-on"));

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("en ordre, un élément posé à une mauvaise place est une réponse", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  seance.repondre(Reponse.placement("mi", "1"));

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("en addition posée, un chiffre posé est une réponse", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    leconPoserUneAdditionEnColonnesAuCP(),
    ChoixDeSeance.unExercice(POSITION_DE_LA_LECON_EN_ACTION),
  );

  seance.repondre(Reponse.placement("4", "dizaines"));

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("en fluence, le chrono démarré sans réponse n'est pas encore une réponse", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDUneSeuleFluenceAuCP());

  seance.demarrerLaFluence(debutDeLaFluence);

  assertEquals(seance.aRecuUneReponse(), false);
});

Deno.test("en fluence, une réponse donnée pendant le chrono est une réponse", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDUneSeuleFluenceAuCP());
  seance.demarrerLaFluence(debutDeLaFluence);

  seance.repondre(Reponse.nombre(21), new Date(debutDeLaFluence.getTime() + 5000));

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("en mémoriser, une réponse donnée est une réponse", () => {
  const seance = seanceCommencee(leconDeLaPoesie(), hasardSansMelange());

  seance.repondre(Reponse.placement("Mon ami Pierrot,"));

  assertEquals(seance.aRecuUneReponse(), true);
});
