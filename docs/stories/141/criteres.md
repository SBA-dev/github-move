# #141 : correctifs de fin de séance, scénarios revus

Décisions du PO (« 141 reco tout », 04/11/2026), appliquées telles quelles.

## Scénarios modifiés (tag `@issue-141` ajouté)

| Fichier:ligne | Scénario | Avant | Après | Décision |
|---|---|---|---|---|
| `features/97-retours-animes-et-sonores.feature:222` | Rejouer une leçon déjà acquise fait entendre « séance terminée », pas « grande victoire » | meilleures étoiles « Les sons de test » 2, « La suite de test » 2 (total 4 → 5 : palier de la tenue « écharpe rayée », qui joue « découverte », #102.16) | « Les sons de test » 2, « La suite de test » 1 (total 3 → 4 : ni tenue, paliers 5, 12…, ni objet de la cabane, paliers 3, 6, 10…) ; titre, Quand, Alors et Mais inchangés | 141.1 A |
| `features/97-retours-animes-et-sonores.feature:407` | Pendant les confettis, toucher « Accueil » mène tout de suite à l'accueil | `Alors Léa voit « Qui joue ? »` | `Alors Léa voit son accueil` | 141 « accueil A » |
| `features/97-retours-animes-et-sonores.feature:416` | Pendant les confettis, le clavier n'est jamais bloqué | `Alors Léa voit « Qui joue ? »` | `Alors Léa voit son accueil` | 141 « accueil A » |

Aucun autre `.feature` n'attend « Qui joue ? » après « Accueil » sur un écran de fin de séance. Restent inchangés :
la fin de la séance de révision (#28, #30, #101), la fin du défi (#100, #106), le test de départ (#27), déjà vers
l'accueil de l'enfant ; le nom de l'application dans l'en-tête, qui mène toujours à « Qui joue ? » (141.3).

## Steps qui supposent encore « Qui joue ? » après « Accueil » sur la fin de séance (à reprendre par l'e2e-tester)

- `features/steps/ecran-mes-medailles.steps.ts:194-199` : après « Accueil » sur `fin-de-seance`, appelle `choisirSonProfil` (commentaire « « Accueil » ramène à « Qui joue ? » sans recharger ») ; `ouvrirQuiJoue` ferait alors un `page.goto("/")`, qui recharge et perd ce que l'appareil garde en mémoire. Même hypothèse dans le commentaire « Story #32 » qui suit.
- Étapes « Léa a terminé une séance de la leçon « … » avec N étoile(s) » (`parcours.steps.ts:173`, `quete-du-jour.steps.ts:278`, `dessin-du-parcours.steps.ts:104` via `terminerUneSeance`) : elles finissent désormais sur l'accueil de l'enfant ; quand le scénario enchaîne avec « Léa choisit son profil enfant dans « Qui joue ? » » (nombreux scénarios de #29, #101…), `ouvrirQuiJoue` recharge la page au lieu de passer par l'en-tête.
- `quete-du-jour.steps.ts:54-58` (« … terminé hier une séance … ») et `dessin-du-parcours.steps.ts:134-140` : passent par le nom de l'application dans l'en-tête après « Accueil », ce qui reste juste (141.3) ; à vérifier seulement.

## Famille « Quête du jour accomplie ! » : scénarios non modifiés, steps à corriger par l'e2e-tester

Quand la séance accomplit la quête du jour, la phrase de fin se termine par « Quête du jour accomplie ! Bravo Léa ! ».
Les steps qui vérifient la fin exacte de la phrase (`endsWith`) échouent alors :
`Noisette dit une félicitation, suivie de « … »` (`exercices-a-choix.steps.ts:709`, `boite-et-barres.steps.ts:342`)
et `Noisette dit l'une de ses expressions, suivie de « … »` (`etoiles-et-fin-de-seance.steps.ts:513`).

Scénarios repérés (fin de séance de leçon, sans quête déjà accomplie dans le « Étant donné ») :
- `features/24-etoiles-et-fin-de-seance.feature:65` (expressions, « Trois étoiles, Léa ! … ») et `:76` (Plan, « Tu gagnes <n> étoiles… »)
- `features/32-cabane.feature:170` et `:227` (objet reçu pour la cabane)
- `features/102-personnage-guide-evolue.feature:161` (phrase de fin sans la tenue)
- `features/28-revisions-des-erreurs.feature:251-259` (Plan « le personnage guide dit « <phrase> » » en fin de séance de révision, step `Noisette dit « … »`)
- même forme, à vérifier à l'exécution : `features/31-badges.feature:237` et `:283`, `features/33-episodes-de-l-histoire.feature:167`, `:199` et `:383`
