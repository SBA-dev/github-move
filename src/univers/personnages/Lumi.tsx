import type { ReactNode } from "react";
import type { Humeur } from "@domain/motivation";
import { choisir, type DessinDuPersonnage, Yeux } from "./partage.tsx";

const CHAUSSURE = (
  <>
    <path d="M-10 -4 Q-12 6 -2 8 H6 Q14 8 12 1 Q10 -6 2 -7 Q-6 -8 -10 -4 Z" fill="#C86BD6" stroke="#33304A" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M-6 -4 Q0 -1 6 -4" fill="none" stroke="#33304A" strokeWidth="1.2" opacity=".6" />
    <path d="M0 -6 l-3 -3 l3 1 l3 -1 Z" fill="#FFC93C" stroke="#33304A" strokeWidth="1" />
  </>
);

function bouche(humeur: Humeur, id: string): ReactNode {
  const bouches: Readonly<Record<Humeur, ReactNode>> = {
    content: (
      <>
        <g transform="translate(0 18)">
          <path d="M-8 0 Q0 8 8 0" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </>
    ),
    reflechit: (
      <>
        <g transform="translate(0 18)">
          <path d="M-5 1 Q-2 -1 0 1 Q2 3 5 1" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </>
    ),
    applaudit: (
      <>
        <g transform="translate(0 18)">
          <g>
          <path d="M-11 0 Q0 20 11 0 Z" fill="#C9475A" />
          <g clipPath={`url(#${id}bouche)`}>
            <ellipse cy="17" rx="7" ry="4.5" fill="#FF8FA8" />
            <path d="M-11 -.5 Q0 7 11 -.5 Z" fill="#FFFFFF" />
          </g>
          <path d="M-11 0 Q0 20 11 0 Z" fill="none" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
        </g>
      </>
    ),
  };
  return bouches[humeur];
}

