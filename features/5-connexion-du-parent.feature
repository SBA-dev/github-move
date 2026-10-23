# language: fr
@issue-5 @wip
Fonctionnalité: Connexion du parent par lien de connexion
  En tant que parent
  Je veux me connecter avec un lien de connexion ou un code de connexion reçus par e-mail
  Afin de retrouver les profils de mes enfants et leur progression sur tous mes appareils, sans mot de passe à retenir

  Règle: Le parent se connecte en suivant le lien de connexion reçu à son adresse e-mail

    @envoi-email
    Scénario: Paul demande un lien de connexion et le reçoit par e-mail avec un code de connexion
      Étant donné que Paul n'est pas connecté sur la tablette
      Quand Paul demande un lien de connexion pour "paul@exemple.test"
      Alors Paul est informé qu'un lien de connexion a été envoyé à "paul@exemple.test"
      Et "paul@exemple.test" reçoit un e-mail contenant un lien de connexion et un code de connexion de 6 chiffres

    @envoi-email
    Scénario: Paul arrive dans l'espace parent en suivant le lien de connexion
      Étant donné que Paul a demandé un lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent

    @envoi-email
    Scénario: Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu
      Étant donné que Paul s'est déjà connecté avec "paul@exemple.test"
      Et que Paul a demandé un lien de connexion pour "  Paul@Exemple.TEST  " sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors Paul est connecté sur la tablette
      Et il est reconnu comme le parent "paul@exemple.test"

    @envoi-email
    Scénario: Une adresse jamais vue devient un nouveau parent dès son premier lien de connexion
      Étant donné qu'aucun parent n'utilise l'adresse "claire@exemple.test"
      Et que Claire a demandé un lien de connexion pour "claire@exemple.test" sur la tablette
      Quand Claire suit le lien de connexion reçu
      Alors Claire est connectée sur la tablette
      Et elle voit l'espace parent, sans aucun profil enfant

    Scénario: Sans connexion, Savanturier invite d'abord le parent à se connecter
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Et je suis invité à me connecter avec mon adresse e-mail

  Règle: Le parent peut aussi se connecter en saisissant le code de connexion sur l'appareil qui a fait la demande

    @envoi-email
    Scénario: Paul saisit sur la tablette le code de connexion reçu
      Étant donné que Paul a demandé un lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul saisit sur la tablette le code de connexion reçu
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent

    @a-valider @envoi-email
    Scénario: Un code de connexion faux est refusé
      Étant donné que Paul a demandé un lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul saisit sur la tablette un code de connexion qui n'est pas celui reçu
      Alors Paul est informé que ce code de connexion ne marche plus
      Et il n'est pas connecté
      Et il peut saisir à nouveau le code de connexion

    @envoi-email
    Plan du Scénario: Refuser le code de connexion « <code> », qui n'a pas 6 chiffres
      Étant donné que Paul a demandé un lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul saisit sur la tablette le code de connexion "<code>"
      Alors Paul est informé que le code de connexion doit avoir 6 chiffres
      Et il n'est pas connecté

      Exemples:
        | code    | cas                  |
        |         | vide                 |
        | 12345   | 5 chiffres           |
        | 1234567 | 7 chiffres           |
        | 12a456  | une lettre           |

  Règle: Une adresse e-mail mal formée est refusée avant tout envoi

    Plan du Scénario: Refuser l'adresse « <adresse> »
      Étant donné que Paul n'est pas connecté sur la tablette
      Quand Paul demande un lien de connexion pour "<adresse>"
      Alors Paul est informé que l'adresse e-mail n'est pas valide
      Et aucun e-mail n'est envoyé

      Exemples:
        | adresse                  | cas                   |
        |                          | vide                  |
        | paul                     | sans @                |
        | @exemple.test            | rien avant le @       |
        | paul@                    | pas de domaine        |
        | paul@exemple             | domaine sans point    |
        | paul@@exemple.test       | deux @                |
        | paul dupont@exemple.test | espace dans l'adresse |

    @envoi-email
    Scénario: Paul corrige son adresse après un refus
      Étant donné que l'adresse "paul@exemple" de Paul a été refusée
      Quand Paul demande un lien de connexion pour "paul@exemple.test"
      Alors Paul est informé qu'un lien de connexion a été envoyé à "paul@exemple.test"

  Règle: Un lien de connexion et un code de connexion valent une heure et servent une seule fois

    @envoi-email
    Scénario: Un lien de connexion déjà utilisé est refusé
      Étant donné que Paul s'est connecté avec le lien de connexion reçu, puis s'est déconnecté
      Quand Paul suit à nouveau ce lien de connexion
      Alors Paul est informé que ce lien de connexion ne marche plus
      Et il n'est pas connecté
      Et il peut demander un nouveau lien de connexion

    @envoi-email
    Scénario: Un lien de connexion expire au bout d'une heure
      Étant donné que Paul a demandé un lien de connexion il y a 61 minutes
      Quand Paul suit le lien de connexion reçu
      Alors Paul est informé que ce lien de connexion ne marche plus
      Et il n'est pas connecté
      Et il peut demander un nouveau lien de connexion

    @envoi-email
    Scénario: Un lien de connexion est encore valable juste avant la fin de sa durée
      Étant donné que Paul a demandé un lien de connexion il y a 59 minutes sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors Paul est connecté sur la tablette

    @a-valider @envoi-email
    Scénario: Un code de connexion expire au bout d'une heure
      Étant donné que Paul a demandé un lien de connexion il y a 61 minutes sur la tablette
      Quand Paul saisit sur la tablette le code de connexion reçu
      Alors Paul est informé que ce code de connexion ne marche plus
      Et il n'est pas connecté
      Et il peut demander un nouveau lien de connexion

    @envoi-email
    Scénario: Un code de connexion est encore valable juste avant la fin de sa durée
      Étant donné que Paul a demandé un lien de connexion il y a 59 minutes sur la tablette
      Quand Paul saisit sur la tablette le code de connexion reçu
      Alors Paul est connecté sur la tablette

    @envoi-email
    Scénario: Après un lien refusé, Paul se connecte avec un nouveau lien
      Étant donné que le lien de connexion de Paul a été refusé parce qu'il ne marche plus
      Et que Paul a demandé un nouveau lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul suit le nouveau lien de connexion reçu
      Alors Paul est connecté sur la tablette

  Règle: La connexion du parent reste ouverte sur l'appareil jusqu'à la déconnexion

    Scénario: La connexion reste ouverte après la fermeture et la réouverture de Savanturier
      Étant donné que Paul est connecté sur la tablette
      Et que Savanturier a été fermé sur la tablette
      Quand j'ouvre Savanturier
      Alors Paul est toujours connecté sur la tablette
      Et personne n'a d'adresse e-mail à ressaisir

    @envoi-email
    Scénario: Paul peut être connecté sur deux appareils à la fois
      Étant donné que Paul est connecté sur la tablette
      Et que Paul a demandé un lien de connexion pour "paul@exemple.test" sur le téléphone
      Quand Paul suit le lien de connexion reçu sur le téléphone
      Alors Paul est connecté sur le téléphone
      Et Paul est toujours connecté sur la tablette

  Règle: La déconnexion se fait depuis l'espace parent, et plus aucune donnée de la famille n'est visible ensuite sur l'appareil

    Scénario: Paul se déconnecte depuis l'espace parent
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est dans l'espace parent
      Quand Paul se déconnecte
      Alors Paul n'est plus connecté sur la tablette
      Et je suis invité à me connecter avec mon adresse e-mail

    @acces
    Scénario: En dehors de l'espace parent, la déconnexion n'est pas proposée
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant de niveau CE1
      Quand Léa commence à jouer
      Alors la déconnexion n'est pas proposée à Léa
      Et Paul est toujours connecté sur la tablette

    @acces
    Scénario: Après la déconnexion, la réouverture de Savanturier ne montre aucune donnée de la famille
      Étant donné que Paul s'est déconnecté de Savanturier sur la tablette
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Mais aucun profil enfant de la famille de Paul n'est visible

    @acces
    Scénario: Se déconnecter sur la tablette ne ferme pas la connexion du téléphone
      Étant donné que Paul est connecté sur la tablette et sur le téléphone
      Et que Paul est dans l'espace parent sur la tablette
      Quand Paul se déconnecte sur la tablette
      Alors Paul n'est plus connecté sur la tablette
      Mais Paul est toujours connecté sur le téléphone

  Règle: Seul un parent connecté accède aux données de sa famille

    @acces
    Scénario: Un visiteur non connecté ne voit aucune donnée de famille
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier
      Alors je ne vois aucun profil enfant
      Et je ne vois pas l'espace parent

    @acces
    Scénario: Un parent connecté ne voit jamais les profils enfants d'une autre famille
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Claire est connectée sur la tablette
      Quand Claire ouvre l'espace parent
      Alors Claire ne voit pas le profil enfant de Léa
