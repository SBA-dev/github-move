# Critères d'acceptance : issue #14, Supprimer un profil enfant et toutes ses données, et les exporter

Scénarios : `features/14-suppression-et-export.feature` (tags `@issue-14 @wip`).
Modèle du domaine : `docs/stories/14/domain-model.md` (contexte **Famille**, story transverse).

## Objectif

En tant que **parent**, je veux **exporter les données du profil** de mon enfant, puis pouvoir **supprimer ce profil** et tout ce qui le concerne, afin de garder la maîtrise des données de mon enfant (CLAUDE.md, RGPD : « le parent peut exporter et supprimer toutes les données d'un profil »).

Comportement actuel (`app/`, `adultProfils`) : onglet « Profils », « Supprimer ce profil », puis un second toucher sur « Confirmer : supprimer Léa et sa progression ». Suppression immédiate et définitive. Pas d'export. Ces points donnent les premiers exemples (confirmation en deux temps, suppression définitive). Les écarts voulus (export, effacement sur tous les appareils et dans Storage) viennent de l'issue.

Vocabulaire : les scénarios disent **suppression du profil**, **export des données du profil**, **profil enfant**, **parent rattaché**, **réglages**, **lien d'invitation**, **« Qui joue ? »**, **espace parent** (glossaire). Ils n'emploient pas « progression » (question n°7 du modèle) ni « détacher » (question n°1 du modèle).

## Périmètre au lot 2, et stories suivantes

Au lot 2, les seules données d'un profil enfant sont celles de Famille : **le profil, ses réglages, ses rattachements et ses invitations** (#11 à #13). Les scénarios ne couvrent que celles-là.

**Chaque story future qui ajoute une donnée de l'enfant** (séances, réponses, étoiles, test de départ, révisions, série, badges, cabane, devoirs, mots de la semaine, enregistrements de lecture dans Storage, etc.) **ajoute cette donnée à l'export et à la suppression**, avec ses propres scénarios dans ce fichier ou dans le sien : « l'export de Léa contient ses étoiles », « après la suppression, l'enregistrement de lecture de Léa ne s'écoute plus ». Le reviewer le vérifie (port `DonneesPersonnellesDuProfil` du modèle).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Rien n'est supprimé sans la confirmation du parent | Paul supprime le profil enfant de Léa après avoir confirmé · Avant de confirmer, Paul est prévenu que la suppression est définitive (`@a-valider`, modèle n°3 et n°6) · Avant de confirmer, Paul se voit proposer d'exporter les données de Léa (`@a-valider`, question 1) · Sans confirmation, rien n'est supprimé (Paul renonce, Paul quitte l'espace parent) · Sans réseau, la suppression n'est pas faite et Paul en est informé (`@a-valider`, question 2) |
| 2 | Après la suppression, plus rien du profil n'existe, sur aucun appareil | Léa disparaît de « Qui joue ? » sur les autres appareils de Paul · Le profil enfant de Léa ne revient pas sur la tablette, même sans réseau · Un nouveau profil du même prénom ne retrouve rien de l'ancien · Le lien d'invitation d'un profil supprimé ne marche plus |
| 3 | Supprimer un profil ne touche ni le parent, ni ses autres profils enfants | Tom garde son profil et ses réglages quand Paul supprime celui de Léa · Paul reste connecté après avoir supprimé un profil · Après la suppression de son seul profil enfant, Paul retrouve un espace parent vide (`@a-valider`, question 3) |
| 4 | Quand deux parents suivent un profil, sa suppression vaut pour les deux (à valider) | Paul supprime le profil enfant de Léa, que Marie suit aussi (`@a-valider`, modèle n°1) · Avant de confirmer, Paul est prévenu que l'autre parent ne verra plus Léa (`@a-valider`, modèle n°1) |
| 5 | L'export contient tout ce que l'application garde sur le profil, et rien sur d'autres enfants | Paul exporte les données de Léa dans un fichier lisible · L'export indique les parents rattachés à Léa (`@a-valider`, modèle n°5) · L'export indique l'invitation en attente pour Léa, sans son lien d'invitation (`@a-valider`, question 4) · L'export de Léa ne contient rien sur Tom · Marie, second parent rattaché, exporte aussi les données de Léa |
| 6 | Seul un parent rattaché, depuis l'espace parent, peut supprimer ou exporter un profil | Claire, d'une autre famille, ne peut pas supprimer le profil enfant de Léa (`@acces`) · Claire, d'une autre famille, ne peut pas exporter les données de Léa (`@acces`) · Sans connexion du parent, personne ne peut supprimer / exporter (`@acces`) · En dehors de l'espace parent, ni la suppression ni l'export ne sont proposés (`@acces`) |

Total : 6 règles, 23 scénarios (25 cas exécutés avec les exemples des deux plans).

Étapes reprises des autres stories : « Paul est rattaché au profil enfant de Léa », « Paul est dans l'espace parent », « Paul quitte l'espace parent », « Paul crée le profil enfant "Léa" de niveau CE1 dans l'univers « Danse » », « Léa choisit son profil enfant dans « Qui joue ? » », « Claire est informée que ce profil enfant est introuvable » (#11) ; « Paul a créé un lien d'invitation pour Léa », « Marie est rattachée au profil enfant de Léa », « Marie ouvre le lien d'invitation », « Marie est informée que cette invitation ne marche plus » (#13) ; « Paul est connecté sur la tablette et sur le téléphone », « Paul est toujours connecté sur la tablette », « il voit l'espace parent, sans aucun profil enfant », « personne n'est connecté sur la tablette » (#5) ; « le réseau est coupé », « Savanturier a été fermé sur la tablette », « j'ouvre Savanturier » (#8, #0).

Droits d'accès (`@acces`) : un parent d'une autre famille ne peut ni supprimer ni exporter le profil de Léa, et ne sait même pas qu'il existe (même réponse que dans #11) ; sans connexion du parent, rien n'est possible ; l'enfant, hors de l'espace parent, ne se voit proposer ni la suppression ni l'export. Ces scénarios vérifient la policy de suppression de `profils_enfants` et les policies de lecture utilisées par l'export.

Données de test : prénoms fictifs, adresses en `@exemple.test`. Le contenu du fichier exporté est lu par le test après téléchargement.

## Hors périmètre

- Les données de l'enfant des lots suivants (Apprentissage, Motivation, Accompagnement, Storage) : chaque story les ajoute à l'export et à la suppression (voir plus haut).
- La suppression du compte du parent et de son adresse e-mail (question n°4 du modèle) : aucun scénario tant qu'elle n'est pas tranchée.
- Le retrait d'un parent d'un profil (« détacher », `RetirerUnParent`, #13) : ce n'est pas une suppression.
- Un délai de récupération après la suppression (question n°3 du modèle) : les scénarios supposent une suppression immédiate et définitive, comme aujourd'hui.
- Les copies de sauvegarde de l'hébergeur (question n°8 du modèle).
- L'export de tous les profils d'un parent en une fois (question n°10 du modèle).
- Le sort des résultats faits hors ligne pour un profil supprimé ailleurs (question n°11 du modèle) : il n'y en a pas avant le lot 7.
- Le format exact du fichier (question n°2 du modèle) : les scénarios disent « un fichier lisible ».

## Questions ouvertes

Les questions n°1 à n°11 du modèle (`docs/stories/14/domain-model.md`) restent ouvertes ; elles ne sont pas répétées ici. Les scénarios qui en dépendent sont marqués `@a-valider` (voir le tableau). Questions nouvelles :

1. L'export est-il **proposé au moment de la suppression**, avant la confirmation (oui), ou seulement disponible à part dans l'espace parent (non) ? Scénario `@a-valider` « Avant de confirmer, Paul se voit proposer d'exporter les données de Léa ».
2. **Sans réseau**, la suppression est-elle refusée avec un message (oui), ou mise en attente et faite à la prochaine connexion (non) ? Même question pour l'export. Scénario `@a-valider` « Sans réseau, la suppression n'est pas faite et Paul en est informé ».
3. Après la suppression du **dernier profil** de Paul, où arrive-t-il : dans l'espace parent vide (oui), ou directement sur la création d'un profil enfant, comme à la première connexion (#11, non) ? Scénario `@a-valider`.
4. L'export d'une **invitation en attente** contient-il seulement son état et sa date, sans le lien d'invitation ni le jeton d'invitation (oui) ? Scénario `@a-valider`.
5. Si un **enfant joue** sur le téléphone au moment où son profil est supprimé depuis la tablette, que voit-il : retour immédiat à « Qui joue ? » (oui), ou à la prochaine ouverture seulement (non) ? Aucun scénario écrit.
6. **Textes exacts** vus par le parent : confirmation (« Confirmer : supprimer Léa et sa progression » ou autre, modèle n°6), message après la suppression, avertissement à deux parents, échec sans réseau. Les scénarios ne décrivent que le sens.
7. **Nom du fichier** exporté (par exemple « savanturier-lea-2026-10-22 ») et indication de sa date dans le fichier : à fixer avec le format (modèle n°2).
