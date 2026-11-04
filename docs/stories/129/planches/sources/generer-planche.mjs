// Génère la planche du parchemin des 6 univers (#129) : SVG + PNG.
// Usage : node docs/stories/129/planches/sources/generer-planche.mjs
// Le texte est posé PAR-DESSUS les dessins (éléments <text> séparés) : aucun texte dans les dessins.
import { access, readFile, writeFile, mkdir } from "node:fs/promises";
import { chromium } from "/home/user/github-move/node_modules/@playwright/test/index.mjs";

const DOSSIER = new URL("..", import.meta.url).pathname;
const ANDIKA = (await readFile("/home/user/github-move/node_modules/@fontsource/andika/files/andika-latin-400-normal.woff2")).toString("base64");
const FONT_CSS = `@font-face{font-family:Andika;src:url(data:font/woff2;base64,${ANDIKA}) format("woff2");}`;

// ---------- Texte d'exemple : « Le petit chat Plume » (app/bibliotheque.json, fr-cp-lecture-petit-chat) ----------
const TITRE = "Le petit chat Plume";
const PHRASES = [
  "Plu-me est un pe-tit chat gris.",
  "Il dort sur le lit de Lé-a.",
  "Un ma-tin, Plu-me voit u-ne sou-ris.",
  "Il sau-te du lit, mais la sou-ris fi-le dans son trou.",
  "Plu-me est dé-çu.",
  "A-lors Lé-a lui don-ne du lait, et Plu-me ron-ron-ne.",
];
const MOT_SURLIGNE = { phrase: 1, mot: 1 }; // « dort »
const PHRASES_VISIBLES_A_MI = 2;
const mots = PHRASES.flatMap((p, ip) => p.split(" ").map((m, im) => ({ syllabes: m.split("-"), phrase: ip, im })));
let parite = 0;
for (const m of mots) m.syllabes = m.syllabes.map((s) => ({ s, parite: parite++ % 2 }));
for (const m of mots) m.entier = m.syllabes.map((x) => x.s).join("");

// ---------- Mesures ----------
const W = 330; // largeur du parchemin dans un écran de 360 px (15 px de marge de chaque côté)
const NORMAL = { famille: "DejaVu Sans, Liberation Sans, sans-serif", taille: 20, interligne: 30, lettre: 0, mot: 0 };
const DYS = { famille: "Andika, sans-serif", taille: 20, interligne: 38, lettre: 1.6, mot: 6 };
const TITRE_STYLE = { taille: 21, interligne: 34 };

// ---------- Les 6 univers ----------
const SYL = { bleue: "#1d4ed8", rouge: "#b42318" };
const U = {
  animaux: { nom: "Animaux de la forêt", Ht: 46, Hb: 44, padL: 32, padR: 32, fond: "#E9F7DE", surligne: "#C8E8B0", texte: "#1F3324", titre: "#245A38", dessin: dessinAnimaux },
  princesse: { nom: "Princesses et fées", Ht: 40, Hb: 40, padL: 40, padR: 40, fond: "#FFF6E2", surligne: "#F9D9EA", texte: "#3B2A1E", titre: "#7C2690", dessin: dessinPrincesse },
  sports: { nom: "Sports", Ht: 30, Hb: 46, padL: 30, padR: 72, fond: "#FFFFFF", surligne: "#D3E4FF", texte: "#1B2A4A", titre: "#164BA8", dessin: dessinSports },
  police: { nom: "Police", Ht: 44, Hb: 52, padL: 32, padR: 32, fond: "#F2F5FF", surligne: "#D6DEFF", texte: "#1B2350", titre: "#253B9C", dessin: dessinPolice },
  pompier: { nom: "Pompiers", Ht: 62, Hb: 30, padL: 32, padR: 32, fond: "#FFF8F1", surligne: "#FFDCCB", texte: "#3A1F18", titre: "#931F0C", dessin: dessinPompier },
  danse: { nom: "Danse", Ht: 74, Hb: 66, padL: 34, padR: 34, fond: "#FFFCF6", surligne: "#EBD6FA", texte: "#2B1740", titre: "#5A1F9E", dessin: dessinDanse },
};

