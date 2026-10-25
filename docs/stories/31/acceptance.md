# Critères d'acceptance : issue #31, badges et compétences, un badge par leçon acquise

Scénarios : `features/31-badges.feature` (tags `@issue-31 @wip`).
Modèle du domaine : `docs/stories/31/domain-model.md` (contexte **Motivation**, lecture seule des meilleures étoiles d'**Apprentissage**, de la compétence du **Catalogue pédagogique** ; les leçons personnelles d'**Accompagnement** ne donnent pas de badge).

> Cadrage anticipé (décision 0020, point 6), **validé par le PO le 2026-10-25** (voir « Décisions du PO »). Toutes les recommandations sont retenues ; les leçons personnelles ne donnent pas de badge, donc 31.5, 31.22 et la partie « leçons personnelles » de 31.7 sont sans objet. Plus aucun scénario `@a-valider` ; les commentaires « Décision 31.n » renvoient aux décisions. Les scénarios qui attendent une story non mergée portent `@depend-de-39` (leçons personnelles) ou `@depend-de-32` (section de la cabane, zone « nouveautés » de l'écran de fin).

## Objectif

En tant qu'**enfant**, je veux recevoir un badge qui dit ce que je sais faire quand j'ai bien réussi une leçon, afin de voir mes progrès.

La story remplit la section « Mes badges » de l'écran « Mes médailles » (#65, 3e section réservée : cabane, histoire, badges, records) et ajoute l'encart « Nouveau badge » à la zone « nouveautés » de l'écran de fin (ouverte par #32). Le badge ne fait que **constater** qu'une leçon de la bibliothèque est **acquise** (au moins 2 meilleures étoiles) : il ne modifie aucune étoile, n'est pas enregistré (décision 31.3 : pas de migration, pas d'Edge Function) et ne se perd jamais tant que sa leçon est dans la bibliothèque. Une leçon personnelle ne donne pas de badge (décision du PO, comme 39.12).

