# Journal de la story #190 : exercice « horloge »

- 2026-11-09 : story créée à la demande du PO, après l'audit du programme (`docs/audit-programme-2026-11.md`).
- Branche de base : `main`. Branche de travail imposée par la session : `ccr-c8729c85-qqi7d1` (elle porte aussi le contenu de l'audit du programme, déjà commité).
- Étape 1 : `domain-modeler` sollicité, car la story introduit un nouveau type d'exercice (Catalogue) et une nouvelle règle de correction (Apprentissage : cohérence des aiguilles).
- Étape 1 : modèle de domaine écrit (`domain-model.md`), 22 questions ouvertes. Glossaire complété (ajouts marqués « à valider »).
- Étape 2 : critères d'acceptance écrits (`features/190-horloge.feature`, `acceptance.md`) : 6 règles, 52 scénarios, 34 questions ouvertes fusionnées.
- ⛔ Validation humaine n°1 demandée au PO. En attente.
- 2026-11-09 : **OK du PO** sur les critères (« Ok ») : toutes les recommandations sont acceptées, dont le découpage (#190.31) : mode placer reporté à l'issue #192. Question 10 sans recommandation : l'orchestrateur suit le programme du CE2 (« moins le quart », « moins vingt »), à confirmer par le PO.
- Scénarios redécoupés : #190 garde 4 règles, 25 scénarios (mode lire) ; 33 scénarios déplacés vers `features/192-horloge-placer.feature`.
- Étape 3 : comportements, dans l'ordre : A1 HeureDeLHorloge, A2 PrecisionDeLHeure, A3 lecture de l'exercice (Catalogue, revue intermédiaire), B1 heure dite, B2 choix proposés, B3 question lire par choix et moment, B4 heure écrite, B5 « Je ne sais pas », clé de révision, revalidation (Apprentissage, revue intermédiaire), puis pipeline de contenu et câblage.
- Bloc A (Catalogue) : A1 `HeureDeLHorloge`, A2 `PrecisionDeLHeure` (les secondes comptent sur le cadran), A3 lecture de l'exercice `horloge` (niveau passé de `lireLecon` à `lireExercices`). 4 cycles RED/GREEN, aucune contestation.
- Revue intermédiaire du bloc A (`3726e8b..c7d86eb`) : À CORRIGER, 2 bloquants (tests manquants : une question par item, aucune question d'horloge au test de départ). Corrigés par des tests de caractérisation (`1f2b36c`) ; non bloquants traités (`estMinuit`, `ModeDeLHorloge`, constantes, garde de type) en `a614fa8`, `d98cb84`.
- Décisions de l'orchestrateur : la règle « au CP en mode placer, heure ≤ 12 » (D17) est gardée dans #190, car elle est déjà testée et prévue par le modèle ; il ne reste à #192 que son scénario E2E et le refus au build Python. Le renommage `surLeCadran` → `minutesSurLeCadran` (non bloquant) n'est pas fait, car le test appelle l'ancien nom : laissé tel quel.
- Dernier commit relu : `c7d86eb` ; delta suivant à partir de `d98cb84`.