export const Lumi: DessinDuPersonnage = ({ humeur, id }) => (
  <svg viewBox="-98 -216 192 240" overflow="visible" aria-hidden="true">
    <defs>
      <clipPath id={`${id}oeil`}>
        <ellipse rx="9" ry="11" />
      </clipPath>
      <clipPath id={`${id}bouche`}>
        <path d="M-11 0 Q0 20 11 0 Z" />
      </clipPath>
        <linearGradient id={`${id}aile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset="1" stopColor="#9CCFFF" stopOpacity=".6" />
        </linearGradient>
    </defs>
      <g data-signe="ailes">
      <g transform="translate(-12 -104) scale(0.94 1)">
        <path d="M0 0 Q-18 -34 -44 -40 Q-58 -36 -50 -18 Q-42 -4 -12 2 Q-44 6 -48 22 Q-44 36 -26 32 Q-8 26 0 8 Z" fill={`url(#${id}aile)`} stroke="#9CCFFF" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M-6 -2 Q-26 -22 -42 -30 M-8 6 Q-26 14 -38 22" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      </g>
      <g transform="translate(12 -104) scale(0.94 1)">
        <path d="M0 0 Q18 -34 44 -40 Q58 -36 50 -18 Q42 -4 12 2 Q44 6 48 22 Q44 36 26 32 Q8 26 0 8 Z" fill={`url(#${id}aile)`} stroke="#9CCFFF" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M6 -2 Q26 -22 42 -30 M8 6 Q26 14 38 22" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      </g>
      </g>
      <g transform="translate(0 -150) translate(0 150)">
        <path fill="#f7cc4f" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-42 -150 Q-46 -192 -22 -200 Q-10 -206 0 -200 Q10 -206 22 -200 Q46 -192 42 -150 Q44 -126 32 -116 Q0 -124 -32 -116 Q-44 -126 -42 -150 Z" />
        <path fill="#f7cc4f" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" d="M-39.9 -178.7 Q-55.4 -153.9 -62 -145.9 Q-68.6 -137.9 -71.1 -128.5 Q-73.6 -119.1 -76.1 -110.8 Q-78.6 -102.4 -79.9 -94.8 L-81.2 -87.1 Q-78.7 -81.7 -76.2 -86.3L-76.2 -86.3 Q-73.9 -100.6 -67.5 -106.7 Q-61.1 -112.9 -56.9 -120.2 Q-52.7 -127.5 -45.4 -133.9 Q-38.1 -140.4 -29.1 -152.8 L-20.1 -165.3 Z" />
        <path fill="none" stroke="#D9A92C" strokeWidth="1.4" strokeLinecap="round" d="M-43 -144.2 Q-57.1 -130.4 -60.9 -122.5 Q-64.6 -114.6 -69.9 -107.9 L-75.2 -101.1" />
        <path fill="none" stroke="#FFE992" strokeWidth="2.2" strokeLinecap="round" d="M-34 -174.7 Q-50.2 -149.8 -57 -142.3 L-63.8 -134.8" />
        <path fill="#f7cc4f" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" d="M-33.6 -175.2 Q-41.3 -142.8 -45 -132.9 Q-48.7 -122.9 -49 -113 Q-49.2 -103 -49.9 -94.5 Q-50.7 -86 -50.9 -78.2 L-51 -70.5 Q-48.5 -65.5 -46 -70.4L-46 -70.4 Q-45.8 -85 -40.7 -92.4 Q-35.6 -99.8 -33.5 -108.8 Q-31.5 -117.7 -26 -126.6 Q-20.6 -135.6 -15.5 -152.2 L-10.4 -168.8 Z" />
        <path fill="none" stroke="#D9A92C" strokeWidth="1.4" strokeLinecap="round" d="M-26.4 -137.6 Q-36.3 -119.1 -37.8 -109.9 Q-39.4 -100.7 -43.3 -93 L-47.2 -85.3" />
        <path fill="none" stroke="#FFE992" strokeWidth="2.2" strokeLinecap="round" d="M-26.6 -173.3 Q-35.1 -140.6 -39.3 -131 L-43.5 -121.3" />
        <path fill="#f7cc4f" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" d="M-10 -171.9 Q-8.5 -140.7 -10.2 -130.9 Q-11.8 -121.2 -10.3 -112.1 Q-8.7 -103 -8.8 -94.5 Q-8.9 -86.1 -8.4 -78.5 L-8 -70.8 Q-5.5 -65.9 -3 -71.1L-3 -71.1 Q-3.9 -85.7 -0.3 -93.9 Q3.2 -102.1 3.7 -110.9 Q4.1 -119.8 6.8 -129.6 Q9.4 -139.3 9.7 -155.7 L10 -172.1 Z" />
        <path fill="none" stroke="#D9A92C" strokeWidth="1.4" strokeLinecap="round" d="M4.4 -139.7 Q-0.3 -120.2 -0.2 -111.2 Q-0.1 -102.3 -2.7 -94.1 L-5.3 -85.8" />
        <path fill="none" stroke="#FFE992" strokeWidth="2.2" strokeLinecap="round" d="M-4 -171.9 Q-3.1 -140.3 -5.1 -130.5 L-7 -120.7" />
        <path fill="#f7cc4f" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" d="M10.5 -168.7 Q21.2 -135.3 27.3 -126.6 Q33.4 -117.9 36.1 -109.1 Q38.7 -100.4 44.3 -93.3 Q49.9 -86.2 50.5 -79 L51.1 -71.7 Q53.6 -66.9 56.1 -72.2L56.1 -72.2 Q54.7 -87.5 53.4 -96 Q52.1 -104.5 51.2 -114.4 Q50.3 -124.3 46 -133.8 Q41.7 -143.3 37.6 -159.3 L33.5 -175.3 Z" />
        <path fill="none" stroke="#D9A92C" strokeWidth="1.4" strokeLinecap="round" d="M36 -141.1 Q45.5 -122.5 46.9 -112.9 Q48.3 -103.3 50.8 -95.2 L53.3 -87.2" />
        <path fill="none" stroke="#FFE992" strokeWidth="2.2" strokeLinecap="round" d="M17.4 -170.7 Q27.3 -137.7 32.9 -128.8 L38.5 -119.8" />
        <path fill="#f7cc4f" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" d="M20 -165.4 Q37.6 -140.4 44.5 -133.7 Q51.4 -127 55.2 -119.5 Q59 -112 65.1 -105.5 Q71.2 -99.1 72 -91.9 L72.8 -84.7 Q75.3 -80 77.7 -85.3L77.7 -85.3 Q75.9 -100.7 73.9 -109.1 Q71.8 -117.6 69.8 -127.1 Q67.8 -136.6 61.6 -145 Q55.3 -153.5 47.7 -166 L40 -178.6 Z" />
        <path fill="none" stroke="#D9A92C" strokeWidth="1.4" strokeLinecap="round" d="M50.4 -149.8 Q63.2 -133.9 65.7 -125 Q68.2 -116 71.4 -108.1 L74.6 -100.2" />
        <path fill="none" stroke="#FFE992" strokeWidth="2.2" strokeLinecap="round" d="M26 -169.4 Q42.9 -144.3 49.6 -137.1 L56.3 -129.9" />
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" d="M-10.2 -37.5Q-11.9 -18 -12 -2.1" />
      <path fill="none" stroke="#EBD9F7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" d="M-10 -40Q-11.8 -18.9 -12 -2.1" />
      <path fill="none" stroke="#CDB3E3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M-8.1 -26.8Q-9 -15 -9.2 -4.5" />
      <g transform="translate(-12 1.9) rotate(-71.2)">
        {CHAUSSURE}
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" d="M10.2 -37.5Q11.9 -18 12 -2.1" />
      <path fill="none" stroke="#EBD9F7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" d="M10 -40Q11.8 -18.9 12 -2.1" />
      <path fill="none" stroke="#CDB3E3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M13.7 -26.8Q14.6 -15 14.8 -4.5" />
      <g transform="translate(12 1.9) rotate(71.2)">
        {CHAUSSURE}
      </g>
      <g data-signe="robe-rose-aux-genoux">
      <path fill="#E07AA0" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-22 -80 Q-50 -52 -48 -30 Q0 -20 48 -30 Q50 -52 22 -80 Z" transform="translate(0 -82) skewX(0) translate(0 82)" />
      <path fill="#ff9cbc" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-22 -82 Q-46 -56 -46 -34 Q-34.5 -24 -23 -34 Q-11.5 -24 0 -34 Q11.5 -24 23 -34 Q34.5 -24 46 -34 Q46 -56 22 -82 Z" transform="translate(0 -82) skewX(0) translate(0 82)" />
      <path fill="#D96A90" opacity=".9" d="M-11.9 -80 Q-16.1 -56 -30 -33 Q-23 -30 -17 -33 Q-17.2 -56 -7.9 -80 Z M-2 -80 Q0 -56 -7 -33 Q0 -30 6 -33 Q0 -56 2 -80 Z M7.9 -80 Q16.1 -56 16 -33 Q23 -30 29 -33 Q17.3 -56 11.9 -80 Z" transform="translate(0 -82) skewX(0) translate(0 82)" />
      <path fill="#FFC4D6" opacity=".9" d="M-17.2 -76 Q-42.5 -58 -41.5 -44 Q-36.5 -46 -33.5 -48 Q-36.5 -60 -11.2 -76 Z M-8.4 -76 Q-19.5 -58 -18.5 -44 Q-13.5 -46 -10.5 -48 Q-13.5 -60 -2.4 -76 Z" transform="translate(0 -82) skewX(0) translate(0 82)" />
      <path fill="none" stroke="#E07AA0" strokeWidth="2" strokeLinecap="round" opacity=".7" d="M-9.9 -79 Q-16.6 -56 -24 -36 M0 -79 Q0 -56 -1 -36 M9.9 -79 Q16.6 -56 22 -36" transform="translate(0 -82) skewX(0) translate(0 82)" />
      <path fill="#ff9cbc" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-20 -108 Q-24 -94 -22 -80 H22 Q24 -94 20 -108 Q0 -112 -20 -108 Z" />
      <path fill="#E07AA0" d="M8 -108 Q22 -96 22 -80 H11 Q12 -96 8 -108 Z" />
      <path fill="none" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" d="M-20 -82 Q0 -76 20 -82" />
      <path fill="#ffd9b8" stroke="#33304A" strokeWidth="2.4" d="M-9 -109 Q0 -100 9 -109 Q0 -113 -9 -109 Z" />
      <g transform="translate(0 -94)">
        <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill="#FFC93C" stroke="#33304A" strokeWidth="1.2" />
      </g>
      </g>
      <path d="M-6 -118 V-104 H6 V-118 Z" fill="#ffd9b8" stroke="#33304A" strokeWidth="2.6" />
      <g transform="translate(0 -150)" data-testid="visage" data-humeur={humeur}>
        <circle r="40" fill="#ffd9b8" stroke="#33304A" strokeWidth="3.6" />
        <path d="M10 38 A40 40 0 0 0 38 -12 A33 33 0 0 1 10 38 Z" fill="#E8B48C" />
        <ellipse cx="-16" cy="-22" rx="10" ry="5" fill="#FFF0E0" opacity=".9" />
        <g transform="translate(-39 2)">
          <circle r="6" fill="#ffd9b8" stroke="#33304A" strokeWidth="2.6" />
          <circle r="2.2" fill="#E8B48C" />
        </g>
        <g transform="translate(39 2)">
          <circle r="6" fill="#ffd9b8" stroke="#33304A" strokeWidth="2.6" />
          <circle r="2.2" fill="#E8B48C" />
        </g>
        <g transform="translate(-22 11)">
          <ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".4" />
        </g>
        <g transform="translate(22 11)">
          <ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".4" />
        </g>
        {bouche(humeur, id)}
        <g transform="translate(0 6)">
          <path d="M-2 -3 Q0 2 3 -1" fill="none" stroke="#33304A" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <Yeux>
          <g transform="translate(-15 -6)">
            <ellipse rx="9" ry="11" fill="#FFFFFF" stroke="#E8B48C" strokeWidth="1" />
            <g transform={choisir(humeur, { content: undefined, reflechit: undefined, applaudit: "translate(0 -0.1) scale(1.05)" })}>
              <circle cx=".5" cy="3" r="5.4" fill="#2F5F8A" />
              <circle cx=".5" cy="3" r="4.4" fill="#4C8FF5" />
              <circle cx=".5" cy="3" r="2.6" fill="#1B1530" />
              <circle cx="-1.6" cy=".4" r="2" fill="#FFFFFF" />
              <circle cx="2.8" cy="5" r="1" fill="#FFFFFF" />
            </g>
            <g clipPath={`url(#${id}oeil)`}>
              <ellipse rx="11" ry="12" fill="#ffd9b8" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, { content: "translate(0 -23)", reflechit: "translate(0 -16.1)", applaudit: "translate(0 -23)" })} />
            </g>
            <path d="M-8.5 0 A9 11 0 0 1 8.5 0" fill="none" stroke="#33304A" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 10.2 Q0 12 5 10.2" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
            <path d="M-7 -8 l-2.6 -2.4 M-8.6 -4 l-3 -1.2" fill="none" stroke="#33304A" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </Yeux>
        <Yeux>
          <g transform="translate(15 -6)">
            <ellipse rx="9" ry="11" fill="#FFFFFF" stroke="#E8B48C" strokeWidth="1" />
            <g transform={choisir(humeur, { content: undefined, reflechit: undefined, applaudit: "translate(0 -0.1) scale(1.05)" })}>
              <circle cx=".5" cy="3" r="5.4" fill="#2F5F8A" />
              <circle cx=".5" cy="3" r="4.4" fill="#4C8FF5" />
              <circle cx=".5" cy="3" r="2.6" fill="#1B1530" />
              <circle cx="-1.6" cy=".4" r="2" fill="#FFFFFF" />
              <circle cx="2.8" cy="5" r="1" fill="#FFFFFF" />
            </g>
            <g clipPath={`url(#${id}oeil)`}>
              <ellipse rx="11" ry="12" fill="#ffd9b8" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, { content: "translate(0 -23)", reflechit: "translate(0 -16.1)", applaudit: "translate(0 -23)" })} />
            </g>
            <path d="M-8.5 0 A9 11 0 0 1 8.5 0" fill="none" stroke="#33304A" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 10.2 Q0 12 5 10.2" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
            <path d="M7 -8 l2.6 -2.4 M8.6 -4 l3 -1.2" fill="none" stroke="#33304A" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </Yeux>
        <g transform={choisir(humeur, { content: "translate(-15 -24)", reflechit: "translate(-15 -22) rotate(-10)", applaudit: "translate(-15 -28)" })}>
          <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#D9A92C" strokeWidth="3.4" strokeLinecap="round" />
        </g>
        <g transform={choisir(humeur, { content: "translate(15 -24)", reflechit: "translate(15 -22) rotate(10)", applaudit: "translate(15 -28)" })}>
          <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#D9A92C" strokeWidth="3.4" strokeLinecap="round" />
        </g>
        <path fill="#f7cc4f" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-42 -24 Q-44 -46 -26 -52 Q-12 -58 0 -54 Q12 -58 26 -52 Q44 -46 42 -24 Q36 -34 30 -29 Q22 -40 12 -30 Q4 -42 -6 -30 Q-14 -42 -24 -30 Q-34 -36 -42 -24 Z" />
        <path fill="none" stroke="#D9A92C" strokeWidth="2" strokeLinecap="round" opacity=".8" d="M-6 -52 Q-2 -44 -8 -32 M14 -50 Q18 -42 13 -31 M-26 -46 Q-24 -40 -25 -31" />
        <path fill="none" stroke="#FFE992" strokeWidth="3" strokeLinecap="round" d="M-30 -44 Q-20 -52 -10 -46 M2 -48 Q10 -54 20 -46" />
        <g data-signe="tiare">
        <g transform="translate(0 -40)">
          <path d="M-16 -2 L-11 -14 L-5 -4 L0 -18 L5 -4 L11 -14 L16 -2 Z" fill="#FFC93C" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cy="-10" r="3.2" fill="#FF8FB8" stroke="#33304A" strokeWidth="1.6" />
          <path d="M-16 -2 H16" stroke="#D99A12" strokeWidth="2" />
        </g>
        </g>
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" d="M-23.3 -97.4Q-26 -77.5 -34.6 -65.2" />
      <path fill="none" stroke="#ffd9b8" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M-23 -100Q-25.6 -78.2 -34.6 -65.2" />
      <path fill="none" stroke="#E8B48C" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" d="M-22.1 -86.5Q-24.8 -74.7 -30.2 -66.1" />
      <path fill="none" stroke="#FFF0E0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M-28.1 -88.9Q-30.7 -78.5 -35 -70.5" />
      <g transform="translate(-23 -98) rotate(-6)">
        <ellipse rx="13" ry="10" fill="#ff9cbc" stroke="#33304A" strokeWidth="2.8" />
        <path d="M-9 4 Q0 10 9 4" fill="none" stroke="#E07AA0" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-4" cy="-4" rx="4" ry="2.4" fill="#FFC4D6" opacity=".9" />
      </g>
      <g transform="translate(-34.6 -65.2) rotate(-154) scale(.8)">
        <path d="M-3.6 -6.4 Q-4 -10.6 -5.7 -14.6 A1.9 1.9 0 0 0 -9.5 -14 Q-8.5 -9.9 -9 -5.6 ZM0.6 -6.1 Q0.7 -10.7 -0.7 -15.2 A1.9 1.9 0 0 0 -4.5 -15 Q-3.9 -10.5 -4.8 -5.9 ZM4.8 -5.9 Q5.3 -10.4 4.5 -15 A1.9 1.9 0 0 0 0.7 -15.2 Q0.7 -10.7 -0.6 -6.1 ZM9 -5.6 Q9.9 -9.7 9.5 -14 A1.9 1.9 0 0 0 5.7 -14.6 Q5.4 -10.4 3.6 -6.4 ZM-5.4 -2 Q-8.3 -4.8 -12.1 -6.4 A1.9 1.9 0 0 0 -14.5 -3.4 Q-11.1 -1.2 -8.6 2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#ffd9b8" />
        <path d="M-3.6 -6.4 Q-4 -10.6 -5.7 -14.6 A1.9 1.9 0 0 0 -9.5 -14 Q-8.5 -9.9 -9 -5.6 Z" fill="#ffd9b8" />
        <path d="M0.6 -6.1 Q0.7 -10.7 -0.7 -15.2 A1.9 1.9 0 0 0 -4.5 -15 Q-3.9 -10.5 -4.8 -5.9 Z" fill="#ffd9b8" />
        <path d="M4.8 -5.9 Q5.3 -10.4 4.5 -15 A1.9 1.9 0 0 0 0.7 -15.2 Q0.7 -10.7 -0.6 -6.1 Z" fill="#ffd9b8" />
        <path d="M9 -5.6 Q9.9 -9.7 9.5 -14 A1.9 1.9 0 0 0 5.7 -14.6 Q5.4 -10.4 3.6 -6.4 Z" fill="#ffd9b8" />
        <path d="M-5.4 -2 Q-8.3 -4.8 -12.1 -6.4 A1.9 1.9 0 0 0 -14.5 -3.4 Q-11.1 -1.2 -8.6 2 Z" fill="#ffd9b8" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#E8B48C" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" d="M23.3 -97.4Q26.1 -77.5 34.6 -65.2" />
      <path fill="none" stroke="#ffd9b8" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M23 -100Q25.6 -78.2 34.6 -65.2" />
      <path fill="none" stroke="#E8B48C" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" d="M28.1 -86.5Q30.9 -74.7 36.2 -66.1" />
      <path fill="none" stroke="#FFF0E0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M22.1 -88.9Q24.7 -78.5 29 -70.5" />
      <g transform="translate(23 -98) rotate(6)">
        <ellipse rx="13" ry="10" fill="#ff9cbc" stroke="#33304A" strokeWidth="2.8" />
        <path d="M-9 4 Q0 10 9 4" fill="none" stroke="#E07AA0" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-4" cy="-4" rx="4" ry="2.4" fill="#FFC4D6" opacity=".9" />
      </g>
      <g transform="translate(34.6 -65.2) rotate(154) scale(.8)">
        <circle cx="-6.3" cy="-8" r="5.4" fill="#33304A" />
        <circle cx="-2.1" cy="-8" r="5.4" fill="#33304A" />
        <circle cx="2.1" cy="-8" r="5.4" fill="#33304A" />
        <circle cx="6.3" cy="-8" r="5.4" fill="#33304A" />
        <path d="M-8 8 V-2 Q-8 -9 0 -9 Q8 -9 8 -2 V8 Q0 12 -8 8 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 8 V-2 Q-8 -9 0 -9 Q8 -9 8 -2 V8 Q0 12 -8 8 Z" fill="#ffd9b8" />
        <circle cx="-6.3" cy="-8" r="3.6" fill="#ffd9b8" />
        <circle cx="-2.1" cy="-8" r="3.6" fill="#ffd9b8" />
        <circle cx="2.1" cy="-8" r="3.6" fill="#ffd9b8" />
        <circle cx="6.3" cy="-8" r="3.6" fill="#ffd9b8" />
        <rect x="-8" y="-8" width="16" height="6" fill="#ffd9b8" />
        <path d="M-8.5 -6.5 q2.2 -1.8 4.4 0M-4.3 -6.5 q2.2 -1.8 4.4 0M-0.1 -6.5 q2.2 -1.8 4.4 0M4.1 -6.5 q2.2 -1.8 4.4 0" fill="none" stroke="#E8B48C" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M7 2 q-5 3 -10 1" fill="none" stroke="#E8B48C" strokeWidth="1.8" strokeLinecap="round" />
      </g>
  </svg>
);
