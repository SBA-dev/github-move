import type { SupabaseClient } from "@supabase/supabase-js";
import type { RattachementsDuParent } from "../application/ports/rattachements-du-parent.ts";

/** Lit les rattachements sous RLS : un parent ne voit que les siens. */
export class RattachementsDuParentSupabase implements RattachementsDuParent {
  constructor(private readonly client: SupabaseClient) {}

  async estRattache(parent: string, profil: string): Promise<boolean> {
    const { data, error } = await this.client.from("rattachements").select("profil")
      .eq("profil", profil).eq("parent", parent).maybeSingle();
    if (error) throw new Error(`Lecture du rattachement impossible : ${error.message}`);
    return data !== null;
  }
}
