# Format d'une leçon

Chaque leçon est un objet JSON. La même structure sert pour :

- la **bibliothèque** préparée à partir des programmes officiels (`app/bibliotheque.json`) ;
- les **leçons personnelles**, créées par un parent à partir de son propre texte (générées par l'IA, ou par les générateurs locaux de l'application).

Le moteur affiche n'importe quelle leçon dans l'univers choisi par l'enfant (princesses, animaux, sports, police, pompiers, danse). L'univers ne change que l'habillage : le personnage guide, le décor et les récompenses. Le contenu pédagogique reste identique.

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
| `matiere` | `francais`, `maths`, `sciences`, `histoire` (histoire et géographie), `anglais` ou `emc` |
| `niveau` | `CP`, `CE1`, `CE2`, `CM1` ou `CM2` |
| `ordre` | Position dans le **parcours** de la matière : une leçon s'ouvre quand la précédente est réussie |
| `programme.section` | Identifiant d'une section de `app/programmes-index.json` (généré par `scripts/index_programmes.py`) |
| `programme.citation` | Phrase recopiée mot pour mot du texte officiel |
| `lecon` | Étapes de la leçon, lues à voix haute par le personnage guide avant les exercices |
| `exercices` | Liste d'exercices. L'enfant peut tous les faire à la suite, ou en choisir un |
| `competence` | Facultatif : le nom du badge gagné avec 2 étoiles (« Je connais les tables de 3 et de 4 ») |
| `guide` | Facultatif : `{titre, page, extrait, fichier}`, le passage d'un guide fondamental d'Eduscol sur lequel s'appuie la leçon (vérifié mot pour mot par le script, voir ci-dessous) |

## Types d'exercices

