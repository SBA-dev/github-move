// Service worker de Savanturier : coquille de l'application et bibliothèque disponibles sans réseau.
// Au build, le plugin « pwa » remplace VERSION et FICHIERS_DU_BUILD (voir vite-plugins/pwa.ts).
const VERSION = "developpement";
const SONS = [
  "reponse-juste",
  "reponse-fausse",
  "point-du-recipient",
  "texte-complet",
  "seance-terminee",
  "grande-victoire",
  "decouverte",
  "bouton-touche",
].map((nom) => `/sons/${nom}.mp3`);
const COQUILLE = ["/", "/manifest.webmanifest", "/icones/icone-192.png", "/icones/icone-512.png", "/bibliotheque.json", ...SONS];
const FICHIERS_DU_BUILD = [];
const NOM_DU_CACHE = `savanturier-${VERSION}`;
const PREFIXE_DES_FICHIERS_HACHES = "/assets/";
const PREFIXE_DES_SONS = "/sons/";

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
  } else if (url.pathname === "/bibliotheque.json" || url.pathname === "/programmes-index.json") {
    evenement.respondWith(reseauPuisCache(requete, url.pathname));
  } else if (url.pathname.startsWith(PREFIXE_DES_FICHIERS_HACHES)) {
    evenement.respondWith(cachePuisReseau(requete));
  } else if (url.pathname.startsWith(PREFIXE_DES_SONS)) {
    evenement.respondWith(sonDuCache(requete));
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
    if (reponse.ok) {
      await cache.put(cle, reponse.clone());
      return reponse;
    }
    return (await cache.match(cle)) ?? reponse;
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

// Safari ne lit un son que si le serveur répond aux requêtes « Range » par un 206 : on le fait depuis le cache.
async function sonDuCache(requete) {
  const reponse = await cachePuisReseau(new Request(requete.url));
  const plage = /^bytes=(\d+)-(\d*)$/.exec(requete.headers.get("range") ?? "");
  if (!plage || !reponse.ok) return reponse;
  const octets = await reponse.arrayBuffer();
  const debut = Number(plage[1]);
  const fin = plage[2] === "" ? octets.byteLength - 1 : Math.min(Number(plage[2]), octets.byteLength - 1);
  return new Response(octets.slice(debut, fin + 1), {
    status: 206,
    headers: {
      "content-type": "audio/mpeg",
      "content-range": `bytes ${debut}-${fin}/${octets.byteLength}`,
      "content-length": String(fin - debut + 1),
    },
  });
}
