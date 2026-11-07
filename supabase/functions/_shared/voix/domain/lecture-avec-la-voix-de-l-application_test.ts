import { assertEquals } from "@std/assert";
import { InstantsDesMots } from "./instants-des-mots.ts";
import { SonIllisible, VoixBloquee } from "./erreurs.ts";
import type { VoixDisponible } from "./voix-disponible.ts";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import { CleDeLaPhrase } from "./cle-de-la-phrase.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import type { SonDePhrase } from "./son-de-phrase.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { LecteurDEffetsSonoresEnMemoire } from "../test_utils/lecteur-d-effets-sonores-en-memoire.ts";
import { LecteurDeSonsDePhrasesEnMemoire } from "../test_utils/lecteur-de-sons-de-phrases-en-memoire.ts";
import { repertoireDesSonsEnMemoire } from "../test_utils/repertoire-des-sons-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixDeVoixEnMemoire } from "../test_utils/choix-de-voix-en-memoire.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };
const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };
const SON_DE_ECOUTE_BIEN: SonDePhrase = {
  cle: CleDeLaPhrase.de("Écoute bien."),
  fichier: "sons/ecoute-bien.mp3",
  dureeMs: 1200,
};

function uneLectureSansVoixFrancaiseSurLAppareil() {
  const lecteur = new LecteurEnMemoire();
  const lecteurDeSonsDePhrases = new LecteurDeSonsDePhrasesEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    lecteurDeSonsDePhrases,
    repertoireDesSons: repertoireDesSonsEnMemoire([SON_DE_ECOUTE_BIEN]),
    voixDeLAppareil: voixEnMemoire([]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => {},
    onFinDeLaVoixBloquee: () => {},
    onVoixAbsente: () => {},
    onFinDeLaVoixAbsente: () => {},
  });
  return { lecture, lecteur, lecteurDeSonsDePhrases };
}

Deno.test("une phrase qui a son son est lue avec la voix de l'application, même sans voix française sur l'appareil", async () => {
  const { lecture, lecteur, lecteurDeSonsDePhrases } = uneLectureSansVoixFrancaiseSurLAppareil();

  const parole = await lecture.lire("Écoute bien.");

  assertEquals(
    {
      sonsJoues: lecteurDeSonsDePhrases.sonsJoues.map((joue) => [joue.son, joue.rythme]),
      lecturesDeLAppareil: lecteur.lectures,
      parole,
    },
    {
      sonsJoues: [[SON_DE_ECOUTE_BIEN, 1]],
      lecturesDeLAppareil: [],
      parole: { entendue: true },
    },
  );
});

Deno.test("un son de phrase qui ne peut pas être joué laisse la voix de l'appareil lire la phrase, sans message", async () => {
  const lecteur = new LecteurEnMemoire();
  const lecteurDeSonsDePhrases = new LecteurDeSonsDePhrasesEnMemoire();
  lecteurDeSonsDePhrases.faireEchouerLesSons(new SonIllisible());
  let voixBloquees = 0;
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    lecteurDeSonsDePhrases,
    repertoireDesSons: repertoireDesSonsEnMemoire([SON_DE_ECOUTE_BIEN]),
    voixDeLAppareil: voixEnMemoire([DENISE]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => voixBloquees++,
    onFinDeLaVoixBloquee: () => {},
    onVoixAbsente: () => {},
    onFinDeLaVoixAbsente: () => {},
  });

  const parole = await lecture.lire("Écoute bien.");

  assertEquals(
    {
      phrasesLuesParLAppareil: lecteur.lectures.map((lue) => lue.phrases.map((reglage) => reglage.phrase)),
      voixBloquees,
      parole,
    },
    { phrasesLuesParLAppareil: [["Écoute bien."]], voixBloquees: 0, parole: { entendue: true } },
  );
});

function uneLectureSansAucuneVoixPourLesPhrasesSansSon() {
  const lecteur = new LecteurEnMemoire();
  const lecteurDeSonsDePhrases = new LecteurDeSonsDePhrasesEnMemoire();
  const evenements: string[] = [];
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    lecteurDeSonsDePhrases,
    repertoireDesSons: repertoireDesSonsEnMemoire([SON_DE_ECOUTE_BIEN]),
    voixDeLAppareil: voixEnMemoire([]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => {},
    onFinDeLaVoixBloquee: () => {},
    onVoixAbsente: () => evenements.push("voixAbsente"),
    onFinDeLaVoixAbsente: () => evenements.push("finDeLaVoixAbsente"),
  });
  return { lecture, lecteur, lecteurDeSonsDePhrases, evenements };
}

Deno.test("sans son de phrase et sans voix de l'appareil, la phrase n'est pas dite et la voix absente est signalée", async () => {
  const { lecture, lecteur, lecteurDeSonsDePhrases, evenements } = uneLectureSansAucuneVoixPourLesPhrasesSansSon();

  const parole = await lecture.lire("Bonjour.");

  assertEquals(
    {
      sonsJoues: lecteurDeSonsDePhrases.sonsJoues,
      lecturesDeLAppareil: lecteur.lectures,
      evenements,
      parole,
    },
    { sonsJoues: [], lecturesDeLAppareil: [], evenements: ["voixAbsente"], parole: { entendue: false } },
  );
});

