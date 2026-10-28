import type { ReactNode } from "react";
import type { Humeur } from "@domain/motivation";
import { choisir, type DessinDuPersonnage, Yeux } from "./partage.tsx";

const CHAUSSURE = (
  <>
    <ellipse rx="11" ry="3" fill="#6B3A1E" opacity="0.25" transform="translate(0 12)" />
    <path fill="#F6B4CF" stroke="#33304A" strokeWidth="2.8" strokeLinejoin="round" d="M-7 -6 Q-9 0 -9 5 Q-9 12 -3 13 Q0 13.5 3 13 Q9 12 9 5 Q9 0 7 -6 Q0 -8 -7 -6 Z" />
    <path fill="#E08FB4" d="M3 -5 Q7 0 7 6 Q7 11 3 13 Q5 8 4 4 Q4 -1 3 -5 Z" />
    <path fill="#e8b58c" stroke="#33304A" strokeWidth="1.6" d="M-6 -6 Q0 -1 6 -6 Q0 -8 -6 -6 Z" />
    <path d="M-7 -4 L7 2 M7 -4 L-7 2" fill="none" stroke="#FF8FB8" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="-2" cy="8" rx="3" ry="1.3" fill="#FFFFFF" opacity=".8" />
    <path d="M-2.5 2 q2.5 -2 5 0 q-2.5 2 -5 0 Z" fill="#FF8FB8" stroke="#33304A" strokeWidth="1" />
  </>
);

function bouche(humeur: Humeur, id: string): ReactNode {
  const bouches: Readonly<Record<Humeur, ReactNode>> = {
    content: <path d="M-8 14 Q0 22 8 14" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />,
    reflechit: <path d="M-5 16 Q-2 14 0 16 Q2 18 5 16" fill="none" stroke="#33304A" strokeWidth="2.4" strokeLinecap="round" />,
    applaudit: (
      <>
        <g>
        <path d="M-11 11 Q0 27 11 11 Z" fill="#C9475A" />
        <g clipPath={`url(#${id}bouche)`}>
          <ellipse cy="25" rx="7.5" ry="5" fill="#FF8FA8" />
          <path d="M-11 10.5 Q0 18.5 11 10.5 Z" fill="#FFFFFF" />
        </g>
        <path d="M-11 11 Q0 27 11 11 Z" fill="none" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
        </g>
      </>
    ),
  };
  return bouches[humeur];
}

