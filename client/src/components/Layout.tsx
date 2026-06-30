import { Outlet } from 'react-router-dom';
import { Nav } from './Nav.js';
import { Footer } from './Footer.js';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
