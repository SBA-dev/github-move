# language: fr
@issue-131 @wip
Fonctionnalité: Des exercices qui ressemblent à des jeux : la boîte à jetons et le schéma en barres de l'univers
  En tant qu'enfant
  Je veux voir les jetons tomber dans la boîte et les barres se remplir comme une jauge, aux couleurs et au dessin
  de mon univers
  Afin que les quantités ressemblent à un jeu

  Tranche 98c-boîte et barres de la story #98 (docs/stories/131/domain-model.md). La story ne change que l'affichage
  de la boîte à jetons et du schéma en barres (#21) : la correction, les erreurs, « Je ne sais pas », l'aide,
  l'avancement et les étoiles restent ceux du domaine (#21, #23, #24), et les retours de #97 (effet sonore, rebond)
  ne sont pas redécrits. Les scénarios de features/21-boite-et-barres.feature restent vrais sans changement.
  Les bulles de choix (#126) et le clavier de cristaux (#128) sont hors périmètre : ici on y répond comme dans #21,
  quel que soit leur dessin.
  Le test de départ ne pose jamais de boîte à jetons ni de schéma en barres : il n'y a rien à y habiller, et aucun
  scénario ne le décrit.
  Les commentaires « Question 131.n » renvoient aux questions de docs/stories/131/domain-model.md (131.1 à 131.11) et
  de docs/stories/131/acceptance.md (131.12 et 131.13). Toutes ces questions ont été tranchées par le PO le
  2026-11-03 : la recommandation est retenue partout.

  Mots employés dans ces scénarios (mots d'interface, pas des termes du domaine) :
  - « tomber dans la boîte, avec un petit rebond » : un jeton qui entre dans la boîte y arrive par un mouvement de
    haut en bas et rebondit un peu, au lieu d'apparaître d'un coup ;
  - « s'en aller en douceur » : un jeton retiré bouge et pâlit progressivement, il ne disparaît jamais d'un coup ;
  - « la jauge » : le remplissage d'une barre du schéma, uni, sans graduation ni motif qui se compte. « se remplir
    comme une jauge » : la jauge avance dans la barre jusqu'à son bout ; la largeur de la barre ne change pas ;
  - « la barre « ? » » : la barre de la valeur cherchée, qui porte « ? » tant que le problème n'est pas résolu.
    « reste vide » : elle n'a aucune jauge, même partielle ;
  - « la barre de 4 » : la barre du schéma qui porte le nombre 4 ;
  - « le dessin de l'univers », « la jauge de l'univers » : la boîte, les jetons et la jauge ont un dessin propre à
    chaque univers. Les scénarios ne décrivent jamais ce qui est dessiné (quel objet, quelle matière, quelle couleur) :
    c'est choisi par le PO (questions 131.1 et 131.2) et validé sur une planche, pas par un scénario. La boîte n'est
    jamais un coffre (décision 98.6) : cela se vérifie sur la planche.
  Durées pour l'implémentation et la review, jamais dans les étapes : chute, sortie et remplissage en 400 ms au plus,
  effet sonore de #97 parti en moins de 300 ms.

  Leçons de la bibliothèque utilisées, toutes du CP et déjà employées par #21 : « La boîte à jetons : ajouter »
  (exercice « Combien dans la boîte ? », boîtes 4 + 3, 5 + 2, 3 + 3, 6 + 4, 2 + 7), « La boîte à jetons : retirer »
  (exercice « Combien en reste-t-il ? », première boîte 8 − 3), « Problèmes : le tout et les parties » (exercice
  « Le tout ou une partie ? »), « Problèmes : combien de plus ? » (exercice « Combien de plus ? ») et « Plusieurs
  fois, partager » (exercice « Fois et partage »). Boîtes de leçons de test : « 4 + 3 », « 12 + 8 » (20 jetons, la plus
  grande boîte ouverte au CP avec des choix).
  Les 6 univers et leur personnage guide (#6, #96) : Animaux de la forêt (Noisette), Princesses et fées (Lumi),
  Sports (Coach Léo), Police (Agent Max), Pompiers (Capitaine Sam), Danse (Lili).
  Paul est le parent de Léa ; Léa a un profil enfant de niveau CP dans l'univers « Animaux de la forêt ». Quand Léa a
  choisi un autre univers, elle y garde son niveau CP.

  Contexte:
    Étant donné que Léa a un profil enfant préparé de niveau CP dans l'univers « Animaux de la forêt »

  Règle: Pour les mêmes réponses, l'habillage ne change rien : mêmes erreurs, même avancement, mêmes étoiles ; ni les jetons, ni la boîte, ni les barres ne sont des cibles ; la boîte et le schéma ont le même habillage en séance et en séance de révision

    Plan du Scénario: Dans l'univers « <univers> », <erreurs> erreur(s) à l'exercice « <exercice> » donnent <résultat>, comme avant
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue seulement l'exercice « <exercice> » de la leçon « <leçon> »
      Et que Léa a répondu faux <erreurs> fois à la première question
      Quand Léa termine l'exercice sans autre erreur
      Alors Léa gagne <résultat>

      Exemples:
        | clé       | univers             | leçon                              | exercice                | erreurs | résultat  |
        | animaux   | Animaux de la forêt | La boîte à jetons : ajouter        | Combien dans la boîte ? | 0       | 3 étoiles |
        | police    | Police              | La boîte à jetons : retirer        | Combien en reste-t-il ? | 1       | 2 étoiles |
        | sports    | Sports              | Problèmes : le tout et les parties | Le tout ou une partie ? | 0       | 3 étoiles |
        | danse     | Danse               | Problèmes : combien de plus ?      | Combien de plus ?       | 3       | 2 étoiles |
        | princesse | Princesses et fées  | Plusieurs fois, partager           | Fois et partage         | 1       | 2 étoiles |

    Scénario: Une boîte à jetons réussie fait avancer la séance comme avant
      Étant donné que Léa a choisi l'univers pompier
      Et que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 7 »
      Alors l'avancement de la séance montre 1 question réussie sur 5

    Scénario: Toucher la boîte fermée ne donne aucune réponse
      Étant donné qu'une leçon de test a une boîte à jetons « 4 + 3 »
      Et que Léa joue cette boîte à jetons et que la boîte est fermée
      Quand Léa touche la boîte
      Alors la boîte reste fermée
      Et Noisette ne dit aucun encouragement
      Et Léa n'entend pas l'effet sonore « réponse fausse »

    Scénario: Toucher une barre du schéma ne donne aucune réponse
      Étant donné que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa touche la barre de 4
      Alors la barre « ? » reste vide, avec son « ? »
      Et Noisette ne dit aucun encouragement
      Et Léa n'entend pas l'effet sonore « réponse fausse »

    # Décision 97.17
    Scénario: Pendant la félicitation, toucher la boîte ouverte ne change rien
      Étant donné que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Et que Léa a répondu « 7 »
      Quand Léa touche la boîte ouverte pendant la félicitation
      Alors Léa voit toujours la boîte ouverte et ses 7 jetons
      Et Noisette dit « On ouvre la boîte pour vérifier… 7 jetons ! 4 + 3 = 7. », puis une félicitation

    Plan du Scénario: En séance de révision, <objet> a le dessin de l'univers « <univers> », comme en séance
      Étant donné que Léa a choisi l'univers <clé>
      Et que <question retenue>
      Quand Léa commence la séance de révision
      Alors <dessin>

      Exemples:
        | objet               | clé     | univers  | question retenue                                                                                                                                                                         | dessin                                                         |
        | la boîte à jetons   | pompier | Pompiers | Léa a pour question retenue la boîte à jetons « 4 + 3 » de l'exercice « Combien dans la boîte ? », due aujourd'hui                                                                       | la boîte et ses jetons ont le dessin de l'univers « Pompiers » |
        | le schéma en barres | danse   | Danse    | Léa a pour question retenue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de l'exercice « Le tout ou une partie ? », due aujourd'hui | les barres du schéma ont la jauge de l'univers « Danse »       |

    Scénario: En séance de révision, la barre « ? » reste vide jusqu'à la bonne réponse, comme en séance
      Étant donné que Léa a pour question retenue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de l'exercice « Le tout ou une partie ? », due aujourd'hui
      Quand Léa commence la séance de révision
      Alors les barres de 4 et de 2 se remplissent comme une jauge, jusqu'au bout de leur barre
      Mais la barre « ? » reste vide, avec son « ? »

  Règle: Dans la boîte à jetons, les jetons qui entrent tombent dans la boîte avec un petit rebond, et ceux qui sortent s'en vont en douceur ; le nombre de jetons et leurs rangées de 5 ne changent pas ; la boîte fermée ne laisse rien deviner ; à la bonne réponse, la boîte s'ouvre après les retours de #97

    Scénario: Les 3 jetons ajoutés tombent dans la boîte, à part des 4 premiers
      Étant donné que Léa est sur la page de la leçon « La boîte à jetons : ajouter »
      Quand Léa choisit seulement l'exercice « Combien dans la boîte ? »
      Alors Noisette dit « Je mets 4 jetons dans la boîte. », puis « Et j'en mets encore 3. »
      Et les 3 jetons ajoutés tombent dans la boîte, avec un petit rebond
      Et Léa voit une rangée de 4 jetons et, à part, une rangée de 3 jetons

    # Question 131.5 (tranchée le 2026-11-03, reco retenue : oui)
    Scénario: Les 4 premiers jetons tombent aussi dans la boîte
      Étant donné que Léa est sur la page de la leçon « La boîte à jetons : ajouter »
      Quand Léa choisit seulement l'exercice « Combien dans la boîte ? »
      Alors Noisette dit « Je mets 4 jetons dans la boîte. »
      Et les 4 premiers jetons tombent dans la boîte, avec un petit rebond

    # Question 131.4 (tranchée le 2026-11-03, reco retenue : tous ensemble, rangée par rangée)
    Scénario: Les jetons ajoutés tombent ensemble, pas un par un
      Étant donné que Léa est sur la page de la leçon « La boîte à jetons : ajouter »
      Quand Léa choisit seulement l'exercice « Combien dans la boîte ? »
      Alors Noisette dit « Je mets 4 jetons dans la boîte. », puis « Et j'en mets encore 3. »
      Et les 3 jetons ajoutés commencent à tomber en même temps

    Scénario: Les 3 jetons retirés s'en vont en douceur, sans disparaître d'un coup
      Étant donné que Léa est sur la page de la leçon « La boîte à jetons : retirer »
      Quand Léa choisit seulement l'exercice « Combien en reste-t-il ? »
      Alors Noisette dit « Je mets 8 jetons dans la boîte. », puis « Maintenant, j'en retire 3. »
      Et les 3 derniers jetons s'en vont en douceur, sans disparaître d'un coup

    # Question 131.6 (tranchée le 2026-11-03, reco retenue : A, les jetons retirés restent pâles à leur place)
    Scénario: Les jetons retirés restent visibles, pâles, à leur place, jusqu'à la fermeture de la boîte
      Étant donné que Léa est sur la page de la leçon « La boîte à jetons : retirer »
      Quand Léa choisit seulement l'exercice « Combien en reste-t-il ? »
      Alors Noisette dit « Je mets 8 jetons dans la boîte. », puis « Maintenant, j'en retire 3. »
      Et Léa voit 5 jetons et, à leur suite, 3 jetons pâles

    Scénario: En Muet, les jetons ajoutés tombent de la même façon
      Étant donné que la tablette est en Muet
      Et que Léa est sur la page de la leçon « La boîte à jetons : ajouter »
      Quand Léa choisit seulement l'exercice « Combien dans la boîte ? »
      Alors les 3 jetons ajoutés tombent dans la boîte, avec un petit rebond
      Et Léa voit une rangée de 4 jetons et, à part, une rangée de 3 jetons

    Plan du Scénario: Avec <jetons> jetons dedans, la boîte fermée ne laisse voir aucun jeton et garde sa taille
      Étant donné qu'une leçon de test a une boîte à jetons « <calcul> »
      Quand Léa joue cette boîte à jetons et que la boîte est fermée
      Alors Léa ne voit plus les jetons
      Et la boîte fermée a la même taille, quel que soit le nombre de jetons dedans

      Exemples:
        | calcul | jetons |
        | 4 + 3  | 7      |
        | 12 + 8 | 20     |

    # Question 131.7 (tranchée le 2026-11-03, reco retenue : oui, seul le couvercle s'ouvre)
    Scénario: À la bonne réponse, la boîte s'ouvre sur ses jetons, qui ne tombent pas de nouveau
      Étant donné que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 7 »
      Alors la boîte s'ouvre et Léa voit 7 jetons, rangés par 5
      Mais aucun jeton ne tombe à l'ouverture de la boîte

    Scénario: À la bonne réponse, l'effet sonore « réponse juste » part avant que la boîte s'ouvre
      Étant donné que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 7 »
      Alors Léa entend l'effet sonore « réponse juste »
      Et l'effet sonore « réponse juste » commence avant que la boîte s'ouvre

  Règle: Dans le schéma en barres, les barres connues se remplissent comme une jauge jusqu'au bout de leur barre ; la barre « ? » garde son « ? » et reste vide jusqu'à la bonne réponse de l'enfant, même après une erreur, « Je ne sais pas » ou « Réécouter » ; elle se remplit après les retours de #97 ; l'habillage ne donne jamais la réponse

    Scénario: Les barres de 4 et de 2 se remplissent comme une jauge, et la barre « ? » reste vide
      Étant donné que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand le schéma s'affiche
      Alors les barres de 4 et de 2 se remplissent comme une jauge, jusqu'au bout de leur barre
      Mais la barre « ? » reste vide, avec son « ? »

    # Question 131.8 (tranchée le 2026-11-03, reco retenue : A, au début de l'explication du schéma)
    Scénario: Les barres connues se remplissent quand Noisette commence à expliquer le schéma, pas pendant l'énoncé du problème
      Étant donné que Léa est sur la page de la leçon « Problèmes : le tout et les parties »
      Quand Léa choisit seulement l'exercice « Le tout ou une partie ? »
      Alors les barres de 4 et de 2 sont encore vides pendant que Noisette lit l'énoncé du problème
      Et les barres de 4 et de 2 se remplissent quand Noisette dit « Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche. »

    # Question 131.8 (tranchée le 2026-11-03, reco retenue : A, « Réécouter » ne vide pas les barres)
    Scénario: Réécouter la question ne vide pas les barres déjà remplies
      Étant donné que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Et que les barres de 4 et de 2 sont pleines
      Quand Léa demande à réécouter la question
      Alors les barres de 4 et de 2 restent pleines, sans se remplir de nouveau
      Et la barre « ? » reste vide, avec son « ? »

    Scénario: En Muet, les barres connues se remplissent aussi, et la barre « ? » reste vide
      Étant donné que la tablette est en Muet
      Et que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand le schéma s'affiche
      Alors les barres de 4 et de 2 se remplissent comme une jauge, jusqu'au bout de leur barre
      Mais la barre « ? » reste vide, avec son « ? »

    Scénario: À la bonne réponse, le « ? » devient 3 et sa barre se remplit comme une jauge
      Étant donné que Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 3 »
      Alors le « ? » du schéma est remplacé par 3
      Et la barre de 3 se remplit comme une jauge, jusqu'au bout de sa barre

    Scénario: À la bonne réponse, l'effet sonore « réponse juste » part avant que la barre « ? » se remplisse
      Étant donné que Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 3 »
      Alors Léa entend l'effet sonore « réponse juste »
      Et l'effet sonore « réponse juste » commence avant que la barre de 3 se remplisse

    Plan du Scénario: <Cas>, la barre « ? » reste vide et ne montre pas la réponse
      Étant donné que Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties »
      Quand <action>
      Alors la barre « ? » reste vide, avec son « ? »
      Mais le nombre 3 n'est écrit sur aucune barre du schéma

      Exemples:
        | Cas                      | action                              |
        | Après une erreur         | Léa répond « 5 »                    |
        | Après « Je ne sais pas » | Léa dit « Je ne sais pas »          |
        | Après « Réécouter »      | Léa demande à réécouter la question |

    Scénario: Après « Je ne sais pas », la barre « ? » se remplit seulement quand Léa donne elle-même la réponse
      Étant donné que Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties »
      Et que Léa a dit « Je ne sais pas »
      Quand Léa répond « 3 »
      Alors le « ? » du schéma est remplacé par 3
      Et la barre de 3 se remplit comme une jauge, jusqu'au bout de sa barre

    # Question 131.10 (tranchée le 2026-11-03, reco retenue : oui, la barre « ? » garde sa taille proportionnelle, sans rien changer)
    Scénario: En se remplissant, la barre « ? » garde la largeur qu'elle avait avant la réponse
      Étant donné que Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 3 »
      Alors la barre de 3 a la même largeur que la barre « ? » avant la réponse

    Scénario: Dans une comparaison, l'écart connu reste en pointillés, sans jauge
      Étant donné que Léa joue le problème « Sam a 9 ans. Sa sœur a 4 ans de plus. Quel âge a sa sœur ? » de la leçon « Problèmes : combien de plus ? »
      Quand le schéma s'affiche
      Alors la barre de 9 se remplit comme une jauge, jusqu'au bout de sa barre
      Mais l'écart de 4 reste en pointillés, sans jauge
      Et la barre « ? » reste vide, avec son « ? »

    # Question 131.12 (tranchée le 2026-11-03, reco retenue : A, l'écart reste en pointillés même quand c'est la valeur cherchée)
    Scénario: Quand l'écart est la valeur cherchée, il reçoit la réponse et reste en pointillés
      Étant donné que Léa joue le problème « Léo a 37 billes, Lucie en a 43. Combien Lucie a-t-elle de billes de plus que Léo ? » de la leçon « Problèmes : combien de plus ? »
      Quand Léa répond « 6 »
      Alors le « ? » du schéma est remplacé par 6
      Mais l'écart de 6 reste en pointillés, sans jauge

    # Question 131.13 (tranchée le 2026-11-03, reco retenue : A, les parts apparaissent remplies d'un coup, après le rebond)
    Scénario: Quand le nombre de parts est la valeur cherchée, les 6 parts apparaissent remplies à la bonne réponse
      Étant donné que Léa joue le problème « Il y a 18 élèves. On fait des équipes de 3 élèves. Combien y aura-t-il d'équipes ? » de la leçon « Plusieurs fois, partager »
      Quand Léa répond « 6 »
      Alors le « ? » du schéma est remplacé par 6
      Et Léa voit 6 parts, toutes pleines de la jauge

  Règle: Dans chacun des 6 univers, la boîte, les jetons et la jauge ont le dessin de cet univers ; changer d'univers ne change ni le nombre de jetons, ni leurs rangées, ni la taille des barres, ni les textes lus, ni les étoiles, ni la façon dont la bonne réponse est montrée ; un profil sans univers connu voit les dessins de l'univers « Animaux de la forêt »

    Plan du Scénario: Dans l'univers « <univers> », la boîte fermée a le dessin de cet univers et ne laisse voir aucun jeton
      Étant donné que Léa a choisi l'univers <clé>
      Et qu'une leçon de test a une boîte à jetons « 4 + 3 »
      Quand Léa joue cette boîte à jetons et que la boîte est fermée
      Alors Léa ne voit plus les jetons
      Et la boîte a le dessin de l'univers « <univers> »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », la boîte ouverte et ses jetons ont le dessin de cet univers, rangés par 5
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 7 »
      Alors la boîte s'ouvre et Léa voit 7 jetons, rangés par 5
      Et la boîte et ses jetons ont le dessin de l'univers « <univers> »
      Et tous les jetons de la boîte ont le même dessin et la même taille

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    # Question 131.3 (tranchée le 2026-11-03, reco retenue : oui, la marque du cinquième jeton est commune aux 6 univers)
    Plan du Scénario: Dans l'univers « <univers> », le cinquième jeton de chaque rangée porte la même marque que dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue la boîte à jetons « 6 + 4 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 10 »
      Alors la boîte s'ouvre et Léa voit 10 jetons, rangés par 5
      Et le cinquième jeton de chaque rangée porte la même marque que dans l'univers « Animaux de la forêt »

      Exemples:
        | clé       | univers            |
        | princesse | Princesses et fées |
        | sports    | Sports             |
        | police    | Police             |
        | pompier   | Pompiers           |
        | danse     | Danse              |

    Plan du Scénario: Dans l'univers « <univers> », les barres ont la jauge de cet univers, et le tout garde une teinte à lui
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 6 »
      Alors le « ? » du schéma est remplacé par 6
      Et les barres du schéma ont la jauge de l'univers « <univers> »
      Et la barre du tout n'a pas la même teinte que les barres des parties

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », avant la bonne réponse, la barre « ? » reste vide comme dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand le schéma s'affiche
      Alors les barres de 4 et de 2 se remplissent comme une jauge, jusqu'au bout de leur barre
      Mais la barre « ? » reste vide, avec son « ? »
      Et la barre « ? » vide se voit de la même façon que dans l'univers « Animaux de la forêt »

      Exemples:
        | clé       | univers            |
        | princesse | Princesses et fées |
        | sports    | Sports             |
        | police    | Police             |
        | pompier   | Pompiers           |
        | danse     | Danse              |

    Plan du Scénario: Dans l'univers « <univers> », après une erreur, <personnage guide> dit la même aide que dans tous les univers
      Étant donné que Léa a choisi l'univers <clé>
      Et que <partie>
      Quand Léa répond « <réponse fausse> »
      Alors <ce qui reste>
      Et <personnage guide> dit un encouragement, suivi de « <aide> »

      Exemples:
        | clé    | univers | personnage guide | partie                                                                                                                                                          | réponse fausse | ce qui reste                              | aide                                                                |
        | sports | Sports  | Coach Léo        | Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »                                                                                | 8              | la boîte reste fermée                     | Mets 4 dans ta tête, et avance de 3.                                |
        | police | Police  | Agent Max        | Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties » | 5              | la barre « ? » reste vide, avec son « ? » | On connaît le tout, 9, et une partie, 6. On cherche l'autre partie. |

    Plan du Scénario: Dans l'univers « <univers> », « Je ne sais pas » montre la bonne réponse comme dans tous les univers, sans ouvrir la boîte
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa dit « Je ne sais pas »
      Alors seul le choix « 7 » reste, et il brille
      Et la boîte reste fermée

      Exemples:
        | clé       | univers            |
        | princesse | Princesses et fées |
        | pompier   | Pompiers           |

    Plan du Scénario: Un profil enfant <cas> voit <objet> de l'univers « Animaux de la forêt »
      Étant donné que Léa a un profil enfant préparé <cas>
      Et que <partie>
      Quand Léa répond « <réponse> »
      Alors <dessin>
      Et aucun message d'erreur n'apparaît

      Exemples:
        | cas                        | objet                  | partie                                                                                                                                                        | réponse | dessin                                                                    |
        | sans univers               | la boîte et les jetons | Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »                                                                              | 7       | la boîte et ses jetons ont le dessin de l'univers « Animaux de la forêt » |
        | dont l'univers est inconnu | la boîte et les jetons | Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »                                                                              | 7       | la boîte et ses jetons ont le dessin de l'univers « Animaux de la forêt » |
        | sans univers               | la jauge               | Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties » | 6       | les barres du schéma ont la jauge de l'univers « Animaux de la forêt »    |
        | dont l'univers est inconnu | la jauge               | Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties » | 6       | les barres du schéma ont la jauge de l'univers « Animaux de la forêt »    |

  Règle: Avec les mouvements réduits, rien ne tombe ni ne se remplit progressivement, et l'information reste ; dans chacun des 6 univers, la boîte et le schéma tiennent à 360 px de large ; les nombres des barres restent lisibles et s'affichent en mode dys ; les lecteurs d'écran lisent les mêmes textes qu'avant ; aucun mouvement ne fait de bruit

    Plan du Scénario: Dans l'univers « <univers> », avec les mouvements réduits, la boîte s'ouvre sur ses 7 jetons, sans mouvement
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 7 »
      Alors Léa voit la boîte ouverte et ses 7 jetons, sans mouvement

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: Avec les mouvements réduits, les jetons ajoutés sont posés dans la boîte, sans tomber
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa est sur la page de la leçon « La boîte à jetons : ajouter »
      Quand Léa choisit seulement l'exercice « Combien dans la boîte ? »
      Alors Noisette dit « Je mets 4 jetons dans la boîte. », puis « Et j'en mets encore 3. »
      Et les 3 jetons ajoutés sont posés dans la boîte, sans tomber
      Et Léa voit une rangée de 4 jetons et, à part, une rangée de 3 jetons

    # Question 131.6 (tranchée le 2026-11-03, reco retenue : A, les jetons retirés restent pâles à leur place)
    Scénario: Avec les mouvements réduits, les jetons retirés sont pâles à leur place, sans bouger
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa est sur la page de la leçon « La boîte à jetons : retirer »
      Quand Léa choisit seulement l'exercice « Combien en reste-t-il ? »
      Alors Noisette dit « Je mets 8 jetons dans la boîte. », puis « Maintenant, j'en retire 3. »
      Et Léa voit 5 jetons et, à leur suite, 3 jetons pâles, sans mouvement

    Plan du Scénario: Dans l'univers « <univers> », avec les mouvements réduits, les barres connues sont pleines dès l'affichage et la barre « ? » vide
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa a choisi l'univers <clé>
      Et que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand le schéma s'affiche
      Alors les barres de 4 et de 2 sont pleines dès l'affichage, sans mouvement
      Mais la barre « ? » reste vide, avec son « ? »

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: Avec les mouvements réduits, à la bonne réponse, la barre « ? » est pleine d'un coup
      Étant donné que l'appareil demande des mouvements réduits
      Et que Léa joue le problème « Lina a 9 crayons : 6 sont rouges, les autres sont bleus. Combien de crayons bleus ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 3 »
      Alors le « ? » du schéma est remplacé par 3
      Et la barre de 3 est pleine d'un coup, sans mouvement

    Plan du Scénario: Dans l'univers « <univers> », la boîte fermée, les choix et « Je ne sais pas » tiennent dans un écran de 360 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et qu'une leçon de test a une boîte à jetons « 12 + 8 »
      Quand Léa joue cette boîte à jetons et que la boîte est fermée
      Alors la page tient dans la largeur de l'écran
      Et la boîte, les choix et « Je ne sais pas » se voient sans faire défiler l'écran

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », la boîte ouverte avec 20 jetons tient dans la largeur d'un écran de 360 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et qu'une leçon de test a une boîte à jetons « 12 + 8 »
      Quand Léa répond « 20 »
      Alors la boîte s'ouvre et Léa voit 20 jetons, rangés par 5
      Et la page tient dans la largeur de l'écran

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », le schéma d'une comparaison tient dans un écran de 360 px et reste proportionnel
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que Léa a choisi l'univers <clé>
      Et que Léa est sur la page de la leçon « Problèmes : combien de plus ? »
      Quand Léa choisit seulement l'exercice « Combien de plus ? »
      Alors la page tient dans la largeur de l'écran
      Et les barres du schéma restent proportionnelles aux nombres 37 et 43

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », chaque nombre écrit sur une barre pleine se lit sur sa jauge
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 6 »
      Alors chaque nombre écrit sur une barre se détache de sa jauge avec un contraste d'au moins 4,5:1

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Scénario: En mode dys, les nombres écrits sur les barres s'affichent en mode dys
      Étant donné que Paul a réglé « mode dys » sur « oui » pour Léa
      Et que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 6 »
      Alors Léa voit les nombres écrits sur les barres en mode dys : police Andika

    Plan du Scénario: Dans l'univers « <univers> », les lecteurs d'écran annoncent la boîte ouverte comme avant, sans décrire son dessin
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue la boîte à jetons « 4 + 3 » de la leçon « La boîte à jetons : ajouter »
      Quand Léa répond « 7 »
      Alors les lecteurs d'écran annoncent « Boîte ouverte : 7 jetons »
      Mais les lecteurs d'écran n'annoncent ni le dessin de la boîte, ni celui des jetons, ni l'univers du dessin

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Dans l'univers « <univers> », les lecteurs d'écran lisent le schéma résolu comme avant, sans décrire la jauge
      Étant donné que Léa a choisi l'univers <clé>
      Et que Léa joue le problème « Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ? » de la leçon « Problèmes : le tout et les parties »
      Quand Léa répond « 6 »
      Alors les lecteurs d'écran lisent « Le tout : 6. Une partie : 4. L'autre partie : 2. »
      Mais les lecteurs d'écran n'annoncent ni la jauge, ni l'univers du dessin

      Exemples:
        | clé       | univers             |
        | animaux   | Animaux de la forêt |
        | princesse | Princesses et fées  |
        | sports    | Sports              |
        | police    | Police              |
        | pompier   | Pompiers            |
        | danse     | Danse               |

    Plan du Scénario: Aucun effet sonore n'accompagne <le mouvement>
      Étant donné que Léa est sur la page de la leçon « <leçon> »
      Quand Léa choisit seulement l'exercice « <exercice> »
      Alors Léa n'entend aucun effet sonore pendant que <le mouvement> a lieu

      Exemples:
        | le mouvement                 | leçon                              | exercice                |
        | la chute des jetons ajoutés  | La boîte à jetons : ajouter        | Combien dans la boîte ? |
        | la sortie des jetons retirés | La boîte à jetons : retirer        | Combien en reste-t-il ? |
        | le remplissage des barres    | Problèmes : le tout et les parties | Le tout ou une partie ? |
