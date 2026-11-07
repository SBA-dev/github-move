import { assertEquals } from "@std/assert";
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
