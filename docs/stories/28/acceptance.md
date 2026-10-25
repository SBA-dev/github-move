# Critères d'acceptance : issue #28, Révisions des erreurs

Scénarios : `features/28-revisions-des-erreurs.feature` (tag `@issue-28`).
Modèle du domaine : `docs/stories/28/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** et **Famille**). Les questions 28.1 à 28.21 en viennent ; 28.22 à 28.28 sont ajoutées ici.

Le PO a retenu toutes les recommandations des questions 28.1 à 28.28 (voir « Décisions »). Les scénarios qui en dépendent portent un commentaire `# Réponse 28.n` ; aucun ne porte plus `@a-valider`.

## Objectif

En tant qu'**enfant**, je veux retrouver les questions que j'ai ratées les jours passés, à intervalles de plus en plus longs, afin de corriger mes erreurs pour de bon.

Une **question ratée** d'une séance terminée devient une **question retenue** de la **file de révision** du profil enfant. Son cycle :
- elle est **due** le lendemain du jour de l'erreur ;
- chaque fois qu'elle est **juste** en **séance de révision**, elle revient 3 jours, puis 7 jours plus tard ;
- juste une troisième fois, c'est une **erreur corrigée pour de bon** : elle sort de la file ;
- **fausse** en séance de révision, ou ratée de nouveau en séance, elle revient le lendemain.

La séance de révision pose les questions dues, les plus anciennes d'abord, 10 au plus. Elle ne donne pas d'étoiles et ne touche ni les étoiles ni le parcours. Elle se joue dans le navigateur, même sans réseau ; le serveur la revalide.

