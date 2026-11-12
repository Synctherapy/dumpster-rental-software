"""Foley + VO + score -> mix.wav for "The 7:40 on a Tuesday".

Every stroke on the board makes its own marker sound, shaped by the same hand-speed curve
the engine draws with; pan follows the stroke's screen x and level follows the camera's zoom.
Layers: room tone + wall clock | foley (marker, eraser, magnet, tray, whips) | VO | score.

Two near-silences carry the film: the music stops dead at 12.5 s and the wall clock owns the
room until 15.1, and it stops again at 56.45 so the call to action arrives over nothing.
"""
import sys, os, json
import numpy as np
import soundfile as sf
import soxr

ROOT = os.environ.get('LEMO_LIB', '/root/lemo-opuscar')
sys.path.insert(0, ROOT)
from core.audio.sfx import SR, bp, lp, hp, noise, add, compress, limit
from core.audio import sampler as S

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
E, DUR = ev['ev'], ev['dur']
C = next(e for e in E if e['type'] == 'cues')
rng = np.random.default_rng(23)
NS = int((DUR + 1) * SR)
fol = np.zeros((NS, 2), np.float32)
room = np.zeros((NS, 2), np.float32)
vo = np.zeros((NS, 2), np.float32)

tt = lambda d: np.arange(int(d * SR)) / SR
db = lambda x: 10 ** (x / 20)
dec = lambda d, tau: np.exp(-tt(d) / tau)

# ───────────────────────── marker on a glossy board
_band = {}
def band(n, lo, hi):
    k = (lo, hi)
    if k not in _band:
        _band[k] = bp(rng.standard_normal(SR * 8), lo, hi, 2).astype(np.float32)
    b = _band[k]
    i = int(rng.integers(0, len(b) - n - 1))
    return b[i:i + n]

def marker(dur, length, kind, pen, z=1.):
    d = max(.03, dur); n = int(d * SR); u = np.linspace(0, 1, n)
    v = 1 - .8 * np.cos(2 * np.pi * u)
    a = (v / 1.8) ** .8 * np.minimum(1, u * d / .006) * np.minimum(1, (1 - u) * d / .012)
    br = {'black': 1.0, 'orange': 1.12, 'blue': .92}.get(pen, 1.)
    hiss = band(n, 2200 * br, 7500 * br) * (.55 + .45 * v / 1.8)
    body = band(n, 500 * br, 1500 * br) * .45
    grain = (rng.random(n) < .004 * (1 + v)) * rng.standard_normal(n) * .8
    x = (hiss + body + bp(grain, 1500, 6000)) * a
    if length > 140 and rng.random() < .3:                       # the dry-erase squeak
        s0 = rng.uniform(.15, .55) * d
        sd = min(d - s0, rng.uniform(.06, .16))
        if sd > .03:
            m = int(sd * SR); ts = np.arange(m) / SR; f0 = rng.uniform(1500, 2600) * br
            f = f0 * (1 + .03 * np.sin(2 * np.pi * rng.uniform(7, 13) * ts) + .05 * rng.standard_normal() * ts / sd)
            sq = np.sin(2 * np.pi * np.cumsum(f) / SR) + .3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
            sq *= np.sin(np.pi * ts / sd) ** 1.5 * .35
            i0 = int(s0 * SR)
            x[i0:i0 + m] += sq[:len(x) - i0]
    k = int(.004 * SR)
    x[:k] += bp(rng.standard_normal(k), 2500, 6500) * np.linspace(1, 0, k) * 1.4      # nib lands
    return x * .32 * min(1.3, z ** .5)

def tap(z=1.):
    n = int(.03 * SR)
    return bp(rng.standard_normal(n), 1800, 6000) * dec(.03, .004) * 1.2 * .3 * min(1.3, z ** .5)

def ring(fs, taus, amps, d):
    x = np.zeros(int(d * SR)); t = tt(d)
    for f, ta, am in zip(fs, taus, amps):
        x += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / ta) * am
    return x

def magnet(big=1):
    d = .5; x = np.zeros(int(d * SR))
    k = int(.005 * SR)
    x[:k] += bp(rng.standard_normal(k), 2000, 9000) * np.linspace(1, 0, k) * 1.5
    x += ring([830, 1370, 2210, 3120], [.07, .05, .035, .02], [.35, .25, .15, .08], d)
    x += ring([140 + 30 * big], [.09 + .06 * big], [.9 + .6 * big], d) * .9
    return x * (.55 + .35 * big)

