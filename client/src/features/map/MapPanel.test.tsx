import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FeatureCollection } from 'geojson';
import type { MapPoint } from '@familiennamen/shared';
import { ApiError } from '../../lib/api.js';
import { NamesProvider, useNamesList } from '../names/NamesProvider.js';
import { MapPanel } from './MapPanel.js';

const { getMap } = vi.hoisted(() => ({
  getMap: vi.fn(),
}));

vi.mock('../../lib/api.js', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api.js')>('../../lib/api.js');
  return { ...actual, getMap };
});

/** Test-only harness to seed the shared selected-names list and expose the
 * color assigned to each entry (the real generator is randomly seeded). */
function NamesProbe() {
  const { entries, addName } = useNamesList();
  return (
    <div>
      <button onClick={() => addName('müller')}>add-müller</button>
      <ul>
        {entries.map((entry) => (
          <li key={entry.name} data-testid={`color-${entry.name}`}>
            {entry.color}
          </li>
        ))}
      </ul>
    </div>
  );
}

const renderPanel = () =>
  render(
    <NamesProvider>
      <NamesProbe />
      <MapPanel />
    </NamesProvider>
  );

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Karte' }));
};

const geoFixture: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'A' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10, 50],
            [10, 51],
            [11, 51],
            [11, 50],
            [10, 50],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'B' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12, 50],
            [12, 51],
            [13, 51],
            [13, 50],
            [12, 50],
          ],
        ],
      },
    },
  ],
};

const mapPoints: MapPoint[] = [
  { id: 1, familyName: 'müller', begin: 1800, end: 1850, plz: '01234', placeName: 'Dresden', lon: 10.5, lat: 50.5 },
  { id: 2, familyName: 'müller', begin: 1700, end: 1750, plz: '04567', placeName: 'Leipzig', lon: 12.5, lat: 50.5 },
];

const okJsonResponse = (body: unknown): Response =>
  ({ ok: true, status: 200, json: () => Promise.resolve(body) }) as Response;

describe('MapPanel', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    // Reset call history (but not queued mockResolvedValueOnce results from
    // *this* test) so call-count assertions stay accurate test-to-test.
    getMap.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('no-ops when Aktualisieren is clicked with zero selected names', async () => {
    const user = userEvent.setup();
    renderPanel();

    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(getMap).not.toHaveBeenCalled();
    expect(screen.getByText('Keine Kartendaten vorhanden.')).toBeInTheDocument();
  });

  it('fetches the geojson background and the data points, rendering one path per feature and one circle per point', async () => {
    fetchMock.mockResolvedValueOnce(okJsonResponse(geoFixture));
    getMap.mockResolvedValueOnce(mapPoints);
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(screen.getByText('add-müller'));
    const expectedColor = screen.getByTestId('color-müller').textContent;

    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(fetchMock).toHaveBeenCalledWith('/data/d_mit_bundeslaendern.json');
    expect(getMap).toHaveBeenCalledWith(['müller']);

    const circles = await vi.waitFor(() => {
      const found = container.querySelectorAll('circle');
      expect(found.length).toBeGreaterThan(0);
      return found;
    });

    const paths = container.querySelectorAll('path');
    expect(paths).toHaveLength(geoFixture.features.length);
    expect(circles).toHaveLength(mapPoints.length);
    circles.forEach((circle) => {
      expect(circle).toHaveAttribute('fill', expectedColor);
      expect(circle).toHaveAttribute('r', '7'); // default sizeMapElem
    });

    const firstTitle = circles[0]?.querySelector('title');
    expect(firstTitle).toHaveTextContent('müller, 1800 - 1850, 01234 Dresden (1)');
  });

  it('switching the map-file dropdown changes which URL is fetched', async () => {
    fetchMock.mockResolvedValue(okJsonResponse(geoFixture));
    getMap.mockResolvedValue(mapPoints);
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);

    await user.selectOptions(screen.getByLabelText('Karte'), 'PLZ-Gebiete, einstellig');
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(fetchMock).toHaveBeenCalledWith('/data/plz1.json');
  });

  it('switching the element-size dropdown changes the circle radius', async () => {
    fetchMock.mockResolvedValue(okJsonResponse(geoFixture));
    getMap.mockResolvedValue(mapPoints);
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);

    await user.selectOptions(screen.getByLabelText('Größe der Elemente'), '15');
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    const circles = await vi.waitFor(() => {
      const found = container.querySelectorAll('circle');
      expect(found.length).toBeGreaterThan(0);
      return found;
    });
    circles.forEach((circle) => expect(circle).toHaveAttribute('r', '15'));
  });

  it('shows the API error message when getMap fails', async () => {
    fetchMock.mockResolvedValueOnce(okJsonResponse(geoFixture));
    getMap.mockRejectedValueOnce(new ApiError(500, 'Datenbankfehler beim Laden der Kartendaten.'));
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Datenbankfehler beim Laden der Kartendaten.');
  });

  it('shows a generic error message when the geojson fetch itself fails (non-2xx, not an ApiError)', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 } as Response);
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Leider gibt es ein Problem mit der Datenbank.');
    expect(getMap).not.toHaveBeenCalled();
  });

  it('the trash button clears the displayed map without touching the selected names or refetching', async () => {
    fetchMock.mockResolvedValueOnce(okJsonResponse(geoFixture));
    getMap.mockResolvedValueOnce(mapPoints);
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));
    await vi.waitFor(() => expect(container.querySelectorAll('circle').length).toBeGreaterThan(0));

    const callsBeforeClear = getMap.mock.calls.length;
    await user.click(screen.getByTitle('Karte löschen'));

    expect(container.querySelectorAll('circle')).toHaveLength(0);
    expect(container.querySelectorAll('path')).toHaveLength(0);
    expect(screen.getByText('Keine Kartendaten vorhanden.')).toBeInTheDocument();
    expect(getMap).toHaveBeenCalledTimes(callsBeforeClear);
    expect(screen.getByTestId('color-müller')).toBeInTheDocument();
  });
});
