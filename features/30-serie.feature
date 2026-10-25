# language: fr
@issue-30 @wip
Fonctionnalité: Série : jours d'affilée avec au moins une séance
  En tant qu'enfant
  Je veux voir combien de jours d'affilée j'ai joué
  Afin d'avoir envie de revenir un peu chaque jour

  La série compte les jours de séance consécutifs, jusqu'à aujourd'hui ou hier. Un jour de séance est un jour
  où l'enfant a terminé au moins une séance ou une séance de révision ; le test de départ n'en donne pas.
  La pastille de série, sous « Bonjour <prénom> ! » sur l'accueil de l'enfant, la dit à l'enfant :
  « Une petite leçon pour bien commencer ? », « Tu as joué aujourd'hui ! », « <n> jours d'affilée, bravo ! ».
  La série ne lit pas les étoiles, ne modifie aucune note et n'impose rien : ni objectif, ni durée, ni message quand elle casse.
  Les commentaires « Question 30.n » renvoient aux questions ouvertes de docs/stories/30/acceptance.md.

  « Aujourd'hui », « hier », « il y a 2 jours », « le lendemain » : jours du calendrier de l'appareil, qui commencent à minuit.
  Une séance « terminée » un jour donné, sans autre précision, est une séance terminée de la leçon « Les sons ou, on, an »,
  préparée pour ce jour-là.
  Leçons de test, ajoutées à la bibliothèque pour ces scénarios (comme #24) :
  - « Les sons de test » (français, CP, ordre 901) : une étape de leçon, puis deux exercices bulles de 5 questions,
    « Premières bulles » et « Dernières bulles » ;
  - « La suite de test » (français, CP, ordre 903).
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Claire n'y est pas rattachée.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque

  Règle: La série compte les jours d'affilée avec au moins une séance, jusqu'à aujourd'hui ou hier, et la pastille de série le dit à l'enfant

    Scénario: Sans aucune séance, la pastille de série propose une petite leçon
      Étant donné que Léa n'a terminé aucune séance
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « Une petite leçon pour bien commencer ? »

    Plan du Scénario: Avec une séance <jours>, la pastille de série dit « <texte> »
      Étant donné que Léa a terminé une séance chacun de ces jours : <jours>
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « <texte> »

      Exemples:
        | jours                                         | texte                      |
        | aujourd'hui                                   | Tu as joué aujourd'hui !   |
        | aujourd'hui, hier et il y a 2 jours           | 3 jours d'affilée, bravo ! |
        | aujourd'hui, il y a 2 jours et il y a 3 jours | Tu as joué aujourd'hui !   |

    # Questions 30.1 et 30.2
    @a-valider
    Plan du Scénario: Sans séance aujourd'hui, la série jusqu'à hier est gardée et la pastille dit « <texte> »
      Étant donné que Léa a terminé une séance chacun de ces jours : <jours>
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « <texte> »

      Exemples:
        | jours                  | texte                                            |
        | hier et il y a 2 jours | 2 jours d'affilée, bravo !                       |
        | hier                   | Tu as joué hier. Une petite leçon aujourd'hui ?  |

    # Question 30.10
    @a-valider
    Scénario: Un jour sans séance remet la série à zéro, sans rappel de la série perdue
      Étant donné que Léa a terminé une séance chacun de ces jours : il y a 2 jours, il y a 3 jours, il y a 4 jours, il y a 5 jours et il y a 6 jours
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « Une petite leçon pour bien commencer ? »

    # Questions 30.1 et 30.11
    @a-valider
    Plan du Scénario: L'accueil met la série à jour quand Léa revient <quand>, sans recharger l'application
      Étant donné que Léa a terminé une séance chacun de ces jours : aujourd'hui et hier
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa revient à son accueil <quand>
      Alors la pastille de série dit « <texte> »

      Exemples:
        | quand              | texte                                    |
        | le lendemain       | 2 jours d'affilée, bravo !               |
        | 2 jours plus tard  | Une petite leçon pour bien commencer ?   |

  Règle: Une séance terminée ou une séance de révision terminée fait un jour de séance, quelles que soient la leçon et les étoiles ; ni le test de départ ni une séance quittée n'en font un

    # Questions 30.4 et 30.13
    @a-valider
    Plan du Scénario: Une séance terminée aujourd'hui compte tout de suite pour la série, <cas>
      Étant donné que Léa a terminé une séance chacun de ces jours : hier
      Et que <séance du jour>
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la pastille de série dit « 2 jours d'affilée, bravo ! »

      Exemples:
        | cas                              | séance du jour                                                              |
        | avec 1 étoile                    | Léa a terminé une séance de la leçon « Les sons de test » avec 1 étoile     |
        | avec 3 étoiles                   | Léa a terminé une séance de la leçon « Les sons de test » avec 3 étoiles    |
        | d'un seul exercice               | Léa a terminé une séance de l'exercice « Premières bulles » seul            |
        | d'une leçon rejouée              | Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an »                    |

    # Question 30.4
    @a-valider
    Scénario: Une séance d'une leçon des classes d'avant compte pour la série
      Étant donné que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Et que Léa a terminé une séance chacun de ces jours : hier
      Et que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an »
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la pastille de série dit « 2 jours d'affilée, bravo ! »

    Scénario: Deux séances le même jour comptent pour un seul jour
      Étant donné que Léa a terminé une séance chacun de ces jours : aujourd'hui et hier
      Et que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an »
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la pastille de série dit « 2 jours d'affilée, bravo ! »

    Scénario: Le test de départ ne compte pas pour la série
      Étant donné que la bibliothèque de test du test de départ est servie
      Et que Léa n'a terminé aucune séance
      Et que Léa a fait le test de départ, en répondant juste à toutes les questions
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la pastille de série dit « Une petite leçon pour bien commencer ? »

    Scénario: Une séance quittée avant la fin ne compte pas pour la série
      Étant donné que Léa n'a terminé aucune séance
      Et que Léa a quitté la séance complète de la leçon « Les sons de test » après 3 questions réussies
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la pastille de série dit « Une petite leçon pour bien commencer ? »

    @depend-de-28
    Scénario: Une séance de révision terminée aujourd'hui compte tout de suite pour la série
      Étant donné que la bibliothèque de test des révisions est servie
      Et que Léa a terminé une séance chacun de ces jours : hier
      Et que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa choisit « Accueil » à la fin de la séance de révision
      Alors la pastille de série dit « 2 jours d'affilée, bravo ! »

    @depend-de-28
    Scénario: Les séances de révision et les séances terminées comptent ensemble pour la série
      Étant donné que Léa a terminé une séance chacun de ces jours : aujourd'hui et il y a 2 jours
      Et que Léa a terminé une séance de révision chacun de ces jours : aujourd'hui et hier
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « 3 jours d'affilée, bravo ! »

  Règle: Le jour d'une séance est celui de l'appareil à la fin de la séance ; sans réseau, la séance compte tout de suite et garde son jour

    Scénario: Sans réseau, une séance terminée compte tout de suite pour la série
      Étant donné que Léa a terminé une séance chacun de ces jours : hier
      Et que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette, sans réseau
      Quand Léa revient à l'accueil par le nom de l'application
      Alors la pastille de série dit « 2 jours d'affilée, bravo ! »

    # Questions 30.1, 30.3 et 30.6
    @a-valider
    Scénario: Une séance gardée sur l'appareil compte pour le jour où elle a été finie, même envoyée le lendemain
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette, sans réseau
      Quand le réseau revient sur la tablette le lendemain
      Alors la pastille de série dit « Tu as joué hier. Une petite leçon aujourd'hui ? » sur le téléphone de Paul

    # Question 30.9
    @a-valider
    Scénario: Sans réseau ni jours de séance connus, l'accueil n'affiche pas de pastille de série, sans message d'erreur
      Étant donné que Léa a terminé une séance chacun de ces jours : hier et il y a 2 jours
      Et que Savanturier a déjà été chargé une fois sur la tablette
      Et que le réseau est coupé
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa n'affiche pas de pastille de série
      Et aucun message d'erreur n'apparaît

  Règle: La pastille de série se lit à voix haute, tient dans un petit écran et reste immobile avec les mouvements réduits

    @depend-de-29
    Scénario: Avec « tout lire à voix haute », le personnage guide dit la salutation et la pastille de série en une seule lecture
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a terminé une séance chacun de ces jours : aujourd'hui, hier et il y a 2 jours
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa entend Noisette lire « Bonjour Léa ! 3 jours d'affilée, bravo ! »
      Et Léa entend la salutation une seule fois

    # Question 30.14
    @a-valider
    Scénario: Sans « tout lire à voix haute », le texte de la pastille de série n'est pas lu
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a terminé une séance chacun de ces jours : aujourd'hui, hier et il y a 2 jours
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « 3 jours d'affilée, bravo ! »
      Mais Léa n'entend pas Noisette lire « 3 jours d'affilée, bravo ! »

    Scénario: Un lecteur d'écran lit le texte de la pastille de série, sans la flamme
      Étant donné que Léa a terminé une séance chacun de ces jours : aujourd'hui et hier
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors les lecteurs d'écran annoncent « 2 jours d'affilée, bravo ! »
      Et la flamme de la pastille de série est cachée aux lecteurs d'écran

    Scénario: La pastille de série tient dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa n'a terminé aucune séance
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la page tient dans la largeur de l'écran
      Et le texte « Une petite leçon pour bien commencer ? » de la pastille de série se lit en entier

    Scénario: Avec les mouvements réduits, la flamme de la pastille de série ne bouge pas
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a terminé une séance chacun de ces jours : aujourd'hui
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « Tu as joué aujourd'hui ! »
      Et la flamme de la pastille de série ne bouge pas

  Règle: Seuls les parents rattachés au profil enfant lisent ses jours de séance, et chaque enfant a sa propre série

    @acces
    Scénario: Le second parent rattaché voit la même série sur son téléphone
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a terminé une séance chacun de ces jours : aujourd'hui et hier
      Quand Léa choisit son profil enfant sur le téléphone de Marie
      Alors la pastille de série dit « 2 jours d'affilée, bravo ! »

    @acces
    Scénario: Les séances d'un autre enfant ne comptent pas dans la série de Léa
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a terminé une séance chacun de ces jours : aujourd'hui, hier et il y a 2 jours
      Et que Léa n'a terminé aucune séance
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la pastille de série dit « Une petite leçon pour bien commencer ? »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les jours de séance de Léa
      Étant donné que Léa a terminé une séance chacun de ces jours : aujourd'hui et hier
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les jours de séance du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
