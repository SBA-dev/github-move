# Critères d'acceptance : issue #8, PWA installable

Scénarios : `features/8-pwa-installable.feature` (tags `@issue-8 @wip`).
Story technique du lot 1 (Socle) : pas de modèle du domaine, aucune règle du domaine pédagogique.

## Objectif

En tant que **parent**, je veux installer Savanturier sur l'écran d'accueil de la tablette ou du téléphone, afin que mon enfant l'ouvre comme une application, en plein écran, même quand le réseau coupe.

Comportement actuel (`app/`) : aucun. L'application est un artifact claude.ai, ouvert par un lien, sans manifeste ni service worker. Les exemples viennent donc de l'issue et de la décision 0001, pas du legacy.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Savanturier peut être installé sur l'écran d'accueil de l'appareil | Le navigateur propose d'installer Savanturier · Savanturier installé s'ouvre en plein écran · L'application laisse au navigateur le soin de proposer l'installation (`@a-valider`) |
| 2 | Après un premier chargement, Savanturier et la bibliothèque restent disponibles sans réseau | Savanturier s'ouvre sans réseau après un premier chargement · La bibliothèque reste disponible sans réseau · Sans réseau, aucune donnée de la famille ne reste visible après la déconnexion (`@acces @a-valider`) |
| 3 | Une nouvelle version s'applique sans faire perdre à l'enfant ce qu'il est en train de faire | Une nouvelle version publiée n'interrompt pas l'enfant (`@a-valider`) · Une nouvelle version s'applique au lancement suivant (`@a-valider`) · Avec le réseau, la bibliothèque la plus récente est utilisée (`@a-valider`) |
| 4 | Savanturier tient dans la largeur de l'écran, dès 360 px | Savanturier tient dans la largeur d'un écran de <largeur> px (360, 820, 1280) · Savanturier installé tient dans la largeur d'un téléphone |

Total : 4 règles, 11 scénarios (13 cas exécutés avec les exemples du plan).

Étapes réutilisées de `features/0-socle.feature` : « j'ouvre Savanturier », « je vois le nom de l'application », « la page tient dans la largeur de l'écran ».

Droits d'accès : la story ne crée aucune table ni donnée de famille. Le seul scénario `@acces` vérifie que la mise en cache pour le hors réseau ne garde que la coquille et la bibliothèque, jamais les données d'une famille (minimisation RGPD). Il dépend de la déconnexion (issue #5).

## Hors périmètre

- Le **hors ligne complet** : jouer des séances sans réseau, les garder sur l'appareil et les synchroniser (lot 7, « Hors ligne et synchronisation »).
- La reprise d'une séance interrompue : les séances arrivent au lot 3. Ici, la règle 3 vérifie seulement qu'une nouvelle version ne recharge pas l'écran ouvert.
- Le premier lancement sans réseau : sans premier chargement, rien n'est sur l'appareil, et c'est le navigateur qui affiche son propre message.
- La présence dans les stores (décision 0001).
- Les notifications.

## Questions ouvertes

1. **Invitation à installer** (question 1 de l'issue) : l'application affiche-t-elle sa propre invitation (bouton « Installer »), ou laisse-t-on faire le navigateur ? Le scénario `@a-valider` suppose qu'on laisse faire le navigateur. Point d'attention : sur iPad et iPhone (Safari), le navigateur ne propose pas l'installation de lui-même. Si on affiche une invitation : où (accueil ou espace parent), pour qui (le parent seulement ?), et disparaît-elle une fois l'application installée ?
2. **Application d'une mise à jour** (question 2 de l'issue) : faut-il l'appliquer automatiquement au lancement suivant, ou afficher un message « Nouvelle version disponible » ? Les scénarios `@a-valider` de la règle 3 supposent l'application automatique au lancement suivant, sans jamais recharger l'écran pendant que l'enfant l'utilise.
3. **Bibliothèque à jour** : quand le réseau est là, faut-il toujours utiliser la bibliothèque la plus récente (scénario `@a-valider`), ou garder celle de l'appareil jusqu'à la mise à jour suivante de l'application ?
4. **Bibliothèque observable au lot 1** : aucun écran n'affiche encore les leçons. Le scénario « La bibliothèque reste disponible sans réseau » ne peut se vérifier qu'au niveau technique jusqu'au lot 3. Accepte-t-on cette vérification provisoire, ou reporte-t-on ce scénario au lot 3 ?
5. **Données de la famille sur l'appareil** (scénario `@acces @a-valider`) : confirmer que la mise en cache ne garde jamais les profils enfants ni la progression, et qu'après une déconnexion rien de la famille n'est visible, même sans réseau. Ce scénario dépend de l'issue #5 (déconnexion).
6. **Action qui demande du réseau** : que voit le parent s'il fait sans réseau une action qui en a besoin (par exemple demander un lien de connexion) ? Quel message ? Aucun scénario écrit tant que ce n'est pas décidé.
7. **Vocabulaire** absent du glossaire :
   - « partie en cours » (issue) : « partie » est un synonyme interdit de **Séance**. Les scénarios disent « ce qu'il est en train de faire » au lot 1, « séance en cours » à partir du lot 3.
   - « appareil » : proposé `(à valider)` dans `docs/stories/5/domain-model.md`, pas encore au glossaire.
   - « accueil » de l'application : est-ce l'écran « Aujourd'hui » du lot 4, ou un écran distinct ? Les scénarios disent seulement « je vois le nom de l'application ».
   - « nouvelle version », « installer », « plein écran », « réseau coupé » : termes techniques, hors du domaine. Faut-il les ajouter au glossaire ou les laisser hors du langage ubiquitaire ?

## Décisions

Aucune pour l'instant.
