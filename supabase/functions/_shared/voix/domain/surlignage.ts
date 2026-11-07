export type Surlignage = {
  readonly parPosition: (phrase: number, position: number) => void;
  readonly parRang: (phrase: number, rangDansLaPhrase: number) => void;
};

function debutsDesMots(phrase: string): number[] {
  return [...phrase.matchAll(/\S+/g)].map((mot) => mot.index);
}

export function surlignage(
  phrases: readonly string[],
  rangsAffiches: ReadonlyArray<number | undefined>,
  onMot: (rang: number) => void,
): Surlignage {
  const debuts = phrases.map(debutsDesMots);
  const motsAvant = debuts.map((_, i) => debuts.slice(0, i).reduce((total, d) => total + d.length, 0));
  const parRang = (phrase: number, rangDansLaPhrase: number) => {
    const rang = rangsAffiches[(motsAvant[phrase] ?? 0) + rangDansLaPhrase];
    if (rang !== undefined) onMot(rang);
  };
  return {
    parRang,
    parPosition: (phrase, position) => {
      const dansLaPhrase = (debuts[phrase] ?? []).filter((debut) => debut <= position).length - 1;
      parRang(phrase, Math.max(0, dansLaPhrase));
    },
  };
}
