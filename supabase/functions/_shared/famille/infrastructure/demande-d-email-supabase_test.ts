import { assertEquals, assertThrows } from "@std/assert";
import {
  type ChargeDuHookSendEmail,
  traduireLaDemandeDEmailSupabase,
  TypeDActionNonPrisEnCharge,
} from "./demande-d-email-supabase.ts";

const urlDuServiceAuth = "https://xyz.supabase.co/auth/v1";

const charge = (typeDAction: string): ChargeDuHookSendEmail => ({
  user: { email: "paul@exemple.test" },
  email_data: {
    token: "482913",
    token_hash: "hash-abc",
    redirect_to: "https://savanturier.test/connexion?retour=parent",
    email_action_type: typeDAction,
    site_url: "https://savanturier.test",
  },
});

Deno.test("la demande de Supabase devient une adresse, un code et un lien de connexion", () => {
  const demande = traduireLaDemandeDEmailSupabase(charge("magiclink"), urlDuServiceAuth);

  assertEquals(demande, {
    adresse: "paul@exemple.test",
    code: "482913",
    lien: "https://xyz.supabase.co/auth/v1/verify?token=hash-abc&type=magiclink" +
      "&redirect_to=https%3A%2F%2Fsavanturier.test%2Fconnexion%3Fretour%3Dparent",
  });
});

Deno.test("une adresse jamais vue (inscription) est acceptée comme une adresse connue", () => {
  const demande = traduireLaDemandeDEmailSupabase(charge("signup"), urlDuServiceAuth);

  assertEquals(demande.lien.includes("type=signup"), true);
});

Deno.test("un type d'action qui ne sert pas à la connexion est refusé", () => {
  assertThrows(
    () => traduireLaDemandeDEmailSupabase(charge("recovery"), urlDuServiceAuth),
    TypeDActionNonPrisEnCharge,
  );
});
