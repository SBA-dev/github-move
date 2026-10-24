# Critères d'acceptance : issue #25, Parcours par matière

Scénarios : `features/25-parcours-par-matiere.feature` (tags `@issue-25 @wip` ; fichier et fonctionnalité renommés « Parcours par matière », réponse N5).
Modèle du domaine : `docs/stories/25/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** et **Famille**), révisé après les réponses du PO.

> Révision après les réponses du PO : **aucun verrou** (réponse 25.1). Toutes les leçons du parcours s'ouvrent ; la prochaine leçon est seulement mise en avant. Les scénarios de verrou et de parcours libre sont retirés.

## Objectif

En tant qu'**enfant**, je veux voir le **parcours** de chaque **matière** de ma classe, leçon après leçon, avec la **prochaine leçon** mise en avant, afin d'apprendre dans l'ordre conseillé sans me perdre.

Le parcours est calculé par le domaine (`@domain/apprentissage`), dans le navigateur, à partir des leçons de la bibliothèque, du **niveau** du profil enfant et des **meilleures étoiles** enregistrées par #24 (lues sous RLS). Le réglage **parcours libre** n'est plus lu (réponse N2). Rien de nouveau n'est écrit en base.

Comportement actuel (`app/`, `subjectPath`, onglet `parcours` de `showMap`, `nextAfter`) repris comme premiers exemples, avec les écarts décidés par le PO : aucun verrou (l'affichage du parcours libre du legacy devient celui de tous), « Leçon n » au lieu de « Étape n », lecteur d'écran qui dit le nombre d'étoiles, message sans « espace adulte », retour vers l'accueil de l'enfant, onglets limités aux matières qui ont des leçons du niveau, « Leçon suivante » sans repli sur une autre matière, leçons réussies d'une classe au-dessus visibles.

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Le parcours d'une matière montre, dans l'ordre, ses leçons du niveau de l'enfant ; seules ces matières ont un onglet | CE1 : « Français · CE1 », 4 leçons dans l'ordre, ni CP ni CE2 · CE1 → onglets Français, Maths ; CE2 → Français, Vivre ensemble · sciences (CP seulement) : pas d'onglet pour un CE1 · EMC réussie en CE2, redescendue en CE1 : pas d'onglet (N7) · CM2 sans leçon : « Aucune leçon pour ta classe pour l'instant. » · ouverture sur le français, puis sur la dernière matière choisie · retour vers l'accueil · « Leçon 1 » à « Leçon 4 » |
| 2. La prochaine leçon est la première leçon non réussie du parcours ; les autres leçons non réussies sont à découvrir | sans progression : 1 à toi, 2 à 4 à découvrir · après 1 étoile à la 1 : la 2 à toi · 1 et 3 réussies : 2 à toi, 4 à découvrir (N8) · tout réussi : ni « À toi ! » ni « À découvrir » · chaque matière a sa prochaine leçon |
| 3. Toute leçon montrée dans le parcours s'ouvre, qu'elle soit réussie, prochaine leçon ou à découvrir | prochaine leçon → page de la leçon · leçon réussie → page de la leçon · leçon à découvrir, sans avoir réussi celles d'avant, au toucher et au clavier → page de la leçon · leçon réussie en CE2, enfant redescendu en CE1 → page de la leçon (N1, N9) |
| 4. Le parcours compte les leçons réussies du niveau de l'enfant, et seulement elles | 0 / 1 (singulier) / 3 / 4 (pluriel) sur 4 · étoiles du CP et du CE2 non comptées pour un CE1 |
| 5. Changer de classe garde les étoiles ; les leçons réussies d'une classe au-dessus restent visibles, à part du parcours | CE1 → CE2 avec « Le futur » déjà réussie : « L'imparfait » à toi · CE1 → CE2 → CE1 : « Le son in » toujours à 2 étoiles · CE2 → CE1 : bloc « Déjà réussies en CE2 » avec « Le futur » et « L'imparfait », sans « Le passé composé » (N1) |
| 6. À la fin d'une séance, la leçon suivante est la première leçon d'après non réussie du même parcours, sinon la leçon juste après | 2 réussie, séance de la 1 → « Ensuite : Les mots contraires » · séance de la 2 alors que la 1 n'est pas réussie → la 3 · 3 et 4 réussies, séance de la 2 → la 3 (N4) · séance de la 4 → aucune leçon suivante, pas de maths · séance d'une leçon de CE2 pour un CE1 → aucune leçon suivante (N10) |
| 7. Le parcours se lit sans réseau, au lecteur d'écran, au clavier et sur un petit écran | séance sans réseau puis parcours à jour · annonces « Le son in : réussie, 2 étoiles sur 3 », « … : à toi ! », « … : à découvrir » · « Le futur, CE2 : réussie, 2 étoiles sur 3 » (N1) · flèche → onglet Maths · 360 px et cibles de 44 px |
| 8. Seul un parent rattaché au profil enfant lit la progression qui fait le parcours | Marie retrouve le parcours de Léa · les étoiles de Tom ne passent pas dans le parcours de Léa · Claire ne lit rien |

## Règles

| # | Règle | Scénarios | Décisions |
|---|---|---|---|
| 1 | Le parcours d'une matière montre, dans l'ordre, ses leçons du niveau de l'enfant ; seules ces matières ont un onglet | Le parcours de français d'un enfant de CE1 montre les leçons de français du CE1, dans l'ordre · Un enfant de <niveau> a un onglet pour chaque matière qui a des leçons de son niveau (2 cas : CE1, CE2) · Une matière qui n'a que des leçons des classes d'avant n'a pas d'onglet · Une matière qui n'a que des leçons réussies d'une classe au-dessus n'a pas d'onglet · Sans aucune leçon pour sa classe, l'enfant lit qu'il n'y en a pas encore · Le parcours s'ouvre sur le français · Le parcours se rouvre sur la dernière matière choisie · Depuis le parcours, le retour ramène à l'accueil de l'enfant · Chaque leçon du parcours porte sa place | N7 |
| 2 | La prochaine leçon est la première leçon non réussie du parcours ; les autres leçons non réussies sont à découvrir | Sans progression, la première leçon est la prochaine leçon et les suivantes sont à découvrir · Après une séance d'au moins 1 étoile, la leçon d'après devient la prochaine leçon · Une leçon réussie plus loin dans le parcours ne déplace pas la prochaine leçon · Quand toutes les leçons du parcours sont réussies, il n'y a plus de prochaine leçon · Chaque matière a sa propre prochaine leçon | N8 |
| 3 | Toute leçon montrée dans le parcours s'ouvre, qu'elle soit réussie, prochaine leçon ou à découvrir | La prochaine leçon s'ouvre depuis le parcours · Une leçon réussie s'ouvre pour être rejouée · Une leçon à découvrir s'ouvre <moyen>, sans avoir réussi celles d'avant (2 cas : au toucher, au clavier) · Une leçon déjà réussie dans une classe au-dessus s'ouvre depuis le parcours | N1, N9 |
| 4 | Le parcours compte les leçons réussies du niveau de l'enfant, et seulement elles | Avec <réussies> leçon(s) réussie(s), le parcours indique « <compteur> » (4 cas : 0, 1, 3, 4) · Les leçons réussies d'un autre niveau ne comptent pas | — |
| 5 | Changer de classe garde les étoiles ; les leçons réussies d'une classe au-dessus restent visibles, à part du parcours | En passant du CE1 au CE2, le parcours de français commence à la première leçon de CE2 non réussie · Revenue au CE1, l'enfant retrouve les étoiles de ses leçons de CE1 · Redescendue en CE1, l'enfant retrouve à part ses leçons de CE2 réussies, et seulement elles | N1 |
| 6 | À la fin d'une séance, la leçon suivante est la première leçon d'après non réussie du même parcours, sinon la leçon juste après | La leçon suivante saute une leçon déjà réussie · Une leçon d'après à découvrir est proposée même si une leçon d'avant n'est pas réussie · Quand toutes les leçons d'après sont réussies, la leçon suivante est la leçon juste après · Après la dernière leçon du parcours, aucune leçon d'une autre matière n'est proposée · Après une leçon réussie d'une classe au-dessus, aucune leçon suivante n'est proposée | N4, N6, N10 |
| 7 | Le parcours se lit sans réseau, au lecteur d'écran, au clavier et sur un petit écran | Sans réseau, le parcours se met à jour après une séance · Un lecteur d'écran lit l'état de chaque leçon du parcours · Un lecteur d'écran lit le niveau d'une leçon réussie d'une classe au-dessus · Les matières du parcours se choisissent au clavier · Le parcours tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant | N1 |
| 8 | Seul un parent rattaché au profil enfant lit la progression qui fait le parcours | Le second parent rattaché retrouve le parcours de Léa sur son téléphone (`@acces`) · Le parcours d'un enfant ne montre jamais les étoiles d'un autre enfant (`@acces`) · Un parent qui n'est pas rattaché ne lit pas la progression de Léa (`@acces`) | — |

Total : 8 règles, 36 scénarios (41 cas), dont 3 `@acces` ; aucun `@a-valider`. Dans le `.feature`, un commentaire `# Réponse Nn` au-dessus d'un scénario renvoie à la décision qui le fonde. La story peut se livrer en deux temps : le calcul et l'écran « Mon parcours » (règles 1 à 5, 7, 8), puis « Leçon suivante » selon le parcours (règle 6, qui touche l'écran de fin de #24).

