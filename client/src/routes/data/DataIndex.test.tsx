import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataIndex } from './DataIndex.js';

const renderPage = () =>
  render(
    <MemoryRouter>
      <DataIndex />
    </MemoryRouter>
  );

describe('DataIndex', () => {
  it('renders the heading and links to all four data sub-pages', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Daten' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'staat.csv' })).toHaveAttribute('href', '/data/staat');
    expect(screen.getByRole('link', { name: 'territorium.csv' })).toHaveAttribute('href', '/data/territorium');
    expect(screen.getByRole('link', { name: 'foko.csv' })).toHaveAttribute('href', '/data/foko');
    expect(screen.getByRole('link', { name: 'konfession.csv' })).toHaveAttribute('href', '/data/konfession');
  });

  it('links to the Dokumentation page', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'Dokumentation' })).toHaveAttribute('href', '/docs');
  });

  it('renders the full Frankfurt place-name-variants table', () => {
    renderPage();

    expect(screen.getByText('Frankfurt am Main')).toBeInTheDocument();
    expect(screen.getByText('Frankfurt/Oder')).toBeInTheDocument();
    expect(screen.getByText('Frankfurt(Oder)')).toBeInTheDocument();
    // 54 distinct "frankfurt" variants from the original table, one row each.
    expect(screen.getAllByRole('row')).toHaveLength(54);
  });

  it('renders all five data-quality example sections with their images', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Beispiel: Goethe' })).toBeInTheDocument();
    expect(screen.getByAltText('Datenausschnitt zu Goethe')).toHaveAttribute('src', '/images/DataGoethe.png');

    expect(screen.getByRole('heading', { name: 'Beispiel: Althaus' })).toBeInTheDocument();
    expect(screen.getByAltText('Datenausschnitt zu Althaus')).toHaveAttribute('src', '/images/DataAlthaus.png');

    expect(screen.getByRole('heading', { name: 'Beispiel: Familiennamen' })).toBeInTheDocument();
    expect(screen.getByAltText('Datenausschnitt zu Familiennamen')).toHaveAttribute('src', '/images/DataNames.png');

    expect(screen.getByRole('heading', { name: 'Beispiel: Startdatum' })).toBeInTheDocument();
    expect(screen.getByAltText('Histogramm des Startdatums')).toHaveAttribute('src', '/images/DataColumnBegin.png');

    expect(screen.getByRole('heading', { name: 'Beispiel: Religion' })).toBeInTheDocument();
  });

  it('renders the data-cleaning warning callouts', () => {
    renderPage();
    expect(
      screen.getByText(/in den Daten keine einzelnen Personen erfasst wurden/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Daher wurden in dieser App nur Daten aus Deutschland berücksichtigt\./)).toBeInTheDocument();
  });
});
