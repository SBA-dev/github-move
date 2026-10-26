# Journal : issue #31, Badges et compétences

Équipe lancée par `/graphe` (vague 1), session `session_01RidQwQ6xHB1hVexw1Nv1b8`. Branche de base : `main`. Branche : `feature/31-badges`, partie de `main` `0c6641c`.

## 2026-10-26

- 06:48 UTC : démarrage. Cadrage validé (`feature/lot-31-33-modele-et-scenarios`, `48f1d6d`) mergé dans la branche (`7f67c87`) ; conflits du glossaire et de la context map résolus en gardant les deux côtés (une ligne « Lot 4 (#26 » en double retirée).
- Étapes 1 et 2 sautées : modèle et scénarios validés par le PO le 2026-10-25 (aucun `@a-valider`).
- 06:50 UTC : ESCALADE 31.27 (verbe de la phrase sans badge : « gagner » dans le modèle, « recevoir » dans les scénarios). Le reste continue.
- 06:57 UTC : réponse du PO relayée par le responsable, « 31 reco ok » : « gagner ». Consignée par `po-acceptance` (`e170057`).

### Découpage TDD

1. Apprentissage : `leconsAcquises`, `leconAcquiseParLaSeance` (seuil `SEUIL_DE_LECON_ACQUISE`).
2. Motivation : `nomDuBadge`, `badgesDuProfil` (un badge par compétence, leçon inconnue ignorée, ordre du catalogue).
3. Motivation : `badgeGagneParLaSeance`.
4. Motivation : paroles des badges.
5. Motivation : `sectionsDeLEcran` et paroles d'ouverture avec les badges.
6. Motivation : phrase de fin avec les nouveautés (cabane puis badge).

### Cycles TDD (bloc domaine)

| Cycle | RED | GREEN / REFACTOR |
|---|---|---|
| 1. Leçons acquises | `97ccd39` | `598107d` |
| 2. Badges du profil | `8908791` | `0ab9f88` ; test de caractérisation de la compétence blanche `0a7acf5` (code écrit sans test au GREEN) |
| 3. Badge gagné par la séance | `c2bca58` | `f9425ed` (formatage du test `7453c67`) |
| 4. Paroles des badges | `02454f7`, test corrigé `62f9dc8` (le « ! » était dans le nom du badge de test) | `17bc34d`, `7264dda` |
| 5. Sections et ouverture | `242c26e` | `89f644f`, `57b2f8d` (tsc) ; formatage du test `10d5508` |

- 07:10 UTC : revue intermédiaire en mode delta (`7f67c87..57b2f8d`) : **APPROUVÉ**, aucun bloquant. Dernier commit relu : `57b2f8d`.
  Non bloquants retenus :
  - `Lecon` du Catalogue utilisée à la place du value object `LeconDuBadge` du modèle : écart à noter dans `domain-model.md` ;
  - dette : comparateur de niveaux et rang de matière copiés dans Motivation et Apprentissage ; à exposer par `@domain/catalogue` dans une story qui touche le Catalogue ;
  - `phraseDeFinAvecLesNouveautes` (`paroles-des-badges.ts`) : #33 doit l'étendre (épisode entre cabane et badge), pas la recréer ; au câblage, `phraseDeFinAvecLaCabane` doit disparaître ;
  - un refactor (`accorder` → `accord.ts`) mêlé à un `feat` ; un test de caractérisation marqué « (red) ».

### Câblage, revue globale et E2E

- 07:12 UTC : câblage du front (`7cfd870` renommage de la lecture des meilleures étoiles, `bebba62` encart « Nouveau badge » et phrase de fin, `dacc666` section « Mes badges »). `implementer` exporte `parolesDeLaSectionDesBadgesOuSansBadge` pour ne pas recopier la règle dans React ; test de caractérisation `8f6025e`.
- `phraseDeFinAvecLaCabane` retirée : tests retirés (`d270499`, un cas recréé contre `phraseDeFinAvecLesNouveautes`), puis la fonction (`866012a`).
- 07:20 UTC : revue globale (delta `57b2f8d..866012a`) : **APPROUVÉ**, aucun bloquant. Non bloquants corrigés : nom de lecture en double (`ab68a41`, `lireLesMeilleuresEtoilesDuProfilSiLisibles`), `IconeDeMatiere` typée par `CodeDeMatiere` (`8691361`), notes d'implémentation du modèle (`996659f`). Restent : double lecture des meilleures étoiles dans « Mes médailles » (cabane et badges), bibliothèque vide affichée comme « aucun badge », pas de délai maximal sur le chargement de la bibliothèque à l'écran de fin.
- Scénarios (`085a79b`) : `@depend-de-32` et `@depend-de-39` retirés ; la leçon personnelle reprend les étapes de #39 ; « tout lire » de #65 et #32 complétés de « Mes badges » (31.23). Signalé : le scénario de #33 sur l'ordre cabane, épisode, badge garde un `@depend-de-32` périmé.
- Steps E2E (`7851661`), PR #109 ouverte en brouillon à 07:30.
- 08:00 UTC : non-régression sur `main` `0c6641c` OK (1046/1046), E2E autorisés.
- E2E du périmètre sur `telephone` (`@issue-31`, #24, #27, #32, #39, #65), `--workers=2` : 202/236 au premier passage complet (47 min), 28 timeouts relancés seuls en `--workers=1`. Contournement d'environnement : Playwright 1.56.1 cherche `chromium_headless_shell-1194`, le conteneur n'a que la 1243 ; lien symbolique hors du dépôt (pas de `playwright install`).
  - Cycle E2E 1 : 2 steps à corriger (`a00d6f1` : la leçon personnelle était servie dans la bibliothèque interceptée ; séance complète trop longue remplacée par un exercice seul pour #31) ; 2 scénarios de #24 rendus faux par #31 (la première séance à 2 ou 3 étoiles de « Les sons de test » annonce un badge).
  - Cycle E2E 2 : scénarios de #24 ajustés par `po-acceptance` (`c2258b6`, décision 31.23 : leçon déjà acquise avant la séance, comme #32 pour la cabane). #24 : 30/30.
  - Résultat : **#31 36/36, #24 30/30, #27 60/60, #32 34/34, #39 33/33, #65 36/36** (236/236 sur `telephone`).
- 09:35 UTC : sur `c2258b6`, unitaires 2370/2370, lint, fmt, `tsc`, build OK. `scripts/` inchangé.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée, du lancement au PRÊTE À MERGER | 06:48 → 09:40 UTC, environ 2 h 50 |
| Temps passé à attendre | PO (31.27) : 7 min, sans blocage ; non-régression sur `main` avant les E2E : environ 30 min (07:30 → 08:00), pendant lesquelles rien d'autre n'attendait |
| Cycles de review À CORRIGER | 0 (revue intermédiaire et revue globale APPROUVÉ du premier coup) |
| Cycles E2E KO | 2 (steps, puis 2 scénarios de #24) ; plus 1 premier run tout KO dû au navigateur du conteneur |
| Intégrations de `main` | 0 (`main` n'a pas bougé depuis `0c6641c`) ; 1 intégration du cadrage, 2 conflits (glossaire, context map), ajouts gardés des deux côtés |
| Escalades | 1 (31.27, verbe de la phrase sans badge) |
| Verrous | aucun pour l'instant |
