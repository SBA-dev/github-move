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
    personnageGuide: { nom: "Agent Max", titre: "le détective futé" },
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

Deno.test("chaque personnage guide a le caractère de sa voix (sexe, hauteur, rythme)", () => {
  // Arrange
  const caracteresAttendus = [
    ["princesse", { sexe: "feminine", hauteur: 1.25, rythme: 1.0 }],
    ["animaux", { sexe: "feminine", hauteur: 1.45, rythme: 1.08 }],
    ["sports", { sexe: "masculine", hauteur: 1.05, rythme: 1.07 }],
    ["police", { sexe: "feminine", hauteur: 1.05, rythme: 1.0 }],
    ["pompier", { sexe: "masculine", hauteur: 0.95, rythme: 1.0 }],
    ["danse", { sexe: "feminine", hauteur: 1.2, rythme: 1.02 }],
  ] as const;

  for (const [cle, caractere] of caracteresAttendus) {
    // Act
    const univers = universDe(cle);

    // Assert
    assertEquals(univers.personnageGuide.caractere, caractere);
  }
});
