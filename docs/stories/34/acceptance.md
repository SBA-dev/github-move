# Critères d'acceptance : issue #34, Suivi et carte des compétences

Scénarios : `features/34-suivi-et-carte-des-competences.feature` (tags `@issue-34 @wip`).
Modèle du domaine : `docs/stories/34/domain-model.md` (contexte **Accompagnement**, qui lit **Apprentissage**, le **Catalogue pédagogique** et **Famille**). Les questions 34.1 à 34.22 viennent du modèle, 34.23 à 34.28 ont été ajoutées ici, et 34.29 est née de l'application des décisions.

Le PO a validé #34 le 2026-10-25 (17:30 UTC). Il a retenu les recommandations, sauf pour 34.4, 34.8 et 34.11 (voir « Décisions du PO (25/10) »). Les scénarios concernés portent un commentaire `# Réponse 34.n`, complété par `(I<n>)` quand ils appliquent une interprétation du modèle. Un seul scénario porte encore `@a-valider` : la nouvelle question 34.29. Les scénarios qui lisent les révisions des erreurs de #28 (pas encore mergée, PR #85) portent `@depend-de-28`.

Décisions antérieures (commentaire [Responsable] du 2026-10-25 sur l'issue) : #13 (second parent) et #14 (export et suppression) sont **sorties de la beta**. Aucun scénario ici ne porte sur le second parent ni sur l'export.

## Objectif

En tant que **parent**, je veux voir la progression de chacun de mes enfants (leçons réussies, étoiles, séances jouées, erreurs corrigées pour de bon, carte des compétences, leçons jouées), afin de savoir où il en est et de l'aider.

Le **suivi** est une vue calculée à l'affichage, dans le navigateur, sans aucune donnée propre :
- il montre **un enfant à la fois**, l'**enfant suivi**, que le parent choisit. À l'ouverture, c'est le premier profil enfant dans l'ordre de création (34.8) ;
- ses chiffres ne comptent que la **classe en cours**, c'est-à-dire le niveau actuel du profil. Les leçons jouées des autres classes sont listées **à part**, « à titre indicatif » (34.11) ;
- il lit sous RLS les faits d'Apprentissage : meilleures étoiles, séances terminées, résultat du test de départ, séances de révision terminées, erreurs corrigées pour de bon. Il les met en regard des leçons de la bibliothèque et des sections du programme (Catalogue) ;
- il ne modifie rien et ne recalcule aucune étoile.

Le comportement actuel (`app/`, `adultSuivi`, `skillMap`) a donné les premiers exemples. Écarts voulus, tranchés par le PO :
- une leçon réussie au test de départ est **réussie**, jamais **acquise** (27.1). Elle compte dans « leçons réussies » (34.3) et se lit « réussie au test de départ » (34.14). Elle laisse sa section **« à faire »** (34.4) ;
- l'état de la section se dit « acquise » (34.2) ;
- **une vue par enfant**, au lieu de tous les enfants l'un sous l'autre (34.8) ;
- **chiffres limités à la classe en cours**. Les leçons des autres classes sont à part, avec la mention « classe précédente » ou « classe au-dessus » (34.11) ;
- la séance de révision et la séance de fluence seule ne donnent pas d'étoile (28.2, #20) ;
- pas de bilan des 7 derniers jours (#35, 34.15).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Le suivi est en tête de l'espace parent et montre un enfant à la fois, choisi par le parent ; à l'ouverture, le premier profil dans l'ordre de création | « Suivi » avant « Profils » · Tom (CM1) créé avant Léa (CE1) → enfant suivi « Tom · CM1 », choix « Tom · CM1 », « Léa · CE1 », rien de Léa · Paul choisit « Léa · CE1 » → ses chiffres · un seul profil → choix affiché, déjà fait · ordre : titre, chiffres, carte, leçons jouées, pas de bilan de la semaine · sans profil → « Aucun profil pour l'instant. Crée-en un dans la partie Profils. » |
| 2. Les chiffres comptent la classe en cours ; séances de révision et erreurs corrigées pour de bon sans filtre de classe | rien joué → 0, 0, 0, 0 · CE1 : « Les sons ou, on, an » (CP) 3, « Les mots contraires » 1, « Le pluriel des noms » 2 → 2 leçons, 3 étoiles, 2 séances · « Le pluriel des noms » joué 3 fois (1, 3, 2) → 1 leçon, 3 étoiles, 3 séances · réussies au test de départ : 1 du CP, 2 du CE1 ; puis séances à 1 et 2 → 4 leçons, 3 étoiles, 2 séances · fluence seule → 0 leçon, 1 séance · 2 séances du CE1, 1 du CP, 3 séances de révision, 4 erreurs corrigées → 2 leçons, 3 étoiles, 5 séances, 4 · leçon retirée de la bibliothèque → ni leçon, ni étoile, ni séance (34.29) |
| 3. La carte montre les sections du niveau, par matière puis par domaine, avec les titres des leçons | bloc replié « Carte des compétences du programme (CE1) » · Français, Mathématiques, Sciences, Histoire et géographie, Anglais ; Lecture, Écriture, Oral, Vocabulaire, Grammaire et orthographe ; pas de « Vivre ensemble (EMC) » au CE1 · « Comprendre un texte » → « L'ordre alphabétique », « Lecture : La cabane dans l'arbre » · passée en CE2 → « Léa · CE2 », carte (CE2), chiffres à 0 |
| 4. État de la section | rien joué → « Comprendre un texte » à faire, « Apprendre à écrire en écriture cursive » pas encore de leçon · « Les mots contraires » à 1 étoile → en cours ; à 2 ou 3 → acquise · « a ou à ? » à 1 et « Le pluriel des noms » à 2 → acquise · réussie au test de départ seulement → **à faire** · fluence seule → en cours · CM1 avec « Robinson Crusoé » (CM2) à 3 → « Imaginer et vivre d’autres vies » acquise · légende « acquise (1) », « en cours (1) », somme = nombre de lignes |
| 5. Leçons jouées : la classe en cours d'abord, les autres classes à part avec leur mention | rien joué → « Pas encore de leçon jouée. », pas de zone à part, carte toujours là · bloc replié · 3 leçons, tri par date puis titre · rejouée 3 puis 1 → « ★★★ », 5 erreurs, date de la dernière · réussie au test de départ → « réussie au test de départ », « – », 05/10/2026 · puis séance à 1 → « ★ », date de la séance · fluence seule → « – », 2 erreurs · CE2 : « L'imparfait », puis à part « Les sons ou, on, an » (CP) et « Le pluriel des noms » (CE1), « classe précédente », la plus récente d'abord · CE1 avec seulement une leçon de CP → « Pas encore de leçon jouée. » et zone à part · redescendue en CE1 → « L'imparfait », « classe au-dessus » |
| 6. Réseau, lecteur d'écran, clavier, petit écran | sans réseau → « Le suivi a besoin d'Internet. Réessaie dans un instant. » · « … : acquise », « … : pas encore de leçon » · « 2 étoiles sur 3 » · carte dépliée au clavier · enfant choisi au clavier · 360 px, choix de l'enfant et boutons des blocs de 44 px |
| 7. Droits | Claire, rattachée à Tom, ne peut choisir que « Tom · CM2 » · avec l'identifiant de Léa, Claire ne reçoit ni étoiles, ni séances terminées, ni résultat du test de départ, ni file de révision, ni séances de révision terminées · les séances de Tom n'apparaissent pas dans le suivi de Léa |

## Règles

| # | Règle | Scénarios | Décisions |
|---|---|---|---|
| 1 | Le suivi est en tête de l'espace parent et montre un enfant à la fois, choisi par le parent ; à l'ouverture, le premier profil enfant dans l'ordre de création | Le suivi est la première partie de l'espace parent · À l'ouverture, le suivi montre le premier enfant dans l'ordre de création, et propose de choisir les autres · Le parent choisit l'enfant dont il voit le suivi · Avec un seul profil enfant, le choix de l'enfant est affiché et déjà fait · Le suivi d'un enfant montre ses chiffres, puis la carte des compétences, puis les leçons jouées · Sans profil enfant, le suivi invite à en créer un | 34.8 (I8, I9), 34.15, 34.17, 34.18 |
| 2 | Les chiffres du suivi comptent, pour la classe en cours, les leçons réussies, le total des étoiles et les séances terminées, ainsi que toutes les séances de révision et les erreurs corrigées pour de bon | Un enfant qui n'a rien joué a ses quatre chiffres à 0 · Les chiffres ne comptent que les leçons de la classe en cours, avec leurs meilleures étoiles · Une leçon rejouée compte une fois, avec ses meilleures étoiles, et chacune de ses séances est jouée · Les leçons de la classe en cours réussies au test de départ comptent parmi les leçons réussies, sans étoile ni séance jouée · Une séance de fluence seule compte parmi les séances jouées, sans rendre sa leçon réussie · Toutes les séances de révision et toutes les erreurs corrigées pour de bon comptent, quelle que soit la classe (`@depend-de-28`) · Une leçon qui n'est plus dans la bibliothèque n'est comptée nulle part dans les chiffres (`@a-valider`, 34.29) | 34.3, 34.5, 34.11 (I1, I2, I3), 34.12, 34.13 |
| 3 | La carte des compétences montre chaque section du programme du niveau de l'enfant, regroupée par matière puis par domaine, avec les titres de ses leçons | La carte des compétences est repliée et porte le niveau de l'enfant · La carte des compétences d'un enfant de CE1 regroupe les sections du CE1 par matière, puis par domaine, dans l'ordre du programme · Une ligne de la carte montre la section et les titres de ses leçons · Après un changement de classe, le suivi, ses chiffres et la carte suivent le nouveau niveau | 34.1, 34.11 (I1, I11), 34.23 |
| 4 | Une section est acquise dès qu'une de ses leçons est acquise, en cours dès qu'une de ses leçons a une séance terminée, à faire sinon, et « pas encore de leçon » sans leçon | Sans aucune leçon jouée, une section qui a des leçons est à faire, une section sans leçon n'en a pas encore · Une leçon à <étoiles> étoile(s) rend sa section « <état> » (3 cas : 1, 2, 3) · Une seule leçon acquise suffit pour que sa section soit acquise · Une section dont la seule leçon réussie l'est au test de départ reste à faire · Une leçon jouée seulement en fluence seule met sa section en cours · Une section du CM1 et du CM2 compte les leçons de ses deux niveaux · La légende de la carte compte les sections de chaque état | 34.1, 34.2, 34.4, 34.9 (I11), 34.10, 34.12 |
| 5 | Les leçons jouées de la classe en cours sont listées, la plus récente d'abord, avec leurs meilleures étoiles et leur dernière séance ; celles des autres classes sont à part, avec leur mention | Sans leçon jouée, le suivi le dit, et la carte des compétences reste proposée · Les leçons jouées sont dans un bloc replié · Chaque leçon jouée montre sa matière, ses étoiles, ses erreurs de la dernière séance et sa date, la plus récente d'abord · Une leçon rejouée montre ses meilleures étoiles, mais les erreurs et la date de sa dernière séance · Une leçon réussie au test de départ est listée comme telle, sans erreurs, à la date du test de départ · Après une séance, une leçon réussie au test de départ montre ses étoiles et la date de cette séance · Une leçon jouée seulement en fluence seule est listée sans étoile, avec ses erreurs · Les leçons jouées des classes précédentes sont listées à part, après la classe en cours, avec la mention « classe précédente » · Sans leçon jouée de la classe en cours, le suivi le dit, et montre à part les leçons des classes précédentes · Redescendue de classe, l'enfant a ses leçons de la classe d'au-dessus à part, avec la mention « classe au-dessus » | 34.7, 34.11 (I4 à I7), 34.12, 34.14, 34.23, 34.24, 34.26 |
| 6 | Le suivi demande le réseau, et se lit au lecteur d'écran, au clavier et sur un petit écran | Sans réseau, le suivi dit qu'il a besoin d'Internet · L'état de chaque ligne de la carte est écrit en toutes lettres et lu par un lecteur d'écran · Un lecteur d'écran lit en toutes lettres les étoiles d'une leçon jouée · La carte des compétences se déplie au clavier · L'enfant suivi se choisit au clavier · Le suivi tient dans un écran de 360 px de large, leçons jouées et carte dépliées | 34.2, 34.8, 34.21, 34.24, 34.25, 34.26, 34.27 |
| 7 | Un parent ne voit le suivi que des profils enfants auxquels il est rattaché | Un parent qui n'est pas rattaché ne peut pas choisir Léa dans le suivi, seulement ses propres enfants (`@acces`) · Même avec l'identifiant du profil enfant, un parent qui n'est pas rattaché ne lit pas <données> de Léa (`@acces`, 3 cas : étoiles, séances terminées, résultat du test de départ) · Même avec l'identifiant du profil enfant, un parent qui n'est pas rattaché ne lit pas <données> de Léa (révisions) (`@acces @depend-de-28`, 2 cas : file de révision, séances de révision terminées) · Le suivi d'un enfant ne montre jamais les séances d'un autre enfant du même parent (`@acces`) | 34.8 |

Total : 7 règles, 44 scénarios (49 cas), dont 1 `@a-valider` (question 34.29), 4 `@acces` et 2 `@depend-de-28`. Avant les décisions du PO, il y avait 39 scénarios dont 32 `@a-valider`.

La story ne peut être mergée qu'après #28 (PR #85). L'adaptateur de lecture du suivi lit `files_de_revision` et `seances_de_revision_terminees`, même quand le profil n'a aucune révision. Le tag `@depend-de-28` ne marque que les scénarios qui préparent des révisions ; il tombera au merge de #28.

Droits d'accès (`@acces`) :
- Aucune donnée nouvelle, aucune policy nouvelle. Le suivi lit des tables qui ont déjà leur policy de lecture par rattachement : `profils_enfants` (#11), `resultats_des_lecons` et `seances_terminees` (#24), `resultats_des_tests_de_depart` (#27), `files_de_revision` et `seances_de_revision_terminees` (#28).
- Paul, rattaché, choisit parmi ses enfants. Le choix de Claire, non rattachée à Léa, ne propose que ses propres enfants.
- Avec l'identifiant du profil de Léa, Claire ne reçoit **aucune ligne** des tables lues par le suivi. Trois de ces lectures sont déjà vérifiées par d'autres stories : les étoiles par #24, le résultat du test de départ par #27, la file de révision par #28. Elles sont reprises ici pour que le suivi soit couvert en entier. Les lectures nouvelles sont les séances terminées et les séances de révision terminées.
- Avec la vue par enfant, le scénario Léa / Tom vérifie que le suivi de l'enfant ouvert (Léa) ne reprend rien de son frère.
- Un choix qui ne désigne pas un profil rattaché (profil supprimé, identifiant d'un autre parent) retombe sur le premier profil rattaché (I8). Le domaine l'applique (`enfantSuivi`), avec des tests unitaires ; il n'y a pas de scénario E2E, car l'interface ne propose que les profils rattachés.
- L'enfant n'a aucun droit propre : le suivi est dans l'espace parent, protégé par le contrôle parental (#10).

### Lecture des tableaux

| Dans les scénarios | À l'écran |
|---|---|
| « le suivi de Léa indique : » | les quatre chiffres du suivi de Léa (classe en cours) : « leçons réussies », « étoiles », « séances jouées », « erreurs corrigées pour de bon », chacun avec son nombre |
| colonne `étoiles` de « Léa a terminé ces séances : » | étoiles de cette séance terminée ; « – » : séance de fluence seule, sans étoile |
| colonne `étoiles` des leçons jouées | « ★ » répétées (meilleures étoiles), « réussie au test de départ » ou « – » (34.14, 34.24), lues « n étoiles sur 3 » |
| colonne `erreurs (dernière fois)` | erreurs de la dernière séance ; « – » pour une leçon seulement réussie au test de départ (34.7) |
| colonne `dernière séance` | date `jj/mm/aaaa` (34.24) |
| colonne `mention` de « les leçons jouées des autres classes de Léa montrent, à part et dans l'ordre : » | « classe précédente » (niveau inférieur, même deux classes avant, I5) ou « classe au-dessus » (I4). La matière de ces leçons est affichée aussi, mais ces scénarios ne la vérifient pas |
| état d'une ligne de la carte | « acquise », « en cours », « à faire », « pas encore de leçon », écrit en toutes lettres (34.2, 34.25) |

## Données de test

Les scénarios utilisent la **vraie bibliothèque** et le **vrai index des programmes**, contrairement à #25, #27 et #28 : la carte des compétences se construit sur les sections réelles du programme.

| Niveau, matière, domaine | Section | Leçons rattachées aujourd'hui | Sert à |
|---|---|---|---|
| CE1, français, Lecture | « Comprendre un texte » | « L'ordre alphabétique », « Lecture : La cabane dans l'arbre » | titres d'une ligne ; à faire |
| CE1, français, Écriture | « Apprendre à écrire en écriture cursive » | aucune | pas encore de leçon |
| CE1, français, Vocabulaire | « Établir des relations entre les mots » | « Les mots contraires » | en cours, acquise ; test de départ (à faire) |
| CE1, français, Grammaire et orthographe | « Découvrir, comprendre et mettre en œuvre l’orthographe grammaticale » | « Le pluriel des noms », « a ou à ? », « Le présent des verbes en -er » | une leçon acquise suffit (34.10) |
| CE1, maths, Nombres, calcul et résolution de problèmes | « Les nombres entiers » ; « Mémoriser des faits numériques » | « Les nombres jusqu'à 1000 » ; « Les tables de 2 et de 5 » (fluence « Calcul rapide : tables de 2 à 5 ») | matière Mathématiques ; fluence seule |
| CP, français | (« Identifier les mots de manière de plus en plus aisée », CP) | « Les sons ou, on, an » | classe précédente, même deux classes avant (34.11, I5) |
| CE2, français | — | « L'imparfait » | classe en cours d'un CE2 ; classe au-dessus après une descente (I4) |
| CM1 et CM2, français, Culture littéraire et artistique | « Imaginer et vivre d’autres vies » | « Vivre d'autres vies : Robinson Crusoé » (CM2) | section de deux niveaux (34.9) |

Attention aux apostrophes : les deux sections citées avec « ’ » (apostrophe typographique) l'écrivent ainsi dans `programmes-index.json`. Les titres de leçons ont une apostrophe droite.

Le CE1 compte aujourd'hui 60 sections (43 avec des leçons, 17 sans) et le CE2 en compte 64. Ces nombres changent avec le contenu, donc aucun scénario ne les écrit. La légende est vérifiée par ses nombres « acquise » et « en cours », et par leur somme, égale au nombre de lignes. Si une leçon est ajoutée à « Apprendre à écrire en écriture cursive », ou si une leçon citée change de section, l'`e2e-tester` le signale. Les scénarios changent alors d'exemple, pas de règle.

Données préparées avec la clé `service_role` réservée à la préparation, pour le profil réel de Léa (ou de Tom) :
- « Léa a terminé ces séances : » (tableau `leçon`, `le`, `erreurs`, `étoiles`) :
  - une ligne de `seances_terminees` par séance, à la date dite ;
  - le **résultat de la leçon** cohérent dans `resultats_des_lecons` : meilleures étoiles = la plus grande, nombre de séances ;
  - une séance « – » (fluence seule) n'a pas d'étoile et ne crée pas de résultat de la leçon ;
  - l'étape n'écrit rien que le serveur n'écrirait pas.
- « Léa a fait le test de départ le `<date>`, avec pour leçons réussies au test de départ : » : `resultats_des_tests_de_depart` avec `fait_le` à cette date. L'étape reprise « Léa a pour leçons réussies au test de départ : » (#27) garde la date du jour : les scénarios qui l'emploient ne lisent pas la date.
- « Léa a terminé, le `<date>`, une séance à 3 étoiles d'une leçon qui n'est plus dans la bibliothèque » : une séance et un résultat sur un identifiant absent de la bibliothèque (par exemple `e2e-34-lecon-retiree`).
- `@depend-de-28` :
  - « Léa a terminé `<n>` séances de révision » : lignes de `seances_de_revision_terminees` ;
  - « Léa a `<n>` erreurs corrigées pour de bon » : `files_de_revision.erreurs_corrigees_pour_de_bon`.
- Ordre de création : « Paul a créé (ensuite) le profil enfant … » (#11), ou l'ordre des étapes « … a un profil enfant préparé … » (Léa avant Tom dans le scénario `@acces` Léa / Tom).

Étapes d'action :
- « Paul consulte le suivi » : Paul entre dans l'espace parent (contrôle parental compris, comme « Paul est dans l'espace parent ») et lit la partie « Suivi ». L'enfant suivi est celui de l'ouverture : le premier profil dans l'ordre de création (I8). Dans tous les scénarios qui ne choisissent pas d'enfant, Léa est ce premier profil, ou le seul.
- La forme « Paul consulte le suivi, `<blocs>` dépliées » est gardée telle quelle ; #38 l'emploie (« … lectures et récitations enregistrées de Léa dépliées »).
- « Claire consulte le suivi » : la même action, sur le téléphone de Claire.
- « Paul choisit « `<prénom>` · `<niveau>` » dans le suivi(, au clavier seulement) » : choisit l'enfant suivi.
- « Paul déplie la carte des compétences de Léa(, au clavier seulement) » : déplie le bloc de la carte.
- Les étapes `Alors` sur les leçons jouées (« les leçons jouées de Léa montrent… », « les leçons jouées des autres classes de Léa montrent… ») déplient au besoin le bloc « Toutes les leçons jouées ». Celles sur la carte supposent que l'action l'a dépliée.

Parents, enfants et appareils : Paul (tablette), rattaché à Léa et à Tom ; Claire (téléphone), rattachée à son propre Tom (CM2), jamais à Léa.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille :
  - « Paul est connecté sur la tablette » ;
  - « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … » ;
  - « Paul a créé (ensuite) le profil enfant "…" de niveau … dans l'univers « … » » (#11) ;
  - « Paul n'a aucun profil enfant » (#72) ;
  - « Paul a changé sur la tablette le niveau du profil enfant de Léa en … » ;
  - « Claire est rattachée au profil enfant "Tom" de niveau CM2 » (#11), « Claire est connectée sur le téléphone ».
- Apprentissage : « Léa a pour leçons réussies au test de départ : » (#27).
- Droits :
  - « Claire demande les étoiles du profil enfant de Léa » (#24) ;
  - « Claire demande le résultat du test de départ du profil enfant de Léa » (#27) ;
  - « Claire demande la file de révision du profil enfant de Léa » (#28) ;
  - « Claire ne reçoit aucune donnée de Léa ».
- Interface :
  - « Paul voit le message « … » », « le réseau est coupé » ;
  - « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » ;
  - « le bloc « … » est replié et s'intitule « … » » (#26) ;
  - « les lecteurs d'écran annoncent « … » », « les lecteurs d'écran annoncent le bouton « … », déplié » (#26).

Extensions sans changement de sens : « le bloc « … » est replié et s'intitule « … » » et « les lecteurs d'écran annoncent le bouton … » doivent trouver les blocs du suivi de l'espace parent.

Aucune étape existante n'est modifiée.

### Étapes nouvelles

- Données :
  - « Léa a terminé ces séances : », « Tom a terminé ces séances : » ;
  - « Léa a fait le test de départ le `<date>`, avec pour leçons réussies au test de départ : » ;
  - « Léa a terminé, le `<date>`, une séance à 3 étoiles d'une leçon qui n'est plus dans la bibliothèque » ;
  - « Léa a terminé `<n>` séances de révision », « Léa a `<n>` erreurs corrigées pour de bon ».
- Actions :
  - « Paul entre dans l'espace parent » ;
  - « Paul consulte le suivi(, carte des compétences et leçons jouées dépliées) », « Claire consulte le suivi » ;
  - « Paul choisit « … » dans le suivi(, au clavier seulement) » ;
  - « Paul déplie la carte des compétences de Léa(, au clavier seulement) » ;
  - « Claire demande les séances terminées du profil enfant de Léa », « Claire demande les séances de révision terminées du profil enfant de Léa ».
- Suivi et enfant suivi :
  - « la première partie de l'espace parent est « … », avant « … » » ;
  - « l'enfant suivi est « … » » ;
  - « le suivi propose de choisir, dans l'ordre, « … »( et « … ») », « le suivi de Claire propose seulement « … » », « aucun suivi de Léa n'apparaît » ;
  - « les parties du suivi de Léa se suivent ainsi : … », « aucun bilan des 7 derniers jours n'est montré » ;
  - « le suivi de (Léa|Tom) indique : ».
- Carte :
  - « les matières de la carte se suivent ainsi : … », « les domaines du français se suivent ainsi : … », « aucune matière « … » n'apparaît dans la carte » ;
  - « la ligne « … » de la carte montre les leçons « … » et « … » », « la ligne « … » de la carte montre la leçon « … » », « la ligne « … » de la carte ne montre aucune leçon », « la ligne « … » de la carte est « … » » ;
  - « la carte des compétences de Léa montre, entre autres : » ;
  - « la légende de la carte indique « … » et « … » », « les nombres de la légende font ensemble le nombre de lignes de la carte » ;
  - « l'état de chaque ligne de la carte est écrit en toutes lettres, pas seulement par une couleur ».
- Leçons jouées :
  - « les leçons jouées de Léa indiquent « … » », « les leçons jouées de Léa montrent, dans l'ordre : » ;
  - « les leçons jouées des autres classes de Léa montrent, à part et dans l'ordre : », « aucune leçon jouée d'une autre classe n'est montrée » ;
  - « la leçon qui n'est plus dans la bibliothèque n'apparaît pas dans les leçons jouées de Léa » ;
  - « les lecteurs d'écran lisent « … » pour les étoiles de « … » ».
- Petit écran : « le choix de l'enfant et le bouton de chaque bloc du suivi mesurent au moins 44 px de haut ».

Par rapport à la première version, deux étapes ont disparu : « les suivis se suivent ainsi : … » et « Claire voit seulement le suivi « … » ». Elles sont remplacées par les étapes de l'enfant suivi. « le suivi de Léa s'intitule « … » » est remplacée par « l'enfant suivi est « … » ». Aucune de ces étapes n'est employée par #38.

## Couvert par les tests unitaires (pas de scénario E2E)

- Le suivi ne modifie rien : deux calculs sur les mêmes entrées donnent le même suivi (invariant 1).
- `enfantSuivi` : premier profil dans l'ordre de création, choix inconnu ou non rattaché ramené au premier profil (I8).
- I10 : choisir un enfant dans le suivi ne change pas le profil en cours. Ce n'est pas observable en E2E, car sortir de l'espace parent ramène de toute façon à « Qui joue ? ».
- Ordre des matières (`toutesLesMatieres`) et des domaines (ordre d'apparition dans l'index), section rattachée à aucune leçon connue, leçon rattachée à une section absente de l'index.
- Égalités de date dans les leçons jouées : départage par titre, dans chaque zone. Un seul cas est couvert en E2E.
- Seuils réussie et acquise lus dans `@domain/apprentissage`, jamais recopiés (34.19).

## Hors périmètre

- **Second parent** (« le second parent rattaché voit le même suivi que le premier ») : reporté dans **#13**, sortie de la beta. Rien à coder ici : la lecture sous RLS repose sur le rattachement.
- **Export et suppression** (#14, sortie de la beta) : le suivi ne garde aucune donnée, il n'y a rien de plus à exporter ni à supprimer. Aucun scénario.
- **Rapport de la semaine** (bilan des 7 derniers jours, conseils, nombre de fois ratée) : #35, après la beta (34.15, 34.16).
- **Enregistrements de lecture** : #38 ajoute son bloc entre la carte et les leçons jouées (34.17).
- **Leçons personnelles** : #39 les ajoute aux chiffres, à la carte et aux leçons jouées (34.6). Aucun scénario ici.
- **Mots de la semaine** (#37) : leurs séances s'ajouteront aux séances jouées (34.5).
- **Suivi sans réseau** et copie locale des données : #44 (34.21, 34.28). Ici, seulement le message.

## Décisions du PO (25/10)

Source : commentaire [Responsable] « VALIDÉ avec 3 changements » de l'issue #34, le 2026-10-25 à 17:30 UTC (https://github.com/SBA-dev/github-move/issues/34#issuecomment-6400845658).

Réponses du PO, mot pour mot (25/10, 17:28 et 17:30 UTC) :

> « 34.4 ca donne le niveau de l'enfant mais le test de niveau ne regroupe pas l'ensemble des exercices de la lecon.
> 34.8 : une vue par enfant le parent selectionne l'enfant
> 34.11 : on analyse le niveau de l'enfant de son année en cours. ce qui a reussi dans les classes passées est juste à titre indicatif. »

Puis, aux questions de précision : « 1 oui, 2b, 3 oui + a ». Le détail :
1. Les autres questions gardent la reco : « oui ».
2. Pour 34.4, une section dont la seule leçon jouée est réussie au test de départ est **b) « à faire »**.
3. Pour 34.11, les chiffres ne comptent que la classe en cours (« oui »). Les leçons des classes passées sont **a) affichées à part, avec la mention « classe précédente »**.

| n° | Sujet | Décision | Effet sur les scénarios |
|---|---|---|---|
| 34.1 | Carte par section ou par compétence | reco retenue : par section du programme, 4 états | `@a-valider` retiré (règles 3 et 4) |
| 34.2 | « acquis » ou « acquise » | reco retenue : « acquise » | `@a-valider` retiré |
| 34.3 | Leçons réussies au test de départ dans « leçons réussies » | reco retenue : oui, sans étoile, pour la classe en cours (34.11) | scénario renommé, chiffres refaits : 4 leçons au lieu de 5 (celle du CP sort) |
| 34.4 | Section dont la seule leçon est réussie au test de départ | **tranchée autrement : « à faire »** (réponse b) | scénario « … reste à faire », état « à faire » au lieu de « en cours » |
| 34.5 | Que compte « séances jouées » | reco retenue : séances terminées, fluence seule comprise, et séances de révision. Avec 34.11, seules les séances terminées de la classe en cours comptent ; toutes les séances de révision comptent (I2) | scénario des révisions refait avec une séance du CP non comptée |
| 34.6 | Leçons personnelles | reco retenue : #39 | aucun |
| 34.7 | « Erreurs (dernière fois) » | reco retenue | `@a-valider` retiré |
| 34.8 | Vue par enfant ou tous l'un sous l'autre | **tranchée autrement : une vue par enfant, choisi par le parent** ; à l'ouverture, le premier profil dans l'ordre de création (I8) ; le choix est toujours affiché (I9) | « l'un sous l'autre » remplacé par 3 scénarios (ouverture, choix, un seul profil) ; choix au clavier ; scénarios `@acces` revus |
| 34.9 | Section de deux niveaux | reco retenue (I11) | `@a-valider` retiré |
| 34.10 | Une leçon acquise suffit | reco retenue | `@a-valider` retiré |
| 34.11 | Leçons des autres classes dans les chiffres et le tableau | **tranchée autrement : chiffres de la classe en cours seulement ; leçons des autres classes à part, mention « classe précédente »** (« classe au-dessus » après une descente, I4) | chiffres refaits ; 3 scénarios de la zone à part, dont un remplace « Une leçon d'une classe d'avant est listée parmi les leçons jouées » ; changement de classe → chiffres à 0 |
| 34.12 | Fluence seule | reco retenue | `@a-valider` retiré |
| 34.13 | Leçon retirée de la bibliothèque | reco retenue (ignorée partout) ; sa séance ne compte plus dans « séances jouées » si l'on suit 34.11 : voir 34.29 | scénario gardé `@a-valider` (34.29) |
| 34.14 | Leçon réussie au test de départ dans le tableau | reco retenue | `@a-valider` retiré |
| 34.15 | Bilan des 7 jours | reco retenue : #35 | `@a-valider` retiré |
| 34.16 | Nombre de fois ratée | reco retenue : #35 | aucun |
| 34.17 | Place des enregistrements | reco retenue : entre la carte et les leçons jouées | `@a-valider` retiré |
| 34.18 | Place du suivi, texte sans profil | reco retenue | `@a-valider` retiré |
| 34.19 | Lecture sous RLS | reco retenue | aucun |
| 34.20 | `matiere` dans `SectionDuProgramme` | reco retenue | aucun |
| 34.21 | Sans réseau | reco retenue : « Le suivi a besoin d'Internet. Réessaie dans un instant. » | `@a-valider` retiré |
| 34.22 | Termes | reco retenue ; « Enfant suivi » ajouté (34.8) | aucun |
| 34.23 | Libellés des matières | reco retenue : libellés du Catalogue | `@a-valider` retiré |
| 34.24 | Étoiles et dates | reco retenue | `@a-valider` retiré |
| 34.25 | État écrit en toutes lettres | reco retenue | `@a-valider` retiré |
| 34.26 | Blocs repliés | reco retenue | `@a-valider` retiré |
| 34.27 | 360 px sans défilement horizontal | reco retenue ; le choix de l'enfant mesure aussi au moins 44 px | `@a-valider` retiré |
| 34.28 | Séance pas encore envoyée | reco retenue : absente du suivi avant l'envoi | aucun |

### Interprétations reprises du modèle du domaine

Le modeleur les a tranchées au plus simple, dans l'esprit des réponses (`docs/stories/34/domain-model.md`, « Décisions du PO (25/10) »). Le PO les relira à la démonstration, sans que cela bloque la story.

- **I1. Classe en cours** = le niveau actuel du profil enfant. Après un changement de niveau, les chiffres suivent aussitôt le nouveau niveau. Scénario : « Après un changement de classe, le suivi, ses chiffres et la carte suivent le nouveau niveau ».
- **I2.** « Séances jouées » compte **toutes** les séances de révision, sans filtre de classe. Les séances terminées ne comptent que si leur leçon est de la classe en cours. Scénario : « Toutes les séances de révision et toutes les erreurs corrigées pour de bon comptent… ».
- **I3.** « Erreurs corrigées pour de bon » n'est **pas filtré** par classe : c'est le total du profil (28.20). Même scénario.
- **I4.** Une leçon d'une **classe au-dessus** (enfant redescendu) va dans la même zone à part, avec la mention **« classe au-dessus »**, et ne compte pas dans les chiffres. Scénario : « Redescendue de classe… ».
- **I5.** La mention « classe précédente » vaut pour **toute** leçon d'un niveau inférieur, même deux classes avant. Scénario : « Les leçons jouées des classes précédentes sont listées à part… » (CP et CE1 pour un CE2).
- **I6.** La classe en cours vient d'abord, puis la zone à part. Dans chaque zone, la dernière séance la plus récente vient d'abord, puis le titre. Même scénario.
- **I7.** « Pas encore de leçon jouée. » s'affiche quand la **classe en cours** n'a aucune leçon jouée. La zone à part s'affiche en dessous si elle n'est pas vide. Scénarios : « Sans leçon jouée de la classe en cours… », « Sans leçon jouée, le suivi le dit… » (aucune leçon jouée d'une autre classe).
- **I8.** À l'ouverture, l'enfant suivi est le premier profil rattaché dans l'ordre de création. Le choix n'est pas mémorisé. Un choix qui ne désigne pas un profil rattaché retombe sur le premier. Scénario : « À l'ouverture, le suivi montre le premier enfant… » (le repli est couvert par les tests unitaires).
- **I9.** Le choix de l'enfant est toujours affiché, même avec un seul profil. Chaque choix porte « `<prénom>` · `<niveau>` ». Scénario : « Avec un seul profil enfant, le choix de l'enfant est affiché et déjà fait ».
- **I10.** L'enfant suivi et le profil en cours sont distincts. Ce point est couvert par les tests unitaires.
- **I11.** La carte ne change pas avec 34.11. Une section garde toutes ses leçons rattachées, quel que soit leur niveau.

## Questions ouvertes

**34.29. Une séance terminée d'une leçon qui n'est plus dans la bibliothèque compte-t-elle encore dans « séances jouées » ?** La recommandation 34.13, retenue, disait : « ses séances comptent quand même dans « séances jouées » ». Mais avec 34.11 et I2, une séance terminée ne compte que si sa leçon est de la classe en cours. Or une leçon inconnue du Catalogue n'a plus de niveau.
- **Recommandation** : **ne plus la compter**. La leçon est ignorée partout dans le suivi : chiffres, carte, tableau. Les chiffres restent ainsi cohérents avec le tableau de la classe en cours, et la règle « classe en cours » n'a pas d'exception. Le cas est rare : une leçon n'est retirée de la bibliothèque que par une correction de contenu.
- Scénario concerné (seul `@a-valider`) : « Une leçon qui n'est plus dans la bibliothèque n'est comptée nulle part dans les chiffres ». Il attend 1 séance jouée au lieu de 2.
- Si le PO garde la lecture d'origine de 34.13, il suffit de changer « séances jouées » en 2 dans ce scénario.
