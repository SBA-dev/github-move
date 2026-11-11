import { assertEquals, assertRejects } from "@std/assert";
import { LecteurAvecRepli } from "./lecteur-avec-repli.ts";
import { VoixBloquee, VoixIndisponible } from "./erreurs.ts";
import { cleDePhrase } from "./cle-de-phrase.ts";
import { instantsDesMots } from "./instants-des-mots.ts";
import type { LectureDemandee } from "./lecteur-a-voix-haute.ts";
import { LecteurEnMemoire } from "../test_utils/lecteur-en-memoire.ts";
import { LecteurDePhrasesEnregistreesEnMemoire } from "../test_utils/lecteur-de-phrases-enregistrees-en-memoire.ts";
import { repertoireDeTest } from "../test_utils/repertoire-de-test.ts";

const BONJOUR = "Bonjour les amis !";
const ON_COMMENCE = "On commence la leçon.";
const A_BIENTOT = "À bientôt !";

function enregistrees(...phrases: string[]) {
  return repertoireDeTest(
    Object.fromEntries(phrases.map((phrase) => [cleDePhrase(phrase), { normale: `empreinte-${phrase.length}` }])),
  );
}

function lectureDe(phrases: string[], options: Partial<LectureDemandee> = {}): LectureDemandee {
  return {
    voix: undefined,
    langue: "fr-FR",
    phrases: phrases.map((phrase) => ({ phrase, hauteur: 1, rythme: 1 })),
    ...options,
  };
}

function unLecteur(options: { repertoire: ReturnType<typeof enregistrees>; voixFrancaise?: boolean }) {
  const journal: string[] = [];
  const phrasesEnregistrees = new LecteurDePhrasesEnregistreesEnMemoire(journal);
  const synthese = new LecteurEnMemoire(journal);
  const lecteur = new LecteurAvecRepli({
    repertoire: options.repertoire,
    lecteurDePhrasesEnregistrees: phrasesEnregistrees,
    voixDeLAppareil: synthese,
    aUneVoixFrancaise: () => options.voixFrancaise ?? true,
  });
  return { lecteur, phrasesEnregistrees, synthese, journal };
}

const attendreUnTour = () => new Promise((resolve) => setTimeout(resolve, 0));

Deno.test("des phrases toutes enregistrées sont jouées dans l'ordre sans appeler la voix de l'appareil", async () => {
  const { lecteur, phrasesEnregistrees, synthese } = unLecteur({ repertoire: enregistrees(BONJOUR, ON_COMMENCE) });

  await lecteur.lire(lectureDe([BONJOUR, ON_COMMENCE]));

  assertEquals(phrasesEnregistrees.morceauxJoues.map((m) => m.phrase), [BONJOUR, ON_COMMENCE]);
  assertEquals(synthese.lectures.length, 0);
});

Deno.test("une phrase sans enregistrement est dite par la voix de l'appareil, les autres restent enregistrées dans l'ordre", async () => {
  const { lecteur, synthese, journal } = unLecteur({ repertoire: enregistrees(BONJOUR, A_BIENTOT) });

  await lecteur.lire(lectureDe([BONJOUR, ON_COMMENCE, A_BIENTOT]));

  assertEquals(journal, [`mp3:${BONJOUR}`, "parole", `mp3:${A_BIENTOT}`]);
  assertEquals(synthese.lectures.map((l) => l.phrases.map((p) => p.phrase)), [[ON_COMMENCE]]);
});

Deno.test("la voix de l'appareil et la phrase enregistrée suivante ne parlent jamais en même temps", async () => {
  const { lecteur, synthese, journal } = unLecteur({ repertoire: enregistrees(BONJOUR, A_BIENTOT) });
  synthese.lireSansTerminerAutomatiquement();

  const lecture = lecteur.lire(lectureDe([BONJOUR, ON_COMMENCE, A_BIENTOT]));
  await attendreUnTour();
  assertEquals(journal, [`mp3:${BONJOUR}`, "parole"]);

  synthese.terminerLaParole();
  await lecture;
  assertEquals(journal, [`mp3:${BONJOUR}`, "parole", `mp3:${A_BIENTOT}`]);
});

