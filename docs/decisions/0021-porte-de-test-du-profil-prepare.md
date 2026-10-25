# 0021 : Le profil préparé, seule porte de test, en développement seulement

**Statut** : Acceptée · 2026-10-24 · complète 0010 et 0020

## Contexte

- Le lot 1 a livré une page `/demonstration` réservée aux tests (décision n°1 de `docs/stories/lot-1-decisions.md`), disponible en développement ou avec `VITE_PAGE_DEMONSTRATION=1`, avec deux portes pour les scénarios E2E : un « profil préparé » et une « consigne préparée » lus dans le `localStorage`.
- Les scénarios E2E ont besoin de jouer sans connexion : créer un vrai parent et un vrai profil pour chacun des centaines de cas serait lent (latence vers le projet de développement, décision 0010).
- La page était annoncée comme provisoire. Elle était encore servie et, en production, son absence faisait échouer deux scénarios de #8.

## Décision

1. La page `/demonstration` est supprimée. Son adresse mène à l'accueil, comme toute adresse inconnue.
2. Le **profil préparé** reste la seule porte de test : clé `savanturier:profil-prepare`, format inchangé (`prenom`, `niveau`, `univers?`, `reglages?`), lu par `useProfilEnCours` comme profil en cours initial (l'enfant qui choisit un profil est prioritaire).
3. Il n'est actif **qu'en développement** (`import.meta.env.DEV`), sans variable d'environnement. Le module est chargé par import dynamique sous cette garde : le bundle de production ne le contient pas.
4. La **consigne préparée** disparaît. Les consignes et questions de test passent par des leçons de test injectées par les steps, sans code dans l'application.
5. Les scénarios qui ont besoin du serveur créent un vrai profil via `features/steps/profil-reel.ts`.

## Options écartées

- **Un vrai profil partout, par la connexion sans e-mail** : plus lent sur des centaines de scénarios.
- **Garder une variable `VITE_PAGE_DEMONSTRATION` (ou équivalente)** : une porte de test qui peut s'ouvrir dans une version publiée par une erreur de configuration.

## Conséquences

- #8 vérifie que la version publiée ignore le profil préparé.
- Rien ne change pour les steps « profil enfant préparé ».
- Les stories qui dépendent de la porte de test (#27, #65) continuent d'utiliser la même clé et le même format.
