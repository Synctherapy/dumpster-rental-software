"""Original score for "The 7:40 on a Tuesday" — clockwork minimalism, 96 BPM, A minor → C major.

The enemy in this film is time, so the ensemble is a clock: woodblock, marimba, pizzicato
cello and bass, glockenspiel, vibraphone. Structure follows the story rather than a loop —
it builds, stops dead for the loss, empties out, lifts a third into C for the turn, adds one
instrument per step of the mechanism, splits into two marimbas at two tempi for the price
duel and snaps them back to unison on "$0", then arrives.

Writes music/score.wav (stereo 48k).
"""
import sys, os, json
import numpy as np
import soundfile as sf

ROOT = os.environ.get('LEMO_LIB', '/root/lemo-opuscar')
sys.path.insert(0, ROOT)
from core.audio import sampler as S
from core.audio.sfx import SR

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
C = next(e for e in ev['ev'] if e['type'] == 'cues')
DUR = ev['dur']
BEAT, BAR = C['BEAT'], C['BAR']
S.seed(11)

N = []
def n(t, inst, p, d, v=.7, pan=0., g=1., **kw):
    N.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, gain=g, **kw))

bt = lambda b: b * BEAT                      # beat index → seconds
bar = lambda b: b * BAR                      # bar index  → seconds

CH = {'Am': ['A', 'C', 'E'], 'F': ['F', 'A', 'C'], 'C': ['C', 'E', 'G'],
      'G': ['G', 'B', 'D'], 'Dm': ['D', 'F', 'A'], 'Em': ['E', 'G', 'B']}
ROOTB = {'Am': 'A1', 'F': 'F1', 'C': 'C2', 'G': 'G1', 'Dm': 'D2', 'Em': 'E2'}
up = lambda p, k: S.name(S.midi(p) + k)

def arp(ch, oct=4):
    """eight eighth-notes: r 5 8 5 3 5 8 5 — a clock that keeps turning"""
    r = S.midi(CH[ch][0] + str(oct)); t3 = S.midi(CH[ch][1] + str(oct)); f5 = S.midi(CH[ch][2] + str(oct))
    if t3 < r: t3 += 12
    if f5 < r: f5 += 12
    return [r, f5, r + 12, f5, t3, f5, r + 12, f5]

def tick(b0, bars_n, level=1., pan=.3, every=1.):
    k = 0
    t = 0.
    while t < bars_n * 4:
        n(bt(b0 + t), 'woodblock', 'a' if k % 2 == 0 else 'b', None, .36 * level, pan, .55)
        k += 1; t += every

def marimba_bar(b0, ch, level=1., pan=-.18, oct=4, tempo=1.):
    for i, m in enumerate(arp(ch, oct)):
        n(bt(b0) + i * .5 * BEAT * tempo, 'marimba', m, .3, (.60 if i % 2 == 0 else .46) * level, pan, .9)

def pizz_bar(b0, ch, level=1.):
    n(bt(b0), 'contrabass_pizz', ROOTB[ch], .5, .72 * level, 0, 1.0)
    n(bt(b0 + 1), 'cellos_pizz', up(ROOTB[ch], 12), .45, .62 * level, .08, 1.05)
    n(bt(b0 + 2), 'cellos_pizz', up(ROOTB[ch], 19), .35, .46 * level, .12, .95)
    n(bt(b0 + 3), 'cellos_pizz', up(ROOTB[ch], 12), .4, .54 * level, .05, 1.0)

# ══════════════ bars 0–1 (0–5 s)  the hook: a metronome, nothing else
tick(0, 2, level=.9, every=1.)
n(bar(0), 'woodblock', 'a', None, .46, .3, .6)

# ══════════════ bars 2–4 (5–12.5 s)  agitate: the clock gains an ensemble
for k, ch in enumerate(['Am', 'Am', 'F']):
    b0 = (2 + k) * 4
    marimba_bar(b0, ch, level=.80 + .10 * k)
    pizz_bar(b0, ch, level=.70 + .12 * k)
    tick(b0, 1, level=.85 + .1 * k)
# a short rise into the stop
for i, p in enumerate(['A5', 'C6', 'E6']):
    n(bar(5) - BEAT * (1.5 - i * .5), 'glockenspiel', p, .3, .30 + .07 * i, .25, .55)

# ══════════════ bar 5 (12.5–15 s)  THE STOP — nothing. the wall clock owns it (mix.py)

# ══════════════ bars 6–7 (15–20 s)  the loss: one note per bar, falling
n(bar(6) + .22, 'glockenspiel', 'E5', 2.2, .34, .2, .55)
n(bar(6) + .22, 'vibraphone', 'A3', 3.0, .22, -.2, .5, attack=.25)
n(bar(7) + .1, 'glockenspiel', 'C5', 2.4, .30, .2, .55)
n(bar(7) + .1, 'contrabass_pizz', 'A1', .8, .34, 0, .7)

# ══════════════ bars 8–10 (20–27.5 s)  the turn: a third up, into C major
for k, ch in enumerate(['F', 'C', 'G']):
    b0 = (8 + k) * 4
    marimba_bar(b0, ch, level=.60 + .13 * k)
    tick(b0, 1, level=.55 + .1 * k)
    if k:
        pizz_bar(b0, ch, level=.50 + .14 * k)
n(bar(8), 'vibraphone', 'F3', 4.5, .30, -.25, .55, attack=.3)
n(bar(9), 'vibraphone', 'C4', 4.5, .28, -.25, .55, attack=.3)

