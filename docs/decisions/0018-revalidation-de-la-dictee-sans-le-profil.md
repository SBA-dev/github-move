# 0018 : La dictée est revalidée sans relire le profil de l'enfant

**Statut** : Acceptée · 2026-10-24 (décision du PO, #19 n°10). Complète 0016 sans la modifier.

## Contexte

Le clavier proposé pour un mot dicté dépend du réglage « clavier des dictées » (Famille) et du niveau de l'enfant : `automatique` donne les lettres du mot (plus quelques lettres intruses) jusqu'au CE1, le clavier complet à partir du CE2. Le premier modèle de #19 faisait relire ce **profil de séance** par `terminer-la-seance` après la vérification du rattachement (0016), pour revalider le clavier envoyé avec la séance.

Deux constats :
- Le type de clavier ne change **ni la correction ni les étoiles** : le mot est comparé de la même façon quelles que soient les touches proposées. Un clavier « faux » n'apporte aucun gain de triche.
- Une séance faite **hors ligne** (0003) est revalidée à la synchronisation. Si le parent change le réglage ou le niveau entre-temps, un contrôle fondé sur le profil du moment refuserait une séance honnête.

## Décision

1. Le serveur **ne lit plus** le réglage « clavier des dictées » ni le niveau pour revalider une dictée.
2. Il accepte le tirage du clavier d'un mot sous **l'une ou l'autre forme**, chacune validée strictement par le domaine :
   - **lettres du mot** : exactement les lettres à écrire (avec leurs répétitions) et le nombre attendu de lettres intruses, absentes du mot et prises dans la liste prévue ;
   - **clavier complet** : exactement les touches du clavier complet.
   Tout autre tirage rend la séance incohérente et elle est refusée (0013).
3. Le **profil de séance** sert seulement au navigateur, pour choisir le clavier proposé à l'enfant.
4. Le reste de 0013 et 0016 est inchangé : rattachement vérifié avec le JWT de l'appelant, réponses rejouées, écriture par le serveur seul.

## Options écartées

- **Relire le profil et exiger le clavier qu'il donne** : refuse une séance hors ligne honnête quand le réglage ou le niveau change avant la synchronisation, sans protéger les étoiles.
- **Ne pas valider le clavier du tout** : un tirage arbitraire pourrait contenir des touches qui ne permettent pas d'écrire le mot ; la validation stricte de chaque forme garde la séance cohérente.

## Conséquences

- `terminer-la-seance` n'a pas de port de lecture du profil de séance pour la dictée.
- Le domaine expose la vérification d'un tirage de clavier sous ses deux formes, utilisée par le cas d'usage.
- Une séance reste acceptée si le réglage ou le niveau change entre le jeu et la synchronisation.

## Précision

Pour la forme « clavier complet », le point 2 se lit ainsi : le tirage transmis est **vide**. Le domaine reconstruit alors lui-même le clavier complet, qui ne dépend d'aucun tirage ; un tirage non vide est celui des lettres du mot. Le code (`ClavierPropose.depuisTirage`) fait foi.
