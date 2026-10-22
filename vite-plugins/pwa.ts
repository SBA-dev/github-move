import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

const BIBLIOTHEQUE_SOURCE = "app/bibliotheque.json";
const CHEMIN_BIBLIOTHEQUE = "/bibliotheque.json";
const MANIFESTE = "public/manifest.webmanifest";
const VERSION_A_REMPLACER = /const VERSION = "[^"]*";/;
const FICHIERS_A_REMPLACER = /const FICHIERS_DU_BUILD = \[[^\]]*\];/;

function empreinte(...contenus: readonly (string | Buffer)[]): string {
  const hash = createHash("sha256");
  for (const contenu of contenus) hash.update(contenu);
  return hash.digest("hex").slice(0, 12);
}

/**
 * Sert la bibliothèque du Catalogue pédagogique à la racine (dev et build) sans en garder de copie,
 * et prépare le service worker : liste de la coquille (noms hachés du build) et version.
 */
export function pwa(): Plugin {
  let racine = process.cwd();
  return {
    name: "savanturier-pwa",
    configResolved(config) {
      racine = config.root;
    },
    configureServer(serveur) {
      serveur.middlewares.use(CHEMIN_BIBLIOTHEQUE, (_requete, reponse) => {
        reponse.setHeader("content-type", "application/json");
        reponse.end(readFileSync(join(racine, BIBLIOTHEQUE_SOURCE)));
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: CHEMIN_BIBLIOTHEQUE.slice(1),
        source: readFileSync(join(racine, BIBLIOTHEQUE_SOURCE)),
      });
    },
    writeBundle(options, bundle) {
      const sw = join(options.dir ?? join(racine, "dist"), "sw.js");
      const modele = readFileSync(sw, "utf8");
      const fichiersDuBuild = Object.keys(bundle).filter((nom) => nom.startsWith("assets/")).map((nom) => `/${nom}`).sort();
      const version = empreinte(
        modele,
        readFileSync(join(racine, MANIFESTE)),
        readFileSync(join(racine, BIBLIOTHEQUE_SOURCE)),
        fichiersDuBuild.join("\n"),
      );
      writeFileSync(
        sw,
        modele
          .replace(VERSION_A_REMPLACER, `const VERSION = "${version}";`)
          .replace(FICHIERS_A_REMPLACER, `const FICHIERS_DU_BUILD = ${JSON.stringify(fichiersDuBuild)};`),
      );
    },
  };
}
