import type { ReactNode } from "react";
import type { CleUnivers } from "@domain/motivation";

/**
 * Le dessin d'un jeton dans chaque univers (cadre 100 × 100) : une pastille mate, jamais dorée, et l'objet de l'univers
 * (gland, petite fleur, plot, casquette, casque, chausson). Tous les jetons d'une boîte ont le même dessin ;
 * la marque du cinquième jeton est un disque derrière la pastille, commun aux six univers.
 * Source proposée : docs/stories/131/planches/sources/jeton-*.svg.
 */
export const DESSINS_DES_JETONS: Readonly<Record<CleUnivers, ReactNode>> = {
  animaux: (
    <>
      <circle cx="50" cy="50" r="42" fill="#FFF3DF" stroke="#8A5A2B" strokeWidth="5"/>
      <path d="M36 52 Q36 74 50 78 Q64 74 64 52 Z" fill="#F0CF8A" stroke="#8A5A2B" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M32 52 Q32 36 50 36 Q68 36 68 52 Z" fill="#B07A45" stroke="#6B4423" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M50 36 V28" stroke="#6B4423" strokeWidth="4" strokeLinecap="round"/>
    </>
  ),
  princesse: (
    <>
      <circle cx="50" cy="50" r="42" fill="#F5E8FF" stroke="#8E5CC4" strokeWidth="5"/>
      <g fill="#FFFFFF" stroke="#D0589A" strokeWidth="3">
      <circle cx="50" cy="32" r="10"/><circle cx="68" cy="45" r="10"/><circle cx="61" cy="66" r="10"/><circle cx="39" cy="66" r="10"/><circle cx="32" cy="45" r="10"/></g>
      <circle cx="50" cy="52" r="9" fill="#FFC93C" stroke="#C9921B" strokeWidth="2.5"/>
    </>
  ),
  sports: (
    <>
      <circle cx="50" cy="50" r="42" fill="#E3F2FF" stroke="#2F6FCF" strokeWidth="5"/>
      <rect x="28" y="66" width="44" height="9" rx="4.5" fill="#C23B2A" stroke="#7A1F14" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M38 66 L46 28 Q50 24 54 28 L62 66 Z" fill="#E8604C" stroke="#7A1F14" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M41.5 50 H58.5" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
    </>
  ),
  police: (
    <>
      <circle cx="50" cy="50" r="42" fill="#E6ECFF" stroke="#3450C8" strokeWidth="5"/>
      <path d="M30 56 Q30 32 52 32 Q72 32 72 56 Z" fill="#3450C8" stroke="#1B2A78" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M30 56 H72 V63 H30 Z" fill="#1B2A78" stroke="#1B2A78" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M62 62 Q84 62 84 70 Q60 72 40 66 Z" fill="#253B9C" stroke="#1B2A78" strokeWidth="3" strokeLinejoin="round"/>
      <circle cx="51" cy="47" r="5" fill="#E6ECFF"/>
    </>
  ),
  pompier: (
    <>
      <circle cx="50" cy="50" r="42" fill="#FFEBDD" stroke="#B5301A" strokeWidth="5"/>
      <path d="M24 66 Q24 30 50 30 Q76 30 76 66 Z" fill="#FFC93C" stroke="#A56F00" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M18 66 H82 Q82 74 74 74 H26 Q18 74 18 66 Z" fill="#F2B41E" stroke="#A56F00" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M50 30 V20" stroke="#A56F00" strokeWidth="5" strokeLinecap="round"/>
      <path d="M50 30 V62" stroke="#E5A71A" strokeWidth="5" strokeLinecap="round"/>
    </>
  ),
  danse: (
    <>
      <circle cx="50" cy="50" r="42" fill="#FDE8F4" stroke="#A24A9A" strokeWidth="5"/>
      <path d="M26 60 Q26 40 44 40 Q58 40 64 54 Q80 56 80 66 Q80 74 70 74 H34 Q26 74 26 60 Z" fill="#F6A5C8" stroke="#B0457F" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M40 48 Q50 58 62 56" fill="none" stroke="#B0457F" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="38" cy="66" rx="6" ry="4" fill="#FAC8DD"/>
    </>
  ),
};
