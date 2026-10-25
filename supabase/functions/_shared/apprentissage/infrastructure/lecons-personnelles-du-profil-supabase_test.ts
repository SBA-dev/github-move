import { assert, assertEquals, assertRejects } from "@std/assert";
import { fauxClientSupabase } from "../../famille/test_utils/faux-client-supabase.ts";
import { LeconsPersonnellesDuProfilSupabase } from "./lecons-personnelles-du-profil-supabase.ts";

const lecon = {
  id: "perso-abc123",
  matiere: "francais",
  niveau: "CE1",
  titre: "Mes mots",
  ordre: 1,
  programme: { section: "francais-ce1", citation: "Orthographier des mots" },
  lecon: [],
  exercices: [],
};

Deno.test("parId relit la leçon personnelle du profil, filtrée sur l'identifiant et le profil", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: { lecon } }]);

  const relue = await new LeconsPersonnellesDuProfilSupabase(client).parId("perso-abc123", "profil-de-lina");

  assertEquals(relue?.id, "perso-abc123");
  assertEquals(requetes[0].cible, "from:lecons_personnelles");
  assert(requetes[0].appels.some((a) => a.methode === "eq" && a.args[0] === "id" && a.args[1] === "perso-abc123"));
  assert(
    requetes[0].appels.some((a) => a.methode === "eq" && a.args[0] === "profil" && a.args[1] === "profil-de-lina"),
  );
});

Deno.test("parId d'une leçon invisible, absente ou illisible ne rend rien", async () => {
  for (const reponse of [{ data: null }, { data: { lecon: { id: "perso-abc123" } } }]) {
    const { client } = fauxClientSupabase([reponse]);

    assertEquals(await new LeconsPersonnellesDuProfilSupabase(client).parId("perso-abc123", "profil-de-lina"), null);
  }
});

Deno.test("une lecture en erreur est signalée", async () => {
  const { client } = fauxClientSupabase([{ error: { code: "XX000" } }]);

  await assertRejects(() => new LeconsPersonnellesDuProfilSupabase(client).parId("perso-abc123", "profil-de-lina"));
});

Deno.test("toutes relit les leçons personnelles du profil et ignore les illisibles", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: [{ lecon }, { lecon: { id: "perso-x" } }] }]);

  const relues = await new LeconsPersonnellesDuProfilSupabase(client).toutes("profil-de-lina");

  assertEquals(relues.map((l) => l.id), ["perso-abc123"]);
  assertEquals(requetes[0].cible, "from:lecons_personnelles");
  assert(
    requetes[0].appels.some((a) => a.methode === "eq" && a.args[0] === "profil" && a.args[1] === "profil-de-lina"),
  );
});
