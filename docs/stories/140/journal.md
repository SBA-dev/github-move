# Journal de #140 : « Mes médailles », « Écouter » touché avant la fin du chargement est perdu

Branche de base : `main` (`573659e`). Branche : `feature/140-ecouter-mes-medailles`.
Lancée par le responsable des équipes (vague 1, issue de coordination #64, « Graphe 140 »).
Nature : correctif dans la stack cible (`fix(#140)`).

## 2026-11-04

- 20:50 UTC : démarrage. Lecture de l'issue, de `src/medailles/MesMedailles.tsx`, `src/seance/usePersonnageQuiParle.ts`,
  `supabase/functions/_shared/voix/domain/lecture-a-voix-haute.ts`, des attentes de `3d810cf` (#136) et `a6765f6` (#146).
- Cause : l'effet d'ouverture de `MesMedailles.tsx` dit l'accueil dès que les six chargements sont finis. Chaque section
  montre son bouton « Écouter » dès que sa propre donnée est chargée : une demande faite entre les deux est coupée par
  `dire({ nature: "accueil" })`, qui devient la dernière parole (`usePersonnageQuiParle`, `derniereLecture`).
- Étape 1 (domaine) : pas de `domain-modeler`. Pas de nouveau contexte ni d'agrégat ; une seule règle, dans Voix.
