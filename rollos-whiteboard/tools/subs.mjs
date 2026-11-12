// Export the burned-in subtitle timetable → out/subs.json (core/render/srt.py turns it into .srt).
// Reads them from the page itself, so the .srt can never drift from what is burned in.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const LIB = process.env.LEMO_LIB;
if (!LIB) { console.error('set LEMO_LIB to the Lemo-Opuscar library folder'); process.exit(1); }
const { openDemo, closeServer } = await import(LIB + '/core/render/page.mjs');
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { browser, page } = await openDemo(dir);
const subs = await page.evaluate(() => window.SUBS.map(s => ({ t0: +s.t0.toFixed(2), t1: +s.t1.toFixed(2), text: s.text })));
fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
fs.writeFileSync(path.join(dir, 'out/subs.json'), JSON.stringify(subs, null, 1));
console.log('subs', subs.length);
await browser.close(); closeServer();
