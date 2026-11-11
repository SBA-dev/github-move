import { assertEquals } from "@std/assert";
import { lireLecon } from "../../catalogue/domain/lire-lecon.ts";
import { cleDePhrase } from "../domain/cle-de-phrase.ts";
import { repertoireDeTest } from "../test_utils/repertoire-de-test.ts";
import { adressesDesPhrasesDeLaLecon } from "./adresses-des-phrases-de-la-lecon.ts";

const PROGRAMME = {
  section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
  citation: "Décoder et encoder de 25 à 30 CGP.",
};

function uneLeconDeBulles(consigne: string) {
  return lireLecon({
    id: "fr-cp-ferme",
    matiere: "francais",
    niveau: "CP",
    titre: "Les animaux de la ferme",
    ordre: 1,
    programme: PROGRAMME,
    lecon: [],
    exercices: [{
      type: "bulles",
      consigne,
      questions: [{ question: "Quel animal donne du lait ?", choix: ["vache", "poule"], reponse: "vache" }],
    }],
  });
}

function uneLeconDeDictee(mot: string) {
  return lireLecon({
    id: "fr-cp-dictee",
    matiere: "francais",
    niveau: "CP",
    titre: "Les animaux de la ferme",
    ordre: 1,
    programme: PROGRAMME,
    lecon: [],
    exercices: [{ type: "dictee", mots: [{ mot, phrase: "Le chat dort." }] }],
  });
}

Deno.test("seules les phrases de la leçon présentes au répertoire ont une adresse", () => {
  const lecon = uneLeconDeBulles("Choisis la bonne bulle. Prends ton temps.");
  const repertoire = repertoireDeTest({
    [cleDePhrase("Choisis la bonne bulle.")]: { normale: "aaaa1111" },
    [cleDePhrase("Prends ton temps.")]: { normale: "bbbb2222" },
  });

  const adresses = adressesDesPhrasesDeLaLecon(lecon, repertoire);

  assertEquals(
    [...adresses].sort(),
    [
      `/voix/${cleDePhrase("Choisis la bonne bulle.")}-aaaa1111.mp3`,
      `/voix/${cleDePhrase("Prends ton temps.")}-bbbb2222.mp3`,
    ].sort(),
  );
});

Deno.test("un mot dit lentement dont le MP3 lent est au répertoire a aussi son adresse lente", () => {
  const lecon = uneLeconDeDictee("chat");
  const repertoire = repertoireDeTest({
    [cleDePhrase("chat")]: { normale: "cccc3333", lente: "dddd4444" },
  });

  const adresses = adressesDesPhrasesDeLaLecon(lecon, repertoire);

  assertEquals(adresses.includes(`/voix/${cleDePhrase("chat")}-lente-dddd4444.mp3`), true);
});

Deno.test("une phrase dite deux fois dans la leçon n'a qu'une adresse", () => {
  const lecon = uneLeconDeBulles("Prends ton temps. Prends ton temps.");
  const repertoire = repertoireDeTest({ [cleDePhrase("Prends ton temps.")]: { normale: "bbbb2222" } });

  assertEquals(adressesDesPhrasesDeLaLecon(lecon, repertoire), [
    `/voix/${cleDePhrase("Prends ton temps.")}-bbbb2222.mp3`,
  ]);
});

Deno.test("un répertoire vide ne donne aucune adresse", () => {
  const lecon = uneLeconDeBulles("Choisis la bonne bulle.");

  assertEquals(adressesDesPhrasesDeLaLecon(lecon, repertoireDeTest()), []);
});
