# Critères d'acceptance : issue #79, la consigne d'un exercice reste visible pendant tout l'exercice

État : **validé par le PO le 2026-10-25** (voir « Décisions »).

Scénarios : `features/79-consigne-visible-pendant-l-exercice.feature` (tag `@issue-79`).
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
| 3. La consigne peut être relue à voix haute pendant tout l'exercice | après « do » posée, la consigne de « domino » est relue et « do » reste à sa place · en bulles, la consigne est relue et la question reste posée · en bulles, la consigne relue pendant la lecture de « Combien font 1 + 1 ? » laisse venir ses choix (décision 79.13) · en Muet, rien n'est lu et la consigne reste visible |
| 4. Quand la voix est bloquée, le message qui le dit reste visible pendant la séance | au début de l'exercice · après une étiquette posée · jamais deux messages · disparaît quand la voix revient (« Réécouter » réussi) |
| 5. Sans voix, la félicitation est visible avant l'écran suivant, et celle de la dernière bonne réponse attend que l'enfant continue | ordre, dernière étiquette « no » : Muet, voix bloquée, navigateur sans lecture → félicitation, « Continuer » proposé, pas de fin de séance d'elle-même · classer, dernière étiquette « dent » · « 7 » à « Combien font 3 + 4 ? », puis Léa continue → fin de la séance · avec la voix, pas de « Continuer » · entre deux questions et entre deux exercices : félicitation visible, puis l'écran suivant vient seul |
| 6. La consigne visible se lit en mode dys et tient sur un petit écran | mode dys : police Andika, espacements · 360 px : la page tient dans la largeur, consigne visible |
| 7. Le texte d'une étape de leçon reste visible jusqu'à ce que l'enfant continue | Muet : le texte de la première étape de « Les sons ou, on, an » reste visible, « Continuer » proposé (décision 79.2) |

La story compte **7 règles**, une de plus que le seuil habituel de 6. La règle 7 ne fait que confirmer le comportement actuel (non-régression). Le PO a validé la story entière, règles 4 et 5 comprises.

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | La consigne est visible dès le début de l'exercice, qu'elle ait été lue ou non | Quand <situation>, la consigne d'un exercice classer est visible dès le début (3 cas : Muet, voix bloquée, navigateur qui ne sait pas lire à voix haute) · En Muet, la consigne d'un exercice ordre est visible dès le début · En Muet, la consigne d'un exercice bulles est visible avec la question · En Muet, un exercice <type> sans consigne montre sa consigne par défaut (3 cas : classer, ordre, trous) · Avec la voix, la consigne d'un exercice ordre reste visible après sa lecture · Avec la voix, la consigne d'un exercice bulles reste visible quand la question est lue | 79.1, 79.8, 79.9 |
| 2 | La consigne reste visible jusqu'à la fin de l'exercice, quoi que dise le personnage guide | En Muet, la consigne d'un exercice classer reste visible après une étiquette bien posée · En Muet, la consigne d'un exercice ordre reste visible après une erreur · Avec la voix, la consigne reste visible pendant l'encouragement du personnage guide · Au début de l'exercice suivant, sa consigne remplace celle de l'exercice fini · À la fin de la séance, la consigne du dernier exercice n'est plus affichée | 79.1 |
| 3 | La consigne peut être relue à voix haute pendant tout l'exercice | L'enfant fait relire la consigne au milieu d'un exercice ordre · Dans un exercice bulles, relire la consigne laisse la question posée · Dans un exercice bulles, relire la consigne pendant la lecture de la question suivante laisse ses choix venir · En Muet, demander à relire la consigne ne fait rien lire et la consigne reste visible | 79.7, 79.12, 79.13 |
| 4 | Quand la voix est bloquée, le message qui le dit reste visible pendant la séance | Le message de voix bloquée est visible quand l'exercice commence · Le message de voix bloquée reste visible après une réponse · Le message de voix bloquée n'est jamais affiché deux fois · Quand la voix revient, le message de voix bloquée disparaît | 79.5, 79.6 |
| 5 | Sans voix, la félicitation est visible avant l'écran suivant, et celle de la dernière bonne réponse attend que l'enfant continue | Quand <situation>, la félicitation de la dernière étiquette d'un exercice ordre reste visible jusqu'à ce que Léa continue (3 cas : Muet, voix bloquée, navigateur qui ne sait pas lire à voix haute) · En Muet, la félicitation de la dernière étiquette d'un exercice classer reste visible jusqu'à ce que Léa continue · En Muet, la fin de la séance s'affiche quand Léa continue après la félicitation de la dernière question · Avec la voix, la fin de la séance vient après la félicitation de la dernière étiquette, sans que Léa continue · En Muet, la félicitation d'une question est visible, puis la question suivante vient d'elle-même · En Muet, après la dernière étiquette d'un exercice qui n'est pas le dernier, l'exercice suivant vient de lui-même | 79.3, 79.4 |
| 6 | La consigne visible se lit en mode dys et tient sur un petit écran | Avec le mode dys, la consigne restée visible s'affiche en mode dys · La consigne, les maisons et les étiquettes tiennent ensemble dans un écran de 360 px de large | 79.1 |
| 7 | Le texte d'une étape de leçon reste visible jusqu'à ce que l'enfant continue | En Muet, le texte de la première étape de leçon reste visible jusqu'à ce que Léa continue | 79.2 |

