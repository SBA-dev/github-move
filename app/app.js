/* Savanturier : moteur de leçons interactives pour l'école élémentaire (CP → CM2).
   Une leçon est une donnée JSON (voir docs/format-lecons.md). Le moteur la joue dans l'univers
   choisi par l'enfant, enregistre la progression et propose un espace adulte pour suivre les
   enfants et créer de nouvelles leçons à partir d'un texte. */
'use strict';

/* ================= Outils ================= */
const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const slug = s => String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'lecon';
const norm = s => String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LEVELS = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];
const SUBJECTS = { francais: 'Français', maths: 'Mathématiques', sciences: 'Sciences', histoire: 'Histoire et géographie', anglais: 'Anglais', emc: 'Vivre ensemble (EMC)' };
const TYPES = {
  bulles: 'Bulles-réponses', classer: 'Ranger dans les maisons', dictee: 'Dictée', ordre: 'Remettre dans l\'ordre',
  trous: 'Texte à trous', conjugaison: 'Conjugaison', lecture: 'Écouter et comprendre', memoriser: 'Apprendre par cœur', addition: 'Addition posée',
  calcul: 'Calcul', fluence: 'Calcul rapide', ecoute: 'Écouter (langue)', boite: 'La boîte à jetons', barres: 'Problème en schéma',
};
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"/></svg>';
const SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
const MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

/* ================= Univers =================
   L'univers ne change que l'habillage (guide, décor, couleurs). Les gestes, les consignes et les
   couleurs des colonnes de calcul (C vert, D rose, U bleu) restent les mêmes partout. */
const WORLDS = {
  princesse: { label: 'Princesses et fées', realm: 'le Royaume des Savanturiers', guide: { name: 'Lumi', title: 'la fée des nombres et des mots', look: { skin: '#ffd9b8', hair: '#f7cc4f', body: '#ff9cbc', wings: true, hat: 'tiara', prop: 'wand' } }, bg: 'linear-gradient(180deg,#3b2263,#22174a)', vessel: 'cauldron', liquid: '#7cf0c9' },
  animaux: { label: 'Animaux de la forêt', realm: 'la Forêt des Savanturiers', guide: { name: 'Noisette', title: 'l\'écureuil savant', look: { animal: 'squirrel' } }, bg: 'linear-gradient(180deg,#24452c,#162a1d)', vessel: 'bowl', liquid: '#ffd36b' },
  sports: { label: 'Sports', realm: 'le Stade des Savanturiers', guide: { name: 'Coach Léo', title: 'l\'entraîneur des champions', look: { skin: '#f1c39a', hair: '#5a3a22', body: '#2a63d4', hat: 'cap', prop: 'ball' } }, bg: 'linear-gradient(180deg,#1f5136,#14301f)', vessel: 'trophy', liquid: '#ffd36b' },
  police: { label: 'Police', realm: 'le Commissariat des Savanturiers', guide: { name: 'Agente Mila', title: 'la policière détective', look: { skin: '#c98d5e', hair: '#2b1d14', body: '#1f3a8a', hat: 'police', prop: 'badge' } }, bg: 'linear-gradient(180deg,#1d2c55,#121a36)', vessel: 'tank', liquid: '#9ccfff' },
  pompier: { label: 'Pompiers', realm: 'la Caserne des Savanturiers', guide: { name: 'Capitaine Sam', title: 'le pompier courageux', look: { skin: '#f3c9a5', hair: '#a8461c', body: '#d23a2a', hat: 'helmet', prop: 'hose' } }, bg: 'linear-gradient(180deg,#4a1f1f,#2a1212)', vessel: 'tank', liquid: '#9ccfff' },
  danse: { label: 'Danse', realm: 'l\'Opéra des Savanturiers', guide: { name: 'Lili', title: 'la danseuse étoile', look: { skin: '#e8b58c', hair: '#3b2416', body: '#b55bd6', hat: 'bun', prop: 'ribbon' } }, bg: 'linear-gradient(180deg,#4a1f45,#2a1228)', vessel: 'trophy', liquid: '#ff9de0' },
};
let W = WORLDS.princesse;

/* Couleurs du paysage et couleur principale de chaque univers (texte blanc lisible dessus). */
const PALETTES = {
  animaux: { sky: ['#BFE5FF', '#FFF3DF'], far: '#B8CCE8', hills: ['#A8D9A4', '#6CBF84', '#3F9A63'], tree: '#2E7E52', sun: '#FFD978', accent: '#C9452F', deep: '#9E3322' },
  princesse: { sky: ['#E7D9FF', '#FFE6F1'], far: '#D7C8F0', hills: ['#F2C9E4', '#D8A6E3', '#A97FD6'], tree: '#7E56BC', sun: '#FFE3F0', accent: '#A23BB8', deep: '#7C2690' },
  sports: { sky: ['#BDE3FF', '#F0FAFF'], far: '#BFD7EE', hills: ['#A5DE8F', '#63C46A', '#2F9A4C'], tree: '#237A3B', sun: '#FFF0A0', accent: '#1F63D8', deep: '#164BA8' },
  police: { sky: ['#C9D6FF', '#EEF2FF'], far: '#B6C3E6', hills: ['#B9C9EC', '#8AA2DA', '#5A75BF'], tree: '#41589E', sun: '#FFFFFF', accent: '#3450C8', deep: '#253B9C' },
  pompier: { sky: ['#FFC9A8', '#FFF0D9'], far: '#F3C2A6', hills: ['#F2C08F', '#E39561', '#C06A3E'], tree: '#9C4A2A', sun: '#FFE08A', accent: '#C2341B', deep: '#931F0C' },
  danse: { sky: ['#F3D2FF', '#FFF0F7'], far: '#E6C8F2', hills: ['#F4BEDD', '#DE93C8', '#B565AE'], tree: '#934C94', sun: '#FFE7F4', accent: '#7A35C8', deep: '#5A1F9E' },
};
const worldKey = (w = W) => Object.keys(WORLDS).find(k => WORLDS[k] === w) || 'animaux';
function sceneryHTML(pal) {
  return `<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.sky[0]}"/><stop offset=".75" stop-color="${pal.sky[1]}"/></linearGradient>
      <radialGradient id="sc-sun"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="${pal.sun}"/><stop offset="1" stop-color="${pal.sun}" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="800" fill="url(#sc-sky)"/>
    <circle cx="960" cy="170" r="150" fill="url(#sc-sun)"/>
    <g fill="#FFFFFF" opacity=".85"><ellipse cx="210" cy="140" rx="74" ry="22"/><ellipse cx="250" cy="125" rx="46" ry="27"/><ellipse cx="650" cy="96" rx="60" ry="18"/><ellipse cx="684" cy="84" rx="36" ry="22"/></g>
    <path d="M0 380 L120 270 L210 340 L330 230 L470 350 L560 290 L700 360 L820 260 L960 350 L1060 300 L1200 360 V800 H0 Z" fill="${pal.far}" opacity=".7"/>
    <path d="M0 450 C180 380 320 440 480 410 C650 375 820 440 980 400 C1080 375 1140 390 1200 400 V800 H0 Z" fill="${pal.hills[0]}"/>
    <path d="M0 540 C160 490 300 540 470 515 C660 485 860 560 1200 500 V800 H0 Z" fill="${pal.hills[1]}"/>
    <path d="M0 660 C200 610 420 670 640 635 C860 600 1020 660 1200 630 V800 H0 Z" fill="${pal.hills[2]}"/>
    <g fill="${pal.tree}"><circle cx="90" cy="580" r="34"/><circle cx="125" cy="595" r="26"/><circle cx="1090" cy="560" r="40"/><circle cx="1130" cy="580" r="28"/></g>
  </svg>`;
}
/* Applique l'univers : paysage et couleur principale. */
function applyWorld(world = W) {
  const pal = PALETTES[worldKey(world)];
  document.documentElement.style.setProperty('--accent', pal.accent);
  document.documentElement.style.setProperty('--accent-deep', pal.deep);
  $('#scenery').innerHTML = sceneryHTML(pal);
}
let gid = 0;
function guideSVG(look) {
  const k = 'g' + (++gid);
  if (look.animal === 'squirrel') {
    return `<svg class="lumi" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="${k}f" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFC28A"/><stop offset=".6" stop-color="#F48C3C"/><stop offset="1" stop-color="#C9601C"/></radialGradient>
        <radialGradient id="${k}b" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFE0BF"/></radialGradient>
      </defs>
      <path d="M138 176 C206 160 200 60 150 48 C176 86 150 120 126 122 Z" fill="url(#${k}f)"/>
      <ellipse cx="96" cy="150" rx="44" ry="46" fill="url(#${k}f)"/><ellipse cx="96" cy="160" rx="26" ry="30" fill="url(#${k}b)"/>
      <path d="M60 58 L52 18 L86 44 Z M132 58 L140 18 L106 44 Z" fill="url(#${k}f)"/>
      <path d="M64 50 L60 30 L78 44 Z M128 50 L132 30 L114 44 Z" fill="#FFB3C7"/>
      <circle cx="96" cy="84" r="46" fill="url(#${k}f)"/><ellipse cx="96" cy="100" rx="28" ry="20" fill="url(#${k}b)"/>
      <ellipse cx="78" cy="80" rx="9" ry="11" fill="#1B1530"/><ellipse cx="114" cy="80" rx="9" ry="11" fill="#1B1530"/>
      <circle cx="81" cy="76" r="3.4" fill="#FFFFFF"/><circle cx="117" cy="76" r="3.4" fill="#FFFFFF"/>
      <ellipse cx="96" cy="94" rx="6" ry="4.5" fill="#5B2C1A"/>
      <ellipse cx="66" cy="98" rx="8" ry="5" fill="#FF8FA8" opacity=".55"/><ellipse cx="126" cy="98" rx="8" ry="5" fill="#FF8FA8" opacity=".55"/>
      <path class="m-happy" d="M86 103 Q96 113 106 103" stroke="#5B2C1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path class="m-think" d="M88 107 Q96 103 104 107" stroke="#5B2C1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path class="m-cheer" d="M84 101 Q96 121 108 101 Z" fill="#5B2C1A"/></svg>`;
  }
  const hats = {
    tiara: '<path d="M33 24 l4 -8 l4 6 l4 -9 l4 9 l4 -6 l4 8 Z" fill="#FFC93C"/>',
    cap: '<path d="M30 30 Q31 16 46 16 Q60 16 61 30 Z" fill="#E8604C"/><path d="M58 29 h14 q2 0 0 3 h-14 Z" fill="#C24432"/>',
    police: '<path d="M29 29 Q30 17 46 17 Q61 17 62 29 Z" fill="#26397A"/><rect x="28" y="27" width="35" height="5" rx="2" fill="#16245A"/><circle cx="45.5" cy="22" r="3.5" fill="#FFC93C"/>',
    helmet: '<path d="M28 32 Q28 12 46 12 Q63 12 63 32 Z" fill="#F2C230"/><path d="M24 31 h44 q3 0 0 4 h-44 q-3 0 0 -4 Z" fill="#D9A21C"/><rect x="42" y="14" width="7" height="12" rx="2" fill="#D9381E"/>',
  };
  const props = {
    wand: '<path d="M60 64 L80 34" stroke="#FFC93C" stroke-width="3" stroke-linecap="round"/><path d="M80 22 l3.5 8 8.5 .6 -6.5 5.5 2 8.3 -7.5 -4.5 -7.5 4.5 2 -8.3 -6.5 -5.5 8.5 -.6 z" fill="#FFC93C"/>',
    ball: '<circle cx="76" cy="86" r="10" fill="#FFFFFF" stroke="#D5E2DC"/><path d="M76 76 l4 6 -4 4 -4 -4 z" fill="#17302A"/>',
    badge: '<path d="M45 62 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 z" fill="#FFC93C"/>',
    hose: '<path d="M60 70 q18 0 20 -20" stroke="#5A5A5A" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="82" cy="44" r="2.5" fill="#9CCFFF"/><circle cx="86" cy="38" r="2" fill="#9CCFFF"/>',
    ribbon: '<path d="M62 64 q14 -20 4 -34 q-10 -12 6 -20" stroke="#FF8FB8" stroke-width="3" fill="none" stroke-linecap="round"/>',
  };
  return `<svg class="lumi" viewBox="0 0 90 110" aria-hidden="true">
    <defs>
      <radialGradient id="${k}s" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset=".35" stop-color="${look.skin}"/><stop offset="1" stop-color="${look.skin}"/></radialGradient>
      <linearGradient id="${k}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".35"/><stop offset=".4" stop-color="${look.body}"/><stop offset="1" stop-color="${look.body}"/></linearGradient>
    </defs>
    ${look.wings ? '<ellipse cx="28" cy="52" rx="20" ry="28" fill="#CFEAFF" opacity=".8" transform="rotate(-20 28 52)"/><ellipse cx="62" cy="52" rx="20" ry="28" fill="#CFEAFF" opacity=".8" transform="rotate(20 62 52)"/>' : ''}
    <path d="M45 50 Q66 70 68 100 H22 Q24 70 45 50 Z" fill="url(#${k}c)"/>
    ${look.hat === 'bun' ? `<circle cx="45.5" cy="17" r="8" fill="${look.hair}"/>` : ''}
    <circle cx="45" cy="38" r="16" fill="url(#${k}s)"/>
    <path d="M28 37 C29 17 61 15 62 37 C57 28 35 27 28 37 Z" fill="${look.hair}"/>
    ${hats[look.hat] || ''}
    <ellipse cx="39.5" cy="39" rx="2.6" ry="3.2" fill="#1B1530"/><ellipse cx="51" cy="39" rx="2.6" ry="3.2" fill="#1B1530"/>
    <circle cx="40.4" cy="38" r=".9" fill="#FFFFFF"/><circle cx="51.9" cy="38" r=".9" fill="#FFFFFF"/>
    <ellipse cx="35" cy="44" rx="3" ry="1.8" fill="#FF8FA8" opacity=".5"/><ellipse cx="56" cy="44" rx="3" ry="1.8" fill="#FF8FA8" opacity=".5"/>
    <path class="m-happy" d="M41 45 Q45.5 49 50 45" stroke="#5B2C1A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path class="m-think" d="M41.5 46.5 Q45.5 44.5 49.5 46.5" stroke="#5B2C1A" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path class="m-cheer" d="M40 44 Q45.5 53 51 44 Z" fill="#5B2C1A"/>
    ${props[look.prop] || ''}</svg>`;
}
const svgEl = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const guideEl = (world = W) => svgEl(guideSVG(world.guide.look));
/* Étoile en relief (récompenses). */
const STAR3D = on => { const k = 'st' + (++gid); return `<svg viewBox="0 0 100 100" aria-hidden="true" class="${on ? 'on' : ''}"><defs><radialGradient id="${k}" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".55" stop-color="#FFC93C"/><stop offset="1" stop-color="#E88A00"/></radialGradient></defs>
  <path d="M50 8 C54 8 56 28 62 32 C68 36 90 34 92 38 C94 42 76 54 74 60 C72 66 82 86 78 90 C74 94 56 80 50 80 C44 80 26 94 22 90 C18 86 28 66 26 60 C24 54 6 42 8 38 C10 34 32 36 38 32 C44 28 46 8 50 8 Z" fill="${on ? `url(#${k})` : 'rgba(255,255,255,.7)'}"/>${on ? '<ellipse cx="40" cy="34" rx="10" ry="6" fill="#FFFFFF" opacity=".5" transform="rotate(-30 40 34)"/>' : ''}</svg>`; };
function vesselSVG(kind, color) {
  const outline = {
    cauldron: 'M28 72 Q28 168 100 168 Q172 168 172 72 Z', bowl: 'M14 96 Q24 168 100 168 Q176 168 186 96 Z',
    trophy: 'M44 40 H156 Q156 128 100 132 Q44 128 44 40 Z', tank: 'M30 50 H170 Q182 50 182 62 V156 Q182 168 170 168 H30 Q18 168 18 156 V62 Q18 50 30 50 Z',
  }[kind];
  const extra = {
    cauldron: '<ellipse cx="100" cy="72" rx="76" ry="14" fill="none" stroke="#FFFFFF" stroke-width="7"/>',
    bowl: '<ellipse cx="100" cy="96" rx="88" ry="12" fill="none" stroke="#c99a1c" stroke-width="6"/>',
    trophy: '<path d="M44 52 Q14 52 20 80 Q26 100 50 100 M156 52 Q186 52 180 80 Q174 100 150 100" stroke="#c99a1c" stroke-width="7" fill="none"/><rect x="92" y="132" width="16" height="26" fill="#c99a1c"/><rect x="66" y="158" width="68" height="18" rx="4" fill="#c99a1c"/>',
    tank: '<rect x="90" y="36" width="20" height="16" rx="4" fill="#8890a8"/>',
  }[kind];
  return `<svg class="vessel" viewBox="0 0 200 190" aria-hidden="true"><defs><clipPath id="vclip"><path d="${outline}"/></clipPath></defs>
    <path d="${outline}" fill="rgba(255,255,255,.7)" stroke="#FFFFFF" stroke-width="4"/>
    <rect class="liquid" x="10" y="30" width="180" height="140" clip-path="url(#vclip)" fill="${color}"/>${extra}</svg>`;
}

/* ================= Sons et voix ================= */
let soundOn = true;
try { soundOn = localStorage.getItem('ecole-son') !== '0'; } catch (e) {}
let ac = null;
function audio() {
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (ac && ac.state !== 'running') { try { ac.resume().catch(() => {}); } catch (e) {} }
  return ac;
}
/* Le son et la voix ne sont autorisés que s'ils démarrent pendant un toucher (iPhone, iPad, Chrome) :
   au premier toucher on déverrouille le contexte audio, une piste silencieuse en boucle (l'iPhone
   passe alors en mode lecture, même avec le bouton silencieux) et la synthèse vocale. */
function silentWav() {
  const n = 8000, buf = new Uint8Array(44 + n), dv = new DataView(buf.buffer);
  const w = (o, s) => [...s].forEach((ch, i) => buf[o + i] = ch.charCodeAt(0));
  w(0, 'RIFF'); dv.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
  dv.setUint32(24, 8000, true); dv.setUint32(28, 8000, true); dv.setUint16(32, 1, true); dv.setUint16(34, 8, true); w(36, 'data'); dv.setUint32(40, n, true);
  buf.fill(128, 44); let bin = ''; buf.forEach(b => bin += String.fromCharCode(b));
  return 'data:audio/wav;base64,' + btoa(bin);
}
let unlocked = false, keepAlive = null;
function unlockAudio() {
  if (!soundOn) return;
  const a = audio();
  if (unlocked) return;
  unlocked = true;
  try { if (!keepAlive) { keepAlive = new Audio(silentWav()); keepAlive.loop = true; keepAlive.setAttribute('playsinline', ''); } keepAlive.play().catch(() => {}); } catch (e) {}
  try { if (a) { const b = a.createBuffer(1, 1, 22050), s = a.createBufferSource(); s.buffer = b; s.connect(a.destination); s.start(0); } } catch (e) {}
  try { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } } catch (e) {}
}
['pointerdown', 'touchend', 'keydown', 'click'].forEach(ev => document.addEventListener(ev, unlockAudio, true));
function tone(f, t, d, type = 'sine', v = .12) {
  if (!soundOn) return; const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime + t;
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .02); g.gain.exponentialRampToValueAtTime(.001, t0 + d);
  o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + d + .05);
}
const sfx = {
  ok() { [784, 988, 1319].forEach((f, i) => tone(f, i * .08, .35)); },
  no() { tone(240, 0, .25, 'triangle', .1); tone(190, .12, .3, 'triangle', .1); },
  pop() { tone(1046, 0, .12, 'sine', .08); },
  count(i) { tone(392 * Math.pow(2, (i % 12) / 12), 0, .25, 'sine', .1); },
  magic() { [523, 659, 784, 1046, 1319, 1568].forEach((f, i) => tone(f, i * .06, .4, 'sine', .07)); },
  star() { [523, 659, 784, 1046, 784, 1046, 1319].forEach((f, i) => tone(f, i * .1, .45, 'triangle', .09)); },
};
/* Voix : on choisit la voix française la plus naturelle de l'appareil (voix « Natural »,
   « Premium », « améliorée »…), puis chaque guide lui donne son caractère : voix féminine ou
   masculine, hauteur, rythme et petites expressions à lui. */
const VOICE_STYLE = {
  princesse: { sexe: 'f', pitch: 1.25, rate: 1.0, cri: ['Abracadabra !', 'Par ma baguette, bravo !', 'Magique !'] },
  animaux: { sexe: 'f', pitch: 1.45, rate: 1.08, cri: ['Youpi !', 'Hop hop hop, bravo !', 'Trop fort, ça !'] },
  sports: { sexe: 'm', pitch: 1.05, rate: 1.07, cri: ['Allez, on y va !', 'Et c\'est le but !', 'Quelle équipe !'] },
  police: { sexe: 'f', pitch: 1.05, rate: 1.0, cri: ['Enquête résolue !', 'Bien vu, détective !', 'Affaire classée !'] },
  pompier: { sexe: 'm', pitch: .95, rate: 1.0, cri: ['Mission accomplie !', 'Pin-pon, bravo !', 'Sauvetage réussi !'] },
  danse: { sexe: 'f', pitch: 1.2, rate: 1.02, cri: ['Et hop, une pirouette !', 'En rythme, bravo !', 'Quelle grâce !'] },
};
const FEMALE = /am[eé]lie|audrey|aur[eé]lie|marie|denise|eloise|vivienne|brigitte|c[eé]line|julie|hortense|l[eé]a\b|virginie|sylvie|jos[eé]phine|coralie|jacqueline|yvette|charlotte|ariane|juliette|chantal|female|femme/i;
const MALE = /thomas|henri|r[eé]my|paul|nicolas|daniel|j[eé]r[oô]me|antoine|claude|alain|fabrice|jean|maurice|yves|guillaume|mathieu|\bmale\b|homme/i;
const canSpeak = 'speechSynthesis' in window;
let voices = [];
function voiceScore(v) {
  let s; const n = v.name || '';
  if (/^fr(-|_)FR/i.test(v.lang)) s = 30; else if (/^fr/i.test(v.lang)) s = 20; else return -1;
  if (/natural|neural|online/i.test(n)) s += 40;
  if (/premium/i.test(n)) s += 35;
  if (/enhanced|am[eé]lior/i.test(n)) s += 30;
  if (/google/i.test(n)) s += 20;
  if (/compact|espeak|robot/i.test(n)) s -= 30;
  return s;
}
function loadVoices() { try { voices = speechSynthesis.getVoices().filter(v => voiceScore(v) >= 0).sort((a, b) => voiceScore(b) - voiceScore(a)); } catch (e) { voices = []; } }
if (canSpeak) { loadVoices(); try { speechSynthesis.onvoiceschanged = loadVoices; } catch (e) {} }
const styleNow = () => VOICE_STYLE[Object.keys(WORLDS).find(k => WORLDS[k] === W)] || VOICE_STYLE.princesse;
function voiceFor(style) {
  if (!voices.length) loadVoices();
  let pref = null; try { pref = localStorage.getItem('ecole-voix'); } catch (e) {}
  if (pref) { const v = voices.find(x => x.name === pref); if (v) return v; }
  const want = style.sexe === 'm' ? MALE : FEMALE;
  const best = voices[0];
  return (best && voices.find(v => want.test(v.name) && voiceScore(v) >= voiceScore(best) - 15)) || best || null;
}
const pick = a => a[Math.floor(Math.random() * a.length)];
const PRAISE = ['Bravo !', 'Super !', 'Ouah, bien joué !', 'Exactement !', 'Génial !', 'Tu gères !', 'Parfait !', 'Oui, c\'est ça !'];
const OOPS = ['Oups, presque !', 'Hmm, pas tout à fait…', 'Pas grave, on réessaie !', 'Ah, celle-là est piégeuse !', 'Presque ! Regarde bien.'];
const praise = () => Math.random() < .35 ? pick(styleNow().cri) : pick(PRAISE);
const oops = () => pick(OOPS);
const toSpeech = html => String(html).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\+/g, ' plus ').replace(/=/g, ' égale ').replace(/_{2,}/g, ' ... ').replace(/[«»]/g, ' ').replace(/\s+/g, ' ').trim();
let speakTimer = null, voiceWarned = false;
/* Lecture phrase par phrase (certains navigateurs coupent les textes longs), avec une intonation
   qui varie un peu d'une phrase à l'autre pour éviter l'effet monocorde. Renvoie une promesse
   résolue à la fin de la lecture, ou après une durée estimée si la voix n'est pas disponible. */
