// Mise en réserve des sons de phrases pour jouer hors ligne : le front dit au service worker quels fichiers garder,
// la liste vient du répertoire des sons. Le service worker décide seulement de la place (budget de la réserve).
import { lireLeRepertoireDesSons } from "./repertoire-des-sons-lu.ts";

const PAROLES_COMMUNES = "paroles-communes";
const MESSAGE_METTRE_EN_RESERVE = "mettre-en-reserve-des-sons";

async function mettreEnReserve(cle: string): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const repertoire = await lireLeRepertoireDesSons();
  const fichiers = (repertoire?.lecons?.[cle] ?? []).map((nom) => `/voix/${nom}`);
  if (fichiers.length === 0) return;
  const inscription = await navigator.serviceWorker.ready;
  inscription.active?.postMessage({ type: MESSAGE_METTRE_EN_RESERVE, fichiers });
}

export function mettreEnReserveLesSonsDeLaLecon(leconId: string): Promise<void> {
  return mettreEnReserve(leconId).catch(() => undefined);
}

export function mettreEnReserveLesParolesCommunes(): Promise<void> {
  return mettreEnReserve(PAROLES_COMMUNES).catch(() => undefined);
}
