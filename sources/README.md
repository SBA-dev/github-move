# Sources officielles

- `pdf/` : PDF officiels tels que téléchargés (le PDF fait foi). Empreintes dans `SHA256SUMS`.
- `texte/` : texte extrait de chaque PDF (`pdftotext -layout`), même nom de fichier.
  `c2-sciences-technologie.txt` et `c3-sciences-technologie.txt` ont été obtenus par OCR
  (Tesseract, français, 300 dpi), car ces PDF n'ont pas de couche texte.

- `termes-refuses/` : liste française de termes refusés (filtrage des saisies du parent, jamais montrée). Provenance, licences et traitements : `termes-refuses/PROVENANCE.md`.

Inventaire, calendrier d'application et URL d'origine : [`docs/sources-programmes-officiels.md`](../docs/sources-programmes-officiels.md).
