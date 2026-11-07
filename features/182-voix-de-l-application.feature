# language: fr
@issue-182
Fonctionnalité: La voix de l'application lit à voix haute sans rien installer sur l'appareil
  En tant qu'enfant
  Je veux entendre mon personnage guide lire les consignes, les questions et ses paroles sur n'importe quel appareil,
  sans qu'un adulte installe quoi que ce soit
  Afin de faire mes leçons même si je lis encore mal

  La voix de l'application est la même pour tous les personnages guides (questions 182.3 et 182.4). Une phrase qui
  « a un son de phrase » figure dans le répertoire des sons servi avec l'application ; une phrase qui « n'a pas de
  son de phrase » n'y figure pas (calcul tiré au hasard, leçon personnelle, question de test absente du répertoire).
  « Léa entend Noisette lire … » sans autre précision vaut quelle que soit la voix : ces scénarios de #7, #15, #73,
  #79 et #97 restent vrais sans changer un mot ; ceux qui nomment la voix de l'appareil avec la voix automatique
  sont revus (voir docs/stories/182/acceptance.md, non-régression).
  La question de test « Combien font 3 + 4 ? » a quatre choix « 6 », « 7 », « 8 » et « 9 », de réponse « 7 »,
  seule dans sa séance (comme dans #79). La vérification sur un vrai téléphone sans voix française (Honor Magic) est
  manuelle (définition de « terminé ») : aucun scénario ne la remplace.

  Règle: La voix de l'application lit en français toute phrase qui a son son de phrase, même sur un appareil sans voix française

    Scénario: Sur un appareil sans voix française, la consigne est lue par la voix de l'application
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Range chaque mot dans la maison de son son. » a un son de phrase
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa entend Noisette lire « Range chaque mot dans la maison de son son. » avec la voix de l'application
      Et Léa ne voit ni le message de voix absente ni le message de voix bloquée

    Scénario: Sur un appareil sans voix française, la question est lue par la voix de l'application
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » a un son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? » avec la voix de l'application
      Et Léa voit la question « Combien font 3 + 4 ? »

    Scénario: Sur un appareil sans voix française, la félicitation du personnage guide est dite par la voix de l'application
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que les félicitations de Noisette ont leur son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste » avant que Noisette dise une félicitation avec la voix de l'application

    Scénario: Sur un appareil sans voix française, Coach Léo lit la consigne avec la voix de l'application
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a choisi l'univers sports
      Et que la phrase « Écoute bien. » a un son de phrase
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Coach Léo lire « Écoute bien. » avec la voix de l'application

    Scénario: Sur un navigateur qui ne sait pas lire à voix haute, la voix de l'application lit quand même
      Étant donné que le navigateur ne sait pas lire à voix haute
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » a un son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? » avec la voix de l'application
      Et aucun message d'erreur n'apparaît

    Scénario: En remettant le son, le personnage guide se présente avec la voix de l'application
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a choisi l'univers princesse
      Et que la tablette est en Muet
      Quand Léa remet le son
      Alors Léa entend Lumi dire « Je t'entends ! Je suis Lumi. » avec la voix de l'application

  Règle: Une phrase sans son de phrase est lue par la voix de l'appareil, phrase par phrase, sans changer la voix des autres phrases

    Scénario: Une question sans son de phrase est lue par la voix de l'appareil
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » n'a pas de son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? » avec la voix « Denise (Natural) »
      Et aucun message d'erreur n'apparaît

    Scénario: Dans une même lecture, chaque phrase garde sa voix, dans l'ordre, jamais deux voix en même temps
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que la phrase « Touche le bon nombre. » a un son de phrase, mais pas la phrase « Combien font 2 + 1 ? »
      Et que Léa est sur la page de la leçon « Compter »
      Quand Léa commence la séance complète
      Alors Léa entend Noisette lire « Touche le bon nombre. » avec la voix de l'application, puis « Combien font 2 plus 1 ? » avec la voix « Denise (Natural) »
      Et Léa n'entend jamais deux lectures en même temps

    Scénario: Un son de phrase qui ne peut pas être joué laisse la voix de l'appareil lire la phrase, sans message
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que le son de phrase de « Combien font 3 + 4 ? » ne peut pas être joué
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? » avec la voix « Denise (Natural) »
      Et aucun message d'erreur n'apparaît

    Scénario: Le mot à écouter garde la voix anglaise de l'appareil
      Étant donné que l'appareil a une voix française et une voix anglaise
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue l'exercice « Quel animal ? » de la leçon « Les animaux »
      Quand l'item « a cat » commence
      Alors Léa entend ensuite « a cat » lu avec la voix anglaise

  Règle: Sans son de phrase et sans voix française sur l'appareil, la phrase n'est pas dite : l'enfant voit le message de voix absente et joue quand même

    Scénario: Sans son de phrase ni voix française, la question n'est pas dite et le message de voix absente apparaît
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » n'a pas de son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit le message « Noisette ne peut pas lire cette phrase sur cet appareil. Tu peux la lire avec un adulte. »
      Mais Léa ne voit pas le message de voix bloquée

    Scénario: Le message de voix absente nomme le personnage guide de l'univers
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a choisi l'univers sports
      Et que la phrase « Écoute bien. » n'a pas de son de phrase
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa voit le message « Coach Léo ne peut pas lire cette phrase sur cet appareil. Tu peux la lire avec un adulte. »

    Scénario: Sans son de phrase, une voix étrangère de l'appareil ne lit jamais une phrase en français
      Étant donné que l'appareil n'a qu'une voix anglaise
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » n'a pas de son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa n'entend rien
      Et Léa voit le message « Noisette ne peut pas lire cette phrase sur cet appareil. Tu peux la lire avec un adulte. »

    Scénario: Le message de voix absente n'est jamais affiché deux fois
      Étant donné que l'appareil n'a aucune voix française
      Et qu'aucune phrase de la séance n'a de son de phrase
      Et que Léa a déjà vu le message de voix absente
      Quand la consigne suivante s'affiche
      Alors Léa voit un seul message de voix absente

    Scénario: Quand une phrase suivante est entendue, le message de voix absente disparaît
      Étant donné que l'appareil n'a aucune voix française
      Et qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? » puis « Combien font 1 + 1 ? »
      Et que la phrase « Combien font 2 + 1 ? » n'a pas de son de phrase, mais la phrase « Combien font 1 + 1 ? » en a un
      Et que Léa joue la séance complète de la leçon « Compter »
      Quand Léa répond « 3 »
      Alors Léa entend Noisette lire « Combien font 1 plus 1 ? » avec la voix de l'application
      Et Léa ne voit plus le message de voix absente

    Scénario: Sans voix, l'enfant répond et réussit la question
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » n'a pas de son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors la question « Combien font 3 + 4 ? » est réussie

    Scénario: Quand la félicitation de la dernière réponse n'est pas dite, elle attend que Léa continue
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et qu'aucune phrase de la séance n'a de son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa voit une félicitation de Noisette
      Et Léa peut continuer quand elle est prête

  Règle: La voix bloquée ne désigne plus que le refus du navigateur de jouer, avec la voix de l'application comme avec la voix de l'appareil

    Scénario: Quand le navigateur refuse de jouer la voix de l'application, l'enfant voit le message de voix bloquée
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » a un son de phrase
      Et que le navigateur bloque la voix
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit le message « La voix de Noisette est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte. »
      Mais Léa ne voit pas le message de voix absente

    Scénario: Quand le navigateur ne bloque plus la voix, Réécouter fait entendre la voix de l'application
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » a un son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que la voix a été bloquée pendant la lecture de la question « Combien font 3 + 4 ? »
      Et que le navigateur ne bloque plus la voix
      Quand Léa demande à réécouter la question
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? » avec la voix de l'application

  Règle: Avec la voix de l'application, la lecture à voix haute garde ses règles : Muet, voix suspendue, une seule lecture à la fois, arrêt, lecture lente, effets sonores avant la parole

    Scénario: En Muet, une question qui a son son de phrase s'affiche sans être lue
      Étant donné que la tablette est en Muet
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 + 4 ? » a un son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit la question « Combien font 3 + 4 ? »
      Mais Léa n'entend rien

    Scénario: Passer en Muet coupe la voix de l'application
      Étant donné que la phrase « Écoute bien l'histoire du petit chat. » a un son de phrase
      Et que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa passe en Muet
      Alors Léa n'entend plus Noisette

    Scénario: Une nouvelle lecture coupe la voix de l'application en cours
      Étant donné que la phrase « Écoute bien l'histoire du petit chat. » a un son de phrase
      Et que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa demande à réécouter la consigne
      Alors la lecture reprend depuis le début de la consigne
      Et Léa n'entend jamais deux lectures en même temps

    Scénario: Quitter la séance en cours coupe la voix de l'application
      Étant donné que les phrases de la leçon « Les sons ou, on, an » ont leur son de phrase
      Et que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Noisette est en train de lire la première étape de leçon
      Quand Léa quitte la séance
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Et Léa n'entend plus Noisette

    Plan du Scénario: Pendant la voix de l'application, <ce que fait Léa> arrête la voix
      Étant donné que Paul est connecté sur la tablette
      Et que la phrase « Écoute bien l'histoire du petit chat. » a un son de phrase
      Et que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand <ce que fait Léa>
      Alors <ce que Léa voit>
      Et Léa n'entend plus Noisette

      Exemples:
        | ce que fait Léa                                      | ce que Léa voit                            |
        | Léa demande l'entrée de l'espace parent              | Léa voit une question du contrôle parental |
        | Léa revient à l'accueil par le nom de l'application  | Léa voit « Qui joue ? »                    |

    Scénario: L'effet sonore de la réponse juste passe avant la voix de l'application, jamais par-dessus
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que les félicitations de Noisette ont leur son de phrase
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste » avant que Noisette dise une félicitation avec la voix de l'application
      Et Léa n'entend jamais un effet sonore et Noisette en même temps

    Scénario: Écouter plus lentement fait entendre le son de phrase du mot dicté plus lentement
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que le mot dicté « chat » a un son de phrase
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa demande à écouter plus lentement
      Alors Léa entend de nouveau Noisette dire « chat », plus lentement, avec la voix de l'application

    Scénario: Pendant la voix de l'application, les mots de la consigne sont surlignés dans l'ordre
      Étant donné que Léa a choisi l'univers animaux
      Et que la phrase « Lis la phrase avec Noisette. » a un son de phrase
      Quand la consigne « Lis la phrase avec Noisette. » s'affiche
      Alors chaque mot de la consigne est surligné à son tour, dans l'ordre, pendant que Noisette lit avec la voix de l'application
      Et plus aucun mot n'est surligné quand la lecture est finie

  Règle: La voix automatique lit avec la voix de l'application ; une voix imposée par le parent lit toutes les phrases à sa place

    Scénario: Avec la voix automatique, la voix de l'application passe avant la voix de l'appareil
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que personne n'a imposé de voix sur la tablette
      Et que Léa a choisi l'univers animaux
      Et que la phrase « Écoute bien. » a un son de phrase
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire « Écoute bien. » avec la voix de l'application

    Scénario: Une voix imposée par le parent lit la consigne, même quand elle a son son de phrase
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Léa a choisi l'univers animaux
      Et que la phrase « Écoute bien. » a un son de phrase
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne avec la voix « Amélie (compact) »

    Scénario: Sur un appareil sans voix française, le parent n'est plus invité à installer une voix
      Étant donné que l'appareil n'a aucune voix française
      Et que la voix de l'application est disponible
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors « Automatique (recommandé) » est choisi
      Et « Automatique (recommandé) » porte la mention « actuellement : voix de l'application »
      Mais Paul ne voit pas le message « Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page. »

    Scénario: Écouter la voix automatique fait entendre l'essai de voix avec la voix de l'application
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que personne ne jouait sur la tablette
      Et que Paul est entré dans l'espace parent
      Quand Paul écoute la voix « Automatique (recommandé) »
      Alors Paul entend Noisette dire « Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! » avec la voix de l'application

  Règle: La voix de l'application ne dit jamais le prénom de l'enfant ; le texte affiché le garde

    Scénario: Le personnage guide salue l'enfant sans dire son prénom, qui reste affiché
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa entend Noisette dire « Bonjour ! » avec la voix de l'application
      Et Léa voit que Noisette dit « Bonjour Léa ! »

  Règle: Une leçon lancée avec le réseau se lit jusqu'au bout sans réseau

    @pwa
    Scénario: Sans réseau, la suite de la leçon lancée est lue par la voix de l'application
      Étant donné que l'appareil n'a aucune voix française
      Et que Savanturier a déjà été chargé une fois sur la tablette
      Et que Léa a commencé avec le réseau la séance complète de la leçon « Les sons ou, on, an »
      Et que le réseau est coupé
      Quand Léa en arrive à la question « Dans le mot « mouton », quel son entends-tu à la fin ? »
      Alors Léa entend Noisette lire « Dans le mot mouton, quel son entends-tu à la fin ? » avec la voix de l'application

    @pwa
    Scénario: Sans réseau, une phrase dont le son de phrase n'est pas sur l'appareil est lue par la voix de l'appareil
      Étant donné que l'appareil a une voix française et une voix anglaise
      Et que Savanturier a déjà été chargé une fois sur la tablette
      Et que Léa n'a jamais joué la leçon « Les syllabes » sur la tablette
      Et que le réseau est coupé
      Quand Léa choisit seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Alors Léa entend Noisette lire « Remets les syllabes dans l'ordre pour écrire « domino ». » avec la voix de l'appareil

    @pwa
    Scénario: Après une séance terminée avec le réseau, la leçon suivante du parcours se lit sans réseau
      Étant donné que l'appareil n'a aucune voix française
      Et que Savanturier a déjà été chargé une fois sur la tablette
      Et que Léa a terminé avec le réseau la séance de la leçon « Les sons ou, on, an »
      Et que le réseau est coupé
      Quand Léa commence la séance de la leçon suivante de son parcours
      Alors Léa entend Noisette lire la première étape de leçon avec la voix de l'application