| `type` | Mécanique pour l'enfant | Données |
|---|---|---|
| `bulles` | Éclater la bonne bulle | `questions: [{question, choix[], reponse, aide?}]` |
| `classer` | Glisser chaque étiquette dans la bonne maison | `consigne, groupes: [{id, nom}], items: [{texte, groupe, aide?}]` ; `aide?` est lue après une erreur sur cette étiquette ; 20 étiquettes au plus |
| `dictee` | Écouter le mot, puis l'écrire avec des lettres à toucher | `mots: [{mot, phrase?}]` |
| `ordre` | Toucher les étiquettes dans le bon ordre | `consigne, elements[]` (dans l'ordre correct, 20 éléments au plus) |
| `trous` | Compléter un texte, trou par trou, avec des bulles | `consigne, texte` (mots à trouver entre crochets : `Au clair de la [lune]`), `distracteurs[]` ; chaque trou doit proposer au moins deux choix : le mot attendu et un autre mot différent (distracteur ou autre mot attendu du texte), sinon le build échoue |
| `conjugaison` | Choisir la bonne forme pour chaque personne | `verbe, temps, formes: [{pronom, forme}], distracteurs?[]` |
| `lecture` | Écouter un texte lu par le personnage guide, puis répondre | `titre, texte, questions: [{question, choix[], reponse, aide?}]` |
| `memoriser` | Écouter vers par vers, remettre les vers dans l'ordre, retrouver les mots cachés | `titre, auteur?, vers[]` |
| `addition` | Poser l'addition dans les maisons, puis la calculer colonne par colonne | `operations: [[a, b], ...]` ou `generateur: {nombres, min, max, retenue}`, `etapes: ["poser", "calculer"]` |
| `calcul` | Calculer, avec le clavier de cristaux (bulles au CP) | `operations: [{q: "12 − 5", r: 7, aide?}]` ou `generateur: {op: "+"\|"-"\|"×"\|":"\|"complement", a: [min, max], b: [min, max], combien, cible?}` |
| `fluence` | Calcul rapide chronométré, avec un record personnel | `duree` (secondes), `generateur` (comme `calcul`) |
| `ecoute` | Écouter un mot ou une phrase dite par une voix anglaise, puis choisir sa traduction | `langue?` (défaut `"en-GB"`), `items: [{dire, question?, choix[], reponse, aide?}]` ; sans `question`, le personnage guide dit « Écoute bien ! Que veut dire ce mot ? » |
| `boite` | La boîte à jetons : des jetons entrent (ou sortent) d'une boîte fermée, l'enfant prévoit combien il y en a, puis on ouvre pour vérifier | `items: [{a, op?: "+"\|"-", b}]` ; `op` absent vaut `"+"` (ajout) ; `a` et `b` sont des entiers positifs ou nuls ; un retrait ne peut pas dépasser le contenu (`b ≤ a` quand `op` vaut `"-"`) ; au moins un item |
| `barres` | Problème illustré par un schéma en barres ; le « ? » montre ce qu'on cherche | `items: [{enonce, aide?, phrase?, …}]`, dont la forme se choisit par `type` : absent = parties et tout (`parties: [a, b], tout`) ; `"comparaison"` (`grand, petit, ecart, noms: [nom, nom]`) ; `"parts"` (`nb, valeur, total`). **Exactement une** valeur `null` par item : c'est la valeur cherchée. Les nombres sont des entiers positifs ou nuls, `parties` en compte deux. La valeur cherchée doit être positive ou nulle (tout ≥ partie connue ; grand ≥ petit ; grand ≥ écart) ; pour `parts`, la division doit être exacte et le diviseur non nul. `aide?` est lue après une erreur (sinon l'aide par défaut de la forme) ; `phrase?` est dite après la bonne réponse, `{r}` y étant remplacé par la réponse ; au moins un item |

Les réponses sont toujours vérifiées par l'application ; l'aide (`aide`) est lue par le personnage guide après une erreur, ou quand l'enfant touche « Je ne sais pas ».

Pour une dictée, les mots dictés n'apparaissent jamais à l'écran pendant l'exercice avant d'être bien écrits : ils sont seulement dits à voix haute. Ils peuvent en revanche figurer dans les étapes et les exemples de la leçon, comme une dictée préparée en classe (#19, décision du PO n°11).

## La bibliothèque

`app/bibliotheque.json` est construite par `scripts/build_bibliotheque.py` à partir des leçons écrites dans `scripts/lecons/` (un fichier par matière), après `scripts/index_programmes.py` :

```sh
python3 scripts/index_programmes.py      # sections des programmes -> app/programmes-index.json
python3 scripts/build_bibliotheque.py    # leçons -> app/bibliotheque.json
```

La citation du programme n'est jamais tapée à la main : le script choisit, dans le texte officiel de la section, la phrase lisible qui contient les mots-clés de la leçon, ou vérifie que le passage choisi (`citation_exacte`) figure mot pour mot dans ce texte. Il s'arrête si une section n'existe pas, ne couvre pas le niveau, ou si une réponse ne fait pas partie des choix. Les leçons écrites directement dans `bibliotheque.json` (sans `"genere": true`) sont conservées telles quelles.

Les leçons peuvent aussi s'appuyer sur un guide fondamental d'Eduscol (`sources/guides/`, texte extrait dans `sources/texte/guides/`) : le paramètre `guide=(clé, passage)` vérifie que le passage figure mot pour mot dans le guide et retrouve sa page. Les mathématiques du CP (`scripts/lecons/maths_cp.py`) suivent ainsi la progression du guide « Pour enseigner les nombres, le calcul et la résolution de problèmes au CP ».

Certains programmes (cycle 2 surtout) sont des tableaux à deux colonnes dans le PDF : leur texte extrait mélange parfois les deux colonnes. C'est pourquoi le script écarte les phrases où deux colonnes se mélangent, et pourquoi quelques leçons donnent un passage choisi à la main.

## Création à partir d'un texte (espace parent)

1. Le parent colle un texte (liste de mots, poésie, chanson, texte sur un métier, liste de verbes…), choisit le niveau et, s'il le souhaite, les types d'exercices.
2. L'application présélectionne les sections du programme les plus proches (mots en commun, niveau).
3. L'IA reçoit le texte, ces sections et ce format. Elle renvoie une leçon dont `programme.section` est l'une des sections fournies, et dont la citation est recopiée du texte officiel.
4. L'application vérifie la leçon (types connus, réponses présentes parmi les choix, section existante) avant de l'enregistrer.

Sans accès à l'IA, des générateurs locaux couvrent les cas simples : dictée (liste de mots), poésie ou chanson (vers), verbes (classement par groupe, conjugaison du présent pour le 1er groupe), et texte documentaire (lecture et texte à trous).
