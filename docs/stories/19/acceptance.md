# Critères d'acceptance : issue #19, Dictée et conjugaison

Scénarios : `features/19-dictee-et-conjugaison.feature` (tags `@issue-19 @wip`).
Modèle du domaine : `docs/stories/19/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique**, **Famille**, **Voix** et **Motivation**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#19 → Q30 à Q36).

## Objectif

En tant qu'**enfant**, je veux écrire les **mots dictés** que mon personnage guide me dit, et choisir la bonne forme d'un verbe pour chaque personne, afin d'apprendre l'orthographe et la conjugaison.

Deux types : la **dictée** (nouvelle mécanique : un mot écrit case par case, corrigé quand la dernière case est remplie, avec le **clavier des dictées** réglé par le parent) et la **conjugaison** (choix de #17, une question par personne).

Comportement actuel (`app/`, `RUNNERS.dictee`, `RUNNERS.conjugaison`, `AZERTY`) repris comme premiers exemples. Écarts voulus, en question ouverte : majuscules ignorées (Q30), « œ » au clavier complet (Q31).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Le mot dicté est seulement dit à voix haute, et il n'est montré qu'une fois bien écrit | Le mot dicté est dit avec sa phrase d'exemple, sans être écrit · Léa peut <demande> (2 cas : réécouter, plus lentement) · Le mot bien écrit est montré et félicité · Les espaces, apostrophes, tirets et points d'un mot dicté sont déjà écrits |
| 2 | Le mot est corrigé dès que sa dernière case est remplie, et le début juste est gardé | Le mot est corrigé sans qu'il faille valider (`@a-valider` Q33) · Un mot mal écrit montre les lettres fausses, et le début juste est gardé · Un mot mal écrit coûte une seule erreur, quel que soit le nombre de lettres fausses · La correction ne tient pas compte des majuscules (`@a-valider` Q30) |
| 3 | Le clavier proposé dépend du réglage clavier des dictées et du niveau de l'enfant | Avec « <réglage> » au <niveau>, la dictée propose <clavier> (6 cas) · Les lettres du mot « <mot> » sont proposées avec <intruses> lettres en plus (3 cas) · Avec les lettres du mot, chaque touche ne sert qu'une fois, et « Effacer » la rend · Le clavier complet propose « œ » (`@a-valider` Q31) |
| 4 | Conjugaison : une forme par personne, dans l'ordre du tableau, choisie parmi trois | Le verbe et le temps sont annoncés, puis la première personne est demandée · La bonne forme s'écrit dans le tableau sans félicitation (`@a-valider` Q34) · Une mauvaise forme est écartée et le personnage guide rappelle la personne · À la dernière personne, le personnage guide félicite pour le verbe |
| 5 | Sans son, la dictée prévient l'enfant au lieu de dicter | En Muet, la dictée demande d'activer le son · Sur un navigateur qui ne sait pas lire à voix haute, la dictée se fait avec un adulte |
| 6 | La dictée s'utilise au clavier et sur un petit écran | Sur un ordinateur, Léa écrit le mot dicté avec le clavier · Le clavier complet tient dans un écran de 360 px de large |

Total : 6 règles, 20 scénarios (28 cas), dont 4 `@a-valider`. « Je ne sais pas » en dictée (la lettre juste suivante s'écrit) : #23, Q66.

Droits d'accès : aucun scénario `@acces`. Le réglage clavier des dictées est lu dans Famille, dont les droits sont couverts par #12.

Note pour l'interface : à 360 px, dix touches de 44 px ne tiennent pas sur une rangée ; les rangées du clavier complet se replient pour garder des touches de 44 px sans défilement horizontal.

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Dictée : les animaux | `fr-cp-dictee-animaux` | dictée « J'écris les animaux » : « chat » (« Le chat dort sur le lit. »), « lapin », « souris » |
| Être et avoir au présent | `fr-cp-etre-avoir` | conjugaison « Le verbe être » (« je suis » … « ils sont ») |
| Leçons de test | — | mots dictés « arc-en-ciel » (8 cases, 2 tirets déjà écrits), « Paris », « chat » seul (une seule question, pour les étoiles) |

Nombre de lettres intruses avec les lettres du mot : `min(3, max(2, 8 − nombre de lettres))` ; « chat » → 3 (7 touches), « lapin » → 3 (8 touches), « souris » → 2 (8 touches).

## Hors périmètre

- Mots de la semaine (devoir qui prépare une dictée) : lot 6.
- Durées (lettres en rouge 1,3 s, pause de 700 ms) et vitesse exacte de la voix lente (0,65 × 0,9) : détail d'interface et de Voix.
- Révisions des mots ratés : lot 4.

## Questions ouvertes

30. *(#19 n°1)* **Dictée : majuscules** : la correction les ignore, et les touches montrent les minuscules ? **Proposition** : oui. → « La correction ne tient pas compte des majuscules ».
31. *(#19 n°2)* **Clavier complet** : ajouter « œ » seulement ? **Proposition** : oui. → « Le clavier complet propose « œ » ».
32. *(#19 n°3)* **Dictée : « Je ne sais pas »** ? **Proposition** : voir Q66 (la lettre juste suivante s'écrit, le mot n'est jamais montré en entier).
33. *(#19 n°4)* **Correction automatique**, sans bouton « Valider » ? **Proposition** : oui, comme aujourd'hui. → « Le mot est corrigé sans qu'il faille valider ».
34. *(#19 n°5)* **Conjugaison** : pas de félicitation à chaque personne, humeur « applaudit » à chaque bonne forme ? **Proposition** : oui. → « La bonne forme s'écrit dans le tableau sans félicitation ».
35. *(#19 n°6)* « Lettres du mot » et « clavier complet » valeurs du réglage ; « lettre intruse » terme d'interface ? **Proposition** : oui. Les scénarios disent « lettres absentes du mot ».
36. *(#19 n°7)* **Phrase d'exemple** : peut contenir le mot dicté (jamais affichée) ? **Proposition** : oui. Exemple : « Le chat dort sur le lit. » dans le premier scénario.

## Décisions

Aucune pour l'instant : la validation des scénarios du lot 3 est attendue.
