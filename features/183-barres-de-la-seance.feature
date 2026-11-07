# language: fr
@issue-183 @wip
Fonctionnalité: Une barre du haut et une barre d'action en bas pour laisser la place à la leçon
  En tant qu'enfant
  Je veux voir tout de suite l'exercice et le bouton pour répondre, sans défiler
  Afin de rester concentré sur ce que j'apprends

  Contexte Apprentissage (docs/stories/183/domain-model.md). La story est surtout de la présentation : l'écran de
  séance perd l'en-tête de l'application, gagne une barre du haut (Retour, titre de la leçon, choix Son/Muet,
  avancement de la séance) et une barre d'action en bas. Une seule règle vient du domaine : Retour (le bouton, le
  geste retour du navigateur ou du téléphone) ouvre la pause de la séance seulement si la séance a reçu une réponse
  (`Seance.aRecuUneReponse`). La pause de la séance ne change rien à la séance et rien n'est enregistré.
  Cadrage : les recommandations des questions 183.1 à 183.9 du modèle sont prises comme hypothèses de travail, en
  attendant la réponse du PO ; les scénarios qui en dépendent sont tagués @a-valider
  (docs/stories/183/acceptance.md, « Questions ouvertes »).

  Mots employés dans ces scénarios :
  - « Léa choisit « Retour » » : Léa touche la flèche Retour de la barre du haut (nom accessible « Retour ») ;
  - « Léa revient en arrière » : le geste retour du téléphone ou le bouton retour du navigateur (étape existante) ;
  - « la pause de la séance » : la feuille « On fait une pause ? » ouverte par Retour (glossaire, à valider, 183.7) ;
  - « l'en-tête de l'application » : « Savanturier », le prénom et la classe de l'enfant, l'Espace parent ;
  - « la barre d'action » : la barre en bas de l'écran qui porte le bouton principal (« Continuer », « Valider »)
    et « Je ne sais pas » ; mot d'interface ;
  - « le compteur de l'avancement de la séance » : la pastille « 1 / 6 » sous la fine barre de l'avancement de la
    séance (« barre de progression » reste un mot d'interface, glossaire « Avancement de la séance, complément »).
  Mesures, pour l'implémentation et la review : boutons d'action de 52 à 56 px de haut, autres commandes 44 px au
  moins ; sur 360 × 740, l'exercice commence au plus à 200 px du haut de l'écran.

  Leçons utilisées, toutes déjà employées par d'autres stories : « Les sons ou, on, an » (fr-cp-sons-ou-on-an :
  3 étapes de leçon, exercice bulles « Quel son entends-tu ? » de 6 questions sans consigne, exercice classer
  « Les maisons des sons » de 9 étiquettes ; séance complète de 15 questions) ; la question de test
  « Combien font 3 + 4 ? » (choix « 6 », « 7 », « 8 » et « 9 », de réponse « 7 », seule dans sa séance) ; la leçon
  de test « Compter » de #79 (exercice bulles de consigne « Touche le bon nombre. ») ; « Dictée : les animaux »
  (exercice « J'écris les animaux », #19) ; « Les doubles » (fluence « Calcul rapide : les doubles », #20) ; la
  leçon de test de calcul de niveau CE1 de #23 ; « Lire une œuvre : Vingt mille lieues sous les mers » (CM2,
  49 caractères : le titre le plus long de la bibliothèque), ouverte directement par sa page de la leçon.
  Léa a un profil enfant de niveau CP, Tom un profil enfant de niveau CE1, tous deux dans l'univers
  « Animaux de la forêt » : leur personnage guide est Noisette.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Pendant la séance, l'en-tête de l'application disparaît ; la barre du haut porte Retour, le titre de la leçon et le choix Son/Muet

    Scénario: Pendant la séance, Léa ne voit ni « Savanturier », ni son prénom, ni l'Espace parent
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors Léa ne voit ni « Savanturier », ni son prénom et sa classe, ni l'« Espace parent »
      Et Léa voit en haut de la séance « Retour », le titre « Les sons ou, on, an » et le choix Son/Muet

    Scénario: Revenue sur la page de la leçon, Léa retrouve l'en-tête de l'application
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette est en train de lire la première étape de leçon
      Quand Léa choisit « Retour »
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Et l'en-tête affiche le prénom de Léa, le choix Son/Muet, l'accueil et l'espace parent

  Règle: Le titre de la séance est le titre de la leçon seul, sans classe ni matière, sur deux lignes au plus

    Scénario: Le titre de la séance ne dit ni la classe ni la matière
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Quel son entends-tu ? »
      Alors Léa voit en haut de la séance « Retour », le titre « Les sons ou, on, an » et le choix Son/Muet
      Mais le titre de la séance ne dit ni « CP » ni « Français »

    Scénario: Sur un écran de 360 px de large, le titre le plus long de la bibliothèque tient sur deux lignes au plus, sans mot coupé
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa est sur la page de la leçon « Lire une œuvre : Vingt mille lieues sous les mers »
      Quand Léa commence la séance complète
      Alors le titre « Lire une œuvre : Vingt mille lieues sous les mers » tient sur deux lignes au plus, sans mot coupé
      Et la page tient dans la largeur de l'écran

    Scénario: Les lecteurs d'écran nomment la séance par le titre de la leçon
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors les lecteurs d'écran nomment la séance par le titre « Les sons ou, on, an »

  Règle: L'avancement de la séance se montre par une fine barre et un compteur « questions réussies / questions de la séance », et reste lu par les lecteurs d'écran

    # 183.11 (question ajoutée) : le compteur dit les questions réussies, pas le rang de la question en cours
    @a-valider
    Scénario: Au début d'une séance d'un exercice de 6 questions, le compteur affiche « 0 / 6 » et la barre est vide
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Quel son entends-tu ? »
      Alors le compteur de l'avancement de la séance affiche « 0 / 6 »
      Et la barre de l'avancement de la séance est remplie à 0 sur 6

    Scénario: Une question réussie fait passer le compteur à « 1 / 6 » et remplit la barre d'un pas
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors le compteur de l'avancement de la séance affiche « 1 / 6 »
      Et la barre de l'avancement de la séance est remplie à 1 sur 6

    Scénario: Une réponse fausse ne fait reculer ni avancer le compteur
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « on »
      Alors le compteur de l'avancement de la séance affiche toujours « 0 / 6 »

    Scénario: Les étapes de leçon ne font pas avancer le compteur
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette a lu la dernière étape de leçon
      Quand Léa continue
      Alors le compteur de l'avancement de la séance affiche « 0 / 15 »

    Scénario: À la dernière question réussie, le compteur affiche « 9 / 9 » et la barre est pleine
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Et qu'il ne reste que l'étiquette « dent » à poser
      Quand Léa pose l'étiquette « dent » dans la maison « an »
      Alors le compteur de l'avancement de la séance affiche « 9 / 9 »
      Et la barre de l'avancement de la séance est remplie à 9 sur 9

    Scénario: L'avancement de la séance reste lu par les lecteurs d'écran
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors les lecteurs d'écran annoncent « 1 sur 6 », sans couper Noisette
      Et l'avancement de la séance reste lu par les lecteurs d'écran : 1 sur 6

  Règle: Avant la première réponse de la séance, Retour ramène directement à la page de la leçon

    Plan du Scénario: Avant toute réponse, quand <situation>, Retour ramène à la page de la leçon
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que <situation>
      Quand Léa choisit « Retour »
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Mais la pause de la séance ne s'ouvre pas

      Exemples:
        | situation                                                                  |
        | Noisette est en train de lire la première étape de leçon                   |
        | Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »  |

      # 183.1 A : lire les étapes de leçon n'est pas une réponse
      @a-valider
      Exemples:
        | situation                                  |
        | Noisette a lu la dernière étape de leçon   |

    # 183.3 A : en dictée, seul le mot écrit en entier est une réponse
    @a-valider
    Scénario: En dictée, des lettres écrites sans finir le mot ne sont pas encore une réponse : Retour ramène à la page de la leçon
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Et que Léa a écrit « ch »
      Quand Léa choisit « Retour »
      Alors Léa voit la page de la leçon « Dictée : les animaux »
      Mais la pause de la séance ne s'ouvre pas

    # 183.4 A : démarrer le chrono d'une fluence n'est pas une réponse
    @a-valider
    Scénario: Pendant une fluence, sans aucune réponse, Retour ramène à la page de la leçon
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles »
      Quand Léa choisit « Retour »
      Alors Léa voit la page de la leçon « Les doubles »
      Mais la pause de la séance ne s'ouvre pas

  Règle: À partir de la première réponse de la séance, juste, fausse ou « Je ne sais pas », Retour ouvre la pause de la séance

    Plan du Scénario: Après une réponse <genre>, Retour ouvre la pause de la séance
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « <réponse> » à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa choisit « Retour »
      Alors la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »

      Exemples:
        | genre  | réponse |
        | juste  | ou      |
        | fausse | on      |

    # 183.2 A : « Je ne sais pas » est une réponse
    @a-valider
    Scénario: Après « Je ne sais pas », Retour ouvre la pause de la séance
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Et que Léa a dit « Je ne sais pas » à cette question
      Quand Léa choisit « Retour »
      Alors la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »

    # 183.3 A : le mot dicté écrit en entier est une réponse
    @a-valider
    Scénario: En dictée, après un mot écrit en entier, Retour ouvre la pause de la séance
      Étant donné que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Et que Léa a écrit « chas »
      Quand Léa choisit « Retour »
      Alors la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »

    # 183.4 A : une réponse pendant le chrono d'une fluence est une réponse
    @a-valider
    Scénario: Pendant une fluence, après des calculs réussis, Retour ouvre la pause de la séance
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles », avec 2 calculs réussis
      Quand Léa choisit « Retour »
      Alors la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »

    # 183.5 A : la séance n'est pas encore terminée tant que la fin de la séance n'est pas affichée
    @a-valider
    Scénario: Après la dernière bonne réponse, avant la fin de la séance, Retour ouvre la pause de la séance
      Étant donné que la tablette est en Muet
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 7 »
      Quand Léa choisit « Retour »
      Alors la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »

    Scénario: Une réponse donnée ne s'efface pas : après « Je continue la leçon », Retour rouvre la pause de la séance
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Et que Léa a fermé la pause de la séance en choisissant « Je continue la leçon »
      Quand Léa choisit « Retour »
      Alors la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »

    # 183.9 A : aucun avertissement sur les réponses non gardées
    @a-valider
    Scénario: La pause de la séance ne fait aucun reproche, n'affiche aucun compte à rebours et ne prévient de rien
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Quand Léa choisit « Retour »
      Alors la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »
      Mais la pause de la séance n'affiche ni compte à rebours, ni reproche, ni avertissement

  Règle: « Je continue la leçon » ferme la pause de la séance : la séance reprend au même exercice, sans rien perdre

    Scénario: Après une réponse fausse, « Je continue la leçon » laisse la même question posée
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « on » à la question « Dans le mot « poule », quel son entends-tu ? »
      Et que la pause de la séance est ouverte
      Quand Léa choisit « Je continue la leçon »
      Alors la pause de la séance se ferme
      Et la question « Dans le mot « poule », quel son entends-tu ? » reste posée
      Et l'avancement de la séance montre toujours 0 question réussie sur 6

    Scénario: « Je continue la leçon » garde les questions réussies
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa a réussi la question « Dans le mot « poule », quel son entends-tu ? »
      Et que Léa en est à la question « Dans le mot « mouton », quel son entends-tu à la fin ? »
      Et que la pause de la séance est ouverte
      Quand Léa choisit « Je continue la leçon »
      Alors la question « Dans le mot « mouton », quel son entends-tu à la fin ? » reste posée
      Et le compteur de l'avancement de la séance affiche toujours « 1 / 6 »

    Scénario: La pause de la séance n'ajoute ni n'efface aucune erreur : une erreur avant la pause donne 2 étoiles
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Et que Léa a fermé la pause de la séance en choisissant « Je continue la leçon »
      Quand Léa répond « 7 »
      Alors Léa voit 2 étoiles allumées sur 3

    # 183.6 A : la pause de la séance n'arrête pas le chrono de la fluence
    @a-valider
    Scénario: Pendant une fluence, la pause de la séance n'arrête pas le chrono et garde les calculs réussis
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles », avec 2 calculs réussis
      Et que la pause de la séance est ouverte
      Quand Léa choisit « Je continue la leçon »
      Alors Léa voit toujours 2 calculs réussis
      Et le temps de la fluence a continué de passer pendant la pause de la séance

  Règle: « Retour à la leçon » ramène à la page de la leçon ; la séance quittée n'est pas gardée

    Scénario: « Retour à la leçon » ramène à la page de la leçon, coupe la voix et ne change pas les étoiles
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a réussi la question « Dans le mot « poule », quel son entends-tu ? »
      Et que la pause de la séance est ouverte
      Quand Léa choisit « Retour à la leçon »
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Et Léa n'entend plus Noisette
      Et la page de la leçon montre 0 étoile pour Léa

    Scénario: Une séance quittée par « Retour à la leçon » recommence du début
      Étant donné que Léa a quitté la séance complète de la leçon « Les sons ou, on, an » après 3 questions réussies
      Quand Léa commence de nouveau la séance complète
      Alors Léa entend Noisette lire la première étape de leçon
      Et le compteur de l'avancement de la séance affiche « 0 / 15 »

  Règle: Échap et le geste retour suivent la même règle que Retour ; la pause de la séance se ferme sans rien changer

    Scénario: Au clavier, Échap ferme la pause de la séance et la même question attend Léa
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Et que la pause de la séance est ouverte
      Quand Léa appuie sur la touche Échap
      Alors la pause de la séance se ferme
      Et la question « Combien font 3 + 4 ? » reste posée

    Plan du Scénario: Le geste retour, quand <situation>, fait comme le bouton Retour
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que <situation>
      Quand Léa revient en arrière
      Alors <résultat>

      Exemples:
        | situation                                                                                  | résultat                                                                                                             |
        | Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »                  | Léa voit la page de la leçon « Les sons ou, on, an »                                                                 |
        | Léa a répondu « on » à la question « Dans le mot « poule », quel son entends-tu ? »        | la pause de la séance s'ouvre : « On fait une pause ? », avec « Je continue la leçon » et « Retour à la leçon »      |

    # 183.12 (question ajoutée) : le geste retour, la pause de la séance ouverte, la ferme comme Échap
    @a-valider
    Scénario: Quand la pause de la séance est ouverte, le geste retour la ferme et la séance reprend
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Et que la pause de la séance est ouverte
      Quand Léa revient en arrière
      Alors la pause de la séance se ferme
      Et la question « Combien font 3 + 4 ? » reste posée

  Règle: La pause de la séance se lit au lecteur d'écran, en mode dys, au clavier et sans mouvement quand l'appareil le demande

    Scénario: La pause de la séance est annoncée aux lecteurs d'écran par son titre, « Je continue la leçon » en premier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Quand Léa choisit « Retour »
      Alors les lecteurs d'écran annoncent la fenêtre « On fait une pause ? »
      Et « Je continue la leçon » est le choix mis en avant, atteint en premier au clavier

    Scénario: Avec le mode dys, la pause de la séance s'affiche en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Quand Léa choisit « Retour »
      Alors Léa voit « On fait une pause ? » et ses deux choix en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: Quand l'appareil demande des mouvements réduits, la pause de la séance apparaît sans glisser
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Quand Léa choisit « Retour »
      Alors la pause de la séance apparaît sans glisser

    Scénario: Sur un écran de 360 px de large, les choix de la pause de la séance se touchent facilement
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Quand Léa choisit « Retour »
      Alors chaque choix de la pause de la séance mesure au moins 52 px de haut
      Et la page tient dans la largeur de l'écran

  Règle: Le personnage guide n'est montré que quand il réagit ; pendant une question, la consigne prend toute la largeur de la bulle

    Scénario: Pendant une question, la consigne s'affiche seule dans la bulle, sans le personnage guide à côté
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa est sur la page de la leçon « Compter »
      Quand Léa commence la séance complète
      Alors Léa voit la consigne « Touche le bon nombre. »
      Et Léa ne voit pas Noisette à côté de la consigne

    # 183.13 (question ajoutée) : la parole du personnage guide reste écrite près de lui pendant qu'il réagit
    @a-valider
    Scénario: Après une bonne réponse, Noisette se montre à la place de la consigne, puis la consigne revient
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? » puis « Combien font 1 + 1 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Quand Léa répond « 3 »
      Alors Noisette se montre à la place de la consigne, avec sa félicitation
      Et ensuite seulement, Léa voit la consigne « Touche le bon nombre. »
      Et Léa ne voit pas Noisette à côté de la consigne

    # 183.13 A (question ajoutée)
    @a-valider
    Scénario: Après une réponse fausse, Noisette se montre à la place de la consigne avec son encouragement, puis la même question attend Léa
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Quand Léa répond faux
      Alors Noisette se montre à la place de la consigne, avec son encouragement
      Et ensuite seulement, Léa voit la consigne « Touche le bon nombre. »
      Et la question « Combien font 2 + 1 ? » reste posée

  Règle: Un seul bouton « Réécouter » : pendant une question il relit la consigne, après une réponse il redit la parole du personnage guide

    # 183.8 A : « Relire la consigne » n'a plus de bouton à lui
    @a-valider
    Scénario: La séance ne propose qu'un seul « Réécouter », sans « Relire la consigne »
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa est sur la page de la leçon « Compter »
      Quand Léa commence la séance complète
      Alors la séance propose un seul « Réécouter » et aucun « Relire la consigne »

    # 183.10 (question ajoutée) : la question est-elle relue après la consigne ?
    @a-valider
    Scénario: Pendant une question, « Réécouter » relit la consigne et laisse la question posée
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Et que Noisette a fini de lire la question « Combien font 2 + 1 ? »
      Quand Léa demande à réécouter
      Alors Léa entend de nouveau Noisette lire « Touche le bon nombre. »
      Et Léa voit la question « Combien font 2 + 1 ? » avec ses choix

    # 183.10 (question ajoutée) : sans consigne, la question est relue
    @a-valider
    Scénario: Dans un exercice sans consigne, « Réécouter » relit la question
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Noisette a fini de lire la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa demande à réécouter
      Alors Léa entend de nouveau Noisette lire « Dans le mot « poule », quel son entends-tu ? »

    Scénario: Après « Je ne sais pas », « Réécouter » redit la parole du personnage guide
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Et que Léa en est à la question « Combien font 3 + 4 ? »
      Et que Léa a dit « Je ne sais pas » à cette question
      Quand Léa demande à réécouter
      Alors Léa entend de nouveau Noisette dire « Pas de souci, on apprend ensemble ! La bonne réponse brille : touche-la. »
      Et seul le choix « 7 » reste, et il brille

  Règle: La barre d'action, en bas de l'écran, porte le bouton principal et « Je ne sais pas » ; elle ne propose « Valider » que quand l'exercice en a besoin

    Scénario: Pendant une étape de leçon, « Continuer » est dans la barre d'action
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Quand la troisième étape de leçon s'affiche
      Alors « Continuer » est dans la barre d'action, en bas de l'écran

    Scénario: Dans un exercice bulles, la barre d'action porte « Je ne sais pas » sans « Valider » : Léa répond en touchant une bulle
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Quel son entends-tu ? »
      Alors « Je ne sais pas » est dans la barre d'action, en bas de l'écran
      Mais la barre d'action ne propose pas « Valider »

    Scénario: Au clavier de cristaux, « Valider » et « Je ne sais pas » sont dans la barre d'action, « Valider » mis en avant
      Étant donné que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et qu'une leçon de test de niveau CE1 a un exercice calcul « 12 − 5 », de résultat 7, sans aide
      Quand Tom commence cet exercice
      Alors « Valider » et « Je ne sais pas » sont dans la barre d'action, en bas de l'écran
      Et « Je ne sais pas » est plus discret que « Valider », placé à côté
      Et « Valider » et « Je ne sais pas » mesurent au moins 52 px de haut

    # Question 3 de l'issue : tous les types d'exercices dans cette story ?
    @a-valider
    Scénario: Dans un exercice classer, « Je ne sais pas » est aussi dans la barre d'action
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors « Je ne sais pas » est dans la barre d'action, en bas de l'écran

  Règle: Sur un téléphone de 360 × 740, l'exercice et ses boutons se voient dès le début, sans défiler

    Scénario: Dans un exercice bulles, la question, ses choix et « Je ne sais pas » se voient sans défiler
      Étant donné que l'écran de l'appareil mesure 360 px de large et 740 px de haut
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Quel son entends-tu ? »
      Alors le début de l'exercice est à 200 px au plus du haut de l'écran
      Et la question « Dans le mot « poule », quel son entends-tu ? », ses choix et « Je ne sais pas » se voient sans faire défiler l'écran
      Et la page tient dans la largeur de l'écran

    Scénario: Au clavier de cristaux, le calcul, le clavier, « Valider » et « Je ne sais pas » se voient sans défiler
      Étant donné que l'écran de l'appareil mesure 360 px de large et 740 px de haut
      Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et qu'une leçon de test de niveau CE1 a un exercice calcul « 12 − 5 », de résultat 7, sans aide
      Quand Tom commence cet exercice
      Alors le début de l'exercice est à 200 px au plus du haut de l'écran
      Et le calcul, le clavier de cristaux, « Valider » et « Je ne sais pas » se voient sans faire défiler l'écran

    Scénario: Sur un écran de 360 px de large, Retour, le choix Son/Muet et « Réécouter » se touchent facilement
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors chaque commande de la séance mesure au moins 44 px de haut et de large
      Et la page tient dans la largeur de l'écran
