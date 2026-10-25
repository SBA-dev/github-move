# Critères d'acceptance : issue #79, la consigne d'un exercice reste visible pendant tout l'exercice

Scénarios : `features/79-consigne-visible-pendant-l-exercice.feature` (tags `@issue-79 @wip`).
Modèle du domaine : aucun. C'est une story de correction dans le contexte **Apprentissage** (séance, exercices), qui touche aussi l'affichage de la **Voix** (message de voix bloquée). Elle n'introduit pas de nouvel agrégat ; voir « Termes et concepts à signaler » pour la seule règle qui pourrait entrer dans un domaine.
Origine : question #58.8 (`docs/stories/58/acceptance.md`), et commentaire du responsable des équipes sur l'issue (deux défauts voisins relevés par #58, PR #81).

## Objectif

En tant qu'**enfant**, je veux voir la **consigne** de l'exercice tant que je le fais, afin de savoir ce qu'on me demande même si je n'ai pas entendu la voix.

Défauts constatés dans la cible (`src/seance/`) :

1. **La consigne disparaît.** Elle n'est montrée que dans la bulle du personnage guide, le temps de sa lecture. La phrase suivante prend sa place : l'indication du geste en `classer` et en `ordre`, la question en `bulles`, puis les félicitations et les encouragements. Sans voix (Muet, voix bloquée, navigateur qui ne sait pas lire à voix haute), la lecture se termine tout de suite et la consigne est remplacée aussitôt : un enfant en Muet ne voit **jamais** la consigne d'un exercice `classer` ou `ordre`.
2. **Le message de voix bloquée disparaît à l'entrée en séance.** Il apparaît sur la page de la leçon (première parole du personnage guide). La lecture suivante, au début de la séance, l'efface, et la voix bloquée n'est signalée qu'une fois par ouverture de l'application : il ne revient donc jamais.
3. **Sans voix, la dernière bonne réponse mène directement à la fin de la séance.** La félicitation est dite par une lecture qui se termine tout de suite : la fin de la séance la remplace avant que l'enfant ait pu la voir.

## Example mapping

| Règle | Exemples |
|---|---|
| 1. La consigne est visible dès le début de l'exercice, qu'elle ait été lue ou non | Muet, voix bloquée, navigateur sans lecture à voix haute → « Range chaque mot dans la maison de son son. » au début de « Les maisons des sons » · Muet → « Remets les syllabes dans l'ordre pour écrire « domino ». » · bulles de test : consigne « Touche le bon nombre. » et question « Combien font 2 + 1 ? » visibles ensemble · consigne par défaut de classer, ordre, trous · avec la voix : consigne lue, puis l'indication du geste ou la question, et la consigne toujours visible |
| 2. La consigne reste visible jusqu'à la fin de l'exercice, quoi que dise le personnage guide | après une étiquette bien posée (« loup » dans « ou ») · après une erreur (« mi » en premier) · pendant un encouragement · à l'exercice suivant, « caramel » remplace « domino » · à la fin de la séance, plus de consigne |
| 3. La consigne peut être relue à voix haute pendant tout l'exercice | après « do » posée, la consigne de « domino » est relue et « do » reste à sa place · en bulles, la consigne est relue et la question reste posée · en Muet, rien n'est lu et la consigne reste visible |
| 4. Quand la voix est bloquée, le message qui le dit reste visible pendant la séance | au début de l'exercice · après une étiquette posée · jamais deux messages · disparaît quand la voix revient (« Réécouter » réussi) |
| 5. Sans voix, la félicitation de la dernière bonne réponse est visible avant la fin de la séance | ordre, dernière étiquette « no » : Muet, voix bloquée, navigateur sans lecture · classer, dernière étiquette « dent » · bulles, « 7 » à « Combien font 3 + 4 ? » · entre deux questions (à valider) |
| 6. La consigne visible se lit en mode dys et tient sur un petit écran | mode dys : police Andika, espacements · 360 px : la page tient dans la largeur, consigne visible |
| 7. Le texte d'une étape de leçon reste visible jusqu'à ce que l'enfant continue | Muet : le texte de la première étape de « Les sons ou, on, an » reste visible, « Continuer » proposé (à valider, question 79.2) |

