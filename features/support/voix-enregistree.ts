// Story #182 : la voix enregistrée dans les scénarios.
// Les MP3 des phrases enregistrées sont fournis par le support : le répertoire (/voix/repertoire.json) et chaque MP3
// (/voix/<cle>-<empreinte>.mp3) sont servis par interception réseau, jamais fabriqués avec le modèle de voix.
// Le MP3 de test est un silence de 2 secondes (features/support/phrase-de-test.mp3), sans parole ni son.
// Dans la page, un faux `Audio` remplace celui de l'application pour les seuls MP3 de /voix/ : il tient le même journal
// que le faux de la synthèse vocale (window.__faux, voir voix.steps.ts), pour que les étapes de #7, #15 et #79
// (lots de lecture, lectures en même temps, fin de lecture) valent aussi pour la voix enregistrée.

import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { adresseDuMp3 } from "../../supabase/functions/_shared/voix/domain/adresse-du-mp3.ts";
import { phrasesAvecCle } from "../../supabase/functions/_shared/voix/domain/cle-de-phrase.ts";

export const DUREE_DU_MP3_DE_TEST_MS = 2064;
const EMPREINTE_DE_TEST = "e2e";
const MP3_DE_TEST = readFileSync("features/support/phrase-de-test.mp3");

export type PhraseDeTest = { readonly texte: string; readonly lente: boolean; readonly illisible: boolean };

export type RepertoireDeTest = {
  readonly phrases: Map<string, PhraseDeTest>;
  /** « Léa voit le message de voix indisponible » : à vérifier à l'ouverture de la page, quand le répertoire est connu. */
  messageDeVoixIndisponibleAVoirAvant: boolean;
};

const repertoires = new WeakMap<Page, RepertoireDeTest>();

export function repertoireDeTest(page: Page): RepertoireDeTest | undefined {
  return repertoires.get(page);
}

export function declarerLesPhrases(repertoire: RepertoireDeTest, brut: string, options: { lente?: boolean; illisible?: boolean } = {}): void {
  for (const { texte, cle } of phrasesAvecCle(brut)) {
    repertoire.phrases.set(cle, { texte, lente: options.lente ?? false, illisible: options.illisible ?? false });
  }
}

export function retirerLesPhrases(repertoire: RepertoireDeTest, brut: string): void {
  for (const { cle } of phrasesAvecCle(brut)) repertoire.phrases.delete(cle);
}

function phraseDeLAdresse(repertoire: RepertoireDeTest, chemin: string): PhraseDeTest | undefined {
  for (const [cle, phrase] of repertoire.phrases) {
    if (chemin === adresseDuMp3(cle, EMPREINTE_DE_TEST, "normale")) return phrase;
    if (phrase.lente && chemin === adresseDuMp3(cle, EMPREINTE_DE_TEST, "lente")) return phrase;
  }
  return undefined;
}

type Config = { dureeMs: number };

/** Exécuté dans la page, avant son chargement. */
export function installerLAudioDeTest(config: Config) {
  type EnonceAudio = { text: string; onend: (() => void) | null };
  type Faux = {
    journal: Array<Record<string, unknown>>;
    enonces: Array<{ lot: number; enonce: EnonceAudio }>;
    actifs: unknown[];
    lot: number;
    lotOuvert: boolean;
    chevauchements: number;
    bloque: boolean;
    audioEnCours?: { temps: number };
  };
  const AudioReel = window.Audio;
  const faux = () => Reflect.get(window, "__faux") as Faux | undefined;
  const ouvrirUnLot = (f: Faux) => {
    if (f.lotOuvert) return;
    f.lot += 1;
    f.lotOuvert = true;
    if (f.actifs.length > 0) f.chevauchements += 1;
    setTimeout(() => {
      f.lotOuvert = false;
    }, 0);
  };

  class AudioDeTest extends EventTarget {
    src = "";
    muted = false;
    preservesPitch = true;
    playbackRate = 1;
    loop = false;
    readyState = 0;
    paused = true;
    temps = 0;
    jeton = 0;
    enonce: EnonceAudio | undefined = undefined;

    get currentTime() {
      return this.temps;
    }
    set currentTime(secondes: number) {
      this.temps = secondes;
    }
    get duration() {
      return this.readyState > 0 ? config.dureeMs / 1000 : Number.NaN;
    }
    get currentSrc() {
      return this.src;
    }
    setAttribute() {}
    load() {}

    journaliser(f: Faux, texte: string, bloquee: boolean) {
      ouvrirUnLot(f);
      const enonce: EnonceAudio = { text: texte, onend: null };
      f.journal.push({
        type: "speak",
        lot: f.lot,
        texte,
        voix: null,
        voixLangue: null,
        langue: "fr-FR",
        pitch: 1,
        rate: this.playbackRate,
        source: "enregistree",
        adresse: this.src,
        bloquee,
      });
      f.enonces.push({ lot: f.lot, enonce });
      if (bloquee) return;
      this.enonce = enonce;
      f.actifs.push(enonce);
      f.audioEnCours = this;
      enonce.onend = () => {
        if (this.enonce !== enonce) return;
        this.enonce = undefined;
        this.paused = true;
        this.dispatchEvent(new Event("ended"));
      };
    }

    play(): Promise<void> {
      const adresse = this.src;
      if (!adresse.includes("/voix/")) return Promise.resolve();
      const jeton = ++this.jeton;
      const f = faux();
      if (f?.bloque) {
        this.journaliser(f, "", true);
        return Promise.reject(new DOMException("Lecture refusée par le navigateur", "NotAllowedError"));
      }
      return this.lireLeMp3(adresse, jeton);
    }

    async lireLeMp3(adresse: string, jeton: number): Promise<void> {
      let octets = 0;
      let texte = "";
      try {
        const reponse = await fetch(adresse);
        octets = reponse.ok ? (await reponse.arrayBuffer()).byteLength : 0;
        texte = decodeURIComponent(reponse.headers.get("x-phrase") ?? "");
      } catch {
        octets = 0;
      }
      if (jeton !== this.jeton) throw new DOMException("Lecture interrompue", "AbortError");
      if (octets === 0) {
        this.dispatchEvent(new Event("error"));
        throw new DOMException("MP3 illisible", "NotSupportedError");
      }
      this.readyState = 1;
      this.paused = false;
      this.temps = 0;
      this.dispatchEvent(new Event("loadedmetadata"));
      const f = faux();
      if (f) this.journaliser(f, texte, false);
    }

    pause() {
      this.jeton += 1;
      this.paused = true;
      const { enonce } = this;
      if (!enonce) return;
      this.enonce = undefined;
      const f = faux();
      if (f) f.actifs = f.actifs.filter((actif) => actif !== enonce);
    }
  }

  const AudioDeTestOuReel = function (src?: string) {
    return src === undefined ? new AudioDeTest() : new AudioReel(src);
  };
  Reflect.set(window, "Audio", AudioDeTestOuReel);
}

