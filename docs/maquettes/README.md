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

**Limites connues** : le personnage reste une « poupée articulée » réglée angle par angle (pas de plis de vêtements, pas de cinématique inverse) ; pas de son dans la maquette. L'apparence de Coach Léo dans l'application (`src/univers/apparences.ts`, avec casquette) n'est pas encore modifiée : ce sera le rôle d'une story (#96 ou #106).

## `lili-danse.html` : univers Danse, Lili

Validée par le PO le 2026-10-27. Même moteur et même style que Coach Léo, dans un **décor de théâtre** : plancher de scène sombre avec nez de scène doré et rampe de lumières, rideaux de velours violet, coulisses, faisceaux de projecteurs avec poussière lumineuse, cercle de lumière qui suit Lili, silhouettes discrètes du public au premier plan.

- **Action** : Lili entre en scène et fait une pirouette complète.
- **Trois célébrations tirées au hasard** : grand jeté puis révérence ; le ruban dessine une étoile autour d'elle ; petits sauts puis grand saut bras en couronne avec clin d'œil. Puis « Bravo ! » et « Chapitre réussi ! » ; fleurs et pétales lancés depuis la salle.
- **Échec jamais punitif** : réception déséquilibrée, elle se rattrape sans tomber, sourit, lève le pouce, « Presque ! On réessaie ? ».
- **Lili** : cheveux longs blond foncé en **queue de cheval haute** (chouchou rose à petit nœud) qui ondule et suit le mouvement, frange, visage dégagé, **yeux verts** ; justaucorps violet à manches bouffantes, tutu rose court, **collant opaque**, demi-pointes roses à rubans : tenue adaptée aux enfants, poses de danse classique.
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=jete|ruban|sauts|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : le ruban est un trait qui suit la main ; le grand jeté est dessiné de profil sans vrai volume ; pas de son. L'apparence de Lili dans l'application (`src/univers/apparences.ts`, cheveux bruns en chignon) n'est pas encore modifiée.

## `noisette-animaux.html` : univers Animaux, Noisette

Validée par le PO le 2026-10-27, après une reprise complète (la première version, en forêt avec des sauts de branche en branche, a été rejetée). Même rendu que Coach Léo et Lili (contours, aplat + ombre + lumière, mêmes yeux, mains à cinq doigts), mais un **petit écureuil rond de dessin animé** : très grosse tête, joues rebondies (réduites à la demande du PO), deux petites dents, ventre clair, bras et jambes courts et dodus, grands pieds ronds, grosse queue en panache (chaîne de segments à ressorts). Inspiré du style général des rongeurs de dessins animés classiques, **sans copier aucun personnage existant**.

- **Pas de retournement** : Noisette reste de face ou de trois-quarts face. C'est ce qui évite le défaut de retournement des premiers essais.
- **Décor simple** : prairie, un arbre à côté de lui avec des noisettes dorées, quelques noisettes dans l'herbe, ciel clair.
- **Action** : une noisette dorée tombe de l'arbre, il l'attrape.
- **Trois célébrations tirées au hasard** : il jongle avec trois noisettes ; il croque la noisette (joues qui gonflent, miettes) puis se tapote le ventre ; il remplit ses joues de noisettes. Puis « Hourra ! » et « Chapitre réussi ! ».
- **Échec jamais punitif** : une noisette lui tombe doucement sur la tête (« toc ! », sans bosse ni douleur), il est étourdi un instant (étoiles qui tournent), puis il rit et lève le pouce, « Presque ! On réessaie ? ».
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=jongle|mange|joues|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : la queue part plutôt à l'horizontale derrière lui ; les noisettes du jonglage sont petites ; pas de son. Le dessin de Noisette dans l'application (`src/univers/dessins.tsx`, `Ecureuil`) n'est pas encore modifié.

## `lumi-princesse.html` : univers Princesses et fées, Lumi

Validée par le PO le 2026-10-27. Même rendu que les personnages précédents, avec les leçons acquises appliquées d'emblée (yeux sans effet « lunettes », sourcils au-dessus, aucune mèche sur les joues, pas de retournement de dos, caméra rapprochée).

- **Décor** : jardin féerique (prairie fleurie, petit château rose et violet au loin, ciel mauve, lucioles).
- **Lumi** : flotte au-dessus du sol, ailes translucides qui battent ; longs cheveux blonds **d'un seul tenant** (cinq mèches ondulées qui naissent du crâne et tombent derrière les épaules), petite tiare ; robe rose **jusqu'aux genoux** à manches bouffantes, col rond et jupe à plis qui bouge, **legging**, ballerines : tenue adaptée aux enfants ; baguette à étoile avec traînée d'étincelles.
- **Action** : un sort fait éclore une grande fleur magique.
- **Trois célébrations tirées au hasard** : arc-en-ciel puis couronne d'étoiles ; envol en boucle avec traînée d'étoiles (« Magique ! » n'apparaît qu'après la redescente) ; chiffres et lettres lumineux (1, 2, 3, A, B, C) qui dansent puis deviennent des étoiles. Puis « Magique ! » et « Chapitre réussi ! ».
- **Échec jamais punitif** : « pschitt ! », le sort donne des bulles colorées ; Lumi rit, souffle dessus, lève le pouce, « Presque ! On réessaie ? ».
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=arc|envol|signes|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : de face, les mèches extérieures restent proches du visage ; les ailes battent sans vrai volume ; pas de son.

## `agent-max-police.html` : univers Police, Agent Max

Validée par le PO le 2026-10-27, après une reprise complète (la première version, au corps et aux membres propres, a été rejetée : bras et jambes raides, buste qui se lisait comme une jupe). **Corps, membres, mains et moteur d'animation repris tels quels de Coach Léo** : seuls la tête, la tenue et les couleurs changent. C'est la méthode à suivre pour les prochains personnages humains.

- **Agent Max, « le détective futé »** : un garçon à la peau claire (`#f2cba5`), cheveux châtain foncé courts, yeux bruns ; casquette de police à étoile dorée (visière pleine), chemise bleue à manches courtes ajustées rentrée dans un **vrai pantalon** bleu foncé (une jambe de chaque côté, ceinture fine), insigne étoile, carnet, loupe, chaussures noires.
- **Décor** : place de quartier devant le commissariat (banc, buisson, arbres, passage piéton).
- **Action** : il suit des traces de pattes à la loupe et retrouve un **chiot perdu** qui sort du buisson et lui saute dans les bras ; le chiot reste à côté de lui ensuite.
- **Trois célébrations tirées au hasard** : chef d'orchestre (gants blancs, sifflet « tuut ! », trois petites voitures qui passent en rythme, révérence) ; tour en trottinette (casque, poussées du pied, glisse, « dring ! », retour et arrêt en douceur) ; danse de la victoire (pas chassés, saut, casquette lancée et rattrapée, clin d'œil). Puis « Enquête résolue ! » et « Chapitre réussi ! ».
- **Échec jamais punitif** : le chiot lui prend sa casquette, fait un petit tour et la lui rapporte ; Max rit, la remet, lève le pouce, « Presque ! On réessaie ? ».
- **Règle absolue** : un policier qui aide ; ni arme, ni menottes, ni arrestation, ni gyrophare.
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=orchestre|trottinette|danse|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : en glisse, la jambe levée reste basse ; le demi-tour de la trottinette est un basculement rapide ; comme chez Léo, les pieds glissent un peu pendant la marche ; le chiot est dessiné simplement ; pas de son. Dans l'application, le guide Police est encore « Agente Mila » (`src/univers/apparences.ts`) : le passage à Agent Max revient à une story (#96 ou #106).

