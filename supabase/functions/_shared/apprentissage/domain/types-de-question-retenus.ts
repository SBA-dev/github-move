import type { TypeDeQuestion } from "./question-suivie.ts";

const TYPES_JAMAIS_RETENUS: readonly TypeDeQuestion[] = ["ordre"];

export function estUnTypeDeQuestionRetenu(type: TypeDeQuestion): boolean {
  return !TYPES_JAMAIS_RETENUS.includes(type);
}
