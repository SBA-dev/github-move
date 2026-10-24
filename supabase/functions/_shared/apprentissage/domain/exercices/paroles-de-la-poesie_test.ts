import { assertEquals } from "@std/assert";
import type { ExerciceMemoriser } from "../../../catalogue/domain/exercices/memoriser.ts";
import { annonceDeLEcoute, carteDeLaPoesie, invitationApresLeDernierVers } from "./paroles-de-la-poesie.ts";

const vers = ["Vers un", "Vers deux"];
const chanson: ExerciceMemoriser = {
  type: "memoriser",
  titre: "Au clair de la lune",
  auteur: "Chanson traditionnelle",
  vers,
};
const poesie: ExerciceMemoriser = {
  type: "memoriser",
  titre: "Le début de la fable",
  auteur: "Jean de La Fontaine",
  vers,
};

Deno.test("pour une poésie, le personnage guide annonce l'écoute vers par vers puis dit de la redire", () => {
  assertEquals(annonceDeLEcoute(poesie), "Écoute bien, je te le dis vers par vers. Ensuite, à toi de le redire !");
});

Deno.test("pour une chanson, le personnage guide annonce l'écoute vers par vers puis dit de la chanter", () => {
  assertEquals(annonceDeLEcoute(chanson), "Écoute bien, je te le dis vers par vers. Ensuite, à toi de le chanter !");
});

Deno.test("après le dernier vers d'une poésie, le personnage guide invite l'enfant à tout redire", () => {
  assertEquals(
    invitationApresLeDernierVers(poesie),
    "À toi ! Redis tout le texte, tranquillement. Quand c'est bon, on joue !",
  );
});

Deno.test("après le dernier vers d'une chanson, le personnage guide invite l'enfant à tout chanter", () => {
  assertEquals(
    invitationApresLeDernierVers(chanson),
    "À toi ! Chante tout le texte, tranquillement. Quand c'est bon, on joue !",
  );
});

Deno.test("la carte de la poésie porte le titre et l'auteur séparés par un tiret cadratin", () => {
  assertEquals(carteDeLaPoesie(poesie), "Le début de la fable — Jean de La Fontaine");
});

Deno.test("sans auteur, la carte de la poésie porte le titre seul", () => {
  assertEquals(carteDeLaPoesie({ type: "memoriser", titre: "Le début de la fable", vers }), "Le début de la fable");
});
