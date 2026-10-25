import { assertEquals } from "@std/assert";
import { lireLecon, Niveau, toutesLesMatieres } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { choixDuFiltre, toutesLesLecons } from "./toutes-les-lecons.ts";

function lecon(id: string, matiere: string, niveau: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau,
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

Deno.test("« Toutes les leçons » montre les leçons de la classe de l'enfant, de toutes les matières, rangées par matière du Catalogue puis par ordre, avec leur état du parcours", () => {
  const entrees = {
    lecons: [
      lecon("ma-ce1-additions", "maths", "CE1", 1),
      lecon("fr-ce1-syllabes", "francais", "CE1", 20),
      lecon("fr-ce1-sons", "francais", "CE1", 10),
      lecon("fr-ce1-lettres", "francais", "CE1", 10),
      lecon("fr-cp-voyelles", "francais", "CP", 5),
      lecon("fr-ce2-accords", "francais", "CE2", 5),
    ],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([["fr-ce1-sons", Etoiles.de(2)]]),
  };

  const { lecons } = toutesLesLecons(entrees, {});

  assertEquals(
    lecons.map(({ lecon, matiere, niveau, titre, etat }) => ({ lecon, matiere: matiere.code, niveau, titre, etat })),
    [
      {
        lecon: "fr-ce1-lettres",
        matiere: "francais",
        niveau: Niveau.de("CE1"),
        titre: "Titre de fr-ce1-lettres",
        etat: { genre: "prochaine" },
      },
      {
        lecon: "fr-ce1-sons",
        matiere: "francais",
        niveau: Niveau.de("CE1"),
        titre: "Titre de fr-ce1-sons",
        etat: { genre: "reussie", etoiles: Etoiles.de(2) },
      },
      {
        lecon: "fr-ce1-syllabes",
        matiere: "francais",
        niveau: Niveau.de("CE1"),
        titre: "Titre de fr-ce1-syllabes",
        etat: { genre: "aDecouvrir" },
      },
      {
        lecon: "ma-ce1-additions",
        matiere: "maths",
        niveau: Niveau.de("CE1"),
        titre: "Titre de ma-ce1-additions",
        etat: { genre: "prochaine" },
      },
    ],
  );
});

Deno.test("« Toutes les leçons » montre, après la classe de l'enfant, les leçons de la classe juste au-dessus dans une matière dont il a réussi toutes les leçons de sa classe, et dans cette matière seulement", () => {
  const entrees = {
    lecons: [
      lecon("fr-ce1-sons", "francais", "CE1", 1),
      lecon("ma-ce1-additions", "maths", "CE1", 1),
      lecon("ma-ce1-soustractions", "maths", "CE1", 2),
      lecon("ma-ce2-tables", "maths", "CE2", 2),
      lecon("ma-ce2-nombres", "maths", "CE2", 1),
      lecon("ma-cm1-fractions", "maths", "CM1", 1),
      lecon("fr-ce2-accords", "francais", "CE2", 1),
      lecon("emc-ce2-regles", "emc", "CE2", 1),
    ],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([["ma-ce1-additions", Etoiles.de(1)]]),
    leconsReussiesAuTestDeDepart: new Set(["ma-ce1-soustractions"]),
  };

  const { lecons } = toutesLesLecons(entrees, {});

  assertEquals(
    lecons.map(({ lecon, niveau, etat }) => ({ lecon, niveau, etat })),
    [
      { lecon: "fr-ce1-sons", niveau: Niveau.de("CE1"), etat: { genre: "prochaine" } },
      { lecon: "ma-ce1-additions", niveau: Niveau.de("CE1"), etat: { genre: "reussie", etoiles: Etoiles.de(1) } },
      { lecon: "ma-ce1-soustractions", niveau: Niveau.de("CE1"), etat: { genre: "reussieAuTestDeDepart" } },
      { lecon: "ma-ce2-nombres", niveau: Niveau.de("CE2"), etat: { genre: "aDecouvrir" } },
      { lecon: "ma-ce2-tables", niveau: Niveau.de("CE2"), etat: { genre: "aDecouvrir" } },
    ],
  );
});

Deno.test("« Toutes les leçons » montre toujours les leçons réussies d'une classe au-dessus, même dans une matière dont l'enfant n'a pas réussi toutes les leçons de sa classe, et laisse de côté celles qui ne sont pas réussies", () => {
  const entrees = {
    lecons: [
      lecon("fr-ce1-sons", "francais", "CE1", 1),
      lecon("fr-ce2-accords", "francais", "CE2", 1),
      lecon("fr-ce2-conjugaison", "francais", "CE2", 2),
      lecon("fr-cm1-recits", "francais", "CM1", 1),
      lecon("emc-ce2-regles", "emc", "CE2", 1),
    ],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([
      ["fr-ce2-accords", Etoiles.de(2)],
      ["emc-ce2-regles", Etoiles.de(1)],
    ]),
    leconsReussiesAuTestDeDepart: new Set(["fr-cm1-recits"]),
  };

  const { lecons } = toutesLesLecons(entrees, {});

  assertEquals(
    lecons.map(({ lecon, niveau, etat }) => ({ lecon, niveau, etat })),
    [
      { lecon: "fr-ce1-sons", niveau: Niveau.de("CE1"), etat: { genre: "prochaine" } },
      { lecon: "fr-ce2-accords", niveau: Niveau.de("CE2"), etat: { genre: "reussie", etoiles: Etoiles.de(2) } },
      { lecon: "emc-ce2-regles", niveau: Niveau.de("CE2"), etat: { genre: "reussie", etoiles: Etoiles.de(1) } },
      { lecon: "fr-cm1-recits", niveau: Niveau.de("CM1"), etat: { genre: "reussieAuTestDeDepart" } },
    ],
  );
});

Deno.test("« Toutes les leçons » ne montre aucune leçon d'une classe au-dessus à un enfant de CM2, qui n'a pas de classe au-dessus", () => {
  const entrees = {
    lecons: [
      lecon("ma-cm2-fractions", "maths", "CM2", 1),
      lecon("ma-cm2-proportion", "maths", "CM2", 2),
    ],
    niveau: Niveau.de("CM2"),
    meilleuresEtoiles: new Map([
      ["ma-cm2-fractions", Etoiles.de(2)],
      ["ma-cm2-proportion", Etoiles.de(1)],
    ]),
  };

  const { lecons } = toutesLesLecons(entrees, {});

  assertEquals(lecons.map(({ lecon, niveau }) => ({ lecon, niveau })), [
    { lecon: "ma-cm2-fractions", niveau: Niveau.de("CM2") },
    { lecon: "ma-cm2-proportion", niveau: Niveau.de("CM2") },
  ]);
});

Deno.test("« Toutes les leçons » range les leçons des classes d'avant par classe (CP puis CE1), puis par matière du Catalogue, ordre et identifiant, quelle que soit la matière, avec leur état hors du parcours, et ne les mêle pas aux leçons de la classe", () => {
  const entrees = {
    lecons: [
      lecon("fr-ce2-accords", "francais", "CE2", 1),
      lecon("sc-cp-vivant", "sciences", "CP", 1),
      lecon("ma-ce1-additions", "maths", "CE1", 1),
      lecon("fr-ce1-sons", "francais", "CE1", 2),
      lecon("fr-cp-voyelles", "francais", "CP", 2),
      lecon("fr-cp-lettres", "francais", "CP", 1),
      lecon("fr-cp-syllabes", "francais", "CP", 2),
      lecon("ma-cp-nombres", "maths", "CP", 1),
      lecon("fr-cm1-recits", "francais", "CM1", 1),
    ],
    niveau: Niveau.de("CE2"),
    meilleuresEtoiles: new Map([["fr-cp-lettres", Etoiles.de(2)]]),
    leconsReussiesAuTestDeDepart: new Set(["ma-ce1-additions"]),
  };

  const { lecons, leconsDesClassesDAvant } = toutesLesLecons(entrees, {});

  assertEquals(
    leconsDesClassesDAvant.map(({ niveau, lecons }) => ({
      niveau,
      lecons: lecons.map(({ lecon, niveau, titre, etat }) => ({ lecon, niveau, titre, etat })),
    })),
    [
      {
        niveau: Niveau.de("CP"),
        lecons: [
          {
            lecon: "fr-cp-lettres",
            niveau: Niveau.de("CP"),
            titre: "Titre de fr-cp-lettres",
            etat: { genre: "reussie", etoiles: Etoiles.de(2) },
          },
          {
            lecon: "fr-cp-syllabes",
            niveau: Niveau.de("CP"),
            titre: "Titre de fr-cp-syllabes",
            etat: { genre: "aDecouvrir" },
          },
          {
            lecon: "fr-cp-voyelles",
            niveau: Niveau.de("CP"),
            titre: "Titre de fr-cp-voyelles",
            etat: { genre: "aDecouvrir" },
          },
          {
            lecon: "ma-cp-nombres",
            niveau: Niveau.de("CP"),
            titre: "Titre de ma-cp-nombres",
            etat: { genre: "aDecouvrir" },
          },
          {
            lecon: "sc-cp-vivant",
            niveau: Niveau.de("CP"),
            titre: "Titre de sc-cp-vivant",
            etat: { genre: "aDecouvrir" },
          },
        ],
      },
      {
        niveau: Niveau.de("CE1"),
        lecons: [
          {
            lecon: "fr-ce1-sons",
            niveau: Niveau.de("CE1"),
            titre: "Titre de fr-ce1-sons",
            etat: { genre: "aDecouvrir" },
          },
          {
            lecon: "ma-ce1-additions",
            niveau: Niveau.de("CE1"),
            titre: "Titre de ma-ce1-additions",
            etat: { genre: "reussieAuTestDeDepart" },
          },
        ],
      },
    ],
  );
  assertEquals(lecons.map(({ lecon }) => lecon), ["fr-ce2-accords"]);
});

Deno.test("« Toutes les leçons » n'a aucune leçon des classes d'avant pour un enfant de CP, qui n'a pas de classe inférieure", () => {
  const entrees = {
    lecons: [
      lecon("fr-cp-lettres", "francais", "CP", 1),
      lecon("ma-ce1-additions", "maths", "CE1", 1),
    ],
    niveau: Niveau.de("CP"),
    meilleuresEtoiles: new Map(),
  };

  const { leconsDesClassesDAvant } = toutesLesLecons(entrees, {});

  assertEquals(leconsDesClassesDAvant, []);
});

function matiere(code: string) {
  return toutesLesMatieres().find((candidate) => candidate.code === code)!;
}

function entreesDuFiltre() {
  return {
    lecons: [
      lecon("fr-cp-lettres", "francais", "CP", 1),
      lecon("ma-cp-nombres", "maths", "CP", 1),
      lecon("fr-ce1-sons", "francais", "CE1", 1),
      lecon("fr-ce2-accords", "francais", "CE2", 1),
      lecon("ma-ce2-tables", "maths", "CE2", 1),
    ],
    niveau: Niveau.de("CE2"),
    meilleuresEtoiles: new Map(),
  };
}

function identifiants(resultat: ReturnType<typeof toutesLesLecons>) {
  return {
    lecons: resultat.lecons.map(({ lecon }) => lecon),
    classesDAvant: resultat.leconsDesClassesDAvant.map(({ niveau, lecons }) => ({
      niveau: niveau.valeur,
      lecons: lecons.map(({ lecon }) => lecon),
    })),
  };
}

Deno.test("filtrer « Toutes les leçons » par matière ne garde que les leçons de cette matière, dans la classe de l'enfant et dans les classes d'avant, et fait disparaître une classe d'avant sans leçon de cette matière", () => {
  const resultat = toutesLesLecons(entreesDuFiltre(), { matiere: matiere("maths") });

  assertEquals(identifiants(resultat), {
    lecons: ["ma-ce2-tables"],
    classesDAvant: [{ niveau: "CP", lecons: ["ma-cp-nombres"] }],
  });
});

Deno.test("choisir une classe d'avant dans le filtre « Niveau » ne laisse que la section de cette classe, et aucune leçon de la classe de l'enfant", () => {
  const resultat = toutesLesLecons(entreesDuFiltre(), { niveau: Niveau.de("CP") });

  assertEquals(identifiants(resultat), {
    lecons: [],
    classesDAvant: [{ niveau: "CP", lecons: ["fr-cp-lettres", "ma-cp-nombres"] }],
  });
});

Deno.test("choisir la classe de l'enfant dans le filtre « Niveau » vide la section des classes d'avant", () => {
  const resultat = toutesLesLecons(entreesDuFiltre(), { niveau: Niveau.de("CE2") });

  assertEquals(identifiants(resultat), {
    lecons: ["fr-ce2-accords", "ma-ce2-tables"],
    classesDAvant: [],
  });
});

Deno.test("filtrer « Toutes les leçons » par matière et par niveau combine les deux filtres", () => {
  const resultat = toutesLesLecons(entreesDuFiltre(), { matiere: matiere("francais"), niveau: Niveau.de("CE1") });

  assertEquals(identifiants(resultat), {
    lecons: [],
    classesDAvant: [{ niveau: "CE1", lecons: ["fr-ce1-sons"] }],
  });
});

Deno.test("les choix des listes « Matière » et « Niveau » ne proposent que les matières (ordre du Catalogue) et les niveaux (croissants) qui ont au moins une leçon montrée dans « Toutes les leçons »", () => {
  const entrees = {
    lecons: [
      lecon("ma-cp-nombres", "maths", "CP", 1),
      lecon("fr-ce1-sons", "francais", "CE1", 1),
      lecon("fr-ce2-accords", "francais", "CE2", 1),
      lecon("fr-ce2-conjugaison", "francais", "CE2", 2),
      lecon("ma-ce2-tables", "maths", "CE2", 1),
      lecon("emc-ce2-regles", "emc", "CE2", 1),
      lecon("fr-cm1-recits", "francais", "CM1", 1),
      lecon("sc-cm1-vivant", "sciences", "CM1", 1),
    ],
    niveau: Niveau.de("CE2"),
    meilleuresEtoiles: new Map([
      ["fr-ce2-accords", Etoiles.de(1)],
      ["ma-ce2-tables", Etoiles.de(1)],
    ]),
  };

  const { matieres, niveaux } = choixDuFiltre(entrees);

  assertEquals(matieres.map(({ code }) => code), ["francais", "maths", "emc"]);
  assertEquals(niveaux.map(({ valeur }) => valeur), ["CP", "CE1", "CE2"]);
});
