# language: fr
@issue-166 @wip
Fonctionnalité: Une musique propre à chaque univers pour les célébrations
  En tant qu'enfant
  Je veux entendre la musique de mon univers quand mon personnage guide fête ma victoire
  Afin de reconnaître le monde que j'ai choisi, même les yeux fermés

  Contexte Motivation et Voix (docs/stories/166/acceptance.md). La célébration de l'univers existe déjà (#106) ;
  cette story ne change que sa musique : chaque univers a la sienne, choisie par le PO à l'écoute, et elle
  remplace « grande victoire » (106.12). Le reste est déjà décrit et n'est pas répété ici :
  - l'ordre « la musique, puis la parole » dans les six univers : features/106-celebration-de-l-univers.feature
    (scénarios « Au premier défi relevé dans l'univers … ») ;
  - toucher, boutons, clavier, Muet et écran du parent : même fichier, avec Coach Léo ;
  - la musique, puis « découverte », puis la parole à la danse de victoire : features/102-personnage-guide-evolue.feature ;
  - « grande victoire » toujours entendu quand aucune célébration de l'univers n'est jouée (leçon acquise, record de
    fluence) : features/97-retours-animes-et-sonores.feature.

  Mots employés dans ces scénarios (ceux de #106) :
  - « la musique de la célébration de Coach Léo » (de Lili, de Noisette, de Lumi, d'Agent Max, de Capitaine Sam) :
    l'effet sonore de la célébration de l'univers du personnage guide, choisi par le PO pour cet univers (#166).
    Courte, joyeuse, sans voix ni parole, jamais plus longue que la célébration ; aucun nom de fichier dans les
    étapes.

  Bibliothèque de test du défi de #100, comme dans #106. Paul est le parent de Léa. Léa a un profil enfant de
  niveau CE1 dans l'univers « Sports » : son personnage guide est Coach Léo.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Sports »
    Et que la bibliothèque de test du défi est servie

  Règle: Chaque univers a sa musique de célébration, qui remplace « grande victoire » : on entend la musique de l'univers, jamais « grande victoire », avant la parole du personnage guide

    Plan du Scénario: Au premier défi relevé dans l'univers « <univers> », <musique> se fait entendre à la place de « grande victoire »
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « <univers> »
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa entend <musique>, puis <personnage guide> dit « Bravo Léa ! Tu as relevé le défi 1 ! »
      Mais Léa n'entend pas l'effet sonore « grande victoire »

      Exemples:
        | univers             | personnage guide | musique                                        |
        | Sports              | Coach Léo        | la musique de la célébration de Coach Léo      |
        | Danse               | Lili             | la musique de la célébration de Lili           |
        | Animaux de la forêt | Noisette         | la musique de la célébration de Noisette       |
        | Princesses et fées  | Lumi             | la musique de la célébration de Lumi           |
        | Police              | Agent Max        | la musique de la célébration d'Agent Max       |
        | Pompiers            | Capitaine Sam    | la musique de la célébration de Capitaine Sam  |

    Scénario: La séance qui rend les sciences du CE1 réussies fait entendre la musique de la célébration de Coach Léo, pas « grande victoire »
      Étant donné que Léa a réussi les 2 premières leçons de sciences du CE1
      Et que Léa joue la séance complète de la leçon « L'eau »
      Quand Léa réussit la dernière question de la séance
      Alors Léa entend la musique de la célébration de Coach Léo
      Mais Léa n'entend pas l'effet sonore « grande victoire »
