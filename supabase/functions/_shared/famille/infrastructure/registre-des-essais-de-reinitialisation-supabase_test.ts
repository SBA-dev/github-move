import { assert, assertEquals, assertRejects } from "@std/assert";
import {
  EssaisDeReinitialisationModifiesEnMemeTemps,
  RegistreDesEssaisIndisponible,
} from "../application/ports/registre-des-essais-de-reinitialisation.ts";
import { AdresseEmail } from "../domain/adresse-email.ts";
import { EssaisDeReinitialisation } from "../domain/essais-de-reinitialisation.ts";
import { fauxClientSupabase } from "../test_utils/faux-client-supabase.ts";
import {
  colonnesDesEssais,
  essaisDepuisLaLigne,
  type LigneDEssais,
  RegistreDesEssaisDeReinitialisationSupabase,
} from "./registre-des-essais-de-reinitialisation-supabase.ts";

const maintenant = new Date("2026-10-24T10:00:00.000Z");
const adresse = AdresseEmail.de("Parent@Exemple.fr");

const ligne: LigneDEssais = {
  adresse: "parent@exemple.fr",
  essais_rates: 5,
  dernier_rate_le: "2026-10-24T09:55:00.000Z",
  bloque_jusqua: "2026-10-24T10:55:00.000Z",
  version: 3,
};

function essaisRates(fois: number): EssaisDeReinitialisation {
  const essais = EssaisDeReinitialisation.nouveaux(adresse);
  for (let i = 0; i < fois; i++) essais.enregistrerUnEssaiRate(maintenant);
  return essais;
}

Deno.test("la ligne des essais devient des essais avec leur compteur, leur dernier raté et leur blocage", () => {
  const essais = essaisDepuisLaLigne(ligne);

  assertEquals(essais.essaisRates, 5);
  assertEquals(essais.dernierRateLe, new Date("2026-10-24T09:55:00.000Z"));
  assertEquals(essais.bloqueJusquA, new Date("2026-10-24T10:55:00.000Z"));
});

Deno.test("une ligne sans dernier raté ni blocage donne des essais sans dates", () => {
  const essais = essaisDepuisLaLigne({ ...ligne, essais_rates: 0, dernier_rate_le: null, bloque_jusqua: null });

  assertEquals(essais.dernierRateLe, null);
  assertEquals(essais.bloqueJusquA, null);
});

Deno.test("les colonnes écrites reprennent l'adresse en minuscules, le compteur et les dates", () => {
  assertEquals(colonnesDesEssais(essaisRates(5)), {
    adresse: "parent@exemple.fr",
    essais_rates: 5,
    dernier_rate_le: "2026-10-24T10:00:00.000Z",
    bloque_jusqua: "2026-10-24T11:00:00.000Z",
  });
});

Deno.test("l'adresse inconnue du registre donne des essais neufs", async () => {
  const { client } = fauxClientSupabase([{ data: null }]);

  const essais = await new RegistreDesEssaisDeReinitialisationSupabase(client).pourAdresse(adresse);

  assertEquals(essais.essaisRates, 0);
});

Deno.test("la lecture cherche la ligne par l'adresse en minuscules", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: ligne }]);

  await new RegistreDesEssaisDeReinitialisationSupabase(client).pourAdresse(adresse);

  assertEquals(requetes[0].cible, "from:essais_de_reinitialisation");
  assert(
    requetes[0].appels.some((a) => a.methode === "eq" && a.args[0] === "adresse" && a.args[1] === "parent@exemple.fr"),
  );
});

Deno.test("des essais lus sont mis à jour à la version lue plus un", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: ligne }, { data: [{ adresse: "parent@exemple.fr" }] }]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await registre.enregistrer(essais, maintenant);

  const miseAJour = requetes[1];
  assertEquals(miseAJour.appels[0].methode, "update");
  assertEquals((miseAJour.appels[0].args[0] as { version: number }).version, 4);
  assert(miseAJour.appels.some((a) => a.methode === "eq" && a.args[0] === "version" && a.args[1] === 3));
});

