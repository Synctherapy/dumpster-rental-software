// RollOS — "The 7:40 on a Tuesday". Whiteboard Explainer. One continuous board, no hands.
// All times in seconds. VO starts live in VO; drawings hang off spoken words via at(id, word).
import * as W from './engine/wb.js';
import { clamp, lerp, TAU, mulberry } from '/core/lib.js';

const { INK } = W;
const ORANGE = '#e0601c';                                  // "the number that makes the case"
const BLUE = INK.blue;                                     // the customer and the signal
const BLACK = INK.black;                                   // the hauler's world, structure

export const BPM = 96, BEAT = 60 / BPM, BAR = BEAT * 4, T0 = 0;
export const VO = {
  v01: 0.50, v02: 3.30, v03: 7.10, v04: 11.30,
  v05: 15.20, v06: 20.40, v07: 24.60, v08: 28.60,
  v09: 32.40, v10: 35.90, v11: 38.30, v12: 41.30,
  v13: 45.30, v14: 48.80, v15: 52.80, v16: 56.60,
};
export const END = 60.0;

// ───────── board regions (world units, board 11000 × 5600)
const MONEY = [1500, 1200];          // $450 — written first, wiped, re-written last
const CLOCK = [2900, 820];           // the wall clock at 7:40
const TRUCK = [1300, 2900];          // roll-off truck + container
const PHONE = [2700, 2850];          // the call that rang out
const TURN = [4300, 1900];           // "booking needed you AWAKE"
const BOXES = [5400, 3050];          // sizes / rates / zips
const CAL = [8100, 3000];            // the calendar the booking lands on
const TICKS = [9300, 3100];          // size / date / paid
const DRIVER = [8200, 4350];         // driver phone, no app
const DUEL = [8000, 1500];           // $0 vs legacy

