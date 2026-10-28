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
  const signalementsDeVoixBloquee: number[] = [];
  const lecture = new LectureAVoixHaute({
    lecteur,
    lecteurDEffetsSonores,
    voixDeLAppareil: voixEnMemoire([]),
    choixDeVoix: new ChoixDeVoixEnMemoire(),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial,
    onVoixBloquee: () => signalementsDeVoixBloquee.push(1),
    onFinDeLaVoixBloquee: () => {},
  });
  return { lecture, lecteurDEffetsSonores, lecteur, journal, signalementsDeVoixBloquee };
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

  assertEquals(lecteurDEffetsSonores.nombreDArrets, 0);
  assertEquals(lecteur.lectures.length, 0);
});

Deno.test("voix suspendue, aucun effet sonore n'est joué ; après la reprise, ils le sont de nouveau", async () => {
  const { lecture, lecteurDEffetsSonores } = uneLecture();
  lecture.suspendre();

  await lecture.jouer(["reponseJuste"]);
  assertEquals(lecteurDEffetsSonores.effetsJoues, []);

  lecture.reprendre();
  await lecture.jouer(["reponseJuste"]);
  assertEquals(lecteurDEffetsSonores.effetsJoues, ["reponseJuste"]);
});

Deno.test("suspendre la voix pendant un effet sonore arrête cet effet", async () => {
  const { lecture, lecteurDEffetsSonores } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();
  lecture.jouer(["reponseJuste"]);
  await Promise.resolve();

  lecture.suspendre();

  assertEquals(lecteurDEffetsSonores.nombreDArrets, 1);
});

Deno.test("couper la voix pendant un effet sonore arrête cet effet", async () => {
  const { lecture, lecteurDEffetsSonores } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();
  lecture.jouer(["reponseJuste"]);
  await Promise.resolve();

  lecture.couperLaVoix();

  assertEquals(lecteurDEffetsSonores.nombreDArrets, 1);
});

Deno.test("de nouveaux effets sonores arrêtent d'abord l'effet en cours", async () => {
  const { lecture, lecteurDEffetsSonores, journal } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();
  lecture.jouer(["reponseJuste"]);
  await Promise.resolve();

  lecture.jouer(["reponseFausse"]);
  await Promise.resolve();

  assertEquals(journal, ["effet:reponseJuste", "arret-effet", "effet:reponseFausse"]);
});

Deno.test("une nouvelle lecture arrête d'abord l'effet sonore en cours", async () => {
  const { lecture, lecteurDEffetsSonores, journal } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();
  lecture.jouer(["reponseJuste"]);
  await Promise.resolve();

  lecture.lire("Bravo !", { effetsAvant: ["pointDuRecipient"] });
  await Promise.resolve();

  assertEquals(journal, ["effet:reponseJuste", "arret-effet", "effet:pointDuRecipient"]);
});

Deno.test("un effet sonore impossible n'empêche pas la parole et n'est pas pris pour une voix bloquée", async () => {
  const { lecture, lecteurDEffetsSonores, lecteur, signalementsDeVoixBloquee } = uneLecture();
  lecteurDEffetsSonores.faireEchouerLesEffets();

  const parole = await lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });

  assertEquals(lecteur.lectures.length, 1);
  assertEquals(parole, { entendue: true });
  assertEquals(signalementsDeVoixBloquee, []);
});

Deno.test("jouer des effets sonores impossibles ne fait pas échouer l'appel", async () => {
  const { lecture, lecteurDEffetsSonores, signalementsDeVoixBloquee } = uneLecture();
  lecteurDEffetsSonores.faireEchouerLesEffets();

  await lecture.jouer(["reponseJuste", "pointDuRecipient"]);

  assertEquals(signalementsDeVoixBloquee, []);
});

Deno.test("voix bloquée, les effets sonores demandés avant la parole sont quand même joués", async () => {
  const { lecture, lecteurDEffetsSonores, lecteur } = uneLecture();
  lecteur.bloquerLaVoix();

  await lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });

  assertEquals(lecteurDEffetsSonores.effetsJoues, ["reponseJuste"]);
});

Deno.test("sans synthèse vocale, les effets sonores demandés avant la parole sont quand même joués", async () => {
  const { lecture, lecteurDEffetsSonores, lecteur } = uneLecture();
  lecteur.retirerLaSyntheseVocale();

  await lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });

  assertEquals(lecteurDEffetsSonores.effetsJoues, ["reponseJuste"]);
});

Deno.test("couper la voix pendant une suite d'effets sonores ne joue pas les suivants", async () => {
  const { lecture, lecteurDEffetsSonores } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();
  const suite = lecture.jouer(["reponseJuste", "pointDuRecipient"]);
  await Promise.resolve();

  lecture.couperLaVoix();
  lecteurDEffetsSonores.terminerLEffetEnCours();
  await suite;

  assertEquals(lecteurDEffetsSonores.effetsJoues, ["reponseJuste"]);
});

Deno.test("couper la voix pendant l'effet sonore qui précède la parole empêche la parole", async () => {
  const { lecture, lecteurDEffetsSonores, lecteur } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();
  const parole = lecture.lire("Bravo !", { effetsAvant: ["reponseJuste"] });
  await Promise.resolve();

  lecture.couperLaVoix();
  lecteurDEffetsSonores.terminerLEffetEnCours();

  assertEquals(await parole, { entendue: false });
  assertEquals(lecteur.lectures.length, 0);
});

Deno.test("deux lectures rapides avec effets sonores : seule la seconde parole est lue", async () => {
  const { lecture, lecteurDEffetsSonores, lecteur } = uneLecture();
  lecteurDEffetsSonores.jouerSansTerminerAutomatiquement();
  const premiere = lecture.lire("Premier.", { effetsAvant: ["reponseJuste"] });
  await Promise.resolve();
  const seconde = lecture.lire("Second.", { effetsAvant: ["reponseFausse"] });
  await Promise.resolve();

  lecteurDEffetsSonores.terminerLEffetEnCours();
  lecteurDEffetsSonores.terminerLEffetEnCours();
  await Promise.all([premiere, seconde]);

  assertEquals(lecteur.lectures.map((demandee) => demandee.phrases.map((phrase) => phrase.phrase)), [["Second."]]);
});

Deno.test("jouer des effets sonores arrête d'abord la parole en cours", async () => {
  const { lecture, lecteur, journal } = uneLecture();
  lecteur.lireSansTerminerAutomatiquement();
  lecture.lire("Bravo !");
  await Promise.resolve();

  await lecture.jouer(["reponseJuste"]);

  assertEquals(journal, ["parole", "arret-parole", "effet:reponseJuste"]);
});
