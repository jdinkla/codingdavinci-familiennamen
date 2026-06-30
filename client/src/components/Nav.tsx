import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/data', label: 'Daten' },
  { to: '/analysis', label: 'Analyse und Visualisierung' },
  { to: '/docs', label: 'Dokumentation' },
];

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `block px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }`;

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <button
            type="button"
            className="text-gray-300 hover:text-white md:hidden"
            aria-expanded={open}
            aria-label="Navigation umschalten"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="block h-0.5 w-6 bg-current" />
            <span className="mt-1 block h-0.5 w-6 bg-current" />
            <span className="mt-1 block h-0.5 w-6 bg-current" />
          </button>
          <span className="text-white font-semibold hidden md:block">Familiennamen</span>
          <div className="hidden md:flex md:gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <NavLink to="/imprint" className={linkClass}>
            Impressum
          </NavLink>
        </div>
        {open && (
          <div className="space-y-1 pb-3 md:hidden">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
