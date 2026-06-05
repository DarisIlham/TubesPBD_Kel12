export default function TechBadge({ text, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colorClasses[color]}`}>
      ●
      <span className="ml-1">{text}</span>
    </span>
  );
}
