const BOUTONS_SANS_SON = "[data-donne-une-reponse], [data-bascule-du-son]";

function boutonDe(cible: EventTarget | null): HTMLButtonElement | null {
  return cible instanceof Element ? cible.closest("button") : null;
}

function faitEntendreUnSon(bouton: HTMLButtonElement): boolean {
  return !bouton.disabled && bouton.ariaDisabled !== "true" && !bouton.matches(BOUTONS_SANS_SON);
}

/**
 * Tout bouton touché fait entendre « bouton touché », sauf celui qui donne une réponse (il joue le son de la réponse,
 * marqué `data-donne-une-reponse`) et celui qui bascule Son / Muet (`data-bascule-du-son`).
 * L'écoute précède celle de React : le son part avant la parole que le bouton déclenche.
 * Retourne la fonction qui débranche l'écoute.
 */
export function brancherLeSonDesBoutons(faireEntendre: () => void): () => void {
  const surClic = (evenement: MouseEvent) => {
    const bouton = boutonDe(evenement.target);
    if (bouton && faitEntendreUnSon(bouton)) faireEntendre();
  };
  document.addEventListener("click", surClic, true);
  return () => document.removeEventListener("click", surClic, true);
}
