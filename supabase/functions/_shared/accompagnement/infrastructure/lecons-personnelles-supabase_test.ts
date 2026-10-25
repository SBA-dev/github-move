import { assert, assertEquals, assertRejects } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { fauxClientSupabase } from "../../famille/test_utils/faux-client-supabase.ts";
import { leconEnBrut } from "../domain/lecon-en-brut.ts";
import { LeconPersonnelle } from "../domain/lecon-personnelle.ts";
import { preparerUneLeconPersonnelle } from "../domain/preparer-une-lecon-personnelle.ts";
import { TexteDuParent } from "../domain/texte-du-parent.ts";
import { sectionDeTest } from "../test_utils/sections-de-test.ts";
import { LeconsPersonnellesSupabase } from "./lecons-personnelles-supabase.ts";

const TEXTE = "chaton, maison, poisson, garçon";
const SECTIONS = [sectionDeTest({ id: "francais-ce1", niveaux: ["CE1"] })];
const CREEE_LE = new Date("2026-10-25T10:00:00Z");

function uneLeconPersonnelle(): LeconPersonnelle {
  return LeconPersonnelle.creer({
    id: "abc123",
    profil: "profil-de-lina",
    texte: TexteDuParent.de(TEXTE),
    preparee: preparerUneLeconPersonnelle({ texte: TEXTE, niveau: Niveau.de("CE1") }, SECTIONS),
    sections: SECTIONS,
    maintenant: CREEE_LE,
  }).leconPersonnelle;
}

Deno.test("enregistrer insère la ligne : identifiant, profil, texte du parent et leçon en brut", async () => {
  const { client, requetes } = fauxClientSupabase();
  const leconPersonnelle = uneLeconPersonnelle();

  await new LeconsPersonnellesSupabase(client).enregistrer(leconPersonnelle);

  assertEquals(requetes[0].cible, "from:lecons_personnelles");
  assertEquals(requetes[0].appels, [{
    methode: "insert",
    args: [{
      id: "perso-abc123",
      profil: "profil-de-lina",
      texte_du_parent: TEXTE,
      lecon: leconEnBrut(leconPersonnelle.lecon, "perso-abc123"),
    }],
  }]);
});

Deno.test("parId relit la ligne en leçon personnelle", async () => {
  const originale = uneLeconPersonnelle();
  const { client, requetes } = fauxClientSupabase([{
    data: {
      id: "perso-abc123",
      profil: "profil-de-lina",
      texte_du_parent: TEXTE,
      lecon: leconEnBrut(originale.lecon, "perso-abc123"),
      cree_le: CREEE_LE.toISOString(),
    },
  }]);

  const relue = await new LeconsPersonnellesSupabase(client).parId("perso-abc123");

  assertEquals(relue, originale);
  assert(requetes[0].appels.some((a) => a.methode === "eq" && a.args[0] === "id" && a.args[1] === "perso-abc123"));
});

Deno.test("parId d'une leçon invisible ou absente ne rend rien", async () => {
  const { client } = fauxClientSupabase([{ data: null }]);

  assertEquals(await new LeconsPersonnellesSupabase(client).parId("perso-absente"), undefined);
});

Deno.test("supprimer efface la ligne de cet identifiant", async () => {
  const { client, requetes } = fauxClientSupabase();

  await new LeconsPersonnellesSupabase(client).supprimer("perso-abc123");

  assertEquals(requetes[0].cible, "from:lecons_personnelles");
  assertEquals(requetes[0].appels.map((a) => [a.methode, ...a.args]), [["delete"], ["eq", "id", "perso-abc123"]]);
});

Deno.test("une écriture ou une lecture en erreur est signalée", async () => {
  const { client } = fauxClientSupabase([{ error: { code: "XX000" } }, { error: { code: "XX000" } }, {
    error: { code: "XX000" },
  }]);
  const lecons = new LeconsPersonnellesSupabase(client);

  await assertRejects(() => lecons.enregistrer(uneLeconPersonnelle()));
  await assertRejects(() => lecons.parId("perso-abc123"));
  await assertRejects(() => lecons.supprimer("perso-abc123"));
});
