import { CsvTable } from '../../components/CsvTable.js';
import konfession from '../../data/konfession.json';

/** Ported from app_server/views/data/konfession.pug. */
export function Konfession() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">konfession.csv</h1>
      <p>Folgende Datensätze sind in der Datei konfession.csv vorhanden.</p>
      <CsvTable
        columns={[
          { key: 'Kürzel', label: 'Kürzel' },
          { key: 'Konfession', label: 'Konfession' },
        ]}
        rows={konfession}
      />
    </div>
  );
}
