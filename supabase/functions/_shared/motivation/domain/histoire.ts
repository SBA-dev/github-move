export type Episode = { readonly numero: number; readonly titre: string; readonly texte: string };

export const HISTOIRE_DES_SAVANTURIERS: readonly Episode[] = [
  {
    numero: 1,
    titre: "La carte froissée",
    texte:
      "Un matin, Noisette trouve sous son noisetier une vieille carte froissée. Dessus, une étoile dorée brille, avec ces mots : « L'Étoile du savoir attend les Savanturiers. »",
  },
  {
    numero: 2,
    titre: "Le premier indice",
    texte:
      "Au dos de la carte, une énigme : « Pour avancer, il faut apprendre. » Noisette se gratte la tête. Apprendre ? Elle vient justement de réussir une leçon avec toi !",
  },
  {
    numero: 3,
    titre: "Le pont des lettres",
    texte:
      "Le chemin s'arrête devant une rivière. Un pont apparaît, planche après planche, chaque fois que Noisette lit un mot à voix haute. Clac, clac, clac : les voilà de l'autre côté !",
  },
  {
    numero: 4,
    titre: "Pipo le hérisson",
    texte:
      "Dans les fougères, un petit hérisson pleure : il a perdu le compte de ses pommes. Noisette l'aide à les ranger par dizaines. « Merci ! Je m'appelle Pipo. Je viens avec vous ! »",
  },
  {
    numero: 5,
    titre: "La forêt qui chuchote",
    texte:
      "Les arbres de cette forêt chuchotent des mots mélangés. Pipo et Noisette les remettent dans l'ordre, et une phrase apparaît : « Suivez le ruisseau jusqu'au moulin. »",
  },
  {
    numero: 6,
    titre: "Le moulin des nombres",
    texte:
      "Les ailes du moulin sont bloquées. Sur la porte, une addition attend sa réponse. Noisette pose les chiffres en colonnes… et les ailes se remettent à tourner, tout doucement.",
  },
  {
    numero: 7,
    titre: "Une plume dans le vent",
    texte:
      "Une plume bleue tombe du ciel. C'est celle de Céleste, une hirondelle qui connaît tous les chemins. « L'Étoile ? Elle est tout en haut de la Montagne des Saisons. »",
  },
  {
    numero: 8,
    titre: "La pluie de verbes",
    texte:
      "Il pleut des verbes ! Chanter, finir, prendre… Pour s'abriter, il faut ranger chacun dans sa maison. Pipo rit si fort qu'il en roule comme une balle.",
  },
  {
    numero: 9,
    titre: "Le village des sons",
    texte:
      "Au village, chaque maison a un son : ou, on, an… Le maire a perdu la clé du son « oi ». Noisette la retrouve dans le mot « étoile ». Évidemment !",
  },
  {
    numero: 10,
    titre: "La nuit des lucioles",
    texte:
      "La nuit tombe. Les lucioles s'allument une à une pour chaque bonne réponse. Bientôt, tout le chemin brille, et les trois amis peuvent continuer sans peur.",
  },
  {
    numero: 11,
    titre: "Le géant endormi",
    texte:
      "Un géant dort en travers du chemin. Pour le réveiller gentiment, il faut lui réciter une poésie. Il ouvre un œil, sourit, et se pousse : « Jolie voix ! Passez, les amis. »",
  },
  {
    numero: 12,
    titre: "La boutique du renard",
    texte:
      "Monsieur Renard vend des cordes pour la montagne. Trois euros cinquante la corde. Noisette compte ses pièces avec soin. Le compte est bon !",
  },
  {
    numero: 13,
    titre: "Le pied de la montagne",
    texte:
      "La Montagne des Saisons est immense. En bas, c'est l'été ; plus haut, l'automne ; tout en haut, l'hiver. Céleste montre le sentier qui monte en zigzag.",
  },
  {
    numero: 14,
    titre: "L'automne en couleurs",
    texte:
      "Les feuilles rousses forment des formes au sol : un carré, un triangle, un cercle. Il faut marcher seulement sur les triangles. Pipo saute de l'un à l'autre en riant.",
  },
  {
    numero: 15,
    titre: "La grotte de l'écho",
    texte:
      "Dans la grotte, l'écho répète tout… en anglais ! « Hello ! » dit Noisette. « Hello, hello ! » répond la grotte. Les amis apprennent trois mots pour passer.",
  },
  {
    numero: 16,
    titre: "L'horloge de glace",
    texte:
      "Une horloge de glace bloque la porte de l'hiver. Il faut placer les aiguilles sur trois heures et quart. Clic ! La porte s'ouvre dans un nuage de flocons.",
  },
  {
    numero: 17,
    titre: "La tempête de neige",
    texte:
      "Le vent souffle fort. Pipo a froid. Noisette se souvient de sa leçon : les animaux se serrent pour garder la chaleur. Les trois amis se blottissent, et la tempête passe.",
  },
  {
    numero: 18,
    titre: "Le dernier escalier",
    texte:
      "Il reste cent marches. Noisette compte de dix en dix pour aller plus vite : dix, vingt, trente… cent ! Tout en haut, une lumière dorée les attend.",
  },
  {
    numero: 19,
    titre: "L'Étoile du savoir",
    texte:
      "L'Étoile flotte au-dessus de la neige. Elle parle d'une voix douce : « Je ne suis pas un trésor qu'on emporte. Je brille chaque fois que tu apprends quelque chose. »",
  },
  {
    numero: 20,
    titre: "Le retour des Savanturiers",
    texte:
      "De retour au noisetier, Noisette accroche une petite étoile dans sa cabane. Pipo et Céleste font la fête. Et toi, tu fais maintenant partie des Savanturiers ! Mais chut… une nouvelle carte vient d'arriver.",
  },
];

