import Table from './Table';
import TypeBadge from './TypeBadge';

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return value;
}

export default function ExplainTable({ title, description, rows, executionTimeMs }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
        <p className="mt-3 flex items-center gap-2 text-xs text-gray-700">
          <span className="font-semibold">Waktu:</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 font-bold text-blue-700">
            {executionTimeMs.toFixed(4)} ms
          </span>
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-gray-500">Tidak ada data.</p>
      ) : (
        <Table
          headers={[
            'id',
            'select_type',
            'table',
            'type',
            'possible_keys',
            'key',
            'key_len',
            'ref',
            'rows',
            'Extra',
          ]}
        >
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50">
              <td className="px-6 py-4 text-gray-700">{formatValue(row.id)}</td>
              <td className="px-6 py-4 text-gray-700">{formatValue(row.select_type)}</td>
              <td className="px-6 py-4 text-gray-700">{formatValue(row.table)}</td>
              <td className="px-6 py-4">
                <TypeBadge type={row.type} />
              </td>
              <td className="px-6 py-4 text-gray-700">{formatValue(row.possible_keys)}</td>
              <td className="px-6 py-4 font-semibold text-blue-700">{formatValue(row.key)}</td>
              <td className="px-6 py-4 text-gray-700">{formatValue(row.key_len)}</td>
              <td className="px-6 py-4 text-gray-700">{formatValue(row.ref)}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{formatValue(row.rows)}</td>
              <td className="px-6 py-4 text-xs text-gray-600">{formatValue(row.Extra)}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