/* Voix d'une autre langue (anglais pour les leçons de langue vivante). */
function voiceForLang(lang) {
  try {
    const all = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
    const score = v => (/natural|neural|online|premium|enhanced|google/i.test(v.name) ? 10 : 0) + (v.lang.toLowerCase() === lang.toLowerCase() ? 5 : 0);
    return all.sort((a, b) => score(b) - score(a))[0] || null;
  } catch (e) { return null; }
}
function speak(html, { rate = 1, voice = null, style = null, lang = null, onBoundary = null } = {}) {
  const text = toSpeech(html);
  const estimate = Math.max(1200, text.length * 70);
  if (!soundOn || !canSpeak || !text) return new Promise(r => setTimeout(r, 0));
  clearTimeout(speakTimer);
  try { speechSynthesis.cancel(); } catch (e) {}
  const parts = text.split(/(?<=[.!?…:])\s+/).filter(Boolean);
  const st = lang ? { pitch: 1.05, rate: .95, sexe: 'f' } : (style || styleNow()), v = voice || (lang ? voiceForLang(lang) : voiceFor(st));
  let offset = 0; const offsets = parts.map(t => { const i = text.indexOf(t, offset); offset = i + t.length; return i; });
  /* Une voix d'homme manque pour un guide masculin : on grave un peu la voix disponible. */
  const basePitch = st.sexe === 'm' && v && !MALE.test(v.name) ? st.pitch - .25 : st.pitch;
  return new Promise(resolve => {
    let done = false; const finish = () => { if (!done) { done = true; resolve(); } };
    setTimeout(finish, estimate * 1.6 + 2500);
    speakTimer = setTimeout(() => {
      try {
        parts.forEach((t, i) => {
          const u = new SpeechSynthesisUtterance(t);
          u.lang = v?.lang || lang || 'fr-FR'; if (v) u.voice = v;
          if (onBoundary) u.onboundary = e => { if (e.name === undefined || e.name === 'word') onBoundary(offsets[i] + (e.charIndex || 0)); };
          u.rate = Math.min(1.4, st.rate * rate);
          u.pitch = Math.max(.5, Math.min(2, basePitch + (/[!]$/.test(t) ? .08 : 0) + (Math.random() - .5) * .06));
          u.volume = 1;
          if (i === parts.length - 1) u.onend = finish;
          u.onerror = e => {
            finish();
            if (!voiceWarned && e.error && !['interrupted', 'canceled'].includes(e.error)) {
              voiceWarned = true;
              toast(`La voix de ${W.guide.name} est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte.`);
            }
          };
          speechSynthesis.speak(u);
        });
        speechSynthesis.resume();
      } catch (e) { finish(); }
    }, 60);
  });
}
function hush() { clearTimeout(speakTimer); try { speechSynthesis.cancel(); } catch (e) {} }
/* ---------- Lisibilité : syllabes en couleurs alternées (mode dys) ---------- */
const VOY = 'aeiouyàâäéèêëîïôöùûüœæ';
const isV = c => VOY.includes(c.toLowerCase());
const INSEP = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'tr', 'vr', 'ch', 'ph', 'gn', 'th', 'qu', 'gu'];
function syllables(word) {
  const w = [...word], n = w.length, out = [];
  if (n <= 3) return [word];
  let start = 0, i = 0;
  while (i < n && !isV(w[i])) i++;                 /* attaque */
  while (i < n) {
    while (i < n && isV(w[i])) i++;                /* noyau vocalique */
    let j = i; while (j < n && !isV(w[j])) j++;    /* consonnes jusqu'à la voyelle suivante */
    if (j >= n) break;                             /* fin du mot : tout reste dans la syllabe */
    const cl = w.slice(i, j).join('').toLowerCase(), k = cl.length;
    let cut;
    if (k <= 1) cut = i;
    else if (INSEP.includes(cl.slice(-2))) cut = j - 2;
    else cut = j - 1;
    out.push(w.slice(start, cut).join('')); start = cut; i = j;
  }
  out.push(w.slice(start).join(''));
  return out.filter(Boolean);
}
/* Rend un texte : chaque mot dans un <span class="w"> (pour le surlignage), syllabes colorées en mode dys. */
function readable(text, { words = false } = {}) {
  const frag = document.createDocumentFragment();
  const dys = document.body.classList.contains('dys');
  if (!dys && !words) { frag.append(document.createTextNode(text)); return frag; }
  let pos = 0;
  String(text).split(/([A-Za-zÀ-ÿœæ]+(?:['’][A-Za-zÀ-ÿœæ]+)*)/).forEach(tok => {
    if (/^[A-Za-zÀ-ÿœæ]/.test(tok)) {
      const sp = el('span', 'w'); sp.dataset.at = pos;
      if (dys) syllables(tok).forEach((sy, k) => { const s = el('span', k % 2 ? 's2' : 's1'); s.textContent = sy; sp.append(s); });
      else sp.textContent = tok;
      frag.append(sp);
    } else if (tok) frag.append(document.createTextNode(tok));
    pos += tok.length;
  });
  return frag;
}
/* Lit un texte en surlignant le mot prononcé (si l'appareil le permet). */
function speakHighlight(container, text, opts = {}) {
  const spans = [...container.querySelectorAll('.w')];
  const clean = String(text);
  return speak(clean, { ...opts, onBoundary: at => {
    let cur = null;
    for (const s of spans) { if (+s.dataset.at <= at) cur = s; else break; }
    spans.forEach(s => s.classList.toggle('now', s === cur));
  } }).then(() => spans.forEach(s => s.classList.remove('now')));
}
function toast(msg) { const t = el('div', 'toast'); t.textContent = msg; t.setAttribute('role', 'status'); document.body.append(t); setTimeout(() => t.remove(), 6000); }
function renderSound() { const b = $('#sound'); b.setAttribute('aria-pressed', String(soundOn)); b.innerHTML = (soundOn ? SPEAKER : MUTED) + `<span class="lbl">${soundOn ? 'Son' : 'Muet'}</span>`; b.setAttribute('aria-label', soundOn ? 'Son activé' : 'Son coupé'); }
$('#sound').onclick = () => {
  soundOn = !soundOn; try { localStorage.setItem('ecole-son', soundOn ? '1' : '0'); } catch (e) {}
  renderSound();
  if (!soundOn) { hush(); try { keepAlive && keepAlive.pause(); } catch (e) {} }
  else { unlocked = false; unlockAudio(); sfx.pop(); speak(`Je t'entends ! Je suis ${W.guide.name}.`); }
};

function sparkle(target, n = 16) {
  if (REDUCED || !target) return;
  const r = target.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const s = el('i', 'spark'), a = (i / n) * Math.PI * 2, d = 50 + Math.random() * 80;
    s.style.left = r.left + r.width / 2 + 'px'; s.style.top = r.top + r.height / 2 + 'px';
    s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
    document.body.append(s); setTimeout(() => s.remove(), 1000);
  }
}

/* ================= Données : profils, progression, leçons =================
   En ligne (capacité db) : chaque compte a son espace privé data/users/<id>, retrouvé sur tous ses
   appareils. Sans compte ou hors claude.ai : tout reste dans le navigateur de l'appareil. */
const Store = {
  mode: 'local', db: null, uid: null, docs: {},
  key: 'ecole-v1',
  async init() {
    this.loadLocal();
    try {
      const [db, user] = await Promise.all([window.claude?.use?.('db'), window.claude?.use?.('user')]);
      const id = user ? await user.id() : null;
      if (db && id) {
        const snap = await db.collection('data/users/' + id).get();
        this.db = db; this.uid = id; this.mode = 'cloud';
        const local = this.docs; this.docs = {};
        snap.docs.forEach(d => { this.docs[d.id] = d.data(); });
        /* Première connexion : on reprend ce qui avait été créé sur cet appareil. */
        if (!snap.size && Object.keys(local).length) for (const [k, v] of Object.entries(local)) await this.put(k, v);
      }
    } catch (e) { this.mode = 'local'; }
  },
  loadLocal() { try { this.docs = JSON.parse(localStorage.getItem(this.key) || '{}'); } catch (e) { this.docs = {}; } },
  saveLocal() { try { localStorage.setItem(this.key, JSON.stringify(this.docs)); } catch (e) {} },
  all(kind) { return Object.entries(this.docs).filter(([, v]) => v && v.kind === kind).map(([k, v]) => ({ ...v, _id: k })); },
  async put(id, data) {
    this.docs[id] = data;
    if (this.mode === 'cloud') {
      try { await this.db.collection('data/users/' + this.uid).doc(id).set(data); }
      catch (e) {
        if (e && e.code === 'quota_exceeded') toast('L\'espace de sauvegarde est plein : supprime d\'anciennes leçons dans l\'espace adulte.');
        else { this.mode = 'local'; toast('Sauvegarde en ligne impossible : la progression est gardée sur cet appareil.'); }
        this.saveLocal();
      }
    } else this.saveLocal();
  },
  async del(id) {
    delete this.docs[id];
    if (this.mode === 'cloud') { try { await this.db.collection('data/users/' + this.uid).doc(id).delete(); } catch (e) {} }
    else this.saveLocal();
  },
  children() { return this.all('enfant').sort((a, b) => (a.cree || 0) - (b.cree || 0)); },
  progress(childId) { return this.all('progres').filter(p => p.enfant === childId); },
  lessons() { return this.all('lecon').map(d => ({ ...d.lecon, perso: true, _doc: d._id })); },
};

let LIB = [], INDEX = [];
async function loadData() {
  const get = async f => { try { const r = await fetch(f); return r.ok ? r.json() : []; } catch (e) { return []; } };
  [LIB, INDEX] = await Promise.all([get('bibliotheque.json'), get('programmes-index.json')]);
}
const allLessons = () => [...LIB, ...Store.lessons()];
const lessonById = id => allLessons().find(l => l.id === id);
const sectionById = id => INDEX.find(s => s.id === id);

/* ================= Navigation ================= */
let child = null;     /* profil en cours */
let run = 0;          /* change à chaque écran : les scripts de l'écran précédent s'arrêtent */
const gated = p => { const t = run; return p.then(v => (t === run ? v : new Promise(() => {}))); };
const wait = ms => gated(new Promise(r => setTimeout(r, REDUCED ? Math.min(ms, 150) : ms)));
let backTo = null;
function screen(back = null) {
  run++; hush(); stopAudio(); S = null; backTo = back;
  $('#back').hidden = !back;
  const v = $('#view'); v.innerHTML = '';
  window.scrollTo({ top: 0 });
  return v;
}
$('#back').onclick = () => backTo && backTo();
$('#home').onclick = () => showHome();
function setChild(c) {
  child = c; W = WORLDS[c?.univers] || WORLDS.animaux; applyWorld(W);
  document.body.classList.toggle('dys', !!c?.dys);
  if (c) startClock(); else clearInterval(clock);
  const who = $('#who'); who.hidden = !c; if (c) who.textContent = `${c.prenom} · ${c.niveau}`;
}

/* ================= Accueil : qui joue ? ================= */
function showHome() {
  setChild(null);
  const v = screen();
  const kids = Store.children();
  const wrap = el('div', 'panel');
  const head = el('div', 'glass on-scene panel'); head.style.gap = '4px';
  head.append(el('h1', 'h-title', 'Savanturier'), el('p', 'sub', 'Réviser le programme du CP au CM2, en jouant dans l\'univers de son choix.'));
  wrap.append(head);
  if (!kids.length) {
    const box = el('div', 'welcome');
    box.append(guideEl(WORLDS.animaux));
    const p = el('div', 'parch');
    p.append(el('p', '', 'Bonjour ! Pour commencer, crée le profil de l\'enfant qui va jouer. Tu pourras en ajouter d\'autres ensuite.'));
    p.append(childForm(null, c => { setChild(c); offerTest(); }));
    box.append(p); wrap.append(box);
  } else {
    const q = el('h2', 'on-scene', 'Qui joue aujourd\'hui ?'); q.style.fontSize = '24px'; wrap.append(q);
    const grid = el('div', 'profiles');
    kids.forEach(k => {
      const b = el('button', 'profile'); b.type = 'button';
      b.append(guideEl(WORLDS[k.univers] || WORLDS.animaux));
      const n = el('b'); n.textContent = k.prenom; b.append(n);
      const s = el('small'); s.textContent = `${k.niveau} · ${(WORLDS[k.univers] || WORLDS.animaux).label}`; b.append(s);
      b.onclick = () => { audio(); setChild(k); showMap('accueil'); speak(`Bonjour ${k.prenom} !`); };
      grid.append(b);
    });
    const add = el('button', 'profile add', '<b>+</b><small>Ajouter un enfant</small>'); add.type = 'button';
    add.onclick = () => {
      const v2 = screen(showHome); const p = el('div', 'parch panel');
      p.append(el('h2', '', 'Nouveau profil')); p.append(childForm(null, c => { setChild(c); offerTest(); }));
      v2.append(p);
    };
    grid.append(add);
    wrap.append(grid);
  }
  wrap.append(el('p', 'note on-scene', Store.mode === 'cloud'
    ? 'Les profils et la progression sont enregistrés dans ton compte : tu les retrouves sur tous tes appareils.'
    : 'Les profils et la progression sont enregistrés sur cet appareil.'));
  v.append(wrap);
}
const LANGUES = ['', 'anglais', 'arabe', 'espagnol', 'portugais', 'turc', 'roumain', 'polonais', 'italien', 'allemand', 'russe', 'ukrainien', 'chinois', 'vietnamien', 'tamoul', 'wolof', 'bambara', 'lingala', 'persan', 'albanais', 'serbe'];
function childForm(existing, done) {
  const f = el('form', 'form');
  f.innerHTML = `<label>Prénom<input id="f-prenom" maxlength="20" required autocomplete="off"></label>
    <div class="row"><label>Classe<select id="f-niveau">${LEVELS.map(l => `<option>${l}</option>`).join('')}</select></label>
    <label>Univers<select id="f-univers">${Object.entries(WORLDS).map(([k, w]) => `<option value="${k}"${k === 'animaux' ? ' selected' : ''}>${w.label}</option>`).join('')}</select></label></div>
    <details class="settings"><summary>Réglages pour l'adulte (lecture, clavier, temps d'écran, langue)</summary>
      <label class="check"><input type="checkbox" id="f-dys"> Mode dys : texte espacé, syllabes en couleurs alternées</label>
      <label class="check"><input type="checkbox" id="f-lire"> Tout lire à voix haute (aussi les réponses proposées)</label>
      <div class="row"><label>Clavier des dictées<select id="f-clavier"><option value="auto">Automatique (lettres du mot jusqu'au CE1)</option><option value="lettres">Lettres du mot seulement</option><option value="complet">Clavier complet</option></select></label>
      <label>Temps d'écran par jour<select id="f-temps"><option value="0">Sans limite</option>${[10, 15, 20, 30, 45, 60].map(n => `<option value="${n}">${n} minutes</option>`).join('')}</select></label></div>
      <label>Traduire les consignes pour le parent<select id="f-langue">${LANGUES.map(l => `<option value="${l}">${l ? cap(l) : 'Non'}</option>`).join('')}</select></label>
    </details>
    <button class="btn" type="submit">${existing ? 'Enregistrer' : 'C\'est parti !'}</button>`;
  const q = s => f.querySelector(s);
  if (existing) {
    q('#f-prenom').value = existing.prenom; q('#f-niveau').value = existing.niveau; q('#f-univers').value = existing.univers;
    q('#f-dys').checked = !!existing.dys; q('#f-lire').checked = !!existing.toutLire; q('#f-clavier').value = existing.clavier || 'auto';
    q('#f-temps').value = String(existing.tempsMax || 0); q('#f-langue').value = existing.langueParent || '';
  }
  f.onsubmit = async e => {
    e.preventDefault();
    const prenom = q('#f-prenom').value.trim().slice(0, 20);
    if (!prenom) return;
    const id = existing ? existing._id : 'enfant_' + uid();
    const { _id, ...old } = existing || {};
    const data = { ...old, kind: 'enfant', id, prenom, niveau: q('#f-niveau').value, univers: q('#f-univers').value, cree: existing?.cree || Date.now(),
      dys: q('#f-dys').checked, toutLire: q('#f-lire').checked, clavier: q('#f-clavier').value, tempsMax: +q('#f-temps').value, langueParent: q('#f-langue').value };
    q('button[type=submit]').disabled = true;
    await Store.put(id, data); audio(); sfx.magic();
    done({ ...data, _id: id });
  };
  return f;
}

/* ================= Carte de l'enfant : parcours et choix libre ================= */
const progOf = lid => Store.docs[`progres_${child._id}_${lid}`] || null;
const levelRank = l => LEVELS.indexOf(l);
function lessonCard(l, { locked = false, next = false, revision = false } = {}) {
  const p = progOf(l.id), stars = p?.etoiles || 0;
  const b = el('button', 'lesson' + (next ? ' next' : '')); b.type = 'button';
  b.innerHTML = `<span class="lv"></span><span class="t"></span><span class="stars">${[0, 1, 2].map(i => STAR.replace('<svg', `<svg class="${i < stars ? 'on' : ''}"`)).join('')}</span><span class="st"></span>`;
  b.querySelector('.lv').textContent = `${l.niveau} · ${SUBJECTS[l.matiere] || l.matiere}`;
  b.querySelector('.t').textContent = l.titre;
  b.querySelector('.st').textContent = locked ? 'Termine d\'abord la leçon d\'avant' : stars ? 'Réussie · rejouer' : next ? 'À toi de jouer !' : revision ? 'Révision' : 'À découvrir';
  if (l.perso) b.prepend(Object.assign(el('span', 'mine'), { textContent: 'Pour toi' }));
  if (locked) b.disabled = true;
  b.onclick = () => showLesson(l);
  return b;
}
const SUBJ_ICON = {
  francais: { color: '#D2477A', html: 'Aa' },
  maths: { color: '#2F6FD1', html: '1+2' },
  sciences: { color: '#1E9AA8', html: '<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 20c-4 0-7-3-7-7 0-5 7-9 7-9s7 4 7 9c0 4-3 7-7 7zM12 20V10"/></svg>' },
  histoire: { color: '#B5762A', html: '<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16"/></svg>' },
  anglais: { color: '#7A4FD6', html: 'Hi!' },
  emc: { color: '#2E8656', html: '<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5M15 14.5c2.3 0 4.2 1.6 4.8 4.5"/></svg>' },
};
const icoHTML = m => `<span class="ico" style="background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.55), ${SUBJ_ICON[m].color} 60%); box-shadow: 0 12px 18px -8px ${SUBJ_ICON[m].color}, inset 0 -4px 8px rgba(0,0,0,.18)">${SUBJ_ICON[m].html}</span>`;
const ICON = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z"/></svg>',
  path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="#FFFFFF"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="#4A6159" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 20h8"/></svg>',
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-6 1-9z" fill="#FF8A3D"/><path d="M12 12c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1 1-2 1.5-2.5.5 1 1 1.5 1.5 1.5 0-1.5-.5-2.5 0-4z" fill="#FFD36B"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="#4A6159" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>',
};
/* Le parcours d'une matière : leçons jusqu'au niveau de l'enfant, dans l'ordre des connaissances.
   Les classes précédentes restent ouvertes (révisions) ; celles de sa classe s'ouvrent une à une. */
