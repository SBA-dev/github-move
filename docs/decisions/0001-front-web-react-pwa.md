# 0001 : Front web React + TypeScript en PWA

**Statut** : Acceptée · 2026-10-22

## Contexte

L'application actuelle (`app/`, HTML/CSS/JS vanilla) est jugée trop statique. On veut une application fluide et très animée, utilisable sur ordinateur, tablette et téléphone.

## Options étudiées

Deux maquettes interactives ont été réalisées pour comparer :
- **Option 1** : React + TypeScript + Vite en PWA, avec Motion pour les animations, Rive ou Lottie pour la mascotte, et Tailwind.
- **Option 2** : Flutter, avec Rive et Flame pour les mini-jeux, publiée sur les stores.

## Décision

**Option 1**, une PWA React + TypeScript (Vite) animée avec Motion.

## Conséquences

- On l'ouvre avec un simple lien et elle s'installe sur l'écran d'accueil. Les mises à jour sont instantanées, sans validation des stores.
- Le format des leçons et le pipeline de contenu actuels sont réutilisés tels quels.
- Pas de présence sur les stores. Si elle devient indispensable, une nouvelle décision étudiera un emballage natif (Capacitor) ou Flutter.
