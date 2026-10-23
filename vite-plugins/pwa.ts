import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

const BIBLIOTHEQUE_SOURCE = "app/bibliotheque.json";
// Données du pipeline de contenu servies à la racine, sans copie : chemin public → fichier source.
const DONNEES_DU_CONTENU: Readonly<Record<string, string>> = {
  "/bibliotheque.json": BIBLIOTHEQUE_SOURCE,
  "/programmes-index.json": "app/programmes-index.json",
};
const MANIFESTE = "public/manifest.webmanifest";
const PAGE_D_ACCUEIL = "index.html";
const DOSSIER_DES_ICONES = "public/icones";
const VERSION_A_REMPLACER = /const VERSION = "[^"]*";/;
const FICHIERS_A_REMPLACER = /const FICHIERS_DU_BUILD = \[[^\]]*\];/;

function empreinte(...contenus: readonly (string | Buffer)[]): string {
  const hash = createHash("sha256");
  for (const contenu of contenus) hash.update(contenu);
  return hash.digest("hex").slice(0, 12);
}

function icones(racine: string): Buffer[] {
  const dossier = join(racine, DOSSIER_DES_ICONES);
  return readdirSync(dossier).sort().map((nom) => readFileSync(join(dossier, nom)));
}

/**
 * Sert la bibliothèque du Catalogue pédagogique et l'index des programmes à la racine (dev et build) sans en garder de copie,
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
      for (const [chemin, source] of Object.entries(DONNEES_DU_CONTENU)) {
        serveur.middlewares.use(chemin, (_requete, reponse) => {
          reponse.setHeader("content-type", "application/json");
          reponse.end(readFileSync(join(racine, source)));
        });
      }
    },
    generateBundle() {
      for (const [chemin, source] of Object.entries(DONNEES_DU_CONTENU)) {
        this.emitFile({ type: "asset", fileName: chemin.slice(1), source: readFileSync(join(racine, source)) });
      }
    },
    writeBundle(options, bundle) {
      const sw = join(options.dir ?? join(racine, "dist"), "sw.js");
      const modele = readFileSync(sw, "utf8");
      const fichiersDuBuild = Object.keys(bundle).filter((nom) => nom.startsWith("assets/")).map((nom) => `/${nom}`).sort();
      const version = empreinte(
        modele,
        readFileSync(join(racine, MANIFESTE)),
        readFileSync(join(racine, PAGE_D_ACCUEIL)),
        ...icones(racine),
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
