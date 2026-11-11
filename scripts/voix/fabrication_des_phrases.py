"""Fabrication reprenable des phrases enregistrées (story #182).

Un MP3 existe sous le nom `<cle>-<empreinte>.mp3` (`<cle>-lente-<empreinte>.mp3` pour l'allure lente) :
l'empreinte change quand le texte envoyé, la voix ou l'encodage changent, donc relancer
ne refabrique que ce qui manque ou a changé.
"""
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Protocol

from voix.cle_de_phrase import empreinte_fnv1a64
from voix.table_de_prononciation import texte_envoye_a_la_voix

NORMALE = "normale"
LENTE = "lente"


class Piper(Protocol):
    def synthetiser(self, texte_envoye: str, chemin_mp3: Path, allure: str) -> None: ...


@dataclass(frozen=True)
class PhraseAFabriquer:
    texte: str
    lente: bool = False


@dataclass(frozen=True)
class ResultatDeFabrication:
    fabriquees: int
    sautees: int


class CollisionDeCles(Exception):
    def __init__(self, cle, textes):
        super().__init__(f"Les phrases {sorted(textes)} ont la même clé {cle}")
        self.cle = cle


class BudgetDePoidsDepasse(Exception):
    def __init__(self, poids, budget):
        super().__init__(f"Les MP3 pèsent {poids} octets pour un budget de {budget}")
        self.poids = poids
        self.budget = budget


def empreinte_de_fabrication(texte_envoye, voix_enregistree, encodage, allure=NORMALE):
    return empreinte_fnv1a64(f"{texte_envoye}\n{voix_enregistree}\n{encodage}\n{allure}")[:8]


def _verifier_les_cles(phrases, cle_de):
    textes_par_cle = {}
    for phrase in phrases:
        textes_par_cle.setdefault(cle_de(phrase.texte), set()).add(phrase.texte)
    for cle, textes in textes_par_cle.items():
        if len(textes) > 1:
            raise CollisionDeCles(cle, textes)


def _nom_du_mp3(cle, empreinte, allure):
    return f"{cle}-{empreinte}.mp3" if allure == NORMALE else f"{cle}-{allure}-{empreinte}.mp3"


def _poids_des_mp3(dossier):
    return sum(fichier.stat().st_size for fichier in dossier.glob("*.mp3"))


def fabriquer_les_phrases(
    phrases,
    *,
    piper: Piper,
    dossier,
    voix_enregistree,
    encodage="mono-32k-22050",
    table=(),
    lot=None,
    budget_en_octets=45_000_000,
    cle_de=empreinte_fnv1a64,
):
    dossier = Path(dossier)
    dossier.mkdir(parents=True, exist_ok=True)
    _verifier_les_cles(phrases, cle_de)
    repertoire = {}
    fabriquees = sautees = 0
    for phrase in phrases:
        cle = cle_de(phrase.texte)
        texte_envoye = texte_envoye_a_la_voix(phrase.texte, table)
        for allure in (NORMALE, LENTE) if phrase.lente else (NORMALE,):
            empreinte = empreinte_de_fabrication(texte_envoye, voix_enregistree, encodage, allure)
            chemin = dossier / _nom_du_mp3(cle, empreinte, allure)
            if chemin.is_file():
                sautees += 1
            elif lot is not None and fabriquees >= lot:
                continue
            else:
                piper.synthetiser(texte_envoye, chemin, allure)
                fabriquees += 1
            repertoire.setdefault(cle, {})[allure] = empreinte
    contenu = {"voixEnregistree": voix_enregistree, "phrases": repertoire}
    (dossier / "repertoire.json").write_text(
        json.dumps(contenu, sort_keys=True, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    poids = _poids_des_mp3(dossier)
    if poids > budget_en_octets:
        raise BudgetDePoidsDepasse(poids, budget_en_octets)
    return ResultatDeFabrication(fabriquees, sautees)
