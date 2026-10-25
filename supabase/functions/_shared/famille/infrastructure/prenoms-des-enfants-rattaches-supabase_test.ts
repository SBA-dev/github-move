import { assert, assertEquals, assertRejects } from "@std/assert";
import { ParentId } from "../domain/parent-id.ts";
import { fauxClientSupabase } from "../test_utils/faux-client-supabase.ts";
import { PrenomsDesEnfantsRattachesSupabase } from "./prenoms-des-enfants-rattaches-supabase.ts";

Deno.test("les prénoms des enfants rattachés au parent sont lus, filtrés par ce parent", async () => {
  const { client, requetes } = fauxClientSupabase([
    { data: [{ profils_enfants: { prenom: "Léa" } }, { profils_enfants: { prenom: "Tom" } }] },
  ]);

  const prenoms = await new PrenomsDesEnfantsRattachesSupabase(client).duParent(ParentId.de("parent-1"));

  assertEquals(prenoms.map((p) => p.valeur), ["Léa", "Tom"]);
  assertEquals(requetes[0].cible, "from:rattachements");
  assert(requetes[0].appels.some((a) => a.methode === "eq" && a.args[0] === "parent" && a.args[1] === "parent-1"));
});

Deno.test("un rattachement sans profil visible est ignoré", async () => {
  const { client } = fauxClientSupabase([{
    data: [{ profils_enfants: null }, { profils_enfants: { prenom: "Léa" } }],
  }]);

  const prenoms = await new PrenomsDesEnfantsRattachesSupabase(client).duParent(ParentId.de("parent-1"));

  assertEquals(prenoms.map((p) => p.valeur), ["Léa"]);
});

Deno.test("une lecture en erreur des prénoms est signalée", async () => {
  const { client } = fauxClientSupabase([{ error: { code: "XX000" } }]);

  await assertRejects(() => new PrenomsDesEnfantsRattachesSupabase(client).duParent(ParentId.de("parent-1")));
});
