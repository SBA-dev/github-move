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
