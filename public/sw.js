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
].map((nom) => `/sons/${nom}.mp3`);
const COQUILLE = ["/", "/manifest.webmanifest", "/icones/icone-192.png", "/icones/icone-512.png", "/bibliotheque.json", "/voix/repertoire.json", ...SONS];
const FICHIERS_DU_BUILD = [];
const NOM_DU_CACHE = `savanturier-${VERSION}`;
const PREFIXE_DES_FICHIERS_HACHES = "/assets/";
const PREFIXE_DES_SONS = "/sons/";
// Les sons de phrases ne changent de nom que si leur contenu change : ce cache survit aux versions de l'application.
const NOM_DU_CACHE_DES_VOIX = "savanturier-voix";
const PREFIXE_DES_SONS_DE_PHRASES = "/voix/";
const REPERTOIRE_DES_SONS_DE_PHRASES = "/voix/repertoire.json";
const MESSAGE_METTRE_EN_RESERVE = "mettre-en-reserve-des-sons";
const REGISTRE_DE_LA_RESERVE = "/voix/.reserve";
const BUDGET_DE_LA_RESERVE_EN_OCTETS = 20 * 1024 * 1024;

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
  } else if (url.pathname === REPERTOIRE_DES_SONS_DE_PHRASES) {
    evenement.respondWith(reseauPuisCache(requete, url.pathname));
  } else if (url.pathname.startsWith(PREFIXE_DES_SONS_DE_PHRASES)) {
    evenement.respondWith(sonDePhrase(requete));
  } else if (url.pathname === "/bibliotheque.json" || url.pathname === "/programmes-index.json") {
    evenement.respondWith(reseauPuisCache(requete, url.pathname));
  } else if (url.pathname.startsWith(PREFIXE_DES_FICHIERS_HACHES)) {
    evenement.respondWith(cachePuisReseau(requete));
  } else if (url.pathname.startsWith(PREFIXE_DES_SONS)) {
    evenement.respondWith(sonDuCache(requete));
  }
});

self.addEventListener("message", (evenement) => {
  const message = evenement.data;
  if (message?.type !== MESSAGE_METTRE_EN_RESERVE || !Array.isArray(message.fichiers)) return;
  const fichiers = message.fichiers.filter(estUnSonDePhrase);
  evenement.waitUntil(mettreEnReserve(fichiers));
});

async function precacherLaCoquille() {
  const cache = await caches.open(NOM_DU_CACHE);
  await cache.addAll([...COQUILLE, ...FICHIERS_DU_BUILD].map((chemin) => new Request(chemin, { cache: "reload" })));
}

async function supprimerLesAutresCaches() {
  const noms = await caches.keys();
  await Promise.all(noms.filter((nom) => nom !== NOM_DU_CACHE && nom !== NOM_DU_CACHE_DES_VOIX).map((nom) => caches.delete(nom)));
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

function estUnSonDePhrase(chemin) {
  return typeof chemin === "string" && chemin.startsWith(PREFIXE_DES_SONS_DE_PHRASES) && chemin.endsWith(".mp3") &&
    !chemin.includes("..");
}

function estUnSon(reponse) {
  return reponse.ok && (reponse.headers.get("content-type") ?? "").startsWith("audio/");
}

// Une page de repli renvoyée à la place d'un son manquant ne doit jamais entrer dans la réserve.
async function chercherUnSonDePhrase(chemin) {
  const cache = await caches.open(NOM_DU_CACHE_DES_VOIX);
  const enCache = await cache.match(chemin);
  if (enCache) return enCache;
  const reponse = await fetch(chemin);
  if (estUnSon(reponse)) await garderEnReserve(chemin, reponse.clone());
  return reponse;
}

// Un seul à la fois : le registre de la réserve est relu puis réécrit.
let filDeLaReserve = Promise.resolve();
function enFileDeLaReserve(action) {
  const suite = filDeLaReserve.then(action, action);
  filDeLaReserve = suite.catch(() => undefined);
  return suite;
}

async function lireLeRegistre(cache) {
  const reponse = await cache.match(REGISTRE_DE_LA_RESERVE);
  return reponse ? await reponse.json() : [];
}

async function ecrireLeRegistre(cache, registre) {
  await cache.put(REGISTRE_DE_LA_RESERVE, new Response(JSON.stringify(registre), { headers: { "content-type": "application/json" } }));
}

// Le registre garde l'ordre de mise en réserve : au-delà du budget, les sons les plus anciens partent d'abord.
function garderEnReserve(chemin, reponse, protegees = []) {
  return enFileDeLaReserve(async () => {
    const cache = await caches.open(NOM_DU_CACHE_DES_VOIX);
    const taille = (await reponse.clone().arrayBuffer()).byteLength;
    await cache.put(chemin, reponse);
    const registre = (await lireLeRegistre(cache)).filter((son) => son.chemin !== chemin);
    registre.push({ chemin, taille });
    let total = registre.reduce((somme, son) => somme + son.taille, 0);
    while (total > BUDGET_DE_LA_RESERVE_EN_OCTETS) {
      const index = registre.findIndex((son) => son.chemin !== chemin && !protegees.includes(son.chemin));
      if (index === -1) break;
      const [retire] = registre.splice(index, 1);
      total -= retire.taille;
      await cache.delete(retire.chemin);
    }
    await ecrireLeRegistre(cache, registre);
  });
}

async function mettreEnReserve(chemins) {
  const cache = await caches.open(NOM_DU_CACHE_DES_VOIX);
  for (const chemin of chemins) {
    try {
      const reponse = (await cache.match(chemin)) ?? (await fetch(chemin));
      if (estUnSon(reponse)) await garderEnReserve(chemin, reponse.clone(), chemins);
    } catch {
      // Sans réseau, la réserve se fera à la prochaine occasion : la lecture se replie sur la voix de l'appareil.
    }
  }
}

// Safari ne lit un son que si le serveur répond aux requêtes « Range » par un 206 : on le fait depuis le cache.
async function sonDePhrase(requete) {
  const reponse = await chercherUnSonDePhrase(new URL(requete.url).pathname);
  return repondreALaPlage(requete, reponse);
}

async function sonDuCache(requete) {
  return repondreALaPlage(requete, await cachePuisReseau(new Request(requete.url)));
}

async function repondreALaPlage(requete, reponse) {
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
