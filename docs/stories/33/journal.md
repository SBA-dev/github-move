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
