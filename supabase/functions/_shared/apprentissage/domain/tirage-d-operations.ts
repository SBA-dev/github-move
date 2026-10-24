import type { GenerateurComplet, Intervalle, Operation } from "../../catalogue/domain/index.ts";
import type { Hasard } from "./hasard.ts";

export function tirerLesOperations(
  generateur: GenerateurComplet,
  hasard: Hasard,
  facilite = 1,
): readonly Operation[] {
  const a = reduire(generateur.a, facilite);
  const b = reduire(generateur.b, facilite);
  return Array.from({ length: generateur.combien }, () => tirerUneOperation(generateur, a, b, hasard));
}

function tirerUneOperation(
  { op, cible }: GenerateurComplet,
  intervalleA: Intervalle,
  intervalleB: Intervalle,
  hasard: Hasard,
): Operation {
  const a = tirerUnEntier(intervalleA, hasard);
  if (op === "complement") return { q: `${a} + … = ${cible}`, r: cible - a };
  const b = tirerUnEntier(intervalleB, hasard);
  switch (op) {
    case "+":
      return { q: `${a} + ${b}`, r: a + b };
    case "-":
      return { q: `${Math.max(a, b)} − ${Math.min(a, b)}`, r: Math.abs(a - b) };
    case "×":
      return { q: `${a} × ${b}`, r: a * b };
    case ":":
      return { q: `${a * b} : ${b}`, r: a };
  }
}

function tirerUnEntier([min, max]: Intervalle, hasard: Hasard): number {
  return min + Math.floor(hasard.entre0et1() * (max - min + 1));
}

function reduire([min, max]: Intervalle, facilite: number): Intervalle {
  return [min, Math.max(min, Math.round(min + (max - min) * facilite))];
}
