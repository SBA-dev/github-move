# Nombre d'équipes en parallèle

Mise à jour : 2026-10-24, par le responsable des équipes (décision 0017).

**Règle : 2 équipes par défaut, 3 au maximum, jamais plus.** Le nombre se revoit à chaque fin de vague, avec les mesures ci-dessous.

## Ce que le graphe permet (calcul du 2026-10-24)

Simulation des 17 stories de la beta (`docs/graphe/stories.md`), chaque story comptée pour une même durée, les stories du chemin critique servies en premier.

| Équipes | Hypothèses `?` bloquantes : durée | Gain | Occupation des équipes | Hypothèses `?` écartées : durée | Gain | Occupation |
|---|---|---|---|---|---|---|
| 1 | 17 | ×1,0 | 100 % | 17 | ×1,0 | 100 % |
| **2** | **9** | **×1,9** | **94 %** | **9** | **×1,9** | **94 %** |
| 3 | 8 | ×2,1 | 71 % | 7 | ×2,4 | 81 % |
| 4 | 8 | ×2,1 | 53 % | 6 | ×2,8 | 71 % |

Lecture :
- **La 2e équipe presque double la vitesse** et reste occupée 94 % du temps.
- **La 3e n'apporte presque rien tant que les hypothèses `?` ne sont pas tranchées** (17 → 9 → 8) : la beta est limitée par son chemin critique (`#20 → #21 → #27 → #28 → #29 → #30 → #33 → #45`), pas par le nombre d'équipes. Elle passe à ×2,4 si le PO écarte ces hypothèses.
- Au-delà de 3, les équipes attendent plus qu'elles ne travaillent.

## Ce que coûte une équipe de plus

| Coût | Pourquoi il augmente avec le nombre d'équipes |
|---|---|
| **Vitesse de consommation des tokens** | La consommation **totale** pour livrer la beta change peu (chaque story coûte à peu près la même chose), mais elle est dépensée **N fois plus vite** : on atteint plus tôt les limites d'utilisation du compte. S'y ajoutent la session du responsable et les intégrations de `main`. |
| **Intégrations de `main`** | Chaque merge oblige les N − 1 autres équipes à intégrer `main`, relancer les tests et parfois résoudre des conflits : environ N − 1 intégrations par story livrée. |
| **Conflits** | 9 des 17 stories de la beta sont dans Apprentissage (séance, exercices, parcours), et 4 autres (Motivation) réagissent aux séances terminées : plus il y a d'équipes, plus elles touchent les mêmes fichiers. |
| **Charge du PO** | N fois plus de questions et de demandes de merge par heure. Une validation faite trop vite fait perdre plus de qualité que le parallélisme n'en gagne. |
| **Ressources partagées** | Un seul verrou `base`, un seul `merge`, un quota d'e-mails qui ne permet qu'une exécution `@envoi-email` complète par heure. |

## Formule

À chaque fin de vague, le responsable calcule :

```
N = min(3, L, H, T)
```

| Terme | Sens | Comment le mesurer |
|---|---|---|
| `L` | **largeur utile** : nombre de stories prêtes ou qui le deviendront pendant la vague | `docs/graphe/stories.md`, niveaux et hypothèses tranchées |
| `H` | **capacité du PO** : nombre d'équipes dont il peut traiter les questions sans les faire attendre plus d'une demi-journée | demandé au PO ; temps d'attente mesuré pendant la vague |
| `T` | **budget de tokens** : `(part de la limite d'utilisation qu'on accepte de dépenser par fenêtre − part du responsable) ÷ part consommée par une équipe par fenêtre` | champ `usage` de `get_session` pour chaque session (tokens, coût), et compteur d'utilisation du compte |

## Mesures à relever à chaque story

Chaque équipe les note dans `docs/stories/<n>/journal.md` (section « Mesures »), et le responsable les reprend dans la synthèse de vague.

| Mesure | Signal |
|---|---|
| Durée, du lancement au merge | efficacité |
| Temps passé à attendre (PO, verrou, `main`) | perte due au parallélisme |
| Tokens et coût de la session d'équipe (`get_session`, champ `usage`, relevé par le responsable) | coût en tokens |
| Cycles de review À CORRIGER | qualité |
| Cycles E2E KO | qualité |
| Intégrations de `main`, dont avec conflit | coût du parallélisme |
| Régression découverte sur `main` après le merge | **qualité : signal d'arrêt** |

## Passer de 2 à 3 équipes, ou revenir en arrière

**Passer à 3** si toutes ces conditions sont réunies à la fin d'une vague à 2 :
- au moins 3 stories prêtes pour la vague suivante, hypothèses `?` tranchées ;
- aucune régression sur `main` après un merge ;
- cycles de review et E2E pas plus nombreux qu'en livraison une par une (référence : journaux des stories #16 à #18) ;
- aucune question du PO restée sans réponse plus d'une demi-journée ;
- aucune limite d'utilisation atteinte pendant une story.

**Revenir à 2 (ou à 1)** dès qu'un de ces signaux apparaît :
- une régression sur `main` après un merge ;
- en moyenne un cycle de review ou d'E2E de plus par story ;
- une limite d'utilisation atteinte au milieu d'une story ;
- un conflit de code qui a demandé une escalade ;
- des questions du PO en attente depuis plus d'une journée.

Le responsable annonce le nombre retenu et sa raison dans la synthèse de vague. Le PO tranche en cas de doute.
