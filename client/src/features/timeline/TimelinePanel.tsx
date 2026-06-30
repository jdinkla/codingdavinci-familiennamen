import { useEffect, useMemo, useRef, useState } from 'react';
import { axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import type { TimelineEntry } from '@familiennamen/shared';
import { CollapsiblePanel } from '../../components/CollapsiblePanel.js';
import { ApiError, getTimeline } from '../../lib/api.js';
import { getYears } from '../../lib/timelineTicks.js';
import { findNameIndex, getColorForName, getNames } from '../names/namesListReducer.js';
import { useNamesList } from '../names/NamesProvider.js';

/**
 * Port of public/javascripts/update_timeline.js (updateTimeline/resetTimeline)
 * plus the "Zeitreihe" panel in app_server/views/analysis.pug.
 *
 * Judgment calls versus the original:
 * - The original measured the SVG's pixel width dynamically from its DOM
 *   container (getSizes()) and scaled it by the separate "Skalierung in x"
 *   option (scale.x), which belongs to the "Optionen" panel out of this
 *   feature's scope. Here a fixed SVG_WIDTH is used instead, keeping the
 *   same left-margin/plot-area ratio (xOffset = width/12, plot edge =
 *   width*10/12) the original used for the x-scale's pixel range.
 * - TimelineEntry.begin/end are typed as `number | null` in the shared
 *   contract (the original's plain JS had no such guard). Entries with a
 *   null `begin` can't be positioned on the time axis, so they're excluded
 *   from both the x-domain calculation and rendering, and a result whose
 *   `name` is no longer in the current selection (a stale response after a
 *   name was removed) is likewise skipped rather than drawn at a bogus row.
 * - The tick label format used d3.format(" 4") (space-padded width 4) in
 *   the original purely for visual column alignment; ticks are rendered as
 *   plain numbers here.
 */

const ELEM_SIZE_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const DEFAULT_ELEM_X = 20;
const DEFAULT_ELEM_Y = 25;
const ELEM_DISTANCE = 5;
const SVG_WIDTH = 900;
const X_OFFSET = SVG_WIDTH / 12;
const PLOT_EDGE = SVG_WIDTH * (10 / 12);

export function TimelinePanel() {
  const { entries } = useNamesList();
  const [elemX, setElemX] = useState(DEFAULT_ELEM_X);
  const [elemY, setElemY] = useState(DEFAULT_ELEM_Y);
  const [data, setData] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const axisRef = useRef<SVGGElement | null>(null);

  const handleUpdate = async (): Promise<void> => {
    // Matches the original's `if (!$scope.lofn.isEmpty())` guard: with no
    // selected names, Aktualisieren no-ops rather than firing a request.
    if (entries.length === 0) return;

    setError('');
    setLoading(true);
    try {
      setData(await getTimeline(getNames(entries)));
    } catch (err) {
      setData([]);
      setError(err instanceof ApiError ? err.message : 'Leider gibt es ein Problem mit der Datenbank.');
    } finally {
      setLoading(false);
    }
  };

  // Matches the original's separate resetTimeline: clears the rendered
  // timeline only, the selected-names list itself is untouched.
  const handleClear = (): void => {
    setError('');
    setData([]);
  };

  // Rows to actually draw: a known begin year, and a name still present in
  // the current selection (see judgment-call note above).
  const rows = useMemo(
    () =>
      data
        .map((entry) => ({ entry, row: findNameIndex(entries, entry.name) }))
        .filter((d): d is { entry: TimelineEntry & { begin: number }; row: number } => typeof d.entry.begin === 'number' && d.row > -1),
    [data, entries]
  );

  // The original used `begin` alone for the domain (never `end`), despite
  // the axis ticks conceptually spanning begin-to-end -- preserved exactly.
  const begins = rows.map((d) => d.entry.begin);
  const minBegin = begins.length > 0 ? Math.min(...begins) : 0;
  const maxBegin = begins.length > 0 ? Math.max(...begins) : 0;

  const xScale = useMemo(() => scaleLinear().domain([minBegin, maxBegin]).range([X_OFFSET, PLOT_EDGE]), [minBegin, maxBegin]);

  const years = useMemo(() => (begins.length > 0 ? getYears(minBegin, maxBegin) : []), [begins.length, minBegin, maxBegin]);

  const numNames = entries.length;
  const svgHeight = (numNames + 1) * elemY;

  useEffect(() => {
    if (!axisRef.current) return;
    const axis = axisBottom(xScale)
      .tickValues(years)
      .tickFormat((d) => String(d));
    select(axisRef.current).call(axis);
  }, [xScale, years]);

  return (
    <CollapsiblePanel
      title="Zeitreihe"
      actions={
        <>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <label htmlFor="timelineElemX">Breite</label>
            <select
              id="timelineElemX"
              value={elemX}
              onChange={(event) => setElemX(Number(event.target.value))}
              className="rounded border border-gray-300 px-2 py-1"
            >
              {ELEM_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <label htmlFor="timelineElemY">Höhe</label>
            <select
              id="timelineElemY"
              value={elemY}
              onChange={(event) => setElemY(Number(event.target.value))}
              className="rounded border border-gray-300 px-2 py-1"
            >
              {ELEM_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
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
            title="Zeitreihe löschen"
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
      {rows.length === 0 ? (
        <p className="px-2 py-2 text-sm text-gray-500">Keine Daten vorhanden.</p>
      ) : (
        <div className="overflow-x-auto">
          <svg width={SVG_WIDTH} height={svgHeight}>
            {rows.map(({ entry, row }) => (
              <rect
                key={entry.id}
                x={xScale(entry.begin) - elemX / 2}
                y={row * elemY}
                width={elemX}
                height={Math.max(elemY - ELEM_DISTANCE, 0)}
                fill={getColorForName(entries, entry.name)}
              >
                <title>{`${entry.name}, ${entry.begin}-${entry.end}, ${entry.plz} ${entry.ort} (${entry.id})`}</title>
              </rect>
            ))}
            <g ref={axisRef} transform={`translate(0, ${numNames * elemY})`} />
          </svg>
        </div>
      )}
    </CollapsiblePanel>
  );
}
