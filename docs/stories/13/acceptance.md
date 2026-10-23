# Critères d'acceptance : issue #13, Inviter un second parent à se rattacher à un profil enfant

Scénarios : `features/13-invitation-second-parent.feature` (tags `@issue-13 @wip`).
Modèle du domaine : `docs/stories/13/domain-model.md` (contexte **Famille**).

## Objectif

En tant que **parent**, je veux inviter l'autre parent de mon enfant par un **lien d'invitation** que je lui communique moi-même (message, e-mail…), afin qu'il suive lui aussi la progression de l'enfant et règle son profil en se connectant avec sa propre adresse e-mail.

Comportement actuel (`app/`) : aucun. Un seul compte claude.ai voit les profils. Les exemples viennent donc de l'issue, de la décision de démarrage n°5, de la décision n°8 du glossaire et du modèle du domaine.

Vocabulaire : les scénarios disent **invitation**, **lien d'invitation**, **jeton d'invitation**, **rattaché**, **profil enfant**, **espace parent**, **« Qui joue ? »** (lien d'invitation, jeton d'invitation et parent invité restent `(à valider)` au glossaire). Ils n'emploient ni « lien » seul, ni « code », ni « partage » au sens d'un synonyme d'invitation. « Partager ce lien d'invitation » désigne seulement le partage de l'appareil (message, e-mail), pas un concept du domaine.

Personnages : Paul, premier parent de Léa (CE1) et de Tom (CM1) ; Marie, parent invitée, qui a aussi Hugo (CP) ; Claire, parent d'une autre famille. Adresses fictives en `@exemple.test`. Paul est sur la tablette, Marie sur le téléphone, Claire sur l'ordinateur ou la tablette.

