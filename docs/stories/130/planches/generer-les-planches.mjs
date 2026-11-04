// Génère les sources SVG, les contrôles et la planche de #130 (petit train de l'univers : tête et wagon, 6 univers).
// Usage (depuis la racine du dépôt) : node docs/stories/130/planches/generer-les-planches.mjs
// Aucun texte ni chiffre n'est dessiné dans les SVG : l'étiquette est du texte HTML posé sur la plaque (inv. 98-18).
// Le wagon est UN SVG de 120 × 110 découpé en 9 par `border-image-slice` (voir NOTES.md) : le décor est dans les 4 coins.
import { access, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const DOSSIER = new URL(".", import.meta.url).pathname;
const SOURCES = `${DOSSIER}sources/`;
const CONTROLE = `${DOSSIER}controle/`;
await mkdir(SOURCES, { recursive: true });
await mkdir(CONTROLE, { recursive: true });

const ENCRE = "#1B1530";
const ROUE = "#3A2F45";
const JANTE = "#F4EFE6";
const NOMS = {
  animaux: ["Animaux de la forêt", "bois, toit de feuilles, gland"],
  princesse: ["Princesses et fées", "train de conte, couronne, volutes"],
  sports: ["Sports", "maillots, fanion, sans numéro"],
  police: ["Police", "train bleu, écusson rond"],
  pompier: ["Pompiers", "train rouge, cloche, échelle"],
  danse: ["Danse", "manège, note de musique, ruban"],
};
const UNIVERS = Object.keys(NOMS);

// corps = [haut, bas] du dégradé vertical ; plaque = fond du texte ; bande = châssis ; toit = couleur du toit
const P = {
  animaux: { corps: ["#D9A55B", "#B97F3E"], contour: "#6B4423", plaque: "#FFF3DF", toit: "#4FB37A", bande: "#7A4B1F" },
  princesse: { corps: ["#E2B4F0", "#C48BDC"], contour: "#7E56BC", plaque: "#FBF1FF", toit: "#FFC93C", bande: "#E0A92B" },
  sports: { corps: ["#4F8BE6", "#2F6FCF"], contour: "#164BA8", plaque: "#F1F8FF", toit: "#FFFFFF", bande: "#E8604C" },
  police: { corps: ["#6F8BE6", "#5470DA"], contour: "#1F2F82", plaque: "#F3F6FF", toit: "#2B43A8", bande: "#F3F6FF" },
  pompier: { corps: ["#E0523A", "#C2341B"], contour: "#6E1708", plaque: "#FFF1E6", toit: "#A8281A", bande: "#FFC93C" },
  danse: { corps: ["#EBA6DA", "#D68BC8"], contour: "#7A35C8", plaque: "#FFF0F8", toit: "#B96FCB", bande: "#FFFFFF" },
};

const svg = (w, h, corps) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n${corps}\n</svg>\n`;
const degrade = (id, [haut, bas]) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haut}"/><stop offset="1" stop-color="${bas}"/></linearGradient>`;
const trait = (c, l = 3.5) => `stroke="${c}" stroke-width="${l}" stroke-linejoin="round" stroke-linecap="round"`;
const moyeu = (u) => (["#FFFFFF", "#F3F6FF"].includes(P[u].bande) ? "#D9DDEA" : P[u].bande);
const roue = (cx, cy, r, u) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ROUE}" stroke="${JANTE}" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="${moyeu(u)}"/>`;

