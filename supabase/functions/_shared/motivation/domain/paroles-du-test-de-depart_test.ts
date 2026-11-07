import { assertEquals } from "@std/assert";
import {
  CONSIGNE_DU_TEST_DE_DEPART,
  proposerLeTestDeDepart,
  remercierApresLeTestDeDepart,
} from "./paroles-du-test-de-depart.ts";

Deno.test("le personnage guide propose le test de départ comme un petit jeu où « Je ne sais pas » est permis", () => {
  assertEquals(
    proposerLeTestDeDepart("Léa"),
    "Bonjour Léa ! Veux-tu faire un petit jeu de questions ? Ce n'est pas une interrogation : ça m'aide à savoir ce que tu sais déjà, pour commencer au bon endroit. Tu peux dire « Je ne sais pas », c'est permis !",
  );
});

Deno.test("la consigne du test de départ rassure l'enfant", () => {
  assertEquals(
    CONSIGNE_DU_TEST_DE_DEPART,
    "C'est parti ! Réponds tranquillement. Si tu ne sais pas, touche « Je ne sais pas ».",
  );
});

Deno.test("sans leçon cochée, le personnage guide remercie et annonce le parcours", () => {
  assertEquals(
    remercierApresLeTestDeDepart("Léa", 0),
    "Merci Léa ! Maintenant, je sais par où commencer. Ton parcours t'attend !",
  );
});

Deno.test("avec une seule leçon cochée, le personnage guide parle au singulier", () => {
  assertEquals(
    remercierApresLeTestDeDepart("Léa", 1),
    "Merci Léa ! Tu connais déjà 1 leçon : je l'ai cochée. Ton parcours t'attend !",
  );
});

Deno.test("avec plusieurs leçons cochées, le personnage guide parle au pluriel", () => {
  assertEquals(
    remercierApresLeTestDeDepart("Léa", 4),
    "Merci Léa ! Tu connais déjà 4 leçons : je les ai cochées. Ton parcours t'attend !",
  );
});
