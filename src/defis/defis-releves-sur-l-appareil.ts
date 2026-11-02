import type { DefiReleve } from "@domain/apprentissage";

const copies = new Map<string, readonly DefiReleve[]>();

const cleDuDefi = ({ matiere, niveau, numero }: DefiReleve): string => `${matiere.code}/${niveau.valeur}/${numero}`;

/** Un défi relevé ne se perd jamais : les nouveaux s'ajoutent à la copie, une seule fois chacun. */
export function retenirLesDefisReleves(profil: string, defis: readonly DefiReleve[]): readonly DefiReleve[] {
  const retenus = new Map([...(copies.get(profil) ?? []), ...defis].map((defi) => [cleDuDefi(defi), defi]));
  const copie = [...retenus.values()];
  copies.set(profil, copie);
  return copie;
}

/** Les défis relevés connus de l'appareil : lus du serveur, ou terminés ici et pas encore enregistrés. */
export function defisRelevesDeLAppareil(profil: string): readonly DefiReleve[] {
  return copies.get(profil) ?? [];
}

export function oublierLesDefisReleves(): void {
  copies.clear();
}
