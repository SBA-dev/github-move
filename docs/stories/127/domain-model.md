# Modèle du domaine : issue #127, maisons de l'addition posée (98c-addition)

Tranche **98c-addition** de #98 (épopée #95). Dépend de #97 et de #98 (98a : geste glisser au doigt, maison de `classer` par univers, signaux d'état communs), toutes deux mergées.

Ce modèle est **court**. Il s'appuie sur le cadrage complet de #98 (`docs/stories/98/domain-model.md`) et ne le recopie pas. Les numéros « inv. 98-n » renvoient aux invariants 1 à 20 de ce cadrage, les numéros « 98.n » à ses questions tranchées.

Décisions du PO déjà prises, appliquées ici sans les reposer : habillage par univers (98.2) ; couleurs des colonnes communes aux 6 univers (inv. 98-19) ; la retenue saute d'une maison à la suivante et, avec mouvements réduits, apparaît en haut de la maison ; planche validée univers par univers (98.28) ; 6 captures avec la PR (98.29) ; la PR attend les 6 dessins validés (98.31) ; règle absolue de contenu, univers par univers ; aucun coffre.

## Contexte

**Apprentissage, affichage seulement.** La story ne change que la façon de montrer l'addition posée pendant une séance. Elle n'ajoute ni contexte, ni agrégat, ni value object, ni commande, ni événement de domaine, ni erreur métier, ni migration, ni Edge Function, ni donnée d'enfant. La context map ne change pas.

- **Apprentissage** reste la source de chaque fait montré : chiffres à poser et leur ordre, placement juste ou faux, chiffres posés, colonne en cours, chiffre écrit, retenue, résultat écrit, bonne réponse montrée par « Je ne sais pas ». Aucune règle de correction ne change. `Seance`, `AdditionPosee`, `EtapePoser` et `EtapeCalculer` ne gagnent aucun état.
- **Motivation** fournit la clé d'univers (`CleUnivers`), déjà lue par l'écran de séance (`useUnivers`), et garde les paroles et l'humeur.
- **Catalogue pédagogique** et **Voix** ne changent pas. La parole « J'écris 2, et 1 monte en retenue. » reste la même (inv. 98-14).

### Les faits du domaine suffisent : vérification

| Ce que #127 montre | Fait nécessaire | Où il est | Existe ? |
|---|---|---|---|
| La maison s'allume à l'étape calculer | Le chiffre de la colonne est juste | `VueColonne.chiffreEcrit` (`vue-d-addition.ts`) : il n'existe qu'après la bonne réponse de la colonne (`EtapeCalculer.validerLaColonne`, `etape-calculer.ts`) | **Oui** |
| La porte s'ouvre à l'étape poser (si #127.3 = A) | Un chiffre juste est rangé dans la colonne | `VueColonne.chiffresPoses` (seuls les placements justes y restent, `EtapePoser.chiffresPoses`) et `ResultatDeReponse` | **Oui** |
| La retenue « vient d'être posée » | Une retenue apparaît dans une colonne à la suite d'une réponse | `VueColonne.retenue` de la colonne d'arrivée. Le front compare déjà l'addition **avant** (`seance.additionEnCours()`) et **après** la réponse (`seance.additionApresLaDerniereReponse()`) dans `useAdditionPosee.ts`. Comparer deux états fournis par le domaine pour animer un changement est de l'affichage, pas une règle | **Oui** |
| Maison **d'arrivée** du saut | Colonne qui porte la retenue | `VueColonne.retenue` (clé = rang de la colonne suivante, `EtapeCalculer.avancerVers`) | **Oui** |
| Maison **de départ** du saut | Colonne dont la somme a donné la retenue | La colonne dont le `chiffreEcrit` apparaît **dans la même réponse** que la retenue (même comparaison avant / après) | **Oui** |
| Pas de saut sur la dernière colonne | La dernière colonne écrit toute sa somme, sans retenue | `EtapeCalculer.validerLaColonne` : sans colonne suivante, aucune retenue n'est posée | **Oui** |
| La bonne maison brille après « Je ne sais pas » (étape poser) | Rang de la bonne colonne | `direJeNeSaisPas(...).bonneReponse` (déjà lu : `colonneQuiBrille`) | **Oui** |
| Rien à habiller en révision et au test de départ | Une addition y est un calcul en ligne, sans colonnes | `question-de-revision.ts` (cas `addition`, `questionDeCalculEnLigne`) et `question-du-test-de-depart.ts` (cas `addition`) | **Oui** |

**Aucun fait ne manque.** Un garde-fou pour l'implementer : la maison de départ du saut se lit dans les faits (la colonne dont le chiffre vient d'être écrit), **jamais** en recalculant « la colonne à droite de celle qui porte la retenue » à partir de l'ordre des rangs. Ce serait refaire dans React la règle « la retenue va dans la colonne suivante », qui vit dans `etape-calculer.ts`.

