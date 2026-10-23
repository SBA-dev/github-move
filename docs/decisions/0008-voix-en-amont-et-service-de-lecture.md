# 0008 : Voix publie le caractère de la voix, et son service de lecture vit dans le domaine

**Statut** : Acceptée · 2026-10-22 · Précise la décision 0007

## Contexte

La décision 0007 crée le sous-domaine générique Voix et dit que « le caractère de la voix de chaque personnage guide est fourni par Motivation ». En codant la story #7, deux questions se sont posées :
- qui **définit** le type `CaractereDeLaVoix` : Motivation l'utilise pour chaque personnage guide, Voix en a besoin pour choisir et régler la voix ;
- où placer le service qui lit à voix haute (Son/Muet, une seule lecture à la fois, voix bloquée signalée une seule fois). C'est un service avec un état, qui orchestre trois ports : par nature, un cas d'usage.

## Décision

1. **Voix est en amont.** Le type `CaractereDeLaVoix` est publié par `voix/domain/` et importé par Motivation (`motivation/domain/personnage-guide.ts`). Motivation **fournit les valeurs** (le caractère de Noisette, de Lumi…), Voix **définit la forme**. Un sous-domaine générique ne dépend d'aucun contexte métier.
2. Voix déclare **sa propre interface `Hasard`**, de même forme que celle de Motivation, pour ne dépendre de rien.
3. Le service **`LectureAVoixHaute`** vit dans `voix/domain/`, et non dans `application/`. Il ne tourne que dans le navigateur, et le front n'importe que `@domain/<contexte>` (décision 0003). Il ne dépend que des ports déclarés dans `domain/` (décision 0007), reste en TypeScript pur, et est testé avec des fakes en mémoire.

## Options écartées

- `CaractereDeLaVoix` défini par Motivation : Voix dépendrait d'un contexte métier, et tout futur utilisateur de Voix (Accompagnement) avec lui.
- Un `Hasard` commun dans un dossier partagé : un module de plus pour une interface d'une ligne.
- Le service de lecture dans `application/` : le front devrait importer `application/`, ce que la décision 0003 ne prévoit pas.

## Conséquences

- Le sens de la relation dans la context map devient Voix (amont) → Motivation (aval) pour le type, Motivation fournissant les valeurs.
- Si d'autres services navigateur avec état apparaissent, ils suivront la même règle : dans `domain/`, seulement s'ils ne dépendent que de ports déclarés dans `domain/`.
