// Rend un dessin SVG en planche PNG pour que l'illustrateur voie son travail.
// Usage : node .claude/skills/illustration/rendre.mjs <dessin.svg> <planche.png> [largeurs]
// largeurs : liste séparée par des virgules (par défaut 360,120,48), sur fond clair puis sombre.
import { access, readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const [dessin, planche, largeursDemandees = "360,120,48"] = process.argv.slice(2);
if (!dessin || !planche) {
  console.error("Usage : node .claude/skills/illustration/rendre.mjs <dessin.svg> <planche.png> [largeurs]");
  process.exit(1);
}

const svg = await readFile(dessin, "utf8");
const largeurs = largeursDemandees.split(",").map(Number);
const FONDS = [
  { nom: "clair", couleur: "#F3F8FD", texte: "#1E2A3A" },
  { nom: "sombre", couleur: "#121A24", texte: "#E8EEF5" },
];

const cases = FONDS.flatMap((fond) =>
  largeurs.map((largeur) => `
    <figure style="background:${fond.couleur};color:${fond.texte}">
      <div style="width:${largeur}px">${svg}</div>
      <figcaption>${largeur} px · fond ${fond.nom}</figcaption>
    </figure>`)
).join("");

const page = `<!doctype html><meta charset="utf-8">
<style>
  body { margin: 0; padding: 16px; display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; background: #888; font: 12px system-ui; }
  figure { margin: 0; padding: 12px; border-radius: 8px; display: grid; gap: 6px; justify-items: center; }
  figure svg { width: 100%; height: auto; display: block; }
</style>${cases}`;

// Dans un conteneur cloud, le Chromium préinstallé n'a pas la version attendue par le Playwright du projet.
const CHROMIUM_DU_CONTENEUR = "/opt/pw-browsers/chromium";
const executablePath = await access(CHROMIUM_DU_CONTENEUR).then(() => CHROMIUM_DU_CONTENEUR, () => undefined);
const navigateur = await chromium.launch({ executablePath });
const onglet = await navigateur.newPage({ viewport: { width: 1200, height: 800 }, reducedMotion: "reduce" });
await onglet.setContent(page);
await onglet.screenshot({ path: planche, fullPage: true });
await navigateur.close();
console.log(`Planche écrite : ${planche}`);
