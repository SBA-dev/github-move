# Critères d'acceptance : issue #30, Série

Scénarios : `features/30-serie.feature` (tags `@issue-30 @wip`).
Modèle du domaine : `docs/stories/30/domain-model.md` (contexte **Motivation**, qui lit **Apprentissage** et **Famille**). Les questions 30.1 à 30.12 en viennent ; 30.13 et 30.14 sont ajoutées ici.

Le PO a retenu toutes les recommandations des questions 30.1 à 30.14 (« OK #29 #30 reco partout », 2026-10-25, relayé par le responsable des équipes sur les issues #29 et #30). Voir « Décisions ».

Cadrage anticipé (décision 0020, point 6) : rien n'est codé avant le merge de #28 (jour de l'appareil, séance de révision, étapes de temps) et de #29 (accueil de l'enfant, place de la pastille). Les scénarios qui dépendent d'une décision portent un commentaire `# Réponse 30.n` ; aucun ne porte plus `@a-valider`.

## Objectif

En tant qu'**enfant**, je veux voir combien de jours d'affilée j'ai joué, afin d'avoir envie de revenir un peu chaque jour.

La **série** compte les **jours de séance** consécutifs, jusqu'à aujourd'hui ou hier. Un jour de séance est un jour où l'enfant a terminé au moins une **séance** ou une **séance de révision** (28.16) ; le **test de départ** n'en donne pas (27.4). La série est calculée dans le navigateur à chaque affichage de l'**accueil de l'enfant**, à partir des jours des séances terminées et des séances de révision terminées lues sous RLS, plus celles gardées sur l'appareil. Elle n'est jamais enregistrée.

La **pastille de série**, sous « Bonjour `<prénom>` ! », la dit à l'enfant :
- 0 : « Une petite leçon pour bien commencer ? » ;
- 1, joué aujourd'hui : « Tu as joué aujourd'hui ! » ;
- 1, jusqu'à hier : « Tu as joué hier. Une petite leçon aujourd'hui ? » (réponse 30.1) ;
- 2 ou plus : « `<n>` jours d'affilée, bravo ! », jusqu'à aujourd'hui comme jusqu'à hier (réponse 30.1).

La série ne lit pas les étoiles, ne modifie aucune note et n'impose rien : ni objectif, ni durée, ni message quand elle casse (décision 0005).

