import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import staat from '../../data/staat.json';
import { Staat } from './Staat.js';

describe('Staat', () => {
  it('renders the heading and one row per entry in staat.json', () => {
    render(<Staat />);

    expect(screen.getByRole('heading', { level: 1, name: 'staat.csv' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(staat.length + 1);
  });

  it('renders the Kürzel/Staat columns for a known entry', () => {
    render(<Staat />);

    const row = screen.getByText('Deutschland').closest('tr') as HTMLElement;
    expect(within(row).getByText('D')).toBeInTheDocument();
  });
});
