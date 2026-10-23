# Critères d'acceptance : issue #8, PWA installable

Scénarios : `features/8-pwa-installable.feature` (tags `@issue-8 @wip`).
Story technique du lot 1 (Socle) : pas de modèle du domaine, aucune règle du domaine pédagogique.

## Objectif

En tant que **parent**, je veux installer Savanturier sur l'écran d'accueil de la tablette ou du téléphone, afin que mon enfant l'ouvre comme une application, en plein écran, même quand le réseau coupe.

Comportement actuel (`app/`) : aucun. L'application est un artifact claude.ai, ouvert par un lien, sans manifeste ni service worker. Les exemples viennent donc de l'issue et de la décision 0001, pas du legacy.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Savanturier peut être installé sur l'écran d'accueil de l'appareil | Le navigateur propose d'installer Savanturier · Savanturier installé s'ouvre en plein écran · L'application laisse au navigateur le soin de proposer l'installation |
| 2 | Sur iPad et iPhone, une aide explique comment ajouter Savanturier à l'écran d'accueil | Sur iPad, Paul trouve comment ajouter Savanturier à l'écran d'accueil · Une fois Savanturier ajouté à l'écran d'accueil de l'iPad, l'aide n'apparaît plus |
| 3 | Après un premier chargement, Savanturier et la bibliothèque restent disponibles sans réseau | Savanturier s'ouvre sans réseau après un premier chargement · La bibliothèque reste disponible sans réseau · Sans réseau, aucune donnée de la famille ne reste visible après la déconnexion (`@acces`) |
| 4 | Une nouvelle version s'applique au lancement suivant, sans jamais recharger un écran en cours d'utilisation | Une nouvelle version publiée n'interrompt pas l'enfant · Une nouvelle version s'applique au lancement suivant · Avec le réseau, la bibliothèque la plus récente est utilisée |
| 5 | Savanturier tient dans la largeur de l'écran, dès 360 px | Savanturier tient dans la largeur d'un écran de <largeur> px (360, 820, 1280) · Savanturier installé tient dans la largeur d'un téléphone |

Total : 5 règles, 13 scénarios (15 cas exécutés avec les exemples du plan).

**Vérification de la bibliothèque sans réseau** : au lot 1, aucun écran n'affiche les leçons, et la page de démonstration réservée aux tests (décision 1 du lot 1) ne montre que la consigne et le personnage guide. Le plus simple est une **vérification technique** : sans réseau, la bibliothèque est servie depuis l'appareil, complète et lisible. Cela évite d'ajouter la bibliothèque à la page de démonstration, retirée au lot 3. À partir du lot 3, la même étape vérifiera qu'une leçon s'ouvre à l'écran.

Étapes réutilisées de `features/0-socle.feature` : « j'ouvre Savanturier », « je vois le nom de l'application », « la page tient dans la largeur de l'écran ».

Droits d'accès : la story ne crée aucune table ni donnée de famille. Le seul scénario `@acces` vérifie que la mise en cache pour le hors réseau ne garde que la coquille et la bibliothèque, jamais les données d'une famille (minimisation RGPD). Il dépend de la déconnexion (issue #5).

## Hors périmètre

- Le **hors ligne complet** : jouer des séances sans réseau, les garder sur l'appareil et les synchroniser (lot 7, « Hors ligne et synchronisation »).
- La reprise d'une séance interrompue : les séances arrivent au lot 3. Ici, la règle 4 vérifie seulement qu'une nouvelle version ne recharge pas l'écran ouvert.
- Le premier lancement sans réseau : sans premier chargement, rien n'est sur l'appareil, et c'est le navigateur qui affiche son propre message.
- La présence dans les stores (décision 0001).
- Les notifications.

## Questions ouvertes

1. **Action qui demande du réseau** : que voit le parent s'il fait sans réseau une action qui en a besoin (par exemple demander un lien de connexion) ? Quel message ? Aucun scénario écrit tant que ce n'est pas décidé.
2. **Aide pour iPad et iPhone** : où s'affiche-t-elle (dès l'ouverture dans Safari, sur l'écran de connexion, ou dans l'espace parent) et pour qui (le parent seulement) ? Le scénario dit seulement que Paul la voit à l'ouverture dans Safari. (La disparition de l'aide une fois Savanturier ajouté à l'écran d'accueil est validée : voir Décisions, n°7.)
3. **Termes techniques** « nouvelle version », « installer », « plein écran », « réseau coupé », « écran d'accueil de l'appareil » : faut-il les ajouter au glossaire ou les laisser hors du langage ubiquitaire ?

## Décisions

Validation n°1 du lot 1 par le PO, le 2026-10-22 (`docs/stories/lot-1-decisions.md`).

1. **Invitation à installer** (décision 11) : pas de bouton « Installer », on laisse faire le navigateur. Une aide pour iPad et iPhone explique comment ajouter Savanturier à l'écran d'accueil, puisque Safari ne le propose pas. Nouvelle règle 2 et ses scénarios ; `@a-valider` retiré du scénario « L'application laisse au navigateur le soin de proposer l'installation », précisé « tablette Android ».
2. **Application d'une mise à jour** (décision 12) : la nouvelle version s'applique automatiquement au lancement suivant, sans jamais recharger un écran en cours d'utilisation. Pas de message « Nouvelle version disponible ». Règle 4 reformulée, `@a-valider` retirés.
3. **Bibliothèque à jour** : proposition retenue. Avec le réseau, la bibliothèque la plus récente est utilisée. `@a-valider` retiré.
4. **Bibliothèque observable au lot 1** (décision 1) : vérification technique jusqu'au lot 3 (voir plus haut), plutôt qu'un ajout à la page de démonstration réservée aux tests.
5. **Données de la famille sur l'appareil** : proposition retenue. La mise en cache ne garde que la coquille de l'application et la bibliothèque, jamais les profils enfants ni la progression. Après une déconnexion, rien de la famille n'est visible, même sans réseau. `@a-valider` retiré ; le scénario dépend de l'issue #5.
6. **Vocabulaire** : propositions retenues. « Partie » n'est jamais employé (synonyme interdit de **Séance**) : « ce qu'il est en train de faire » au lot 1, « séance en cours » à partir du lot 3. « Appareil » est au glossaire (à valider). Les scénarios ne nomment pas d'« accueil » de l'application : ils disent « je vois le nom de l'application ».
7. **Aide une fois installée** : validé par le PO le 2026-10-22. L'aide n'apparaît plus une fois Savanturier ajouté à l'écran d'accueil. `@a-valider` retiré.
