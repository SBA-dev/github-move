import { Given, Then, When } from "./fixtures.ts";

// Étapes des scénarios de #16 qui ne se jouent pas encore (périmètre « Cadre seul » arbitré par le PO) :
// répondre à une question de bulles (#17), poser une étiquette du classer (#18), fin de séance (#24),
// réglage du mode dys par le parent (#12). Elles ne simulent aucun comportement : elles échouent clairement
// si le scénario est lancé. Les scénarios concernés sont exclus de l'exécution (voir le rapport de l'E2E).

const DEPEND_DE_17 = "Étape non implémentée : dépend de la story #17 (exercices à choix : répondre à une question).";
const DEPEND_DE_18 = "Étape non implémentée : dépend de la story #18 (classer : poser une étiquette).";
const DEPEND_DE_24 = "Étape non implémentée : dépend de la story #24 (étoiles et fin de séance).";
const DEPEND_DE_12 = "Étape non implémentée : dépend de la story #12 (réglages du parent : mode dys).";

function dependDe(message: string) {
  return async () => {
    throw new Error(message);
  };
}

// --- #17 : répondre à une question de bulles

Given(/^Léa en est à la dernière question de l'exercice « .+ », « .+ »$/, dependDe(DEPEND_DE_17));
Given(/^Léa en est à la dernière question du premier exercice de la séance complète de « .+ »$/, dependDe(DEPEND_DE_17));
Given(/^Léa en est à la question « .+ »$/, dependDe(DEPEND_DE_17));
Given(/^Léa a réussi la question « .+ »$/, dependDe(DEPEND_DE_17));
Given(/^Léa a quitté la séance complète de la leçon « .+ » après \d+ questions réussies$/, dependDe(DEPEND_DE_17));
Given(/^une leçon de test « .+ » a deux exercices bulles, le second sans titre$/, dependDe(DEPEND_DE_17));
When(/^Léa répond « .+$/, dependDe(DEPEND_DE_17));
When(/^Léa donne la bonne réponse$/, dependDe(DEPEND_DE_17));
Then(/^Noisette dit « .+ », « .+ » ou « .+ »$/, dependDe(DEPEND_DE_17));
Then(/^l'exercice « .+ » commence$/, dependDe(DEPEND_DE_17));
Then(/^l'exercice « .+ » n'a pas commencé$/, dependDe(DEPEND_DE_17));
Then(/^le second exercice commence$/, dependDe(DEPEND_DE_17));
Then(/^Noisette n'annonce aucun nouveau défi$/, dependDe(DEPEND_DE_17));
Then(/^la question « .+ » reste posée$/, dependDe(DEPEND_DE_17));
Then(/^les lecteurs d'écran annoncent « .+ », sans couper Noisette$/, dependDe(DEPEND_DE_17));

// --- #18 : poser une étiquette dans une maison

Given(/^Léa joue seulement l'exercice « .+ » de la leçon « .+ »$/, dependDe(DEPEND_DE_18));
Given(/^il ne reste que l'étiquette « .+ » à poser$/, dependDe(DEPEND_DE_18));
When(/^Léa pose l'étiquette « .+ » dans la maison « .+ »$/, dependDe(DEPEND_DE_18));
Then(/^l'exercice « .+ » n'a pas été joué$/, dependDe(DEPEND_DE_18));

// --- #24 : fin de séance

Then(/^la séance est terminée$/, dependDe(DEPEND_DE_24));

// --- #12 : mode dys réglé par le parent

Given(/^Paul a réglé « mode dys » sur « oui » pour Léa$/, dependDe(DEPEND_DE_12));
Then(/^Léa voit le texte de l'étape de leçon dans la bulle de Noisette en mode dys : .+$/, dependDe(DEPEND_DE_12));
Then(/^Léa voit les exemples « .+ », « .+ » et « .+ » en mode dys$/, dependDe(DEPEND_DE_12));
