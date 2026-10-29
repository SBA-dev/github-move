# language: fr
@issue-100 @wip
Fonctionnalité: Défi de la partie du parcours
  En tant qu'enfant
  Je veux relever un défi qui mélange les questions des leçons que je viens de réussir
  Afin de me prouver que je suis devenu fort, sans rien risquer de perdre

  Contexte Apprentissage pour le défi, Motivation pour sa mise en scène (docs/stories/100/domain-model.md).
  Le défi ne donne aucune étoile, ne change aucun résultat de la leçon et ne bloque rien : une erreur suit les
  règles d'une séance (encouragement, aide, nouvelle chance, « Je ne sais pas »), sans vie ni temps limité, et la
  question ratée entre dans la file de révision. Cadrage validé par le PO le 2026-10-29 (réponses 100.1 à 100.28,
  docs/stories/100/acceptance.md). Le grand défi de la matière n'est pas dans cette story : il viendra avec #137.

  Mots employés dans ces scénarios (mots d'interface validés, 100.3, 100.16, 100.21 et 100.24) :
  - une partie du parcours : 5 leçons consécutives du parcours d'une matière et d'une classe ; un dernier bloc de
    1 ou 2 leçons rejoint le précédent (100.1 A) ;
  - « Défi 1 » : le défi de la première partie du parcours d'une matière ; chaque partie du parcours a son défi,
    sauf la dernière de la matière (une matière d'une seule partie du parcours n'en a donc aucun) ;
  - « le repère « Défi 1 » » : la place du défi sur le dessin du parcours, juste après la dernière leçon de sa
    partie du parcours ;
  - « à venir », « ouvert », « relevé » : l'état d'un défi ; un défi à venir n'a pas de cadenas et ne se touche pas ;
  - « la fin du défi » : l'écran qui suit la dernière question du défi.

  Pour ces scénarios, la bibliothèque servie au navigateur est remplacée par la bibliothèque de test du défi
  (identifiants préfixés « e2e-100- ») ; la vraie bibliothèque reste intacte :
  - maths du CE1 : 10 leçons, « Maths 1 » (ordre 10) à « Maths 10 » (ordre 100) ; la leçon « Maths n » a un
    exercice bulles de 2 questions, « Combien font n + 1 ? » et « Combien font n + 2 ? », à 3 choix, sans aide ;
    « Maths 2 » a en plus une fluence de calcul ;
  - sciences du CE1 : « Les êtres vivants » (10), « Les saisons » (20), « L'eau » (30), chacune un exercice bulles
    de 2 questions à 3 choix, sans aide (par exemple « Quelle saison vient après l'hiver ? ») ;
  - aucune autre leçon.
  Les maths du CE1 ont deux parties du parcours (« Maths 1 » à « Maths 5 », puis « Maths 6 » à « Maths 10 ») et
  donc un seul défi, le défi 1 ; les sciences du CE1 ont une seule partie du parcours et aucun défi.
  Paul et Marie sont les deux parents rattachés au profil enfant de Léa ; Tom est un autre enfant de Paul ;
  Claire n'est rattachée à aucun d'eux.

  Contexte:
    Étant donné que Paul est connecté sur la tablette
    Et que Léa a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »
    Et que la bibliothèque de test du défi est servie

  Règle: Chaque partie du parcours, sauf la dernière de sa matière, a un défi ; il s'ouvre quand toutes ses leçons sont réussies ; avant, il est à venir, visible et sans cadenas

    Plan du Scénario: Avec <réussies> leçon(s) réussie(s) sur 5, le défi 1 est à venir
      Étant donné que Léa a réussi les <réussies> premières leçons de maths du CE1
      Quand Léa choisit « Maths » dans son parcours
      Alors le dessin du parcours montre le repère « Défi 1 » à venir, après la leçon 5, avec « <reste> »
      Mais le repère « Défi 1 » n'a pas de cadenas et ne propose pas « Relever le défi »

      Exemples:
        | réussies | reste                                |
        | 0        | Encore 5 leçons pour ouvrir le défi  |
        | 4        | Encore 1 leçon pour ouvrir le défi   |

    Scénario: Des leçons réussies au test de départ comptent pour ouvrir le défi
      Étant donné que Léa a pour leçons réussies au test de départ :
        | leçon   |
        | Maths 1 |
        | Maths 2 |
        | Maths 3 |
        | Maths 4 |
      Et que Léa a pour meilleures étoiles :
        | leçon   | étoiles |
        | Maths 5 | 1       |
      Quand Léa choisit « Maths » dans son parcours
      Alors le dessin du parcours montre le repère « Défi 1 » ouvert, avec « Relever le défi »

    Scénario: La séance qui rend réussie la dernière leçon qui manquait ouvre le défi, et le personnage guide le propose sans le lancer
      Étant donné que Léa a réussi « Maths 1 », « Maths 2 », « Maths 4 » et « Maths 5 »
      Et que Léa joue la séance complète de la leçon « Maths 3 »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance annonce « Le défi 1 est ouvert ! »
      Et Noisette dit « Bravo Léa ! Tu as réussi toutes les leçons avant le défi 1. Tu veux le relever ? »
      Et la fin de la séance propose « Relever le défi » et « Leçon suivante »
      Mais aucun défi ne commence sans que Léa le choisisse

    Plan du Scénario: Une séance qui n'ouvre aucun défi n'annonce aucun défi (<cas>)
      Étant donné que Léa a réussi les <réussies> premières leçons de maths du CE1
      Et que Léa joue la séance complète de la leçon « <leçon> »
      Quand Léa réussit la dernière question de la séance
      Alors aucune annonce de défi ouvert n'apparaît à la fin de la séance

      Exemples:
        | cas                                                      | réussies | leçon    |
        | leçon rejouée alors que son défi est déjà ouvert         | 5        | Maths 3  |
        | dernière leçon de la dernière partie du parcours         | 9        | Maths 10 |

    Plan du Scénario: <cas> n'a pas de défi
      Étant donné que Léa a réussi les <réussies> premières leçons de <matière> du CE1
      Quand Léa choisit « <Matière> » dans son parcours
      Alors le dessin du parcours montre <repères>
      Mais aucun repère de défi n'apparaît après la leçon « <dernière> »

      Exemples:
        | cas                                              | réussies | matière  | Matière  | repères                                           | dernière |
        | La dernière partie du parcours des maths         | 10       | maths    | Maths    | un seul repère de défi, « Défi 1 », après la leçon 5 | Maths 10 |
        | Une matière d'une seule partie du parcours       | 3        | sciences | Sciences | aucun repère de défi                              | L'eau    |

  Règle: Le défi ne bloque rien et ne change aucune note : ni étoile, ni prochaine leçon ; il ne donne ni objet de la cabane, ni tenue, ni badge, ni épisode

    Scénario: Sans avoir fait le défi 1, l'enfant continue son parcours, et le personnage guide se tient sur la leçon 6
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Quand Léa choisit « Maths » dans son parcours
      Alors Noisette se tient sur la leçon 6 « Maths 6 », marquée « À toi ! »
      Et le dessin du parcours montre le repère « Défi 1 » ouvert, entre la leçon 5 et la leçon 6

    Scénario: Relever le défi ne change aucune étoile des leçons de la partie du parcours
      Étant donné que Léa a pour meilleures étoiles :
        | leçon   | étoiles |
        | Maths 1 | 3       |
        | Maths 2 | 1       |
        | Maths 3 | 2       |
        | Maths 4 | 1       |
        | Maths 5 | 1       |
      Et que Léa a relevé le défi 1 de maths, sans erreur
      Quand Léa choisit « Maths » dans son parcours
      Alors le dessin du parcours montre « Maths 2 » réussie avec 1 étoile
      Et le dessin du parcours montre « Maths 4 » réussie avec 1 étoile

    Scénario: La fin du défi ne montre aucune étoile et n'annonce ni objet de la cabane, ni tenue, ni badge, ni épisode
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors la fin du défi ne montre aucune étoile
      Et aucune annonce pour la cabane, de nouvelle tenue, de nouveau badge ni de nouvel épisode n'apparaît à la fin du défi
      Et la fin du défi ne propose pas « Lire l'épisode »

  Règle: Le défi pose 10 questions prises seulement dans les leçons de sa partie du parcours, parmi les questions qui se posent seules et sans temps limité, réparties à parts égales entre les leçons et mélangées

    Scénario: Le défi 1 pose 2 questions de chacune des leçons 1 à 5, mélangées, jamais d'une autre leçon ni d'une fluence
      Étant donné que Léa a réussi les 10 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa a eu 10 questions, 2 de chacune des leçons « Maths 1 » à « Maths 5 », sans suivre l'ordre des leçons
      Mais aucune question des leçons « Maths 6 » à « Maths 10 »
      Et aucun calcul en temps limité

  Règle: Pendant le défi, une erreur suit les règles d'une séance : encouragement, aide, nouvelle chance sans limite, sans vie, ni temps limité, ni compte des erreurs ; la question ratée entre dans la file de révision

    Scénario: Le défi commence par une parole du personnage guide, sans vie ni temps qui passe
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Quand Léa relève le défi 1 depuis son parcours
      Alors l'écran s'intitule « Défi 1 », avec « Maths »
      Et Noisette dit « Voici des questions de 5 leçons que tu connais. Prends ton temps, je suis avec toi ! »
      Et « Je ne sais pas » est proposé à Léa
      Mais l'écran ne montre ni vie, ni temps qui passe, ni nombre d'erreurs

    Scénario: Après une erreur pendant le défi, le personnage guide encourage, donne l'aide, et la même question reste posée
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa en est à la question « Combien font 2 + 1 ? » du défi 1 de maths
      Quand Léa répond « 4 » à la question « Combien font 2 + 1 ? »
      Alors Noisette dit un encouragement, suivi de « Essaie une autre bulle. »
      Et la question « Combien font 2 + 1 ? » reste posée

    Plan du Scénario: Après un défi relevé <déroulé>, l'accueil du lendemain <révision>
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a relevé le défi 1 de maths, <déroulé>
      Quand Léa revient à son accueil le lendemain
      Alors l'accueil de Léa <révision>

      Exemples:
        | déroulé                                                  | révision                                                                  |
        | en se trompant à « Combien font 2 + 1 ? »                | propose la séance de révision, avec « 1 petite erreur des jours passés »  |
        | en disant « Je ne sais pas » à « Combien font 2 + 1 ? »  | propose la séance de révision, avec « 1 petite erreur des jours passés »  |
        | sans erreur                                              | ne propose pas de séance de révision                                      |

  Règle: Un défi terminé est relevé, avec ou sans erreurs, et la fin du défi le fête ; on peut le quitter sans rien perdre et le rejouer sans nouvelle récompense ; les défis relevés se retrouvent dans « Mes médailles »

    Plan du Scénario: Un défi terminé <déroulé> est relevé, et sa fin le fête
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond au défi, <déroulé>
      Alors la fin du défi annonce « Défi relevé ! »
      Et Léa entend l'effet sonore « grande victoire », puis Noisette dit « Bravo Léa ! Tu as relevé le défi 1 ! »
      Et la fin du défi propose « Mon parcours » et « Accueil »
      Mais la fin du défi ne propose pas « Leçon suivante »

      Exemples:
        | déroulé                                        |
        | sans erreur                                    |
        | en se trompant une fois à chaque question      |

    Scénario: Un défi quitté en cours n'est pas relevé et reste ouvert, sans reproche
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a répondu juste à 6 questions du défi 1 de maths
      Quand Léa quitte le défi
      Alors Léa voit le dessin du parcours de maths
      Et le dessin du parcours montre le repère « Défi 1 » ouvert, avec « Relever le défi »
      Mais Noisette ne dit aucun reproche

    Scénario: Rejouer un défi relevé le fait rejouer en entier, sans nouvelle annonce de défi relevé
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a relevé le défi 1 de maths
      Et que Léa a commencé de nouveau le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors Léa entend l'effet sonore « séance terminée », puis Noisette dit « Bravo Léa ! Tu as encore relevé le défi 1 ! »
      Mais la fin du défi n'annonce pas « Défi relevé ! »

    Scénario: « Mes médailles » montre les défis relevés, chacun une seule fois, dans sa dernière section
      Étant donné que Léa a relevé deux fois le défi 1 de maths
      Quand Léa ouvre « Mes médailles » depuis son accueil
      Alors la section « Mes défis relevés » montre « Défi 1 · Maths · CE1 » une seule fois
      Et « Mes défis relevés » est la dernière section de « Mes médailles »

  Règle: Sur « Mon parcours », chaque défi a son repère, à venir, ouvert ou relevé ; les lecteurs d'écran le lisent dans la liste des leçons, à sa place

    Plan du Scénario: Le repère « Défi 1 » montre un défi <état>
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa <relevé>
      Quand Léa choisit « Maths » dans son parcours
      Alors le dessin du parcours montre le repère « Défi 1 » <état>, avec « <texte> »

      Exemples:
        | état    | relevé                             | texte            |
        | ouvert  | n'a pas encore relevé le défi 1    | Relever le défi  |
        | relevé  | a relevé le défi 1 de maths        | Défi relevé      |

    Scénario: Les lecteurs d'écran lisent le défi dans la liste ordonnée, juste après sa dernière leçon
      Étant donné que Léa a réussi les 4 premières leçons de maths du CE1
      Quand Léa choisit « Maths » dans son parcours
      Alors les lecteurs d'écran annoncent, après « Maths 5 : à toi ! », la ligne « Défi 1 : à venir, encore 1 leçon pour ouvrir le défi »
      Mais les lecteurs d'écran n'annoncent aucune ligne de défi après « Maths 10 : à découvrir »

  Règle: Le défi se joue sans réseau, sans mouvement quand l'appareil le demande, et sur un écran de 360 px

    Scénario: Sans réseau, le défi se joue jusqu'au bout et sa fin dit que la progression est gardée sur l'appareil
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Et que le réseau est coupé
      Quand Léa répond juste à toutes les questions du défi
      Alors la fin du défi annonce « Défi relevé ! »
      Et elle voit le message « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. »

    Scénario: Avec les mouvements réduits, la fin du défi garde son annonce, sans mouvement ni confettis
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a commencé le défi 1 de maths
      Quand Léa répond juste à toutes les questions du défi
      Alors la fin du défi annonce « Défi relevé ! », sans mouvement
      Et aucun confetti ne tombe

    Scénario: Une question du défi tient dans un écran de 360 px, « Je ne sais pas » compris
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Quand Léa relève le défi 1 depuis son parcours
      Alors la page tient dans la largeur de l'écran
      Et chaque choix mesure au moins 44 px de haut et de large
      Et « Je ne sais pas » mesure au moins 44 px de haut

    Scénario: À 360 px, le repère du défi tient dans la largeur et est assez grand pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Quand Léa choisit « Maths » dans son parcours
      Alors la page tient dans la largeur de l'écran
      Et le repère « Défi 1 » mesure au moins 44 px de haut

  Règle: Le défi relevé est enregistré par le serveur, après vérification, et seulement pour un parent rattaché au profil enfant ; il est compris dans les données du profil

    @acces
    Scénario: Sur le téléphone du second parent rattaché, l'enfant retrouve son défi relevé
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Léa a relevé le défi 1 de maths sur la tablette
      Quand Léa ouvre le parcours de maths sur le téléphone de Marie
      Alors le dessin du parcours montre le repère « Défi 1 » relevé, avec « Défi relevé »

    Plan du Scénario: Le serveur refuse un défi terminé incohérent, et le défi n'est pas relevé (<cas>)
      Étant donné que Léa a réussi les <réussies> premières leçons de maths du CE1
      Quand l'appareil envoie pour Léa un défi 1 de maths terminé <cas>
      Alors l'enregistrement est refusé
      Et sur le téléphone de Paul, le repère « Défi 1 » de Léa n'est pas relevé

      Exemples:
        | réussies | cas                                                   |
        | 4        | alors que « Maths 5 » n'est pas réussie               |
        | 10       | avec une question de « Maths 6 »                      |
        | 5        | dont une question ne finit pas par la bonne réponse   |

    @acces
    Scénario: Le défi relevé par un enfant ne se voit pas chez un autre enfant du même parent
      Étant donné que Tom a un profil enfant préparé de niveau CE1
      Et que Tom a réussi les 5 premières leçons de maths du CE1
      Et que Léa a relevé le défi 1 de maths
      Quand Tom choisit « Maths » dans son parcours
      Alors le dessin du parcours montre le repère « Défi 1 » ouvert, avec « Relever le défi »

    @acces
    Scénario: Un parent qui n'est pas rattaché ne lit pas les défis relevés de Léa
      Étant donné que Léa a relevé le défi 1 de maths
      Et que Claire est connectée sur le téléphone
      Quand Claire demande les défis relevés du profil enfant de Léa
      Alors Claire ne reçoit aucune donnée de Léa

    @acces
    Scénario: Un parent qui n'est pas rattaché ne peut pas enregistrer un défi terminé pour Léa
      Étant donné que Léa a réussi les 5 premières leçons de maths du CE1
      Et que Claire est connectée sur le téléphone
      Quand Claire envoie un défi 1 de maths terminé pour le profil enfant de Léa
      Alors l'enregistrement est refusé comme pour un profil introuvable
      Et sur le téléphone de Paul, le repère « Défi 1 » de Léa n'est pas relevé

    @depend-de-14
    Scénario: L'export du profil contient les défis relevés, sans les réponses données
      Étant donné que Léa a relevé le défi 1 de maths
      Et que Paul est dans l'espace parent
      Quand Paul exporte les données du profil enfant de Léa
      Alors le fichier téléchargé contient le défi 1 de maths du CE1, relevé, avec son jour
      Mais aucune des réponses données par Léa
