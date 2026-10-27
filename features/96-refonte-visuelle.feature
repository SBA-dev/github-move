# language: fr
@issue-96 @wip
Fonctionnalité: Refonte visuelle de l'application de l'enfant
  En tant qu'enfant
  Je veux une application colorée et vivante, qui ressemble à mon univers
  Afin d'avoir l'impression d'entrer dans un jeu

  La story change seulement l'affichage : aucune règle du domaine (étoiles, parcours, révisions, épisodes) ne bouge,
  sauf le nom du personnage guide de l'univers « Police », qui devient Agent Max (réponse 96.5 du PO).
  Direction artistique (réponses du PO sur #95 et sur #96, 2026-10-27) : aventure cartoon, dans le style de dessin
  de Coach Léo (docs/maquettes/) ; boutons épais en relief qui s'enfoncent, cartes en « panneaux d'aventure » ;
  titres en Baloo 2, texte en Andika, tout en Andika en mode dys ; pas de mode sombre.

  Mots employés dans ces scénarios :
  - « écrans de l'enfant » (glossaire, #73) : l'accueil de l'enfant, « Mon parcours », « Toutes les leçons »,
    « Mes médailles », la page de la leçon, la séance et sa fin, le test de départ ; la séance de révision et
    l'épisode sont à confirmer (question #96.7) ;
  - « Léa ouvre tour à tour chaque écran de l'enfant » : elle passe par tous ces écrans, dans l'ordre de la liste ;
  - « en glissant » : l'écran qui arrive glisse sur le côté, dans le sens où l'on avance (accueil, « Mon parcours »,
    page de la leçon, séance), dans l'autre sens quand on revient ; « en fondu » : il apparaît en fondu ;
    dans les deux cas en 300 ms au plus (réponse 96.6 du PO) ;
  - « paysage », « couleur principale », « mouvements réduits » : mots d'interface (décision n°16 du glossaire) ;
  - « dessin validé » : le dessin fixe du personnage guide dans sa maquette validée par le PO (docs/maquettes/) ;
  - « capture de référence » : image d'un écran clé, validée par le PO, à laquelle l'écran est comparé
    (tests visuels, réponse 5 du PO sur #95) ; ces scénarios portent le tag @visuel pour être lancés à part.

  Leçon de la bibliothèque utilisée : « Les sons ou, on, an » (première leçon de français du CP, avec son
  exercice bulles « Quel son entends-tu ? »). La question de test « Combien font 3 + 4 ? » est celle de #6
  (choix « 6 », « 7 », « 8 » et « 9 », de réponse « 7 »).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP.

  Contexte:
    Étant donné que Paul est connecté sur la tablette

  Règle: Chaque écran de l'enfant prend la couleur principale de l'univers choisi, et tout son texte reste lisible

    Plan du Scénario: Dans l'univers « <univers> », la couleur principale se voit sur <écran>
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « <univers> »
      Quand Léa arrive sur <écran>
      Alors la couleur principale de l'univers « <univers> » se voit sur <écran>

      Exemples:
        | univers             | écran                                                   |
        | Sports              | son accueil                                             |
        | Animaux de la forêt | « Mon parcours »                                        |
        | Princesses et fées  | « Toutes les leçons »                                   |
        | Police              | « Mes médailles »                                       |
        | Pompiers            | la page de la leçon « Les sons ou, on, an »             |
        | Danse               | la séance de la leçon « Les sons ou, on, an »           |
        | Sports              | la fin de la séance de la leçon « Les sons ou, on, an » |
        | Pompiers            | le test de départ                                       |

      @a-valider
      Exemples: Écrans dont la liste est à confirmer (question #96.7)
        | univers             | écran                    |
        | Police              | la séance de révision    |
        | Danse               | un épisode ouvert        |

    # Réponse 96.4 : texte et boutons à 4,5:1 au moins sur leur fond (aujourd'hui, Animaux est à 4,26:1).
    Plan du Scénario: Dans l'univers « <univers> », tout texte et chaque bouton des écrans de l'enfant se lisent bien <mode>
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « <univers> »
      Et que le réglage « mode dys » de Léa est sur « <mode dys> »
      Quand Léa ouvre tour à tour chaque écran de l'enfant
      Alors sur chacun, tout texte et chaque bouton ont un contraste d'au moins 4,5:1 avec leur fond

      Exemples: Sans le mode dys
        | univers             | mode           | mode dys |
        | Princesses et fées  | sans mode dys  | non      |
        | Animaux de la forêt | sans mode dys  | non      |
        | Sports              | sans mode dys  | non      |
        | Police              | sans mode dys  | non      |
        | Pompiers            | sans mode dys  | non      |
        | Danse               | sans mode dys  | non      |

      Exemples: En mode dys
        | univers             | mode           | mode dys |
        | Princesses et fées  | en mode dys    | oui      |
        | Animaux de la forêt | en mode dys    | oui      |
        | Sports              | en mode dys    | oui      |
        | Police              | en mode dys    | oui      |
        | Pompiers            | en mode dys    | oui      |
        | Danse               | en mode dys    | oui      |

    Plan du Scénario: Les colonnes de l'addition posée gardent leurs couleurs dans l'univers « <univers> »
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « <univers> »
      Quand Léa commence un exercice addition d'une leçon de test
      Alors la colonne des unités est bleue, celle des dizaines rose et celle des centaines verte

      Exemples:
        | univers             |
        | Princesses et fées  |
        | Pompiers            |

    # Réponse 96.1
    Scénario: Sans le mode dys, les titres s'affichent en Baloo 2 et le texte en Andika
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que le réglage « mode dys » de Léa est sur « non »
      Quand Léa arrive sur son accueil
      Alors les titres de son accueil s'affichent en Baloo 2
      Et le texte de son accueil s'affiche en Andika

    # Réponse 96.1
    Scénario: En mode dys, les titres et les boutons s'affichent dans la même police que le texte
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que le réglage « mode dys » de Léa est sur « oui »
      Quand Léa arrive sur son accueil
      Alors les titres, les boutons et le texte de son accueil s'affichent en Andika, lettres, mots et lignes espacés

    # Réponse 96.1 : Baloo 2 servie par le projet
    Scénario: Les polices de l'application viennent de Savanturier, jamais d'un service tiers
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Quand Léa ouvre tour à tour chaque écran de l'enfant
      Alors aucune police n'est demandée à un autre site que Savanturier

    # Réponse 96.2 : pas de mode sombre
    Scénario: Sur un appareil réglé en mode sombre, l'enfant garde les couleurs de son univers
      Étant donné que l'appareil est réglé en mode sombre
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Danse »
      Quand Léa arrive sur son accueil
      Alors elle voit Lili dans le paysage de l'univers « Danse »
      Et la couleur principale de l'univers « Danse » se voit sur son accueil

  Règle: Le paysage et le personnage guide de l'univers, au dessin validé par le PO, accompagnent l'enfant sur chaque écran de l'enfant

    Plan du Scénario: Sur <écran>, Léa voit <personnage guide> dans le paysage de l'univers « <univers> »
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « <univers> »
      Quand Léa arrive sur <écran>
      Alors elle voit <personnage guide> dans le paysage de l'univers « <univers> »

      Exemples:
        | univers             | personnage guide | écran                                                   |
        | Animaux de la forêt | Noisette         | son accueil                                             |
        | Sports              | Coach Léo        | « Mon parcours »                                        |
        | Police              | Agent Max        | « Toutes les leçons »                                   |
        | Princesses et fées  | Lumi             | « Mes médailles »                                       |
        | Danse               | Lili             | la page de la leçon « Les sons ou, on, an »             |
        | Pompiers            | Capitaine Sam    | la séance de la leçon « Les sons ou, on, an »           |
        | Animaux de la forêt | Noisette         | la fin de la séance de la leçon « Les sons ou, on, an » |
        | Sports              | Coach Léo        | le test de départ                                       |

      @a-valider
      Exemples: Écrans dont la liste est à confirmer (question #96.7)
        | univers             | personnage guide | écran                 |
        | Pompiers            | Capitaine Sam    | la séance de révision |
        | Princesses et fées  | Lumi             | un épisode ouvert     |

    # Réponse 96.5 : dessin fixe des maquettes ; Capitaine Sam garde son dessin actuel ; animations de célébration dans #106.
    Plan du Scénario: Dans l'univers « <univers> », <personnage guide> a <son dessin>
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « <univers> »
      Quand Léa arrive sur son accueil
      Alors <personnage guide> a <son dessin>

      Exemples:
        | univers             | personnage guide | son dessin                                                                          |
        | Sports              | Coach Léo        | le dessin validé : cheveux courts, sans casquette, maillot bleu                     |
        | Danse               | Lili             | le dessin validé : queue de cheval haute, justaucorps violet et tutu rose           |
        | Animaux de la forêt | Noisette         | le dessin validé : petit écureuil rond à grosse queue en panache                    |
        | Princesses et fées  | Lumi             | le dessin validé : ailes, tiare et robe rose jusqu'aux genoux                       |
        | Police              | Agent Max        | le dessin validé : casquette de police à étoile dorée, chemise bleue et pantalon    |
        | Pompiers            | Capitaine Sam    | son dessin d'avant la refonte                                                       |

    # Réponse 96.5 : le personnage guide de l'univers « Police » devient Agent Max.
    Scénario: Dans l'univers « Police », Agent Max salue l'enfant
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Police »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Agent Max dit « Bonjour Léa ! »
      Mais le nom « Agente Mila » n'apparaît nulle part

    @a-valider
    Scénario: Après une bonne réponse, Agent Max dit une félicitation commune ou une de ses expressions
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Police »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Agent Max dit une félicitation commune ou l'une de ses expressions : « Enquête résolue ! », « Bien vu, détective ! », « Affaire classée ! »
      Mais jamais l'expression d'un autre personnage guide

    @a-valider
    Scénario: Agent Max lit la consigne avec une voix masculine
      Étant donné que l'appareil a une voix française féminine et une voix française masculine
      Et que Léa a choisi l'univers police
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Agent Max lire la consigne avec une voix masculine

    Scénario: Un profil enfant sans univers retrouve Noisette et son paysage sur « Mon parcours »
      Étant donné que Léa a un profil enfant préparé sans univers
      Quand Léa arrive sur « Mon parcours »
      Alors elle voit Noisette dans le paysage de l'univers « Animaux de la forêt »
      Et aucun message d'erreur n'apparaît

    Scénario: Sur un écran de 360 px, le personnage guide ne cache ni la consigne ni les choix
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Pompiers »
      Quand Léa arrive sur la séance de la leçon « Les sons ou, on, an »
      Alors elle voit Capitaine Sam dans le paysage de l'univers « Pompiers »
      Et la consigne et tous les choix de la question restent visibles en entier

    Plan du Scénario: Avec les mouvements réduits, le paysage et le personnage guide restent immobiles sur <écran>
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Quand Léa arrive sur <écran>
      Alors elle voit Coach Léo dans le paysage de l'univers « Sports »
      Et rien ne bouge dans le paysage ni chez Coach Léo

      Exemples:
        | écran                                       |
        | « Mon parcours »                            |
        | la page de la leçon « Les sons ou, on, an » |

    Scénario: Les lecteurs d'écran n'annoncent ni le paysage ni le dessin du personnage guide
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Princesses et fées »
      Quand Léa arrive sur « Mon parcours »
      Alors les lecteurs d'écran n'annoncent ni le paysage ni le dessin de Lumi
      Mais ils annoncent le titre de l'écran et les leçons du parcours

  Règle: Un bouton de l'enfant réagit dès qu'on le touche : il s'enfonce puis revient ; avec les mouvements réduits, il change seulement de couleur

    Plan du Scénario: Toucher <bouton> le fait s'enfoncer puis revenir à sa place
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Léa est sur <écran>
      Quand Léa touche <bouton>
      Alors <bouton> s'enfonce puis revient à sa place

      Exemples:
        | écran            | bouton                                  |
        | son accueil      | « Commencer »                           |
        | son accueil      | le bouton « Mes médailles » du dock     |
        | « Mon parcours » | la leçon « Les sons ou, on, an »        |

    Scénario: Au clavier, valider un bouton le fait aussi s'enfoncer puis revenir
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Léa joue sur un ordinateur, au clavier
      Et que Léa est sur son accueil
      Quand Léa valide « Commencer » au clavier
      Alors « Commencer » s'enfonce puis revient à sa place

    Scénario: Avec les mouvements réduits, un bouton touché change seulement de couleur
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Léa est sur son accueil
      Quand Léa touche « Commencer »
      Alors « Commencer » change de couleur
      Mais « Commencer » ne bouge pas

    @a-valider
    Scénario: Un bouton touché puis quitté du doigt revient à sa place sans rien ouvrir
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Léa est sur son accueil
      Quand Léa pose le doigt sur « Commencer » puis le fait glisser hors du bouton avant de le lever
      Alors « Commencer » revient à sa place
      Et Léa voit son accueil

    Scénario: Après une erreur, le choix touché revient à sa place et Léa a une nouvelle chance
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Coach Léo dit un encouragement parmi « Oups, presque ! », « Hmm, pas tout à fait… », « Pas grave, on réessaie ! », « Ah, celle-là est piégeuse ! », « Presque ! Regarde bien. »
      Et le choix « 8 » est revenu à sa place
      Et Léa peut encore répondre à « Combien font 3 + 4 ? »

    Scénario: Avec leur relief, les boutons de l'accueil restent assez grands pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Quand Léa arrive sur son accueil
      Alors « Commencer », chaque tuile de l'accueil et chaque bouton du dock mesurent au moins 44 px de haut

  Règle: Avancer d'un écran de l'enfant au suivant le fait arriver en glissant, revenir le fait glisser dans l'autre sens, « Mes médailles » arrive en fondu ; avec les mouvements réduits, aucun mouvement

    # Réponse 96.6
    Plan du Scénario: <écran> arrive <transition>
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Danse »
      Et que <départ>
      Quand <action>
      Alors <écran> arrive <transition>

      Exemples:
        | départ                                                 | action                                                         | écran                                         | transition                   |
        | Léa a choisi son profil enfant dans « Qui joue ? »     | Léa ouvre « Mon parcours » par le dock                         | « Mon parcours »                              | en glissant                  |
        | Léa a ouvert son parcours depuis son accueil           | Léa ouvre la leçon « Les sons ou, on, an » depuis son parcours | la page de la leçon « Les sons ou, on, an »   | en glissant                  |
        | Léa a ouvert la leçon « Les sons ou, on, an » depuis son parcours | Léa commence la séance de la leçon « Les sons ou, on, an » | la séance de la leçon « Les sons ou, on, an » | en glissant                  |
        | Léa a ouvert la leçon « Les sons ou, on, an » depuis son parcours | Léa revient en arrière                              | « Mon parcours »                              | en glissant dans l'autre sens |
        | Léa a choisi son profil enfant dans « Qui joue ? »     | Léa ouvre « Mes médailles » par le dock                        | « Mes médailles »                             | en fondu                     |

      @a-valider
      Exemples: Transitions à confirmer (question #96.12)
        | départ                                                 | action                                                         | écran                 | transition  |
        | Léa a choisi son profil enfant dans « Qui joue ? »     | Léa ouvre « Toutes les leçons » par le dock                    | « Toutes les leçons » | en glissant |

    Scénario: Avec les mouvements réduits, la page de la leçon s'affiche sans aucun mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Danse »
      Et que Léa a ouvert son parcours depuis son accueil
      Quand Léa ouvre la leçon « Les sons ou, on, an » depuis son parcours
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Et la page de la leçon s'affiche sans aucun mouvement

    Scénario: Avec les mouvements réduits, « Mes médailles » s'affiche sans fondu
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Danse »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa ouvre « Mes médailles » par le dock
      Alors le titre de l'écran est « Mes médailles »
      Et « Mes médailles » s'affiche sans aucun mouvement

    @a-valider
    Scénario: Toucher deux fois de suite une leçon n'ouvre sa page qu'une seule fois
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Danse »
      Et que Léa a ouvert son parcours depuis son accueil
      Quand Léa touche deux fois de suite la leçon « Les sons ou, on, an » pendant la transition
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Et revenir en arrière une seule fois la ramène sur « Mon parcours »

  Règle: Les écrans de l'enfant tiennent à 360 px de large, et les écrans clés gardent l'apparence validée par le PO

    Plan du Scénario: À 360 px de large, <écran> s'affiche sans défilement horizontal
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Princesses et fées »
      Quand Léa arrive sur <écran>
      Alors la page tient dans la largeur de l'écran

      Exemples:
        | écran                                                   |
        | son accueil                                             |
        | « Mon parcours »                                        |
        | « Toutes les leçons »                                   |
        | « Mes médailles »                                       |
        | la page de la leçon « Les sons ou, on, an »             |
        | la séance de la leçon « Les sons ou, on, an »           |
        | la fin de la séance de la leçon « Les sons ou, on, an » |
        | le test de départ                                       |

      @a-valider
      Exemples: Écrans dont la liste est à confirmer (question #96.7)
        | écran                 |
        | la séance de révision |
        | un épisode ouvert     |

    @visuel @a-valider
    Plan du Scénario: <écran> ressemble à sa capture de référence « <capture> »
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que l'appareil demande des mouvements réduits
      Et que nous sommes le 23 octobre 2026
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Quand Léa arrive sur <écran>
      Alors <écran> ressemble à sa capture de référence « <capture> »

      Exemples:
        | écran                                                                    | capture            |
        | son accueil                                                              | aujourd-hui        |
        | « Mon parcours »                                                         | mon-parcours       |
        | l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » | exercice-en-seance |
        | la fin de la séance de la leçon « Les sons ou, on, an »                  | fin-de-la-seance   |

  Règle: L'Espace parent reprend les jetons de l'enfant, mais reste sobre : ni couleur de l'univers de l'enfant, ni paysage, ni personnage guide, ni rebond

    Scénario: L'Espace parent ne prend pas la couleur principale de l'univers de l'enfant qui jouait
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Danse »
      Et que Léa jouait avant que Paul entre dans l'espace parent
      Quand Paul entre dans l'espace parent
      Alors il voit l'espace parent
      Mais la couleur principale de l'univers « Danse » ne s'y voit pas

    # Réponse 96.3
    Scénario: L'Espace parent n'a ni paysage ni personnage guide
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Léa jouait avant que Paul entre dans l'espace parent
      Quand Paul entre dans l'espace parent
      Alors il voit l'espace parent
      Mais aucun paysage ni aucun personnage guide n'y apparaît

    # Réponse 96.3
    Scénario: Les titres de l'Espace parent s'affichent en Baloo 2 et son texte en Andika
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Quand Paul entre dans l'espace parent
      Alors les titres de l'espace parent s'affichent en Baloo 2
      Et le texte de l'espace parent s'affiche en Andika

    @a-valider
    Scénario: Dans l'Espace parent, un bouton touché s'enfonce et revient sans rebondir
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Paul est entré dans l'espace parent
      Quand Paul touche le profil enfant de Léa dans l'espace parent
      Alors le profil enfant de Léa s'enfonce puis revient à sa place
      Mais il ne rebondit pas

    @a-valider
    Scénario: Entrer dans l'Espace parent se fait sans glissement
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Sports »
      Et que Léa jouait avant que Paul entre dans l'espace parent
      Quand Paul entre dans l'espace parent
      Alors il voit l'espace parent
      Et l'espace parent s'affiche sans glisser ni rebondir
