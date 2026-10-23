import { createClient } from "@supabase/supabase-js";
import { Webhook } from "standardwebhooks";
import { EnvoyerEmailDeConnexion } from "../_shared/famille/application/envoyer-email-de-connexion.ts";
import type { ExpediteurDEmails } from "../_shared/famille/application/ports/expediteur-d-emails.ts";
import {
  AdresseEmailInvalide,
  CodeDeConnexionMalForme,
  LienDeConnexionMalForme,
} from "../_shared/famille/domain/erreurs.ts";
import {
  AdresseRefuseeParLaBoiteDeTest,
  ExpediteurBoiteDeTest,
} from "../_shared/famille/infrastructure/boite-de-test.ts";
import { ChargeDuHookIncomplete, lireLaChargeDuHook } from "../_shared/famille/infrastructure/charge-du-hook.ts";
import {
  traduireLaDemandeDEmailSupabase,
  TypeDActionNonPrisEnCharge,
} from "../_shared/famille/infrastructure/demande-d-email-supabase.ts";
import { StockageBoiteDeTestSupabase } from "../_shared/famille/infrastructure/stockage-boite-de-test-supabase.ts";

class ModeDEmailNonPrisEnCharge extends Error {}
class SignatureDuHookInvalide extends Error {}

const PREFIXE_DU_SECRET = "v1,whsec_";

function repondre(statut: number, corps: unknown): Response {
  return new Response(JSON.stringify(corps), { status: statut, headers: { "Content-Type": "application/json" } });
}

function erreur(statut: number, message: string): Response {
  return repondre(statut, { error: { http_code: statut, message } });
}

function lireLeCorpsSigne(corps: string, entetes: Headers): unknown {
  const secret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "";
  try {
    return new Webhook(secret.replace(PREFIXE_DU_SECRET, "")).verify(corps, Object.fromEntries(entetes));
  } catch {
    throw new SignatureDuHookInvalide();
  }
}

function choisirLExpediteur(): ExpediteurDEmails {
  if (Deno.env.get("MODE_EMAIL") !== "boite-de-test") throw new ModeDEmailNonPrisEnCharge();
  // Exception documentée (journal #5) : Supabase Auth appelle ce hook sans JWT de parent.
  // La clé service_role reste ici, côté serveur, pour ranger l'e-mail dans la boîte de test.
  const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  return new ExpediteurBoiteDeTest(new StockageBoiteDeTestSupabase(client));
}

async function traiter(requete: Request): Promise<Response> {
  const charge = lireLaChargeDuHook(lireLeCorpsSigne(await requete.text(), requete.headers));
  const demande = traduireLaDemandeDEmailSupabase(charge, `${Deno.env.get("SUPABASE_URL")}/auth/v1`);
  await new EnvoyerEmailDeConnexion(choisirLExpediteur()).executer(demande.adresse, demande.lien, demande.code);
  return repondre(200, {});
}

function reponseALErreur(cause: unknown): Response {
  if (cause instanceof SignatureDuHookInvalide) return erreur(401, "Signature du hook invalide.");
  if (cause instanceof AdresseRefuseeParLaBoiteDeTest) return erreur(403, cause.message);
  if (cause instanceof ModeDEmailNonPrisEnCharge) return erreur(501, "Aucun fournisseur d'e-mail n'est configuré.");
  if (
    cause instanceof ChargeDuHookIncomplete || cause instanceof TypeDActionNonPrisEnCharge ||
    cause instanceof AdresseEmailInvalide || cause instanceof CodeDeConnexionMalForme ||
    cause instanceof LienDeConnexionMalForme
  ) return erreur(400, cause.message);
  return erreur(500, "L'e-mail de connexion n'a pas pu être envoyé.");
}

Deno.serve(async (requete) => {
  if (requete.method !== "POST") return erreur(405, "Méthode non autorisée.");
  try {
    return await traiter(requete);
  } catch (cause) {
    return reponseALErreur(cause);
  }
});
