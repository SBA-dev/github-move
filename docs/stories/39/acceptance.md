# Critères d'acceptance : issue #39, Leçons personnelles (générateurs locaux)

Scénarios : `features/39-lecons-personnelles.feature` (tags `@issue-39 @wip`).
Modèle du domaine : `docs/stories/39/domain-model.md` (contexte **Accompagnement**, qui lit le **Catalogue pédagogique** et la **Famille**, et donne ses leçons à **Apprentissage**). Les questions #39.1 à #39.16 viennent du modèle ; #39.17 à #39.21 sont ajoutées ici.

> **Premier cadrage, à valider par le PO.** Les scénarios suivent les **recommandations** du modèle. Un scénario tagué `@a-valider` dépend d'une question encore ouverte, dont le numéro est en commentaire (`# #39.n`) juste au-dessus.
> Décisions déjà prises (non re-questionnées) : #13 et #14 sont sorties de la beta (pas de second parent, pas d'export ni de suppression avec le profil dans #39) ; aucun verrou dans le parcours (25.1 b) ; connexion du parent par mot de passe (#72, décision 0019) : aucun scénario ne repose sur l'e-mail de connexion.

## Objectif

En tant que **parent**, je veux coller un texte (liste de mots, liste de verbes, poésie, texte documentaire, texte sur un métier), vérifier la leçon préparée dans l'aperçu, puis l'enregistrer pour un de mes enfants, afin qu'il révise ce qu'il fait en classe.

La leçon préparée est calculée dans le navigateur par les générateurs locaux (`@domain/accompagnement`), sans IA et sans service externe ; l'enregistrement passe par une Edge Function qui refait la préparation avec le même domaine. Chez l'enfant, la leçon personnelle est jouée par Apprentissage comme une leçon de la bibliothèque.

