# language: fr
@issue-8
Fonctionnalité: Installer Savanturier comme une application
  En tant que parent
  Je veux installer Savanturier sur l'écran d'accueil de la tablette ou du téléphone
  Afin que mon enfant l'ouvre comme une application, en plein écran

  Règle: Savanturier peut être installé sur l'écran d'accueil de l'appareil

    Scénario: Le navigateur propose d'installer Savanturier
      Étant donné que Paul ouvre Savanturier dans le navigateur de sa tablette Android
      Quand Savanturier a fini de se charger
      Alors le navigateur propose d'installer « Savanturier »
      Et l'application installée porte le nom et l'icône de Savanturier

    Scénario: Savanturier installé s'ouvre en plein écran
      Étant donné que Paul a installé Savanturier sur sa tablette
      Quand Léa ouvre Savanturier depuis l'écran d'accueil de la tablette
      Alors Savanturier s'affiche en plein écran, sans la barre du navigateur
      Et elle voit le nom de l'application

    Scénario: L'application laisse au navigateur le soin de proposer l'installation
      Étant donné que Paul ouvre Savanturier dans le navigateur de sa tablette Android
      Quand Savanturier a fini de se charger
      Alors aucune invitation à installer n'apparaît dans l'application

  Règle: Sur iPad et iPhone, une aide explique comment ajouter Savanturier à l'écran d'accueil

    Scénario: Sur iPad, Paul trouve comment ajouter Savanturier à l'écran d'accueil
      Étant donné que Paul ouvre Savanturier dans Safari sur son iPad
      Quand Savanturier a fini de se charger
      Alors Paul voit comment ajouter Savanturier à l'écran d'accueil de son iPad

    Scénario: Une fois Savanturier ajouté à l'écran d'accueil de l'iPad, l'aide n'apparaît plus
      Étant donné que Paul a ajouté Savanturier à l'écran d'accueil de son iPad
      Quand Léa ouvre Savanturier depuis l'écran d'accueil de l'iPad
      Alors aucune aide pour ajouter Savanturier à l'écran d'accueil n'apparaît

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

    @acces
    Scénario: Sans réseau, aucune donnée de la famille ne reste visible après la déconnexion
      Étant donné que Paul s'est déconnecté de Savanturier sur la tablette
      Et que le réseau est coupé
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Mais aucun profil enfant de la famille de Paul n'est visible

  Règle: Une nouvelle version s'applique au lancement suivant, sans jamais recharger un écran en cours d'utilisation

    Scénario: Une nouvelle version publiée n'interrompt pas l'enfant
      Étant donné que Léa est en train d'utiliser Savanturier
      Quand une nouvelle version de Savanturier est publiée
      Alors Léa reste là où elle en était, sans que l'écran se recharge

    Scénario: Une nouvelle version s'applique au lancement suivant
      Étant donné que Savanturier a déjà été chargé une fois sur la tablette
      Et qu'une nouvelle version de Savanturier a été publiée depuis
      Quand Léa relance Savanturier
      Alors elle utilise la nouvelle version de Savanturier

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

  Règle: La version publiée ne contient que des écrans réels, sans aucune page ni porte de test

    @issue-58
    Scénario: Dans la version publiée, l'ancienne adresse de la page de démonstration mène à l'accueil
      Quand j'ouvre Savanturier à l'adresse « /demonstration »
      Alors je vois le nom de l'application
      Mais je ne vois aucune page de démonstration
      Et aucun message d'erreur n'apparaît

    @issue-58
    Scénario: Dans la version publiée, un profil enfant préparé pour les tests ne fait jouer personne
      Étant donné que Léa a un profil enfant préparé de niveau CE1
      Quand Léa commence à jouer
      Alors je vois le nom de l'application
      Mais l'en-tête n'affiche aucun prénom ni aucun niveau
