import type { ReactNode } from "react";
import type { Humeur } from "@domain/motivation";
import { choisir, type DessinDuPersonnage, Yeux } from "./partage.tsx";

function bouche(humeur: Humeur, id: string): ReactNode {
  const bouches: Readonly<Record<Humeur, ReactNode>> = {
    content: (
      <>
        <g transform="translate(0 17)">
          <path d="M-9 0 Q0 9 9 0" fill="none" stroke="#33304A" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g transform="translate(0 17.5) scale(1 0.8)">
          <path d="M-5.5 0 h11 v6 q0 3 -3 3 h-5 q-3 0 -3 -3 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M0 0 V8" stroke="#33304A" strokeWidth="1.4" />
        </g>
      </>
    ),
    reflechit: (
      <>
        <g transform="translate(0 17)">
          <path d="M-6 1 Q-2 -1 0 1 Q2 3 6 1" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </>
    ),
    applaudit: (
      <>
        <g transform="translate(0 17)">
          <g>
          <path d="M-12 0 Q0 22 12 0 Z" fill="#C9475A" />
          <g clipPath={`url(#${id}bouche)`}>
            <ellipse cy="18" rx="8" ry="5" fill="#FF8FA8" />
          </g>
          <path d="M-12 0 Q0 22 12 0 Z" fill="none" stroke="#33304A" strokeWidth="2" strokeLinejoin="round" />
        </g>
        </g>
        <g transform="translate(0 17)">
        <path d="M-5.5 0 h11 v6 q0 3 -3 3 h-5 q-3 0 -3 -3 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M0 0 V8" stroke="#33304A" strokeWidth="1.4" />
        </g>
      </>
    ),
  };
  return bouches[humeur];
}

