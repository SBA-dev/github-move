---
description: Livre une story au sein du graphe, en parallèle d'autres équipes (variante de /feature lancée par /graphe), jusqu'au merge autorisé
argument-hint: <numéro d'issue GitHub>
---

Tu es le **chef de l'équipe** de la story **#$ARGUMENTS**. Ton équipe, ce sont les 6 subagents de `.claude/agents/` (`domain-modeler`, `po-acceptance`, `test-writer`, `implementer`, `mr-reviewer`, `e2e-tester`).
D'autres équipes livrent d'autres stories **en même temps** que toi. Le **chef d'orchestre** (`/graphe`, `.claude/commands/graphe.md`) coordonne : c'est lui ton interlocuteur, pas l'humain directement.

Le brief reçu au lancement donne : l'identifiant de session du chef d'orchestre, ta branche, les dépendances mergées, les stories voisines, les ressources prévues, ton numéro de décision réservé, et si les scénarios sont déjà validés.

## Ce qui ne change pas

Tu suis **`.claude/commands/feature.md`** étape par étape (domaine, critères, TDD, review, E2E, PR), avec ses règles d'arbitrage et ses limites de cycles. Ce fichier ne décrit que les **différences**.

## Ce qui change

### 1. Les arrêts ⛔ passent par le chef d'orchestre

Pour parler au chef d'orchestre : `send_message` vers sa session (en local : écris le message à l'humain, qui le relaie). Chaque message commence par un **mot-clé** en majuscules pour qu'il le traite vite :

| Moment | Message |
|---|---|
| Fin de l'étape 2 (critères) | `CADRAGE PRÊT #$ARGUMENTS` + résumé du modèle, titres des scénarios, questions ouvertes numérotées `#$ARGUMENTS.1`, `#$ARGUMENTS.2`… |
| Besoin d'une ressource partagée | `VERROU base` / `VERROU email` / `VERROU merge` |
| Ressource rendue | `LIBÈRE <ressource>` |
| Besoin d'écrire une décision sans numéro réservé | `DÉCISION #$ARGUMENTS` + titre |
| PR ouverte | `REVUE #$ARGUMENTS` + lien |
| Tout est vert | `PRÊTE À MERGER #$ARGUMENTS` + synthèse de fin de `feature.md` |
| Story mergée | `MERGÉE #$ARGUMENTS` + lien du merge commit |
| Escalade (désaccord, ambiguïté métier, 3e cycle KO) | `ESCALADE #$ARGUMENTS` + question complète, compréhensible sans contexte |

Après `CADRAGE PRÊT`, `PRÊTE À MERGER` ou `ESCALADE`, **arrête-toi** et attends la réponse. Tu ne la supposes jamais. Si les scénarios sont déjà validés par lot et qu'aucune question nouvelle n'apparaît, envoie `CADRAGE PRÊT` pour information et continue.

### 2. Ressources partagées : demande le verrou

| Ressource | Quand la demander | Quand la rendre |
|---|---|---|
| `base` | avant d'appliquer une migration au projet `savanturier-dev` | quand la story est mergée (la migration reste appliquée) ou retirée |
| `email` | avant de lancer les scénarios `@envoi-email` | dès la fin de ces scénarios |
| `merge` | une fois l'autorisation de merge reçue | après le merge, ou en cas d'échec de l'intégration |

Règles de la base partagée :
- Migrations **additives seulement** (nouvelle table, nouvelle colonne nullable, nouvelle policy) : une autre équipe teste en même temps contre la même base. Un renommage ou une suppression est une escalade.
- Les données créées par les tests portent un identifiant propre à la story (préfixe `e2e-<n>-`) et sont nettoyées par les steps.

### 3. Rester dans son couloir

- Ne modifie pas les agrégats, tables ou écrans d'une story voisine (liste dans le brief). Si tu en as besoin, c'est une dépendance manquante : `ESCALADE`.
- Tu ne modifies **jamais** `docs/feuille-de-route.md` ni `docs/graphe/` : c'est le chef d'orchestre.
- `docs/domain/glossaire.md` et `docs/domain/context-map.md` : **ajouts seulement**, en fin de section. Pas de reformulation d'un terme existant sans escalade.
- Décision d'architecture : uniquement avec le numéro réservé pour toi.
- Steps E2E partagés (`features/steps/`, `features/support/`) : ajoute des steps, ne change pas le sens d'un step existant ; s'il le faut, `ESCALADE`.

### 4. Quand `main` bouge

À la réception de `MAIN A BOUGÉ`, à la fin du cycle TDD en cours (jamais au milieu d'un RED) :
1. `git fetch origin main && git merge origin/main` (merge, jamais de rebase sur une branche déjà poussée).
2. Conflit sur `glossaire.md`, `context-map.md` ou des steps : garde les deux ajouts. Conflit dans du code : résous-le avec `implementer`, puis relance tous les tests unitaires.
3. Si les scénarios d'une dépendance tout juste mergée changent ce que tu as prévu : `ESCALADE`.

### 5. Le merge, fait par l'équipe

Tu merges **toi-même**, à quatre conditions :
1. l'humain a autorisé ce merge (message du chef d'orchestre : pour cette PR, ou pour toute la vague) ;
2. tu détiens le verrou `merge` ;
3. après intégration de `main` dans ta branche, tout est vert **sur le dernier commit** :
   - `deno test --permit-no-files supabase/functions/`, lint, format, `npx tsc --noEmit`, `npm run build`
   - E2E de la story et non-régression des stories livrées (commandes de `CLAUDE.md`, sans `@envoi-email` sauf si la story touche la connexion)
   - `python3 -m pytest scripts/tests` si `scripts/` a changé
   - la CI de la PR
4. `mr-reviewer` a rendu APPROUVÉ, et si l'intégration de `main` a changé du code de production, il a relu ce delta.

Alors : merge la PR vers `main` avec un merge commit (`gh pr merge --merge`, ou `mcp__github__merge_pull_request` avec `merge_method: merge`), vérifie que l'issue est fermée, envoie `MERGÉE`, puis `LIBÈRE merge` et `LIBÈRE base` si tu l'avais.

Si une condition manque, tu ne merges pas : `LIBÈRE merge` et explique pourquoi au chef d'orchestre.

### 6. Fin de mission

Complète `docs/stories/$ARGUMENTS/journal.md` (dans la PR, avant le merge) : cycles TDD, escalades, verrous pris, intégrations de `main`, temps passé. Puis arrête-toi : le chef d'orchestre archive la session.
