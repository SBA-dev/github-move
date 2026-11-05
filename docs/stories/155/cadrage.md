# #155 : régressions de la non-régression de nuit du 05/11 (cadrage)

Correctifs, sans concept nouveau : pas de modèle de domaine, pas de nouveau scénario.

## Reproduction sur `main` (`4742309`), 1 worker

| Scénario | `tablette` | `telephone` |
|---|---|---|
| `129-parchemin.feature:383`, exemple « la poésie » | KO (hauteurs 470 et 438 px) | vert |
| `129-parchemin.feature:383`, exemple « le texte » | vert | vert |
| `19-dictee-et-conjugaison.feature:42` | vert (6 sur 6) | vert |
| `23-aide-et-je-ne-sais-pas.feature:85`, exemple `boite` (au CP, avec les choix) | KO | KO |
| `23-…:85`, les 8 autres exemples | verts | verts |

## Diagnostic

### 1. Parchemin de la poésie : défaut de l'application (#129)
Le vers lu est mis en gras (`.un-vers[data-lu="true"] { font-weight: 700 }`, règle de la mémorisation).
Dans la colonne du parchemin (330 px), un vers long en gras passe sur deux lignes : le vers 1, 3, 4 ou 5 en cours de lecture
mesure 80 px au lieu de 48. Le parchemin grandit alors d'une ligne (32 px) puis rapetisse : le texte bouge pendant la lecture.
Sur `telephone`, la police plus petite (`max-width: 480px`) évite le retour à la ligne.

Correction prévue : dans le parchemin, le vers lu reste mis en avant (surlignage et trait à gauche) sans changer la largeur
des lettres (pas de gras). Test rouge : le scénario `129:383` « la poésie » sur `tablette`.

Ajout après le premier run (`9f2e026`) : le vers lu est aussi découpé en mots surlignables (`.mot { padding: 0 2px }`) ;
leur marge est compensée dans le parchemin (`margin-inline: -2px`), sinon un vers long passe encore sur deux lignes.

### 2. « Je ne sais pas » dans une boîte : défaut de l'application (#131)
Depuis #131, la boîte est un dessin dont tout le contenu est en position absolue. La zone de l'exercice s'ajuste à son contenu :
tant que les choix ne sont pas affichés (pendant le déroulé), la boîte mesure 0 px de large. L'enfant voit les jetons tomber,
mais pas la boîte. Le step attend que la boîte soit visible avant de finir le déroulé : il attend 20 s.

Correction prévue : la zone de l'exercice prend toute la largeur quand elle contient une boîte à jetons, comme pour le petit train
(`77a5602`). Test rouge : le scénario `23:85` exemple `boite`, sur les deux projets.

### 3. Dictée « Le mot bien écrit est montré et félicité » : step à rendre sûr
Non reproduit à 1 worker (6 sur 6). « 5 éléments au lieu de 4 » : les 5 cases de « chien », le mot suivant de
« J'écris les animaux ». La dictée est donc passée au mot suivant avant le `Alors Léa voit le mot « chat » écrit`.
Cause : le step `Noisette dit une félicitation, suivie de « … »` (`exercices-a-choix.steps.ts`) lit le journal des paroles,
puis termine la lecture en cours, en deux allers-retours : si la félicitation commence entre les deux, le step la termine
à tort, et la dictée passe au mot suivant. Sous charge (3 workers, la nuit), la fenêtre s'élargit.
#130 et #131 ont déjà corrigé cette course dans leurs steps (`terminerLaLectureSiCenEstPas`).

Correction prévue : le step décide dans la page, en un seul appel, de terminer ou non la lecture en cours (même sens du scénario).

## Autres KO connus
Aucun n'a, à la lecture, l'une de ces trois causes de façon certaine. `102:155` (phrase de fin du personnage guide) attend aussi
la fin d'une parole : à regarder si la course du point 3 s'y retrouve.
