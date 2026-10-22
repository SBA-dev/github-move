/* L'École d'Additia : moteur de leçons interactives pour l'école élémentaire (CP → CM2).
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
const SUBJECTS = { francais: 'Français', maths: 'Mathématiques', emc: 'Vivre ensemble (EMC)' };
const TYPES = {
  bulles: 'Bulles-réponses', classer: 'Ranger dans les maisons', dictee: 'Dictée', ordre: 'Remettre dans l\'ordre',
  trous: 'Texte à trous', conjugaison: 'Conjugaison', lecture: 'Écouter et comprendre', memoriser: 'Apprendre par cœur', addition: 'Addition posée',
};
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"/></svg>';
const SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
const MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

/* ================= Univers =================
   L'univers ne change que l'habillage (guide, décor, couleurs). Les gestes, les consignes et les
   couleurs des colonnes de calcul (C vert, D rose, U bleu) restent les mêmes partout. */
const WORLDS = {
  princesse: { label: 'Princesses et fées', realm: 'le Royaume d\'Additia', guide: { name: 'Lumi', title: 'la fée des nombres et des mots', look: { skin: '#ffd9b8', hair: '#f7cc4f', body: '#ff9cbc', wings: true, hat: 'tiara', prop: 'wand' } }, bg: 'linear-gradient(180deg,#3b2263,#22174a)', vessel: 'cauldron', liquid: '#7cf0c9' },
  animaux: { label: 'Animaux de la forêt', realm: 'la Forêt d\'Additia', guide: { name: 'Noisette', title: 'l\'écureuil savant', look: { animal: 'squirrel' } }, bg: 'linear-gradient(180deg,#24452c,#162a1d)', vessel: 'bowl', liquid: '#ffd36b' },
  sports: { label: 'Sports', realm: 'le Stade d\'Additia', guide: { name: 'Coach Léo', title: 'l\'entraîneur des champions', look: { skin: '#f1c39a', hair: '#5a3a22', body: '#2a63d4', hat: 'cap', prop: 'ball' } }, bg: 'linear-gradient(180deg,#1f5136,#14301f)', vessel: 'trophy', liquid: '#ffd36b' },
  police: { label: 'Police', realm: 'le Commissariat d\'Additia', guide: { name: 'Agente Mila', title: 'la policière détective', look: { skin: '#c98d5e', hair: '#2b1d14', body: '#1f3a8a', hat: 'police', prop: 'badge' } }, bg: 'linear-gradient(180deg,#1d2c55,#121a36)', vessel: 'tank', liquid: '#9ccfff' },
  pompier: { label: 'Pompiers', realm: 'la Caserne d\'Additia', guide: { name: 'Capitaine Sam', title: 'le pompier courageux', look: { skin: '#f3c9a5', hair: '#a8461c', body: '#d23a2a', hat: 'helmet', prop: 'hose' } }, bg: 'linear-gradient(180deg,#4a1f1f,#2a1212)', vessel: 'tank', liquid: '#9ccfff' },
  danse: { label: 'Danse', realm: 'l\'Opéra d\'Additia', guide: { name: 'Lili', title: 'la danseuse étoile', look: { skin: '#e8b58c', hair: '#3b2416', body: '#b55bd6', hat: 'bun', prop: 'ribbon' } }, bg: 'linear-gradient(180deg,#4a1f45,#2a1228)', vessel: 'trophy', liquid: '#ff9de0' },
};
let W = WORLDS.princesse;

