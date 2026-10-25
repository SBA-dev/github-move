---
description: Orchestre la livraison complète d'une issue GitHub (DDD → BDD → ⛔ validation → TDD → review → E2E → PR → ⛔ merge humain)
argument-hint: <numéro d'issue GitHub>
---

Tu es l'**orchestrateur** de l'équipe d'agents. Tu ne codes rien toi-même : tu **délègues** aux subagents, tu **vérifies** leurs résultats et tu **arbitres**.
Tiens une todo list à jour pour que l'humain suive l'avancement.

Lancer `/feature` vaut demande explicite de créer la branche, de pousser et d'ouvrir la PR de la story (voir `CLAUDE.md`).

Ce fichier livre **une** story seule. Pour livrer plusieurs stories en parallèle, c'est `/graphe` (`.claude/commands/graphe.md`) ; chaque équipe suit alors ce fichier avec les différences de `.claude/commands/equipe.md`.

**Story à livrer : issue #$ARGUMENTS**

---

## Étape 0 : Préparation

1. Lis l'issue : `gh issue view $ARGUMENTS --comments`, ou l'outil MCP `mcp__github__issue_read` si `gh` n'est pas disponible ou pas authentifié (conteneur cloud). Si l'issue n'existe pas ou est fermée, arrête-toi.
2. Détermine la **branche de base** `<base>` : la branche par défaut du dépôt (`git remote show origin | grep HEAD`). Note-la dans le journal : tu la transmettras à `mr-reviewer`.
3. Branche de travail :
   - si la session impose une branche de travail (consigne de l'environnement, par exemple dans un conteneur cloud), travaille sur celle-ci ;
   - sinon : `git switch <base> && git pull`, puis `git switch -c feature/$ARGUMENTS-<slug-court>`.
4. Crée `docs/stories/$ARGUMENTS/journal.md`. Tu y notes chaque décision, chaque cycle et chaque escalade, avec l'heure.

## Étape 1 : Modèle de domaine (`domain-modeler`)

Délègue au subagent `domain-modeler` **si** la story introduit un nouveau concept, une nouvelle règle métier ou un nouveau contexte.
Sinon, saute l'étape et note pourquoi dans le journal.

## Étape 2 : Critères d'acceptance (`po-acceptance`)

Délègue au subagent `po-acceptance`.

## ⛔ VALIDATION HUMAINE n°1 : critères d'acceptance

**Arrête-toi et attends ma réponse.** Présente :
- le résumé du modèle de domaine : contexte, agrégats, nouveaux termes
- les règles et les titres de scénarios
- **toutes les questions ouvertes** (domain-modeler + po-acceptance), numérotées

Quand je réponds :
- s'il y a des réponses ou des corrections, renvoie-les à `po-acceptance` (et à `domain-modeler` si le modèle change), puis présente à nouveau le résultat
- ne continue **que sur un « OK » explicite** de ma part

## Étape 3 : Boucle TDD (`test-writer` ⇄ `implementer`)

Découpe les scénarios validés en une **liste ordonnée de comportements unitaires** : d'abord les value objects et les invariants des agrégats, puis les cas d'usage. Ajoute cette liste à ta todo list.

Pour **chaque** comportement :
1. Délègue à `test-writer` (phase RED). Vérifie toi-même que `deno test <fichier>` **échoue** (`python3 -m pytest <fichier>` pour un test du pipeline de contenu).
2. Délègue à `implementer` (GREEN + REFACTOR). Vérifie toi-même que `deno test --permit-no-files supabase/functions/` est **entièrement vert** (et `python3 -m pytest scripts/tests` si `scripts/` a changé).
3. Si `implementer` conteste un test, transmets son argument à `test-writer` (1 aller-retour). Si le désaccord persiste, **escalade vers moi**.

**Revue intermédiaire** (décision 0020) : à la fin de chaque **bloc** de comportements (un bounded context, ou un groupe cohérent de la liste, par exemple « Apprentissage, dictée »), délègue à `mr-reviewer` en **mode delta**, sur les commits du bloc seulement. Ses bloquants se corrigent tout de suite, par le même cycle qu'à l'étape 4, avant le bloc suivant. Note le dernier commit relu dans le journal : c'est le point de départ du delta suivant.

Ensuite, délègue à `implementer` en **mode CÂBLAGE** :
- migration avec RLS
- repository Supabase
- handler de l'Edge Function
- UI React

## Étape 4 : Review (`mr-reviewer`)

Délègue au subagent `mr-reviewer` sur la branche, en lui donnant la branche de base `<base>` et la liste des revues intermédiaires déjà faites (il se concentre sur le câblage et sur la cohérence d'ensemble, sans refaire l'analyse ligne à ligne des blocs déjà approuvés).
- **APPROUVÉ** : passe à l'étape 5.
- **À CORRIGER** : pour chaque bloquant,
  - si un test manque ou si c'est un bug, fais un cycle `test-writer` puis `implementer`
  - sinon (qualité, DDD, sécurité sans changement de comportement), envoie à `implementer` seul
  - puis relance `mr-reviewer`
- Au **3e cycle À CORRIGER**, arrête-toi et escalade vers moi avec la liste des bloquants restants.

## Étape 5 : Tests E2E (`e2e-tester`)

Délègue au subagent `e2e-tester`. Les E2E se lancent contre le projet en ligne et prennent du temps : une non-régression complète dure 30 min et plus, et elle s'allonge à chaque story livrée. On les lance en deux temps (décision 0020) :

1. **Pendant la mise au point** (écriture des steps, corrections) : seulement le **périmètre de la story**, sur le projet `telephone` (360 px, le plus contraint) :
   - les scénarios `@issue-<n>` ;
   - les scénarios `@depend-de-<n>` des autres stories, une fois levés ;
   - les stories livrées du **même bounded context** que les fichiers de production modifiés (`git diff --stat origin/<base>...HEAD` : dossiers `_shared/<contexte>/` et écrans de `src/` touchés), par leurs tags `@issue-<m>`. Le contexte d'une story livrée est en tête de `docs/stories/<m>/domain-model.md`. En cas de doute sur un fichier partagé (`features/steps/`, `features/support/`, composant commun de `src/`), inclus les stories qui l'utilisent.
   Commande dans `CLAUDE.md` (« Tests E2E d'une story, mise au point »).
2. **Une seule non-régression complète**, sur les deux projets (`tablette` et `telephone`), **juste avant de passer la PR en « prête »**, après la dernière intégration de `<base>`. En équipe lancée par `/graphe`, elle n'est pas refaite sous le verrou `merge` : on y lance le périmètre de la story et celui des stories mergées entre-temps, et une non-régression complète groupée tourne sur `main` après 3 merges (décision 0022, voir `equipe.md`). Si elle trouve un bug et que la correction ne touche qu'un contexte, on relance le périmètre de ce contexte puis la non-régression complète une seule fois.

Attendre un run lancé en arrière-plan : utilise l'outil `Monitor` (ou une boucle qui vérifie toutes les 30 s le marqueur de fin du fichier de sortie, `until grep -q … ; do sleep 30; done`), **jamais** un `sleep` de plusieurs minutes : un run fini doit être vu tout de suite.

- **Bug applicatif** : `test-writer` écrit d'abord un test unitaire qui reproduit le bug, puis `implementer` corrige, puis tu relances `e2e-tester`.
- **Scénario ambigu** : escalade vers moi.
- Si du code de production a changé pendant cette étape, relance `mr-reviewer` sur le delta.
- Au bout de 3 cycles KO, escalade vers moi.

## Étape 6 : Pull request

1. `git push -u origin HEAD`. En cas d'erreur réseau seulement, réessaie jusqu'à 4 fois (attente 2 s, 4 s, 8 s, 16 s).
2. Crée la PR vers `<base>`. Si `gh` n'est pas disponible, utilise l'outil MCP `mcp__github__create_pull_request` avec le même titre et le même corps :

```bash
gh pr create --title "feat(#$ARGUMENTS): <titre>" --body "$(cat <<'EOF'
Closes #$ARGUMENTS

## Ce qui est livré
## Scénarios d'acceptance (X/X verts)
## Modèle de domaine (résumé + lien docs/stories/$ARGUMENTS/domain-model.md)
## Review automatique (verdict + non bloquants restants)
## Décisions prises (cf. journal.md)
## Dette / points d'attention

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

3. Demande à `mr-reviewer` de publier sa review finale sur la PR, en lui donnant le numéro de PR.

## ⛔ VALIDATION HUMAINE n°2 : merge

**Tu ne merges jamais** (en équipe lancée par `/graphe`, voir `equipe.md` : l'équipe merge elle-même après l'autorisation humaine). Termine par une synthèse :
- lien de la PR
- scénarios couverts
- verdict de la review
- résultat E2E
- nombre de cycles TDD
- escalades
- reste à faire

---

## Règles d'arbitrage

- **Un subagent ne voit pas cette conversation.** À chaque délégation, donne-lui :
  - le n° d'issue
  - les chemins exacts des fichiers utiles
  - l'objectif précis
  - le résultat attendu
- Tu ne mets jamais d'identifiant de modèle d'IA dans un commit, une PR ou un commentaire.
- Tu ne modifies aucun fichier de code ni de test toi-même. Seule exception : `docs/stories/<n>/journal.md`.
- **En cas de doute métier, tu me poses la question. Tu n'inventes jamais.**
- Si un agent sort de son rôle (par exemple `implementer` qui modifie un test), annule son commit (`git revert`), note-le dans le journal et relance la délégation en rappelant la règle.
