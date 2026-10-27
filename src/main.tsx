import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./Application.tsx";
import { enregistrerLeServiceWorker } from "./installation/index.ts";
import "@fontsource/andika/latin-400.css";
import "@fontsource/andika/latin-700.css";
import "@fontsource/baloo-2/latin-700.css";
import "./styles.css";

const racine = document.getElementById("racine");
if (!racine) throw new Error("Élément #racine introuvable dans index.html");

createRoot(racine).render(
  <StrictMode>
    <Application />
  </StrictMode>,
);

enregistrerLeServiceWorker();