// Chaque dessin reçoit (id, hauteur du milieu) et rend { fixeHaut, milieu(h), fixeBas } en coordonnées locales :
// haut à y=0, milieu de y=Ht à y=Ht+h, bas à y=Ht+h. Aucun <text>.
function degrade(id, c1, c2) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
}
const gs = (id) => `url(#${id})`;

function dessinAnimaux(id, u, h) {
  const bord = "#3F9A63", nerv = "#9CCF8B";
  const Ht = u.Ht, y1 = Ht + h;
  const veines = [];
  for (let y = Ht + 14; y < y1 - 8; y += 30) {
    veines.push(`<path d="M12 ${y}l9 -7M${W - 12} ${y}l-9 -7" stroke="${nerv}" stroke-width="3" stroke-linecap="round"/>`);
  }
  return `<defs>${degrade(id + "f", "#F1FAE6", u.fond)}</defs>
<g>
<path d="M6 ${Ht} L6 ${y1} L${W - 6} ${y1} L${W - 6} ${Ht}Z" fill="${u.fond}" stroke="none"/>
<path d="M6 ${Ht - 2} V${y1 + 2}M${W - 6} ${Ht - 2} V${y1 + 2}" stroke="${bord}" stroke-width="4" stroke-linecap="round"/>
${veines.join("")}
<path d="M6 ${Ht + 1} Q50 18 ${W / 2} 10 Q${W - 50} 18 ${W - 6} ${Ht + 1}Z" fill="${gs(id + "f")}" stroke="none"/>
<path d="M6 ${Ht + 2} Q50 18 ${W / 2} 10 Q${W - 50} 18 ${W - 6} ${Ht + 2}" fill="none" stroke="${bord}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M${W / 2} 11 Q${W / 2 + 2} 0 ${W / 2 + 16} -6" fill="none" stroke="#8A5A33" stroke-width="6" stroke-linecap="round"/>
<path d="M12 ${Ht - 8}q10 -10 24 -14M${W - 12} ${Ht - 8}q-10 -10 -24 -14" fill="none" stroke="${nerv}" stroke-width="3" stroke-linecap="round"/>
<path d="M6 ${y1 - 1} Q20 ${y1 + 36} ${W / 2} ${y1 + 40} Q${W - 20} ${y1 + 36} ${W - 6} ${y1 - 1}Z" fill="${u.fond}" stroke="none"/>
<path d="M6 ${y1 - 2} Q20 ${y1 + 36} ${W / 2} ${y1 + 40} Q${W - 20} ${y1 + 36} ${W - 6} ${y1 - 2}" fill="none" stroke="${bord}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30 ${y1 + 14} Q${W / 2} ${y1 + 44} ${W - 30} ${y1 + 14} Q${W / 2} ${y1 + 28} 30 ${y1 + 14}Z" fill="#7CC38A" stroke="#3F9A63" stroke-width="2.5" stroke-linejoin="round"/>
</g>`;
}

function dessinPrincesse(id, u, h) {
  const y1 = u.Ht + h, or1 = "#FBE9B0", or2 = "#E9C566", cont = "#B58B2A", rose = "#F5A9D2", rosec = "#C9669A";
  const rouleau = (y) => `<g>
<rect x="6" y="${y}" width="${W - 12}" height="24" rx="12" fill="${gs(id + "o")}" stroke="${cont}" stroke-width="3.5"/>
<circle cx="8" cy="${y + 12}" r="12" fill="${or1}" stroke="${cont}" stroke-width="3.5"/><circle cx="${W - 8}" cy="${y + 12}" r="12" fill="${or1}" stroke="${cont}" stroke-width="3.5"/>
<circle cx="8" cy="${y + 12}" r="4.5" fill="${or2}"/><circle cx="${W - 8}" cy="${y + 12}" r="4.5" fill="${or2}"/>
<ellipse cx="${W / 2 - 30}" cy="${y + 7}" rx="40" ry="3" fill="#fff" opacity=".6"/></g>`;
  return `<defs>${degrade(id + "o", or1, or2)}</defs>
<g>
<rect x="20" y="${u.Ht - 6}" width="${W - 40}" height="${h + 12}" fill="${u.fond}" stroke="#E6C77A" stroke-width="2.5"/>
${rouleau(8)}${rouleau(y1 + 4)}
<g transform="translate(${W - 32} 20)"><path d="M0 0 C-12 -10 -18 -2 -14 6 C-10 12 -2 8 0 0Z" fill="${rose}" stroke="${rosec}" stroke-width="2.5" stroke-linejoin="round" transform="translate(-4 0)"/>
<path d="M0 0 C12 -10 18 -2 14 6 C10 12 2 8 0 0Z" fill="${rose}" stroke="${rosec}" stroke-width="2.5" stroke-linejoin="round" transform="translate(4 0)"/>
<path d="M-3 4 Q-8 20 -12 30L-4 26L0 32Z M3 4 Q8 18 12 28L4 26L0 32Z" fill="${rose}" stroke="${rosec}" stroke-width="2.5" stroke-linejoin="round" transform="translate(0 4)"/>
<circle cx="0" cy="2" r="4.5" fill="#F58AB8" stroke="${rosec}" stroke-width="2.5"/></g>
</g>`;
}

