# Journal : issue #33, Épisodes de l'histoire

Équipe lancée par `/graphe` (vague 1), session `session_0138G9tn9CLY5Zkm5LvWMfF4`. Branche de base : `main`. Branche : `feature/33-episodes-de-l-histoire`, partie de `main` `9bf0fa1`.

## 2026-10-26

- 11:37 UTC : démarrage. Dépendances toutes mergées (#24, #27, #28, #30, #31, #32, #65).
- Étapes 1 et 2 sautées : modèle et scénarios validés par le PO le 2026-10-25 (« 33. reco OK », aucun `@a-valider`), déjà dans `main`.
- Lu : commentaire APPRIS de #31 (`phraseDeFinAvecLesNouveautes` à étendre avec `episode`, entre cabane et badge ; encart de l'épisode entre l'encart de la cabane et `annonce-de-nouveau-badge`).
- Pas de E2E lourd sur `savanturier-dev` avant le résultat de la non-régression de `main` `9bf0fa1` (#30).

### Découpage TDD

Bloc « Motivation, histoire » (domaine) :
1. `histoire.ts` : `HISTOIRE_DES_SAVANTURIERS` (20 épisodes du legacy, épisode 20 épicène), `histoireDe`, `episodeOuvertParLaSeance`, `episodeOuvert`, `episodeSuivant`, erreurs `NombreDeSeancesInvalide`, `EpisodeInconnu`, `EpisodeNonOuvert`.
2. `seances-terminees-du-profil.ts` : `SeancesTermineesDuProfil.reunir` (union par identifiant), `nombre()`.
3. `tuiles-de-l-histoire.ts` : `tuilesDeLHistoire` (libellés, libellés lus 33.21).
4. `paroles-de-l-histoire.ts` : titre, sous-titre, position, texte à lire (titre puis texte), annonce, fin de phrase.
5. `phraseDeFinAvecLesNouveautes` étendue avec `episode` (cabane, épisode, badge), et fins de fluence et de révision (33.12).
6. `sectionsDeLEcran` (section `histoire`) et paroles d'ouverture de « Mes médailles » (33.22).

### Cycles TDD (bloc domaine)

| Cycle | RED | GREEN / REFACTOR |
|---|---|---|
| 1. Histoire, épisodes ouverts, suivant | `4297af6` | `f979a43` |
| 2. Séances terminées du profil | `fdf6408` | `e324e6d` |
| 3. Tuiles de l'histoire | `d7cf57e` | `e8c4860` |
| 4. Paroles de l'histoire | `bc3dfb2` | `852defd` |
| 5. Phrase de fin avec l'épisode (cabane, épisode, badge ; fluence, révision) | `74ab10c` | `aac8510` |
| 6. Section de l'histoire dans « Mes médailles » | `c4769cc` | `904ced7` |

- 11:58 UTC : revue intermédiaire en mode delta (`bebb52e..904ced7`) : **APPROUVÉ**, aucun bloquant. Dernier commit relu : `904ced7`.
  Non bloquants : suffixe « (red) » non homogène ; RED des cycles 2 à 4 posés ensemble avant les GREEN ; `cartePliee` dans un test ; libellés des tuiles hors de `paroles-de-l-histoire.ts` ; deux critères de lecture des sections dans `parolesALOuverture` ; test 33.23 de `SeancesTermineesDuProfil` peu probant (33.23 à couvrir au câblage) ; `episodeSuivant` ne vérifie pas que le numéro reçu est ouvert. Repris au refactor du câblage s'il touche ces fichiers.

### Câblage et revue globale

- 11:52-12:00 UTC : câblage du front, partie A (`3655b3c` lecture des séances terminées par identifiant, `941b99c` section de l'histoire et écran d'un épisode) et partie B (`6993e98` épisode ouvert par la séance à l'écran de fin, fluence seule, révision). Pas de migration, pas d'Edge Function.
- 12:01 UTC : tags `@depend-de-28/31/32` retirés de `features/33-…`, et `@depend-de-31 @depend-de-33` du scénario de #65 (`6c86040`).
- 12:05 UTC : revue globale, cycle 1 : **À CORRIGER**, 2 bloquants :
  1. le nombre « avant » retombait sur la dernière lecture du serveur gardée en mémoire (contraire à 33.9 et 33.10 b). Arbitrage : le repli reste pour « Mes médailles » et l'écran de l'épisode (33.10 c le prévoit explicitement : « si le nombre a été lu plus tôt pendant l'utilisation, la section reste ») ; il est retiré du nombre « avant ».
  2. alignement du surlignage (mots du titre retranchés) recopié dans React : cycle TDD 7 (`7c81bd3` RED, `rangDansLeTexteDeLEpisode`).
  Non bloquants repris : `catch` générique, constante de délai dans `src/reseau/`, `useHistoire` dans `src/histoire/`, mémoire vidée à la déconnexion. Laissés : paroles de fin de fluence redites avec l'épisode (conforme à 33.12, à signaler dans la PR) ; `aria-label` sur `role="status"` (contenu visible équivalent).
- 12:20 UTC : corrections (`7c81bd3` RED, `507b4a4` GREEN, `5dc1b56` fix, `c3d0805` refactor), relues en delta : **APPROUVÉ** (cycle 2), aucun bloquant. Non bloquants : décalage du titre à dériver de `texteALireDeLEpisode` ; dépendance Motivation → Voix (domaine) à noter à la context map ; un `map` dans un test.

### E2E

- 12:13 UTC : annonce du responsable sur #64 : non-régression de `main` `9bf0fa1` OK (1119/1119), E2E de périmètre autorisés.
- Steps E2E (`439973e`) : 64/65 sur `telephone` pour `@issue-33` plus le scénario de #65 « Les quatre sections… ». Le KO restant était un bug applicatif : le texte de l'épisode n'était pas en mode dys (interligne 1,7 au lieu de 1,9). Corrigé en CSS (`16e50e2`, sans test unitaire possible), et le scénario passe.
- Environnement : en plus du lien `chromium_headless_shell-1194 → 1243`, deux liens ont été ajoutés dans le dossier 1243 (`chrome-linux → chrome-headless-shell-linux64`, `headless_shell → chrome-headless-shell`), hors du dépôt.
- Scénarios d'autres stories rendus faux par la fin de phrase de l'épisode : leurs phrases attendues ont été mises à jour en application de la décision 33.13 (validée par le PO, valable pour #31, #32 et #33), sur le modèle de 31.23, sans changer ni la règle ni les « Étant donné » (`a8a8a1d`). Sont concernés #24 (2), #28 (1 plan), #31 (2) et #32 (2).
- 12:35 UTC : périmètre lancé sur `telephone` en `--workers=2` : #20, #24, #28, #29, #30, #31, #32, #33 et #65 (fichiers touchés : écran de fin, fluence, révision, séances retenues pendant l'utilisation, « Mes médailles »).
- 13:38 UTC : périmètre terminé : 386/398. Les 12 KO se répartissent ainsi :
  - 3 timeouts sous charge ;
  - 9 scénarios d'autres stories rendus faux par leur texte : « Lire l'épisode » dans les boutons de fin (33.12, 33.20), lecture « tout lire » avec l'histoire (33.22).
  Ces 9 scénarios ont été mis à jour sur le modèle de 31.23 (`dad95a7`, `6c92b68`), avec une nouvelle step pour la fin de révision (`c611acf`). Le titre d'un scénario de #28 devient « … propose « Accueil » et « Lire l'épisode » ».
- 13:45 UTC : les 12 relancés seuls en `--workers=1` : 12/12. **Périmètre : 398/398.**
- 13:47 UTC : revue du delta depuis `c3d0805` (correction CSS, steps, scénarios des autres stories) : **APPROUVÉ**. Review finale publiée sur la PR #110. Nettoyage des steps (`f2a79ff`).
- 13:48 UTC : `main` n'a pas bougé depuis le départ (`9bf0fa1`) : aucune intégration à faire.

## Mesures

| Mesure | Valeur |
|---|---|
| Durée, du lancement à PRÊTE À MERGER | 11:36 → ~13:50 UTC, environ 2 h 15 |
| Temps passé à attendre | environ 35 min sans E2E de périmètre (non-régression de `main` jusqu'à 12:13) ; travail continué pendant ce temps (câblage, revue, steps ciblés). Aucune attente du PO ni de verrou |
| Cycles TDD | 7 (6 dans le bloc domaine, 1 pendant la revue) |
| Cycles de review À CORRIGER | 1 (revue globale : 2 bloquants) |
| Cycles E2E KO | 2 : un bug applicatif (mode dys) ; 9 scénarios d'autres stories rendus faux par leur texte, plus 3 timeouts sous charge |
| Intégrations de `main` | 0, sans conflit |
| Run de périmètre | 1 h pour 398 scénarios sur `telephone`, en `--workers=2` |
| Ressources | aucune : pas de migration, pas d'Edge Function, aucun verrou `base` |