function subjectPath(m) {
  const list = allLessons().filter(l => l.matiere === m && levelRank(l.niveau) <= levelRank(child.niveau))
    .sort((a, b) => levelRank(a.niveau) - levelRank(b.niveau) || (a.ordre || 0) - (b.ordre || 0));
  let open = true, nextMarked = false;
  return list.map(l => {
    const done = (progOf(l.id)?.etoiles || 0) > 0, chained = l.niveau === child.niveau;
    const next = open && !done && !nextMarked && chained;
    const item = { l, done, next, locked: chained && !open && !done, revision: !chained };
    if (next) nextMarked = true;
    if (chained && !done) open = false;
    return item;
  });
}
function nextLesson() {
  for (const m of Object.keys(SUBJECTS)) { const n = subjectPath(m).find(x => x.next); if (n) return n.l; }
  for (const m of Object.keys(SUBJECTS)) { const n = subjectPath(m).find(x => !x.done && !x.locked); if (n) return n.l; }
  return null;
}
/* ---------- Accueil : ce qui est prévu aujourd'hui (devoirs, dictée du jour, révisions, test) ---------- */
const devoirsDoc = () => Store.docs[`devoirs_${child._id}`];
function todayTiles(wrap) {
  const box = el('div', 'today');
  const dv = devoirsDoc();
  if (dv?.lecons?.length && today() <= dv.pour) {
    const t = el('section', 'tile task devoirs');
    const when = new Date(dv.pour + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    t.innerHTML = '<div><span class="kicker">Mes devoirs</span><b></b></div><div class="todo"></div>';
    t.querySelector('b').textContent = dv.pour === today() ? 'Pour aujourd\'hui' : `Pour ${when}`;
    if (dv.mot) t.querySelector('div').append(Object.assign(el('p', 'sm'), { textContent: dv.mot }));
    dv.lecons.map(lessonById).filter(Boolean).forEach(l => {
      const done = (progOf(l.id)?.maj || 0) >= dv.cree && !progOf(l.id)?.test;
      const b = el('button', 'todo-item' + (done ? ' done' : ''), `<span class="dot">${done ? ICON.check : ICON.play}</span><span></span>`); b.type = 'button';
      b.querySelector('span:last-child').textContent = l.titre; b.onclick = () => showLesson(l);
      t.querySelector('.todo').append(b);
    });
    box.append(t);
  }
  const sem = semaineActive();
  if (sem && !sem.fait?.[today()]) {
    const left = Math.round((new Date(sem.jusqu + 'T00:00').getTime() - dayStart()) / DAY);
    box.append(taskTile('Dictée du jour', left ? `Mes mots de la semaine · dictée dans ${left} jour${left > 1 ? 's' : ''}` : 'C\'est le jour de la dictée : dernier entraînement !', playSemaine, '#D2477A'));
  }
  const due = Review.due().length;
  if (due) box.append(taskTile('À revoir', `${due} petite${due > 1 ? 's' : ''} erreur${due > 1 ? 's' : ''} des jours passés`, playReview, '#F2A33A'));
  if (!child.testFait && LIB.length) box.append(taskTile('Mon test de départ', 'Quelques questions pour commencer au bon endroit', () => offerTest(), '#4C8FF5'));
  if (box.children.length) wrap.append(box);
}
function taskTile(kicker, text, go, color) {
  const t = el('button', 'tile task'); t.type = 'button';
  t.innerHTML = `<span class="dot" style="background:${color}">${ICON.play}</span><div><span class="kicker"></span><b></b></div>`;
  t.querySelector('.kicker').textContent = kicker; t.querySelector('b').textContent = text; t.onclick = go;
  return t;
}

/* ---------- Mes trophées : cabane de Noisette, histoire, badges, records ---------- */
function cabaneSVG(n) {
  const g = [
    '<g><path d="M92 0v46" stroke="#5B3A22" stroke-width="3"/><rect x="78" y="46" width="28" height="36" rx="8" fill="#FFC93C" stroke="#9C5A33" stroke-width="3"/><circle cx="92" cy="64" r="26" fill="#FFE07A" opacity=".35"/></g>',
    '<ellipse cx="300" cy="300" rx="150" ry="26" fill="#E8604C"/><ellipse cx="300" cy="300" rx="110" ry="17" fill="none" stroke="#FFD36B" stroke-width="5"/>',
    '<g><path d="M40 272h44l-6 40H46z" fill="#C9601C"/><circle cx="52" cy="256" r="11" fill="#E86A8A"/><circle cx="70" cy="248" r="11" fill="#FFC93C"/><circle cx="64" cy="264" r="10" fill="#4C8FF5"/><path d="M62 272v-14" stroke="#2E8656" stroke-width="4"/></g>',
    '<g><rect x="410" y="128" width="150" height="10" rx="3" fill="#7A4A2A"/>' + ['#E8604C', '#4C8FF5', '#FFC93C', '#4FB37A', '#7A4FD6', '#E86A8A'].map((c, i) => `<rect x="${418 + i * 22}" y="${88 + (i % 2) * 6}" width="18" height="${40 - (i % 2) * 6}" rx="3" fill="${c}"/>`).join('') + '</g>',
    '<g><rect x="140" y="64" width="96" height="70" rx="6" fill="#FFF4DD" stroke="#C07C4A" stroke-width="7"/><path d="M150 124l26-34 18 22 12-14 22 26z" fill="#4FB37A"/><circle cx="214" cy="84" r="8" fill="#FFC93C"/></g>',
    '<path d="M400 300c0-26 70-30 84-4 10 18-6 28-42 28s-42-8-42-24z" fill="#7A4FD6"/>',
    '<path d="M0 26 Q150 70 300 26 T600 26" fill="none" stroke="#5B3A22" stroke-width="2"/>' + Array.from({ length: 11 }, (_, i) => { const x = 25 + i * 52, y = 26 + Math.sin((x / 600) * Math.PI * 2) * -2 + (i % 5 ? 18 : 10); return `<path d="M${x - 10} ${y - 10}h20l-10 18z" fill="${['#E8604C', '#FFC93C', '#4C8FF5', '#4FB37A'][i % 4]}"/>`; }).join(''),
    '<g><path d="M318 312l14-44 14 44M332 268v44" stroke="#5B3A22" stroke-width="4" fill="none"/><rect x="306" y="236" width="64" height="18" rx="9" transform="rotate(-28 338 245)" fill="#2F6FD1"/></g>',
    '<g><path d="M540 316h28M554 316v-16" stroke="#7A4A2A" stroke-width="5"/><circle cx="554" cy="276" r="24" fill="#4C8FF5"/><path d="M538 268c8 4 12-6 22-2s6 14 12 14M544 290c6-4 14 0 18-4" stroke="#4FB37A" stroke-width="6" fill="none" stroke-linecap="round"/></g>',
    '<g><rect x="176" y="282" width="68" height="40" rx="6" fill="#9C5A33"/><path d="M176 290c0-22 68-22 68 0z" fill="#C07C4A"/><rect x="204" y="284" width="12" height="16" rx="3" fill="#FFC93C"/></g>',
    '<g><path d="M486 60h32v10a16 16 0 0 1-32 0z" fill="#FFC93C"/><path d="M496 86h12v10h8v6h-28v-6h8z" fill="#E88A00"/></g>',
    '<g><circle cx="330" cy="58" r="30" fill="#FFF6C2" opacity=".55"/><path d="M330 36l6 14 15 1-12 9 4 15-13-8-13 8 4-15-12-9 15-1z" fill="#FFC93C"/></g>',
  ];
  return `<svg class="cabane" viewBox="0 0 600 340" role="img" aria-label="La cabane de Noisette, avec ${n} objet${n > 1 ? 's' : ''}">
    <rect width="600" height="340" rx="24" fill="#E9C08F"/>${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${30 + i * 28}H600" stroke="#D6A774" stroke-width="2"/>`).join('')}
    <rect y="270" width="600" height="70" fill="#B67B4C"/><path d="M0 270H600" stroke="#8E5A35" stroke-width="5"/>
    <rect x="262" y="96" width="136" height="104" rx="52" fill="#BFE5FF" stroke="#9C5A33" stroke-width="8"/><path d="M330 96v104M262 150h136" stroke="#9C5A33" stroke-width="5"/>
    <circle cx="300" cy="128" r="10" fill="#FFFFFF" opacity=".8"/>
    ${g.slice(0, n).join('')}</svg>`;
}
function showTrophees(wrap) {
  const stars = totalStars(), n = cabaneCount(stars);
  const cab = el('section', 'glass trophy-sec');
  cab.innerHTML = `<h3>La cabane de Noisette</h3><div class="cabane-wrap">${cabaneSVG(n)}</div><p class="sm"></p><div class="chips"></div>`;
  const nx = CABANE.find(([k]) => stars < k);
  cab.querySelector('.sm').textContent = `Tu as ${stars} étoile${stars > 1 ? 's' : ''}. ` + (nx ? `Encore ${nx[0] - stars} étoile${nx[0] - stars > 1 ? 's' : ''} et Noisette recevra ${nx[1]} !` : 'La cabane est complète, quelle merveille !');
  CABANE.forEach(([k, name], i) => cab.querySelector('.chips').append(Object.assign(el('span', 'chip' + (i < n ? ' on' : '')), { textContent: i < n ? name : `${k} ★` })));
  wrap.append(cab);
  const st = el('section', 'glass trophy-sec'); st.innerHTML = '<h3>L\'histoire des Savanturiers</h3><p class="sm">Un nouvel épisode s\'ouvre à chaque leçon terminée.</p><div class="episodes"></div>';
  const open = episodesOpen();
  EPISODES.forEach(([t], i) => {
    const b = el('button', 'episode' + (i < open ? '' : ' locked'), `<b>${i + 1}</b><span></span>`); b.type = 'button';
    b.querySelector('span').textContent = i < open ? t : 'À découvrir';
    if (i < open) b.onclick = () => showEpisode(i, () => showMap('trophees')); else b.disabled = true;
    st.querySelector('.episodes').append(b);
  });
  wrap.append(st);
  const bd = el('section', 'glass trophy-sec'); bd.innerHTML = '<h3>Mes badges</h3><div class="badges"></div>';
  const list = badgesOf();
  if (!list.length) bd.append(el('p', 'sm', 'Gagne au moins 2 étoiles dans une leçon pour recevoir son badge.'));
  list.forEach(b => { const x = el('div', 'badge', `${icoHTML(SUBJ_ICON[b.matiere] ? b.matiere : 'francais')}<span></span>`); x.querySelector('span').textContent = b.nom; bd.querySelector('.badges').append(x); });
  wrap.append(bd);
  const rec = Store.docs[`records_${child._id}`]?.best || {};
  if (Object.keys(rec).length) {
    const rs = el('section', 'glass trophy-sec'); rs.innerHTML = '<h3>Mes records de calcul rapide</h3><div class="chips"></div>';
    Object.entries(rec).forEach(([k, v]) => { const [lid, nm] = k.split(':'); rs.querySelector('.chips').append(Object.assign(el('span', 'chip on'), { textContent: `${lessonById(lid)?.titre || nm} : ${v}` })); });
    wrap.append(rs);
  }
}

const SHORT_SUBJ = { francais: 'Français', maths: 'Maths', sciences: 'Sciences', histoire: 'Histoire-géo', anglais: 'Anglais', emc: 'Vivre ensemble' };
let mapTab = 'accueil', mapSubject = 'francais';
function showMap(tab, subject) {
  if (typeof tab !== 'string') tab = mapTab;
  mapTab = tab;
  if (subject) mapSubject = subject;
  if (checkTime()) return;
  const v = screen(showHome);
  const wrap = el('div', 'panel');
  v.append(wrap);
  const dock = el('nav', 'dock'); dock.setAttribute('aria-label', 'Navigation');
  [['accueil', 'Accueil', ICON.home], ['parcours', 'Mon parcours', ICON.path], ['libre', 'Toutes les leçons', ICON.grid], ['trophees', 'Mes trophées', ICON.trophy]].forEach(([k, t, ic]) => {
    const b = el('button', '', `${ic}<span>${t}</span>`); b.type = 'button'; b.setAttribute('aria-label', t);
    if (k === tab) b.setAttribute('aria-current', 'page');
    b.onclick = () => showMap(k);
    dock.append(b);
  });
  v.append(dock);

  if (tab === 'accueil') {
    const hello = el('div', 'hello on-scene');
    hello.style.justifySelf = 'stretch';
    const d = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    hello.innerHTML = `<div><span class="date"></span><h1></h1></div>`;
    hello.querySelector('.date').textContent = cap(d);
    hello.querySelector('h1').textContent = `Bonjour ${child.prenom} !`;
    const sk = Days.streak(), chip = el('span', 'streak', ICON.flame + '<span></span>');
    chip.querySelector('span').textContent = sk >= 2 ? `${sk} jours d'affilée, bravo !` : sk === 1 ? 'Tu as joué aujourd\'hui !' : 'Une petite leçon pour bien commencer ?';
    hello.append(chip);
    wrap.append(hello);
    if (prefs().toutLire) speak(`Bonjour ${child.prenom} ! ${chip.textContent}`);
    todayTiles(wrap);
    const bento = el('div', 'bento');
    /* Grande carte : la prochaine leçon du parcours. */
    const nl = nextLesson();
    const hero = el('section', 'hero');
    const txt = el('div', 'txt');
    if (nl) {
      const p = progOf(nl.id);
      txt.innerHTML = `<span class="tag"></span><h2></h2><p></p>`;
      txt.querySelector('.tag').textContent = `${SUBJECTS[nl.matiere]} · ${nl.niveau}`;
      txt.querySelector('h2').textContent = nl.titre;
      txt.querySelector('p').textContent = p ? `Déjà ${p.etoiles} étoile${p.etoiles > 1 ? 's' : ''} sur 3` : `${W.guide.name} t'attend pour une nouvelle leçon.`;
      const go = el('button', 'go', `${ICON.play.replace('#FFFFFF', 'currentColor')}${p ? 'Continuer' : 'Commencer'}`); go.type = 'button';
      go.querySelector('svg').style.width = '22px'; go.onclick = () => showLesson(nl);
      txt.append(go);
    } else {
      txt.innerHTML = '<span class="tag">Bravo !</span><h2>Tu as fini ton parcours</h2><p>Rejoue tes leçons préférées pour gagner toutes les étoiles.</p>';
    }
    hero.append(txt, guideEl());
    bento.append(hero);
    /* Objectif du jour : deux leçons jouées aujourd'hui. */
    const today = new Date().toDateString();
    const played = Store.progress(child._id).filter(x => x.maj && new Date(x.maj).toDateString() === today).length;
    const goal = el('section', 'tile goal');
    goal.innerHTML = `<div><span class="sm" style="color:var(--accent-deep);font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:13px">Objectif du jour</span><b></b></div>
      <svg width="110" height="86" viewBox="0 0 140 110" aria-hidden="true" style="align-self:center"><ellipse cx="70" cy="102" rx="52" ry="7" fill="#17302A" opacity=".12"/><rect x="20" y="46" width="100" height="54" rx="14" fill="#9C5A33"/><path d="M20 52 Q20 18 70 18 Q120 18 120 52 Z" fill="#C07C4A"/><rect x="20" y="46" width="100" height="10" fill="#FFC93C"/><rect x="60" y="44" width="20" height="24" rx="6" fill="#FFC93C"/></svg>
      <div style="display:grid;gap:6px"><div class="bar"><i></i></div><span class="sm"></span></div>`;
    goal.querySelector('b').textContent = 'Joue 2 leçons aujourd\'hui';
    goal.querySelector('.bar i').style.width = Math.min(100, played * 50) + '%';
    goal.querySelectorAll('.sm')[1].textContent = played >= 2 ? 'Objectif atteint, bravo !' : `${played} sur 2`;
    bento.append(goal);
    /* Une tuile par matière. */
    Object.entries(SUBJECTS).forEach(([m, name]) => {
      const items = subjectPath(m);
      if (!items.length) return;
      const t = el('button', 'tile'); t.type = 'button';
      t.innerHTML = `${icoHTML(m)}<div><b></b><span class="sm"></span></div>`;
      t.querySelector('b').textContent = name.replace(' (EMC)', '');
      t.querySelector('.sm').textContent = `${items.filter(x => x.done).length} leçon${items.filter(x => x.done).length > 1 ? 's' : ''} réussie${items.filter(x => x.done).length > 1 ? 's' : ''} sur ${items.length}`;
      t.onclick = () => showMap('parcours', m);
      bento.append(t);
    });
    wrap.append(bento);
  } else if (tab === 'parcours') {
    /* Une seule matière à la fois : onglets en haut, puis le chemin de la classe, puis les révisions. */
    const subs = Object.keys(SUBJECTS).filter(m => subjectPath(m).length);
    if (!subs.includes(mapSubject)) mapSubject = subs[0];
    if (!subs.length) { wrap.append(el('p', 'sub on-scene', 'Aucune leçon pour ce niveau pour l\'instant. Un adulte peut en créer dans l\'espace adulte.')); return; }
    const tabsS = el('div', 'subj-tabs'); tabsS.setAttribute('role', 'tablist');
    subs.forEach(m => {
      const b = el('button', 'subj-tab', `${icoHTML(m)}<span></span>`); b.type = 'button'; b.setAttribute('role', 'tab');
      b.querySelector('span:last-child').textContent = SHORT_SUBJ[m] || SUBJECTS[m];
      b.setAttribute('aria-selected', String(m === mapSubject));
      b.onclick = () => showMap('parcours', m);
      tabsS.append(b);
    });
    wrap.append(tabsS);
    const items = subjectPath(mapSubject), cur = items.filter(x => !x.revision), rev = items.filter(x => x.revision);
    const sec = el('section', 'subject glass');
    const h = el('h3', '', icoHTML(mapSubject)); h.append(document.createTextNode(`${SUBJECTS[mapSubject]} · ${child.niveau}`)); sec.append(h);
    const nDone = cur.filter(x => x.done).length;
    const prog = el('div', 'path-progress', `<div class="bar"><i></i></div><span class="sm"></span>`);
    prog.querySelector('i').style.width = (cur.length ? nDone / cur.length * 100 : 0) + '%';
    prog.querySelector('.sm').textContent = cur.length ? `${nDone} leçon${nDone > 1 ? 's' : ''} réussie${nDone > 1 ? 's' : ''} sur ${cur.length}` : 'Pas encore de leçon de ta classe dans cette matière.';
    sec.append(prog);
    const stepEl = ({ l, done, next, locked, revision }, i) => {
      const b = el('button', 'step' + (done ? ' done' : next ? ' next' : '') + (locked ? ' locked' : '')); b.type = 'button';
      const icon = done ? ICON.check : next ? ICON.play : locked ? ICON.lock : ICON.book;
      b.innerHTML = `<span class="dot">${icon}</span><span class="txt"><span class="num"></span><span class="t"></span><span class="stat"></span></span>`;
      b.querySelector('.num').textContent = revision ? l.niveau : `Étape ${i + 1}`;
      b.querySelector('.t').textContent = l.titre;
      const p = progOf(l.id);
      b.querySelector('.stat').textContent = locked ? 'Plus tard' : done ? '★'.repeat(p?.etoiles || 0) || 'Acquise' : next ? 'À toi !' : revision ? 'Révision' : 'À découvrir';
      if (l.perso) b.querySelector('.txt').prepend(Object.assign(el('span', 'mine'), { textContent: 'Pour toi' }));
      b.setAttribute('aria-label', `${l.titre} : ${b.querySelector('.stat').textContent}`);
      if (locked) b.disabled = true; else b.onclick = () => showLesson(l);
      return b;
    };
    const path = el('div', 'path');
    cur.forEach((x, i) => path.append(stepEl(x, i)));
    sec.append(path);
    if (rev.length) {
      const det = el('details', 'revisions');
      det.innerHTML = `<summary>Revoir les classes d'avant (${rev.length} leçon${rev.length > 1 ? 's' : ''})</summary>`;
      const g = el('div', 'path'); rev.forEach((x, i) => g.append(stepEl(x, i))); det.append(g);
      sec.append(det);
    }
    wrap.append(sec);
    requestAnimationFrame(() => path.querySelector('.next')?.scrollIntoView({ block: 'nearest', behavior: 'auto' }));
  } else if (tab === 'trophees') {
    showTrophees(wrap);
  } else {
    const filters = el('div', 'filters');
    const selM = el('select', ''); selM.innerHTML = `<option value="">Toutes les matières</option>${Object.entries(SUBJECTS).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}`;
    const selL = el('select', ''); selL.innerHTML = `<option value="">Tous les niveaux</option>${LEVELS.map(l => `<option>${l}</option>`).join('')}`;
    [selM, selL].forEach(x => { x.className = 'pill'; x.onchange = draw; filters.append(x); });
    selM.setAttribute('aria-label', 'Matière'); selL.setAttribute('aria-label', 'Niveau');
    const grid = el('div', 'grid-lessons');
    wrap.append(filters, grid);
    function draw() {
      grid.innerHTML = '';
      allLessons().filter(l => (!selM.value || l.matiere === selM.value) && (!selL.value || l.niveau === selL.value))
        .sort((a, b) => (b.perso ? 1 : 0) - (a.perso ? 1 : 0) || levelRank(a.niveau) - levelRank(b.niveau) || (a.ordre || 0) - (b.ordre || 0))
        .forEach(l => grid.append(lessonCard(l)));
    }
    draw();
  }
}

/* ================= Joueur de leçon ================= */
let S = null;
function sceneShell(title, level, back) {
  const v = screen(back);
  const sc = el('section', 'scene');
  sc.innerHTML = `<div class="scene-head"><h2></h2><span class="lv"></span></div><div class="dialog"></div>
    <div class="arena"><div class="stage"><div class="board"></div><div class="side"></div></div><div class="play"></div></div>`;
  sc.querySelector('h2').textContent = title; sc.querySelector('.lv').textContent = level;
  const dialog = sc.querySelector('.dialog'), lumi = guideEl();
  const speech = el('div', 'parch speech', '<p class="txt" aria-live="polite"></p><div class="acts"></div>');
  const listen = el('button', 'listen', SPEAKER + 'Réécouter'); listen.type = 'button';
  listen.onclick = () => { unlocked = false; unlockAudio(); speak(S.txt.innerHTML); };
  speech.querySelector('.acts').append(listen);
  addTranslate(speech.querySelector('.acts'), () => S.txt.textContent, speech);
  dialog.append(lumi, speech);
  v.append(sc);
  S = { sc, dialog, lumi, txt: speech.querySelector('.txt'), acts: speech.querySelector('.acts'), board: sc.querySelector('.board'), side: sc.querySelector('.side'), play: sc.querySelector('.play') };
  return S;
}
/* Traduction de la consigne pour le parent (langue choisie dans le profil), par l'IA. */
const tradCache = {};
function addTranslate(acts, getText, host) {
  const lang = prefs().langue; if (!lang) return;
  const b = el('button', 'listen', `Traduire (${esc(lang)})`); b.type = 'button';
  b.onclick = async () => {
    const text = getText().trim(); if (!text) return;
    let out = host.querySelector('.trad'); if (!out) { out = el('p', 'trad'); host.append(out); }
    out.textContent = '…';
    const key = lang + '|' + text;
    try {
      if (!tradCache[key]) {
        const sample = await Promise.resolve(window.claude?.use?.('sample')).catch(() => null);
        if (!sample) { out.textContent = 'La traduction demande l\'IA : ouvre l\'application depuis claude.ai.'; return; }
        const r = await sample(`Traduis en ${lang} cette consigne d'un jeu éducatif pour enfant, pour que son parent la comprenne. Réponds uniquement par la traduction, sans guillemets.\n\n${text}`, { modelTier: 'quick' });
        tradCache[key] = String(r.text || '').trim();
      }
      out.textContent = tradCache[key];
    } catch (e) { out.textContent = e?.code === 'rate_limited' ? 'Trop de demandes : réessaie dans un moment.' : 'La traduction n\'a pas pu être faite.'; }
  };
  acts.append(b);
}
/* Le guide parle : le texte est déjà échappé ou construit par l'application. */
function say(html, mood = 'happy') {
  if (!S) return Promise.resolve();
  S.txt.innerHTML = html; S.dialog.querySelector('.trad')?.remove();
  S.lumi.classList.remove('think', 'cheer'); try { void S.lumi.getBBox(); } catch (e) {}
  if (mood !== 'happy') S.lumi.classList.add(mood);
  return speak(html);
}
function cont(label = 'Continuer') {
  return gated(new Promise(res => {
    const b = el('button', 'btn small', esc(label)); b.type = 'button';
    S.acts.append(b); b.focus({ preventScroll: true });
    b.onclick = () => { b.remove(); sfx.pop(); res(); };
  }));
}
function revealPlay() {
  if (!S) return;
  const r = S.play.getBoundingClientRect();
  if (r.bottom > innerHeight - 8 || r.top < 0) S.dialog.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' });
}
function fly(fromEl, toEl, html) {
  return gated(new Promise(res => {
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect(), f = el('div', 'flyer', html);
    const ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    f.style.left = ax + 'px'; f.style.top = ay + 'px'; document.body.append(f);
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transform = `translate(${b.left + b.width / 2 - ax}px, ${b.top + b.height / 2 - ay}px)`; }));
    setTimeout(() => { f.remove(); res(); }, REDUCED ? 30 : 760);
  }));
}

/* Réglages de l'enfant en cours (définis par l'adulte dans son profil). */
const prefs = () => ({ dys: !!child?.dys, toutLire: !!child?.toutLire, clavier: child?.clavier || 'auto', tempsMax: +child?.tempsMax || 0, langue: child?.langueParent || '' });

/* Bulles : l'enfant éclate la bonne réponse.
   - « Je ne sais pas » : le guide explique, la bonne bulle brille, les autres disparaissent ;
   - après deux erreurs, il ne reste que deux bulles (la difficulté s'adapte) ;
   - en « tout lire à voix haute », les choix sont lus. */
function choose(values, correct, onWrong, opts = {}) {
  return gated(new Promise(res => {
    S.play.innerHTML = '';
    const opts2 = shuffle([...new Set(values.map(String))]);
    let wrongs = 0;
    const bubbles = opts2.map(v => {
      const b = el('button', 'bubble' + (v.length > 4 ? ' long' : '')); b.type = 'button'; b.dataset.v = v;
      b.append(readable(v));
      b.onclick = () => {
        if (b.classList.contains('wrong')) return;
        if (v === String(correct)) {
          b.classList.add('popped'); sfx.ok(); sparkle(b, 10);
          S.play.querySelectorAll('.bubble').forEach(x => x.onclick = null);
          setTimeout(() => { S.play.innerHTML = ''; res(v); }, REDUCED ? 50 : 420);
        } else {
          b.classList.add('wrong'); sfx.no(); wrongs++; onWrong && onWrong(v);
          if (wrongs === 2) keepTwo();
        }
      };
      S.play.append(b); return b;
    });
    const keepTwo = () => {
      const others = bubbles.filter(x => x.dataset.v !== String(correct) && !x.classList.contains('wrong'));
      others.slice(1).forEach(x => x.remove());
    };
    const idk = el('button', 'idk', 'Je ne sais pas'); idk.type = 'button';
    idk.onclick = () => {
      idk.remove(); opts.onHelp && opts.onHelp();
      bubbles.forEach(x => { if (x.dataset.v !== String(correct)) x.remove(); else x.classList.add('hint'); });
      say(`Pas de souci, on apprend ensemble ! ${opts.help ? esc(opts.help) + ' ' : ''}La bonne réponse brille : touche-la.`);
    };
    S.play.append(idk);
    S.play.querySelector('.bubble')?.focus({ preventScroll: true });
    revealPlay();
    if (prefs().toutLire && soundOn && opts2.length > 1) setTimeout(() => { if (S && S.play.contains(bubbles[0])) speak(`Est-ce ${opts2.slice(0, -1).join(', ')}, ou ${opts2[opts2.length - 1]} ?`); }, 300);
  }));
}
/* Clavier de cristaux (calculs, à partir du CE1). */
function keypad(correct, onWrong, opts = {}) {
  return gated(new Promise(res => {
    S.play.innerHTML = '';
    const box = el('div', 'keypad'), disp = el('div', 'kp-display'), keys = el('div', 'kp-keys');
    disp.setAttribute('aria-live', 'polite');
    let val = '';
    const show = () => { disp.textContent = val || ' '; };
    const press = k => {
      if (k === 'del') { val = val.slice(0, -1); sfx.pop(); }
      else if (k === 'ok') {
        if (!val) return;
        if (+val === correct) { sfx.ok(); sparkle(disp, 10); S.play.innerHTML = ''; res(+val); return; }
        sfx.no(); disp.classList.add('shake'); setTimeout(() => disp.classList.remove('shake'), 500); onWrong && onWrong(+val); val = '';
      } else if (val.length < (opts.max || 4)) { val += k; sfx.count(+k); }
      show();
    };
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(k => { const b = el('button', 'crystal', String(k)); b.type = 'button'; b.onclick = () => press(String(k)); keys.append(b); });
    const del = el('button', 'crystal del', 'Effacer'); del.type = 'button'; del.onclick = () => press('del');
    const ok = el('button', 'crystal ok', 'Valider'); ok.type = 'button'; ok.onclick = () => press('ok');
    keys.append(del, ok); box.append(disp, keys);
    if (!opts.noHelp) {
      const idk = el('button', 'idk', 'Je ne sais pas'); idk.type = 'button';
      idk.onclick = () => { idk.remove(); opts.onHelp && opts.onHelp(); say(`Pas de souci ! ${opts.help ? esc(opts.help) + ' ' : ''}La réponse est ${correct}. Tape-la sur les cristaux.`); };
      box.append(idk);
    }
    S.play.append(box); show();
    keys.firstChild.focus({ preventScroll: true }); revealPlay();
    S._press = press; window.__ecole.reponse = correct;   /* pour les tests automatisés */
  }));
}
/* Glisser une étiquette vers une cible, ou toucher l'étiquette puis la cible. */
function dragify(st, targetSel, onTap, onDrop) {
  st.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const sx = e.clientX, sy = e.clientY; let ghost = null, hover = null;
    try { st.setPointerCapture(e.pointerId); } catch (_) {}
    const under = ev => { const t = document.elementFromPoint(ev.clientX, ev.clientY); return t && t.closest(targetSel); };
    const move = ev => {
      if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) { ghost = st.cloneNode(true); ghost.classList.remove('held'); ghost.classList.add('ghost'); document.body.append(ghost); st.classList.add('lifted'); }
      if (ghost) { ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; const t = under(ev); if (hover !== t) { hover?.classList.remove('hover'); hover = t; hover?.classList.add('hover'); } }
    };
    const up = ev => {
      st.removeEventListener('pointermove', move); st.removeEventListener('pointerup', up); st.removeEventListener('pointercancel', up);
      hover?.classList.remove('hover');
      if (ghost) { ghost.remove(); st.classList.remove('lifted'); const t = ev.type === 'pointerup' && under(ev); if (t) onDrop(t); }
      else if (ev.type === 'pointerup') onTap();
    };
    st.addEventListener('pointermove', move); st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  });
  st.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } });
}
/* Placer des étiquettes dans des cibles. `fits(tag, target)` dit si c'est la bonne cible. */
function placeTags(tags, targets, fits, onPlaced, onWrong, label) {
  return gated(new Promise(res => {
    S.play.innerHTML = '';
    const tray = el('div', 'tray');
    if (label) { const l = el('span', 'tray-label'); l.innerHTML = label; tray.append(l); }
    const stones = el('div', 'stones'); tray.append(stones); S.play.append(tray);
    let selected = null, left = tags.length;
    const select = st => { selected?.classList.remove('held'); selected = selected === st ? null : st; if (selected) { selected.classList.add('held'); sfx.pop(); } };
    const tryPlace = (st, target) => {
      if (fits(st._tag, target)) {
        st.remove(); selected = null; sfx.ok(); onPlaced(st._tag, target); left--;
        if (!left) { cleanup(); res(); } else stones.firstChild?.focus({ preventScroll: true });
      } else {
        sfx.no(); selected?.classList.remove('held'); selected = null;
        st.classList.add('shake'); setTimeout(() => st.classList.remove('shake'), 500);
        onWrong(st._tag, target);
      }
    };
    targets.forEach(t => {
      t.classList.add('drop'); t.tabIndex = 0; t.setAttribute('role', 'button');
      t.onclick = () => selected && tryPlace(selected, t);
      t.onkeydown = e => { if ((e.key === 'Enter' || e.key === ' ') && selected) { e.preventDefault(); tryPlace(selected, t); } };
    });
    tags.forEach(tag => {
      const st = el('button', 'stone' + (String(tag.texte).length > 2 ? ' tag' : '')); st.type = 'button'; st.textContent = tag.texte; st._tag = tag;
      stones.append(st);
      dragify(st, '.drop', () => select(st), t => tryPlace(st, t));
    });
    stones.firstChild?.focus({ preventScroll: true }); revealPlay();
    function cleanup() { targets.forEach(t => { t.classList.remove('drop'); t.onclick = t.onkeydown = null; t.removeAttribute('tabindex'); t.removeAttribute('role'); }); S.play.innerHTML = ''; }
  }));
}

/* Suivi des réussites pendant une leçon. */
function tracker(total) {
  const t = { total, done: 0, errors: 0, byType: {} };
  t.ok = type => { t.done++; (t.byType[type] ||= { ok: 0, err: 0 }).ok++; drawProgress(t); };
  t.err = type => { t.errors++; (t.byType[type] ||= { ok: 0, err: 0 }).err++; };
  return t;
}
function drawProgress(t) {
  if (!S) return;
  const liq = S.side.querySelector('.liquid'); if (liq) liq.style.transform = `scaleY(${Math.min(1, t.done / Math.max(1, t.total))})`;
  const dots = S.side.querySelector('.progress-dots');
  if (dots) dots.innerHTML = Array.from({ length: t.total }, (_, i) => `<i class="${i < t.done ? 'on' : ''}"></i>`).join('');
}