Deno.test("la voix absente n'est signalée qu'une seule fois, même si deux phrases de suite ne sont pas dites", async () => {
  const { lecture, evenements } = uneLectureSansAucuneVoixPourLesPhrasesSansSon();

  await lecture.lire("Bonjour.");
  await lecture.lire("Bravo.");

  assertEquals(evenements, ["voixAbsente"]);
});

Deno.test("la fin de la voix absente est signalée quand une phrase est de nouveau entendue", async () => {
  const { lecture, evenements } = uneLectureSansAucuneVoixPourLesPhrasesSansSon();
  await lecture.lire("Bonjour.");

  await lecture.lire("Écoute bien.");

  assertEquals(evenements, ["voixAbsente", "finDeLaVoixAbsente"]);
});

Deno.test("une parole dont une phrase a son son et l'autre aucune voix joue le son mais n'est pas entendue", async () => {
  const { lecture, lecteurDeSonsDePhrases, lecteur, evenements } = uneLectureSansAucuneVoixPourLesPhrasesSansSon();

  const parole = await lecture.lire("Écoute bien. Bonjour.");

  assertEquals(
    {
      sonsJoues: lecteurDeSonsDePhrases.sonsJoues.map((joue) => joue.son),
      lecturesDeLAppareil: lecteur.lectures,
      evenements,
      parole,
    },
    {
      sonsJoues: [SON_DE_ECOUTE_BIEN],
      lecturesDeLAppareil: [],
      evenements: ["voixAbsente"],
      parole: { entendue: false },
    },
  );
});

function uneLectureDontLeNavigateurRefuseLesSonsDePhrases() {
  const lecteur = new LecteurEnMemoire();
  const lecteurDeSonsDePhrases = new LecteurDeSonsDePhrasesEnMemoire();
  lecteurDeSonsDePhrases.faireEchouerLesSons(new VoixBloquee());
  const evenements: string[] = [];
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    lecteurDeSonsDePhrases,
    repertoireDesSons: repertoireDesSonsEnMemoire([SON_DE_ECOUTE_BIEN]),
    voixDeLAppareil: voixEnMemoire([DENISE]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => evenements.push("voixBloquee"),
    onFinDeLaVoixBloquee: () => evenements.push("finDeLaVoixBloquee"),
    onVoixAbsente: () => {},
    onFinDeLaVoixAbsente: () => {},
  });
  return { lecture, lecteur, evenements };
}

Deno.test("un son de phrase refusé par le navigateur bloque la voix, sans relire la phrase avec la voix de l'appareil", async () => {
  const { lecture, lecteur, evenements } = uneLectureDontLeNavigateurRefuseLesSonsDePhrases();

  const parole = await lecture.lire("Écoute bien.");

  assertEquals(
    { lecturesDeLAppareil: lecteur.lectures, evenements, parole },
    { lecturesDeLAppareil: [], evenements: ["voixBloquee"], parole: { entendue: false } },
  );
});

Deno.test("la fin de la voix bloquée est signalée quand une phrase est de nouveau entendue", async () => {
  const { lecture, evenements } = uneLectureDontLeNavigateurRefuseLesSonsDePhrases();
  await lecture.lire("Écoute bien.");

  await lecture.lire("Bonjour.");

  assertEquals(evenements, ["voixBloquee", "finDeLaVoixBloquee"]);
});

function uneLectureAvecUnSonDePhraseEnCours() {
  const { lecture, lecteurDeSonsDePhrases } = uneLectureSansVoixFrancaiseSurLAppareil();
  lecteurDeSonsDePhrases.jouerSansTerminerAutomatiquement();
  const parole = lecture.lire("Écoute bien.");
  return { lecture, lecteurDeSonsDePhrases, parole };
}

Deno.test("couper la voix arrête le son de phrase en cours", async () => {
  const { lecture, lecteurDeSonsDePhrases, parole } = uneLectureAvecUnSonDePhraseEnCours();

  lecture.couperLaVoix();

  assertEquals(lecteurDeSonsDePhrases.nombreDArrets, 1);
  lecteurDeSonsDePhrases.terminerLeSonEnCours();
  await parole;
});

Deno.test("passer en muet arrête le son de phrase en cours", async () => {
  const { lecture, lecteurDeSonsDePhrases, parole } = uneLectureAvecUnSonDePhraseEnCours();

  lecture.passerEnMuet();

  assertEquals(lecteurDeSonsDePhrases.nombreDArrets, 1);
  lecteurDeSonsDePhrases.terminerLeSonEnCours();
  await parole;
});

Deno.test("suspendre la voix arrête le son de phrase en cours", async () => {
  const { lecture, lecteurDeSonsDePhrases, parole } = uneLectureAvecUnSonDePhraseEnCours();

  lecture.suspendre();

  assertEquals(lecteurDeSonsDePhrases.nombreDArrets, 1);
  lecteurDeSonsDePhrases.terminerLeSonEnCours();
  await parole;
});

