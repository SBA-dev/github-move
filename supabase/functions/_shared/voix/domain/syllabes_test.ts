import { assertEquals } from "@std/assert";
import { syllabesDuMot, syllabesDuTexte } from "./syllabes.ts";

Deno.test("« maman » se découpe en deux syllabes, « ma » puis « man »", () => {
  assertEquals(syllabesDuMot("maman"), ["ma", "man"]);
});

Deno.test("un mot de trois lettres ou moins n'est pas découpé", () => {
  assertEquals(["Lis", "le", "mot", "un"].map(syllabesDuMot), [["Lis"], ["le"], ["mot"], ["un"]]);
});

Deno.test("un mot dont la fin est faite de consonnes après la dernière voyelle reste entier, comme « chat » ou « pont »", () => {
  assertEquals(["chat", "pont", "nous", "ours"].map(syllabesDuMot), [["chat"], ["pont"], ["nous"], ["ours"]]);
});

Deno.test("les digrammes « ou », « on », « an » et « ch » restent dans une même syllabe", () => {
  assertEquals(syllabesDuMot("rouler"), ["rou", "ler"]);
  assertEquals(syllabesDuMot("bonnet"), ["bon", "net"]);
  assertEquals(syllabesDuMot("chambre"), ["cham", "bre"]);
  assertEquals(syllabesDuMot("douche"), ["dou", "che"]);
});

Deno.test("une consonne entre deux voyelles ouvre la syllabe suivante", () => {
  assertEquals(syllabesDuMot("lapin"), ["la", "pin"]);
  assertEquals(syllabesDuMot("fromage"), ["fro", "ma", "ge"]);
});

Deno.test("deux consonnes qui se suivent se séparent, sauf un groupe inséparable comme « tr » ou « pl »", () => {
  assertEquals(syllabesDuMot("ballon"), ["bal", "lon"]);
  assertEquals(syllabesDuMot("arbre"), ["ar", "bre"]);
  assertEquals(syllabesDuMot("montrent"), ["mon", "trent"]);
});

Deno.test("les groupes « ch », « ph », « gn », « qu » et « gu » ne se séparent pas", () => {
  assertEquals(syllabesDuMot("affichés"), ["af", "fi", "chés"]);
  assertEquals(syllabesDuMot("phrase"), ["phra", "se"]);
  assertEquals(syllabesDuMot("montagne"), ["mon", "ta", "gne"]);
  assertEquals(syllabesDuMot("quatre"), ["qua", "tre"]);
  assertEquals(syllabesDuMot("guitare"), ["gui", "ta", "re"]);
});

Deno.test("les lettres muettes finales restent dans la dernière syllabe", () => {
  assertEquals(syllabesDuMot("pendant"), ["pen", "dant"]);
  assertEquals(syllabesDuMot("changement"), ["chan", "ge", "ment"]);
  assertEquals(syllabesDuMot("organisées"), ["or", "ga", "ni", "sées"]);
});

Deno.test("les lettres accentuées sont des voyelles", () => {
  assertEquals(syllabesDuMot("journée"), ["jour", "née"]);
  assertEquals(syllabesDuMot("lumière"), ["lu", "miè", "re"]);
  assertEquals(syllabesDuMot("fenêtre"), ["fe", "nê", "tre"]);
});

Deno.test("un mot qui commence par une voyelle commence par une syllabe courte", () => {
  assertEquals(syllabesDuMot("école"), ["é", "co", "le"]);
  assertEquals(syllabesDuMot("abricot"), ["a", "bri", "cot"]);
});

Deno.test("la majuscule est conservée sur la première syllabe", () => {
  assertEquals(syllabesDuMot("Savanturier"), ["Sa", "van", "tu", "rier"]);
  assertEquals(syllabesDuMot("Noisette"), ["Noi", "set", "te"]);
});

Deno.test("recoller les syllabes redonne toujours le mot", () => {
  const mots = ["chocolat", "papillon", "anniversaire", "ordinateur", "Éléphant", "instrument"];

  assertEquals(mots.map((mot) => syllabesDuMot(mot).join("")), mots);
});

// Comportement discutable du legacy, repris tel quel : « y » est une voyelle, donc « ay » ne se coupe pas
Deno.test("legacy : « crayon » n'est pas découpé car « y » compte comme une voyelle", () => {
  assertEquals(syllabesDuMot("crayon"), ["crayon"]);
});

// Comportement discutable du legacy, repris tel quel : l'apostrophe compte comme une consonne
Deno.test("legacy : un mot avec apostrophe est découpé comme un seul mot, l'apostrophe reste collée", () => {
  assertEquals(syllabesDuMot("l'école"), ["l'é", "co", "le"]);
  assertEquals(syllabesDuMot("aujourd'hui"), ["au", "jourd'", "hui"]);
});

Deno.test("un texte se découpe mot par mot en gardant espaces et ponctuation", () => {
  assertEquals(syllabesDuTexte("Lis le mot maman."), [
    { texte: "Lis", syllabes: ["Lis"] },
    { texte: " " },
    { texte: "le", syllabes: ["le"] },
    { texte: " " },
    { texte: "mot", syllabes: ["mot"] },
    { texte: " " },
    { texte: "maman", syllabes: ["ma", "man"] },
    { texte: "." },
  ]);
});

Deno.test("un trait d'union sépare deux mots, chacun découpé à part", () => {
  assertEquals(syllabesDuTexte("arc-en-ciel"), [
    { texte: "arc", syllabes: ["arc"] },
    { texte: "-" },
    { texte: "en", syllabes: ["en"] },
    { texte: "-" },
    { texte: "ciel", syllabes: ["ciel"] },
  ]);
});

Deno.test("une apostrophe (droite ou courbe) reste à l'intérieur du mot", () => {
  assertEquals(syllabesDuTexte("« l’école »"), [
    { texte: "« " },
    { texte: "l’école", syllabes: ["l’é", "co", "le"] },
    { texte: " »" },
  ]);
});

Deno.test("la concaténation des segments redonne le texte", () => {
  const texte = "« Bonjour », dit  Lumi ! 3 + 4 = 7. Écoute : l'ours.";

  assertEquals(syllabesDuTexte(texte).map((segment) => segment.texte).join(""), texte);
});
