# Critères d'acceptance : issue #21, Boîte à jetons et schéma en barres

Scénarios : `features/21-boite-et-barres.feature` (tags `@issue-21 @wip`).
Modèle du domaine : `docs/stories/21/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique** et **Motivation**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#21 → Q49 à Q55).

## Objectif

En tant qu'**enfant**, je veux prévoir combien de **jetons** sont cachés dans une **boîte à jetons**, et résoudre un problème à l'aide d'un **schéma en barres**, afin de passer du comptage au calcul et de comprendre ce qu'on cherche dans un problème (guide fondamental « Pour enseigner les nombres, le calcul et la résolution de problèmes au CP »).

Les deux types utilisent le **mode de réponse** et le clavier de cristaux de #20, la question jouée de #17, l'aide et « Je ne sais pas » de #23. Le Catalogue calcule la réponse et l'**écriture du calcul** de chaque item ; Apprentissage ne lit jamais la **valeur cherchée** (`null`) du format.

Comportement actuel (`app/`, `RUNNERS.boite`, `RUNNERS.barres`) repris comme premiers exemples. Écarts voulus, en question ouverte : aides par défaut propres à la comparaison et aux parts (Q49), description du schéma pour les lecteurs d'écran (Q55), `aide` et `phrase` des items de barres dans le format (Q50).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Boîte à jetons : des jetons entrent ou sortent d'une boîte fermée, et l'enfant prévoit combien il y en a | Des jetons entrent dans la boîte, puis elle se ferme · Des jetons sortent de la boîte · La bonne réponse <réponse> ouvre la boîte et donne l'écriture du calcul (3 cas) · Après une erreur à « <a> <signe> <b> », le personnage guide dit « <aide> » (3 cas) |
| 2 | Au CP, une réponse de 20 au plus se donne par choix ; sinon, au clavier de cristaux | <enfant> répond à un résultat de <résultat> <mode> (5 cas : 7, 0, 20, 24 au CP ; 7 au CE1 ; `@a-valider` Q51) |
| 3 | Schéma en barres : le « ? » montre la valeur cherchée, et la bonne réponse donne l'écriture du calcul | L'énoncé du problème est lu, puis le schéma est expliqué · Problème « <énoncé> » : la réponse <réponse> donne « <explication> » (8 cas : parties et tout, comparaison, parts, chaque valeur cherchée) · Après une erreur, l'aide du problème est lue (`@a-valider` Q50) · Sans aide, un problème de <forme> donne l'aide par défaut de sa forme (3 cas, `@a-valider` Q49) |
| 4 | La boîte et le schéma se comprennent aussi sans les voir, et sans mouvement | Le schéma en barres de <forme> est décrit aux lecteurs d'écran (3 cas, `@a-valider` Q55) · Avec les mouvements réduits, la boîte s'ouvre sans animation · La boîte et le schéma tiennent dans un écran de 360 px de large |

Total : 4 règles, 12 scénarios (31 cas), dont 4 `@a-valider`.

Droits d'accès : aucun scénario `@acces` (rien n'est écrit en base).

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| La boîte à jetons : ajouter | `ma-cp-boite-ajouter` | « 4 + 3 » → 7, « 6 + 4 » → 10, « 2 + 7 » (aide « Mets 7 dans ta tête, et avance de 2. ») |
| La boîte à jetons : retirer | `ma-cp-boite-retirer` | « 8 − 3 » → 5 (aide « Pars de 8 et recule de 3. ») |
| Problèmes : le tout et les parties | `ma-cp-parties-tout` | tout cherché (4 + 2 = 6, phrase « J'ai 6 pommes. ») ; partie cherchée (9 − 6 = 3, avec aide) ; « 5 filles et 3 garçons » sans aide |
| Problèmes : combien de plus ? | `ma-cp-comparaison` | écart (43 − 37 = 6), grand (9 + 4 = 13), petit (15 − 6 = 9) |
| Plusieurs fois, partager | `ma-cp-fois-partage` | total (4 × 5 = 20), valeur d'une part (12 = 3 × 4, avec aide), nombre de parts (18 = 6 × 3) |
| Leçons de test | — | boîtes « 7 − 7 », « 12 + 8 », « 15 + 9 » pour le seuil du mode de réponse |

Profils : Léa (CP) et Tom (CE1), univers « Animaux de la forêt ».

## Hors périmètre

- Refus par le Catalogue d'un item impossible (retrait plus grand que le contenu, aucune ou plusieurs valeurs cherchées, division non exacte) : tests du domaine et test de la bibliothèque.
- Boîte à jetons en révision (Q52) : lot 4.
- Le dessin exact des jetons (rangées de 5) et des barres : vérifié seulement par le nombre de jetons et la proportion des barres.

## Questions ouvertes

49. *(#21 n°1)* **Aides par défaut** : comparaison « Regarde le schéma : cherches-tu la grande barre, la petite, ou l'écart entre les deux ? » ; parts « Regarde le schéma : cherches-tu le total, la valeur d'une part, ou le nombre de parts ? » ; parties et tout inchangée ? **Proposition** : oui. → plan « Sans aide, un problème de <forme>… ».
50. *(#21 n°2)* **`aide` et `phrase` des items de barres** dans le format ? **Proposition** : oui, facultatives. → « Après une erreur, l'aide du problème est lue » (et la phrase « J'ai 6 pommes. »).
51. *(#21 n°3)* **Seuil « CP et 20 au plus »** pour répondre par choix ? **Proposition** : oui. → plan du mode de réponse.
52. *(#21 n°4)* **Boîte en révision** : rejouer la boîte ? **Proposition** : oui, à confirmer au lot 4. Pas de scénario.
53. *(#21 n°5)* **Glossaire** : boîte à jetons, schéma en barres, jeton, valeur cherchée ? **Proposition** : oui.
54. *(#21 n°6)* **« Énoncé du problème »** pour le texte d'un schéma en barres, « énoncé » seul interdit ? **Proposition** : oui. Les scénarios disent « le problème « … » » et « l'énoncé du problème ».
55. *(#21 n°7)* **Description du schéma** : « Le tout : ?. Une partie : 4. L'autre partie : 2. », « `<nom 1>` : ?. `<nom 2>` : 9. L'écart : 4. », « Le total : 12. 3 parts. Chaque part : ? » ? **Proposition** : oui. → plan « Le schéma en barres de <forme> est décrit aux lecteurs d'écran ».

## Décisions

Aucune pour l'instant : la validation des scénarios du lot 3 est attendue.
