# language: fr
@issue-8 @wip
Fonctionnalité: Installer Savanturier comme une application
  En tant que parent
  Je veux installer Savanturier sur l'écran d'accueil de la tablette ou du téléphone
  Afin que mon enfant l'ouvre comme une application, en plein écran

  Règle: Savanturier peut être installé sur l'écran d'accueil de l'appareil

    Scénario: Le navigateur propose d'installer Savanturier
      Étant donné que Paul ouvre Savanturier dans le navigateur de sa tablette
      Quand Savanturier a fini de se charger
      Alors le navigateur propose d'installer « Savanturier »
      Et l'application installée porte le nom et l'icône de Savanturier

    Scénario: Savanturier installé s'ouvre en plein écran
      Étant donné que Paul a installé Savanturier sur sa tablette
      Quand Léa ouvre Savanturier depuis l'écran d'accueil de la tablette
      Alors Savanturier s'affiche en plein écran, sans la barre du navigateur
      Et elle voit le nom de l'application

    @a-valider
    Scénario: L'application laisse au navigateur le soin de proposer l'installation
      Étant donné que Paul ouvre Savanturier dans le navigateur de sa tablette
      Quand Savanturier a fini de se charger
      Alors aucune invitation à installer n'apparaît dans l'application

  Règle: Après un premier chargement, Savanturier et la bibliothèque restent disponibles sans réseau

    Scénario: Savanturier s'ouvre sans réseau après un premier chargement
      Étant donné que Savanturier a déjà été chargé une fois sur la tablette
      Et que le réseau est coupé
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Et aucun message d'erreur du navigateur n'apparaît

    Scénario: La bibliothèque reste disponible sans réseau
      Étant donné que Savanturier a déjà été chargé une fois sur la tablette
      Et que le réseau est coupé
      Quand j'ouvre Savanturier
      Alors les leçons de la bibliothèque sont disponibles

    @acces @a-valider
    Scénario: Sans réseau, aucune donnée de la famille ne reste visible après la déconnexion
      Étant donné que Paul s'est déconnecté de Savanturier sur la tablette
      Et que le réseau est coupé
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Mais aucun profil enfant de la famille de Paul n'est visible

  Règle: Une nouvelle version s'applique sans faire perdre à l'enfant ce qu'il est en train de faire

    @a-valider
    Scénario: Une nouvelle version publiée n'interrompt pas l'enfant
      Étant donné que Léa est en train d'utiliser Savanturier
      Quand une nouvelle version de Savanturier est publiée
      Alors Léa reste là où elle en était, sans que l'écran se recharge

    @a-valider
    Scénario: Une nouvelle version s'applique au lancement suivant
      Étant donné que Savanturier a déjà été chargé une fois sur la tablette
      Et qu'une nouvelle version de Savanturier a été publiée depuis
      Quand Léa relance Savanturier
      Alors elle utilise la nouvelle version de Savanturier

    @a-valider
    Scénario: Avec le réseau, la bibliothèque la plus récente est utilisée
      Étant donné que Savanturier a déjà été chargé une fois sur la tablette
      Et que la bibliothèque a reçu une nouvelle leçon depuis
      Quand Léa relance Savanturier avec le réseau
      Alors la nouvelle leçon fait partie de la bibliothèque disponible

  Règle: Savanturier tient dans la largeur de l'écran, dès 360 px

    Plan du Scénario: Savanturier tient dans la largeur d'un écran de <largeur> px
      Étant donné que l'écran de l'appareil mesure <largeur> px de large
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Et la page tient dans la largeur de l'écran

      Exemples:
        | largeur | appareil   |
        | 360     | téléphone  |
        | 820     | tablette   |
        | 1280    | ordinateur |

    Scénario: Savanturier installé tient dans la largeur d'un téléphone
      Étant donné que Paul a installé Savanturier sur un téléphone de 360 px de large
      Quand Léa ouvre Savanturier depuis l'écran d'accueil du téléphone
      Alors Savanturier s'affiche en plein écran, sans la barre du navigateur
      Et la page tient dans la largeur de l'écran