# ══════════════ bars 11–16 (27.5–42.5 s)  the mechanism: one instrument added per step
MECH = ['C', 'Am', 'F', 'C', 'G', 'C']
for k, ch in enumerate(MECH):
    b0 = (11 + k) * 4
    lv = .72 + .05 * k
    marimba_bar(b0, ch, level=lv)
    tick(b0, 1, level=.62 + .05 * k)
    if k >= 1: pizz_bar(b0, ch, level=.58 + .06 * k)
    if k >= 2:
        for h in range(8):
            n(bt(b0 + h * .5), 'shaker', 'down' if h % 2 == 0 else 'up', None, .17 + .012 * k, -.32, .32)
    if k >= 3:
        n(bt(b0), 'glockenspiel', CH[ch][0] + '6', .9, .30, .3, .55)
        n(bt(b0 + 2.5), 'glockenspiel', CH[ch][2] + '5', .7, .24, .3, .5)
    if k >= 4:
        n(bt(b0), 'vibraphone', CH[ch][0] + '4', 2.2, .26, -.28, .5, attack=.12)

# ══════════════ bars 17–18 (42.5–47.5 s)  the money beat: warm
for k, ch in enumerate(['F', 'C']):
    b0 = (17 + k) * 4
    marimba_bar(b0, ch, level=.80)
    pizz_bar(b0, ch, level=.70)
    tick(b0, 1, level=.62)
    n(bt(b0), 'vibraphone', CH[ch][0] + '4', 2.4, .34, -.2, .6, attack=.1)
    n(bt(b0 + 2), 'vibraphone', CH[ch][2] + '4', 2.0, .28, .2, .55, attack=.1)
    n(bt(b0 + 1), 'glockenspiel', CH[ch][1] + '6', .8, .26, .3, .5)

# ══════════════ bars 19–20 (47.5–52.5 s)  the duel: two tempi, then unison on "$0"
SNAP = 48.80                                     # the moment the orange pen writes $0
b19 = 19 * 4
# the two copies diverge: one at tempo, one 8% faster
marimba_bar(b19, 'C', level=.62, pan=-.42, tempo=1.0)
marimba_bar(b19, 'C', level=.52, pan=.42, oct=5, tempo=0.92)
tick(b19, 1, level=.5)
# they snap back together exactly on the number
for i, m in enumerate(arp('C')):
    t = SNAP + i * .5 * BEAT
    if t < bar(21) - .05:
        n(t, 'marimba', m, .3, .66, -.30, .95)
        n(t, 'marimba', S.name(m + 12), .3, .52, .30, .9)
n(SNAP, 'glockenspiel', 'C6', 1.2, .40, .25, .6)
n(SNAP, 'contrabass_pizz', 'C2', .9, .60, 0, .95)
n(SNAP, 'cellos_pizz', 'C3', .7, .50, .05, .9)
b20 = 20 * 4
pizz_bar(b20, 'G', level=.66)
tick(b20, 1, level=.56)

# ══════════════ bars 21–22 (52.5–57.5 s)  arrival: the opening figure, now in major
for k, ch in enumerate(['C', 'C']):
    b0 = (21 + k) * 4
    marimba_bar(b0, ch, level=.92)
    pizz_bar(b0, ch, level=.82)
    tick(b0, 1, level=.80)
    for h in range(8):
        n(bt(b0 + h * .5), 'shaker', 'down' if h % 2 == 0 else 'up', None, .20, -.3, .34)
L = bar(21)
n(L, 'timpani', 'C3', 2.6, .56, 0, .8)
for p in ['C2', 'G2', 'C3', 'E3', 'G3', 'C4', 'E4', 'G4', 'C5']:
    n(L, 'harp', p, 3.2, .42, 0, .5)
n(L, 'vibraphone', 'C4', 4.0, .34, -.2, .6, attack=.06)
n(L, 'glockenspiel', 'C6', 2.2, .38, .3, .6)
# the two circles land on these
n(55.12, 'glockenspiel', 'E6', 1.1, .34, .18, .55)
n(55.90, 'glockenspiel', 'G6', 1.4, .36, .26, .58)

# ══════════════ bar 23 (57.5–60 s)  the tag: open, unresolved upward
n(bar(23), 'vibraphone', 'C4', 2.6, .30, -.18, .6, attack=.08)
n(bar(23), 'vibraphone', 'G4', 2.6, .26, .18, .55, attack=.08)
n(bar(23) + .5, 'glockenspiel', 'C6', 1.1, .32, .25, .55)
n(bar(23) + 1.1, 'glockenspiel', 'E6', 1.3, .30, .25, .55)
n(bar(23) + 1.9, 'glockenspiel', 'G6', 1.6, .30, .25, .55)
n(bar(23), 'contrabass_pizz', 'C2', 1.0, .36, 0, .7)

N = [e for e in N if e['t'] < DUR - .02]
N.sort(key=lambda e: e['t'])
mix = S.render(N, dur=DUR + 1, master=False)
mix = S.room(mix, size=.40, mix=.15)
os.makedirs(os.path.join(HERE, 'music'), exist_ok=True)
sf.write(os.path.join(HERE, 'music/score.wav'), mix.astype(np.float32), SR)
print('notes', len(N), 'peak', round(float(np.abs(mix).max()), 4), 'dur', round(len(mix) / SR, 2))
print('\n'.join(S.credits(sorted({e['inst'] for e in N}))))
