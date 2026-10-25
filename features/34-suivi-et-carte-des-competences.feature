# language: fr
@issue-34
Fonctionnalité: Suivi et carte des compétences
  En tant que parent
  Je veux voir la progression de chacun de mes enfants : leçons réussies, étoiles, séances jouées,
  erreurs corrigées pour de bon, carte des compétences et leçons jouées
  Afin de savoir où il en est et de l'aider

  Le suivi est une vue calculée à l'affichage : il lit les faits d'Apprentissage (meilleures étoiles, séances
  terminées, résultat du test de départ, file de révision) et les sections du programme du Catalogue. Il ne modifie
  rien et ne recalcule aucune étoile.
  Il montre un seul enfant à la fois, l'enfant suivi, choisi par le parent ; à l'ouverture, le premier profil
  enfant dans l'ordre de création (réponse 34.8). Ses chiffres ne comptent que la classe en cours, c'est-à-dire le
  niveau actuel du profil enfant ; les leçons jouées des autres classes sont listées à part (réponse 34.11).

  Ces scénarios utilisent la vraie bibliothèque et le vrai index des programmes. Sections et leçons citées :
  - CE1, français, Lecture : « Comprendre un texte » (« L'ordre alphabétique », « Lecture : La cabane dans l'arbre ») ;
  - CE1, français, Écriture : « Apprendre à écrire en écriture cursive » (aucune leçon) ;
  - CE1, français, Vocabulaire : « Établir des relations entre les mots » (« Les mots contraires ») ;
  - CE1, français, Grammaire et orthographe : « Découvrir, comprendre et mettre en œuvre l’orthographe grammaticale »
    (« Le pluriel des noms », « a ou à ? », « Le présent des verbes en -er ») ;
  - CE1, maths : « Les nombres entiers » (« Les nombres jusqu'à 1000 »), « Mémoriser des faits numériques »
    (« Les tables de 2 et de 5 », dont la fluence « Calcul rapide : tables de 2 à 5 ») ;
  - CP, français : « Les sons ou, on, an » ; CE2, français : « L'imparfait » ;
  - CM1 et CM2, français : « Imaginer et vivre d’autres vies » (« Vivre d'autres vies : Robinson Crusoé », du CM2).
  Dans le tableau « Léa a terminé ces séances », une étoile « – » est une séance de fluence seule, sans étoile.
  Paul est rattaché au profil enfant de Léa (et de Tom quand il est cité) ; Claire n'y est pas rattachée.
  Un commentaire « Réponse 34.n » renvoie aux décisions du PO dans docs/stories/34/acceptance.md (« I<n> » : une
  interprétation de ces décisions, reprise du modèle du domaine).

  Contexte:
    Étant donné que Paul est connecté sur la tablette

  Règle: Le suivi est en tête de l'espace parent et montre un enfant à la fois, choisi par le parent ; à l'ouverture, le premier profil enfant dans l'ordre de création

    # Réponse 34.18
    Scénario: Le suivi est la première partie de l'espace parent
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Paul entre dans l'espace parent
      Alors la première partie de l'espace parent est « Suivi », avant « Profils »

    # Réponse 34.8 (I8, I9)
    Scénario: À l'ouverture, le suivi montre le premier enfant dans l'ordre de création, et propose de choisir les autres
      Étant donné que Paul a créé le profil enfant "Tom" de niveau CM1 dans l'univers « Sports »
      Et que Paul a créé ensuite le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Quand Paul consulte le suivi
      Alors l'enfant suivi est « Tom · CM1 »
      Et le suivi propose de choisir, dans l'ordre, « Tom · CM1 » et « Léa · CE1 »
      Mais aucun suivi de Léa n'apparaît

    # Réponse 34.8
    Scénario: Le parent choisit l'enfant dont il voit le suivi
      Étant donné que Paul a créé le profil enfant "Tom" de niveau CM1 dans l'univers « Sports »
      Et que Paul a créé ensuite le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Et que Paul consulte le suivi
      Quand Paul choisit « Léa · CE1 » dans le suivi
      Alors l'enfant suivi est « Léa · CE1 »
      Et le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 1               | 2       | 1              | 0                             |

    # Réponse 34.8 (I9)
    Scénario: Avec un seul profil enfant, le choix de l'enfant est affiché et déjà fait
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Paul consulte le suivi
      Alors l'enfant suivi est « Léa · CE1 »
      Et le suivi propose de choisir, dans l'ordre, « Léa · CE1 »

    # Réponses 34.15 et 34.17
    Scénario: Le suivi d'un enfant montre ses chiffres, puis la carte des compétences, puis les leçons jouées
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Quand Paul consulte le suivi
      Alors les parties du suivi de Léa se suivent ainsi : « Léa · CE1 », les chiffres du suivi, « Carte des compétences du programme (CE1) », « Toutes les leçons jouées »
      Mais aucun bilan des 7 derniers jours n'est montré

    # Réponse 34.18
    Scénario: Sans profil enfant, le suivi invite à en créer un
      Étant donné que Paul n'a aucun profil enfant
      Quand Paul consulte le suivi
      Alors Paul voit le message « Aucun profil pour l'instant. Crée-en un dans la partie Profils. »

  Règle: Les chiffres du suivi comptent, pour la classe en cours, les leçons réussies, le total des étoiles et les séances terminées, ainsi que toutes les séances de révision et les erreurs corrigées pour de bon

    Scénario: Un enfant qui n'a rien joué a ses quatre chiffres à 0
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Paul consulte le suivi
      Alors le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 0               | 0       | 0              | 0                             |

    # Réponse 34.11 (I1)
    Scénario: Les chiffres ne comptent que les leçons de la classe en cours, avec leurs meilleures étoiles
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Les sons ou, on, an | 06/10/2026 | 0       | 3       |
        | Les mots contraires | 12/10/2026 | 5       | 1       |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Quand Paul consulte le suivi
      Alors le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 2               | 3       | 2              | 0                             |

    Scénario: Une leçon rejouée compte une fois, avec ses meilleures étoiles, et chacune de ses séances est jouée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 10/10/2026 | 5       | 1       |
        | Le pluriel des noms | 14/10/2026 | 0       | 3       |
        | Le pluriel des noms | 18/10/2026 | 2       | 2       |
      Quand Paul consulte le suivi
      Alors le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 1               | 3       | 3              | 0                             |

    # Réponses 34.3, 34.5 et 34.11
    Scénario: Les leçons de la classe en cours réussies au test de départ comptent parmi les leçons réussies, sans étoile ni séance jouée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon                |
        | Les sons ou, on, an  |
        | L'ordre alphabétique |
        | Les mots contraires  |
      Et que Léa a terminé ces séances :
        | leçon                     | le         | erreurs | étoiles |
        | Le pluriel des noms       | 14/10/2026 | 5       | 1       |
        | Les nombres jusqu'à 1000  | 15/10/2026 | 2       | 2       |
      Quand Paul consulte le suivi
      Alors le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 4               | 3       | 2              | 0                             |

    # Réponses 34.5 et 34.12
    Scénario: Une séance de fluence seule compte parmi les séances jouées, sans rendre sa leçon réussie
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon                   | le         | erreurs | étoiles |
        | Les tables de 2 et de 5 | 16/10/2026 | 2       | –       |
      Quand Paul consulte le suivi
      Alors le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 0               | 0       | 1              | 0                             |

    # Réponses 34.5 et 34.11 (I2, I3)
    Scénario: Toutes les séances de révision et toutes les erreurs corrigées pour de bon comptent, quelle que soit la classe
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 5       | 1       |
        | Les mots contraires | 15/10/2026 | 2       | 2       |
        | Les sons ou, on, an | 16/10/2026 | 0       | 3       |
      Et que Léa a terminé 3 séances de révision
      Et que Léa a 4 erreurs corrigées pour de bon
      Quand Paul consulte le suivi
      Alors le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 2               | 3       | 5              | 4                             |

    # Réponses 34.13 et 34.29
    Scénario: Une leçon qui n'est plus dans la bibliothèque n'est comptée nulle part dans les chiffres
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Et que Léa a terminé, le 15/10/2026, une séance à 3 étoiles d'une leçon qui n'est plus dans la bibliothèque
      Quand Paul consulte le suivi
      Alors le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 1               | 2       | 1              | 0                             |
      Et la leçon qui n'est plus dans la bibliothèque n'apparaît pas dans les leçons jouées de Léa

  Règle: La carte des compétences montre chaque section du programme du niveau de l'enfant, regroupée par matière puis par domaine, avec les titres de ses leçons

    # Réponse 34.1
    Scénario: La carte des compétences est repliée et porte le niveau de l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Paul consulte le suivi
      Alors le bloc « Carte des compétences » est replié et s'intitule « Carte des compétences du programme (CE1) »

    # Réponses 34.1 et 34.23
    Scénario: La carte des compétences d'un enfant de CE1 regroupe les sections du CE1 par matière, puis par domaine, dans l'ordre du programme
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors les matières de la carte se suivent ainsi : « Français », « Mathématiques », « Sciences », « Histoire et géographie », « Anglais »
      Et les domaines du français se suivent ainsi : « Lecture », « Écriture », « Oral », « Vocabulaire », « Grammaire et orthographe »
      Mais aucune matière « Vivre ensemble (EMC) » n'apparaît dans la carte

    # Réponse 34.1
    Scénario: Une ligne de la carte montre la section et les titres de ses leçons
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la ligne « Comprendre un texte » de la carte montre les leçons « L'ordre alphabétique » et « Lecture : La cabane dans l'arbre »
      Et la ligne « Apprendre à écrire en écriture cursive » de la carte ne montre aucune leçon

    # Réponses 34.1 et 34.11 (I1, I11)
    Scénario: Après un changement de classe, le suivi, ses chiffres et la carte suivent le nouveau niveau
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE2
      Quand Paul consulte le suivi
      Alors l'enfant suivi est « Léa · CE2 »
      Et le bloc « Carte des compétences » est replié et s'intitule « Carte des compétences du programme (CE2) »
      Et le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 0               | 0       | 0              | 0                             |

  Règle: Une section est acquise dès qu'une de ses leçons est acquise, en cours dès qu'une de ses leçons a une séance terminée, à faire sinon, et « pas encore de leçon » sans leçon

    # Réponse 34.1
    Scénario: Sans aucune leçon jouée, une section qui a des leçons est à faire, une section sans leçon n'en a pas encore
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la carte des compétences de Léa montre, entre autres :
        | section                                 | état                |
        | Comprendre un texte                     | à faire             |
        | Apprendre à écrire en écriture cursive  | pas encore de leçon |

    # Réponses 34.1 et 34.2
    Plan du Scénario: Une leçon à <étoiles> étoile(s) rend sa section « <état> »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs   | étoiles   |
        | Les mots contraires | 14/10/2026 | <erreurs> | <étoiles> |
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la ligne « Établir des relations entre les mots » de la carte est « <état> »

      Exemples:
        | étoiles | erreurs | état     |
        | 1       | 5       | en cours |
        | 2       | 2       | acquise  |
        | 3       | 0       | acquise  |

    # Réponses 34.2 et 34.10
    Scénario: Une seule leçon acquise suffit pour que sa section soit acquise
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | a ou à ?            | 12/10/2026 | 5       | 1       |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la ligne « Découvrir, comprendre et mettre en œuvre l’orthographe grammaticale » de la carte est « acquise »

    # Réponse 34.4
    Scénario: Une section dont la seule leçon réussie l'est au test de départ reste à faire
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon               |
        | Les mots contraires |
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la ligne « Établir des relations entre les mots » de la carte est « à faire »

    # Réponse 34.12
    Scénario: Une leçon jouée seulement en fluence seule met sa section en cours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon                   | le         | erreurs | étoiles |
        | Les tables de 2 et de 5 | 16/10/2026 | 2       | –       |
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la ligne « Mémoriser des faits numériques » de la carte est « en cours »

    # Réponses 34.2 et 34.9 (I11)
    Scénario: Une section du CM1 et du CM2 compte les leçons de ses deux niveaux
      Étant donné que Léa a un profil enfant préparé de niveau CM1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon                                 | le         | erreurs | étoiles |
        | Vivre d'autres vies : Robinson Crusoé | 14/10/2026 | 0       | 3       |
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la ligne « Imaginer et vivre d’autres vies » de la carte est « acquise »
      Et la ligne « Imaginer et vivre d’autres vies » de la carte montre la leçon « Vivre d'autres vies : Robinson Crusoé »

    # Réponse 34.2
    Scénario: La légende de la carte compte les sections de chaque état
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
        | Les mots contraires | 15/10/2026 | 5       | 1       |
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors la légende de la carte indique « acquise (1) » et « en cours (1) »
      Et les nombres de la légende font ensemble le nombre de lignes de la carte

  Règle: Les leçons jouées de la classe en cours sont listées, la plus récente d'abord, avec leurs meilleures étoiles et leur dernière séance ; celles des autres classes sont à part, avec leur mention

    Scénario: Sans leçon jouée, le suivi le dit, et la carte des compétences reste proposée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa indiquent « Pas encore de leçon jouée. »
      Et aucune leçon jouée d'une autre classe n'est montrée
      Et le bloc « Carte des compétences » est replié et s'intitule « Carte des compétences du programme (CE1) »

    # Réponse 34.26
    Scénario: Les leçons jouées sont dans un bloc replié
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Quand Paul consulte le suivi
      Alors le bloc « Toutes les leçons jouées » est replié et s'intitule « Toutes les leçons jouées »

    # Réponses 34.7, 34.23 et 34.24
    Scénario: Chaque leçon jouée montre sa matière, ses étoiles, ses erreurs de la dernière séance et sa date, la plus récente d'abord
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon                    | le         | erreurs | étoiles |
        | Les mots contraires      | 12/10/2026 | 5       | 1       |
        | Les nombres jusqu'à 1000 | 12/10/2026 | 0       | 3       |
        | Le pluriel des noms      | 14/10/2026 | 2       | 2       |
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa montrent, dans l'ordre :
        | leçon                    | matière       | étoiles | erreurs (dernière fois) | dernière séance |
        | Le pluriel des noms      | Français      | ★★      | 2                       | 14/10/2026      |
        | Les mots contraires      | Français      | ★       | 5                       | 12/10/2026      |
        | Les nombres jusqu'à 1000 | Mathématiques | ★★★     | 0                       | 12/10/2026      |

    # Réponse 34.7
    Scénario: Une leçon rejouée montre ses meilleures étoiles, mais les erreurs et la date de sa dernière séance
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 10/10/2026 | 0       | 3       |
        | Le pluriel des noms | 18/10/2026 | 5       | 1       |
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa montrent, dans l'ordre :
        | leçon               | matière  | étoiles | erreurs (dernière fois) | dernière séance |
        | Le pluriel des noms | Français | ★★★     | 5                       | 18/10/2026      |

    # Réponse 34.14
    Scénario: Une leçon réussie au test de départ est listée comme telle, sans erreurs, à la date du test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ le 05/10/2026, avec pour leçons réussies au test de départ :
        | leçon               |
        | Les mots contraires |
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa montrent, dans l'ordre :
        | leçon               | matière  | étoiles                   | erreurs (dernière fois) | dernière séance |
        | Les mots contraires | Français | réussie au test de départ | –                       | 05/10/2026      |

    # Réponse 34.14
    Scénario: Après une séance, une leçon réussie au test de départ montre ses étoiles et la date de cette séance
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ le 05/10/2026, avec pour leçons réussies au test de départ :
        | leçon               |
        | Les mots contraires |
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Les mots contraires | 12/10/2026 | 5       | 1       |
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa montrent, dans l'ordre :
        | leçon               | matière  | étoiles | erreurs (dernière fois) | dernière séance |
        | Les mots contraires | Français | ★       | 5                       | 12/10/2026      |

    # Réponse 34.12
    Scénario: Une leçon jouée seulement en fluence seule est listée sans étoile, avec ses erreurs
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon                   | le         | erreurs | étoiles |
        | Les tables de 2 et de 5 | 16/10/2026 | 2       | –       |
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa montrent, dans l'ordre :
        | leçon                   | matière       | étoiles | erreurs (dernière fois) | dernière séance |
        | Les tables de 2 et de 5 | Mathématiques | –       | 2                       | 16/10/2026      |

    # Réponse 34.11 (I5, I6)
    Scénario: Les leçons jouées des classes précédentes sont listées à part, après la classe en cours, avec la mention « classe précédente »
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | L'imparfait         | 14/10/2026 | 2       | 2       |
        | Le pluriel des noms | 18/10/2026 | 0       | 3       |
        | Les sons ou, on, an | 20/10/2026 | 5       | 1       |
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa montrent, dans l'ordre :
        | leçon       | matière  | étoiles | erreurs (dernière fois) | dernière séance |
        | L'imparfait | Français | ★★      | 2                       | 14/10/2026      |
      Et les leçons jouées des autres classes de Léa montrent, à part et dans l'ordre :
        | leçon               | mention            | étoiles | erreurs (dernière fois) | dernière séance |
        | Les sons ou, on, an | classe précédente  | ★       | 5                       | 20/10/2026      |
        | Le pluriel des noms | classe précédente  | ★★★     | 0                       | 18/10/2026      |

    # Réponse 34.11 (I7)
    Scénario: Sans leçon jouée de la classe en cours, le suivi le dit, et montre à part les leçons des classes précédentes
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Les sons ou, on, an | 06/10/2026 | 0       | 3       |
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa indiquent « Pas encore de leçon jouée. »
      Et les leçons jouées des autres classes de Léa montrent, à part et dans l'ordre :
        | leçon               | mention           | étoiles | erreurs (dernière fois) | dernière séance |
        | Les sons ou, on, an | classe précédente | ★★★     | 0                       | 06/10/2026      |

    # Réponse 34.11 (I4)
    Scénario: Redescendue de classe, l'enfant a ses leçons de la classe d'au-dessus à part, avec la mention « classe au-dessus »
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon       | le         | erreurs | étoiles |
        | L'imparfait | 14/10/2026 | 2       | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Paul consulte le suivi
      Alors les leçons jouées de Léa indiquent « Pas encore de leçon jouée. »
      Et les leçons jouées des autres classes de Léa montrent, à part et dans l'ordre :
        | leçon       | mention          | étoiles | erreurs (dernière fois) | dernière séance |
        | L'imparfait | classe au-dessus | ★★      | 2                       | 14/10/2026      |

  Règle: Le suivi demande le réseau, et se lit au lecteur d'écran, au clavier et sur un petit écran

    # Réponse 34.21
    Scénario: Sans réseau, le suivi dit qu'il a besoin d'Internet
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que le réseau est coupé
      Quand Paul consulte le suivi
      Alors Paul voit le message « Le suivi a besoin d'Internet. Réessaie dans un instant. »

    # Réponses 34.2 et 34.25
    Scénario: L'état de chaque ligne de la carte est écrit en toutes lettres et lu par un lecteur d'écran
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa
      Alors l'état de chaque ligne de la carte est écrit en toutes lettres, pas seulement par une couleur
      Et les lecteurs d'écran annoncent « Découvrir, comprendre et mettre en œuvre l’orthographe grammaticale : acquise »
      Et les lecteurs d'écran annoncent « Apprendre à écrire en écriture cursive : pas encore de leçon »

    # Réponse 34.24
    Scénario: Un lecteur d'écran lit en toutes lettres les étoiles d'une leçon jouée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Quand Paul consulte le suivi
      Alors les lecteurs d'écran lisent « 2 étoiles sur 3 » pour les étoiles de « Le pluriel des noms »

    # Réponse 34.26
    Scénario: La carte des compétences se déplie au clavier
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul consulte le suivi
      Quand Paul déplie la carte des compétences de Léa, au clavier seulement
      Alors les lecteurs d'écran annoncent le bouton « Carte des compétences du programme (CE1) », déplié
      Et la carte des compétences de Léa montre, entre autres :
        | section             | état    |
        | Comprendre un texte | à faire |

    # Réponse 34.8
    Scénario: L'enfant suivi se choisit au clavier
      Étant donné que Paul a créé le profil enfant "Tom" de niveau CM1 dans l'univers « Sports »
      Et que Paul a créé ensuite le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Et que Paul consulte le suivi
      Quand Paul choisit « Léa · CE1 » dans le suivi, au clavier seulement
      Alors l'enfant suivi est « Léa · CE1 »

    # Réponse 34.27
    Scénario: Le suivi tient dans un écran de 360 px de large, leçons jouées et carte dépliées
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon                                    | le         | erreurs | étoiles |
        | Le pluriel des noms                      | 14/10/2026 | 2       | 2       |
        | Lecture : La cabane dans l'arbre         | 15/10/2026 | 0       | 3       |
      Quand Paul consulte le suivi, carte des compétences et leçons jouées dépliées
      Alors la page tient dans la largeur de l'écran
      Et le choix de l'enfant et le bouton de chaque bloc du suivi mesurent au moins 44 px de haut

  Règle: Un parent ne voit le suivi que des profils enfants auxquels il est rattaché

    @acces
    Scénario: Un parent qui n'est pas rattaché ne peut pas choisir Léa dans le suivi, seulement ses propres enfants
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Et que Claire est rattachée au profil enfant "Tom" de niveau CM2
      Et que Claire est connectée sur le téléphone
      Quand Claire consulte le suivi
      Alors le suivi de Claire propose seulement « Tom · CM2 »
      Mais aucun suivi de Léa n'apparaît

    @acces
    Plan du Scénario: Même avec l'identifiant du profil enfant, un parent qui n'est pas rattaché ne lit pas <données> de Léa
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ le 05/10/2026, avec pour leçons réussies au test de départ :
        | leçon               |
        | Les mots contraires |
      Et que Léa a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 2       | 2       |
      Et que Claire est connectée sur le téléphone
      Quand Claire demande <données> du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

      Exemples:
        | données                        |
        | les étoiles                    |
        | les séances terminées          |
        | le résultat du test de départ  |

    @acces
    Plan du Scénario: Même avec l'identifiant du profil enfant, un parent qui n'est pas rattaché ne lit pas <données> de Léa (révisions)
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a terminé 3 séances de révision
      Et que Léa a 4 erreurs corrigées pour de bon
      Et que Claire est connectée sur le téléphone
      Quand Claire demande <données> du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

      Exemples:
        | données                                |
        | la file de révision                    |
        | les séances de révision terminées      |

    # Réponse 34.8
    @acces
    Scénario: Le suivi d'un enfant ne montre jamais les séances d'un autre enfant du même parent
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a terminé ces séances :
        | leçon               | le         | erreurs | étoiles |
        | Le pluriel des noms | 14/10/2026 | 0       | 3       |
      Quand Paul consulte le suivi
      Alors l'enfant suivi est « Léa · CE1 »
      Et les leçons jouées de Léa indiquent « Pas encore de leçon jouée. »
      Et le suivi de Léa indique :
        | leçons réussies | étoiles | séances jouées | erreurs corrigées pour de bon |
        | 0               | 0       | 0              | 0                             |
