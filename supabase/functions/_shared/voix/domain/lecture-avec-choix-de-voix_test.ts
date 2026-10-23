import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import { ChoixDeVoix } from "./choix-de-voix.ts";
import { phraseDEssai } from "./phrase-d-essai.ts";
import { texteALire } from "./texte-a-lire.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import type { VoixDisponible } from "./voix-disponible.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixDeVoixEnMemoire } from "../test_utils/choix-de-voix-en-memoire.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };
const CARACTERE_CAPITAINE_SAM: CaractereDeLaVoix = { sexe: "masculine", hauteur: 0.9, rythme: 1 };
const AMELIE: VoixDisponible = { nom: "Amélie (compact)", langue: "fr-FR" };
const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };
const VOIX_ANGLAISE: VoixDisponible = { nom: "Daniel", langue: "en-GB" };

function uneLecture(options: { choix?: ChoixDeVoix; caractere?: CaractereDeLaVoix; muet?: boolean } = {}) {
  const lecteur = new LecteurEnMemoire();
  const choixDeVoix = new ChoixDeVoixEnMemoire(options.choix);
  const lecture = new LectureAVoixHaute({
    lecteur,
    voixDeLAppareil: voixEnMemoire([AMELIE, DENISE, VOIX_ANGLAISE]),
    choixDeVoix,
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => options.caractere ?? CARACTERE_NOISETTE,
    etatInitial: options.muet ? "muet" : "son",
    onVoixBloquee: () => {},
  });
  return { lecture, lecteur, choixDeVoix };
}

Deno.test("le personnage guide lit avec la voix imposée mémorisée sur l'appareil", async () => {
  const { lecture, lecteur } = uneLecture({ choix: ChoixDeVoix.imposee(AMELIE.nom) });

  await lecture.lire("Écoute bien.");

  assertEquals(lecteur.lectures[0]?.voix, AMELIE);
});

Deno.test("la voix imposée garde le caractère du personnage guide : Capitaine Sam la rend plus grave", async () => {
  const { lecture, lecteur } = uneLecture({
    choix: ChoixDeVoix.imposee(AMELIE.nom),
    caractere: CARACTERE_CAPITAINE_SAM,
  });

  await lecture.lire("Écoute bien.");

  assertEquals(lecteur.lectures[0]?.phrases, [{ phrase: "Écoute bien.", hauteur: 0.9 - 0.25, rythme: 1 }]);
});

Deno.test("une voix imposée absente de l'appareil laisse la voix automatique, sans signalement", async () => {
  const signalements: number[] = [];
  const lecteur = new LecteurEnMemoire();
  const lecture = new LectureAVoixHaute({
    lecteur,
    voixDeLAppareil: voixEnMemoire([AMELIE, DENISE]),
    choixDeVoix: new ChoixDeVoixEnMemoire(ChoixDeVoix.imposee("Voix désinstallée")),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: "son",
    onVoixBloquee: () => signalements.push(1),
  });

  await lecture.lire("Écoute bien.");

  assertEquals([lecteur.lectures[0]?.voix, signalements], [DENISE, []]);
});

Deno.test("une consigne en anglais garde la voix anglaise malgré la voix imposée", async () => {
  const { lecture, lecteur } = uneLecture({ choix: ChoixDeVoix.imposee(AMELIE.nom) });

  await lecture.lire("Hello", { langue: "en-GB" });

  assertEquals(lecteur.lectures[0]?.voix, VOIX_ANGLAISE);
});

Deno.test("le choix est relu sur l'appareil à chaque lecture", async () => {
  const { lecture, lecteur, choixDeVoix } = uneLecture();
  await lecture.lire("Écoute bien.");

  choixDeVoix.memoriser(ChoixDeVoix.imposee(AMELIE.nom));
  await lecture.lire("Écoute bien.");

  assertEquals(lecteur.lectures.map((l) => l.voix), [DENISE, AMELIE]);
});

Deno.test("imposer une voix mémorise le choix sur l'appareil", () => {
  const { lecture, choixDeVoix } = uneLecture();

  lecture.imposerUneVoix(AMELIE.nom);

  assertEquals(choixDeVoix.lire(), ChoixDeVoix.imposee(AMELIE.nom));
});

Deno.test("revenir à la voix automatique efface le choix mémorisé", () => {
  const { lecture, choixDeVoix } = uneLecture({ choix: ChoixDeVoix.imposee(AMELIE.nom) });

  lecture.revenirALaVoixAutomatique();

  assertEquals(choixDeVoix.lire(), ChoixDeVoix.automatique);
});

Deno.test("essayer une voix lit la phrase d'essai avec cette voix et le caractère du personnage guide", async () => {
  const { lecture, lecteur } = uneLecture({ caractere: CARACTERE_CAPITAINE_SAM });

  await lecture.essayerUneVoix(ChoixDeVoix.imposee(AMELIE.nom), "Capitaine Sam");

  const lu = lecteur.lectures[0];
  assertEquals(lu?.voix, AMELIE);
  assertEquals(lu?.phrases.map((p) => p.phrase), texteALire(phraseDEssai("Capitaine Sam"))?.phrases);
  assertEquals(lu?.phrases[0]?.hauteur, 0.9 - 0.25 + 0.08);
});

Deno.test("essayer la voix automatique lit avec la meilleure voix", async () => {
  const { lecture, lecteur } = uneLecture({ choix: ChoixDeVoix.imposee(AMELIE.nom) });

  await lecture.essayerUneVoix(ChoixDeVoix.automatique, "Noisette");

  assertEquals(lecteur.lectures[0]?.voix, DENISE);
});

Deno.test("essayer une voix ne change pas le choix mémorisé", async () => {
  const { lecture, choixDeVoix } = uneLecture({ choix: ChoixDeVoix.imposee(DENISE.nom) });

  await lecture.essayerUneVoix(ChoixDeVoix.imposee(AMELIE.nom), "Noisette");

  assertEquals(choixDeVoix.lire(), ChoixDeVoix.imposee(DENISE.nom));
});

Deno.test("en Muet, l'essai d'une voix n'est pas lu", async () => {
  const { lecture, lecteur } = uneLecture({ muet: true });

  await lecture.essayerUneVoix(ChoixDeVoix.imposee(AMELIE.nom), "Noisette");

  assertEquals(lecteur.lectures, []);
});
