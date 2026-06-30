import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Docs } from './Docs.js';

describe('Docs', () => {
  it('renders the heading and the architecture image with a historical-reference note', () => {
    render(<Docs />);

    expect(screen.getByRole('heading', { level: 1, name: 'Dokumentation' })).toBeInTheDocument();
    expect(screen.getByAltText('Architektur der Anwendung')).toHaveAttribute('src', '/images/Architektur.png');
    expect(screen.getByText(/ursprüngliche Architektur von 2016/)).toBeInTheDocument();
  });

  it('describes the current stack (SQLite, Express, better-sqlite3, React, Tailwind CSS, d3.js) rather than the 2016 stack', () => {
    render(<Docs />);

    expect(screen.getAllByText(/SQLite/).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'better-sqlite3' })).toHaveAttribute(
      'href',
      'https://github.com/WiseLibs/better-sqlite3'
    );
    const allLinkedTo = (name: string, href: string) =>
      screen.getAllByRole('link', { name }).every((link) => link.getAttribute('href') === href);

    expect(screen.getAllByText(/TypeScript/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Express' }).length).toBeGreaterThan(0);
    expect(allLinkedTo('React', 'https://react.dev/')).toBe(true);
    expect(allLinkedTo('Tailwind CSS', 'https://tailwindcss.com/')).toBe(true);
    expect(allLinkedTo('d3.js', 'https://d3js.org/')).toBe(true);

    // MariaDB/Neo4j/AngularJS/Bootstrap must no longer be described as the
    // app's own tech (no links to their project sites); "Neo4j in Action" /
    // "AngularJS in Action" remain as legitimately-preserved book titles
    // (manning.com links), so those are checked separately, not negated here.
    expect(screen.queryByText(/MariaDB/)).not.toBeInTheDocument();
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs.some((href) => href?.includes('mariadb.org') || href?.includes('neo4j.com'))).toBe(false);
    expect(screen.queryByRole('link', { name: 'AngularJS' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Bootstrap' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Bootstrap/)).not.toBeInTheDocument();
  });

  it('keeps the Docker Container deployment mention but drops the specific cloud-provider claim', () => {
    render(<Docs />);

    expect(screen.getByText('Docker Container')).toBeInTheDocument();
    expect(screen.queryByText(/AWS/)).not.toBeInTheDocument();
  });

  it('preserves the Java similarity-calculation project link, github source link, and book list', () => {
    render(<Docs />);

    expect(screen.getByRole('link', { name: 'github' })).toHaveAttribute(
      'href',
      'https://github.com/jdinkla/codingdavinci-familiennamen'
    );
    expect(screen.getByRole('link', { name: 'in einem separaten Projekt' })).toHaveAttribute(
      'href',
      'https://github.com/jdinkla/codingdavinci-familiennamen-graph'
    );
    expect(screen.getByRole('heading', { name: 'Lektüre' })).toBeInTheDocument();
    expect(screen.getByText('D3.js in Action')).toBeInTheDocument();
    expect(screen.getByText('Neo4j in Action')).toBeInTheDocument();
  });

  it('preserves the OpenGeoDB/GermanyMap/suche-postleitzahl.org/mapshaper.org data-source credits', () => {
    render(<Docs />);

    expect(screen.getByRole('link', { name: 'OpenGeoDB' })).toHaveAttribute('href', 'http://opengeodb.org/wiki/PLZ.tab');
    expect(screen.getByRole('link', { name: 'hier' })).toHaveAttribute('href', 'https://github.com/oscar6echo/GermanyMap');
    expect(screen.getByRole('link', { name: 'www.suche-postleitzahl.org' })).toHaveAttribute(
      'href',
      'https://www.suche-postleitzahl.org/downloads'
    );
    expect(screen.getByRole('link', { name: 'mapshaper.org' })).toHaveAttribute('href', 'http://mapshaper.org');
  });
});