/* ================= Mémoire de l'enfant : révisions, journées, records ================= */
const DAY = 864e5;
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => ymd(new Date());
const dayStart = (plus = 0) => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime() + plus * DAY; };
let curLesson = null;   /* leçon en cours, pour retrouver d'où vient une erreur */
/* Révision des erreurs (méthode des boîtes) : une erreur revient le lendemain, puis à 3 et 7 jours. */
const Review = {
  INTERVALS: [1, 3, 7],
  key() { return `revoir_${child._id}`; },
  doc() { const k = this.key(); return (Store.docs[k] ||= { kind: 'revoir', enfant: child._id, items: {}, acquis: 0 }); },
  add(k, ex, titre) {
    if (!child || !k || curLesson?.special === 'test') return;
    const d = this.doc(), it = d.items[k];
    d.items[k] = { ex, titre: titre || curLesson?.titre || '', box: 0, due: dayStart(1), fails: (it?.fails || 0) + 1, vu: Date.now() };
    const keys = Object.keys(d.items);
    if (keys.length > 250) keys.sort((x, y) => d.items[x].vu - d.items[y].vu).slice(0, keys.length - 250).forEach(x => delete d.items[x]);
    this.dirty = true;
  },
  result(k, ok) {
    const d = this.doc(), it = d.items[k]; if (!it) return;
    if (ok) { it.box++; if (it.box >= this.INTERVALS.length) { delete d.items[k]; d.acquis = (d.acquis || 0) + 1; } else it.due = dayStart(this.INTERVALS[it.box]); }
    else { it.box = 0; it.due = dayStart(1); }
    this.dirty = true;
  },
  due() { if (!child) return []; const d = Store.docs[this.key()]; return d ? Object.entries(d.items).filter(([, it]) => it.due <= Date.now()) : []; },
  async flush() { if (this.dirty && child) { this.dirty = false; await Store.put(this.key(), this.doc()); } },
};
/* Journal des journées : séances, minutes, série de jours. */
const Days = {
  key() { return `jours_${child._id}`; },
  doc() { const k = this.key(); return (Store.docs[k] ||= { kind: 'jours', enfant: child._id, dates: {}, sessions: 0 }); },
  addSession() { const d = this.doc(); const t = (d.dates[today()] ||= { min: 0, sessions: 0 }); t.sessions++; d.sessions = (d.sessions || 0) + 1; return Store.put(this.key(), d); },
  addSeconds(sec) { const d = this.doc(); const t = (d.dates[today()] ||= { min: 0, sessions: 0 }); t.min = Math.round((t.min + sec / 60) * 10) / 10; },
  minutesToday() { return Store.docs[`jours_${child._id}`]?.dates?.[today()]?.min || 0; },
  streak() {
    const dates = Store.docs[`jours_${child?._id}`]?.dates || {};
    const has = k => (dates[k]?.sessions || 0) > 0;
    let n = 0, d = new Date();
    if (!has(ymd(d))) d.setDate(d.getDate() - 1);
    while (has(ymd(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  },
};
const Records = {
  key() { return `records_${child._id}`; },
  get(k) { return Store.docs[this.key()]?.best?.[k] || 0; },
  async set(k, v) { const d = (Store.docs[this.key()] ||= { kind: 'records', enfant: child._id, best: {} }); if (v > (d.best[k] || 0)) { d.best[k] = v; await Store.put(this.key(), d); return true; } return false; },
};

/* ================= Exercices ================= */
const RANKS = ['c', 'd', 'u'];
const RNC = { c: 'Centaines', d: 'Dizaines', u: 'Unités' };
const RN = { c: 'centaines', d: 'dizaines', u: 'unités' };
const COLOR = { c: 'verte', d: 'rose', u: 'bleue' };

/* Nombre d'étapes réussies que compte chaque exercice (pour remplir le récipient). */
function stepsOf(ex) {
  switch (ex.type) {
    case 'bulles': return ex.questions.length;
    case 'classer': return ex.items.length;
    case 'dictee': return ex.mots.length;
    case 'ordre': return ex.elements.length;
    case 'trous': return (ex.texte.match(/\[[^\]]+\]/g) || []).length;
    case 'conjugaison': return ex.formes.length;
    case 'lecture': return ex.questions.length;
    case 'memoriser': return ex.vers.length * 2;
    case 'addition': return additionOps(ex).length * (ex.etapes || ['poser', 'calculer']).length;
    case 'calcul': return calculOps(ex).length;
    case 'ecoute': return ex.items.length;
    case 'fluence': return 1;
    case 'boite': case 'barres': return ex.items.length;
    default: return 1;
  }
}
function additionOps(ex) {
  if (ex._ops) return ex._ops;
  if (Array.isArray(ex.operations) && ex.operations.length) return (ex._ops = ex.operations);
  const g = ex.generateur || { nombres: 2, min: 12, max: 59, retenue: true, combien: 3 };
  const ops = [];
  for (let k = 0; k < (g.combien || 3); k++) {
    let nums, tries = 0;
    do { nums = Array.from({ length: g.nombres || 2 }, () => rnd(g.min || 10, g.max || 99)); tries++; }
    while (tries < 200 && g.retenue && nums.reduce((s, n) => s + n % 10, 0) < 10);
    ops.push(nums);
  }
  return (ex._ops = ops);
}
/* Calculs : liste fixe, ou tirés au hasard. La difficulté s'adapte : si l'enfant se trompe souvent
   sur les calculs, les nombres sont plus petits. */
function calcRate() {
  let ok = 0, err = 0;
  Store.progress(child?._id).forEach(p => ['calcul', 'fluence'].forEach(t => { ok += p.parType?.[t]?.ok || 0; err += p.parType?.[t]?.err || 0; }));
  return ok + err < 6 ? 1 : ok / (ok + err);
}
function genOp(g, ease = 1) {
  const span = ([a, b]) => [a, Math.max(a, Math.round(a + (b - a) * ease))];
  const [a1, a2] = span(g.a || [1, 10]), [b1, b2] = span(g.b || [1, 10]);
  let a = rnd(a1, a2), b = rnd(b1, b2);
  switch (g.op) {
    case '-': if (b > a) [a, b] = [b, a]; return { q: `${a} − ${b}`, r: a - b };
    case '×': return { q: `${a} × ${b}`, r: a * b };
    case ':': return { q: `${a * b} : ${b}`, r: a };
    case 'complement': return { q: `${a} + … = ${g.cible || 10}`, r: (g.cible || 10) - a };
    default: return { q: `${a} + ${b}`, r: a + b };
  }
}
function calculOps(ex) {
  if (ex._ops) return ex._ops;
  if (Array.isArray(ex.operations) && ex.operations.length) return (ex._ops = ex.operations);
  const g = ex.generateur || { op: '+', a: [1, 10], b: [1, 10], combien: 5 };
  const ease = calcRate() < .6 ? .65 : 1;
  return (ex._ops = Array.from({ length: g.combien || 5 }, () => genOp(g, ease)));
}
const OP_TIPS = {
  '+': 'Pars du plus grand nombre, et avance du plus petit.',
  '−': 'Pars du plus petit et compte jusqu\'au plus grand, ou recule.',
  '×': 'Pense à la table, ou ajoute le même nombre plusieurs fois.',
  ':': 'Cherche dans la table : combien de fois le second nombre tient-il dans le premier ?',
};
const tipFor = q => OP_TIPS[(q.match(/[+−×:]/) || ['+'])[0]] || '';
/* Questions à choix tirées d'un exercice : pour la révision et le test de départ. */
function questionsFrom(ex) {
  const out = [];
  switch (ex.type) {
    case 'bulles': ex.questions.forEach(q => out.push({ k: 'b:' + norm(q.question + q.reponse), ex: { type: 'bulles', questions: [q] } })); break;
    case 'lecture': ex.questions.forEach(q => out.push({ k: 'l:' + norm(q.question + q.reponse), ex: { type: 'lecture', titre: ex.titre, texte: ex.texte, questions: [q] } })); break;
    case 'conjugaison': ex.formes.forEach(f => {
      const others = shuffle(ex.formes.map(x => x.forme).filter(x => x !== f.forme)).slice(0, 2);
      out.push({ k: 'c:' + norm(ex.verbe + f.pronom), ex: { type: 'bulles', questions: [{ question: `Le verbe ${ex.verbe} au ${ex.temps} : ${f.pronom} …`, choix: [f.forme, ...others], reponse: f.forme }] } });
    }); break;
    case 'classer': ex.items.forEach(it => out.push({ k: 'k:' + norm(it.texte + ex.groupes.map(g => g.nom).join()), ex: { type: 'bulles', questions: [{ question: `« ${it.texte} » va dans quelle maison ?`, choix: ex.groupes.map(g => g.nom), reponse: ex.groupes.find(g => g.id === it.groupe)?.nom, aide: it.aide }] } })); break;
    case 'dictee': ex.mots.forEach(m => out.push({ k: 'd:' + norm(m.mot), ex: { type: 'dictee', mots: [m] } })); break;
    case 'calcul': calculOps(ex).forEach(o => out.push({ k: 'n:' + o.q, ex: { type: 'calcul', operations: [o] } })); break;
    case 'addition': additionOps(ex).forEach(n => out.push({ k: 'n:' + n.join('+'), ex: { type: 'calcul', operations: [{ q: n.join(' + '), r: n.reduce((a, b) => a + b, 0) }] } })); break;
    case 'boite': ex.items.forEach(it => { const r = it.op === '-' ? it.a - it.b : it.a + it.b; out.push({ k: `n:${it.a}${it.op || '+'}${it.b}`, ex: { type: 'calcul', operations: [{ q: `${it.a} ${it.op === '-' ? '−' : '+'} ${it.b}`, r }] } }); }); break;
    case 'barres': ex.items.forEach(it => out.push({ k: 'p:' + norm(it.enonce), ex: { type: 'barres', items: [it] } })); break;
    case 'ecoute': ex.items.forEach(it => out.push({ k: 'e:' + norm(it.dire), ex: { type: 'ecoute', langue: ex.langue, items: [it] } })); break;
    case 'trous': {
      const parts = String(ex.texte).split(/(\[[^\]]+\])/); const ans = parts.filter(p => /^\[.*\]$/.test(p)).map(p => p.slice(1, -1));
      ans.forEach((a, i) => {
        let n = -1; const sentence = parts.map(p => /^\[.*\]$/.test(p) ? (++n === i ? '___' : p.slice(1, -1)) : p).join('');
        const around = sentence.split(/(?<=[.!?/])\s+/).find(x => x.includes('___')) || sentence;
        out.push({ k: 't:' + norm(around + a), ex: { type: 'bulles', questions: [{ question: around.trim(), choix: [a, ...shuffle([...(ex.distracteurs || []), ...ans.filter(x => x !== a)]).slice(0, 2)], reponse: a }] } });
      }); break;
    }
  }
  return out.filter(q => q.ex.type !== 'bulles' || q.ex.questions[0].reponse);
}
const remember = (k, ex) => Review.add(k, ex);

/* Enregistrer sa voix : l'enregistreur de la tablette s'ouvre, puis l'enfant se réécoute.
   L'enregistrement est gardé pour les parents quand l'application est ouverte depuis leur compte. */
function recordButton(label) {
  const wrap = el('div', 'record');
  const input = el('input'); input.type = 'file'; input.accept = 'audio/*'; input.setAttribute('capture', ''); input.hidden = true; input.id = 'rec-' + uid();
  const btn = el('label', 'btn ghost small'); btn.htmlFor = input.id;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg> ' + esc(label);
  const out = el('div', 'rec-out');
  input.onchange = async () => {
    const f = input.files?.[0]; if (!f) return;
    out.innerHTML = '';
    const au = el('audio'); au.controls = true; au.src = URL.createObjectURL(f); out.append(au);
    const note = el('p', 'note', 'Écoute-toi ! '); out.append(note);
    sfx.magic();
    try {
      const assets = await window.claude?.use?.('assets');
      if (assets && Store.mode === 'cloud') {
        const r = await assets.upload(f);
        await Store.put(`enreg_${child._id}_${Date.now()}`, { kind: 'enregistrement', enfant: child._id, lecon: curLesson?.id || '', titre: curLesson?.titre || '', asset: r.id, url: r.url, date: Date.now() });
        note.textContent = 'Bravo ! Ton enregistrement est gardé : tes parents pourront l\'écouter.';
      } else note.textContent = 'Écoute-toi ! (Cet enregistrement n\'est pas gardé sur cet appareil.)';
    } catch (e) { note.textContent = 'Écoute-toi ! (L\'enregistrement n\'a pas pu être gardé.)'; }
  };
  wrap.append(btn, input, out);
  return wrap;
}

/* ---------- Audio des poésies et chansons : un vrai enregistrement, joué vers par vers ----------
   ex.audio = { src, credit, vers: [{ debut, fin, mots?: [départ de chaque mot, en secondes depuis le début du vers] }] }.
   Un adulte peut ajouter ou remplacer l'audio d'un exercice (document audio_<leçon>_<n°>). Sans compte,
   le fichier reste dans le navigateur (IndexedDB) ; avec un compte, il est envoyé dans l'espace de l'application. */
const AudioBox = {
  db: null,
  open() {
    if (this.db) return this.db;
    return (this.db = new Promise((res, rej) => { try { const r = indexedDB.open('savanturier-audio', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }));
  },
  async put(key, blob) { const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction('f', 'readwrite'); t.objectStore('f').put(blob, key); t.oncomplete = res; t.onerror = () => rej(t.error); }); },
  async get(key) { const db = await this.open(); return new Promise((res, rej) => { const q = db.transaction('f').objectStore('f').get(key); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); }); },
};
const audioDocKey = (lid, i) => `audio_${lid}_${i}`;
function audioOf(lid, i, ex) { const d = Store.docs[audioDocKey(lid, i)]; return d ? { src: d.src, credit: d.credit, vers: d.vers } : ex.audio || null; }
const urlCache = {};
async function audioURL(src) {
  if (!src.startsWith('idb:')) return src;
  if (urlCache[src]) return urlCache[src];
  const blob = await AudioBox.get(src.slice(4)).catch(() => null);
  return blob ? (urlCache[src] = URL.createObjectURL(blob)) : null;
}
/* Lecture par le contexte audio déjà débloqué au premier geste (fiable sur iPad), découpage précis au vers. */
const decoded = {};
let current = null;
async function bufferFor(url) {
  const a = audio(); if (!a) return null;
  if (!decoded[url]) decoded[url] = fetch(url).then(r => { if (!r.ok) throw new Error('audio'); return r.arrayBuffer(); }).then(b => new Promise((res, rej) => a.decodeAudioData(b, res, rej)));
  try { return await decoded[url]; } catch (e) { delete decoded[url]; return null; }
}
/* Joue [debut, fin] d'un fichier ; onTime(t) reçoit le temps écoulé depuis debut. Renvoie false si la lecture est impossible. */
function playSegment(url, debut, fin, onTime) {
  return gated((async () => {
    if (!soundOn) return false;
    stopAudio();
    const a = audio(), buf = await bufferFor(url);
    if (!a || !buf) return false;
    try { if (a.state !== 'running') await a.resume(); } catch (e) {}
    return new Promise(res => {
      const src = a.createBufferSource(), g = a.createGain(); g.gain.value = 1;
      src.buffer = buf; src.connect(g); g.connect(a.destination);
      const t0 = a.currentTime, len = Math.max(.1, Math.min(fin, buf.duration) - debut);
      let raf = 0, done = false;
      const end = ok => { if (done) return; done = true; cancelAnimationFrame(raf); clearTimeout(guard); try { src.stop(); } catch (e) {} if (current === stop) current = null; res(ok); };
      const stop = () => end(true);
      const tick = () => { if (done) return; onTime && onTime(a.currentTime - t0); raf = requestAnimationFrame(tick); };
      src.onended = () => end(true);
      current = stop;
      src.start(0, debut, len); raf = requestAnimationFrame(tick);
      const guard = setTimeout(() => end(a.currentTime - t0 > .05), len * 1000 + 3000);
    });
  })());
}
function stopAudio() { if (current) current(); }
/* Joue un vers en surlignant ses mots au rythme de l'enregistrement. */
async function playVerse(url, seg, line) {
  const words = [...line.querySelectorAll('.w')];
  const ok = await playSegment(url, seg.debut, seg.fin, t => {
    if (!seg.mots?.length) return;
    let k = -1; seg.mots.forEach((m, j) => { if (t >= m) k = j; });
    words.forEach((w, j) => w.classList.toggle('now', j === k));
  });
  words.forEach(w => w.classList.remove('now'));
  return ok;
}
/* Découpe un enregistrement en n vers : on cherche les n − 1 silences les plus longs. */
async function splitBySilence(blob, n) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
  ctx.close?.();
  const data = buf.getChannelData(0), hop = Math.round(buf.sampleRate * .02), frames = [];
  for (let i = 0; i + hop <= data.length; i += hop) { let s = 0; for (let j = i; j < i + hop; j++) s += data[j] * data[j]; frames.push(Math.sqrt(s / hop)); }
  const sorted = [...frames].sort((a, b) => a - b), floor = sorted[Math.floor(sorted.length * .1)], peak = sorted[Math.floor(sorted.length * .95)];
  const thr = floor + (peak - floor) * .12, loud = frames.map(v => v > thr);
  const first = loud.indexOf(true), last = loud.lastIndexOf(true);
  if (first < 0) return null;
  const gaps = [];
  for (let i = first; i <= last; i++) if (!loud[i]) { let j = i; while (j <= last && !loud[j]) j++; gaps.push({ a: i, b: j, len: j - i }); i = j; }
  const cuts = gaps.filter(g => g.len >= 5).sort((x, y) => y.len - x.len).slice(0, n - 1).sort((x, y) => x.a - y.a);
  const T = f => Math.round(f * .02 * 100) / 100;
  const bounds = [[first, null], ...cuts.map(c => [c.b, c.a])];
  const r2 = x => Math.round(x * 100) / 100;
  return { duree: buf.duration, vers: bounds.map(([s], k) => ({ debut: r2(Math.max(0, T(s) - .1)), fin: r2(k + 1 < bounds.length ? T(bounds[k + 1][1]) + .1 : T(last) + .25) })) };
}

