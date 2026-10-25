# language: fr
@issue-73 @wip
Fonctionnalité: Aucune voix sur les écrans du parent
  En tant que parent
  Je veux que le personnage guide ne lise rien quand je me connecte ou que je suis dans l'espace parent
  Afin de ne pas être surpris par sa voix sur des écrans qui ne sont pas destinés à l'enfant

  Les écrans du parent sont l'écran de connexion du parent (« Se connecter », « Créer ton compte », « Mot de passe oublié »),
  « Qui joue ? » (avec ou sans profil enfant), la question du contrôle parental et l'espace parent.
  Les autres écrans sont des écrans de l'enfant : la voix y reste celle de #7, #12 et #15.
  « Noisette dit « … » » vérifie la bulle du personnage guide ; « entend » et « n'entend aucune voix » vérifient la voix.

  Règle: Sur un écran du parent, le personnage guide ne lit rien de lui-même, et ce qu'il dit reste affiché

    Plan du Scénario: Sur l'écran « <écran> », aucune voix ne se fait entendre
      Étant donné que Paul n'est pas connecté sur la tablette
      Quand j'ouvre l'écran « <écran> »
      Alors Paul n'entend aucune voix

      Exemples:
        | écran               |
        | Se connecter        |
        | Créer ton compte    |
        | Mot de passe oublié |

    Scénario: Juste après l'inscription, l'invitation à créer le premier profil s'affiche sans être lue
      Étant donné qu'aucun parent n'utilise l'adresse "paul@exemple.test"
      Quand Paul s'inscrit avec "paul@exemple.test", le mot de passe du parent "Abcdefg%" et la confirmation "Abcdefg%"
      Alors il voit l'espace parent, sans aucun profil enfant
      Et Noisette dit « Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. »
      Mais Paul n'entend aucune voix

    Scénario: Un parent sans profil enfant se connecte : l'invitation à créer le premier profil s'affiche sans être lue
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que personne n'est connecté sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors il voit l'espace parent, sans aucun profil enfant
      Et Noisette dit « Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. »
      Mais Paul n'entend aucune voix

    Scénario: Sur « Qui joue ? » sans profil enfant, l'invitation à créer le premier profil s'affiche sans être lue
      Étant donné que Paul est connecté sur la tablette
      Et que Paul n'est rattaché à aucun profil enfant
      Quand j'ouvre Savanturier
      Alors Noisette dit « Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. »
      Mais Paul n'entend aucune voix

    Scénario: En quittant l'espace parent sans profil enfant, l'invitation à créer le premier profil n'est pas lue
      Étant donné que Paul n'est rattaché à aucun profil enfant
      Et que Paul est dans l'espace parent
      Quand Paul quitte l'espace parent
      Alors Noisette dit « Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. »
      Mais Paul n'entend aucune voix

    @a-valider
    Scénario: Sur « Qui joue ? » avec des profils enfants, aucune voix ne se fait entendre
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand j'ouvre Savanturier
      Alors je vois « Qui joue ? » avec le profil enfant de Léa
      Et Léa n'entend aucune voix

    Scénario: Pendant la question du contrôle parental, aucune voix ne se fait entendre
      Étant donné que Paul est connecté sur la tablette
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul demande l'entrée de l'espace parent
      Alors Paul voit une question du contrôle parental
      Et Paul n'entend aucune voix

    Scénario: Dans l'espace parent, aucune voix ne se fait entendre
      Étant donné que Paul est connecté sur la tablette
      Et que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 56 » au contrôle parental
      Alors il voit l'espace parent
      Et Paul n'entend aucune voix

    Scénario: L'invitation à créer le premier profil reste annoncée au lecteur d'écran
      Étant donné que Paul est connecté sur la tablette
      Et que Paul n'est rattaché à aucun profil enfant
      Quand j'ouvre Savanturier
      Alors l'invitation à créer le premier profil est annoncée au lecteur d'écran
      Mais Paul n'entend aucune voix

  Règle: En arrivant sur un écran du parent, la lecture en cours s'arrête

    Plan du Scénario: Pendant la lecture d'une consigne, <ce que fait Léa> arrête la voix
      Étant donné que Paul est connecté sur la tablette
      Et que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand <ce que fait Léa>
      Alors <ce que Léa voit>
      Et Léa n'entend plus Noisette

      Exemples:
        | ce que fait Léa                                      | ce que Léa voit                            |
        | Léa demande l'entrée de l'espace parent              | Léa voit une question du contrôle parental |
        | Léa revient à l'accueil par le nom de l'application  | Léa voit « Qui joue ? »                    |

    Scénario: Pendant que Noisette salue Léa, changer d'enfant arrête la voix
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Noisette est en train de saluer Léa sur son accueil
      Quand Léa demande à changer d'enfant
      Alors Léa voit « Qui joue ? »
      Et Léa n'entend plus Noisette

    Scénario: La consigne coupée ne reprend pas dans l'espace parent
      Étant donné que Paul est connecté sur la tablette
      Et que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Et que Léa a demandé l'entrée de l'espace parent, et le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 56 » au contrôle parental
      Alors il voit l'espace parent
      Et Paul n'entend aucune voix

  Règle: Sur un écran de l'enfant, la voix se comporte comme avant, même en revenant d'un écran du parent

    Scénario: Après l'espace parent, le personnage guide salue l'enfant qui choisit son profil
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Paul est entré dans l'espace parent, puis l'a quitté
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa entend Noisette dire « Bonjour Léa ! »

    Scénario: Après avoir renoncé au contrôle parental, Léa réécoute la question
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a demandé l'entrée de l'espace parent, puis a renoncé à répondre au contrôle parental
      Quand Léa demande à réécouter la question
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? »

    @a-valider
    Scénario: Le profil créé dans l'espace parent, la proposition du test de départ est lue à l'enfant
      Étant donné que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Léa" de niveau CE1 dans l'univers « Animaux de la forêt »
      Alors la proposition du test de départ s'affiche pour Léa
      Et Léa entend Noisette lui proposer le test de départ

  Règle: Passer par un écran du parent ne change jamais le choix Son/Muet de l'appareil

    Plan du Scénario: Une tablette en <choix> l'est toujours après l'espace parent
      Étant donné que la tablette est en <choix>
      Et que Paul est dans l'espace parent
      Quand Paul quitte l'espace parent
      Alors la tablette est toujours en <choix>

      Exemples:
        | choix |
        | Son   |
        | Muet  |

    Scénario: En Muet avant l'espace parent, la consigne suivante n'est toujours pas lue
      Étant donné que la tablette est en Muet
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Paul est entré dans l'espace parent, puis l'a quitté
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa n'entend rien

    @a-valider
    Plan du Scénario: Sur <écran>, Paul peut passer la tablette en Muet
      Étant donné que <écran> est affiché sur la tablette
      Quand Paul passe en Muet
      Alors le choix Son/Muet montre Muet

      Exemples:
        | écran                                |
        | l'écran « Se connecter »             |
        | « Qui joue ? »                       |
        | la question du contrôle parental     |
        | l'espace parent                      |

    @a-valider
    Plan du Scénario: Sur <écran>, remettre le son ne fait rien lire
      Étant donné que la tablette est en Muet
      Et que <écran> est affiché sur la tablette
      Quand Paul remet le son
      Alors le choix Son/Muet montre Son
      Mais Paul n'entend aucune voix

      Exemples:
        | écran                                |
        | l'écran « Se connecter »             |
        | « Qui joue ? »                       |
        | la question du contrôle parental     |
        | l'espace parent                      |

  Règle: Dans l'espace parent, l'essai de voix reste entendu, mais seulement quand le parent le demande

    @a-valider
    Scénario: Dans l'espace parent, Paul entend l'essai de voix qu'il demande
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que personne ne jouait sur la tablette
      Et que Paul est entré dans l'espace parent
      Quand Paul écoute la voix « Denise (Natural) »
      Alors Paul entend Noisette dire « Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! » avec la voix « Denise (Natural) »

    Scénario: Ouvrir le choix de voix ne fait pas lire l'essai de voix
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul voit le titre « La voix des personnages guides »
      Mais Paul n'entend aucune voix
