import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import { CleDeLaPhrase } from "./cle-de-la-phrase.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import type { SonDePhrase } from "./son-de-phrase.ts";
import type { VoixDisponible } from "./voix-disponible.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { LecteurDEffetsSonoresEnMemoire } from "../test_utils/lecteur-d-effets-sonores-en-memoire.ts";
import { LecteurDeSonsDePhrasesEnMemoire } from "../test_utils/lecteur-de-sons-de-phrases-en-memoire.ts";
import { repertoireDesSonsEnMemoire } from "../test_utils/repertoire-des-sons-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixDeVoixEnMemoire } from "../test_utils/choix-de-voix-en-memoire.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };
const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };
const SON_DE_BONJOUR: SonDePhrase = {
  cle: CleDeLaPhrase.de("Bonjour !"),
  fichier: "sons/bonjour.mp3",
  dureeMs: 900,
};
const TEXTE_AFFICHE = "Bonjour Léa ! Prêt ?";
const TEXTE_DIT_SANS_LE_PRENOM = "Bonjour ! Prêt ?";
const SON_DE_PRET: SonDePhrase = {
  cle: CleDeLaPhrase.de("Prêt ?"),
  fichier: "sons/pret.mp3",
  dureeMs: 700,
};

function uneLectureAvecLesSons(sons: readonly SonDePhrase[]) {
  const lecteur = new LecteurEnMemoire();
  const lecteurDeSonsDePhrases = new LecteurDeSonsDePhrasesEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    lecteurDeSonsDePhrases,
    repertoireDesSons: repertoireDesSonsEnMemoire(sons),
    voixDeLAppareil: voixEnMemoire([DENISE]),
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

Deno.test("quand toutes les phrases du texte dit ont leur son, la voix de l'application les dit et le prénom n'est dit par aucune voix", async () => {
  const { lecture, lecteur, lecteurDeSonsDePhrases } = uneLectureAvecLesSons([SON_DE_BONJOUR, SON_DE_PRET]);

  const parole = await lecture.lire(TEXTE_AFFICHE, { texteDit: TEXTE_DIT_SANS_LE_PRENOM });

  assertEquals(
    {
      sonsJoues: lecteurDeSonsDePhrases.sonsJoues.map((joue) => joue.son.cle.valeur),
      lecturesDeLAppareil: lecteur.lectures,
      parole,
    },
    {
      sonsJoues: [SON_DE_BONJOUR.cle.valeur, SON_DE_PRET.cle.valeur],
      lecturesDeLAppareil: [],
      parole: { entendue: true },
    },
  );
});

Deno.test("quand une phrase du texte dit n'a pas son son, la voix de l'appareil lit tout le texte affiché, prénom compris", async () => {
  const { lecture, lecteur, lecteurDeSonsDePhrases } = uneLectureAvecLesSons([SON_DE_BONJOUR]);

  await lecture.lire(TEXTE_AFFICHE, { texteDit: TEXTE_DIT_SANS_LE_PRENOM });

  assertEquals(
    {
      sonsJoues: lecteurDeSonsDePhrases.sonsJoues,
      phrasesLuesParLAppareil: lecteur.lectures.map((lue) => lue.phrases.map((reglage) => reglage.phrase)),
    },
    { sonsJoues: [], phrasesLuesParLAppareil: [["Bonjour Léa !", "Prêt ?"]] },
  );
});
