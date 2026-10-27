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
