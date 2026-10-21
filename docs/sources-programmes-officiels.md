# Programmes officiels de l'école élémentaire (CP → CM2) — inventaire des sources

État au 21 octobre 2026 (année scolaire 2026-2027). Les textes officiels sont téléchargés dans
[`sources/`](../sources/README.md) : PDF d'origine dans `sources/pdf/`, texte extrait dans `sources/texte/`.

## Une période de transition

Les programmes de 2015 (consolidés au BO n° 31 du 30 juillet 2020, sciences de cycle 3 révisées au
BO n° 25 du 22 juin 2023) sont remplacés discipline par discipline et niveau par niveau, de 2024 à
2027. L'application doit donc rattacher chaque contenu à **un texte, un niveau et une année d'application**.

## Texte applicable par niveau (calendrier officiel du ministère, version 07.2026)

Source : `sources/pdf/calendrier-nouveaux-programmes.pdf`. Entre parenthèses : la rentrée
d'application du nouveau programme. « ancien » = programme 2020/2023, encore en vigueur en 2026-2027.

| Discipline | CP | CE1 | CE2 | CM1 | CM2 |
|---|---|---|---|---|---|
| Français | nouveau (2025) | nouveau (2025) | nouveau (2025) | nouveau (2025) | nouveau (2026) |
| Mathématiques | nouveau (2025) | nouveau (2025) | nouveau (2025) | nouveau (2025) | nouveau (2026) |
| EMC | nouveau (2024) | nouveau (2025) | nouveau (2026) | nouveau (2024) | nouveau (2025) |
| EVAR (vie affective et relationnelle) | nouveau (2025) | nouveau (2025) | nouveau (2025) | nouveau (2025) | nouveau (2025) |
| Histoire-géographie | nouveau (2026) | ancien → 2027 | ancien → 2027 | nouveau (2026) | ancien → 2027 |
| Langues vivantes | nouveau (2026) | ancien → 2027 | ancien → 2027 | nouveau (2026) | ancien → 2027 |
| Sciences et technologie | nouveau (2026) | ancien → 2027 | ancien → 2027 | nouveau (2026) | ancien → 2027 |
| EPS | nouveau (2026) | ancien → 2027 | ancien → 2027 | nouveau (2026) | ancien → 2027 |
| Arts plastiques, éducation musicale, histoire des arts | ancien | ancien | ancien | ancien | ancien |

À la rentrée 2027, tout le CP → CM2 sera sous les nouveaux programmes, sauf les arts (projets du
Conseil supérieur des programmes publiés en 2025, pas encore adoptés).

## Ce qui est récupéré

| Fichier | Contenu | Pages | Couvre |
|---|---|---|---|
| `c2-francais` | Programme de français du cycle 2 (BO n° 41 du 31/10/2024) | 22 | CP, CE1, CE2 |
| `c2-mathematiques` | Programme de mathématiques du cycle 2 (BO n° 41 du 31/10/2024) | 38 | CP, CE1, CE2 |
| `c3-francais` | Programme de français du cycle 3 (BO du 17/04/2025) | 21 | CM1, CM2 (+ 6e) |
| `c3-mathematiques` | Programme de mathématiques du cycle 3 (BO du 17/04/2025) | 28 | CM1, CM2 (+ 6e) |
| `cp-terminale-emc` | Programme d'EMC du CP à la terminale (BO n° 24 du 13/06/2024) | 31 | CP → CM2 |
| `elementaire-evar` | Éducation à la vie affective et relationnelle, école élémentaire (février 2025) | 18 | CP → CM2 |
| `c2-histoire-geographie` | Nouveau programme d'histoire-géographie du cycle 2 (2026) | 8 | CP (CE1-CE2 en 2027) |
| `c3-histoire-geographie` | Nouveau programme d'histoire-géographie du cycle 3 (2026) | 15 | CM1 (CM2 en 2027) |
| `c2-sciences-technologie` | Nouveau programme de sciences du cycle 2 (BO n° 24 du 11/06/2026) | 12 | CP (CE1-CE2 en 2027) |
| `c3-sciences-technologie` | Nouveau programme de sciences du cycle 3 (BO n° 24 du 11/06/2026) | 18 | CM1 (CM2 en 2027) |
| `c2-langues-vivantes` | Nouveau programme de langues vivantes du cycle 2 (BO n° 12 du 19/03/2026) | 34 | CP (CE1-CE2 en 2027) |
| `c3-langues-vivantes` | Nouveau programme de langues vivantes, cours moyen (BO n° 12 du 19/03/2026) | 20 | CM1 (CM2 en 2027) |
| `c2-eps` | Nouveau programme d'EPS du cycle 2 (2026) | 16 | CP (CE1-CE2 en 2027) |
| `c3-eps` | Nouveau programme d'EPS du cycle 3 (2026) | 10 | CM1 (CM2 en 2027) |
| `ancien-c3-programme-2023` | Ancien programme complet du cycle 3, toutes disciplines (BO 2020 + sciences 2023) | 108 | CM2 en 2026-2027 ; arts CM1-CM2 |
| `calendrier-nouveaux-programmes` | Calendrier officiel de mise en œuvre (07.2026) | 3 | — |

