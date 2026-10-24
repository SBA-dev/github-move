# Critères d'acceptance : #58 Retirer la page de démonstration

## Objectif

En tant que **parent**, je veux que l'application ne contienne que des écrans réels, afin que mon enfant ne tombe jamais sur une page de test et que les tests vérifient ce qu'il vit vraiment.

La story ne crée aucune règle métier. Elle retire la page de démonstration (décision n°1 de `docs/stories/lot-1-decisions.md`) et déplace chaque comportement qu'elle servait à vérifier vers un écran réel :
- une **vraie séance** : page de la leçon, consigne d'un exercice, question à choix (#16, #17, #23) ;
- l'**accueil de l'enfant**, où il arrive après « Qui joue ? » (#11) ;
- « **Qui joue ?** ».

Les scénarios réécrits restent dans leur fichier d'origine. Ils gardent le tag de leur fonctionnalité (`@issue-6`…) et reçoivent `@issue-58`.

Écrans réels utilisés :
- la **question de test** « Combien font 3 + 4 ? » (choix « 6 », « 7 », « 8 », « 9 », de réponse « 7 ») de #17 et #23 : « 7 » est une bonne réponse, « 8 » une erreur ;
- la **consigne d'un exercice d'une leçon de test**, lue et affichée dans la bulle du personnage guide au début de l'exercice (séance d'un exercice) ;
- l'**accueil de l'enfant** : « Léa commence à jouer » y mène désormais.

## Règles

