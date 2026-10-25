# language: fr
@issue-24
Fonctionnalité: Étoiles et fin de la séance
  En tant qu'enfant
  Je veux voir combien d'étoiles j'ai gagnées à la fin d'une séance, puis rejouer ou passer à la suite
  Afin de savoir où j'en suis et d'avoir envie de continuer

  Leçons de la bibliothèque utilisées : « Les sons ou, on, an » (fr-cp-sons-ou-on-an, quand la séance n'a pas
  besoin de se terminer dans l'interface, ou ne joue que son exercice bulles « Quel son entends-tu ? »),
  « Les animaux » (an-cp-animaux, dernière leçon d'anglais du CP) et « Les doubles » (ma-cp-doubles, avec la
  fluence « Calcul rapide : les doubles »).
  Leçons de test, ajoutées à la bibliothèque pour ces scénarios :
  - « Les sons de test » (français, CP, ordre 901) : une étape de leçon, puis deux exercices bulles de
    5 questions à quatre choix chacun, « Premières bulles » (consigne « Touche le mot qui a le son ou. »)
    et « Dernières bulles » (consigne « Touche le mot qui a le son on. »). La séance complète compte
    10 questions : jusqu'à 3 erreurs par question, donc de 0 à 30 erreurs possibles.
  - « La suite de test » (français, CP, ordre 903) : la leçon d'ordre suivant, même matière et même niveau ;
    aucune leçon de français du CP n'a d'ordre entre 901 et 903.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Claire n'y est pas rattachée.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que les leçons de test « Les sons de test » et « La suite de test » sont dans la bibliothèque

  Règle: Une séance terminée donne 3 étoiles sans erreur, 2 avec 1 à 3 erreurs, et 1 au-delà

    Plan du Scénario: Avec <erreurs> erreur(s) dans la séance, Léa gagne <étoiles> étoile(s)
      Étant donné que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait <erreurs> erreur(s) pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Léa voit <étoiles> étoile(s) allumée(s) sur 3
      Et l'écran indique en texte « <étoiles> étoile(s) sur 3 »

      Exemples:
        | erreurs | étoiles |
        | 0       | 3       |
        | 1       | 2       |
        | 3       | 2       |
        | 4       | 1       |
        | 9       | 1       |

    Scénario: Les erreurs de tous les exercices de la séance comptent ensemble
      Étant donné que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait 2 erreurs à l'exercice « Premières bulles »
      Et que Léa a fait 2 erreurs à l'exercice « Dernières bulles »
      Quand Léa réussit la dernière question de la séance
      Alors Léa voit 1 étoile allumée sur 3

  Règle: À la fin de la séance, le personnage guide dit à l'enfant combien d'étoiles il a gagnées

    # Mise à jour par #32 (décision 32.25)
    Scénario: Avec 3 étoiles, le personnage guide dit son expression et salue l'enfant
      Étant donné que Léa a gagné 6 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa n'a fait aucune erreur pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Noisette dit l'une de ses expressions, suivie de « Trois étoiles, Léa ! Tu es incroyable ! »

    Plan du Scénario: Avec <étoiles>, le personnage guide propose de rejouer pour les autres étoiles
      Étant donné que Léa joue la séance complète de la leçon « Les sons de test »
      Et que Léa a fait <erreurs> erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Noisette dit une félicitation, suivie de « <phrase> »

      Exemples:
        | erreurs | étoiles   | phrase                                                                  |
        | 2       | 2 étoiles | Tu gagnes 2 étoiles, Léa. Tu rejoues pour aller chercher les autres ?   |
        | 5       | 1 étoile  | Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ?    |

  Règle: Une séance d'un exercice donne aussi les étoiles de la leçon, sauf une séance faite seulement d'une fluence

    Scénario: Une séance d'un exercice donne les étoiles de la leçon
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les sons ou, on, an »
      Et que Léa joue seulement l'exercice « Quel son entends-tu ? »
      Et que Léa n'a fait aucune erreur pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la page de la leçon « Les sons ou, on, an » montre 3 étoiles pour Léa

    Scénario: Une séance faite seulement d'une fluence ne donne pas d'étoiles
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les doubles »
      Et que Léa joue seulement l'exercice « Calcul rapide : les doubles »
      Quand le temps de la fluence est écoulé
      Alors Léa voit son score de fluence, sans étoiles
      Et la page de la leçon « Les doubles » ne montre aucune étoile pour Léa

  Règle: Les meilleures étoiles d'une leçon ne baissent jamais

    Scénario: Une séance moins bonne ne fait pas baisser les meilleures étoiles
      Étant donné que Léa a déjà gagné 3 étoiles à la leçon « Les sons ou, on, an »
      Et que Léa joue seulement l'exercice « Quel son entends-tu ? »
      Et que Léa a fait 5 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors Léa voit 1 étoile allumée sur 3 pour cette séance
      Et la page de la leçon « Les sons ou, on, an » montre toujours 3 étoiles pour Léa

    Scénario: Une meilleure séance fait monter les meilleures étoiles
      Étant donné que Léa a déjà gagné 1 étoile à la leçon « Les sons ou, on, an »
      Et que Léa joue seulement l'exercice « Quel son entends-tu ? »
      Et que Léa a fait 2 erreurs pendant la séance
      Quand Léa réussit la dernière question de la séance
      Alors la page de la leçon « Les sons ou, on, an » montre 2 étoiles pour Léa

    @acces
    Scénario: Les étoiles gagnées sur la tablette se retrouvent sur un autre appareil du parent
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette
      Et que Paul est connecté sur le téléphone
      Quand Léa ouvre la page de la leçon « Les sons ou, on, an » sur le téléphone
      Alors la page de la leçon montre 2 étoiles pour Léa

  Règle: À la fin de la séance, l'enfant rejoue, passe à la leçon suivante ou revient à l'accueil

    Scénario: La fin de la séance propose la leçon suivante, l'accueil et de rejouer
      Étant donné que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Leçon suivante », « Accueil » et « Rejouer »
      Et le focus est sur « Accueil »

    Scénario: La leçon suivante est la première leçon d'après non réussie de la même matière et du même niveau
      Étant donné que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Ensuite : La suite de test »
      Et la leçon suivante ouvre la page de la leçon « La suite de test »

    Scénario: Après la dernière leçon d'une matière, aucune leçon suivante n'est proposée
      Étant donné que Léa joue la séance complète de la leçon « Les animaux »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Accueil » et « Rejouer »
      Mais aucune leçon suivante n'est proposée

    Scénario: Rejouer relance le même choix de séance
      Étant donné que Léa a terminé une séance de l'exercice « Dernières bulles » seul
      Quand Léa rejoue
      Alors Léa entend Noisette lire « Touche le mot qui a le son on. »
      Mais Léa n'entend aucune étape de leçon

    Scénario: Rejouer tire de nouveaux calculs
      Étant donné qu'une leçon de test « Additions » a un exercice calcul dont le générateur tire des additions
      Et que Léa a terminé une séance de « Additions » dont le premier calcul était « 2 + 5 »
      Et que le prochain calcul tiré est « 4 + 3 »
      Quand Léa rejoue
      Alors le premier calcul de la nouvelle séance est « 4 + 3 »

  Règle: Une séance terminée est enregistrée une seule fois, par le serveur, et seulement pour un parent rattaché

    Scénario: Le serveur refuse une séance terminée qui annonce des étoiles
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les sons ou, on, an »
      Quand l'appareil envoie une séance terminée de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » avec 5 erreurs, en annonçant 3 étoiles
      Alors l'enregistrement est refusé
      Et la page de la leçon « Les sons ou, on, an » ne montre aucune étoile pour Léa sur le téléphone de Paul

    Scénario: Le serveur recalcule les étoiles à partir des réponses de la séance
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les sons ou, on, an »
      Quand l'appareil envoie une séance terminée de l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an » avec 5 erreurs, sans annoncer d'étoiles
      Alors la page de la leçon « Les sons ou, on, an » montre 1 étoile pour Léa sur le téléphone de Paul

    Scénario: Une séance terminée incohérente n'est pas enregistrée, sans rien montrer de plus à l'enfant
      Étant donné que Léa n'a encore jamais terminé de séance de la leçon « Les sons ou, on, an »
      Quand l'appareil envoie une séance terminée dont une question ne finit pas par la bonne réponse
      Alors Léa ne voit aucun message de plus
      Et la page de la leçon « Les sons ou, on, an » ne montre aucune étoile pour Léa

    @acces
    Scénario: Le second parent rattaché voit les étoiles de Léa
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette
      Quand Marie ouvre le profil enfant de Léa sur le téléphone
      Alors Marie voit que Léa a 2 étoiles à la leçon « Les sons ou, on, an »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne peut pas enregistrer une séance pour Léa
      Étant donné que Claire est connectée sur le téléphone
      Quand Claire envoie une séance terminée de la leçon « Les sons ou, on, an » pour le profil enfant de Léa
      Alors l'enregistrement est refusé comme pour un profil introuvable
      Et la page de la leçon « Les sons ou, on, an » ne montre aucune étoile pour Léa sur la tablette

    @acces
    Scénario: Un parent qui n'est pas rattaché ne voit pas les étoiles de Léa
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les étoiles du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

    Scénario: Une séance quittée avant la fin n'est pas enregistrée
      Étant donné que Léa a déjà gagné 1 étoile à la leçon « Les sons ou, on, an »
      Et que Léa a quitté une séance complète de cette leçon avant la dernière question
      Quand Léa ouvre la page de la leçon « Les sons ou, on, an »
      Alors la page de la leçon montre toujours 1 étoile pour Léa

    Scénario: Sans réseau, la fin de la séance s'affiche et la séance terminée est envoyée plus tard
      Étant donné que Léa joue la séance complète de la leçon « Les sons de test »
      Et que le réseau est coupé
      Quand Léa réussit la dernière question de la séance
      Alors Léa voit ses étoiles
      Et elle voit le message « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. »

    Scénario: Au retour du réseau, la séance gardée sur l'appareil est enregistrée
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » sur la tablette, sans réseau
      Quand le réseau revient sur la tablette
      Alors la page de la leçon « Les sons ou, on, an » montre 2 étoiles pour Léa sur le téléphone de Paul

  Règle: Les séances terminées font partie des données du profil enfant

    @depend-de-14
    Scénario: L'export du profil contient les séances terminées et les étoiles, sans les réponses données
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an » avec 2 erreurs
      Et que Paul est dans l'espace parent
      Quand Paul exporte les données du profil enfant de Léa
      Alors le fichier téléchargé contient la séance terminée de « Les sons ou, on, an », avec sa date, ses 2 étoiles et ses 2 erreurs
      Et les meilleures étoiles de Léa pour cette leçon
      Mais aucune des réponses données par Léa

    @depend-de-14
    Scénario: La suppression du profil efface ses séances terminées et ses étoiles
      Étant donné que Léa a gagné 2 étoiles à la leçon « Les sons ou, on, an »
      Et que Paul a demandé la suppression du profil enfant de Léa
      Quand Paul confirme la suppression du profil enfant de Léa
      Alors plus aucune séance terminée ni aucune étoile de Léa n'est gardée par Savanturier

  Règle: La fin de la séance se lit sans les dessins, sans mouvement et sur un petit écran

    Scénario: Avec les mouvements réduits, la fin de la séance s'affiche sans étincelles
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors Léa voit ses étoiles sans étincelles ni mouvement

    Scénario: La fin de la séance tient dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue la séance complète de la leçon « Les sons de test »
      Quand Léa réussit la dernière question de la séance
      Alors la page tient dans la largeur de l'écran
      Et « Leçon suivante », « Accueil » et « Rejouer » mesurent au moins 44 px de haut
