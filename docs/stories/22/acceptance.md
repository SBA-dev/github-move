# Critères d'acceptance : issue #22, Mémoriser une poésie

Scénarios : `features/22-memoriser-une-poesie.feature` (tag `@issue-22`).
Modèle du domaine : `docs/stories/22/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique**, **Voix** et **Motivation**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#22 → Q56 à Q62 ; nouvelle question Q81).

## Objectif

En tant qu'**enfant**, je veux écouter une **poésie** ou une **chanson** **vers** par vers, la redire seul, puis m'entraîner à remettre les vers dans l'ordre et à retrouver les **mots cachés**, afin de l'apprendre par cœur.

L'exercice `memoriser` compose les mécaniques de #18 : l'ordre des vers (mécanique `ordre`) puis les mots cachés (mécanique `trous`, sans distracteurs). Chaque vers compte deux questions.

Comportement actuel (`app/`, `RUNNERS.memoriser`) repris comme premiers exemples. Écarts voulus, validés par le PO (voir « Décisions ») : « Ensuite, à toi de le redire ! » (Q58), mot caché sans l'article élidé (Q61), trois choix même pour une poésie courte (Q59), vers répétés interchangeables (Q56), plus de mention de l'enregistrement tant qu'il n'existe pas (Q81).

## Règles

Validation n°1 du lot 3 par le PO, le 2026-10-23 : « OK pour tout » (`docs/stories/lot-3-decisions.md` ; décisions `docs/decisions/0012-*` et `docs/decisions/0013-*`). Les propositions sont acceptées telles quelles : plus aucun scénario n'est `@a-valider`, et le comportement décrit n'a pas changé.

| # | Règle | Scénarios |
|---|---|---|
| 1 | La poésie est d'abord écoutée vers par vers, chaque vers mis en avant | La carte de la poésie montre son titre, son auteur et ses vers · Pour une <sorte>, le personnage guide annonce l'écoute vers par vers (2 cas : poésie, chanson) · Chaque vers est mis en avant et lu, dans l'ordre, avec le mot prononcé surligné |
| 2 | L'enfant redit seul la poésie, et l'entraînement ne commence que quand il est prêt | Pour une <sorte>, le personnage guide invite à <verbe> tout le texte (2 cas) · Rien ne commence tant que l'enfant n'a pas dit qu'il est prêt |
| 3 | Premier entraînement : remettre les vers dans l'ordre | « Je suis prêt » mène à l'ordre des vers · Les vers se remettent dans l'ordre comme les étiquettes d'un exercice ordre · Deux vers identiques sont interchangeables |
| 4 | Second entraînement : retrouver le mot caché de chaque vers | Après l'ordre des vers, des mots se sont envolés · Dans le vers « <vers> », le mot caché est « <mot caché> » (3 cas) · Le mot caché ne comprend pas l'article élidé · Un mot caché se retrouve parmi les autres mots cachés de la poésie · Un vers sans mot d'au moins 3 lettres n'a pas de mot caché et compte réussi · Une poésie de deux vers propose quand même trois choix pour chaque mot caché · Chaque vers compte deux questions dans l'avancement |
| 5 | La poésie se suit en mode dys et sur un petit écran | Avec le mode dys, les vers s'affichent en mode dys · La poésie tient dans un écran de 360 px de large |

Total : 5 règles, 17 scénarios (21 cas), aucun `@a-valider`. « Je ne sais pas » à l'ordre des vers suit l'exercice `ordre` (#23, Q66).

Droits d'accès : aucun scénario `@acces` (rien n'est écrit en base ; l'enregistrement de la voix de l'enfant est au lot 6).

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Chanson : Au clair de la lune | `fr-cp-chanson-clair-de-lune` | chanson (auteur « Chanson traditionnelle ») ; 8 vers, 16 questions ; mots cachés « clair », « Pierrot », « chandelle », « amour » (Q61) |
| Poésie : La Cigale et la Fourmi | `fr-cp-poesie-cigale` | poésie (Jean de La Fontaine) ; exercice « Le début de la fable », 6 vers, 12 questions |
| Poésies de test | — | vers répétés (« Picoti, picota » deux fois) ; vers sans mot de 3 lettres (« Il a vu. ») ; poésie de deux vers (« Le soleil brille », « Les oiseaux chantent ») |

## Hors périmètre

- Audio des poésies ajouté par un parent, étapes « redire vers par vers » et « texte masqué » (Q57), enregistrement de la voix de l'enfant : lot 6.
- Refus par le Catalogue d'une poésie de moins de deux vers (Q59, seconde partie) : tests du domaine et test de la bibliothèque.
- Erreurs de mémorisation notées pour les révisions (Q60) : invisibles au lot 3.
- La pause de 250 ms entre deux vers : détail d'interface.

## Décisions

Source : validation du PO du 2026-10-23 (`docs/stories/lot-3-decisions.md`). Chaque question reçoit pour réponse sa proposition.

56. *(#22 n°1)* **Vers répétés** interchangeables à l'ordre des vers ? **Décision** : oui (même règle que Q21). → « Deux vers identiques sont interchangeables ».
57. *(#22 n°2)* **Sans enregistrement** : pas d'étapes « redire vers par vers » ni « texte masqué » au lot 3 ? **Décision** : non au lot 3 (parité). Pas de scénario.
58. *(#22 n°3)* **« Ensuite, tu le redis avec moi ! »** devient « Ensuite, à toi de le redire ! » (« chanter » pour une chanson) ? **Décision** : oui. → plan « Pour une <sorte>, le personnage guide annonce l'écoute vers par vers ».
59. *(#22 n°4)* **Poésie courte** : choix complétés par d'autres mots de la poésie pour en avoir trois ; poésie de moins de deux vers refusée ? **Décision** : oui pour les deux. → « Une poésie de deux vers propose quand même trois choix… ».
60. *(#22 n°5)* **Erreurs de mémorisation** gardées comme toutes les questions ratées, le lot 4 décide ? **Décision** : oui. Pas de scénario.
61. *(#22 n°6)* **Mot caché** : le plus long d'au moins 3 lettres, sans l'article élidé (« amour » plutôt que « l'amour ») ? **Décision** : oui. → « Le mot caché ne comprend pas l'article élidé ».
62. *(#22 n°7)* **Glossaire** : vers, mot caché, poésie, chanson ; « poème » mot d'interface ? **Décision** : oui.

Question née des scénarios :

81. **Phrase « À toi ! »** : au lot 3, l'enregistrement de lecture n'existe pas encore (lot 6). Faut-il retirer « Tu peux t'enregistrer pour te réécouter. » de « À toi ! Redis tout le texte, tranquillement. Tu peux t'enregistrer pour te réécouter. Quand c'est bon, on joue ! » tant qu'il n'y a pas de bouton d'enregistrement ? Même question pour le bouton « Je la lis à voix haute et je m'enregistre » de la lecture (#17). **Décision** : oui, on ne mentionne pas ce que l'enfant ne peut pas faire ; la phrase complète revient au lot 6. → plan « Pour une <sorte>, le personnage guide invite à <verbe> tout le texte ».

## Questions ouvertes

Aucune.
