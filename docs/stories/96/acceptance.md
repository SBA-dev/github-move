# Critères d'acceptance : story #96, refonte visuelle de l'application de l'enfant

Scénarios : `features/96-refonte-visuelle.feature`. Tags :
- `@issue-96 @wip` sur la fonctionnalité ;
- plus aucun `@a-valider` : les questions 96.1 à 96.17 sont réglées (voir « Décisions ») ;
- `@visuel` pour les captures de référence, lancées à part.

## Objectif

En tant qu'**enfant**, je veux une application colorée et vivante, qui ressemble à mon univers, afin d'avoir l'impression d'entrer dans un jeu.

Besoins nourris (skill `gamification`, section 1) :
- **autonomie** : l'univers choisi se retrouve partout ;
- **lien** : le personnage guide, redessiné, accompagne l'enfant sur chaque écran de l'enfant ;
- **compétence** : les boutons répondent tout de suite au geste (retour immédiat).

La story ne change que l'affichage, à une exception près : le personnage guide de l'univers « Police » s'appelle désormais **Agent Max**. Elle ne modifie aucune récompense ni aucune note, et ne franchit aucun garde-fou de la section 5 du skill `gamification`.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Chaque écran de l'enfant prend la couleur principale de l'univers choisi, et tout son texte reste lisible | Plan « Dans l'univers « <univers> », la couleur principale se voit sur <écran> » : les 12 écrans de l'enfant (96.7), 6 univers · Plan « Sur <écran>, la couleur principale de l'univers « Sports » se voit sur <élément> et sur les titres » : accueil (« Commencer », bouton « Accueil » du dock), « Mon parcours » (leçon « À toi ! », bouton du dock) (96.15) · Plan « … tout texte et chaque bouton des écrans de l'enfant se lisent bien <mode> » : 6 univers × sans mode dys / en mode dys, ≥ 4,5:1 · Plan « Les colonnes de l'addition posée gardent leurs couleurs … » · « Sans le mode dys, les titres s'affichent en Baloo 2 et le texte en Andika » · « En mode dys, les titres et les boutons s'affichent dans la même police que le texte » · « Les polices de l'application viennent de Savanturier, jamais d'un service tiers » · « Sur un appareil réglé en mode sombre, l'enfant garde les couleurs de son univers » |
| R2 | Le paysage et le personnage guide de l'univers, au dessin validé par le PO, accompagnent l'enfant sur chaque écran de l'enfant | Plan « Sur <écran>, Léa voit <personnage guide> dans le paysage … » : les 12 écrans, 6 personnages guides (96.7) · Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> » : 5 dessins validés, et Capitaine Sam inchangé · « Dans l'univers « Police », Agent Max salue l'enfant » · « Après une bonne réponse, Agent Max dit une félicitation commune ou une de ses expressions » (96.8) · « Agent Max lit la consigne avec une voix masculine » (96.8) · « Un profil enfant sans univers retrouve Noisette et son paysage sur « Mon parcours » » · « Sur un écran de 360 px, le personnage guide ne cache ni la consigne ni les choix » · Plan « Avec les mouvements réduits, le paysage et le personnage guide restent immobiles sur <écran> » · « Les lecteurs d'écran n'annoncent ni le paysage ni le dessin du personnage guide » |
| R3 | Un bouton de l'enfant réagit dès qu'on le touche : il s'enfonce puis revient ; avec les mouvements réduits, il change seulement de couleur | Plan « Toucher <bouton> le fait s'enfoncer puis revenir à sa place » · « Au clavier, valider un bouton le fait aussi s'enfoncer puis revenir » · « Avec les mouvements réduits, un bouton touché change seulement de couleur » · « Un bouton touché puis quitté du doigt revient à sa place sans rien ouvrir » (96.11) · « Après une erreur, le choix touché revient à sa place et Léa a une nouvelle chance » · « Avec leur relief, les boutons de l'accueil restent assez grands pour un doigt d'enfant » |
| R4 | Avancer d'un écran de l'enfant au suivant le fait arriver en glissant, revenir le fait glisser dans l'autre sens ; « Mes médailles », l'épisode et la fin de la séance arrivent en fondu ; avec les mouvements réduits, aucun mouvement | Plan « <écran> arrive <transition> » : en glissant « Mon parcours », la page de la leçon, la séance, « Toutes les leçons », le test de départ, la séance de révision ; retour en arrière en glissant dans l'autre sens ; en fondu « Mes médailles », l'épisode « La carte froissée », la fin de la séance (96.6, 96.12) · « Avec les mouvements réduits, la page de la leçon s'affiche sans aucun mouvement » · « Avec les mouvements réduits, « Mes médailles » s'affiche sans fondu » · « Toucher deux fois de suite une leçon n'ouvre sa page qu'une seule fois » (96.11) |
| R5 | Les écrans de l'enfant tiennent à 360 px de large, et les écrans clés gardent l'apparence validée par le PO | Plan « À 360 px de large, <écran> s'affiche sans défilement horizontal » : les 12 écrans (96.7) · `@visuel` Plan « <écran> ressemble à sa capture de référence « <capture> » » : accueil (« aujourd-hui »), « Mon parcours », un exercice en séance, fin de la séance, dans l'univers Sports (96.9) |
| R6 | Les écrans du parent reprennent les jetons de l'enfant, mais restent sobres : ni couleur de l'univers de l'enfant, ni paysage, ni glissement, ni rebond ; seul « Qui joue ? » montre le personnage guide de chaque profil enfant | « L'Espace parent ne prend pas la couleur principale de l'univers de l'enfant qui jouait » · « L'Espace parent n'a ni paysage ni personnage guide » · « Les titres de l'Espace parent s'affichent en Baloo 2 et son texte en Andika » · Plan « Sur <écran du parent>, un bouton touché s'enfonce et revient sans rebondir » : Espace parent, « Qui joue ? » · Plan « <écran du parent> s'affiche sans glissement » : Espace parent, « Qui joue ? », question du contrôle parental · Plan « <écran du parent> n'a ni paysage ni couleur de l'univers de l'enfant » : écran « Se connecter », « Qui joue ? », question du contrôle parental, en univers Animaux de la forêt · « Dans « Qui joue ? », chaque profil enfant garde le dessin de son personnage guide » (96.13) · seule exception, la bulle de Noisette sans aucun profil, couverte par #73 (96.16) |

