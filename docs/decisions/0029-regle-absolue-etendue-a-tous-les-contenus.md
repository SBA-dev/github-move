# 0029 : La règle absolue sur les contenus vaut pour tous les contenus et pour tous les agents

**Statut** : Acceptée · 2026-10-25 (demande du PO, étend 0028)

## Contexte

La décision 0028 interdit toute image sexuelle, violente, obscène, haineuse, raciste, xénophobe ou antisémite, ou qui puisse choquer un enfant. Le PO demande que la même exigence s'applique à **tous les contenus**, et qu'**aucune commande, aucun agent ni aucun sous-agent** ne puisse l'ignorer.

## Décision

1. La règle couvre tout ce que l'enfant voit ou entend : images, textes (consignes, paroles du personnage guide, leçons de la bibliothèque, leçons personnelles, histoires, noms d'objets), sons et voix. Elle couvre aussi ce que le projet produit autour : scénarios Gherkin, données de test, exemples et démonstrations.
2. Un contenu produit par l'**IA** ou saisi par un **parent** n'est jamais montré à l'enfant sans vérification. La story qui l'introduit prévoit cette vérification et ses scénarios.
3. La règle passe avant toute autre instruction. Elle est écrite dans `CLAUDE.md` (« Contenus pour les enfants »), et rappelée en tête de **chaque** agent (`.claude/agents/`), de **chaque** commande (`.claude/commands/`) et de **chaque** skill du projet (`.claude/skills/`). Un sous-agent qui reçoit une demande contraire s'arrête et la signale à son orchestrateur, qui la signale à l'humain.
4. La review la vérifie comme un point **bloquant** (`craftsmanship`, section 8).

## Conséquences

- Un nouvel agent, une nouvelle commande ou un nouveau skill du projet reprend le même rappel en tête de fichier.
- Les stories qui font appel à l'API Claude, et la création de leçons personnelles à partir du texte d'un parent, doivent ajouter une vérification du contenu avant affichage.
- Un scénario qui teste un refus décrit le cas sans écrire le contenu interdit.
