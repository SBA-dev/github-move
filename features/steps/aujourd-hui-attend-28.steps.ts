import { Given, When } from "./fixtures.ts";

// Story #29 : étapes des scénarios « @depend-de-28 ». La story #28 (révisions des erreurs) n'est pas encore mergée :
// ces étapes échouent clairement. À SUPPRIMER (ce fichier entier) au merge de #28, dont les steps les remplacent,
// puis à vérifier avec la bibliothèque de test de l'accueil (features/support/bibliotheque-de-l-accueil.ts).

function dependDe28(mecanique: string): never {
  throw new Error(`Étape non implémentée : dépend de la story #28 (${mecanique}).`);
}

Given(/^Léa a (\d+) questions? dues? de la leçon « ([^«»]+) »$/, { tags: "@issue-29" }, ({}, _nombre: string, _titre: string) => dependDe28("file de révision"));
Given(/^Léa a pour questions retenues de la leçon « ([^«»]+) » :$/, { tags: "@issue-29" }, ({}, _titre: string, _tableau: unknown) => dependDe28("file de révision"));
Given(/^Léa a fait la séance de révision, en répondant juste à toutes les questions$/, { tags: "@issue-29" }, () => dependDe28("séance de révision"));
When(/^Léa revient à son accueil le lendemain$/, { tags: "@issue-29" }, () => dependDe28("horloge du navigateur"));
When(/^Léa choisit son profil enfant sur le téléphone de Marie$/, { tags: "@issue-29" }, () => dependDe28("téléphone de Marie"));
