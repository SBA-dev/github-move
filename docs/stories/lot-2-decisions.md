# Lot 2 (Famille) : décisions du PO sur les scénarios

Validation n°1 du lot 2 (issues #10 à #15), donnée par le PO le 2026-10-22 : « OK » pour toutes les propositions ci-dessous.
Les questions de détail non citées ici suivent la proposition faite dans les scénarios (`@a-valider`), dans `docs/stories/<n>/acceptance.md` ou dans `docs/stories/<n>/domain-model.md`.

1. **Droits des deux parents** : mêmes droits (modifier, régler, inviter, exporter). Si l'un supprime le profil, il disparaît pour les deux, après un avertissement. Personne ne peut retirer l'autre parent dans ce lot.
2. **Invitation** : lien valable 7 jours, utilisable une seule fois, une seule invitation en attente par profil (une nouvelle remplace l'ancienne). Le parent qui invite peut l'annuler. Le lien vaut pour quiconque l'a en main (pas réservé à une adresse e-mail). Le parent invité confirme (« Accepter » ou « Refuser »). Avant la connexion, la page du lien n'affiche pas le prénom de l'enfant.
3. **Ce que chaque parent voit** : une invitation vaut pour un seul enfant. Deux parents ne voient pas leurs autres enfants respectifs. Aucun ne voit l'adresse e-mail de l'autre, et l'export ne la contient pas.
4. **Contrôle parental** : même question après une erreur, essais illimités, seule l'entrée de l'espace parent est protégée. Pas de question juste après la connexion du parent. En sortant, on revient sur « Qui joue ? ». À la réouverture de l'application, l'espace parent est refermé.
5. **Premier profil** : il se crée dans l'espace parent, juste après la connexion. « + Ajouter un enfant » demande le contrôle parental. Choisir qui joue reste libre pour l'enfant.
6. **Prénom** : doublons permis, prénom trop long coupé à 20 caractères. Prénom vide refusé avec un message (écart voulu avec le legacy). Pas de nombre maximal de profils.
7. **Classe et ouverture** : changer de classe garde la progression. « Qui joue ? » s'affiche à chaque ouverture (le profil en cours n'est pas mémorisé).
8. **Réglages** : mode dys comme aujourd'hui (police Andika, texte espacé, syllabes en couleurs alternées). Les 20 langues sont gardées ; la langue du parent est un réglage de chaque profil enfant. Seul le texte de la consigne est envoyé à l'IA pour la traduction. Les réglages ne sont jamais gardés sur l'appareil. « Tout lire » se vérifie sur la page de démonstration, avec trois choix proposés.
9. **Suppression** : immédiate et définitive, après un avertissement. L'export est proposé avant la confirmation. Sans réseau, la suppression est refusée avec un message. La suppression du compte du parent est renvoyée à une story à part.
10. **Export** : fichier JSON lisible, nommé `savanturier-<prénom>-<date>`.
11. **Voix imposée** : elle garde le caractère du personnage guide ; l'anglais garde sa voix anglaise. Si la voix imposée disparaît, la voix automatique reprend (affichée comme choisie) et le choix est gardé en mémoire. Le choix reste sur l'appareil après la déconnexion du parent. L'essai de voix fait parler le personnage guide du profil en cours, ou Noisette s'il n'y en a pas.
12. **Choix techniques** : consignés dans la décision 0009.
