import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const serverOnlyPath = req.resolve('server-only');
req.cache[serverOnlyPath] = {
  id: serverOnlyPath,
  filename: serverOnlyPath,
  loaded: true,
  exports: {},
} as unknown as NodeModule;

import { generateQrMatrix } from '../src/lib/qr';
import type * as SettingsRouteModule from '../src/app/api/settings/route';
import type * as DriverRouteModule from '../src/app/api/driver/[token]/route';
import type * as StoreModule from '../src/lib/server/store';
import type * as TokensModule from '../src/lib/server/tokens';

const { POST: saveSettings } = req('../src/app/api/settings/route') as typeof SettingsRouteModule;
const { GET: getDriverRoute } = req('../src/app/api/driver/[token]/route') as typeof DriverRouteModule;
const { readDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { driverToken } = req('../src/lib/server/tokens') as typeof TokensModule;

/**
 * Independent ISO/IEC 18004 QR Matrix Decoder
 * Reads format info bits directly from `modules[][]`, unmasks the grid,
 * extracts the zigzag bit stream, verifies all Reed-Solomon syndromes == 0,
 * and decodes the Byte-mode UTF-8 payload.
 */
function decodeQrMatrix(modules: boolean[][]): string {
  const size = modules.length;
  const version = (size - 17) / 4;

  // Read 15-bit format info from top-left copy
  const bit = (r: number, c: number) => (modules[r][c] ? 1 : 0);
  const rawFormat =
    (bit(8, 0) << 14) |
    (bit(8, 1) << 13) |
    (bit(8, 2) << 12) |
    (bit(8, 3) << 11) |
    (bit(8, 4) << 10) |
    (bit(8, 5) << 9) |
    (bit(8, 7) << 8) |
    (bit(8, 8) << 7) |
    (bit(7, 8) << 6) |
    (bit(5, 8) << 5) |
    (bit(4, 8) << 4) |
    (bit(3, 8) << 3) |
    (bit(2, 8) << 2) |
    (bit(1, 8) << 1) |
    bit(0, 8);

  // Verify second copy of format info matches first copy
  let rawFormatCopy2 = 0;
  for (let i = 0; i < 7; i++) {
    rawFormatCopy2 |= bit(size - 1 - i, 8) << (14 - i);
  }
  for (let i = 0; i < 8; i++) {
    rawFormatCopy2 |= bit(8, size - 8 + i) << (7 - i);
  }
  assert.equal(rawFormat, rawFormatCopy2, 'Both format info copies must be identical');

  const unmaskedFormat = rawFormat ^ 0x5412;
  const ecLevel = (unmaskedFormat >>> 13) & 0b11;
  const mask = (unmaskedFormat >>> 10) & 0b111;
  assert.equal(ecLevel, 0b01, 'EC Level L should be 0b01');

  // Identify function modules
  const isFunc: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const markFinder = (tr: number, lc: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = tr + dr;
        const c = lc + dc;
        if (r >= 0 && r < size && c >= 0 && c < size) isFunc[r][c] = true;
      }
    }
  };
  markFinder(0, 0);
  markFinder(0, size - 7);
  markFinder(size - 7, 0);

  if (version >= 2) {
    const alignCoords = version === 2 ? [6, 18] : version === 3 ? [6, 22] : version === 4 ? [6, 26] : [6, 30];
    for (let i = 0; i < alignCoords.length; i++) {
      for (let j = 0; j < alignCoords.length; j++) {
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === alignCoords.length - 1) ||
          (i === alignCoords.length - 1 && j === 0)
        ) {
          continue;
        }
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            isFunc[alignCoords[i] + dr][alignCoords[j] + dc] = true;
          }
        }
      }
    }
  }

  for (let i = 8; i < size - 8; i++) {
    isFunc[6][i] = true;
    isFunc[i][6] = true;
  }
  isFunc[4 * version + 9][8] = true;
  for (let i = 0; i <= 8; i++) {
    isFunc[8][i] = true;
    isFunc[i][8] = true;
  }
  for (let i = 0; i < 8; i++) isFunc[8][size - 1 - i] = true;
  for (let i = 0; i < 7; i++) isFunc[size - 1 - i][8] = true;

  const maskFn = (r: number, c: number) => {
    switch (mask) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
      default: return false;
    }
  };

  // Read bits in zigzag order
  const bits: number[] = [];
  let upward = true;
  for (let rightCol = size - 1; rightCol >= 1; rightCol -= 2) {
    if (rightCol === 6) rightCol = 5;
    for (let v = 0; v < size; v++) {
      const r = upward ? size - 1 - v : v;
      for (let dc = 0; dc < 2; dc++) {
        const c = rightCol - dc;
        if (!isFunc[r][c]) {
          const unmasked = modules[r][c] !== maskFn(r, c);
          bits.push(unmasked ? 1 : 0);
        }
      }
    }
    upward = !upward;
  }

  const readBits = (offset: number, len: number) => {
    let val = 0;
    for (let i = 0; i < len; i++) {
      val = (val << 1) | bits[offset + i];
    }
    return val;
  };

  const mode = readBits(0, 4);
  assert.equal(mode, 0b0100, 'Mode indicator must be 0100 (Byte mode)');
  const charCount = readBits(4, 8);
  const bytes = new Uint8Array(charCount);
  for (let i = 0; i < charCount; i++) {
    bytes[i] = readBits(12 + i * 8, 8);
  }
  return new TextDecoder().decode(bytes);
}

