# language: fr
@issue-39
Fonctionnalité: Leçons personnelles créées à partir d'un texte
  En tant que parent
  Je veux coller un texte (liste de mots, liste de verbes, poésie, texte documentaire), vérifier la leçon préparée,
  puis l'enregistrer pour un de mes enfants
  Afin qu'il révise ce qu'il fait en classe

  Les leçons sont préparées par les générateurs locaux, sans IA et sans service externe. Les détails des générateurs
  (seuils de la forme du texte, groupe du verbe, « j' » devant un h, nombre de mots, de verbes, de vers ou de
  phrases gardés, points de suspension des titres, choix de la section et de la citation) sont couverts par les tests
  unitaires du domaine : ici, un exemple représentatif par forme du texte suffit.

  Les questions #39.1 à #39.21 sont tranchées par le PO (2026-10-25) : les recommandations sont retenues, sauf
  #39.13, le texte du parent est conservé avec la leçon personnelle. Les commentaires # #39.n renvoient aux
  décisions de docs/stories/39/acceptance.md.

  Paul est le parent de Léa (CE1) ; Hugo, quand il apparaît, est un autre enfant de Paul. Claire est le parent de Tom,
  d'une autre famille : elle n'est rattachée ni à Léa ni à Hugo. Paul et Claire se connectent par mot de passe du
  parent (#72). Les actions de Paul ou de Claire se font dans l'espace parent : l'étape y entre en répondant au
  contrôle parental. Sauf mention contraire, la classe proposée est celle de l'enfant choisi et aucune matière
  n'est choisie.

  Contexte:
    Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1

  Règle: La forme du texte du parent décide de la leçon préparée, montrée dans l'aperçu avant l'enregistrement

    # #39.4 (c)
    Scénario: Une liste de mots donne une dictée
      Quand Paul prépare une leçon pour Léa à partir du texte « chaton, maison, poisson, garçon »
      Alors l'aperçu de la leçon a pour titre « Dictée : chaton, maison, poisson… »
      Et l'aperçu de la leçon propose, et seulement eux, les exercices :
        | exercice | titre            |
        | Dictée   | J'écris les mots |

    Scénario: Une liste de verbes donne un classement par groupe du verbe et la conjugaison du premier verbe du 1er groupe
      Quand Paul prépare une leçon pour Léa à partir du texte « chanter, finir, prendre, manger »
      Alors l'aperçu de la leçon a pour titre « Les verbes : chanter, finir, prendre… »
      Et l'aperçu de la leçon propose, et seulement eux, les exercices :
        | exercice                | titre                        |
        | Ranger dans les maisons | Chaque verbe dans sa maison  |
        | Conjugaison             | Le verbe chanter             |

    Scénario: Quatre vers courts donnent une poésie à apprendre par cœur
      Quand Paul prépare une leçon pour Léa à partir de ce texte :
        """
        Le vent souffle sur la colline,
        La pluie danse sur le chemin,
        Le soleil dort dans la cuisine,
        Et la lune revient demain.
        """
      Alors l'aperçu de la leçon a pour titre « Poésie : Le vent souffle sur la colline »
      Et l'aperçu de la leçon propose un seul exercice, « Apprendre par cœur »

    # #39.5
    Scénario: Un texte documentaire donne un texte à trous et des phrases à remettre dans l'ordre
      Quand Paul prépare une leçon pour Léa à partir de ce texte :
        """
        Les abeilles vivent ensemble dans une ruche. La reine pond des milliers d'oeufs chaque printemps. Les ouvrières fabriquent le miel avec le nectar des fleurs. Elles protègent aussi la ruche contre les frelons.
        """
      Alors le titre de l'aperçu de la leçon commence par « Lecture : Les abeilles »
      Et l'aperçu de la leçon propose, et seulement eux, les exercices :
        | exercice              | titre             |
        | Texte à trous         | Les mots envolés  |
        | Remettre dans l'ordre | Dans l'ordre      |

    # #39.10 : EMC seulement si une section d'EMC couvre la classe (CE2 aujourd'hui)
    Plan du Scénario: Un texte sur le métier de pompier, sans matière choisie, en <classe>, donne une leçon de <matière>
      Quand Paul prépare une leçon pour Léa en classe <classe> à partir de ce texte :
        """
        Le pompier travaille à la caserne avec son équipe. Quand l'alarme sonne, il enfile sa tenue et monte dans le camion rouge. Il éteint les incendies et porte secours aux personnes blessées.
        """
      Alors l'aperçu de la leçon indique « <classe> · <matière> · préparée sans IA »

      Exemples:
        | classe | matière              |
        | CE2    | Vivre ensemble (EMC) |
        | CP     | Français             |

    # #39.2
    Scénario: L'aperçu montre la classe, la matière, la section du programme retenue et sa citation, sans citation à vérifier
      Quand Paul prépare une leçon pour Léa à partir du texte « chaton, maison, poisson, garçon »
      Alors l'aperçu de la leçon indique « CE1 · Français · préparée sans IA »
      Et l'aperçu de la leçon montre une section du programme de français qui couvre le CE1
      Et la citation de l'aperçu est recopiée mot pour mot de cette section du programme
      Mais l'aperçu de la leçon ne signale aucune citation à vérifier

  Règle: Un texte ou un choix qui ne permet pas de préparer une leçon est refusé avec un message, et rien n'est à enregistrer

    Plan du Scénario: Un texte de moins de 3 caractères est refusé
      Quand Paul prépare une leçon pour Léa à partir du texte « <texte> »
      Alors Paul est informé « Colle d'abord un texte. »
      Et aucune leçon préparée n'est proposée à l'enregistrement

      Exemples:
        | texte |
        |       |
        | ab    |

    # #39.14
    Scénario: Un texte de plus de 3000 caractères est refusé
      Quand Paul prépare une leçon pour Léa à partir d'un texte de 3001 caractères
      Alors Paul est informé « Ton texte est trop long : 3000 caractères au plus. »
      Et aucune leçon préparée n'est proposée à l'enregistrement

    # #39.17
    Scénario: Une seule phrase courte ne permet pas de préparer une leçon
      Quand Paul prépare une leçon pour Léa à partir du texte « Le chat dort. »
      Alors Paul est informé « Ce texte ne permet pas de préparer une leçon. »
      Et aucune leçon préparée n'est proposée à l'enregistrement

    # #39.10 : l'index n'a aucune section d'EMC au CE1
    Scénario: Une matière qui n'a aucune section du programme pour la classe choisie est refusée
      Quand Paul prépare une leçon pour Léa en matière « Vivre ensemble (EMC) » à partir du texte « chaton, maison, poisson, garçon »
      Alors Paul est informé « Aucune section du programme pour cette classe et cette matière. »
      Et aucune leçon préparée n'est proposée à l'enregistrement

  Règle: Le parent enregistre la leçon préparée pour un de ses enfants, la retrouve dans « Mes leçons » et ne peut que la supprimer, après confirmation

    # #39.1, #39.3, #39.20
    Scénario: Paul enregistre pour Léa la leçon préparée et la retrouve dans « Mes leçons »
      Étant donné que Paul a préparé une leçon pour Léa à partir du texte « chaton, maison, poisson, garçon »
      Quand Paul enregistre la leçon préparée
      Alors Paul est informé « La leçon apparaît maintenant dans « Toutes les leçons » de Léa, avec « Pour toi ». »
      Et « Mes leçons » montre, et seulement elles :
        | leçon                             | enfant | description              |
        | Dictée : chaton, maison, poisson… | Léa    | CE1 · Français · Dictée  |

    # #39.1
    Scénario: La classe proposée est celle de l'enfant pour qui Paul crée la leçon
      Étant donné que Paul est rattaché au profil enfant "Hugo" de niveau CM2
      Quand Paul choisit Hugo pour créer une leçon
      Alors la classe proposée est « CM2 »

    Scénario: Une leçon préparée mais pas enregistrée n'apparaît pas dans « Mes leçons »
      Étant donné que Paul a préparé une leçon pour Léa à partir du texte « chaton, maison, poisson, garçon »
      Quand Paul ouvre « Mes leçons »
      Alors Paul lit « Aucune leçon créée pour l'instant. Utilise l'onglet « Créer une leçon ». »

    # #39.13
    Scénario: Paul relit dans « Mes leçons » le texte qu'il a collé pour une leçon personnelle
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Paul ouvre « Mes leçons »
      Alors la carte de la leçon « Dictée : chaton, maison, poisson… » permet de relire le texte « chaton, maison, poisson, garçon »

    # #39.6
    Scénario: Une leçon personnelle enregistrée ne se modifie pas, elle se supprime seulement
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Paul ouvre « Mes leçons »
      Alors seule la suppression est proposée pour « Dictée : chaton, maison, poisson… »

    Scénario: La suppression d'une leçon personnelle demande une confirmation
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Paul demande la suppression de la leçon personnelle « Dictée : chaton, maison, poisson… »
      Alors Paul doit confirmer la suppression
      Et « Mes leçons » montre toujours « Dictée : chaton, maison, poisson… »

    Scénario: Une leçon personnelle supprimée disparaît de « Mes leçons » et des écrans de l'enfant
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Paul supprime la leçon personnelle « Dictée : chaton, maison, poisson… » et confirme la suppression
      Alors « Mes leçons » ne montre plus « Dictée : chaton, maison, poisson… »
      Et Léa ne trouve plus « Dictée : chaton, maison, poisson… » dans « Toutes les leçons »

  Règle: Chez l'enfant, la leçon personnelle est en tête de « Toutes les leçons », avec « Pour toi », hors du parcours, et se joue comme une autre leçon

    # #39.1, #39.3
    Scénario: Léa trouve sa leçon personnelle en tête de « Toutes les leçons », avec « Pour toi »
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors « Toutes les leçons » montre en premier « Dictée : chaton, maison, poisson… » avec « Pour toi », à découvrir

    # #39.3
    Scénario: Une leçon personnelle n'apparaît pas dans « Mon parcours »
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Léa ouvre le parcours de français
      Alors « Dictée : chaton, maison, poisson… » n'apparaît pas dans le parcours

    # #39.3
    # Mise à jour par #33 (décisions 33.12 et 33.20 ; « Toutes les leçons » : règle 3 de #29)
    Scénario: Après une leçon personnelle, aucune leçon suivante n'est proposée
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chanter, finir, prendre, manger »
      Et que Léa joue la séance complète de la leçon « Les verbes : chanter, finir, prendre… »
      Quand Léa réussit la dernière question de la séance
      Alors la fin de la séance propose « Accueil », « Rejouer », « Lire l'épisode » et « Toutes les leçons »
      Mais aucune leçon suivante n'est proposée

    # #39.12 (sans badge)
    Scénario: Les étoiles gagnées à une leçon personnelle se retrouvent sur un autre appareil du parent
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Et que Léa a gagné 2 étoiles à la leçon « Dictée : chaton, maison, poisson… » sur la tablette
      Et que Paul est connecté sur le téléphone
      Quand Léa ouvre la page de la leçon « Dictée : chaton, maison, poisson… » sur le téléphone
      Alors la page de la leçon montre 2 étoiles pour Léa

  Règle: Une leçon personnelle n'est visible que de son enfant et des parents rattachés à cet enfant ; seul un parent rattaché la crée ou la supprime

    # #39.1
    @acces
    Scénario: Hugo, l'autre enfant de Paul, ne voit pas la leçon personnelle de Léa
      Étant donné que Paul est rattaché au profil enfant "Hugo" de niveau CE1
      Et que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Hugo ouvre « Toutes les leçons » depuis son accueil
      Alors aucune leçon n'est montrée avec « Pour toi »

    # #39.13 : le texte du parent suit les droits de la leçon
    @acces
    Scénario: Claire ne voit pas dans « Mes leçons » la leçon personnelle de Léa ni le texte de Paul
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Et que Claire est rattachée au profil enfant "Tom" de niveau CE1
      Et que Claire est connectée sur la tablette
      Quand Claire ouvre « Mes leçons »
      Alors Claire lit « Aucune leçon créée pour l'instant. Utilise l'onglet « Créer une leçon ». »
      Mais « Mes leçons » ne montre pas le texte « chaton, maison, poisson, garçon »

    @acces
    Scénario: Tom, enfant d'une autre famille, ne voit pas la leçon personnelle de Léa
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Et que Claire est rattachée au profil enfant "Tom" de niveau CE1
      Et que Claire est connectée sur la tablette
      Quand Tom ouvre « Toutes les leçons » depuis son accueil
      Alors aucune leçon n'est montrée avec « Pour toi »

    @acces
    Scénario: Claire ne peut pas créer une leçon personnelle pour Léa, à laquelle elle n'est pas rattachée
      Étant donné que Claire est connectée sur la tablette
      Quand Claire tente de créer pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Alors la création est refusée comme pour un profil introuvable
      Et « Mes leçons » de Paul ne montre aucune leçon

    @acces
    Scénario: Claire ne peut pas supprimer la leçon personnelle de Léa
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Et que Claire est connectée sur la tablette
      Quand Claire tente de supprimer la leçon personnelle « Dictée : chaton, maison, poisson… » de Léa
      Alors la suppression est refusée comme pour une leçon introuvable
      Et « Mes leçons » de Paul montre toujours « Dictée : chaton, maison, poisson… »

    @acces
    Scénario: Sans connexion du parent, personne ne crée de leçon personnelle
      Étant donné que personne n'est connecté sur la tablette
      Quand un visiteur tente de créer pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Alors la création est refusée
      Et « Mes leçons » de Paul ne montre aucune leçon

  Règle: Créer une leçon et retrouver « Pour toi » se fait sur un petit écran, au lecteur d'écran ; sans réseau, l'aperçu se prépare mais la leçon ne s'enregistre pas

    Scénario: « Créer une leçon » et l'aperçu tiennent dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Quand Paul prépare une leçon pour Léa à partir du texte « chaton, maison, poisson, garçon »
      Alors la page tient dans la largeur de l'écran
      Et chaque champ et chaque bouton de « Créer une leçon » mesurent au moins 44 px de haut

    # #39.3
    Scénario: Un lecteur d'écran lit « Pour toi », le niveau, la matière et l'état d'une leçon personnelle
      Étant donné que Paul a créé pour Léa une leçon personnelle à partir du texte « chaton, maison, poisson, garçon »
      Quand Léa ouvre « Toutes les leçons » depuis son accueil
      Alors les lecteurs d'écran annoncent « Pour toi : Dictée : chaton, maison, poisson…, CE1, Français : à découvrir »

    Scénario: Sans réseau, l'aperçu de la leçon se prépare quand même
      Étant donné que le réseau est coupé
      Quand Paul prépare une leçon pour Léa à partir du texte « chaton, maison, poisson, garçon »
      Alors l'aperçu de la leçon a pour titre « Dictée : chaton, maison, poisson… »

    # #39.18 : pas de mise en attente
    Scénario: Sans réseau, la leçon préparée n'est pas enregistrée et Paul en est informé
      Étant donné que Paul a préparé une leçon pour Léa à partir du texte « chaton, maison, poisson, garçon »
      Et que le réseau est coupé
      Quand Paul enregistre la leçon préparée
      Alors Paul est informé « Pas de réseau : la leçon n'est pas enregistrée. Réessaie quand tu seras connecté. »
      Et l'aperçu de la leçon a pour titre « Dictée : chaton, maison, poisson… »
