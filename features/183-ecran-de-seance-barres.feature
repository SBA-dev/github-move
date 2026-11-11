# language: fr
@issue-183
Fonctionnalité: Écran de séance : une barre du haut et une barre d'action en bas pour laisser la place à la leçon
  En tant qu'enfant
  Je veux voir tout de suite l'exercice et le bouton pour répondre, sans faire défiler l'écran
  Afin de rester concentré sur ce que j'apprends

  Contexte Apprentissage (docs/stories/183/domain-model.md). Story d'interface : la séance de leçon seulement
  (séance complète et séance d'un exercice). Le test de départ, la séance de révision et la séance de défi gardent
  leur présentation (réponse 183.1). La fin de la séance garde la sienne (réponse 183.8).
  Décisions 1 à 7 du PO du 2026-11-07 (corps de l'issue #183). Cadrage validé par le PO le 2026-11-11 : toutes
  les recommandations sont retenues (docs/stories/183/criteres.md, « Décisions »).

  Mots d'interface employés dans ces scénarios (hors glossaire, comme « récipient ») :
  - « la barre du haut » : Retour (une flèche, nom « Retour »), le nom de la leçon, le son, puis la barre de
    progression et le compteur « 2 / 6 », qui montrent l'avancement de la séance ;
  - « la barre d'action » : en bas de l'écran, le bouton principal (« Valider », « Continuer ») et, à côté,
    « Je ne sais pas », plus discret ;
  - « la pause » : la feuille « On fait une pause ? » (glossaire, « Pause »).

  Leçon de la bibliothèque utilisée : « Les sons ou, on, an » (fr-cp-sons-ou-on-an : 3 étapes de leçon, un
  exercice bulles « Quel son entends-tu ? » et un exercice classer « Les maisons des sons », 15 questions).
  Cet exercice bulles n'a pas de consigne : les scénarios qui regardent la consigne d'un exercice bulles jouent la
  leçon de test « Compter » (exercice bulles de consigne « Touche le bon nombre. », choix « 1 », « 2 », « 3 »,
  réponse « 3 »). Les autres leçons sont citées dans les scénarios.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Pendant la séance, une seule barre du haut remplace l'en-tête de l'application : Retour, nom de la leçon, son, et l'avancement de la séance

    Scénario: Pendant la séance, Léa voit la barre du haut et plus l'en-tête de l'application
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors Léa voit en haut de l'écran Retour, le nom de la leçon « Les sons ou, on, an » et le son
      Mais Léa ne voit ni « Savanturier », ni son prénom et sa classe, ni « Espace parent »
      Et Léa ne voit ni la classe ni la matière de la leçon
      Et les lecteurs d'écran annoncent la séance sous le nom « Les sons ou, on, an »

    Plan du Scénario: <moment>, l'avancement de la séance se lit « <compteur> » dans la barre du haut
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Quand <moment>
      Alors Léa voit le compteur « <compteur> » sous la barre de progression
      Et les lecteurs d'écran trouvent une barre de progression à <réussies> sur 15

      Exemples:
        | moment                                                                           | compteur | réussies |
        | la question « Dans le mot « poule », quel son entends-tu ? » s'affiche           | 0 / 15   | 0        |
        | Léa répond « ou » à la question « Dans le mot « poule », quel son entends-tu ? » | 1 / 15   | 1        |

    Scénario: Une question réussie fait avancer la barre de progression, avec un éclat sur le compteur
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors la barre de progression s'allonge et un éclat brille sur le compteur
      Et Léa entend les effets sonores « réponse juste » puis « point du récipient »
      Et l'avancement de la séance montre 1 question réussie sur 15

  Règle: Avant la première réponse de la séance, Retour ramène à la page de la leçon ; à partir d'elle, Retour ouvre la pause ; le geste retour du téléphone ou du navigateur fait de même

    Plan du Scénario: Avant la première réponse, <geste> <moment> ramène à la page de la leçon
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que <moment>
      Quand <geste>
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Mais Léa ne voit pas la pause

      Exemples:
        | geste                                       | moment                                                                             |
        | Léa touche Retour                           | Noisette est en train de lire la première étape de leçon                           |
        | Léa touche Retour                           | la question « Dans le mot « poule », quel son entends-tu ? » s'est affichée        |
        | Léa fait le geste retour du navigateur      | Noisette est en train de lire la première étape de leçon                           |

    Plan du Scénario: Après une première réponse <réponse>, <geste> ouvre la pause
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « <choix> » à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand <geste>
      Alors Léa voit la pause « On fait une pause ? », qui propose d'abord « Je continue la leçon », puis « Retour à la leçon »
      Et Léa ne voit aucun compte à rebours

      Exemples:
        | réponse | choix | geste                                  |
        | juste   | ou    | Léa touche Retour                      |
        | fausse  | on    | Léa touche Retour                      |
        | juste   | ou    | Léa fait le geste retour du navigateur |

    Scénario: « Je ne sais pas » compte comme la première réponse : Retour ouvre la pause
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a dit « Je ne sais pas » à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa touche Retour
      Alors Léa voit la pause « On fait une pause ? »

    Scénario: Dans une fluence, le chrono démarré sans aucune réponse ne suffit pas : Retour ramène à la page de la leçon
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles »
      Et que le chrono de la fluence a démarré, sans aucune réponse de Léa
      Quand Léa touche Retour
      Alors Léa voit la page de la leçon « Les doubles »

  Règle: La pause attend l'enfant sans rien lui reprocher : il continue la leçon là où il en était, ou retourne à la page de la leçon

    Plan du Scénario: <geste> ferme la pause : Léa retrouve sa question là où elle en était
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « on » à la question « Dans le mot « poule », quel son entends-tu ? »
      Et que Léa a ouvert la pause
      Quand <geste>
      Alors Léa ne voit plus la pause
      Et la question « Dans le mot « poule », quel son entends-tu ? » reste posée
      Et l'avancement de la séance montre toujours 0 question réussie sur 15

      Exemples:
        | geste                                    |
        | Léa choisit « Je continue la leçon »     |
        | Léa appuie sur Échap, au clavier         |

    Scénario: « Retour à la leçon » ramène à la page de la leçon et coupe la voix, comme quitter la séance aujourd'hui
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « ou » à la question « Dans le mot « poule », quel son entends-tu ? »
      Et que Léa a ouvert la pause
      Quand Léa choisit « Retour à la leçon »
      Alors Léa voit la page de la leçon « Les sons ou, on, an »
      Et Léa n'entend plus Noisette

    Scénario: Ouvrir la pause arrête la voix du personnage guide
      Étant donné que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « ou » à la question « Dans le mot « poule », quel son entends-tu ? »
      Et que Noisette est en train de dire sa félicitation
      Quand Léa touche Retour
      Alors Léa voit la pause « On fait une pause ? »
      Et Léa n'entend plus Noisette

  Règle: Pendant une question, la consigne prend toute la largeur de la bulle, sans le personnage guide ; il n'apparaît que quand il réagit, puis la consigne revient

    Scénario: Pendant une question, la consigne s'affiche seule dans la bulle, sans le personnage guide
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa voit la consigne « Range chaque mot dans la maison de son son. » sur toute la largeur de la bulle
      Mais Léa ne voit pas Noisette à côté de la consigne

    Scénario: À une réponse juste, Noisette apparaît pour féliciter Léa, puis la consigne revient avec la question suivante
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? » puis « Combien font 1 + 2 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Et que Léa en est à la question « Combien font 2 + 1 ? »
      Quand Léa répond « 3 »
      Alors Noisette apparaît à la place de la bulle et dit une félicitation commune ou l'une de ses expressions, en entier
      Et ensuite seulement, la question « Combien font 1 + 2 ? » s'affiche, avec sa consigne et sans Noisette

    Scénario: À la première réponse fausse, Coach Léo joue sa scène à la place de la bulle, puis la consigne revient et la question reste posée
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « Sports »
      Et qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Quand Léa répond « 1 »
      Alors Coach Léo joue sa scène de réponse fausse
      Et ensuite, Léa voit de nouveau la consigne, sans Coach Léo
      Et la question « Combien font 2 + 1 ? » reste posée

    Scénario: À une réponse fausse suivante, Noisette apparaît pour encourager Léa, puis la consigne revient
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? » puis « Combien font 1 + 2 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Et que Léa a déjà fait une erreur dans la séance
      Et que Léa en est à la question « Combien font 1 + 2 ? »
      Quand Léa répond « 1 »
      Alors Noisette apparaît à la place de la bulle, réfléchit en penchant la tête et dit un encouragement
      Et ensuite, Léa voit de nouveau la consigne, sans Noisette

  Règle: Un seul bouton « Réécouter » : pendant une question, il relit la consigne ; pendant que le personnage guide réagit, il redit sa phrase

    Scénario: Pendant une question, « Réécouter » relit la consigne, et « Relire la consigne » n'est plus un bouton à part
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa demande à réécouter
      Alors Léa entend de nouveau Noisette lire « Remets les syllabes dans l'ordre pour écrire « domino ». »
      Et Léa voit un seul bouton « Réécouter »
      Mais Léa ne voit pas de bouton « Relire la consigne »

    Scénario: Dans un exercice bulles, « Réécouter » relit la consigne, puis la question
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Quand Léa demande à réécouter
      Alors Léa entend de nouveau Noisette lire « Touche le bon nombre. », puis « Combien font 2 plus 1 ? »

    Scénario: Pendant que le personnage guide réagit à une réponse, « Réécouter » redit sa phrase
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Et que Léa a posé l'étiquette « loup » dans la maison « on »
      Quand Léa demande à réécouter pendant que Noisette lui répond
      Alors Léa entend de nouveau Noisette dire « « loup » n'habite pas dans la maison « on ». Essaie une autre maison. »

  Règle: La barre d'action, en bas de l'écran, porte le bouton principal toujours au même endroit, et « Je ne sais pas » à côté ; elle n'apparaît que s'il y a une action

    Scénario: Dans un calcul au clavier de cristaux, « Valider » et « Je ne sais pas » sont dans la barre d'action
      Étant donné que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Et que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand le calcul « 12 − 5 » s'affiche pour Tom
      Alors Tom voit « Valider » en bouton principal de la barre d'action, en bas de l'écran
      Et Tom voit « Je ne sais pas » à côté, plus discret

    Scénario: Pendant les étapes de leçon, « Continuer » est le bouton principal de la barre d'action
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors Léa voit « Continuer » en bouton principal de la barre d'action, en bas de l'écran
      Mais Léa ne voit pas « Je ne sais pas »

    Scénario: Dans un exercice bulles, l'enfant répond en touchant une bulle : la barre d'action ne porte que « Je ne sais pas »
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors Léa voit « Je ne sais pas » dans la barre d'action
      Mais Léa ne voit ni « Valider » ni « Continuer »

  Règle: L'écran de séance s'adapte à l'enfant : petit écran sans défilement, mouvements réduits, mode dys, cibles assez grandes

    Plan du Scénario: Sur un téléphone de 360 × 740 px, <exercice> commence au plus à 200 px du haut, sans défilement de côté
      Étant donné que l'écran de l'appareil mesure 360 px de large et 740 px de haut
      Et que <situation>
      Quand <ce qui s'affiche>
      Alors l'exercice commence au plus à 200 px du haut de l'écran
      Et la page tient dans la largeur de l'écran
      Et chaque commande de la séance mesure au moins 44 px de haut et de large, et les boutons de la barre d'action au moins 52 px de haut

      Exemples:
        | exercice                | situation                                                                              | ce qui s'affiche                                                       |
        | l'exercice bulles       | Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »      | la question « Dans le mot « poule », quel son entends-tu ? » s'affiche |
        | le calcul au clavier    | Tom, de niveau CE1, en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1      | le calcul « 12 − 5 » s'affiche pour Tom                                |

    Plan du Scénario: Avec les mouvements réduits, <ce qui change> sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Et que <situation>
      Quand <ce que fait Léa>
      Alors <ce que Léa voit>

      Exemples:
        | ce qui change                  | situation                                                                           | ce que fait Léa   | ce que Léa voit                                                         |
        | l'avancement de la séance      | Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »           | Léa répond « ou » | la barre de progression montre « 1 / 15 » d'un coup, sans s'allonger ni briller |
        | la pause                       | Léa a répondu « ou » à la question « Dans le mot « poule », quel son entends-tu ? » | Léa touche Retour | la pause « On fait une pause ? » apparaît sans glisser                  |

    Scénario: En mode dys, sur 360 px, le nom de leçon le plus long tient sur deux lignes, sans mot coupé
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Tom a un profil enfant préparé de niveau CM2 dans l'univers « Animaux de la forêt »
      Et que Paul a réglé « mode dys » sur « oui » pour Tom
      Quand Tom commence la séance complète de la leçon « Lire une œuvre : Vingt mille lieues sous les mers »
      Alors Tom lit le nom de la leçon en entier, sur deux lignes au plus, sans mot coupé, en mode dys
      Et les libellés de la barre d'action passent à la ligne sans couper un mot
