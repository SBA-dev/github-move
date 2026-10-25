import { assertEquals } from "@std/assert";
import { lireLecon, lireSectionDuProgramme, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon, SectionDuProgramme } from "../../catalogue/domain/index.ts";
import { ProfilEnfantId } from "../../famille/domain/index.ts";
import { carteDesCompetences } from "./carte-des-competences.ts";
import type { EntreesDuSuivi, SeanceLue } from "./entrees-du-suivi.ts";

function section(id: string, matiere: string, domaine: string, niveaux: string[]): SectionDuProgramme {
  return lireSectionDuProgramme({
    id,
    matiere,
    domaine,
    section: `Intitulé de ${id}`,
    niveaux,
    source: { texte: "Programme", bo: "BO" },
  });
}

function lecon(id: string, niveau: string, sectionId: string): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau,
    titre: `Titre de ${id}`,
    ordre: 1,
    programme: { section: sectionId, citation: "citation" },
    exercices: [],
  });
}

function seance(leconId: string, etoiles?: 1 | 2 | 3): SeanceLue {
  return { lecon: leconId, termineeLe: new Date("2026-10-20T10:00:00Z"), erreurs: 0, etoiles };
}

const calculer = section("maths-ce1-calculer", "maths", "Calcul", ["CE1"]);
const lire = section("fr-ce1-lire", "francais", "Lecture", ["CE1", "CE2"]);
const ecrire = section("fr-ce1-ecrire", "francais", "Écriture", ["CE1"]);
const lireEncore = section("fr-ce1-lire-encore", "francais", "Lecture", ["CE1"]);
const horsNiveau = section("fr-cp-decoder", "francais", "Lecture", ["CP"]);

function entrees(surcharge: Partial<EntreesDuSuivi> = {}): EntreesDuSuivi {
  return {
    enfant: { id: ProfilEnfantId.de("profil-lea"), prenom: "Léa", niveau: Niveau.de("CE1") },
    lecons: [],
    sections: [calculer, lire, ecrire, lireEncore, horsNiveau],
    meilleuresEtoiles: [],
    leconsReussiesAuTestDeDepart: [],
    seances: [],
    nombreDeSeancesDeRevision: 0,
    erreursCorrigeesPourDeBon: 0,
    ...surcharge,
  };
}

function etatDe(entreesDuSuivi: EntreesDuSuivi, sectionId: string): string | undefined {
  return carteDesCompetences(entreesDuSuivi).matieres
    .flatMap((m) => m.domaines.flatMap((d) => d.lignes))
    .find((ligne) => ligne.section === sectionId)?.etat;
}

Deno.test("la carte ne garde que les sections du niveau de l'enfant, regroupées par matière dans l'ordre des matières puis par domaine dans l'ordre de l'index", () => {
  const carte = carteDesCompetences(entrees());

  assertEquals(
    carte.matieres.map((m) => ({
      matiere: m.matiere,
      domaines: m.domaines.map((d) => ({ domaine: d.domaine, sections: d.lignes.map((l) => l.section) })),
    })),
    [
      {
        matiere: "francais",
        domaines: [
          { domaine: "Lecture", sections: ["fr-ce1-lire", "fr-ce1-lire-encore"] },
          { domaine: "Écriture", sections: ["fr-ce1-ecrire"] },
        ],
      },
      { matiere: "maths", domaines: [{ domaine: "Calcul", sections: ["maths-ce1-calculer"] }] },
    ],
  );
});

Deno.test("chaque ligne de la carte porte l'intitulé de sa section", () => {
  const carte = carteDesCompetences(entrees({ sections: [calculer] }));

  assertEquals(carte.matieres[0].domaines[0].lignes[0].intitule, "Intitulé de maths-ce1-calculer");
});

Deno.test("une section sans leçon rattachée est pas encore de leçon", () => {
  assertEquals(etatDe(entrees(), lire.id), "pasEncoreDeLecon");
});

