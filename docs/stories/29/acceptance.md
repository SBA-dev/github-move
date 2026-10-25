# Critères d'acceptance : issue #29, Écran « Aujourd'hui »

Scénarios : `features/29-aujourd-hui.feature` (tags `@issue-29 @wip`).
Modèle du domaine : `docs/stories/29/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** et **Famille** ; objectif du jour en **Motivation** selon 29.3). Les questions 29.1 à 29.18 en viennent ; 29.19 à 29.26 sont ajoutées ici.

Le PO a retenu toutes les recommandations des questions 29.1 à 29.24 (« OK #29 #30 reco partout », 2026-10-25, relayé par le responsable des équipes sur les issues #29 et #30), puis répondu à 29.25 (bouton quand aucune leçon n'est proposée, même jour, issue #29). Voir « Décisions ».

> Cadrage anticipé (décision 0020, point 6). Rien n'est codé avant le merge de #26 et #28. Les décisions du PO sur #25, #26, #27 et #28 ne sont pas reposées.
> Les scénarios qui dépendent d'une décision portent un commentaire `# Réponse 29.n`. Aucun scénario ne porte plus `@a-valider` : la question 29.26 est tranchée (« 29.26 OK »). Ceux qui attendent une story pas encore mergée portent `@depend-de-26` ou `@depend-de-28`.
> 2026-10-25 : #26 est mergée dans `main`. Les tags `@depend-de-26` sont retirés de `features/29-aujourd-hui.feature` (6 scénarios et le cas « Toutes les leçons » du plan du dock, réuni au bloc d'exemples des deux autres écrans) ; seuls restent les 7 `@depend-de-28`. Les mentions `@depend-de-26` ci-dessous (tableau des règles, total, décisions) datent du cadrage.

## Objectif

En tant qu'**enfant**, je veux voir en arrivant ce que je peux faire aujourd'hui (ma leçon du jour, mes révisions, mon test de départ), afin de me mettre au travail d'un seul geste.

L'écran est l'**accueil de l'enfant** (réponse 29.5 : « Aujourd'hui » reste un mot de cadrage). Il réunit :
- l'en-tête : date du jour en toutes lettres, « Bonjour `<prénom>` ! » (place réservée sous le titre pour la pastille de série de #30) ;
- les **tuiles du jour**, seulement quand elles sont dues : « À revoir » (#28), « Mon test de départ » (#27) ; les devoirs et la dictée du jour viendront au lot 6 ;
- la **leçon du jour** (grande tuile, « Commencer ») ;
- l'**objectif du jour** (« Joue 2 leçons aujourd'hui ») ;
- les **tuiles de matière**, avec le compteur de « Mon parcours » ;
- un **dock** : « Accueil », « Mon parcours », « Toutes les leçons », « Mes médailles ».

Tout est **calculé** à chaque affichage par le domaine (`@domain/apprentissage`, `@domain/motivation`), dans le navigateur, aussi sans réseau. Rien n'est enregistré : pas de table, pas d'Edge Function.

Le comportement actuel (`app/`, `showMap('accueil')`, `todayTiles`, `nextLesson`, `subjectPath`, `nextAfter`) donne les premiers exemples. Écarts voulus, retenus par le PO le 2026-10-25 :
- le français ne passe plus toujours en premier (29.1) ;
- le test de départ ne compte pas dans l'objectif du jour (27.4) ; la séance de révision compte (29.2 b) ;
- le compteur des tuiles de matière est celui de « Mon parcours » (29.4) ;
- pas de repli vers une leçon des classes d'avant (29.9) ;
- la salutation n'est dite qu'une fois (29.10 f) ;
- « Mes trophées » devient « Mes médailles » (65.1).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. À l'arrivée, le personnage guide salue une seule fois, sous la date du jour en toutes lettres | Léa choisit son profil → son accueil, Noisette dit « Bonjour Léa ! » · le 23 octobre 2026 → « Vendredi 23 octobre » · le 1er janvier 2027 → « Vendredi 1er janvier » · « tout lire » → « Bonjour Léa ! » entendu une seule fois · retour depuis « Mon parcours » → pas de nouvelle salutation |
| 2. La leçon du jour est la prochaine leçon d'une matière du parcours ; français et maths alternent, puis les autres matières ; sinon aucune | CE1 sans progression → « Le son in », « Français · CE1 », « Noisette t'attend pour une nouvelle leçon. » · « Commencer » → page de « Le son in » · après « Le son in » → « Les nombres jusqu'à 100 » (« Maths · CE1 ») · après une séance de maths ou de sciences → français · français fini → maths, même après une séance de maths · français et maths finis → « Les êtres vivants » · « Le son in » réussie (étoiles ou test de départ) → « L'ordre alphabétique » · tout réussi → « Bravo ! », « Tu as fini ton parcours », jamais « Les voyelles » · CM2 → « Aucune leçon pour ta classe pour l'instant. » · bibliothèque non chargée → rien, sans erreur ni faux « Tu as fini ton parcours » |
| 3. Fin de séance sans leçon suivante dans la matière → la leçon du jour ; aucune leçon suivante → « Toutes les leçons » | après « Le pluriel des noms » → « Ensuite : Les nombres jusqu'à 100 » · après « Le futur » (CE2, Léa redescendue en CE1) → idem · après « Les voyelles » (CP) → idem · après « Le son in » → « Leçon suivante », pas de « Toutes les leçons » · séance qui finit tout le parcours → « Accueil », « Rejouer » et « Toutes les leçons » · CM2 (aucune leçon pour sa classe), après « Le futur » → idem · « Toutes les leçons » → l'écran « Toutes les leçons », bouton du dock marqué · retour → accueil |
| 4. Tuiles du jour : seulement si dues, ordre fixe | 1 question due → « À revoir », « 1 petite erreur des jours passés » · 3 → « 3 petites erreurs… » · due demain → pas de tuile · « À revoir » → « Je révise mes erreurs » · test pas fait → « Mon test de départ », « Quelques questions pour commencer au bon endroit » · la tuile ouvre la proposition · test fait → plus de tuile · rien de dû → aucune tuile, la leçon du jour reste · « À revoir » avant « Mon test de départ » |
| 5. Objectif du jour : 2 leçons ; chaque leçon une fois ; révision = 1 ; test de départ exclu ; rien ne s'arrête | rien → « Joue 2 leçons aujourd'hui », « 0 sur 2 » · 1 leçon → « 1 sur 2 » · 2 leçons → « Objectif atteint, bravo ! », la leçon du jour reste · « Le son in » deux fois → « 1 sur 2 » · « Les voyelles » (CP) → « 1 sur 2 » · test de départ → « 0 sur 2 » · séance quittée → « 0 sur 2 » · séance de révision → « 1 sur 2 » · le lendemain → « 0 sur 2 » |
| 6. Tuiles de matière : une par matière du parcours, compteur de « Mon parcours », ouvrent le parcours | CE1 → Français « 1 leçon réussie sur 4 », Maths « 0 leçon réussie sur 2 », Sciences, Vivre ensemble · « Les voyelles » et « Les syllabes » réussies non comptées · CE2 → pas de tuile Sciences · CM2 → aucune tuile · « Maths » → « Mathématiques · CE1 » |
| 7. Dock de quatre écrans ; « Changer d'enfant » reste sur l'accueil | accueil → dock « Accueil » marqué · « Mon parcours », « Mes médailles », « Toutes les leçons » par le dock, marqués · « Accueil » du dock depuis le parcours → accueil · au clavier · pas de dock sur la page de la leçon · « Changer d'enfant » → « Qui joue ? », sans dock |
| 8. Sans réseau, au lecteur d'écran, au clavier, petit écran, mouvements réduits | réseau coupé, séance « Le son in » → leçon du jour en maths, « 1 sur 2 », « 1 leçon réussie sur 4 » · lecteur d'écran : « Vendredi 23 octobre », « 1 sur 2 » sans la barre, « 1 leçon réussie sur 4 » · « Commencer » au clavier · 360 px, 44 px · mouvements réduits → sans mouvement |
| 9. Seulement les données du profil en cours, pour un parent rattaché | Marie retrouve la leçon du jour de Léa · les étoiles de Tom ne comptent pas pour Léa · Claire ne lit pas les séances terminées de Léa |

