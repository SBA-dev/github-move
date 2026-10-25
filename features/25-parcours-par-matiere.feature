# language: fr
@issue-25
Fonctionnalité: Parcours par matière
  En tant qu'enfant
  Je veux voir le parcours de chaque matière de ma classe, leçon après leçon, avec la prochaine leçon mise en avant
  Afin d'apprendre dans l'ordre conseillé sans me perdre

  Aucune leçon du parcours n'est verrouillée (réponse 25.1) : toutes s'ouvrent, la prochaine leçon est seulement
  mise en avant.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test du parcours
  (identifiants préfixés « e2e-25- », leçons servies dans le désordre, chacune faite d'un exercice bulles de deux
  questions à quatre choix) ; la vraie bibliothèque reste intacte :
  - français du CP : « Les voyelles » (ordre 10), « Les syllabes » (ordre 20) ;
  - français du CE1 : « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30),
    « Le pluriel des noms » (40) ;
  - français du CE2 : « Le futur » (10), « L'imparfait » (20), « Le passé composé » (30) ;
  - maths du CE1 : « Les nombres jusqu'à 100 » (10), « Les compléments à 10 » (20) ;
  - sciences du CP : « Les cinq sens » (10) ;
  - EMC du CE2 : « Les règles de la classe » (10) ;
  - aucune leçon d'histoire, d'anglais, ni de CM1 ou de CM2.
  Dans les tableaux, l'état d'une leçon du parcours se lit ainsi : « réussie, n étoiles » (étoiles gagnées),
  « à toi » (prochaine leçon, « À toi ! »), « à découvrir » (leçon non réussie qui n'est pas la prochaine leçon).
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Claire n'y est pas rattachée.
  Un commentaire « Réponse Nn » renvoie aux décisions de docs/stories/25/acceptance.md.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que la bibliothèque de test du parcours est servie

  Règle: Le parcours d'une matière montre, dans l'ordre, ses leçons du niveau de l'enfant ; seules ces matières ont un onglet

    Scénario: Le parcours de français d'un enfant de CE1 montre les leçons de français du CE1, dans l'ordre
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors le titre du parcours est « Français · CE1 »
      Et le parcours montre, dans l'ordre, « Le son in », « L'ordre alphabétique », « Les mots contraires » et « Le pluriel des noms »
      Mais aucune leçon du CP ni du CE2 n'y apparaît

    Plan du Scénario: Un enfant de <niveau> a un onglet pour chaque matière qui a des leçons de son niveau
      Étant donné que Léa a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Quand Léa ouvre son parcours
      Alors les onglets du parcours sont <onglets>

      Exemples:
        | niveau | onglets                             |
        | CE1    | « Français » et « Maths »           |
        | CE2    | « Français » et « Vivre ensemble »  |

    Scénario: Une matière qui n'a que des leçons des classes d'avant n'a pas d'onglet
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre son parcours
      Alors aucun onglet « Sciences » n'est proposé

    # Réponse N7
    Scénario: Une matière qui n'a que des leçons réussies d'une classe au-dessus n'a pas d'onglet
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                    | étoiles |
        | Les règles de la classe  | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre son parcours
      Alors les onglets du parcours sont « Français » et « Maths »

    Scénario: Sans aucune leçon pour sa classe, l'enfant lit qu'il n'y en a pas encore
      Étant donné que Léa a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre son parcours
      Alors Léa lit « Aucune leçon pour ta classe pour l'instant. »
      Et aucun onglet de matière n'est proposé

    Scénario: Le parcours s'ouvre sur le français
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre son parcours
      Alors le titre du parcours est « Français · CE1 »

    Scénario: Le parcours se rouvre sur la dernière matière choisie
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi « Maths » dans son parcours, puis est revenue à son accueil
      Quand Léa ouvre son parcours
      Alors le titre du parcours est « Mathématiques · CE1 »

    Scénario: Depuis le parcours, le retour ramène à l'accueil de l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert son parcours depuis son accueil
      Quand Léa revient en arrière
      Alors Léa voit son accueil

    Scénario: Chaque leçon du parcours porte sa place
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors les leçons du parcours sont numérotées « Leçon 1 », « Leçon 2 », « Leçon 3 » et « Leçon 4 »

  Règle: La prochaine leçon est la première leçon non réussie du parcours ; les autres leçons non réussies sont à découvrir

    Scénario: Sans progression, la première leçon est la prochaine leçon et les suivantes sont à découvrir
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors le parcours montre :
        | place | leçon                | état        |
        | 1     | Le son in            | à toi       |
        | 2     | L'ordre alphabétique | à découvrir |
        | 3     | Les mots contraires  | à découvrir |
        | 4     | Le pluriel des noms  | à découvrir |

    Scénario: Après une séance d'au moins 1 étoile, la leçon d'après devient la prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors le parcours montre :
        | place | leçon                | état               |
        | 1     | Le son in            | réussie, 1 étoile  |
        | 2     | L'ordre alphabétique | à toi              |
        | 3     | Les mots contraires  | à découvrir        |
        | 4     | Le pluriel des noms  | à découvrir        |

    # Réponse N8
    Scénario: Une leçon réussie plus loin dans le parcours ne déplace pas la prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Le son in           | 2       |
        | Les mots contraires | 3       |
      Quand Léa ouvre le parcours de français
      Alors le parcours montre :
        | place | leçon                | état                |
        | 1     | Le son in            | réussie, 2 étoiles  |
        | 2     | L'ordre alphabétique | à toi               |
        | 3     | Les mots contraires  | réussie, 3 étoiles  |
        | 4     | Le pluriel des noms  | à découvrir         |

    Scénario: Quand toutes les leçons du parcours sont réussies, il n'y a plus de prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi 4 leçons de français du CE1
      Quand Léa ouvre le parcours de français
      Alors aucune leçon du parcours n'est marquée « À toi ! »
      Et aucune leçon du parcours n'est à découvrir

    Scénario: Chaque matière a sa propre prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 3       |
      Quand Léa choisit « Maths » dans son parcours
      Alors le parcours montre :
        | place | leçon                    | état        |
        | 1     | Les nombres jusqu'à 100  | à toi       |
        | 2     | Les compléments à 10     | à découvrir |

  Règle: Toute leçon montrée dans le parcours s'ouvre, qu'elle soit réussie, prochaine leçon ou à découvrir

    Scénario: La prochaine leçon s'ouvre depuis le parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Quand Léa ouvre la leçon « Le son in » depuis son parcours
      Alors Léa voit la page de la leçon « Le son in »

    Scénario: Une leçon réussie s'ouvre pour être rejouée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Et que Léa a ouvert le parcours de français
      Quand Léa ouvre la leçon « Le son in » depuis son parcours
      Alors Léa voit la page de la leçon « Le son in »

    Plan du Scénario: Une leçon à découvrir s'ouvre <moyen>, sans avoir réussi celles d'avant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Quand Léa ouvre la leçon « Les mots contraires » depuis son parcours <moyen>
      Alors Léa voit la page de la leçon « Les mots contraires »

      Exemples:
        | moyen       |
        | au toucher  |
        | au clavier  |

    # Réponses N1 et N9
    Scénario: Une leçon déjà réussie dans une classe au-dessus s'ouvre depuis le parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon    | étoiles |
        | Le futur | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Et que Léa a ouvert le parcours de français
      Quand Léa ouvre la leçon « Le futur » depuis son parcours
      Alors Léa voit la page de la leçon « Le futur »

  Règle: Le parcours compte les leçons réussies du niveau de l'enfant, et seulement elles

    Plan du Scénario: Avec <réussies> leçon(s) réussie(s), le parcours indique « <compteur> »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a réussi <réussies> leçon(s) de français du CE1
      Quand Léa ouvre le parcours de français
      Alors le parcours indique « <compteur> »

      Exemples:
        | réussies | compteur                   |
        | 0        | 0 leçon réussie sur 4      |
        | 1        | 1 leçon réussie sur 4      |
        | 3        | 3 leçons réussies sur 4    |
        | 4        | 4 leçons réussies sur 4    |

    Scénario: Les leçons réussies d'un autre niveau ne comptent pas
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 3       |
        | Le son in    | 2       |
        | Le futur     | 1       |
      Quand Léa ouvre le parcours de français
      Alors le parcours indique « 1 leçon réussie sur 4 »

  Règle: Changer de classe garde les étoiles ; les leçons réussies d'une classe au-dessus restent visibles, à part du parcours

    Scénario: En passant du CE1 au CE2, le parcours de français commence à la première leçon de CE2 non réussie
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
        | Le futur  | 1       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE2
      Quand Léa ouvre le parcours de français
      Alors le titre du parcours est « Français · CE2 »
      Et le parcours montre :
        | place | leçon            | état              |
        | 1     | Le futur         | réussie, 1 étoile |
        | 2     | L'imparfait      | à toi             |
        | 3     | Le passé composé | à découvrir       |

    Scénario: Revenue au CE1, l'enfant retrouve les étoiles de ses leçons de CE1
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE2
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre le parcours de français
      Alors le parcours montre « Le son in » réussie avec 2 étoiles
      Et « L'ordre alphabétique » est la prochaine leçon

    # Réponse N1
    Scénario: Redescendue en CE1, l'enfant retrouve à part ses leçons de CE2 réussies, et seulement elles
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon       | étoiles |
        | Le futur    | 2       |
        | L'imparfait | 1       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre le parcours de français
      Alors le bloc « Déjà réussies en CE2 » du parcours montre, et seulement elles :
        | leçon       | niveau | état               |
        | Le futur    | CE2    | réussie, 2 étoiles |
        | L'imparfait | CE2    | réussie, 1 étoile  |
      Et « Le son in » est la prochaine leçon

  Règle: À la fin d'une séance, la leçon suivante est la première leçon d'après non réussie du même parcours, sinon la leçon juste après

    Scénario: La leçon suivante saute une leçon déjà réussie
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | L'ordre alphabétique | 2       |
      Et que Léa joue la séance complète de la leçon « Le son in »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : Les mots contraires »
      Et la leçon suivante ouvre la page de la leçon « Les mots contraires »

    Scénario: Une leçon d'après à découvrir est proposée même si une leçon d'avant n'est pas réussie
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « L'ordre alphabétique »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : Les mots contraires »
      Et la leçon suivante ouvre la page de la leçon « Les mots contraires »

    # Réponse N4
    Scénario: Quand toutes les leçons d'après sont réussies, la leçon suivante est la leçon juste après
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les mots contraires | 2       |
        | Le pluriel des noms | 1       |
      Et que Léa joue la séance complète de la leçon « L'ordre alphabétique »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : Les mots contraires »
      Et la leçon suivante ouvre la page de la leçon « Les mots contraires »

    Scénario: Après la dernière leçon du parcours, aucune leçon d'une autre matière n'est proposée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Le pluriel des noms »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Accueil » et « Rejouer »
      Mais aucune leçon suivante n'est proposée

    # Réponse N10
    Scénario: Après une leçon réussie d'une classe au-dessus, aucune leçon suivante n'est proposée
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon    | étoiles |
        | Le futur | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Et que Léa joue la séance complète de la leçon « Le futur »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Accueil » et « Rejouer »
      Mais aucune leçon suivante n'est proposée

  Règle: Le parcours se lit sans réseau, au lecteur d'écran, au clavier et sur un petit écran

    Scénario: Sans réseau, le parcours se met à jour après une séance
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que le réseau est coupé
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors le parcours montre « Le son in » réussie avec 1 étoile
      Et « L'ordre alphabétique » est la prochaine leçon

    Scénario: Un lecteur d'écran lit l'état de chaque leçon du parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Quand Léa ouvre le parcours de français
      Alors les lecteurs d'écran annoncent les leçons du parcours ainsi :
        | annonce                                  |
        | Le son in : réussie, 2 étoiles sur 3     |
        | L'ordre alphabétique : à toi !           |
        | Les mots contraires : à découvrir        |
        | Le pluriel des noms : à découvrir        |

    # Réponse N1
    Scénario: Un lecteur d'écran lit le niveau d'une leçon réussie d'une classe au-dessus
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon    | étoiles |
        | Le futur | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre le parcours de français
      Alors les lecteurs d'écran annoncent « Le futur, CE2 : réussie, 2 étoiles sur 3 »

    Scénario: Les matières du parcours se choisissent au clavier
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a ouvert le parcours de français
      Quand Léa passe à l'onglet de matière suivant au clavier
      Alors le titre du parcours est « Mathématiques · CE1 »
      Et le focus est sur « Maths »

    Scénario: Le parcours tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa ouvre le parcours de français
      Alors la page tient dans la largeur de l'écran
      Et chaque onglet de matière et chaque leçon du parcours mesurent au moins 44 px de haut

  Règle: Seul un parent rattaché au profil enfant lit la progression qui fait le parcours

    @acces
    Scénario: Le second parent rattaché retrouve le parcours de Léa sur son téléphone
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Marie est rattachée au profil enfant de Léa
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Quand Léa ouvre le parcours de français sur le téléphone de Marie
      Alors le parcours montre « Le son in » réussie avec 2 étoiles
      Et « L'ordre alphabétique » est la prochaine leçon

    @acces
    Scénario: Le parcours d'un enfant ne montre jamais les étoiles d'un autre enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 3       |
      Quand Léa ouvre le parcours de français
      Alors « Le son in » est la prochaine leçon
      Et le parcours indique « 0 leçon réussie sur 4 »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas la progression de Léa
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 2       |
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les étoiles du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
