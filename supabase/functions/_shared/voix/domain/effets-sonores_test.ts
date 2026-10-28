import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { LecteurDEffetsSonoresEnMemoire } from "../test_utils/lecteur-d-effets-sonores-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixDeVoixEnMemoire } from "../test_utils/choix-de-voix-en-memoire.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };

function uneLecture(etatInitial: "son" | "muet" = "son") {
  const journal: string[] = [];
  const lecteur = new LecteurEnMemoire(journal);
  const lecteurDEffetsSonores = new LecteurDEffetsSonoresEnMemoire(journal);
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores,
    voixDeLAppareil: voixEnMemoire([]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial,
    onVoixBloquee: () => {},
    onFinDeLaVoixBloquee: () => {},
  });
  return { lecture, lecteurDEffetsSonores, lecteur, journal };
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

Deno.test("les effets sonores passent avant la parole", async () => {
  const { lecture, journal } = uneLecture();

  await lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });

  assertEquals(journal, ["effet:reponseJuste", "parole"]);
});

Deno.test("la parole ne commence qu'à la fin du dernier effet sonore", async () => {
  const { lecture, lecteurDEffetsSonores, lecteur } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();

  const parole = lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });
  await Promise.resolve();
  assertEquals(lecteur.lectures.length, 0);

  lecteurDEffetsSonores.terminerLEffetEnCours();
  await parole;
  assertEquals(lecteur.lectures.length, 1);
});

Deno.test("en Muet, les effets sonores sont joués mais la parole n'est pas lue", async () => {
  const { lecture, journal } = uneLecture("muet");

  const parole = await lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });

  assertEquals(journal, ["effet:reponseJuste"]);
  assertEquals(parole, { entendue: false });
});

Deno.test("passer en Muet pendant un effet sonore ne l'arrête pas et la parole qui suivait n'est pas lue", async () => {
  const { lecture, lecteurDEffetsSonores, lecteur } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();

  const parole = lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });
  await Promise.resolve();
  lecture.passerEnMuet();
  lecteurDEffetsSonores.terminerLEffetEnCours();
  await parole;

  assertEquals(lecteurDEffetsSonores.arrets, []);
  assertEquals(lecteur.lectures.length, 0);
});
