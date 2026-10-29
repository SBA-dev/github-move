const ESSAIS_AU_PLUS = 3;

/** Écriture optimiste : tant que la tentative signale un conflit, on la relance (3 essais au plus). */
export async function reessayerSurConflit<Issue extends string>(
  tenter: () => Promise<Issue>,
  abandon: string,
): Promise<Exclude<Issue, "conflit">> {
  for (let essai = 1; essai <= ESSAIS_AU_PLUS; essai++) {
    const issue = await tenter();
    if (issue !== "conflit") return issue as Exclude<Issue, "conflit">;
  }
  throw new Error(abandon);
}
