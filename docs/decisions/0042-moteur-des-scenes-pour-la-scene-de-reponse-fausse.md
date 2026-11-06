# 0042 : Le moteur commun des scènes animées sert aussi à la scène de réponse fausse, avec une durée passée en paramètre (1,5 s au plus), à la place du dessin du personnage guide ; la scène ne retient jamais l'enfant

**Statut** : Acceptée · 2026-11-05 (story #163, réponses du PO aux questions 163.2, 163.7 et 163.10, « 163 reco tout »). Complète 0039, sans la remplacer.

## Contexte

La story #163 fait jouer, à la première réponse fausse de la séance, une courte **scène de réponse fausse** par le personnage guide du profil (Coach Léo d'abord, puis un personnage guide par livraison). Les maquettes validées par le PO (`docs/maquettes/`) animent ces scènes avec le même moteur que les célébrations de l'univers : un personnage articulé animé image par image.

La décision 0039 a porté ce moteur dans un composant isolé (`src/univers/celebrations/commun/`, après 106h) et dit qu'il « ne sert qu'aux célébrations de l'univers », avec une durée fixe de 3 s (`DUREE_DE_LA_CELEBRATION_S`). Elle prévoit qu'une autre animation fasse l'objet d'une nouvelle décision.

## Décision

1. **Le moteur commun des scènes animées** (`src/univers/celebrations/commun/`) sert aussi aux scènes de réponse fausse. Ce qui doit servir aux deux (corps, membres, mains, visage, expressions, dessins des personnages) est déplacé dans `commun/`, sans copie dans `src/univers/reponse-fausse/`.
2. **La durée devient un paramètre** du moteur (`jouerLaScene`) : 3 s au plus pour la célébration de l'univers (0039), **1,5 s au plus** pour la scène de réponse fausse (163.2 A). Les scènes des maquettes sont réduites à la réaction (surprise, rire, pouce levé), resserrées puis accélérées.
3. **La scène de réponse fausse se joue à la place du dessin du personnage guide**, à sa taille, dans la zone du personnage guide de la séance et dans celle de la révision et des défis (163.7 A). Elle ne couvre jamais la question ; le dessin fixe revient à la fin, avec l'humeur `reflechit`. Avec l'addition posée sur téléphone (personnage guide de 40 px), aucune scène.
4. **La scène ne retient jamais l'enfant** : la question, ses choix, le clavier et les boutons sont utilisables dès la première image ; toute réponse, « Je ne sais pas », « Réécouter » ou « Retour » agit tout de suite et arrête la scène ; un toucher hors des boutons ne fait rien (97.17, 106.10). En mouvements réduits, l'image fixe (personnage guide souriant, pouce levé) s'affiche d'emblée. Si la scène ne se charge pas, la nouvelle chance n'attend pas.
5. Comme en 0039 : le composant ne contient que de l'affichage. Le choix de jouer la scène et de laquelle vient du domaine (`@domain/motivation`, `sceneDeReponseFausse`), sans hasard ; **Motion** reste pour l'entrée et la sortie (décision 0033).

## Options écartées

- **Réanimer les scènes de réponse fausse avec Motion seul** : plus de travail, avec le risque de s'écarter des maquettes validées.
- **Un second moteur ou une copie par scène** : deux codes à maintenir pour le même personnage articulé.
- **Jouer la scène en grand, par-dessus l'écran** (163.7 B) : elle cacherait la question et l'aide.
- **Garder la durée de la célébration de l'univers** (3 s) : après une erreur, l'enfant doit retrouver vite sa question, et la scène doit rester moins attrayante qu'une bonne réponse (skill `gamification`, section 5).

## Conséquences

- Le moteur commun ne sert plus seulement aux célébrations de l'univers : la phrase de 0039 « il ne sert qu'aux célébrations de l'univers » se lit « il sert aux célébrations de l'univers et aux scènes de réponse fausse ».
- La durée de 1,5 s au plus est un critère de review de chaque scène de réponse fausse ; la review vérifie aussi qu'elle ne contient ni règle métier, ni `Math.random()`, ni son à elle, et qu'elle respecte `prefers-reduced-motion`.
- Les scènes de réponse fausse respectent la règle absolue sur les contenus pour les enfants (décisions 0028 à 0030) à toutes les tailles et sur l'image fixe : la planche de chaque personnage guide est validée par le PO avant le câblage (163.12).
- Toute autre animation qui voudrait ce moteur fera l'objet d'une nouvelle décision.