Comportement actuel (`app/`, `adultCreer`, `generateLocally`, `adultLecons`) repris comme premiers exemples, avec les écarts recommandés par le modèle : leçon d'un profil enfant et classe de cet enfant proposée (#39.1), citation mot pour mot (#39.2), hors du parcours, en tête de « Toutes les leçons » (#39.3), générateurs corrigés (#39.4), plus de choix des types d'exercices (#39.8), limite de 3000 caractères (#39.14), « Je choisis » remplacé par « Toutes les leçons ».

## Example mapping

| Règle | Exemples |
|---|---|
| 1. La forme du texte du parent décide de la leçon préparée, montrée dans l'aperçu avant l'enregistrement | « chaton, maison, poisson, garçon » → « Dictée : chaton, maison, poisson… », seul exercice Dictée « J'écris les mots » · « chanter, finir, prendre, manger » → « Les verbes : chanter, finir, prendre… », « Chaque verbe dans sa maison » et « Le verbe chanter » · quatre vers courts → « Poésie : Le vent souffle sur la colline », un seul exercice « Apprendre par cœur » · texte sur les abeilles → « Lecture : Les abeilles… », « Les mots envolés » et « Dans l'ordre » · pompier, sans matière : CE2 → « Vivre ensemble (EMC) », CP → « Français » · aperçu « CE1 · Français · préparée sans IA », section de français du CE1, citation mot pour mot, aucune citation à vérifier |
| 2. Un texte ou un choix qui ne permet pas de préparer une leçon est refusé avec un message, et rien n'est à enregistrer | vide ou « ab » → « Colle d'abord un texte. » · 3001 caractères → « Ton texte est trop long : 3000 caractères au plus. » · « Le chat dort. » → « Ce texte ne permet pas de préparer une leçon. » · EMC au CE1 → « Aucune section du programme pour cette classe et cette matière. » |
| 3. Le parent enregistre la leçon préparée pour un de ses enfants, la retrouve dans « Mes leçons » et ne peut que la supprimer, après confirmation | enregistrée pour Léa : message, carte « Dictée : chaton, maison, poisson… », « Léa », « CE1 · Français · Dictée » · Hugo en CM2 → classe proposée CM2 · préparée sans être enregistrée → « Mes leçons » vide · aucune modification proposée · « Supprimer » sans confirmer → la leçon reste · supprimée → absente de « Mes leçons » et de « Toutes les leçons » de Léa |
| 4. Chez l'enfant, la leçon personnelle est en tête de « Toutes les leçons », avec « Pour toi », hors du parcours, et se joue comme une autre leçon | en premier dans « Toutes les leçons », « Pour toi », à découvrir · absente de « Mon parcours » de français · fin de séance : « Accueil » et « Rejouer », aucune leçon suivante · 2 étoiles sur la tablette, retrouvées sur le téléphone |
| 5. Une leçon personnelle n'est visible que de son enfant et des parents rattachés à cet enfant ; seul un parent rattaché la crée ou la supprime | Hugo (autre enfant de Paul) ne la voit pas · Claire (autre famille) : « Mes leçons » vide · Tom (enfant de Claire) : aucun « Pour toi » · Claire ne crée pas pour Léa · Claire ne supprime pas · visiteur non connecté ne crée pas |
| 6. Créer une leçon et retrouver « Pour toi » se fait sur un petit écran, au lecteur d'écran, et l'aperçu se prépare sans réseau | 360 px, champs et boutons de 44 px · « Pour toi : Dictée : chaton, maison, poisson…, CE1, Français : à découvrir » · réseau coupé : l'aperçu a son titre |

## Règles

| # | Règle | Scénarios | Questions |
|---|---|---|---|
| 1 | La forme du texte du parent décide de la leçon préparée, montrée dans l'aperçu avant l'enregistrement | Une liste de mots donne une dictée `@a-valider` · Une liste de verbes donne un classement par groupe du verbe et la conjugaison du premier verbe du 1er groupe · Quatre vers courts donnent une poésie à apprendre par cœur · Un texte documentaire donne un texte à trous et des phrases à remettre dans l'ordre `@a-valider` · Un texte sur le métier de pompier, sans matière choisie, en <classe>, donne une leçon de <matière> (2 cas : CE2 → EMC, CP → Français) `@a-valider` · L'aperçu montre la classe, la matière, la section du programme retenue et sa citation, sans citation à vérifier `@a-valider` | #39.4, #39.5, #39.10, #39.2 |
| 2 | Un texte ou un choix qui ne permet pas de préparer une leçon est refusé avec un message, et rien n'est à enregistrer | Un texte de moins de 3 caractères est refusé (2 cas : vide, « ab ») · Un texte de plus de 3000 caractères est refusé `@a-valider` · Une seule phrase courte ne permet pas de préparer une leçon `@a-valider` · Une matière qui n'a aucune section du programme pour la classe choisie est refusée `@a-valider` | #39.14, #39.17, #39.10 |
| 3 | Le parent enregistre la leçon préparée pour un de ses enfants, la retrouve dans « Mes leçons » et ne peut que la supprimer, après confirmation | Paul enregistre pour Léa la leçon préparée et la retrouve dans « Mes leçons » `@a-valider` · La classe proposée est celle de l'enfant pour qui Paul crée la leçon `@a-valider` · Une leçon préparée mais pas enregistrée n'apparaît pas dans « Mes leçons » · Une leçon personnelle enregistrée ne se modifie pas, elle se supprime seulement `@a-valider` · La suppression d'une leçon personnelle demande une confirmation · Une leçon personnelle supprimée disparaît de « Mes leçons » et des écrans de l'enfant | #39.1, #39.3, #39.6 |
| 4 | Chez l'enfant, la leçon personnelle est en tête de « Toutes les leçons », avec « Pour toi », hors du parcours, et se joue comme une autre leçon | Léa trouve sa leçon personnelle en tête de « Toutes les leçons », avec « Pour toi » `@a-valider` · Une leçon personnelle n'apparaît pas dans « Mon parcours » `@a-valider` · Après une leçon personnelle, aucune leçon suivante n'est proposée `@a-valider` · Les étoiles gagnées à une leçon personnelle se retrouvent sur un autre appareil du parent `@a-valider` | #39.1, #39.3, #39.12 |
| 5 | Une leçon personnelle n'est visible que de son enfant et des parents rattachés à cet enfant ; seul un parent rattaché la crée ou la supprime | Hugo, l'autre enfant de Paul, ne voit pas la leçon personnelle de Léa `@acces @a-valider` · Claire ne voit pas dans « Mes leçons » la leçon personnelle de Léa `@acces` · Tom, enfant d'une autre famille, ne voit pas la leçon personnelle de Léa `@acces` · Claire ne peut pas créer une leçon personnelle pour Léa, à laquelle elle n'est pas rattachée `@acces` · Claire ne peut pas supprimer la leçon personnelle de Léa `@acces` · Sans connexion du parent, personne ne crée de leçon personnelle `@acces` | #39.1 |
| 6 | Créer une leçon et retrouver « Pour toi » se fait sur un petit écran, au lecteur d'écran, et l'aperçu se prépare sans réseau | « Créer une leçon » et l'aperçu tiennent dans un écran de 360 px de large, avec des cibles assez grandes pour un doigt · Un lecteur d'écran lit « Pour toi », le niveau, la matière et l'état d'une leçon personnelle `@a-valider` · Sans réseau, l'aperçu de la leçon se prépare quand même | #39.3 |

Total : **6 règles, 29 scénarios (31 cas)**, dont **16 `@a-valider`** et **6 `@acces`**. Aucun scénario `@hors-beta`, `@envoi-email` ni `@depend-de-…`.

Pistes de critères de l'issue :
- « chaton, maison, poisson, garçon », « chanter, finir, prendre, manger », quatre vers courts, « Colle d'abord un texte. », « Pour toi », suppression avec confirmation, `@acces` entre deux familles : couverts ;
- pompier sans matière → EMC : couvert **au CE2** (seule classe qui a une section d'EMC), le CP donne du français (#39.10) ;
- « L'aperçu signale une citation non vérifiée » : **inversée** par la recommandation #39.2 (la citation est toujours mot pour mot, l'aperçu ne signale plus rien) ;
- « Une leçon enregistrée apparaît avec « Pour toi » pour les enfants de la famille » : devient « pour l'enfant choisi » (#39.1), et le scénario d'Hugo vérifie qu'un autre enfant du même parent ne la voit pas.

### Laissé aux tests unitaires du domaine (pas d'E2E)

Seuils de la forme du texte (25 mots du texte sur un métier, 80 % d'éléments courts, 70 % de verbes, 12 mots par vers) ; groupe du verbe (`aller`, verbes en `-oir`, liste des 20 verbes en `-ir` du 3e groupe, #39.4 a) ; « j' » devant une voyelle ou un h muet, « je hurle » (#39.4 b) ; `-ger`, `-cer` et choix du verbe régulier (#39.9) ; mots non dictables (#39.11) ; limites de 10 mots, 12 verbes, 16 vers, 8 phrases ; points de suspension (#39.15) ; score et choix de la section, citation (#39.2) ; « Mon texte » ; déterminisme ; 3000 caractères acceptés (borne) ; revalidation par `lireLecon` ; partie `pourToi` de `toutesLesLecons` (plus récente d'abord, quel que soit le niveau, filtres, nombre de leçons montrées) ; une leçon personnelle ne ferme pas une **Matière réussie**.

### Lecture des étapes

- « Paul prépare une leçon pour Léa à partir du texte « … » » : Paul entre dans l'espace parent, ouvre « Créer une leçon », choisit Léa (classe proposée : celle de Léa, aucune matière choisie), colle le texte et demande l'aperçu. « en classe <classe> » et « en matière « <matière> » » changent ce choix.
- « Paul a créé pour Léa une leçon personnelle à partir du texte « … » » : la leçon est préparée puis enregistrée (par l'écran ou par l'Edge Function avec le JWT de Paul, au choix de l'`e2e-tester`).
- « aucune leçon préparée n'est proposée à l'enregistrement » : aucun aperçu ni bouton d'enregistrement.
- Dans « Mes leçons », la description reprend « `<niveau>` · `<matière>` · `<types d'exercices>` », avec le libellé du type du Catalogue (« Dictée », « Ranger dans les maisons », « Conjugaison »…).
- Les leçons personnelles sont réelles : elles demandent un vrai profil enfant (`features/steps/profil-reel.ts`, décision 0021), pas le profil préparé.

## Hors périmètre

- Création par l'IA (#40) et par photo du cahier (#41).
- Export et suppression des leçons personnelles avec le profil (#14, sortie de la beta) ; en attendant, la cascade en base les supprime avec le profil.
- Second parent (#13, sortie de la beta).
- Devoir « leçon à faire » qui cite une leçon personnelle (#36), audio d'une poésie personnelle (#42), révisions (#28), « Aujourd'hui » (#29), cabane (#32) : aucun scénario ne dépend de ces stories.
- Modification d'une leçon (#39.6), choix des types d'exercices (#39.8).
- Hors ligne au lancement (#44) : seul l'aperçu est vérifié sans réseau.

## Questions ouvertes

Questions du modèle (recommandations suivies par les scénarios) : **#39.1 à #39.16**, voir `docs/stories/39/domain-model.md`. Scénarios qui en dépendent :

| Question | Scénarios `@a-valider` |
|---|---|
| #39.1 leçon d'un profil enfant | Paul enregistre pour Léa… · La classe proposée est celle de l'enfant… · Léa trouve sa leçon personnelle en tête… · Hugo, l'autre enfant de Paul… |
| #39.2 citation mot pour mot | L'aperçu montre la classe, la matière, la section… |
| #39.3 hors du parcours, partie « Pour toi » | Paul enregistre pour Léa… (message) · Léa trouve sa leçon personnelle en tête… · … n'apparaît pas dans « Mon parcours » · Après une leçon personnelle, aucune leçon suivante… · Un lecteur d'écran lit « Pour toi »… |
| #39.4 (c) plus de « Le mot bien écrit » | Une liste de mots donne une dictée |
| #39.5 trous et ordre | Un texte documentaire donne… |
| #39.6 pas de modification | Une leçon personnelle enregistrée ne se modifie pas… |
| #39.10 matière et section cohérentes | Un texte sur le métier de pompier… · Une matière qui n'a aucune section… |
| #39.12 séance comme les autres | Les étoiles gagnées à une leçon personnelle… |
| #39.14 3000 caractères | Un texte de plus de 3000 caractères est refusé |
| #39.17 (nouvelle) | Une seule phrase courte ne permet pas de préparer une leçon |

Les questions #39.4 (a, b), #39.7, #39.8, #39.9, #39.11, #39.13, #39.15 et #39.16 ne changent aucun scénario (tests unitaires, données en base ou architecture).

Nouvelles questions :

- **#39.17 Texte dont on ne tire aucune leçon.** Le modèle ajoute une règle absente du legacy : quand aucun exercice n'est possible et que le texte n'a pas au moins 2 lignes ou phrases pour « Mon texte » (ex. « Le chat dort. »), la préparation échoue avec « Ce texte ne permet pas de préparer une leçon. ». Le legacy faisait un `memoriser` d'une seule ligne, que `lireLecon` refuserait.
  **Recommandation : refuser avec ce message**, comme les autres erreurs du texte ; rien n'est proposé à l'enregistrement. D'accord ?

- **#39.18 Enregistrer sans réseau.** L'aperçu se prépare hors ligne, mais l'enregistrement passe par l'Edge Function. Le modèle ne dit pas ce que voit le parent.
  **Recommandation** : l'aperçu reste affiché, la leçon n'est pas enregistrée, et Paul lit « Pas de réseau : la leçon n'est pas enregistrée. Réessaie quand tu seras connecté. » ; pas de mise en attente (contrairement aux séances, décision 0013). Pas de scénario tant que ce n'est pas tranché. D'accord ?

- **#39.19 Ordre et regroupement dans « Mes leçons ».** Avec plusieurs enfants et plusieurs leçons, le modèle donne le prénom sur chaque carte, mais pas l'ordre.
  **Recommandation : la plus récente d'abord, sans regroupement par enfant** (comme la partie « Pour toi » de l'enfant) ; à revoir si un parent a beaucoup de leçons. D'accord ?

- **#39.20 Libellés de l'espace parent.** Le legacy dit « Enregistrer pour les enfants » et « Enregistrée ✓ », et la matière « Je ne sais pas ».
  **Recommandation** : bouton « Enregistrer pour <prénom> » (#39.1), puis le message de #39.3 (« La leçon apparaît maintenant dans « Toutes les leçons » de Léa, avec « Pour toi ». ») ; la liste « Matière » garde « Je ne sais pas » comme premier choix ; les onglets « Créer une leçon » et « Mes leçons » sont gardés. Les scénarios restent déclaratifs et ne dépendent pas des libellés des boutons. D'accord ?

- **#39.21 Termes du glossaire.** Les scénarios emploient « leçon préparée », « texte » (du parent), « aperçu de la leçon », « forme du texte » implicitement ; ces termes sont proposés par le modèle mais pas encore au glossaire, et la définition de **Leçon personnelle** y dit encore « avec l'aide de l'IA » et « visible que dans sa famille ».
  **Recommandation : ajouter au glossaire, après validation, les termes proposés par le modèle** (Texte du parent, Forme du texte et ses cinq formes, Générateur local, Leçon préparée, Section retenue, Groupe du verbe) **et remplacer la définition de Leçon personnelle** par celle du modèle ; « Pour toi », « Mes leçons », « Créer une leçon », « aperçu » et « préparée sans IA » restent des mots d'interface. D'accord ?
