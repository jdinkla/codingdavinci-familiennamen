import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { GraphResponse } from '@familiennamen/shared';
import { ApiError } from '../../lib/api.js';
import { NamesProvider, useNamesList } from '../names/NamesProvider.js';
import { GraphPanel } from './GraphPanel.js';

const { getGraph } = vi.hoisted(() => ({
  getGraph: vi.fn(),
}));

vi.mock('../../lib/api.js', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api.js')>('../../lib/api.js');
  return { ...actual, getGraph };
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
      <GraphPanel />
    </NamesProvider>
  );

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Graph' }));
};

const graphFixture: GraphResponse = {
  nodes: [
    { id: 'müller', group: 1 },
    { id: 'amüller', group: 1 },
  ],
  links: [{ source: 'müller', target: 'amüller', value: 4 }],
};

describe('GraphPanel', () => {
  it('no-ops when Aktualisieren is clicked with zero selected names', async () => {
    const user = userEvent.setup();
    renderPanel();

    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(getGraph).not.toHaveBeenCalled();
    expect(screen.getByText('Keine Graphdaten vorhanden.')).toBeInTheDocument();
  });

  it('fetches and renders one node (g) per graph node and one line per link, defaulting to depth 1', async () => {
    getGraph.mockResolvedValueOnce(graphFixture);
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(getGraph).toHaveBeenCalledWith(['müller'], 1);

    const nodeGroups = await vi.waitFor(() => {
      const found = container.querySelectorAll('[data-testid^="graph-node-"]');
      expect(found.length).toBeGreaterThan(0);
      return found;
    });
    expect(nodeGroups).toHaveLength(graphFixture.nodes.length);
    expect(container.querySelectorAll('line')).toHaveLength(graphFixture.links.length);

    const line = container.querySelector('line') as SVGLineElement;
    expect(line).toHaveAttribute('stroke-width', '2'); // sqrt(4)
  });

  it('selecting depth 2 calls getGraph with depth 2 instead of the default 1', async () => {
    getGraph.mockResolvedValueOnce(graphFixture);
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('radio', { name: '2' }));
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(getGraph).toHaveBeenCalledWith(['müller'], 2);
  });

  it('a selected-name node renders at double the radius with its assigned color; a non-selected neighbor renders at the base radius with the neutral fallback color', async () => {
    getGraph.mockResolvedValueOnce(graphFixture);
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(screen.getByText('add-müller'));
    const expectedColor = screen.getByTestId('color-müller').textContent;

    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    await vi.waitFor(() => {
      expect(container.querySelectorAll('[data-testid^="graph-node-"]').length).toBeGreaterThan(0);
    });

    const selectedGroup = container.querySelector('[data-testid="graph-node-müller"]') as SVGGElement;
    const selectedCircle = selectedGroup.querySelector('circle') as SVGCircleElement;
    expect(selectedCircle).toHaveAttribute('r', '10'); // default sizeGraphElem (5) * 2
    expect(selectedCircle).toHaveAttribute('fill', expectedColor);

    const neighborGroup = container.querySelector('[data-testid="graph-node-amüller"]') as SVGGElement;
    const neighborCircle = neighborGroup.querySelector('circle') as SVGCircleElement;
    expect(neighborCircle).toHaveAttribute('r', '5'); // default sizeGraphElem, not doubled
    expect(neighborCircle).toHaveAttribute('fill', '#6b7280'); // explicit neutral gray fallback
  });

  it('changing the element-size selector changes the rendered node radii', async () => {
    getGraph.mockResolvedValueOnce(graphFixture);
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);

    await user.selectOptions(screen.getByLabelText('Größe der Elemente'), '10');
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    await vi.waitFor(() => {
      expect(container.querySelectorAll('[data-testid^="graph-node-"]').length).toBeGreaterThan(0);
    });

    const selectedCircle = container.querySelector('[data-testid="graph-node-müller"] circle') as SVGCircleElement;
    const neighborCircle = container.querySelector('[data-testid="graph-node-amüller"] circle') as SVGCircleElement;
    expect(selectedCircle).toHaveAttribute('r', '20'); // 10 * 2
    expect(neighborCircle).toHaveAttribute('r', '10');
  });

  it('shows the API error message when getGraph fails', async () => {
    getGraph.mockRejectedValueOnce(new ApiError(500, 'Datenbankfehler beim Laden des Graphen.'));
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Datenbankfehler beim Laden des Graphen.');
  });

  it('shows a generic error message when a non-ApiError is thrown', async () => {
    getGraph.mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Leider gibt es ein Problem mit der Datenbank.');
  });

  it('the trash button clears the displayed graph without touching the selected names or refetching', async () => {
    getGraph.mockResolvedValueOnce(graphFixture);
    const user = userEvent.setup();
    const { container } = renderPanel();

    await user.click(screen.getByText('add-müller'));
    await openPanel(user);
    await user.click(screen.getByRole('button', { name: 'Aktualisieren' }));
    await vi.waitFor(() => {
      expect(container.querySelectorAll('[data-testid^="graph-node-"]').length).toBeGreaterThan(0);
    });

    const callsBeforeClear = getGraph.mock.calls.length;
    await user.click(screen.getByTitle('Graph löschen'));

    expect(container.querySelectorAll('[data-testid^="graph-node-"]')).toHaveLength(0);
    expect(container.querySelectorAll('line')).toHaveLength(0);
    expect(screen.getByText('Keine Graphdaten vorhanden.')).toBeInTheDocument();
    expect(getGraph).toHaveBeenCalledTimes(callsBeforeClear);
    expect(screen.getByTestId('color-müller')).toBeInTheDocument();
  });
});
