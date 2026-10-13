/**
 * Major US and Canadian metro areas with their standard service ZIP / postal codes.
 * Allows dumpster haulers to simply select or type their city name to auto-populate all delivery ZIP codes.
 */

export interface CityData {
  city: string;
  state: string;
  slugSuffix: string;
  zips: string[];
}

export const METRO_CITIES: CityData[] = [
  {
    city: 'Baltimore',
    state: 'MD',
    slugSuffix: 'baltimore',
    zips: [
      '21201', '21202', '21205', '21206', '21207', '21208', '21209', '21210',
      '21211', '21212', '21213', '21214', '21215', '21216', '21217', '21218',
      '21222', '21223', '21224', '21225', '21227', '21228', '21229', '21230',
      '21231', '21234', '21236', '21237', '21239', '21250',
    ],
  },
  {
    city: 'Seattle',
    state: 'WA',
    slugSuffix: 'seattle',
    zips: [
      '98101', '98102', '98103', '98104', '98105', '98106', '98107', '98108',
      '98109', '98112', '98115', '98116', '98117', '98118', '98119', '98121',
      '98122', '98125', '98126', '98133', '98134', '98136', '98144', '98146',
      '98177', '98178', '98199',
    ],
  },
  {
    city: 'Austin',
    state: 'TX',
    slugSuffix: 'austin',
    zips: [
      '78701', '78702', '78703', '78704', '78705', '78721', '78722', '78723',
      '78724', '78731', '78741', '78744', '78745', '78746', '78748', '78749',
      '78750', '78751', '78752', '78753', '78754', '78757', '78758', '78759',
    ],
  },
  {
    city: 'Houston',
    state: 'TX',
    slugSuffix: 'houston',
    zips: [
      '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009',
      '77019', '77024', '77025', '77027', '77030', '77042', '77056', '77057',
      '77063', '77077', '77079', '77082', '77098',
    ],
  },
  {
    city: 'Dallas',
    state: 'TX',
    slugSuffix: 'dallas',
    zips: [
      '75201', '75202', '75204', '75205', '75206', '75207', '75208', '75209',
      '75214', '75219', '75220', '75225', '75226', '75230', '75235', '75240',
      '75243', '75248', '75252', '75287',
    ],
  },
  {
    city: 'Denver',
    state: 'CO',
    slugSuffix: 'denver',
    zips: [
      '80202', '80203', '80204', '80205', '80206', '80207', '80209', '80210',
      '80211', '80212', '80214', '80216', '80218', '80219', '80220', '80222',
      '80223', '80224', '80230', '80231', '80236', '80237', '80238', '80239',
      '80246', '80247', '80249',
    ],
  },
  {
    city: 'Phoenix',
    state: 'AZ',
    slugSuffix: 'phoenix',
    zips: [
      '85003', '85004', '85006', '85007', '85008', '85012', '85013', '85014',
      '85015', '85016', '85017', '85018', '85020', '85021', '85022', '85023',
      '85024', '85027', '85028', '85029', '85032', '85034', '85040', '85044',
      '85048', '85050', '85054',
    ],
  },
  {
    city: 'Atlanta',
    state: 'GA',
    slugSuffix: 'atlanta',
    zips: [
      '30303', '30305', '30306', '30307', '30308', '30309', '30310', '30311',
      '30312', '30313', '30314', '30315', '30316', '30317', '30318', '30319',
      '30324', '30326', '30327', '30331', '30342', '30344',
    ],
  },
  {
    city: 'Miami',
    state: 'FL',
    slugSuffix: 'miami',
    zips: [
      '33101', '33125', '33126', '33127', '33128', '33129', '33130', '33131',
      '33132', '33133', '33134', '33135', '33136', '33137', '33138', '33139',
      '33140', '33141', '33142', '33145', '33150',
    ],
  },
  {
    city: 'Tampa',
    state: 'FL',
    slugSuffix: 'tampa',
    zips: [
      '33602', '33603', '33604', '33605', '33606', '33607', '33609', '33610',
      '33611', '33612', '33613', '33614', '33615', '33616', '33617', '33618',
      '33624', '33626', '33629', '33634',
    ],
  },
  {
    city: 'Chicago',
    state: 'IL',
    slugSuffix: 'chicago',
    zips: [
      '60601', '60602', '60603', '60604', '60605', '60606', '60607', '60608',
      '60610', '60611', '60612', '60613', '60614', '60615', '60616', '60618',
      '60622', '60625', '60640', '60647', '60654',
    ],
  },
  {
    city: 'Charlotte',
    state: 'NC',
    slugSuffix: 'charlotte',
    zips: [
      '28202', '28203', '28204', '28205', '28206', '28207', '28208', '28209',
      '28210', '28211', '28212', '28213', '28214', '28215', '28216', '28217',
      '28226', '28262', '28269', '28270', '28277',
    ],
  },
  {
    city: 'Nashville',
    state: 'TN',
    slugSuffix: 'nashville',
    zips: [
      '37201', '37203', '37204', '37205', '37206', '37207', '37208', '37209',
      '37210', '37211', '37212', '37213', '37214', '37215', '37216', '37217',
      '37218', '37219', '37220', '37221',
    ],
  },
  {
    city: 'Philadelphia',
    state: 'PA',
    slugSuffix: 'philadelphia',
    zips: [
      '19102', '19103', '19104', '19106', '19107', '19119', '19121', '19122',
      '19123', '19125', '19128', '19130', '19134', '19143', '19145', '19146',
      '19147', '19148',
    ],
  },
  {
    city: 'Boston',
    state: 'MA',
    slugSuffix: 'boston',
    zips: [
      '02108', '02109', '02110', '02111', '02113', '02114', '02115', '02116',
      '02118', '02119', '02120', '02121', '02122', '02124', '02125', '02127',
      '02128', '02129', '02130', '02131', '02134', '02135',
    ],
  },
  {
    city: 'Orlando',
    state: 'FL',
    slugSuffix: 'orlando',
    zips: [
      '32801', '32803', '32804', '32805', '32806', '32807', '32808', '32809',
      '32810', '32811', '32812', '32814', '32817', '32818', '32819', '32821',
      '32822', '32824', '32825', '32826', '32827', '32828', '32835', '32836',
    ],
  },
  {
    city: 'Las Vegas',
    state: 'NV',
    slugSuffix: 'las-vegas',
    zips: [
      '89101', '89102', '89103', '89104', '89106', '89107', '89108', '89109',
      '89110', '89113', '89117', '89118', '89119', '89120', '89121', '89122',
      '89123', '89128', '89129', '89130', '89131', '89134', '89135', '89138',
      '89139', '89141', '89144', '89145', '89147', '89148', '89149',
    ],
  },
  {
    city: 'San Antonio',
    state: 'TX',
    slugSuffix: 'san-antonio',
    zips: [
      '78201', '78202', '78203', '78204', '78205', '78207', '78208', '78209',
      '78210', '78212', '78213', '78216', '78217', '78228', '78229', '78230',
      '78232', '78240', '78247', '78248', '78249', '78250', '78251', '78258',
    ],
  },
  {
    city: 'San Diego',
    state: 'CA',
    slugSuffix: 'san-diego',
    zips: [
      '92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108',
      '92109', '92110', '92111', '92113', '92114', '92115', '92116', '92117',
      '92119', '92120', '92121', '92122', '92123', '92124', '92126', '92128',
    ],
  },
  {
    city: 'Columbus',
    state: 'OH',
    slugSuffix: 'columbus',
    zips: [
      '43201', '43202', '43203', '43204', '43205', '43206', '43207', '43209',
      '43210', '43211', '43212', '43213', '43214', '43215', '43219', '43220',
      '43221', '43222', '43223', '43224', '43227', '43228', '43229', '43230',
    ],
  },
  {
    city: 'Indianapolis',
    state: 'IN',
    slugSuffix: 'indianapolis',
    zips: [
      '46201', '46202', '46203', '46204', '46205', '46208', '46214', '46218',
      '46219', '46220', '46222', '46224', '46225', '46226', '46227', '46228',
      '46229', '46234', '46235', '46240', '46250', '46254', '46256', '46260',
    ],
  },
  {
    city: 'Minneapolis',
    state: 'MN',
    slugSuffix: 'minneapolis',
    zips: [
      '55401', '55402', '55403', '55404', '55405', '55406', '55407', '55408',
      '55409', '55410', '55411', '55412', '55413', '55414', '55415', '55416',
      '55417', '55418', '55419', '55422', '55424', '55426', '55430',
    ],
  },
  {
    city: 'Portland',
    state: 'OR',
    slugSuffix: 'portland',
    zips: [
      '97201', '97202', '97203', '97204', '97205', '97206', '97209', '97210',
      '97211', '97212', '97213', '97214', '97215', '97216', '97217', '97218',
      '97219', '97220', '97221', '97222', '97223', '97224', '97225', '97227',
    ],
  },
  {
    city: 'Victoria',
    state: 'BC',
    slugSuffix: 'victoria',
    zips: [
      'V8P 1A1', 'V8R 1B2', 'V8S 1C3', 'V8T 1D4', 'V8V 1E5', 'V8W 1W4', 'V8X 1Y1',
      'V8Z 1Z2', 'V9A 2A1', 'V9B 2B2',
    ],
  },
  {
    city: 'Vancouver',
    state: 'BC',
    slugSuffix: 'vancouver',
    zips: [
      'V5K 1A1', 'V5L 1B2', 'V5M 1C3', 'V5N 1D4', 'V5P 1E5', 'V5R 1F6', 'V5S 1G7',
      'V5T 1H8', 'V5V 1J9', 'V5W 1K1', 'V5X 1L2', 'V5Y 1M3', 'V5Z 1N4', 'V6A 1P5',
      'V6B 1Q6', 'V6C 1R7', 'V6E 1S8', 'V6G 1T9', 'V6H 1U1', 'V6J 1V2', 'V6K 1W3',
    ],
  },
];