Au total : **6 règles, 36 scénarios** (dont 14 plans de scénario). Plus aucun tag `@a-valider`.

Les 12 écrans de l'enfant (96.7) : l'accueil de l'enfant, « Mon parcours », « Toutes les leçons », « Mes médailles », la page de la leçon, la séance et sa fin, le test de départ et sa fin, la séance de révision et sa fin, l'épisode.

Si la story doit maigrir, deux morceaux peuvent partir ailleurs :
- **Agent Max** (renommage, paroles, voix) : une petite story Motivation.
- **R6** : une story Famille.

### Précisions pour les étapes

- « Léa ouvre tour à tour chaque écran de l'enfant » : elle parcourt la liste de la description de la `Fonctionnalité`.
- « en glissant », « en fondu » : 300 ms au plus, en n'animant que `transform` et `opacity` (réponse 96.6). Le chiffre est dans la description, pour que les scénarios restent déclaratifs.
- « le dessin validé : … » : ce sont les signes visibles de chaque maquette (`docs/maquettes/README.md`). Le PO valide en plus la planche de chaque personnage guide, rendue avec `rendre.mjs`, avant la PR (décision 0026).
- Le Plan des transitions met des étapes existantes dans ses colonnes : « Léa a ouvert son parcours depuis son accueil », « Léa ouvre la leçon « … » depuis son parcours », « Léa ouvre « … » par le dock », « Léa revient en arrière ».
- Le scénario « Après une erreur… » vérifie que la refonte garde un retour d'erreur doux.
- Le Plan des transitions et le Plan des écrans du parent reprennent aussi des étapes existantes : « Léa ouvre « Mon test de départ » depuis son accueil » (#27), « Léa a 3 questions dues de la leçon « Les nombres de révision » » et « Léa commence la séance de révision » (#28), « Léa a terminé 1 séance » et « Léa lit l'épisode « La carte froissée » depuis « Mes médailles » » (#33), « Léa joue la séance complète de la leçon « Les sons de test » » et « Léa réussit la dernière question de la séance » (#24, #27), « Léa joue », « Léa demande l'entrée de l'espace parent », « Paul quitte l'espace parent » (#10), « Paul se déconnecte sur la tablette ». Les bibliothèques de test dont elles dépendent sont à servir par les étapes.
- Le titre d'Agent Max, « le détective futé » (96.8), n'est affiché sur aucun écran aujourd'hui : il est dans la description de la `Fonctionnalité` et se vérifie par les tests unitaires du domaine (`univers_test.ts`), pas par un scénario.
- Captures `@visuel` (96.9) : univers Sports seulement, 360 px, mouvements réduits, date, données et hasard fixés, projet `telephone`, prises après le redessin des personnages guides ; une différence fait échouer le scénario, avec un seuil faible pour l'anticrénelage ; une capture ne change qu'après validation du PO, dans un commit dédié `test(#n): mise à jour de la capture <nom>`, avec l'avant et l'après dans la PR.

### Droits d'accès

La story ne crée et ne lit aucune donnée : **pas de scénario `@acces`**. L'Espace parent reste derrière le contrôle parental, sans changement (#10). Les captures ne montrent que des données de test fictives.

### Scénarios existants à mettre à jour (« Agente Mila » → « Agent Max »)

Les mises à jour remplacent seulement le nom. Le sens d'une étape existante ne change pas : on ajoute « Agent Max » aux noms acceptés.
- `features/6-univers-et-personnage-guide.feature` :
  - ligne 24 : Plan « Dans l'univers « <univers> », le personnage guide est <personnage guide> », ligne Police ;
  - ligne 97 : Plan des expressions, ligne Police ;
  - ligne 106 : « Les félicitations communes sont les mêmes dans tous les univers », « dite par Agente Mila ».
- Étapes qui citent le nom :
  - `features/steps/univers.steps.ts` : table des expressions par personnage guide ;
  - `features/steps/profils-enfants.steps.ts:449` : `(Lumi|Coach Léo|Agente Mila|Capitaine Sam|Lili) dit « Bonjour … »`.
- Hors scénarios, pour l'implementer et le test-writer :
  - `supabase/functions/_shared/motivation/domain/univers.ts` : nom, titre « la policière détective » → « le détective futé », voix féminine → masculine ; royaume inchangé (96.8) ;
  - `univers_test.ts` et `paroles_test.ts` ;
  - `docs/stories/7/domain-model.md` : tableau des voix, pour l'historique.

### Scénarios d'autres stories mis à jour

Raison : décision 96.5 (B), précisée par 96.8. Le personnage guide de l'univers « Police » s'appelle désormais **Agent Max**, « le détective futé », à la place d'Agente Mila. Il garde les mêmes trois expressions. Seul le nom change, avec l'accord des mots qui en dépendent. Le sens des scénarios ne change pas, et leurs tags non plus.

| Fichier | Scénario | Avant | Après |
|---|---|---|---|
| `features/6-univers-et-personnage-guide.feature` (l. 24) | Plan « Dans l'univers « <univers> », le personnage guide est <personnage guide> », ligne Police | `Agente Mila` | `Agent Max` |
| `features/6-univers-et-personnage-guide.feature` (l. 97) | Plan des expressions de chaque personnage guide, ligne Police | `Agente Mila` (mêmes trois expressions) | `Agent Max` (mêmes trois expressions) |
| `features/6-univers-et-personnage-guide.feature` (l. 106) | « Les félicitations communes sont les mêmes dans tous les univers » (`@issue-58`) | « dite par Agente Mila » | « dite par Agent Max » |

Aucun autre `.feature` ne citait Agente Mila. Les mentions restantes sont dans `features/96-refonte-visuelle.feature` et sont voulues (description, vérification que l'ancien nom n'apparaît plus, rappel de la réponse 96.8).

Étapes à adapter par `e2e-tester` (non modifiées ici) :
- `features/steps/univers.steps.ts` (l. 216) : la table des expressions est indexée par `"Agente Mila"` ; il faut la clé `"Agent Max"`.
- `features/steps/profils-enfants.steps.ts` (l. 449) : l'expression régulière `(Lumi|Coach Léo|Agente Mila|Capitaine Sam|Lili) dit « Bonjour … »` doit accepter `Agent Max`.
- `features/steps/exercices-a-choix.steps.ts` (l. 673) : « la félicitation commune dite par (.+) » accepte déjà tout nom ; rien à changer.

Raison : décision 96.17 (A). Sans profil enfant en cours, l'accueil est l'écran « Se connecter », écran du parent sobre comme l'Espace parent : ni paysage d'« Animaux de la forêt » ni Noisette (96.13). L'intention des scénarios ne change pas ; `@a-valider` est retiré, puisque le PO a tranché (questions 2 et 3 de #6).

| Fichier | Scénario | Avant | Après |
|---|---|---|---|
| `features/6-univers-et-personnage-guide.feature` (l. 37) | Avant : « Sans profil enfant en cours, Noisette accueille l'enfant » (`@a-valider`). Après : « Sans profil enfant en cours, Savanturier ouvre l'écran « Se connecter », sans paysage ni Noisette » | `Alors je vois Noisette dans le paysage de l'univers « Animaux de la forêt »` | `Alors Paul voit l'écran « Se connecter »` · `Mais aucun paysage ni aucun personnage guide n'y apparaît` |
| `features/6-univers-et-personnage-guide.feature` (l. 132) | « Le nom de l'application ramène à l'accueil » (`@a-valider` retiré) | `Alors je vois Noisette dans le paysage de l'univers « Animaux de la forêt »` · `Et l'en-tête n'affiche aucun prénom ni aucun niveau` | `Alors Paul voit l'écran « Se connecter »` · `Mais aucun paysage ni aucun personnage guide n'y apparaît` · `Et l'en-tête n'affiche aucun prénom ni aucun niveau` |

Les étapes sont celles de R6 de #96 et de #6 ; aucune étape nouvelle. Le premier scénario reste dans la règle « Sans univers connu… » de #6, où il était.

Raison : décision 96.16 (reco). Les scénarios de `features/73-aucun-son-sur-les-ecrans-du-parent.feature` où Noisette dit « Bonjour ! Pour commencer, crée le profil… » ne changent pas ; un commentaire de R6 rappelle l'exception.

## Hors périmètre

- Retours de réponse et effets sonores, dont le son au toucher d'un bouton : #97. Les boutons de #96 sont muets.
- « Mon parcours » en carte au trésor : #99. Sa capture de référence sera alors mise à jour.
- **Animations** de célébration des personnages guides : #106. #96 ne reprend que leur dessin fixe.
- Nouveau dessin de Capitaine Sam : plus tard, quand le PO l'aura validé.
- Nouveaux paysages au style des maquettes (but de foot, théâtre…) : pas dans #96 (réponse 96.10) ; ils iront avec les animations de #106, univers par univers.
- Personnage guide qui évolue : #102.
- Mode sombre : non (réponse 96.2). Les jetons sont nommés par rôle (`--fond`, `--texte`…) pour en permettre un plus tard.
- Règles du domaine et legacy `app/` : rien ne change.
- Vérifiés par la review, pas par un scénario :
  - « aucune couleur en dur dans les écrans de l'enfant » ;
  - « rien qui imite une interface Pokémon (Pokéball, cadres de combat, barres de PV), ni néon ni 3D » (réponse 96.1) ;
  - contour `#33304A` et coins de 16 à 24 px.

## Questions ouvertes

Aucune. Les questions 96.1 à 96.17 sont réglées (voir « Décisions »).

## Termes à signaler (glossaire)

- **Agent Max** : nouveau nom du personnage guide de l'univers « Police » (réponse 96.5). À **ajouter** en fin de section Motivation : « Agent Max remplace Agente Mila (#96) ». La ligne « Personnage guide » cite seulement « Noisette, Lumi, Coach Léo… » et n'est pas à réécrire.
- **« Carte au trésor »** : absente du glossaire, et « carte » est interdit pour **Parcours** (décision n°34). Les scénarios disent « Mon parcours » ; le terme reviendra à #99.
- **« Aujourd'hui »** : mot de cadrage ; l'écran est l'**Accueil de l'enfant** (réponse 29.5). Ici, ce n'est qu'un nom de capture.
- **« Décor »** : déjà employé dans la définition de **Cabane**. Les scénarios disent « le paysage et le personnage guide », jamais « décor de l'univers ».
- **« Écran de l'enfant »** : la définition est à compléter par un ajout (réponse 96.7) : fin de la séance, fin du test de départ, séance de révision et sa fin (#28), épisode (#33).
- Mots d'interface ou de test proposés hors glossaire : en glissant, en fondu, capture de référence, écran clé, dessin validé, mode sombre, panneau d'aventure, jetons (technique).

## Décisions

Réponses du PO du 2026-10-27, relayées sur #96 (commentaire 6454802102), mot pour mot : « 96.1 A 96.2 A 96.3 A 96.4 A 96.5 B 96.6 A ».

| Question | Réponse | Effet sur les scénarios |
|---|---|---|
| 96.1 Direction artistique | A : aventure cartoon ; boutons épais en relief qui s'enfoncent ; contour `#33304A` ; coins de 16 à 24 px ; cartes en « panneaux d'aventure » ; titres en Baloo 2 servie par le projet, texte en Andika, tout en Andika en mode dys ; rien qui imite une interface Pokémon, ni néon ni 3D | Scénarios des polices (R1, R6) validés ; le style est vérifié par la review |
| 96.2 Mode sombre | A : pas de mode sombre ; jetons nommés par rôle | Scénario du mode sombre validé |
| 96.3 Espace parent | A : reprend les jetons (couleurs, rayons, police, boutons en relief), sans paysage, sans personnage guide, sans rebond | R6 réécrite ; restaient `@a-valider` l'enfoncement des boutons et la transition, réglés par 96.13 |
| 96.4 Palettes | A : plus vives, alignées sur les maquettes, même teinte par univers ; texte et boutons à 4,5:1 au moins, dans les 6 univers et en mode dys, vérifiés par un test (Animaux `#C9452F` sur `#f6f1e7` = 4,26:1 aujourd'hui) ; colonnes de l'addition posée inchangées | Plan du contraste étendu aux boutons |
| 96.5 Personnages guides | B : #96 reprend le dessin fixe de Coach Léo, Lili, Noisette, Lumi et Agent Max ; animations dans #106 ; Capitaine Sam inchangé ; « Agent Max » remplace « Agente Mila » (glossaire, paroles) | Plan des dessins et scénario « Agent Max salue l'enfant » ajoutés ; scénarios existants à mettre à jour, listés plus haut |
| 96.6 Transitions | A : glissement latéral quand on avance (accueil → parcours → page de la leçon → séance), glissement inverse quand on revient, fondu pour « Mes médailles », 300 ms au plus, `transform` et `opacity` seulement ; mouvements réduits : aucun mouvement | R4 réécrite ; le retour en arrière n'est plus `@a-valider` ; « Toutes les leçons » restait à valider, réglé par 96.12 |

Réponses du PO du 2026-10-27 aux questions 96.7 à 96.15, mot pour mot : « 96 partout ». Elles valident chacune la recommandation proposée.

| Question | Réponse | Ce qu'elle veut dire | Effet sur les scénarios |
|---|---|---|---|
| 96.7 Liste des écrans de l'enfant | « 96 partout » | Reco validée : les 7 écrans du glossaire, plus la fin de la séance, la fin du test de départ, la séance de révision et sa fin, l'épisode ; « Qui joue ? » reste un écran du parent ; la ligne « Écran de l'enfant » du glossaire est complétée par un ajout | Les blocs d'exemples `@a-valider` de R1, R2 et R5 rejoignent les exemples principaux, complétés de la fin du test de départ et de la fin de la séance de révision ; l'épisode est « La carte froissée » |
| 96.8 Agent Max | « 96 partout » | Reco validée : il garde les trois expressions d'Agente Mila ; titre « le détective futé » ; voix masculine ; royaume « le Commissariat des Savanturiers » inchangé | Les deux scénarios d'Agent Max perdent `@a-valider` ; le titre et le royaume sont dans la description (non affichés, vérifiés par les tests du domaine) |
| 96.9 Captures de référence | « 96 partout » | Reco validée : 4 captures dans le seul univers Sports (accueil, « Mon parcours », « Quel son entends-tu ? » en séance, fin de la séance), 360 px, mouvements réduits, date, données et hasard fixés, projet `telephone`, tag `@visuel` lancé une fois avant la PR, prises après le redessin ; une différence fait échouer ; mise à jour seulement après validation du PO, commit dédié, avant et après dans la PR ; seuil faible | Le Plan `@visuel` perd `@a-valider` ; ces conditions sont rappelées en commentaire |
| 96.10 Paysages | « 96 partout » | Reco validée : non, #96 garde les paysages actuels avec les palettes retouchées ; nouveaux décors avec #106 | Hors périmètre confirmé |
| 96.11 Cas limites des gestes | « 96 partout » | Reco validée : deux touchers rapides sur une leçon n'ouvrent sa page qu'une fois ; un doigt glissé hors du bouton le laisse revenir sans rien ouvrir | Les deux scénarios perdent `@a-valider` |
| 96.12 Autres transitions | « 96 partout » | Reco validée : « Toutes les leçons », le test de départ et la séance de révision en glissant ; l'épisode en fondu ; de la séance à sa fin en fondu | Le Plan des transitions reçoit ces 5 lignes ; titre de R4 complété |
| 96.13 Écrans du parent | « 96 partout » | Reco validée : boutons au même relief, qui s'enfoncent puis reviennent sans ressort ni rebond ; entrée sans glissement ; « Qui joue ? », la connexion et le contrôle parental suivent la même règle que l'Espace parent ; « Qui joue ? » garde le dessin du personnage guide de chaque profil ; le paysage d'« Animaux de la forêt » est retiré des écrans du parent | R6 étendue aux écrans du parent : 3 plans (bouton sans rebond, sans glissement, sans paysage ni couleur de l'univers) et un scénario « Qui joue ? » |
| 96.14 Fluidité | « 96 partout » | Reco validée : vérification manuelle du PO sur le Honor Magic avant le merge (accueil, « Mon parcours », page de la leçon, séance), notée dans `docs/stories/96/journal.md` ; la review vérifie que seules `transform` et `opacity` sont animées | Pas de scénario |
| 96.15 Couleur principale | « 96 partout » | Reco validée : au moins le bouton principal ou l'élément marqué comme en cours (bouton du dock, « À toi ! »), et les titres | Définition dans la description ; nouveau Plan sur l'accueil et « Mon parcours » |

Réponses du PO du 2026-10-28 aux questions 96.16 et 96.17, relayées sur #96 (commentaires 6463255484, 07:26 UTC, et 6463290124, 07:28 UTC). Mot pour mot : « 96.16 reco 96.17 pas écran sombre », puis, la question 96.17 reposée (« écran sobre », pas « écran sombre ») : « 96.17.A ».

| Question | Réponse | Ce qu'elle veut dire | Effet sur les scénarios |
|---|---|---|---|
| 96.16 Bulle de Noisette sur un écran du parent (#73) | « 96.16 reco » | Reco validée : la bulle de Noisette (« Bonjour ! Pour commencer, crée le profil… ») reste dans l'Espace parent et sur « Qui joue ? » quand il n'y a aucun profil enfant ; c'est la seule exception à 96.3 et 96.13 | Scénarios de #73 inchangés ; commentaire ajouté sous R6 ; aucun scénario de #96 ne la disait absente |
| 96.17 Écran « Se connecter » sans profil enfant en cours (#6) | « 96.17.A » | A (reco) : on applique 96.13 ; « Se connecter » garde le fond clair et les couleurs de l'application, sans paysage d'« Animaux de la forêt » ni Noisette, comme l'Espace parent | Les deux scénarios de #6 (« Sans profil enfant en cours… », « Le nom de l'application ramène à l'accueil ») attendent l'écran « Se connecter » sans paysage ni personnage guide ; `@a-valider` retiré (voir « Scénarios d'autres stories mis à jour ») |
