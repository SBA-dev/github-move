# language: fr
@issue-17
Fonctionnalité: Exercices à choix (bulles, lecture, écoute)
  En tant qu'enfant
  Je veux répondre à une question en choisissant la bonne réponse parmi des choix, après avoir lu la question, écouté une histoire ou un mot d'anglais
  Afin de vérifier que j'ai compris

  Leçons de la bibliothèque utilisées : « Les sons ou, on, an » (fr-cp-sons-ou-on-an, exercice bulles
  « Quel son entends-tu ? »), « Lecture : Le petit chat Plume » (fr-cp-lecture-petit-chat) et « Les animaux »
  (an-cp-animaux, exercice d'écoute « Quel animal ? »). La question de test « Combien font 3 + 4 ? » a
  quatre choix « 6 », « 7 », « 8 » et « 9 », de réponse « 7 ».

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: La question est lue, puis ses choix apparaissent, mélangés et sans doublon

    Scénario: Les choix apparaissent quand la question a été lue
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors Léa entend Noisette lire « Dans le mot « poule », quel son entends-tu ? »
      Et ensuite seulement, Léa voit les choix « ou », « on » et « an »

    Scénario: Les choix sont proposés dans l'ordre tiré au début de la séance
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que l'ordre des choix tiré au début de la séance est « 8 », « 6 », « 9 », « 7 »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit les choix dans l'ordre « 8 », « 6 », « 9 », « 7 »

    Scénario: Un choix écrit deux fois n'est proposé qu'une fois
      Étant donné qu'une question de test « Combien font 1 + 1 ? » a les choix « 2 », « 2 » et « 3 », de réponse « 2 »
      Quand la question « Combien font 1 + 1 ? » s'affiche
      Alors Léa voit exactement deux choix, « 2 » et « 3 »

    Scénario: « a » et « à » sont deux choix différents
      Étant donné qu'une question de test « Il … un vélo. » a les choix « a », « à » et « a », de réponse « a »
      Quand la question « Il … un vélo. » s'affiche
      Alors Léa voit exactement deux choix, « a » et « à »

    Scénario: L'enfant peut réécouter la question
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Noisette a fini de lire la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa demande à réécouter la question
      Alors Léa entend de nouveau Noisette lire « Dans le mot « poule », quel son entends-tu ? »

  Règle: Le bon choix réussit la question, et la question suivante vient après la félicitation

    Plan du Scénario: La réponse « <réponse> » à « <question> » est juste
      Étant donné que Léa joue la leçon « <leçon> »
      Et que Léa en est à la question « <question> »
      Quand Léa répond « <réponse> »
      Alors Noisette applaudit en sautant
      Et la question « <question> » est réussie

      Exemples:
        | leçon                         | question                                          | réponse            |
        | Les sons ou, on, an           | Dans le mot « poule », quel son entends-tu ?      | ou                 |
        | Les syllabes                  | Combien de syllabes dans « chat » ?               | 1                  |
        | Dictée : les animaux          | Quel mot est bien écrit ?                         | chat               |
        | Lecture : Le petit chat Plume | Où dort Plume ?                                   | sur le lit de Léa  |

    Scénario: La félicitation est dite en entier avant la question suivante
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors Noisette dit une félicitation commune ou l'une de ses expressions, en entier
      Et ensuite seulement, la question « Dans le mot « mouton », quel son entends-tu à la fin ? » s'affiche

  Règle: Un mauvais choix coûte une erreur, il est écarté, et l'enfant a une nouvelle chance

    Plan du Scénario: La réponse « <réponse> » à « Dans le mot « poule », quel son entends-tu ? » est écartée
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « <réponse> »
      Alors Noisette réfléchit en penchant la tête
      Et Noisette dit un encouragement
      Et le choix « <réponse> » reste visible, pâle, et ne réagit plus
      Et la question « Dans le mot « poule », quel son entends-tu ? » reste posée

      Exemples:
        | réponse |
        | on      |
        | an      |

    Scénario: Toucher de nouveau un choix écarté ne coûte pas une seconde erreur
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 8 »
      Quand Léa répond de nouveau « 8 »
      Alors les choix « 6 », « 7 » et « 9 » restent possibles
      Et Noisette ne dit rien de plus

    Scénario: Après deux erreurs sur la même question, il reste deux choix possibles, dont le bon
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que les choix sont affichés dans l'ordre « 6 », « 7 », « 8 », « 9 »
      Et que Léa a répondu « 8 »
      Quand Léa répond « 9 »
      Alors seuls les choix « 6 » et « 7 » restent possibles
      Et les choix écartés « 8 » et « 9 » restent visibles, pâles

    Scénario: Après une erreur, la bonne réponse réussit encore la question
      Étant donné que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa a répondu « on » à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors la question « Dans le mot « poule », quel son entends-tu ? » est réussie
      Et la question « Dans le mot « mouton », quel son entends-tu à la fin ? » s'affiche

  Règle: Avec « tout lire à voix haute », les choix sont lus après la question

    Scénario: Avec « tout lire à voix haute », Noisette lit les choix dans l'ordre affiché
      Étant donné que Paul a réglé « tout lire à voix haute » sur « oui » pour Léa
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que les choix sont affichés dans l'ordre « 6 », « 7 », « 8 », « 9 »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? »
      Et Léa entend ensuite Noisette dire « Est-ce 6, 7, 8, ou 9 ? »

    Scénario: Sans « tout lire à voix haute », les choix ne sont pas lus
      Étant donné que Paul a réglé « tout lire à voix haute » sur « non » pour Léa
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? »
      Mais Léa n'entend pas les choix

  Règle: Lecture : le texte est lu avec le mot surligné, puis l'enfant répond aux questions

    Scénario: L'histoire est présentée, puis lue avec le mot prononcé surligné
      Étant donné que Léa est sur la page de la leçon « Lecture : Le petit chat Plume »
      Quand Léa choisit seulement l'exercice « Le petit chat Plume »
      Alors Léa entend en entier Noisette dire « Installe-toi bien, j'ai une histoire pour toi. Suis les mots avec tes yeux ! »
      Et ensuite Noisette lit le texte « Plume est un petit chat gris. Il dort sur le lit de Léa. … »
      Et chaque mot du texte est surligné au moment où Noisette le prononce

    Scénario: « J'ai écouté » mène à la première question
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa dit qu'elle a écouté
      Alors la question « De quelle couleur est Plume ? » s'affiche avec les choix « gris », « noir » et « blanc »

    Scénario: Le texte de lecture reste affiché pendant les questions
      Étant donné que Noisette a lu le texte de l'exercice « Le petit chat Plume »
      Quand Léa dit qu'elle a écouté
      Alors Léa voit toujours le texte « Plume est un petit chat gris. … » au-dessus de la question « De quelle couleur est Plume ? »

  Règle: Écoute : le mot à écouter est dit par une voix anglaise, et il n'est jamais écrit

    Scénario: La question est lue, puis le mot à écouter est dit par la voix anglaise
      Étant donné que l'appareil a une voix française et une voix anglaise
      Et que Léa joue l'exercice « Quel animal ? » de la leçon « Les animaux »
      Quand l'item « a cat » commence
      Alors Léa entend Noisette lire « Écoute bien. Que veut dire cette phrase ? »
      Et Léa entend ensuite « a cat » lu avec la voix anglaise
      Mais « a cat » n'est jamais écrit à l'écran

    Scénario: Sans question, l'écoute pose la question par défaut
      Étant donné qu'une leçon de test a un exercice d'écoute dont l'item « a dog » n'a pas de question
      Quand l'item « a dog » commence
      Alors Léa entend Noisette lire « Écoute bien ! Que veut dire ce mot ? »

    Scénario: « Écouter » redit le mot à écouter
      Étant donné que Léa joue l'item « a cat » de l'exercice « Quel animal ? »
      Quand Léa demande à écouter de nouveau
      Alors Léa entend de nouveau « a cat » lu avec la voix anglaise

    Scénario: La bonne réponse est expliquée après la félicitation
      Étant donné que Léa joue l'item « a cat » de l'exercice « Quel animal ? »
      Quand Léa répond « un chat »
      Alors Noisette dit une félicitation, suivie de « « a cat », c'est « un chat ». »

    Scénario: Après une erreur, l'encouragement est entendu en entier, puis le mot est redit
      Étant donné que Léa joue l'item « a cat » de l'exercice « Quel animal ? »
      Quand Léa répond « un chien »
      Alors Léa entend en entier un encouragement de Noisette, suivi de « Écoute encore. »
      Et Léa entend ensuite « a cat » lu avec la voix anglaise

    Scénario: En Muet, l'écoute prévient l'enfant qu'elle a besoin du son
      Étant donné que la tablette est en Muet
      Quand Léa commence l'exercice « Quel animal ? » de la leçon « Les animaux »
      Alors Léa voit le message « Pour écouter l'anglais, j'ai besoin du son : active-le avec le bouton ci-dessous. »
      Et le son peut être activé par « Activer le son »

  Règle: Les exercices à choix s'utilisent en mode dys, au clavier et sur un petit écran

    Scénario: Avec le mode dys, la question et les choix s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Quand la question « Dans le mot « poule », quel son entends-tu ? » s'affiche
      Alors Léa voit la question et les choix en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: Au clavier, Léa répond sans souris
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou », au clavier seulement
      Alors la question « Dans le mot « poule », quel son entends-tu ? » est réussie

    Scénario: Les choix tiennent dans un écran de 360 px de large et se touchent du doigt
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue la leçon « Lecture : Le petit chat Plume »
      Quand la question « Où dort Plume ? » s'affiche
      Alors la page tient dans la largeur de l'écran
      Et chaque choix mesure au moins 44 px de haut et de large