const MOUTHS = `<path class="m-happy" d="M41 45 Q45.5 49 50 45" stroke="#3d2b1c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path class="m-think" d="M41.5 46.5 Q45.5 44.5 49.5 46.5" stroke="#3d2b1c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path class="m-cheer" d="M40 44 Q45.5 53 51 44 Z" fill="#3d2b1c"/>`;
function guideSVG(look) {
  if (look.animal === 'squirrel') {
    return `<svg class="lumi" viewBox="0 0 90 110" aria-hidden="true">
      <path d="M62 96 C92 90 92 40 70 30 C84 50 70 70 58 70 Z" fill="#c9773a"/>
      <ellipse cx="45" cy="78" rx="18" ry="22" fill="#d98c4a"/><ellipse cx="45" cy="82" rx="10" ry="14" fill="#f6d9b0"/>
      <path d="M32 26 l-4 -14 l12 9 Z M58 26 l4 -14 l-12 9 Z" fill="#c9773a"/>
      <circle cx="45" cy="40" r="17" fill="#d98c4a"/><ellipse cx="45" cy="46" rx="10" ry="7" fill="#f6d9b0"/>
      <circle cx="40" cy="38" r="2.2" fill="#3d2b1c"/><circle cx="51" cy="38" r="2.2" fill="#3d2b1c"/><circle cx="45.5" cy="42" r="1.8" fill="#3d2b1c"/>
      ${MOUTHS}<ellipse cx="45" cy="100" rx="7" ry="5" fill="#8a5a2b"/></svg>`;
  }
  const hats = {
    tiara: '<path d="M33 24 l4 -8 l4 6 l4 -9 l4 9 l4 -6 l4 8 Z" fill="#f7cc4f"/>',
    cap: '<path d="M30 30 Q31 16 46 16 Q60 16 61 30 Z" fill="#c8245e"/><path d="M58 29 h14 q2 0 0 3 h-14 Z" fill="#c8245e"/>',
    police: '<path d="M29 29 Q30 17 46 17 Q61 17 62 29 Z" fill="#1c2b5e"/><rect x="28" y="27" width="35" height="5" rx="2" fill="#0f1a3d"/><circle cx="45.5" cy="22" r="3.5" fill="#f7cc4f"/>',
    helmet: '<path d="M28 32 Q28 12 46 12 Q63 12 63 32 Z" fill="#e0b21f"/><path d="M24 31 h44 q3 0 0 4 h-44 q-3 0 0 -4 Z" fill="#c99a1c"/><rect x="42" y="14" width="7" height="12" rx="2" fill="#d23a2a"/>',
  };
  const props = {
    wand: '<path d="M60 64 L80 34" stroke="#f7cc4f" stroke-width="3" stroke-linecap="round"/><path d="M80 22 l3.5 8 8.5 .6 -6.5 5.5 2 8.3 -7.5 -4.5 -7.5 4.5 2 -8.3 -6.5 -5.5 8.5 -.6 z" fill="#f7cc4f"/>',
    ball: '<circle cx="76" cy="84" r="10" fill="#fff"/><path d="M76 74 l4 6 -4 4 -4 -4 z" fill="#3d2b1c"/>',
    badge: '<path d="M45 60 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 z" fill="#f7cc4f"/>',
    hose: '<path d="M60 70 q18 0 20 -20" stroke="#5a5a5a" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="82" cy="44" r="2.5" fill="#9ccfff"/><circle cx="86" cy="38" r="2" fill="#9ccfff"/>',
    ribbon: '<path d="M62 64 q14 -20 4 -34 q-10 -12 6 -20" stroke="#ff9cbc" stroke-width="3" fill="none" stroke-linecap="round"/>',
  };
  return `<svg class="lumi" viewBox="0 0 90 110" aria-hidden="true">
    ${look.wings ? '<ellipse cx="28" cy="52" rx="20" ry="28" fill="#bfe6ff" opacity=".75" transform="rotate(-20 28 52)"/><ellipse cx="62" cy="52" rx="20" ry="28" fill="#bfe6ff" opacity=".75" transform="rotate(20 62 52)"/>' : ''}
    <path d="M45 50 L66 100 H24 Z" fill="${look.body}"/>
    ${look.hat === 'bun' ? `<circle cx="45.5" cy="17" r="8" fill="${look.hair}"/>` : ''}
    <circle cx="45" cy="38" r="15" fill="${look.skin}"/>
    <path d="M29 36 C30 18 60 16 61 36 C56 28 36 27 29 36 Z" fill="${look.hair}"/>
    ${hats[look.hat] || ''}
    <circle cx="40" cy="39" r="2" fill="#3d2b1c"/><circle cx="51" cy="39" r="2" fill="#3d2b1c"/>
    ${MOUTHS}${props[look.prop] || ''}</svg>`;
}
const guideEl = (world = W) => { const t = document.createElement('template'); t.innerHTML = guideSVG(world.guide.look).trim(); return t.content.firstElementChild; };
function vesselSVG(kind, color) {
  const outline = {
    cauldron: 'M28 72 Q28 168 100 168 Q172 168 172 72 Z', bowl: 'M14 96 Q24 168 100 168 Q176 168 186 96 Z',
    trophy: 'M44 40 H156 Q156 128 100 132 Q44 128 44 40 Z', tank: 'M30 50 H170 Q182 50 182 62 V156 Q182 168 170 168 H30 Q18 168 18 156 V62 Q18 50 30 50 Z',
  }[kind];
  const extra = {
    cauldron: '<ellipse cx="100" cy="72" rx="76" ry="14" fill="none" stroke="#8a78c6" stroke-width="7"/>',
    bowl: '<ellipse cx="100" cy="96" rx="88" ry="12" fill="none" stroke="#c99a1c" stroke-width="6"/>',
    trophy: '<path d="M44 52 Q14 52 20 80 Q26 100 50 100 M156 52 Q186 52 180 80 Q174 100 150 100" stroke="#c99a1c" stroke-width="7" fill="none"/><rect x="92" y="132" width="16" height="26" fill="#c99a1c"/><rect x="66" y="158" width="68" height="18" rx="4" fill="#c99a1c"/>',
    tank: '<rect x="90" y="36" width="20" height="16" rx="4" fill="#8890a8"/>',
  }[kind];
  return `<svg class="vessel" viewBox="0 0 200 190" aria-hidden="true"><defs><clipPath id="vclip"><path d="${outline}"/></clipPath></defs>
    <path d="${outline}" fill="#2a2440" stroke="#8a78c6" stroke-width="3"/>
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
let frVoice = null;
function pickVoice() { try { const vs = speechSynthesis.getVoices(); frVoice = vs.find(v => /^fr(-|_)FR/i.test(v.lang)) || vs.find(v => /^fr/i.test(v.lang)) || null; } catch (e) {} }
const canSpeak = 'speechSynthesis' in window;
if (canSpeak) { pickVoice(); try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {} }
const toSpeech = html => String(html).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\+/g, ' plus ').replace(/=/g, ' égale ').replace(/_{2,}/g, ' ... ').replace(/\s+/g, ' ').trim();
let speakTimer = null, voiceWarned = false;
/* Lecture phrase par phrase (certains navigateurs coupent les textes longs). Renvoie une promesse
   résolue à la fin de la lecture, ou après une durée estimée si la voix n'est pas disponible. */
function speak(html, { rate = .95 } = {}) {
  const text = toSpeech(html);
  const estimate = Math.max(1200, text.length * 70);
  if (!soundOn || !canSpeak || !text) return new Promise(r => setTimeout(r, soundOn ? 0 : 0));
  clearTimeout(speakTimer);
  try { speechSynthesis.cancel(); } catch (e) {}
  const parts = text.split(/(?<=[.!?…:])\s+/).filter(Boolean);
  return new Promise(resolve => {
    let done = false; const finish = () => { if (!done) { done = true; resolve(); } };
    setTimeout(finish, estimate * 1.6 + 2500);
    speakTimer = setTimeout(() => {
      try {
        if (!frVoice) pickVoice();
        parts.forEach((t, i) => {
          const u = new SpeechSynthesisUtterance(t);
          u.lang = 'fr-FR'; if (frVoice) u.voice = frVoice; u.rate = rate; u.pitch = 1.12; u.volume = 1;
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
function toast(msg) { const t = el('div', 'toast'); t.textContent = msg; t.setAttribute('role', 'status'); document.body.append(t); setTimeout(() => t.remove(), 6000); }
function renderSound() { const b = $('#sound'); b.setAttribute('aria-pressed', String(soundOn)); b.innerHTML = (soundOn ? SPEAKER : MUTED) + (soundOn ? 'Son' : 'Muet'); }
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
  run++; hush(); S = null; backTo = back;
  $('#back').hidden = !back;
  const v = $('#view'); v.innerHTML = '';
  window.scrollTo({ top: 0 });
  return v;
}
$('#back').onclick = () => backTo && backTo();
$('#home').onclick = () => showHome();
function setChild(c) {
  child = c; W = WORLDS[c?.univers] || WORLDS.princesse;
  const who = $('#who'); who.hidden = !c; if (c) who.textContent = `${c.prenom} · ${c.niveau}`;
}

/* ================= Accueil : qui joue ? ================= */
function showHome() {
  setChild(null);
  const v = screen();
  const kids = Store.children();
  const wrap = el('div', 'panel');
  wrap.append(el('h1', 'h-title', 'L\'École d\'Additia'), el('p', 'sub', 'Réviser le programme du CP au CM2, en jouant dans l\'univers de son choix.'));
  if (!kids.length) {
    const box = el('div', 'welcome');
    box.append(guideEl(WORLDS.princesse));
    const p = el('div', 'parch');
    p.append(el('p', '', 'Bonjour ! Pour commencer, crée le profil de l\'enfant qui va jouer. Tu pourras en ajouter d\'autres ensuite.'));
    p.append(childForm(null, c => { setChild(c); showMap(); }));
    box.append(p); wrap.append(box);
  } else {
    wrap.append(el('h2', 'sub', 'Qui joue aujourd\'hui ?'));
    const grid = el('div', 'profiles');
    kids.forEach(k => {
      const b = el('button', 'profile'); b.type = 'button';
      b.append(guideEl(WORLDS[k.univers] || WORLDS.princesse));
      const n = el('b'); n.textContent = k.prenom; b.append(n);
      const s = el('small'); s.textContent = `${k.niveau} · ${(WORLDS[k.univers] || WORLDS.princesse).label}`; b.append(s);
      b.onclick = () => { audio(); setChild(k); showMap(); speak(`Bonjour ${k.prenom} !`); };
      grid.append(b);
    });
    const add = el('button', 'profile add', '<b>+</b><small>Ajouter un enfant</small>'); add.type = 'button';
    add.onclick = () => {
      const v2 = screen(showHome); const p = el('div', 'parch panel');
      p.append(el('h2', '', 'Nouveau profil')); p.append(childForm(null, c => { setChild(c); showMap(); }));
      v2.append(p);
    };
    grid.append(add);
    wrap.append(grid);
  }
  wrap.append(el('p', 'note', Store.mode === 'cloud'
    ? 'Les profils et la progression sont enregistrés dans ton compte : tu les retrouves sur tous tes appareils.'
    : 'Les profils et la progression sont enregistrés sur cet appareil.'));
  v.append(wrap);
}
function childForm(existing, done) {
  const f = el('form', 'form');
  f.innerHTML = `<label>Prénom<input id="f-prenom" maxlength="20" required autocomplete="off"></label>
    <div class="row"><label>Classe<select id="f-niveau">${LEVELS.map(l => `<option>${l}</option>`).join('')}</select></label>
    <label>Univers<select id="f-univers">${Object.entries(WORLDS).map(([k, w]) => `<option value="${k}">${w.label}</option>`).join('')}</select></label></div>
    <button class="btn" type="submit">${existing ? 'Enregistrer' : 'C\'est parti !'}</button>`;
  if (existing) { f.querySelector('#f-prenom').value = existing.prenom; f.querySelector('#f-niveau').value = existing.niveau; f.querySelector('#f-univers').value = existing.univers; }
  f.onsubmit = async e => {
    e.preventDefault();
    const prenom = f.querySelector('#f-prenom').value.trim().slice(0, 20);
    if (!prenom) return;
    const id = existing ? existing._id : 'enfant_' + uid();
    const data = { kind: 'enfant', id, prenom, niveau: f.querySelector('#f-niveau').value, univers: f.querySelector('#f-univers').value, cree: existing?.cree || Date.now() };
    f.querySelector('button').disabled = true;
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
let mapTab = 'parcours';
function showMap() {
  const v = screen(showHome);
  const wrap = el('div', 'panel');
  const hello = el('div', 'welcome'); hello.append(guideEl());
  const p = el('div', 'parch');
  const doneCount = Store.progress(child._id).filter(x => x.etoiles).length;
  p.innerHTML = '<p></p>';
  p.querySelector('p').textContent = `Bienvenue dans ${W.realm}, ${child.prenom} ! Je suis ${W.guide.name}, ${W.guide.title}. ${doneCount ? `Tu as déjà réussi ${doneCount} leçon${doneCount > 1 ? 's' : ''}.` : 'Commence ton parcours, ou choisis une leçon.'}`;
  hello.append(p); wrap.append(hello);
  const tabs = el('div', 'tabs'); tabs.setAttribute('role', 'tablist');
  const body = el('div', 'panel');
  [['parcours', 'Mon parcours'], ['libre', 'Je choisis']].forEach(([k, t]) => {
    const b = el('button', 'tab', t); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(mapTab === k));
    b.onclick = () => { mapTab = k; tabs.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', String(x === b))); render(); };
    tabs.append(b);
  });
  wrap.append(tabs, body);
  function render() {
    body.innerHTML = '';
    if (mapTab === 'parcours') {
      /* Parcours : par matière, les leçons jusqu'au niveau de l'enfant, dans l'ordre des connaissances.
         Une leçon s'ouvre quand la précédente est réussie. */
      Object.entries(SUBJECTS).forEach(([m, name]) => {
        const list = allLessons().filter(l => l.matiere === m && levelRank(l.niveau) <= levelRank(child.niveau))
          .sort((a, b) => levelRank(a.niveau) - levelRank(b.niveau) || (a.ordre || 0) - (b.ordre || 0));
        if (!list.length) return;
        const sec = el('section', 'subject'); sec.append(el('h3', '', esc(name)));
        const trail = el('div', 'trail');
        /* Les leçons des classes précédentes restent ouvertes (révisions) ; celles de la classe de
           l'enfant s'ouvrent une à une, dans l'ordre des connaissances. */
        let open = true, nextMarked = false;
        list.forEach(l => {
          const done = (progOf(l.id)?.etoiles || 0) > 0;
          const chained = l.niveau === child.niveau;
          const next = open && !done && !nextMarked && chained;
          trail.append(lessonCard(l, { locked: chained && !open && !done, next, revision: !chained }));
          if (next) nextMarked = true;
          if (chained && !done) open = false;
        });
        sec.append(trail); body.append(sec);
      });
      if (!body.children.length) body.append(el('p', 'sub', 'Aucune leçon pour ce niveau pour l\'instant. Un adulte peut en créer dans l\'espace adulte.'));
    } else {
      const filters = el('div', 'filters');
      const selM = el('select', ''); selM.innerHTML = `<option value="">Toutes les matières</option>${Object.entries(SUBJECTS).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}`;
      const selL = el('select', ''); selL.innerHTML = `<option value="">Tous les niveaux</option>${LEVELS.map(l => `<option>${l}</option>`).join('')}`;
      [selM, selL].forEach(s => { s.className = 'pill'; s.onchange = draw; filters.append(s); });
      selM.setAttribute('aria-label', 'Matière'); selL.setAttribute('aria-label', 'Niveau');
      const grid = el('div', 'grid-lessons');
      body.append(filters, grid);
      function draw() {
        grid.innerHTML = '';
        allLessons().filter(l => (!selM.value || l.matiere === selM.value) && (!selL.value || l.niveau === selL.value))
          .sort((a, b) => (b.perso ? 1 : 0) - (a.perso ? 1 : 0) || levelRank(a.niveau) - levelRank(b.niveau) || (a.ordre || 0) - (b.ordre || 0))
          .forEach(l => grid.append(lessonCard(l)));
      }
      draw();
    }
  }
  render();
  v.append(wrap);
}

/* ================= Joueur de leçon ================= */
let S = null;
function sceneShell(title, level, back) {
  const v = screen(back);
  const sc = el('section', 'scene'); sc.style.setProperty('--scene-bg', W.bg);
  sc.innerHTML = `<div class="scene-head"><h2></h2><span class="lv"></span></div><div class="dialog"></div>
    <div class="arena"><div class="stage"><div class="board"></div><div class="side"></div></div><div class="play"></div></div>`;
  sc.querySelector('h2').textContent = title; sc.querySelector('.lv').textContent = level;
  const dialog = sc.querySelector('.dialog'), lumi = guideEl();
  const speech = el('div', 'parch speech', '<p class="txt" aria-live="polite"></p><div class="acts"></div>');
  const listen = el('button', 'listen', SPEAKER + 'Réécouter'); listen.type = 'button';
  listen.onclick = () => { unlocked = false; unlockAudio(); speak(S.txt.innerHTML); };
  speech.querySelector('.acts').append(listen);
  dialog.append(lumi, speech);
  v.append(sc);
  S = { sc, dialog, lumi, txt: speech.querySelector('.txt'), acts: speech.querySelector('.acts'), board: sc.querySelector('.board'), side: sc.querySelector('.side'), play: sc.querySelector('.play') };
  return S;
}
/* Le guide parle : le texte est déjà échappé ou construit par l'application. */
function say(html, mood = 'happy') {
  if (!S) return Promise.resolve();
  S.txt.innerHTML = html;
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

/* Bulles : l'enfant éclate la bonne réponse. */
function choose(values, correct, onWrong) {
  return gated(new Promise(res => {
    S.play.innerHTML = '';
    const opts = shuffle([...new Set(values.map(String))]);
    opts.forEach(v => {
      const b = el('button', 'bubble' + (v.length > 4 ? ' long' : '')); b.type = 'button'; b.textContent = v; b.dataset.v = v;
      b.onclick = () => {
        if (b.classList.contains('wrong')) return;
        if (v === String(correct)) {
          b.classList.add('popped'); sfx.ok(); sparkle(b, 10);
          S.play.querySelectorAll('.bubble').forEach(x => x.onclick = null);
          setTimeout(() => { S.play.innerHTML = ''; res(v); }, REDUCED ? 50 : 420);
        } else { b.classList.add('wrong'); sfx.no(); onWrong && onWrong(v); }
      };
      S.play.append(b);
    });
    S.play.querySelector('.bubble')?.focus({ preventScroll: true });
    revealPlay();
  }));
}
/* Clavier de cristaux (à partir du CE1, pour les calculs). */
function keypad(correct, onWrong) {
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
      } else if (val.length < 2) { val += k; sfx.count(+k); }
      show();
    };
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(k => { const b = el('button', 'crystal', String(k)); b.type = 'button'; b.onclick = () => press(String(k)); keys.append(b); });
    const del = el('button', 'crystal del', 'Effacer'); del.type = 'button'; del.onclick = () => press('del');
    const ok = el('button', 'crystal ok', 'Valider'); ok.type = 'button'; ok.onclick = () => press('ok');
    keys.append(del, ok); box.append(disp, keys); S.play.append(box); show();
    keys.firstChild.focus({ preventScroll: true }); revealPlay();
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

const RUNNERS = {
  async bulles(ex, T) {
    for (const q of ex.questions) {
      S.board.innerHTML = ''; const c = el('div', 'card big'); c.textContent = q.question; S.board.append(c);
      await say(esc(q.question));
      await choose(q.choix, q.reponse, () => { T.err('bulles'); say(esc(q.aide || 'Ce n\'est pas cette bulle. Réfléchis encore !'), 'think'); });
      T.ok('bulles'); say('Bravo !', 'cheer');
    }
  },
  async classer(ex, T) {
    S.board.innerHTML = '';
    const colors = [['#ffa5c2', '#c8245e'], ['#9ccfff', '#2a63d4'], ['#9de6b5', '#1f8a4c'], ['#ffd36b', '#c99a1c']];
    const houses = el('div', 'houses');
    const targets = ex.groupes.map((g, i) => {
      const [sky, roof] = colors[i % colors.length];
      const h = el('div', 'house'); h.style.background = sky; h.dataset.g = g.id;
      h.innerHTML = `<div class="roof" style="background:${roof}"></div><div class="name"></div><div class="in"></div>`;
      h.querySelector('.name').textContent = g.nom; houses.append(h); return h;
    });
    S.board.append(houses);
    await say(esc(ex.consigne || 'Range chaque étiquette dans la bonne maison.') + ' Fais glisser chaque étiquette, ou touche-la puis touche une maison.');
    const nameOf = id => ex.groupes.find(g => g.id === id)?.nom || '';
    await placeTags(shuffle(ex.items), targets, (it, t) => t.dataset.g === String(it.groupe),
      (it, t) => { const s = el('span'); s.textContent = it.texte; t.querySelector('.in').append(s); T.ok('classer'); },
      (it, t) => { T.err('classer'); say(esc(it.aide || `« ${it.texte} » ne va pas dans la maison « ${nameOf(t.dataset.g)} ». Réfléchis encore !`), 'think'); });
  },
  async dictee(ex, T) {
    for (const m of ex.mots) {
      const word = String(m.mot);
      S.board.innerHTML = '';
      const hear = el('div', 'hear');
      const again = el('button', 'btn small', SPEAKER + ' Réécouter le mot'); again.type = 'button';
      const peek = el('button', 'btn small ghost', 'Je n\'entends pas'); peek.type = 'button';
      hear.append(again, peek);
      const slots = el('div', 'word-slots');
      const chars = [...word];
      const cells = chars.map(ch => {
        const c = el('div', 'l' + (ch === ' ' ? ' space' : /[\s'’\-.]/.test(ch) ? ' fixed' : ''));
        if (/['’\-.]/.test(ch)) c.textContent = ch;
        c._ch = ch; slots.append(c); return c;
      });
      S.board.append(hear, slots);
      const dictate = () => say(`Écoute bien : <b>${esc(word)}</b>. ${m.phrase ? esc(m.phrase) + ' ' : ''}Écris : ${esc(word)}.`);
      again.onclick = dictate;
      peek.onclick = () => { const c = el('div', 'card big'); c.textContent = word; S.board.append(c); setTimeout(() => c.remove(), 2200); T.err('dictee'); };
      dictate();
      await gated(new Promise(res => {
        const letters = chars.filter(ch => !/[\s'’\-.]/.test(ch));
        const pool = 'aeioulnrstcmpbdvé';
        const extra = shuffle([...pool].filter(ch => !letters.includes(ch))).slice(0, Math.min(3, Math.max(2, 8 - letters.length)));
        S.play.innerHTML = '';
        const pad = el('div', 'letters');
        const typed = [];
        const fillable = cells.filter(c => !/[\s'’\-.]/.test(c._ch));
        shuffle([...letters, ...extra]).forEach(ch => {
          const b = el('button', 'letter'); b.type = 'button'; b.textContent = ch;
          b.onclick = () => {
            if (typed.length >= fillable.length) return;
            b.disabled = true; typed.push(b); sfx.count(typed.length);
            fillable[typed.length - 1].innerHTML = `<span class="dg">${esc(ch)}</span>`;
            if (typed.length === fillable.length) check();
          };
          pad.append(b);
        });
        const del = el('button', 'btn small ghost', 'Effacer'); del.type = 'button';
        del.onclick = () => { const b = typed.pop(); if (!b) return; b.disabled = false; fillable[typed.length].innerHTML = ''; fillable[typed.length].classList.remove('bad'); };
        S.play.append(pad, del); revealPlay();
        function check() {
          const got = typed.map(b => b.textContent);
          const want = fillable.map(c => c._ch);
          const firstBad = got.findIndex((g, i) => g !== want[i]);
          if (firstBad < 0) { fillable.forEach(c => c.classList.add('good')); sfx.ok(); sparkle(slots, 12); T.ok('dictee'); setTimeout(res, 600); return; }
          T.err('dictee'); sfx.no();
          got.forEach((g, i) => fillable[i].classList.toggle('bad', g !== want[i]));
          say(`Presque ! Regarde les lettres en rouge, et écoute encore : <b>${esc(word)}</b>.`, 'think');
          setTimeout(() => {
            while (typed.length > firstBad) { const b = typed.pop(); b.disabled = false; fillable[typed.length].innerHTML = ''; }
            fillable.forEach(c => c.classList.remove('bad'));
          }, 1300);
        }
      }));
      say(`Bravo, ${esc(word)} est bien écrit !`, 'cheer');
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
      tag => { slots[next].textContent = tag.texte; slots[next].classList.add('filled'); next++; T.ok('ordre'); if (next < slots.length) say(`Bien ! Et ensuite ?`); },
      () => { T.err('ordre'); say(next === 0 ? 'Ce n\'est pas le début. Lequel vient en premier ?' : 'Pas encore celui-là. Lequel vient juste après ?', 'think'); },
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
      else card.append(document.createTextNode(p));
    });
    S.board.append(card);
    await say(esc(ex.consigne || 'Complète le texte : choisis le mot qui manque.'));
    for (let i = 0; i < answers.length; i++) {
      gaps.forEach((g, k) => g.classList.toggle('now', k === i));
      const others = shuffle([...(ex.distracteurs || []), ...answers.filter(a => a !== answers[i])]).filter(o => norm(o) !== norm(answers[i])).slice(0, 2);
      await choose([answers[i], ...others], answers[i], () => { T.err('trous'); say('Relis la phrase en entier : quel mot va bien ?', 'think'); });
      gaps[i].textContent = answers[i]; gaps[i].classList.remove('now'); T.ok('trous');
    }
    say('Le texte est complet !', 'cheer'); await wait(600);
  },
  async conjugaison(ex, T) {
    S.board.innerHTML = '';
    const head = el('div', 'card big'); head.textContent = `${ex.verbe} · ${ex.temps}`;
    const table = el('div', 'card conj');
    const cells = ex.formes.map(f => { const p = el('span', 'p'); p.textContent = f.pronom; const v = el('span', 'f', '&nbsp;'); table.append(p, v); return v; });
    S.board.append(head, table);
    await say(`Conjuguons le verbe <b>${esc(ex.verbe)}</b> au ${esc(ex.temps)}. Choisis la bonne forme pour chaque personne.`);
    const forms = ex.formes.map(f => f.forme);
    for (let i = 0; i < ex.formes.length; i++) {
      const f = ex.formes[i];
      cells.forEach((c, k) => c.classList.toggle('now', k === i));
      const others = shuffle([...new Set([...forms, ...(ex.distracteurs || [])])].filter(x => x !== f.forme)).slice(0, 2);
      say(`${esc(f.pronom)} … ?`);
      await choose([f.forme, ...others], f.forme, () => { T.err('conjugaison'); say(`Écoute bien : avec « ${esc(f.pronom)} », quelle forme va ?`, 'think'); });
      cells[i].textContent = f.forme; cells[i].classList.remove('now'); T.ok('conjugaison');
    }
    say(`Bravo, tu sais conjuguer ${esc(ex.verbe)} !`, 'cheer'); await wait(700);
  },
  async lecture(ex, T) {
    S.board.innerHTML = '';
    if (ex.titre) S.board.append(Object.assign(el('div', 'card big'), { textContent: ex.titre }));
    const card = el('div', 'card'); card.textContent = ex.texte; S.board.append(card);
    say('Écoute bien ce texte. Tu peux aussi le lire avec moi.');
    await wait(1200);
    await speak(ex.texte);
    await cont('J\'ai écouté');
    await RUNNERS.bulles({ questions: ex.questions }, { ok: () => T.ok('lecture'), err: () => T.err('lecture') });
  },
  async memoriser(ex, T) {
    const vers = ex.vers.map(String);
    S.board.innerHTML = '';
    const box = el('div', 'card verses');
    if (ex.titre) box.append(Object.assign(el('b'), { textContent: ex.titre + (ex.auteur ? ` — ${ex.auteur}` : '') }));
    const lines = vers.map(t => { const d = el('div', 'v'); d.textContent = t; box.append(d); return d; });
    S.board.append(box);
    await say('Écoute bien, vers par vers. Ensuite, redis-les avec moi.');
    for (let i = 0; i < lines.length; i++) { lines.forEach((l, k) => l.classList.toggle('now', k === i)); await speak(vers[i], { rate: .85 }); await wait(250); }
    lines.forEach(l => l.classList.remove('now'));
    await say('Maintenant, redis tout le texte à voix haute, sans te presser. Quand tu es prêt, on joue !');
    await cont('Je suis prêt');
    /* Remettre les vers dans l'ordre. */
    await RUNNERS.ordre({ elements: vers, consigne: 'Remets les vers dans l\'ordre.' }, { ok: () => T.ok('memoriser'), err: () => T.err('memoriser') });
    /* Retrouver un mot caché dans chaque vers (le plus long). */
    const hidden = vers.map(v => (v.match(/[A-Za-zÀ-ÿ’'-]{3,}/g) || []).sort((a, b) => b.length - a.length)[0] || null);
    const texte = vers.map((v, i) => hidden[i] ? v.replace(hidden[i], `[${hidden[i]}]`) : v).join(' / ');
    await RUNNERS.trous({ texte, consigne: 'Des mots se sont envolés ! Retrouve-les.', distracteurs: [] },
      { ok: () => T.ok('memoriser'), err: () => T.err('memoriser') });
    /* Compléter le compte : un vers sans mot caché compte comme réussi. */
    hidden.forEach(h => { if (!h) T.ok('memoriser'); });
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
      if (steps.includes('poser')) {
        await say(`Pose l'addition ${nums.join(' + ')} : range chaque chiffre dans sa maison. Le chiffre des unités va toujours dans la maison bleue, tout à droite.`);
        for (let r = 0; r < nums.length; r++) {
          const digits = String(nums[r]).split(''), off = ncols - digits.length;
          await placeTags(digits.map((d, k) => ({ texte: d, col: off + k })), Tw.ops[r],
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
          const onWrong = v => { T.err('addition-calculer'); say(carry && +v === s - carry ? 'Tu as oublié la retenue, tout en haut de la maison !' : `Compte doucement : ${expr}.`, 'think'); };
          if (useKeypad) await keypad(s, onWrong);
          else await choose([s, s + 1, Math.max(0, s - 1), s >= 10 ? s - 10 : s + 2], s, onWrong);
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
      await say(`${nums.join(' + ')} = ${sum}. Bravo !`, 'cheer');
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
  const v = screen(showMap);
  const sc = el('section', 'scene'); sc.style.setProperty('--scene-bg', W.bg);
  sc.innerHTML = `<div class="scene-head"><h2></h2><span class="lv"></span></div>`;
  sc.querySelector('h2').textContent = l.titre; sc.querySelector('.lv').textContent = `${l.niveau} · ${SUBJECTS[l.matiere] || ''}`;
  const d = el('div', 'dialog'); d.append(guideEl());
  const p = el('div', 'parch speech'); p.innerHTML = '<p class="txt"></p>';
  p.querySelector('.txt').textContent = `${child.prenom}, je vais d'abord t'expliquer la leçon, puis tu joueras. Tu peux aussi choisir un seul jeu.`;
  d.append(p); sc.append(d);
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
    acts.append(det);
  }
  sc.append(acts); v.append(sc);
  speak(p.textContent);
}

async function playLesson(l, only) {
  const exercises = only == null ? l.exercices : [l.exercices[only]];
  sceneShell(l.titre, `${l.niveau} · ${SUBJECTS[l.matiere] || ''}`, () => showLesson(l));
  exercises.forEach(ex => { delete ex._ops; });
  const total = exercises.reduce((s, ex) => s + stepsOf(ex), 0);
  const T = tracker(total);
  S.side.innerHTML = vesselSVG(W.vessel, W.liquid) + '<div class="progress-dots"></div>';
  drawProgress(T);
  if (only == null && l.lecon?.length) {
    for (const step of l.lecon) {
      S.board.innerHTML = '';
      if (step.exemples?.length) { const ch = el('div', 'chips'); step.exemples.forEach(x => ch.append(Object.assign(el('span', 'chip'), { textContent: x }))); S.board.append(ch); }
      await say(esc(step.texte));
      if (step.exemples?.length) await speak(step.exemples.join('. '));
      await cont();
    }
    await say('À toi de jouer maintenant !', 'cheer');
  }
  for (const ex of exercises) {
    S.board.innerHTML = ''; S.play.innerHTML = '';
    if (exercises.length > 1 && ex.titre) { await say(`Jeu : <b>${esc(ex.titre)}</b>.`); await wait(500); }
    const runner = RUNNERS[ex.type];
    if (runner) await runner(ex, T);
  }
  const stars = T.errors === 0 ? 3 : T.errors <= 3 ? 2 : 1;
  const key = `progres_${child._id}_${l.id}`;
  const prev = Store.docs[key];
  await Store.put(key, {
    kind: 'progres', enfant: child._id, lecon: l.id, titre: l.titre, matiere: l.matiere, niveau: l.niveau,
    etoiles: Math.max(stars, prev?.etoiles || 0), dernieresEtoiles: stars, erreurs: T.errors, essais: (prev?.essais || 0) + 1,
    parType: T.byType, maj: Date.now(),
  });
  S.play.innerHTML = '';
  const m = el('div', 'medal', `<div class="big-stars">${[0, 1, 2].map(i => STAR.replace('<svg', `<svg class="${i < stars ? 'on' : ''}"`)).join('')}</div><div class="row"></div>`);
  const back = el('button', 'btn', 'Retour à la carte'); back.type = 'button'; back.onclick = showMap;
  const again = el('button', 'btn ghost', 'Rejouer'); again.type = 'button'; again.onclick = () => playLesson(l, only);
  m.querySelector('.row').append(back, again);
  S.play.append(m); sfx.star(); sparkle(m, 24); back.focus({ preventScroll: true }); revealPlay();
  say(stars === 3 ? `Parfait, ${esc(child.prenom)} ! Trois étoiles !` : `Bravo, ${esc(child.prenom)} ! Tu gagnes ${stars} étoile${stars > 1 ? 's' : ''}. Rejoue pour en gagner plus !`, 'cheer');
}

/* ================= Espace adulte ================= */
function adultGate() {
  const v = screen(child ? showMap : showHome);
  const a = rnd(6, 9), b = rnd(6, 9);
  const p = el('div', 'parch panel');
  p.innerHTML = `<h2 style="color:var(--brown)">Espace adulte</h2><p>Pour entrer, réponds à cette question : combien font ${a} × ${b} ?</p>
    <form class="form row" id="gate"><label>Réponse<input id="gate-in" inputmode="numeric" autocomplete="off"></label><button class="btn" type="submit">Entrer</button></form><p class="warn" id="gate-msg" hidden>Ce n'est pas la bonne réponse.</p>`;
  v.append(p);
  p.querySelector('#gate').onsubmit = e => { e.preventDefault(); if (+p.querySelector('#gate-in').value === a * b) showAdult('suivi'); else p.querySelector('#gate-msg').hidden = false; };
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
  [['suivi', 'Suivi'], ['profils', 'Profils'], ['creer', 'Créer une leçon'], ['lecons', 'Mes leçons']].forEach(([k, t]) => {
    const b = el('button', 'tab', t); b.type = 'button'; b.setAttribute('aria-selected', String(tab === k));
    b.onclick = () => showAdult(k); tabs.append(b);
  });
  wrap.append(tabs, body); v.append(wrap);
  ({ suivi: adultSuivi, profils: adultProfils, creer: adultCreer, lecons: adultLecons })[tab](body);
}
function adultSuivi(body) {
  const kids = Store.children();
  if (!kids.length) { body.append(Object.assign(el('div', 'parch'), { textContent: 'Aucun profil pour l\'instant. Crée-en un dans l\'onglet Profils.' })); return; }
  kids.forEach(k => {
    const box = el('div', 'parch');
    const prog = Store.progress(k._id).sort((a, b) => (b.maj || 0) - (a.maj || 0));
    const h = el('h3'); h.textContent = `${k.prenom} · ${k.niveau}`; box.append(h);
    const stars = prog.reduce((s, p) => s + (p.etoiles || 0), 0);
    const types = {};
    prog.forEach(p => Object.entries(p.parType || {}).forEach(([t, c]) => { types[t] ||= { ok: 0, err: 0 }; types[t].ok += c.ok; types[t].err += c.err; }));
    const weak = Object.entries(types).filter(([, c]) => c.err / Math.max(1, c.ok + c.err) > .25).map(([t]) => TYPES[t.split('-')[0]] || t);
    const kp = el('div', 'kpis');
    kp.innerHTML = `<div class="kpi"><b>${prog.filter(p => p.etoiles).length}</b><span>leçons réussies</span></div><div class="kpi"><b>${stars}</b><span>étoiles</span></div>
      <div class="kpi"><b>${prog.reduce((s, p) => s + (p.essais || 0), 0)}</b><span>séances jouées</span></div>`;
    box.append(kp);
    if (weak.length) { const w = el('p'); w.innerHTML = '<b>À revoir :</b> '; w.append(document.createTextNode(weak.join(', '))); box.append(w); }
    if (prog.length) {
      const tw = el('div', 'table-wrap'); const t = el('table');
      t.innerHTML = '<thead><tr><th>Leçon</th><th>Matière</th><th>Étoiles</th><th>Erreurs (dernière fois)</th><th>Dernière séance</th></tr></thead><tbody></tbody>';
      prog.forEach(p => {
        const tr = el('tr');
        [p.titre || p.lecon, SUBJECTS[p.matiere] || '', '★'.repeat(p.etoiles || 0) || '–', String(p.erreurs ?? '–'), p.maj ? new Date(p.maj).toLocaleDateString('fr-FR') : '–']
          .forEach(x => tr.append(Object.assign(el('td'), { textContent: x })));
        t.querySelector('tbody').append(tr);
      });
      tw.append(t); box.append(tw);
    } else box.append(el('p', 'note', 'Pas encore de leçon jouée.'));
    body.append(box);
  });
}
function adultProfils(body) {
  const kids = Store.children();
  kids.forEach(k => {
    const box = el('div', 'parch');
    box.append(childForm(k, () => showAdult('profils')));
    const del = el('button', 'btn small ghost', 'Supprimer ce profil'); del.type = 'button'; del.style.color = 'var(--ko)'; del.style.borderColor = 'var(--ko)';
    del.onclick = () => {
      if (del.dataset.confirm) {
        Promise.all([Store.del(k._id), ...Store.progress(k._id).map(p => Store.del(p._id))]).then(() => showAdult('profils'));
      } else { del.dataset.confirm = '1'; del.textContent = `Confirmer : supprimer ${k.prenom} et sa progression`; }
    };
    box.append(del); body.append(box);
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

/* ---------- Créer une leçon à partir d'un texte ---------- */
function adultCreer(body) {
  const p = el('div', 'parch');
  p.innerHTML = `<h3>Créer une leçon à partir d'un texte</h3>
    <p class="note">Colle une liste de mots pour une dictée, une poésie ou une chanson, des verbes, un texte sur un métier… L'application retrouve la section du programme officiel qui correspond et prépare la leçon et les exercices.</p>
    <form class="form" id="gen">
      <label>Texte<textarea id="g-text" placeholder="Exemple : maison, poisson, garçon, leçon, ballon"></textarea></label>
      <div class="row"><label>Classe<select id="g-niveau">${LEVELS.map(l => `<option>${l}</option>`).join('')}</select></label>
      <label>Matière<select id="g-matiere"><option value="">Je ne sais pas</option>${Object.entries(SUBJECTS).map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></label></div>
      <div><p class="note">Types d'exercices souhaités (aucun coché : choix automatique)</p><div class="checks">${Object.entries(TYPES).map(([k, n]) => `<label><input type="checkbox" value="${k}"> ${n}</label>`).join('')}</div></div>
      <div class="row"><button class="btn" type="submit" id="g-go">Créer la leçon</button><button class="btn ghost" type="button" id="g-stop" hidden>Arrêter</button><span class="note" id="g-status" aria-live="polite"></span></div>
    </form><div id="g-out"></div>`;
  body.append(p);
  if (child) p.querySelector('#g-niveau').value = child.niveau;
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
{"titre": "...", "matiere": "francais|maths|emc", "niveau": "CP|CE1|CE2|CM1|CM2",
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
- {"type":"addition","titre":"...","operations":[[45,37]],"etapes":["poser","calculer"]}`;
async function generateWithAI(sample, text, niveau, matiere, types, signal) {
  const cands = candidateSections(text, niveau, matiere);
  const prompt = `Tu prépares une leçon de révision interactive pour un enfant de ${niveau} (école élémentaire en France), à partir du texte fourni par un adulte.
Règles :
- Appuie-toi UNIQUEMENT sur le texte de l'adulte pour le contenu (mots de dictée, vers d'une poésie, verbes, informations sur un métier…). Recopie les vers et les mots exactement.
- Choisis dans "programme.section" l'identifiant de la section du programme officiel la plus adaptée, parmi les sections ci-dessous, et recopie mot pour mot une phrase de son extrait dans "citation".
- Langage simple, adapté à un enfant de ${niveau}, phrases courtes (elles sont lues à voix haute). Pas d'emoji.
- Chaque "reponse" doit être exactement l'un des "choix". 3 choix par question en général.
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
    l.lecon = [{ texte: 'Pour écrire un mot, je le dis lentement et j\'écoute chaque son. Attention aux lettres muettes !', exemples: mots.slice(0, 4) }];
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
(() => {
  const sky = $('#sky');
  for (let i = 0; i < 70; i++) {
    const s = el('i'); s.style.left = Math.random() * 100 + '%'; s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's'; if (Math.random() < .2) s.style.width = s.style.height = '4px';
    sky.append(s);
  }
})();
renderSound();
$('#view').append(el('p', 'sub', 'Chargement…'));
Promise.all([loadData(), Store.init()]).then(showHome);
/* Pour les tests automatisés uniquement. */
window.__ecole = { Store, validateLesson, generateLocally, detectShape, candidateSections, get LIB() { return LIB; } };
