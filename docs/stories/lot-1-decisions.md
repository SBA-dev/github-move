# Lot 1 (Socle) : décisions du PO sur les scénarios

Validation n°1 du lot 1 (issues #5 à #8), donnée par le PO le 2026-10-22 : « OK » pour toutes les propositions ci-dessous.
Les questions de détail non citées ici suivent la proposition faite dans les scénarios (`@a-valider`) ou dans `docs/stories/<n>/acceptance.md`.

## Transverses

1. **Vérifier le lot 1 avant les exercices** : une **page de démonstration réservée aux tests** montre une consigne, les humeurs du personnage guide, ses félicitations et ses encouragements. Elle est retirée au lot 3, quand les exercices la remplacent.
2. **Ordre des écrans** : l'écran de connexion d'abord. Après le lien de connexion, le parent arrive dans l'espace parent. L'écran « Qui joue ? » arrive au lot 2. En attendant, les tests partent de profils enfants préparés.
3. **Textes du legacy** repris mot pour mot : félicitations, encouragements, expressions de chaque personnage guide, et « Je t'entends ! Je suis <nom du personnage guide>. » (le personnage guide dit son propre nom).
4. **Architecture** :
   - sous-domaine **Voix** à part (`supabase/functions/_shared/voix/`) ;
   - les interfaces des ports utilisés par le front (lecture à voix haute, voix de l'appareil, hasard) peuvent être déclarées dans `domain/`. Consigné dans la décision 0007.

## #5 Connexion du parent

5. On ne peut **pas** utiliser l'application sans être connecté.
6. Le lien de connexion vaut **1 heure** et sert **une seule fois**. **Un seul message** pour un lien expiré ou déjà utilisé.
7. **Lien ouvert sur un autre appareil** : l'e-mail contient aussi un **code à 6 chiffres**, que le parent peut saisir sur l'appareil qui a fait la demande.
8. La **déconnexion** se fait seulement depuis l'espace parent, protégé par le contrôle parental (lot 2).

## #6 Univers et personnage guide

9. Référence visuelle et animation : l'artifact « Savanturier Web animé » (démo de l'option 1 de la décision 0001), https://claude.ai/artifact/GQyTR5c5mY33qo4pv3KVEe. Le personnage guide reste **dessiné en SVG et animé avec Motion** (respiration, clignement, saut de joie, tête penchée). Rive pourra venir plus tard, par une nouvelle décision.

## #7 Voix

10. Le **choix de la voix par le parent** (voix imposée) passe au **lot 2**, avec l'espace parent. Il reste mémorisé **sur l'appareil**, comme aujourd'hui. La story #7 garde la lecture à voix haute, le caractère de la voix, Son/Muet et la voix bloquée.

## #8 PWA installable

11. Pas de bouton « Installer ». Une **aide pour iPad et iPhone** explique comment ajouter Savanturier à l'écran d'accueil, puisque Safari ne le propose pas.
12. Une nouvelle version s'applique **au lancement suivant**, sans jamais recharger un écran en cours d'utilisation.

## Branches

13. Le lot 1 est préparé sur la branche imposée par la session (`claude/stoic-faraday-0qy6ez`).