Total : 7 règles, 28 scénarios dont 3 plans (34 cas exécutés), aucun `@a-valider`, aucun `@acces`.

Droits d'accès : aucun scénario `@acces`. La story n'écrit rien en base et ne crée aucune table : l'affichage de la consigne, du message de voix bloquée et de la félicitation se joue dans le navigateur, sur des leçons de la bibliothèque. Rien de ce que produit l'enfant ne part ailleurs.

## Non-régression

### Scénarios de #7 portés sur une vraie séance par #58

Les six scénarios `@issue-7 @issue-58` doivent rester verts **sans changer un mot** :

- La consigne est lue à voix haute dès qu'elle s'affiche. Son étape « Léa voit la consigne « … » » vérifie aujourd'hui la bulle du personnage guide. La consigne prenant une place à elle (décision 79.1), c'est le step qui suit, pas le texte du scénario.
- Un texte sans rien à dire n'est pas lu.
- En Muet, la question s'affiche sans être lue.
- Quand la voix est bloquée, l'enfant est prévenu sans être bloqué.
- Réécouter permet de réessayer quand la voix était bloquée. Selon la décision 79.5, le message disparaît après ce « Réécouter » réussi : le scénario n'en dit rien et reste vrai.
- Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même.

### Scénarios voisins à exécuter avec la story

- #7, non porté par #58 : **« Le message de voix bloquée n'apparaît qu'une fois »**. Il vérifie qu'à la consigne suivante, **aucun** message de voix bloquée n'est affiché. Ce comportement est justement le défaut n°2 : ce scénario **contredit la règle 4**. Décision 79.5 : **travail de l'équipe de #79** (pas fait au cadrage) : réécrire ce scénario dans `features/7-voix.feature`, sous le même titre, pour qu'il vérifie qu'un **seul** message est affiché (« Alors Léa voit un seul message de voix bloquée » au lieu de « Alors le message de voix bloquée n'apparaît pas de nouveau »). Le scénario « Le message de voix bloquée n'est jamais affiché deux fois » de #79 vérifie la même chose sur une vraie séance.
  - **Fait le 2026-10-25** : dans `features/7-voix.feature`, le scénario « Le message de voix bloquée n'apparaît qu'une fois » garde son titre, ses tags et ses autres étapes ; sa dernière étape est désormais « Alors Léa voit un seul message de voix bloquée ».
- #7 « Le mot prononcé est surligné pendant la lecture » et #12 « En mode dys, le mot prononcé est toujours surligné pendant la lecture » : le mot prononcé doit rester surligné dans la consigne lue, où qu'elle soit affichée.
- #12, scénarios du mode dys sur la consigne (« Avec le mode dys, la consigne s'affiche en police Andika… », « Sans le mode dys, la consigne s'affiche comme d'habitude », syllabes en couleurs alternées).
- #16 « « Réécouter » relit la dernière phrase du personnage guide » et #17 « L'enfant peut réécouter la question » : « Réécouter » garde son comportement (décision 79.7).
- #17 « La félicitation est dite en entier avant la question suivante » et #24 « À la fin de la séance, le personnage guide dit à l'enfant combien d'étoiles il a gagnées » : avec la voix, rien ne change (aucun « Continuer » après la dernière félicitation).
- Scénarios E2E qui jouent une séance **sans voix** jusqu'à la fin (Muet, voix bloquée, navigateur sans lecture), par exemple ceux de #24 et #58 : après la dernière bonne réponse, ils doivent désormais passer par « Continuer » (décision 79.3). C'est leurs steps qui changent, jamais leur texte. Travail de l'équipe de #79.
- #18, scénarios « La consigne est lue, puis la façon de poser les étiquettes / de commencer » et le plan des consignes par défaut.

