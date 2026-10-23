# language: fr
@issue-11 @wip
Fonctionnalité: Créer et modifier un profil enfant, et choisir qui joue
  En tant que parent
  Je veux créer le profil enfant de chacun de mes enfants, avec son prénom, son niveau et son univers
  Afin que chacun joue dans son univers, à son niveau, et que je retrouve sa progression sur tous mes appareils

  Règle: Le parent crée un profil enfant avec un prénom, un niveau et un univers, et le retrouve sur tous ses appareils

    Scénario: Paul crée le profil enfant de Léa
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » avec « CE1 · Danse »

    Scénario: Sans autre choix, un nouveau profil enfant est de niveau CP, dans l'univers « Animaux de la forêt »
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Tom" sans choisir de niveau ni d'univers
      Alors le profil enfant de Tom apparaît dans « Qui joue ? » avec « CP · Animaux de la forêt »

    Plan du Scénario: Le profil enfant peut être de niveau <niveau>
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Léa" de niveau <niveau> dans l'univers « Sports »
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » avec « <niveau> · Sports »

      Exemples:
        | niveau |
        | CP     |
        | CE1    |
        | CE2    |
        | CM1    |
        | CM2    |

    Scénario: Un profil enfant créé sur la tablette se retrouve sur le téléphone
      Étant donné que Paul est connecté sur la tablette et sur le téléphone
      Et que Paul a créé sur la tablette le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Quand Paul ouvre « Qui joue ? » sur le téléphone
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » avec « CE1 · Danse »

    Scénario: Le profil enfant ne demande que le prénom, le niveau et l'univers
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul commence la création d'un profil enfant
      Alors on lui demande le prénom, la classe et l'univers de l'enfant
      Mais jamais d'adresse e-mail, de mot de passe ni de date de naissance

    Scénario: Deux profils enfants du même parent peuvent avoir le même prénom
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Léa" de niveau CP dans l'univers « Police »
      Alors « Qui joue ? » montre deux profils enfants « Léa », l'un en « CE1 · Animaux de la forêt », l'autre en « CP · Police »

    Scénario: Il n'y a pas de nombre maximal de profils enfants
      Étant donné que Paul est rattaché à 10 profils enfants
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Inès" de niveau CM2 dans l'univers « Princesses et fées »
      Alors « Qui joue ? » montre 11 profils enfants, dont celui d'Inès avec « CM2 · Princesses et fées »

  Règle: Le prénom est obligatoire, sans les espaces autour, et il est coupé à 20 caractères

    Plan du Scénario: Le prénom « <prénom> » (<cas>) est accepté tel quel
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "<prénom>" de niveau CE2 dans l'univers « Pompiers »
      Alors le profil enfant de <prénom> apparaît dans « Qui joue ? » avec « CE2 · Pompiers »

      Exemples:
        | prénom               | cas                      |
        | Léa                  | prénom simple            |
        | A                    | 1 caractère              |
        | Marie-Anne-Charlotte | 20 caractères exactement |

    Scénario: Les espaces autour du prénom sont retirés
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "  Léa  " de niveau CE2 dans l'univers « Pompiers »
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » avec « CE2 · Pompiers »

    Scénario: Un prénom de plus de 20 caractères est coupé à 20 caractères
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Marie-Anne-Charlottes" de niveau CE2 dans l'univers « Pompiers »
      Alors le profil enfant de Marie-Anne-Charlotte apparaît dans « Qui joue ? » avec « CE2 · Pompiers »

    Scénario: Un prénom vide est refusé avec un message
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "" de niveau CE1 dans l'univers « Danse »
      Alors Paul est informé que le prénom de l'enfant est obligatoire
      Et aucun nouveau profil enfant n'apparaît dans « Qui joue ? »

    Scénario: Un prénom fait seulement d'espaces est refusé avec un message
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "    " de niveau CE1 dans l'univers « Danse »
      Alors Paul est informé que le prénom de l'enfant est obligatoire
      Et aucun nouveau profil enfant n'apparaît dans « Qui joue ? »

  Règle: Le parent rattaché modifie le prénom, le niveau ou l'univers d'un profil enfant

    Scénario: Paul fait passer Léa du CE1 au CE2
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul est dans l'espace parent
      Quand Paul change le niveau du profil enfant de Léa en CE2
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » avec « CE2 · Animaux de la forêt »

    Scénario: Après un changement d'univers, Léa joue avec le personnage guide de son nouvel univers
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul a changé l'univers du profil enfant de Léa en « Pompiers »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors elle voit Capitaine Sam dans le paysage de l'univers « Pompiers »

    Scénario: Paul corrige le prénom de Léa
      Étant donné que Paul est rattaché au profil enfant "Lea" de niveau CE1
      Et que Paul est dans l'espace parent
      Quand Paul change le prénom du profil enfant de Lea en "Léa"
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » avec « CE1 · Animaux de la forêt »
      Mais aucun profil enfant « Lea » n'apparaît dans « Qui joue ? »

    Scénario: Une modification faite sur la tablette se retrouve sur le téléphone
      Étant donné que Paul est connecté sur la tablette et sur le téléphone
      Et que Paul a changé sur la tablette le niveau du profil enfant de Léa en CE2
      Quand Paul ouvre « Qui joue ? » sur le téléphone
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » avec « CE2 · Animaux de la forêt »

    Scénario: Vider le prénom d'un profil enfant est refusé, et le prénom d'avant reste
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul est dans l'espace parent
      Quand Paul change le prénom du profil enfant de Léa en ""
      Alors Paul est informé que le prénom de l'enfant est obligatoire
      Et le profil enfant de Léa apparaît toujours dans « Qui joue ? » avec « CE1 · Animaux de la forêt »

  Règle: « Qui joue ? » montre les profils enfants du parent dans l'ordre de leur création, et l'enfant y choisit le sien pour jouer

    Scénario: Les profils enfants apparaissent dans l'ordre de leur création
      Étant donné que Paul a créé le profil enfant "Tom" de niveau CM1 dans l'univers « Sports »
      Et que Paul a créé ensuite le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Quand j'ouvre Savanturier
      Alors « Qui joue ? » montre, dans l'ordre, Coach Léo avec « Tom » et « CM1 · Sports », puis Lili avec « Léa » et « CE1 · Danse »
      Et propose ensuite d'ajouter un enfant

    Scénario: Léa choisit son profil enfant et son personnage guide la salue
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors elle voit Lili dans le paysage de l'univers « Danse »
      Et Lili dit « Bonjour Léa ! »
      Et l'en-tête affiche « Léa · CE1 »

    Scénario: Léa choisit son profil enfant même sans réseau
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Et que Savanturier a déjà été chargé une fois sur la tablette
      Et que le réseau est coupé
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors elle voit Lili dans le paysage de l'univers « Danse »
      Et l'en-tête affiche « Léa · CE1 »

    Scénario: À la réouverture de Savanturier, on repasse par « Qui joue ? »
      Étant donné que Léa a choisi son profil enfant dans « Qui joue ? »
      Et que Savanturier a été fermé sur la tablette
      Quand j'ouvre Savanturier
      Alors je vois « Qui joue ? » avec le profil enfant de Léa
      Et l'en-tête n'affiche aucun prénom ni aucun niveau

    Scénario: « Qui joue ? » tient dans un écran de 360 px, avec des choix assez grands pour un doigt d'enfant
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Paul a créé les profils enfants "Tom", "Léa" et "Inès"
      Quand j'ouvre Savanturier
      Alors chaque profil enfant de « Qui joue ? » mesure au moins 44 px de haut et de large
      Et la page tient dans la largeur de l'écran

  Règle: Créer et modifier un profil enfant passent par l'espace parent, choisir qui joue reste à la portée de l'enfant

    @acces
    Scénario: Ajouter un enfant depuis « Qui joue ? » demande le contrôle parental
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Et que « Qui joue ? » est affiché sur la tablette
      Quand Léa demande à ajouter un enfant
      Alors Léa voit une question du contrôle parental
      Et Léa ne peut pas créer de profil enfant sans y répondre juste

    @acces
    Scénario: En dehors de l'espace parent, la modification d'un profil enfant n'est pas proposée
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors la modification du profil enfant n'est pas proposée à Léa

    @acces
    Scénario: Choisir qui joue ne demande pas le contrôle parental
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors aucune question du contrôle parental n'est posée
      Et elle voit Lili dans le paysage de l'univers « Danse »

    Scénario: Sans profil enfant, Noisette invite Paul à créer le premier dans l'espace parent
      Étant donné qu'aucun parent n'utilise l'adresse "paul@exemple.test"
      Et que Paul a demandé un lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors il voit l'espace parent
      Et Noisette dit « Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. »

  Règle: Un parent ne voit et ne modifie que les profils enfants auxquels il est rattaché

    @acces
    Scénario: Le parent qui crée un profil enfant y est rattaché d'office
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul crée le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Alors Paul voit le profil enfant de Léa dans l'espace parent

    @acces
    Scénario: Claire ne voit jamais dans « Qui joue ? » les profils enfants de la famille de Paul
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Claire est rattachée au profil enfant "Tom" de niveau CM2
      Et que Claire est connectée sur la tablette
      Quand j'ouvre Savanturier
      Alors « Qui joue ? » montre seulement le profil enfant de Tom
      Mais jamais celui de Léa

    @acces
    Scénario: Dans l'espace parent, Claire ne voit pas le profil enfant de Léa
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Claire est connectée sur la tablette
      Quand Claire ouvre l'espace parent
      Alors Claire ne voit pas le profil enfant de Léa

    @acces
    Scénario: Claire ne peut pas modifier le profil enfant de Léa, auquel elle n'est pas rattachée
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Claire est connectée sur la tablette
      Quand Claire tente de changer le niveau du profil enfant de Léa en CM2
      Alors Claire est informée que ce profil enfant est introuvable
      Et Paul voit toujours le profil enfant de Léa avec « CE1 · Animaux de la forêt »

    @acces
    Scénario: Sans connexion, personne ne peut créer de profil enfant
      Étant donné que personne n'est connecté sur la tablette
      Quand quelqu'un tente de créer le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Alors la création est refusée
      Et je suis invité à me connecter avec mon adresse e-mail
