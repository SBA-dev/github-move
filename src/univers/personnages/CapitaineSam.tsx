import type { ReactNode } from "react";
import type { Humeur } from "@domain/motivation";
import { choisir, type DessinDuPersonnage, Yeux } from "./partage.tsx";
import { type Ancrage, TenueDerriere, TenueDevant } from "./tenues.tsx";

const CHAUSSURE = (
  <>
    <path fill="#2B2B3A" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-8 -8 Q-10 0 -10 5 Q-10 13 -3 14 Q0 15 3 14 Q10 13 10 5 Q10 0 8 -8 Q0 -10 -8 -8 Z" />
    <path fill="#1B1B28" d="M3 -7 Q8 0 8 5 Q8 11 3 14 Q6 9 5 4 Q4 -2 3 -7 Z" />
    <path d="M-8 9 Q0 13 8 9" fill="none" stroke="#8E8EA6" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
  </>
);

function bouche(humeur: Humeur, id: string): ReactNode {
  const bouches: Readonly<Record<Humeur, ReactNode>> = {
    content: (
      <g transform="scale(1.3)">
        <path d="M-8 0 Q0 8 8 0" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    ),
    reflechit: (
      <g transform="scale(1.3)">
        <path d="M-5 1 Q-2 -1 0 1 Q2 3 5 1" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    ),
    applaudit: (
      <g transform="scale(1.3)">
        <path d="M-11 0 Q0 20 11 0 Z" fill="#C9475A" />
        <g clipPath={`url(#${id}bouche)`} transform="translate(0 -11)">
          <ellipse cy="28" rx="7" ry="4.5" fill="#FF8FA8" />
          <path d="M-11 10.5 Q0 18 11 10.5 Z" fill="#FFFFFF" />
        </g>
        <path d="M-11 0 Q0 20 11 0 Z" fill="none" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
    ),
  };
  return bouches[humeur];
}

const ANCRAGE: Ancrage = {
  cou: { x: 0, y: -41, echelle: 1 },
  dos: { x: 0, y: -16, echelle: 1.15, elargissement: 1.55 },
  pieds: { gauche: { x: -14.7, y: 60, echelle: 1 }, droit: { x: 14.7, y: 60, echelle: 1 }, tige: 24 },
};

