# language: fr
@issue-6 @wip
Fonctionnalité: Univers et personnage guide
  En tant qu'enfant
  Je veux jouer dans l'univers que j'ai choisi, avec son personnage guide qui me parle et réagit
  Afin d'avoir envie de revenir réviser

  Règle: Chaque univers a son personnage guide et son paysage

    Plan du Scénario: Dans l'univers « <univers> », le personnage guide est <personnage guide>
      Étant donné que Léa a un profil enfant dans l'univers « <univers> »
      Quand Léa commence à jouer
      Alors elle voit <personnage guide> dans le paysage de l'univers « <univers> »

      Exemples:
        | univers             | personnage guide |
        | Princesses et fées  | Lumi             |
        | Animaux de la forêt | Noisette         |
        | Sports              | Coach Léo        |
        | Police              | Agente Mila      |
        | Pompiers            | Capitaine Sam    |
        | Danse               | Lili             |

    @a-valider
    Plan du Scénario: <personnage guide> se présente avec son titre et son royaume
      Étant donné que Léa a un profil enfant dans l'univers « <univers> »
      Quand Léa commence à jouer
      Alors <personnage guide> se présente comme « <titre> » de « <royaume> »

      Exemples:
        | univers             | personnage guide | titre                          | royaume                         |
        | Princesses et fées  | Lumi             | la fée des nombres et des mots | le Royaume des Savanturiers     |
        | Animaux de la forêt | Noisette         | l'écureuil savant              | la Forêt des Savanturiers       |
        | Sports              | Coach Léo        | l'entraîneur des champions     | le Stade des Savanturiers       |
        | Police              | Agente Mila      | la policière détective         | le Commissariat des Savanturiers |
        | Pompiers            | Capitaine Sam    | le pompier courageux           | la Caserne des Savanturiers     |
        | Danse               | Lili             | la danseuse étoile             | l'Opéra des Savanturiers        |

    Scénario: Deux univers différents donnent deux paysages et deux couleurs principales différents
      Étant donné que Léa a un profil enfant dans l'univers « Danse »
      Et que Tom a un profil enfant dans l'univers « Pompiers »
      Quand Léa et Tom commencent à jouer, chacun sur sa tablette
      Alors le paysage et la couleur principale de Léa diffèrent de ceux de Tom

    @a-valider
    Scénario: L'univers ne change pas les couleurs des colonnes de calcul
      Étant donné que Léa a un profil enfant dans l'univers « Danse »
      Et que Tom a un profil enfant dans l'univers « Pompiers »
      Quand Léa et Tom font chacun une addition posée en colonnes
      Alors tous deux voient la colonne des centaines en vert, celle des dizaines en rose et celle des unités en bleu

  Règle: Sans univers connu, l'enfant joue dans l'univers « Animaux de la forêt », avec Noisette

    Scénario: Sans profil enfant en cours, Noisette accueille l'enfant
      Étant donné qu'aucun profil enfant n'est en cours sur l'appareil
      Quand j'ouvre Savanturier
      Alors je vois Noisette dans le paysage de l'univers « Animaux de la forêt »

    @a-valider
    Plan du Scénario: Un profil enfant <cas> joue avec Noisette
      Étant donné que Léa a un profil enfant <cas>
      Quand Léa commence à jouer
      Alors elle voit Noisette dans le paysage de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                         |
        | sans univers                |
        | dont l'univers est inconnu  |

  Règle: Le personnage guide montre son humeur : content par défaut, il applaudit après une bonne réponse et réfléchit après une erreur

    Scénario: Le personnage guide est content quand l'enfant commence à jouer
      Étant donné que Léa a un profil enfant dans l'univers « Animaux de la forêt »
      Quand Léa commence à jouer
      Alors Noisette est content

    @a-valider
    Scénario: Le personnage guide applaudit après une bonne réponse
      Étant donné que Léa joue dans l'univers « Animaux de la forêt »
      Et que la question est « 3 + 4 »
      Quand Léa répond 7 à « 3 + 4 »
      Alors Noisette applaudit en sautant

    @a-valider
    Scénario: Le personnage guide réfléchit après une erreur
      Étant donné que Léa joue dans l'univers « Animaux de la forêt »
      Et que la question est « 3 + 4 »
      Quand Léa répond 8 à « 3 + 4 »
      Alors Noisette réfléchit en penchant la tête

    @a-valider
    Scénario: Après avoir réfléchi, le personnage guide applaudit la bonne réponse suivante
      Étant donné que Léa joue dans l'univers « Animaux de la forêt »
      Et que Noisette réfléchit après une erreur de Léa à « 3 + 4 »
      Quand Léa répond 7 à « 3 + 4 »
      Alors Noisette applaudit en sautant

  Règle: Le personnage guide félicite avec ses propres expressions ou une félicitation commune, et encourage sans jamais punir

    @a-valider
    Plan du Scénario: Après une bonne réponse, <personnage guide> dit une félicitation commune ou une de ses expressions
      Étant donné que Léa joue dans l'univers « <univers> »
      Quand Léa répond juste à une question
      Alors <personnage guide> dit une félicitation commune ou l'une de ses expressions : <expressions>
      Mais jamais l'expression d'un autre personnage guide

      Exemples:
        | univers             | personnage guide | expressions                                                          |
        | Princesses et fées  | Lumi             | « Abracadabra ! », « Par ma baguette, bravo ! », « Magique ! »       |
        | Animaux de la forêt | Noisette         | « Youpi ! », « Hop hop hop, bravo ! », « Trop fort, ça ! »           |
        | Sports              | Coach Léo        | « Allez, on y va ! », « Et c'est le but ! », « Quelle équipe ! »     |
        | Police              | Agente Mila      | « Enquête résolue ! », « Bien vu, détective ! », « Affaire classée ! » |
        | Pompiers            | Capitaine Sam    | « Mission accomplie ! », « Pin-pon, bravo ! », « Sauvetage réussi ! » |
        | Danse               | Lili             | « Et hop, une pirouette ! », « En rythme, bravo ! », « Quelle grâce ! » |

    @a-valider
    Scénario: Les félicitations communes sont les mêmes dans tous les univers
      Étant donné que Léa joue dans l'univers « Police »
      Quand Léa répond juste à une question
      Alors la félicitation commune dite par Agente Mila fait partie de « Bravo ! », « Super ! », « Ouah, bien joué ! », « Exactement ! », « Génial ! », « Tu gères ! », « Parfait ! », « Oui, c'est ça ! »

    @a-valider
    Scénario: Après une erreur, le personnage guide encourage et laisse une nouvelle chance
      Étant donné que Léa joue dans l'univers « Sports »
      Et que la question est « 3 + 4 »
      Quand Léa répond 8 à « 3 + 4 »
      Alors Coach Léo dit un encouragement parmi « Oups, presque ! », « Hmm, pas tout à fait… », « Pas grave, on réessaie ! », « Ah, celle-là est piégeuse ! », « Presque ! Regarde bien. »
      Et Léa peut répondre à nouveau à « 3 + 4 »

  Règle: L'en-tête donne toujours accès à l'accueil, au son, au retour et à l'espace parent, et montre l'enfant en cours

    Scénario: L'en-tête montre le prénom et le niveau de l'enfant en cours
      Étant donné que Léa a un profil enfant de niveau CE1
      Quand Léa commence à jouer
      Alors l'en-tête affiche « Léa · CE1 »
      Et l'en-tête propose le son, l'accueil et l'espace parent

    @acces
    Scénario: Sans profil enfant en cours, l'en-tête n'affiche aucun prénom
      Étant donné qu'aucun profil enfant n'est en cours sur l'appareil
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Mais l'en-tête n'affiche aucun prénom ni aucun niveau

    Scénario: Le nom de l'application ramène à l'accueil
      Étant donné que Léa joue dans l'univers « Danse »
      Quand Léa revient à l'accueil par le nom de l'application
      Alors je vois Noisette dans le paysage de l'univers « Animaux de la forêt »
      Et l'en-tête n'affiche aucun prénom ni aucun niveau

    Scénario: Le retour n'est proposé que s'il y a un écran précédent
      Étant donné qu'aucun profil enfant n'est en cours sur l'appareil
      Quand j'ouvre Savanturier
      Alors l'en-tête ne propose pas de retour

    Scénario: L'entrée de l'espace parent s'appelle « Espace parent »
      Quand j'ouvre Savanturier
      Alors l'en-tête propose l'« Espace parent »
      Mais jamais un « Espace adulte »

    Scénario: Le choix Muet est gardé sur l'appareil
      Étant donné que Léa a choisi Muet sur la tablette
      Quand Léa relance Savanturier
      Alors l'en-tête indique Muet

    @a-valider
    Scénario: En repassant au son, le personnage guide se présente
      Étant donné que Léa joue dans l'univers « Pompiers »
      Et qu'elle a choisi Muet sur la tablette
      Quand Léa repasse au son
      Alors Capitaine Sam dit « Je t'entends ! Je suis Capitaine Sam. »

  Règle: L'univers et le personnage guide restent utilisables sur un petit écran et avec les mouvements réduits

    Plan du Scénario: L'univers tient dans la largeur d'un écran de <largeur> px
      Étant donné que l'écran de l'appareil mesure <largeur> px de large
      Et que Léa a un profil enfant dans l'univers « Princesses et fées »
      Quand Léa commence à jouer
      Alors elle voit Lumi dans le paysage de l'univers « Princesses et fées »
      Et l'en-tête affiche le prénom de Léa, le son, l'accueil et l'espace parent
      Et la page tient dans la largeur de l'écran

      Exemples:
        | largeur |
        | 360     |
        | 820     |
        | 1280    |

    Scénario: Les commandes de l'en-tête sont assez grandes pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand j'ouvre Savanturier
      Alors chaque commande de l'en-tête mesure au moins 44 px de haut et de large

    Scénario: L'en-tête s'utilise au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Quand Léa parcourt l'en-tête au clavier
      Alors elle atteint tour à tour l'accueil, le son et l'espace parent

    @a-valider
    Scénario: Avec les mouvements réduits, le personnage guide ne saute pas mais montre qu'il applaudit
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue dans l'univers « Animaux de la forêt »
      Quand Léa répond juste à une question
      Alors Noisette montre qu'il applaudit, sans sauter

    @a-valider
    Scénario: Avec les mouvements réduits, le personnage guide ne penche pas la tête mais montre qu'il réfléchit
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue dans l'univers « Animaux de la forêt »
      Quand Léa fait une erreur à une question
      Alors Noisette montre qu'il réfléchit, sans bouger

    Scénario: Avec les mouvements réduits, le paysage reste immobile
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un profil enfant dans l'univers « Sports »
      Quand Léa commence à jouer
      Alors elle voit Coach Léo dans le paysage de l'univers « Sports »
      Et rien ne bouge dans le paysage ni chez Coach Léo
