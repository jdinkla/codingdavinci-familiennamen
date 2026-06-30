import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FokoRecord } from '@familiennamen/shared';
import { ApiError } from '../../lib/api.js';
import { NamesProvider, useNamesList } from '../names/NamesProvider.js';
import { DataTablePanel } from './DataTablePanel.js';

const { getFoko } = vi.hoisted(() => ({
  getFoko: vi.fn(),
}));

vi.mock('../../lib/api.js', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api.js')>('../../lib/api.js');
  return { ...actual, getFoko };
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
      <DataTablePanel />
    </NamesProvider>
  );

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /Daten/ }));
};

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
  placeName: 'Dresden (Anzeigename)',
  placeURI: 'https://example.org/place/dresden',
  lon: 13.74,
  lat: 51.05,
  ort: 'Dresden (roh)',
};

describe('DataTablePanel', () => {
  it('no-ops when Aktualisieren is clicked with zero selected names', async () => {
    const user = userEvent.setup();
    renderPanel();

    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(getFoko).not.toHaveBeenCalled();
    // only the header row is present, no data row was added
    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
  });

  it('fetches and renders a record with the correct column mapping, including the Ort/placeName quirk and the family color', async () => {
    getFoko.mockResolvedValueOnce([record]);
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    const expectedColor = screen.getByTestId('color-müller').textContent;

    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(getFoko).toHaveBeenCalledWith(['müller']);

    const row = (await screen.findByText('42')).closest('tr') as HTMLElement;
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(11);
    const [id, familyName, begin, end, submitter, denomination, country, region, postalCode, ort, link] = cells as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];

    expect(id).toHaveTextContent('42');
    expect(familyName).toHaveTextContent('müller');
    expect(within(familyName).getByText('müller')).toHaveStyle({ color: expectedColor ?? undefined });
    expect(begin).toHaveTextContent('1800');
    expect(end).toHaveTextContent('1850');
    expect(submitter).toHaveTextContent('Jane Doe');
    expect(denomination).toHaveTextContent('evangelisch');
    expect(country).toHaveTextContent('Deutschland');
    expect(region).toHaveTextContent('Sachsen');
    expect(postalCode).toHaveTextContent('01234');
    // "Ort" must show placeName, never the raw `ort` field.
    expect(ort).toHaveTextContent('Dresden (Anzeigename)');
    expect(ort).not.toHaveTextContent('Dresden (roh)');
    const linkEl = within(link).getByRole('link', { name: 'https://example.org/place/dresden' });
    expect(linkEl).toHaveAttribute('href', 'https://example.org/place/dresden');
  });

  it('shows the API error message when the fetch fails', async () => {
    getFoko.mockRejectedValueOnce(new ApiError(500, 'Datenbankfehler beim Laden der Daten.'));
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Datenbankfehler beim Laden der Daten.');
  });

  it('the trash button clears the displayed table without touching the selected names or refetching', async () => {
    getFoko.mockResolvedValueOnce([record]);
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));
    await screen.findByText('42');
    const callsBeforeClear = getFoko.mock.calls.length;

    await user.click(screen.getByTitle('Tabelle leeren'));

    expect(screen.queryByText('42')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
    expect(getFoko).toHaveBeenCalledTimes(callsBeforeClear);
    // the selected-names list itself is untouched by clearing the table
    expect(screen.getByTestId('color-müller')).toBeInTheDocument();
  });
});
