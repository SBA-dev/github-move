# language: fr
@issue-127 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : les maisons de l'addition posée
  En tant qu'enfant
  Je veux glisser mes chiffres du doigt dans les maisons de mon univers, les voir s'allumer quand mon calcul est juste,
  et voir la retenue sauter d'une maison à l'autre
  Afin que l'addition posée ressemble à un jeu dans mon univers

  Tranche 98c-addition de la story #98 (docs/stories/127/domain-model.md). Elle reprend le geste glisser au doigt de
  98a (#98) et l'applique à l'étape poser de l'addition posée (#20). La story ne change que l'affichage : la
  correction, les erreurs, « Je ne sais pas », l'aide, l'avancement et les étoiles restent ceux du domaine (#20, #23,
  #24), et les retours de #97 (effet sonore, rebond) ne sont pas redécrits. Les scénarios de
  features/20-calcul-fluence-addition-posee.feature restent vrais sans changement.
  Les bulles de choix de l'étape calculer sont hors périmètre (#126) : ici on y répond comme dans #20.
  Les commentaires « Question 127.n » renvoient aux questions de docs/stories/127/acceptance.md. Les questions 127.1
  à 127.11 ont été tranchées par le PO le 2026-11-02, toutes selon la recommandation.

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « la maison des unités » (des dizaines, des centaines) : l'interface d'une colonne (décision n°24), dessinée en
    tête de colonne. La réponse d'un chiffre posé reste un placement dans une colonne ; les étapes qui vérifient où
    reste un chiffre disent « colonne », comme dans #20 ;
  - « faire glisser du doigt » : le geste glisser au toucher de 98a. Les scénarios sans précision de geste valent pour
    tous les gestes ;
  - « s'allume » : la maison dont le chiffre vient d'être écrit à l'étape calculer. « s'allume » n'est jamais
    « brille » : « brille » reste réservé à la bonne réponse montrée après « Je ne sais pas » ;
  - « la retenue saute » : la retenue va, par un mouvement, de la maison dont le chiffre vient d'être écrit jusqu'en
    haut de la maison suivante. La parole du personnage guide garde « monte en retenue » ;
  - « le dessin de l'univers » : la maison et la retenue ont un dessin propre à chaque univers. Les scénarios ne
    décrivent jamais ce qui est dessiné (quelle maison, quel objet porte la retenue, quelle partie prend la couleur) :
    c'est choisi par le PO (questions 127.1, 127.2, 127.4) et validé sur une planche, pas par un scénario.
  Durées pour l'implémentation et la review, jamais dans les étapes : chemin d'un chiffre ou d'une retenue de 150 à
  400 ms, effet sonore de #97 parti en moins de 300 ms.

  Leçon de la bibliothèque utilisée, déjà employée par #20 : « Poser une addition en colonnes » (exercice « La leçon
  en action : 45 + 37 », à l'étape poser puis à l'étape calculer). Additions de leçons de test : « 45 + 65 » (trois
  colonnes, une retenue qui va dans la colonne des centaines), « 145 + 237 » (trois colonnes, pour l'écran de 360 px),
  « 123 + 45 » (aucune retenue).
  Les 6 univers et leur personnage guide (#6, #96) : Animaux de la forêt (Noisette), Princesses et fées (Lumi),
  Sports (Coach Léo), Police (Agent Max), Pompiers (Capitaine Sam), Danse (Lili).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt ». Quand Léa a
  choisi un autre univers, elle y garde son niveau CP.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Pour les mêmes réponses, l'habillage ne change rien : mêmes erreurs, même avancement, mêmes étoiles ; une addition posée se termine au doigt comme au clavier seulement ; en séance de révision et au test de départ, une addition reste un calcul en ligne

    Plan du Scénario: Léa pose chaque chiffre <geste>, calcule chaque colonne sans erreur, et gagne 3 étoiles
      Étant donné que Léa joue seulement l'exercice « La leçon en action : 45 + 37 » de la leçon « Poser une addition en colonnes »
      Quand Léa pose chaque chiffre dans sa maison <geste>, puis calcule chaque colonne sans erreur
      Alors Léa voit 3 étoiles allumées sur 3
      Et l'écran indique en texte « 3 étoiles sur 3 »

      Exemples:
        | geste                                      |
        | en le faisant glisser du doigt             |
        | en le touchant, puis en touchant la maison |
        | au clavier seulement                       |

    Plan du Scénario: Avec <erreurs> chiffre(s) glissé(s) du doigt dans la mauvaise maison, Léa gagne <résultat>, comme en touchant
      Étant donné que Léa joue seulement l'exercice « La leçon en action : 45 + 37 » de la leçon « Poser une addition en colonnes »
      Et que Léa a fait glisser du doigt <erreurs> fois le chiffre « 4 » de 45 dans la maison des unités
      Quand Léa termine l'exercice sans autre erreur
      Alors Léa gagne <résultat>

      Exemples:
        | erreurs | résultat  |
        | 0       | 3 étoiles |
        | 1       | 2 étoiles |
        | 3       | 2 étoiles |

    Scénario: Un chiffre glissé du doigt dans sa maison fait avancer la séance comme un chiffre touché
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 5 » de 45 dans la maison des unités
      Alors l'avancement de la séance montre 1 question réussie sur 6

    Plan du Scénario: <Où>, une addition reste un calcul en ligne, sans maison ni chiffre à faire glisser
      Étant donné que <situation>
      Quand <début>
      Alors Léa voit « 45 + 37 = ? »
      Mais Léa ne voit aucune maison ni aucun chiffre à faire glisser

      Exemples:
        | Où                    | situation                                                                                                                | début                                         |
        | En séance de révision | Léa a pour question retenue l'addition « 45 + 37 » de l'exercice « La leçon en action : 45 + 37 », due aujourd'hui       | Léa commence la séance de révision            |
        | Au test de départ     | le test de départ de Léa pose la question de l'addition « 45 + 37 »                                                      | Léa arrive à cette question du test de départ |

  Règle: À l'étape poser, un chiffre se glisse du doigt jusqu'à une maison ; seul un lâcher sur une maison est une réponse : lâché ailleurs, il revient à sa place sans coûter d'erreur ; toucher puis toucher et le clavier restent possibles, et un chiffre posé ne se déplace plus

    Plan du Scénario: Le chiffre « 5 » de 45 se pose dans la maison des unités <geste>
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa pose le chiffre « 5 » de 45 dans la maison des unités <geste>
      Alors le chiffre « 5 » reste dans la colonne des unités
      Et Noisette applaudit en sautant

      Exemples:
        | geste                                      |
        | en le faisant glisser du doigt             |
        | en le touchant, puis en touchant la maison |
        | au clavier seulement                       |

    Scénario: Glissé du doigt dans la mauvaise maison, le chiffre revient en glissant, avec l'aide de son rang
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 4 » de 45 dans la maison des unités
      Alors le chiffre « 4 » revient en glissant jusqu'à sa place parmi les chiffres à poser
      Et Noisette dit un encouragement, suivi de « Dans 45, le 4 est le chiffre des dizaines : il va dans la maison rose. »
      Et la porte de la maison des unités reste fermée

    Scénario: Le retour du chiffre ne retarde ni « réponse fausse » ni l'encouragement
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 4 » de 45 dans la maison des unités
      Alors Léa entend l'effet sonore « réponse fausse », puis Noisette dit un encouragement
      Et l'effet sonore « réponse fausse » commence avant que le chiffre « 4 » soit revenu à sa place

    Scénario: Un chiffre qui passe au-dessus d'une maison, sans être lâché, ne donne aucune réponse
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait passer du doigt le chiffre « 4 » de 45 au-dessus de la maison des unités, sans le lâcher
      Alors le chiffre « 4 » suit le doigt de Léa
      Et la maison des unités se signale comme toute maison survolée, sans dire si c'est la bonne
      Mais aucune maison ne s'allume
      Et Noisette ne dit aucun encouragement

    Scénario: Lâché hors de toute maison, le chiffre revient à sa place, sans encouragement
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 5 » de 45 et le lâche hors de toute maison
      Alors le chiffre « 5 » revient en glissant jusqu'à sa place parmi les chiffres à poser
      Et Noisette ne dit aucun encouragement
      Et il reste 4 chiffres à poser

    Scénario: Lâché hors de toute maison, le chiffre ne fait entendre aucun son de réponse
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 5 » de 45 et le lâche hors de toute maison
      Alors Léa n'entend pas l'effet sonore « réponse fausse »
      Et Léa n'entend pas l'effet sonore « réponse juste »

    Scénario: Lâcher 5 fois un chiffre hors de toute maison ne coûte aucune étoile
      Étant donné que Léa joue seulement l'exercice « La leçon en action : 45 + 37 » de la leçon « Poser une addition en colonnes »
      Et que Léa a lâché 5 fois le chiffre « 4 » de 45 hors de toute maison
      Quand Léa termine l'exercice sans autre erreur
      Alors Léa gagne 3 étoiles

    Scénario: Un chiffre posé dans sa maison ne se déplace plus
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Et que Léa a posé le chiffre « 5 » de 45 dans la colonne des unités
      Quand Léa essaie de faire glisser du doigt le chiffre « 5 » hors de la maison des unités
      Alors le chiffre « 5 » reste dans la colonne des unités
      Et Noisette ne dit aucun encouragement

    Scénario: À l'étape calculer, toucher une maison ne donne aucune réponse
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa touche la maison des unités
      Alors la colonne des unités est à calculer
      Et la maison des unités reste éteinte
      Et Noisette ne dit aucun encouragement

  Règle: À l'étape calculer, une maison s'allume quand le chiffre de sa colonne est juste, jamais avant, jamais au survol, jamais à cause de « Je ne sais pas » ; une maison allumée ne brille pas comme une bonne réponse montrée

    Scénario: La colonne des unités juste fait s'allumer la maison des unités
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la maison des unités s'allume
      Mais la maison des unités ne brille pas comme une bonne réponse montrée
      Et la maison des dizaines reste éteinte

    Scénario: Une somme fausse laisse la maison éteinte et donne une nouvelle chance
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 13 » pour la colonne des unités
      Alors la maison des unités reste éteinte
      Et Noisette dit un encouragement
      Et la colonne des unités est à calculer

    Scénario: La dernière colonne juste allume la dernière maison : toutes les maisons sont allumées
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Quand Léa répond « 8 » pour la colonne des dizaines
      Alors Léa voit le résultat « 82 »
      Et les maisons des unités et des dizaines sont allumées

    Scénario: « Je ne sais pas » à l'étape calculer montre la bonne somme, sans allumer la maison
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 12 » reste, et il brille
      Mais la maison des unités reste éteinte

    Scénario: « Je ne sais pas » à l'étape poser fait briller la bonne maison, sans en allumer aucune
      Étant donné que Léa joue un exercice addition à l'étape poser d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors la bonne colonne du chiffre choisi brille
      Et aucune maison ne s'allume
      Et Léa doit encore donner elle-même la bonne réponse

    # Question 127.3 (tranchée : A) : à l'étape poser, la porte s'ouvre et la maison reste éteinte
    Scénario: À l'étape poser, un chiffre juste fait ouvrir la porte de sa maison, qui reste éteinte
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa pose le chiffre « 5 » de 45 dans la colonne des unités
      Alors la porte de la maison des unités s'ouvre
      Mais la maison des unités reste éteinte

    # Question 127.3 (tranchée : A)
    Scénario: Au début de l'étape calculer, aucune maison n'est allumée
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Et que Léa a posé le nombre 45
      Quand Léa pose les chiffres de 37 dans leurs colonnes
      Alors la colonne des unités est à calculer
      Et aucune maison ne s'allume

  Règle: La retenue posée par le domaine saute de la maison dont le chiffre vient d'être écrit jusqu'en haut de la maison suivante ; sans retenue, rien ne saute ; le saut ne retarde ni l'effet sonore, ni la parole, ni la suite

    Scénario: La retenue « 1 » saute de la maison des unités jusqu'en haut de la maison des dizaines
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la retenue « 1 » saute de la maison des unités jusqu'en haut de la maison des dizaines
      Et Léa voit « 2 » écrit sous la colonne des unités, et la retenue « 1 » en haut de la colonne des dizaines
      Et Noisette dit « 12, c'est 1 dizaine et 2 unités ! J'écris 2, et 1 monte en retenue. »

    Scénario: La retenue « 1 » saute de la maison des dizaines jusqu'en haut de la maison des centaines
      Étant donné qu'une leçon de test a une addition posée « 45 + 65 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Quand Léa répond « 11 » pour la colonne des dizaines
      Alors la retenue « 1 » saute de la maison des dizaines jusqu'en haut de la maison des centaines
      Et Léa voit « 1 » écrit sous la colonne des dizaines, et la retenue « 1 » en haut de la colonne des centaines

    Scénario: Une colonne dont la somme est plus petite que 10 ne fait sauter aucune retenue
      Étant donné qu'une leçon de test a une addition posée « 123 + 45 » à l'étape calculer
      Quand Léa répond « 8 » pour la colonne des unités
      Alors Léa voit « 8 » écrit sous la colonne des unités
      Mais aucune retenue ne saute
      Et aucune retenue n'apparaît en haut de la maison des dizaines

    Scénario: La dernière colonne écrit toute sa somme, sans faire sauter de retenue ni ajouter de maison
      Étant donné qu'une leçon de test a une addition posée « 45 + 65 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Et que Léa a calculé la colonne des dizaines
      Quand Léa répond « 1 » pour la colonne des centaines
      Alors Léa voit le résultat « 110 »
      Mais aucune retenue ne saute
      Et Léa voit toujours 3 maisons

    Scénario: Une somme fausse ne fait sauter aucune retenue
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 13 » pour la colonne des unités
      Alors aucune retenue ne saute
      Et aucune retenue n'apparaît en haut de la maison des dizaines

    # Question 127.5 (tranchée : A ; le saut ne retarde jamais l'effet sonore de #97)
    Scénario: Le saut de la retenue ne retarde pas l'effet sonore « réponse juste »
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors Léa entend l'effet sonore « réponse juste »
      Et l'effet sonore « réponse juste » commence avant que la retenue « 1 » ait fini de sauter

    # Question 127.5 (tranchée : A) : la retenue saute tout de suite après le rebond, sans attendre la voix
    Scénario: La retenue saute sans attendre la parole du personnage guide
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la retenue « 1 » saute de la maison des unités jusqu'en haut de la maison des dizaines
      Et le saut commence avant que Noisette dise « monte en retenue »

    # Question 127.5 (tranchée : A)
    Scénario: En Muet, la retenue saute de la même façon
      Étant donné que la tablette est en Muet
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la retenue « 1 » saute de la maison des unités jusqu'en haut de la maison des dizaines

  Règle: Dans chacun des 6 univers, la maison et la retenue ont le dessin de cet univers, et les colonnes gardent leurs couleurs (unités bleue, dizaines rose, centaines verte) ; changer d'univers ne change ni les gestes, ni les textes lus, ni les étoiles, ni la façon dont brille la bonne réponse montrée ; un profil sans univers connu voit les dessins de l'univers « Animaux de la forêt »

    Plan du Scénario: Dans l'univers « <univers> », les maisons gardent les couleurs des colonnes
      Étant donné que Léa a choisi l'univers <clé>
      Et qu'une leçon de test a une addition posée « 45 + 65 » à l'étape poser
      Quand Léa commence cet exercice
      Alors Léa voit, de gauche à droite, la maison des centaines en vert, la maison des dizaines en rose et la maison des unités en bleu

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », la retenue ne prend jamais la couleur d'une autre maison
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la retenue « 1 » en haut de la maison des dizaines n'est ni bleue ni verte

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », la maison et la retenue ont le dessin de cet univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors les maisons des unités et des dizaines ont le dessin de l'univers « <univers> »
      Et la retenue « 1 » a le dessin de l'univers « <univers> »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », la retenue saute de la maison des unités jusqu'en haut de la maison des dizaines
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la maison des unités s'allume
      Et la retenue « 1 » saute de la maison des unités jusqu'en haut de la maison des dizaines

      Exemples:
        | clé       | univers             |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », un chiffre dans la mauvaise maison fait dire à <personnage guide> la même aide, avec la même couleur de maison
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 4 » de 45 dans la maison des unités
      Alors le chiffre « 4 » revient parmi les chiffres à poser
      Et <personnage guide> dit un encouragement, suivi de « Dans 45, le 4 est le chiffre des dizaines : il va dans la maison rose. »

      Exemples:
        | clé     | univers  | personnage guide |
        | sports  | Sports   | Coach Léo        |
        | police  | Police   | Agent Max        |

    Plan du Scénario: Dans l'univers « <univers> », un chiffre glissé dans la mauvaise maison donne 2 étoiles, comme dans l'univers « Animaux de la forêt »
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « La leçon en action : 45 + 37 » de la leçon « Poser une addition en colonnes »
      Et que Léa a fait glisser du doigt 1 fois le chiffre « 4 » de 45 dans la maison des unités
      Quand Léa termine l'exercice sans autre erreur
      Alors Léa gagne 2 étoiles

      Exemples:
        | clé       | univers             |
        | princesse | Princesses et fées  |
        | pompier   | Pompiers            |

    Plan du Scénario: Dans l'univers « <univers> », la maison montrée par « Je ne sais pas » brille comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue un exercice addition à l'étape poser d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors la bonne colonne du chiffre choisi brille
      Et elle brille de la même façon que dans l'univers « Animaux de la forêt »
      Et aucune maison ne s'allume

      Exemples:
        | clé       | univers             |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Un profil enfant <cas> voit la maison et la retenue de l'univers « Animaux de la forêt »
      Étant donné que Léa a un profil enfant préparé <cas>
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors les maisons des unités et des dizaines ont le dessin de l'univers « Animaux de la forêt »
      Et la retenue « 1 » a le dessin de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                        |
        | sans univers               |
        | dont l'univers est inconnu |

  Règle: Avec les mouvements réduits, rien ne glisse, ne saute ni ne s'ouvre de lui-même, et l'information reste ; dans chacun des 6 univers, une addition à trois colonnes tient à 360 px de large avec des cibles de 44 px ; chiffres, noms des maisons et retenue s'affichent en mode dys ; les lecteurs d'écran lisent les mêmes libellés qu'avant

    Plan du Scénario: Dans l'univers « <univers> », avec les mouvements réduits, la maison s'allume et la retenue apparaît en haut de la maison, sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la retenue « 1 » apparaît en haut de la colonne des dizaines, sans mouvement
      Et la maison des unités s'allume, sans que sa porte bouge

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: Avec les mouvements réduits, un chiffre posé dans la mauvaise maison réapparaît à sa place, sans glisser
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 4 » de 45 dans la maison des unités
      Alors le chiffre « 4 » revient parmi les chiffres à poser
      Et le chiffre « 4 » réapparaît à sa place, sans glisser

    Scénario: Avec les mouvements réduits, le chiffre suit toujours le doigt de l'enfant
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 5 » de 45 dans la maison des unités
      Alors le chiffre « 5 » reste dans la colonne des unités

    Scénario: Sur un écran de 360 px, Léa glisse du doigt un chiffre jusqu'à la maison des centaines
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et qu'une leçon de test a une addition posée « 145 + 237 » à l'étape poser
      Quand Léa fait glisser du doigt le chiffre « 1 » de 145 dans la maison des centaines
      Alors le chiffre « 1 » reste dans la colonne des centaines
      Et la page tient dans la largeur de l'écran

    Plan du Scénario: Dans l'univers « <univers> », une addition à trois colonnes tient dans un écran de 360 px et garde des cibles de 44 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et qu'une leçon de test a une addition posée « 145 + 237 » à l'étape poser
      Quand Léa commence cet exercice
      Alors la page tient dans la largeur de l'écran
      Et chaque maison et chaque chiffre à poser mesurent au moins 44 px de haut et de large
      Et les trois maisons, les chiffres à poser et « Je ne sais pas » se voient sans faire défiler l'écran

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: Sur un écran de 360 px, la retenue et le chiffre écrit restent lisibles dans une addition à trois colonnes
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et qu'une leçon de test a une addition posée « 145 + 237 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors Léa voit « 2 » écrit sous la colonne des unités, et la retenue « 1 » en haut de la colonne des dizaines
      Et la page tient dans la largeur de l'écran

    Scénario: En mode dys, les chiffres à poser et le nom de chaque maison s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand Léa commence l'exercice « La leçon en action : 45 + 37 » de la leçon « Poser une addition en colonnes »
      Alors Léa voit les chiffres à poser et le nom de chaque maison en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: En mode dys, le chiffre de la retenue reste un texte affiché en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors Léa voit la retenue « 1 » en mode dys : police Andika

    Plan du Scénario: Dans l'univers « <univers> », les lecteurs d'écran lisent les maisons et la retenue comme avant, sans décrire leur dessin
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors les lecteurs d'écran annoncent « Colonne des dizaines », « Colonne des unités » et « Retenue 1 »
      Mais les lecteurs d'écran n'annoncent ni porte, ni toit, ni lumière, ni l'univers du dessin

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |
