# 0029 : Ce qui sépare un fait historique enseigné d'un contenu violent

**Statut** : Acceptée · 2026-10-25 (réponse du PO à la question 3 de #103, précise 0028)

## Contexte

La règle absolue (décisions 0027 et 0028) interdit tout contenu violent. Or les programmes officiels demandent d'enseigner des faits durs : en CM2, par exemple, les deux guerres mondiales. Le PO accepte ces faits et demande de tracer la frontière avec un contenu violent.

## Décision

Un fait du programme officiel est **accepté** s'il respecte les cinq conditions suivantes. Sinon, c'est un contenu violent, **refusé**.

| | Fait historique enseigné (accepté) | Contenu violent (refusé) |
|---|---|---|
| 1. Rattachement | Rattaché à une section des programmes officiels de la classe de l'enfant (`programme.section`) | Sans lien avec le programme, ou d'une classe plus haute |
| 2. Ton | Factuel et neutre : on dit ce qui s'est passé, ses causes, ses conséquences (« La Première Guerre mondiale a duré de 1914 à 1918. Des millions de soldats sont morts. ») | Récit qui s'attarde sur la souffrance, glorifie, met en scène ou rend la violence attirante |
| 3. Détails | Aucun détail de blessure, de sang, de torture, de cadavre, ni de description des armes ou de leur usage | Tout détail de ce type, même bref |
| 4. Images et sons | Carte, frise, date, monument, portrait : jamais de scène de combat, d'arme dessinée, de bruit de bataille | Toute représentation de la violence |
| 5. Regard | Le texte aide à comprendre et à se souvenir (mémoire, paix, droits) ; les victimes sont respectées, aucun peuple ni groupe n'est désigné comme ennemi ou coupable par nature | Propos qui oppose des peuples, déshumanise ou attise la haine |

Conséquences pour les outils :
- Les mots que l'histoire emploie (guerre, arme, mort, soldat, bataille, esclavage…) **n'entrent jamais** dans la liste des termes refusés (`sources/termes-refuses/`). Le ton et les détails se jugent sur le texte entier : c'est le rôle de la relecture humaine du contenu de la bibliothèque, et plus tard de la modération par l'IA (#40).
- Dans la bibliothèque (`scripts/lecons/`), une leçon sur un fait dur suit ces cinq conditions. Un doute se tranche avec le PO, avant la génération.

## Conséquences

- La règle absolue garde toute sa force : cette décision ne crée pas d'exception, elle dit comment enseigner un fait dur sans violence.
- Une leçon personnelle d'histoire écrite par un parent passe le filtre de mots (#103) ; elle est soumise aux cinq conditions lors de la modération par l'IA.