function dessinSports(id, u, h) {
  const y1 = u.Ht + h, cadre = "#1F63D8", fonce = "#164BA8", L = 6, R = W - 46;
  return `<defs>${degrade(id + "c", "#4C8FF5", cadre)}</defs>
<g>
<rect x="${L}" y="4" width="${R - L}" height="${y1 - 4 + 16}" rx="22" fill="${gs(id + "c")}" stroke="${fonce}" stroke-width="3.5"/>
<rect x="${L + 12}" y="16" width="${R - L - 24}" height="${y1 - 16 + 4}" rx="12" fill="${u.fond}" stroke="${fonce}" stroke-width="2"/>
<rect x="${L + 36}" y="${y1 + 24}" width="${R - L - 72}" height="12" rx="6" fill="${fonce}" stroke="${fonce}" stroke-width="2"/>
<rect x="${L + 70}" y="${y1 + 12}" width="46" height="12" rx="6" fill="#E8604C" stroke="#9E3322" stroke-width="2.5"/>
<circle cx="${R - 8}" cy="16" r="4.5" fill="#E8F0FF" stroke="${fonce}" stroke-width="2"/>
<path d="M${R - 8} 18 Q${R + 16} 18 ${W - 22} 52" fill="none" stroke="${cadre}" stroke-width="3" stroke-linecap="round"/>
<g transform="translate(${W - 24} 60) rotate(-20)"><rect x="-20" y="-6" width="20" height="12" rx="3" fill="#F5C242" stroke="#8A5A10" stroke-width="2.5"/><circle cx="2" cy="0" r="11" fill="#FFD25A" stroke="#8A5A10" stroke-width="2.5"/><circle cx="2" cy="0" r="4" fill="#fff" stroke="#8A5A10" stroke-width="2"/><circle cx="2" cy="-12" r="3.5" fill="none" stroke="#8A5A10" stroke-width="2.5"/></g>
</g>`;
}

function dessinPolice(id, u, h) {
  const y1 = u.Ht + h, cov = "#3450C8", fonce = "#253B9C";
  const anneaux = [];
  for (let x = 28; x < W - 20; x += 28) {
    anneaux.push(`<rect x="${x - 5}" y="8" width="10" height="28" rx="5" fill="#E4EAFF" stroke="${fonce}" stroke-width="2.5"/>`);
  }
  return `<defs>${degrade(id + "c", "#5470E2", cov)}</defs>
<g>
<rect x="4" y="14" width="${W - 8}" height="${y1 - 14 + 28}" rx="16" fill="${gs(id + "c")}" stroke="${fonce}" stroke-width="3.5"/>
<rect x="16" y="26" width="${W - 32}" height="${y1 - 26 + 12}" rx="6" fill="${u.fond}" stroke="${fonce}" stroke-width="2"/>
${anneaux.join("")}
<g transform="translate(${W - 50} ${y1 + 10})"><circle cx="0" cy="0" r="13" fill="#D8ECFF" stroke="#162662" stroke-width="4"/><path d="M-7 -4 Q-5 -9 0 -9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M10 10 L24 24" stroke="#162662" stroke-width="7" stroke-linecap="round"/></g>
</g>`;
}

