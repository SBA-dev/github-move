import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { ProfilEnfantId } from "../../famille/domain/index.ts";
import { chiffresDuSuivi } from "./chiffres-du-suivi.ts";
import type { EntreesDuSuivi, SeanceLue } from "./entrees-du-suivi.ts";

function lecon(id: string, niveau: string): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau,
    titre: `Titre de ${id}`,
    ordre: 1,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

function seance(leconId: string, etoiles?: 1 | 2 | 3): SeanceLue {
  return { lecon: leconId, termineeLe: new Date("2026-10-20T10:00:00Z"), erreurs: 0, etoiles };
}

const sons = lecon("fr-ce1-sons", "CE1");
const syllabes = lecon("fr-ce1-syllabes", "CE1");
const lettres = lecon("fr-ce1-lettres", "CE1");
const francaisDuCP = lecon("fr-cp-sons", "CP");
const francaisDuCE2 = lecon("fr-ce2-accords", "CE2");

function entrees(surcharge: Partial<EntreesDuSuivi> = {}): EntreesDuSuivi {
  return {
    enfant: { id: ProfilEnfantId.de("profil-lea"), prenom: "Léa", niveau: Niveau.de("CE1") },
    lecons: [sons, syllabes, lettres, francaisDuCP, francaisDuCE2],
    sections: [],
    meilleuresEtoiles: [],
    leconsReussiesAuTestDeDepart: [],
    seances: [],
    nombreDeSeancesDeRevision: 0,
    erreursCorrigeesPourDeBon: 0,
    ...surcharge,
  };
}

Deno.test("les leçons réussies de la classe en cours comptent chacune une fois, qu'elles aient des étoiles ou soient réussies au test de départ", () => {
  const chiffres = chiffresDuSuivi(entrees({
    meilleuresEtoiles: [{ lecon: sons.id, etoiles: 1 }, { lecon: syllabes.id, etoiles: 2 }],
    leconsReussiesAuTestDeDepart: [syllabes.id, lettres.id],
  }));

  assertEquals(chiffres.leconsReussies, 3);
});

Deno.test("une leçon d'une autre classe n'est comptée ni dans les leçons réussies ni dans les étoiles", () => {
  const chiffres = chiffresDuSuivi(entrees({
    meilleuresEtoiles: [
      { lecon: francaisDuCP.id, etoiles: 3 },
      { lecon: francaisDuCE2.id, etoiles: 2 },
    ],
    leconsReussiesAuTestDeDepart: [francaisDuCP.id],
  }));

  assertEquals([chiffres.leconsReussies, chiffres.etoiles], [0, 0]);
});

Deno.test("les étoiles sont la somme des meilleures étoiles de la classe en cours, sans rien ajouter pour une leçon réussie au test de départ seulement", () => {
  const chiffres = chiffresDuSuivi(entrees({
    meilleuresEtoiles: [{ lecon: sons.id, etoiles: 3 }, { lecon: syllabes.id, etoiles: 1 }],
    leconsReussiesAuTestDeDepart: [lettres.id],
  }));

  assertEquals(chiffres.etoiles, 4);
});

Deno.test("les séances jouées comptent les séances terminées de la classe en cours, fluence seule comprise, et toutes les séances de révision", () => {
  const chiffres = chiffresDuSuivi(entrees({
    seances: [seance(sons.id, 2), seance(sons.id, 3), seance(syllabes.id)],
    nombreDeSeancesDeRevision: 2,
  }));

  assertEquals(chiffres.seancesJouees, 5);
});

Deno.test("une séance d'une leçon inconnue du Catalogue ou d'une autre classe ne compte pas dans les séances jouées", () => {
  const chiffres = chiffresDuSuivi(entrees({
    seances: [seance("fr-ce1-retiree", 2), seance(francaisDuCP.id, 3), seance(sons.id, 1)],
  }));

  assertEquals(chiffres.seancesJouees, 1);
});

Deno.test("des meilleures étoiles d'une leçon inconnue du Catalogue ne comptent ni dans les leçons réussies ni dans les étoiles", () => {
  const chiffres = chiffresDuSuivi(entrees({
    meilleuresEtoiles: [{ lecon: "fr-ce1-retiree", etoiles: 3 }],
    leconsReussiesAuTestDeDepart: ["fr-ce1-retiree"],
  }));

  assertEquals([chiffres.leconsReussies, chiffres.etoiles], [0, 0]);
});

Deno.test("les erreurs corrigées pour de bon sont le compteur reçu, sans filtre de classe", () => {
  const chiffres = chiffresDuSuivi(entrees({ erreursCorrigeesPourDeBon: 7 }));

  assertEquals(chiffres.erreursCorrigeesPourDeBon, 7);
});

Deno.test("sans rien de joué, tous les chiffres sont à 0 sauf les séances de révision et les erreurs corrigées pour de bon", () => {
  const chiffres = chiffresDuSuivi(entrees({
    nombreDeSeancesDeRevision: 3,
    erreursCorrigeesPourDeBon: 4,
  }));

  assertEquals(chiffres, {
    leconsReussies: 0,
    etoiles: 0,
    seancesJouees: 3,
    erreursCorrigeesPourDeBon: 4,
  });
});
