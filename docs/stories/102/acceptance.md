# Critères d'acceptance : issue #102, le personnage guide évolue avec les étoiles

Scénarios : `features/102-personnage-guide-evolue.feature` (`@issue-102 @wip`).
Modèle : `docs/stories/102/domain-model.md` (questions #102.1 à #102.20).
État : **cadrage**, en attente de la validation du PO. Les recommandations du modèle de domaine sont prises comme
hypothèses de travail ; les scénarios qui dépendent d'une réponse portent le tag `@a-valider` et un commentaire
`# #102.n`.

## Objectif

En tant qu'**enfant**, je veux que mon **personnage guide** reçoive de nouvelles **tenues** (à valider, #102.6) quand
mon **total des étoiles** atteint un **palier des tenues** (à valider), et **choisir** celle qu'il porte, afin de voir
mes efforts sur mon compagnon de jeu.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : la tenue reçue rend visible le total des étoiles, comme la cabane ;
- **autonomie** : c'est l'enfant qui met, change ou retire la tenue (rien n'est mis d'office, #102.10) ;
- **lien** : le personnage guide habillé l'accompagne sur tous ses écrans.

Déclencheur métier : la **séance terminée** qui fait passer le total des étoiles au-dessus d'un palier des tenues
(calcul « tenue reçue par la séance », comme l'objet de la cabane). Garde-fous respectés : rien d'aléatoire, rien à
acheter, aucun coffre ni tirage, rien ne se perd, aucune comparaison entre enfants, aucune note modifiée.

## Tranche retenue (#102.17) et hypothèses de travail

| Sujet | Hypothèse (reco du modèle) | Question |
|---|---|---|
| Nom du concept | « Tenue du personnage guide », verbe « recevoir » | #102.6 |
| Paliers | décalés de ceux de la cabane, premier à 5 | #102.1 |
| Tenues | **communes** à tous les univers, ni sur la tête ni dans les mains | #102.2, #102.15 |
| Liste provisoire | 5 une écharpe rayée, 12 un nœud papillon, 23 un sac à dos d'explorateur, 37 des bottes de pluie | #102.18, #102.27 |
| Changer d'univers | les tenues et la tenue portée suivent le profil | #102.3 |
| « Mes médailles » | section « Les tenues de <personnage guide> » juste après la cabane ; c'est là qu'on choisit | #102.4 |
| Une tenue à la fois | oui, ou aucune | #102.9 |
| Mise d'office | non, l'enfant la met lui-même | #102.10 |
| Qui reçoit | le personnage guide du profil (« Coach Léo a reçu… ») | #102.11 |
| Phrase de fin | inchangée, seul l'encart « Pour <personnage guide> » annonce la tenue | #102.12 |
| Cabane et tenue dans la même séance | deux encarts, cabane d'abord | #102.13, #102.22 |
| Libellé accessible | « Noisette, avec une écharpe rayée » dans « Mes médailles » seulement ; décoratif ailleurs | #102.14, #102.25 |
| Effet sonore | « découverte » existant, une seule fois | #102.16 |
| Tenue portée | gardée **sur l'appareil**, par profil (option A) | #102.8 |
| Espace parent | rien | #102.19 |
| Étoiles déjà gagnées à la livraison | tenues présentes dans « Mes médailles », aucune annonce | #102.20 |

## Example mapping

### Règle 1 : le personnage guide a une tenue reçue par palier des tenues atteint par le total des étoiles ; rien ne se perd

- 5 étoiles en tout : 1 tenue, « Encore 7 étoiles et Noisette recevra un nœud papillon ! »
- 11 étoiles : toujours 1 tenue, « Encore 1 étoile… » (borne juste sous le palier) ; 12 étoiles : 2 tenues (borne)
- 12 étoiles : pastilles « une écharpe rayée », « un nœud papillon », « 23 ★ », « 37 ★ »
- 40 étoiles : les 4 tenues, phrase de fin de collection (#102.26)
- meilleures étoiles 3 + 3, leçon rejouée à 1 étoile : toujours 6 étoiles, l'écharpe reste reçue et portée

### Règle 2 : à la fin d'une séance qui fait atteindre un palier des tenues, l'enfant apprend quelle tenue son personnage guide a reçue

- 4 → 5 : « Noisette a reçu une écharpe rayée ! » ; 11 → 12 : « Noisette a reçu un nœud papillon ! »
- 5 → 6 : la cabane reçoit le tapis tout doux, aucune tenue (paliers distincts)
- leçon rejouée avec moins ou autant d'étoiles : aucune annonce
- 4 → 6 : « Noisette a reçu un tapis tout doux ! » puis « Noisette a reçu une écharpe rayée ! »
- univers Sports : « Coach Léo a reçu une écharpe rayée ! »
- sons : « séance terminée » puis « découverte » ; avec leçon acquise et objet de la cabane, « grande victoire » puis « découverte » une seule fois
- phrase de fin du personnage guide inchangée ; sans réseau au début de la séance, aucune annonce (comme 32.13)

### Règle 3 : dans « Mes médailles », l'enfant met une tenue reçue, en change ou la retire ; une seule tenue portée, ou aucune

- mettre l'écharpe : Noisette la porte, libellé « Noisette, avec une écharpe rayée »
- mettre le nœud papillon remplace l'écharpe ; retirer : Noisette sans tenue, l'écharpe reste reçue
- toucher la pastille « 12 ★ » : rien ne change, aucun message d'erreur
- tenue juste reçue : pas mise d'office
- ordre des sections, section absente avant 5 étoiles, titre « Les tenues de Coach Léo », lecture à voix haute

### Règle 4 : la tenue portée se voit sur tous les écrans de l'enfant où apparaît le personnage guide, et reste

- accueil, « Mon parcours », « Toutes les leçons », séance, fin de la séance
- après une relance de Savanturier ; après un changement d'univers (Coach Léo porte l'écharpe)
- « Qui joue ? » : dessin validé, sans tenue ; sans réseau : sans tenue, sans message d'erreur

### Règle 5 : accessibilité

- lecteurs d'écran : libellé dans « Mes médailles », rien sur « Mon parcours »
- clavier ; 360 px (séance avec Capitaine Sam et son sac à dos, « Mes médailles » à 40 étoiles, cibles de 44 px) ;
  mode dys ; mouvements réduits (annonce sans mouvement, personnage guide immobile qui garde sa tenue)

### Règle 6 : droits et appareil

- Tom, autre enfant de Paul, ne voit pas la tenue choisie par Léa ; ses 30 étoiles ne donnent rien à Léa
- sur le téléphone de Marie : tenues reçues retrouvées, tenue portée non retrouvée (#102.8 A)
- après déconnexion du parent : tenue portée effacée, tenues reçues gardées (#102.8 A)
- Espace parent : aucune tenue (#102.19)
- Claire (non rattachée) : aucune lecture nouvelle ; la lecture des étoiles sous RLS est déjà couverte par
  `@acces` de #32 (« Un parent qui n'est pas rattaché ne lit pas les étoiles de Léa »). Avec #102.8 A, aucune donnée
  nouvelle côté serveur, donc aucune policy nouvelle. Si le PO choisit #102.8 C, il faudra ajouter des scénarios
  `@acces` : un parent non rattaché ne lit ni ne change la tenue portée de Léa.

## Règles → scénarios

| Règle | Scénarios |
|---|---|
| 1. Une tenue reçue par palier des tenues atteint ; rien ne se perd | Avec <total> en tout, Noisette a <tenues> (3 cas) · Une tenue reçue montre son nom, une tenue pas encore reçue le palier qui reste à atteindre · Au-delà du dernier palier, Noisette a reçu toutes ses tenues · Rejouer une leçon avec moins d'étoiles ne retire aucune tenue et ne change pas la tenue portée |
| 2. Annonce à la fin de la séance | Passer de <avant> à <après> étoiles fait recevoir <tenue> à Noisette (2 cas) · Atteindre un palier de la cabane sans atteindre un palier des tenues n'annonce aucune tenue · Sans palier des tenues atteint, la fin de la séance n'annonce aucune tenue (2 cas) · Une séance qui fait recevoir un objet de la cabane et une tenue annonce la cabane, puis la tenue · Dans l'univers Sports, c'est Coach Léo qui reçoit la tenue · Une séance qui fait recevoir une tenue <cas> fait entendre <effets sonores> avant la phrase de fin (2 cas) · La phrase de fin du personnage guide ne parle pas de la tenue reçue · Sans réseau au début de la séance, la fin de la séance n'annonce aucune tenue |
| 3. Choisir la tenue portée dans « Mes médailles » | L'enfant met une tenue reçue à son personnage guide · Mettre une autre tenue remplace la tenue portée · Retirer la tenue laisse le personnage guide sans tenue, et la tenue reste reçue · Une tenue pas encore reçue ne se met pas, sans message d'erreur · Une tenue qui vient d'être reçue n'est pas mise d'office · La section des tenues vient juste après la cabane · Avant le premier palier des tenues, la section des tenues n'apparaît pas · Dans l'univers Sports, la section montre les tenues de Coach Léo · Avec « tout lire à voix haute », le titre des tenues puis leur phrase sont lus après la cabane · Sans « tout lire à voix haute », l'enfant fait lire les tenues à la demande |
| 4. La tenue portée se voit partout et reste | Sur <écran>, Noisette porte la tenue choisie (5 cas) · Après une relance de Savanturier, le personnage guide porte toujours la tenue choisie · Après un changement d'univers, le nouveau personnage guide porte la même tenue · Dans « Qui joue ? », le profil enfant garde le dessin de son personnage guide, sans tenue · Sans réseau, le personnage guide s'affiche sans tenue, sans message d'erreur |
| 5. Accessibilité | Sur « Mon parcours », les lecteurs d'écran n'annoncent ni le personnage guide ni sa tenue · Sur un ordinateur, l'enfant met une tenue au clavier · Sur un écran de 360 px, le personnage guide habillé ne cache ni la consigne ni les choix · Toutes les tenues reçues tiennent dans un écran de 360 px de large, avec des cibles assez grandes · Avec le mode dys, la section des tenues s'affiche en mode dys · Avec les mouvements réduits, l'annonce de la tenue reçue apparaît sans mouvement · Avec les mouvements réduits, le personnage guide habillé reste immobile et garde sa tenue |
| 6. Droits et appareil (`@acces`) | La tenue choisie par un enfant ne se voit pas chez un autre enfant du même parent · Les étoiles d'un autre enfant du même parent ne font recevoir aucune tenue · Sur le téléphone du second parent, l'enfant retrouve ses tenues reçues, mais pas la tenue choisie sur la tablette · Après la déconnexion du parent, le personnage guide n'a plus de tenue, mais garde ses tenues reçues · L'Espace parent ne montre pas les tenues de l'enfant |

Total : 6 règles, 39 scénarios (dont 5 plans de scénario), 48 cas exécutés ; 20 scénarios `@a-valider`, 5 `@acces`.

## Questions → scénarios touchés

| Question | Scénarios touchés si la réponse diffère de l'hypothèse |
|---|---|
| #102.1 paliers, #102.5 / #102.18 textes et noms, #102.27 liste | **toutes les valeurs** (seuils, noms, phrases) : on remplace les valeurs, la forme ne change pas. Avec #102.1 A (mêmes paliers que la cabane), « Atteindre un palier de la cabane sans atteindre un palier des tenues… » disparaît et chaque annonce de la cabane s'accompagne d'une tenue |
| #102.2 / #102.3 communes, univers | Après un changement d'univers, le nouveau personnage guide porte la même tenue · Dans l'univers Sports, la section montre les tenues de Coach Léo |
| #102.4 place dans « Mes médailles » | La section des tenues vient juste après la cabane · Avec « tout lire à voix haute »… |
| #102.6 nom du concept | tous les textes (« tenue », « Les tenues de… ») et le titre de la fonctionnalité |
| #102.7 danses | aucun (hors story) |
| #102.8 tenue portée sur l'appareil | Sur le téléphone du second parent… · Après la déconnexion du parent… · Après une relance de Savanturier… (avec C, la tenue serait retrouvée partout et deux scénarios s'inversent ; ajouter des `@acces` serveur) |
| #102.9 une tenue à la fois | Mettre une autre tenue remplace la tenue portée |
| #102.10 mise d'office | Une tenue qui vient d'être reçue n'est pas mise d'office |
| #102.11 qui reçoit | Dans l'univers Sports, c'est Coach Léo qui reçoit la tenue · Dans l'univers Sports, la section montre les tenues de Coach Léo |
| #102.12 phrase de fin | La phrase de fin du personnage guide ne parle pas de la tenue reçue |
| #102.13 / #102.22 cabane et tenue, ordre | Une séance qui fait recevoir un objet de la cabane et une tenue annonce la cabane, puis la tenue |
| #102.14 libellé accessible | Sur « Mon parcours », les lecteurs d'écran n'annoncent ni le personnage guide ni sa tenue |
| #102.15 tête et mains | liste des tenues (voir #102.27) ; un chapeau changerait le scénario 360 px de Capitaine Sam |
| #102.16 effet sonore | Une séance qui fait recevoir une tenue <cas> fait entendre <effets sonores>… |
| #102.19 parent | L'Espace parent ne montre pas les tenues de l'enfant |
| #102.20 étoiles déjà gagnées | aucun scénario dédié : aucun cas ne fait recevoir de tenue sans séance qui franchit un palier |
| #102.21 section avant la première tenue | Avant le premier palier des tenues, la section des tenues n'apparaît pas · Les étoiles d'un autre enfant du même parent ne font recevoir aucune tenue · Avec « tout lire à voix haute »… |
| #102.23 « Qui joue ? » | Dans « Qui joue ? », le profil enfant garde le dessin de son personnage guide, sans tenue |
| #102.24 hors ligne | Sans réseau, le personnage guide s'affiche sans tenue, sans message d'erreur |
| #102.25 libellé sans tenue | Retirer la tenue laisse le personnage guide sans tenue, et la tenue reste reçue |
| #102.26 toutes les tenues reçues | Au-delà du dernier palier, Noisette a reçu toutes ses tenues |

## Effets sur les scénarios des autres stories

- **#32 (cabane)** : aucun scénario ne change. Les totaux de ses fins de séance (2 → 3, 5 → 6) ne franchissent aucun
  palier des tenues provisoire ; ses lectures « tout lire » sont à 2 ou 3 étoiles, sous le premier palier.
- **#31, #33, #65, #97** : aucun scénario ne change avec l'hypothèse #102.21 A (pas de section des tenues sans tenue
  reçue) : leurs lectures « tout lire » sont à 0, 2 ou 3 étoiles, et les fins de séance de #97 (6 → 7, 6 → 8, 8 → 10)
  ne franchissent aucun palier des tenues. Seul le **titre de la règle** de #65 (« cabane, histoire, badges,
  records ») devient incomplet : à mettre à jour après la validation, sans changer ses scénarios.
- Avec #102.21 B (section toujours là), il faudrait mettre à jour la lecture « tout lire » de #31, #32, #33 et #65,
  et le scénario « Les quatre sections apparaissent dans l'ordre… » de #65.
- Si les seuils changent (#102.1), revérifier ces totaux : un palier des tenues à 6, 7, 8 ou 10 ferait apparaître
  une annonce de plus dans des scénarios existants.

## Hors périmètre

- **Danses** et célébrations du personnage guide : story #106 (#102.7). Aucun scénario ici.
- Paliers au-delà du dernier palier des tenues, tenues propres à chaque univers, chapeaux et objets en main (#102.15).
- Tenue portée retrouvée sur tous les appareils (#102.8 C), bouton « La mettre » à la fin de la séance (#102.10 C).
- Tenues dans l'Espace parent (#102.19).
- Tout changement de la cabane (#32) : paliers, objets, annonce et total restent les mêmes.
- Le test de départ n'apporte aucune étoile, donc aucune tenue (réponse 27.4) : déjà couvert par le total de #32.
- Les choix de tenue font entendre « bouton touché » (règle existante de #97) : aucun son nouveau.
- `src/seance/exercices/` (#98) n'est pas touché.

## Questions ouvertes

Les questions **#102.1 à #102.20** sont dans `docs/stories/102/domain-model.md`, avec leurs recommandations
(hypothèses de travail ci-dessus). Questions nouvelles :

**#102.21 Section des tenues avant la première tenue reçue.** A : la section n'apparaît qu'à partir de la première
tenue reçue (comme les records de calcul rapide, #65) ; l'enfant la découvre par l'annonce de la fin de la séance.
B : elle est toujours là, même à 0 étoile (comme la cabane, décision 32.8), avec « Encore 5 étoiles et Noisette
recevra une écharpe rayée ! ».
Reco : **A pour la tranche minimale** : aucun scénario de #31, #32, #33 et #65 ne change. B montre mieux le but à
atteindre ; on peut y passer dans une story suivante, en mettant à jour ces scénarios.

**#102.22 Ordre des annonces à la fin de la séance.** Aujourd'hui : cabane, épisode, badge (décision 33.13). Où
vient la tenue ? Reco : **juste après la cabane** (cabane, tenue, épisode, badge) : les deux récompenses d'étoiles
côte à côte, dans le même ordre que « Mes médailles ».

**#102.23 « Qui joue ? » montre-t-il la tenue ?** Reco : **non**. C'est un écran du parent, où chaque profil garde le
dessin validé de son personnage guide (réponse 96.13), et la tenue portée est gardée sur l'appareil.

**#102.24 Tenue portée sans réseau.** A : le personnage guide s'affiche sans tenue tant que les étoiles ne sont pas
lues (tolérance du modèle, `tenueAMontrer`, invariant 3) ; B : la tenue portée est montrée quand même, car elle n'a pu
être choisie qu'une fois reçue et le total des étoiles ne baisse jamais.
Reco : **B**, pour que la tenue ne disparaisse pas aux yeux de l'enfant hors ligne. Cela change l'invariant 3 du
modèle (à revoir par `domain-modeler`). Le scénario est écrit avec A, l'hypothèse actuelle du modèle.

**#102.25 Libellé accessible sans tenue.** Dans la section des tenues, le personnage guide sans tenue se dit
« Noisette » seul, ou « Noisette, sans tenue » ? Reco : **« Noisette » seul** (plus court, rien de négatif).

**#102.26 Phrase quand toutes les tenues sont reçues.** Proposition, sur le modèle de « La cabane est complète,
quelle merveille ! » : « Noisette a reçu toutes ses tenues ! ». Texte à fournir ou valider par le PO (#102.5).

**#102.27 Liste des tenues de la tranche.** La liste candidate de #102.18 contient « une couronne de fleurs » et « un
bonnet à pompon », qui se portent sur la tête : avec #102.15 B (ni tête ni mains), il reste 4 tenues. Hypothèse des
scénarios : 4 tenues, aux paliers 5, 12, 23 et 37 (une écharpe rayée, un nœud papillon, un sac à dos d'explorateur,
des bottes de pluie). Reco : le PO garde ces 4 tenues pour la tranche, ou choisit #102.15 A pour en avoir 6
(paliers proposés 5, 12, 23, 37, 52, 70), ou fournit 2 autres tenues ni sur la tête ni dans les mains.

## Décisions

Aucune pour l'instant (validation du PO attendue).