function dessinPompier(id, u, h) {
  const y1 = u.Ht + h, cov = "#EF8F7F", fonce = "#931F0C";
  const points = [];
  for (let x = 24; x < W - 20; x += 14) points.push(x);
  return `<defs>${degrade(id + "c", "#F6A89A", cov)}${degrade(id + "h", "#FFE08A", "#FFC93C")}</defs>
<g>
<rect x="4" y="4" width="${W - 8}" height="${y1 - 4 + 20}" rx="16" fill="${gs(id + "c")}" stroke="${fonce}" stroke-width="3.5"/>
<rect x="16" y="${u.Ht - 8}" width="${W - 32}" height="${h + 8 + 6}" rx="5" fill="${u.fond}" stroke="${fonce}" stroke-width="2"/>
<path d="M22 ${u.Ht - 14} H${W - 22}" stroke="#FFD9CF" stroke-width="3" stroke-dasharray="8 7" stroke-linecap="round"/>
<g transform="translate(${W / 2} 6)">
<path d="M-28 36 Q-28 8 0 8 Q28 8 28 36Z" fill="${gs(id + "h")}" stroke="${fonce}" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M-4 9 Q-4 22 -4 36 H4 Q4 22 4 9Z" fill="#F0A818" stroke="${fonce}" stroke-width="2" stroke-linejoin="round"/>
<path d="M-38 36 H38 Q41 44 30 45 H-30 Q-41 44 -38 36Z" fill="#F0A818" stroke="${fonce}" stroke-width="3.5" stroke-linejoin="round"/>
<circle cx="0" cy="25" r="5.5" fill="#E8604C" stroke="${fonce}" stroke-width="2"/></g>
</g>`;
}

function dessinDanse(id, u, h) {
  const y1 = u.Ht + h, tr = "#7A35C8", fonce = "#5A1F9E";
  const portee = (y, x0) => [0, 1, 2, 3, 4].map((i) => `<path d="M${x0} ${y + i * 7}H${W - 22}" stroke="${tr}" stroke-width="1.8" stroke-linecap="round"/>`).join("");
  const note = (x, y, tige) => `<g><ellipse cx="${x}" cy="${y}" rx="6.5" ry="4.8" transform="rotate(-20 ${x} ${y})" fill="${fonce}"/><path d="M${x + 5.5} ${y - 1.5}V${y + tige}" stroke="${fonce}" stroke-width="2" stroke-linecap="round"/></g>`;
  const clef = `<path d="M17 2 C25 8 24 17 15 21 C4 26 2 37 12 38 C21 39 22 29 14 28 M16 -2 V45 C16 52 6 52 6 46" fill="none" stroke="${fonce}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" transform="translate(22 6) scale(.95)"/>`;
  return `<defs>${degrade(id + "p", "#FFFFFF", u.fond)}</defs>
<g>
<rect x="6" y="4" width="${W - 12}" height="${y1 - 4 + 58}" rx="14" fill="${u.fond}" stroke="#C79BD0" stroke-width="3"/>
${portee(22, 22)}${clef}
${note(120, 36, 22)}${note(160, 29, 22)}${note(206, 22, 22)}${note(250, 29, 22)}
<path d="M${W - 22} 22V50" stroke="${tr}" stroke-width="3"/>
${portee(y1 + 14, 22)}
${note(100, y1 + 38, -22)}${note(146, y1 + 31, -22)}${note(194, y1 + 24, -22)}
<path d="M${W - 30} ${y1 + 14}V${y1 + 42}M${W - 22} ${y1 + 14}V${y1 + 42}" stroke="${tr}" stroke-width="3"/>
</g>`;
}

// ---------- Couleurs et contrastes ----------
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// ---------- Navigateur pour mesurer ----------
const CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = await access(CHROMIUM).then(() => CHROMIUM, () => undefined);
const navigateur = await chromium.launch({ executablePath });
const onglet = await navigateur.newPage({ viewport: { width: 1200, height: 800 } });
await onglet.setContent(`<style>${FONT_CSS}</style><body></body>`);
await onglet.evaluate(() => document.fonts.load("20px Andika"));
const largeur = (texte, police, gras = false) => onglet.evaluate(([t, p, g]) => {
  const s = document.createElement("span");
  s.style.cssText = `position:absolute;white-space:pre;font:${g ? "700 " : ""}${p.taille}px ${p.famille};letter-spacing:${p.lettre}px`;
  s.textContent = t; document.body.append(s);
  const w = s.getBoundingClientRect().width; s.remove(); return w;
}, [texte, police, gras]);

