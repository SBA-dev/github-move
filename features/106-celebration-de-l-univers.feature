# language: fr
@issue-106
Fonctionnalité: Une célébration propre à chaque univers
  En tant qu'enfant
  Je veux que mon personnage guide fête mon défi relevé à la façon de mon univers
  Afin de vivre un vrai moment de victoire dans le monde que j'ai choisi

  Contexte Motivation (docs/stories/106/domain-model.md). La célébration de l'univers est une mise en scène :
  elle ne change ni le défi relevé, ni les étoiles, ni la suite du parcours, et rien n'est enregistré.
  Cadrage validé par le PO le 2026-11-02 (« 106 reco tout » : toutes les recommandations des questions 106.1 à
  106.27, docs/stories/106/acceptance.md). Ce fichier couvre la livraison 106a (mécanisme, moment « défi relevé » la
  première fois, univers « Sports » et sa musique) et la livraison 106c (univers « Animaux de la forêt », scénarios
  tagués @livraison-106c). Ce qui ne dépend pas de l'univers (toucher, clavier, Muet, espace parent, défi rejoué)
  n'est décrit qu'une fois, avec Coach Léo. Les scénarios tagués @hors-106a décrivent les livraisons suivantes
  (106b, puis 106d à 106h) : ils sont exclus et restent @a-valider jusqu'à leur livraison.

  Mots employés dans ces scénarios (validés, 106.1, 106.2 et 106.14) :
  - « la célébration de l'univers « Sports » » : Coach Léo marque un but, puis fait une des trois variantes de la
    célébration, tirée au hasard : « la glissade à genoux », « l'avion » ou « la danse avec clin d'œil ». Les
    confettis de la scène de Coach Léo font partie de sa célébration de l'univers (106.24) ;
  - « BUT ! » : le cri de victoire de l'univers « Sports », affiché et jamais lu ;
  - « la célébration de l'univers « Animaux de la forêt » » : Noisette attrape une noisette dorée, puis fait une des
    trois variantes de la célébration, tirée au hasard : « le jonglage », « la noisette croquée » ou « les joues
    pleines » (noms fixés d'après la maquette validée, 106.26). Les feuilles qui tombent sur la forêt, appelées ici
    « les feuilles de la forêt », font partie de sa célébration de l'univers, comme les confettis de la scène de
    Coach Léo (106.24) ;
  - « Hourra ! » : le cri de victoire de l'univers « Animaux de la forêt », affiché et jamais lu ;
  - « la musique de la célébration de Noisette » : l'effet sonore de sa célébration de l'univers, qui remplace
    « grande victoire », comme celle de Coach Léo (106.12) ; d'ici le choix du PO, c'est « grande victoire » ;
  - « la célébration commune » : les confettis et l'effet sonore de la fin, les mêmes dans tous les univers (#97) ;
    quand la célébration de l'univers est jouée, ni ses confettis ni son effet sonore ne s'y ajoutent ;
  - « la musique de la célébration de Coach Léo » : son effet sonore, qui remplace « grande victoire » (106.12).
    Le PO la choisira à l'écoute ; d'ici là, c'est « grande victoire », entendu une seule fois ;
  - « l'image fixe de la célébration » : la même scène, dans l'état final de la variante tirée, quand l'appareil
    demande des mouvements réduits (106.15) ; aucun confetti ne tombe, ni ceux de Coach Léo ni ceux de la
    célébration commune, et aucune des feuilles de la forêt (106.24).
  Durées, pour l'implémentation et la review, jamais dans les étapes : 3 s au plus (106.9 B), boutons, clavier
  et annonce disponibles dès la première image.

  Bibliothèque de test du défi de #100 (identifiants préfixés « e2e-100- ») : maths du CE1, « Maths 1 » à
  « Maths 10 », deux parties du parcours, donc un seul défi, le défi 1.
  Paul est le parent de Léa et de Tom. Léa a un profil enfant de niveau CE1 dans l'univers « Sports » : son
  personnage guide est Coach Léo.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Sports »
    Et que la bibliothèque de test du défi est servie

  Règle: Quand un enfant de l'univers « Sports » relève un défi pour la première fois, Coach Léo joue la célébration de l'univers à la place de la célébration commune, avant de le féliciter

    Scénario: Au premier défi relevé, Coach Léo marque un but et le fête, puis félicite Léa
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Coach Léo joue la célébration de l'univers « Sports » : il marque un but, puis fait la glissade à genoux, l'avion ou la danse avec clin d'œil
      Et Léa lit « BUT ! »
      Et Léa entend la musique de la célébration de Coach Léo, puis Coach Léo dit « Bravo Léa ! Tu as relevé le défi 1 ! »
      Et Coach Léo n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles
      Mais la célébration commune n'est pas jouée

    Plan du Scénario: Le hasard ne choisit que la variante : avec « <variante> », Coach Léo marque toujours son but
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Et que le hasard de la célébration de l'univers tire « <variante> »
      Quand Léa répond juste à toutes les questions du défi
      Alors Coach Léo marque un but, puis fait <variante>
      Et la fin du défi annonce « Défi relevé ! »

      Exemples:
        | variante                  |
        | la glissade à genoux      |
        | l'avion                   |
        | la danse avec clin d'œil  |

    Scénario: Un défi relevé avec des erreurs est fêté par la même célébration de l'univers
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond au défi, en se trompant une fois à chaque question
      Alors Coach Léo joue la célébration de l'univers « Sports » : il marque un but, puis fait la glissade à genoux, l'avion ou la danse avec clin d'œil
      Et la fin du défi annonce « Défi relevé ! »

    Scénario: Sans réseau, Coach Léo joue quand même la célébration de l'univers
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Et que le réseau est coupé
      Quand Léa répond juste à toutes les questions du défi
      Alors Coach Léo joue la célébration de l'univers « Sports » : il marque un but, puis fait la glissade à genoux, l'avion ou la danse avec clin d'œil
      Et la fin du défi annonce « Défi relevé ! »

  Règle: L'univers ne change que la mise en scène : même annonce, mêmes boutons, aucune étoile, même suite du parcours que dans un autre univers

    Plan du Scénario: Dans l'univers « <univers> », la fin du défi annonce et propose la même chose
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « <univers> »
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors la fin du défi annonce « Défi relevé ! »
      Et la fin du défi propose « Mon parcours » et « Accueil »
      Mais la fin du défi ne montre aucune étoile

      Exemples:
        | univers             |
        | Sports              |
        | Danse               |
        | Animaux de la forêt |

    Scénario: Après la célébration de l'univers, le parcours de Léa est le même que dans un autre univers
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a relevé le défi 1 de maths
      Quand Léa choisit « Maths » dans son parcours
      Alors Coach Léo se tient sur la leçon 6 « Maths 6 », marquée « À toi ! »
      Et le dessin du parcours montre le repère « Défi 1 » relevé, avec « Défi relevé » et « Rejouer le défi »

  Règle: La célébration de l'univers n'est jouée qu'au premier défi relevé ; un défi rejoué garde la célébration commune et « séance terminée »

    Scénario: Rejouer un défi relevé fait entendre « séance terminée », avec la célébration commune et sans but de Coach Léo
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a relevé le défi 1 de maths
      Et que Léa a choisi « Rejouer le défi » sur le repère « Défi 1 » de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa entend l'effet sonore « séance terminée », puis Coach Léo dit « Bravo Léa ! Tu as encore relevé le défi 1 ! »
      Et des confettis tombent
      Et Coach Léo apparaît à côté de la bulle de ses paroles
      Mais Coach Léo ne joue pas la célébration de l'univers

  Règle: La célébration jouée est celle de l'univers du profil au moment du défi relevé ; un univers dont la célébration n'est pas encore livrée garde la célébration commune

    Plan du Scénario: Dans l'univers « <univers> », pas encore livré, le premier défi relevé garde la célébration commune
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « <univers> »
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors des confettis tombent
      Et Léa entend l'effet sonore « grande victoire », puis <personnage guide> dit « Bravo Léa ! Tu as relevé le défi 1 ! »
      Mais aucune célébration de l'univers n'est jouée

      Exemples:
        | univers             | personnage guide |
        | Princesses et fées  | Lumi             |
        | Police              | Agent Max        |
        | Pompiers            | Capitaine Sam    |
        | Danse               | Lili             |

    Scénario: Un enfant passé dans l'univers « Sports » voit Coach Léo fêter son premier défi relevé
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Paul a changé l'univers du profil enfant de Tom en « Sports »
      Et que Tom a réussi les 5 premières leçons de maths du CE1
      Et que Tom a commencé le défi 1 de maths
      Quand Tom répond juste à toutes les questions du défi
      Alors Coach Léo joue la célébration de l'univers « Sports » : il marque un but, puis fait la glissade à genoux, l'avion ou la danse avec clin d'œil

  Règle: La célébration de l'univers ne retient jamais l'enfant : un toucher hors des boutons ne fait rien, les boutons et le clavier agissent tout de suite et arrêtent sa musique

    Scénario: Toucher l'écran en dehors des boutons pendant la célébration de l'univers ne change rien
      Étant donné que Léa voit la célébration de l'univers « Sports » à la fin du défi 1 de maths
      Quand Léa touche l'écran en dehors des boutons
      Alors Coach Léo continue la célébration de l'univers
      Et Léa entend la musique de la célébration de Coach Léo jusqu'au bout

    Scénario: Pendant la célébration de l'univers, toucher « Mon parcours » y mène tout de suite et arrête la musique
      Étant donné que Léa voit la célébration de l'univers « Sports » à la fin du défi 1 de maths
      Quand Léa choisit « Mon parcours »
      Alors Léa voit le dessin du parcours de maths
      Et Léa n'entend plus la musique de la célébration de Coach Léo

    Scénario: Pendant la célébration de l'univers, le clavier n'est jamais bloqué
      Étant donné que Léa voit la célébration de l'univers « Sports » à la fin du défi 1 de maths
      Quand Léa choisit « Accueil » au clavier
      Alors Léa voit son accueil

    Scénario: À 360 px, la célébration de l'univers tient dans la largeur et ses boutons restent assez grands
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors la page tient dans la largeur de l'écran
      Et « Mon parcours » et « Accueil » mesurent au moins 44 px de haut

  Règle: Avec les mouvements réduits, rien ne bouge et l'information reste : l'image fixe de la même scène, le cri de victoire et l'annonce ; les lecteurs d'écran n'annoncent qu'une fois le défi relevé

    Scénario: Avec les mouvements réduits, Léa voit l'image fixe de la célébration, sans mouvement ni confettis
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa voit l'image fixe de la célébration de l'univers « Sports », avec « BUT ! », sans mouvement
      Et la fin du défi annonce « Défi relevé ! », sans mouvement
      Et aucun confetti ne tombe

    Scénario: Les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire le cri de victoire
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors les lecteurs d'écran annoncent une seule fois « Défi relevé ! »
      Mais les lecteurs d'écran n'annoncent ni « BUT ! » ni le dessin de la célébration

  Règle: La musique de la célébration de l'univers est un effet sonore : le Muet ne la coupe pas, il coupe seulement la parole ; un écran du parent l'arrête

    Scénario: En Muet, la musique de la célébration de l'univers se fait entendre, sans parole
      Étant donné que la tablette est en Muet
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa entend la musique de la célébration de Coach Léo
      Mais Léa n'entend aucune parole

    Scénario: En arrivant sur un écran du parent, la musique de la célébration de l'univers s'arrête
      Étant donné que Léa voit la célébration de l'univers « Sports » à la fin du défi 1 de maths
      Quand Léa demande l'entrée de l'espace parent
      Alors Léa voit une question du contrôle parental
      Et Léa n'entend plus la musique de la célébration de Coach Léo

  # ---------------------------------------------------------------------------------------------------------
  # Livraison 106c : univers « Animaux de la forêt », Noisette.
  # ---------------------------------------------------------------------------------------------------------

  Règle: Dans l'univers « Animaux de la forêt », Noisette joue au premier défi relevé sa célébration de l'univers à la place de la célébration commune, avec les mêmes garanties que Coach Léo : image fixe en mouvements réduits, cri de victoire jamais lu, place tenue à 360 px (106c)

    Contexte:
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « Animaux de la forêt »

    @livraison-106c
    Scénario: Au premier défi relevé dans l'univers « Animaux de la forêt », Noisette attrape une noisette dorée et le fête, puis félicite Léa
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Noisette joue la célébration de l'univers « Animaux de la forêt » : elle attrape une noisette dorée, puis le jonglage, la noisette croquée ou les joues pleines
      Et Léa lit « Hourra ! »
      Et Léa entend la musique de la célébration de Noisette, puis Noisette dit « Bravo Léa ! Tu as relevé le défi 1 ! »
      Et Noisette n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles
      Mais la célébration commune n'est pas jouée

    @livraison-106c
    Plan du Scénario: Le hasard ne choisit que la variante : avec « <variante> », Noisette attrape toujours une noisette dorée
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Et que le hasard de la célébration de l'univers tire « <variante> »
      Quand Léa répond juste à toutes les questions du défi
      Alors Noisette attrape une noisette dorée, puis <variante>
      Et la fin du défi annonce « Défi relevé ! »

      Exemples:
        | variante            |
        | le jonglage         |
        | la noisette croquée |
        | les joues pleines   |

    @livraison-106c
    Scénario: Avec les mouvements réduits, Léa voit l'image fixe de la célébration de l'univers « Animaux de la forêt », sans mouvement, ni confettis, ni feuilles
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa voit l'image fixe de la célébration de l'univers « Animaux de la forêt », avec « Hourra ! », sans mouvement
      Et la fin du défi annonce « Défi relevé ! », sans mouvement
      Et aucun confetti ni feuille ne tombe

    @livraison-106c
    Scénario: Dans l'univers « Animaux de la forêt », les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire « Hourra ! »
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors les lecteurs d'écran annoncent une seule fois « Défi relevé ! »
      Mais les lecteurs d'écran n'annoncent ni « Hourra ! » ni le dessin de la célébration

    @livraison-106c
    Scénario: À 360 px, la célébration de l'univers « Animaux de la forêt » tient dans la largeur et ses boutons restent assez grands
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa lit « Hourra ! »
      Et la page tient dans la largeur de l'écran
      Et « Mon parcours » et « Accueil » mesurent au moins 44 px de haut

  # ---------------------------------------------------------------------------------------------------------
  # Livraisons suivantes (106d à 106h), exclues. Leur mise en place sera reprise dans leur livraison.
  # ---------------------------------------------------------------------------------------------------------

  Règle: Chaque univers a sa célébration de l'univers, jouée par son personnage guide, avec son cri de victoire (106b à 106f)

    @hors-106a @a-valider
    Plan du Scénario: Dans l'univers « <univers> », <personnage guide> fête le premier défi relevé à sa façon
      Étant donné que Paul a changé l'univers du profil enfant de Léa en « <univers> »
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors <personnage guide> joue la célébration de l'univers « <univers> » : <action>, puis <variantes>
      Et Léa lit « <cri> »
      Et la fin du défi annonce « Défi relevé ! »

      Exemples:
        | univers             | personnage guide | action                               | variantes                                              | cri                 |
        | Danse               | Lili             | elle entre en scène et fait une pirouette | le grand jeté, le ruban ou les sauts              | Bravo !             |
        | Princesses et fées  | Lumi             | un sort fait éclore une fleur        | l'arc-en-ciel, l'envol ou les signes                   | Magique !           |
        | Police              | Agent Max        | il retrouve un chiot perdu           | l'orchestre, la trottinette ou la danse                | Enquête résolue !   |
        | Pompiers            | Capitaine Sam    | le jet de sa lance dessine un arc-en-ciel | à dessiner et valider (106.16)                    | Mission accomplie ! |

  Règle: La séance qui rend une matière réussie est fêtée par la célébration de l'univers, avec l'annonce « Matière réussie ! » (106g)

    @hors-106a @a-valider
    Scénario: La séance qui rend réussie la dernière leçon de sciences du CE1 fait jouer la célébration de l'univers
      Étant donné que Léa a réussi les 2 premières leçons de sciences du CE1
      Et que Léa joue la séance complète de la leçon « L'eau »
      Quand Léa réussit la dernière question de la séance
      Alors Coach Léo joue la célébration de l'univers « Sports » : il marque un but, puis fait la glissade à genoux, l'avion ou la danse avec clin d'œil
      Et la fin de la séance annonce « Matière réussie ! »
      Et les lecteurs d'écran annoncent une seule fois « Matière réussie ! »

    @hors-106a @a-valider
    Scénario: Rejouer une leçon d'une matière déjà réussie ne fait pas jouer la célébration de l'univers
      Étant donné que Léa a réussi les 3 premières leçons de sciences du CE1
      Et que Léa joue la séance complète de la leçon « L'eau »
      Quand Léa réussit la dernière question de la séance
      Alors des confettis tombent
      Mais Coach Léo ne joue pas la célébration de l'univers

  Règle: Au palier des tenues, le personnage guide joue sa célébration de l'univers en portant la tenue reçue ; une seule célébration par fin (106h)

    @hors-106a @a-valider
    Scénario: La séance qui fait recevoir une tenue fait danser Coach Léo avec sa nouvelle tenue
      Étant donné que Léa a gagné 4 étoiles en tout
      Et que Léa joue la séance complète de la leçon « Maths 6 »
      Quand Léa réussit la dernière question de la séance
      Alors Coach Léo joue la célébration de l'univers « Sports » avec « une écharpe rayée »
      Et la fin de la séance annonce pour Coach Léo « Coach Léo a reçu une écharpe rayée ! »

    @hors-106a @a-valider
    Scénario: Une séance qui rend la matière réussie et fait recevoir une tenue ne joue qu'une célébration de l'univers
      Étant donné que Léa a gagné 4 étoiles en tout
      Et que Léa a réussi les 2 premières leçons de sciences du CE1
      Et que Léa joue la séance complète de la leçon « L'eau »
      Quand Léa réussit la dernière question de la séance
      Alors Coach Léo joue une seule fois la célébration de l'univers « Sports »
      Et la fin de la séance annonce « Matière réussie ! » puis, pour Coach Léo, « Coach Léo a reçu une écharpe rayée ! »
