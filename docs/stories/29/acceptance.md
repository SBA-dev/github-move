# Critères d'acceptance : issue #29, Écran « Aujourd'hui »

Scénarios : `features/29-aujourd-hui.feature` (tags `@issue-29 @wip`).
Modèle du domaine : `docs/stories/29/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** et **Famille** ; objectif du jour en **Motivation** selon 29.3). Les questions 29.1 à 29.18 en viennent ; 29.19 à 29.24 sont ajoutées ici.

> Cadrage anticipé (décision 0020, point 6). Rien n'est codé avant le merge de #26 et #28. Les décisions du PO sur #25, #26, #27 et #28 ne sont pas reposées.
> Les scénarios qui dépendent d'une question ouverte portent `@a-valider` et un commentaire `# Question 29.n` ; ils suivent la recommandation. Ceux qui attendent une story pas encore mergée portent `@depend-de-26` ou `@depend-de-28`.

## Objectif

En tant qu'**enfant**, je veux voir en arrivant ce que je peux faire aujourd'hui (ma leçon du jour, mes révisions, mon test de départ), afin de me mettre au travail d'un seul geste.

L'écran est l'**accueil de l'enfant** (recommandation 29.5 : « Aujourd'hui » reste un mot de cadrage). Il réunit :
- l'en-tête : date du jour en toutes lettres, « Bonjour `<prénom>` ! » (place réservée sous le titre pour la pastille de série de #30) ;
- les **tuiles du jour**, seulement quand elles sont dues : « À revoir » (#28), « Mon test de départ » (#27) ; les devoirs et la dictée du jour viendront au lot 6 ;
- la **leçon du jour** (grande tuile, « Commencer ») ;
- l'**objectif du jour** (« Joue 2 leçons aujourd'hui ») ;
- les **tuiles de matière**, avec le compteur de « Mon parcours » ;
- un **dock** : « Accueil », « Mon parcours », « Toutes les leçons », « Mes médailles ».

Tout est **calculé** à chaque affichage par le domaine (`@domain/apprentissage`, `@domain/motivation`), dans le navigateur, aussi sans réseau. Rien n'est enregistré : pas de table, pas d'Edge Function.

Le comportement actuel (`app/`, `showMap('accueil')`, `todayTiles`, `nextLesson`, `subjectPath`, `nextAfter`) donne les premiers exemples. Écarts voulus, à confirmer par le PO :
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
| 3. Fin de séance sans leçon suivante dans la matière → la leçon du jour | après « Le pluriel des noms » → « Ensuite : Les nombres jusqu'à 100 » · après « Le futur » (CE2, Léa redescendue en CE1) → idem · après « Les voyelles » (CP) → idem · séance qui finit tout le parcours → « Accueil » et « Rejouer » seulement |
| 4. Tuiles du jour : seulement si dues, ordre fixe | 1 question due → « À revoir », « 1 petite erreur des jours passés » · 3 → « 3 petites erreurs… » · due demain → pas de tuile · « À revoir » → « Je révise mes erreurs » · test pas fait → « Mon test de départ », « Quelques questions pour commencer au bon endroit » · la tuile ouvre la proposition · test fait → plus de tuile · rien de dû → aucune tuile, la leçon du jour reste · « À revoir » avant « Mon test de départ » |
| 5. Objectif du jour : 2 leçons ; chaque leçon une fois ; révision = 1 ; test de départ exclu ; rien ne s'arrête | rien → « Joue 2 leçons aujourd'hui », « 0 sur 2 » · 1 leçon → « 1 sur 2 » · 2 leçons → « Objectif atteint, bravo ! », la leçon du jour reste · « Le son in » deux fois → « 1 sur 2 » · « Les voyelles » (CP) → « 1 sur 2 » · test de départ → « 0 sur 2 » · séance quittée → « 0 sur 2 » · séance de révision → « 1 sur 2 » · le lendemain → « 0 sur 2 » |
| 6. Tuiles de matière : une par matière du parcours, compteur de « Mon parcours », ouvrent le parcours | CE1 → Français « 1 leçon réussie sur 4 », Maths « 0 leçon réussie sur 2 », Sciences, Vivre ensemble · « Les voyelles » et « Les syllabes » réussies non comptées · CE2 → pas de tuile Sciences · CM2 → aucune tuile · « Maths » → « Mathématiques · CE1 » |
| 7. Dock de quatre écrans ; « Changer d'enfant » reste sur l'accueil | accueil → dock « Accueil » marqué · « Mon parcours », « Mes médailles », « Toutes les leçons » par le dock, marqués · « Accueil » du dock depuis le parcours → accueil · au clavier · pas de dock sur la page de la leçon · « Changer d'enfant » → « Qui joue ? », sans dock |
| 8. Sans réseau, au lecteur d'écran, au clavier, petit écran, mouvements réduits | réseau coupé, séance « Le son in » → leçon du jour en maths, « 1 sur 2 », « 1 leçon réussie sur 4 » · lecteur d'écran : « Vendredi 23 octobre », « 1 sur 2 » sans la barre, « 1 leçon réussie sur 4 » · « Commencer » au clavier · 360 px, 44 px · mouvements réduits → sans mouvement |
| 9. Seulement les données du profil en cours, pour un parent rattaché | Marie retrouve la leçon du jour de Léa · les étoiles de Tom ne comptent pas pour Léa · Claire ne lit pas les séances terminées de Léa |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | En choisissant son profil, l'enfant arrive sur son accueil : son personnage guide le salue une seule fois, sous la date du jour en toutes lettres | En choisissant son profil, l'enfant arrive sur son accueil et son personnage guide le salue · L'accueil affiche la date du jour en toutes lettres, avec une majuscule (2 cas : jour ordinaire, premier jour du mois) · Avec « tout lire à voix haute », la salutation n'est dite qu'une seule fois à l'arrivée · En revenant sur son accueil depuis son parcours, l'enfant n'est pas salué de nouveau | 29.5, 29.10 f, 29.14, 29.19, 29.20 |
| 2 | La leçon du jour est la prochaine leçon d'une matière du parcours ; le français et les maths alternent, puis viennent les autres matières ; quand tout le parcours est réussi, il n'y en a plus | Un enfant de CE1 sans progression a pour leçon du jour la première leçon de français de sa classe · « Commencer » ouvre la page de la leçon du jour · Après une séance de <matière jouée>, la leçon du jour est « <leçon du jour> » (4 cas) · Après une séance de français puis une séance de maths, la leçon du jour revient au français · Quand tout le français de la classe est réussi, la leçon du jour reste en maths, même après une séance de maths · Quand le français et les maths de la classe sont réussis, la leçon du jour passe aux autres matières, dans l'ordre · La leçon du jour n'est jamais une leçon déjà réussie · Une leçon réussie au test de départ n'est jamais la leçon du jour · Quand tout le parcours est réussi, l'accueil félicite l'enfant, sans lui proposer une leçon des classes d'avant · Sans aucune leçon pour sa classe, l'accueil le dit, sans féliciter l'enfant d'avoir fini son parcours · Sans bibliothèque chargée, l'accueil ne montre ni leçon du jour ni tuile de matière, sans message d'erreur | 29.1, 29.9, 29.10 a b, 29.11, 29.12, 29.16, 29.18 |
| 3 | À la fin d'une séance sans leçon suivante dans sa matière, la leçon suivante est la leçon du jour, si elle existe et n'est pas la leçon jouée | Après la dernière leçon de français du parcours, la fin de la séance propose la leçon du jour en maths · Après une leçon réussie d'une classe au-dessus, la fin de la séance ramène l'enfant à la leçon du jour de sa classe · Après une leçon des classes d'avant, la fin de la séance ramène l'enfant à la leçon du jour de sa classe (`@depend-de-26`) · Quand la séance termine tout le parcours, aucune leçon suivante n'est proposée | 29.8, 29.24 |
| 4 | Les tuiles du jour proposent ce qui est dû aujourd'hui, seulement quand c'est dû, toujours dans le même ordre : « À revoir », puis « Mon test de départ » | Avec <dues> question(s) due(s), la tuile « À revoir » annonce « <annonce> » (2 cas, `@depend-de-28`) · Sans question due aujourd'hui, l'accueil ne propose pas la tuile « À revoir » (`@depend-de-28`) · La tuile « À revoir » commence la séance de révision (`@depend-de-28`) · Tant que le test de départ n'est pas fait, l'accueil propose la tuile « Mon test de départ » · La tuile « Mon test de départ » ouvre la proposition du test de départ · Une fois le test de départ fait, l'accueil ne propose plus la tuile « Mon test de départ » · Sans question due et le test de départ fait, l'accueil ne propose aucune tuile du jour · La tuile « À revoir » vient avant la tuile « Mon test de départ » (`@depend-de-28`) | 29.6, 29.7 b c, 29.17 |
| 5 | L'objectif du jour encourage à jouer 2 leçons dans la journée : chaque leçon terminée compte une fois, la séance de révision compte pour une, le test de départ ne compte pas, et rien ne s'arrête quand il est atteint | Sans séance terminée aujourd'hui, l'objectif du jour est à 0 sur 2 · Après une leçon terminée, l'objectif du jour est à 1 sur 2 · Après deux leçons terminées, l'objectif du jour est atteint et la leçon du jour reste proposée · Une leçon jouée deux fois dans la journée ne compte qu'une fois · Une leçon des classes d'avant terminée compte dans l'objectif du jour (`@depend-de-26`) · Le test de départ ne compte pas dans l'objectif du jour · Une séance quittée avant la fin ne compte pas dans l'objectif du jour · Une séance de révision terminée compte pour une leçon dans l'objectif du jour (`@depend-de-28`) · Le lendemain, l'objectif du jour repart de 0 (`@depend-de-28`) | 29.2, 29.3, 29.13, 29.15 (27.4 tranchée) |
| 6 | Une tuile par matière du parcours, dans l'ordre des onglets, compte les leçons réussies de la classe comme « Mon parcours » et ouvre le parcours de cette matière | Un enfant de CE1 a une tuile pour chaque matière du parcours, avec le compteur de « Mon parcours » · Le compteur d'une tuile de matière ne compte pas les leçons des classes d'avant · Une matière qui n'a que des leçons des classes d'avant n'a pas de tuile de matière · Sans aucune leçon pour sa classe, l'accueil ne montre aucune tuile de matière · La tuile de matière « Maths » ouvre « Mon parcours » sur les maths | 29.4, 29.12 |
| 7 | Un dock mène à l'accueil, à « Mon parcours », à « Toutes les leçons » et à « Mes médailles », et marque l'écran en cours ; « Changer d'enfant » reste sur l'accueil | Sur l'accueil, le dock propose quatre écrans et marque l'accueil comme l'écran en cours · Le dock ouvre « <écran> » et le marque comme l'écran en cours (3 cas, dont « Toutes les leçons » `@depend-de-26`) · Depuis « Mon parcours », le bouton « Accueil » du dock ramène à l'accueil de l'enfant · Le dock s'utilise au clavier · Le dock n'est pas montré en dehors de ses quatre écrans · « Changer d'enfant » reste sur l'accueil, hors du dock, et mène à « Qui joue ? » | 29.7, 29.21 |
| 8 | L'accueil marche sans réseau, se lit au lecteur d'écran, s'utilise au clavier et tient sur un petit écran | Sans réseau, l'accueil se met à jour tout de suite après une séance · Un lecteur d'écran lit la date, l'objectif du jour et les compteurs en toutes lettres · La leçon du jour se commence au clavier · L'accueil tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant · Avec les mouvements réduits, l'accueil s'affiche sans animation | 29.11, 29.14 |
| 9 | L'accueil ne montre que ce qui appartient au profil enfant en cours, et seulement à un parent rattaché | Le second parent rattaché retrouve sur son téléphone la leçon du jour de Léa (`@acces`, `@depend-de-28`) · L'accueil d'un enfant ne tient jamais compte des étoiles d'un autre enfant (`@acces`) · Un parent qui n'est pas rattaché ne lit pas les séances terminées de Léa (`@acces`) | — |

