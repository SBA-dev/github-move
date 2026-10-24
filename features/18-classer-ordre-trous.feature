# language: fr
@issue-18
Fonctionnalité: Classer, remettre dans l'ordre, compléter un texte à trous
  En tant qu'enfant
  Je veux ranger des étiquettes dans des maisons, les remettre dans l'ordre et compléter un texte à trous
  Afin de m'entraîner à trier, à ordonner et à choisir le mot juste

  Leçons de la bibliothèque utilisées : « Les sons ou, on, an » (fr-cp-sons-ou-on-an, exercice classer
  « Les maisons des sons » : maisons « ou », « on », « an »), « Les syllabes » (fr-cp-syllabes, exercice ordre
  « Le mot en morceaux » : « do », « mi », « no »), « Être et avoir au présent » (fr-cp-etre-avoir, texte à trous
  « Les phrases magiques »), « a ou à ? » (fr-ce1-a-ou-a) et « Programmer un déplacement »
  (ma-cm1-programmation, où « Avancer de 1 case » revient deux fois).

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Classer : chaque étiquette va dans la maison de son groupe, dans l'ordre que l'enfant choisit

    Scénario: La consigne est lue, puis la façon de poser les étiquettes
      Étant donné que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa entend Noisette lire « Range chaque mot dans la maison de son son. », puis « Fais glisser chaque étiquette, ou touche-la puis touche une maison. »
      Et Léa voit les maisons « ou », « on » et « an », et 9 étiquettes à poser

    Plan du Scénario: L'étiquette « <étiquette> » posée dans la maison « <maison> » y reste
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « <étiquette> » dans la maison « <maison> »
      Alors l'étiquette « <étiquette> » reste dans la maison « <maison> »
      Et Noisette applaudit en sautant

      Exemples:
        | étiquette | maison |
        | loup      | ou     |
        | pont      | on     |
        | dent      | an     |

    Scénario: L'enfant pose les étiquettes dans l'ordre qu'il veut
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose d'abord l'étiquette « savon » dans la maison « on »
      Alors l'étiquette « savon » reste dans la maison « on »
      Et il reste 8 étiquettes à poser

    Scénario: Une étiquette posée dans la mauvaise maison revient, avec l'aide par défaut
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « on »
      Alors l'étiquette « loup » revient parmi les étiquettes à poser
      Et Noisette dit un encouragement, suivi de « « loup » n'habite pas dans la maison « on ». Essaie une autre maison. »

    Scénario: L'aide d'une étiquette passe avant l'aide par défaut
      Étant donné qu'une leçon de test a un exercice classer dont l'étiquette « baleine » du groupe « Mammifères » a l'aide « La baleine respire avec des poumons. »
      Quand Léa pose l'étiquette « baleine » dans la maison « Poissons »
      Alors Noisette dit un encouragement, suivi de « La baleine respire avec des poumons. »

    Scénario: Reposer une étiquette dans la même mauvaise maison coûte une nouvelle erreur
      Étant donné qu'une leçon de test a un seul exercice classer de deux étiquettes, « loup » pour « ou » et « pont » pour « on »
      Et que Léa a posé 4 fois l'étiquette « loup » dans la maison « on »
      Et que Léa a ensuite posé « loup » dans « ou »
      Quand Léa pose l'étiquette « pont » dans la maison « on »
      Alors Léa gagne 1 étoile

  Règle: Remettre dans l'ordre : seule l'étiquette qui vient ensuite est acceptée

    Scénario: La consigne est lue, puis la façon de commencer
      Étant donné que Léa est sur la page de la leçon « Les syllabes »
      Quand Léa choisit seulement l'exercice « Le mot en morceaux »
      Alors Léa entend Noisette lire « Remets les syllabes dans l'ordre pour écrire « domino ». », puis « Touche d'abord celle qui vient en premier. »

    Scénario: La bonne étiquette prend sa place et le personnage guide demande la suite
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « do »
      Alors l'étiquette « do » prend la première place
      Et Noisette dit « Oui ! Et après ? », « Bien ! Et ensuite ? » ou « Super ! La suite ? »

    Scénario: Une mauvaise première étiquette est refusée
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « mi »
      Alors l'étiquette « mi » revient parmi les étiquettes à poser
      Et Noisette dit un encouragement, suivi de « Ce n'est pas le début. Lequel vient en premier ? »

    Scénario: Une mauvaise étiquette suivante est refusée
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa pose l'étiquette « no »
      Alors l'étiquette « no » revient parmi les étiquettes à poser
      Et Noisette dit un encouragement, suivi de « Pas encore celui-là. Lequel vient juste après ? »

    Scénario: La dernière étiquette bien posée est félicitée
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé les étiquettes « do » et « mi »
      Quand Léa pose l'étiquette « no »
      Alors Noisette dit une félicitation
      Mais Noisette ne demande pas la suite

    Scénario: Deux étiquettes au même texte sont interchangeables
      Étant donné que Tom a un profil enfant préparé de niveau CM1
      Et que Tom joue seulement l'exercice « Le robot va chercher la pomme » de la leçon « Programmer un déplacement »
      Et que Tom a posé « Avancer de 2 cases » et « Tourner à droite »
      Quand Tom pose l'une ou l'autre des deux étiquettes « Avancer de 1 case »
      Alors l'étiquette prend la troisième place
      Et Noisette ne dit aucun encouragement

  Règle: Texte à trous : les trous se remplissent dans l'ordre du texte, en choisissant parmi trois mots

    Scénario: Le premier trou propose le mot attendu et deux autres mots
      Étant donné que Léa est sur la page de la leçon « Être et avoir au présent »
      Quand Léa choisit seulement l'exercice « Les phrases magiques »
      Alors Léa entend Noisette lire « Complète chaque phrase avec être ou avoir. »
      Et Léa voit le texte « Je … dans le jardin. Tu … un ballon rouge. Nous … amis. Ils … faim. », le premier trou mis en avant
      Et le premier trou propose « suis » et deux autres mots, tous différents

    Scénario: Le bon mot s'écrit dans le trou, et le trou suivant est proposé
      Étant donné que Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent »
      Quand Léa répond « suis »
      Alors Léa voit « Je suis dans le jardin. »
      Et Noisette dit une félicitation
      Et le trou de « Tu … un ballon rouge. » est mis en avant

    Scénario: Un mauvais mot est écarté et le personnage guide invite à relire la phrase
      Étant donné que Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent »
      Et que le premier trou propose « suis », « es » et « sont »
      Quand Léa répond « es »
      Alors le choix « es » reste visible, pâle, et ne réagit plus
      Et Noisette dit un encouragement, suivi de « Relis la phrase en entier : quel mot va bien ? »

    Scénario: Au dernier trou, le personnage guide dit que le texte est complet
      Étant donné que Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent »
      Et que Léa a rempli les trois premiers trous
      Quand Léa répond « ont »
      Alors Noisette dit une félicitation, suivie de « Le texte est complet ! »

    Scénario: « a » et « à » sont proposés ensemble à chaque trou
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Tom est sur la page de la leçon « a ou à ? »
      Quand Tom choisit seulement l'exercice « a ou à ? »
      Alors le trou de « Lina … un chat. » propose les choix « a » et « à »

  Règle: Sans consigne, le personnage guide lit la consigne par défaut du type d'exercice

    Plan du Scénario: Un exercice <type> sans consigne commence par « <consigne par défaut> »
      Étant donné qu'une leçon de test a un exercice <type> sans consigne
      Quand Léa commence cet exercice
      Alors Léa entend Noisette lire « <consigne par défaut> »

      Exemples:
        | type    | consigne par défaut                               |
        | classer | Range chaque étiquette dans la bonne maison.      |
        | ordre   | Remets les étiquettes dans le bon ordre.          |
        | trous   | Complète le texte : choisis le mot qui manque.    |

  Règle: Les étiquettes se posent en glissant, en touchant ou au clavier, et le trou en cours est annoncé

    Plan du Scénario: L'étiquette « loup » se pose dans la maison « ou » <geste>
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou » <geste>
      Alors l'étiquette « loup » reste dans la maison « ou »

      Exemples:
        | geste                                    |
        | en la faisant glisser                    |
        | en la touchant, puis en touchant la maison |
        | au clavier seulement                     |

    Scénario: Le trou en cours est annoncé aux lecteurs d'écran
      Étant donné que Léa joue seulement l'exercice « Les phrases magiques » de la leçon « Être et avoir au présent »
      Quand le premier trou est mis en avant
      Alors les lecteurs d'écran annoncent un mot manquant dans « Je … dans le jardin. »

    Scénario: Les maisons et les étiquettes tiennent dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors la page tient dans la largeur de l'écran
      Et chaque étiquette et chaque maison mesurent au moins 44 px de haut et de large