Le comportement actuel (`app/`, `Review`, `remember`, `playReview`) donne les premiers exemples. Écarts voulus, tranchés par le PO :
- la leçon d'origine ne change jamais (28.1) ;
- une question ratée en révision n'est retenue qu'une fois (28.1) ;
- pas d'étoiles à la fin de la séance de révision (28.2) ;
- une boîte à jetons est rejouée en boîte (28.13).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Une question ratée dans une séance terminée est retenue ; due le lendemain, jamais le jour même | erreur à « Quel mot a le son ou ? » → le lendemain, « 1 petite erreur des jours passés » · « Je ne sais pas » → idem · plus tard le même jour → rien · séance sans erreur → rien · séance quittée après une erreur → rien · 3 questions fausses au test de départ → rien · retenue à 7 jours, ratée de nouveau en séance → le lendemain · retenue due, réussie en séance ordinaire → toujours due |
| 2. L'accueil de l'enfant propose la séance de révision dès qu'une question est due, et dit combien | 1 → « 1 petite erreur des jours passés » · 3 → « 3 petites erreurs… » · 12 → « 12 petites erreurs… » · seule question due demain → rien · commencer → « Je révise mes erreurs », « Révision », phrase de Noisette, plus ancienne question d'abord, « Je ne sais pas » proposé, sans étape de leçon |
| 3. Au plus 10 questions dues, les plus anciennes d'abord | 11 dues sur 12 retenues → les 10 plus anciennes, dans l'ordre des dates ; « hier » et « demain » non posées · 12 dues → après la séance, « 2 petites erreurs… » |
| 4. Juste seulement sans aucune erreur ; nouvelle chance ; « Je ne sais pas » | « lit » → encouragement, « Essaie une autre bulle. », même question · « Je ne sais pas » → « loup » seul et brille |
| 5. Intervalles 1 → 3 → 7 → corrigée pour de bon ; fausse → lendemain | juste à 1 jour : rien 2 jours plus tard, due 3 jours plus tard · juste à 3 jours : rien 6 jours plus tard, due 7 jours plus tard · juste à 7 jours : rien 30 jours plus tard · fausse ou « Je ne sais pas » à 7 jours → le lendemain · trou ratée en révision → toujours 1 seule · quittée en cours → toujours 3 |
| 6. Fin sans étoiles ; phrase du personnage guide ; retour à l'accueil | seulement « Accueil », focus dessus, aucune étoile · 3 justes → « Bravo Léa ! 3 erreurs s'effacent un peu plus. » · 1 → « …1 erreur s'efface… » · 0 → « Merci Léa ! Ces erreurs reviendront demain : on les effacera ensemble. » · « Accueil » → plus de proposition · 2 étoiles de « Les sons de révision » gardées |
| 7. Sans réseau, à voix haute, au clavier, sur un petit écran | erreur sans réseau → proposée le lendemain sur l'appareil · séance de révision sans réseau → « Sauvegarde en ligne impossible… » · file non lue → rien, sans message · question suivante lue par Noisette · clavier · 360 px, 44 px (proposition, choix, « Je ne sais pas ») |
| 8. Le serveur tient la file, seulement pour un parent rattaché | séance envoyée avec une erreur → le lendemain sur le téléphone de Paul · séance de révision juste → plus due · refus : question sans bonne réponse, question posée deux fois · Marie voit « 2 petites erreurs… » · les questions de Tom ne vont pas à Léa · Claire ne lit rien et n'enregistre rien |
| 9. Données du profil | export : question retenue avec leçon d'origine et date de révision, sans réponse · suppression : plus rien |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | Une question ratée dans une séance terminée est retenue ; elle est due le lendemain, jamais le jour même | Une question ratée <manière> revient en révision le lendemain (2 cas : erreur, « Je ne sais pas ») · Une question ratée n'est pas due le jour même · Une séance terminée sans erreur ne retient aucune question · Une séance quittée avant la fin ne retient aucune question · Une question fausse au test de départ n'est jamais retenue · Une question retenue, ratée de nouveau dans une séance, revient le lendemain · Une question retenue réussie dans une séance ordinaire reste due | 28.4, 28.17, 28.18 |
| 2 | L'accueil de l'enfant propose la séance de révision dès qu'au moins une question est due, et dit combien | Avec <dues> question(s) due(s), l'accueil annonce « <annonce> » (3 cas : 1, 3, 12) · Sans question due, l'accueil ne propose pas de séance de révision · La séance de révision commence par la plus ancienne question due, sans étape de leçon | 28.8, 28.28 |
| 3 | La séance de révision pose au plus 10 questions dues, les plus anciennes d'abord ; les autres attendent la suivante | La séance de révision pose les 10 questions dues les plus anciennes, dans l'ordre de leur date de révision · Après une séance de révision de 10 questions, l'accueil propose les questions dues qui restent | 28.25 |
| 4 | En séance de révision, une question est juste seulement sans aucune erreur ; l'enfant a une nouvelle chance et peut dire « Je ne sais pas » | Après une erreur en séance de révision, le personnage guide encourage et la même question reste posée · Après « Je ne sais pas » en séance de révision, la bonne réponse est montrée et l'enfant la donne | — |
| 5 | Juste en séance de révision, une question revient 3 jours, puis 7 jours plus tard, puis elle est corrigée pour de bon ; fausse, elle revient le lendemain | Juste à l'intervalle de <intervalle>, une question <résultat> <jours> jours plus tard (4 cas) · Juste à l'intervalle de 7 jours, une question est corrigée pour de bon et ne revient plus · Fausse en séance de révision (<cas>), une question revient le lendemain, même à l'intervalle de 7 jours (2 cas) · Une question de texte à trous ratée en séance de révision reste une seule question retenue · Une séance de révision quittée en cours ne change aucune question retenue | 28.1, 28.4, 28.8, 28.13 |
| 6 | La fin de la séance de révision ne donne pas d'étoiles : le personnage guide dit les erreurs qui s'effacent, et l'enfant revient à son accueil | La fin de la séance de révision ne montre aucune étoile et propose seulement « Accueil » · Avec <justes> question(s) juste(s), le personnage guide dit « <phrase> » (3 cas) · « Accueil » ramène à l'accueil, qui ne propose plus la séance de révision quand plus rien n'est dû · Une séance de révision ne change pas les étoiles d'une leçon | 28.2, 28.8, 28.23 |
| 7 | La révision marche sans réseau, à voix haute, au clavier et sur un petit écran | Sans réseau, une question ratée est quand même proposée le lendemain sur l'appareil · Sans réseau, la séance de révision se joue jusqu'au bout et sa fin dit que la progression est gardée sur l'appareil · Sans file de révision lue, l'accueil ne propose pas de séance de révision, sans message d'erreur · Le personnage guide lit chaque question de la séance de révision · La séance de révision se commence et se joue au clavier · La proposition de la séance de révision tient dans un écran de 360 px, assez grande pour un doigt d'enfant · Une question de la séance de révision tient dans un écran de 360 px, « Je ne sais pas » compris | 28.21, 28.22 |
| 8 | La file de révision est tenue par le serveur, et seulement pour un parent rattaché au profil enfant | Une séance terminée envoyée par l'appareil retient sa question ratée, que l'on retrouve sur un autre appareil du parent (`@acces`) · Une séance de révision terminée envoyée par l'appareil fait avancer la question juste · Le serveur refuse une séance de révision terminée incohérente, et la question reste due (2 cas) · Le second parent rattaché retrouve sur son téléphone la séance de révision proposée à Léa (`@acces`) · Les questions retenues d'un enfant ne sont jamais proposées à un autre enfant (`@acces`) · Un parent qui n'est pas rattaché ne lit pas la file de révision de Léa (`@acces`) · Un parent qui n'est pas rattaché ne peut pas enregistrer une séance de révision pour Léa (`@acces`) | 28.11, 28.12 (tests unitaires) |
| 9 | La file de révision fait partie des données du profil enfant | L'export du profil contient les questions retenues, sans les réponses données (`@depend-de-14`) · La suppression du profil efface sa file de révision (`@depend-de-14`) | 28.20 |

