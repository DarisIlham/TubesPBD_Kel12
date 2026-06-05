function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return value;
}

export default function ExplainConclusion({ compare }) {
  if (!compare) return null;

  const before = compare.beforeIndex?.summary;
  const after = compare.afterIndex?.summary;
  const conclusion = compare.conclusion;

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card Sebelum Index */}
        <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-md">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-lg font-bold text-red-900">Sebelum Index</h4>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/60 px-4 py-3 backdrop-blur">
              <p className="text-xs text-gray-600">Type</p>
              <p className="font-mono text-lg font-bold text-red-700">{formatValue(before?.type)}</p>
            </div>
            <div className="rounded-lg bg-white/60 px-4 py-3 backdrop-blur">
              <p className="text-xs text-gray-600">Key</p>
              <p className="font-mono text-lg font-bold text-red-700">{formatValue(before?.key) || 'NULL'}</p>
            </div>
            <div className="rounded-lg bg-white/60 px-4 py-3 backdrop-blur">
              <p className="text-xs text-gray-600">Rows Scanned</p>
              <p className="font-mono text-lg font-bold text-red-700">{formatValue(before?.rows)}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-red-200 bg-red-100 px-4 py-3">
            <p className="text-xs font-semibold text-red-900">
              {before?.isFullTableScan ? '🔴 Full Table Scan - Seluruh tabel di-scan!' : 'Query tidak terdeteksi Full Table Scan'}
            </p>
          </div>
        </div>

        {/* Card Sesudah Index */}
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-md">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <h4 className="text-lg font-bold text-emerald-900">Sesudah Index</h4>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg bg-white/60 px-4 py-3 backdrop-blur">
              <p className="text-xs text-gray-600">Type</p>
              <p className="font-mono text-lg font-bold text-emerald-700">{formatValue(after?.type)}</p>
            </div>
            <div className="rounded-lg bg-white/60 px-4 py-3 backdrop-blur">
              <p className="text-xs text-gray-600">Key</p>
              <p className="font-mono text-lg font-bold text-emerald-700">{formatValue(after?.key) || 'idx_employees_last_name'}</p>
            </div>
            <div className="rounded-lg bg-white/60 px-4 py-3 backdrop-blur">
              <p className="text-xs text-gray-600">Rows Scanned</p>
              <p className="font-mono text-lg font-bold text-emerald-700">{formatValue(after?.rows)}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-100 px-4 py-3">
            <p className="text-xs font-semibold text-emerald-900">
              {after?.isUsingLastNameIndex ? '🟢 Index Digunakan - Query lebih cepat!' : 'Index belum terlihat digunakan'}
            </p>
          </div>
        </div>
      </div>

      {/* Kesimpulan */}
      <div className={`rounded-xl border-2 p-6 shadow-md ${
        conclusion?.beforeIsFullTableScan && conclusion?.afterUsesIndex
          ? 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50'
          : 'border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50'
      }`}>
        <h4 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
          <span>📊</span>
          Kesimpulan Perbandingan EXPLAIN
        </h4>
        <p className={`text-base font-medium ${
          conclusion?.beforeIsFullTableScan && conclusion?.afterUsesIndex
            ? 'text-emerald-900'
            : 'text-amber-900'
        }`}>
          {conclusion?.message}
        </p>
      </div>
    </div>
  );
}
