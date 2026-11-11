# language: fr
@issue-166
Fonctionnalité: Une musique propre à chaque univers pour les célébrations
  En tant qu'enfant
  Je veux entendre la musique de mon univers quand mon personnage guide fête ma victoire
  Afin de reconnaître le monde que j'ai choisi, même les yeux fermés

  Contexte Motivation et Voix (docs/stories/166/acceptance.md). La célébration de l'univers existe déjà (#106) ;
  cette story ne change que sa musique : un univers a la sienne quand le PO en a retenu une à l'écoute, et elle
  remplace alors « grande victoire » (106.12). Choix du PO à l'écoute : Danse, Animaux de la forêt, Princesses et
  fées et Pompiers ont leur musique (#166) ; Sports et Police reçoivent la leur avec l'issue de suivi #173
  (scénarios tagués @issue-173). Aucun univers ne garde « grande victoire » pour sa célébration de l'univers.
  Le reste est déjà décrit et n'est pas répété ici :
  - l'ordre « la musique, puis la parole » dans les six univers : features/106-celebration-de-l-univers.feature
    (scénarios « Au premier défi relevé dans l'univers … ») ;
  - toucher, boutons, clavier, Muet et écran du parent : même fichier, avec Coach Léo ;
  - la musique, puis « découverte », puis la parole à la danse de victoire : features/102-personnage-guide-evolue.feature ;
  - « grande victoire » toujours entendu quand aucune célébration de l'univers n'est jouée (leçon acquise, record de
    fluence) : features/97-retours-animes-et-sonores.feature.

  Mots employés dans ces scénarios (ceux de #106) :
  - « la musique de la célébration de Lili » (de Noisette, de Lumi, de Capitaine Sam, de Coach Léo, d'Agent Max) :
    l'effet sonore de la célébration de l'univers du personnage guide, choisi par le PO pour cet univers (#166 ;
    #173 pour Coach Léo et Agent Max). Courte, joyeuse, sans voix ni parole, jamais plus longue que la célébration ;
    aucun nom de fichier dans les étapes.

  Bibliothèque de test du défi de #100, comme dans #106. Paul est le parent de Léa. Léa a un profil enfant de
  niveau CE1 dans l'univers « Sports » : son personnage guide est Coach Léo.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Sports »
    Et que la bibliothèque de test du défi est servie

  Règle: Un univers qui a sa musique de célébration la fait entendre à la place de « grande victoire » : on entend la musique de l'univers, jamais « grande victoire », avant la parole du personnage guide

    Plan du Scénario: Au premier défi relevé dans l'univers « <univers> », <musique> se fait entendre à la place de « grande victoire »
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « <univers> »
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa entend <musique>, puis <personnage guide> dit « Bravo Léa ! Tu as relevé le défi 1 ! »
      Mais Léa n'entend pas l'effet sonore « grande victoire »

      Exemples:
        | univers             | personnage guide | musique                                        |
        | Danse               | Lili             | la musique de la célébration de Lili           |
        | Animaux de la forêt | Noisette         | la musique de la célébration de Noisette       |
        | Princesses et fées  | Lumi             | la musique de la célébration de Lumi           |
        | Pompiers            | Capitaine Sam    | la musique de la célébration de Capitaine Sam  |

      @issue-173
      Exemples: Sports et Police, musiques choisies à l'écoute de #173
        | univers             | personnage guide | musique                                        |
        | Sports              | Coach Léo        | la musique de la célébration de Coach Léo      |
        | Police              | Agent Max        | la musique de la célébration d'Agent Max       |

    Scénario: La séance qui rend les sciences du CE1 réussies fait entendre la musique de la célébration de Noisette, pas « grande victoire »
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « Animaux de la forêt »
      Et que Léa a réussi les 2 premières leçons de sciences du CE1
      Et que Léa joue la séance complète de la leçon « L'eau »
      Quand Léa réussit la dernière question de la séance
      Alors Léa entend la musique de la célébration de Noisette
      Mais Léa n'entend pas l'effet sonore « grande victoire »