## Règles

| # | Règle | Scénarios | Réponses |
|---|---|---|---|
| 1 | En choisissant son profil, l'enfant arrive sur son accueil : son personnage guide le salue une seule fois, sous la date du jour en toutes lettres | En choisissant son profil, l'enfant arrive sur son accueil et son personnage guide le salue · L'accueil affiche la date du jour en toutes lettres, avec une majuscule (2 cas : jour ordinaire, premier jour du mois) · Avec « tout lire à voix haute », la salutation n'est dite qu'une seule fois à l'arrivée · En revenant sur son accueil depuis son parcours, l'enfant n'est pas salué de nouveau | 29.5, 29.10 f, 29.14, 29.19, 29.20 |
| 2 | La leçon du jour est la prochaine leçon d'une matière du parcours ; le français et les maths alternent, puis viennent les autres matières ; quand tout le parcours est réussi, il n'y en a plus | Un enfant de CE1 sans progression a pour leçon du jour la première leçon de français de sa classe · « Commencer » ouvre la page de la leçon du jour · Après une séance de <matière jouée>, la leçon du jour est « <leçon du jour> » (4 cas) · Après une séance de français puis une séance de maths, la leçon du jour revient au français · Quand tout le français de la classe est réussi, la leçon du jour reste en maths, même après une séance de maths · Quand le français et les maths de la classe sont réussis, la leçon du jour passe aux autres matières, dans l'ordre · La leçon du jour n'est jamais une leçon déjà réussie · Une leçon réussie au test de départ n'est jamais la leçon du jour · Quand tout le parcours est réussi, l'accueil félicite l'enfant, sans lui proposer une leçon des classes d'avant · Sans aucune leçon pour sa classe, l'accueil le dit, sans féliciter l'enfant d'avoir fini son parcours · Sans bibliothèque chargée, l'accueil ne montre ni leçon du jour ni tuile de matière, sans message d'erreur | 29.1, 29.9, 29.10 a b, 29.11, 29.12, 29.16, 29.18 |
| 3 | À la fin d'une séance sans leçon suivante dans sa matière, la leçon suivante est la leçon du jour, si elle existe et n'est pas la leçon jouée ; quand aucune leçon suivante n'est proposée, la fin de la séance propose « Toutes les leçons » | Après la dernière leçon de français du parcours, la fin de la séance propose la leçon du jour en maths · Après une leçon réussie d'une classe au-dessus, la fin de la séance ramène l'enfant à la leçon du jour de sa classe · Après une leçon des classes d'avant, la fin de la séance ramène l'enfant à la leçon du jour de sa classe (`@depend-de-26`) · Quand une leçon suivante est proposée, la fin de la séance ne propose pas « Toutes les leçons »  · Quand la séance termine tout le parcours, la fin de la séance propose « Toutes les leçons » à la place d'une leçon suivante (`@depend-de-26`) · Sans aucune leçon pour sa classe, après une leçon des classes d'avant, la fin de la séance propose « Toutes les leçons » (`@depend-de-26`) · Le bouton « Toutes les leçons » de la fin de la séance ouvre « Toutes les leçons » (`@depend-de-26`) · Depuis « Toutes les leçons » ouvert en fin de séance, le retour ramène à l'accueil de l'enfant (`@depend-de-26`) | 29.7 e, 29.8, 29.24, 29.25, 29.26 |
| 4 | Les tuiles du jour proposent ce qui est dû aujourd'hui, seulement quand c'est dû, toujours dans le même ordre : « À revoir », puis « Mon test de départ » | Avec <dues> question(s) due(s), la tuile « À revoir » annonce « <annonce> » (2 cas, `@depend-de-28`) · Sans question due aujourd'hui, l'accueil ne propose pas la tuile « À revoir » (`@depend-de-28`) · La tuile « À revoir » commence la séance de révision (`@depend-de-28`) · Tant que le test de départ n'est pas fait, l'accueil propose la tuile « Mon test de départ » · La tuile « Mon test de départ » ouvre la proposition du test de départ · Une fois le test de départ fait, l'accueil ne propose plus la tuile « Mon test de départ » · Sans question due et le test de départ fait, l'accueil ne propose aucune tuile du jour · La tuile « À revoir » vient avant la tuile « Mon test de départ » (`@depend-de-28`) | 29.6, 29.7 b c, 29.17 |
| 5 | L'objectif du jour encourage à jouer 2 leçons dans la journée : chaque leçon terminée compte une fois, la séance de révision compte pour une, le test de départ ne compte pas, et rien ne s'arrête quand il est atteint | Sans séance terminée aujourd'hui, l'objectif du jour est à 0 sur 2 · Après une leçon terminée, l'objectif du jour est à 1 sur 2 · Après deux leçons terminées, l'objectif du jour est atteint et la leçon du jour reste proposée · Une leçon jouée deux fois dans la journée ne compte qu'une fois · Une leçon des classes d'avant terminée compte dans l'objectif du jour (`@depend-de-26`) · Le test de départ ne compte pas dans l'objectif du jour · Une séance quittée avant la fin ne compte pas dans l'objectif du jour · Une séance de révision terminée compte pour une leçon dans l'objectif du jour (`@depend-de-28`) · Le lendemain, l'objectif du jour repart de 0 (`@depend-de-28`) | 29.2, 29.3, 29.13, 29.15 (27.4 tranchée) |
| 6 | Une tuile par matière du parcours, dans l'ordre des onglets, compte les leçons réussies de la classe comme « Mon parcours » et ouvre le parcours de cette matière | Un enfant de CE1 a une tuile pour chaque matière du parcours, avec le compteur de « Mon parcours » · Le compteur d'une tuile de matière ne compte pas les leçons des classes d'avant · Une matière qui n'a que des leçons des classes d'avant n'a pas de tuile de matière · Sans aucune leçon pour sa classe, l'accueil ne montre aucune tuile de matière · La tuile de matière « Maths » ouvre « Mon parcours » sur les maths | 29.4, 29.12 |
| 7 | Un dock mène à l'accueil, à « Mon parcours », à « Toutes les leçons » et à « Mes médailles », et marque l'écran en cours ; « Changer d'enfant » reste sur l'accueil | Sur l'accueil, le dock propose quatre écrans et marque l'accueil comme l'écran en cours · Le dock ouvre « <écran> » et le marque comme l'écran en cours (3 cas, dont « Toutes les leçons » `@depend-de-26`) · Depuis « Mon parcours », le bouton « Accueil » du dock ramène à l'accueil de l'enfant · Le dock s'utilise au clavier · Le dock n'est pas montré en dehors de ses quatre écrans · « Changer d'enfant » reste sur l'accueil, hors du dock, et mène à « Qui joue ? » | 29.7, 29.21 |
| 8 | L'accueil marche sans réseau, se lit au lecteur d'écran, s'utilise au clavier et tient sur un petit écran | Sans réseau, l'accueil se met à jour tout de suite après une séance · Un lecteur d'écran lit la date, l'objectif du jour et les compteurs en toutes lettres · La leçon du jour se commence au clavier · L'accueil tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant · Avec les mouvements réduits, l'accueil s'affiche sans animation | 29.11, 29.14 |
| 9 | L'accueil ne montre que ce qui appartient au profil enfant en cours, et seulement à un parent rattaché | Le second parent rattaché retrouve sur son téléphone la leçon du jour de Léa (`@acces`, `@depend-de-28`) · L'accueil d'un enfant ne tient jamais compte des étoiles d'un autre enfant (`@acces`) · Un parent qui n'est pas rattaché ne lit pas les séances terminées de Léa (`@acces`) | — |

