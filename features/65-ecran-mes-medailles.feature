# language: fr
@issue-65
Fonctionnalité: L'écran « Mes médailles » réunit ce que l'enfant a gagné
  En tant qu'enfant
  Je veux un écran qui réunit ce que j'ai gagné : la cabane, l'histoire, mes badges et mes records de calcul rapide
  Afin de voir mes progrès d'un coup d'œil

  Les questions 1 à 17 sont tranchées par le PO. L'écran et son bouton d'accès s'appellent « Mes médailles »
  (question 1, « médaille » n'est plus un synonyme interdit de Badge) ; le mot « trophée » reste interdit.

  Cette story livre l'écran et sa section « Mes records de calcul rapide ». Les sections de la cabane (#32), de
  l'histoire (#33) et des badges (#31) s'y ajoutent avec leur story ; leurs scénarios restent dans leur story.
  En attendant le dock de #29, l'écran s'ouvre par un bouton de l'accueil de l'enfant, comme « Mon parcours » (#25).

  Exercices de fluence de la bibliothèque utilisés (titre de l'exercice, leçon, niveau) :
  - « Calcul rapide : les doubles », leçon « Les doubles » (ma-cp-doubles), CP ;
  - « Calcul rapide : tables de 2 à 5 », leçon « Les tables de 2 et de 5 » (ma-ce1-tables-2-5), CE1 ;
  - « Calcul rapide : tables de 3 et 4 », leçon « Les tables de 3 et de 4 » (ma-ce2-tables-3-4), CE2 ;
  - « Calcul rapide : compléments à 100 », leçon « Calcul mental : compléments à 100 » (ma-ce2-calcul-mental), CE2.
  Les leçons de test ont un identifiant préfixé « e2e-65- ». Les records préparés sont écrits comme ceux de #20 ;
  ils partent avec le profil enfant en fin de scénario.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre enfant de Paul ;
  Claire n'est rattachée à aucun des deux.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »

  Règle: L'enfant ouvre l'écran depuis son accueil, et le retour l'y ramène

    Scénario: Depuis son accueil, l'enfant ouvre l'écran et voit son titre
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors le titre de l'écran est « Mes médailles »
      Mais le mot « trophée » n'apparaît ni sur l'accueil ni sur l'écran

    Scénario: Depuis l'écran, le retour ramène à l'accueil de l'enfant
      Étant donné que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa revient en arrière
      Alors Léa voit son accueil

  Règle: Les sections de l'écran suivent toujours l'ordre cabane, histoire, badges, records de calcul rapide

    Scénario: Les records de calcul rapide viennent après toutes les autres sections, sans section vide annoncée
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors « Mes records de calcul rapide » est la dernière section de l'écran
      Mais aucune section n'annonce un contenu à venir

    @depend-de-31 @depend-de-32 @depend-de-33
    Scénario: Les quatre sections apparaissent dans l'ordre cabane, histoire, badges, records
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les sections de l'écran sont, dans l'ordre : la cabane, l'histoire, les badges, puis les records de calcul rapide

  Règle: La section des records de calcul rapide montre une pastille par record de fluence du profil en cours, et n'apparaît pas sans record

    Plan du Scénario: Avec un record de <record>, la pastille montre le titre de l'exercice et <record>
      Étant donné que Léa a un record de <record> à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent seulement « Calcul rapide : tables de 3 et 4 », <record>
      Mais le titre de la leçon « Les tables de 3 et de 4 » n'y apparaît pas

      Exemples:
        | record |
        | 1      |
        | 12     |
        | 48     |

    Scénario: Sans aucun record, la section des records de calcul rapide n'apparaît pas
      Étant donné que Léa n'a pas encore de record à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « Mes records de calcul rapide » n'apparaît

    Scénario: Sans rien à montrer, le personnage guide invite l'enfant à gagner un premier record
      Étant donné que Léa n'a pas encore de record à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Fais un calcul rapide pour gagner ton premier record ! »

    Scénario: Avec un profil de démonstration, l'écran s'ouvre sans section des records
      Étant donné que Léa joue avec un profil de démonstration, sans compte parent
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa lit « Fais un calcul rapide pour gagner ton premier record ! »
      Mais aucune section « Mes records de calcul rapide » n'apparaît

    Scénario: Les pastilles suivent l'ordre du parcours, pas l'ordre où les records ont été gagnés
      Étant donné que Léa a pour records de fluence :
        | fluence                          | record |
        | Calcul rapide : tables de 3 et 4 | 12     |
        | Calcul rapide : les doubles      | 20     |
        | Calcul rapide : tables de 2 à 5  | 9      |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent, dans l'ordre :
        | pastille                         | record |
        | Calcul rapide : les doubles      | 20     |
        | Calcul rapide : tables de 2 à 5  | 9      |
        | Calcul rapide : tables de 3 et 4 | 12     |

    Scénario: Deux fluences d'une même leçon ont deux pastilles aux libellés différents
      Étant donné qu'une leçon de test « Deux calculs rapides » a deux fluences, « Calcul rapide : tables de 2 » puis « Calcul rapide : tables de 5 »
      Et que Léa a pour records de fluence :
        | fluence                     | record |
        | Calcul rapide : tables de 5 | 14     |
        | Calcul rapide : tables de 2 | 17     |
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent, dans l'ordre :
        | pastille                    | record |
        | Calcul rapide : tables de 2 | 17     |
        | Calcul rapide : tables de 5 | 14     |

    Scénario: Une fluence sans titre prend le titre de sa leçon
      Étant donné qu'une leçon de test « Multiplier vite » a une fluence sans titre, de signe « × »
      Et que Léa a un record de 8 à la fluence sans titre de la leçon « Multiplier vite »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent seulement « Multiplier vite », 8

    Scénario: Le record d'un exercice qui n'est plus dans la bibliothèque reste montré
      Étant donné que Léa a un record de 7 à une fluence « Calcul rapide : les anciens doubles » qui n'est plus dans la bibliothèque
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent seulement « Calcul rapide : les anciens doubles », 7

    Scénario: Redescendue en CE1, l'enfant retrouve son record d'une leçon de CE2
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE1
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent seulement « Calcul rapide : tables de 3 et 4 », 12

    Scénario: Juste après un nouveau record, la pastille montre le nouveau record
      Étant donné que Léa a un record de 10 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Léa a fini cette fluence avec 12 calculs réussis
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent seulement « Calcul rapide : tables de 3 et 4 », 12

    Scénario: Sans réseau, la section des records n'apparaît pas, sans message d'erreur
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que le réseau est coupé
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « Mes records de calcul rapide » n'apparaît
      Et aucun message d'erreur n'apparaît

    Scénario: Une pastille de record n'ouvre pas la leçon
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa choisit la pastille « Calcul rapide : tables de 3 et 4 »
      Alors le titre de l'écran est toujours « Mes médailles »

  Règle: Tout texte de l'écran peut être lu à voix haute ; « tout lire à voix haute » lit tout l'écran à l'ouverture

    Plan du Scénario: Dans l'univers « <univers> », <personnage guide> accueille l'enfant sur l'écran
      Étant donné que Léa a choisi l'univers <clé>
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors elle voit <personnage guide> dans le paysage de l'univers « <univers> »
      Et Léa entend <personnage guide> dire « Regarde tout ce que tu as gagné ! »

      Exemples:
        | clé       | univers             | personnage guide |
        | animaux   | Animaux de la forêt | Noisette         |
        | princesse | Princesses et fées  | Lumi             |
        | pompier   | Pompiers            | Capitaine Sam    |

    Scénario: Avec « tout lire à voix haute », le titre puis chaque section sont lus à l'ouverture
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette lire, dans l'ordre :
        | texte                                                          |
        | Regarde tout ce que tu as gagné !                              |
        | Mes médailles                                                    |
        | Mes records de calcul rapide                                   |
        | Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs |

    Scénario: Revenir à l'accueil pendant la lecture coupe la voix : la suite de l'écran n'est pas lue sur l'accueil
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Et que Noisette est en train de lire « Regarde tout ce que tu as gagné ! »
      Quand Léa revient en arrière
      Alors Léa n'entend pas Noisette lire « Mes records de calcul rapide »
      Et Léa n'entend pas Noisette lire « Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs »

    Scénario: Sans « tout lire à voix haute », seul l'accueil du personnage guide est lu à l'ouverture
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette dire « Regarde tout ce que tu as gagné ! »
      Mais Léa n'entend pas Noisette lire « Mes records de calcul rapide »

    Scénario: Sans rien à montrer, le personnage guide ne dit qu'une phrase à l'ouverture, même avec « tout lire à voix haute »
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa n'a pas encore de record à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa entend Noisette dire « Fais un calcul rapide pour gagner ton premier record ! »
      Mais Léa n'entend pas Noisette lire « Regarde tout ce que tu as gagné ! »

    Plan du Scénario: Sans « tout lire à voix haute », l'enfant fait lire les records à la demande (<record>)
      Étant donné que le réglage « tout lire à voix haute » de Léa est sur « non »
      Et que Léa a un record de <record> à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Léa a ouvert « Mes médailles » depuis son accueil
      Quand Léa demande à écouter les records de calcul rapide
      Alors Léa entend Noisette lire « Mes records de calcul rapide », puis « Calcul rapide : tables de 3 et 4 : ton record est de <lu> »

      Exemples:
        | record | lu         |
        | 1      | 1 calcul   |
        | 12     | 12 calculs |

    Scénario: En Muet, rien n'est lu sur l'écran, même avec « tout lire à voix haute »
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que la tablette est en Muet
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa n'entend rien

  Règle: L'écran se lit au lecteur d'écran, au clavier, en mode dys, sans mouvement et sur un petit écran

    Scénario: Un lecteur d'écran lit le libellé et la valeur de chaque pastille
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les lecteurs d'écran annoncent « Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs »

    Scénario: Sur un ordinateur, l'enfant ouvre l'écran au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Quand Léa ouvre « Mes médailles » depuis son accueil, au clavier seulement
      Alors le titre de l'écran est « Mes médailles »

    Scénario: L'écran tient dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un record de 31 à la fluence « Calcul rapide : compléments à 100 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la page tient dans la largeur de l'écran
      Et le bouton d'accès à l'écran, « Retour » et chaque bouton « Écouter » mesurent au moins 44 px de haut

    Scénario: Avec le mode dys, le titre et les pastilles s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors Léa voit le titre de l'écran et les pastilles de record en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: Avec les mouvements réduits, les pastilles apparaissent sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les pastilles de record apparaissent sans mouvement

  Règle: L'écran ne montre que les records du profil enfant qui joue

    @acces
    Scénario: Un enfant ne voit jamais le record d'un autre enfant du même parent
      Étant donné que Tom a un profil enfant préparé de niveau CE2
      Et que Tom a un record de 15 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Léa n'a pas encore de record à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors aucune section « Mes records de calcul rapide » n'apparaît

    @acces
    Scénario: Quand deux enfants du même parent ont des records, chacun ne voit que les siens
      Étant donné que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Tom a un profil enfant préparé de niveau CE2
      Et que Tom a un record de 15 à la fluence « Calcul rapide : tables de 3 et 4 »
      Et que Tom a un record de 20 à la fluence « Calcul rapide : les doubles »
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors les records de calcul rapide montrent seulement « Calcul rapide : tables de 3 et 4 », 12

    @acces
    Scénario: Le second parent rattaché retrouve les records de Léa sur son téléphone
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a un record de 12 à la fluence « Calcul rapide : tables de 3 et 4 »
      Quand Léa ouvre « Mes médailles » sur le téléphone de Marie
      Alors les records de calcul rapide montrent seulement « Calcul rapide : tables de 3 et 4 », 12

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les records de Léa
      Étant donné que Léa a un record de 15 à la fluence « Calcul rapide : tables de 3 et 4 », gagné sur la tablette
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les records du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
