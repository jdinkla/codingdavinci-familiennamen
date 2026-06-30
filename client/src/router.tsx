import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.js';
import { Home } from './routes/Home.js';
import { Imprint } from './routes/Imprint.js';
import { Analysis } from './routes/Analysis.js';
import { Docs } from './routes/Docs.js';
import { DataIndex } from './routes/data/DataIndex.js';
import { Foko } from './routes/data/Foko.js';
import { Konfession } from './routes/data/Konfession.js';
import { Staat } from './routes/data/Staat.js';
import { Territorium } from './routes/data/Territorium.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'analysis', element: <Analysis /> },
      { path: 'data', element: <DataIndex /> },
      { path: 'data/foko', element: <Foko /> },
      { path: 'data/konfession', element: <Konfession /> },
      { path: 'data/staat', element: <Staat /> },
      { path: 'data/territorium', element: <Territorium /> },
      { path: 'docs', element: <Docs /> },
      { path: 'imprint', element: <Imprint /> },
      { path: 'impressum', element: <Navigate to="/imprint" replace /> },
    ],
  },
]);
