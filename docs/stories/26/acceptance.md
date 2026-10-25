# Critères d'acceptance : issue #26, Leçons des classes d'avant

Scénarios : `features/26-lecons-des-classes-d-avant.feature` (tag `@issue-26`).
Modèle du domaine : `docs/stories/26/domain-model.md` (contexte **Apprentissage**, qui lit le **Catalogue pédagogique** ; Famille n'est plus lu, réponse N2 de #25). Les questions #26.1 à #26.12 et #26.17 à #26.20 viennent du modèle ; #26.13 à #26.16 ont été ajoutées ici.

> Story **redéfinie** par les réponses du PO sur #25 et #27 : aucun verrou (25.1 b), parcours libre sans effet (N2), bloc aligné sur « Déjà réussies en CE2 » (N1), leçons réussies d'une classe au-dessus visibles dans « Toutes les leçons » (N7), leçon réussie au test de départ (27.7, 27.15).
>
> Révision après les réponses du PO : 26.1, 26.1a et 26.1b changent le contenu de « Toutes les leçons » (la classe juste au-dessus s'ouvre matière par matière quand la classe est réussie ; les classes d'avant vont dans une section à part, en dessous) ; les recommandations 26.2 à 26.16, puis 26.17 à 26.20, sont retenues. Aucune question ne reste ouverte.
>
> #27 est mergée (PR #80) et intégrée dans la branche : les scénarios qui employaient ses étapes ne sont plus marqués `@depend-de-27`.

## Objectif

En tant qu'**enfant**, je veux retrouver les **leçons des classes d'avant** dans « Mon parcours » et voir, dans « Toutes les leçons », toutes les leçons de ma classe, puis celles de la classe juste au-dessus dans chaque matière que j'ai finie, afin de rejouer ce que j'ai oublié ou de choisir une leçon qui me plaît, sans sauter de classe.

Les deux vues sont calculées par le domaine (`@domain/apprentissage`), dans le navigateur, à partir des leçons de la bibliothèque, du **niveau** du profil enfant, des **meilleures étoiles** (#24) et des **leçons réussies au test de départ** (#27), lues sous la RLS existante. Rien de nouveau n'est écrit en base.

Comportement actuel (`app/`, `subjectPath`, onglets `parcours` et `libre` de `showMap`, `lessonCard`) repris comme premiers exemples, avec les écarts décidés par le PO :
- titre du bloc sans « revoir » (26.4) ;
- « À découvrir » au lieu de « Révision » (26.3) ;
- aucune leçon suivante après une leçon des classes d'avant (26.8) ;
- « Toutes les leçons » ne montre plus tous les niveaux : la classe de l'enfant, la classe juste au-dessus d'une matière réussie, et les classes d'avant dans une section à part (26.1, 26.1a, 26.1b) ;
- « À toi ! » montré aussi dans « Toutes les leçons » (26.10) ;
- tri par niveau puis matière (26.9) ;
- leçons personnelles laissées à #39.

## Example mapping

| Règle | Exemples |
|---|---|
| 1. Dans une matière du parcours, les leçons des classes d'avant sont montrées à part, dans un bloc replié, par niveau puis dans l'ordre | CE2 en français : « Les voyelles », « Les syllabes » (CP), puis « Le son in », « L'ordre alphabétique », « Les mots contraires » (CE1), servies dans le désordre · titre « Leçons des classes d'avant (2) » en français CE1, « (1) » en maths CE1, « (5) » en français CE2 · CP : pas de bloc · déplié, il le reste pendant l'utilisation en cours · après « Déjà réussies en CE2 » · sciences du CP pour un CE1 : pas d'onglet, donc pas de bloc (scénario de #25, inchangé) |
| 2. Une leçon des classes d'avant s'ouvre, mais elle n'est jamais la prochaine leçon, ne compte pas dans le parcours et n'a pas de leçon suivante | « Les syllabes » s'ouvre au toucher et au clavier · 3 leçons du CE1 réussies : ni « À toi ! » dans le parcours, ni dans le bloc · « Les voyelles » 3 étoiles, « Les syllabes » 1 : « 0 leçon réussie sur 3 » · fin de séance de « Les voyelles » : « Accueil » et « Rejouer », pas « Ensuite : Les syllabes » |
| 3. Une leçon des classes d'avant montre ce que l'enfant y a réussi, même après un changement de classe ou le test de départ | « Les voyelles » 2 étoiles, « Les syllabes » à découvrir · passée du CP au CE1 : « Les voyelles » 2 étoiles, « Les syllabes » 3 étoiles, « Le son in » à toi · « Les voyelles » réussie au test de départ, hors compteur |
| 4. « Toutes les leçons » montre toutes les leçons de la classe de l'enfant ; dans une matière dont il a réussi toutes les leçons de sa classe, celles de la classe juste au-dessus ; et ses leçons réussies d'une classe au-dessus | CE1 : 4 leçons du CE1 avec « À toi ! » en français et en maths, sans compteur de réussite · CP 4, CE1 8, CE2 12, CM2 13 (section comprise) · maths du CE1 réussies → « Les tables de 2 » à découvrir · français du CE1 pas fini → ni « Le futur », ni « L'imparfait » · maths du CE2 aussi réussies → pas « Les fractions » (CM1) · maths du CE1 réussies au test de départ → « Les tables de 2 » · sans rien réussi → aucune leçon du CE2, pas même l'EMC (aucune leçon d'EMC en CE1) · redescendue : « Le futur » et « Les règles de la classe » réussies, pas « L'imparfait » · « Le son in » réussie au test de départ · « Les cinq sens » s'ouvre au toucher et au clavier · « Les règles de la classe » s'ouvre · « Les tables de 2 » : pas de leçon suivante, absente de « Mon parcours » · retour vers l'accueil, retour d'une leçon vers « Toutes les leçons » |
| 5. « Toutes les leçons » range les leçons par niveau, puis par matière, puis dans l'ordre, avec en dessous les leçons des classes d'avant, rangées par classe ; l'enfant choisit une matière et un niveau | ouverture sur « Toutes les matières », « Tous les niveaux », 4 leçons du CE1, section repliée « (4) » · « Les tables de 2 » après les leçons du CE1 · CE2 : section dépliée, CP puis CE1, par matière puis ordre · CP : pas de section · listes : Français, Maths, Sciences ; CP, CE1 · Français → 3 leçons en haut, section « (2) », « 5 leçons » ; Maths → 1, « (1) », « 2 leçons » · CP → section seule, dépliée · Maths et CE1 → « 1 leçon » · Sciences et CE1 → « Aucune leçon pour ce choix. » · Maths gardé pendant l'utilisation en cours |
| 6. Les leçons des classes d'avant et « Toutes les leçons » se lisent sans réseau, au lecteur d'écran, au clavier et sur un petit écran | « Les voyelles, CP : réussie, 2 étoiles sur 3 », « Les syllabes, CP : à découvrir » · bouton « Leçons des classes d'avant, 2 leçons », replié puis déplié au clavier · « L'ordre alphabétique, CE1, Français : à toi ! », « Les tables de 2, CE2, Maths : à découvrir » · section « Leçons des classes d'avant, 4 leçons », repliée · « 2 leçons » lu au changement de choix · liste « Matière » au clavier · 360 px et 44 px · séance sans réseau : bloc et « Toutes les leçons » à jour |

## Règles

| # | Règle | Scénarios | Décisions |
|---|---|---|---|
| 1 | Dans une matière du parcours, les leçons des classes d'avant sont montrées à part, dans un bloc replié, par niveau puis dans l'ordre | Le parcours de français d'un enfant de CE2 montre à part ses leçons du CP puis du CE1, dans l'ordre · Le bloc des leçons des classes d'avant d'un enfant de <niveau> en « <onglet> » est replié et dit combien il en a (3 cas) · Un enfant de CP n'a pas de leçons des classes d'avant · Déplié, le bloc des leçons des classes d'avant le reste pendant l'utilisation en cours · Le bloc des leçons des classes d'avant vient après les leçons réussies d'une classe au-dessus | 26.3 à 26.7 ; N1 |
| 2 | Une leçon des classes d'avant s'ouvre, mais elle n'est jamais la prochaine leçon, ne compte pas dans le parcours et n'a pas de leçon suivante | Une leçon des classes d'avant s'ouvre <moyen> depuis le parcours (2 cas : au toucher, au clavier) · Quand tout le parcours est réussi, aucune leçon des classes d'avant ne devient la prochaine leçon · Les leçons des classes d'avant réussies ne comptent pas dans le parcours · Après une leçon des classes d'avant, aucune leçon suivante n'est proposée | 26.3, 26.8 ; règle 4 de #25, N10 |
| 3 | Une leçon des classes d'avant montre ce que l'enfant y a réussi, même après un changement de classe ou le test de départ | Une leçon des classes d'avant réussie montre ses étoiles, les autres sont à découvrir · En passant du CP au CE1, l'enfant retrouve ses leçons du CP réussies parmi les leçons des classes d'avant · Une leçon du CP réussie au test de départ par un enfant de CE1 se retrouve parmi les leçons des classes d'avant | 26.3 ; décision n°7 du lot 2, 27.7, 27.15 |
| 4 | « Toutes les leçons » montre toutes les leçons de la classe de l'enfant ; dans une matière dont il a réussi toutes les leçons de sa classe, celles de la classe juste au-dessus ; et ses leçons réussies d'une classe au-dessus | Un enfant de CE1 voit dans « Toutes les leçons » toutes les leçons de sa classe, avec leur état · Un enfant de <niveau> voit <nombre> dans « Toutes les leçons » (4 cas : CP, CE1, CE2, CM2) · Quand l'enfant a réussi toutes les leçons de maths de sa classe, les leçons de maths de la classe juste au-dessus apparaissent, à découvrir · Une matière dont l'enfant n'a pas réussi toutes les leçons de sa classe ne montre pas la classe au-dessus · Même après avoir réussi toutes les leçons de la classe au-dessus, l'enfant ne voit pas la classe d'après · Une matière réussie au test de départ montre aussi les leçons de la classe juste au-dessus · Sans leçon réussie, aucune leçon de la classe au-dessus n'apparaît, même d'une matière qui n'a aucune leçon dans la classe de l'enfant · Redescendue en CE1, l'enfant retrouve dans « Toutes les leçons » ses leçons du CE2 réussies, même d'une matière qu'elle n'a pas finie · Une leçon réussie au test de départ l'est aussi dans « Toutes les leçons » · Une leçon des classes d'avant s'ouvre <moyen> depuis « Toutes les leçons », même d'une matière sans onglet (2 cas) · Une leçon réussie d'une classe au-dessus, sans onglet dans le parcours, s'ouvre depuis « Toutes les leçons » · Après une leçon de la classe juste au-dessus, aucune leçon suivante n'est proposée · Une leçon de la classe juste au-dessus non réussie n'apparaît pas dans « Mon parcours » · Depuis « Toutes les leçons », le retour ramène à l'accueil de l'enfant · Depuis une leçon ouverte dans « Toutes les leçons », le retour y ramène | 26.1, 26.1a, 26.1b, 26.2, 26.7, 26.10, 26.11, 26.13 ; N7, N9, 27.7, 26.17 à 26.20 |
| 5 | « Toutes les leçons » range les leçons par niveau, puis par matière, puis dans l'ordre, avec en dessous les leçons des classes d'avant, rangées par classe ; l'enfant choisit une matière et un niveau | À l'ouverture, « Toutes les leçons » montre toutes les matières et tous les niveaux, la section des classes d'avant repliée en dessous · Les leçons de la classe juste au-dessus viennent après celles de la classe de l'enfant · Dépliée, la section des classes d'avant range ses leçons par classe, puis par matière, puis dans l'ordre · Au CP, « Toutes les leçons » n'a pas de section des classes d'avant · Les listes ne proposent que les matières et les niveaux qui ont des leçons montrées · Choisir « <matière> » dans la liste « Matière » ne montre que ses leçons, dans les deux parties (2 cas : Français, Maths) · Choisir une classe d'avant dans la liste « Niveau » ne garde que la section des classes d'avant, dépliée · Une matière et un niveau choisis ensemble ne montrent que les leçons des deux · Un choix sans aucune leçon le dit à l'enfant · La matière choisie reste choisie pendant l'utilisation en cours | 26.1, 26.9, 26.20 |
| 6 | Les leçons des classes d'avant et « Toutes les leçons » se lisent sans réseau, au lecteur d'écran, au clavier et sur un petit écran | Un lecteur d'écran lit le niveau et l'état de chaque leçon des classes d'avant · Un lecteur d'écran lit que le bloc des leçons des classes d'avant est replié, et combien il en a · Le bloc des leçons des classes d'avant se déplie au clavier · Un lecteur d'écran lit le niveau, la matière et l'état de chaque leçon de « Toutes les leçons » · Un lecteur d'écran lit que la section des classes d'avant de « Toutes les leçons » est repliée, et combien elle en a · Quand l'enfant change de choix, un lecteur d'écran lit le nombre de leçons montrées · La matière de « Toutes les leçons » se choisit au clavier · Le bloc des leçons des classes d'avant tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant · « Toutes les leçons » tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant · Sans réseau, une séance d'une leçon des classes d'avant se voit tout de suite dans le parcours · Sans réseau, une séance terminée se voit tout de suite dans « Toutes les leçons » | 26.3, 26.4, 26.5, 26.9, 26.10 ; 25.6, 26.19, 26.20 |

Total : 6 règles, 48 scénarios (56 cas), aucun `@a-valider` (25 au premier cadrage, 15 après les réponses 26.1 à 26.16), aucun `@depend-de-27` (3 levés après le merge de #27) et aucun `@acces`.

Dans le `.feature`, un commentaire `# Réponse 26.n` (ou `Nn`, `27.n`) renvoie à la décision du PO qui fonde le scénario.

La story peut se livrer en deux temps :
1. le bloc des leçons des classes d'avant dans « Mon parcours » (règles 1 à 3, et la partie bloc de la règle 6), qui touche le calcul et l'écran de #25 ;
2. l'écran « Toutes les leçons » (règles 4 et 5, et sa partie de la règle 6), qui ajoute un écran et un bouton sur l'accueil de l'enfant.

Droits d'accès (`@acces`) : **aucun scénario nouveau**.
- #26 ne lit aucune donnée nouvelle. Les meilleures étoiles (`resultats_des_lecons`, #24) et les leçons réussies au test de départ (#27) sont lues par les mêmes lectures, sous les mêmes policies, que « Mon parcours ».
- Ces lectures sont déjà couvertes par les scénarios `@acces` de #25 (second parent, Léa / Tom, Claire non rattachée) et de #27.
- « Toutes les leçons » n'ajoute ni table, ni Edge Function, ni requête. L'enfant n'a aucun droit propre et, sans verrou, rien ne lui est refusé : ce que « Toutes les leçons » ne montre pas (classe au-dessus non ouverte) est une règle d'affichage, pas un droit.
- Si l'`implementer` ajoute une lecture (par exemple une requête propre à « Toutes les leçons »), il faut le signaler : un scénario `@acces` deviendrait nécessaire.

### Lecture des tableaux d'état

| Dans les scénarios | À l'écran (cible) |
|---|---|
| réussie, n étoiles | comme #25 : une étoile par étoile gagnée, coche ; lu « `<titre>`, CP : réussie, n étoiles sur 3 » dans le bloc, « `<titre>`, CP, Français : réussie, n étoiles sur 3 » dans « Toutes les leçons » |
| réussie au test de départ | comme #27 (27.7) : coche sans étoile ; lu « `<titre>`, CP : réussie au test de départ » |
| à toi | « À toi ! » : la prochaine leçon de sa matière. Jamais pour une leçon des classes d'avant ni pour une leçon d'une classe au-dessus |
| à découvrir | « À découvrir » : leçon non réussie qui n'est pas la prochaine leçon ; pour une leçon des classes d'avant, remplace « Révision » du legacy (26.3) ; aussi pour une leçon de la classe juste au-dessus (#26.19) |

Dans « Toutes les leçons », chaque leçon montre aussi « `<niveau>` · `<matière>` » (« CP · Français ») ; la matière est écrite comme l'onglet de « Mon parcours » (« Français », « Maths », « Sciences », « Vivre ensemble »).

« Toutes les leçons » a deux parties, et les étapes les distinguent :
- en haut, les leçons de la classe de l'enfant, puis celles d'une classe au-dessus : « « Toutes les leçons » montre, dans l'ordre, … », « … montre, et seulement elles : », « … montre « X » <état> », « les lecteurs d'écran annoncent les leçons de « Toutes les leçons » ainsi : » ;
- en dessous, la section « Leçons des classes d'avant » : « la section « Leçons des classes d'avant » de « Toutes les leçons » … ».

« « X » apparaît / n'apparaît pas dans « Toutes les leçons » » et « aucune leçon du <niveau> n'apparaît dans « Toutes les leçons » » regardent les deux parties.

## Données de test

**Bibliothèque de test des leçons des classes d'avant**, servie au navigateur **à la place** de la vraie bibliothèque, comme celles de #25 et #27. Les nombres « (5) » et « 13 leçons » ne dépendent donc pas du contenu réel.
- Identifiants préfixés `e2e-26-`.
- Leçons servies dans le désordre, pour vérifier le tri.
- Chaque leçon a, comme dans #25, un exercice bulles de deux questions à quatre choix, pour pouvoir jouer une séance complète et une séance à 1 étoile dans l'interface.

| Matière, niveau | Leçons (ordre) | Identifiants proposés | Sert à |
|---|---|---|---|
| français, CP | « Les voyelles » (10), « Les syllabes » (20) | `e2e-26-fr-cp-voyelles`, `e2e-26-fr-cp-syllabes` | leçons des classes d'avant d'un CE1 et d'un CE2 ; changement CP → CE1 ; test de départ ; hors compteur ; pas de leçon suivante |
| maths, CP | « Compter jusqu'à 10 » (10) | `e2e-26-ma-cp-compter-10` | bloc d'une seule leçon (« (1) ») ; tri par matière dans une classe |
| sciences, CP | « Les cinq sens » (10) | `e2e-26-sc-cp-cinq-sens` | matière sans onglet pour un CE1 (scénario de #25), dans la section des classes d'avant de « Toutes les leçons » ; choix sans leçon (Sciences et CE1) |
| français, CE1 | « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30) | `e2e-26-fr-ce1-son-in`, `e2e-26-fr-ce1-ordre-alphabetique`, `e2e-26-fr-ce1-mots-contraires` | parcours de CE1 (« sur 3 ») ; matière pas finie ; leçons des classes d'avant d'un CE2 |
| maths, CE1 | « Les nombres jusqu'à 100 » (10) | `e2e-26-ma-ce1-nombres-100` | matière réussie avec une seule leçon, qui ouvre les maths du CE2 |
| français, CE2 | « Le futur » (10), « L'imparfait » (20) | `e2e-26-fr-ce2-futur`, `e2e-26-fr-ce2-imparfait` | classe au-dessus d'une matière pas finie (jamais montrée non réussie) ; leçon réussie d'une classe au-dessus ; bloc « Déjà réussies en CE2 » |
| maths, CE2 | « Les tables de 2 » (10) | `e2e-26-ma-ce2-tables-2` | leçon de la classe juste au-dessus montrée parce que les maths du CE1 sont réussies (26.1a) |
| EMC, CE2 | « Les règles de la classe » (10) | `e2e-26-emc-ce2-regles-classe` | matière sans leçon dans la classe d'un CE1 (#26.18) ; leçon réussie d'une classe au-dessus sans onglet (N7, #26.17), ouvrable seulement depuis « Toutes les leçons » |
| maths, CM1 | « Les fractions » (10) | `e2e-26-ma-cm1-fractions` | jamais montrée à un CE1, même maths du CE2 réussies (26.1b) ; leçon des classes d'avant d'un CM2 |
| histoire, anglais ; CM2 | aucune | — | CM2 : aucune leçon de sa classe, 13 leçons des classes d'avant |

Nombres attendus, à refaire par l'`e2e-tester` si la bibliothèque change :
- leçons par classe : 4 au CP, 4 au CE1, 4 au CE2, 1 au CM1 ;
- « Toutes les leçons », sans progression (le nombre compte les deux parties, #26.20) :
  - CP : 4 (pas de section) ;
  - CE1 : 4 + section 4 = 8 ;
  - CE2 : 4 + section 8 = 12 ;
  - CM2 : 0 + section 13 = 13 ;
- bloc de français de « Mon parcours » : 2 pour un CE1, 5 pour un CE2 ; bloc de maths : 1 pour un CE1.

Progression préparée (clé `service_role` réservée à la préparation, profil réel de l'enfant), comme #25 et #27 :
- « Léa a pour meilleures étoiles : » et « Léa a réussi 3 leçons de français du CE1 » : directement dans `resultats_des_lecons` ;
- « Léa a pour leçons réussies au test de départ : » (#27) : directement dans la table des résultats du test de départ, avec des identifiants `e2e-26-…` (étape de #27, `features/steps/test-de-depart.steps.ts`).

Séances jouées dans l'interface, comme #25 : « Léa a terminé une séance de la leçon « … » avec 1 étoile » et « Léa joue la séance complète de la leçon « … » ». Le serveur ne connaît pas les leçons de test : le bloc et « Toutes les leçons » reflètent la séance tout de suite, grâce aux étoiles calculées dans le navigateur et à la séance gardée sur l'appareil (réponse 25.6).

Enfant et appareils :
- Léa, profil réel, sur la tablette de Paul ; univers « Animaux de la forêt ».
- Pour un enfant « redescendu » ou « passé » de classe, le profil est préparé au premier niveau et les étoiles posées, puis Paul change le niveau par l'étape existante.

### Étapes reprises d'autres stories (mot pour mot, même sens)

- Famille : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … ».
- Parcours (#25) : « Léa a pour meilleures étoiles : », « Léa a réussi 3 leçons de français du CE1 », « Léa a terminé une séance de la leçon « … » avec 1 étoile », « Léa a ouvert le parcours de français », « Léa ouvre le parcours de français », « Léa choisit « … » dans son parcours », « Léa ouvre la leçon « … » depuis son parcours( au toucher| au clavier) », « Léa revient en arrière », « Léa voit son accueil », « Léa lit « … » », « « … » est la prochaine leçon », « le parcours indique « … » », « le parcours montre : », « aucune leçon du parcours n'est marquée « À toi ! » », « le bloc « … » du parcours montre, et seulement elles : », « les lecteurs d'écran annoncent « … » ».
- Séance (#16, #24) : « Léa voit la page de la leçon « … » », « Léa joue la séance complète de la leçon « … » », « Léa réussit la dernière question de la séance », « la fin de la séance propose « … » et « … » », « aucune leçon suivante n'est proposée ».
- Test de départ (#27) : « Léa a pour leçons réussies au test de départ : ».
- Réseau, accessibilité : « le réseau est coupé », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran ».

Extensions sans changement de sens (travail de l'`e2e-tester`) :
- Les étapes de préparation et de séance doivent connaître la bibliothèque `e2e-26-` : « Léa a pour meilleures étoiles : », « Léa a réussi n leçons de français du CE1 », « Léa a terminé une séance … », « Léa joue la séance complète … », « Léa ouvre la leçon « … » depuis son parcours », « Léa a pour leçons réussies au test de départ : ».
- « le bloc « … » du parcours montre, et seulement elles : » ne vérifie aujourd'hui que l'état « réussie, n étoiles ».
  - Il doit accepter « à découvrir » et « réussie au test de départ » (#27 fait déjà le second ajout).
  - Le bloc est trouvé par sa région nommée « Leçons des classes d'avant » ; il doit être déplié.
- « Léa lit « … » » sert ici pour « Aucune leçon pour ce choix. ».

**Non-régression de #25** :
- Les leçons du bloc ne doivent pas être comptées par les étapes de #25 qui lisent les leçons du parcours : « le parcours montre, dans l'ordre, … », « le parcours montre : », « les leçons du parcours sont numérotées … », « les lecteurs d'écran annoncent les leçons du parcours ainsi : ».
- Avec la bibliothèque `e2e-25-`, un enfant de CE1 a désormais un bloc replié de 2 leçons du CP. Les leçons du bloc ne doivent donc pas porter le repère des leçons du parcours (`data-testid="lecon-du-parcours"`).
- L'étape « aucune leçon du CP ni du CE2 n'y apparaît » reste vraie : elle cherche « Les voyelles : … », alors qu'une leçon du bloc se lit « Les voyelles, CP : … ».
- Aucun texte de #25 ne change.

Aucune étape existante n'est modifiée.

Étapes nouvelles :
- bibliothèque : « la bibliothèque de test des leçons des classes d'avant est servie » ;
- bloc de « Mon parcours » :
  - « Léa déplie le bloc « Leçons des classes d'avant »(, au clavier seulement) » ;
  - « Léa a déplié le bloc « Leçons des classes d'avant » du parcours de français(, puis est revenue à son accueil) » ;
  - « le bloc « Leçons des classes d'avant » est replié et s'intitule « … » », « le bloc « Leçons des classes d'avant » est déplié », « aucun bloc « Leçons des classes d'avant » n'est proposé » ;
  - « les blocs du parcours se suivent ainsi : « … », puis « … » » ;
  - « « … » n'apparaît pas dans le parcours » ;
  - « les lecteurs d'écran annoncent le bouton « … », replié|déplié » (sert aussi pour la section de « Toutes les leçons ») ;
  - « le bouton du bloc « Leçons des classes d'avant » et chacune de ses leçons mesurent au moins 44 px de haut » ;
- « Toutes les leçons », accès et ouverture :
  - « Léa ouvre « Toutes les leçons » depuis son accueil », « Léa a ouvert « Toutes les leçons » depuis son accueil », « Léa voit « Toutes les leçons » » ;
  - « Léa ouvre la leçon « … » depuis « Toutes les leçons »( au toucher| au clavier) », « Léa a ouvert la leçon « … » depuis « Toutes les leçons » » ;
- « Toutes les leçons », listes :
  - « Léa choisit « … » dans la liste « Matière|Niveau »(, au clavier seulement) » ;
  - « Léa a choisi « … » dans la liste « … » de « Toutes les leçons »(, puis est revenue à son accueil) » ;
  - « la liste « … » est sur « … » », « la liste « … » propose … » ;
- « Toutes les leçons », leçons montrées :
  - « « Toutes les leçons » montre, et seulement elles : », « « Toutes les leçons » montre, dans l'ordre, … » ;
  - « « Toutes les leçons » montre « … » réussie avec n étoile(s) | réussie au test de départ | à découvrir » ;
  - « « … » apparaît dans « Toutes les leçons » », « « … » n'apparaît pas dans « Toutes les leçons » », « aucune leçon du <niveau> n'apparaît dans « Toutes les leçons » » ;
  - « « Toutes les leçons » indique « … » », « « Toutes les leçons » n'indique aucun nombre de leçons réussies » ;
- « Toutes les leçons », section des classes d'avant :
  - « Léa déplie la section « Leçons des classes d'avant » de « Toutes les leçons » », « Léa a déplié la section « Leçons des classes d'avant » de « Toutes les leçons » » ;
  - « la section « Leçons des classes d'avant » de « Toutes les leçons » est repliée et s'intitule « … » » ;
  - « la section « Leçons des classes d'avant » de « Toutes les leçons » montre, dans l'ordre : » (colonnes classe, leçon, matière, état ; la section doit être dépliée) ;
  - « aucune section « Leçons des classes d'avant » n'est proposée dans « Toutes les leçons » » ;
- « Toutes les leçons », accessibilité :
  - « les lecteurs d'écran annoncent les leçons de « Toutes les leçons » ainsi : » ;
  - « les lecteurs d'écran annoncent le nombre de leçons « … » » ;
  - « chaque liste et chaque leçon de « Toutes les leçons » mesurent au moins 44 px de haut ».

## Hors périmètre

- Verrous et réglage « parcours libre » : abandonnés ou sans effet (25.1 b, N2). Le réglage n'est ni lu ni retiré ici (story de Famille).
- Une matière qui n'a que des leçons des classes d'avant n'a pas d'onglet : scénario de #25, inchangé (26.7) ; aucun scénario nouveau.
- « Mon parcours » ne montre jamais une leçon d'une classe au-dessus non réussie, et la classe au-dessus ne donne pas de prochaine leçon (invariant 5 bis du modèle). Vérifié par un scénario de la règle 4 (#26.19).
- Leçon ajoutée plus tard à la classe de l'enfant, qui referme la classe au-dessus d'une matière réussie (modèle, section 2) : tests unitaires de `matiereReussieDuNiveau`, pas de scénario E2E.
- Leçons personnelles et étiquette « Pour toi » dans « Toutes les leçons » : #39 (Accompagnement).
- Écran « Aujourd'hui », tuiles de matière et leur compteur (question n°4 de l'issue), repli de la prochaine leçon vers une leçon des classes d'avant (`nextLesson` du legacy), dock et onglet « Toutes les leçons » : #29.
- Bloc et « Toutes les leçons » sans réseau dès le lancement de l'application (copie des résultats sur l'appareil) : #44. Ici, seulement la mise à jour tout de suite après une séance (25.6).
- Points vérifiés par les tests unitaires de `parcoursDeLaMatiere` et `toutesLesLecons`, sans scénario E2E :
  - état d'une leçon à la fois réussie au test de départ et avec des étoiles (les étoiles l'emportent, 27.7) ;
  - départage de deux leçons de même `ordre` par identifiant ;
  - ordre des matières pour toutes les matières (histoire, anglais).
- « Rien n'est mémorisé d'une ouverture à l'autre » (bloc replié, choix des listes, 26.5, 26.9) : il faudrait relancer l'application, non vérifié en E2E.
- « Accueil » en fin de séance d'une leçon ouverte depuis « Toutes les leçons » (26.15) et bibliothèque non chargée (26.16) : pas de scénario, comme recommandé.
- Défilement automatique jusqu'à la prochaine leçon : inchangé (#25).
- Suivi du parent : lot 6 (#34).

## Décisions

Réponses du PO (annonces du responsable des équipes sur #64), le 2026-10-24.

| n° | Question | Réponse | Effet sur les scénarios |
|---|---|---|---|
| 26.1 | Quelles leçons dans « Toutes les leçons » ? | « toutes les leçons de sa classe. Quand il a fini et réussi toutes les leçons de sa classe. Il peut voir les leçons de la classe au dessus. Les leçons des classes précédentes sont disponibles en dessous dans une section dédiée et ordonnées par classe » (mot pour mot). Remplace la recommandation (« jamais une leçon d'une classe au-dessus non réussie »). | Règle 4 réécrite : « Toutes les leçons » montre toutes les leçons de la classe ; ajout des scénarios de la classe juste au-dessus. Règle 5 : section des classes d'avant en dessous, rangée par classe (forme : 26.20). Nombres « (4) », « 8 leçons »… recalculés. retiré pour 26.1. |
| 26.1a | Toutes matières ensemble ou matière par matière ? | « matière par matière ». | Scénarios « Quand l'enfant a réussi toutes les leçons de maths de sa classe… », « Une matière dont l'enfant n'a pas réussi toutes les leçons de sa classe… », « Une matière réussie au test de départ… ». |
| 26.1b | Classe juste au-dessus ou suivantes ? | « juste sa classe au dessus ». | Scénario « Même après avoir réussi toutes les leçons de la classe au-dessus, l'enfant ne voit pas la classe d'après » ; leçon « Les fractions » (maths, CM1) ajoutée aux données de test. |
| 26.2 | Accès à « Toutes les leçons » | Reco retenue : bouton « Toutes les leçons » sur l'accueil de l'enfant, après « Mon parcours » ; le retour ramène à l'accueil ; le retour depuis une leçon ouverte ici ramène à « Toutes les leçons ». | retiré des deux scénarios de retour. |
| 26.3 | État d'une leçon des classes d'avant non réussie | Reco retenue : « À découvrir », lu « Les syllabes, CP : à découvrir » ; **Leçon à découvrir** étendue à ces leçons. | retiré (règles 1, 2, 3, 6). |
| 26.4 | Titre du bloc | Reco retenue : « Leçons des classes d'avant (24) », lu « Leçons des classes d'avant, 24 leçons ». | retiré. |
| 26.5 | Bloc replié ? | Reco retenue : replié à l'ouverture, déplié au toucher et au clavier, reste déplié pendant l'utilisation en cours, rien n'est mémorisé d'une ouverture à l'autre. | retiré. |
| 26.6 | Contenu, ordre et place du bloc | Reco retenue : un bloc par matière, toutes les leçons des niveaux inférieurs, par niveau puis `ordre`, après les leçons de la classe et après « Déjà réussies en CE2 ». | retiré. |
| 26.7 | Onglet d'une matière qui n'a que des leçons des classes d'avant | Reco retenue : pas d'onglet (scénario de #25 inchangé) ; ces leçons se voient dans « Toutes les leçons ». | Aucun changement. |
| 26.8 | Leçon suivante après une leçon des classes d'avant | Reco retenue : aucune (« Accueil » et « Rejouer »). | retiré. |
| 26.9 | Listes et tri de « Toutes les leçons » | Reco retenue : listes « Matière » et « Niveau » limitées aux choix qui ont des leçons, au départ « Toutes les matières » et « Tous les niveaux », choix gardé pendant l'utilisation en cours ; tri par niveau, matière, `ordre` ; nombre affiché et lu ; « Aucune leçon pour ce choix. ». | retiré, sauf là où la section ou le nombre dépendent de #26.20. |
| 26.10 | « À toi ! » dans « Toutes les leçons » | Reco retenue : même état partout ; lu « Le son in, CE1, Français : à toi ! ». | retiré. |
| 26.11 | Compteur de réussite dans « Toutes les leçons » | Reco retenue : non ; seulement le nombre de leçons montrées. | retiré. |
| 26.12 | « Toutes les leçons » : domaine ou interface ? | Reco retenue : mot d'interface. | Aucun. |
| 26.13 | Définition de « Leçon des classes d'avant » | Reco retenue : « Leçon d'un niveau inférieur à celui de l'enfant. Dans « Mon parcours », elle est montrée à part, sous les leçons de sa matière quand celle-ci est une matière du parcours ; toutes se voient dans « Toutes les leçons ». Elle s'ouvre, ne compte pas dans le parcours, n'est jamais la prochaine leçon et n'a pas de leçon suivante. » | Scénario « Une leçon des classes d'avant s'ouvre <moyen> depuis « Toutes les leçons », même d'une matière sans onglet ». Glossaire : ajout en fin de section. |
| 26.14 | Classe sans leçon (CM2) : rien dans « Mon parcours » | Reco retenue : « Mon parcours » inchangé (#25) ; ces leçons se voient dans « Toutes les leçons ». | Cas CM2 de « Un enfant de <niveau> voit <nombre>… ». |
| 26.15 | « Accueil » en fin de séance depuis « Toutes les leçons » | Reco retenue : vers l'accueil de l'enfant, comme partout. | Pas de scénario. |
| 26.16 | Bibliothèque non chargée | Reco retenue : comme « Mon parcours », sans message d'erreur propre ; le bouton reste. | Pas de scénario E2E. |
| 26.17 | Leçons réussies d'une classe au-dessus, matière non finie | « OK #26 reco » : toujours visibles, quel que soit leur niveau au-dessus, avec leurs étoiles ou « réussie au test de départ », en haut, après les leçons de la classe ; seules les leçons au-dessus non réussies suivent 26.1a et 26.1b. | `@a-valider` retiré de « Redescendue en CE1, l'enfant retrouve dans « Toutes les leçons » ses leçons du CE2 réussies… » et « Une leçon réussie d'une classe au-dessus, sans onglet dans le parcours, s'ouvre… ». |
| 26.18 | Matière sans leçon dans la classe | « OK #26 reco » : pas « réussie » d'office ; elle ne montre pas sa classe au-dessus. | `@a-valider` retiré de « Sans leçon réussie, aucune leçon de la classe au-dessus n'apparaît… ». |
| 26.19 | Leçon de la classe juste au-dessus non réussie | « OK #26 reco » : « À découvrir », jamais « À toi ! », lu « Les tables de 2, CE2, Maths : à découvrir » ; aucune leçon suivante ; absente de « Mon parcours » tant qu'elle n'est pas réussie, puis dans « Déjà réussies en CE2 ». | `@a-valider` retiré de 4 scénarios (règles 4 et 6). |
| 26.20 | Forme de la section des classes d'avant de « Toutes les leçons » | « OK #26 reco » : même forme que le bloc de « Mon parcours » (titre « Leçons des classes d'avant (n) », repliée, dépliée au toucher et au clavier), un sous-titre par classe, leçons par matière puis `ordre` ; listes appliquées aux deux parties, « CP » ne garde que la section, dépliée ; le nombre compte les deux parties ; pas de section au CP. | `@a-valider` retiré de 8 scénarios (règles 4, 5 et 6) ; nombres « 8 leçons », « 13 leçons », « 5 leçons », « 2 leçons » confirmés. |

Réponse du PO aux questions 26.17 à 26.20 (annonce du responsable sur #64, le 2026-10-25) : « OK #26 reco ».

## Questions ouvertes

Aucune.
