import type { StockageDeLaBoiteDeTest } from "../infrastructure/boite-de-test.ts";
import type { EmailDeConnexion } from "../domain/email-de-connexion.ts";

export class StockageDeLaBoiteDeTestEnMemoire implements StockageDeLaBoiteDeTest {
  readonly emailsRanges: EmailDeConnexion[] = [];

  ranger(email: EmailDeConnexion): Promise<void> {
    this.emailsRanges.push(email);
    return Promise.resolve();
  }
}