## Ce que l'addition montre aujourd'hui, et ce que #127 ajoute

| | Aujourd'hui (`ExerciceDAdditionPosee.tsx`, `styles.css`) | Avec #127 |
|---|---|---|
| Geste, étape poser | Glisser-déposer HTML5 (`draggable`, `onDrop`, à la souris seulement) ; toucher le chiffre puis la maison ; clavier (Tab, Entrée) | **Glisser au doigt** avec le geste de 98a (`useGlisserUneEtiquette`, événements pointer) : le chiffre suit le doigt, se lâche sur une maison. Lâché hors de toute maison, il revient sans coûter d'erreur (98.11). Toucher puis toucher et clavier restent. Survol signalé comme dans `classer` (98.20) |
| Maison d'une colonne | Bouton plat de la couleur de la colonne (« Unités ») en tête d'une colonne encadrée | **Dessin de la maison de l'univers** en tête de colonne, aux couleurs de la colonne. Le bouton garde son nom, son libellé lu et ses 44 px |
| Étape calculer, colonne juste | Le chiffre s'écrit en bas de la colonne | En plus, **la maison s'allume** (porte ouverte, intérieur éclairé) |
| Retenue | Pastille ronde qui « monte » d'en bas (`la-retenue-monte`, 0,8 s) ; aucun mouvement avec mouvements réduits | **Elle saute** de la maison de départ à la maison d'arrivée, dessinée par l'univers. Avec mouvements réduits, elle apparaît en haut de la maison d'arrivée (scénario actuel de #20 inchangé) |
| Colonne en cours, bonne réponse montrée | Contour jaune (`data-en-cours`) ; halo jaune qui pulse (`data-brille`) | Inchangés et communs aux 6 univers. La bonne maison de l'étape poser utilise le signal commun de 98a (`signal-brille`) |
| Mode par choix de l'étape calculer | Bulles de choix (`ReponseAuCalcul`) | **Hors périmètre** : c'est #126 |

## Termes

| Terme | Statut |
|---|---|
| Addition posée, Colonne, Rang, Retenue, Étape poser, Étape calculer, Étiquette (chiffre d'une addition posée), Placement, Je ne sais pas, Bonne réponse montrée, Univers, Personnage guide | Existants, réutilisés tels quels |
| Maison | Mot d'interface de **Colonne** (décision n°24), inchangé dans les 6 univers, quel que soit le dessin |
| Dessin de l'univers, signal d'état, planche | Mots de cadrage de #98, hors glossaire |
| Maison allumée, saut de la retenue, la retenue saute | **Mots d'interface** (comme « mouvements réduits »). Aucun n'entre dans le domaine. La parole du personnage guide garde « monte en retenue » |
| Tour | **En conflit** : synonyme **interdit** de **Colonne** au glossaire. La piste « tour » de Princesses (98) ne doit jamais nommer une colonne dans le code ni les scénarios (dire « château ») |
| Étoile | **En conflit** : terme réservé à la récompense (1 à 3 étoiles). Une retenue dessinée en étoile prête à confusion (voir #127.2) |
| Ballon | Mot d'interface possible de la bulle de choix dans Sports (#126). Une retenue en ballon se confondrait avec une bulle de choix sur le même écran (voir #127.2) |

## Modèle

Aucun agrégat, aucun value object nouveau. Ce qui suit vit dans `src/` et ne décide de rien : il lit des faits existants.

| Ce que le front montre | Lu dans | Décide de quoi ? |
|---|---|---|
| Dessin de la maison (fermée / porte ouverte / allumée) | `CleUnivers` + `VueColonne.couleur` + `chiffresPoses` + `chiffreEcrit` | Rien : affichage |
| Dessin de la retenue et son saut | `CleUnivers` + `VueColonne.retenue` (avant / après la réponse) | Rien : affichage |
| Signaux d'état (survol, en cours, bonne réponse montrée) | Geste en cours, `colonneEnCours`, `colonneQuiBrille` | Rien : communs aux 6 univers, posés par-dessus le dessin |

## Invariants

### Invariants de #98 qui s'appliquent

inv. 98-1 (mêmes erreurs, avancement, étoiles, revalidation), 98-2 (seul un lâcher sur une maison, un toucher ou Entrée répond ; lâché ailleurs, aucune erreur), 98-3 (ordre des chiffres à poser du domaine), 98-4 et 98-15 (bonne réponse montrée identique et unique dans les 6 univers), 98-5 (retours de #97 d'abord ; chemin d'un objet en 150 à 400 ms), 98-6 (l'habillage ne donne jamais la réponse), 98-7 et 98-17 (44 px, 360 px, mise en page indépendante de l'univers), 98-8 (alternative clavier), 98-9 (mouvements réduits), 98-10 (consigne au premier plan, mode dys, contraste 4,5:1), 98-11 (lecteurs d'écran inchangés), 98-12 (même habillage partout où le type est joué), 98-13 et 98-20 (règle absolue, univers par univers), 98-14 (changer d'univers ne change que le dessin), 98-16 (un dessin par univers, repli sur « animaux »), 98-18 (aucun chiffre ni texte dans un dessin), 98-19 (couleurs des colonnes communes).

### Invariants propres à #127

1. **Les couleurs des colonnes commandent le dessin.** Unités bleue, dizaines rose, centaines verte, dans les 6 univers. La couleur dominante du dessin de chaque maison est celle de sa colonne : les phrases d'aide « il va dans la maison rose » et la consigne « Le chiffre des unités va toujours dans la maison bleue » restent vraies dans chaque univers. Aucune maison d'un univers ne garde une couleur propre qui contredirait sa colonne (une caserne rouge, une maisonnette de police bleue posée sur la colonne rose…).
2. **Une retenue ne porte jamais la couleur d'une autre colonne.** Elle est neutre ou prend la couleur de sa maison d'arrivée (comme le contour actuel). Une goutte d'eau bleue posée en haut de la maison rose ferait croire à des unités.
3. **Le chiffre de la retenue reste du texte.** Lu « Retenue 1 » comme aujourd'hui, en mode dys, contraste d'au moins 4,5:1 sur son dessin, jamais tracé dans le SVG (inv. 98-18).
4. **La maison allumée ne trahit pas la réponse.** Elle s'allume seulement quand le domaine a écrit son chiffre (`chiffreEcrit`), jamais avant, jamais au survol, jamais à cause de « Je ne sais pas ». « Allumée », « colonne en cours » et « bonne réponse montrée » restent trois signaux distincts, et aucun élément du dessin (lampe, étoile, insigne) ne ressemble au halo de la bonne réponse montrée.
5. **La retenue ne saute que si le domaine en pose une.** Départ : la maison dont le chiffre vient d'être écrit. Arrivée : la maison qui porte la retenue. La dernière colonne écrit toute sa somme : aucun saut, aucune maison ajoutée.
6. **Le saut ne retarde rien.** Il part après le rebond de #97, tient en 400 ms au plus (aujourd'hui la montée dure 0,8 s, à raccourcir) et ne retarde ni l'effet sonore, ni la parole, ni l'écran suivant (#79). En Muet ou sans voix, il a lieu pareil.
7. **Un chiffre posé ne se déplace plus**, comme une étiquette rangée de 98a. Un chiffre glissé suit toujours le doigt, même avec mouvements réduits (98.23).
8. **360 px avec 3 colonnes.** Une addition à centaines tient sans défilement horizontal à 360 px : 3 maisons d'au moins 44 px de cible, leurs chiffres, la retenue et le chiffre écrit lisibles. Le dessin ne dépasse pas la largeur de sa colonne et ne repousse pas les chiffres à poser ni « Je ne sais pas » hors de l'écran de 360 × 740.
9. **Seulement en séance.** En séance de révision et au test de départ, une addition reste un calcul en ligne, sans maison ni retenue dessinée.
10. **Chaque objet de retenue respecte la règle absolue et l'invariant 4** dans son univers (voir #127.2) : rien qui brille comme la bonne réponse montrée, rien qui se confonde avec une récompense (étoile) ou avec une cible de réponse (ballon), rien qui éclate.

## Événements

Aucun événement de domaine nouveau. L'affichage réagit aux faits existants (placement, chiffre écrit, retenue, colonne en cours, bonne réponse montrée) et aux retours de #97.

## Partage avec le front

Tout fonctionne déjà hors ligne : les faits viennent de `@domain/apprentissage`, la clé d'univers de `@domain/motivation`, les dessins sont des SVG dans le code (décision 0027). Rien de nouveau n'est exporté par `domain/index.ts`.

## Données d'enfants

Aucune donnée nouvelle.

## Emplacement

Domaine : **rien**. Aucun fichier sous `supabase/functions/_shared/apprentissage/` ne change.

Front (indicatif, pour l'implementer) :
- `src/seance/exercices/addition/ExerciceDAdditionPosee.tsx` : glisser au doigt à la place du glisser-déposer HTML5, maison dessinée, retenue dessinée et son saut ;
- `src/seance/exercices/etiquettes/useGlisserUneEtiquette.ts` et `src/seance/exercices/maisons/groupe-sous-le-doigt.ts` : le geste vise aujourd'hui `[data-groupe]` et n'est ouvert qu'à `classer` ; à élargir aux maisons de colonne (`data-rang`) sans changer `classer` ;
- maison : `src/seance/exercices/maisons/DessinDeLaMaison.tsx` et `dessins/` (option A : une couleur de façade passée au dessin) ou une nouvelle table `Record<CleUnivers, …>` (option B) ;
- retenue : une table `Record<CleUnivers, …>` sous `src/seance/exercices/addition/` ;
- `src/styles.css` (bloc « Addition posée ») ;
- planches : `docs/stories/127/planches/` ; scénarios : `features/127-*.feature`.

Ne pas toucher : `ReponseAuCalcul` et les bulles de choix (#126), la fin de séance (#106).

Scénarios réutilisables de `features/98-exercices-comme-des-jeux.feature`, à transposer au chiffre et à la maison de colonne : glissé du doigt dans la bonne maison ; 360 px jusqu'à la dernière maison ; passage au-dessus sans lâcher ; lâché hors de toute maison (sans encouragement, sans son, 5 fois sans perte d'étoile) ; chiffre posé qui ne se déplace plus ; Plans sur les 6 univers (dessin, bonne réponse montrée identique, 360 px et 44 px, mouvements réduits) ; repli sur « animaux » ; mode dys ; lecteurs d'écran. Scénarios de `features/20-calcul-fluence-addition-posee.feature` qui doivent rester verts sans changement : couleurs des colonnes par univers, retenue en haut de la colonne des dizaines, retenue sans mouvement avec mouvements réduits.

## Dessins et planches

| Ce qui est dessiné | Option A (réutiliser) | Option B (redessiner) |
|---|---|---|
| Maison de colonne | 6 maisons de `classer` déjà validées, **recolorées** : façade en couleur de la colonne (3 couleurs), toit et décor de l'univers. 6 adaptations, 0 forme nouvelle | 6 formes nouvelles × 2 états (fermée, allumée) = 12 dessins, chacun en 3 couleurs |
| Retenue | 6 objets (un par univers) | 6 objets |
| **À valider** | **12** (6 adaptations, 6 objets) | **18** (12 maisons, 6 objets) |
| Signaux communs | réutilisés de 98a (survol, bonne réponse montrée) + « colonne en cours » existant | idem |
| Planches (98.28) | **2** : `addition-maison.png`, 6 lignes × 5 colonnes (unités fermée · dizaines fermée · centaines fermée · maison allumée avec son chiffre écrit · bonne réponse montrée à l'étape poser) = 30 cases ; `addition-retenue.png`, 6 lignes × 3 colonnes (retenue « 1 » en haut de la maison rose · en haut de la maison verte · à mi-saut) = 18 cases | idem, 2 planches, 48 cases |
| Captures avec la PR (98.29) | 6 : une par univers, 360 px, mouvements réduits, étape calculer après une retenue (une maison allumée, une retenue posée) | idem |

## Questions ouvertes

**#127.1 La maison d'une colonne : réutiliser les maisons de `classer` (A) ou dessiner d'autres maisons (B) ?**
- **A, réutiliser** les 6 maisons validées dans 98a (tronc d'arbre, petit château à une tour, stade d'athlétisme variante A, commissariat, caserne, maison à pignon de Danse), recolorées aux couleurs des colonnes (#127.4).
- **B, redessiner** à partir des pistes de 98 (tronc, tour, vestiaire, maisonnette bleue, caserne, petit opéra). Attention : ces pistes sont **les mêmes objets** que la maison de `classer`, et deux ont déjà été refusées pendant la validation de 98a : le vestiaire de Sports (remplacé par le stade) et le dôme de Danse (remplacé par un pignon, risque d'évoquer un édifice religieux). B reviendrait sur ces choix, et la « maisonnette bleue » contredit les colonnes rose et verte. Une forme nouvelle, plus haute et plus étroite, irait mieux dans une colonne d'environ 95 px de large à 360 px.

Reco : **A**. Les formes sont déjà validées contre la règle absolue et par le PO ; l'enfant retrouve la même « maison » dans `classer` et dans l'addition (même mot, décision n°24) ; le code d'ouverture et d'allumage existe déjà (`DessinDeLaMaison`) ; 6 dessins de moins à valider, et moins d'allers-retours (98a en a eu deux pour Sports). Risque : une maison large dans une colonne étroite, à vérifier sur la planche à taille réelle.

**#127.2 Quel objet porte la retenue dans chaque univers ?** Pistes de 98, vérifiées contre la règle absolue et l'invariant 15 de #98 :

| Univers | Piste de 98 | Verdict | Reco |
|---|---|---|---|
| Animaux de la forêt | Gland | Aucun problème | **Gland** |
| Princesses et fées | Étoile | **À éviter** : une étoile qui brille ressemble au halo jaune de la bonne réponse montrée (inv. 98-15), et « étoile » est la récompense de fin de leçon : l'enfant peut croire qu'il gagne une étoile | **Petite fleur** |
| Sports | Petit ballon | **À éviter** : le ballon est l'exemple du PO pour la bulle de choix de Sports (#126). Au CP, l'étape calculer montre des bulles de choix : une retenue en ballon se confondrait avec un choix à toucher. Aussi piste des jetons de Sports (#131) | **Gourde** |
| Police | Étoile d'insigne | **À éviter** : mêmes raisons que l'étoile, et l'étoile d'insigne décore déjà la maison de Police (doublon) | **Loupe**, le chiffre dans le verre |
| Pompiers | Goutte d'eau | Sans danger, mais **pas en bleu** (invariant propre 2) | **Goutte d'eau** blanche, contour de la couleur de la maison d'arrivée |
| Danse | Note de musique | Aucun problème (aucun son ajouté) | **Note de musique** |

Options : A, la reco ci-dessus ; B, les pistes de 98 telles quelles (déconseillé pour Princesses, Sports et Police) ; C, tu donnes un objet pour un ou plusieurs univers (il ne doit ni briller, ni ressembler à une récompense, ni à une bulle de choix).

**#127.3 À l'étape poser, que fait la maison quand un chiffre juste y est rangé ?**
Exemple : 45 + 37, Léa pose le « 5 » dans la maison bleue.
- A (reco) : **la porte s'ouvre, la maison reste éteinte**. Elle s'allume à l'étape calculer, quand son chiffre est écrit. Même geste que `classer` (la bonne maison s'ouvre), et « allumée » garde un seul sens : « ton calcul de cette colonne est juste ».
- B : rien ne change à l'étape poser (le chiffre qui reste suffit) ; la maison s'ouvre et s'allume d'un coup à l'étape calculer.
- C : elle s'ouvre et s'allume dès l'étape poser. Déconseillé : au début de l'étape calculer, toutes les maisons seraient déjà allumées, et l'allumage ne dirait plus rien.

**#127.4 Avec A en #127.1, quelle partie de la maison prend la couleur de la colonne ?**
- A (reco) : **la façade** (la plus grande surface) ; le toit et le décor gardent l'univers. La maison se lit « bleue », « rose » ou « verte » d'un coup d'œil, comme le disent les phrases d'aide.
- B : le toit seulement ; la façade garde la couleur de l'univers (risque : une caserne rouge sur la colonne rose).
- C : le dessin ne change pas ; seul le cadre de la colonne garde sa couleur. Déconseillé : « la maison bleue » ne serait plus bleue dans 5 univers.

**#127.5 Quand la retenue saute-t-elle ?**
- A (reco) : **tout de suite après le rebond de la réponse juste** (moins de 400 ms), sans attendre la voix. En Muet ou sans voix, l'enfant voit le même saut.
- B : au moment où le personnage guide dit « … monte en retenue ». Plus parlant, mais le saut dépend de la voix et retarde l'information.

**#127.6 Quelle taille pour le dessin de la maison dans une colonne, sur téléphone ?**
L'addition à 3 colonnes doit tenir à 360 × 740 avec les chiffres posés, la retenue, le chiffre écrit, les chiffres à poser et « Je ne sais pas ». La maison de `classer` mesure environ 75 px depuis 98.32.
- A (reco) : **la plus grande taille qui tient à 360 × 740 sans faire défiler l'étape poser**, au plus 75 px comme `classer`, avec le nom de la colonne en pastille sur le bas du dessin (comme 98.32).
- B : une petite maison fixe d'environ 48 px en tête de colonne, pour garder toute la place aux chiffres.

**#127.7 La retenue garde-t-elle le chiffre posé sur l'objet, ou une pastille ronde avec l'objet à côté ?**
- A (reco) : **le chiffre sur l'objet** (le gland, la loupe…), sur un fond clair qui garde 4,5:1. C'est l'objet qui saute.
- B : la pastille ronde actuelle garde le chiffre ; un petit objet de l'univers l'accompagne. Plus sûr pour la lecture, moins « jeu ».

## Termes à signaler au glossaire

Rien n'est écrit au glossaire par ce cadrage (signalement seulement) :
- **Placement** : la définition dit « un groupe pour `classer`, la place suivante de la liste pour `ordre` » et oublie **la colonne d'une addition posée**, alors que le domaine fait déjà un placement d'un chiffre dans une colonne (`Reponse.placement(chiffre, rang)`, `EtapePoser.placer`). Ajout proposé : « une colonne pour l'addition posée (#20) ».
- **Colonne** : « tour » est un synonyme interdit. Le dessin de Princesses se nomme « château » dans le code et les scénarios.
- **Retenue** : la définition (« reportée en haut de la colonne suivante, à gauche ») reste juste. « Saut de la retenue », « la retenue saute » : mots d'interface, hors glossaire.
- **Maison allumée** : mot d'interface, comme « maison » (décision n°24).
- **Étoile** : rappeler qu'elle est réservée à la récompense ; aucun objet de jeu (retenue, cible) ne se dessine en étoile qui brille.
- **Ballon** : si #126 en fait le mot d'interface de la bulle de choix dans Sports, il ne sert à rien d'autre sur l'écran d'un exercice.
