export default function TypeBadge({ type }) {
  const isFullTableScan = type === 'ALL';

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
        isFullTableScan
          ? 'bg-red-100 text-red-700'
          : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {type || '-'}
    </span>
  );
}
