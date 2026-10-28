import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import { ChoixDeVoix } from "./choix-de-voix.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import type { VoixDisponible } from "./voix-disponible.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { LecteurDEffetsSonoresEnMemoire } from "../test_utils/lecteur-d-effets-sonores-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixDeVoixEnMemoire } from "../test_utils/choix-de-voix-en-memoire.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };
const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };

function uneLecture(options: { muet?: boolean } = {}) {
  const lecteur = new LecteurEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores: new LecteurDEffetsSonoresEnMemoire(),
    voixDeLAppareil: voixEnMemoire([DENISE]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: options.muet ? "muet" : "son",
    onVoixBloquee: () => {},
    onFinDeLaVoixBloquee: () => {},
  });
  return { lecture, lecteur };
}

Deno.test("suspendre la voix arrête la lecture en cours et plus rien n'est lu", async () => {
  const { lecture, lecteur } = uneLecture();
  await lecture.lire("Écoute bien.");

  lecture.suspendre();
  await lecture.lire("Écoute encore.");

  assertEquals(lecteur.appels.slice(0, 3), ["arreter", "lire", "arreter"]);
  assertEquals(lecteur.lectures.length, 1);
});

Deno.test("reprendre la voix ne lit rien d'elle-même, puis la lecture redevient possible", async () => {
  const { lecture, lecteur } = uneLecture();
  lecture.suspendre();

  lecture.reprendre();
  assertEquals(lecteur.lectures.length, 0);

  await lecture.lire("Écoute bien.");
  assertEquals(lecteur.lectures.length, 1);
});

Deno.test("reprendre la voix ne remet pas le son : en Muet, rien n'est lu", async () => {
  const { lecture, lecteur } = uneLecture({ muet: true });
  lecture.suspendre();
  lecture.reprendre();

  await lecture.lire("Écoute bien.");

  assertEquals(lecteur.lectures.length, 0);
});

Deno.test("essayer une voix pendant que la voix est suspendue lit quand même la phrase d'essai", async () => {
  const { lecture, lecteur } = uneLecture();
  lecture.suspendre();

  await lecture.essayerUneVoix(ChoixDeVoix.imposee("Denise (Natural)"), "Noisette");

  assertEquals(lecteur.lectures.length, 1);
});

Deno.test("essayer une voix en Muet, voix suspendue, ne lit rien", async () => {
  const { lecture, lecteur } = uneLecture({ muet: true });
  lecture.suspendre();

  await lecture.essayerUneVoix(ChoixDeVoix.imposee("Denise (Natural)"), "Noisette");

  assertEquals(lecteur.lectures.length, 0);
});

Deno.test("remettre le son, voix suspendue, ne lit pas la présentation mais le son est bien remis", async () => {
  const { lecture, lecteur } = uneLecture({ muet: true });
  lecture.suspendre();

  await lecture.remettreLeSon("Je t'entends ! Je suis Lumi.");
  assertEquals(lecteur.lectures.length, 0);

  lecture.reprendre();
  await lecture.lire("Écoute bien.");
  assertEquals(lecteur.lectures.length, 1);
});
