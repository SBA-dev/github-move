import { assertEquals } from "@std/assert";
import { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
import { CARACTERE_LANGUE_ETRANGERE } from "./choix-de-voix.ts";
import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import type { VoixDisponible } from "./voix-disponible.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { voixEnMemoire } from "../test_utils/voix-en-memoire.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const CARACTERE_NOISETTE: CaractereDeLaVoix = { sexe: "feminine", hauteur: 1.25, rythme: 1 };
const AMELIE: VoixDisponible = { nom: "Amélie (compact)", langue: "fr-FR" };
const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };
const VOIX_ANGLAISE: VoixDisponible = { nom: "Daniel", langue: "en-GB" };

function uneLecture(options: { muet?: boolean } = {}) {
  const lecteur = new LecteurEnMemoire();
  const signalementsDeVoixBloquee: number[] = [];
  const lecture = new LectureAVoixHaute({
    lecteur,
    voixDeLAppareil: voixEnMemoire([AMELIE, DENISE, VOIX_ANGLAISE]),
    hasard: hasardFixe(0.5),
    caractereDuPersonnageGuide: () => CARACTERE_NOISETTE,
    etatInitial: options.muet ? "muet" : "son",
    onVoixBloquee: () => signalementsDeVoixBloquee.push(1),
  });
  return { lecture, lecteur, signalementsDeVoixBloquee };
}

Deno.test("le personnage guide lit la consigne nettoyée, phrase par phrase, avec sa voix", async () => {
  const { lecture, lecteur } = uneLecture();

  await lecture.lire("<b>Écoute</b> bien. Combien font 3 + 4 ?");

  assertEquals(lecteur.lectures, [{
    voix: DENISE,
    langue: "fr-FR",
    phrases: [
      { phrase: "Écoute bien.", hauteur: 1.25, rythme: 1 },
      { phrase: "Combien font 3 plus 4 ?", hauteur: 1.25, rythme: 1 },
    ],
  }]);
});

Deno.test("un texte sans rien à dire n'est pas lu", async () => {
  const { lecture, lecteur } = uneLecture();

  await lecture.lire("___");

  assertEquals(lecteur.lectures, []);
});

Deno.test("une nouvelle lecture arrête d'abord la lecture en cours", async () => {
  const { lecture, lecteur } = uneLecture();

  await lecture.lire("Écoute bien.");
  await lecture.lire("Écoute bien.");

  assertEquals(lecteur.appels, ["arreter", "lire", "arreter", "lire"]);
});

Deno.test("couper la voix arrête la lecture", () => {
  const { lecture, lecteur } = uneLecture();

  lecture.couperLaVoix();

  assertEquals(lecteur.appels, ["arreter"]);
});

Deno.test("en Muet, rien n'est lu", async () => {
  const { lecture, lecteur } = uneLecture({ muet: true });

  await lecture.lire("Écoute bien.");

  assertEquals(lecteur.lectures, []);
});

Deno.test("passer en Muet arrête la lecture en cours et plus rien n'est lu", async () => {
  const { lecture, lecteur } = uneLecture();
  await lecture.lire("Écoute bien.");

  lecture.passerEnMuet();
  await lecture.lire("Écoute encore.");

  assertEquals(lecteur.appels, ["arreter", "lire", "arreter"]);
});

Deno.test("remettre le son fait dire au personnage guide qu'il est là", async () => {
  const { lecture, lecteur } = uneLecture({ muet: true });

  await lecture.remettreLeSon("Je t'entends ! Je suis Noisette.");

  assertEquals(lecteur.lectures.map((l) => l.phrases.map((p) => p.phrase)), [
    ["Je t'entends !", "Je suis Noisette."],
  ]);
});

Deno.test("une langue étrangère est lue avec une voix de cette langue et le caractère fixe", async () => {
  const { lecture, lecteur } = uneLecture();

  await lecture.lire("Listen and repeat.", { langue: "en-GB" });

  assertEquals(lecteur.lectures, [{
    voix: VOIX_ANGLAISE,
    langue: "en-GB",
    phrases: [{
      phrase: "Listen and repeat.",
      hauteur: CARACTERE_LANGUE_ETRANGERE.hauteur,
      rythme: CARACTERE_LANGUE_ETRANGERE.rythme,
    }],
  }]);
});