Total : 9 règles, 55 scénarios (62 cas), dont 39 `@a-valider`, 3 `@acces`, 7 `@depend-de-28` et 2 `@depend-de-26` (plus le cas « Toutes les leçons » du plan du dock).

Sans #26 ni #28 mergées, 46 scénarios peuvent tourner (le plan du dock sans son cas « Toutes les leçons »).

La story peut se livrer en deux temps :
1. l'accueil (règles 1, 2, 4 à 9) ;
2. la leçon suivante en fin de séance (règle 3), qui change une règle de #25 et #26 (voir plus bas).

Droits d'accès (`@acces`) :
- Aucune donnée nouvelle. L'accueil lit sous la RLS existante : meilleures étoiles (#24), résultat du test de départ (#27), file de révision (#28), et, **lecture nouvelle**, les séances terminées et les séances de révision terminées (leçon, date de fin, jour).
- Paul et Marie, rattachés, voient le même accueil de Léa.
- Claire, non rattachée, ne reçoit aucune séance terminée de Léa : c'est la seule lecture nouvelle, d'où le scénario.
- Le scénario Léa / Tom vérifie le filtre par profil enfant, même entre deux enfants du même parent.
- L'enfant n'a aucun droit propre.

### Lecture des scénarios

| Dans les scénarios | À l'écran (recommandations) |
|---|---|
| la leçon du jour de Léa est « X », avec « Français · CE1 » | grande tuile : libellé court de la matière et niveau (29.16), titre X, « `<Personnage guide>` t'attend pour une nouvelle leçon. », bouton « Commencer » |
| l'accueil ne propose aucune leçon du jour | pas de bouton « Commencer » |
| tuile « À revoir », « Mon test de départ » | tuiles du jour, au-dessus de la grande tuile (29.22) |
| l'objectif du jour indique « 1 sur 2 » | « Objectif du jour », « Joue 2 leçons aujourd'hui », barre décorative, « 1 sur 2 » ; à 2 : « Objectif atteint, bravo ! » |
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
- Séance (#24) : « Léa joue la séance complète de la leçon « … » », « Léa réussit la dernière question de la séance », « la fin de la séance annonce « … » », « la leçon suivante ouvre la page de la leçon « … » », « la fin de la séance propose « … » et « … » », « aucune leçon suivante n'est proposée », « l'appareil envoie une séance terminée de l'exercice « … » de la leçon « … » avec n erreurs, en annonçant n étoiles ».
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
- Droits : « Claire demande les séances terminées du profil enfant de Léa ».

## Scénarios des autres stories à adapter

Les accès provisoires de l'accueil disparaissent si 29.7 est retenue. Aucun fichier n'est modifié par ce cadrage. Le travail revient à l'`e2e-tester` de #29, et aux équipes de #26 et #28 si elles ne sont pas encore mergées.

**Texte inchangé, adaptation dans les steps seulement** (accès par le dock ou par une tuile du jour) :

| Story | Étapes concernées | Nouvel accès | Scénarios touchés |
|---|---|---|---|
| #25 (« Mon parcours », 25.10) | « Léa ouvre son parcours », « Léa ouvre le parcours de français », « Léa a ouvert son parcours / le parcours de français (depuis son accueil) », « Léa a choisi « … » dans son parcours, puis est revenue à son accueil » | bouton « Mon parcours » du dock | tous les scénarios de `features/25-parcours-par-matiere.feature` qui ouvrent le parcours ; « Depuis le parcours, le retour ramène à l'accueil de l'enfant » reste vrai (29.7 e) |
| #26 (« Toutes les leçons », 26.2) | « Léa ouvre « Toutes les leçons » depuis son accueil », « Léa a ouvert « Toutes les leçons » depuis son accueil », « Léa a choisi « … » dans la liste « … » de « Toutes les leçons », puis est revenue à son accueil » | bouton « Toutes les leçons » du dock | les scénarios de « Toutes les leçons » ; « Depuis « Toutes les leçons », le retour ramène à l'accueil de l'enfant » reste vrai |
| #27 (« Mon test de départ », 27.10) | « l'accueil de Léa (ne) propose (pas) « Mon test de départ »( sur le téléphone de Paul) », « Léa ouvre « Mon test de départ » depuis son accueil », « la proposition du test de départ est affichée pour Léa » | tuile du jour « Mon test de départ » | règle 1 (« Sans faire le test de départ… », « Tant que le test de départ n'est pas fait… », « Depuis l'accueil de l'enfant… », « Un test de départ fait n'est plus proposé… », « Un enfant qui change de classe… », « Sans bibliothèque chargée… »), « Quitter le test de départ en cours… », règles 7 et 9 |
| #28 (« Je révise mes erreurs », 28.8) | « l'accueil de Léa propose la séance de révision, avec « … »( sur le téléphone de Paul) », « l'accueil de Léa ne propose pas de séance de révision », « Léa commence la séance de révision », « la proposition de la séance de révision mesure au moins 44 px de haut » | tuile du jour « À revoir » | règles 1, 2, 3, 5, 6 et 7 de `features/28-revisions-des-erreurs.feature` (dont « l'accueil de Léa propose la séance de révision ») |
| #65 (« Mes médailles ») | « Léa ouvre « Mes médailles » depuis son accueil(, au clavier seulement) », « Léa a ouvert « Mes médailles » depuis son accueil », « Léa ouvre « Mes médailles » sur le téléphone de Marie » | bouton « Mes médailles » du dock | tous les scénarios de `features/65-ecran-mes-medailles.feature` ; la phrase de description « En attendant le dock de #29… » devient caduque |

**Texte à changer si 29.8 est retenue** (la règle change : il y a de nouveau une leçon suivante, vers la leçon du jour) :
- #25 : « Après la dernière leçon du parcours, aucune leçon d'une autre matière n'est proposée » et « Après une leçon réussie d'une classe au-dessus, aucune leçon suivante n'est proposée » (N10). Ils deviennent ceux de la règle 3 de #29 ; les retirer de #25, ou les réécrire avec la leçon du jour.
- #26 : « Après une leçon des classes d'avant, aucune leçon suivante n'est proposée » (26.8) et, si 29.24 est retenue, « Après une leçon de la classe juste au-dessus, aucune leçon suivante n'est proposée » (26.19).
- Glossaire : la ligne « Leçon suivante » (« ni vers une autre matière avant #29 ») reçoit une note.

Les scénarios de #11 (« Léa choisit son profil enfant et son personnage guide la salue »), #12 (« Léa voit son accueil en mode dys ») et #6 (le nom de l'application ramène à l'accueil) restent vrais sans adaptation.

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

## Questions ouvertes

Les questions **29.1 à 29.18** sont dans `docs/stories/29/domain-model.md`, chacune avec sa recommandation. Les scénarios suivent ces recommandations :

| Question | Sujet | Scénarios `@a-valider` |
|---|---|---|
| 29.1 | Ordre des matières de la leçon du jour (reco : alterner français et maths, puis les autres) | 4 (règle 2) et, par effet, la règle 3 |
| 29.2 | Objectif du jour : 2 leçons ; révision comptée pour 1 ; leçon rejouée une fois ; classes d'avant comptées | 6 (règle 5) |
| 29.3 | Objectif du jour en Motivation | aucun (emplacement du code) |
| 29.4 | Compteur des tuiles de matière = celui de « Mon parcours » ; une tuile par matière du parcours | 3 (règle 6) |
| 29.5 | « Aujourd'hui » n'est pas un terme ; l'écran est l'accueil de l'enfant | aucun (vocabulaire des scénarios) |
| 29.6 | Ordre des tuiles du jour | 1 |
| 29.7 | Dock, tuiles « À revoir » et « Mon test de départ », « Changer d'enfant » | 11 (règles 4 et 7) |
| 29.8 | Leçon du jour en fin de séance sans leçon suivante | 4 (règle 3) |
| 29.9 | Pas de repli vers les classes d'avant | 1 |
| 29.10 | Défauts du legacy corrigés (dont salutation dite une fois) | 1 (et par 29.1, 29.2, 29.4) |
| 29.11 | Bibliothèque non chargée | 1 |
| 29.12 | Classe sans leçon | 2 |
| 29.13 | Jour de l'appareil ; recalcul à l'affichage | 1 |
| 29.14 | Date en tête de l'écran | 2 |
| 29.15 | Objectif atteint : seulement le texte | 1 (avec 29.2) |
| 29.16 | Libellé court de la matière sur la grande tuile (« Maths · CE1 ») | 2 |
| 29.17, 29.18 | « Tuile du jour » et « Leçon du jour » : termes du domaine | aucun (vocabulaire) |

Questions ajoutées par les critères d'acceptance :

**29.19. Le premier jour du mois dans la date.** La mise en forme du navigateur écrit « Vendredi 1 janvier ». L'usage français écrit « 1er janvier ».
- **Recommandation** : « Vendredi 1er janvier ». Le lecteur d'écran lit alors « premier ». Scénario : cas « premier jour du mois » de « L'accueil affiche la date du jour en toutes lettres… ». D'accord ?

**29.20. Salutation au retour sur l'accueil.** 29.10 f dit « une seule fois à l'arrivée ». L'enfant revient souvent sur l'accueil : depuis « Mon parcours », depuis la fin d'une séance, par le dock.
- **Recommandation** : la salutation n'est dite qu'au **choix du profil** dans « Qui joue ? ». Au retour sur l'accueil, elle reste écrite mais n'est pas dite de nouveau. Scénario : « En revenant sur son accueil depuis son parcours, l'enfant n'est pas salué de nouveau ». D'accord ?

**29.21. Où le dock se montre-t-il ?** 29.7 a dit « sur ces quatre écrans ».
- **Recommandation** : seulement sur l'accueil, « Mon parcours », « Toutes les leçons » et « Mes médailles ». Il n'est pas montré sur la page de la leçon, pendant une séance, une séance de révision ou le test de départ, ni dans « Qui joue ? » et l'espace parent : l'enfant reste dans ce qu'il fait, et la fin de séance a déjà « Accueil ». Scénarios : « Le dock n'est pas montré en dehors de ses quatre écrans », « « Changer d'enfant » reste sur l'accueil… ». D'accord ?

**29.22. Ordre des parties de l'accueil.** Le legacy montre, de haut en bas : l'en-tête, les tuiles du jour, la grande tuile, l'objectif du jour, les tuiles de matière.
- **Recommandation** : garder cet ordre. Ce que le parent a demandé et ce qui est dû viennent d'abord ; à 360 px, la grande tuile reste visible sans défiler quand il n'y a qu'une tuile du jour. Pas de scénario (mise en page), sauf si le PO le souhaite. D'accord ?

**29.23. Lecture à voix haute du reste de l'accueil.** Avec « tout lire à voix haute », le legacy ne lit que la salutation (et la pastille). Un enfant de CP qui lit mal ne sait pas ce que propose la grande tuile.
- Options : (a) comme le legacy, seulement la salutation (puis la pastille, #30) ; (b) avec « tout lire », Noisette lit aussi la leçon du jour (« Noisette t'attend pour une nouvelle leçon : Le son in ») ; (c) un bouton « Écouter » sur la grande tuile, comme les sections de « Mes médailles » (#65).
- **Recommandation : (a) dans cette story**, pour ne pas allonger la lecture à chaque arrivée ; (b) ou (c) à décider avec #30, qui ajoute déjà la pastille à la même lecture. Aucun scénario. D'accord, ou préférez-vous (b) ou (c) dès #29 ?

**29.24. Leçon suivante après une leçon de la classe juste au-dessus** (26.19). 29.8 cite trois cas sans leçon suivante ; #26 en ajoute un quatrième : une leçon de la classe juste au-dessus, ouverte depuis « Toutes les leçons » quand la matière de la classe est réussie.
- **Recommandation** : même règle que 29.8 : la fin de séance propose la leçon du jour, si elle existe et n'est pas la leçon jouée. Exemple : Léa, CE1, maths du CE1 réussies, finit « Les tables de 2 » (CE2) ; elle se voit proposer la prochaine leçon de français du CE1. Le scénario de #26 « Après une leçon de la classe juste au-dessus, aucune leçon suivante n'est proposée » serait réécrit. Pas de scénario ici (la bibliothèque de test de l'accueil n'a pas de classe juste au-dessus ouverte). D'accord ?
