# 0043 : La voix du personnage guide est une voix enregistrée (MP3 fabriqués par Piper, voix « tom »), avec repli phrase par phrase sur la voix de l'appareil

**Statut** : Acceptée · 2026-11-11 (story #182 ; réponses du PO « Reco tout » aux questions 182.1 à 182.18, annonce [Responsable] sur l'issue #193, détail dans `docs/stories/182/domain-model.md`, section 9). Précise 0004 ; s'appuie sur 0007 et 0008. Reste ouverte : 182.19 (quel modèle « tom »).

## Contexte

Sur un téléphone Android sans voix française installée, aucune leçon n'est lue à voix haute, et l'enfant voit « La voix de … est bloquée par ce navigateur », message trompeur. Installer une voix est trop compliqué pour les familles. La décision 0004 prévoyait déjà des MP3 générés une seule fois avec une voix neuronale et un repli sur la voix du navigateur ; le port `LecteurAVoixHaute` (0007, 0008) a été prévu pour cet adaptateur.

Le PO a choisi (2026-11-07) l'outil **Piper** (open source, local, sans compte ni clé) et, après écoute, la voix **« tom »** (modèle sous AGPLv3). Le dépôt de la voix (`git.bksp.space/Tjiho/French-tts-model-piper`) contient trois modèles « tom » de même configuration (`tom1`, `tom2`, `next`) ; le PO choisit le modèle à l'oreille (182.19). Son nom est écrit dans le répertoire des phrases enregistrées et dans la licence.

## Décision

1. **Voix enregistrée** : chaque phrase connue à l'avance (textes dits pendant les leçons de la bibliothèque, paroles fixes des personnages guides, phrases finies mais construites) a un **MP3 mono, 32 kbit/s, 22,05 kHz** (après écoute comparative), fabriqué par le pipeline de contenu avec Piper. L'application ne contient que les MP3, **jamais le modèle** ; l'auteur de la voix est crédité dans `public/voix/LICENCE-voix-tom.txt`. Une seule voix pour les six personnages guides : seul leur rythme s'applique aux MP3, la hauteur ne vaut plus que pour le repli (182.3 A).
2. **Clé de phrase** : chaque MP3 est retrouvé par une clé calculée sur le texte de la phrase (découpage et normalisation de `texteALire`, NFC, apostrophe droite ; FNV-1a 64 bits en hexadécimal). Le même calcul existe en TypeScript (domaine Voix) et en Python (pipeline), prouvé égal par un jeu de cas partagé (`docs/voix/cas-des-cles-de-phrases.json`). Une phrase sans lettre ni chiffre n'est pas lue (182.12).
3. **Répertoire des phrases enregistrées** publié avec les MP3 ; le nom de chaque MP3 contient sa clé et son **empreinte de fabrication** : une phrase regénérée change d'adresse, et la fabrication saute les fichiers déjà faits (reprenable, par niveau).
4. **Table de prononciation** dans le pipeline seulement : elle corrige le texte envoyé à la voix, jamais le texte affiché ni le sens. Le PO relit chaque niveau sur une **page d'écoute** locale, jamais publiée (182.5).
5. **Lecture** : un service du domaine Voix (`LecteurAvecRepli`, qui implémente `LecteurAVoixHaute`) joue le MP3 de chaque phrase et **se replie phrase par phrase** sur la voix de l'appareil pour une phrase sans MP3 lisible ou dans une autre langue (les mots en anglais restent sur la voix anglaise de l'appareil, 182.11). Muet, voix suspendue et arrêt s'appliquent aux MP3. Surlignage approximatif (durée répartie au prorata des caractères). Mots dictés : MP3 lents à part (182.8 b).
6. **Prénom** (182.2, 182.15 B) : avec une voix française sur l'appareil, la phrase avec le prénom est dite en entier par la voix de l'appareil. Sans voix française, la lecture utilise le **texte enregistré de remplacement** (même texte sans le prénom, fourni avec la lecture) ; le prénom reste affiché. Aucun MP3 ne contient un prénom.
7. **Voix indisponible** : sans MP3 lisible ni voix française, un seul signal de lecture empêchée, avec sa cause (`voixBloquee` | `voixIndisponible`), affiche le **message de voix indisponible** (« *Coach Léo* ne peut pas lire cette phrase sur cet appareil… », 182.7) ; « Voix bloquée » reste pour un refus du navigateur. Un seul des deux messages à la fois (182.16).
8. **Stockage et hors ligne** (182.4 A, 182.17) : MP3 dans le dépôt et le build (`public/voix/`), servis par l'hébergement du front, **budget de 45 Mo** (le build échoue au-delà, 182.6) ; cache à part dans le service worker, non vidé à chaque publication ; mise en cache des MP3 d'une leçon à son ouverture ; pas de précache complet, pas de préchargement de la leçon suivante.
9. **Énumération des phrases** (182.10) : la liste des phrases à fabriquer est produite par le domaine TypeScript (`textesDitsDansLaLecon` d'Apprentissage, paroles fixes de Motivation) et exportée par un script **Deno** (`scripts/voix/exporter_les_phrases.ts`) ; le pipeline Python fabrique les MP3 et recalcule la clé. **Entorse acceptée** à « le pipeline de contenu reste en Python » (CLAUDE.md) : les règles qui construisent les textes dits n'existent qu'une fois, en TypeScript.
10. **Espace parent › Voix** (182.9 A, 182.18) : la page présente d'abord la voix de Savanturier (sans choix), puis le choix de la voix de l'appareil pour les phrases sans voix enregistrée. Le message « Aucune voix française trouvée… installe-en une » de #15 est reformulé : la voix de Savanturier lit les leçons, la voix de l'appareil ne sert qu'aux phrases fabriquées à la volée.
11. **Livraison par morceaux** (182.14) : 182a (socle et paroles fixes), 182b (CP), 182c (CE1), 182d (CE2), 182e (CM1 et CM2). Les textes fabriqués à la volée restent au repli ; l'assemblage de morceaux enregistrés est une story de suite (182.1 A).

## Options écartées

- **Faire installer une voix française par la famille** : trop compliqué (constat de l'issue).
- **Voix neuronale en ligne (service tiers)** : compte, clé, coût, et textes envoyés hors de la machine de génération.
- **Synthèse à la demande dans une Edge Function** : coût et latence à chaque phrase, rien hors ligne.
- **Précache de tous les MP3** : ≈ 39 Mo à l'installation, trop lourd pour un téléphone.
- **Supabase Storage** : autre origine, projet Free mis en pause après une semaine sans activité, trafic compté.
- **Recopier en Python les règles qui construisent les textes dits** : double écriture, risque d'écart avec le domaine.
- **Changer la hauteur des MP3 selon le personnage guide** : voix déformée.
- **Assemblage de morceaux enregistrés dès cette story** (calculs, choix) : reporté à une story de suite.
- **Autres voix Piper** (`upmc` Jessica, `siwis`, `upmc` Pierre) : écartées par le PO après écoute.

## Conséquences

- Le dépôt et le build grossissent d'environ 39 Mo (32 kbit/s), sous un budget de 45 Mo ; l'envoi WebDAV n'envoie que les fichiers nouveaux.
- Les textes fabriqués à la volée (calculs tirés au hasard, prénom, leçons personnelles, mots de la semaine, lecture des choix) restent sur la voix de l'appareil ; sur un appareil sans voix française, ils ne sont pas dits (message de voix indisponible), sauf les paroles avec prénom qui ont un texte enregistré de remplacement.
- Une seule voix d'homme pour tous les personnages guides.
- Toute phrase nouvelle ou modifiée dans le domaine ou la bibliothèque demande une regénération ; un test de couverture le rappelle.
- Un script Deno entre dans `scripts/` (exception documentée ici).
- Voix, jusqu'ici seulement en amont (décisions 0007 et 0008), lit en lecture seule le domaine pur d'Apprentissage (`textesDitsDansLaLecon`, `motsDitsLentementDansLaLecon`, `parolesFixesDApprentissage`), de Motivation (`parolesFixes`) et du Catalogue (`lireLecon`, `Niveau`), uniquement dans `voix/application/` et dans `scripts/voix/` ; `voix/domain/` reste sans dépendance (note datée du 2026-11-11 dans `docs/domain/context-map.md`).
- Le front peut importer un cas d'usage **pur** de `voix/application/` par l'alias `@application/` (lecture seule, sans infrastructure), en complément de la décision 0003 qui ne parle que de `domain/`.
- Licence AGPLv3 du modèle : à faire confirmer avant une publication commerciale.
