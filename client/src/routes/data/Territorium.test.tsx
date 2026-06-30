import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import territorium from '../../data/territorium.json';
import { Territorium } from './Territorium.js';

describe('Territorium', () => {
  it('renders the heading and one row per entry in territorium.json', () => {
    render(<Territorium />);

    expect(screen.getByRole('heading', { level: 1, name: 'territorium.csv' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(territorium.length + 1);
  });

  it('renders the URI column as a link when present', () => {
    render(<Territorium />);

    const row = screen.getByText('Burgenland').closest('tr') as HTMLElement;
    expect(within(row).getByText('A')).toBeInTheDocument();
    expect(within(row).getByText('BGL')).toBeInTheDocument();
    const link = within(row).getByRole('link', { name: 'http://gov.genealogy.net/object_215342' });
    expect(link).toHaveAttribute('href', 'http://gov.genealogy.net/object_215342');
  });

  it('renders a plain cell, not a link, when the URI is empty', () => {
    render(<Territorium />);

    const row = screen.getByText('KwaZulu-Natal').closest('tr') as HTMLElement;
    expect(within(row).queryByRole('link')).not.toBeInTheDocument();
  });
});
