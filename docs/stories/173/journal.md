# Journal de la story #173 : une musique pour les célébrations de Sports et de Police

Équipe lancée par `/graphe` (« Graphe 173 », 09/11). Branche `feature/173-musiques-sports-et-police`, partie de `main` `5d690d3` (version en ligne). Base : `main`. Numéro de décision réservé : aucun (prochain libre 0043).

## Étape 0 (2026-11-09, ~21:20 UTC)

- Issue #173 lue (aucun commentaire). Issue de coordination #64 relue : #173 lancée, aucune autre équipe, verrous libres.
- État du code : `CRIS_ET_MUSIQUES` (`supabase/functions/_shared/motivation/domain/celebrations-des-univers.ts`) donne `grandeVictoire` à `sports` et `police`. Le branchement sera le même que pour #166 : `EffetSonore`, `FICHIER_DE_L_EFFET`, `public/sw.js`, `docs/sons.md`, scénarios de `features/166-musiques-des-univers.feature` (règle « Un univers pour lequel le PO n'a retenu aucune musique… », Plan Sports et Police).
- Miroir `Boyquotes/kenney-music-jingles-for-godot` cloné (lecture publique, commit `1312c1a`) dans le scratchpad, hors du dépôt.

## Étape 1 : domaine (sautée)

Aucun concept ni règle nouvelle : on remplit deux valeurs `musique` du catalogue existant, selon les règles de #166 (106.12, 106.46, 166.x). Pas de `domain-modeler`.

## Étape 2 : écoute (2026-11-09, ~21:25 UTC)

- 6 candidats présélectionnés et convertis, page d'écoute publiée (artifact), détail dans `ecoute.md`.
- Les scénarios seront ajustés au choix du PO (comme pour #166) : si un univers reçoit une musique, il passe du Plan « garde « grande victoire » » au Plan « sa musique remplace « grande victoire » ».
- Commentaire `Avancement` : 6751803980 sur #173. `CADRAGE PRÊT` : 6751807310 (questions 173.1 choix à l'écoute, 173.2 conduite si « aucun »). RELIS envoyé au responsable. En attente d'une annonce [Responsable] sur #64.