Deno.test("une voix bloquée est signalée une seule fois et la lecture suivante est quand même tentée", async () => {
  const { lecture, lecteur, signalementsDeVoixBloquee } = uneLecture();
  lecteur.bloquerLaVoix();

  await lecture.lire("Écoute bien.");
  await lecture.lire("Écoute bien.");

  assertEquals(signalementsDeVoixBloquee.length, 1);
  assertEquals(lecteur.lectures.length, 2);
});

Deno.test("un navigateur sans synthèse vocale ne provoque ni erreur ni signalement", async () => {
  const { lecture, lecteur, signalementsDeVoixBloquee } = uneLecture();
  lecteur.retirerLaSyntheseVocale();

  await lecture.lire("Écoute bien.");

  assertEquals(signalementsDeVoixBloquee, []);
});

Deno.test("le mot prononcé est signalé pendant la lecture, puis la fin de la lecture", async () => {
  const { lecture, lecteur } = uneLecture();
  lecteur.prononcerLesMots(
    { phrase: 0, position: 0 },
    { phrase: 0, position: 4 },
    { phrase: 0, position: 7 },
    { phrase: 1, position: 0 },
  );
  const signaux: Array<number | "fin"> = [];

  await lecture.lire("Lis la phrase. Bravo !", {
    onMot: (rang) => signaux.push(rang),
    onFin: () => signaux.push("fin"),
  });

  assertEquals(signaux, [0, 1, 2, 3, "fin"]);
});

function signauxDeMots(
  affiche: string,
  annonces: Array<{ phrase: number; position: number }>,
) {
  const { lecture, lecteur } = uneLecture();
  lecteur.prononcerLesMots(...annonces);
  const rangs: number[] = [];
  return lecture.lire(affiche, { onMot: (rang) => rangs.push(rang) }).then(() => rangs);
}

Deno.test("un trou de soulignés dit en silence ne surligne aucun mot et ne décale pas les rangs", async () => {
  // texte lu : « Le chat ... » / « du lait. »
  const rangs = await signauxDeMots("Le chat ___ du lait.", [
    { phrase: 0, position: 0 },
    { phrase: 0, position: 3 },
    { phrase: 0, position: 8 },
    { phrase: 1, position: 0 },
    { phrase: 1, position: 3 },
  ]);

  assertEquals(rangs, [0, 1, 2, 3]);
});

Deno.test("les rangs continuent d'une phrase à l'autre et la ponctuation isolée ne surligne rien", async () => {
  // texte lu : « Bravo ! » / « Encore une. »
  const rangs = await signauxDeMots("Bravo ! Encore une.", [
    { phrase: 0, position: 0 },
    { phrase: 0, position: 6 },
    { phrase: 1, position: 0 },
    { phrase: 1, position: 7 },
  ]);

  assertEquals(rangs, [0, 1, 2]);
});

Deno.test("« plus » et « égale » dits pour « 3 + 4 = 7 » ne surlignent aucun mot affiché", async () => {
  // texte lu : « 3 plus 4 égale 7 »
  const rangs = await signauxDeMots("3 + 4 = 7", [
    { phrase: 0, position: 0 },
    { phrase: 0, position: 2 },
    { phrase: 0, position: 7 },
    { phrase: 0, position: 9 },
    { phrase: 0, position: 15 },
  ]);

  assertEquals(rangs, [0, 1, 2]);
});

Deno.test("le mot unique « 3+4=7 » reste surligné pendant toute sa lecture", async () => {
  const rangs = await signauxDeMots("3+4=7", [
    { phrase: 0, position: 0 },
    { phrase: 0, position: 2 },
    { phrase: 0, position: 7 },
    { phrase: 0, position: 9 },
    { phrase: 0, position: 15 },
  ]);

  assertEquals([...new Set(rangs)], [0]);
});
