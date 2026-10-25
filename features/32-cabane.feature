# language: fr
@issue-32 @wip
Fonctionnalité: La cabane reçoit des objets à chaque palier du total des étoiles
  En tant qu'enfant
  Je veux remplir une cabane d'objets grâce à mes étoiles
  Afin de voir mes efforts prendre forme

  La cabane ne fait que compter : le total des étoiles est la somme des meilleures étoiles de toutes les leçons
  du profil en cours. Elle ne modifie aucune étoile et n'enregistre rien (modèle : docs/stories/32/domain-model.md).
  Les commentaires « Question 32.n » renvoient aux questions ouvertes de docs/stories/32/acceptance.md ;
  les scénarios qui en dépendent portent @a-valider et suivent la recommandation de l'équipe.

  Paliers et objets (legacy) : 3 une lanterne, 6 un tapis tout doux, 10 un pot de fleurs, 15 une étagère de livres,
  20 un tableau, 26 un gros coussin, 33 une guirlande, 40 un télescope, 48 un globe, 56 une boîte à trésor,
  65 un trophée (nom à remplacer, question 32.5), 75 l'étoile magique.

  « Léa a gagné N étoiles en tout » prépare des meilleures étoiles sur des leçons de test absentes de la
  bibliothèque (identifiants préfixés « e2e-32- »), sans jouer de séance ; elles partent avec le profil enfant.
  Comme toute étape qui écrit en base (« Léa a pour meilleures étoiles : », « Léa a gagné N étoiles à la leçon … »),
  elle suppose que Léa joue avec un profil réel, créé pour Paul (features/steps/profil-reel.ts, décision 0021,
  point 5). Seul le scénario « Avec le profil préparé, sans profil réel au serveur… » garde le profil préparé
  du Contexte, sans profil réel : ses étoiles ne sont que celles gagnées sur l'appareil.
  « Les sons de test » est la leçon de test de #24 (10 questions : 0 erreur donne 3 étoiles, 5 erreurs 1 étoile).
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre enfant de Paul ;
  Claire n'est rattachée à aucun des deux.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque

  Règle: Le total des étoiles est la somme des meilleures étoiles de toutes les leçons du profil ; le test de départ n'y ajoute rien

    # Question 32.4
    @a-valider
    Scénario: Les étoiles des leçons d'une autre classe comptent dans le total
      Étant donné que Léa a pour meilleures étoiles :
        | leçon                     | étoiles |
        | Les sons ou, on, an       | 2       |
        | Les tables de 3 et de 4   | 3       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 5 étoiles. Encore 1 étoile et Noisette recevra un tapis tout doux ! »

    Scénario: Les leçons réussies au test de départ n'ajoutent aucune étoile à la cabane
      Étant donné que Léa a pour leçons réussies au test de départ :
        | leçon               |
        | Les syllabes        |
        | Utiliser le bon mot |
      Et que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les sons ou, on, an | 2       |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne ! »

    Scénario: Rejouer une leçon avec moins d'étoiles ne retire aucun objet
      Étant donné que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les sons de test    | 3       |
        | Les sons ou, on, an | 3       |
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 1 étoile
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 6 étoiles. Encore 4 étoiles et Noisette recevra un pot de fleurs ! »
      Et les lecteurs d'écran annoncent « La cabane de Noisette, avec 2 objets »

    # Question 32.15
    @a-valider
    Scénario: Les étoiles d'une leçon qui n'est plus dans la bibliothèque comptent toujours
      Étant donné que Léa a 3 étoiles à une leçon « Les anciens sons » qui n'est plus dans la bibliothèque
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux ! »

    # Question 32.19
    @a-valider
    Scénario: Juste après une séance, ses étoiles sont déjà dans le total de la cabane
      Étant donné que Léa a gagné 2 étoiles en tout
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 1 étoile
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux ! »

  Règle: La cabane a un objet par palier atteint par le total des étoiles ; elle est complète à 75 étoiles

    # Question 32.8 : la section est toujours là, même à 0 étoile
    @a-valider
    Plan du Scénario: Avec <total> en tout, la cabane a <objets>
      Étant donné que Léa a gagné <total> en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « <phrase> »
      Et les lecteurs d'écran annoncent « La cabane de Noisette, avec <objets> »

      Exemples:
        | total      | objets    | phrase                                                                     |
        | 0 étoile   | 0 objet   | Tu as 0 étoile. Encore 3 étoiles et Noisette recevra une lanterne !        |
        | 2 étoiles  | 0 objet   | Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne !        |
        | 3 étoiles  | 1 objet   | Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux ! |
        | 9 étoiles  | 2 objets  | Tu as 9 étoiles. Encore 1 étoile et Noisette recevra un pot de fleurs !    |
        | 75 étoiles | 12 objets | Tu as 75 étoiles. La cabane est complète, quelle merveille !               |

    # Question 32.11 : la pastille non atteinte s'affiche « 10 ★ »
    Scénario: Une pastille montre le nom de l'objet reçu, ou le palier qui reste à atteindre
      Étant donné que Léa a gagné 6 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les pastilles de la cabane montrent, dans l'ordre :
        | pastille           |
        | une lanterne       |
        | un tapis tout doux |
        | 10 ★               |
        | 15 ★               |
        | 20 ★               |
        | 26 ★               |
        | 33 ★               |
        | 40 ★               |
        | 48 ★               |
        | 56 ★               |
        | 65 ★               |
        | 75 ★               |

    # Question 32.5 : « une coupe dorée » est un exemple de nouveau nom pour « un trophée », à valider ; question 32.3 : pas de palier après 75
    @a-valider
    Scénario: Au-delà de 75 étoiles, la cabane reste complète avec ses 12 objets
      Étant donné que Léa a gagné 100 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 100 étoiles. La cabane est complète, quelle merveille ! »
      Et les pastilles de la cabane montrent, dans l'ordre :
        | pastille               |
        | une lanterne           |
        | un tapis tout doux     |
        | un pot de fleurs       |
        | une étagère de livres  |
        | un tableau             |
        | un gros coussin        |
        | une guirlande          |
        | un télescope           |
        | un globe               |
        | une boîte à trésor     |
        | une coupe dorée        |
        | l'étoile magique       |

    # Question 32.16
    @a-valider
    Scénario: Une pastille de la cabane n'ouvre rien
      Étant donné que Léa a gagné 3 étoiles en tout
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la pastille « une lanterne »
      Alors le titre de l'écran est toujours « Mes médailles »

    # Question 32.13
    @a-valider
    Scénario: Sans réseau, la section de la cabane n'apparaît pas, sans message d'erreur
      Étant donné que Léa a gagné 3 étoiles en tout
      Et que le réseau est coupé
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « La cabane de Noisette » n'apparaît
      Et aucun message d'erreur n'apparaît

    # Questions 32.14 et 32.22
    @a-valider
    Scénario: Avec le profil préparé, sans profil réel au serveur, la cabane compte les étoiles gagnées sur l'appareil
      Étant donné que Léa joue avec le profil préparé, sans profil réel au serveur
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 3 étoiles
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux ! »

  Règle: À la fin d'une séance qui fait atteindre un palier, l'enfant apprend quel objet la cabane a reçu

    Scénario: Passer de 5 à 6 étoiles fait recevoir le tapis tout doux
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce pour la cabane « Noisette a reçu un tapis tout doux ! »

    # Question 32.12
    @a-valider
    Scénario: Le personnage guide termine sa phrase de fin par l'objet reçu
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Noisette dit une félicitation, suivie de « Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ? Noisette a reçu un tapis tout doux pour sa cabane. »

    Scénario: Rejouer mieux une leçon n'ajoute au total que les étoiles en plus
      Étant donné que Léa a pour meilleures étoiles :
        | leçon            | étoiles |
        | Les sons de test | 2       |
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa n'a fait aucune erreur pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce pour la cabane « Noisette a reçu une lanterne ! »

    Plan du Scénario: Sans palier atteint, la fin de la séance n'annonce rien pour la cabane (<cas>)
      Étant donné que Léa a pour meilleures étoiles :
        | leçon               | étoiles   |
        | Les sons de test    | <avant>   |
        | Les sons ou, on, an | 3         |
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce pour la cabane n'apparaît à la fin de la séance

      Exemples:
        | cas                                 | avant |
        | leçon rejouée avec moins d'étoiles  | 3     |
        | leçon rejouée avec autant d'étoiles | 1     |

    # Question 32.13
    @a-valider
    Scénario: Sans réseau au début de la séance, la fin de la séance n'annonce aucun objet
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que le réseau est coupé
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce pour la cabane n'apparaît à la fin de la séance

  Règle: La cabane est toujours celle de Noisette, quel que soit l'univers du profil

    # Questions 32.1 et 32.2
    @a-valider
    Plan du Scénario: Dans l'univers <clé>, l'enfant retrouve la cabane de Noisette et ses objets
      Étant donné que Léa a gagné 3 étoiles en tout
      Et que Léa a choisi l'univers <clé>
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « La cabane de Noisette »
      Et les lecteurs d'écran annoncent « La cabane de Noisette, avec 1 objet »

      Exemples:
        | clé       |
        | sports    |
        | princesse |

    # Question 32.1
    @a-valider
    Scénario: Dans l'univers Sports, Coach Léo annonce que Noisette a reçu un objet
      Étant donné que Léa a choisi l'univers sports
      Et que Léa a gagné 5 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Coach Léo dit une félicitation, suivie de « Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ? Noisette a reçu un tapis tout doux pour sa cabane. »

  Règle: La cabane se lit à voix haute, au lecteur d'écran, en mode dys, sans mouvement et sur un petit écran

    # Questions 32.9 et 32.10 ; question 32.21 : effet sur les scénarios de #65
    @a-valider
    Scénario: Avec « tout lire à voix haute », le titre de la cabane puis sa phrase sont lus à l'ouverture
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a gagné 3 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette lire, dans l'ordre :
        | texte                                                                      |
        | Regarde tout ce que tu as gagné !                                          |
        | Mes médailles                                                              |
        | La cabane de Noisette                                                      |
        | Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux ! |

    # Question 32.10
    @a-valider
    Scénario: Sans « tout lire à voix haute », l'enfant fait lire la cabane à la demande
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a gagné 2 étoiles en tout
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa demande à écouter la cabane
      Alors Léa entend Noisette lire « La cabane de Noisette », puis « Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne ! »

    # Question 32.9 : « Gagne des étoiles pour remplir la cabane ! » est un exemple de texte, à valider
    @a-valider
    Scénario: Sans objet ni record, le personnage guide invite l'enfant à gagner des étoiles
      Étant donné que Léa a gagné 2 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette dire « Gagne des étoiles pour remplir la cabane ! »

    # Question 32.11
    @a-valider
    Scénario: Un lecteur d'écran dit une pastille non atteinte en étoiles
      Étant donné que Léa a gagné 3 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les lecteurs d'écran annoncent « 10 étoiles »

    Scénario: La cabane complète tient dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a gagné 75 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la page tient dans la largeur de l'écran
      Et le bouton d'accès à l'écran, « Retour » et chaque bouton « Écouter » mesurent au moins 44 px de haut

    Scénario: Avec le mode dys, la section de la cabane s'affiche en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a gagné 3 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa voit la phrase et les pastilles de la cabane en mode dys : police Andika, lettres, mots et lignes espacés

    # Question 32.17
    @a-valider
    Scénario: Avec les mouvements réduits, l'annonce de l'objet reçu apparaît sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a gagné 5 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors l'annonce pour la cabane apparaît sans mouvement

  Règle: La cabane ne compte que les étoiles du profil enfant qui joue

    @acces
    Scénario: Les étoiles d'un autre enfant du même parent ne comptent pas dans la cabane
      Étant donné que Tom a un profil enfant préparé de niveau CP
      Et que Tom a gagné 30 étoiles en tout
      Et que Léa a gagné 2 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne ! »

    @acces
    Scénario: Le second parent rattaché retrouve la cabane de Léa sur son téléphone
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a gagné 3 étoiles en tout
      Quand Léa ouvre « Mes médailles » sur le téléphone de Marie
      Alors Léa lit « Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux ! »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les étoiles de Léa
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les étoiles du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
