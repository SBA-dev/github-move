# Critères d'acceptance : issue #34, Suivi et carte des compétences

Scénarios : `features/34-suivi-et-carte-des-competences.feature` (tags `@issue-34 @wip`).
Modèle du domaine : `docs/stories/34/domain-model.md` (contexte **Accompagnement**, qui lit **Apprentissage**, le **Catalogue pédagogique** et **Famille**). Les questions 34.1 à 34.22 viennent du modèle ; 34.23 à 34.28 sont ajoutées ici.

Les scénarios suivent **les recommandations** du modèle et de ce fichier. Chaque scénario qui dépend d'une question encore ouverte porte `@a-valider` et un commentaire `# Question 34.n`. Ceux qui lisent les révisions des erreurs de #28 (pas encore mergée, PR #85) portent `@depend-de-28`.

Décisions déjà prises (commentaire [Responsable] du 2026-10-25 sur l'issue) : #13 (second parent) et #14 (export et suppression) sont **sorties de la beta**. Aucun scénario ici sur le second parent ni sur l'export.

## Objectif

En tant que **parent**, je veux voir la progression de chacun de mes enfants (leçons réussies, étoiles, séances jouées, erreurs corrigées pour de bon, carte des compétences, leçons jouées), afin de savoir où il en est et de l'aider.

Le **suivi** est une vue calculée à l'affichage, dans le navigateur, sans aucune donnée propre :
- il lit, sous RLS, les faits d'Apprentissage : meilleures étoiles, séances terminées, résultat du test de départ, séances de révision terminées, erreurs corrigées pour de bon ;
- il les met en regard des leçons de la bibliothèque et des sections du programme (Catalogue) ;
- il ne modifie rien et ne recalcule aucune étoile.

Le comportement actuel (`app/`, `adultSuivi`, `skillMap`) donne les premiers exemples. Écarts voulus, déjà tranchés ailleurs ou proposés ici :
- une leçon réussie au test de départ est **réussie**, jamais **acquise** (27.1) : elle compte dans « leçons réussies » (34.3), met sa section « en cours » (34.4) et se lit « réussie au test de départ » (34.14) ;
- l'état de la section se dit « acquise » (34.2) ;
- la séance de révision et la séance de fluence seule ne donnent pas d'étoile (28.2, #20) ;
- pas de bilan des 7 derniers jours (#35, 34.15).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Le suivi est en tête de l'espace parent, avec un suivi par profil enfant rattaché, dans l'ordre de création | « Suivi » avant « Profils » · Tom (CM1) créé avant Léa (CE1) → « Tom · CM1 », puis « Léa · CE1 » · ordre : titre, chiffres, carte, leçons jouées, pas de bilan de la semaine · sans profil → « Aucun profil pour l'instant. Crée-en un dans la partie Profils. » |
| 2. Les chiffres du suivi | rien joué → 0, 0, 0, 0 · « Les sons ou, on, an » (CP) 3, « Les mots contraires » 1, « Le pluriel des noms » 2 → 3 leçons réussies, 6 étoiles, 3 séances · « Le pluriel des noms » joué 3 fois (1, 3, 2) → 1 leçon, 3 étoiles, 3 séances · 3 leçons réussies au test de départ + 1 et 2 étoiles → 5 leçons, 3 étoiles, 2 séances · fluence seule → 0 leçon, 1 séance · 2 séances + 3 séances de révision, 4 erreurs corrigées → 5 séances, 4 · leçon retirée de la bibliothèque → ni leçon ni étoile, mais sa séance compte |
| 3. La carte montre les sections du niveau, par matière puis par domaine, avec les titres des leçons | bloc replié « Carte des compétences du programme (CE1) » · Français, Mathématiques, Sciences, Histoire et géographie, Anglais ; Lecture, Écriture, Oral, Vocabulaire, Grammaire et orthographe ; pas de « Vivre ensemble (EMC) » au CE1 · « Comprendre un texte » → « L'ordre alphabétique », « Lecture : La cabane dans l'arbre » · passée en CE2 → « Léa · CE2 », carte (CE2), étoiles du CE1 toujours comptées |
| 4. État de la section | rien joué → « Comprendre un texte » à faire, « Apprendre à écrire en écriture cursive » pas encore de leçon · « Les mots contraires » 1 → en cours, 2 ou 3 → acquise · « a ou à ? » 1 et « Le pluriel des noms » 2 → acquise · réussie au test de départ seulement → en cours · fluence seule → en cours · CM1 avec « Robinson Crusoé » (CM2) à 3 → « Imaginer et vivre d’autres vies » acquise · légende « acquise (1) », « en cours (1) », somme = nombre de lignes |
| 5. Toutes les leçons jouées | rien joué → « Pas encore de leçon jouée. », carte toujours là · bloc replié · 3 leçons, tri par date puis titre · rejouée 3 puis 1 → « ★★★ », 5 erreurs, date de la dernière · réussie au test de départ → « réussie au test de départ », « – », 05/10/2026 · puis séance à 1 → « ★ », date de la séance · fluence seule → « – », 2 erreurs · « Les sons ou, on, an » (CP) listée |
| 6. Réseau, lecteur d'écran, clavier, petit écran | sans réseau → « Le suivi a besoin d'Internet. Réessaie dans un instant. » · « … : acquise », « … : pas encore de leçon » · « 2 étoiles sur 3 » · carte dépliée au clavier · 360 px, boutons des blocs de 44 px |
| 7. Droits | Claire, rattachée à Tom, ne voit que « Tom · CM2 » · Claire, avec l'identifiant de Léa, ne reçoit ni étoiles, ni séances terminées, ni résultat du test de départ, ni file de révision, ni séances de révision terminées · les séances de Tom n'apparaissent pas dans le suivi de Léa |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | Le suivi est en tête de l'espace parent, avec un suivi par profil enfant rattaché, dans l'ordre de création | Le suivi est la première partie de l'espace parent · Chaque enfant a son suivi, l'un sous l'autre, dans l'ordre de création des profils · Le suivi d'un enfant montre ses chiffres, puis la carte des compétences, puis les leçons jouées · Sans profil enfant, le suivi invite à en créer un | 34.8, 34.15, 34.17, 34.18 |
| 2 | Les chiffres du suivi comptent les leçons réussies, le total des étoiles, les séances jouées et les erreurs corrigées pour de bon | Un enfant qui n'a rien joué a ses quatre chiffres à 0 · Les leçons réussies et les étoiles comptent les meilleures étoiles de chaque leçon, toutes classes confondues · Une leçon rejouée compte une fois, avec ses meilleures étoiles, et chacune de ses séances est jouée · Les leçons réussies au test de départ comptent parmi les leçons réussies, sans étoile ni séance jouée · Une séance de fluence seule compte parmi les séances jouées, sans rendre sa leçon réussie · Les séances de révision comptent parmi les séances jouées, et les erreurs corrigées pour de bon sont comptées (`@depend-de-28`) · Une leçon qui n'est plus dans la bibliothèque n'est comptée ni dans les leçons réussies ni dans les étoiles | 34.3, 34.5, 34.11, 34.12, 34.13 |
| 3 | La carte des compétences montre chaque section du programme du niveau de l'enfant, regroupée par matière puis par domaine, avec les titres de ses leçons | La carte des compétences est repliée et porte le niveau de l'enfant · La carte des compétences d'un enfant de CE1 regroupe les sections du CE1 par matière, puis par domaine, dans l'ordre du programme · Une ligne de la carte montre la section et les titres de ses leçons · Après un changement de classe, le suivi et la carte suivent le nouveau niveau, et les étoiles d'avant restent comptées | 34.1, 34.11, 34.23 |
| 4 | Une section est acquise dès qu'une de ses leçons est acquise, en cours dès qu'une de ses leçons est jouée, à faire sinon, et « pas encore de leçon » sans leçon | Sans aucune leçon jouée, une section qui a des leçons est à faire, une section sans leçon n'en a pas encore · Une leçon à <étoiles> étoile(s) rend sa section « <état> » (3 cas : 1, 2, 3) · Une seule leçon acquise suffit pour que sa section soit acquise · Une section dont la seule leçon jouée est réussie au test de départ est en cours, jamais acquise · Une leçon jouée seulement en fluence seule met sa section en cours · Une section du CM1 et du CM2 compte les leçons de ses deux niveaux · La légende de la carte compte les sections de chaque état | 34.1, 34.2, 34.4, 34.9, 34.10, 34.12 |
| 5 | Toutes les leçons jouées sont listées, la plus récente d'abord, avec leurs meilleures étoiles et leur dernière séance | Sans leçon jouée, le suivi le dit, et la carte des compétences reste proposée · Les leçons jouées sont dans un bloc replié · Chaque leçon jouée montre sa matière, ses étoiles, ses erreurs de la dernière séance et sa date, la plus récente d'abord · Une leçon rejouée montre ses meilleures étoiles, mais les erreurs et la date de sa dernière séance · Une leçon réussie au test de départ est listée comme telle, sans erreurs, à la date du test de départ · Après une séance, une leçon réussie au test de départ montre ses étoiles et la date de cette séance · Une leçon jouée seulement en fluence seule est listée sans étoile, avec ses erreurs · Une leçon d'une classe d'avant est listée parmi les leçons jouées | 34.7, 34.11, 34.12, 34.14, 34.23, 34.24, 34.26 |
| 6 | Le suivi demande le réseau, et se lit au lecteur d'écran, au clavier et sur un petit écran | Sans réseau, le suivi dit qu'il a besoin d'Internet · L'état de chaque ligne de la carte est écrit en toutes lettres et lu par un lecteur d'écran · Un lecteur d'écran lit en toutes lettres les étoiles d'une leçon jouée · La carte des compétences se déplie au clavier · Le suivi tient dans un écran de 360 px de large, leçons jouées et carte dépliées | 34.2, 34.21, 34.24, 34.25, 34.26, 34.27 |
| 7 | Un parent ne voit le suivi que des profils enfants auxquels il est rattaché | Un parent qui n'est pas rattaché ne voit pas le suivi de Léa, seulement celui de ses propres enfants (`@acces`) · Même avec l'identifiant du profil enfant, un parent qui n'est pas rattaché ne lit pas <données> de Léa (`@acces`, 3 cas : étoiles, séances terminées, résultat du test de départ) · Même avec l'identifiant du profil enfant, un parent qui n'est pas rattaché ne lit pas <données> de Léa (révisions) (`@acces @depend-de-28`, 2 cas : file de révision, séances de révision terminées) · Le suivi d'un enfant ne montre jamais les séances d'un autre enfant du même parent (`@acces`) | — |

Total : 7 règles, 39 scénarios (44 cas), dont 32 `@a-valider`, 4 `@acces` et 2 `@depend-de-28`.

Les 7 scénarios sans `@a-valider` ne dépendent d'aucune question ouverte : les deux cas vides (« Un enfant qui n'a rien joué a ses quatre chiffres à 0 », « Sans leçon jouée, le suivi le dit… »), la leçon rejouée dans les chiffres et les 4 scénarios de droits.

La story ne peut être mergée qu'après #28 (PR #85) : l'adaptateur de lecture du suivi lit `files_de_revision` et `seances_de_revision_terminees`, même quand le profil n'a aucune révision (0 erreur corrigée pour de bon). Le tag `@depend-de-28` ne marque que les scénarios qui préparent des révisions ; il tombera au merge de #28.

Droits d'accès (`@acces`) :
- Aucune donnée nouvelle, aucune policy nouvelle. Le suivi lit des tables qui ont déjà leur policy de lecture par rattachement : `profils_enfants` (#11), `resultats_des_lecons` et `seances_terminees` (#24), `resultats_des_tests_de_depart` (#27), `files_de_revision` et `seances_de_revision_terminees` (#28).
- Paul, rattaché, voit le suivi de ses enfants. Claire, non rattachée, ne voit que celui de ses propres enfants dans l'espace parent.
- Avec l'identifiant du profil de Léa, Claire ne reçoit **aucune ligne** de chaque table lue par le suivi. Deux de ces lectures sont déjà vérifiées par #24 et #27 (« Claire demande les étoiles… », « Claire demande le résultat du test de départ… ») et une par #28 (« Claire demande la file de révision… ») : elles sont reprises ici pour que le suivi soit couvert en entier ; les lectures nouvelles sont les séances terminées et les séances de révision terminées.
- Le scénario Léa / Tom vérifie que le suivi est calculé par profil enfant, même entre deux enfants du même parent.
- Le domaine ignore aussi toute donnée d'un profil absent de la liste des profils rattachés (`suivisDesEnfants`) : vérifié par les tests unitaires, pas en E2E.
- L'enfant n'a aucun droit propre : le suivi est dans l'espace parent, protégé par le contrôle parental (#10).

### Lecture des tableaux

| Dans les scénarios | À l'écran (recommandation) |
|---|---|
| « le suivi de Léa indique : » | les quatre chiffres du suivi de Léa : « leçons réussies », « étoiles », « séances jouées », « erreurs corrigées pour de bon », chacun avec son nombre |
| colonne `étoiles` de « Léa a terminé ces séances : » | étoiles de cette séance terminée ; « – » : séance de fluence seule, sans étoile |
| colonne `étoiles` des leçons jouées | « ★ » répétées (meilleures étoiles), « réussie au test de départ », ou « – » (34.14, 34.24) ; lu « n étoiles sur 3 » |
| colonne `erreurs (dernière fois)` | erreurs de la dernière séance ; « – » pour une leçon seulement réussie au test de départ (34.7) |
| colonne `dernière séance` | date `jj/mm/aaaa` (34.24) |
| état d'une ligne de la carte | « acquise », « en cours », « à faire », « pas encore de leçon », écrit en toutes lettres (34.2, 34.25) |

## Données de test

Les scénarios utilisent la **vraie bibliothèque** et le **vrai index des programmes**, contrairement à #25, #27 et #28 : la carte des compétences se construit sur les sections réelles du programme.

| Niveau, matière, domaine | Section | Leçons rattachées aujourd'hui | Sert à |
|---|---|---|---|
| CE1, français, Lecture | « Comprendre un texte » | « L'ordre alphabétique », « Lecture : La cabane dans l'arbre » | titres d'une ligne ; à faire |
| CE1, français, Écriture | « Apprendre à écrire en écriture cursive » | aucune | pas encore de leçon |
| CE1, français, Vocabulaire | « Établir des relations entre les mots » | « Les mots contraires » | en cours, acquise ; test de départ |
| CE1, français, Grammaire et orthographe | « Découvrir, comprendre et mettre en œuvre l’orthographe grammaticale » | « Le pluriel des noms », « a ou à ? », « Le présent des verbes en -er » | une leçon acquise suffit (34.10) |
| CE1, maths, Nombres, calcul et résolution de problèmes | « Les nombres entiers » ; « Mémoriser des faits numériques » | « Les nombres jusqu'à 1000 » ; « Les tables de 2 et de 5 » (fluence « Calcul rapide : tables de 2 à 5 ») | matière Mathématiques ; fluence seule |
| CP, français | (« Identifier les mots de manière de plus en plus aisée », CP) | « Les sons ou, on, an » | leçon d'une classe d'avant (34.11) |
| CM1 et CM2, français, Culture littéraire et artistique | « Imaginer et vivre d’autres vies » | « Vivre d'autres vies : Robinson Crusoé » (CM2) | section de deux niveaux (34.9) |

Attention aux apostrophes : les deux sections citées avec « ’ » (typographique) l'écrivent ainsi dans `programmes-index.json` ; les titres de leçons ont une apostrophe droite.

Le CE1 compte aujourd'hui 60 sections (43 avec des leçons, 17 sans), le CE2 64. Ces nombres changent avec le contenu : aucun scénario ne les écrit. La légende est vérifiée par ses nombres « acquise » et « en cours », et par leur somme égale au nombre de lignes. Si une leçon est ajoutée à « Apprendre à écrire en écriture cursive », ou si une leçon citée change de section, l'`e2e-tester` le signale et les scénarios changent d'exemple, pas de règle.

Données préparées avec la clé `service_role` réservée à la préparation, pour le profil réel de Léa (ou de Tom) :
- « Léa a terminé ces séances : » (tableau `leçon`, `le`, `erreurs`, `étoiles`) : une ligne de `seances_terminees` par séance, à la date dite, et le **résultat de la leçon** cohérent (`resultats_des_lecons` : meilleures étoiles = la plus grande, nombre de séances). Une séance « – » (fluence seule) n'a pas d'étoile et ne crée pas de résultat de la leçon. Le suivi doit lire les mêmes faits que ceux d'une séance jouée : l'étape n'écrit rien que le serveur n'écrirait pas.
- « Léa a fait le test de départ le `<date>`, avec pour leçons réussies au test de départ : » : `resultats_des_tests_de_depart` avec `fait_le` à cette date. L'étape reprise « Léa a pour leçons réussies au test de départ : » (#27) garde sa date (celle du jour) : les scénarios qui l'emploient ne lisent pas la date.
- « Léa a terminé, le `<date>`, une séance à 3 étoiles d'une leçon qui n'est plus dans la bibliothèque » : séance et résultat sur un identifiant absent de la bibliothèque (par exemple `e2e-34-lecon-retiree`).
- `@depend-de-28` : « Léa a terminé `<n>` séances de révision » (lignes de `seances_de_revision_terminees`), « Léa a `<n>` erreurs corrigées pour de bon » (`files_de_revision.erreurs_corrigees_pour_de_bon`).

Étapes d'action :
- « Paul consulte le suivi » : Paul entre dans l'espace parent (contrôle parental compris, comme « Paul est dans l'espace parent ») et lit la partie « Suivi ». « Claire consulte le suivi » : de même, sur le téléphone de Claire.
- « Paul déplie la carte des compétences de Léa(, au clavier seulement) » : déplie le bloc de la carte du suivi de Léa.
- Les étapes `Alors` sur les leçons jouées (« les leçons jouées de Léa montrent… ») déplient au besoin le bloc « Toutes les leçons jouées » ; celles sur la carte supposent la carte dépliée par l'action.

Parents, enfants et appareils : Paul (tablette), rattaché à Léa et à Tom ; Claire (téléphone), rattachée à son propre Tom (CM2), jamais à Léa.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … », « Paul a créé (ensuite) le profil enfant "…" de niveau … dans l'univers « … » » (#11), « Paul n'a aucun profil enfant » (#72), « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « Claire est rattachée au profil enfant "Tom" de niveau CM2 » (#11), « Claire est connectée sur le téléphone ».
- Apprentissage : « Léa a pour leçons réussies au test de départ : » (#27).
- Droits : « Claire demande les étoiles du profil enfant de Léa » (#24), « Claire demande le résultat du test de départ du profil enfant de Léa » (#27), « Claire demande la file de révision du profil enfant de Léa » (#28), « Claire ne reçoit aucune donnée de Léa ».
- Interface : « Paul voit le message « … » », « le réseau est coupé », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « le bloc « … » est replié et s'intitule « … » » (#26), « les lecteurs d'écran annoncent « … » », « les lecteurs d'écran annoncent le bouton « … », déplié » (#26).

Extensions sans changement de sens : « le bloc « … » est replié et s'intitule « … » » et « les lecteurs d'écran annoncent le bouton … » doivent trouver les blocs du suivi de l'espace parent.

Aucune étape existante n'est modifiée.

### Étapes nouvelles

- Données : « Léa a terminé ces séances : », « Tom a terminé ces séances : », « Léa a fait le test de départ le `<date>`, avec pour leçons réussies au test de départ : », « Léa a terminé, le `<date>`, une séance à 3 étoiles d'une leçon qui n'est plus dans la bibliothèque », « Léa a terminé `<n>` séances de révision », « Léa a `<n>` erreurs corrigées pour de bon ».
- Actions : « Paul entre dans l'espace parent », « Paul consulte le suivi(, carte des compétences et leçons jouées dépliées) », « Claire consulte le suivi », « Paul déplie la carte des compétences de Léa(, au clavier seulement) », « Claire demande les séances terminées du profil enfant de Léa », « Claire demande les séances de révision terminées du profil enfant de Léa ».
- Suivi : « la première partie de l'espace parent est « … », avant « … » », « les suivis se suivent ainsi : « … », puis « … » », « les parties du suivi de Léa se suivent ainsi : … », « aucun bilan des 7 derniers jours n'est montré », « le suivi de (Léa|Tom) indique : », « le suivi de Léa s'intitule « … » », « Claire voit seulement le suivi « … » », « aucun suivi de Léa n'apparaît ».
- Carte : « les matières de la carte se suivent ainsi : … », « les domaines du français se suivent ainsi : … », « aucune matière « … » n'apparaît dans la carte », « la ligne « … » de la carte montre les leçons « … » et « … » », « la ligne « … » de la carte montre la leçon « … » », « la ligne « … » de la carte ne montre aucune leçon », « la ligne « … » de la carte est « … » », « la carte des compétences de Léa montre, entre autres : », « la légende de la carte indique « … » et « … » », « les nombres de la légende font ensemble le nombre de lignes de la carte », « l'état de chaque ligne de la carte est écrit en toutes lettres, pas seulement par une couleur ».
- Leçons jouées : « les leçons jouées de (Léa) indiquent « … » », « les leçons jouées de Léa montrent, dans l'ordre : », « la leçon qui n'est plus dans la bibliothèque n'apparaît pas dans les leçons jouées de Léa », « les lecteurs d'écran lisent « … » pour les étoiles de « … » ».
- Petit écran : « le bouton de chaque bloc du suivi mesure au moins 44 px de haut ».

## Couvert par les tests unitaires (pas de scénario E2E)

- Le suivi ne modifie rien : deux calculs sur les mêmes entrées donnent le même suivi (invariant 1).
- Ordre des matières (`toutesLesMatieres`) et des domaines (ordre d'apparition dans l'index), section rattachée à aucune leçon connue, leçon rattachée à une section absente de l'index.
- Égalités de date dans les leçons jouées : départage par titre (un seul cas en E2E).
- Donnée d'un profil absent des profils rattachés : ignorée par `suivisDesEnfants`.
- Seuils réussie et acquise lus dans `@domain/apprentissage`, jamais recopiés (34.19).

## Hors périmètre

- **Second parent** (« le second parent rattaché voit le même suivi que le premier ») : reporté dans **#13**, sortie de la beta. Rien à coder ici : la lecture sous RLS repose sur le rattachement.
- **Export et suppression** (#14, sortie de la beta) : le suivi ne garde aucune donnée, il n'y a rien à exporter ni à supprimer de plus. Aucun scénario.
- **Rapport de la semaine** (bilan des 7 derniers jours, conseils, nombre de fois ratée) : #35, après la beta (34.15, 34.16).
- **Enregistrements de lecture** : #38 ajoute son bloc entre la carte et les leçons jouées (34.17).
- **Leçons personnelles** : #39 les ajoute aux chiffres, à la carte et aux leçons jouées (34.6). Aucun scénario ici.
- **Mots de la semaine** (#37) : leurs séances s'ajouteront aux séances jouées (34.5).
- **Suivi sans réseau** et copie locale des données : #44 (34.21). Ici, seulement le message.
- Vue d'un seul enfant avec un sélecteur (34.8) : pas pour la beta.

## Questions ouvertes

Les questions **34.1 à 34.22** sont dans `docs/stories/34/domain-model.md`, chacune avec sa recommandation. Les scénarios suivent ces recommandations. Celles qui portent sur un scénario : 34.1, 34.2, 34.3, 34.4, 34.5, 34.7, 34.8, 34.9, 34.10, 34.11, 34.12, 34.13, 34.14, 34.15, 34.17, 34.18, 34.21. Les autres (34.6, 34.16, 34.19, 34.20, 34.22) ne touchent que le hors périmètre, le modèle ou le glossaire.

Questions ajoutées par les critères d'acceptance :

**34.23. Libellés des matières dans le suivi.** Le Catalogue dit « Mathématiques », « Histoire et géographie », « Vivre ensemble (EMC) » ; les onglets du parcours de l'enfant disent « Maths », « Histoire-géo », « Vivre ensemble ».
- **Recommandation** : les **libellés du Catalogue**, en entier, dans la carte et dans la colonne « Matière ». Le suivi est lu par un adulte, et le titre du parcours dit déjà « Mathématiques · CE1 ». Scénarios : « La carte des compétences d'un enfant de CE1 regroupe les sections… », « Chaque leçon jouée montre sa matière… ».

**34.24. Étoiles et dates dans les leçons jouées.**
- **Recommandation** : comme le legacy à l'écran : « ★ » répétées pour les meilleures étoiles, « réussie au test de départ » (34.14), « – » sans étoile ; date au format `jj/mm/aaaa`. Pour un lecteur d'écran, les étoiles se lisent « 2 étoiles sur 3 », comme le parcours (#25). Scénarios : « Chaque leçon jouée montre… », « Un lecteur d'écran lit en toutes lettres les étoiles d'une leçon jouée ».

**34.25. État d'une ligne de la carte sans dépendre de la couleur.** Le legacy montre l'état par une pastille de couleur ; seule la légende l'écrit.
- **Recommandation** : l'état est **écrit en toutes lettres** sur chaque ligne (« acquise », « en cours », « à faire », « pas encore de leçon »), à côté de la pastille ; un lecteur d'écran lit « `<section>` : `<état>` ». Scénario : « L'état de chaque ligne de la carte est écrit en toutes lettres et lu par un lecteur d'écran ».

**34.26. Blocs repliés du suivi.**
- **Recommandation** : comme le legacy, la carte (« Carte des compétences du programme (CE1) ») et les leçons jouées (« Toutes les leçons jouées », sans nombre dans le titre) sont **repliées** à chaque ouverture du suivi, pour chaque enfant ; rien n'est mémorisé. Chaque bloc se déplie au toucher et au clavier, et son bouton est annoncé replié ou déplié. Scénarios : « Les leçons jouées sont dans un bloc replié », « La carte des compétences se déplie au clavier ».

**34.27. Les leçons jouées sur un écran de 360 px.** Un tableau de 5 colonnes ne tient pas dans 360 px ; le legacy le fait défiler.
- **Recommandation** : **aucun défilement horizontal**, même dans les leçons jouées (règle du projet). Sur un petit écran, chaque leçon jouée s'affiche en fiche : le titre, puis matière, étoiles, erreurs (dernière fois) et dernière séance, chacun avec son intitulé. Le bouton de chaque bloc mesure au moins 44 px de haut. Scénario : « Le suivi tient dans un écran de 360 px de large… ».

**34.28. Une séance gardée sur l'appareil, pas encore enregistrée par le serveur, apparaît-elle dans le suivi ?** (Léa joue sans réseau sur la tablette, puis Paul ouvre le suivi sur la même tablette, réseau revenu, avant l'envoi.)
- **Recommandation** : **non**. Le suivi lit ce que le serveur a enregistré ; la séance y apparaît dès son envoi, comme sur tous les appareils du parent. Pas de scénario E2E : le moment de l'envoi n'est pas observable de façon sûre. La copie locale relève de #44.

## Décisions

Aucune pour l'instant : en attente des réponses du PO aux questions 34.1 à 34.28.
