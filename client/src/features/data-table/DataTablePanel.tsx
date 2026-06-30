import { useState } from 'react';
import type { FokoRecord } from '@familiennamen/shared';
import { CollapsiblePanel } from '../../components/CollapsiblePanel.js';
import { ApiError, getFoko } from '../../lib/api.js';
import { getColorForName, getNames } from '../names/namesListReducer.js';
import { useNamesList } from '../names/NamesProvider.js';

/**
 * Port of public/javascripts/update_table.js (updateTable/resetTable) plus
 * the "Daten" panel in app_server/views/analysis.pug. Column order/headers
 * and the id/familyName/begin/end/submitter/denomination/country/region/
 * postalCode/placeName/placeURI field mapping are taken verbatim from the
 * original. Note the original's quirk, preserved here: the "Ort" column
 * shows the FokoRecord's placeName field, never its (also fetched) ort
 * field.
 */
export function DataTablePanel() {
  const [records, setRecords] = useState<FokoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { entries } = useNamesList();

  const handleUpdate = async (): Promise<void> => {
    // Matches the original's `if (!$scope.lofn.isEmpty())` guard: with no
    // selected names, Aktualisieren no-ops rather than firing a request.
    if (entries.length === 0) return;

    setError('');
    setLoading(true);
    try {
      setRecords(await getFoko(getNames(entries)));
    } catch (err) {
      setRecords([]);
      setError(err instanceof ApiError ? err.message : 'Leider gibt es ein Problem mit der Datenbank.');
    } finally {
      setLoading(false);
    }
  };

  // Matches the original's separate resetTable: clears the displayed table
  // only, the selected-names list itself is untouched.
  const handleClear = (): void => {
    setError('');
    setRecords([]);
  };

  return (
    <CollapsiblePanel
      title="Daten"
      actions={
        <>
          <button
            type="button"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            onClick={() => void handleUpdate()}
            disabled={loading}
          >
            {loading ? 'Lädt…' : 'Aktualisieren'}
          </button>
          <button
            type="button"
            title="Tabelle leeren"
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            onClick={handleClear}
          >
            🗑
          </button>
        </>
      }
    >
      {error && (
        <p role="alert" className="mb-3 rounded bg-red-50 px-2 py-1 text-sm text-red-800">
          {error}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="px-2 py-1">Id</th>
              <th className="px-2 py-1">Familienname</th>
              <th className="px-2 py-1">Startjahr</th>
              <th className="px-2 py-1">Endjahr</th>
              <th className="px-2 py-1">Submitter</th>
              <th className="px-2 py-1">Religion</th>
              <th className="px-2 py-1">Land</th>
              <th className="px-2 py-1">Region</th>
              <th className="px-2 py-1">PLZ</th>
              <th className="px-2 py-1">Ort</th>
              <th className="px-2 py-1">Link</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-gray-100">
                <td className="px-2 py-1">{record.id}</td>
                <td className="px-2 py-1">
                  <span style={{ color: getColorForName(entries, record.familyName) }}>{record.familyName}</span>
                </td>
                <td className="px-2 py-1">{record.begin}</td>
                <td className="px-2 py-1">{record.end}</td>
                <td className="px-2 py-1">{record.submitter}</td>
                <td className="px-2 py-1">{record.denomination}</td>
                <td className="px-2 py-1">{record.country}</td>
                <td className="px-2 py-1">{record.region}</td>
                <td className="px-2 py-1">{record.postalCode}</td>
                <td className="px-2 py-1">{record.placeName}</td>
                <td className="px-2 py-1">
                  {record.placeURI && (
                    <a href={record.placeURI} className="text-blue-600 underline">
                      {record.placeURI}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && records.length === 0 && <p className="px-2 py-2 text-sm text-gray-500">Keine Daten vorhanden.</p>}
      </div>
    </CollapsiblePanel>
  );
}
