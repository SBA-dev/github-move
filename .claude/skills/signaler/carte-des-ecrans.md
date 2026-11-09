# Carte des écrans : où chercher

Point de départ pour l'étape 2 du skill `signaler`. **Le code fait foi** : vérifie par `Grep` (texte affiché, nom du composant, route de `src/navigation.ts`). Si une ligne est fausse ou manque, corrige-la dans la PR du signalement.

Conventions :
- `src/…` : front React (cible). Le domaine est sous `supabase/functions/_shared/<contexte>/domain/`, importé par le front via `@domain/<contexte>`.
- **Stories** : issues d'origine ; leurs scénarios sont dans `features/<n>-<slug>.feature` (tag `@issue-<n>`), leur modèle dans `docs/stories/<n>/`.
- **Fonctions** : Edge Functions sous `supabase/functions/<nom>/`.

## Application de l'enfant

| Écran ou section (route) | Ce qu'on y voit | Code du front | Contexte | Fonctions | Stories |
|---|---|---|---|---|---|
| Qui joue ? | choix du profil enfant | `src/famille/QuiJoue.tsx` | Famille | — | #11 |
| Accueil (`/`) | leçon du jour, objectif, quête du jour, tuiles de matière, pastille de série | `src/accueil/`, `src/famille/AccueilDeLEnfant.tsx` | Apprentissage, Motivation | — | #29, #101, #30 |
| En-tête et dock | profil, son, accès Parent, barre d'icônes | `src/en-tete/EnTete.tsx`, `src/accueil/DockDeLEnfant.tsx` | transverse | — | #96, #184 |
| Mon parcours (`/parcours`) | carte au trésor, boutons de leçon, verrous, classes d'avant, repère du défi | `src/parcours/` | Apprentissage | — | #25, #26, #99 |
| Toutes les leçons (`/toutes-les-lecons`) | liste libre des leçons | `src/toutes-les-lecons/` | Apprentissage, Catalogue | — | #26 |
| Page de la leçon (`/lecon/<id>`) | étapes de la leçon avant les exercices | `src/seance/PageDeLaLecon.tsx`, `src/seance/useLecon.ts` | Catalogue | — | #16 |
| Séance (`/lecon/<id>/seance[/<n>]`) | déroulement, consigne, progression, personnage guide et sa bulle | `src/seance/EcranDeSeance.tsx`, `useDeroulementDeSeance.ts`, `RecipientDeProgression.tsx`, `BulleDuPersonnageGuide.tsx` | Apprentissage | `terminer-la-seance` | #16, #79, #183 |
| Séance, exercices à choix / bulles | QCM, vrai-faux, bulles de choix | `src/seance/exercices/ExerciceAChoix.tsx`, `QuestionAChoix.tsx`, `bulles-de-choix/` | Apprentissage | — | #17, #126 |
| Séance, classer, ordre, trous, petit train | étiquettes, texte à trous, train de l'univers | `src/seance/exercices/ExerciceAEtiquettes.tsx`, `etiquettes/`, `TexteATrous.tsx`, `mot-qui-voyage/` | Apprentissage | — | #18, #130 |
| Séance, dictée, conjugaison, claviers | clavier de lettres, cases, tableau de conjugaison | `src/seance/exercices/ExerciceDeDictee.tsx`, `ClavierDeLaDictee.tsx`, `CasesDeLaDictee.tsx`, `TableauDeConjugaison.tsx`, `claviers/` | Apprentissage | — | #19, #128 |
| Séance, calcul, fluence, addition posée | clavier de cristaux, maisons de l'addition | `src/seance/exercices/ExerciceDeCalcul.tsx`, `fluence/`, `addition/`, `maisons/`, `src/seance/difficulte/` | Apprentissage | — | #20, #127 |
| Séance, boîte et barres | jetons, boîte, jauge | `src/seance/exercices/boite/` | Apprentissage | — | #21, #131 |
| Séance, poésie, parchemin | mémoriser une poésie, texte qui se dévoile | `src/seance/exercices/ExerciceDeMemorisation.tsx`, `src/seance/parchemin/` | Apprentissage | — | #22, #129 |
| Séance, aide et « Je ne sais pas » | boutons d'aide | `src/seance/` (chercher le libellé) | Apprentissage | — | #23 |
| Séance, retour sur une réponse | bonne réponse animée et sonore, réponse fausse animée | `src/retours/`, `src/seance/useSceneDeReponseFausse.ts`, `src/univers/reponse-fausse/` | Apprentissage, Motivation | — | #97, #163 |
| Fin de séance | étoiles, célébration de l'univers, musique | `src/seance/fin-de-seance/`, `src/celebration/`, `src/univers/celebrations/` | Apprentissage, Motivation | `terminer-la-seance` | #24, #106, #166, #141 |
| Test de départ (`/test-de-depart`) | proposition, déroulement, fin | `src/test-de-depart/` | Apprentissage | `terminer-le-test-de-depart` | #27 |
| Révisions (`/revision`) | file des erreurs à revoir | `src/revision/` | Apprentissage | `terminer-la-seance-de-revision` | #28 |
| Défi et grand défi (`/defi`) | défi de fin de partie du parcours, grand défi de la matière | `src/defis/` | Apprentissage | `terminer-le-defi` | #100, #137 |
| Mes médailles (`/medailles`) | badges, cabane, tenues, défis relevés, histoire | `src/medailles/`, `src/tenue/` | Motivation | — | #65, #31, #32, #102 |
| Épisode de l'histoire (`/histoire/<n>`) | livre de l'épisode, annonce d'un nouvel épisode | `src/histoire/` | Motivation | — | #33 |
| Univers et personnage guide | paysage, dessin du personnage guide, palettes, jetons | `src/univers/` (`Paysage.tsx`, `PersonnageGuide.tsx`, `personnages/`, `palettes.ts`) | Motivation | — | #6, #96, #102 |
| Voix | lecture à voix haute, choix de la voix, effets sonores | `src/voix/` ; domaine `_shared/voix/` | Voix | — | #7, #15, #182 |
| Mode dys | police, espacement, syllabes | `src/reglages/mode-dys.tsx` ; domaine `_shared/voix/` (syllabes) | Famille, Voix | — | #12 |
| Transitions et animations | arrivée d'un écran, mouvements réduits | `src/transitions/`, `src/boutons/` | transverse | — | #97 |

