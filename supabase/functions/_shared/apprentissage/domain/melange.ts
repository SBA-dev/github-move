import type { Hasard } from "./hasard.ts";

export function melanger<T>(textes: readonly T[], hasard: Hasard): T[] {
  const melanges = [...textes];
  for (let i = melanges.length - 1; i > 0; i--) {
    const j = Math.floor(hasard.entre0et1() * (i + 1));
    echanger(melanges, i, j);
  }
  return melanges;
}

function echanger<T>(textes: T[], a: number, b: number): void {
  const temporaire = textes[a] as T;
  textes[a] = textes[b] as T;
  textes[b] = temporaire;
}
