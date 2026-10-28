# language: fr
@issue-99
Fonctionnalité: « Mon parcours » se dessine dans le royaume du personnage guide
  En tant qu'enfant
  Je veux voir le parcours de chaque matière dessiné dans le paysage de mon univers, avec mon personnage guide
  sur la prochaine leçon
  Afin de voir jusqu'où je suis allé et ce qui m'attend

  La story ne change aucune règle du parcours (#25, #26, #27) : prochaine leçon, leçon à découvrir, place, leçons
  des classes d'avant et leçons réussies d'une classe au-dessus restent celles du domaine Apprentissage. Aucune leçon
  n'est verrouillée (réponse 25.1, Décision n°33) : toutes les leçons du parcours s'ouvrent, comme dans #25.
  Le commentaire au-dessus d'un scénario nomme la réponse du PO qu'il illustre (docs/stories/99/acceptance.md,
  section « Décisions »).

  Mots employés dans ces scénarios (mots d'interface, réponses #99.1 à #99.4, #99.15 et #99.23) :
  - « le dessin du parcours » : les leçons du parcours d'une matière, placées le long d'un tracé dans le paysage
    de l'univers, sous les onglets de « Mon parcours » ; chaque leçon y garde son libellé « Leçon 4 » (sa place) ;
  - « la leçon 4 « … » » : la leçon du parcours de place 4 ;
  - « Noisette se tient sur la leçon 4 » : le personnage guide est dessiné sur cette leçon du dessin du parcours ;
  - « Noisette marche de la leçon 3 à la leçon 4 » : il avance le long du tracé, en passant par les leçons d'entre
    les deux, puis s'arrête sur la leçon 4 ; « Noisette est déjà sur la leçon 4, sans marcher » : il y est posé
    dès l'arrivée sur l'écran ;
  - « la fin du dessin du parcours » : l'endroit, après la dernière leçon, où le personnage guide se tient quand la
    matière est réussie ; on y voit un fanion à la couleur de l'univers, sur une petite colline fleurie, sans étoile
    ni texte (réponse #99.31) ;
  - « brille » : la leçon marquée « À toi ! » ressort du dessin (éclat, contour lumineux) ; jamais plus de 3 éclats
    par seconde ;
  - durées, pour l'implémentation et la review, jamais dans les étapes : la marche dure 2 s au plus, quelle que
    soit la distance (réponse #99.10).

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test du dessin
  du parcours (identifiants préfixés « e2e-99- », leçons servies dans le désordre, chacune faite d'un exercice
  bulles de deux questions à quatre choix) ; la vraie bibliothèque reste intacte :
  - français du CP : « Les voyelles » (ordre 10) ;
  - français du CE1 : « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30),
    « Le pluriel des noms » (40), « Le féminin des noms » (50), « Les accents » (60) ;
  - français du CE2 : « Le futur » (10), « L'imparfait » (20) ;
  - maths du CE1 : 31 leçons, « Maths 1 » (ordre 10) à « Maths 31 » (ordre 310) ;
  - aucune autre leçon.
  Dans les tableaux, l'état d'une leçon se lit comme dans #25 et #27 : « réussie, n étoiles », « réussie au test
  de départ », « à toi » (prochaine leçon, « À toi ! »), « à découvrir ».
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CE1. Dans l'univers « Animaux de la forêt », son
  personnage guide est Noisette ; dans l'univers « Sports », Coach Léo.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que la bibliothèque de test du dessin du parcours est servie

  Règle: Le dessin du parcours montre, dans l'ordre, les leçons du parcours de la matière, chacune avec sa place et son état ; seule la prochaine leçon brille ; les leçons hors du parcours restent à part, sous le dessin

    Scénario: Le dessin du parcours montre chaque leçon avec sa place et son état
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Le son in           | 2       |
        | Les mots contraires | 3       |
      Et que Léa a pour leçons réussies au test de départ :
        | leçon               |
        | Le pluriel des noms |
      Quand Léa ouvre le parcours de français
      Alors le dessin du parcours montre, dans l'ordre :
        | place | leçon                | état                        |
        | 1     | Le son in            | réussie, 2 étoiles          |
        | 2     | L'ordre alphabétique | à toi                       |
        | 3     | Les mots contraires  | réussie, 3 étoiles          |
        | 4     | Le pluriel des noms  | réussie au test de départ   |
        | 5     | Le féminin des noms  | à découvrir                 |
        | 6     | Les accents          | à découvrir                 |

    # Réponses #99.4 : aucun cadenas ; #99.18 : éclat fixe avec les mouvements réduits.
    Scénario: Seule la prochaine leçon brille, et aucune leçon du dessin du parcours n'a de cadenas
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors la leçon 1 « Le son in » brille, marquée « À toi ! »
      Et aucune autre leçon du dessin du parcours ne brille
      Mais aucune leçon du dessin du parcours n'a de cadenas

    # Réponse #99.7 : les leçons hors du parcours restent à part, sous le dessin.
    Scénario: Les leçons réussies d'une classe au-dessus et les leçons des classes d'avant restent à part, sous le dessin du parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon    | étoiles |
        | Le futur | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre le parcours de français
      Alors le dessin du parcours montre, dans l'ordre, « Le son in », « L'ordre alphabétique », « Les mots contraires », « Le pluriel des noms », « Le féminin des noms » et « Les accents »
      Et sous le dessin du parcours, les blocs se suivent ainsi : « Déjà réussies en CE2 », puis « Leçons des classes d'avant »
      Et Noisette se tient sur la leçon 1 « Le son in »

  Règle: Le personnage guide se tient sur la prochaine leçon du dessin du parcours ; quand la matière est réussie, il se tient à la fin du dessin, sans rien donner de plus

    Plan du Scénario: Dans l'univers « <univers> », <personnage guide> se tient sur la prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « <univers> »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 1       |
      Quand Léa ouvre le parcours de français
      Alors <personnage guide> se tient sur la leçon 2 « L'ordre alphabétique »

      Exemples:
        | univers             | personnage guide |
        | Animaux de la forêt | Noisette         |
        | Sports              | Coach Léo        |

    # Réponse #99.14 : un seul personnage guide sur l'écran ; il quitte le titre.
    Scénario: Le personnage guide n'est plus à côté du titre : il n'est que sur le dessin du parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors Noisette se tient sur la leçon 1 « Le son in »
      Et Noisette n'apparaît qu'une seule fois sur l'écran
      Mais Noisette n'est pas à côté du titre « Mon parcours »

    # Réponses #99.12 et #99.31 : le décor d'arrivée (un fanion sur une petite colline fleurie) ne donne aucune récompense.
    Scénario: Quand la matière est réussie, le personnage guide se tient à la fin du dessin du parcours, sans récompense de plus
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 6 leçons de français du CE1
      Quand Léa ouvre le parcours de français
      Alors Noisette se tient à la fin du dessin du parcours, l'air content, près d'un fanion à la couleur de l'univers, sur une petite colline fleurie, sans étoile ni texte
      Et aucune leçon du parcours n'est marquée « À toi ! »
      Mais aucune étoile, aucun badge ni aucun objet de la cabane n'est annoncé

  Règle: Quand la prochaine leçon a avancé depuis la dernière fois, le personnage guide marche jusqu'à la nouvelle prochaine leçon, une seule fois ; jamais en arrière, jamais pour une leçon réussie plus loin ; avec les mouvements réduits, il y est déjà

    Scénario: Après avoir réussi la leçon 3, au retour sur « Mon parcours », le personnage guide marche jusqu'à la leçon 4
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Le son in            | 2       |
        | L'ordre alphabétique | 1       |
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Les mots contraires » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors Noisette marche de la leçon 3 à la leçon 4
      Et Noisette se tient sur la leçon 4 « Le pluriel des noms »

    Scénario: Avec les mouvements réduits, le personnage guide est déjà sur la nouvelle prochaine leçon, sans marcher
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Le son in            | 2       |
        | L'ordre alphabétique | 1       |
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Les mots contraires » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors Noisette est déjà sur la leçon 4 « Le pluriel des noms », sans marcher

    # Réponse #99.10 : une seule marche, le long du tracé, qui ne s'allonge pas avec la distance.
    Scénario: Quand les leçons d'après sont déjà réussies, le personnage guide marche d'un trait jusqu'à la nouvelle prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Le son in            | 2       |
        | L'ordre alphabétique | 1       |
        | Le pluriel des noms  | 3       |
      Et que Léa a pour leçons réussies au test de départ :
        | leçon               |
        | Le féminin des noms |
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Les mots contraires » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors Noisette marche de la leçon 3 jusqu'à la leçon 6 « Les accents », en passant par les leçons 4 et 5

    # Réponse #99.11 (N8 de #25) : la prochaine leçon ne bouge pas, le personnage guide non plus.
    Scénario: Une leçon réussie plus loin que la prochaine leçon ne fait pas marcher le personnage guide
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Le son in            | 2       |
        | L'ordre alphabétique | 1       |
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Le féminin des noms » avec 2 étoiles
      Quand Léa ouvre le parcours de français
      Alors Noisette est déjà sur la leçon 3 « Les mots contraires », sans marcher
      Et le dessin du parcours montre « Le féminin des noms » réussie avec 2 étoiles

    Scénario: Une marche ne se montre qu'une fois
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Le son in            | 2       |
        | L'ordre alphabétique | 1       |
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Les mots contraires » avec 1 étoile
      Et que Léa a vu Noisette marcher jusqu'à la leçon 4, puis est revenue à son accueil
      Quand Léa ouvre le parcours de français
      Alors Noisette est déjà sur la leçon 4 « Le pluriel des noms », sans marcher

    # Réponse #99.9 : la prochaine leçon connue est relevée dès que le profil enfant est choisi.
    Scénario: Une leçon réussie avant d'ouvrir « Mon parcours » fait marcher le personnage guide à la première ouverture
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile, sans avoir ouvert son parcours
      Quand Léa ouvre le parcours de français
      Alors Noisette marche de la leçon 1 à la leçon 2
      Et Noisette se tient sur la leçon 2 « L'ordre alphabétique »

    # Réponse #99.9 : la prochaine leçon connue n'est gardée que pendant l'utilisation en cours.
    Scénario: Après une fermeture de l'application, le personnage guide est déjà sur sa leçon, sans marcher
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa a fermé puis rouvert l'application
      Quand Léa ouvre le parcours de français
      Alors Noisette est déjà sur la leçon 2 « L'ordre alphabétique », sans marcher

    # Réponse #99.16 : choisir de nouveau son profil enfant dans « Qui joue ? » garde la prochaine leçon connue.
    Scénario: Revenue par « Qui joue ? » après sa séance, l'enfant voit quand même le personnage guide marcher
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile, puis s'est choisie de nouveau dans « Qui joue ? »
      Quand Léa ouvre le parcours de français
      Alors Noisette marche de la leçon 1 à la leçon 2

    Scénario: Après un changement de classe, le personnage guide est posé sur la prochaine leçon, sans marcher
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Le son in            | 2       |
        | L'ordre alphabétique | 1       |
      Et que Léa a ouvert le parcours de français
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE2
      Quand Léa ouvre le parcours de français
      Alors Noisette est déjà sur la leçon 1 « Le futur », sans marcher

    # Réponse #99.12 : la marche va jusqu'à la fin du dessin du parcours.
    Scénario: Quand la dernière leçon devient réussie, le personnage guide marche jusqu'à la fin du dessin du parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 5 leçons de français du CE1
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Les accents » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors Noisette marche de la leçon 6 jusqu'à la fin du dessin du parcours
      Et Noisette s'y tient, l'air content

    # Réponse #99.21 : chaque matière garde sa prochaine leçon connue ; la marche se montre sur l'onglet de la matière.
    Scénario: Le personnage guide marche dans l'onglet de la matière où la prochaine leçon a avancé
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Maths 1 » avec 1 étoile
      Et que Léa a ouvert le parcours de français, où Noisette est déjà sur la leçon 1, sans marcher
      Quand Léa choisit « Maths » dans son parcours
      Alors Noisette marche de la leçon 1 à la leçon 2
      Et Noisette se tient sur la leçon 2 « Maths 2 »

    # Réponse #99.20 : la marche ne bloque jamais l'enfant.
    Scénario: Pendant la marche du personnage guide, une leçon s'ouvre tout de suite
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa a ouvert le parcours de français, pendant que Noisette marche
      Quand Léa ouvre la leçon « L'ordre alphabétique » depuis son parcours
      Alors Léa voit la page de la leçon « L'ordre alphabétique »

    Scénario: Sans réseau, le personnage guide marche quand même après une séance
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Et que le réseau est coupé
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors Noisette marche de la leçon 1 à la leçon 2

  Règle: Le dessin du parcours est décoratif : lecteurs d'écran et clavier ont la liste ordonnée des leçons, dans l'ordre du parcours ; l'arrivée du personnage guide s'annonce une fois, sans effet sonore ni parole ; le sous-titre « Ma carte au trésor » est un vrai texte, lu après le titre

    # Réponses #99.1 b et #99.23 A : le sous-titre, sous « Mon parcours », en vrai texte.
    Scénario: Sous le titre « Mon parcours », le sous-titre « Ma carte au trésor » se voit et se lit juste après le titre
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors Léa voit le sous-titre « Ma carte au trésor » sous le titre « Mon parcours »
      Et les lecteurs d'écran lisent « Mon parcours », puis « Ma carte au trésor »

    Scénario: Les lecteurs d'écran lisent les leçons comme une liste ordonnée, sans le dessin du parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Quand Léa ouvre le parcours de français
      Alors les lecteurs d'écran annoncent une liste ordonnée de 6 leçons
      Et les lecteurs d'écran annoncent les leçons du parcours ainsi :
        | annonce                                  |
        | Le son in : réussie, 2 étoiles sur 3     |
        | L'ordre alphabétique : à toi !           |
        | Les mots contraires : à découvrir        |
        | Le pluriel des noms : à découvrir        |
        | Le féminin des noms : à découvrir        |
        | Les accents : à découvrir                |
      Mais ils n'annoncent ni le dessin du parcours ni le dessin de Noisette

    Scénario: Au clavier, le focus passe de leçon en leçon dans l'ordre du parcours, sans se perdre hors de l'écran
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Quand Léa passe d'une leçon du parcours à la suivante au clavier
      Alors le focus va, dans l'ordre, sur « Le son in », « L'ordre alphabétique », « Les mots contraires », « Le pluriel des noms », « Le féminin des noms » et « Les accents »
      Et chaque leçon qui a le focus est visible à l'écran

    # Réponse #99.13 : une seule annonce, à l'arrivée ; ni effet sonore nouveau, ni parole.
    Scénario: À l'arrivée du personnage guide, les lecteurs d'écran l'annoncent une fois, sans effet sonore ni parole
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Le son in            | 2       |
        | L'ordre alphabétique | 1       |
      Et que Léa a ouvert le parcours de français
      Et que Léa a terminé une séance de la leçon « Les mots contraires » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors les lecteurs d'écran annoncent une seule fois « Noisette arrive à la leçon 4 »
      Et Léa n'entend ni effet sonore ni parole pendant que Noisette marche

  Règle: Sur un écran de 360 px, le dessin du parcours défile verticalement, jamais horizontalement, s'ouvre sur la prochaine leçon et garde des cibles assez grandes pour un doigt d'enfant

    # Réponses #99.6 et #99.25 C : un seul dessin par matière, même long, qui s'ouvre sur la prochaine leçon.
    Scénario: À 360 px, un parcours de 31 leçons tient dans la largeur et s'ouvre sur la prochaine leçon
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi les 24 premières leçons de maths du CE1
      Quand Léa choisit « Maths » dans son parcours
      Alors la page tient dans la largeur de l'écran
      Et Noisette se tient sur la leçon 25 « Maths 25 », visible sans que Léa ait fait défiler l'écran
      Et chaque onglet de matière et chaque leçon du parcours mesurent au moins 44 px de haut

    Scénario: À 360 px, le personnage guide ne cache rien de la leçon sur laquelle il se tient
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 1       |
      Quand Léa ouvre le parcours de français
      Alors Noisette se tient sur la leçon 2 « L'ordre alphabétique »
      Et « Leçon 2 », « L'ordre alphabétique » et « À toi ! » restent visibles en entier
