const ADRESSE_DU_REPERTOIRE = "/voix/repertoire.json";

export type SonDuRepertoire = { readonly fichier: string; readonly dureeMs: number };
export type FichierDuRepertoire = {
  readonly sons: Readonly<Record<string, SonDuRepertoire>>;
  readonly lecons?: Readonly<Record<string, readonly string[]>>;
};

let lecture: Promise<FichierDuRepertoire | undefined> | undefined;

/** Un seul chargement du répertoire pour toute l'application ; un échec se retente à la demande suivante. */
export function lireLeRepertoireDesSons(): Promise<FichierDuRepertoire | undefined> {
  lecture ??= fetch(ADRESSE_DU_REPERTOIRE)
    .then((reponse) => (reponse.ok ? reponse.json() as Promise<FichierDuRepertoire> : undefined))
    .catch(() => undefined)
    .then((fichier) => {
      if (fichier === undefined) lecture = undefined;
      return fichier;
    });
  return lecture;
}
