import { assertEquals } from "@std/assert";
import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";
import { badgesDuProfil, nomDuBadge } from "./badges.ts";

type Gabarit = Readonly<{
  id: string;
  matiere?: string;
  niveau?: string;
  ordre?: number;
  titre?: string;
  competence?: string;
}>;

function leconDe(gabarit: Gabarit): Lecon {
  return lireLecon({
    id: gabarit.id,
    matiere: gabarit.matiere ?? "francais",
    niveau: gabarit.niveau ?? "CP",
    titre: gabarit.titre ?? gabarit.id,
    ordre: gabarit.ordre ?? 1,
    ...(gabarit.competence === undefined ? {} : { competence: gabarit.competence }),
    programme: {
      section: "c2-mathematiques-ce1-calculer-avec-des-nombres-entiers",
      citation: "Mémoriser des faits numériques.",
    },
    lecon: [],
    exercices: [],
  });
}

function idsDesBadges(acquises: readonly string[], lecons: readonly Lecon[]): string[] {
  return badgesDuProfil(new Set(acquises), lecons).map((badge) => badge.lecons.join("+"));
}

Deno.test("le nom du badge est la compétence de la leçon", () => {
  const lecon = leconDe({ id: "fr-cp-lire", competence: "Je lis des mots simples" });

  assertEquals(nomDuBadge(lecon), "Je lis des mots simples");
});

Deno.test("sans compétence, le nom du badge est « Je sais : » suivi du titre de la leçon", () => {
  const lecon = leconDe({ id: "fr-cp-etre-avoir", titre: "Être et avoir au présent" });

  assertEquals(nomDuBadge(lecon), "Je sais : Être et avoir au présent");
});

Deno.test("sans leçon acquise, le profil n'a aucun badge", () => {
  const lecons = [leconDe({ id: "fr-cp-lire", competence: "Je lis des mots simples" })];

  assertEquals(badgesDuProfil(new Set(), lecons), []);
});

Deno.test("une leçon acquise avec compétence donne un badge nommé par la compétence, de la matière de la leçon", () => {
  const lecons = [
    leconDe({ id: "ma-ce1-sommes", matiere: "maths", niveau: "CE1", competence: "Je calcule des sommes" }),
  ];

  assertEquals(badgesDuProfil(new Set(["ma-ce1-sommes"]), lecons), [
    { cle: "Je calcule des sommes", nom: "Je calcule des sommes", matiere: "maths", lecons: ["ma-ce1-sommes"] },
  ]);
});

Deno.test("une leçon acquise absente des leçons de la bibliothèque (retirée ou personnelle) ne donne aucun badge", () => {
  const lecons = [leconDe({ id: "fr-cp-lire", competence: "Je lis des mots simples" })];

  assertEquals(badgesDuProfil(new Set(["fr-cp-retiree", "perso-12"]), lecons), []);
});

Deno.test("deux leçons acquises de même compétence donnent un seul badge qui garde les deux leçons", () => {
  const competence = "J'écris des mots invariables sans erreur";
  const lecons = [
    leconDe({ id: "fr-ce1-invariables", niveau: "CE1", competence }),
    leconDe({ id: "fr-ce2-invariables", niveau: "CE2", competence }),
  ];

  assertEquals(badgesDuProfil(new Set(["fr-ce2-invariables", "fr-ce1-invariables"]), lecons), [
    { cle: competence, nom: competence, matiere: "francais", lecons: ["fr-ce1-invariables", "fr-ce2-invariables"] },
  ]);
});

Deno.test("deux leçons acquises sans compétence donnent deux badges, chacun de clé « lecon: » suivie de l'identifiant", () => {
  const lecons = [
    leconDe({ id: "fr-cp-etre-avoir", ordre: 1, titre: "Être et avoir" }),
    leconDe({ id: "fr-cp-masculin-feminin", ordre: 2, titre: "Masculin et féminin" }),
  ];

  const badges = badgesDuProfil(new Set(["fr-cp-etre-avoir", "fr-cp-masculin-feminin"]), lecons);

  assertEquals(badges.map((badge) => badge.cle), ["lecon:fr-cp-etre-avoir", "lecon:fr-cp-masculin-feminin"]);
});

Deno.test("les badges suivent l'ordre des matières, puis des leçons, quel que soit l'ordre du catalogue donné", () => {
  const lecons = [
    leconDe({ id: "ma-ce2-a", matiere: "maths", niveau: "CE2", ordre: 1, competence: "Je calcule" }),
    leconDe({ id: "fr-cp-b", ordre: 2, competence: "Je lis B" }),
    leconDe({ id: "fr-cp-a", ordre: 1, competence: "Je lis A" }),
  ];

  assertEquals(idsDesBadges(["ma-ce2-a", "fr-cp-b", "fr-cp-a"], lecons), ["fr-cp-a", "fr-cp-b", "ma-ce2-a"]);
});

Deno.test("à matière égale, un badge du CP vient avant un badge du CE1 même si l'ordre de la leçon du CE1 est plus petit", () => {
  const lecons = [
    leconDe({ id: "fr-ce1-a", niveau: "CE1", ordre: 1, competence: "Je lis CE1" }),
    leconDe({ id: "fr-cp-z", niveau: "CP", ordre: 9, competence: "Je lis CP" }),
  ];

  assertEquals(idsDesBadges(["fr-ce1-a", "fr-cp-z"], lecons), ["fr-cp-z", "fr-ce1-a"]);
});

Deno.test("une leçon de la bibliothèque non acquise ne donne pas de badge", () => {
  const lecons = [
    leconDe({ id: "fr-cp-a", ordre: 1, competence: "Je lis A" }),
    leconDe({ id: "fr-cp-b", ordre: 2, competence: "Je lis B" }),
  ];

  assertEquals(idsDesBadges(["fr-cp-a"], lecons), ["fr-cp-a"]);
});
