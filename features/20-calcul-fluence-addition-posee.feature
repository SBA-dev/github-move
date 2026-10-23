# language: fr
@issue-20 @wip
Fonctionnalité: Calcul, fluence et addition posée
  En tant qu'enfant
  Je veux calculer avec des choix ou le clavier de cristaux, calculer vite contre la montre, et poser puis calculer une addition en colonnes
  Afin de m'entraîner au calcul à mon rythme

  Leçons de la bibliothèque utilisées : « Les doubles » (ma-cp-doubles : calcul « Les doubles », opérations
  fixes « 2 + 2 » à « 10 + 10 », et fluence « Calcul rapide : les doubles » de 45 secondes) et « Poser une addition
  en colonnes » (ma-cp-addition-posee : « La leçon en action : 45 + 37 », à l'étape poser puis à l'étape calculer,
  et « Calculer avec la retenue », tirée par un générateur avec retenue). Les autres opérations sont celles de
  leçons de test, décrites dans les scénarios.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »

  Règle: Au CP, on répond à un calcul par choix ; à partir du CE1, au clavier de cristaux

    Scénario: Au CP, le calcul propose quatre choix autour du résultat
      Étant donné que Léa joue seulement l'exercice « Les doubles » de la leçon « Les doubles »
      Quand le calcul « 2 + 2 » s'affiche
      Alors Léa entend Noisette lire « Combien font 2 plus 2 ? »
      Et Léa voit « 2 + 2 = ? » et les choix « 3 », « 4 », « 5 » et « 6 »

    Scénario: Au CP, un résultat de 0 ne propose jamais de nombre négatif
      Étant donné qu'une leçon de test de niveau CP a un exercice calcul « 3 − 3 », de résultat 0
      Quand le calcul « 3 − 3 » s'affiche
      Alors Léa voit exactement les choix « 0 », « 1 » et « 2 »

    Scénario: À partir du CE1, le calcul se répond au clavier de cristaux
      Étant donné qu'une leçon de test de niveau CE1 a un exercice calcul « 12 − 5 », de résultat 7
      Quand le calcul « 12 − 5 » s'affiche pour Tom
      Alors Tom voit le clavier de cristaux, avec les chiffres de 0 à 9, « Effacer » et « Valider »
      Mais aucun choix n'est proposé

    Scénario: Au clavier de cristaux, un nombre faux s'efface et laisse une nouvelle chance
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom répond « 8 » au clavier de cristaux
      Alors le nombre « 8 » s'efface
      Et Noisette dit un encouragement
      Et le calcul « 12 − 5 » reste posé

    Scénario: « Valider » sans chiffre ne compte rien
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom valide sans avoir tapé de chiffre
      Alors Noisette ne dit rien
      Et le calcul « 12 − 5 » reste posé

    Scénario: Le clavier de cristaux n'accepte pas plus de 4 chiffres
      Étant donné que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom tape les chiffres 1, 2, 3, 4 et 5
      Alors Tom voit « 1234 »

  Règle: Les opérations tirées respectent leur générateur, et la difficulté s'adapte quand l'enfant se trompe souvent

    Scénario: Les opérations tirées restent dans les intervalles du générateur
      Étant donné qu'une leçon de test a un exercice calcul dont le générateur tire 3 additions de deux nombres entre 1 et 5
      Quand Léa commence cet exercice
      Alors Léa a 3 calculs à faire
      Et chaque calcul additionne deux nombres entre 1 et 5

    Scénario: Une soustraction tirée ne donne jamais un résultat négatif
      Étant donné qu'une leçon de test a un exercice calcul dont le générateur tire des soustractions
      Et que les nombres tirés sont 3 puis 8
      Quand le calcul s'affiche
      Alors Léa voit « 8 − 3 = ? »

    Scénario: Sans opérations ni générateur, le calcul propose 5 additions de nombres de 1 à 10
      Étant donné qu'une leçon de test a un exercice calcul sans opérations ni générateur
      Quand Léa commence cet exercice
      Alors Léa a 5 calculs à faire
      Et chaque calcul additionne deux nombres entre 1 et 10

    @a-valider
    Scénario: Quand l'enfant se trompe souvent, les nombres tirés deviennent plus petits
      Étant donné que les 50 dernières réponses de calcul de Tom comptent 4 réponses justes et 6 fausses
      Et qu'une leçon de test a un exercice calcul dont le générateur tire des additions de deux nombres entre 1 et 20
      Quand Tom commence cet exercice
      Alors chaque calcul additionne deux nombres entre 1 et 13

    @a-valider
    Scénario: Quand l'enfant réussit de nouveau, les nombres tirés regrandissent
      Étant donné que Tom s'est souvent trompé en calcul autrefois
      Mais que ses 50 dernières réponses de calcul comptent 45 réponses justes
      Et qu'une leçon de test a un exercice calcul dont le générateur tire des additions de deux nombres entre 1 et 20
      Quand Tom commence cet exercice
      Alors les nombres tirés peuvent aller jusqu'à 20

    Scénario: Avec moins de 6 réponses de calcul, la difficulté ne change pas
      Étant donné que Tom n'a donné que 5 réponses de calcul, toutes fausses
      Et qu'une leçon de test a un exercice calcul dont le générateur tire des additions de deux nombres entre 1 et 20
      Quand Tom commence cet exercice
      Alors les nombres tirés peuvent aller jusqu'à 20

  Règle: Après une erreur de calcul, le personnage guide lit l'aide de l'opération, sinon l'astuce de son signe

    Scénario: Sans aide, le personnage guide donne l'astuce de l'addition
      Étant donné que Léa joue seulement l'exercice « Les doubles » de la leçon « Les doubles »
      Et que Léa en est au calcul « 3 + 3 »
      Quand Léa répond « 5 »
      Alors Noisette dit un encouragement, suivi de « Pars du plus grand nombre, et avance du plus petit. »

    Scénario: L'aide de l'opération passe avant l'astuce de son signe
      Étant donné qu'une leçon de test a un exercice calcul « 9 + 6 », de résultat 15, d'aide « Fais 9 + 1, puis ajoute 5. »
      Quand Tom répond « 14 » à « 9 + 6 »
      Alors Noisette dit un encouragement, suivi de « Fais 9 + 1, puis ajoute 5. »

    @a-valider
    Scénario: Un calcul sans signe et sans aide n'a pas d'astuce
      Étant donné qu'une leçon de test a un exercice calcul « Moitié de 10 », de résultat 5, sans aide
      Quand Léa répond « 4 » à « Moitié de 10 »
      Alors Noisette dit seulement un encouragement

  Règle: La fluence compte les calculs réussis avant la fin du temps, sans erreur, et garde le record

    Scénario: La fluence commence au signal et compte chaque bonne réponse
      Étant donné que Léa est sur la page de la leçon « Les doubles »
      Et que Léa a choisi seulement l'exercice « Calcul rapide : les doubles »
      Quand Noisette dit « C'est parti ! »
      Alors Léa voit le temps qui reste, 45 secondes, et 0 calcul réussi
      Et chaque bonne réponse ajoute 1 calcul réussi

    @a-valider
    Scénario: Une réponse fausse pendant la fluence ne coûte pas d'erreur
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles », avec 3 calculs réussis
      Quand Léa donne une réponse fausse
      Alors la réponse s'efface
      Et Léa voit toujours 3 calculs réussis
      Mais Noisette ne dit aucun encouragement

    Scénario: Après la fin du temps, plus aucune réponse n'est prise
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles », avec 12 calculs réussis
      Et que le temps de la fluence est écoulé
      Quand Léa donne une bonne réponse
      Alors Léa voit toujours 12 calculs réussis

    Plan du Scénario: À la fin de la fluence, <cas>
      Étant donné que Léa <record avant> à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Quand le temps de la fluence est écoulé avec <score> calculs réussis
      Alors Noisette dit « <score> calculs réussis ! », puis <suite>

      Exemples:
        | cas                       | record avant           | score | suite                                                     |
        | un premier record         | n'a pas encore de record | 12  | annonce son premier record, 12                            |
        | un nouveau record         | a un record de 10      | 12    | annonce son nouveau record, 12                            |
        | le record reste           | a un record de 15      | 12    | « 12 calculs ! Ton record reste 15. Tu y es presque ! »   |

    @a-valider
    Plan du Scénario: À la fin de la fluence, <score> calcul réussi donne « <phrase> »
      Étant donné que Léa n'a pas encore de record à la fluence « Calcul rapide : les doubles »
      Et que Léa fait cette fluence
      Quand le temps de la fluence est écoulé avec <score> calculs réussis
      Alors Noisette dit « <phrase> »

      Exemples:
        | score | phrase                                                         |
        | 0     | Pas encore de calcul réussi : on réessaie quand tu veux !      |
        | 1     | 1 calcul réussi !                                              |

    Scénario: Un score de fluence de 0 n'est jamais un record
      Étant donné que Léa n'a pas encore de record à la fluence « Calcul rapide : les doubles »
      Et que Léa a fini cette fluence avec 0 calcul réussi
      Quand Léa fait de nouveau cette fluence et la finit avec 3 calculs réussis
      Alors Noisette annonce son premier record, 3

    @acces
    Scénario: Le record de fluence se retrouve sur un autre appareil du parent, et seulement pour un parent rattaché
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un record de 15 à la fluence « Calcul rapide : les doubles », gagné sur la tablette
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les records du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

  Règle: Addition posée, étape poser : chaque chiffre va dans la colonne de son rang

    Plan du Scénario: Dans l'univers « <univers> », les colonnes gardent leurs couleurs
      Étant donné que Nina a un profil enfant préparé de niveau CP dans l'univers « <univers> »
      Quand Nina commence l'exercice « La leçon en action : 45 + 37 » de la leçon « Poser une addition en colonnes »
      Alors Nina voit la colonne des dizaines en rose, à gauche, et la colonne des unités en bleu, à droite

      Exemples:
        | univers             |
        | Animaux de la forêt |
        | Pompiers            |

    Scénario: Un chiffre posé dans la colonne de son rang y reste
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa pose le chiffre « 5 » de 45 dans la colonne des unités
      Alors le chiffre « 5 » reste dans la colonne des unités

    Scénario: Un chiffre posé dans la mauvaise colonne revient, avec son rang et sa couleur
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape poser
      Quand Léa pose le chiffre « 4 » de 45 dans la colonne des unités
      Alors le chiffre « 4 » revient parmi les chiffres à poser
      Et Noisette dit un encouragement, suivi de « Dans 45, le 4 est le chiffre des dizaines : il va dans la maison rose. »

    Scénario: Un nombre d'un seul chiffre va dans la colonne des unités
      Étant donné qu'une leçon de test a une addition posée « 28 + 8 » à l'étape poser
      Et que Léa a posé le nombre 28
      Quand Léa pose le chiffre « 8 » du nombre 8 dans la colonne des dizaines
      Alors Noisette dit un encouragement, suivi de « Le 8 est tout seul : c'est un chiffre des unités. Il va dans la maison bleue, tout à droite. »

    @a-valider
    Scénario: Avec un chiffre en double, l'aide vise la colonne encore libre
      Étant donné qu'une leçon de test a une addition posée « 55 + 3 » à l'étape poser
      Et que Léa a posé le premier « 5 » de 55 dans la colonne des unités
      Quand Léa pose le second « 5 » de 55 dans la colonne des unités
      Alors Noisette dit un encouragement, suivi de « Dans 55, le 5 est le chiffre des dizaines : il va dans la maison rose. »

  Règle: Addition posée, étape calculer : on calcule des unités vers la gauche, et la dizaine monte en retenue

    Scénario: Une somme de 10 ou plus écrit ses unités et fait monter la retenue
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors Léa voit « 2 » écrit sous la colonne des unités, et la retenue « 1 » en haut de la colonne des dizaines
      Et Noisette dit « 12, c'est 1 dizaine et 2 unités ! J'écris 2, et 1 monte en retenue. »

    Scénario: Oublier la retenue est reconnu
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Quand Léa répond « 7 » pour la colonne des dizaines
      Alors Noisette dit un encouragement, suivi de « Tu as oublié la retenue, tout en haut de la maison ! »

    Scénario: Une autre erreur invite à compter doucement
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Quand Léa répond « 9 » pour la colonne des dizaines
      Alors Noisette dit un encouragement, suivi d'une phrase qui commence par « Compte doucement : »

    Scénario: La dernière colonne écrit toute sa somme, et l'addition est félicitée
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Quand Léa répond « 8 » pour la colonne des dizaines
      Alors Léa voit le résultat « 82 »
      Et Noisette dit « 45 + 37 = 82. », suivi d'une félicitation

    Scénario: Au CP, la somme d'une colonne se choisit parmi quatre nombres
      Étant donné que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand la colonne des unités est à calculer
      Alors Léa voit les choix « 12 », « 13 », « 11 » et « 2 »

    @a-valider
    Scénario: Dans la colonne des dizaines, la phrase de la retenue dit centaines et dizaines
      Étant donné qu'une leçon de test a une addition posée « 45 + 65 » à l'étape calculer
      Et que Léa a calculé la colonne des unités
      Quand Léa répond « 11 » pour la colonne des dizaines
      Alors Noisette dit « 11, c'est 1 centaine et 1 dizaine ! J'écris 1, et 1 monte en retenue. »

    @a-valider
    Scénario: Un générateur d'additions avec retenue donne toujours une retenue
      Étant donné que Léa est sur la page de la leçon « Poser une addition en colonnes »
      Quand Léa choisit seulement l'exercice « Calculer avec la retenue »
      Alors chacune des 3 additions a une retenue dans la colonne des unités

    @a-valider
    Scénario: L'avancement d'une addition posée compte chaque chiffre posé et chaque colonne calculée
      Étant donné que Léa est sur la page de la leçon « Poser une addition en colonnes »
      Quand Léa choisit seulement l'exercice « La leçon en action : 45 + 37 »
      Alors l'avancement de la séance montre 0 question réussie sur 6

  Règle: Le calcul s'utilise au doigt, au clavier, sans mouvement et sur un petit écran

    Scénario: Le clavier de cristaux tient dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand le calcul « 12 − 5 » s'affiche pour Tom
      Alors la page tient dans la largeur de l'écran
      Et chaque touche du clavier de cristaux mesure au moins 44 px de haut et de large

    Scénario: Sur un ordinateur, Tom répond au clavier de cristaux avec le clavier
      Étant donné que Tom joue sur un ordinateur, au clavier
      Et que Tom en est au calcul « 12 − 5 » d'une leçon de test de niveau CE1
      Quand Tom tape « 7 » et valide, au clavier seulement
      Alors le calcul « 12 − 5 » est réussi

    Scénario: Le temps qui reste et les calculs réussis de la fluence sont annoncés aux lecteurs d'écran
      Étant donné que Léa fait la fluence « Calcul rapide : les doubles »
      Quand Léa réussit un calcul
      Alors les lecteurs d'écran peuvent lire le temps qui reste et le nombre de calculs réussis

    Scénario: Avec les mouvements réduits, la retenue apparaît sans voler
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue l'exercice « La leçon en action : 45 + 37 » à l'étape calculer
      Quand Léa répond « 12 » pour la colonne des unités
      Alors la retenue « 1 » apparaît en haut de la colonne des dizaines, sans mouvement
