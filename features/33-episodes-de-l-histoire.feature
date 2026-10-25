# language: fr
@issue-33 @wip
Fonctionnalité: Un épisode de l'histoire des Savanturiers s'ouvre à chaque séance terminée
  En tant qu'enfant
  Je veux ouvrir un nouvel épisode d'une histoire quand je termine une séance, et me le faire lire
  Afin d'avoir envie de connaître la suite

  L'histoire ne fait que compter les séances terminées du profil en cours : elle ne modifie aucune séance,
  aucune étoile et n'enregistre rien (modèle : docs/stories/33/domain-model.md). Le PO a validé le cadrage le
  2026-10-25 (« 33. reco OK ») : les décisions 33.1 à 33.31 sont dans docs/stories/33/acceptance.md, et le
  commentaire au-dessus d'un scénario rappelle la décision qu'il illustre. Le code commence après le merge de #30.

  Les 20 épisodes (titres du legacy, dans l'ordre) : 1 « La carte froissée », 2 « Le premier indice »,
  3 « Le pont des lettres », 4 « Pipo le hérisson », 5 « La forêt qui chuchote », 6 « Le moulin des nombres »,
  7 « Une plume dans le vent », 8 « La pluie de verbes », 9 « Le village des sons », 10 « La nuit des lucioles »,
  11 « Le géant endormi », 12 « La boutique du renard », 13 « Le pied de la montagne », 14 « L'automne en couleurs »,
  15 « La grotte de l'écho », 16 « L'horloge de glace », 17 « La tempête de neige », 18 « Le dernier escalier »,
  19 « L'Étoile du savoir », 20 « Le retour des Savanturiers ». « L'Étoile du savoir » est un titre, pas un terme
  du domaine (décision 33.4).

  « Léa a terminé N séances » prépare N séances terminées de la leçon « Les sons ou, on, an », chacune un jour
  différent avant aujourd'hui et avec au moins 1 étoile, sans jouer de séance : l'exemple ne dépend ni du jour
  ni des étoiles (décision 33.1 : chaque séance terminée ouvre un épisode). Elle ne change pas le total des étoiles de la cabane : quand un scénario en a
  besoin, « Léa a gagné N étoiles en tout » fixe ce total, séances préparées comprises. Comme toute étape qui écrit en base, elle suppose que Léa joue avec un profil réel,
  créé pour Paul (features/steps/profil-reel.ts, décision 0021, point 5) ; les séances partent avec le profil enfant.
  « Les sons de test » est la leçon de test de #24 (10 questions : 0 erreur donne 3 étoiles, 5 erreurs 1 étoile).
  La zone « nouveautés » de l'écran de fin et la phrase de fin avec la cabane viennent de #32 : la story se code
  après son merge ; seuls les scénarios qui font aussi recevoir un objet à la cabane portent @depend-de-32.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre enfant de Paul ;
  Claire n'est rattachée à aucun des deux.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque

  Règle: Chaque séance terminée ouvre l'épisode suivant de l'histoire, dans l'ordre, jusqu'au 20e ; ni le test de départ ni une séance quittée n'en ouvrent

    Scénario: Sans aucune séance, les 20 tuiles de l'histoire sont « À découvrir »
      Étant donné que Léa n'a terminé aucune séance
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les 20 tuiles de l'histoire montrent « À découvrir »

    Scénario: Après deux séances, les deux premières tuiles montrent leur titre
      Étant donné que Léa a terminé 2 séances
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les tuiles 1 et 2 de l'histoire montrent « La carte froissée » et « Le premier indice »
      Et les tuiles 3 à 20 de l'histoire montrent « À découvrir »

    Scénario: Au-delà de 20 séances, les 20 épisodes sont ouverts
      Étant donné que Léa a terminé 25 séances
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les tuiles de l'histoire montrent, dans l'ordre :
        | tuile                      |
        | La carte froissée          |
        | Le premier indice          |
        | Le pont des lettres        |
        | Pipo le hérisson           |
        | La forêt qui chuchote      |
        | Le moulin des nombres      |
        | Une plume dans le vent     |
        | La pluie de verbes         |
        | Le village des sons        |
        | La nuit des lucioles       |
        | Le géant endormi           |
        | La boutique du renard      |
        | Le pied de la montagne     |
        | L'automne en couleurs      |
        | La grotte de l'écho        |
        | L'horloge de glace         |
        | La tempête de neige        |
        | Le dernier escalier        |
        | L'Étoile du savoir         |
        | Le retour des Savanturiers |

    # Décisions 33.1 et 33.7 : la séance compte avec 1 étoile, et même si c'est la deuxième du jour
    Scénario: Deux séances le même jour ouvrent deux épisodes, même à 1 étoile
      Étant donné que Léa n'a terminé aucune séance
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 3 étoiles
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 1 étoile
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les tuiles 1 et 2 de l'histoire montrent « La carte froissée » et « Le premier indice »

    # Décision 33.7
    Plan du Scénario: Une séance <cas> ouvre aussi un épisode
      Étant donné que Léa n'a terminé aucune séance
      Et que <séance>
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la tuile 1 de l'histoire montre « La carte froissée »

      Exemples:
        | cas                        | séance                                                                                       |
        | d'un seul exercice         | Léa a terminé une séance de l'exercice « Dernières bulles » seul                             |
        | faite seulement de fluence | Léa a fini la fluence « Calcul rapide : les doubles », jouée seule, avec 12 calculs réussis |

    Scénario: Le test de départ n'ouvre aucun épisode
      Étant donné que la bibliothèque de test du test de départ est servie
      Et que Léa n'a terminé aucune séance
      Et que Léa a fait le test de départ, en répondant juste à toutes les questions
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les 20 tuiles de l'histoire montrent « À découvrir »

    Scénario: La fin du test de départ n'annonce aucun nouvel épisode
      Étant donné que la bibliothèque de test du test de départ est servie
      Et que Léa n'a terminé aucune séance
      Et que Léa a commencé le test de départ
      Quand Léa répond juste à toutes les questions du test de départ
      Alors aucune annonce de nouvel épisode n'apparaît à la fin du test de départ

    Scénario: Une séance quittée avant la fin n'ouvre aucun épisode
      Étant donné que Léa n'a terminé aucune séance
      Et que Léa a quitté la séance complète de la leçon « Les sons de test » après 3 questions réussies
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les 20 tuiles de l'histoire montrent « À découvrir »

    Scénario: Une séance gardée sur l'appareil puis envoyée n'ouvre qu'un seul épisode
      Étant donné que Léa n'a terminé aucune séance
      Et que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette, sans réseau
      Et que le réseau est revenu sur la tablette
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la tuile 1 de l'histoire montre « La carte froissée »
      Et les tuiles 2 à 20 de l'histoire montrent « À découvrir »

    # Décision 33.7 (et décision 28.16 : la séance de révision est une séance)
    @depend-de-28
    Scénario: Une séance de révision terminée ouvre un épisode
      Étant donné que la bibliothèque de test des révisions est servie
      Et que Léa a terminé 1 séance
      Et que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les tuiles 1 et 2 de l'histoire montrent « La carte froissée » et « Le premier indice »

  Règle: À la fin d'une séance qui ouvre un épisode, l'enfant l'apprend et peut le lire tout de suite

    Plan du Scénario: Après <avant>, la fin de la séance annonce l'épisode « <épisode> »
      Étant donné que Léa a terminé <avant>
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Nouvel épisode ! » avec « <épisode> »
      Et la fin de la séance propose « Lire l'épisode »

      Exemples:
        | avant       | épisode                    |
        | 0 séance    | La carte froissée          |
        | 1 séance    | Le premier indice          |
        | 18 séances  | L'Étoile du savoir         |
        | 19 séances  | Le retour des Savanturiers |

    Plan du Scénario: Après <avant>, la fin de la séance n'annonce plus d'épisode
      Étant donné que Léa a terminé <avant>
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de nouvel épisode n'apparaît à la fin de la séance
      Et la fin de la séance propose « Leçon suivante », « Accueil » et « Rejouer »

      Exemples:
        | avant      |
        | 20 séances |
        | 32 séances |

    Scénario: Le personnage guide termine sa phrase de fin par l'épisode qui l'attend
      Étant donné que Léa n'a terminé aucune séance
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Noisette dit une félicitation, suivie de « Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ? Un nouvel épisode de l'histoire t'attend ! »

    Scénario: « Lire l'épisode » ouvre l'épisode qui vient de s'ouvrir
      Étant donné que Léa n'a terminé aucune séance
      Et que la fin de la séance de la leçon « Les sons de test » vient d'annoncer « La carte froissée »
      Quand Léa choisit « Lire l'épisode »
      Alors l'écran de l'épisode s'intitule « La carte froissée », avec « Épisode 1 sur 20 »

    # Décisions 33.12 et 33.7
    Scénario: Après une séance faite seulement de fluence, la fin annonce aussi le nouvel épisode
      Étant donné que Léa n'a terminé aucune séance
      Et que Léa joue seulement l'exercice « Calcul rapide : les doubles »
      Quand le temps de la fluence est écoulé avec 12 calculs réussis
      Alors la fin de la séance annonce « Nouvel épisode ! » avec « La carte froissée »
      Et Noisette termine les paroles de fin de fluence par « Un nouvel épisode de l'histoire t'attend ! »

    # Décisions 33.12 et 33.7
    @depend-de-28
    Scénario: À la fin d'une séance de révision, la fin annonce aussi le nouvel épisode
      Étant donné que la bibliothèque de test des révisions est servie
      Et que Léa a terminé 1 séance
      Et que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Quand Léa fait la séance de révision, en répondant juste à toutes les questions
      Alors la fin de la séance de révision annonce « Nouvel épisode ! » avec « Le premier indice »

    # Décision 33.13 : ordre de « Mes médailles », cabane puis épisode
    @depend-de-32
    Scénario: Quand la séance fait aussi recevoir un objet à la cabane, la cabane est annoncée avant l'épisode
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a terminé 3 séances
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce, dans l'ordre, « Noisette a reçu un tapis tout doux ! » puis « Nouvel épisode ! » avec « Pipo le hérisson »
      Et Noisette dit une félicitation, suivie de « Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ? Noisette a reçu un tapis tout doux pour sa cabane. Un nouvel épisode de l'histoire t'attend ! »

    # Décision 33.13 : badge en dernier
    @depend-de-31 @depend-de-32
    Scénario: Quand la séance donne aussi un objet de la cabane et un badge, l'ordre est cabane, épisode, badge
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a terminé 3 séances
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa n'a fait aucune erreur pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la zone des nouveautés de la fin de la séance montre, dans l'ordre, l'objet de la cabane, le nouvel épisode, puis le badge

    # Décisions 33.9 et 33.10 (b)
    Scénario: Sans réseau au début de la séance, la fin de la séance n'annonce aucun épisode
      Étant donné que Léa a terminé 2 séances
      Et que le réseau est coupé
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de nouvel épisode n'apparaît à la fin de la séance
      Et aucun message d'erreur n'apparaît

    # Décision 33.10 (a)
    Scénario: Une séance commencée avec le réseau et finie sans réseau annonce l'épisode
      Étant donné que Léa a terminé 2 séances
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que le réseau est coupé
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Nouvel épisode ! » avec « Le pont des lettres »

    # Décision 33.19
    Scénario: Avec le profil préparé, sans profil réel au serveur, la fin de la première séance annonce le premier épisode
      Étant donné que Léa joue avec le profil préparé, sans profil réel au serveur
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Nouvel épisode ! » avec « La carte froissée »

    # Décision 33.28
    Scénario: Avec un profil de démonstration, la fin de la première séance annonce le premier épisode
      Étant donné que Léa joue avec un profil de démonstration, sans compte parent
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Nouvel épisode ! » avec « La carte froissée »

  Règle: L'écran d'un épisode le montre et le lit ; il ne mène qu'à des épisodes ouverts

    Scénario: Une tuile ouverte de l'histoire ouvre son épisode
      Étant donné que Léa a terminé 3 séances
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile « Le premier indice »
      Alors l'écran de l'épisode s'intitule « Le premier indice », avec « Épisode 2 sur 20 »

    Scénario: Une tuile « À découvrir » n'ouvre rien
      Étant donné que Léa a terminé 3 séances
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile 5 de l'histoire
      Alors le titre de l'écran est toujours « Mes médailles »

    Scénario: L'épisode est lu à voix haute dès son ouverture, chaque mot surligné
      Étant donné que Léa a terminé 1 séance
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile « La carte froissée »
      Alors Léa entend Noisette lire le texte de l'épisode, qui commence par « Un matin, Noisette trouve sous son noisetier une vieille carte froissée. »
      Et chaque mot du texte de l'épisode est surligné au moment où Noisette le prononce
      Et plus aucun mot n'est surligné quand la lecture est finie

    # Décision 33.16 : le titre, puis le texte ; la position n'est pas lue
    Scénario: La voix lit le titre de l'épisode puis son texte, sans sa position
      Étant donné que Léa a terminé 1 séance
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile « La carte froissée »
      Alors Léa entend Noisette lire « La carte froissée », puis le texte de l'épisode
      Mais Léa n'entend pas Noisette lire « Épisode 1 sur 20 »

    # Décision 33.15 : lecture à l'ouverture, avec ou sans « tout lire à voix haute »
    Scénario: Sans « tout lire à voix haute », l'épisode est quand même lu à son ouverture
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a terminé 1 séance
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile « La carte froissée »
      Alors Léa entend Noisette lire le texte de l'épisode, qui commence par « Un matin, Noisette trouve sous son noisetier une vieille carte froissée. »

    Scénario: « Réécouter » relit l'épisode depuis le début, chaque mot surligné
      Étant donné que Léa a terminé 1 séance
      Et que Léa lit l'épisode « La carte froissée » depuis « Mes médailles »
      Quand Léa demande à réécouter l'épisode
      Alors Léa entend Noisette lire de nouveau le texte de l'épisode depuis le début
      Et chaque mot du texte de l'épisode est surligné au moment où Noisette le prononce

    Scénario: En Muet, l'épisode s'affiche sans être lu
      Étant donné que la tablette est en Muet
      Et que Léa a terminé 1 séance
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile « La carte froissée »
      Alors l'écran de l'épisode s'intitule « La carte froissée », avec « Épisode 1 sur 20 »
      Mais Léa n'entend rien

    Scénario: « Épisode suivant » ouvre l'épisode d'après quand il est ouvert
      Étant donné que Léa a terminé 3 séances
      Et que Léa lit l'épisode « Le premier indice » depuis « Mes médailles »
      Quand Léa choisit « Épisode suivant »
      Alors l'écran de l'épisode s'intitule « Le pont des lettres », avec « Épisode 3 sur 20 »

    Plan du Scénario: Sur l'épisode « <épisode> », après <séances>, « Épisode suivant » n'est pas proposé
      Étant donné que Léa a terminé <séances>
      Quand Léa lit l'épisode « <épisode> » depuis « Mes médailles »
      Alors l'écran de l'épisode ne propose pas « Épisode suivant »
      Et l'écran de l'épisode propose « Réécouter » et « Fermer le livre »

      Exemples:
        | séances    | épisode                    |
        | 3 séances  | Le pont des lettres        |
        | 20 séances | Le retour des Savanturiers |

    # Décision 33.18
    Scénario: L'épisode qui vient de s'ouvrir à la fin de la séance ne propose pas « Épisode suivant »
      Étant donné que Léa a terminé 2 séances
      Et que la fin de la séance de la leçon « Les sons de test » vient d'annoncer « Le pont des lettres »
      Quand Léa choisit « Lire l'épisode »
      Alors l'écran de l'épisode s'intitule « Le pont des lettres », avec « Épisode 3 sur 20 »
      Mais l'écran de l'épisode ne propose pas « Épisode suivant »

    # Décision 33.17
    Scénario: L'écran de l'épisode ne propose pas d'épisode précédent
      Étant donné que Léa a terminé 3 séances
      Quand Léa lit l'épisode « Le pont des lettres » depuis « Mes médailles »
      Alors l'écran de l'épisode ne propose pas « Épisode précédent »

    Scénario: « Fermer le livre » ramène à « Mes médailles » quand l'épisode y a été choisi
      Étant donné que Léa a terminé 1 séance
      Et que Léa lit l'épisode « La carte froissée » depuis « Mes médailles »
      Quand Léa choisit « Fermer le livre »
      Alors le titre de l'écran est « Mes médailles »

    # Décision 33.20
    Scénario: « Fermer le livre » ramène à l'accueil quand l'épisode a été ouvert à la fin de la séance
      Étant donné que Léa n'a terminé aucune séance
      Et que la fin de la séance de la leçon « Les sons de test » vient d'annoncer « La carte froissée »
      Et que Léa a choisi « Lire l'épisode »
      Quand Léa choisit « Fermer le livre »
      Alors Léa voit son accueil

    Scénario: Fermer le livre pendant la lecture coupe la voix
      Étant donné que Léa a terminé 1 séance
      Et que Léa lit l'épisode « La carte froissée » depuis « Mes médailles »
      Et que Noisette est en train de lire le texte de l'épisode
      Quand Léa choisit « Fermer le livre »
      Alors Léa n'entend plus Noisette

    # Décisions 33.3 et 33.24
    Scénario: Le dernier épisode garde sa fin et s'adresse à tous les enfants
      Étant donné que Léa a terminé 20 séances
      Quand Léa lit l'épisode « Le retour des Savanturiers » depuis « Mes médailles »
      Alors Léa lit « Et toi, tu fais maintenant partie des Savanturiers ! » dans le texte de l'épisode
      Et le texte de l'épisode se termine par « Mais chut… une nouvelle carte vient d'arriver. »

  Règle: L'histoire est celle de Noisette dans tous les univers, racontée par le personnage guide du profil

    # Décision 33.2 (d)
    Plan du Scénario: Dans l'univers <clé>, <personnage guide> raconte l'histoire de Noisette
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa a terminé 1 séance
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile « La carte froissée »
      Alors elle voit <personnage guide> sur l'écran de l'épisode « La carte froissée »
      Et Léa entend <personnage guide> lire le texte de l'épisode, qui commence par « Un matin, Noisette trouve sous son noisetier une vieille carte froissée. »

      Exemples:
        | clé       | personnage guide |
        | pompier   | Capitaine Sam    |
        | princesse | Lumi             |

    # Décision 33.2
    Scénario: Changer d'univers ne referme aucun épisode
      Étant donné que Léa a terminé 2 séances
      Et que Léa a choisi l'univers sports
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les tuiles 1 et 2 de l'histoire montrent « La carte froissée » et « Le premier indice »

    # Décision 33.2 (d)
    Scénario: Dans l'univers Pompiers, Capitaine Sam annonce l'épisode qui attend l'enfant
      Étant donné que Léa a choisi l'univers pompier
      Et que Léa n'a terminé aucune séance
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Capitaine Sam dit une félicitation, suivie de « Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ? Un nouvel épisode de l'histoire t'attend ! »

  Règle: L'histoire se lit à voix haute, au lecteur d'écran, au clavier, en mode dys, sans mouvement et sur un petit écran

    # Décisions 33.6 et 33.22
    @depend-de-32
    Scénario: Avec « tout lire à voix haute », le titre de l'histoire puis son sous-titre sont lus après la cabane
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a gagné 3 étoiles en tout
      Et que Léa a terminé 2 séances
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette lire, dans l'ordre :
        | texte                                                                      |
        | Regarde tout ce que tu as gagné !                                          |
        | Mes médailles                                                              |
        | La cabane de Noisette                                                      |
        | Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux ! |
        | L'histoire des Savanturiers                                                |
        | Un nouvel épisode s'ouvre à chaque séance terminée.                        |
      Mais Léa n'entend pas Noisette lire « La carte froissée »

    # Décisions 33.6 et 33.22
    Scénario: Sans « tout lire à voix haute », l'enfant fait lire l'histoire à la demande
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a terminé 2 séances
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa demande à écouter l'histoire
      Alors Léa entend Noisette lire « L'histoire des Savanturiers », puis « Un nouvel épisode s'ouvre à chaque séance terminée. »

    # Décision 33.22 (a) et décision 32.9
    @depend-de-32
    Scénario: Un épisode ouvert suffit pour que le personnage guide dise « Regarde tout ce que tu as gagné ! »
      Étant donné que Léa a gagné 2 étoiles en tout
      Et que Léa a terminé 1 séance
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette dire « Regarde tout ce que tu as gagné ! »
      Mais Léa n'entend pas Noisette lire « Gagne des étoiles pour remplir la cabane ! »

    # Décision 33.14
    Scénario: Avec « tout lire à voix haute », l'annonce du nouvel épisode n'est pas lue en plus de la phrase du personnage guide
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa n'a terminé aucune séance
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors Léa n'entend pas Noisette lire « Nouvel épisode ! »

    # Décision 33.21 : libellés validés
    Scénario: Un lecteur d'écran annonce chaque tuile avec son numéro
      Étant donné que Léa a terminé 1 séance
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les lecteurs d'écran annoncent « Épisode 1 : La carte froissée »
      Et les lecteurs d'écran annoncent « Épisode 2, à découvrir »

    # Décision 33.29 : texte validé
    Scénario: Un lecteur d'écran annonce le nouvel épisode à la fin de la séance
      Étant donné que Léa n'a terminé aucune séance
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors les lecteurs d'écran annoncent « Nouvel épisode ! La carte froissée »

    Scénario: Sur un ordinateur, l'enfant ouvre un épisode au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa a terminé 1 séance
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la tuile « La carte froissée », au clavier seulement
      Alors l'écran de l'épisode s'intitule « La carte froissée », avec « Épisode 1 sur 20 »

    # Décision 33.30
    Scénario: À la fin de la séance, « Lire l'épisode » s'atteint au clavier sans prendre le focus
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa n'a terminé aucune séance
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors le focus est sur « Accueil »
      Et Léa atteint « Lire l'épisode » au clavier seulement

    Scénario: L'écran du dernier épisode tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a terminé 20 séances
      Quand Léa lit l'épisode « Le retour des Savanturiers » depuis « Mes médailles »
      Alors la page tient dans la largeur de l'écran
      Et « Réécouter » et « Fermer le livre » mesurent au moins 44 px de haut

    Scénario: Les 20 tuiles de l'histoire tiennent dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a terminé 20 séances
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la page tient dans la largeur de l'écran
      Et chaque tuile de l'histoire mesure au moins 44 px de haut

    Scénario: Avec le mode dys, l'épisode s'affiche en mode dys, et le mot lu reste surligné
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a terminé 1 séance
      Quand Léa lit l'épisode « La carte froissée » depuis « Mes médailles »
      Alors Léa voit le titre et le texte de l'épisode en mode dys : police Andika, lettres, mots et lignes espacés
      Et chaque mot du texte de l'épisode est surligné au moment où Noisette le prononce

    # Décision 33.26
    Scénario: Avec les mouvements réduits, l'annonce du nouvel épisode apparaît sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa n'a terminé aucune séance
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors l'annonce du nouvel épisode apparaît sans mouvement

    # Décision 33.10 (c)
    Scénario: Sans réseau, la section de l'histoire n'apparaît pas, sans message d'erreur
      Étant donné que Léa a terminé 2 séances
      Et que le réseau est coupé
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « L'histoire des Savanturiers » n'apparaît
      Et aucun message d'erreur n'apparaît

  Règle: L'histoire ne compte que les séances du profil enfant qui joue

    @acces
    Scénario: Les séances d'un autre enfant du même parent n'ouvrent aucun épisode pour Léa
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a terminé 5 séances
      Et que Léa n'a terminé aucune séance
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les 20 tuiles de l'histoire montrent « À découvrir »

    @acces
    Scénario: Quand deux enfants du même parent ont joué, chacun retrouve ses propres épisodes
      Étant donné que Léa a terminé 1 séance
      Et que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a terminé 5 séances
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la tuile 1 de l'histoire montre « La carte froissée »
      Et les tuiles 2 à 20 de l'histoire montrent « À découvrir »

    @acces
    Scénario: Le second parent rattaché retrouve les épisodes de Léa sur son téléphone
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a terminé 2 séances
      Quand Léa ouvre « Mes médailles » sur le téléphone de Marie
      Alors les tuiles 1 et 2 de l'histoire montrent « La carte froissée » et « Le premier indice »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les séances terminées de Léa
      Étant donné que Léa a terminé 2 séances
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les séances terminées du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
