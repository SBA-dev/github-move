# language: fr
@issue-7
Fonctionnalité: Lecture à voix haute par le personnage guide
  En tant qu'enfant qui ne lit pas encore bien
  Je veux que le personnage guide me lise les consignes à voix haute
  Afin de pouvoir jouer seul

  La consigne est celle d'un exercice d'une leçon de test, jouée dans une vraie séance : elle s'affiche dans la bulle
  du personnage guide et elle est lue au début de l'exercice. Les scénarios qui regardent ce qui reste affiché ou
  ce qui est réécouté une fois la lecture finie portent sur une question de test, qui reste posée jusqu'à la bonne
  réponse (#17).

  Règle: Le personnage guide lit la consigne à voix haute, une seule lecture à la fois

    @issue-58 @a-valider
    Scénario: La consigne est lue à voix haute dès qu'elle s'affiche
      Étant donné que Léa a choisi l'univers animaux
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa entend Noisette lire « Trouve le mot qui commence par le son [a]. »
      Et Léa voit la consigne « Trouve le mot qui commence par le son [a]. »

    Scénario: Le mot prononcé est surligné pendant la lecture
      Étant donné que Léa a choisi l'univers animaux
      Quand la consigne « Lis la phrase avec Noisette. » s'affiche
      Alors chaque mot de la consigne est surligné au moment où Noisette le prononce
      Et plus aucun mot n'est surligné quand la lecture est finie

    Scénario: Une nouvelle lecture coupe la lecture en cours
      Étant donné que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa demande à réécouter la consigne
      Alors la lecture reprend depuis le début de la consigne
      Et Léa n'entend jamais deux lectures en même temps

    Scénario: Quitter l'écran coupe la voix
      Étant donné que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa quitte l'écran de la consigne
      Alors Léa n'entend plus Noisette

  Règle: Le texte est lu comme on le dit à voix haute, jamais avec ses symboles

    Plan du Scénario: Les symboles d'une consigne sont dits avec des mots
      Étant donné que Léa a choisi l'univers animaux
      Quand la consigne « <consigne> » s'affiche
      Alors Léa entend Noisette lire « <ce que Léa entend> »

      Exemples:
        | consigne                          | ce que Léa entend                   |
        | Combien font 3 + 4 ?              | Combien font 3 plus 4 ?             |
        | 3 + 4 = 7                         | 3 plus 4 égale 7                    |
        | Lis le mot « maman ».             | Lis le mot maman.                   |

    Scénario: Un trou à compléter est lu comme un silence
      Étant donné que Léa a choisi l'univers animaux
      Quand la consigne « Le chat ___ du lait. » s'affiche
      Alors Léa entend Noisette lire « Le chat », puis un court silence, puis « du lait. »
      Mais Léa n'entend jamais lire les soulignés

    @issue-58 @a-valider
    Scénario: Un texte sans rien à dire n'est pas lu
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et qu'une question de test « ___ » a les choix « 2 », « 3 » et « 4 », de réponse « 2 »
      Quand la question « ___ » s'affiche
      Alors Léa n'entend rien
      Et aucun message d'erreur n'apparaît

  Règle: La voix a le caractère du personnage guide de l'univers choisi

    Plan du Scénario: Le personnage guide parle avec sa voix à lui
      Étant donné que l'appareil a une voix française féminine et une voix française masculine
      Et que Léa a choisi l'univers <univers>
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend <personnage guide> lire la consigne avec une voix <voix>

      Exemples:
        | univers   | personnage guide | voix      |
        | animaux   | Noisette         | féminine  |
        | princesse | Lumi             | féminine  |
        | sports    | Coach Léo        | masculine |
        | pompier   | Capitaine Sam    | masculine |

    Scénario: La voix la plus naturelle de l'appareil est choisie
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne avec la voix « Denise (Natural) »

    Scénario: Sans voix d'homme sur l'appareil, un personnage guide masculin parle plus grave
      Étant donné que l'appareil n'a qu'une voix française féminine
      Et que Léa a choisi l'univers pompier
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Capitaine Sam lire la consigne avec cette voix, en plus grave

    Scénario: Sans univers choisi, c'est Noisette qui lit
      Étant donné que Léa n'a pas encore choisi d'univers
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne

  Règle: En Muet, rien n'est lu, et ce choix est mémorisé sur l'appareil

    Scénario: Le son est activé au premier lancement
      Étant donné que Savanturier n'a jamais été ouvert sur la tablette
      Quand j'ouvre Savanturier
      Alors le son est activé

    @issue-58 @a-valider
    Scénario: En Muet, la question s'affiche sans être lue
      Étant donné que la tablette est en Muet
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit la question « Combien font 3 + 4 ? »
      Mais Léa n'entend rien

    Scénario: Passer en Muet coupe la lecture en cours
      Étant donné que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa passe en Muet
      Alors Léa n'entend plus Noisette

    Scénario: Le Muet reste choisi au lancement suivant
      Étant donné que Léa a passé la tablette en Muet
      Quand Léa relance Savanturier
      Alors la tablette est toujours en Muet

    Scénario: En remettant le son, le personnage guide se présente
      Étant donné que Léa a choisi l'univers princesse
      Et que la tablette est en Muet
      Quand Léa remet le son
      Alors Léa entend Lumi dire « Je t'entends ! Je suis Lumi. »

  Règle: Sans voix, l'enfant peut quand même jouer

    @issue-58 @a-valider
    Scénario: Quand la voix est bloquée, l'enfant est prévenu sans être bloqué
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que le navigateur bloque la voix
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit le message « La voix de Noisette est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte. »
      Et Léa voit la question « Combien font 3 + 4 ? »

    Scénario: Le message de voix bloquée n'apparaît qu'une fois
      Étant donné que le navigateur bloque la voix
      Et que Léa a déjà vu le message de voix bloquée
      Quand la consigne suivante s'affiche
      Alors le message de voix bloquée n'apparaît pas de nouveau

    @issue-58 @a-valider
    Scénario: Réécouter permet de réessayer quand la voix était bloquée
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que la voix a été bloquée pendant la lecture de la question « Combien font 3 + 4 ? »
      Et que le navigateur ne bloque plus la voix
      Quand Léa demande à réécouter la question
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? »

    @issue-58 @a-valider
    Scénario: Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même
      Étant donné que le navigateur ne sait pas lire à voix haute
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors la question « Combien font 3 + 4 ? » est réussie
      Et aucun message d'erreur n'apparaît
