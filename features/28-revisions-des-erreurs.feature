# language: fr
@issue-28
Fonctionnalité: Révisions des erreurs
  En tant qu'enfant
  Je veux retrouver les questions que j'ai ratées les jours passés, à intervalles de plus en plus longs
  Afin de corriger mes erreurs pour de bon

  Une question ratée dans une séance terminée devient une question retenue de la file de révision de l'enfant.
  Elle est due le lendemain, puis, chaque fois qu'elle est juste en séance de révision, 3 jours, puis 7 jours plus tard ;
  juste une troisième fois, elle est corrigée pour de bon. Fausse en séance de révision, elle revient le lendemain.
  Les commentaires « Question 28.n » renvoient aux questions ouvertes de docs/stories/28/acceptance.md.
  L'accueil de l'enfant propose la séance de révision tant que l'écran « Aujourd'hui » (#29) n'est pas livré (28.8) :
  les étapes « l'accueil de Léa propose la séance de révision… » resteront vraies quand la tuile « À revoir » la proposera.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test des révisions
  (identifiants préfixés « e2e-28- »). Chaque leçon a une étape de leçon et un seul exercice, sans aide :
  - « Les sons de révision » (français, CP, ordre 10) : un exercice bulles « Les sons » de 3 questions,
    « Quel mot a le son ou ? » (choix « loup », « lit », « sac » ; réponse « loup »),
    « Quel mot a le son on ? » (« pont », « lune », « vélo » ; réponse « pont »),
    « Quel mot a le son an ? » (« gant », « bol », « mur » ; réponse « gant ») ;
  - « Les nombres de révision » (maths, CP, ordre 20) : un exercice bulles « Les doubles » de 12 questions,
    « Combien font 1 + 1 ? » à « Combien font 12 + 12 ? », à trois choix chacune ;
  - « Le texte à trous de révision » (français, CP, ordre 30) : un exercice texte à trous d'un seul trou,
    « Au clair de la [lune] », de distracteurs « plume » et « porte ». Rejouée seule en séance de révision,
    sa question est la question à choix « Au clair de la … », de choix « lune », « plume » et « porte ».
  « Le lendemain », « 3 jours plus tard » : jours du calendrier de l'appareil, qui commencent à minuit.
  Une date de révision « aujourd'hui », « hier » ou « il y a 3 jours » rend la question due ; « demain » ne la rend pas due.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Claire n'y est pas rattachée.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que la bibliothèque de test des révisions est servie

  Règle: Une question ratée dans une séance terminée est retenue ; elle est due le lendemain, jamais le jour même

    # Réponse 28.4
    Plan du Scénario: Une question ratée <manière> revient en révision le lendemain
      Étant donné que Léa a terminé une séance de la leçon « Les sons de révision », <manière> à « Quel mot a le son ou ? »
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés »

      Exemples:
        | manière                    |
        | en se trompant             |
        | en disant « Je ne sais pas » |

    Scénario: Une question ratée n'est pas due le jour même
      Étant donné que Léa a terminé une séance de la leçon « Les sons de révision », en se trompant à « Quel mot a le son ou ? »
      Quand Léa revient à son accueil plus tard le même jour
      Alors l'accueil de Léa ne propose pas de séance de révision

    Scénario: Une séance terminée sans erreur ne retient aucune question
      Étant donné que Léa a terminé une séance de la leçon « Les sons de révision », sans erreur
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa ne propose pas de séance de révision

    Scénario: Une séance quittée avant la fin ne retient aucune question
      Étant donné que Léa a quitté une séance de la leçon « Les sons de révision » après s'être trompée à « Quel mot a le son ou ? »
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa ne propose pas de séance de révision

    Scénario: Une question fausse au test de départ n'est jamais retenue
      Étant donné que Léa a fait le test de départ, avec des questions fausses à « Les sons de révision », « Les nombres de révision » et « Le texte à trous de révision »
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa ne propose pas de séance de révision

    # Réponse 28.18
    Scénario: Une question retenue, ratée de nouveau dans une séance, revient le lendemain
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision | intervalle de révision |
        | Quel mot a le son ou ? | dans 5 jours     | 7 jours                |
      Et que Léa a terminé une séance de la leçon « Les sons de révision », en se trompant à « Quel mot a le son ou ? »
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés »

    # Réponse 28.17
    Scénario: Une question retenue réussie dans une séance ordinaire reste due
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision | intervalle de révision |
        | Quel mot a le son ou ? | aujourd'hui      | 3 jours                |
      Et que Léa a terminé une séance de la leçon « Les sons de révision », sans erreur
      Quand Léa revient à son accueil plus tard le même jour
      Alors l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés »

  Règle: L'accueil de l'enfant propose la séance de révision dès qu'au moins une question est due, et dit combien

    # Réponse 28.8
    Plan du Scénario: Avec <dues> question(s) due(s), l'accueil annonce « <annonce> »
      Étant donné que Léa a <dues> questions dues de la leçon « Les nombres de révision »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa propose la séance de révision, avec « <annonce> »

      Exemples:
        | dues | annonce                             |
        | 1    | 1 petite erreur des jours passés    |
        | 3    | 3 petites erreurs des jours passés  |
        | 12   | 12 petites erreurs des jours passés |

    Scénario: Sans question due, l'accueil ne propose pas de séance de révision
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | demain           |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose pas de séance de révision

    # Réponses 28.8 et 28.28
    Scénario: La séance de révision commence par la plus ancienne question due, sans étape de leçon
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son on ? | hier             |
        | Quel mot a le son ou ? | il y a 3 jours   |
      Quand Léa commence la séance de révision
      Alors l'écran s'intitule « Je révise mes erreurs », avec « Révision »
      Et Noisette dit « On révise les petites erreurs des jours passés. Chaque fois que tu réussis, l'erreur s'efface un peu plus ! »
      Et la question « Quel mot a le son ou ? » s'affiche
      Et « Je ne sais pas » est proposé à Léa
      Mais Léa n'entend aucune étape de leçon

  Règle: La séance de révision pose au plus 10 questions dues, les plus anciennes d'abord ; les autres attendent la suivante

    Scénario: La séance de révision pose les 10 questions dues les plus anciennes, dans l'ordre de leur date de révision
      Étant donné que Léa a pour questions retenues de la leçon « Les nombres de révision » :
        | question                | date de révision |
        | Combien font 1 + 1 ?    | hier             |
        | Combien font 2 + 2 ?    | il y a 11 jours  |
        | Combien font 3 + 3 ?    | il y a 3 jours   |
        | Combien font 4 + 4 ?    | il y a 10 jours  |
        | Combien font 5 + 5 ?    | il y a 9 jours   |
        | Combien font 6 + 6 ?    | demain           |
        | Combien font 7 + 7 ?    | il y a 8 jours   |
        | Combien font 8 + 8 ?    | il y a 7 jours   |
        | Combien font 9 + 9 ?    | il y a 6 jours   |
        | Combien font 10 + 10 ?  | il y a 5 jours   |
        | Combien font 11 + 11 ?  | il y a 4 jours   |
        | Combien font 12 + 12 ?  | il y a 2 jours   |
      Et que Léa a commencé la séance de révision
      Quand Léa répond juste à toutes les questions de la séance de révision
      Alors Léa a eu, dans l'ordre, les questions :
        | question                |
        | Combien font 2 + 2 ?    |
        | Combien font 4 + 4 ?    |
        | Combien font 5 + 5 ?    |
        | Combien font 7 + 7 ?    |
        | Combien font 8 + 8 ?    |
        | Combien font 9 + 9 ?    |
        | Combien font 10 + 10 ?  |
        | Combien font 11 + 11 ?  |
        | Combien font 3 + 3 ?    |
        | Combien font 12 + 12 ?  |
      Mais ni « Combien font 1 + 1 ? » ni « Combien font 6 + 6 ? »

    # Réponse 28.25
    Scénario: Après une séance de révision de 10 questions, l'accueil propose les questions dues qui restent
      Étant donné que Léa a 12 questions dues de la leçon « Les nombres de révision »
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa revient à son accueil plus tard le même jour
      Alors l'accueil de Léa propose la séance de révision, avec « 2 petites erreurs des jours passés »

  Règle: En séance de révision, une question est juste seulement sans aucune erreur ; l'enfant a une nouvelle chance et peut dire « Je ne sais pas »

    Scénario: Après une erreur en séance de révision, le personnage guide encourage et la même question reste posée
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | aujourd'hui      |
      Et que Léa en est à la question « Quel mot a le son ou ? » de la séance de révision
      Quand Léa répond « lit » à la question « Quel mot a le son ou ? »
      Alors Noisette dit un encouragement, suivi de « Essaie une autre bulle. »
      Et la question « Quel mot a le son ou ? » reste posée

    Scénario: Après « Je ne sais pas » en séance de révision, la bonne réponse est montrée et l'enfant la donne
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | aujourd'hui      |
      Et que Léa en est à la question « Quel mot a le son ou ? » de la séance de révision
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « loup » reste, et il brille

  Règle: Juste en séance de révision, une question revient 3 jours, puis 7 jours plus tard, puis elle est corrigée pour de bon ; fausse, elle revient le lendemain

    Plan du Scénario: Juste à l'intervalle de <intervalle>, une question <résultat> <jours> jours plus tard
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision | intervalle de révision |
        | Quel mot a le son ou ? | aujourd'hui      | <intervalle>           |
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa revient à son accueil <jours> jours plus tard
      Alors l'accueil de Léa <proposition>

      Exemples:
        | intervalle | jours | résultat           | proposition                                                                    |
        | 1 jour     | 2     | n'est pas due      | ne propose pas de séance de révision                                           |
        | 1 jour     | 3     | revient            | propose la séance de révision, avec « 1 petite erreur des jours passés »       |
        | 3 jours    | 6     | n'est pas due      | ne propose pas de séance de révision                                           |
        | 3 jours    | 7     | revient            | propose la séance de révision, avec « 1 petite erreur des jours passés »       |

    Scénario: Juste à l'intervalle de 7 jours, une question est corrigée pour de bon et ne revient plus
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision | intervalle de révision |
        | Quel mot a le son ou ? | aujourd'hui      | 7 jours                |
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa revient à son accueil 30 jours plus tard
      Alors l'accueil de Léa ne propose pas de séance de révision

    # Réponse 28.4
    Plan du Scénario: Fausse en séance de révision (<cas>), une question revient le lendemain, même à l'intervalle de 7 jours
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision | intervalle de révision |
        | Quel mot a le son ou ? | aujourd'hui      | 7 jours                |
      Et que Léa a fait la séance de révision, <manière> à « Quel mot a le son ou ? »
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés »

      Exemples:
        | cas                | manière                      |
        | une erreur         | en se trompant               |
        | « Je ne sais pas » | en disant « Je ne sais pas » |

    # Réponse 28.1 : écart voulu avec le legacy, qui la retenait une seconde fois sous la forme rejouée
    Scénario: Une question de texte à trous ratée en séance de révision reste une seule question retenue
      Étant donné que Léa a pour questions retenues de la leçon « Le texte à trous de révision » :
        | question         | date de révision |
        | Au clair de la … | aujourd'hui      |
      Et que Léa a fait la séance de révision, en se trompant à « Au clair de la … »
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés »

    # Réponse 28.8
    Scénario: Une séance de révision quittée en cours ne change aucune question retenue
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | hier             |
        | Quel mot a le son on ? | hier             |
        | Quel mot a le son an ? | hier             |
      Et que Léa a répondu juste à la question « Quel mot a le son ou ? » de la séance de révision
      Quand Léa quitte la séance de révision
      Alors Léa voit son accueil
      Et l'accueil de Léa propose la séance de révision, avec « 3 petites erreurs des jours passés »

  Règle: La fin de la séance de révision ne donne pas d'étoiles : le personnage guide dit les erreurs qui s'effacent, et l'enfant revient à son accueil

    # Réponse 28.2 : écart voulu avec le legacy, qui montrait des étoiles comptées nulle part
    Scénario: La fin de la séance de révision ne montre aucune étoile et propose seulement « Accueil »
      Étant donné que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que Léa a commencé la séance de révision
      Quand Léa répond juste à toutes les questions de la séance de révision
      Alors la fin de la séance de révision propose seulement « Accueil »
      Et la fin de la séance de révision ne montre aucune étoile
      Et le focus est sur « Accueil »

    # Réponses 28.2 et 28.23 ; mise à jour par #33 (décisions 33.12 et 33.13) : la séance de révision ouvre un épisode
    Plan du Scénario: Avec <justes> question(s) juste(s), le personnage guide dit « <phrase> »
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | aujourd'hui      |
        | Quel mot a le son on ? | aujourd'hui      |
        | Quel mot a le son an ? | aujourd'hui      |
      Et que Léa a commencé la séance de révision
      Quand Léa répond à la séance de révision, <déroulé>
      Alors Noisette dit « <phrase> »

      Exemples:
        | justes | déroulé                                      | phrase                                                                                                           |
        | 3      | juste à toutes les questions                 | Bravo Léa ! 3 erreurs s'effacent un peu plus. Un nouvel épisode de l'histoire t'attend !                         |
        | 1      | juste seulement à « Quel mot a le son ou ? » | Bravo Léa ! 1 erreur s'efface un peu plus. Un nouvel épisode de l'histoire t'attend !                            |
        | 0      | en se trompant à toutes les questions        | Merci Léa ! Ces erreurs reviendront demain : on les effacera ensemble. Un nouvel épisode de l'histoire t'attend ! |

    # Réponse 28.8
    Scénario: « Accueil » ramène à l'accueil, qui ne propose plus la séance de révision quand plus rien n'est dû
      Étant donné que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa choisit « Accueil » à la fin de la séance de révision
      Alors Léa voit son accueil
      Et l'accueil de Léa ne propose pas de séance de révision

    # Réponse 28.2
    Scénario: Une séance de révision ne change pas les étoiles d'une leçon
      Étant donné que Léa a pour meilleures étoiles :
        | leçon                | étoiles |
        | Les sons de révision | 2       |
      Et que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | aujourd'hui      |
      Et que Léa a fait la séance de révision, en répondant juste à toutes les questions
      Quand Léa ouvre son parcours
      Alors le parcours montre « Les sons de révision » réussie avec 2 étoiles

  Règle: La révision marche sans réseau, à voix haute, au clavier et sur un petit écran

    # Réponses 28.21 et 28.22
    Scénario: Sans réseau, une question ratée est quand même proposée le lendemain sur l'appareil
      Étant donné que le réseau est coupé
      Et que Léa a terminé une séance de la leçon « Les sons de révision », en se trompant à « Quel mot a le son ou ? »
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés »

    # Réponse 28.21
    Scénario: Sans réseau, la séance de révision se joue jusqu'au bout et sa fin dit que la progression est gardée sur l'appareil
      Étant donné que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que Léa a commencé la séance de révision
      Et que le réseau est coupé
      Quand Léa répond juste à toutes les questions de la séance de révision
      Alors la fin de la séance de révision propose seulement « Accueil »
      Et elle voit le message « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. »

    # Réponse 28.21
    Scénario: Sans file de révision lue, l'accueil ne propose pas de séance de révision, sans message d'erreur
      Étant donné que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que la file de révision de Léa ne peut pas être lue
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit son accueil
      Mais l'accueil de Léa ne propose pas de séance de révision
      Et aucun message d'erreur n'apparaît

    Scénario: Le personnage guide lit chaque question de la séance de révision
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | il y a 2 jours   |
        | Quel mot a le son on ? | hier             |
      Et que Léa en est à la question « Quel mot a le son ou ? » de la séance de révision
      Quand Léa répond « loup » à la question « Quel mot a le son ou ? »
      Alors Léa entend Noisette lire « Quel mot a le son on ? »

    Scénario: La séance de révision se commence et se joue au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que Léa a choisi son profil enfant dans « Qui joue ? »
      Quand Léa commence la séance de révision, au clavier seulement
      Alors la question « Combien font 1 + 1 ? » s'affiche

    Scénario: La proposition de la séance de révision tient dans un écran de 360 px, assez grande pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la page tient dans la largeur de l'écran
      Et la proposition de la séance de révision mesure au moins 44 px de haut

    Scénario: Une question de la séance de révision tient dans un écran de 360 px, « Je ne sais pas » compris
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Quand Léa commence la séance de révision
      Alors la page tient dans la largeur de l'écran
      Et chaque choix mesure au moins 44 px de haut et de large
      Et « Je ne sais pas » mesure au moins 44 px de haut

  Règle: La file de révision est tenue par le serveur, et seulement pour un parent rattaché au profil enfant

    @acces
    Scénario: Une séance terminée envoyée par l'appareil retient sa question ratée, que l'on retrouve sur un autre appareil du parent
      Quand l'appareil envoie pour Léa une séance terminée de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an », avec une erreur à sa première question
      Alors le lendemain, l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés », sur le téléphone de Paul

    Scénario: Une séance de révision terminée envoyée par l'appareil fait avancer la question juste
      Étant donné que Léa a pour question due la première question de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand l'appareil envoie pour Léa une séance de révision terminée, juste à cette question
      Alors l'accueil de Léa ne propose pas de séance de révision sur le téléphone de Paul

    Plan du Scénario: Le serveur refuse une séance de révision terminée incohérente, et la question reste due (<cas>)
      Étant donné que Léa a pour question due la première question de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand l'appareil envoie pour Léa une séance de révision terminée <cas>
      Alors l'enregistrement est refusé
      Et l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés », sur le téléphone de Paul

      Exemples:
        | cas                                                |
        | dont la question ne finit pas par la bonne réponse |
        | qui pose deux fois cette question                  |

    @acces
    Scénario: Le second parent rattaché retrouve sur son téléphone la séance de révision proposée à Léa
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a 2 questions dues de la leçon « Les nombres de révision »
      Quand Léa choisit son profil enfant sur le téléphone de Marie
      Alors l'accueil de Léa propose la séance de révision, avec « 2 petites erreurs des jours passés »

    @acces
    Scénario: Les questions retenues d'un enfant ne sont jamais proposées à un autre enfant
      Étant donné que Tom a un profil enfant préparé de niveau CP
      Et que Tom a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | hier             |
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors l'accueil de Léa ne propose pas de séance de révision

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas la file de révision de Léa
      Étant donné que Léa a 2 questions dues de la leçon « Les nombres de révision »
      Et que Claire est connectée sur le téléphone
      Quand Claire demande la file de révision du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

    @acces
    Scénario: Un parent qui n'est pas rattaché ne peut pas enregistrer une séance de révision pour Léa
      Étant donné que Léa a pour question due la première question de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Claire est connectée sur le téléphone
      Quand Claire envoie une séance de révision terminée pour le profil enfant de Léa
      Alors l'enregistrement est refusé comme pour un profil introuvable
      Et l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés », sur le téléphone de Paul

  Règle: La file de révision fait partie des données du profil enfant

    @depend-de-14
    Scénario: L'export du profil contient les questions retenues, sans les réponses données
      Étant donné que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | hier             |
      Et que Paul est dans l'espace parent
      Quand Paul exporte les données du profil enfant de Léa
      Alors le fichier téléchargé contient la question retenue « Quel mot a le son ou ? », avec sa leçon d'origine et sa date de révision
      Mais aucune des réponses données par Léa

    @depend-de-14
    Scénario: La suppression du profil efface sa file de révision
      Étant donné que Léa a 2 questions dues de la leçon « Les nombres de révision »
      Et que Paul a demandé la suppression du profil enfant de Léa
      Quand Paul confirme la suppression du profil enfant de Léa
      Alors plus aucune question retenue ni aucune séance de révision de Léa n'est gardée par Savanturier
