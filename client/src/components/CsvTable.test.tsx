import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { CsvTable } from './CsvTable.js';

const columns = [
  { key: 'Kürzel', label: 'Kürzel' },
  { key: 'Staat', label: 'Staat' },
];

describe('CsvTable', () => {
  it('renders the column headers and one row per item', () => {
    render(
      <CsvTable
        columns={columns}
        rows={[
          { Kürzel: 'D', Staat: 'Deutschland' },
          { Kürzel: 'A', Staat: 'Österreich' },
        ]}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'Kürzel' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Staat' })).toBeInTheDocument();
    // header row + 2 data rows
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Deutschland')).toBeInTheDocument();
    expect(screen.getByText('Österreich')).toBeInTheDocument();
  });

  it('renders the configured linkColumn as an anchor', () => {
    render(
      <CsvTable
        columns={[
          { key: 'Territorium', label: 'Territorium' },
          { key: 'URI', label: 'URI' },
        ]}
        rows={[{ Territorium: 'Burgenland', URI: 'http://gov.genealogy.net/object_215342' }]}
        linkColumn="URI"
      />
    );

    const link = screen.getByRole('link', { name: 'http://gov.genealogy.net/object_215342' });
    expect(link).toHaveAttribute('href', 'http://gov.genealogy.net/object_215342');
  });

  it('renders a plain (non-link) cell when the linkColumn value is empty', () => {
    render(
      <CsvTable
        columns={[
          { key: 'Territorium', label: 'Territorium' },
          { key: 'URI', label: 'URI' },
        ]}
        rows={[{ Territorium: 'Nordwest', URI: '' }]}
        linkColumn="URI"
      />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    const row = screen.getByText('Nordwest').closest('tr') as HTMLElement;
    expect(within(row).getAllByRole('cell')).toHaveLength(2);
  });
});