Droits d'accès (`@acces`) : la progression lue est celle de `resultats_des_lecons` (#24), sous la RLS existante (policy `resultats_des_lecons_lecture_par_ses_parents`). Les deux parents rattachés retrouvent le même parcours sur leurs appareils ; un parent non rattaché (Claire) ne reçoit aucune ligne. Ce dernier scénario reprend mot pour mot les étapes de #24 (« Claire demande les étoiles du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa »). Le scénario Léa / Tom vérifie que la lecture est bien filtrée par profil enfant, même pour deux enfants du même parent. Sans verrou, il n'y a plus rien à refuser à l'enfant lui-même.

### Lecture des tableaux d'état

| Dans les scénarios | À l'écran (cible) |
|---|---|
| réussie, n étoiles | une étoile par étoile gagnée, coche ; texte lu « réussie, n étoiles sur 3 » |
| à toi | « À toi ! » : la prochaine leçon |
| à découvrir | « À découvrir » : leçon non réussie qui n'est pas la prochaine leçon ; elle s'ouvre comme les autres |

« Plus tard » et le cadenas du legacy disparaissent.

## Données de test

Bibliothèque de test du parcours, **servie au navigateur à la place de la vraie bibliothèque** pour ces scénarios (les comptes « sur 4 » ne dépendent donc pas du contenu réel, qui change). Identifiants préfixés `e2e-25-`. Leçons servies dans le désordre, pour vérifier le tri par `ordre`. Chaque leçon a un exercice bulles de deux questions à quatre choix, pour pouvoir jouer une séance complète.

