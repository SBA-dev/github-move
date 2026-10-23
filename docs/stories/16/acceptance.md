# Critères d'acceptance : issue #16, Étapes de leçon lues, puis exercices

Scénarios : `features/16-etapes-puis-exercices.feature` (tags `@issue-16 @wip`).
Modèle du domaine : `docs/stories/16/domain-model.md` (contextes **Apprentissage** et **Catalogue pédagogique**, avec **Motivation**, **Voix** et **Famille**).

## Objectif

En tant qu'**enfant**, je veux écouter mon **personnage guide** m'expliquer la **leçon** **étape de leçon** par étape de leçon, puis faire les **exercices** à la suite (**séance complète**), ou en choisir un seul (**séance d'un exercice**), afin de comprendre avant de m'entraîner.

Story porteuse de la **séance** pour tout le lot 3 : page de la leçon, plan de la séance, enchaînement des exercices, **avancement de la séance**, abandon. Les mécaniques de chaque type d'exercice sont dans #17 à #22, l'aide et « Je ne sais pas » dans #23, les étoiles et la fin de la séance dans #24.

Comportement actuel (`app/`, `showLesson`, `playLesson`, `stepsOf`, `tracker`) repris comme premiers exemples. Écarts voulus, tous en question ouverte : bloc adulte « guide fondamental » (n°4), phrase d'accueil sans « en deux minutes » (n°5), exercice de type inconnu écarté (n°1), avancement annoncé aux lecteurs d'écran (n°7), mode dys dans la bulle du personnage guide (défaut du legacy corrigé, règle de `CLAUDE.md`).

## Numérotation des questions du lot 3

Les modèles numérotent leurs questions story par story. Ces critères reprennent une **numérotation unique de 1 à 78** pour le lot, dans l'ordre des stories : #16 → 1 à 10, #17 → 11 à 20, #18 → 21 à 29, #19 → 30 à 36, #20 → 37 à 48, #21 → 49 à 55, #22 → 56 à 62, #23 → 63 à 68, #24 → 69 à 78. Les questions nouvelles, nées de l'écriture des scénarios, partent de 79. Chaque question cite aussi son numéro d'origine (« #16 n°1 »).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | La page de la leçon présente la leçon et propose la séance complète ou un seul exercice | La page de la leçon propose la séance complète et chaque exercice (`@a-valider` Q3) · L'exercice « <titre> » est proposé avec le libellé de son type (2 cas) · Un exercice sans titre est proposé sous le libellé de son type · Le personnage guide accueille l'enfant sur la page de la leçon (`@a-valider` Q5) · Le passage pour les adultes cite le programme officiel et le guide fondamental (`@a-valider` Q4) · Une leçon qui ne s'appuie sur aucun guide fondamental n'en cite aucun |
| 2 | Une séance complète lit toutes les étapes de leçon, dans l'ordre, avant le premier exercice | La première étape de leçon est lue, puis attend l'enfant · Les exemples d'une étape de leçon sont affichés et lus après son texte · Continuer passe à l'étape de leçon suivante · Après la dernière étape de leçon, le personnage guide lance le premier exercice · Une leçon sans étape de leçon commence directement par son premier exercice · « Réécouter » relit la dernière phrase du personnage guide |
| 3 | Une séance d'un exercice joue seulement l'exercice choisi, sans étape de leçon | Choisir un seul exercice saute les étapes de leçon · Le titre de l'exercice choisi seul n'est pas annoncé (`@a-valider` Q8) · Une séance d'un exercice se termine avec cet exercice |
| 4 | Les exercices se jouent dans l'ordre de la leçon, et le personnage guide annonce le titre du suivant | Entre deux exercices, le personnage guide annonce le titre de l'exercice suivant · Un exercice sans titre commence sans être annoncé · Tant que la question en cours n'est pas réussie, l'exercice suivant ne commence pas |
| 5 | L'avancement de la séance compte les questions réussies, et il est complet exactement à la dernière question réussie | L'avancement d'une <séance> compte <total> questions (5 cas : 15, 6, 9, 4, 16) · Les étapes de leçon ne font pas avancer la séance · Chaque question réussie fait avancer la séance d'un pas · Une erreur ne fait jamais reculer l'avancement · L'avancement est complet quand la dernière question est réussie · Un exercice d'un type inconnu est écarté (`@a-valider` Q1) |
| 6 | Quitter une séance en cours ne garde rien de cette séance | Quitter la séance en cours ramène à la page de la leçon et coupe la voix (`@a-valider` Q2) · Une séance quittée recommence du début (`@a-valider` Q2) |
| 7 | La séance se suit à voix haute, en mode dys, au clavier et sur un petit écran | Avec le mode dys, les étapes de leçon et leurs exemples s'affichent en mode dys · L'avancement de la séance est annoncé aux lecteurs d'écran (`@a-valider` Q7) · Au clavier, Léa suit les étapes de leçon et commence le premier exercice sans souris · La page de la leçon et la séance tiennent dans un écran de 360 px de large |

Total : 7 règles, 30 scénarios (35 cas avec les exemples des plans), dont 8 `@a-valider`.

Droits d'accès : aucun scénario `@acces`. La séance vit dans la mémoire du navigateur et n'écrit rien (modèle, « Données d'enfants ») ; la lecture des étoiles et l'enregistrement de la séance terminée sont couverts par #24.

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Les sons ou, on, an | `fr-cp-sons-ou-on-an` | 3 étapes de leçon (la 3e a les exemples « ou », « on », « an »), exercice bulles « Quel son entends-tu ? » (6 questions), exercice classer « Les maisons des sons » (9 étiquettes) : total 15 ; pas de guide fondamental |
| La boîte à jetons : ajouter | `ma-cp-boite-ajouter` | passage pour les adultes avec guide fondamental (page 53) |
| Lecture : Le petit chat Plume | `fr-cp-lecture-petit-chat` | avancement d'une lecture (4 questions) |
| Chanson : Au clair de la lune | `fr-cp-chanson-clair-de-lune` | avancement d'une poésie (8 vers, 16 questions) |
| « Les nombres » (test) | — | un exercice calcul sans titre |
| « Compter » (test) | — | aucune étape de leçon ; ou deux exercices bulles, le second sans titre |
| « Mélange » (test) | — | un exercice bulles de 3 questions et un exercice de type inconnu « puzzle » |

Profil : Léa, CP, univers « Animaux de la forêt » (personnage guide Noisette). Les phrases tirées au hasard (fin des étapes, annonce de l'exercice suivant) sont vérifiées par appartenance à leur liste ; le tirage lui-même relève des tests unitaires (port `Hasard`).

## Hors périmètre

- Étoiles, séance terminée, fin de la séance, « Rejouer » et « Leçon suivante » : #24.
- Mécaniques des types d'exercices : #17 à #22 ; aide et « Je ne sais pas » : #23.
- Reprise d'une séance en cours, hors ligne et synchronisation : #44 (beta en ligne seulement).
- Séances spéciales (révision, test de départ, mots de la semaine) : lots 4 et 6. Traduction des consignes (bouton « Traduire ») : lot 6.
- Les pauses (400 ms, 150 ms au plus en mouvements réduits) : détail d'interface, non écrit en scénario.
- Le retrait de la page de démonstration du lot 1 (#6, #7, #12) : fait à la livraison, quand ces scénarios passent par une vraie séance.

## Questions ouvertes

Aucune n'est bloquante pour écrire les tests. Chaque scénario `@a-valider` suit la proposition du modèle.

1. *(#16 n°1)* **Exercice de type inconnu** : le Catalogue l'écarte (ni proposé, ni joué, ni compté) et la leçon reste jouable ? **Proposition** : oui. → « Un exercice d'un type inconnu est écarté ».
2. *(#16 n°2)* **Séance abandonnée** : rien n'est gardé, pas de reprise au lot 3 ? **Proposition** : oui ; la reprise vient avec #44. → « Quitter la séance en cours… », « Une séance quittée recommence du début » (et #24, Q72).
3. *(#16 n°3)* **« Jeu »** reste le mot d'interface pour exercice (« Leçon et tous les jeux », « Ou choisis un seul jeu : », « Jeu suivant », « Nouveau défi », « Place au jeu ») ? **Proposition** : oui, interface seulement. → « La page de la leçon propose la séance complète et chaque exercice ».
4. *(#16 n°4)* **Bloc adulte** : « Ce que conseille le guide fondamental » au lieu de « Ce que conseille le guide » ? **Proposition** : oui. → « Le passage pour les adultes cite le programme officiel et le guide fondamental ».
5. *(#16 n°5)* **Phrase d'accueil** sans « en deux minutes » ? **Proposition** : oui. → « Le personnage guide accueille l'enfant sur la page de la leçon ».
6. *(#16 n°6)* **Récipient de progression** : terme d'interface, le domaine dit avancement de la séance ? **Proposition** : oui. Les scénarios disent « l'avancement de la séance montre … ».
7. *(#16 n°7)* **Avancement annoncé aux lecteurs d'écran** (« 1 sur 15 »), en annonce polie ? **Proposition** : oui. → « L'avancement de la séance est annoncé aux lecteurs d'écran ».
8. *(#16 n°8)* **Exercice choisi seul** : son titre n'est pas annoncé ? **Proposition** : oui. → « Le titre de l'exercice choisi seul n'est pas annoncé ».
9. *(#16 n°9)* Accueil, fin des étapes et annonce de l'exercice : paroles de Motivation ? **Proposition** : oui. Sans effet sur les scénarios.
10. *(#16 n°10, architecture)* `lireLecon` dans `catalogue/domain/` (décision 0011) ? **Proposition** : oui. Sans effet sur les scénarios.

Questions des autres stories qui touchent cette story : Q72 (#24, séance abandonnée) et Q79 (#24, où l'enfant voit ses meilleures étoiles).

## Décisions

Aucune pour l'instant : la validation des scénarios du lot 3 est attendue.
