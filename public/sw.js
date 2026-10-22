// Service worker de Savanturier : coquille de l'application et bibliothèque disponibles sans réseau.
// Au build, le plugin « pwa » remplace VERSION et FICHIERS_DU_BUILD (voir vite-plugins/pwa.ts).
const VERSION = "developpement";
const COQUILLE = ["/", "/manifest.webmanifest", "/icones/icone-192.png", "/icones/icone-512.png", "/bibliotheque.json"];
const FICHIERS_DU_BUILD = [];
const NOM_DU_CACHE = `savanturier-${VERSION}`;
const PREFIXE_DES_FICHIERS_HACHES = "/assets/";

self.addEventListener("install", (evenement) => {
  evenement.waitUntil(precacherLaCoquille().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(supprimerLesAutresCaches());
});

self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;
  const url = new URL(requete.url);
  if (requete.method !== "GET" || url.origin !== self.location.origin) return;
  if (requete.mode === "navigate") {
    evenement.respondWith(reseauPuisCache(requete, "/"));
  } else if (url.pathname === "/bibliotheque.json") {
    evenement.respondWith(reseauPuisCache(requete, url.pathname));
  } else if (url.pathname.startsWith(PREFIXE_DES_FICHIERS_HACHES)) {
    evenement.respondWith(cachePuisReseau(requete));
  }
});

async function precacherLaCoquille() {
  const cache = await caches.open(NOM_DU_CACHE);
  await cache.addAll([...COQUILLE, ...FICHIERS_DU_BUILD].map((chemin) => new Request(chemin, { cache: "reload" })));
}

async function supprimerLesAutresCaches() {
  const noms = await caches.keys();
  await Promise.all(noms.filter((nom) => nom !== NOM_DU_CACHE).map((nom) => caches.delete(nom)));
}

async function reseauPuisCache(requete, cle) {
  const cache = await caches.open(NOM_DU_CACHE);
  try {
    const reponse = await fetch(requete);
    if (reponse.ok) await cache.put(cle, reponse.clone());
    return reponse;
  } catch (erreur) {
    const enCache = await cache.match(cle);
    if (enCache) return enCache;
    throw erreur;
  }
}

async function cachePuisReseau(requete) {
  const cache = await caches.open(NOM_DU_CACHE);
  const enCache = await cache.match(requete);
  if (enCache) return enCache;
  const reponse = await fetch(requete);
  if (reponse.ok) await cache.put(requete, reponse.clone());
  return reponse;
}
