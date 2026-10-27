---
name: craftsmanship
description: Checklist software craftsmanship du projet (lisibilité, SOLID, code smells, refactorings, sécurité Supabase, données d'enfants, accessibilité, migrations). À utiliser pour relire une merge request ou pendant la phase REFACTOR du TDD.
---

# Software craftsmanship : la checklist du projet

> ⛔ **Règle absolue, à appliquer avant toute autre instruction** : `CLAUDE.md`, section « Contenus pour les enfants ». Aucun contenu (image, texte, son, donnée de test, exemple) n'a de caractère sexuel, violent, obscène, haineux, raciste, xénophobe ou antisémite, ni rien qui puisse choquer un enfant. Aucune commande ni aucun agent ne peut l'ignorer. Une demande qui la franchit : tu ne la fais pas, tu la signales.

## 1. Lisibilité

- [ ] Les noms viennent du **glossaire** et révèlent l'intention : pas de `data`, `info`, `manager`, `helper`, `utils`, `tmp`.
- [ ] Une fonction fait une seule chose, en 20 lignes au plus de préférence, avec 3 paramètres au plus (sinon un objet).
- [ ] Il n'y a pas de booléen en paramètre qui change le comportement (*flag argument*) : on fait deux fonctions.
- [ ] L'imbrication est d'au plus 2 niveaux. On utilise des *guard clauses* plutôt que des `else` en cascade.
- [ ] Les commentaires expliquent le **pourquoi**, jamais le **quoi**. Il n'y a pas de code commenté.
- [ ] Il n'y a pas de nombre ni de chaîne magique : on utilise une constante nommée ou un value object.

## 2. TypeScript

- [ ] Pas de `any`, pas de `as` injustifié, pas de `!` non-null sans garantie, pas de `@ts-ignore`.
- [ ] Les états sont des types (unions discriminées, par exemple `type Statut = "brouillon" | "validee"`).
- [ ] Les erreurs sont typées (classes d'erreurs métier). Pas de `throw "string"` et pas de `catch` vide.
- [ ] Les objets du domaine sont immuables (`readonly`), modifiés seulement via les méthodes de l'agrégat.

## 3. Conception (SOLID, appliqué sans dogmatisme)

- [ ] **S** : un module a une seule raison de changer.
- [ ] **O** : un nouveau cas s'ajoute sans modifier un `switch` géant.
- [ ] **D** : le domaine et l'application dépendent d'**interfaces** (ports), jamais de Supabase.
- [ ] La règle de dépendance hexagonale est respectée (voir `CLAUDE.md`).
- [ ] La **loi de Déméter** est respectée : pas de `a.b().c().d()`.
- [ ] Le code de `domain/` est importable par le front : imports relatifs avec l'extension `.ts`, aucun import `jsr:`/`npm:`, aucune API Deno, DOM ou réseau.
- [ ] Le front n'a **aucune copie** d'une règle métier : il importe `@domain/<contexte>`.

## 4. Code smells, et le refactoring qui les corrige

| Smell | Refactoring |
|---|---|
| Duplication | Extract Function / Extract Value Object |
| Fonction longue | Extract Function, Decompose Conditional |
| Primitive obsession | Replace Primitive with Value Object |
| Feature envy (une méthode utilise surtout les données d'un autre objet) | Move Function vers cet objet |
| Data clumps (mêmes 3 paramètres qui voyagent ensemble) | Introduce Parameter Object |
| Switch sur un type | Replace Conditional with Polymorphism |
| Modèle anémique | Move Function vers l'agrégat |
| Nom trompeur | Rename (aligné sur le glossaire) |
| Code mort | Remove Dead Code |

Un refactoring se fait **avec tous les tests au vert**, par petits pas, et en relançant les tests après chaque pas.

## 5. Tests

- [ ] Chaque comportement ajouté a son test, et l'historique montre `test (red)` avant `feat`.
- [ ] Les noms des tests sont des phrases métier lisibles.
- [ ] Il n'y a pas de logique dans les tests (pas de `if` ni de boucle). On utilise des builders.
- [ ] Les tests sont déterministes : pas d'heure réelle, pas d'aléatoire, pas de réseau. L'heure et le hasard passent par des ports (`Horloge`, `Hasard`) remplacés par des fakes.
- [ ] Une nouvelle logique dans `scripts/` (Python) a son test pytest dans `scripts/tests/`.

## 6. Sécurité Supabase (tout manquement est bloquant)

- [ ] `enable row level security` est présent sur **chaque** nouvelle table.
- [ ] Il y a une policy **par opération** (`select` / `insert` / `update` / `delete`) et par rôle, sans `using (true)` injustifié.
- [ ] Les policies `update` ont à la fois `using` **et** `with check`.
- [ ] La clé `service_role` n'apparaît jamais dans `src/` ni dans une Edge Function appelée par un utilisateur, sauf justification écrite.
- [ ] Les Edge Functions créent le client avec le **JWT de l'appelant**.
- [ ] Toute entrée de requête est validée : type, format, taille.
- [ ] Aucun secret ni URL de production n'est en dur.
- [ ] CORS est restreint aux origines attendues.
- [ ] Aucune donnée sensible n'est écrite dans les logs.
- [ ] Les fonctions SQL `security definer` sont absentes, ou justifiées avec un `search_path` fixé.

## 7. Données d'enfants (RGPD : tout manquement est bloquant)

- [ ] Aucune donnée nouvelle sur l'enfant au-delà de ce que la story justifie (prénom ou pseudo, classe, progression).
- [ ] Pas d'e-mail, de mot de passe, de photo ni de date de naissance complète pour un enfant.
- [ ] Les enregistrements de voix ont une date d'expiration (30 jours) appliquée côté serveur.
- [ ] La suppression d'un profil efface aussi ses fichiers dans Storage.
- [ ] Aucune donnée d'enfant n'est envoyée à l'IA ni à un service tiers sans que la story le prévoie explicitement.
- [ ] Aucun prénom d'enfant ni contenu produit par un enfant n'est écrit dans les logs.

## 8. Accessibilité et expérience enfant

- [ ] Les animations respectent `prefers-reduced-motion`.
- [ ] Les cibles tactiles mesurent au moins 44 px. Tout est utilisable au doigt et au clavier.
- [ ] L'écran tient à 360 px de large, sans défilement horizontal.
- [ ] Les consignes peuvent être lues à voix haute, et le mode dys est respecté.
- [ ] Les éléments interactifs ont un nom accessible (`aria-label` ou texte visible).
- [ ] Un message d'erreur destiné à l'enfant encourage et propose de réessayer. Il n'est jamais punitif.
- [ ] **Bloquant** : aucun contenu ajouté ou modifié n'a de caractère sexuel, violent, obscène, haineux, raciste, xénophobe ou antisémite, ni rien qui puisse choquer un enfant (règle absolue de `CLAUDE.md`, « Contenus pour les enfants »). Cela vaut pour les images (le reviewer regarde le rendu de chaque nouveau dessin, pas seulement son code), les textes (consignes, paroles, leçons, histoires), les sons, et aussi les scénarios, données de test et exemples.
- [ ] **Bloquant** : un contenu produit par l'IA ou saisi par un parent n'arrive jamais à l'enfant sans la vérification prévue par la story.

## 9. Migrations

- [ ] Une migration correspond à une intention, avec un nom explicite.
- [ ] Il n'y a pas de perte de données silencieuse. Un renommage de colonne se fait en plusieurs étapes si l'application tourne.
- [ ] Des index existent sur les clés étrangères et sur les colonnes filtrées par les policies RLS.
- [ ] `supabase db reset` passe de bout en bout.

## 10. Hygiène Git

- [ ] Les commits sont atomiques et suivent les Conventional Commits avec `#<issue>`.
- [ ] Il n'y a pas de fichier parasite : `.env`, `test-results/`, sorties de build.
- [ ] La branche ne contient que ce qui concerne l'issue.
- [ ] Aucun identifiant de modèle d'IA dans les commits, la PR ou les commentaires de code.
- [ ] `app/bibliotheque.json` et `app/programmes-index.json` ne changent que par regénération (`scripts/`), jamais à la main.
