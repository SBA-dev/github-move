# Journal de la story #32 : Cabane, des objets débloqués par paliers d'étoiles

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Branche : `feature/32-cabane`, partie de `main` (`e466e25`). Branche de base : `main`.

## 2026-10-25

- 12:20 UTC : démarrage. Consigne du responsable : **cadrage seulement** (domaine, scénarios, questions au PO avec une reco chacune), puis `CADRAGE PRÊT`. Le TDD attend l'annonce `[Responsable] MAIN A BOUGÉ : #72 mergée`. Aucune E2E contre savanturier-dev avant cette annonce.
- Dépendances mergées : #24, #25, #27, #65. Stories voisines en cours : #28, #26, #72 (ne pas toucher leurs agrégats).
- 12:30 UTC : `domain-modeler` : modèle sans agrégat ni table, cabane recalculée à la lecture à partir des meilleures étoiles (`resultats_des_lecons`, lecture sous RLS déjà faite par #25). Ni migration ni Edge Function : le verrou `base` n'est pas nécessaire. Questions 32.1 à 32.20.
- 12:30 → 13:20 UTC : `po-acceptance` interrompu par la limite d'utilisation, sans rien écrire ; relancé après le redémarrage de la session.
- 13:45 UTC : `po-acceptance` : 6 règles, 28 scénarios (34 cas), 17 `@a-valider`, 3 `@acces`. `bddgen` : syntaxe OK, 13 étapes à définir. Nouvelles questions 32.21 à 32.24 (32.21 : mettre à jour 4 scénarios de #65 dans la même PR).
- CADRAGE PRÊT publié sur #32 ; attente de la validation du PO par une annonce `[Responsable]`.