async function disposer(u, police) {
  const largeurTexte = W - u.padL - u.padR;
  const espace = (await largeur(" ", police)) + police.mot;
  for (const m of mots) {
    m.largeurs = [];
    for (const sy of m.syllabes) m.largeurs.push(await largeur(sy.s, police));
    m.w = m.largeurs.reduce((a, b) => a + b, 0);
  }
  const lignes = [[]]; let x = 0;
  for (const m of mots) {
    const besoin = (lignes.at(-1).length ? espace : 0) + m.w;
    if (lignes.at(-1).length && x + besoin > largeurTexte) { lignes.push([]); x = 0; }
    const debut = lignes.at(-1).length ? x + espace : 0;
    lignes.at(-1).push({ m, x: debut });
    x = debut + m.w;
  }
  return lignes;
}

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function motSvg(u, police, dys, { m, x }, yBase, surligne) {
  const px = u.padL + x;
  const fond = surligne ? `<rect x="${px - 3}" y="${yBase - police.taille * 0.95}" width="${m.w + 6}" height="${police.taille * 1.35}" rx="6" fill="${u.surligne}"/>` : "";
  let cx = px;
  const spans = m.syllabes.map((sy, i) => {
    const t = `<tspan x="${cx}" fill="${dys ? (sy.parite ? SYL.rouge : SYL.bleue) : u.texte}">${esc(sy.s)}</tspan>`;
    cx += m.largeurs[i]; return t;
  }).join("");
  return fond + `<text y="${yBase}" font-family="${police.famille}" font-size="${police.taille}" letter-spacing="${police.lettre}" xml:space="preserve">${spans}</text>`;
}

// ---------- Une case : un parchemin dans un écran de 360 px ----------
async function cellule(cle, etat, idx) {
  const u = U[cle], dys = etat === "dys", police = dys ? DYS : NORMAL, id = `${cle}-${etat}-${idx}`;
  const lignes = etat === "roule" ? [] : await disposer(u, police);
  const hTitre = TITRE_STYLE.interligne + 8;
  const hTexte = lignes.length * police.interligne;
  const hCorpsComplet = hTitre + hTexte + 6;
  let hCorpsDessine = hCorpsComplet, derniereLigneVisible = lignes.length - 1;
  if (etat === "mi") {
    derniereLigneVisible = lignes.findLastIndex((l) => l.some(({ m }) => m.phrase < PHRASES_VISIBLES_A_MI));
    hCorpsDessine = hTitre + (derniereLigneVisible + 1) * police.interligne + 6;
  }
  if (etat === "roule") hCorpsDessine = hTitre;
  const dessin = u.dessin(id, u, hCorpsDessine);
  const MARGE_HAUT = 18, MARGE = 15;
  const yTitre = MARGE_HAUT + u.Ht + TITRE_STYLE.taille + 8;
  let texte = `<text x="${u.padL}" y="${yTitre}" font-family="${dys ? DYS.famille : NORMAL.famille}" font-size="${TITRE_STYLE.taille}" font-weight="700" letter-spacing="${dys ? DYS.lettre : 0}" fill="${u.titre}">${esc(TITRE)}</text>`;
  texte = texte.replace(`<text x="${u.padL}" y="${yTitre}"`, `<text x="${u.padL}" y="${yTitre - MARGE_HAUT}" transform="translate(0 ${MARGE_HAUT})"`);
  const corps = [];
  lignes.forEach((ligne, i) => {
    if (etat === "mi" && i > derniereLigneVisible) return;
    const yBase = u.Ht + hTitre + i * police.interligne + police.interligne * 0.68;
    for (const mot of ligne) {
      if (etat === "mi" && mot.m.phrase >= PHRASES_VISIBLES_A_MI) continue;
      const sur = (etat === "mi" || etat === "ouvert" || etat === "dys" || etat === "sombre") && mot.m.phrase === MOT_SURLIGNE.phrase && mot.m.im === MOT_SURLIGNE.mot && etat === "mi";
      corps.push(motSvg(u, police, dys, mot, yBase, sur));
    }
  });
  const hObjet = u.Ht + hCorpsDessine + u.Hb;
  const hReserve = u.Ht + hCorpsComplet + u.Hb;
  const hTotal = MARGE_HAUT + (etat === "mi" ? hReserve : hObjet) + 18;
  const fondEcran = etat === "sombre" ? "#121A24" : "#F3F8FD";
  const reserve = etat === "mi" ? `<rect x="10" y="${MARGE_HAUT + hObjet + 2}" width="${W - 20}" height="${hReserve - hObjet - 4}" rx="14" fill="none" stroke="#8AA0B8" stroke-width="2" stroke-dasharray="7 7"/>` : "";
  const svg = `<g><rect x="0" y="0" width="360" height="${hTotal}" rx="10" fill="${fondEcran}" stroke="#B9C7D8" stroke-width="1"/>
<g transform="translate(15 0)">${reserve}<g transform="translate(0 ${MARGE_HAUT})">${dessin}</g>
<g transform="translate(0 ${MARGE_HAUT})">
<text x="${u.padL}" y="${TITRE_STYLE.taille + u.Ht + 8}" font-family="${dys ? DYS.famille : NORMAL.famille}" font-size="${TITRE_STYLE.taille}" font-weight="700" letter-spacing="${dys ? DYS.lettre : 0}" fill="${u.titre}">${esc(TITRE)}</text>
${corps.join("\n")}</g></g></g>`;
  return { svg, h: hTotal };
}

