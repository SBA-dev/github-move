import { E, fenetre, r3 } from "../../celebrations/commun/courbes.ts";

/** Un élément du décor est là un instant après le début de la scène et s'efface vers sa fin. */
export const presenceDuDecor = (t: number, debut: number, duree: number) => r3(fenetre(t, debut, duree) * (1 - fenetre(t, 1.28, .2, E.douce)));
