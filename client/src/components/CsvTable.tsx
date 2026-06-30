/**
 * Generic table for rendering small bundled reference datasets (the former
 * konfession.csv / staat.csv / territorium.csv lookups), with an optional
 * column rendered as a link (e.g. territorium.csv's URI column).
 */
export interface CsvTableColumn {
  /** Property name on each row object. */
  key: string;
  /** Header label shown in the table head. */
  label: string;
}

interface CsvTableProps {
  columns: CsvTableColumn[];
  rows: Record<string, string>[];
  /** Column key whose value should be rendered as a link (href = the value itself). */
  linkColumn?: string;
}

export function CsvTable({ columns, rows, linkColumn }: CsvTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-300 text-left">
          {columns.map((column) => (
            <th key={column.key} className="px-2 py-1 font-medium text-gray-700">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="border-b border-gray-100 odd:bg-gray-50">
            {columns.map((column) => {
              const value = row[column.key] ?? '';
              return (
                <td key={column.key} className="px-2 py-1">
                  {column.key === linkColumn && value ? (
                    <a className="text-blue-600 hover:underline" href={value} target="_blank" rel="noreferrer">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
