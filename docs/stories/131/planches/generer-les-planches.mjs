// Génère les sources SVG, les contrôles et les planches de #131 (boîte à jetons et jauge du schéma en barres).
// Usage (depuis la racine du dépôt) : node docs/stories/131/planches/generer-les-planches.mjs
// Les textes (nombre, « ? ») ne sont dessinés que pour la planche : dans l'application ils sont du texte HTML (inv. 98-18).
import { access, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const DOSSIER = new URL(".", import.meta.url).pathname;
const SOURCES = `${DOSSIER}sources/`;
const CONTROLE = `${DOSSIER}controle/`;
await mkdir(SOURCES, { recursive: true });
await mkdir(CONTROLE, { recursive: true });

const ORANGE = "#FF922B"; // --jeton-cinquieme : marque commune aux 6 univers
const ENCRE = "#1B1530";
const NOMS = {
  animaux: ["Animaux de la forêt", "panier, gland, tige"],
  princesse: ["Princesses et fées", "boîte ronde, petite fleur, ruban"],
  sports: ["Sports", "sac de sport, plot, tube"],
  police: ["Police", "boîte à écusson, casquette, bande"],
  pompier: ["Pompiers", "bac de la caserne, casque, tuyau"],
  danse: ["Danse", "boîte à musique, chausson, ruban"],
};
const UNIVERS = Object.keys(NOMS);

const svg = (viewBox, corps, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${extra}>\n${corps}\n</svg>\n`;
const grad = (id, clair, fonce) =>
  `<radialGradient id="${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${clair}"/><stop offset="1" stop-color="${fonce}"/></radialGradient>`;

/* ------------------------------------------------------------------ JETONS (viewBox 0 0 100 100) */
// Pastille ronde mate, même forme et même taille partout ; l'objet de l'univers est posé au centre (rayon 28 au plus).
const PASTILLES = {
  animaux: { fond: "#FFF3DF", contour: "#8A5A2B" },
  princesse: { fond: "#F5E8FF", contour: "#8E5CC4" },
  sports: { fond: "#E3F2FF", contour: "#2F6FCF" },
  police: { fond: "#E6ECFF", contour: "#3450C8" },
  pompier: { fond: "#FFEBDD", contour: "#B5301A" },
  danse: { fond: "#FDE8F4", contour: "#A24A9A" },
};
const OBJETS_DE_JETON = {
  animaux: `<!-- gland -->
<path d="M36 52 Q36 74 50 78 Q64 74 64 52 Z" fill="#F0CF8A" stroke="#8A5A2B" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M32 52 Q32 36 50 36 Q68 36 68 52 Z" fill="#B07A45" stroke="#6B4423" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M50 36 V28" stroke="#6B4423" stroke-width="4" stroke-linecap="round"/>`,
  princesse: `<!-- petite fleur -->
<g fill="#FFFFFF" stroke="#D0589A" stroke-width="3">
<circle cx="50" cy="32" r="10"/><circle cx="68" cy="45" r="10"/><circle cx="61" cy="66" r="10"/><circle cx="39" cy="66" r="10"/><circle cx="32" cy="45" r="10"/></g>
<circle cx="50" cy="52" r="9" fill="#FFC93C" stroke="#C9921B" stroke-width="2.5"/>`,
  sports: `<!-- petit plot d'entraînement -->
<rect x="28" y="66" width="44" height="9" rx="4.5" fill="#C23B2A" stroke="#7A1F14" stroke-width="3" stroke-linejoin="round"/>
<path d="M38 66 L46 28 Q50 24 54 28 L62 66 Z" fill="#E8604C" stroke="#7A1F14" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M41.5 50 H58.5" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`,
  police: `<!-- casquette de police, sans étoile -->
<path d="M30 56 Q30 32 52 32 Q72 32 72 56 Z" fill="#3450C8" stroke="#1B2A78" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M30 56 H72 V63 H30 Z" fill="#1B2A78" stroke="#1B2A78" stroke-width="3" stroke-linejoin="round"/>
<path d="M62 62 Q84 62 84 70 Q60 72 40 66 Z" fill="#253B9C" stroke="#1B2A78" stroke-width="3" stroke-linejoin="round"/>
<circle cx="51" cy="47" r="5" fill="#E6ECFF"/>`,
  pompier: `<!-- casque jaune mat -->
<path d="M24 66 Q24 30 50 30 Q76 30 76 66 Z" fill="#FFC93C" stroke="#A56F00" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M18 66 H82 Q82 74 74 74 H26 Q18 74 18 66 Z" fill="#F2B41E" stroke="#A56F00" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M50 30 V20" stroke="#A56F00" stroke-width="5" stroke-linecap="round"/>
<path d="M50 30 V62" stroke="#E5A71A" stroke-width="5" stroke-linecap="round"/>`,
  danse: `<!-- chausson de danse -->
<path d="M26 60 Q26 40 44 40 Q58 40 64 54 Q80 56 80 66 Q80 74 70 74 H34 Q26 74 26 60 Z" fill="#F6A5C8" stroke="#B0457F" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M40 48 Q50 58 62 56" fill="none" stroke="#B0457F" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="38" cy="66" rx="6" ry="4" fill="#FAC8DD"/>`,
};
function jeton(u, { cinquieme = false } = {}) {
  const p = PASTILLES[u];
  const anneau = cinquieme
    ? `<circle cx="50" cy="50" r="42" fill="${p.fond}" stroke="${ORANGE}" stroke-width="12"/>\n<circle cx="50" cy="50" r="36" fill="none" stroke="${p.contour}" stroke-width="2.5"/>`
    : `<circle cx="50" cy="50" r="42" fill="${p.fond}" stroke="${p.contour}" stroke-width="5"/>`;
  return svg("0 0 100 100", `<!-- pastille ronde mate -->\n${anneau}\n${OBJETS_DE_JETON[u]}`);
}

/* ------------------------------------------------------------------ BOÎTES (viewBox 0 0 288 250) */
// Taille fixe : dessus du couvercle 6, corps fermé 72 à 246. Ouverte : fond 54, zone des jetons 58 à 204, rebord avant 204 à 246.
const LEVIER = 18; // décalage du fond de la boîte ouverte (vue de dessus)
const BOITES = {
  animaux: {
    corps: "M26 72 H262 L250 236 Q248 246 238 246 H50 Q40 246 38 236 Z",
    c: ["#F3D08F", "#D9A55B"], contour: "#7A4B1F", interieur: "#8F6232", couvercle: ["#F7DCA6", "#E2B567"],
    couvercleFerme: `<rect x="20" y="46" width="248" height="34" rx="12"/>`,
    decorCouvercleFerme: `<circle cx="144" cy="36" r="13" fill="#E2B567" stroke="#7A4B1F" stroke-width="4"/><path d="M60 62 H228" stroke="#7A4B1F" stroke-width="3" stroke-linecap="round" opacity=".55"/>`,
    decorCouvercleOuvert: `<circle cx="144" cy="22" r="11" fill="#E2B567" stroke="#7A4B1F" stroke-width="4"/>`,
    decorCorps: [100, 128, 156, 184, 212, 232].map((y) => `<path d="M30 ${y} Q144 ${y + 8} 258 ${y}" fill="none" stroke="#7A4B1F" stroke-width="3" opacity=".5"/>`).join(""),
    decorRebord: [218, 234].map((y) => `<path d="M30 ${y} Q144 ${y + 8} 258 ${y}" fill="none" stroke="#7A4B1F" stroke-width="3" opacity=".5"/>`).join(""),
  },
  princesse: {
    corps: "M26 72 H262 V222 Q262 246 238 246 H50 Q26 246 26 222 Z",
    c: ["#F2D9FA", "#CE97E3"], contour: "#7E56BC", interieur: "#9C6FC9", couvercle: ["#F6E4FC", "#DDB0EE"],
    couvercleFerme: `<rect x="16" y="46" width="256" height="34" rx="17"/>`,
    decorCouvercleFerme: [86, 144, 202].map((x) => fleur(x, 63, 0.55)).join(""),
    decorCouvercleOuvert: [96, 144, 192].map((x) => fleur(x, 28, 0.5)).join(""),
    decorCorps: [80, 144, 208].map((x) => fleur(x, 160, 0.8)).join(""),
    decorRebord: [80, 144, 208].map((x) => fleur(x, 226, 0.55)).join(""),
  },
  sports: {
    corps: "M18 72 H270 V204 Q270 246 228 246 H60 Q18 246 18 204 Z",
    c: ["#6FA6F0", "#2F6FCF"], contour: "#164BA8", interieur: "#1B3F86", couvercle: ["#8DB9F5", "#3F7FE0"],
    avant: `<path d="M96 48 Q96 12 144 12 Q192 12 192 48" fill="none" stroke="#164BA8" stroke-width="10" stroke-linecap="round"/>`,
    couvercleFerme: `<path d="M16 60 Q16 40 40 40 H248 Q272 40 272 60 V84 Q272 112 244 112 H44 Q16 112 16 84 Z"/>`,
    decorCouvercleFerme: `<path d="M144 40 V112" stroke="#FFFFFF" stroke-width="12" opacity=".9"/><circle cx="144" cy="106" r="9" fill="#FFFFFF" stroke="#164BA8" stroke-width="4"/>`,
    decorCouvercleOuvert: `<path d="M144 8 V52" stroke="#FFFFFF" stroke-width="12" opacity=".9"/>`,
    decorCorps: `<rect x="18" y="150" width="252" height="24" fill="#FFFFFF" opacity=".9"/>`,
    decorRebord: `<rect x="18" y="214" width="252" height="14" fill="#FFFFFF" opacity=".9"/>`,
  },
  police: {
    corps: "M24 72 H264 V232 Q264 246 250 246 H38 Q24 246 24 232 Z",
    c: ["#8AA2DA", "#3450C8"], contour: "#1F2F82", interieur: "#243B9A", couvercle: ["#6F8BE0", "#2B43A8"],
    couvercleFerme: `<rect x="14" y="46" width="260" height="34" rx="10"/>`,
    decorCouvercleFerme: `<rect x="110" y="30" width="68" height="20" rx="10" fill="#2B43A8" stroke="#1F2F82" stroke-width="4"/><path d="M34 63 H254" stroke="#E6ECFF" stroke-width="6" stroke-linecap="round"/>`,
    decorCouvercleOuvert: `<path d="M50 30 H238" stroke="#E6ECFF" stroke-width="6" stroke-linecap="round"/>`,
    // écusson : un bouclier uni, sans étoile
    decorCorps: `<path d="M144 110 L184 122 V166 Q184 196 144 214 Q104 196 104 166 V122 Z" fill="#F3F6FF" stroke="#1F2F82" stroke-width="5" stroke-linejoin="round"/><path d="M144 126 L170 134 V164 Q170 184 144 198 Q118 184 118 164 V134 Z" fill="#3450C8"/>`,
    decorRebord: `<path d="M24 216 H264" stroke="#E6ECFF" stroke-width="8"/>`,
  },
  pompier: {
    corps: "M24 72 H264 V234 Q264 246 252 246 H36 Q24 246 24 234 Z",
    c: ["#F0705A", "#C2341B"], contour: "#6E1708", interieur: "#8A2010", couvercle: ["#D9503A", "#A8281A"],
    couvercleFerme: `<rect x="14" y="46" width="260" height="34" rx="9"/>`,
    decorCouvercleFerme: `<rect x="98" y="30" width="92" height="20" rx="10" fill="#FFC93C" stroke="#A56F00" stroke-width="4"/>`,
    decorCouvercleOuvert: `<rect x="98" y="14" width="92" height="16" rx="8" fill="#FFC93C" stroke="#A56F00" stroke-width="4"/>`,
    decorCorps: `<rect x="24" y="152" width="240" height="26" fill="#FFC93C"/><rect x="40" y="96" width="46" height="18" rx="9" fill="#6E1708"/><rect x="202" y="96" width="46" height="18" rx="9" fill="#6E1708"/>`,
    decorRebord: `<rect x="24" y="216" width="240" height="14" fill="#FFC93C"/>`,
  },
  danse: {
    corps: "M24 72 H264 V228 Q264 246 246 246 H42 Q24 246 24 228 Z",
    c: ["#F8D2EF", "#D68BC8"], contour: "#7A35C8", interieur: "#8E4BA8", couvercle: ["#E6B3EC", "#B96FCB"],
    couvercleFerme: `<rect x="14" y="46" width="260" height="34" rx="14"/>`,
    decorCouvercleFerme: `<path d="M40 63 H248" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".85"/>`,
    decorCouvercleOuvert: `<path d="M56 30 H232" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".85"/>`,
    // note de musique en relief ; manivelle sur le côté (pas de figurine)
    decorCorps: `<ellipse cx="124" cy="190" rx="14" ry="10" fill="#FFFFFF" transform="rotate(-20 124 190)"/><path d="M135 186 V132 Q146 140 160 146" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    decorRebord: `<path d="M24 216 H264" stroke="#FFFFFF" stroke-width="6" opacity=".85"/>`,
    apres: `<path d="M264 150 H276" stroke="#7A35C8" stroke-width="6" stroke-linecap="round"/><circle cx="278" cy="150" r="8" fill="#F8D2EF" stroke="#7A35C8" stroke-width="4"/>`,
  },
};
function fleur(x, y, e) {
  const p = (dx, dy) => `<circle cx="${dx * 8 * e + x}" cy="${dy * 8 * e + y}" r="${6.5 * e}"/>`;
  return `<g fill="#FFFFFF" stroke="#D0589A" stroke-width="${2.5 * e}">${p(0, -1.4)}${p(1.4, -0.4)}${p(0.9, 1.2)}${p(-0.9, 1.2)}${p(-1.4, -0.4)}</g><circle cx="${x}" cy="${y}" r="${5 * e}" fill="#FFC93C" stroke="#C9921B" stroke-width="${2 * e}"/>`;
}
function boite(u, ouverte) {
  const b = BOITES[u];
  const id = `b-${u}-${ouverte ? "o" : "f"}`;
  const defs = `<defs>${grad(`${id}-c`, b.c[0], b.c[1])}${grad(`${id}-l`, b.couvercle[0], b.couvercle[1])}<clipPath id="${id}-corps"><path d="${b.corps}"/></clipPath><clipPath id="${id}-rebord"><rect x="0" y="204" width="288" height="46"/></clipPath></defs>`;
  const corps = (extra = "") => `<path d="${b.corps}" fill="url(#${id}-c)" stroke="${b.contour}" stroke-width="4" stroke-linejoin="round"${extra}/>`;
  if (!ouverte) {
    const lid = b.couvercleFerme.replace("/>", ` fill="url(#${id}-l)" stroke="${b.contour}" stroke-width="4" stroke-linejoin="round"/>`);
    return svg("0 0 288 250", `${defs}\n<!-- poignée -->${b.avant ?? ""}\n<!-- corps -->\n${corps()}\n<g clip-path="url(#${id}-corps)">${b.decorCorps}</g>\n<!-- couvercle fermé : rien ne laisse deviner les jetons -->\n${lid}\n${b.decorCouvercleFerme}\n${b.apres ?? ""}`);
  }
  const lidOuvert = `<path d="M30 54 L44 8 Q46 4 52 4 H236 Q242 4 244 8 L258 54 Z" fill="url(#${id}-l)" stroke="${b.contour}" stroke-width="4" stroke-linejoin="round"/>`;
  const fond = `<path d="${b.corps}" transform="translate(0 -${LEVIER})" fill="${b.interieur}" stroke="${b.contour}" stroke-width="4" stroke-linejoin="round"/>`;
  return svg("0 0 288 250", `${defs}\n<!-- couvercle ouvert (derrière) -->\n${lidOuvert}\n${b.decorCouvercleOuvert}\n<!-- fond de la boîte : la zone des jetons va de y=58 à y=204 -->\n${fond}\n<!-- rebord avant -->\n<g clip-path="url(#${id}-rebord)">${corps()}<g clip-path="url(#${id}-corps)">${b.decorRebord}</g></g>\n${b.apres ?? ""}`);
}

/* ------------------------------------------------------------------ JAUGES (hauteur 48, largeur variable) */
// Remplissage uni ; le décor n'existe qu'aux deux bouts et ne dépend pas de la longueur.
const JAUGES = {
  animaux: { plein: "#8FD39B", contour: "#2E7E52", nombre: ENCRE },
  princesse: { plein: "#D9B3F0", contour: "#7E56BC", nombre: ENCRE },
  sports: { plein: "#8FC7F7", contour: "#164BA8", nombre: ENCRE },
  police: { plein: "#9FB2E6", contour: "#1F2F82", nombre: ENCRE },
  pompier: { plein: "#A8DFF5", contour: "#1F6F96", nombre: ENCRE },
  danse: { plein: "#F7B3D6", contour: "#A24A9A", nombre: ENCRE },
};
const VIDE = { fond: "#FFF3C4", trait: "#6B5B2E" };
function jauge(u, largeur, etat, nombre) {
  const j = JAUGES[u];
  const w = largeur;
  const plein = etat === "pleine";
  const fill = plein ? j.plein : VIDE.fond;
  const trait = plein ? j.contour : VIDE.trait;
  const pointille = plein ? "" : ` stroke-dasharray="7 6"`;
  const style = `stroke="${trait}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"${pointille}`;
  const deco = (couleur) => (plein ? couleur : VIDE.fond);
  let corps = "";
  if (u === "animaux") {
    corps = `<!-- tige unie -->\n<rect x="4" y="13" width="${w - 26}" height="26" rx="13" fill="${fill}" ${style}/>\n<!-- une seule feuille, au bout -->\n<path d="M${w - 30} 22 Q${w - 22} 2 ${w - 4} 4 Q${w - 6} 26 ${w - 30} 30 Z" fill="${deco("#4FB37A")}" ${style}/>`;
  } else if (u === "princesse") {
    corps = `<!-- ruban uni, bouts en queue d'aronde -->\n<path d="M4 13 H${w - 4} L${w - 18} 26 L${w - 4} 39 H4 L18 26 Z" fill="${fill}" ${style}/>`;
  } else if (u === "sports") {
    corps = `<!-- tube uni, deux embouts -->\n<rect x="4" y="13" width="${w - 8}" height="26" rx="10" fill="${fill}" ${style}/>${plein ? `\n<rect x="4" y="13" width="14" height="26" rx="8" fill="#3F7FE0" ${style}/><rect x="${w - 18}" y="13" width="14" height="26" rx="8" fill="#3F7FE0" ${style}/>` : ""}`;
  } else if (u === "police") {
    corps = `<!-- bande unie, un embout à chaque bout -->\n<rect x="4" y="13" width="${w - 8}" height="26" rx="4" fill="${fill}" ${style}/>${plein ? `\n<rect x="4" y="13" width="12" height="26" rx="4" fill="#3450C8" ${style}/><rect x="${w - 16}" y="13" width="12" height="26" rx="4" fill="#3450C8" ${style}/>` : ""}`;
  } else if (u === "pompier") {
    corps = `<!-- tuyau d'eau claire, sans lance ni anneaux : seulement un raccord à chaque bout -->\n<rect x="8" y="13" width="${w - 16}" height="26" rx="12" fill="${fill}" ${style}/>\n<rect x="3" y="9" width="16" height="34" rx="6" fill="${deco("#FFC93C")}" stroke="${plein ? "#A56F00" : VIDE.trait}" stroke-width="3.5" stroke-linejoin="round"${pointille}/><rect x="${w - 19}" y="9" width="16" height="34" rx="6" fill="${deco("#FFC93C")}" stroke="${plein ? "#A56F00" : VIDE.trait}" stroke-width="3.5" stroke-linejoin="round"${pointille}/>`;
  } else {
    corps = `<!-- ruban uni sur une petite baguette -->\n<path d="M14 13 H${w - 4} L${w - 18} 26 L${w - 4} 39 H14 Z" fill="${fill}" ${style}/>\n<rect x="3" y="3" width="11" height="42" rx="5.5" fill="${deco("#E8C48F")}" stroke="${plein ? "#8A5A2B" : VIDE.trait}" stroke-width="3.5" stroke-linejoin="round"${pointille}/>`;
  }
  const texte = etat === "pleine"
    ? `<text x="${w / 2}" y="34" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="${j.nombre}">${nombre}</text>`
    : `<text x="${w / 2}" y="34" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="${ENCRE}">?</text>`;
  return { sansTexte: svg(`0 0 ${w} 48`, corps), avecTexte: svg(`0 0 ${w} 48`, `${corps}\n<!-- le nombre est du texte HTML dans l'application -->\n${texte}`) };
}

/* ------------------------------------------------------------------ contraste */
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/* ------------------------------------------------------------------ écriture des sources */
const jetonsDeLaBoite = (u, n) => {
  const taille = 32, ecart = 6, rangees = [];
  for (let i = 0; i < n; i += 5) rangees.push(Math.min(5, n - i));
  const hauteur = rangees.length * taille + (rangees.length - 1) * ecart;
  let sortie = "";
  let k = 0;
  rangees.forEach((nb, r) => {
    const largeur = nb * taille + (nb - 1) * ecart;
    for (let i = 0; i < nb; i++, k++) {
      const x = (288 - largeur) / 2 + i * (taille + ecart);
      const y = 58 + (146 - hauteur) / 2 + r * (taille + ecart);
      const interieur = jeton(u, { cinquieme: k % 5 === 4 }).replace(/^<svg[^>]*>\n/, "").replace(/\n<\/svg>\n$/, "");
      sortie += `<svg x="${x}" y="${y}" width="${taille}" height="${taille}" viewBox="0 0 100 100">${interieur}</svg>`;
    }
  });
  return sortie;
};

const rapport = [];
for (const u of UNIVERS) {
  await writeFile(`${SOURCES}jeton-${u}.svg`, jeton(u));
  await writeFile(`${SOURCES}jeton-${u}-cinquieme.svg`, jeton(u, { cinquieme: true }));
  await writeFile(`${SOURCES}boite-${u}-fermee.svg`, boite(u, false));
  await writeFile(`${SOURCES}boite-${u}-ouverte.svg`, boite(u, true));
  const vide = jauge(u, 200, "vide");
  const courte = jauge(u, 110, "pleine", 7);
  const longue = jauge(u, 300, "pleine", 42);
  await writeFile(`${SOURCES}jauge-${u}-vide.svg`, vide.sansTexte);
  await writeFile(`${SOURCES}jauge-${u}-pleine.svg`, courte.sansTexte);
  const j = JAUGES[u];
  rapport.push(`${u.padEnd(10)} nombre ${j.nombre} sur jauge ${j.plein} : ${contraste(j.nombre, j.plein).toFixed(2)}:1   « ? » ${ENCRE} sur fond vide ${VIDE.fond} : ${contraste(ENCRE, VIDE.fond).toFixed(2)}:1   contour ${j.contour} sur fond clair #F3F8FD : ${contraste(j.contour, "#F3F8FD").toFixed(2)}:1`);
}
const ecart = rapport.filter((l) => /: [0-4]\.\d\d:1/.test(l.split("nombre")[1]?.split("«")[0] ?? ""));
await writeFile(`${CONTROLE}contraste.txt`, `Contraste du nombre écrit sur la jauge (WCAG, seuil 4,5:1) et du « ? » sur la barre vide\n\n${rapport.join("\n")}\n`);
if (ecart.length) console.error("Contraste insuffisant :", ecart);

/* ------------------------------------------------------------------ planches */
const cellule = (contenu, w) => `<div class="c" style="width:${w}px">${contenu}</div>`;
const libelle = (u) => `<div class="nom"><b>${NOMS[u][0]}</b><span>${NOMS[u][1]}</span></div>`;
const FOND = `body{margin:0;padding:16px;background:#F3F8FD;font:13px system-ui,sans-serif;color:#1E2A3A}
.ligne{display:flex;align-items:center;gap:20px;padding:10px 0;border-bottom:1px solid #D5E0EC}
.nom{width:150px;display:grid;gap:2px}.nom span{font-size:11px;color:#5A6A7E}
.c{display:grid;justify-items:center;gap:4px}.c svg{display:block;width:100%;height:auto}
.c i{font-style:normal;font-size:11px;color:#5A6A7E}.t{display:flex;align-items:center;gap:20px;font-weight:700;font-size:12px;padding-left:170px}
.t div{text-align:center}.pile{position:relative}.pile svg{position:absolute;left:0;top:0}.pile svg.base{position:static}`;

const boiteAvecJetons = (u, n) => {
  const ouvert = boite(u, true).replace("</svg>", `${jetonsDeLaBoite(u, n)}</svg>`);
  return ouvert;
};

const planche1 = `<style>${FOND}</style>
<div class="t"><div style="width:288px">boîte fermée</div><div style="width:288px">boîte ouverte, 7 jetons (le 5e marqué)</div><div style="width:110px">jeton</div><div style="width:110px">5e jeton</div><div style="width:28px">28 px</div><div style="width:48px">48 px</div></div>
${UNIVERS.map((u) => `<div class="ligne">${libelle(u)}${cellule(boite(u, false), 288)}${cellule(boiteAvecJetons(u, 7), 288)}${cellule(jeton(u), 110)}${cellule(jeton(u, { cinquieme: true }), 110)}${cellule(jeton(u), 28)}${cellule(jeton(u, { cinquieme: true }), 48)}</div>`).join("\n")}`;

const planche2 = `<style>${FOND}</style>
<div class="t"><div style="width:200px">barre de la valeur cherchée</div><div style="width:110px">pleine, courte</div><div style="width:300px">pleine, longue</div><div style="width:110px">même barre, réduite</div></div>
${UNIVERS.map((u) => `<div class="ligne">${libelle(u)}${cellule(jauge(u, 200, "vide").avecTexte, 200)}${cellule(jauge(u, 110, "pleine", 7).avecTexte, 110)}${cellule(jauge(u, 300, "pleine", 42).avecTexte, 300)}${cellule(jauge(u, 110, "pleine", 7).avecTexte, 56)}</div>`).join("\n")}`;

const CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = await access(CHROMIUM).then(() => CHROMIUM, () => undefined);
const navigateur = await chromium.launch({ executablePath });
async function photographier(html, fichier, largeur, echelle) {
  const onglet = await navigateur.newPage({ viewport: { width: largeur, height: 400 }, deviceScaleFactor: echelle, reducedMotion: "reduce" });
  await onglet.setContent(html);
  await onglet.screenshot({ path: fichier, fullPage: true });
  await onglet.close();
}
for (const [nom, html, largeur] of [["boite-a-jetons", planche1, 1260], ["jauge-du-schema", planche2, 940]]) {
  await photographier(html, `${DOSSIER}${nom}.png`, largeur, 1);
  await photographier(html, `${DOSSIER}${nom}-x2.png`, largeur, 2);
}
// contrôles : chaque dessin à plusieurs largeurs, fond clair et fond sombre
async function controle(nom, dessin, largeurs) {
  const fonds = [["#F3F8FD", "clair"], ["#121A24", "sombre"]];
  const cases = fonds.flatMap(([c, n]) => largeurs.map((l) => `<figure style="background:${c};color:${n === "clair" ? "#1E2A3A" : "#E8EEF5"}"><div style="width:${l}px">${dessin}</div><figcaption>${l} px · fond ${n}</figcaption></figure>`)).join("");
  const html = `<style>body{margin:0;padding:16px;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;background:#888;font:12px system-ui}figure{margin:0;padding:12px;border-radius:8px;display:grid;gap:6px;justify-items:center}figure svg{width:100%;height:auto;display:block}</style>${cases}`;
  await photographier(html, `${CONTROLE}${nom}.png`, 1200, 1);
}
for (const u of UNIVERS) {
  await controle(`jeton-${u}`, `<div style="display:flex;gap:6px">${jeton(u)}${jeton(u, { cinquieme: true })}</div>`, [240, 112, 56]);
  await controle(`jauge-${u}`, `<div style="display:grid;gap:6px">${jauge(u, 300, "pleine", 42).avecTexte}${jauge(u, 120, "pleine", 7).avecTexte}${jauge(u, 200, "vide").avecTexte}</div>`, [600, 300, 150]);
}
await navigateur.close();
console.log("Planches écrites.");
