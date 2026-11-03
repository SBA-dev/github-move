import type { ReactNode } from "react";
import type { CleUnivers } from "@domain/motivation";

/** Un calque du dessin : `p` préfixe les identifiants de dégradés et de découpes, pour que deux boîtes d'une même page ne se les disputent pas. */
export type Calque = (p: string) => ReactNode;

/**
 * Le dessin de la boîte d'un univers, en trois calques de même cadre (288 × 250) : la boîte fermée, puis la boîte ouverte
 * en deux couches (le fond et le couvercle derrière les jetons, le rebord avant devant eux).
 * Source proposée : docs/stories/131/planches/sources/boite-*.svg (zone des jetons : de y = 58 à y = 204).
 */
export type DessinDeLaBoite = {
  readonly fermee: Calque;
  readonly ouverteDerriere: Calque;
  readonly ouverteDevant: Calque;
};

export const DESSINS_DES_BOITES: Readonly<Record<CleUnivers, DessinDeLaBoite>> = {
  animaux: {
    fermee: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F3D08F"/><stop offset="1" stopColor="#D9A55B"/></radialGradient><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F7DCA6"/><stop offset="1" stopColor="#E2B567"/></radialGradient><clipPath id={`${p}-corps`}><path d="M26 72 H262 L250 236 Q248 246 238 246 H50 Q40 246 38 236 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <path d="M26 72 H262 L250 236 Q248 246 238 246 H50 Q40 246 38 236 Z" fill={`url(#${p}-c)`} stroke="#7A4B1F" strokeWidth="4" strokeLinejoin="round"/>
          <g clipPath={`url(#${p}-corps)`}><path d="M30 100 Q144 108 258 100" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/><path d="M30 128 Q144 136 258 128" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/><path d="M30 156 Q144 164 258 156" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/><path d="M30 184 Q144 192 258 184" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/><path d="M30 212 Q144 220 258 212" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/><path d="M30 232 Q144 240 258 232" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/></g>
          <rect x="20" y="46" width="248" height="34" rx="12" fill={`url(#${p}-l)`} stroke="#7A4B1F" strokeWidth="4" strokeLinejoin="round"/>
          <circle cx="144" cy="36" r="13" fill="#E2B567" stroke="#7A4B1F" strokeWidth="4"/><path d="M60 62 H228" stroke="#7A4B1F" strokeWidth="3" strokeLinecap="round" opacity=".55"/>
      </>
    ),
    ouverteDerriere: (p) => (
      <>
          <defs><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F7DCA6"/><stop offset="1" stopColor="#E2B567"/></radialGradient></defs>
          <path d="M30 54 L44 8 Q46 4 52 4 H236 Q242 4 244 8 L258 54 Z" fill={`url(#${p}-l)`} stroke="#7A4B1F" strokeWidth="4" strokeLinejoin="round"/>
          <circle cx="144" cy="22" r="11" fill="#E2B567" stroke="#7A4B1F" strokeWidth="4"/>
          <path d="M26 72 H262 L250 236 Q248 246 238 246 H50 Q40 246 38 236 Z" transform="translate(0 -18)" fill="#8F6232" stroke="#7A4B1F" strokeWidth="4" strokeLinejoin="round"/>
      </>
    ),
    ouverteDevant: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F3D08F"/><stop offset="1" stopColor="#D9A55B"/></radialGradient><clipPath id={`${p}-corps`}><path d="M26 72 H262 L250 236 Q248 246 238 246 H50 Q40 246 38 236 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <g clipPath={`url(#${p}-rebord)`}><path d="M26 72 H262 L250 236 Q248 246 238 246 H50 Q40 246 38 236 Z" fill={`url(#${p}-c)`} stroke="#7A4B1F" strokeWidth="4" strokeLinejoin="round"/><g clipPath={`url(#${p}-corps)`}><path d="M30 218 Q144 226 258 218" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/><path d="M30 234 Q144 242 258 234" fill="none" stroke="#7A4B1F" strokeWidth="3" opacity=".5"/></g></g>
      </>
    ),
  },
  princesse: {
    fermee: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F2D9FA"/><stop offset="1" stopColor="#CE97E3"/></radialGradient><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F6E4FC"/><stop offset="1" stopColor="#DDB0EE"/></radialGradient><clipPath id={`${p}-corps`}><path d="M26 72 H262 V222 Q262 246 238 246 H50 Q26 246 26 222 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <path d="M26 72 H262 V222 Q262 246 238 246 H50 Q26 246 26 222 Z" fill={`url(#${p}-c)`} stroke="#7E56BC" strokeWidth="4" strokeLinejoin="round"/>
          <g clipPath={`url(#${p}-corps)`}><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="2"><circle cx="80" cy="151.04" r="5.2"/><circle cx="88.96" cy="157.44" r="5.2"/><circle cx="85.76" cy="167.68" r="5.2"/><circle cx="74.24" cy="167.68" r="5.2"/><circle cx="71.04" cy="157.44" r="5.2"/></g><circle cx="80" cy="160" r="4" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.6"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="2"><circle cx="144" cy="151.04" r="5.2"/><circle cx="152.96" cy="157.44" r="5.2"/><circle cx="149.76" cy="167.68" r="5.2"/><circle cx="138.24" cy="167.68" r="5.2"/><circle cx="135.04" cy="157.44" r="5.2"/></g><circle cx="144" cy="160" r="4" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.6"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="2"><circle cx="208" cy="151.04" r="5.2"/><circle cx="216.96" cy="157.44" r="5.2"/><circle cx="213.76" cy="167.68" r="5.2"/><circle cx="202.24" cy="167.68" r="5.2"/><circle cx="199.04" cy="157.44" r="5.2"/></g><circle cx="208" cy="160" r="4" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.6"/></g>
          <rect x="16" y="46" width="256" height="34" rx="17" fill={`url(#${p}-l)`} stroke="#7E56BC" strokeWidth="4" strokeLinejoin="round"/>
          <g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.375"><circle cx="86" cy="56.84" r="3.575"/><circle cx="92.16" cy="61.24" r="3.575"/><circle cx="89.96" cy="68.28" r="3.575"/><circle cx="82.04" cy="68.28" r="3.575"/><circle cx="79.84" cy="61.24" r="3.575"/></g><circle cx="86" cy="63" r="2.75" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.1"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.375"><circle cx="144" cy="56.84" r="3.575"/><circle cx="150.16" cy="61.24" r="3.575"/><circle cx="147.96" cy="68.28" r="3.575"/><circle cx="140.04" cy="68.28" r="3.575"/><circle cx="137.84" cy="61.24" r="3.575"/></g><circle cx="144" cy="63" r="2.75" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.1"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.375"><circle cx="202" cy="56.84" r="3.575"/><circle cx="208.16" cy="61.24" r="3.575"/><circle cx="205.96" cy="68.28" r="3.575"/><circle cx="198.04" cy="68.28" r="3.575"/><circle cx="195.84" cy="61.24" r="3.575"/></g><circle cx="202" cy="63" r="2.75" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.1"/>
      </>
    ),
    ouverteDerriere: (p) => (
      <>
          <defs><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F6E4FC"/><stop offset="1" stopColor="#DDB0EE"/></radialGradient></defs>
          <path d="M30 54 L44 8 Q46 4 52 4 H236 Q242 4 244 8 L258 54 Z" fill={`url(#${p}-l)`} stroke="#7E56BC" strokeWidth="4" strokeLinejoin="round"/>
          <g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.25"><circle cx="96" cy="22.4" r="3.25"/><circle cx="101.6" cy="26.4" r="3.25"/><circle cx="99.6" cy="32.8" r="3.25"/><circle cx="92.4" cy="32.8" r="3.25"/><circle cx="90.4" cy="26.4" r="3.25"/></g><circle cx="96" cy="28" r="2.5" fill="#FFC93C" stroke="#C9921B" strokeWidth="1"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.25"><circle cx="144" cy="22.4" r="3.25"/><circle cx="149.6" cy="26.4" r="3.25"/><circle cx="147.6" cy="32.8" r="3.25"/><circle cx="140.4" cy="32.8" r="3.25"/><circle cx="138.4" cy="26.4" r="3.25"/></g><circle cx="144" cy="28" r="2.5" fill="#FFC93C" stroke="#C9921B" strokeWidth="1"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.25"><circle cx="192" cy="22.4" r="3.25"/><circle cx="197.6" cy="26.4" r="3.25"/><circle cx="195.6" cy="32.8" r="3.25"/><circle cx="188.4" cy="32.8" r="3.25"/><circle cx="186.4" cy="26.4" r="3.25"/></g><circle cx="192" cy="28" r="2.5" fill="#FFC93C" stroke="#C9921B" strokeWidth="1"/>
          <path d="M26 72 H262 V222 Q262 246 238 246 H50 Q26 246 26 222 Z" transform="translate(0 -18)" fill="#9C6FC9" stroke="#7E56BC" strokeWidth="4" strokeLinejoin="round"/>
      </>
    ),
    ouverteDevant: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F2D9FA"/><stop offset="1" stopColor="#CE97E3"/></radialGradient><clipPath id={`${p}-corps`}><path d="M26 72 H262 V222 Q262 246 238 246 H50 Q26 246 26 222 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <g clipPath={`url(#${p}-rebord)`}><path d="M26 72 H262 V222 Q262 246 238 246 H50 Q26 246 26 222 Z" fill={`url(#${p}-c)`} stroke="#7E56BC" strokeWidth="4" strokeLinejoin="round"/><g clipPath={`url(#${p}-corps)`}><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.375"><circle cx="80" cy="219.84" r="3.575"/><circle cx="86.16" cy="224.24" r="3.575"/><circle cx="83.96" cy="231.28" r="3.575"/><circle cx="76.04" cy="231.28" r="3.575"/><circle cx="73.84" cy="224.24" r="3.575"/></g><circle cx="80" cy="226" r="2.75" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.1"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.375"><circle cx="144" cy="219.84" r="3.575"/><circle cx="150.16" cy="224.24" r="3.575"/><circle cx="147.96" cy="231.28" r="3.575"/><circle cx="140.04" cy="231.28" r="3.575"/><circle cx="137.84" cy="224.24" r="3.575"/></g><circle cx="144" cy="226" r="2.75" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.1"/><g fill="#FFFFFF" stroke="#D0589A" strokeWidth="1.375"><circle cx="208" cy="219.84" r="3.575"/><circle cx="214.16" cy="224.24" r="3.575"/><circle cx="211.96" cy="231.28" r="3.575"/><circle cx="204.04" cy="231.28" r="3.575"/><circle cx="201.84" cy="224.24" r="3.575"/></g><circle cx="208" cy="226" r="2.75" fill="#FFC93C" stroke="#C9921B" strokeWidth="1.1"/></g></g>
      </>
    ),
  },
  sports: {
    fermee: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#6FA6F0"/><stop offset="1" stopColor="#2F6FCF"/></radialGradient><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#8DB9F5"/><stop offset="1" stopColor="#3F7FE0"/></radialGradient><clipPath id={`${p}-corps`}><path d="M18 72 H270 V204 Q270 246 228 246 H60 Q18 246 18 204 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <path d="M96 48 Q96 12 144 12 Q192 12 192 48" fill="none" stroke="#164BA8" strokeWidth="10" strokeLinecap="round"/>
          <path d="M18 72 H270 V204 Q270 246 228 246 H60 Q18 246 18 204 Z" fill={`url(#${p}-c)`} stroke="#164BA8" strokeWidth="4" strokeLinejoin="round"/>
          <g clipPath={`url(#${p}-corps)`}><rect x="18" y="150" width="252" height="24" fill="#FFFFFF" opacity=".9"/></g>
          <path d="M16 60 Q16 40 40 40 H248 Q272 40 272 60 V84 Q272 112 244 112 H44 Q16 112 16 84 Z" fill={`url(#${p}-l)`} stroke="#164BA8" strokeWidth="4" strokeLinejoin="round"/>
          <path d="M144 40 V112" stroke="#FFFFFF" strokeWidth="12" opacity=".9"/><circle cx="144" cy="106" r="9" fill="#FFFFFF" stroke="#164BA8" strokeWidth="4"/>
      </>
    ),
    ouverteDerriere: (p) => (
      <>
          <defs><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#8DB9F5"/><stop offset="1" stopColor="#3F7FE0"/></radialGradient></defs>
          <path d="M30 54 L44 8 Q46 4 52 4 H236 Q242 4 244 8 L258 54 Z" fill={`url(#${p}-l)`} stroke="#164BA8" strokeWidth="4" strokeLinejoin="round"/>
          <path d="M144 8 V52" stroke="#FFFFFF" strokeWidth="12" opacity=".9"/>
          <path d="M18 72 H270 V204 Q270 246 228 246 H60 Q18 246 18 204 Z" transform="translate(0 -18)" fill="#1B3F86" stroke="#164BA8" strokeWidth="4" strokeLinejoin="round"/>
      </>
    ),
    ouverteDevant: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#6FA6F0"/><stop offset="1" stopColor="#2F6FCF"/></radialGradient><clipPath id={`${p}-corps`}><path d="M18 72 H270 V204 Q270 246 228 246 H60 Q18 246 18 204 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <g clipPath={`url(#${p}-rebord)`}><path d="M18 72 H270 V204 Q270 246 228 246 H60 Q18 246 18 204 Z" fill={`url(#${p}-c)`} stroke="#164BA8" strokeWidth="4" strokeLinejoin="round"/><g clipPath={`url(#${p}-corps)`}><rect x="18" y="214" width="252" height="14" fill="#FFFFFF" opacity=".9"/></g></g>
      </>
    ),
  },
  police: {
    fermee: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#8AA2DA"/><stop offset="1" stopColor="#3450C8"/></radialGradient><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#6F8BE0"/><stop offset="1" stopColor="#2B43A8"/></radialGradient><clipPath id={`${p}-corps`}><path d="M24 72 H264 V232 Q264 246 250 246 H38 Q24 246 24 232 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <path d="M24 72 H264 V232 Q264 246 250 246 H38 Q24 246 24 232 Z" fill={`url(#${p}-c)`} stroke="#1F2F82" strokeWidth="4" strokeLinejoin="round"/>
          <g clipPath={`url(#${p}-corps)`}><path d="M144 110 L184 122 V166 Q184 196 144 214 Q104 196 104 166 V122 Z" fill="#F3F6FF" stroke="#1F2F82" strokeWidth="5" strokeLinejoin="round"/><path d="M144 126 L170 134 V164 Q170 184 144 198 Q118 184 118 164 V134 Z" fill="#3450C8"/></g>
          <rect x="14" y="46" width="260" height="34" rx="10" fill={`url(#${p}-l)`} stroke="#1F2F82" strokeWidth="4" strokeLinejoin="round"/>
          <rect x="110" y="30" width="68" height="20" rx="10" fill="#2B43A8" stroke="#1F2F82" strokeWidth="4"/><path d="M34 63 H254" stroke="#E6ECFF" strokeWidth="6" strokeLinecap="round"/>
      </>
    ),
    ouverteDerriere: (p) => (
      <>
          <defs><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#6F8BE0"/><stop offset="1" stopColor="#2B43A8"/></radialGradient></defs>
          <path d="M30 54 L44 8 Q46 4 52 4 H236 Q242 4 244 8 L258 54 Z" fill={`url(#${p}-l)`} stroke="#1F2F82" strokeWidth="4" strokeLinejoin="round"/>
          <path d="M50 30 H238" stroke="#E6ECFF" strokeWidth="6" strokeLinecap="round"/>
          <path d="M24 72 H264 V232 Q264 246 250 246 H38 Q24 246 24 232 Z" transform="translate(0 -18)" fill="#243B9A" stroke="#1F2F82" strokeWidth="4" strokeLinejoin="round"/>
      </>
    ),
    ouverteDevant: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#8AA2DA"/><stop offset="1" stopColor="#3450C8"/></radialGradient><clipPath id={`${p}-corps`}><path d="M24 72 H264 V232 Q264 246 250 246 H38 Q24 246 24 232 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <g clipPath={`url(#${p}-rebord)`}><path d="M24 72 H264 V232 Q264 246 250 246 H38 Q24 246 24 232 Z" fill={`url(#${p}-c)`} stroke="#1F2F82" strokeWidth="4" strokeLinejoin="round"/><g clipPath={`url(#${p}-corps)`}><path d="M24 216 H264" stroke="#E6ECFF" strokeWidth="8"/></g></g>
      </>
    ),
  },
  pompier: {
    fermee: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F0705A"/><stop offset="1" stopColor="#C2341B"/></radialGradient><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#D9503A"/><stop offset="1" stopColor="#A8281A"/></radialGradient><clipPath id={`${p}-corps`}><path d="M24 72 H264 V234 Q264 246 252 246 H36 Q24 246 24 234 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <path d="M24 72 H264 V234 Q264 246 252 246 H36 Q24 246 24 234 Z" fill={`url(#${p}-c)`} stroke="#6E1708" strokeWidth="4" strokeLinejoin="round"/>
          <g clipPath={`url(#${p}-corps)`}><rect x="24" y="152" width="240" height="26" fill="#FFC93C"/><rect x="40" y="96" width="46" height="18" rx="9" fill="#6E1708"/><rect x="202" y="96" width="46" height="18" rx="9" fill="#6E1708"/></g>
          <rect x="14" y="46" width="260" height="34" rx="9" fill={`url(#${p}-l)`} stroke="#6E1708" strokeWidth="4" strokeLinejoin="round"/>
          <rect x="98" y="30" width="92" height="20" rx="10" fill="#FFC93C" stroke="#A56F00" strokeWidth="4"/>
      </>
    ),
    ouverteDerriere: (p) => (
      <>
          <defs><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#D9503A"/><stop offset="1" stopColor="#A8281A"/></radialGradient></defs>
          <path d="M30 54 L44 8 Q46 4 52 4 H236 Q242 4 244 8 L258 54 Z" fill={`url(#${p}-l)`} stroke="#6E1708" strokeWidth="4" strokeLinejoin="round"/>
          <rect x="98" y="14" width="92" height="16" rx="8" fill="#FFC93C" stroke="#A56F00" strokeWidth="4"/>
          <path d="M24 72 H264 V234 Q264 246 252 246 H36 Q24 246 24 234 Z" transform="translate(0 -18)" fill="#8A2010" stroke="#6E1708" strokeWidth="4" strokeLinejoin="round"/>
      </>
    ),
    ouverteDevant: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F0705A"/><stop offset="1" stopColor="#C2341B"/></radialGradient><clipPath id={`${p}-corps`}><path d="M24 72 H264 V234 Q264 246 252 246 H36 Q24 246 24 234 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <g clipPath={`url(#${p}-rebord)`}><path d="M24 72 H264 V234 Q264 246 252 246 H36 Q24 246 24 234 Z" fill={`url(#${p}-c)`} stroke="#6E1708" strokeWidth="4" strokeLinejoin="round"/><g clipPath={`url(#${p}-corps)`}><rect x="24" y="216" width="240" height="14" fill="#FFC93C"/></g></g>
      </>
    ),
  },
  danse: {
    fermee: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F8D2EF"/><stop offset="1" stopColor="#D68BC8"/></radialGradient><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#E6B3EC"/><stop offset="1" stopColor="#B96FCB"/></radialGradient><clipPath id={`${p}-corps`}><path d="M24 72 H264 V228 Q264 246 246 246 H42 Q24 246 24 228 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <path d="M24 72 H264 V228 Q264 246 246 246 H42 Q24 246 24 228 Z" fill={`url(#${p}-c)`} stroke="#7A35C8" strokeWidth="4" strokeLinejoin="round"/>
          <g clipPath={`url(#${p}-corps)`}><ellipse cx="124" cy="190" rx="14" ry="10" fill="#FFFFFF" transform="rotate(-20 124 190)"/><path d="M135 186 V132 Q146 140 160 146" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/></g>
          <rect x="14" y="46" width="260" height="34" rx="14" fill={`url(#${p}-l)`} stroke="#7A35C8" strokeWidth="4" strokeLinejoin="round"/>
          <path d="M40 63 H248" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".85"/>
          <path d="M264 150 H276" stroke="#7A35C8" strokeWidth="6" strokeLinecap="round"/><circle cx="278" cy="150" r="8" fill="#F8D2EF" stroke="#7A35C8" strokeWidth="4"/>
      </>
    ),
    ouverteDerriere: (p) => (
      <>
          <defs><radialGradient id={`${p}-l`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#E6B3EC"/><stop offset="1" stopColor="#B96FCB"/></radialGradient></defs>
          <path d="M30 54 L44 8 Q46 4 52 4 H236 Q242 4 244 8 L258 54 Z" fill={`url(#${p}-l)`} stroke="#7A35C8" strokeWidth="4" strokeLinejoin="round"/>
          <path d="M56 30 H232" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".85"/>
          <path d="M24 72 H264 V228 Q264 246 246 246 H42 Q24 246 24 228 Z" transform="translate(0 -18)" fill="#8E4BA8" stroke="#7A35C8" strokeWidth="4" strokeLinejoin="round"/>
      </>
    ),
    ouverteDevant: (p) => (
      <>
          <defs><radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#F8D2EF"/><stop offset="1" stopColor="#D68BC8"/></radialGradient><clipPath id={`${p}-corps`}><path d="M24 72 H264 V228 Q264 246 246 246 H42 Q24 246 24 228 Z"/></clipPath><clipPath id={`${p}-rebord`}><rect x="0" y="204" width="288" height="46"/></clipPath></defs>
          <g clipPath={`url(#${p}-rebord)`}><path d="M24 72 H264 V228 Q264 246 246 246 H42 Q24 246 24 228 Z" fill={`url(#${p}-c)`} stroke="#7A35C8" strokeWidth="4" strokeLinejoin="round"/><g clipPath={`url(#${p}-corps)`}><path d="M24 216 H264" stroke="#FFFFFF" strokeWidth="6" opacity=".85"/></g></g>
          <path d="M264 150 H276" stroke="#7A35C8" strokeWidth="6" strokeLinecap="round"/><circle cx="278" cy="150" r="8" fill="#F8D2EF" stroke="#7A35C8" strokeWidth="4"/>
      </>
    ),
  },
};
