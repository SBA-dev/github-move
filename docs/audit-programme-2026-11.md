# Audit du programme, objectif par objectif (novembre 2026)

**Pourquoi.** Un parent a signalé des devoirs sans leçon : le présent des verbes en -ir, les doubles et moitiés des grands nombres. Leur **section** du programme avait pourtant déjà une leçon. L'audit a donc été refait **objectif par objectif**, pour chaque matière et chaque classe, à partir des extraits de `app/programmes-index.json`.

**Résultat.** La bibliothèque passe de 265 à **428 leçons**. Il y a 3 leçons écrites à la main (présent en -ir, présent des trois groupes, doubles et moitiés des grands nombres) et 160 leçons des modules `scripts/lecons/complements_*.py` : 20 par module.

| Module | Périmètre | Leçons |
|---|---|---|
| `complements_francais_c2` | français CP, CE1, CE2 | 20 |
| `complements_francais_c3` | français CM1, CM2 | 20 |
| `complements_maths_cp_ce1` | maths CP, CE1 (dont les sections « longueurs et masses ») | 20 |
| `complements_maths_ce2` | maths CE2 | 20 |
| `complements_maths_c3` | maths CM1, CM2 (dont le tableau de numération et la section « les angles ») | 20 |
| `complements_sciences` | sciences CP à CM2 : 20 sections qui n'avaient aucune leçon | 20 |
| `complements_histoire_emc` | histoire, géographie, EMC : les 12 sections sans leçon | 20 |
| `complements_anglais` | anglais CP à CM2 | 20 |

Les leçons varient les exercices (maisons à ranger, frises, schémas en barres, défis chronométrés, petites histoires) et mettent les questions en situation, avec Noisette et Lumi.

## Ce que l'application ne permet pas de faire
- Écriture manuscrite, copie, oral en classe, manipulations, projets, sorties.
- **Tracés** (règle, équerre, compas, symétrie sur quadrillage) et exercices qui demandent une **image** : horloge à aiguilles, patrons, assemblages de cubes, vrai tableau ou vraie droite graduée.
- **Soustraction posée** : pas de type d'exercice. De plus, le programme veut un seul algorithme par école (« par cassage » ou « par compensation »).
- **Calculs posés avec des décimaux** : `calcul` et `addition` n'acceptent que des entiers.
- Pistes d'évolution du moteur : un exercice horloge, un exercice tableau, une droite graduée, une soustraction posée, la voix `en-GB` pour les lectures d'anglais.

## À décider par le PO
1. **Puberté et reproduction humaine** (sciences CM1, CM2) : aucune leçon écrite.
2. **Relecture humaine** (décision 0030) :
   - `hg-cm2-seconde-guerre`, la Seconde Guerre mondiale ;
   - `hg-cm1-caravelles`, la traite et l'esclavage ;
   - `sc-cm1-ovipare-vivipare`, la reproduction animale ;
   - `sc-cm2-fossiles`, la disparition des dinosaures.
3. **Hors des extraits du programme de CM1-CM2** : le conditionnel, et les homophones a/à, son/sont. Ils n'ont pas de leçon ; faut-il en écrire quand même ?
4. **Prononciation des lettres en anglais**, donnée par approximation française (`an-ce1-alphabet`) : à valider.
5. **Lettres symétriques** (`ma-cm1-symetrie`) : les réponses supposent une police bâton. À vérifier avec la police de l'application et avec celle du mode dys.

## Restent à faire (prochain lot, dans l'ordre d'utilité)
- **Français**
  - CE2 : un son, plusieurs écritures (o/au/eau, é/er/ez) ; le 3e groupe à l'imparfait et au futur ; récit, documentaire ou texte qui explique comment faire.
  - CP à CE2 : les niveaux de langue ; les accents (CP) ; s prononcé ss ou z (CE1).
  - CM : verbe ou nom (il élève / une élève) ; les genres de textes ; les documents composites ; la polysémie.
- **Maths**
  - CE1 : écriture en lettres jusqu'à 1000 ; 13 × 7 en décomposant ; les ordinaux jusqu'à 100.
  - CP : gauche et droite ; relier une heure à un moment de la journée.
  - CE2 : la nature des faces des solides.
  - CM1 : probable, peu probable, une chance sur deux ; les parenthèses ; l'arrondi.
  - CM2 : le diagramme circulaire ; les probabilités en deux étapes ; encadrer les nombres jusqu'au milliard.
- **Sciences**
  - CE1 : les besoins et les parties d'une plante (prioritaire) ; l'air existe.
  - CM2 : l'appareil digestif ; climat et météo ; le choix des matériaux.
  - CM1 : les ombres et les phases de la Lune.
  - CP : l'origine des aliments.
- **Histoire-géographie**
  - CE1 : ville et village.
  - CE2 : l'art pariétal ; la société romaine.
  - CM1 : art roman et art gothique ; les Lumières.
  - CM2 : l'abolition de l'esclavage (1794, puis 1848) ; les 18 régions.
- **Anglais**
  - CP : les mots interrogatifs.
  - CE1 : « Can I have…? ».
  - CE2 : can / can't ; les transports.
  - CM1 : les pronoms possessifs.
  - CM2 : les nombres ordinaux.

Les leçons ont été rédigées par 8 agents en parallèle, selon une consigne commune, puis vérifiées une par une :
- citations du programme recopiées mot pour mot ;
- ordre libre dans chaque classe ;
- leçons lues par le moteur TypeScript ;
- tests pytest du pipeline ;
- recherche de doublons et de mots sensibles.