Commande de mise au point proposée : `npx bddgen --tags "@issue-79 or @issue-7 or @issue-12 or @issue-16 or @issue-17 or @issue-18 or @issue-24"`, puis `--grep "@issue-79|@issue-7|@issue-12|@issue-16|@issue-17|@issue-18|@issue-24"` sur le projet `telephone`.

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Les sons ou, on, an | `fr-cp-sons-ou-on-an` | classer « Les maisons des sons » (consigne « Range chaque mot dans la maison de son son. », maisons « ou », « on », « an », 9 étiquettes) ; bulles « Quel son entends-tu ? » (sans consigne) ; première étape de leçon |
| Les syllabes | `fr-cp-syllabes` | ordre « Le mot en morceaux » (« domino » : « do », « mi », « no »), puis ordre « Encore un mot » (« caramel ») dans la séance complète |
| Compter (leçon de test) | injectée par les steps | un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? » ; pour 79.13, la même consigne, qui pose « Combien font 2 + 1 ? » (réponse « 3 ») puis « Combien font 1 + 1 ? » |
| Question de test « Combien font 3 + 4 ? » | injectée par les steps (#17, #58) | choix « 6 », « 7 », « 8 », « 9 », réponse « 7 », seule question de sa séance |
| Leçon de test sans consigne | injectée par les steps (#18) | consignes par défaut de classer, ordre, trous |

Aucune leçon n'est ajoutée à `app/bibliotheque.json`.

Steps réutilisés sans changement de texte : « Léa a un profil enfant préparé… », « la tablette est en Muet », « le navigateur bloque la voix », « le navigateur ne sait pas lire à voix haute », « le navigateur ne bloque plus la voix », « Léa a déjà vu le message de voix bloquée », « la voix a été bloquée pendant la lecture de la question « … » », « la consigne suivante s'affiche », « Léa est sur la page de la leçon « … » », « Léa choisit seulement l'exercice « … » », « Léa joue seulement l'exercice « … » de la leçon « … » », « Léa joue la séance complète de la leçon « … » », « Léa joue l'exercice « … » de la leçon « … » », « Léa joue la question de test « … » », « Léa en est à la question « … » », « Léa commence la séance complète », « une leçon de test a un exercice <type> sans consigne », « Léa commence cet exercice », « il ne reste que l'étiquette « … » à poser », « Léa a posé l'étiquette « … » », « Léa a posé les étiquettes « … » et « … » », « Léa pose l'étiquette « … » (dans la maison « … ») », « Léa répond « … » », « Léa demande à réécouter la consigne », « Léa demande à réécouter la question », « Léa voit la consigne « … » », « Léa voit la consigne « … » en mode dys : … », « Léa voit la question « … » », « Léa voit le message « … » », « Léa voit les maisons … », « Léa n'entend rien », « Léa entend Noisette lire « … » », « Léa entend Noisette lire « … », puis « … » », « Léa entend de nouveau Noisette lire « … » », « Noisette dit un encouragement, suivi de « … » », « l'étiquette « … » reste dans la maison « … » », « l'étiquette « … » revient parmi les étiquettes à poser », « la séance est terminée », « ensuite seulement, la question « … » s'affiche », « Paul a réglé « mode dys » sur « oui » pour Léa », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « Léa peut continuer quand elle est prête », « Léa a répondu « … » », « Léa continue ».

Formulations nouvelles :

- « une leçon de test « … » a un exercice bulles de consigne « … » qui pose « … » »
- « Léa en est à la dernière étiquette de l'exercice « … », « … » »
- « Léa ne voit plus la consigne « … » »
- « l'étiquette « … » reste à la première place »
- « Léa voit un seul message de voix bloquée »
- « Léa ne voit plus le message de voix bloquée »
- « Léa voit une félicitation de Noisette »
- « la fin de la séance ne s'affiche pas d'elle-même »
- « Léa n'a pas eu à continuer »
- « ensuite seulement, Léa voit la consigne « … » »
- « Léa voit le texte de l'étape de leçon « … » »
- « une leçon de test « … » a un exercice bulles de consigne « … » qui pose « … » puis « … » » (79.13, variante à deux questions de la formulation ci-dessus)
- « Léa demande à réécouter la consigne pendant que Noisette lit la question « … » » (79.13)
- « Léa voit la question « … » avec ses choix » (79.13)

Le step existant « Léa voit la consigne « … » » cherche la consigne dans la bulle du personnage guide. Il devra la chercher là où la consigne est affichée une fois la décision 79.1 prise, sans changer de texte.

## Hors périmètre

- La **dictée** et la **poésie à mémoriser** : aucune consigne n'y est lue au début (`consigneLueAuDebut`), et la dictée a déjà son message sans voix (#19). Elles ne changent pas (décision 79.8).
- Le **texte de lecture** (#17) : il reste déjà affiché pendant les questions.
- Le **legacy** (`app/`) : la correction se fait dans la cible seulement.
- La **durée exacte** d'affichage d'une félicitation sans voix entre deux questions ou deux exercices (environ 2 s, décision 79.4) : c'est un nombre, vérifié par un test unitaire et non par un scénario.
- L'**apparence** du bouton « Continuer » après la dernière félicitation (taille d'au moins 44 px, accès au clavier) : règles d'accessibilité du projet, vérifiées par l'équipe.
- Les **effets sonores**, les **MP3 pré-générés** et le **test de départ** (#27), qui a son propre déroulé.
- Le **réglage « Tout lire à voix haute »** : les choix lus après la question ne changent pas.

## Termes et concepts à signaler (glossaire non modifié, agents en parallèle)

- **Message de voix bloquée** : employé par les scénarios de #7 et ici, absent du glossaire. La définition actuelle de **Voix bloquée** (« L'enfant est prévenu une fois par ouverture de l'application ») est à préciser (décision 79.5) : l'enfant est prévenu une seule fois, et le message reste affiché tant que la voix est bloquée.
- **Fin de la séance** : employé par #24 et ici ; le glossaire n'a que **Séance terminée**. À ajouter comme écran, ou à remplacer par « Séance terminée ».
- **Réécouter** (la commande) et « relire la consigne » : absents du glossaire. La décision 79.7 ne donne pas de nom à la relecture de la consigne : à nommer au glossaire si l'équipe en a besoin.
- **Bulle du personnage guide** : employée par #16 et dans le texte de la Fonctionnalité, absente du glossaire. C'est un mot d'interface, pas un concept.
- **Concept possible** : une **durée minimale d'affichage** d'une parole quand la voix ne la lit pas (félicitation entre deux questions, annonce du nouveau défi, décision 79.4), et l'**attente de l'enfant** après la dernière félicitation sans voix (décision 79.3). Ces règles devraient vivre dans le domaine (Apprentissage ou Voix), pour être testées unitairement et partagées avec le hors-ligne, et non dans React. C'est au `domain-modeler` de le trancher.

## Décisions

Commentaire « [Responsable] VALIDÉ avec 1 changement » sur l'issue #79, le 2026-10-25. Réponses du PO, mot pour mot :

1. « #79.3. jusqu a qd l'enfant change de page autre point de 79 reco OK »
2. Aux précisions d) et e) : « reco OK »
   - d) 79.3 : sans voix, un bouton « Continuer » (44 px ou plus, utilisable au clavier) pour passer à la fin de séance, sans délai automatique ? Avec la voix, rien ne change.
   - e) Cette règle vaut-elle seulement pour la dernière bonne réponse, ou aussi pour les félicitations entre deux questions et l'annonce du nouveau défi (79.4) ? Reco : seulement la dernière ; ailleurs, environ 2 s, puis l'écran suivant vient seul.

