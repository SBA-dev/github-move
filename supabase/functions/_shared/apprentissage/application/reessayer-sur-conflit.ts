const ESSAIS_AU_PLUS = 3;

export type Tentative<Issue extends string, Valeur> = { issue: Issue; valeur: Valeur };

/** Écriture optimiste : tant que la tentative signale un conflit, on la relance (3 essais au plus). */
export async function reessayerSurConflit<Issue extends string, Valeur>(
  tenter: () => Promise<Tentative<Issue, Valeur>>,
  abandon: string,
): Promise<Tentative<Exclude<Issue, "conflit">, Valeur>> {
  for (let essai = 1; essai <= ESSAIS_AU_PLUS; essai++) {
    const tentative = await tenter();
    if (tentative.issue !== "conflit") return tentative as Tentative<Exclude<Issue, "conflit">, Valeur>;
  }
  throw new Error(abandon);
}
