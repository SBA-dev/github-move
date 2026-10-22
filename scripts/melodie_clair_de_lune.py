"""Génère l'air d'« Au clair de la lune » (mélodie traditionnelle, domaine public), découpé en vers.

Produit app/audio/au-clair-de-la-lune.mp3 et affiche le découpage (début, fin, départ de chaque mot)
à recopier dans la leçon. Un petit silence sépare les vers pour un découpage net.
Usage : python3 scripts/melodie_clair_de_lune.py
"""
import json, subprocess, sys, wave
import numpy as np

SR, BEAT, GAP, LEAD = 44100, 0.6, 0.45, 0.4
F = lambda n: 440 * 2 ** ((n - 69) / 12)
C4, D4, E4, G3, A3, B3 = 60, 62, 64, 55, 57, 59
# Notes (hauteur, durée en temps), départ de chaque mot (en temps), basse (hauteur, durée)
A1 = ([(C4, 1), (C4, 1), (C4, 1), (D4, 1), (E4, 2), (D4, 2)], [(48, 4), (48, 2), (43, 2)])
A2 = ([(C4, 1), (E4, 1), (D4, 1), (D4, 1), (C4, 4)], [(48, 2), (43, 2), (48, 4)])
B1 = ([(D4, 1), (D4, 1), (D4, 1), (D4, 1), (A3, 2), (A3, 2)], [(43, 4), (50, 4)])
B2 = ([(D4, 1), (C4, 1), (B3, 1), (A3, 1), (G3, 4)], [(50, 2), (50, 2), (43, 4)])
VERS = [(A1, [0, 1, 2, 3, 4]), (A2, [0, 1, 3]), (A1, [0, 2, 3, 4]), (A2, [0, 1, 3, 4]),
        (B1, [0, 1, 3, 4]), (B2, [0, 1, 2, 3, 4]), (A1, [0, 2, 3, 4]), (A2, [0, 1, 3, 4])]

def tone(freq, dur, amp, harm=(1, .45, .22, .1), vib=True):
    t = np.arange(int(SR * dur)) / SR
    ph = 2 * np.pi * freq * t + (np.sin(2 * np.pi * 5.2 * t) * .0035 * freq * np.clip(t - .18, 0, None) * 6 if vib else 0)
    s = sum(a * np.sin(k * ph) for k, a in enumerate(harm, 1))
    env = np.minimum(1, t / .025) * (0.75 + 0.25 * np.exp(-t * 5)) * np.minimum(1, (dur - t) / .09)
    return amp * s * env

total = LEAD + sum(sum(d for _, d in v[0][0]) * BEAT + GAP for v in VERS) + .5
out = np.zeros(int(SR * total))
cut, t = [], LEAD
for (notes, bass), words in VERS:
    start = t
    for n, d in notes:
        x = tone(F(n), d * BEAT * .96, .32); i = int(t * SR); out[i:i + len(x)] += x; t += d * BEAT
    b = start
    for n, d in bass:
        x = tone(F(n), d * BEAT * .98, .12, harm=(1, .3, .08), vib=False); i = int(b * SR); out[i:i + len(x)] += x; b += d * BEAT
    cut.append({'debut': round(start - .05, 2), 'fin': round(t + .1, 2), 'mots': [round(w * BEAT + .05, 2) for w in words]})
    t += GAP
out = (out / np.max(np.abs(out)) * .8 * 32767).astype(np.int16)
wav = '/tmp/clair.wav'
with wave.open(wav, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
dest = sys.argv[1] if len(sys.argv) > 1 else 'app/audio/au-clair-de-la-lune.mp3'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '96k', dest], check=True)
print(json.dumps(cut))
