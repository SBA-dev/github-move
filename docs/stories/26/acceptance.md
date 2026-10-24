# Critères d'acceptance : issue #26, Leçons des classes d'avant

Scénarios : `features/26-lecons-des-classes-d-avant.feature` (tags `@issue-26 @wip`).
Modèle du domaine : `docs/stories/26/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** ; Famille n'est plus lu, réponse N2 de #25). Les questions #26.1 à #26.12 en viennent ; #26.13 à #26.16 sont ajoutées ici.

> Story **redéfinie** par les réponses du PO sur #25 et #27 : aucun verrou (25.1 b), parcours libre sans effet (N2), bloc aligné sur « Déjà réussies en CE2 » (N1), leçons réussies d'une classe au-dessus visibles dans « Toutes les leçons » (N7), leçon réussie au test de départ (27.7, 27.15). Les pistes de l'issue qui parlaient de verrou ou de réglage parcours libre sont tombées.
>
> Cadrage seulement : rien n'est codé avant le merge de #27 (PR #80).

## Objectif

En tant qu'**enfant**, je veux retrouver les **leçons des classes d'avant** dans « Mon parcours » et voir, dans « Toutes les leçons », toutes les leçons que je peux faire, afin de rejouer ce que j'ai oublié ou de choisir une leçon qui me plaît, sans sortir du programme de ma classe.

Les deux vues sont calculées par le domaine (`@domain/apprentissage`), dans le navigateur, à partir des leçons de la bibliothèque, du **niveau** du profil enfant, des **meilleures étoiles** (#24) et des **leçons réussies au test de départ** (#27), lues sous la RLS existante. Rien de nouveau n'est écrit en base.

Comportement actuel (`app/`, `subjectPath`, onglets `parcours` et `libre` de `showMap`, `lessonCard`) repris comme premiers exemples, avec les écarts proposés : titre du bloc sans « revoir » (#26.4), « À découvrir » au lieu de « Révision » (#26.3), aucune leçon suivante après une leçon des classes d'avant (#26.8), aucune leçon d'une classe au-dessus non réussie dans « Toutes les leçons » (#26.1), « À toi ! » montré aussi dans « Toutes les leçons » (#26.10), tri par niveau puis matière (#26.9), leçons personnelles laissées à #39.

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Dans une matière du parcours, les leçons des classes d'avant sont montrées à part, dans un bloc replié, par niveau puis dans l'ordre | CE2 en français : « Les voyelles », « Les syllabes » (CP), puis « Le son in », « L'ordre alphabétique », « Les mots contraires » (CE1), servies dans le désordre · titre « Leçons des classes d'avant (2) » en français CE1, « (1) » en maths CE1, « (5) » en français CE2 · CP : pas de bloc · déplié, il le reste pendant l'utilisation en cours · après « Déjà réussies en CE2 » · sciences du CP pour un CE1 : pas d'onglet, donc pas de bloc (scénario de #25, inchangé) |
| 2. Une leçon des classes d'avant s'ouvre, mais elle n'est jamais la prochaine leçon, ne compte pas dans le parcours et n'a pas de leçon suivante | « Les syllabes » s'ouvre au toucher et au clavier · 3 leçons du CE1 réussies : ni « À toi ! » dans le parcours, ni dans le bloc · « Les voyelles » 3 étoiles, « Les syllabes » 1 : « 0 leçon réussie sur 3 » · fin de séance de « Les voyelles » : « Accueil » et « Rejouer », pas « Ensuite : Les syllabes » |
| 3. Une leçon des classes d'avant montre ce que l'enfant y a réussi, même après un changement de classe ou le test de départ | « Les voyelles » 2 étoiles, « Les syllabes » à découvrir · passée du CP au CE1 : « Les voyelles » 2 étoiles, « Les syllabes » 3 étoiles, « Le son in » à toi · « Les voyelles » réussie au test de départ, hors compteur |
| 4. « Toutes les leçons » montre les leçons de la classe de l'enfant, celles des classes d'avant et ses leçons réussies d'une classe au-dessus, jamais une leçon d'une classe au-dessus non réussie | CE1 : 8 leçons, CP et CE1, sciences comprises, avec « À toi ! » en français et en maths, sans compteur de réussite · CP 4, CE1 8, CE2 12, CM2 12 · CE1 : aucune leçon du CE2 · redescendue en CE1 : « Le futur » et « Les règles de la classe », pas « L'imparfait » · « Les voyelles » réussie au test de départ · « Les cinq sens » s'ouvre au toucher et au clavier · « Les règles de la classe » s'ouvre · retour vers l'accueil, retour d'une leçon vers « Toutes les leçons » |
| 5. Dans « Toutes les leçons », l'enfant choisit une matière et un niveau ; les leçons sont rangées par niveau, puis par matière, puis dans l'ordre | ouverture sur « Toutes les matières », « Tous les niveaux », 8 leçons rangées · listes : Français, Maths, Sciences ; CP, CE1 · Français → 5 leçons, CP → 4, Sciences → « 1 leçon » · Maths et CE1 → 1 leçon · Sciences et CE1 → « Aucune leçon pour ce choix. » · Maths gardé pendant l'utilisation en cours |
| 6. Les leçons des classes d'avant et « Toutes les leçons » se lisent sans réseau, au lecteur d'écran, au clavier et sur un petit écran | « Les voyelles, CP : réussie, 2 étoiles sur 3 », « Les syllabes, CP : à découvrir » · bouton « Leçons des classes d'avant, 2 leçons », replié puis déplié au clavier · « L'ordre alphabétique, CE1, Français : à toi ! » · « 2 leçons » annoncé au changement de choix · liste « Matière » au clavier · 360 px et 44 px · séance sans réseau, bloc et « Toutes les leçons » à jour |

## Règles

| # | Règle | Scénarios | Questions et décisions |
|---|---|---|---|
| 1 | Dans une matière du parcours, les leçons des classes d'avant sont montrées à part, dans un bloc replié, par niveau puis dans l'ordre | Le parcours de français d'un enfant de CE2 montre à part ses leçons du CP puis du CE1, dans l'ordre · Le bloc des leçons des classes d'avant d'un enfant de <niveau> en « <onglet> » est replié et dit combien il en a (3 cas) · Un enfant de CP n'a pas de leçons des classes d'avant · Déplié, le bloc des leçons des classes d'avant le reste pendant l'utilisation en cours · Le bloc des leçons des classes d'avant vient après les leçons réussies d'une classe au-dessus | #26.3, #26.4, #26.5, #26.6, #26.7 ; N1 |
| 2 | Une leçon des classes d'avant s'ouvre, mais elle n'est jamais la prochaine leçon, ne compte pas dans le parcours et n'a pas de leçon suivante | Une leçon des classes d'avant s'ouvre <moyen> depuis le parcours (2 cas : au toucher, au clavier) · Quand tout le parcours est réussi, aucune leçon des classes d'avant ne devient la prochaine leçon · Les leçons des classes d'avant réussies ne comptent pas dans le parcours · Après une leçon des classes d'avant, aucune leçon suivante n'est proposée | #26.3, #26.8 ; règle 4 de #25, N10 |
| 3 | Une leçon des classes d'avant montre ce que l'enfant y a réussi, même après un changement de classe ou le test de départ | Une leçon des classes d'avant réussie montre ses étoiles, les autres sont à découvrir · En passant du CP au CE1, l'enfant retrouve ses leçons du CP réussies parmi les leçons des classes d'avant · Une leçon du CP réussie au test de départ par un enfant de CE1 se retrouve parmi les leçons des classes d'avant (`@depend-de-27`) | #26.3 ; décision n°7 du lot 2, 27.7, 27.15 |
| 4 | « Toutes les leçons » montre les leçons de la classe de l'enfant, celles des classes d'avant et ses leçons réussies d'une classe au-dessus, jamais une leçon d'une classe au-dessus non réussie | Un enfant de CE1 voit dans « Toutes les leçons » ses leçons du CE1 et du CP, de toutes les matières, avec leur état · Un enfant de <niveau> voit <nombre> dans « Toutes les leçons » (4 cas : CP, CE1, CE2, CM2) · Une leçon d'une classe au-dessus non réussie n'apparaît jamais dans « Toutes les leçons » · Redescendue en CE1, l'enfant retrouve dans « Toutes les leçons » ses leçons du CE2 réussies, et seulement elles · Une leçon réussie au test de départ l'est aussi dans « Toutes les leçons » (`@depend-de-27`) · Une leçon s'ouvre <moyen> depuis « Toutes les leçons », même d'une matière sans onglet (2 cas) · Une leçon réussie d'une classe au-dessus, sans onglet dans le parcours, s'ouvre depuis « Toutes les leçons » · Depuis « Toutes les leçons », le retour ramène à l'accueil de l'enfant · Depuis une leçon ouverte dans « Toutes les leçons », le retour y ramène | #26.1, #26.2, #26.9, #26.10, #26.11, #26.13 ; N7, N9, 27.7 |
| 5 | Dans « Toutes les leçons », l'enfant choisit une matière et un niveau ; les leçons sont rangées par niveau, puis par matière, puis dans l'ordre | À l'ouverture, « Toutes les leçons » montre toutes les matières et tous les niveaux, rangés par niveau, puis par matière, puis dans l'ordre · Les listes ne proposent que les matières et les niveaux qui ont des leçons montrées · Choisir « <choix> » dans la liste « <liste> » ne montre que ses leçons (3 cas : Français, CP, Sciences) · Une matière et un niveau choisis ensemble ne montrent que les leçons des deux · Un choix sans aucune leçon le dit à l'enfant · La matière choisie reste choisie pendant l'utilisation en cours | #26.9 |
| 6 | Les leçons des classes d'avant et « Toutes les leçons » se lisent sans réseau, au lecteur d'écran, au clavier et sur un petit écran | Un lecteur d'écran lit le niveau et l'état de chaque leçon des classes d'avant · Un lecteur d'écran lit que le bloc des leçons des classes d'avant est replié, et combien il en a · Le bloc des leçons des classes d'avant se déplie au clavier · Un lecteur d'écran lit le niveau, la matière et l'état de chaque leçon de « Toutes les leçons » · Quand l'enfant change de choix, un lecteur d'écran lit le nombre de leçons montrées · La matière de « Toutes les leçons » se choisit au clavier · Le bloc des leçons des classes d'avant tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant · « Toutes les leçons » tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant · Sans réseau, une séance d'une leçon des classes d'avant se voit tout de suite dans le parcours · Sans réseau, une séance terminée se voit tout de suite dans « Toutes les leçons » | #26.3, #26.4, #26.5, #26.9, #26.10 ; 25.6 |

Total : 6 règles, 37 scénarios (46 cas), dont 25 `@a-valider`, 2 `@depend-de-27` (l'un est aussi `@a-valider`) et aucun `@acces`.

Dans le `.feature`, un commentaire `# Question 26.n` au-dessus d'un scénario `@a-valider` renvoie à la question dont il dépend ; `# Réponse Nn` ou `# Réponse 27.n` renvoie à une décision déjà prise.

