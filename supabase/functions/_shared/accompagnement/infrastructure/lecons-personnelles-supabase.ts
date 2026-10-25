import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeconsPersonnelles } from "../application/ports/lecons-personnelles.ts";
import { leconEnBrut } from "../domain/lecon-en-brut.ts";
import { LeconPersonnelle } from "../domain/lecon-personnelle.ts";

const TABLE = "lecons_personnelles";

type LigneDeLeconPersonnelle = {
  id: string;
  profil: string;
  texte_du_parent: string;
  lecon: unknown;
  cree_le: string;
};

/** Écrit et lit les leçons personnelles sous RLS : un parent ne voit que celles de ses enfants. */
export class LeconsPersonnellesSupabase implements LeconsPersonnelles {
  constructor(private readonly client: SupabaseClient) {}

  async enregistrer(leconPersonnelle: LeconPersonnelle): Promise<void> {
    const { lecon } = leconPersonnelle;
    const { error } = await this.client.from(TABLE).insert({
      id: lecon.id,
      profil: leconPersonnelle.profil,
      texte_du_parent: leconPersonnelle.texte.valeur,
      lecon: leconEnBrut(lecon, lecon.id),
    });
    if (error) throw new Error(`Enregistrement de la leçon personnelle impossible : ${error.code ?? "inconnu"}`);
  }

  async parId(id: string): Promise<LeconPersonnelle | undefined> {
    const { data, error } = await this.client.from(TABLE)
      .select("id, profil, texte_du_parent, lecon, cree_le").eq("id", id).maybeSingle();
    if (error) throw new Error(`Lecture de la leçon personnelle impossible : ${error.code ?? "inconnu"}`);
    return data ? versLeconPersonnelle(data as LigneDeLeconPersonnelle) : undefined;
  }

  async supprimer(id: string): Promise<void> {
    const { error } = await this.client.from(TABLE).delete().eq("id", id);
    if (error) throw new Error(`Suppression de la leçon personnelle impossible : ${error.code ?? "inconnu"}`);
  }
}

function versLeconPersonnelle(ligne: LigneDeLeconPersonnelle): LeconPersonnelle {
  return LeconPersonnelle.reconstituer({
    lecon: ligne.lecon,
    profil: ligne.profil,
    texte: ligne.texte_du_parent,
    creeeLe: new Date(ligne.cree_le),
  });
}
