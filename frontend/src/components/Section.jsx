export default function Section({ title, children, sub, icon }) {
  return (
    <div className="mb-12 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {sub && <p className="mt-1 text-sm text-gray-600">{sub}</p>}
          </div>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}