## Règles

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`, décisions n°1 à n°3 ; décision `docs/decisions/0009-ecritures-famille-par-edge-functions.md`, points 3 et 3 bis). Plus aucun scénario n'est `@a-valider`.

| # | Règle | Scénarios |
|---|---|---|
| 1 | Un parent rattaché crée un lien d'invitation pour un profil enfant et le communique lui-même | Paul crée un lien d'invitation pour Léa · Paul voit que l'invitation de Léa est en attente et jusqu'à quand elle vaut · Une nouvelle invitation remplace celle qui était en attente · Paul annule l'invitation de Léa encore en attente · Sans réseau, Paul ne peut pas inviter et en est informé · Un parent qui n'est pas rattaché à Léa ne peut pas inviter pour elle (`@acces`) |
| 2 | Le parent invité qui accepte l'invitation est rattaché au profil enfant et le suit depuis ses propres appareils | Marie, déjà connectée, accepte l'invitation et voit Léa · L'invitation attend que Marie se soit connectée · Une adresse jamais vue devient le second parent de Léa · Marie accepte l'invitation dans le navigateur et retrouve Léa dans l'application installée · Marie règle le profil de Léa et Paul retrouve ce réglage |
| 3 | Une invitation ne vaut que pour un seul profil enfant | Marie ne voit pas les autres enfants de Paul (`@acces`) · Paul ne voit pas les autres enfants de Marie (`@acces`) · Deux parents rattachés ne voient pas l'adresse e-mail l'un de l'autre (`@acces`) · Pour suivre aussi Tom, Marie accepte une invitation faite pour Tom |
| 4 | Un profil enfant a au plus deux parents, et un parent n'y est rattaché qu'une fois | Paul ne peut plus inviter quand Léa a déjà deux parents · Un troisième parent ne peut pas se rattacher à Léa (`@acces`) · Paul qui ouvre sa propre invitation n'est pas rattaché une seconde fois |
| 5 | Une invitation expirée, annulée ou inconnue ne rattache personne | Une invitation expire au bout de 7 jours · Une invitation est encore valable juste avant la fin de sa durée · Une invitation annulée ne rattache personne · Un lien d'invitation inconnu reçoit le même message · Après une invitation expirée, Marie accepte le nouveau lien d'invitation de Paul |
| 6 | Tant que l'invitation n'est pas acceptée, le parent invité n'accède pas au profil enfant | Un visiteur non connecté qui ouvre le lien d'invitation ne voit rien de Léa (`@acces`) · Marie qui a ouvert l'invitation sans l'accepter ne voit pas encore Léa (`@acces`) · Avant d'accepter, l'invitation ne montre que le prénom de Léa (`@acces`) · Marie refuse l'invitation et n'est pas rattachée à Léa (`@acces`) |

Total : 6 règles, 27 scénarios (dont 9 `@acces`, aucun `@a-valider`).

Le `Contexte` commun pose Léa (profil enfant de CE1) et Paul, rattaché à son profil.

Le cas « invitation déjà utilisée » est le scénario du troisième parent (règle 4) : avec une seule invitation en attente à la fin, c'est la seule façon réaliste pour un troisième adulte d'avoir un lien d'invitation en main.

Le lien d'invitation vaut pour quiconque l'a en main (décision n°2) : c'est ce qu'illustre « Une adresse jamais vue devient le second parent de Léa » ; aucun scénario ne compare l'adresse de Marie à une adresse attendue, puisque l'invitation n'en désigne aucune.

Messages vus par l'utilisateur : « Léa est déjà suivie par deux parents. », « Tu suis déjà Léa. », « Cette invitation ne marche plus : demande un nouveau lien d'invitation à l'autre parent. » (le même pour une invitation expirée, annulée, déjà utilisée ou inconnue), « Il faut être connecté à Internet pour inviter l'autre parent. ».

Étapes réutilisées : « Paul est rattaché au profil enfant de Léa », « Claire est connectée sur la tablette », « Claire ne voit pas le profil enfant de Léa », « Paul est connecté sur la tablette », « je suis invité à me connecter avec mon adresse e-mail », « Marie suit le lien de connexion reçu » et « aucun parent n'utilise l'adresse … » (`features/5-connexion-du-parent.feature`) ; « Léa a un profil enfant de niveau CE1 » (`features/6-univers-et-personnage-guide.feature`) ; « Marie est connectée sur le téléphone », « le profil enfant de Léa apparaît dans « Qui joue ? » » (`features/11-profil-enfant.feature`, `features/14-suppression-et-export.feature`) ; « le réseau est coupé », « … voit le message « … » » (`features/10-controle-parental.feature`, `features/15-choix-de-la-voix.feature`) ; « le réglage « mode dys » de Léa est sur « non » » et la forme de « … règle « mode dys » sur « oui » pour Léa » et « les réglages de Léa indiquent « mode dys » : « oui » » (`features/12-reglages.feature`).

Droits d'accès (`@acces`) : un parent non rattaché ne peut pas inviter ; Marie ne voit que Léa, pas Tom ; Paul ne voit pas Hugo ; aucun parent ne voit l'adresse e-mail de l'autre ; un troisième parent est refusé ; un visiteur non connecté ne voit ni le prénom de Léa ni son profil ; après la connexion et avant d'accepter, Marie ne voit que le prénom de Léa et l'état de l'invitation (ni niveau, ni réglages, ni adresse e-mail de Paul) ; après avoir refusé, Marie ne voit pas Léa. Ces scénarios vérifient les policies RLS de `invitations` et `rattachements`, la fonction Postgres d'acceptation (décision 0009, point 3) et la fonction Postgres de lecture de l'invitation (point 3 bis).

## Hors périmètre

- Le retrait de l'autre parent : personne ne peut le faire dans ce lot (décision n°1). Le retrait de soi-même : question ouverte n°1.
- La suppression et l'export d'un profil suivi par deux parents (#14), dont l'absence de l'adresse e-mail de l'autre parent dans l'export (décision n°3).
- L'envoi d'un e-mail ou d'une notification par l'application : elle n'envoie rien, le parent communique le lien d'invitation lui-même.
- Le fait de prévenir Paul quand Marie a accepté : question ouverte n°2.
- Le message vu quand le réseau est coupé au moment d'**accepter** une invitation : seul le message pour inviter a été donné.
- La synchronisation hors ligne (lot 7).

## Décisions

| Question | Réponse | Source |
|---|---|---|
| Modèle n°1. Droits des deux parents | Mêmes droits (modifier, régler, inviter, exporter, supprimer). Personne ne retire l'autre parent dans ce lot. | Décision n°1 |
| Modèle n°2. Durée et usage unique | 7 jours, une seule fois. Scénarios « expire au bout de 7 jours », « encore valable juste avant la fin de sa durée ». | Décision n°2 |
| Modèle n°3. Un seul message pour une invitation qui ne marche plus | Oui : « Cette invitation ne marche plus : demande un nouveau lien d'invitation à l'autre parent. » | Proposition appliquée |
| Modèle n°4. Annuler l'invitation | Le parent qui invite peut l'annuler. | Décision n°2 |
| Modèle n°5. Une seule invitation en attente | Oui, une nouvelle remplace l'ancienne. | Décision n°2 |
| Modèle n°6. Confirmation du parent invité | Oui : « Accepter » ou « Refuser ». | Décision n°2 |
| Modèle n°7. Autres enfants invisibles | Oui, dans les deux sens. | Décision n°3 |
| Modèle n°10. Adresse e-mail de l'autre parent | Jamais visible, ni dans l'export. Nouveau scénario « Deux parents rattachés ne voient pas l'adresse e-mail l'un de l'autre ». | Décision n°3 |
| Modèle n°11. Une invitation par enfant | Oui. | Décision n°3 |
| Modèle n°12. Lien porteur | Oui, il vaut pour quiconque l'a en main. | Décision n°2 |
| Modèle n°13. « Tu suis déjà Léa. » | Oui. | Proposition appliquée |
| Ancienne question 1. Page du lien avant la connexion | Elle n'affiche pas le prénom de l'enfant. | Décision n°2 |
| Ancienne question 2. Ce que montre l'invitation après la connexion | Seulement le prénom de l'enfant et l'état de l'invitation (« Invitation à suivre Léa »), sans niveau, réglages ni adresse e-mail. Nouveau scénario « Avant d'accepter, l'invitation ne montre que le prénom de Léa ». | Décision n°3, décision 0009 point 3 bis |
| Ancienne question 3. Invitation en attente dans l'espace parent | Paul voit qu'elle est en attente et jusqu'à quand ; il ne peut pas revoir le lien d'invitation, il en crée un nouveau. | Proposition appliquée |
| Ancienne question 4. Refus | Le parent invité peut refuser ; l'invitation reste en attente. | Décision n°2, proposition appliquée |
| Ancienne question 5. Où se crée l'invitation | Dans l'espace parent, depuis la fiche du profil enfant. | Proposition appliquée |
| Ancienne question 6. Messages exacts | Ceux de la liste ci-dessus. | Proposition appliquée |
| Ancienne question 7. Hors ligne | Inviter demande le réseau : « Il faut être connecté à Internet pour inviter l'autre parent. » Nouveau scénario « Sans réseau, Paul ne peut pas inviter et en est informé ». | Proposition appliquée |
| Ancienne question 8. Lien ouvert hors de l'application installée | Il suffit de l'accepter dans le navigateur ; le profil apparaît ensuite partout. Nouveau scénario « Marie accepte l'invitation dans le navigateur… ». | Proposition appliquée |

## Questions ouvertes

Aucune n'est bloquante pour la story.

1. Un parent peut-il **se retirer lui-même** d'un profil suivi par deux parents (oui / non) ? La décision n°1 exclut seulement le retrait de l'autre parent dans ce lot.
2. Le premier parent est-il **prévenu**, dans l'espace parent, quand l'autre parent a accepté l'invitation (oui / non) ? L'application n'envoie aucun e-mail.
