# language: fr
@issue-22 @wip
Fonctionnalité: Mémoriser une poésie
  En tant qu'enfant
  Je veux écouter une poésie ou une chanson vers par vers, la redire seul, puis m'entraîner à remettre les vers dans l'ordre et à retrouver les mots cachés
  Afin de l'apprendre par cœur

  Leçons de la bibliothèque utilisées : « Chanson : Au clair de la lune » (fr-cp-chanson-clair-de-lune,
  8 vers, auteur « Chanson traditionnelle » : c'est une chanson) et « Poésie : La Cigale et la Fourmi »
  (fr-cp-poesie-cigale, exercice « Le début de la fable », 6 vers de Jean de La Fontaine : c'est une poésie).
  Les poésies de test sont décrites dans les scénarios.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: La poésie est d'abord écoutée vers par vers, chaque vers mis en avant

    Scénario: La carte de la poésie montre son titre, son auteur et ses vers
      Étant donné que Léa est sur la page de la leçon « Poésie : La Cigale et la Fourmi »
      Quand Léa choisit seulement l'exercice « Le début de la fable »
      Alors Léa voit « Le début de la fable — Jean de La Fontaine »
      Et Léa voit les 6 vers, un par ligne

    Plan du Scénario: Pour une <sorte>, le personnage guide annonce l'écoute vers par vers
      Étant donné que Léa est sur la page de la leçon « <leçon> »
      Quand Léa choisit seulement l'exercice « <exercice> »
      Alors Noisette dit « Écoute bien, je te le dis vers par vers. Ensuite, à toi de le <verbe> ! »

      Exemples:
        | sorte   | leçon                               | exercice              | verbe   |
        | poésie  | Poésie : La Cigale et la Fourmi     | Le début de la fable  | redire  |
        | chanson | Chanson : Au clair de la lune       | Au clair de la lune   | chanter |

    Scénario: Chaque vers est mis en avant et lu, dans l'ordre, avec le mot prononcé surligné
      Étant donné que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Quand Noisette lit la poésie vers par vers
      Alors Léa entend les 6 vers dans l'ordre, de « La Cigale, ayant chanté » à « De mouche ou de vermisseau. »
      Et chaque vers est mis en avant pendant que Noisette le lit
      Et chaque mot est surligné au moment où Noisette le prononce

  Règle: L'enfant redit seul la poésie, et l'entraînement ne commence que quand il est prêt

    Plan du Scénario: Pour une <sorte>, le personnage guide invite à <verbe> tout le texte
      Étant donné que Léa joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Quand Noisette a lu le dernier vers
      Alors Noisette dit « À toi ! <Verbe> tout le texte, tranquillement. Quand c'est bon, on joue ! »
      Et Léa peut dire qu'elle est prête

      Exemples:
        | sorte   | leçon                           | exercice             | verbe   | Verbe  |
        | poésie  | Poésie : La Cigale et la Fourmi | Le début de la fable | redire  | Redis  |
        | chanson | Chanson : Au clair de la lune   | Au clair de la lune  | chanter | Chante |

    Scénario: Rien ne commence tant que l'enfant n'a pas dit qu'il est prêt
      Étant donné que Léa joue seulement l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Quand Noisette a fini de lire le dernier vers
      Alors l'entraînement n'a pas commencé
      Et l'avancement de la séance montre 0 question réussie sur 12

  Règle: Premier entraînement : remettre les vers dans l'ordre

    Scénario: « Je suis prêt » mène à l'ordre des vers
      Étant donné que Noisette a lu tous les vers de « Le début de la fable »
      Quand Léa dit qu'elle est prête
      Alors Léa entend Noisette lire « Remets les vers dans l'ordre. », puis « Touche d'abord celle qui vient en premier. »
      Et Léa voit les 6 vers mélangés, à poser

    Scénario: Les vers se remettent dans l'ordre comme les étiquettes d'un exercice ordre
      Étant donné que Léa remet dans l'ordre les vers de « Le début de la fable »
      Quand Léa pose le vers « Se trouva fort dépourvue » en premier
      Alors le vers revient parmi les vers à poser
      Et Noisette dit un encouragement, suivi de « Ce n'est pas le début. Lequel vient en premier ? »

    Scénario: Deux vers identiques sont interchangeables
      Étant donné qu'une poésie de test a les vers « Une poule sur un mur », « Qui picore du pain dur », « Picoti, picota », « Picoti, picota »
      Et que Léa a remis en place les deux premiers vers
      Quand Léa pose l'un ou l'autre des deux vers « Picoti, picota »
      Alors le vers prend la troisième place
      Et Noisette ne dit aucun encouragement

  Règle: Second entraînement : retrouver le mot caché de chaque vers

    Scénario: Après l'ordre des vers, des mots se sont envolés
      Étant donné que Léa a remis dans l'ordre les vers de « Au clair de la lune »
      Quand l'entraînement des mots cachés commence
      Alors Léa entend Noisette lire « Des mots se sont envolés ! Retrouve-les. »
      Et Léa voit les vers joints par « / », avec un trou dans chaque vers

    Plan du Scénario: Dans le vers « <vers> », le mot caché est « <mot caché> »
      Étant donné que Léa a remis dans l'ordre les vers de « Au clair de la lune »
      Quand l'entraînement des mots cachés commence
      Alors le vers « <vers> » devient « <vers à trou> »

      Exemples:
        | vers                      | mot caché | vers à trou           |
        | Au clair de la lune,      | clair     | Au … de la lune,      |
        | Mon ami Pierrot,          | Pierrot   | Mon ami …,            |
        | Ma chandelle est morte,   | chandelle | Ma … est morte,       |

    Scénario: Le mot caché ne comprend pas l'article élidé
      Étant donné que Léa a remis dans l'ordre les vers de « Au clair de la lune »
      Quand l'entraînement des mots cachés commence
      Alors le vers « Pour l'amour de Dieu. » devient « Pour l'… de Dieu. »

    Scénario: Un mot caché se retrouve parmi les autres mots cachés de la poésie
      Étant donné que Léa retrouve les mots cachés de « Au clair de la lune »
      Quand le trou de « Au … de la lune, » est mis en avant
      Alors il propose « clair » et deux autres mots cachés de la chanson

    Scénario: Un vers sans mot d'au moins 3 lettres n'a pas de mot caché et compte réussi
      Étant donné qu'une poésie de test a les vers « Le chat dort. », « Il a vu. » et « La souris file. »
      Et que Léa a remis ces vers dans l'ordre
      Quand l'entraînement des mots cachés commence
      Alors le vers « Il a vu. » n'a pas de trou
      Et l'avancement de la séance compte ce vers comme réussi

    Scénario: Une poésie de deux vers propose quand même trois choix pour chaque mot caché
      Étant donné qu'une poésie de test a les vers « Le soleil brille » et « Les oiseaux chantent »
      Et que Léa a remis ces vers dans l'ordre
      Quand le trou du premier vers est mis en avant
      Alors il propose « soleil » et deux autres mots de la poésie

    Scénario: Chaque vers compte deux questions dans l'avancement
      Étant donné que Léa est sur la page de la leçon « Chanson : Au clair de la lune »
      Quand Léa choisit seulement l'exercice « Au clair de la lune »
      Alors l'avancement de la séance montre 0 question réussie sur 16

  Règle: La poésie se suit en mode dys et sur un petit écran

    Scénario: Avec le mode dys, les vers s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Quand Léa commence l'exercice « Le début de la fable » de la leçon « Poésie : La Cigale et la Fourmi »
      Alors Léa voit les vers en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: La poésie tient dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand Léa commence l'exercice « Au clair de la lune » de la leçon « Chanson : Au clair de la lune »
      Alors la page tient dans la largeur de l'écran
