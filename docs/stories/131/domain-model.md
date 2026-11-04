# Modèle du domaine : issue #131, boîte à jetons et schéma en barres (98c-boîte et barres)

Historique : 2026-11-03 08:00 UTC, cadrage validé par le PO (« 131 reco tout », annonces [Responsable] 6598437358 sur #64 et 6598436875 sur #131).

État : **cadrage validé** (questions #131.1 à #131.11 tranchées le 2026-11-03 : reco retenue partout).

Tranche **98c-boîte et barres** de #98 (épopée #95), issue de la coupe de #127 (98.30). Dépend de #98 (98a) et de #127 (98c-addition), toutes deux mergées.

Ce modèle est **court**. Il s'appuie sur le cadrage complet de #98 (`docs/stories/98/domain-model.md`) et ne le recopie pas : lignes `boite` et `barres` du tableau des types, pistes d'objets 98c (lignes `Boîte à jetons`, `Jetons`, `Jauge du schéma en barres`), invariant 6, règle « dessin par univers », découpage 98c. Les numéros « inv. 98-n » renvoient aux invariants 1 à 20 de ce cadrage, les numéros « 98.n » à ses questions tranchées.

Décisions du PO déjà prises, appliquées ici sans les reposer : habillage par univers (98.2) ; la boîte n'est jamais un coffre, ni rien qui ressemble à une valise d'argent (98.6) ; planche validée univers par univers (98.28) ; 6 captures avec la PR (98.29) ; la PR attend les 6 dessins validés (98.31) ; Muet coupe seulement la voix (97.2) ; un toucher pendant une célébration ne fait rien (97.17) ; mêmes erreurs, avancement et étoiles ; même habillage partout où le type est joué ; 360 px, mode dys, lecteurs d'écran inchangés ; règle absolue de contenu, univers par univers.

## Contexte

**Apprentissage, affichage seulement.** La story ne change que la façon de montrer la boîte à jetons et le schéma en barres. Elle n'ajoute ni contexte, ni agrégat, ni value object, ni commande, ni événement de domaine, ni erreur métier, ni migration, ni Edge Function, ni donnée d'enfant. La context map ne change pas.

- **Apprentissage** reste la source de chaque fait montré : phrases du déroulé, boîte ouverte et son nombre de jetons, forme du schéma, valeur cherchée, schéma résolu. Aucune règle de correction ne change : `QuestionDeBoite` et `QuestionDeProblemeEnBarres` se jouent comme un calcul (`QuestionEnveloppantUnCalcul`), et ne gagnent aucun état.
- **Catalogue pédagogique** fournit l'item de la boîte (`ItemDeBoite` : `a`, `sens`, `b`, `reponse`) et la forme du schéma (`FormeDeSchema`). Rien ne change.
- **Motivation** fournit la clé d'univers (`CleUnivers` : `animaux`, `princesse`, `sports`, `police`, `pompier`, `danse`), lue par `useUnivers()` (`src/univers/ContexteDeLUnivers.ts`). Le fournisseur est posé dans `src/Application.tsx` autour de la séance **et** de la séance de révision : rien à câbler de plus.
- **Voix** ne change pas : « Je mets 4 jetons dans la boîte. », « On ouvre la boîte pour vérifier… », « Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche. » restent les mêmes (inv. 98-14).

### Les faits du domaine suffisent : vérification

| Ce que #131 montre | Fait nécessaire | Où il est | Existe ? |
|---|---|---|---|
| Les premiers jetons tombent (« Je mets 4 jetons… ») | Première phrase dite, nombre `a` | `phrasesDites` (`useQuestionIllustree.ts`, `useDeroulementDeRevision.ts`) ; `ItemDeBoite.a` (`supabase/functions/_shared/catalogue/domain/exercices/boite.ts`) ; phrases de `deroulementDeLaBoite` (`supabase/functions/_shared/apprentissage/domain/exercices/boite.ts`). Aujourd'hui ces jetons apparaissent **sans** mouvement (`JetonsDuDeroule`, cas `phrasesDites === 1`) | **Oui** |
| Les jetons ajoutés tombent (`nouveau`) | Deuxième phrase dite, `sens === "ajout"`, nombre `b` | Mêmes sources ; `RangeesDeJetons nouveaux` pose `data-etat="nouveau"` | **Oui** |
| Les jetons retirés s'en vont (`sortant`) | Deuxième phrase dite, `sens === "retrait"`, nombre `b` | `RangeesDeJetons sortants={b}` pose `data-etat="sortant"` sur les `b` derniers | **Oui** |
| Boîte fermée, puis ouverte | Dernière phrase dite ; bonne réponse | `phrasesDites >= boite.deroulement.length` (`BoiteEnCours.deroulement`, `question-de-boite.ts`) ; `BoiteOuverte` (`QuestionDeBoite.ouverte()`), lue par `seance.boiteApresLaDerniereReponse()` en séance et par `setBoiteOuverte` en révision | **Oui** |
| Nombre de jetons dans la boîte ouverte | Réponse de l'item | `BoiteOuverte.jetons` | **Oui** |
| Les barres connues se remplissent jusqu'à leur valeur | Valeur et taille de chaque morceau | `FormeDeSchema` (`SchemaEnCours.forme`, `question-de-probleme-en-barres.ts`) ; tailles calculées par `dessinerLeSchema` (`src/seance/exercices/schema/dessin-du-schema.ts`) | **Oui** |
| Moment du remplissage (#131.8) | Explication du schéma commencée | `phrasesDites` (énoncé, puis `explicationDuSchema`) | **Oui** |
| La barre de la valeur cherchée garde son « ? » | Valeur `null` dans la forme ; schéma pas encore résolu | `Morceau.valeur === null` et `data-cherchee="true"` (`SchemaEnBarres.tsx`) ; `resolu === undefined` | **Oui** |
| La barre « ? » se remplit à la bonne réponse | `SchemaResolu` (réponse) | `QuestionDeProblemeEnBarres.resolu()`, lu par `seance.schemaApresLaDerniereReponse()` (séance) et `setSchemaResolu` (révision) ; **seulement après une réponse juste** | **Oui** |
| Rien ne se remplit après « Je ne sais pas » | « Je ne sais pas » ne résout pas | `jeNeSaisPas` (`useQuestionIllustree.ts`) montre la bonne réponse dans les choix ou le clavier, sans `BoiteOuverte` ni `SchemaResolu` | **Oui** |
| Mouvements réduits | Préférence de l'appareil | `useReducedMotion()` (`BoiteAJetons.tsx`, `data-mouvements-reduits`) et `@media (prefers-reduced-motion: reduce)` (`src/styles.css`) | **Oui** |
| Rien à habiller au test de départ | La boîte et les barres n'y sont jamais posées | `nombreDeQuestionsAdmissibles` renvoie 0 pour `boite` et `barres` (`supabase/functions/_shared/apprentissage/domain/plan-du-test-de-depart.ts`) ; `question-du-test-de-depart.ts` ne les connaît pas | **Oui** |
| Même habillage en séance de révision | La révision joue les mêmes composants | `question-de-revision.ts` (cas `boite`, `barres`) ; `src/revision/DeroulementDeLaRevision.tsx` affiche `BoiteAJetons` et `SchemaDuProbleme` | **Oui** |

**Aucun fait ne manque.**

### Point critique : la taille de la barre « ? » (inv. 98-6)

`dessinerLeSchema` donne **déjà** à la barre de la valeur cherchée une taille proportionnelle à la réponse, dans presque toutes les formes :

| Forme, valeur cherchée | Taille de la barre « ? » aujourd'hui | Proportionnelle à la réponse ? |
|---|---|---|
| Parties et tout, une partie | `reste` de la ligne des parties, sous un tout connu | **Oui** (tout − partie connue) |
| Parties et tout, le tout | toute la ligne, parties en `poids` | **Oui** (somme des parties) |
| Comparaison, le petit | `reste` à côté de l'écart en `proportion` | **Oui** |
| Comparaison, l'écart | `reste` à côté du petit en `proportion` | **Oui** |
| Comparaison, le grand | toute la ligne, petit et écart en `poids` | **Oui** |
| Parts, le total | toute la ligne | **Oui** |
| Parts, la valeur d'une part | parts égales en `poids(1)` sous le total | **Oui** |
| Parts, le nombre de parts | 2 parts, puis « … » | **Non** : le nombre est caché jusqu'à la réponse |

C'est le principe du schéma en barres du guide fondamental (barres proportionnelles, scénario de #21 « les barres du schéma restent proportionnelles aux nombres 37 et 43 ») : sans échelle, la taille ne se **lit** pas comme un nombre. Mais c'est un **risque de sens** pour la jauge : tout ce qui transforme la longueur en quantité comptable (graduations, anneaux d'un tuyau, feuilles d'une tige, rayures, perles d'un ruban, à intervalle régulier) ferait compter la réponse sur la barre « ? », ou la déduire des barres voisines. D'où l'invariant propre 2 et la question #131.10.

## Ce que la boîte et les barres montrent aujourd'hui, et ce que #131 ajoute

| | Aujourd'hui (`BoiteAJetons.tsx`, `RangeesDeJetons.tsx`, `SchemaEnBarres.tsx`, `styles.css`) | Avec #131 |
|---|---|---|
| Boîte | Caisse en bois dessinée en CSS (`.boite`, `--bois`), couvercle en `::before` qui pivote de −35° (0,5 s) ; fermée : contenu `visibility: hidden` | **Boîte de l'univers** (#131.1), fermée puis ouverte. Même place, même largeur `min(100%, 18rem)`, mêmes libellés lus (« Boîte fermée », « Boîte ouverte : 7 jetons ») |
| Jeton | Disque doré de 28 px (`--or`, contour `--or-contour`) : **il ressemble à une pièce de monnaie** ; le cinquième de chaque rangée en orange (`--jeton-cinquieme`) | **Jeton de l'univers** (#131.1, #131.2), mat, jamais doré ni métallique. Même taille, rangé par 5, cinquième marqué (#131.3) |
| Jetons de la première phrase | Apparaissent sans mouvement | **Tombent** dans la boîte avec un petit rebond (#131.5) |
| Jetons ajoutés (`nouveau`) | Glissent de 40 px vers le bas en 0,6 s (`jeton-entre`) | **Tombent** avec un petit rebond, en 400 ms au plus (#131.4) |
| Jetons retirés (`sortant`) | Montent de 40 px et restent pâles (opacité 0,45, `jeton-sort`, 0,6 s) | **S'en vont en douceur**, en 400 ms au plus (#131.6) |
| Boîte ouverte après la bonne réponse | Couvercle qui se lève, jetons rangés par 5, sans mouvement des jetons | Couvercle de l'univers qui s'ouvre, jetons déjà là, sans chute (#131.7) |
| Barres connues | Morceaux plats à contour, fond `--surface` (parties) ou `--barre-du-tout` (tout, total, grand) ; aucun mouvement | **Se remplissent comme une jauge** de l'univers, de gauche à droite, jusqu'au bout de leur morceau (#131.8) ; la largeur du morceau ne change jamais |
| Barre de la valeur cherchée | Fond `--surbrillance-fond`, contour en pointillés, « ? » | **Reste vide** avec son « ? » et ses pointillés jusqu'à la bonne réponse (#131.9), puis se remplit après le rebond de #97 |
| Écart d'une comparaison, suite des parts | En pointillés, transparents | Inchangés : jamais remplis |
| Mouvements réduits | Règle globale `animation: none`, `transition: none` | Jetons posés, barres pleines tout de suite ; barre « ? » vide puis pleine d'un coup à la bonne réponse |
| Mode par choix | Bulles de choix (`ReponseAuCalcul`, `ChoixDeLaQuestion`) | **Hors périmètre** : #126 (bulle de l'univers, déjà validée, sert aussi la boîte et les barres, 98.4) |
| Mode clavier | Clavier de cristaux (`ClavierDeCristaux`) | **Hors périmètre** : #128 (qui l'habille aussi dans la boîte et les barres) |

Le helper `maisonSousLePoint` (`src/seance/exercices/maisons/groupe-sous-le-doigt.ts`) **ne sert pas** : ni les jetons ni les barres ne se glissent ou ne se touchent.

## Termes

| Terme | Statut |
|---|---|
| Boîte à jetons, Jeton, Schéma en barres, Problème en barres, Énoncé du problème, Valeur cherchée, Parties et tout, Comparaison, Parts, Écriture du calcul, Explication de la réponse, Mode de réponse, Je ne sais pas, Bonne réponse montrée, Univers, Personnage guide | Existants, réutilisés tels quels |
| Jauge, tomber, rebond, s'en aller, se remplir, boîte de l'univers, jeton de l'univers | **Mots d'interface** (comme « mouvements réduits ») et mots de cadrage de #98. Aucun n'entre dans le domaine |
| Boîte (seule) | Synonyme interdit de **Boîte à jetons** dans le domaine ; « boîte » reste le mot d'interface de l'écran (libellés lus actuels) |
| Jeton | **Trois sens dans le projet** : le **Jeton** du glossaire (objet compté), les « jetons » de design de #96 (`src/univers/jetons.ts`, variables CSS : sens technique) et le **Jeton d'invitation** (Famille). Dans le code de #131, « jeton » ne désigne que l'objet compté ; une variable de design reste un « jeton de design » |
| Barre | Partie d'un **Schéma en barres** (glossaire, sans ligne à part). La piste « Barre bleue » de Police (98) nomme une jauge par le mot du domaine : à remplacer (#131.1, « bande bleue ») |
| Étoile | **En conflit** : réservée à la récompense. Les jetons « Étoiles » de Police (piste 98) sont à éviter ; la bulle de Police (#126) porte déjà une étoile d'insigne sur le même écran en mode par choix |
| Ballon | **En conflit** : mot d'interface de la bulle de choix dans Sports (#126, « ballon blanc », validé). Des jetons « petits ballons » se confondraient avec les choix à toucher, affichés **sous la boîte** au CP (réponse de 20 au plus) |
| Noisette | **En conflit** : nom du personnage guide d'Animaux de la forêt. Des jetons « noisettes » rendraient ambiguës les phrases des scénarios (« Noisette dit… », « Léa voit 7 noisettes ») : à éviter |
| Coffre | **Interdit** (98.6), ainsi que valise, mallette, sac d'argent, caisse enregistreuse, et le cadeau à nœud (évoque une surprise ou une récompense) |

## Modèle

Aucun agrégat, aucun value object nouveau. Ce qui suit vit dans `src/` et ne décide de rien : il lit des faits existants.

| Ce que le front montre | Lu dans | Décide de quoi ? |
|---|---|---|
| Dessin de la boîte (fermée / ouverte) | `CleUnivers` + `phrasesDites` + `BoiteEnCours.deroulement` + `BoiteOuverte` | Rien : affichage |
| Jetons, leur chute ou leur sortie | `CleUnivers` + `ItemDeBoite` (`a`, `sens`, `b`) + `phrasesDites` ; `BoiteOuverte.jetons` | Rien : le nombre et la disposition restent ceux de `RangeesDeJetons` |
| Jauge de chaque barre | `CleUnivers` + `dessinerLeSchema(forme, resolu?.reponse)` (rôle, valeur, taille) + `phrasesDites` | Rien : la jauge remplit le morceau tel qu'il est dessiné |
| Barre « ? » vide, puis remplie | `Morceau.valeur === null` ; `SchemaResolu` | Rien : seul le domaine dit quand le problème est résolu |

## Invariants

### Invariants de #98 qui s'appliquent

inv. 98-1 (mêmes erreurs, avancement, étoiles, revalidation), 98-4 et 98-15 (bonne réponse montrée identique et unique dans les 6 univers), 98-5 (retours de #97 d'abord ; mouvement en 150 à 400 ms), **98-6** (l'habillage ne donne jamais la réponse), 98-7 et 98-17 (360 px, mise en page indépendante de l'univers), 98-9 (mouvements réduits), 98-10 (consigne au premier plan, mode dys, contraste 4,5:1), 98-11 (lecteurs d'écran inchangés), 98-12 (même habillage partout où le type est joué), 98-13 et 98-20 (règle absolue, univers par univers), 98-14 (changer d'univers ne change que le dessin), 98-16 (un dessin par univers, repli sur « animaux »), 98-18 (aucun chiffre ni texte dans un dessin).

### Invariants propres à #131

1. **La jauge ne donne jamais la réponse.** La barre de la valeur cherchée reste vide, avec son « ? » et son contour en pointillés, tant que le domaine n'a pas fourni `SchemaResolu`, c'est-à-dire jusqu'à la **bonne réponse** de l'enfant : ni après une erreur, ni après « Je ne sais pas », ni après « Réécouter », ni en Muet. Elle ne se remplit jamais à moitié, ni « presque », ni au rythme des autres. Précisé par la planche validée (P6, 2026-11-03 11:05 UTC) : le décor des bouts suit l'univers, en pointillés. Tout le reste est pareil dans les 6 univers : vide, contour en pointillés, « ? », largeur, aucune jauge.
2. **La jauge n'a pas d'échelle.** Le remplissage est uni (couleur ou matière continue) : aucune graduation, aucun cran, aucun anneau, aucune feuille, aucune rayure en travers, aucun motif répété à intervalle régulier le long de la barre. Un décor d'univers ne se pose qu'aux bouts, toujours le même quelle que soit la longueur. La largeur de chaque morceau reste celle de `dessinerLeSchema` : la jauge se remplit **dans** le morceau, sans jamais animer sa largeur (scénario de #21 sur les proportions 37 et 43).
3. **Les rôles des barres restent lisibles.** Le tout (ou le total, ou le grand) garde une teinte distincte des parties dans les 6 univers ; l'écart et la suite des parts restent en pointillés, jamais remplis ; le nombre écrit sur une barre reste du texte, à 4,5:1 sur la jauge, en mode dys.
4. **Tous les jetons d'une boîte sont identiques et comptables d'un coup d'œil.** Même dessin, même taille, même orientation ; seul le cinquième de chaque rangée porte la marque commune aux 6 univers (#131.3). Un jeton n'est ni doré, ni métallique, ni marqué d'un symbole de monnaie ; il ne ressemble ni à une étoile, ni à la bulle de choix de son univers (#126).
5. **Le nombre de jetons et leur disposition ne changent pas.** Ceux de l'item (`a`, puis `b`) pendant le déroulé, `BoiteOuverte.jetons` à l'ouverture ; rangées de 5, groupes séparés (le groupe ajouté ne complète pas la rangée du premier), mêmes attributs lus par les scénarios de #21 (`jetons`, `rangee-de-jetons`, `jeton`, `data-nombre`, `data-cinquieme`, `data-etat`).
6. **La boîte fermée ne laisse rien deviner.** Aucun jeton visible, aucune transparence, aucune bosse ni ombre qui dépendrait du nombre de jetons. La boîte n'est jamais un coffre, une valise, une mallette, un sac d'argent ni un cadeau (98.6).
7. **Le mouvement ne retarde rien.** Chute, sortie et remplissage tiennent en 400 ms au plus. Après une réponse juste, ils partent après le rebond de #97 et ne retardent ni l'effet sonore, ni la parole, ni l'écran suivant (#79). La présentation n'attend jamais la fin d'une chute pour dire la phrase suivante. En Muet ou sans voix, l'enfant voit les mêmes mouvements.
8. **Mouvements réduits : rien ne tombe, rien ne se remplit progressivement.** Les jetons sont posés à leur place, les sortants pâles à leur place, les barres connues pleines dès l'affichage ; la barre « ? » vide, puis pleine d'un coup à la bonne réponse ; le couvercle sans mouvement (scénario de #21 « la boîte s'ouvre sans animation »).
9. **Aucun son nouveau.** Ni chute, ni ouverture, ni remplissage ne fait de bruit (en particulier aucun tintement de pièce). Les sons restent ceux de #97.
10. **Ni les jetons ni les barres ne sont des cibles.** Un toucher dessus ne fait rien, comme aujourd'hui ; un toucher pendant une célébration ne fait rien (97.17). Seuls les choix (#126) et le clavier (#128) répondent.
11. **Seulement là où le type est joué** : séance et séance de révision, mêmes composants, même habillage. Le test de départ ne pose jamais de boîte ni de schéma : rien à y habiller.
12. **Lecteurs d'écran inchangés.** « Boîte fermée », « Boîte ouverte », « Boîte ouverte : 7 jetons » et la description du schéma (`description`, puis celle du schéma résolu) restent les seuls textes lus ; les dessins sont cachés aux lecteurs d'écran.
13. **360 px, une seule mise en page.** Boîte ouverte avec 20 jetons (4 rangées) et schéma de comparaison tiennent sans défilement horizontal à 360 px dans les 6 univers ; le dessin de la boîte ne repousse ni l'énoncé du problème, ni les choix, ni « Je ne sais pas ».

## Événements

Aucun événement de domaine nouveau. L'affichage réagit aux faits existants (phrases dites, boîte ouverte, schéma résolu) et aux retours de #97.

## Partage avec le front

Tout fonctionne déjà hors ligne : les faits viennent de `@domain/apprentissage` et `@domain/catalogue`, la clé d'univers de `@domain/motivation`, les dessins sont des SVG dans le code (décision 0027). Rien de nouveau n'est exporté par un `domain/index.ts`.

## Données d'enfants

Aucune donnée nouvelle.

## Emplacement

Domaine : **rien**. Aucun fichier sous `supabase/functions/_shared/` ne change.

Front (indicatif, pour l'implementer) :
- `src/seance/exercices/boite/BoiteAJetons.tsx` : boîte de l'univers (fermée / ouverte) ;
- `src/seance/exercices/boite/RangeesDeJetons.tsx` : jeton de l'univers, chute des premiers jetons, mêmes attributs ;
- `src/seance/exercices/boite/dessins/` : tables `Record<CleUnivers, …>` (boîte, jeton) ;
- `src/seance/exercices/schema/SchemaEnBarres.tsx` (`MorceauDeBarre`) : jauge dans le morceau, moment du remplissage ; `SchemaDuProbleme.tsx` lui passe `phrasesDites` si #131.8 = A ;
- `src/seance/exercices/schema/dessins/` : table `Record<CleUnivers, …>` (jauge) ;
- `src/seance/exercices/schema/dessin-du-schema.ts` : **inchangé** (les tailles ne bougent pas) ;
- `src/styles.css` : blocs « Boîte à jetons » et « Schéma en barres » (durées à ramener à 400 ms au plus, couleurs dorées des jetons retirées) ;
- planches : `docs/stories/131/planches/` ; scénarios : `features/131-*.feature`.

Ne pas toucher : `ReponseAuCalcul`, `ChoixDeLaQuestion` et la bulle de l'univers (#126), `ClavierDeCristaux` (#128).

Scénarios de `features/21-boite-et-barres.feature` qui doivent rester verts : jetons qui entrent puis boîte fermée (« Léa ne voit plus les jetons »), boîte ouverte avec les jetons rangés par 5, boîte qui reste fermée après une erreur, « ? » remplacé par la réponse, description aux lecteurs d'écran, mouvements réduits, 360 px et proportions 37 / 43. Attention : l'étape « sans mouvement » de #21 lit le couvercle dans `.boite::before` ; si le couvercle devient un dessin SVG, l'étape est à adapter (par `e2e-tester`) sans changer la phrase du scénario.

## Dessins et planches

| Ce qui est dessiné | Nombre |
|---|---|
| Boîte de l'univers, fermée et ouverte | 6 boîtes × 2 états |
| Jeton de l'univers (cinquième marqué : signal commun posé dessus) | 6 |
| Jauge de l'univers, teinte du tout et teinte des parties | 6 |
| **À valider** | **18 dessins** (6 univers × 3 objets) |
| Planches (98.28) | **2** : `boite-a-jetons.png`, 6 lignes × 4 colonnes (boîte fermée · boîte ouverte avec 7 jetons · 8 − 3 avec 3 jetons sortants · 20 jetons à 360 px) = 24 cases ; `jauge-du-schema.png`, 6 lignes × 3 colonnes (parties et tout avant la réponse, barre « ? » vide · même schéma résolu · comparaison 37 / 43 à 360 px) = 18 cases |
| Captures avec la PR (98.29) | **12** (#131.11) |

## Questions (toutes tranchées le 2026-11-03)

**#131.1 Quels objets pour la boîte, le jeton et la jauge dans chaque univers ?**
Pistes de 98 vérifiées contre la règle absolue, l'invariant 98-15 et les objets déjà validés sur le même écran (bulle de l'univers de #126).

| Univers | Boîte : piste 98 → reco | Jeton : piste 98 → reco | Jauge : piste 98 → reco |
|---|---|---|---|
| Animaux de la forêt (`animaux`) | Panier → **panier tressé à couvercle** | Noisettes → **glands** (« Noisette » est le personnage guide ; le gland est déjà la retenue de #127) | Tige qui pousse → **tige verte unie, une seule feuille au bout** (des feuilles le long de la tige se compteraient, inv. propre 2) |
| Princesses et fées (`princesse`) | Boîte à bijoux → **boîte ronde lilas à couvercle, décor de petites fleurs** (une boîte à bijoux évoque un trésor) | Perles → **petites fleurs** (des perles rondes et irisées ressembleraient à la bulle magique irisée de #126 ; la fleur est déjà la retenue de #127) | Ruban → **ruban lilas uni** |
| Sports (`sports`) | Sac de sport → **sac de sport à rabat, ouvert par le haut**, sans rien qui dépasse (un sac fermé ne doit pas évoquer un sac d'argent : à vérifier sur la planche) | Petits ballons → **petits plots (cônes) d'entraînement** (le ballon est la bulle de choix de Sports, sur le même écran) | Tube de couleur → **tube de couleur uni** |
| Police (`police`) | Boîte bleue à insigne → **boîte bleue à couvercle, écusson rond sans étoile** | Étoiles → **casquettes de police** (l'étoile est la récompense, et déjà la bulle de Police) | Barre bleue → **bande bleue unie** (« barre » est le mot du domaine ; jamais de rayures, qui évoqueraient un ruban de signalisation d'accident) |
| Pompiers (`pompier`) | Seau → **bac rouge à couvercle de la caserne** (un seau ne se ferme pas) | Casques → **casques de pompier** jaunes, mats (rien d'inquiétant : un casque protège ; ni flamme, ni hache, ni sirène) | Tuyau qui se remplit d'eau → **tuyau qui se remplit d'eau claire**, sans lance ni anneaux réguliers, sans flamme ni fumée |
| Danse (`danse`) | Boîte à musique → **boîte à musique à couvercle**, sans figurine, sans aucun son | Chaussons → **chaussons de danse** (un chausson par jeton) | Ruban de danse → **ruban de danse uni**, au bout d'une petite baguette au départ de la barre |

Si #131.2 = B, l'objet du jeton est le motif dessiné sur la pastille.

Reco : **la colonne « reco »**. Raisons : aucun objet ne ressemble à une récompense (étoile), à une cible de réponse sur le même écran (ballon, bulle irisée), au personnage guide (noisette), à de l'argent ou à un trésor (coffre, bijoux, disque doré) ; aucune jauge n'a de motif comptable ; dans Pompiers, rien qui évoque le feu.

*Tranchée le 2026-11-03 : reco.* Les objets de la colonne « reco », à valider sur planche univers par univers.

**#131.2 Le jeton est-il l'objet seul (un gland), ou une pastille ronde qui porte l'objet dessiné ?**
Exemple : Noisette dit « Je mets 4 jetons dans la boîte. ». A, Léa voit 4 glands. B, Léa voit 4 pastilles rondes mates, un petit gland dessiné sur chacune.
Reco : **B**. Le mot lu reste vrai (« jetons ») dans les 6 univers (inv. 98-14) ; même forme ronde et même taille partout (inv. 98-17), donc la même lecture « rangées de 5 » ; la pastille mate, de la couleur de l'univers, remplace le disque doré qui ressemble aujourd'hui à une pièce. Risque : à 28 px, l'objet sur la pastille est petit ; à vérifier sur la planche à taille réelle.

*Tranchée le 2026-11-03 : reco.* Pastille ronde mate qui porte l'objet (B).

**#131.3 Le cinquième jeton de chaque rangée garde-t-il sa marque commune (orange), pareille dans les 6 univers ?**
Reco : **oui**. C'est le repère « rangés par 5 » de #21, utile pour passer du comptage au calcul ; un signal commun aux 6 univers, posé sur le jeton, comme les signaux d'état de 98a (inv. 98-15).

*Tranchée le 2026-11-03 : reco.* Oui.

**#131.4 Comment tombent les jetons : tous ensemble (rangée par rangée, légèrement décalées), ou un par un ?**
Reco : **tous ensemble, rangée par rangée**, en 400 ms au plus pour le groupe. Raisons : la boîte à jetons sert à « passer du comptage au calcul » (#21) ; une chute un par un invite à compter un à un et durerait plus de 400 ms pour 10 jetons.

*Tranchée le 2026-11-03 : reco.* Tous ensemble, 400 ms au plus.

**#131.5 Les jetons de la première phrase (« Je mets 4 jetons… ») tombent-ils aussi ?**
Aujourd'hui ils apparaissent sans mouvement ; seuls les jetons ajoutés glissent.
Reco : **oui**, même chute que les jetons ajoutés. « Je mets » est le même geste que « j'en mets encore ».

*Tranchée le 2026-11-03 : reco.* Oui.

**#131.6 Les jetons retirés : restent-ils pâles à leur place (A, comme aujourd'hui), ou quittent-ils la boîte et disparaissent (B) ?**
Exemple : 8 − 3. A, Léa voit 5 jetons et 3 jetons pâles, montés un peu, jusqu'à la fermeture de la boîte. B, les 3 jetons s'élèvent hors de la boîte et s'effacent ; il en reste 5.
Reco : **A**. Les 8 du départ restent visibles, ce qui soutient « Pars de 8 et recule de 3 » ; rien ne change pour les scénarios de #21 ; « en douceur » : ils montent et pâlissent en 400 ms au plus, rien ne disparaît brusquement.

*Tranchée le 2026-11-03 : reco.* A.

**#131.7 À l'ouverture après la bonne réponse, les jetons sont-ils déjà dans la boîte, sans chute ?**
Reco : **oui**, seul le couvercle s'ouvre. Une chute à l'ouverture ferait croire qu'on en ajoute.

*Tranchée le 2026-11-03 : reco.* Oui.

**#131.8 Quand les barres connues se remplissent-elles ?**
- A (reco) : **une seule fois, au début de l'explication du schéma** (« Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche. »), toutes ensemble, en 400 ms au plus. « Réécouter » ne les vide pas. En Muet ou sans voix, dès l'affichage.
- B : dès l'affichage du schéma, pendant la lecture de l'énoncé du problème.
- C : l'une après l'autre.
Raisons de A : la jauge accompagne « Regarde le schéma » ; rien ne bouge pendant la lecture de l'énoncé (inv. 98-10) ; C prolongerait le mouvement au-delà de 400 ms.

*Tranchée le 2026-11-03 : reco.* A : une seule fois, toutes ensemble.

**#131.9 Avant la bonne réponse, à quoi ressemble la barre de la valeur cherchée ?**
- A (reco) : **vide**, contour en pointillés, « ? », comme aujourd'hui, pareille dans les 6 univers ; après le rebond de la réponse juste, le « ? » devient le nombre et la barre se remplit de la jauge de l'univers.
- B : remplie d'une teinte neutre sans motif, jusqu'à la réponse.
Raisons de A : « vide » dit « c'est ce qu'on cherche » sans rien suggérer ; B ressemblerait à une barre connue.

*Tranchée le 2026-11-03 : reco.* A.

> Précisé par la planche validée (P6, 2026-11-03 11:05 UTC) : le décor des bouts suit l'univers, en pointillés. Tout le reste est pareil dans les 6 univers : vide, contour en pointillés, « ? », largeur, aucune jauge. (La mention « pareille dans les 6 univers » de la reco A ne vaut donc pas pour le décor des bouts.)

**#131.10 La barre « ? » garde-t-elle une taille proportionnelle à la réponse, comme aujourd'hui ?**
Exemple : « 4 pommes rouges, combien de vertes, 6 en tout ? » : la barre « ? » occupe déjà le tiers de la ligne (2 sur 6).
Reco : **oui**, sans rien changer. C'est le principe du schéma en barres du guide fondamental et du scénario de #21 ; sans échelle, la taille ne donne pas le nombre. La condition est l'invariant propre 2 : aucune graduation ni motif comptable sur la jauge. (Si la réponse est non, la story toucherait `dessin-du-schema.ts` et un scénario de #21 : ce ne serait plus de l'affichage seul.)

*Tranchée le 2026-11-03 : reco.* Oui, jauge sans échelle.

**#131.11 Captures avec la PR : 6 captures montrant la boîte, et 6 montrant le schéma (12), ou 6 en tout ?**
98.29 prévoit 6 captures, une par univers, mais #131 a deux écrans.
Reco : **12** : par univers, une boîte ouverte après la bonne réponse (7 jetons) et un schéma résolu, à 360 px, mouvements réduits. Elles ne servent pas de référence aux tests.

*Tranchée le 2026-11-03 : reco.* 12 captures.

## Termes à signaler au glossaire

Rien n'est écrit au glossaire par ce cadrage (signalement seulement) :
- **Jeton** : trois sens dans le projet (objet compté, « jetons » de design de #96, jeton d'invitation). La définition du glossaire reste juste ; rappeler en note que « jeton de design » ne s'abrège jamais en « jeton » dans le code métier.
- **Boîte à jetons** : ajouter aux synonymes interdits « coffre », « caisse » (98.6).
- **Jauge** : mot d'interface (déjà listé par #98), jamais un terme du domaine ; « barre » reste réservé au schéma en barres.
- **Étoile** et **Ballon** : rappel de #127, valable ici pour les jetons.
- **Noisette** : nom du personnage guide ; jamais un jeton.
