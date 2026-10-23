# Critères d'acceptance : issue #5, Connexion du parent par lien magique

Scénarios : `features/5-connexion-du-parent.feature` (tags `@issue-5 @wip`).
Modèle du domaine : `docs/stories/5/domain-model.md` (contexte **Famille**).

## Objectif

En tant que **parent**, je veux me connecter avec un **lien de connexion** reçu par e-mail (« lien magique » dans l'interface), ou avec le **code de connexion** à 6 chiffres du même e-mail, afin de retrouver les profils de mes enfants et leur progression sur tous mes appareils, sans mot de passe à retenir.

Comportement actuel (`app/`, `Store.init()`) : pas d'écran de connexion, l'identité vient du compte claude.ai ; sans identité, tout reste dans le navigateur ; à la première connexion, les données de l'appareil sont reprises ; pas de déconnexion. La cible change ces points (décisions de démarrage n°5 et n°7, décisions n°2 et n°5 à n°8 du lot 1) : connexion obligatoire, lien et code de connexion, déconnexion depuis l'espace parent. Les exemples viennent donc de l'issue et du modèle, pas du legacy.

Vocabulaire : les scénarios disent **lien de connexion**, **code de connexion**, **connexion du parent**, **déconnexion**, **appareil** (termes `(à valider)` du glossaire). Ils n'emploient ni « compte », ni « session », ni « lien » seul.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Le parent se connecte en suivant le lien de connexion reçu à son adresse e-mail | Paul demande un lien de connexion et le reçoit par e-mail avec un code de connexion · Paul arrive dans l'espace parent en suivant le lien de connexion · Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu · Une adresse jamais vue devient un nouveau parent dès son premier lien de connexion · Sans connexion, Savanturier invite d'abord le parent à se connecter |
| 2 | Le parent peut aussi se connecter en saisissant le code de connexion sur l'appareil qui a fait la demande | Paul saisit sur la tablette le code de connexion reçu · Un code de connexion faux est refusé (`@a-valider`, question 3) · Refuser le code de connexion « <code> », qui n'a pas 6 chiffres (vide, 5 chiffres, 7 chiffres, une lettre) |
| 3 | Une adresse e-mail mal formée est refusée avant tout envoi | Refuser l'adresse « <adresse> » (vide, sans @, rien avant le @, pas de domaine, domaine sans point, deux @, espace) · Paul corrige son adresse après un refus |
| 4 | Un lien de connexion et un code de connexion valent une heure et servent une seule fois | Un lien de connexion déjà utilisé est refusé · Un lien de connexion expire au bout d'une heure · Un lien de connexion est encore valable juste avant la fin de sa durée · Un code de connexion expire au bout d'une heure (`@a-valider`, question 3) · Un code de connexion est encore valable juste avant la fin de sa durée · Après un lien refusé, Paul se connecte avec un nouveau lien |
| 5 | La connexion du parent reste ouverte sur l'appareil jusqu'à la déconnexion | La connexion reste ouverte après la fermeture et la réouverture de Savanturier · Paul peut être connecté sur deux appareils à la fois |
| 6 | La déconnexion se fait depuis l'espace parent, et plus aucune donnée de la famille n'est visible ensuite sur l'appareil | Paul se déconnecte depuis l'espace parent · En dehors de l'espace parent, la déconnexion n'est pas proposée (`@acces`) · Après la déconnexion, la réouverture de Savanturier ne montre aucune donnée de la famille (`@acces`) · Se déconnecter sur la tablette ne ferme pas la connexion du téléphone (`@acces`) |
| 7 | Seul un parent connecté accède aux données de sa famille | Un visiteur non connecté ne voit aucune donnée de famille (`@acces`) · Un parent connecté ne voit jamais les profils enfants d'une autre famille (`@acces`) |

Total : 7 règles, 24 scénarios (33 cas exécutés avec les 4 exemples du code de connexion et les 7 exemples de l'adresse).

Étapes réutilisées : « j'ouvre Savanturier », « je vois le nom de l'application » (`features/0-socle.feature`), « Paul s'est déconnecté de Savanturier sur la tablette » et « aucun profil enfant de la famille de Paul n'est visible » (`features/8-pwa-installable.feature`), « Léa a un profil enfant de niveau CE1 » et « Léa commence à jouer » (`features/6-univers-et-personnage-guide.feature`).

Droits d'accès (`@acces`) : un visiteur non connecté ne voit aucune donnée de famille ; la déconnexion n'est proposée que dans l'espace parent ; après la déconnexion, rien de la famille ne reste sur l'appareil, et les autres appareils restent connectés ; un parent ne voit jamais les profils d'une autre famille (RLS). Le dernier dépend des profils et des rattachements du lot 2 : il reste dans #5 et s'exécute au lot 2. Le contrôle parental qui protège l'espace parent arrive au lot 2 : en attendant, les scénarios de déconnexion partent d'un parent déjà dans l'espace parent.

Données de test : adresses fictives en `@exemple.test`. Les e-mails (lien et code de connexion) sont lus dans la boîte de test locale de Supabase (Inbucket/Mailpit), jamais envoyés à une vraie adresse.

## Hors périmètre

- Le rattachement d'un parent à un profil enfant et l'invitation d'un second parent (lot 2).
- La création des profils enfants, l'écran « Qui joue ? » et le contrôle parental (lot 2). En attendant, les tests partent de profils enfants préparés.
- La reprise des données du legacy (décision de démarrage n°7) : aucune donnée de `app/` n'est importée.
- La connexion par mot de passe ou par un fournisseur tiers (Google, Apple…).
- Le changement d'adresse e-mail du parent, l'export et la suppression de ses données (lot 2).
- Le comportement sans réseau d'une demande de lien de connexion : question n°6 de `docs/stories/8/acceptance.md`.
- La synchronisation des résultats faits hors ligne (lot 7) ; le sort des résultats non synchronisés à la déconnexion est la question ouverte n°7.

## Questions ouvertes

Numérotées comme dans `docs/stories/5/domain-model.md`. Aucune n'est bloquante pour la story.

1. Faut-il conserver quelque chose sur le parent en plus de son identité et de son e-mail (prénom, langue du parent…) ? Sans effet sur les scénarios.
2. **Code de connexion saisi avec des espaces** (« 123 456 ») : l'accepte-t-on comme « 123456 » ? Aucun exemple écrit tant que ce n'est pas décidé.
3. **Un seul message** pour un code de connexion faux, expiré ou déjà utilisé, comme pour le lien (« ce code de connexion ne marche plus ») ? Scénarios `@a-valider` « Un code de connexion faux est refusé » et « Un code de connexion expire au bout d'une heure ».
4. **Lien et code du même e-mail** : quand le parent s'est connecté avec l'un, l'autre est-il aussi épuisé ? Aucun scénario écrit.
5. **Lien suivi sur un autre appareil** (demande sur la tablette, lien touché sur le téléphone) : le téléphone est-il connecté, ou le parent est-il invité à saisir le code de connexion sur la tablette ? Aucun scénario écrit.
6. **Nombre d'essais** du code de connexion : limiter les essais faux (par exemple 5), puis demander un nouvel e-mail ? Le scénario du code faux laisse pour l'instant saisir à nouveau.
7. Déconnexion avec des séances faites hors ligne pas encore synchronisées : prévenir le parent ? À trancher avant le lot 7.
8. Le message de l'accueil (« Les profils et la progression sont enregistrés dans ton compte : tu les retrouves sur tous tes appareils. ») est-il repris tel quel ?
9. **Deux demandes de suite** : le premier lien et le premier code de connexion restent-ils valables jusqu'à leur expiration ? Que voit le parent s'il redemande trop vite (une demande par minute chez Supabase) ?
10. Faut-il aussi « se déconnecter de tous les appareils » (par exemple après la perte d'un téléphone), plutôt au lot 2 ?
11. La déconnexion demande-t-elle une confirmation (« Veux-tu vraiment te déconnecter ? ») ?
12. **Durée de la connexion** : ouverte sans limite tant que l'appareil sert, ou fermée après une longue période sans utilisation ?
13. **Textes exacts** vus par le parent : confirmation d'envoi, adresse refusée, lien qui ne marche plus, code de connexion refusé. Les scénarios ne décrivent que le sens.

## Décisions

Validation n°1 du lot 1 par le PO, le 2026-10-22 (`docs/stories/lot-1-decisions.md`). « Tranchée » = réponse explicite du PO ; « proposition appliquée » = la proposition déjà faite dans les scénarios ou dans ce fichier.

| Ancienne question | Réponse | Source | Effet sur les scénarios |
|---|---|---|---|
| 1. Utiliser Savanturier sans être connecté ? | **Non**, la connexion est obligatoire. | Tranchée, décision n°5 | « Sans connexion, Savanturier invite d'abord le parent à se connecter » : `@a-valider` retiré. |
| 2. L'invitation à se connecter est-elle le premier écran ? | **Oui**. « Qui joue ? » arrive au lot 2. | Tranchée, décision n°2 | Même scénario. |
| 3. Durée du lien de connexion | **1 heure**, usage unique. | Tranchée, décision n°6 | Scénarios 59 et 61 minutes : `@a-valider` retiré. |
| 5. Règle de validité de l'adresse | Les 7 exemples du plan. | Proposition appliquée | Aucun changement. |
| 6. Un ou deux messages (lien expiré, déjà utilisé) | **Un seul** message. | Tranchée, décision n°6 | Aucun changement (déjà « ce lien de connexion ne marche plus »). |
| 8. Une adresse jamais vue crée-t-elle un nouveau parent ? | **Oui**, inscription et connexion confondues. | Proposition appliquée | `@a-valider` retiré. |
| 9. Le mot « compte » | Interdit dans le domaine, permis dans l'interface (« ton compte »). | Proposition appliquée | Aucun (les scénarios ne l'emploient pas). |
| 11. Écran après la connexion | **L'espace parent**. | Tranchée, décision n°2 | Aussi après le code de connexion. |
| 12. Lien ouvert sur un autre appareil | L'e-mail contient aussi un **code de connexion à 6 chiffres**, à saisir sur l'appareil qui a fait la demande. Même durée et même usage unique que le lien. | Tranchée, décision n°7 | Nouvelle règle 2 et deux scénarios du code en règle 4. |
| 14. Confirmation d'envoi neutre | **Sans objet**, puisque toute adresse devient un parent. | Conséquence de la question 8 | Aucun. |
| 15. Plusieurs appareils | **Oui** ; la déconnexion ne ferme que l'appareil où elle est faite. | Proposition appliquée | `@a-valider` retiré des deux scénarios. |
| 16. Qui peut se déconnecter | **Seulement depuis l'espace parent**, protégé par le contrôle parental (lot 2). | Tranchée, décision n°8 | Scénarios de déconnexion partant de l'espace parent ; nouveau scénario `@acces` « En dehors de l'espace parent, la déconnexion n'est pas proposée ». |
| 18. Scénario inter-familles | **Reste dans #5**, exécuté au lot 2. | Proposition appliquée (scénario `@a-valider`) | `@a-valider` retiré. |

Les anciennes questions 4, 7, 10, 13, 17, 19 et la suite des questions 15 et 16 restent ouvertes (questions 1, 7 à 13 ci-dessus).
