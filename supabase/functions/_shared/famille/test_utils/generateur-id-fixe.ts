import type { GenerateurId } from "../domain/generateur-id.ts";

export function generateurIdFixe(identifiant: string): GenerateurId {
  return { nouveau: () => identifiant };
}
