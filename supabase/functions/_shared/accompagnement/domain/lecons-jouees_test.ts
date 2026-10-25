import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { ProfilEnfantId } from "../../famille/domain/index.ts";
import type { EntreesDuSuivi, SeanceLue } from "./entrees-du-suivi.ts";
import { leconsJouees } from "./lecons-jouees.ts";

function lecon(id: string, niveau: string, titre: string, matiere = "francais"): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau,
    titre,
    ordre: 1,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

function seance(leconId: string, termineeLe: string, erreurs = 0, etoiles?: 1 | 2 | 3): SeanceLue {
  return { lecon: leconId, termineeLe: new Date(termineeLe), erreurs, etoiles };
}

const contraires = lecon("fr-ce1-contraires", "CE1", "Les mots contraires");
const nombres = lecon("ma-ce1-nombres", "CE1", "Les nombres jusqu'à 1000", "maths");
const sons = lecon("fr-ce1-sons", "CE1", "Les sons");
const sonsDuCP = lecon("fr-cp-sons", "CP", "Les sons du CP");
const lettresDuCP = lecon("fr-cp-lettres", "CP", "Les lettres du CP");
const accordsDuCE2 = lecon("fr-ce2-accords", "CE2", "Les accords");
const inconnue = lecon("fr-ce1-inconnue", "CE1", "Leçon retirée");

function entrees(surcharge: Partial<EntreesDuSuivi> = {}): EntreesDuSuivi {
  return {
    enfant: { id: ProfilEnfantId.de("profil-lea"), prenom: "Léa", niveau: Niveau.de("CE1") },
    lecons: [contraires, nombres, sons, sonsDuCP, lettresDuCP, accordsDuCE2],
    sections: [],
    meilleuresEtoiles: [],
    leconsReussiesAuTestDeDepart: [],
    seances: [],
    nombreDeSeancesDeRevision: 0,
    erreursCorrigeesPourDeBon: 0,
    ...surcharge,
  };
}

Deno.test("une leçon jouée apparaît une fois avec ses meilleures étoiles, et les erreurs et la date de sa séance la plus récente", () => {
  const tableau = leconsJouees(entrees({
    meilleuresEtoiles: [{ lecon: sons.id, etoiles: 3 }],
    seances: [
      seance(sons.id, "2026-10-10T10:00:00Z", 0, 3),
      seance(sons.id, "2026-10-18T10:00:00Z", 5, 1),
    ],
  }));

  assertEquals(tableau.deLaClasseEnCours, [{
    lecon: sons.id,
    titre: "Les sons",
    matiere: "francais",
    etoiles: { genre: "etoiles", nombre: 3 },
    erreursDeLaDerniereSeance: 5,
    derniereSeance: new Date("2026-10-18T10:00:00Z"),
  }]);
});

Deno.test("les leçons jouées sont triées par dernière séance la plus récente, puis par titre", () => {
  const tableau = leconsJouees(entrees({
    meilleuresEtoiles: [
      { lecon: sons.id, etoiles: 1 },
      { lecon: nombres.id, etoiles: 1 },
      { lecon: contraires.id, etoiles: 1 },
    ],
    seances: [
      seance(nombres.id, "2026-10-20T09:00:00Z", 0, 1),
      seance(contraires.id, "2026-10-20T15:00:00Z", 0, 1),
      seance(sons.id, "2026-10-22T10:00:00Z", 0, 1),
    ],
  }));

  assertEquals(tableau.deLaClasseEnCours.map((jouee) => jouee.titre), [
    "Les sons",
    "Les mots contraires",
    "Les nombres jusqu'à 1000",
  ]);
});

Deno.test("deux leçons jouées le même jour sont triées par ordre alphabétique du titre", () => {
  const tableau = leconsJouees(entrees({
    meilleuresEtoiles: [{ lecon: nombres.id, etoiles: 1 }, { lecon: contraires.id, etoiles: 1 }],
    seances: [
      seance(nombres.id, "2026-10-20T10:00:00Z", 0, 1),
      seance(contraires.id, "2026-10-20T10:00:00Z", 0, 1),
    ],
  }));

  assertEquals(tableau.deLaClasseEnCours.map((jouee) => jouee.titre), [
    "Les mots contraires",
    "Les nombres jusqu'à 1000",
  ]);
});

Deno.test("une leçon réussie seulement au test de départ s'affiche réussie au test de départ, sans erreurs, à la date du test", () => {
  const tableau = leconsJouees(entrees({
    leconsReussiesAuTestDeDepart: [sons.id],
    testDeDepartFaitLe: new Date("2026-10-05T08:00:00Z"),
  }));

  assertEquals(tableau.deLaClasseEnCours, [{
    lecon: sons.id,
    titre: "Les sons",
    matiere: "francais",
    etoiles: { genre: "reussieAuTestDeDepart" },
    derniereSeance: new Date("2026-10-05T08:00:00Z"),
  }]);
});

