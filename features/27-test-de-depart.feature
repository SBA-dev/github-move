# language: fr
@issue-27
Fonctionnalité: Test de départ
  En tant qu'enfant
  Je veux répondre à quelques questions de français et de maths au début
  Afin que mon parcours commence là où j'en suis, sans refaire ce que je sais déjà

  Le test de départ n'est pas une séance : il ne donne pas d'étoiles. Il rend des leçons réussies au test de départ,
  qui font avancer le parcours (aucun verrou, décisions de #25). Les commentaires « Réponse 27.n » renvoient
  aux décisions du PO dans docs/stories/27/acceptance.md.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test du test de départ
  (identifiants préfixés « e2e-27- », leçons servies dans le désordre). Chaque leçon a une étape de leçon et un seul
  exercice bulles d'une seule question, « <titre> : quelle est la bonne réponse ? », de choix « oui », « non » et
  « peut-être », de réponse « oui », sans aide :
  - français du CP : « Les voyelles » (ordre 10), « La dictée des sons » (18, un seul exercice de dictée, donc
    aucune question possible), « Les syllabes » (20), « Le son ou » (30), « Le son on » (40), « Le son an » (50) ;
  - maths du CP : « Compter jusqu'à 10 » (15), « Les nombres jusqu'à 20 » (25), « Les doubles » (35),
    « Les additions » (45) ;
  - français du CE1 : « Le son in » (10), « L'ordre alphabétique » (20), « Les mots contraires » (30),
    « Le pluriel des noms » (40), « Le féminin des noms » (50) ;
  - maths du CE1 : « Les nombres jusqu'à 100 » (15), « Les compléments à 10 » (25), « La soustraction » (35),
    « Les tables de 2 » (45) ;
  - français du CE2 : « Le futur » (10) ; sciences du CP : « Les cinq sens » (10).
  Pour un enfant de CE1, le test de départ pose donc, dans l'ordre, les questions de : Les voyelles, Compter jusqu'à 10,
  Les syllabes, Les nombres jusqu'à 20, Les doubles, Le son on, Le son an, Les nombres jusqu'à 100,
  L'ordre alphabétique, Les mots contraires, La soustraction, Les tables de 2.
  Dans les tableaux du parcours, « réussie au test de départ » est l'état d'une leçon réussie au test de départ,
  sans étoile ; « à toi » et « à découvrir » se lisent comme dans #25.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Claire n'y est pas rattachée.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que la bibliothèque de test du test de départ est servie

  Règle: Le test de départ est proposé après la création d'un profil enfant, puis depuis l'accueil de l'enfant tant qu'il n'est pas fait

    # Réponses 27.16 et 27.19
    Scénario: Juste après la création de son profil, le personnage guide propose le test de départ à l'enfant
      Étant donné que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Léa" de niveau CE1 dans l'univers « Animaux de la forêt »
      Alors la proposition du test de départ s'affiche pour Léa
      Et Noisette dit, et l'écran affiche :
        """
        Bonjour Léa ! Veux-tu faire un petit jeu de questions ? Ce n'est pas une interrogation : ça m'aide à savoir ce que tu sais déjà, pour commencer au bon endroit. Tu peux dire « Je ne sais pas », c'est permis !
        """
      Et la proposition du test de départ propose « Oui, on y va ! » et « Plus tard »

    # Réponses 27.16 et 27.19
    Scénario: Le test de départ est aussi proposé après l'ajout d'un deuxième enfant
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Tom" de niveau CP dans l'univers « Animaux de la forêt »
      Alors la proposition du test de départ s'affiche pour Tom

    Scénario: « Oui, on y va ! » commence le test de départ par sa première question, sans étape de leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que la proposition du test de départ est affichée pour Léa
      Quand Léa accepte la proposition du test de départ
      Alors Noisette dit, et l'écran affiche :
        """
        C'est parti ! Réponds tranquillement. Si tu ne sais pas, touche « Je ne sais pas ».
        """
      Et l'écran s'intitule « Mon test de départ », avec « Pour savoir où commencer »
      Et la question de « Les voyelles » s'affiche
      Mais Léa n'entend aucune étape de leçon

    # Réponse 27.10
    Plan du Scénario: Sans faire le test de départ, l'enfant revient à son accueil, qui le propose encore (<cas>)
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que la proposition du test de départ est affichée pour Léa
      Quand <geste>
      Alors Léa voit son accueil
      Et l'accueil de Léa propose « Mon test de départ »

      Exemples:
        | cas          | geste                                   |
        | « Plus tard » | Léa remet le test de départ à plus tard |
        | retour       | Léa revient en arrière                  |

    # Réponse 27.10
    Scénario: Tant que le test de départ n'est pas fait, l'accueil de l'enfant le propose
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit son accueil
      Et l'accueil de Léa propose « Mon test de départ »

    # Réponse 27.10
    Scénario: Depuis l'accueil de l'enfant, « Mon test de départ » ouvre la proposition
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre « Mon test de départ » depuis son accueil
      Alors la proposition du test de départ s'affiche pour Léa
      Et la proposition du test de départ propose « Oui, on y va ! » et « Plus tard »

    # Réponse 27.10
    Plan du Scénario: Un test de départ fait n'est plus proposé sur l'accueil de l'enfant (<cas>)
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, <déroulé>
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'accueil de Léa ne propose pas « Mon test de départ »

      Exemples:
        | cas                         | déroulé                                                                                |
        | allé jusqu'au bout          | en répondant juste à toutes les questions                                              |
        | arrêté après 3 questions    | avec des questions fausses à « Les voyelles », « Compter jusqu'à 10 » et « Les syllabes » |

    # Réponse 27.3
    Scénario: Un enfant qui change de classe ne se voit pas proposer de nouveau le test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a déjà fait le test de départ
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE2
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose pas « Mon test de départ »

    # Réponse 27.5
    Scénario: Sans bibliothèque chargée, le test de départ n'est pas proposé, sans message d'erreur
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que la bibliothèque ne peut pas être chargée
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit son accueil
      Mais l'accueil de Léa ne propose pas « Mon test de départ »

  Règle: Le test de départ pose au plus 12 questions de français et de maths, jusqu'au niveau de l'enfant, de la plus facile à la plus difficile

    Scénario: Le test de départ d'un enfant de CE1 pose 12 questions, du CP au CE1, de la plus facile à la plus difficile
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a commencé le test de départ
      Quand Léa répond juste à toutes les questions du test de départ
      Alors Léa a eu, dans l'ordre, les questions des leçons :
        | leçon                   | matière  | niveau |
        | Les voyelles            | français | CP     |
        | Compter jusqu'à 10      | maths    | CP     |
        | Les syllabes            | français | CP     |
        | Les nombres jusqu'à 20  | maths    | CP     |
        | Les doubles             | maths    | CP     |
        | Le son on               | français | CP     |
        | Le son an               | français | CP     |
        | Les nombres jusqu'à 100 | maths    | CE1    |
        | L'ordre alphabétique    | français | CE1    |
        | Les mots contraires     | français | CE1    |
        | La soustraction         | maths    | CE1    |
        | Les tables de 2         | maths    | CE1    |
      Mais aucune question de « Le futur » ni de « Les cinq sens »

    # Réponse 27.6
    Scénario: Une leçon sans question possible est sautée, et le test de départ d'un enfant de CP pose moins de 12 questions
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa a commencé le test de départ
      Quand Léa répond juste à toutes les questions du test de départ
      Alors Léa a eu, dans l'ordre, les questions des leçons :
        | leçon                  | matière  | niveau |
        | Les voyelles           | français | CP     |
        | Compter jusqu'à 10     | maths    | CP     |
        | Les syllabes           | français | CP     |
        | Les nombres jusqu'à 20 | maths    | CP     |
        | Le son ou              | français | CP     |
        | Les doubles            | maths    | CP     |
        | Le son on              | français | CP     |
        | Les additions          | maths    | CP     |
        | Le son an              | français | CP     |
      Mais aucune question de « La dictée des sons »

  Règle: Une question du test de départ est juste seulement sans aucune erreur ; « Je ne sais pas » est toujours permis, et l'enfant donne la bonne réponse pour continuer

    Scénario: « Je ne sais pas » est proposé dès la première question du test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que la proposition du test de départ est affichée pour Léa
      Quand Léa accepte la proposition du test de départ
      Alors « Je ne sais pas » est proposé à Léa

    Scénario: Après « Je ne sais pas » et la bonne réponse, la question suivante propose de nouveau « Je ne sais pas »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa en est à la question de « Les voyelles » du test de départ
      Quand Léa dit « Je ne sais pas » à la question de « Les voyelles », puis donne la bonne réponse
      Alors la question de « Compter jusqu'à 10 » s'affiche
      Et « Je ne sais pas » est de nouveau proposé à Léa

    Scénario: Après une erreur, le personnage guide encourage et la même question reste posée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa en est à la question de « Les voyelles » du test de départ
      Quand Léa se trompe à la question de « Les voyelles »
      Alors Noisette dit un encouragement, suivi de « Essaie une autre bulle. »
      Et la question de « Les voyelles » reste posée

    # Réponse 27.2
    Plan du Scénario: Une question répondue <manière> est <résultat>, ce qui fixe la prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, en répondant à la question de « L'ordre alphabétique » <manière>, et juste aux autres
      Quand Léa ouvre le parcours de français
      Alors « <prochaine leçon> » est la prochaine leçon

      Exemples:
        | manière                              | résultat | prochaine leçon      |
        | du premier coup                      | juste    | Le pluriel des noms  |
        | après s'être trompée une fois        | fausse   | L'ordre alphabétique |
        | après avoir dit « Je ne sais pas »   | fausse   | L'ordre alphabétique |

  Règle: Le test de départ s'arrête après 3 questions fausses de suite ; quitté en cours, il n'enregistre rien

    Plan du Scénario: Après 3 questions fausses de suite, le test de départ s'arrête (la troisième : <cas>)
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « Compter jusqu'à 10 », avec des questions fausses à « Les voyelles » et « Compter jusqu'à 10 »
      Quand Léa <réponse> à la question de « Les syllabes », puis donne la bonne réponse
      Alors la fin du test de départ s'affiche
      Mais aucune question de « Les nombres jusqu'à 20 » n'est posée

      Exemples:
        | cas                 | réponse                   |
        | une erreur          | se trompe                 |
        | « Je ne sais pas »  | dit « Je ne sais pas »    |

    Scénario: Une question juste remet à zéro le compte des questions fausses de suite
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « Les nombres jusqu'à 20 », avec des questions fausses à « Les voyelles », « Compter jusqu'à 10 » et « Les nombres jusqu'à 20 »
      Quand Léa se trompe à la question de « Les doubles », puis donne la bonne réponse
      Alors la question de « Le son on » s'affiche

    # Réponse 27.13
    Scénario: Plusieurs erreurs à une même question ne comptent que pour une question fausse
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa en est à la question de « Les voyelles » du test de départ
      Quand Léa se trompe 3 fois à la question de « Les voyelles », puis donne la bonne réponse
      Alors la question de « Compter jusqu'à 10 » s'affiche

    # Réponse 27.10
    Scénario: Quitter le test de départ en cours ramène à l'accueil, qui le propose encore
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « Les mots contraires »
      Quand Léa quitte le test de départ
      Alors Léa voit son accueil
      Et l'accueil de Léa propose « Mon test de départ »

    Scénario: Un test de départ quitté en cours ne change pas le parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a quitté le test de départ après la question de « Les mots contraires »
      Quand Léa ouvre le parcours de français
      Alors « Le son in » est la prochaine leçon
      Et le parcours indique « 0 leçon réussie sur 5 »

  Règle: Le parcours commence à la première leçon que l'enfant ne sait pas, et le test de départ ne change jamais une étoile

    # Réponses 27.2 et 27.7
    Scénario: Toutes les leçons jusqu'à la dernière question juste d'une matière sont réussies, même celles qui n'ont pas été posées
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, en répondant juste à toutes les questions
      Quand Léa ouvre le parcours de français
      Alors le parcours montre :
        | place | leçon                | état                      |
        | 1     | Le son in            | réussie au test de départ |
        | 2     | L'ordre alphabétique | réussie au test de départ |
        | 3     | Les mots contraires  | réussie au test de départ |
        | 4     | Le pluriel des noms  | à toi                     |
        | 5     | Le féminin des noms  | à découvrir               |

    # Réponses 27.2 et 27.7
    Scénario: Le parcours commence à la première leçon dont la question est fausse
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, avec une question fausse à « L'ordre alphabétique »
      Quand Léa ouvre le parcours de français
      Alors le parcours montre :
        | place | leçon                | état                      |
        | 1     | Le son in            | réussie au test de départ |
        | 2     | L'ordre alphabétique | à toi                     |
        | 3     | Les mots contraires  | réussie au test de départ |
        | 4     | Le pluriel des noms  | à découvrir               |
        | 5     | Le féminin des noms  | à découvrir               |

    # Réponses 27.2 et 27.7
    Scénario: Une matière dont toutes les leçons sont réussies au test de départ n'a plus de prochaine leçon
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, avec une question fausse à « L'ordre alphabétique »
      Quand Léa choisit « Maths » dans son parcours
      Alors aucune leçon du parcours n'est marquée « À toi ! »

    Scénario: Sans aucune question juste, le parcours ne change pas
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, avec des questions fausses à « Les voyelles », « Compter jusqu'à 10 » et « Les syllabes »
      Quand Léa ouvre le parcours de français
      Alors « Le son in » est la prochaine leçon
      Et le parcours indique « 0 leçon réussie sur 5 »

    Scénario: Une leçon déjà réussie en séance garde ses étoiles après le test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | Le son in | 3       |
      Et que Léa a fait le test de départ, en répondant juste à toutes les questions
      Quand Léa ouvre le parcours de français
      Alors le parcours montre « Le son in » réussie avec 3 étoiles

    Scénario: Une question fausse ne retire pas les étoiles d'une leçon déjà réussie
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | L'ordre alphabétique | 2       |
      Et que Léa a fait le test de départ, avec une question fausse à « L'ordre alphabétique »
      Quand Léa ouvre le parcours de français
      Alors le parcours montre « L'ordre alphabétique » réussie avec 2 étoiles

    # Réponse 27.7
    Scénario: Une séance terminée donne ses étoiles à une leçon réussie au test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon     |
        | Le son in |
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa ouvre le parcours de français
      Alors le parcours montre « Le son in » réussie avec 1 étoile

    # Réponse 27.8
    Scénario: Les leçons réussies au test de départ comptent parmi les leçons réussies du parcours
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon                |
        | Le son in            |
        | L'ordre alphabétique |
      Et que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les mots contraires | 2       |
      Quand Léa ouvre le parcours de français
      Alors le parcours indique « 3 leçons réussies sur 5 »

    # Réponse 27.8
    Scénario: La leçon suivante saute une leçon réussie au test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon                |
        | L'ordre alphabétique |
      Et que Léa joue la séance complète de la leçon « Le son in »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : Les mots contraires »
      Et la leçon suivante ouvre la page de la leçon « Les mots contraires »

    # Réponse 27.15
    Scénario: Redescendue en CE1, l'enfant retrouve à part sa leçon de CE2 réussie au test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon    |
        | Le futur |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre le parcours de français
      Alors le bloc « Déjà réussies en CE2 » du parcours montre, et seulement elles :
        | leçon    | niveau | état                      |
        | Le futur | CE2    | réussie au test de départ |
      Et les lecteurs d'écran annoncent « Le futur, CE2 : réussie au test de départ »

  Règle: La fin du test de départ dit à l'enfant combien de leçons il connaît déjà, sans étoiles, et le mène à son parcours

    Scénario: La fin du test de départ ne montre pas d'étoiles et propose seulement « Voir mon parcours »
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « La soustraction »
      Quand Léa répond juste à la question de « Les tables de 2 »
      Alors la fin du test de départ propose seulement « Voir mon parcours »
      Et la fin du test de départ ne montre aucune étoile
      Et le focus est sur « Voir mon parcours »

    # Réponses 27.2, 27.14 et 27.23
    Scénario: Le personnage guide dit combien de leçons l'enfant connaît déjà, celles des classes d'avant comprises
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « La soustraction »
      Quand Léa répond juste à la question de « Les tables de 2 »
      Alors Noisette dit « Merci Léa ! Tu connais déjà 17 leçons : je les ai cochées. Ton parcours t'attend ! »

    # Réponse 27.17
    Scénario: Avec une seule leçon connue, le personnage guide le dit au singulier
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « Les syllabes », avec des questions fausses à « Compter jusqu'à 10 » et « Les syllabes »
      Quand Léa se trompe à la question de « Les nombres jusqu'à 20 », puis donne la bonne réponse
      Alors Noisette dit « Merci Léa ! Tu connais déjà 1 leçon : je l'ai cochée. Ton parcours t'attend ! »

    Scénario: Sans question juste, le personnage guide dit qu'il sait par où commencer
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « Compter jusqu'à 10 », avec des questions fausses à « Les voyelles » et « Compter jusqu'à 10 »
      Quand Léa se trompe à la question de « Les syllabes », puis donne la bonne réponse
      Alors Noisette dit « Merci Léa ! Maintenant, je sais par où commencer. Ton parcours t'attend ! »

    # Réponse 27.14
    Scénario: Une leçon déjà réussie avant le test de départ n'est pas comptée parmi les leçons connues
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 2       |
      Et que Léa a répondu au test de départ jusqu'à « Les syllabes », avec des questions fausses à « Compter jusqu'à 10 » et « Les syllabes »
      Quand Léa se trompe à la question de « Les nombres jusqu'à 20 », puis donne la bonne réponse
      Alors Noisette dit « Merci Léa ! Maintenant, je sais par où commencer. Ton parcours t'attend ! »

    # Réponse 27.21
    Scénario: « Voir mon parcours » ouvre le parcours de l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a fait le test de départ, en répondant juste à toutes les questions
      Quand Léa choisit « Voir mon parcours »
      Alors le titre du parcours est « Français · CE1 »

  Règle: Le parent peut proposer de nouveau le test de départ depuis l'espace parent ; une leçon réussie au test de départ le reste

    Scénario: Depuis l'espace parent, « Refaire le test de départ » propose de nouveau le test de départ à l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a déjà fait le test de départ
      Et que Paul est dans l'espace parent
      Quand Paul choisit « Refaire le test de départ » pour Léa
      Alors la proposition du test de départ s'affiche pour Léa

    # Réponse 27.9
    Scénario: Un test de départ refait pose aussi des questions sur les leçons déjà réussies
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les voyelles | 3       |
      Et que Léa a déjà fait le test de départ
      Et que Paul a proposé de nouveau le test de départ à Léa depuis l'espace parent
      Quand Léa accepte la proposition du test de départ
      Alors la question de « Les voyelles » s'affiche

    # Réponse 27.9
    Scénario: Une leçon réussie à un test de départ le reste, même si sa question est fausse au suivant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon                |
        | Le son in            |
        | L'ordre alphabétique |
      Et que Léa a refait le test de départ, avec une question fausse à « L'ordre alphabétique »
      Quand Léa ouvre le parcours de français
      Alors le parcours montre :
        | place | leçon                | état                      |
        | 1     | Le son in            | réussie au test de départ |
        | 2     | L'ordre alphabétique | réussie au test de départ |
        | 3     | Les mots contraires  | réussie au test de départ |
        | 4     | Le pluriel des noms  | à toi                     |
        | 5     | Le féminin des noms  | à découvrir               |

    # Réponse 27.9
    Scénario: Après « Plus tard », un test de départ proposé de nouveau par le parent reste fait
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a déjà fait le test de départ
      Et que Paul a proposé de nouveau le test de départ à Léa depuis l'espace parent
      Quand Léa remet le test de départ à plus tard
      Alors Léa voit son accueil
      Mais l'accueil de Léa ne propose pas « Mon test de départ »

  Règle: Le test de départ se joue sans réseau, à voix haute, au clavier et sur un petit écran

    # Réponse 27.2
    Scénario: Sans réseau, le test de départ se joue jusqu'au bout et le parcours se met à jour tout de suite
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que le réseau est coupé
      Et que Léa a fait le test de départ, en répondant juste à toutes les questions
      Quand Léa ouvre le parcours de français
      Alors « Le pluriel des noms » est la prochaine leçon

    # Réponse 27.18
    Scénario: Sans réseau, la fin du test de départ dit que la progression est gardée sur l'appareil
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a répondu au test de départ jusqu'à « La soustraction »
      Et que le réseau est coupé
      Quand Léa répond juste à la question de « Les tables de 2 »
      Alors la fin du test de départ propose seulement « Voir mon parcours »
      Et elle voit le message « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. »

    Scénario: Le personnage guide lit chaque question du test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa en est à la question de « Les voyelles » du test de départ
      Quand Léa répond juste à la question de « Les voyelles »
      Alors Léa entend Noisette lire « Compter jusqu'à 10 : quelle est la bonne réponse ? »

    # Réponse 27.7
    Scénario: Un lecteur d'écran lit qu'une leçon est réussie au test de départ
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon     |
        | Le son in |
      Quand Léa ouvre le parcours de français
      Alors les lecteurs d'écran annoncent les leçons du parcours ainsi :
        | annonce                                    |
        | Le son in : réussie au test de départ      |
        | L'ordre alphabétique : à toi !             |
        | Les mots contraires : à découvrir          |
        | Le pluriel des noms : à découvrir          |
        | Le féminin des noms : à découvrir          |

    Scénario: Le test de départ se commence et se joue au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que la proposition du test de départ est affichée pour Léa
      Quand Léa accepte la proposition du test de départ, au clavier seulement
      Alors la question de « Les voyelles » s'affiche

    Scénario: La proposition du test de départ tient dans un écran de 360 px, avec des boutons assez grands pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre « Mon test de départ » depuis son accueil
      Alors la page tient dans la largeur de l'écran
      Et « Oui, on y va ! » et « Plus tard » mesurent au moins 44 px de haut

    Scénario: Une question du test de départ tient dans un écran de 360 px, « Je ne sais pas » compris
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que la proposition du test de départ est affichée pour Léa
      Quand Léa accepte la proposition du test de départ
      Alors la page tient dans la largeur de l'écran
      Et chaque choix mesure au moins 44 px de haut et de large
      Et « Je ne sais pas » mesure au moins 44 px de haut

  Règle: Le résultat du test de départ est enregistré par le serveur, et seulement pour un parent rattaché au profil enfant

    @acces
    Scénario: Un test de départ terminé envoyé par l'appareil est enregistré et se retrouve sur un autre appareil du parent
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Quand l'appareil envoie pour Léa un test de départ terminé d'une seule question, juste, de la leçon « Les sons ou, on, an »
      Alors l'accueil de Léa ne propose pas « Mon test de départ » sur le téléphone de Paul

    Plan du Scénario: Le serveur refuse un test de départ terminé incohérent, qui reste à faire (<cas>)
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Quand l'appareil envoie pour Léa un test de départ terminé <cas>
      Alors l'enregistrement est refusé
      Et l'accueil de Léa propose « Mon test de départ » sur le téléphone de Paul

      Exemples:
        | cas                                                   |
        | dont une question vient d'une leçon de CE1            |
        | qui continue après 3 questions fausses de suite       |
        | dont une question ne finit pas par la bonne réponse   |

    @acces
    Scénario: Le second parent rattaché retrouve sur son téléphone le parcours que le test de départ a fait avancer
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Marie est rattachée au profil enfant de Léa
      Et que Léa a pour leçons réussies au test de départ :
        | leçon     |
        | Le son in |
      Quand Léa ouvre le parcours de français sur le téléphone de Marie
      Alors « L'ordre alphabétique » est la prochaine leçon

    @acces
    Scénario: Le test de départ d'un enfant ne fait jamais avancer le parcours d'un autre enfant
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a pour leçons réussies au test de départ :
        | leçon     |
        | Le son in |
      Quand Léa ouvre le parcours de français
      Alors « Le son in » est la prochaine leçon

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas le résultat du test de départ de Léa
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Léa a pour leçons réussies au test de départ :
        | leçon     |
        | Le son in |
      Et que Claire est connectée sur le téléphone
      Quand Claire demande le résultat du test de départ du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

    @acces
    Scénario: Un parent qui n'est pas rattaché ne peut pas enregistrer un test de départ pour Léa
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Claire est connectée sur le téléphone
      Quand Claire envoie un test de départ terminé pour le profil enfant de Léa
      Alors l'enregistrement est refusé comme pour un profil introuvable
      Et l'accueil de Léa propose « Mon test de départ » sur le téléphone de Paul
