import { NextResponse } from 'next/server';
import { METRO_CITIES, findCityData } from '@/lib/city-zips';

const US_STATES: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH',
  oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  'district of columbia': 'DC', dc: 'DC',
};

const STATE_CODES = new Set(Object.values(US_STATES));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q) {
    return NextResponse.json({ ok: false, error: 'Query is required' }, { status: 400 });
  }

  // 1. Fast match against curated metro cities
  const localMatch = findCityData(q);
  if (localMatch) {
    return NextResponse.json({
      ok: true,
      city: localMatch.city,
      state: localMatch.state,
      zips: localMatch.zips,
      source: 'local',
    });
  }

  // 2. Check if the query is a 5-digit ZIP code (e.g. 78664)
  if (/^\d{5}$/.test(q)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://api.zippopotam.us/us/${q}`, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const place = data.places?.[0];
        const cityName = place?.['place name'];
        const stateCode = place?.['state abbreviation'];

        if (cityName && stateCode) {
          // Fetch all ZIP codes in this city
          const cityRes = await fetch(
            `https://api.zippopotam.us/us/${stateCode.toLowerCase()}/${encodeURIComponent(cityName.toLowerCase())}`
          );
          if (cityRes.ok) {
            const cityData = await cityRes.json();
            const allZips: string[] = Array.from(
              new Set((cityData.places || []).map((p: { 'post code': string }) => p['post code']).filter(Boolean))
            ) as string[];

            return NextResponse.json({
              ok: true,
              city: cityName,
              state: stateCode,
              zips: allZips.length ? allZips : [q],
              source: 'postal_lookup',
            });
          }

          return NextResponse.json({
            ok: true,
            city: cityName,
            state: stateCode,
            zips: [q],
            source: 'postal_lookup',
          });
        }
      }
    } catch {}
  }

  // 3. Check if query has "City, State" (e.g. "Frederick, MD" or "Round Rock, Texas")
  let parsedCity = q;
  let parsedState = '';

  if (q.includes(',')) {
    const parts = q.split(',');
    parsedCity = parts[0].trim();
    const rawState = parts[1].trim().toLowerCase();
    parsedState = US_STATES[rawState] || (STATE_CODES.has(rawState.toUpperCase()) ? rawState.toUpperCase() : '');
  } else {
    // Check if ends with a 2-letter state code e.g. "Frederick MD"
    const words = q.split(/\s+/);
    if (words.length > 1) {
      const last = words[words.length - 1].toUpperCase();
      if (STATE_CODES.has(last)) {
        parsedState = last;
        parsedCity = words.slice(0, -1).join(' ');
      }
    }
  }

  // 4. If we have a state code, query Zippopotam API for all ZIPs in that city/town
  if (parsedState && parsedCity) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const url = `https://api.zippopotam.us/us/${parsedState.toLowerCase()}/${encodeURIComponent(parsedCity.toLowerCase())}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const allZips: string[] = Array.from(
          new Set((data.places || []).map((p: { 'post code': string }) => p['post code']).filter(Boolean))
        ) as string[];

        if (allZips.length) {
          return NextResponse.json({
            ok: true,
            city: data['place name'] || parsedCity,
            state: parsedState,
            zips: allZips,
            source: 'dynamic_geocoding',
          });
        }
      }
    } catch {}
  }

  // 5. Fallback: If no state was specified, search across all states for this city name
  const commonStates = ['TX', 'FL', 'CA', 'NC', 'GA', 'OH', 'PA', 'IL', 'MI', 'TN', 'VA', 'WA', 'AZ', 'CO', 'MD', 'IN', 'ID', 'OR', 'MO'];
  for (const st of commonStates) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const url = `https://api.zippopotam.us/us/${st.toLowerCase()}/${encodeURIComponent(parsedCity.toLowerCase())}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const allZips: string[] = Array.from(
          new Set((data.places || []).map((p: { 'post code': string }) => p['post code']).filter(Boolean))
        ) as string[];

        if (allZips.length) {
          return NextResponse.json({
            ok: true,
            city: data['place name'] || parsedCity,
            state: st,
            zips: allZips,
            source: 'state_scan',
          });
        }
      }
    } catch {}
  }

  return NextResponse.json({
    ok: false,
    message: `Could not find postal codes for "${q}". Try typing "City, State" (e.g. "${q}, TX").`,
  });
}
