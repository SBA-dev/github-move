# language: fr
@issue-5 @wip
Fonctionnalité: Connexion du parent par lien de connexion
  En tant que parent
  Je veux me connecter avec un lien de connexion reçu par e-mail
  Afin de retrouver les profils de mes enfants et leur progression sur tous mes appareils, sans mot de passe à retenir

  Règle: Le parent se connecte en suivant le lien de connexion reçu à son adresse e-mail

    Scénario: Paul demande un lien de connexion et le reçoit par e-mail
      Étant donné que Paul n'est pas connecté sur la tablette
      Quand Paul demande un lien de connexion pour "paul@exemple.test"
      Alors Paul est informé qu'un lien de connexion a été envoyé à "paul@exemple.test"
      Et "paul@exemple.test" reçoit un e-mail contenant un lien de connexion

    Scénario: Paul arrive connecté en suivant le lien de connexion
      Étant donné que Paul a demandé un lien de connexion pour "paul@exemple.test" sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent

    Scénario: Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu
      Étant donné que Paul s'est déjà connecté avec "paul@exemple.test"
      Et que Paul a demandé un lien de connexion pour "  Paul@Exemple.TEST  " sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors Paul est connecté sur la tablette
      Et il est reconnu comme le parent "paul@exemple.test"

    @a-valider
    Scénario: Une adresse jamais vue devient un nouveau parent dès son premier lien de connexion
      Étant donné qu'aucun parent n'utilise l'adresse "claire@exemple.test"
      Et que Claire a demandé un lien de connexion pour "claire@exemple.test" sur la tablette
      Quand Claire suit le lien de connexion reçu
      Alors Claire est connectée sur la tablette
      Et elle voit l'espace parent, sans aucun profil enfant

    @a-valider
    Scénario: Sans connexion, Savanturier invite d'abord le parent à se connecter
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Et je suis invité à me connecter avec mon adresse e-mail

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

    Scénario: Paul corrige son adresse après un refus
      Étant donné que l'adresse "paul@exemple" de Paul a été refusée
      Quand Paul demande un lien de connexion pour "paul@exemple.test"
      Alors Paul est informé qu'un lien de connexion a été envoyé à "paul@exemple.test"

  Règle: Un lien de connexion sert une seule fois et expire

    Scénario: Un lien de connexion déjà utilisé est refusé
      Étant donné que Paul s'est connecté avec le lien de connexion reçu, puis s'est déconnecté
      Quand Paul suit à nouveau ce lien de connexion
      Alors Paul est informé que ce lien de connexion ne marche plus
      Et il n'est pas connecté
      Et il peut demander un nouveau lien de connexion

    @a-valider
    Scénario: Un lien de connexion expire au bout d'une heure
      Étant donné que Paul a demandé un lien de connexion il y a 61 minutes
      Quand Paul suit le lien de connexion reçu
      Alors Paul est informé que ce lien de connexion ne marche plus
      Et il n'est pas connecté
      Et il peut demander un nouveau lien de connexion

    @a-valider
    Scénario: Un lien de connexion est encore valable juste avant la fin de sa durée
      Étant donné que Paul a demandé un lien de connexion il y a 59 minutes sur la tablette
      Quand Paul suit le lien de connexion reçu
      Alors Paul est connecté sur la tablette

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

    @a-valider
    Scénario: Paul peut être connecté sur deux appareils à la fois
      Étant donné que Paul est connecté sur la tablette
      Et que Paul a demandé un lien de connexion pour "paul@exemple.test" sur le téléphone
      Quand Paul suit le lien de connexion reçu sur le téléphone
      Alors Paul est connecté sur le téléphone
      Et Paul est toujours connecté sur la tablette

  Règle: Après la déconnexion, plus aucune donnée de la famille n'est visible sur l'appareil

    Scénario: Paul se déconnecte
      Étant donné que Paul est connecté sur la tablette
      Quand Paul se déconnecte
      Alors Paul n'est plus connecté sur la tablette
      Et je suis invité à me connecter avec mon adresse e-mail

    @acces
    Scénario: Après la déconnexion, la réouverture de Savanturier ne montre aucune donnée de la famille
      Étant donné que Paul s'est déconnecté de Savanturier sur la tablette
      Quand j'ouvre Savanturier
      Alors je vois le nom de l'application
      Mais aucun profil enfant de la famille de Paul n'est visible

    @acces @a-valider
    Scénario: Se déconnecter sur la tablette ne ferme pas la connexion du téléphone
      Étant donné que Paul est connecté sur la tablette et sur le téléphone
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

    @acces @a-valider
    Scénario: Un parent connecté ne voit jamais les profils enfants d'une autre famille
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Claire est connectée sur la tablette
      Quand Claire ouvre l'espace parent
      Alors Claire ne voit pas le profil enfant de Léa