Deno.test("une leçon réussie au test de départ puis jouée en séance affiche ses étoiles et la date de la séance", () => {
  const tableau = leconsJouees(entrees({
    leconsReussiesAuTestDeDepart: [sons.id],
    testDeDepartFaitLe: new Date("2026-10-05T08:00:00Z"),
    meilleuresEtoiles: [{ lecon: sons.id, etoiles: 1 }],
    seances: [seance(sons.id, "2026-10-12T10:00:00Z", 2, 1)],
  }));

  assertEquals(tableau.deLaClasseEnCours, [{
    lecon: sons.id,
    titre: "Les sons",
    matiere: "francais",
    etoiles: { genre: "etoiles", nombre: 1 },
    erreursDeLaDerniereSeance: 2,
    derniereSeance: new Date("2026-10-12T10:00:00Z"),
  }]);
});

Deno.test("une leçon jouée seulement en fluence seule n'a aucune étoile et garde ses erreurs", () => {
  const tableau = leconsJouees(entrees({
    seances: [seance(sons.id, "2026-10-12T10:00:00Z", 4)],
  }));

  assertEquals(tableau.deLaClasseEnCours, [{
    lecon: sons.id,
    titre: "Les sons",
    matiere: "francais",
    etoiles: { genre: "aucune" },
    erreursDeLaDerniereSeance: 4,
    derniereSeance: new Date("2026-10-12T10:00:00Z"),
  }]);
});

Deno.test("les leçons d'une autre classe sont à part, avec la mention classe précédente ou classe au-dessus, et la classe en cours sans mention", () => {
  const tableau = leconsJouees(entrees({
    enfant: { id: ProfilEnfantId.de("profil-lea"), prenom: "Léa", niveau: Niveau.de("CE2") },
    lecons: [sonsDuCP, lettresDuCP, accordsDuCE2, sons, contraires],
    meilleuresEtoiles: [
      { lecon: sonsDuCP.id, etoiles: 2 },
      { lecon: lettresDuCP.id, etoiles: 2 },
      { lecon: accordsDuCE2.id, etoiles: 2 },
      { lecon: sons.id, etoiles: 2 },
    ],
    seances: [
      seance(sonsDuCP.id, "2026-10-10T10:00:00Z", 0, 2),
      seance(lettresDuCP.id, "2026-10-14T10:00:00Z", 0, 2),
      seance(accordsDuCE2.id, "2026-10-15T10:00:00Z", 0, 2),
      seance(sons.id, "2026-10-16T10:00:00Z", 0, 2),
    ],
  }));

  assertEquals(
    tableau.deLaClasseEnCours.map((jouee) => [jouee.titre, jouee.mention]),
    [["Les accords", undefined]],
  );
  assertEquals(
    tableau.dAutresClasses.map((jouee) => [jouee.titre, jouee.mention]),
    [
      ["Les sons", "classePrecedente"],
      ["Les lettres du CP", "classePrecedente"],
      ["Les sons du CP", "classePrecedente"],
    ],
  );
});

Deno.test("une leçon d'un niveau supérieur à la classe en cours porte la mention classe au-dessus", () => {
  const tableau = leconsJouees(entrees({
    meilleuresEtoiles: [{ lecon: accordsDuCE2.id, etoiles: 3 }],
    seances: [seance(accordsDuCE2.id, "2026-10-15T10:00:00Z", 0, 3)],
  }));

  assertEquals(tableau.deLaClasseEnCours, []);
  assertEquals(tableau.dAutresClasses.map((jouee) => [jouee.titre, jouee.mention]), [
    ["Les accords", "classeAuDessus"],
  ]);
});

Deno.test("une leçon inconnue du Catalogue et ses séances n'apparaissent nulle part", () => {
  const tableau = leconsJouees(entrees({
    meilleuresEtoiles: [{ lecon: inconnue.id, etoiles: 3 }],
    leconsReussiesAuTestDeDepart: [inconnue.id],
    testDeDepartFaitLe: new Date("2026-10-05T08:00:00Z"),
    seances: [seance(inconnue.id, "2026-10-15T10:00:00Z", 0, 3)],
  }));

  assertEquals(tableau, { deLaClasseEnCours: [], dAutresClasses: [] });
});

Deno.test("quand rien n'est joué, les deux listes sont vides, même avec des leçons au Catalogue", () => {
  const tableau = leconsJouees(entrees());

  assertEquals(tableau, { deLaClasseEnCours: [], dAutresClasses: [] });
});