Deno.test("une section dont une leçon est acquise est acquise, même si ses autres leçons ne sont pas jouées, et la carte liste le titre de chaque leçon rattachée", () => {
  const jouee = lecon("fr-ce1-a", "CE1", lire.id);
  const nonJouee = lecon("fr-ce1-b", "CE1", lire.id);
  const entreesDuSuivi = entrees({
    lecons: [jouee, nonJouee],
    meilleuresEtoiles: [{ lecon: jouee.id, etoiles: 2 }],
  });

  const ligne = carteDesCompetences(entreesDuSuivi).matieres[0].domaines[0].lignes[0];

  assertEquals([ligne.etat, ligne.titresDesLecons], ["acquise", ["Titre de fr-ce1-a", "Titre de fr-ce1-b"]]);
});

Deno.test("une section dont une leçon a une séance terminée, avec 1 étoile, sans étoiles ou fluence seule, sans leçon acquise, est en cours", () => {
  const reussie = lecon("fr-ce1-a", "CE1", lire.id);
  const fluenceSeule = lecon("fr-ce1-b", "CE1", ecrire.id);
  const entreesDuSuivi = entrees({
    lecons: [reussie, fluenceSeule],
    meilleuresEtoiles: [{ lecon: reussie.id, etoiles: 1 }],
    seances: [seance(reussie.id, 1), seance(fluenceSeule.id)],
  });

  assertEquals([etatDe(entreesDuSuivi, lire.id), etatDe(entreesDuSuivi, ecrire.id)], ["enCours", "enCours"]);
});

Deno.test("une section dont la seule leçon jouée est réussie au test de départ reste à faire", () => {
  const entreesDuSuivi = entrees({
    lecons: [lecon("fr-ce1-a", "CE1", lire.id)],
    leconsReussiesAuTestDeDepart: ["fr-ce1-a"],
  });

  assertEquals(etatDe(entreesDuSuivi, lire.id), "aFaire");
});

Deno.test("une section dont les leçons ne sont pas jouées est à faire", () => {
  const entreesDuSuivi = entrees({ lecons: [lecon("fr-ce1-a", "CE1", lire.id)] });

  assertEquals(etatDe(entreesDuSuivi, lire.id), "aFaire");
});

Deno.test("une section garde ses leçons rattachées de tous niveaux : une leçon de CM2 acquise rend acquise la section d'un enfant de CM1", () => {
  const sectionCM1CM2 = section("fr-cm-grammaire", "francais", "Grammaire", ["CM1", "CM2"]);
  const leconCM2 = lecon("fr-cm2-a", "CM2", sectionCM1CM2.id);
  const entreesDuSuivi = entrees({
    enfant: { id: ProfilEnfantId.de("profil-lea"), prenom: "Léa", niveau: Niveau.de("CM1") },
    sections: [sectionCM1CM2],
    lecons: [leconCM2],
    meilleuresEtoiles: [{ lecon: leconCM2.id, etoiles: 2 }],
  });

  const ligne = carteDesCompetences(entreesDuSuivi).matieres[0].domaines[0].lignes[0];

  assertEquals([ligne.etat, ligne.titresDesLecons], ["acquise", ["Titre de fr-cm2-a"]]);
});

Deno.test("la légende compte les sections de chaque état et leur total est le nombre de sections du niveau", () => {
  const acquise = lecon("fr-ce1-a", "CE1", lire.id);
  const enCours = lecon("fr-ce1-b", "CE1", ecrire.id);
  const aFaire = lecon("fr-ce1-c", "CE1", lireEncore.id);
  const entreesDuSuivi = entrees({
    lecons: [acquise, enCours, aFaire],
    meilleuresEtoiles: [{ lecon: acquise.id, etoiles: 3 }],
    seances: [seance(enCours.id)],
  });

  assertEquals(carteDesCompetences(entreesDuSuivi).legende, {
    acquise: 1,
    enCours: 1,
    aFaire: 1,
    pasEncoreDeLecon: 1,
  });
});

Deno.test("le niveau de la carte est celui du profil de l'enfant", () => {
  assertEquals(carteDesCompetences(entrees()).niveau, Niveau.de("CE1"));
});
