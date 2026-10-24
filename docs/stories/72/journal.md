# Journal de la story #72 : connexion du parent par mot de passe

- 2026-10-24 : issue #72 lue (cadrage complet, réponses du PO n°1 à 11 dans l'issue, aucune question ouverte).
- Branche de base : `main` (61d6fc4). Branche de travail imposée par la session : `claude/sleepy-ride-fof2f2`.
- Étape 1 : `domain-modeler` lancé. Nouveaux concepts : Mot de passe du parent (règles), Réinitialisation du mot de passe par prénom d'enfant (beta seulement), essais limités à 5 puis blocage 1 h.
- Étape 1 terminée : domain-model.md, glossaire, context map, décision 0019 (17 questions ouvertes). Étape 2 : po-acceptance lancé.
- Étape 2 terminée : 6 règles, 44 scénarios (69 cas), tag @hors-beta proposé. ⛔ Validation n°1 présentée au PO.
- ⛔ Validation n°1 : le PO répond « OK aux propositions » (22 réponses) :
  1. majuscule accentuée = majuscule ; 2. chiffres et `* - _ .` permis, non spéciaux ; 3. 64 caractères max ; 4. espaces gardés tels quels ; 5. libellés courts ; 6. Edge Function d'inscription qui vérifie les 4 règles et crée le parent (API admin), inscriptions directes fermées ;
  7. confirmation du nouveau mot de passe ; 8. pas de normalisation des tirets/espaces internes/ligatures ; 9. prénom vide ou adresse mal formée refusés sans compter de raté ; 10. un essai pendant le blocage ne le prolonge pas ; 11. un raté s'oublie après 24 h ; 12. essais gardés 24 h après le dernier ; 13. déconnexion des autres appareils après réinitialisation ; 14. le blocage ne bloque pas la connexion ; 15. message fixe ; 16. « Mot de passe oublié » sur l'écran de connexion et sous le message d'identifiants incorrects ;
  17. « Inscription du parent » (domaine) / « Créer ton compte » (écran) ; 18. toujours « essai de réinitialisation » ;
  19. tag `@hors-beta` dès cette story, exclu des commandes de CLAUDE.md ; 20. tests avec `@exemple.test` seulement, preuve Gmail manuelle par le PO ; 21. pas d'E2E « service indisponible » ; 22. pas de mode dys sur les écrans de connexion.
- Questions de po-acceptance (confirmation différente / règles non respectées à la réinitialisation ; prénom fait d'espaces) : le modèle validé les tranche déjà (invariant 10 : entrée invalide ne compte jamais de raté ; `Prenom.de` retire les espaces, donc `PrenomObligatoire`). Signalées au PO, on suit le modèle.
- Questions non bloquantes du domain-modeler (limite d'inscriptions, essais hors export, 72 octets) : propositions retenues, signalées au PO.
- Étape 3 : découpage TDD en 9 comportements (règles, mot de passe, prénom, essais, 3 cas d'usage navigateur, 2 cas d'usage serveur).
- Comportement 1/9 (règles) : RED e008165, GREEN 156be2f, formatage e59bb7d. Suite : 959 verts.
- Comportement 2/9 (MotDePasseDuParent) : RED 4ed7719, GREEN f7f231d. 968 verts.
- Comportement 3/9 (Prenom.correspondA) : RED 43c0a7b, GREEN 8e5768e, refactor c3e4eac (MotDePasseNonConforme). 974 verts.
- Comportement 4/9 (EssaisDeReinitialisation) : RED d5915ee, GREEN 259b193, refactor 9cf3ab5. 987 verts.
- Comportement 5/9 (SeConnecterAvecLeMotDePasse) : RED e2040a2, GREEN 4ed2d5b. 995 verts. Dette : l'adaptateur traduit tout statut < 500 (dont 429) en identifiants incorrects, à cibler au câblage.
- Comportement 6/9 (InscrireLeParentEtSeConnecter) : RED 256c008, GREEN 5a327b0 (adaptateur : Edge Function inscrire-le-parent, 409 → AdresseDejaUtilisee). 1006 verts, lint/fmt/tsc OK (vérifiés par l'orchestrateur, le rapport de l'agent était vide).
- Comportement 7/9 (ReinitialiserLeMotDePasseEtSeConnecter) : RED 69dd13f, GREEN 2bd6954. Contrat HTTP : 401 informations incorrectes, 429 trop d'essais, 422 entrée invalide. 1018 verts.
- Comportement 8/9 (InscrireLeParent serveur) : RED 4e592e3, GREEN 0824777. 1025 verts.
- Comportement 9/9 (ReinitialiserLeMotDePasse serveur) : RED 2616dec, GREEN 1cb559a. 1042 verts. Boucle TDD terminée : 9 cycles, aucune contestation.
- Câblage serveur (implementer) : 1e8595c, 5e66463, 773caeb, 8654d64. Migration `20261024153000_essais_de_reinitialisation` appliquée sur savanturier-dev (version 20261024150000 déjà prise là-bas par `records_de_fluence` d'une autre équipe, absente de main : horodatage décalé), fonctions déployées (`--no-verify-jwt`), Auth réglée (inscriptions publiques fermées, confirmation désactivée, 8 caractères). Essai réel OK (200/409/422/401/401/422, signUp public refusé, réinitialisation « zoe » OK), données d'essai supprimées par identifiant.
- Écart de rôle : getter `dernierRateLe` ajouté au domaine sans test ; tests d'infrastructure non écrits. Rattrapage demandé à test-writer (tests de caractérisation, notés comme tels).
- Tests d'infrastructure (caractérisation) : 5615055, 46 tests, chacun vu échouer en cassant l'assertion. 1085 verts.
- Câblage front : b4e1239 (3 écrans, liste des règles via ReglesDuMotDePasse.verifier, aria-live, 360 px vérifié). Dette : champs lienRefuse/arriveParLeLien de useConnexion inutilisés (code #5, à nettoyer avec #45). Étape 4 : mr-reviewer lancé, base main.
- Review cycle 1 : À CORRIGER. B1 essais parallèles contournent la limite (sécurité) ; B2 boucle de reprise dans le handler, non testée ; B3 étape E2E « invité à me connecter » attend l'ancien bouton (pour e2e-tester) ; B4 429 traduit en identifiants incorrects. Plan : test-writer (B1, B2) puis implementer (B1, B2, B4 + non bloquants 1, 2, 3, 4, 7) ; B3 à l'étape E2E.
- Corrections review n°1 : RED 267cc3b, fix f32f987 (réservation de l'essai avant lecture, reprise dans le cas d'usage, 503), fix c6f9e63 (traduction des refus front, accessibilité). Redéployé ; essai réel : 429 au 6ᵉ, 10 parallèles → compteur 5, aucune ne passe. Non bloquant 4 (taille du corps) laissé en dette. 1092 verts. Review n°2 lancée.
- Review n°2 : À CORRIGER. B1 régression : le registre Supabase ne retire pas la version retenue quand la ligne a disparu (double envoi → 503) ; B2 test manquant 503. Cycle : test-writer c108908 (red), 7e90c9a (caractérisation 503), eed9192 (red 413, dette de la review n°1), assertion resserrée à 5 conflits ; implementer en cours.
- Corrections review n°2 : 42ee6b0 (registre, versions), 32a2b1a (413), f1a47d4, 197ef60, 1401b32. Contestation de l'implementer sur le test content-length (pull initial du runtime Deno) : vérifiée et acceptée par test-writer, test corrigé (b44ccca) pour vérifier bodyUsed. Essai réel : double envoi 401/401, 413 OK. 1098 verts. Review n°3 lancée.
