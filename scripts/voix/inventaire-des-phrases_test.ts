import { assertEquals } from "@std/assert";
import { CleDeLaPhrase } from "../../supabase/functions/_shared/voix/domain/cle-de-la-phrase.ts";
import { inventaireDesPhrases } from "./inventaire-des-phrases.ts";

const PROGRAMME = { section: "section-de-test", citation: "Une citation de test." };

const leconDeClasse = {
  id: "lecon-des-animaux",
  matiere: "francais",
  niveau: "CP",
  titre: "Les animaux",
  ordre: 1,
  programme: PROGRAMME,
  lecon: [{ texte: "Le chat dort.", exemples: ["un chat", "un tapis"] }],
  exercices: [
    {
      type: "classer",
      titre: "Les maisons",
      groupes: [{ id: "1", nom: "chat" }, { id: "2", nom: "tapis" }],
      items: [{ texte: "minou", groupe: "1" }, { texte: "moquette", groupe: "2" }],
    },
    {
      type: "bulles",
      titre: "Les couleurs",
      consigne: "Choisis la bonne réponse.",
      questions: [{ question: "De quelle couleur est le ciel ?", choix: ["bleu", "vert"], reponse: "bleu" }],
    },
  ],
};

const leconDeLangue = {
  id: "lecon-des-salutations",
  matiere: "francais",
  niveau: "CP",
  titre: "Les salutations",
  ordre: 2,
  programme: PROGRAMME,
  exercices: [
    {
      type: "bulles",
      titre: "Les fruits",
      consigne: "Choisis la bonne réponse.",
      questions: [{ question: "Quel fruit est jaune ?", choix: ["la banane", "la fraise"], reponse: "la banane" }],
    },
    {
      type: "ecoute",
      titre: "Les salutations",
      items: [{
        dire: "Hello",
        question: "Écoute bien. Que veut dire ce mot ?",
        choix: ["bonjour", "merci"],
        reponse: "bonjour",
      }],
    },
  ],
};

const cle = (phrase: string) => CleDeLaPhrase.de(phrase).valeur;

Deno.test("l'inventaire liste, pour chaque leçon, les phrases de l'étape, des consignes et des questions que l'application lit", () => {
  // Arrange
  const lecons = [leconDeClasse];

  // Act
  const inventaire = inventaireDesPhrases(lecons);

  // Assert
  assertEquals(
    inventaire.lecons["lecon-des-animaux"],
    [
      "Le chat dort.",
      "un chat.",
      "un tapis",
      "Range chaque étiquette dans la bonne maison.",
      "Fais glisser chaque étiquette, ou touche-la puis touche une maison.",
      "Choisis la bonne réponse.",
      "De quelle couleur est le ciel ?",
    ].map(cle),
  );
});

Deno.test("l'inventaire donne à chaque phrase la clé de la phrase calculée par le domaine Voix", () => {
  // Arrange
  const lecons = [leconDeClasse];

  // Act
  const inventaire = inventaireDesPhrases(lecons);

  // Assert
  const phrase = "De quelle couleur est le ciel ?";
  assertEquals(inventaire.phrases.filter((p) => p.phrase === phrase), [{ cle: cle(phrase), phrase }]);
});

Deno.test("une phrase lue dans deux leçons n'est inventoriée qu'une fois mais figure dans chacune des deux leçons", () => {
  // Arrange
  const lecons = [leconDeClasse, leconDeLangue];

  // Act
  const inventaire = inventaireDesPhrases(lecons);

  // Assert
  const consigne = "Choisis la bonne réponse.";
  assertEquals(inventaire.phrases.filter((p) => p.phrase === consigne).length, 1);
  assertEquals(inventaire.lecons["lecon-des-animaux"].includes(cle(consigne)), true);
  assertEquals(inventaire.lecons["lecon-des-salutations"].includes(cle(consigne)), true);
});

Deno.test("le mot à écouter en langue étrangère n'est pas inventorié, mais la question posée en français l'est", () => {
  // Arrange
  const lecons = [leconDeLangue];

  // Act
  const inventaire = inventaireDesPhrases(lecons);

  // Assert
  const phrases = inventaire.phrases.map((p) => p.phrase);
  assertEquals(phrases.includes("Hello"), false);
  assertEquals(phrases.includes("Écoute bien."), true);
  assertEquals(phrases.includes("Que veut dire ce mot ?"), true);
});

Deno.test("l'inventaire ne contient aucune phrase sans lettre ni chiffre", () => {
  // Arrange
  const lecon = {
    ...leconDeLangue,
    exercices: [{
      type: "bulles",
      titre: "Les émotions",
      consigne: "Choisis la bonne réponse.",
      questions: [{ question: "Comment lire « Oh non ! » ?", choix: ["triste", "joyeux"], reponse: "triste" }],
    }],
  };

  // Act
  const inventaire = inventaireDesPhrases([lecon]);

  // Assert
  assertEquals(inventaire.phrases.filter((p) => !/[\p{L}\p{N}]/u.test(p.phrase)), []);
});
