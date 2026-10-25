# language: fr
@issue-29 @wip
Fonctionnalité: Écran « Aujourd'hui » : l'accueil de l'enfant
  En tant qu'enfant
  Je veux voir en arrivant ce que je peux faire aujourd'hui : ma leçon du jour, mes révisions, mon test de départ
  Afin de me mettre au travail d'un seul geste

  « Aujourd'hui » est le nom de cadrage de la story : l'écran est l'accueil de l'enfant (réponse 29.5).
  Rien n'y est enregistré : tout ce qu'il montre est calculé à chaque affichage, aussi sans réseau.
  Le PO a retenu toutes les recommandations des questions 29.1 à 29.24 (« OK #29 #30 reco partout », 2026-10-25),
  puis répondu à 29.25 : « Si aucune autre leçon est proposé, on ajoute un bouton pour revenir aux autres cours ».
  Un scénario qui en dépend porte un commentaire « Réponse 29.n » (décisions dans docs/stories/29/acceptance.md).
  « @a-valider » et « Question 29.n » : le scénario dépend d'une question encore ouverte.
  « @depend-de-26 » et « @depend-de-28 » : le scénario attend la story #26 ou #28, pas encore mergée.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test de l'accueil
  (identifiants préfixés « e2e-29- », leçons servies dans le désordre ; chaque leçon a un exercice bulles de deux
  questions à quatre choix, sauf « Les sons de révision », reprise de la bibliothèque de test des révisions de #28) :
  - français du CP : « Les voyelles » (ordre 10), « Les syllabes » (20), « Les sons de révision » (30) ;
  - français du CE1 : « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30),
    « Le pluriel des noms » (40) ;
  - maths du CE1 : « Les nombres jusqu'à 100 » (10), « Les compléments à 10 » (20) ;
  - sciences du CE1 : « Les êtres vivants » (10) ; sciences du CP : « Les cinq sens » (10) ;
  - EMC du CE1 : « Le respect des autres » (10) ;
  - français du CE2 : « Le futur » (10) ;
  - aucune leçon d'histoire, d'anglais, ni de CM1 ou de CM2.
  Léa a un profil enfant dans l'univers « Animaux de la forêt » : son personnage guide est Noisette.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre enfant de Paul ;
  Claire n'est rattachée à aucun des deux.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que la bibliothèque de test de l'accueil est servie

  Règle: En choisissant son profil, l'enfant arrive sur son accueil : son personnage guide le salue une seule fois, sous la date du jour en toutes lettres

    Scénario: En choisissant son profil, l'enfant arrive sur son accueil et son personnage guide le salue
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit son accueil
      Et Noisette dit « Bonjour Léa ! »

    # Réponse 29.14
    Plan du Scénario: L'accueil affiche la date du jour en toutes lettres, avec une majuscule (<cas>)
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que nous sommes le <date>
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa affiche la date « <date affichée> »

      Exemples:
        | cas            | date              | date affichée       |
        | jour ordinaire | 23 octobre 2026   | Vendredi 23 octobre |

      # Réponse 29.19
      Exemples:
        | cas                   | date              | date affichée       |
        | premier jour du mois  | 1 janvier 2027    | Vendredi 1er janvier |

    # Réponse 29.10 f
    Scénario: Avec « tout lire à voix haute », la salutation n'est dite qu'une seule fois à l'arrivée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa entend Noisette dire « Bonjour Léa ! » une seule fois

    # Réponse 29.20
    Scénario: En revenant sur son accueil depuis son parcours, l'enfant n'est pas salué de nouveau
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a ouvert son parcours depuis son accueil
      Quand Léa revient en arrière
      Alors Léa voit son accueil
      Mais Léa n'entend pas Noisette lire « Bonjour Léa ! »

  Règle: La leçon du jour est la prochaine leçon d'une matière du parcours ; le français et les maths alternent, puis viennent les autres matières ; quand tout le parcours est réussi, il n'y en a plus

    # Réponse 29.16
    Scénario: Un enfant de CE1 sans progression a pour leçon du jour la première leçon de français de sa classe
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la leçon du jour de Léa est « Le son in », avec « Français · CE1 »
      Et l'accueil de Léa affiche « Noisette t'attend pour une nouvelle leçon. »

    Scénario: « Commencer » ouvre la page de la leçon du jour
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa commence la leçon du jour
      Alors Léa voit la page de la leçon « Le son in »

    # Réponses 29.1 et 29.16
    Plan du Scénario: Après une séance de <matière jouée>, la leçon du jour est « <leçon du jour> »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « <leçon jouée> » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la leçon du jour de Léa est « <leçon du jour> », avec « <annonce> »

      Exemples:
        | matière jouée                   | leçon jouée              | leçon du jour            | annonce        |
        | français                        | Le son in                | Les nombres jusqu'à 100  | Maths · CE1    |
        | français, leçon à découvrir     | Les mots contraires      | Les nombres jusqu'à 100  | Maths · CE1    |
        | maths                           | Les nombres jusqu'à 100  | Le son in                | Français · CE1 |
        | sciences                        | Les êtres vivants        | Le son in                | Français · CE1 |

    # Réponse 29.1
    Scénario: Après une séance de français puis une séance de maths, la leçon du jour revient au français
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa a terminé une séance de la leçon « Les nombres jusqu'à 100 » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la leçon du jour de Léa est « L'ordre alphabétique », avec « Français · CE1 »

    # Réponse 29.1
    Scénario: Quand tout le français de la classe est réussi, la leçon du jour reste en maths, même après une séance de maths
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 4 leçons de français du CE1
      Et que Léa a terminé une séance de la leçon « Les nombres jusqu'à 100 » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la leçon du jour de Léa est « Les compléments à 10 », avec « Maths · CE1 »

    # Réponse 29.1
    Scénario: Quand le français et les maths de la classe sont réussis, la leçon du jour passe aux autres matières, dans l'ordre
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 4 leçons de français du CE1
      Et que Léa a pour meilleures étoiles :
        | leçon                    | étoiles |
        | Les nombres jusqu'à 100  | 2       |
        | Les compléments à 10     | 1       |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la leçon du jour de Léa est « Les êtres vivants », avec « Sciences · CE1 »

    Scénario: La leçon du jour n'est jamais une leçon déjà réussie
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la leçon du jour de Léa est « L'ordre alphabétique », avec « Français · CE1 »

    Scénario: Une leçon réussie au test de départ n'est jamais la leçon du jour
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon     |
        | Le son in |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la leçon du jour de Léa est « L'ordre alphabétique », avec « Français · CE1 »

    # Réponse 29.9
    Scénario: Quand tout le parcours est réussi, l'accueil félicite l'enfant, sans lui proposer une leçon des classes d'avant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 4 leçons de français du CE1
      Et que Léa a pour meilleures étoiles :
        | leçon                    | étoiles |
        | Les nombres jusqu'à 100  | 1       |
        | Les compléments à 10     | 1       |
        | Les êtres vivants        | 1       |
        | Le respect des autres    | 1       |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa affiche « Bravo ! », « Tu as fini ton parcours » et « Rejoue tes leçons préférées pour gagner toutes les étoiles. »
      Et l'accueil de Léa ne propose aucune leçon du jour

    # Réponse 29.12
    Scénario: Sans aucune leçon pour sa classe, l'accueil le dit, sans féliciter l'enfant d'avoir fini son parcours
      Étant donné que Léa a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa lit « Aucune leçon pour ta classe pour l'instant. »
      Et l'accueil de Léa ne propose aucune leçon du jour
      Mais l'accueil de Léa n'affiche pas « Tu as fini ton parcours »

    # Réponse 29.11
    Scénario: Sans bibliothèque chargée, l'accueil ne montre ni leçon du jour ni tuile de matière, sans message d'erreur
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que la bibliothèque ne peut pas être chargée
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose aucune leçon du jour
      Et l'accueil de Léa ne montre aucune tuile de matière
      Mais l'accueil de Léa n'affiche pas « Tu as fini ton parcours »
      Et aucun message d'erreur n'apparaît

  Règle: À la fin d'une séance sans leçon suivante dans sa matière, la leçon suivante est la leçon du jour, si elle existe et n'est pas la leçon jouée ; quand aucune leçon suivante n'est proposée, la fin de la séance propose « Toutes les leçons »

    # Réponse 29.8
    Scénario: Après la dernière leçon de français du parcours, la fin de la séance propose la leçon du jour en maths
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Le pluriel des noms »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : Les nombres jusqu'à 100 »
      Et la leçon suivante ouvre la page de la leçon « Les nombres jusqu'à 100 »

    # Réponse 29.8
    Scénario: Après une leçon réussie d'une classe au-dessus, la fin de la séance ramène l'enfant à la leçon du jour de sa classe
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon    | étoiles |
        | Le futur | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Et que Léa joue la séance complète de la leçon « Le futur »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : Les nombres jusqu'à 100 »

    # Réponse 29.8
    @depend-de-26
    Scénario: Après une leçon des classes d'avant, la fin de la séance ramène l'enfant à la leçon du jour de sa classe
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Les voyelles »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : Les nombres jusqu'à 100 »

    # Réponses 29.8 et 29.25
    # Question 29.26
    @a-valider
    Scénario: Quand une leçon suivante est proposée, la fin de la séance ne propose pas « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Le son in »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Leçon suivante », « Accueil » et « Rejouer »
      Mais la fin de la séance ne propose pas « Toutes les leçons »

    # Réponses 29.8 et 29.25
    # Question 29.26
    @a-valider @depend-de-26
    Scénario: Quand la séance termine tout le parcours, la fin de la séance propose « Toutes les leçons » à la place d'une leçon suivante
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 3 leçons de français du CE1
      Et que Léa a pour meilleures étoiles :
        | leçon                    | étoiles |
        | Les nombres jusqu'à 100  | 1       |
        | Les compléments à 10     | 1       |
        | Les êtres vivants        | 1       |
        | Le respect des autres    | 1       |
      Et que Léa joue la séance complète de la leçon « Le pluriel des noms »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Accueil », « Rejouer » et « Toutes les leçons »
      Mais aucune leçon suivante n'est proposée

    # Réponse 29.25
    # Question 29.26
    @a-valider @depend-de-26
    Scénario: Sans aucune leçon pour sa classe, après une leçon des classes d'avant, la fin de la séance propose « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Le futur »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Accueil », « Rejouer » et « Toutes les leçons »
      Mais aucune leçon suivante n'est proposée

    # Réponse 29.25
    # Question 29.26
    @a-valider @depend-de-26
    Scénario: Le bouton « Toutes les leçons » de la fin de la séance ouvre « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Le futur »
      Et que Léa a réussi la dernière question de la séance
      Quand Léa choisit « Toutes les leçons » à la fin de la séance
      Alors l'écran « Toutes les leçons » s'affiche, avec le bouton « Toutes les leçons » du dock marqué comme l'écran en cours

    # Réponses 29.7 e et 29.25
    # Question 29.26
    @a-valider @depend-de-26
    Scénario: Depuis « Toutes les leçons » ouvert en fin de séance, le retour ramène à l'accueil de l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi « Toutes les leçons » à la fin de la séance de la leçon « Le futur »
      Quand Léa revient en arrière
      Alors Léa voit son accueil

  Règle: Les tuiles du jour proposent ce qui est dû aujourd'hui, seulement quand c'est dû, toujours dans le même ordre : « À revoir », puis « Mon test de départ »

    # Réponse 29.7 b
    @depend-de-28
    Plan du Scénario: Avec <dues> question(s) due(s), la tuile « À revoir » annonce « <annonce> »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a <dues> questions dues de la leçon « Les sons de révision »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa propose la tuile « À revoir », avec « <annonce> »

      Exemples:
        | dues | annonce                             |
        | 1    | 1 petite erreur des jours passés    |
        | 3    | 3 petites erreurs des jours passés  |

    @depend-de-28
    Scénario: Sans question due aujourd'hui, l'accueil ne propose pas la tuile « À revoir »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question                  | date de révision |
        | Quel mot a le son ou ?    | demain           |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose pas la tuile « À revoir »

    # Réponse 29.7 b
    @depend-de-28
    Scénario: La tuile « À revoir » commence la séance de révision
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre la tuile « À revoir » de son accueil
      Alors l'écran s'intitule « Je révise mes erreurs », avec « Révision »

    # Réponse 29.7 c
    Scénario: Tant que le test de départ n'est pas fait, l'accueil propose la tuile « Mon test de départ »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa propose la tuile « Mon test de départ », avec « Quelques questions pour commencer au bon endroit »

    # Réponse 29.7 c
    Scénario: La tuile « Mon test de départ » ouvre la proposition du test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre la tuile « Mon test de départ » de son accueil
      Alors la proposition du test de départ s'affiche pour Léa

    # Réponse 29.7 c
    Scénario: Une fois le test de départ fait, l'accueil ne propose plus la tuile « Mon test de départ »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a déjà fait le test de départ
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose pas la tuile « Mon test de départ »

    Scénario: Sans question due et le test de départ fait, l'accueil ne propose aucune tuile du jour
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a déjà fait le test de départ
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose aucune tuile du jour
      Mais la leçon du jour de Léa est « Le son in », avec « Français · CE1 »

    # Réponse 29.6
    @depend-de-28
    Scénario: La tuile « À revoir » vient avant la tuile « Mon test de départ »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question                  | date de révision |
        | Quel mot a le son ou ?    | hier             |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors les tuiles du jour de l'accueil de Léa se suivent ainsi : « À revoir », puis « Mon test de départ »

  Règle: L'objectif du jour encourage à jouer 2 leçons dans la journée : chaque leçon terminée compte une fois, la séance de révision compte pour une, le test de départ ne compte pas, et rien ne s'arrête quand il est atteint

    # Réponse 29.2 a
    Scénario: Sans séance terminée aujourd'hui, l'objectif du jour est à 0 sur 2
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'objectif du jour de Léa indique « Joue 2 leçons aujourd'hui » et « 0 sur 2 »

    # Réponse 29.2 a
    Scénario: Après une leçon terminée, l'objectif du jour est à 1 sur 2
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'objectif du jour de Léa indique « 1 sur 2 »

    # Réponses 29.2 a et 29.15
    Scénario: Après deux leçons terminées, l'objectif du jour est atteint et la leçon du jour reste proposée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa a terminé une séance de la leçon « Les nombres jusqu'à 100 » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'objectif du jour de Léa indique « Objectif atteint, bravo ! »
      Et la leçon du jour de Léa est « L'ordre alphabétique », avec « Français · CE1 »

    # Réponse 29.2 c
    Scénario: Une leçon jouée deux fois dans la journée ne compte qu'une fois
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'objectif du jour de Léa indique « 1 sur 2 »

    # Réponse 29.2 c
    @depend-de-26
    Scénario: Une leçon des classes d'avant terminée compte dans l'objectif du jour
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Les voyelles » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'objectif du jour de Léa indique « 1 sur 2 »

    Scénario: Le test de départ ne compte pas dans l'objectif du jour
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, en répondant juste à toutes les questions
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'objectif du jour de Léa indique « 0 sur 2 »

    Scénario: Une séance quittée avant la fin ne compte pas dans l'objectif du jour
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a quitté la séance de la leçon « Le son in » avant la fin
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'objectif du jour de Léa indique « 0 sur 2 »

    # Réponse 29.2 b
    @depend-de-28
    Scénario: Une séance de révision terminée compte pour une leçon dans l'objectif du jour
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'objectif du jour de Léa indique « 1 sur 2 »

    # Réponse 29.13
    @depend-de-28
    Scénario: Le lendemain, l'objectif du jour repart de 0
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa a terminé une séance de la leçon « Les nombres jusqu'à 100 » avec 1 étoile
      Quand Léa revient à son accueil le lendemain
      Alors l'objectif du jour de Léa indique « 0 sur 2 »

  Règle: Une tuile par matière du parcours, dans l'ordre des onglets, compte les leçons réussies de la classe comme « Mon parcours » et ouvre le parcours de cette matière

    # Réponse 29.4
    Scénario: Un enfant de CE1 a une tuile pour chaque matière du parcours, avec le compteur de « Mon parcours »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 1 leçon de français du CE1
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors les tuiles de matière de l'accueil de Léa montrent, dans l'ordre :
        | matière         | compteur                 |
        | Français        | 1 leçon réussie sur 4    |
        | Maths           | 0 leçon réussie sur 2    |
        | Sciences        | 0 leçon réussie sur 1    |
        | Vivre ensemble  | 0 leçon réussie sur 1    |

    # Réponse 29.4
    Scénario: Le compteur d'une tuile de matière ne compte pas les leçons des classes d'avant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 3       |
        | Les syllabes | 2       |
        | Le son in    | 2       |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la tuile de matière « Français » de l'accueil de Léa indique « 1 leçon réussie sur 4 »

    # Réponse 29.4
    Scénario: Une matière qui n'a que des leçons des classes d'avant n'a pas de tuile de matière
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne montre pas de tuile de matière « Sciences »

    # Réponse 29.12
    Scénario: Sans aucune leçon pour sa classe, l'accueil ne montre aucune tuile de matière
      Étant donné que Léa a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne montre aucune tuile de matière

    Scénario: La tuile de matière « Maths » ouvre « Mon parcours » sur les maths
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre la tuile de matière « Maths » de son accueil
      Alors le titre du parcours est « Mathématiques · CE1 »

  Règle: Un dock mène à l'accueil, à « Mon parcours », à « Toutes les leçons » et à « Mes médailles », et marque l'écran en cours ; « Changer d'enfant » reste sur l'accueil

    # Réponse 29.7 a
    Scénario: Sur l'accueil, le dock propose quatre écrans et marque l'accueil comme l'écran en cours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors le dock propose « Accueil », « Mon parcours », « Toutes les leçons » et « Mes médailles »
      Et le bouton « Accueil » du dock est marqué comme l'écran en cours

    # Réponse 29.7 a
    Plan du Scénario: Le dock ouvre « <écran> » et le marque comme l'écran en cours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre « <écran> » par le dock
      Alors l'écran « <écran> » s'affiche, avec le bouton « <écran> » du dock marqué comme l'écran en cours

      Exemples:
        | écran          |
        | Mon parcours   |
        | Mes médailles  |

      @depend-de-26
      Exemples:
        | écran              |
        | Toutes les leçons  |

    # Réponse 29.7 a et e
    Scénario: Depuis « Mon parcours », le bouton « Accueil » du dock ramène à l'accueil de l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert son parcours depuis son accueil
      Quand Léa ouvre « Accueil » par le dock
      Alors Léa voit son accueil

    # Réponse 29.7 a
    Scénario: Le dock s'utilise au clavier
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue sur un ordinateur, au clavier
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre « Mon parcours » par le dock, au clavier seulement
      Alors l'écran « Mon parcours » s'affiche, avec le bouton « Mon parcours » du dock marqué comme l'écran en cours

    # Réponses 29.7 a et 29.21
    Scénario: Le dock n'est pas montré en dehors de ses quatre écrans
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa commence la leçon du jour
      Alors Léa voit la page de la leçon « Le son in »
      Mais aucun dock n'est montré

    # Réponse 29.7 d
    Scénario: « Changer d'enfant » reste sur l'accueil, hors du dock, et mène à « Qui joue ? »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa choisit « Changer d'enfant » sur son accueil
      Alors « Qui joue ? » s'affiche
      Et aucun dock n'est montré

  Règle: L'accueil marche sans réseau, se lit au lecteur d'écran, s'utilise au clavier et tient sur un petit écran

    Scénario: Sans réseau, l'accueil se met à jour tout de suite après une séance
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que le réseau est coupé
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la leçon du jour de Léa est « Les nombres jusqu'à 100 », avec « Maths · CE1 »
      Et l'objectif du jour de Léa indique « 1 sur 2 »
      Et la tuile de matière « Français » de l'accueil de Léa indique « 1 leçon réussie sur 4 »

    # Réponse 29.14
    Scénario: Un lecteur d'écran lit la date, l'objectif du jour et les compteurs en toutes lettres
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que nous sommes le 23 octobre 2026
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors les lecteurs d'écran annoncent « Vendredi 23 octobre »
      Et les lecteurs d'écran annoncent l'objectif du jour « 1 sur 2 », sans lire la barre
      Et les lecteurs d'écran annoncent « 1 leçon réussie sur 4 »

    Scénario: La leçon du jour se commence au clavier
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue sur un ordinateur, au clavier
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa commence la leçon du jour, au clavier seulement
      Alors Léa voit la page de la leçon « Le son in »

    Scénario: L'accueil tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la page tient dans la largeur de l'écran
      Et « Commencer », chaque tuile de l'accueil et chaque bouton du dock mesurent au moins 44 px de haut

    Scénario: Avec les mouvements réduits, l'accueil s'affiche sans animation
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa s'affiche sans mouvement

  Règle: L'accueil ne montre que ce qui appartient au profil enfant en cours, et seulement à un parent rattaché

    @acces @depend-de-28
    Scénario: Le second parent rattaché retrouve sur son téléphone la leçon du jour de Léa
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Marie est rattachée au profil enfant de Léa
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Quand Léa choisit son profil enfant sur le téléphone de Marie
      Alors la leçon du jour de Léa est « L'ordre alphabétique », avec « Français · CE1 »

    @acces
    Scénario: L'accueil d'un enfant ne tient jamais compte des étoiles d'un autre enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 3       |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la leçon du jour de Léa est « Le son in », avec « Français · CE1 »
      Et la tuile de matière « Français » de l'accueil de Léa indique « 0 leçon réussie sur 4 »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les séances terminées de Léa
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que l'appareil envoie une séance terminée de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » avec 0 erreurs, en annonçant 3 étoiles
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les séances terminées du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
