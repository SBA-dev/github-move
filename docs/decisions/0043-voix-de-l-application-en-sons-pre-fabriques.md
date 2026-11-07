# 0043 : La voix de l'application est faite de sons de phrases fabriqués à l'avance (Piper, voix « tom »), servis avec l'application, avec repli phrase par phrase sur la voix de l'appareil ; deux ports dans le domaine Voix ; inventaire des phrases par un script Deno dans `scripts/`

**Statut** : Acceptée · 2026-11-07 (story #182, cadrage validé par le PO, « reco tout » : questions 182.1 à 182.28). Précise 0004 ; prolonge 0007 et 0008.

## Contexte

Sur certains appareils (Honor Magic, par exemple), le navigateur n'a aucune voix française : la synthèse vocale se tait ou lit avec une voix étrangère, et l'enfant voit le message de voix bloquée, qui est trompeur. La décision 0004 prévoyait, dans la stack cible, des MP3 générés une seule fois avec une voix neuronale et un repli sur la voix du navigateur, sans dire comment.

Le PO a écouté plusieurs voix Piper (outil de synthèse libre, qui tourne en local) et a retenu `fr_FR-tom-medium` (« tom »), sous licence AGPLv3. Les phrases à dire viennent de deux endroits : la bibliothèque (`app/bibliotheque.json`, lue par `lireLecon` dans `@domain/catalogue`) et les paroles fixes des personnages guides, écrites en TypeScript dans les domaines (Motivation, et Apprentissage après 182.21). Le découpage en phrases (`texteALire`) est déjà dans `voix/domain/`. Le pipeline de contenu, lui, est en Python (CLAUDE.md).

## Décision

1. **Sons de phrases fabriqués à l'avance.** Chaque phrase connue à l'avance a un son de phrase, fabriqué par Piper sur la machine de fabrication, converti en **MP3 mono, 22,05 kHz, 32 kbit/s** (182.6). Seuls les sons produits sont livrés : le modèle de voix est téléchargé à la fabrication avec une empreinte vérifiée, jamais commité ni publié ; l'auteur est crédité dans `public/voix/LICENCE-tom.txt` et la documentation ; un avis juridique sera demandé avant toute publication commerciale (182.9). Aucun texte ne quitte la machine de fabrication.
2. **Servis avec l'application.** Les sons et le répertoire des sons sont dans le dépôt et le build, sous `public/voix/`, servis par alwaysdata avec le front (182.5) : même origine, pas de quota de trafic Supabase, pas de voix coupée quand le projet Free est en pause. Un **plafond de 40 Mo** pour `public/voix/` fait échouer le pipeline s'il est dépassé (182.7), dans l'enveloppe d'environ 100 Mo de l'offre gratuite (0025). Les fichiers sont générés, jamais édités à la main.
3. **Clé et fichiers.** La clé d'un son est **la phrase normalisée elle-même**, calculée par `CleDeLaPhrase` dans `voix/domain/`. Le nom du fichier est une **empreinte de ce qui est dit** (prononciation corrigée, version de la voix, débit), calculée par le pipeline seul et opaque pour le front (182.11) : la fabrication est incrémentale, un fichier ne change que si ce qu'il dit change, et les orphelins sont supprimés (182.12).
4. **Inventaire des phrases par un script Deno dans `scripts/`** (182.10). `scripts/voix/inventaire-des-phrases.ts` importe `@domain/catalogue`, `@domain/motivation`, `@domain/apprentissage` et `@domain/voix`, et écrit l'inventaire (phrases découpées, clés). Le reste du pipeline (table de prononciation, appel à Piper, conversion, répertoire, contrôles) reste en Python et testé par pytest ; il ne recalcule jamais une clé. C'est la seule exception au « pipeline en Python » : un script de lecture, sans règle propre, qui exécute les règles du domaine.
5. **Deux ports dans le domaine Voix** (0007, 0008). `RepertoireDesSons` (`sonDe(cle)`) et `LecteurDeSonsDePhrases` (`jouer`, `arreter`) sont déclarés dans `voix/domain/` ; `LecteurAVoixHaute` reste le port de la voix de l'appareil. Le service `LectureAVoixHaute` construit un **plan de lecture** pur, phrase par phrase : voix imposée par le parent s'il y en a une (182.14) ; sinon son de phrase ; sinon voix française de l'appareil ; sinon rien (voix absente, 182.15). Les adaptateurs (`src/voix/`) ne contiennent aucune règle : ils lisent le répertoire, jouent l'audio à la vitesse demandée hauteur gardée, et traduisent les erreurs du navigateur en `VoixBloquee`, `VoixAbsente` ou `SonIllisible`.
6. **Hors ligne.** Le répertoire fait partie de la coquille précachée ; les sons vont dans un cache à part, gardé d'une version à l'autre ; ceux d'une leçon sont mis en réserve à son lancement, ceux de la prochaine leçon du parcours à la fin d'une séance, les paroles fixes communes au premier lancement, dans une réserve de 20 Mo au plus (182.19).

## Options écartées

- **Synthèse vocale du navigateur seule** (situation actuelle) : pas de voix française sur certains appareils, voix très inégales d'un appareil à l'autre.
- **Synthèse à la demande par un service en ligne** : coût, dépendance réseau, et textes envoyés à un tiers.
- **Sons dans Supabase Storage** ou **Git LFS** (182.5 B, C) : quota de trafic et pause du projet Free ; outillage de plus pour les sessions cloud.
- **Règle de clé réécrite en Python** avec des vecteurs de test partagés (182.10 B) : deux codes pour une règle, et les paroles fixes, écrites en TypeScript, resteraient illisibles pour Python.
- **Empreinte de la phrase calculée dans le domaine** comme clé : une fonction de hachage à écrire en TypeScript pur, sans gain de poids réel.
- **Adaptateur composite dans `src/`** (« MP3 sinon synthèse ») derrière l'unique port `LecteurAVoixHaute` : le repli phrase par phrase, l'arrêt commun et la distinction voix bloquée / voix absente seraient cachés dans l'infrastructure, hors des tests du domaine.
- **Un son par prénom** (182.2 C) : donnée d'enfant transformée et stockée, contraire à la minimisation.

## Conséquences

- Deno entre dans `scripts/`, pour l'inventaire seulement. La commande de fabrication et ses tests sont ajoutés au tableau des commandes de `CLAUDE.md` par la story.
- `public/voix/` grossit le dépôt et le build : le plafond de 40 Mo et la fabrication incrémentale sont des contrôles du pipeline ; tout dépassement repasse par le PO (débit, variantes finies, stockage).
- Le format du répertoire des sons devient un contrat entre le pipeline et Voix, comme le format des leçons : il est documenté et testé des deux côtés.
- Les phrases fabriquées à la volée (calculs, nombres tirés au hasard, leçons personnelles) restent lues par la voix de l'appareil ; l'assemblage de morceaux fera l'objet d'une story de suite (182.1).
- Tous les personnages guides parlent avec la voix « tom », sans caractère de voix sur les sons de phrases (182.3, 182.4) ; une autre voix demandera une nouvelle décision.
- Un son de phrase ne contient jamais de prénom ni rien de ce que produit l'enfant ; il ne dit que des textes déjà soumis à la règle absolue sur les contenus pour les enfants (décisions 0028 à 0030), et la table de prononciation ne peut pas ajouter de mot.
