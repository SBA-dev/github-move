# language: fr
@issue-45
Fonctionnalité: Mise en ligne de Savanturier pour la beta
  En tant que parent
  Je veux ouvrir Savanturier à une adresse stable pendant toute la beta et l'installer sur mes appareils
  Afin que mes enfants l'utilisent tous les jours, avec des données gardées dans l'UE et sans aucun traceur

  Tous les scénarios de ce fichier relèvent de 45a (beta en ligne). Ce qui relève de 45b (après la beta :
  e-mails, réinitialisation par e-mail, lien de connexion rétabli, limites, expiration des enregistrements
  de lecture) n'a pas encore de scénario : voir docs/stories/45/acceptance.md.

  Trois lieux d'exécution (docs/stories/45/acceptance.md, « Où tournent les scénarios ») :
  - sans tag @production ni @pwa : exécutions courantes, contre savanturier-dev, données préparées par les tests ;
  - avec @pwa : sur le build de production (playwright.pwa.config.ts), car il faut le service worker ;
  - avec @production : seulement contre l'adresse de production, après une publication, avec le parent de
    test de la production (Paul) et son profil enfant au pseudo fictif « Pilote », de niveau CP, créés une
    fois à la main par le PO. Aucune préparation ni aucun nettoyage par les tests, jamais de clé service_role.
  L'adresse de production est l'adresse gratuite d'alwaysdata (décision 45.2, sans domaine acheté pendant la
  beta). Elle n'est jamais écrite dans les étapes : elle est lue dans l'environnement, comme les identifiants
  du parent de test. Les données sont sur le projet Supabase de production, offre Free, en Irlande (45.3, 45.4).
  Leçon de la bibliothèque utilisée : « Les sons ou, on, an » (fr-cp-sons-ou-on-an).

  Règle: À l'adresse de production, Savanturier s'ouvre en connexion sécurisée et s'installe comme une application

    @production
    Scénario: Savanturier s'ouvre à l'adresse de production, en connexion sécurisée
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier à l'adresse de production
      Alors je vois le nom de l'application
      Et la connexion avec Savanturier est sécurisée
      Et aucun message d'erreur du navigateur n'apparaît

    @production
    Scénario: L'adresse de production sans connexion sécurisée mène à la même adresse sécurisée
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier à l'adresse de production sans connexion sécurisée
      Alors je vois le nom de l'application
      Et la connexion avec Savanturier est sécurisée

    @production
    Scénario: À l'adresse de production, le navigateur propose d'installer Savanturier
      Étant donné que Paul ouvre Savanturier à l'adresse de production dans le navigateur de sa tablette Android
      Quand Savanturier a fini de se charger
      Alors le navigateur propose d'installer « Savanturier »
      Et l'application installée porte le nom et l'icône de Savanturier

    @production
    Scénario: Après un premier chargement à l'adresse de production, Savanturier s'ouvre sans réseau
      Étant donné que Savanturier a déjà été chargé une fois sur la tablette à l'adresse de production
      Et que le réseau est coupé
      Quand j'ouvre Savanturier à l'adresse de production
      Alors je vois le nom de l'application
      Et aucun message d'erreur du navigateur n'apparaît

    @production
    Scénario: À l'adresse de production, une adresse inconnue mène à Savanturier
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier à l'adresse de production « /une-page-qui-n-existe-pas »
      Alors je vois le nom de l'application
      Et aucun message d'erreur n'apparaît

  Règle: En se connectant et en jouant une séance, le navigateur ne contacte aucun autre site que Savanturier

    Scénario: La connexion du parent ne contacte aucun autre site que Savanturier
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que personne n'est connecté sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors il voit l'espace parent
      Et le navigateur n'a contacté aucun autre site que Savanturier

    Scénario: Une séance terminée ne contacte aucun autre site que Savanturier
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Léa joue la séance complète de la leçon « Les sons ou, on, an »
      Quand Léa réussit la dernière question de la séance
      Alors Léa voit ses étoiles
      Et le navigateur n'a contacté aucun autre site que Savanturier

    Scénario: Avec le mode dys, aucune police n'est chargée depuis un autre site
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors aucune police n'a été chargée depuis un autre site que Savanturier

    @production
    Scénario: À l'adresse de production, la connexion du parent ne contacte aucun autre site que Savanturier
      Étant donné que Paul est le parent de test de la production
      Et que personne n'est connecté sur la tablette
      Quand Paul se connecte à l'adresse de production avec son adresse e-mail et son mot de passe du parent
      Alors il voit l'espace parent
      Et le navigateur n'a contacté aucun autre site que Savanturier

    @production
    Scénario: À l'adresse de production, une séance terminée ne contacte aucun autre site que Savanturier
      Étant donné que Paul est le parent de test de la production
      Et que Pilote joue la séance complète de la leçon « Les sons ou, on, an » à l'adresse de production
      Quand Pilote réussit la dernière question de la séance
      Alors Pilote voit ses étoiles
      Et le navigateur n'a contacté aucun autre site que Savanturier

  Règle: Avec le mode dys, le texte s'affiche vraiment en police Andika, servie par Savanturier, même sans réseau

    Scénario: Avec le mode dys, l'étape de leçon s'affiche dans la police Andika chargée par Savanturier
      Étant donné que Paul est connecté sur la tablette
      Et que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
      Et que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors le texte de l'étape de leçon est écrit dans la police Andika, et non dans une police de remplacement

    @pwa
    Scénario: Sans réseau, le mode dys garde la police Andika
      Étant donné que Léa a déjà joué en mode dys sur la tablette
      Et que le réseau est coupé
      Quand Léa relance Savanturier
      Alors le texte de l'accueil de l'enfant est écrit dans la police Andika, et non dans une police de remplacement

  Règle: En production, un parent ne voit que les profils enfants auxquels il est rattaché, et personne ne voit rien sans connexion

    @acces @production
    Scénario: À l'adresse de production, sans connexion, aucun profil enfant n'est visible
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier à l'adresse de production
      Alors je suis invité à me connecter avec mon adresse e-mail
      Mais aucun profil enfant n'est visible

    @acces @production
    Scénario: À l'adresse de production, le parent de test ne voit que son propre profil enfant
      Étant donné que Paul est le parent de test de la production
      Quand Paul se connecte à l'adresse de production avec son adresse e-mail et son mot de passe du parent
      Alors « Qui joue ? » montre seulement le profil enfant « Pilote »
      Mais aucun profil enfant d'une autre famille n'est visible
