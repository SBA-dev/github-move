import { assertEquals, assertThrows } from "@std/assert";
import { lireLecon } from "./lire-lecon.ts";
import { LeconMalFormee } from "./erreurs.ts";

function leconSonsOuOnAn(): Record<string, unknown> {
  return {
    id: "fr-cp-sons-ou-on-an",
    matiere: "francais",
    niveau: "CP",
    titre: "Les sons ou, on, an",
    ordre: 5,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [
      {
        texte: "Certains sons s'écrivent avec deux lettres. O et U ensemble font le son « ou », comme dans loup.",
        exemples: [],
      },
      {
        texte: "O et N font le son « on », comme dans ballon. A et N font le son « an », comme dans maman.",
        exemples: [],
      },
      {
        texte: "Écoute bien chaque mot, et cherche le son que tu entends.",
        exemples: ["ou", "on", "an"],
      },
    ],
    exercices: [],
    competence: "Je reconnais les sons ou, on, an",
  };
}

function leconBoiteAjouter(): Record<string, unknown> {
  return {
    id: "ma-cp-boite-ajouter",
    matiere: "maths",
    niveau: "CP",
    titre: "La boîte à jetons : ajouter",
    ordre: 10,
    programme: {
      section: "c2-mathematiques-cp-les-quatre-operations",
      citation:
        "Les quatre opérations sont mobilisées au CP lors de la résolution de problèmes qui fournit un cadre permettant de donner du sens aux opérations.",
    },
    lecon: [
      {
        texte:
          "Je vais mettre des jetons dans une boîte, puis la fermer. Tu ne pourras plus les voir : il faudra trouver combien il y en a dans ta tête.",
        exemples: [],
      },
      {
        texte:
          "Pour trouver, tu peux compter sur tes doigts, mettre le premier nombre dans ta tête et avancer, ou utiliser un calcul que tu connais.",
        exemples: ["4 dans ma tête… 5, 6, 7"],
      },
    ],
    exercices: [],
    competence: "Je prévois combien il y a de jetons dans la boîte",
    guide: {
      titre: "Pour enseigner les nombres, le calcul et la résolution de problèmes au CP",
      page: 53,
      extrait:
        "La situation de la boîte est une situation de référence pour enseigner ce passage du comptage au calcul dès la première période du CP.",
      fichier:
        "sources/guides/guide-pour-enseigner-les-nombres-le-calcul-et-la-resolution-de-problemes-au-cp-68664.pdf",
    },
  };
}

Deno.test("une leçon du format JSON est lue avec son identité, son niveau et son ordre", () => {
  const lecon = lireLecon(leconSonsOuOnAn());

  assertEquals(lecon.id, "fr-cp-sons-ou-on-an");
  assertEquals(lecon.titre, "Les sons ou, on, an");
  assertEquals(lecon.niveau, "CP");
  assertEquals(lecon.ordre, 5);
});

Deno.test("une leçon cite la section du programme et la citation officielle", () => {
  const lecon = lireLecon(leconSonsOuOnAn());

  assertEquals(
    lecon.programme.section,
    "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
  );
  assertEquals(lecon.programme.citation, "Décoder et encoder de 25 à 30 CGP.");
});

Deno.test("la matière « francais » a pour libellé « Français »", () => {
  const lecon = lireLecon(leconSonsOuOnAn());

  assertEquals(lecon.matiere.libelle, "Français");
});

Deno.test("chaque matière du format a son libellé d'interface", () => {
  const libelles = ["francais", "maths", "sciences", "histoire", "anglais", "emc"].map((matiere) =>
    lireLecon({ ...leconSonsOuOnAn(), matiere }).matiere.libelle
  );

  assertEquals(libelles, [
    "Français",
    "Mathématiques",
    "Sciences",
    "Histoire et géographie",
    "Anglais",
    "Vivre ensemble (EMC)",
  ]);
});

Deno.test("les étapes de leçon gardent leur texte et leurs exemples, dans l'ordre", () => {
  const lecon = lireLecon(leconSonsOuOnAn());

  assertEquals(lecon.etapes.length, 3);
  assertEquals(
    lecon.etapes[0].texte,
    "Certains sons s'écrivent avec deux lettres. O et U ensemble font le son « ou », comme dans loup.",
  );
  assertEquals(lecon.etapes[0].exemples, []);
  assertEquals(lecon.etapes[2].exemples, ["ou", "on", "an"]);
});

Deno.test("une leçon sans champ « lecon » n'a aucune étape de leçon", () => {
  const brut = leconSonsOuOnAn();
  delete brut.lecon;

  assertEquals(lireLecon(brut).etapes, []);
});

Deno.test("une leçon dont « lecon » est vide n'a aucune étape de leçon", () => {
  const lecon = lireLecon({ ...leconSonsOuOnAn(), lecon: [] });

  assertEquals(lecon.etapes, []);
});

Deno.test("la compétence est gardée quand la leçon en a une", () => {
  const lecon = lireLecon(leconSonsOuOnAn());

  assertEquals(lecon.competence, "Je reconnais les sons ou, on, an");
});

Deno.test("une leçon sans compétence ni passage du guide fondamental les laisse absents", () => {
  const brut = leconSonsOuOnAn();
  delete brut.competence;

  const lecon = lireLecon(brut);

  assertEquals(lecon.competence, undefined);
  assertEquals(lecon.guide, undefined);
});

Deno.test("le passage du guide fondamental garde son titre, sa page et son extrait", () => {
  const lecon = lireLecon(leconBoiteAjouter());

  assertEquals(lecon.guide, {
    titre: "Pour enseigner les nombres, le calcul et la résolution de problèmes au CP",
    page: 53,
    extrait:
      "La situation de la boîte est une situation de référence pour enseigner ce passage du comptage au calcul dès la première période du CP.",
  });
});

Deno.test("une leçon lue est en lecture seule", () => {
  const lecon = lireLecon(leconSonsOuOnAn());

  assertEquals(Object.isFrozen(lecon), true);
});

Deno.test("une leçon qui n'est pas un objet est mal formée", () => {
  for (const brut of [null, undefined, "fr-cp-sons-ou-on-an", 42, []]) {
    assertThrows(() => lireLecon(brut), LeconMalFormee);
  }
});

Deno.test("une leçon sans identifiant est mal formée", () => {
  const brut = leconSonsOuOnAn();
  delete brut.id;

  assertThrows(() => lireLecon(brut), LeconMalFormee);
});

Deno.test("une leçon sans titre est mal formée", () => {
  const brut = leconSonsOuOnAn();
  delete brut.titre;

  assertThrows(() => lireLecon(brut), LeconMalFormee);
});

Deno.test("une leçon d'une matière inconnue est mal formée", () => {
  assertThrows(() => lireLecon({ ...leconSonsOuOnAn(), matiere: "dessin" }), LeconMalFormee);
});

Deno.test("une leçon d'un niveau inconnu est mal formée", () => {
  assertThrows(() => lireLecon({ ...leconSonsOuOnAn(), niveau: "6e" }), LeconMalFormee);
});

Deno.test("une leçon dont les exercices ne sont pas un tableau est mal formée", () => {
  assertThrows(() => lireLecon({ ...leconSonsOuOnAn(), exercices: "bulles" }), LeconMalFormee);
});
