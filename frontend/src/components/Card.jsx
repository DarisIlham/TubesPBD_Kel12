export default function Card({ title, value, unit, color, icon }) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900',
    amber: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-900',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-900',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-900',
    indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900',
  };

  const iconColorClasses = {
    blue: 'bg-blue-200 text-blue-600',
    emerald: 'bg-emerald-200 text-emerald-600',
    amber: 'bg-amber-200 text-amber-600',
    purple: 'bg-purple-200 text-purple-600',
    orange: 'bg-orange-200 text-orange-600',
    indigo: 'bg-indigo-200 text-indigo-600',
  };

  return (
    <div className={`rounded-lg border p-5 shadow-sm ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide opacity-75">{title}</p>
          <p className="mt-2 text-2xl font-bold">
            {value}
            <span className="ml-1.5 text-sm font-normal opacity-70">{unit}</span>
          </p>
        </div>
        {icon && (
          <div className={`rounded-lg p-2.5 ${iconColorClasses[color] || iconColorClasses.blue}`}>
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
