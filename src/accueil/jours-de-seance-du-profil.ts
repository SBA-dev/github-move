import { Jour } from "@domain/apprentissage";
import { JoursDeSeance } from "@domain/motivation";
import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { joursDesSeancesDeRevisionTermineesPendantLUtilisation } from "../revision/seances-de-revision-terminees-pendant-l-utilisation.ts";
import { seancesTermineesPendantLUtilisation } from "../seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { joursDesRevisionsGardees, seancesGardees } from "./faits-du-jour-du-profil.ts";
import {
  lireLesJoursDesSeancesDeRevisionRecentes,
  lireLesJoursDesSeancesTermineesPourLaSerie,
  NOMBRE_DE_JOURS_LUS_POUR_LA_SERIE,
} from "./lecture-des-seances-du-jour-supabase.ts";

/** Les derniers jours lus au serveur, par profil : ils servent quand une lecture ultérieure échoue (sans réseau). */
const derniersJoursLus = new Map<string, JoursDeSeance>();

/** Les jours de séance que l'appareil connaît en dehors du serveur : séances gardées et séances jouées dans ce navigateur. */
async function joursConnusDeLAppareil(profil: string): Promise<JoursDeSeance> {
  const parent = await parentConnecte();
  const [seances, revisionsGardees] = await Promise.all([seancesGardees(parent, profil), joursDesRevisionsGardees(parent, profil)]);
  return JoursDeSeance.reunir(
    [...seances, ...seancesTermineesPendantLUtilisation(profil)].map(({ jour }) => jour),
    [...revisionsGardees, ...joursDesSeancesDeRevisionTermineesPendantLUtilisation(profil)].map((jour) => Jour.de(jour)),
  );
}

/**
 * Les jours de séance du profil : serveur (séances et séances de révision des 400 derniers jours), séances gardées,
 * séances jouées dans ce navigateur. `undefined` quand le serveur n'a jamais pu être lu pour ce profil : on ne dit rien.
 */
export async function joursDeSeanceDuProfil(profil: string, maintenant: Date): Promise<JoursDeSeance | undefined> {
  const depuis = jourDuNavigateur(maintenant).plus(-NOMBRE_DE_JOURS_LUS_POUR_LA_SERIE).toString();
  const [seancesDuServeur, revisionsDuServeur, deLAppareil] = await Promise.all([
    lireLesJoursDesSeancesTermineesPourLaSerie(profil, maintenant),
    lireLesJoursDesSeancesDeRevisionRecentes(profil, depuis),
    joursConnusDeLAppareil(profil),
  ]);
  if (seancesDuServeur !== undefined && revisionsDuServeur !== undefined) {
    const duServeur = JoursDeSeance.reunir(seancesDuServeur.map((jour) => Jour.de(jour)), revisionsDuServeur.map((jour) => Jour.de(jour)));
    derniersJoursLus.set(profil, duServeur);
  }
  const derniersLus = derniersJoursLus.get(profil);
  return derniersLus && JoursDeSeance.reunir(derniersLus.jours, deLAppareil.jours);
}
