# language: fr
@issue-21
Fonctionnalité: Boîte à jetons et schéma en barres
  En tant qu'enfant
  Je veux prévoir combien de jetons sont cachés dans une boîte, et résoudre un problème à l'aide d'un schéma en barres
  Afin de passer du comptage au calcul et de comprendre ce qu'on cherche dans un problème

  Leçons de la bibliothèque utilisées, toutes du CP et appuyées sur le guide fondamental « Pour enseigner les
  nombres, le calcul et la résolution de problèmes au CP » : « La boîte à jetons : ajouter » (ma-cp-boite-ajouter),
  « La boîte à jetons : retirer » (ma-cp-boite-retirer), « Problèmes : le tout et les parties » (ma-cp-parties-tout),
  « Problèmes : combien de plus ? » (ma-cp-comparaison) et « Plusieurs fois, partager » (ma-cp-fois-partage).

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »
    Et que Tom a un profil enfant préparé de niveau CE1 dans l'univers « Animaux de la forêt »

  Règle: Boîte à jetons : des jetons entrent ou sortent d'une boîte fermée, et l'enfant prévoit combien il y en a

    Scénario: Des jetons entrent dans la boîte, puis elle se ferme
      Étant donné que Léa est sur la page de la leçon « La boîte à jetons : ajouter »
      Quand Léa choisit seulement l'exercice « Combien dans la boîte ? »
      Alors Noisette dit « Je mets 4 jetons dans la boîte. », puis « Et j'en mets encore 3. »
      Et Noisette dit ensuite « La boîte est fermée. Combien y a-t-il de jetons dedans ? Réfléchis dans ta tête, avec tes doigts, ou en dessinant. »
      Et Léa ne voit plus les jetons

    Scénario: Des jetons sortent de la boîte
      Étant donné que Léa est sur la page de la leçon « La boîte à jetons : retirer »
      Quand Léa choisit seulement l'exercice « Combien en reste-t-il ? »
      Alors Noisette dit « Je mets 8 jetons dans la boîte. », puis « Maintenant, j'en retire 3. »

    Plan du Scénario: La bonne réponse <réponse> ouvre la boîte et donne l'écriture du calcul « <écriture> »
      Étant donné que Léa joue la boîte à jetons « <a> <signe> <b> » de la leçon « <leçon> »
      Quand Léa répond « <réponse> »
      Alors la boîte s'ouvre et Léa voit <réponse> jetons, rangés par 5
      Et Noisette dit « On ouvre la boîte pour vérifier… <réponse> jetons ! <écriture>. », puis une félicitation

      Exemples:
        | leçon                        | a  | signe | b | réponse | écriture   |
        | La boîte à jetons : ajouter  | 4  | +     | 3 | 7       | 4 + 3 = 7  |
        | La boîte à jetons : ajouter  | 6  | +     | 4 | 10      | 6 + 4 = 10 |
        | La boîte à jetons : retirer  | 8  | −     | 3 | 5       | 8 − 3 = 5  |

    Plan du Scénario: Après une erreur à « <a> <signe> <b> », le personnage guide dit « <aide> »
      Étant donné que Léa joue la boîte à jetons « <a> <signe> <b> » de la leçon « <leçon> »
      Quand Léa répond « <réponse fausse> »
      Alors la boîte reste fermée
      Et Noisette dit un encouragement, suivi de « <aide> »

      Exemples:
        | leçon                        | a | signe | b | réponse fausse | aide                                          |
        | La boîte à jetons : ajouter  | 4 | +     | 3 | 8              | Mets 4 dans ta tête, et avance de 3.          |
        | La boîte à jetons : ajouter  | 2 | +     | 7 | 8              | Mets 7 dans ta tête, et avance de 2.          |
        | La boîte à jetons : retirer  | 8 | −     | 3 | 4              | Pars de 8 et recule de 3.                     |

  Règle: Au CP, une réponse de 20 au plus se donne par choix ; sinon, au clavier de cristaux

    Plan du Scénario: <enfant> répond à un résultat de <résultat> <mode>
      Étant donné qu'une leçon de test a une boîte à jetons « <calcul> »
      Quand <enfant> joue cette boîte à jetons et que la boîte est fermée
      Alors <enfant> répond <mode>

      Exemples:
        | enfant | calcul  | résultat | mode                                          |
        | Léa    | 4 + 3   | 7        | avec les choix « 6 », « 7 », « 8 » et « 9 »  |
        | Léa    | 7 − 7   | 0        | avec les choix « 0 », « 1 » et « 2 »          |
        | Léa    | 12 + 8  | 20       | avec les choix « 19 », « 20 », « 21 » et « 22 » |
        | Léa    | 15 + 9  | 24       | au clavier de cristaux                        |
        | Tom    | 4 + 3   | 7        | au clavier de cristaux                        |

  Règle: Schéma en barres : le « ? » montre la valeur cherchée, et la bonne réponse donne l'écriture du calcul

    Scénario: L'énoncé du problème est lu, puis le schéma est expliqué
      Étant donné que Léa est sur la page de la leçon « Problèmes : le tout et les parties »
      Quand Léa choisit seulement l'exercice « Le tout ou une partie ? »
      Alors Léa entend Noisette lire « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? »
      Et Noisette dit ensuite « Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche. »
      Et Léa voit deux barres de 4 et de 2, et au-dessus le tout, marqué « ? »

    Plan du Scénario: Problème « <énoncé> » : la réponse <réponse> donne « <explication> »
      Étant donné que Léa joue le problème « <énoncé> » de la leçon « <leçon> »
      Quand Léa répond « <réponse> »
      Alors le « ? » du schéma est remplacé par <réponse>
      Et Noisette dit une félicitation, suivie de « <explication> »

      Exemples:
        | leçon                              | énoncé                                                                                                         | réponse | explication                |
        | Problèmes : le tout et les parties | Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ?                              | 6       | 4 + 2 = 6. J'ai 6 pommes.  |
        | Problèmes : le tout et les parties | Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ?                            | 3       | 9 − 6 = 3.                 |
        | Problèmes : combien de plus ?      | Léo a 37 billes, Lucie en a 43. Combien Lucie a-t-elle de billes de plus que Léo ?                             | 6       | 43 − 37 = 6.               |
        | Problèmes : combien de plus ?      | Sam a 9 ans. Sa sœur a 4 ans de plus. Quel âge a sa sœur ?                                                     | 13      | 9 + 4 = 13.                |
        | Problèmes : combien de plus ?      | Une tour a 15 cubes. Une autre a 6 cubes de moins. Combien de cubes a l'autre tour ?                           | 9       | 15 − 6 = 9.                |
        | Plusieurs fois, partager           | On remplit 4 sacs avec 5 pommes chacun. Combien faut-il de pommes ?                                            | 20      | 4 × 5 = 20.                |
        | Plusieurs fois, partager           | Trois enfants se partagent une tablette de chocolat de 12 carreaux. Combien de carreaux aura chaque enfant ?   | 4       | 12 = 3 × 4.                |
        | Plusieurs fois, partager           | Il y a 18 élèves. On fait des équipes de 3 élèves. Combien y aura-t-il d'équipes ?                             | 6       | 18 = 6 × 3.                |

    Scénario: Après une erreur, l'aide du problème est lue
      Étant donné que Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 15 »
      Alors Noisette dit un encouragement, suivi de « On connaît le tout, 9, et une partie, 6. On cherche l'autre partie. »

    Plan du Scénario: Sans aide, un problème de <forme> donne l'aide par défaut de sa forme
      Étant donné que Léa joue le problème « <énoncé> » de la leçon « <leçon> »
      Quand Léa répond faux
      Alors Noisette dit un encouragement, suivi de « <aide par défaut> »

      Exemples:
        | forme            | leçon                              | énoncé                                                                                                | aide par défaut                                                                       |
        | parties et tout  | Problèmes : le tout et les parties | Dans la cour, il y a 5 filles et 3 garçons. Combien d'enfants y a-t-il ?                              | Regarde le schéma : cherches-tu le tout, ou une partie ?                              |
        | comparaison      | Problèmes : combien de plus ?      | Léo a 37 billes, Lucie en a 43. Combien Lucie a-t-elle de billes de plus que Léo ?                    | Regarde le schéma : cherches-tu la grande barre, la petite, ou l'écart entre les deux ? |
        | parts            | Plusieurs fois, partager           | On remplit 4 sacs avec 5 pommes chacun. Combien faut-il de pommes ?                                   | Regarde le schéma : cherches-tu le total, la valeur d'une part, ou le nombre de parts ? |

  Règle: La boîte et le schéma se comprennent aussi sans les voir, et sans mouvement

    Plan du Scénario: Le schéma en barres de <forme> est décrit aux lecteurs d'écran
      Étant donné que Léa joue le problème « <énoncé> » de la leçon « <leçon> »
      Quand le schéma s'affiche
      Alors les lecteurs d'écran lisent « <description> »

      Exemples:
        | forme           | leçon                              | énoncé                                                                             | description                                       |
        | parties et tout | Problèmes : le tout et les parties | Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? | Le tout : ?. Une partie : 4. L'autre partie : 2. |
        | comparaison     | Problèmes : combien de plus ?      | Sam a 9 ans. Sa sœur a 4 ans de plus. Quel âge a sa sœur ?                         | sa sœur : ?. Sam : 9. L'écart : 4.                |
        | parts           | Plusieurs fois, partager           | Trois enfants se partagent une tablette de chocolat de 12 carreaux. Combien de carreaux aura chaque enfant ? | Le total : 12. 3 parts. Chaque part : ?   |

    Scénario: Avec les mouvements réduits, la boîte s'ouvre sans animation
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 7 »
      Alors Léa voit la boîte ouverte et ses 7 jetons, sans mouvement

    Scénario: La boîte et le schéma tiennent dans un écran de 360 px de large
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa est sur la page de la leçon « Problèmes : combien de plus ? »
      Quand Léa choisit seulement l'exercice « Combien de plus ? »
      Alors la page tient dans la largeur de l'écran
      Et les barres du schéma restent proportionnelles aux nombres 37 et 43