/* ---- décors de coin du wagon (rien ne dépasse les coins : x < 34 ou x > 86, y < 28 ou y > 80) ---- */
const DECOR_WAGON = {
  animaux: `<!-- gland posé sur le toit, à gauche ; feuilles à droite -->
<path d="M11 6 Q11 0 18 0 Q25 0 25 6 Z" fill="#8A5A2B" ${trait("#5B3A1E", 2.5)}/>
<path d="M12.5 6 Q12.5 15 18 17 Q23.5 15 23.5 6 Z" fill="#F0CF8A" ${trait("#8A5A2B", 2.5)}/>
<ellipse cx="96" cy="8" rx="10" ry="4.5" transform="rotate(-25 96 8)" fill="#6CBF84" ${trait("#2E7E52", 2.5)}/>
<ellipse cx="108" cy="9" rx="9" ry="4" transform="rotate(20 108 9)" fill="#4FB37A" ${trait("#2E7E52", 2.5)}/>`,
  princesse: `<!-- volutes dorées aux deux bouts du toit -->
<path d="M32 13 Q32 2 21 2 Q10 2 10 10 Q10 17 17 17 Q22 17 22 12" fill="none" ${trait("#C9921B", 3.5)}/>
<path d="M88 13 Q88 2 99 2 Q110 2 110 10 Q110 17 103 17 Q98 17 98 12" fill="none" ${trait("#C9921B", 3.5)}/>`,
  sports: `<!-- fanion à gauche, jaune, sans signe dessiné -->
<path d="M14 13 V0" fill="none" ${trait("#164BA8", 3)}/>
<path d="M14 1 L32 5.5 L14 10 Z" fill="#FFC93C" ${trait("#A56F00", 2.5)}/>`,
  police: `<!-- liseré blanc sur le toit, aux deux bouts ; ni lampe ni gyrophare -->
<path d="M8 17 H32 M88 17 H112" fill="none" ${trait("#F3F6FF", 3)}/>`,
  pompier: `<!-- petite échelle dorée posée sur le toit, à gauche -->
<path d="M5 3.5 H32 M5 10.5 H32" fill="none" ${trait("#A56F00", 3)}/>
<path d="M11 3.5 V10.5 M18.5 3.5 V10.5 M26 3.5 V10.5" fill="none" ${trait("#A56F00", 2.5)}/>`,
  danse: `<!-- nœud de ruban à gauche, note de musique à droite -->
<ellipse cx="12" cy="7" rx="8" ry="4.5" transform="rotate(-20 12 7)" fill="#FFFFFF" ${trait("#7A35C8", 2.5)}/>
<ellipse cx="28" cy="7" rx="8" ry="4.5" transform="rotate(20 28 7)" fill="#FFFFFF" ${trait("#7A35C8", 2.5)}/>
<circle cx="20" cy="8" r="4" fill="#F6A5C8" ${trait("#7A35C8", 2.5)}/>
<ellipse cx="97" cy="14" rx="5.5" ry="4" transform="rotate(-20 97 14)" fill="#7A35C8"/>
<path d="M102 13 V0 Q108 3 109 8" fill="none" ${trait("#7A35C8", 3)}/>`,
};

function wagon(u) {
  const c = P[u];
  const id = `w-${u}`;
  return svg(120, 110, `<defs>${degrade(id, c.corps)}</defs>
<!-- roues (dans les coins du bas) -->
${roue(20, 98, 11, u)}${roue(100, 98, 11, u)}
<!-- corps : dégradé vertical, identique sur toute la largeur -->
<rect x="4" y="20" width="112" height="66" rx="8" fill="url(#${id})" ${trait(c.contour)}/>
<!-- châssis et attelages -->
<rect x="4" y="86" width="112" height="6" fill="${c.bande}" ${trait(c.contour, 2.5)}/>
<rect x="0" y="87.5" width="6" height="4" rx="2" fill="${c.contour}"/><rect x="114" y="87.5" width="6" height="4" rx="2" fill="${c.contour}"/>
<!-- toit -->
<rect x="2" y="12" width="116" height="10" rx="5" fill="${c.toit}" ${trait(c.contour, 3)}/>
${DECOR_WAGON[u]}
<!-- plaque claire : le texte de l'étiquette (HTML) se pose dessus ; elle déborde de 4 px sur les bords de la case centrale -->
<rect x="30" y="24" width="60" height="60" rx="4" fill="${c.plaque}" ${trait(c.contour, 2.5)}/>`);
}