export type EtatDeLHistoire = {
  readonly nombreDEpisodesOuverts: number;
  readonly episodesOuverts: readonly Episode[];
  readonly complete: boolean;
};

export class NombreDeSeancesInvalide extends Error {
  constructor(readonly nombre: number) {
    super(`${nombre} n'est pas un nombre de séances terminées valide : il faut un nombre entier positif ou nul.`);
    this.name = "NombreDeSeancesInvalide";
  }
}

export class EpisodeInconnu extends Error {
  constructor(readonly numero: number) {
    super(
      `L'épisode ${numero} n'existe pas : l'histoire des Savanturiers a ${HISTOIRE_DES_SAVANTURIERS.length} épisodes.`,
    );
    this.name = "EpisodeInconnu";
  }
}

export class EpisodeNonOuvert extends Error {
  constructor(readonly numero: number) {
    super(`L'épisode ${numero} n'est pas encore ouvert.`);
    this.name = "EpisodeNonOuvert";
  }
}

function verifierNombreDeSeances(nombre: number): number {
  if (!Number.isInteger(nombre) || nombre < 0) throw new NombreDeSeancesInvalide(nombre);
  return nombre;
}

export function histoireDe(nombreDeSeancesTerminees: number): EtatDeLHistoire {
  const episodesOuverts = HISTOIRE_DES_SAVANTURIERS.slice(0, verifierNombreDeSeances(nombreDeSeancesTerminees));
  return {
    nombreDEpisodesOuverts: episodesOuverts.length,
    episodesOuverts,
    complete: episodesOuverts.length === HISTOIRE_DES_SAVANTURIERS.length,
  };
}

export function episodeOuvertParLaSeance(nombreDeSeancesAvant: number | undefined): Episode | undefined {
  if (nombreDeSeancesAvant === undefined) return undefined;
  return HISTOIRE_DES_SAVANTURIERS[verifierNombreDeSeances(nombreDeSeancesAvant)];
}

export function episodeOuvert(etat: EtatDeLHistoire, numero: number): Episode {
  const episode = HISTOIRE_DES_SAVANTURIERS.find((candidat) => candidat.numero === numero);
  if (episode === undefined) throw new EpisodeInconnu(numero);
  if (numero > etat.nombreDEpisodesOuverts) throw new EpisodeNonOuvert(numero);
  return episode;
}

export function episodeSuivant(etat: EtatDeLHistoire, numero: number): Episode | undefined {
  return etat.episodesOuverts.find((episode) => episode.numero === numero + 1);
}
