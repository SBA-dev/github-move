const CHEMIN_DU_SERVICE_WORKER = "/sw.js";

function inscrire() {
  navigator.serviceWorker.register(CHEMIN_DU_SERVICE_WORKER).catch(() => undefined);
}

// Le service worker n'existe qu'en production (le build le prépare) : jamais en développement.
export function enregistrerLeServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  if (document.readyState === "complete") inscrire();
  else window.addEventListener("load", inscrire, { once: true });
}
