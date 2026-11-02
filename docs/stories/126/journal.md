# Journal : story #126, exercices comme des jeux (98b) : bulles de choix

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), à la demande du PO (« Graphe 126 »).
Branche : `feature/126-bulles-de-choix`, partie de `main` (`f8a4787`). Branche de base : `main`.
Dépendances mergées : #97 et #98 (98a). Le PO lance #126 avant #130 (petit train). Story voisine en parallèle : #106 (célébration de l'univers).
Numéro de décision : prochain libre 0040, si besoin. Commentaire `Avancement` : 6588520873.

## 2026-11-02

- 21:20 UTC : démarrage. Lu : issue #126 et le découpage révisé du responsable (6481220011), #64 (annonces jusqu'à 6588499848), `docs/stories/98/domain-model.md`, `journal.md` de #98.
- 21:22 UTC : étape 1, délégation à `domain-modeler` : la story n'ajoute aucun concept du domaine, mais elle introduit des dessins par univers (bulle de l'univers) dont les objets doivent être nommés par le PO, et des mots d'interface (ballon, bulle de savon). Modèle court, centré sur la tranche.
- 21:45 UTC : `domain-modeler` rend `domain-model.md` (`36150f1`) : aucun changement du domaine. 6 règles. Bulle de l'univers pour les 10 types (98.4), flottement pour `bulles` et `ecoute`. Objets proposés par univers. Écart repéré : la question d'un `classer` en révision et au test de départ a le type `bulles`. Questions #126.1 à #126.10.
- 21:46 UTC : étape 2, délégation à `po-acceptance`.
- 22:10 UTC : `po-acceptance` rend `acceptance.md` et `features/126-bulles-de-choix.feature` (`43496ec`) : 6 règles, 26 scénarios (14 plans, 62 cas), 6 `@a-valider`. Nouvelle question #126.11. Aucune séance complète : `delais.steps.ts` inchangé. Contenu relu contre la règle absolue : rien à signaler.
- 22:12 UTC : CADRAGE PRÊT publié sur #126. Attente de la validation du PO (annonce `[Responsable]`). Pendant l'attente : planches de la bulle de l'univers (⛔ intermédiaire, reco de #126.1), sans code de production.
- 22:25 UTC : planches de la bulle de l'univers rendues par `implementer` en rôle d'illustrateur (`b637063`), selon la reco de 126.1. Une seule correction entre les passes : l'anneau du focus et l'opacité de « s'efface ». Relue par l'orchestrateur contre la règle absolue : rien à signaler. `PLANCHES PRÊTES` publié sur #126 (⛔ intermédiaire).
