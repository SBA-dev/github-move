// Serveur de test de la PWA (#8) : relais devant `vite preview` (port 4173), sur le port 4174.
// Il laisse tout passer, sauf quand un scénario « publie » une nouvelle version ou une nouvelle leçon.
// Le navigateur ne laisse pas intercepter le script d'un service worker (page.route / context.route),
// d'où ce relais côté serveur. Les scénarios le pilotent par POST /__test/<commande>.
import http from "node:http";

const PORT = 4174;
const AMONT = { host: "127.0.0.1", port: 4173 };
const SUFFIXE_VERSION = "-test-nouvelle";
const MOTIF_VERSION = /const VERSION = "([^"]*)"/;
const LECON_AJOUTEE = "lecon-ajoutee-par-le-test";

const etat = { versionPubliee: false, leconPubliee: false };

function interroger(requete) {
  return new Promise((resolve, reject) => {
    const amont = http.request(
      { ...AMONT, path: requete.url, method: requete.method, headers: { ...requete.headers, host: `${AMONT.host}:${AMONT.port}`, "accept-encoding": "identity" } },
      (reponse) => {
        const morceaux = [];
        reponse.on("data", (m) => morceaux.push(m));
        reponse.on("end", () => resolve({ statut: reponse.statusCode ?? 502, entetes: reponse.headers, corps: Buffer.concat(morceaux) }));
      },
    );
    amont.on("error", reject);
    amont.end();
  });
}

function repondre(reponse, statut, entetes, corps) {
  const { etag: _etag, "last-modified": _modifie, "content-length": _taille, ...gardes } = entetes;
  reponse.writeHead(statut, { ...gardes, "content-length": corps.length, "cache-control": "no-cache" });
  reponse.end(corps);
}

function versionPubliee(source) {
  const trouvee = MOTIF_VERSION.exec(source);
  if (trouvee === null) return null;
  return { source: source.replace(MOTIF_VERSION, `const VERSION = "${trouvee[1]}${SUFFIXE_VERSION}"`), version: `${trouvee[1]}${SUFFIXE_VERSION}` };
}

function avecLeconAjoutee(texte) {
  const lecons = JSON.parse(texte);
  const ajoutee = { ...lecons[0], id: LECON_AJOUTEE, titre: "Leçon ajoutée par le test" };
  return JSON.stringify([...lecons, ajoutee]);
}

async function commande(nom, reponse) {
  if (nom === "reinitialiser") {
    etat.versionPubliee = false;
    etat.leconPubliee = false;
    return repondre(reponse, 200, { "content-type": "application/json" }, Buffer.from("{}"));
  }
  if (nom === "publier-lecon") {
    etat.leconPubliee = true;
    return repondre(reponse, 200, { "content-type": "application/json" }, Buffer.from(JSON.stringify({ id: LECON_AJOUTEE })));
  }
  if (nom === "publier-version") {
    const sw = await interroger({ url: "/sw.js", method: "GET", headers: {} });
    const publiee = sw.statut === 200 ? versionPubliee(sw.corps.toString("utf8")) : null;
    if (publiee === null) return repondre(reponse, 500, { "content-type": "text/plain" }, Buffer.from('sw.js absent, ou sans la ligne  const VERSION = "..."'));
    etat.versionPubliee = true;
    return repondre(reponse, 200, { "content-type": "application/json" }, Buffer.from(JSON.stringify({ version: publiee.version })));
  }
  return repondre(reponse, 404, { "content-type": "text/plain" }, Buffer.from("commande inconnue"));
}

async function relayer(requete, reponse) {
  const chemin = new URL(requete.url, "http://relais").pathname;
  const amont = await interroger(requete);
  if (chemin === "/sw.js" && etat.versionPubliee && amont.statut === 200) {
    const publiee = versionPubliee(amont.corps.toString("utf8"));
    if (publiee !== null) return repondre(reponse, 200, amont.entetes, Buffer.from(publiee.source));
  }
  if (chemin === "/bibliotheque.json" && etat.leconPubliee && amont.statut === 200) {
    return repondre(reponse, 200, amont.entetes, Buffer.from(avecLeconAjoutee(amont.corps.toString("utf8"))));
  }
  return repondre(reponse, amont.statut, amont.entetes, amont.corps);
}

http
  .createServer((requete, reponse) => {
    const traitement = requete.method === "POST" && requete.url?.startsWith("/__test/")
      ? commande(requete.url.slice("/__test/".length), reponse)
      : relayer(requete, reponse);
    traitement.catch(() => {
      reponse.writeHead(502);
      reponse.end("vite preview ne répond pas");
    });
  })
  .listen(PORT);
