# Critères d'acceptance : issue #6, Design, univers et personnage guide

Scénarios : `features/6-univers-et-personnage-guide.feature` (tags `@issue-6 @wip`).
Modèle du domaine : `docs/stories/6/domain-model.md` (contexte Motivation).

## Objectif

En tant qu'**enfant**, je veux jouer dans l'univers que j'ai choisi, avec son personnage guide qui me parle et réagit, afin d'avoir envie de revenir réviser.

Comportement actuel (`app/`) : `WORLDS` et `PALETTES` (6 univers), `setChild` (univers par défaut `animaux`), humeurs `think` / `cheer`, `PRAISE`, `OOPS`, `VOICE_STYLE.cri`, en-tête de `app/index.html`, `REDUCED` et `@media (prefers-reduced-motion)`. Il donne les premiers exemples.

Le choix de l'univers dans le profil enfant arrive au lot 2, avec l'écran « Qui joue ? ». Au lot 1, les scénarios partent de **profils enfants préparés pour les tests** (décision n°2 du lot 1), qui ont déjà un prénom, un niveau et un univers (précondition « Léa a un profil enfant préparé… »).

Les humeurs, félicitations et encouragements se vérifient sur la **page de démonstration réservée aux tests** (décision n°1 du lot 1) : elle montre une consigne et le personnage guide, et permet de donner une bonne réponse ou de faire une erreur. Elle est retirée au lot 3 ; les mêmes scénarios passeront alors par les exercices.

Référence visuelle et animation (décision n°9) : l'artifact « Savanturier Web animé ». Le personnage guide est dessiné en SVG et animé avec Motion (respiration, clignement, saut de joie, tête penchée).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Chaque univers a son personnage guide et son paysage | Dans l'univers « <univers> », le personnage guide est <personnage guide> (6 univers) · <personnage guide> se présente avec son titre et son royaume (6 univers) · Deux univers différents donnent deux paysages et deux couleurs principales différents |
| 2 | Sans univers connu, l'enfant joue dans l'univers « Animaux de la forêt », avec Noisette | Sans profil enfant en cours, Noisette accueille l'enfant (`@a-valider`) · Un profil enfant <cas> joue avec Noisette (sans univers, univers inconnu) |
| 3 | Le personnage guide montre son humeur : content par défaut, il applaudit après une bonne réponse et réfléchit après une erreur | Le personnage guide est content quand l'enfant commence à jouer · Le personnage guide applaudit après une bonne réponse · Le personnage guide réfléchit après une erreur · Après avoir réfléchi, le personnage guide applaudit la bonne réponse suivante |
| 4 | Le personnage guide félicite avec ses propres expressions ou une félicitation commune, et encourage sans jamais punir | Après une bonne réponse, <personnage guide> dit une félicitation commune ou une de ses expressions (6 univers) · Les félicitations communes sont les mêmes dans tous les univers · Après une erreur, le personnage guide encourage sans punir |
| 5 | L'en-tête donne toujours accès à l'accueil, au son, au retour et à l'espace parent, et montre l'enfant en cours | L'en-tête montre le prénom et le niveau de l'enfant en cours · Sans profil enfant en cours, l'en-tête n'affiche aucun prénom (`@acces`) · Le nom de l'application ramène à l'accueil (`@a-valider`) · Le retour n'est proposé que s'il y a un écran précédent (`@a-valider`) · L'entrée de l'espace parent s'appelle « Espace parent » |
| 6 | L'univers et le personnage guide restent utilisables sur un petit écran et avec les mouvements réduits | L'univers tient dans la largeur d'un écran de <largeur> px (360, 820, 1280) · Les commandes de l'en-tête sont assez grandes pour un doigt d'enfant · L'en-tête s'utilise au clavier · Avec les mouvements réduits, le personnage guide ne saute pas mais son visage montre qu'il applaudit · Avec les mouvements réduits, le personnage guide ne penche pas la tête mais son visage montre qu'il réfléchit · Avec les mouvements réduits, le paysage reste immobile |

Total : 6 règles, 23 scénarios (41 cas exécutés avec les exemples des plans).

Étapes réutilisées : « j'ouvre Savanturier », « je vois le nom de l'application », « la page tient dans la largeur de l'écran » (`features/0-socle.feature`), « l'écran de l'appareil mesure <largeur> px de large » (`features/8-pwa-installable.feature`).

Textes repris **mot pour mot** du legacy (décision n°3) : félicitations communes (`PRAISE`), encouragements (`OOPS`), expressions de chaque personnage guide (`VOICE_STYLE.cri`). La présentation « Je t'entends ! Je suis <nom du personnage guide>. » est vérifiée par la story #7.

Écarts voulus avec le legacy :
- l'entrée s'appelle « Espace parent », et non plus « Espace adulte » (`CLAUDE.md`) ;
- le personnage guide applaudit **toujours** après une bonne réponse et réfléchit **toujours** après une erreur, y compris dans l'exercice « classer ».

Ce qui n'est pas vérifié en E2E mais par les tests unitaires du domaine (`@domain/motivation`) : la proportion des expressions du personnage guide parmi les félicitations (35 %), le tirage uniforme, le catalogue complet des 6 univers.

Droits d'accès : la story ne crée ni table ni donnée de famille, donc aucune policy RLS. Le seul scénario `@acces` vérifie que, sans profil enfant en cours, l'en-tête n'affiche le prénom d'aucun enfant.

## Hors périmètre

