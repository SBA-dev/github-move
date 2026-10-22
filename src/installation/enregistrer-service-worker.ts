const CHEMIN_DU_SERVICE_WORKER = "/sw.js";

// Sans service worker l'application reste utilisable en ligne : un échec d'inscription n'est pas une erreur à montrer.
function tolererEchecDInscription() {}

function inscrire() {
  navigator.serviceWorker.register(CHEMIN_DU_SERVICE_WORKER).catch(tolererEchecDInscription);
}

// Le service worker n'existe qu'en production (le build le prépare) : jamais en développement.
export function enregistrerLeServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  if (document.readyState === "complete") inscrire();
  else window.addEventListener("load", inscrire, { once: true });
}
