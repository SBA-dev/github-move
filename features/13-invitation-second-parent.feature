# language: fr
@issue-13 @wip
Fonctionnalité: Inviter un second parent à se rattacher à un profil enfant
  En tant que parent
  Je veux inviter l'autre parent de mon enfant par un lien d'invitation que je lui communique moi-même
  Afin qu'il suive lui aussi la progression de l'enfant et règle son profil en se connectant avec sa propre adresse e-mail

  Contexte:
    Étant donné que Léa a un profil enfant de niveau CE1
    Et que Paul est rattaché au profil enfant de Léa

  Règle: Un parent rattaché crée un lien d'invitation pour un profil enfant et le communique lui-même

    Scénario: Paul crée un lien d'invitation pour Léa
      Étant donné que Paul est dans l'espace parent sur la tablette
      Quand Paul invite l'autre parent de Léa
      Alors Paul voit un lien d'invitation pour Léa
      Et il peut copier ou partager ce lien d'invitation
      Et aucun e-mail n'est envoyé

    Scénario: Paul voit que l'invitation de Léa est en attente et jusqu'à quand elle vaut
      Étant donné que Paul a créé un lien d'invitation pour Léa il y a 2 jours
      Et que Paul est connecté sur la tablette
      Quand Paul ouvre l'espace parent
      Alors Paul voit qu'une invitation pour Léa est en attente
      Et il voit qu'elle vaut encore 5 jours
      Mais il ne peut pas revoir le lien d'invitation

    Scénario: Une nouvelle invitation remplace celle qui était en attente
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Paul est dans l'espace parent sur la tablette
      Quand Paul invite à nouveau l'autre parent de Léa
      Alors Paul voit un nouveau lien d'invitation pour Léa
      Et il voit une seule invitation pour Léa en attente

    Scénario: Paul annule l'invitation de Léa encore en attente
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Paul est dans l'espace parent sur la tablette
      Quand Paul annule l'invitation de Léa
      Alors Paul ne voit plus d'invitation en attente pour Léa

    Scénario: Sans réseau, Paul ne peut pas inviter et en est informé
      Étant donné que Paul est dans l'espace parent sur la tablette
      Et que le réseau est coupé
      Quand Paul invite l'autre parent de Léa
      Alors Paul voit le message « Il faut être connecté à Internet pour inviter l'autre parent. »
      Et il ne voit aucun lien d'invitation pour Léa

    @acces
    Scénario: Un parent qui n'est pas rattaché à Léa ne peut pas inviter pour elle
      Étant donné que Claire est connectée sur la tablette
      Et que Claire n'est rattachée à aucun profil enfant
      Quand Claire tente d'inviter un parent pour Léa
      Alors l'invitation est refusée
      Et Claire ne voit pas le profil enfant de Léa

  Règle: Le parent invité qui accepte l'invitation est rattaché au profil enfant et le suit depuis ses propres appareils

    Scénario: Marie, déjà connectée, accepte l'invitation et voit Léa
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Marie est connectée sur le téléphone
      Quand Marie accepte l'invitation de Léa
      Alors Marie voit le profil enfant de Léa
      Et le profil enfant de Léa apparaît dans « Qui joue ? » sur le téléphone

    @envoi-email @hors-beta
    Scénario: L'invitation attend que Marie se soit connectée
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Marie n'est pas connectée sur le téléphone
      Et que Marie a ouvert le lien d'invitation, puis demandé un lien de connexion pour "marie@exemple.test" sur le téléphone
      Quand Marie suit le lien de connexion reçu
      Alors Marie est connectée sur le téléphone
      Et Marie voit l'invitation à suivre Léa

    Scénario: Une adresse jamais vue devient le second parent de Léa
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et qu'aucun parent n'utilise l'adresse "marie@exemple.test"
      Et que Marie s'est connectée avec "marie@exemple.test" après avoir ouvert le lien d'invitation
      Quand Marie accepte l'invitation de Léa
      Alors Marie voit le profil enfant de Léa

    Scénario: Marie accepte l'invitation dans le navigateur et retrouve Léa dans l'application installée
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Marie est connectée dans l'application installée sur le téléphone
      Et que Marie a ouvert le lien d'invitation dans le navigateur du téléphone, où elle est aussi connectée
      Quand Marie accepte l'invitation de Léa
      Alors le profil enfant de Léa apparaît dans « Qui joue ? » dans l'application installée sur le téléphone

    Scénario: Marie règle le profil de Léa et Paul retrouve ce réglage
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que le réglage « mode dys » de Léa est sur « non »
      Quand Marie règle « mode dys » sur « oui » pour Léa
      Alors les réglages de Léa indiquent « mode dys » : « oui » pour Paul sur la tablette

  Règle: Une invitation ne vaut que pour un seul profil enfant

    @acces
    Scénario: Marie ne voit pas les autres enfants de Paul
      Étant donné que Tom a un profil enfant de niveau CM1
      Et que Paul est rattaché au profil enfant de Tom
      Et que Marie est rattachée au profil enfant de Léa
      Quand Marie ouvre l'espace parent
      Alors Marie voit le profil enfant de Léa
      Mais Marie ne voit pas le profil enfant de Tom

    @acces
    Scénario: Paul ne voit pas les autres enfants de Marie
      Étant donné que Hugo a un profil enfant de niveau CP
      Et que Marie est rattachée au profil enfant de Hugo
      Et que Marie est rattachée au profil enfant de Léa
      Quand Paul ouvre l'espace parent
      Alors Paul voit le profil enfant de Léa
      Mais Paul ne voit pas le profil enfant de Hugo

    @acces
    Scénario: Deux parents rattachés ne voient pas l'adresse e-mail l'un de l'autre
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Paul est dans l'espace parent sur la tablette
      Quand Paul ouvre la fiche du profil enfant de Léa
      Alors Paul voit que Léa est suivie par deux parents
      Mais il ne voit pas l'adresse e-mail de Marie

    Scénario: Pour suivre aussi Tom, Marie accepte une invitation faite pour Tom
      Étant donné que Tom a un profil enfant de niveau CM1
      Et que Paul est rattaché au profil enfant de Tom
      Et que Marie est rattachée au profil enfant de Léa
      Et que Paul a créé un lien d'invitation pour Tom
      Quand Marie accepte l'invitation de Tom
      Alors Marie voit les profils enfants de Léa et de Tom

  Règle: Un profil enfant a au plus deux parents, et un parent n'y est rattaché qu'une fois

    Scénario: Paul ne peut plus inviter quand Léa a déjà deux parents
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Paul est dans l'espace parent sur la tablette
      Quand Paul invite l'autre parent de Léa
      Alors Paul voit le message « Léa est déjà suivie par deux parents. »
      Et il ne voit aucun lien d'invitation pour Léa

    @acces
    Scénario: Un troisième parent ne peut pas se rattacher à Léa
      Étant donné que Marie est rattachée au profil enfant de Léa
      Et que Claire a en main le lien d'invitation que Marie a utilisé
      Et que Claire est connectée sur l'ordinateur
      Quand Claire ouvre ce lien d'invitation
      Alors Claire voit le message « Cette invitation ne marche plus : demande un nouveau lien d'invitation à l'autre parent. »
      Et Claire ne voit pas le profil enfant de Léa

    Scénario: Paul qui ouvre sa propre invitation n'est pas rattaché une seconde fois
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Paul est connecté sur la tablette
      Quand Paul ouvre le lien d'invitation
      Alors Paul voit le message « Tu suis déjà Léa. »
      Et il voit toujours qu'une invitation pour Léa est en attente

  Règle: Une invitation expirée, annulée ou inconnue ne rattache personne

    Scénario: Une invitation expire au bout de 7 jours
      Étant donné que Paul a créé un lien d'invitation pour Léa il y a 7 jours et 1 heure
      Et que Marie est connectée sur le téléphone
      Quand Marie ouvre le lien d'invitation
      Alors Marie voit le message « Cette invitation ne marche plus : demande un nouveau lien d'invitation à l'autre parent. »
      Et Marie ne voit pas le profil enfant de Léa

    Scénario: Une invitation est encore valable juste avant la fin de sa durée
      Étant donné que Paul a créé un lien d'invitation pour Léa il y a 6 jours et 23 heures
      Et que Marie est connectée sur le téléphone
      Quand Marie accepte l'invitation de Léa
      Alors Marie voit le profil enfant de Léa

    Scénario: Une invitation annulée ne rattache personne
      Étant donné que Paul a créé puis annulé un lien d'invitation pour Léa
      Et que Marie est connectée sur le téléphone
      Quand Marie ouvre ce lien d'invitation
      Alors Marie voit le message « Cette invitation ne marche plus : demande un nouveau lien d'invitation à l'autre parent. »
      Et Marie ne voit pas le profil enfant de Léa

    Scénario: Un lien d'invitation inconnu reçoit le même message
      Étant donné que Marie est connectée sur le téléphone
      Quand Marie ouvre un lien d'invitation dont le jeton d'invitation a été modifié
      Alors Marie voit le message « Cette invitation ne marche plus : demande un nouveau lien d'invitation à l'autre parent. »
      Et Marie ne voit pas le profil enfant de Léa

    Scénario: Après une invitation expirée, Marie accepte le nouveau lien d'invitation de Paul
      Étant donné que l'invitation de Léa a expiré sans être acceptée
      Et que Paul a créé un nouveau lien d'invitation pour Léa
      Et que Marie est connectée sur le téléphone
      Quand Marie accepte la nouvelle invitation de Léa
      Alors Marie voit le profil enfant de Léa

  Règle: Tant que l'invitation n'est pas acceptée, le parent invité n'accède pas au profil enfant

    @acces
    Scénario: Un visiteur non connecté qui ouvre le lien d'invitation ne voit rien de Léa
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que personne n'est connecté sur le téléphone
      Quand j'ouvre le lien d'invitation sur le téléphone
      Alors je suis invité à me connecter avec mon adresse e-mail
      Mais je ne vois pas le prénom de Léa
      Et je ne vois pas le profil enfant de Léa

    @acces
    Scénario: Marie qui a ouvert l'invitation sans l'accepter ne voit pas encore Léa
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Marie est connectée sur le téléphone
      Quand Marie ouvre le lien d'invitation
      Alors Marie voit l'invitation à suivre Léa
      Et elle peut accepter ou refuser l'invitation
      Mais Marie ne voit pas encore le profil enfant de Léa

    @acces
    Scénario: Avant d'accepter, l'invitation ne montre que le prénom de Léa
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Marie est connectée sur le téléphone
      Quand Marie ouvre le lien d'invitation
      Alors Marie voit « Invitation à suivre Léa »
      Mais elle ne voit ni le niveau de Léa, ni ses réglages, ni l'adresse e-mail de Paul

    @acces
    Scénario: Marie refuse l'invitation et n'est pas rattachée à Léa
      Étant donné que Paul a créé un lien d'invitation pour Léa
      Et que Marie a ouvert le lien d'invitation sur le téléphone
      Quand Marie refuse l'invitation de Léa
      Alors Marie ne voit pas le profil enfant de Léa
      Et Paul voit toujours qu'une invitation pour Léa est en attente
