# language: fr
@issue-190 @wip
Fonctionnalité: Exercice « horloge » : lire l'heure et placer les aiguilles
  En tant qu'enfant
  Je veux voir une horloge à aiguilles et dire l'heure qu'elle montre, ou tourner moi-même ses aiguilles pour montrer
  une heure donnée
  Afin d'apprendre à lire l'heure comme en classe

  Contextes Catalogue pédagogique (nouveau type d'exercice `horloge` du format de leçon) et Apprentissage (correction
  en séance), docs/stories/190/domain-model.md. Les étoiles, l'avancement, la félicitation et les retours de #97 ne
  changent pas : ils ne sont pas redécrits.
  Les commentaires « Question n » renvoient à la liste fusionnée des questions ouvertes de
  docs/stories/190/acceptance.md (1 à 22 : celles du modèle, même numéro ; 23 et plus : celles des critères). Tant
  qu'une question n'est pas tranchée, le scénario suit la recommandation et porte le tag @a-valider.

  Mots employés dans ces scénarios (mots d'interface, comme dans les leçons existantes et le programme) :
  - « la petite aiguille » : l'aiguille des heures ; « la grande aiguille » : l'aiguille des minutes ;
  - « sur le 3 » : l'aiguille pointe exactement le chiffre 3 du cadran ; « à mi-chemin entre le 3 et le 4 » : la
    petite aiguille est au milieu de l'espace entre le 3 et le 4 (3 h 30) ; « au quart du chemin » : au premier quart
    de cet espace (3 h 15) ; « aux trois quarts du chemin » : au troisième quart (3 h 45) ;
  - « place les aiguilles sur 3 h 30 » : la petite et la grande aiguille sont posées comme sur une vraie horloge à
    3 h 30, puis l'enfant valide ;
  - « 3 h », « 15 h 30 », « 6 h 18 » : l'écriture d'une heure montrée à l'enfant ; « trois heures » : l'heure dite ;
  - « tourne en douceur » : l'aiguille va d'une position à l'autre par un mouvement, sans sauter d'un coup.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test de l'horloge
  (identifiants préfixés « e2e-190- ») ; la vraie bibliothèque reste intacte. Toutes ses leçons sont des maths :
  - CP, « Lire l'heure pile » : exercice horloge « L'heure pile », mode lire, sans consigne ni précision, heures
    « 3:00 », « 9:00 » (aide « La petite aiguille est sur le 9. ») et « 12:00 » ;
  - CP, « Placer l'heure pile » : exercice horloge « Je place l'heure pile », mode placer, sans consigne ni
    précision, heures « 3:00 » et « 12:00 » ;
  - CE1, « Les quarts d'heure » : exercice horloge « Je lis les quarts d'heure », mode lire, sans précision, heures
    « 2:15 », « 9:45 » et « 15:00 » ;
  - CE1, « Placer la demie et le quart » : exercice horloge « Je place la demie », mode placer, sans précision,
    heures « 3:30 » et « 3:15 » ;
  - CE1, « Le matin et l'après-midi » : exercice horloge « Matin ou après-midi ? », mode lire, heure « 15:00 » de
    moment après-midi, aide « L'après-midi, on continue de compter après 12 : 13 h, 14 h, 15 h. » ;
  - CE2, « L'heure à la minute » : exercice horloge « Je place les minutes », mode placer, précision minute, heures
    « 6:18 » et « 10:35 » ; exercice horloge « Je lis les minutes », mode lire, heures « 7:45 » et « 15:42 » ;
  - CM1, « Heures et minutes » : exercice horloge « Je place l'heure », mode placer, sans précision, heure « 4:40 » ;
  - CM2, « Heures, minutes et secondes » : exercice horloge « Je place les secondes », mode placer, précision
    seconde, heure « 6:18:20 ».
  Les leçons de test mal formées sont décrites dans les scénarios.
  Léa a un profil enfant de niveau CP, Tom de niveau CE1, Inès un profil du niveau donné par le scénario, tous dans
  l'univers « Animaux de la forêt » (personnage guide Noisette). Paul est le parent de Léa et de Tom.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
    Et que la bibliothèque de test de l'horloge est servie

  Règle: Une leçon dont l'exercice horloge est mal formé n'est jamais proposée ; chaque heure respecte la précision de l'heure de l'exercice, ou à défaut celle du niveau, qui ne dépasse pas le programme

    # Question 9 (CE2 à la minute ou aux cinq minutes ; précision plus fine que le niveau refusée, plus grossière acceptée)
    @a-valider
    Plan du Scénario: Au <niveau>, un exercice horloge à « <heure> » <précision> <résultat> dans le parcours
      Étant donné qu'Inès a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Et qu'une leçon de test « L'heure de test » de niveau <niveau> a un exercice horloge à placer à « <heure> » <précision>
      Quand Inès choisit « Maths » dans son parcours
      Alors « L'heure de test » <résultat> dans le parcours

      Exemples:
        | niveau | heure   | précision                     | résultat         |
        | CP     | 3:00    | sans précision                | apparaît         |
        | CP     | 3:30    | sans précision                | n'apparaît pas   |
        | CE1    | 3:30    | sans précision                | apparaît         |
        | CE1    | 9:45    | sans précision                | apparaît         |
        | CE1    | 3:10    | sans précision                | n'apparaît pas   |
        | CE1    | 3:10    | de précision minute           | n'apparaît pas   |
        | CE2    | 6:18    | sans précision                | apparaît         |
        | CE2    | 3:00    | de précision heure            | apparaît         |
        | CE2    | 3:30    | de précision heure            | n'apparaît pas   |
        | CM1    | 4:41    | sans précision                | apparaît         |
        | CM1    | 4:41:10 | sans précision                | n'apparaît pas   |
        | CM2    | 6:18:20 | de précision seconde          | apparaît         |

    Plan du Scénario: Une leçon dont l'exercice horloge <défaut> n'est pas proposée
      Étant donné qu'une leçon de test « L'heure de test » de niveau CE1 a un exercice horloge qui <défaut>
      Quand Tom choisit « Maths » dans son parcours
      Alors « L'heure de test » n'apparaît pas dans le parcours
      Mais « Les quarts d'heure » apparaît dans le parcours

      Exemples:
        | défaut                                                   |
        | a le mode « regarder »                                   |
        | n'a pas de mode                                          |
        | n'a aucune heure                                         |
        | demande l'heure « 25:00 »                                |
        | demande l'heure « 3:60 »                                 |
        | demande l'heure « 3 h 30 », qui n'est pas écrite « H:MM » |
        | a la précision « dix minutes »                           |

    # Question 30 (deux heures égales sur le cadran dans un même exercice sont refusées)
    @a-valider
    Scénario: Une leçon dont l'exercice horloge demande deux heures égales sur le cadran n'est pas proposée
      Étant donné qu'une leçon de test « L'heure de test » de niveau CE1 a un exercice horloge qui demande « 3:00 » et « 15:00 »
      Quand Tom choisit « Maths » dans son parcours
      Alors « L'heure de test » n'apparaît pas dans le parcours

    # Question 17 (au CP, en mode placer, seulement de 1 h à 12 h)
    @a-valider
    Plan du Scénario: Au CP, un exercice horloge à placer à « <heure> » <résultat> dans le parcours
      Étant donné qu'une leçon de test « L'heure de test » de niveau CP a un exercice horloge à placer à « <heure> » sans précision
      Quand Léa choisit « Maths » dans son parcours
      Alors « L'heure de test » <résultat> dans le parcours

      Exemples:
        | heure | résultat       |
        | 1:00  | apparaît       |
        | 12:00 | apparaît       |
        | 13:00 | n'apparaît pas |
        | 0:00  | n'apparaît pas |

  Règle: En mode lire, l'horloge à aiguilles montre une heure ; au CP l'enfant la choisit parmi trois heures toutes différentes sur le cadran, à partir du CE1 il l'écrit au clavier de cristaux ; une heure égale sur le cadran est juste, sauf si un moment de la journée est demandé

    # Question 1 (choix au CP, clavier de cristaux à partir du CE1) et question 11 (choix calculés)
    @a-valider
    Scénario: Au CP, l'horloge montre 3 h et Léa choisit parmi trois heures entières, toutes différentes
      Étant donné que Léa est sur la page de la leçon « Lire l'heure pile »
      Quand Léa choisit seulement l'exercice « L'heure pile »
      Alors Léa voit une horloge à aiguilles, la petite aiguille sur le 3 et la grande sur le 12
      Et Léa voit trois choix, dont « 3 h », tous des heures entières différentes sur le cadran

    # Question 10 (12 h s'écrit « 12 h » et non « midi » dans les choix)
    @a-valider
    Plan du Scénario: Au CP, la réponse « <réponse> » à l'horloge qui montre <heure montrée> est juste
      Étant donné que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que l'horloge montre <heure montrée>
      Quand Léa répond « <réponse> »
      Alors Noisette applaudit en sautant
      Et la question est réussie

      Exemples:
        | heure montrée | réponse |
        | 3 h           | 3 h     |
        | 9 h           | 9 h     |
        | 12 h          | 12 h    |

    # Question 1 (clavier de cristaux à partir du CE1)
    @a-valider
    Scénario: Au CE1, Tom écrit l'heure montrée au clavier de cristaux
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom écrit « 2 h 15 » sur le clavier de cristaux et valide
      Alors Noisette applaudit en sautant
      Et la question est réussie

    # Question 8 (sans moment de la journée, une heure égale sur le cadran est juste) et question 10
    @a-valider
    Scénario: Sans moment de la journée, « 14 h 15 » est juste pour l'horloge qui montre 2 h 15
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom écrit « 14 h 15 » sur le clavier de cristaux et valide
      Alors la question est réussie

    # Question 8 (avec un moment de la journée, l'heure doit être celle de ce moment, et le moment est dit après la consigne)
    @a-valider
    Scénario: Quand c'est l'après-midi, « 3 h » n'est pas la bonne réponse et l'aide de l'heure est lue
      Étant donné que Tom joue seulement l'exercice « Matin ou après-midi ? » de la leçon « Le matin et l'après-midi »
      Et que Tom a entendu Noisette lire « Quelle heure est-il ? C'est l'après-midi. »
      Quand Tom écrit « 3 h » sur le clavier de cristaux et valide
      Alors Noisette dit un encouragement, suivi de « L'après-midi, on continue de compter après 12 : 13 h, 14 h, 15 h. »
      Et la question reste posée

    # Question 1
    @a-valider
    Scénario: Une heure impossible ne peut pas être validée
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Quand Tom écrit « 2 h 75 » sur le clavier de cristaux
      Alors Tom ne peut pas valider « 2 h 75 »
      Et aucune erreur n'est comptée

    # Question 5 (l'affichage digital n'est jamais montré pendant la question, seulement après la bonne réponse)
    @a-valider
    Scénario: Pendant la question, l'heure n'est écrite nulle part à côté de l'horloge
      Étant donné que Tom est sur la page de la leçon « Les quarts d'heure »
      Quand Tom choisit seulement l'exercice « Je lis les quarts d'heure »
      Alors Tom voit une horloge à aiguilles qui montre 2 h 15
      Mais ni « 2 h 15 » ni « 2 : 15 » ni « 14 : 15 » n'est écrit à l'écran

    # Question 5
    @a-valider
    Scénario: Après la bonne réponse, au CE1, l'affichage digital est montré à côté de l'horloge
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom écrit « 2 h 15 » sur le clavier de cristaux et valide
      Alors Tom voit « 2 : 15 » à côté de l'horloge

  Règle: En mode placer, l'enfant tourne les aiguilles puis valide ; la réponse est juste si la grande aiguille est sur les minutes attendues et si la petite aiguille est à la place que lui donnent ces minutes (aiguilles cohérentes)

    # Question 23 (position de départ des aiguilles)
    @a-valider
    Scénario: Au début d'une question à placer, les aiguilles montrent 12 h
      Étant donné que Léa est sur la page de la leçon « Placer l'heure pile »
      Quand Léa choisit seulement l'exercice « Je place l'heure pile »
      Alors Léa voit une horloge à aiguilles, les deux aiguilles sur le 12
      Et Léa voit « Place les aiguilles sur 3 h. »

    # Question 23
    @a-valider
    Scénario: Quand l'heure à placer est midi, les aiguilles montrent 6 h au début
      Étant donné que Léa joue seulement l'exercice « Je place l'heure pile » de la leçon « Placer l'heure pile »
      Et que Léa a réussi la question « Place les aiguilles sur 3 h. »
      Quand la question « Place les aiguilles sur 12 h. » s'affiche
      Alors la petite aiguille est sur le 6 et la grande aiguille sur le 12

    Plan du Scénario: Au <niveau>, les aiguilles placées sur <heure> réussissent la question
      Étant donné que <enfant> joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Et que <enfant> en est à la question « Place les aiguilles sur <heure>. »
      Quand <enfant> place les aiguilles sur <heure>
      Alors Noisette applaudit en sautant
      Et la question est réussie

      Exemples:
        | niveau | enfant | leçon                        | exercice               | heure |
        | CP     | Léa    | Placer l'heure pile          | Je place l'heure pile  | 3 h   |
        | CP     | Léa    | Placer l'heure pile          | Je place l'heure pile  | 12 h  |
        | CE1    | Tom    | Placer la demie et le quart  | Je place la demie      | 3 h 30 |
        | CE1    | Tom    | Placer la demie et le quart  | Je place la demie      | 3 h 15 |

    # Question 3 (au CP et au CE1, les deux aiguilles se placent séparément), question 7 (cohérence exacte) et question 33 (aide)
    @a-valider
    Plan du Scénario: Pour 3 h 30, la grande aiguille sur le 6 et la petite <place de la petite aiguille> ne sont pas cohérentes
      Étant donné que Tom joue seulement l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. »
      Quand Tom valide la grande aiguille sur le 6 et la petite <place de la petite aiguille>
      Alors Noisette dit un encouragement, suivi de « La petite aiguille montre les heures, la grande les minutes. »
      Et la question « Place les aiguilles sur 3 h 30. » reste posée

      Exemples:
        | place de la petite aiguille         |
        | sur le 3                            |
        | sur le 4                            |
        | aux trois quarts du chemin entre le 3 et le 4 |

    Scénario: Des aiguilles qui montrent 3 h 15 ne réussissent pas « 3 h 30 »
      Étant donné que Tom joue seulement l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. »
      Quand Tom valide la grande aiguille sur le 3 et la petite au quart du chemin entre le 3 et le 4
      Alors Noisette dit un encouragement, suivi de « La petite aiguille montre les heures, la grande les minutes. »
      Et la question « Place les aiguilles sur 3 h 30. » reste posée

    # Question 3 (à partir du CE2, la petite aiguille suit la grande, comme sur une vraie horloge)
    @a-valider
    Scénario: À partir du CE2, la petite aiguille avance d'elle-même quand la grande tourne
      Étant donné qu'Inès a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « Je place les minutes » de la leçon « L'heure à la minute »
      Et que la petite aiguille est sur le 6 et la grande aiguille sur le 12
      Quand Inès tourne la grande aiguille d'un demi-tour, jusqu'au 6
      Alors la petite aiguille est à mi-chemin entre le 6 et le 7

    # Question 3 et question 9 (CE2 à la minute)
    @a-valider
    Plan du Scénario: À partir du CE2, au <niveau>, les aiguilles placées sur <heure> réussissent la question
      Étant donné qu'Inès a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Et qu'Inès en est à la question « Place les aiguilles sur <heure>. »
      Quand Inès place les aiguilles sur <heure>
      Alors la question est réussie

      Exemples:
        | niveau | leçon               | exercice             | heure  |
        | CE2    | L'heure à la minute | Je place les minutes | 6 h 18 |
        | CE2    | L'heure à la minute | Je place les minutes | 10 h 35 |
        | CM1    | Heures et minutes   | Je place l'heure     | 4 h 40 |

    # Question 4 (aiguille des secondes au CM2, seulement à la précision seconde) et question 10 (écriture des secondes)
    @a-valider
    Scénario: Au CM2, à la précision seconde, l'horloge a une aiguille des secondes à placer aussi
      Étant donné qu'Inès a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « Je place les secondes » de la leçon « Heures, minutes et secondes »
      Et qu'Inès en est à la question « Place les aiguilles sur 6 h 18 min 20 s. »
      Quand Inès place les aiguilles sur 6 h 18 min 20 s
      Alors la question est réussie

    # Question 4
    @a-valider
    Scénario: Sans la précision seconde, l'horloge n'a pas d'aiguille des secondes
      Étant donné qu'Inès a un profil enfant préparé de niveau CM1 dans l'univers « Animaux de la forêt »
      Quand Inès commence l'exercice « Je place l'heure » de la leçon « Heures et minutes »
      Alors Inès voit une horloge à aiguilles avec une petite et une grande aiguille seulement

    # Question 2 (aiguilles aimantées au pas de la précision de l'heure)
    @a-valider
    Plan du Scénario: Au <niveau>, la grande aiguille lâchée <où elle est lâchée> se pose <où elle se pose>
      Étant donné qu'Inès a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand Inès lâche la grande aiguille <où elle est lâchée>
      Alors la grande aiguille se pose <où elle se pose>

      Exemples:
        | niveau | leçon                       | exercice              | où elle est lâchée               | où elle se pose                    |
        | CE1    | Placer la demie et le quart | Je place la demie     | un peu après le 3                | sur le 3                           |
        | CE1    | Placer la demie et le quart | Je place la demie     | un peu avant le 6                | sur le 6                           |
        | CE2    | L'heure à la minute         | Je place les minutes  | entre le trait de 18 et celui de 19, plus près du 18 | sur le trait de 18 minutes |

    # Question 2 et question 24 (au CP, la grande aiguille reste sur le 12)
    @a-valider
    Scénario: Au CP, la grande aiguille revient toujours sur le 12
      Étant donné que Léa joue seulement l'exercice « Je place l'heure pile » de la leçon « Placer l'heure pile »
      Quand Léa lâche la grande aiguille près du 3
      Alors la grande aiguille se pose sur le 12

  Règle: Les aiguilles se tournent au doigt, au clavier avec les flèches et avec les boutons « + » et « − » ; chaque mouvement avance l'aiguille choisie d'un pas de la précision de l'heure, et l'heure placée est annoncée aux lecteurs d'écran

    Scénario: Sur tablette, Tom tourne les aiguilles au doigt et valide
      Étant donné que Tom joue sur une tablette, au doigt
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Quand Tom tourne au doigt la grande aiguille jusqu'au 6 et la petite à mi-chemin entre le 3 et le 4, puis valide
      Alors la question « Place les aiguilles sur 3 h 30. » est réussie

    # Question 2 et question 25 (pas des boutons et des flèches)
    @a-valider
    Plan du Scénario: Au CE1, « <bouton> » de la grande aiguille la fait passer du 12 <à où>
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la grande aiguille est sur le 12
      Quand Tom touche une fois « <bouton> » de la grande aiguille
      Alors la grande aiguille est <à où>

      Exemples:
        | bouton | à où    |
        | +      | sur le 3 |
        | −      | sur le 9 |

    # Question 3 (aiguilles placées séparément au CE1) et question 25
    @a-valider
    Scénario: Au CE1, « + » de la petite aiguille l'avance d'un quart du chemin vers le chiffre suivant
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la petite aiguille est sur le 3
      Quand Tom touche une fois « + » de la petite aiguille
      Alors la petite aiguille est au quart du chemin entre le 3 et le 4

    # Question 25 (flèche droite ou haut : sens des aiguilles d'une montre ; gauche ou bas : sens inverse)
    @a-valider
    Plan du Scénario: Au clavier, la flèche <flèche> fait passer la grande aiguille du 12 <à où>
      Étant donné que Tom joue sur un ordinateur, au clavier
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la grande aiguille, sur le 12, est choisie au clavier
      Quand Tom appuie une fois sur la flèche <flèche>
      Alors la grande aiguille est <à où>

      Exemples:
        | flèche | à où     |
        | droite | sur le 3 |
        | haut   | sur le 3 |
        | gauche | sur le 9 |
        | bas    | sur le 9 |

    Scénario: Au clavier seulement, Tom place les aiguilles et réussit la question
      Étant donné que Tom joue sur un ordinateur, au clavier
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Quand Tom place les aiguilles sur 3 h 30 et valide, au clavier seulement
      Alors la question « Place les aiguilles sur 3 h 30. » est réussie

    # Question 19 (l'heure placée n'est pas écrite à l'écran) et question 26 (texte de l'annonce)
    @a-valider
    Scénario: L'heure placée est annoncée aux lecteurs d'écran, sans être écrite à l'écran
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la petite aiguille est à mi-chemin entre le 3 et le 4 et la grande sur le 3
      Quand Tom touche trois fois « + » de la grande aiguille
      Alors les lecteurs d'écran annoncent « Les aiguilles montrent 3 h 30. »
      Mais « 3 h 30 » n'est écrit à l'écran que dans la consigne

    # Question 27 (en mode lire, le lecteur d'écran ne dit pas l'heure montrée)
    @a-valider
    Scénario: En mode lire, les lecteurs d'écran nomment l'horloge sans dire l'heure qu'elle montre
      Étant donné que Léa est sur la page de la leçon « Lire l'heure pile »
      Quand Léa choisit seulement l'exercice « L'heure pile »
      Alors les lecteurs d'écran annoncent une horloge à aiguilles
      Mais les lecteurs d'écran ne disent pas « 3 h » avant que Léa réponde

  Règle: Une réponse fausse coûte une erreur, jamais une punition : un encouragement, l'aide, et une nouvelle chance avec ce que l'enfant a placé ; « Je ne sais pas » montre la bonne heure une fois par question, puis l'enfant la donne lui-même

    Scénario: Après une erreur au CP, le mauvais choix est écarté et l'aide de l'heure est lue
      Étant donné que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que l'horloge montre 9 h
      Quand Léa répond une autre heure que « 9 h »
      Alors Noisette réfléchit en penchant la tête
      Et Noisette dit un encouragement, suivi de « La petite aiguille est sur le 9. »
      Et le choix touché reste visible, pâle, et ne réagit plus

    Scénario: Sans aide de l'heure, le personnage guide lit l'aide par défaut de l'horloge
      Étant donné que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que l'horloge montre 3 h
      Quand Léa répond une autre heure que « 3 h »
      Alors Noisette dit un encouragement, suivi de « La petite aiguille montre les heures, la grande les minutes. »

    # Question 6 (après une erreur, les aiguilles de l'enfant restent ; la bonne heure n'est pas montrée)
    @a-valider
    Scénario: Après une erreur en mode placer, les aiguilles restent où Tom les a mises, sans montrer la bonne heure
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Quand Tom valide la grande aiguille sur le 6 et la petite sur le 3
      Alors la petite aiguille est toujours sur le 3 et la grande sur le 6
      Et aucune aiguille ne montre 3 h 30 d'elle-même
      Et Tom peut de nouveau tourner les aiguilles et valider

    Scénario: Après une erreur, les aiguilles placées sur 3 h 30 réussissent encore la question
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que Tom a validé la grande aiguille sur le 6 et la petite sur le 3
      Quand Tom place les aiguilles sur 3 h 30
      Alors la question « Place les aiguilles sur 3 h 30. » est réussie
      Et la question « Place les aiguilles sur 3 h 15. » s'affiche

    Scénario: Avec une erreur dans l'exercice horloge, Léa gagne 2 étoiles
      Étant donné qu'une leçon de test de niveau CP a un seul exercice horloge à placer à « 3:00 »
      Et que Léa a validé une fois les aiguilles sur une autre heure que 3 h
      Quand Léa place les aiguilles sur 3 h
      Alors Léa gagne 2 étoiles

    Plan du Scénario: « Je ne sais pas » est proposé dans un exercice horloge (<cas>)
      Quand <enfant> commence l'exercice « <exercice> » de la leçon « <leçon> »
      Alors « Je ne sais pas » est proposé à <enfant>

      Exemples:
        | cas                                | enfant | leçon                       | exercice                  |
        | mode lire, avec les choix          | Léa    | Lire l'heure pile           | L'heure pile              |
        | mode lire, au clavier de cristaux  | Tom    | Les quarts d'heure          | Je lis les quarts d'heure |
        | mode placer                        | Tom    | Placer la demie et le quart | Je place la demie         |

    Scénario: En mode lire avec les choix, « Je ne sais pas » ne laisse que la bonne heure, qui brille
      Étant donné que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que l'horloge montre 9 h
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 9 h » reste, et il brille
      Et Noisette dit « Pas de souci, on apprend ensemble ! La petite aiguille est sur le 9. La bonne réponse brille : touche-la. »

    # Question 1 (clavier de cristaux à partir du CE1)
    @a-valider
    Scénario: En mode lire au clavier de cristaux, « Je ne sais pas » dit l'heure à taper
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom dit « Je ne sais pas »
      Alors Noisette dit « Pas de souci ! La petite aiguille montre les heures, la grande les minutes. La réponse est 2 h 15. Tape-la sur les cristaux. »
      Et la question reste posée jusqu'à ce que Tom écrive « 2 h 15 »

    # Question 18 (les aiguilles montrent la bonne heure, puis reviennent ; l'enfant les replace lui-même) et question 28
    @a-valider
    Scénario: En mode placer, « Je ne sais pas » montre la bonne heure, puis Tom place lui-même les aiguilles
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la petite aiguille est sur le 12 et la grande sur le 12
      Quand Tom dit « Je ne sais pas »
      Alors les aiguilles tournent en douceur jusqu'à 3 h 30, puis reviennent où Tom les avait mises
      Et Noisette dit « Pas de souci, on apprend ensemble ! », suivi de « La petite aiguille montre les heures, la grande les minutes. »
      Et Tom doit encore placer lui-même les aiguilles sur 3 h 30

    Scénario: Après « Je ne sais pas », il n'est plus proposé pour cette question
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Quand Tom dit « Je ne sais pas »
      Alors « Je ne sais pas » n'est plus proposé à Tom pour cette question

    # Question 15 (une question d'horloge ratée revient en révision, dans le même mode)
    @a-valider
    Scénario: Une question d'horloge ratée revient en séance de révision, dans le même mode
      Étant donné que Léa a pour question retenue « Place les aiguilles sur 3 h. » de l'exercice « Je place l'heure pile », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors Léa voit une horloge à aiguilles, les deux aiguilles sur le 12
      Et Léa voit « Place les aiguilles sur 3 h. »

  Règle: La consigne et l'heure à placer sont lues à voix haute, jamais l'heure à lire ; l'horloge tient à 360 px, ses boutons mesurent au moins 44 px, elle se joue sans réseau et sans mouvement quand l'appareil le demande

    # Question 10 (heure dite : « trois heures », « midi », « trois heures et demie », « six heures dix-huit »)
    @a-valider
    Plan du Scénario: Sans consigne, l'heure à placer <écriture> est écrite et dite « <heure dite> »
      Étant donné que <enfant> joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand la question de l'heure « <heure> » s'affiche
      Alors <enfant> voit « Place les aiguilles sur <écriture>. »
      Et <enfant> entend Noisette lire « Place les aiguilles sur <heure dite>. »

      Exemples:
        | enfant | leçon                       | exercice              | heure | écriture | heure dite               |
        | Léa    | Placer l'heure pile         | Je place l'heure pile | 3:00  | 3 h      | trois heures             |
        | Léa    | Placer l'heure pile         | Je place l'heure pile | 12:00 | 12 h     | midi                     |
        | Tom    | Placer la demie et le quart | Je place la demie     | 3:30  | 3 h 30   | trois heures et demie    |
        | Tom    | Placer la demie et le quart | Je place la demie     | 3:15  | 3 h 15   | trois heures et quart    |

    # Question 29 (l'exercice a sa propre consigne : elle est lue, puis l'heure dite)
    @a-valider
    Scénario: Avec sa propre consigne, l'exercice à placer lit la consigne puis l'heure dite
      Étant donné qu'une leçon de test de niveau CP a un exercice horloge à placer à « 9:00 », de consigne « Montre l'heure du début de la classe. »
      Quand Léa commence cet exercice
      Alors Léa entend Noisette lire « Montre l'heure du début de la classe. », puis « neuf heures »

    Scénario: En mode lire, la consigne est lue mais pas l'heure montrée
      Étant donné que Léa est sur la page de la leçon « Lire l'heure pile »
      Quand Léa choisit seulement l'exercice « L'heure pile »
      Alors Léa entend Noisette lire « Quelle heure est-il ? »
      Mais Léa n'entend pas Noisette dire « trois heures »

    Scénario: Léa peut réécouter l'heure à placer
      Étant donné que Léa joue seulement l'exercice « Je place l'heure pile » de la leçon « Placer l'heure pile »
      Et que Noisette a fini de lire « Place les aiguilles sur trois heures. »
      Quand Léa demande à réécouter la question
      Alors Léa entend de nouveau Noisette lire « Place les aiguilles sur trois heures. »

    # Question 10 (les choix sont lus comme des heures dites)
    @a-valider
    Scénario: Avec « tout lire à voix haute », les heures proposées sont lues comme des heures dites
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que les choix sont affichés dans l'ordre « 2 h », « 3 h », « 4 h »
      Quand la question « Quelle heure est-il ? » s'affiche
      Alors Léa entend ensuite Noisette dire « Est-ce deux heures, trois heures, ou quatre heures ? »

    Plan du Scénario: À 360 px, l'horloge à <mode> et ses commandes tiennent dans la largeur de l'écran
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand <enfant> commence l'exercice « <exercice> » de la leçon « <leçon> »
      Alors la page tient dans la largeur de l'écran
      Et l'horloge à aiguilles, <commandes> et « Je ne sais pas » sont visibles en entier

      Exemples:
        | mode   | enfant | leçon                       | exercice                  | commandes                                         |
        | lire   | Léa    | Lire l'heure pile           | L'heure pile              | les trois choix                                   |
        | lire   | Tom    | Les quarts d'heure          | Je lis les quarts d'heure | le clavier de cristaux                            |
        | placer | Tom    | Placer la demie et le quart | Je place la demie         | les boutons « + » et « − » des aiguilles et « Valider » |

    Scénario: Les boutons « + » et « − » et chaque aiguille se touchent du doigt sur au moins 44 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand Tom commence l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Alors chaque bouton « + » et « − » mesure au moins 44 px de haut et de large
      Et chaque aiguille se saisit du doigt sur une zone d'au moins 44 px

    Scénario: En mode dys, la consigne et les heures proposées s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand Léa commence l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Alors Léa voit la consigne et les choix en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: Avec les mouvements réduits, l'aiguille saute à sa place sans tourner
      Étant donné que l'appareil demande des mouvements réduits
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la grande aiguille est sur le 12
      Quand Tom touche une fois « + » de la grande aiguille
      Alors la grande aiguille est sur le 3 tout de suite, sans tourner

    # Question 18
    @a-valider
    Scénario: Avec les mouvements réduits, « Je ne sais pas » montre la bonne heure sans faire tourner les aiguilles
      Étant donné que l'appareil demande des mouvements réduits
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Quand Tom dit « Je ne sais pas »
      Alors les aiguilles montrent 3 h 30, sans tourner
      Et les lecteurs d'écran annoncent que la bonne réponse est 3 h 30

    Scénario: Sans réseau, les aiguilles placées sont corrigées et la séance continue
      Étant donné que Léa joue seulement l'exercice « Je place l'heure pile » de la leçon « Placer l'heure pile »
      Et que le réseau est coupé
      Quand Léa place les aiguilles sur 3 h
      Alors la question « Place les aiguilles sur 3 h. » est réussie
      Et la question « Place les aiguilles sur 12 h. » s'affiche
