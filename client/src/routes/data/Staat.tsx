import { CsvTable } from '../../components/CsvTable.js';
import staat from '../../data/staat.json';

/** Ported from app_server/views/data/staat.pug. */
export function Staat() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">staat.csv</h1>
      <p>Folgende Datensätze sind in der Datei staat.csv vorhanden.</p>
      <CsvTable
        columns={[
          { key: 'Kürzel', label: 'Kürzel' },
          { key: 'Staat', label: 'Staat' },
        ]}
        rows={staat}
      />
    </div>
  );
}
