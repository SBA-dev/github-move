# Journal : issue #31, Badges et compétences

Équipe lancée par `/graphe` (vague 1), session `session_01RidQwQ6xHB1hVexw1Nv1b8`. Branche de base : `main`. Branche : `feature/31-badges`, partie de `main` `0c6641c`.

## 2026-10-26

- 07:00 UTC : démarrage. Cadrage validé (`feature/lot-31-33-modele-et-scenarios`, `48f1d6d`) mergé dans la branche (`7f67c87`) ; conflits du glossaire et de la context map résolus en gardant les deux côtés (une ligne « Lot 4 (#26 » en double retirée).
- Étapes 1 et 2 sautées : modèle et scénarios validés par le PO le 2026-10-25 (aucun `@a-valider`).
- 07:10 UTC : ESCALADE 31.27 (verbe de la phrase sans badge : « gagner » dans le modèle, « recevoir » dans les scénarios). Le reste continue.

### Découpage TDD

1. Apprentissage : `leconsAcquises`, `leconAcquiseParLaSeance` (seuil `SEUIL_DE_LECON_ACQUISE`).
2. Motivation : `nomDuBadge`, `badgesDuProfil` (un badge par compétence, leçon inconnue ignorée, ordre du catalogue).
3. Motivation : `badgeGagneParLaSeance`.
4. Motivation : paroles des badges.
5. Motivation : `sectionsDeLEcran` et paroles d'ouverture avec les badges.
6. Motivation : phrase de fin avec les nouveautés (cabane puis badge).
