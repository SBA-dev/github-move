import type { Lecon } from "../../../catalogue/domain/index.ts";

export interface LeconsDuCatalogue {
  parId(id: string): Promise<Lecon | null>;
}
