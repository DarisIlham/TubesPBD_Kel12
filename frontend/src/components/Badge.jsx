export default function Badge({ status }) {
  const isAktif = status === 'Aktif';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isAktif
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {status}
    </span>
  );
}
