import type { TenuePortee } from "@domain/motivation";

const PREFIXE = "savanturier:tenue-portee:";
const CHANGEMENT = "savanturier:tenue-portee-changee";

const cle = (profil: string) => `${PREFIXE}${profil}`;

/** La tenue portée par le personnage guide du profil, gardée sur cet appareil ; une valeur illisible vaut « aucune ». */
export function lireLaTenuePortee(profil: string): TenuePortee {
  try {
    return localStorage.getItem(cle(profil)) ?? undefined;
  } catch {
    return undefined;
  }
}

/** N'enregistre que ce que rendent `porterUneTenue` et `retirerLaTenue`. */
export function memoriserLaTenuePortee(profil: string, tenue: TenuePortee): void {
  try {
    if (tenue === undefined) localStorage.removeItem(cle(profil));
    else localStorage.setItem(cle(profil), tenue);
  } catch {
    // Mémorisation impossible : le choix vaut jusqu'à la fermeture de l'application.
  }
  window.dispatchEvent(new Event(CHANGEMENT));
}

/** À la déconnexion du parent : plus aucune tenue portée sur l'appareil. */
export function oublierLesTenuesPortees(): void {
  try {
    const cles = Array.from({ length: localStorage.length }, (_, rang) => localStorage.key(rang));
    for (const uneCle of cles) if (uneCle?.startsWith(PREFIXE)) localStorage.removeItem(uneCle);
  } catch {
    // Rien à effacer si le stockage est indisponible.
  }
  window.dispatchEvent(new Event(CHANGEMENT));
}

export function suivreLaTenuePortee(auChangement: () => void): () => void {
  window.addEventListener(CHANGEMENT, auChangement);
  return () => window.removeEventListener(CHANGEMENT, auChangement);
}
