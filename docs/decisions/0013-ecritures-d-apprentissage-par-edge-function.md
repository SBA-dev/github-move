# 0013 : Écritures d'Apprentissage par Edge Function, séance revalidée par le serveur

**Statut** : Acceptée · 2026-10-23

## Contexte

La séance se joue dans le navigateur, y compris hors ligne (décision 0003) : la correction et le calcul des étoiles tournent dans le domaine importé par le front. Le serveur reste la source de vérité : un résultat calculé sur l'appareil ne doit pas être enregistré tel quel.

## Décision

1. **Toute écriture du contexte Apprentissage passe par une Edge Function**, comme pour Famille (décision 0009). Le front lit sous RLS et n'écrit jamais directement.
2. Le cas d'usage `TerminerLaSeance` (Edge Function `terminer-la-seance`, JWT du parent) vérifie le rattachement du parent au profil, **rejoue les réponses** avec le même domaine, recalcule les étoiles et n'enregistre que le résumé de la séance. Une séance incohérente est refusée : rien n'est enregistré, et le refus est journalisé sans donnée d'enfant.
3. L'enregistrement est idempotent (identifiant de séance) : une séance renvoyée au retour du réseau n'est comptée qu'une fois.
4. Les tables d'Apprentissage ont la RLS ; elles sont supprimées en cascade avec le profil et incluses dans l'export (#14).

## Options écartées

- **Écriture directe du front sous RLS** : les étoiles calculées sur l'appareil seraient crues sans vérification, et la règle tiendrait dans les seules policies.

## Conséquences

- Les réponses données ne sont gardées que le temps de la revalidation, puis oubliées (minimisation).
- Une séance terminée sans réseau est gardée sur l'appareil et renvoyée au retour du réseau ; l'écran de fin s'affiche quand même.
