# language: fr
@issue-101 @wip
Fonctionnalité: Quête du jour : le personnage guide propose une seule chose à faire aujourd'hui
  En tant qu'enfant
  Je veux que mon personnage guide me propose, en arrivant sur mon accueil, une quête du jour
  Afin de savoir quoi faire sans chercher, et d'être fêté quand elle est accomplie

  Contexte Motivation : la quête du jour ne choisit aucune leçon elle-même. Elle désigne une des propositions
  qui existent déjà sur l'accueil de l'enfant : la séance de révision s'il y a au moins une question due (#28),
  sinon la leçon du jour (#29, même règle de choix, réponse 29.1). Elle est calculée, jamais enregistrée.
  Modèle : docs/stories/101/domain-model.md ; critères et questions : docs/stories/101/acceptance.md.
  Réponses du PO (2026-10-29) : « 101 reco », toutes les recommandations des questions 101.1 à 101.22 sont retenues
  (option B de 101.6). Le commentaire au-dessus d'un scénario nomme la réponse ou le critère de l'issue qu'il illustre.

  Paroles validées (réponses 101.6, 101.17, 101.20) :
  - révision : « Ta quête du jour : réviser <n> petites erreurs des jours passés. On y va ? » ;
  - leçon : « Ta quête du jour : la leçon « <titre> ». On y va ? » ;
  - boutons : « Oui, on y va ! » et « Autre chose » ; après « Autre chose » : « D'accord, choisis ce qui te fait envie ! » ;
  - fête, à la fin de la séance qui l'accomplit : « Quête du jour accomplie ! Bravo <prénom> ! » ;
  - sur l'accueil, quand elle est accomplie : « Ta quête du jour est accomplie. », sans nouvelle fête.
  Aucune parole ne dit « mission », « défi », ni ne parle d'une quête d'un jour passé.

  Bibliothèque de test de l'accueil de #29 (identifiants préfixés « e2e-29- ») : français du CE1 « Le son in » (10),
  « L'ordre alphabétique » (20), « Les mots contraires » (30), « Le pluriel des noms » (40) ; maths du CE1
  « Les nombres jusqu'à 100 » (10), « Les compléments à 10 » (20) ; sciences du CE1 « Les êtres vivants » (10) ;
  EMC du CE1 « Le respect des autres » (10) ; français du CP « Les voyelles » (10), « Les syllabes » (20),
  « Les sons de révision » (30, trois questions, reprise de #28) ; aucune leçon de CM2.
  Léa a un profil enfant de niveau CE1 dans l'univers « Animaux de la forêt » : son personnage guide est Noisette.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre enfant de Paul.
  « Léa a gagné N étoiles en tout » prépare des meilleures étoiles sur des leçons absentes de la bibliothèque (#32).

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que la bibliothèque de test de l'accueil est servie
    Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »

  Règle: La quête du jour propose la séance de révision s'il y a au moins une question due, sinon la leçon du jour ; quand il n'y a rien à proposer, il n'y a pas de quête

    # Réponses 101.1 (révision d'abord) et 101.6 (B)
    Plan du Scénario: Avec <dues> question(s) due(s), Noisette propose la séance de révision comme quête du jour
      Étant donné que Léa a <dues> questions dues de la leçon « Les sons de révision »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Noisette propose la quête du jour « <parole> »
      Et la quête du jour propose « Oui, on y va ! » et « Autre chose »

      Exemples:
        | dues | parole                                                                     |
        | 1    | Ta quête du jour : réviser 1 petite erreur des jours passés. On y va ?     |
        | 3    | Ta quête du jour : réviser 3 petites erreurs des jours passés. On y va ?   |

    # Réponses 101.1 (la leçon du jour telle quelle, réponse 29.1) et 101.6 (B)
    Scénario: Sans question due, Noisette propose la leçon du jour comme quête du jour
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | demain           |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Noisette propose la quête du jour « Ta quête du jour : la leçon « Le son in ». On y va ? »
      Et la leçon du jour de Léa est « Le son in », avec « Français · CE1 »

    # Réponse 101.1 : la quête suit l'alternance du français et des maths de la leçon du jour, sans autre règle
    Scénario: Après une séance de français, la quête du jour propose la leçon du jour en maths
      Étant donné que Léa a terminé hier une séance de la leçon « Le son in » avec 3 étoiles
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la quête du jour de Léa propose la leçon « Les nombres jusqu'à 100 »
      Et la leçon du jour de Léa est « Les nombres jusqu'à 100 », avec « Maths · CE1 »

    # Réponse 101.1 : la révision passe d'abord, même quand tout le parcours est réussi
    Scénario: Avec tout le parcours réussi et des questions dues, la quête du jour propose la séance de révision
      Étant donné que Léa a réussi 4 leçons de français du CE1
      Et que Léa a pour meilleures étoiles :
        | leçon                    | étoiles |
        | Les nombres jusqu'à 100  | 1       |
        | Les compléments à 10     | 1       |
        | Les êtres vivants        | 1       |
        | Le respect des autres    | 1       |
      Et que Léa a 2 questions dues de la leçon « Les sons de révision »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la quête du jour de Léa propose la séance de révision

    # Critère de l'issue : « Toutes les leçons réussies et aucune question due : pas de quête, le personnage guide félicite » (félicitation de la réponse 29.9)
    Scénario: Avec tout le parcours réussi et aucune question due, il n'y a pas de quête du jour et l'accueil félicite l'enfant
      Étant donné que Léa a réussi 4 leçons de français du CE1
      Et que Léa a pour meilleures étoiles :
        | leçon                    | étoiles |
        | Les nombres jusqu'à 100  | 1       |
        | Les compléments à 10     | 1       |
        | Les êtres vivants        | 1       |
        | Le respect des autres    | 1       |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose aucune quête du jour
      Et l'accueil de Léa affiche « Bravo ! », « Tu as fini ton parcours » et « Rejoue tes leçons préférées pour gagner toutes les étoiles. »

    # Réponse 101.10 : sans aucune leçon pour sa classe, ni quête ni félicitation (réponse 29.12)
    Scénario: Sans aucune leçon pour sa classe et sans question due, il n'y a pas de quête du jour, sans félicitation
      Étant donné que Paul a changé sur la tablette le niveau du profil enfant de Léa en CM2
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose aucune quête du jour
      Mais l'accueil de Léa n'affiche pas « Tu as fini ton parcours »

    # Réponse 101.10 : le test de départ a sa propre tuile, la quête ne le propose jamais
    Scénario: Tant que le test de départ n'est pas fait, la quête du jour ne le propose pas
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la quête du jour de Léa propose la leçon « Le son in »
      Et l'accueil de Léa propose la tuile « Mon test de départ », avec « Quelques questions pour commencer au bon endroit »

    # Réponse 101.6 (B), règle « pas de quête sans données » du modèle (réponses 29.11 et 28.21)
    Plan du Scénario: <cas>, il n'y a pas de quête du jour, sans message d'erreur
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que <donnée absente>
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose aucune quête du jour
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                          | donnée absente                                   |
        | Sans bibliothèque chargée    | la bibliothèque ne peut pas être chargée         |
        | Sans file de révision lue    | la file de révision de Léa ne peut pas être lue  |

  Règle: Le personnage guide propose la quête du jour à l'accueil ; l'enfant l'accepte, ou choisit « Autre chose » sans rien perdre

    # Réponse 101.15 : la quête est une parole du personnage guide, les tuiles de l'accueil restent en dessous
    Scénario: « Oui, on y va ! » commence la séance de révision proposée par la quête du jour
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa choisit « Oui, on y va ! » à la quête du jour
      Alors l'écran s'intitule « Je révise mes erreurs », avec « Révision »

    # Réponse 101.15
    Scénario: « Oui, on y va ! » ouvre la page de la leçon proposée par la quête du jour
      Étant donné que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa choisit « Oui, on y va ! » à la quête du jour
      Alors Léa voit la page de la leçon « Le son in »

    # Réponse 101.9 (a) : « Autre chose », réponse douce, rien n'est enregistré, rien n'est perdu
    Scénario: Après « Autre chose », le personnage guide laisse l'enfant choisir, et toutes les propositions de l'accueil restent ouvertes
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa choisit « Autre chose » à la quête du jour
      Alors Noisette dit « D'accord, choisis ce qui te fait envie ! »
      Et l'accueil de Léa ne propose plus la quête du jour
      Mais l'accueil de Léa propose la tuile « À revoir », avec « 3 petites erreurs des jours passés »
      Et la leçon du jour de Léa est « Le son in », avec « Français · CE1 »

    # Réponse 101.9 (a) : le refus vaut le temps de l'utilisation
    Scénario: Après « Autre chose », la quête du jour n'est plus proposée en revenant sur l'accueil
      Étant donné que Léa a choisi son profil enfant dans « Qui joue ? »
      Et que Léa a choisi « Autre chose » à la quête du jour
      Et que Léa a ouvert son parcours depuis son accueil
      Quand Léa revient en arrière
      Alors Léa voit son accueil
      Et l'accueil de Léa ne propose aucune quête du jour

    # Réponse 101.9 (a) : à la prochaine ouverture, la quête revient, sans reproche
    Scénario: À la prochaine ouverture de Savanturier, la quête du jour est proposée de nouveau, sans reproche
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Et que Léa a choisi « Autre chose » à la quête du jour
      Quand Léa relance Savanturier
      Alors Noisette propose la quête du jour « Ta quête du jour : réviser 3 petites erreurs des jours passés. On y va ? »

    # Réponse 101.6 (B) : c'est le personnage guide du profil qui propose la quête
    Scénario: Dans l'univers Sports, c'est Coach Léo qui propose la quête du jour
      Étant donné que Léa a choisi l'univers sports
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Coach Léo propose la quête du jour « Ta quête du jour : la leçon « Le son in ». On y va ? »

  Règle: La quête du jour est accomplie par une séance du même genre terminée aujourd'hui ; le personnage guide la fête une seule fois, à la fin de cette séance ; il n'y a qu'une quête par jour

    # Critère de l'issue « Après la séance de la quête, le personnage guide dit que la quête est accomplie » ; réponses 101.11 (a) et 101.12 (a)
    Scénario: À la fin de la séance de révision proposée par la quête, le personnage guide fête la quête du jour accomplie
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a commencé la séance de révision
      Quand Léa répond juste à toutes les questions de la séance de révision
      Alors la fin de la séance de révision annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »

    # Réponses 101.11 (a) et 101.12 (a)
    Scénario: À la fin de la séance de la leçon proposée par la quête, le personnage guide fête la quête du jour accomplie
      Étant donné que Léa joue la séance complète de la leçon « Le son in »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »

    # Réponse 101.12 (a) : jamais punitif, une séance de révision terminée accomplit la quête même avec des erreurs
    Scénario: Une séance de révision terminée avec des erreurs accomplit quand même la quête du jour
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a commencé la séance de révision
      Quand Léa répond à la séance de révision, en se trompant à toutes les questions
      Alors la fin de la séance de révision annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »

    # Réponse 101.12 (a) : pour une quête de leçon, une séance terminée sur n'importe quelle leçon l'accomplit
    Plan du Scénario: Une séance terminée sur <cas> accomplit la quête du jour qui proposait « Le son in »
      Étant donné que Léa joue la séance complète de la leçon « <leçon jouée> »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »

      Exemples:
        | cas                                | leçon jouée              |
        | une autre leçon de la classe       | Les nombres jusqu'à 100  |
        | une leçon des classes d'avant      | Les voyelles             |

    # Modèle, règle 5 : la séance qui finit le parcours accomplit la quête, elle ne la fait pas disparaître ; réponse 101.12 (a)
    Scénario: La séance qui finit tout le parcours accomplit la quête du jour
      Étant donné que Léa a réussi 3 leçons de français du CE1
      Et que Léa a pour meilleures étoiles :
        | leçon                    | étoiles |
        | Les nombres jusqu'à 100  | 1       |
        | Les compléments à 10     | 1       |
        | Les êtres vivants        | 1       |
        | Le respect des autres    | 1       |
      Et que Léa joue la séance complète de la leçon « Le pluriel des noms »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »

    # Réponse 101.12 (a) : une séance d'un autre genre n'accomplit pas la quête ; rien n'est dit, la quête reste proposée
    Scénario: Une séance de leçon n'accomplit pas une quête du jour de révision
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la quête du jour de Léa propose la séance de révision
      Et l'accueil de Léa n'affiche pas « Ta quête du jour est accomplie. »

    # Réponse 101.21 (a) : écarter la quête ne coûte rien ; une séance du même genre faite plus tard l'accomplit
    Scénario: Après « Autre chose », la séance de révision faite plus tard dans la journée accomplit quand même la quête du jour
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Et que Léa a choisi « Autre chose » à la quête du jour
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa a commencé la séance de révision
      Quand Léa répond juste à toutes les questions de la séance de révision
      Alors la fin de la séance de révision annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »

    # Réponse 101.12 (a) : ni le test de départ ni une séance quittée ne sont des séances terminées (réponses 29.2 et 27.4)
    Plan du Scénario: <cas> n'accomplit pas la quête du jour
      Étant donné que <ce qui a été fait>
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'accueil de Léa n'affiche pas « Ta quête du jour est accomplie. »

      Exemples:
        | cas                         | ce qui a été fait                                                        |
        | Le test de départ           | Léa a fait le test de départ, en répondant juste à toutes les questions |
        | Une séance quittée          | Léa a quitté la séance de la leçon « Le son in » avant la fin            |

    # Réponses 101.2 (a) et 101.17 : une seule quête par jour ; sur l'accueil, la quête accomplie est dite calmement
    Scénario: Une fois la quête accomplie, l'accueil le dit sans nouvelle fête, sans proposer d'autre quête, et la leçon du jour reste proposée
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa choisit « Accueil » à la fin de la séance de révision
      Alors l'accueil de Léa affiche « Ta quête du jour est accomplie. »
      Et l'accueil de Léa ne propose aucune quête du jour
      Mais la leçon du jour de Léa est « Le son in », avec « Français · CE1 »

    # Réponses 101.11 (a) et 101.2 (a) : la fête ne se montre qu'à la fin de la séance qui accomplit la quête
    Scénario: Une séance de plus le même jour ne fête pas de nouveau la quête du jour
      Étant donné que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Et que Léa joue la séance complète de la leçon « Les nombres jusqu'à 100 »
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de quête du jour accomplie n'apparaît à la fin de la séance

    # Réponse 101.11 (a) : la fête vient après les annonces existantes de la fin de la séance
    Scénario: La fin de la séance annonce le nouvel épisode, puis la quête du jour accomplie
      Étant donné que Léa joue la séance complète de la leçon « Le son in »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce la quête du jour accomplie après l'annonce du nouvel épisode

    # Réponse 101.8 (A) : calculée sur l'appareil à partir des séances du jour, aussi sans réseau
    Scénario: Sans réseau, la quête du jour est accomplie tout de suite après la séance
      Étant donné que le réseau est coupé
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa revient à l'accueil par le nom de l'application
      Alors l'accueil de Léa affiche « Ta quête du jour est accomplie. »

  Règle: La quête du jour n'est jamais punitive : une quête non faite disparaît le lendemain sans aucun message, et la quête accomplie ne change aucune récompense existante

    # Critère de l'issue : « Le lendemain d'un jour sans séance, aucun message ne parle de la quête manquée »
    Plan du Scénario: Revenue <quand> sans avoir fait sa quête, Léa n'entend parler d'aucune quête passée
      Étant donné que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa revient à son accueil <quand>
      Alors l'accueil de Léa ne parle pas de la quête d'hier
      Et la quête du jour de Léa propose la leçon « Le son in »

      Exemples:
        | quand              |
        | le lendemain       |
        | 3 jours plus tard  |

    # Réponses 101.2 (a) et 101.8 (A) : le lendemain, tout se recalcule
    Scénario: Le lendemain d'une quête accomplie, une nouvelle quête du jour est proposée
      Étant donné que Léa a terminé une séance de la leçon « Le son in » avec 3 étoiles
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa n'affiche pas « Ta quête du jour est accomplie. »
      Et la quête du jour de Léa propose la leçon « Les nombres jusqu'à 100 »

    # Réponse 101.3 (a) : rien de plus que la fête ; étoiles, cabane et tenues suivent leur règle (#24, #32, #102)
    Scénario: La séance qui accomplit la quête du jour ne donne aucune étoile, aucun objet de la cabane ni aucune tenue de plus
      Étant donné que Léa a gagné 6 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Le son in »
      Quand Léa réussit la dernière question de la séance
      Alors Léa gagne 3 étoiles
      Et la fin de la séance annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »
      Mais aucune annonce pour la cabane n'apparaît à la fin de la séance
      Et aucune annonce de nouvelle tenue n'apparaît à la fin de la séance

    # Réponse 101.5 (a) : la quête s'ajoute à l'objectif du jour sans le changer (réponse 29.2 b)
    Scénario: La quête accomplie par une séance de révision ne change pas l'objectif du jour
      Étant donné que Léa a 3 questions dues de la leçon « Les sons de révision »
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa choisit « Accueil » à la fin de la séance de révision
      Alors l'objectif du jour de Léa indique « 1 sur 2 »
      Et l'accueil de Léa affiche « Ta quête du jour est accomplie. »

  Règle: La quête du jour se lit à voix haute, se choisit au clavier, tient sur un petit écran, et sa fête garde son information sans mouvement

    # Réponse 101.16 (a) : la proposition est lue dans la même lecture que la salutation et la pastille de série (#30)
    Scénario: Avec « tout lire à voix haute », le personnage guide lit la quête du jour après la salutation
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a 3 questions dues de la leçon « Les sons de révision »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Noisette lit à voix haute, après la salutation, « Ta quête du jour : réviser 3 petites erreurs des jours passés. On y va ? »
      Et Léa entend la salutation une seule fois

    # Réponse 101.15
    Scénario: La quête du jour s'accepte au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa choisit « Oui, on y va ! » à la quête du jour, au clavier seulement
      Alors Léa voit la page de la leçon « Le son in »

    # Réponse 101.15
    Scénario: La quête du jour tient dans un écran de 360 px de large, avec des boutons assez grands pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a 3 questions dues de la leçon « Les sons de révision »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la page tient dans la largeur de l'écran
      Et « Oui, on y va ! » et « Autre chose » mesurent au moins 44 px de haut

    # Réponse 101.11 (a) : la fête respecte les mouvements réduits, son information reste
    Scénario: Avec les mouvements réduits, la fête de la quête accomplie apparaît sans mouvement et garde son texte
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la séance complète de la leçon « Le son in »
      Quand Léa réussit la dernière question de la séance
      Alors l'annonce de la quête du jour accomplie apparaît sans mouvement
      Et la fin de la séance annonce la quête du jour accomplie, avec « Quête du jour accomplie ! Bravo Léa ! »

  Règle: La quête du jour d'un enfant ne tient compte que de ses propres séances et questions dues, et ne se montre ni dans l'Espace parent ni à un autre enfant

    @acces
    Scénario: Les séances d'un autre enfant du même parent n'accomplissent pas la quête du jour de Léa
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a terminé aujourd'hui une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la quête du jour de Léa propose la leçon « Le son in »
      Et l'accueil de Léa n'affiche pas « Ta quête du jour est accomplie. »

    @acces
    Scénario: Les questions dues d'un autre enfant ne deviennent pas la quête du jour de Léa
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | hier             |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la quête du jour de Léa propose la leçon « Le son in »

    # Réponse 101.8 (A) : la quête accomplie se retrouve sur tous les appareils des parents rattachés
    @acces
    Scénario: Sur le téléphone du second parent rattaché, Léa retrouve sa quête du jour accomplie
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Léa choisit son profil enfant sur le téléphone de Marie
      Alors l'accueil de Léa affiche « Ta quête du jour est accomplie. » sur le téléphone de Marie

    # Réponse 101.4 (a) : le suivi ne montre pas les quêtes
    @acces
    Scénario: L'Espace parent ne montre pas la quête du jour de l'enfant
      Étant donné que Léa a terminé une séance de la leçon « Le son in » avec 1 étoile
      Quand Paul entre dans l'espace parent
      Alors le mot « quête » n'apparaît pas dans l'Espace parent