| Règle | Scénarios |
|---|---|
| R1. L'ancienne adresse de la page de démonstration mène à l'accueil, comme toute adresse inconnue | `58` : « Sans connexion, l'ancienne adresse de la page de démonstration invite le parent à se connecter » ; « Avec un parent connecté, l'ancienne adresse de la page de démonstration montre « Qui joue ? » » ; « Un enfant en train de jouer qui ouvre l'ancienne adresse ne voit aucune page de test » |
| R2. La version publiée ne contient aucune page ni porte de test (vérifiée sur le build de production, comme toute la #8) | `8` : « Dans la version publiée, l'ancienne adresse de la page de démonstration mène à l'accueil » ; « Dans la version publiée, un profil enfant préparé pour les tests ne fait jouer personne » |
| R3. Chaque comportement vérifié sur la page de démonstration reste vérifié sur un écran réel | les 27 scénarios réécrits de #6, #7, #12 et #15 (tableau ci-dessous), plus les scénarios dont seul le step change (second tableau) |

Les deux scénarios de R2 sont dans `features/8-pwa-installable.feature`, parce que seul ce fichier tourne sur le build de production (`playwright.pwa.config.ts`). Le second est un scénario de droits d'accès (la porte de test est fermée en production). Il n'a pas le tag `@acces` parce que la configuration PWA exclut ce tag (`tags: "not @acces"`). Il serait sinon jamais exécuté.

## Correspondance ancien scénario → nouveau scénario

### Scénarios réécrits, supprimés ou ajoutés

| Fichier | Ancien scénario | Devenir | Nouveau scénario (fichier, titre) |
|---|---|---|---|
| 6 | Plan « <personnage guide> se présente avec son titre et son royaume » (6 exemples) | **supprimé** (#58.4) | aucun écran réel ne montre la présentation ; la phrase reste vérifiée par le test unitaire `presentation` du domaine Motivation |
| 6 | Le personnage guide applaudit après une bonne réponse | réécrit | 6, même titre : question de test, Léa répond « 7 » |
| 6 | Le personnage guide réfléchit après une erreur | réécrit | 6, même titre : question de test, Léa répond « 8 » |
| 6 | Après avoir réfléchi, le personnage guide applaudit la bonne réponse suivante | réécrit | 6, même titre : Léa a répondu « 8 », puis répond « 7 » |
| 6 | Plan « Après une bonne réponse, <personnage guide> dit une félicitation commune ou une de ses expressions » (6 univers) | réécrit | 6, même titre : question de test dans chacun des 6 univers |
| 6 | Les félicitations communes sont les mêmes dans tous les univers | réécrit | 6, même titre : leçon de test de deux questions à quatre choix (#23), Léa répond « 7 » |
| 6 | Après une erreur, le personnage guide encourage sans punir | réécrit | 6, même titre : Coach Léo, Léa répond « 8 » |
| 6 | Avec les mouvements réduits, le personnage guide ne saute pas mais son visage montre qu'il applaudit | réécrit | 6, même titre : Léa répond « 7 » |
| 6 | Avec les mouvements réduits, le personnage guide ne penche pas la tête mais son visage montre qu'il réfléchit | réécrit | 6, même titre : Léa répond « 8 » |
| 7 | La consigne est lue à voix haute dès qu'elle s'affiche | réécrit (#58.8) | 7, même titre : « Et la consigne reste affichée à l'écran » devient « Et Léa voit la consigne « … » » |
| 7 | L'enfant peut réécouter la consigne | **supprimé** (#58.6) | redondant avec #17 « L'enfant peut réécouter la question » et #16 « « Réécouter » relit la dernière phrase du personnage guide » |
| 7 | La mise en forme de la consigne n'est jamais prononcée | **supprimé** (#58.7) | le format des leçons n'a pas de mise en forme (gras) ; les guillemets sont couverts par l'exemple « Lis le mot « maman ». » du plan « Les symboles d'une consigne sont dits avec des mots » |
| 7 | Un texte sans rien à dire n'est pas lu | réécrit (#58.8) | 7, même titre : une question de test « ___ » |
| 7 | Une consigne en anglais est lue avec une voix anglaise | **supprimé** (#58.7) | redondant avec #17 « La question est lue, puis le mot à écouter est dit par la voix anglaise » ; aucune consigne n'a de langue dans le format |
| 7 | En Muet, la consigne s'affiche sans être lue | réécrit (#58.8) | 7, « En Muet, la question s'affiche sans être lue » |
| 7 | Quand la voix est bloquée, l'enfant est prévenu sans être bloqué | réécrit (#58.8) | 7, même titre : sur la question de test |
| 7 | Réécouter permet de réessayer quand la voix était bloquée | réécrit (#58.8) | 7, même titre : la voix bloquée pendant la question, « Léa demande à réécouter la question » (#17) |
| 7 | Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même | réécrit (#58.8) | 7, même titre : Léa répond « 7 », la question est réussie |
| 12 | Avec le mode dys, la consigne s'affiche en police Andika et avec un texte espacé | réécrit | 12, même titre : l'étape « Léa est sur la page de démonstration » est retirée |
| 12 | Sans le mode dys, la consigne s'affiche comme d'habitude | réécrit | 12, même titre : idem |
| 12 | Avec le mode dys, ce que dit le personnage guide s'affiche aussi en mode dys | réécrit | 12, même titre : question de test, Léa répond « 7 » |
| 12 | Avec le mode dys, les syllabes des mots de plus de trois lettres sont en couleurs alternées | réécrit | 12, même titre : étape de la page de démonstration retirée |
| 12 | En mode dys, le mot prononcé est toujours surligné pendant la lecture | réécrit | 12, même titre : idem |
| 12 | Le mode dys suit le profil en cours, pas l'appareil | réécrit (#58.10) | 12, même titre : « Alors Tom voit son accueil sans le mode dys » |
| 12 | Un réglage changé pendant que Léa joue s'applique au prochain choix de son profil | réécrit (#58.10) | 12, même titre : « Alors Léa voit son accueil en mode dys » |
| 12 | Le mode dys réglé sur la tablette s'applique quand Léa joue sur le téléphone | réécrit (#58.10) | 12, même titre : idem |
| 12 | Le mode dys s'applique aussi sans réseau (`@depend-de-44`) | réécrit (#58.10) | 12, même titre : idem, toujours `@depend-de-44` |
| 12 | En mode dys, la page de démonstration tient dans un écran de 360 px | réécrit (#58.11) | 12, « En mode dys, une question de lecture tient dans un écran de 360 px » |
| 12 | Avec « tout lire à voix haute », les choix proposés sont lus après la consigne | **supprimé** (#58.3) | redondant avec #17 « Avec « tout lire à voix haute », Noisette lit les choix dans l'ordre affiché » |
| 12 | Avec deux choix proposés, la question n'a que deux choix | réécrit (#58.3) | 12, « Avec deux choix proposés, le personnage guide ne lit que ces deux choix » (question de test « ami » / « lune ») |
| 12 | Avec un seul choix proposé, seule la consigne est lue | **supprimé** (#58.3) | cas impossible dans une vraie séance : le Catalogue refuse une question qui n'a pas deux choix différents |
| 12 | Sans « tout lire à voix haute », la consigne est lue mais pas les choix proposés | **supprimé** (#58.3) | redondant avec #17 « Sans « tout lire à voix haute », les choix ne sont pas lus » |
| 12 | En Muet, « tout lire à voix haute » ne fait rien lire | réécrit (#58.3) | 12, même titre : question de test « Combien font 3 + 4 ? » |
| 15 | Une consigne en anglais garde la voix anglaise malgré la voix imposée | réécrit (#58.7) | 15, « Le mot à écouter garde la voix anglaise malgré la voix imposée » (item « a cat » de « Quel animal ? ») |
| 8 | (aucun) | **ajouté** | 8, « Dans la version publiée, l'ancienne adresse de la page de démonstration mène à l'accueil » |
| 8 | (aucun) | **ajouté** | 8, « Dans la version publiée, un profil enfant préparé pour les tests ne fait jouer personne » |
| 58 | (aucun) | **ajouté** | les 3 scénarios de R1 |

Bilan : 27 scénarios réécrits (6 : 8, 7 : 6, 12 : 12, 15 : 1), 7 supprimés (6 : 1, 7 : 3, 12 : 3), 5 ajoutés (8 : 2, 58 : 3).

### Scénarios dont le texte ne change pas (seuls leurs steps quittent la page de démonstration)

Ces scénarios restent valables mot pour mot sur un écran réel : « Léa commence à jouer » mène à l'accueil de l'enfant, « la consigne « … » s'affiche » est la consigne d'un exercice d'une leçon de test. La story doit les exécuter (tags `@issue-5`, `@issue-6`, `@issue-7`, `@issue-8`, `@issue-10`, `@issue-12`, `@issue-15`).

| Fichier | Scénarios | Étapes qui ouvraient la page de démonstration |
|---|---|---|
| 5 | En dehors de l'espace parent, la déconnexion n'est pas proposée | « Léa commence à jouer » |
| 6 | Plan « Dans l'univers « <univers> », le personnage guide est <personnage guide> » ; Deux univers différents donnent deux paysages… ; Plan « Un profil enfant <cas> joue avec Noisette » ; Le personnage guide est content quand l'enfant commence à jouer ; L'en-tête montre le prénom et le niveau… ; Le nom de l'application ramène à l'accueil ; L'en-tête s'utilise au clavier ; Plan « L'univers tient dans la largeur d'un écran de <largeur> px » ; Avec les mouvements réduits, le paysage reste immobile | « Léa commence à jouer », « Léa joue », « Léa parcourt l'en-tête au clavier », « Léa et Tom commencent à jouer, chacun sur sa tablette » |
| 7 | Le mot prononcé est surligné pendant la lecture ; Une nouvelle lecture coupe la lecture en cours ; Quitter l'écran coupe la voix ; Plan « Les symboles d'une consigne sont dits avec des mots » ; Un trou à compléter est lu comme un silence ; Plan « Le personnage guide parle avec sa voix à lui » ; La voix la plus naturelle de l'appareil est choisie ; Sans voix d'homme sur l'appareil… ; Sans univers choisi, c'est Noisette qui lit ; Passer en Muet coupe la lecture en cours ; Le Muet reste choisi au lancement suivant ; En remettant le son, le personnage guide se présente ; Le message de voix bloquée n'apparaît qu'une fois | « la consigne « … » s'affiche », « Noisette est en train de lire la consigne « … » », « Léa a passé la tablette en Muet », « Léa relance Savanturier », « Léa remet le son », « Léa a déjà vu le message de voix bloquée », « la consigne suivante s'affiche » |
| 8 | Une nouvelle version s'applique au lancement suivant (rouge sur `main`) | « Léa relance Savanturier » (voir ci-dessous) |
| 10 | Sans bonne réponse, l'enfant qui joue ne voit pas l'espace parent ; Léa renonce à la question du contrôle parental et retrouve son jeu ; En quittant l'espace parent, Paul arrive sur « Qui joue ? » | « Léa joue », « Léa revient là où elle jouait », « Léa jouait avant que Paul entre dans l'espace parent » |
| 12 | L'enfant ne se voit pas proposer les réglages en jouant (`@acces`) | « Léa commence à jouer », « les réglages ne sont pas proposés à Léa » (attend la consigne de la page de démonstration) |
| 15 | Plan « La voix imposée lit les consignes de <personnage guide> » ; Le caractère du personnage guide s'applique aussi à la voix imposée ; Après le retour à la voix automatique… ; Sans la voix imposée, les consignes sont lues avec la voix automatique… ; Une voix imposée de nouveau installée… ; L'enfant ne peut pas changer la voix en dehors de l'espace parent ; Pour atteindre le choix de voix, il faut répondre au contrôle parental ; La voix imposée sur la tablette ne change pas les autres appareils ; La voix imposée vaut pour tous les profils enfants de l'appareil ; La voix imposée reste choisie au lancement suivant ; La voix imposée reste sur l'appareil après la déconnexion du parent | « la consigne « … » s'affiche » (et « … sur le téléphone », « … pour Tom »), « Léa commence à jouer », « Léa joue », « Léa relance Savanturier » |

### Le scénario de #8 rouge sur `main`

« Une nouvelle version s'applique au lancement suivant » échoue à l'étape **« Quand Léa relance Savanturier »**. Cette étape est définie dans `features/steps/voix.steps.ts` (#7) et réutilisée par #8. Elle appelle `ouvrir(page)`, qui fait `page.goto("/demonstration")` puis attend la consigne (`getByTestId("consigne")`). Elle recharge ensuite la page et attend de nouveau la consigne. Dans le build de production, `/demonstration` renvoie à l'accueil : la consigne n'apparaît jamais et l'étape échoue.

Correction proposée, sans changer le texte : « Léa relance Savanturier » recharge la page déjà ouverte, quelle qu'elle soit, puis attend que l'application soit affichée (l'en-tête), jamais une consigne. Si aucune page n'est encore ouverte dans le scénario (cas de #15 « La voix imposée reste choisie au lancement suivant »), l'étape ouvre d'abord l'écran du scénario, c'est-à-dire la séance de la leçon de test. C'est l'étape suivante (« Léa entend Noisette lire la consigne… ») qui attend la consigne.

## Hors périmètre

- Tout nouveau comportement d'écran : présentation du personnage guide sur l'accueil (#58.4), consigne qui reste visible pendant tout l'exercice (#58.8).
- Le contenu de la bibliothèque : les leçons de test sont injectées par les steps (interception de `/bibliotheque.json`), jamais ajoutées à `app/bibliotheque.json`.
- Le choix de la porte de test des E2E : c'est de l'outillage, pas du métier. Il est tranché à la question #58.1, puis consigné dans une décision.

## Questions ouvertes

Aucune : les onze questions ont été tranchées par le PO (voir « Décisions du PO » ci-dessous).

## Décisions du PO (⛔ n°1, 2026-10-24)

Réponse du PO, recopiée mot pour mot (2026-10-24 vers 21:55 UTC, transmise par le responsable des équipes sur l'issue #64) :

> OK #58 reco partout

Toutes les recommandations s'appliquent. Les tags `@a-valider` des scénarios de #58 sont retirés.

| Question | Décision retenue |
|---|---|
| #58.1 Porte de test des E2E | Le « profil préparé » (`savanturier:profil-prepare`) devient la seule porte de test, active en développement seulement ; plus de `VITE_PAGE_DEMONSTRATION` ; la « consigne préparée » disparaît au profit de leçons de test injectées par les steps ; les scénarios qui ont besoin du serveur gardent un vrai profil. Consigné dans la **décision d'architecture 0021**. |
| #58.2 Humeur après une bonne réponse / une erreur (#6) | Réécrits sur la question de test « Combien font 3 + 4 ? » (« 7 » bonne réponse, « 8 » erreur) ; gardés dans #6 malgré le recoupement avec #17. |
| #58.3 « Tout lire à voix haute » (#12) | Choix lus après la consigne : supprimé. Sans « tout lire à voix haute » : supprimé. Deux choix : déplacé sur la question de test « ami » / « lune ». Un seul choix : supprimé. En Muet : déplacé sur « Combien font 3 + 4 ? ». |
| #58.4 Présentation du personnage guide (#6) | Plan supprimé ; la phrase reste vérifiée par le test unitaire `presentation` du domaine Motivation. |
| #58.5 Écran des consignes (#7, #15) | La consigne d'un exercice `bulles` d'une leçon de test, jouée en séance ; le texte des scénarios ne change pas. |
| #58.6 « L'enfant peut réécouter la consigne » (#7) | Supprimé (redondant avec #16 et #17). |
| #58.7 Consigne en gras, consigne en anglais (#7, #15) | Gras : supprimé. Anglais, voix seule : supprimé. Anglais malgré la voix imposée : réécrit sur le mot à écouter « a cat » de « Quel animal ? ». |
| #58.8 Consigne remplacée par la question après la lecture | Les 6 scénarios de #7 restent portés sur la **question de test**. Le défaut « la consigne disparaît, invisible en Muet » **ne se corrige pas dans #58** : le responsable des équipes ouvre une story de correction (Apprentissage, séance). |
| #58.9 Ancienne adresse `/demonstration` | L'accueil, comme toute adresse inconnue : invitation à se connecter sans connexion, « Qui joue ? » avec un parent connecté ; pas de page « introuvable ». |
| #58.10 « Léa commence à jouer » / « Léa joue » | L'accueil de l'enfant ; en mode dys, « … voit son accueil en mode dys ». |
| #58.11 Mode dys à 360 px | Une question de lecture (« Où dort Plume ? » de « Lecture : Le petit chat Plume »). |

### Reformulation après revue, sans changement de règle

Scénario de R2 « Dans la version publiée, un profil enfant préparé pour les tests ne fait jouer personne » (`features/8-pwa-installable.feature`).

La revue a montré qu'il ne pouvait pas échouer : « Quand j'ouvre Savanturier » ouvre l'accueil, où l'en-tête n'affiche jamais de prénom, que la porte de test soit ouverte ou fermée.

Une première reformulation faisait **commencer à jouer** Léa. Une seconde revue a jugé que cela donnait un double sens à cette étape partagée : partout ailleurs, « Léa commence à jouer » réussit ; ici, elle devait essayer et être refusée. Le scénario ouvre désormais directement l'adresse du jeu, `/jeu`, avec le profil préparé de Léa. C'est la page où la porte de test ferait apparaître son prénom et son niveau dans l'en-tête. Dans la version publiée, aucun enfant n'est en cours : l'application revient à l'accueil.

| | Étape « Quand » |
|---|---|
| Version initiale | `Quand j'ouvre Savanturier` |
| Première reformulation | `Quand Léa commence à jouer` (étape de #6) |
| Après la seconde revue | `Quand Léa ouvre Savanturier à l'adresse « /jeu »` (étape existante de #58, celle des anciennes adresses) |

Le titre, la règle (R2), le « Étant donné » et les « Alors » ne changent pas : « Alors je vois le nom de l'application » (retour à l'accueil), « Mais l'en-tête n'affiche aucun prénom ni aucun niveau » (aucun enfant en cours). Aucune étape existante ne vérifie plus directement un accueil sans enfant en cours : les étapes sur « Qui joue ? » supposent un parent connecté, et « Léa voit son accueil » constate l'inverse.

### Détail des questions et des recommandations

#### #58.1 — Quelle porte de test garde-t-on pour jouer sans connexion dans les E2E ?
Recommandation : **confirmer la piste de l'orchestrateur.**
- Le « profil préparé » (clé `savanturier:profil-prepare`, même format, lu par `useProfilEnCours`) devient la **seule** porte de test.
- Il est actif en développement seulement : plus de variable `VITE_PAGE_DEMONSTRATION`, et le code sort de `src/demonstration/`.
- La « consigne préparée » (`savanturier:consigne-preparee`) disparaît : les consignes et questions de test passent par des leçons de test injectées par les steps, sans aucun code dans l'application.
- Les scénarios qui ont besoin du serveur (séances enregistrées, droits d'accès, réglages relus) continuent de créer un vrai profil (`features/steps/profil-reel.ts`).

Arguments :
1. Aucun changement pour les steps des équipes #27 et #65, qui travaillent en parallèle.
2. Pas de ralentissement : un vrai profil partout, via `connexion-sans-email`, ajouterait une connexion et une écriture Supabase à des centaines de scénarios. Cela consommerait aussi le projet de développement partagé.
3. Le risque de la porte est maîtrisé : elle n'existe que dans le build de développement. Le scénario ajouté à #8 (« un profil enfant préparé pour les tests ne fait jouer personne ») le vérifie sur la version publiée.

À consigner dans une décision (prochain numéro libre : 0021).

#### #58.2 — Les scénarios de #6 « bonne réponse » / « erreur » : les réécrire sur une question d'une vraie séance ?
Recommandation : **oui, sur la question de test « Combien font 3 + 4 ? »**, avec « 7 » pour la bonne réponse et « 8 » pour l'erreur. C'est ce qui est écrit.
- Deux scénarios recoupent #17 : Noisette applaudit après une bonne réponse, et réfléchit après une erreur. On les garde quand même dans #6, parce que la règle de l'humeur appartient à Motivation.
- #6 couvre ce que #17 ne couvre pas : les 6 univers et leurs expressions, la liste des félicitations communes, les encouragements de Coach Léo et les mouvements réduits.
- Le PO peut préférer supprimer ces deux scénarios redondants. La règle n'aurait alors plus que « content » dans #6.

#### #58.3 — Les scénarios de #12 « tout lire à voix haute » (« ami », « lune », « chat ») : supprimés ou déplacés ?
Recommandation, scénario par scénario :
- « les choix proposés sont lus après la consigne » (3 choix) → **supprimé** : c'est exactement #17 « Noisette lit les choix dans l'ordre affiché » (4 choix, « Est-ce 6, 7, 8, ou 9 ? »).
- « Sans « tout lire à voix haute », la consigne est lue mais pas les choix proposés » → **supprimé** : c'est #17 « Sans « tout lire à voix haute », les choix ne sont pas lus ».
- « Avec deux choix proposés » → **déplacé** sur une question de test à deux choix (« ami », « lune ») : c'est le cas limite de la phrase « Est-ce ami, ou lune ? », absent de #17.
- « Avec un seul choix proposé » → **supprimé** : une vraie question a toujours au moins deux choix différents (le Catalogue refuse la leçon sinon). Le cas reste couvert par le test unitaire de `lectureDesChoix`.
- « En Muet » → **déplacé** sur la question de test « Combien font 3 + 4 ? » : absent de #17.

#### #58.4 — La présentation du personnage guide (« Je suis Noisette, l'écureuil savant de la Forêt des Savanturiers ») n'apparaît sur aucun écran réel. Que fait-on du plan de #6 qui la vérifiait ?
Recommandation : **supprimer le scénario.**
- Seule la page de démonstration montrait le titre et le royaume. Le legacy ne les affichait pas non plus.
- La phrase reste vérifiée par le test unitaire du domaine Motivation (`presentation`). Les termes « Titre du personnage guide » et « Royaume » restent `(à valider)` au glossaire.
- La montrer sur l'accueil de l'enfant, après « Bonjour Léa ! », serait un nouveau comportement. Il changerait #11 (« Lili dit « Bonjour Léa ! » ») et relèverait d'une story de Motivation (lot 5, épisodes et histoire de l'univers), pas d'un retrait d'écran.

#### #58.5 — Pour les consignes de #7 et #15 (symboles, trou, caractère de la voix, voix imposée…), quel écran réel ?
Recommandation : **la consigne d'un exercice d'une leçon de test, jouée en séance d'un exercice.** Le texte des scénarios ne change pas (« la consigne « … » s'affiche »).
- C'est le sens du glossaire : la consigne est le texte qui dit à l'enfant ce qu'il doit faire dans un exercice, et elle est lue dès qu'elle s'affiche. Le code de la séance la lit au début de chaque exercice, sauf la dictée et la poésie.
- Un exercice `bulles` avec une `consigne` suffit : il n'ajoute pas d'indication du geste, contrairement à `classer` et `ordre`.
- Les autres pistes sont moins bonnes :
  - **Étape de leçon** : elle reste affichée jusqu'à « Continuer », mais il faudrait réécrire environ 35 scénarios avec un autre terme du glossaire.
  - **Question** : elle est déjà le support de #17.
- Exceptions : les scénarios qui regardent l'écran *après* la lecture (#58.8) et ceux qui n'ont pas d'équivalent (#58.7).

#### #58.6 — « L'enfant peut réécouter la consigne » (#7) : dans une vraie séance, « Réécouter » relit la dernière parole du personnage guide. Une fois la consigne lue, la question est posée : c'est elle que « Réécouter » relit. Que fait-on ?
Recommandation : **supprimer le scénario.**
- Il est redondant avec #17 « L'enfant peut réécouter la question » et #16 « « Réécouter » relit la dernière phrase du personnage guide ».
- Pendant la lecture, « Réécouter » relit bien la consigne : c'est déjà vérifié par « Une nouvelle lecture coupe la lecture en cours », qui reste.
- Si le PO veut que l'enfant puisse réécouter la consigne pendant tout l'exercice, ce comportement rejoint #58.8.

#### #58.7 — La consigne en gras et la consigne en anglais (#7, #15) n'existent pas dans le format des leçons. Que deviennent ces scénarios ?
Recommandation :
- **Gras** (#7) → **supprimé**. Le format n'a pas de mise en forme. La seule mise en forme réelle, les guillemets, est couverte par l'exemple « Lis le mot « maman ». ». Les crochets d'un texte à trous ne sont jamais lus (#18).
- **Anglais, voix seule** (#7) → **supprimé**. Le seul texte anglais d'une séance est le mot à écouter, déjà vérifié par #17 (« … dit par la voix anglaise »).
- **Anglais malgré la voix imposée** (#15) → **réécrit** sur le mot à écouter « a cat » de « Quel animal ? ». Ce cas n'est vérifié nulle part ailleurs.

#### #58.8 — Sur un écran réel, la consigne d'un exercice ne reste affichée que pendant sa lecture. Elle est ensuite remplacée par la question (ou par l'indication du geste pour `classer` et `ordre`). Sans voix (Muet, voix bloquée, navigateur sans voix), elle est remplacée aussitôt. Que fait-on ?
Constat : un enfant en Muet ne voit donc jamais la consigne d'un exercice `classer` ou `ordre` (« Range chaque mot dans la maison de son son. »). Les scénarios de #7 qui regardaient la consigne après la lecture ne passeraient pas sur une vraie séance. Il s'agit de :
- « … Et la consigne reste affichée à l'écran » ;
- « En Muet, la consigne s'affiche sans être lue » ;
- « voix bloquée … Léa voit la consigne » ;
- « Réécouter permet de réessayer… » ;
- « navigateur qui ne sait pas lire » ;
- « Un texte sans rien à dire ».

Recommandation :
1. Dans #58, porter ces scénarios sur la **question de test**, qui reste posée jusqu'à la bonne réponse (c'est ce qui est écrit). La première étape « reste affichée à l'écran » devient « Léa voit la consigne « … » », vrai pendant la lecture.
2. **Ouvrir une story de correction (Apprentissage, séance)** : « la consigne d'un exercice reste visible pendant tout l'exercice, et se relit en la touchant ». Elle rendra aux scénarios de #7 leur sens d'origine : en Muet, l'enfant voit la consigne. C'est une vraie question d'accessibilité (CLAUDE.md : tout texte de consigne peut être lu à voix haute), et elle dépasse le retrait d'un écran de test.

L'alternative serait de corriger l'écran de séance dans #58 même. Cela élargit la story et touche le code de #16 et #18, pendant que d'autres équipes travaillent en parallèle.

#### #58.9 — Que montre l'ancienne adresse `/demonstration` ?
Recommandation : **l'accueil, comme toute adresse inconnue.** C'est ce que fait déjà la navigation de l'application.
- Sans connexion : l'invitation à se connecter.
- Avec un parent connecté : « Qui joue ? ».

Pas de page « introuvable » dédiée : l'enfant ne doit jamais voir un message d'erreur, et une telle page serait un nouvel écran, hors périmètre.

#### #58.10 — « Léa commence à jouer » et « Léa joue » (#5, #6, #10, #12, #15) ouvraient la page de démonstration. Quel écran réel ?
Recommandation : **l'accueil de l'enfant**, l'écran où il arrive après « Qui joue ? » (#11).
- Le texte de ces scénarios ne change pas.
- On y voit le paysage, le personnage guide (content, qui salue l'enfant), l'en-tête avec le prénom et le niveau, et l'entrée de l'espace parent.
- Pour les scénarios de mode dys qui passent par « Qui joue ? » (#12), « … voit la consigne de la page de démonstration en mode dys » devient « … voit son accueil en mode dys ». On y vérifie la salutation du personnage guide et ses boutons.
- Alternative : ouvrir une séance. C'est plus lent et inutile pour l'en-tête et l'univers.

#### #58.11 — « En mode dys, la page de démonstration tient dans un écran de 360 px » : sur quel écran réel ?
Recommandation : **une question de lecture** (« Où dort Plume ? » de « Lecture : Le petit chat Plume »). C'est l'écran d'exercice le plus chargé : texte, question et choix. Le mode dys espace les lettres, les mots et les lignes, c'est donc là que le débordement est le plus probable.
- Alternative : l'accueil de l'enfant. Il est peu chargé, donc peu probant.
