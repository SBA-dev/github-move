# Modèle du domaine : issue #15, Choisir la voix des personnages guides sur l'appareil

## Contexte

Sous-domaine générique **Voix** (décision 0007), qui complète la story #7. Le modèle de référence est la section « Hors périmètre : voix imposée, lot 2 » de `docs/stories/7/domain-model.md` ; il est repris ici et précisé à la lecture de `adultVoix` (l. 2253) et `voiceFor` (l. 221).

Le choix est **mémorisé sur l'appareil** (décision n°10 du lot 1) : ce n'est ni une donnée du profil enfant ni une donnée du parent. Il vaut pour tous les profils qui jouent sur l'appareil et ne change pas les autres appareils. Tout se passe **dans le navigateur**, hors ligne compris.

Relations :
- **Famille → Voix** : aucune dépendance de code. L'écran est dans l'espace parent (protégé par le contrôle parental, #10), mais Voix ne connaît ni Famille ni le contrôle parental.
- **Motivation → Voix** (existante) : le caractère de la voix du personnage guide reste appliqué à la voix imposée.
- **Synthèse vocale du navigateur → Voix** (existante, ACL) : port `VoixDeLAppareil`.

### Comportement actuel (`app/`)

- Onglet « Voix » de l'espace : titre « La voix des guides », texte d'explication (« … chaque guide lui donne son caractère … Tu peux aussi imposer une voix. »).
- Liste à choix unique : « Automatique (recommandé) » avec la mention « actuellement : <nom de la meilleure voix française> », puis chaque voix française de l'appareil, de la plus naturelle à la moins naturelle, avec « · très naturelle » (score ≥ 60) ou, pour la première si elle ne l'est pas, « · la meilleure ici ».
- Choisir une ligne enregistre aussitôt (pas de bouton « Enregistrer ») ; « Automatique » efface le choix. Clé de l'appareil `ecole-voix` = nom de la voix.
- Bouton « Écouter » sur chaque ligne : « Coucou ! Je suis <personnage guide>. On apprend en s'amusant ? Youpi ! ». Comme l'espace parent désélectionne le profil en cours, le personnage guide est **toujours Noisette** dans le legacy.
- Sans voix française : « Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page. » ; navigateur sans synthèse : « Ce navigateur ne sait pas lire à voix haute. »
- Conseils « Pour des voix plus naturelles » : iPad / iPhone, tablette Android, ordinateur (Edge, Chrome).
- Dans la lecture (`voiceFor`) : la voix imposée passe en premier **si elle existe encore sur l'appareil** ; sinon voix automatique. Le **caractère** du personnage guide (hauteur, rythme, −0,25 si personnage masculin et voix non reconnue comme masculine) s'applique aussi à la voix imposée.
- La voix imposée **ne sert pas aux langues étrangères** (anglais) : elles gardent `choisirVoixDeLangue`.
- Une seule voix imposée pour tous les personnages guides.

## Termes

| Terme | Statut | Remarque |
|---|---|---|
| Voix imposée | au glossaire (à valider) | Confirmée par l'issue ; « Arrive au lot 2 » devient vrai avec cette story. |
| Voix automatique | au glossaire (à valider) | |
| Choix de voix (à valider) | **nouveau** | Préférence de l'appareil : voix automatique ou une voix imposée. |
| Voix très naturelle (à valider) | **nouveau** | Voix française de score au moins 60 (mention de l'interface). |
| Essai de voix (à valider) | **nouveau** ou terme d'interface | Phrase lue pour écouter une voix avant de la choisir. Le bouton dit « Écouter ». |
| La voix des guides | **synonyme interdit** | Titre du legacy : « guide » seul est interdit (décision n°1 du glossaire). Le titre devient « La voix des personnages guides » (proposition appliquée, validation n°1 du lot 2). |
| Voix préférée, voix forcée | synonymes interdits | Déjà au glossaire. |

## Modèle

```mermaid
classDiagram
  class ChoixDeVoix {
    <<value object>>
    automatique | imposee(nomDeLaVoix)
    voixAUtiliser(voixDisponibles, caractere) VoixDisponible ou rien
  }
  class VoixDisponible {
    <<value object, story 7>>
    nom
    langue
    estTresNaturelle() booleen
  }
  class ChoixDeVoixDeLAppareil {
    <<port>>
    lire() ChoixDeVoix
    memoriser(ChoixDeVoix)
  }
  class LectureAVoixHaute {
    <<service du domaine, story 7>>
    lire(texte, caractere)
    essayer(voix, caractere, nomDuPersonnageGuide)
  }
  ChoixDeVoix ..> VoixDisponible
  LectureAVoixHaute ..> ChoixDeVoixDeLAppareil
```

Pas d'agrégat : rien n'est enregistré sur le serveur.

### Value objects et fonctions

| Élément | Règle |
|---|---|
| `ChoixDeVoix` | `automatique` (défaut, aussi quand rien n'est mémorisé) ou `imposee(nom)`. Un nom vide vaut `automatique`. |
| `choisirVoix(voix, caractere, choix)` | Si `choix` est une voix imposée **présente** parmi les voix de l'appareil, c'est elle ; sinon la voix automatique de #7. Égalité des noms : exacte, comme aujourd'hui (règle du legacy, sans question au PO). |
| `voixMontreeCommeChoisie(voix, choix)` | Ce que l'onglet « Voix » montre comme choisi : la voix imposée si elle est présente, sinon « Automatique (recommandé) ». Le choix mémorisé, lui, **n'est pas effacé** : si la voix imposée revient sur l'appareil, elle lit de nouveau (décision n°11 du lot 2). |
| `estTresNaturelle(voix)` | Score de la voix (#7) d'au moins 60. |
| `voixProposees(voix)` | Les voix françaises, triées par score (`voixFrancaisesTriees`, #7). |
| Caractère | Le caractère du personnage guide (hauteur, rythme, voix plus grave) s'applique aussi à la voix imposée (`reglerPhrases`, #7 ; décision n°11). |
| Langue étrangère | `choisirVoixDeLangue` ignore le choix de voix : l'anglais garde sa voix anglaise (décision n°11). |
| `PhraseDEssai` | « Coucou ! Je suis <nom du personnage guide>. On apprend en s'amusant ? Youpi ! » (texte du legacy, décision n°3 du lot 1). Personnage guide : celui du **profil en cours**, ou **Noisette** s'il n'y en a pas (décision n°11 du lot 2 ; voir la question ouverte n°5 de #10). |

### Port

`ChoixDeVoixDeLAppareil` : lire et mémoriser le choix de voix sur l'appareil. Interface déclarée dans `voix/domain/` (décision 0007), adaptateur `localStorage` dans `src/voix/`, à côté de Son/Muet. À la déconnexion du parent (#5), le choix **reste** sur l'appareil (décision n°11) : `DonneesDeLAppareil` ne l'efface pas.

### Commandes (navigateur)

| Commande | Effet |
|---|---|
| `ImposerUneVoix(nom)` | Mémorise la voix imposée sur l'appareil ; les lectures suivantes l'utilisent. |
| `RevenirALaVoixAutomatique` | Efface le choix. |
| `EssayerUneVoix(nom ou automatique)` | Lit la phrase d'essai avec cette voix et le **caractère** du personnage guide (décision n°11), **sans** changer le choix mémorisé. En Muet, rien n'est lu, comme aujourd'hui (proposition appliquée). |

Aucune erreur métier nouvelle : sans voix française, `voixProposees` est vide et l'interface affiche le message ; sans synthèse, `LectureImpossible` (#7).

## Invariants

1. La voix imposée, si elle existe encore sur l'appareil, passe avant la voix automatique ; sinon la voix automatique s'applique, sans message pour l'enfant ni pour le parent : l'onglet « Voix » montre « Automatique (recommandé) » comme choisi, et le choix reste mémorisé (décision n°11).
2. Seules les voix françaises de l'appareil sont proposées.
3. Le choix est mémorisé **sur l'appareil**, pour tous les profils qui y jouent ; il ne change pas les autres appareils, n'est jamais envoyé au serveur et reste après la déconnexion du parent (décision n°11).
4. Le caractère du personnage guide s'applique toujours, voix imposée comprise (hauteur dans [0,5 ; 2], rythme au plus 1,4).
5. Le choix de voix n'est accessible que dans l'espace parent ; le bouton Son/Muet reste à la portée de l'enfant.
6. Écouter une voix ne change pas le choix mémorisé.
7. La voix imposée ne sert qu'au français : une consigne en anglais garde la voix anglaise (décision n°11).

## Événements

Aucun.

## Partage avec le front

Tout est dans le navigateur : `ChoixDeVoix`, `choisirVoix` à trois paramètres, `voixMontreeCommeChoisie`, `estTresNaturelle`, l'interface `ChoixDeVoixDeLAppareil` et la phrase d'essai sont exportés par `@domain/voix`. `LectureAVoixHaute` (#7) lit le choix par ce port. L'onglet « Voix » de l'espace parent et les conseils d'installation sont de l'interface (`src/`).

## Données d'enfants

Aucune. Le choix de voix est une préférence de l'appareil.

## Emplacement

```
supabase/functions/_shared/voix/
  domain/
    choix-de-voix.ts                    # + ChoixDeVoix, choisirVoix(voix, caractere, choix)
    voix-disponible.ts                  # + estTresNaturelle
    choix-de-voix-de-l-appareil.ts      # interface du port (décision 0007)
    phrase-d-essai.ts                   # phrase « Coucou ! Je suis … »
    lecture-a-voix-haute.ts             # + lecture du choix, essai d'une voix
    index.ts
  test_utils/
    choix-de-voix-en-memoire.ts
src/voix/                               # adaptateur localStorage du choix, onglet « Voix » de l'espace parent
```

## Décisions

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`). « Tranchée » = réponse explicite du PO ; « proposition appliquée » = question de détail qui suit la proposition déjà faite.

Numéros d'origine : « M » = ancienne liste du modèle, « A » = `docs/stories/15/acceptance.md`.

Correction : l'ancienne ligne `choisirVoix` renvoyait à la « question ouverte n°6 » pour l'égalité exacte des noms de voix, alors que cette question portait sur la mention « actuellement : … ». L'égalité exacte est la règle du legacy, sans question au PO ; le renvoi est retiré.

| Question | Réponse | Source |
|---|---|---|
| M1. Conseils d'installation | Repris **tels quels** (iPad / iPhone, Android, ordinateur). | Proposition appliquée (scénario `@a-valider`) |
| M2. Personnage guide de l'essai de voix | Celui du **profil en cours**, ou **Noisette** s'il n'y en a pas. Le scénario « c'est Noisette qui se présente, quel que soit l'univers » est à revoir par `po-acceptance` selon la réponse à la question n°5 de #10. | Tranchée, décision n°11 |
| M4 / A1. Voix imposée disparue : ce que voit le parent | Pas de message : « Automatique (recommandé) » apparaît **choisi**. | Tranchée, décision n°11 (absence de message : proposition appliquée) |
| A2. Voix imposée réinstallée | Le choix est **gardé en mémoire** : la voix revenue lit de nouveau les consignes. | Tranchée, décision n°11 |
| M5. Déconnexion du parent | Le choix de voix **reste** sur l'appareil. | Tranchée, décision n°11 |
| M7. Essai de voix en Muet | **Rien n'est lu**, comme aujourd'hui. | Proposition appliquée (scénario `@a-valider`) |
| M8. Titre | « **La voix des personnages guides** ». | Proposition appliquée (modèle, scénario `@a-valider`) |
| M9. Leçons d'anglais | **Non** : l'anglais garde sa voix anglaise. | Tranchée, décision n°11 |
| A3. Texte d'explication | Repris du legacy en remplaçant seulement « guide » par « personnage guide » (règle des textes repris mot pour mot, décision n°3 du lot 1). Le tutoiement du legacy est gardé. | Proposition appliquée (`acceptance.md`) |
| A4. Essai avec le caractère du personnage guide | **Oui**, la voix imposée garde le caractère du personnage guide, essai compris. | Tranchée, décision n°11 |

## Questions ouvertes

Aucune n'est bloquante pour la story.

1. (ancienne M3) Faut-il pouvoir **imposer une voix différente par personnage guide** (oui / non) ? Aujourd'hui, une seule voix pour tous ; les scénarios supposent ce comportement.
2. (ancienne M6) La mention « actuellement : <voix> » de « Automatique » montre aujourd'hui la **meilleure voix**, pas celle que prendra le personnage guide de l'essai (qui peut être une voix masculine pour Coach Léo). Montrer la voix réellement prise pour ce personnage guide (oui), ou garder la meilleure voix (non) ?
