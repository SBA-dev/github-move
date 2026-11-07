import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import type { BrowserContext, Page } from "@playwright/test";
import { CleDeLaPhrase } from "../../supabase/functions/_shared/voix/domain/cle-de-la-phrase.ts";
import { texteALire } from "../../supabase/functions/_shared/voix/domain/texte-a-lire.ts";
import { indicationDuGeste } from "../../supabase/functions/_shared/apprentissage/domain/exercices/indication-du-geste.ts";

// Story #182 : la voix de l'application. Le navigateur de test sert un répertoire des sons de test (`/voix/repertoire.json`),
// jamais celui de la production : par défaut il n'est pas servi (la voix de l'application est indisponible, tout se replie
// sur la voix de l'appareil), et chaque scénario y déclare ses sons de phrases. Les fichiers MP3 servis sont tous le même
// petit MP3 : le faux lecteur (installerLeFauxDesSons) journalise ce que l'application joue, sans rien faire entendre.

export type SonDeTest = { readonly fichier: string; readonly dureeMs: number };

const DUREE_D_UN_SON_DE_TEST_MS = 1500;
const PAROLES_COMMUNES = "paroles-communes";

type RepertoireReel = {
  readonly sons: Readonly<Record<string, SonDeTest>>;
  readonly lecons: Readonly<Record<string, readonly string[]>>;
};

let repertoireReel: RepertoireReel | undefined;
let faussesDonneesMp3: Buffer | undefined;

/** Le plus petit vrai MP3 de `public/voix` : le lecteur du navigateur le charge sans erreur, le faux lecteur ne le joue jamais. */
function mp3Valide(): Buffer {
  if (faussesDonneesMp3) return faussesDonneesMp3;
  const dossier = resolve(process.cwd(), "public/voix");
  const [plusPetit] = readdirSync(dossier)
    .filter((nom) => nom.endsWith(".mp3"))
    .sort((a, b) => statSync(resolve(dossier, a)).size - statSync(resolve(dossier, b)).size);
  if (!plusPetit) throw new Error("Aucun MP3 dans public/voix pour servir de faux son de phrase");
  faussesDonneesMp3 = readFileSync(resolve(dossier, plusPetit));
  return faussesDonneesMp3;
}

function lireLeRepertoireReel(): RepertoireReel {
  repertoireReel ??= JSON.parse(readFileSync(resolve(process.cwd(), "public/voix/repertoire.json"), "utf8")) as RepertoireReel;
  return repertoireReel;
}

/** Les phrases telles que l'application les lit une à une (même découpage et même normalisation que le pipeline de contenu). */
export function phrasesLues(brut: string): string[] {
  return texteALire(brut)?.phrases.map((phrase) => CleDeLaPhrase.de(phrase).valeur) ?? [];
}

/** Les adresses des sons de phrases d'une leçon de la bibliothèque, telles que le vrai répertoire (build de production) les liste. */
export function adressesDesSonsDeLaLecon(identifiant: string): string[] {
  const fichiers = lireLeRepertoireReel().lecons[identifiant];
  if (!fichiers) throw new Error(`Aucun son de phrase prévu pour la leçon « ${identifiant} »`);
  return fichiers.map((fichier) => `/voix/${fichier}`);
}

/** Les adresses des sons des paroles communes à toutes les leçons (mises en réserve dès l'ouverture de l'application). */
export function adressesDesParolesCommunes(): string[] {
  return (lireLeRepertoireReel().lecons[PAROLES_COMMUNES] ?? []).map((fichier) => `/voix/${fichier}`);
}

export class SonsDeTest {
  /** Le répertoire est-il servi ? Sinon, la voix de l'application n'est pas disponible sur l'appareil. */
  servi = false;
  /** Les sons de phrases restent « en cours » jusqu'à ce que le test les termine (scénarios où Léa est en train d'écouter). */
  retenu = false;
  private readonly sons = new Map<string, SonDeTest>();
  private readonly fichiersIntrouvables = new Set<string>();