Règle de tag `@a-valider` : un scénario le porte quand **ce qu'il vérifie** dépend d'une question ouverte (un libellé, un état, un ordre, un nombre). Deux dépendances diffuses ne le donnent pas à elles seules :
- l'accès par le bouton « Toutes les leçons » de l'accueil de l'enfant (#26.2) sert de contexte à tous les scénarios des règles 4 à 6 ; seuls les deux scénarios de retour, qui vérifient l'accès, sont `@a-valider` ;
- l'étape « Léa déplie le bloc « Leçons des classes d'avant » » (#26.5) sert de contexte à plusieurs scénarios. Si le PO veut un bloc toujours déplié, cette étape disparaît (remplacée par « Léa ouvre le parcours de français ») et les scénarios du repli sont retirés.

La story peut se livrer en deux temps :
1. le bloc des leçons des classes d'avant dans « Mon parcours » (règles 1 à 3, et la partie bloc de la règle 6), qui touche le calcul et l'écran de #25 ;
2. l'écran « Toutes les leçons » (règles 4 et 5, et sa partie de la règle 6), qui ajoute un écran et un bouton sur l'accueil de l'enfant.

Droits d'accès (`@acces`) : **aucun scénario nouveau**. #26 ne lit aucune donnée nouvelle : les meilleures étoiles (`resultats_des_lecons`, #24) et les leçons réussies au test de départ (#27) sont lues par les mêmes lectures, sous les mêmes policies, que « Mon parcours ». Ces lectures sont déjà couvertes par les scénarios `@acces` de #25 (second parent, Léa / Tom, Claire non rattachée) et de #27. « Toutes les leçons » n'ajoute ni table, ni Edge Function, ni requête. L'enfant n'a aucun droit propre et, sans verrou, rien ne lui est refusé. Si l'`implementer` ajoute une lecture (par exemple une requête propre à « Toutes les leçons »), il faut le signaler : un scénario `@acces` deviendrait nécessaire.

### Lecture des tableaux d'état

| Dans les scénarios | À l'écran (cible) |
|---|---|
| réussie, n étoiles | comme #25 : une étoile par étoile gagnée, coche ; lu « `<titre>`, CP : réussie, n étoiles sur 3 » dans le bloc, « `<titre>`, CP, Français : réussie, n étoiles sur 3 » dans « Toutes les leçons » |
| réussie au test de départ | comme #27 (27.7) : coche sans étoile ; lu « `<titre>`, CP : réussie au test de départ » |
| à toi | « À toi ! » : la prochaine leçon de sa matière. Jamais pour une leçon des classes d'avant ni pour une leçon d'une classe au-dessus |
| à découvrir | « À découvrir » : leçon non réussie qui n'est pas la prochaine leçon ; pour une leçon des classes d'avant, remplace « Révision » du legacy (#26.3) |

Dans « Toutes les leçons », chaque leçon montre aussi « `<niveau>` · `<matière>` » (« CP · Français ») ; la matière est écrite comme l'onglet de « Mon parcours » (« Français », « Maths », « Sciences », « Vivre ensemble »).

## Données de test

**Bibliothèque de test des leçons des classes d'avant**, servie au navigateur **à la place** de la vraie bibliothèque, comme celles de #25 et #27 (les nombres « (5) », « 12 leçons » ne dépendent donc pas du contenu réel). Identifiants préfixés `e2e-26-`. Leçons servies dans le désordre, pour vérifier le tri. Chaque leçon a, comme dans #25, un exercice bulles de deux questions à quatre choix, pour pouvoir jouer une séance complète et une séance à 1 étoile dans l'interface.

| Matière, niveau | Leçons (ordre) | Identifiants proposés | Sert à |
|---|---|---|---|
| français, CP | « Les voyelles » (10), « Les syllabes » (20) | `e2e-26-fr-cp-voyelles`, `e2e-26-fr-cp-syllabes` | leçons des classes d'avant d'un CE1 et d'un CE2 ; changement CP → CE1 ; test de départ ; hors compteur ; pas de leçon suivante |
| maths, CP | « Compter jusqu'à 10 » (10) | `e2e-26-ma-cp-compter-10` | bloc d'une seule leçon (« (1) ») ; tri par matière dans un niveau |
| sciences, CP | « Les cinq sens » (10) | `e2e-26-sc-cp-cinq-sens` | matière sans onglet pour un CE1 (scénario de #25), visible et ouvrable dans « Toutes les leçons » ; choix sans leçon (Sciences et CE1) |
| français, CE1 | « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30) | `e2e-26-fr-ce1-son-in`, `e2e-26-fr-ce1-ordre-alphabetique`, `e2e-26-fr-ce1-mots-contraires` | parcours de CE1 (« sur 3 ») ; leçons des classes d'avant d'un CE2 |
| maths, CE1 | « Les nombres jusqu'à 100 » (10) | `e2e-26-ma-ce1-nombres-100` | prochaine leçon des maths dans « Toutes les leçons » ; combinaison Maths et CE1 |
| français, CE2 | « Le futur » (10), « L'imparfait » (20) | `e2e-26-fr-ce2-futur`, `e2e-26-fr-ce2-imparfait` | leçon d'une classe au-dessus, réussie (visible) ou non (jamais montrée) ; bloc « Déjà réussies en CE2 » |
| maths, CE2 | « Les tables de 2 » (10) | `e2e-26-ma-ce2-tables-2` | leçon d'une classe au-dessus non réussie |
| EMC, CE2 | « Les règles de la classe » (10) | `e2e-26-emc-ce2-regles-classe` | leçon réussie d'une classe au-dessus sans onglet pour un CE1 (N7), ouvrable seulement depuis « Toutes les leçons » |
| histoire, anglais ; CM1, CM2 | aucune | — | CM2 : aucune leçon de sa classe, 12 leçons dans « Toutes les leçons » |

Nombres attendus, à refaire par l'`e2e-tester` si la bibliothèque change : 4 leçons par niveau (CP, CE1, CE2) ; « Toutes les leçons » montre 4 leçons à un CP, 8 à un CE1, 12 à un CE2 et à un CM2 ; bloc de français : 2 leçons pour un CE1, 5 pour un CE2 ; bloc de maths : 1 pour un CE1.

Progression préparée (clé `service_role` réservée à la préparation, profil réel de l'enfant), comme #25 et #27 :
- « Léa a pour meilleures étoiles : » et « Léa a réussi 3 leçons de français du CE1 » : directement dans `resultats_des_lecons` ;
- « Léa a pour leçons réussies au test de départ : » (#27) : directement dans la table des résultats du test de départ, avec des identifiants `e2e-26-…` (scénarios `@depend-de-27`).

Séances jouées dans l'interface : « Léa a terminé une séance de la leçon « Les voyelles » avec 1 étoile » et « Léa joue la séance complète de la leçon « Les voyelles » », comme #25. Le serveur ne connaît pas les leçons de test : le bloc et « Toutes les leçons » reflètent la séance tout de suite grâce aux étoiles calculées dans le navigateur et à la séance gardée sur l'appareil (réponse 25.6).

Enfant et appareils : Léa, profil réel, sur la tablette de Paul ; univers « Animaux de la forêt ». Pour un enfant « redescendu » ou « passé » de classe, le profil est préparé au premier niveau, les étoiles posées, puis Paul change le niveau par l'étape existante.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … ».
- Parcours (#25) : « Léa a pour meilleures étoiles : », « Léa a réussi 3 leçons de français du CE1 », « Léa a terminé une séance de la leçon « … » avec 1 étoile », « Léa a ouvert le parcours de français », « Léa ouvre le parcours de français », « Léa choisit « … » dans son parcours », « Léa ouvre la leçon « … » depuis son parcours( au toucher| au clavier) », « Léa revient en arrière », « Léa voit son accueil », « Léa lit « … » », « « … » est la prochaine leçon », « le parcours indique « … » », « aucune leçon du parcours n'est marquée « À toi ! » », « le bloc « … » du parcours montre, et seulement elles : », « les lecteurs d'écran annoncent « … » ».
- Séance (#16, #24) : « Léa voit la page de la leçon « … » », « Léa joue la séance complète de la leçon « … » », « Léa réussit la dernière question de la séance », « la fin de la séance propose « … » et « … » », « aucune leçon suivante n'est proposée ».
- Test de départ (#27, pas encore mergée) : « Léa a pour leçons réussies au test de départ : ».
- Réseau, accessibilité : « le réseau est coupé », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran ».

Extensions sans changement de sens (travail de l'`e2e-tester`) :
- Les étapes de préparation et de séance (« Léa a pour meilleures étoiles : », « Léa a réussi n leçons de français du CE1 », « Léa a terminé une séance … », « Léa joue la séance complète … », « Léa ouvre la leçon « … » depuis son parcours », « Léa a pour leçons réussies au test de départ : ») doivent connaître la bibliothèque `e2e-26-`.
- « le bloc « … » du parcours montre, et seulement elles : » ne vérifie aujourd'hui que l'état « réussie, n étoiles » ; il doit accepter « à découvrir » et « réussie au test de départ » (#27 fait déjà le second ajout). Le bloc est trouvé par sa région nommée « Leçons des classes d'avant » ; il doit être déplié.
- « Léa lit « … » » sert ici pour « Aucune leçon pour ce choix. ».

**Non-régression de #25** : les leçons du bloc ne doivent pas être comptées par les étapes de #25 qui lisent les leçons du parcours (« le parcours montre, dans l'ordre, … », « le parcours montre : », « les leçons du parcours sont numérotées … », « les lecteurs d'écran annoncent les leçons du parcours ainsi : »). Avec la bibliothèque `e2e-25-`, un enfant de CE1 a désormais un bloc de 2 leçons du CP (replié) : les leçons du bloc ne doivent donc pas porter le repère des leçons du parcours (`data-testid="lecon-du-parcours"`). L'étape « aucune leçon du CP ni du CE2 n'y apparaît » reste vraie : elle cherche « Les voyelles : … », et une leçon du bloc se lit « Les voyelles, CP : … ». Aucun texte de #25 ne change.

Aucune étape existante n'est modifiée.

Étapes nouvelles :
- bibliothèque : « la bibliothèque de test des leçons des classes d'avant est servie » ;
- bloc : « Léa déplie le bloc « Leçons des classes d'avant »(, au clavier seulement) », « Léa a déplié le bloc « Leçons des classes d'avant » du parcours de français(, puis est revenue à son accueil) », « le bloc « Leçons des classes d'avant » est replié et s'intitule « … » », « le bloc « Leçons des classes d'avant » est déplié », « aucun bloc « Leçons des classes d'avant » n'est proposé », « les blocs du parcours se suivent ainsi : « … », puis « … » », « les lecteurs d'écran annoncent le bouton « … », replié|déplié », « le bouton du bloc « Leçons des classes d'avant » et chacune de ses leçons mesurent au moins 44 px de haut » ;
- « Toutes les leçons » : « Léa ouvre « Toutes les leçons » depuis son accueil », « Léa a ouvert « Toutes les leçons » depuis son accueil », « Léa voit « Toutes les leçons » », « Léa ouvre la leçon « … » depuis « Toutes les leçons »( au toucher| au clavier) », « Léa a ouvert la leçon « … » depuis « Toutes les leçons » », « Léa choisit « … » dans la liste « Matière|Niveau »(, au clavier seulement) », « Léa a choisi « … » dans la liste « … » de « Toutes les leçons »(, puis est revenue à son accueil) », « « Toutes les leçons » montre, et seulement elles : », « « Toutes les leçons » montre, dans l'ordre, … », « « Toutes les leçons » montre « … » réussie avec n étoile(s) », « « Toutes les leçons » montre « … » réussie au test de départ », « « Toutes les leçons » indique « … » », « « Toutes les leçons » n'indique aucun nombre de leçons réussies », « aucune leçon du CE2 n'apparaît dans « Toutes les leçons » », « « … » n'apparaît pas dans « Toutes les leçons » », « la liste « … » est sur « … » », « la liste « … » propose … », « les lecteurs d'écran annoncent les leçons de « Toutes les leçons » ainsi : », « les lecteurs d'écran annoncent le nombre de leçons « … » », « chaque liste et chaque leçon de « Toutes les leçons » mesurent au moins 44 px de haut ».

## Hors périmètre

- Verrous et réglage « parcours libre » : abandonnés ou sans effet (25.1 b, N2). Le réglage n'est ni lu ni retiré ici (story de Famille).
- Une matière qui n'a que des leçons des classes d'avant n'a pas d'onglet : scénario de #25, inchangé (#26.7) ; aucun scénario nouveau.
- Leçons personnelles et étiquette « Pour toi » dans « Toutes les leçons » : #39 (Accompagnement).
- Écran « Aujourd'hui », tuiles de matière et leur compteur (question n°4 de l'issue), repli de la prochaine leçon vers une leçon des classes d'avant (`nextLesson` du legacy), dock et onglet « Toutes les leçons » : #29.
- Bloc et « Toutes les leçons » sans réseau dès le lancement de l'application (copie des résultats sur l'appareil) : #44. Ici, seulement la mise à jour tout de suite après une séance (25.6).
- État d'une leçon à la fois réussie au test de départ et avec des étoiles (les étoiles l'emportent, 27.7), départage de deux leçons de même `ordre` par identifiant, ordre des matières pour toutes les matières (histoire, anglais) : tests unitaires de `parcoursDeLaMatiere` et `toutesLesLecons`, pas de scénario E2E.
- « Rien n'est mémorisé d'une ouverture à l'autre » (bloc replié, choix des listes, #26.5, #26.9) : demande de relancer l'application, non vérifié en E2E.
- Défilement automatique jusqu'à la prochaine leçon : inchangé (#25).
- Suivi du parent : lot 6 (#34).

## Décisions

Aucune pour l'instant : les questions #26.1 à #26.16 attendent la validation du PO. Les décisions déjà prises dans #25 (25.1 b, N1, N2, N7, N9, N10) et #27 (27.7, 27.15) sont appliquées telles quelles.

## Questions ouvertes

### Questions du modèle de domaine (#26.1 à #26.12)

Détail et raisons dans `docs/stories/26/domain-model.md`. Les scénarios suivent chaque recommandation.

| n° | Question | Recommandation | Scénarios `@a-valider` |
|---|---|---|---|
| 26.1 | Quelles leçons dans « Toutes les leçons » ? | Leçons du niveau de l'enfant, des classes d'avant, et ses leçons réussies d'une classe au-dessus ; jamais une leçon d'une classe au-dessus non réussie. | « Un enfant de CE1 voit dans « Toutes les leçons »… », « Un enfant de <niveau> voit <nombre>… », « Une leçon d'une classe au-dessus non réussie n'apparaît jamais… » |
| 26.2 | Comment ouvrir « Toutes les leçons » ? | Bouton « Toutes les leçons » sur l'accueil de l'enfant, après « Mon parcours » ; le retour ramène à l'accueil ; le retour depuis une leçon ouverte ici ramène à « Toutes les leçons ». | les deux scénarios de retour (règle 4) |
| 26.3 | État d'une leçon des classes d'avant non réussie | « À découvrir », lu « Les syllabes, CP : à découvrir » ; **Leçon à découvrir** étendue à ces leçons. | règle 1 (CE2), règle 2 (tout réussi), règle 3 (étoiles et à découvrir ; test de départ), règle 6 (lecteur d'écran ; sans réseau) |
| 26.4 | Titre du bloc | « Leçons des classes d'avant (24) », lu « Leçons des classes d'avant, 24 leçons » (« 1 leçon » au singulier). | « Le bloc … est replié et dit combien il en a », « Un lecteur d'écran lit que le bloc … est replié » |
| 26.5 | Bloc replié ? | Replié à l'ouverture, déplié au toucher et au clavier, reste déplié pendant l'utilisation en cours, rien n'est mémorisé d'une ouverture à l'autre. | « … est replié et dit combien il en a », « Déplié, le bloc … le reste… », « Un lecteur d'écran lit que le bloc … est replié… », « Le bloc … se déplie au clavier » |
| 26.6 | Contenu, ordre et place du bloc | Un bloc par matière, leçons des niveaux inférieurs réussies ou non, par niveau puis `ordre` ; niveau à la place de « Leçon n » ; nombre de toutes les leçons du bloc ; après les leçons de la classe et après « Déjà réussies en CE2 ». | « Le parcours de français d'un enfant de CE2… », « … est replié et dit combien il en a », « Le bloc … vient après les leçons réussies d'une classe au-dessus » |
| 26.7 | Onglet d'une matière qui n'a que des leçons des classes d'avant | Pas d'onglet (scénario de #25 inchangé) ; ces leçons se voient dans « Toutes les leçons ». | aucun (le scénario « Une leçon s'ouvre … depuis « Toutes les leçons », même d'une matière sans onglet » en découle) |
| 26.8 | Leçon suivante après une leçon des classes d'avant | Aucune (« Accueil » et « Rejouer »), comme N10. | « Après une leçon des classes d'avant, aucune leçon suivante n'est proposée » |
| 26.9 | Listes et tri de « Toutes les leçons » | Listes « Matière » et « Niveau », limitées aux choix qui ont des leçons, au départ « Toutes les matières » et « Tous les niveaux », choix gardé pendant l'utilisation en cours ; tri par niveau, matière, `ordre` ; nombre « 24 leçons » affiché et lu ; « Aucune leçon pour ce choix. ». | toute la règle 5, « Un enfant de <niveau> voit <nombre>… », « Quand l'enfant change de choix, un lecteur d'écran lit le nombre… » |
| 26.10 | « À toi ! » dans « Toutes les leçons » | Oui : même état partout ; « CE1 · Français », lu « Le son in, CE1, Français : à toi ! ». | « Un enfant de CE1 voit dans « Toutes les leçons »… », « Un lecteur d'écran lit le niveau, la matière et l'état… » |
| 26.11 | Compteur de réussite dans « Toutes les leçons » | Non ; seulement le nombre de leçons montrées. | « Un enfant de CE1 voit dans « Toutes les leçons »… » (étape « n'indique aucun nombre de leçons réussies ») |
| 26.12 | « Toutes les leçons » : domaine ou interface ? | Mot d'interface, comme « Mon parcours ». | aucun |

### Questions nouvelles (#26.13 à #26.16)

- **#26.13 Une leçon d'un niveau inférieur dans une matière qui n'est pas une matière du parcours est-elle une « leçon des classes d'avant » ?** La définition proposée par le modèle dit « Leçon d'une **matière du parcours** dont le niveau est inférieur… ». Or « Toutes les leçons » montre aussi, pour un CE1, « Les cinq sens » (sciences du CP), alors que les sciences ne sont pas une matière du parcours d'un CE1 (de même, dans la vraie bibliothèque, l'EMC du CE2 pour un CM1). Avec cette définition, cette leçon n'aurait pas de nom. **Recommandation** : définir **Leçon des classes d'avant** sans la lier à la matière du parcours : « Leçon d'un niveau inférieur à celui de l'enfant. Dans « Mon parcours », elle est montrée à part, sous les leçons de sa matière quand celle-ci est une matière du parcours ; toutes se voient dans « Toutes les leçons ». Elle s'ouvre, ne compte pas dans le parcours, n'est jamais la prochaine leçon et n'a pas de leçon suivante. » Le scénario « Une leçon s'ouvre <moyen> depuis « Toutes les leçons », même d'une matière sans onglet » suit cette recommandation. D'accord ?
- **#26.14 Un enfant dont la classe n'a aucune leçon (CM2 de la bibliothèque de test, ou une matière sans leçon du niveau) ne voit aucune de ses leçons des classes d'avant dans « Mon parcours ».** Avec #26.7, « Mon parcours » d'un CM2 dit seulement « Aucune leçon pour ta classe pour l'instant. » (#25), alors que 12 leçons des classes d'avant existent. **Recommandation** : ne rien changer à « Mon parcours » (le message et le scénario de #25 restent tels quels) ; ces leçons se voient dans « Toutes les leçons » (le cas CM2 du scénario « Un enfant de <niveau> voit <nombre>… » le vérifie). Une invitation vers « Toutes les leçons » dans ce message pourra venir avec #29. D'accord ?
- **#26.15 Où mène « Accueil » à la fin d'une séance d'une leçon ouverte depuis « Toutes les leçons » ?** **Recommandation** : à l'accueil de l'enfant, comme partout (#24) ; seul le retour depuis la page de la leçon ramène à « Toutes les leçons » (#26.2). Pas de scénario. D'accord ?
- **#26.16 Que montre « Toutes les leçons » si la bibliothèque n'a pas pu être chargée ?** **Recommandation** : la même chose que « Mon parcours » dans ce cas (même message, aucun choix proposé dans les listes), sans message d'erreur propre ; le bouton reste sur l'accueil de l'enfant. Pas de scénario E2E (test du composant ou du domaine). D'accord ?
