# language: fr
@issue-102 @wip
Fonctionnalité: Le personnage guide reçoit des tenues avec les étoiles, et l'enfant choisit celle qu'il porte
  En tant qu'enfant
  Je veux que mon personnage guide reçoive de nouvelles tenues quand je gagne des étoiles, et choisir celle qu'il porte
  Afin de voir mes efforts sur mon compagnon de jeu

  Contexte Motivation : les tenues reçues se déduisent du total des étoiles (#32), comme les objets de la cabane,
  sans modifier aucune étoile. La cabane ne change pas. Seule la tenue portée, choisie par l'enfant, est gardée
  (sur l'appareil, hypothèse #102.8 A). Modèle : docs/stories/102/domain-model.md ; critères et questions :
  docs/stories/102/acceptance.md. Les commentaires « #102.n » renvoient aux questions ouvertes ; un scénario qui
  porte le tag « a-valider » dépend d'une réponse du PO qui n'est pas encore donnée.

  Tranche minimale (#102.17). Les danses du personnage guide sont hors de cette story (#102.7, story #106).

  Valeurs provisoires, à fixer par le PO (#102.1, #102.5, #102.15, #102.18, #102.27) : elles se retrouvent dans
  tous les scénarios ; quand le PO les fixe, on remplace les valeurs, la forme des scénarios ne change pas.
  - Paliers des tenues et tenues, communes à tous les univers (#102.2 A) : 5 une écharpe rayée, 12 un nœud papillon,
    23 un sac à dos d'explorateur, 37 des bottes de pluie.
  - Textes : encart « Pour <personnage guide> » de la fin de la séance, annonce « <personnage guide> a reçu <tenue> ! »,
    section « Les tenues de <personnage guide> » de « Mes médailles », phrase « Encore N étoiles et <personnage guide>
    recevra <tenue> ! », libellé accessible « <personnage guide>, avec <tenue> ».

  Paliers de la cabane (inchangés, #32) : 3, 6, 10, 15, 20, 26, 33, 40, 48, 56, 65, 75.
  « Léa a gagné N étoiles en tout » prépare des meilleures étoiles sur des leçons de test absentes de la
  bibliothèque, sans jouer de séance (étape de #32). « Les sons de test » est la leçon de test de #24 (10 questions :
  0 erreur donne 3 étoiles, 2 erreurs 2 étoiles, 5 erreurs 1 étoile). « Léa a terminé 20 séances » : plus aucun
  épisode ne s'ouvre (#33). Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre
  enfant de Paul.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque

  Règle: Le personnage guide a une tenue reçue par palier des tenues atteint par le total des étoiles ; rien ne se perd

    # #102.1 : paliers décalés de ceux de la cabane
    Plan du Scénario: Avec <total> en tout, Noisette a <tenues>
      Étant donné que Léa a gagné <total> en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « <phrase> »
      Et les lecteurs d'écran annoncent « Les tenues de Noisette, avec <tenues> »

      Exemples:
        | total      | tenues    | phrase                                                             |
        | 5 étoiles  | 1 tenue   | Encore 7 étoiles et Noisette recevra un nœud papillon !            |
        | 11 étoiles | 1 tenue   | Encore 1 étoile et Noisette recevra un nœud papillon !             |
        | 12 étoiles | 2 tenues  | Encore 11 étoiles et Noisette recevra un sac à dos d'explorateur ! |

    Scénario: Une tenue reçue montre son nom, une tenue pas encore reçue le palier qui reste à atteindre
      Étant donné que Léa a gagné 12 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les tenues de Noisette montrent, dans l'ordre :
        | tenue             |
        | une écharpe rayée |
        | un nœud papillon  |
        | 23 ★              |
        | 37 ★              |

    # #102.26 : phrase quand toutes les tenues sont reçues
    @a-valider
    Scénario: Au-delà du dernier palier, Noisette a reçu toutes ses tenues
      Étant donné que Léa a gagné 40 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Noisette a reçu toutes ses tenues ! »
      Et les tenues de Noisette montrent, dans l'ordre :
        | tenue                      |
        | une écharpe rayée          |
        | un nœud papillon           |
        | un sac à dos d'explorateur |
        | des bottes de pluie        |

    Scénario: Rejouer une leçon avec moins d'étoiles ne retire aucune tenue et ne change pas la tenue portée
      Étant donné que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les sons de test    | 3       |
        | Les sons ou, on, an | 3       |
      Et que Léa a mis « une écharpe rayée » à Noisette
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 1 étoile
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Encore 6 étoiles et Noisette recevra un nœud papillon ! »
      Et Léa voit Noisette avec « une écharpe rayée »

  Règle: À la fin d'une séance qui fait atteindre un palier des tenues, l'enfant apprend quelle tenue son personnage guide a reçue

    Plan du Scénario: Passer de <avant> à <après> étoiles fait recevoir <tenue> à Noisette
      Étant donné que Léa a gagné <avant> étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce pour Noisette « Noisette a reçu <tenue> ! »

      Exemples:
        | avant | après | tenue             |
        | 4     | 5     | une écharpe rayée |
        | 11    | 12    | un nœud papillon  |

    # #102.1 : les paliers des tenues sont distincts des paliers de la cabane
    Scénario: Atteindre un palier de la cabane sans atteindre un palier des tenues n'annonce aucune tenue
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce pour la cabane « Noisette a reçu un tapis tout doux ! »
      Mais aucune annonce de nouvelle tenue n'apparaît à la fin de la séance

    Plan du Scénario: Sans palier des tenues atteint, la fin de la séance n'annonce aucune tenue (<cas>)
      Étant donné que Léa a pour meilleures étoiles :
        | leçon               | étoiles |
        | Les sons de test    | <avant> |
        | Les sons ou, on, an | 3       |
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de nouvelle tenue n'apparaît à la fin de la séance

      Exemples:
        | cas                                 | avant |
        | leçon rejouée avec moins d'étoiles  | 3     |
        | leçon rejouée avec autant d'étoiles | 1     |

    # #102.13 (deux encarts) et #102.22 (la tenue juste après la cabane)
    @a-valider
    Scénario: Une séance qui fait recevoir un objet de la cabane et une tenue annonce la cabane, puis la tenue
      Étant donné que Léa a gagné 4 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce, dans l'ordre, « Noisette a reçu un tapis tout doux ! » puis « Noisette a reçu une écharpe rayée ! »

    # #102.11 : c'est le personnage guide du profil qui reçoit la tenue
    @a-valider
    Scénario: Dans l'univers Sports, c'est Coach Léo qui reçoit la tenue
      Étant donné que Léa a choisi l'univers sports
      Et que Léa a gagné 4 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce pour Coach Léo « Coach Léo a reçu une écharpe rayée ! »

    # #102.16 : l'effet sonore « découverte » existant, une seule fois
    @a-valider
    Plan du Scénario: Une séance qui fait recevoir une tenue <cas> fait entendre <effets sonores> avant la phrase de fin
      Étant donné que Léa a terminé 20 séances
      Et que Léa a gagné 4 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait <erreurs> erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Léa entend <effets sonores>, puis Noisette dit sa phrase de fin

      Exemples:
        | cas                                                                 | erreurs | effets sonores                                             |
        | à 1 étoile, sans autre nouveauté                                    | 5       | les effets sonores « séance terminée » puis « découverte » |
        | qui rend la leçon acquise et fait aussi recevoir un objet de cabane | 2       | les effets sonores « grande victoire » puis « découverte » |

    # #102.12 : la phrase de fin du personnage guide ne change pas
    @a-valider
    Scénario: La phrase de fin du personnage guide ne parle pas de la tenue reçue
      Étant donné que Léa a terminé 20 séances
      Et que Léa a gagné 4 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Noisette dit une félicitation, suivie de « Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ? »

    # Comme la cabane (décision 32.13)
    Scénario: Sans réseau au début de la séance, la fin de la séance n'annonce aucune tenue
      Étant donné que Léa a gagné 4 étoiles en tout
      Et que le réseau est coupé
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de nouvelle tenue n'apparaît à la fin de la séance

  Règle: Dans « Mes médailles », l'enfant met une tenue reçue à son personnage guide, en change ou la retire ; le personnage guide porte une seule tenue à la fois, ou aucune

    Scénario: L'enfant met une tenue reçue à son personnage guide
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa met « une écharpe rayée » à Noisette
      Alors Léa voit Noisette avec « une écharpe rayée »
      Et les lecteurs d'écran annoncent « Noisette, avec une écharpe rayée »

    # #102.9 : une seule tenue à la fois
    @a-valider
    Scénario: Mettre une autre tenue remplace la tenue portée
      Étant donné que Léa a gagné 12 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa met « un nœud papillon » à Noisette
      Alors Léa voit Noisette avec « un nœud papillon »
      Mais Léa ne voit plus Noisette avec « une écharpe rayée »

    # #102.25 : libellé accessible sans tenue, « Noisette » seul
    @a-valider
    Scénario: Retirer la tenue laisse le personnage guide sans tenue, et la tenue reste reçue
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa retire la tenue de Noisette
      Alors Léa voit Noisette sans tenue
      Et les lecteurs d'écran annoncent « Noisette »
      Et les tenues de Noisette montrent toujours « une écharpe rayée »

    Scénario: Une tenue pas encore reçue ne se met pas, sans message d'erreur
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la pastille « 12 ★ »
      Alors Léa voit Noisette sans tenue
      Et aucun message d'erreur n'apparaît

    # #102.10 : la tenue reçue n'est pas mise d'office
    @a-valider
    Scénario: Une tenue qui vient d'être reçue n'est pas mise d'office
      Étant donné que Léa a gagné 4 étoiles en tout
      Et que Léa a terminé une séance de la leçon « Les sons de test » avec 1 étoile
      Quand Léa arrive sur son accueil
      Alors elle voit Noisette dans le paysage de l'univers « Animaux de la forêt », sans tenue

    # #102.4 : la section des tenues juste après la cabane
    @a-valider
    Scénario: La section des tenues vient juste après la cabane
      Étant donné que Léa a gagné 5 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les sections de l'écran sont, dans l'ordre : la cabane, les tenues, l'histoire, puis les badges

    # #102.21 : pas de section des tenues avant la première tenue reçue
    @a-valider
    Scénario: Avant le premier palier des tenues, la section des tenues n'apparaît pas
      Étant donné que Léa a gagné 4 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « Les tenues de Noisette » n'apparaît
      Et aucun message d'erreur n'apparaît

    # #102.2 et #102.11 : les mêmes tenues dans tous les univers, portées par le personnage guide du profil
    @a-valider
    Scénario: Dans l'univers Sports, la section montre les tenues de Coach Léo
      Étant donné que Léa a choisi l'univers sports
      Et que Léa a gagné 5 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Les tenues de Coach Léo »
      Et Léa lit « Encore 7 étoiles et Coach Léo recevra un nœud papillon ! »

    # #102.4 et #102.21 : la section des tenues est lue entre la cabane et l'histoire
    @a-valider
    Scénario: Avec « tout lire à voix haute », le titre des tenues puis leur phrase sont lus après la cabane
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a gagné 5 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette lire, dans l'ordre :
        | texte                                                                       |
        | Regarde tout ce que tu as gagné !                                           |
        | Mes médailles                                                               |
        | La cabane de Noisette                                                       |
        | Tu as 5 étoiles. Encore 1 étoile et Noisette recevra un tapis tout doux !   |
        | Les tenues de Noisette                                                      |
        | Encore 7 étoiles et Noisette recevra un nœud papillon !                     |
        | L'histoire des Savanturiers                                                 |
        | Un nouvel épisode s'ouvre à chaque séance terminée.                         |
        | Mes badges                                                                  |
        | Gagne au moins 2 étoiles dans une leçon pour gagner son badge.              |

    Scénario: Sans « tout lire à voix haute », l'enfant fait lire les tenues à la demande
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a gagné 5 étoiles en tout
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa demande à écouter les tenues
      Alors Léa entend Noisette lire « Les tenues de Noisette », puis « Encore 7 étoiles et Noisette recevra un nœud papillon ! »

  Règle: La tenue portée se voit sur tous les écrans de l'enfant où apparaît le personnage guide, et elle reste quand l'enfant revient ou change d'univers

    Plan du Scénario: Sur <écran>, Noisette porte la tenue choisie
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Quand Léa arrive sur <écran>
      Alors elle voit Noisette avec « une écharpe rayée » dans le paysage de l'univers « Animaux de la forêt »

      Exemples:
        | écran                                                   |
        | son accueil                                             |
        | « Mon parcours »                                        |
        | « Toutes les leçons »                                   |
        | la séance de la leçon « Les sons ou, on, an »           |
        | la fin de la séance de la leçon « Les sons ou, on, an » |

    Scénario: Après une relance de Savanturier, le personnage guide porte toujours la tenue choisie
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Quand Léa relance Savanturier
      Alors elle voit Noisette avec « une écharpe rayée » dans le paysage de l'univers « Animaux de la forêt »

    # #102.2 et #102.3 : les tenues sont communes et suivent le profil, pas l'univers
    @a-valider
    Scénario: Après un changement d'univers, le nouveau personnage guide porte la même tenue
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Et que Paul a changé l'univers du profil enfant de Léa en « Sports »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors elle voit Coach Léo avec « une écharpe rayée » dans le paysage de l'univers « Sports »

    # #102.23 : « Qui joue ? » est un écran du parent, le dessin validé y reste sans tenue
    @a-valider
    Scénario: Dans « Qui joue ? », le profil enfant garde le dessin de son personnage guide, sans tenue
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Quand Paul ouvre « Qui joue ? » sur la tablette
      Alors le profil enfant de Léa montre le dessin validé de Noisette, sans tenue

    # #102.24 : hors ligne, la tenue portée n'est pas montrée tant que les étoiles ne sont pas lues (tolérance du modèle)
    @a-valider
    Scénario: Sans réseau, le personnage guide s'affiche sans tenue, sans message d'erreur
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Et que le réseau est coupé
      Quand Léa arrive sur son accueil
      Alors elle voit Noisette dans le paysage de l'univers « Animaux de la forêt », sans tenue
      Et aucun message d'erreur n'apparaît

  Règle: La tenue se lit au lecteur d'écran là où elle compte, se choisit au clavier, et reste lisible sur un petit écran, en mode dys et sans mouvement

    # #102.14 : ailleurs que dans « Mes médailles », le personnage guide reste décoratif
    @a-valider
    Scénario: Sur « Mon parcours », les lecteurs d'écran n'annoncent ni le personnage guide ni sa tenue
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Quand Léa arrive sur « Mon parcours »
      Alors les lecteurs d'écran n'annoncent ni le paysage ni le dessin de Noisette
      Mais ils annoncent le titre de l'écran et les leçons du parcours

    Scénario: Sur un ordinateur, l'enfant met une tenue au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa a gagné 5 étoiles en tout
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa met « une écharpe rayée » à Noisette, au clavier seulement
      Alors Léa voit Noisette avec « une écharpe rayée »

    Scénario: Sur un écran de 360 px, le personnage guide habillé ne cache ni la consigne ni les choix
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers pompier
      Et que Léa a gagné 23 étoiles en tout
      Et que Léa a mis « un sac à dos d'explorateur » à Capitaine Sam
      Quand Léa arrive sur la séance de la leçon « Les sons ou, on, an »
      Alors elle voit Capitaine Sam avec « un sac à dos d'explorateur » dans le paysage de l'univers « Pompiers »
      Et la consigne et tous les choix de la question restent visibles en entier

    Scénario: Toutes les tenues reçues tiennent dans un écran de 360 px de large, avec des cibles assez grandes
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a gagné 40 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la page tient dans la largeur de l'écran
      Et chaque tenue à mettre et le choix de retirer la tenue mesurent au moins 44 px de haut

    Scénario: Avec le mode dys, la section des tenues s'affiche en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a gagné 12 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa voit le titre, la phrase et les tenues de la section des tenues en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: Avec les mouvements réduits, l'annonce de la tenue reçue apparaît sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a gagné 4 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors l'annonce de la tenue reçue apparaît sans mouvement

    Scénario: Avec les mouvements réduits, le personnage guide habillé reste immobile et garde sa tenue
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Quand Léa arrive sur « Mon parcours »
      Alors elle voit Noisette avec « une écharpe rayée » dans le paysage de l'univers « Animaux de la forêt »
      Et rien ne bouge dans le paysage ni chez Noisette

  Règle: La tenue portée appartient au profil enfant qui l'a choisie, sur l'appareil où il l'a choisie ; les tenues reçues ne comptent que les étoiles de ce profil

    @acces
    Scénario: La tenue choisie par un enfant ne se voit pas chez un autre enfant du même parent
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Et que Tom a un profil enfant préparé de niveau CP
      Et que Tom a gagné 5 étoiles en tout
      Quand Tom choisit son profil enfant dans « Qui joue ? »
      Alors il voit Noisette dans le paysage de l'univers « Animaux de la forêt », sans tenue

    # #102.21 : sans tenue reçue, pas de section des tenues
    @acces @a-valider
    Scénario: Les étoiles d'un autre enfant du même parent ne font recevoir aucune tenue
      Étant donné que Tom a un profil enfant préparé de niveau CP
      Et que Tom a gagné 30 étoiles en tout
      Et que Léa a gagné 2 étoiles en tout
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « Les tenues de Noisette » n'apparaît

    # #102.8 A : les tenues reçues se retrouvent partout, la tenue portée reste sur l'appareil où elle a été choisie
    @acces @a-valider
    Scénario: Sur le téléphone du second parent, l'enfant retrouve ses tenues reçues, mais pas la tenue choisie sur la tablette
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Quand Léa ouvre « Mes médailles » sur le téléphone de Marie
      Alors les tenues de Noisette montrent toujours « une écharpe rayée »
      Mais Léa voit Noisette sans tenue

    # #102.8 A : la tenue portée s'efface à la déconnexion du parent, les tenues reçues restent
    @acces @a-valider
    Scénario: Après la déconnexion du parent, le personnage guide n'a plus de tenue, mais garde ses tenues reçues
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Et que Paul s'est déconnecté puis reconnecté sur la tablette
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa voit Noisette sans tenue
      Et les tenues de Noisette montrent toujours « une écharpe rayée »

    # #102.19 : rien dans l'Espace parent
    @acces @a-valider
    Scénario: L'Espace parent ne montre pas les tenues de l'enfant
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Noisette
      Quand Paul entre dans l'espace parent
      Alors le mot « tenue » n'apparaît pas dans l'Espace parent
