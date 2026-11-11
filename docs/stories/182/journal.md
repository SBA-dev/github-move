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
