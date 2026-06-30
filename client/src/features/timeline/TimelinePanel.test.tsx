import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TimelineEntry } from '@familiennamen/shared';
import { ApiError } from '../../lib/api.js';
import { NamesProvider, useNamesList } from '../names/NamesProvider.js';
import { TimelinePanel } from './TimelinePanel.js';

const { getTimeline } = vi.hoisted(() => ({
  getTimeline: vi.fn(),
}));

vi.mock('../../lib/api.js', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api.js')>('../../lib/api.js');
  return { ...actual, getTimeline };
});

/** Test-only harness to seed the shared selected-names list (sorted by name,
 * matching the real reducer) before exercising the panel. */
function NamesProbe({ names }: { names: string[] }) {
  const { addName } = useNamesList();
  return (
    <div>
      {names.map((name) => (
        <button key={name} onClick={() => addName(name)}>{`add-${name}`}</button>
      ))}
    </div>
  );
}

const renderPanel = (names: string[] = []) =>
  render(
    <NamesProvider>
      <NamesProbe names={names} />
      <TimelinePanel />
    </NamesProvider>
  );

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /Zeitreihe/ }));
};

const addAll = async (user: ReturnType<typeof userEvent.setup>, names: string[]) => {
  for (const name of names) {
    await user.click(screen.getByText(`add-${name}`));
  }
};

const refresh = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));
};

const entry = (overrides: Partial<TimelineEntry>): TimelineEntry => ({
  id: 1,
  name: 'müller',
  begin: 1700,
  end: 1750,
  country: 'Deutschland',
  plz: '01234',
  ort: 'Dresden',
  placeUri: null,
  ...overrides,
});

describe('TimelinePanel', () => {
  it('no-ops when Aktualisieren is clicked with zero selected names', async () => {
    const user = userEvent.setup();
    renderPanel();

    await openPanel(user);
    await refresh(user);

    expect(getTimeline).not.toHaveBeenCalled();
    expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
  });

  it('fetches and renders one rect per entry, positioned in the row of its name', async () => {
    // sorted selection order: amüller (row 0), müller (row 1)
    getTimeline.mockResolvedValueOnce([
      entry({ id: 1, name: 'amüller', begin: 1600, end: 1650 }),
      entry({ id: 2, name: 'müller', begin: 1750, end: 1800 }),
    ]);
    const user = userEvent.setup();
    renderPanel(['müller', 'amüller']);

    await addAll(user, ['müller', 'amüller']);
    await openPanel(user);
    await refresh(user);

    expect(getTimeline).toHaveBeenCalledWith(['amüller', 'müller']);

    await screen.findByText('amüller, 1600-1650, 01234 Dresden (1)');
    const svg = document.querySelector('svg') as SVGSVGElement;
    const rectEls = Array.from(svg.querySelectorAll('rect'));
    expect(rectEls).toHaveLength(2);

    const elemY = 25; // default height
    const amullerRect = rectEls.find((r) => r.querySelector('title')?.textContent?.startsWith('amüller'));
    const mullerRect = rectEls.find((r) => r.querySelector('title')?.textContent?.startsWith('müller'));
    expect(amullerRect).toBeDefined();
    expect(mullerRect).toBeDefined();
    expect(amullerRect?.getAttribute('y')).toBe(String(0 * elemY));
    expect(mullerRect?.getAttribute('y')).toBe(String(1 * elemY));

    expect(amullerRect?.querySelector('title')?.textContent).toBe('amüller, 1600-1650, 01234 Dresden (1)');
    expect(mullerRect?.querySelector('title')?.textContent).toBe('müller, 1750-1800, 01234 Dresden (2)');
  });

  it('shows the API error message when the fetch fails', async () => {
    getTimeline.mockRejectedValueOnce(new ApiError(500, 'Datenbankfehler beim Laden der Daten.'));
    const user = userEvent.setup();
    renderPanel(['müller']);

    await addAll(user, ['müller']);
    await openPanel(user);
    await refresh(user);

    expect(await screen.findByRole('alert')).toHaveTextContent('Datenbankfehler beim Laden der Daten.');
    expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
  });

  it('changing the width and height selectors changes rendered rect dimensions', async () => {
    getTimeline.mockResolvedValueOnce([entry({ id: 1, name: 'müller', begin: 1700, end: 1750 })]);
    const user = userEvent.setup();
    renderPanel(['müller']);

    await addAll(user, ['müller']);
    await openPanel(user);

    await user.selectOptions(screen.getByLabelText('Breite'), '40');
    await user.selectOptions(screen.getByLabelText('Höhe'), '50');
    await refresh(user);

    await waitFor(() => expect(document.querySelector('svg rect')).not.toBeNull());
    const svg = document.querySelector('svg') as SVGSVGElement;
    const rect = svg.querySelector('rect') as SVGRectElement;
    expect(rect.getAttribute('width')).toBe('40');
    expect(rect.getAttribute('height')).toBe(String(50 - 5)); // elemY - elemDistance
  });

  it('uses only "begin" (never "end") for the x-domain: equal begin years produce equal x positions', async () => {
    getTimeline.mockResolvedValueOnce([
      entry({ id: 1, name: 'amüller', begin: 1700, end: 1705 }),
      entry({ id: 2, name: 'müller', begin: 1700, end: 1999 }),
    ]);
    const user = userEvent.setup();
    renderPanel(['müller', 'amüller']);

    await addAll(user, ['müller', 'amüller']);
    await openPanel(user);
    await refresh(user);

    await waitFor(() => expect(document.querySelectorAll('svg rect')).toHaveLength(2));
    const svg = document.querySelector('svg') as SVGSVGElement;
    const rectEls = Array.from(svg.querySelectorAll('rect'));
    expect(rectEls).toHaveLength(2);

    // Both entries share begin=1700, so despite wildly different `end`
    // values, both rects must land at the same x.
    const xValues = new Set(rectEls.map((r) => r.getAttribute('x')));
    expect(xValues.size).toBe(1);
  });

  it('clearing the timeline removes the rendered rects without touching the selected names or refetching', async () => {
    getTimeline.mockResolvedValueOnce([entry({ id: 1, name: 'müller', begin: 1700, end: 1750 })]);
    const user = userEvent.setup();
    renderPanel(['müller']);

    await addAll(user, ['müller']);
    await openPanel(user);
    await refresh(user);

    await waitFor(() => expect(document.querySelector('svg rect')).not.toBeNull());
    const callsBeforeClear = getTimeline.mock.calls.length;

    await user.click(screen.getByTitle('Zeitreihe löschen'));

    expect(document.querySelector('svg rect')).toBeNull();
    expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
    expect(getTimeline).toHaveBeenCalledTimes(callsBeforeClear);
  });
});