  ajouter(brut: string): void {
    this.servi = true;
    for (const cle of phrasesLues(brut)) {
      if (!this.sons.has(cle)) this.sons.set(cle, { fichier: `test-${this.sons.size + 1}.mp3`, dureeMs: DUREE_D_UN_SON_DE_TEST_MS });
    }
  }

  /**
   * Les paroles fixes de l'application qui accompagnent une consigne (indications du geste) ont leur son de phrase, comme en
   * production : un scénario qui déclare le son d'une consigne ne dit pas que l'indication qui la suit en a un aussi.
   */
  ajouterLesIndicationsDuGeste(): void {
    for (const type of ["classer", "ordre", "memoriser"] as const) this.ajouter(indicationDuGeste(type) ?? "");
  }

  retirer(brut: string): void {
    this.servi = true;
    for (const cle of phrasesLues(brut)) this.sons.delete(cle);
  }

  ajouterLesSonsReelsDe(fichiers: readonly string[]): void {
    this.servi = true;
    const voulus = new Set(fichiers);
    for (const [cle, son] of Object.entries(lireLeRepertoireReel().sons)) {
      if (voulus.has(son.fichier)) this.sons.set(CleDeLaPhrase.de(cle).valeur, son);
    }
  }

  ajouterLesParolesCommunes(): void {
    this.ajouterLesSonsReelsDe(lireLeRepertoireReel().lecons[PAROLES_COMMUNES] ?? []);
  }

  ajouterLesSonsDeLaLecon(identifiant: string): void {
    const fichiers = lireLeRepertoireReel().lecons[identifiant];
    if (!fichiers) throw new Error(`Aucun son de phrase prévu pour la leçon « ${identifiant} »`);
    this.ajouterLesSonsReelsDe(fichiers);
  }

  rendreIntrouvable(brut: string): void {
    this.ajouter(brut);
    for (const cle of phrasesLues(brut)) this.fichiersIntrouvables.add(this.sonDe(cle)?.fichier ?? "");
  }

  viderLeRepertoire(): void {
    this.servi = true;
    this.sons.clear();
  }

  sonDe(cle: string): SonDeTest | undefined {
    return this.sons.get(cle);
  }

  /** L'adresse du fichier de la phrase : celui du répertoire de test, sinon celui du vrai répertoire (scénarios @pwa). */
  adresseDe(cle: string): string | undefined {
    const fichier = (this.sons.get(cle) ?? lireLeRepertoireReel().sons[cle])?.fichier;
    return fichier === undefined ? undefined : `/voix/${fichier}`;
  }

  aUnSon(cle: string): boolean {
    return this.sons.has(cle);
  }

  estIntrouvable(fichier: string): boolean {
    return this.fichiersIntrouvables.has(fichier);
  }

  repertoire(): { voix: string; sons: Record<string, SonDeTest>; lecons: Record<string, never> } {
    return { voix: "voix-de-test", sons: Object.fromEntries(this.sons), lecons: {} };
  }
}

const sonsParContexte = new WeakMap<BrowserContext, SonsDeTest>();

export function sonsDe(page: Page): SonsDeTest {
  const contexte = page.context();
  let sons = sonsParContexte.get(contexte);
  if (!sons) {
    sons = new SonsDeTest();
    sonsParContexte.set(contexte, sons);
  }
  return sons;
}

/** Sert le répertoire des sons de test et les faux MP3 à toutes les pages du contexte. */
export async function servirLesSonsDeTest(contexte: BrowserContext, sons: SonsDeTest): Promise<void> {
  sonsParContexte.set(contexte, sons);
  await contexte.route("**/voix/repertoire.json", (route) =>
    sons.servi ? route.fulfill({ json: sons.repertoire() }) : route.fulfill({ status: 404, body: "" })
  );
  await contexte.route(/\/voix\/[^/]+\.mp3$/, (route) => {
    const fichier = new URL(route.request().url()).pathname.split("/").at(-1) ?? "";
    return sons.estIntrouvable(fichier)
      ? route.fulfill({ status: 404, body: "" })
      : route.fulfill({ status: 200, contentType: "audio/mpeg", body: mp3Valide() });
  });
}

