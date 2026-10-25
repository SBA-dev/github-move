import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import type { VoixDisponible } from "./voix-disponible.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixDeVoixEnMemoire } from "../test_utils/choix-de-voix-en-memoire.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };
const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };

function uneLecture() {
  const lecteur = new LecteurEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur,
    voixDeLAppareil: voixEnMemoire([DENISE]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => {},
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
