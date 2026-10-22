# language: fr
@issue-7 @wip
Fonctionnalité: Lecture à voix haute par le personnage guide
  En tant qu'enfant qui ne lit pas encore bien
  Je veux que le personnage guide me lise les consignes à voix haute
  Afin de pouvoir jouer seul

  Règle: Le personnage guide lit la consigne à voix haute, une seule lecture à la fois

    Scénario: La consigne est lue à voix haute dès qu'elle s'affiche
      Étant donné que Léa a choisi l'univers animaux
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa entend Noisette lire « Trouve le mot qui commence par le son [a]. »
      Et la consigne reste affichée à l'écran

    Scénario: L'enfant peut réécouter la consigne
      Étant donné que Léa a choisi l'univers animaux
      Et que Noisette a fini de lire la consigne « Range les nombres du plus petit au plus grand. »
      Quand Léa demande à réécouter la consigne
      Alors Léa entend de nouveau Noisette lire « Range les nombres du plus petit au plus grand. »

    @a-valider
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

    Scénario: La mise en forme de la consigne n'est jamais prononcée
      Étant donné que Léa a choisi l'univers animaux
      Et que la consigne « Trouve le mot chat dans la phrase. » montre le mot « chat » en gras
      Quand cette consigne s'affiche
      Alors Léa entend Noisette lire « Trouve le mot chat dans la phrase. »

    Scénario: Un texte sans rien à dire n'est pas lu
      Étant donné que Léa a choisi l'univers animaux
      Quand une consigne qui ne contient que « ___ » s'affiche
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

    @a-valider
    Scénario: Sans univers choisi, c'est Noisette qui lit
      Étant donné que Léa n'a pas encore choisi d'univers
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne

    Scénario: Une consigne en anglais est lue avec une voix anglaise
      Étant donné que l'appareil a une voix française et une voix anglaise
      Et que Léa fait une leçon d'anglais
      Quand la consigne « Listen and repeat: cat. » s'affiche
      Alors Léa entend « Listen and repeat: cat. » lu avec la voix anglaise

  Règle: En Muet, rien n'est lu, et ce choix est mémorisé sur l'appareil

    Scénario: Le son est activé au premier lancement
      Étant donné que Savanturier n'a jamais été ouvert sur la tablette
      Quand j'ouvre Savanturier
      Alors le son est activé

    Scénario: En Muet, la consigne s'affiche sans être lue
      Étant donné que la tablette est en Muet
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa voit la consigne « Écoute bien. »
      Mais Léa n'entend rien

    Scénario: Passer en Muet coupe la lecture en cours
      Étant donné que Noisette est en train de lire la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa passe en Muet
      Alors Léa n'entend plus Noisette

    Scénario: Le Muet reste choisi au lancement suivant
      Étant donné que Léa a passé la tablette en Muet
      Quand Léa relance Savanturier
      Alors la tablette est toujours en Muet

    @a-valider
    Scénario: En remettant le son, le personnage guide se présente
      Étant donné que Léa a choisi l'univers princesse
      Et que la tablette est en Muet
      Quand Léa remet le son
      Alors Léa entend Lumi dire « Je t'entends ! Je suis Lumi. »

  Règle: Sans voix, l'enfant peut quand même jouer

    Scénario: Quand la voix est bloquée, l'enfant est prévenu sans être bloqué
      Étant donné que Léa a choisi l'univers animaux
      Et que le navigateur bloque la voix
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa voit le message « La voix de Noisette est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte. »
      Et Léa voit la consigne « Écoute bien. »

    @a-valider
    Scénario: Le message de voix bloquée n'apparaît qu'une fois
      Étant donné que le navigateur bloque la voix
      Et que Léa a déjà vu le message de voix bloquée
      Quand la consigne suivante s'affiche
      Alors le message de voix bloquée n'apparaît pas de nouveau

    Scénario: Réécouter permet de réessayer quand la voix était bloquée
      Étant donné que Léa a choisi l'univers animaux
      Et que la voix a été bloquée pendant la lecture de la consigne « Écoute bien. »
      Et que le navigateur ne bloque plus la voix
      Quand Léa demande à réécouter la consigne
      Alors Léa entend Noisette lire « Écoute bien. »

    @a-valider
    Scénario: Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même
      Étant donné que le navigateur ne sait pas lire à voix haute
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa voit la consigne « Écoute bien. »
      Et aucun message d'erreur n'apparaît

  Règle: Le parent, et lui seul, peut imposer une voix de l'appareil à la place de la voix automatique

    Scénario: Le parent voit les voix françaises de l'appareil
      Étant donné que Paul est dans l'espace parent sur la tablette
      Et que la tablette a les voix françaises « Amélie (compact) » et « Denise (Natural) » et la voix anglaise « Samantha »
      Quand Paul consulte le choix de la voix
      Alors Paul voit « Automatique (recommandé) » en premier, choisi
      Et Paul voit les voix « Denise (Natural) » puis « Amélie (compact) »
      Mais Paul ne voit pas la voix « Samantha »

    Scénario: Une voix très naturelle est signalée au parent
      Étant donné que Paul est dans l'espace parent sur la tablette
      Et que la tablette a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Quand Paul consulte le choix de la voix
      Alors la voix « Denise (Natural) » est signalée « très naturelle »
      Mais la voix « Amélie (compact) » ne l'est pas

    Scénario: Le parent essaie une voix avant de la choisir
      Étant donné que Paul est dans l'espace parent sur la tablette
      Et que l'univers en cours est animaux
      Quand Paul essaie la voix « Amélie (compact) »
      Alors Paul entend « Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! » avec la voix « Amélie (compact) »
      Et la voix automatique reste choisie

    Scénario: La voix imposée lit les consignes, quel que soit le personnage guide
      Étant donné que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Léa a choisi l'univers pompier
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Capitaine Sam lire la consigne avec la voix « Amélie (compact) »

    Scénario: Le parent revient à la voix automatique
      Étant donné que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que la tablette a aussi la voix française « Denise (Natural) »
      Quand Paul choisit « Automatique (recommandé) »
      Alors Léa entend les consignes suivantes avec la voix « Denise (Natural) »

    Scénario: Une voix imposée qui n'existe plus sur l'appareil laisse place à la voix automatique
      Étant donné que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que la voix « Amélie (compact) » a été retirée de la tablette
      Et que la tablette a encore la voix française « Denise (Natural) »
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend la consigne avec la voix « Denise (Natural) »

    Plan du Scénario: Le parent est prévenu quand l'appareil ne peut pas lire en français
      Étant donné que Paul est dans l'espace parent sur la tablette
      Et que <situation>
      Quand Paul consulte le choix de la voix
      Alors Paul voit le message « <message> »

      Exemples:
        | situation                                   | message                                                                                                    |
        | la tablette n'a aucune voix française       | Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page. |
        | le navigateur ne sait pas lire à voix haute | Ce navigateur ne sait pas lire à voix haute.                                                               |

    @a-valider
    Scénario: Le parent trouve des conseils pour installer des voix plus naturelles
      Étant donné que Paul est dans l'espace parent sur la tablette
      Quand Paul consulte le choix de la voix
      Alors Paul voit comment installer des voix plus naturelles sur iPad ou iPhone, sur tablette Android et sur ordinateur

    @acces @a-valider
    Scénario: L'enfant ne peut pas changer la voix en dehors de l'espace parent
      Étant donné que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Léa joue sur la tablette, en dehors de l'espace parent
      Quand Léa cherche à changer la voix
      Alors Léa ne trouve aucun choix de la voix
      Et Léa entend toujours les consignes avec la voix « Amélie (compact) »

    @acces @a-valider
    Scénario: La voix imposée sur un appareil ne change pas les autres appareils
      Étant donné que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que le téléphone de Paul a aussi la voix « Amélie (compact) »
      Quand la consigne « Écoute bien. » s'affiche sur le téléphone
      Alors Léa entend la consigne avec la voix automatique du téléphone

    @acces @a-valider
    Scénario: La voix imposée vaut pour tous les profils enfants de l'appareil
      Étant donné que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Tom, le frère de Léa, joue sur la tablette
      Quand la consigne « Écoute bien. » s'affiche
      Alors Tom entend la consigne avec la voix « Amélie (compact) »
