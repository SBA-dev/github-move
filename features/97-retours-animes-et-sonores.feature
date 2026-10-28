# language: fr
@issue-97 @wip
Fonctionnalité: Retours animés et sonores pendant la séance
  En tant qu'enfant
  Je veux que chaque réponse, chaque point gagné et chaque fin de séance se voient et s'entendent
  Afin de sentir tout de suite que j'ai réussi, ou que je peux réessayer

  La story ajoute des effets sonores et des animations, dans tous les types d'exercices, en séance de révision
  et au test de départ. Elle ne change aucune étoile, aucun avancement, aucun record ni aucune parole du personnage
  guide (règle d'or de Motivation). Les commentaires « Décision 97.n » renvoient aux décisions du PO de
  docs/stories/97/acceptance.md ; « Question 97.n » renvoie à une question encore ouverte, et le scénario qui en
  dépend porte le tag @a-valider.
  Le Muet coupe la parole, pas les effets sonores (décision 97.2) ; seuls les écrans du parent n'en font entendre
  aucun (décision 97.13).

  Mots employés dans ces scénarios :
  - « l'effet sonore « … » » : un des 8 effets sonores choisis par le PO (docs/sons.md), nommés par leur événement :
    « réponse juste », « réponse fausse », « point du récipient », « texte complet », « séance terminée »,
    « grande victoire », « découverte », « bouton touché ». Ce sont des sons d'interface courts, sans voix ni parole ;
  - « Léa entend l'effet sonore « … », puis Noisette dit … » : la parole commence quand l'effet sonore est fini,
    jamais par-dessus ; « avant que Noisette dise … » laisse la place à d'autres effets sonores entre les deux ;
  - « Léa n'entend aucune parole » : ni le personnage guide ni aucune lecture à voix haute ; un effet sonore peut
    se faire entendre (c'est ce qui se passe en Muet) ;
  - « le choix « … » rebondit » : il grossit un peu puis revient à sa taille, avec la couleur de réussite
    (skill gamification, section 3 : 1 → 1,15 → 1) ; « se balance doucement » : léger balancement de côté
    (±6 px, 2 allers-retours) ;
  - « un point vole jusqu'au récipient » : le récipient est l'interface de l'avancement de la séance (glossaire) ;
  - « des étincelles », « des confettis », « le compteur défile » : mots d'interface, comme « mouvements réduits » ;
  - durées, pour l'implémentation et la review, jamais dans les étapes : premier retour en moins de 300 ms,
    retour de 150 à 400 ms, célébration de 1,5 s au plus, effets sonores de la fin de moins de 2 s en tout.

  Leçons utilisées, toutes déjà employées par d'autres stories : la question de test « Combien font 3 + 4 ? »
  (#6 : choix « 6 », « 7 », « 8 » et « 9 », de réponse « 7 ») ; « Les sons ou, on, an » (bulles « Quel son
  entends-tu ? », classer « Les maisons des sons », séance complète de 15 questions, #16 à #18) ; « Les syllabes »
  (ordre « Le mot en morceaux » : « do », « mi », « no », #18) ; « Être et avoir au présent » (texte à trous
  « Les phrases magiques » et conjugaison « Le verbe être », #18 et #19) ; « Les doubles » (fluence « Calcul rapide :
  les doubles », #20) ; les leçons de test « Les sons de test » et « La suite de test » (#24) ; la bibliothèque de
  test des révisions (#28) et celle du test de départ (#27).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt » : son
  personnage guide est Noisette.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Après chaque réponse, un effet sonore se fait entendre tout de suite, avant le personnage guide : un son de réussite et un rebond pour une réponse juste, un son doux et un léger balancement pour une réponse fausse, jamais de croix ni de rouge plein écran

    Scénario: Une réponse juste fait entendre « réponse juste », puis la félicitation du personnage guide
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste » avant que Noisette dise une félicitation
      Et le choix « 7 » rebondit
      Et Noisette applaudit en sautant

    # Décision 97.4
    Scénario: Une réponse fausse fait entendre un son doux, puis l'encouragement, sans croix ni rouge plein écran
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors Léa entend l'effet sonore « réponse fausse », puis Noisette dit un encouragement
      Et le choix « 8 » se balance doucement
      Mais aucune croix ni aucun rouge plein écran n'apparaît
      Et la question « Combien font 3 + 4 ? » reste posée

    Plan du Scénario: Dans <exercice>, une bonne réponse fait entendre « réponse juste »
      Étant donné que <situation>
      Quand <réponse de Léa>
      Alors Léa entend l'effet sonore « réponse juste » avant que Noisette parle

      Exemples:
        | exercice                       | situation                                                                                   | réponse de Léa                                   |
        | un exercice bulles             | Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »           | Léa répond « ou »                                |
        | un texte à trous               | Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent » | Léa répond « suis »                          |
        | un exercice ordre              | Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »           | Léa pose l'étiquette « do »                      |

    Scénario: Une bonne forme de conjugaison, sans félicitation, fait quand même entendre « réponse juste »
      Étant donné que Léa joue seulement l'exercice « Le verbe être » de la leçon « Être et avoir au présent »
      Quand Léa répond « suis »
      Alors Léa entend l'effet sonore « réponse juste »
      Et Noisette applaudit en sautant, sans dire de félicitation

    Scénario: Une étiquette posée dans la mauvaise maison fait entendre « réponse fausse » et revient
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « on »
      Alors Léa entend l'effet sonore « réponse fausse », puis Noisette dit un encouragement
      Et l'étiquette « loup » revient parmi les étiquettes à poser

    # Décision 97.11
    Scénario: « Je ne sais pas » ne fait entendre aucun son d'erreur
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa dit « Je ne sais pas »
      Alors Léa n'entend pas l'effet sonore « réponse fausse »
      Et seul le choix « 7 » reste, et il brille
      Et Noisette dit « Pas de souci, on apprend ensemble ! La bonne réponse brille : touche-la. »

    # Décision 97.19
    Scénario: Après « Je ne sais pas », la bonne réponse donnée par l'enfant fait entendre « réponse juste »
      Étant donné que Léa a dit « Je ne sais pas » à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa répond « chat »
      Alors Léa entend l'effet sonore « réponse juste » avant que Noisette dise une félicitation

    Scénario: En séance de révision, une réponse fausse fait entendre « réponse fausse », puis l'encouragement
      Étant donné que la bibliothèque de test des révisions est servie
      Et que Léa a pour questions retenues de la leçon « Les sons de révision » :
        | question               | date de révision |
        | Quel mot a le son ou ? | aujourd'hui      |
      Et que Léa en est à la question « Quel mot a le son ou ? » de la séance de révision
      Quand Léa répond « lit » à la question « Quel mot a le son ou ? »
      Alors Léa entend l'effet sonore « réponse fausse », puis Noisette dit un encouragement, suivi de « Essaie une autre bulle. »

    Scénario: Au test de départ, une réponse juste fait entendre « réponse juste »
      Étant donné que la bibliothèque de test du test de départ est servie
      Et que Léa en est à la question de « Les voyelles » du test de départ
      Quand Léa répond juste à la question de « Les voyelles »
      Alors Léa entend l'effet sonore « réponse juste »

    # Décision 97.10
    Plan du Scénario: Pendant la fluence, une <réponse> fait entendre « <effet sonore> », sans point qui vole
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles », avec 3 calculs réussis
      Quand Léa donne une <réponse>
      Alors Léa entend l'effet sonore « <effet sonore> »
      Mais aucun point ne vole jusqu'au récipient

      Exemples:
        | réponse        | effet sonore   |
        | bonne réponse  | réponse juste  |
        | réponse fausse | réponse fausse |

  Règle: Une question réussie fait voler un point jusqu'au récipient avec « point du récipient » ; la dernière réponse d'un exercice à plusieurs réponses sur le même écran (texte à trous, ordre, classer, conjugaison, memoriser) fait pleuvoir des étincelles avec « texte complet », à la place de « réponse juste »

    # Décision 97.5
    Scénario: Une question réussie fait voler un point jusqu'au récipient, après le son de la réponse juste
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors un point vole jusqu'au récipient
      Et Léa entend les effets sonores « réponse juste » puis « point du récipient », puis Noisette dit une félicitation
      Et l'avancement de la séance montre 1 question réussie sur 15

    Scénario: Une erreur ne fait voler aucun point
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « on »
      Alors aucun point ne vole jusqu'au récipient
      Et Léa n'entend pas l'effet sonore « point du récipient »
      Et l'avancement de la séance montre toujours 0 question réussie sur 15

    Scénario: Après une erreur, la bonne réponse fait quand même voler le point
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « on » à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors un point vole jusqu'au récipient
      Et Léa entend l'effet sonore « point du récipient »

    # Décision 97.5
    Scénario: Au dernier trou, des étincelles et « texte complet » remplacent « réponse juste »
      Étant donné que Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent »
      Et que Léa a rempli les trois premiers trous
      Quand Léa répond « ont »
      Alors des étincelles apparaissent autour du texte
      Et Léa entend l'effet sonore « texte complet » avant que Noisette dise une félicitation, suivie de « Le texte est complet ! »
      Mais Léa n'entend pas l'effet sonore « réponse juste »

    # Décision 97.5
    Scénario: La dernière étiquette d'un ordre fait pleuvoir des étincelles avec « texte complet »
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé les étiquettes « do » et « mi »
      Quand Léa pose l'étiquette « no »
      Alors des étincelles apparaissent autour des étiquettes
      Et Léa entend l'effet sonore « texte complet » avant que Noisette dise une félicitation
      Mais Léa n'entend pas l'effet sonore « réponse juste »

    Scénario: Une étiquette d'un ordre qui n'est pas la dernière ne fait pas pleuvoir d'étincelles
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors aucune étincelle n'apparaît
      Et Léa n'entend pas l'effet sonore « texte complet »

    # Décision 97.6
    Plan du Scénario: <dernière réponse> fait aussi pleuvoir des étincelles avec « texte complet »
      Étant donné que Léa joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Et que <où en est Léa>
      Quand <réponse de Léa>
      Alors des étincelles apparaissent
      Et Léa entend l'effet sonore « texte complet »
      Mais Léa n'entend pas l'effet sonore « réponse juste »

      Exemples:
        | dernière réponse                       | exercice             | leçon                     | où en est Léa                                   | réponse de Léa                                      |
        | La dernière étiquette d'un classer     | Les maisons des sons | Les sons ou, on, an       | il ne reste que l'étiquette « dent » à poser    | Léa pose l'étiquette « dent » dans la maison « an » |
        | La dernière personne d'une conjugaison | Le verbe être        | Être et avoir au présent  | Léa en est à « ils … ? »                        | Léa répond « sont »                                 |
        | Le dernier mot caché d'un memoriser    | Au clair de la lune  | Chanson : Au clair de la lune | il ne reste que le mot caché « amour » à retrouver | Léa répond « amour »                       |

  Règle: La fin d'une séance se fête : les étoiles apparaissent une à une, des confettis tombent, et un effet sonore de fin se fait entendre avant la phrase de fin ; « grande victoire » quand la séance rend la leçon acquise, puis « découverte » pour un nouvel objet de la cabane ou un nouvel épisode

    Scénario: À la fin de la séance, les étoiles apparaissent une à une, puis des confettis tombent
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa n'a fait aucune erreur pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors les 3 étoiles apparaissent une à une, puis des confettis tombent
      Et l'écran indique en texte « 3 étoiles sur 3 »

    # Décision 97.7
    Plan du Scénario: Une séance terminée <cas> fait entendre <effets sonores> avant la phrase de fin
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa a terminé <séances avant>
      Et que Léa a gagné <total avant> étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait <erreurs> erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Léa entend <effets sonores>, puis Noisette dit sa phrase de fin

      Exemples:
        | cas                                                       | séances avant | total avant | erreurs | effets sonores                                              |
        | à 1 étoile, sans nouveauté                                | 20 séances    | 6           | 5       | l'effet sonore « séance terminée »                          |
        | à 1 étoile, qui ouvre un épisode                          | 0 séance      | 6           | 5       | les effets sonores « séance terminée » puis « découverte »  |
        | qui rend la leçon acquise, sans nouveauté                 | 20 séances    | 6           | 2       | l'effet sonore « grande victoire »                          |
        | qui rend la leçon acquise et fait recevoir un objet       | 20 séances    | 8           | 2       | les effets sonores « grande victoire » puis « découverte »  |
        | qui fait recevoir un objet et ouvre un épisode            | 0 séance      | 8           | 2       | les effets sonores « grande victoire » puis « découverte »  |

    # Décision 97.7
    Scénario: Rejouer une leçon déjà acquise fait entendre « séance terminée », pas « grande victoire »
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa a terminé 20 séances
      Et que Léa a pour meilleures étoiles :
        | leçon            | étoiles |
        | Les sons de test | 2       |
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors Léa entend l'effet sonore « séance terminée », puis Noisette dit sa phrase de fin
      Mais Léa n'entend pas l'effet sonore « grande victoire »

    # Décisions 97.9 et 97.16
    Scénario: La fin de la séance de révision fait entendre « séance terminée » et « découverte », avec des confettis, sans étoile
      Étant donné que la bibliothèque de test des révisions est servie
      Et que Léa a 3 questions dues de la leçon « Les nombres de révision »
      Et que Léa a commencé la séance de révision
      Quand Léa répond juste à toutes les questions de la séance de révision
      Alors Léa entend les effets sonores « séance terminée » puis « découverte », puis Noisette dit sa phrase de fin
      Et des confettis tombent
      Mais la fin de la séance de révision ne montre aucune étoile

    # Décisions 97.9 et 97.16
    Scénario: La fin du test de départ fait entendre seulement « séance terminée », avec des confettis
      Étant donné que la bibliothèque de test du test de départ est servie
      Et que Léa a répondu au test de départ jusqu'à « Les additions »
      Quand Léa répond juste à la question de « Le son an »
      Alors Léa entend l'effet sonore « séance terminée », puis Noisette dit sa phrase de fin
      Et des confettis tombent
      Mais Léa n'entend ni l'effet sonore « grande victoire » ni l'effet sonore « découverte »

  Règle: Un record de fluence se fête : le compteur défile jusqu'au nouveau record et « grande victoire » se fait entendre avant que le personnage guide l'annonce ; sans record, rien de plus

    # Décision 97.8
    Plan du Scénario: À la fin de la fluence, <cas> fait défiler le compteur et entendre « grande victoire »
      Étant donné que Léa <record avant> à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Quand le temps de la fluence est écoulé avec 12 calculs réussis
      Alors le compteur défile jusqu'au nouveau record, 12
      Et Léa entend l'effet sonore « grande victoire » avant que Noisette annonce son <record>, 12

      Exemples:
        | cas               | record avant             | record         |
        | un premier record | n'a pas encore de record | premier record |
        | un nouveau record | a un record de 10        | nouveau record |

    Scénario: Quand le record reste, le compteur ne défile pas et « grande victoire » ne se fait pas entendre
      Étant donné que Léa a un record de 15 à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Quand le temps de la fluence est écoulé avec 12 calculs réussis
      Alors aucun compteur ne défile jusqu'à un record
      Et Léa n'entend pas l'effet sonore « grande victoire »

    Scénario: Un score de fluence de 0 n'est pas fêté comme un record
      Étant donné que Léa n'a pas encore de record à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Quand le temps de la fluence est écoulé avec 0 calculs réussis
      Alors aucun compteur ne défile jusqu'à un record
      Et Léa n'entend pas l'effet sonore « grande victoire »

    # Décision 97.18
    Scénario: Une séance faite seulement d'une fluence, avec un record, fait entendre « grande victoire » une seule fois
      Étant donné que Léa a un record de 10 à la fluence « Calcul rapide : les doubles »
      Et que Léa joue seulement l'exercice « Calcul rapide : les doubles »
      Quand le temps de la fluence est écoulé avec 12 calculs réussis
      Alors Léa entend une seule fois l'effet sonore « grande victoire »
      Et Léa n'entend pas l'effet sonore « séance terminée »

  Règle: Un effet sonore passe avant la parole, jamais par-dessus : le Muet coupe la parole, pas les effets sonores ; sur un écran du parent, aucun effet sonore ; quand la voix manque, les effets sonores restent

    Scénario: Un effet sonore et la parole du personnage guide ne se chevauchent jamais
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors Léa n'entend jamais un effet sonore et Noisette en même temps

    # Décision 97.2
    Scénario: En Muet, une réponse juste fait entendre « réponse juste », sans parole, et se voit toujours
      Étant donné que la tablette est en Muet
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste »
      Mais Léa n'entend aucune parole
      Et le choix « 7 » rebondit

    # Décision 97.2
    Scénario: En Muet, la fin de la séance fait entendre son effet sonore, sans phrase de fin dite
      Étant donné que la tablette est en Muet
      Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Léa entend l'effet sonore « séance terminée »
      Mais Léa n'entend aucune parole

    # Décision 97.2, question 97.24
    @a-valider
    Scénario: Passer en Muet pendant l'effet sonore de fin le laisse finir, sans phrase de fin dite
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa entend l'effet sonore « séance terminée » à la fin de la séance de la leçon « Les sons de test »
      Quand Léa passe en Muet
      Alors Léa entend l'effet sonore « séance terminée » jusqu'au bout
      Mais Léa n'entend aucune parole

    Scénario: Pendant la fluence, une nouvelle réponse coupe l'effet sonore de la précédente
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles », avec 3 calculs réussis
      Quand Léa donne deux bonnes réponses aussitôt l'une après l'autre
      Alors Léa n'entend jamais deux effets sonores en même temps

    # Décision 97.13
    Scénario: En arrivant sur un écran du parent, l'effet sonore en cours s'arrête
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa entend l'effet sonore « séance terminée » à la fin de la séance de la leçon « Les sons de test »
      Quand Léa demande l'entrée de l'espace parent
      Alors Léa voit une question du contrôle parental
      Et Léa n'entend plus l'effet sonore « séance terminée »

    # Décision 97.14
    Scénario: Quand le navigateur ne sait pas lire à voix haute, les effets sonores se font quand même entendre
      Étant donné que le navigateur ne sait pas lire à voix haute
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste »
      Et Noisette applaudit en sautant

    # Décision 97.14
    Scénario: Un effet sonore qui ne peut pas être joué n'empêche jamais la parole
      Étant donné que l'appareil ne peut pas jouer les effets sonores
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Noisette dit une félicitation commune ou l'une de ses expressions, en entier
      Et Léa ne voit aucun message de plus

    @pwa
    Scénario: Sans réseau, après un premier chargement, les effets sonores se font entendre
      Étant donné que Savanturier a déjà été chargé une fois sur la tablette
      Et que le réseau est coupé
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste »

  Règle: Une célébration ne retient jamais l'enfant et se vit sans mouvement : avec les mouvements réduits, l'information reste sans animation ; un toucher hors des boutons ne l'interrompt pas ; les boutons et le clavier ne sont jamais bloqués ; le lecteur d'écran annonce le résultat une seule fois

    Scénario: Avec les mouvements réduits, les étoiles de fin s'affichent sans animation et sans confettis
      Étant donné que l'appareil demande des mouvements réduits
      Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa n'a fait aucune erreur pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Léa voit 3 étoiles allumées sur 3, sans animation
      Et aucun confetti ne tombe

    Scénario: Avec les mouvements réduits, une réponse juste ne rebondit pas, et le point s'ajoute au récipient sans voler
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors le choix « ou » prend la couleur de réussite sans rebondir
      Et aucun point ne vole jusqu'au récipient
      Mais l'avancement de la séance montre 1 question réussie sur 15

    Scénario: Avec les mouvements réduits, une réponse fausse ne se balance pas, et l'encouragement est dit
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 8 »
      Alors le choix « 8 » ne se balance pas
      Et Noisette dit un encouragement

    # Décision 97.14
    Scénario: Avec les mouvements réduits, les effets sonores se font toujours entendre
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste » avant que Noisette dise une félicitation

    # Décision 97.17
    Scénario: Toucher l'écran en dehors des boutons pendant les confettis ne change rien
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa voit tomber les confettis de la fin de la séance de la leçon « Les sons de test »
      Quand Léa touche l'écran en dehors des boutons
      Alors les confettis tombent toujours
      Et Léa entend l'effet sonore de fin jusqu'au bout

    # Question 97.22
    @a-valider
    Scénario: Pendant les confettis, toucher « Accueil » mène tout de suite à l'accueil
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa voit tomber les confettis de la fin de la séance de la leçon « Les sons de test »
      Quand Léa choisit « Accueil »
      Alors Léa voit son accueil
      Et Léa n'entend plus l'effet sonore de fin

    Scénario: Pendant les confettis, le clavier n'est jamais bloqué
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa voit tomber les confettis de la fin de la séance de la leçon « Les sons de test »
      Quand Léa choisit « Accueil » au clavier
      Alors Léa voit son accueil

    # Décision 97.15
    Plan du Scénario: Les lecteurs d'écran annoncent une seule fois « <annonce> »
      Étant donné que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait <erreurs> erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors les lecteurs d'écran annoncent une seule fois « <annonce> »

      Exemples:
        | erreurs | annonce                |
        | 0       | Tu as gagné 3 étoiles  |
        | 5       | Tu as gagné 1 étoile   |

  Règle: Toucher un bouton d'un écran de l'enfant fait entendre « bouton touché » ; un bouton qui donne une réponse garde le son de la réponse, et les écrans du parent restent sans effet sonore

    # Décision 97.12
    Plan du Scénario: <geste> fait entendre « bouton touché »
      Étant donné que <situation>
      Quand <geste>
      Alors Léa entend l'effet sonore « bouton touché »

      Exemples:
        | geste                                           | situation                                                                                 |
        | Léa demande à réécouter la consigne             | Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an » |
        | Léa ouvre « Mes médailles » depuis son accueil  | Léa a terminé 1 séance                                                                    |
        | Léa rejoue                                      | Léa a terminé une séance de l'exercice « Dernières bulles » seul                          |

    # Décision 97.12
    Scénario: Un choix de réponse fait entendre le son de la réponse, pas « bouton touché »
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste »
      Mais Léa n'entend pas l'effet sonore « bouton touché »

    # Décision 97.19
    Scénario: « Je ne sais pas » fait entendre « bouton touché », jamais « réponse fausse »
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa dit « Je ne sais pas »
      Alors Léa entend l'effet sonore « bouton touché »
      Mais Léa n'entend pas l'effet sonore « réponse fausse »

    # Question 97.21
    @a-valider
    Scénario: En Muet, demander à réécouter la consigne fait entendre « bouton touché », sans parole
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa demande à réécouter la consigne
      Alors Léa entend l'effet sonore « bouton touché »
      Mais Léa n'entend aucune parole
      Et Léa voit la consigne « Range chaque mot dans la maison de son son. »

    # Décision 97.12
    Plan du Scénario: Remettre le son <écran> ne fait entendre aucun effet sonore
      Étant donné que la tablette est en Muet
      Et que <situation>
      Quand <qui> remet le son
      Alors <qui> n'entend aucun effet sonore

      Exemples:
        | écran                     | situation                                                 | qui  |
        | pendant une séance        | Léa joue la question de test « Combien font 3 + 4 ? »     | Léa  |
        | dans l'espace parent      | l'espace parent est affiché sur la tablette               | Paul |

    # Décisions 97.12 et 97.13
    Plan du Scénario: Sur <écran du parent>, toucher un bouton ne fait entendre aucun effet sonore
      Étant donné que <situation>
      Quand <geste>
      Alors Paul n'entend aucun effet sonore

      Exemples:
        | écran du parent                   | situation                                         | geste                                   |
        | la question du contrôle parental  | le contrôle parental pose la question « 7 × 8 »   | Paul répond « 56 » au contrôle parental |
        | l'espace parent                   | Paul est dans l'espace parent                     | Paul ouvre les réglages de Léa          |
