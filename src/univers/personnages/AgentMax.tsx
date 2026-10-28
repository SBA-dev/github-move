import type { ReactNode } from "react";
import type { Humeur } from "@domain/motivation";
import { choisir, type DessinDuPersonnage, Yeux } from "./partage.tsx";

const CHAUSSURE = (
  <>
    <path fill="#2B2B3A" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-8 -8 Q-10 0 -10 5 Q-10 13 -3 14 Q0 15 3 14 Q10 13 10 5 Q10 0 8 -8 Q0 -10 -8 -8 Z" />
    <path fill="#1B1B28" d="M3 -7 Q8 0 8 5 Q8 11 3 14 Q6 9 5 4 Q4 -2 3 -7 Z" />
    <path d="M-8 9 Q0 13 8 9" fill="none" stroke="#C8D2E6" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
    <path d="M-4 -4 Q0 -6 4 -4" fill="none" stroke="#5A5A70" strokeWidth="1.6" strokeLinecap="round" />
  </>
);

function bouche(humeur: Humeur, id: string): ReactNode {
  const bouches: Readonly<Record<Humeur, ReactNode>> = {
    content: (
      <>
        <g transform="scale(1.3)">
          <path d="M-8 0 Q0 8 8 0" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </>
    ),
    reflechit: (
      <>
        <g transform="scale(1.3)">
          <path d="M-5 1 Q-2 -1 0 1 Q2 3 5 1" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </>
    ),
    applaudit: (
      <>
        <g transform="scale(1.3)">
          <g>
          <path d="M-11 0 Q0 20 11 0 Z" fill="#C9475A" />
          <g clipPath={`url(#${id}bouche)`} transform="translate(0 -11)">
            <ellipse cy="28" rx="7" ry="4.5" fill="#FF8FA8" />
            <path d="M-11 10.5 Q0 18 11 10.5 Z" fill="#FFFFFF" />
          </g>
          <path d="M-11 0 Q0 20 11 0 Z" fill="none" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
        </g>
      </>
    ),
  };
  return bouches[humeur];
}

