import type { SupabaseClient } from "@supabase/supabase-js";
import type { EmailDeConnexion } from "../domain/email-de-connexion.ts";
import type { StockageDeLaBoiteDeTest } from "./boite-de-test.ts";

const TABLE_DE_LA_BOITE_DE_TEST = "boite_de_test_emails";

export class StockageBoiteDeTestSupabase implements StockageDeLaBoiteDeTest {
  constructor(private readonly client: SupabaseClient) {}

  async ranger(email: EmailDeConnexion): Promise<void> {
    const { error } = await this.client.from(TABLE_DE_LA_BOITE_DE_TEST).insert({
      destinataire: email.destinataire.valeur,
      sujet: email.sujet,
      texte: email.texte,
    });
    if (error) throw new Error(`Rangement dans la boîte de test impossible : ${error.message}`);
  }
}