| Matière, niveau | Leçons (ordre) | Sert à |
|---|---|---|
| français, CP | « Les voyelles » (10), « Les syllabes » (20) | leçons d'un niveau inférieur : absentes du parcours de CE1, non comptées |
| français, CE1 | « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30), « Le pluriel des noms » (40) | parcours principal |
| français, CE2 | « Le futur » (10), « L'imparfait » (20), « Le passé composé » (30) | changement de classe ; leçons réussies d'une classe au-dessus ; étoiles d'un niveau supérieur non comptées |
| maths, CE1 | « Les nombres jusqu'à 100 » (10), « Les compléments à 10 » (20) | deuxième onglet, prochaine leçon par matière, onglets au clavier, pas de repli vers les maths en fin de séance |
| sciences, CP | « Les cinq sens » (10) | matière qui n'a que des leçons des classes d'avant pour un CE1 |
| EMC, CE2 | « Les règles de la classe » (10) | onglet « Vivre ensemble » d'un CE2 ; matière sans onglet pour un enfant redescendu en CE1 (N7) |
| histoire, anglais ; CM1, CM2 | aucune | pas d'onglet ; CM2 sans aucune leçon |

Progression préparée : « Léa a pour meilleures étoiles : » (tableau) et « Léa a réussi <n> leçon(s) de français du CE1 » (les n premières leçons du parcours, 1 étoile chacune) sont préparés par le jeu de données (clé `service_role` réservée à la préparation), directement dans `resultats_des_lecons` pour le profil réel de l'enfant ; la colonne `lecon` n'a pas de clé étrangère, les identifiants `e2e-25-…` y sont acceptés. Ces étapes sont distinctes de « Léa a déjà gagné n étoiles à la leçon … » (#24), qui joue la séance. Pour un enfant « redescendu », le profil est préparé au niveau d'au-dessus (CE2), les étoiles posées, puis Paul change le niveau en CE1 par l'étape existante.

Séance jouée : « Léa a terminé une séance de la leçon « Le son in » avec 1 étoile » joue la séance dans l'interface (4 erreurs ou plus). Le serveur ne connaît pas les leçons de test (comme #24, Q85) : le parcours doit refléter la séance tout de suite grâce aux étoiles calculées dans le navigateur et à la séance gardée sur l'appareil (réponse 25.6). Si le serveur traite une leçon inconnue autrement qu'un envoi impossible, l'`e2e-tester` le signale.

Parents, enfants et appareils : Paul (tablette), Marie (téléphone), rattachés à Léa ; Claire (téléphone), non rattachée ; Tom, second enfant de Paul. Les profils de Léa et de Tom sont de vrais profils (comme #24) : niveau changé par Paul, progression lue sous RLS.

Étapes reprises telles quelles d'autres stories : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … », « Marie est rattachée au profil enfant de Léa », « Claire est connectée sur le téléphone », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « Léa joue la séance complète de la leçon « … » », « Léa réussit la dernière question de la séance », « la fin de la séance annonce « … » », « la leçon suivante ouvre la page de la leçon « … » », « la fin de la séance propose … et … », « aucune leçon suivante n'est proposée », « le réseau est coupé », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « le focus est sur « … » », « Claire demande les étoiles du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa ». Aucune étape existante n'est modifiée. L'étape « le réglage « parcours libre » de Léa est sur « oui » » n'est plus employée ici.

## Hors périmètre

- Verrous : abandonnés (réponse 25.1).
- Réglage « parcours libre » : n'a plus d'effet sur le parcours ; son retrait de l'interface et du glossaire relève d'une petite story de Famille après #25 (réponse N2).
- Leçons des classes d'avant dans le parcours, « Toutes les leçons » : #26.
- Test de départ (leçons validées d'avance) : #27.
- Écran « Aujourd'hui » et repli de « Leçon suivante » vers une autre matière : #29.
- Leçons personnelles et étiquette « Pour toi » : Accompagnement, lot 6 (réponse 25.15).
- Parcours affiché sans réseau dès le lancement de l'application (copie des résultats sur l'appareil) : #44 (réponse 25.6).
- Leçon ajoutée au milieu d'un parcours : acceptée sans signal, pas de scénario (réponse 25.13).
- Deux leçons de même `ordre` : test du pipeline (pytest) et du domaine, pas de scénario E2E (réponse 25.14).
- Parcours entièrement réussi : seulement le compteur, pas de félicitation (réponse 25.16 ; Motivation, lot 5).
- Défilement automatique jusqu'à la prochaine leçon (legacy) : repris, non vérifié en E2E (avec 4 leçons, tout est visible).
- Suivi du parent : lot 6.

## Décisions

Réponses du PO (annonce du responsable), numéros de la première version de ce fichier.

| n° | Question | Réponse | Effet sur les scénarios |
|---|---|---|---|
| 25.1 | Règle du verrou (leçons 1 et 3 réussies : la 4 est-elle verrouillée ?) | **b : aucun verrou.** Toutes les leçons du parcours sont ouvertes ; la prochaine leçon est seulement mise en avant. | « plus tard » → « à découvrir » dans tous les tableaux ; règle du verrou remplacée par la règle 3 « Toute leçon montrée dans le parcours s'ouvre » ; scénarios de leçon verrouillée retirés. |
| 25.2 | « Leçon suivante » à la fin d'une séance | Recommandation : la première leçon d'après non réussie, dans le parcours de la leçon jouée, sans repli sur une autre matière avant #29. La partie « non verrouillée » tombe. | Règle 6 ; « Une leçon verrouillée n'est jamais proposée… » remplacé par « Une leçon d'après à découvrir est proposée même si une leçon d'avant n'est pas réussie » ; ajout de « Après la dernière leçon du parcours, aucune leçon d'une autre matière n'est proposée ». La conséquence sur les données de #24 tombe (N6). |
| 25.3 | Leçon verrouillée ouverte par son adresse | Sans objet (plus de verrou). | Scénario retiré. |
| 25.4 | Onglet d'une matière sans leçon du niveau | Pas d'onglet. | `@a-valider` retiré. |
| 25.5 | Parcours libre dans cette story | Sans objet : le parcours libre n'a plus d'effet (N2). | Deux scénarios retirés. |
| 25.6 | Hors ligne | Le parcours se met à jour tout de suite après une séance ; l'affichage sans réseau dès le lancement relève de #44. | `@a-valider` retiré. |
| 25.7 | Texte lu par un lecteur d'écran | « <titre> : réussie, 2 étoiles sur 3 », « <titre> : à toi ! », « <titre> : à découvrir » (« verrouillée, plus tard » tombe). | `@a-valider` retiré, tableau corrigé. |
| 25.8 | Libellé de la place | « Leçon 1 », « Leçon 2 »… | `@a-valider` retiré. |
| 25.9 | Aucune leçon pour le niveau | « Aucune leçon pour ta classe pour l'instant. » | `@a-valider` retiré. |
| 25.10 | Accès à « Mon parcours » | Bouton « Mon parcours » sur l'accueil de l'enfant ; le retour ramène à cet accueil. | `@a-valider` retiré. |
| 25.11 | Matière à l'ouverture | Dernière matière choisie pendant l'utilisation en cours, sinon le français, sinon la première ; rien n'est mémorisé d'une ouverture à l'autre. | `@a-valider` retiré (deux scénarios). |
| 25.12 | Descente de classe (CE2 → CE1) | **a : les leçons de CE2 réussies restent visibles** pour l'enfant redescendu en CE1. L'endroit n'est pas précisé (N1). | `@a-valider` retiré de « Revenue au CE1… » ; ajout des scénarios du bloc « Déjà réussies en CE2 », `@a-valider` puis retiré (N1). |
| 25.13 | Leçon ajoutée au milieu d'un parcours | Acceptée sans signal. | Pas de scénario. |
| 25.14 | Deux leçons de même `ordre` | Le pipeline refuse le doublon (pytest) ; le domaine départage par identifiant. | Pas de scénario E2E. |
| 25.15 | Leçons personnelles | Hors story. | — |
| 25.16 | Parcours entièrement réussi | Seulement le compteur. | `@a-valider` absent (déjà sans tag). |

Réponses du PO aux questions N1 à N11 (2026-10-24) : toutes les recommandations sont retenues.

| n° | Question | Réponse | Effet sur les scénarios et les documents |
|---|---|---|---|
| N1 | Où l'enfant redescendu de classe voit-il ses leçons réussies de la classe d'au-dessus ? | Reco : (a), un bloc à part « Déjà réussies en CE2 » dans « Mon parcours », sous les leçons de CE1, seulement les leçons réussies, chacune avec son niveau, son titre et ses étoiles, hors compteur, jamais « À toi ! » ; lecteur d'écran « Le futur, CE2 : réussie, 2 étoiles sur 3 ». #26 aligne son bloc « Revoir les classes d'avant » sur lui. | `@a-valider` retiré de « Redescendue en CE1, l'enfant retrouve à part ses leçons de CE2 réussies… », « Une leçon déjà réussie dans une classe au-dessus s'ouvre… » et « Un lecteur d'écran lit le niveau d'une leçon réussie d'une classe au-dessus ». |
| N2 | Que devient le réglage « parcours libre » ? | Reco : retiré de l'interface et du glossaire dans une petite story de Famille après #25 (colonne gardée jusqu'à une migration de nettoyage) ; #26 devient « Leçons des classes d'avant ». #25 n'y touche pas. | Aucun scénario de #25 n'en parle. Création de la story : responsable des équipes. |
| N3 | Documents qui parlent encore de verrous | Reco : « Leçon verrouillée » passe en Décisions du glossaire comme « abandonné (25.1) » ; « Parcours libre » suit N2 ; `CLAUDE.md` dit « réussie à 1 étoile (elle fait avancer le parcours) » ; `ordre` dit « position dans le parcours de la matière » dans `docs/format-lecons.md` ; context map et feuille de route corrigées. | Documentation seulement, pas de scénario. |
| N4 | Leçon suivante quand toutes les leçons d'après sont réussies | Reco : la leçon juste après, sans revenir en arrière avant #29. | `@a-valider` retiré de « Quand toutes les leçons d'après sont réussies, la leçon suivante est la leçon juste après ». |
| N5 | Titre de la story et du fichier de scénarios | Reco : issue et fonctionnalité « Parcours par matière », fichier `features/25-parcours-par-matiere.feature` ; branche `feature/25-parcours-par-matiere-et-verrous` gardée. | Fichier renommé (`git mv`), titre de la fonctionnalité changé. Issue et `docs/graphe/stories.md` : responsable des équipes. |
| N6 | Titre d'un scénario de #24 | Reco : « La leçon suivante est la première leçon d'après non réussie de la même matière et du même niveau », étapes inchangées. | Scénario de `features/24-etoiles-et-fin-de-seance.feature` renommé ; décision consignée dans `docs/stories/24/acceptance.md`. |
| N7 | Matière sans leçon du niveau, mais avec des leçons réussies d'une classe au-dessus | Reco : pas d'onglet ; ces leçons se voient dans « Toutes les leçons » (#26) et le suivi du parent (lot 6). | `@a-valider` retiré de « Une matière qui n'a que des leçons réussies d'une classe au-dessus n'a pas d'onglet ». |
| N8 | Ordre conseillé sans verrou | Reco : leçons 1 et 3 réussies → la 2 est « À toi ! », la 4 « À découvrir ». | `@a-valider` retiré de « Une leçon réussie plus loin dans le parcours ne déplace pas la prochaine leçon ». |
| N9 | Rejouer une leçon réussie d'une classe au-dessus | Reco : elle s'ouvre, comme toute leçon réussie. | `@a-valider` retiré de « Une leçon déjà réussie dans une classe au-dessus s'ouvre depuis le parcours ». |
| N10 | Leçon suivante après une leçon d'une classe au-dessus | Reco : aucune leçon suivante (« Accueil » et « Rejouer »), pas de retour vers le parcours de CE1 avant #29. | `@a-valider` retiré de « Après une leçon réussie d'une classe au-dessus, aucune leçon suivante n'est proposée ». |
| N11 | Termes à valider au glossaire | Reco : **prochaine leçon**, **leçon à découvrir**, **leçon suivante** (règle révisée), **matière du parcours**, **place**, **leçon réussie d'une classe au-dessus**, tels que définis dans `docs/stories/25/domain-model.md` ; « Mon parcours », « À toi ! », « À découvrir », « Déjà réussies en CE2 » restent des mots d'interface. | Aucun changement d'étape ; ajout au glossaire par l'équipe (ajouts seulement pendant la vague). |

## Questions ouvertes

Aucune.

