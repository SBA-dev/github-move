# language: fr
@issue-23
Fonctionnalité: Aide et « Je ne sais pas »
  En tant qu'enfant
  Je veux être aidé quand je me trompe, et pouvoir dire « Je ne sais pas »
  Afin d'apprendre sans avoir peur de l'erreur

  Leçon de la bibliothèque utilisée : « Dictée : les animaux » (fr-cp-dictee-animaux), dont l'exercice bulles
  « Le mot bien écrit » pose « Quel mot est bien écrit ? » (choix « chat », « cha », « chas », réponse « chat »,
  aide « Pense à la lettre muette, comme dans chaton. »). Les questions de test sont décrites dans les scénarios.
  Les aides propres à chaque type d'exercice sont dans les stories #17 à #22.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »

  Règle: Après une erreur, le personnage guide encourage, lit l'aide, et l'enfant a une nouvelle chance

    Scénario: Après une erreur, le personnage guide encourage puis lit l'aide de la question
      Étant donné que Léa joue l'exercice « Le mot bien écrit » de la leçon « Dictée : les animaux »
      Et que Léa en est à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa répond « cha »
      Alors Noisette réfléchit en penchant la tête
      Et Noisette dit un encouragement, suivi de « Pense à la lettre muette, comme dans chaton. »
      Et la question « Quel mot est bien écrit ? » reste posée

    Scénario: Sans aide de la question, le personnage guide lit l'aide par défaut du type d'exercice
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa répond « 8 » à « Combien font 3 + 4 ? »
      Alors Noisette dit un encouragement, suivi de « Essaie une autre bulle. »

    @depend-de-20
    Scénario: La nouvelle chance n'a pas de limite
      Étant donné qu'une leçon de test de niveau CE1 a un exercice calcul « 12 − 5 », de résultat 7
      Et que Tom a répondu faux 5 fois de suite à « 12 − 5 »
      Quand Tom répond « 7 » à « 12 − 5 »
      Alors la question « 12 − 5 » est réussie

  Règle: « Je ne sais pas » montre la bonne réponse, et l'enfant la donne lui-même

    Scénario: Avec les choix, « Je ne sais pas » ne laisse que la bonne réponse, qui brille
      Étant donné que Léa joue l'exercice « Le mot bien écrit » de la leçon « Dictée : les animaux »
      Et que Léa en est à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « chat » reste, et il brille
      Et Noisette dit « Pas de souci, on apprend ensemble ! Pense à la lettre muette, comme dans chaton. La bonne réponse brille : touche-la. »

    Scénario: Sans aide, « Je ne sais pas » dit seulement que la bonne réponse brille
      Étant donné qu'une question de test bulles « Combien font 3 + 4 ? » n'a pas d'aide
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 7 » reste, et il brille
      Et Noisette dit « Pas de souci, on apprend ensemble ! La bonne réponse brille : touche-la. »

    Scénario: Après « Je ne sais pas », la question n'est réussie que quand l'enfant donne la bonne réponse
      Étant donné que Léa a dit « Je ne sais pas » à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa répond « chat »
      Alors la question « Quel mot est bien écrit ? » est réussie
      Et la question suivante s'affiche

    @depend-de-20
    Scénario: Au clavier de cristaux, « Je ne sais pas » dit la réponse à taper
      Étant donné qu'une leçon de test de niveau CE1 a un exercice calcul « 12 − 5 », de résultat 7, d'aide « Pars de 12 et recule de 5. »
      Et que Tom en est au calcul « 12 − 5 »
      Quand Tom dit « Je ne sais pas »
      Alors Noisette dit « Pas de souci ! Pars de 12 et recule de 5. La réponse est 7. Tape-la sur les cristaux. »
      Et le calcul « 12 − 5 » reste posé jusqu'à ce que Tom tape 7

    Scénario: La bonne réponse montrée est annoncée en texte, sans dépendre de la couleur ni du mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa en est à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa dit « Je ne sais pas »
      Alors les lecteurs d'écran annoncent que la bonne réponse est « chat »
      Et le choix « chat » est mis en avant sans bouger

  Règle: « Je ne sais pas » se dit au plus une fois par question, là où l'exercice le permet

    Scénario: Après « Je ne sais pas », il n'est plus proposé pour cette question
      Étant donné que Léa en est à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa dit « Je ne sais pas »
      Alors « Je ne sais pas » n'est plus proposé à Léa pour cette question

    Scénario: « Je ne sais pas » est de nouveau proposé à la question suivante
      Étant donné que Léa a dit « Je ne sais pas » à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa répond « chat »
      Alors « Je ne sais pas » est de nouveau proposé à Léa

    Plan du Scénario: « Je ne sais pas » est proposé dans un exercice <type> (<cas>)
      Quand <enfant> commence un exercice <type> d'une leçon de test
      Alors « Je ne sais pas » est proposé à <enfant>

      Exemples:
        | type        | enfant | cas                                   |
        | bulles      | Léa    | avec les choix                        |
        | lecture     | Léa    | aux questions, avec les choix         |
        | ecoute      | Léa    | avec les choix                        |

      Exemples:
        | type        | enfant | cas                                   |
        | trous       | Léa    | avec les choix                        |

      Exemples:
        | type        | enfant | cas                                   |
        | conjugaison | Léa    | avec les choix                        |

      @depend-de-20
      Exemples:
        | type        | enfant | cas                                   |
        | calcul      | Léa    | au CP, avec les choix                 |
        | calcul      | Tom    | au CE1, au clavier de cristaux        |

      @depend-de-21
      Exemples:
        | type        | enfant | cas                                   |
        | boite       | Léa    | au CP, avec les choix                 |
        | barres      | Tom    | au CE1, au clavier de cristaux        |

    @depend-de-20
    Scénario: La fluence ne propose pas « Je ne sais pas »
      Étant donné que Léa joue seulement l'exercice « Calcul rapide : les doubles » de la leçon « Les doubles »
      Quand Noisette dit « C'est parti ! »
      Alors « Je ne sais pas » n'est pas proposé à Léa

    Plan du Scénario: « Je ne sais pas » dans un exercice <type> : <ce qui est montré>
      Étant donné que Léa joue un exercice <type> d'une leçon de test
      Quand Léa dit « Je ne sais pas »
      Alors <ce qui est montré>
      Et Léa doit encore donner elle-même la bonne réponse

      Exemples:
        | type                            | ce qui est montré                                                       |
        | classer                         | la bonne maison de l'étiquette choisie brille                           |
        | ordre                           | l'étiquette qui vient ensuite brille                                    |

      @depend-de-20
      Exemples:
        | type                            | ce qui est montré                                                       |
        | addition à l'étape poser        | la bonne colonne du chiffre choisi brille                               |

      Exemples:
        | type                            | ce qui est montré                                                       |
        | dictee                          | la lettre juste suivante s'écrit dans sa case, sans montrer tout le mot |

  Règle: Une réponse fausse coûte une erreur ; « Je ne sais pas » en coûte une, sauf si la question a déjà coûté une erreur

    Scénario: « Je ne sais pas » compte une erreur
      Étant donné que Léa joue une leçon de test d'une seule question à quatre choix
      Et que Léa a dit « Je ne sais pas » à cette question
      Quand Léa donne la bonne réponse
      Alors la séance est terminée
      Et Léa gagne 2 étoiles

    Scénario: « Je ne sais pas » après deux erreurs n'ajoute pas d'erreur à la question
      Étant donné que Léa joue une leçon de test de deux questions à quatre choix
      Et qu'à la première question, Léa a fait deux erreurs, puis a dit « Je ne sais pas », puis a donné la bonne réponse
      Et qu'à la deuxième question, Léa a fait une erreur
      Quand Léa donne la bonne réponse à la deuxième question
      Alors Léa gagne 2 étoiles

    @depend-de-20
    Scénario: Après « Je ne sais pas » au clavier de cristaux, une faute de frappe ne coûte pas d'erreur
      Étant donné que Tom joue une leçon de test de niveau CE1 de deux calculs
      Et qu'au premier calcul, Tom a dit « Je ne sais pas », puis a tapé une mauvaise réponse, puis la bonne
      Et qu'au second calcul, Tom a fait deux erreurs
      Quand Tom donne la bonne réponse au second calcul
      Alors Tom gagne 2 étoiles

  Règle: « Je ne sais pas » s'utilise du doigt, au clavier et en mode dys

    Scénario: « Je ne sais pas » se touche du doigt sur un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa joue l'exercice « Le mot bien écrit » de la leçon « Dictée : les animaux »
      Quand la question « Quel mot est bien écrit ? » s'affiche
      Alors « Je ne sais pas » mesure au moins 44 px de haut
      Et la page tient dans la largeur de l'écran

    Scénario: « Je ne sais pas » se choisit au clavier
      Étant donné que Léa joue sur un ordinateur, au clavier
      Et que Léa en est à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa dit « Je ne sais pas », au clavier seulement
      Alors seul le choix « chat » reste, et il brille

    Scénario: Avec le mode dys, l'aide lue s'affiche en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa en est à la question « Quel mot est bien écrit ? » dont la réponse est « chat »
      Quand Léa répond « cha »
      Alors Léa voit « Pense à la lettre muette, comme dans chaton. » dans la bulle de Noisette en mode dys
