# Maquettes de référence

Maquettes jouables validées par le PO. Elles servent de **référence de style** pour les stories de l'épopée #95 (leçons plus ludiques), en particulier la refonte visuelle (#96) et la célébration propre à chaque univers (#106). Ce ne sont pas du code de l'application : rien ici n'est importé par `src/`.

Pour les ouvrir : un navigateur suffit (fichier HTML autonome, sans dépendance, sauf les polices Baloo 2 et Andika chargées depuis Google Fonts ; dans l'application, les polices sont servies par le projet, sans service tiers).

## `coach-leo-sports.html` : univers Sports, Coach Léo

Validée par le PO le 2026-10-27, après six tours de retouches. Dessinée et animée en SVG et JavaScript par le modèle Fable, avec les skills `motion-design` et `illustration`.

**Ce que montre la maquette**
- Coach Léo tire de dos vers un but au fond, face à la caméra ; le ballon rapetisse avec la profondeur jusqu'au filet.
- Il se retourne vers la caméra en passant par de vraies vues dessinées (dos, trois-quarts dos, profil, trois-quarts face, face).
- **Trois célébrations tirées au hasard** à chaque but : glissade à genoux, « avion » bras écartés, danse avec saut et clin d'œil. Puis « BUT ! » et « Chapitre réussi ! ».
- **Une animation d'échec, jamais punitive** : le ballon tape le poteau, Léo fait « oh ! », sourit, lève le pouce, et « Presque ! On réessaie ? » apparaît.
- Boutons : « Marquer un but » (célébration au hasard), « Rater », et A / B / C pour forcer chaque célébration. Un toucher sur la scène termine l'animation. Paramètres de mise au point : `?anim=glissade|avion|danse|echec&t=1.2` (image fixe à cet instant), `?planche=mains`, `?planche=tetes`.

**Style retenu (à reprendre pour les autres univers)**
- Cartoon : grosse tête (environ un tiers de la hauteur), corps en poire, membres souples tracés d'une seule courbe, sans coutures aux articulations.
- Contour brun-bleu foncé (`#33304A`, jamais noir pur), plus épais à l'extérieur de la silhouette qu'à l'intérieur ; aplat, ombre et lumière sur chaque surface ; couleurs vives.
- Visage : grands yeux ovales (iris, pupille, deux reflets), trait épais seulement en haut (paupière et cils, pas d'effet « lunettes »), sourcils mobiles, plusieurs bouches selon l'émotion, joues roses, petit nez.
- Mains à cinq doigts, orientées dans le prolongement de l'avant-bras ; poses : détendue, poing, pouce levé (toujours vers le haut), doigts écartés.
- Coach Léo : sans casquette, coupe courte de garçon (cheveux `#5a3a22`, mèches et épi qui rebondissent, nuque nette), maillot bleu `#2a63d4`, short blanc, chaussettes hautes à bandes bleues, chaussures de foot rouges à trois bandes, **sans logo de marque**, crampons visibles quand le pied se lève.
- Mouvement : anticipation, suivi, écrasement et étirement, arcs, traits de vitesse et petits effets cartoon (étoiles, gouttes de joie, lignes d'impact) avec mesure.

**Règles respectées** : règle absolue sur les contenus pour les enfants (`CLAUDE.md`) ; mouvements réduits (état final affiché directement, sans mouvement) ; annonce unique au lecteur d'écran (`aria-live`) ; cibles d'au moins 44 px ; tient à 360 px de large.

**Limites connues** : le personnage reste une « poupée articulée » réglée angle par angle (pas de plis de vêtements, pas de cinématique inverse) ; pas de son dans la maquette. Le dessin fixe de Coach Léo dans l'application (`src/univers/personnages/CoachLeo.tsx`, sans casquette) reprend cette maquette (fait dans #96 : dessin fixe ; animations : #106).

## `lili-danse.html` : univers Danse, Lili

Validée par le PO le 2026-10-27. Même moteur et même style que Coach Léo, dans un **décor de théâtre** : plancher de scène sombre avec nez de scène doré et rampe de lumières, rideaux de velours violet, coulisses, faisceaux de projecteurs avec poussière lumineuse, cercle de lumière qui suit Lili, silhouettes discrètes du public au premier plan.

- **Action** : Lili entre en scène et fait une pirouette complète.
- **Trois célébrations tirées au hasard** : grand jeté puis révérence ; le ruban dessine une étoile autour d'elle ; petits sauts puis grand saut bras en couronne avec clin d'œil. Puis « Bravo ! » et « Chapitre réussi ! » ; fleurs et pétales lancés depuis la salle.
- **Échec jamais punitif** : réception déséquilibrée, elle se rattrape sans tomber, sourit, lève le pouce, « Presque ! On réessaie ? ».
- **Lili** : cheveux longs blond foncé en **queue de cheval haute** (chouchou rose à petit nœud) qui ondule et suit le mouvement, frange, visage dégagé, **yeux verts** ; justaucorps violet à manches bouffantes, tutu rose court, **collant opaque**, demi-pointes roses à rubans : tenue adaptée aux enfants, poses de danse classique.
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=jete|ruban|sauts|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : le ruban est un trait qui suit la main ; le grand jeté est dessiné de profil sans vrai volume ; pas de son. Le dessin fixe de Lili dans l'application (`src/univers/personnages/Lili.tsx`) reprend cette maquette (fait dans #96 : dessin fixe ; animations : #106).

## `noisette-animaux.html` : univers Animaux, Noisette

Validée par le PO le 2026-10-27, après une reprise complète (la première version, en forêt avec des sauts de branche en branche, a été rejetée). Même rendu que Coach Léo et Lili (contours, aplat + ombre + lumière, mêmes yeux, mains à cinq doigts), mais un **petit écureuil rond de dessin animé** : très grosse tête, joues rebondies (réduites à la demande du PO), deux petites dents, ventre clair, bras et jambes courts et dodus, grands pieds ronds, grosse queue en panache (chaîne de segments à ressorts). Inspiré du style général des rongeurs de dessins animés classiques, **sans copier aucun personnage existant**.

- **Pas de retournement** : Noisette reste de face ou de trois-quarts face. C'est ce qui évite le défaut de retournement des premiers essais.
- **Décor simple** : prairie, un arbre à côté d'elle avec des noisettes dorées, quelques noisettes dans l'herbe, ciel clair.
- **Action** : une noisette dorée tombe de l'arbre, elle l'attrape.
- **Trois célébrations tirées au hasard** : elle jongle avec trois noisettes ; elle croque la noisette (joues qui gonflent, miettes) puis se tapote le ventre ; elle remplit ses joues de noisettes. Puis « Hourra ! » et « Chapitre réussi ! ».
- **Échec jamais punitif** : une noisette lui tombe doucement sur la tête (« toc ! », sans bosse ni douleur), elle est étourdie un instant (étoiles qui tournent), puis elle rit et lève le pouce, « Presque ! On réessaie ? ».
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=jongle|mange|joues|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : la queue part plutôt à l'horizontale derrière elle ; les noisettes du jonglage sont petites ; pas de son. Le dessin fixe de Noisette dans l'application (`src/univers/personnages/Noisette.tsx`) reprend cette maquette (fait dans #96 : dessin fixe ; animations : #106).

## `lumi-princesse.html` : univers Princesses et fées, Lumi

Validée par le PO le 2026-10-27. Même rendu que les personnages précédents, avec les leçons acquises appliquées d'emblée (yeux sans effet « lunettes », sourcils au-dessus, aucune mèche sur les joues, pas de retournement de dos, caméra rapprochée).

- **Décor** : jardin féerique (prairie fleurie, petit château rose et violet au loin, ciel mauve, lucioles).
- **Lumi** : flotte au-dessus du sol, ailes translucides qui battent ; longs cheveux blonds **d'un seul tenant** (cinq mèches ondulées qui naissent du crâne et tombent derrière les épaules), petite tiare ; robe rose **jusqu'aux genoux** à manches bouffantes, col rond et jupe à plis qui bouge, **legging**, ballerines : tenue adaptée aux enfants ; baguette à étoile avec traînée d'étincelles.
- **Action** : un sort fait éclore une grande fleur magique.
- **Trois célébrations tirées au hasard** : arc-en-ciel puis couronne d'étoiles ; envol en boucle avec traînée d'étoiles (« Magique ! » n'apparaît qu'après la redescente) ; chiffres et lettres lumineux (1, 2, 3, A, B, C) qui dansent puis deviennent des étoiles. Puis « Magique ! » et « Chapitre réussi ! ».
- **Échec jamais punitif** : « pschitt ! », le sort donne des bulles colorées ; Lumi rit, souffle dessus, lève le pouce, « Presque ! On réessaie ? ».
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=arc|envol|signes|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : de face, les mèches extérieures restent proches du visage ; les ailes battent sans vrai volume ; pas de son. Le dessin fixe de Lumi dans l'application (`src/univers/personnages/Lumi.tsx`) reprend cette maquette (fait dans #96 : dessin fixe ; animations : #106).

## `agent-max-police.html` : univers Police, Agent Max

Validée par le PO le 2026-10-27, après une reprise complète (la première version, au corps et aux membres propres, a été rejetée : bras et jambes raides, buste qui se lisait comme une jupe). **Corps, membres, mains et moteur d'animation repris tels quels de Coach Léo** : seuls la tête, la tenue et les couleurs changent. C'est la méthode à suivre pour les prochains personnages humains.

- **Agent Max, « le détective futé »** : un garçon à la peau claire (`#f2cba5`), cheveux châtain foncé courts, yeux bruns ; casquette de police à étoile dorée (visière pleine), chemise bleue à manches courtes ajustées rentrée dans un **vrai pantalon** bleu foncé (une jambe de chaque côté, ceinture fine), insigne étoile, carnet, loupe, chaussures noires.
- **Décor** : place de quartier devant le commissariat (banc, buisson, arbres, passage piéton).
- **Action** : il suit des traces de pattes à la loupe et retrouve un **chiot perdu** qui sort du buisson et lui saute dans les bras ; le chiot reste à côté de lui ensuite.
- **Trois célébrations tirées au hasard** : chef d'orchestre (gants blancs, sifflet « tuut ! », trois petites voitures qui passent en rythme, révérence) ; tour en trottinette (casque, poussées du pied, glisse, « dring ! », retour et arrêt en douceur) ; danse de la victoire (pas chassés, saut, casquette lancée et rattrapée, clin d'œil). Puis « Enquête résolue ! » et « Chapitre réussi ! ».
- **Échec jamais punitif** : le chiot lui prend sa casquette, fait un petit tour et la lui rapporte ; Max rit, la remet, lève le pouce, « Presque ! On réessaie ? ».
- **Règle absolue** : un policier qui aide ; ni arme, ni menottes, ni arrestation, ni gyrophare.
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=orchestre|trottinette|danse|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : en glisse, la jambe levée reste basse ; le demi-tour de la trottinette est un basculement rapide ; comme chez Léo, les pieds glissent un peu pendant la marche ; le chiot est dessiné simplement ; pas de son. Dans l'application, le personnage guide Police est Agent Max (`src/univers/personnages/AgentMax.tsx`), qui remplace Agente Mila (fait dans #96 : dessin fixe ; animations : #106).

## `capitaine-sam-pompiers.html` : univers Pompiers, Capitaine Sam

Validée par le PO le 2026-11-05 (106f, 106.42). Même méthode qu'Agent Max : **corps, membres, mains et moteur d'animation repris tels quels de Coach Léo** (copiés depuis `agent-max-police.html`) ; seuls la tête, la tenue, les couleurs, le décor, l'action et les variantes changent. Leçons acquises appliquées d'emblée : yeux sans effet « lunettes », sourcils au-dessus des yeux, jamais de dos (face ou trois-quarts, 38° au plus), pouce toujours vers le haut, contour `#33304A`.

- **Capitaine Sam, « le pompier courageux »** : un garçon à la peau claire (`#f3c9a5`), cheveux roux courts qui dépassent un peu du casque (tempes, petite frange), quelques taches de rousseur, yeux bruns-verts ; **casque jaune** arrondi à petite crête, avec un **écusson rouge sans étoile** (blason à goutte d'eau blanche) ; **veste rouge** à manches longues et col montant, **bandes réfléchissantes jaune et argent** aux bras et en bas de la veste ; pantalon bleu marine à bande jaune ; bottes noires ; mains nues. **Lance à eau** (corps argenté, poignée, embout doré) reliée par un tuyau souple crème à un **dévidoir rouge** posé à côté de lui.
- **Décor** : cour de la Caserne des Savanturiers en plein jour (palette Pompiers) : bâtiment rouge et crème sans texte, grande porte de garage crème à hublots, fronton avec une **cloche dorée** sous une petite arche (une corde à pompon pend), parterre de fleurs, arbre, soleil, nuages blancs qui dérivent.
- **Action (≈ 2 s)** : Sam arrose le parterre à deux mains, le jet balaie les fleurs de gauche à droite et chaque bouton s'ouvre quand l'eau l'atteint (les instants sont calculés en rejouant l'arrosage) ; petit sourire satisfait.
- **Trois variantes tirées au hasard** : A `cloche` (il coupe l'eau, pose la lance, saute et tire la corde : la cloche se balance, « ding ! », « dong ! », notes de musique dessinées, saut de joie bras en V, clin d'œil) ; B `arc` (il lève la lance, le grand arc d'eau monte dans le ciel et l'arc-en-ciel se dévoile au-dessus de la caserne ; il pose la lance, pouce levé, clin d'œil) ; C `pluie` (jet presque vertical, l'eau retombe en petite pluie scintillante sur lui et sur les fleurs ; il pose la lance, rit bras ouverts, s'ébroue gentiment, pouce levé, clin d'œil). Puis « Mission accomplie ! » (rayons qui s'ouvrent une seule fois, sans rotation ni clignotement) et « Défi relevé ! » ; les pétales de la caserne (pétales, gouttelettes, étincelles à quatre branches) jaillissent du parterre et retombent.
- **Durées (temps de maquette)** : `FIN_SCENE` = cloche 5,3 s, arc-en-ciel 5,2 s, pluie 5,2 s (cri `T_CRI` à 4,4 / 4,3 / 4,36 s). Les pétales finissent de retomber au plus 1,2 s après.
- **Pas d'animation d'échec** (hors périmètre de 106f).
- **Règle absolue** : un pompier qui aide et qui joue avec l'eau ; ni flamme, ni fumée, ni sirène, ni gyrophare, ni danger ; aucune étoile à cinq branches ; la cloche sonne pour une fête.
- Contrôles : « Réussir », A / B / C ; `?anim=cloche|arc|pluie&t=…`, `?planche=tetes|mains`. Mouvements réduits : image fixe de l'état final, sans pétales, nuages arrêtés. Annonce unique « Défi relevé ! ».

**Limites connues** : quand la lance pointe vers le ciel, l'avant-bras droit la cache en partie (le jet semble sortir des mains) ; la corde de la cloche, accrochée à la façade, est atteinte par un saut au premier plan (tricherie de perspective de dessin animé) ; le pouce levé reste près du casque ; pas de son. Captures : `docs/stories/106/captures/106f-capitaine-sam-*.png`.

## Scène de réponse fausse (#163)

`reponse-fausse-coach-leo.html` : maquette de la scène de réponse fausse de **Coach Léo** (livraison 163a), à valider par le PO **avant tout câblage** (98.28, 163.12). Captures : `docs/stories/163/captures/163a-coach-leo-*.png` (images clés, écran à 360 px, image fixe, tailles, mode dys).

- **Scène (1,5 s)** : Léo est de face dès la première image. Il tape le ballon, qui rebondit doucement sur un petit poteau à sa droite (le poteau vibre à peine) et revient rouler à ses pieds. Surpris un instant, puis il rit (petite bulle écrite « oh ! »), pouce levé. Léo seul avec son ballon, d'aplomb. Un petit coin d'herbe et le poteau n'existent que le temps de la scène. Aucun titre, aucun son, aucun confetti, aucune étoile.
- **Taille** : le dessin occupe le même cadre que celui du personnage guide (`viewBox="-84 -119 168 210"`, comme `CoachLeo.tsx`) : 112 px de large sur téléphone, 200 px sur tablette (`src/styles.css`, `.personnage-guide`). Léo glisse de 14 unités vers la gauche pour laisser la place du poteau, puis revient au centre.
- **Maquette d'écran** : question « Combien font 3 + 4 ? », quatre choix, encouragement de #97 (« Pas grave, on réessaie ! ») dans la bulle. Les choix, « Réécouter », « Je ne sais pas » et « Retour » restent actifs pendant la scène et l'arrêtent aussitôt.
- **Contrôles** : « Rejouer la scène », mouvements réduits (image fixe : Léo souriant, pouce levé, ballon à ses pieds, sans poteau ni bulle), mode dys (la bulle « oh ! » passe en Andika), écran de tablette. La durée mesurée s'affiche. `?t=0.46` rend un instant ; `?reduit=1`, `?dys=1`, `?tablette=1`, `?taille=<px>`.
- **Tenue** : tenue de base. La tenue portée viendra des dessins de 106h (163.8).
- **Écarts à `coach-leo-sports.html`** : plus de tir de dos ni de retournement (2,9 s resserrées en 1,5 s) ; but et filet remplacés par un petit poteau ; plus de titre ni de sous-titre ; sourcils de « joie » relevés ; dessin au cadre du personnage guide (et non plus plein écran) ; ni `?anim=…` ni bouton de scène ratée ; polices Andika et Baloo 2 sans appel réseau (repli système).
- **Limites connues** : à 80 px et moins, la bulle « oh ! » devient illisible (elle est décorative, `aria-hidden`) ; l'enchaînement avec le dessin fixe « réfléchit » (163.13) est à faire au câblage ; le pas de côté de Léo fait glisser un peu les pieds ; pas de son.
