import type { GenerateurId } from "../application/ports/generateur-id.ts";

export function generateurIdFixe(identifiant: string): GenerateurId {
  return { nouveau: () => identifiant };
}
