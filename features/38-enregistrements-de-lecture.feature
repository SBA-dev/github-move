# language: fr
@issue-38 @wip
Fonctionnalité: Enregistrements de lecture
  En tant qu'enfant, je veux m'enregistrer quand je lis, récite ou chante à voix haute, puis me réécouter ;
  en tant que parent, je veux écouter puis supprimer ces enregistrements de lecture,
  Afin de suivre les progrès de lecture à voix haute

  Leçons de la bibliothèque utilisées : « Lecture : Le petit chat Plume » (fr-cp-lecture-petit-chat, exercice
  lecture « Le petit chat Plume »), « Poésie : La Cigale et la Fourmi » (fr-cp-poesie-cigale, exercice memoriser
  « Le début de la fable », 6 vers : une poésie), « Chanson : Au clair de la lune » (fr-cp-chanson-clair-de-lune,
  8 vers, auteur « Chanson traditionnelle » : une chanson) et « Les sons ou, on, an » (fr-cp-sons-ou-on-an,
  exercice bulles « Quel son entends-tu ? »).
  Les âges des enregistrements (« il y a 2 jours ») se comptent depuis le moment où le scénario tourne ; les dates
  affichées en découlent (voir docs/stories/38/acceptance.md).
  Les scénarios tagués @depend-de-34 passent par le suivi de l'espace parent (#34).

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Seuls les exercices lecture et memoriser proposent de s'enregistrer, avec un libellé selon ce que l'enfant fait, et seulement si l'appareil sait enregistrer

    Scénario: Dans une lecture, après le texte lu, l'enfant peut s'enregistrer avant de dire qu'il a écouté
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Alors Léa peut s'enregistrer avec « Je la lis à voix haute et je m'enregistre »
      Et Léa peut dire qu'elle a écouté

    Plan du Scénario: Pour une <sorte>, après le dernier vers, l'enfant peut s'enregistrer avec « <libellé> »
      Étant donné que Léa joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand Noisette a lu le dernier vers
      Alors Léa peut s'enregistrer avec « <libellé> »
      Et Léa peut dire qu'elle est prête

      Exemples:
        | sorte   | leçon                           | exercice             | libellé                      |
        | poésie  | Poésie : La Cigale et la Fourmi | Le début de la fable | Je récite et je m'enregistre |
        | chanson | Chanson : Au clair de la lune   | Au clair de la lune  | Je chante et je m'enregistre |

    # Question 38.17 (et 38.21 pour le scénario livré de #22)
    @a-valider
    Plan du Scénario: Pour une <sorte>, le personnage guide invite à <verbe> tout le texte et à s'enregistrer
      Étant donné que Léa joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand Noisette a lu le dernier vers
      Alors Noisette dit « À toi ! <Verbe> tout le texte, tranquillement. Tu peux t'enregistrer pour te réécouter. Quand c'est bon, on joue ! »

      Exemples:
        | sorte   | leçon                           | exercice             | verbe   | Verbe  |
        | poésie  | Poésie : La Cigale et la Fourmi | Le début de la fable | redire  | Redis  |
        | chanson | Chanson : Au clair de la lune   | Au clair de la lune  | chanter | Chante |

    # Question 38.17
    @a-valider
    Scénario: Sur un appareil qui ne sait pas enregistrer, la poésie n'invite pas à s'enregistrer
      Étant donné que l'appareil ne sait pas enregistrer
      Et que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Quand Noisette a lu le dernier vers
      Alors Noisette dit « À toi ! Redis tout le texte, tranquillement. Quand c'est bon, on joue ! »
      Et Léa ne peut pas s'enregistrer
      Mais Léa peut dire qu'elle est prête

    # Question 38.17
    @a-valider
    Scénario: Sur un appareil qui ne sait pas enregistrer, la lecture ne propose pas de s'enregistrer
      Étant donné que l'appareil ne sait pas enregistrer
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Alors Léa ne peut pas s'enregistrer
      Mais Léa peut dire qu'elle a écouté

    Scénario: Un exercice qui n'est ni une lecture ni une poésie ne propose pas de s'enregistrer
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors Léa ne peut pas s'enregistrer

  Règle: L'enfant s'enregistre, s'arrête et se réécoute ; l'enregistrement de lecture n'est pas noté et ne bloque jamais l'exercice

    # Question 38.1
    @a-valider
    Scénario: Pendant qu'il s'enregistre, l'enfant voit qu'il est en train de s'enregistrer et peut arrêter
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa commence à s'enregistrer
      Alors Léa voit qu'elle est en train de s'enregistrer
      Et Léa peut arrêter son enregistrement avec « Arrêter »

    Scénario: Après l'arrêt, l'enfant peut se réécouter et continuer l'exercice
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Et que Léa est en train de s'enregistrer
      Quand Léa arrête son enregistrement
      Alors Léa peut réécouter son enregistrement
      Et Léa peut dire qu'elle a écouté

    # Question 38.3
    @a-valider
    Scénario: L'enregistrement s'arrête tout seul au bout de 3 minutes
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Et que Léa s'enregistre depuis 2 minutes et 59 secondes
      Quand 3 minutes sont passées depuis le début de son enregistrement
      Alors Léa n'est plus en train de s'enregistrer
      Et Léa peut réécouter son enregistrement

    # Question 38.18
    @a-valider
    Scénario: Dire qu'il a écouté pendant l'enregistrement l'arrête et le garde
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Et que Léa est en train de s'enregistrer
      Quand Léa dit qu'elle a écouté
      Alors la question « De quelle couleur est Plume ? » s'affiche avec les choix « gris », « noir » et « blanc »
      Et Paul retrouve 1 enregistrement de lecture de Léa, de la leçon « Lecture : Le petit chat Plume »

    Scénario: S'enregistrer ne compte pas dans l'avancement de la séance
      Étant donné que Noisette a lu tous les vers de « Le début de la fable »
      Quand Léa s'enregistre
      Alors l'avancement de la séance montre 0 question réussie sur 12
      Et Léa peut dire qu'elle est prête

    # Question 38.17
    @a-valider
    Scénario: Si le micro est refusé, l'enfant est prévenu sans reproche et continue l'exercice
      Étant donné que le micro de l'appareil est refusé
      Et que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa choisit « Je la lis à voix haute et je m'enregistre »
      Alors Léa voit le message « Le micro n'est pas disponible. Tu peux lire à voix haute sans t'enregistrer. »
      Et Léa peut dire qu'elle a écouté

  Règle: L'enregistrement de lecture est gardé par le serveur pour les parents ; sinon l'enfant se réécoute quand même et en est prévenu

    # Question 38.10
    @a-valider
    Scénario: Un enregistrement de lecture gardé est annoncé à l'enfant et se retrouve chez le parent
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa s'enregistre
      Alors Léa voit le message « Bravo ! Ton enregistrement est gardé : tes parents pourront l'écouter. »
      Et Paul retrouve 1 enregistrement de lecture de Léa, de la leçon « Lecture : Le petit chat Plume »

    # Questions 38.7 et 38.10
    @a-valider
    Scénario: Sans réseau, l'enfant se réécoute et apprend que l'enregistrement n'a pas pu être gardé
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Et que le réseau est coupé
      Quand Léa s'enregistre
      Alors Léa voit le message « Écoute-toi ! (L'enregistrement n'a pas pu être gardé.) »
      Et Léa peut réécouter son enregistrement
      Et Léa peut dire qu'elle a écouté

    # Question 38.7
    @a-valider
    Scénario: Au retour du réseau, un enregistrement de lecture fait sans réseau n'est pas envoyé
      Étant donné que Léa s'est enregistrée sans réseau pendant l'exercice « Le petit chat Plume »
      Quand le réseau revient
      Alors Paul ne retrouve aucun enregistrement de lecture de Léa

    # Question 38.9
    @a-valider
    Scénario: Deux enregistrements dans le même exercice sont gardés tous les deux
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Et que Léa s'est déjà enregistrée une fois
      Quand Léa s'enregistre de nouveau
      Alors Paul retrouve 2 enregistrements de lecture de Léa, de la leçon « Lecture : Le petit chat Plume »

    Plan du Scénario: Le serveur refuse de garder un enregistrement de lecture <cas>
      Quand l'appareil envoie pour Léa un enregistrement de lecture <cas>
      Alors l'enregistrement de lecture est refusé
      Et Paul ne retrouve aucun enregistrement de lecture de Léa

      Exemples:
        | cas                                                                        |
        | de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » |
        | vide, de l'exercice « Le petit chat Plume »                                |

      # Questions 38.3, 38.11 et 38.19
      @a-valider
      Exemples:
        | cas                                                                        |
        | de 6 Mo, de l'exercice « Le petit chat Plume »                             |
        | au format d'une image, de l'exercice « Le petit chat Plume »               |
        | d'une leçon qui n'est pas dans la bibliothèque                             |

  Règle: Le parent écoute dans le suivi les enregistrements de lecture de l'enfant, avec leur date d'expiration

    # Questions 38.8 et 38.16
    @depend-de-34 @a-valider
    Scénario: Le suivi montre les enregistrements de lecture, du plus récent au plus ancien, avec leur date d'expiration
      Étant donné que Léa a ces enregistrements de lecture :
        | leçon                           | enregistré      |
        | Lecture : Le petit chat Plume   | il y a 5 jours  |
        | Poésie : La Cigale et la Fourmi | il y a 1 jour   |
      Quand Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Alors le suivi de Léa montre « Lectures et récitations enregistrées (2) »
      Et les enregistrements de lecture de Léa sont, dans l'ordre :
        | leçon                           | enregistré      | gardé jusqu'au |
        | Poésie : La Cigale et la Fourmi | il y a 1 jour   | dans 29 jours  |
        | Lecture : Le petit chat Plume   | il y a 5 jours  | dans 25 jours  |

    # Question 38.8
    @depend-de-34 @a-valider
    Scénario: Le suivi dit que les enregistrements de lecture sont effacés au bout de 30 jours
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Quand Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Alors Paul lit « Les enregistrements sont effacés au bout de 30 jours. »

    # Question 38.6
    @depend-de-34 @a-valider
    Scénario: Tous les enregistrements de lecture non expirés sont montrés, même au-delà de 30
      Étant donné que Léa a 35 enregistrements de lecture de « Lecture : Le petit chat Plume », faits ces 20 derniers jours
      Quand Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Alors le suivi de Léa montre « Lectures et récitations enregistrées (35) »
      Et 35 enregistrements de lecture de Léa sont listés

    # Question 38.16
    @depend-de-34 @a-valider
    Scénario: Un enregistrement de lecture d'une leçon qui n'est plus dans la bibliothèque s'appelle « Enregistrement »
      Étant donné que Léa a un enregistrement de lecture d'une leçon qui n'est plus dans la bibliothèque, fait il y a 2 jours
      Quand Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Alors les enregistrements de lecture de Léa sont, dans l'ordre :
        | leçon          | enregistré     | gardé jusqu'au |
        | Enregistrement | il y a 2 jours | dans 28 jours  |

    # Question 38.23
    @depend-de-34 @a-valider
    Scénario: Sans enregistrement de lecture, le suivi ne montre pas leur bloc
      Étant donné que Léa n'a aucun enregistrement de lecture
      Quand Paul consulte le suivi
      Alors le suivi de Léa ne montre pas de bloc « Lectures et récitations enregistrées »

    # Question 38.24
    @depend-de-34 @a-valider
    Scénario: Le parent écoute un enregistrement de lecture
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Quand Paul écoute l'enregistrement de lecture de « Lecture : Le petit chat Plume »
      Alors l'enregistrement de lecture de « Lecture : Le petit chat Plume » se joue

  Règle: Le parent supprime un enregistrement de lecture en deux temps ; supprimé, il ne s'écoute plus

    @depend-de-34
    Scénario: « Supprimer » demande une confirmation avant de supprimer
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Quand Paul choisit « Supprimer » pour l'enregistrement de lecture de « Lecture : Le petit chat Plume »
      Alors Paul peut choisir « Confirmer » pour l'enregistrement de lecture de « Lecture : Le petit chat Plume »
      Et le suivi de Léa montre « Lectures et récitations enregistrées (1) »

    @depend-de-34
    Scénario: Après confirmation, l'enregistrement de lecture disparaît du suivi et ne s'écoute plus
      Étant donné que Léa a ces enregistrements de lecture :
        | leçon                           | enregistré     |
        | Lecture : Le petit chat Plume   | il y a 5 jours |
        | Poésie : La Cigale et la Fourmi | il y a 1 jour  |
      Et que Paul a choisi « Supprimer » pour l'enregistrement de lecture de « Lecture : Le petit chat Plume »
      Quand Paul confirme la suppression
      Alors le suivi de Léa montre « Lectures et récitations enregistrées (1) »
      Et Paul ne peut plus écouter l'enregistrement de lecture supprimé, même par le chemin de son fichier

    # Question 38.23
    @depend-de-34 @a-valider
    Scénario: Supprimer le dernier enregistrement de lecture retire leur bloc du suivi
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Paul a choisi « Supprimer » pour l'enregistrement de lecture de « Lecture : Le petit chat Plume »
      Quand Paul confirme la suppression
      Alors le suivi de Léa ne montre pas de bloc « Lectures et récitations enregistrées »

    # Question 38.15
    @depend-de-34 @a-valider
    Scénario: Si la suppression échoue, l'enregistrement de lecture reste et le parent peut réessayer
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Paul a choisi « Supprimer » pour l'enregistrement de lecture de « Lecture : Le petit chat Plume »
      Et que le réseau est coupé
      Quand Paul confirme la suppression
      Alors Paul voit le message « L'enregistrement n'a pas pu être supprimé. Réessaie. »
      Et le suivi de Léa montre « Lectures et récitations enregistrées (1) »

  Règle: Un enregistrement de lecture expire 30 jours après avoir été fait : il n'est plus ni listé ni écoutable, puis il est effacé avec son fichier

    Plan du Scénario: Un enregistrement de lecture fait il y a <âge> <résultat>
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a <âge>
      Quand Paul demande à écouter l'enregistrement de lecture de Léa
      Alors <attendu>

      Exemples:
        | âge                   | résultat         | attendu                                            |
        | 29 jours et 23 heures | s'écoute encore  | l'enregistrement de lecture de Léa se joue         |
        | 30 jours              | ne s'écoute plus | l'enregistrement de lecture de Léa est introuvable |
        | 31 jours              | ne s'écoute plus | l'enregistrement de lecture de Léa est introuvable |

    @depend-de-34
    Scénario: Un enregistrement de lecture expiré n'est plus listé dans le suivi, même avant d'être effacé
      Étant donné que Léa a ces enregistrements de lecture :
        | leçon                           | enregistré      |
        | Lecture : Le petit chat Plume   | il y a 31 jours |
        | Poésie : La Cigale et la Fourmi | il y a 2 jours  |
      Et que l'effacement des enregistrements expirés n'est pas encore passé
      Quand Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Alors le suivi de Léa montre « Lectures et récitations enregistrées (1) »
      Et les enregistrements de lecture de Léa sont, dans l'ordre :
        | leçon                           | enregistré     | gardé jusqu'au |
        | Poésie : La Cigale et la Fourmi | il y a 2 jours | dans 28 jours  |

    Scénario: L'effacement des enregistrements expirés efface l'enregistrement de lecture et son fichier, et garde les autres
      Étant donné que Léa a ces enregistrements de lecture :
        | leçon                           | enregistré      |
        | Lecture : Le petit chat Plume   | il y a 31 jours |
        | Poésie : La Cigale et la Fourmi | il y a 2 jours  |
      Quand l'effacement des enregistrements expirés passe
      Alors l'enregistrement de lecture de Léa fait il y a 31 jours n'existe plus, ni son fichier
      Et l'enregistrement de lecture de Léa fait il y a 2 jours existe toujours, avec son fichier

    # Question 38.14
    @a-valider
    Plan du Scénario: Un fichier d'enregistrement sans enregistrement de lecture, rangé il y a <âge>, <résultat>
      Étant donné qu'un fichier d'enregistrement de Léa, sans enregistrement de lecture, a été rangé il y a <âge>
      Quand l'effacement des enregistrements expirés passe
      Alors ce fichier <attendu>

      Exemples:
        | âge        | résultat   | attendu         |
        | 2 heures   | est effacé | n'existe plus   |
        | 10 minutes | est gardé  | existe toujours |

    @acces
    Scénario: Un parent ne peut pas lancer l'effacement des enregistrements expirés
      Étant donné que Claire est connectée sur le téléphone
      Quand Claire demande l'effacement des enregistrements expirés
      Alors l'effacement des enregistrements expirés est refusé

  Règle: Seul un parent rattaché garde, liste, écoute ou supprime les enregistrements de lecture d'un enfant ; l'enfant ne réécoute que celui qu'il vient de faire

    @acces
    Scénario: Un parent qui n'est pas rattaché ne liste pas les enregistrements de lecture de Léa
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les enregistrements de lecture du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

    @acces
    Plan du Scénario: Un parent qui n'est pas rattaché n'écoute pas un enregistrement de lecture de Léa, même avec <moyen>
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Claire est connectée sur le téléphone
      Quand Claire demande à écouter l'enregistrement de lecture de Léa avec <moyen>
      Alors Claire ne reçoit aucune donnée de Léa

      Exemples:
        | moyen                    |
        | son identifiant          |
        | le chemin de son fichier |

    @acces
    Scénario: Un parent qui n'est pas rattaché ne supprime pas un enregistrement de lecture de Léa
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Claire est connectée sur le téléphone
      Quand Claire supprime l'enregistrement de lecture de Léa avec son identifiant
      Alors la suppression est refusée comme pour un enregistrement de lecture introuvable
      Et Paul retrouve 1 enregistrement de lecture de Léa, de la leçon « Lecture : Le petit chat Plume »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne garde pas d'enregistrement de lecture pour Léa
      Étant donné que Claire est connectée sur le téléphone
      Quand Claire envoie un enregistrement de lecture de l'exercice « Le petit chat Plume » pour le profil enfant de Léa
      Alors l'enregistrement de lecture est refusé comme pour un profil introuvable
      Et Paul ne retrouve aucun enregistrement de lecture de Léa

    @acces @depend-de-34
    Scénario: Le suivi de Léa ne montre jamais les enregistrements de lecture d'un autre enfant
      Étant donné que Tom a un profil enfant préparé de niveau CP
      Et que Tom a un enregistrement de lecture de « Poésie : La Cigale et la Fourmi » fait il y a 1 jour
      Et que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Quand Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Alors les enregistrements de lecture de Léa sont, dans l'ordre :
        | leçon                         | enregistré     | gardé jusqu'au |
        | Lecture : Le petit chat Plume | il y a 2 jours | dans 28 jours  |

    # Question 38.9
    @acces @a-valider
    Scénario: L'enfant ne réécoute pas un enregistrement de lecture déjà gardé en rejouant l'exercice
      Étant donné que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Alors Léa n'a aucun enregistrement à réécouter

    @acces
    Scénario: Un autre enfant de la même tablette ne réécoute pas l'enregistrement de lecture de Léa
      Étant donné que Tom a un profil enfant préparé de niveau CP
      Et que Léa s'est enregistrée pendant l'exercice « Le petit chat Plume » sur la tablette
      Quand Tom joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Alors Tom n'a aucun enregistrement à réécouter

  Règle: S'enregistrer et écouter se font au doigt, au clavier, avec un lecteur d'écran et sur un petit écran

    Scénario: Le bouton d'enregistrement tient dans un écran de 360 px et se touche du doigt
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Alors la page tient dans la largeur de l'écran
      Et chaque commande de la séance mesure au moins 44 px de haut et de large

    Scénario: Pendant l'enregistrement, « Arrêter » tient dans un écran de 360 px et se touche du doigt
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa commence à s'enregistrer
      Alors la page tient dans la largeur de l'écran
      Et chaque commande de la séance mesure au moins 44 px de haut et de large

    # Question 38.25
    @a-valider
    Scénario: Un lecteur d'écran annonce que l'enregistrement est en cours
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa commence à s'enregistrer
      Alors les lecteurs d'écran annoncent « Enregistrement en cours »

    # Question 38.25
    @a-valider
    Scénario: Un lecteur d'écran annonce la fin de l'enregistrement
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Et que Léa est en train de s'enregistrer
      Quand Léa arrête son enregistrement
      Alors les lecteurs d'écran annoncent « Enregistrement terminé »

    Scénario: Au clavier, l'enfant s'enregistre et s'arrête sans souris
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa s'enregistre, au clavier seulement
      Alors Léa peut réécouter son enregistrement

    # Question 38.25
    @a-valider
    Scénario: Avec les mouvements réduits, l'enregistrement en cours est signalé sans animation
      Étant donné que l'appareil demande des mouvements réduits
      Et que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa commence à s'enregistrer
      Alors Léa voit qu'elle est en train de s'enregistrer, sans animation

    @depend-de-34
    Scénario: Les enregistrements de lecture du suivi tiennent dans un écran de 360 px et se touchent du doigt
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un enregistrement de lecture de « Lecture : Le petit chat Plume » fait il y a 2 jours
      Quand Paul consulte le suivi, lectures et récitations enregistrées de Léa dépliées
      Alors la page tient dans la largeur de l'écran
      Et « Écouter » et « Supprimer » mesurent au moins 44 px de haut et de large
