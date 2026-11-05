# 0041 : Le grand défi terminé est enregistré dans une table à part, `grands_defis_termines`, par la même Edge Function `terminer-le-defi`

**Statut** : Acceptée · 2026-11-04 (story #137, réponses du PO aux questions #137.1 à #137.7, « 137 reco tout »)

## Contexte

La story #137 ajoute le **grand défi** d'une matière : un défi dont les leçons sont toutes celles du parcours de la
matière dans la classe du profil. Il est identifié par **(matière, classe)**, sans numéro de partie.

La décision 0038 enregistre un défi terminé dans `defis_termines`, dont la colonne `numero` est
`smallint not null check (numero >= 1)`. Le grand défi n'y entre pas :
- un numéro 0 est refusé par la contrainte, et changer la contrainte n'est pas une migration additive ;
- écrire le numéro de la dernière partie confondrait le grand défi avec un défi d'une partie dès qu'une leçon ajoutée
  crée une partie de plus, alors qu'un défi relevé doit rester relevé même si la bibliothèque change (réponse 100.15) ;
- une colonne « sorte » ajoutée laisserait `numero` obligatoire pour un défi qui n'en a pas.

## Décision

1. **Table additive `grands_defis_termines`** (Apprentissage), à côté de `defis_termines`, qui ne change pas : `id`
   (identifiant de la séance de défi, clé), `profil`, `matiere`, `classe` (le `Niveau`), `termine_le`, `jour`. Mêmes
   contraintes de matière et de classe que `defis_termines`. Un grand défi est relevé quand le profil a au moins une
   ligne pour (matière, classe).
2. **RLS** activée : lecture seule par le parent rattaché au profil. Aucune écriture pour `anon` ni `authenticated` ;
   `service_role` lit et insère.
3. **Cascade** : la ligne est supprimée avec le profil enfant.
4. **Fonction d'écriture `enregistrer_le_grand_defi_termine`**, calquée sur `enregistrer_le_defi_termine` (#100) :
   grand défi terminé et file de révision d'un seul geste, idempotente par identifiant, `security invoker`, exécutable
   par `service_role` seul ; elle rend `enregistree`, `dejaEnregistree` ou `conflit`.
5. **Pas de nouvelle Edge Function** : `terminer-le-defi` et le cas d'usage `TerminerLeDefi` servent aux deux sortes
   de défi. La lecture du corps accepte la forme du grand défi (matière, classe, marque du grand défi) et jusqu'à
   12 questions ; la forme d'avant #137 reste acceptée. L'adaptateur `DefisTerminesSupabase` lit les deux tables et
   écrit par la fonction qui correspond à la sorte du défi.
6. **Export du profil (#14)** : le contrat d'export s'étend à `grands_defis_termines`, toutes ses colonnes.
7. **Donnée d'enfant minimale** : seulement le fait d'avoir terminé le grand défi d'une matière (quelle matière, quelle
   classe, quel jour). Ni leçons, ni questions, ni réponses, ni erreurs. Rien n'est envoyé à l'IA.

## Options écartées

- **Numéro sentinelle 0 dans `defis_termines`** : refusé par la contrainte ; la changer n'est pas additif.
- **Numéro de la dernière partie** : le grand défi relevé changerait d'identité quand la bibliothèque change (100.15).
- **Colonne « sorte » dans `defis_termines`** : `numero` resterait obligatoire pour un défi sans numéro.
- **Edge Function à part** : même revalidation, même file de révision, même idempotence ; elle dupliquerait le cas
  d'usage.

## Conséquences

- La migration demande le verrou `base`. Aucune table ni fonction existante n'est modifiée ; les défis relevés déjà
  enregistrés ne bougent pas.
- Le déploiement de `terminer-le-defi` suit celui de la migration.
- Motivation lit les grands défis relevés comme les défis relevés, sans rien écrire (décision 0038, point 5).
