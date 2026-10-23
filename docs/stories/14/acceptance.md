# Critères d'acceptance : issue #14, Supprimer un profil enfant et toutes ses données, et les exporter

Scénarios : `features/14-suppression-et-export.feature` (tags `@issue-14 @wip`).
Modèle du domaine : `docs/stories/14/domain-model.md` (contexte **Famille**, story transverse).

## Objectif

En tant que **parent**, je veux **exporter les données du profil** de mon enfant, puis pouvoir **supprimer ce profil** et tout ce qui le concerne, afin de garder la maîtrise des données de mon enfant (CLAUDE.md, RGPD : « le parent peut exporter et supprimer toutes les données d'un profil »).

Comportement actuel (`app/`, `adultProfils`) : onglet « Profils », « Supprimer ce profil », puis un second toucher sur « Confirmer : supprimer Léa et sa progression ». Suppression immédiate et définitive. Pas d'export. Ces points donnent les premiers exemples (confirmation en deux temps, suppression définitive) et sont gardés (décision n°9, proposition M6 appliquée). Les écarts voulus (avertissement qui propose l'export, export JSON, effacement sur tous les appareils et dans Storage) viennent de l'issue et de la validation n°1.

Vocabulaire : les scénarios disent **suppression du profil**, **export des données du profil**, **profil enfant**, **parent rattaché**, **réglages**, **lien d'invitation**, **« Qui joue ? »**, **espace parent** (glossaire). Ils n'emploient pas « progression » (mot d'interface, hors glossaire) ni « détacher » (synonyme interdit : la suppression vaut pour les deux parents).

## Périmètre au lot 2, et stories suivantes

Au lot 2, les seules données d'un profil enfant sont celles de Famille : **le profil, ses réglages, ses rattachements et ses invitations** (#11 à #13). Les scénarios ne couvrent que celles-là.

**Chaque story future qui ajoute une donnée de l'enfant** (séances, réponses, étoiles, test de départ, révisions, série, badges, cabane, devoirs, mots de la semaine, enregistrements de lecture dans Storage, etc.) **ajoute cette donnée à l'export et à la suppression**, avec ses propres scénarios dans ce fichier ou dans le sien : « l'export de Léa contient ses étoiles », « après la suppression, l'enregistrement de lecture de Léa ne s'écoute plus ». Le reviewer le vérifie (port `DonneesPersonnellesDuProfil` du modèle).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Rien n'est supprimé sans un avertissement, puis la confirmation du parent | Paul supprime le profil enfant de Léa après avoir confirmé · Avant de confirmer, Paul est prévenu que la suppression est définitive · Avant de confirmer, Paul se voit proposer d'exporter les données de Léa · Paul exporte les données de Léa depuis l'avertissement, et peut encore confirmer · Sans confirmation, rien n'est supprimé (Paul renonce, Paul quitte l'espace parent) · Sans réseau, la suppression n'est pas faite et Paul en est informé |
| 2 | Après la suppression, immédiate et définitive, plus rien du profil n'existe, sur aucun appareil | Léa disparaît de « Qui joue ? » sur les autres appareils de Paul · Léa, qui joue sur le téléphone, revient à « Qui joue ? » dès la suppression de son profil · Le profil enfant de Léa ne revient pas sur la tablette, même sans réseau · Un nouveau profil du même prénom ne retrouve rien de l'ancien · Le lien d'invitation d'un profil supprimé ne marche plus |
| 3 | Supprimer un profil ne touche ni le parent, ni ses autres profils enfants | Tom garde son profil et ses réglages quand Paul supprime celui de Léa · Paul reste connecté après avoir supprimé un profil · Après la suppression de son seul profil enfant, Paul retrouve un espace parent vide |
| 4 | Quand deux parents suivent un profil, chacun peut le supprimer, et la suppression vaut pour les deux | Paul supprime le profil enfant de Léa, que Marie suit aussi · Marie, second parent rattaché, supprime aussi le profil enfant de Léa · Avant de confirmer, Paul est prévenu que l'autre parent ne verra plus Léa |
| 5 | L'export est un fichier JSON lisible qui contient tout ce que l'application garde sur le profil, et rien sur d'autres enfants | Paul exporte les données de Léa dans un fichier JSON lisible · Le fichier exporté porte le prénom de l'enfant et la date du jour · L'export indique les parents rattachés à Léa · L'export indique l'invitation en attente pour Léa, sans son lien d'invitation · L'export de Léa ne contient rien sur Tom · Marie, second parent rattaché, exporte aussi les données de Léa · Sans réseau, l'export n'est pas fait et Paul en est informé |
| 6 | Seul un parent rattaché, depuis l'espace parent, peut supprimer ou exporter un profil | Claire, d'une autre famille, ne peut pas supprimer le profil enfant de Léa (`@acces`) · Claire, d'une autre famille, ne peut pas exporter les données de Léa (`@acces`) · Sans connexion du parent, personne ne peut supprimer / exporter (`@acces`) · En dehors de l'espace parent, ni la suppression ni l'export ne sont proposés (`@acces`) |

Total : 6 règles, 28 scénarios (30 cas exécutés avec les exemples des deux plans). Aucun scénario `@a-valider`.

