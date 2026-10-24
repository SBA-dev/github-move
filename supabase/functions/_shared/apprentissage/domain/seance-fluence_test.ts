import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDUneSeuleFluenceAuCP, leconLesDoublesAvecUneFluenceAuCP } from "../test_utils/lecons-de-fluence.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { JeNeSaisPasEnFluence } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const debut = new Date("2026-10-23T10:00:00Z");
const apres = (secondes: number) => new Date(debut.getTime() + secondes * 1000);
const finDeLaSeance = new Date("2026-10-23T10:30:00Z");

function commencer(lecon: Lecon): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
  );
}

function seanceArriveeALaFluence(): Seance {
  const seance = commencer(leconLesDoublesAvecUneFluenceAuCP());
  seance.repondre(Reponse.choix("4"));
  seance.repondre(Reponse.choix("6"));
  seance.demarrerLaFluence(debut);
  return seance;
}

Deno.test("une fluence compte pour une question dans l'avancement, réussie quand le temps est écoulé", () => {
  const seance = seanceArriveeALaFluence();
  seance.repondre(Reponse.nombre(20), apres(5));
  const avantLaFin = seance.avancement();

  seance.finirLaFluence(apres(45));

  assertEquals(
    [avantLaFin.questionsReussies, avantLaFin.total, seance.avancement().questionsReussies, seance.estFinie()],
    [2, 3, 3, true],
  );
});

Deno.test("les réponses fausses d'une fluence ne coûtent aucune erreur ni étoile", () => {
  const seance = seanceArriveeALaFluence();
  seance.repondre(Reponse.nombre(21), apres(5));
  seance.repondre(Reponse.nombre(22), apres(10));
  seance.finirLaFluence(apres(45));

  const fait = seance.terminer(finDeLaSeance);

  assertEquals([fait.erreurs, fait.etoiles, fait.questionsRatees], [0, 3, []]);
});

Deno.test("la fluence ne propose pas « Je ne sais pas »", () => {
  const seance = seanceArriveeALaFluence();

  assertThrows(() => seance.direJeNeSaisPas(), JeNeSaisPasEnFluence);
});

Deno.test("une séance faite seulement d'une fluence ne donne pas d'étoiles", () => {
  const seance = commencer(leconDUneSeuleFluenceAuCP());
  seance.demarrerLaFluence(debut);
  seance.repondre(Reponse.nombre(20), apres(5));
  seance.finirLaFluence(apres(45));

  const fait = seance.terminer(finDeLaSeance);

  assertEquals(fait.etoiles, undefined);
});

Deno.test("la séance terminée porte le score de chaque fluence, sous le titre de l'exercice", () => {
  const seance = seanceArriveeALaFluence();
  seance.repondre(Reponse.nombre(20), apres(5));
  seance.repondre(Reponse.nombre(20), apres(8));
  seance.finirLaFluence(apres(45));

  const fait = seance.terminer(finDeLaSeance);

  assertEquals(fait.scoresDeFluence, { "Calcul rapide : les doubles": 2 });
});

Deno.test("les réponses fausses d'une fluence servent à l'adaptation de la difficulté, par type", () => {
  const seance = seanceArriveeALaFluence();
  seance.repondre(Reponse.nombre(20), apres(5));
  seance.repondre(Reponse.nombre(20), apres(8));
  seance.repondre(Reponse.nombre(19), apres(10));
  seance.finirLaFluence(apres(45));

  const fait = seance.terminer(finDeLaSeance);

  assertEquals([fait.parType.fluence, fait.erreurs], [{ reussites: 2, erreurs: 1 }, 0]);
});

Deno.test("rejouer une séance avec une fluence redonne le même résultat", () => {
  const lecon = leconLesDoublesAvecUneFluenceAuCP();
  const seance = seanceArriveeALaFluence();
  seance.repondre(Reponse.nombre(20), apres(5));
  seance.repondre(Reponse.nombre(19), apres(8));
  seance.repondre(Reponse.nombre(20), apres(12));
  seance.finirLaFluence(apres(45));
  const fait = seance.terminer(finDeLaSeance);

  assertEquals(revaliderLaSeance(lecon, seance.aEnregistrer()), fait);
});