La story compte **7 règles**, une de plus que le seuil habituel de 6. La règle 7 ne fait que confirmer le comportement actuel (non-régression). Si le PO veut alléger la story, les règles 4 et 5, ajoutées par le commentaire de l'issue, peuvent devenir une story à part.

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | La consigne est visible dès le début de l'exercice, qu'elle ait été lue ou non | Quand <situation>, la consigne d'un exercice classer est visible dès le début (3 cas : Muet, voix bloquée, navigateur qui ne sait pas lire à voix haute) · En Muet, la consigne d'un exercice ordre est visible dès le début · En Muet, la consigne d'un exercice bulles est visible avec la question · En Muet, un exercice <type> sans consigne montre sa consigne par défaut (3 cas : classer, ordre, trous) · Avec la voix, la consigne d'un exercice ordre reste visible après sa lecture · Avec la voix, la consigne d'un exercice bulles reste visible quand la question est lue | 79.1, 79.8, 79.9 |
| 2 | La consigne reste visible jusqu'à la fin de l'exercice, quoi que dise le personnage guide | En Muet, la consigne d'un exercice classer reste visible après une étiquette bien posée · En Muet, la consigne d'un exercice ordre reste visible après une erreur · Avec la voix, la consigne reste visible pendant l'encouragement du personnage guide · Au début de l'exercice suivant, sa consigne remplace celle de l'exercice fini · À la fin de la séance, la consigne du dernier exercice n'est plus affichée | 79.1 |
| 3 | La consigne peut être relue à voix haute pendant tout l'exercice | `@a-valider` L'enfant fait relire la consigne au milieu d'un exercice ordre · `@a-valider` Dans un exercice bulles, relire la consigne laisse la question posée · `@a-valider` En Muet, demander à relire la consigne ne fait rien entendre et la consigne reste visible | 79.7 |
| 4 | Quand la voix est bloquée, le message qui le dit reste visible pendant la séance | Le message de voix bloquée est visible quand l'exercice commence · `@a-valider` Le message de voix bloquée reste visible après une réponse · `@a-valider` Le message de voix bloquée n'est jamais affiché deux fois · `@a-valider` Quand la voix revient, le message de voix bloquée disparaît | 79.5 |
| 5 | Sans voix, la félicitation de la dernière bonne réponse est visible avant la fin de la séance | Quand <situation>, la dernière étiquette d'un exercice ordre est félicitée avant la fin de la séance (3 cas) · En Muet, la dernière étiquette d'un exercice classer est félicitée avant la fin de la séance · En Muet, la bonne réponse à la dernière question est félicitée avant la fin de la séance · `@a-valider` En Muet, la félicitation d'une question est visible avant la question suivante | 79.3, 79.4 |
| 6 | La consigne visible se lit en mode dys et tient sur un petit écran | Avec le mode dys, la consigne restée visible s'affiche en mode dys · La consigne, les maisons et les étiquettes tiennent ensemble dans un écran de 360 px de large | 79.1 |
| 7 | Le texte d'une étape de leçon reste visible jusqu'à ce que l'enfant continue | `@a-valider` En Muet, le texte de la première étape de leçon reste visible jusqu'à ce que Léa continue | 79.2 |

Total : 7 règles, 25 scénarios dont 3 plans (31 cas exécutés), dont 8 `@a-valider` et aucun `@acces`.

Droits d'accès : aucun scénario `@acces`. La story n'écrit rien en base et ne crée aucune table : l'affichage de la consigne, du message de voix bloquée et de la félicitation se joue dans le navigateur, sur des leçons de la bibliothèque. Rien de ce que produit l'enfant ne part ailleurs.

## Non-régression

### Scénarios de #7 portés sur une vraie séance par #58

Les six scénarios `@issue-7 @issue-58` doivent rester verts **sans changer un mot** :

- La consigne est lue à voix haute dès qu'elle s'affiche. Son étape « Léa voit la consigne « … » » vérifie aujourd'hui la bulle du personnage guide. Si la consigne prend une place à elle (question 79.1), c'est le step qui suit, pas le texte du scénario.
- Un texte sans rien à dire n'est pas lu.
- En Muet, la question s'affiche sans être lue.
- Quand la voix est bloquée, l'enfant est prévenu sans être bloqué.
- Réécouter permet de réessayer quand la voix était bloquée. Si la décision 79.5 est retenue, le message disparaît après ce « Réécouter » réussi : le scénario n'en dit rien et reste vrai.
- Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même.

