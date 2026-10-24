# Critères d'acceptance : issue #65, écran « Mes trésors » (nom à valider)

Scénarios : `features/65-ecran-mes-tresors.feature` (tags `@issue-65 @wip`).
Modèle du domaine : `docs/stories/65/domain-model.md` (contexte **Motivation**, qui lit **Apprentissage** pour les records de fluence et le **Catalogue pédagogique** pour les titres).

> Le nom de l'écran n'est pas tranché (question 1). Les scénarios emploient la recommandation « Mes trésors ». Seuls les scénarios qui **vérifient** ce nom (titre, mot « trophée » absent, ouverture au clavier) portent `@a-valider` pour cette raison ; ailleurs le nom n'est que le texte de l'action et changera par simple remplacement dans le `.feature` et les steps. Le fichier sera renommé si le nom change.

## Objectif

En tant qu'**enfant**, je veux un écran qui réunit ce que j'ai gagné (la cabane, l'histoire, mes badges et mes records de calcul rapide), afin de voir mes progrès d'un coup d'œil.

Cette story livre l'**écran** (accès, titre, ordre des sections, lecture à voix haute, accessibilité) et sa section **« Mes records de calcul rapide »**, qui affiche les **records de fluence** enregistrés par #20, sans jamais les modifier. Les sections de la cabane (#32), de l'histoire (#33) et des badges (#31) s'ajoutent avec leur story. En attendant le dock de #29, l'écran s'ouvre par un bouton de l'accueil de l'enfant (question 6).

Comportement actuel (`app/`, `showTrophees`) repris comme premiers exemples : ordre cabane, histoire, badges, records ; section des records absente sans record ; une pastille par record. Écarts voulus (issue et questions) : un titre d'écran, un nom sans « trophée », la pastille porte le **titre de l'exercice** et non celui de la leçon, les pastilles suivent l'ordre du parcours, tout se lit à voix haute.

## Example mapping

| Règle | Exemples |
|---|---|
| 1. L'enfant ouvre l'écran depuis son accueil, et le retour l'y ramène | accueil → titre « Mes trésors », aucun « trophée » · « Retour » → accueil de l'enfant · au clavier (règle 5) |
| 2. Les sections suivent toujours l'ordre cabane, histoire, badges, records | aujourd'hui : records en dernière (et seule) section, aucune section vide « à venir » · après #31, #32, #33 : les quatre dans l'ordre |
| 3. Une pastille par record de fluence du profil en cours ; section absente sans record | record de 1 / 12 / 48 → « Calcul rapide : tables de 3 et 4 », 12 (pas « Les tables de 3 et de 4 ») · aucun record → pas de section · rien à montrer → « Fais un calcul rapide pour gagner ton premier record ! » · records gagnés dans l'ordre CE2, CP, CE1 → montrés CP, CE1, CE2 · deux fluences d'une même leçon → deux libellés, dans l'ordre de la leçon · fluence sans titre → titre de la leçon · exercice retiré → libellé enregistré · redescendue en CE1 → record de CE2 toujours là · nouveau record de 12 (avant 10) → 12 · sans réseau → pas de section, pas d'erreur · pastille choisie → on reste sur l'écran |
| 4. Tout texte peut être lu ; « tout lire à voix haute » lit tout l'écran à l'ouverture | Noisette, Lumi, Capitaine Sam disent « Regarde tout ce que tu as gagné ! » · Tout lire : phrase, titre, titre de section, pastille · sans Tout lire : seulement la phrase · « Écouter » : « … ton record est de 1 calcul » / « … de 12 calculs » · Muet : rien |
| 5. Lecteur d'écran, clavier, mode dys, mouvements réduits, 360 px | annonce « Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs » · ouverture au clavier · 360 px avec « Calcul rapide : compléments à 100 », cibles de 44 px · police Andika et espacements · pastilles sans mouvement |
| 6. L'écran ne montre que les records du profil enfant qui joue | Tom (même parent) a 15, Léa rien → pas de section · Léa 12, Tom 15 et 20 → Léa voit seulement 12 · Marie (rattachée) retrouve 12 · Claire (non rattachée) ne reçoit rien |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | L'enfant ouvre l'écran depuis son accueil, et le retour l'y ramène | Depuis son accueil, l'enfant ouvre l'écran et voit son titre (`@a-valider`) · Depuis l'écran, le retour ramène à l'accueil de l'enfant (`@a-valider`) | 1, 4, 6 |
| 2 | Les sections de l'écran suivent toujours l'ordre cabane, histoire, badges, records de calcul rapide | Les records de calcul rapide viennent après toutes les autres sections, sans section vide annoncée · Les quatre sections apparaissent dans l'ordre cabane, histoire, badges, records (`@depend-de-31 @depend-de-32 @depend-de-33`) | — |
| 3 | La section des records de calcul rapide montre une pastille par record de fluence du profil en cours, et n'apparaît pas sans record | Avec un record de <record>, la pastille montre le titre de l'exercice et <record> (3 cas : 1, 12, 48 ; `@a-valider`) · Sans aucun record, la section des records de calcul rapide n'apparaît pas · Sans rien à montrer, le personnage guide invite l'enfant à gagner un premier record (`@a-valider`) · Les pastilles suivent l'ordre du parcours, pas l'ordre où les records ont été gagnés (`@a-valider`) · Deux fluences d'une même leçon ont deux pastilles aux libellés différents (`@a-valider`) · Une fluence sans titre prend le titre de sa leçon (`@a-valider`) · Le record d'un exercice qui n'est plus dans la bibliothèque reste montré (`@a-valider`) · Redescendue en CE1, l'enfant retrouve son record d'une leçon de CE2 (`@a-valider`) · Juste après un nouveau record, la pastille montre le nouveau record · Sans réseau, la section des records n'apparaît pas, sans message d'erreur (`@a-valider`) · Une pastille de record n'ouvre pas la leçon (`@a-valider`) | 3, 7, 8, 9, 10, 13, 14 |
| 4 | Tout texte de l'écran peut être lu à voix haute ; « tout lire à voix haute » lit tout l'écran à l'ouverture | Dans l'univers « <univers> », <personnage guide> accueille l'enfant sur l'écran (3 cas : Noisette, Lumi, Capitaine Sam ; `@a-valider`) · Avec « tout lire à voix haute », le titre puis chaque section sont lus à l'ouverture (`@a-valider`) · Sans « tout lire à voix haute », seul l'accueil du personnage guide est lu à l'ouverture (`@a-valider`) · Sans « tout lire à voix haute », l'enfant fait lire les records à la demande (2 cas : 1, 12 ; `@a-valider`) · En Muet, rien n'est lu sur l'écran, même avec « tout lire à voix haute » | 2, 5, 11, 12 |
| 5 | L'écran se lit au lecteur d'écran, au clavier, en mode dys, sans mouvement et sur un petit écran | Un lecteur d'écran lit le libellé et la valeur de chaque pastille (`@a-valider`) · Sur un ordinateur, l'enfant ouvre l'écran au clavier (`@a-valider`) · L'écran tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant · Avec le mode dys, le titre et les pastilles s'affichent en mode dys · Avec les mouvements réduits, les pastilles apparaissent sans mouvement | 1, 11 |
| 6 | L'écran ne montre que les records du profil enfant qui joue | Un enfant ne voit jamais le record d'un autre enfant du même parent (`@acces`) · Quand deux enfants du même parent ont des records, chacun ne voit que les siens (`@acces`) · Le second parent rattaché retrouve les records de Léa sur son téléphone (`@acces`) · Un parent qui n'est pas rattaché ne lit pas les records de Léa (`@acces`) | — |

Total : 6 règles, 29 scénarios (34 cas), dont 17 `@a-valider`, 4 `@acces`, 1 `@depend-de` (31, 32 et 33).

Droits d'accès (`@acces`) : les records sont lus sous la RLS existante de `records_de_fluence` (#20, policy `records_de_fluence_lecture_par_ses_parents`). La RLS ne sépare pas deux enfants d'un même parent : c'est le filtre sur le **profil en cours** qui garantit qu'un enfant ne voit jamais les records d'un autre profil ; les deux scénarios Léa / Tom le vérifient (l'un sans record pour Léa, l'autre avec des records des deux enfants sur un même exercice). Le scénario Claire reprend mot pour mot les étapes de #20 (« Claire demande les records du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa »).

## Données de test

- Exercices de fluence **réels** de `app/bibliotheque.json` : « Calcul rapide : les doubles » (ma-cp-doubles, CP), « Calcul rapide : tables de 2 à 5 » (ma-ce1-tables-2-5, CE1), « Calcul rapide : tables de 3 et 4 » (ma-ce2-tables-3-4, CE2), « Calcul rapide : compléments à 100 » (ma-ce2-calcul-mental, CE2, titre le plus long des CE2, pour la largeur de 360 px).
- **Leçons de test**, identifiants préfixés `e2e-65-`, ajoutées à la bibliothèque servie au navigateur pour les seuls scénarios qui les citent : « Deux calculs rapides » (deux fluences, « Calcul rapide : tables de 2 » puis « Calcul rapide : tables de 5 ») et « Multiplier vite » (une fluence sans titre, signe « × »). Le record « Calcul rapide : les anciens doubles » porte sur une leçon `e2e-65-…` absente de la bibliothèque servie.
- **Records** : préparés comme dans #20 (`inscrireUnRecordDeFluence`, clé `service_role` réservée à la préparation, sur un vrai profil enfant), ou gagnés en jouant une fluence (« Léa a fini cette fluence avec 12 calculs réussis »). Ils partent en cascade avec le profil enfant, supprimé en fin de scénario. Aucune migration.
- Steps réutilisés sans changement de sens : « Léa a un record de N à la fluence « … » », « Léa n'a pas encore de record à la fluence « … » », « … , gagné sur la tablette », « Léa a fini cette fluence avec N calculs réussis », « Claire demande les records du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa », « Léa revient en arrière », « Léa voit son accueil », « Léa lit « … » », « Léa entend Noisette lire « … », puis « … » », « les lecteurs d'écran annoncent « … » », « la page tient dans la largeur de l'écran », « l'appareil demande des mouvements réduits », « Paul a réglé « … » sur « … » pour Léa », « le réglage « … » de Léa est sur « … » », « la tablette est en Muet », « Léa n'entend rien », « elle voit … dans le paysage de l'univers « … » », « Léa a choisi l'univers … », « Tom a un profil enfant préparé de niveau … », « Marie est rattachée au profil enfant de Léa », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « le réseau est coupé », « aucun message d'erreur n'apparaît ». Certains ne créent un vrai profil que sous le tag d'une autre story (`@issue-25`) : à étendre à `@issue-65` par l'e2e-tester, sans en changer le sens.
- Steps nouveaux (formulations) : ouvrir l'écran depuis l'accueil (au toucher, au clavier, sur le téléphone de Marie), titre de l'écran, mot « trophée » absent, ordre et dernière section, section absente, pastilles (« montrent seulement », « montrent, dans l'ordre »), records en tableau, records de Tom, leçons de test, record orphelin, choisir une pastille, phrase d'un personnage guide, lecture dans l'ordre, « n'entend pas Noisette lire », « demande à écouter les records de calcul rapide », tailles de 44 px, mode dys, pastilles sans mouvement.

## Hors périmètre

- Le contenu des sections « La cabane de Noisette » (#32), « L'histoire des Savanturiers » (#33) et « Mes badges » (#31) : leurs scénarios restent dans leur story.
- Le dock de « Aujourd'hui » et le libellé de ses onglets sous 520 px (#29, question 4).
- La copie des records sur l'appareil pour l'affichage hors ligne (#44).
- L'export et la suppression des records avec le profil (#14 : contrat de données déjà posé, cascade en place).
- Le calcul et l'enregistrement d'un record (#20) : l'écran ne fait que lire.
- Ouvrir une leçon depuis une pastille pour battre son record (question 13).
- L'affichage des records dans l'Espace parent (question 16).

## Questions ouvertes

1. **Nom de l'écran et de son bouton d'accès.** « Trophée » est un synonyme interdit de Badge ; pistes de l'issue : « Mes trésors », « Ma collection », « Mes réussites ». **Reco** : « Mes trésors » (« collection » est interdit pour Cabane, « réussites » brouille Leçon réussie). Scénarios concernés : règle 1, ouverture au clavier, Tout lire.
2. **Le personnage guide accueille-t-il l'enfant sur cet écran (une phrase lue) ?** **Reco** : oui, une phrase courte à l'ouverture ; texte proposé « Regarde tout ce que tu as gagné ! » (à valider ou remplacer).
3. **Libellé d'une pastille : nom de l'exercice seul, ou « `<leçon>` · `<exercice>` » ?** **Reco** : le titre de l'exercice seul, tel quel (« Calcul rapide : tables de 3 et 4 »), valeur à part (« 12 ») ; repli sur le titre de la leçon pour une fluence sans titre.
4. **Sous 520 px, garder les libellés du dock plutôt que les seules icônes ?** **Reco** : à porter par #29 (avis : oui, libellés toujours visibles). Dans #65, le bouton d'accès garde toujours son texte.
5. **L'écran reste-t-il celui de Noisette quel que soit l'univers, ou suit-il le personnage guide de l'univers choisi ?** **Reco** : il suit l'univers du profil (paysage, personnage guide, voix) ; le contenu des sections cabane et histoire reste tranché par #32 et #33.
6. **Accès sans dock (#29 non livré).** **Reco** : un bouton au nom de l'écran sur l'accueil de l'enfant, sous « Mon parcours » ; « Retour » ramène à l'accueil. #29 le déplacera dans le dock.
7. **Écran sans aucune section à afficher** (aucun record, #31 à #33 pas livrés). **Reco** : afficher le titre et une phrase du personnage guide, « Fais un calcul rapide pour gagner ton premier record ! » (texte à valider), plutôt que cacher le bouton d'accès.
8. **Ordre des pastilles.** **Reco** : ordre du parcours : niveau, puis `ordre` de la leçon, puis position de l'exercice dans la leçon (« les doubles » CP, « tables de 2 à 5 » CE1, « tables de 3 et 4 » CE2).
9. **Record dont la leçon ou l'exercice n'existe plus dans la bibliothèque.** **Reco** : garder la pastille, avec la clé enregistrée (titre de l'exercice au moment du record) comme libellé.
10. **Records des leçons d'un autre niveau** (classe d'avant, ou enfant redescendu de classe). **Reco** : montrer tous les records du profil, quel que soit son niveau actuel.
11. **Valeur et phrase lue d'une pastille.** **Reco** : à l'écran « 12 » ; à voix haute et au lecteur d'écran « Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs » (« 1 calcul » au singulier).
12. **Que lit-on, et quand ?** **Reco** : à l'ouverture, toujours la phrase du personnage guide ; avec « tout lire à voix haute », en plus le titre puis chaque section dans l'ordre (titre et pastilles) ; sans, un bouton « Écouter » de 44 px par section.
13. **Une pastille ouvre-t-elle la leçon pour battre son record ?** **Reco** : non dans #65 (pastille inerte, comme le legacy) ; à reprendre dans une story ultérieure si souhaité.
14. **Sans réseau, ou juste après un record dont la séance n'est pas encore envoyée.** **Reco** : attendre les envois de séance en cours avant de lire (le nouveau record s'affiche) ; sans réseau, la section des records n'apparaît pas, sans message d'erreur, jusqu'à la copie sur l'appareil de #44.
15. **Profil de démonstration (sans compte parent).** L'écran s'ouvre-t-il depuis l'accueil d'un profil de démonstration, qui n'a aucun record enregistré ? **Reco** : oui, comme les autres écrans de l'enfant ; la section des records n'y apparaît jamais (pas de record sans profil réel). Pas de scénario tant que la réponse manque.
16. **Le parent voit-il ces records ailleurs que sur l'écran de l'enfant (Espace parent, suivi) ?** **Reco** : non dans #65 ; le suivi des records par le parent relève d'Accompagnement (rapport de la semaine), dans une story à part.
17. **Phrase du personnage guide quand il n'y a rien à montrer et que « tout lire à voix haute » est actif.** Les phrases des questions 2 et 7 se cumulent-elles ? **Reco** : non : sans rien à montrer, la phrase de la question 7 remplace celle de la question 2 (une seule phrase à l'ouverture). Pas de scénario tant que la réponse manque.

## Décisions

Aucune pour l'instant (en attente de la validation du PO).
