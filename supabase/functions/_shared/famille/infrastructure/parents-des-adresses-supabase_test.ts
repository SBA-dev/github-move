import { assert, assertEquals, assertRejects } from "@std/assert";
import { AdresseEmail } from "../domain/adresse-email.ts";
import { fauxClientSupabase } from "../test_utils/faux-client-supabase.ts";
import { ParentsDesAdressesSupabase } from "./parents-des-adresses-supabase.ts";

const adresse = AdresseEmail.de("parent@exemple.fr");

Deno.test("l'identifiant renvoyé par la base est celui du parent de l'adresse", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: "parent-1" }]);

  const parent = await new ParentsDesAdressesSupabase(client).parentDeLAdresse(adresse);

  assertEquals(parent?.valeur, "parent-1");
  assertEquals(requetes[0].cible, "rpc:parent_de_l_adresse");
  assert(JSON.stringify(requetes[0].appels[0].args[0]) === '{"p_adresse":"parent@exemple.fr"}');
});

Deno.test("une adresse inconnue n'a pas de parent", async () => {
  const { client } = fauxClientSupabase([{ data: null }]);

  assertEquals(await new ParentsDesAdressesSupabase(client).parentDeLAdresse(adresse), undefined);
});

Deno.test("une recherche en erreur est signalée", async () => {
  const { client } = fauxClientSupabase([{ error: { code: "XX000" } }]);

  await assertRejects(() => new ParentsDesAdressesSupabase(client).parentDeLAdresse(adresse));
});
