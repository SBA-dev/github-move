# 0011 : Courriels de connexion envoyés par une Edge Function, boîte de test en développement

**Statut** : Acceptée · 2026-10-23

## Contexte

La connexion du parent (#5) envoie un courriel avec un lien de connexion et un code de connexion à 6 chiffres. Le serveur d'e-mail fourni par Supabase n'écrit qu'aux membres de l'équipe du projet, deux fois par heure au plus. Les scénarios E2E tournent contre le projet de développement en ligne (décision 0010) avec des adresses fictives (`paul@exemple.test`) : ils doivent pouvoir lire le courriel reçu.

Supabase Auth vérifie lui-même la durée de validité d'un lien ou d'un code (une heure). On ne peut pas avancer son horloge pour tester les scénarios « il y a 59 minutes » et « il y a 61 minutes ».

## Décision

1. **Supabase Auth confie chaque courriel à une Edge Function** (hook « Send Email »). Elle vérifie la signature du hook, puis appelle un cas d'usage qui compose le **courriel de connexion** (texte en français, lien de connexion, code de connexion) par le domaine `famille`.
2. L'envoi passe par un port. Deux adaptateurs :
   - **boîte de test** (projet de développement) : le courriel est rangé dans une table protégée par la RLS, sans aucune policy. Seuls les tests la lisent, avec la clé `service_role` ;
   - **fournisseur européen** (production) : choisi plus tard, avec la mise en ligne (#45).
   L'adaptateur est choisi par une variable d'environnement de la fonction.
3. **Expiration** : pour les scénarios 59 et 61 minutes, le test recule la date d'envoi enregistrée par Supabase Auth, en SQL, sur le projet de développement seulement. C'est le vrai serveur qui décide ensuite si le lien ou le code est encore valable.
4. **Réglages d'Auth versionnés** dans `supabase/config.toml` (durée d'une heure, code à 6 chiffres, adresses de retour, hook) et poussés par `supabase config push`.

## Options écartées

- **Fournisseur SMTP dès maintenant** : demande un compte et une clé tout de suite, et une boîte de réception de test chez un tiers.
- **Lien généré par l'API d'administration dans les tests** : le scénario « reçoit un courriel avec un lien et un code » ne serait plus vérifié.
- **Seulement vérifier la configuration de la durée** : les 4 scénarios d'expiration ne seraient pas exécutés.

## Conséquences

- Le texte du courriel est du code métier testé (Deno.test), pas un modèle dans le tableau de bord de Supabase.
- La boîte de test ne contient que des adresses fictives. Elle ne doit jamais recevoir le courriel d'un vrai parent : en production, l'adaptateur est le fournisseur.
- Pousser la configuration, déployer la fonction et régler son secret modifient le projet partagé : il faut une permission de l'outil.