/* ---- locomotive (150 × 110, taille fixe, regarde à gauche, cabine à droite, aucun visage) ---- */
const FEUILLES_DE_TOIT = `<ellipse cx="94" cy="9" rx="8" ry="4" transform="rotate(-20 94 9)" fill="#6CBF84" ${trait("#2E7E52", 2.5)}/>
<ellipse cx="108" cy="7" rx="8" ry="4" transform="rotate(15 108 7)" fill="#4FB37A" ${trait("#2E7E52", 2.5)}/>
<ellipse cx="122" cy="7" rx="8" ry="4" transform="rotate(-15 122 7)" fill="#6CBF84" ${trait("#2E7E52", 2.5)}/>
<ellipse cx="136" cy="9" rx="8" ry="4" transform="rotate(20 136 9)" fill="#4FB37A" ${trait("#2E7E52", 2.5)}/>`;
// `sous` est dessiné avant le toit de la cabine, `dessus` après (feuilles, volutes, fanion, échelle, nœud)
const DECOR_TETE = {
  animaux: (c) => ({
    sous: `<!-- planches du corps, gland sur la chaudière, cheminée en pot de bois avec une touffe de feuilles -->
<path d="M8 52 H92 M8 62 H92 M8 72 H92" fill="none" stroke="${c.contour}" stroke-width="2.5" opacity=".45"/>
<path d="M42 56 Q42 50 50 50 Q58 50 58 56 Z" fill="#8A5A2B" ${trait("#5B3A1E", 2.5)}/>
<path d="M43.5 56 Q43.5 70 50 72 Q56.5 70 56.5 56 Z" fill="#F0CF8A" ${trait("#8A5A2B", 2.5)}/>
<rect x="20" y="24" width="20" height="18" rx="3" fill="#B97F3E" ${trait(c.contour, 3.5)}/>
<ellipse cx="24" cy="21" rx="9" ry="4" transform="rotate(-30 24 21)" fill="#6CBF84" ${trait("#2E7E52", 2.5)}/>
<ellipse cx="36" cy="21" rx="9" ry="4" transform="rotate(30 36 21)" fill="#4FB37A" ${trait("#2E7E52", 2.5)}/>`,
    dessus: `<!-- toit de feuilles -->\n${FEUILLES_DE_TOIT}`,
  }),
  princesse: (c) => ({
    sous: `<!-- cheminée en couronne dorée à trois pointes rondes, bande et volute sur la chaudière -->
<path d="M18 40 V22 L24 29 L30 16 L36 29 L42 22 V40 Z" fill="#FFC93C" ${trait("#A8791A", 3.5)}/>
<circle cx="18" cy="20" r="3.2" fill="#FFE08A" ${trait("#A8791A", 2)}/><circle cx="30" cy="14" r="3.2" fill="#FFE08A" ${trait("#A8791A", 2)}/><circle cx="42" cy="20" r="3.2" fill="#FFE08A" ${trait("#A8791A", 2)}/>
<path d="M76 40 V84" fill="none" ${trait("#E0A92B", 6)}/>
<path d="M62 74 Q62 56 48 56 Q35 56 35 67 Q35 76 44 76 Q50 76 50 69" fill="none" ${trait("#C9921B", 3.5)}/>`,
    dessus: `<!-- volutes de toit -->
<path d="M92 14 Q92 4 100 4 Q108 4 108 10 Q108 15 102 15" fill="none" ${trait("#C9921B", 3.5)}/>
<path d="M146 14 Q146 4 138 4 Q130 4 130 10 Q130 15 136 15" fill="none" ${trait("#C9921B", 3.5)}/>`,
  }),
  sports: (c) => ({
    sous: `<!-- bandes de maillot blanche et rouge, cheminée rouge -->
<rect x="48" y="39.5" width="14" height="45" fill="#FFFFFF"/><rect x="64" y="39.5" width="7" height="45" fill="#E8604C"/>
<rect x="20" y="24" width="20" height="18" rx="3" fill="#E8604C" ${trait(c.contour, 3.5)}/>`,
    dessus: `<!-- fanion sur le toit de la cabine -->
<path d="M138 13 V0" fill="none" ${trait("#164BA8", 3)}/>
<path d="M138 1 L120 5.5 L138 10 Z" fill="#FFC93C" ${trait("#A56F00", 2.5)}/>`,
  }),
  police: (c) => ({
    sous: `<!-- écusson rond sans étoile, cheminée marine -->
<circle cx="48" cy="62" r="16" fill="#F3F6FF" ${trait(c.contour, 3.5)}/>
<circle cx="48" cy="62" r="10.5" fill="#3450C8"/>
<circle cx="48" cy="62" r="6" fill="none" stroke="#F3F6FF" stroke-width="2.5"/>
<rect x="20" y="24" width="20" height="18" rx="3" fill="#1F2F82" ${trait(c.contour, 3.5)}/>`,
    dessus: `<!-- liseré blanc sur le toit -->
<path d="M92 17 H110 M126 17 H144" fill="none" ${trait("#F3F6FF", 3)}/>`,
  }),
  pompier: (c) => ({
    sous: `<!-- bande dorée, cloche dorée sur la chaudière (dessinée, elle ne sonne pas), cheminée basse sans fumée -->
<rect x="8" y="72" width="84" height="6" fill="#FFC93C"/>
<rect x="55" y="30" width="6" height="10" fill="#A56F00"/>
<path d="M43 36 Q43 18 58 18 Q73 18 73 36 Z" fill="#FFC93C" ${trait("#A56F00", 3.5)}/>
<rect x="41" y="34" width="34" height="6" rx="3" fill="#F2B41E" ${trait("#A56F00", 3)}/>
<rect x="16" y="30" width="18" height="10" rx="3" fill="#8A2010" ${trait(c.contour, 3.5)}/>
<rect x="14" y="28" width="22" height="4" rx="2" fill="#FFC93C" ${trait("#A56F00", 2)}/>`,
    dessus: `<!-- petite échelle sur le toit de la cabine -->
<path d="M96 3.5 H140 M96 10 H140" fill="none" ${trait("#A56F00", 2.5)}/>
<path d="M104 3.5 V10 M114 3.5 V10 M124 3.5 V10 M134 3.5 V10" fill="none" ${trait("#A56F00", 2.5)}/>`,
  }),
  danse: (c) => ({
    sous: `<!-- note de musique blanche sur la chaudière, cheminée violette nouée d'un ruban -->
<ellipse cx="42" cy="72" rx="9" ry="6.5" transform="rotate(-20 42 72)" fill="#FFFFFF"/>
<path d="M50 70 V46 Q60 50 66 58" fill="none" stroke="#FFFFFF" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="20" y="26" width="18" height="16" rx="3" fill="#B96FCB" ${trait(c.contour, 3.5)}/>
<ellipse cx="22" cy="42" rx="7" ry="3.8" transform="rotate(-15 22 42)" fill="#FFFFFF" ${trait("#7A35C8", 2.2)}/>
<ellipse cx="36" cy="42" rx="7" ry="3.8" transform="rotate(15 36 42)" fill="#FFFFFF" ${trait("#7A35C8", 2.2)}/>
<circle cx="29" cy="42" r="3.4" fill="#F6A5C8" ${trait("#7A35C8", 2.2)}/>`,
    dessus: `<!-- nœud de ruban sur le toit -->
<ellipse cx="100" cy="6" rx="7" ry="4" transform="rotate(-20 100 6)" fill="#FFFFFF" ${trait("#7A35C8", 2.2)}/>
<ellipse cx="114" cy="6" rx="7" ry="4" transform="rotate(20 114 6)" fill="#FFFFFF" ${trait("#7A35C8", 2.2)}/>
<circle cx="107" cy="7" r="3.4" fill="#F6A5C8" ${trait("#7A35C8", 2.2)}/>`,
  }),
};

