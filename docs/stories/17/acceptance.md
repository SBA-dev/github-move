# Critères d'acceptance : issue #17, Exercices à choix (bulles, lecture, écoute)

Scénarios : `features/17-exercices-a-choix.feature` (tags `@issue-17 @wip`).
Modèle du domaine : `docs/stories/17/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique**, **Motivation**, **Voix** et **Famille**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#17 → Q11 à Q20).

## Objectif

En tant qu'**enfant**, je veux répondre à une **question** en choisissant la bonne réponse parmi des **choix**, après avoir lu la question, écouté une histoire (exercice `lecture`) ou un **mot à écouter** en anglais (exercice `ecoute`), afin de vérifier que j'ai compris.

Story porteuse de la **question jouée**, de la **réponse** (juste ou fausse), de l'**erreur** et des **choix proposés** (dédoublonnés, mélangés, **choix écartés**, réduits à deux). La même mécanique sert à `trous`, `conjugaison` (#18, #19), aux calculs du CP (#20, #21) et aux mots cachés (#22).

Comportement actuel (`app/`, `choose`, `RUNNERS.bulles`, `lecture`, `ecoute`) repris comme premiers exemples. Écarts voulus, en question ouverte : félicitation lue en entier (Q11), texte de lecture gardé à l'écran (Q12), encouragement de l'écoute entendu en entier (Q13), message de l'écoute sans son (Q14). L'introduction de la lecture est dite en entier avant le texte : défaut du legacy corrigé (une lecture à la fois, #7).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | La question est lue, puis ses choix apparaissent, mélangés et sans doublon | Les choix apparaissent quand la question a été lue · Les choix sont proposés dans l'ordre tiré au début de la séance · Un choix écrit deux fois n'est proposé qu'une fois · « a » et « à » sont deux choix différents (`@a-valider` Q18) · L'enfant peut réécouter la question |
| 2 | Le bon choix réussit la question, et la question suivante vient après la félicitation | La réponse « <réponse> » à « <question> » est juste (4 cas : bulles et lecture) · La félicitation est dite en entier avant la question suivante (`@a-valider` Q11) |
| 3 | Un mauvais choix coûte une erreur, il est écarté, et l'enfant a une nouvelle chance | La réponse « <réponse> » … est écartée (2 cas) · Toucher de nouveau un choix écarté ne coûte pas une seconde erreur · Après deux erreurs sur la même question, il reste deux choix possibles, dont le bon (`@a-valider` Q15, Q20) · Après une erreur, la bonne réponse réussit encore la question |
| 4 | Avec « tout lire à voix haute », les choix sont lus après la question | Avec « tout lire à voix haute », Noisette lit les choix dans l'ordre affiché · Sans « tout lire à voix haute », les choix ne sont pas lus |
| 5 | Lecture : le texte est lu avec le mot surligné, puis l'enfant répond aux questions | L'histoire est présentée, puis lue avec le mot prononcé surligné · « J'ai écouté » mène à la première question · Le texte de lecture reste affiché pendant les questions (`@a-valider` Q12) |
| 6 | Écoute : le mot à écouter est dit par une voix anglaise, et il n'est jamais écrit | La question est lue, puis le mot à écouter est dit par la voix anglaise · Sans question, l'écoute pose la question par défaut · « Écouter » redit le mot à écouter · La bonne réponse est expliquée après la félicitation · Après une erreur, l'encouragement est entendu en entier, puis le mot est redit (`@a-valider` Q13) · En Muet, l'écoute prévient l'enfant qu'elle a besoin du son (`@a-valider` Q14) |
| 7 | Les exercices à choix s'utilisent en mode dys, au clavier et sur un petit écran | Avec le mode dys, la question et les choix s'affichent en mode dys · Au clavier, Léa répond sans souris · Les choix tiennent dans un écran de 360 px de large et se touchent du doigt |

Total : 7 règles, 25 scénarios (29 cas), dont 6 `@a-valider`. L'aide lue après une erreur et « Je ne sais pas » sont dans #23.

Droits d'accès : aucun scénario `@acces` (rien n'est écrit en base ; les réponses restent dans la séance).

Observation du compte des erreurs : un choix écarté touché de nouveau ne coûte rien. Sans écran qui montre les erreurs au lot 3, le scénario le vérifie par ses effets : les quatre choix restent sauf celui qui est écarté (une seconde erreur réduirait à deux choix).

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Les sons ou, on, an | `fr-cp-sons-ou-on-an` | bulles « Quel son entends-tu ? » (« poule » → « ou », « mouton » → « on ») |
| Les syllabes | `fr-cp-syllabes` | « Combien de syllabes dans « chat » ? » → « 1 » |
| Dictée : les animaux | `fr-cp-dictee-animaux` | bulles « Quel mot est bien écrit ? » → « chat » |
| Lecture : Le petit chat Plume | `fr-cp-lecture-petit-chat` | texte lu, « De quelle couleur est Plume ? », « Où dort Plume ? » |
| Les animaux | `an-cp-animaux` | écoute « Quel animal ? » : « a cat » → « un chat » |
| Questions de test | — | « Combien font 3 + 4 ? » (choix « 6 », « 7 », « 8 », « 9 », réponse « 7 ») ; « Combien font 1 + 1 ? » (choix « 2 », « 2 », « 3 ») ; « Il … un vélo. » (choix « a », « à », « a ») ; item d'écoute « a dog » sans question |

L'ordre des choix est fixé par le port `Hasard` (« l'ordre des choix tiré au début de la séance est … »). Le mélange lui-même est vérifié par les tests unitaires.

## Hors périmètre

- Aide après une erreur, « Je ne sais pas », compte exact des erreurs : #23.
- Enregistrement de lecture (« Je la lis à voix haute et je m'enregistre ») : lot 6 (voir Q81, #22).
- Révisions des questions ratées : lot 4 (la séance garde seulement les questions qui ont eu une erreur).
- Les durées (300 ms avant la lecture des choix, 420 ms après une bonne bulle, 1,2 s avant le texte) : détail d'interface.

## Questions ouvertes

11. *(#17 n°1)* **Bulles** : la félicitation est-elle lue jusqu'au bout avant la question suivante ? **Proposition** : oui. → « La félicitation est dite en entier avant la question suivante ».
12. *(#17 n°2)* **Lecture** : le texte reste-t-il affiché au-dessus des questions ? **Proposition** : oui. → « Le texte de lecture reste affiché pendant les questions ».
13. *(#17 n°3)* **Écoute** : l'encouragement en entier, puis le mot ? **Proposition** : oui. → « Après une erreur, l'encouragement est entendu en entier… ».
14. *(#17 n°4)* **Écoute sans son** : « Pour écouter l'anglais, j'ai besoin du son : active-le avec le bouton ci-dessous. » et « Activer le son » ? **Proposition** : oui. → « En Muet, l'écoute prévient l'enfant… ».
15. *(#17 n°5)* **Après deux erreurs**, les choix écartés restent visibles, pâles ? **Proposition** : oui. → « Après deux erreurs… ».
16. *(#17 n°6)* `aide` facultative pour les items d'écoute et les questions de lecture ; `consigne` retirée du moteur ? **Proposition** : oui (même réponse que Q67). Pas de scénario propre.
17. *(#17 n°7)* « Bulle », « carte de la question » : termes d'interface ? **Proposition** : oui. Les scénarios disent « choix » et « question ».
18. *(#17 n°8)* **« a » et « à »** : deux choix différents (texte exact) ? **Proposition** : oui. → « « a » et « à » sont deux choix différents ».
19. *(#17 n°9)* **Lecture** : l'aide après erreur reste « Essaie une autre bulle. » ? **Proposition** : oui, tant que Q16 n'est pas livrée. Pas de scénario propre (l'aide par défaut est vérifiée sur les bulles, #23).
20. *(#17 n°10)* **Réduction à deux** : le choix gardé avec le bon est le premier non écarté dans l'ordre affiché ? **Proposition** : oui. → « Après deux erreurs… » (« 6 » et « 7 » restent quand « 8 » et « 9 » sont écartés).

## Décisions

Aucune pour l'instant : la validation des scénarios du lot 3 est attendue.
