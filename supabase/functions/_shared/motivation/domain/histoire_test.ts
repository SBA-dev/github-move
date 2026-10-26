import { assert, assertEquals, assertThrows } from "@std/assert";
import {
  EpisodeInconnu,
  EpisodeNonOuvert,
  episodeOuvert,
  episodeOuvertParLaSeance,
  episodeSuivant,
  HISTOIRE_DES_SAVANTURIERS,
  histoireDe,
  NombreDeSeancesInvalide,
} from "./histoire.ts";

const TITRES_DU_LEGACY = [
  "La carte froissée",
  "Le premier indice",
  "Le pont des lettres",
  "Pipo le hérisson",
  "La forêt qui chuchote",
  "Le moulin des nombres",
  "Une plume dans le vent",
  "La pluie de verbes",
  "Le village des sons",
  "La nuit des lucioles",
  "Le géant endormi",
  "La boutique du renard",
  "Le pied de la montagne",
  "L'automne en couleurs",
  "La grotte de l'écho",
  "L'horloge de glace",
  "La tempête de neige",
  "Le dernier escalier",
  "L'Étoile du savoir",
  "Le retour des Savanturiers",
];

const TEXTES_DU_LEGACY_DES_EPISODES_1_A_19 = [
  "Un matin, Noisette trouve sous son noisetier une vieille carte froissée. Dessus, une étoile dorée brille, avec ces mots : « L'Étoile du savoir attend les Savanturiers. »",
  "Au dos de la carte, une énigme : « Pour avancer, il faut apprendre. » Noisette se gratte la tête. Apprendre ? Elle vient justement de réussir une leçon avec toi !",
  "Le chemin s'arrête devant une rivière. Un pont apparaît, planche après planche, chaque fois que Noisette lit un mot à voix haute. Clac, clac, clac : les voilà de l'autre côté !",
  "Dans les fougères, un petit hérisson pleure : il a perdu le compte de ses pommes. Noisette l'aide à les ranger par dizaines. « Merci ! Je m'appelle Pipo. Je viens avec vous ! »",
  "Les arbres de cette forêt chuchotent des mots mélangés. Pipo et Noisette les remettent dans l'ordre, et une phrase apparaît : « Suivez le ruisseau jusqu'au moulin. »",
  "Les ailes du moulin sont bloquées. Sur la porte, une addition attend sa réponse. Noisette pose les chiffres en colonnes… et les ailes se remettent à tourner, tout doucement.",
  "Une plume bleue tombe du ciel. C'est celle de Céleste, une hirondelle qui connaît tous les chemins. « L'Étoile ? Elle est tout en haut de la Montagne des Saisons. »",
  "Il pleut des verbes ! Chanter, finir, prendre… Pour s'abriter, il faut ranger chacun dans sa maison. Pipo rit si fort qu'il en roule comme une balle.",
  "Au village, chaque maison a un son : ou, on, an… Le maire a perdu la clé du son « oi ». Noisette la retrouve dans le mot « étoile ». Évidemment !",
  "La nuit tombe. Les lucioles s'allument une à une pour chaque bonne réponse. Bientôt, tout le chemin brille, et les trois amis peuvent continuer sans peur.",
  "Un géant dort en travers du chemin. Pour le réveiller gentiment, il faut lui réciter une poésie. Il ouvre un œil, sourit, et se pousse : « Jolie voix ! Passez, les amis. »",
  "Monsieur Renard vend des cordes pour la montagne. Trois euros cinquante la corde. Noisette compte ses pièces avec soin. Le compte est bon !",
  "La Montagne des Saisons est immense. En bas, c'est l'été ; plus haut, l'automne ; tout en haut, l'hiver. Céleste montre le sentier qui monte en zigzag.",
  "Les feuilles rousses forment des formes au sol : un carré, un triangle, un cercle. Il faut marcher seulement sur les triangles. Pipo saute de l'un à l'autre en riant.",
  "Dans la grotte, l'écho répète tout… en anglais ! « Hello ! » dit Noisette. « Hello, hello ! » répond la grotte. Les amis apprennent trois mots pour passer.",
  "Une horloge de glace bloque la porte de l'hiver. Il faut placer les aiguilles sur trois heures et quart. Clic ! La porte s'ouvre dans un nuage de flocons.",
  "Le vent souffle fort. Pipo a froid. Noisette se souvient de sa leçon : les animaux se serrent pour garder la chaleur. Les trois amis se blottissent, et la tempête passe.",
  "Il reste cent marches. Noisette compte de dix en dix pour aller plus vite : dix, vingt, trente… cent ! Tout en haut, une lumière dorée les attend.",
  "L'Étoile flotte au-dessus de la neige. Elle parle d'une voix douce : « Je ne suis pas un trésor qu'on emporte. Je brille chaque fois que tu apprends quelque chose. »",
];

