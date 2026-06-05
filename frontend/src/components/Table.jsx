export default function Table({ headers, children, sortable = false, sortBy, sortDir, onSort }) {
  const renderHeader = (h, i) => {
    const label = typeof h === 'string' ? h : h.label;
    const key = typeof h === 'string' ? null : h.key;

    if (!sortable || !onSort) {
      return (
        <th key={i} className="px-6 py-4 text-left font-semibold text-gray-700">
          {label}
        </th>
      );
    }

    const currentKey = key || label;
    const isActive = sortBy === currentKey;

    return (
      <th key={i} className="px-6 py-4 text-left font-semibold text-gray-700">
        <button
          type="button"
          onClick={() => onSort(currentKey)}
          className="inline-flex items-center gap-2 hover:text-blue-600"
        >
          <span>{label}</span>
          <span className="text-xs opacity-70">
            {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <tr>{headers.map(renderHeader)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {children}
        </tbody>
      </table>
    </div>
  );
}