export const AgentMax: DessinDuPersonnage = ({ humeur, id }) => (
  <svg viewBox="-82 -137 181 227" overflow="visible" aria-hidden="true">
    <defs>
      <clipPath id={`${id}oeil`}>
        <ellipse rx="7.4" ry="9.6" />
      </clipPath>
      <clipPath id={`${id}bouche`}>
        <path d="M-11 11 Q0 27 11 11 Z" />
      </clipPath>
        <radialGradient id={`${id}verre`} cx=".35" cy=".3" r=".7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset=".5" stopColor="#D8ECFF" stopOpacity=".45" />
          <stop offset="1" stopColor="#9FC8FF" stopOpacity=".35" />
        </radialGradient>
    </defs>
      <g data-signe="pantalon">
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M-10.3 7.5Q-12.7 34.4 -14.7 57.8" />
      <path fill="none" stroke="#253B9C" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M-10 4Q-12.5 32.9 -14.7 57.8" />
      <path fill="none" stroke="#1B2C78" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M-8.1 22.2Q-9.1 33.8 -10.1 44.7" />
      <path fill="none" stroke="#3F56B8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M-14.9 19.8Q-15.8 30.9 -16.8 41.3" />
      <path fill="none" stroke="#1B2C78" strokeWidth="16.5" strokeLinecap="butt" d="M-14.3 52.8L-14.6 56.3" />
      <g transform="translate(-14.7 59.8)">
        {CHAUSSURE}
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M10.3 7.5Q12.7 34.4 14.7 57.8" />
      <path fill="none" stroke="#253B9C" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M10 4Q12.5 32.9 14.7 57.8" />
      <path fill="none" stroke="#1B2C78" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M14.9 22.2Q15.9 33.8 16.9 44.7" />
      <path fill="none" stroke="#3F56B8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M8.1 19.8Q9 30.9 10 41.3" />
      <path fill="none" stroke="#1B2C78" strokeWidth="16.5" strokeLinecap="butt" d="M14.3 52.8L14.6 56.3" />
      <g transform="translate(14.7 59.8)">
        {CHAUSSURE}
      </g>
      <path fill="#253B9C" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-22 -1 Q0 2 22 -1 L23 12 Q10.5 15 2.5 11 Q0 8 -2.5 11 Q-10.5 15 -23 12 Z" />
      <path fill="#1B2C78" d="M4.2 5 Q22 0 23 12 Q12.6 15 3.2 11 Z" />
      <path fill="none" stroke="#1B2C78" strokeWidth="2" strokeLinecap="round" d="M0 2 V9" />
      </g>
      <g data-signe="chemise-bleue">
      <path fill="#4C78E8" stroke="#33304A" strokeWidth="3.4" strokeLinejoin="round" d="M-18 -40 Q-24 -12 -21 1 Q0 4 21 1 Q24 -12 18 -40 Q0 -47 -18 -40 Z" />
      <path fill="#3450C8" d="M5.4 -42 Q21 -30 21 0 Q12.6 3 7.4 2 Q19 -20 5.4 -42 Z" />
      <path fill="#86A5F2" d="M-16.2 -36 Q-7.2 -42 1.8 -40 Q-7.2 -37 -14.4 -30 Z" />
      <path fill="none" stroke="#3450C8" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 6" d="M0 -34 V-4" />
      <path fill="#2B2B3A" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" d="M-22 -2 Q0 1 22 -2 L22 3 Q0 6 -22 3 Z" />
      <rect x="-4" y="-3.2" width="8" height="6.4" rx="1.6" fill="#FFC93C" stroke="#33304A" strokeWidth="1.5" transform="translate(0 1)" />
      <g transform="translate(23 10)">
        <g transform="scale(.5) rotate(25)">
          <line x1="0" y1="8" x2="0" y2="-16" stroke="#33304A" strokeWidth="6.5" strokeLinecap="round" />
          <line x1="0" y1="8" x2="0" y2="-16" stroke="#A86E3A" strokeWidth="3.4" strokeLinecap="round" />
          <circle cy="-27" r="13" fill="#FFC93C" stroke="#33304A" strokeWidth="2.6" />
          <circle cy="-27" r="9" fill={`url(#${id}verre)`} stroke="#33304A" strokeWidth="1.6" />
        </g>
      </g>
      <path fill="#4C78E8" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" d="M-8 -44 L-3 -37 L0 -41 L3 -37 L8 -44 Q0 -47 -8 -44 Z" />
      <g transform="translate(9 -24)">
        <rect x="-6.5" y="-4.5" width="13" height="10" rx="1.6" fill="#3450C8" stroke="#33304A" strokeWidth="1.6" />
        <rect x="-4.5" y="-8" width="8" height="6.5" rx="1.2" fill="#FFF7E0" stroke="#33304A" strokeWidth="1.4" />
        <path d="M-2.5 -6.2 H2 M-2.5 -4.4 H1.2 M-2.5 -2.6 H2" stroke="#8E9BBE" strokeWidth=".9" strokeLinecap="round" />
      </g>
      </g>
      <g data-signe="etoile-doree">
      <g transform="translate(-8 -25)">
        <path d="M0 -6 L1.7 -1.9 L6 -1.9 L2.7 .8 L3.8 5.2 L0 2.7 L-3.8 5.2 L-2.7 .8 L-6 -1.9 L-1.7 -1.9 Z" fill="#FFC93C" stroke="#33304A" strokeWidth="1.4" strokeLinejoin="round" />
        <circle r="1.5" fill="#FFF1A8" />
      </g>
      </g>
      <path fill="#f2cba5" stroke="#33304A" strokeWidth="3" d="M-5.5 -52 V-38 H5.5 V-52 Z" />
      <path d="M-5.5 -52 V-44 Q0 -42 5.5 -44 V-52 Z" fill="#E3AE85" />
      <g transform="translate(0 -48)">
        <g transform="translate(0 -26) scale(.7)">
          <circle cx="0" cy="-6" r="41" fill="#4a2f1d" />
          <circle r="40" fill="#f2cba5" stroke="#33304A" strokeWidth="4.6" />
          <path d="M10 38 A40 40 0 0 0 38 -12 A33 33 0 0 1 10 38 Z" fill="#E3AE85" />
          <ellipse cx="-16" cy="-22" rx="10" ry="5" fill="#FFE9D2" opacity=".9" />
          <g transform="translate(-39 4)">
            <circle r="7.5" fill="#f2cba5" stroke="#33304A" strokeWidth="3.6" />
            <circle r="2.8" fill="#E3AE85" />
          </g>
          <g transform="translate(39 4)">
            <circle r="7.5" fill="#f2cba5" stroke="#33304A" strokeWidth="3.6" />
            <circle r="2.8" fill="#E3AE85" />
          </g>
          <g transform="translate(-22 15)">
            <ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".5" />
          </g>
          <g transform="translate(22 15)">
            <ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".5" />
          </g>
          <g transform="translate(0 20)">
            {bouche(humeur, id)}
          </g>
          <g transform="translate(0 8)">
            <circle cy="3" r="3.8" fill="#E9A77A" stroke="#33304A" strokeWidth="2.6" />
            <circle cx="-1.2" cy="-1.2" r="1.3" fill="#FFD9BC" />
          </g>
          <g transform="scale(1.3)" data-testid="visage" data-humeur={humeur}>
            <Yeux>
              <g transform="translate(-12 0)">
                <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" />
                <g transform={choisir(humeur, undefined, undefined, "translate(0 -0.1) scale(1.05)")}>
                  <circle cx=".5" cy="3" r="4.8" fill="#6B4226" />
                  <circle cx=".5" cy="3" r="2.5" fill="#1B1530" />
                  <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                  <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
                </g>
                <g clipPath={`url(#${id}oeil)`}>
                  <ellipse rx="10" ry="10.6" fill="#f2cba5" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, "translate(0 -21)", "translate(0 -14.7)", "translate(0 -21)")} />
                </g>
                <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
              </g>
            </Yeux>
            <Yeux>
              <g transform="translate(12 0)">
                <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" />
                <g transform={choisir(humeur, undefined, undefined, "translate(0 -0.1) scale(1.05)")}>
                  <circle cx=".5" cy="3" r="4.8" fill="#6B4226" />
                  <circle cx=".5" cy="3" r="2.5" fill="#1B1530" />
                  <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                  <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
                </g>
                <g clipPath={`url(#${id}oeil)`}>
                  <ellipse rx="10" ry="10.6" fill="#f2cba5" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, "translate(0 -21)", "translate(0 -14.7)", "translate(0 -21)")} />
                </g>
                <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
              </g>
            </Yeux>
          </g>
          <g transform={choisir(humeur, "translate(-15.6 -17)", "translate(-15.6 -15) rotate(-10)", "translate(-15.6 -21)")}>
            <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#3A2314" strokeWidth="4.2" strokeLinecap="round" />
          </g>
          <g transform={choisir(humeur, "translate(15.6 -17)", "translate(15.6 -15) rotate(10)", "translate(15.6 -21)")}>
            <path d="M-8 0 Q0 -5 8 0" fill="none" stroke="#3A2314" strokeWidth="4.2" strokeLinecap="round" />
          </g>
          <path fill="#4a2f1d" stroke="#33304A" strokeWidth="3.6" strokeLinejoin="round" d="M-41 -14 Q-45 -46 0 -50 Q45 -46 41 -14 Q41 -5 36 -5 Q31 -5 31 -14 V-22 Q0 -30 -31 -22 V-14 Q-31 -5 -36 -5 Q-41 -5 -41 -14 Z" />
          <path fill="none" stroke="#70492E" strokeWidth="2.6" strokeLinecap="round" d="M-37 -10 Q-37 -20 -34 -26" />
          <g data-signe="casquette-de-police">
          <path d="M-40 -34 Q-42 -70 0 -74 Q42 -70 40 -34 Q0 -42 -40 -34 Z" fill="#3450C8" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
          <path d="M12 -70 Q36 -64 38 -36 Q24 -42 12 -42 Z" fill="#253B9C" />
          <path d="M-28 -56 Q-16 -66 -2 -66 Q-14 -62 -22 -52 Z" fill="#6484EA" />
          <path d="M-43 -34 Q0 -46 43 -34 Q0 -18 -43 -34 Z" fill="#2B2B3A" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M-30 -33 Q0 -26 30 -33" fill="none" stroke="#5A5A70" strokeWidth="1.6" strokeLinecap="round" />
          <g transform="translate(0 -54)">
            <path d="M0 -7 L2 -2 L7 -2 L3 1 L4.4 6 L0 3 L-4.4 6 L-3 1 L-7 -2 L-2 -2 Z" fill="#FFC93C" stroke="#33304A" strokeWidth="1.4" strokeLinejoin="round" />
          </g>
          </g>
        </g>
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M18.1 -36Q18.4 -30.4 19.1 -25.2" />
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M18.2 -33.5Q19.9 -11 29.6 6.2" />
      <path fill="none" stroke="#f2cba5" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M18 -38Q18.8 -12.5 29.6 6.2" />
      <path fill="none" stroke="#E3AE85" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M22.8 -21Q25.3 -6.9 31.1 4.5" />
      <path fill="none" stroke="#FFE9D2" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M16.5 -22.9Q19 -9.9 24.3 1" />
      <path fill="none" stroke="#4C78E8" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" d="M18 -38Q18.3 -31.4 19.1 -25.2" />
      <path fill="none" stroke="#3450C8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M21.7 -35L22 -30.5L22.5 -26.1" />
      <path fill="none" stroke="#3450C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 -26.4L19.1 -25.2" />
      <g transform="translate(29.6 6.2) rotate(158) scale(.86)">
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 ZM0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 ZM4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 ZM9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 ZM8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#f2cba5" />
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 Z" fill="#f2cba5" />
        <path d="M0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 Z" fill="#f2cba5" />
        <path d="M4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 Z" fill="#f2cba5" />
        <path d="M9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 Z" fill="#f2cba5" />
        <path d="M8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="#f2cba5" />
        <path d="M-5.8 -9 l0.6 -4M-1.9 -9 l0.2 -4M1.9 -9 l-0.2 -4M5.8 -9 l-0.6 -4" fill="none" stroke="#E3AE85" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#E3AE85" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" d="M-18.1 -36Q-18.4 -30.4 -19.1 -25.2" />
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M-18.2 -33.5Q-19.9 -11 -29.6 6.2" />
      <path fill="none" stroke="#f2cba5" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38Q-18.8 -12.5 -29.6 6.2" />
      <path fill="none" stroke="#E3AE85" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M-16.4 -21Q-18.8 -6.9 -24.7 4.5" />
      <path fill="none" stroke="#FFE9D2" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M-22.9 -22.9Q-25.4 -9.9 -30.7 1" />
      <path fill="none" stroke="#4C78E8" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38Q-18.3 -31.4 -19.1 -25.2" />
      <path fill="none" stroke="#3450C8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M-14.5 -35L-14.8 -30.5L-15.3 -26.1" />
      <path fill="none" stroke="#3450C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M-19 -26.4L-19.1 -25.2" />
      <g transform="translate(-29.6 6.2) rotate(-158) scale(.86)">
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 ZM0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 ZM4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 ZM9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 ZM-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#f2cba5" />
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 Z" fill="#f2cba5" />
        <path d="M0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 Z" fill="#f2cba5" />
        <path d="M4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 Z" fill="#f2cba5" />
        <path d="M9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 Z" fill="#f2cba5" />
        <path d="M-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="#f2cba5" />
        <path d="M-6.8 -9 l-0.6 -4M-2.3 -9 l-0.2 -4M2.3 -9 l0.2 -4M6.8 -9 l0.6 -4" fill="none" stroke="#E3AE85" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#E3AE85" strokeWidth="2.2" strokeLinecap="round" />
      </g>
  </svg>
);