Deno.test("un enregistrement illisible est remplacé par la voix de l'appareil pour cette phrase, sans erreur", async () => {
  const { lecteur, phrasesEnregistrees, synthese } = unLecteur({ repertoire: enregistrees(BONJOUR) });
  phrasesEnregistrees.rendreIllisible(BONJOUR);

  await lecteur.lire(lectureDe([BONJOUR]));

  assertEquals(synthese.lectures.map((l) => l.phrases.map((p) => p.phrase)), [[BONJOUR]]);
});

Deno.test("une phrase sans enregistrement et aucune voix française sur l'appareil rend la voix indisponible", async () => {
  const { lecteur } = unLecteur({ repertoire: enregistrees(), voixFrancaise: false });

  await assertRejects(() => lecteur.lire(lectureDe([ON_COMMENCE])), VoixIndisponible);
});

Deno.test("sans voix française, le texte enregistré de remplacement est joué à la place du texte principal", async () => {
  const { lecteur, phrasesEnregistrees, synthese } = unLecteur({
    repertoire: enregistrees("Bravo !"),
    voixFrancaise: false,
  });

  await lecteur.lire(lectureDe(["Bravo Léa !"], { texteEnregistreDeRemplacement: "Bravo !" }));

  assertEquals(phrasesEnregistrees.morceauxJoues.map((m) => m.phrase), ["Bravo !"]);
  assertEquals(synthese.lectures.length, 0);
});

Deno.test("avec une voix française, le texte enregistré de remplacement n'est pas utilisé", async () => {
  const { lecteur, phrasesEnregistrees, synthese } = unLecteur({ repertoire: enregistrees("Bravo !") });

  await lecteur.lire(lectureDe(["Bravo Léa !"], { texteEnregistreDeRemplacement: "Bravo !" }));

  assertEquals(phrasesEnregistrees.morceauxJoues.length, 0);
  assertEquals(synthese.lectures.map((l) => l.phrases.map((p) => p.phrase)), [["Bravo Léa !"]]);
});

Deno.test("quand le navigateur refuse de jouer un enregistrement, la lecture est bloquée", async () => {
  const { lecteur, phrasesEnregistrees } = unLecteur({ repertoire: enregistrees(BONJOUR) });
  phrasesEnregistrees.refuserDeJouer();

  await assertRejects(() => lecteur.lire(lectureDe([BONJOUR])), VoixBloquee);
});

Deno.test("arrêter pendant un enregistrement l'interrompt, ne joue pas la suite et termine la lecture", async () => {
  const { lecteur, phrasesEnregistrees } = unLecteur({ repertoire: enregistrees(BONJOUR, ON_COMMENCE) });
  phrasesEnregistrees.jouerSansTerminerAutomatiquement();

  const lecture = lecteur.lire(lectureDe([BONJOUR, ON_COMMENCE]));
  await attendreUnTour();
  lecteur.arreter();
  await lecture;

  assertEquals(phrasesEnregistrees.nombreDArrets, 1);
  assertEquals(phrasesEnregistrees.morceauxJoues.map((m) => m.phrase), [BONJOUR]);
});

Deno.test("chaque mot d'une phrase enregistrée est annoncé à son instant, une fois la durée connue", async () => {
  const { lecteur, phrasesEnregistrees } = unLecteur({ repertoire: enregistrees(BONJOUR) });
  phrasesEnregistrees.avecUneDuree(1000);
  phrasesEnregistrees.avecLeTempsQuiPasse(0, 1000);
  const mots: Array<[number, number]> = [];

  await lecteur.lire(lectureDe([BONJOUR], { onMot: (rang, position) => mots.push([rang, position]) }));

  assertEquals(mots, instantsDesMots(BONJOUR, 1000).map(({ position }) => [0, position]));
});

Deno.test("une phrase en langue étrangère est dite par la voix de l'appareil même si son enregistrement existe", async () => {
  const { lecteur, phrasesEnregistrees, synthese } = unLecteur({ repertoire: enregistrees("Hello !") });

  await lecteur.lire(lectureDe(["Hello !"], { langue: "en-GB" }));

  assertEquals(phrasesEnregistrees.morceauxJoues.length, 0);
  assertEquals(synthese.lectures.length, 1);
});
