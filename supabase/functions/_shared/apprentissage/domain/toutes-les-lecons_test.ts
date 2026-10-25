import { assertEquals } from "@std/assert";
import { lireLecon, Niveau, toutesLesMatieres } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { choixDuFiltre, matiereReussieDuNiveau, toutesLesLecons } from "./toutes-les-lecons.ts";

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

function entreesDUnCe1AyantReussiToutesSesMaths() {
  return {
    lecons: [
      lecon("ma-ce1-additions", "maths", "CE1", 1),
      lecon("ma-ce1-soustractions", "maths", "CE1", 2),
      lecon("fr-ce1-sons", "francais", "CE1", 1),
      lecon("ma-ce2-nombres", "maths", "CE2", 1),
      lecon("ma-ce2-tables", "maths", "CE2", 2),
      lecon("fr-ce2-accords", "francais", "CE2", 1),
    ],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([
      ["ma-ce1-additions", Etoiles.de(1)],
      ["ma-ce1-soustractions", Etoiles.de(2)],
    ]),
  };
}

Deno.test("filtrer par niveau « Toutes les leçons » s'applique aussi aux leçons de la classe au-dessus, et le filtre par matière et par niveau ne garde que les maths du CE1", () => {
  const entrees = entreesDUnCe1AyantReussiToutesSesMaths();

  const duCe2 = toutesLesLecons(entrees, { niveau: Niveau.de("CE2") });
  const mathsDuCe1 = toutesLesLecons(entrees, { matiere: matiere("maths"), niveau: Niveau.de("CE1") });

  assertEquals(duCe2.lecons.map(({ lecon }) => lecon), ["ma-ce2-nombres", "ma-ce2-tables"]);
  assertEquals(mathsDuCe1.lecons.map(({ lecon }) => lecon), ["ma-ce1-additions", "ma-ce1-soustractions"]);
});

Deno.test("une leçon de la classe ajoutée plus tard referme la classe au-dessus de sa matière, sauf les leçons déjà réussies (26.17)", () => {
  const entrees = entreesDUnCe1AyantReussiToutesSesMaths();
  entrees.lecons.push(lecon("ma-ce1-geometrie", "maths", "CE1", 3));
  entrees.meilleuresEtoiles.set("ma-ce2-tables", Etoiles.de(1));

  const { lecons } = toutesLesLecons(entrees, { niveau: Niveau.de("CE2") });

  assertEquals(lecons.map(({ lecon }) => lecon), ["ma-ce2-tables"]);
});

Deno.test("« Toutes les leçons » donne au front la matière de chaque leçon des classes d'avant (26.20)", () => {
  const { leconsDesClassesDAvant } = toutesLesLecons(entreesDuFiltre(), {});

  assertEquals(
    leconsDesClassesDAvant.flatMap(({ lecons }) => lecons.map(({ lecon, matiere }) => [lecon, matiere.code])),
    [["fr-cp-lettres", "francais"], ["ma-cp-nombres", "maths"], ["fr-ce1-sons", "francais"]],
  );
});

Deno.test("« Toutes les leçons » donne au front le nombre de leçons montrées, les deux parties comptées (26.20)", () => {
  const sansFiltre = toutesLesLecons(entreesDuFiltre(), {});
  const classeDAvant = toutesLesLecons(entreesDuFiltre(), { niveau: Niveau.de("CP") });
  const classeDeLEnfant = toutesLesLecons(entreesDuFiltre(), { niveau: Niveau.de("CE2") });

  assertEquals(
    [sansFiltre, classeDAvant, classeDeLEnfant].map((resultat) => resultat.nombreDeLecons),
    [5, 2, 2],
  );
});

Deno.test("« Toutes les leçons » dit au front si seules les classes d'avant sont montrées (26.20)", () => {
  const seulement = (niveau?: string) =>
    toutesLesLecons(entreesDuFiltre(), niveau === undefined ? {} : { niveau: Niveau.de(niveau) })
      .seulementLesClassesDAvant;

  assertEquals([seulement(), seulement("CP"), seulement("CE1"), seulement("CE2")], [false, true, true, false]);
});

Deno.test("« Toutes les leçons » donne au front le nombre de leçons des classes d'avant après filtre, zéro quand la classe de l'enfant est choisie (26.20)", () => {
  const sansFiltre = toutesLesLecons(entreesDuFiltre(), {});
  const classeDAvant = toutesLesLecons(entreesDuFiltre(), { niveau: Niveau.de("CP") });
  const classeDeLEnfant = toutesLesLecons(entreesDuFiltre(), { niveau: Niveau.de("CE2") });

  assertEquals(
    [sansFiltre, classeDAvant, classeDeLEnfant].map((resultat) => resultat.nombreDansLesClassesDAvant),
    [3, 2, 0],
  );
});

