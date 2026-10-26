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