Le comportement actuel (`app/`, `Days`, `Days.streak()`, pastille de l'accueil) donne les premiers exemples. Écart voulu, retenu par le PO (30.1) : le défaut « Tu as joué aujourd'hui ! » quand l'enfant a joué hier seulement (30.1).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. La série compte les jours d'affilée avec au moins une séance, jusqu'à aujourd'hui ou hier ; la pastille le dit | aucune séance → « Une petite leçon pour bien commencer ? » · aujourd'hui → « Tu as joué aujourd'hui ! » · aujourd'hui, hier, avant-hier → « 3 jours d'affilée, bravo ! » · aujourd'hui, J-2, J-3 → « Tu as joué aujourd'hui ! » · hier et avant-hier → « 2 jours d'affilée, bravo ! » · hier seulement → « Tu as joué hier. Une petite leçon aujourd'hui ? » · 5 jours d'affilée finis il y a 2 jours → « Une petite leçon pour bien commencer ? », sans rappel · application restée ouverte : le lendemain → 2, deux jours plus tard → 0 |
| 2. Une séance terminée ou une séance de révision terminée fait un jour de séance, quelles que soient la leçon et les étoiles ; ni le test de départ ni une séance quittée | séance à 1 étoile = séance à 3 étoiles · un seul exercice · leçon rejouée · leçon des classes d'avant · deux séances le même jour → un jour · test de départ fini → 0 · séance quittée après 3 questions → 0 · séance de révision aujourd'hui → compte · révisions aujourd'hui et hier + séance J-2 → 3 |
| 3. Le jour d'une séance est celui de l'appareil à la fin ; sans réseau, elle compte tout de suite et garde son jour | séance sans réseau → compte au retour à l'accueil · séance finie hors ligne lundi, envoyée mardi → compte pour lundi sur le téléphone de Paul · sans réseau et jours inconnus → pas de pastille, sans message |
| 4. La pastille se lit à voix haute, tient à 360 px, reste immobile en mouvements réduits | « tout lire » → « Bonjour Léa ! 3 jours d'affilée, bravo ! » en une seule lecture · sans « tout lire » → pastille non lue · lecteur d'écran lit le texte, pas la flamme · 360 px · flamme immobile |
| 5. Seuls les parents rattachés lisent les jours de séance ; chaque enfant a sa série | Marie voit la même série · les séances de Tom ne comptent pas pour Léa · Claire ne reçoit rien |

## Règles

| # | Règle | Scénarios | Réponses |
|---|---|---|---|
| 1 | La série compte les jours d'affilée avec au moins une séance, jusqu'à aujourd'hui ou hier, et la pastille de série le dit à l'enfant | Sans aucune séance, la pastille de série propose une petite leçon · Avec une séance <jours>, la pastille de série dit « <texte> » (3 cas : aujourd'hui seulement ; aujourd'hui, hier et avant-hier ; aujourd'hui puis un trou) · Sans séance aujourd'hui, la série jusqu'à hier est gardée et la pastille dit « <texte> » (2 cas) · Un jour sans séance remet la série à zéro, sans rappel de la série perdue · L'accueil met la série à jour quand Léa revient <quand>, sans recharger l'application (2 cas) | 30.1, 30.2, 30.10, 30.11 |
| 2 | Une séance terminée ou une séance de révision terminée fait un jour de séance, quelles que soient la leçon et les étoiles ; ni le test de départ ni une séance quittée n'en font un | Une séance terminée aujourd'hui compte tout de suite pour la série, <cas> (4 cas : 1 étoile, 3 étoiles, un seul exercice, leçon rejouée) · Une séance d'une leçon des classes d'avant compte pour la série · Deux séances le même jour comptent pour un seul jour · Le test de départ ne compte pas pour la série · Une séance quittée avant la fin ne compte pas pour la série · Une séance de révision terminée aujourd'hui compte tout de suite pour la série (`@depend-de-28`) · Les séances de révision et les séances terminées comptent ensemble pour la série (`@depend-de-28`) | 30.4, 30.13 ; tranchés : 27.4, 28.16, #24 |
| 3 | Le jour d'une séance est celui de l'appareil à la fin de la séance ; sans réseau, la séance compte tout de suite et garde son jour | Sans réseau, une séance terminée compte tout de suite pour la série · Une séance gardée sur l'appareil compte pour le jour où elle a été finie, même envoyée le lendemain · Sans réseau ni jours de séance connus, l'accueil n'affiche pas de pastille de série, sans message d'erreur | 30.1, 30.3, 30.6, 30.9 ; tranché : 28.9 |
| 4 | La pastille de série se lit à voix haute, tient dans un petit écran et reste immobile avec les mouvements réduits | Avec « tout lire à voix haute », le personnage guide dit la salutation et la pastille de série en une seule lecture (`@depend-de-29`) · Sans « tout lire à voix haute », le texte de la pastille de série n'est pas lu · Un lecteur d'écran lit le texte de la pastille de série, sans la flamme · La pastille de série tient dans un écran de 360 px de large · Avec les mouvements réduits, la flamme de la pastille de série ne bouge pas | 30.14 ; 29.10 f |
| 5 | Seuls les parents rattachés au profil enfant lisent ses jours de séance, et chaque enfant a sa propre série | Le second parent rattaché voit la même série sur son téléphone (`@acces`) · Les séances d'un autre enfant ne comptent pas dans la série de Léa (`@acces`) · Un parent qui n'est pas rattaché ne lit pas les jours de séance de Léa (`@acces`) | 30.5 (pas d'effet sur le texte des scénarios) |

Total : 5 règles, 23 scénarios (30 cas), dont 0 `@a-valider` (tous retirés le 2026-10-25), 3 `@acces`, 2 `@depend-de-28` et 1 `@depend-de-29`.

Droits d'accès (`@acces`) :
- Avec la réponse 30.5 (a), la série ne crée aucune donnée : elle lit les séances terminées (#24) et les séances de révision terminées (#28), déjà sous RLS fondée sur le rattachement.
- Marie, rattachée, voit la même série que sur la tablette de Paul : la série vient des faits enregistrés, pas de l'appareil.
- Claire, non rattachée, ne reçoit aucune ligne de ces deux tables pour Léa (lecture directe avec son JWT).
- Le scénario Léa / Tom vérifie que la lecture est filtrée par profil enfant, même entre deux enfants du même parent.
- Motivation n'écrit rien : aucun scénario d'écriture refusée. L'enfant n'a aucun droit propre.

`@depend-de-29` : la pastille se place sous la salutation, qui existe déjà sur l'accueil actuel (« Noisette dit « Bonjour Léa ! » », #11). Seul le scénario « tout lire » suppose #29 : il s'appuie sur le défaut corrigé 29.10 f (salutation dite une seule fois à l'arrivée). Les autres scénarios restent vrais sur l'accueil actuel comme sur celui de #29.

## Données de test

Bibliothèque : la vraie bibliothèque, plus les leçons de test de #24, « Les sons de test » et « La suite de test » (même étape « les leçons de test … sont dans la bibliothèque »). Deux scénarios remplacent la bibliothèque, chacun par la sienne :
- « Le test de départ ne compte pas pour la série » : bibliothèque de test du test de départ (`e2e-27-`) ; Léa, de niveau CP, y a 9 questions ;
- « Une séance de révision terminée aujourd'hui compte tout de suite… » : bibliothèque de test des révisions (`e2e-28-`).

Séances préparées en base, avec la clé `service_role` réservée à la préparation, comme #27 et #28, pour le profil réel :
- « (Léa|Tom) a terminé une séance chacun de ces jours : `<liste>` » : une séance terminée par jour cité, de la vraie leçon « Les sons ou, on, an » (`fr-cp-sons-ou-on-an`), avec 2 étoiles. Sa date de fin est ce jour-là à 10 h, heure de l'appareil ; son jour (réponse 30.6) est ce jour-là. La liste se lit « aujourd'hui », « hier », « il y a `<n>` jours », séparés par des virgules et un « et » final.
- « Léa a terminé une séance de révision chacun de ces jours : `<liste>` » (`@depend-de-28`) : une séance de révision terminée par jour cité, dans `seances_de_revision_terminees`, avec son `jour`.
- « Léa n'a terminé aucune séance » : rien n'est préparé (l'étape rend lisible le point de départ).
- Les jours sont relatifs au jour de l'appareil au début du scénario.

Séances jouées dans l'interface (aujourd'hui) :
- sur la vraie leçon « Les sons ou, on, an », par l'étape de #24 « Léa a gagné 2 étoiles à la leçon « … »(…, sans réseau) » : le serveur l'enregistre, ou elle reste gardée sur l'appareil sans réseau ;
- sur la leçon de test « Les sons de test », par les étapes de #24 et #25 (« … avec `<n>` étoile(s) », « … de l'exercice « Premières bulles » seul »). **Le serveur refuse les leçons de test** (#24, Q85) : la séance compte sur l'appareil pendant l'utilisation (réponse 30.13). Si un refus l'efface de l'appareil, l'`e2e-tester` le signale.
- Avec « Léa a gagné 2 étoiles … sur la tablette, sans réseau », les jours de séance doivent avoir été lus avant la coupure (Léa passe par son accueil avant d'ouvrir la leçon). Sinon, l'`e2e-tester` le signale (30.9).

Le temps qui passe (étapes de #28, reprises mot pour mot) : « Léa revient à son accueil le lendemain », « … `<n>` jours plus tard » avancent l'horloge du navigateur au jour dit (10 h, heure de l'appareil), sans recharger l'application. « le réseau revient sur la tablette le lendemain » avance l'horloge de toutes les pages du scénario (tablette et téléphone de Paul), puis rétablit le réseau de la tablette.

Parents, enfants et appareils : Paul (tablette et téléphone) et Marie (téléphone), rattachés à Léa ; Claire (téléphone), non rattachée ; Tom, second enfant de Paul ; univers « Animaux de la forêt » : personnage guide Noisette.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … », « Marie est rattachée au profil enfant de Léa », « Claire est connectée sur le téléphone », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « Léa choisit son profil enfant dans « Qui joue ? » », « Léa a choisi son profil enfant dans « Qui joue ? » », « Léa revient à l'accueil par le nom de l'application », « Paul a réglé « … » sur « … » pour Léa », « le réglage « … » de Léa est sur « … » ».
- Séance (#16, #24, #25) : « les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque », « Léa a terminé une séance de la leçon « … » avec n étoile(s) », « Léa a terminé une séance de l'exercice « … » seul », « Léa a gagné 2 étoiles à la leçon « … »( sur la tablette, sans réseau) », « Léa a quitté la séance complète de la leçon « … » après n questions réussies ».
- Test de départ (#27) : « la bibliothèque de test du test de départ est servie », « Léa a fait le test de départ, en répondant juste à toutes les questions ».
- Révisions (#28) : « la bibliothèque de test des révisions est servie », « Léa a `<n>` questions dues de la leçon « … » », « Léa a fait la séance de révision, en répondant juste à toutes les questions », « Léa choisit « Accueil » à la fin de la séance de révision », « Léa choisit son profil enfant sur le téléphone de Marie », « Léa revient à son accueil le lendemain », « Léa revient à son accueil `<n>` jours plus tard ».
- Voix, accessibilité, réseau, droits : « Léa entend Noisette lire « … » », « Léa n'entend pas Noisette lire « … » » (#65), « les lecteurs d'écran annoncent « … » » (#25, #65), « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « l'appareil demande des mouvements réduits », « Savanturier a déjà été chargé une fois sur la tablette », « le réseau est coupé », « aucun message d'erreur n'apparaît », « Claire ne reçoit aucune donnée de Léa ».

Extensions sans changement de sens :
- « les lecteurs d'écran annoncent « … » » existe en deux versions (#25 sans tag, #65 limitée à `@issue-65`) : celle de #25 doit aussi lire la pastille de l'accueil.
- « Léa a gagné 2 étoiles … sur la tablette, sans réseau » et les étapes de #28 doivent marcher avec la bibliothèque de #24 (leçons de test ajoutées).
- « Léa choisit son profil enfant sur le téléphone de Marie » : les `Alors` qui suivent regardent la page du téléphone de Marie.

Aucune étape existante n'est modifiée.

### Étapes nouvelles

- Données : « (Léa|Tom) a terminé une séance chacun de ces jours : `<liste>` », « Léa a terminé une séance de révision chacun de ces jours : `<liste>` », « Léa n'a terminé aucune séance ».
- Temps et réseau : « le réseau revient sur la tablette le lendemain ».
- Pastille : « la pastille de série dit « … » », « la pastille de série dit « … » sur le téléphone de Paul » (Léa choisie dans « Qui joue ? » sur le téléphone), « l'accueil de Léa n'affiche pas de pastille de série ».
- Accessibilité : « Léa entend la salutation une seule fois », « la flamme de la pastille de série est cachée aux lecteurs d'écran », « le texte « … » de la pastille de série se lit en entier » (ni coupé ni caché, sur une ou plusieurs lignes), « la flamme de la pastille de série ne bouge pas ».
- Droits : « Claire demande les jours de séance du profil enfant de Léa » (lecture directe de `seances_terminees` et `seances_de_revision_terminees` avec le JWT de Claire).

## Couvert par les tests unitaires (pas de scénario E2E)

Fonctions pures de `motivation/domain/` (`JoursDeSeance`, `serieDeJours`, `texteDeLaPastille`, `saluerAvecLaSerie`) :
- tableau d'exemples du modèle (aucun jour, J, J/J-1/J-2, J-1/J-2, J-1, J-2, J/J-2/J-3) et longue série (« 365 jours d'affilée, bravo ! ») ;
- **union sans doublon** des trois sources (séances terminées, séances de révision terminées, séances gardées sur l'appareil) ; une séance gardée puis lue sur le serveur ne compte qu'une fois (identifiant de séance) ;
- **jour futur** (horloge reculée, autre fuseau) ignoré, sans erreur (30.8) ;
- **changement d'heure** : un jour de 23 ou 25 heures compte pour un (30.8) ;
- **séance finie après minuit** : elle compte pour le jour de la fin (30.7), par `jourDe(maintenant, decalage)` de #28 ;
- **séance gardée sur l'appareil** envoyée plus tard : son jour ne change pas (30.3) ; cohérence du jour envoyé avec la date de fin, à 14 heures près (28.9, côté Apprentissage, réponse 30.6) ;
- texte de la pastille pour chaque cas, `saluerAvecLaSerie` (« Bonjour Léa ! » suivi du texte) ;
- leçon d'une classe au-dessus, mots de la semaine et leçons personnelles (30.4) : toute séance terminée compte, sans distinction de leçon ; pas de scénario E2E (lot 6 non livré).

## Hors périmètre

- Épisodes (#33), badges (#31), cabane (#32), zone « nouveautés » de l'écran de fin : ils liront les mêmes jours de séance.
- Objectif du jour (#29, 29.3).
- Suivi et rapport de la semaine (#34, #35) : jours joués sur 7, nombre de séances, minutes jouées.
- Copie des données sur l'appareil pour un lancement sans réseau (#44) : avant, la pastille n'est pas affichée sans réseau ni jours connus (30.9).
- Écran de fin et « Mes médailles » : la pastille n'y est pas (30.11).
- Export et suppression : aucune donnée nouvelle (réponse 30.5 (a)) ; les séances terminées et les séances de révision terminées sont déjà couvertes par #14, #24 et #28. Avec la réponse 30.6, le jour s'ajoute à la séance terminée dans l'export (#14), sans scénario ici.
- Reprise des jours des séances déjà enregistrées sans jour (30.6) : migration (sous verrou `base`), vérifiée par l'`implementer`, pas en E2E.

## Décisions

Réponse du PO, le 2026-10-25 : « OK #29 #30 reco partout » (relayée par le responsable des équipes sur les issues #29 et #30). Toutes les recommandations sont retenues. Le détail des questions 30.1 à 30.12 est dans `docs/stories/30/domain-model.md` (section « Questions ouvertes ») ; 30.13 et 30.14 sont rappelées ci-dessous.

| n° | Question | Réponse | Effet sur les scénarios et les documents |
|---|---|---|---|
| 30.1 | Joué hier, pas encore aujourd'hui | Série 1 jusqu'à hier : « Tu as joué hier. Une petite leçon aujourd'hui ? » ; 2 ou plus jusqu'à hier : « `<n>` jours d'affilée, bravo ! ». Aucun mot punitif. | `@a-valider` retiré de « Sans séance aujourd'hui, la série jusqu'à hier est gardée… », « L'accueil met la série à jour quand Léa revient… » et « Une séance gardée sur l'appareil compte pour le jour où elle a été finie… ». Description du `.feature` complétée par le texte « Tu as joué hier… ». |
| 30.2 | Règle « jusqu'à aujourd'hui ou hier » | Oui ; « (à valider) » retiré de **Série** au glossaire. | `@a-valider` retiré de « Sans séance aujourd'hui, la série jusqu'à hier est gardée… ». |
| 30.3 | Séance hors ligne envoyée plus tard | Elle garde le jour de l'appareil à sa fin ; renvoyée deux fois, elle ne compte qu'une fois. | `@a-valider` retiré de « Une séance gardée sur l'appareil compte pour le jour où elle a été finie… ». |
| 30.4 | Ce qui compte | Toute séance terminée : complète, d'un exercice, rejouée, classes d'avant, classe au-dessus, toutes étoiles ; plus tard mots de la semaine et leçons personnelles. | `@a-valider` retiré de « Une séance terminée aujourd'hui compte tout de suite… » et « Une séance d'une leçon des classes d'avant… ». |
| 30.5 | Qui possède les jours de séance ? | **(a)** Apprentissage, sans nouveau journal : les jours se lisent dans les séances terminées et les séances de révision terminées. | Aucun effet sur le texte des scénarios ; aucune table nouvelle. |
| 30.6 | Garder le jour de la séance terminée | Oui : **nouvelle colonne de jour sur les séances terminées**, envoyée par l'appareil et vérifiée comme en 28.9 ; les séances déjà enregistrées prennent le jour de leur date de fin à l'heure de Paris, une seule fois. **Migration sous verrou `base`** au moment du code. La réponse vaut aussi pour l'**objectif du jour de #29** (et sa leçon du jour) : #29 et #30 lisent le même jour, au lieu de le recalculer avec le fuseau actuel de l'appareil. | `@a-valider` retiré de « Une séance gardée sur l'appareil compte pour le jour où elle a été finie… ». Données de test : le jour est préparé avec chaque séance. Export (#14) : le jour s'ajoute. Note de renvoi dans `docs/stories/29/acceptance.md`. |
| 30.7 | Séance finie après minuit | Jour de la fin. | Tests unitaires. |
| 30.8 | Horloge fausse, voyage, changement d'heure | Jour futur ignoré sans erreur ; un jour du calendrier compte pour un ; aucune correction d'un voyage. | Tests unitaires. |
| 30.9 | Sans réseau, jours inconnus | Pas de pastille, sans message ; si les jours ont été lus plus tôt, la pastille reste. | `@a-valider` retiré de « Sans réseau ni jours de séance connus… ». |
| 30.10 | Série cassée | Même texte qu'un nouveau profil, aucun rappel de la série perdue. | `@a-valider` retiré de « Un jour sans séance remet la série à zéro… ». |
| 30.11 | Où et quand la pastille s'affiche | Seulement sur l'accueil de l'enfant, sous « Bonjour `<prénom>` ! », recalculée à chaque arrivée, y compris après minuit sans recharger. | `@a-valider` retiré de « L'accueil met la série à jour quand Léa revient… ». |
| 30.12 | Termes | « Pastille de série » : mot d'interface ; « Série jusqu'à hier » : état de la série, pas un terme. Les deux lignes `(à valider)` du glossaire sont retirées ou notées « interface ». | Aucun changement de texte. |
| 30.13 | Une séance refusée par le serveur compte-t-elle sur l'appareil ? | Oui, **pendant l'utilisation** ; après un rechargement, seuls les jours connus du serveur et les séances encore gardées sur l'appareil comptent. Aucun message à l'enfant. | `@a-valider` retiré de « Une séance terminée aujourd'hui compte tout de suite… » (cas joués sur « Les sons de test »). |
| 30.14 | Sans « tout lire à voix haute », la pastille est-elle lue ? | Non : le personnage guide dit seulement « Bonjour `<prénom>` ! » ; un lecteur d'écran lit la pastille. Avec « tout lire », une seule lecture « Bonjour `<prénom>` ! `<pastille>` ». | `@a-valider` retiré de « Sans « tout lire à voix haute », le texte de la pastille de série n'est pas lu ». |

## Questions ouvertes

Aucune.
