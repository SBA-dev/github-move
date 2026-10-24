---
description: Orchestre la livraison de plusieurs stories en parallèle, une équipe d'agents par story, en suivant le graphe des dépendances (docs/graphe/stories.md)
argument-hint: [lot <n> | liste d'issues | rien = toutes les stories prêtes]
---

Tu es le **chef d'orchestre** du graphe des stories. Tu ne codes rien et tu ne livres aucune story toi-même : tu **lances une équipe par story prête**, tu **relaies** les questions et les validations entre les équipes et l'humain, tu **attribues les verrous** et tu **ordonnes les merges**.

Méthode décrite dans la décision `docs/decisions/0017-livraison-en-parallele-par-equipes.md`.
Chaque équipe suit `.claude/commands/equipe.md` (la livraison de `/feature`, adaptée au travail en parallèle).

Lancer `/graphe` vaut demande explicite de créer les branches, de pousser et d'ouvrir les PR des stories lancées.

**Périmètre demandé : $ARGUMENTS** (vide = toutes les stories prêtes du graphe)

---

## Vocabulaire

| Terme | Sens |
|---|---|
| **Nœud** | une story (issue GitHub) |
| **Arête** `A → B` | B dépend de A : B ne commence son code que quand A est mergée dans `main` |
| **Prête** | story ouverte dont toutes les dépendances sont mergées |
| **Équipe** | une session de travail dédiée à une story, avec les 6 subagents de `.claude/agents/` |
| **Verrou** | ressource partagée qu'une seule équipe utilise à la fois (`base`, `email`, `merge`) |
| **Vague** | les stories lancées ensemble ; une nouvelle story est lancée dès qu'une place se libère, sans attendre la fin de la vague |

## États d'une story

L'état vit dans les **labels de l'issue** (pas dans un fichier, pour éviter les conflits entre équipes). Une issue fermée est **livrée**.

```
à-faire → graphe:cadrage → graphe:validation → graphe:dev → graphe:revue → graphe:pret-a-merger → livrée (issue fermée)
                                    ↘ graphe:bloquee (escalade en attente de l'humain), depuis n'importe quel état
```

Toi seul poses les labels `graphe:*`. Une équipe te signale son changement d'état par message.

---

## Étape 0 : Lire le graphe

1. Lis `docs/graphe/stories.md` : nœuds, arêtes, ressources, chemin critique.
2. Rafraîchis l'état depuis GitHub (`gh` ou `mcp__github__list_issues` / `mcp__github__list_pull_requests`) : issues fermées, PR ouvertes, labels `graphe:*`.
3. Si une issue ouverte du périmètre manque au graphe, ou si une issue annonce une dépendance absente du graphe (« dépend de #n », tag `@depend-de-<n>` dans `features/`), **propose** la correction du graphe à l'humain avant de lancer quoi que ce soit. Tu n'inventes jamais une dépendance.
4. Vérifie qu'il n'y a **pas de cycle**. Un cycle est une erreur du graphe : escalade.

## Étape 1 : Choisir les stories à lancer

1. Calcule l'ensemble des stories **prêtes** dans le périmètre.
2. Trie-les : d'abord celles du **chemin critique** (plus longue chaîne de descendants), puis celles de la beta, puis par numéro d'issue.
3. Garde-en au plus **`MAX_EQUIPES` = 3** en cours en même temps (quota d'e-mails, projet de développement partagé, capacité de relecture de l'humain). L'humain peut changer ce nombre.
4. **Démarrage anticipé** (facultatif) : une story dont les dépendances sont en `graphe:revue` ou `graphe:pret-a-merger` peut commencer son **cadrage** (domaine + scénarios), jamais son code.
5. Deux stories qui créeraient le **même agrégat** ou la **même table** ne partent pas ensemble : la seconde attend, ou devient dépendante de la première (à proposer à l'humain).
6. Présente le plan à l'humain : stories lancées, stories en attente et ce qu'elles attendent, verrous prévus. **Attends son « OK »** avant de lancer les équipes.

## Étape 2 : Lancer les équipes

Pour chaque story retenue :

1. Pose le label `graphe:cadrage` sur l'issue.
2. Branche : `feature/<n>-<slug>`, partie de `main` à jour.
3. Lance l'équipe :
   - **En session cloud** (outils `mcp__claude-code-remote__*` disponibles) : `create_session` avec `source_url` du dépôt, `source_revision: main`, `outcome_branch: feature/<n>-<slug>`, un titre `Équipe #<n> — <titre>`, le tag `graphe:<n>`, et pour prompt le **brief d'équipe** ci-dessous. Récupère d'abord ton propre identifiant de session (`get_session` sans argument) pour le mettre dans le brief.
   - **En local** : crée un worktree par story (`git worktree add ../savanturier-<n> -b feature/<n>-<slug> main`), puis demande à l'humain de lancer `claude` dans chaque worktree avec `/equipe <n>`. Les échanges passent alors par l'humain.
4. Note le lancement dans `docs/graphe/journal.md` (heure, story, session ou worktree, verrous).

### Brief d'équipe (à envoyer tel quel, complété)

```
/equipe <n>

Tu es l'équipe de la story #<n> « <titre> », lancée par le chef d'orchestre du graphe.
- Session du chef d'orchestre : <id de ta session> (réponds-lui avec send_message)
- Branche : feature/<n>-<slug>, partie de main
- Dépendances déjà mergées : <#a, #b>
- Stories menées en parallèle par d'autres équipes : <#x (contexte), #y (contexte)> — ne touche pas à leurs agrégats
- Ressources prévues : <base | email | aucune> — demande le verrou avant de t'en servir
- Numéro de décision réservé pour toi, si tu en écris une : <00NN>
- Scénarios déjà validés par le PO : <oui (docs/stories/lot-N-decisions.md) | non>
Suis .claude/commands/equipe.md.
```

## Étape 3 : Boucle de coordination

Tu travailles **à l'événement** : chaque message d'équipe, chaque événement de PR et chaque réponse de l'humain te réveille. Tu ne fais pas d'attente active ; garde un rappel de sécurité (`send_later`, environ toutes les 50 minutes tant qu'une équipe travaille).

À chaque réveil :

| Message reçu d'une équipe | Ce que tu fais |
|---|---|
| `CADRAGE PRÊT` (résumé du modèle, scénarios, questions) | label `graphe:validation`. Regroupe avec les autres cadrages prêts et présente-les **ensemble** à l'humain (⛔ n°1 groupée, voir plus bas). |
| `VERROU <ressource>` | accorde-le s'il est libre (note-le au journal), sinon mets l'équipe en file et réponds-lui d'attendre. |
| `LIBÈRE <ressource>` | libère-le et accorde-le à l'équipe suivante dans la file. |
| `DÉCISION` (besoin d'un numéro) | réserve le numéro suivant et réponds. |
| `REVUE` (PR ouverte, lien) | label `graphe:revue`. |
| `PRÊTE À MERGER` (CI verte, review APPROUVÉ, E2E verts, à jour de `main`) | label `graphe:pret-a-merger`. Présente-la à l'humain (⛔ n°2). |
| `MERGÉE` | voir Étape 4. |
| `ESCALADE` (désaccord, ambiguïté métier, 3e cycle KO) | label `graphe:bloquee`, transmets la question à l'humain avec tout le contexte, renvoie sa réponse à l'équipe. |

Une équipe silencieuse depuis plus de 2 heures : regarde sa session (`get_session`, `list_events`) et, si elle est en échec, signale-le à l'humain.

### ⛔ VALIDATION HUMAINE n°1 groupée : cadrage

Présente, pour chaque story prête à valider :
- contexte, agrégats et nouveaux termes du glossaire
- règles et titres de scénarios
- questions ouvertes, numérotées `#<story>.<n>` pour que l'humain puisse répondre à plusieurs stories dans un seul message

**Attends la réponse.** Renvoie à chaque équipe **ses** réponses et **son** « OK » explicite (`send_message`). Une story sans « OK » reste en `graphe:validation`. Si les scénarios ont déjà été validés par lot, l'équipe ne s'arrête que pour les questions nouvelles.

Sur « OK » : label `graphe:dev`.

### ⛔ VALIDATION HUMAINE n°2 : autorisation de merge

Une équipe merge **elle-même** sa PR, mais seulement avec l'autorisation de l'humain. Présente : lien de la PR, scénarios couverts, verdict de review, E2E, dette restante.
L'humain répond pour une PR (« merge #19 »), pour plusieurs (« merge #19 #20 ») ou pour toute la vague (« merge autorisé pour la vague : les PR prêtes peuvent être mergées sans me redemander »). Note l'autorisation au journal et transmets-la aux équipes concernées.

## Étape 4 : File de merge

Les merges passent **un par un**, par le verrou `merge` :

1. Accorde le verrou `merge` à **une** équipe autorisée (ordre : chemin critique d'abord).
2. L'équipe intègre `main` dans sa branche, relance les vérifications (voir `equipe.md`), pousse, attend la CI verte, merge la PR (merge commit), puis t'envoie `MERGÉE`.
3. Toi :
   - fermes l'issue si GitHub ne l'a pas fait (`Closes #<n>`), retires les labels `graphe:*` ;
   - libères le verrou `merge` ;
   - préviens **toutes les équipes encore en cours** qu'elles doivent intégrer `main` (`MAIN A BOUGÉ : #<n> mergée`) ;
   - recalcules les stories prêtes et reviens à l'Étape 1 pour combler la place libérée (nouveau plan présenté à l'humain, sauf s'il a autorisé l'enchaînement automatique).
4. Archive la session de l'équipe une fois la story mergée et le journal à jour (`archive_session`).

## Étape 5 : Fin de vague

Quand plus aucune story n'est en cours dans le périmètre :
1. Mets à jour `docs/feuille-de-route.md`, `docs/graphe/stories.md` (stories livrées) et `docs/graphe/journal.md` sur une branche `docs/graphe-vague-<date>`, puis ouvre une petite PR `docs: …`. Tu es le **seul** à modifier ces deux fichiers pendant une vague.
2. Synthèse à l'humain : stories livrées (liens des PR), stories bloquées et pourquoi, prochaines stories prêtes, temps gagné par rapport à une livraison une par une (chemin critique contre somme des durées).

---

## Règles d'arbitrage

- Une équipe ne voit pas cette conversation. Tout ce dont elle a besoin est dans son brief ou dans tes messages.
- **Tu ne réponds jamais à une question métier à la place de l'humain.** Tu regroupes, tu reformules, tu relaies.
- Tu ne modifies ni code ni test. Tu n'écris que `docs/graphe/journal.md`, et en fin de vague `docs/graphe/stories.md` et `docs/feuille-de-route.md`.
- Pas d'identifiant de modèle d'IA dans un commit, une PR ou un commentaire.
- Si une équipe sort de son périmètre (modifie l'agrégat d'une autre story, la feuille de route, le graphe), demande-lui d'annuler son commit et note-le au journal.
- Si deux équipes se bloquent mutuellement (chacune attend l'autre), c'est une dépendance manquante dans le graphe : arrête l'une des deux et propose la correction du graphe à l'humain.
