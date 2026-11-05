# Story #168 : le dessin fixe de Lili d'après la Lili de face retouchée dans 106h

## Contexte

Dans la planche de 106h, le PO a jugé que « Lili de face est pas bien faite » (#106.51). 106h a retouché Lili de face dans sa célébration de l'univers (`src/univers/celebrations/danse/`, commit `1f16045`) et le PO a validé la nouvelle version (https://github.com/SBA-dev/github-move/issues/106#issuecomment-6667593034).
Le dessin fixe de Lili (`src/univers/personnages/Lili.tsx`, #96) se voit sur l'accueil, dans « Qui joue ? » et à la fin de la séance. Il a les mêmes défauts : frange en zigzag qui fait deux « cornes » aux tempes avec un crâne qui paraît chauve, grosses oreilles en disques, nez cerclé de noir, cou en boîte (planche `106h-lili-fixe-tsx-meme-defaut-non-corrige.png`).
Le PO a demandé cette story et retenu la reco de #106.52 (« 106h reco tout ») : le dessin fixe de Lili est redessiné d'après la Lili de face validée de 106h.

## Objectif

En tant qu'enfant de l'univers « Danse », je veux que Lili ait le même dessin sur tous mes écrans et dans sa célébration, afin de reconnaître mon personnage guide partout.

## Règle

| Règle | Scénarios |
|---|---|
| Le dessin fixe de Lili est la Lili de face validée de 106h : queue de cheval haute, chevelure qui épouse le crâne et frange lisse, sans « cornes » aux tempes, oreilles plus petites et plus basses, nez discret, un cil par œil, cou plus fin, justaucorps violet cintré à manches, tutu rose court en cloche à festons, collant opaque, demi-pointes. Les trois humeurs du personnage guide et les tenues de #102 restent. Aucune étoile à cinq branches n'y figure, à aucune taille (106.34, 106.35). | `features/96-refonte-visuelle.feature` : Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> » (exemple Danse) |

L'allure du dessin (forme du crâne, taille des oreilles, finesse du cou, cintrage) ne se vérifie pas par un scénario : elle se valide sur la planche avant/après (voir 168.3, réponse 98.28).

## Scénario modifié

`features/96-refonte-visuelle.feature`, Plan du Scénario « Dans l'univers « <univers> », <personnage guide> a <son dessin> », exemple Danse (seule la colonne « son dessin » change ; la largeur des colonnes ne bouge pas) :

- Avant : `le dessin validé : queue de cheval haute, justaucorps violet et tutu rose`
- Après : `le dessin validé : queue de cheval haute, frange lisse, justaucorps violet et tutu rose à festons, sans étoile`

Au-dessus du Plan, un nouveau commentaire renvoie à #168 et à la reco de #106.52 :

```
# #168 (reco de #106.52) : Lili reçoit la Lili de face validée de 106h (#106.51), frange lisse et tutu à festons, sans étoile (106.34, 106.35).
```

Aucun tag ajouté : le scénario reste `@issue-96`. Le libellé suit la reco de 168.1 : si le PO choisit une autre option, il change avec elle.

## Ce que vérifiera le step

Le step « <personnage guide> a le dessin validé : … » vérifie les signes du dessin de Lili (selon la reco de 168.1 et 168.2) :

- signes présents : `queue-de-cheval-haute`, `frange-lisse`, `justaucorps-violet`, `tutu-rose` ;
- signe imbriqué : `festons` à l'intérieur de `tutu-rose` ;
- signes absents : `etoile` et `etoile-doree`.

Il ne vérifie pas le repère `data-dessin` ni la liste `DESSINS_REDESSINES`, retirés par #161 (décision 0033) : ils ne sont pas réintroduits.

## Scénarios rejoués

Le seul scénario qui inspecte le dessin de Lili :

1. Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> », exemple Danse.

Les scénarios qui montrent Lili sans inspecter son dessin, rejoués parce que le dessin change de taille et de points d'accroche des tenues (consigne du PO : rejouer #96 et ceux qui montrent Lili) :

2. `features/96-refonte-visuelle.feature` : « Sur un appareil réglé en mode sombre, l'enfant garde les couleurs de son univers » (univers Danse).
3. `features/96-refonte-visuelle.feature` : Plan « Sur <écran>, Léa voit <personnage guide> dans le paysage de l'univers « <univers> » » (exemples Danse : page de la leçon, fin du test de départ).
4. `features/11-profil-enfant.feature` : « Les profils enfants apparaissent dans l'ordre de leur création », « Léa choisit son profil enfant et son personnage guide la salue », « Léa choisit son profil enfant même sans réseau », « Choisir qui joue ne demande pas le contrôle parental ».
5. `features/6-univers-et-personnage-guide.feature` : Plan « Dans l'univers « <univers> », le personnage guide est <personnage guide> » (exemple Danse) ; les scénarios de la règle des humeurs (content, applaudit, réfléchit), s'ils jouent dans l'univers « Danse ».
6. `features/106-celebration-de-l-univers.feature` : « Au premier défi relevé dans l'univers « Danse », Lili entre en scène, fait une pirouette et le fête, puis félicite Léa » (la fin du défi montre le dessin fixe).
7. `features/102-personnage-guide-evolue.feature` : les scénarios des tenues, s'ils jouent dans l'univers « Danse ».

## Hors périmètre

- La scène de la célébration de Lili (#106, 106h) : elle est la référence, on n'y touche pas.
- Tout autre personnage guide.
- Les phrases et la voix de Lili.
- Le nombre et le nom des humeurs du personnage guide, la liste des tenues de #102.

## Questions ouvertes

**168.1 : quels nouveaux signes l'exemple Danse vérifie-t-il, et avec quel libellé ?**
L'exemple actuel vérifie la queue de cheval haute, le justaucorps violet et le tutu rose. La story corrige surtout la frange et la forme du tutu, et la règle 106.34/106.35 interdit l'étoile à cinq branches.
Reco A : ajouter `frange-lisse` (présent), `festons` à l'intérieur de `tutu-rose` (imbriqué), `etoile` et `etoile-doree` (absents), comme Capitaine Sam. Libellé : « le dessin validé : queue de cheval haute, frange lisse, justaucorps violet et tutu rose à festons, sans étoile ». Chaque mot du libellé correspond à un signe vérifié. B : ajouter seulement l'absence d'étoile et garder le libellé actuel suivi de « , sans étoile ». C : ne rien changer à l'exemple, la planche suffit.

**168.2 : faut-il un signe pour le collant opaque, les demi-pointes et les manches ?**
Ce sont des points de la règle de Lili. Le dessin actuel les a déjà (collant clair opaque, chaussons de demi-pointes) et la story ne les change pas.
Reco A : pas de nouveau signe. Ils sont vérifiés sur la planche avant/après et par la review (règle absolue de contenu, `.claude/skills/craftsmanship/`, section 8). Le libellé reste court. B : ajouter `collant-opaque`, `demi-pointes` et `manches` aux signes présents, et allonger le libellé d'autant.

**168.3 : la planche avant/après sert-elle de validation visuelle avant le merge ?**
L'allure (crâne, oreilles, nez, cil, cou, cintrage, tutu en cloche) ne se teste pas en E2E (réponse 98.28).
Reco A : oui. Une planche dans `docs/stories/168/captures/` montre l'ancien et le nouveau dessin fixe à 360, 160 et 80 px, sur fond clair et sur fond sombre, dans les trois humeurs et avec quelques tenues de #102, à côté de la Lili de face validée de 106h. Le PO la valide avant le merge, comme pour #161 (161.5).

**168.4 : quelle tête pour chaque humeur ?**
La Lili de face de 106h a ses propres expressions. Le dessin fixe a trois humeurs : content, reflechit, applaudit.
Reco A : garder les bouches et les regards actuels des trois humeurs, posés sur la nouvelle tête (crâne, frange, oreilles, nez, cil). Les humeurs restent celles que l'enfant connaît. B : reprendre pour chaque humeur l'expression la plus proche de la planche de 106h, ce qui demande de valider chaque correspondance sur la planche.

**168.5 : le nœud rose de la queue de cheval reste-t-il ?**
Le dessin fixe actuel porte un nœud rose en haut de la queue de cheval. La reco de #106.52 ne le cite pas, mais la Lili de face validée de 106h le porte aussi (même tracé, commit `1f16045`).
Reco A : le garder, pour que les deux dessins soient identiques. Aucun signe n'y est attaché. B : le retirer, ce qui éloigne le dessin fixe de la célébration.
