import { AuthApiError, type SupabaseClient } from "@supabase/supabase-js";
import { assertEquals, assertRejects } from "@std/assert";
import { AdresseEmail } from "../domain/adresse-email.ts";
import { AdresseDejaUtilisee, MotDePasseTropLong } from "../domain/erreurs.ts";
import { InscriptionsDesParentsSupabase } from "./inscriptions-des-parents-supabase.ts";

type Attributs = { email: string; password: string; email_confirm: boolean };
type Resultat = { data: { user: { id: string } | null }; error: Error | null };

function clientQuiRepond(resultat: Resultat) {
  const envoyes: Attributs[] = [];
  const client = {
    auth: {
      admin: {
        createUser: (attributs: Attributs) => {
          envoyes.push(attributs);
          return Promise.resolve(resultat);
        },
      },
    },
  } as unknown as SupabaseClient;
  return { client, envoyes };
}

const adresse = AdresseEmail.de("Parent@Exemple.fr");

Deno.test("l'inscription envoie l'adresse en minuscules, déjà confirmée", async () => {
  const { client, envoyes } = clientQuiRepond({ data: { user: { id: "parent-1" } }, error: null });

  const id = await new InscriptionsDesParentsSupabase(client).inscrire(adresse, "Mot-de-passe1!");

  assertEquals(id.valeur, "parent-1");
  assertEquals(envoyes, [{ email: "parent@exemple.fr", password: "Mot-de-passe1!", email_confirm: true }]);
});

Deno.test("une adresse déjà inscrite chez Supabase Auth est une adresse déjà utilisée", async () => {
  const erreur = new AuthApiError("exists", 422, "email_exists");
  const { client } = clientQuiRepond({ data: { user: null }, error: erreur });

  await assertRejects(() => new InscriptionsDesParentsSupabase(client).inscrire(adresse, "x"), AdresseDejaUtilisee);
});

Deno.test("un mot de passe refusé par Supabase Auth est un mot de passe trop long", async () => {
  const erreur = new AuthApiError("weak", 422, "weak_password");
  const { client } = clientQuiRepond({ data: { user: null }, error: erreur });

  await assertRejects(() => new InscriptionsDesParentsSupabase(client).inscrire(adresse, "x"), MotDePasseTropLong);
});

Deno.test("une autre erreur de Supabase Auth n'est pas une adresse déjà utilisée", async () => {
  const { client } = clientQuiRepond({ data: { user: null }, error: new Error("réseau") });

  await assertRejects(
    () => new InscriptionsDesParentsSupabase(client).inscrire(adresse, "x"),
    Error,
    "Création du parent impossible.",
  );
});
