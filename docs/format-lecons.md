# Format d'une leçon

Chaque leçon est un objet JSON. La même structure sert pour :

- la **bibliothèque** préparée à partir des programmes officiels (`app/bibliotheque.json`) ;
- les **leçons créées par un adulte** à partir de son propre texte (générées par l'IA, ou par les générateurs locaux de l'application).

Le moteur affiche n'importe quelle leçon dans l'univers choisi par l'enfant (princesses, animaux, sports, police, pompiers, danse). L'univers ne change que l'habillage : le guide, le décor et les récompenses. Le contenu pédagogique reste identique.

```json
{
  "id": "fr-ce1-etre-avoir",
  "matiere": "francais",
  "niveau": "CE1",
  "titre": "Être et avoir au présent",
  "ordre": 40,
  "programme": {
    "section": "c2-francais-cp-decouvrir-comprendre-et-mettre-en-uvre-lorthographe-grammaticale",
    "citation": "Apprendre à conjuguer être et avoir au présent de l'indicatif"
  },
  "lecon": [
    { "texte": "Le verbe être change avec la personne.", "exemples": ["je suis", "tu es"] }
  ],
  "exercices": [ { "type": "bulles", "...": "..." } ]
}
```

| Champ | Rôle |
|---|---|
| `matiere` | `francais`, `maths` ou `emc` |
| `niveau` | `CP`, `CE1`, `CE2`, `CM1` ou `CM2` |
| `ordre` | Position dans le **parcours** de la matière : une leçon s'ouvre quand la précédente est réussie |
| `programme.section` | Identifiant d'une section de `app/programmes-index.json` (généré par `scripts/index_programmes.py`) |
| `programme.citation` | Phrase recopiée mot pour mot du texte officiel |
| `lecon` | Étapes de la leçon, lues à voix haute par le guide avant les exercices |
| `exercices` | Liste d'exercices. L'enfant peut tous les faire à la suite, ou en choisir un |

## Types d'exercices

| `type` | Mécanique pour l'enfant | Données |
|---|---|---|
| `bulles` | Éclater la bonne bulle | `questions: [{question, choix[], reponse, aide?}]` |
| `classer` | Glisser chaque étiquette dans la bonne maison | `consigne, groupes: [{id, nom}], items: [{texte, groupe}]` |
| `dictee` | Écouter le mot, puis l'écrire avec des lettres à toucher | `mots: [{mot, phrase?}]` |
| `ordre` | Toucher les étiquettes dans le bon ordre | `consigne, elements[]` (dans l'ordre correct) |
| `trous` | Compléter un texte, trou par trou, avec des bulles | `consigne, texte` (mots à trouver entre crochets : `Au clair de la [lune]`), `distracteurs[]` |
| `conjugaison` | Choisir la bonne forme pour chaque personne | `verbe, temps, formes: [{pronom, forme}], distracteurs?[]` |
| `lecture` | Écouter un texte lu par le guide, puis répondre | `titre, texte, questions: [{question, choix[], reponse}]` |
| `memoriser` | Écouter vers par vers, remettre les vers dans l'ordre, retrouver les mots cachés | `titre, auteur?, vers[]` |
| `addition` | Poser l'addition dans les maisons, puis la calculer colonne par colonne | `operations: [[a, b], ...]` ou `generateur: {nombres, min, max, retenue}`, `etapes: ["poser", "calculer"]` |

Les réponses sont toujours vérifiées par l'application ; l'aide (`aide`) est lue par le guide après une erreur.

## Création à partir d'un texte (espace adulte)

1. L'adulte colle un texte (liste de mots, poésie, chanson, texte sur un métier, liste de verbes…), choisit le niveau et, s'il le souhaite, les types d'exercices.
2. L'application présélectionne les sections du programme les plus proches (mots en commun, niveau).
3. L'IA reçoit le texte, ces sections et ce format. Elle renvoie une leçon dont `programme.section` est l'une des sections fournies, et dont la citation est recopiée du texte officiel.
4. L'application vérifie la leçon (types connus, réponses présentes parmi les choix, section existante) avant de l'enregistrer.

Sans accès à l'IA, des générateurs locaux couvrent les cas simples : dictée (liste de mots), poésie ou chanson (vers), verbes (classement par groupe, conjugaison du présent pour le 1er groupe), et texte documentaire (lecture et texte à trous).
