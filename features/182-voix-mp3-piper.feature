# language: fr
@issue-182
Fonctionnalité: La voix enregistrée lit les leçons sans rien installer sur l'appareil
  En tant qu'enfant qui lit encore mal
  Je veux entendre mon personnage guide lire les consignes, les questions et ses paroles sur n'importe quel appareil
  Afin de faire mes leçons même quand aucun adulte n'a installé de voix

  Vocabulaire et conventions des scénarios :
  - « la voix enregistrée » : la voix des MP3 fabriqués à l'avance par le pipeline de contenu ;
    « la voix de l'appareil » : la voix de synthèse installée sur l'appareil (glossaire, #182).
  - « la phrase « … » est une phrase enregistrée » : le répertoire des phrases enregistrées a un MP3 pour cette phrase.
    Pour les tests, ce MP3 est un enregistrement court fourni avec les tests, jamais une phrase fabriquée avec le
    modèle de voix : ces scénarios ne dépendent pas de la fabrication.
  - Sans précision, l'appareil a une voix française (comme dans #7) ; « l'appareil n'a aucune voix française »
    reprend la situation de #15.
  - La consigne est celle d'un exercice d'une leçon de test, jouée dans une vraie séance (comme dans #7).
  - Tags propres à #182 :
    - `@paroles-fixes-fabriquees` : le scénario lit les vrais MP3 des paroles fixes ; il ne passe qu'une fois
      ces paroles fabriquées (fin de 182a, après le téléchargement du modèle de voix) ;
    - `@niveau-cp`, `@niveau-ce1`… : l'exemple lit les vrais MP3 des leçons de ce niveau ; tous les niveaux
      sont fabriqués (182b pour le CP, 182c pour le CE1, 182d pour le CE2 et 182e pour le CM1 et le CM2) ;
    - `@pwa` : le scénario a besoin du service worker ; il tourne avec la configuration de la PWA (#8).

  Règle: Une phrase enregistrée est dite par la voix enregistrée, même sur un appareil sans voix française

    Scénario: Sans voix française sur l'appareil, la consigne est lue par la voix enregistrée
      Étant donné que l'appareil n'a aucune voix française
      Et que la phrase « Trouve le mot qui commence par le son [a]. » est une phrase enregistrée
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa entend Noisette lire « Trouve le mot qui commence par le son [a]. » avec la voix enregistrée
      Et aucun message d'erreur n'apparaît

    Scénario: Avec une voix française sur l'appareil, la phrase enregistrée garde la voix enregistrée
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que la phrase « Écoute bien. » est une phrase enregistrée
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire « Écoute bien. » avec la voix enregistrée

    Scénario: Une consigne écrite avec des symboles retrouve la phrase enregistrée dite avec des mots
      Étant donné que l'appareil n'a aucune voix française
      Et que la phrase « Combien font 3 plus 4 ? » est une phrase enregistrée
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? » avec la voix enregistrée

    @paroles-fixes-fabriquees
    Scénario: Sans voix française sur l'appareil, la félicitation du personnage guide est dite par la voix enregistrée
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors Noisette dit une félicitation avec la voix enregistrée
      Et aucun message d'erreur n'apparaît

  Règle: Une phrase sans MP3 lisible est dite par la voix de l'appareil, pour cette phrase seulement

    Scénario: Un calcul tiré au hasard est dit par la voix de l'appareil
      Étant donné que la question « Combien font 218 + 48 ? » n'est pas une phrase enregistrée
      Et que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Quand la question « Combien font 218 + 48 ? » s'affiche
      Alors Léa entend Noisette lire « Combien font 218 plus 48 ? » avec la voix de l'appareil
      Et aucun message d'erreur n'apparaît

    Scénario: Dans une même consigne, chaque phrase garde sa voix, dans l'ordre et jamais en même temps
      Étant donné que la phrase « Écoute bien. » est une phrase enregistrée
      Et que la phrase « Lis la phrase avec Noisette. » n'est pas une phrase enregistrée
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. Lis la phrase avec Noisette. » s'affiche
      Alors Léa entend Noisette lire « Écoute bien. » avec la voix enregistrée, puis « Lis la phrase avec Noisette. » avec la voix de l'appareil
      Et Léa n'entend jamais deux lectures en même temps

    Scénario: Une phrase enregistrée dont le MP3 ne peut pas être lu est dite par la voix de l'appareil, sans message
      Étant donné que la phrase « Écoute bien. » est une phrase enregistrée dont le MP3 ne peut pas être lu
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire « Écoute bien. » avec la voix de l'appareil
      Et aucun message d'erreur n'apparaît


    Scénario: Le mot à écouter en anglais garde la voix anglaise de l'appareil
      Étant donné que l'appareil a une voix française et une voix anglaise
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue l'exercice « Quel animal ? » de la leçon « Les animaux »
      Quand l'item « a cat » commence
      Alors Léa entend ensuite « a cat » lu avec la voix anglaise
      Mais Léa n'entend pas « a cat » avec la voix enregistrée

  Règle: Sans MP3 lisible ni voix française, l'enfant lit un message juste et continue sa leçon

    Scénario: Sans MP3 ni voix française, l'enfant lit le message de voix indisponible, pas celui de voix bloquée
      Étant donné que l'appareil n'a aucune voix française
      Et que la question « Combien font 218 + 48 ? » n'est pas une phrase enregistrée
      Et que Léa a un profil enfant préparé de niveau CE2 dans l'univers « Animaux de la forêt »
      Quand la question « Combien font 218 + 48 ? » s'affiche
      Alors Léa voit le message « Noisette ne peut pas lire cette phrase sur cet appareil. Lis-la avec un adulte, ou touche « Réécouter » plus tard. »
      Et Léa voit la question « Combien font 218 + 48 ? »
      Mais Léa ne voit pas le message « La voix de Noisette est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte. »


    Scénario: Sans MP3 ni voix française, l'enfant réussit quand même la question
      Étant donné que l'appareil n'a aucune voix française
      Et que la question « Combien font 3 + 4 ? » n'est pas une phrase enregistrée
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand Léa répond « 7 »
      Alors la question « Combien font 3 + 4 ? » est réussie

    Scénario: Le message de voix indisponible n'apparaît qu'une fois
      Étant donné que l'appareil n'a aucune voix française
      Et qu'aucune phrase de la leçon de test n'est une phrase enregistrée
      Et que Léa a déjà vu le message de voix indisponible
      Quand la consigne suivante s'affiche
      Alors Léa voit un seul message de voix indisponible
      Et Léa ne voit aucun message de voix bloquée

    Scénario: Le message de voix indisponible disparaît dès qu'une phrase enregistrée est entendue
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa voit le message de voix indisponible
      Et que la phrase « Écoute bien. » est une phrase enregistrée
      Et que la phrase « Combien font 1 plus 2 ? » est une phrase enregistrée
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire « Écoute bien. » avec la voix enregistrée
      Et Léa ne voit plus le message de voix indisponible


    Scénario: Le message de voix bloquée remplace le message de voix indisponible, jamais les deux à la fois
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa voit le message de voix indisponible
      Et que la phrase « Écoute bien. » est une phrase enregistrée
      Et que la phrase « Combien font 1 plus 2 ? » est une phrase enregistrée
      Et que le navigateur bloque la voix
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa voit un seul message de voix bloquée
      Mais Léa ne voit plus le message de voix indisponible

    Scénario: Quand le navigateur refuse de jouer la voix enregistrée, l'enfant voit le message de voix bloquée
      Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que la phrase « Combien font 3 plus 4 ? » est une phrase enregistrée
      Et que le navigateur bloque la voix
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit le message « La voix de Noisette est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte. »

  Règle: La voix enregistrée respecte le Muet, la voix suspendue, l'arrêt, la lecture lente et le surlignage, comme la lecture à voix haute


    Scénario: En Muet, une phrase enregistrée n'est pas entendue
      Étant donné que la tablette est en Muet
      Et que la phrase « Combien font 3 plus 4 ? » est une phrase enregistrée
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Quand la question « Combien font 3 + 4 ? » s'affiche
      Alors Léa voit la question « Combien font 3 + 4 ? »
      Mais Léa n'entend rien

    Scénario: Passer en Muet coupe tout de suite la voix enregistrée
      Étant donné que Noisette est en train de lire, avec la voix enregistrée, la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa passe en Muet
      Alors Léa n'entend plus Noisette

    Scénario: Réécouter reprend la phrase enregistrée depuis le début, sans deux lectures en même temps
      Étant donné que Noisette est en train de lire, avec la voix enregistrée, la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa demande à réécouter la consigne
      Alors la lecture reprend depuis le début de la consigne
      Et Léa n'entend jamais deux lectures en même temps

    Scénario: Quitter l'écran coupe la voix enregistrée
      Étant donné que Noisette est en train de lire, avec la voix enregistrée, la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa quitte l'écran de la consigne
      Alors Léa n'entend plus Noisette

    Scénario: En arrivant sur un écran du parent, la voix enregistrée s'arrête et ne reprend pas
      Étant donné que Paul est connecté sur la tablette
      Et que Noisette est en train de lire, avec la voix enregistrée, la consigne « Écoute bien l'histoire du petit chat. »
      Quand Léa demande l'entrée de l'espace parent
      Alors Léa voit une question du contrôle parental
      Et Léa n'entend plus Noisette

    Scénario: Écouter plus lentement fait entendre le mot dicté enregistré à l'allure lente
      Étant donné que le mot « chat » est une phrase enregistrée, à l'allure normale et à l'allure lente
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa demande à écouter plus lentement
      Alors Léa entend de nouveau Noisette dire « chat », plus lentement, avec la voix enregistrée

    Scénario: Sans MP3 lent, le mot dicté enregistré est quand même dit plus lentement par la voix enregistrée
      Étant donné que le mot « chat » est une phrase enregistrée, à l'allure normale seulement
      Et que Léa joue le mot dicté « chat » de l'exercice « J'écris les animaux »
      Quand Léa demande à écouter plus lentement
      Alors Léa entend de nouveau Noisette dire « chat », plus lentement, avec la voix enregistrée

    Scénario: Pendant une phrase enregistrée, les mots sont surlignés l'un après l'autre, puis plus aucun à la fin
      Étant donné que la phrase « Lis la phrase avec Noisette. » est une phrase enregistrée
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Lis la phrase avec Noisette. » s'affiche
      Alors les mots de la consigne sont surlignés l'un après l'autre, dans l'ordre, pendant que Noisette la lit avec la voix enregistrée
      Et plus aucun mot n'est surligné quand la lecture est finie

  Règle: Rien de personnel n'est dit par la voix enregistrée : le prénom reste affiché

    Scénario: Le prénom de l'enfant n'est jamais dit par la voix enregistrée
      Étant donné que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit son accueil
      Mais Léa n'entend jamais la voix enregistrée dire « Léa »

    Scénario: Le personnage guide salue l'enfant sans dire son prénom, et le prénom reste affiché
      Étant donné que l'appareil n'a aucune voix française
      Et que la phrase « Bonjour ! » est une phrase enregistrée
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit « Bonjour Léa ! » dans la bulle de Noisette
      Et Léa entend Noisette dire « Bonjour ! » avec la voix enregistrée

    Scénario: Avec une voix française sur l'appareil, la phrase avec le prénom est dite en entier par la voix de l'appareil
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors Léa voit « Bonjour Léa ! » dans la bulle de Noisette
      Et Léa entend Noisette dire « Bonjour Léa ! » avec la voix de l'appareil

  Règle: Dans l'espace parent, la voix de Savanturier est présentée d'abord ; la voix de l'appareil choisie ne dit que les phrases sans voix enregistrée

    Scénario: Le parent voit d'abord la voix de Savanturier, puis le choix de la voix de l'appareil pour les phrases sans voix enregistrée
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul voit d'abord la voix de Savanturier, sans choix à faire
      Et Paul voit ensuite le choix de la voix de l'appareil « pour les phrases sans voix enregistrée »
      Et « Automatique (recommandé) » est choisi

    Scénario: Une voix imposée ne remplace pas la voix enregistrée d'une phrase enregistrée
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que la phrase « Écoute bien. » est une phrase enregistrée
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Écoute bien. » s'affiche
      Alors Léa entend Noisette lire « Écoute bien. » avec la voix enregistrée

    Scénario: Une voix imposée dit les phrases sans voix enregistrée
      Étant donné que l'appareil a les voix françaises « Amélie (compact) » et « Denise (Natural) »
      Et que Paul a imposé la voix « Amélie (compact) » sur la tablette
      Et que la phrase « Lis la phrase avec Noisette. » n'est pas une phrase enregistrée
      Et que Léa a choisi l'univers animaux
      Quand la consigne « Lis la phrase avec Noisette. » s'affiche
      Alors Léa entend Noisette lire la consigne avec la voix « Amélie (compact) »

    Scénario: Sans voix française sur l'appareil, le parent apprend que la voix de Savanturier lit les leçons
      Étant donné que l'appareil n'a aucune voix française
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul voit d'abord la voix de Savanturier, sans choix à faire
      Et Paul voit le message « Aucune voix française sur cet appareil : la voix de Savanturier lit les leçons ; une voix de l'appareil sert seulement aux phrases fabriquées à la volée, qui ne pourront pas être lues à voix haute. »
      Mais Paul ne voit pas le message « Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page. »

    Scénario: Sur un navigateur qui ne sait pas lire à voix haute, le parent apprend que la voix de Savanturier lit les leçons
      Étant donné que le navigateur ne sait pas lire à voix haute
      Et que Paul est dans l'espace parent
      Quand Paul ouvre le choix de voix
      Alors Paul voit d'abord la voix de Savanturier, sans choix à faire
      Et Paul voit le message « Ce navigateur n'a pas de voix : la voix de Savanturier lit les leçons ; les phrases fabriquées à la volée ne pourront pas être lues à voix haute. »
      Mais Paul ne voit pas le message « Ce navigateur ne sait pas lire à voix haute. »

  Règle: Une leçon ouverte une fois avec le réseau reste lue par la voix enregistrée sans réseau

    @pwa
    Scénario: Sans réseau, la leçon déjà ouverte est lue par la voix enregistrée
      Étant donné que l'appareil n'a aucune voix française
      Et que la phrase « Trouve le mot qui commence par le son [a]. » est une phrase enregistrée
      Et que Léa a ouvert une fois, avec le réseau, la page de la leçon de test de cette consigne
      Et que le réseau est coupé
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa entend Noisette lire « Trouve le mot qui commence par le son [a]. » avec la voix enregistrée

    @pwa
    Scénario: Après une nouvelle version, la leçon déjà ouverte reste lue sans réseau par la voix enregistrée
      Étant donné que l'appareil n'a aucune voix française
      Et que la phrase « Trouve le mot qui commence par le son [a]. » est une phrase enregistrée
      Et que Léa a ouvert une fois, avec le réseau, la page de la leçon de test de cette consigne
      Et qu'une nouvelle version de Savanturier a été publiée depuis, puis s'est appliquée
      Et que le réseau est coupé
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa entend Noisette lire « Trouve le mot qui commence par le son [a]. » avec la voix enregistrée

    @pwa
    Scénario: Sans réseau, une leçon jamais ouverte est lue par la voix de l'appareil, sans message
      Étant donné que la phrase « Trouve le mot qui commence par le son [a]. » est une phrase enregistrée
      Et que Savanturier a déjà été chargé une fois sur la tablette, sans ouvrir la leçon de test de cette consigne
      Et que le réseau est coupé
      Quand la consigne « Trouve le mot qui commence par le son [a]. » s'affiche
      Alors Léa entend Noisette lire « Trouve le mot qui commence par le son [a]. » avec la voix de l'appareil
      Et aucun message d'erreur n'apparaît

  Règle: Une fois un niveau fabriqué, les consignes de ses leçons sont lues sans aucune voix installée

    Plan du Scénario: Sans voix française, les consignes de la leçon « <leçon> » (<niveau>) sont lues par la voix enregistrée
      Étant donné que l'appareil n'a aucune voix française
      Et que Léa a un profil enfant préparé de niveau <niveau> dans l'univers « Animaux de la forêt »
      Quand Léa joue la leçon « <leçon> » de la bibliothèque
      Alors Léa entend Noisette lire chaque consigne de la leçon avec la voix enregistrée
      Et Léa ne voit aucun message de voix indisponible

      @niveau-cp
      Exemples: CP (182b)
        | niveau | leçon                   |
        | CP     | Les sons ou, on, an     |
        | CP     | Les saisons             |

      @niveau-ce1
      Exemples: CE1 (182c)
        | niveau | leçon                     |
        | CE1    | Que mangent les animaux ? |

      @niveau-ce2
      Exemples: CE2 (182d)
        | niveau | leçon                   |
        | CE2    | De la graine à la plante |

      @niveau-cm1 @niveau-cm2
      Exemples: CM1 et CM2 (182e)
        | niveau | leçon                    |
        | CM1    | Les types de phrases     |
        | CM2    | Les nuances de sens      |