export const Noisette: DessinDuPersonnage = ({ humeur, id }) => (
  <svg viewBox="-114 -178 175 190" overflow="visible" aria-hidden="true">
    <defs>
      <clipPath id={`${id}oeil`}>
        <ellipse rx="9" ry="11" />
      </clipPath>
      <clipPath id={`${id}bouche`}>
        <path d="M-12 0 Q0 22 12 0 Z" />
      </clipPath>
    </defs>
      <path fill="#F48C3C" stroke="#33304A" strokeWidth="3.4" strokeLinejoin="round" d="M8.7 -39.9 Q12.6 -49.2 5.5 -49.9 Q9.4 -59.1 2.3 -59.8 Q6.2 -69 -1 -69.7 Q-1.6 -79.6 -10 -78.2 Q-10.6 -88.1 -19 -86.7 Q-19.6 -96.6 -28.1 -95.2 Q-33.5 -102.6 -40.7 -96.6 Q-46.1 -104 -53.4 -98 Q-58.8 -105.4 -66 -99.5 Q-73.5 -102.5 -75.8 -93.1 Q-83.3 -96.2 -85.6 -86.8 Q-93.1 -89.9 -95.4 -80.4 Q-101.5 -81 -97.9 -71.7 Q-104 -72.2 -100.4 -62.9 Q-106.5 -63.4 -102.9 -54.1 Q-109 -46.2 -103.6 -36.9 Q-93.3 -33.9 -87.1 -41.8 Q-79.4 -37.7 -81.4 -43.5 Q-73.6 -39.5 -75.7 -45.3 Q-67.9 -41.2 -69.9 -47 Q-65.6 -40.6 -66.3 -46.6 Q-62 -40.2 -62.8 -46.3 Q-58.4 -39.8 -59.2 -45.9 Q-58.5 -38.8 -56 -45.1 Q-55.3 -38 -52.8 -44.3 Q-52.1 -37.2 -49.6 -43.5 Q-51 -37 -44.6 -41.8 Q-46 -35.3 -39.6 -40.1 Q-41 -33.6 -34.6 -38.4 Q-37.1 -31.7 -28.6 -33.6 Q-31.2 -27 -22.7 -28.8 Q-25.2 -22.2 -16.7 -24.1 Z" />
      <path fill="#FFE0BF" d="M-21.1 -50.9 Q-41 -64.2 -51.4 -65.7 Q-61.9 -67.3 -71 -63.8 Q-80.1 -60.4 -86.8 -53.6 L-93.4 -46.7 L-88.4 -42.8L-88.4 -42.8 Q-72 -49.7 -65.8 -49.9 Q-59.7 -50.2 -53.8 -48.9 Q-47.8 -47.6 -39.9 -44.2 L-31.9 -40.9 Z" />
      <path fill="none" stroke="#C9601C" strokeWidth="4" strokeLinecap="round" opacity=".8" d="M-7 -64.1 Q-31.9 -85.9 -48.4 -87.8 Q-64.8 -89.8 -77.8 -82.1 Q-90.8 -74.4 -95.4 -63.2 L-100 -51.9" />
      <path fill="none" stroke="#FFC28A" strokeWidth="3" strokeLinecap="round" d="M-1.5 -33.6 Q-14.4 -57.2 -25.5 -65.8 Q-36.7 -74.5 -50 -76.3 L-63.3 -78" />
      <path fill="none" stroke="#C9601C" strokeWidth="1.4" strokeLinecap="round" opacity=".55" d="M-34.5 -79.7 Q-63.9 -83.4 -75.9 -76.9 Q-87.8 -70.4 -93 -60.4 L-98.1 -50.4 M-17.8 -54 Q-38.8 -69.3 -50.7 -71 Q-62.6 -72.7 -72.6 -68.2 L-82.7 -63.7" />
      <ellipse cx="-17" cy="-5" rx="16" ry="9" fill="#F48C3C" stroke="#33304A" strokeWidth="3" />
      <path d="M-26 -1 q4 3 7 0 M-19 1 q4 3 7 0 M-12 -1 q3 2 6 0" fill="none" stroke="#33304A" strokeWidth="1.5" opacity=".7" />
      <ellipse cx="17" cy="-5" rx="16" ry="9" fill="#F48C3C" stroke="#33304A" strokeWidth="3" />
      <path d="M8 -1 q4 3 7 0 M15 1 q4 3 7 0 M22 -1 q3 2 6 0" fill="none" stroke="#33304A" strokeWidth="1.5" opacity=".7" />
      <path d="M-20 -30 Q-26 -14 -20 -6 Q-12 -2 -8 -8 Q-6 -20 -10 -30 Z" fill="#F48C3C" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
      <path d="M20 -30 Q26 -14 20 -6 Q12 -2 8 -8 Q6 -20 10 -30 Z" fill="#F48C3C" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="0" cy="-50" rx="36" ry="40" fill="#F48C3C" stroke="#33304A" strokeWidth="3.6" />
      <path d="M10 -14 A36 40 0 0 0 34 -62 A30 34 0 0 1 10 -14 Z" fill="#C9601C" />
      <ellipse cx="-1" cy="-42" rx="24" ry="29" fill="#FFE0BF" />
      <ellipse cx="-9" cy="-54" rx="8" ry="11" fill="#FFFFFF" opacity=".6" />
      <ellipse cx="-20" cy="-78" rx="9" ry="5" fill="#FFC28A" opacity=".8" />
      <g transform="translate(0 -118)" data-testid="visage" data-humeur={humeur}>
        <g transform="translate(-30 -34) rotate(-14)">
          <ellipse rx="13" ry="15" fill="#F48C3C" stroke="#33304A" strokeWidth="3" />
          <ellipse cy="1" rx="7" ry="9" fill="#FFB3C7" />
        </g>
        <g transform="translate(30 -34) rotate(14)">
          <ellipse rx="13" ry="15" fill="#F48C3C" stroke="#33304A" strokeWidth="3" />
          <ellipse cy="1" rx="7" ry="9" fill="#FFB3C7" />
        </g>
        <circle r="44" fill="#F48C3C" stroke="#33304A" strokeWidth="3.8" />
        <path d="M12 42 A44 44 0 0 0 42 -12 A36 36 0 0 1 12 42 Z" fill="#C9601C" />
        <path d="M-16 -42 Q0 -50 16 -42 Q10 -30 0 -32 Q-10 -30 -16 -42 Z" fill="#D9772A" />
        <ellipse cx="-18" cy="-24" rx="11" ry="6" fill="#FFC28A" opacity=".85" />
        <g transform="translate(-24 13)">
          <circle r="11.5" fill="#FFC28A" stroke="#33304A" strokeWidth="2.6" />
          <circle cx="-1" cy="1" r="5" fill="#FF8FA8" opacity=".38" />
        </g>
        <g transform="translate(24 13)">
          <circle r="11.5" fill="#FFC28A" stroke="#33304A" strokeWidth="2.6" />
          <circle cx="1" cy="1" r="5" fill="#FF8FA8" opacity=".38" />
        </g>
        <g transform="translate(0 14)">
          <ellipse rx="19" ry="14" fill="#FFE0BF" />
          <ellipse cx="-5" cy="-5" rx="7" ry="3.5" fill="#FFFFFF" opacity=".7" />
        </g>
        {bouche(humeur, id)}
        <g transform="translate(0 4)">
          <ellipse rx="6.5" ry="5" fill="#8B4A1E" stroke="#33304A" strokeWidth="2.2" />
          <ellipse cx="-2" cy="-1.6" rx="2.2" ry="1.3" fill="#FFFFFF" opacity=".75" />
        </g>
        <Yeux>
          <g transform="translate(-16 -9)">
            <ellipse rx="9" ry="11" fill="#FFFFFF" stroke="#E09A5A" strokeWidth="1" />
            <g transform={choisir(humeur, undefined, undefined, "translate(0 -0.1) scale(1.05)")}>
              <circle cx=".5" cy="3" r="5.4" fill="#3E2A1A" />
              <circle cx=".5" cy="3" r="4.4" fill="#6B4226" />
              <circle cx=".5" cy="3" r="2.6" fill="#1B1530" />
              <circle cx="-1.6" cy=".4" r="2" fill="#FFFFFF" />
              <circle cx="2.8" cy="5" r="1" fill="#FFFFFF" />
            </g>
            <g clipPath={`url(#${id}oeil)`}>
              <ellipse rx="11" ry="12" fill="#F48C3C" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, "translate(0 -23)", "translate(0 -16.1)", "translate(0 -23)")} />
            </g>
            <path d="M-8.5 0 A9 11 0 0 1 8.5 0" fill="none" stroke="#33304A" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 10.2 Q0 12 5 10.2" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
            <path d="M-7 -8 l-2.6 -2.4" fill="none" stroke="#33304A" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </Yeux>
        <Yeux>
          <g transform="translate(16 -9)">
            <ellipse rx="9" ry="11" fill="#FFFFFF" stroke="#E09A5A" strokeWidth="1" />
            <g transform={choisir(humeur, undefined, undefined, "translate(0 -0.1) scale(1.05)")}>
              <circle cx=".5" cy="3" r="5.4" fill="#3E2A1A" />
              <circle cx=".5" cy="3" r="4.4" fill="#6B4226" />
              <circle cx=".5" cy="3" r="2.6" fill="#1B1530" />
              <circle cx="-1.6" cy=".4" r="2" fill="#FFFFFF" />
              <circle cx="2.8" cy="5" r="1" fill="#FFFFFF" />
            </g>
            <g clipPath={`url(#${id}oeil)`}>
              <ellipse rx="11" ry="12" fill="#F48C3C" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, "translate(0 -23)", "translate(0 -16.1)", "translate(0 -23)")} />
            </g>
            <path d="M-8.5 0 A9 11 0 0 1 8.5 0" fill="none" stroke="#33304A" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 10.2 Q0 12 5 10.2" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
            <path d="M7 -8 l2.6 -2.4" fill="none" stroke="#33304A" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </Yeux>
        <g transform={choisir(humeur, "translate(-16 -27)", "translate(-16 -25) rotate(-10)", "translate(-16 -31)")}>
          <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#C9601C" strokeWidth="3.6" strokeLinecap="round" />
        </g>
        <g transform={choisir(humeur, "translate(16 -27)", "translate(16 -25) rotate(10)", "translate(16 -31)")}>
          <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#C9601C" strokeWidth="3.6" strokeLinecap="round" />
        </g>
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" d="M-30.2 -67.4Q-32.3 -47.5 -40.4 -34.8" />
      <path fill="none" stroke="#F48C3C" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" d="M-30 -70Q-31.8 -48.2 -40.4 -34.8" />
      <path fill="none" stroke="#C9601C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M-27.9 -58.2Q-30.2 -45.1 -35.6 -35.6" />
      <path fill="none" stroke="#FFC28A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M-34.4 -63Q-36.3 -49.9 -41.4 -40.4" />
      <g transform="translate(-40.4 -34.8) rotate(-156) scale(.82)">
        <path d="M-3.6 -6.4 Q-4 -10.6 -5.7 -14.6 A1.9 1.9 0 0 0 -9.5 -14 Q-8.5 -9.9 -9 -5.6 ZM0.6 -6.1 Q0.7 -10.7 -0.7 -15.2 A1.9 1.9 0 0 0 -4.5 -15 Q-3.9 -10.5 -4.8 -5.9 ZM4.8 -5.9 Q5.3 -10.4 4.5 -15 A1.9 1.9 0 0 0 0.7 -15.2 Q0.7 -10.7 -0.6 -6.1 ZM9 -5.6 Q9.9 -9.7 9.5 -14 A1.9 1.9 0 0 0 5.7 -14.6 Q5.4 -10.4 3.6 -6.4 ZM-5.4 -2 Q-8.3 -4.8 -12.1 -6.4 A1.9 1.9 0 0 0 -14.5 -3.4 Q-11.1 -1.2 -8.6 2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#FFC28A" />
        <path d="M-3.6 -6.4 Q-4 -10.6 -5.7 -14.6 A1.9 1.9 0 0 0 -9.5 -14 Q-8.5 -9.9 -9 -5.6 Z" fill="#FFC28A" />
        <path d="M0.6 -6.1 Q0.7 -10.7 -0.7 -15.2 A1.9 1.9 0 0 0 -4.5 -15 Q-3.9 -10.5 -4.8 -5.9 Z" fill="#FFC28A" />
        <path d="M4.8 -5.9 Q5.3 -10.4 4.5 -15 A1.9 1.9 0 0 0 0.7 -15.2 Q0.7 -10.7 -0.6 -6.1 Z" fill="#FFC28A" />
        <path d="M9 -5.6 Q9.9 -9.7 9.5 -14 A1.9 1.9 0 0 0 5.7 -14.6 Q5.4 -10.4 3.6 -6.4 Z" fill="#FFC28A" />
        <path d="M-5.4 -2 Q-8.3 -4.8 -12.1 -6.4 A1.9 1.9 0 0 0 -14.5 -3.4 Q-11.1 -1.2 -8.6 2 Z" fill="#FFC28A" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#E09A5A" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" d="M30.2 -67.4Q32.3 -47.5 40.4 -34.8" />
      <path fill="none" stroke="#F48C3C" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" d="M30 -70Q31.8 -48.2 40.4 -34.8" />
      <path fill="none" stroke="#C9601C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M34.7 -58.2Q37.1 -45.1 42.4 -35.6" />
      <path fill="none" stroke="#FFC28A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M27.6 -63Q29.5 -49.9 34.6 -40.4" />
      <g transform="translate(40.4 -34.8) rotate(156) scale(.82)">
        <path d="M-3.6 -5.6 Q-2.7 -9.7 -3.1 -14 A1.9 1.9 0 0 0 -6.9 -14.6 Q-7.2 -10.4 -9 -6.4 ZM0.6 -5.9 Q1.1 -10.4 0.3 -15 A1.9 1.9 0 0 0 -3.5 -15.2 Q-3.5 -10.7 -4.8 -6.1 ZM4.8 -6.1 Q4.9 -10.7 3.5 -15.2 A1.9 1.9 0 0 0 -0.3 -15 Q0.3 -10.5 -0.6 -5.9 ZM9 -6.4 Q8.6 -10.6 6.9 -14.6 A1.9 1.9 0 0 0 3.1 -14 Q4.1 -9.9 3.6 -5.6 ZM8.6 2 Q12 -0.1 14.5 -3.4 A1.9 1.9 0 0 0 12.1 -6.4 Q9.2 -3.7 5.4 -2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#FFC28A" />
        <path d="M-3.6 -5.6 Q-2.7 -9.7 -3.1 -14 A1.9 1.9 0 0 0 -6.9 -14.6 Q-7.2 -10.4 -9 -6.4 Z" fill="#FFC28A" />
        <path d="M0.6 -5.9 Q1.1 -10.4 0.3 -15 A1.9 1.9 0 0 0 -3.5 -15.2 Q-3.5 -10.7 -4.8 -6.1 Z" fill="#FFC28A" />
        <path d="M4.8 -6.1 Q4.9 -10.7 3.5 -15.2 A1.9 1.9 0 0 0 -0.3 -15 Q0.3 -10.5 -0.6 -5.9 Z" fill="#FFC28A" />
        <path d="M9 -6.4 Q8.6 -10.6 6.9 -14.6 A1.9 1.9 0 0 0 3.1 -14 Q4.1 -9.9 3.6 -5.6 Z" fill="#FFC28A" />
        <path d="M8.6 2 Q12 -0.1 14.5 -3.4 A1.9 1.9 0 0 0 12.1 -6.4 Q9.2 -3.7 5.4 -2 Z" fill="#FFC28A" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#E09A5A" strokeWidth="2.2" strokeLinecap="round" />
      </g>
  </svg>
);