export const Lili: DessinDuPersonnage = ({ humeur, id }) => (
  <svg viewBox="-83 -119 166 208" overflow="visible" aria-hidden="true">
    <defs>
      <clipPath id={`${id}oeil`}>
        <ellipse rx="7.4" ry="9.6" />
      </clipPath>
      <clipPath id={`${id}bouche`}>
        <path d="M-11 11 Q0 27 11 11 Z" />
      </clipPath>
    </defs>
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M-9.2 7.5Q-11.2 34.3 -12.8 57.9" />
      <path fill="none" stroke="#FBEFF9" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M-9 4Q-11.1 32.8 -12.8 57.9" />
      <path fill="none" stroke="#E2CCE0" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M-6.8 22.2Q-7.6 33.9 -8.4 44.8" />
      <path fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M-13.6 19.8Q-14.4 30.9 -15.1 41.3" />
      <path fill="none" stroke="#FBEFF9" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M-11 31.9Q-11.9 45.3 -12.8 57.9" />
      <path fill="none" stroke="#FBEFF9" strokeWidth="13" strokeLinecap="butt" d="M-11.1 34.1L-11.3 36.7M-11.4 38.3L-11.5 39.9" />
      <path fill="none" stroke="#E2CCE0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M-7.7 38.3Q-8.4 47.4 -9 56.4" />
      <g transform="translate(-12.8 59.9)">
        {CHAUSSURE}
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M9.2 7.5Q11.2 34.3 12.8 57.9" />
      <path fill="none" stroke="#FBEFF9" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M9 4Q11.1 32.8 12.8 57.9" />
      <path fill="none" stroke="#E2CCE0" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M13.6 22.2Q14.4 33.9 15.2 44.8" />
      <path fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M6.8 19.8Q7.6 30.9 8.3 41.3" />
      <path fill="none" stroke="#FBEFF9" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M11 31.9Q11.9 45.3 12.8 57.9" />
      <path fill="none" stroke="#FBEFF9" strokeWidth="13" strokeLinecap="butt" d="M11.1 34.1L11.3 36.7M11.4 38.3L11.5 39.9" />
      <path fill="none" stroke="#E2CCE0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M14.9 38.3Q15.6 47.4 16.2 56.4" />
      <g transform="translate(12.8 59.9)">
        {CHAUSSURE}
      </g>
      <g data-signe="tutu-rose">
      <path fill="#F3C9F2" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-44 -5 Q-37.7 28 -31.4 19 Q-25.1 28 -18.9 19 Q-12.6 28 -6.3 19 Q0 28 6.3 19 Q12.6 28 18.9 19 Q25.1 28 31.4 19 Q37.7 28 44 19 L44 -5 Q0 -1 -44 -5 Z" />
      <path fill="#D9A6DE" d="M13.2 8 Q41.8 -2 44 12 Q30.8 18 13.2 17 Z" />
      </g>
      <g data-signe="justaucorps-violet">
      <path fill="none" stroke="#b55bd6" strokeWidth="5" strokeLinecap="round" d="M-24.2 -5 Q0 2 24.2 -5" />
      <path fill="#b55bd6" stroke="#33304A" strokeWidth="3.4" strokeLinejoin="round" d="M-18 -40 Q-24 -12 -18.7 0 Q0 6 18.7 0 Q24 -12 18 -40 Q0 -47 -18 -40 Z" />
      <path fill="#8E3FB0" d="M5.4 -42 Q21 -30 18.7 0 Q13.2 4 7.7 3 Q19 -20 5.4 -42 Z" />
      <path fill="#D08AE8" d="M-16.2 -36 Q-7.2 -42 1.8 -40 Q-7.2 -37 -14.4 -30 Z" />
      <path fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" d="M-9 -44 Q0 -34 9 -44" />
      </g>
      <g transform="translate(-9 -24)" />
      <g data-signe="queue-de-cheval-haute">
      <g transform="translate(0 -48) translate(0 -26)">
        <path fill="#B8873E" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-6.3 -22.1 Q0.8 -4.8 6.3 1.4 Q11.7 7.6 16.6 13.3 Q21.6 19 26.2 24.4 L30.8 29.9 Q38.3 41.7 38.5 51 L39.9 38 L48.2 45 Q43.3 40.2 42.9 25.1L42.9 25.1 Q38.9 9 35.1 1.4 Q31.2 -6.3 26.3 -13.6 Q21.4 -20.8 13.8 -26.4 L6.3 -31.9 Z" />
        <path fill="none" stroke="#8F6528" strokeWidth="3" strokeLinecap="round" d="M5.3 -8.4 Q16 4.6 20.7 10.7 Q25.4 16.8 29.4 22.8 Q33.5 28.8 36.4 35.1 L39.4 41.3" />
        <path fill="none" stroke="#DDB46A" strokeWidth="2.6" strokeLinecap="round" d="M2.8 -29.2 Q15.6 -16.3 20.7 -9.4 Q25.8 -2.4 29.9 4.7 L34.1 11.8" />
        <path fill="none" stroke="#8F6528" strokeWidth="1.3" strokeLinecap="round" opacity=".75" d="M9.4 -11.5 Q19.9 1.8 24.4 8.3 Q28.9 14.8 32.4 21.3 L35.9 27.9 M13.1 -14.4 Q23.4 -0.8 27.7 6.1 Q32 13 35 20 L38.1 27 M27.7 -3.8 Q35.8 10.8 38.3 18.4 Q40.7 26 41.5 33.2 L42.4 40.5" />
        <g transform="translate(0 -27) rotate(11.4)">
          <ellipse rx="7" ry="5" fill="#FF8FB8" stroke="#33304A" strokeWidth="2.2" />
          <path d="M0 -1 l-6 -5 q-3 3 0 6 Z M0 -1 l6 -5 q3 3 0 6 Z" fill="#FF8FB8" stroke="#33304A" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cy="-1" r="2" fill="#FFC9DE" stroke="#33304A" strokeWidth="1.2" />
        </g>
      </g>
      </g>
      <path fill="#e8b58c" stroke="#33304A" strokeWidth="3" d="M-5.5 -52 V-38 H5.5 V-52 Z" />
      <path d="M-5.5 -52 V-44 Q0 -42 5.5 -44 V-52 Z" fill="#C9956E" />
      <g transform="translate(0 -48)">
        <g transform="translate(0 -26)">
          <circle r="28" fill="#e8b58c" stroke="#33304A" strokeWidth="4" />
          <path fill="#C9956E" d="M8 27 A28 28 0 0 0 27 -6 A23 23 0 0 1 8 27 Z" />
          <ellipse cx="-9" cy="-16" rx="9" ry="5" fill="#F7D4B8" opacity=".8" />
          <g transform="translate(-28 3)">
            <circle r="6" fill="#e8b58c" stroke="#33304A" strokeWidth="3" />
            <circle r="2.2" fill="#C9956E" />
          </g>
          <g transform="translate(28 3)">
            <circle r="6" fill="#e8b58c" stroke="#33304A" strokeWidth="3" />
            <circle r="2.2" fill="#C9956E" />
          </g>
          <g data-testid="visage" data-humeur={humeur}>
            <g transform="translate(-18.4 8) scale(0.54 1)">
              <ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6" />
            </g>
            <g transform="translate(18.4 8) scale(0.54 1)">
              <ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6" />
            </g>
            <Yeux>
              <g transform="translate(-13.1 -5) scale(0.91 1)">
                <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" />
                <g transform={choisir(humeur, { content: undefined, reflechit: undefined, applaudit: "translate(0 -0.1) scale(1.05)" })}>
                  <circle cx=".5" cy="3" r="4.8" fill="#2F6B3C" />
                  <circle cx=".5" cy="3" r="3.9" fill="#4E9A5B" />
                  <circle cx=".5" cy="3" r="2.3" fill="#1B1530" />
                  <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                  <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
                </g>
                <g clipPath={`url(#${id}oeil)`}>
                  <ellipse rx="10" ry="10.6" fill="#e8b58c" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, { content: "translate(0 -21)", reflechit: "translate(0 -14.7)", applaudit: "translate(0 -21)" })} />
                </g>
                <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
                <path d="M-5.5 -7 l-2.6 -2.6 M-7.2 -3.5 l-3 -1.4" fill="none" stroke="#33304A" strokeWidth="2" strokeLinecap="round" />
              </g>
            </Yeux>
            <Yeux>
              <g transform="translate(13.1 -5) scale(0.91 1)">
                <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" />
                <g transform={choisir(humeur, { content: undefined, reflechit: undefined, applaudit: "translate(0 -0.1) scale(1.05)" })}>
                  <circle cx=".5" cy="3" r="4.8" fill="#2F6B3C" />
                  <circle cx=".5" cy="3" r="3.9" fill="#4E9A5B" />
                  <circle cx=".5" cy="3" r="2.3" fill="#1B1530" />
                  <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                  <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
                </g>
                <g clipPath={`url(#${id}oeil)`}>
                  <ellipse rx="10" ry="10.6" fill="#e8b58c" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, { content: "translate(0 -21)", reflechit: "translate(0 -14.7)", applaudit: "translate(0 -21)" })} />
                </g>
                <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
                <path d="M5.5 -7 l2.6 -2.6 M7.2 -3.5 l3 -1.4" fill="none" stroke="#33304A" strokeWidth="2" strokeLinecap="round" />
              </g>
            </Yeux>
            <g transform="translate(0 8)">
              <circle cy="2.5" r="3" fill="#E9A77A" stroke="#33304A" strokeWidth="2.2" />
              <circle cx="-1" cy="-1" r="1" fill="#FFD9BC" />
            </g>
            <g transform="translate(0 1)">
              {bouche(humeur, id)}
            </g>
          </g>
          <path fill="#B8873E" stroke="#33304A" strokeWidth="3.6" strokeLinejoin="round" d="M-29 -20.8L-24.2 -19.8L-19.3 -19.6L-14.5 -17.5L-9.7 -14L-4.8 -18.4L0 -19.1L4.8 -14.3L9.7 -16.7L14.5 -19.9L19.3 -15.4L24.2 -20.1L29 -24.8 Q32 -14 18 -25 Q0 -37 -18 -25 Q-32 -14 -29 -22 Z" />
          <path fill="none" stroke="#DDB46A" strokeWidth="3" strokeLinecap="round" d="M-16 -22 Q-4 -29 8 -26" />
          <g transform={choisir(humeur, { content: "translate(-13.1 -21) scale(0.91 1) rotate(-3)", reflechit: "translate(-13.1 -16) scale(0.91 1) rotate(10)", applaudit: "translate(-13.1 -23) scale(0.91 1) rotate(-4)" })}>
            <path d="M-7 0 Q0 -4 7 0" fill="none" stroke="#8F6528" strokeWidth="3.6" strokeLinecap="round" />
          </g>
          <g transform={choisir(humeur, { content: "translate(13.1 -21) scale(0.91 1) rotate(3)", reflechit: "translate(13.1 -16) scale(0.91 1) rotate(-10)", applaudit: "translate(13.1 -23) scale(0.91 1) rotate(4)" })}>
            <path d="M-7 0 Q0 -4 7 0" fill="none" stroke="#8F6528" strokeWidth="3.6" strokeLinecap="round" />
          </g>
        </g>
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" d="M-18.1 -36Q-18.6 -29.2 -19.8 -23.4" />
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M-18.3 -33.5Q-20.6 -10.7 -31.8 5.4" />
      <path fill="none" stroke="#e8b58c" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38Q-19.5 -12.5 -31.8 5.4" />
      <path fill="none" stroke="#C9956E" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M-16.8 -21Q-19.8 -7.3 -26.7 3.9" />
      <path fill="none" stroke="#F7D4B8" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M-23.4 -22.9Q-26.4 -10.1 -32.6 0.4" />
      <path fill="none" stroke="#b55bd6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38Q-18.4 -30.3 -19.8 -23.4" />
      <path fill="none" stroke="#8E3FB0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" d="M-14.1 -35L-14.7 -29.5L-15.5 -24.2" />
      <path fill="none" stroke="#8E3FB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M-19.6 -24.8L-19.8 -23.4" />
      <g transform="translate(-31.8 5.4) rotate(-154) scale(.86)">
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 ZM0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 ZM4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 ZM9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 ZM-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#e8b58c" />
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 Z" fill="#e8b58c" />
        <path d="M0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 Z" fill="#e8b58c" />
        <path d="M4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 Z" fill="#e8b58c" />
        <path d="M9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 Z" fill="#e8b58c" />
        <path d="M-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="#e8b58c" />
        <path d="M-6.8 -9 l-0.6 -4M-2.3 -9 l-0.2 -4M2.3 -9 l0.2 -4M6.8 -9 l0.6 -4" fill="none" stroke="#C9956E" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#C9956E" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" d="M18.1 -36Q18.6 -29.2 19.8 -23.4" />
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M18.3 -33.5Q20.6 -10.7 31.8 5.4" />
      <path fill="none" stroke="#e8b58c" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M18 -38Q19.5 -12.5 31.8 5.4" />
      <path fill="none" stroke="#C9956E" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M23.2 -21Q26.2 -7.3 33.1 3.9" />
      <path fill="none" stroke="#F7D4B8" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M17 -22.9Q20 -10.1 26.2 0.4" />
      <path fill="none" stroke="#b55bd6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M18 -38Q18.4 -30.3 19.8 -23.4" />
      <path fill="none" stroke="#8E3FB0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" d="M22.1 -35L22.7 -29.5L23.5 -24.2" />
      <path fill="none" stroke="#8E3FB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M19.6 -24.8L19.8 -23.4" />
      <g transform="translate(31.8 5.4) rotate(154) scale(.86)">
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 ZM0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 ZM4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 ZM9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 ZM8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#e8b58c" />
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 Z" fill="#e8b58c" />
        <path d="M0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 Z" fill="#e8b58c" />
        <path d="M4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 Z" fill="#e8b58c" />
        <path d="M9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 Z" fill="#e8b58c" />
        <path d="M8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="#e8b58c" />
        <path d="M-5.8 -9 l0.6 -4M-1.9 -9 l0.2 -4M1.9 -9 l-0.2 -4M5.8 -9 l-0.6 -4" fill="none" stroke="#C9956E" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#C9956E" strokeWidth="2.2" strokeLinecap="round" />
      </g>
  </svg>
);