## `capitaine-sam-pompier.html` : univers Pompiers, Capitaine Sam

Validée par le PO le 2026-10-27, après une reprise complète des animations. Même méthode qu'Agent Max : corps, membres, mains et moteur d'animation de Coach Léo, vrai pantalon ; seuls la tête, la tenue, le décor et les animations changent.

- **Capitaine Sam** : un garçon à la peau claire (`#f3c9a5`) avec quelques taches de rousseur, cheveux roux courts (`#a8461c`), yeux verts ; casque rouge avec un écusson doré à **étoile** (jamais de croix, qui pourrait se lire comme un symbole religieux ou la Croix-Rouge), veste et pantalon rouges à bandes jaunes, bottes noires, gants quand il tient la lance.
- **Décor** : cour de la caserne (grande porte, cloche dorée), camion rouge, cible d'entraînement, bouche d'incendie, fleurs ; palette pompier de l'application.
- **Action** : exercice sur cible ; le jet touche le centre, la cible tourne et montre une étoile.
- **Trois célébrations tirées au hasard** : arc-en-ciel d'eau et salut ; grande échelle (il grimpe **derrière** l'échelle, barreaux devant lui, salue depuis la nacelle, redescend du même côté) ; cloche de la caserne (« ding ding ! »), pas de danse, pose fière et clin d'œil. Puis « Mission réussie ! » et « Chapitre réussi ! ».
- **Échec jamais punitif** : la lance lui glisse des mains et tombe loin de lui, une petite fontaine en arc retombe en gouttes sur son casque ; il rit, la ramasse, lève le pouce, « Presque ! On réessaie ? ».
- **Règle absolue** : aucune flamme, aucun feu, personne en danger. **Lance à eau** : toujours tenue à deux mains à hauteur d'épaule, sur le côté ; le tuyau ne passe jamais devant le bassin ni entre les jambes, et aucun jet ne part du bas du corps (une première version, lance à hauteur du bassin, donnait une lecture vulgaire : à ne jamais reproduire).
- Contrôles : « Réussir », « Rater », A / B / C ; `?anim=arc|echelle|cloche|echec&t=…`, `?planche=tetes|mains`.

**Limites connues** : l'échelle est dressée près du camion au lieu d'en être l'échelle dépliée ; en haut, Sam semble debout sur la nacelle plutôt que dedans ; à la visée, la main arrière reste près du menton ; pas de son. Le guide Pompiers de l'application (`src/univers/apparences.ts`) n'est pas encore modifié : ce sera le rôle d'une story (#96 ou #106).
