import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NamesProvider, useNamesList } from './NamesProvider.js';

function Probe() {
  const { entries, addName, removeName, resetNames } = useNamesList();
  return (
    <div>
      <ul>
        {entries.map((entry, index) => (
          <li key={entry.name}>
            <span data-testid={`name-${index}`}>{entry.name}</span>
            <button onClick={() => removeName(index)}>remove-{entry.name}</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addName('müller')}>add-müller</button>
      <button onClick={() => addName('amüller')}>add-amüller</button>
      <button onClick={resetNames}>reset</button>
    </div>
  );
}

describe('NamesProvider / useNamesList', () => {
  it('throws when used outside a NamesProvider', () => {
    const Bare = () => {
      useNamesList();
      return null;
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bare />)).toThrow(/useNamesList must be used within a NamesProvider/);
    spy.mockRestore();
  });

  it('starts empty, adds names in sorted order, removes by index, and resets', async () => {
    const user = userEvent.setup();
    render(
      <NamesProvider>
        <Probe />
      </NamesProvider>
    );

    expect(screen.queryByTestId('name-0')).not.toBeInTheDocument();

    await user.click(screen.getByText('add-müller'));
    await user.click(screen.getByText('add-amüller'));

    // sorted: 'amüller' < 'müller'
    expect(screen.getByTestId('name-0')).toHaveTextContent('amüller');
    expect(screen.getByTestId('name-1')).toHaveTextContent('müller');

    await user.click(screen.getByText('remove-amüller'));
    expect(screen.getByTestId('name-0')).toHaveTextContent('müller');
    expect(screen.queryByTestId('name-1')).not.toBeInTheDocument();

    await user.click(screen.getByText('reset'));
    expect(screen.queryByTestId('name-0')).not.toBeInTheDocument();
  });

  it('adding the same name twice does not duplicate it', async () => {
    const user = userEvent.setup();
    render(
      <NamesProvider>
        <Probe />
      </NamesProvider>
    );

    await user.click(screen.getByText('add-müller'));
    await user.click(screen.getByText('add-müller'));

    expect(screen.getByTestId('name-0')).toHaveTextContent('müller');
    expect(screen.queryByTestId('name-1')).not.toBeInTheDocument();
  });
});
