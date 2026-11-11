"""Clé de phrase : portage exact du domaine TypeScript (story #182).

Source : supabase/functions/_shared/voix/domain/texte-a-lire.ts et cle-de-phrase.ts.
"""
import re
import unicodedata
from dataclasses import dataclass

# \s de JavaScript : WhiteSpace + LineTerminator d'ECMAScript (≠ \s de Python).
CARACTERES_ESPACES = (
    "\t\n\v\f\r \u00a0\u1680\u2028\u2029\u202f\u205f\u3000\ufeff"
    + "".join(chr(c) for c in range(0x2000, 0x200B))
)
ESPACE = f"[{CARACTERES_ESPACES}]"

BASE_FNV_1A_64 = 0xCBF29CE484222325
MULTIPLICATEUR_FNV_1A_64 = 0x100000001B3
MASQUE_64_BITS = (1 << 64) - 1


@dataclass(frozen=True)
class PhraseAvecCle:
    texte: str
    cle: str


def texte_prononce(brut: str) -> str:
    texte = re.sub(r"<[^>]+>", " ", brut)
    texte = re.sub(r"&[a-z]+;", " ", texte)
    texte = texte.replace("+", " plus ")
    texte = texte.replace("=", " égale ")
    texte = re.sub(r"_{2,}", " ... ", texte)
    texte = re.sub(f"{ESPACE}*»(?=[.,!?…])", "", texte)
    texte = re.sub("[«»]", " ", texte)
    texte = re.sub(f"{ESPACE}+", " ", texte)
    return texte.strip(CARACTERES_ESPACES)


def _contient_lettre_ou_chiffre(texte: str) -> bool:
    return any(unicodedata.category(c)[0] in "LN" for c in texte)


def _phrases_du_texte(brut: str) -> list[str]:
    texte = texte_prononce(brut)
    if not _contient_lettre_ou_chiffre(texte):
        return []
    return re.split(f"(?<=[.!?…:]){ESPACE}+", texte)


def empreinte_fnv1a64(texte: str) -> str:
    empreinte = BASE_FNV_1A_64
    for octet in texte.encode("utf-8"):
        empreinte = ((empreinte ^ octet) * MULTIPLICATEUR_FNV_1A_64) & MASQUE_64_BITS
    return f"{empreinte:016x}"


def _normalisee(phrase: str) -> str:
    return unicodedata.normalize("NFC", phrase).replace("’", "'")


def phrases_avec_cle(brut: str) -> list[PhraseAvecCle]:
    phrases = (_normalisee(p) for p in _phrases_du_texte(brut))
    return [
        PhraseAvecCle(texte, empreinte_fnv1a64(texte))
        for texte in phrases
        if _contient_lettre_ou_chiffre(texte)
    ]
