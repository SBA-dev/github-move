# Critères d'acceptance : issue #23, Aide et « Je ne sais pas »

Scénarios : `features/23-aide-et-je-ne-sais-pas.feature` (tags `@issue-23 @wip`).
Modèle du domaine : `docs/stories/23/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique** et **Motivation**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#23 → Q63 à Q68).

## Objectif

En tant qu'**enfant**, je veux être aidé quand je me trompe, et pouvoir dire « **Je ne sais pas** », afin d'apprendre sans avoir peur de l'erreur.

Story porteuse des règles communes de l'erreur : **nouvelle chance** sans limite, **aide** de la question puis **aide par défaut** du type, « Je ne sais pas » et **bonne réponse montrée**, compte des erreurs d'une question (utilisé par #24 pour les étoiles). Les textes d'aide propres à chaque type sont vérifiés dans #17 à #22. Principe de `CLAUDE.md` : un retour d'erreur n'est jamais punitif.

Comportement actuel (`app/`, `choose`, `keypad`, `RUNNERS`) repris comme premiers exemples. Écarts voulus, en question ouverte : « Je ne sais pas » n'ajoute rien à une question qui a déjà coûté une erreur (Q64), plus d'erreur après la bonne réponse montrée au clavier (Q65), « Je ne sais pas » dans la dictée, classer, ordre et l'étape poser (Q66).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Après une erreur, le personnage guide encourage, lit l'aide, et l'enfant a une nouvelle chance | Après une erreur, le personnage guide encourage puis lit l'aide de la question · Sans aide de la question, le personnage guide lit l'aide par défaut du type d'exercice · La nouvelle chance n'a pas de limite |
| 2 | « Je ne sais pas » montre la bonne réponse, et l'enfant la donne lui-même | Avec les choix, « Je ne sais pas » ne laisse que la bonne réponse, qui brille · Sans aide, « Je ne sais pas » dit seulement que la bonne réponse brille · Après « Je ne sais pas », la question n'est réussie que quand l'enfant donne la bonne réponse · Au clavier de cristaux, « Je ne sais pas » dit la réponse à taper · La bonne réponse montrée est annoncée en texte, sans dépendre de la couleur ni du mouvement |
| 3 | « Je ne sais pas » se dit au plus une fois par question, là où l'exercice le permet | Après « Je ne sais pas », il n'est plus proposé pour cette question · « Je ne sais pas » est de nouveau proposé à la question suivante · « Je ne sais pas » est proposé dans un exercice <type> (9 cas) · La fluence ne propose pas « Je ne sais pas » · « Je ne sais pas » dans un exercice <type> : <ce qui est montré> (4 cas : classer, ordre, étape poser, dictée ; `@a-valider` Q66) |
| 4 | Une réponse fausse coûte une erreur ; « Je ne sais pas » en coûte une, sauf si la question a déjà coûté une erreur | « Je ne sais pas » compte une erreur (`@a-valider` Q63) · « Je ne sais pas » après deux erreurs n'ajoute pas d'erreur à la question (`@a-valider` Q64) · Après « Je ne sais pas » au clavier de cristaux, une faute de frappe ne coûte pas d'erreur (`@a-valider` Q65) |
| 5 | « Je ne sais pas » s'utilise du doigt, au clavier et en mode dys | « Je ne sais pas » se touche du doigt sur un écran de 360 px de large · « Je ne sais pas » se choisit au clavier · Avec le mode dys, l'aide lue s'affiche en mode dys |

Total : 5 règles, 19 scénarios (30 cas), dont 4 `@a-valider`.

Droits d'accès : aucun scénario `@acces` (rien n'est écrit en base).

Observation du compte des erreurs : au lot 3, l'enfant ne voit ses erreurs qu'à travers ses **étoiles** (#24 : 3 sans erreur, 2 de 1 à 3, 1 au-delà). Les scénarios de la règle 4 sont donc construits pour que la règle proposée et le comportement actuel donnent un nombre d'étoiles **différent** :
- Q63 : une question, « Je ne sais pas » puis la bonne réponse → 2 étoiles (proposition) ; 3 si « Je ne sais pas » ne comptait pas.
- Q64 : deux erreurs puis « Je ne sais pas » (2 erreurs), puis une erreur à la seconde question → 3 erreurs, 2 étoiles ; le legacy en compte 4, donc 1 étoile.
- Q65 : « Je ne sais pas », une faute de frappe, la bonne réponse (1 erreur), puis deux erreurs au second calcul → 3 erreurs, 2 étoiles ; le legacy en compte 4, donc 1 étoile.

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Dictée : les animaux | `fr-cp-dictee-animaux` | bulles « Le mot bien écrit » : « Quel mot est bien écrit ? » (réponse « chat », aide « Pense à la lettre muette, comme dans chaton. ») |
| Les doubles | `ma-cp-doubles` | fluence « Calcul rapide : les doubles », sans « Je ne sais pas » |
| Leçons de test | — | bulles « Combien font 3 + 4 ? » sans aide ; calcul CE1 « 12 − 5 » (avec et sans l'aide « Pars de 12 et recule de 5. ») ; une leçon par type pour la présence de « Je ne sais pas » ; leçons d'une ou deux questions à quatre choix, ou de deux calculs, pour le compte des erreurs |

Profils : Léa (CP) et Tom (CE1), univers « Animaux de la forêt ».

## Hors périmètre

- Textes d'aide propres à chaque type : #17 (écoute), #18 (classer, ordre, trous), #19 (dictée, conjugaison), #20 (calcul, addition posée), #21 (boîte, barres).
- Réduction à deux choix après deux erreurs : #17.
- Questions ratées gardées pour les révisions : lot 4. « Tu peux dire « Je ne sais pas », c'est permis ! » du test de départ : lot 4.

## Questions ouvertes

63. *(#23 n°1)* **« Je ne sais pas » compte-t-il une erreur pour les étoiles ?** **Proposition** : oui, une erreur. → « « Je ne sais pas » compte une erreur ».
64. *(#23 n°2)* **Une question peut coûter plusieurs erreurs** (une par réponse fausse), mais « Je ne sais pas » n'ajoute rien si elle a déjà coûté une erreur ? **Proposition** : oui. → « « Je ne sais pas » après deux erreurs n'ajoute pas d'erreur à la question ».
65. *(#23 n°3)* **Après « Je ne sais pas » au clavier**, une faute de frappe ne compte plus ? **Proposition** : non, elle ne compte pas. → « Après « Je ne sais pas » au clavier de cristaux, une faute de frappe ne coûte pas d'erreur ».
66. *(#23 n°4)* **« Je ne sais pas » partout** : classer et poser (la bonne maison ou colonne brille), ordre (l'étiquette suivante brille), dictée (la lettre juste suivante s'écrit, jamais le mot entier) ? **Proposition** : oui ; sinon, parité stricte et retour après la beta. → plan « « Je ne sais pas » dans un exercice <type> : <ce qui est montré> ».
67. *(#23 n°5)* **`aide` facultative** sur les items de classer, barres et écoute, dans le format ? **Proposition** : oui. → #18 « L'aide d'une étiquette passe avant l'aide par défaut », #21 « Après une erreur, l'aide du problème est lue ».
68. *(#23 n°6)* **Glossaire** : Aide, Je ne sais pas, Nouvelle chance, Aide par défaut, Bonne réponse montrée ? **Proposition** : oui (à valider).

## Décisions

Aucune pour l'instant : la validation des scénarios du lot 3 est attendue.
