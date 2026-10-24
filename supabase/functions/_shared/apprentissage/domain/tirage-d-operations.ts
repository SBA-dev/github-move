import type { GenerateurComplet, Intervalle, Operation } from "../../catalogue/domain/index.ts";
import { TirageHorsDuGenerateur } from "./erreurs.ts";
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

export function enonceTire({ q, r }: Operation): string {
  return `${q} = ${r}`;
}

export function relireLesOperations(generateur: GenerateurComplet, tirage: readonly string[]): readonly Operation[] {
  if (tirage.length !== generateur.combien) throw new TirageHorsDuGenerateur(tirage.join(", "));
  return tirage.map((ligne) => {
    const operation = lireUneOperation(ligne);
    if (!estConforme(generateur, operation)) throw new TirageHorsDuGenerateur(ligne);
    return operation;
  });
}

function lireUneOperation(ligne: string): Operation {
  const coupure = ligne.lastIndexOf(" = ");
  return { q: ligne.slice(0, coupure), r: Number(ligne.slice(coupure + 3)) };
}

function estConforme(generateur: GenerateurComplet, { q, r }: Operation): boolean {
  const { op, a, b, cible } = generateur;
  const dans = (nombre: number, [min, max]: Intervalle) => nombre >= min && nombre <= max;
  const nombres = (motif: RegExp) => motif.exec(q)?.slice(1).map(Number);
  switch (op) {
    case "+": {
      const [x, y] = nombres(/^(\d+) \+ (\d+)$/) ?? [];
      return x !== undefined && y !== undefined && dans(x, a) && dans(y, b) && r === x + y;
    }
    case "-": {
      const [x, y] = nombres(/^(\d+) − (\d+)$/) ?? [];
      return x !== undefined && y !== undefined && x >= y && r === x - y &&
        ((dans(x, a) && dans(y, b)) || (dans(y, a) && dans(x, b)));
    }
    case "×": {
      const [x, y] = nombres(/^(\d+) × (\d+)$/) ?? [];
      return x !== undefined && y !== undefined && dans(x, a) && dans(y, b) && r === x * y;
    }
    case ":": {
      const [produit, y] = nombres(/^(\d+) : (\d+)$/) ?? [];
      return produit !== undefined && y !== undefined && dans(r, a) && dans(y, b) && produit === r * y;
    }
    case "complement": {
      const [x, cibleLue] = nombres(/^(\d+) \+ … = (\d+)$/) ?? [];
      return x !== undefined && dans(x, a) && cibleLue === cible && r === cible - x;
    }
  }
}
