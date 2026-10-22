# Critères d'acceptance : issue #5, Connexion du parent par lien magique

Scénarios : `features/5-connexion-du-parent.feature` (tags `@issue-5 @wip`).
Modèle du domaine : `docs/stories/5/domain-model.md` (contexte **Famille**).

## Objectif

En tant que **parent**, je veux me connecter avec un **lien de connexion** reçu par e-mail (« lien magique » dans l'interface), afin de retrouver les profils de mes enfants et leur progression sur tous mes appareils, sans mot de passe à retenir.

Comportement actuel (`app/`, `Store.init()`) : pas d'écran de connexion, l'identité vient du compte claude.ai ; sans identité, tout reste dans le navigateur ; à la première connexion, les données de l'appareil sont reprises ; pas de déconnexion. La cible change ces points (décisions de démarrage n°5 et n°7) : les exemples viennent donc de l'issue et du modèle, pas du legacy. Les écarts non tranchés sont dans les questions ouvertes.

Vocabulaire : les scénarios disent **lien de connexion**, **connexion du parent**, **déconnexion**, **appareil** (termes `(à valider)` du glossaire). Ils n'emploient ni « compte », ni « session », ni « lien » seul.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Le parent se connecte en suivant le lien de connexion reçu à son adresse e-mail | Paul demande un lien de connexion et le reçoit par e-mail · Paul arrive connecté en suivant le lien de connexion · Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu · Une adresse jamais vue devient un nouveau parent dès son premier lien de connexion (`@a-valider`) · Sans connexion, Savanturier invite d'abord le parent à se connecter (`@a-valider`) |
| 2 | Une adresse e-mail mal formée est refusée avant tout envoi | Refuser l'adresse « <adresse> » (vide, sans @, rien avant le @, pas de domaine, domaine sans point, deux @, espace) · Paul corrige son adresse après un refus |
| 3 | Un lien de connexion sert une seule fois et expire | Un lien de connexion déjà utilisé est refusé · Un lien de connexion expire au bout d'une heure (`@a-valider`) · Un lien de connexion est encore valable juste avant la fin de sa durée (`@a-valider`) · Après un lien refusé, Paul se connecte avec un nouveau lien |
| 4 | La connexion du parent reste ouverte sur l'appareil jusqu'à la déconnexion | La connexion reste ouverte après la fermeture et la réouverture de Savanturier · Paul peut être connecté sur deux appareils à la fois (`@a-valider`) |
| 5 | Après la déconnexion, plus aucune donnée de la famille n'est visible sur l'appareil | Paul se déconnecte · Après la déconnexion, la réouverture de Savanturier ne montre aucune donnée de la famille (`@acces`) · Se déconnecter sur la tablette ne ferme pas la connexion du téléphone (`@acces @a-valider`) |
| 6 | Seul un parent connecté accède aux données de sa famille | Un visiteur non connecté ne voit aucune donnée de famille (`@acces`) · Un parent connecté ne voit jamais les profils enfants d'une autre famille (`@acces @a-valider`) |

Total : 6 règles, 18 scénarios (24 cas exécutés avec les 7 exemples du plan).

Étapes réutilisées : « j'ouvre Savanturier », « je vois le nom de l'application » (`features/0-socle.feature`), « Paul s'est déconnecté de Savanturier sur la tablette » et « aucun profil enfant de la famille de Paul n'est visible » (`features/8-pwa-installable.feature`).

Droits d'accès (`@acces`) : un visiteur non connecté ne voit aucune donnée de famille ; après la déconnexion, rien de la famille ne reste sur l'appareil ; un parent ne voit jamais les profils d'une autre famille (RLS). Le dernier dépend des profils et des rattachements du lot 2.

Données de test : adresses fictives en `@exemple.test`. Les e-mails sont lus dans la boîte de test locale de Supabase (Inbucket/Mailpit), jamais envoyés à une vraie adresse.

## Hors périmètre

- Le rattachement d'un parent à un profil enfant et l'invitation d'un second parent (lot 2).
- La création des profils enfants et le contrôle parental (lot 2).
- La reprise des données du legacy (décision n°7) : aucune donnée de `app/` n'est importée.
- La connexion par mot de passe ou par un fournisseur tiers (Google, Apple…).
- Le changement d'adresse e-mail du parent, l'export et la suppression de ses données (lot 2).
- Le comportement sans réseau d'une demande de lien de connexion : question n°6 de `docs/stories/8/acceptance.md`.
- La synchronisation des résultats faits hors ligne (lot 7) ; le sort des résultats non synchronisés à la déconnexion est la question n°4 du modèle.

## Questions ouvertes

Questions du modèle du domaine (`docs/stories/5/domain-model.md`), reprises par numéro. Les questions 1 à 3 de l'issue y sont déjà fusionnées (modèle n°1, n°2, n°3).

1. (modèle n°1, issue n°1) **Sans connexion** : peut-on encore utiliser Savanturier sans être connecté ? Le scénario `@a-valider` « Sans connexion, Savanturier invite d'abord le parent à se connecter » suppose que non.
2. (modèle n°2, issue n°2) **Premier écran** : l'invitation à se connecter est-elle le premier écran, avant « Qui joue aujourd'hui ? » ? Même scénario `@a-valider`.
3. (modèle n°3, issue n°3) **Durée de validité** du lien de connexion : 1 h ? Les scénarios `@a-valider` testent 59 et 61 minutes.
4. (modèle n°4) Déconnexion avec des séances non synchronisées : prévenir le parent ? Aucun scénario tant que ce n'est pas décidé.
5. (modèle n°5) **Règle de validité de l'adresse** : les 7 exemples du plan de la règle 2 sont la proposition. En ajouter ou en retirer ?
6. (modèle n°6) **Un ou deux messages** pour un lien expiré et un lien déjà utilisé ? Les scénarios supposent un seul message (« ce lien de connexion ne marche plus »).
7. (modèle n°7) Données conservées sur le parent en plus de l'e-mail : sans effet sur les scénarios.
8. (modèle n°8) **Inscription et connexion confondues** : une adresse jamais vue crée-t-elle un nouveau parent ? Scénario `@a-valider` « Une adresse jamais vue devient un nouveau parent… ».
9. (modèle n°9) Le mot « compte » dans l'interface : sans effet sur les scénarios, qui ne l'emploient pas.
10. (modèle n°10) Message de l'accueil sur l'endroit où sont enregistrées les données : aucun scénario tant que ce n'est pas décidé. S'il est repris, seule la version « dans ton compte » a encore un sens si la réponse à la question 1 est non.

Nouvelles questions :

11. **Écran après la connexion** : en suivant le lien de connexion, le parent arrive-t-il dans l'espace parent (proposition des scénarios « il voit l'espace parent ») ou sur « Qui joue aujourd'hui ? » ?
12. **Lien ouvert sur un autre appareil** : si Paul demande le lien sur la tablette mais l'ouvre depuis son téléphone (où il lit ses e-mails), quel appareil est connecté ? Le téléphone, la tablette, ou le lien est-il refusé ? Point d'attention : par défaut, Supabase Auth (PKCE) ne connecte que le navigateur qui a fait la demande. C'est un cas fréquent avec une tablette d'enfant. Aucun scénario écrit.
13. **Deux demandes de suite** : quand Paul demande un second lien de connexion, le premier reste-t-il valable jusqu'à son expiration ? Et que voit-il s'il redemande trop vite (Supabase limite à une demande par minute par défaut) ? Aucun scénario écrit.
14. **Confirmation d'envoi neutre** : le message « un lien de connexion a été envoyé à … » doit-il être le même que l'adresse soit connue ou non (pour ne pas révéler qui utilise Savanturier) ? Sans objet si la réponse à la question 8 est oui.
15. **Plusieurs appareils** : un parent peut-il être connecté sur plusieurs appareils à la fois, et la déconnexion ne ferme-t-elle que l'appareil où elle est faite ? Scénarios `@a-valider` des règles 4 et 5. Faut-il aussi « se déconnecter de tous les appareils » (par exemple après la perte d'un téléphone) ?
16. **Qui peut se déconnecter** : la déconnexion se fait-elle seulement depuis l'espace parent, protégée par le contrôle parental (lot 2), pour qu'un enfant ne déconnecte pas l'appareil par erreur ? Demande-t-elle une confirmation ?
17. **Durée de la connexion** : reste-t-elle ouverte sans limite tant que l'appareil sert, ou se ferme-t-elle après une longue période sans utilisation (par exemple plusieurs semaines) ?
18. **Scénario inter-familles** : « Un parent connecté ne voit jamais les profils enfants d'une autre famille » (`@acces @a-valider`) ne peut s'exécuter qu'avec les profils et les rattachements du lot 2. Le garde-t-on dans #5, exécuté au lot 2, ou le déplace-t-on dans la story de rattachement ?
19. **Textes des messages** : quels sont les textes exacts vus par le parent pour la confirmation d'envoi, l'adresse refusée et le lien qui ne marche plus ? Les scénarios ne décrivent que le sens.

## Décisions

Aucune pour l'instant.