export function findCityData(search: string): CityData | null {
  if (!search || !search.trim()) return null;
  const raw = search.trim();
  const normalized = raw.toLowerCase().replace(/[,.]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Direct ZIP code match (e.g. "78704" -> Austin, TX)
  const zipMatch = METRO_CITIES.find((c) => c.zips.includes(raw.toUpperCase()));
  if (zipMatch) return zipMatch;

  // 2. Exact or combined "city state" match (e.g. "Austin Texas", "Austin TX", "Austin")
  return (
    METRO_CITIES.find((c) => {
      const cityLower = c.city.toLowerCase();
      const stateLower = c.state.toLowerCase();
      return (
        cityLower === normalized ||
        `${cityLower} ${stateLower}` === normalized ||
        c.slugSuffix === normalized
      );
    }) ||
    METRO_CITIES.find((c) => normalized.startsWith(c.city.toLowerCase())) ||
    METRO_CITIES.find((c) => c.city.toLowerCase().startsWith(normalized)) ||
    null
  );
}

/**
 * Generates a clean URL slug for a dumpster business:
 * e.g. "Apex Dumpsters" -> "apex-dumpsters"
 * With city disambiguation: "Apex Dumpsters" in Baltimore -> "apex-dumpsters-baltimore"
 */
export function generateCleanSlug(companyName: string, city?: string): string {
  const base = companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!base) return 'dumpster-rentals';

  if (city && city.trim()) {
    const cleanCity = city
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Only append city if base doesn't already contain it
    if (cleanCity && !base.includes(cleanCity)) {
      return `${base}-${cleanCity}`;
    }
  }

  return base;
}

/**
 * Resolves delivery ZIP codes for any city, town, or postal code.
 * Checks instant local cache first, then falls back to live postal lookup.
 */
export async function resolveCityZips(
  search: string
): Promise<{ city: string; state?: string; zips: string[] } | null> {
  if (!search || !search.trim()) return null;
  const local = findCityData(search);
  if (local) {
    return { city: local.city, state: local.state, zips: local.zips };
  }

  try {
    const res = await fetch(`/api/cities/zips?q=${encodeURIComponent(search.trim())}`);
    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.zips?.length) {
        return { city: data.city, state: data.state, zips: data.zips };
      }
    }
  } catch {}
  return null;
}
