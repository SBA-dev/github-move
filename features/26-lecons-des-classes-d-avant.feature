# language: fr
@issue-26 @wip
Fonctionnalité: Leçons des classes d'avant
  En tant qu'enfant
  Je veux retrouver les leçons des classes d'avant et voir toutes les leçons que je peux faire
  Afin de rejouer ce que j'ai oublié ou de choisir une leçon qui me plaît, sans sortir du programme de ma classe

  Aucune leçon n'est verrouillée (réponse 25.1) et le réglage « parcours libre » n'est pas lu (réponse N2).
  Un commentaire « Question 26.n » renvoie à une question encore ouverte de docs/stories/26/acceptance.md :
  le scénario suit la recommandation et porte le tag @a-valider. Un commentaire « Réponse Nn » ou « Réponse 27.n »
  renvoie à une décision déjà prise dans #25 ou #27. Le tag @depend-de-27 marque un scénario qui emploie
  les étapes du test de départ (#27) : il ne tourne qu'après le merge de #27.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test des leçons
  des classes d'avant (identifiants préfixés « e2e-26- », leçons servies dans le désordre, chacune faite d'un
  exercice bulles de deux questions à quatre choix) ; la vraie bibliothèque reste intacte :
  - français du CP : « Les voyelles » (ordre 10), « Les syllabes » (ordre 20) ;
  - maths du CP : « Compter jusqu'à 10 » (10) ; sciences du CP : « Les cinq sens » (10) ;
  - français du CE1 : « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30) ;
  - maths du CE1 : « Les nombres jusqu'à 100 » (10) ;
  - français du CE2 : « Le futur » (10), « L'imparfait » (20) ; maths du CE2 : « Les tables de 2 » (10) ;
  - EMC du CE2 : « Les règles de la classe » (10) ;
  - aucune leçon d'histoire, d'anglais, ni de CM1 ou de CM2.
  Dans les tableaux, l'état d'une leçon se lit comme dans #25 et #27 : « réussie, n étoiles », « réussie au test
  de départ », « à toi » (prochaine leçon, « À toi ! »), « à découvrir » (leçon non réussie qui n'est pas
  la prochaine leçon). Une leçon des classes d'avant n'est jamais « à toi ».
  Paul est un parent rattaché au profil enfant de Léa.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que la bibliothèque de test des leçons des classes d'avant est servie

  Règle: Dans une matière du parcours, les leçons des classes d'avant sont montrées à part, dans un bloc replié, par niveau puis dans l'ordre

    # Questions 26.3 et 26.6
    @a-valider
    Scénario: Le parcours de français d'un enfant de CE2 montre à part ses leçons du CP puis du CE1, dans l'ordre
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors le bloc « Leçons des classes d'avant » du parcours montre, et seulement elles :
        | leçon                | niveau | état        |
        | Les voyelles         | CP     | à découvrir |
        | Les syllabes         | CP     | à découvrir |
        | Le son in            | CE1    | à découvrir |
        | L'ordre alphabétique | CE1    | à découvrir |
        | Les mots contraires  | CE1    | à découvrir |
      Et « Le futur » est la prochaine leçon

    # Questions 26.4, 26.5 et 26.6
    @a-valider
    Plan du Scénario: Le bloc des leçons des classes d'avant d'un enfant de <niveau> en « <onglet> » est replié et dit combien il en a
      Étant donné que Léa a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Quand Léa choisit « <onglet> » dans son parcours
      Alors le bloc « Leçons des classes d'avant » est replié et s'intitule « <titre> »

      Exemples:
        | niveau | onglet   | titre                          |
        | CE1    | Français | Leçons des classes d'avant (2) |
        | CE1    | Maths    | Leçons des classes d'avant (1) |
        | CE2    | Français | Leçons des classes d'avant (5) |

    Scénario: Un enfant de CP n'a pas de leçons des classes d'avant
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors aucun bloc « Leçons des classes d'avant » n'est proposé

    # Question 26.5
    @a-valider
    Scénario: Déplié, le bloc des leçons des classes d'avant le reste pendant l'utilisation en cours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a déplié le bloc « Leçons des classes d'avant » du parcours de français, puis est revenue à son accueil
      Quand Léa ouvre le parcours de français
      Alors le bloc « Leçons des classes d'avant » est déplié

    # Question 26.6, réponse N1
    @a-valider
    Scénario: Le bloc des leçons des classes d'avant vient après les leçons réussies d'une classe au-dessus
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon    | étoiles |
        | Le futur | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre le parcours de français
      Alors les blocs du parcours se suivent ainsi : « Déjà réussies en CE2 », puis « Leçons des classes d'avant »

  Règle: Une leçon des classes d'avant s'ouvre, mais elle n'est jamais la prochaine leçon, ne compte pas dans le parcours et n'a pas de leçon suivante

    Plan du Scénario: Une leçon des classes d'avant s'ouvre <moyen> depuis le parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a déplié le bloc « Leçons des classes d'avant » du parcours de français
      Quand Léa ouvre la leçon « Les syllabes » depuis son parcours <moyen>
      Alors Léa voit la page de la leçon « Les syllabes »

      Exemples:
        | moyen      |
        | au toucher |
        | au clavier |

    # Question 26.3
    @a-valider
    Scénario: Quand tout le parcours est réussi, aucune leçon des classes d'avant ne devient la prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 3 leçons de français du CE1
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors aucune leçon du parcours n'est marquée « À toi ! »
      Et le bloc « Leçons des classes d'avant » du parcours montre, et seulement elles :
        | leçon        | niveau | état        |
        | Les voyelles | CP     | à découvrir |
        | Les syllabes | CP     | à découvrir |

    Scénario: Les leçons des classes d'avant réussies ne comptent pas dans le parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 3       |
        | Les syllabes | 1       |
      Quand Léa ouvre le parcours de français
      Alors le parcours indique « 0 leçon réussie sur 3 »

    # Question 26.8
    @a-valider
    Scénario: Après une leçon des classes d'avant, aucune leçon suivante n'est proposée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Les voyelles »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Accueil » et « Rejouer »
      Mais aucune leçon suivante n'est proposée

  Règle: Une leçon des classes d'avant montre ce que l'enfant y a réussi, même après un changement de classe ou le test de départ

    # Question 26.3
    @a-valider
    Scénario: Une leçon des classes d'avant réussie montre ses étoiles, les autres sont à découvrir
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 2       |
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors le bloc « Leçons des classes d'avant » du parcours montre, et seulement elles :
        | leçon        | niveau | état               |
        | Les voyelles | CP     | réussie, 2 étoiles |
        | Les syllabes | CP     | à découvrir        |

    Scénario: En passant du CP au CE1, l'enfant retrouve ses leçons du CP réussies parmi les leçons des classes d'avant
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 2       |
        | Les syllabes | 3       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors le bloc « Leçons des classes d'avant » du parcours montre, et seulement elles :
        | leçon        | niveau | état               |
        | Les voyelles | CP     | réussie, 2 étoiles |
        | Les syllabes | CP     | réussie, 3 étoiles |
      Et « Le son in » est la prochaine leçon

    # Réponses 27.7 et 27.15 ; question 26.3
    @depend-de-27 @a-valider
    Scénario: Une leçon du CP réussie au test de départ par un enfant de CE1 se retrouve parmi les leçons des classes d'avant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon        |
        | Les voyelles |
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors le bloc « Leçons des classes d'avant » du parcours montre, et seulement elles :
        | leçon        | niveau | état                      |
        | Les voyelles | CP     | réussie au test de départ |
        | Les syllabes | CP     | à découvrir               |
      Et le parcours indique « 0 leçon réussie sur 3 »

  Règle: « Toutes les leçons » montre les leçons de la classe de l'enfant, celles des classes d'avant et ses leçons réussies d'une classe au-dessus, jamais une leçon d'une classe au-dessus non réussie

    # Questions 26.1, 26.10 et 26.11
    @a-valider
    Scénario: Un enfant de CE1 voit dans « Toutes les leçons » ses leçons du CE1 et du CP, de toutes les matières, avec leur état
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 1       |
        | Le son in    | 2       |
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors « Toutes les leçons » montre, et seulement elles :
        | leçon                   | niveau | matière  | état               |
        | Les voyelles            | CP     | Français | réussie, 1 étoile  |
        | Les syllabes            | CP     | Français | à découvrir        |
        | Compter jusqu'à 10      | CP     | Maths    | à découvrir        |
        | Les cinq sens           | CP     | Sciences | à découvrir        |
        | Le son in               | CE1    | Français | réussie, 2 étoiles |
        | L'ordre alphabétique    | CE1    | Français | à toi              |
        | Les mots contraires     | CE1    | Français | à découvrir        |
        | Les nombres jusqu'à 100 | CE1    | Maths    | à toi              |
      Mais « Toutes les leçons » n'indique aucun nombre de leçons réussies

    # Questions 26.1 et 26.9
    @a-valider
    Plan du Scénario: Un enfant de <niveau> voit <nombre> dans « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors « Toutes les leçons » indique « <nombre> »

      Exemples:
        | niveau | nombre     |
        | CP     | 4 leçons   |
        | CE1    | 8 leçons   |
        | CE2    | 12 leçons  |
        | CM2    | 12 leçons  |

    # Question 26.1
    @a-valider
    Scénario: Une leçon d'une classe au-dessus non réussie n'apparaît jamais dans « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors aucune leçon du CE2 n'apparaît dans « Toutes les leçons »

    # Réponse N7
    Scénario: Redescendue en CE1, l'enfant retrouve dans « Toutes les leçons » ses leçons du CE2 réussies, et seulement elles
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                   | étoiles |
        | Le futur                | 2       |
        | Les règles de la classe | 1       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors « Toutes les leçons » montre « Le futur » réussie avec 2 étoiles
      Et « Toutes les leçons » montre « Les règles de la classe » réussie avec 1 étoile
      Mais « L'imparfait » n'apparaît pas dans « Toutes les leçons »

    # Réponse 27.7
    @depend-de-27
    Scénario: Une leçon réussie au test de départ l'est aussi dans « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon        |
        | Les voyelles |
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors « Toutes les leçons » montre « Les voyelles » réussie au test de départ

    Plan du Scénario: Une leçon s'ouvre <moyen> depuis « Toutes les leçons », même d'une matière sans onglet
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert « Toutes les leçons » depuis son accueil
      Quand Léa ouvre la leçon « Les cinq sens » depuis « Toutes les leçons » <moyen>
      Alors Léa voit la page de la leçon « Les cinq sens »

      Exemples:
        | moyen      |
        | au toucher |
        | au clavier |

    # Réponses N7 et N9
    Scénario: Une leçon réussie d'une classe au-dessus, sans onglet dans le parcours, s'ouvre depuis « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                   | étoiles |
        | Les règles de la classe | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Et que Léa a ouvert « Toutes les leçons » depuis son accueil
      Quand Léa ouvre la leçon « Les règles de la classe » depuis « Toutes les leçons »
      Alors Léa voit la page de la leçon « Les règles de la classe »

    # Question 26.2
    @a-valider
    Scénario: Depuis « Toutes les leçons », le retour ramène à l'accueil de l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert « Toutes les leçons » depuis son accueil
      Quand Léa revient en arrière
      Alors Léa voit son accueil

    # Question 26.2
    @a-valider
    Scénario: Depuis une leçon ouverte dans « Toutes les leçons », le retour y ramène
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert la leçon « Les cinq sens » depuis « Toutes les leçons »
      Quand Léa revient en arrière
      Alors Léa voit « Toutes les leçons »

  Règle: Dans « Toutes les leçons », l'enfant choisit une matière et un niveau ; les leçons sont rangées par niveau, puis par matière, puis dans l'ordre

    # Question 26.9
    @a-valider
    Scénario: À l'ouverture, « Toutes les leçons » montre toutes les matières et tous les niveaux, rangés par niveau, puis par matière, puis dans l'ordre
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors la liste « Matière » est sur « Toutes les matières »
      Et la liste « Niveau » est sur « Tous les niveaux »
      Et « Toutes les leçons » montre, dans l'ordre, « Les voyelles », « Les syllabes », « Compter jusqu'à 10 », « Les cinq sens », « Le son in », « L'ordre alphabétique », « Les mots contraires » et « Les nombres jusqu'à 100 »

    # Question 26.9
    @a-valider
    Scénario: Les listes ne proposent que les matières et les niveaux qui ont des leçons montrées
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors la liste « Matière » propose « Toutes les matières », « Français », « Maths » et « Sciences »
      Et la liste « Niveau » propose « Tous les niveaux », « CP » et « CE1 »

    # Question 26.9
    @a-valider
    Plan du Scénario: Choisir « <choix> » dans la liste « <liste> » ne montre que ses leçons
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert « Toutes les leçons » depuis son accueil
      Quand Léa choisit « <choix> » dans la liste « <liste> »
      Alors « Toutes les leçons » montre, dans l'ordre, <leçons>
      Et « Toutes les leçons » indique « <nombre> »

      Exemples:
        | liste   | choix    | leçons                                                                                                  | nombre   |
        | Matière | Français | « Les voyelles », « Les syllabes », « Le son in », « L'ordre alphabétique » et « Les mots contraires » | 5 leçons |
        | Niveau  | CP       | « Les voyelles », « Les syllabes », « Compter jusqu'à 10 » et « Les cinq sens »                         | 4 leçons |
        | Matière | Sciences | « Les cinq sens »                                                                                       | 1 leçon  |

    # Question 26.9
    @a-valider
    Scénario: Une matière et un niveau choisis ensemble ne montrent que les leçons des deux
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi « Maths » dans la liste « Matière » de « Toutes les leçons »
      Quand Léa choisit « CE1 » dans la liste « Niveau »
      Alors « Toutes les leçons » montre, dans l'ordre, « Les nombres jusqu'à 100 »
      Et « Toutes les leçons » indique « 1 leçon »

    # Question 26.9
    @a-valider
    Scénario: Un choix sans aucune leçon le dit à l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi « Sciences » dans la liste « Matière » de « Toutes les leçons »
      Quand Léa choisit « CE1 » dans la liste « Niveau »
      Alors Léa lit « Aucune leçon pour ce choix. »

    # Question 26.9
    @a-valider
    Scénario: La matière choisie reste choisie pendant l'utilisation en cours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi « Maths » dans la liste « Matière » de « Toutes les leçons », puis est revenue à son accueil
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors la liste « Matière » est sur « Maths »

  Règle: Les leçons des classes d'avant et « Toutes les leçons » se lisent sans réseau, au lecteur d'écran, au clavier et sur un petit écran

    # Question 26.3
    @a-valider
    Scénario: Un lecteur d'écran lit le niveau et l'état de chaque leçon des classes d'avant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 2       |
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors les lecteurs d'écran annoncent « Les voyelles, CP : réussie, 2 étoiles sur 3 »
      Et les lecteurs d'écran annoncent « Les syllabes, CP : à découvrir »

    # Questions 26.4 et 26.5
    @a-valider
    Scénario: Un lecteur d'écran lit que le bloc des leçons des classes d'avant est replié, et combien il en a
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors les lecteurs d'écran annoncent le bouton « Leçons des classes d'avant, 2 leçons », replié

    # Question 26.5
    @a-valider
    Scénario: Le bloc des leçons des classes d'avant se déplie au clavier
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant », au clavier seulement
      Alors les lecteurs d'écran annoncent le bouton « Leçons des classes d'avant, 2 leçons », déplié
      Et le bloc « Leçons des classes d'avant » du parcours montre, et seulement elles :
        | leçon        | niveau | état        |
        | Les voyelles | CP     | à découvrir |
        | Les syllabes | CP     | à découvrir |

    # Question 26.10
    @a-valider
    Scénario: Un lecteur d'écran lit le niveau, la matière et l'état de chaque leçon de « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Et que Léa a ouvert « Toutes les leçons » depuis son accueil
      Quand Léa choisit « Français » dans la liste « Matière »
      Alors les lecteurs d'écran annoncent les leçons de « Toutes les leçons » ainsi :
        | annonce                                           |
        | Les voyelles, CP, Français : à découvrir          |
        | Les syllabes, CP, Français : à découvrir          |
        | Le son in, CE1, Français : réussie, 2 étoiles sur 3 |
        | L'ordre alphabétique, CE1, Français : à toi !     |
        | Les mots contraires, CE1, Français : à découvrir  |

    # Question 26.9
    @a-valider
    Scénario: Quand l'enfant change de choix, un lecteur d'écran lit le nombre de leçons montrées
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert « Toutes les leçons » depuis son accueil
      Quand Léa choisit « Maths » dans la liste « Matière »
      Alors les lecteurs d'écran annoncent le nombre de leçons « 2 leçons »

    Scénario: La matière de « Toutes les leçons » se choisit au clavier
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert « Toutes les leçons » depuis son accueil
      Quand Léa choisit « Maths » dans la liste « Matière », au clavier seulement
      Alors « Toutes les leçons » montre, dans l'ordre, « Compter jusqu'à 10 » et « Les nombres jusqu'à 100 »

    Scénario: Le bloc des leçons des classes d'avant tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors la page tient dans la largeur de l'écran
      Et le bouton du bloc « Leçons des classes d'avant » et chacune de ses leçons mesurent au moins 44 px de haut

    Scénario: « Toutes les leçons » tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors la page tient dans la largeur de l'écran
      Et chaque liste et chaque leçon de « Toutes les leçons » mesurent au moins 44 px de haut

    # Question 26.3
    @a-valider
    Scénario: Sans réseau, une séance d'une leçon des classes d'avant se voit tout de suite dans le parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que le réseau est coupé
      Et que Léa a terminé une séance de la leçon « Les voyelles » avec 1 étoile
      Et que Léa a ouvert le parcours de français
      Quand Léa déplie le bloc « Leçons des classes d'avant »
      Alors le bloc « Leçons des classes d'avant » du parcours montre, et seulement elles :
        | leçon        | niveau | état              |
        | Les voyelles | CP     | réussie, 1 étoile |
        | Les syllabes | CP     | à découvrir       |

    Scénario: Sans réseau, une séance terminée se voit tout de suite dans « Toutes les leçons »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que le réseau est coupé
      Et que Léa a terminé une séance de la leçon « Les voyelles » avec 1 étoile
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors « Toutes les leçons » montre « Les voyelles » réussie avec 1 étoile
