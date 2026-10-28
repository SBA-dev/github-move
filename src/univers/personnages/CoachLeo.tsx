import type { ReactNode } from "react";
import type { Humeur } from "@domain/motivation";
import { choisir, type DessinDuPersonnage, Yeux } from "./partage.tsx";

const CHAUSSURE = (
  <>
    <ellipse rx="13" ry="3.5" fill="#15502B" opacity="0.25" transform="translate(0 12)" />
    <path fill="#E8604C" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-7 -10 Q-9 -3 -10 4 Q-11 12 -4 15 Q0 16 4 15 Q11 12 10 4 Q9 -3 7 -10 Q0 -12 -7 -10 Z" />
    <path fill="#C24432" d="M3 -8 Q8 0 9 6 Q9 12 4 15 Q7 10 6 4 Q5 -2 3 -8 Z" />
    <path fill="#FF8A74" d="M-9 6 Q-9 13 -4 15 Q0 16 4 15 Q9 13 9 6 Q0 9 -9 6 Z" />
    <ellipse cx="-2.5" cy="10" rx="3" ry="1.4" fill="#FFFFFF" opacity=".9" />
    <path fill="#C24432" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" d="M-5 -10 Q0 -13 5 -10 L4 -4 Q0 -3 -4 -4 Z" />
    <g fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round">
      <path d="M-3.2 -5 L3.2 -5 M-3.5 -2 L3.5 -2 M-3.8 1 L3.8 1 M-4 4 L4 4" />
    </g>
    <g fill="none" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round">
      <path d="M-9.5 -1 L-7.5 0 M-9.8 2 L-7.8 3 M-10 5 L-8 6 M9.5 -1 L7.5 0 M9.8 2 L7.8 3 M10 5 L8 6" />
    </g>
    <path fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity=".9" d="M-9 11 Q0 15.5 9 11" />
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

export const CoachLeo: DessinDuPersonnage = ({ humeur, id }) => (
  <svg viewBox="-84 -119 168 210" overflow="visible" aria-hidden="true">
    <defs>
      <clipPath id={`${id}oeil`}>
        <ellipse rx="7.4" ry="9.6" />
      </clipPath>
      <clipPath id={`${id}bouche`}>
        <path d="M-11 11 Q0 27 11 11 Z" />
      </clipPath>
    </defs>
      <path fill="none" stroke="#33304A" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" d="M-10.3 7.5Q-12.7 34.4 -14.7 57.8" />
      <path fill="none" stroke="#f1c39a" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" d="M-10 4Q-12.5 32.9 -14.7 57.8" />
      <path fill="none" stroke="#D9A67A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M-8.1 22.2Q-9.1 33.8 -10.1 44.7" />
      <path fill="none" stroke="#FFE3C8" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" d="M-14.9 19.8Q-15.8 30.9 -16.8 41.3" />
      <path fill="none" stroke="#FFFFFF" strokeWidth="14.5" strokeLinecap="round" strokeLinejoin="round" d="M-12.4 31.9Q-13.6 45.4 -14.7 57.8" />
      <path fill="none" stroke="#2a63d4" strokeWidth="14.6" strokeLinecap="butt" d="M-12.6 34L-12.9 36.7M-13 38.3L-13.1 39.9" />
      <path fill="none" stroke="#D9E3F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M-9.3 38.2Q-10.2 47.6 -10.9 56.3" />
      <g transform="translate(-14.7 59.8)">
        {CHAUSSURE}
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" d="M10.3 7.5Q12.7 34.4 14.7 57.8" />
      <path fill="none" stroke="#f1c39a" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" d="M10 4Q12.5 32.9 14.7 57.8" />
      <path fill="none" stroke="#D9A67A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M14.9 22.2Q15.9 33.8 16.9 44.7" />
      <path fill="none" stroke="#FFE3C8" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" d="M8.1 19.8Q9 30.9 10 41.3" />
      <path fill="none" stroke="#FFFFFF" strokeWidth="14.5" strokeLinecap="round" strokeLinejoin="round" d="M12.4 31.9Q13.6 45.4 14.7 57.8" />
      <path fill="none" stroke="#2a63d4" strokeWidth="14.6" strokeLinecap="butt" d="M12.6 34L12.9 36.7M13 38.3L13.1 39.9" />
      <path fill="none" stroke="#D9E3F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M16.5 38.2Q17.4 47.6 18.1 56.3" />
      <g transform="translate(14.7 59.8)">
        {CHAUSSURE}
      </g>
      <path fill="#FFFFFF" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-23 -4 Q0 2 23 -4 L26 16 Q11 20 2.2 18 Q0 14 -2.2 18 Q-11 20 -26 16 Z" />
      <path fill="#D9E3F2" d="M4.4 8 Q23 0 24 14 Q13.2 18 3.3 17 Z" />
      <path fill="none" stroke="#2a63d4" strokeWidth="2.4" strokeLinecap="round" d="M-24 0 L-25 14 M24 0 L25 14" />
      <g data-signe="maillot-bleu">
      <path fill="#2a63d4" stroke="#33304A" strokeWidth="3.4" strokeLinejoin="round" d="M-18 -40 Q-24 -12 -22 6 Q0 14 22 6 Q24 -12 18 -40 Q0 -47 -18 -40 Z" />
      <path fill="#1F4CB0" d="M5.4 -42 Q21 -30 22 4 Q13.2 10 7.7 9 Q19 -20 5.4 -42 Z" />
      <path fill="#5A8BE8" d="M-16.2 -36 Q-7.2 -42 1.8 -40 Q-7.2 -37 -14.4 -30 Z" />
      <path fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" d="M-7 -44 L0 -35 L7 -44" />
      </g>
      <g transform="translate(-9 -24)">
        <circle r="6" fill="#FFFFFF" stroke="#33304A" strokeWidth="1.8" />
        <circle r="2.6" fill="#E8604C" />
      </g>
      <path fill="#f1c39a" stroke="#33304A" strokeWidth="3" d="M-5.5 -52 V-38 H5.5 V-52 Z" />
      <path d="M-5.5 -52 V-44 Q0 -42 5.5 -44 V-52 Z" fill="#D9A67A" />
      <g transform="translate(0 -48)">
        <g transform="translate(0 -26)">
          <circle r="28" fill="#f1c39a" stroke="#33304A" strokeWidth="4" />
          <path fill="#D9A67A" d="M8 27 A28 28 0 0 0 27 -6 A23 23 0 0 1 8 27 Z" />
          <ellipse cx="-9" cy="-16" rx="9" ry="5" fill="#FFE3C8" opacity=".8" />
          <g transform="translate(-28 3)">
            <circle r="6" fill="#f1c39a" stroke="#33304A" strokeWidth="3" />
            <circle r="2.2" fill="#D9A67A" />
          </g>
          <g transform="translate(28 3)">
            <circle r="6" fill="#f1c39a" stroke="#33304A" strokeWidth="3" />
            <circle r="2.2" fill="#D9A67A" />
          </g>
          <g data-testid="visage" data-humeur={humeur}>
            <g transform="translate(-16.4 8) scale(0.66 1)">
              <ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6" />
            </g>
            <g transform="translate(16.4 8) scale(0.66 1)">
              <ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6" />
            </g>
            <Yeux>
              <g transform="translate(-11.2 -5) scale(0.93 1)">
                <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" />
                <g transform={choisir(humeur, undefined, undefined, "translate(0 -0.1) scale(1.05)")}>
                  <circle cx=".5" cy="3" r="4.8" fill="#6B4226" />
                  <circle cx=".5" cy="3" r="2.5" fill="#1B1530" />
                  <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                  <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
                </g>
                <g clipPath={`url(#${id}oeil)`}>
                  <ellipse rx="10" ry="10.6" fill="#f1c39a" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, "translate(0 -21)", "translate(0 -14.7)", "translate(0 -21)")} />
                </g>
                <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
              </g>
            </Yeux>
            <Yeux>
              <g transform="translate(11.2 -5) scale(0.93 1)">
                <ellipse rx="7.4" ry="9.6" fill="#FFFFFF" />
                <g transform={choisir(humeur, undefined, undefined, "translate(0 -0.1) scale(1.05)")}>
                  <circle cx=".5" cy="3" r="4.8" fill="#6B4226" />
                  <circle cx=".5" cy="3" r="2.5" fill="#1B1530" />
                  <circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF" />
                  <circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF" />
                </g>
                <g clipPath={`url(#${id}oeil)`}>
                  <ellipse rx="10" ry="10.6" fill="#f1c39a" stroke="#33304A" strokeWidth="2.6" transform={choisir(humeur, "translate(0 -21)", "translate(0 -14.7)", "translate(0 -21)")} />
                </g>
                <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="#33304A" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="#33304A" strokeWidth="1" strokeLinecap="round" opacity=".4" />
              </g>
            </Yeux>
            <circle cy="2.5" r="3.4" fill="#E9A77A" stroke="#33304A" strokeWidth="2.2" />
            <circle cx="-1" cy="-1" r="1" fill="#FFD9BC" />
            <g transform="translate(0 -1)">
              {bouche(humeur, id)}
            </g>
          </g>
          <g data-signe="cheveux-courts">
          <path fill="#5a3a22" stroke="#33304A" strokeWidth="3.6" strokeLinejoin="round" d="M-29 -20.8L-24.2 -19.8L-19.3 -19.6L-14.5 -17.5L-9.7 -14L-4.8 -18.4L0 -19.1L4.8 -14.3L9.7 -16.7L14.5 -19.9L19.3 -15.4L24.2 -20.1L29 -24.8 Q32 -14 18 -25 Q0 -37 -18 -25 Q-32 -14 -29 -22 Z" />
          <path fill="none" stroke="#8A5E3B" strokeWidth="3" strokeLinecap="round" d="M-16 -22 Q-4 -29 8 -26" />
          <path fill="#5a3a22" stroke="#33304A" strokeWidth="3.2" strokeLinejoin="round" d="M-12 -25 Q-16 -39 -2 -36 Q-4 -31 2 -27 Z" />
          <path fill="#5a3a22" stroke="#33304A" strokeWidth="3.2" strokeLinejoin="round" d="M0 -27 Q6 -41 16 -34 Q10 -33 10 -26 Z" />
          <path fill="#5a3a22" stroke="#33304A" strokeWidth="3.2" strokeLinejoin="round" d="M10 -25 Q22 -36 24 -22 Q18 -24 14 -20 Z" />
          <path fill="#5a3a22" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M-4 -29 Q-14 -42 -18 -31 Q-12 -32 -10 -27 Z" />
          </g>
          <g transform={choisir(humeur, "translate(-11.2 -21) scale(0.93 1) rotate(-3)", "translate(-11.2 -16) scale(0.93 1) rotate(10)", "translate(-11.2 -23) scale(0.93 1) rotate(-4)")}>
            <path d="M-7 0 Q0 -4 7 0" fill="none" stroke="#43291A" strokeWidth="3.6" strokeLinecap="round" />
          </g>
          <g transform={choisir(humeur, "translate(11.2 -21) scale(0.93 1) rotate(3)", "translate(11.2 -16) scale(0.93 1) rotate(-10)", "translate(11.2 -23) scale(0.93 1) rotate(4)")}>
            <path d="M-7 0 Q0 -4 7 0" fill="none" stroke="#43291A" strokeWidth="3.6" strokeLinecap="round" />
          </g>
        </g>
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" d="M-18.1 -36Q-18.4 -29.3 -19.4 -23.3" />
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M-18.2 -33.5Q-19.9 -11 -29.6 6.2" />
      <path fill="none" stroke="#f1c39a" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38Q-18.8 -12.5 -29.6 6.2" />
      <path fill="none" stroke="#D9A67A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M-16.4 -21Q-18.8 -6.9 -24.7 4.5" />
      <path fill="none" stroke="#FFE3C8" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M-22.9 -22.9Q-25.4 -9.9 -30.7 1" />
      <path fill="none" stroke="#2a63d4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M-18 -38Q-18.2 -30.4 -19.4 -23.3" />
      <path fill="none" stroke="#1F4CB0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" d="M-14.1 -35L-14.5 -29.5L-15.1 -24.2" />
      <path fill="none" stroke="#1F4CB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M-19.2 -24.7L-19.4 -23.3" />
      <g transform="translate(-29.6 6.2) rotate(-158) scale(.86)">
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 ZM0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 ZM4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 ZM9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 ZM-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#f1c39a" />
        <path d="M-3.6 -6.4 Q-4.1 -11.1 -5.9 -15.5 A1.9 1.9 0 0 0 -9.6 -14.9 Q-8.6 -10.3 -9 -5.6 Z" fill="#f1c39a" />
        <path d="M0.6 -6.1 Q0.6 -11.2 -0.7 -16.2 A1.9 1.9 0 0 0 -4.5 -16 Q-4 -11 -4.8 -5.9 Z" fill="#f1c39a" />
        <path d="M4.8 -5.9 Q5.4 -10.9 4.5 -16 A1.9 1.9 0 0 0 0.7 -16.2 Q0.8 -11.1 -0.6 -6.1 Z" fill="#f1c39a" />
        <path d="M9 -5.6 Q10 -10.1 9.6 -14.9 A1.9 1.9 0 0 0 5.9 -15.5 Q5.4 -10.8 3.6 -6.4 Z" fill="#f1c39a" />
        <path d="M-5.4 -2 Q-8.7 -5.1 -12.9 -7 A1.9 1.9 0 0 0 -15.3 -4 Q-11.5 -1.5 -8.6 2 Z" fill="#f1c39a" />
        <path d="M-6.8 -9 l-0.6 -4M-2.3 -9 l-0.2 -4M2.3 -9 l0.2 -4M6.8 -9 l0.6 -4" fill="none" stroke="#D9A67A" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#D9A67A" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <path fill="none" stroke="#33304A" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" d="M18.1 -36Q18.4 -29.3 19.4 -23.3" />
      <path fill="none" stroke="#33304A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M18.2 -33.5Q19.9 -11 29.6 6.2" />
      <path fill="none" stroke="#f1c39a" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" d="M18 -38Q18.8 -12.5 29.6 6.2" />
      <path fill="none" stroke="#D9A67A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" d="M22.8 -21Q25.3 -6.9 31.1 4.5" />
      <path fill="none" stroke="#FFE3C8" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M16.5 -22.9Q19 -9.9 24.3 1" />
      <path fill="none" stroke="#2a63d4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M18 -38Q18.2 -30.4 19.4 -23.3" />
      <path fill="none" stroke="#1F4CB0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" d="M22.1 -35L22.5 -29.5L23.1 -24.2" />
      <path fill="none" stroke="#1F4CB0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M19.2 -24.7L19.4 -23.3" />
      <g transform="translate(29.6 6.2) rotate(158) scale(.86)">
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 ZM0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 ZM4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 ZM9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 ZM8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="none" stroke="#33304A" strokeWidth="5.2" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="none" stroke="#33304A" strokeWidth="5.6" strokeLinejoin="round" />
        <path d="M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z" fill="#f1c39a" />
        <path d="M-3.6 -5.6 Q-2.6 -10.1 -3 -14.9 A1.9 1.9 0 0 0 -6.7 -15.5 Q-7.2 -10.8 -9 -6.4 Z" fill="#f1c39a" />
        <path d="M0.6 -5.9 Q1.2 -10.9 0.3 -16 A1.9 1.9 0 0 0 -3.5 -16.2 Q-3.4 -11.1 -4.8 -6.1 Z" fill="#f1c39a" />
        <path d="M4.8 -6.1 Q4.8 -11.2 3.5 -16.2 A1.9 1.9 0 0 0 -0.3 -16 Q0.2 -11 -0.6 -5.9 Z" fill="#f1c39a" />
        <path d="M9 -6.4 Q8.5 -11.1 6.7 -15.5 A1.9 1.9 0 0 0 3 -14.9 Q4 -10.3 3.6 -5.6 Z" fill="#f1c39a" />
        <path d="M8.6 2 Q12.4 -0.4 15.3 -4 A1.9 1.9 0 0 0 12.9 -7 Q9.6 -4 5.4 -2 Z" fill="#f1c39a" />
        <path d="M-5.8 -9 l0.6 -4M-1.9 -9 l0.2 -4M1.9 -9 l-0.2 -4M5.8 -9 l-0.6 -4" fill="none" stroke="#D9A67A" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
        <path d="M3 8 Q7 4 7 -1" fill="none" stroke="#D9A67A" strokeWidth="2.2" strokeLinecap="round" />
      </g>
  </svg>
);
