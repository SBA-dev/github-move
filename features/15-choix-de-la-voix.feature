# language: fr
@issue-15 @wip
Fonctionnalité: Choisir la voix des personnages guides sur l'appareil
  En tant que parent
  Je veux choisir la voix qui lit les consignes sur cet appareil
  Afin que mon enfant entende la voix la plus agréable que l'appareil propose

  Le choix de voix se fait dans l'espace parent. Il est mémorisé sur l'appareil,
  pour tous les profils enfants qui y jouent, et ne change pas les autres appareils.
  Jusqu'au lot 3, les consignes s'affichent sur la page de démonstration réservée aux tests.

  Règle: Dans l'espace parent, le parent voit les voix françaises de l'appareil, la plus naturelle en tête

    Scénario: Le parent voit les voix françaises de l'appareil, de la plus naturelle à la moins naturelle
      Étant donné que l'appareil a les voix françaises « Amélie (compact) », « Thomas » et « Denise (Natural) »
      Et que l'appareil a aussi la voix anglaise « Samantha »
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul voit, dans cet ordre, « Automatique (recommandé) », « Denise (Natural) », « Thomas » et « Amélie (compact) »
      Mais Paul ne voit pas la voix « Samantha »

    Scénario: Sans voix imposée, la voix automatique est choisie et le parent sait laquelle elle utilise
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que personne n'a imposé de voix sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors « Automatique (recommandé) » est choisi
      Et « Automatique (recommandé) » porte la mention « actuellement : Denise (Natural) »

    Plan du Scénario: La voix « <voix> » porte la mention « <mention> »
      Étant donné que l'appareil a les voix françaises <voix de l'appareil>
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors la voix « <voix> » porte la mention « <mention> »

      Exemples:
        | voix de l'appareil                   | voix             | mention          |
        | « Thomas » et « Denise (Natural) »   | Denise (Natural) | très naturelle   |
        | « Amélie (compact) » et « Thomas »   | Thomas           | la meilleure ici |

    Scénario: Une voix qui n'est ni très naturelle ni la meilleure de l'appareil ne porte aucune mention
      Étant donné que l'appareil a les voix françaises « Thomas » et « Denise (Natural) »
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors la voix « Thomas » ne porte aucune mention

    Scénario: Le choix de voix s'intitule « La voix des personnages guides »
      Étant donné que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul voit le titre « La voix des personnages guides »
      Mais Paul ne voit pas le titre « La voix des guides »

  Règle: Quand l'appareil ne peut pas lire en français, le parent est prévenu et sait comment obtenir des voix plus naturelles

    Plan du Scénario: Le parent est prévenu quand <situation>
      Étant donné que <situation>
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul voit le message « <message> »
      Et seule « Automatique (recommandé) » est proposée

      Exemples:
        | situation                                   | message                                                                                              |
        | l'appareil n'a aucune voix française        | Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page. |
        | le navigateur ne sait pas lire à voix haute | Ce navigateur ne sait pas lire à voix haute.                                                         |

    Scénario: Le parent trouve des conseils pour installer des voix plus naturelles
      Étant donné que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul trouve des conseils pour des voix plus naturelles sur iPad ou iPhone, sur tablette Android et sur ordinateur

  Règle: Écouter une voix fait lire l'essai de voix par le personnage guide du profil en cours, sans changer le choix de voix

    Scénario: Le parent écoute une voix sans changer la voix choisie
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que personne n'a imposé de voix sur la tablette
      Et que personne ne jouait sur la tablette
      Et que Paul est entré dans l'espace parent
      Quand Paul écoute la voix « Amélie (compact) »
      Alors Paul entend Noisette dire « Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! » avec la voix « Amélie (compact) »
      Et « Automatique (recommandé) » est toujours choisi

    Scénario: Écouter la voix automatique lit l'essai de voix avec la voix la plus naturelle
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que personne ne jouait sur la tablette
      Et que Paul est entré dans l'espace parent
      Quand Paul écoute la voix « Automatique (recommandé) »
      Alors Paul entend Noisette dire « Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! » avec la voix « Denise (Natural) »

    Plan du Scénario: L'essai de voix est lu par <personnage guide> quand <situation>
      Étant donné que <situation>
      Et que Paul est entré dans l'espace parent
      Quand Paul écoute la voix « Automatique (recommandé) »
      Alors Paul entend <personnage guide> dire « Coucou ! Je suis <personnage guide>. On apprend en s'amusant ? Youpi ! »

      Exemples:
        | situation                                   | personnage guide |
        | Tom jouait dans l'univers sports            | Coach Léo        |
        | Léa jouait dans l'univers princesse         | Lumi             |
        | Léa jouait sans avoir choisi d'univers      | Noisette         |
        | personne ne jouait sur la tablette          | Noisette         |

    Scénario: L'essai de voix garde le caractère du personnage guide du profil en cours
      Étant donné que l'appareil a les voix françaises « Denise (Natural) » et « Henri »
      Et que Paul a imposé la voix « Denise (Natural) » sur la tablette
      Et que Léa jouait dans l'univers pompier
      Et que Paul est entré dans l'espace parent
      Quand Paul écoute la voix « Denise (Natural) »
      Alors Paul entend Capitaine Sam dire « Coucou ! Je suis Capitaine Sam. On apprend en s'amusant ? Youpi ! » avec la voix « Denise (Natural) », en plus grave

    Scénario: En Muet, l'essai de voix n'est pas lu
      Étant donné que la tablette est en Muet
      Et que Paul est dans l'espace parent
      Quand Paul écoute la voix « Automatique (recommandé) »
      Alors Paul n'entend rien
      Et la tablette est toujours en Muet

  Règle: La voix imposée lit les consignes à la place de la voix automatique, avec le caractère du personnage guide

    Scénario: Le parent impose une voix de l'appareil
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul est dans l'espace parent
      Quand Paul impose la voix « Amélie (compact) »
      Alors la voix « Amélie (compact) » est choisie
      Mais « Automatique (recommandé) » n'est plus choisi

    Plan du Scénario: La voix imposée lit les consignes de <personnage guide>
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Léa a choisi l'univers <univers>
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend <personnage guide> lire la consigne avec la voix « Amélie (compact) »

      Exemples:
        | univers   | personnage guide |
        | animaux   | Noisette         |
        | princesse | Lumi             |
        | sports    | Coach Léo        |

    Scénario: Le caractère du personnage guide s'applique aussi à la voix imposée
      Étant donné que l'appareil a les voix françaises « Denise (Natural) » et « Henri »
      Et que Paul a imposé la voix « Denise (Natural) » sur la tablette
      Et que Léa a choisi l'univers pompier
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Capitaine Sam lire la consigne avec la voix « Denise (Natural) », en plus grave

    Scénario: Après le retour à la voix automatique, les consignes retrouvent la voix la plus naturelle
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette, puis est revenu à la voix automatique
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne avec la voix « Denise (Natural) »

    Scénario: Une consigne en anglais garde la voix anglaise malgré la voix imposée
      Étant donné que l'appareil a une voix française et une voix anglaise
      Et que Paul a imposé la voix française sur la tablette
      Et que Léa fait une leçon d'anglais
      Quand la consigne « Listen and repeat: cat. » s'affiche
      Alors Léa entend « Listen and repeat: cat. » lu avec la voix anglaise

  Règle: Une voix imposée qui n'existe plus sur l'appareil laisse place à la voix automatique

    Scénario: Sans la voix imposée, les consignes sont lues avec la voix automatique, sans message pour l'enfant
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Audrey (améliorée) », qui n'est plus sur la tablette
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne avec la voix « Denise (Natural) »
      Et aucun message d'erreur n'apparaît

    Scénario: Le parent voit « Automatique (recommandé) » choisi, sans message, quand la voix imposée a disparu
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Audrey (améliorée) », qui n'est plus sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors « Automatique (recommandé) » est choisi
      Et Paul ne voit pas la voix « Audrey (améliorée) »
      Et aucun message d'erreur n'apparaît

    Scénario: Une voix imposée de nouveau installée reprend la lecture des consignes
      Étant donné que Paul a imposé la voix « Audrey (améliorée) » sur la tablette
      Et que la voix « Audrey (améliorée) » a disparu de la tablette, puis y a été de nouveau installée
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne avec la voix « Audrey (améliorée) »

  Règle: Seul le parent change le choix de voix, et ce choix vaut pour tout l'appareil, et pour lui seul

    @acces
    Scénario: L'enfant ne peut pas changer la voix en dehors de l'espace parent
      Étant donné que Léa a choisi l'univers animaux
      Quand Léa commence à jouer
      Alors le choix de voix n'est pas proposé à Léa
      Mais l'en-tête propose le choix Son/Muet, l'accueil et l'espace parent

    @acces
    Scénario: Pour atteindre le choix de voix, il faut répondre au contrôle parental
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CE1
      Et que Léa joue
      Quand Léa demande l'entrée de l'espace parent
      Alors Léa voit une question du contrôle parental
      Mais le choix de voix n'est pas proposé à Léa

    @acces
    Scénario: La voix imposée sur la tablette ne change pas les autres appareils
      Étant donné que Paul est connecté sur la tablette et sur le téléphone
      Et que la tablette et le téléphone ont les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche sur le téléphone
      Alors Léa entend Noisette lire la consigne avec la voix « Denise (Natural) »

    @acces
    Scénario: La voix imposée vaut pour tous les profils enfants de l'appareil
      Étant donné que Léa et Tom ont chacun un profil enfant sur la tablette
      Et que Tom a choisi l'univers sports
      Et que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Quand la consigne « Écoute bien. » s'affiche pour Tom
      Alors Tom entend Coach Léo lire la consigne avec la voix « Amélie (compact) »

    Scénario: La voix imposée reste choisie au lancement suivant
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Léa a choisi l'univers animaux
      Quand Léa relance Savanturier
      Alors Léa entend Noisette lire la consigne avec la voix « Amélie (compact) »

    Scénario: La voix imposée reste sur l'appareil après la déconnexion du parent
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que Paul s'est déconnecté puis reconnecté sur la tablette
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire la consigne avec la voix « Amélie (compact) »
