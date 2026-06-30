import { useMemo, useState } from 'react';
import { geoCentroid, geoMercator, geoPath, interpolateGreys, type GeoPath, type GeoProjection } from 'd3';
import type { Feature, FeatureCollection } from 'geojson';
import type { MapPoint } from '@familiennamen/shared';
import { CollapsiblePanel } from '../../components/CollapsiblePanel.js';
import { ApiError, getMap } from '../../lib/api.js';
import { getColorForName, getNames } from '../names/namesListReducer.js';
import { useNamesList } from '../names/NamesProvider.js';

interface MapFileOption {
  label: string;
  url: string;
}

/**
 * The exact two map files the original UI offered (`$scope.mapDataFiles` in
 * public/javascripts/famvis.js). A `plz2.json` file also exists under
 * client/public/data/ but was never wired into the original dropdown
 * (confirmed by grepping the original source) - it stays unreferenced here.
 */
const MAP_FILES: MapFileOption[] = [
  { label: 'Bundesländer', url: '/data/d_mit_bundeslaendern.json' },
  { label: 'PLZ-Gebiete, einstellig', url: '/data/plz1.json' },
];

// Same 1-20 range as the original's shared `sizes` array (radiusOfElem).
const ELEMENT_SIZES = Array.from({ length: 20 }, (_, index) => index + 1);
const DEFAULT_ELEMENT_SIZE = 7; // original `$scope.sizeMapElem` default

// The original sized the SVG from window dimensions times an Optionen-panel
// scale factor (scale.x/scale.y), which lived in a different panel that is
// out of scope for this component. A fixed viewport keeps the projection
// math (and its tests) deterministic.
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 500;
const INITIAL_SCALE = 150; // first argument to the original's getPandP(150, ...)

interface FittedProjection {
  projection: GeoProjection;
  path: GeoPath;
}

/**
 * Port of getPandP from public/javascripts/browser_utils.js: project a
 * first-guess geoMercator centered on the GeoJSON's centroid, measure the
 * *actual* rendered bounds of that guess via path.bounds(), then recompute
 * scale/translate from those measured bounds (including the original's 1.1
 * fudge-factor division on the second-pass scale).
 */
function fitProjection(geoData: FeatureCollection, width: number, height: number): FittedProjection {
  const center = geoCentroid(geoData);
  const offset: [number, number] = [width / 2, height / 2];

  const firstGuess = geoMercator().scale(INITIAL_SCALE).center(center).translate(offset);
  const firstPath = geoPath(firstGuess);

  const bounds = firstPath.bounds(geoData);
  const hscale = (INITIAL_SCALE * width) / (bounds[1][0] - bounds[0][0]);
  const vscale = (INITIAL_SCALE * height) / (bounds[1][1] - bounds[0][1]);
  const scale = hscale < vscale ? hscale : vscale;
  const newOffset: [number, number] = [
    width - (bounds[0][0] + bounds[1][0]) / 2,
    height - (bounds[0][1] + bounds[1][1]) / 2,
  ];

  const projection = geoMercator().center(center).scale(scale / 1.1).translate(newOffset);
  const path = geoPath(projection);

  return { projection, path };
}

interface PositionedPoint {
  point: MapPoint;
  x: number;
  y: number;
}

/**
 * Port of public/javascripts/update_map.js (updateMap) plus the "Karte"
 * panel in app_server/views/analysis.pug. The original drew the GeoJSON
 * background and data points with imperative D3 .append() calls against a
 * raw <svg>; here D3 only supplies the math (projection fitting, greyscale
 * interpolation) and React/JSX renders the actual <path>/<circle> elements.
 */
export function MapPanel() {
  const { entries } = useNamesList();
  const [mapFile, setMapFile] = useState(MAP_FILES[0]!.url);
  const [elementSize, setElementSize] = useState(DEFAULT_ELEMENT_SIZE);
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (): Promise<void> => {
    // Matches the original's `if (!$scope.lofn.isEmpty())` guard: with no
    // selected names, Aktualisieren no-ops rather than firing a request.
    if (entries.length === 0) return;

    setError('');
    setLoading(true);
    try {
      const geoResponse = await fetch(mapFile);
      if (!geoResponse.ok) {
        throw new Error(`Kartendaten konnten nicht geladen werden (${geoResponse.status}).`);
      }
      const geo = (await geoResponse.json()) as FeatureCollection;
      const mapPoints = await getMap(getNames(entries));
      setGeoData(geo);
      setPoints(mapPoints);
    } catch (err) {
      setGeoData(null);
      setPoints([]);
      setError(err instanceof ApiError ? err.message : 'Leider gibt es ein Problem mit der Datenbank.');
    } finally {
      setLoading(false);
    }
  };

  // Matches the original's separate resetMap (deleteAllChilds("map")):
  // clears the displayed map only, the selected-names list is untouched.
  const handleClear = (): void => {
    setError('');
    setGeoData(null);
    setPoints([]);
  };

  const fitted = useMemo<FittedProjection | null>(
    () => (geoData ? fitProjection(geoData, VIEWPORT_WIDTH, VIEWPORT_HEIGHT) : null),
    [geoData]
  );

  const features: Feature[] = geoData?.features ?? [];

  const positionedPoints: PositionedPoint[] = useMemo(() => {
    if (!fitted) return [];
    const result: PositionedPoint[] = [];
    for (const point of points) {
      const projected = fitted.projection([point.lon, point.lat]);
      if (projected) result.push({ point, x: projected[0], y: projected[1] });
    }
    return result;
  }, [fitted, points]);

  return (
    <CollapsiblePanel
      title="Karte"
      actions={
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="mapSelect">
              Karte
            </label>
            <select
              id="mapSelect"
              value={mapFile}
              onChange={(event) => setMapFile(event.target.value)}
              className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {MAP_FILES.map((option) => (
                <option key={option.url} value={option.url}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="mapSizeSelect">
              Größe der Elemente
            </label>
            <select
              id="mapSizeSelect"
              value={elementSize}
              onChange={(event) => setElementSize(Number(event.target.value))}
              className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {ELEMENT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="self-end rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            onClick={() => void handleUpdate()}
            disabled={loading}
          >
            {loading ? 'Lädt…' : 'Aktualisieren'}
          </button>
          <button
            type="button"
            title="Karte löschen"
            className="self-end rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
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
      {geoData && fitted ? (
        <svg width={VIEWPORT_WIDTH} height={VIEWPORT_HEIGHT} className="border border-gray-200">
          {features.map((feature, index) => (
            <path key={index} d={fitted.path(feature) ?? undefined} fill={interpolateGreys(0.3 + index / 40)} />
          ))}
          {positionedPoints.map(({ point, x, y }) => (
            <circle key={point.id} cx={x} cy={y} r={elementSize} fill={getColorForName(entries, point.familyName) ?? '#000000'}>
              <title>{`${point.familyName}, ${point.begin} - ${point.end}, ${point.plz} ${point.placeName} (${point.id})`}</title>
            </circle>
          ))}
        </svg>
      ) : (
        !loading && <p className="text-sm text-gray-500">Keine Kartendaten vorhanden.</p>
      )}
    </CollapsiblePanel>
  );
}
