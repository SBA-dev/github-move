# 0033 : Système de design de l'enfant : jetons par rôle, polices servies par le projet, ressort des boutons et transitions

**Statut** : Acceptée · 2026-10-28 (story #96, réponses du PO 96.1 à 96.6 et 96.11)

## Contexte

La story #96 (refonte visuelle) donne à l'application de l'enfant une direction artistique d'aventure cartoon. Jusqu'ici, les couleurs, les polices, les rayons et les mouvements étaient répartis dans les composants et la feuille de style, sans règle commune. Le PO a tranché : style aventure cartoon avec boutons épais en relief (96.1), pas de mode sombre (96.2), Espace parent qui reprend les jetons sans paysage ni personnage guide (96.3), palettes plus vives avec texte et boutons à 4,5:1 au moins dans les 6 univers et en mode dys (96.4), dessin fixe des personnages guides, animations dans #106 (96.5), transitions de 300 ms au plus sur `transform` et `opacity` (96.6).

## Décision

1. **Jetons CSS nommés par rôle**, déclarés dans `:root` de `src/styles.css` (`--fond`, `--texte`, `--surface`, `--contour`, `--sur-principale`, `--matiere-<code>`…). La couleur principale (`--principale`, `--principale-foncee`) est posée sur la racine par `src/univers/jetons.ts`, déclinée par univers. Il n'y a pas de mode sombre : les noms par rôle permettent d'en ajouter un plus tard. Aucune couleur de texte ou de fond n'est écrite en dur dans un composant. Le contraste de 4,5:1 est vérifié par le scénario R1, qui compare chaque texte au décor réellement derrière lui : un texte posé sur le paysage est dans une étiquette ou un panneau en `--surface`.
2. **Baloo 2 (titres) et Andika (texte, et tout en mode dys)**, servies par le projet via `@fontsource`, sans service de polices tiers (RGPD : aucune requête vers l'extérieur).
3. **Un seul écouteur délégué** (`src/boutons/ressort-des-boutons.ts`, branché sur le document) pour le ressort de tous les boutons : le bouton s'enfonce à la pression (toucher, clic, Entrée, Espace) et revient avec un rebond léger chez l'enfant, sans rebond dans l'Espace parent. Les boutons `disabled` ou `aria-disabled` sont ignorés. Avec les mouvements réduits, seul l'assombrissement (règle CSS `button[data-bouton="enfonce"]`) signale la pression.
4. **Transitions par écran** (`src/transitions/`) : glissement latéral en avançant, glissement inverse en revenant, fondu pour « Mes médailles », l'épisode et la fin de séance. Seuls `transform` et `opacity` sont animés, en 300 ms au plus. Avec les mouvements réduits, aucun mouvement ; les touchers sont ignorés pendant l'arrivée de l'écran (mouvement, ou 250 ms), le clavier jamais.
5. **Repères des dessins** : chaque pièce d'un personnage guide porte `data-signe` (ce qui le reconnaît : chemise, casquette…) et le conteneur porte `data-dessin="valide"` quand le personnage a été redessiné. Ils servent aux scénarios, pas à l'affichage.

## Conséquences

- Le bundle JS grossit d'environ 11 kB gzip (les dessins des personnages, C4). Les polices sont 3 fichiers woff2 séparés, d'environ 58 kB en tout (Andika 400 et 700, Baloo 2 700, sous-ensemble latin), hors bundle.
- Une couleur nouvelle passe par un jeton ; un composant qui écrit une couleur en dur est refusé en review.
- `data-dessin="valide"` est un avertissement : Capitaine Sam garde son dessin d'avant la refonte et ne le porte pas. Ce repère et la liste `DESSINS_REDESSINES` sont à retirer quand Capitaine Sam sera redessiné.
- Les animations propres à chaque personnage guide restent à faire dans #106.
