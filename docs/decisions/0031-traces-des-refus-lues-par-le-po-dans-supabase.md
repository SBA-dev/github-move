# 0031 : Les traces des refus sont lues par le PO dans le tableau de bord Supabase

**Statut** : Acceptée · 2026-10-25 (réponse du PO sur #103)

## Contexte

#103 trace les saisies du parent refusées par la vérification des contenus (décisions 0028 à 0030), sans garder le texte refusé (RGPD). Une trace n'a de raison d'être que si quelqu'un la lit. Le PO, qui administre l'application, les lira. Or le **parent** est le seul rôle adulte de l'application : il n'y a ni rôle ni écran d'administration.

## Décision

1. Le PO lit les traces des refus dans le **tableau de bord du projet Supabase** (éditeur de table, ou une requête enregistrée), avec son compte de propriétaire du projet.
2. **Aucun rôle d'administration** n'est ajouté à l'application, et aucun écran. Le parent reste le seul rôle adulte.
3. Dans l'application, la RLS de la table des traces ne laisse un parent lire que **ses propres** refus (droit d'accès et d'export). Aucune clé `service_role` n'est utilisée par le front.
4. Les traces respectent la minimisation : date, parent, type de saisie, nombre de refus ; jamais le texte ni le terme refusé, ni une donnée de l'enfant ; suppression automatique après 90 jours ; suppression avec le compte du parent.

## Conséquences

- Rien de plus à sécuriser dans l'application. L'accès du PO dépend de la sécurité de son compte Supabase (authentification à deux facteurs conseillée).
- L'information des parents (politique de confidentialité, quand elle sera rédigée) mentionne ces traces, leur durée et qui les lit.
- Si un écran d'administration devient nécessaire, une nouvelle décision et une story le créeront.
