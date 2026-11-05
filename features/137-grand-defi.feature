# language: fr
@issue-137
Fonctionnalité: Grand défi de la matière
  En tant qu'enfant
  Je veux relever un grand défi qui mélange les questions de toute une matière, quand je l'ai réussie
  Afin de me prouver que je la maîtrise, sans rien risquer de perdre

  Contexte Apprentissage pour le grand défi, Motivation pour sa mise en scène (docs/stories/137/domain-model.md).
  Le grand défi est un défi : il suit toutes les règles du défi d'une partie du parcours (#100) que ses scénarios
  couvrent déjà (aucune étoile, rien de bloqué, encouragement et nouvelle chance après une erreur, quitter sans rien
  perdre, sans réseau, mouvements réduits, refus du serveur). Ces scénarios ne décrivent que ce qui lui est propre.
  Décisions du PO gardées depuis #100 (réponse 2.a du 2026-10-29) : R6, 100.3, 100.5, 100.6, 100.7, 100.14, 100.20
  à 100.23. Décisions #137.1 à #137.7 du PO du 2026-11-04 (recommandations retenues) :
  docs/stories/137/acceptance.md.

  Mots employés dans ces scénarios (en plus de ceux de features/100-defi-de-fin-de-partie-du-parcours.feature) :
  - « le grand défi des maths » : le défi dont les leçons sont toutes les leçons du parcours des maths de la classe
    de Léa ; l'écran dit « Grand défi » (100.3) ; nom de référence « grand défi » (décision #137.1) ;
  - « le repère « Grand défi » » : la place du grand défi sur le dessin du parcours, après la dernière leçon de la
    matière, près du fanion de la fin du dessin du parcours (#99) ; il remplace le défi de la dernière partie du
    parcours (100.23) ;
  - « défi d'une partie du parcours » : « Défi 1 », « Défi 2 »… de #100.

  La bibliothèque de test du défi de #100 suffit (identifiants préfixés « e2e-100- ») :
  - maths du CE1 : « Maths 1 » à « Maths 10 », chacune 2 questions qui se posent seules (« Combien font n + 1 ? »
    et « Combien font n + 2 ? »), soit 20 questions possibles ; « Maths 2 » a en plus une fluence de calcul, qui
    n'entre jamais dans un défi ;
  - sciences du CE1 : « Les êtres vivants », « Les saisons », « L'eau », chacune 2 questions, soit 6 questions
    possibles, moins que les 12 du grand défi (100.22).
  Les maths du CE1 ont deux parties du parcours : le défi 1, puis le grand défi à la place du défi de la dernière
  partie. Les sciences du CE1 ont une seule partie du parcours : elles n'ont que le grand défi (100.14).
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Claire n'est rattachée à aucun d'eux.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
    Et que la bibliothèque de test du défi est servie

  Règle: Chaque matière a un grand défi, près du fanion, à la place du défi de la dernière partie du parcours ; il s'ouvre quand la matière est réussie ; avant, il est à venir, visible et sans cadenas

    Plan du Scénario: Tant que la matière n'est pas réussie, le grand défi est à venir près du fanion, sans cadenas (<cas>)
      Étant donné que Léa a réussi les <réussies> premières leçons de <matière> du CE1
      Quand Léa choisit « <Matière> » dans son parcours
      Alors le dessin du parcours montre le repère « Grand défi » à venir, après la leçon <place>, près du fanion, avec « <reste> »
      Mais le repère « Grand défi » n'a pas de cadenas et ne propose pas « Relever le défi »

      Exemples:
        | cas                               | réussies | matière  | Matière  | place | reste                                |
        | maths : 9 leçons réussies sur 10  | 9        | maths    | Maths    | 10    | Encore 1 leçon pour ouvrir le défi   |
        | sciences : aucune leçon réussie   | 0        | sciences | Sciences | 3     | Encore 3 leçons pour ouvrir le défi  |

    Plan du Scénario: La matière réussie, le grand défi est ouvert près du fanion et remplace le défi de la dernière partie du parcours (<cas>)
      Étant donné que Léa a réussi les <réussies> premières leçons de <matière> du CE1
      Et que Léa n'a encore relevé aucun défi
      Quand Léa choisit « <Matière> » dans son parcours
      Alors le dessin du parcours montre le repère « Grand défi » ouvert, après la leçon <place>, près du fanion, avec « Relever le défi »
      Et le dessin du parcours montre, en plus, <défis>

      Exemples:
        | cas                                         | réussies | matière  | Matière  | place | défis                                                          |
        | maths du CE1, deux parties du parcours      | 10       | maths    | Maths    | 10    | un seul défi d'une partie du parcours, « Défi 1 », après la leçon 5 |
        | sciences du CE1, une seule partie du parcours | 3      | sciences | Sciences | 3     | aucun défi d'une partie du parcours                            |

  Règle: La séance qui rend la matière réussie annonce le grand défi ; le personnage guide le propose sans le lancer

    # Décisions #137.4 (parole de Noisette) et #137.7 (« Relever le défi » en plus des boutons habituels).
    Scénario: La séance qui rend réussie la dernière leçon de maths qui manquait annonce le grand défi, et le personnage guide le propose sans le lancer
      Étant donné que Léa a réussi les 9 premières leçons de maths du CE1
      Et que Léa joue la séance complète de la leçon « Maths 10 »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Le grand défi des maths est ouvert ! »
      Et Noisette dit « Bravo Léa ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend ! »
      Et la fin de la séance propose « Relever le défi »
      Mais aucun défi ne commence sans que Léa le choisisse

    # Décision #137.2 (une séance qui ouvre deux défis) : A, seulement l'annonce du grand défi.
    Scénario: Une séance qui ouvre à la fois le défi 1 et le grand défi n'annonce que le grand défi
      Étant donné que Léa a réussi toutes les leçons de maths du CE1, sauf « Maths 5 »
      Et que Léa joue la séance complète de la leçon « Maths 5 »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Le grand défi des maths est ouvert ! »
      Mais la fin de la séance n'annonce pas « Le défi 1 est ouvert ! »

  Règle: Le grand défi pose 12 questions de toute la matière, au moins une de chaque leçon, réparties à parts égales et mélangées ; s'il y en a moins de possibles, il les pose toutes, une fois chacune

    Scénario: Le grand défi des maths pose 12 questions, au moins une de chacune des 10 leçons, mélangées, jamais d'une fluence
      Étant donné que Léa a réussi les 10 premières leçons de maths du CE1
      Et que Léa a commencé le grand défi des maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa a eu 12 questions, au moins une et au plus 2 de chacune des leçons « Maths 1 » à « Maths 10 », sans suivre l'ordre des leçons
      Et aucun calcul en temps limité

    Scénario: Quand la matière a moins de 12 questions possibles, le grand défi les pose toutes, une seule fois chacune
      Étant donné que Léa a réussi les 3 premières leçons de sciences du CE1
      Et que Léa a commencé le grand défi des sciences
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa a eu 6 questions, les 2 de chacune des leçons « Les êtres vivants », « Les saisons » et « L'eau »
      Mais aucune question n'a été posée deux fois

  Règle: Le grand défi se joue et se fête comme un défi : écran « Grand défi », ni vie ni temps limité, relevé dès qu'il est terminé, rejouable sans nouvelle récompense, aucune étoile ; une question ratée entre dans la file de révision ; il se retrouve dans « Mes défis relevés »

    # Décision #137.5 (parole du début).
    Scénario: Le grand défi commence par une parole du personnage guide, sans vie ni temps qui passe
      Étant donné que Léa a réussi les 10 premières leçons de maths du CE1
      Quand Léa relève le grand défi des maths depuis son parcours
      Alors l'écran s'intitule « Grand défi », avec « Maths »
      Et Noisette dit « Voici des questions de toutes tes leçons de maths. Prends ton temps, je suis avec toi ! »
      Mais l'écran ne montre ni vie, ni temps qui passe, ni nombre d'erreurs

    # Décision #137.5 (annonce et parole de la fin du défi) : A, « Grand défi relevé ! ».
    Scénario: Un grand défi terminé avec des erreurs est relevé, et sa fin le fête sans étoile
      Étant donné que Léa a réussi les 10 premières leçons de maths du CE1
      Et que Léa a commencé le grand défi des maths
      Quand Léa répond au défi, en se trompant une fois à chaque question
      Alors la fin du défi annonce « Grand défi relevé ! »
      Et Léa entend l'effet sonore « grande victoire », puis Noisette dit « Bravo Léa ! Tu as relevé le grand défi des maths ! »
      Et la fin du défi ne montre aucune étoile
      Et la fin du défi propose « Mon parcours » et « Accueil »

    # Décision #137.5 (parole du grand défi rejoué).
    Scénario: Rejouer le grand défi relevé le fait rejouer en entier, sans nouvelle annonce de grand défi relevé
      Étant donné que Léa a réussi les 10 premières leçons de maths du CE1
      Et que Léa a relevé le grand défi des maths
      Et que Léa a choisi « Rejouer le défi » sur le repère « Grand défi » de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa entend l'effet sonore « séance terminée », puis Noisette dit « Bravo Léa ! Tu as encore relevé le grand défi des maths ! »
      Mais la fin du défi n'annonce pas « Grand défi relevé ! »

    Scénario: Après un grand défi relevé avec une erreur, l'accueil du lendemain propose la séance de révision
      Étant donné que Léa a réussi les 10 premières leçons de maths du CE1
      Et que Léa a relevé le grand défi des maths, en se trompant à sa première question
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa propose la séance de révision, avec « 1 petite erreur des jours passés »

    # Décision #137.6 (place du grand défi dans « Mes défis relevés »).
    Scénario: « Mes défis relevés » montre le grand défi après les défis de la même matière et de la même classe, une seule fois
      Étant donné que Léa a relevé le défi 1 de maths
      Et que Léa a relevé deux fois le grand défi des maths
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la section « Mes défis relevés » montre, dans cet ordre, « Défi 1 · Maths · CE1 » et « Grand défi · Maths · CE1 », chacun une seule fois

  Règle: Les lecteurs d'écran lisent le grand défi après la dernière leçon de la matière ; son repère tient sur un écran de 360 px

    Scénario: Les lecteurs d'écran lisent le grand défi dans la liste ordonnée, juste après la dernière leçon de la matière
      Étant donné que Léa a réussi les 4 premières leçons de maths du CE1
      Quand Léa choisit « Maths » dans son parcours
      Alors les lecteurs d'écran annoncent, après « Maths 10 : à découvrir », la ligne « Grand défi : à venir, encore 6 leçons pour ouvrir le défi »

    Scénario: À 360 px, le repère du grand défi tient dans la largeur et est assez grand pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a réussi les 10 premières leçons de maths du CE1
      Quand Léa choisit « Maths » dans son parcours
      Alors la page tient dans la largeur de l'écran
      Et le repère « Grand défi » mesure au moins 44 px de haut

  Règle: Le grand défi relevé est enregistré par le serveur et se lit seulement par un parent rattaché au profil enfant

    @acces
    Scénario: Sur le téléphone du second parent rattaché, l'enfant retrouve son grand défi relevé
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a réussi les 10 premières leçons de maths du CE1
      Et que Léa a relevé le grand défi des maths sur la tablette
      Quand Léa ouvre le parcours de maths sur le téléphone de Marie
      Alors le dessin du parcours montre le repère « Grand défi » relevé, avec « Défi relevé » et « Rejouer le défi »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les grands défis relevés de Léa
      Étant donné que Léa a relevé le grand défi des maths
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les défis relevés du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa
