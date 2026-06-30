import { SearchPanel } from '../features/names/SearchPanel.js';
import { DataTablePanel } from '../features/data-table/DataTablePanel.js';
import { GraphPanel } from '../features/graph/GraphPanel.js';
import { TimelinePanel } from '../features/timeline/TimelinePanel.js';
import { MapPanel } from '../features/map/MapPanel.js';

export function Analysis() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Namen-Explorer</h1>
      <SearchPanel />
      <DataTablePanel />
      <GraphPanel />
      <TimelinePanel />
      <MapPanel />
    </div>
  );
}