const NOMBRES_INVALIDES = [-1, 1.5, Infinity, NaN];

Deno.test("l'histoire des Savanturiers a 20 épisodes numérotés de 1 à 20 sans trou", () => {
  const numeros = HISTOIRE_DES_SAVANTURIERS.map((episode) => episode.numero);

  assertEquals(numeros, Array.from({ length: 20 }, (_, i) => i + 1));
});

Deno.test("chaque épisode de l'histoire des Savanturiers a un titre et un texte non vides", () => {
  HISTOIRE_DES_SAVANTURIERS.forEach((episode) => {
    assert(episode.titre.trim() !== "", `titre vide, épisode ${episode.numero}`);
    assert(episode.texte.trim() !== "", `texte vide, épisode ${episode.numero}`);
  });
});

Deno.test("les titres des épisodes sont tous différents", () => {
  const titres = HISTOIRE_DES_SAVANTURIERS.map((episode) => episode.titre);

  assertEquals(new Set(titres).size, 20);
});

Deno.test("les titres des épisodes sont ceux du legacy, dans l'ordre", () => {
  assertEquals(HISTOIRE_DES_SAVANTURIERS.map((episode) => episode.titre), TITRES_DU_LEGACY);
});

Deno.test("les textes des épisodes 1 à 19 sont ceux du legacy, mot pour mot", () => {
  assertEquals(
    HISTOIRE_DES_SAVANTURIERS.slice(0, 19).map((episode) => episode.texte),
    TEXTES_DU_LEGACY_DES_EPISODES_1_A_19,
  );
});

Deno.test("le texte du premier épisode commence par la carte froissée de Noisette", () => {
  const texte = HISTOIRE_DES_SAVANTURIERS[0].texte;

  assert(texte.startsWith("Un matin, Noisette trouve sous son noisetier une vieille carte froissée."));
});

Deno.test("le texte du dernier épisode est épicène et garde la nouvelle carte", () => {
  const texte = HISTOIRE_DES_SAVANTURIERS[19].texte;

  assert(texte.includes("Et toi, tu fais maintenant partie des Savanturiers !"));
  assert(!texte.includes("tu es devenu un vrai Savanturier"));
  assert(texte.endsWith("Mais chut… une nouvelle carte vient d'arriver."));
});

Deno.test("sans séance terminée, aucun épisode n'est ouvert", () => {
  const etat = histoireDe(0);

  assertEquals(etat.nombreDEpisodesOuverts, 0);
  assertEquals(etat.episodesOuverts, []);
  assertEquals(etat.complete, false);
});

Deno.test("après une séance terminée, le premier épisode est ouvert", () => {
  const etat = histoireDe(1);

  assertEquals(etat.nombreDEpisodesOuverts, 1);
  assertEquals(etat.episodesOuverts.map((episode) => episode.titre), ["La carte froissée"]);
  assertEquals(etat.complete, false);
});

Deno.test("après deux séances terminées, les deux premiers épisodes sont ouverts dans l'ordre", () => {
  const etat = histoireDe(2);

  assertEquals(etat.episodesOuverts.map((episode) => episode.numero), [1, 2]);
});

