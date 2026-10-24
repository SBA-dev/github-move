# language: fr
@issue-58 @wip
Fonctionnalité: Retirer la page de démonstration
  En tant que parent
  Je veux que l'application ne contienne que des écrans réels
  Afin que mon enfant ne tombe jamais sur une page de test et que les tests vérifient ce qu'il vit vraiment

  La page de démonstration, réservée aux tests du lot 1, disparaît. Ce qu'elle permettait de vérifier l'est désormais
  sur des écrans réels : une vraie séance (page de la leçon, consigne et question d'un exercice), l'accueil de
  l'enfant et « Qui joue ? ». Ces scénarios restent dans les fonctionnalités d'origine (#6, #7, #12, #15), avec le
  tag de cette story ; la version publiée est vérifiée par #8. La correspondance ancien → nouveau scénario est dans
  docs/stories/58/acceptance.md.

  Règle: L'ancienne adresse de la page de démonstration mène à l'accueil, comme toute adresse inconnue

    Scénario: Sans connexion, l'ancienne adresse de la page de démonstration invite le parent à se connecter
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier à l'adresse « /demonstration »
      Alors je suis invité à me connecter avec mon adresse e-mail
      Mais je ne vois aucune page de démonstration
      Et aucun message d'erreur n'apparaît

    Scénario: Avec un parent connecté, l'ancienne adresse de la page de démonstration montre « Qui joue ? »
      Étant donné que Paul est connecté sur la tablette
      Quand Paul ouvre Savanturier à l'adresse « /demonstration »
      Alors il voit « Qui joue ? »
      Mais il ne voit aucune page de démonstration

    Scénario: Un enfant en train de jouer qui ouvre l'ancienne adresse ne voit aucune page de test
      Étant donné que Léa a un profil enfant préparé de niveau CE1
      Et que Léa joue
      Quand Léa ouvre Savanturier à l'adresse « /demonstration »
      Alors elle ne voit aucune page de démonstration
      Et aucun message d'erreur n'apparaît
