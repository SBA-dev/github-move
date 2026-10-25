import type { AdresseEmail } from "../../domain/adresse-email.ts";
import type { ParentId } from "../../domain/parent-id.ts";

export interface ParentsDesAdresses {
  parentDeLAdresse(adresse: AdresseEmail): Promise<ParentId | undefined>;
}
