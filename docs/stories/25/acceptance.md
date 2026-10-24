# Critères d'acceptance : issue #25, Parcours par matière et verrous

Scénarios : `features/25-parcours-par-matiere-et-verrous.feature` (tags `@issue-25 @wip`).
Modèle du domaine : `docs/stories/25/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** et **Famille**).
Numérotation des questions : propre à #25 (première story du lot 4). La correspondance avec les numéros du modèle du domaine est donnée pour chaque question.

## Objectif

En tant qu'**enfant**, je veux voir le **parcours** de chaque **matière** de ma classe, leçon après leçon, avec la **prochaine leçon** mise en avant, afin d'apprendre dans le bon ordre sans me perdre.

Le parcours est calculé par le domaine (`@domain/apprentissage`), dans le navigateur, à partir des leçons de la bibliothèque, du **niveau** et du réglage **parcours libre** du profil enfant, et des **meilleures étoiles** enregistrées par #24 (lues sous RLS). Rien de nouveau n'est écrit en base.

Comportement actuel (`app/`, `subjectPath`, onglet `parcours` de `showMap`, `nextAfter`) repris comme premiers exemples. Écarts proposés : libellé « Leçon n » au lieu de « Étape n » (question 8), texte lu par un lecteur d'écran qui dit le nombre d'étoiles (question 7), message sans « espace adulte » (question 9), retour vers l'accueil de l'enfant (question 10), onglets limités aux matières qui ont des leçons du niveau (question 4), « Leçon suivante » sans repli sur une autre matière (question 2).

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Le parcours d'une matière montre, dans l'ordre, ses leçons du niveau de l'enfant ; seules ces matières ont un onglet | CE1 : « Français · CE1 », 4 leçons dans l'ordre, ni CP ni CE2 · CE1 → onglets Français, Maths ; CE2 → Français, Vivre ensemble · sciences (CP seulement) : pas d'onglet pour un CE1 · CM2 sans leçon : « Aucune leçon pour ta classe pour l'instant. » · ouverture sur le français, puis sur la dernière matière choisie · retour vers l'accueil · « Leçon 1 » à « Leçon 4 » |
| 2. La prochaine leçon est la première leçon non réussie ; les leçons non réussies après elle sont verrouillées, sauf en parcours libre | sans progression : 1 à toi, 2 à 4 plus tard · après 1 étoile à la 1 : la 2 à toi · 1 et 3 réussies : 2 à toi, 4 plus tard · tout réussi : plus de « À toi ! » · chaque matière a sa prochaine leçon · parcours libre : 2 à toi, 3 et 4 à découvrir |
| 3. Une leçon verrouillée ne s'ouvre pas ; la prochaine leçon, une leçon réussie ou une leçon à découvrir s'ouvre | prochaine leçon → page de la leçon · leçon réussie → page de la leçon · leçon verrouillée au toucher et au clavier → reste sur le parcours · parcours libre : leçon à découvrir → page de la leçon · adresse directe d'une leçon verrouillée → parcours |
| 4. Le parcours compte les leçons réussies du niveau de l'enfant, et seulement elles | 0 / 1 (singulier) / 3 / 4 (pluriel) sur 4 · étoiles du CP et du CE2 non comptées pour un CE1 |
| 5. Changer de classe garde les étoiles ; le parcours de la nouvelle classe commence à sa première leçon non réussie | CE1 → CE2 avec « Le futur » déjà réussie : « L'imparfait » à toi · CE1 → CE2 → CE1 : « Le son in » toujours à 2 étoiles |
| 6. À la fin d'une séance, la leçon suivante est la première leçon d'après, dans le parcours, que l'enfant peut commencer | 2 réussie, séance de la 1 → « Ensuite : Les mots contraires » · séance de la 2 alors que la 1 n'est pas réussie → pas de leçon suivante |
| 7. Le parcours se lit sans réseau, au lecteur d'écran, au clavier et sur un petit écran | séance sans réseau puis parcours à jour · annonces « Le son in : réussie, 2 étoiles sur 3 », « … : à toi ! », « … : verrouillée, plus tard » · flèche → onglet Maths · 360 px et cibles de 44 px |
| 8. Seul un parent rattaché au profil enfant lit la progression qui fait le parcours | Marie retrouve le parcours de Léa · les étoiles de Tom ne passent pas dans le parcours de Léa · Claire ne lit rien |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | Le parcours d'une matière montre, dans l'ordre, ses leçons du niveau de l'enfant ; seules ces matières ont un onglet | Le parcours de français d'un enfant de CE1 montre les leçons de français du CE1, dans l'ordre · Un enfant de <niveau> a un onglet pour chaque matière qui a des leçons de son niveau (2 cas : CE1, CE2 ; `@a-valider`) · Une matière qui n'a que des leçons des classes d'avant n'a pas d'onglet (`@a-valider`) · Sans aucune leçon pour sa classe, l'enfant lit qu'il n'y en a pas encore (`@a-valider`) · Le parcours s'ouvre sur le français (`@a-valider`) · Le parcours se rouvre sur la dernière matière choisie (`@a-valider`) · Depuis le parcours, le retour ramène à l'accueil de l'enfant (`@a-valider`) · Chaque leçon du parcours porte sa place (`@a-valider`) | 4, 8, 9, 10, 11 |
| 2 | La prochaine leçon est la première leçon non réussie ; les leçons non réussies après elle sont verrouillées, sauf en parcours libre | Sans progression, la première leçon est la prochaine leçon et les suivantes sont verrouillées · Après une séance d'au moins 1 étoile, la leçon d'après devient la prochaine leçon · Une leçon réussie placée après une leçon non réussie reste ouverte, les autres restent verrouillées (`@a-valider`) · Quand toutes les leçons du parcours sont réussies, il n'y a plus de prochaine leçon · Chaque matière a sa propre prochaine leçon · En parcours libre, rien n'est verrouillé et la prochaine leçon reste marquée (`@a-valider`) | 1, 5, 16 |
| 3 | Une leçon verrouillée ne s'ouvre pas ; la prochaine leçon, une leçon réussie ou une leçon à découvrir s'ouvre | La prochaine leçon s'ouvre depuis le parcours · Une leçon réussie s'ouvre pour être rejouée · Une leçon verrouillée ne s'ouvre pas <moyen> (2 cas : au toucher, au clavier) · En parcours libre, une leçon à découvrir s'ouvre (`@a-valider`) · Une leçon verrouillée demandée par son adresse montre le parcours à la place (`@a-valider`) | 3, 5 |
| 4 | Le parcours compte les leçons réussies du niveau de l'enfant, et seulement elles | Avec <réussies> leçon(s) réussie(s), le parcours indique « <compteur> » (4 cas : 0, 1, 3, 4) · Les leçons réussies d'un autre niveau ne comptent pas | — |
| 5 | Changer de classe garde les étoiles ; le parcours de la nouvelle classe commence à sa première leçon non réussie | En passant du CE1 au CE2, le parcours de français commence à la première leçon de CE2 non réussie · Revenue au CE1, l'enfant retrouve les étoiles de ses leçons de CE1 (`@a-valider`) | 12 |
| 6 | À la fin d'une séance, la leçon suivante est la première leçon d'après, dans le parcours, que l'enfant peut commencer | La leçon suivante saute les leçons déjà réussies (`@a-valider`) · Une leçon verrouillée n'est jamais proposée comme leçon suivante (`@a-valider`) | 2 |
| 7 | Le parcours se lit sans réseau, au lecteur d'écran, au clavier et sur un petit écran | Sans réseau, le parcours se met à jour après une séance (`@a-valider`) · Un lecteur d'écran lit l'état de chaque leçon du parcours (`@a-valider`) · Les matières du parcours se choisissent au clavier · Le parcours tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant | 6, 7 |
| 8 | Seul un parent rattaché au profil enfant lit la progression qui fait le parcours | Le second parent rattaché retrouve le parcours de Léa sur son téléphone (`@acces`) · Le parcours d'un enfant ne montre jamais les étoiles d'un autre enfant (`@acces`) · Un parent qui n'est pas rattaché ne lit pas la progression de Léa (`@acces`) | — |

Total : 8 règles, 32 scénarios (37 cas), dont 3 `@acces` et 16 `@a-valider`. Plus de 6 règles : la story peut se livrer en deux temps, le calcul et l'écran « Mon parcours » (règles 1 à 5, 7, 8), puis « Leçon suivante » selon le parcours (règle 6, qui touche l'écran de fin de #24).

Droits d'accès (`@acces`) : la progression lue est celle de `resultats_des_lecons` (#24), sous la RLS existante (policy `resultats_des_lecons_lecture_par_ses_parents`). Les deux parents rattachés retrouvent le même parcours sur leurs appareils ; un parent non rattaché (Claire) ne reçoit aucune ligne. Ce dernier scénario reprend mot pour mot les étapes de #24 (« Claire demande les étoiles du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa ») : c'est la même lecture, étendue à tout le profil. Le scénario Léa / Tom vérifie que la lecture est bien filtrée par profil enfant, même pour deux enfants du même parent.

### Lecture des tableaux d'état

| Dans les scénarios | À l'écran (legacy et cible) |
|---|---|
| réussie, n étoiles | une étoile par étoile gagnée, coche ; texte lu « réussie, n étoiles sur 3 » (question 7) |
| à toi | « À toi ! » : la prochaine leçon |
| plus tard | « Plus tard », cadenas : leçon verrouillée |
| à découvrir | « À découvrir » : leçon ouverte, en parcours libre seulement |

## Données de test

Bibliothèque de test du parcours, **servie au navigateur à la place de la vraie bibliothèque** pour ces scénarios (les comptes « sur 4 » ne dépendent donc pas du contenu réel, qui change). Identifiants préfixés `e2e-25-`. Leçons servies dans le désordre, pour vérifier le tri par `ordre`. Chaque leçon a un exercice bulles de deux questions à quatre choix, pour pouvoir jouer une séance complète.

| Matière, niveau | Leçons (ordre) | Sert à |
|---|---|---|
| français, CP | « Les voyelles » (10), « Les syllabes » (20) | leçons d'un niveau inférieur : absentes du parcours de CE1, non comptées |
| français, CE1 | « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30), « Le pluriel des noms » (40) | parcours principal |
| français, CE2 | « Le futur » (10), « L'imparfait » (20), « Le passé composé » (30) | changement de classe ; étoiles d'un niveau supérieur non comptées |
| maths, CE1 | « Les nombres jusqu'à 100 » (10), « Les compléments à 10 » (20) | deuxième onglet, prochaine leçon par matière, onglets au clavier |
| sciences, CP | « Les cinq sens » (10) | matière qui n'a que des leçons des classes d'avant pour un CE1 (question 4) |
| EMC, CE2 | « Les règles de la classe » (10) | onglet « Vivre ensemble » d'un CE2 |
| histoire, anglais ; CM1, CM2 | aucune | pas d'onglet ; CM2 sans aucune leçon |

Progression préparée : « Léa a pour meilleures étoiles : » (tableau) et « Léa a réussi <n> leçon(s) de français du CE1 » (les n premières leçons du parcours, 1 étoile chacune) sont préparés par le jeu de données (clé `service_role` réservée à la préparation), directement dans `resultats_des_lecons` pour le profil réel de l'enfant ; la colonne `lecon` n'a pas de clé étrangère, les identifiants `e2e-25-…` y sont acceptés. Ces étapes sont **nouvelles** et distinctes de « Léa a déjà gagné n étoiles à la leçon … » (#24), qui joue la séance et la fait enregistrer par le serveur.

Séance jouée : « Léa a terminé une séance de la leçon « Le son in » avec 1 étoile » joue la séance dans l'interface (4 erreurs ou plus). Le serveur ne connaît pas les leçons de test (comme #24, Q85) : le parcours doit refléter la séance tout de suite grâce aux étoiles calculées dans le navigateur et à la séance gardée sur l'appareil (question 6). Si le serveur traite une leçon inconnue autrement qu'un envoi impossible, l'`e2e-tester` le signale.

Parents, enfants et appareils : Paul (tablette), Marie (téléphone), rattachés à Léa ; Claire (téléphone), non rattachée ; Tom, second enfant de Paul. Les profils de Léa et de Tom doivent être de vrais profils (comme #24 pour `@issue-24`) : niveau changé par Paul, progression lue sous RLS.

Étapes reprises telles quelles : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Tom a un profil enfant préparé de niveau … », « Marie est rattachée au profil enfant de Léa », « Claire est connectée sur le téléphone », « le réglage « parcours libre » de Léa est sur « oui » », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « Léa joue la séance complète de la leçon « … » », « Léa réussit la dernière question de la séance », « la fin de la séance annonce « … » », « la leçon suivante ouvre la page de la leçon « … » », « la fin de la séance propose … et … », « aucune leçon suivante n'est proposée », « le réseau est coupé », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « le focus est sur « … » », « Claire demande les étoiles du profil enfant de Léa », « Claire ne reçoit aucune donnée de Léa ».

## Hors périmètre

- Leçons des classes d'avant dans le parcours, effets du parcours libre sur « Toutes les leçons » : #26.
- Test de départ (leçons validées d'avance) : #27.
- Écran « Aujourd'hui » et repli de « Leçon suivante » vers une autre matière : #29.
- Leçons personnelles et étiquette « Pour toi » : Accompagnement, lot 6 (question 15).
- Parcours affiché sans réseau dès le lancement de l'application (copie des résultats sur l'appareil) : #44 (question 6).
- Défilement automatique jusqu'à la prochaine leçon (legacy) : comportement repris, non vérifié en E2E (avec 4 leçons, tout est visible).
- Suivi du parent : lot 6.

## Questions ouvertes

Les scénarios qui dépendent d'une réponse sont tagués `@a-valider` ; ils suivent la recommandation.

1. **Règle du verrou** *(modèle n°1)*. Leçons 1 et 3 réussies, leçon 2 non réussie : la leçon 4 est-elle verrouillée ? Le legacy dit **oui** (toute leçon non réussie placée après la première leçon non réussie est verrouillée). Le glossaire dit **non** (« verrouillée parce que la précédente n'est pas réussie » : la 3 étant réussie, la 4 serait ouverte). **Recommandation** : garder le legacy (un seul point d'entrée, l'ordre conseillé est suivi) et corriger la définition du glossaire en « … parce qu'une leçon avant elle n'est pas réussie », ainsi que la ligne `ordre` de `docs/format-lecons.md`. → « Une leçon réussie placée après une leçon non réussie reste ouverte, les autres restent verrouillées ».
2. **« Leçon suivante » à la fin d'une séance** *(modèle n°9, complétée)*. #24 propose la leçon d'`ordre` suivant (même matière, même niveau) et annonçait que le lot 4 la remplacerait par la règle du parcours (Q73). **Recommandation** : la remplacer dans cette story par la première leçon après celle de la séance, dans son parcours, non réussie et non verrouillée, sinon la première non verrouillée ; pas de repli sur une autre matière avant l'écran « Aujourd'hui » (#29), donc pas de bouton s'il n'y en a aucune. **Conséquence à trancher** : deux scénarios de #24 (« La fin de la séance propose la leçon suivante, l'accueil et de rejouer » et « La leçon suivante est la leçon d'ordre suivant de la même matière et du même niveau ») deviennent faux avec leurs données : « La suite de test » (CP, ordre 903) est verrouillée tant que les leçons de français du CP placées avant « Les sons de test » ne sont pas réussies. **Recommandation** : adapter les données de ces deux scénarios de #24, sans changer leurs règles (par exemple, Léa a réussi les leçons de français du CP placées avant « Les sons de test »), par une décision du PO consignée dans `docs/stories/24/acceptance.md`. Autre choix possible : garder la règle de #24 jusqu'à #29 et retirer la règle 6 de cette story. → règle 6.
3. **Leçon verrouillée ouverte autrement que par le parcours** *(modèle n°10)* (adresse directe, plus tard « Toutes les leçons »). **Recommandation** : l'application ne l'ouvre pas depuis une adresse directe et montre le parcours à la place ; le serveur ne refuse pas une séance d'une leçon verrouillée (le verrou guide l'enfant, ce n'est pas une sécurité). → « Une leçon verrouillée demandée par son adresse montre le parcours à la place ».
4. **Onglet d'une matière qui n'a que des leçons des classes d'avant** *(modèle n°8)*. Exemple réel : l'EMC n'a de leçons qu'au CE2 ; un enfant de CM1 a-t-il un onglet « Vivre ensemble » ? Le legacy dit oui (avec « Pas encore de leçon de ta classe dans cette matière. »). **Recommandation** : dans #25, un onglet seulement pour une matière qui a au moins une leçon **du niveau** de l'enfant ; #26 élargira aux classes d'avant. → onglets CE1 / CE2, « Une matière qui n'a que des leçons des classes d'avant n'a pas d'onglet ».
5. **Parcours libre dans cette story** *(modèle n°7)*. L'issue le décrit (« À découvrir », prochaine leçon toujours marquée) mais le renvoie aussi à #26. **Recommandation** : son effet sur le parcours est vérifié ici ; #26 garde « Toutes les leçons » et les classes d'avant. → « En parcours libre, rien n'est verrouillé… », « En parcours libre, une leçon à découvrir s'ouvre ».
6. **Hors ligne** *(modèle n°11)*. **Recommandation** : dans cette story, le parcours se met à jour tout de suite après une séance, sans réseau, avec les étoiles calculées dans le navigateur et celles des séances gardées sur l'appareil ; afficher le parcours sans réseau dès le lancement (copie des résultats du profil sur l'appareil, à effacer à la déconnexion et à la suppression du profil) relève de #44, avec une décision d'architecture. → « Sans réseau, le parcours se met à jour après une séance ».
7. **Texte lu par un lecteur d'écran** *(modèle n°12)*. Le legacy lit « Les sons : ★★ », sans le nombre d'étoiles. **Recommandation** : « <titre> : réussie, 2 étoiles sur 3 », « <titre> : à toi ! », « <titre> : verrouillée, plus tard », « <titre> : à découvrir ». → « Un lecteur d'écran lit l'état de chaque leçon du parcours ».
8. **Libellé « Étape n »** *(modèle n°3)*. Le glossaire interdit « étape » seule (Décision n°28 : confusion avec « Étape de leçon »). **Recommandation** : « Leçon 1 », « Leçon 2 »… à l'écran. Sinon, garder « Étape n » comme exception d'interface explicite. → « Chaque leçon du parcours porte sa place ».
9. **Aucune leçon pour le niveau** *(modèle n°13)*. Le legacy dit « Aucune leçon pour ce niveau pour l'instant. Un adulte peut en créer dans l'espace adulte. » (« espace adulte » est interdit, et les leçons personnelles n'existent pas avant le lot 6). **Recommandation** : « Aucune leçon pour ta classe pour l'instant. ». → « Sans aucune leçon pour sa classe… ».
10. **Accès à « Mon parcours »** *(modèle n°14)*. La cible n'a pas de barre d'onglets en bas d'écran comme le legacy ; l'enfant arrive sur son accueil après « Qui joue ? ». **Recommandation** : un bouton « Mon parcours » sur l'accueil de l'enfant ; le retour ramène à l'accueil de l'enfant (le legacy ramène à « Qui joue ? »). → « Depuis le parcours, le retour ramène à l'accueil de l'enfant » ; l'étape « Léa ouvre son parcours » passe par ce bouton.
11. **Matière choisie à l'ouverture** *(modèle n°15)*. **Recommandation** : la dernière matière choisie pendant l'utilisation en cours, sinon le français, sinon la première matière disponible ; rien n'est mémorisé d'une ouverture de l'application à l'autre (comme le profil en cours). → « Le parcours s'ouvre sur le français », « Le parcours se rouvre sur la dernière matière choisie ».
12. **Descente de classe** *(modèle n°4)* (CE2 → CE1). Les leçons de CE2 réussies disparaissent du parcours mais restent enregistrées, et réapparaissent si l'enfant remonte ; celles de CE1 retrouvent leurs étoiles. **Recommandation** : oui, voulu (décision n°7 du lot 2 : rien n'est effacé). → « Revenue au CE1, l'enfant retrouve les étoiles de ses leçons de CE1 ».
13. **Leçon ajoutée au milieu d'un parcours** *(modèle n°5)* (nouvelle leçon de la bibliothèque, `ordre` intermédiaire). Elle devient la prochaine leçon et verrouille les suivantes non réussies ; les suivantes déjà réussies restent ouvertes. **Recommandation** : l'accepter sans signal pour la beta. Pas de scénario (c'est la règle 2 appliquée à une autre bibliothèque).
14. **Deux leçons de même `ordre`** dans une matière et un niveau *(modèle n°6)* (aucune aujourd'hui). **Recommandation** : le pipeline de contenu refuse le doublon (test pytest) et le domaine départage par identifiant, pour rester déterministe. Pas de scénario E2E (test du pipeline et du domaine).
15. **Leçons personnelles** *(modèle n°2)* (Accompagnement, lot 6). Le legacy les met en fin de parcours, verrouillées tant que tout n'est pas réussi (défaut relevé). **Recommandation** : hors de cette story ; au lot 6, toujours ouvertes, en tête du parcours de leur matière, avec l'étiquette « Pour toi », sans compter dans « réussies sur … ». À confirmer au lot 6.
16. **Parcours entièrement réussi** *(nouvelle)*. Quand toutes les leçons d'une matière sont réussies, le legacy n'affiche plus de « À toi ! » et rien d'autre. **Recommandation** : rien de plus dans cette story (le compteur « 4 leçons réussies sur 4 » suffit) ; une éventuelle félicitation relève de Motivation (lot 5). → « Quand toutes les leçons du parcours sont réussies, il n'y a plus de prochaine leçon ».

Termes à valider au glossaire (ajoutés par le modèle, marqués « à valider ») : **prochaine leçon**, **leçon ouverte**, **leçon suivante**, **matière du parcours**. « Mon parcours », « À toi ! », « Plus tard », « À découvrir » restent des mots d'interface. Les scénarios n'emploient ni « carte », ni « chemin », ni « étape » pour une leçon du parcours (« place » dans les tableaux).