export async function build() {
  await W.loadFont('tech', 'fonts/EMSTech.json');
  const words = await (await fetch('voices/words.json')).json();
  const dur = await (await fetch('voices/dur.json')).json();
  const lines = await (await fetch('lines.json')).json();

  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const at = (id, w, k = 0, which = 1) => {
    let n = 0;
    for (const x of words[id]) if (norm(x[0]).startsWith(norm(w)) && n++ === k) return VO[id] + Math.max(0, x[which]);
    throw new Error(`word ${w} not in ${id}`);
  };
  const atS = (id, w, k = 0) => at(id, w, k, 1);
  const atE = (id, w, k = 0) => at(id, w, k, 2);
  const voEnd = id => VO[id] + dur[id];

  const tl = new W.Timeline();
  const K = new W.Pen('black', BLACK, { park: [2180, 1340] });
  const O = new W.Pen('orange', ORANGE, { park: [2360, 1160] });
  const B = new W.Pen('blue', BLUE, { park: [2060, 1420] });
  const T = W.text;

  // ───────── ghosts of the old lesson: a wiped week grid and a note that pays off at 22 s
  const ghosts = [];
  const gR = mulberry(2026);
  const gstyle = a => ({ w: 12, alpha: a, color: gR() < .25 ? '#8aa0c8' : '#9aa0a8' });
  for (let i = 0; i < 62; i++) {
    const x = gR() * 10400 + 300, y = gR() * 5000 + 300, k = gR();
    const o = gstyle(.045 + gR() * .04);
    if (k < .34) ghosts.push(...T(['mon', 'tue 8a', '2 yd', 'wed', 'inv 118', 'thu', '40 yd', 'fri', 'pickup'][i % 9], x, y, { h: 46 + gR() * 34, ...o }));
    else if (k < .58) ghosts.push(W.circle(x, y, 44 + gR() * 100, o));
    else if (k < .8) ghosts.push(...W.arrow(x, y, x + (gR() - .5) * 460, y + (gR() - .5) * 280, o));
    else ghosts.push(W.line(x, y, x + 180 + gR() * 420, y + (gR() - .5) * 70, o));
  }
  // the note the camera finds on the wide pull-back — the old method, still on the board
  ghosts.push(...T('call back?', 2330, 2070, { h: 150, w: 15, alpha: .085, color: '#8f959d' }));
  for (let i = 0; i <= 5; i++) ghosts.push(W.line(2270, 2240 + i * 76, 3270, 2236 + i * 76, { w: 9, alpha: .05, color: '#9aa0a8' }));
  for (let i = 0; i <= 4; i++) ghosts.push(W.line(2270 + i * 250, 2240, 2274 + i * 250, 2620, { w: 9, alpha: .05, color: '#9aa0a8' }));

  // ═════════ R1  the money, written into an empty frame
  const money = T('$450', MONEY[0], MONEY[1], { h: 300, align: 'center', w: 32 });
  tl.draw(O, money, 0.90, { by: atE('v01', 'dollars') - 0.05, tag: '$450' });

  // ═════════ R2  the clock: 7:40 on a Tuesday
  const [cx, cy] = CLOCK, CR = 250;
  tl.draw(K, [W.circle(cx, cy, CR, { w: 11, lap: .3 })], 3.52, { by: atS('v02', 'seven') - .05, tag: 'clockface' });
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const a = i * TAU / 12 - Math.PI / 2, r0 = CR - (i % 3 ? 26 : 46);
    ticks.push(W.line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (CR - 8), cy + Math.sin(a) * (CR - 8), { w: i % 3 ? 7 : 10, bow: 0 }));
  }
  tl.draw(K, ticks, atS('v02', 'seven'), { by: atS('v02', 'forty') - .04, minGap: .012, maxGap: .05, tag: 'ticks' });
  const clockLabel = T('7:40', cx, cy + CR + 190, { h: 128, align: 'center', w: 15 });
  tl.draw(K, clockLabel, atS('v02', 'forty') + .02, { by: 5.14, tag: '7:40' });
  const ha = (7 + 40 / 60) * TAU / 12 - Math.PI / 2, ma = (40 / 60) * TAU - Math.PI / 2;
  tl.draw(K, [W.line(cx, cy, cx + Math.cos(ha) * CR * .52, cy + Math.sin(ha) * CR * .52, { w: 14, bow: .006 }),
              W.line(cx, cy, cx + Math.cos(ma) * CR * .82, cy + Math.sin(ma) * CR * .82, { w: 11, bow: .006 })],
    5.20, { by: 5.78, tag: 'hands' });

  // ═════════ R3  where he actually was
  const [tx, ty] = TRUCK;
  const chassis = [
    W.line(tx - 620, ty + 150, tx + 560, ty + 150, { w: 12 }),               // frame rail
    W.line(tx + 560, ty + 150, tx + 580, ty + 40, { w: 11 }),
  ];
  const wheels = [W.circle(tx - 430, ty + 250, 98, { w: 11, lap: .28 }), W.circle(tx + 210, ty + 250, 98, { w: 11, lap: .28 }),
                  W.circle(tx + 390, ty + 250, 98, { w: 11, lap: .28 })];
  const cab = [W.poly([tx - 620, ty + 150, tx - 620, ty - 190, tx - 330, ty - 190, tx - 250, ty + 30, tx - 250, ty + 150], { w: 12 }),
               W.rect(tx - 590, ty - 160, 180, 150, { w: 8 })];
  const box = [W.poly([tx - 210, ty + 140, tx - 160, ty - 310, tx + 540, ty - 310, tx + 560, ty + 140, tx - 210, ty + 140], { w: 13 }),
               W.line(tx - 120, ty - 250, tx + 500, ty - 250, { w: 7 }),
               W.line(tx + 150, ty - 300, tx + 180, ty + 135, { w: 7 })];
  tl.draw(K, [...chassis, ...wheels], 7.28, { by: atS('v03', 'container') - .05, tag: 'chassis' });
  tl.draw(K, box, atS('v03', 'container'), { by: atS('v03', 'gloves') - .05, tag: 'container' });
  tl.draw(K, cab, atS('v03', 'gloves'), { by: voEnd('v03') + .1, tag: 'cab' });

  // ═════════ R4  the call that rang out
  const [px, py] = PHONE;
  const phBody = W.roundRect(px - 165, py - 300, 330, 600, 42, { w: 12, color: BLUE });
  const phScreen = W.roundRect(px - 128, py - 250, 256, 470, 14, { w: 6, color: BLUE, alpha: .75 });
  tl.draw(B, [phBody, phScreen], 10.30, { by: atS('v04', 'went'), tag: 'phone' });
  const rings = [];
  for (let i = 1; i <= 3; i++) rings.push(W.arc(px + 150, py - 210, 90 + i * 85, -1.15, .55, { w: 9, color: BLUE, alpha: .9 - i * .14 }));
  tl.draw(B, rings, atS('v04', 'went'), { by: atS('v04', 'voicemail') - .03, minGap: .02, tag: 'rings' });
  for (const r of rings) r.hide = t => t > 12.72;                            // the ringing stops
  // sits under the phone and clear of the bottom 12 %, which belongs to the subtitles
  const vmLabel = T('voicemail', px, py + 375, { h: 62, align: 'center', w: 9, color: BLUE });
  tl.draw(B, vmLabel, atS('v04', 'voicemail'), { by: voEnd('v04') + .06, tag: 'voicemail' });
  tl.cue(12.72, 'ring_stop');

  // ═════════ R5  the eraser takes it — the signature move
  const ERASE0 = 15.95;
  const eraseEnd = tl.erase(W.zigzag(MONEY[0] - 620, MONEY[1] - 260, 1240, 420, 4, 1), ERASE0, 1.75, { width: 230, strength: .88 });
  tl.cue(ERASE0, 'erase_in');

  // ═════════ R6  the turn: not slow — required
  const [ux, uy] = TURN;
  tl.draw(K, T('booking needed you', ux, uy - 150, { h: 104, align: 'center', w: 13 }), 24.88, { by: atS('v07', 'awake') - .06, tag: 'bookingneeded' });
  const awake = T('AWAKE', ux, uy + 150, { h: 240, align: 'center', w: 27 });
  tl.draw(K, awake, atS('v07', 'awake'), { by: voEnd('v07') - .09, tag: 'awake' });
  tl.draw(K, [W.line(ux - 400, uy + 252, ux + 400, uy + 262, { w: 13 }), W.line(ux + 396, uy + 320, ux - 396, uy + 310, { w: 13 })],
    voEnd('v07') + .14, { by: voEnd('v07') + .78, tag: 'underline' });

  // ═════════ R7  the pen draws the link and the camera rides it
  const LINKP = [[ux + 180, uy + 420], [ux + 520, uy + 700], [ux + 780, uy + 880], [BOXES[0] - 70, BOXES[1] + 30]];
  const linkLine = W.curve(LINKP, { w: 14 });
  tl.draw(K, [linkLine], 28.84, { by: voEnd('v08') + .22, tag: 'link' });

  // ═════════ R8  three minutes, once
  const [bx, by0] = BOXES;
  const BW = 470, BH = 250, GAPX = 600;
  const boxWords = ['SIZES', 'RATES', 'ZIPs'];
  const boxHit = [atS('v09', 'sizes'), atS('v09', 'rates'), atS('v09', 'zip')];
  // the three empty boxes arrive first, in the gap while the camera tracks in;
  // then each is filled exactly as he names it
  tl.draw(K, boxWords.map((_, i) => W.rect(bx + i * GAPX, by0, BW, BH, { w: 11, over: 9 })).flat(),
    30.92, { by: 32.30, minGap: .02, maxGap: .12, tag: 'boxes' });
  boxWords.forEach((w, i) => {
    const lim = i === 2 ? voEnd('v09') + .08 : boxHit[i + 1] - .08;
    tl.draw(K, T(w, bx + i * GAPX + BW / 2, by0 + BH / 2 + 26, { h: 86, align: 'center', w: 11 }),
      boxHit[i], { by: Math.min(boxHit[i] + .52, lim), tag: 'boxlabel' + i });
  });
  tl.draw(O, T('3 min', bx + GAPX + BW / 2, by0 - 150, { h: 150, align: 'center', w: 18 }), 35.98, { by: voEnd('v10') + .1, tag: '3min' });

  // ═════════ R9  the calendar, and the booking that lands on it
  const [kx, ky] = CAL;
  const calFrame = W.rect(kx, ky, 760, 560, { w: 12, over: 10 });
  const calGrid = [];
  for (let i = 1; i <= 3; i++) calGrid.push(W.line(kx, ky + 140 + (i - 1) * 140, kx + 760, ky + 142 + (i - 1) * 140, { w: 6, alpha: .85 }));
  for (let i = 1; i <= 4; i++) calGrid.push(W.line(kx + i * 152, ky + 140, kx + i * 152 + 3, ky + 560, { w: 6, alpha: .85 }));
  calGrid.push(W.line(kx, ky + 138, kx + 760, ky + 140, { w: 9 }));
  tl.draw(K, [calFrame, ...calGrid], 38.42, { by: voEnd('v11') + .18, minGap: .014, tag: 'calendar' });

  const PIN_FROM = [kx - 720, ky + 150], PIN_TO = [kx + 456, ky + 392];
  const PIN0 = 39.30, PIN1 = 40.02;                                            // lands on beat 1 of bar 17
  tl.cue(PIN1, 'magnet_drop');
  const pinAt = t => {
    if (t < PIN0) return null;
    const u = clamp((t - PIN0) / (PIN1 - PIN0)), e = u * u * (3 - 2 * u);
    return { x: lerp(PIN_FROM[0], PIN_TO[0], e), y: lerp(PIN_FROM[1], PIN_TO[1], e), lift: Math.sin(Math.PI * u) * .85 + (1 - u) * .15 };
  };

  // ═════════ R10  they do the asking: size, date, paid
  const [qx, qy] = TICKS;
  const tickWords = ['size', 'date', 'paid'];
  const tickHit = [atS('v12', 'size'), atS('v12', 'date'), atS('v12', 'pay')];
  tickWords.forEach((w, i) => {
    const y = qy + i * 190;
    const lim = i === 2 ? voEnd('v12') + .18 : tickHit[i + 1] - .2;
    tl.draw(B, [...T('✓', qx - 180, y + 30, { h: 110, w: 13, color: BLUE }), ...T(w, qx - 60, y + 24, { h: 92, w: 11, color: BLUE })],
      tickHit[i] - .12, { by: Math.min(tickHit[i] + .6, lim), tag: 'tick' + i });
  });

  // ═════════ R11  the driver: a text, and no app
  const [dx, dy] = DRIVER;
  tl.draw(B, [W.roundRect(dx - 150, dy - 270, 300, 540, 38, { w: 11, color: BLUE }),
              W.roundRect(dx - 112, dy - 150, 224, 120, 16, { w: 7, color: BLUE, alpha: .85 }),
              W.line(dx - 80, dy - 110, dx + 60, dy - 108, { w: 6, color: BLUE, alpha: .8 }),
              W.line(dx - 80, dy - 66, dx + 20, dy - 64, { w: 6, color: BLUE, alpha: .8 })],
    45.42, { by: atS('v13', 'text') + .22, tag: 'driverphone' });
  tl.draw(B, [W.curve([[dx - 80, dy + 90], [dx + 20, dy + 150], [dx + 100, dy + 110]], { w: 9, color: BLUE }),
              ...W.arrow(dx + 100, dy + 110, dx + 190, dy + 60, { w: 9, color: BLUE, head: 28 })],
    atS('v13', 'text') + .3, { by: atS('v13', 'no') - .05, tag: 'route' });
  // an app icon, struck through: "no app" said as a picture, not as text to read
  tl.draw(K, [W.roundRect(dx + 300, dy - 110, 190, 190, 34, { w: 11 }),
              W.line(dx + 268, dy + 112, dx + 522, dy - 142, { w: 15 })],
    atS('v13', 'no') - .02, { by: voEnd('v13') - .12, tag: 'noapp' });

  // ═════════ R12  the duel: two pens, two columns, one gap
  const [ex, ey] = DUEL;
  const LX = ex - 760, RX = ex + 780;
  tl.draw(K, [W.line(ex, ey - 380, ex + 8, ey + 520, { w: 10, alpha: .8 })], 47.78, { by: 48.06, tag: 'divider' });
  tl.draw(O, T('RollOS', LX, ey - 250, { h: 86, align: 'center', w: 11 }), 47.72, { by: 48.22, tag: 'lhead' });
  tl.draw(K, T('legacy software', RX, ey - 250, { h: 76, align: 'center', w: 10 }), 48.10, { by: 48.60, tag: 'rhead' });
  // the two numbers, written at the same moment by two different pens
  tl.draw(O, T('$0', LX, ey + 130, { h: 280, align: 'center', w: 30 }), atS('v14', 'zero'), { by: atS('v14', 'zero') + .48, tag: '$0' });
  tl.draw(K, T('$150-350', RX, ey + 110, { h: 150, align: 'center', w: 17 }), atS('v14', 'zero') + .04, { by: atS('v14', 'zero') + .9, tag: '$150' });
  tl.draw(O, T('/mo to start', LX, ey + 270, { h: 66, align: 'center', w: 8 }), atS('v14', 'month') - .13, { by: atS('v14', 'start') + .12, tag: 'lsub' });
  tl.draw(O, T('no contract', LX, ey + 400, { h: 72, align: 'center', w: 9 }), atS('v14', 'no'), { by: voEnd('v14') - .18, tag: 'lcon' });
  tl.draw(K, T('/mo + annual contract', RX, ey + 250, { h: 60, align: 'center', w: 8 }), atS('v14', 'no') + .06, { by: voEnd('v14') + .14, tag: 'rcon' });

  // ═════════ R13  the bookend: the same spot, the same number, kept
  const money2 = T('$450', MONEY[0], MONEY[1], { h: 300, align: 'center', w: 32 });
  tl.draw(O, money2, 53.34, { by: voEnd('v15') - .02, tag: '$450-again' });
  tl.draw(O, [W.circle(MONEY[0], MONEY[1] - 96, 470, { w: 15, lap: .34, a0: -2.4, ry: 300 })], 54.85, { by: 55.40, tag: 'circle1' });
  tl.draw(O, [W.circle(MONEY[0], MONEY[1] - 96, 510, { w: 14, lap: .28, a0: -1.9, ry: 330 })], 55.45, { by: 55.95, tag: 'circle2' });
  tl.cue(54.85, 'circle'); tl.cue(55.45, 'circle');

  // ═════════ R14  the call to action, in the same hand, under the money
  const brand = T('RollOS', MONEY[0], MONEY[1] + 460, { h: 150, align: 'center', w: 18 });
  const domain = T('rolloffdumpstersoftware.com', MONEY[0], MONEY[1] + 600, { h: 76, align: 'center', w: 9 });
  tl.draw(K, domain, 55.10, { by: 56.60, minGap: .012, maxGap: .05, tag: 'domain' });
  tl.draw(O, brand, 56.05, { by: 56.76, tag: 'brand' });
  tl.cue(59.42, 'tray');

  tl.end();

  // ───────── camera: nine distinct moves, no cuts on the board
  const cam = new W.Camera([
    [0.00, 1500, 1170, 1.16, 0, 'io'],
    [2.90, 1540, 1140, 1.11, 0, 'l'],                          // the slow drift under the hook
    [3.30, 1620, 1110, 1.05, 0, 'io'],
    [5.90, 2320, 1010, 0.70, .006, 'io'],                      // pull back, reveal the clock
    [6.95, 2350, 1030, 0.68, .006, 'l'],
    [7.70, 1320, 2880, 0.80, -.008, 'io'],                     // whip left to the truck
    [10.60, 1370, 2890, 0.78, -.008, 'l'],
    [11.60, 2760, 2890, 0.86, 0, 'io'],                        // across to the phone
    [13.10, 2730, 2860, 1.06, 0, 'io'],                        // slow push through the silence
    [15.00, 2720, 2850, 1.10, 0, 'l'],
    [15.95, 1500, 1160, 0.96, 0, 'io'],                        // return, and hold while it is wiped
    [19.90, 1510, 1170, 0.94, 0, 'l'],
    [23.60, 2700, 2050, 0.38, .004, 'io'],                     // pull back wide, past "call back?"
    [24.30, 2800, 2070, 0.37, .004, 'l'],
    [25.00, 4300, 1930, 0.84, 0, 'io'],                        // to the turn, and hold still
    [28.20, 4300, 1940, 0.82, 0, 'l'],
    [29.25, 4780, 2560, 0.80, 0, 'io'],                        // ride the line the pen draws
    [30.60, 5260, 3170, 0.78, 0, 'io'],
    [32.40, 5760, 3200, 0.74, 0, 'io'],                        // track right along the three boxes
    [35.10, 6380, 3110, 0.70, 0, 'io'],
    [37.30, 6410, 3090, 0.70, 0, 'l'],
    [38.60, 8460, 3270, 0.76, 0, 'io'],                        // follow the magnet onto the calendar
    [40.60, 8530, 3250, 0.78, 0, 'l'],
    [41.60, 9240, 3290, 0.88, 0, 'io'],                        // push into the three ticks
    [44.30, 9260, 3300, 0.94, 0, 'l'],
    [45.40, 8340, 4350, 0.95, .006, 'io'],                     // whip down to the driver
    [47.55, 8360, 4340, 0.93, .006, 'l'],
    [48.55, 8020, 1620, 0.78, 0, 'io'],                        // up to the duel, both columns held
    [51.80, 8020, 1630, 0.77, 0, 'l'],
    [52.95, 5500, 2800, 0.176, 0, 'io'],                       // the full-board view: the whole lesson
    [53.95, 5460, 2780, 0.173, 0, 'l'],
    [55.05, 1500, 1340, 0.855, 0, 'io'],                       // back into the money: circled, then
    [60.00, 1500, 1332, 0.862, 0, 'l'],                        // held so brand + domain can be read
  ]);

  // ───────── board, props
  const board = new W.Board(tl, { W: 11000, H: 5600, ghosts });
  for (const p of [K, O, B]) board.objs.push({ draw: (ctx, t, c) => W.drawMarker(ctx, p, W.penPose(p, t, cam), c, t) });
  for (const e of tl.erasers) board.objs.push({ draw: (ctx, t, c) => W.drawEraser(ctx, e, t, c) });
  board.objs.push({
    draw: (ctx, t, c) => { const p = pinAt(t); if (p) W.drawPinMagnet(ctx, p.x, p.y, c, { lift: p.lift, size: 150, color: ORANGE }); }
  });

  // ───────── subtitles: one per line, held for reading, never over the board's key action
  const subs = lines.map(L => ({ t0: VO[L.id], t1: VO[L.id] + dur[L.id] + .62, text: L.text }));
  for (let i = 0; i < subs.length; i++) {
    subs[i].t1 = Math.max(subs[i].t1, subs[i].t0 + 1.8);
    if (i < subs.length - 1) subs[i].t1 = Math.min(subs[i].t1, subs[i + 1].t0 - .05);
  }
  subs[subs.length - 1].t1 = Math.min(subs[subs.length - 1].t1, END - .12);
  window.__subs = subs;

  board.overlays.push({
    draw: (ctx, t) => {
      const s = subs.find(s => t >= s.t0 && t < s.t1); if (!s) return;
      const a = Math.min(1, (t - s.t0) / .12, (s.t1 - t) / .12);
      ctx.font = '44px AD';
      let rows = [s.text];
      if (ctx.measureText(s.text).width > 1180) {
        const ws = s.text.split(' '); let best = 1, bd = 1e9;
        for (let i = 1; i < ws.length; i++) {
          const d = Math.abs(ctx.measureText(ws.slice(0, i).join(' ')).width - ctx.measureText(ws.slice(i).join(' ')).width);
          if (d < bd) { bd = d; best = i; }
        }
        rows = [ws.slice(0, best).join(' '), ws.slice(best).join(' ')];
      }
      const w = Math.max(...rows.map(r => ctx.measureText(r).width)) + 64, h = 70 + (rows.length - 1) * 52, y0 = 1036 - h;
      ctx.globalAlpha = a * .9; ctx.fillStyle = '#fdfcf8';
      ctx.shadowColor = 'rgba(30,30,40,.18)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4;
      ctx.beginPath(); ctx.roundRect(960 - w / 2, y0, w, h, 14); ctx.fill();
      ctx.shadowColor = 'transparent'; ctx.globalAlpha = a;
      ctx.fillStyle = ORANGE; ctx.fillRect(960 - w / 2 + 22, y0 + h - 12, 36, 4);
      ctx.fillStyle = BLACK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      rows.forEach((r, i) => ctx.fillText(r, 960, y0 + 37 + i * 52));
    }
  });

  // ───────── texts exposed for readcheck
  const held = [];
  const span = (strokes, t1) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, tEnd = 0;
    for (const s of strokes) { x0 = Math.min(x0, s.box[0]); y0 = Math.min(y0, s.box[1]); x1 = Math.max(x1, s.box[2]); y1 = Math.max(y1, s.box[3]); tEnd = Math.max(tEnd, s.t1); }
    return { x0, y0, x1, y1, tEnd, t1 };
  };
  const reg = (id, strokes, t1) => held.push({ id, text: id, ...span(strokes, t1) });
  reg('$450', money, 15.95);
  reg('voicemail', vmLabel, 15.95);
  reg('7:40', clockLabel, 7.70);
  reg('AWAKE', awake, 29.1);
  reg('$450-again', money2, END);
  reg('RollOS', brand, END);
  reg('rolloffdumpstersoftware.com', domain, END);

  window.TEXTS = t => held.filter(h => t >= h.tEnd && t <= h.t1).map(h => {
    const c = cam.at(t), a = W.toScreen(c, h.x0, h.y0), b = W.toScreen(c, h.x1, h.y1);
    return { id: h.id, text: h.text, x0: a[0], y0: a[1], x1: b[0], y1: b[1] };
  });

  // ───────── render, with camera motion blur on the whips
  const off = new OffscreenCanvas(1920, 1080), oc = off.getContext('2d');
  const qp = new URLSearchParams(location.search);
  if (qp.has('nosubs')) board.overlays.length = 0;
  if (qp.has('nopens')) board.objs.length = 0;
  function render(ctx, t) {
    const dt = 1 / 24, a = cam.at(t), b = cam.at(Math.max(0, t - dt));
    const sp = Math.hypot((a.x - b.x) * a.z, (a.y - b.y) * a.z) + Math.abs(Math.log(a.z / b.z)) * 900;
    const N = sp > 14 ? Math.min(12, Math.ceil(sp * .5 / 4)) : 1;
    if (N === 1) { board.render(ctx, t, cam); return; }
    const ov = board.overlays; board.overlays = [];
    for (let i = 0; i < N; i++) {
      board.render(oc, t - dt * .5 * i / (N - 1), cam);
      ctx.globalAlpha = 1 / (i + 1); ctx.drawImage(off, 0, 0);
    }
    ctx.globalAlpha = 1; board.overlays = ov;
    for (const o of ov) { ctx.save(); o.draw(ctx, t); ctx.restore(); }
  }

  const ev = [...tl.ev, ...Object.entries(VO).map(([id, t]) => ({ t, type: 'vo', id }))].sort((a, b) => a.t - b.t);
  for (const e of ev) if (e.x != null) {
    const c = cam.at(e.t), [sx, sy] = W.toScreen(c, e.x, e.y);
    e.pan = +clamp((sx - 960) / 1400, -.7, .7).toFixed(2);
    e.z = +c.z.toFixed(2);
    e.on = sx > -100 && sx < 2020 && sy > -100 && sy < 1180 ? 1 : 0;
  }
  return { dur: END, render, ev, subs, cam, tl, VO, cues: { T0, BEAT, BAR, ERASE0, eraseEnd, PIN0, PIN1 } };
}
