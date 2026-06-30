import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '../../lib/api.js';
import { NamesProvider } from './NamesProvider.js';
import { SearchPanel } from './SearchPanel.js';

const { searchExact, searchLike, searchRegexp, getGraph } = vi.hoisted(() => ({
  searchExact: vi.fn(),
  searchLike: vi.fn(),
  searchRegexp: vi.fn(),
  getGraph: vi.fn(),
}));

vi.mock('../../lib/api.js', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api.js')>('../../lib/api.js');
  return { ...actual, searchExact, searchLike, searchRegexp, getGraph };
});

const renderPanel = () =>
  render(
    <NamesProvider>
      <SearchPanel />
    </NamesProvider>
  );

const submit = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
  await user.clear(screen.getByLabelText('Suche'));
  if (text) await user.type(screen.getByLabelText('Suche'), text);
  await user.click(screen.getByRole('button', { name: /Suche/ }));
};

describe('SearchPanel', () => {
  it('runs an exact search by default and lists results', async () => {
    searchExact.mockResolvedValueOnce(['müller']);
    const user = userEvent.setup();
    renderPanel();

    await submit(user, 'müller');

    expect(searchExact).toHaveBeenCalledWith('müller');
    expect(await screen.findByText('müller')).toBeInTheDocument();
    expect(screen.getByText('Anzahl: 1')).toBeInTheDocument();
  });

  it('warns instead of searching when a like pattern is shorter than 4 characters', async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByLabelText('Suche nach Like-Muster'));
    await submit(user, 'abc');

    expect(await screen.findByRole('alert')).toHaveTextContent('mindestens 4 Zeichen');
    expect(searchLike).not.toHaveBeenCalled();
  });

  it('runs a like search once the pattern reaches 4 characters', async () => {
    searchLike.mockResolvedValueOnce(['müller', 'mueller']);
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByLabelText('Suche nach Like-Muster'));
    await submit(user, 'm%er');

    expect(searchLike).toHaveBeenCalledWith('m%er');
    expect(await screen.findByText('müller')).toBeInTheDocument();
    expect(screen.getByText('mueller')).toBeInTheDocument();
  });

  it('shows the server error message when a regexp search fails (e.g. malformed pattern)', async () => {
    searchRegexp.mockRejectedValueOnce(new ApiError(400, 'invalid regular expression: ('));
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByLabelText('Suche nach regulärem Ausdruck'));
    await submit(user, '(abc');

    expect(await screen.findByRole('alert')).toHaveTextContent('invalid regular expression');
  });

  it('runs a graph-similarity search and excludes the searched name itself from results', async () => {
    getGraph.mockResolvedValueOnce({
      nodes: [
        { id: 'müller', group: 1 },
        { id: 'amüller', group: 1 },
      ],
      links: [],
    });
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByLabelText('Suche ähnliche Namen in Graph'));
    await submit(user, 'müller');

    expect(getGraph).toHaveBeenCalledWith(['müller'], 1);
    expect(await screen.findByText('amüller')).toBeInTheDocument();
    expect(screen.getByText('Anzahl: 1')).toBeInTheDocument(); // 'müller' itself excluded
  });

  it('adds a search result to the selected-names list and the list supports remove and reset', async () => {
    searchExact.mockResolvedValueOnce(['müller']);
    const user = userEvent.setup();
    renderPanel();

    await submit(user, 'müller');
    await screen.findByText('müller');

    await user.click(screen.getByTitle('Zur Auswahl hinzufügen'));

    const selectedSection = screen.getByText('Ausgewählte Familiennamen').closest('div') as HTMLElement;
    expect(within(selectedSection).getByText('Anzahl: 1')).toBeInTheDocument();

    await user.click(within(selectedSection).getByTitle('Aus Liste entfernen'));
    expect(within(selectedSection).getByText('Anzahl: 0')).toBeInTheDocument();
  });

  it('the results "Löschen" button clears the results list', async () => {
    searchExact.mockResolvedValueOnce(['müller']);
    const user = userEvent.setup();
    renderPanel();

    await submit(user, 'müller');
    await screen.findByText('müller');

    const resultsSection = screen.getByText('Ergebnisse der Suche').closest('div') as HTMLElement;
    await user.click(within(resultsSection).getByText('Löschen'));
    expect(within(resultsSection).getByText('Anzahl: 0')).toBeInTheDocument();
    expect(screen.queryByText('müller')).not.toBeInTheDocument();
  });

  it('the selected-names "Löschen" button resets the whole selection', async () => {
    searchExact.mockResolvedValueOnce(['müller']);
    const user = userEvent.setup();
    renderPanel();

    await submit(user, 'müller');
    await screen.findByText('müller');
    await user.click(screen.getByTitle('Zur Auswahl hinzufügen'));

    const selectedSection = screen.getByText('Ausgewählte Familiennamen').closest('div') as HTMLElement;
    expect(within(selectedSection).getByText('Anzahl: 1')).toBeInTheDocument();

    await user.click(within(selectedSection).getByText('Löschen'));
    expect(within(selectedSection).getByText('Anzahl: 0')).toBeInTheDocument();
  });

  it('copying a result into the search box fills the input', async () => {
    searchExact.mockResolvedValueOnce(['müller']);
    const user = userEvent.setup();
    renderPanel();

    await submit(user, 'müller');
    await screen.findByText('müller');

    await user.click(screen.getByTitle('In Suchfenster kopieren'));
    expect(screen.getByLabelText('Suche')).toHaveValue('müller');
  });
});