Comportement actuel (`app/app.js`, `badgesOf`, `showTrophees`, fin de séance l. 1895 et 1946) repris comme premiers exemples : un badge par leçon à 2 étoiles ou plus, hors test de départ ; nom = compétence, sinon « Je sais : `<titre>` » ; section toujours affichée, phrase « Gagne au moins 2 étoiles dans une leçon pour recevoir son badge. » ; icône de la matière ; encart « Nouveau badge » seulement quand le nombre de badges augmente. Écarts décidés (issue et décisions) : un seul badge par compétence (31.2), ordre du catalogue (31.7), annonce par le personnage guide (31.4, décision Q74 de #24), ordre des nouveautés cabane, épisode, badge (33.13), lecture à voix haute (31.9), 360 px, mouvements réduits, **aucun badge pour une leçon personnelle** (le legacy en donnait un).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Une leçon de la bibliothèque acquise donne un badge ; 1 étoile, le test de départ ou une leçon personnelle n'en donnent pas ; un badge ne se perd jamais tant que sa leçon est dans la bibliothèque | « Les syllabes » à 2 → « Je découpe un mot en syllabes » · à 3 → idem · à 1 → aucune pastille · « Les syllabes » et « Utiliser le bon mot » réussies au test de départ → aucune pastille · réussie au test de départ puis 2 étoiles → badge · « Les sons de test » à 3 rejouée à 1 → badge gardé · « Les tables de 3 et de 4 » (CE2) à 2, Léa passée de CP à CE1 → badge gardé · 3 étoiles à « Les anciens sons », retirée → pas de badge · leçon personnelle « Dictée : chaton, maison, poisson » à 2 → aucune pastille · séance d'une fluence seule → pas de badge (unitaire) |
| 2. Le nom du badge est la compétence, sinon « Je sais : `<titre>` » ; une compétence ne donne qu'un badge | « Être et avoir au présent » → « Je sais : Être et avoir au présent » · « Dictée : les animaux » → « Je sais : Dictée : les animaux » · « Dictée : les mots invariables » (CE1) + « Dictée : d'autres mots invariables » (CE2) → un seul « J'écris des mots invariables sans erreur » · « Les durées » (CE2) + « Calculer des durées » (CM2) → un seul « Je calcule des durées » |
| 3. « Mes badges » montre une pastille par badge du profil en cours, toujours dans le même ordre | aucun badge → « Mes badges » et « Gagne au moins 2 étoiles… » · « Les tables de 3 et de 4 », « Les syllabes », « Les sons ou, on, an » → ordre sons, syllabes, tables · icône du français / des maths · juste après la séance → badge déjà là · pastille choisie → on reste sur l'écran · sans réseau → pas de section, pas d'erreur · profil préparé sans profil réel → badges des étoiles de l'appareil |
| 4. La fin de la séance qui rend une leçon acquise annonce « Nouveau badge » ; rejouer une leçon déjà acquise ne l'annonce pas | 1 → 2 étoiles → « Nouveau badge » « Je reconnais les sons de test » · première séance à 2 étoiles, sans compétence → « Je sais : Les sons de test » · phrase « … Nouveau badge : Je reconnais les sons de test ! » · 2 → 3, 3 → 2, 2 → 1, 1 → 1 → rien · compétence déjà badge par « La suite de test » → rien · sans réseau au début → rien · 1 étoile en tout + 2 → lanterne puis badge, dans cet ordre (cabane, épisode, badge, 33.13) · mouvements réduits → sans mouvement |
| 5. Voix, lecteur d'écran, dys, 360 px | Tout lire : …, « La cabane de Noisette », sa phrase, « Mes badges », « Tu as 1 badge. » · « Écouter » : « Mes badges », « Tu as 2 badges. » · pastille choisie → son nom lu · un badge sans objet ni record → « Regarde tout ce que tu as gagné ! » · lecteur d'écran : « Mes badges, avec 2 badges », puis le nom · « Je résous des problèmes où l'on cherche le début ou le changement » et « Je sais : Dictée : les animaux » à 360 px · mode dys |
| 6. Seulement le profil en cours | Tom « Les syllabes » à 3, Léa rien → aucune pastille · Léa « Les syllabes », Tom « Les sons ou, on, an » → Léa voit seulement le sien · Marie retrouve le badge · Claire ne reçoit rien |

## Règles

| # | Règle | Scénarios | Décisions |
|---|---|---|---|
| 1 | Une leçon de la bibliothèque acquise donne un badge ; une leçon réussie à 1 étoile ou au test de départ n'en donne pas, une leçon personnelle non plus ; un badge ne se perd jamais tant que sa leçon est dans la bibliothèque | Avec <étoiles> étoiles à une leçon, l'enfant a le badge de sa compétence (2 cas : 2, 3) · Une leçon réussie avec 1 étoile ne donne pas de badge · Une leçon réussie au test de départ ne donne pas de badge · Une leçon réussie au test de départ puis rejouée avec 2 étoiles donne son badge · Rejouer une leçon acquise avec 1 étoile garde son badge · Après un changement de classe, l'enfant garde les badges des leçons d'une autre classe · Une leçon qui n'est plus dans la bibliothèque ne donne pas de badge · Une leçon personnelle acquise ne donne pas de badge (`@depend-de-39`) | 31.1, 31.3, 31.10, 31.13, 31.18, décision du PO (leçons personnelles) |
| 2 | Le nom du badge est la compétence de la leçon, sinon « Je sais : `<titre de la leçon>` » ; une compétence ne donne qu'un badge | Une leçon sans compétence donne le badge « Je sais : <titre> » (2 cas) · Les leçons acquises d'une même compétence ne donnent qu'un badge (2 cas) | 31.2, 31.20 |
| 3 | La section « Mes badges » de « Mes médailles » montre une pastille par badge du profil en cours, toujours dans le même ordre | Sans badge, la section invite l'enfant à gagner au moins 2 étoiles · Les badges suivent l'ordre du catalogue : matière, puis niveau, puis ordre de la leçon · La pastille d'un badge montre l'icône de sa matière (2 cas) · Juste après la séance qui rend une leçon acquise, son badge est déjà dans « Mes badges » · Une pastille de badge n'ouvre pas la leçon · Sans réseau, la section des badges n'apparaît pas, sans message d'erreur · Avec le profil préparé, sans profil réel au serveur, les badges viennent des étoiles gagnées sur l'appareil | 31.7, 31.8, 31.10, 31.14, 31.15 |
| 4 | La fin de la séance qui rend une leçon acquise annonce « Nouveau badge » ; rejouer une leçon déjà acquise ne l'annonce pas | Passer de 1 à 2 étoiles rend la leçon acquise et fait annoncer son badge · La première séance avec 2 étoiles d'une leçon sans compétence annonce le badge « Je sais : Les sons de test » · Le personnage guide termine sa phrase de fin par le nouveau badge · Sans leçon devenue acquise, la fin de la séance n'annonce aucun badge (4 cas) · Une leçon dont la compétence est déjà un badge n'annonce pas de nouveau badge · Sans réseau au début de la séance, la fin de la séance n'annonce aucun badge · Quand la séance fait recevoir un objet et gagner un badge, la cabane est annoncée avant le badge (`@depend-de-32`) · Avec les mouvements réduits, l'annonce du nouveau badge apparaît sans mouvement | 31.2, 31.4, 31.12, 31.14, 31.16, 31.25, 31.26, 33.13 |
| 5 | Les badges se lisent à voix haute, au lecteur d'écran, en mode dys et sur un petit écran | Avec « tout lire à voix haute », le titre des badges puis leur nombre sont lus à l'ouverture (`@depend-de-32`) · Sans « tout lire à voix haute », l'enfant fait lire les badges à la demande · Choisir une pastille de badge fait lire son nom · Avec un badge, même sans objet ni record, le personnage guide dit « Regarde tout ce que tu as gagné ! » (`@depend-de-32`) · Un lecteur d'écran annonce la liste des badges et le nom de chaque badge · Le badge au nom le plus long tient dans un écran de 360 px de large · Avec le mode dys, la section des badges s'affiche en mode dys | 31.8, 31.9, 31.11, 31.15, 31.24 |
| 6 | Les badges ne viennent que des leçons du profil enfant qui joue | Un enfant ne voit jamais le badge d'un autre enfant du même parent (`@acces`) · Quand deux enfants du même parent ont des badges, chacun ne voit que les siens (`@acces`) · Le second parent rattaché retrouve les badges de Léa sur son téléphone (`@acces`) · Un parent qui n'est pas rattaché ne lit pas les étoiles qui donnent les badges de Léa (`@acces`) | 31.19 |

Total : 6 règles, 36 scénarios (43 cas), dont 4 `@acces`, 1 `@depend-de-39`, 3 `@depend-de-32` ; aucun `@a-valider`.

L'ordre des sections de « Mes médailles » (cabane, histoire, badges, records) n'a pas de scénario ici : il est déjà couvert par le scénario de #65 « Les quatre sections apparaissent dans l'ordre cabane, histoire, badges, records » (`@depend-de-31 @depend-de-32 @depend-de-33`), qui devient exécutable avec #31.

Droits d'accès (`@acces`) : les badges se déduisent des meilleures étoiles lues sous la RLS existante de `resultats_des_lecons` (#24, lecture par un parent rattaché), comme la cabane. La RLS ne sépare pas deux enfants d'un même parent : c'est le filtre sur le **profil en cours** qui garantit que les badges de Tom n'apparaissent pas chez Léa ; les deux scénarios Léa / Tom le vérifient (l'un sans étoile pour Léa, l'autre avec des badges des deux enfants). Le scénario Claire reprend mot pour mot les étapes de #24 et #32. #31 ne lit pas les leçons personnelles (#39) : elles ne donnent pas de badge.

## Ce qui se vérifie en test unitaire, et ce qui demande l'E2E

Tests unitaires du domaine, **exhaustifs** :

- `@domain/apprentissage`, `leconsAcquises` : aucune leçon → vide ; 1 → non ; 2 et 3 → oui ; même seuil que `ResultatDeLaLecon.estAcquise`.
- `leconAcquiseParLaSeance` : aucune avant + 2 → la leçon ; 1 + 2 → la leçon ; 1 + 3 → la leçon ; 1 + 1 → aucune ; 2 + 3, 3 + 1 → aucune ; séance sans étoiles (fluence seule, Q69) → aucune.
- `@domain/motivation`, `nomDuBadge` : compétence ; sans compétence → « Je sais : `<titre>` » ; compétence vide ou faite d'espaces → repli.
- `badgesDuProfil` : vide ; une leçon ; deux leçons d'une compétence → un badge (31.2) ; trois leçons (« Je calcule des durées », CE2, CM1, CM2) → un badge ; deux leçons sans compétence → deux badges ; leçon acquise absente de la bibliothèque (leçon retirée, leçon personnelle) → ignorée (31.13, décision du PO) ; ordre (31.7) ; déterminisme.
- `badgeGagneParLaSeance` : aucune leçon acquise par la séance → aucun ; leçon nouvelle → son badge ; compétence déjà badge → aucun (31.2) ; jamais deux badges.
- Paroles : « Mes badges », phrase sans badge, « Tu as 1 badge. » / « Tu as 2 badges. » (31.9), libellé « Mes badges, avec 1 badge » / « … avec 2 badges » (31.24), « Nouveau badge », fin de phrase « Nouveau badge : `<nom>` ! » (31.4, 31.25), composition avec la cabane et l'épisode (cabane, épisode, badge, 33.13).
- Sections de « Mes médailles » : section `badges` disponible même vide (31.10), phrase d'ouverture « Regarde tout ce que tu as gagné ! » dès un badge (31.11).

E2E (`features/31-badges.feature`) : ce qui passe par la lecture sous RLS, le profil en cours, l'écran « Mes médailles », l'écran de fin, la voix et l'accessibilité. Le test de départ n'a pas de scénario de fin : il ne lit pas `resultats_des_lecons` et n'a pas d'écran de fin de séance ; la règle est vérifiée par « Une leçon réussie au test de départ ne donne pas de badge ».

## Données de test

- Leçons **réelles** de la bibliothèque (titre, compétence, matière, niveau, vérifiés dans `app/bibliotheque.json`) :
  - « Les sons ou, on, an » (`fr-cp-sons-ou-on-an`) : « Je reconnais les sons ou, on, an », français, CP, ordre 5 ;
  - « Les syllabes » (`fr-cp-syllabes`) : « Je découpe un mot en syllabes », français, CP, ordre 8 ;
  - « Utiliser le bon mot » (réussie au test de départ, reprise de #32) ;
  - **sans compétence** : « Être et avoir au présent » (`fr-cp-etre-avoir`) et « Dictée : les animaux » (`fr-cp-dictee-animaux`), français, CP ;
  - **compétence partagée** : « Dictée : les mots invariables » (`fr-ce1-dictee-invariables`, CE1) et « Dictée : d'autres mots invariables » (`fr-ce2-dictee-invariables`, CE2), « J'écris des mots invariables sans erreur » ; « Les durées » (`ma-ce2-durees`, CE2) et « Calculer des durées » (`ma-cm2-durees`, CM2), « Je calcule des durées » (partagée aussi par « Heures, minutes, secondes », `ma-cm1-durees`) ;
  - « Les tables de 3 et de 4 » (`ma-ce2-tables-3-4`) : « Je connais les tables de 3 et de 4 », maths, CE2 ;
  - « Problèmes : retrouver le début » (`ma-cp-transformation-2`) : « Je résous des problèmes où l'on cherche le début ou le changement », maths, CP (compétence la plus longue, 65 caractères, pour 360 px).
- Leçons **de test** de #24 : « Les sons de test » et « La suite de test » (sans compétence, en Contexte). Étapes nouvelles qui leur donnent une compétence pour un scénario : « la leçon de test « Les sons de test » a pour compétence « Je reconnais les sons de test » » et « les leçons de test « Les sons de test » et « La suite de test » ont pour compétence « … » » (donnée de test, pas une règle).
- Leçon personnelle (`@depend-de-39`) : « Dictée : chaton, maison, poisson », créée par Paul, à 2 étoiles, pour vérifier qu'elle ne donne pas de badge ; forme des étapes à caler avec #39.
- Profil réel : toute étape qui écrit des étoiles en base suppose un profil réel créé pour Paul (`features/steps/profil-reel.ts`, décision 0021, point 5), comme #24, #25, #27 et #32. Seul « Avec le profil préparé, sans profil réel au serveur… » garde le profil préparé du Contexte.
- Les séances jouées en E2E sont celles de « Les sons de test » (10 questions : 2 erreurs donnent 2 étoiles, 5 erreurs 1 étoile, 0 erreur 3 étoiles), jamais une leçon réelle. Aucune migration.
- Steps réutilisés sans changement de sens : « Léa a pour meilleures étoiles : », « Léa a pour leçons réussies au test de départ : », « Léa a terminé une séance de la leçon « … » avec N étoile(s) », « Léa n'a encore jamais terminé de séance de la leçon « … » », « Léa joue la séance complète de la leçon « … » », « Léa a fait N erreurs pendant la séance », « Léa réussit la dernière question de la séance », « Noisette dit une félicitation, suivie de « … » », « Léa a gagné N étoile(s) en tout », « Léa a 3 étoiles à une leçon « … » qui n'est plus dans la bibliothèque », « Léa ouvre « Mes médailles » depuis son accueil » (et « … sur le téléphone de Marie », « Léa a ouvert … »), « Léa choisit la pastille « … » », « le titre de l'écran est toujours « Mes médailles » », « Léa lit « … » », « les lecteurs d'écran annoncent « … » », « Léa entend Noisette lire, dans l'ordre : », « Léa entend Noisette lire « … », puis « … » », « Léa entend Noisette dire « … » », « Léa a un record de N à la fluence « … » », « Léa joue avec le profil préparé, sans profil réel au serveur », « Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1 », « le réseau est coupé », « aucun message d'erreur n'apparaît », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « le bouton d'accès à l'écran, « Retour » et chaque bouton « Écouter » mesurent au moins 44 px de haut », « l'appareil demande des mouvements réduits », « Paul a réglé « … » sur « … » pour Léa », « le réglage « … » de Léa est sur « … » », « Tom a un profil enfant préparé de niveau CP », « Marie est rattachée au profil enfant de Léa », « Léa a gagné 2 étoiles à la leçon « … » sur la tablette », « Claire est connectée sur le téléphone », « Claire demande les étoiles du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa ». Plusieurs viennent de #32 (non mergée) ou sont restreints au tag d'une autre story : à étendre à `@issue-31` par l'e2e-tester, sans en changer le sens.
- Steps nouveaux (formulations) : « les badges montrent seulement « … » », « les badges montrent, dans l'ordre : », « aucune pastille de badge n'apparaît », « aucune section « Mes badges » n'apparaît » (variante de « aucune section « … » n'apparaît »), « la pastille « … » montre l'icône de la matière … », « la fin de la séance annonce un nouveau badge « … » », « aucune annonce de nouveau badge n'apparaît à la fin de la séance », « la fin de la séance montre, dans l'ordre, l'annonce pour la cabane puis l'annonce de nouveau badge », « l'annonce de nouveau badge apparaît sans mouvement », « Léa demande à écouter les badges », « Léa entend Noisette lire « … » », « Léa voit le titre et les pastilles des badges en mode dys : … », « Tom a pour meilleures étoiles : », compétence donnée aux leçons de test, leçon personnelle créée, étoiles d'une leçon personnelle.

## Hors périmètre

- Carte des compétences et suivi du parent (#34), dont la règle « acquis » par section du programme (question 31.17).
- Badges dans l'Espace parent (question 31.19).
- Nom de l'écran « Mes médailles » et section des records de calcul rapide (livrés par #65, décision 65.1).
- Section de la cabane, zone « nouveautés » de l'écran de fin (#32) ; épisodes (#33).
- Badges des leçons personnelles : aucun (décision du PO du 2026-10-25, comme 39.12).
- Copie des meilleures étoiles sur l'appareil pour l'affichage hors ligne (#44).
- Ajout d'une compétence aux 12 leçons qui n'en ont pas : travail de contenu dans `scripts/lecons/`, hors story (question 31.20).
- Export et suppression : rien n'est enregistré (31.3) ; les meilleures étoiles sont déjà couvertes par #24 et #14.
- Séances de révision (#28) : à confirmer avec #28 qu'elles ne changent pas les meilleures étoiles (remarque du modèle).

## Décisions du PO (2026-10-25)

Annonce du responsable sur l'issue #31 (https://github.com/SBA-dev/github-move/issues/31#issuecomment-6400998108), mot pour mot :

> [Responsable] VALIDÉ avec 1 changement — réponse du PO, mot pour mot (session de questions, 25/10, vérifiée) : « 31. reco OK »
> Puis, sur la contradiction avec 39.12 (leçon personnelle sans badge), à la question « A. Non : on garde 39.12 ; #31 retire les badges des leçons personnelles, et 31.5, 31.7 et 31.22 deviennent sans objet. B. Oui : on garde #31 ; 39.12 devient « badge compris » », le PO a répondu : « A ».
> **Pour #31** : **les leçons personnelles ne donnent pas de badge.** 31.5, 31.7 et 31.22 deviennent sans objet. Toutes les autres recos sont retenues.

Question commune avec #33 : **33.13**, reco retenue, un seul ordre des nouveautés à l'écran de fin (zone « nouveautés » et phrase du personnage guide) : **cabane, épisode, badge**. Elle remplace l'ordre du legacy (épisode, cabane, badge) que proposaient 31.4 et 31.12.

| Question | Décision |
|---|---|
| 31.1 | Reco retenue : une leçon réussie au test de départ ne donne pas de badge (27.1, 27.2) ; rejouée avec 2 étoiles, elle donne son badge. |
| 31.2 | Reco retenue : un seul badge par compétence, annoncé à la première leçon acquise de la compétence ; une leçon sans compétence garde son propre badge. |
| 31.3 | Reco retenue : badge recalculé à partir des meilleures étoiles, sans table, sans date, sans migration, sans abonnement à `LeconAcquise`. |
| 31.4 | Reco retenue : encart « Nouveau badge » et fin de la phrase du personnage guide « Nouveau badge : `<nom>` ! », après la cabane et l'épisode (33.13) ; l'encart n'est pas lu par la voix. |
| 31.5 | **Sans objet** : les leçons personnelles ne donnent pas de badge. |
| 31.6 | Reco retenue : nom « Mes médailles » et records déjà livrés par #65 ; #31 remplit seulement la section `badges`. |
| 31.7 | Reco retenue pour les leçons de la bibliothèque : ordre du catalogue, matière (français, maths, sciences, histoire, anglais, EMC), puis niveau, puis `ordre`. La partie « leçons personnelles à la fin, par titre » est **sans objet**. |
| 31.8 | Reco retenue : icône de la matière du legacy sur la pastille, décorative pour le lecteur d'écran. |
| 31.9 | Reco retenue : avec « tout lire », « Mes badges » puis « Tu as N badge(s). » à l'ouverture ; sinon bouton « Écouter » ; toucher une pastille lit son nom. |
| 31.10 | Reco retenue : section toujours affichée quand les étoiles ont pu être lues, avec la phrase du legacy « Gagne au moins 2 étoiles dans une leçon pour recevoir son badge. ». |
| 31.11 | Reco retenue : un badge compte pour « Regarde tout ce que tu as gagné ! ». |
| 31.12 | Reco retenue : encart « Nouveau badge » (titre et nom, sans icône) après « Pour la cabane » et après l'épisode (33.13). |
| 31.13 | Reco retenue : une leçon qui n'est plus dans la bibliothèque ne donne pas de badge. |
| 31.14 | Reco retenue : comme la cabane (32.13, 32.19, 32.22) : sans réseau, ni section ni encart, sans message d'erreur ; profil préparé, badges des étoiles de l'appareil ; étoiles de la séance en cours d'envoi comptées tout de suite. |
| 31.15 | Reco retenue : une pastille n'ouvre pas la leçon, elle lit seulement le nom. |
| 31.16 | Reco retenue : animation courte de l'encart sur l'écran de fin seulement, supprimée avec les mouvements réduits. |
| 31.17 | Reco retenue : la règle de la carte des compétences se tranche dans #34. |
| 31.18 | Reco retenue : tous les badges du profil, quel que soit son niveau actuel. |
| 31.19 | Reco retenue : pas de badges dans l'Espace parent dans #31. |
| 31.20 | Reco retenue : on garde le repli « Je sais : `<titre>` » et on ajoute une compétence aux 12 leçons de la bibliothèque qui n'en ont pas (contenu, hors story). La question d'un autre repli pour les leçons personnelles est sans objet. |
| 31.21 | Reco retenue : « médaille » est seulement le nom de l'écran, jamais celui d'un badge ; le code et les scénarios disent « badge ». |
| 31.22 | **Sans objet** : les leçons personnelles ne donnent pas de badge, #31 ne lit pas leur titre. |
| 31.23 | Reco retenue : #31 met à jour, dans la même PR, les scénarios de #65 et #32 que la section « Mes badges » toujours affichée rend faux, sans changer leurs règles. |
| 31.24 | Reco retenue : la liste porte le libellé « Mes badges, avec N badge(s) », puis chaque pastille annonce le seul nom du badge. |
| 31.25 | Reco retenue : même forme pour un nom de repli, « Nouveau badge : Je sais : `<titre>` ! » (cas qui disparaît quand les 12 leçons ont une compétence, 31.20). |
| 31.26 | Reco retenue : une séance d'un exercice qui rend la leçon acquise donne le badge et l'annonce, sans règle propre au badge. |

## Questions ouvertes

Aucune.
