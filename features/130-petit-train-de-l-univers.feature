# language: fr
@issue-130 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : le petit train de l'univers
  En tant qu'enfant
  Je veux que les étiquettes à remettre dans l'ordre deviennent les wagons d'un petit train décoré comme mon univers
  Afin que reconstituer un mot, une suite de nombres ou un poème ressemble à un jeu

  Tranche 98a-train de la story #98 (docs/stories/130/domain-model.md). La story ne change que l'affichage des places
  d'un exercice ordre et de l'ordre des vers de memoriser : la correction, les erreurs, « Je ne sais pas », l'aide,
  l'avancement et les étoiles restent ceux du domaine (#18, #22, #23, #24), et les retours de #97 (effet sonore,
  rebond, étincelles) ne sont pas redécrits. Les scénarios de #18, #22, #23, #79 et #97 qui lisent les places restent
  vrais sans changement, comme celui de 98a sur le glisser refusé.
  En ordre, toucher suffit : il n'y a pas de glisser (décision 98.8).
  Ni la révision, ni le défi, ni le test de départ ne posent un ordre ou un memoriser : il n'y a rien à y habiller, et
  aucun scénario ne le décrit.
  Les commentaires « Décision 98.n » renvoient à docs/stories/98/acceptance.md ; les commentaires « Question #130.n »
  renvoient aux questions de docs/stories/130/domain-model.md (#130.1 à #130.9) et de docs/stories/130/acceptance.md
  (#130.10 et suivantes). Les scénarios marqués @a-valider sont écrits selon la recommandation de la question citée.

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « le petit train » : l'interface des places d'un ordre et de l'ordre des vers. Il a une tête (la locomotive),
    puis un wagon par étiquette posée. « Le petit train n'a aucun wagon » : aucune place n'est remplie ;
  - « un wagon » : une place remplie ; il porte le texte de l'étiquette posée. Le premier wagon est celui de la
    première place ;
  - « s'accroche », « avance d'un cran » : le wagon rejoint le train derrière le dernier wagon, et tout le train fait
    un petit mouvement vers l'avant, sans changer de place sur l'écran (question #130.2). « sans que le petit train
    roule » : rien ne bouge, le wagon est là d'un coup ;
  - « le dessin de l'univers » : la tête et les wagons ont un dessin propre à chaque univers (décision 98.26 : le même
    train, décoré). Les scénarios ne décrivent jamais ce qui est dessiné : c'est choisi par le PO (questions #130.1,
    #130.4, #130.6, #130.7) et validé sur une planche (98.28). « Petit train » et « wagon » restent justes dans les 6
    univers ; aucun dessin n'a de texte, de chiffre, d'étoile ni de personnage, et aucun n'est un coffre (98.6) :
    cela se vérifie sur la planche, pas par un scénario ;
  - « brille » reste réservé à la bonne réponse montrée après « Je ne sais pas », de la même façon dans les 6 univers.
  Durées pour l'implémentation et la review, jamais dans les étapes : accroche et cran d'avance en 400 ms au plus,
  après le rebond de #97 ; effet sonore de #97 parti en moins de 300 ms.

  Leçons de la bibliothèque utilisées, toutes du CP et déjà employées par d'autres stories : « Les syllabes » (ordre
  « Le mot en morceaux » : « do », « mi », « no », #18) ; « Compter jusqu'à 100 » (ordre « De dix en dix » : « 10 » à
  « 100 », 10 étiquettes, la plus longue liste d'un ordre de la bibliothèque) ; « Poésie : La Cigale et la Fourmi »
  (memoriser « Le début de la fable », 6 vers, de « La Cigale, ayant chanté » à « De mouche ou de vermisseau. », #22).
  Les 6 univers et leur personnage guide (#6, #96) : Animaux de la forêt (Noisette), Princesses et fées (Lumi),
  Sports (Coach Léo), Police (Agent Max), Pompiers (Capitaine Sam), Danse (Lili).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt ». Quand Léa a
  choisi un autre univers, elle y garde son niveau CP.
  Séance complète (délais longs) : les scénarios commentés « Séance complète » jouent un exercice jusqu'à ses étoiles.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Chaque bon placement accroche un wagon au petit train, derrière le dernier, et le train avance d'un cran ; le petit train a toujours autant de wagons que d'étiquettes posées, dans l'ordre ; la dernière étiquette d'un ordre garde les étincelles de #97 ; les étoiles et l'avancement restent ceux d'avant

    # Question #130.10 (reco : les places libres restent visibles, à la suite du train)
    @a-valider
    Scénario: Au début de l'exercice, le petit train n'a que sa tête, suivie des places libres
      Étant donné que Léa est sur la page de la leçon « Les syllabes »
      Quand Léa choisit seulement l'exercice « Le mot en morceaux »
      Alors Léa voit le petit train, sans aucun wagon, suivi de 3 places libres
      Et il reste 3 étiquettes à poser

    # Décision 98.1
    Scénario: La bonne première étiquette « do » devient le premier wagon du petit train
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors l'étiquette « do » prend la première place
      Et le petit train avance d'un cran, avec « do » dans le premier wagon

    # Décision 98.1
    Scénario: La deuxième bonne étiquette s'accroche derrière la première
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa pose l'étiquette « mi »
      Alors le petit train a 2 wagons, « do » puis « mi »

    # Question #130.2 (reco A : un petit à-coup vers l'avant, puis le train revient à sa place)
    @a-valider
    Scénario: En avançant d'un cran, le petit train ne change pas de place sur l'écran
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa pose l'étiquette « mi »
      Alors le petit train avance d'un cran, avec « mi » dans le deuxième wagon
      Et ensuite, la tête du petit train et le wagon « do » sont à la même place qu'avant

    # Question #130.3 (reco : l'étiquette rejoint son wagon par un petit chemin, puis s'accroche)
    @a-valider
    Scénario: L'étiquette touchée rejoint sa place au bout du petit train, puis s'y accroche
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors l'étiquette « do » rejoint le bout du petit train, puis s'y accroche comme premier wagon
      Et l'étiquette « do » n'est plus parmi les étiquettes à poser

    Scénario: À un bon placement, l'effet sonore « réponse juste » part avant que le wagon s'accroche
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors Léa entend l'effet sonore « réponse juste »
      Et l'effet sonore « réponse juste » commence avant que le wagon « do » s'accroche

    # Décision 98.1
    Scénario: La dernière étiquette accroche le dernier wagon, puis les étincelles de #97 apparaissent
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé les étiquettes « do » et « mi »
      Quand Léa pose l'étiquette « no »
      Alors le petit train a 3 wagons, « do », « mi » puis « no »
      Et des étincelles apparaissent autour des étiquettes

    # Question #130.6 (reco : aucune cheminée ne fume) ; aucun dessin ne bouge au repos
    @a-valider
    Scénario: Une fois le wagon accroché, le petit train reste immobile jusqu'au placement suivant
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors le petit train avance d'un cran, avec « do » dans le premier wagon
      Et ensuite, plus rien ne bouge sur le petit train tant que Léa ne pose pas d'autre étiquette

    # Décisions 98.1 et 98.21
    Scénario: Le bon premier vers devient le premier wagon du petit train
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa pose le vers « La Cigale, ayant chanté » en premier
      Alors le vers « La Cigale, ayant chanté » devient le premier wagon du petit train
      Et le vers se lit en entier dans son wagon

    # Le dernier vers n'est pas un exercice complété : la poésie continue avec les mots cachés (glossaire)
    Scénario: Le dernier vers accroche le sixième wagon, sans étincelles
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Et que Léa a remis en place les cinq premiers vers
      Quand Léa pose le vers « De mouche ou de vermisseau. »
      Alors le petit train a 6 wagons, de « La Cigale, ayant chanté » à « De mouche ou de vermisseau. »
      Mais aucune étincelle n'apparaît

    # Question #130.5 (reco A : le train complet reste à l'écran pendant la félicitation, avant les mots cachés)
    @a-valider
    Scénario: Après le dernier vers, le petit train complet reste à l'écran pendant la félicitation
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Et que Léa a remis en place les cinq premiers vers
      Quand Léa pose le vers « De mouche ou de vermisseau. »
      Alors Léa voit le petit train de 6 wagons pendant que Noisette dit une félicitation
      Et ensuite seulement, Léa voit les vers joints par « / », avec un trou dans chaque vers

    # Séance complète. Décision 98.8 : en ordre, toucher suffit
    Plan du Scénario: Léa remet « Le mot en morceaux » dans l'ordre <geste>, sans erreur, et gagne 3 étoiles
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose les étiquettes « do », « mi » puis « no » <geste>
      Alors Léa voit 3 étoiles allumées sur 3

      Exemples:
        | geste                 |
        | du doigt              |
        | au clavier seulement  |

    # Décision 98.8
    Plan du Scénario: Léa remet les 6 vers dans l'ordre <geste>, puis passe aux mots cachés
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa remet les 6 vers dans l'ordre <geste>
      Alors l'avancement de la séance montre 6 questions réussies sur 12
      Et Léa voit les vers joints par « / », avec un trou dans chaque vers

      Exemples:
        | geste                 |
        | du doigt              |
        | au clavier seulement  |

  Règle: Une mauvaise étiquette ne s'accroche pas : le petit train ne bouge pas, ne recule jamais et ne perd aucun wagon, avec la même aide qu'avant ; rien d'autre qu'un bon placement n'accroche un wagon : ni un glisser, ni un toucher sur le petit train, ni un toucher pendant la félicitation

    # Décision 98.1
    Scénario: Une mauvaise première étiquette ne s'accroche pas, et le petit train n'avance pas
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « mi »
      Alors l'étiquette « mi » revient parmi les étiquettes à poser
      Et le petit train n'a aucun wagon
      Et Noisette dit un encouragement, suivi de « Ce n'est pas le début. Lequel vient en premier ? »

    Scénario: Une mauvaise étiquette suivante ne s'accroche pas, et le petit train garde son wagon
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa pose l'étiquette « no »
      Alors l'étiquette « no » revient parmi les étiquettes à poser
      Et le petit train a toujours 1 wagon, « do »
      Et Noisette dit un encouragement, suivi de « Pas encore celui-là. Lequel vient juste après ? »

    Scénario: À une mauvaise étiquette, l'effet sonore « réponse fausse » part, et le petit train ne bouge pas
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa pose l'étiquette « no »
      Alors Léa entend l'effet sonore « réponse fausse », puis Noisette dit un encouragement
      Et le petit train ne bouge pas

    Scénario: Un mauvais premier vers ne s'accroche pas au petit train
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa pose le vers « Se trouva fort dépourvue » en premier
      Alors le vers revient parmi les vers à poser
      Et le petit train n'a aucun wagon
      Et Noisette dit un encouragement, suivi de « Ce n'est pas le début. Lequel vient en premier ? »

    # Décisions 98.8 et 98.22 (reprend le scénario de 98a avec le petit train)
    Scénario: Essayer de glisser une étiquette jusqu'au petit train ne la pose pas : on la touche
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa essaie de faire glisser du doigt l'étiquette « do » jusqu'au petit train
      Alors l'étiquette « do » reste parmi les étiquettes à poser
      Et le petit train n'a aucun wagon
      Et Noisette ne dit aucun encouragement

    Scénario: Toucher le petit train ne donne aucune réponse
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa touche le petit train
      Alors le petit train a toujours 1 wagon, « do »
      Et Noisette ne dit aucun encouragement
      Et Léa n'entend pas l'effet sonore « réponse fausse »

    # Décision 97.17
    Scénario: Pendant la félicitation, toucher le petit train complet ne change rien
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé les étiquettes « do » et « mi »
      Et que Léa a posé l'étiquette « no »
      Quand Léa touche le petit train pendant la félicitation
      Alors le petit train a toujours 3 wagons, « do », « mi » puis « no »
      Et Noisette dit une félicitation commune ou l'une de ses expressions, en entier

  Règle: « Je ne sais pas » ne pose rien : l'étiquette ou le vers qui vient ensuite brille parmi les étiquettes à poser, le petit train n'avance pas et rien ne brille sur lui ; c'est l'enfant qui la pose, et elle devient alors le wagon suivant

    Scénario: « Je ne sais pas » fait briller l'étiquette « do », et le petit train n'a aucun wagon
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa dit « Je ne sais pas »
      Alors l'étiquette « do » brille parmi les étiquettes à poser
      Et le petit train n'a aucun wagon
      Mais rien ne brille sur le petit train
      Et Léa doit encore donner elle-même la bonne réponse

    Scénario: Après « Je ne sais pas », l'étiquette qui brille devient le premier wagon quand Léa la pose
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a dit « Je ne sais pas »
      Quand Léa pose l'étiquette « do »
      Alors le petit train avance d'un cran, avec « do » dans le premier wagon
      Et plus aucune étiquette ne brille

    Scénario: « Je ne sais pas » au milieu de l'ordre fait briller l'étiquette suivante, et le petit train garde ses wagons
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa dit « Je ne sais pas »
      Alors l'étiquette « mi » brille parmi les étiquettes à poser
      Et le petit train a toujours 1 wagon, « do »

    Scénario: « Je ne sais pas » dans l'ordre des vers fait briller le premier vers, sans l'accrocher
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa dit « Je ne sais pas »
      Alors le vers « La Cigale, ayant chanté » brille parmi les vers à poser
      Et le petit train n'a aucun wagon
      Et Léa doit encore donner elle-même la bonne réponse

  Règle: À 360 px, le petit train passe à la ligne sans défilement horizontal, chaque wagon garde 44 px et un vers occupe un wagon sur toute la largeur ; la mise en page ne dépend pas de l'univers ; avec les mouvements réduits, rien ne roule ; le texte des wagons se lit en mode dys et à 4,5:1 ; les lecteurs d'écran lisent les mêmes textes qu'avant ; Muet ne coupe que la voix

    # Décision 98.21
    Plan du Scénario: Dans l'univers « <univers> », à 360 px, le petit train de 10 wagons passe à la ligne et tient dans la largeur de l'écran
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « De dix en dix » de la leçon « Compter jusqu'à 100 »
      Et que Léa a posé les étiquettes de « 10 » à « 90 »
      Quand Léa pose l'étiquette « 100 »
      Alors la page tient dans la largeur de l'écran
      Et chaque wagon mesure au moins 44 px de haut et de large

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision 98.21 ; question #130.13 (reco A : la tête à gauche, les wagons se lisent de gauche à droite)
    @a-valider
    Scénario: À 360 px, les wagons passés à la ligne se lisent dans l'ordre, de « 10 » à « 100 »
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue seulement l'exercice « De dix en dix » de la leçon « Compter jusqu'à 100 »
      Et que Léa a posé les étiquettes de « 10 » à « 90 »
      Quand Léa pose l'étiquette « 100 »
      Alors le petit train passe à la ligne
      Et ses 10 wagons se lisent dans l'ordre, de « 10 » à « 100 », de gauche à droite puis ligne après ligne

    # Décision 98.21
    Plan du Scénario: Dans l'univers « <univers> », à 360 px, chaque vers accroché se lit en entier, dans un wagon sur toute la largeur
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et que Léa remet dans l'ordre les vers de « Le début de la fable »
      Et que Léa a remis en place les quatre premiers vers
      Quand Léa pose le vers « Pas un seul petit morceau »
      Alors la page tient dans la largeur de l'écran
      Et chaque vers posé se lit en entier, dans un wagon sur toute la largeur du petit train

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: À 360 px, les étiquettes à poser et « Je ne sais pas » restent visibles sous le petit train
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue seulement l'exercice « De dix en dix » de la leçon « Compter jusqu'à 100 »
      Et que Léa a posé les étiquettes de « 10 » à « 50 »
      Quand Léa pose l'étiquette « 60 »
      Alors le petit train, les étiquettes à poser et « Je ne sais pas » se voient sans faire défiler l'écran de côté
      Et la page tient dans la largeur de l'écran

    Plan du Scénario: Dans l'univers « <univers> », avec les mouvements réduits, « do » apparaît dans le premier wagon, sans que le petit train roule
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors l'étiquette « do » prend la première place
      Et « do » apparaît dans le premier wagon, sans que le petit train roule

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: Avec les mouvements réduits, le bon vers apparaît dans son wagon, sans que le petit train roule
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa pose le vers « La Cigale, ayant chanté » en premier
      Alors « La Cigale, ayant chanté » apparaît dans le premier wagon, sans que le petit train roule

    Scénario: Avec les mouvements réduits, l'étiquette montrée par « Je ne sais pas » brille sans bouger
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa dit « Je ne sais pas »
      Alors l'étiquette « do » brille parmi les étiquettes à poser
      Et ni l'étiquette « do » ni le petit train ne bougent

    Plan du Scénario: Dans l'univers « <univers> », le texte de chaque wagon se lit sur son wagon
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa pose l'étiquette « mi »
      Alors le texte de chaque wagon se détache de son wagon avec un contraste d'au moins 4,5:1

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: En mode dys, les étiquettes à poser et le texte des wagons s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors Léa voit les étiquettes à poser et le texte des wagons en mode dys : police Andika, lettres, mots et lignes espacés

    # Décision 98.21 : en mode dys, un vers peut prendre plusieurs lignes dans son wagon
    Scénario: En mode dys, à 360 px, chaque vers accroché se lit en entier dans son wagon
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa remet dans l'ordre les vers de « Le début de la fable »
      Et que Léa a remis en place les quatre premiers vers
      Quand Léa pose le vers « Pas un seul petit morceau »
      Alors Léa voit les vers posés en mode dys : police Andika, lettres, mots et lignes espacés
      Et chaque vers posé se lit en entier, dans un wagon sur toute la largeur du petit train

    Plan du Scénario: Dans l'univers « <univers> », les lecteurs d'écran lisent les places comme avant, sans décrire le petit train
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors les lecteurs d'écran lisent la liste « Ordre des étiquettes » : « do », puis 2 fois « place libre »
      Mais les lecteurs d'écran n'annoncent ni la tête du petit train, ni ses roues, ni son décor, ni l'univers du dessin

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision 97.2 : le Muet coupe la voix du personnage guide, pas les effets sonores
    Scénario: En Muet, le wagon s'accroche de la même façon
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors le petit train avance d'un cran, avec « do » dans le premier wagon
      Et Léa entend l'effet sonore « réponse juste »

    Scénario: Aucun effet sonore nouveau n'accompagne le petit train qui avance
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors Léa entend l'effet sonore « réponse juste »
      Mais Léa n'entend aucun autre effet sonore pendant que le petit train avance

  Règle: Dans chacun des 6 univers, le même petit train a le dessin de cet univers ; changer d'univers ne change ni les gestes, ni les textes lus, ni les erreurs, ni les étoiles, ni la façon dont brille la bonne réponse montrée ; un profil sans univers connu voit le petit train de l'univers « Animaux de la forêt »

    # Décisions 98.26 et 98.31 (un petit train de chaque univers, la PR attend les 6)
    Plan du Scénario: Dans l'univers « <univers> », le petit train d'un ordre a le dessin de cet univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors le petit train avance d'un cran, avec « do » dans le premier wagon
      Et la tête du petit train et ses wagons ont le dessin de l'univers « <univers> »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Décision 98.26
    Plan du Scénario: Dans l'univers « <univers> », le petit train de l'ordre des vers a le dessin de cet univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa pose le vers « La Cigale, ayant chanté » en premier
      Alors le vers « La Cigale, ayant chanté » devient le premier wagon du petit train
      Et la tête du petit train et ses wagons ont le dessin de l'univers « <univers> »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Séance complète
    Plan du Scénario: Dans l'univers « <univers> », <erreurs> mauvais placement(s) dans « Le mot en morceaux » donnent <résultat>, comme avant
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a répondu faux <erreurs> fois à la première question
      Quand Léa termine l'exercice sans autre erreur
      Alors Léa gagne <résultat>

      Exemples:
        | clé       | univers             | erreurs | résultat  |
        | animaux   | Animaux de la forêt | 0       | 3 étoiles |
        | police    | Police              | 1       | 2 étoiles |
        | danse     | Danse               | 3       | 2 étoiles |
        | pompier   | Pompiers            | 4       | 1 étoile  |

    # Décision 98.2 : les textes lus et les voix restent les mêmes ; seul le personnage guide qui parle change (#6)
    Plan du Scénario: Dans l'univers « <univers> », une mauvaise étiquette fait dire à <personnage guide> la même aide que dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « mi »
      Alors le petit train n'a aucun wagon
      Et <personnage guide> dit un encouragement, suivi de « Ce n'est pas le début. Lequel vient en premier ? »

      Exemples:
        | clé     | univers  | personnage guide |
        | sports  | Sports   | Coach Léo        |
        | police  | Police   | Agent Max        |

    # Invariant 98-15 : le signal « bonne réponse montrée » est commun aux 6 univers, et rien sur le train ne lui ressemble
    Plan du Scénario: Dans l'univers « <univers> », l'étiquette montrée par « Je ne sais pas » brille comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa dit « Je ne sais pas »
      Alors l'étiquette « do » brille parmi les étiquettes à poser
      Et elle brille de la même façon que dans l'univers « Animaux de la forêt »
      Mais rien ne brille sur le petit train

      Exemples:
        | clé       | univers            |
        | princesse | Princesses et fées |
        | sports    | Sports             |
        | police    | Police             |
        | pompier   | Pompiers           |
        | danse     | Danse              |

    Plan du Scénario: Un profil enfant <cas> voit le petit train de l'univers « Animaux de la forêt »
      Étant donné que Léa a un profil enfant préparé <cas>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors la tête du petit train et ses wagons ont le dessin de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                        |
        | sans univers               |
        | dont l'univers est inconnu |