function tete(u) {
  const c = P[u];
  const id = `t-${u}`;
  const decor = DECOR_TETE[u](c);
  return svg(150, 110, `<defs>${degrade(id, c.corps)}</defs>
<!-- roues -->
${roue(26, 99, 10, u)}${roue(62, 99, 10, u)}${roue(116, 97, 12, u)}
<!-- chaudière et cabine -->
<rect x="6" y="38" width="88" height="48" rx="16" fill="url(#${id})" ${trait(c.contour)}/>
<rect x="90" y="20" width="54" height="66" rx="8" fill="url(#${id})" ${trait(c.contour)}/>
${decor.sous}
<!-- toit de la cabine -->
<rect x="84" y="12" width="66" height="10" rx="5" fill="${c.toit}" ${trait(c.contour, 3)}/>
${decor.dessus}
<!-- fenêtre : un simple carré clair, pas de visage -->
<rect x="104" y="34" width="26" height="24" rx="5" fill="${c.plaque}" ${trait(c.contour, 3)}/>
<!-- châssis et attelage -->
<rect x="6" y="86" width="140" height="6" fill="${c.bande}" ${trait(c.contour, 2.5)}/>
<rect x="144" y="87.5" width="6" height="4" rx="2" fill="${c.contour}"/>`);
}

