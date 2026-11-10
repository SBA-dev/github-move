# language: fr
@issue-190
Fonctionnalité: Exercice « horloge » : lire l'heure sur une horloge à aiguilles
  En tant qu'enfant
  Je veux voir une horloge à aiguilles et dire l'heure qu'elle montre
  Afin d'apprendre à lire l'heure comme en classe

  Contextes Catalogue pédagogique (nouveau type d'exercice `horloge` du format de leçon) et Apprentissage (correction
  en séance), docs/stories/190/domain-model.md. Les étoiles, l'avancement, la félicitation et les retours de #97 ne
  changent pas : ils ne sont pas redécrits.
  Cette story livre le type d'exercice `horloge`, la validation des leçons qui l'emploient et le mode lire. Le mode
  placer (l'enfant tourne les aiguilles) est la story #192 (features/192-horloge-placer.feature).
  Les commentaires « Décision #190.n » renvoient à la section « Décisions » de docs/stories/190/acceptance.md.

  Mots employés dans ces scénarios (mots d'interface, comme dans les leçons existantes et le programme) :
  - « la petite aiguille » : l'aiguille des heures ; « la grande aiguille » : l'aiguille des minutes ;
  - « sur le 3 » : l'aiguille pointe exactement le chiffre 3 du cadran ;
  - « 3 h », « 15 h 30 », « 6 h 18 » : l'écriture d'une heure montrée à l'enfant ; « trois heures » : l'heure dite.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test de l'horloge
  (identifiants préfixés « e2e-190- ») ; la vraie bibliothèque reste intacte. Toutes ses leçons sont des maths :
  - CP, « Lire l'heure pile » : exercice horloge « L'heure pile », mode lire, sans consigne ni précision, heures
    « 3:00 », « 9:00 » (aide « La petite aiguille est sur le 9. ») et « 12:00 » ;
  - CE1, « Les quarts d'heure » : exercice horloge « Je lis les quarts d'heure », mode lire, sans précision, heures
    « 2:15 », « 9:45 » et « 15:00 » ;
  - CE1, « Le matin et l'après-midi » : exercice horloge « Matin ou après-midi ? », mode lire, heure « 15:00 » de
    moment après-midi, aide « L'après-midi, on continue de compter après 12 : 13 h, 14 h, 15 h. ».
  Les leçons de test mal formées sont décrites dans les scénarios.
  Léa a un profil enfant de niveau CP, Tom de niveau CE1, Inès un profil du niveau donné par le scénario, tous dans
  l'univers « Animaux de la forêt » (personnage guide Noisette). Paul est le parent de Léa et de Tom.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
    Et que la bibliothèque de test de l'horloge est servie

  Règle: Une leçon dont l'exercice horloge est mal formé n'est jamais proposée ; chaque heure respecte la précision de l'heure de l'exercice, ou à défaut celle du niveau, qui ne dépasse pas le programme

    # Décision #190.9 : précision par défaut CP heure, CE1 quart d'heure, CE2 minute, CM1 minute, CM2 seconde ;
    # une précision plus fine que le niveau est refusée, une plus grossière est permise.
    Plan du Scénario: Au <niveau>, un exercice horloge à lire à « <heure> » <précision> <résultat> dans le parcours
      Étant donné qu'Inès a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Et qu'une leçon de test « L'heure de test » de niveau <niveau> a un exercice horloge à lire à « <heure> » <précision>
      Quand Inès choisit « Maths » dans son parcours
      Alors « L'heure de test » <résultat> dans le parcours

      Exemples:
        | niveau | heure   | précision            | résultat       |
        | CP     | 3:00    | sans précision       | apparaît       |
        | CP     | 3:30    | sans précision       | n'apparaît pas |
        | CE1    | 3:30    | sans précision       | apparaît       |
        | CE1    | 9:45    | sans précision       | apparaît       |
        | CE1    | 3:10    | sans précision       | n'apparaît pas |
        | CE1    | 3:10    | de précision minute  | n'apparaît pas |
        | CE2    | 6:18    | sans précision       | apparaît       |
        | CE2    | 3:00    | de précision heure   | apparaît       |
        | CE2    | 3:30    | de précision heure   | n'apparaît pas |
        | CM1    | 4:41    | sans précision       | apparaît       |
        | CM1    | 4:41:10 | sans précision       | n'apparaît pas |
        | CM2    | 6:18:20 | de précision seconde | apparaît       |

    # Décision #190.17 : minuit (0:00) est refusé partout dans cette story.
    Plan du Scénario: Une leçon dont l'exercice horloge <défaut> n'est pas proposée
      Étant donné qu'une leçon de test « L'heure de test » de niveau CE1 a un exercice horloge qui <défaut>
      Quand Tom choisit « Maths » dans son parcours
      Alors « L'heure de test » n'apparaît pas dans le parcours
      Mais « Les quarts d'heure » apparaît dans le parcours

      Exemples:
        | défaut                                                    |
        | a le mode « regarder »                                    |
        | n'a pas de mode                                           |
        | n'a aucune heure                                          |
        | demande l'heure « 25:00 »                                 |
        | demande l'heure « 3:60 »                                  |
        | demande l'heure « 0:00 »                                  |
        | demande l'heure « 3 h 30 », qui n'est pas écrite « H:MM » |
        | a la précision « dix minutes »                            |

    # Décision #190.30
    Scénario: Une leçon dont l'exercice horloge demande deux heures égales sur le cadran n'est pas proposée
      Étant donné qu'une leçon de test « L'heure de test » de niveau CE1 a un exercice horloge qui demande « 3:00 » et « 15:00 »
      Quand Tom choisit « Maths » dans son parcours
      Alors « L'heure de test » n'apparaît pas dans le parcours

  Règle: En mode lire, l'horloge à aiguilles montre une heure ; au CP l'enfant la choisit parmi trois heures toutes différentes sur le cadran, à partir du CE1 il l'écrit au clavier de cristaux ; une heure égale sur le cadran est juste, sauf si un moment de la journée est demandé ; l'heure n'est jamais écrite pendant la question

    # Décisions #190.1 (choix au CP, clavier de cristaux à partir du CE1) et #190.11 (choix calculés)
    Scénario: Au CP, l'horloge montre 3 h et Léa choisit parmi trois heures entières, toutes différentes
      Étant donné que Léa est sur la page de la leçon « Lire l'heure pile »
      Quand Léa choisit seulement l'exercice « L'heure pile »
      Alors Léa voit une horloge à aiguilles, la petite aiguille sur le 3 et la grande sur le 12
      Et Léa voit trois choix, dont « 3 h », tous des heures entières différentes sur le cadran

    # Décision #190.10 : 12:00 s'écrit « 12 h » dans les choix.
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

    Scénario: Au CE1, Tom écrit l'heure montrée au clavier de cristaux
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom écrit « 2 h 15 » sur le clavier de cristaux et valide
      Alors Noisette applaudit en sautant
      Et la question est réussie

    # Décision #190.8 : sans moment de la journée, une heure égale sur le cadran est juste.
    Scénario: Sans moment de la journée, « 14 h 15 » est juste pour l'horloge qui montre 2 h 15
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom écrit « 14 h 15 » sur le clavier de cristaux et valide
      Alors la question est réussie

    # Décision #190.8 : avec un moment de la journée, il est dit après la consigne et seule l'heure de ce moment est juste.
    Scénario: Quand c'est l'après-midi, « 3 h » n'est pas la bonne réponse et l'aide de l'heure est lue
      Étant donné que Tom joue seulement l'exercice « Matin ou après-midi ? » de la leçon « Le matin et l'après-midi »
      Et que Tom a entendu Noisette lire « Quelle heure est-il ? C'est l'après-midi. »
      Quand Tom écrit « 3 h » sur le clavier de cristaux et valide
      Alors Noisette dit un encouragement, suivi de « L'après-midi, on continue de compter après 12 : 13 h, 14 h, 15 h. »
      Et la question reste posée

    Scénario: Une heure impossible ne peut pas être validée
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Quand Tom écrit « 2 h 75 » sur le clavier de cristaux
      Alors Tom ne peut pas valider « 2 h 75 »
      Et aucune erreur n'est comptée

    # Décision #190.5 : l'affichage digital n'est jamais montré pendant la question, seulement après la bonne réponse.
    Scénario: Pendant la question, l'heure n'est écrite nulle part à côté de l'horloge
      Étant donné que Tom est sur la page de la leçon « Les quarts d'heure »
      Quand Tom choisit seulement l'exercice « Je lis les quarts d'heure »
      Alors Tom voit une horloge à aiguilles qui montre 2 h 15
      Mais ni « 2 h 15 » ni « 2 : 15 » ni « 14 : 15 » n'est écrit à l'écran

    Scénario: Après la bonne réponse, au CE1, l'affichage digital est montré à côté de l'horloge
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom écrit « 2 h 15 » sur le clavier de cristaux et valide
      Alors Tom voit « 2 : 15 » à côté de l'horloge

  Règle: Une réponse fausse coûte une erreur, jamais une punition : un encouragement, l'aide, et une nouvelle chance ; « Je ne sais pas » montre la bonne heure une fois par question, puis l'enfant la donne lui-même ; une question ratée revient en révision

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

    Scénario: Avec une erreur dans l'exercice horloge, Léa gagne 2 étoiles
      Étant donné qu'une leçon de test de niveau CP a un seul exercice horloge à lire à « 3:00 »
      Et que Léa a répondu une fois une autre heure que « 3 h »
      Quand Léa répond « 3 h »
      Alors Léa gagne 2 étoiles

    Plan du Scénario: « Je ne sais pas » est proposé dans un exercice horloge (<cas>)
      Quand <enfant> commence l'exercice « <exercice> » de la leçon « <leçon> »
      Alors « Je ne sais pas » est proposé à <enfant>

      Exemples:
        | cas                               | enfant | leçon              | exercice                  |
        | mode lire, avec les choix         | Léa    | Lire l'heure pile  | L'heure pile              |
        | mode lire, au clavier de cristaux | Tom    | Les quarts d'heure | Je lis les quarts d'heure |

    Scénario: En mode lire avec les choix, « Je ne sais pas » ne laisse que la bonne heure, qui brille
      Étant donné que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que l'horloge montre 9 h
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 9 h » reste, et il brille
      Et Noisette dit « Pas de souci, on apprend ensemble ! La petite aiguille est sur le 9. La bonne réponse brille : touche-la. »

    Scénario: En mode lire au clavier de cristaux, « Je ne sais pas » dit l'heure à taper
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom dit « Je ne sais pas »
      Alors Noisette dit « Pas de souci ! La petite aiguille montre les heures, la grande les minutes. La réponse est 2 h 15. Tape-la sur les cristaux. »
      Et la question reste posée jusqu'à ce que Tom écrive « 2 h 15 »

    Scénario: Après « Je ne sais pas », il n'est plus proposé pour cette question
      Étant donné que Tom joue seulement l'exercice « Je lis les quarts d'heure » de la leçon « Les quarts d'heure »
      Et que l'horloge montre 2 h 15
      Quand Tom dit « Je ne sais pas »
      Alors « Je ne sais pas » n'est plus proposé à Tom pour cette question

    # Décision #190.15 : une question d'horloge ratée revient en révision, dans le même mode.
    Scénario: Une question d'horloge ratée revient en séance de révision, dans le même mode
      Étant donné que Léa a pour question retenue l'horloge qui montre 9 h de l'exercice « L'heure pile », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors Léa voit une horloge à aiguilles, la petite aiguille sur le 9 et la grande sur le 12
      Et Léa voit trois choix, dont « 9 h », tous des heures entières différentes sur le cadran

  Règle: La consigne est lue à voix haute, jamais l'heure à lire ; l'horloge tient à 360 px, respecte le mode dys et se joue sans réseau

    Scénario: En mode lire, la consigne est lue mais pas l'heure montrée
      Étant donné que Léa est sur la page de la leçon « Lire l'heure pile »
      Quand Léa choisit seulement l'exercice « L'heure pile »
      Alors Léa entend Noisette lire « Quelle heure est-il ? »
      Mais Léa n'entend pas Noisette dire « trois heures »

    # Décision #190.27 : l'horloge est nommée « Horloge à aiguilles », sans dire l'heure avant la réponse.
    Scénario: En mode lire, les lecteurs d'écran nomment l'horloge sans dire l'heure qu'elle montre
      Étant donné que Léa est sur la page de la leçon « Lire l'heure pile »
      Quand Léa choisit seulement l'exercice « L'heure pile »
      Alors les lecteurs d'écran annoncent une horloge à aiguilles
      Mais les lecteurs d'écran ne disent pas « 3 h » avant que Léa réponde

    # Décision #190.10 : les choix sont lus comme des heures dites.
    Scénario: Avec « tout lire à voix haute », les heures proposées sont lues comme des heures dites
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que les choix sont affichés dans l'ordre « 3 h », « 12 h », « 4 h »
      Quand la question « Quelle heure est-il ? » s'affiche
      Alors Léa entend ensuite Noisette dire « Est-ce trois heures, midi, ou quatre heures ? »

    Plan du Scénario: À 360 px, l'horloge à lire et <commandes> tiennent dans la largeur de l'écran
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand <enfant> commence l'exercice « <exercice> » de la leçon « <leçon> »
      Alors la page tient dans la largeur de l'écran
      Et l'horloge à aiguilles, <commandes> et « Je ne sais pas » sont visibles en entier

      Exemples:
        | enfant | leçon              | exercice                  | commandes              |
        | Léa    | Lire l'heure pile  | L'heure pile              | les trois choix        |
        | Tom    | Les quarts d'heure | Je lis les quarts d'heure | le clavier de cristaux |

    Scénario: En mode dys, la consigne et les heures proposées s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand Léa commence l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Alors Léa voit la consigne et les choix en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: Sans réseau, la réponse à l'horloge est corrigée et la séance continue
      Étant donné que Léa joue seulement l'exercice « L'heure pile » de la leçon « Lire l'heure pile »
      Et que l'horloge montre 3 h
      Et que le réseau est coupé
      Quand Léa répond « 3 h »
      Alors la question est réussie
      Et l'horloge montre ensuite 9 h
