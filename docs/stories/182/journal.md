# Journal de la story #182 : la voix de l'application en MP3 pré-générés (Piper, voix « tom »)

Équipe lancée par le responsable des équipes (vague 2, issue de coordination #193).
Branche : `feature/182-voix-mp3-piper`, partie de `main` (`aa75d97`). Base : `main`. Décision réservée : 0043.

## 2026-11-09

- 23:55 UTC : démarrage. Lecture de #182, de #193, des décisions 0004 et 0008, du code de `src/voix/` et de `_shared/voix/domain/`.
- 23:55 UTC : essai réseau. `pypi.org` joignable (paquet `piper-tts`, l'outil Piper). **`git.bksp.space` refusé** par le proxy (403 au CONNECT, refus de politique) : le modèle `fr_FR-tom-medium` ne peut pas être téléchargé depuis la source de l'issue. ESCALADE au PO via le responsable. On ne prend le modèle d'aucune autre source.
- 00:20 UTC : `domain-modeler` : modèle de domaine, brouillon 0043, ajouts au glossaire (commit 667d394).
- 00:35 UTC : `po-acceptance` : 27 scénarios, `criteres.md` (commit 6575262).
- 00:40 UTC : CADRAGE PRÊT publié sur #182 (questions #182.1 à #182.18). ⛔ n°1 : attente de l'annonce [Responsable] sur #193.
- 00:45 UTC : outil Piper installé dans le scratchpad depuis `pypi.org` (`piper-tts` 1.8.0, hors dépôt). Le modèle « tom » manque toujours (ESCALADE `git.bksp.space`).

## 2026-11-11

- 00:46 UTC : annonce [Responsable] sur #193 : `git.bksp.space` autorisé (PO « 1 »). Téléchargement du dépôt du modèle, dans le scratchpad seulement (jamais dans le dépôt). Le dépôt contient trois modèles « tom » (`tom1`, `tom2`, `next`) de même configuration ; aucun n'est nommé `fr_FR-tom-medium`.
- 00:55 UTC : page d'écoute publiée (six phrases × trois modèles × 24/32 kbit/s). Question #182.19 (quel modèle) posée sur #182. ⛔ n°1 toujours en attente.
- 00:47 UTC : ⛔ n°1 répondue par le PO (« Reco tout », annonce [Responsable] sur #193) : toutes les recommandations #182.1 à #182.18 retenues, budget 45 Mo, découpage 182a → 182e. #182.19 (modèle 1, 2 ou 3) et #182.8a (24/32 kbit/s) restent posées ; elles ne bloquent pas 182a (faux Piper).
- 01:00 UTC : passage au TDD de 182a. Mise à jour des scénarios et du modèle avec les réponses (po-acceptance, domain-modeler), en parallèle du premier comportement.
- 01:05–01:45 UTC : cycles TDD 1 à 6 verts, un commit test puis un commit feat chacun : clé de phrase TS (f840b1b), clé de phrase Python (f4fd778), plan de lecture (9892706), table de prononciation (4a81d7e), instants des mots (d22a0cd), fabrication reprenable avec faux Piper (f04c5ac). Deux pistes en parallèle (TS et Python) sur des fichiers séparés.
- 01:10 UTC : question #182.20 posée (message « Ce navigateur ne sait pas lire à voix haute »), sans arrêt du TDD.
- 01:45 UTC : RED 7 (`LecteurAvecRepli`) et RED 9 (`textesDitsDansLaLecon`) lancés.
- 02:10 UTC : cycles 7, 7 bis (MP3 illisible sans voix française, rythme du remplacement), 9 et 9 bis verts. RED 7 ter (pas de redite avant le remplacement) en cours de GREEN.
  - Points pour la revue du bloc : `textesDitsDansLaLecon` recopie la forme de `paroleDeLEtape` (`src/seance/useDeroulementDeSeance.ts`) au lieu de la partager ; `indicationDuGeste` est rendue pour tous les types, comme à l'écran, sans test dédié.
  - Textes dits pas encore couverts (cycle 9 ter) : aides après erreur, « c'est *réponse*. », consignes de la poésie, introduction de la lecture, félicitation de la dictée.
- 02:45 UTC : cycle 10 (paroles fixes, première partie) vert. Revue intermédiaire du bloc (99243bb → a99d81a) : **À CORRIGER**, 1 bloquant (texte de remplacement ni découpé ni normalisé, `lecteur-avec-repli.ts:28`). Non bloquants retenus : partager `texteDitDeLEtape`, test d'`indicationDuGeste` pour `ordre`, cas BOM / U+001C / NFD / U+0085 dans le jeu de cas partagé, une seule définition des espaces JS en Python. Accepté et documenté : un MP3 illisible découvert en cours de lecture, sans voix française, peut faire entendre le début du texte avant le remplacement (on ne peut pas le savoir avant de jouer).
