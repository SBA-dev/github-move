import { assertInstanceOf, assertThrows } from "@std/assert";
import { ecrire, leconDeDicteeDuChat, profilDeDictee, seanceDeDictee } from "../../test_utils/lecons-de-dictee.ts";
import { SeanceIncoherente, TirageInvalide } from "../erreurs.ts";
import { revaliderLaSeance } from "../revalider-la-seance.ts";

const LETTRES_DU_MOT = profilDeDictee("lettresDuMot", "CP");

function assertTirageRefuse(tirage: readonly string[], profil = LETTRES_DU_MOT): void {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), profil);
  ecrire(seance, "chat");
  seance.terminer(new Date("2026-10-24T10:30:00Z"));
  const envoi = seance.aEnregistrer();

  const erreur = assertThrows(
    () => revaliderLaSeance(leconDeDicteeDuChat(), { ...envoi, tirages: [tirage] }, profil),
    SeanceIncoherente,
  );
  assertInstanceOf(erreur.cause, TirageInvalide);
}

Deno.test("un tirage sans une lettre du mot rend la séance incohérente", () => {
  assertTirageRefuse(["c", "h", "a", "e", "i", "o"]);
});

Deno.test("un tirage avec une même intruse en double rend la séance incohérente", () => {
  assertTirageRefuse(["c", "h", "a", "t", "e", "e", "i"]);
});

Deno.test("un tirage avec une intruse présente dans le mot rend la séance incohérente", () => {
  assertTirageRefuse(["c", "h", "a", "t", "a", "e", "i"]);
});

Deno.test("un tirage avec une intruse hors de la liste prévue rend la séance incohérente", () => {
  assertTirageRefuse(["c", "h", "a", "t", "z", "e", "i"]);
});

Deno.test("un tirage avec une seule intruse de trop rend la séance incohérente", () => {
  assertTirageRefuse(["c", "h", "a", "t", "e", "i", "o", "u"]);
});

Deno.test("un tirage avec une intruse de moins rend la séance incohérente", () => {
  assertTirageRefuse(["c", "h", "a", "t", "e", "i"]);
});

Deno.test("un tirage vide alors que les lettres du mot sont attendues rend la séance incohérente", () => {
  assertTirageRefuse([]);
});

Deno.test("un tirage de lettres alors que le clavier complet est attendu rend la séance incohérente", () => {
  assertTirageRefuse(["c", "h", "a", "t", "e", "i", "o"], profilDeDictee("clavierComplet", "CP"));
});

Deno.test("un tirage de lettres au CE2 en réglage automatique, où le clavier complet est attendu, est refusé", () => {
  assertTirageRefuse(["c", "h", "a", "t", "e", "i", "o"], profilDeDictee("automatique", "CE2"));
});

Deno.test("un tirage avec une touche en majuscule rend la séance incohérente", () => {
  assertTirageRefuse(["C", "h", "a", "t", "e", "i", "o"]);
});
