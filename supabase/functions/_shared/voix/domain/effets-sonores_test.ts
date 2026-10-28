import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { LecteurDEffetsSonoresEnMemoire } from "../test_utils/lecteur-d-effets-sonores-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixDeVoixEnMemoire } from "../test_utils/choix-de-voix-en-memoire.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };

function uneLecture() {
  const lecteurDEffetsSonores = new LecteurDEffetsSonoresEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur: new LecteurEnMemoire(),
    lecteurDEffetsSonores,
    voixDeLAppareil: voixEnMemoire([]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => {},
    onFinDeLaVoixBloquee: () => {},
  });
  return { lecture, lecteurDEffetsSonores };
}

Deno.test("une suite d'effets sonores est jouée dans l'ordre demandé", async () => {
  const { lecture, lecteurDEffetsSonores } = uneLecture();

  await lecture.jouer(["reponseJuste", "pointDuRecipient"]);

  assertEquals(lecteurDEffetsSonores.effetsJoues, ["reponseJuste", "pointDuRecipient"]);
});

Deno.test("un effet sonore ne commence qu'après la fin de l'effet précédent", async () => {
  const { lecture, lecteurDEffetsSonores } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();

  const suite = lecture.jouer(["reponseJuste", "pointDuRecipient"]);
  await Promise.resolve();
  assertEquals(lecteurDEffetsSonores.effetsJoues, ["reponseJuste"]);

  lecteurDEffetsSonores.terminerLEffetEnCours();
  await Promise.resolve();
  await Promise.resolve();
  assertEquals(lecteurDEffetsSonores.effetsJoues, ["reponseJuste", "pointDuRecipient"]);

  lecteurDEffetsSonores.terminerLEffetEnCours();
  await suite;
});