- Le choix et le changement d'univers dans le profil enfant, et l'écran « Qui joue ? » (lot 2).
- Le contrôle parental derrière l'entrée « Espace parent » (lot 2). Ici, on vérifie seulement que l'entrée est présente.
- La voix du personnage guide : lecture à voix haute, caractère de la voix, effet de Muet sur la voix (story #7). Le Muet gardé sur l'appareil et la présentation « Je t'entends ! Je suis <nom du personnage guide>. » au retour du son sont couverts par la règle 4 de `features/7-voix.feature`. Ici, on vérifie seulement que l'en-tête propose le choix Son/Muet.
- Les exercices eux-mêmes, la correction des réponses, la nouvelle chance après une erreur et l'aide propre à chaque question (lot 3).
- Les couleurs des colonnes de calcul (C vert, D rose, U bleu), identiques dans tous les univers : vérifiées au lot 3 avec l'addition posée, la page de démonstration ne montrant pas de calcul. L'invariant reste couvert par le modèle du domaine.
- L'écran de fin qui commence toujours par une expression du personnage guide avec 3 étoiles (lot 3, « Étoiles et écran de fin »).
- Le mode dys (lot 2, « Réglages »).
- Les épisodes, la cabane et les badges de l'univers (lot 5).
- Une animation Rive du personnage guide (une nouvelle décision serait nécessaire).

## Questions ouvertes

Aucune n'est bloquante pour la story. Les numéros entre parenthèses renvoient à l'ancienne liste.

1. (ancienne 3, suite) **Mots et lieu de la présentation avec titre et royaume** : le legacy ne l'affiche nulle part. Proposition à valider par un exemple : « Je suis Noisette, l'écureuil savant de la Forêt des Savanturiers. », sur la page de démonstration au lot 1, puis à l'accueil. Le scénario vérifie seulement que le titre et le royaume sont dits.
2. (ancienne 4) **Accueil sans profil enfant** : comme le legacy, l'accueil et le retour par le nom de l'application repassent-ils dans l'univers « Animaux de la forêt », même si l'enfant jouait dans un autre univers ? (oui / non ; sinon, l'accueil garde l'univers du dernier enfant). À trancher avec « Qui joue ? » (lot 2). Scénarios `@a-valider` : « Sans profil enfant en cours, Noisette accueille l'enfant », « Le nom de l'application ramène à l'accueil ».
3. (nouvelle, liée à la décision n°2 et à la décision n°5 de la story #5) **Écran vu sans profil enfant en cours** : le parent doit être connecté, puis il arrive dans l'espace parent. L'écran de connexion et l'espace parent sont-ils eux aussi dans l'univers « Animaux de la forêt », avec Noisette ? (oui / non). Même scénario `@a-valider` que la question 2.
4. (ancienne 7) **Retour dans l'en-tête** : sur quels écrans du lot 1 apparaît-il ? (par exemple : partout sauf l'accueil et l'écran de connexion). Scénario `@a-valider` : « Le retour n'est proposé que s'il y a un écran précédent ».
5. (ancienne 8, suite) « **accueil** » : est-ce l'écran « Aujourd'hui » du lot 4 ? (même question que la n°7 de la story #8)
6. (ancienne 8, suite) « **colonnes de calcul** » (centaines, dizaines, unités) : faut-il un terme du glossaire ? (oui / non ; à trancher au lot 3)

## Décisions

Validation n°1 du lot 1 par le PO, le 2026-10-22 (`docs/stories/lot-1-decisions.md`).

| Question | Réponse | Source |
|---|---|---|
| 1. Humeurs et paroles observables au lot 1 | Une **page de démonstration réservée aux tests** montre une consigne, les humeurs, les félicitations et les encouragements ; elle est retirée au lot 3. Les scénarios des règles 3, 4 et 6 y donnent une bonne réponse ou une erreur. | Tranchée, décision n°1 |
| 1 (suite). Couleurs des colonnes de calcul | Vérifiées au **lot 3**, avec l'addition posée. Scénario retiré de cette story. | Proposition appliquée (option a) |
| 2. Entrée dans l'univers au lot 1 | Profils enfants **préparés pour les tests** ; « Qui joue ? » arrive au lot 2. | Tranchée, décision n°2 |
| 3 (en partie). Titre et royaume | Le personnage guide se présente avec son titre et son royaume. `@a-valider` retiré ; les mots exacts restent ouverts (question 1). | Proposition appliquée |
| 5. Mouvements réduits | Le visage change encore (il sourit, il réfléchit) : seul signe de l'humeur. `@a-valider` retiré. | Proposition appliquée |
| 6. Présentation au retour du son | **Oui**, texte du legacy mot pour mot : « Je t'entends ! Je suis <nom du personnage guide>. », le personnage guide dit son propre nom. Scénario déplacé dans la story #7 (règle 4), avec le Muet gardé sur l'appareil. | Tranchée, décision n°3 |
| Univers inconnu (modèle M3) | `animaux` (Noisette), **sans message**. `@a-valider` retiré. | Proposition appliquée |
| Toujours applaudir / réfléchir (modèle M4) | **Toujours**, y compris dans « classer » (écart voulu avec le legacy). `@a-valider` retiré. | Proposition appliquée |
| Textes des félicitations, encouragements et expressions | Repris **mot pour mot** du legacy. `@a-valider` retiré. | Tranchée, décision n°3 |
| Nouvelle chance après une erreur | Vérifiée au lot 3 avec les exercices ; la page de démonstration vérifie seulement l'encouragement. | Conséquence de la décision n°1 |
| 8 (en partie). « paysage », « couleur principale », « en-tête », « mouvements réduits », « page de démonstration » | Termes d'interface, **hors glossaire**. | Proposition appliquée (modèle) |
| Référence visuelle | Artifact « Savanturier Web animé » ; SVG animé avec Motion. | Tranchée, décision n°9 |
