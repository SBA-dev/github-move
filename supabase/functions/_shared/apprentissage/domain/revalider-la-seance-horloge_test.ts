import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDHorloge } from "../test_utils/lecons-d-horloge.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { HeureEcriteImpossible, SeanceIncoherente } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { revaliderLaSeance } from "./revalider-la-seance.ts";
import { Seance } from "./seance.ts";

const fin = new Date("2026-10-24T10:30:00Z");
const lecon = () => leconDHorloge("CE1", { mode: "lire", items: [{ heure: "2:15" }] });

function seanceCommenceeSurLHorloge(): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon(),
    ChoixDeSeance.complete(),
  );
}

Deno.test("une séance d'horloge rejouée depuis son envoi retrouve les mêmes erreurs et les mêmes étoiles", () => {
  const seance = seanceCommenceeSurLHorloge();
  seance.repondre(Reponse.heureEcrite(2, 30));
  seance.repondre(Reponse.heureEcrite(14, 15));
  const fait = seance.terminer(fin);

  const rejouee = revaliderLaSeance(lecon(), seance.aEnregistrer());

  assertEquals([rejouee.erreurs, rejouee.etoiles], [fait.erreurs, fait.etoiles]);
  assertEquals(rejouee.erreurs, 1);
});

Deno.test("une heure écrite impossible dans l'envoi rend la séance incohérente", () => {
  const seance = seanceCommenceeSurLHorloge();
  seance.repondre(Reponse.heureEcrite(2, 15));
  seance.terminer(fin);
  const envoi = seance.aEnregistrer();
  const forge = { ...envoi, reponses: [[Reponse.heureEcrite(2, 75), Reponse.heureEcrite(2, 15)]] };

  const erreur = assertThrows(() => revaliderLaSeance(lecon(), forge), SeanceIncoherente);

  assertInstanceOf(erreur.cause, HeureEcriteImpossible);
});

Deno.test("une séance d'horloge au clavier avec « Je ne sais pas » rejouée retrouve les mêmes erreurs et les mêmes étoiles", () => {
  const seance = seanceCommenceeSurLHorloge();
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.heureEcrite(2, 30));
  seance.repondre(Reponse.heureEcrite(2, 15));
  const fait = seance.terminer(fin);

  const rejouee = revaliderLaSeance(lecon(), seance.aEnregistrer());

  assertEquals([rejouee.erreurs, rejouee.etoiles], [fait.erreurs, fait.etoiles]);
  assertEquals(rejouee.erreurs, 1);
});
