import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import konfession from '../../data/konfession.json';
import { Konfession } from './Konfession.js';

describe('Konfession', () => {
  it('renders the heading and one row per entry in konfession.json', () => {
    render(<Konfession />);

    expect(screen.getByRole('heading', { level: 1, name: 'konfession.csv' })).toBeInTheDocument();
    // header row + one row per data entry
    expect(screen.getAllByRole('row')).toHaveLength(konfession.length + 1);
  });

  it('renders the Kürzel/Konfession columns for a known entry', () => {
    render(<Konfession />);

    const row = screen.getByText('lutherisch').closest('tr') as HTMLElement;
    expect(within(row).getByText('lu')).toBeInTheDocument();
  });
});
