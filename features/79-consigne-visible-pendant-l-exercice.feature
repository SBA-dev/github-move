# language: fr
@issue-79
Fonctionnalité: La consigne d'un exercice reste visible pendant tout l'exercice
  En tant qu'enfant
  Je veux voir la consigne de l'exercice tant que je le fais
  Afin de savoir ce qu'on me demande, même si je n'ai pas entendu la voix

  Correction dans une vraie séance (#16, #17, #18). Leçons de la bibliothèque utilisées : « Les sons ou, on, an »
  (fr-cp-sons-ou-on-an : exercice bulles « Quel son entends-tu ? », sans consigne, et exercice classer
  « Les maisons des sons », consigne « Range chaque mot dans la maison de son son. ») et « Les syllabes »
  (fr-cp-syllabes : exercices ordre « Le mot en morceaux », consigne « Remets les syllabes dans l'ordre pour écrire
  « domino ». », puis « Encore un mot », consigne « Remets les syllabes dans l'ordre pour écrire « caramel ». »).
  La question de test « Combien font 3 + 4 ? » a quatre choix « 6 », « 7 », « 8 » et « 9 », de réponse « 7 » :
  elle est seule dans sa séance. Les leçons de test sont décrites dans les scénarios.

  Les scénarios de #7 réécrits par #58 sur la question de test restent vrais sans changer un mot (non-régression,
  voir docs/stories/79/acceptance.md), sauf « Le message de voix bloquée n'apparaît qu'une fois », que l'équipe
  réécrit pour vérifier un seul message (décision 79.5).

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: La consigne est visible dès le début de l'exercice, qu'elle ait été lue ou non

    Plan du Scénario: Quand <situation>, la consigne d'un exercice classer est visible dès le début
      Étant donné que <situation>
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa voit la consigne « Range chaque mot dans la maison de son son. »
      Et Léa voit les maisons « ou », « on » et « an », et 9 étiquettes à poser

      Exemples:
        | situation                                    |
        | la tablette est en Muet                      |
        | le navigateur bloque la voix                 |
        | le navigateur ne sait pas lire à voix haute  |

    Scénario: En Muet, la consigne d'un exercice ordre est visible dès le début
      Étant donné que la tablette est en Muet
      Et que Léa est sur la page de la leçon « Les syllabes »
      Quand Léa choisit seulement l'exercice « Le mot en morceaux »
      Alors Léa voit la consigne « Remets les syllabes dans l'ordre pour écrire « domino ». »
      Mais Léa n'entend rien

    Scénario: En Muet, la consigne d'un exercice bulles est visible avec la question
      Étant donné que la tablette est en Muet
      Et qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa est sur la page de la leçon « Compter »
      Quand Léa commence la séance complète
      Alors Léa voit la consigne « Touche le bon nombre. »
      Et Léa voit la question « Combien font 2 + 1 ? »

    Plan du Scénario: En Muet, un exercice <type> sans consigne montre sa consigne par défaut
      Étant donné que la tablette est en Muet
      Et qu'une leçon de test a un exercice <type> sans consigne
      Quand Léa commence cet exercice
      Alors Léa voit la consigne « <consigne par défaut> »

      Exemples:
        | type    | consigne par défaut                               |
        | classer | Range chaque étiquette dans la bonne maison.      |
        | ordre   | Remets les étiquettes dans le bon ordre.          |
        | trous   | Complète le texte : choisis le mot qui manque.    |

    Scénario: Avec la voix, la consigne d'un exercice ordre reste visible après sa lecture
      Étant donné que Léa est sur la page de la leçon « Les syllabes »
      Quand Léa choisit seulement l'exercice « Le mot en morceaux »
      Alors Léa entend Noisette lire « Remets les syllabes dans l'ordre pour écrire « domino ». », puis « Touche d'abord celle qui vient en premier. »
      Et Léa voit la consigne « Remets les syllabes dans l'ordre pour écrire « domino ». »

    Scénario: Avec la voix, la consigne d'un exercice bulles reste visible quand la question est lue
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa est sur la page de la leçon « Compter »
      Quand Léa commence la séance complète
      Alors Léa entend Noisette lire « Touche le bon nombre. », puis « Combien font 2 plus 1 ? »
      Et Léa voit la consigne « Touche le bon nombre. »
      Et Léa voit la question « Combien font 2 + 1 ? »

  Règle: La consigne reste visible jusqu'à la fin de l'exercice, quoi que dise le personnage guide

    Scénario: En Muet, la consigne d'un exercice classer reste visible après une étiquette bien posée
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou »
      Alors l'étiquette « loup » reste dans la maison « ou »
      Et Léa voit la consigne « Range chaque mot dans la maison de son son. »

    Scénario: En Muet, la consigne d'un exercice ordre reste visible après une erreur
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Quand Léa pose l'étiquette « mi »
      Alors l'étiquette « mi » revient parmi les étiquettes à poser
      Et Léa voit la consigne « Remets les syllabes dans l'ordre pour écrire « domino ». »

    Scénario: Avec la voix, la consigne reste visible pendant l'encouragement du personnage guide
      Étant donné que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « on »
      Alors Noisette dit un encouragement, suivi de « « loup » n'habite pas dans la maison « on ». Essaie une autre maison. »
      Et Léa voit la consigne « Range chaque mot dans la maison de son son. »

    Scénario: Au début de l'exercice suivant, sa consigne remplace celle de l'exercice fini
      Étant donné que la tablette est en Muet
      Et que Léa joue la séance complète de la leçon « Les syllabes »
      Et que Léa en est à la dernière étiquette de l'exercice « Le mot en morceaux », « no »
      Quand Léa pose l'étiquette « no »
      Alors Léa voit la consigne « Remets les syllabes dans l'ordre pour écrire « caramel ». »
      Mais Léa ne voit plus la consigne « Remets les syllabes dans l'ordre pour écrire « domino ». »

    Scénario: À la fin de la séance, la consigne du dernier exercice n'est plus affichée
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Et qu'il ne reste que l'étiquette « dent » à poser
      Quand Léa pose l'étiquette « dent » dans la maison « an »
      Alors la séance est terminée
      Et Léa ne voit plus la consigne « Range chaque mot dans la maison de son son. »

  Règle: La consigne peut être relue à voix haute pendant tout l'exercice

    Scénario: L'enfant fait relire la consigne au milieu d'un exercice ordre
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé l'étiquette « do »
      Quand Léa demande à réécouter la consigne
      Alors Léa entend de nouveau Noisette lire « Remets les syllabes dans l'ordre pour écrire « domino ». »
      Et l'étiquette « do » reste à la première place

    Scénario: Dans un exercice bulles, relire la consigne laisse la question posée
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Quand Léa demande à réécouter la consigne
      Alors Léa entend de nouveau Noisette lire « Touche le bon nombre. »
      Et Léa voit la question « Combien font 2 + 1 ? »

    @a-valider
    Scénario: Dans un exercice bulles, relire la consigne pendant la lecture de la question suivante laisse ses choix venir
      Étant donné qu'une leçon de test « Compter » a un exercice bulles de consigne « Touche le bon nombre. » qui pose « Combien font 2 + 1 ? » puis « Combien font 1 + 1 ? »
      Et que Léa joue la séance complète de la leçon « Compter »
      Et que Léa a répondu « 3 »
      Quand Léa demande à réécouter la consigne pendant que Noisette lit la question « Combien font 1 + 1 ? »
      Alors Léa entend de nouveau Noisette lire « Touche le bon nombre. »
      Et Léa voit la question « Combien font 1 + 1 ? » avec ses choix

    Scénario: En Muet, demander à relire la consigne ne fait rien entendre et la consigne reste visible
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa demande à réécouter la consigne
      Alors Léa n'entend rien
      Et Léa voit la consigne « Range chaque mot dans la maison de son son. »

  Règle: Quand la voix est bloquée, le message qui le dit reste visible pendant la séance

    Scénario: Le message de voix bloquée est visible quand l'exercice commence
      Étant donné que le navigateur bloque la voix
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa voit le message « La voix de Noisette est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte. »
      Et Léa voit la consigne « Range chaque mot dans la maison de son son. »

    Scénario: Le message de voix bloquée reste visible après une réponse
      Étant donné que le navigateur bloque la voix
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Quand Léa pose l'étiquette « loup » dans la maison « ou »
      Alors Léa voit le message « La voix de Noisette est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte. »

    Scénario: Le message de voix bloquée n'est jamais affiché deux fois
      Étant donné que le navigateur bloque la voix
      Et que Léa a déjà vu le message de voix bloquée
      Quand la consigne suivante s'affiche
      Alors Léa voit un seul message de voix bloquée

    Scénario: Quand la voix revient, le message de voix bloquée disparaît
      Étant donné que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que la voix a été bloquée pendant la lecture de la question « Combien font 3 + 4 ? »
      Et que le navigateur ne bloque plus la voix
      Quand Léa demande à réécouter la question
      Alors Léa entend Noisette lire « Combien font 3 plus 4 ? »
      Et Léa ne voit plus le message de voix bloquée

  Règle: Sans voix, la félicitation est visible avant l'écran suivant, et celle de la dernière bonne réponse attend que l'enfant continue

    Plan du Scénario: Quand <situation>, la félicitation de la dernière étiquette d'un exercice ordre reste visible jusqu'à ce que Léa continue
      Étant donné que <situation>
      Et que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé les étiquettes « do » et « mi »
      Quand Léa pose l'étiquette « no »
      Alors Léa voit une félicitation de Noisette
      Et Léa peut continuer quand elle est prête
      Mais la fin de la séance ne s'affiche pas d'elle-même

      Exemples:
        | situation                                    |
        | la tablette est en Muet                      |
        | le navigateur bloque la voix                 |
        | le navigateur ne sait pas lire à voix haute  |

    Scénario: En Muet, la félicitation de la dernière étiquette d'un exercice classer reste visible jusqu'à ce que Léa continue
      Étant donné que la tablette est en Muet
      Et que Léa joue seulement l'exercice « Les maisons des sons » de la leçon « Les sons ou, on, an »
      Et qu'il ne reste que l'étiquette « dent » à poser
      Quand Léa pose l'étiquette « dent » dans la maison « an »
      Alors Léa voit une félicitation de Noisette
      Et Léa peut continuer quand elle est prête
      Mais la fin de la séance ne s'affiche pas d'elle-même

    Scénario: En Muet, la fin de la séance s'affiche quand Léa continue après la félicitation de la dernière question
      Étant donné que la tablette est en Muet
      Et que Léa joue la question de test « Combien font 3 + 4 ? »
      Et que Léa a répondu « 7 »
      Quand Léa continue
      Alors la séance est terminée

    Scénario: Avec la voix, la fin de la séance vient après la félicitation de la dernière étiquette, sans que Léa continue
      Étant donné que Léa joue seulement l'exercice « Le mot en morceaux » de la leçon « Les syllabes »
      Et que Léa a posé les étiquettes « do » et « mi »
      Quand Léa pose l'étiquette « no »
      Alors la séance est terminée
      Et Léa n'a pas eu à continuer

    Scénario: En Muet, la félicitation d'une question est visible, puis la question suivante vient d'elle-même
      Étant donné que la tablette est en Muet
      Et que Léa joue l'exercice « Quel son entends-tu ? » de la leçon « Les sons ou, on, an »
      Et que Léa en est à la question « Dans le mot « poule », quel son entends-tu ? »
      Quand Léa répond « ou »
      Alors Léa voit une félicitation de Noisette
      Et ensuite seulement, la question « Dans le mot « mouton », quel son entends-tu à la fin ? » s'affiche
      Et Léa n'a pas eu à continuer

    Scénario: En Muet, après la dernière étiquette d'un exercice qui n'est pas le dernier, l'exercice suivant vient de lui-même
      Étant donné que la tablette est en Muet
      Et que Léa joue la séance complète de la leçon « Les syllabes »
      Et que Léa en est à la dernière étiquette de l'exercice « Le mot en morceaux », « no »
      Quand Léa pose l'étiquette « no »
      Alors Léa voit une félicitation de Noisette
      Et ensuite seulement, Léa voit la consigne « Remets les syllabes dans l'ordre pour écrire « caramel ». »
      Et Léa n'a pas eu à continuer

  Règle: La consigne visible se lit en mode dys et tient sur un petit écran

    Scénario: Avec le mode dys, la consigne restée visible s'affiche en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que la tablette est en Muet
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors Léa voit la consigne « Range chaque mot dans la maison de son son. » en mode dys : police Andika, lettres, mots et lignes espacés

    Scénario: La consigne, les maisons et les étiquettes tiennent ensemble dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que la tablette est en Muet
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa choisit seulement l'exercice « Les maisons des sons »
      Alors la page tient dans la largeur de l'écran
      Et Léa voit la consigne « Range chaque mot dans la maison de son son. »

  Règle: Le texte d'une étape de leçon reste visible jusqu'à ce que l'enfant continue

    Scénario: En Muet, le texte de la première étape de leçon reste visible jusqu'à ce que Léa continue
      Étant donné que la tablette est en Muet
      Et que Léa est sur la page de la leçon « Les sons ou, on, an »
      Quand Léa commence la séance complète
      Alors Léa voit le texte de l'étape de leçon « Certains sons s'écrivent avec deux lettres. O et U ensemble font le son « ou », comme dans loup. »
      Et Léa peut continuer quand elle est prête
