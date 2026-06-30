import { useEffect, useState } from 'react';
import type { FokoRecord } from '@familiennamen/shared';
import { ApiError, getFokoSample } from '../../lib/api.js';

/**
 * Ported from app_server/views/data/foko.pug. The original fetched the full
 * ~100MB foko.csv into the browser with d3.tsv and spliced it down to the
 * first 1000 rows client-side; getFokoSample() replaces that by returning an
 * already-truncated sample from the server, but keeps the same "first 1000
 * records" framing and the same 11-column table.
 */
export function Foko() {
  const [records, setRecords] = useState<FokoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    // No setLoading(true)/setError('') here: the effect runs exactly once
    // (mount), and the initial useState values already cover that case.
    getFokoSample()
      .then((data) => {
        if (!cancelled) setRecords(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Leider gibt es ein Problem mit der Datenbank.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">foko.csv</h1>
      <p>
        Folgende Datensätze sind in der Datei foko.csv vorhanden (aus Performancegründen werden nur 1000 Datensätze
        dargestellt).
      </p>

      {loading && <p className="text-sm text-gray-600">Lädt…</p>}
      {error && (
        <p role="alert" className="rounded bg-red-50 px-2 py-1 text-sm text-red-800">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="px-2 py-1 font-medium text-gray-700">id</th>
                <th className="px-2 py-1 font-medium text-gray-700">familyName</th>
                <th className="px-2 py-1 font-medium text-gray-700">begin</th>
                <th className="px-2 py-1 font-medium text-gray-700">end</th>
                <th className="px-2 py-1 font-medium text-gray-700">submitter</th>
                <th className="px-2 py-1 font-medium text-gray-700">denomination</th>
                <th className="px-2 py-1 font-medium text-gray-700">country</th>
                <th className="px-2 py-1 font-medium text-gray-700">region</th>
                <th className="px-2 py-1 font-medium text-gray-700">postalCode</th>
                <th className="px-2 py-1 font-medium text-gray-700">placeName</th>
                <th className="px-2 py-1 font-medium text-gray-700">placeURI</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 odd:bg-gray-50">
                  <td className="px-2 py-1">{record.id}</td>
                  <td className="px-2 py-1">{record.familyName}</td>
                  <td className="px-2 py-1">{record.begin ?? ''}</td>
                  <td className="px-2 py-1">{record.end ?? ''}</td>
                  <td className="px-2 py-1">{record.submitter ?? ''}</td>
                  <td className="px-2 py-1">{record.denomination ?? ''}</td>
                  <td className="px-2 py-1">{record.country ?? ''}</td>
                  <td className="px-2 py-1">{record.region ?? ''}</td>
                  <td className="px-2 py-1">{record.postalCode ?? ''}</td>
                  <td className="px-2 py-1">{record.placeName ?? ''}</td>
                  <td className="px-2 py-1">
                    {record.placeURI ? (
                      <a className="text-blue-600 hover:underline" href={record.placeURI} target="_blank" rel="noreferrer">
                        {record.placeURI}
                      </a>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
