# language: fr
@issue-72 @wip
Fonctionnalité: Connexion du parent par adresse e-mail et mot de passe du parent, sans aucun e-mail
  En tant que parent
  Je veux me connecter avec mon adresse e-mail et un mot de passe du parent, sans attendre d'e-mail
  Afin de pouvoir commencer à tester Savanturier tout de suite, avec ma propre adresse

  Règle: Le parent s'inscrit avec son adresse e-mail et un mot de passe du parent, et il est connecté aussitôt, sans aucun e-mail

    Plan du Scénario: Paul s'inscrit avec l'adresse « <adresse> » et arrive dans l'espace parent sans recevoir d'e-mail
      Étant donné qu'aucun parent n'utilise l'adresse "<adresse>"
      Et que Paul n'est pas connecté sur la tablette
      Quand Paul s'inscrit avec "<adresse>", le mot de passe du parent "Abcdefg%" et la confirmation "Abcdefg%"
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent, sans aucun profil enfant
      Et aucun e-mail n'est envoyé

      Exemples:
        | adresse                    | cas                   |
        | paul@exemple.test          | adresse de test       |
        | paul.savanturier@gmail.com | vraie adresse (Gmail) |

    Scénario: Juste après l'inscription, Noisette invite Paul à créer le premier profil enfant, sans question du contrôle parental
      Étant donné qu'aucun parent n'utilise l'adresse "paul@exemple.test"
      Quand Paul s'inscrit avec "paul@exemple.test", le mot de passe du parent "Abcdefg%" et la confirmation "Abcdefg%"
      Alors il voit l'espace parent
      Et aucune question du contrôle parental n'est posée
      Et Noisette dit « Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. »

    Scénario: La confirmation différente du mot de passe du parent est refusée
      Étant donné qu'aucun parent n'utilise l'adresse "paul@exemple.test"
      Quand Paul s'inscrit avec "paul@exemple.test", le mot de passe du parent "Abcdefg%" et la confirmation "Abcdefg!"
      Alors Paul est informé que les deux mots de passe ne sont pas pareils
      Et il n'est pas connecté
      Et il peut corriger la confirmation

    Scénario: Une adresse déjà utilisée par un parent est refusée, et on propose de se connecter
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que personne n'est connecté sur la tablette
      Quand quelqu'un s'inscrit avec "paul@exemple.test", le mot de passe du parent "Zyxwvut!" et la confirmation "Zyxwvut!"
      Alors il est informé que cette adresse e-mail est déjà utilisée
      Et on lui propose de se connecter
      Et il n'est pas connecté

    Plan du Scénario: À l'inscription, l'adresse « <adresse> » est refusée
      Étant donné que Paul n'est pas connecté sur la tablette
      Quand Paul s'inscrit avec "<adresse>", le mot de passe du parent "Abcdefg%" et la confirmation "Abcdefg%"
      Alors Paul est informé que l'adresse e-mail n'est pas valide
      Et il n'est pas connecté

      Exemples:
        | adresse      | cas                |
        |              | vide               |
        | paul         | sans @             |
        | paul@exemple | domaine sans point |

  Règle: Le mot de passe du parent respecte 4 règles, affichées pendant la saisie, et chacune passe au vert dès qu'elle est respectée

    Scénario: Avant toute saisie, les 4 règles sont affichées, avec la liste des caractères spéciaux acceptés
      Étant donné que Paul n'est pas connecté sur la tablette
      Quand Paul commence son inscription
      Alors il voit les règles « 8 caractères », « une majuscule », « une minuscule » et « un caractère spécial », toutes à faire
      Et la règle « un caractère spécial » montre les caractères acceptés « & # { } ( ) [ ] $ € % @ ! ? »

    Plan du Scénario: En tapant « <saisie> » (<cas>), seules les règles respectées passent au vert
      Étant donné que Paul a commencé son inscription
      Quand Paul tape le mot de passe du parent "<saisie>"
      Alors la règle « 8 caractères » est <huit>
      Et la règle « une majuscule » est <majuscule>
      Et la règle « une minuscule » est <minuscule>
      Et la règle « un caractère spécial » est <special>

      Exemples:
        | saisie   | cas                                    | huit     | majuscule | minuscule | special  |
        | abcdefgh | 8 minuscules                           | au vert  | à faire   | au vert   | à faire  |
        | Abcdefgù | ù est une minuscule, pas un spécial    | au vert  | au vert   | au vert   | à faire  |
        | Abcde%g  | 7 caractères                           | à faire  | au vert   | au vert   | au vert  |
        | ABCDEFG% | sans minuscule                         | au vert  | au vert   | à faire   | au vert  |
        | Abcdefg% | les 4 règles                           | au vert  | au vert   | au vert   | au vert  |

    Plan du Scénario: Avec le caractère spécial « <special> », les 4 règles sont au vert et l'inscription réussit
      Étant donné qu'aucun parent n'utilise l'adresse "paul@exemple.test"
      Quand Paul s'inscrit avec "paul@exemple.test", le mot de passe du parent "Abcdefg<special>" et la confirmation "Abcdefg<special>"
      Alors les 4 règles du mot de passe sont au vert
      Et Paul est connecté sur la tablette

      Exemples:
        | special |
        | %       |
        | @       |
        | !       |
        | ?       |
        | €       |

    Plan du Scénario: Le mot de passe du parent « <saisie> » est refusé, et le message dit qu'il manque <manque>
      Étant donné qu'aucun parent n'utilise l'adresse "paul@exemple.test"
      Quand Paul s'inscrit avec "paul@exemple.test", le mot de passe du parent "<saisie>" et la confirmation "<saisie>"
      Alors Paul est informé qu'il manque <manque>
      Et il n'est pas connecté

      Exemples:
        | saisie   | manque                                        |
        | Abcde%g  | « 8 caractères »                              |
        | abcdefg% | « une majuscule »                             |
        | ABCDEFG% | « une minuscule »                             |
        | Abcdefgù | « un caractère spécial »                      |
        | abcdefgh | « une majuscule » et « un caractère spécial » |

  Règle: Le parent se connecte avec son adresse e-mail et son mot de passe du parent ; aucun lien de connexion n'est proposé dans la beta

    Scénario: L'écran de connexion demande l'adresse e-mail et le mot de passe du parent, sans proposer de lien de connexion
      Étant donné que personne n'est connecté sur la tablette
      Quand j'ouvre Savanturier
      Alors je suis invité à me connecter avec mon adresse e-mail et mon mot de passe du parent
      Et on me propose aussi de m'inscrire et de réinitialiser mon mot de passe du parent
      Mais « Recevoir un lien de connexion » n'est pas proposé
      Et la saisie d'un code de connexion n'est pas proposée

    Scénario: Paul se connecte avec son adresse et son mot de passe du parent, et l'espace parent s'ouvre sans question du contrôle parental
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul n'est pas connecté sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent
      Et aucune question du contrôle parental n'est posée
      Et aucun e-mail n'est envoyé

    Scénario: Paul se déconnecte, puis se reconnecte avec son mot de passe du parent
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul s'est déconnecté de Savanturier sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent

    Scénario: Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul n'est pas connecté sur la tablette
      Quand Paul se connecte avec "  Paul@Exemple.TEST  " et le mot de passe du parent "Abcdefg%"
      Alors Paul est connecté sur la tablette
      Et il est reconnu comme le parent "paul@exemple.test"

    Plan du Scénario: Avec <cas>, la connexion est refusée sans dire si l'adresse existe
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul n'est pas connecté sur la tablette
      Quand Paul se connecte avec "<adresse>" et le mot de passe du parent "<mot de passe>"
      Alors Paul est informé « Adresse e-mail ou mot de passe incorrect »
      Et il n'est pas connecté
      Et il peut réessayer de se connecter

      Exemples:
        | adresse              | mot de passe | cas                                   |
        | paul@exemple.test    | Abcdefg!     | un mauvais mot de passe du parent     |
        | paul@exemple.test    | abcdefg%     | une seule lettre de casse différente  |
        | inconnu@exemple.test | Abcdefg%     | une adresse qu'aucun parent n'utilise |

    Scénario: Après un mauvais mot de passe du parent, Paul se connecte avec le bon
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul s'est trompé de mot de passe du parent sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors Paul est connecté sur la tablette

    Scénario: Un mot de passe du parent vide est refusé avant toute vérification
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul n'est pas connecté sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent ""
      Alors Paul est informé que le mot de passe du parent est obligatoire
      Et il n'est pas connecté

    @acces
    Scénario: Un parent connecté par mot de passe du parent ne voit jamais les profils enfants d'une autre famille
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Claire est inscrite avec "claire@exemple.test" et le mot de passe du parent "Claire#ok"
      Quand Claire se connecte avec "claire@exemple.test" et le mot de passe du parent "Claire#ok"
      Alors elle voit l'espace parent, sans aucun profil enfant
      Et Claire ne voit pas le profil enfant de Léa

  Règle: Le parent qui a oublié son mot de passe du parent le réinitialise avec le prénom d'un enfant qui lui est rattaché (beta seulement), sans que rien ne révèle l'adresse ni le prénom attendu

    Plan du Scénario: Paul réinitialise son mot de passe du parent avec le prénom « <prénom saisi> » et il est connecté
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul n'est pas connecté sur la tablette
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "<prénom saisi>" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent
      Et aucun e-mail n'est envoyé

      Exemples:
        | prénom saisi | cas                  |
        | Léa          | prénom exact         |
        | lea          | sans accent ni casse |
        | LÉA          | en majuscules        |

    Scénario: Les espaces autour du prénom saisi sont ignorés
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "  Léa  " et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est connecté sur la tablette

    Scénario: Le prénom de n'importe lequel de ses enfants suffit
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul est rattaché au profil enfant "Tom" de niveau CM1
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Tom" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est connecté sur la tablette

    Scénario: Après la réinitialisation, l'ancien mot de passe du parent ne marche plus
      Étant donné que Paul a réinitialisé le mot de passe du parent de "paul@exemple.test" de "Abcdefg%" en "Noisette#"
      Et que Paul s'est déconnecté de Savanturier sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors Paul est informé « Adresse e-mail ou mot de passe incorrect »
      Et il n'est pas connecté

    Scénario: Après la réinitialisation, Paul se reconnecte avec son nouveau mot de passe du parent
      Étant donné que Paul a réinitialisé le mot de passe du parent de "paul@exemple.test" de "Abcdefg%" en "Noisette#"
      Et que Paul s'est déconnecté de Savanturier sur la tablette
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Noisette#"
      Alors Paul est connecté sur la tablette

    Plan du Scénario: Le nouveau mot de passe du parent « <saisie> » est refusé, et le message dit qu'il manque <manque>
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "<saisie>"
      Alors Paul est informé qu'il manque <manque>
      Et il n'est pas connecté

      Exemples:
        | saisie    | manque                                        |
        | noisette  | « une majuscule » et « un caractère spécial » |
        | Noisetteù | « un caractère spécial »                      |

    Scénario: Au choix du nouveau mot de passe du parent, la liste des règles passe au vert pendant la saisie
      Étant donné que Paul a commencé la réinitialisation de son mot de passe du parent
      Quand Paul tape le nouveau mot de passe du parent "abcdefgh"
      Alors la règle « 8 caractères » est au vert
      Et la règle « une minuscule » est au vert
      Et les règles « une majuscule » et « un caractère spécial » sont à faire

    Plan du Scénario: Avec <cas>, le même message s'affiche et le prénom attendu n'est jamais dit
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Quand quelqu'un réinitialise le mot de passe du parent de "<adresse>" avec le prénom "<prénom>" et le nouveau mot de passe du parent "Noisette#"
      Alors il est informé « Ces informations ne correspondent pas. »
      Mais le prénom « Léa » n'apparaît nulle part
      Et il n'est pas connecté

      Exemples:
        | adresse              | prénom | cas                                         |
        | paul@exemple.test    | Tom    | un prénom qui n'est celui d'aucun enfant    |
        | paul@exemple.test    | Léane  | un prénom plus long                         |
        | paul@exemple.test    | Lé     | un début de prénom                          |
        | inconnu@exemple.test | Léa    | une adresse qu'aucun parent n'utilise       |

    Scénario: Un parent sans aucun profil enfant ne peut pas réinitialiser son mot de passe du parent ainsi
      Étant donné que Claire est inscrite avec "claire@exemple.test" et le mot de passe du parent "Claire#ok"
      Et que Claire n'a aucun profil enfant
      Quand Claire réinitialise le mot de passe du parent de "claire@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors Claire est informée « Ces informations ne correspondent pas. »
      Et elle n'est pas connectée

    Scénario: Après un essai de réinitialisation raté, l'ancien mot de passe du parent marche toujours
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul a raté 1 essai de réinitialisation pour "paul@exemple.test"
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors Paul est connecté sur la tablette

    @acces
    Scénario: Claire ne peut pas réinitialiser le mot de passe du parent de Paul avec le prénom de son propre enfant
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Claire est rattachée au profil enfant "Tom" de niveau CM2
      Quand Claire réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Tom" et le nouveau mot de passe du parent "Noisette#"
      Alors Claire est informée « Ces informations ne correspondent pas. »
      Et elle n'est pas connectée
      Et le mot de passe du parent "Abcdefg%" de Paul marche toujours

    @acces
    Scénario: Claire ne peut pas réinitialiser son propre mot de passe du parent avec le prénom d'un enfant de Paul
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Claire est rattachée au profil enfant "Tom" de niveau CM2
      Quand Claire réinitialise le mot de passe du parent de "claire@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors Claire est informée « Ces informations ne correspondent pas. »
      Et elle n'est pas connectée

    @acces @depend-de-13
    Scénario: Un second parent réinitialise son mot de passe du parent avec le prénom d'un enfant auquel il est rattaché
      Étant donné que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Marie est rattachée au profil enfant de Léa
      Et que Marie est inscrite avec "marie@exemple.test" et le mot de passe du parent "Marie#ok"
      Quand Marie réinitialise le mot de passe du parent de "marie@exemple.test" avec le prénom "lea" et le nouveau mot de passe du parent "Noisette#"
      Alors Marie est connectée sur la tablette
      Et elle voit le profil enfant de Léa dans l'espace parent

  Règle: Après 5 essais de réinitialisation ratés pour une même adresse, la réinitialisation est bloquée une heure, même avec un prénom juste

    Scénario: Au 6ᵉ essai de réinitialisation, même le bon prénom est refusé
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul a raté 5 essais de réinitialisation pour "paul@exemple.test"
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est informé « Trop d'essais. Réessaie dans une heure. »
      Et il n'est pas connecté

    Scénario: Après 4 essais de réinitialisation ratés, le bon prénom marche encore
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul a raté 4 essais de réinitialisation pour "paul@exemple.test"
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est connecté sur la tablette

    Scénario: Le 5ᵉ essai de réinitialisation raté bloque aussitôt la réinitialisation
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul a raté 4 essais de réinitialisation pour "paul@exemple.test"
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Tom" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est informé « Trop d'essais. Réessaie dans une heure. »
      Et il n'est pas connecté

    Scénario: Une adresse qu'aucun parent n'utilise est bloquée de la même façon
      Étant donné qu'aucun parent n'utilise l'adresse "inconnu@exemple.test"
      Et que quelqu'un a raté 5 essais de réinitialisation pour "inconnu@exemple.test"
      Quand quelqu'un réinitialise le mot de passe du parent de "inconnu@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors il est informé « Trop d'essais. Réessaie dans une heure. »

    Scénario: 59 minutes après le 5ᵉ essai de réinitialisation raté, la réinitialisation est encore bloquée
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul a raté 5 essais de réinitialisation pour "paul@exemple.test", le dernier il y a 59 minutes
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est informé « Trop d'essais. Réessaie dans une heure. »

    Scénario: 61 minutes après le 5ᵉ essai de réinitialisation raté, la réinitialisation est rouverte
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul a raté 5 essais de réinitialisation pour "paul@exemple.test", le dernier il y a 61 minutes
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est connecté sur la tablette

    Scénario: Une réinitialisation réussie remet à zéro les essais de réinitialisation ratés
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul est rattaché au profil enfant "Léa" de niveau CE1
      Et que Paul a raté 4 essais de réinitialisation, puis réinitialisé son mot de passe du parent, puis raté encore 4 essais de réinitialisation pour "paul@exemple.test"
      Quand Paul réinitialise le mot de passe du parent de "paul@exemple.test" avec le prénom "Léa" et le nouveau mot de passe du parent "Noisette#"
      Alors Paul est connecté sur la tablette

    @acces
    Scénario: Le blocage de l'adresse de Paul ne bloque pas la réinitialisation de Claire
      Étant donné que Paul a raté 5 essais de réinitialisation pour "paul@exemple.test"
      Et que Claire est inscrite avec "claire@exemple.test" et le mot de passe du parent "Claire#ok"
      Et que Claire est rattachée au profil enfant "Tom" de niveau CM2
      Quand Claire réinitialise le mot de passe du parent de "claire@exemple.test" avec le prénom "Tom" et le nouveau mot de passe du parent "Noisette#"
      Alors Claire est connectée sur la tablette

    @a-valider
    Scénario: Pendant le blocage de la réinitialisation, Paul peut encore se connecter avec son mot de passe du parent
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul a raté 5 essais de réinitialisation pour "paul@exemple.test"
      Quand Paul se connecte avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors Paul est connecté sur la tablette

  Règle: Se connecter, s'inscrire et réinitialiser son mot de passe du parent se font sur un écran de 360 px, au clavier, et le mot de passe saisi peut être affiché

    Plan du Scénario: L'écran « <écran> » tient dans un écran de 360 px, avec des cibles d'au moins 44 px
      Étant donné que l'écran de l'appareil mesure 360 px de large
      Et que personne n'est connecté sur la tablette
      Quand j'ouvre l'écran « <écran> »
      Alors la page tient dans la largeur de l'écran
      Et chaque champ et chaque bouton mesure au moins 44 px de haut

      Exemples:
        | écran               |
        | Se connecter        |
        | Créer ton compte    |
        | Mot de passe oublié |

    Scénario: Paul se connecte au clavier seulement
      Étant donné que Paul est inscrit avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Et que Paul n'est pas connecté sur la tablette
      Quand Paul se connecte au clavier seulement avec "paul@exemple.test" et le mot de passe du parent "Abcdefg%"
      Alors Paul est connecté sur la tablette
      Et il voit l'espace parent

    Scénario: Le mot de passe du parent saisi est masqué tant que Paul ne demande pas à l'afficher
      Étant donné que Paul n'est pas connecté sur la tablette
      Quand Paul tape le mot de passe du parent "Abcdefg%" pour se connecter
      Alors le mot de passe du parent saisi est masqué
      Et « Afficher le mot de passe » est proposé

    Scénario: Paul affiche le mot de passe du parent qu'il vient de saisir
      Étant donné que Paul a tapé le mot de passe du parent "Abcdefg%" pour se connecter
      Quand Paul demande à afficher le mot de passe
      Alors il voit « Abcdefg% » en clair

    Scénario: Une règle respectée se reconnaît sans la couleur et elle est annoncée au lecteur d'écran
      Étant donné que Paul a commencé son inscription
      Quand Paul tape le mot de passe du parent "abcdefgh"
      Alors la règle « 8 caractères » est marquée d'une coche et d'un texte qui la dit respectée
      Et le lecteur d'écran annonce que la règle « 8 caractères » est respectée
