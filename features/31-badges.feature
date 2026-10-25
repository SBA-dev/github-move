# language: fr
@issue-31 @wip
Fonctionnalité: Un badge par leçon acquise, au nom de sa compétence
  En tant qu'enfant
  Je veux recevoir un badge qui dit ce que je sais faire quand j'ai bien réussi une leçon
  Afin de voir mes progrès

  Cadrage anticipé (décision 0020, point 6). Les scénarios suivent la recommandation de chaque question de
  docs/stories/31/acceptance.md ; ceux qui dépendent d'une question encore ouverte portent @a-valider et un
  commentaire « Question 31.n ». Le badge ne fait que constater qu'une leçon est acquise (au moins 2 meilleures
  étoiles) : il n'est pas enregistré, ne modifie aucune étoile et ne se perd jamais tant que sa leçon existe
  (modèle : docs/stories/31/domain-model.md). « Médaille » n'est que le nom de l'écran, jamais celui d'un badge.

  Leçons de la bibliothèque utilisées (titre, compétence, matière, niveau) :
  - « Les sons ou, on, an » (fr-cp-sons-ou-on-an), « Je reconnais les sons ou, on, an », français, CP ;
  - « Les syllabes » (fr-cp-syllabes), « Je découpe un mot en syllabes », français, CP ;
  - « Être et avoir au présent » (fr-cp-etre-avoir) et « Dictée : les animaux » (fr-cp-dictee-animaux), sans compétence, français, CP ;
  - « Dictée : les mots invariables » (fr-ce1-dictee-invariables, CE1) et « Dictée : d'autres mots invariables »
    (fr-ce2-dictee-invariables, CE2), même compétence « J'écris des mots invariables sans erreur » ;
  - « Les durées » (ma-ce2-durees, CE2), « Heures, minutes, secondes » (ma-cm1-durees, CM1) et « Calculer des durées »
    (ma-cm2-durees, CM2), même compétence « Je calcule des durées » ;
  - « Les tables de 3 et de 4 » (ma-ce2-tables-3-4), « Je connais les tables de 3 et de 4 », maths, CE2 ;
  - « Problèmes : retrouver le début » (ma-cp-transformation-2), « Je résous des problèmes où l'on cherche le début
    ou le changement » (la plus longue compétence, 65 caractères), maths, CP.
  « Les sons de test » et « La suite de test » sont les leçons de test de #24, sans compétence ; certains scénarios
  leur en donnent une. Toute étape qui écrit des étoiles en base suppose que Léa joue avec un profil réel créé pour
  Paul (décision 0021, point 5), comme dans #32 ; seul le scénario « … sans profil réel au serveur … » garde le
  profil préparé du Contexte.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre enfant de Paul ;
  Claire n'est rattachée à aucun des deux.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque

  Règle: Une leçon acquise donne un badge ; une leçon réussie à 1 étoile ou au test de départ n'en donne pas ; un badge ne se perd jamais tant que sa leçon existe

    Plan du Scénario: Avec <étoiles> étoiles à une leçon, l'enfant a le badge de sa compétence
      Étant donné que Léa a pour meilleures étoiles :
        | leçon         | étoiles   |
        | Les syllabes  | <étoiles> |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je découpe un mot en syllabes »

      Exemples:
        | étoiles |
        | 2       |
        | 3       |

    # Question 31.10 (phrase sans badge)
    @a-valider
    Scénario: Une leçon réussie avec 1 étoile ne donne pas de badge
      Étant donné que Léa a pour meilleures étoiles :
        | leçon         | étoiles |
        | Les syllabes  | 1       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune pastille de badge n'apparaît
      Et Léa lit « Gagne au moins 2 étoiles dans une leçon pour recevoir son badge. »

    # Question 31.1 (déjà tranchée par les réponses 27.1 et 27.2) ; question 31.10 (phrase sans badge)
    @a-valider
    Scénario: Une leçon réussie au test de départ ne donne pas de badge
      Étant donné que Léa a pour leçons réussies au test de départ :
        | leçon               |
        | Les syllabes        |
        | Utiliser le bon mot |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune pastille de badge n'apparaît
      Et Léa lit « Gagne au moins 2 étoiles dans une leçon pour recevoir son badge. »

    # Question 31.1
    Scénario: Une leçon réussie au test de départ puis rejouée avec 2 étoiles donne son badge
      Étant donné que Léa a pour leçons réussies au test de départ :
        | leçon        |
        | Les syllabes |
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je découpe un mot en syllabes »

    Scénario: Rejouer une leçon acquise avec 1 étoile garde son badge
      Étant donné que Léa a pour meilleures étoiles :
        | leçon            | étoiles |
        | Les sons de test | 3       |
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 1 étoile
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je sais : Les sons de test »

    # Question 31.18
    @a-valider
    Scénario: Après un changement de classe, l'enfant garde les badges des leçons d'une autre classe
      Étant donné que Léa a pour meilleures étoiles :
        | leçon                   | étoiles |
        | Les tables de 3 et de 4 | 2       |
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je connais les tables de 3 et de 4 »

    # Question 31.13
    @a-valider
    Scénario: Une leçon qui n'est plus dans la bibliothèque ne donne pas de badge
      Étant donné que Léa a 3 étoiles à une leçon « Les anciens sons » qui n'est plus dans la bibliothèque
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune pastille de badge n'apparaît

    # Questions 31.5 et 31.22
    @a-valider @depend-de-39
    Scénario: Le badge d'une leçon personnelle disparaît avec la leçon
      Étant donné que Paul a créé la leçon personnelle « Dictée : chaton, maison, poisson »
      Et que Léa a gagné 2 étoiles à la leçon personnelle « Dictée : chaton, maison, poisson »
      Et que Paul a supprimé la leçon personnelle « Dictée : chaton, maison, poisson »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune pastille de badge n'apparaît

  Règle: Le nom du badge est la compétence de la leçon, sinon « Je sais : <titre de la leçon> » ; une compétence ne donne qu'un badge

    # Question 31.20 (si les 12 leçons reçoivent une compétence, ces exemples changent)
    @a-valider
    Plan du Scénario: Une leçon sans compétence donne le badge « Je sais : <titre> »
      Étant donné que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | <titre>   | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je sais : <titre> »

      Exemples:
        | titre                    |
        | Être et avoir au présent |
        | Dictée : les animaux     |

    # Questions 31.20 et 31.22
    @a-valider @depend-de-39
    Scénario: Une leçon personnelle donne toujours un badge « Je sais : » suivi de son titre
      Étant donné que Paul a créé la leçon personnelle « Dictée : chaton, maison, poisson »
      Et que Léa a gagné 2 étoiles à la leçon personnelle « Dictée : chaton, maison, poisson »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je sais : Dictée : chaton, maison, poisson »

    # Question 31.2
    @a-valider
    Plan du Scénario: Les leçons acquises d'une même compétence ne donnent qu'un badge (<compétence>)
      Étant donné que Léa a pour meilleures étoiles :
        | leçon      | étoiles |
        | <leçon 1>  | 2       |
        | <leçon 2>  | 3       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « <compétence> »

      Exemples:
        | compétence                               | leçon 1                       | leçon 2                            |
        | J'écris des mots invariables sans erreur | Dictée : les mots invariables | Dictée : d'autres mots invariables |
        | Je calcule des durées                    | Les durées                    | Calculer des durées                |

  Règle: La section « Mes badges » de « Mes médailles » montre une pastille par badge du profil en cours, toujours dans le même ordre

    # Question 31.10
    @a-valider
    Scénario: Sans badge, la section invite l'enfant à gagner au moins 2 étoiles
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les syllabes »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Mes badges »
      Et Léa lit « Gagne au moins 2 étoiles dans une leçon pour recevoir son badge. »

    # Question 31.7
    @a-valider
    Scénario: Les badges suivent l'ordre du catalogue : matière, puis niveau, puis ordre de la leçon
      Étant donné que Léa a pour meilleures étoiles :
        | leçon                   | étoiles |
        | Les tables de 3 et de 4 | 2       |
        | Les syllabes            | 3       |
        | Les sons ou, on, an     | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent, dans l'ordre :
        | badge                              |
        | Je reconnais les sons ou, on, an   |
        | Je découpe un mot en syllabes      |
        | Je connais les tables de 3 et de 4 |

    # Question 31.8
    @a-valider
    Plan du Scénario: La pastille d'un badge montre l'icône de sa matière (<matière>)
      Étant donné que Léa a pour meilleures étoiles :
        | leçon     | étoiles |
        | <leçon>   | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la pastille « <badge> » montre l'icône de la matière <matière>

      Exemples:
        | leçon                   | badge                              | matière  |
        | Les syllabes            | Je découpe un mot en syllabes      | français |
        | Les tables de 3 et de 4 | Je connais les tables de 3 et de 4 | maths    |

    # Question 31.14 (comme la décision 32.19)
    @a-valider
    Scénario: Juste après la séance qui rend une leçon acquise, son badge est déjà dans « Mes badges »
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les sons de test »
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 2 étoiles
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je sais : Les sons de test »

    # Question 31.15
    @a-valider
    Scénario: Une pastille de badge n'ouvre pas la leçon
      Étant donné que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la pastille « Je découpe un mot en syllabes »
      Alors le titre de l'écran est toujours « Mes médailles »

    # Question 31.14 (comme la décision 32.13)
    @a-valider
    Scénario: Sans réseau, la section des badges n'apparaît pas, sans message d'erreur
      Étant donné que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Et que le réseau est coupé
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « Mes badges » n'apparaît
      Et aucun message d'erreur n'apparaît

    # Question 31.14 (comme la décision 32.22)
    @a-valider
    Scénario: Avec le profil préparé, sans profil réel au serveur, les badges viennent des étoiles gagnées sur l'appareil
      Étant donné que Léa joue avec le profil préparé, sans profil réel au serveur
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 2 étoiles
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je sais : Les sons de test »

  Règle: La fin de la séance qui rend une leçon acquise annonce « Nouveau badge » ; rejouer une leçon déjà acquise ne l'annonce pas

    Scénario: Passer de 1 à 2 étoiles rend la leçon acquise et fait annoncer son badge
      Étant donné que la leçon de test « Les sons de test » a pour compétence « Je reconnais les sons de test »
      Et que Léa a pour meilleures étoiles :
        | leçon            | étoiles |
        | Les sons de test | 1       |
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce un nouveau badge « Je reconnais les sons de test »

    Scénario: La première séance avec 2 étoiles d'une leçon sans compétence annonce le badge « Je sais : Les sons de test »
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les sons de test »
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce un nouveau badge « Je sais : Les sons de test »

    # Question 31.4 (décision Q74 de #24)
    @a-valider
    Scénario: Le personnage guide termine sa phrase de fin par le nouveau badge
      Étant donné que la leçon de test « Les sons de test » a pour compétence « Je reconnais les sons de test »
      Et que Léa n'a encore jamais terminé de séance de la leçon « Les sons de test »
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Noisette dit une félicitation, suivie de « Tu gagnes 2 étoiles, Léa. Tu rejoues pour aller chercher les autres ? Nouveau badge : Je reconnais les sons de test ! »

    Plan du Scénario: Sans leçon devenue acquise, la fin de la séance n'annonce aucun badge (<cas>)
      Étant donné que Léa a pour meilleures étoiles :
        | leçon            | étoiles |
        | Les sons de test | <avant> |
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait <erreurs> erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de nouveau badge n'apparaît à la fin de la séance

      Exemples:
        | cas                                  | avant | erreurs |
        | leçon acquise rejouée avec 3 étoiles | 2     | 0       |
        | leçon acquise rejouée avec 2 étoiles | 3     | 2       |
        | leçon acquise rejouée avec 1 étoile  | 2     | 5       |
        | leçon réussie rejouée avec 1 étoile  | 1     | 5       |

    # Question 31.2
    @a-valider
    Scénario: Une leçon dont la compétence est déjà un badge n'annonce pas de nouveau badge
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » ont pour compétence « Je reconnais les sons de test »
      Et que Léa a pour meilleures étoiles :
        | leçon             | étoiles |
        | La suite de test  | 2       |
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de nouveau badge n'apparaît à la fin de la séance

    # Question 31.14 (comme la décision 32.13)
    @a-valider
    Scénario: Sans réseau au début de la séance, la fin de la séance n'annonce aucun badge
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les sons de test »
      Et que le réseau est coupé
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de nouveau badge n'apparaît à la fin de la séance

    # Questions 31.4 et 31.12 : ordre du legacy, cabane puis badge
    @a-valider @depend-de-32
    Scénario: Quand la séance fait recevoir un objet et gagner un badge, la cabane est annoncée avant le badge
      Étant donné que la leçon de test « Les sons de test » a pour compétence « Je reconnais les sons de test »
      Et que Léa a gagné 1 étoile en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance montre, dans l'ordre, l'annonce pour la cabane puis l'annonce de nouveau badge
      Et Noisette dit une félicitation, suivie de « Tu gagnes 2 étoiles, Léa. Tu rejoues pour aller chercher les autres ? Noisette a reçu une lanterne pour sa cabane. Nouveau badge : Je reconnais les sons de test ! »

    # Question 31.16
    @a-valider
    Scénario: Avec les mouvements réduits, l'annonce du nouveau badge apparaît sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa n'a encore jamais terminé de séance de la leçon « Les sons de test »
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors l'annonce de nouveau badge apparaît sans mouvement

  Règle: Les badges se lisent à voix haute, au lecteur d'écran, en mode dys et sur un petit écran

    # Questions 31.9 et 31.11 ; la cabane est lue avant les badges (#32). Si #33 est livrée avant #31,
    # le titre et la phrase de l'histoire s'insèrent entre la cabane et les badges.
    @a-valider @depend-de-32
    Scénario: Avec « tout lire à voix haute », le titre des badges puis leur nombre sont lus à l'ouverture
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette lire, dans l'ordre :
        | texte                                                               |
        | Regarde tout ce que tu as gagné !                                   |
        | Mes médailles                                                       |
        | La cabane de Noisette                                               |
        | Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne ! |
        | Mes badges                                                          |
        | Tu as 1 badge.                                                      |

    # Question 31.9
    @a-valider
    Scénario: Sans « tout lire à voix haute », l'enfant fait lire les badges à la demande
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les syllabes        | 2       |
        | Les sons ou, on, an | 3       |
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa demande à écouter les badges
      Alors Léa entend Noisette lire « Mes badges », puis « Tu as 2 badges. »

    # Questions 31.9 et 31.15
    @a-valider
    Scénario: Choisir une pastille de badge fait lire son nom
      Étant donné que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la pastille « Je découpe un mot en syllabes »
      Alors Léa entend Noisette lire « Je découpe un mot en syllabes »

    # Question 31.11 ; sans badge, la phrase de la décision 32.9 reste
    @a-valider @depend-de-32
    Scénario: Avec un badge, même sans objet ni record, le personnage guide dit « Regarde tout ce que tu as gagné ! »
      Étant donné que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette dire « Regarde tout ce que tu as gagné ! »

    # Questions 31.8 et 31.24
    @a-valider
    Scénario: Un lecteur d'écran annonce la liste des badges et le nom de chaque badge
      Étant donné que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les syllabes        | 2       |
        | Les sons ou, on, an | 3       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les lecteurs d'écran annoncent « Mes badges, avec 2 badges »
      Et les lecteurs d'écran annoncent « Je découpe un mot en syllabes »

    Scénario: Le badge au nom le plus long tient dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a pour meilleures étoiles :
        | leçon                           | étoiles |
        | Problèmes : retrouver le début  | 2       |
        | Dictée : les animaux            | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la page tient dans la largeur de l'écran
      Et le bouton d'accès à l'écran, « Retour » et chaque bouton « Écouter » mesurent au moins 44 px de haut

    Scénario: Avec le mode dys, la section des badges s'affiche en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa voit le titre et les pastilles des badges en mode dys : police Andika, lettres, mots et lignes espacés

  Règle: Les badges ne viennent que des leçons du profil enfant qui joue

    @acces
    Scénario: Un enfant ne voit jamais le badge d'un autre enfant du même parent
      Étant donné que Tom a un profil enfant préparé de niveau CP
      Et que Tom a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 3       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune pastille de badge n'apparaît

    @acces
    Scénario: Quand deux enfants du même parent ont des badges, chacun ne voit que les siens
      Étant donné que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Et que Tom a un profil enfant préparé de niveau CP
      Et que Tom a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les sons ou, on, an | 3       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les badges montrent seulement « Je découpe un mot en syllabes »

    @acces
    Scénario: Le second parent rattaché retrouve les badges de Léa sur son téléphone
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a pour meilleures étoiles :
        | leçon        | étoiles |
        | Les syllabes | 2       |
      Quand Léa ouvre « Mes médailles » sur le téléphone de Marie
      Alors les badges montrent seulement « Je découpe un mot en syllabes »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les étoiles qui donnent les badges de Léa
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les syllabes » sur la tablette
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les étoiles du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