Étapes reprises des autres stories : « Paul est rattaché au profil enfant de Léa », « Paul est dans l'espace parent », « Paul quitte l'espace parent », « Paul crée le profil enfant "Léa" de niveau CE1 dans l'univers « Danse » », « Léa choisit son profil enfant dans « Qui joue ? » », « Claire est informée que ce profil enfant est introuvable » (#11) ; « Paul a créé un lien d'invitation pour Léa », « Marie est rattachée au profil enfant de Léa », « Marie ouvre le lien d'invitation », « Marie est informée que cette invitation ne marche plus » (#13) ; « Léa joue sur le téléphone » (#12) ; « Paul est connecté sur la tablette et sur le téléphone », « Paul est toujours connecté sur la tablette », « il voit l'espace parent, sans aucun profil enfant », « personne n'est connecté sur la tablette » (#5) ; « le réseau est coupé », « Savanturier a été fermé sur la tablette », « j'ouvre Savanturier » (#8, #0). Étape nouvelle : « nous sommes le 22 octobre 2026 » (date du jour fixée par le test, pour le nom du fichier).

Droits d'accès (`@acces`) : un parent d'une autre famille ne peut ni supprimer ni exporter le profil de Léa, et ne sait même pas qu'il existe (même réponse que dans #11) ; sans connexion du parent, rien n'est possible ; l'enfant, hors de l'espace parent, ne se voit proposer ni la suppression ni l'export. Les deux parents rattachés ont les mêmes droits (décision n°1, règle 4). Ces scénarios vérifient la policy de suppression de `profils_enfants` et les policies de lecture utilisées par l'export.

Données de test : prénoms fictifs, adresses en `@exemple.test`. Le contenu du fichier exporté est lu par le test après téléchargement.

## Hors périmètre

- Les données de l'enfant des lots suivants (Apprentissage, Motivation, Accompagnement, Storage) : chaque story les ajoute à l'export et à la suppression (voir plus haut).
- La suppression du compte du parent et de son adresse e-mail : renvoyée à une story à part (décision n°9).
- Le retrait d'un parent d'un profil (« détacher ») : il n'existe pas dans ce lot (décision n°1) ; ce n'est jamais une suppression.
- Un délai de récupération après la suppression : il n'y en a pas, la suppression est immédiate et définitive (décision n°9).
- Une suppression ou un export mis en attente sans réseau : les deux sont refusés avec un message (décision n°9).
- Les copies de sauvegarde de l'hébergeur (question ouverte n°2).
- L'export de tous les profils d'un parent en une fois (question ouverte n°4).
- Le sort des résultats faits hors ligne pour un profil supprimé ailleurs : jetés sans message à la synchronisation, scénario à écrire au lot 7.

## Décisions

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`). « Tranchée » = réponse explicite du PO ; « proposition appliquée » = la proposition déjà faite est retenue.

| Question | Réponse | Source |
|---|---|---|
| 1. Export proposé au moment de la suppression | **Oui**, dans l'avertissement, avant la confirmation. Scénarios « Avant de confirmer, Paul se voit proposer d'exporter… » et « Paul exporte les données de Léa depuis l'avertissement… ». | Tranchée, décision n°9 |
| 2. Sans réseau | Suppression **refusée avec un message**, rien n'est mis en attente. Même règle pour l'export (scénario ajouté). | Tranchée, décision n°9 (export : proposition appliquée) |
| 3. Après la suppression du dernier profil | Espace parent vide. | Proposition appliquée |
| 4. Invitation en attente dans l'export | Son état et sa date, sans lien ni jeton d'invitation. | Proposition appliquée |
| 5. Enfant qui joue sur un autre appareil | Retour immédiat à « Qui joue ? » (scénario ajouté). | Proposition appliquée |
| 7. Nom et format du fichier | Fichier **JSON lisible**, nommé `savanturier-<prénom>-<date>`, par exemple `savanturier-lea-2026-10-22` (scénario ajouté). | Tranchée, décision n°10 |
| Modèle M1. Profil à deux parents | Chacun peut le supprimer ; il disparaît pour les deux, après un avertissement (scénario « Marie… supprime aussi… » ajouté). | Tranchée, décision n°1 |
| Modèle M3. Délai de récupération | Aucun : suppression immédiate et définitive. | Tranchée, décision n°9 |
| Modèle M4. Compte du parent | Story à part. | Tranchée, décision n°9 |
| Modèle M5. Adresse e-mail de l'autre parent dans l'export | Jamais. | Tranchée, décision n°3 |
| 6 (en partie) / Modèle M6. Texte de confirmation | « Confirmer : supprimer Léa et sa progression », par un second toucher, après l'avertissement. | Proposition appliquée |

## Questions ouvertes

Aucune n'est bloquante ; aucun scénario n'en dépend. Numéros repris de `docs/stories/14/domain-model.md`.

1. L'export contient-il l'**adresse e-mail du parent qui exporte** (oui / non) ? Celle de l'autre parent n'y est jamais.
2. Faut-il **dire au parent** que les copies de sauvegarde de l'hébergeur disparaissent dans un délai (oui / non) ?
3. Garde-t-on une **trace** qu'un profil a été supprimé ou exporté (date, parent), sans aucune donnée de l'enfant (oui / non) ?
4. Faut-il pouvoir **exporter tous les profils** d'un parent en une fois (oui / non) ?
5. **Textes exacts** du message après la suppression, de l'avertissement (définitif, export proposé, « Marie ne verra plus Léa. ») et des refus sans réseau (suppression, export) ? Les scénarios ne décrivent que le sens.
6. « **Avertissement de suppression** » : terme du glossaire (oui), ou simple écran d'interface (non) ?