## Espace parent

| Écran ou section | Ce qu'on y voit | Code du front | Contexte | Fonctions | Stories |
|---|---|---|---|---|---|
| Connexion, inscription, mot de passe oublié | formulaires, règles du mot de passe | `src/connexion/` | Famille | `inscrire-le-parent`, `reinitialiser-le-mot-de-passe`, `envoyer-email` | #5, #72 |
| Espace parent (`/espace-parent`), profils | liste des profils, créer, modifier | `src/famille/EspaceParent.tsx`, `ProfilsDeLEspaceParent.tsx`, `FormulaireDeProfil.tsx`, `InvitationDuPremierProfil.tsx` | Famille | `creer-profil-enfant`, `modifier-profil-enfant` | #11, #104 |
| Réglages d'un profil, contrôle parental | réglages, choix de la voix | `src/famille/ControleParental.tsx`, `src/voix/ChoixDeLaVoix.tsx` | Famille | `modifier-profil-enfant` | #10, #12, #15 |
| Inviter un second parent | lien d'invitation | `src/famille/` (chercher « invitation ») | Famille | — | #13 |
| Supprimer et exporter un profil | export, suppression | `src/famille/` (chercher « exporter », « supprimer ») | Famille | — | #14 |
| Suivi | leçons jouées, carte des compétences | `src/suivi/` | Accompagnement | — | #34 |
| Leçons personnelles | créer une leçon, mes leçons | `src/accompagnement/` ; domaine `_shared/accompagnement/` | Accompagnement | `creer-une-lecon-personnelle`, `supprimer-une-lecon-personnelle` | #39, #103, #186, #188 |
| Aucun son côté parent | — | (chercher les lecteurs de `src/voix/`) | transverse | — | #73 |

## Transverse

| Zone | Code | Stories ou règle |
|---|---|---|
| PWA, installation, hors ligne | `src/installation/`, `src/reseau/`, `vite.config.ts` | #8 ; tests `playwright.pwa.config.ts` |
| Navigation, routes | `src/navigation.ts`, `src/Application.tsx` | — |
| Base de données, droits | `supabase/migrations/` (RLS) | décisions 0009, 0013, 0016 |
| Mise en ligne, production | `scripts/exploitation/`, `docs/publication.md` | #45 |
| Leçons de la bibliothèque (contenu) | `scripts/lecons/*.py`, `scripts/build_bibliotheque.py`, tests `scripts/tests/` | règles pédagogiques de `CLAUDE.md` ; jamais `app/bibliotheque.json` à la main |
| Format des leçons | `docs/format-lecons.md`, domaine `_shared/catalogue/` | contrat : doc, pipeline et domaine changent ensemble |
| Tests E2E (outillage) | `features/steps/`, `features/support/`, `playwright*.config.ts` | décisions 0020, 0040 |
| Application legacy | `app/index.html`, `app/app.js`, tests `tests/legacy/` | corrections de bugs seulement |
