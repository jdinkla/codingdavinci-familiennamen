import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import type { FokoRecord } from '@familiennamen/shared';
import { ApiError } from '../../lib/api.js';
import { Foko } from './Foko.js';

const { getFokoSample } = vi.hoisted(() => ({
  getFokoSample: vi.fn(),
}));

vi.mock('../../lib/api.js', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api.js')>('../../lib/api.js');
  return { ...actual, getFokoSample };
});

const record: FokoRecord = {
  id: 42,
  familyName: 'müller',
  begin: 1800,
  end: 1850,
  submitter: 'Jane Doe',
  denomination: 'evangelisch',
  country: 'Deutschland',
  region: 'Sachsen',
  postalCode: '01234',
  placeName: 'Dresden',
  placeURI: 'https://example.org/place/dresden',
  lon: 13.74,
  lat: 51.05,
  ort: 'Dresden (roh)',
};

describe('Foko', () => {
  it('shows a loading state and then fetches getFokoSample on mount', async () => {
    let resolve!: (records: FokoRecord[]) => void;
    getFokoSample.mockReturnValueOnce(
      new Promise<FokoRecord[]>((res) => {
        resolve = res;
      })
    );
    render(<Foko />);

    expect(screen.getByText('Lädt…')).toBeInTheDocument();
    resolve([record]);

    expect(await screen.findByText('42')).toBeInTheDocument();
    expect(screen.queryByText('Lädt…')).not.toBeInTheDocument();
    expect(getFokoSample).toHaveBeenCalledTimes(1);
  });

  it('renders the 11-column table for a fetched record, including the placeURI link', async () => {
    getFokoSample.mockResolvedValueOnce([record]);
    render(<Foko />);

    const row = (await screen.findByText('42')).closest('tr') as HTMLElement;
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(11);

    expect(within(row).getByText('müller')).toBeInTheDocument();
    expect(within(row).getByText('1800')).toBeInTheDocument();
    expect(within(row).getByText('1850')).toBeInTheDocument();
    expect(within(row).getByText('Jane Doe')).toBeInTheDocument();
    expect(within(row).getByText('evangelisch')).toBeInTheDocument();
    expect(within(row).getByText('Deutschland')).toBeInTheDocument();
    expect(within(row).getByText('Sachsen')).toBeInTheDocument();
    expect(within(row).getByText('01234')).toBeInTheDocument();
    expect(within(row).getByText('Dresden')).toBeInTheDocument();

    const link = within(row).getByRole('link', { name: 'https://example.org/place/dresden' });
    expect(link).toHaveAttribute('href', 'https://example.org/place/dresden');
  });

  it('mentions the "first 1000 records" framing from the original page', async () => {
    getFokoSample.mockResolvedValueOnce([]);
    render(<Foko />);

    expect(screen.getByText(/nur 1000 Datensätze dargestellt/)).toBeInTheDocument();
    await screen.findByText('foko.csv');
  });

  it('shows the API error message when the fetch fails', async () => {
    getFokoSample.mockRejectedValueOnce(new ApiError(500, 'Datenbankfehler beim Laden der Daten.'));
    render(<Foko />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Datenbankfehler beim Laden der Daten.');
  });

  it('renders empty cells for null optional fields and no link when placeURI is null', async () => {
    const sparse: FokoRecord = {
      ...record,
      id: 99,
      begin: null,
      end: null,
      submitter: null,
      denomination: null,
      country: null,
      region: null,
      postalCode: null,
      placeName: null,
      placeURI: null,
    };
    getFokoSample.mockResolvedValueOnce([sparse]);
    render(<Foko />);

    const row = (await screen.findByText('99')).closest('tr') as HTMLElement;
    expect(within(row).queryAllByRole('link')).toHaveLength(0);
    const cells = within(row).getAllByRole('cell');
    // id + familyName are populated; every other cell renders as empty.
    expect(cells.slice(2).every((cell) => cell.textContent === '')).toBe(true);
  });

  it('does not update state after unmounting while the fetch is still pending', async () => {
    let resolve!: (records: FokoRecord[]) => void;
    getFokoSample.mockReturnValueOnce(
      new Promise<FokoRecord[]>((res) => {
        resolve = res;
      })
    );
    const { unmount } = render(<Foko />);
    unmount();

    // Resolving after unmount must not throw an act()/state-update warning;
    // there's nothing left to assert against once unmounted.
    expect(() => resolve([record])).not.toThrow();
  });
});
