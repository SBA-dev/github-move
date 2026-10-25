const faits = new Map<string, ReadonlySet<string>>();

/** Retient le test de départ terminé dans ce navigateur, avant même que le serveur l'ait enregistré. */
export function retenirLeTestDeDepartFait(profil: string, leconsReussies: ReadonlySet<string>): void {
  faits.set(profil, new Set([...(faits.get(profil) ?? []), ...leconsReussies]));
}

/** Les leçons réussies par les tests de départ faits dans ce navigateur ; `undefined` si le profil n'en a fait aucun. */
export function testDeDepartFaitPendantLUtilisation(profil: string): ReadonlySet<string> | undefined {
  return faits.get(profil);
}

export function oublierLesTestsDeDepartFaits(): void {
  faits.clear();
}