Total : 9 règles, 39 scénarios (49 cas), dont 0 `@a-valider` (16 avant les décisions du PO), 5 `@acces` et 2 `@depend-de-14`.

Droits d'accès (`@acces`) :
- La file de révision et les séances de révision terminées sont de nouvelles données du profil enfant, sous RLS fondée sur le rattachement. Seul le serveur y écrit (décision 0016).
- Paul et Marie, rattachés, lisent la file de Léa (proposition sur leurs appareils). Le serveur l'écrit pour eux, par l'Edge Function, après contrôle du rattachement avec leur JWT.
- Claire, non rattachée, ne reçoit aucune ligne. Son envoi est refusé « comme pour un profil introuvable », mot pour mot comme une séance terminée (#24) et un test de départ (#27).
- Le scénario Léa / Tom vérifie que la lecture est filtrée par profil enfant, même entre deux enfants du même parent.
- L'enfant n'a aucun droit propre : tout passe par la session du parent sur l'appareil.

## Données de test

**Bibliothèque de test des révisions**, servie au navigateur **à la place** de la vraie bibliothèque, comme celles de #25 et #27. Identifiants préfixés `e2e-28-`. Chaque leçon a une étape de leçon et un seul exercice, sans `aide` (aide par défaut des bulles : « Essaie une autre bulle. ») :

| Leçon (matière, niveau, ordre) | Exercice | Questions | Sert à |
|---|---|---|---|
| « Les sons de révision » (français, CP, 10) | bulles « Les sons » | « Quel mot a le son ou ? » (loup, lit, sac → loup) ; « Quel mot a le son on ? » (pont, lune, vélo → pont) ; « Quel mot a le son an ? » (gant, bol, mur → gant) | retenir en séance, intervalles, fin |
| « Les nombres de révision » (maths, CP, 20) | bulles « Les doubles » | « Combien font 1 + 1 ? » à « Combien font 12 + 12 ? », 3 choix chacune | 10 au plus, ordre, nombre annoncé |
| « Le texte à trous de révision » (français, CP, 30) | trous « Au clair de la [lune] », distracteurs « plume », « porte » | rejouée seule : question à choix « Au clair de la … » (lune, plume, porte) | retenue une seule fois (défaut 2 du legacy) |

Le test de départ d'un CP sur cette bibliothèque pose 3 questions, une par leçon (règle 1, « Une question fausse au test de départ n'est jamais retenue »).

Ordre attendu du scénario « La séance de révision pose les 10 questions dues les plus anciennes… » : 11 questions dues (toutes sauf « 6 + 6 », due demain), triées par date de révision ; « 1 + 1 » (hier) est la 11e, donc non posée. Aucune égalité de date : le résultat ne dépend pas de l'ordre à égalité (28.19, tests unitaires).

### Le temps qui passe

