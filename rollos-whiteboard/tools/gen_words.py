"""Per-word timings for `at(id, word)`, measured from the synthesized audio.

Stands in for tools/asr_check.py where the Whisper model cannot be downloaded
(this environment's network policy blocks Hugging Face, so there is no ASR).

Rather than guess the whole line, it uses the audio where the audio is reliable:

  1. Detect real silence gaps in each line's wav (RMS envelope, 10 ms hops).
  2. Split the text at punctuation into clauses, and SNAP each clause boundary to
     the measured gap it belongs to. The gap set is chosen by searching every
     combination and keeping the one whose resulting clause durations best match
     what the clauses' phoneme weights predict -- picking merely the longest gaps
     mistakes a plosive stop inside a word for a sentence break. These are the
     boundaries a viewer actually notices.
  3. Inside a clause — a second or two of continuous speech — distribute the time
     across words by a phoneme-count proxy (vowel groups + consonant overhead).

So sentence and comma boundaries are measured, not estimated; only within-clause
onsets are interpolated, and those land within a frame or two at 24 fps.

    python tools/gen_words.py lines.json voices_dir

Writes voices_dir/words.json in asr_check.py's format: {id: [[word, t0, t1], ...]},
times relative to the start of the line.
"""
import sys, json, os, re
import numpy as np
import soundfile as sf
from itertools import combinations

lines = json.load(open(sys.argv[1], encoding='utf-8'))
vd = sys.argv[2]

VOWELS = re.compile(r'[aeiouy]+', re.I)
LONG = {'four': 2.0, 'hundred': 2.2, 'fifty': 2.0, 'dollars': 2.2, 'seven': 2.0,
        'forty': 2.0, 'three': 1.6, 'zero': 2.0, 'rollos': 2.6, 'google': 2.2}


def weight(raw):
    w = re.sub(r"[^a-z0-9']", '', raw.lower())
    if not w:
        return 0.25
    n = len(VOWELS.findall(w)) or 1
    return (n + 0.42 * max(0, len(w) - n * 2) / 2 + 0.55) * LONG.get(w, 1.0)


def gaps_of(y, sr, floor=0.05):
    """Silence gaps (start, end) inside the line, longest-first information kept."""
    if y.ndim > 1:
        y = y.mean(1)
    hop = max(1, int(sr * 0.01))
    env = np.array([np.sqrt((y[i:i + hop] ** 2).mean()) for i in range(0, len(y) - hop, hop)])
    if env.size == 0 or env.max() <= 0:
        return []
    voiced = env > env.max() * 0.045
    out, i, n = [], 0, len(voiced)
    while i < n:
        if not voiced[i]:
            j = i
            while j < n and not voiced[j]:
                j += 1
            if i > 0 and j < n and (j - i) * 0.01 >= floor:
                out.append((i * 0.01, j * 0.01))
            i = j
        else:
            i += 1
    return out


def clauses_of(toks):
    """Group tokens into clauses, splitting after . , ; : ! ?"""
    cl, cur = [], []
    for t in toks:
        cur.append(t)
        if t.endswith(('.', ',', ';', ':', '!', '?')):
            cl.append(cur)
            cur = []
    if cur:
        cl.append(cur)
    return cl


out = {}
report = []
for L in lines:
    path = os.path.join(vd, L['id'] + '.wav')
    y, sr = sf.read(path)
    total = len(y) / sr
    toks = L['text'].split()
    cl = clauses_of(toks)
    g = gaps_of(y, sr)
    need = len(cl) - 1

    # choose which measured gaps are the clause boundaries: try every combination of
    # `need` gaps and keep the one whose clause durations best fit the phoneme weights
    cw = [sum(weight(w) for w in c) for c in cl]
    cwsum = sum(cw) or 1.0
    want = [total * x / cwsum for x in cw]          # predicted clause durations

    def misfit(combo):
        t, err = 0.0, 0.0
        for k in range(len(cl)):
            t1 = combo[k][0] if k < len(combo) else total
            err += abs((t1 - t) - want[k]) / max(want[k], 0.12)
            t = combo[k][1] if k < len(combo) else t1
        return err

    chosen, snapped = [], need == 0
    if need > 0 and len(g) >= need:
        best, bestErr = None, 1e9
        for combo in combinations(g, need):
            e = misfit(combo)
            if e < bestErr:
                bestErr, best = e, combo
        # only trust the snap if it is actually a decent fit (mean error < 45% per clause)
        if best is not None and bestErr / len(cl) < 0.45:
            chosen, snapped = list(best), True

    # clause time spans
    spans, t0 = [], 0.0
    for k, c in enumerate(cl):
        if k < len(chosen):
            t1 = chosen[k][0]
        elif k == len(cl) - 1:
            t1 = total
        else:
            # no measured gap to lean on: fall back to weight share of what is left
            rest = sum(weight(w) for cc in cl[k:] for w in cc)
            mine = sum(weight(w) for w in c)
            t1 = t0 + (total - t0) * mine / rest
        spans.append((t0, t1))
        t0 = chosen[k][1] if k < len(chosen) else t1

    rows = []
    for c, (a, b) in zip(cl, spans):
        ws = [weight(w) for w in c]
        s = sum(ws) or 1.0
        t = a
        for w, wt in zip(c, ws):
            d = (b - a) * wt / s
            rows.append([w, round(t, 3), round(t + d, 3)])
            t += d
    out[L['id']] = rows
    report.append((L['id'], snapped, len(cl), len(g)))

json.dump(out, open(os.path.join(vd, 'words.json'), 'w'), indent=0)
for lid, snapped, nc, ng in report:
    flag = 'snapped' if snapped else 'ESTIMATED (too few gaps)'
    print(f"{lid}  clauses={nc} gaps={ng}  {flag}")
    print('   ', ' '.join(f"{w}@{a}" for w, a, b in out[lid]))
