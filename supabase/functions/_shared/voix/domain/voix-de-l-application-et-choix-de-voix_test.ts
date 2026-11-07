import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import { ChoixDeVoix } from "./choix-de-voix.ts";
import { CleDeLaPhrase } from "./cle-de-la-phrase.ts";
import { phraseDEssai } from "./phrase-d-essai.ts";
import { texteALire } from "./texte-a-lire.ts";
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
const AMELIE: VoixDisponible = { nom: "Amélie (compact)", langue: "fr-FR" };
const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };

function unSonPour(phrase: string): SonDePhrase {
  return { cle: CleDeLaPhrase.de(phrase), fichier: "sons/une-phrase.mp3", dureeMs: 1000 };
}

const SON_DE_ECOUTE_BIEN = unSonPour("Écoute bien.");
const SONS_DE_LA_PHRASE_D_ESSAI = (texteALire(phraseDEssai("Noisette"))?.phrases ?? []).map(unSonPour);

function uneLecture(sons: readonly SonDePhrase[], choix?: ChoixDeVoix) {
  const lecteur = new LecteurEnMemoire();
  const lecteurDeSonsDePhrases = new LecteurDeSonsDePhrasesEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    lecteurDeSonsDePhrases,
    repertoireDesSons: repertoireDesSonsEnMemoire(sons),
    voixDeLAppareil: voixEnMemoire([AMELIE, DENISE]),
    choixDeVoix: new ChoixDeVoixEnMemoire(choix),
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

Deno.test("une voix imposée par le parent lit la consigne, même quand elle a son son de phrase", async () => {
  const { lecture, lecteur, lecteurDeSonsDePhrases } = uneLecture(
    [SON_DE_ECOUTE_BIEN],
    ChoixDeVoix.imposee(AMELIE.nom),
  );

  await lecture.lire("Écoute bien.");

  assertEquals(
    { voixDeLAppareil: lecteur.lectures.map((l) => l.voix), sonsJoues: lecteurDeSonsDePhrases.sonsJoues },
    { voixDeLAppareil: [AMELIE], sonsJoues: [] },
  );
});

Deno.test("écouter la voix automatique fait entendre l'essai de voix avec la voix de l'application", async () => {
  const { lecture, lecteur, lecteurDeSonsDePhrases } = uneLecture(
    SONS_DE_LA_PHRASE_D_ESSAI,
    ChoixDeVoix.imposee(AMELIE.nom),
  );

  await lecture.essayerUneVoix(ChoixDeVoix.automatique, "Noisette");

  assertEquals(
    { sonsJoues: lecteurDeSonsDePhrases.sonsJoues.map((joue) => joue.son), lecturesDeLAppareil: lecteur.lectures },
    { sonsJoues: SONS_DE_LA_PHRASE_D_ESSAI, lecturesDeLAppareil: [] },
  );
});

Deno.test("essayer une voix de l'appareil la fait entendre, même quand l'essai a son son de phrase", async () => {
  const { lecture, lecteur, lecteurDeSonsDePhrases } = uneLecture(SONS_DE_LA_PHRASE_D_ESSAI);

  await lecture.essayerUneVoix(ChoixDeVoix.imposee(AMELIE.nom), "Noisette");

  assertEquals(
    { voixDeLAppareil: lecteur.lectures.map((l) => l.voix), sonsJoues: lecteurDeSonsDePhrases.sonsJoues },
    { voixDeLAppareil: [AMELIE], sonsJoues: [] },
  );
});
