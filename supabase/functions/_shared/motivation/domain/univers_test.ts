import { assertEquals, assertObjectMatch } from "@std/assert";
import { type CleUnivers, UNIVERS, universDe } from "./univers.ts";

const catalogueAttendu = [
  {
    cle: "princesse",
    libelle: "Princesses et fées",
    royaume: "le Royaume des Savanturiers",
    personnageGuide: {
      nom: "Lumi",
      titre: "la fée des nombres et des mots",
    },
  },
  {
    cle: "animaux",
    libelle: "Animaux de la forêt",
    royaume: "la Forêt des Savanturiers",
    personnageGuide: { nom: "Noisette", titre: "l'écureuil savant" },
  },
  {
    cle: "sports",
    libelle: "Sports",
    royaume: "le Stade des Savanturiers",
    personnageGuide: {
      nom: "Coach Léo",
      titre: "l'entraîneur des champions",
    },
  },
  {
    cle: "police",
    libelle: "Police",
    royaume: "le Commissariat des Savanturiers",
    personnageGuide: { nom: "Agente Mila", titre: "la policière détective" },
  },
  {
    cle: "pompier",
    libelle: "Pompiers",
    royaume: "la Caserne des Savanturiers",
    personnageGuide: { nom: "Capitaine Sam", titre: "le pompier courageux" },
  },
  {
    cle: "danse",
    libelle: "Danse",
    royaume: "l'Opéra des Savanturiers",
    personnageGuide: { nom: "Lili", titre: "la danseuse étoile" },
  },
] as const;

Deno.test("chaque univers a son libellé, son royaume et son personnage guide (nom et titre)", () => {
  // Arrange
  for (const attendu of catalogueAttendu) {
    // Act
    const univers = universDe(attendu.cle as CleUnivers);

    // Assert
    assertObjectMatch(univers, attendu);
  }
});

Deno.test("un univers inconnu ou absent donne Animaux de la forêt, avec Noisette", () => {
  // Arrange
  const clesSansUniversConnu: (string | undefined)[] = [undefined, "pirates"];

  for (const cle of clesSansUniversConnu) {
    // Act
    const univers = universDe(cle);

    // Assert
    assertObjectMatch(univers, {
      cle: "animaux",
      libelle: "Animaux de la forêt",
      personnageGuide: { nom: "Noisette" },
    });
  }
});

Deno.test("il y a exactement six univers", () => {
  assertEquals(UNIVERS.length, 6);
});