Total : 9 règles, 59 scénarios (66 cas), dont 0 `@a-valider`, 3 `@acces`, 7 `@depend-de-28` et 6 `@depend-de-26` (plus le cas « Toutes les leçons » du plan du dock).

Sans #26 ni #28 mergées, 47 scénarios peuvent tourner (le plan du dock sans son cas « Toutes les leçons »).

La story peut se livrer en deux temps :
1. l'accueil (règles 1, 2, 4 à 9) ;
2. la leçon suivante en fin de séance et le bouton « Toutes les leçons » (règle 3), qui changent une règle de #24, #25 et #26 (voir plus bas).

Droits d'accès (`@acces`) :
- Aucune donnée nouvelle. L'accueil lit sous la RLS existante : meilleures étoiles (#24), résultat du test de départ (#27), file de révision (#28), et, **lecture nouvelle**, les séances terminées et les séances de révision terminées (leçon, date de fin, jour).
- Paul et Marie, rattachés, voient le même accueil de Léa.
- Claire, non rattachée, ne reçoit aucune séance terminée de Léa : c'est la seule lecture nouvelle, d'où le scénario.
- Le scénario Léa / Tom vérifie le filtre par profil enfant, même entre deux enfants du même parent.
- L'enfant n'a aucun droit propre.

### Lecture des scénarios

