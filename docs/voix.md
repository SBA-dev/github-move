# Voix de l'application : fabriquer les sons de phrases

La voix de l'application est la voix `fr_FR-tom-medium` de Piper, créée par Tjiho (licence AGPLv3).
Ses sons sont fabriqués à l'avance par le pipeline de contenu et servis avec l'application (`public/voix/`).
Décision d'architecture : `docs/decisions/0043-voix-de-l-application-en-sons-pre-fabriques.md`.
Le modèle n'est jamais commité ni livré ; seuls les sons le sont, avec `public/voix/LICENCE-tom.txt`.
Les fichiers de `public/voix/` sont générés : on ne les édite jamais à la main.

## Regénérer les sons

1. Installer Piper dans un environnement Python à part (hors dépôt) :
   `python3 -m venv ~/piper && ~/piper/bin/pip install piper-tts`
2. Télécharger le modèle (`.onnx` et `.onnx.json`) depuis `rhasspy/piper-voices` sur Hugging Face,
   dossier `fr/fr_FR/tom/medium`, dans un dossier hors dépôt.
3. Installer `ffmpeg` (avec `ffprobe`) et Deno.
4. Lancer :
   ```
   VOIX_PIPER_MODELE=<dossier>/fr_FR-tom-medium.onnx ~/piper/bin/python scripts/voix/fabriquer_les_sons.py
   ```
   Option `--modele <chemin>` à la place de la variable, `--inventaire <fichier.json>` pour utiliser un inventaire déjà produit
   (`deno run --allow-read --allow-write scripts/voix/inventaire-des-phrases.ts <sortie.json>`).

La commande produit l'inventaire des phrases (Deno, même code que le front pour la clé de la phrase),
fabrique les sons manquants (MP3 mono, 22,05 kHz, 32 kbit/s), écrit `public/voix/repertoire.json`,
supprime les MP3 orphelins, affiche un rapport (phrases, fabriqués / gardés, durée, poids) puis lance les contrôles.
Elle échoue (code de sortie différent de 0) et liste les problèmes s'il manque un son, s'il reste un orphelin,
si le poids dépasse le plafond ou si la licence manque.
La fabrication est incrémentale : une phrase dont la prononciation corrigée, la voix et le débit n'ont pas changé garde son fichier.
Compter environ 20 minutes pour toute la bibliothèque (Piper rend environ 4 s d'audio par seconde de calcul).

## Table de prononciation

`scripts/voix/prononciation.py` corrige ce que dit Piper, jamais le texte affiché, la clé ni le sens.
Elle ne s'applique pas à la voix de l'appareil. Chaque entrée porte un exemple et la prononciation attendue,
validés à l'écoute par le PO. Ajouter une entrée ne refabrique que les phrases concernées.

## Plafond

`public/voix/` ne dépasse pas 40 Mo (contrôle de la commande et de `scripts/tests/test_voix_controles.py`).
Le site entier tient dans environ 100 Mo d'hébergement (décision 0025).

## Écoute de contrôle

    python3 scripts/voix/ecoute_de_controle.py <niveau> [--paroles-communes] [--inventaire inventaire.json]

Écrit `ecoute/ecoute-<niveau>.html` (dossier ignoré par git, jamais publié) : toutes les phrases des leçons du niveau,
dans l'ordre de la bibliothèque, chacune avec un lecteur audio (`public/voix/`) et un bouton « mal prononcé ».
Les phrases ainsi signalées s'accumulent dans une liste copiable, à reporter dans la table de prononciation.
`--paroles-communes` ajoute les paroles des personnages guides connues à l'avance.
La page n'appelle aucun service externe.

## Tests

`python3 -m pytest scripts/tests` (table, fabrication, contrôles, commande) et `deno test scripts/voix/` (inventaire).
