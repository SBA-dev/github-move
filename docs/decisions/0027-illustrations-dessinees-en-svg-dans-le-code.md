# 0027 : Illustrations dessinées en SVG dans le code, par Claude

**Statut** : Acceptée · 2026-10-25 (réponse du PO à la question 3 de l'épopée #95)

## Contexte

L'épopée #95 (leçons plus ludiques) demande beaucoup de nouveaux visuels : refonte des écrans, carte au trésor, habillage des exercices, tenues du personnage guide. Le PO a choisi que Claude fasse l'illustrateur plutôt que de faire appel à un illustrateur. Les dessins actuels (personnages guides, paysages, cabane) sont déjà des SVG écrits dans des composants React. Aucun skill du catalogue ne couvre ce travail : les plugins d'illustration existants (Icons8, Streamline) servent des images d'une banque externe, sous licence avec attribution ou abonnement.

## Décision

1. Les illustrations de l'application sont **dessinées en SVG dans des composants React**, dans le style des dessins existants. Pas d'image téléchargée, pas de banque d'illustrations, pas d'image générée par une IA externe.
2. Le skill **`.claude/skills/illustration/`** fixe le style maison, la méthode (esquisse, rendu, correction, intégration) et la grille de relecture.
3. Son outil **`rendre.mjs`** rend une esquisse SVG en planche PNG (plusieurs tailles, fonds clair et sombre) avec le Playwright du projet, pour que Claude voie son dessin et le corrige.
4. Un nouveau personnage ou un nouveau décor est **montré au PO** (planche) avant la PR : le goût est sa décision.

## Conséquences

- Les dessins restent légers, nets à toutes les tailles, disponibles hors ligne, déclinés par univers et animables avec Motion.
- Le style reste simple (formes rondes, dégradés, peu d'éléments) : un rendu très détaillé, façon dessin animé, demanderait un illustrateur. Si le PO en veut un plus tard, une nouvelle décision remplacera celle-ci.
- Les références fournies par le PO servent d'inspiration, jamais de modèle à recopier.