| Dans les scénarios | À l'écran (décisions) |
|---|---|
| la leçon du jour de Léa est « X », avec « Français · CE1 » | grande tuile : libellé court de la matière et niveau (29.16), titre X, « `<Personnage guide>` t'attend pour une nouvelle leçon. », bouton « Commencer » |
| l'accueil ne propose aucune leçon du jour | pas de bouton « Commencer » |
| tuile « À revoir », « Mon test de départ » | tuiles du jour, au-dessus de la grande tuile (29.22) |
| l'objectif du jour indique « 1 sur 2 » | « Objectif du jour », « Joue 2 leçons aujourd'hui », barre décorative, « 1 sur 2 » ; à 2 : « Objectif atteint, bravo ! » |
| la fin de la séance propose « Accueil », « Rejouer » et « Toutes les leçons » | boutons de fin de séance de #24, plus le bouton « Toutes les leçons » (libellé et écran : réponse 29.26) ; le focus reste sur « Accueil » (#24) |
| le bouton « X » du dock est marqué comme l'écran en cours | `aria-current="page"` sur le bouton du dock, dans un `nav` étiqueté |

## Données de test

**Bibliothèque de test de l'accueil**, servie au navigateur **à la place** de la vraie bibliothèque, comme celles de #25 à #28. Elle reprend celle de #25 (`e2e-25-`) et y ajoute ce qu'il faut pour l'alternance, l'ordre des matières et la révision.
- Identifiants préfixés `e2e-29-`, leçons servies dans le désordre.
- Chaque leçon a, comme dans #25, un exercice bulles de deux questions à quatre choix, pour jouer une séance complète et une séance à 1 étoile dans l'interface.
- « Les sons de révision » reprend la leçon de #28 (bulles « Les sons », 3 questions : son ou, son on, son an), pour préparer des questions retenues.

| Matière, niveau | Leçons (ordre) | Sert à |
|---|---|---|
| français, CP | « Les voyelles » (10), « Les syllabes » (20), « Les sons de révision » (30) | classes d'avant d'un CE1 (jamais leçon du jour, hors compteur, objectif `@depend-de-26`) ; questions retenues |
| français, CE1 | « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30), « Le pluriel des noms » (40) | leçon du jour en français ; compteur « sur 4 » ; dernière leçon du parcours |
| maths, CE1 | « Les nombres jusqu'à 100 » (10), « Les compléments à 10 » (20) | alternance ; « sur 2 » |
| sciences, CE1 | « Les êtres vivants » (10) | matière suivante quand français et maths sont réussis ; séance de sciences suivie du français |
| sciences, CP | « Les cinq sens » (10) | matière qui n'a que des leçons des classes d'avant pour un CE2 |
| EMC, CE1 | « Le respect des autres » (10) | dernière matière ; tuile « Vivre ensemble » |
| français, CE2 | « Le futur » (10) | leçon réussie d'une classe au-dessus (enfant redescendu) ; seule matière du parcours d'un CE2 |
| histoire, anglais ; CM1, CM2 | aucune | CM2 sans leçon |

Nombres attendus, à refaire par l'`e2e-tester` si la bibliothèque change :
- tuiles d'un CE1 : Français « sur 4 », Maths « sur 2 », Sciences « sur 1 », Vivre ensemble « sur 1 » ;
- CE2 : une seule tuile, Français « sur 1 » ;
- réserve du test de départ d'un CE1 : 9 leçons de français et de maths (CP et CE1), donc un plan non vide.