function entreesAvecLeconsPersonnelles() {
  return {
    ...entreesDuFiltre(),
    leconsPersonnelles: [
      lecon("perso-ma-cm1-fractions", "maths", "CM1", 0),
      lecon("perso-fr-cp-chats", "francais", "CP", 0),
      lecon("perso-fr-ce2-volcans", "francais", "CE2", 0),
    ],
    meilleuresEtoiles: new Map([["perso-fr-cp-chats", Etoiles.de(2)]]),
  };
}

Deno.test("« Toutes les leçons » montre en tête « Pour toi » : les leçons personnelles de l'enfant, de tout niveau, dans l'ordre reçu, avec leur état hors du parcours", () => {
  const { pourToi } = toutesLesLecons(entreesAvecLeconsPersonnelles(), {});

  assertEquals(
    pourToi.map(({ lecon, matiere, niveau, titre, etat }) => ({ lecon, matiere: matiere.code, niveau, titre, etat })),
    [
      {
        lecon: "perso-ma-cm1-fractions",
        matiere: "maths",
        niveau: Niveau.de("CM1"),
        titre: "Titre de perso-ma-cm1-fractions",
        etat: { genre: "aDecouvrir" },
      },
      {
        lecon: "perso-fr-cp-chats",
        matiere: "francais",
        niveau: Niveau.de("CP"),
        titre: "Titre de perso-fr-cp-chats",
        etat: { genre: "reussie", etoiles: Etoiles.de(2) },
      },
      {
        lecon: "perso-fr-ce2-volcans",
        matiere: "francais",
        niveau: Niveau.de("CE2"),
        titre: "Titre de perso-fr-ce2-volcans",
        etat: { genre: "aDecouvrir" },
      },
    ],
  );
});

Deno.test("les filtres « Matière » et « Niveau » s'appliquent aussi à « Pour toi »", () => {
  const parMatiere = toutesLesLecons(entreesAvecLeconsPersonnelles(), { matiere: matiere("francais") });
  const parNiveau = toutesLesLecons(entreesAvecLeconsPersonnelles(), { niveau: Niveau.de("CM1") });
  const parLesDeux = toutesLesLecons(entreesAvecLeconsPersonnelles(), {
    matiere: matiere("francais"),
    niveau: Niveau.de("CM1"),
  });

  assertEquals(parMatiere.pourToi.map(({ lecon }) => lecon), ["perso-fr-cp-chats", "perso-fr-ce2-volcans"]);
  assertEquals(parNiveau.pourToi.map(({ lecon }) => lecon), ["perso-ma-cm1-fractions"]);
  assertEquals(parLesDeux.pourToi, []);
});

Deno.test("sans leçon personnelle, « Pour toi » est vide et « Toutes les leçons » ne change pas", () => {
  const sans = toutesLesLecons(entreesDuFiltre(), {});
  const avecListeVide = toutesLesLecons({ ...entreesDuFiltre(), leconsPersonnelles: [] }, {});

  assertEquals(sans.pourToi, []);
  assertEquals(avecListeVide, sans);
});

Deno.test("les choix des listes « Matière » et « Niveau » proposent aussi la matière et le niveau qui n'existent que dans les leçons personnelles", () => {
  const entrees = {
    lecons: [lecon("fr-ce2-accords", "francais", "CE2", 1)],
    niveau: Niveau.de("CE2"),
    meilleuresEtoiles: new Map(),
    leconsPersonnelles: [lecon("perso-sc-cm1-volcans", "sciences", "CM1", 0)],
  };

  const { matieres, niveaux } = choixDuFiltre(entrees);

  assertEquals(matieres.map(({ code }) => code), ["francais", "sciences"]);
  assertEquals(niveaux.map(({ valeur }) => valeur), ["CE2", "CM1"]);
});

Deno.test("« Toutes les leçons » compte aussi les leçons « Pour toi » dans le nombre de leçons montrées", () => {
  const sansFiltre = toutesLesLecons(entreesAvecLeconsPersonnelles(), {});

  assertEquals(sansFiltre.nombreDeLecons, 5 + 3);
});

Deno.test("le nombre de leçons montrées compte une leçon personnelle seule retenue par le filtre", () => {
  const resultat = toutesLesLecons(entreesAvecLeconsPersonnelles(), { niveau: Niveau.de("CM1") });

  assertEquals(resultat.nombreDeLecons, 1);
});

Deno.test("une leçon personnelle réussie à 2 étoiles ne ferme pas une matière réussie tant que les leçons de la classe ne sont pas toutes réussies", () => {
  const entrees = {
    lecons: [lecon("ma-ce1-additions", "maths", "CE1", 1), lecon("ma-ce1-soustractions", "maths", "CE1", 2)],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([["ma-ce1-additions", Etoiles.de(1)], ["perso-ma-ce1-doubles", Etoiles.de(2)]]),
    leconsPersonnelles: [lecon("perso-ma-ce1-doubles", "maths", "CE1", 0)],
  };

  assertEquals(matiereReussieDuNiveau(entrees, matiere("maths")), false);
});