// ---------- Planche ----------
const ETATS = [
  ["roule", "roulé (titre seul)"], ["mi", "en cours de déroulement"], ["ouvert", "déroulé"],
  ["dys", "déroulé, mode dys (Andika)"], ["sombre", "déroulé, fond sombre"],
];
const ordre = Object.keys(U);
const COL0 = 210, PAS = 380;
let y = 56; const blocs = []; const sources = [];
for (const cle of ordre) {
  const cases = [];
  for (const [etat] of ETATS) cases.push({ etat, ...(await cellule(cle, etat, 0)) });
  const hRang = Math.max(...cases.map((c) => c.h));
  blocs.push(`<text x="14" y="${y + 40}" font-family="system-ui,sans-serif" font-size="17" font-weight="700" fill="#1E2A3A">${U[cle].nom}</text>`);
  cases.forEach((c, i) => {
    blocs.push(`<g transform="translate(${COL0 + i * PAS} ${y})">${c.svg}</g>`);
    sources.push([`parchemin-${cle}-${c.etat}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${c.h}" width="360" height="${c.h}"><style>${FONT_CSS}</style>${c.svg}</svg>`]);
  });
  y += hRang + 24;
}
const entetes = ETATS.map(([, libelle], i) => `<text x="${COL0 + i * PAS + 180}" y="30" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="#1E2A3A">${libelle}</text>`).join("");
const largeurPlanche = COL0 + ETATS.length * PAS;
const planche = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largeurPlanche} ${y}" width="${largeurPlanche}" height="${y}"><style>${FONT_CSS}</style><rect width="100%" height="100%" fill="#FFFFFF"/>${entetes}${blocs.join("\n")}</svg>`;
await mkdir(`${DOSSIER}sources`, { recursive: true });
await writeFile(`${DOSSIER}parchemin.svg`, planche);
for (const [nom, contenu] of sources) await writeFile(`${DOSSIER}sources/${nom}`, contenu);

// Contrastes
const lignesContraste = [];
for (const cle of ordre) {
  const u = U[cle];
  const paires = [["texte/fond", u.texte, u.fond], ["texte/mot surligné", u.texte, u.surligne], ["titre/fond", u.titre, u.fond],
    ["syllabe bleue/fond", SYL.bleue, u.fond], ["syllabe rouge/fond", SYL.rouge, u.fond], ["syllabe bleue/surligné", SYL.bleue, u.surligne], ["syllabe rouge/surligné", SYL.rouge, u.surligne]];
  for (const [nom, a, b] of paires) lignesContraste.push(`${u.nom}\t${nom}\t${a} sur ${b}\t${ratio(a, b).toFixed(2)}`);
}
await writeFile(`${DOSSIER}sources/contrastes.txt`, lignesContraste.join("\n") + "\n");

for (const [facteur, nom] of [[1, "parchemin.png"], [2, "parchemin-x2.png"]]) {
  const p = await navigateur.newPage({ viewport: { width: largeurPlanche, height: y }, deviceScaleFactor: facteur });
  await p.setContent(`<style>body{margin:0}</style>${planche}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${DOSSIER}${nom}`, fullPage: true });
  await p.close();
}
await navigateur.close();
console.log(lignesContraste.join("\n"));
