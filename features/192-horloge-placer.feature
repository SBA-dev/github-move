# language: fr
@issue-192 @wip @depend-de-190
Fonctionnalité: Exercice « horloge » : placer les aiguilles (suite de #190)
  En tant qu'enfant
  Je veux tourner moi-même les aiguilles d'une horloge pour montrer une heure donnée
  Afin d'apprendre à positionner les aiguilles comme en classe

  Suite de la story #190 (features/190-horloge.feature), qui livre le type d'exercice `horloge`, la validation des
  leçons et le mode lire. Cette story ajoute le mode placer. Modèle : docs/stories/190/domain-model.md.
  Toute la fonctionnalité porte @depend-de-190 : elle attend que #190 soit mergée ; le tag est retiré au début de
  la livraison de #192.
  Les commentaires « Décision #190.n » renvoient à la section « Décisions » de docs/stories/190/acceptance.md, reprise
  dans docs/stories/192/acceptance.md.

  Mots employés dans ces scénarios (mots d'interface, comme dans les leçons existantes et le programme) :
  - « la petite aiguille » : l'aiguille des heures ; « la grande aiguille » : l'aiguille des minutes ;
  - « sur le 3 » : l'aiguille pointe exactement le chiffre 3 du cadran ; « à mi-chemin entre le 3 et le 4 » : la
    petite aiguille est au milieu de l'espace entre le 3 et le 4 (3 h 30) ; « au quart du chemin » : au premier quart
    de cet espace (3 h 15) ; « aux trois quarts du chemin » : au troisième quart (3 h 45) ;
  - « place les aiguilles sur 3 h 30 » : la petite et la grande aiguille sont posées comme sur une vraie horloge à
    3 h 30, puis l'enfant valide ;
  - « 3 h », « 15 h 30 », « 6 h 18 » : l'écriture d'une heure montrée à l'enfant ; « trois heures » : l'heure dite ;
  - « tourne en douceur » : l'aiguille va d'une position à l'autre par un mouvement, sans sauter d'un coup.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test de l'horloge à
  placer (identifiants préfixés « e2e-192- ») ; la vraie bibliothèque reste intacte. Toutes ses leçons sont des maths :
  - CP, « Placer l'heure pile » : exercice horloge « Je place l'heure pile », mode placer, sans consigne ni
    précision, heures « 3:00 » et « 12:00 » ;
  - CE1, « Placer la demie et le quart » : exercice horloge « Je place la demie », mode placer, sans précision,
    heures « 3:30 » et « 3:15 » ;
  - CE2, « L'heure à la minute » : exercice horloge « Je place les minutes », mode placer, précision minute, heures
    « 6:18 » et « 10:35 » ;
  - CM1, « Heures et minutes » : exercice horloge « Je place l'heure », mode placer, sans précision, heure « 4:40 » ;
  - CM2, « Heures, minutes et secondes » : exercice horloge « Je place les secondes », mode placer, précision
    seconde, heure « 6:18:20 ».
  Les leçons de test mal formées sont décrites dans les scénarios.
  Léa a un profil enfant de niveau CP, Tom de niveau CE1, Inès un profil du niveau donné par le scénario, tous dans
  l'univers « Animaux de la forêt » (personnage guide Noisette).

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
    Et que la bibliothèque de test de l'horloge à placer est servie

  Règle: Au CP, une heure à placer est une heure entière de 1 h à 12 h ; une leçon qui en demande une autre n'est jamais proposée

    # Décision #190.17 : au CP en mode placer, de 1 h à 12 h ; minuit (0:00) refusé partout.
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

  Règle: En mode placer, l'enfant tourne les aiguilles puis valide ; la réponse est juste si la grande aiguille est sur les minutes attendues et si la petite aiguille est à la place que lui donnent ces minutes (aiguilles cohérentes)

    # Décision #190.23 : les aiguilles partent de 12 h, ou de 6 h quand l'heure à placer est égale à 12 h sur le cadran.
    Scénario: Au début d'une question à placer, les aiguilles montrent 12 h
      Étant donné que Léa est sur la page de la leçon « Placer l'heure pile »
      Quand Léa choisit seulement l'exercice « Je place l'heure pile »
      Alors Léa voit une horloge à aiguilles, les deux aiguilles sur le 12
      Et Léa voit « Place les aiguilles sur 3 h. »

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
        | niveau | enfant | leçon                       | exercice              | heure  |
        | CP     | Léa    | Placer l'heure pile         | Je place l'heure pile | 3 h    |
        | CP     | Léa    | Placer l'heure pile         | Je place l'heure pile | 12 h   |
        | CE1    | Tom    | Placer la demie et le quart | Je place la demie     | 3 h 30 |
        | CE1    | Tom    | Placer la demie et le quart | Je place la demie     | 3 h 15 |

    # Décisions #190.3 (aiguilles séparées au CP et au CE1), #190.7 (cohérence exacte) et #190.33 (aide par défaut)
    Plan du Scénario: Pour 3 h 30, la grande aiguille sur le 6 et la petite <place de la petite aiguille> ne sont pas cohérentes
      Étant donné que Tom joue seulement l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. »
      Quand Tom valide la grande aiguille sur le 6 et la petite <place de la petite aiguille>
      Alors Noisette dit un encouragement, suivi de « La petite aiguille montre les heures, la grande les minutes. »
      Et la question « Place les aiguilles sur 3 h 30. » reste posée

      Exemples:
        | place de la petite aiguille                   |
        | sur le 3                                      |
        | sur le 4                                      |
        | aux trois quarts du chemin entre le 3 et le 4 |

    Scénario: Des aiguilles qui montrent 3 h 15 ne réussissent pas « 3 h 30 »
      Étant donné que Tom joue seulement l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. »
      Quand Tom valide la grande aiguille sur le 3 et la petite au quart du chemin entre le 3 et le 4
      Alors Noisette dit un encouragement, suivi de « La petite aiguille montre les heures, la grande les minutes. »
      Et la question « Place les aiguilles sur 3 h 30. » reste posée

    # Décision #190.3 : à partir du CE2, la petite aiguille suit la grande, comme sur une vraie horloge.
    Scénario: À partir du CE2, la petite aiguille avance d'elle-même quand la grande tourne
      Étant donné qu'Inès a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « Je place les minutes » de la leçon « L'heure à la minute »
      Et que la petite aiguille est sur le 6 et la grande aiguille sur le 12
      Quand Inès tourne la grande aiguille d'un demi-tour, jusqu'au 6
      Alors la petite aiguille est à mi-chemin entre le 6 et le 7

    # Décisions #190.3 et #190.9 (CE2 à la minute)
    Plan du Scénario: À partir du CE2, au <niveau>, les aiguilles placées sur <heure> réussissent la question
      Étant donné qu'Inès a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Et qu'Inès en est à la question « Place les aiguilles sur <heure>. »
      Quand Inès place les aiguilles sur <heure>
      Alors la question est réussie

      Exemples:
        | niveau | leçon               | exercice             | heure   |
        | CE2    | L'heure à la minute | Je place les minutes | 6 h 18  |
        | CE2    | L'heure à la minute | Je place les minutes | 10 h 35 |
        | CM1    | Heures et minutes   | Je place l'heure     | 4 h 40  |

    # Décisions #190.4 (aiguille des secondes au CM2, seulement à la précision seconde) et #190.10 (écriture des secondes)
    Scénario: Au CM2, à la précision seconde, l'horloge a une aiguille des secondes à placer aussi
      Étant donné qu'Inès a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « Je place les secondes » de la leçon « Heures, minutes et secondes »
      Et qu'Inès en est à la question « Place les aiguilles sur 6 h 18 min 20 s. »
      Quand Inès place les aiguilles sur 6 h 18 min 20 s
      Alors la question est réussie

    Scénario: Sans la précision seconde, l'horloge n'a pas d'aiguille des secondes
      Étant donné qu'Inès a un profil enfant préparé de niveau CM1 dans l'univers « Animaux de la forêt »
      Quand Inès commence l'exercice « Je place l'heure » de la leçon « Heures et minutes »
      Alors Inès voit une horloge à aiguilles avec une petite et une grande aiguille seulement

    # Décision #190.2 : aiguilles aimantées au pas de la précision de l'heure.
    Plan du Scénario: Au <niveau>, la grande aiguille lâchée <où elle est lâchée> se pose <où elle se pose>
      Étant donné qu'Inès a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand Inès lâche la grande aiguille <où elle est lâchée>
      Alors la grande aiguille se pose <où elle se pose>

      Exemples:
        | niveau | leçon                       | exercice             | où elle est lâchée                                   | où elle se pose            |
        | CE1    | Placer la demie et le quart | Je place la demie    | un peu après le 3                                    | sur le 3                   |
        | CE1    | Placer la demie et le quart | Je place la demie    | un peu avant le 6                                    | sur le 6                   |
        | CE2    | L'heure à la minute         | Je place les minutes | entre le trait de 18 et celui de 19, plus près du 18 | sur le trait de 18 minutes |

    # Décisions #190.2 et #190.24 : au CP, la grande aiguille reste sur le 12, l'enfant ne place que la petite.
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

    # Décisions #190.2 et #190.25 (pas des boutons et des flèches)
    Plan du Scénario: Au CE1, « <bouton> » de la grande aiguille la fait passer du 12 <à où>
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la grande aiguille est sur le 12
      Quand Tom touche une fois « <bouton> » de la grande aiguille
      Alors la grande aiguille est <à où>

      Exemples:
        | bouton | à où     |
        | +      | sur le 3 |
        | −      | sur le 9 |

    # Décisions #190.3 (aiguilles placées séparément au CE1) et #190.25
    Scénario: Au CE1, « + » de la petite aiguille l'avance d'un quart du chemin vers le chiffre suivant
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la petite aiguille est sur le 3
      Quand Tom touche une fois « + » de la petite aiguille
      Alors la petite aiguille est au quart du chemin entre le 3 et le 4

    # Décision #190.25 : flèche droite ou haut dans le sens des aiguilles d'une montre, gauche ou bas dans l'autre sens.
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

    # Décisions #190.19 (l'heure placée n'est pas écrite à l'écran) et #190.26 (texte de l'annonce)
    Scénario: L'heure placée est annoncée aux lecteurs d'écran, sans être écrite à l'écran
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la petite aiguille est à mi-chemin entre le 3 et le 4 et la grande sur le 3
      Quand Tom touche trois fois « + » de la grande aiguille
      Alors les lecteurs d'écran annoncent « Les aiguilles montrent 3 h 30. »
      Mais « 3 h 30 » n'est écrit à l'écran que dans la consigne

  Règle: Une réponse fausse coûte une erreur, jamais une punition : un encouragement, l'aide, et une nouvelle chance avec ce que l'enfant a placé ; « Je ne sais pas » montre la bonne heure une fois par question, puis l'enfant place lui-même les aiguilles ; une question ratée revient en révision

    # Décision #190.6 : après une erreur, les aiguilles de l'enfant restent ; la bonne heure n'est pas montrée.
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

    Scénario: Avec une erreur dans l'exercice horloge à placer, Léa gagne 2 étoiles
      Étant donné qu'une leçon de test de niveau CP a un seul exercice horloge à placer à « 3:00 »
      Et que Léa a validé une fois les aiguilles sur une autre heure que 3 h
      Quand Léa place les aiguilles sur 3 h
      Alors Léa gagne 2 étoiles

    Scénario: « Je ne sais pas » est proposé dans un exercice horloge à placer
      Quand Tom commence l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Alors « Je ne sais pas » est proposé à Tom

    # Décisions #190.18 (les aiguilles montrent la bonne heure, puis reviennent) et #190.28 (la bonne heure ne reste pas affichée)
    Scénario: En mode placer, « Je ne sais pas » montre la bonne heure, puis Tom place lui-même les aiguilles
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la petite aiguille est sur le 12 et la grande sur le 12
      Quand Tom dit « Je ne sais pas »
      Alors les aiguilles tournent en douceur jusqu'à 3 h 30, puis reviennent où Tom les avait mises
      Et Noisette dit « Pas de souci, on apprend ensemble ! », suivi de « La petite aiguille montre les heures, la grande les minutes. »
      Et Tom doit encore placer lui-même les aiguilles sur 3 h 30

    Scénario: Après « Je ne sais pas » en mode placer, il n'est plus proposé pour cette question
      Étant donné que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Quand Tom dit « Je ne sais pas »
      Alors « Je ne sais pas » n'est plus proposé à Tom pour cette question

    # Décision #190.15 : une question d'horloge ratée revient en révision, dans le même mode.
    Scénario: Une question d'horloge à placer ratée revient en séance de révision, dans le même mode
      Étant donné que Léa a pour question retenue « Place les aiguilles sur 3 h. » de l'exercice « Je place l'heure pile », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors Léa voit une horloge à aiguilles, les deux aiguilles sur le 12
      Et Léa voit « Place les aiguilles sur 3 h. »

  Règle: L'heure à placer est écrite et lue à voix haute ; l'horloge à placer tient à 360 px, ses boutons et ses aiguilles mesurent au moins 44 px, elle se joue sans réseau et sans mouvement quand l'appareil le demande

    # Décision #190.10 : « 3 h » dit « trois heures », « 12 h » dit « midi », « et demie », « et quart ».
    Plan du Scénario: Sans consigne, l'heure à placer <écriture> est écrite et dite « <heure dite> »
      Étant donné que <enfant> joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand la question de l'heure « <heure> » s'affiche
      Alors <enfant> voit « Place les aiguilles sur <écriture>. »
      Et <enfant> entend Noisette lire « Place les aiguilles sur <heure dite>. »

      Exemples:
        | enfant | leçon                       | exercice              | heure | écriture | heure dite            |
        | Léa    | Placer l'heure pile         | Je place l'heure pile | 3:00  | 3 h      | trois heures          |
        | Léa    | Placer l'heure pile         | Je place l'heure pile | 12:00 | 12 h     | midi                  |
        | Tom    | Placer la demie et le quart | Je place la demie     | 3:30  | 3 h 30   | trois heures et demie |
        | Tom    | Placer la demie et le quart | Je place la demie     | 3:15  | 3 h 15   | trois heures et quart |

    # Décision #190.10 (choix de l'orchestrateur, à confirmer par le PO) : à partir du CE2, les minutes de 40 à 55 se
    # disent avec « moins » ; les autres minutes se disent en nombre.
    @a-valider
    Plan du Scénario: À partir du CE2, au <niveau>, l'heure à placer <écriture> est dite « <heure dite> »
      Étant donné qu'Inès a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Et qu'Inès joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand la question de l'heure « <heure> » s'affiche
      Alors Inès voit « Place les aiguilles sur <écriture>. »
      Et Inès entend Noisette lire « Place les aiguilles sur <heure dite>. »

      Exemples:
        | niveau | leçon               | exercice             | heure | écriture | heure dite             |
        | CE2    | L'heure à la minute | Je place les minutes | 6:18  | 6 h 18   | six heures dix-huit    |
        | CE2    | L'heure à la minute | Je place les minutes | 10:35 | 10 h 35  | dix heures trente-cinq |
        | CM1    | Heures et minutes   | Je place l'heure     | 4:40  | 4 h 40   | cinq heures moins vingt |

    # Décision #190.29 : la consigne de l'exercice est lue, puis l'heure dite.
    Scénario: Avec sa propre consigne, l'exercice à placer lit la consigne puis l'heure dite
      Étant donné qu'une leçon de test de niveau CP a un exercice horloge à placer à « 9:00 », de consigne « Montre l'heure du début de la classe. »
      Quand Léa commence cet exercice
      Alors Léa entend Noisette lire « Montre l'heure du début de la classe. », puis « neuf heures »

    Scénario: Léa peut réécouter l'heure à placer
      Étant donné que Léa joue seulement l'exercice « Je place l'heure pile » de la leçon « Placer l'heure pile »
      Et que Noisette a fini de lire « Place les aiguilles sur trois heures. »
      Quand Léa demande à réécouter la question
      Alors Léa entend de nouveau Noisette lire « Place les aiguilles sur trois heures. »

    Scénario: À 360 px, l'horloge à placer et ses commandes tiennent dans la largeur de l'écran
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand Tom commence l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Alors la page tient dans la largeur de l'écran
      Et l'horloge à aiguilles, les boutons « + » et « − » des aiguilles, « Valider » et « Je ne sais pas » sont visibles en entier

    Scénario: Les boutons « + » et « − » et chaque aiguille se touchent du doigt sur au moins 44 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand Tom commence l'exercice « Je place la demie » de la leçon « Placer la demie et le quart »
      Alors chaque bouton « + » et « − » mesure au moins 44 px de haut et de large
      Et chaque aiguille se saisit du doigt sur une zone d'au moins 44 px

    Scénario: Avec les mouvements réduits, l'aiguille saute à sa place sans tourner
      Étant donné que l'appareil demande des mouvements réduits
      Et que Tom en est à la question « Place les aiguilles sur 3 h 30. » de l'exercice « Je place la demie »
      Et que la grande aiguille est sur le 12
      Quand Tom touche une fois « + » de la grande aiguille
      Alors la grande aiguille est sur le 3 tout de suite, sans tourner

    # Décision #190.18
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
