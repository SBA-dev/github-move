import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeconsDuCatalogue } from "../application/ports/lecons-du-catalogue.ts";
import type { ResultatsDesLecons } from "../application/ports/resultats-des-lecons.ts";
import { LeconIntrouvable } from "../domain/erreurs.ts";
import type { NombreDEtoiles } from "../domain/etoiles.ts";
import { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";

const COLONNES = "profil, lecon, meilleures_etoiles, dernieres_etoiles, nombre_de_seances";
const CODE_POSTGRES_CLE_DEJA_PRESENTE = "23505";
const ESSAIS_AU_PLUS = 3;

export type LigneDeResultat = {
  profil: string;
  lecon: string;
  meilleures_etoiles: number | null;
  dernieres_etoiles: number | null;
  nombre_de_seances: number;
};

export function ligneDuResultat(resultat: ResultatDeLaLecon): LigneDeResultat {
  return {
    profil: resultat.enfant,
    lecon: resultat.lecon,
    meilleures_etoiles: resultat.meilleures ?? null,
    dernieres_etoiles: resultat.dernieres ?? null,
    nombre_de_seances: resultat.nombreDeSeances,
  };
}

function etoilesDeLaLigne(valeur: number | null): NombreDEtoiles | undefined {
  if (valeur === null) return undefined;
  if (valeur === 1 || valeur === 2 || valeur === 3) return valeur;
  throw new Error(`Nombre d'étoiles inconnu en base : ${valeur}`);
}

export function resultatDepuisLaLigne(ligne: LigneDeResultat, competence: string): ResultatDeLaLecon {
  return ResultatDeLaLecon.reconstituer({
    enfant: ligne.profil,
    lecon: ligne.lecon,
    competence,
    meilleures: etoilesDeLaLigne(ligne.meilleures_etoiles),
    dernieres: etoilesDeLaLigne(ligne.dernieres_etoiles),
    nombreDeSeances: ligne.nombre_de_seances,
  });
}

export class ResultatsDesLeconsSupabase implements ResultatsDesLecons {
  constructor(private readonly client: SupabaseClient, private readonly lecons: LeconsDuCatalogue) {}

  async de(enfant: string, lecon: string): Promise<ResultatDeLaLecon | null> {
    const { data, error } = await this.client.from("resultats_des_lecons").select(COLONNES)
      .eq("profil", enfant).eq("lecon", lecon).maybeSingle<LigneDeResultat>();
    if (error) throw new Error(`Lecture du résultat de la leçon impossible : ${error.message}`);
    if (data === null) return null;
    const catalogue = await this.lecons.parId(lecon);
    if (!catalogue) throw new LeconIntrouvable(lecon);
    return resultatDepuisLaLigne(data, catalogue.competence ?? catalogue.titre);
  }

  // Écriture optimiste : on n'écrit que si le nombre de séances est celui qu'on a lu. Si une autre séance de la même
  // leçon est passée entre-temps, on relit le résultat, on y ajoute la dernière séance, et on réessaie : aucune
  // séance n'est perdue et les meilleures étoiles ne baissent pas.
  async enregistrer(resultat: ResultatDeLaLecon): Promise<void> {
    let aEcrire = resultat;
    for (let essai = 1; essai <= ESSAIS_AU_PLUS; essai++) {
      if (await this.ecrireSiRienNAChange(aEcrire)) return;
      const dernieres = resultat.dernieres;
      const actuel = await this.de(resultat.enfant, resultat.lecon);
      if (actuel === null || dernieres === undefined) {
        throw new Error("Résultat de la leçon introuvable à la relecture.");
      }
      actuel.enregistrerSeance(dernieres);
      aEcrire = actuel;
    }
    throw new Error("Résultat de la leçon modifié en continu : écriture abandonnée.");
  }

  private async ecrireSiRienNAChange(resultat: ResultatDeLaLecon): Promise<boolean> {
    const ligne = ligneDuResultat(resultat);
    const nombreLu = ligne.nombre_de_seances - 1;
    if (nombreLu === 0) {
      const { error } = await this.client.from("resultats_des_lecons").insert(ligne);
      if (error?.code === CODE_POSTGRES_CLE_DEJA_PRESENTE) return false;
      if (error) throw new Error(`Enregistrement du résultat de la leçon impossible : ${error.message}`);
      return true;
    }
    const { data, error } = await this.client.from("resultats_des_lecons")
      .update({
        meilleures_etoiles: ligne.meilleures_etoiles,
        dernieres_etoiles: ligne.dernieres_etoiles,
        nombre_de_seances: ligne.nombre_de_seances,
      })
      .eq("profil", ligne.profil).eq("lecon", ligne.lecon).eq("nombre_de_seances", nombreLu).select("profil");
    if (error) throw new Error(`Enregistrement du résultat de la leçon impossible : ${error.message}`);
    return data.length === 1;
  }
}