// --- Le faux lecteur des sons de phrases, installé avant le chargement de la page

export type ConfigurationDuFauxDesSons = { retenu: boolean };

export type EntreeDeSon = {
  fichier: string;
  rythme: number;
  hauteurGardee: boolean;
  debut: number;
  fin: number | null;
  arrete: boolean;
  paroleEnCours: boolean;
  autreSonEnCours: boolean;
  effetEnCours: boolean;
  sequence: number;
};

export type EffetVuParLeFauxDesSons = { nom: string; sequence: number; sonEnCours: boolean };

export type ObservationDesSons = {
  entrees: EntreeDeSon[];
  effets: EffetVuParLeFauxDesSons[];
  actifs: number;
};

/**
 * Remplace la lecture des fichiers `/voix/<empreinte>.mp3` (le reste passe par le lecteur d'avant, effets sonores compris) :
 * le fichier est demandé au réseau (le service worker répond hors ligne), un refus du navigateur se simule avec le faux de la
 * synthèse (`__faux.bloque`), et chaque son joué est journalisé avec son rythme. Un son se termine de lui-même, sauf s'il est
 * « retenu » : il dure alors jusqu'à ce que le test le termine ou que l'application l'arrête.
 */
export function installerLeFauxDesSons(config: ConfigurationDuFauxDesSons) {
  const DUREE_DU_FAUX_MS = 40;
  type Entree = {
    fichier: string;
    rythme: number;
    hauteurGardee: boolean;
    debut: number;
    fin: number | null;
    arrete: boolean;
    paroleEnCours: boolean;
    autreSonEnCours: boolean;
    effetEnCours: boolean;
    sequence: number;
    demarreA: number;
  };
  type Etat = {
    entrees: Entree[];
    effets: Array<{ nom: string; sequence: number; sonEnCours: boolean }>;
    actives: Map<HTMLMediaElement, Entree>;
    retenu: boolean;
    temps: number;
    sequence: number;
  };
  type FauxDeLaVoix = { journal: unknown[]; actifs: unknown[]; bloque?: boolean };
  type MediaPrete = HTMLMediaElement & { preservesPitch?: boolean };

  const existant = Reflect.get(window, "__sons") as Etat | undefined;
  if (existant) {
    existant.retenu = config.retenu;
    return;
  }
  const etat: Etat = { entrees: [], effets: [], actives: new Map(), retenu: config.retenu, temps: 0, sequence: 0 };
  Reflect.set(window, "__sons", etat);

  const faux = () => Reflect.get(window, "__faux") as FauxDeLaVoix | undefined;
  const longueurDuJournal = () => faux()?.journal.length ?? 0;
  const effetsEnCours = () => (Reflect.get(window, "__effets") as { actives: Map<unknown, unknown> } | undefined)?.actives.size ?? 0;
  const jetons = new WeakMap<HTMLMediaElement, number>();
  const prototype = HTMLMediaElement.prototype;
  let jouerAvant = prototype.play;
  let arreterAvant = prototype.pause;
  const decritInstant = Object.getOwnPropertyDescriptor(prototype, "currentTime");

  const adresseDuSon = (media: HTMLMediaElement): string | null => {
    const source = media.getAttribute("src") ?? "";
    return /\/voix\/[^/]+\.mp3$/.test(source) ? new URL(source, location.href).pathname : null;
  };

  const terminer = (media: HTMLMediaElement, entree: Entree) => {
    if (etat.actives.get(media) !== entree) return;
    etat.actives.delete(media);
    entree.fin = longueurDuJournal();
    media.dispatchEvent(new Event("ended"));
  };

  const demarrer = (media: MediaPrete, fichier: string) => {
    const entree: Entree = {
      fichier,
      rythme: media.playbackRate,
      hauteurGardee: media.preservesPitch !== false,
      debut: longueurDuJournal(),
      fin: null,
      arrete: false,
      paroleEnCours: (faux()?.actifs.length ?? 0) > 0,
      autreSonEnCours: etat.actives.size > 0,
      effetEnCours: effetsEnCours() > 0,
      sequence: ++etat.sequence,
      demarreA: performance.now(),
    };
    etat.entrees.push(entree);
    etat.actives.set(media, entree);
    if (!etat.retenu) setTimeout(() => terminer(media, entree), DUREE_DU_FAUX_MS);
  };

  const jouerUnSon = (media: HTMLMediaElement, fichier: string): Promise<void> => {
    const jeton = (jetons.get(media) ?? 0) + 1;
    jetons.set(media, jeton);
    if (faux()?.bloque) return Promise.reject(new DOMException("Lecture refusée par le navigateur", "NotAllowedError"));
    return fetch(fichier).then(
      (reponse) => {
        if (!reponse.ok) throw new DOMException("Fichier introuvable", "NotSupportedError");
        if (jetons.get(media) === jeton) demarrer(media, fichier);
      },
      () => {
        throw new DOMException("Fichier injoignable", "NotSupportedError");
      },
    );
  };

  Object.defineProperty(prototype, "play", {
    configurable: true,
    get: () =>
      function (this: HTMLMediaElement) {
        const fichier = adresseDuSon(this);
        if (fichier !== null) return jouerUnSon(this, fichier);
        const source = this.getAttribute("src") ?? "";
        const effet = /\/sons\/([a-z-]+)\.mp3/.exec(source)?.[1];
        if (effet) etat.effets.push({ nom: effet, sequence: ++etat.sequence, sonEnCours: etat.actives.size > 0 });
        return Reflect.apply(jouerAvant, this, []);
      },
    set: (valeur: typeof prototype.play) => {
      jouerAvant = valeur;
    },
  });

  Object.defineProperty(prototype, "pause", {
    configurable: true,
    get: () =>
      function (this: HTMLMediaElement) {
        if (adresseDuSon(this) === null) return Reflect.apply(arreterAvant, this, []);
        jetons.set(this, (jetons.get(this) ?? 0) + 1);
        const entree = etat.actives.get(this);
        if (!entree) return;
        etat.actives.delete(this);
        entree.arrete = true;
        entree.fin = longueurDuJournal();
      },
    set: (valeur: typeof prototype.pause) => {
      arreterAvant = valeur;
    },
  });

  Object.defineProperty(prototype, "currentTime", {
    configurable: true,
    get(this: HTMLMediaElement) {
      const entree = etat.actives.get(this);
      if (!entree) return decritInstant?.get?.call(this) ?? 0;
      return etat.retenu ? etat.temps : ((performance.now() - entree.demarreA) / 1000) * entree.rythme;
    },
    set(this: HTMLMediaElement, valeur: number) {
      decritInstant?.set?.call(this, valeur);
    },
  });

  Reflect.set(window, "__terminerLesSons", () => {
    for (const [media, entree] of [...etat.actives]) terminer(media, entree);
  });
}

export async function observerLesSons(page: Page): Promise<ObservationDesSons> {
  return await page.evaluate(() => {
    const etat = Reflect.get(window, "__sons") as { entrees: unknown[]; effets: unknown[]; actives: Map<unknown, unknown> } | undefined;
    if (!etat) return { entrees: [], effets: [], actifs: 0 };
    return { entrees: JSON.parse(JSON.stringify(etat.entrees)), effets: JSON.parse(JSON.stringify(etat.effets)), actifs: etat.actives.size };
  }) as ObservationDesSons;
}

/** Donne au faux l'instant du média, en secondes (sons retenus seulement). */
export async function donnerLInstantDuMedia(page: Page, secondes: number): Promise<void> {
  await page.evaluate((instant) => {
    const etat = Reflect.get(window, "__sons") as { temps: number };
    etat.temps = instant;
  }, secondes);
}

export async function configurerLesSons(page: Page, config: ConfigurationDuFauxDesSons): Promise<void> {
  await page.context().addInitScript(installerLeFauxDesSons, config);
  await page.evaluate(installerLeFauxDesSons, config).catch(() => undefined);
}
