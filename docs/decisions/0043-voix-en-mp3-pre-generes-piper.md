# 0043 : La voix du personnage guide est une voix enregistrée (MP3 fabriqués par Piper, voix « tom »), avec repli phrase par phrase sur la voix de l'appareil

**Statut** : Proposée · 2026-11-10 (story #182, cadrage ; à accepter avec les réponses du PO aux questions 182.1 à 182.14 de `docs/stories/182/domain-model.md`). Précise 0004 ; s'appuie sur 0007 et 0008.

## Contexte

Sur un téléphone Android sans voix française installée, aucune leçon n'est lue à voix haute, et l'enfant voit « La voix de … est bloquée par ce navigateur », message trompeur. Installer une voix est trop compliqué pour les familles. La décision 0004 prévoyait déjà des MP3 générés une seule fois avec une voix neuronale et un repli sur la voix du navigateur ; le port `LecteurAVoixHaute` (0007, 0008) a été prévu pour cet adaptateur.

Le PO a choisi (2026-11-07) l'outil **Piper** (open source, local, sans compte ni clé) et, après écoute, la voix **`fr_FR-tom-medium`** (modèle sous AGPLv3).

## Décision (proposée)

1. **Voix enregistrée** : chaque phrase connue à l'avance (textes dits pendant les leçons de la bibliothèque, paroles fixes des personnages guides) a un **MP3 mono** fabriqué par le pipeline de contenu avec Piper. L'application ne contient que les MP3, **jamais le modèle** ; l'auteur de la voix est crédité dans `public/voix/LICENCE-voix-tom.txt`.
2. **Clé de phrase** : chaque MP3 est retrouvé par une clé calculée sur le texte de la phrase (découpage et normalisation de `texteALire`, NFC, apostrophe droite ; FNV-1a 64 bits en hexadécimal). Le même calcul existe en TypeScript (domaine Voix) et en Python (pipeline), prouvé égal par un jeu de cas partagé (`docs/voix/cas-des-cles-de-phrases.json`).
3. **Répertoire des phrases enregistrées** publié avec les MP3 ; le nom de chaque MP3 contient sa clé et son **empreinte de fabrication** : une phrase regénérée change d'adresse, et la fabrication saute les fichiers déjà faits (reprenable, par niveau).
4. **Table de prononciation** dans le pipeline seulement : elle corrige le texte envoyé à la voix, jamais le texte affiché ni le sens.
5. **Lecture** : un service du domaine Voix (`LecteurAvecRepli`, qui implémente `LecteurAVoixHaute`) joue le MP3 de chaque phrase et **se replie phrase par phrase** sur la voix de l'appareil pour une phrase sans MP3 lisible ou dans une autre langue. Muet, voix suspendue et arrêt s'appliquent aux MP3. Surlignage approximatif (durée répartie au prorata des caractères). Sans MP3 ni voix française : **Voix indisponible**, avec un message juste ; « Voix bloquée » reste pour un refus du navigateur.
6. **Stockage et hors ligne** (à confirmer, 182.4) : MP3 dans le dépôt et le build (`public/voix/`), servis par l'hébergement du front ; cache à part dans le service worker, non vidé à chaque publication ; mise en cache des MP3 d'une leçon à son ouverture ; pas de précache complet.
7. **Énumération des phrases** (à confirmer, 182.10) : la liste des phrases à fabriquer est produite par le domaine TypeScript et exportée par un script Deno ; le pipeline Python fabrique les MP3.

## Options écartées

- **Faire installer une voix française par la famille** : trop compliqué (constat de l'issue).
- **Voix neuronale en ligne (service tiers)** : compte, clé, coût, et textes envoyés hors de la machine de génération.
- **Synthèse à la demande dans une Edge Function** : coût et latence à chaque phrase, rien hors ligne.
- **Précache de tous les MP3** : ≈ 39 Mo à l'installation, trop lourd pour un téléphone.
- **Supabase Storage** (si 182.4 confirme A) : autre origine, projet Free mis en pause après une semaine sans activité, trafic compté.
- **Autres voix Piper** (`upmc` Jessica, `siwis`, `upmc` Pierre) : écartées par le PO après écoute.

## Conséquences

- Le dépôt et le build grossissent d'environ 39 Mo (32 kbit/s) ; un budget de poids fait échouer le build au-delà ; l'envoi WebDAV n'envoie que les fichiers nouveaux.
- Les textes fabriqués à la volée (calculs tirés au hasard, prénom, leçons personnelles, lecture des choix) restent sur la voix de l'appareil, jusqu'à une éventuelle story d'assemblage.
- Une seule voix d'homme pour tous les personnages guides : la hauteur du caractère de la voix ne s'applique plus qu'au repli.
- Toute phrase nouvelle ou modifiée dans le domaine ou la bibliothèque demande une regénération ; un test de couverture le rappelle.
- Licence AGPLv3 du modèle : à faire confirmer avant une publication commerciale.
