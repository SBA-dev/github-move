# language: fr
@issue-129 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : les textes se dévoilent comme un parchemin de son univers
  En tant qu'enfant
  Je veux que le texte à lire se déroule comme un parchemin pendant que le personnage guide le lit
  Afin de suivre la lecture comme une aventure

  Tranche 98e de la story #98 (docs/stories/129/domain-model.md). La story ne change que l'affichage du texte d'une
  lecture et des vers d'une poésie pendant leur première lecture : la correction, les erreurs, « J'ai écouté »,
  « Je suis prêt », l'avancement et les étoiles restent ceux du domaine (#17, #22, #24), et la voix, le mot prononcé
  surligné et le vers mis en avant restent ceux de #7, #17 et #22, sans être redécrits.
  Les commentaires « Décision 98.n » renvoient à docs/stories/98/acceptance.md ; « Question #129.n » renvoie aux
  questions de docs/stories/129/acceptance.md. Les scénarios tagués @a-valider suivent la reco d'une question
  encore ouverte.

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « le parchemin » : le support dessiné du texte d'une lecture et des vers d'une poésie (décision n°30). Il n'est
    jamais lu ni annoncé ;
  - « le dessin de l'univers » : le parchemin a un dessin propre à chaque univers (règle 4). Les scénarios ne
    décrivent jamais ce qui est dessiné : l'objet de chaque univers est choisi par le PO (question #129.6) et
    validé sur une planche, pas par un scénario ;
  - « la première lecture » : la lecture que le personnage guide fait de lui-même quand l'exercice s'ouvre ;
  - « se dévoile », « apparaît » : une phrase ou un vers caché devient visible ; « caché » veut dire caché à l'œil
    seulement, la place et la lecture par les lecteurs d'écran restent (question #129.5) ;
  - « la phrase » : en lecture, l'unité du déroulement, coupée comme la lecture à voix haute (question #129.1). En
    poésie, on dit toujours « le vers », jamais « la ligne ».
  Durées pour l'implémentation et la review, jamais dans les étapes : chaque dévoilement tient en moins de 400 ms
  et ne retarde jamais la voix (invariant P3).

  Leçons de la bibliothèque utilisées, toutes déjà employées par d'autres stories : « Lecture : Le petit chat Plume »
  (fr-cp-lecture-petit-chat, exercice lecture « Le petit chat Plume », 6 phrases, 4 questions, #17 et #38) et
  « Poésie : La Cigale et la Fourmi » (fr-cp-poesie-cigale, exercice memoriser « Le début de la fable », 6 vers de
  Jean de La Fontaine, #22 et #38).
  Le texte « Le petit chat Plume » a 6 phrases : « Plume est un petit chat gris. », « Il dort sur le lit de Léa. »,
  « Un matin, Plume voit une souris. », « Il saute du lit, mais la souris file dans son trou. », « Plume est déçu. »,
  « Alors Léa lui donne du lait, et Plume ronronne. ».
  Les 6 vers de « Le début de la fable » : « La Cigale, ayant chanté », « Tout l'été, », « Se trouva fort dépourvue »,
  « Quand la bise fut venue : », « Pas un seul petit morceau », « De mouche ou de vermisseau. ».
  Les 6 univers et leur personnage guide (#6, #96) : Animaux de la forêt (Noisette), Princesses et fées (Lumi),
  Sports (Coach Léo), Police (Agent Max), Pompiers (Capitaine Sam), Danse (Lili).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt ». Quand Léa a
  choisi un autre univers, elle y garde son niveau CP.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Pendant la première lecture, le texte se déroule avec la voix : phrase après phrase en lecture, vers après vers en poésie ; le titre est visible dès l'ouverture ; ensuite, tout reste visible, pour les questions, pour redire et après « Réécouter » ; un toucher sur le parchemin ne fait rien

    Plan du Scénario: À l'ouverture de <exercice>, le titre est visible et le parchemin est encore roulé
      Étant donné que Léa est sur la page de la leçon « <leçon> »
      Quand Léa choisit seulement l'exercice « <titre de l'exercice> »
      Alors Léa voit « <titre affiché> »
      Mais <rien encore> n'est visible tant que Noisette <parole d'ouverture>

      Exemples:
        | exercice     | leçon                           | titre de l'exercice  | titre affiché                               | rien encore             | parole d'ouverture       |
        | une lecture  | Lecture : Le petit chat Plume   | Le petit chat Plume  | Le petit chat Plume                         | aucune phrase du texte  | présente l'histoire      |
        | une poésie   | Poésie : La Cigale et la Fourmi | Le début de la fable | Le début de la fable — Jean de La Fontaine  | aucun vers              | annonce l'écoute         |

    # Question #129.1 : en lecture, le texte se déroule phrase après phrase (reco)
    @a-valider
    Scénario: En lecture, chaque phrase apparaît en entier quand Noisette commence à la lire
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette lit le texte
      Alors chaque phrase du texte apparaît en entier quand Noisette commence à la lire
      Et les phrases que Noisette n'a pas encore commencées restent cachées
      Et chaque mot du texte est surligné au moment où Noisette le prononce

    # Question #129.1 : en lecture, le texte se déroule phrase après phrase (reco)
    @a-valider
    Plan du Scénario: Quand Noisette commence « <phrase lue> », les phrases d'avant sont visibles et la suivante est cachée
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette commence à lire la phrase « <phrase lue> »
      Alors les phrases <phrases visibles> sont visibles
      Mais la phrase « <phrase suivante> » n'est pas encore visible

      Exemples:
        | phrase lue                        | phrases visibles                                                                                       | phrase suivante                                      |
        | Plume est un petit chat gris.     | « Plume est un petit chat gris. »                                                                      | Il dort sur le lit de Léa.                           |
        | Un matin, Plume voit une souris.  | « Plume est un petit chat gris. », « Il dort sur le lit de Léa. » et « Un matin, Plume voit une souris. » | Il saute du lit, mais la souris file dans son trou. |

    Scénario: Quand Noisette a fini de lire le texte, tout le texte reste visible
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette a fini de lire le texte
      Alors tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et plus aucun mot n'est surligné quand la lecture est finie

    # Invariant P2 : aucun texte caché devant une question
    Plan du Scénario: Pendant les questions, tout le texte reste visible au-dessus de la question « <question> »
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Et que <avant>
      Quand <ouverture de la question>
      Alors tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et Léa voit toujours le texte « Plume est un petit chat gris. … » au-dessus de la question « <question> »

      Exemples:
        | question                      | avant                                                          | ouverture de la question                   |
        | De quelle couleur est Plume ? | Léa n'a pas encore dit qu'elle a écouté                        | Léa dit qu'elle a écouté                   |
        | Où dort Plume ?               | Léa a répondu « gris » à la question « De quelle couleur est Plume ? » | la question « Où dort Plume ? » s'affiche  |

    # Décision 98.12 : le parchemin ne cache le texte que pendant la première lecture
    Scénario: Après la première lecture, « Réécouter » ne cache aucune phrase
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa demande à réécouter
      Alors tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et aucune phrase ne se cache de nouveau pendant que Noisette relit

    # Question #129.4 : une reprise ne réenroule pas le parchemin (reco)
    @a-valider
    Scénario: En lecture, « Réécouter » pendant la première lecture ne cache pas les phrases déjà dévoilées
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Et que Noisette en est à la phrase « Un matin, Plume voit une souris. »
      Quand Léa demande à réécouter
      Alors les phrases « Plume est un petit chat gris. », « Il dort sur le lit de Léa. » et « Un matin, Plume voit une souris. » sont visibles
      Et ensuite, chaque phrase suivante apparaît en entier quand Noisette commence à la lire

    Scénario: En poésie, chaque vers apparaît quand Noisette commence à le lire
      Étant donné que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Quand Noisette lit la poésie vers par vers
      Alors chaque vers apparaît quand Noisette commence à le lire
      Et les vers que Noisette n'a pas encore commencés restent cachés
      Et chaque vers est mis en avant pendant que Noisette le lit

    Plan du Scénario: Quand Noisette commence le vers « <vers lu> », les vers d'avant sont visibles et le suivant est caché
      Étant donné que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Quand Noisette commence à lire le vers « <vers lu> »
      Alors les vers <vers visibles> sont visibles
      Mais le vers « <vers suivant> » n'est pas encore visible

      Exemples:
        | vers lu                  | vers visibles                                                                 | vers suivant               |
        | La Cigale, ayant chanté  | « La Cigale, ayant chanté »                                                   | Tout l'été,                |
        | Se trouva fort dépourvue | « La Cigale, ayant chanté », « Tout l'été, » et « Se trouva fort dépourvue » | Quand la bise fut venue :  |

    # Invariant P2 : tout est visible quand « Je suis prêt » apparaît
    Scénario: Quand Noisette a lu le dernier vers, les 6 vers restent visibles pour redire la poésie
      Étant donné que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Quand Noisette a lu le dernier vers
      Alors Léa voit les 6 vers, un par ligne
      Et Léa peut dire qu'elle est prête

    # Question #129.4 : une reprise ne réenroule pas le parchemin (reco)
    @a-valider
    Scénario: En poésie, « Réécouter » pendant l'écoute garde visibles les vers déjà dévoilés
      Étant donné que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Et que Noisette a lu les 3 premiers vers de « Le début de la fable »
      Quand Léa demande à réécouter
      Alors les vers « La Cigale, ayant chanté », « Tout l'été, » et « Se trouva fort dépourvue » sont visibles
      Et le vers « La Cigale, ayant chanté » est de nouveau mis en avant
      Et ensuite, le vers « Quand la bise fut venue : » apparaît quand Noisette commence à le lire

    # Décision 97.17 et règle 1 : seul « J'ai écouté » termine la lecture
    Plan du Scénario: Toucher le parchemin pendant <exercice> ne saute pas la lecture
      Étant donné que Léa joue seulement l'exercice « <titre de l'exercice> » de la leçon « <leçon> »
      Et que Noisette en est <où en est Noisette>
      Quand Léa touche le parchemin
      Alors Noisette continue de lire « <ce qui est lu> »
      Et <suivant> n'est pas encore visible
      Et Léa n'entend pas l'effet sonore « réponse fausse »

      Exemples:
        | exercice    | titre de l'exercice  | leçon                           | où en est Noisette                         | ce qui est lu               | suivant                                       |
        | une lecture | Le petit chat Plume  | Lecture : Le petit chat Plume   | à la phrase « Il dort sur le lit de Léa. » | Il dort sur le lit de Léa.  | la phrase « Un matin, Plume voit une souris. » |
        | une poésie  | Le début de la fable | Poésie : La Cigale et la Fourmi | au vers « Tout l'été, »                    | Tout l'été,                 | le vers « Se trouva fort dépourvue »          |

  Règle: Sans voix, tout le texte est visible tout de suite ; si la lecture s'arrête avant la fin, tout le texte s'ouvre aussitôt ; un enfant qui lit seul n'attend jamais la voix

    # Décision 98.12
    Plan du Scénario: En lecture, quand <cas>, tout le texte est visible dès l'ouverture de l'exercice
      Étant donné que <cas>
      Quand Léa commence l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Alors tout le texte est visible tout de suite, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et rien ne se déroule

      Exemples:
        | cas                                         |
        | la tablette est en Muet                     |
        | le navigateur bloque la voix                |
        | le navigateur ne sait pas lire à voix haute |

    # Décision 98.12
    Plan du Scénario: En poésie, quand <cas>, les 6 vers sont visibles dès l'ouverture de l'exercice
      Étant donné que <cas>
      Quand Léa commence l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Alors les 6 vers sont visibles tout de suite, de « La Cigale, ayant chanté » à « De mouche ou de vermisseau. »
      Et rien ne se déroule

      Exemples:
        | cas                                         |
        | la tablette est en Muet                     |
        | le navigateur bloque la voix                |
        | le navigateur ne sait pas lire à voix haute |

    # Question #129.3 : une lecture arrêtée avant la fin ouvre tout le texte (reco)
    @a-valider
    Plan du Scénario: En lecture, quand <arrêt> au milieu du texte, tout le texte s'ouvre aussitôt
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Et que Noisette en est à la phrase « Il dort sur le lit de Léa. »
      Quand <action>
      Alors tout le texte est visible aussitôt, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »

      Exemples:
        | arrêt                             | action                                               |
        | Léa dit qu'elle a écouté          | Léa dit qu'elle a écouté                             |
        | Léa passe en Muet                 | Léa passe en Muet                                    |
        | la voix est bloquée               | le navigateur bloque la voix pendant que Noisette lit |

    # Question #129.3 et invariant P2 : la question n'arrive jamais devant un texte caché
    @a-valider
    Scénario: « J'ai écouté » à la deuxième phrase : la première question s'affiche sous tout le texte
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Et que Noisette en est à la phrase « Il dort sur le lit de Léa. »
      Quand Léa dit qu'elle a écouté
      Alors la question « De quelle couleur est Plume ? » s'affiche avec les choix « gris », « noir » et « blanc »
      Et Léa voit toujours le texte « Plume est un petit chat gris. … » au-dessus de la question « De quelle couleur est Plume ? »
      Et tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »

    # Question #129.3 : une lecture arrêtée avant la fin ouvre tout le texte (reco)
    @a-valider
    Plan du Scénario: En poésie, quand <arrêt> pendant l'écoute, les 6 vers s'ouvrent aussitôt
      Étant donné que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Et que Noisette en est au vers « Tout l'été, »
      Quand <action>
      Alors les 6 vers sont visibles aussitôt, de « La Cigale, ayant chanté » à « De mouche ou de vermisseau. »

      Exemples:
        | arrêt               | action                                                |
        | Léa passe en Muet   | Léa passe en Muet                                     |
        | la voix est bloquée | le navigateur bloque la voix pendant que Noisette lit |

    # Question #129.2 : une voix qui ne signale pas les mots ouvre tout le texte (reco : après 2 secondes sans mot signalé)
    @a-valider
    Scénario: Si la voix lit sans signaler les mots, tout le texte s'ouvre sans attendre la fin de la lecture
      Étant donné que la voix de l'appareil lit sans signaler les mots qu'elle prononce
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette commence à lire le texte
      Alors tout le texte est visible bien avant la fin de la lecture, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et Léa entend toujours Noisette lire le texte jusqu'au bout

    # Invariant 12 de docs/stories/98/domain-model.md et décision 98.13 : même parchemin en séance de révision
    Scénario: En séance de révision, en Muet, tout le texte de la question de lecture est visible tout de suite
      Étant donné que la tablette est en Muet
      Et que Léa a pour question retenue la question « Où dort Plume ? » de l'exercice « Le petit chat Plume », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors tout le texte est visible tout de suite, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et rien ne se déroule

  Règle: Avec les mouvements réduits, tout le texte est visible tout de suite : rien ne se déroule, le mot prononcé reste surligné et le vers lu reste mis en avant ; si le réglage change pendant la lecture, tout s'ouvre

    Plan du Scénario: Avec les mouvements réduits, <contenu> est visible tout de suite, sans déroulement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue seulement l'exercice « <titre de l'exercice> » de la leçon « <leçon> »
      Quand <lecture>
      Alors <contenu> <visible tout de suite>
      Et rien ne se déroule
      Et <signal de la voix>

      Exemples:
        | contenu       | titre de l'exercice  | leçon                           | lecture                             | visible tout de suite                                                                                           | signal de la voix                                                     |
        | tout le texte | Le petit chat Plume  | Lecture : Le petit chat Plume   | Noisette lit le texte               | est visible tout de suite, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. » | chaque mot du texte est surligné au moment où Noisette le prononce    |
        | les 6 vers    | Le début de la fable | Poésie : La Cigale et la Fourmi | Noisette lit la poésie vers par vers | sont visibles tout de suite, de « La Cigale, ayant chanté » à « De mouche ou de vermisseau. »                     | chaque vers est mis en avant pendant que Noisette le lit              |

    Scénario: Si l'appareil passe aux mouvements réduits pendant la lecture, tout le texte s'ouvre aussitôt
      Étant donné que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Et que Noisette en est à la phrase « Il dort sur le lit de Léa. »
      Quand l'appareil se met à demander des mouvements réduits
      Alors tout le texte est visible aussitôt, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et Noisette continue de lire « Il dort sur le lit de Léa. »

  Règle: Dans chacun des 6 univers, le parchemin a le dessin de cet univers, en séance et en séance de révision ; le texte reste du texte, lisible, en mode dys aussi, et tient à 360 px ; changer d'univers ne change ni le texte, ni la voix, ni le déroulement, ni ce que lisent les lecteurs d'écran ; un profil sans univers connu voit le parchemin de l'univers « Animaux de la forêt »

    # Décisions 98.2 et 98.31 (la PR attend les 6 dessins validés). Question #129.6
    Plan du Scénario: Dans l'univers « <univers> », le texte d'une lecture est sur le parchemin de cet univers, et les lecteurs d'écran ne lisent que le texte
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand <personnage guide> a fini de lire le texte
      Alors le parchemin a le dessin de l'univers « <univers> »
      Et tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
      Et le décor du parchemin ne cache pas le texte
      Et les lecteurs d'écran lisent tout le texte, sans décrire le dessin du parchemin

      Exemples:
        | clé       | univers             | personnage guide |
        | animaux   | Animaux de la forêt | Noisette         |
        | princesse | Princesses et fées  | Lumi             |
        | sports    | Sports              | Coach Léo        |
        | police    | Police              | Agent Max        |
        | pompier   | Pompiers            | Capitaine Sam    |
        | danse     | Danse               | Lili             |

    # Décisions 98.2 et 98.31. Question #129.6
    Plan du Scénario: Dans l'univers « <univers> », les vers d'une poésie sont sur le parchemin de cet univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Quand <personnage guide> a lu le dernier vers
      Alors le parchemin a le dessin de l'univers « <univers> »
      Et Léa voit les 6 vers, un par ligne
      Et le décor du parchemin ne cache pas le texte

      Exemples:
        | clé       | univers             | personnage guide |
        | animaux   | Animaux de la forêt | Noisette         |
        | princesse | Princesses et fées  | Lumi             |
        | sports    | Sports              | Coach Léo        |
        | police    | Police              | Agent Max        |
        | pompier   | Pompiers            | Capitaine Sam    |
        | danse     | Danse               | Lili             |

    # Invariant P6 et question #129.1 : même déroulement dans les 6 univers
    @a-valider
    Plan du Scénario: Dans l'univers « <univers> », <personnage guide> lit le texte, qui se déroule phrase après phrase comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand <personnage guide> lit le texte
      Alors chaque phrase du texte apparaît en entier quand <personnage guide> commence à la lire
      Et chaque mot du texte est surligné au moment où <personnage guide> le prononce

      Exemples:
        | clé       | univers            | personnage guide |
        | princesse | Princesses et fées | Lumi             |
        | sports    | Sports             | Coach Léo        |
        | police    | Police             | Agent Max        |
        | pompier   | Pompiers           | Capitaine Sam    |
        | danse     | Danse              | Lili             |

    # Invariant I16 de docs/stories/98/domain-model.md
    Plan du Scénario: Un profil enfant <cas> voit le parchemin de l'univers « Animaux de la forêt »
      Étant donné que Léa a un profil enfant préparé <cas>
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Noisette a fini de lire le texte
      Alors le parchemin a le dessin de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                        |
        | sans univers               |
        | dont l'univers est inconnu |

    # Invariant 12 de docs/stories/98/domain-model.md et décision 98.13 : même parchemin en séance de révision
    Scénario: En séance de révision, le texte de la question de lecture est sur le parchemin de l'univers
      Étant donné que Léa a choisi l'univers sports
      Et que Léa a pour question retenue la question « Où dort Plume ? » de l'exercice « Le petit chat Plume », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors le parchemin a le dessin de l'univers « Sports »
      Et ensuite, tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »

    # Invariants I17 et I18 de docs/stories/98/domain-model.md : la mise en page ne dépend pas de l'univers
    Plan du Scénario: Dans l'univers « <univers> », sur un écran de 360 px, <contenu> tient dans la largeur et se lit en entier
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « <titre de l'exercice> » de la leçon « <leçon> »
      Quand <fin de la lecture>
      Alors la page tient dans la largeur de l'écran
      Et <contenu visible>
      Et le décor du parchemin ne cache pas le texte

      Exemples:
        | clé       | univers             | contenu       | titre de l'exercice | leçon                         | fin de la lecture                   | contenu visible                                                                                                 |
        | animaux   | Animaux de la forêt | le texte      | Le petit chat Plume | Lecture : Le petit chat Plume | Noisette a fini de lire le texte      | tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. » |
        | princesse | Princesses et fées  | le texte      | Le petit chat Plume | Lecture : Le petit chat Plume | Lumi a fini de lire le texte          | tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. » |
        | sports    | Sports              | le texte      | Le petit chat Plume | Lecture : Le petit chat Plume | Coach Léo a fini de lire le texte     | tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. » |
        | police    | Police              | le texte      | Le petit chat Plume | Lecture : Le petit chat Plume | Agent Max a fini de lire le texte     | tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. » |
        | pompier   | Pompiers            | le texte      | Le petit chat Plume | Lecture : Le petit chat Plume | Capitaine Sam a fini de lire le texte | tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. » |
        | danse     | Danse               | le texte      | Le petit chat Plume | Lecture : Le petit chat Plume | Lili a fini de lire le texte          | tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. » |

      Exemples:
        | clé       | univers             | contenu       | titre de l'exercice  | leçon                           | fin de la lecture             | contenu visible               |
        | sports    | Sports              | la poésie     | Le début de la fable | Poésie : La Cigale et la Fourmi | Coach Léo a lu le dernier vers     | Léa voit les 6 vers, un par ligne |
        | pompier   | Pompiers            | la poésie     | Le début de la fable | Poésie : La Cigale et la Fourmi | Capitaine Sam a lu le dernier vers | Léa voit les 6 vers, un par ligne |

    # Invariant I18 de docs/stories/98/domain-model.md : en mode dys, le décor du parchemin ne cache pas le texte
    Plan du Scénario: En mode dys, dans l'univers « <univers> », <contenu> s'affiche en mode dys sur le parchemin, sans que son décor cache le texte
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « <titre de l'exercice> » de la leçon « <leçon> »
      Quand <fin de la lecture>
      Alors Léa voit <ce qui est lu> en mode dys : police Andika, lettres, mots et lignes espacés
      Et le décor du parchemin ne cache pas le texte

      Exemples:
        | clé       | univers             | contenu    | titre de l'exercice  | leçon                           | fin de la lecture                | ce qui est lu |
        | animaux   | Animaux de la forêt | le texte   | Le petit chat Plume  | Lecture : Le petit chat Plume   | Noisette a fini de lire le texte | le texte      |
        | princesse | Princesses et fées  | le texte   | Le petit chat Plume  | Lecture : Le petit chat Plume   | Lumi a fini de lire le texte     | le texte      |
        | police    | Police              | le texte   | Le petit chat Plume  | Lecture : Le petit chat Plume   | Agent Max a fini de lire le texte | le texte     |
        | danse     | Danse               | la poésie  | Le début de la fable | Poésie : La Cigale et la Fourmi | Lili a lu le dernier vers        | les vers      |

  Règle: Le parchemin ne change ni la place du texte, ni ce que lisent les lecteurs d'écran, ni les erreurs, ni l'avancement, ni les étoiles ; il vaut aussi en séance de révision

    # Question #129.5 : la place de tout le texte est gardée dès l'ouverture (reco)
    @a-valider
    Plan du Scénario: Pendant que <contenu> se déroule, le parchemin a déjà sa taille finale et rien ne bouge sous le doigt
      Étant donné que Léa joue seulement l'exercice « <titre de l'exercice> » de la leçon « <leçon> »
      Quand <lecture>
      Alors le parchemin a, dès <premier dévoilement>, la hauteur qu'il a une fois tout le texte visible
      Et <bouton> ne bouge pas pendant que <contenu> se déroule

      Exemples:
        | contenu   | titre de l'exercice  | leçon                           | lecture                              | premier dévoilement | bouton           |
        | le texte  | Le petit chat Plume  | Lecture : Le petit chat Plume   | Noisette lit le texte                | la première phrase  | « J'ai écouté »  |
        | la poésie | Le début de la fable | Poésie : La Cigale et la Fourmi | Noisette lit la poésie vers par vers | le premier vers     | « Réécouter »    |

    # Question #129.5 et invariant P5 : les lecteurs d'écran lisent tout le texte, comme aujourd'hui (reco)
    @a-valider
    Plan du Scénario: Pendant que <contenu> se déroule, les lecteurs d'écran peuvent lire tout le texte
      Étant donné que Léa joue seulement l'exercice « <titre de l'exercice> » de la leçon « <leçon> »
      Quand Noisette commence à lire <début>
      Alors les lecteurs d'écran lisent tout le texte, sans décrire le dessin du parchemin
      Et les lecteurs d'écran n'annoncent aucun dévoilement

      Exemples:
        | contenu   | titre de l'exercice  | leçon                           | début                                    |
        | le texte  | Le petit chat Plume  | Lecture : Le petit chat Plume   | la phrase « Il dort sur le lit de Léa. » |
        | la poésie | Le début de la fable | Poésie : La Cigale et la Fourmi | le vers « Tout l'été, »                  |

    # Invariant I1 de docs/stories/98/domain-model.md : mêmes erreurs, mêmes étoiles. Chaque cas joue tout l'exercice (4 questions)
    Plan du Scénario: <cas>, Léa répond aux questions du texte <déroulé> et gagne <étoiles>, comme avant
      Étant donné que <contexte>
      Et que Léa joue seulement l'exercice « Le petit chat Plume » de la leçon « Lecture : Le petit chat Plume »
      Quand Léa répond aux questions du texte, <déroulé>
      Alors Léa gagne <étoiles>

      Exemples:
        | cas                             | contexte                                | déroulé                                      | étoiles   |
        | Dans l'univers Animaux de la forêt | Léa a choisi l'univers animaux          | sans erreur                                  | 3 étoiles |
        | Dans l'univers Danse            | Léa a choisi l'univers danse            | en se trompant une fois à « Où dort Plume ? » | 2 étoiles |
        | En Muet                         | la tablette est en Muet                 | sans erreur                                  | 3 étoiles |
        | Avec les mouvements réduits     | l'appareil demande des mouvements réduits | en se trompant une fois à « Où dort Plume ? » | 2 étoiles |

    # Invariant I1 : même avancement de la séance pendant le déroulement
    Plan du Scénario: Pendant que <contenu> se déroule, l'avancement de la séance ne change pas
      Étant donné que Léa joue seulement l'exercice « <titre de l'exercice> » de la leçon « <leçon> »
      Quand <lecture>
      Alors l'avancement de la séance montre 0 question réussie sur <total>

      Exemples:
        | contenu   | titre de l'exercice  | leçon                           | lecture                              | total |
        | le texte  | Le petit chat Plume  | Lecture : Le petit chat Plume   | Noisette lit le texte                | 4     |
        | la poésie | Le début de la fable | Poésie : La Cigale et la Fourmi | Noisette lit la poésie vers par vers | 12    |

    # Invariant 12 de docs/stories/98/domain-model.md, décision 98.13 et question #129.1
    @a-valider
    Scénario: En séance de révision, le texte de la question de lecture se déroule comme en séance
      Étant donné que Léa a pour question retenue la question « Où dort Plume ? » de l'exercice « Le petit chat Plume », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors chaque phrase du texte apparaît en entier quand Noisette commence à la lire
      Et les phrases que Noisette n'a pas encore commencées restent cachées
      Et ensuite, tout le texte est visible, de « Plume est un petit chat gris. » à « Alors Léa lui donne du lait, et Plume ronronne. »