def eraser(d):
    n = int(d * SR); t = tt(d)
    base = bp(rng.standard_normal(n), 250, 2600) * .6 + bp(rng.standard_normal(n), 2500, 6000) * .15
    mod = .45 + .55 * np.abs(np.sin(np.pi * t / d * 7))
    a = np.minimum(1, t / .04) * np.minimum(1, (d - t) / .06)
    return base * mod * a * .5

def tray_clack(v=1.):
    d = .6; x = np.zeros(int(d * SR))
    for o, g in [(0, 1), (.075, .45), (.13, .2)]:
        i = int(o * SR); k = int(.008 * SR)
        x[i:i + k] += bp(rng.standard_normal(k), 1200, 6000) * np.linspace(1, 0, k) * g
        r = ring([620, 1180, 2350], [.05, .04, .03], [.4, .3, .15], .2) * g
        x[i:i + len(r)] += r
    return x * .7 * v

def cap_pop():
    d = .25; x = np.zeros(int(d * SR)); k = int(.07 * SR)
    x[:k] += bp(rng.standard_normal(k), 1200, 5000) * np.linspace(.2, 1, k) * .35
    p = ring([1750, 3400], [.03, .012], [.8, .3], d - .07)
    x[k:k + len(p)] += p
    x[k:k + 60] += rng.standard_normal(60) * .9
    return x * .6

def whoosh(d, v=1.):
    n = int(d * SR); t = tt(d)
    return bp(rng.standard_normal(n), 300, 2400) * np.sin(np.pi * t / d) ** 2 * .35 * v

def clock_tick(k):
    d = .25; y = np.zeros(int(d * SR))
    x = bp(rng.standard_normal(int(.004 * SR)), 3000, 9000) * 1.2
    y[:len(x)] += x
    y += ring([1250 if k % 2 else 1480, 2900], [.018, .01], [.35, .15], d)
    return y * .22

def dead_click():
    """the moment the line gives up and hands over to voicemail"""
    d = .3
    x = ring([320, 640], [.03, .02], [.5, .2], d)
    k = int(.004 * SR)
    x[:k] += bp(rng.standard_normal(k), 900, 4000) * np.linspace(1, 0, k) * .8
    return x * .5

def put(buf, x, t, g=1., pan=0.):
    if t < 0 or t >= DUR:
        return
    add(buf, np.asarray(x, np.float32), t, g, pan)

# ───────────────────────── foley from the film's own events
for e in E:
    ty, t = e['type'], e['t']
    pan = e.get('pan', 0); z = e.get('z', 1)
    off = db(-9) if e.get('on', 1) == 0 else 1.
    if ty in ('stroke', 'write'):
        put(fol, marker(e['dur'], e['len'], ty, e.get('pen'), z), t, off * (.8 if ty == 'write' else 1.), pan)
    elif ty == 'tap':
        put(fol, tap(z), t, off, pan)
    elif ty == 'erase':
        put(fol, eraser(e['dur']), t, 1.25, .05)
    elif ty == 'magnet_drop':
        put(fol, magnet(1), t, 1.15, .12)
    elif ty == 'tray':
        put(fol, tray_clack(), t, 1.0, -.2)
    elif ty == 'ring_stop':
        put(fol, dead_click(), t, 1.0, .1)

# the eraser arrives before it touches the board
put(fol, whoosh(.5, .7), C['ERASE0'] - .5, 1, .1)
# the first pen uncaps before the first mark
put(fol, cap_pop(), .52, 1, -.1)
# the pen caps and goes back in the tray at the very end
put(fol, whoosh(.55, .5), 59.42 - .55, 1, -.2)

# pens flying in and out of frame between long gaps
by_pen = {}
for e in E:
    if e['type'] in ('stroke', 'write', 'tap'):
        by_pen.setdefault(e['pen'], []).append(e)
for pen, L in by_pen.items():
    L.sort(key=lambda e: e['t'])
    for a, b in zip(L, L[1:]):
        if b['t'] - (a['t'] + a.get('dur', 0)) > .8:
            put(fol, whoosh(.38, .30), a['t'] + a.get('dur', 0), 1, .5)
            put(fol, whoosh(.42, .38), b['t'] - .42, 1, .4)
    put(fol, whoosh(.42, .38), L[0]['t'] - .42, 1, .4)

# camera moves: a soft air pass on every real travel
for t0, d, v in [(6.95, .78, .85), (15.00, .95, .80), (21.50, 1.60, .45), (24.30, .72, .80),
                 (29.25, .9, .40), (44.30, 1.10, .95), (47.55, 1.00, .70),
                 (51.80, 1.15, .65), (53.95, 1.05, .70)]:
    put(fol, whoosh(d, v), t0, 1, 0)

# ───────────────────────── room: tone, and the wall clock that owns the stop
tone = lp(rng.standard_normal(NS), 900) * .010 + lp(rng.standard_normal(NS), 180) * .012
room[:, 0] += tone
room[:, 1] += np.roll(tone, 311)
SIL0, SIL1 = 12.50, 15.10
ticks = list(np.arange(5.0, 12.5, 1.0)) + list(np.arange(12.5, 15.3, 1.0))
for k, t in enumerate(ticks):
    g = 2.3 if SIL0 - .1 <= t <= SIL1 + .2 else .75 + .05 * k      # the clock takes the room in the silence
    put(room, clock_tick(k), float(t), g, -.45)
room = S.room(room, size=.35, mix=.25)

# ───────────────────────── VO: 24k → 48k, compressed, a little room
vo_lines = json.load(open(os.path.join(HERE, 'lines.json')))
vo_t = {e['id']: e['t'] for e in E if e['type'] == 'vo'}
vo_mono = np.zeros(NS, np.float32)
for L in vo_lines:
    y, sr = sf.read(os.path.join(HERE, 'voices', L['id'] + '.wav'))
    if y.ndim > 1:
        y = y.mean(1)
    y = soxr.resample(y.astype(np.float32), sr, SR)
    i = int(vo_t[L['id']] * SR)
    vo_mono[i:i + len(y)] += y[:NS - i]
vo_mono = hp(vo_mono, 70)
vo_mono = compress(vo_mono / (np.abs(vo_mono).max() + 1e-9) * .8, thr=.2, ratio=3.0, att=.004, rel=.1)
vo[:, 0] = vo_mono
vo[:, 1] = vo_mono
vo = vo * .85 + S.room(vo, size=.2, mix=.1) * .15

# ───────────────────────── score, ducked under the voice
mus, _ = sf.read(os.path.join(HERE, 'music/score.wav'))
mus = mus[:NS]
if len(mus) < NS:
    mus = np.pad(mus, ((0, NS - len(mus)), (0, 0)))

env = np.abs(vo_mono)
win = int(.05 * SR)
env = np.convolve(env, np.ones(win) / win, 'same')
on = (env > .02).astype(np.float32)
att, rel = int(.06 * SR), int(.35 * SR)
dk = np.zeros(NS, np.float32)
g = 0.
for j in range(0, NS, 240):
    tgt = on[j]
    g += (tgt - g) * (240 / att if tgt > g else 240 / rel)
    dk[j:j + 240] = g
mus = mus * (1 - (1 - db(-9)) * dk)[:, None]

# the two full stops: the loss, and the breath before the call to action
for a, b, fade in [(SIL0, SIL1, .30), (56.45, 57.45, .22)]:
    i0, i1, f = int(a * SR), int(b * SR), int(fade * SR)
    mus[i0:i0 + f] *= np.linspace(1, 0, f)[:, None]
    mus[i0 + f:i1] = 0

# ───────────────────────── balance: voice on top, score under it, foley between
def rms(x):
    m = np.abs(x).max(1) > 1e-4
    return float(np.sqrt(np.mean(x[m] ** 2))) if m.any() else 1.

vo_r, mu_r, fo_r = rms(vo), rms(mus), rms(fol)
mix = vo + mus * (vo_r / mu_r) * db(-7.0) + fol * (vo_r / fo_r) * db(-11) + room
mix = np.stack([limit(mix[:, c], .95) for c in range(2)], 1)
sf.write(os.path.join(HERE, 'mix.wav'), mix[:int(DUR * SR)].astype(np.float32), SR)

stems = os.path.join(HERE, 'out/stems')
os.makedirs(stems, exist_ok=True)
for name, x in [('vo', vo), ('music', mus * (vo_r / mu_r) * db(-7.0)),
                ('foley', fol * (vo_r / fo_r) * db(-11)), ('room', room)]:
    sf.write(os.path.join(stems, name + '.wav'), x[:int(DUR * SR)].astype(np.float32), SR)
print('rms vo/music/foley dB:', round(20 * np.log10(vo_r), 1), round(20 * np.log10(mu_r), 1),
      round(20 * np.log10(fo_r), 1), '| peak', round(float(np.abs(mix).max()), 4))
