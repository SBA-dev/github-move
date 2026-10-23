# Modèle du domaine : issue #11, Créer et modifier un profil enfant, et choisir qui joue

## Contexte

**Famille** (contexte existant). Le profil enfant est le cœur du contexte : Apprentissage y lit le niveau et les réglages, Motivation la clé de l'univers (story #6). Cette story pose l'agrégat `ProfilEnfant` et ses **rattachements** ; les stories #12 (réglages), #13 (invitation) et #14 (suppression, export) le complètent.

Relations :
- **Famille → Motivation** (existante, #6) : le profil garde la `CleUnivers` ; Motivation retrouve l'univers et son personnage guide. Famille **importe le type** `CleUnivers` de `@domain/motivation` (Published Language, comme Voix → Motivation pour `CaractereDeLaVoix`) pour refuser une clé inconnue à la création (décision 0009, n°5).
- **Catalogue → Famille** (Published Language) : le `Niveau` (CP à CM2) est un terme du format des leçons. C'est un value object publié par le Catalogue pédagogique (`@domain/catalogue`) et importé par Famille (décision 0009, n°5).
- **Famille → Apprentissage** (existante) : niveau et réglages du profil, lus par identifiant.
- **Supabase Auth → Famille** (existante, #5) : le `ParentId` du parent connecté.

### Comportement actuel (`app/`, `showHome` l. 433, `childForm` l. 474, `adultProfils` l. 2153)

- **Sans profil** : Noisette accueille (« Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. ») avec le formulaire, **sans contrôle parental**.
- **Formulaire** : prénom (champ limité à 20 caractères, espaces autour retirés, puis coupé à 20) ; un prénom vide est ignoré **sans message** ; classe (CP par défaut, premier de la liste) ; univers (« Animaux de la forêt » par défaut) ; réglages repliés (#12) ; « C'est parti ! » ou « Enregistrer ».
- Un profil garde aussi sa **date de création** (`cree`), qui fixe l'ordre des cartes.
- **« Qui joue aujourd'hui ? »** : une carte par profil, dans l'ordre de création : personnage guide de son univers, prénom, « CE1 · Animaux de la forêt », puis « + Ajouter un enfant » (lui aussi **sans contrôle parental**). Toucher une carte : l'enfant arrive sur sa carte, le personnage guide dit « Bonjour Léa ! » (toujours, réglage « tout lire » ou non).
- Le profil choisi n'est **pas mémorisé** : à chaque ouverture, on repasse par « Qui joue ? ».
- Après une création : proposition du test de départ (lot 4).
- Onglet « Profils » de l'espace : un formulaire par profil, « Ajouter un enfant », « Refaire le test de départ » (lot 4), « Supprimer ce profil » (#14).
- Deux profils peuvent avoir le même prénom. Aucun nombre maximal de profils.
- Un univers inconnu s'affiche comme « Animaux de la forêt » (repli de #6).

## Termes

| Terme | Statut | Remarque |
|---|---|---|
| Profil enfant | au glossaire (confirmé) | Définition complétée : date de création, parents rattachés. |
| Parent | au glossaire (confirmé) | |
| Rattachement | au glossaire (confirmé) | Confirmé par la décision de démarrage n°5 et les décisions n°1 et n°3 du lot 2 (mêmes droits pour les deux parents, un rattachement par enfant). Le parent qui crée le profil y est rattaché d'office. |
| Prénom | **nouveau** (à valider) | Prénom ou pseudo de l'enfant, 1 à 20 caractères. Le glossaire dit « prénom ou pseudo » : un seul terme dans le code, `Prenom`. |
| Niveau / Classe | au glossaire (confirmé) | **Niveau** dans le code ; l'interface dit « Classe » (le glossaire interdit « classe » dans le code seulement). |
| Univers | au glossaire (Motivation) | Le profil garde sa clé. |
| Qui joue ? | **nouveau** (à valider) | Écran où l'enfant touche son profil pour jouer, affiché à chaque ouverture (décision n°7 du lot 2). Terme d'interface ou du domaine : question ouverte n°2. |
| Profil en cours | **nouveau** (à valider) | Profil enfant qui joue en ce moment sur l'appareil. Le legacy dit `child`. |
| Élève, joueur, utilisateur | synonymes interdits | Déjà au glossaire. |

## Modèle

```mermaid
classDiagram
  class ProfilEnfant {
    <<agrégat (racine)>>
    ProfilEnfantId id
    Prenom prenom
    Niveau niveau
    CleUnivers univers
    Reglages reglages
    Date creeLe
    Rattachement[] rattachements (1 ou 2)
    creer(id, parent, prenom, niveau, univers, reglages, maintenant)
    modifier(par, prenom, niveau, univers)
    estRattacheA(ParentId) booleen
  }
  class Rattachement {
    <<entité>>
    ParentId parent
    Date rattacheLe
  }
  class ProfilEnfantId {
    <<value object>>
  }
  class Prenom {
    <<value object>>
    de(brut) Prenom
  }
  class Niveau {
    <<value object>>
    CP | CE1 | CE2 | CM1 | CM2
  }
  class Reglages {
    <<value object, story 12>>
  }
  ProfilEnfant --> ProfilEnfantId
  ProfilEnfant --> Prenom
  ProfilEnfant --> Niveau
  ProfilEnfant --> Reglages
  ProfilEnfant "1" *-- "1..2" Rattachement
  Rattachement --> ParentId
```

### Agrégat `ProfilEnfant`

- **Racine** : `ProfilEnfant`, identifié par `ProfilEnfantId` (fourni par un port `GenerateurId`, jamais tiré dans le domaine).
- **Contient** : prénom, niveau, clé de l'univers, réglages (#12), date de création, et ses **rattachements** (un ou deux `ParentId`).
- **Pourquoi les rattachements sont dans l'agrégat** : deux invariants l'exigent. Un profil n'existe jamais sans parent (il est créé avec son premier rattachement, dans la même transaction) ; il n'a jamais plus de deux parents (vérifié au rattachement du second, #13). Hors de l'agrégat, ces deux règles demanderaient de modifier deux agrégats à la fois. L'agrégat reste petit : au plus deux rattachements.
- Le `Parent` (story #5) reste un agrégat à part, référencé par `ParentId`. Il ne contient pas la liste de ses enfants : « les enfants d'un parent » est une **lecture** (read model `ProfilsDuParent`), pas un état du parent.
- Le profil ne connaît ni la progression (Apprentissage), ni les badges (Motivation), ni les devoirs (Accompagnement) : ces contextes le référencent par `ProfilEnfantId`.

### Value objects

| Value object | Règle de validité |
|---|---|
| `ProfilEnfantId` | Identifiant opaque, non vide. |
| `Prenom` | Espaces au début et à la fin retirés. Vide après cela → `PrenomObligatoire`, présentée « Écris le prénom de l'enfant. » (décision n°6 du lot 2, texte proposé par le modèle). Plus de 20 caractères → **coupé à 20** (décision n°6). Deux profils peuvent avoir le même prénom (décision n°6). Caractères permis (chiffres, émojis…) : question ouverte n°1. |
| `Niveau` | Value object publié par le Catalogue pédagogique (décision 0009, n°5). Exactement `CP`, `CE1`, `CE2`, `CM1` ou `CM2`. Sinon `NiveauInconnu`. Valeur par défaut du formulaire : `CP` (legacy). Changer de niveau garde toute la progression (décision n°7). |
| `CleUnivers` | Type publié par Motivation (#6, décision 0009, n°5). Une clé hors des 6 univers est refusée à la création (`UniversInconnu`) ; défaut `animaux`. |
| `Reglages` | Story #12. À la création sans réglage choisi : valeurs par défaut de #12. |

### Commandes (cas d'usage)

| Commande | Effet | Erreurs métier | Où |
|---|---|---|---|
| `CreerProfilEnfant(parent, prenom, niveau, univers, reglages)` | Crée le profil et rattache d'office le parent qui le crée, en une seule transaction (décision 0009, n°2). Pas de nombre maximal de profils (décision n°6). | `PrenomObligatoire`, `NiveauInconnu`, `UniversInconnu` | Edge Function `creer-profil-enfant` (décision 0009, n°1) |
| `ModifierProfilEnfant(parent, profil, prenom, niveau, univers)` | Change prénom, niveau ou univers. Les deux parents rattachés le peuvent (décision n°1). | mêmes erreurs, + `ParentNonRattache` | Edge Function `modifier-profil-enfant` (décision 0009, n°1) |
| `ChoisirQuiJoue(profil)` | Le profil devient le **profil en cours** sur l'appareil ; le personnage guide de son univers dit « Bonjour <prénom> ! », à chaque choix, même sans « tout lire à voix haute » (proposition appliquée). Le profil en cours n'est **pas mémorisé** d'une ouverture à l'autre (décision n°7). | (aucune) | navigateur (`domain/`) |
| Lecture `ProfilsDuParent(parent)` | Profils auxquels le parent est rattaché, dans l'ordre de création. | (aucune) | front, lecture sous RLS, gardée sur l'appareil pour le hors ligne |

### Erreurs métier

`PrenomObligatoire`, `NiveauInconnu`, `UniversInconnu`, `ParentNonRattache` (le parent n'est pas rattaché au profil visé : présentée comme un profil introuvable, sans dire s'il existe), `ProfilEnfantIntrouvable`.

## Invariants

1. Un profil enfant a **toujours un ou deux parents** rattachés. À sa création, le parent qui le crée y est rattaché d'office.
2. Un parent ne voit et ne modifie **que** les profils auxquels il est rattaché. Vérifié deux fois : dans le domaine (`estRattacheA`, erreur `ParentNonRattache`) et par la RLS (protection d'accès, qui ne remplace pas le domaine).
3. Un profil a un prénom non vide d'au plus 20 caractères (un prénom plus long est coupé), un niveau parmi les 5 et un univers parmi les 6.
4. RGPD : le profil ne contient que prénom (ou pseudo), niveau, univers, réglages et date de création. Jamais d'e-mail, de mot de passe ni de date de naissance.
5. « Qui joue ? » montre les profils du parent connecté dans l'ordre de création, sur tous ses appareils.
6. Choisir qui joue ne demande pas le contrôle parental ; créer et modifier un profil le demandent, parce qu'ils se font dans l'espace parent (décision n°5). Le premier profil se crée dans l'espace parent, où le parent arrive juste après sa connexion, sans question du contrôle parental (décisions n°4 et n°5).
7. Changer le niveau d'un profil ne retire rien de sa progression (décision n°7).

## Événements

| Événement | Données | Qui réagit |
|---|---|---|
| `ProfilEnfantCree` (à valider) | profil, parent, niveau, univers | Front : proposer le test de départ (lot 4). Aucun contexte serveur pour l'instant. |
| `NiveauDuProfilChange` (à valider) | profil, ancien niveau, nouveau niveau | Apprentissage (parcours, leçons des classes d'avant) au lot 4 : la progression est gardée (décision n°7). |

## Partage avec le front

- Dans le navigateur (`@domain/famille`) : `Prenom`, `Niveau`, `ProfilEnfant` (règles de validité pour un retour immédiat dans le formulaire), `ChoisirQuiJoue` et l'interface de son port `ProfilEnCoursSurLAppareil` (déclarée dans `domain/`, décision 0007), comme `DonneesDeLAppareil` en #5.
- Par une Edge Function (`famille/application/`) : **toute écriture** de Famille (décision 0009, n°1). La **création** écrit le profil et son premier rattachement dans une seule transaction (décision 0009, n°2) ; la **modification** est revalidée par le serveur (source de vérité). Les deux avec le JWT du parent, pour que la RLS s'applique. Le front ne fait que des lectures directes, sous RLS.
- La liste « Qui joue ? » est lue sous RLS et gardée sur l'appareil (IndexedDB), pour jouer hors ligne. Elle est effacée à la déconnexion (`DonneesDeLAppareil`, #5).

## Base de données attendue (description, pas de SQL)

| Table | Contenu | Policies RLS |
|---|---|---|
| `profils_enfants` | identifiant, prénom, niveau, clé de l'univers, réglages (#12), date de création | **lecture** et **modification** : seulement si un rattachement relie le profil au parent connecté (`auth.uid()`). **Création** : un parent connecté, dans la même transaction que son rattachement (décision 0009, n°2). **Suppression** : story #14. |
| `rattachements` | profil enfant, parent, date du rattachement ; un couple (profil, parent) unique | **lecture** : les rattachements du parent connecté, et ceux des profils auxquels il est rattaché, sans jamais l'adresse e-mail de l'autre parent (décision n°3). **Création** : le premier, dans la même transaction que le profil (décision 0009, n°2) ; le second, par la fonction Postgres d'acceptation d'une invitation (#13, décision 0009, n°3). **Suppression** : avec le profil, en cascade (#14). Aucun retrait d'un parent dans ce lot (décision n°1). |

Une fonction d'aide « le parent connecté est-il rattaché à ce profil ? » sert à toutes les tables des autres contextes qui portent un identifiant de profil enfant (progression, devoirs…), pour que chaque story suivante écrive la même policy.

## Données d'enfants

- Nouvelles données : **prénom ou pseudo**, **niveau**, clé de l'univers, date de création. Conformes à la section RGPD de `CLAUDE.md`.
- Hébergées dans l'UE (Supabase en Irlande, `eu-west-1`). À inclure dans l'export et la suppression (#14).
- Gardées sur l'appareil pour le hors ligne, effacées à la déconnexion.

## Emplacement

```
supabase/functions/_shared/famille/
  domain/
    profil-enfant-id.ts
    prenom.ts                        # Niveau et CleUnivers sont importés (décision 0009, n°5)
    profil-enfant.ts                 # agrégat, avec l'entité Rattachement
    rattachement.ts
    choisir-qui-joue.ts              # cas d'usage navigateur (décision 0008)
    profil-en-cours-sur-l-appareil.ts# interface du port (décision 0007)
    generateur-id.ts                 # interface du port, si le front en a besoin ; sinon dans application/
    erreurs.ts                       # + PrenomObligatoire, PrenomTropLong, NiveauInconnu, UniversInconnu, ParentNonRattache, ProfilEnfantIntrouvable
    index.ts
  application/
    ports/profils-enfants.ts         # repository (parId, duParent, enregistrer)
    creer-profil-enfant.ts
    modifier-profil-enfant.ts
  infrastructure/
    profils-enfants-supabase.ts      # mapper profils_enfants + rattachements → ProfilEnfant
  test_utils/
    profils-enfants-en-memoire.ts
    generateur-id-fixe.ts
supabase/functions/_shared/catalogue/
  domain/
    niveau.ts                        # value object publié par le Catalogue (décision 0009, n°5)
    index.ts                         # exports pour @domain/catalogue
supabase/functions/creer-profil-enfant/index.ts
supabase/functions/modifier-profil-enfant/index.ts
supabase/migrations/<date>_profils_enfants_et_rattachements.sql
src/famille/                         # « Qui joue ? », formulaire du profil, onglet Profils
```

## Décisions

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`, décision 0009). « Tranchée » = réponse explicite du PO ; « proposition appliquée » = question de détail qui suit la proposition déjà faite.

Numéros d'origine : « M » = ancienne liste du modèle, « A » = `docs/stories/11/acceptance.md`, « T » = questions techniques.

| Question | Réponse | Source |
|---|---|---|
| M1. Nombre maximal de profils | **Aucun**. | Tranchée, décision n°6 |
| M2. Même prénom pour deux profils | **Permis**. | Tranchée, décision n°6 |
| M3. Prénom de plus de 20 caractères | **Coupé** à 20 caractères. `PrenomTropLong` disparaît. | Tranchée, décision n°6 |
| M4. Premier profil, « + Ajouter un enfant » | Le premier profil se crée **dans l'espace parent**, juste après la connexion. « + Ajouter un enfant » demande le contrôle parental. Choisir qui joue reste libre. | Tranchée, décision n°5 |
| M5. Changer de classe | La progression est **gardée**. | Tranchée, décision n°7 |
| M7. Prénom vide | **Refusé avec un message** (écart voulu avec le legacy). | Tranchée, décision n°6 |
| A4 (en partie). Texte du prénom obligatoire | « Écris le prénom de l'enfant. » | Proposition appliquée (modèle, ancienne M7) |
| M8. Profil en cours mémorisé ? | **Non** : « Qui joue ? » s'affiche à chaque ouverture. | Tranchée, décision n°7 |
| M10. « Bonjour <prénom> ! » à chaque choix | **Oui**, même sans « tout lire à voix haute », comme le legacy. | Proposition appliquée (`acceptance.md`) |
| Droits des deux parents (#13 M1) | Les deux parents rattachés modifient le profil. | Tranchée, décision n°1 |
| T1. `CleUnivers` et `Niveau` | Value objects publiés par Motivation et par le Catalogue pédagogique, importés par Famille. | Tranchée, décision 0009, n°5 |
| T2. Chemin des écritures | **Toutes** les écritures de Famille passent par une Edge Function, avec le JWT de l'appelant ; création du profil et de son premier rattachement en **une seule transaction**. | Tranchée, décision 0009, n°1 et n°2 |

## Questions ouvertes

Aucune n'est bloquante pour la story.

1. (ancienne M6) Quels **caractères** sont permis dans un prénom ou pseudo : lettres, accents, trait d'union, apostrophe, espaces (oui) ; chiffres, émojis (oui / non) ?
2. (ancienne M9) « **Qui joue ?** » : est-ce un terme du glossaire (oui) ou un simple titre d'écran (non) ? Le titre exact reste « Qui joue aujourd'hui ? » (oui / non) ?
3. (ancienne M11) Au lot 2, créer ou modifier un profil passe par une Edge Function (décision 0009) et demande donc le réseau. Faut-il, au **lot 7**, pouvoir le faire hors ligne et l'envoyer à la synchronisation (oui / non) ? Choisir qui joue fonctionne hors ligne dans tous les cas.
4. (ancienne M12) Le message « Les profils et la progression sont enregistrés dans ton compte… » de « Qui joue ? » : même question que la n°8 de la story #5, à trancher une seule fois.
5. (ancienne A1) **Où arrive l'enfant après avoir choisi son profil ?** « Carte » est un synonyme interdit de **parcours**. L'écran d'arrivée est-il l'accueil « Aujourd'hui » du lot 4 (oui), comme la question n°5 de la story #6 ?
6. (ancienne A2) **Après la création d'un profil**, en attendant le test de départ du lot 4, le parent reste-t-il dans l'espace parent (oui), ou l'application passe-t-elle directement à « Qui joue ? » (non) ?
7. (ancienne A3) Si Paul change l'univers de Léa sur le téléphone pendant qu'elle joue sur la tablette, le changement s'applique-t-il **tout de suite** (oui) ou au prochain choix dans « Qui joue ? » (non) ? Pour les réglages, la proposition retenue est « au prochain choix » (#12).
8. (ancienne A4, suite) Texte exact du **profil enfant introuvable** vu par le parent (par exemple : « Ce profil enfant est introuvable. ») ?
