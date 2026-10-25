import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { ProfilEnfantId } from "../../famille/domain/index.ts";
import type { EntreesDuSuivi, SeanceLue } from "./entrees-du-suivi.ts";
import { chiffresDuSuivi } from "./chiffres-du-suivi.ts";
import { carteDesCompetences } from "./carte-des-competences.ts";
import { leconsJouees } from "./lecons-jouees.ts";
import { suiviDeLEnfant } from "./suivi-de-l-enfant.ts";

function lecon(id: string, niveau: string, titre: string): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
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

const sons = lecon("fr-ce1-sons", "CE1", "Les sons");
const contraires = lecon("fr-ce1-contraires", "CE1", "Les mots contraires");
const inconnue = lecon("fr-ce1-inconnue", "CE1", "Leçon retirée");

function entrees(surcharge: Partial<EntreesDuSuivi> = {}): EntreesDuSuivi {
  return {
    enfant: { id: ProfilEnfantId.de("profil-lea"), prenom: "Léa", niveau: Niveau.de("CE1") },
    lecons: [sons, contraires],
    sections: [],
    meilleuresEtoiles: [{ lecon: sons.id, etoiles: 2 }],
    leconsReussiesAuTestDeDepart: [contraires.id],
    seances: [seance(sons.id, "2026-10-18T10:00:00Z", 1, 2)],
    nombreDeSeancesDeRevision: 1,
    erreursCorrigeesPourDeBon: 3,
    ...surcharge,
  };
}

Deno.test("le suivi porte l'enfant suivi et rend les mêmes chiffres, carte et leçons jouées que les trois calculs", () => {
  const donnees = entrees();

  const suivi = suiviDeLEnfant(donnees);

  assertEquals(suivi, {
    enfant: donnees.enfant,
    chiffres: chiffresDuSuivi(donnees),
    carte: carteDesCompetences(donnees),
    leconsJouees: leconsJouees(donnees),
  });
});

Deno.test("deux calculs sur les mêmes entrées donnent le même suivi, sans modifier les entrées", () => {
  const donnees = entrees();
  const copie = entrees();

  const premier = suiviDeLEnfant(donnees);
  const second = suiviDeLEnfant(donnees);

  assertEquals(second, premier);
  assertEquals(donnees, copie);
});

Deno.test("une leçon inconnue du Catalogue et ses séances n'apparaissent dans aucune partie du suivi", () => {
  const avecInconnue = entrees({
    meilleuresEtoiles: [{ lecon: sons.id, etoiles: 2 }, { lecon: inconnue.id, etoiles: 3 }],
    leconsReussiesAuTestDeDepart: [contraires.id, inconnue.id],
    seances: [
      seance(sons.id, "2026-10-18T10:00:00Z", 1, 2),
      seance(inconnue.id, "2026-10-20T10:00:00Z", 0, 3),
    ],
  });

  assertEquals(suiviDeLEnfant(avecInconnue), suiviDeLEnfant(entrees()));
});