### Scénarios voisins à exécuter avec la story

- #7, non porté par #58 : **« Le message de voix bloquée n'apparaît qu'une fois »**. Il vérifie qu'à la consigne suivante, **aucun** message de voix bloquée n'est affiché. Ce comportement est justement le défaut n°2 : ce scénario **contredit la règle 4**. Proposition (question 79.5) : #79 le réécrit, sous le même titre, pour qu'il vérifie qu'un **seul** message est affiché (« Alors Léa voit un seul message de voix bloquée »). C'est le scénario `@a-valider` « Le message de voix bloquée n'est jamais affiché deux fois », qui le remplacerait.
- #7 « Le mot prononcé est surligné pendant la lecture » et #12 « En mode dys, le mot prononcé est toujours surligné pendant la lecture » : le mot prononcé doit rester surligné dans la consigne lue, où qu'elle soit affichée.
- #12, scénarios du mode dys sur la consigne (« Avec le mode dys, la consigne s'affiche en police Andika… », « Sans le mode dys, la consigne s'affiche comme d'habitude », syllabes en couleurs alternées).
- #16 « « Réécouter » relit la dernière phrase du personnage guide » et #17 « L'enfant peut réécouter la question » : « Réécouter » garde son comportement (question 79.7).
- #17 « La félicitation est dite en entier avant la question suivante » et #24 « À la fin de la séance, le personnage guide dit à l'enfant combien d'étoiles il a gagnées » : avec la voix, rien ne change.
- #18, scénarios « La consigne est lue, puis la façon de poser les étiquettes / de commencer » et le plan des consignes par défaut.