/** Prépare, une seule fois par page, le répertoire de test, les MP3 servis et le faux Audio. */
export async function preparerLeRepertoireDeTest(page: Page): Promise<RepertoireDeTest> {
  const existant = repertoires.get(page);
  if (existant) return existant;
  const repertoire: RepertoireDeTest = { phrases: new Map(), messageDeVoixIndisponibleAVoirAvant: false };
  repertoires.set(page, repertoire);
  await page.route("**/voix/repertoire.json", async (route) => {
    const phrases = Object.fromEntries(
      [...repertoire.phrases].map(([cle, { lente }]) => [cle, lente ? { normale: EMPREINTE_DE_TEST, lente: EMPREINTE_DE_TEST } : { normale: EMPREINTE_DE_TEST }]),
    );
    await route.fulfill({ json: { voixEnregistree: "tom", phrases } });
  });
  await page.route("**/voix/*.mp3", async (route) => {
    const phrase = phraseDeLAdresse(repertoire, new URL(route.request().url()).pathname);
    if (!phrase || phrase.illisible) {
      await route.fulfill({ status: 404, body: "" });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "audio/mpeg",
      headers: { "x-phrase": encodeURIComponent(phrase.texte) },
      body: MP3_DE_TEST,
    });
  });
  await page.addInitScript(installerLAudioDeTest, { dureeMs: DUREE_DU_MP3_DE_TEST_MS });
  return repertoire;
}

// --- Le journal de lecture, lu depuis la page

export type Parole = {
  readonly texte: string;
  readonly source: "enregistree" | "appareil";
  readonly bloquee: boolean;
  readonly adresse: string | undefined;
  readonly rythme: number;
};

/** Toutes les paroles, dans l'ordre où elles ont commencé (voix enregistrée et voix de l'appareil). */
export async function paroles(page: Page): Promise<Parole[]> {
  return await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as { journal: Array<Record<string, unknown>> };
    return faux.journal.filter((entree) => entree.type === "speak").map((entree) => ({
      texte: String(entree.texte).replace(/\s+/g, " ").trim(),
      source: entree.source === "enregistree" ? "enregistree" as const : "appareil" as const,
      bloquee: entree.bloquee === true,
      adresse: typeof entree.adresse === "string" ? entree.adresse : undefined,
      rythme: Number(entree.rate),
    }));
  });
}

/** Règle le temps de lecture du MP3 en cours : le lecteur de l'application en déduit les mots à surligner. */
export async function avancerLeMp3A(page: Page, secondes: number): Promise<void> {
  await page.evaluate((temps) => {
    const faux = Reflect.get(window, "__faux") as { audioEnCours?: { temps: number } };
    if (faux.audioEnCours) faux.audioEnCours.temps = temps;
  }, secondes);
}

// --- Les messages que lit l'enfant

const MESSAGE_DE_VOIX_INDISPONIBLE = "ne peut pas lire cette phrase sur cet appareil";

export function messageDeVoixIndisponible(page: Page) {
  return page.getByRole("status").filter({ hasText: MESSAGE_DE_VOIX_INDISPONIBLE });
}

export function texteDuMessageDeVoixIndisponible(page: Page) {
  return page.getByText(MESSAGE_DE_VOIX_INDISPONIBLE);
}
