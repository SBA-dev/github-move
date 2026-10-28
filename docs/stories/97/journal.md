# Journal de la story #97 : retours animés et sonores pendant la séance

Équipe lancée par le responsable des équipes (`/graphe`, vague 1), issue de coordination #64.
Branche : `feature/97-retours-animes-et-sonores`, partie de `main` `ea2cca3`. Branche de base : `main`.
Numéro de décision réservé : 0034.

## 2026-10-28

- 07:30 UTC : démarrage. #97 dépend de #96 (PR #124, revue approuvée, non mergée). **Démarrage anticipé : cadrage seulement** (domaine + scénarios), aucun code avant le merge de #96.
- Question 1 de l'issue (source et licence des sons) déjà réglée par le PO le 2026-10-25 : 8 fichiers dans `public/sons/`, provenance dans `docs/sons.md`.
- Alignement sur `feature/96-refonte-visuelle` : jetons (`src/univers/jetons.ts`), transitions (`src/transitions/`, 300 ms au plus, `transform` et `opacity`), boutons en relief muets (`src/boutons/ressort-des-boutons.ts`) ; « Retours de réponse et effets sonores, dont le son au toucher d'un bouton : #97 » (hors périmètre de #96).
- 07:45 UTC : étape 1, `domain-modeler` : Motivation choisit l'effet sonore (à côté de l'humeur dans `Reaction`), Voix le joue et applique le Muet ; aucun changement d'Apprentissage. Ajouts au glossaire (fin de la section Voix) et à la context map. Questions #97.2 à #97.14. Commit `e80111a`.
- 08:00 UTC : étape 2, `po-acceptance` : 7 règles, 47 scénarios (9 plans, 25 `@a-valider`). Questions #97.15 à #97.19. Aucun scénario existant ne change de sens. R4 (record) et R7 (bouton touché) peuvent partir dans de petites stories si la story doit maigrir.
- `CADRAGE PRÊT` publié sur #97 ; attente de la validation du PO par le responsable. Pas de TDD tant que #96 n'est pas mergée.
- 08:28 UTC : ✅ validation n°1 annoncée par le responsable (#64, commentaire 6464291857 ; réponses mot pour mot sur #97, commentaire 6464291037). Écarts à la reco : 97.2 (le Muet coupe seulement la voix) et 97.17 (un toucher ne fait rien pendant la célébration). Toutes les autres questions suivent la reco ; 97.16 = oui.
- 09:00 UTC : réponses reportées par `domain-modeler` (`bf06eda`) et `po-acceptance` (`9c61d92`) : 7 règles, 49 scénarios, 3 `@a-valider` restants. Les deux agents avaient numéroté leurs questions chacun de leur côté : une seule liste, #97.20 à #97.24.
- `ESCALADE` publiée sur #97 pour les questions #97.20 à #97.24. Toujours pas de code : #96 n'est pas mergée.
- 10:47 UTC : réponse du PO aux questions 97.20 à 97.24, « 97 reco partout » (annonce [Responsable] sur #97, commentaire 6466985516). Report par `domain-modeler` (`5fc3f0a`) et `po-acceptance` (`ecdbeca`) : 7 règles, 49 scénarios, 0 `@a-valider`. Titre seul du scénario de #79 (l. 141) renommé (97.21), avec `docs/stories/79/acceptance.md`. Le skill `gamification` (97.23) sera corrigé par le responsable en fin de vague, sauf si on le fait dans la PR.
- Cadrage terminé. Attente : merge de #96 (annoncé par le responsable) avant le TDD.

### TDD (à partir du 2026-10-28 15:55 UTC)

- 15:53 UTC : annonce [Responsable] sur #64 (commentaire 6473782758) : #96 mergée (`2896d8e`), code autorisé. `main` intégrée par un merge commit (`e0d9b79`), sans conflit. Unitaires : 2462 verts.
- Consigne PO (#64, 07:18 UTC) : avant la PR, ne lancer que les scénarios `@issue-97`.

Comportements, dans l'ordre :

Bloc A — Voix
- A1 `EffetSonore` : liste fermée des 8 effets sonores.
- A2 `LectureAVoixHaute.jouer(effets)` joue les effets l'un après l'autre par le port `LecteurDEffetsSonores`.
- A3 `lire(texte, { effetsAvant })` : effets puis parole, jamais en même temps.
- A4 En Muet, les effets sont joués et la parole ne l'est pas (97.2).
- A5 Passer en Muet pendant un effet : l'effet finit, la parole qui suivait n'est pas lue (97.24).
- A6 Voix suspendue : aucun effet ; la suspension arrête l'effet en cours (97.13).
- A7 Une nouvelle lecture, `couperLaVoix` ou `faireSilence` arrête l'effet en cours.
- A8 Un effet impossible n'empêche pas la parole et ne signale pas la voix bloquée ; sans synthèse vocale, les effets sont joués (97.14).

Bloc B — Motivation
- B1 `Reaction.effetSonore` : `reponseJuste` / `reponseFausse` ; aucun pour « Je ne sais pas » (97.4, 97.11).
- B2 `effetsSonoresApresUneBonneReponse` : réponse juste, point du récipient si un point est gagné, texte complet à la place de la réponse juste pour un exercice complété ; pas de point pendant la fluence (97.5, 97.6, 97.10).
- B3 `effetSonoreDuRecord` : grande victoire pour un premier ou un nouveau record (97.8).
- B4 `effetsSonoresDeLaFin` : séance terminée ou grande victoire, puis découverte une seule fois ; test de départ ; séance faite seulement d'une fluence (97.7, 97.9, 97.18).

Bloc C — Apprentissage
- C1 `exerciceCompleteParLaDerniereReponse` : texte à trous, `ordre`, `classer`, `conjugaison`, `memoriser` (97.6).

Puis câblage : adaptateur navigateur, `useVoix`, déroulement de la séance, révision, test de départ, fin de séance (animations, confettis, annonce), son des boutons, `public/sw.js`.
- Bloc A (Voix) : A1 à A8 verts en 5 cycles (`3a1134a` → `2c28a81`). Revue intermédiaire delta `ee04c19..2c28a81` : À CORRIGER (cycle 1), 2 bloquants : tests manquants sur une suite d'effets interrompue, et `jouer` ne coupait pas la parole en cours (invariant 3). Corrigés par `b1cdbdc`, `9f005e0` (rouge), `290eda8` (fix), `825a7ad`. Revue du delta : **APPROUVÉ**. Dernier commit relu : `825a7ad`. Note pour le câblage : passer l'effet par `effetsAvant`, pas par deux appels séparés (en Muet, un `lire` sans effets arrête l'effet en cours).
- Bloc B (Motivation) : B1 à B4 verts en 3 cycles (`91593a9` → `a6dfff4`). Revue intermédiaire delta `defa35f..a6dfff4` : **APPROUVÉ** (cycle 1). Non bloquants : `FinDeParcours` renommé `FaitsDeLaFin` (`1875e99`) ; union discriminée non faite (un test passe exprès des faits sans effet pour le test de départ). Note pour le câblage (invariant 9) : pour une séance faite seulement d'une fluence, ne jouer `grandeVictoire` qu'une fois (soit à la fin de la fluence, soit à la fin de la séance), à vérifier par le scénario R4 (97.18).
- Bloc C (Apprentissage) : C1 vert (`587baba`, `da87127`). Revue delta : **APPROUVÉ**. Non bloquant traité : 2 cas négatifs verrouillés par mutation (`d97834f`). La séance de révision et le test de départ n'ont pas besoin de la lecture « exercice complété » (une question à la fois).
- TDD terminé : 13/13 comportements, 2507 tests unitaires.
- Câblage K1 (`f76cb9f`) : adaptateur navigateur des effets sonores (garde de 3 s, amorçage iPhone/iPad dans le déverrouillage audio), `useVoix.jouer`, `effetsAvant` dans `usePersonnageQuiParle`, 8 sons précachés par `public/sw.js` (y compris les requêtes `Range`). Observation E2E prévue : faux `HTMLMediaElement.play/pause` par `addInitScript`.
- Câblage K2 en cours : retours après chaque réponse (séance, révision, test de départ, fluence) et animations.
