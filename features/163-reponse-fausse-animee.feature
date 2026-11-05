# language: fr
@issue-163
Fonctionnalité: Une réponse fausse animée par le personnage guide
  En tant qu'enfant
  Je veux que mon personnage guide réagisse à ma réponse fausse par une petite scène drôle et gentille
  Afin de comprendre que ce n'est pas grave et d'avoir envie de réessayer

  Contexte Motivation (docs/stories/163/domain-model.md). La scène de réponse fausse est une mise en scène : elle
  ne change ni l'erreur comptée, ni les étoiles, ni la question posée, ni le parcours, et rien n'est enregistré.
  Cadrage en cours : les questions 163.1 à 163.12 ne sont pas encore tranchées par le PO. Les scénarios suivent les
  recommandations, et ceux qui dépendent d'une question portent le commentaire « # dépend de 163.n » et le
  tag @a-valider. Les questions nouvelles (163.13 et suivantes) sont dans docs/stories/163/acceptance.md.
  Livraisons (163.11) : la livraison 163a (mécanisme et Coach Léo, tag @livraison-163a), puis un personnage
  guide par livraison : 163b (Lili), 163c (Noisette), 163d (Lumi), 163e (Agent Max) et 163f (Capitaine Sam),
  chacune avec son tag. Ce qui ne dépend pas de l'univers n'est décrit qu'une fois, avec Coach Léo.
  La tenue portée dans la scène attend la livraison 106h de #106 (tag @depend-de-106).

  Mots employés dans ces scénarios :
  - « la scène de réponse fausse » : courte mise en scène jouée par le personnage guide du profil après une réponse
    fausse, à la place de son dessin, à sa taille ; il est surpris un instant, rit et finit souriant, le pouce levé
    (glossaire, terme à valider en 163.9). Elle n'affiche aucun titre (163.3) : seules les petites bulles écrites
    du dessin (« oh ! », « pschitt ! ») en font partie, jamais lues ni annoncées ;
  - « l'image fixe de la scène de réponse fausse » : le personnage guide souriant, le pouce levé, sans mouvement,
    quand l'appareil demande des mouvements réduits ;
  - « une célébration commune », « une célébration de l'univers » : celles de #97 et de #106. La scène de réponse
    fausse ne dure pas plus qu'une célébration commune, et moins qu'une célébration de l'univers (163.2) ;
  - « Léa entend l'effet sonore « … », puis Coach Léo dit … » : même sens qu'en #97 (la parole commence quand
    l'effet sonore est fini).
  Durées, pour l'implémentation et la review, jamais dans les étapes : 1,5 s au plus (163.2 A) ; la question, ses
  choix, le clavier et les boutons utilisables dès la première image.

  Leçons utilisées, toutes déjà employées par d'autres stories : la question de test « Combien font 3 + 4 ? »
  (#6 : choix « 6 », « 7 », « 8 » et « 9 », de réponse « 7 ») ; « Les sons ou, on, an » (#16 à #18) ;
  « Dictée : les animaux » (#23) ; « Les syllabes » (#18) ; « Les doubles » et « La leçon en action : 45 + 37 »
  (#20) ; les leçons de test de #23 ; la bibliothèque de test des révisions (#28), du test de départ (#27) et du
  défi (#100, #137).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CE1 dans l'univers « Sports » : son personnage guide
  est Coach Léo.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Sports »

  Règle: À la première réponse fausse de la séance, le personnage guide joue sa scène de réponse fausse, en plus du son « réponse fausse » et de l'encouragement ; la même question reste posée (nouvelle chance)

    # dépend de 163.1, 163.3 et 163.7
    @livraison-163a @a-valider
    Scénario: À la première réponse fausse de la séance, Coach Léo joue sa scène de réponse fausse et encourage Léa
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Léa entend l'effet sonore « réponse fausse », puis Coach Léo dit un encouragement
      Et Coach Léo joue sa scène de réponse fausse : le ballon rebondit sur un petit poteau et revient rouler à ses pieds
      Et Coach Léo n'apparaît qu'une fois, à sa place, la bulle gardant ses paroles
      Et la question « Combien font 3 + 4 ? » reste posée

    # dépend de 163.3
    @livraison-163a @a-valider
    Scénario: La scène de réponse fausse n'affiche aucun titre : l'aide reste la seule chose à lire
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa répond « 8 » à « Combien font 3 + 4 ? »
      Alors Coach Léo joue sa scène de réponse fausse
      Et Coach Léo dit un encouragement, suivi de « Essaie une autre bulle. »
      Mais Léa ne lit pas « Presque ! On réessaie ? »

    @livraison-163a
    Scénario: La scène de réponse fausse n'est jamais punitive : Coach Léo finit souriant, sans croix ni rouge plein écran
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et Coach Léo finit souriant, le pouce levé
      Mais aucune croix ni aucun rouge plein écran n'apparaît

    # dépend de 163.13
    @livraison-163a @a-valider
    Scénario: À la fin de sa scène de réponse fausse, Coach Léo reprend sa place et la même question attend Léa
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Coach Léo joue sa scène de réponse fausse après la réponse « 8 » de Léa
      Quand la scène de réponse fausse est finie
      Alors Coach Léo réfléchit en penchant la tête
      Et Coach Léo n'apparaît qu'une fois, à sa place, la bulle gardant ses paroles
      Et la question « Combien font 3 + 4 ? » reste posée

    @livraison-163a
    Scénario: Après la scène de réponse fausse, la bonne réponse garde tout son retour
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 » à la question « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste »
      Et le choix « 7 » rebondit
      Et Coach Léo applaudit en sautant

    @livraison-163a
    Scénario: Sans réseau, Coach Léo joue quand même sa scène de réponse fausse
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que le réseau est coupé
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et la question « Combien font 3 + 4 ? » reste posée

    @livraison-163a
    Scénario: Quand la scène de réponse fausse ne peut pas être chargée, Coach Léo réfléchit comme avant et la nouvelle chance n'attend pas
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que la scène de réponse fausse de Coach Léo ne peut pas être chargée
      Quand Léa répond « 8 »
      Alors Coach Léo réfléchit en penchant la tête
      Et la question « Combien font 3 + 4 ? » reste posée
      Et Léa ne voit aucun message de plus

  Règle: La scène de réponse fausse n'est jouée qu'une fois par séance ; les réponses fausses suivantes gardent le retour de #97 (son, encouragement, personnage guide qui réfléchit)

    # dépend de 163.1
    @livraison-163a @a-valider
    Scénario: À la deuxième réponse fausse à la même question, Coach Léo encourage sans rejouer sa scène
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « on » à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « an »
      Alors Léa entend l'effet sonore « réponse fausse », puis Coach Léo dit un encouragement
      Et Coach Léo réfléchit en penchant la tête
      Mais Coach Léo ne joue pas de scène de réponse fausse

    # dépend de 163.1
    @livraison-163a @a-valider
    Scénario: Une réponse fausse à une autre question de la même séance ne rejoue pas la scène
      Étant donné que Léa joue une leçon de test de deux questions à quatre choix
      Et qu'à la première question, Léa a fait une erreur, puis a donné la bonne réponse
      Quand Léa fait une erreur à la deuxième question
      Alors Coach Léo réfléchit en penchant la tête
      Mais Coach Léo ne joue pas de scène de réponse fausse

    # dépend de 163.1 et 163.14
    @livraison-163a @a-valider
    Scénario: Dans une nouvelle séance, la première réponse fausse fait de nouveau jouer la scène
      Étant donné que Léa a vu la scène de réponse fausse de Coach Léo dans une séance terminée aujourd'hui
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse

    # dépend de 163.1 et 163.6
    @livraison-163a @a-valider
    Scénario: « Je ne sais pas » ne fait pas jouer la scène et ne la consomme pas : la première réponse fausse qui suit la fait jouer
      Étant donné que Léa joue l'exercice « Le mot bien écrit » de la leçon « Dictée : les animaux »
      Et que Léa a dit « Je ne sais pas » à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa répond « cha »
      Alors Coach Léo joue sa scène de réponse fausse

  Règle: La scène de réponse fausse ne retient jamais l'enfant : la question, ses choix, le clavier et les boutons agissent dès la première image ; une réponse ou un bouton l'arrête tout de suite ; un toucher hors des boutons ne fait rien

    @livraison-163a
    Scénario: Pendant la scène de réponse fausse, la question et ses choix restent visibles
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et la question « Combien font 3 + 4 ? » et ses quatre choix restent visibles

    @livraison-163a
    Scénario: Une bonne réponse donnée pendant la scène de réponse fausse est prise tout de suite et l'arrête
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Coach Léo joue sa scène de réponse fausse après la réponse « 8 » de Léa
      Quand Léa répond « 7 »
      Alors la question « Combien font 3 + 4 ? » est réussie
      Et la scène de réponse fausse s'arrête
      Et Coach Léo applaudit en sautant

    @livraison-163a
    Scénario: Pendant la scène de réponse fausse, le clavier n'est jamais bloqué
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Coach Léo joue sa scène de réponse fausse après la réponse « 8 » de Léa
      Quand Léa répond « 7 », au clavier seulement
      Alors la question « Combien font 3 + 4 ? » est réussie
      Et la scène de réponse fausse s'arrête

    @livraison-163a
    Scénario: Pendant la scène de réponse fausse, « Je ne sais pas » agit tout de suite et l'arrête
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Et que Coach Léo joue sa scène de réponse fausse après la réponse « 8 » de Léa
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 7 » reste, et il brille
      Et la scène de réponse fausse s'arrête

    @livraison-163a
    Scénario: Pendant la scène de réponse fausse, demander à réécouter la question l'arrête
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Coach Léo joue sa scène de réponse fausse après la réponse « 8 » de Léa
      Quand Léa demande à réécouter la question
      Alors la scène de réponse fausse s'arrête
      Et Coach Léo n'apparaît qu'une fois, à sa place, la bulle gardant ses paroles

    @livraison-163a
    Scénario: Toucher l'écran en dehors des boutons pendant la scène de réponse fausse ne change rien
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Coach Léo joue sa scène de réponse fausse après la réponse « 8 » de Léa
      Quand Léa touche l'écran en dehors des boutons
      Alors Coach Léo continue sa scène de réponse fausse
      Et la question « Combien font 3 + 4 ? » reste posée

  Règle: La scène de réponse fausse ne change rien à l'apprentissage : la même erreur est comptée, les étoiles, l'avancement de la séance et le parcours sont les mêmes que sans elle

    @livraison-163a
    Scénario: Une réponse fausse avec la scène ne fait voler aucun point et ne change pas l'avancement de la séance
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « on »
      Alors Coach Léo joue sa scène de réponse fausse
      Et aucun point ne vole jusqu'au récipient
      Et l'avancement de la séance montre toujours 0 question réussie sur 15

    # Danse : Lili n'a sa scène qu'à partir de la livraison 163b ; avant comme après, les étoiles sont les mêmes
    @livraison-163a
    Plan du Scénario: Dans l'univers « <univers> », une séance avec une erreur donne les mêmes étoiles
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « <univers> »
      Et que Léa joue une leçon de test d'une seule question à quatre choix
      Et que Léa a fait une erreur à cette question
      Quand Léa donne la bonne réponse
      Alors la séance est terminée
      Et Léa gagne 2 étoiles

      Exemples:
        | univers |
        | Sports  |
        | Danse   |

  Règle: Chaque personnage guide a sa propre scène de réponse fausse, douce et sans danger, dans laquelle il porte la tenue choisie par l'enfant ; la scène jouée est celle de l'univers du profil au moment de la réponse

    # dépend de 163.5, 163.11 ; Capitaine Sam : dépend de 163.4
    @a-valider
    Plan du Scénario: Dans l'univers « <univers> », <personnage guide> joue sa scène de réponse fausse, puis la même question reste posée
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « <univers> »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors <personnage guide> joue sa scène de réponse fausse : <scène>
      Et <personnage guide> finit souriant, le pouce levé
      Et la question « Combien font 3 + 4 ? » reste posée

      # dépend de 163.5a
      @livraison-163a
      Exemples:
        | univers | personnage guide | scène                                                                 |
        | Sports  | Coach Léo        | le ballon rebondit sur un petit poteau et revient rouler à ses pieds  |

      # dépend de 163.5b
      @livraison-163b
      Exemples:
        | univers | personnage guide | scène                                                                         |
        | Danse   | Lili             | elle vacille à peine sur ses demi-pointes, fait un petit pas de côté et une révérence |

      # dépend de 163.5c
      @livraison-163c
      Exemples:
        | univers             | personnage guide | scène                                                                                   |
        | Animaux de la forêt | Noisette         | une noisette tombe de l'arbre, rebondit dans l'herbe à côté d'elle, et elle la ramasse  |

      # dépend de 163.5d
      @livraison-163d
      Exemples:
        | univers             | personnage guide | scène                                                                   |
        | Princesses et fées  | Lumi             | son sort fait « pschitt ! » et donne des bulles pastel, sur lesquelles elle souffle |

      # dépend de 163.5e
      @livraison-163e
      Exemples:
        | univers | personnage guide | scène                                                                         |
        | Police  | Agent Max        | le chiot rapporte en remuant la queue la casquette qui a glissé dans l'herbe  |

      # dépend de 163.4
      @livraison-163f
      Exemples:
        | univers  | personnage guide | scène                                                                         |
        | Pompiers | Capitaine Sam    | le jet de sa lance fait une petite fontaine qui retombe en gouttes devant ses bottes |

    @livraison-163a
    Scénario: Un enfant passé dans l'univers « Sports » voit Coach Léo jouer la scène de réponse fausse
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Paul a changé l'univers du profil enfant de Tom en « Sports »
      Et que Tom joue la question de test « Combien font 3 + 4 ? »
      Quand Tom répond « 8 » à « Combien font 3 + 4 ? »
      Alors Coach Léo joue sa scène de réponse fausse

    # dépend de 163.8 ; attend la livraison 106h de #106 (tenue portée dans les scènes)
    @livraison-163a @a-valider @depend-de-106
    Scénario: Pendant la scène de réponse fausse, Coach Léo porte la tenue choisie par Léa
      Étant donné que Léa a gagné 5 étoiles en tout
      Et que Léa a mis « une écharpe rayée » à Coach Léo
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse avec « une écharpe rayée »

  Règle: La scène de réponse fausse n'est jamais plus attrayante que la bonne réponse : elle est courte, sans confettis, sans cri de victoire, sans musique et sans son à elle

    # dépend de 163.2
    @livraison-163a @a-valider
    Scénario: La scène de réponse fausse est plus courte qu'une célébration de l'univers
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et la scène de réponse fausse ne dure pas plus qu'une célébration commune, et moins qu'une célébration de l'univers

    @livraison-163a
    Scénario: La scène de réponse fausse n'a ni confettis, ni cri de victoire, ni musique, ni son à elle
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et Léa entend une seule fois l'effet sonore « réponse fausse »
      Mais aucun confetti ne tombe
      Et la scène de réponse fausse ne montre aucun cri de victoire et ne fait entendre aucun son

  Règle: La scène de réponse fausse se vit sans mouvement, sans voix et sans voir l'écran : image fixe en mouvements réduits, effet sonore sans parole en Muet, une seule annonce aux lecteurs d'écran, mode dys, 360 px et boutons d'au moins 44 px

    @livraison-163a
    Scénario: Avec les mouvements réduits, Léa voit l'image fixe de la scène de réponse fausse, et l'encouragement est dit
      Étant donné que l'appareil demande des mouvements réduits
      Et qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa répond « 8 » à « Combien font 3 + 4 ? »
      Alors Léa voit l'image fixe de la scène de réponse fausse de Coach Léo, souriant, le pouce levé, sans mouvement
      Et le choix « 8 » ne se balance pas
      Et Coach Léo dit un encouragement, suivi de « Essaie une autre bulle. »

    # Décision 97.2 : le Muet coupe la parole, pas les effets sonores ; la scène n'ajoute aucun son
    @livraison-163a
    Scénario: En Muet, la scène de réponse fausse se joue sans aucune parole, et seul « réponse fausse » se fait entendre
      Étant donné que la tablette est en Muet
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et Léa entend une seule fois l'effet sonore « réponse fausse »
      Mais Léa n'entend aucune parole

    # dépend de 163.3
    @livraison-163a @a-valider
    Scénario: Les lecteurs d'écran annoncent une seule fois l'encouragement, sans lire la scène de réponse fausse
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa répond « 8 » à « Combien font 3 + 4 ? »
      Alors les lecteurs d'écran annoncent une seule fois l'encouragement de Coach Léo, suivi de « Essaie une autre bulle. »
      Mais les lecteurs d'écran n'annoncent ni « oh ! » ni le dessin de la scène de réponse fausse

    @livraison-163a
    Scénario: Avec le mode dys, l'encouragement dit pendant la scène de réponse fausse s'affiche en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa répond « 8 » à « Combien font 3 + 4 ? »
      Alors Coach Léo joue sa scène de réponse fausse
      Et Léa voit « Essaie une autre bulle. » dans la bulle de Coach Léo en mode dys

    # dépend de 163.7
    @livraison-163a @a-valider
    Scénario: À 360 px, la scène de réponse fausse tient à la place du personnage guide, et les choix restent assez grands
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et la page tient dans la largeur de l'écran
      Et chaque choix mesure au moins 44 px de haut et de large
      Et « Je ne sais pas » mesure au moins 44 px de haut

  Règle: La scène de réponse fausse se joue dans la séance d'une leçon, quel que soit le type d'exercice, dans la séance de révision, le défi et le grand défi ; jamais pendant le chrono d'une fluence, après « Je ne sais pas », au test de départ, ni là où le personnage guide est trop petit pour la montrer

    # dépend de 163.6
    @livraison-163a @a-valider
    Plan du Scénario: Dans <exercice>, la première réponse fausse de la séance fait jouer la scène de réponse fausse
      Étant donné que <situation>
      Quand <réponse de Léa>
      Alors Coach Léo joue sa scène de réponse fausse

      Exemples:
        | exercice            | situation                                                                                | réponse de Léa                                    |
        | un exercice bulles  | Léa joue l'exercice « Le mot bien écrit » de la leçon « Dictée : les animaux »           | Léa répond « cha »                                |
        | un exercice classer | Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an » | Léa pose l'étiquette « loup » dans la maison « on » |
        | un exercice ordre   | Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »        | Léa pose l'étiquette « mi »                       |

    # dépend de 163.6
    @livraison-163a @a-valider
    Scénario: En séance de révision, la première réponse fausse fait jouer la scène de réponse fausse
      Étant donné que la bibliothèque de test des révisions est servie
      Et que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | aujourd'hui      |
      Et que Léa en est à la question « Quel mot a le son ou ? » de la séance de révision
      Quand Léa répond « lit » à la question « Quel mot a le son ou ? »
      Alors Coach Léo joue sa scène de réponse fausse
      Et Coach Léo dit un encouragement, suivi de « Essaie une autre bulle. »

    # dépend de 163.6
    @livraison-163a @a-valider
    Scénario: Pendant un défi, la première réponse fausse fait jouer la scène de réponse fausse
      Étant donné que la bibliothèque de test du défi est servie
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa en est à la question « Combien font 2 + 1 ? » du défi 1 de maths
      Quand Léa répond « 4 » à la question « Combien font 2 + 1 ? »
      Alors Coach Léo joue sa scène de réponse fausse
      Et la question « Combien font 2 + 1 ? » reste posée

    # dépend de 163.6
    @livraison-163a @a-valider
    Scénario: Pendant le grand défi, la première réponse fausse fait jouer la scène de réponse fausse
      Étant donné que la bibliothèque de test du défi est servie
      Et que Léa a réussi les 10 premières leçons de maths du CE1
      Et que Léa a commencé le grand défi des maths
      Quand Léa se trompe à la première question du grand défi
      Alors Coach Léo joue sa scène de réponse fausse

    # Décision 97.10 ; dépend de 163.6
    @livraison-163a @a-valider
    Scénario: Pendant le chrono d'une fluence, une réponse fausse ne fait entendre que « réponse fausse », sans scène
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles », avec 3 calculs réussis
      Quand Léa donne une réponse fausse
      Alors Léa entend l'effet sonore « réponse fausse »
      Mais Coach Léo ne joue pas de scène de réponse fausse

    # Décision 97.11 ; dépend de 163.6
    @livraison-163a @a-valider
    Scénario: « Je ne sais pas » ne fait pas jouer la scène de réponse fausse
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 7 » reste, et il brille
      Mais Coach Léo ne joue pas de scène de réponse fausse

    # dépend de 163.6
    @livraison-163a @a-valider
    Scénario: Au test de départ, une réponse fausse garde l'encouragement, sans scène de réponse fausse
      Étant donné que la bibliothèque de test du test de départ est servie
      Et que Léa en est à la question de « Les voyelles » du test de départ
      Quand Léa se trompe à la question de « Les voyelles »
      Alors Coach Léo dit un encouragement, suivi de « Essaie une autre bulle. »
      Mais Coach Léo ne joue pas de scène de réponse fausse

    # dépend de 163.7 : avec l'addition posée sur un écran étroit, le personnage guide est trop petit pour la scène
    @livraison-163a @a-valider
    Scénario: Avec l'addition posée sur un écran de 360 px, Coach Léo réfléchit sans jouer de scène de réponse fausse
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Quand Léa répond « 7 » pour la colonne des dizaines
      Alors Coach Léo réfléchit en penchant la tête
      Mais Coach Léo ne joue pas de scène de réponse fausse
