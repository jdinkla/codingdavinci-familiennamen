import { CsvTable } from '../../components/CsvTable.js';
import territorium from '../../data/territorium.json';

/** Ported from app_server/views/data/territorium.pug. */
export function Territorium() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">territorium.csv</h1>
      <p>Folgende Datensätze sind in der Datei territorium.csv vorhanden.</p>
      <CsvTable
        columns={[
          { key: 'Staat', label: 'Staat' },
          { key: 'Kürzel', label: 'Kürzel' },
          { key: 'Territorium', label: 'Territorium' },
          { key: 'URI', label: 'URI' },
        ]}
        rows={territorium}
        linkColumn="URI"
      />
    </div>
  );
}
