import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { leconDeCalcul, leconDeDeuxExercicesCourts } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { SeanceIncoherente } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";
import type { SeanceTermineeAEnregistrer } from "./seance-terminee-a-enregistrer.ts";

const fin = new Date("2026-10-23T10:30:00Z");

function seanceDeCalculTerminee(): { seance: Seance; fait: ReturnType<Seance["terminer"]> } {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardFixe(0, 0, 0),
    "profil-lea",
    leconDeCalcul(),
    ChoixDeSeance.complete(),
  );
  seance.repondre(Reponse.choix("8"));
  seance.repondre(Reponse.choix("7"));
  return { seance, fait: seance.terminer(fin) };
}

function envoiDeCalcul(): SeanceTermineeAEnregistrer {
  return seanceDeCalculTerminee().seance.aEnregistrer();
}

function revaliderCalcul(envoi: SeanceTermineeAEnregistrer, lecon: Lecon = leconDeCalcul()) {
  return revaliderLaSeance(lecon, envoi);
}

Deno.test("rejouer les réponses avec les mêmes tirages redonne le fait SeanceTerminee de la séance d'origine", () => {
  const { seance, fait } = seanceDeCalculTerminee();

  assertEquals(revaliderCalcul(seance.aEnregistrer()), fait);
});

Deno.test("le serveur recalcule les étoiles et ignore celles que le front prétend avoir gagnées", () => {
  const envoiTriche = Object.assign({}, envoiDeCalcul(), { etoiles: 3, erreurs: 0 });

  const fait = revaliderCalcul(envoiTriche);

  assertEquals([fait.etoiles, fait.erreurs], [2, 1]);
});

Deno.test("une séance à qui il manque une question est incohérente", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-2"),
    hasardFixe(0, 0, 0, 0, 0, 0, 0, 0, 0),
    "profil-lea",
    leconDeDeuxExercicesCourts(),
    ChoixDeSeance.complete(),
  );
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  while (!seance.estFinie()) seance.repondre(Reponse.choix("ou"));
  seance.terminer(fin);
  const complet = seance.aEnregistrer();
  const sansLaDerniereQuestion = {
    ...complet,
    tirages: complet.tirages.slice(0, -1),
    reponses: complet.reponses.slice(0, -1),
  };

  assertThrows(
    () => revaliderLaSeance(leconDeDeuxExercicesCourts(), sansLaDerniereQuestion),
    SeanceIncoherente,
  );
});

Deno.test("un exercice inconnu de la leçon rend la séance incohérente", () => {
  const sansExercice = { ...envoiDeCalcul(), choix: ChoixDeSeance.unExercice(5) };

  assertThrows(() => revaliderCalcul(sansExercice), SeanceIncoherente);
});

Deno.test("un tirage qui n'est pas une permutation des choix de la question rend la séance incohérente", () => {
  const tirageInvente = { ...envoiDeCalcul(), tirages: [["6", "7", "8", "10"]] };

  assertThrows(() => revaliderCalcul(tirageInvente), SeanceIncoherente);
});

Deno.test("une question qui ne finit pas par la bonne réponse rend la séance incohérente", () => {
  const sansLaBonneReponse = { ...envoiDeCalcul(), reponses: [[Reponse.choix("8")]] };

  assertThrows(() => revaliderCalcul(sansLaBonneReponse), SeanceIncoherente);
});

Deno.test("une réponse donnée après la réussite rend la séance incohérente", () => {
  const reponseApresLaReussite = {
    ...envoiDeCalcul(),
    reponses: [[Reponse.choix("8"), Reponse.choix("7"), Reponse.choix("6")]],
  };

  assertThrows(() => revaliderCalcul(reponseApresLaReussite), SeanceIncoherente);
});

Deno.test("une réponse qui n'est pas un choix proposé rend la séance incohérente", () => {
  const choixInvente = { ...envoiDeCalcul(), reponses: [[Reponse.choix("42"), Reponse.choix("7")]] };

  assertThrows(() => revaliderCalcul(choixInvente), SeanceIncoherente);
});
