# Critères d'acceptance : issue #13, Inviter un second parent à se rattacher à un profil enfant

Scénarios : `features/13-invitation-second-parent.feature` (tags `@issue-13 @wip`).
Modèle du domaine : `docs/stories/13/domain-model.md` (contexte **Famille**).

## Objectif

En tant que **parent**, je veux inviter l'autre parent de mon enfant par un **lien d'invitation** que je lui communique moi-même (message, e-mail…), afin qu'il suive lui aussi la progression de l'enfant et règle son profil en se connectant avec sa propre adresse e-mail.

Comportement actuel (`app/`) : aucun. Un seul compte claude.ai voit les profils. Les exemples viennent donc de l'issue, de la décision de démarrage n°5, de la décision n°8 du glossaire et du modèle du domaine.

Vocabulaire : les scénarios disent **invitation**, **lien d'invitation**, **jeton d'invitation**, **rattaché**, **profil enfant**, **espace parent**, **« Qui joue ? »** (termes `(à valider)` du glossaire). Ils n'emploient ni « lien » seul, ni « code », ni « partage » au sens d'un synonyme d'invitation. « Partager ce lien d'invitation » désigne seulement le partage de l'appareil (message, e-mail), pas un concept du domaine.

Personnages : Paul, premier parent de Léa (CE1) et de Tom (CM1) ; Marie, parent invitée, qui a aussi Hugo (CP) ; Claire, parent d'une autre famille. Adresses fictives en `@exemple.test`. Paul est sur la tablette, Marie sur le téléphone, Claire sur l'ordinateur ou la tablette.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Un parent rattaché crée un lien d'invitation pour un profil enfant et le communique lui-même | Paul crée un lien d'invitation pour Léa · Paul voit que l'invitation de Léa est en attente et jusqu'à quand elle vaut (`@a-valider`, nouvelle question 3) · Une nouvelle invitation remplace celle qui était en attente (`@a-valider`, modèle n°5) · Paul annule l'invitation de Léa encore en attente (`@a-valider`, modèle n°4) · Un parent qui n'est pas rattaché à Léa ne peut pas inviter pour elle (`@acces`) |
| 2 | Le parent invité qui accepte l'invitation est rattaché au profil enfant et le suit depuis ses propres appareils | Marie, déjà connectée, accepte l'invitation et voit Léa · L'invitation attend que Marie se soit connectée (`@a-valider`, modèle n°6) · Une adresse jamais vue devient le second parent de Léa · Marie règle le profil de Léa et Paul retrouve ce réglage |
| 3 | Une invitation ne vaut que pour un seul profil enfant | Marie ne voit pas les autres enfants de Paul (`@acces`) · Paul ne voit pas les autres enfants de Marie (`@acces @a-valider`, modèle n°7) · Pour suivre aussi Tom, Marie accepte une invitation faite pour Tom (`@a-valider`, modèle n°11) |
| 4 | Un profil enfant a au plus deux parents, et un parent n'y est rattaché qu'une fois | Paul ne peut plus inviter quand Léa a déjà deux parents · Un troisième parent ne peut pas se rattacher à Léa (`@acces`) · Paul qui ouvre sa propre invitation n'est pas rattaché une seconde fois (`@a-valider`, modèle n°13) |
| 5 | Une invitation expirée, annulée ou inconnue ne rattache personne | Une invitation expire au bout de 7 jours (`@a-valider`, modèle n°2 et n°3) · Une invitation est encore valable juste avant la fin de sa durée (`@a-valider`, modèle n°2) · Une invitation annulée ne rattache personne (`@a-valider`, modèle n°4) · Un lien d'invitation inconnu reçoit le même message (`@a-valider`, modèle n°3) · Après une invitation expirée, Marie accepte le nouveau lien d'invitation de Paul |
| 6 | Tant que l'invitation n'est pas acceptée, le parent invité n'accède pas au profil enfant | Un visiteur non connecté qui ouvre le lien d'invitation ne voit rien de Léa (`@acces @a-valider`, nouvelle question 1) · Marie qui a ouvert l'invitation sans l'accepter ne voit pas encore Léa (`@acces @a-valider`, modèle n°6) · Marie refuse l'invitation et n'est pas rattachée à Léa (`@acces @a-valider`, nouvelle question 4) |

Total : 6 règles, 23 scénarios (dont 7 `@acces` et 14 `@a-valider`).

Le `Contexte` commun pose Léa (profil enfant de CE1) et Paul, rattaché à son profil.

Le cas « invitation déjà utilisée » est le scénario du troisième parent (règle 4) : avec une seule invitation en attente à la fin, c'est la seule façon réaliste pour un troisième adulte d'avoir un lien d'invitation en main.