Aucun step existant n'avance la date du jour. La fluence de #20 fige l'horloge du navigateur (`page.clock.setFixedTime`) ; #14 a une étape « nous sommes le … » non encore écrite.
- « Léa revient à son accueil le lendemain », « … `<n>` jours plus tard », « … plus tard le même jour » : l'horloge du navigateur avance au jour dit (par exemple à 10 h, heure de l'appareil ; « plus tard le même jour » : quelques heures, sans passer minuit), puis Léa revient à son accueil **sans recharger** l'application, comme « Léa revient à l'accueil par le nom de l'application ».
- Les dates de révision préparées (« aujourd'hui », « hier », « il y a 3 jours », « demain », « dans 5 jours ») sont relatives au jour de l'appareil au début du scénario.
- « le lendemain, l'accueil de Léa propose …, sur le téléphone de Paul » : même avance d'horloge sur la page du téléphone.

### Questions retenues préparées en base

Avec la clé `service_role` réservée à la préparation, directement dans les futures tables `files_de_revision` et `questions_retenues`, pour le profil réel de Léa (ou de Tom) :
- « Léa a pour questions retenues de la leçon « X » : » (tableau : `question`, `date de révision`, `intervalle de révision` facultatif, 1 jour par défaut). La clé de chaque question est calculée comme le domaine (`CleDeQuestion`) ; l'origine est la leçon `e2e-28-…`, la position de l'exercice et le type. Nombre de fois ratée : 1. Dernière erreur : la date de révision moins l'intervalle de révision.
- « Léa a `<n>` questions dues de la leçon « Les nombres de révision » » : les `n` premières questions de l'exercice, dues de « il y a `n` jours » (la 1re) à « hier » (la dernière).
- « Léa a pour question due la première question de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » » : une **vraie leçon** de la bibliothèque (`fr-cp-sons-ou-on-an`), due aujourd'hui, à l'intervalle de 1 jour, pour les scénarios où le serveur rejoue la séance de révision.

Comme pour `resultats_des_lecons` (#25) et le résultat du test de départ (#27), les identifiants `e2e-28-…` doivent être acceptés comme leçon d'origine.

### Serveur et leçons de test

- Le serveur ne connaît pas les leçons de test (#24, Q85). Il refuse une séance terminée ou une séance de révision terminée jouée sur la bibliothèque de test.
- L'accueil reflète tout de suite la séance finie, par la copie de la file mise à jour dans le navigateur (modèle, « Partage avec le front ») : l'application ne doit pas être rechargée entre la séance et ce qui en dépend.
- **Risque à vérifier par l'`e2e-tester`** : si l'accueil relit la file du serveur et efface la copie de l'appareil, les scénarios de la règle 1 joués dans l'interface échouent. C'est l'objet de la question 28.22 ; s'il faut, l'`e2e-tester` le signale.
- Les scénarios de la règle 8 qui écrivent (« l'appareil envoie pour Léa une séance terminée … », « … une séance de révision terminée … », « Claire envoie une séance de révision terminée … ») sont des **appels directs aux Edge Functions** `terminer-la-seance` et `terminer-la-seance-de-revision`, avec le JWT de Paul ou de Claire, sur la vraie leçon « Les sons ou, on, an » (Léa est donc de niveau CP).

Parents, enfants et appareils : Paul (tablette et téléphone) et Marie (téléphone), rattachés à Léa ; Claire (téléphone), non rattachée ; Tom, second enfant de Paul ; univers « Animaux de la forêt » : personnage guide Noisette.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … », « Marie est rattachée au profil enfant de Léa », « Claire est connectée sur le téléphone », « Léa choisit son profil enfant dans « Qui joue ? » », « Léa a choisi son profil enfant dans « Qui joue ? » », « Paul est dans l'espace parent ».
- Séance, aide, voix : « Léa répond « … » à la question « … » », « Léa dit « Je ne sais pas » », « la question « … » s'affiche », « la question « … » reste posée », « « Je ne sais pas » est proposé à Léa », « seul le choix « … » reste, et il brille », « Noisette dit un encouragement, suivi de « … » », « Noisette dit « … » », « Léa entend Noisette lire « … » », « Léa n'entend aucune étape de leçon ».
- Test de départ (#27) : « Léa a fait le test de départ, avec des questions fausses à « … », « … » et « … » », « l'écran s'intitule « … », avec « … » ».
- Parcours (#25) : « Léa a pour meilleures étoiles : », « Léa ouvre son parcours », « le parcours montre « … » réussie avec n étoiles », « Léa voit son accueil ».
- Réseau, accessibilité, droits, données : « le réseau est coupé », « elle voit le message « … » », « aucun message d'erreur n'apparaît », « Léa joue sur un ordinateur, au clavier », « le focus est sur « … » » (ici : « Accueil » de la fin de la séance de révision ; l'étape est propre à chaque story par son tag), « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « chaque choix mesure au moins 44 px de haut et de large », « « Je ne sais pas » mesure au moins 44 px de haut », « l'enregistrement est refusé », « l'enregistrement est refusé comme pour un profil introuvable », « Claire ne reçoit aucune donnée de Léa », « Paul exporte les données du profil enfant de Léa », « Paul a demandé la suppression du profil enfant de Léa », « Paul confirme la suppression du profil enfant de Léa ».

Extensions sans changement de sens :
- « l'écran s'intitule « … », avec « … » » lit aujourd'hui le sous-titre du test de départ : il doit aussi lire celui de la séance de révision.
- « Léa a fait le test de départ, … » et « Léa a pour meilleures étoiles : » doivent connaître la bibliothèque `e2e-28-`.
- Les étapes de réponse de #17 et #23 (« Léa répond … à la question … », « Léa dit « Je ne sais pas » », « seul le choix … reste ») doivent marcher dans la séance de révision.

Aucune étape existante n'est modifiée.

### Étapes nouvelles

- Données : « la bibliothèque de test des révisions est servie », « (Léa|Tom) a pour questions retenues de la leçon « … » : », « Léa a `<n>` questions dues de la leçon « … » », « Léa a pour question due la première question de l'exercice « … » de la leçon « … » », « la file de révision de Léa ne peut pas être lue ».
- Séance ordinaire : « Léa a terminé une séance de la leçon « … », en se trompant à « … » », « …, en disant « Je ne sais pas » à « … » », « …, sans erreur », « Léa a quitté une séance de la leçon « … » après s'être trompée à « … » ».
- Temps : « Léa revient à son accueil le lendemain », « Léa revient à son accueil `<n>` jours plus tard », « Léa revient à son accueil plus tard le même jour ».
- Proposition : « l'accueil de Léa propose la séance de révision, avec « … » », « l'accueil de Léa ne propose pas de séance de révision », « … sur le téléphone de Paul » (les deux formes), « le lendemain, l'accueil de Léa propose la séance de révision, avec « … », sur le téléphone de Paul », « la proposition de la séance de révision mesure au moins 44 px de haut », « Léa choisit son profil enfant sur le téléphone de Marie ».
- Séance de révision : « Léa commence la séance de révision(, au clavier seulement) », « Léa a commencé la séance de révision », « Léa en est à la question « … » de la séance de révision », « Léa a répondu juste à la question « … » de la séance de révision », « Léa a fait la séance de révision, `<déroulé>` » (« en répondant juste à toutes les questions », « en se trompant à « … » », « en disant « Je ne sais pas » à « … » » ; les questions non citées sont justes), « Léa répond juste à toutes les questions de la séance de révision », « Léa répond à la séance de révision, `<déroulé>` » (« juste à toutes les questions », « juste seulement à « … » », « en se trompant à toutes les questions »), « Léa quitte la séance de révision », « Léa a eu, dans l'ordre, les questions : », « ni « … » ni « … » ».
- Fin : « la fin de la séance de révision propose seulement « Accueil » », « la fin de la séance de révision ne montre aucune étoile », « Léa choisit « Accueil » à la fin de la séance de révision ».
- Serveur et droits : « l'appareil envoie pour Léa une séance terminée de l'exercice « … » de la leçon « … », avec une erreur à sa première question », « l'appareil envoie pour Léa une séance de révision terminée, juste à cette question », « l'appareil envoie pour Léa une séance de révision terminée `<cas>` », « Claire demande la file de révision du profil enfant de Léa », « Claire envoie une séance de révision terminée pour le profil enfant de Léa ».
- Données du profil (`@depend-de-14`) : « le fichier téléchargé contient la question retenue « … », avec sa leçon d'origine et sa date de révision », « aucune des réponses données par Léa » (forme de #24), « plus aucune question retenue ni aucune séance de révision de Léa n'est gardée par Savanturier ».

## Couvert par les tests unitaires (pas de scénario E2E)

- Limite de **250** questions retenues et oubli de celles dont la dernière erreur est la plus ancienne (28.3) ; le compteur d'erreurs corrigées pour de bon ne monte pas pour une question oubliée.
- **Ordre à égalité** de date de révision : dernière erreur, puis clé (28.19).
- **Jour** et fuseau : `jourDe(maintenant, decalage)`, minuit heure de l'appareil, cohérence du jour envoyé à 14 heures près (28.9). Une erreur à 23 h 50 est due à 0 h 00.
- **Revalidation** d'une séance de révision par le serveur (28.12) : plus de 10 questions, tirages, réponses après la réussite, jour incohérent, question absente de la file ou pas due ignorée, résultat plus ancien que la dernière erreur ignoré, **idempotence** par identifiant. L'E2E garde 2 cas de refus.
- **Même enregistrement** que la séance (28.11) : une séance renvoyée deux fois ne retient rien de plus.
- **Forme rejouée** de chaque type (28.13) : conjugaison, classer, texte à trous en question à choix ; addition en calcul en ligne, une seule question par addition ; boîte en boîte ; barres, dictée, lecture, écoute telles quelles ; `ordre`, `memoriser`, `fluence` jamais retenues. L'E2E ne joue que des bulles et un texte à trous.
- **Tirage** d'une question générée gardé dans l'origine (28.14).
- **Leçon retirée** de la bibliothèque, ou question introuvable : oubliée sans bruit (28.15).
- **Leçon d'origine** inchangée quand la question est ratée de nouveau (28.1, 28.18) : elle n'est pas visible par l'enfant (28.26) ; elle le sera dans le suivi du parent (lot 6).
- **Nombre de fois ratée** et compteur d'erreurs corrigées pour de bon (28.20) : pas affichés avant le lot 6.
- Leçons des classes d'avant ou d'une classe au-dessus, et changement de classe (28.5, 28.6) : même règle, sans distinction ; pas de scénario E2E.
- Envoi gardé sur l'appareil puis renvoyé au retour du réseau : même file d'envoi que la séance (#24) ; le serveur refuse les leçons de test, donc pas de scénario E2E.

## Hors périmètre

- Écran « Aujourd'hui » et sa tuile « À revoir » (#29) : elle remplacera la proposition de l'accueil de l'enfant (28.8). Les scénarios disent « l'accueil de Léa propose la séance de révision » : ils resteront vrais si #29 garde le nom « accueil de l'enfant » ou les adapte sans en changer le sens.
- **Série**, épisodes (#30, #33) : la séance de révision terminée publie `SeanceDeRevisionTerminee`, que ces stories écouteront pour compter le jour de séance (28.16). Aucun scénario ici.
- Suivi du parent (#34, #35) : compteur « erreurs corrigées pour de bon », conseil « Certaines erreurs reviennent souvent ». Les données sont gardées dès maintenant (28.20).
- Fusion de deux files modifiées sur deux appareils hors ligne, copie de la file au lancement sans réseau (lot 7, #44).
- Mots de la semaine (#37) : leurs séances terminées retiendront les mots ratés par la même règle.
- Export et suppression : scénarios écrits, tagués `@depend-de-14` tant que #14 n'est pas livrée.

## Décisions

Réponse du PO, le 2026-10-25 vers 10:06 UTC : « #28 reco OK » (annonce du responsable des équipes, https://github.com/SBA-dev/github-move/issues/64#issuecomment-6396299951). Toutes les recommandations sont retenues telles quelles. Le détail des questions 28.1 à 28.21 est dans `docs/stories/28/domain-model.md` (section « Questions ouvertes ») ; celui des questions 28.22 à 28.28 est rappelé plus bas.

| Question | Sujet | Décision (la recommandation) | Effet sur les scénarios |
|---|---|---|---|
| 28.1 | Défauts du legacy (leçon d'origine perdue, question retenue deux fois) | **Corrigés**, comme écarts voulus : la leçon d'origine ne change jamais, le résultat d'une révision s'applique par l'identité d'origine. | `@a-valider` retiré de « Une question de texte à trous ratée en séance de révision reste une seule question retenue ». Leçon d'origine vérifiée par les tests unitaires. |
| 28.2 | Étoiles de la séance de révision | **(b) retirées**. La fin montre une phrase du personnage guide sur les erreurs qui s'effacent, sans étoile ni nombre de fautes, et un seul bouton « Accueil ». | `@a-valider` retiré de « La fin de la séance de révision ne montre aucune étoile… », « Avec <justes> question(s) juste(s)… » et « Une séance de révision ne change pas les étoiles d'une leçon ». |
| 28.3 | Limite de 250 questions retenues | **Gardée** : on oublie celles dont la dernière erreur est la plus ancienne. La file est un agrégat par profil. | Tests unitaires. |
| 28.4 | « Je ne sais pas » | **Erreur retenue** en séance ; en séance de révision, il rend la question fausse (retour à 1 jour). | `@a-valider` retiré de « Une question ratée <manière> revient en révision le lendemain » et « Fausse en séance de révision (<cas>)… ». |
| 28.5 | Leçons des classes d'avant, personnelles, d'une classe au-dessus | **Retenues comme les autres** : toute séance terminée, quelle que soit sa leçon. | Tests unitaires. |
| 28.6 | Changement de classe | Les questions retenues **restent** dans la file. | Tests unitaires. |
| 28.7 | Termes | « Boîte » n'entre pas au domaine (on dit **Intervalle de révision**) ; nouveaux termes ajoutés au glossaire ; « Révision » redéfinie comme le mécanisme ; « Erreur » inchangée. | Glossaire (autre agent). |
| 28.8 | Accès avant « Aujourd'hui » (#29) | Bouton **« Je révise mes erreurs »** sur l'accueil de l'enfant, seulement s'il y a au moins une question due, avec « `<n>` petites erreurs des jours passés » (« 1 petite erreur… » au singulier, toutes les questions dues comptées) ; retour et « Accueil » mènent à l'accueil de l'enfant. | `@a-valider` retiré de « Avec <dues> question(s) due(s)… », « La séance de révision commence par la plus ancienne question due… », « Une séance de révision quittée en cours… » et « « Accueil » ramène à l'accueil… ». |
| 28.9 | Fuseau horaire | **(a)** : l'appareil envoie son jour (date locale de la fin), le serveur vérifie la cohérence avec l'heure de fin à 14 heures près. | Tests unitaires. |
| 28.10 | Stockage de la file | **Table propre** ; `questions_des_seances` reste l'histoire. | Aucun. |
| 28.11 | Mise à jour de la file après une séance ordinaire | **Même enregistrement, tout ou rien**, que la séance et le résultat de la leçon ; écriture optimiste (version de la file). | Tests unitaires. |
| 28.12 | Revalidation d'une séance de révision faite hors ligne | Refus de l'envoi entier seulement s'il est incohérent en lui-même ; question absente, non due ou de leçon disparue ignorée ; résultat plus ancien que la dernière erreur ignoré ; ordre non revérifié ; fusion au lot 7. | Tests unitaires ; 2 cas de refus en E2E. |
| 28.13 | Questions retenues et forme rejouée | **Oui au tableau** du modèle, boîte à jetons rejouée en boîte comprise ; `ordre`, `memoriser`, `fluence` jamais retenues. | Couvert par le scénario du texte à trous (28.1) et les tests unitaires. |
| 28.14 | Question générée | On retient son **tirage** ; jamais le texte entier d'une question de la bibliothèque. | Tests unitaires. |
| 28.15 | Leçon retirée ou texte changé | Question **oubliée sans bruit** à la prochaine séance de révision. | Tests unitaires. |
| 28.16 | La séance de révision est-elle une « séance » ? | Terme **Séance de révision** gardé ; « Séance » et « Jour de séance » précisés ; événement à part **`SeanceDeRevisionTerminee`**. | Glossaire (autre agent). |
| 28.17 | Question retenue réussie en séance ordinaire | **N'avance pas** : seule la séance de révision fait avancer une question. | `@a-valider` retiré de « Une question retenue réussie dans une séance ordinaire reste due ». |
| 28.18 | Question retenue ratée de nouveau en séance ordinaire | Retour à 1 jour, due le lendemain, nombre de fois ratée + 1 ; leçon d'origine inchangée. | `@a-valider` retiré de « Une question retenue, ratée de nouveau dans une séance, revient le lendemain ». |
| 28.19 | Ordre à égalité de date de révision | Date de révision, puis dernière erreur la plus ancienne, puis clé ; même ordre sur l'appareil et le serveur. | Tests unitaires. |
| 28.20 | Données pour le suivi du parent | **Gardées dès maintenant** : nombre de fois ratée par question et compteur d'erreurs corrigées pour de bon par profil. | Tests unitaires ; export (`@depend-de-14`). |
| 28.21 | Sans réseau, avant #44 | Comme le test de départ : sans file connue, pas de bouton ni de message ; séance de révision finie hors ligne gardée et renvoyée une seule fois grâce à son identifiant. | `@a-valider` retiré des 3 premiers scénarios de la règle 7. |
| 28.22 | Séance terminée pas encore enregistrée | **Oui**, ses questions ratées sont proposées le lendemain sur l'appareil ; la copie de la file réapplique les envois en attente. | `@a-valider` retiré de « Sans réseau, une question ratée est quand même proposée le lendemain sur l'appareil ». |
| 28.23 | Phrase de fin | 2 ou plus : « Bravo `<prénom>` ! `<n>` erreurs s'effacent un peu plus. » ; 1 : « Bravo `<prénom>` ! 1 erreur s'efface un peu plus. » ; 0 : « Merci `<prénom>` ! Ces erreurs reviendront demain : on les effacera ensemble. » | `@a-valider` retiré de « Avec <justes> question(s) juste(s), le personnage guide dit « <phrase> » ». |
| 28.24 | Dire à l'enfant qu'une erreur est corrigée pour de bon | **Pas dans cette story** (suivi du parent #34, Motivation #31 à #33). | Aucun scénario. |
| 28.25 | Plus de 10 questions dues | **Pas de deuxième séance enchaînée** ; l'accueil propose de nouveau la séance de révision avec les questions encore dues. | `@a-valider` retiré de « Après une séance de révision de 10 questions… ». |
| 28.26 | Leçon d'origine pendant la séance de révision | **Pas montrée** : ni étape ni titre de leçon. | Aucun ; maintien de la leçon d'origine en tests unitaires. |
| 28.27 | Avancement pendant la séance de révision | Le même que la séance (récipient, questions réussies sur questions posées, au plus 10). | Aucun scénario. |
| 28.28 | Titre, sous-titre, phrase d'accueil | Ceux du legacy : « Je révise mes erreurs », « Révision », « On révise les petites erreurs des jours passés. Chaque fois que tu réussis, l'erreur s'efface un peu plus ! » | `@a-valider` retiré de « La séance de révision commence par la plus ancienne question due, sans étape de leçon ». |

### Rappel des questions 28.22 à 28.28

Les questions **28.1 à 28.21** sont dans `docs/stories/28/domain-model.md`, chacune avec sa recommandation. Les scénarios suivent ces recommandations ; ceux qui en dépendaient portaient `@a-valider` (28.1, 28.2, 28.4, 28.8, 28.13, 28.17, 28.18, 28.21). Les autres (28.3, 28.5, 28.6, 28.7, 28.9 à 28.12, 28.14 à 28.16, 28.19, 28.20) ne touchent que les tests unitaires ou le glossaire.

Questions ajoutées par les critères d'acceptance (texte d'origine, recommandation retenue) :

**28.22. Une séance terminée pas encore enregistrée par le serveur** (sans réseau, ou envoi en échec) : ses questions ratées sont-elles proposées le lendemain sur l'appareil ?
- **Recommandation** : **oui**. La copie de la file sur l'appareil est mise à jour dès la fin de la séance ; quand l'appareil relit la file du serveur, il y réapplique les séances et séances de révision gardées en attente d'envoi, comme les meilleures étoiles « gagnées pendant l'utilisation » (#24). Sur un autre appareil, les questions n'apparaissent qu'après l'envoi. Scénario : « Sans réseau, une question ratée est quand même proposée le lendemain sur l'appareil ».

**28.23. Phrase de fin de la séance de révision, au singulier et sans question juste.** La recommandation 28.2 propose « Bravo Léa ! 3 erreurs s'effacent un peu plus. »
- **Recommandation** : selon le nombre de questions justes :
  - 2 ou plus : « Bravo `<prénom>` ! `<n>` erreurs s'effacent un peu plus. » ;
  - 1 : « Bravo `<prénom>` ! 1 erreur s'efface un peu plus. » ;
  - 0 : « Merci `<prénom>` ! Ces erreurs reviendront demain : on les effacera ensemble. » (jamais punitif).
- Phrases dites par le personnage guide (Motivation), précédées d'une félicitation ou non : validées avec 28.2 et 28.23.

**28.24. Dire à l'enfant qu'une erreur est corrigée pour de bon ?** Le legacy ne le dit qu'au parent (suivi).
- **Recommandation** : **pas dans cette story**. La phrase de fin reste simple (28.23). Le compteur appartient au suivi du parent (#34) ; une récompense visible pour l'enfant relèverait de Motivation (badges, #31 à #33). Aucun scénario.

**28.25. Plus de 10 questions dues : enchaîner une deuxième séance de révision ?**
- **Recommandation** : **non**, comme le legacy. La fin propose seulement « Accueil » ; l'accueil propose de nouveau la séance de révision avec le nombre de questions encore dues (« 2 petites erreurs des jours passés »). Scénario : « Après une séance de révision de 10 questions, l'accueil propose les questions dues qui restent ».

**28.26. Montrer la leçon d'origine pendant la séance de révision ?**
- **Recommandation** : **non**, comme le legacy : la séance de révision n'a ni étape de leçon ni titre de leçon. La leçon d'origine sert au suivi du parent (lot 6) et à rejouer la question. Conséquence : son maintien (28.1) est vérifié par les tests unitaires, pas en E2E.

**28.27. Avancement pendant la séance de révision.**
- **Recommandation** : le même avancement que la séance (récipient, nombre de questions réussies sur le nombre de questions posées, au plus 10), comme le test de départ (27.20). Aucun scénario.

**28.28. Titre, sous-titre et phrase d'accueil de la séance de révision.**
- **Recommandation** : ceux du legacy. Titre « Je révise mes erreurs », sous-titre « Révision ». Le personnage guide dit : « On révise les petites erreurs des jours passés. Chaque fois que tu réussis, l'erreur s'efface un peu plus ! » Scénario : « La séance de révision commence par la plus ancienne question due, sans étape de leçon ».

## Questions ouvertes

Aucune.
