# Journal de la story #102 : Le personnage guide évolue avec les étoiles

Équipe lancée par le responsable des équipes (`/graphe`, vague 1, issue de coordination #64).
Branche de base : `main` (départ `c8b0ed3`). Branche : `feature/102-personnage-guide-evolue`.
Décision réservée : 0036.

## 2026-10-28

- 23:45 UTC : démarrage. Issue lue, annonces `[Responsable]` de #64 lues. Dépendances mergées : #96, #97, #99.
- Étape 1 (domaine) : nécessaire, la story introduit un concept absent du glossaire (tenue ou évolution du personnage guide). Délégation à `domain-modeler`.
- 00:05 UTC (29/10) : modèle de domaine rendu (`domain-model.md`). Contexte Motivation, tenues reçues recalculées depuis le total des étoiles (comme la cabane, sans la modifier), tenue portée seule donnée gardée. Questions #102.1 à #102.20. Délégation à `po-acceptance`.
- 00:25 UTC : critères rendus par `po-acceptance` : 6 règles, 39 scénarios (48 cas), tranche minimale #102.17. Questions #102.21 à #102.27 ajoutées. CADRAGE PRÊT publié sur #102, attente de la validation du PO par le responsable.

## 2026-10-29

- 00:02 UTC : ✅ validation n°1 levée par le responsable sur #64 (réponse du PO : « #102 reco tout »). Aucune ressource partagée. Danses confiées à #106.
- 00:15 UTC : réponses reportées dans `domain-model.md` (invariant 3 revu pour #102.24 B), `acceptance.md`, `.feature` ; termes ajoutés au glossaire et note à la context map.

### Liste des comportements (TDD)

Bloc A, tenues reçues (`tenues.ts`) :
1. `PALIERS_DES_TENUES` : 5, 12, 23, 37, croissants, écart ≥ 3, clés uniques, aucune clé de la cabane.
2. `tenuesDe(total)` : tenues reçues, prochain palier, toutes reçues, total invalide.
3. `tenueRecueParLaSeance` : tenue reçue par la séance (calcul du total après la séance partagé avec la cabane).

Bloc B, tenue portée (`tenue-portee.ts`) :
4. `porterUneTenue` : tenue reçue acceptée, `TenueInconnue`, `TenueNonRecue`.
5. `retirerLaTenue`.
6. `tenueAMontrer` : clé inconnue, étoiles lues, étoiles non lues (#102.24 B).

Bloc C, paroles, sons, sections :
7. `paroles-des-tenues.ts` : annonce, titre de l'encart, description accessible, titre et phrase de la section.
8. `effetsSonoresDeLaFin` : tenue reçue, « decouverte » une seule fois.
9. `sectionsDeLEcran` : section `tenues` après la cabane, absente sans tenue reçue.
