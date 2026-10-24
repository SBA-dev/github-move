# Journal de la story #25 : Parcours par matière et verrous

Équipe lancée par le responsable (`/graphe`, vague 1, issue de coordination #64).
Branche de base : `main`. Branche de travail : `feature/25-parcours-par-matiere-et-verrous`.

## 2026-10-24

- 12:40 UTC : démarrage. Story voisine : #20 (ne pas toucher à ses agrégats). Aucune dépendance ouverte.
- 12:40 UTC : la table `resultats_des_lecons` (#24) porte `meilleures_etoiles` par profil et par leçon : a priori
  suffisante pour la progression, à confirmer par `domain-modeler`. Sans nouvelle migration, pas de verrou `base`.
- 12:50 UTC : étape 1 faite (`domain-modeler`) : parcours = service de domaine pur (`apprentissage/domain/parcours.ts`),
  pas d'agrégat, pas d'événement, **pas de migration** (`resultats_des_lecons` suffit, lecture front sous RLS).
- 13:05 UTC : étape 2 faite (`po-acceptance`) : 8 règles, 32 scénarios dont 16 `@a-valider`, 16 questions ouvertes.
  Conflit relevé : la règle « Leçon suivante » du parcours rend faux deux scénarios de #24 (question 2).
  CADRAGE PRÊT publié sur #25 ; attente de l'annonce du responsable.
- 13:07 UTC : annonce du responsable (#64) : OK du PO. #25.1 = b, **aucun verrou** (toutes les leçons ouvertes, la
  prochaine leçon seulement mise en avant) ; #25.12 = a, les leçons de CE2 réussies restent visibles pour l'enfant
  redescendu en CE1 (endroit non précisé) ; reco de l'équipe pour toutes les autres questions. Reprise du cadrage.
- 13:15 UTC : À SAVOIR (#64) : après la migration de #20, `seances_terminees.etoiles` peut valoir `null`. Sans effet :
  le parcours ne lit que `resultats_des_lecons`, inchangée.
- 13:30 UTC : critères révisés (`po-acceptance`) : 8 règles, 36 scénarios dont 7 `@a-valider` (N1, N4, N7-N10). R3
  remplacée par une règle positive (toute leçon montrée s'ouvre) : acceptée, elle traduit la réponse 25.1.
  CADRAGE PRÊT mis à jour (questions N1-N11). TDD lancé sur ce qui ne dépend d'aucune question.

### Comportements TDD (ordre prévu)

Indépendants des questions N :
1. `parcoursDeLaMatiere` : leçons de la matière et du niveau de l'enfant, triées par `ordre` puis par identifiant, avec leur place (1, 2…).
2. État des leçons : réussie (meilleures étoiles), prochaine (première non réussie), à découvrir (les autres non réussies).
3. Parcours entièrement réussi : aucune prochaine leçon.
4. Compteur : leçons réussies sur leçons du niveau (les leçons réussies d'un autre niveau ne comptent pas).
5. `matieresDuParcours` : matières qui ont au moins une leçon du niveau, dans l'ordre du Catalogue.
6. `leconSuivanteDansLeParcours` : première leçon d'après non réussie du même parcours ; aucune après la dernière.
En attente d'une réponse : leçons réussies d'une classe au-dessus (N1, N7, N9), repli de la leçon suivante (N4), leçon suivante après une leçon d'une classe au-dessus (N10).
