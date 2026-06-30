import { RouterProvider } from 'react-router-dom';
import { NamesProvider } from './features/names/NamesProvider.js';
import { router } from './router.js';

export function App() {
  return (
    <NamesProvider>
      <RouterProvider router={router} />
    </NamesProvider>
  );
}