export const CapitaineSam: DessinDuPersonnage = ({ humeur, id, tenue }) => (
  <svg viewBox="-82 -137 181 227" overflow="visible" aria-hidden="true">
    <defs>
      <clipPath id={`${id}oeil`}>
        <ellipse rx="7.4" ry="9.6" />
      </clipPath>
      <clipPath id={`${id}bouche`}>
        <path d="M-11 11 Q0 27 11 11 Z" />
      </clipPath>
    </defs>
    <TenueDerriere tenue={tenue} ancrage={ANCRAGE} id={id} />
    <g data-signe="pantalon">
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M-10.3 7.5L-12.6 33.5L-14.7 57.8" />
      <path fill="none" stroke="#26335F" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M-10 4L-12.4 31.9L-14.7 57.8" />
      <path fill="none" stroke="#192448" strokeWidth="5.5" strokeLinecap="round" d="M-1.7 21L-7.7 32.4L-11.9 43.5" transform="translate(-3.4 1.2)" />
      <path fill="none" stroke="#3D4E85" strokeWidth="3" strokeLinecap="round" d="M-11.5 21L-12.4 31.9L-13.4 42.5" transform="translate(3.4 -1.2)" />
      <path fill="none" stroke="#F5D33A" strokeWidth="16.5" strokeLinecap="butt" strokeLinejoin="round" d="M-13.1 39.4L-13.4 42.5" />
      <path fill="none" stroke="#2B2B3A" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" d="M-13.8 47.7L-14.3 52.8L-14.7 57.8" />
      <path fill="none" stroke="#55556A" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M-13.8 47.7L-13.9 48.5" />
      <g transform="translate(-14.7 59.8)">
        {CHAUSSURE}
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M10.3 7.5L12.6 33.5L14.7 57.8" />
      <path fill="none" stroke="#26335F" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M10 4L12.4 31.9L14.7 57.8" />
      <path fill="none" stroke="#192448" strokeWidth="5.5" strokeLinecap="round" d="M11.5 21L12.5 32.4L13.4 43.5" transform="translate(3.4 1.2)" />
      <path fill="none" stroke="#3D4E85" strokeWidth="3" strokeLinecap="round" d="M11.5 21L12.4 31.9L13.4 42.5" transform="translate(-3.4 -1.2)" />
      <path fill="none" stroke="#F5D33A" strokeWidth="16.5" strokeLinecap="butt" strokeLinejoin="round" d="M13.1 39.4L13.4 42.5" />
      <path fill="none" stroke="#2B2B3A" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" d="M13.8 47.7L14.3 52.8L14.7 57.8" />
      <path fill="none" stroke="#55556A" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M13.8 47.7L13.9 48.5" />
      <g transform="translate(14.7 59.8)">
        {CHAUSSURE}
      </g>
      <path fill="#26335F" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-22 -1 Q0 2 22 -1 L23 12 Q10.5 15 2.5 11 Q0 8 -2.5 11 Q-10.5 15 -23 12 Z" />
      <path fill="#192448" d="M4.2 5 Q22 0 23 12 Q12.6 15 3.2 11 Z" />
    </g>
    <g data-signe="veste-rouge">
      <path fill="#d23a2a" stroke="#33304A" strokeWidth="3.4" strokeLinejoin="round" d="M-18 -40 Q-24 -12 -22 4 Q0 8 22 4 Q24 -12 18 -40 Q0 -47 -18 -40 Z" />
      <path fill="#A82818" d="M5.4 -42 Q21 -30 22 3 Q13 6 7.4 5 Q19 -20 5.4 -42 Z" />
      <path fill="#EE6A58" d="M-16.2 -36 Q-7.2 -42 1.8 -40 Q-7.2 -37 -14.4 -30 Z" />
      <g data-signe="bandes">
        <path fill="#F5D33A" stroke="#33304A" strokeWidth="2" strokeLinejoin="round" d="M-21.6 -7 Q0 -4 21.6 -7 L22.2 0 Q0 3.6 -22.2 0 Z" />
        <path fill="none" stroke="#E9EEF3" strokeWidth="2.2" strokeLinecap="round" d="M-20.6 -3.6 Q0 -0.4 20.6 -3.6" />
      </g>
      <path fill="none" stroke="#A82818" strokeWidth="2" strokeLinecap="round" d="M4 -42 V-8 M4 1 V5" />
      <rect x="2.2" y="-33" width="3.6" height="6" rx="1.2" fill="#C8D2E6" stroke="#33304A" strokeWidth="1.2" />
    </g>
    <path fill="#f3c9a5" stroke="#33304A" strokeWidth="3" d="M-5.5 -52 V-38 H5.5 V-52 Z" />
    <path d="M-5.5 -52 V-44 Q0 -42 5.5 -44 V-52 Z" fill="#E2AE84" />
    <path fill="#d23a2a" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" d="M-8 -51 Q0 -54 8 -51 L9 -42 Q0 -38 -9 -42 Z" />
    <g transform="translate(0 -48)">
      <g transform="translate(0 -26) scale(.7)">
        <circle cx="0" cy="-6" r="41" fill="#a8461c" />
        <circle r="40" fill="#f3c9a5" stroke="#33304A" strokeWidth="4.6" />
        <path d="M10 38 A40 40 0 0 0 38 -12 A33 33 0 0 1 10 38 Z" fill="#E2AE84" />
        <ellipse cx="-16" cy="-20" rx="10" ry="5" fill="#FFE6CF" opacity=".9" />
        <g transform="translate(-39 4)">
          <circle r="7.5" fill="#f3c9a5" stroke="#33304A" strokeWidth="3.6" />
          <circle r="2.8" fill="#E2AE84" />
        </g>
        <g transform="translate(39 4)">
          <circle r="7.5" fill="#f3c9a5" stroke="#33304A" strokeWidth="3.6" />
          <circle r="2.8" fill="#E2AE84" />
        </g>
        <ellipse cx="-22" cy="15" rx="7" ry="4.5" fill="#FF8FA8" opacity=".5" />
        <ellipse cx="22" cy="15" rx="7" ry="4.5" fill="#FF8FA8" opacity=".5" />
        <g transform="translate(0 20)">
          {bouche(humeur, id)}
        </g>
        <g transform="translate(0 8)">
          <circle cy="3" r="3.8" fill="#E9A77A" stroke="#33304A" strokeWidth="2.6" />
          <circle cx="-1.2" cy="-1.2" r="1.3" fill="#FFD9BC" />
        </g>
        <g fill="#D98A5E" opacity=".7">
          <circle cx="-24" cy="6" r="1.4" />
          <circle cx="-19" cy="9" r="1.2" />
          <circle cx="-26" cy="11" r="1.1" />
          <circle cx="24" cy="6" r="1.4" />
          <circle cx="19" cy="9" r="1.2" />
          <circle cx="26" cy="11" r="1.1" />
        </g>
        <g transform="scale(1.3)" data-testid="visage" data-humeur={humeur}>
          <Yeux>
            <g transform="translate(-12 0)">
              <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" stroke="#E2AE84" strokeWidth="1" />
              <g transform={choisir(humeur, { content: undefined, reflechit: undefined, applaudit: "translate(0 -0.1) scale(1.05)" })}>
                <circle cx=".5" cy="3" r="4.8" fill="#6F6A30" />
                <circle cx=".5" cy="3" r="2.5" fill="#1B1530" />
                <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
              </g>
              <g clipPath={`url(#${id}oeil)`}>
                <ellipse rx="10" ry="10.6" fill="#f3c9a5" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, { content: "translate(0 -21)", reflechit: "translate(0 -14.7)", applaudit: "translate(0 -21)" })} />
              </g>
              <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
            </g>
          </Yeux>
          <Yeux>
            <g transform="translate(12 0)">
              <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" stroke="#E2AE84" strokeWidth="1" />
              <g transform={choisir(humeur, { content: undefined, reflechit: undefined, applaudit: "translate(0 -0.1) scale(1.05)" })}>
                <circle cx=".5" cy="3" r="4.8" fill="#6F6A30" />
                <circle cx=".5" cy="3" r="2.5" fill="#1B1530" />
                <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
              </g>
              <g clipPath={`url(#${id}oeil)`}>
                <ellipse rx="10" ry="10.6" fill="#f3c9a5" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, { content: "translate(0 -21)", reflechit: "translate(0 -14.7)", applaudit: "translate(0 -21)" })} />
              </g>
              <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
            </g>
          </Yeux>
        </g>
        <g transform={choisir(humeur, { content: "translate(-15.6 -17)", reflechit: "translate(-15.6 -15) rotate(-10)", applaudit: "translate(-15.6 -21)" })}>
          <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#7E3212" strokeWidth="4.2" strokeLinecap="round" />
        </g>
        <g transform={choisir(humeur, { content: "translate(15.6 -17)", reflechit: "translate(15.6 -15) rotate(10)", applaudit: "translate(15.6 -21)" })}>
          <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#7E3212" strokeWidth="4.2" strokeLinecap="round" />
        </g>
        <path fill="#a8461c" stroke="#33304A" strokeWidth="3.6" strokeLinejoin="round" d="M-43 -30 Q-46 -15 -39 -8 Q-34 -10 -32 -18 Q-30 -24 -30 -30 Z M43 -30 Q46 -15 39 -8 Q34 -10 32 -18 Q30 -24 30 -30 Z" />
        <path fill="none" stroke="#CC6A3C" strokeWidth="2.6" strokeLinecap="round" d="M-37 -10 Q-37 -20 -34 -26" />
        <path fill="#a8461c" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-22 -31 Q-20 -21 -13 -24 Q-9 -18 -3 -24 Q2 -19 7 -25 Q13 -21 16 -30 Z" />
        <g data-signe="casque-de-pompier">
          <path d="M-52 -26 Q0 -44 52 -26 Q56 -19 46 -18 Q0 -32 -46 -18 Q-56 -19 -52 -26 Z" fill="#D49E17" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M-42 -28 Q-45 -78 0 -82 Q45 -78 42 -28 Q0 -38 -42 -28 Z" fill="#F2C230" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
          <path d="M16 -78 Q40 -68 40 -32 Q28 -36 16 -37 Z" fill="#D49E17" />
          <path d="M-32 -54 Q-22 -72 -6 -74 Q-20 -66 -26 -50 Z" fill="#FFE27A" />
          <path d="M-5 -81 Q0 -87 5 -81 L5 -66 H-5 Z" fill="#FFE27A" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M-47 -30 Q0 -44 47 -30 Q0 -22 -47 -30 Z" fill="#D49E17" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" />
          <g data-signe="ecusson">
            <path d="M-10 -66 H10 V-56 Q10 -47 0 -43 Q-10 -47 -10 -56 Z" fill="#C2341B" stroke="#33304A" strokeWidth="2.2" strokeLinejoin="round" />
            <g data-signe="goutte-d-eau">
              <path d="M0 -62 Q4.5 -55.5 4.5 -53 A4.5 4.5 0 0 1 -4.5 -53 Q-4.5 -55.5 0 -62 Z" fill="#FFFFFF" />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g data-signe="bras">
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M18.2 -33.5L19 -26.1L20.2 -19L21.8 -12.2L24 -5.8L26.6 0.4L29.6 6.2" />
      <path fill="none" stroke="#f3c9a5" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M18 -38L18.5 -29.7L19.6 -21.8L21.3 -14.2L23.5 -7L26.3 -0.2L29.6 6.2" />
      <path fill="none" stroke="#E2AE84" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M27.5 2.4L28.2 3.7L29 5.1" transform="translate(3.2 1.4)" />
      <path fill="none" stroke="#FFE6CF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M27.5 2.4L28.1 3.5L28.8 4.7" transform="translate(-3.2 -1.4)" />
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M18.1 -36L18.6 -29.2L19.5 -22.7L20.7 -16.4L22.4 -10.4L24.4 -4.7L26.8 0.8" />
      <path fill="none" stroke="#d23a2a" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" d="M18 -38L18.4 -30.8L19.3 -23.9L20.5 -17.3L22.2 -11L24.3 -4.9L26.8 0.8" />
      <path fill="none" stroke="#A82818" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M18.1 -35L18.8 -27.7L19.8 -20.7L21.3 -14L23.3 -7.6L25.7 -1.6" transform="translate(3.6 1)" />
      <path fill="none" stroke="#F5D33A" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M21.3 -14.2L21.9 -12L22.6 -9.8" />
      <path fill="none" stroke="#E9EEF3" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M21.8 -12.5L22.1 -11.5" />
      <path fill="none" stroke="#A82818" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M26.2 -0.4L26.8 0.8" />
      <g transform="translate(29.6 6.2) rotate(158) scale(.86)">
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 ZM0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 ZM4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 ZM9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 ZM8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#f3c9a5" />
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 Z" fill="#f3c9a5" />
        <path d="M0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 Z" fill="#f3c9a5" />
        <path d="M4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 Z" fill="#f3c9a5" />
        <path d="M9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 Z" fill="#f3c9a5" />
        <path d="M8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="#f3c9a5" />
        <path d="M-5.8 -9 l0.6 -4M-1.9 -9 l0.2 -4M1.9 -9 l-0.2 -4M5.8 -9 l-0.6 -4" fill="none" stroke="#E2AE84" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#E2AE84" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M-18.2 -33.5L-19 -26.1L-20.2 -19L-21.8 -12.2L-24 -5.8L-26.6 0.4L-29.6 6.2" />
      <path fill="none" stroke="#f3c9a5" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38L-18.5 -29.7L-19.6 -21.8L-21.3 -14.2L-23.5 -7L-26.3 -0.2L-29.6 6.2" />
      <path fill="none" stroke="#E2AE84" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M-27.5 2.4L-28.2 3.7L-29 5.1" transform="translate(-3.2 1.4)" />
      <path fill="none" stroke="#FFE6CF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M-27.5 2.4L-28.1 3.5L-28.8 4.7" transform="translate(3.2 -1.4)" />
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M-18.1 -36L-18.6 -29.2L-19.5 -22.7L-20.7 -16.4L-22.4 -10.4L-24.4 -4.7L-26.8 0.8" />
      <path fill="none" stroke="#d23a2a" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38L-18.4 -30.8L-19.3 -23.9L-20.5 -17.3L-22.2 -11L-24.3 -4.9L-26.8 0.8" />
      <path fill="none" stroke="#A82818" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M-18.1 -35L-18.8 -27.7L-19.8 -20.7L-21.3 -14L-23.3 -7.6L-25.7 -1.6" transform="translate(-3.6 1)" />
      <path fill="none" stroke="#F5D33A" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M-21.3 -14.2L-21.9 -12L-22.6 -9.8" />
      <path fill="none" stroke="#E9EEF3" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M-21.8 -12.5L-22.1 -11.5" />
      <path fill="none" stroke="#A82818" strokeWidth="17" strokeLinecap="butt" strokeLinejoin="round" d="M-26.2 -0.4L-26.8 0.8" />
      <g transform="translate(-29.6 6.2) rotate(-158) scale(.86)">
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 ZM0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 ZM4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 ZM9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 ZM-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#f3c9a5" />
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 Z" fill="#f3c9a5" />
        <path d="M0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 Z" fill="#f3c9a5" />
        <path d="M4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 Z" fill="#f3c9a5" />
        <path d="M9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 Z" fill="#f3c9a5" />
        <path d="M-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="#f3c9a5" />
        <path d="M-6.8 -9 l-0.6 -4M-2.3 -9 l-0.2 -4M2.3 -9 l0.2 -4M6.8 -9 l0.6 -4" fill="none" stroke="#E2AE84" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#E2AE84" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </g>
    <TenueDevant tenue={tenue} ancrage={ANCRAGE} id={id} />
  </svg>
);