Étapes réutilisées : « Paul est rattaché au profil enfant de Léa », « Claire est connectée sur la tablette », « Claire ne voit pas le profil enfant de Léa », « Paul est connecté sur la tablette », « je suis invité à me connecter avec mon adresse e-mail », « Marie suit le lien de connexion reçu » et « aucun parent n'utilise l'adresse … » (`features/5-connexion-du-parent.feature`) ; « Léa a un profil enfant de niveau CE1 » (`features/6-univers-et-personnage-guide.feature`) ; « Marie est connectée sur le téléphone », « le profil enfant de Léa apparaît dans « Qui joue ? » » (`features/11-profil-enfant.feature`, `features/14-suppression-et-export.feature`) ; « le réglage « mode dys » de Léa est sur « non » » et la forme de « … règle « mode dys » sur « oui » pour Léa » et « les réglages de Léa indiquent « mode dys » : « oui » » (`features/12-reglages.feature`).

Droits d'accès (`@acces`) : un parent non rattaché ne peut pas inviter ; Marie ne voit que Léa, pas Tom ; Paul ne voit pas Hugo (si la proposition du modèle n°7 est confirmée) ; un troisième parent est refusé ; un visiteur non connecté ne voit rien de Léa ; avant d'avoir accepté, ou après avoir refusé, Marie ne voit pas Léa. Ces scénarios vérifient les policies RLS de `invitations` et `rattachements` et le chemin d'acceptation côté serveur (question technique T4 du modèle).

## Hors périmètre

- Les droits respectifs des deux parents (suppression du profil, retrait de l'autre parent, retrait de soi) : question n°1 et n°4 du modèle. Seuls l'annulation d'une invitation et le réglage du profil par le second parent sont illustrés ici.
- La suppression et l'export d'un profil suivi par deux parents (#14).
- L'envoi d'un e-mail ou d'une notification par l'application : elle n'envoie rien, le parent communique le lien d'invitation lui-même.
- Le fait de prévenir Paul quand Marie a accepté (question n°9 du modèle) et l'affichage de l'adresse e-mail de l'autre parent (question n°10 du modèle).
- Une invitation réservée à une adresse e-mail (question n°12 du modèle) : le lien d'invitation est un porteur.
- La synchronisation hors ligne (lot 7).

## Questions ouvertes

Les questions n°1 à n°13 du modèle (`docs/stories/13/domain-model.md`) restent ouvertes et ne sont pas répétées. Les scénarios `@a-valider` indiquent ci-dessus la question du modèle dont ils dépendent. Questions nouvelles, apparues en écrivant les exemples :

1. **Ce que montre le lien d'invitation avant la connexion** : un visiteur non connecté voit-il seulement « Connecte-toi pour accepter l'invitation », sans le prénom de l'enfant (oui, proposition : le lien d'invitation est un porteur, il ne doit rien révéler sans connexion), ou voit-il déjà « Invitation à suivre Léa » (non) ?
2. **Comment l'invitation désigne le parent qui invite** : le parent n'a qu'une adresse e-mail, pas de prénom. L'invitation montre-t-elle seulement le prénom de l'enfant (« Invitation à suivre Léa ») (oui), ou aussi l'adresse e-mail du parent qui invite (non) ? Lié à la question n°10 du modèle, mais vue ici par un parent **pas encore** rattaché.
3. **Invitation en attente dans l'espace parent** : Paul voit-il qu'une invitation pour Léa est en attente et combien de jours elle vaut encore (oui) ? Peut-il revoir le lien d'invitation après l'avoir fermé (non : le jeton n'est montré qu'une fois, il en crée un nouveau) ?
4. **Refus de l'invitation** : si le parent invité doit confirmer (modèle n°6), peut-il refuser (oui) ? Un refus laisse-t-il l'invitation en attente pour un autre essai (oui, proposition du scénario), ou l'annule-t-il (non) ?
5. **Où se crée l'invitation** : depuis l'espace parent, donc derrière le contrôle parental (oui), et depuis la fiche du profil enfant (oui) ?
6. **Messages exacts** : « Léa est déjà suivie par deux parents. » quand Paul tente d'inviter (oui / autre) ; « Tu suis déjà Léa. » (modèle n°13) ; « Cette invitation ne marche plus : demande un nouveau lien d'invitation à l'autre parent. » (modèle n°3).
7. **Hors ligne** : créer ou accepter une invitation demande le réseau (oui). Quel message si le réseau est coupé (« Il faut être connecté à Internet pour inviter l'autre parent. ») ?
8. **Ouverture du lien d'invitation dans l'application installée** : si Savanturier est installé (#8), le lien d'invitation peut s'ouvrir dans le navigateur plutôt que dans l'application. Faut-il que l'invitation y soit retrouvée après la connexion (oui), ou suffit-il qu'elle soit acceptée dans le navigateur, le profil apparaissant ensuite partout (oui, proposition) ?