Progression préparée (clé `service_role` réservée à la préparation, profil réel), comme #25 à #28 :
- « Léa a pour meilleures étoiles : », « Léa a réussi n leçons de français du CE1 » : `resultats_des_lecons` ;
- « Léa a pour leçons réussies au test de départ : », « Léa a déjà fait le test de départ » : résultat du test de départ (#27) ;
- « Léa a `<n>` questions dues de la leçon « Les sons de révision » », « Léa a pour questions retenues de la leçon « … » : » : file de révision (#28).

Séances jouées dans l'interface, comme #25 : « Léa a terminé une séance de la leçon « … » avec 1 étoile », « Léa joue la séance complète de la leçon « … » ».
- La leçon du jour (29.1) et l'objectif du jour lisent les **séances terminées** : celles lues sous RLS et celles gardées sur l'appareil.
- Le serveur ne connaît pas les leçons de test (#24, Q85) : il les refuse. L'accueil doit donc refléter la séance par la copie gardée sur l'appareil, sans recharger l'application.
- **Risque à vérifier par l'`e2e-tester`** : si un refus du serveur efface la séance gardée sur l'appareil, les scénarios d'alternance et d'objectif échouent. Il le signale.

Le temps :
- « nous sommes le … » (#14) fige la date de l'appareil. Pour 29.19, le 1er janvier 2027 est un vendredi.
- « Léa revient à son accueil le lendemain » (#28) avance l'horloge du navigateur, sans recharger.

Parents, enfants et appareils : Paul (tablette), Marie (téléphone), rattachés à Léa ; Claire (téléphone), non rattachée ; Tom, second enfant de Paul ; univers « Animaux de la forêt » : personnage guide Noisette.

Le scénario de Claire prépare une séance terminée par un **appel direct à l'Edge Function** `terminer-la-seance` (étape de #24), sur la vraie leçon « Les sons ou, on, an » : Léa y est donc de niveau CP.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … », « Marie est rattachée au profil enfant de Léa », « Claire est connectée sur le téléphone », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « Paul a réglé « tout lire à voix haute » sur « oui » pour Léa », « Léa choisit son profil enfant dans « Qui joue ? » », « Léa a choisi son profil enfant dans « Qui joue ? » », « Léa revient à l'accueil par le nom de l'application », « nous sommes le … » (#14).
- Voix : « Noisette dit « … » », « Léa n'entend pas Noisette lire « … » » (#65).
- Parcours (#25) : « Léa voit son accueil », « Léa a ouvert son parcours depuis son accueil », « Léa revient en arrière », « Léa voit la page de la leçon « … » », « Léa a pour meilleures étoiles : », « Tom a pour meilleures étoiles : », « Léa a réussi n leçon(s) de français du CE1 », « Léa a terminé une séance de la leçon « … » avec 1 étoile », « Léa lit « … » », « le titre du parcours est « … » ».
- Séance (#24) : « Léa joue la séance complète de la leçon « … » », « Léa réussit la dernière question de la séance », « la fin de la séance propose « … », « … » et « … » », « la fin de la séance annonce « … » », « la leçon suivante ouvre la page de la leçon « … » », « la fin de la séance propose « … » et « … » », « aucune leçon suivante n'est proposée », « l'appareil envoie une séance terminée de l'exercice « … » de la leçon « … » avec n erreurs, en annonçant n étoiles ».
- Test de départ (#27) : « Léa a pour leçons réussies au test de départ : », « Léa a déjà fait le test de départ », « Léa a fait le test de départ, en répondant juste à toutes les questions », « la proposition du test de départ s'affiche pour Léa », « la bibliothèque ne peut pas être chargée ».
- Révisions (#28, `@depend-de-28`) : « Léa a `<n>` questions dues de la leçon « … » », « Léa a pour questions retenues de la leçon « … » : », « l'écran s'intitule « … », avec « … » », « Léa a fait la séance de révision, en répondant juste à toutes les questions », « Léa revient à son accueil le lendemain », « Léa choisit son profil enfant sur le téléphone de Marie ».
- Réseau, accessibilité, droits : « le réseau est coupé », « aucun message d'erreur n'apparaît », « Léa joue sur un ordinateur, au clavier », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « l'appareil demande des mouvements réduits », « les lecteurs d'écran annoncent « … » », « Claire ne reçoit aucune donnée de Léa ».

Extensions sans changement de sens (travail de l'`e2e-tester`) :
- Les étapes de préparation, de séance et de test de départ doivent connaître la bibliothèque `e2e-29-`.
- « Léa a réussi n leçons de français du CE1 » prend aujourd'hui les leçons de la bibliothèque de #25 : elle doit prendre celles de la bibliothèque servie.
- « nous sommes le … » (#14) doit accepter n'importe quelle date.
- « Léa a fait la séance de révision, … » (#28) doit marcher avec la leçon « Les sons de révision » de la bibliothèque `e2e-29-`.

Aucune étape existante n'est modifiée.

### Étapes nouvelles

- Bibliothèque : « la bibliothèque de test de l'accueil est servie ».
- En-tête et voix : « l'accueil de Léa affiche la date « … » », « Léa entend Noisette dire « … » une seule fois ».
- Leçon du jour : « la leçon du jour de Léa est « … », avec « … » », « l'accueil de Léa ne propose aucune leçon du jour », « Léa commence la leçon du jour(, au clavier seulement) », « l'accueil de Léa affiche « … » », « l'accueil de Léa affiche « … », « … » et « … » », « l'accueil de Léa n'affiche pas « … » ».
- Tuiles du jour : « l'accueil de Léa propose la tuile « … », avec « … » », « l'accueil de Léa ne propose pas la tuile « … » », « l'accueil de Léa ne propose aucune tuile du jour », « Léa ouvre la tuile « … » de son accueil », « les tuiles du jour de l'accueil de Léa se suivent ainsi : « … », puis « … » ».
- Objectif du jour : « l'objectif du jour de Léa indique « … »( et « … ») », « Léa a quitté la séance de la leçon « … » avant la fin », « les lecteurs d'écran annoncent l'objectif du jour « … », sans lire la barre ».
- Tuiles de matière : « les tuiles de matière de l'accueil de Léa montrent, dans l'ordre : » (colonnes matière, compteur), « la tuile de matière « … » de l'accueil de Léa indique « … » », « l'accueil de Léa ne montre aucune tuile de matière », « l'accueil de Léa ne montre pas de tuile de matière « … » », « Léa ouvre la tuile de matière « … » de son accueil ».
- Dock : « le dock propose « … », « … », « … » et « … » », « le bouton « … » du dock est marqué comme l'écran en cours », « Léa ouvre « … » par le dock(, au clavier seulement) », « l'écran « … » s'affiche, avec le bouton « … » du dock marqué comme l'écran en cours », « aucun dock n'est montré », « Léa choisit « Changer d'enfant » sur son accueil », « « Qui joue ? » s'affiche ».
- Accessibilité : « « Commencer », chaque tuile de l'accueil et chaque bouton du dock mesurent au moins 44 px de haut », « l'accueil de Léa s'affiche sans mouvement ».
- Fin de séance (réponse 29.25) : « Léa a réussi la dernière question de la séance » (forme « Étant donné » de l'étape de #24), « la fin de la séance ne propose pas « … » », « Léa choisit « Toutes les leçons » à la fin de la séance », « Léa a choisi « Toutes les leçons » à la fin de la séance de la leçon « … » ».
- Droits : « Claire demande les séances terminées du profil enfant de Léa ».

## Actions décidées pour l'équipe qui reprendra #29

Ce cadrage ne modifie aucun fichier d'une autre story. Les réponses 29.7, 29.8, 29.24 et 29.25 décident des actions suivantes, faites par l'équipe qui reprendra #29, au moment du code (après le merge de #26 et #28).

**Action 1 (réponse 29.7) : steps des accès provisoires.** Texte des scénarios inchangé, adaptation dans les steps seulement (accès par le dock ou par une tuile du jour). Le travail revient à l'`e2e-tester` de #29, au moment du code :

| Story | Étapes concernées | Nouvel accès | Scénarios touchés |
|---|---|---|---|
| #25 (« Mon parcours », 25.10) | « Léa ouvre son parcours », « Léa ouvre le parcours de français », « Léa a ouvert son parcours / le parcours de français (depuis son accueil) », « Léa a choisi « … » dans son parcours, puis est revenue à son accueil » | bouton « Mon parcours » du dock | tous les scénarios de `features/25-parcours-par-matiere.feature` qui ouvrent le parcours ; « Depuis le parcours, le retour ramène à l'accueil de l'enfant » reste vrai (29.7 e) |
| #26 (« Toutes les leçons », 26.2) | « Léa ouvre « Toutes les leçons » depuis son accueil », « Léa a ouvert « Toutes les leçons » depuis son accueil », « Léa a choisi « … » dans la liste « … » de « Toutes les leçons », puis est revenue à son accueil » | bouton « Toutes les leçons » du dock | les scénarios de « Toutes les leçons » ; « Depuis « Toutes les leçons », le retour ramène à l'accueil de l'enfant » reste vrai |
| #27 (« Mon test de départ », 27.10) | « l'accueil de Léa (ne) propose (pas) « Mon test de départ »( sur le téléphone de Paul) », « Léa ouvre « Mon test de départ » depuis son accueil », « la proposition du test de départ est affichée pour Léa » | tuile du jour « Mon test de départ » | règle 1 (« Sans faire le test de départ… », « Tant que le test de départ n'est pas fait… », « Depuis l'accueil de l'enfant… », « Un test de départ fait n'est plus proposé… », « Un enfant qui change de classe… », « Sans bibliothèque chargée… »), « Quitter le test de départ en cours… », règles 7 et 9 |
| #28 (« Je révise mes erreurs », 28.8) | « l'accueil de Léa propose la séance de révision, avec « … »( sur le téléphone de Paul) », « l'accueil de Léa ne propose pas de séance de révision », « Léa commence la séance de révision », « la proposition de la séance de révision mesure au moins 44 px de haut » | tuile du jour « À revoir » | règles 1, 2, 3, 5, 6 et 7 de `features/28-revisions-des-erreurs.feature` (dont « l'accueil de Léa propose la séance de révision ») |
| #65 (« Mes médailles ») | « Léa ouvre « Mes médailles » depuis son accueil(, au clavier seulement) », « Léa a ouvert « Mes médailles » depuis son accueil », « Léa ouvre « Mes médailles » sur le téléphone de Marie » | bouton « Mes médailles » du dock | tous les scénarios de `features/65-ecran-mes-medailles.feature` ; la phrase de description « En attendant le dock de #29… » devient caduque |

**Action 2 (réponses 29.8, 29.24 et 29.25) : texte de scénarios à réécrire.** La règle change : il y a de nouveau une leçon suivante, la leçon du jour, si elle existe et n'est pas la leçon jouée ; quand il n'y en a aucune, la fin de séance propose en plus le bouton « Toutes les leçons » (29.25 et 29.26). L'équipe de #29 réécrit ces scénarios au moment du code, **après le merge de #26** (pour ceux de #26) :
- #25, `features/25-parcours-par-matiere.feature`, 2 scénarios : « Après la dernière leçon du parcours, aucune leçon d'une autre matière n'est proposée » et « Après une leçon réussie d'une classe au-dessus, aucune leçon suivante n'est proposée » (N10). Ils deviennent ceux de la règle 3 de #29 : les retirer de #25, ou les réécrire avec la leçon du jour.
- #26, `features/26-lecons-des-classes-d-avant.feature` : « Après une leçon des classes d'avant, aucune leçon suivante n'est proposée » (26.8) et « Après une leçon de la classe juste au-dessus, aucune leçon suivante n'est proposée » (26.19, réponse 29.24).
- **Confirmé par la réponse 29.25** : #24, `features/24-etoiles-et-fin-de-seance.feature`, « Après la dernière leçon d'une matière, aucune leçon suivante n'est proposée » (« Les animaux », dernière leçon d'anglais du CP, Léa en CP sans progression). Léa a encore une leçon du jour (une leçon de français du CP) : selon 29.8, la fin de séance la propose. Le scénario est réécrit en « Après la dernière leçon d'une matière, la fin de la séance propose la leçon du jour » (« Ensuite : `<première leçon de français du CP de la bibliothèque servie>` »), ou retiré de #24 puisque la règle 3 de #29 le couvre (« Après la dernière leçon de français du parcours… »). Le cas « aucune leçon suivante » n'y reste pas : il est couvert par les scénarios « Toutes les leçons » de la règle 3 de #29.
- Les scénarios de #25 et #26 réécrits avec la leçon du jour n'ont pas le bouton « Toutes les leçons » (une leçon suivante est proposée) ; ceux qui gardent « aucune leçon suivante n'est proposée » (un enfant dont tout le parcours est réussi) ajoutent « Toutes les leçons » aux boutons proposés.
- Glossaire : la ligne « Leçon suivante » (« ni vers une autre matière avant #29 ») reçoit une note (ajout seulement), qui mentionne aussi le bouton « Toutes les leçons » quand aucune leçon suivante n'est proposée (29.25).

Les scénarios de #11 (« Léa choisit son profil enfant et son personnage guide la salue »), #12 (« Léa voit son accueil en mode dys ») et #6 (le nom de l'application ramène à l'accueil) restent vrais sans adaptation.

## Scénarios réécrits dans les autres stories

Action 2, faite le 2026-10-25 après le merge de #26 (réponses 29.8, 29.24 et 29.25). Étapes existantes reprises mot pour mot (« la fin de la séance annonce « Ensuite : … » », « la leçon suivante ouvre la page de la leçon « … » ») ; chaque scénario garde le tag de sa story et reçoit `@issue-29`, avec un commentaire `# Réponse 29.n (#29)`. Aucun ne garde « aucune leçon suivante n'est proposée » : une leçon du jour existe dans chaque cas.

| Fichier | Ancien titre | Nouveau titre | Leçon suivante annoncée |
|---|---|---|---|
| `features/24-etoiles-et-fin-de-seance.feature` | Après la dernière leçon d'une matière, aucune leçon suivante n'est proposée | Après la dernière leçon d'une matière, la fin de la séance propose la leçon du jour | « Les sons ou, on, an » (première leçon de français du CP de la vraie bibliothèque, ordre 5) |
| `features/25-parcours-par-matiere.feature` | Après la dernière leçon du parcours, aucune leçon d'une autre matière n'est proposée | Après la dernière leçon du parcours de français, la fin de la séance propose la leçon du jour en maths | « Les nombres jusqu'à 100 » |
| `features/25-parcours-par-matiere.feature` | Après une leçon réussie d'une classe au-dessus, aucune leçon suivante n'est proposée (N10) | Après une leçon réussie d'une classe au-dessus, la fin de la séance propose la leçon du jour de sa classe | « Les nombres jusqu'à 100 » |
| `features/26-lecons-des-classes-d-avant.feature` | Après une leçon des classes d'avant, aucune leçon suivante n'est proposée (26.8) | Après une leçon des classes d'avant, la fin de la séance propose la leçon du jour de sa classe | « Les nombres jusqu'à 100 » |
| `features/26-lecons-des-classes-d-avant.feature` | Après une leçon de la classe juste au-dessus, aucune leçon suivante n'est proposée (26.19, 29.24) | Après une leçon de la classe juste au-dessus, la fin de la séance propose la leçon du jour de sa classe | « Le son in » (dernière séance en maths, donc le français) |

## Hors périmètre

- Pastille de série et sa lecture après « Bonjour `<prénom>` ! » : #30 (`@depend-de-30` évité ici). La place est réservée.
- Tuiles « Mes devoirs » et « Dictée du jour », et les mots de la semaine dans l'objectif du jour : lot 6 (Accompagnement).
- Contenu de « Mes médailles » (#65, #31 à #33) : seul son accès passe dans le dock.
- Leçons personnelles comme leçon du jour : #39.
- Accueil sans réseau dès le lancement (copie des données sur l'appareil) : #44. Ici, seulement la mise à jour tout de suite après une séance.
- Retrait du réglage « parcours libre » : story Famille.
- Points vérifiés par les tests unitaires de `leconDuJour`, `tuilesDuJour`, `tuilesDeMatiere` et `objectifDuJour`, sans scénario E2E :
  - déterminisme du choix (mêmes entrées, même leçon) ;
  - ordre complet des autres matières (sciences, histoire, anglais, EMC) ;
  - leçon du jour égale à la leçon jouée en fin de séance (pas de « Ensuite ») ;
  - séance d'un seul exercice comptée dans l'objectif ; plusieurs séances de révision le même jour comptées pour 1 ;
  - 12 questions dues ou plus (toutes comptées, déjà couvert par #28) ;
  - jour de l'appareil et séance terminée juste avant minuit ;
  - séance faite le même jour sur un autre appareil.
- Accueil resté ouvert à minuit : pas de mise à jour toute seule (29.13), non vérifié en E2E.
- Absence de fête quand l'objectif est atteint (29.15) : aucun son ni animation de récompense n'est observé par les scénarios.

## Décisions

Réponse du PO, le 2026-10-25 : « OK #29 #30 reco partout » (relayée par le responsable des équipes sur les issues #29 et #30). Toutes les recommandations sont retenues. Le détail des questions 29.1 à 29.18 est dans `docs/stories/29/domain-model.md` (section « Questions ouvertes ») ; 29.19 à 29.24 sont rappelées ci-dessous.

| n° | Question | Réponse | Effet sur les scénarios et les documents |
|---|---|---|---|
| 29.1 | Ordre des matières de la leçon du jour | **(b)** : alterner français et maths selon la matière de la dernière séance terminée ; quand les deux sont réussis, les autres matières dans l'ordre du Catalogue. | `@a-valider` retiré de 4 scénarios de la règle 2 ; la règle 3 en découle. |
| 29.2 | Objectif du jour : quoi compter | (a) « 2 leçons », fixe, sans réglage ; (b) la séance de révision compte pour 1, même s'il y en a plusieurs ; (c) leçon rejouée comptée une fois, séance d'un exercice comptée, leçon des classes d'avant comptée. Mots de la semaine : comme la révision (lot 6 le confirmera). | `@a-valider` retiré de 6 scénarios de la règle 5. |
| 29.3 | Apprentissage ou Motivation ? | **Motivation**, livré par #29 dans `motivation/domain/`, en lecture seule des séances terminées d'Apprentissage. | Aucun scénario (emplacement du code). |
| 29.4 | Compteur des tuiles de matière | Celui de « Mon parcours » (classe de l'enfant seulement) ; une tuile par matière du parcours, même liste et même ordre que les onglets. | `@a-valider` retiré de 3 scénarios de la règle 6. |
| 29.5 | « Aujourd'hui » : terme ? | Non : l'écran est l'**accueil de l'enfant** ; la ligne « Devoir » du glossaire reçoit une note. | Vocabulaire des scénarios confirmé. |
| 29.6 | Ordre des tuiles du jour | Devoirs, dictée du jour, « À revoir », test de départ. | `@a-valider` retiré de « La tuile « À revoir » vient avant la tuile « Mon test de départ » ». |
| 29.7 | Accès provisoires de l'accueil | (a) dock de 4 boutons « Accueil », « Mon parcours », « Toutes les leçons », « Mes médailles », bouton actif marqué ; (b) « Je révise mes erreurs » devient la tuile « À revoir » ; (c) « Mon test de départ » devient une tuile du jour ; (d) « Changer d'enfant » reste sur l'accueil, hors du dock ; (e) le retour de ces écrans mène à l'accueil. | `@a-valider` retiré de 11 scénarios (règles 4 et 7). Steps des accès provisoires de #25, #26, #27, #28 et #65 à adapter : action 1. |
| 29.8 | Leçon suivante quand la matière n'en a plus | La fin de séance propose la **leçon du jour**, si elle existe et n'est pas la leçon jouée. Note au glossaire (« Leçon suivante »). | `@a-valider` retiré des 4 scénarios de la règle 3. Scénarios de #24 (confirmé par 29.25), #25 et #26 à réécrire : action 2. |
| 29.9 | Repli vers les classes d'avant | Pas de repli ; « Bravo ! », « Tu as fini ton parcours » ; pas de bouton « Toutes les leçons » dans la tuile. | `@a-valider` retiré de « Quand tout le parcours est réussi… ». |
| 29.10 | Défauts du legacy | Tous corrigés (a à f) ; la salutation n'est dite qu'une fois à l'arrivée. | `@a-valider` retiré de « Avec « tout lire à voix haute », la salutation n'est dite qu'une seule fois… ». |
| 29.11 | Bibliothèque non chargée | Ni grande tuile, ni tuiles de matière, ni « Mon test de départ », sans message ; « À revoir » si la file est connue ; objectif du jour montré. | `@a-valider` retiré de « Sans bibliothèque chargée… ». |
| 29.12 | Classe sans leçon | « Aucune leçon pour ta classe pour l'instant. », aucune tuile de matière, objectif du jour montré. | `@a-valider` retiré de 2 scénarios (règles 2 et 6). |
| 29.13 | Fuseau et changement de jour | Jour de l'appareil (28.9) ; recalcul à chaque affichage et au retour au premier plan ; pas de minuterie à minuit. Le jour d'une séance ordinaire est celui gardé avec la séance terminée (réponse 30.6, ci-dessous). | `@a-valider` retiré de « Le lendemain, l'objectif du jour repart de 0 ». |
| 29.14 | Date en tête | Gardée, en toutes lettres, avec une majuscule, en français, lue par les lecteurs d'écran. | `@a-valider` retiré de 2 scénarios (règles 1 et 8). |
| 29.15 | Objectif atteint : une fête ? | Seulement le texte « Objectif atteint, bravo ! ». | `@a-valider` retiré (avec 29.2) de « Après deux leçons terminées… ». |
| 29.16 | Nom de la matière sur la grande tuile | Libellé court des onglets (« Maths · CE1 »). | `@a-valider` retiré de 2 scénarios de la règle 2. |
| 29.17 | « Tuile du jour » | Terme du domaine ; « (à valider) » retiré au glossaire. | Aucun changement de texte. |
| 29.18 | « Leçon du jour » | Terme du domaine ; « (à valider) » retiré au glossaire. | Aucun changement de texte. |
| 29.19 | Premier jour du mois dans la date | « Vendredi 1er janvier », lu « premier ». | `@a-valider` retiré des exemples « premier jour du mois » de « L'accueil affiche la date du jour en toutes lettres… ». |
| 29.20 | Salutation au retour sur l'accueil | Dite seulement au choix du profil dans « Qui joue ? » ; au retour, écrite mais pas redite. | `@a-valider` retiré de « En revenant sur son accueil depuis son parcours… ». |
| 29.21 | Où le dock se montre-t-il ? | Seulement sur l'accueil, « Mon parcours », « Toutes les leçons » et « Mes médailles ». | `@a-valider` retiré de « Le dock n'est pas montré en dehors de ses quatre écrans ». |
| 29.22 | Ordre des parties de l'accueil | Celui du legacy : en-tête, tuiles du jour, grande tuile, objectif du jour, tuiles de matière. | Aucun scénario (mise en page). |
| 29.23 | Lecture à voix haute du reste de l'accueil | **(a)** dans #29 : seulement la salutation (puis la pastille, #30) ; (b) ou (c) à décider plus tard. | Aucun scénario. |
| 29.24 | Leçon suivante après une leçon de la classe juste au-dessus | Même règle que 29.8 : la leçon du jour. | Aucun scénario ici ; scénario 26.19 de #26 à réécrire : action 2. |
| 29.25 | Le scénario de #24 « Après la dernière leçon d'une matière, aucune leçon suivante n'est proposée » devient faux avec 29.8 : le réécrire dans #29 ? | Réponse du PO, mot pour mot (relayée par le responsable des équipes sur l'issue #29, 2026-10-25) : « Si aucune autre leçon est proposé, on ajoute un bouton pour revenir aux autres cours ». Traduction : 29.8 reste (la leçon du jour est proposée quand elle existe) ; le scénario de #24 est donc réécrit. Quand la fin de séance ne propose **aucune** leçon suivante (tout le parcours réussi, ou aucune leçon pour la classe de l'enfant), elle propose, en plus d'« Accueil » et « Rejouer », un bouton vers les autres leçons. « Cours » est un synonyme à éviter (glossaire : leçon, matière) : libellé et écran du bouton : 29.26. | Règle 3 étendue ; « Quand la séance termine tout le parcours, aucune leçon suivante n'est proposée » réécrit avec le bouton ; 4 scénarios ajoutés (pas de bouton quand une leçon suivante est proposée ; CM2 après une leçon des classes d'avant ; le bouton ouvre l'écran ; retour à l'accueil). Action 2 : scénario de #24 confirmé à réécrire. |
| 29.26 | Libellé, écran d'arrivée et cas du bouton de la réponse 29.25 | Réponse du PO, mot pour mot (relayée par le responsable, 2026-10-25) : « 29.26 OK ». Reco retenue : bouton « Toutes les leçons » (même libellé que le dock), qui ouvre l'écran « Toutes les leçons » (#26), dans tous les cas sans leçon suivante (tout le parcours réussi, classe sans leçon) ; en plus d'« Accueil » et « Rejouer », focus sur « Accueil ». | `@a-valider` retiré des 5 scénarios de la règle 3 ; ils attendent #26 (`@depend-de-26`), sauf « Quand une leçon suivante est proposée… ». |

Note sur le jour d'une séance ordinaire : la réponse 30.6 (`docs/stories/30/acceptance.md`) ajoute une colonne de jour aux séances terminées, envoyée par l'appareil et vérifiée comme en 28.9 (migration sous verrou `base` au moment du code). L'objectif du jour et la leçon du jour de #29 lisent ce jour, et non un jour recalculé avec le fuseau actuel de l'appareil.

## Questions ouvertes

Aucune.
