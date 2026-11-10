# Story #183 : critères d'acceptance

Scénarios : `features/183-ecran-de-seance-barres.feature` (tags `@issue-183 @wip`).
Modèle du domaine : `docs/stories/183/domain-model.md`.

## Objectif

En tant qu'**enfant**, pendant une leçon, je veux voir tout de suite l'exercice et le bouton pour répondre, sans faire défiler l'écran, **afin de rester concentré sur ce que j'apprends**.

Périmètre de ce cadrage : la **séance de leçon** (séance complète et séance d'un exercice), sous réserve de la question 183.1.

## 1. Règles (example mapping) et scénarios

7 règles, 23 scénarios (31 exécutions avec les exemples). Le tag `@a-valider` marque un scénario écrit selon une recommandation : la question liée est indiquée.

| Règle | Scénarios | Questions |
|---|---|---|
| **R1.** Pendant la séance, une seule barre du haut remplace l'en-tête de l'application : Retour, nom de la leçon, son, et l'avancement de la séance (décisions 1 et 2) | Pendant la séance, Léa voit la barre du haut et plus l'en-tête de l'application · `<moment>`, l'avancement de la séance se lit « `<compteur>` » dans la barre du haut (0 / 15, 1 / 15) · Une question réussie fait avancer la barre de progression, avec un éclat sur le compteur `@a-valider` | 183.7, 183.9 |
| **R2.** Avant la première réponse de la séance, Retour ramène à la page de la leçon ; à partir d'elle, Retour ouvre la pause ; le geste retour fait de même (décisions 3 et 4) | Avant la première réponse, `<geste>` `<moment>` ramène à la page de la leçon (3 exemples) · Après une première réponse `<réponse>`, `<geste>` ouvre la pause (3 exemples) · « Je ne sais pas » compte comme la première réponse : Retour ouvre la pause `@a-valider` · Dans une fluence, le chrono démarré sans aucune réponse ne suffit pas : Retour ramène à la page de la leçon `@a-valider` | 183.4, 183.5 |
| **R3.** La pause attend l'enfant sans rien lui reprocher : il continue la leçon là où il en était, ou retourne à la page de la leçon (décision 3) | `<geste>` ferme la pause : Léa retrouve sa question là où elle en était (« Je continue la leçon », Échap) · « Retour à la leçon » ramène à la page de la leçon et coupe la voix, comme quitter la séance aujourd'hui · Ouvrir la pause arrête la voix du personnage guide `@a-valider` | 183.15 |
| **R4.** Pendant une question, la consigne prend toute la largeur de la bulle, sans le personnage guide ; il n'apparaît que quand il réagit, puis la consigne revient (décision 5) | Pendant une question, la consigne s'affiche seule dans la bulle, sans le personnage guide · À une réponse juste, Noisette apparaît pour féliciter Léa, puis la consigne revient avec la question suivante · À la première réponse fausse, Coach Léo joue sa scène à la place de la bulle, puis la consigne revient et la question reste posée · À une réponse fausse suivante, Noisette apparaît pour encourager Léa, puis la consigne revient `@a-valider` | 183.11, 183.12 |
| **R5.** Un seul bouton « Réécouter » : pendant une question, il relit la consigne ; pendant que le personnage guide réagit, il redit sa phrase (décision 6) | Pendant une question, « Réécouter » relit la consigne, et « Relire la consigne » n'est plus un bouton à part · Dans un exercice bulles, « Réécouter » relit la consigne, puis la question `@a-valider` · Pendant que le personnage guide réagit à une réponse, « Réécouter » redit sa phrase `@a-valider` | 183.6, 183.13, 183.14 |
| **R6.** La barre d'action, en bas, porte le bouton principal toujours au même endroit et « Je ne sais pas » à côté ; elle n'apparaît que s'il y a une action (décision 7) | Dans un calcul au clavier de cristaux, « Valider » et « Je ne sais pas » sont dans la barre d'action `@a-valider` · Pendant les étapes de leçon, « Continuer » est le bouton principal de la barre d'action · Dans un exercice bulles, l'enfant répond en touchant une bulle : la barre d'action ne porte que « Je ne sais pas » `@a-valider` | 183.3, 183.16 |
| **R7.** L'écran de séance s'adapte à l'enfant : petit écran sans défilement, mouvements réduits, mode dys, cibles assez grandes (règles connues de l'issue) | Sur un téléphone de 360 × 740 px, `<exercice>` commence au plus à 200 px du haut, sans défilement de côté (bulles, calcul au clavier) · Avec les mouvements réduits, `<ce qui change>` sans mouvement (avancement, pause) · En mode dys, sur 360 px, le nom de leçon le plus long tient sur deux lignes, sans mot coupé | 183.2 |

