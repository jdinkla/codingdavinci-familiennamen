import type Database from 'better-sqlite3';

/**
 * Canonical fixture used by every endpoint group's unit + integration
 * tests, so all of them exercise identical, known data.
 *
 * foko_geo rows:
 *  - id 1,2: 'müller', two records (Munich 1500-1600, Berlin 1700-1800) —
 *    multi-row-per-name + ordering tests.
 *  - id 3: 'mueller' (Hamburg) — binary-exact-match isolation from 'müller'.
 *  - id 4: 'muller' (Cologne) — binary-exact-match isolation from both.
 *  - id 5: 'meier, von' (Bremen) — exercises a name with an embedded comma
 *    through the new ?names= query-string encoding end to end.
 *  - id 6: 'müller', begin=900 — BEFORE the `begin >= 1000` / `begin > 1000`
 *    cutoff every original query applies; must be excluded by it.
 *  - id 7: 'schmidt' (Frankfurt) — unrelated name, doubles as the
 *    no-edges/isolated node for graph tests.
 *
 * names/edges (for graph tests):
 *  - 'müller' -> 'amüller' (1-hop neighbor)
 *  - 'amüller' -> 'ameise' (2nd hop from 'müller', depth=2 only)
 *  - 'schmidt' has no edges (isolated node case)
 */
export const seedTestDb = (db: Database.Database): void => {
  const insertFoko = db.prepare(`
    INSERT INTO foko_geo
      (id, family_name, begin, end, submitter, denomination, country, region, postal_code, place_name, place_uri, lon, lat, ort)
    VALUES (@id, @familyName, @begin, @end, @submitter, @denomination, @country, @region, @postalCode, @placeName, @placeUri, @lon, @lat, @ort)
  `);

  const fokoRows = [
    {
      id: 1,
      familyName: 'müller',
      begin: 1500,
      end: 1600,
      submitter: '10',
      denomination: 'ev',
      country: 'D',
      region: 'BY',
      postalCode: '80331',
      placeName: 'München',
      placeUri: 'http://example.org/muenchen',
      lon: 11.5761,
      lat: 48.1372,
      ort: 'München',
    },
    {
      id: 2,
      familyName: 'müller',
      begin: 1700,
      end: 1800,
      submitter: '11',
      denomination: 'rk',
      country: 'D',
      region: 'BE',
      postalCode: '10115',
      placeName: 'Berlin',
      placeUri: 'http://example.org/berlin',
      lon: 13.405,
      lat: 52.52,
      ort: 'Berlin',
    },
    {
      id: 3,
      familyName: 'mueller',
      begin: 1500,
      end: 1600,
      submitter: '12',
      denomination: 'ev',
      country: 'D',
      region: 'HH',
      postalCode: '20095',
      placeName: 'Hamburg',
      placeUri: 'http://example.org/hamburg',
      lon: 9.9937,
      lat: 53.5511,
      ort: 'Hamburg',
    },
    {
      id: 4,
      familyName: 'muller',
      begin: 1500,
      end: 1600,
      submitter: '13',
      denomination: 'ev',
      country: 'D',
      region: 'NW',
      postalCode: '50667',
      placeName: 'Köln',
      placeUri: 'http://example.org/koeln',
      lon: 6.9603,
      lat: 50.9375,
      ort: 'Köln',
    },
    {
      id: 5,
      familyName: 'meier, von',
      begin: 1500,
      end: 1600,
      submitter: '14',
      denomination: 'ev',
      country: 'D',
      region: 'HB',
      postalCode: '28195',
      placeName: 'Bremen',
      placeUri: 'http://example.org/bremen',
      lon: 8.8017,
      lat: 53.0793,
      ort: 'Bremen',
    },
    {
      id: 6,
      familyName: 'müller',
      begin: 900,
      end: 950,
      submitter: '15',
      denomination: null,
      country: 'D',
      region: 'BY',
      postalCode: '80331',
      placeName: 'München',
      placeUri: 'http://example.org/muenchen',
      lon: 11.5761,
      lat: 48.1372,
      ort: 'München (vor 1000)',
    },
    {
      id: 7,
      familyName: 'schmidt',
      begin: 1500,
      end: 1600,
      submitter: '16',
      denomination: 'ev',
      country: 'D',
      region: 'HE',
      postalCode: '60311',
      placeName: 'Frankfurt',
      placeUri: 'http://example.org/frankfurt',
      lon: 8.6821,
      lat: 50.1109,
      ort: 'Frankfurt',
    },
  ];

  for (const row of fokoRows) insertFoko.run(row);

  const insertName = db.prepare('INSERT INTO names (name) VALUES (?)');
  for (const name of ['müller', 'amüller', 'ameise', 'schmidt']) insertName.run(name);

  const nameId = (name: string): number =>
    (db.prepare('SELECT id FROM names WHERE name = ?').get(name) as { id: number }).id;

  const insertEdge = db.prepare('INSERT INTO edges (source_id, target_id) VALUES (?, ?)');
  insertEdge.run(nameId('müller'), nameId('amüller'));
  insertEdge.run(nameId('amüller'), nameId('ameise'));
};
