import { assertEquals } from "@std/assert";
import { accueilDeLaFluence, parolesDeFinDeFluence, SIGNAL_DE_DEPART } from "./paroles-de-fluence.ts";

Deno.test("la fin d'une fluence annonce « 1 calcul réussi ! » au singulier", () => {
  const texte = parolesDeFinDeFluence({ score: 1, issue: "recordInchange", record: 3 });

  assertEquals(texte, "1 calcul réussi ! 1 calcul ! Ton record reste 3. Tu y es presque !");
});

Deno.test("la fin d'une fluence annonce le nombre de calculs réussis au pluriel", () => {
  const texte = parolesDeFinDeFluence({ score: 7, issue: "premierRecord" });

  assertEquals(texte.startsWith("7 calculs réussis ! "), true);
});

Deno.test("un premier record est annoncé avec une invitation à le battre", () => {
  const texte = parolesDeFinDeFluence({ score: 7, issue: "premierRecord" });

  assertEquals(
    texte,
    "7 calculs réussis ! Ton premier record : 7 calculs ! Essaie de le battre la prochaine fois.",
  );
});

Deno.test("un premier record d'un seul calcul s'accorde au singulier", () => {
  const texte = parolesDeFinDeFluence({ score: 1, issue: "premierRecord" });

  assertEquals(
    texte,
    "1 calcul réussi ! Ton premier record : 1 calcul ! Essaie de le battre la prochaine fois.",
  );
});

Deno.test("un nouveau record est félicité", () => {
  const texte = parolesDeFinDeFluence({ score: 8, issue: "nouveauRecord" });

  assertEquals(texte, "8 calculs réussis ! Nouveau record ! 8 calculs, bravo !");
});

Deno.test("un record qui reste est rappelé avec un encouragement", () => {
  const texte = parolesDeFinDeFluence({ score: 4, issue: "recordInchange", record: 9 });

  assertEquals(texte, "4 calculs réussis ! 4 calculs ! Ton record reste 9. Tu y es presque !");
});

Deno.test("un score de 0 ne parle pas de record", () => {
  const texte = parolesDeFinDeFluence({ score: 0, issue: "aucunRecord" });

  assertEquals(texte, "Pas encore de calcul réussi : on réessaie quand tu veux !");
});

Deno.test("l'issue « aucun record » ne dit que l'encouragement, quel que soit le score", () => {
  const texte = parolesDeFinDeFluence({ score: 2, issue: "aucunRecord" });

  assertEquals(texte, "Pas encore de calcul réussi : on réessaie quand tu veux !");
});

Deno.test("l'accueil de la fluence donne la durée et rappelle le record", () => {
  const texte = accueilDeLaFluence({ duree: 45, record: 12 });

  assertEquals(
    texte,
    "Calcul rapide ! Tu as 45 secondes pour réussir le plus de calculs possible. Ton record est de 12. Prêt ?",
  );
});

Deno.test("l'accueil de la fluence sans record ne parle pas de record", () => {
  const texte = accueilDeLaFluence({ duree: 45 });

  assertEquals(texte, "Calcul rapide ! Tu as 45 secondes pour réussir le plus de calculs possible. Prêt ?");
});

Deno.test("le signal de départ de la fluence est « C'est parti ! »", () => {
  assertEquals(SIGNAL_DE_DEPART, "C'est parti !");
});