Deno.test("une mise à jour qui ne touche aucune ligne signale une modification en même temps", async () => {
  const { client } = fauxClientSupabase([{ data: ligne }, { data: [] }]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await assertRejects(() => registre.enregistrer(essais, maintenant), EssaisDeReinitialisationModifiesEnMemeTemps);
});

Deno.test("des essais jamais lus sont insérés", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: null }, {}]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await registre.enregistrer(essais, maintenant);

  assertEquals(requetes[1].appels[0].methode, "insert");
});

Deno.test("un doublon à l'insertion signale une modification en même temps", async () => {
  const { client } = fauxClientSupabase([{ data: null }, { error: { code: "23505" } }]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await assertRejects(() => registre.enregistrer(essais, maintenant), EssaisDeReinitialisationModifiesEnMemeTemps);
});

Deno.test("une autre erreur à l'insertion rend le registre indisponible, sans être prise pour un doublon", async () => {
  const { client } = fauxClientSupabase([{ data: null }, { error: { code: "XX000" } }]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await assertRejects(() => registre.enregistrer(essais, maintenant), RegistreDesEssaisIndisponible);
});

Deno.test("une erreur à la mise à jour rend le registre indisponible", async () => {
  const { client } = fauxClientSupabase([{ data: ligne }, { error: { code: "XX000" } }]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await assertRejects(() => registre.enregistrer(essais, maintenant), RegistreDesEssaisIndisponible);
});

Deno.test("une erreur à l'effacement rend le registre indisponible", async () => {
  const { client } = fauxClientSupabase([{ data: ligne }, { error: { code: "XX000" } }]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUneReussite();

  await assertRejects(() => registre.enregistrer(essais, maintenant), RegistreDesEssaisIndisponible);
});

Deno.test("une erreur à l'effacement des essais oubliés rend le registre indisponible", async () => {
  const { client } = fauxClientSupabase([{ data: null }, {}, { error: { code: "XX000" } }]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await assertRejects(() => registre.enregistrer(essais, maintenant), RegistreDesEssaisIndisponible);
});

Deno.test("des essais oubliés sont effacés au lieu d'être écrits", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: ligne }, {}]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUneReussite();

  await registre.enregistrer(essais, maintenant);

  assertEquals(requetes[1].appels[0].methode, "delete");
  assert(requetes.every((r) => r.appels.every((a) => a.methode !== "update" && a.methode !== "insert")));
});

Deno.test("chaque enregistrement efface aussi les essais oubliés des autres adresses", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: null }, {}, {}]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await registre.enregistrer(essais, maintenant);

  assertEquals(requetes.at(-1)?.cible, "rpc:effacer_les_essais_de_reinitialisation_oublies");
});

Deno.test("des essais relus sans ligne après une première lecture sont insérés, pas mis à jour", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: ligne }, { data: null }, {}]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  await registre.pourAdresse(adresse);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);

  await registre.enregistrer(essais, maintenant);

  assertEquals(requetes[2].appels[0].methode, "insert");
});

Deno.test("après un enregistrement réussi, un nouvel enregistrement de la même instance part de la version écrite", async () => {
  const { client, requetes } = fauxClientSupabase([
    { data: ligne },
    { data: [{ adresse: "parent@exemple.fr" }] },
    {},
    { data: [{ adresse: "parent@exemple.fr" }] },
  ]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUnEssaiRate(maintenant);
  await registre.enregistrer(essais, maintenant);

  await registre.enregistrer(essais, maintenant);

  const secondeMiseAJour = requetes[3];
  assertEquals((secondeMiseAJour.appels[0].args[0] as { version: number }).version, 5);
  assert(secondeMiseAJour.appels.some((a) => a.methode === "eq" && a.args[0] === "version" && a.args[1] === 4));
});

Deno.test("après un effacement, l'enregistrement suivant de la même instance insère", async () => {
  const { client, requetes } = fauxClientSupabase([{ data: ligne }, {}, {}, {}, {}]);
  const registre = new RegistreDesEssaisDeReinitialisationSupabase(client);
  const essais = await registre.pourAdresse(adresse);
  essais.enregistrerUneReussite();
  await registre.enregistrer(essais, maintenant);
  const nouveaux = EssaisDeReinitialisation.nouveaux(adresse);
  nouveaux.enregistrerUnEssaiRate(maintenant);

  await registre.enregistrer(nouveaux, maintenant);

  assertEquals(requetes[3].appels[0].methode, "insert");
});
