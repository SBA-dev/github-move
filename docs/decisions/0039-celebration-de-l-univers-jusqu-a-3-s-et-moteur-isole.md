# 0039 : La célébration de l'univers dure jusqu'à 3 s sans jamais retenir l'enfant ; le moteur d'animation des maquettes est porté dans un composant isolé, Motion pour l'entrée et la sortie

**Statut** : Acceptée · 2026-11-02 (story #106, réponses du PO aux questions #106.9 et #106.22, « 106 reco tout »)

## Contexte

La story #106 fait jouer, à un moment de célébration (premier défi relevé dans 106a, puis matière réussie et tenue reçue), une **célébration de l'univers** propre au personnage guide du profil, à la place de la **célébration commune** de #97 (les confettis de la fin). Le PO a validé des maquettes jouables pour cinq univers (`docs/maquettes/`, Coach Léo pour Sports en référence de style) : une action toujours la même (le tir au but de Coach Léo), puis une variante de la célébration tirée au hasard (glissade à genoux, avion ou danse avec clin d'œil), puis le cri de victoire.

Deux règles existantes ne tiennent pas avec ces maquettes :
- **Durée.** La réponse 97.23 limite une célébration à **1,5 s au plus**, pour qu'elle ne retienne jamais l'enfant. L'issue #106 dit « moins de 3 secondes ». Une action suivie d'une variante ne tient pas en 1,5 s : la raccourcir ferait perdre l'action ou la variante aux maquettes validées.
- **Moteur d'animation.** Le skill `gamification` (section 3) demande **Motion** pour toutes les animations. Les maquettes animent un personnage articulé (membres, vues de dos, de trois-quarts, de profil et de face) image par image, en JavaScript. Les réécrire entièrement avec Motion reviendrait à redessiner et réanimer six scènes déjà validées par le PO après plusieurs tours de retouches.

## Décision

1. **La célébration de l'univers dure jusqu'à 3 s**, écart à la réponse 97.23 accepté par le PO (106.9 B), **à condition** qu'elle ne retienne jamais l'enfant :
   - les boutons de la fin (« Mon parcours », « Accueil ») et le clavier sont **utilisables dès la première image** ; un bouton touché agit tout de suite et arrête la célébration et sa musique (97.22) ;
   - un toucher hors des boutons **ne fait rien** : il ne passe pas la célébration et ne l'arrête pas, comme dans toute l'application (97.17, 106.10) ;
   - l'annonce du moment (« Défi relevé ! ») est donnée une seule fois aux lecteurs d'écran dès le début ;
   - avec les mouvements réduits, il n'y a aucune durée à attendre : l'image fixe de l'état final de la variante tirée s'affiche d'emblée, avec le cri de victoire et l'annonce, sans confetti (106.15, 106.24) ;
   - la musique ne dure pas plus longtemps que la célébration (106.12).

   La **célébration commune** garde sa limite de 1,5 s (97.23) : l'écart ne vaut que pour la célébration de l'univers. Les célébrations des six univers durent à peu près pareil (équité entre univers).
2. **Le moteur d'animation des maquettes est porté tel quel dans un composant isolé** de `src/univers/celebrations/`, plutôt que réécrit avec Motion (106.22). Ce composant ne contient que de l'affichage : il reçoit du domaine (`@domain/motivation`, `celebrationDe`) la variante tirée et le cri de victoire, et ne tire rien au hasard lui-même (le tirage passe par le port `Hasard`). Il ne sert qu'aux célébrations de l'univers.
3. **Motion reste la bibliothèque d'animation du projet** : l'**entrée et la sortie** de la scène de célébration se font avec Motion, sur `transform` et `opacity`, et suivent `MotionConfig reducedMotion="user"` (décision 0033). Toute autre animation de l'application continue d'utiliser Motion.

## Options écartées

- **Garder 1,5 s et raccourcir les maquettes** (106.9 A) : l'action ou la variante disparaîtrait des scènes validées par le PO ; la célébration perdrait ce qui la rend propre à chaque univers.
- **Laisser un toucher passer la célébration** (texte de l'issue) : deux règles différentes dans l'application, et un toucher involontaire ferait sauter la fête ; la réponse 97.17 s'applique partout.
- **Tout réécrire avec Motion** : six scènes à réanimer à la main, avec le risque de s'écarter des maquettes validées, pour un résultat équivalent à l'écran.
- **Copier le moteur dans chaque scène** : six copies du même code à maintenir ; un composant isolé unique les sert toutes.

## Conséquences

- Les scénarios de #106 vérifient que les boutons et le clavier agissent dès la première image, qu'un toucher hors des boutons ne change rien et qu'en mouvements réduits rien ne bouge ; la durée de 3 s au plus est un critère de review des scènes.
- La réponse 97.23 reste vraie pour la célébration commune ; un document qui la cite se lit « célébration commune » (glossaire, décision n°41).
- Le composant isolé de `src/univers/celebrations/` est la seule animation de l'application qui n'utilise pas Motion de bout en bout. La review (`.claude/skills/craftsmanship/`) vérifie qu'il ne contient aucune règle métier, aucun `Math.random()`, et qu'il respecte `prefers-reduced-motion`.
- Les scènes portées respectent la règle absolue sur les contenus pour les enfants (décisions 0028 à 0030) à toutes les tailles et sur l'image fixe : chaque planche est relue avant la livraison de son univers (106b à 106f).
- Si une autre animation longue est un jour demandée, elle fera l'objet d'une nouvelle décision plutôt que d'étendre celle-ci.
