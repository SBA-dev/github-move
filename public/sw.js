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
  "air-de-saxophone",
  "air-de-cordes-pincees",
  "air-de-steel-drum-court",
  "air-de-steel-drum-long",
  "air-de-steel-drum-bref",
  "air-de-cordes-pincees-bref",
].map((nom) => `/sons/${nom}.mp3`);
const COQUILLE = ["/", "/manifest.webmanifest", "/icones/icone-192.png", "/icones/icone-512.png", "/bibliotheque.json", ...SONS];
const FICHIERS_DU_BUILD = [];
const NOM_DU_CACHE = `savanturier-${VERSION}`;
const PREFIXE_DES_FICHIERS_HACHES = "/assets/";
const PREFIXE_DES_SONS = "/sons/";
// Cache des voix enregistrées : non versionné, il survit aux nouvelles versions (les MP3 portent leur empreinte dans l'adresse).
// Copie de CACHE_DES_VOIX (src/voix/garder-les-phrases-de-la-lecon.ts) : ce fichier n'est pas un module.
const NOM_DU_CACHE_DES_VOIX = "savanturier-voix";
const PREFIXE_DES_VOIX = "/voix/";
const REPERTOIRE_DES_VOIX = "/voix/repertoire.json";

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
  } else if (url.pathname === REPERTOIRE_DES_VOIX) {
    evenement.respondWith(repertoireDesVoix(requete));
  } else if (url.pathname.startsWith(PREFIXE_DES_VOIX) && url.pathname.endsWith(".mp3")) {
    evenement.respondWith(sonDuCache(requete, NOM_DU_CACHE_DES_VOIX, estUnSon));
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
  await Promise.all(noms.filter((nom) => nom !== NOM_DU_CACHE && nom !== NOM_DU_CACHE_DES_VOIX).map((nom) => caches.delete(nom)));
}

async function reseauPuisCache(requete, cle, nomDuCache = NOM_DU_CACHE) {
  const cache = await caches.open(nomDuCache);
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

async function repertoireDesVoix(requete) {
  const reponse = await reseauPuisCache(requete, REPERTOIRE_DES_VOIX, NOM_DU_CACHE_DES_VOIX);
  if (reponse.ok) await retirerLesMp3QuiNeSontPlusAuRepertoire(reponse.clone());
  return reponse;
}

// Adresses construites comme adresseDuMp3 (supabase/functions/_shared/voix/domain/adresse-du-mp3.ts) : ce fichier n'est pas un module.
async function retirerLesMp3QuiNeSontPlusAuRepertoire(reponse) {
  try {
    const { phrases } = await reponse.json();
    const adressesGardees = new Set();
    for (const [cle, { normale, lente }] of Object.entries(phrases)) {
      adressesGardees.add(`/voix/${cle}-${normale}.mp3`);
      if (lente) adressesGardees.add(`/voix/${cle}-lente-${lente}.mp3`);
    }
    const cache = await caches.open(NOM_DU_CACHE_DES_VOIX);
    for (const requete of await cache.keys()) {
      const { pathname } = new URL(requete.url);
      if (pathname.endsWith(".mp3") && !adressesGardees.has(pathname)) await cache.delete(requete);
    }
  } catch {
    // Répertoire illisible : on ne retire rien.
  }
}

const estUnSon = (reponse) => reponse.ok && (reponse.headers.get("content-type") ?? "").startsWith("audio/");

async function cachePuisReseau(requete, nomDuCache = NOM_DU_CACHE, aGarder = (reponse) => reponse.ok) {
  const cache = await caches.open(nomDuCache);
  const enCache = await cache.match(requete, { ignoreVary: true });
  if (enCache) return enCache;
  const reponse = await fetch(requete);
  if (aGarder(reponse)) await cache.put(requete, reponse.clone());
  return reponse;
}

// Safari ne lit un son que si le serveur répond aux requêtes « Range » par un 206 : on le fait depuis le cache.
async function sonDuCache(requete, nomDuCache = NOM_DU_CACHE, aGarder = undefined) {
  const reponse = await cachePuisReseau(new Request(requete.url), nomDuCache, aGarder);
  const plage = /^bytes=(\d*)-(\d*)$/.exec(requete.headers.get("range") ?? "");
  if (!plage || (plage[1] === "" && plage[2] === "") || !reponse.ok) return reponse;
  const octets = await reponse.arrayBuffer();
  const taille = octets.byteLength;
  const suffixe = plage[1] === "";
  const debut = suffixe ? Math.max(0, taille - Number(plage[2])) : Number(plage[1]);
  if (debut >= taille) return new Response(null, { status: 416, headers: { "content-range": `bytes */${taille}` } });
  const fin = suffixe || plage[2] === "" ? taille - 1 : Math.min(Number(plage[2]), taille - 1);
  return new Response(octets.slice(debut, fin + 1), {
    status: 206,
    headers: {
      "content-type": "audio/mpeg",
      "content-range": `bytes ${debut}-${fin}/${taille}`,
      "content-length": String(fin - debut + 1),
    },
  });
}
