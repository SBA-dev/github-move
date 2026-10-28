# language: fr
@issue-98 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : glisser les étiquettes, maisons et petit train
  En tant qu'enfant
  Je veux glisser mes étiquettes du doigt dans des maisons qui s'ouvrent, et accrocher les bonnes à un petit train
  Afin que ranger et remettre dans l'ordre ressemblent à un petit jeu, et d'avoir envie de faire la question suivante

  Tranche 98a de la story #98 (docs/stories/98/domain-model.md, « Proposition de découpage ») : le geste glisser
  au doigt et les invariants, pour les exercices classer, ordre et l'ordre des vers de memoriser. Les autres types
  d'exercices sont hors de cette tranche (98b à 98e). La story ne change que l'affichage : la correction, les erreurs,
  « Je ne sais pas », l'aide et les étoiles restent celles du domaine (#18, #22, #23, #24).
  Les commentaires « Question 98.n » renvoient aux questions ouvertes de docs/stories/98/acceptance.md ; les scénarios
  qui en dépendent portent le tag @a-valider. Les scénarios qui s'appuient sur un retour de #97 (effet sonore,
  étincelles) portent le tag @depend-de-97 : ils ne redécrivent pas ces retours.

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « faire glisser du doigt » : le geste glisser au toucher, sur la tablette et sur le téléphone (Question 98.17).
    La réponse qu'il produit reste un placement. Les scénarios sans précision de geste valent pour tous les gestes ;
  - « la maison » : l'interface d'un groupe de classer (décision n°24), dessinée en petite maison dont la porte
    s'ouvre et qui s'allume quand une étiquette y est bien rangée (Question 98.6) ;
  - « s'allume » n'est jamais « brille » : « brille » reste réservé à la bonne réponse montrée après « Je ne sais pas » ;
  - « le petit train », « un wagon » : l'interface des places d'un ordre et de l'ordre des vers (Question 98.1).
    Le petit train avance d'un wagon à chaque bon placement ;
  - « revient en glissant » : l'étiquette lâchée retourne à sa place parmi les étiquettes à poser par un mouvement,
    au lieu de réapparaître d'un coup ; durées pour l'implémentation et la review, jamais dans les étapes :
    chemin d'un objet vers sa cible de 150 à 400 ms, effet sonore de #97 parti en moins de 300 ms.

  Leçons de la bibliothèque utilisées, toutes déjà employées par d'autres stories : « Les sons ou, on, an »
  (classer « Les maisons des sons » : maisons « ou », « on », « an », 9 étiquettes, #18) ; « Les syllabes » (ordre
  « Le mot en morceaux » : « do », « mi », « no », #18) ; « Compter jusqu'à 100 » (ordre « De dix en dix » : « 10 »
  à « 100 », 10 étiquettes, la plus longue liste d'un ordre de la bibliothèque) ; « Poésie : La Cigale et la Fourmi »
  (memoriser « Le début de la fable », 6 vers, #22). Leçons de test de #18 et #23 : l'exercice classer de deux
  étiquettes « loup » pour « ou » et « pont » pour « on », et les exercices classer et ordre de « Je ne sais pas ».
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt » : son
  personnage guide est Noisette.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Pour les mêmes réponses, l'habillage de jeu ne change rien : mêmes erreurs, même avancement de la séance, mêmes étoiles ; un exercice classer, un ordre et l'ordre des vers se terminent au doigt comme au clavier seulement ; en séance de révision et au test de départ, une question de classer reste une question à choix

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

    Plan du Scénario: Léa remet « Le mot en morceaux » dans l'ordre <geste>, sans erreur, et gagne 3 étoiles
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose les étiquettes « do », « mi » puis « no » <geste>
      Alors Léa voit 3 étoiles allumées sur 3

      Exemples:
        | geste                 |
        | du doigt              |
        | au clavier seulement  |

    Plan du Scénario: Léa remet les 6 vers dans l'ordre <geste>, puis passe aux mots cachés
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa remet les 6 vers dans l'ordre <geste>
      Alors l'avancement de la séance montre 6 questions réussies sur 12
      Et Léa voit les vers joints par « / », avec un trou dans chaque vers

      Exemples:
        | geste                 |
        | du doigt              |
        | au clavier seulement  |

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

    # Question 98.18
    @a-valider
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

    # Question 98.17
    @a-valider
    Scénario: Glissée du doigt dans la maison « ou », l'étiquette « loup » y reste
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et Noisette applaudit en sautant
      Et il reste 8 étiquettes à poser

    # Questions 98.17 et 98.24
    @a-valider
    Scénario: Sur un écran de 360 px, Léa glisse du doigt une étiquette jusqu'à la dernière maison
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « dent » dans la maison « an »
      Alors l'étiquette « dent » reste dans la maison « an »
      Et la page tient dans la largeur de l'écran

    # Question 98.20
    @a-valider
    Scénario: Une étiquette qui passe au-dessus d'une maison, sans être lâchée, ne donne aucune réponse
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait passer du doigt l'étiquette « loup » au-dessus de la maison « on », sans la lâcher
      Alors l'étiquette « loup » suit le doigt de Léa
      Et la maison « on » se signale comme toute maison survolée, sans dire si c'est la bonne
      Mais Noisette ne dit aucun encouragement

    # Question 98.11
    @a-valider
    Scénario: Lâchée hors de toute maison, l'étiquette revient à sa place, sans encouragement
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » et la lâche hors de toute maison
      Alors l'étiquette « loup » revient en glissant jusqu'à sa place parmi les étiquettes à poser
      Et Noisette ne dit aucun encouragement
      Et il reste 9 étiquettes à poser

    # Question 98.11
    @a-valider @depend-de-97
    Scénario: Lâchée hors de toute maison, l'étiquette ne fait entendre aucun son de réponse
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » et la lâche hors de toute maison
      Alors Léa n'entend pas l'effet sonore « réponse fausse »
      Et Léa n'entend pas l'effet sonore « réponse juste »

    # Question 98.11
    @a-valider
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

    # Questions 98.8 et 98.22
    @a-valider
    Scénario: Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa essaie de faire glisser du doigt l'étiquette « do » jusqu'au petit train
      Alors l'étiquette « do » reste parmi les étiquettes à poser
      Et le petit train n'a aucun wagon
      Et Noisette ne dit aucun encouragement

    # Question 98.15
    @a-valider
    Scénario: Au clavier, les flèches passent d'une maison à l'autre
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou » au clavier, en passant d'une maison à l'autre avec les flèches
      Alors l'étiquette « loup » reste dans la maison « ou »

  Règle: Dans classer, la bonne maison ouvre sa porte, garde l'étiquette et s'allume ; dans une mauvaise maison, l'étiquette revient en glissant parmi les étiquettes à poser, avec l'encouragement de #18, sans retarder l'effet sonore de #97

    # Question 98.6
    @a-valider
    Scénario: Au début de l'exercice, les trois maisons sont fermées et éteintes
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa voit les maisons « ou », « on » et « an », et 9 étiquettes à poser
      Et les maisons « ou », « on » et « an » ont la porte fermée et sont éteintes

    # Question 98.6
    @a-valider
    Scénario: L'étiquette « loup » bien rangée fait ouvrir la porte de la maison « ou », qui s'allume
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et la porte de la maison « ou » s'ouvre, puis la maison s'allume
      Mais la maison « ou » ne brille pas comme une bonne réponse montrée

    # Question 98.6
    @a-valider
    Scénario: Glissée du doigt dans la mauvaise maison, l'étiquette revient en glissant, avec l'aide par défaut
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « on »
      Alors l'étiquette « loup » revient en glissant jusqu'à sa place parmi les étiquettes à poser
      Et Noisette dit un encouragement, suivi de « « loup » n'habite pas dans la maison « on ». Essaie une autre maison. »
      Et la porte de la maison « on » reste fermée

    @depend-de-97
    Scénario: Le retour de l'étiquette ne retarde ni « réponse fausse » ni l'encouragement
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa fait glisser du doigt l'étiquette « loup » dans la maison « on »
      Alors Léa entend l'effet sonore « réponse fausse », puis Noisette dit un encouragement
      Et l'effet sonore « réponse fausse » commence avant que l'étiquette « loup » soit revenue à sa place

  Règle: Dans un ordre et dans l'ordre des vers, chaque bonne étiquette s'accroche comme un wagon au petit train, qui avance d'un wagon ; une mauvaise étiquette ne s'accroche pas ; la dernière garde les étincelles de #97

    # Question 98.1
    @a-valider
    Scénario: La bonne première étiquette « do » devient le premier wagon du petit train
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors l'étiquette « do » prend la première place
      Et le petit train avance d'un wagon, avec « do » dans le premier wagon

    # Question 98.1
    @a-valider
    Scénario: La deuxième bonne étiquette s'accroche derrière la première
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa pose l'étiquette « mi »
      Alors le petit train a 2 wagons, « do » puis « mi »

    # Question 98.1
    @a-valider
    Scénario: Une mauvaise première étiquette ne s'accroche pas, et le petit train n'avance pas
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « mi »
      Alors l'étiquette « mi » revient parmi les étiquettes à poser
      Et le petit train n'a aucun wagon
      Et Noisette dit un encouragement, suivi de « Ce n'est pas le début. Lequel vient en premier ? »

    # Question 98.1
    @a-valider @depend-de-97
    Scénario: La dernière étiquette accroche le dernier wagon, puis les étincelles de #97 apparaissent
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé les étiquettes « do » et « mi »
      Quand Léa pose l'étiquette « no »
      Alors le petit train a 3 wagons, « do », « mi » puis « no »
      Et des étincelles apparaissent autour des étiquettes

    # Questions 98.1 et 98.21
    @a-valider
    Scénario: Le bon premier vers devient le premier wagon du petit train
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa pose le vers « La Cigale, ayant chanté » en premier
      Alors le vers « La Cigale, ayant chanté » devient le premier wagon du petit train
      Et le vers se lit en entier dans son wagon

  Règle: « Je ne sais pas » montre toujours la bonne maison ou l'étiquette qui vient ensuite, reconnaissable dans le nouveau dessin et jamais confondue avec une maison allumée ; l'enfant la pose ensuite lui-même, au doigt ou au clavier

    Plan du Scénario: « Je ne sais pas » dans un exercice <type> : <ce qui est montré>, et <ce qui ne bouge pas>
      Étant donné que Léa joue un exercice <type> d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors <ce qui est montré>
      Et <ce qui ne bouge pas>
      Et Léa doit encore donner elle-même la bonne réponse

      Exemples:
        | type    | ce qui est montré                              | ce qui ne bouge pas                     |
        | classer | la bonne maison de l'étiquette choisie brille  | aucune maison n'ouvre sa porte          |
        | ordre   | l'étiquette qui vient ensuite brille           | le petit train n'a aucun wagon          |

    Scénario: Après « Je ne sais pas », Léa glisse elle-même l'étiquette dans la maison qui brille
      Étant donné que Léa joue un exercice classer d'une leçon de test
      Et que Léa a dit « Je ne sais pas »
      Quand Léa fait glisser du doigt l'étiquette choisie dans la maison qui brille
      Alors l'étiquette choisie reste dans cette maison
      Et la maison ne brille plus : sa porte s'ouvre et elle s'allume

    Scénario: Après « Je ne sais pas », l'étiquette qui brille devient le premier wagon quand Léa la pose
      Étant donné que Léa joue un exercice ordre d'une leçon de test
      Et que Léa a dit « Je ne sais pas »
      Quand Léa pose l'étiquette qui brille
      Alors cette étiquette devient le premier wagon du petit train
      Et plus aucune étiquette ne brille

    Scénario: Après « Je ne sais pas », un mauvais placement fait en glissant ne coûte plus d'erreur
      Étant donné qu'une leçon de test a un seul exercice classer de deux étiquettes, « loup » pour « ou » et « pont » pour « on »
      Et que Léa a dit « Je ne sais pas » pour l'étiquette « loup »
      Et que Léa a ensuite fait glisser du doigt l'étiquette « loup » dans la maison « on », puis dans la maison « ou »
      Quand Léa pose l'étiquette « pont » dans la maison « on »
      Alors Léa gagne 2 étoiles

  Règle: Avec les mouvements réduits, rien ne glisse, ne s'ouvre ni ne roule de lui-même, et l'information reste ; étiquettes, maisons et wagons gardent 44 px, tiennent à 360 px de large, s'affichent en mode dys et gardent ce que lisent les lecteurs d'écran

    Plan du Scénario: Avec les mouvements réduits, <cas> se voit sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand <réponse de Léa>
      Alors <résultat>
      Et <sans mouvement>

      Exemples:
        | cas                                          | exercice             | leçon               | réponse de Léa                                                            | résultat                                                 | sans mouvement                                                       |
        | une étiquette bien rangée                    | Les maisons des sons | Les sons ou, on, an | Léa pose l'étiquette « loup » dans la maison « ou »                       | l'étiquette « loup » reste dans la maison « ou »         | la maison « ou » s'allume, sans que sa porte bouge                   |
        | une étiquette posée dans la mauvaise maison  | Les maisons des sons | Les sons ou, on, an | Léa fait glisser du doigt l'étiquette « loup » dans la maison « on »      | l'étiquette « loup » revient parmi les étiquettes à poser | l'étiquette « loup » réapparaît à sa place, sans glisser             |
        | une étiquette lâchée hors de toute maison    | Les maisons des sons | Les sons ou, on, an | Léa fait glisser du doigt l'étiquette « loup » et la lâche hors de toute maison | il reste 9 étiquettes à poser                       | l'étiquette « loup » réapparaît à sa place, sans glisser             |
        | une bonne étiquette d'un ordre               | Le mot en morceaux   | Les syllabes        | Léa pose l'étiquette « do »                                               | l'étiquette « do » prend la première place               | « do » apparaît dans le premier wagon, sans que le petit train roule |

    # Question 98.23
    @a-valider
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

    # Question 98.21
    @a-valider
    Scénario: À 360 px, le petit train de 10 wagons tient dans la largeur de l'écran
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue seulement l'exercice « De dix en dix » de la leçon « Compter jusqu'à 100 »
      Et que Léa a posé les étiquettes de « 10 » à « 90 »
      Quand Léa pose l'étiquette « 100 »
      Alors la page tient dans la largeur de l'écran
      Et chaque wagon mesure au moins 44 px de haut et de large

    # Question 98.21
    @a-valider
    Scénario: À 360 px, les vers accrochés au petit train se lisent en entier
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa remet dans l'ordre les vers de « Le début de la fable »
      Et que Léa a remis en place les quatre premiers vers
      Quand Léa pose le vers « Pas un seul petit morceau »
      Alors la page tient dans la largeur de l'écran
      Et chaque vers posé se lit en entier dans son wagon

    Plan du Scénario: En mode dys, <ce qui est vu> de « <exercice> » s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand Léa commence l'exercice « <exercice> » de la leçon « <leçon> »
      Alors Léa voit <ce qui est vu> en mode dys : police Andika, lettres, mots et lignes espacés

      Exemples:
        | exercice             | leçon               | ce qui est vu                              |
        | Les maisons des sons | Les sons ou, on, an | les étiquettes et le nom de chaque maison  |
        | Le mot en morceaux   | Les syllabes        | les étiquettes à poser                     |

    Scénario: Les lecteurs d'écran annoncent les maisons comme avant, sans décrire leur dessin
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors les lecteurs d'écran annoncent « Maison « ou » », « Maison « on » » et « Maison « an » »
      Mais les lecteurs d'écran n'annoncent ni porte, ni toit, ni lumière
