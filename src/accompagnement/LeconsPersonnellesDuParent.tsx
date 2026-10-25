import { useId, useState } from "react";
import type { ProfilEnfant } from "@domain/famille";
import { CreerUneLecon } from "./CreerUneLecon.tsx";
import { MesLecons } from "./MesLecons.tsx";

type Onglet = "creer" | "mes-lecons";

const ONGLETS: readonly { readonly cle: Onglet; readonly libelle: string }[] = [
  { cle: "creer", libelle: "Créer une leçon" },
  { cle: "mes-lecons", libelle: "Mes leçons" },
];

type Props = { readonly profils: readonly ProfilEnfant[] };

/** La section « Leçons » de l'espace parent : deux onglets, « Créer une leçon » et « Mes leçons ». */
export function LeconsPersonnellesDuParent({ profils }: Props) {
  const identifiant = useId();
  const [onglet, setOnglet] = useState<Onglet>("creer");
  return (
    <section className="lecons-personnelles-du-parent" aria-label="Leçons personnelles" data-testid="lecons-personnelles-du-parent">
      <div role="tablist" aria-label="Leçons personnelles" className="onglets">
        {ONGLETS.map(({ cle, libelle }) => (
          <button
            key={cle}
            type="button"
            role="tab"
            id={`${identifiant}-${cle}`}
            aria-selected={onglet === cle}
            aria-controls={`${identifiant}-panneau`}
            className={onglet === cle ? undefined : "secondaire"}
            onClick={() => setOnglet(cle)}
          >
            {libelle}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${identifiant}-panneau`} aria-labelledby={`${identifiant}-${onglet}`}>
        {onglet === "creer" ? <CreerUneLecon profils={profils} /> : <MesLecons profils={profils} />}
      </div>
    </section>
  );
}