Exemples retenus : leçon « Les sons ou, on, an » (15 questions, exercice bulles « Quel son entends-tu ? », exercice classer « Les maisons des sons ») ; « Le mot en morceaux » de « Les syllabes » (#79) ; la question de test « Combien font 3 + 4 ? » (#163) ; le calcul « 12 − 5 » de Tom en CE1 (#20) ; la fluence « Calcul rapide : les doubles » ; le nom de leçon le plus long de la bibliothèque, « Lire une œuvre : Vingt mille lieues sous les mers » (CM2, 49 caractères).

Aucun scénario `@acces` : la story ne lit ni n'enregistre aucune donnée nouvelle (rien côté serveur, aucune policy RLS touchée). Le parent ne reçoit aucun nouvel accès ; la façon dont il rejoint l'Espace parent depuis une séance est la question 183.7.

### Hors périmètre

- Le profil compact et le dock avec icônes hors séance (issue suivante, d'après l'issue).
- Le test de départ, la séance de révision et la séance de défi (question 183.1).
- La fin de la séance : étoiles, célébration de #106, avec l'en-tête et le personnage guide actuels (question 183.8).
- Aucun changement de règle d'apprentissage : la pause ne met pas la séance en pause dans le domaine ; « Retour à la leçon » perd la séance en cours, comme aujourd'hui (#16, « Une séance quittée recommence du début »).

## 2. Scénarios existants touchés

Source : inventaire par lecture des steps (aucun test lancé). Tous ces scénarios restent dans leurs fichiers : **rien n'est modifié dans ce passage**, ce sont des propositions.

### 2.a À réécrire (le texte Gherkin change) : à valider par le PO

8 exécutions sûres, plus 12 qui dépendent d'une question (indiquée).

**Sûres (liées aux décisions 1 et 5, et à la question 183.7 pour #73)**

1. **#73:85**, Plan « Pendant la lecture d'une consigne, `<ce que fait Léa>` arrête la voix » (2 exemples). L'Espace parent et le nom de l'application ne sont plus visibles pendant la séance. On garde la règle (« en arrivant sur un écran du parent, la lecture en cours s'arrête ») en faisant parler Noisette sur l'accueil (étape qui existe déjà dans #73) :
   ```diff
   - Plan du Scénario: Pendant la lecture d'une consigne, <ce que fait Léa> arrête la voix
   + Plan du Scénario: Pendant que Noisette salue Léa sur son accueil, <ce que fait Léa> arrête la voix
   -   Et que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
   +   Et que Noisette est en train de saluer Léa sur son accueil
   ```
   Exemples inchangés.
2. **#73:104**, « La consigne coupée ne reprend pas dans l'espace parent » :
   ```diff
   - Scénario: La consigne coupée ne reprend pas dans l'espace parent
   + Scénario: La salutation coupée ne reprend pas dans l'espace parent
   -   Et que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
   +   Et que Noisette est en train de saluer Léa sur son accueil
   ```
3. **#73:120**, « Après avoir renoncé au contrôle parental, Léa réécoute la question » : l'enfant ne peut plus demander l'Espace parent depuis la question.
   ```diff
   - Scénario: Après avoir renoncé au contrôle parental, Léa réécoute la question
   + Scénario: Après avoir renoncé au contrôle parental depuis la page de la leçon, la séance est lue à Léa
   -   Et que Léa joue la question de test « Combien font 3 + 4 ? »
   -   Et que Léa a demandé l'entrée de l'espace parent, puis a renoncé à répondre au contrôle parental
   -   Quand Léa demande à réécouter la question
   -   Alors Léa entend Noisette lire « Combien font 3 plus 4 ? »
   +   Et que Léa est sur la page de la leçon « Les sons ou, on, an »
   +   Et que Léa a demandé l'entrée de l'espace parent, puis a renoncé à répondre au contrôle parental
   +   Quand Léa commence la séance complète
   +   Alors Léa entend Noisette lire la première étape de leçon
   ```
4. **#96:144**, Plan « Sur `<écran>`, Léa voit `<personnage guide>` dans le paysage » : le personnage guide n'est plus là quand la séance s'ouvre.
   ```diff
   -   | Pompiers            | Capitaine Sam    | la séance de la leçon « Les sons ou, on, an »           |
   ```
   La présence du personnage guide pendant la séance est décrite par #183 (R4).
5. **#96:214**, « Sur un écran de 360 px, le personnage guide ne cache ni la consigne ni les choix » :
   ```diff
   - Scénario: Sur un écran de 360 px, le personnage guide ne cache ni la consigne ni les choix
   + Scénario: Sur un écran de 360 px, le personnage guide qui félicite ne cache pas les choix de la question
   -   Quand Léa arrive sur la séance de la leçon « Les sons ou, on, an »
   +   Et que Léa joue la séance complète de la leçon « Les sons ou, on, an »
   +   Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
   +   Quand Léa répond « ou »
       Alors elle voit Capitaine Sam dans le paysage de l'univers « Pompiers »
   -   Et la consigne et tous les choix de la question restent visibles en entier
   +   Et tous les choix de la question restent visibles en entier
   ```
6. **#102:269**, Plan « Sur `<écran>`, Noisette porte la tenue choisie » : on retire l'exemple de la séance, et on ajoute à #102 un scénario de réaction.
   ```diff
   -   | la séance de la leçon « Les sons ou, on, an »           |
   + Scénario: Pendant la séance, Noisette qui félicite Léa porte la tenue choisie
   +   Étant donné que Léa a gagné 5 étoiles en tout
   +   Et que Léa a mis « une écharpe rayée » à Noisette
   +   Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? » de la séance complète de la leçon « Les sons ou, on, an »
   +   Quand Léa répond « ou »
   +   Alors elle voit Noisette avec « une écharpe rayée » dans le paysage de l'univers « Animaux de la forêt »
   ```
7. **#102:332**, « Sur un écran de 360 px, le personnage guide habillé ne cache ni la consigne ni les choix » : même réécriture que le point 5 (Quand Léa répond « ou » ; « tous les choix de la question restent visibles en entier »).

Total sûr : #73 ×4, #96 ×2, #102 ×2 (dont un scénario ajouté) = **8 exécutions réécrites**, plus la capture du point 2.c.

**Selon la question 183.9 (points qui volent, recommandation B)** : 7 exécutions.

8. **#97:120** (Plan, 2 exemples), **#97:134**, **#97:142**, **#97:150**, **#97:379**, **#163:249** :
   ```diff
   - Alors un point vole jusqu'au récipient
   + Alors la barre de progression avance, avec un éclat sur le compteur
   - Mais aucun point ne vole jusqu'au récipient
   + Mais la barre de progression n'avance pas
   ```
   Pour #97:120 (fluence, sans barre qui avance) : « sans point qui vole » devient « sans éclat sur le compteur ». Pour #97:379 (mouvements réduits) : « le point s'ajoute au récipient sans voler » devient « la barre de progression avance d'un coup, sans éclat ». Le titre de la règle de #97 passe de « fait voler un point jusqu'au récipient » à « fait avancer la barre de progression, avec un éclat ». L'effet sonore garde son nom « point du récipient ».

**Selon la question 183.11 (consigne pendant une réaction, recommandation A)** : 4 exécutions.

9. **#79:95**, « Avec la voix, la consigne reste visible pendant l'encouragement du personnage guide », et la règle de #79 « La consigne reste visible jusqu'à la fin de l'exercice, quoi que dise le personnage guide » :
   ```diff
   - Règle: La consigne reste visible jusqu'à la fin de l'exercice, quoi que dise le personnage guide
   + Règle: La consigne reste jusqu'à la fin de l'exercice ; quand le personnage guide réagit, elle revient dès qu'il a fini
   - Scénario: Avec la voix, la consigne reste visible pendant l'encouragement du personnage guide
   + Scénario: Avec la voix, la consigne revient après l'encouragement du personnage guide
   -   Et Léa voit la consigne « Range chaque mot dans la maison de son son. »
   +   Et ensuite, Léa voit de nouveau la consigne « Range chaque mot dans la maison de son son. »
   ```
10. **#79:81** et **#79:88** (en Muet, après une étiquette bien posée et après une erreur) : même changement « Et ensuite, Léa voit de nouveau la consigne… », si le personnage guide réagit à ces réponses.
11. **#163:59** :
    ```diff
    - Et Coach Léo n'apparaît qu'une fois, à sa place, la bulle gardant ses paroles
    + Et Coach Léo n'apparaît qu'une fois, à la place de la bulle de la consigne, avec ses paroles
    ```

**Selon la question 183.3 (recommandation A, « Valider » dans la barre d'action)** : 1 exécution, plus 2 à relire.

12. **#20:34** :
    ```diff
    - Alors Tom voit le clavier de cristaux, avec les chiffres de 0 à 9, « Effacer » et « Valider »
    + Alors Tom voit le clavier de cristaux, avec les chiffres de 0 à 9 et « Effacer », et « Valider » dans la barre d'action
    ```
    À relire, texte probablement inchangé : #128:195 (« Valider » rebondit) et #128:426 (« Effacer » et « Valider » gardent leur aspect commun).

**Récapitulatif** : 8 exécutions sûres, plus 12 qui dépendent des questions 183.3, 183.9 et 183.11 (7 + 4 + 1), soit **20 exécutions réécrites au plus**.

### 2.b Seule l'implémentation du step change (même sens, texte inchangé)

Ces scénarios n'ont pas besoin de validation du PO ; leurs steps sont adaptés pendant la phase E2E.

| Ce que dit le step | Nouvelle implémentation | Scénarios |
|---|---|---|
| Léa a quitté la séance après une réponse (« Retour » puis attente du récipient à 0) | Retour, puis « Retour à la leçon » dans la pause | 16:194, 24:200, 28:58, 29:372 (@wip), 30:114, 33:111 (@wip), 101:232, 163:144 ex. 2 |
| « Léa quitte l'écran de la consigne » (#7:34) : touchait « Savanturier » dans l'en-tête | Retour avant toute réponse : le texte « Léa quitte l'écran de la consigne / n'entend plus Noisette » reste vrai | 7:34 |
| « Léa demande à réécouter la consigne » : touchait « Relire la consigne » | Touche l'unique « Réécouter » pendant la question. Le glossaire garde « Relire la consigne » pour l'action (complément « Réécouter », #183) : le texte reste juste | 7:28, 79:120, 79:127, 79:135, 79:142, 97:438 ex. 1, 97:464 ; consigne-visible.steps.ts:47-60 |
| « Léa passe en Muet », « le son peut être activé par … » : bouton « Son » dans l'en-tête (rôle banner) | Bouton « Son » de la barre du haut (même nom accessible) | 7:114, 17:175, 19:154, 129:194 et 129:215 (@wip) |
| « Valider » cherché dans le clavier de cristaux | Cherché dans la barre d'action (si 183.3 A) | environ 20 scénarios de #20, #21, #23, #128, #131 (calcul-fluence-addition.steps.ts:259, claviers.steps.ts:402, claviers.steps.ts:1031 : 11 touches au lieu de 12) |
| « Léa demande à réécouter (la question) » | Touche l'unique « Réécouter » ; si 183.13 est retenue, la consigne est lue avant la question : l'assertion doit accepter la consigne d'abord | 16:93, 17:43, 7:153, 73:125, 79:173, 163:229, 131:200, 131:233 ; 126:84 et 129:103/111/144 (@wip) |
| « Réécouter » inactif pendant une félicitation (aria-disabled) | Selon 183.14 : inchangé si la recommandation est retenue | 17:66, 97:351, 126:255 |
| « Chaque commande de la séance mesure au moins 44 px » (région qui contient `recipient`) | La barre du haut garde le repère `recipient` et ses valeurs ; la séance reste une région nommée | 16:222 ; 38:375/383 (@wip) |
| Personnage guide visible pendant une réaction (humeur, geste, visage) | Passent si le personnage guide est présent au moment de la réaction (R4) | 6:66…192, 16:79, 17:52/75, 18:29, 19:135, 23:23, 96:195, 97:52/78/344, 127:94, 163:83…491 |
| « … et « Je ne sais pas » se voient sans faire défiler l'écran » | « Je ne sais pas » est dans la barre d'action, toujours visible | 127:428, 130:303, 131:457 |
| « Continuer » après la réussite (classe `.continuer-apres-la-reussite`) | Bouton principal de la barre d'action, qui garde ce repère | etoiles-et-fin-de-seance.steps.ts:148 |

Le repère `recipient` (avec `data-questions-reussies` et `data-total`) sert à environ 30 scénarios d'assertion directe et indirectement à toutes les séances : la barre de progression doit le garder.

### 2.c Capture de référence à regénérer

- **#96:359** `@visuel`, capture `exercice-en-seance` : le texte ne change pas, l'image change à coup sûr. Elle est regénérée dans un commit dédié, après validation de la nouvelle image par le PO (règle de #96, réponse 96.9). La capture `fin-de-la-seance` ne change pas si la question 183.8 suit la recommandation.

## 3. Questions ouvertes

Chaque question est écrite pour être lue sans autre contexte. « Reco » donne la recommandation de l'équipe ; les scénarios `@a-valider` la suivent.

1. **183.1 Test de départ, séance de révision et séance de défi.** La nouvelle présentation (barre du haut, pause, barre d'action, personnage guide qui n'apparaît que quand il réagit) s'applique-t-elle aussi à ces trois écrans dans cette story, ou dans une story suivante ?
   *Reco : story suivante.* Cette story ne traite que la séance de leçon. Le récipient de progression, les exercices et « Je ne sais pas » sont des pièces partagées avec ces trois écrans : on les modifie de façon que ces écrans restent exactement comme aujourd'hui. La règle de la première réponse (183.4) s'appliquera à chacun, par la même lecture du domaine.

2. **183.2 Tablette en paysage.** Sur une tablette tenue à l'horizontale, où la hauteur ne manque pas, garde-t-on le personnage guide à côté de la bulle de la consigne ?
   *Reco : non, même présentation partout.* C'est plus simple pour l'enfant qui passe du téléphone à la tablette, et il y a moins de cas à construire et à tester.

3. **183.3 « Je ne sais pas » et « Valider » dans la barre d'action : tous les types d'exercices maintenant, ou d'abord certains ?** Aujourd'hui « Je ne sais pas » est dessiné à 5 endroits (12 types d'exercices sur 14 ; absent de la fluence et de memoriser), et « Valider » est une touche du clavier de cristaux (5 types : calcul, boîte, barres, addition au clavier, fluence).
   - A. Tous les types dans cette story : « Je ne sais pas », « Valider » et « Continuer » vont dans la barre d'action. Le clavier de cristaux garde ses chiffres et « Effacer ».
   - B. D'abord les types à choix et le calcul ; les autres dans une story suivante.
   - C. « Je ne sais pas » et « Continuer » partout ; « Valider » reste dans le clavier de cristaux, qui est déjà en bas de l'écran, sous le pouce.
   *Reco : A.* La décision 7 veut le bouton principal « toujours au même endroit » : avec B, il changerait de place d'un exercice à l'autre pendant une même séance. Le coût de A est proche de celui de B, car « Valider » n'est dessiné qu'à un endroit. C serait la solution la plus légère, mais elle s'écarte de la décision 7. Effet : un scénario de #20 réécrit (« Tom voit le clavier de cristaux… »), une vingtaine de steps adaptés.

4. **183.4 « Je ne sais pas » compte-t-il comme la première réponse de la séance ?** Exemple : Léa ouvre un exercice, touche « Je ne sais pas » tout de suite, puis Retour. Voit-elle la pause (oui) ou revient-elle à la page de la leçon (non) ?
   *Reco : oui.* « Je ne sais pas » est déjà une réponse permise au glossaire, il peut coûter une erreur, et l'enfant a commencé à travailler.

5. **183.5 Fluence : le démarrage du chrono suffit-il ?** Léa démarre le chrono d'une fluence, ne répond rien, puis touche Retour. Pause ou page de la leçon ?
   *Reco : page de la leçon.* Seule une réponse compte, comme partout ailleurs.

6. **183.6 Dictée et memoriser.** Ces deux types n'ont pas de consigne affichée. Pendant une question, l'unique « Réécouter » garde-t-il son comportement d'aujourd'hui (redire ce que dit le personnage guide : le mot dicté, le vers) ?
   *Reco : oui, rien ne change pour ces deux types.*

7. **183.7 Comment le parent rejoint-il l'Espace parent pendant une séance ?** L'en-tête de l'application (« Savanturier », prénom et classe, Espace parent) disparaît pendant la séance.
   *Reco : par Retour.* Avant la première réponse, Retour ramène à la page de la leçon ; après, la pause propose « Retour à la leçon ». La page de la leçon garde l'en-tête et son accès à l'Espace parent, derrière le contrôle parental. Effet : 4 scénarios de #73 réécrits (point 2.a, 1 à 3) ; ils font parler Noisette sur l'accueil au lieu de la séance, la règle reste la même.

8. **183.8 Fin de la séance.** L'écran de fin (étoiles, célébration de l'univers de #106) garde-t-il l'en-tête de l'application et le personnage guide comme aujourd'hui ?
   *Reco : oui, hors périmètre.* La story parle de l'écran pendant la leçon ; à la fin, il n'y a plus d'exercice à laisser voir et la célébration a besoin du personnage guide.

9. **183.9 Les points qui volent jusqu'au récipient.** Une question réussie fait aujourd'hui voler un point jusqu'au récipient (#97, #163). La barre de progression continue n'a plus de points.
   - A. Garder les mots « un point vole jusqu'au récipient » dans les scénarios, en les comprenant comme la barre qui avance.
   - B. La barre de progression s'allonge avec un petit éclat sur la pastille du compteur ; avec les mouvements réduits, elle avance d'un coup, sans éclat. On réécrit les scénarios : « un point vole jusqu'au récipient » devient « la barre de progression avance, avec un éclat sur le compteur ».
   *Reco : B.* Un scénario doit décrire ce que l'enfant voit vraiment : il n'y a plus ni point ni récipient à l'écran. 7 exécutions réécrites (#97 ×6, #163 ×1). L'effet sonore garde son nom « point du récipient ». La définition « Avancement de la séance » du glossaire, qui dit « Interface : le récipient et ses points », dirait alors « la barre de progression et le compteur ».

10. **183.10 Capture de référence de l'exercice en séance.** La capture `exercice-en-seance` (#96, `@visuel`) change forcément.
    *Reco : la regénérer dans un commit dédié, après que le PO a validé la nouvelle image* (règle de #96).

11. **183.11 La consigne pendant une réaction du personnage guide.** La décision 5 dit que le personnage guide apparaît « à la place de la bulle » quand il réagit, puis que la consigne revient. Or #79 avait décidé que la consigne reste visible du début à la fin de l'exercice, « quoi que dise le personnage guide ».
    - A. Pendant la réaction, le personnage guide et sa phrase prennent la place de la bulle ; la consigne revient dès qu'il a fini de parler (en Muet, après la durée d'affichage sans voix).
    - B. La consigne reste toujours visible ; le personnage guide apparaît en petit au-dessus d'elle pour réagir.
    *Reco : A*, c'est ce que dit la décision 5 et c'est ce qui laisse le plus de place. La réaction est courte (la scène de réponse fausse dure 1,5 s au plus) et « Réécouter » relit la consigne dès qu'elle est revenue. Effet : 4 scénarios réécrits (#79 ×3, #163 ×1) et la définition « Consigne affichée » du glossaire (« hors de la bulle du personnage guide ») à compléter.

12. **183.12 Quand le personnage guide apparaît-il ?** La décision 5 cite la réussite et la scène de réponse fausse. Apparaît-il aussi pour une réponse fausse suivante (il réfléchit en penchant la tête et encourage), après « Je ne sais pas » (bonne réponse montrée et aide), pour l'annonce du jeu suivant, et pendant les étapes de leçon (il explique la leçon dans sa bulle) ?
    *Reco : oui, chaque fois qu'il dit autre chose que la consigne ou la question.* Pendant les étapes de leçon il n'y a pas encore d'exercice à laisser voir.

13. **183.13 Ce que relit « Réécouter » pendant une question qui a une consigne et une question** (exercice bulles, par exemple « Touche le bon nombre. » puis « Combien font 2 + 1 ? »).
    *Reco : la consigne, puis la question,* comme à leur affichage. L'enfant n'a qu'un bouton : il doit pouvoir réentendre tout ce qui lui est demandé.

14. **183.14 Jusqu'à quand « Réécouter » redit-il la phrase du personnage guide après une réponse ?**
    *Reco : tant que le personnage guide est montré.* Dès que la consigne revient, « Réécouter » relit la consigne. Comme aujourd'hui, il reste inactif pendant la félicitation dite entre deux questions (sinon il retarderait la question suivante) ; il est actif pour l'encouragement et l'aide après une réponse fausse, et pour une félicitation qui attend « Continuer ».

15. **183.15 La voix quand la pause s'ouvre.**
    *Reco : la voix du personnage guide s'arrête quand la pause s'ouvre, et « Je continue la leçon » ne relit rien tout seul.* L'enfant a « Réécouter » s'il veut réentendre la consigne.

16. **183.16 Quand la barre d'action est-elle absente ?** La décision 7 dit qu'elle n'apparaît que s'il y a une action, par exemple pas pour une réponse par bulle.
    *Reco : elle apparaît dès qu'il y a au moins un bouton, « Je ne sais pas » compris.* Dans un exercice bulles, elle ne porte que « Je ne sais pas » (ni « Valider » ni « Continuer »). Elle est absente pendant la félicitation dite entre deux questions et dans memoriser quand aucun bouton n'est proposé.

## Termes

Aucun terme nouveau en dehors de ceux déjà proposés au glossaire par le modèle du domaine (« Première réponse de la séance », « Pause », complément « Réécouter », tous à valider). « Barre du haut », « barre d'action », « barre de progression », « compteur », « pastille », « bulle » et « éclat » restent des mots d'interface, hors glossaire, comme « récipient ».
