# Critères d'acceptance : issue #102, le personnage guide évolue avec les étoiles

Scénarios : `features/102-personnage-guide-evolue.feature` (`@issue-102 @wip`).
Modèle : `docs/stories/102/domain-model.md` (questions #102.1 à #102.20).
État : **validé par le PO** le 2026-10-29 (« #102 reco tout », annonce du responsable sur #64, 00:02 UTC) : toutes
les recommandations des questions #102.1 à #102.27 sont retenues. Plus aucun scénario `@a-valider` ; le commentaire
au-dessus d'un scénario nomme la réponse du PO qu'il illustre. Le tag `@wip` reste jusqu'au passage des steps E2E.

## Objectif

En tant qu'**enfant**, je veux que mon **personnage guide** reçoive de nouvelles **tenues** (réponse #102.6) quand
mon **total des étoiles** atteint un **palier des tenues** (réponse #102.1), et **choisir** celle qu'il porte, afin de voir
mes efforts sur mon compagnon de jeu.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : la tenue reçue rend visible le total des étoiles, comme la cabane ;
- **autonomie** : c'est l'enfant qui met, change ou retire la tenue (rien n'est mis d'office, #102.10) ;
- **lien** : le personnage guide habillé l'accompagne sur tous ses écrans.

Déclencheur métier : la **séance terminée** qui fait passer le total des étoiles au-dessus d'un palier des tenues
(calcul « tenue reçue par la séance », comme l'objet de la cabane). Garde-fous respectés : rien d'aléatoire, rien à
acheter, aucun coffre ni tirage, rien ne se perd, aucune comparaison entre enfants, aucune note modifiée.

## Tranche retenue (#102.17) et valeurs définitives

| Sujet | Réponse du PO (reco du modèle retenue) | Question |
|---|---|---|
| Nom du concept | « Tenue du personnage guide », verbe « recevoir » | #102.6 |
| Paliers | décalés de ceux de la cabane, premier à 5 | #102.1 |
| Tenues | **communes** à tous les univers, ni sur la tête ni dans les mains | #102.2, #102.15 |
| Tenues de la tranche | 5 une écharpe rayée, 12 un nœud papillon, 23 un sac à dos d'explorateur, 37 des bottes de pluie | #102.18, #102.27 |
| Changer d'univers | les tenues et la tenue portée suivent le profil | #102.3 |
| « Mes médailles » | section « Les tenues de <personnage guide> » juste après la cabane ; c'est là qu'on choisit | #102.4 |
| Une tenue à la fois | oui, ou aucune | #102.9 |
| Mise d'office | non, l'enfant la met lui-même | #102.10 |
| Qui reçoit | le personnage guide du profil (« Coach Léo a reçu… ») | #102.11 |
| Toutes les tenues reçues | « <personnage guide> a reçu toutes ses tenues ! » | #102.26 |
| Section avant la première tenue | absente tant qu'aucune tenue n'est reçue | #102.21 |
| « Qui joue ? » | dessin validé, sans tenue | #102.23 |
| Sans réseau | la tenue portée se montre quand même (option B) | #102.24 |
| Phrase de fin | inchangée, seul l'encart « Pour <personnage guide> » annonce la tenue | #102.12 |
| Cabane et tenue dans la même séance | deux encarts, cabane d'abord | #102.13, #102.22 |
| Libellé accessible | « Noisette, avec une écharpe rayée » dans « Mes médailles » seulement ; décoratif ailleurs | #102.14, #102.25 |
| Effet sonore | « découverte » existant, une seule fois | #102.16 |
| Tenue portée | gardée **sur l'appareil**, par profil (option A) | #102.8 |
| Espace parent | rien | #102.19 |
| Danses | hors story, confiées à #106 | #102.7 |
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
- « Qui joue ? » : dessin validé, sans tenue ; sans réseau : Noisette porte toujours l'écharpe, sans message d'erreur (#102.24 B)

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
  nouvelle côté serveur, donc aucune policy nouvelle. Si une story suivante passe à #102.8 C, elle ajoutera des
  scénarios `@acces` : un parent non rattaché ne lit ni ne change la tenue portée de Léa.

## Règles → scénarios

| Règle | Scénarios |
|---|---|
| 1. Une tenue reçue par palier des tenues atteint ; rien ne se perd | Avec <total> en tout, Noisette a <tenues> (3 cas) · Une tenue reçue montre son nom, une tenue pas encore reçue le palier qui reste à atteindre · Au-delà du dernier palier, Noisette a reçu toutes ses tenues · Rejouer une leçon avec moins d'étoiles ne retire aucune tenue et ne change pas la tenue portée |
| 2. Annonce à la fin de la séance | Passer de <avant> à <après> étoiles fait recevoir <tenue> à Noisette (2 cas) · Atteindre un palier de la cabane sans atteindre un palier des tenues n'annonce aucune tenue · Sans palier des tenues atteint, la fin de la séance n'annonce aucune tenue (2 cas) · Une séance qui fait recevoir un objet de la cabane et une tenue annonce la cabane, puis la tenue · Dans l'univers Sports, c'est Coach Léo qui reçoit la tenue · Une séance qui fait recevoir une tenue <cas> fait entendre <effets sonores> avant la phrase de fin (2 cas) · La phrase de fin du personnage guide ne parle pas de la tenue reçue · Sans réseau au début de la séance, la fin de la séance n'annonce aucune tenue |
| 3. Choisir la tenue portée dans « Mes médailles » | L'enfant met une tenue reçue à son personnage guide · Mettre une autre tenue remplace la tenue portée · Retirer la tenue laisse le personnage guide sans tenue, et la tenue reste reçue · Une tenue pas encore reçue ne se met pas, sans message d'erreur · Une tenue qui vient d'être reçue n'est pas mise d'office · La section des tenues vient juste après la cabane · Avant le premier palier des tenues, la section des tenues n'apparaît pas · Dans l'univers Sports, la section montre les tenues de Coach Léo · Avec « tout lire à voix haute », le titre des tenues puis leur phrase sont lus après la cabane · Sans « tout lire à voix haute », l'enfant fait lire les tenues à la demande |
| 4. La tenue portée se voit partout et reste | Sur <écran>, Noisette porte la tenue choisie (5 cas) · Après une relance de Savanturier, le personnage guide porte toujours la tenue choisie · Après un changement d'univers, le nouveau personnage guide porte la même tenue · Dans « Qui joue ? », le profil enfant garde le dessin de son personnage guide, sans tenue · Sans réseau, le personnage guide porte toujours la tenue choisie, sans message d'erreur |
| 5. Accessibilité | Sur « Mon parcours », les lecteurs d'écran n'annoncent ni le personnage guide ni sa tenue · Sur un ordinateur, l'enfant met une tenue au clavier · Sur un écran de 360 px, le personnage guide habillé ne cache ni la consigne ni les choix · Toutes les tenues reçues tiennent dans un écran de 360 px de large, avec des cibles assez grandes · Avec le mode dys, la section des tenues s'affiche en mode dys · Avec les mouvements réduits, l'annonce de la tenue reçue apparaît sans mouvement · Avec les mouvements réduits, le personnage guide habillé reste immobile et garde sa tenue |
| 6. Droits et appareil (`@acces`) | La tenue choisie par un enfant ne se voit pas chez un autre enfant du même parent · Les étoiles d'un autre enfant du même parent ne font recevoir aucune tenue · Sur le téléphone du second parent, l'enfant retrouve ses tenues reçues, mais pas la tenue choisie sur la tablette · Après la déconnexion du parent, le personnage guide n'a plus de tenue, mais garde ses tenues reçues · L'Espace parent ne montre pas les tenues de l'enfant |

Total : 6 règles, 39 scénarios (dont 5 plans de scénario), 48 cas exécutés ; 5 `@acces`, aucun `@a-valider`.

## Effets sur les scénarios des autres stories

- **#32 (cabane)** : aucun scénario ne change. Les totaux de ses fins de séance (2 → 3, 5 → 6) ne franchissent aucun
  palier des tenues (5, 12, 23, 37) ; ses lectures « tout lire » sont à 2 ou 3 étoiles, sous le premier palier.
- **#31, #33, #65, #97** : aucun scénario ne change avec la réponse #102.21 A (pas de section des tenues sans tenue
  reçue) : leurs lectures « tout lire » sont à 0, 2 ou 3 étoiles, et les fins de séance de #97 (6 → 7, 6 → 8, 8 → 10)
  ne franchissent aucun palier des tenues. Seul le **titre de la règle** de #65 (« cabane, histoire, badges,
  records ») devient incomplet : à mettre à jour pendant la livraison de #102, sans changer ses scénarios.
- Les paliers des tenues fixés (5, 12, 23, 37) ne tombent sur aucun total de fin de séance de ces stories : aucune
  annonce de plus dans leurs scénarios.

## Hors périmètre

- **Danses** et célébrations du personnage guide : story #106 (#102.7). Aucun scénario ici.
- Paliers au-delà du dernier palier des tenues, tenues propres à chaque univers, chapeaux et objets en main (#102.15).
- Tenue portée retrouvée sur tous les appareils (#102.8 C), bouton « La mettre » à la fin de la séance (#102.10 C).
- Tenues dans l'Espace parent (#102.19).
- Tout changement de la cabane (#32) : paliers, objets, annonce et total restent les mêmes.
- Le test de départ n'apporte aucune étoile, donc aucune tenue (réponse 27.4) : déjà couvert par le total de #32.
- Les choix de tenue font entendre « bouton touché » (règle existante de #97) : aucun son nouveau.
- `src/seance/exercices/` (#98) n'est pas touché.

## Réponses du PO (2026-10-29)

Réponse du PO, mot pour mot : « #102 reco tout » (annonce du responsable sur #64, 2026-10-29 00:02 UTC). Toutes les
recommandations sont retenues ; les valeurs provisoires des scénarios deviennent définitives.

| Question | Réponse retenue | Effet sur les scénarios |
|---|---|---|
| #102.1 Paliers des tenues | **B** : décalés de ceux de la cabane, premier à 5 ; paliers 5, 12, 23, 37 (voir #102.27) | valeurs inchangées ; « Atteindre un palier de la cabane sans atteindre un palier des tenues… » reste |
| #102.2 Tenues communes ou par univers | **A** : communes aux six personnages guides | inchangés |
| #102.3 Changement d'univers | **oui** : les tenues et la tenue portée suivent le profil | « Après un changement d'univers, le nouveau personnage guide porte la même tenue » |
| #102.4 Place dans « Mes médailles » | **A** : section « Les tenues de <personnage guide> » juste après la cabane ; c'est là qu'on choisit | inchangés |
| #102.5 Textes fournis ou validés par le PO | **oui** : les textes proposés sont validés (encart « Pour <personnage guide> », annonce, section, phrase « Encore N étoiles… », libellé accessible) | inchangés |
| #102.6 Nom du concept | **A** : « tenue du personnage guide », verbe « recevoir » | inchangés |
| #102.7 Danses | **A** : hors de #102, confiées à #106 | aucun |
| #102.8 Où garder la tenue portée | **A** : sur l'appareil, par profil, effacée à la déconnexion du parent | « Sur le téléphone du second parent… » et « Après la déconnexion du parent… » inchangés |
| #102.9 Une tenue à la fois | **A** : une seule, ou aucune | inchangé |
| #102.10 Mise d'office | **A** : non, l'enfant la met lui-même | inchangé |
| #102.11 Qui reçoit | **A** : le personnage guide du profil (« Coach Léo a reçu… ») | inchangés |
| #102.12 Phrase de fin | **A** : inchangée, seul l'encart annonce la tenue | inchangé |
| #102.13 Cabane et tenue dans la même séance | **A** : deux encarts, un seul effet « découverte » | inchangé |
| #102.14 Libellé accessible | **A** : seulement là où la tenue compte ; décoratif ailleurs | inchangé |
| #102.15 Tête et mains | **B** : ni sur la tête ni dans les mains | inchangés |
| #102.16 Effet sonore | **oui** : « découverte » existant, une seule fois | inchangé |
| #102.17 Découpage | tranche minimale retenue | inchangés |
| #102.18 Noms des tenues | liste retenue, réduite à 4 tenues par #102.15 B (voir #102.27) | inchangés |
| #102.19 Parent | **non** : rien dans l'Espace parent | inchangé |
| #102.20 Étoiles déjà gagnées à la livraison | tenues présentes dans « Mes médailles », sans annonce | aucun scénario dédié |
| #102.21 Section avant la première tenue | **A** : absente tant qu'aucune tenue n'est reçue | inchangés ; aucun scénario de #31, #32, #33, #65 ne change |
| #102.22 Ordre des annonces | juste après la cabane : cabane, tenue, épisode, badge | inchangé |
| #102.23 « Qui joue ? » | **non** : le dessin validé, sans tenue | inchangé |
| #102.24 Tenue portée sans réseau | **B** : la tenue portée se montre quand même (le total des étoiles ne baisse jamais) | **réécrit** : « Sans réseau, le personnage guide porte toujours la tenue choisie, sans message d'erreur » |
| #102.25 Libellé sans tenue | « Noisette » seul | inchangé |
| #102.26 Toutes les tenues reçues | « Noisette a reçu toutes ses tenues ! » | inchangé |
| #102.27 Liste des tenues | 4 tenues : une écharpe rayée (5), un nœud papillon (12), un sac à dos d'explorateur (23), des bottes de pluie (37) | inchangés |

## Questions ouvertes

Aucune.

## Décisions

Les questions #102.1 à #102.27 sont tranchées (section « Réponses du PO (2026-10-29) »). Rappel des questions
posées par ce document et de leur réponse :

- **#102.21 Section des tenues avant la première tenue reçue** : A, la section n'apparaît qu'à partir de la première
  tenue reçue ; l'enfant la découvre par l'annonce de la fin de la séance.
- **#102.22 Ordre des annonces à la fin de la séance** : la tenue vient juste après la cabane (cabane, tenue, épisode,
  badge).
- **#102.23 « Qui joue ? »** : la tenue n'y est pas montrée ; chaque profil garde le dessin validé de son personnage
  guide (réponse 96.13).
- **#102.24 Tenue portée sans réseau** : B, la tenue portée est montrée même sans réseau, car elle n'a pu être
  choisie qu'une fois reçue et le total des étoiles ne baisse jamais. L'invariant 3 du modèle est revu par
  `domain-modeler`.
- **#102.25 Libellé accessible sans tenue** : « Noisette » seul.
- **#102.26 Phrase quand toutes les tenues sont reçues** : « Noisette a reçu toutes ses tenues ! ».
- **#102.27 Liste des tenues de la tranche** : les 4 tenues ni sur la tête ni dans les mains, aux paliers 5, 12, 23
  et 37.