Deno.test("une nouvelle lecture arrête le son de phrase en cours avant de commencer", async () => {
  const { lecture, lecteurDeSonsDePhrases, parole } = uneLectureAvecUnSonDePhraseEnCours();

  const nouvelleParole = lecture.lire("Écoute bien.");

  assertEquals(lecteurDeSonsDePhrases.appels, ["jouer", "arreter", "jouer"]);
  lecteurDeSonsDePhrases.terminerLeSonEnCours();
  lecteurDeSonsDePhrases.terminerLeSonEnCours();
  await Promise.all([parole, nouvelleParole]);
});

Deno.test("toucher un bouton n'arrête pas le son de phrase en cours", async () => {
  const { lecture, lecteurDeSonsDePhrases, parole } = uneLectureAvecUnSonDePhraseEnCours();

  lecture.toucherUnBouton();

  assertEquals(lecteurDeSonsDePhrases.nombreDArrets, 0);
  lecteurDeSonsDePhrases.terminerLeSonEnCours();
  await parole;
});

Deno.test("passer en muet fait disparaître le message de voix absente", async () => {
  const { lecture, evenements } = uneLectureSansAucuneVoixPourLesPhrasesSansSon();
  await lecture.lire("Bonjour.");

  lecture.passerEnMuet();

  assertEquals(evenements, ["voixAbsente", "finDeLaVoixAbsente"]);
});

const SON_DE_TRES_BIEN: SonDePhrase = {
  cle: CleDeLaPhrase.de("Très bien."),
  fichier: "sons/tres-bien.mp3",
  dureeMs: 900,
};
const SON_DE_TROIS_PLUS_QUATRE: SonDePhrase = {
  cle: CleDeLaPhrase.de("3 plus 4 égale 7."),
  fichier: "sons/trois-plus-quatre.mp3",
  dureeMs: 2000,
};

function uneLectureAvecDesSonsDePhrases(voixDeLAppareil: readonly VoixDisponible[] = []) {
  const lecteur = new LecteurEnMemoire();
  const lecteurDeSonsDePhrases = new LecteurDeSonsDePhrasesEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    lecteurDeSonsDePhrases,
    repertoireDesSons: repertoireDesSonsEnMemoire([
      SON_DE_ECOUTE_BIEN,
      SON_DE_TRES_BIEN,
      SON_DE_TROIS_PLUS_QUATRE,
    ]),
    voixDeLAppareil: voixEnMemoire(voixDeLAppareil),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => {},
    onFinDeLaVoixBloquee: () => {},
    onVoixAbsente: () => {},
    onFinDeLaVoixAbsente: () => {},
  });
  return { lecture, lecteur, lecteurDeSonsDePhrases };
}

Deno.test("écouter plus lentement joue le son de phrase au rythme 0,65", async () => {
  const { lecture, lecteurDeSonsDePhrases } = uneLectureAvecDesSonsDePhrases();

  await lecture.lire("Écoute bien.", { lent: true });

  assertEquals(lecteurDeSonsDePhrases.sonsJoues.map((joue) => joue.rythme), [0.65]);
});

Deno.test("le lecteur de sons reçoit les instants des mots de la phrase, étirés par le rythme lent", async () => {
  const { lecture, lecteurDeSonsDePhrases } = uneLectureAvecDesSonsDePhrases();

  await lecture.lire("Écoute bien.", { lent: true });

  assertEquals(
    lecteurDeSonsDePhrases.sonsJoues.map((joue) => joue.instantsDesMots),
    [InstantsDesMots.de("Écoute bien.", SON_DE_ECOUTE_BIEN.dureeMs, 0.65)],
  );
});

Deno.test("les mots annoncés pendant le son de phrase sont surlignés, rang continu d'une phrase à l'autre", async () => {
  const { lecture, lecteurDeSonsDePhrases } = uneLectureAvecDesSonsDePhrases();
  lecteurDeSonsDePhrases.annoncerLesMots(0, 1);
  const rangs: number[] = [];

  await lecture.lire("Écoute bien. Très bien.", { onMot: (rang) => rangs.push(rang) });

  assertEquals(rangs, [0, 1, 2, 3]);
});

Deno.test("les mots dits « plus » et « égale » par le son de phrase ne surlignent aucun mot affiché", async () => {
  const { lecture, lecteurDeSonsDePhrases } = uneLectureAvecDesSonsDePhrases();
  lecteurDeSonsDePhrases.annoncerLesMots(0, 1, 2, 3, 4);
  const rangs: number[] = [];

  await lecture.lire("3 + 4 = 7.", { onMot: (rang) => rangs.push(rang) });

  assertEquals(rangs, [0, 1, 2]);
});

Deno.test("une phrase lue par la voix de l'appareil après une phrase au son de phrase surligne les bons mots affichés", async () => {
  const { lecture, lecteur } = uneLectureAvecDesSonsDePhrases([DENISE]);
  lecteur.prononcerLesMots({ phrase: 0, position: 0 }, { phrase: 0, position: 8 });
  const rangs: number[] = [];

  await lecture.lire("Écoute bien. Bonjour toi.", { onMot: (rang) => rangs.push(rang) });

  assertEquals(rangs, [2, 3]);
});