Décisions qui en découlent :

- **79.1 Place de la consigne** : reco retenue. La consigne reste au même endroit et en entier, dans une place à elle au-dessus de l'exercice, en dehors de la bulle du personnage guide. Le mot prononcé y est surligné pendant la lecture. Pas de réduction.
- **79.2 Étape de leçon** : reco retenue. Même règle, déjà vraie aujourd'hui : scénario de non-régression (règle 7).
- **79.3 Félicitation de la dernière bonne réponse sans voix** : changement par rapport à la reco. Sans voix, la félicitation de la **dernière** bonne réponse reste affichée **jusqu'à ce que l'enfant appuie sur « Continuer »** (bouton de 44 px ou plus, utilisable au clavier). Il n'y a pas de délai automatique. Avec la voix, rien ne change.
- **79.4 Autres paroles sans voix** : ailleurs (félicitation entre deux questions, annonce du nouveau défi), environ 2 s, puis l'écran suivant vient seul.
- **79.5 Message de voix bloquée** : reco retenue. Un seul exemplaire, visible tant que la voix est bloquée (jusqu'à une lecture réussie ou le passage en Muet), annoncé une fois aux lecteurs d'écran. Le scénario de #7 « Le message de voix bloquée n'apparaît qu'une fois » est réécrit par l'équipe pour vérifier un seul message (voir « Non-régression »). La définition de **Voix bloquée** est à préciser au glossaire.
- **79.6 Voix bloquée puis Muet** : reco retenue. Le message disparaît au passage en Muet. Aucun scénario ajouté au cadrage : l'équipe peut le couvrir par un test unitaire ou un scénario de la règle 4.
- **79.7 Relire la consigne** : reco retenue. En touchant la consigne ou un bouton à côté d'elle (44 px ou plus, utilisable au clavier). « Réécouter » garde son rôle (#16, #17). En Muet, rien n'est lu.
- **79.8 Types d'exercice concernés** : reco retenue. Tous ceux dont la consigne est lue au début (tous sauf `dictee` et `memoriser`), consigne par défaut de classer, ordre et trous comprise.
- **79.9 Indication du geste** : reco retenue. Elle reste dans la bulle jusqu'à la parole suivante ; seule la consigne a une place fixe.

Annonce du responsable sur l'issue #79, le 2026-10-25. Réponse du PO, mot pour mot : « 79.2 : A ». Le responsable la lit comme **79.12 : A**, seule question avec un choix A.

- **79.12 Relire la consigne pendant la présentation** : choix A. Pendant que le personnage guide présente l'exercice (consigne, texte, question), le bouton « Relire la consigne » est inactif (grisé, `aria-disabled`). Il devient actif dès que la présentation est finie et le reste jusqu'à la fin de l'exercice. La consigne reste visible tout le temps. Origine : 3e cycle « À CORRIGER » de la review (relire pendant la présentation coupait l'ouverture de l'exercice). Le texte des scénarios ne change pas.

Complément du responsable sur l'issue #79, le 2026-10-25. Réponse du PO à 79.10 et 79.11, mot pour mot : « oui pour les 2 ».

- **79.10 Nouveau blocage de la voix** : oui. Si la voix revient puis se bloque de nouveau pendant la même ouverture de l'application, le message de voix bloquée réapparaît.
- **79.11 Invitation à jouer sans voix** : oui. Sans voix, l'invitation à jouer après les étapes de la leçon reste visible environ 2 s, puis l'exercice vient seul, comme l'annonce du nouveau défi (79.4).

Question 79.13 posée à l'équipe de #79. Réponse du PO, mot pour mot, le 2026-10-26 : « Oui ».

- **79.13 Relire la consigne pendant la question suivante** : oui. Le scénario de non-régression « Dans un exercice bulles, relire la consigne pendant la lecture de la question suivante laisse ses choix venir » est ajouté à la règle 3 (tag `@a-valider` retiré). Il prouve que relire la consigne pendant la lecture d'une question suivante n'enlève jamais ses choix. Origine : défaut trouvé en review ; selon 79.12, le bouton « Relire la consigne » est actif après la présentation d'ouverture jusqu'à la fin de l'exercice, donc aussi pendant la lecture de la question suivante.

## Questions ouvertes

Aucune. Les questions 79.1 à 79.13 sont tranchées : voir « Décisions ».
