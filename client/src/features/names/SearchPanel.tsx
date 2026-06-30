import { useState, type FormEvent } from 'react';
import { ApiError, getGraph, searchExact, searchLike, searchRegexp } from '../../lib/api.js';
import { useNamesList } from './NamesProvider.js';

type SearchType = 'exact' | 'like' | 'regexp' | 'similar';

const SEARCH_LABELS: Record<SearchType, string> = {
  exact: 'Suche exakt',
  like: 'Suche nach Like-Muster',
  regexp: 'Suche nach regulärem Ausdruck',
  similar: 'Suche ähnliche Namen in Graph',
};

/**
 * Matches the server's actual enforced rule (raw pattern.length < 4 for both
 * like and regexp, confirmed in server/src/validation/patternValidation.ts)
 * rather than the original AngularJS app's client-side hint, which used a
 * different, alphanumeric-stripped threshold per mode (3 for like, 4 for
 * regexp) that never matched what the server actually enforced.
 */
const MIN_PATTERN_LENGTH = 4;

async function runSearch(searchType: SearchType, searchText: string): Promise<string[]> {
  switch (searchType) {
    case 'exact':
      return searchExact(searchText);
    case 'like':
      return searchLike(searchText);
    case 'regexp':
      return searchRegexp(searchText);
    case 'similar': {
      const graph = await getGraph([searchText], 1);
      return graph.nodes.map((node) => node.id).filter((id) => id !== searchText);
    }
  }
}

export function SearchPanel() {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('exact');
  const [results, setResults] = useState<string[]>([]);
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { entries, addName, removeName, resetNames } = useNamesList();

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setWarning('');
    setError('');

    if ((searchType === 'like' || searchType === 'regexp') && searchText.length < MIN_PATTERN_LENGTH) {
      setWarning(`Das Suchmuster muss mindestens ${MIN_PATTERN_LENGTH} Zeichen enthalten.`);
      return;
    }

    setLoading(true);
    try {
      setResults(await runSearch(searchType, searchText));
    } catch (err) {
      setResults([]);
      setError(err instanceof ApiError ? err.message : 'Leider gibt es ein Problem mit der Datenbank.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <h3 className="text-lg font-medium">Suche nach Namen</h3>
        <form onSubmit={(event) => void handleSubmit(event)} className="mt-2 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="searchText">
              Suche
            </label>
            <input
              id="searchText"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            />
          </div>
          <fieldset className="space-y-1">
            <legend className="sr-only">Suchart</legend>
            {(Object.entries(SEARCH_LABELS) as [SearchType, string][]).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="searchType"
                  value={value}
                  checked={searchType === value}
                  onChange={() => setSearchType(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          {warning && (
            <p role="alert" className="rounded bg-amber-50 px-2 py-1 text-sm text-amber-800">
              {warning}
            </p>
          )}
          {error && (
            <p role="alert" className="rounded bg-red-50 px-2 py-1 text-sm text-red-800">
              {error}
            </p>
          )}
          <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50" disabled={loading}>
            {loading ? 'Suche läuft…' : SEARCH_LABELS[searchType]}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium">Ergebnisse der Suche</h3>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>Anzahl: {results.length}</span>
          <button type="button" className="text-gray-500 hover:text-gray-800" onClick={() => setResults([])}>
            Löschen
          </button>
        </div>
        <ul className="mt-2 max-h-64 divide-y divide-gray-100 overflow-y-auto">
          {results.map((name) => (
            <li key={name} className="flex items-center justify-between py-1 text-sm">
              <span>{name}</span>
              <span className="flex gap-2">
                <button type="button" title="Zur Auswahl hinzufügen" onClick={() => addName(name)}>
                  +
                </button>
                <button type="button" title="In Suchfenster kopieren" onClick={() => setSearchText(name)}>
                  ✎
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium">Ausgewählte Familiennamen</h3>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>Anzahl: {entries.length}</span>
          <button type="button" className="text-gray-500 hover:text-gray-800" onClick={resetNames}>
            Löschen
          </button>
        </div>
        <ul className="mt-2 max-h-64 divide-y divide-gray-100 overflow-y-auto">
          {entries.map((entry, index) => (
            <li key={entry.name} className="flex items-center justify-between py-1 text-sm">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="flex gap-2">
                <button type="button" title="Aus Liste entfernen" onClick={() => removeName(index)}>
                  −
                </button>
                <button type="button" title="In Suchfenster kopieren" onClick={() => setSearchText(entry.name)}>
                  ✎
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
