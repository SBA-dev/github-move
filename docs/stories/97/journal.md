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
