# Nombre d'équipes en parallèle

Mise à jour : 2026-10-24, par le responsable des équipes (décision 0017).

**Règle : 2 équipes par défaut, 3 au maximum, jamais plus.** Le nombre se revoit à chaque fin de vague, avec les mesures ci-dessous.

## Ce que le graphe permet (calcul du 2026-10-24, après les réponses du PO)

Simulation des 21 stories de la beta (`docs/graphe/stories.md`), chaque story comptée pour une même durée, les stories du chemin critique servies en premier.

| Équipes | Durée (en stories) | Gain | Occupation des équipes |
|---|---|---|---|
| 1 | 21 | ×1,0 | 100 % |
| **2** | **11** | **×1,9** | **95 %** |
| **3** | **8** | **×2,6** | **88 %** |
| 4 | 7 | ×3,0 | 75 % |

Lecture :
- **La 2e équipe presque double la vitesse** et reste occupée 95 % du temps.
- **La 3e équipe est maintenant utile** : 11 → 8 stories, occupée 88 % du temps. Avant les réponses du PO, elle ne faisait gagner qu'une story (9 → 8) : les hypothèses `?` allongeaient le chemin critique. Il est passé de 8 à 7 stories (`#20 → #21 → #28 → #29 → #30 → #33 → #45`), et la beta compte 4 stories de plus (#39, #38, #34, #65) qui peuvent avancer en parallèle.
- Une 4e équipe ne gagnerait qu'une story de plus et attendrait un quart du temps : la limite de 3 reste.
- La règle ne change pas : la vague 1 part à 2 équipes pour mesurer, puis on passe à 3 si les conditions plus bas sont réunies. Celle sur les hypothèses `?` l'est déjà pour la beta, sauf les deux questions encore ouvertes sur #34.

## Ce que coûte une équipe de plus

| Coût | Pourquoi il augmente avec le nombre d'équipes |
|---|---|
| **Vitesse de consommation des tokens** | La consommation **totale** pour livrer la beta change peu (chaque story coûte à peu près la même chose), mais elle est dépensée **N fois plus vite** : on atteint plus tôt les limites d'utilisation du compte. S'y ajoutent la session du responsable et les intégrations de `main`. |
| **Intégrations de `main`** | Chaque merge oblige les N − 1 autres équipes à intégrer `main`, relancer les tests et parfois résoudre des conflits : environ N − 1 intégrations par story livrée. |
| **Conflits** | 9 des 21 stories de la beta sont dans Apprentissage (séance, exercices, parcours), et 5 autres (Motivation) réagissent aux séances terminées : plus il y a d'équipes, plus elles touchent les mêmes fichiers. |
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