Les nouveaux programmes de français et de maths sont structurés **par année** (CP, CE1, CE2, CM1, CM2),
avec des objectifs d'apprentissage et des **« exemples de réussite »**, directement exploitables
pour concevoir des exercices.

## Fiabilité

- **Origine** : tous les PDF viennent des serveurs officiels `education.gouv.fr` et
  `eduscol.education.gouv.fr`, via les liens du calendrier officiel du ministère. Empreintes SHA-256
  dans `sources/SHA256SUMS`.
- **Qualité du texte** : extraction directe pour 15 documents. Les deux programmes de sciences
  (cycles 2 et 3) sont des PDF sans couche texte : leur texte a été obtenu par OCR (Tesseract, français).
  Il est de bonne qualité mais peut contenir des coquilles. En cas de doute, le PDF fait foi.
- **Couverture pour 2026-2027** : français, maths, EMC et EVAR sont complets du CP au CM2. Les autres
  matières sont complètes pour le CP, le CM1 et le CM2 (via l'ancien programme du cycle 3).
- **Manque** : l'**ancien programme du cycle 2** (BO n° 31 du 30/07/2020), encore applicable en
  2026-2027 au CE1 et au CE2 pour l'histoire-géographie, les sciences, les langues et l'EPS, et
  jusqu'à nouvel ordre pour les arts du CP au CE2. Le fichier officiel est derrière une protection
  anti-robot. Une copie publiée par l'académie de Strasbourg existe
  (`circ-ien-mulhouse1.site.ac-strasbourg.fr`, domaine non autorisé dans l'environnement).
  Ce manque disparaît pour l'histoire-géo, les sciences, les langues et l'EPS à la rentrée 2027.
- **Non récupérés** : les ressources d'accompagnement Eduscol (livrets, exemples de mise en œuvre),
  car les pages HTML d'Eduscol sont bloquées par Cloudflare depuis l'environnement. Utiles mais pas
  indispensables : le programme est le texte de référence.

## Sources

### Officielles
- Calendrier de mise en œuvre (07.2026) : https://eduscol.education.gouv.fr/sites/default/files/document/calendriernouveauxprogrammes-129025.pdf
- Français cycle 2 : https://www.education.gouv.fr/sites/default/files/document/Annexe%203%20%E2%80%93%20Programme%20de%20fran%C3%A7ais%20du%20cycle%202-403818.pdf
- Mathématiques cycle 2 : https://www.education.gouv.fr/sites/default/files/document/Annexe%204%20%E2%80%93%20Programme%20de%20math%C3%A9matiques%20du%20cycle%202-403821.pdf
- Français cycle 3 : https://www.education.gouv.fr/sites/default/files/programme-de-fran-ais-pour-le-cycle-3-439824.pdf
- Mathématiques cycle 3 : https://www.education.gouv.fr/sites/default/files/programme-de-math-matiques-pour-le-cycle-3-439827.pdf
- EMC CP → terminale : https://www.education.gouv.fr/sites/default/files/document/Annexe%20%E2%80%94%20Programme%20d%E2%80%99enseignement%20moral%20et%20civique%20du%20cours%20pr%C3%A9paratoire%20%C3%A0%20la%20classe%20terminale%20des%20voies%20g%C3%A9n%C3%A9rale%2C%20technologique%20et%20professionnelle%20et%20des%20classes%20pr%C3%A9parant%20au%20CAP-402159.pdf
- EVAR école élémentaire : https://www.education.gouv.fr/sites/default/files/document/Programme%20d%E2%80%99%C3%A9ducation%20%C3%A0%20la%20vie%20affective%20et%20relationnelle%20%C3%A0%20l%E2%80%99%C3%A9cole%20%C3%A9l%C3%A9mentaire-405261.pdf
- Histoire-géographie cycle 2 : https://www.education.gouv.fr/sites/default/files/document/annexe-3-programme-d-histoire-geographie-cycle-2-516776.pdf
- Histoire-géographie cycle 3 : https://www.education.gouv.fr/sites/default/files/document/annexe-4-programme-d-histoire-geographie-cycle-3-516779.pdf
- Sciences et technologie cycle 2 : https://www.education.gouv.fr/sites/default/files/document/annexe-1-programme-de-sciences-et-technologie-du-cycle-2-517289.pdf
- Sciences et technologie cycle 3 : https://www.education.gouv.fr/sites/default/files/document/annexe-2-programme-de-sciences-et-technologie-du-cycle-3-517292.pdf
- Langues vivantes cycle 2 : https://www.education.gouv.fr/sites/default/files/document/Annexe%201%20%E2%80%93%20Programme%20de%20langues%20vivantes%20%C3%A9trang%C3%A8res%20et%20r%C3%A9gionales%20pour%20le%20cycle%202%20-481187.pdf
- Langues vivantes cours moyen : https://www.education.gouv.fr/sites/default/files/document/Annexe%202%20%E2%80%93%20Programme%20de%20langues%20vivantes%20%C3%A9trang%C3%A8res%20et%20r%C3%A9gionales%20pour%20les%20classes%20de%20cours%20moyen%20%28cycle%203%29-481190.pdf
- EPS cycle 2 : https://www.education.gouv.fr/sites/default/files/document/annexe-1-programme-d-education-physique-et-sportive-cycle-2-516770.pdf
- EPS cycle 3 : https://www.education.gouv.fr/sites/default/files/document/annexe-2-programme-d-education-physique-et-sportive-cycle-3-516773.pdf
- Ancien programme du cycle 3 (en vigueur à la rentrée 2023) : https://eduscol.education.gouv.fr/sites/default/files/document/programme-d-enseignement-du-cycle-3-2023-100806.pdf
- Ancien programme du cycle 2 (BO n° 31 du 30/07/2020), page du BO : https://www.education.gouv.fr/bo/20/Hebdo31/MENE2018714A.htm — non récupéré

### Académiques (copies ou synthèses, secondaires)
- Ancien programme du cycle 2, copie de l'académie de Strasbourg : https://circ-ien-mulhouse1.site.ac-strasbourg.fr/wp-content/uploads/2021/06/2020-07-C2.pdf
- DSDEN 38 (Grenoble), lettre du 05/05/2025 : https://direction-1d-38.web.ac-grenoble.fr/sites/default/files/Media/document/Lettre%20d%27information%20DSDEN38%202025.05.05.pdf
- Académie de Bordeaux, maths cycle 3 : https://ent2d.ac-bordeaux.fr/disciplines/mathematiques/le-programme-de-cycle-3-a-partir-de-2025/

## Étapes suivantes
1. (Optionnel) Autoriser `circ-ien-mulhouse1.site.ac-strasbourg.fr` pour récupérer l'ancien programme du cycle 2.
2. Extraire les objectifs et « exemples de réussite » en données structurées
   (discipline → niveau → domaine → objectif → exemples → référence au texte source).
3. Construire les exercices interactifs à partir de ces données, chacun citant le texte officiel d'origine.