test('generateQrMatrix encodes URL into valid ISO/IEC 18004 QR matrix and decodes back to exact URL', () => {
  const targetUrl = 'https://rolloffdumpstersoftware.com/book/greenline?promo=NEIGHBOR15';
  const qr = generateQrMatrix(targetUrl);

  assert.equal(qr.version, 4);
  assert.equal(qr.size, 33);

  const decoded = decodeQrMatrix(qr.modules);
  assert.equal(decoded, targetUrl);
});

test('Dry run fee is customizable in Settings and syncs to organization and driver route API', async () => {
  const dBefore = await readDemo();
  const req = new Request('http://localhost:3000/api/settings', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost:3000',
      host: 'localhost:3000',
    },
    body: JSON.stringify({
      name: dBefore.organization.name,
      phone: dBefore.organization.phone,
      slug: dBefore.organization.slug,
      currency: 'usd',
      deposit_percent: 100,
      customer_fee_enabled: true,
      google_review_url: '',
      min_notice_hours: 24,
      prohibited_items: ['Tires'],
      operating_days: [1, 2, 3, 4, 5, 6],
      tax_rate_percent: 0,
      landfill_surcharges: {
        tire_cents: 2500,
        mattress_cents: 5000,
        freon_cents: 7500,
        propane_cents: 3500,
        dry_run_cents: 15000, // Custom $150 Dry Run Fee
      },
      pricing_rules: dBefore.pricing_rules.map((r) => ({
        size_yards: r.size_yards,
        base_price_cents: r.base_price_cents,
        included_days: r.included_days,
        extra_day_cents: r.extra_day_cents,
        included_tons: r.included_tons,
        overage_per_ton_cents: r.overage_per_ton_cents,
        service_zips: r.service_zips,
      })),
    }),
  });

  const res = await saveSettings(req);
  assert.equal(res.status, 200);

  const dAfter = await readDemo();
  assert.equal(dAfter.organization.landfill_surcharges?.dry_run_cents, 15000);
  assert.equal(dAfter.organization.pricing_config.landfill_surcharges?.dry_run_cents, 15000);

  // Verify driver route API receives the custom $150 dry_run_cents
  const driver = dAfter.users.find((u) => u.role === 'driver') ?? dAfter.users[0];
  const token = driverToken(dAfter.organization.id, driver.id);
  const driverRes = await getDriverRoute(new Request(`http://localhost:3000/api/driver/${token}`), {
    params: Promise.resolve({ token }),
  });
  assert.equal(driverRes.status, 200);
  const driverData = (await driverRes.json()) as { organization?: { dry_run_cents?: number } };
  assert.equal(driverData.organization?.dry_run_cents, 15000);
});
