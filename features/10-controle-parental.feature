# language: fr
@issue-10 @wip
Fonctionnalité: Contrôle parental de l'espace parent
  En tant que parent
  Je veux que l'espace parent soit protégé par une question que seul un adulte sait résoudre
  Afin que mon enfant ne change pas les réglages ni ne supprime un profil par erreur

  Règle: L'espace parent ne s'ouvre qu'après une bonne réponse à la question du contrôle parental

    Plan du Scénario: Paul entre dans l'espace parent en répondant « <reponse> » à « <question> » (<cas>)
      Étant donné que Paul est connecté sur la tablette
      Et que le contrôle parental pose la question « <question> »
      Quand Paul répond « <reponse> » au contrôle parental
      Alors il voit l'espace parent

      Exemples:
        | question | reponse  | cas                              |
        | 7 × 8    | 56       | cas courant                      |
        | 6 × 6    | 36       | les deux plus petits facteurs    |
        | 9 × 9    | 81       | les deux plus grands facteurs    |
        | 6 × 9    | 54       | un facteur à chaque borne        |

    Scénario: Les espaces autour de la réponse sont ignorés
      Étant donné que Paul est connecté sur la tablette
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 56 » entouré d'espaces au contrôle parental
      Alors il voit l'espace parent

    @acces
    Scénario: Sans bonne réponse, l'enfant qui joue ne voit pas l'espace parent
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CE1
      Et que Léa joue
      Quand Léa demande l'entrée de l'espace parent
      Alors Léa voit une question du contrôle parental
      Mais elle ne voit pas l'espace parent
      Et la déconnexion n'est pas proposée à Léa

    @acces
    Scénario: Léa renonce à la question du contrôle parental et retrouve son jeu
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CE1
      Et que Léa joue
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Léa renonce à répondre au contrôle parental
      Alors Léa revient là où elle jouait
      Mais elle ne voit pas l'espace parent

    Scénario: Le contrôle parental fonctionne sans réseau
      Étant donné que Paul est connecté sur la tablette
      Et que le réseau est coupé
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 56 » au contrôle parental
      Alors il voit l'espace parent

    @a-valider
    Scénario: Juste après la connexion du parent, l'espace parent s'ouvre sans question du contrôle parental
      Étant donné que Paul a demandé un lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors il voit l'espace parent
      Et aucune question du contrôle parental ne lui est posée

  Règle: Une mauvaise réponse n'est jamais punitive : un message, puis une nouvelle chance

    Plan du Scénario: La réponse « <reponse> » à « 7 × 8 » est refusée sans blocage (<cas>)
      Étant donné que Paul est connecté sur la tablette
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « <reponse> » au contrôle parental
      Alors Paul est informé que ce n'est pas la bonne réponse
      Et il ne voit pas l'espace parent
      Et il peut répondre de nouveau au contrôle parental

      Exemples:
        | reponse       | cas                  |
        | 54            | un autre nombre      |
        | 15            | la somme, pas le produit |
        |               | réponse vide         |
        | cinquante-six | pas un nombre        |

    Scénario: Après une mauvaise réponse, la bonne réponse ouvre l'espace parent
      Étant donné que Paul est connecté sur la tablette
      Et que Paul a répondu « 54 » à la question « 7 × 8 » du contrôle parental
      Quand Paul répond « 56 » au contrôle parental
      Alors il voit l'espace parent

    @a-valider
    Scénario: Après une mauvaise réponse, la même question est reposée
      Étant donné que Paul est connecté sur la tablette
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 54 » au contrôle parental
      Alors Paul est informé que ce n'est pas la bonne réponse
      Et Paul voit de nouveau la question du contrôle parental « 7 × 8 »

    @a-valider
    Scénario: Le nombre d'essais n'est pas limité
      Étant donné que Paul est connecté sur la tablette
      Et que Paul a répondu 5 fois de suite une mauvaise réponse à la question « 7 × 8 » du contrôle parental
      Quand Paul répond « 56 » au contrôle parental
      Alors il voit l'espace parent

  Règle: Chaque entrée dans l'espace parent pose une nouvelle question, qui multiplie deux nombres entre 6 et 9

    Scénario: La question du contrôle parental multiplie deux nombres entre 6 et 9
      Étant donné que Paul est connecté sur la tablette
      Quand Paul demande l'entrée de l'espace parent
      Alors Paul voit une question du contrôle parental qui multiplie deux nombres entre 6 et 9
      Mais il ne voit pas l'espace parent

    Scénario: Une nouvelle entrée pose une nouvelle question
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est entré dans l'espace parent en répondant à « 7 × 8 », puis l'a quitté
      Et que la prochaine question du contrôle parental tirée est « 6 × 9 »
      Quand Paul demande l'entrée de l'espace parent
      Alors Paul voit la question du contrôle parental « 6 × 9 »

  Règle: Quitter l'espace parent le ferme : pour y revenir, il faut répondre de nouveau

    @acces
    Scénario: Après avoir quitté l'espace parent, y revenir demande une nouvelle réponse
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CE1
      Et que Paul est entré dans l'espace parent en répondant à « 7 × 8 », puis l'a quitté
      Quand Léa demande l'entrée de l'espace parent
      Alors Léa voit une question du contrôle parental
      Mais elle ne voit pas l'espace parent

    @a-valider
    Scénario: En quittant l'espace parent, Paul arrive sur « Qui joue ? »
      Étant donné que Paul est connecté sur la tablette
      Et que Léa jouait avant que Paul entre dans l'espace parent
      Quand Paul quitte l'espace parent
      Alors il voit « Qui joue ? »
      Et l'en-tête n'affiche aucun prénom ni aucun niveau

    @a-valider @acces
    Scénario: Savanturier fermé puis rouvert ne rouvre pas l'espace parent
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Et que Savanturier a été fermé sur la tablette
      Quand j'ouvre Savanturier
      Alors je ne vois pas l'espace parent
      Et Paul est toujours connecté sur la tablette

  Règle: L'espace parent ouvert s'appelle « Espace parent » et donne accès à la déconnexion

    Scénario: L'espace parent ouvert s'appelle « Espace parent » et propose la déconnexion
      Étant donné que Paul est connecté sur la tablette
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 56 » au contrôle parental
      Alors il voit l'espace parent, intitulé « Espace parent »
      Et la déconnexion lui est proposée
      Mais jamais un « Espace adulte »

    @a-valider
    Scénario: L'espace parent s'ouvre sur les profils enfants de la famille
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est rattaché au profil enfant de Léa
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 56 » au contrôle parental
      Alors il voit les profils enfants de sa famille dans l'espace parent

    @acces
    Scénario: Une bonne réponse au contrôle parental ne montre jamais les profils enfants d'une autre famille
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Claire est connectée sur la tablette
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Claire répond « 56 » au contrôle parental
      Alors elle voit l'espace parent
      Mais Claire ne voit pas le profil enfant de Léa

  Règle: Le contrôle parental s'utilise sur tablette, au clavier et sur un petit écran

    Scénario: Sur tablette, la réponse se saisit avec le pavé numérique
      Étant donné que Paul est connecté sur la tablette
      Quand Paul demande l'entrée de l'espace parent
      Alors la réponse au contrôle parental se saisit avec le pavé numérique de la tablette

    Scénario: Au clavier, Paul répond et entre sans souris
      Étant donné que Paul est connecté sur un ordinateur, au clavier
      Et que le contrôle parental pose la question « 7 × 8 »
      Quand Paul répond « 56 » au contrôle parental, au clavier seulement
      Alors il voit l'espace parent

    Scénario: La question du contrôle parental tient dans un écran de 360 px de large
      Étant donné que Paul est connecté sur la tablette
      Et que l'écran de l'appareil mesure 360 px de large
      Quand Paul demande l'entrée de l'espace parent
      Alors Paul voit une question du contrôle parental qui multiplie deux nombres entre 6 et 9
      Et la page tient dans la largeur de l'écran