Deno.test("après 19 séances terminées, l'histoire n'est pas complète", () => {
  const etat = histoireDe(19);

  assertEquals(etat.nombreDEpisodesOuverts, 19);
  assertEquals(etat.episodesOuverts.length, 19);
  assertEquals(etat.complete, false);
});

Deno.test("après 20 séances terminées, l'histoire est complète", () => {
  const etat = histoireDe(20);

  assertEquals(etat.nombreDEpisodesOuverts, 20);
  assertEquals(etat.episodesOuverts, HISTOIRE_DES_SAVANTURIERS);
  assertEquals(etat.complete, true);
});

Deno.test("au-delà de 20 séances terminées, les 20 épisodes restent ouverts", () => {
  [21, 35].forEach((nombre) => {
    const etat = histoireDe(nombre);

    assertEquals(etat.nombreDEpisodesOuverts, 20);
    assertEquals(etat.episodesOuverts.length, 20);
    assertEquals(etat.complete, true);
  });
});

Deno.test("un nombre de séances terminées négatif, non entier ou infini est refusé", () => {
  NOMBRES_INVALIDES.forEach((nombre) => {
    assertThrows(() => histoireDe(nombre), NombreDeSeancesInvalide);
  });
});

Deno.test("la première séance ouvre l'épisode « La carte froissée »", () => {
  assertEquals(episodeOuvertParLaSeance(0)?.titre, "La carte froissée");
});

Deno.test("la deuxième séance ouvre l'épisode « Le premier indice »", () => {
  assertEquals(episodeOuvertParLaSeance(1)?.titre, "Le premier indice");
});

Deno.test("la 19e séance ouvre l'épisode « L'Étoile du savoir »", () => {
  assertEquals(episodeOuvertParLaSeance(18)?.titre, "L'Étoile du savoir");
});

Deno.test("la 20e séance ouvre le dernier épisode, « Le retour des Savanturiers »", () => {
  assertEquals(episodeOuvertParLaSeance(19)?.titre, "Le retour des Savanturiers");
});

Deno.test("une séance après les 20 premières n'ouvre aucun épisode", () => {
  assertEquals(episodeOuvertParLaSeance(20), undefined);
  assertEquals(episodeOuvertParLaSeance(35), undefined);
});

Deno.test("sans nombre de séances d'avant connu, la séance n'annonce aucun épisode", () => {
  assertEquals(episodeOuvertParLaSeance(undefined), undefined);
});

Deno.test("un nombre de séances d'avant invalide est refusé", () => {
  NOMBRES_INVALIDES.forEach((nombre) => {
    assertThrows(() => episodeOuvertParLaSeance(nombre), NombreDeSeancesInvalide);
  });
});

Deno.test("un épisode ouvert se lit par son numéro", () => {
  const episode = episodeOuvert(histoireDe(3), 2);

  assertEquals(episode.titre, "Le premier indice");
});

Deno.test("un numéro d'épisode hors de 1 à 20 est inconnu", () => {
  const etat = histoireDe(20);

  [0, 21].forEach((numero) => {
    assertThrows(() => episodeOuvert(etat, numero), EpisodeInconnu);
  });
});

Deno.test("un épisode fermé ne peut pas être lu", () => {
  assertThrows(() => episodeOuvert(histoireDe(3), 4), EpisodeNonOuvert);
});

Deno.test("l'épisode suivant est proposé quand il est ouvert", () => {
  assertEquals(episodeSuivant(histoireDe(3), 2)?.numero, 3);
});

Deno.test("l'épisode suivant n'est pas proposé quand il est fermé", () => {
  assertEquals(episodeSuivant(histoireDe(3), 3), undefined);
});

Deno.test("aucun épisode ne suit le dernier", () => {
  assertEquals(episodeSuivant(histoireDe(20), 20), undefined);
});
