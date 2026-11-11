import { assertEquals } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDUneSeuleFluenceAuCP } from "../test_utils/lecons-de-fluence.ts";
import { ecrire, leconDeDicteeDuChat, seanceDeDictee } from "../test_utils/lecons-de-dictee.ts";
import { leconDeCalcul, leconSonsOuOnAn } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

function seanceQuiVientDeCommencer(): Seance {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    leconDeCalcul(),
    ChoixDeSeance.complete(),
  );
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

Deno.test("une séance qui vient de commencer n'a reçu aucune réponse", () => {
  const seance = seanceQuiVientDeCommencer();

  assertEquals(seance.aRecuUneReponse(), false);
});

Deno.test("une séance a reçu une réponse dès la première réponse, juste ou fausse", () => {
  const seanceAvecReponseFausse = seanceQuiVientDeCommencer();
  seanceAvecReponseFausse.repondre(Reponse.choix("8"));
  const seanceAvecReponseJuste = seanceQuiVientDeCommencer();
  seanceAvecReponseJuste.repondre(Reponse.choix("7"));

  assertEquals(
    [seanceAvecReponseFausse.aRecuUneReponse(), seanceAvecReponseJuste.aRecuUneReponse()],
    [true, true],
  );
});

Deno.test('après "Je ne sais pas", la séance a reçu une réponse', () => {
  const seance = seanceQuiVientDeCommencer();

  seance.direJeNeSaisPas();

  assertEquals(seance.aRecuUneReponse(), true);
});

Deno.test("continuer sur une étape de leçon ne compte pas comme une réponse", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    leconSonsOuOnAn(),
    ChoixDeSeance.complete(),
  );

  seance.continuer();

  assertEquals(seance.aRecuUneReponse(), false);
});

Deno.test("démarrer la fluence sans répondre ne compte pas comme une réponse", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    leconDUneSeuleFluenceAuCP(),
    ChoixDeSeance.complete(),
  );
  while (seance.etapeDeLeconEnCours()) seance.continuer();

  seance.demarrerLaFluence(new Date("2026-10-23T10:00:00Z"));

  assertEquals(seance.aRecuUneReponse(), false);
});

Deno.test("en dictée, une lettre tapée avant la fin du mot ne compte pas comme une réponse", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  ecrire(seance, "cha");

  assertEquals(seance.aRecuUneReponse(), false);
});
