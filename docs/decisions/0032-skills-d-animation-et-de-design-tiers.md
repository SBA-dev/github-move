# 0032 : Skills tiers d'animation et de design : motion-design, design-dna, genjutsu

**Statut** : Acceptée · 2026-10-26 (confirmée par le PO)

## Contexte

Le PO juge la maquette de l'épopée #95 trop basique (dessins et animations). Il a proposé cinq dépôts de skills. Leur rôle est d'améliorer la façon dont Claude conçoit les animations et le design de l'interface ; la qualité des dessins de personnages, elle, passera par des fichiers Rive de la communauté (CC BY).

## Décision

1. **`motion-design`** (lottiefiles/motion-design-skill, MIT) et **`design-dna`** (zanwei/design-dna, MIT) sont **copiés** dans `.claude/skills/`, avec leur licence, un fichier `PROVENANCE.md` (source, commit, modifications) et le rappel de la règle absolue en tête (décision 0029).
2. **`genjutsu`** (AThevon/genjutsu, MIT) est déclaré comme **plugin** dans `.claude/settings.json`, figé à la version `v4.1.1`. On utilise `cast` et `paint`, **jamais `bunshin`** (pipeline multi-agents qui doublonne `/feature`).
3. Écartés : **gsap-skills** (le projet anime avec Motion ; à reconsidérer si GSAP est adopté) et **threejs-skills** (3D trop lourde pour les tablettes, application en 2D).
4. Comme pour 0026 : ces outils **conseillent**, `CLAUDE.md` et les skills du projet **décident**. Mode d'emploi : skill `gamification`, section 7.

## Conséquences

- Les descriptions de ces skills s'ajoutent au contexte de chaque session (genjutsu en a une vingtaine). S'ils gênent, on désactive le plugin ou on retire le dossier.
- Une mise à jour d'un skill copié se fait en recopiant la source et en notant le nouveau commit dans sa `PROVENANCE.md`.
- `design-dna` mesure les couleurs avec `sharp`, à ajouter en dépendance de développement le jour où on s'en sert (#96).
