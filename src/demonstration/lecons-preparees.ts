export const CLE_LECONS_PREPAREES = "savanturier:lecons-preparees";

export function lireLeconsPreparees(): ReadonlyArray<unknown> {
  try {
    const contenu = localStorage.getItem(CLE_LECONS_PREPAREES);
    const lecons: unknown = contenu === null ? [] : JSON.parse(contenu);
    return Array.isArray(lecons) ? lecons : [];
  } catch {
    return [];
  }
}