/* ---- contraste (WCAG) ---- */
const lum = (hex) => {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const rapport = [];
const trop = [];
for (const u of UNIVERS) {
  const c = P[u];
  const texte = contraste(ENCRE, c.plaque);
  const brille = contraste(ENCRE, "#FFF3C4");
  const clair = contraste(c.contour, "#F3F8FD");
  const sombre = contraste(c.corps[1], "#121A24");
  const jante = contraste(JANTE, "#121A24");
  rapport.push(`${u.padEnd(10)} texte ${ENCRE} sur plaque ${c.plaque} : ${texte.toFixed(2)}:1   sur l'étiquette qui brille (#FFF3C4) : ${brille.toFixed(2)}:1   contour ${c.contour} sur fond clair : ${clair.toFixed(2)}:1 ; corps (bas du dégradé ${c.corps[1]}) sur fond sombre : ${sombre.toFixed(2)}:1   jante des roues ${JANTE} sur fond sombre : ${jante.toFixed(2)}:1`);
  if (texte < 4.5) trop.push(`${u} : texte sur plaque ${texte.toFixed(2)}`);
  if (clair < 3) trop.push(`${u} : contour sur fond clair ${clair.toFixed(2)}`);
}
await writeFile(`${CONTROLE}contraste.txt`, `Contraste du texte de l'étiquette sur la plaque du wagon (WCAG, seuil 4,5:1) et du contour du train sur les fonds clair et sombre (élément graphique, seuil 3:1 ; sur fond sombre c'est le corps qui se détache, le contour brun ou marine y reste un trait de finition)\n\n${rapport.join("\n")}\n`);
if (trop.length) console.error("Contraste insuffisant :", trop);

for (const u of UNIVERS) {
  await writeFile(`${SOURCES}tete-${u}.svg`, tete(u));
  await writeFile(`${SOURCES}wagon-${u}.svg`, wagon(u));
}

/* ---- planche ---- */
const uri = (s) => `url('data:image/svg+xml,${encodeURIComponent(s).replace(/'/g, "%27")}')`;
const wagonHtml = (u, texte, style = "") => `<li class="wagon" style="border-image-source:${uri(wagon(u))};${style}">${texte}</li>`;
const teteHtml = (u) => `<li class="tete" aria-hidden="true">${tete(u)}</li>`;
const libre = `<li class="libre"></li>`;
const train = (u, items, largeur) => `<ol class="train" style="width:${largeur}px">${teteHtml(u)}${items.join("")}</ol>`;
const VERS = "Maître Corbeau, sur un arbre perché,";
const colonnes = (u) => [
  [300, train(u, [libre, libre], 300)],
  [260, train(u, [wagonHtml(u, "do")], 260)],
  [360, train(u, ["do", "mi", "no"].map((t) => wagonHtml(u, t)), 360)],
  [360, `<div class="duo">${train(u, [wagonHtml(u, "do")], 360)}<div class="etiquette brille">mi</div></div>`],
  [360, train(u, [wagonHtml(u, VERS, "flex:1 1 100%")], 360)],
];
const CSS = `body{margin:0;padding:16px;background:#F3F8FD;font:13px system-ui,sans-serif;color:#1E2A3A}
.ligne{display:flex;align-items:flex-start;gap:20px;padding:12px 0;border-bottom:1px solid #D5E0EC}
.nom{width:140px;display:grid;gap:2px;flex:none}.nom span{font-size:11px;color:#5A6A7E}
.col{flex:none}
.t{display:flex;gap:20px;padding:0 0 4px 160px;font-weight:700;font-size:12px}.t div{flex:none}
.train{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;align-items:flex-end;gap:0;box-sizing:border-box}
.tete{flex:none;width:150px;height:110px;display:block}.tete svg{display:block}
.wagon{box-sizing:border-box;min-width:104px;min-height:110px;flex:0 1 auto;border-style:solid;border-width:28px 34px 30px 34px;border-image-slice:28 34 30 34 fill;border-image-width:28px 34px 30px 34px;border-image-repeat:stretch;margin:0;padding:0 2px;display:grid;place-items:center;text-align:center;font-weight:700;font-size:20px;line-height:1.3;color:${ENCRE};overflow-wrap:anywhere}
.libre{box-sizing:border-box;width:60px;height:44px;align-self:center;margin-left:8px;border:3px dashed #33304a;border-radius:16px;background:rgba(255,255,255,.6)}
.duo{display:grid;gap:14px;justify-items:start}
.etiquette{box-sizing:border-box;min-width:44px;min-height:44px;padding:8px 16px;border:3px solid #33304a;border-radius:16px;background:#fff;font-size:1.25rem;font-weight:700;color:${ENCRE};display:grid;place-items:center;margin:6px 0 6px 12px}
.brille{background:#fff3c4;box-shadow:0 0 0 6px #ffd23f,0 0 18px 8px #ffd23f}`;
const titres = ["tête du train + places libres", "un wagon accroché (« do »)", "trois wagons, passage à la ligne", "étiquette qui brille après « Je ne sais pas »", "vers long à 360 px (tête seule, puis un wagon pleine largeur)"];
const largeurs = [300, 260, 360, 360, 360];
const html = `<style>${CSS}</style>
<div class="t">${titres.map((t, i) => `<div style="width:${largeurs[i]}px">${t}</div>`).join("")}</div>
${UNIVERS.map((u) => `<div class="ligne"><div class="nom"><b>${NOMS[u][0]}</b><span>${NOMS[u][1]}</span></div>${colonnes(u).map(([w, h]) => `<div class="col" style="width:${w}px">${h}</div>`).join("")}</div>`).join("\n")}`;

const CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = await access(CHROMIUM).then(() => CHROMIUM, () => undefined);
const navigateur = await chromium.launch({ executablePath });
async function photographier(contenu, fichier, largeur, echelle) {
  const onglet = await navigateur.newPage({ viewport: { width: largeur, height: 400 }, deviceScaleFactor: echelle, reducedMotion: "reduce" });
  await onglet.setContent(contenu);
  await onglet.screenshot({ path: fichier, fullPage: true });
  await onglet.close();
}
await photographier(html, `${DOSSIER}ordre-petit-train.png`, 1700, 1);
await photographier(html, `${DOSSIER}ordre-petit-train-x2.png`, 1700, 2);

// contrôles : un train et un vers long, à trois échelles, sur fond clair puis sombre
for (const u of UNIVERS) {
  const fonds = [["#F3F8FD", "#1E2A3A", "clair"], ["#121A24", "#E8EEF5", "sombre"]];
  const cases = fonds.flatMap(([f, t, n]) => [1, 0.5, 0.3].map((e) => `<figure style="background:${f};color:${t};zoom:${e}"><ol class="train" style="width:auto">${teteHtml(u)}${wagonHtml(u, "do")}${wagonHtml(u, "mi")}</ol><ol class="train" style="width:300px">${wagonHtml(u, "Il pleut, il pleut, bergère, presse tes blancs moutons", "flex:1 1 100%")}</ol><figcaption>échelle ${e} · fond ${n}</figcaption></figure>`)).join("");
  const page = `<style>${CSS}body{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;background:#888}figure{margin:0;padding:12px;border-radius:8px;display:grid;gap:6px}</style>${cases}`;
  await photographier(page, `${CONTROLE}train-${u}.png`, 1200, 1);
}
await navigateur.close();