Commande de mise au point proposée : `npx bddgen --tags "@issue-79 or @issue-7 or @issue-12 or @issue-16 or @issue-17 or @issue-18 or @issue-24"`, puis `--grep "@issue-79|@issue-7|@issue-12|@issue-16|@issue-17|@issue-18|@issue-24"` sur le projet `telephone`.

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Les sons ou, on, an | `fr-cp-sons-ou-on-an` | classer « Les maisons des sons » (consigne « Range chaque mot dans la maison de son son. », maisons « ou », « on », « an », 9 étiquettes) ; bulles « Quel son entends-tu ? » (sans consigne) ; première étape de leçon |
| Les syllabes | `fr-cp-syllabes` | ordre « Le mot en morceaux » (« domino » : « do », « mi », « no »), puis ordre « Encore un mot » (« caramel ») dans la séance complète |
| Compter (leçon de test) | injectée par les steps | un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? » |
| Question de test « Combien font 3 + 4 ? » | injectée par les steps (#17, #58) | choix « 6 », « 7 », « 8 », « 9 », réponse « 7 », seule question de sa séance |
| Leçon de test sans consigne | injectée par les steps (#18) | consignes par défaut de classer, ordre, trous |

Aucune leçon n'est ajoutée à `app/bibliotheque.json`.

Steps réutilisés sans changement de texte : « Léa a un profil enfant préparé… », « la tablette est en Muet », « le navigateur bloque la voix », « le navigateur ne sait pas lire à voix haute », « le navigateur ne bloque plus la voix », « Léa a déjà vu le message de voix bloquée », « la voix a été bloquée pendant la lecture de la question « … » », « la consigne suivante s'affiche », « Léa est sur la page de la leçon « … » », « Léa choisit seulement l'exercice « … » », « Léa joue seulement l'exercice « … » de la leçon « … » », « Léa joue la séance complète de la leçon « … » », « Léa joue l'exercice « … » de la leçon « … » », « Léa joue la question de test « … » », « Léa en est à la question « … » », « Léa commence la séance complète », « une leçon de test a un exercice <type> sans consigne », « Léa commence cet exercice », « il ne reste que l'étiquette « … » à poser », « Léa a posé l'étiquette « … » », « Léa a posé les étiquettes « … » et « … » », « Léa pose l'étiquette « … » (dans la maison « … ») », « Léa répond « … » », « Léa demande à réécouter la consigne », « Léa demande à réécouter la question », « Léa voit la consigne « … » », « Léa voit la consigne « … » en mode dys : … », « Léa voit la question « … » », « Léa voit le message « … » », « Léa voit les maisons … », « Léa n'entend rien », « Léa entend Noisette lire « … » », « Léa entend Noisette lire « … », puis « … » », « Léa entend de nouveau Noisette lire « … » », « Noisette dit un encouragement, suivi de « … » », « l'étiquette « … » reste dans la maison « … » », « l'étiquette « … » revient parmi les étiquettes à poser », « la séance est terminée », « ensuite seulement, la question « … » s'affiche », « Paul a réglé « mode dys » sur « oui » pour Léa », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « Léa peut continuer quand elle est prête ».

Formulations nouvelles :

- « une leçon de test « … » a un exercice bulles de consigne « … » qui pose « … » »
- « Léa en est à la dernière étiquette de l'exercice « … », « … » »
- « Léa ne voit plus la consigne « … » »
- « l'étiquette « … » reste à la première place »
- « Léa voit un seul message de voix bloquée »
- « Léa ne voit plus le message de voix bloquée »
- « Léa voit une félicitation de Noisette »
- « ensuite seulement, la fin de la séance s'affiche »
- « Léa voit le texte de l'étape de leçon « … » »

Le step existant « Léa voit la consigne « … » » cherche la consigne dans la bulle du personnage guide. Il devra la chercher là où la consigne est affichée une fois la décision 79.1 prise, sans changer de texte.

## Hors périmètre

- La **dictée** et la **poésie à mémoriser** : aucune consigne n'y est lue au début (`consigneLueAuDebut`), et la dictée a déjà son message sans voix (#19). Elles ne changent pas (question 79.8).
- Le **texte de lecture** (#17) : il reste déjà affiché pendant les questions.
- Le **legacy** (`app/`) : la correction se fait dans la cible seulement.
- La **durée exacte** d'affichage d'une félicitation sans voix : c'est un nombre, vérifié par un test unitaire et non par un scénario (question 79.3).
- Les **effets sonores**, les **MP3 pré-générés** et le **test de départ** (#27), qui a son propre déroulé.
- Le **réglage « Tout lire à voix haute »** : les choix lus après la question ne changent pas.

## Termes et concepts à signaler (glossaire non modifié, agents en parallèle)

- **Message de voix bloquée** : employé par les scénarios de #7 et ici, absent du glossaire. La définition actuelle de **Voix bloquée** (« L'enfant est prévenu une fois par ouverture de l'application ») est à préciser si la décision 79.5 est retenue : l'enfant est prévenu une seule fois, et le message reste affiché tant que la voix est bloquée.
- **Fin de la séance** : employé par #24 et ici ; le glossaire n'a que **Séance terminée**. À ajouter comme écran, ou à remplacer par « Séance terminée ».
- **Réécouter** (la commande) et « relire la consigne » : absents du glossaire. La question 79.7 dit s'il faut un nom pour la relecture de la consigne.
- **Bulle du personnage guide** : employée par #16 et dans le texte de la Fonctionnalité, absente du glossaire. C'est un mot d'interface, pas un concept.
- **Concept possible** : une **durée minimale d'affichage** d'une parole quand la voix ne la lit pas (félicitation, et peut-être annonce du nouveau défi). Si le PO retient 79.3 et 79.4, cette règle devrait vivre dans le domaine (Apprentissage ou Voix), pour être testée unitairement et partagée avec le hors-ligne, et non dans React. C'est au `domain-modeler` de le trancher.

## Questions ouvertes

1. **79.1 Place de la consigne** (question 1 de l'issue). La consigne reste-t-elle au même endroit, ou se réduit-elle (par exemple sous la question) une fois lue ?
   **Recommandation** : elle reste au même endroit et en entier, dans une place à elle au-dessus de l'exercice, en dehors de la bulle du personnage guide. La bulle continue de porter les félicitations, les encouragements, les aides et l'indication du geste. Pendant la lecture, le mot prononcé est surligné dans la consigne, qui n'est donc affichée qu'une fois. Pas de réduction : à 360 px, la consigne passe simplement à la ligne. Une consigne qui change de forme dérouterait les plus jeunes lecteurs.
2. **79.2 Étape de leçon** (question 2 de l'issue). Faut-il la même règle pour le texte d'une étape de leçon ?
   **Recommandation** : oui. C'est déjà le cas aujourd'hui : rien n'est dit après une étape avant que l'enfant continue, donc son texte reste dans la bulle, même en Muet. #79 ne change rien et ajoute seulement le scénario de non-régression `@a-valider` (règle 7).
3. **79.3 Félicitation de la dernière bonne réponse sans voix** : combien de temps reste-t-elle visible ? Faut-il un bouton « Continuer » ?
   **Recommandation** : pas de bouton, pour ne pas ajouter un geste avant la fin de la séance, qui a déjà ses propres boutons. La félicitation reste affichée un **temps fixe court, environ 2 secondes**, avec le personnage guide qui applaudit, puis la fin de la séance s'affiche. Même durée en Muet, avec la voix bloquée et sur un navigateur sans lecture à voix haute, et même avec les mouvements réduits (c'est un temps de lecture, pas une animation). Avec la voix, rien ne change : la fin vient quand la félicitation a été dite en entier.
4. **79.4 Autres paroles sans voix** : la même durée vaut-elle pour la félicitation entre deux questions et pour l'annonce du nouveau défi entre deux exercices ?
   **Recommandation** : oui, même règle pour toute parole du personnage guide suivie d'un changement d'écran (félicitation, annonce du nouveau défi). Sinon l'enfant sans voix ne voit jamais « Bravo ! » en cours de séance. Scénario `@a-valider` sur la félicitation entre deux questions.
5. **79.5 Durée du message de voix bloquée**. Jusqu'à quand reste-t-il visible ? Que devient le scénario de #7 « Le message de voix bloquée n'apparaît qu'une fois » ?
   **Recommandation** : il reste visible, **un seul exemplaire**, tant que la voix est bloquée : pendant toute la séance et sur les écrans suivants, jusqu'à une lecture réussie (par exemple « Réécouter » quand le navigateur accepte de nouveau) ou jusqu'au passage en Muet. Il n'est annoncé qu'une fois aux lecteurs d'écran. #79 réécrit le scénario de #7 sous le même titre pour qu'il vérifie un seul message (et non aucun), et la définition de **Voix bloquée** est précisée dans le glossaire.
6. **79.6 Voix bloquée puis Muet** : quand l'enfant passe en Muet alors que la voix était bloquée, le message disparaît-il ?
   **Recommandation** : oui. En Muet, l'enfant a choisi de ne rien entendre : lui dire que la voix est bloquée n'a plus de sens. Pas de scénario tant que la question n'est pas tranchée.
7. **79.7 Relire la consigne** : comment l'enfant fait-il relire la consigne, et que devient « Réécouter » ?
   **Recommandation** : un moyen propre à la consigne, par exemple toucher la consigne ou un petit bouton à côté d'elle, d'au moins 44 px et utilisable au clavier. « Réécouter » garde son comportement actuel : la question en `bulles` (#17), la dernière phrase du personnage guide sinon (#16). En Muet, relire ne fait rien entendre (règle du Muet, #7). Scénarios `@a-valider` (règle 3).
8. **79.8 Types d'exercice concernés** : tous ?
   **Recommandation** : tout exercice dont la consigne est lue au début, c'est-à-dire tous les types sauf `dictee` et `memoriser`. La consigne par défaut de `classer`, `ordre` et `trous` compte comme une consigne. Les exercices sans consigne (par exemple `bulles` ou `calcul` de la bibliothèque) n'affichent rien de plus. La dictée et la poésie restent hors périmètre.
9. **79.9 Indication du geste** : « Fais glisser chaque étiquette… » et « Touche d'abord celle qui vient en premier. » doivent-elles rester visibles elles aussi ?
   **Recommandation** : non. Elles restent dans la bulle jusqu'à la parole suivante, comme aujourd'hui. Seule la consigne a une place fixe : deux textes fixes chargeraient l'écran, surtout à 360 px.