const AZERTY = ['azertyuiop', 'qsdfghjklm', 'wxcvbnéèêà', 'çùëïôâîû'];
const RUNNERS = {
  async bulles(ex, T) {
    for (const q of ex.questions) {
      S.board.innerHTML = ''; const c = el('button', 'card big ask'); c.type = 'button'; c.append(readable(q.question)); c.title = 'Réécouter la question';
      c.onclick = () => speak(q.question); S.board.append(c);
      await say(esc(q.question));
      const [k, item] = ex._item ? ex._item(q) : ['b:' + norm(q.question + q.reponse), { type: 'bulles', questions: [q] }];
      await choose(q.choix, q.reponse, () => { T.err('bulles'); remember(k, item); say(`${oops()} ${esc(q.aide || 'Essaie une autre bulle.')}`, 'think'); },
        { help: q.aide, onHelp: () => { T.err('bulles'); remember(k, item); } });
      T.ok('bulles'); say(praise(), 'cheer');
    }
  },
  async classer(ex, T) {
    S.board.innerHTML = '';
    const colors = [['#E86A8A', '#C94C6E', '#FFF4F0'], ['#4C8FF5', '#2F6FD1', '#F2F8FF'], ['#F2A33A', '#D1831C', '#FFF8EC'], ['#4FB37A', '#2E8656', '#F0FAF3']];
    const houses = el('div', 'houses');
    const targets = ex.groupes.map((g, i) => {
      const [roof, shade, wall] = colors[i % colors.length];
      const h = el('div', 'house'); h.dataset.g = g.id;
      h.innerHTML = `<svg class="cottage" viewBox="0 0 250 150" aria-hidden="true"><path d="M20 70 L125 8 L230 70 Z" fill="${roof}"/><path d="M125 8 L230 70 L200 70 L125 26 Z" fill="${shade}"/>
        <rect x="38" y="66" width="174" height="84" rx="8" fill="${wall}"/><rect x="104" y="96" width="42" height="54" rx="20" fill="${shade}"/>
        <rect x="60" y="88" width="30" height="26" rx="6" fill="#BFE5FF"/><rect x="160" y="88" width="30" height="26" rx="6" fill="#BFE5FF"/></svg>
        <div class="hbody"><div class="name"></div><div class="in"></div></div>`;
      h.querySelector('.name').textContent = g.nom; houses.append(h); return h;
    });
    S.board.append(houses);
    await say(esc(ex.consigne || 'Range chaque étiquette dans la bonne maison.') + ' Fais glisser chaque étiquette, ou touche-la puis touche une maison.');
    const nameOf = id => ex.groupes.find(g => g.id === id)?.nom || '';
    await placeTags(shuffle(ex.items), targets, (it, t) => t.dataset.g === String(it.groupe),
      (it, t) => { const s = el('span'); s.textContent = it.texte; t.querySelector('.in').append(s); T.ok('classer'); if (Math.random() < .5) say(praise(), 'cheer'); },
      (it, t) => {
        T.err('classer');
        questionsFrom({ type: 'classer', groupes: ex.groupes, items: [it] }).forEach(q => remember(q.k, q.ex));
        say(`${oops()} ${esc(it.aide || `« ${it.texte} » n'habite pas dans la maison « ${nameOf(t.dataset.g)} ». Essaie une autre maison.`)}`, 'think');
      });
  },
  async dictee(ex, T) {
    const full = prefs().clavier === 'complet' || (prefs().clavier === 'auto' && levelRank(child?.niveau || 'CP') >= 2);
    for (const m of ex.mots) {
      const word = String(m.mot);
      S.board.innerHTML = '';
      const hear = el('div', 'hear');
      const again = el('button', 'btn small', SPEAKER + ' Réécouter le mot'); again.type = 'button';
      const slow = el('button', 'btn small ghost', 'Écouter plus lentement'); slow.type = 'button';
      hear.append(again, slow);
      const slots = el('div', 'word-slots');
      const chars = [...word];
      const cells = chars.map(ch => {
        const c = el('div', 'l' + (ch === ' ' ? ' space' : /[\s'’\-.]/.test(ch) ? ' fixed' : ''));
        if (/['’\-.]/.test(ch)) c.textContent = ch;
        c._ch = ch; slots.append(c); return c;
      });
      S.board.append(hear, slots);
      /* Dictée : le mot n'est JAMAIS écrit à l'écran, il est seulement dit à voix haute. */
      window.__ecole.motDicte = word;
      const instruction = 'Écoute bien et écris le mot que tu entends.';
      const dictate = async (rate = 1) => {
        S.txt.textContent = instruction; S.lumi.classList.remove('think', 'cheer');
        if (!soundOn || !canSpeak) return;
        await speak(`Écoute bien. ${word}. ${m.phrase ? m.phrase + ' ' : ''}Écris : ${word}.`, { rate: .9 * rate });
      };
      again.onclick = () => { unlocked = false; unlockAudio(); dictate(); };
      slow.onclick = () => { unlocked = false; unlockAudio(); dictate(.65); };
      if (!soundOn || !canSpeak) {
        S.txt.textContent = canSpeak ? 'Pour la dictée, j\'ai besoin du son : active-le avec le bouton ci-dessous.' : 'Ce navigateur ne sait pas lire à voix haute : fais cette dictée avec un adulte, qui te dira les mots.';
        if (canSpeak) {
          const on = el('button', 'btn small', 'Activer le son'); on.type = 'button';
          on.onclick = () => { if (!soundOn) $('#sound').click(); on.remove(); dictate(); };
          S.acts.append(on);
        }
      } else dictate();
      await gated(new Promise(res => {
        const letters = chars.filter(ch => !/[\s'’\-.]/.test(ch));
        S.play.innerHTML = '';
        const pad = el('div', full ? 'letters keyboard' : 'letters');
        const typed = [];
        const fillable = cells.filter(c => !/[\s'’\-.]/.test(c._ch));
        const type = (ch, b) => {
          if (typed.length >= fillable.length) return;
          if (!full) b.disabled = true;
          typed.push({ ch, b }); sfx.count(typed.length);
          fillable[typed.length - 1].innerHTML = `<span class="dg">${esc(ch)}</span>`;
          if (typed.length === fillable.length) check();
        };
        /* Petits : les lettres du mot, mélangées, avec quelques intruses. Grands : clavier complet. */
        const keys = full ? AZERTY.join('').split('') : shuffle([...letters, ...shuffle([...'aeioulnrstcmpbdvé'].filter(ch => !letters.includes(ch))).slice(0, Math.min(3, Math.max(2, 8 - letters.length)))]);
        keys.forEach(ch => { const b = el('button', 'letter'); b.type = 'button'; b.textContent = ch; b.onclick = () => type(ch, b); pad.append(b); });
        const del = el('button', 'btn small ghost', 'Effacer'); del.type = 'button';
        del.onclick = () => { const t = typed.pop(); if (!t) return; t.b.disabled = false; fillable[typed.length].innerHTML = ''; fillable[typed.length].classList.remove('bad'); };
        S.play.append(pad, del); revealPlay();
        function check() {
          const got = typed.map(t => t.ch);
          const want = fillable.map(c => c._ch.toLowerCase());
          const firstBad = got.findIndex((g, i) => g !== want[i]);
          if (firstBad < 0) { fillable.forEach(c => c.classList.add('good')); sfx.ok(); sparkle(slots, 12); T.ok('dictee'); setTimeout(res, 600); return; }
          T.err('dictee'); sfx.no(); remember('d:' + norm(word), { type: 'dictee', mots: [m] });
          got.forEach((g, i) => fillable[i].classList.toggle('bad', g !== want[i]));
          S.txt.textContent = `${oops()} Regarde les lettres en rouge et écoute encore.`; S.lumi.classList.add('think');
          if (soundOn) speak(`${S.txt.textContent} ${word}.`);
          setTimeout(() => {
            while (typed.length > firstBad) { const t = typed.pop(); t.b.disabled = false; fillable[typed.length].innerHTML = ''; }
            fillable.forEach(c => c.classList.remove('bad'));
          }, 1300);
        }
      }));
      say(`${praise()} « ${esc(word)} » est bien écrit !`, 'cheer');
      await wait(700);
    }
  },
  async ordre(ex, T, label) {
    S.board.innerHTML = '';
    const list = el('div', 'slots-list');
    const slots = ex.elements.map(() => { const s = el('div', 's'); list.append(s); return s; });
    S.board.append(list);
    await say(esc(ex.consigne || 'Remets les étiquettes dans le bon ordre.') + ' Touche d\'abord celle qui vient en premier.');
    let next = 0;
    const tags = ex.elements.map((t, i) => ({ texte: t, i }));
    await placeTags(shuffle(tags), [list], tag => tag.i === next,
      tag => { slots[next].textContent = tag.texte; slots[next].classList.add('filled'); next++; T.ok('ordre'); if (next < slots.length) say(pick(['Oui ! Et après ?', 'Bien ! Et ensuite ?', 'Super ! La suite ?'])); },
      () => { T.err('ordre'); say(next === 0 ? `${oops()} Ce n'est pas le début. Lequel vient en premier ?` : `${oops()} Pas encore celui-là. Lequel vient juste après ?`, 'think'); },
      label || '');
  },
  async trous(ex, T) {
    const parts = String(ex.texte).split(/(\[[^\]]+\])/);
    const answers = parts.filter(p => /^\[.*\]$/.test(p)).map(p => p.slice(1, -1));
    S.board.innerHTML = '';
    const card = el('div', 'card text-gaps');
    const gaps = [];
    parts.forEach(p => {
      if (/^\[.*\]$/.test(p)) { const g = el('span', 'gap', '&nbsp;'); gaps.push(g); card.append(g); }
      else card.append(readable(p));
    });
    S.board.append(card);
    await say(esc(ex.consigne || 'Complète le texte : choisis le mot qui manque.'));
    const qs = questionsFrom(ex);
    for (let i = 0; i < answers.length; i++) {
      gaps.forEach((g, k) => g.classList.toggle('now', k === i));
      const others = shuffle([...(ex.distracteurs || []), ...answers.filter(a => a !== answers[i])]).filter(o => norm(o) !== norm(answers[i])).slice(0, 2);
      const mark = () => { T.err('trous'); if (qs[i]) remember(qs[i].k, qs[i].ex); };
      await choose([answers[i], ...others], answers[i], () => { mark(); say(`${oops()} Relis la phrase en entier : quel mot va bien ?`, 'think'); }, { onHelp: mark });
      gaps[i].textContent = answers[i]; gaps[i].classList.remove('now'); T.ok('trous'); if (i < answers.length - 1) say(praise(), 'cheer');
    }
    say(`${praise()} Le texte est complet !`, 'cheer'); await wait(600);
  },
  async conjugaison(ex, T) {
    S.board.innerHTML = '';
    const head = el('div', 'card big'); head.textContent = `${ex.verbe} · ${ex.temps}`;
    const table = el('div', 'card conj');
    const cells = ex.formes.map(f => { const p = el('span', 'p'); p.textContent = f.pronom; const v = el('span', 'f', '&nbsp;'); table.append(p, v); return v; });
    S.board.append(head, table);
    await say(`Conjuguons le verbe <b>${esc(ex.verbe)}</b> au ${esc(ex.temps)}. Choisis la bonne forme pour chaque personne.`);
    const forms = ex.formes.map(f => f.forme), qs = questionsFrom(ex);
    for (let i = 0; i < ex.formes.length; i++) {
      const f = ex.formes[i];
      cells.forEach((c, k) => c.classList.toggle('now', k === i));
      const others = shuffle([...new Set([...forms, ...(ex.distracteurs || [])])].filter(x => x !== f.forme)).slice(0, 2);
      say(`${esc(f.pronom)} … ?`);
      const mark = () => { T.err('conjugaison'); remember(qs[i].k, qs[i].ex); };
      await choose([f.forme, ...others], f.forme, () => { mark(); say(`${oops()} Avec « ${esc(f.pronom)} », quelle forme va ?`, 'think'); }, { onHelp: mark });
      cells[i].textContent = f.forme; cells[i].classList.remove('now'); T.ok('conjugaison');
    }
    say(`${praise()} Tu sais conjuguer ${esc(ex.verbe)} !`, 'cheer'); await wait(700);
  },
  async lecture(ex, T) {
    S.board.innerHTML = '';
    if (ex.titre) S.board.append(Object.assign(el('div', 'card big'), { textContent: ex.titre }));
    const card = el('div', 'card story'); card.append(readable(ex.texte, { words: true })); S.board.append(card);
    say('Installe-toi bien, j\'ai une histoire pour toi. Suis les mots avec tes yeux !');
    await wait(1200);
    await speakHighlight(card, ex.texte, { rate: .92 });
    S.play.innerHTML = ''; S.play.append(recordButton('Je la lis à voix haute et je m\'enregistre'));
    await cont('J\'ai écouté');
    S.play.innerHTML = '';
    await RUNNERS.bulles({ questions: ex.questions, _item: q => ['l:' + norm(q.question + q.reponse), { type: 'lecture', titre: ex.titre, texte: ex.texte, questions: [q] }] }, { ok: () => T.ok('lecture'), err: () => T.err('lecture') });
  },
  async memoriser(ex, T) {
    const vers = ex.vers.map(String);
    S.board.innerHTML = '';
    const box = el('div', 'card verses');
    if (ex.titre) box.append(Object.assign(el('b'), { textContent: ex.titre + (ex.auteur ? ` — ${ex.auteur}` : '') }));
    const lines = vers.map(t => { const d = el('div', 'v'); d.append(readable(t, { words: true })); box.append(d); return d; });
    S.board.append(box);
    const au = ex._audio && ex._audio.vers?.length === vers.length ? ex._audio : null;
    const url = au ? await audioURL(au.src) : null;
    if (au?.credit) box.append(Object.assign(el('small', 'credit'), { textContent: au.credit }));
    const song = /chanson|comptine/i.test(ex.auteur + ' ' + ex.titre) || au?.genre === 'air';
    if (url && soundOn) {
      /* Le vrai enregistrement : pas de voix de synthèse sur le texte. */
      const hearVerse = async i => { lines.forEach((l, k) => l.classList.toggle('now', k === i)); const ok = await playVerse(url, au.vers[i], lines[i]); lines[i].classList.remove('now'); return ok; };
      await say(song ? 'Écoute la chanson en entier, et suis les mots avec tes yeux.' : 'Écoute le poème en entier, et suis les mots avec tes yeux.');
      let ok = true;
      for (let i = 0; i < lines.length && ok; i++) ok = await hearVerse(i);
      if (ok) {
        await say(`Maintenant, on apprend vers par vers. J'écoute un vers, puis je le ${song ? 'chante' : 'redis'} tout seul.`);
        for (let i = 0; i < lines.length; i++) {
          await hearVerse(i);
          lines[i].classList.add('now');
          S.txt.textContent = `À toi : ${song ? 'chante' : 'redis'} ce vers ! Tu peux le réécouter autant que tu veux.`;
          await gated(new Promise(res => {
            S.play.innerHTML = '';
            const again = el('button', 'btn ghost small', SPEAKER + ' Réécouter le vers'); again.type = 'button'; again.onclick = () => hearVerse(i).then(() => lines[i].classList.add('now'));
            const next = el('button', 'btn small', i + 1 < lines.length ? 'Je l\'ai dit, vers suivant' : 'J\'ai fini !'); next.type = 'button'; next.onclick = () => { stopAudio(); sfx.pop(); res(); };
            S.play.append(again, next); revealPlay();
          }));
          S.play.innerHTML = ''; lines[i].classList.remove('now');
          /* Tous les deux vers, on enchaîne depuis le début pour lier les vers entre eux. */
          if (i % 2 === 1 && i + 1 < lines.length) { await say('On enchaîne depuis le début, tous ensemble !'); for (let k = 0; k <= i; k++) await hearVerse(k); }
        }
        box.classList.add('masked');
        await say(`Dernier tour : les mots se cachent ! ${song ? 'Chante' : 'Récite'} avec l'enregistrement, sans regarder.`);
        for (let i = 0; i < lines.length; i++) await hearVerse(i);
        box.classList.remove('masked');
      } else {
        await say('L\'enregistrement ne veut pas se lancer. Je te le dis à ma façon.');
        for (let i = 0; i < lines.length; i++) { lines.forEach((l, k) => l.classList.toggle('now', k === i)); await speakHighlight(lines[i], vers[i], { rate: .85 }); await wait(250); }
      }
    } else {
      await say('Écoute bien, je te le dis vers par vers. Ensuite, tu le redis avec moi !');
      for (let i = 0; i < lines.length; i++) { lines.forEach((l, k) => l.classList.toggle('now', k === i)); await speakHighlight(lines[i], vers[i], { rate: .85 }); await wait(250); }
    }
    lines.forEach(l => l.classList.remove('now'));
    await say(`À toi ! ${song ? 'Chante' : 'Redis'} tout le texte, tranquillement. Tu peux t'enregistrer pour te réécouter. Quand c'est bon, on joue !`);
    S.play.innerHTML = ''; S.play.append(recordButton(song ? 'Je chante et je m\'enregistre' : 'Je récite et je m\'enregistre'));
    await cont('Je suis prêt');
    S.play.innerHTML = '';
    await RUNNERS.ordre({ elements: vers, consigne: 'Remets les vers dans l\'ordre.' }, { ok: () => T.ok('memoriser'), err: () => T.err('memoriser') });
    const hidden = vers.map(v => (v.match(/[A-Za-zÀ-ÿ’'-]{3,}/g) || []).sort((a, b) => b.length - a.length)[0] || null);
    const texte = vers.map((v, i) => hidden[i] ? v.replace(hidden[i], `[${hidden[i]}]`) : v).join(' / ');
    await RUNNERS.trous({ texte, consigne: 'Des mots se sont envolés ! Retrouve-les.', distracteurs: [] },
      { ok: () => T.ok('memoriser'), err: () => T.err('memoriser') });
    hidden.forEach(h => { if (!h) T.ok('memoriser'); });
  },
  async calcul(ex, T) {
    const pad = levelRank(child?.niveau || 'CP') >= 1;
    for (const o of calculOps(ex)) {
      S.board.innerHTML = '';
      const isOp = /\d\s*[+−×:]\s*\d|…/.test(o.q), spoken = o.q.replace(/−/g, ' moins ').replace(/×/g, ' fois ').replace(/ : /g, ' divisé par ').replace('…', 'combien');
      const c = el('div', 'card big calc'); c.textContent = !isOp ? `${o.q} ?` : o.q.includes('…') ? o.q : `${o.q} = ?`; S.board.append(c);
      await say(isOp ? `Combien font ${esc(spoken)} ?` : `${esc(o.q)} : combien ?`);
      const k = 'n:' + o.q, item = { type: 'calcul', operations: [o] }, help = o.aide || tipFor(o.q);
      const mark = () => { T.err('calcul'); remember(k, item); };
      const onWrong = () => { mark(); say(`${oops()} ${esc(help)}`, 'think'); };
      if (pad) await keypad(o.r, onWrong, { help, onHelp: mark });
      else await choose([o.r, o.r + 1, Math.max(0, o.r - 1), o.r + 2], o.r, onWrong, { help, onHelp: mark });
      c.textContent = !isOp ? `${o.q} : ${o.r}` : `${o.q.replace('…', o.r)}${o.q.includes('…') ? '' : ' = ' + o.r}`;
      T.ok('calcul'); say(praise(), 'cheer'); await wait(500);
    }
  },
  async fluence(ex, T) {
    const g = ex.generateur || { op: '+', a: [1, 10], b: [1, 10] };
    const duree = window.__ecole.fluenceDuree || ex.duree || 60;
    const rk = `${curLesson?.id}:${ex.titre || g.op}`, best = Records.get(rk);
    S.board.innerHTML = '';
    const top = el('div', 'fluence-top', `<div class="bar timer"><i></i></div><div class="score"><b>0</b> réussis${best ? ` · record : ${best}` : ''}</div>`);
    const c = el('div', 'card big calc'); S.board.append(top, c);
    await say(`Calcul rapide ! Tu as ${duree} secondes pour réussir le plus de calculs possible. ${best ? `Ton record est de ${best}. ` : ''}Prêt ?`);
    await cont('C\'est parti !');
    let score = 0, done = false; const t0 = Date.now();
    const bar = top.querySelector('.timer i'), sc = top.querySelector('.score b');
    const timer = setInterval(() => { const left = Math.max(0, 1 - (Date.now() - t0) / (duree * 1000)); bar.style.width = (left * 100) + '%'; if (!left) { done = true; clearInterval(timer); S?.play && S._press && (S.play.innerHTML = ''); stop(); } }, 200);
    let stop; const stopped = new Promise(r => stop = r);
    while (!done) {
      const o = genOp(g);
      c.textContent = `${o.q} = ?`;
      const r = await Promise.race([keypad(o.r, () => { sfx.no(); }, { noHelp: true }), stopped.then(() => null)]);
      if (r === null || done) break;
      score++; sc.textContent = score; sfx.count(score);
    }
    clearInterval(timer); S.play.innerHTML = '';
    const rec = await Records.set(rk, score);
    T.ok('fluence');
    c.textContent = `${score} calcul${score > 1 ? 's' : ''} réussi${score > 1 ? 's' : ''} !`;
    await say(rec && best ? `Nouveau record ! ${score} calculs, bravo !` : rec ? `Ton premier record : ${score} calculs ! Essaie de le battre la prochaine fois.` : `${score} calculs ! Ton record reste ${best}. Tu y es presque !`, 'cheer');
    await wait(900);
  },
  /* La boîte (guide CP « Pour enseigner les nombres… », situation de référence) : des jetons entrent
     dans une boîte fermée ; l'enfant prévoit combien il y en a, puis on ouvre la boîte pour vérifier. */
  async boite(ex, T) {
    for (const it of ex.items) {
      const r = it.op === '-' ? it.a - it.b : it.a + it.b;
      S.board.innerHTML = '';
      const scene = el('div', 'boite-scene', `<div class="jetons"></div><svg class="boite" viewBox="0 0 220 150" aria-hidden="true"><rect x="20" y="40" width="180" height="100" rx="14" fill="#C07C4A"/><rect x="20" y="40" width="180" height="22" fill="#9C5A33"/><g class="couvercle"><rect x="10" y="22" width="200" height="26" rx="10" fill="#E09A5E"/><rect x="95" y="12" width="30" height="14" rx="6" fill="#9C5A33"/></g></svg><div class="dedans"></div>`);
      const jet = scene.querySelector('.jetons'), dedans = scene.querySelector('.dedans');
      S.board.append(scene);
      const pose = async (n, sens) => {
        jet.innerHTML = Array.from({ length: n }, () => '<i></i>').join('');
        await wait(REDUCED ? 100 : 900);
        jet.classList.add(sens === 'in' ? 'entre' : 'sort');
        sfx.pop(); await wait(REDUCED ? 100 : 700);
        jet.classList.remove('entre', 'sort'); jet.innerHTML = '';
      };
      await say(`Je mets <b>${it.a}</b> jeton${it.a > 1 ? 's' : ''} dans la boîte.`);
      await pose(it.a, 'in');
      if (it.op === '-') { await say(`Maintenant, j'en retire <b>${it.b}</b>.`); jet.innerHTML = ''; await pose(it.b, 'out'); }
      else { await say(`Et j'en mets encore <b>${it.b}</b>.`); await pose(it.b, 'in'); }
      await say('La boîte est fermée. Combien y a-t-il de jetons dedans ? Réfléchis dans ta tête, avec tes doigts, ou en dessinant.');
      const mark = () => { T.err('boite'); remember(`n:${it.a}${it.op || '+'}${it.b}`, { type: 'calcul', operations: [{ q: `${it.a} ${it.op === '-' ? '−' : '+'} ${it.b}`, r }] }); };
      const help = it.op === '-' ? `Pars de ${it.a} et recule de ${it.b}.` : `Mets ${Math.max(it.a, it.b)} dans ta tête, et avance de ${Math.min(it.a, it.b)}.`;
      if (r <= 20 && levelRank(child?.niveau || 'CP') === 0) await choose([r, r + 1, Math.max(0, r - 1), r + 2], r, () => { mark(); say(`${oops()} ${esc(help)}`, 'think'); }, { help, onHelp: mark });
      else await keypad(r, () => { mark(); say(`${oops()} ${esc(help)}`, 'think'); }, { help, onHelp: mark });
      scene.classList.add('ouverte');
      dedans.innerHTML = Array.from({ length: r }, (_, i) => `<i${i % 5 === 4 ? ' class="cinq"' : ''}></i>`).join('');
      T.ok('boite'); sfx.magic();
      await say(`On ouvre la boîte pour vérifier… ${r} jeton${r > 1 ? 's' : ''} ! ${it.a} ${it.op === '-' ? '−' : '+'} ${it.b} = ${r}. ${praise()}`, 'cheer');
      S.board.append(Object.assign(el('div', 'card big calc'), { textContent: `${it.a} ${it.op === '-' ? '−' : '+'} ${it.b} = ${r}` }));
      await wait(1200);
    }
  },
  /* Le schéma en barres (guide CP, chapitre 3) : on représente l'énoncé par des rectangles, puis on calcule. */
  async barres(ex, T) {
    for (const it of ex.items) {
      S.board.innerHTML = '';
      const card = el('div', 'card story'); card.append(readable(it.enonce)); S.board.append(card);
      const sch = el('div', 'barres');
      const val = v => v == null ? '?' : String(v);
      let rep, ecrit;
      if (it.type === 'comparaison') {
        const [g, p, e] = [it.grand, it.petit, it.ecart];
        rep = g == null ? p + e : p == null ? g - e : g - p;
        const G = g ?? rep, P = p ?? (g - e);
        sch.innerHTML = `<div class="ligne"><span class="lab"></span><div class="seg" style="flex:${G}">${val(g)}</div></div>
          <div class="ligne"><span class="lab"></span><div class="seg b" style="flex:${P}">${val(p)}</div><div class="seg ecart" style="flex:${G - P}">${val(e)}</div></div>`;
        sch.querySelectorAll('.lab')[0].textContent = it.noms?.[0] || ''; sch.querySelectorAll('.lab')[1].textContent = it.noms?.[1] || '';
        ecrit = g == null ? `${p} + ${e} = ${rep}` : p == null ? `${g} − ${e} = ${rep}` : `${g} − ${p} = ${rep}`;
      } else if (it.type === 'parts') {
        const { nb, valeur, total } = it;
        rep = total == null ? nb * valeur : valeur == null ? total / nb : total / valeur;
        const n = nb ?? rep, v = valeur ?? (total / n);
        const segs = nb == null ? `<div class="seg b" style="flex:1">${valeur}</div><div class="seg b" style="flex:1">${valeur}</div><div class="seg vide" style="flex:2">…</div>`
          : Array.from({ length: n }, (_, i) => `<div class="seg b" style="flex:1">${i === 0 ? val(valeur) : valeur == null ? '' : v}</div>`).join('');
        sch.innerHTML = `<div class="ligne tout"><div class="seg t" style="flex:1">${val(total)}</div></div><div class="ligne">${segs}</div>`;
        if (nb == null) sch.append(Object.assign(el('p', 'note'), { textContent: 'Combien de parts de ' + valeur + ' ?' }));
        ecrit = total == null ? `${n} × ${valeur} = ${rep}` : valeur == null ? `${total} = ${nb} × ${rep}` : `${total} = ${rep} × ${valeur}`;
      } else {
        const [a, b] = it.parties, t = it.tout;
        rep = t == null ? a + b : a == null ? t - b : t - a;
        const A = a ?? rep, B = b ?? rep;
        sch.innerHTML = `<div class="ligne tout"><div class="seg t" style="flex:1">${val(t)}</div></div><div class="ligne"><div class="seg b" style="flex:${A}">${val(a)}</div><div class="seg c" style="flex:${B}">${val(b)}</div></div>`;
        ecrit = t == null ? `${a} + ${b} = ${rep}` : `${t} − ${a ?? b} = ${rep}`;
      }
      S.board.append(sch);
      await say(esc(it.enonce));
      await say('Regarde le schéma : le point d\'interrogation, c\'est ce qu\'on cherche.');
      const mark = () => { T.err('barres'); remember('p:' + norm(it.enonce), { type: 'barres', items: [it] }); };
      const help = it.aide || 'Regarde le schéma : cherches-tu le tout, ou une partie ?';
      if (levelRank(child?.niveau || 'CP') === 0 && rep <= 20) await choose([rep, rep + 1, Math.max(0, rep - 1), rep + 2], rep, () => { mark(); say(`${oops()} ${esc(help)}`, 'think'); }, { help, onHelp: mark });
      else await keypad(rep, () => { mark(); say(`${oops()} ${esc(help)}`, 'think'); }, { help, onHelp: mark });
      sch.querySelectorAll('.seg').forEach(sg => { if (sg.textContent === '?') { sg.textContent = rep; sg.classList.add('trouve'); } });
      T.ok('barres');
      S.board.append(Object.assign(el('div', 'card big calc'), { textContent: ecrit }));
      await say(`${praise()} ${esc(ecrit)}.${it.phrase ? ' ' + esc(it.phrase.replace('{r}', rep)) : ''}`, 'cheer');
      await wait(1000);
    }
  },
  async ecoute(ex, T) {
    const lang = ex.langue || 'en-GB';
    for (const it of ex.items) {
      S.board.innerHTML = '';
      const again = el('button', 'btn', SPEAKER + ' Écouter'); again.type = 'button';
      again.onclick = () => { unlocked = false; unlockAudio(); speak(it.dire, { lang }); };
      S.board.append(again);
      if (it.consigne) S.board.append(Object.assign(el('div', 'card'), { textContent: it.consigne }));
      await say(esc(it.question || 'Écoute bien ! Que veut dire ce mot ?'));
      await speak(it.dire, { lang });
      const k = 'e:' + norm(it.dire), item = { type: 'ecoute', langue: lang, items: [it] };
      const mark = () => { T.err('ecoute'); remember(k, item); };
      await choose(it.choix, it.reponse, () => { mark(); say(`${oops()} Écoute encore.`, 'think'); speak(it.dire, { lang }); }, { onHelp: mark, help: it.aide });
      T.ok('ecoute'); say(`${praise()} « ${esc(it.dire)} », c'est « ${esc(it.reponse)} ».`, 'cheer'); await wait(900);
    }
  },
  async addition(ex, T) {
    const steps = ex.etapes || ['poser', 'calculer'];
    const ops = additionOps(ex);
    const useKeypad = levelRank(child?.niveau || 'CP') >= 1;
    for (const nums of ops) {
      const sum = nums.reduce((a, b) => a + b, 0);
      const ncols = Math.min(3, String(sum).length);
      const Tw = buildTowers(S.board, ncols, nums.length);
      S.board.append(Object.assign(el('div', 'card big'), { textContent: nums.join(' + ') }));
      const item = { type: 'calcul', operations: [{ q: nums.join(' + '), r: sum }] }, k = 'n:' + nums.join('+');
      if (steps.includes('poser')) {
        await say(`Pose l'addition ${nums.join(' + ')} : range chaque chiffre dans sa maison. Le chiffre des unités va toujours dans la maison bleue, tout à droite.`);
        for (let r = 0; r < nums.length; r++) {
          const digits = String(nums[r]).split(''), off = ncols - digits.length;
          await placeTags(digits.map((d, kk) => ({ texte: d, col: off + kk })), Tw.ops[r],
            (tag, slot) => !slot.classList.contains('filled') && digits[Tw.ops[r].indexOf(slot) - off] === tag.texte,
            (tag, slot) => { setSlot(slot, tag.texte); T.ok('addition-poser'); },
            (tag, slot) => {
              T.err('addition-poser');
              const want = Tw.ranks[digits.indexOf(tag.texte) + off];
              say(digits.length === 1 ? `Le ${tag.texte} est tout seul : c'est un chiffre des unités. Il va dans la maison bleue, tout à droite.`
                : `Dans ${nums[r]}, le ${tag.texte} est le chiffre des ${RN[want]} : il va dans la maison ${COLOR[want]}.`, 'think');
            }, `Range le nombre <b>${nums[r]}</b>`);
        }
      } else nums.forEach((n, r) => fillNumber(Tw, r, n));
      if (steps.includes('calculer')) {
        let carry = 0;
        for (let c = ncols - 1; c >= 0; c--) {
          const pos = ncols - 1 - c;
          const ds = nums.map(n => Math.floor(n / 10 ** pos) % 10).filter((d, i) => String(nums[i]).length > pos);
          const s = ds.reduce((a, b) => a + b, 0) + carry;
          focusCol(Tw, c);
          const expr = [...(carry ? [carry] : []), ...ds].join(' + ');
          await say(`Maison des ${RNC[Tw.ranks[c]]}${carry ? ', sans oublier la retenue' : ''} : combien font ${expr} ?`);
          const mark = () => { T.err('addition-calculer'); remember(k, item); };
          const onWrong = v => { mark(); say(carry && +v === s - carry ? `${oops()} Tu as oublié la retenue, tout en haut de la maison !` : `${oops()} Compte doucement : ${expr}.`, 'think'); };
          const help = carry ? 'N\'oublie pas la retenue, tout en haut.' : 'Additionne les chiffres de cette maison.';
          if (useKeypad) await keypad(s, onWrong, { help, onHelp: mark });
          else await choose([s, s + 1, Math.max(0, s - 1), s >= 10 ? s - 10 : s + 2], s, onWrong, { help, onHelp: mark });
          T.ok('addition-calculer');
          if (s >= 10 && c > 0) {
            setSlot(Tw.res[c], String(s % 10));
            await say(`${s}, c'est ${Math.floor(s / 10)} dizaine${s >= 20 ? 's' : ''} et ${s % 10} unité${s % 10 > 1 ? 's' : ''} ! J'écris ${s % 10}, et ${Math.floor(s / 10)} monte en retenue.`, 'cheer');
            await fly(Tw.res[c], Tw.carry[c - 1], `<span>${Math.floor(s / 10)}</span>`);
            setSlot(Tw.carry[c - 1], String(Math.floor(s / 10))); sfx.magic();
            carry = Math.floor(s / 10);
          } else { setSlot(Tw.res[c], String(c === 0 ? s : s % 10)); carry = 0; }
        }
        focusCol(Tw, null);
      }
      await say(`${nums.join(' + ')} = ${sum}. ${praise()}`, 'cheer');
      await wait(900);
    }
  },
};

function buildTowers(host, ncols, nOps) {
  host.innerHTML = '';
  const tw = el('div', 'towers'); host.append(tw);
  tw.style.setProperty('--n', ncols); tw.style.setProperty('--ops', nOps);
  const ranks = RANKS.slice(3 - ncols), resRow = 4 + nOps;
  const T = { ranks, bodies: [], carry: [], ops: [...Array(nOps)].map(() => []), res: [], host: tw };
  const put = (e, col, row, rowEnd) => { e.style.gridColumn = col; e.style.gridRow = rowEnd ? `${row} / ${rowEnd}` : row; tw.append(e); return e; };
  ranks.forEach((r, c) => {
    const col = c + 2;
    put(el('div', 'roof ' + r), col, 1);
    T.bodies[c] = put(el('div', 'body ' + r), col, 2, resRow + 1);
    put(el('div', 'lbl', RNC[r]), col, 2);
    if (c < ncols - 1) T.carry[c] = put(el('div', 'slot carry'), col, 3);
    for (let i = 0; i < nOps; i++) T.ops[i][c] = put(el('div', 'slot'), col, 4 + i);
    T.res[c] = put(el('div', 'slot res'), col, resRow);
  });
  put(el('div', 'plus', '+'), 1, 3 + nOps);
  const line = el('div', 'goldline'); line.style.gridColumn = '1 / -1'; line.style.gridRow = resRow; tw.append(line);
  return T;
}
function setSlot(slot, d) { slot.innerHTML = `<span class="dg">${esc(d)}</span>`; slot.classList.add('filled'); }
function focusCol(T, c) { T.bodies.forEach((b, i) => b.classList.toggle('glow', i === c)); T.host.classList.toggle('dim', c != null); }
function fillNumber(T, row, n) { const ds = String(n).split(''), off = T.ranks.length - ds.length; ds.forEach((d, k) => setSlot(T.ops[row][off + k], d)); }

/* ---------- Page d'une leçon : choisir un exercice ou tout faire ---------- */
function showLesson(l) {
  if (checkTime()) return;
  const v = screen(showMap);
  const sc = el('section', 'scene');
  sc.innerHTML = `<div class="scene-head"><h2></h2><span class="lv"></span></div>`;
  sc.querySelector('h2').textContent = l.titre; sc.querySelector('.lv').textContent = `${l.niveau} · ${SUBJECTS[l.matiere] || ''}`;
  const d = el('div', 'dialog'); d.append(guideEl());
  const p = el('div', 'parch speech'); p.innerHTML = '<p class="txt"></p>';
  p.querySelector('.txt').textContent = `Coucou ${child.prenom} ! Je t'explique la leçon en deux minutes, et après, on joue. Tu peux aussi choisir directement un jeu.`;
  d.append(p); sc.append(d);
  const ta = el('div', 'acts'); p.append(ta); addTranslate(ta, () => p.querySelector('.txt').textContent, p);
  const acts = el('div', 'arena');
  const all = el('button', 'btn', 'Leçon et tous les jeux'); all.type = 'button'; all.onclick = () => playLesson(l, null);
  const row = el('div', 'row'); row.style.justifyContent = 'center'; row.append(all);
  acts.append(row);
  const list = el('div', 'grid-lessons');
  l.exercices.forEach((ex, i) => {
    const b = el('button', 'lesson'); b.type = 'button';
    b.innerHTML = '<span class="lv"></span><span class="t"></span>';
    b.querySelector('.lv').textContent = TYPES[ex.type] || ex.type;
    b.querySelector('.t').textContent = ex.titre || TYPES[ex.type] || 'Jeu';
    b.onclick = () => playLesson(l, i);
    list.append(b);
  });
  acts.append(el('p', 'note', 'Ou choisis un seul jeu :'), list);
  const sec = sectionById(l.programme?.section);
  if (sec || l.programme?.citation) {
    const det = el('details', 'note'); det.innerHTML = '<summary>Pour les adultes : ce que dit le programme</summary>';
    const q = el('blockquote'); q.textContent = l.programme?.citation || ''; det.append(q);
    if (sec) det.append(Object.assign(el('p'), { textContent: `${sec.source.texte}, ${sec.source.bo} — ${sec.domaine} › ${sec.section} (${sec.niveaux.join(', ')})` }));
    if (l.guide) {
      det.append(Object.assign(el('p'), { innerHTML: '<b>Ce que conseille le guide</b>' }));
      const g = el('blockquote'); g.textContent = l.guide.extrait; det.append(g);
      det.append(Object.assign(el('p'), { textContent: `Guide fondamental « ${l.guide.titre} » (Eduscol), page ${l.guide.page}.` }));
    }
    acts.append(det);
  }
  sc.append(acts); v.append(sc);
  speak(p.textContent);
}

/* ---------- Motivation : étoiles, cabane de Noisette, histoire à épisodes, badges ---------- */
const totalStars = () => Store.progress(child._id).reduce((s, p) => s + (p.test ? 0 : p.etoiles || 0), 0);
const CABANE = [
  [3, 'une lanterne'], [6, 'un tapis tout doux'], [10, 'un pot de fleurs'], [15, 'une étagère de livres'], [20, 'un tableau'], [26, 'un gros coussin'],
  [33, 'une guirlande'], [40, 'un télescope'], [48, 'un globe'], [56, 'une boîte à trésor'], [65, 'un trophée'], [75, 'l\'étoile magique'],
];
const cabaneCount = s => CABANE.filter(([n]) => s >= n).length;
const EPISODES = [
  ['La carte froissée', 'Un matin, Noisette trouve sous son noisetier une vieille carte froissée. Dessus, une étoile dorée brille, avec ces mots : « L\'Étoile du savoir attend les Savanturiers. »'],
  ['Le premier indice', 'Au dos de la carte, une énigme : « Pour avancer, il faut apprendre. » Noisette se gratte la tête. Apprendre ? Elle vient justement de réussir une leçon avec toi !'],
  ['Le pont des lettres', 'Le chemin s\'arrête devant une rivière. Un pont apparaît, planche après planche, chaque fois que Noisette lit un mot à voix haute. Clac, clac, clac : les voilà de l\'autre côté !'],
  ['Pipo le hérisson', 'Dans les fougères, un petit hérisson pleure : il a perdu le compte de ses pommes. Noisette l\'aide à les ranger par dizaines. « Merci ! Je m\'appelle Pipo. Je viens avec vous ! »'],
  ['La forêt qui chuchote', 'Les arbres de cette forêt chuchotent des mots mélangés. Pipo et Noisette les remettent dans l\'ordre, et une phrase apparaît : « Suivez le ruisseau jusqu\'au moulin. »'],
  ['Le moulin des nombres', 'Les ailes du moulin sont bloquées. Sur la porte, une addition attend sa réponse. Noisette pose les chiffres en colonnes… et les ailes se remettent à tourner, tout doucement.'],
  ['Une plume dans le vent', 'Une plume bleue tombe du ciel. C\'est celle de Céleste, une hirondelle qui connaît tous les chemins. « L\'Étoile ? Elle est tout en haut de la Montagne des Saisons. »'],
  ['La pluie de verbes', 'Il pleut des verbes ! Chanter, finir, prendre… Pour s\'abriter, il faut ranger chacun dans sa maison. Pipo rit si fort qu\'il en roule comme une balle.'],
  ['Le village des sons', 'Au village, chaque maison a un son : ou, on, an… Le maire a perdu la clé du son « oi ». Noisette la retrouve dans le mot « étoile ». Évidemment !'],
  ['La nuit des lucioles', 'La nuit tombe. Les lucioles s\'allument une à une pour chaque bonne réponse. Bientôt, tout le chemin brille, et les trois amis peuvent continuer sans peur.'],
  ['Le géant endormi', 'Un géant dort en travers du chemin. Pour le réveiller gentiment, il faut lui réciter une poésie. Il ouvre un œil, sourit, et se pousse : « Jolie voix ! Passez, les amis. »'],
  ['La boutique du renard', 'Monsieur Renard vend des cordes pour la montagne. Trois euros cinquante la corde. Noisette compte ses pièces avec soin. Le compte est bon !'],
  ['Le pied de la montagne', 'La Montagne des Saisons est immense. En bas, c\'est l\'été ; plus haut, l\'automne ; tout en haut, l\'hiver. Céleste montre le sentier qui monte en zigzag.'],
  ['L\'automne en couleurs', 'Les feuilles rousses forment des formes au sol : un carré, un triangle, un cercle. Il faut marcher seulement sur les triangles. Pipo saute de l\'un à l\'autre en riant.'],
  ['La grotte de l\'écho', 'Dans la grotte, l\'écho répète tout… en anglais ! « Hello ! » dit Noisette. « Hello, hello ! » répond la grotte. Les amis apprennent trois mots pour passer.'],
  ['L\'horloge de glace', 'Une horloge de glace bloque la porte de l\'hiver. Il faut placer les aiguilles sur trois heures et quart. Clic ! La porte s\'ouvre dans un nuage de flocons.'],
  ['La tempête de neige', 'Le vent souffle fort. Pipo a froid. Noisette se souvient de sa leçon : les animaux se serrent pour garder la chaleur. Les trois amis se blottissent, et la tempête passe.'],
  ['Le dernier escalier', 'Il reste cent marches. Noisette compte de dix en dix pour aller plus vite : dix, vingt, trente… cent ! Tout en haut, une lumière dorée les attend.'],
  ['L\'Étoile du savoir', 'L\'Étoile flotte au-dessus de la neige. Elle parle d\'une voix douce : « Je ne suis pas un trésor qu\'on emporte. Je brille chaque fois que tu apprends quelque chose. »'],
  ['Le retour des Savanturiers', 'De retour au noisetier, Noisette accroche une petite étoile dans sa cabane. Pipo et Céleste font la fête. Et toi, tu es devenu un vrai Savanturier ! Mais chut… une nouvelle carte vient d\'arriver.'],
];
const episodesOpen = () => Math.min(EPISODES.length, Store.docs[`jours_${child._id}`]?.sessions || 0);
const badgesOf = () => Store.progress(child._id).filter(p => !p.test && (p.etoiles || 0) >= 2).map(p => { const l = lessonById(p.lecon); return { lid: p.lecon, matiere: p.matiere, nom: l?.competence || `Je sais : ${p.titre}` }; });

/* ---------- Temps d'écran : l'adulte fixe un temps par jour ; une pause s'affiche ensuite ---------- */
let clock = null, clockN = 0;
function startClock() {
  clearInterval(clock); if (!child) return;
  clock = setInterval(() => {
    if (!child || document.hidden) return;
    Days.addSeconds(15);
    if (++clockN % 4 === 0) Store.put(Days.key(), Days.doc());
    if (!S) checkTime();
  }, 15000);
}
const timeLeft = () => { const p = prefs(); if (!p.tempsMax) return Infinity; const d = Days.doc().dates[today()] || {}; return p.tempsMax + (d.bonus || 0) - (d.min || 0); };
function checkTime() { if (child && timeLeft() <= 0) { showPause(); return true; } return false; }
/* Petite question pour les adultes (multiplication), réutilisée partout. */
function gateForm(onOk, label = 'Entrer') {
  const a = rnd(6, 9), b = rnd(6, 9);
  const box = el('div', 'gate');
  box.innerHTML = `<p>Question pour un adulte : combien font ${a} × ${b} ?</p><form class="form row" id="gate"><label>Réponse<input id="gate-in" inputmode="numeric" autocomplete="off"></label><button class="btn" type="submit"></button></form><p class="warn" id="gate-msg" hidden>Ce n'est pas la bonne réponse.</p>`;
  box.querySelector('button').textContent = label;
  box.querySelector('#gate').onsubmit = e => { e.preventDefault(); if (+box.querySelector('#gate-in').value === a * b) onOk(); else box.querySelector('#gate-msg').hidden = false; };
  return box;
}
function showPause() {
  const v = screen(showHome);
  const box = el('div', 'welcome');
  box.append(guideEl());
  const p = el('div', 'parch');
  p.append(el('h2', '', 'C\'est l\'heure de la pause !'));
  const t = el('p'); t.textContent = `Tu as bien travaillé aujourd'hui, ${child.prenom}. ${W.guide.name} va se reposer aussi. Va jouer dehors, dessiner ou lire une histoire, et on se retrouve demain !`;
  p.append(t);
  const more = el('details', 'note'); more.innerHTML = '<summary>Un adulte peut donner 10 minutes de plus</summary>';
  more.append(gateForm(async () => { const d = (Days.doc().dates[today()] ||= { min: 0, sessions: 0 }); d.bonus = (d.bonus || 0) + 10; await Store.put(Days.key(), Days.doc()); showMap('accueil'); }, 'Donner 10 minutes'));
  p.append(more); box.append(p); v.append(box);
  speak(t.textContent);
}

/* ---------- Leçons spéciales : révision des erreurs, test de départ, mots de la semaine ---------- */
function playReview() {
  const due = Review.due().sort((a, b) => a[1].due - b[1].due).slice(0, 10);
  if (!due.length) return showMap('accueil');
  playLesson({ id: 'revision', special: 'revision', titre: 'Je révise mes erreurs', sous: 'Révision', niveau: child.niveau, matiere: '', lecon: [],
    exercices: due.map(([k, it]) => ({ ...JSON.parse(JSON.stringify(it.ex)), _rk: k })) }, null);
}
function buildTest() {
  const rank = levelRank(child.niveau);
  const pool = LIB.filter(l => levelRank(l.niveau) <= rank && ['francais', 'maths'].includes(l.matiere))
    .sort((a, b) => levelRank(a.niveau) - levelRank(b.niveau) || (a.ordre || 0) - (b.ordre || 0));
  const step = Math.max(1, pool.length / 12), chosen = [];
  for (let i = 0; i < pool.length && chosen.length < 12; i += step) chosen.push(pool[Math.floor(i)]);
  const ex = [];
  chosen.forEach(l => {
    const qs = l.exercices.flatMap(questionsFrom).filter(q => ['bulles', 'calcul', 'ecoute', 'barres'].includes(q.ex.type));
    if (qs.length) ex.push({ ...qs[rnd(0, qs.length - 1)].ex, _lid: l.id });
  });
  return { id: 'test', special: 'test', titre: 'Mon test de départ', sous: 'Pour savoir où commencer', niveau: child.niveau, matiere: '', lecon: [], exercices: ex };
}
function offerTest(after = () => showMap('accueil')) {
  const v = screen(after);
  const box = el('div', 'welcome');
  box.append(guideEl());
  const p = el('div', 'parch');
  const t = el('p'); t.textContent = `Bonjour ${child.prenom} ! Veux-tu faire un petit jeu de questions ? Ce n'est pas une interrogation : ça m'aide à savoir ce que tu sais déjà, pour commencer au bon endroit. Tu peux dire « Je ne sais pas », c'est permis !`;
  const row = el('div', 'row');
  const yes = el('button', 'btn', 'Oui, on y va !'); yes.type = 'button'; yes.onclick = () => playLesson(buildTest(), null);
  const no = el('button', 'btn ghost', 'Plus tard'); no.type = 'button'; no.onclick = after;
  row.append(yes, no); p.append(t, row); box.append(p); v.append(box);
  speak(t.textContent);
}
const semaineDoc = () => Store.docs[`semaine_${child._id}`];
function semaineActive() { const s = semaineDoc(); return s && s.mots?.length && today() <= s.jusqu ? s : null; }
function motsDuJour(s) {
  if (today() === s.jusqu || s.mots.length <= 5) return s.mots;
  const n = Math.max(0, Math.round((dayStart() - new Date(s.debut + 'T00:00').getTime()) / DAY));
  return Array.from({ length: 5 }, (_, i) => s.mots[(n * 5 + i) % s.mots.length]).filter((x, i, a) => a.indexOf(x) === i);
}
function playSemaine() {
  const s = semaineActive(); if (!s) return showMap('accueil');
  const mots = motsDuJour(s), last = today() === s.jusqu;
  const qs = mots.map(m => ({ question: 'Quel mot est bien écrit ?', choix: [m, ...misspell(m)], reponse: m })).filter(q => q.choix.length >= 2);
  playLesson({ id: 'semaine', special: 'semaine', titre: last ? 'Dernier entraînement avant la dictée !' : 'Mes mots de la semaine', sous: 'Dictée du jour', niveau: child.niveau, matiere: 'francais',
    lecon: [{ texte: last ? 'C\'est le grand jour : on révise tous les mots de la semaine. Tu vas y arriver !' : 'Aujourd\'hui, on s\'entraîne sur quelques mots de ta dictée. Écoute bien chaque son.' }],
    exercices: [{ type: 'dictee', titre: 'J\'écris mes mots', mots: mots.map(mot => ({ mot })) }, ...(qs.length ? [{ type: 'bulles', titre: 'Le mot bien écrit', questions: qs }] : [])] }, null);
}

async function playLesson(l, only) {
  if (!l.special && checkTime()) return;
  curLesson = l;
  const exercises = only == null ? l.exercices : [l.exercices[only]];
  sceneShell(l.titre, l.sous || `${l.niveau} · ${SUBJECTS[l.matiere] || ''}`, l.special ? () => showMap('accueil') : () => showLesson(l));
  exercises.forEach(ex => { delete ex._ops; });
  const total = exercises.reduce((s, ex) => s + stepsOf(ex), 0);
  const T = tracker(total);
  S.side.innerHTML = vesselSVG(W.vessel, W.liquid) + '<div class="progress-dots"></div>';
  drawProgress(T);
  if (l.special === 'revision') await say(`On révise les petites erreurs des jours passés. Chaque fois que tu réussis, l'erreur s'efface un peu plus !`);
  if (l.special === 'test') await say('C\'est parti ! Réponds tranquillement. Si tu ne sais pas, touche « Je ne sais pas ».');
  if (l.special) await wait(300);
  if (only == null && l.lecon?.length) {
    for (const step of l.lecon) {
      S.board.innerHTML = '';
      if (step.exemples?.length) { const ch = el('div', 'chips'); step.exemples.forEach(x => ch.append(Object.assign(el('span', 'chip'), { textContent: x }))); S.board.append(ch); }
      await say(esc(step.texte));
      if (step.exemples?.length) await speak(step.exemples.join('. '));
      await cont();
    }
    await say(pick(['À toi de jouer maintenant !', 'C\'est parti, à toi !', 'Prêt ? On joue !']), 'cheer');
  }
  const perItem = []; let streakKo = 0;
  for (const ex of exercises) {
    S.board.innerHTML = ''; S.play.innerHTML = '';
    if (!l.special && exercises.length > 1 && ex.titre) { await say(`${pick(['Nouveau défi', 'Jeu suivant', 'Place au jeu'])} : <b>${esc(ex.titre)}</b> !`); await wait(400); }
    if (ex.type === 'memoriser') ex._audio = audioOf(l.id, l.exercices.indexOf(ex), ex);
    const runner = RUNNERS[ex.type], e0 = T.errors;
    if (runner) await runner(ex, T);
    const ok = T.errors === e0;
    if (ex._rk || ex._lid) perItem.push({ ex, ok });
    /* Test de départ : trois erreurs de suite, on s'arrête là (inutile de continuer plus difficile). */
    if (l.special === 'test') { streakKo = ok ? 0 : streakKo + 1; if (streakKo >= 3) break; }
  }
  const stars = T.errors === 0 ? 3 : T.errors <= 3 ? 2 : 1;
  const before = { stars: totalStars(), eps: episodesOpen(), cab: cabaneCount(totalStars()), badges: badgesOf().length };
  let found = 0; const saves = [];
  if (l.special === 'revision') perItem.forEach(x => Review.result(x.ex._rk, x.ok));
  if (l.special === 'test') {
    for (const x of perItem.filter(x => x.ok)) {
      const lt = lessonById(x.ex._lid), key = `progres_${child._id}_${x.ex._lid}`;
      if (!lt || Store.docs[key]) continue;
      found++;
      saves.push(Store.put(key, { kind: 'progres', enfant: child._id, lecon: lt.id, titre: lt.titre, matiere: lt.matiere, niveau: lt.niveau, etoiles: 1, test: true, essais: 0, parType: {}, maj: Date.now() }));
    }
    child.testFait = true; const { _id, ...data } = child; saves.push(Store.put(child._id, data));
  }
  if (l.special === 'semaine') { const s = semaineDoc(); s.fait = { ...(s.fait || {}), [today()]: true }; saves.push(Store.put(`semaine_${child._id}`, s)); }
  if (!l.special) {
    const key = `progres_${child._id}_${l.id}`;
    const prev = Store.docs[key];
    saves.push(Store.put(key, {
      kind: 'progres', enfant: child._id, lecon: l.id, titre: l.titre, matiere: l.matiere, niveau: l.niveau,
      etoiles: Math.max(stars, prev?.test ? 0 : prev?.etoiles || 0), dernieresEtoiles: stars, erreurs: T.errors, essais: (prev?.essais || 0) + 1,
      parType: T.byType, maj: Date.now(),
    }));
  }
  saves.push(Review.flush());
  if (l.special !== 'test') saves.push(Days.addSession());
  /* Les sauvegardes partent en arrière-plan : l'écran de fin s'affiche tout de suite. */
  Promise.all(saves).catch(() => {});
  curLesson = null;
  S.play.innerHTML = ''; S.board.innerHTML = '';
  const isTest = l.special === 'test';
  const m = el('div', 'medal', isTest ? '<div class="row"></div>' : `<div class="big-stars">${[0, 1, 2].map(i => STAR3D(i < stars)).join('')}</div><div class="news"></div><div class="row"></div>`);
  const nxt = !l.special && nextAfter(l);
  const back = el('button', 'btn' + (nxt ? ' ghost' : ''), isTest ? 'Voir mon parcours' : `${ICON.home.replace('stroke="currentColor"', 'stroke="currentColor" width="20" height="20"')} Accueil`); back.type = 'button';
  back.onclick = () => isTest ? showMap('parcours') : showMap('accueil');
  if (nxt) {
    const go = el('button', 'btn', 'Leçon suivante ›'); go.type = 'button'; go.title = nxt.titre;
    go.onclick = () => showLesson(nxt);
    m.querySelector('.row').append(go);
  }
  m.querySelector('.row').append(back);
  if (!l.special) { const again = el('button', 'btn ghost', 'Rejouer'); again.type = 'button'; again.onclick = () => playLesson(l, only); m.querySelector('.row').append(again); }
  if (nxt) { const t = el('p', 'note', ''); t.textContent = `Ensuite : ${nxt.titre}`; m.append(t); }
  /* Ce qui vient d'être gagné : épisode, objet pour la cabane, badge. */
  const news = m.querySelector('.news'), after = { stars: totalStars(), eps: episodesOpen() };
  const notes = [];
  if (news) {
    if (after.eps > before.eps) {
      const n = el('div', 'new-item', `<b>Nouvel épisode !</b><span></span>`); n.querySelector('span').textContent = EPISODES[after.eps - 1][0];
      const read = el('button', 'btn small', 'Lire l\'épisode'); read.type = 'button'; read.onclick = () => showEpisode(after.eps - 1, () => showMap('accueil'));
      n.append(read); news.append(n); notes.push('Un nouvel épisode de l\'histoire t\'attend !');
    }
    if (cabaneCount(after.stars) > before.cab) { const it = CABANE[cabaneCount(after.stars) - 1][1]; const n = el('div', 'new-item', '<b>Pour la cabane</b><span></span>'); n.querySelector('span').textContent = `Noisette a reçu ${it} !`; news.append(n); notes.push(`Noisette a reçu ${it} pour sa cabane.`); }
    if (badgesOf().length > before.badges) { const b = badgesOf().find(x => x.lid === l.id); if (b) { const n = el('div', 'new-item', '<b>Nouveau badge</b><span></span>'); n.querySelector('span').textContent = b.nom; news.append(n); } }
  }
  S.play.append(m); sfx.star(); sparkle(m, 24); back.focus({ preventScroll: true }); revealPlay();
  if (isTest) {
    say(`Merci ${esc(child.prenom)} ! ${found ? `Tu connais déjà ${found} leçon${found > 1 ? 's' : ''} : je les ai cochées.` : 'Maintenant, je sais par où commencer.'} Ton parcours t'attend !`, 'cheer');
  } else {
    say((stars === 3 ? `${pick(styleNow().cri)} Trois étoiles, ${esc(child.prenom)} ! Tu es incroyable !` : `${praise()} Tu gagnes ${stars} étoile${stars > 1 ? 's' : ''}, ${esc(child.prenom)}.${l.special ? '' : ' Tu rejoues pour aller chercher les autres ?'}`) + (notes.length ? ' ' + notes.join(' ') : ''), 'cheer');
  }
}
/* La leçon qui suit dans le parcours de la même matière (sinon la prochaine leçon conseillée). */
function nextAfter(l) {
  const items = subjectPath(l.matiere), i = items.findIndex(x => x.l.id === l.id);
  const after = items.slice(i + 1).find(x => !x.done && !x.locked) || items.slice(i + 1).find(x => !x.locked);
  return after?.l || (nextLesson()?.id !== l.id ? nextLesson() : null);
}
function showEpisode(i, back) {
  const v = screen(back);
  const sc = el('section', 'scene');
  sc.innerHTML = '<div class="scene-head"><h2></h2><span class="lv"></span></div>';
  sc.querySelector('h2').textContent = EPISODES[i][0]; sc.querySelector('.lv').textContent = `Épisode ${i + 1} sur ${EPISODES.length}`;
  const d = el('div', 'dialog'); d.append(guideEl(WORLDS.animaux));
  const p = el('div', 'parch speech'); const card = el('p', 'txt story'); card.append(readable(EPISODES[i][1], { words: true })); p.append(card);
  const acts = el('div', 'acts'); const again = el('button', 'listen', SPEAKER + 'Réécouter'); again.type = 'button'; again.onclick = () => { unlocked = false; unlockAudio(); speakHighlight(card, EPISODES[i][1], { rate: .92 }); };
  acts.append(again); p.append(acts); d.append(p); sc.append(d);
  const row = el('div', 'row'); row.style.justifyContent = 'center';
  const ok = el('button', 'btn', 'Fermer le livre'); ok.type = 'button'; ok.onclick = back; row.append(ok);
  if (i + 1 < episodesOpen()) { const nx = el('button', 'btn ghost', 'Épisode suivant'); nx.type = 'button'; nx.onclick = () => showEpisode(i + 1, back); row.append(nx); }
  sc.append(row); v.append(sc);
  speakHighlight(card, EPISODES[i][1], { rate: .92 });
}

/* ================= Espace adulte ================= */
function adultGate() {
  const v = screen(child ? showMap : showHome);
  const p = el('div', 'parch panel');
  p.innerHTML = '<h2 style="color:var(--brown)">Espace adulte</h2>';
  p.append(gateForm(() => showAdult('suivi')));
  v.append(p);
  p.querySelector('#gate-in').focus();
}
$('#adult').onclick = adultGate;

function showAdult(tab = 'suivi') {
  setChild(null);
  const v = screen(showHome);
  const wrap = el('div', 'adult');
  wrap.append(el('h2', '', 'Espace adulte'));
  wrap.append(el('p', 'note', Store.mode === 'cloud'
    ? 'Les données sont enregistrées dans ton compte claude.ai : elles sont privées et suivent l\'enfant d\'un appareil à l\'autre.'
    : 'Les données sont enregistrées sur cet appareil seulement (ouvre l\'application depuis ton compte claude.ai pour les retrouver partout).'));
  const tabs = el('div', 'tabs'); tabs.style.justifyContent = 'flex-start';
  const body = el('div', 'panel');
  [['suivi', 'Suivi'], ['devoirs', 'Devoirs et dictée'], ['profils', 'Profils'], ['creer', 'Créer une leçon'], ['lecons', 'Mes leçons'], ['audio', 'Audio des chansons'], ['voix', 'Voix']].forEach(([k, t]) => {
    const b = el('button', 'tab', t); b.type = 'button'; b.setAttribute('aria-selected', String(tab === k));
    b.onclick = () => showAdult(k); tabs.append(b);
  });
  wrap.append(tabs, body); v.append(wrap);
  ({ suivi: adultSuivi, devoirs: adultDevoirs, profils: adultProfils, creer: adultCreer, lecons: adultLecons, audio: adultAudio, voix: adultVoix })[tab](body);
}
const ADVICE = {
  bulles: 'Lisez la question ensemble à voix haute et demandez-lui d\'expliquer son choix avant de répondre.',
  classer: 'Jouez à « dans quelle famille ? » avec des objets de la maison ou des mots du quotidien.',
  dictee: 'Cinq minutes par jour : il dit le mot lentement, l\'épelle, puis l\'écrit sur une ardoise sans modèle.',
  ordre: 'Demandez-lui de raconter dans l\'ordre les étapes d\'une recette, de sa journée ou d\'une histoire.',
  trous: 'Après une lecture, demandez-lui de raconter l\'histoire avec ses mots et de redire les mots importants.',
  conjugaison: 'Récitez la conjugaison en rythme (en marchant, en tapant dans les mains) : je chante, tu chantes…',
  lecture: 'Lisez une page chaque soir ensemble, en alternant une phrase chacun, puis posez une question sur le texte.',
  memoriser: 'Ajoutez un vers par jour, récité devant la famille. L\'enregistrement aide à se réécouter.',
  addition: 'Posez une addition par jour sur papier quadrillé, en disant « unités, dizaines » à voix haute.',
  calcul: 'Jouez au calcul mental dans la voiture ou à table : « 7 plus 5 ? ». La rapidité vient avec la répétition.',
  fluence: 'Revoyez une seule table à la fois, quelques minutes par jour, puis refaites le calcul rapide pour battre son record.',
  ecoute: 'Écoutez une comptine ou un dessin animé court en anglais, et répétez ensemble les mots connus.',
};
function adultSuivi(body) {
  const kids = Store.children();
  if (!kids.length) { body.append(Object.assign(el('div', 'parch'), { textContent: 'Aucun profil pour l\'instant. Crée-en un dans l\'onglet Profils.' })); return; }
  kids.forEach(k => {
    const box = el('div', 'parch');
    const prog = Store.progress(k._id).sort((a, b) => (b.maj || 0) - (a.maj || 0));
    const h = el('h3'); h.textContent = `${k.prenom} · ${k.niveau}`; box.append(h);
    const played = prog.filter(p => !p.test);
    const stars = played.reduce((s, p) => s + (p.etoiles || 0), 0);
    const jours = Store.docs[`jours_${k._id}`]?.dates || {}, rv = Store.docs[`revoir_${k._id}`];
    const kp = el('div', 'kpis');
    kp.innerHTML = `<div class="kpi"><b>${played.filter(p => p.etoiles).length}</b><span>leçons réussies</span></div><div class="kpi"><b>${stars}</b><span>étoiles</span></div>
      <div class="kpi"><b>${Store.docs[`jours_${k._id}`]?.sessions || 0}</b><span>séances jouées</span></div><div class="kpi"><b>${rv?.acquis || 0}</b><span>erreurs corrigées pour de bon</span></div>`;
    box.append(kp);
    /* Bilan de la semaine */
    const week = [...Array(7)].map((_, i) => ymd(new Date(dayStart(-i))));
    const dayKey = t => ymd(new Date(t));
    const wk = { days: week.filter(d => jours[d]?.sessions).length, min: Math.round(week.reduce((s, d) => s + (jours[d]?.min || 0), 0)), sessions: week.reduce((s, d) => s + (jours[d]?.sessions || 0), 0) };
    const recent = played.filter(p => p.maj && week.includes(dayKey(p.maj)));
    const types = {};
    recent.forEach(p => Object.entries(p.parType || {}).forEach(([t, c]) => { const tt = t.split('-')[0]; types[tt] ||= { ok: 0, err: 0 }; types[tt].ok += c.ok; types[tt].err += c.err; }));
    const weak = Object.entries(types).filter(([, c]) => c.err / Math.max(1, c.ok + c.err) > .25).sort((a, b) => b[1].err - a[1].err);
    const bil = el('div', 'bilan');
    bil.innerHTML = '<h4>Bilan des 7 derniers jours</h4><p></p><ul></ul>';
    bil.querySelector('p').textContent = wk.sessions
      ? `${k.prenom} a joué ${wk.days} jour${wk.days > 1 ? 's' : ''} sur 7, ${wk.sessions} séance${wk.sessions > 1 ? 's' : ''}, environ ${wk.min} minute${wk.min > 1 ? 's' : ''}. ${recent.length} leçon${recent.length > 1 ? 's' : ''} travaillée${recent.length > 1 ? 's' : ''} : ${recent.slice(0, 4).map(p => p.titre).join(', ')}${recent.length > 4 ? '…' : ''}. ${(rv && Object.keys(rv.items).length) ? `${Object.keys(rv.items).length} erreur${Object.keys(rv.items).length > 1 ? 's' : ''} en cours de révision.` : ''}`
      : `${k.prenom} n'a pas joué cette semaine.`;
    const ul = bil.querySelector('ul');
    const tip = t => ul.append(Object.assign(el('li'), { textContent: t }));
    weak.slice(0, 3).forEach(([t]) => tip(`${TYPES[t] || t} : ${ADVICE[t] || 'Refaites la leçon ensemble en expliquant à voix haute.'}`));
    if (wk.days < 4) tip('Visez 10 à 15 minutes par jour, plutôt qu\'une longue séance : la mémoire aime la régularité.');
    if (!weak.length && wk.sessions) tip('Tout va bien : continuez au même rythme. Proposez-lui une leçon de la classe suivante en révision s\'il s\'ennuie.');
    if (rv && Object.values(rv.items).some(it => it.fails >= 3)) tip(`Certaines erreurs reviennent souvent (${Object.values(rv.items).filter(it => it.fails >= 3).slice(0, 3).map(it => it.titre).filter(Boolean).join(', ')}) : reprenez la leçon ensemble.`);
    box.append(bil);
    /* Carte des compétences du programme */
    box.append(skillMap(k));
    /* Enregistrements */
    const recs = Store.all('enregistrement').filter(r => r.enfant === k._id).sort((a, b) => b.date - a.date);
    if (recs.length) {
      const det = el('details', 'recs'); det.innerHTML = `<summary>Lectures et récitations enregistrées (${recs.length})</summary>`;
      recs.slice(0, 30).forEach(r => {
        const row = el('div', 'rec-row'); const t = el('span'); t.textContent = `${r.titre || 'Enregistrement'} · ${new Date(r.date).toLocaleDateString('fr-FR')}`;
        const au = el('audio'); au.controls = true; au.preload = 'none'; au.src = r.url || ('/_blob/' + r.asset);
        const del = el('button', 'btn small ghost', 'Supprimer'); del.type = 'button';
        del.onclick = async () => { if (!del.dataset.c) { del.dataset.c = 1; del.textContent = 'Confirmer'; return; } try { (await window.claude?.use?.('assets'))?.delete(r.asset); } catch (e) {} await Store.del(r._id); row.remove(); };
        row.append(t, au, del); det.append(row);
      });
      box.append(det);
    }
    if (prog.length) {
      const det = el('details'); det.innerHTML = '<summary>Toutes les leçons jouées</summary>';
      const tw = el('div', 'table-wrap'); const t = el('table');
      t.innerHTML = '<thead><tr><th>Leçon</th><th>Matière</th><th>Étoiles</th><th>Erreurs (dernière fois)</th><th>Dernière séance</th></tr></thead><tbody></tbody>';
      prog.forEach(p => {
        const tr = el('tr');
        [p.titre || p.lecon, SUBJECTS[p.matiere] || '', p.test ? 'acquise au test' : '★'.repeat(p.etoiles || 0) || '–', String(p.erreurs ?? '–'), p.maj ? new Date(p.maj).toLocaleDateString('fr-FR') : '–']
          .forEach(x => tr.append(Object.assign(el('td'), { textContent: x })));
        t.querySelector('tbody').append(tr);
      });
      tw.append(t); det.append(tw); box.append(det);
    } else box.append(el('p', 'note', 'Pas encore de leçon jouée.'));
    body.append(box);
  });
}
/* Pour chaque section du programme de la classe : acquis, en cours, à faire, ou pas encore de leçon. */
function skillMap(k) {
  const det = el('details', 'skills'); det.innerHTML = `<summary>Carte des compétences du programme (${k.niveau})</summary>`;
  const secs = INDEX.filter(s => s.niveaux.includes(k.niveau));
  const lessons = allLessons();
  const counts = { acquis: 0, cours: 0, faire: 0, vide: 0 };
  const byM = {};
  secs.forEach(s => {
    const ls = lessons.filter(l => l.programme?.section === s.id);
    const ps = ls.map(l => Store.docs[`progres_${k._id}_${l.id}`]).filter(Boolean);
    const st = !ls.length ? 'vide' : ps.some(p => p.test || (p.etoiles || 0) >= 2) ? 'acquis' : ps.length ? 'cours' : 'faire';
    counts[st]++;
    ((byM[s.matiere] ||= {})[s.domaine] ||= []).push({ s, st, ls });
  });
  const leg = el('p', 'legend', `<span class="st acquis"></span> acquis (${counts.acquis}) <span class="st cours"></span> en cours (${counts.cours}) <span class="st faire"></span> à faire (${counts.faire}) <span class="st vide"></span> pas encore de leçon (${counts.vide})`);
  det.append(leg);
  Object.entries(byM).forEach(([m, doms]) => {
    det.append(Object.assign(el('h4'), { textContent: SUBJECTS[m] || m }));
    Object.entries(doms).forEach(([d, list]) => {
      const g = el('div', 'skill-dom'); g.append(Object.assign(el('b'), { textContent: d }));
      const ul = el('ul');
      list.forEach(({ s, st, ls }) => { const li = el('li', '', `<span class="st ${st}"></span><span></span>`); li.lastChild.textContent = s.section + (ls.length ? ` — ${ls.map(l => l.titre).join(', ')}` : ''); ul.append(li); });
      g.append(ul); det.append(g);
    });
  });
  return det;
}
/* Devoirs du jour et mots de la semaine, par enfant. */
function adultDevoirs(body) {
  const kids = Store.children();
  if (!kids.length) { body.append(Object.assign(el('div', 'parch'), { textContent: 'Crée d\'abord un profil dans l\'onglet Profils.' })); return; }
  kids.forEach(k => {
    const box = el('div', 'parch');
    box.append(Object.assign(el('h3'), { textContent: k.prenom }));
    const dv = Store.docs[`devoirs_${k._id}`];
    const f = el('form', 'form');
    const ls = allLessons().filter(l => levelRank(l.niveau) <= levelRank(k.niveau)).sort((a, b) => levelRank(b.niveau) - levelRank(a.niveau) || String(a.matiere).localeCompare(b.matiere) || (a.ordre || 0) - (b.ordre || 0));
    f.innerHTML = `<h4>Devoirs</h4><p class="note">Les leçons cochées apparaissent en premier sur l'accueil de l'enfant, jusqu'à la date choisie.</p>
      <div class="row"><label>Pour le<input type="date" class="d-pour"></label><label>Petit mot (facultatif)<input class="d-mot" maxlength="120" placeholder="Révise bien tes tables !"></label></div>
      <div class="checks lessons-pick"></div><div class="row"><button class="btn small" type="submit">Enregistrer les devoirs</button><button class="btn small ghost d-clear" type="button">Effacer</button><span class="note d-msg" aria-live="polite"></span></div>`;
    f.querySelector('.d-pour').value = dv?.pour || today();
    f.querySelector('.d-mot').value = dv?.mot || '';
    ls.forEach(l => { const lab = el('label', '', '<input type="checkbox">'); lab.firstChild.value = l.id; lab.firstChild.checked = !!dv?.lecons?.includes(l.id); lab.append(document.createTextNode(` ${l.niveau} · ${SUBJECTS[l.matiere] || ''} · ${l.titre}`)); f.querySelector('.lessons-pick').append(lab); });
    f.onsubmit = async e => {
      e.preventDefault();
      const lecons = [...f.querySelectorAll('.lessons-pick input:checked')].map(i => i.value);
      await Store.put(`devoirs_${k._id}`, { kind: 'devoirs', enfant: k._id, lecons, pour: f.querySelector('.d-pour').value || today(), mot: f.querySelector('.d-mot').value.trim(), cree: Date.now() });
      f.querySelector('.d-msg').textContent = lecons.length ? `${lecons.length} leçon${lecons.length > 1 ? 's' : ''} en devoirs ✓` : 'Aucune leçon cochée.';
    };
    f.querySelector('.d-clear').onclick = async () => { await Store.del(`devoirs_${k._id}`); showAdult('devoirs'); };
    box.append(f);
    const sm = Store.docs[`semaine_${k._id}`];
    const g = el('form', 'form');
    g.innerHTML = `<h4>Mots de la semaine</h4><p class="note">Colle les mots de la dictée de l'école. Chaque jour, l'enfant s'entraîne sur quelques mots (seulement à l'oral, jamais écrits à l'écran) ; la veille, sur tous les mots.</p>
      <label>Mots (séparés par des virgules ou des retours à la ligne)<textarea class="s-mots" placeholder="chaton, maison, poisson, garçon…"></textarea></label>
      <div class="row"><label>Date de la dictée à l'école<input type="date" class="s-date"></label></div>
      <div class="row"><button class="btn small" type="submit">Enregistrer</button><span class="note s-msg" aria-live="polite"></span></div>`;
    g.querySelector('.s-mots').value = sm?.mots?.join(', ') || '';
    g.querySelector('.s-date').value = sm?.jusqu || ymd(new Date(dayStart(4)));
    g.onsubmit = async e => {
      e.preventDefault();
      const mots = [...new Set(g.querySelector('.s-mots').value.split(/[\n,;]+/).map(x => x.trim()).filter(Boolean))].slice(0, 30);
      if (!mots.length) { g.querySelector('.s-msg').textContent = 'Ajoute au moins un mot.'; return; }
      await Store.put(`semaine_${k._id}`, { kind: 'semaine', enfant: k._id, mots, jusqu: g.querySelector('.s-date').value || today(), debut: today(), fait: {} });
      g.querySelector('.s-msg').textContent = `${mots.length} mots enregistrés ✓ La dictée du jour apparaît sur l'accueil.`;
    };
    box.append(g);
    body.append(box);
  });
}
function adultProfils(body) {
  const kids = Store.children();
  kids.forEach(k => {
    const box = el('div', 'parch');
    box.append(childForm(k, () => showAdult('profils')));
    const row = el('div', 'row');
    const test = el('button', 'btn small ghost', 'Refaire le test de départ'); test.type = 'button'; test.style.color = 'var(--brown)';
    test.onclick = () => { setChild(k); offerTest(); };
    const del = el('button', 'btn small ghost', 'Supprimer ce profil'); del.type = 'button'; del.style.color = 'var(--ko)'; del.style.borderColor = 'var(--ko)';
    del.onclick = () => {
      if (del.dataset.confirm) {
        const mine = Object.entries(Store.docs).filter(([id, d]) => id === k._id || d?.enfant === k._id).map(([id]) => id);
        Promise.all(mine.map(id => Store.del(id))).then(() => showAdult('profils'));
      } else { del.dataset.confirm = '1'; del.textContent = `Confirmer : supprimer ${k.prenom} et sa progression`; }
    };
    row.append(test, del); box.append(row); body.append(box);
  });
  const add = el('div', 'parch'); add.append(el('h3', '', 'Ajouter un enfant'), childForm(null, () => showAdult('profils')));
  body.append(add);
}
function adultLecons(body) {
  const mine = Store.lessons();
  if (!mine.length) { body.append(Object.assign(el('div', 'parch'), { textContent: 'Aucune leçon créée pour l\'instant. Utilise l\'onglet « Créer une leçon ».' })); return; }
  mine.forEach(l => {
    const box = el('div', 'parch');
    box.append(Object.assign(el('h3'), { textContent: l.titre }));
    box.append(Object.assign(el('p', 'note'), { textContent: `${l.niveau} · ${SUBJECTS[l.matiere] || l.matiere} · ${l.exercices.map(e => TYPES[e.type] || e.type).join(', ')}` }));
    const del = el('button', 'btn small ghost', 'Supprimer'); del.type = 'button';
    del.onclick = () => { if (del.dataset.confirm) Store.del(l._doc).then(() => showAdult('lecons')); else { del.dataset.confirm = '1'; del.textContent = 'Confirmer la suppression'; } };
    box.append(del); body.append(box);
  });
}

/* ---------- Ajouter l'audio d'une poésie ou d'une chanson, découpé automatiquement en vers ---------- */
function adultAudio(body) {
  const items = [];
  allLessons().forEach(l => l.exercices.forEach((ex, i) => { if (ex.type === 'memoriser') items.push({ l, ex, i }); }));
  const p = el('div', 'parch');
  p.innerHTML = `<h3>Audio des poésies et chansons</h3>
    <p class="note">Ajoute un vrai enregistrement (téléchargé depuis le site de l'école, une médiathèque, ou enregistré par toi). L'application le découpe en vers en repérant les pauses ; tu vérifies chaque vers avant d'enregistrer. L'enfant n'entend alors plus la voix de synthèse sur le texte, seulement l'enregistrement.</p>`;
  items.forEach(({ l, ex, i }) => {
    const row = el('div', 'audio-row');
    const cur = audioOf(l.id, i, ex);
    const t = el('div'); t.append(Object.assign(el('b'), { textContent: ex.titre || l.titre }), Object.assign(el('span', 'note'), { textContent: ` · ${l.niveau} · ${ex.vers.length} vers · ${cur ? (Store.docs[audioDocKey(l.id, i)] ? 'enregistrement ajouté' : 'air fourni par l\'application') : 'pas d\'audio'}` }));
    const input = el('input'); input.type = 'file'; input.accept = 'audio/*'; input.hidden = true; input.id = 'au-' + uid();
    const lab = el('label', 'btn small ghost', cur ? 'Remplacer l\'audio' : 'Ajouter un audio'); lab.htmlFor = input.id; lab.style.color = 'var(--brown)';
    const out = el('div', 'audio-edit');
    input.onchange = () => { const f = input.files?.[0]; if (f) editCuts(out, l, ex, i, f); input.value = ''; };
    row.append(t, lab, input);
    if (Store.docs[audioDocKey(l.id, i)]) {
      const del = el('button', 'btn small ghost', 'Retirer'); del.type = 'button';
      del.onclick = async () => { await Store.del(audioDocKey(l.id, i)); showAdult('audio'); };
      row.append(del);
    }
    p.append(row, out);
  });
  if (!items.length) p.append(el('p', 'note', 'Aucune poésie ni chanson pour l\'instant.'));
  body.append(p);
}
async function editCuts(out, l, ex, i, file) {
  out.innerHTML = '<p class="note">Je cherche les pauses entre les vers…</p>';
  let res = null;
  try { res = await splitBySilence(file, ex.vers.length); } catch (e) { res = null; }
  if (!res) { out.innerHTML = '<p class="warn">Ce fichier audio n\'a pas pu être lu. Essaie un MP3 ou un M4A.</p>'; return; }
  const url = URL.createObjectURL(file), cuts = res.vers;
  while (cuts.length < ex.vers.length) { const lastC = cuts[cuts.length - 1]; cuts.push({ debut: lastC.fin, fin: Math.min(res.duree, lastC.fin + 3) }); }
  out.innerHTML = '';
  if (res.vers.length < ex.vers.length) out.append(el('p', 'warn', 'Je n\'ai pas trouvé assez de pauses : ajuste les vers à la main.'));
  const credit = el('label', '', 'Source et droits (affichés sous le texte)<input maxlength="160" placeholder="Ex. : enregistré par Maman · ou nom du site et licence">');
  const form = el('div', 'form'); form.append(credit);
  cuts.forEach((c, k) => {
    const r = el('div', 'cut-row');
    const name = el('span'); name.textContent = `${k + 1}. ${ex.vers[k]}`;
    const tm = el('span', 'tm');
    const show = () => { tm.textContent = `${c.debut.toFixed(1)} s → ${c.fin.toFixed(1)} s`; };
    const btn = (txt, f, lbl) => { const b = el('button', 'btn small ghost', txt); b.type = 'button'; b.setAttribute('aria-label', lbl); b.onclick = () => { f(); show(); }; return b; };
    const play = el('button', 'btn small', SPEAKER + ' Écouter'); play.type = 'button'; play.onclick = () => playSegment(url, c.debut, c.fin);
    r.append(name, tm, play,
      btn('début −', () => { c.debut = Math.max(0, c.debut - .2); }, 'Avancer le début'), btn('début +', () => { c.debut = Math.min(c.fin - .3, c.debut + .2); }, 'Retarder le début'),
      btn('fin −', () => { c.fin = Math.max(c.debut + .3, c.fin - .2); }, 'Avancer la fin'), btn('fin +', () => { c.fin = Math.min(res.duree, c.fin + .2); }, 'Retarder la fin'));
    show(); form.append(r);
  });
  const save = el('button', 'btn', 'Enregistrer cet audio'); save.type = 'button';
  const msg = el('span', 'note'); msg.setAttribute('aria-live', 'polite');
  save.onclick = async () => {
    save.disabled = true; msg.textContent = 'Enregistrement…';
    let src = null;
    try {
      const assets = Store.mode === 'cloud' ? await window.claude?.use?.('assets') : null;
      if (assets) src = (await assets.upload(file)).url;
      else { const key = uid(); await AudioBox.put(key, file); src = 'idb:' + key; }
    } catch (e) { msg.textContent = 'L\'audio n\'a pas pu être enregistré (fichier trop gros ?).'; save.disabled = false; return; }
    await Store.put(audioDocKey(l.id, i), { kind: 'audio', lecon: l.id, ex: i, src, credit: credit.querySelector('input').value.trim(), vers: cuts.map(c => ({ debut: +c.debut.toFixed(2), fin: +c.fin.toFixed(2) })) });
    msg.textContent = Store.mode === 'cloud' ? 'Audio enregistré ✓ Il sera utilisé sur tous les appareils.' : 'Audio enregistré sur cet appareil ✓';
  };
  const row = el('div', 'row'); row.append(save, msg); form.append(row);
  out.append(form);
}

/* ---------- Choisir la voix des guides ---------- */
function adultVoix(body) {
  loadVoices();
  const p = el('div', 'parch');
  p.innerHTML = `<h3>La voix des guides</h3>
    <p class="note">L'application utilise les voix installées sur cet appareil. Elle choisit automatiquement la plus naturelle, puis chaque guide lui donne son caractère (plus aiguë pour l'écureuil, plus grave pour le capitaine pompier…). Tu peux aussi imposer une voix.</p>`;
  let pref = ''; try { pref = localStorage.getItem('ecole-voix') || ''; } catch (e) {}
  const list = el('div', 'form');
  const row = (name, label, note) => {
    const r = el('div', 'row');
    const l = el('label'); l.style.flexDirection = 'row'; l.style.alignItems = 'center'; l.style.gap = '8px';
    const radio = el('input'); radio.type = 'radio'; radio.name = 'voix'; radio.value = name; radio.checked = pref === name; radio.style.width = 'auto';
    radio.onchange = () => { try { name ? localStorage.setItem('ecole-voix', name) : localStorage.removeItem('ecole-voix'); } catch (e) {} };
    l.append(radio, document.createTextNode(label));
    if (note) { const n = el('span', 'note'); n.textContent = note; l.append(n); }
    const test = el('button', 'btn small ghost', 'Écouter'); test.type = 'button'; test.style.color = 'var(--brown)'; test.style.borderColor = 'var(--brown-soft)';
    test.onclick = () => {
      unlocked = false; unlockAudio();
      const v = name ? voices.find(x => x.name === name) : null;
      speak(`Coucou ! Je suis ${W.guide.name}. On apprend en s'amusant ? Youpi !`, { voice: v });
    };
    r.append(l, test); list.append(r);
  };
  row('', 'Automatique (recommandé)', voices[0] ? `actuellement : ${voices[0].name}` : '');
  voices.forEach((v, i) => row(v.name, v.name, voiceScore(v) >= 60 ? '· très naturelle' : i === 0 ? '· la meilleure ici' : ''));
  p.append(list);
  if (!voices.length) p.append(el('p', 'warn', canSpeak ? 'Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page.' : 'Ce navigateur ne sait pas lire à voix haute.'));
  const tips = el('div', 'note');
  tips.innerHTML = `<p><b>Pour des voix plus naturelles :</b></p>
    <p>• <b>iPad / iPhone</b> : Réglages › Accessibilité › Contenu énoncé › Voix › Français › télécharger « Amélie (Premium) » ou « Audrey (améliorée) ».</p>
    <p>• <b>Tablette Android</b> : Paramètres › Accessibilité › Synthèse vocale › moteur Google › installer les voix françaises « haute qualité ».</p>
    <p>• <b>Ordinateur</b> : le navigateur Microsoft Edge propose des voix « Natural » très réalistes (Denise, Eloise, Henri…) ; Chrome propose « Google français ».</p>`;
  p.append(tips);
  body.append(p);
}

/* ---------- Créer une leçon à partir d'un texte ---------- */
function adultCreer(body) {
  const p = el('div', 'parch');
  p.innerHTML = `<h3>Créer une leçon à partir d'un texte</h3>
    <p class="note">Colle une liste de mots pour une dictée, une poésie ou une chanson, des verbes, un texte sur un métier… L'application retrouve la section du programme officiel qui correspond et prépare la leçon et les exercices.</p>
    <form class="form" id="gen">
      <label>Texte<textarea id="g-text" placeholder="Exemple : maison, poisson, garçon, leçon, ballon"></textarea></label>
      <div class="row"><label class="btn ghost small photo-btn" for="g-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg> Photographier le cahier</label><input type="file" id="g-photo" accept="image/*" capture="environment" hidden><span class="note" id="g-photo-msg" aria-live="polite"></span></div>
      <div class="row"><label>Classe<select id="g-niveau">${LEVELS.map(l => `<option>${l}</option>`).join('')}</select></label>
      <label>Matière<select id="g-matiere"><option value="">Je ne sais pas</option>${Object.entries(SUBJECTS).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></label></div>
      <div><p class="note">Types d'exercices souhaités (aucun coché : choix automatique)</p><div class="checks">${Object.entries(TYPES).map(([k, n]) => `<label><input type="checkbox" value="${k}"> ${n}</label>`).join('')}</div></div>
      <div class="row"><button class="btn" type="submit" id="g-go">Créer la leçon</button><button class="btn ghost" type="button" id="g-stop" hidden>Arrêter</button><span class="note" id="g-status" aria-live="polite"></span></div>
    </form><div id="g-out"></div>`;
  body.append(p);
  if (child) p.querySelector('#g-niveau').value = child.niveau;
  /* Photo du cahier : l'IA recopie le texte de la leçon, que l'adulte relit avant de créer. */
  p.querySelector('#g-photo').onchange = async e => {
    const file = e.target.files?.[0], msg = p.querySelector('#g-photo-msg'); if (!file) return;
    msg.textContent = 'Je lis la photo…';
    try {
      const sample = await Promise.resolve(window.claude?.use?.('sample')).catch(() => null);
      const lim = sample ? await sample.limits?.().catch(() => null) : null;
      if (!sample || (lim && !lim.images)) { msg.textContent = 'La lecture des photos demande l\'IA : ouvre l\'application depuis claude.ai, ou recopie le texte.'; return; }
      const r = await sample('Voici la photo d\'une page de cahier d\'école élémentaire (leçon, liste de mots, poésie, verbes…). Recopie exactement le texte de la leçon, ligne par ligne, sans rien ajouter ni corriger. Ignore les dessins, la date et les tampons. Pour une liste de mots, mets un mot par ligne. Réponds uniquement par le texte recopié.', { images: [file], modelTier: 'default' });
      const txt = String(r.text || '').trim();
      if (!txt) { msg.textContent = 'Je n\'ai pas réussi à lire le texte. Essaie une photo plus nette, bien à plat.'; return; }
      p.querySelector('#g-text').value = txt;
      msg.textContent = 'Texte recopié : relis-le et corrige-le si besoin, puis crée la leçon.';
    } catch (err) { msg.textContent = err?.code === 'rate_limited' ? 'L\'IA est très demandée : réessaie dans un moment.' : 'La photo n\'a pas pu être lue. Recopie le texte à la main.'; }
    e.target.value = '';
  };
  let ctl = null;
  p.querySelector('#g-stop').onclick = () => ctl?.abort();
  p.querySelector('#gen').onsubmit = async e => {
    e.preventDefault();
    const text = p.querySelector('#g-text').value.trim();
    if (text.length < 3) { p.querySelector('#g-status').textContent = 'Colle d\'abord un texte.'; return; }
    const niveau = p.querySelector('#g-niveau').value, matiere = p.querySelector('#g-matiere').value;
    const types = [...p.querySelectorAll('.checks input:checked')].map(i => i.value);
    const status = p.querySelector('#g-status'), out = p.querySelector('#g-out'), go = p.querySelector('#g-go'), stop = p.querySelector('#g-stop');
    out.innerHTML = ''; go.disabled = true;
    let lesson = null, how = '';
    const sample = await Promise.resolve(window.claude?.use?.('sample')).catch(() => null);
    if (sample) {
      status.textContent = 'L\'IA prépare la leçon… (cela peut prendre une minute)'; stop.hidden = false; ctl = new AbortController();
      try { lesson = await generateWithAI(sample, text, niveau, matiere, types, ctl.signal); how = 'ia'; }
      catch (err) {
        const code = err?.code;
        if (code === 'cancelled') { status.textContent = 'Création arrêtée.'; go.disabled = false; stop.hidden = true; return; }
        status.textContent = ({ not_granted: 'L\'IA n\'a pas été autorisée : la leçon est préparée sans IA.', rate_limited: 'L\'IA est très demandée : la leçon est préparée sans IA. Réessaie plus tard pour une version plus riche.', invalid_json: 'La réponse de l\'IA était incomplète : la leçon est préparée sans IA.' })[code]
          || 'L\'IA n\'a pas pu répondre : la leçon est préparée sans IA.';
      }
      stop.hidden = true;
    }
    if (!lesson) { lesson = generateLocally(text, niveau, matiere, types); how = 'local'; if (!sample) status.textContent = 'Leçon préparée sans IA (l\'IA n\'est pas disponible ici).'; }
    else status.textContent = 'Leçon prête. Vérifie-la avant de l\'enregistrer.';
    go.disabled = false;
    renderPreview(out, lesson, how);
  };
}
function renderPreview(out, l, how) {
  out.innerHTML = '';
  const box = el('div', 'preview');
  box.append(Object.assign(el('h3'), { textContent: l.titre }));
  box.append(Object.assign(el('p', 'note'), { textContent: `${l.niveau} · ${SUBJECTS[l.matiere] || l.matiere} · préparée ${how === 'ia' ? 'avec l\'IA' : 'sans IA'}` }));
  const sec = sectionById(l.programme?.section);
  const ps = el('p');
  if (sec) { ps.innerHTML = '<b>Section du programme : </b>'; ps.append(document.createTextNode(`${sec.source.texte} — ${sec.domaine} › ${sec.section} (${sec.niveaux.join(', ')})`)); }
  else ps.innerHTML = '<span class="warn">Aucune section du programme trouvée avec certitude.</span>';
  box.append(ps);
  if (l.programme?.citation) {
    const q = el('blockquote'); q.textContent = l.programme.citation; box.append(q);
    if (!l.programme.citationVerifiee) box.append(el('p', 'warn', 'Citation non retrouvée mot pour mot dans le programme : à vérifier.'));
  }
  const ul = el('ul');
  l.lecon.forEach(s => ul.append(Object.assign(el('li'), { textContent: 'Leçon : ' + s.texte })));
  l.exercices.forEach(x => ul.append(Object.assign(el('li'), { textContent: `${TYPES[x.type]} : ${x.titre || ''} (${stepsOf(x)} étape${stepsOf(x) > 1 ? 's' : ''})` })));
  box.append(ul);
  const row = el('div', 'row');
  const saveB = el('button', 'btn', 'Enregistrer pour les enfants'); saveB.type = 'button';
  saveB.onclick = async () => { saveB.disabled = true; await Store.put('lecon_' + l.id, { kind: 'lecon', lecon: l, cree: Date.now() }); saveB.textContent = 'Enregistrée ✓'; box.append(el('p', 'okmsg', 'La leçon apparaît maintenant dans « Je choisis » et dans le parcours de la matière.')); };
  row.append(saveB); box.append(row);
  out.append(box);
}

/* Présélection des sections du programme : niveau, matière, mots en commun et indices de forme. */
function candidateSections(text, niveau, matiere, k = 6) {
  const words = new Set(norm(text).split(/[^a-z0-9]+/).filter(w => w.length > 3));
  const shape = detectShape(text);
  const hints = { dictee: 'dictee encoder orthographe mots', poesie: 'poeme poesie dire memorise oraliser', verbes: 'verbe conjug groupe terminaison radical infinitif', prose: 'comprendre texte lire', metier: 'service public metiers pompiers police' }[shape] || '';
  hints.split(' ').forEach(h => words.add(h));
  return INDEX.filter(s => s.niveaux.includes(niveau) && (!matiere || s.matiere === matiere))
    .map(s => {
      const hay = norm(s.section + ' ' + s.domaine + ' ' + s.extrait);
      let score = 0; words.forEach(w => { if (hay.includes(w)) score += 1; });
      if (shape === 'dictee' && /dictee/.test(norm(s.section))) score += 8;
      if (shape === 'poesie' && /dire pour etre compris|poesie/.test(norm(s.section))) score += 8;
      if (shape === 'verbes' && /orthographe grammaticale/.test(norm(s.section))) score += 8;
      if (shape === 'metier' && s.matiere === 'emc') score += 10;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score).slice(0, k).map(x => x.s);
}
function detectShape(text) {
  const t = norm(text);
  if (/pompier|policier|policiere|medecin|infirmier|boulanger|metier|travaille/.test(t) && t.split(' ').length > 25) return 'metier';
  const lines = text.split(/\n/).map(x => x.trim()).filter(Boolean);
  const items = text.split(/[\n,;]+/).map(x => x.trim()).filter(Boolean);
  const short = items.filter(x => x.split(/\s+/).length <= 3);
  if (items.length >= 3 && short.length / items.length > .8) {
    const verbs = short.filter(x => /^[a-zà-ÿ]+(er|ir|re|oir)$/i.test(x));
    return verbs.length / short.length > .7 ? 'verbes' : 'dictee';
  }
  if (lines.length >= 3 && lines.every(x => x.split(/\s+/).length <= 12)) return 'poesie';
  return 'prose';
}

const FORMAT_SPEC = `Format (JSON, un seul objet) :
{"titre": "...", "matiere": "francais|maths|sciences|histoire|anglais|emc", "niveau": "CP|CE1|CE2|CM1|CM2",
 "programme": {"section": "<id d'une des sections fournies>", "citation": "<phrase recopiée MOT POUR MOT de l'extrait de cette section, 300 caractères max>"},
 "lecon": [{"texte": "phrase courte lue à voix haute à l'enfant", "exemples": ["...", "..."]}],
 "exercices": [ ... 2 à 4 exercices parmi les types ci-dessous ... ]}
Types d'exercices :
- {"type":"bulles","titre":"...","questions":[{"question":"...","choix":["...","...","..."],"reponse":"<un des choix, identique>","aide":"indice lu après une erreur"}]}
- {"type":"classer","titre":"...","consigne":"...","groupes":[{"id":"a","nom":"..."}],"items":[{"texte":"...","groupe":"a"}]}
- {"type":"dictee","titre":"...","mots":[{"mot":"...","phrase":"courte phrase d'exemple"}]}
- {"type":"ordre","titre":"...","consigne":"...","elements":["étape 1","étape 2","..."]}
- {"type":"trous","titre":"...","consigne":"...","texte":"Texte avec les [mots] à trouver entre crochets","distracteurs":["...","..."]}
- {"type":"conjugaison","titre":"...","verbe":"...","temps":"présent","formes":[{"pronom":"je","forme":"..."}]}
- {"type":"lecture","titre":"...","texte":"texte court","questions":[{"question":"...","choix":["..."],"reponse":"..."}]}
- {"type":"memoriser","titre":"...","auteur":"...","vers":["vers 1","vers 2"]}
- {"type":"addition","titre":"...","operations":[[45,37]],"etapes":["poser","calculer"]}
- {"type":"calcul","titre":"...","operations":[{"q":"12 − 5","r":7,"aide":"indice"}]}  (opérateurs + − × :, réponse entière)
- {"type":"fluence","titre":"...","duree":60,"generateur":{"op":"×","a":[2,5],"b":[1,10]}}  (calcul rapide chronométré)
- {"type":"ecoute","titre":"...","langue":"en-GB","items":[{"dire":"cat","question":"Que veut dire ce mot ?","choix":["chat","chien","vache"],"reponse":"chat"}]}  (anglais)`;
async function generateWithAI(sample, text, niveau, matiere, types, signal) {
  const cands = candidateSections(text, niveau, matiere);
  const prompt = `Tu prépares une leçon de révision interactive pour un enfant de ${niveau} (école élémentaire en France), à partir du texte fourni par un adulte.
Règles :
- Appuie-toi UNIQUEMENT sur le texte de l'adulte pour le contenu (mots de dictée, vers d'une poésie, verbes, informations sur un métier…). Recopie les vers et les mots exactement.
- Choisis dans "programme.section" l'identifiant de la section du programme officiel la plus adaptée, parmi les sections ci-dessous, et recopie mot pour mot une phrase de son extrait dans "citation".
- Langage simple, adapté à un enfant de ${niveau}, phrases courtes (elles sont lues à voix haute). Pas d'emoji.
- Chaque "reponse" doit être exactement l'un des "choix". 3 choix par question en général.
- Pour une dictée, les mots dictés ne doivent jamais apparaître dans la leçon ni dans les exemples (l'enfant ne doit que les entendre).
- ${types.length ? `Utilise ces types d'exercices : ${types.join(', ')}.` : 'Choisis les 2 à 4 types d\'exercices les plus utiles pour ce texte.'}
- Réponds uniquement avec l'objet JSON.

${FORMAT_SPEC}

Sections du programme possibles :
${cands.map(s => `- id: ${s.id}\n  ${s.source.texte} — ${s.domaine} › ${s.section} (${s.niveaux.join(', ')})\n  extrait: ${s.extrait.slice(0, 1500)}`).join('\n')}

Texte de l'adulte :
"""
${text.slice(0, 6000)}
"""`;
  const raw = await sample.json(prompt, { signal, modelTier: 'default' });
  return validateLesson(raw, { niveau, matiere, cands });
}
/* Vérifie et nettoie une leçon venue de l'IA : types connus, champs présents, réponses parmi les choix. */
function validateLesson(raw, { niveau, matiere, cands }) {
  if (!raw || typeof raw !== 'object') throw { code: 'invalid_json' };
  const str = (x, n = 400) => String(x ?? '').slice(0, n).trim();
  const arr = (x, n = 30) => Array.isArray(x) ? x.slice(0, n) : [];
  const l = {
    id: 'perso-' + slug(raw.titre || 'lecon') + '-' + uid().slice(-5),
    titre: str(raw.titre, 80) || 'Ma leçon', matiere: SUBJECTS[raw.matiere] ? raw.matiere : (matiere || 'francais'),
    niveau: LEVELS.includes(raw.niveau) ? raw.niveau : niveau, ordre: 1000 + Date.now() % 1000,
    programme: { section: '', citation: '', citationVerifiee: false },
    lecon: arr(raw.lecon, 5).map(s => ({ texte: str(s?.texte, 300), exemples: arr(s?.exemples, 8).map(x => str(x, 80)).filter(Boolean) })).filter(s => s.texte),
    exercices: [],
  };
  const sec = cands.find(s => s.id === raw.programme?.section) || cands[0];
  if (sec) {
    l.programme.section = sec.id;
    const cit = str(raw.programme?.citation, 300);
    l.programme.citationVerifiee = !!cit && norm(sec.extrait).includes(norm(cit));
    l.programme.citation = cit || `${sec.domaine} › ${sec.section}`;
  }
  for (const x of arr(raw.exercices, 6)) {
    if (!x || !RUNNERS[x.type]) continue;
    const t = str(x.titre, 80);
    const qs = list => arr(list, 10).map(q => ({ question: str(q?.question, 200), choix: arr(q?.choix, 5).map(c => str(c, 80)).filter(Boolean), reponse: str(q?.reponse, 80), aide: str(q?.aide, 200) }))
      .filter(q => q.question && q.choix.length >= 2 && q.choix.includes(q.reponse));
    let e = null;
    if (x.type === 'bulles') { const q = qs(x.questions); if (q.length) e = { type: 'bulles', titre: t, questions: q }; }
    if (x.type === 'lecture') { const q = qs(x.questions); if (q.length && x.texte) e = { type: 'lecture', titre: t, texte: str(x.texte, 1500), questions: q }; }
    if (x.type === 'classer') {
      const groupes = arr(x.groupes, 4).map(g => ({ id: str(g?.id, 20), nom: str(g?.nom, 40) })).filter(g => g.id && g.nom);
      const items = arr(x.items, 16).map(i => ({ texte: str(i?.texte, 40), groupe: str(i?.groupe, 20) })).filter(i => i.texte && groupes.some(g => g.id === i.groupe));
      if (groupes.length >= 2 && items.length >= 2) e = { type: 'classer', titre: t, consigne: str(x.consigne, 200), groupes, items };
    }
    if (x.type === 'dictee') { const mots = arr(x.mots, 10).map(m => ({ mot: str(m?.mot, 30), phrase: str(m?.phrase, 160) })).filter(m => m.mot); if (mots.length) e = { type: 'dictee', titre: t, mots }; }
    if (x.type === 'ordre') { const els = arr(x.elements, 10).map(s => str(s, 120)).filter(Boolean); if (els.length >= 2) e = { type: 'ordre', titre: t, consigne: str(x.consigne, 200), elements: els }; }
    if (x.type === 'trous') { const tx = str(x.texte, 1200); if (/\[[^\]]+\]/.test(tx)) e = { type: 'trous', titre: t, consigne: str(x.consigne, 200), texte: tx, distracteurs: arr(x.distracteurs, 8).map(s => str(s, 40)).filter(Boolean) }; }
    if (x.type === 'conjugaison') { const f = arr(x.formes, 8).map(f => ({ pronom: str(f?.pronom, 30), forme: str(f?.forme, 40) })).filter(f => f.pronom && f.forme); if (f.length >= 2) e = { type: 'conjugaison', titre: t, verbe: str(x.verbe, 30), temps: str(x.temps, 30) || 'présent', formes: f }; }
    if (x.type === 'memoriser') { const v = arr(x.vers, 16).map(s => str(s, 120)).filter(Boolean); if (v.length >= 2) e = { type: 'memoriser', titre: t, auteur: str(x.auteur, 60), vers: v }; }
    if (x.type === 'addition') {
      const ops = arr(x.operations, 5).map(o => arr(o, 3).map(n => Math.floor(Math.abs(+n))).filter(n => Number.isFinite(n) && n > 0 && n < 1000)).filter(o => o.length >= 2 && o.reduce((a, b) => a + b, 0) < 1000);
      if (ops.length) e = { type: 'addition', titre: t, operations: ops, etapes: arr(x.etapes, 2).filter(s => ['poser', 'calculer'].includes(s)).length ? x.etapes.filter(s => ['poser', 'calculer'].includes(s)) : ['poser', 'calculer'] };
    }
    if (x.type === 'calcul') {
      const ops = arr(x.operations, 10).map(o => ({ q: str(o?.q, 40).replace(/-/g, '−').replace(/\*/g, '×'), r: Math.round(+o?.r), aide: str(o?.aide, 160) })).filter(o => o.q && Number.isFinite(o.r) && o.r >= 0);
      if (ops.length) e = { type: 'calcul', titre: t, operations: ops };
    }
    if (x.type === 'fluence') {
      const g = x.generateur || {}, rng = v => Array.isArray(v) && v.length === 2 && v.every(n => Number.isFinite(+n)) ? [Math.max(0, Math.min(+v[0], +v[1], 999)), Math.min(999, Math.max(+v[0], +v[1]))] : [1, 10];
      e = { type: 'fluence', titre: t, duree: Math.min(120, Math.max(30, +x.duree || 60)), generateur: { op: ['+', '-', '×', ':'].includes(g.op) ? g.op : '+', a: rng(g.a), b: rng(g.b) } };
    }
    if (x.type === 'ecoute') {
      const items = arr(x.items, 10).map(i => ({ dire: str(i?.dire, 80), question: str(i?.question, 160), choix: arr(i?.choix, 4).map(c => str(c, 60)).filter(Boolean), reponse: str(i?.reponse, 60) })).filter(i => i.dire && i.choix.length >= 2 && i.choix.includes(i.reponse));
      if (items.length) e = { type: 'ecoute', titre: t, langue: /^en/.test(x.langue) ? x.langue : 'en-GB', items };
    }
    if (e) l.exercices.push(e);
  }
  if (!l.exercices.length) throw { code: 'invalid_json' };
  if (!l.lecon.length) l.lecon = [{ texte: 'Voici une nouvelle leçon. Écoute bien, puis joue !', exemples: [] }];
  return l;
}

/* ---------- Générateurs locaux (sans IA) ---------- */
const VERBES_3E_IR = ['venir', 'tenir', 'partir', 'sortir', 'dormir', 'courir', 'mourir', 'ouvrir', 'offrir', 'souffrir', 'cueillir', 'sentir', 'servir', 'mentir', 'fuir', 'acquerir', 'devenir', 'revenir', 'couvrir', 'bouillir'];
function verbGroup(v) {
  const n = norm(v);
  if (n === 'aller') return '3';
  if (n.endsWith('er')) return '1';
  if (n.endsWith('ir') && !VERBES_3E_IR.includes(n)) return '2';
  return '3';
}
function presentPremierGroupe(v) {
  const rad = v.slice(0, -2), vowel = /^[aeiouyéèêhâîô]/i.test(v);
  const nous = /ger$/.test(v) ? rad + 'eons' : /cer$/.test(v) ? rad.slice(0, -1) + 'çons' : rad + 'ons';
  return [[vowel ? 'j\'' : 'je', rad + 'e'], ['tu', rad + 'es'], ['il', rad + 'e'], ['nous', nous], ['vous', rad + 'ez'], ['ils', rad + 'ent']].map(([pronom, forme]) => ({ pronom, forme }));
}
function misspell(w) {
  const out = new Set();
  if (/[stxdp]$/.test(w) && w.length > 3) out.add(w.slice(0, -1));
  if (/in/.test(w)) out.add(w.replace('in', 'ain'));
  if (/au/.test(w)) out.add(w.replace('au', 'o'));
  if (/o/.test(w) && !/au/.test(w)) out.add(w.replace('o', 'au'));
  if (/([lmnprst])\1/.test(w)) out.add(w.replace(/([lmnprst])\1/, '$1'));
  else if (/[aeiou]([lmnprst])[aeiou]/.test(w)) out.add(w.replace(/([aeiou])([lmnprst])([aeiou])/, '$1$2$2$3'));
  if (/ss/.test(w)) out.add(w.replace('ss', 's'));
  if (/ç|c[eiy]/.test(w)) out.add(w.replace(/ç/, 's').replace(/c([eiy])/, 's$1'));
  out.add(w + 'e');
  out.delete(w);
  return [...out].slice(0, 2);
}
function generateLocally(text, niveau, matiere, types) {
  const shape = detectShape(text);
  const cands = candidateSections(text, niveau, matiere, 1);
  const sec = cands[0];
  const items = text.split(/[\n,;]+/).map(x => x.trim()).filter(Boolean);
  const want = t => !types.length || types.includes(t);
  const l = {
    id: 'perso-' + slug(items[0] || 'lecon') + '-' + uid().slice(-5), niveau, ordre: 1000 + Date.now() % 1000,
    matiere: matiere || (shape === 'metier' ? 'emc' : 'francais'),
    programme: sec ? { section: sec.id, citation: `${sec.domaine} › ${sec.section}`, citationVerifiee: false } : { section: '', citation: '' },
    lecon: [], exercices: [],
  };
  if (shape === 'dictee') {
    const mots = items.slice(0, 10);
    l.titre = 'Dictée : ' + mots.slice(0, 3).join(', ') + (mots.length > 3 ? '…' : '');
    l.lecon = [{ texte: 'Pour écrire un mot, je le dis lentement et j\'écoute chaque son. Attention aux lettres muettes !', exemples: [] }];
    if (want('dictee')) l.exercices.push({ type: 'dictee', titre: 'J\'écris les mots', mots: mots.map(mot => ({ mot })) });
    if (want('bulles')) l.exercices.push({ type: 'bulles', titre: 'Le mot bien écrit', questions: mots.slice(0, 5).map(m => ({ question: 'Quel mot est bien écrit ?', choix: [m, ...misspell(m)], reponse: m })).filter(q => q.choix.length >= 2) });
  } else if (shape === 'verbes') {
    const verbes = items.slice(0, 12).map(v => v.toLowerCase());
    l.titre = 'Les verbes : ' + verbes.slice(0, 3).join(', ') + '…';
    l.lecon = [{ texte: 'Premier groupe : les verbes en e - r. Deuxième groupe : les verbes en i - r qui font i - s - s - o - n - s avec nous. Troisième groupe : tous les autres.', exemples: ['chanter', 'finir', 'prendre'] }];
    if (want('classer')) l.exercices.push({ type: 'classer', titre: 'Chaque verbe dans sa maison', consigne: 'Range chaque verbe dans la maison de son groupe.', groupes: [{ id: '1', nom: '1er groupe' }, { id: '2', nom: '2e groupe' }, { id: '3', nom: '3e groupe' }], items: verbes.map(v => ({ texte: v, groupe: verbGroup(v) })) });
    const first = verbes.find(v => verbGroup(v) === '1');
    if (first && want('conjugaison')) l.exercices.push({ type: 'conjugaison', titre: 'Le verbe ' + first, verbe: first, temps: 'présent', formes: presentPremierGroupe(first) });
  } else if (shape === 'poesie') {
    const vers = text.split(/\n/).map(x => x.trim()).filter(Boolean).slice(0, 16);
    l.titre = 'Poésie : ' + vers[0].replace(/[,.;:!?]+$/, '');
    l.lecon = [{ texte: 'Pour apprendre un texte par cœur, on l\'écoute vers par vers, puis on le redit sans regarder.', exemples: [] }];
    l.exercices.push({ type: 'memoriser', titre: vers[0].replace(/[,.;:!?]+$/, ''), vers });
  } else {
    const phrases = text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(p => p.length > 8).slice(0, 8);
    l.titre = 'Lecture : ' + (phrases[0] || text).slice(0, 40) + '…';
    l.lecon = [{ texte: 'Écoute bien le texte. Ensuite, retrouve les mots qui manquent et remets les phrases dans l\'ordre.', exemples: [] }];
    const long = [...new Set((text.match(/[A-Za-zÀ-ÿ]{6,}/g) || []))].slice(0, 6);
    let gapText = phrases.slice(0, 5).join(' ');
    long.slice(0, 4).forEach(w => { gapText = gapText.replace(new RegExp(`\\b${w}\\b`), `[${w}]`); });
    if (want('trous') && /\[/.test(gapText)) l.exercices.push({ type: 'trous', titre: 'Les mots envolés', consigne: 'Retrouve les mots qui manquent.', texte: gapText, distracteurs: long.slice(4) });
    if (want('ordre') && phrases.length >= 3) l.exercices.push({ type: 'ordre', titre: 'Dans l\'ordre', consigne: 'Remets les phrases du texte dans l\'ordre.', elements: phrases.slice(0, 5) });
  }
  if (!l.exercices.length) l.exercices.push({ type: 'memoriser', titre: 'Mon texte', vers: text.split(/\n|(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean).slice(0, 12) });
  return l;
}

/* ================= Démarrage ================= */
applyWorld(WORLDS.animaux);
{ const logo = svgEl(guideSVG({ animal: 'squirrel' })); logo.setAttribute('class', 'logo'); $('#logo').append(logo); }
renderSound();
$('#view').append(el('p', 'sub', 'Chargement…'));
Promise.all([loadData(), Store.init()]).then(showHome);
/* Pour les tests automatisés uniquement. */
window.__ecole = { motDicte: '', split: (b, n) => splitBySilence(b, n), Store, validateLesson, generateLocally, detectShape, candidateSections, get LIB() { return LIB; } };
