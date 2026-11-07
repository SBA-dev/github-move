// Mise en réserve des sons de phrases pour jouer hors ligne : le front dit au service worker quels fichiers garder,
// la liste vient du répertoire des sons. Le service worker décide seulement de la place (budget de la réserve).
const ADRESSE_DU_REPERTOIRE = "/voix/repertoire.json";
const PAROLES_COMMUNES = "paroles-communes";
const MESSAGE_METTRE_EN_RESERVE = "mettre-en-reserve-des-sons";

type FichierDuRepertoire = { readonly lecons?: Readonly<Record<string, readonly string[]>> };

let sonsParLecon: Promise<Readonly<Record<string, readonly string[]>>> | undefined;

function lireLesSonsParLecon(): Promise<Readonly<Record<string, readonly string[]>>> {
  sonsParLecon ??= fetch(ADRESSE_DU_REPERTOIRE)
    .then((reponse) => (reponse.ok ? reponse.json() as Promise<FichierDuRepertoire> : ({} as FichierDuRepertoire)))
    .then((fichier) => fichier.lecons ?? {})
    .catch(() => {
      sonsParLecon = undefined;
      return {};
    });
  return sonsParLecon;
}

async function mettreEnReserve(cle: string): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const [noms, inscription] = await Promise.all([lireLesSonsParLecon(), navigator.serviceWorker.getRegistration()]);
  const fichiers = (noms[cle] ?? []).map((nom) => `/voix/${nom}`);
  if (fichiers.length === 0) return;
  (inscription?.active ?? navigator.serviceWorker.controller)?.postMessage({ type: MESSAGE_METTRE_EN_RESERVE, fichiers });
}

export function mettreEnReserveLesSonsDeLaLecon(leconId: string): Promise<void> {
  return mettreEnReserve(leconId).catch(() => undefined);
}

export function mettreEnReserveLesParolesCommunes(): Promise<void> {
  return mettreEnReserve(PAROLES_COMMUNES).catch(() => undefined);
}
