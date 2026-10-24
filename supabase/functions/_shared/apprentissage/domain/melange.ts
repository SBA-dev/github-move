import type { Hasard } from "./hasard.ts";

export function melanger(textes: readonly string[], hasard: Hasard): string[] {
  const melanges = [...textes];
  for (let i = melanges.length - 1; i > 0; i--) {
    const j = Math.floor(hasard.entre0et1() * (i + 1));
    echanger(melanges, i, j);
  }
  return melanges;
}

function echanger(textes: string[], a: number, b: number): void {
  const temporaire = textes[a] as string;
  textes[a] = textes[b] as string;
  textes[b] = temporaire;
}
