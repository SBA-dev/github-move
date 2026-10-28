# language: fr
@issue-98 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : glisser les étiquettes dans les maisons de son univers
  En tant qu'enfant
  Je veux glisser mes étiquettes du doigt dans des maisons de mon univers, qui s'ouvrent et s'allument
  Afin que ranger ressemble à un petit jeu dans mon univers, et d'avoir envie de faire la question suivante

  Tranche 98a de la story #98 (docs/stories/98/domain-model.md, « Découpage révisé ») : le geste glisser au doigt,
  les invariants, et l'exercice classer avec la maison dessinée dans chacun des 6 univers (décision 98.2 :
  habillage par univers). Le petit train de l'exercice ordre et de l'ordre des vers de memoriser sort de cette tranche
  (question 98.30) ; les autres types d'exercices sont dans les tranches suivantes (#126 à #129). La story ne change
  que l'affichage : la correction, les erreurs, « Je ne sais pas », l'aide et les étoiles restent celles du domaine
  (#18, #22, #23, #24), et les retours de #97 (effet sonore, étincelles) ne sont pas redécrits.
  Les commentaires « Décision 98.n » renvoient aux questions de docs/stories/98/acceptance.md. Les scénarios à valider
  par le PO portent un tag : ils dépendent d'une question encore ouverte (98.25 à 98.31).

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « faire glisser du doigt » : le geste glisser au toucher, sur la tablette et sur le téléphone (décision 98.17).
    La réponse qu'il produit reste un placement. Les scénarios sans précision de geste valent pour tous les gestes ;
  - « la maison » : l'interface d'un groupe de classer (décision n°24), dessinée en petite maison dont la porte
    s'ouvre et qui s'allume quand une étiquette y est bien rangée (décision 98.6). Le mot « maison » reste le même
    dans les 6 univers, à l'écran comme à la voix ;
  - « le dessin de l'univers » : la maison a un dessin propre à chaque univers (décision 98.2). Les scénarios ne
    décrivent jamais ce qui est dessiné : l'objet de chaque univers est choisi par le PO (question 98.25) et validé
    sur une planche, pas par un scénario ;
  - « s'allume » n'est jamais « brille » : « brille » reste réservé à la bonne réponse montrée après « Je ne sais pas »,
    de la même façon dans les 6 univers ;
  - « revient en glissant » : l'étiquette lâchée retourne à sa place parmi les étiquettes à poser par un mouvement,
    au lieu de réapparaître d'un coup ; durées pour l'implémentation et la review, jamais dans les étapes :
    chemin d'un objet vers sa cible de 150 à 400 ms, effet sonore de #97 parti en moins de 300 ms.

  Leçons de la bibliothèque utilisées, toutes déjà employées par d'autres stories : « Les sons ou, on, an »
  (classer « Les maisons des sons » : maisons « ou », « on », « an », 9 étiquettes, #18) ; « Les syllabes » (ordre
  « Le mot en morceaux » : « do », « mi », « no », #18). Leçons de test de #18 et #23 : l'exercice classer de deux
  étiquettes « loup » pour « ou » et « pont » pour « on », et l'exercice classer de « Je ne sais pas ».
  Les 6 univers et leur personnage guide (#6, #96) : Animaux de la forêt (Noisette), Princesses et fées (Lumi),
  Sports (Coach Léo), Police (Agent Max), Pompiers (Capitaine Sam), Danse (Lili).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt » : son
  personnage guide est Noisette. Quand Léa a choisi un autre univers, elle y garde son niveau CP.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Pour les mêmes réponses, l'habillage de jeu ne change rien : mêmes erreurs, même avancement de la séance, mêmes étoiles ; un exercice classer se termine au doigt comme au clavier seulement ; en séance de révision et au test de départ, une question de classer reste une question à choix

    Plan du Scénario: Léa range toutes les étiquettes <geste>, sans erreur, et gagne 3 étoiles
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose chaque étiquette dans sa maison <geste>
      Alors Léa voit 3 étoiles allumées sur 3
      Et l'écran indique en texte « 3 étoiles sur 3 »

      Exemples:
        | geste                                       |
        | en la faisant glisser du doigt              |
        | en la touchant, puis en touchant la maison  |
        | au clavier seulement                        |

    Plan du Scénario: Avec <erreurs> mauvais placement(s) faits en glissant du doigt, Léa gagne <résultat>, comme en touchant
      Étant donné qu'une leçon de test a un seul exercice classer de deux étiquettes, « loup » pour « ou » et « pont » pour « on »
      Et que Léa a fait glisser du doigt <erreurs> fois l'étiquette « loup » dans la maison « on »
      Et que Léa a ensuite posé « loup » dans « ou »
      Quand Léa fait glisser du doigt l'étiquette « pont » dans la maison « on »
      Alors Léa gagne <résultat>

      Exemples:
        | erreurs | résultat  |
        | 0       | 3 étoiles |
        | 1       | 2 étoiles |
        | 3       | 2 étoiles |
        | 4       | 1 étoile  |

    # Décision 98.18
    Plan du Scénario: <Où>, une question de classer reste une question à choix, sans étiquette à faire glisser
      Étant donné que <situation>
      Quand <début>
      Alors Léa voit la question « « loup » va dans quelle maison ? », avec les choix « ou », « on » et « an »
      Mais Léa ne voit aucune étiquette à faire glisser

      Exemples:
        | Où                    | situation                                                                                                   | début                                          |
        | En séance de révision | Léa a pour question retenue l'étiquette « loup » de l'exercice « Les maisons des sons », due aujourd'hui    | Léa commence la séance de révision             |
        | Au test de départ     | le test de départ de Léa pose la question de l'étiquette « loup » de l'exercice « Les maisons des sons »    | Léa arrive à cette question du test de départ  |

  Règle: Une étiquette de classer se glisse du doigt jusqu'à une maison ; seul un lâcher sur une maison est une réponse : lâchée ailleurs, elle revient à sa place sans coûter d'erreur ; toucher puis toucher et le clavier restent possibles, et une étiquette rangée ne se déplace plus

    # Décision 98.17
    Scénario: Glissée du doigt dans la maison « ou », l'étiquette « loup » y reste
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et Noisette applaudit en sautant
      Et il reste 8 étiquettes à poser

    # Décisions 98.17 et 98.24
    Scénario: Sur un écran de 360 px, Léa glisse du doigt une étiquette jusqu'à la dernière maison
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « dent » dans la maison « an »
      Alors l'étiquette « dent » reste dans la maison « an »
      Et la page tient dans la largeur de l'écran

    # Décision 98.20
    Scénario: Une étiquette qui passe au-dessus d'une maison, sans être lâchée, ne donne aucune réponse
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait passer du doigt l'étiquette « loup » au-dessus de la maison « on », sans la lâcher
      Alors l'étiquette « loup » suit le doigt de Léa
      Et la maison « on » se signale comme toute maison survolée, sans dire si c'est la bonne
      Mais Noisette ne dit aucun encouragement

    # Décision 98.11
    Scénario: Lâchée hors de toute maison, l'étiquette revient à sa place, sans encouragement
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » et la lâche hors de toute maison
      Alors l'étiquette « loup » revient en glissant jusqu'à sa place parmi les étiquettes à poser
      Et Noisette ne dit aucun encouragement
      Et il reste 9 étiquettes à poser

    # Décision 98.11
    Scénario: Lâchée hors de toute maison, l'étiquette ne fait entendre aucun son de réponse
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » et la lâche hors de toute maison
      Alors Léa n'entend pas l'effet sonore « réponse fausse »
      Et Léa n'entend pas l'effet sonore « réponse juste »

    # Décision 98.11
    Scénario: Lâcher 5 fois une étiquette hors de toute maison ne coûte aucune étoile
      Étant donné qu'une leçon de test a un seul exercice classer de deux étiquettes, « loup » pour « ou » et « pont » pour « on »
      Et que Léa a lâché 5 fois l'étiquette « loup » hors de toute maison
      Et que Léa a ensuite posé « loup » dans « ou »
      Quand Léa pose l'étiquette « pont » dans la maison « on »
      Alors Léa gagne 3 étoiles

    Scénario: Une étiquette rangée dans sa maison ne se déplace plus
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Et que Léa a rangé l'étiquette « loup » dans la maison « ou »
      Quand Léa essaie de faire glisser du doigt l'étiquette « loup » hors de la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et Noisette ne dit aucun encouragement

    # Décisions 98.8 et 98.22. Le glisser au doigt arrive avec cette tranche : il ne doit pas poser une étiquette
    # d'un ordre, qui se pose toujours en la touchant (le petit train viendra avec la tranche suivante, 98.30).
    Scénario: Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa essaie de faire glisser du doigt l'étiquette « do » vers les places à remplir
      Alors l'étiquette « do » reste parmi les étiquettes à poser
      Et aucune place n'est remplie
      Et Noisette ne dit aucun encouragement

    # Décision 98.15
    Scénario: Au clavier, les flèches passent d'une maison à l'autre
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou » au clavier, en passant d'une maison à l'autre avec les flèches
      Alors l'étiquette « loup » reste dans la maison « ou »

  Règle: Dans classer, la bonne maison ouvre sa porte, garde l'étiquette et s'allume ; dans une mauvaise maison, l'étiquette revient en glissant parmi les étiquettes à poser, avec l'encouragement de #18, sans retarder l'effet sonore de #97

    # Décision 98.6
    Scénario: Au début de l'exercice, les trois maisons sont fermées et éteintes
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa voit les maisons « ou », « on » et « an », et 9 étiquettes à poser
      Et les maisons « ou », « on » et « an » ont la porte fermée et sont éteintes

    # Décision 98.6
    Scénario: L'étiquette « loup » bien rangée fait ouvrir la porte de la maison « ou », qui s'allume
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et la porte de la maison « ou » s'ouvre, puis la maison s'allume
      Mais la maison « ou » ne brille pas comme une bonne réponse montrée

    # Décision 98.6
    Scénario: Glissée du doigt dans la mauvaise maison, l'étiquette revient en glissant, avec l'aide par défaut
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « on »
      Alors l'étiquette « loup » revient en glissant jusqu'à sa place parmi les étiquettes à poser
      Et Noisette dit un encouragement, suivi de « « loup » n'habite pas dans la maison « on ». Essaie une autre maison. »
      Et la porte de la maison « on » reste fermée

    Scénario: Le retour de l'étiquette ne retarde ni « réponse fausse » ni l'encouragement
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « on »
      Alors Léa entend l'effet sonore « réponse fausse », puis Noisette dit un encouragement
      Et l'effet sonore « réponse fausse » commence avant que l'étiquette « loup » soit revenue à sa place

  Règle: Dans chacun des 6 univers, les maisons de classer ont le dessin de cet univers ; changer d'univers ne change ni les gestes, ni les textes lus, ni les étoiles, ni la façon dont brille la bonne réponse montrée ; un profil sans univers connu voit les maisons de l'univers « Animaux de la forêt »

    # Décision 98.2 ; questions 98.30 et 98.31 (une maison de chaque univers dans cette tranche, la PR attend les 6)
    @a-valider
    Plan du Scénario: Dans l'univers « <univers> », les maisons ont le dessin de cet univers et s'annoncent toujours « Maison « … » »
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors les maisons « ou », « on » et « an » ont le dessin de l'univers « <univers> »
      Et les lecteurs d'écran annoncent « Maison « ou » », « Maison « on » » et « Maison « an » »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décisions 98.2, 98.6 et 98.17
    Plan du Scénario: Dans l'univers « <univers> », l'étiquette glissée du doigt dans la bonne maison fait ouvrir sa porte, et la maison s'allume
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et la porte de la maison « ou » s'ouvre, puis la maison s'allume
      Mais la maison « ou » ne brille pas comme une bonne réponse montrée

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision 98.2 : les textes lus et les voix restent les mêmes ; seul le personnage guide qui parle change (#6)
    Plan du Scénario: Dans l'univers « <univers> », une mauvaise maison fait dire à <personnage guide> la même aide que dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « on »
      Alors l'étiquette « loup » revient parmi les étiquettes à poser
      Et <personnage guide> dit un encouragement, suivi de « « loup » n'habite pas dans la maison « on ». Essaie une autre maison. »

      Exemples:
        | clé     | univers  | personnage guide |
        | sports  | Sports   | Coach Léo        |
        | police  | Police   | Agent Max        |

    # Décision 98.2
    Plan du Scénario: Dans l'univers « <univers> », un mauvais placement fait en glissant du doigt donne 2 étoiles, comme dans l'univers « Animaux de la forêt »
      Étant donné qu'une leçon de test a un seul exercice classer de deux étiquettes, « loup » pour « ou » et « pont » pour « on »
      Et que Léa a choisi l'univers <clé>
      Et que Léa a fait glisser du doigt 1 fois l'étiquette « loup » dans la maison « on »
      Et que Léa a ensuite posé « loup » dans « ou »
      Quand Léa fait glisser du doigt l'étiquette « pont » dans la maison « on »
      Alors Léa gagne 2 étoiles

      Exemples:
        | clé       | univers             |
        | princesse | Princesses et fées  |
        | pompier   | Pompiers            |

    # Décision 98.2 : le signal « bonne réponse montrée » est commun aux 6 univers
    Plan du Scénario: Dans l'univers « <univers> », la maison montrée par « Je ne sais pas » brille comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue un exercice classer d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors la bonne maison de l'étiquette choisie brille
      Et elle brille de la même façon que dans l'univers « Animaux de la forêt »
      Et aucune maison ne s'allume

      Exemples:
        | clé       | univers             |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Un profil enfant <cas> voit les maisons de l'univers « Animaux de la forêt »
      Étant donné que Léa a un profil enfant préparé <cas>
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors les maisons « ou », « on » et « an » ont le dessin de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                         |
        | sans univers                |
        | dont l'univers est inconnu  |

  Règle: « Je ne sais pas » montre toujours la bonne maison, reconnaissable dans le nouveau dessin et jamais confondue avec une maison allumée ; l'enfant y pose ensuite l'étiquette lui-même, au doigt ou au clavier

    Scénario: « Je ne sais pas » dans un exercice classer : la bonne maison brille, et aucune maison n'ouvre sa porte
      Étant donné que Léa joue un exercice classer d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors la bonne maison de l'étiquette choisie brille
      Et aucune maison n'ouvre sa porte
      Et Léa doit encore donner elle-même la bonne réponse

    Scénario: Après « Je ne sais pas », Léa glisse elle-même l'étiquette dans la maison qui brille
      Étant donné que Léa joue un exercice classer d'une leçon de test
      Et que Léa a dit « Je ne sais pas »
      Quand Léa fait glisser du doigt l'étiquette choisie dans la maison qui brille
      Alors l'étiquette choisie reste dans cette maison
      Et la maison ne brille plus : sa porte s'ouvre et elle s'allume

    Scénario: Après « Je ne sais pas », un mauvais placement fait en glissant ne coûte plus d'erreur
      Étant donné qu'une leçon de test a un seul exercice classer de deux étiquettes, « loup » pour « ou » et « pont » pour « on »
      Et que Léa a dit « Je ne sais pas » pour l'étiquette « loup »
      Et que Léa a ensuite fait glisser du doigt l'étiquette « loup » dans la maison « on », puis dans la maison « ou »
      Quand Léa pose l'étiquette « pont » dans la maison « on »
      Alors Léa gagne 2 étoiles

  Règle: Avec les mouvements réduits, rien ne glisse ni ne s'ouvre de lui-même, et l'information reste ; dans chacun des 6 univers, étiquettes et maisons gardent 44 px et tiennent à 360 px de large ; elles s'affichent en mode dys et gardent ce que lisent les lecteurs d'écran

    Plan du Scénario: Avec les mouvements réduits, <cas> se voit sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand <réponse de Léa>
      Alors <résultat>
      Et <sans mouvement>

      Exemples:
        | cas                                          | réponse de Léa                                                                  | résultat                                                  | sans mouvement                                           |
        | une étiquette bien rangée                    | Léa pose l'étiquette « loup » dans la maison « ou »                             | l'étiquette « loup » reste dans la maison « ou »          | la maison « ou » s'allume, sans que sa porte bouge       |
        | une étiquette posée dans la mauvaise maison  | Léa fait glisser du doigt l'étiquette « loup » dans la maison « on »            | l'étiquette « loup » revient parmi les étiquettes à poser | l'étiquette « loup » réapparaît à sa place, sans glisser |
        | une étiquette lâchée hors de toute maison    | Léa fait glisser du doigt l'étiquette « loup » et la lâche hors de toute maison | il reste 9 étiquettes à poser                             | l'étiquette « loup » réapparaît à sa place, sans glisser |

    # Décision 98.23
    Scénario: Avec les mouvements réduits, l'étiquette suit toujours le doigt de l'enfant
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »

    Scénario: Avec les mouvements réduits, la maison montrée par « Je ne sais pas » brille sans bouger
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue un exercice classer d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors la bonne maison de l'étiquette choisie brille
      Et aucune maison ne bouge

    # Décision 98.2 : la mise en page ne dépend pas de l'univers
    Plan du Scénario: Dans l'univers « <univers> », les maisons et les étiquettes tiennent dans un écran de 360 px et gardent 44 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou »
      Alors la page tient dans la largeur de l'écran
      Et chaque étiquette et chaque maison mesurent au moins 44 px de haut et de large

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision 98.2 : avec les mouvements réduits, aucun dessin d'univers ne bouge de lui-même
    Plan du Scénario: Dans l'univers « <univers> », avec les mouvements réduits, la maison bien rangée s'allume sans bouger
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et la maison « ou » s'allume, sans que sa porte bouge

      Exemples:
        | clé       | univers             |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: En mode dys, les étiquettes et le nom de chaque maison s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand Léa commence l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Alors Léa voit les étiquettes et le nom de chaque maison en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: Les lecteurs d'écran annoncent les maisons comme avant, sans décrire leur dessin
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors les lecteurs d'écran annoncent « Maison « ou » », « Maison « on » » et « Maison « an » »
      Mais les lecteurs d'écran n'annoncent ni porte, ni toit, ni lumière, ni l'univers du dessin
