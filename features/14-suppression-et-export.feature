# language: fr
@issue-14 @wip
Fonctionnalité: Supprimer un profil enfant et toutes ses données, et les exporter
  En tant que parent
  Je veux exporter les données du profil de mon enfant, puis pouvoir supprimer ce profil et tout ce qui le concerne
  Afin de garder la maîtrise des données de mon enfant

  Règle: Rien n'est supprimé sans la confirmation du parent

    Scénario: Paul supprime le profil enfant de Léa après avoir confirmé
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Et que Paul a demandé la suppression du profil enfant de Léa
      Quand Paul confirme la suppression du profil enfant de Léa
      Alors Paul est informé que le profil enfant de Léa a été supprimé
      Et le profil enfant de Léa n'apparaît plus dans « Qui joue ? »

    @a-valider
    Scénario: Avant de confirmer, Paul est prévenu que la suppression est définitive
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Quand Paul demande la suppression du profil enfant de Léa
      Alors Paul est invité à confirmer la suppression du profil enfant de Léa
      Et il est prévenu que tout ce qui concerne Léa sera effacé définitivement
      Mais le profil enfant de Léa apparaît toujours dans « Qui joue ? »

    @a-valider
    Scénario: Avant de confirmer, Paul se voit proposer d'exporter les données de Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Quand Paul demande la suppression du profil enfant de Léa
      Alors Paul se voit proposer d'exporter d'abord les données du profil enfant de Léa

    Plan du Scénario: Sans confirmation, rien n'est supprimé (<cas>)
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Et que Paul a demandé la suppression du profil enfant de Léa
      Quand Paul <geste>
      Alors le profil enfant de Léa apparaît toujours dans « Qui joue ? »
      Et les réglages de Léa n'ont pas changé

      Exemples:
        | cas                         | geste                                            |
        | Paul renonce                | renonce à la suppression du profil enfant de Léa |
        | Paul quitte l'espace parent | quitte l'espace parent                           |

    @a-valider
    Scénario: Sans réseau, la suppression n'est pas faite et Paul en est informé
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul a demandé la suppression du profil enfant de Léa
      Et que le réseau est coupé
      Quand Paul confirme la suppression du profil enfant de Léa
      Alors Paul est informé que la suppression n'a pas pu être faite sans réseau
      Et le profil enfant de Léa apparaît toujours dans « Qui joue ? »

  Règle: Après la suppression, plus rien du profil n'existe, sur aucun appareil

    Scénario: Léa disparaît de « Qui joue ? » sur les autres appareils de Paul
      Étant donné que Paul est connecté sur la tablette et sur le téléphone
      Et que Paul est rattaché au profil enfant de Léa
      Et que Paul a supprimé le profil enfant de Léa depuis la tablette
      Quand Paul ouvre « Qui joue ? » sur le téléphone
      Alors le profil enfant de Léa n'apparaît plus dans « Qui joue ? » sur le téléphone

    Scénario: Le profil enfant de Léa ne revient pas sur la tablette, même sans réseau
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Paul a supprimé le profil enfant de Léa depuis la tablette
      Et que Savanturier a été fermé sur la tablette
      Et que le réseau est coupé
      Quand j'ouvre Savanturier
      Alors le profil enfant de Léa n'apparaît plus dans « Qui joue ? »

    Scénario: Un nouveau profil du même prénom ne retrouve rien de l'ancien
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que le mode dys est activé pour Léa
      Et que Paul a supprimé le profil enfant de Léa
      Quand Paul crée le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Alors le mode dys n'est pas activé pour le nouveau profil enfant de Léa

    Scénario: Le lien d'invitation d'un profil supprimé ne marche plus
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Paul a supprimé le profil enfant de Léa
      Et que Marie est connectée sur le téléphone
      Quand Marie ouvre le lien d'invitation
      Alors Marie est informée que cette invitation ne marche plus
      Et Marie ne voit pas le profil enfant de Léa

  Règle: Supprimer un profil ne touche ni le parent, ni ses autres profils enfants

    Scénario: Tom garde son profil et ses réglages quand Paul supprime celui de Léa
      Étant donné que Paul est rattaché aux profils enfants de Léa et de Tom
      Et que le mode dys est activé pour Tom
      Quand Paul supprime le profil enfant de Léa, en confirmant
      Alors le profil enfant de Tom apparaît toujours dans « Qui joue ? »
      Et le mode dys est toujours activé pour Tom

    Scénario: Paul reste connecté après avoir supprimé un profil
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est rattaché aux profils enfants de Léa et de Tom
      Quand Paul supprime le profil enfant de Léa, en confirmant
      Alors Paul est toujours connecté sur la tablette
      Et il voit l'espace parent

    @a-valider
    Scénario: Après la suppression de son seul profil enfant, Paul retrouve un espace parent vide
      Étant donné que Paul est connecté sur la tablette
      Et que Paul n'est rattaché qu'au profil enfant de Léa
      Quand Paul supprime le profil enfant de Léa, en confirmant
      Alors Paul est toujours connecté sur la tablette
      Et il voit l'espace parent, sans aucun profil enfant

  Règle: Quand deux parents suivent un profil, sa suppression vaut pour les deux (à valider)

    @a-valider
    Scénario: Paul supprime le profil enfant de Léa, que Marie suit aussi
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Marie est rattachée au profil enfant de Léa
      Et que Marie est connectée sur le téléphone
      Quand Paul supprime le profil enfant de Léa, en confirmant
      Alors Marie ne voit plus le profil enfant de Léa sur le téléphone

    @a-valider
    Scénario: Avant de confirmer, Paul est prévenu que l'autre parent ne verra plus Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Marie est rattachée au profil enfant de Léa
      Et que Paul est dans l'espace parent
      Quand Paul demande la suppression du profil enfant de Léa
      Alors Paul est prévenu que l'autre parent rattaché ne verra plus non plus le profil enfant de Léa

  Règle: L'export contient tout ce que l'application garde sur le profil, et rien sur d'autres enfants

    Scénario: Paul exporte les données de Léa dans un fichier lisible
      Étant donné que Paul a créé le profil enfant "Léa" de niveau CE1 dans l'univers « Danse »
      Et que le mode dys est activé pour Léa
      Et que Paul est dans l'espace parent
      Quand Paul exporte les données du profil enfant de Léa
      Alors Paul télécharge un fichier lisible qui contient le prénom, le niveau, l'univers et les réglages de Léa
      Et le profil enfant de Léa apparaît toujours dans « Qui joue ? »

    @a-valider
    Scénario: L'export indique les parents rattachés à Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Marie est rattachée au profil enfant de Léa
      Quand Paul exporte les données du profil enfant de Léa
      Alors le fichier téléchargé indique que Léa est suivie par deux parents, avec la date de chaque rattachement
      Mais il ne contient pas l'adresse e-mail de Marie

    @a-valider
    Scénario: L'export indique l'invitation en attente pour Léa, sans son lien d'invitation
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Quand Paul exporte les données du profil enfant de Léa
      Alors le fichier téléchargé indique une invitation en attente, avec sa date
      Mais il ne contient pas le lien d'invitation

    Scénario: L'export de Léa ne contient rien sur Tom
      Étant donné que Paul est rattaché aux profils enfants de Léa et de Tom
      Quand Paul exporte les données du profil enfant de Léa
      Alors le fichier téléchargé ne contient ni le prénom ni les réglages de Tom

    Scénario: Marie, second parent rattaché, exporte aussi les données de Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Marie est rattachée au profil enfant de Léa
      Et que Marie est dans l'espace parent
      Quand Marie exporte les données du profil enfant de Léa
      Alors Marie télécharge un fichier lisible qui contient le prénom, le niveau, l'univers et les réglages de Léa

  Règle: Seul un parent rattaché, depuis l'espace parent, peut supprimer ou exporter un profil

    @acces
    Scénario: Claire, d'une autre famille, ne peut pas supprimer le profil enfant de Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Claire est connectée sur la tablette
      Quand Claire tente de supprimer le profil enfant de Léa
      Alors Claire est informée que ce profil enfant est introuvable
      Et Paul voit toujours le profil enfant de Léa

    @acces
    Scénario: Claire, d'une autre famille, ne peut pas exporter les données de Léa
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que Claire est connectée sur la tablette
      Quand Claire tente d'exporter les données du profil enfant de Léa
      Alors Claire est informée que ce profil enfant est introuvable
      Et Claire ne reçoit aucune donnée de Léa

    @acces
    Plan du Scénario: Sans connexion du parent, personne ne peut <action>
      Étant donné que Paul est rattaché au profil enfant de Léa
      Et que personne n'est connecté sur la tablette
      Quand quelqu'un tente de <action>
      Alors <refus>
      Et Paul voit toujours le profil enfant de Léa

      Exemples:
        | action                                       | refus                      |
        | supprimer le profil enfant de Léa            | la suppression est refusée |
        | exporter les données du profil enfant de Léa | l'export est refusé        |

    @acces
    Scénario: En dehors de l'espace parent, ni la suppression ni l'export ne sont proposés
      Étant donné que Paul est connecté sur la tablette
      Et que Paul est rattaché au profil enfant de Léa
      Quand Léa choisit son profil enfant dans « Qui joue ? »
      Alors ni la suppression ni l'export du profil ne sont proposés à Léa
