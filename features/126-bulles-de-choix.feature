# language: fr
@issue-126 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : les choix sont des bulles de son univers
  En tant qu'enfant
  Je veux que les choix de réponse soient des bulles de mon univers, qui flottent doucement
  Afin que répondre ressemble à un petit jeu

  Tranche 98b de la story #98 (docs/stories/126/domain-model.md). La story ne change que l'affichage des choix : la
  correction, les erreurs, « Je ne sais pas », l'avancement et les étoiles restent ceux du domaine (#17, #18, #19,
  #22, #23, #24), et les retours de #97 (effet sonore, rebond, balancement, étincelles du dernier trou) passent
  d'abord, sans être redécrits.
  Les commentaires « Décision 98.n » renvoient à docs/stories/98/acceptance.md ; « Question #126.n » renvoie aux
  questions de docs/stories/126/acceptance.md, toutes tranchées le 2026-11-02 selon la reco.

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « la bulle de choix » : l'interface d'un Choix (décision n°30). On n'écrit jamais « bulle » seul : la bulle du
    personnage guide est autre chose. Les étapes existantes qui disent « le choix « … » » parlent de la même bulle ;
  - « le dessin de l'univers » : la bulle de choix a un dessin propre à chaque univers (décision 98.2). Les scénarios
    ne décrivent jamais ce qui est dessiné : l'objet de chaque univers est choisi par le PO (question #126.1) et
    validé sur une planche, pas par un scénario ;
  - « flotter » : la bulle de choix bouge doucement, de quelques pixels, sans que sa zone de toucher bouge
    (décision 98.3). Seules les bulles de choix de bulles et ecoute flottent (décision 98.4) ;
  - « s'efface en douceur » : la bulle de choix juste pâlit et disparaît sur place, sans éclater ni crever
    (décision 98.5) ; « brille » reste réservé à la bonne réponse montrée après « Je ne sais pas » ;
  - « rejoint son trou », « s'y illumine » : le mot juste va jusqu'au trou ou à la ligne du tableau, puis s'y éclaire
    un court instant. Durées pour l'implémentation et la review, jamais dans les étapes : chemin du mot de 150 à
    400 ms, effet sonore de #97 parti en moins de 300 ms.

  Leçons de la bibliothèque utilisées, toutes déjà employées par d'autres stories : « Les sons ou, on, an » (bulles
  « Quel son entends-tu ? », #17), « Les animaux » (écoute « Quel animal ? », #17), « Lecture : Le petit chat
  Plume » (#17), « Être et avoir au présent » (texte à trous « Les phrases magiques » et conjugaison « Le verbe
  être », #18 et #19), « Chanson : Au clair de la lune » (mots cachés, #22), « Les doubles » (calcul au CP par
  choix, #20). Questions et leçons de test de #17, #23, #27, #28 et #98.
  Les 6 univers et leur personnage guide (#6, #96) : Animaux de la forêt (Noisette), Princesses et fées (Lumi),
  Sports (Coach Léo), Police (Agent Max), Pompiers (Capitaine Sam), Danse (Lili).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt ». Quand Léa a
  choisi un autre univers, elle y garde son niveau CP.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Dans bulles et ecoute, les bulles de choix flottent doucement, toutes de la même façon, une fois la question lue ; elles s'arrêtent pour de bon au premier toucher ; leur zone de toucher ne bouge jamais et garde 44 px ; avec les mouvements réduits, aucune ne flotte ; dans les autres types, les choix ont la forme de bulle de choix sans flotter

    # Décisions 98.3 et 98.4
    Plan du Scénario: Dans <exercice>, les bulles de choix flottent doucement une fois la question lue
      Étant donné que <situation>
      Quand <début>
      Alors aucune bulle de choix ne flotte tant que Noisette lit la question
      Et ensuite, les bulles de choix flottent doucement, toutes de la même façon

      Exemples:
        | exercice          | situation                                                                         | début                                                                  |
        | un exercice bulles | Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » | la question « Dans le mot « poule », quel son entends-tu ? » s'affiche |
        | un exercice écoute | Léa joue l'exercice « Quel animal ? » de la leçon « Les animaux »                 | l'item « a cat » commence                                              |

    # Décision 98.3
    Plan du Scénario: Après <premier toucher>, plus aucune bulle de choix ne flotte jusqu'à la fin de la question
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand <toucher de Léa>
      Alors aucune bulle de choix ne flotte plus jusqu'à la fin de la question
      Et la question « Dans le mot « poule », quel son entends-tu ? » reste posée

      Exemples:
        | premier toucher    | toucher de Léa    |
        | une réponse fausse | Léa répond « on » |

      # Question #126.4 : « Je ne sais pas » arrête-t-il aussi les bulles de choix ? (tranchée le 2026-11-02 : reco, oui)
      Exemples:
        | premier toucher    | toucher de Léa             |
        | « Je ne sais pas » | Léa dit « Je ne sais pas » |

    # Question #126.4 : les relectures arrêtent-elles les bulles de choix ? (tranchée le 2026-11-02 : reco, oui, toute lecture)
    # Question #126.11 : le mot à écouter, redit par la voix anglaise, les arrête-t-il ? (tranchée le 2026-11-02 : reco, oui)
    Plan du Scénario: Pendant <parole>, les bulles de choix ne flottent pas, puis reprennent
      Étant donné que <préalable>
      Et que <situation>
      Quand <demande de Léa>
      Alors aucune bulle de choix ne flotte <pendant>
      Et ensuite, les bulles de choix flottent doucement, toutes de la même façon

      Exemples:
        | parole                 | préalable                                                                         | situation                                                                            | demande de Léa                      | pendant                                      |
        | la consigne relue      | Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » | Noisette a fini de lire la question « Dans le mot « poule », quel son entends-tu ? » | Léa demande à réécouter la consigne | pendant que Noisette relit la consigne       |
        | le mot à écouter redit | l'appareil a une voix française et une voix anglaise                              | Léa joue l'item « a cat » de l'exercice « Quel animal ? »                            | Léa demande à écouter de nouveau    | pendant que la voix anglaise redit « a cat » |

    # Décision 98.4 : la forme de bulle de choix pour tous les choix, le flottement pour bulles et ecoute seulement
    Plan du Scénario: Dans <exercice>, les choix sont des bulles de choix de l'univers, qui ne flottent pas
      Étant donné que <situation>
      Quand <début>
      Alors les bulles de choix de la question ont le dessin de l'univers « Animaux de la forêt »
      Mais aucune bulle de choix ne flotte

      Exemples:
        | exercice               | situation                                                                       | début                                             |
        | une question de lecture | Léa joue la leçon « Lecture : Le petit chat Plume »                             | la question « Où dort Plume ? » s'affiche         |
        | un texte à trous        | Léa est sur la page de la leçon « Être et avoir au présent »                   | Léa choisit seulement l'exercice « Les phrases magiques » |
        | une conjugaison         | Léa est sur la page de la leçon « Être et avoir au présent »                   | Léa choisit seulement l'exercice « Le verbe être » |
        | les mots cachés         | Léa retrouve les mots cachés de « Au clair de la lune »                         | le trou de « Au … de la lune, » est mis en avant  |
        | le calcul au CP         | Léa joue seulement l'exercice « Les doubles » de la leçon « Les doubles »       | le calcul « 2 + 2 » s'affiche                     |

    Scénario: Avec les mouvements réduits, aucune bulle de choix ne flotte, et les choix sont là
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors ensuite seulement, Léa voit les choix « ou », « on » et « an »
      Mais aucune bulle de choix ne flotte

    # Décisions 98.2 et 98.3 : la mise en page et la zone de toucher ne dépendent pas de l'univers
    Plan du Scénario: Dans l'univers « <univers> », les bulles de choix tiennent dans un écran de 360 px, gardent 44 px, et leur zone de toucher ne bouge pas
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors la page tient dans la largeur de l'écran
      Et chaque choix mesure au moins 44 px de haut et de large
      Et la zone de toucher de chaque bulle de choix reste immobile pendant que son dessin flotte

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Question #126.2 : la bulle de choix s'allonge avec le texte (tranchée le 2026-11-02 : reco, la même capsule dans les 6 univers)
    Scénario: Sur un écran de 360 px, une bulle de choix au texte long passe sur plusieurs lignes et se lit en entier
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et qu'une question de test « Que fait Plume ? » a les choix « Plume dort en boule sur le grand tapis bleu du salon, tout près de la fenêtre ouverte au soleil. », « Plume joue. » et « Plume mange. », de réponse « Plume joue. »
      Quand la question « Que fait Plume ? » s'affiche
      Alors la page tient dans la largeur de l'écran
      Et la consigne et tous les choix de la question restent visibles en entier
      Et chaque choix mesure au moins 44 px de haut et de large

    # Question #126.3 : toutes les bulles de choix d'une question ont-elles la même largeur ? (tranchée le 2026-11-02 : reco, oui)
    Scénario: Les bulles de choix d'une même question ont la même largeur, celle du choix le plus long
      Étant donné qu'une question de test « Quel mot a le son ou ? » a les choix « sac », « loup » et « crocodile », de réponse « loup »
      Quand la question « Quel mot a le son ou ? » s'affiche
      Alors les bulles de choix « sac », « loup » et « crocodile » ont la même largeur et la même hauteur

    # Question #126.5 : en séance de révision, la question d'un classer a-t-elle des bulles de choix qui flottent ? (tranchée le 2026-11-02 : reco, oui)
    Scénario: En séance de révision, la question d'un classer a des bulles de choix qui flottent
      Étant donné que Léa a pour question retenue l'étiquette « loup » de l'exercice « Les maisons des sons », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors Léa voit la question « « loup » va dans quelle maison ? », avec les choix « ou », « on » et « an »
      Et ensuite, les bulles de choix flottent doucement, toutes de la même façon

  Règle: Dans chacun des 6 univers, les bulles de choix ont le dessin de cet univers, pour tous les types d'exercices, en séance, en séance de révision et au test de départ ; changer d'univers ne change ni les textes lus, ni les annonces des lecteurs d'écran, ni les erreurs, ni les étoiles ; un profil sans univers connu voit les bulles de choix de l'univers « Animaux de la forêt »

    # Décisions 98.2 et 98.31 (la PR attend les 6 dessins validés)
    Plan du Scénario: Dans l'univers « <univers> », les bulles de choix ont le dessin de cet univers, et les lecteurs d'écran n'annoncent que leur texte
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors les bulles de choix de la question ont le dessin de l'univers « <univers> »
      Et les lecteurs d'écran annoncent les choix « ou », « on » et « an », sans décrire leur dessin ni leur mouvement

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Un profil enfant <cas> voit les bulles de choix de l'univers « Animaux de la forêt »
      Étant donné que Léa a un profil enfant préparé <cas>
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors les bulles de choix de la question ont le dessin de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                        |
        | sans univers               |
        | dont l'univers est inconnu |

    # Décision 98.13 : même habillage en séance, en séance de révision et au test de départ
    Plan du Scénario: <Où>, les bulles de choix ont le dessin de l'univers et flottent comme en séance
      Étant donné que Léa a choisi l'univers sports
      Et que <bibliothèque>
      Et que <situation>
      Quand <début>
      Alors les bulles de choix de la question ont le dessin de l'univers « Sports »
      Et ensuite, les bulles de choix flottent doucement, toutes de la même façon

      Exemples:
        | Où                    | bibliothèque                                         | situation                                                     | début                                         |
        | En séance de révision | la bibliothèque de test des révisions est servie     | Léa a 3 questions dues de la leçon « Les nombres de révision » | Léa commence la séance de révision            |
        | Au test de départ     | la bibliothèque de test du test de départ est servie | la proposition du test de départ est affichée pour Léa        | Léa accepte la proposition du test de départ  |

    # Décision 98.2 et invariant 1 : mêmes erreurs et mêmes étoiles pour les mêmes réponses
    Plan du Scénario: Dans l'univers « <univers> », une réponse fausse sur une bulle de choix coûte une erreur, comme avant
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue une leçon de test d'une seule question à quatre choix
      Et que Léa a répondu « 8 »
      Quand Léa répond « 7 »
      Alors Léa gagne 2 étoiles

      Exemples:
        | clé    | univers |
        | sports | Sports  |
        | danse  | Danse   |

  Règle: Après le rebond de #97, la bulle de choix juste s'efface en douceur sur place, sans étincelles et sans éclater ; les autres bulles de choix ne bougent pas ; un toucher pendant la félicitation ne fait rien

    # Décision 98.5 : un ballon ne crève jamais ; les étincelles restent réservées au texte complet (#97)
    Plan du Scénario: Dans l'univers « <univers> », la bulle de choix juste rebondit, puis s'efface en douceur, sans étincelles
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors le choix « ou » rebondit, puis sa bulle de choix s'efface en douceur à sa place, sans éclater
      Et aucune étincelle n'apparaît
      Et les bulles de choix « on » et « an » restent à leur place

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: Avec les mouvements réduits, la bulle de choix juste disparaît en fondu, sans grandir
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors le choix « ou » prend la couleur de réussite sans rebondir
      Et sa bulle de choix disparaît en fondu, sans grandir

    # Décision 97.17
    Scénario: Pendant la félicitation, toucher une autre bulle de choix ne coûte rien et ne retarde rien
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « ou » à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa touche la bulle de choix « on » pendant que Noisette la félicite
      Alors Léa n'entend pas l'effet sonore « réponse fausse »
      Et Noisette dit une félicitation commune ou l'une de ses expressions, en entier
      Et ensuite seulement, la question « Dans le mot « mouton », quel son entends-tu à la fin ? » s'affiche

  Règle: Dans un texte à trous, une conjugaison et les mots cachés, le mot juste rejoint son trou ou sa ligne, puis s'y illumine, sans briller comme une bonne réponse montrée ; le dernier trou et la dernière personne gardent les étincelles de #97

    Plan du Scénario: Dans <exercice>, le mot juste « <réponse> » rejoint sa place, puis s'y illumine
      Étant donné que <situation>
      Quand Léa répond « <réponse> »
      Alors le mot « <réponse> » rejoint <place>, puis s'y illumine
      Mais il ne brille pas comme une bonne réponse montrée
      Et aucune étincelle n'apparaît

      Exemples:
        | exercice         | situation                                                                                      | réponse | place                               |
        | un texte à trous | Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent » | suis    | le trou de « Je … dans le jardin. » |
        | une conjugaison  | Léa joue seulement l'exercice « Le verbe être » de la leçon « Être et avoir au présent »       | suis    | la ligne « je … ? » du tableau      |
        | les mots cachés  | Léa retrouve les mots cachés de « Au clair de la lune »                                        | clair   | le trou de « Au … de la lune, »     |

    Plan du Scénario: <dernière réponse> rejoint sa place, puis les étincelles de #97 apparaissent
      Étant donné que Léa joue seulement l'exercice « <exercice> » de la leçon « Être et avoir au présent »
      Et que <où en est Léa>
      Quand Léa répond « <réponse> »
      Alors le mot « <réponse> » rejoint <place>, puis s'y illumine
      Et des étincelles apparaissent
      Et Léa entend l'effet sonore « texte complet »

      Exemples:
        | dernière réponse                        | exercice             | où en est Léa                          | réponse | place                          |
        | Le dernier mot d'un texte à trous       | Les phrases magiques | Léa a rempli les trois premiers trous  | ont     | le trou de « Ils … faim. »     |
        | La dernière forme d'une conjugaison     | Le verbe être        | Léa en est à « ils … ? »               | sont    | la ligne « ils … ? » du tableau |

    Scénario: Avec les mouvements réduits, le mot juste apparaît dans son trou, sans voyager
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent »
      Quand Léa répond « suis »
      Alors le mot « suis » apparaît dans le trou de « Je … dans le jardin. », sans voyager
      Et Léa voit « Je suis dans le jardin. »

    # Question #126.6 : que devient la bulle de choix juste ? (tranchée le 2026-11-02 : reco, le mot seul voyage, la bulle vide s'efface sur place)
    Scénario: Dans un texte à trous, seul le mot voyage jusqu'au trou, et sa bulle de choix vide s'efface à sa place
      Étant donné que Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent »
      Quand Léa répond « suis »
      Alors seul le mot « suis » voyage jusqu'au trou de « Je … dans le jardin. »
      Et sa bulle de choix, vide, s'efface en douceur à sa place

  Règle: Sur une bulle de choix, le choix écarté et la bonne réponse montrée restent reconnaissables, par un signal d'état identique dans les 6 univers, posé par-dessus le dessin

    # Décision 98.2 et invariant 15. Question #126.10 : l'apparence du choix écarté (tranchée le 2026-11-02 : reco, gris pâle, sans décor)
    Plan du Scénario: Dans l'univers « <univers> », un choix écarté se voit comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « on »
      Alors le choix « on » reste visible, pâle, et ne réagit plus
      Et il est écarté de la même façon que dans l'univers « Animaux de la forêt »

      Exemples:
        | clé       | univers            |
        | princesse | Princesses et fées |
        | sports    | Sports             |
        | police    | Police             |
        | pompier   | Pompiers           |
        | danse     | Danse              |

    # Décision 98.2 : le signal « bonne réponse montrée » est celui de la maison de 98a, commun aux 6 univers
    Plan du Scénario: Dans l'univers « <univers> », la bulle de choix montrée par « Je ne sais pas » brille comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 7 » reste, et il brille
      Et il brille de la même façon que dans l'univers « Animaux de la forêt »

      Exemples:
        | clé       | univers            |
        | princesse | Princesses et fées |
        | sports    | Sports             |
        | police    | Police             |
        | pompier   | Pompiers           |
        | danse     | Danse              |

  Règle: Au clavier, Tab et Entrée répondent comme avant, et les flèches passent d'une bulle de choix à l'autre ; le mode dys et les lecteurs d'écran restent inchangés

    Scénario: Au clavier seulement, Léa répond avec Tab et Entrée, comme avant
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que les choix sont affichés dans l'ordre « 6 », « 7 », « 8 », « 9 »
      Quand Léa répond « 7 », au clavier seulement
      Alors Noisette applaudit en sautant
      Et la question « Combien font 3 + 4 ? » est réussie

    # Décision 98.15
    Scénario: Au clavier, les flèches passent d'une bulle de choix à l'autre, et Entrée répond
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que les choix sont affichés dans l'ordre « 6 », « 7 », « 8 », « 9 »
      Quand Léa répond « 7 » au clavier, en passant d'une bulle de choix à l'autre avec les flèches
      Alors Noisette applaudit en sautant
      Et la question « Combien font 3 + 4 ? » est réussie

    # Question #126.7 : les flèches passent-elles les choix écartés et s'arrêtent-elles aux bouts ? (tranchée le 2026-11-02 : reco, oui)
    Scénario: Les flèches passent le choix écarté et s'arrêtent à la dernière bulle de choix
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que les choix sont affichés dans l'ordre « 6 », « 7 », « 8 », « 9 »
      Et que Léa a répondu « 8 »
      Quand Léa passe d'une bulle de choix à l'autre avec la flèche droite, depuis « 6 », jusqu'au bout et une fois de plus
      Alors le focus passe, dans l'ordre, sur les bulles de choix « 6 », « 7 » et « 9 »
      Et le focus reste sur la bulle de choix « 9 »

    Scénario: En mode dys, les bulles de choix de l'univers s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors Léa voit la question et les choix en mode dys : police Andika, lettres, mots et lignes espacés
      Et les bulles de choix de la question ont le dessin de l'univers « Animaux de la forêt »
