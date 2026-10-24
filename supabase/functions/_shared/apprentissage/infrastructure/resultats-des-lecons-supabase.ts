import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeconsDuCatalogue } from "../application/ports/lecons-du-catalogue.ts";
import type { ResultatsDesLecons } from "../application/ports/resultats-des-lecons.ts";
import { LeconIntrouvable } from "../domain/erreurs.ts";
import type { NombreDEtoiles } from "../domain/etoiles.ts";
import { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";

const COLONNES = "profil, lecon, meilleures_etoiles, dernieres_etoiles, nombre_de_seances";

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

export function resultatDepuisLaLigne(ligne: LigneDeResultat, competence: string | undefined): ResultatDeLaLecon {
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
  constructor(private readonly client: () => SupabaseClient, private readonly lecons: LeconsDuCatalogue) {}

  async de(enfant: string, lecon: string): Promise<ResultatDeLaLecon | null> {
    const { data, error } = await this.client().from("resultats_des_lecons").select(COLONNES)
      .eq("profil", enfant).eq("lecon", lecon).maybeSingle<LigneDeResultat>();
    if (error) throw new Error(`Lecture du résultat de la leçon impossible : ${error.message}`);
    if (data === null) return null;
    const catalogue = await this.lecons.parId(lecon);
    if (!catalogue) throw new LeconIntrouvable(lecon);
    return resultatDepuisLaLigne(data, catalogue.competence);
  }
}
