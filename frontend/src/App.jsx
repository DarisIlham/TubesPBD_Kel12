import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function Card({ title, value, unit, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${colorClasses[color] || colorClasses.blue}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="mt-1 text-2xl font-bold">
        {value}
        <span className="ml-1 text-sm font-normal opacity-80">{unit}</span>
      </p>
    </div>
  );
}

function Badge({ status }) {
  const isAktif = status === 'Aktif';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isAktif
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-gray-200 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
}

function Section({ title, children, sub }) {
  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {sub && <p className="mb-4 text-sm text-gray-500">{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Table({ headers, children, sortable = false, sortBy, sortDir, onSort }) {
  const renderHeader = (h, i) => {
    const label = typeof h === 'string' ? h : h.label;
    const key = typeof h === 'string' ? null : h.key;

    if (!sortable || !onSort) {
      return (
        <th key={i} className="px-4 py-3 font-semibold">
          {label}
        </th>
      );
    }

    const currentKey = key || label;
    const isActive = sortBy === currentKey;

    return (
      <th key={i} className="px-4 py-3 font-semibold">
        <button
          type="button"
          onClick={() => onSort(currentKey)}
          className="inline-flex items-center gap-2"
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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>{headers.map(renderHeader)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return value;
}

function TypeBadge({ type }) {
  const isFullTableScan = type === 'ALL';

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
        isFullTableScan
          ? 'bg-red-100 text-red-700'
          : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {formatValue(type)}
    </span>
  );
}

function ExplainTable({ title, description, rows, executionTimeMs }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Waktu EXPLAIN: <span className="font-semibold">{executionTimeMs.toFixed(4)} ms</span>
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada data EXPLAIN.</p>
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
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3">{formatValue(row.id)}</td>
              <td className="px-4 py-3">{formatValue(row.select_type)}</td>
              <td className="px-4 py-3">{formatValue(row.table)}</td>
              <td className="px-4 py-3">
                <TypeBadge type={row.type} />
              </td>
              <td className="px-4 py-3">{formatValue(row.possible_keys)}</td>
              <td className="px-4 py-3 font-semibold">{formatValue(row.key)}</td>
              <td className="px-4 py-3">{formatValue(row.key_len)}</td>
              <td className="px-4 py-3">{formatValue(row.ref)}</td>
              <td className="px-4 py-3">{formatValue(row.rows)}</td>
              <td className="px-4 py-3 text-xs">{formatValue(row.Extra)}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}

function ExplainConclusion({ compare }) {
  if (!compare) return null;

  const before = compare.beforeIndex?.summary;
  const after = compare.afterIndex?.summary;
  const conclusion = compare.conclusion;

  return (
    <div
      className={`mt-5 rounded-xl border p-4 text-sm ${
        conclusion?.beforeIsFullTableScan && conclusion?.afterUsesIndex
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-amber-200 bg-amber-50 text-amber-800'
      }`}
    >
      <p className="font-bold">Kesimpulan Perbandingan EXPLAIN</p>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-white/70 p-3">
          <p className="font-semibold">Sebelum Index / Tanpa Index</p>
          <p>
            type: <code>{formatValue(before?.type)}</code>
          </p>
          <p>
            key: <code>{formatValue(before?.key)}</code>
          </p>
          <p>
            rows: <code>{formatValue(before?.rows)}</code>
          </p>
          <p className="mt-1">
            Makna:{' '}
            {before?.isFullTableScan
              ? 'Database melakukan Full Table Scan.'
              : 'Database tidak terdeteksi Full Table Scan.'}
          </p>
        </div>

        <div className="rounded-lg bg-white/70 p-3">
          <p className="font-semibold">Sesudah Index</p>
          <p>
            type: <code>{formatValue(after?.type)}</code>
          </p>
          <p>
            key: <code>{formatValue(after?.key)}</code>
          </p>
          <p>
            rows: <code>{formatValue(after?.rows)}</code>
          </p>
          <p className="mt-1">
            Makna:{' '}
            {after?.isUsingLastNameIndex
              ? `Database menggunakan index ${compare.indexName}.`
              : 'Index belum terlihat digunakan pada hasil EXPLAIN.'}
          </p>
        </div>
      </div>

      <p className="mt-3 font-medium">{conclusion?.message}</p>
    </div>
  );
}

export default function App() {
  const [managers, setManagers] = useState([]);
  const [managerTime, setManagerTime] = useState(0);
  const [loadingManagers, setLoadingManagers] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [searchTime, setSearchTime] = useState(0);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [explainCompare, setExplainCompare] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sorting state for employees and managers
  const [empSortBy, setEmpSortBy] = useState('employee_id');
  const [empSortDir, setEmpSortDir] = useState('asc');

  const [mgrSortBy, setMgrSortBy] = useState('history_id');
  const [mgrSortDir, setMgrSortDir] = useState('asc');

  const explainBeforeTime = explainCompare?.beforeIndex?.executionTimeMs || 0;
  const explainAfterTime = explainCompare?.afterIndex?.executionTimeMs || 0;
  const totalTime = managerTime + searchTime + explainBeforeTime + explainAfterTime;

  function toggleEmpSort(key) {
    if (!key || key === '__no') return;
    if (empSortBy === key) {
      setEmpSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setEmpSortBy(key);
      setEmpSortDir('asc');
    }
  }

  function toggleMgrSort(key) {
    if (!key || key === '__no') return;
    if (mgrSortBy === key) {
      setMgrSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setMgrSortBy(key);
      setMgrSortDir('asc');
    }
  }

  const sortedEmployees = useMemo(() => {
    const arr = Array.isArray(employees) ? [...employees] : [];
    const key = empSortBy;
    if (!key) return arr;

    arr.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va == null && vb == null) return 0;
      if (va == null) return empSortDir === 'asc' ? -1 : 1;
      if (vb == null) return empSortDir === 'asc' ? 1 : -1;

      if (typeof va === 'number' || typeof vb === 'number' || key.endsWith('_id')) {
        const na = Number(va);
        const nb = Number(vb);
        return empSortDir === 'asc' ? na - nb : nb - na;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(String(va)) && /^\d{4}-\d{2}-\d{2}$/.test(String(vb))) {
        const da = new Date(va);
        const db = new Date(vb);
        return empSortDir === 'asc' ? da - db : db - da;
      }

      return empSortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

    return arr;
  }, [employees, empSortBy, empSortDir]);

  const sortedManagers = useMemo(() => {
    const arr = Array.isArray(managers) ? [...managers] : [];
    const key = mgrSortBy;
    if (!key) return arr;

    arr.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va == null && vb == null) return 0;
      if (va == null) return mgrSortDir === 'asc' ? -1 : 1;
      if (vb == null) return mgrSortDir === 'asc' ? 1 : -1;

      if (typeof va === 'number' || typeof vb === 'number' || key.endsWith('_id')) {
        const na = Number(va);
        const nb = Number(vb);
        return mgrSortDir === 'asc' ? na - nb : nb - na;
      }

      return mgrSortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

    return arr;
  }, [managers, mgrSortBy, mgrSortDir]);

  useEffect(() => {
    fetchManagers();
  }, []);

  async function fetchManagers() {
    setLoadingManagers(true);

    try {
      const res = await fetch(`${API_BASE}/managers`);
      const json = await res.json();

      if (json.success) {
        setManagers(json.data || []);
        setManagerTime(json.executionTimeMs || 0);
      } else {
        setErrorMessage(json.message || 'Gagal memuat data manajer.');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Gagal terhubung ke backend saat memuat data manajer.');
    } finally {
      setLoadingManagers(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();

    const q = searchQuery.trim();
    if (!q) return;

    setLoadingSearch(true);
    setHasSearched(true);
    setErrorMessage('');
    setEmployees([]);
    setExplainCompare(null);
    setSearchTime(0);

    try {
      const [resSearch, resCompare] = await Promise.all([
        fetch(`${API_BASE}/employees/search?lastName=${encodeURIComponent(q)}`),
        fetch(`${API_BASE}/explain/compare?lastName=${encodeURIComponent(q)}`),
      ]);

      const jsonSearch = await resSearch.json();
      const jsonCompare = await resCompare.json();

      if (jsonSearch.success) {
        setEmployees(jsonSearch.data || []);
        setSearchTime(jsonSearch.executionTimeMs || 0);
      } else {
        setErrorMessage(jsonSearch.message || 'Gagal melakukan pencarian pegawai.');
      }

      if (jsonCompare.success) {
        setExplainCompare(jsonCompare);
      } else {
        setErrorMessage(jsonCompare.message || 'Gagal mengambil perbandingan EXPLAIN.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal terhubung ke backend saat melakukan pencarian.');
    } finally {
      setLoadingSearch(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Aplikasi Profil Manajer SDM
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tugas Besar Pemrograman Basis Data — Node.js + Express + React + MySQL
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Pesan Error */}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Terjadi Kesalahan</p>
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Timers */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card
            title="Waktu Proses Laporan Manajer"
            value={loadingManagers ? '...' : managerTime.toFixed(4)}
            unit="ms"
            color="blue"
          />
          <Card
            title="Waktu Proses Pencarian"
            value={loadingSearch ? '...' : searchTime.toFixed(4)}
            unit="ms"
            color="emerald"
          />
          <Card
            title="Waktu EXPLAIN Total"
            value={loadingSearch ? '...' : (explainBeforeTime + explainAfterTime).toFixed(4)}
            unit="ms"
            color="purple"
          />
          <Card
            title="Total Waktu Proses"
            value={loadingManagers || loadingSearch ? '...' : totalTime.toFixed(4)}
            unit="ms"
            color="amber"
          />
        </div>

        {/* Bagian B: Pencarian Pegawai */}
        <Section
          title="Pencarian Pegawai Berdasarkan Nama Belakang"
          sub="Query menggunakan pola LIKE 'keyword%' agar index pada kolom last_name dapat digunakan."
        >
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama Belakang
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contoh: Santoso"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={loadingSearch}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
            >
              {loadingSearch ? 'Mencari...' : 'Cari'}
            </button>
          </form>

          {/* Hasil Pencarian Pegawai */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Hasil Pencarian Pegawai
            </h3>

            {hasSearched && employees.length === 0 && !loadingSearch && (
              <p className="text-sm text-gray-500">Tidak ada pegawai ditemukan.</p>
            )}

            {employees.length > 0 && (
              <Table
                sortable
                sortBy={empSortBy}
                sortDir={empSortDir}
                onSort={toggleEmpSort}
                headers={[
                  { label: 'No', key: '__no' },
                  { label: 'ID', key: 'employee_id' },
                  { label: 'Nama Depan', key: 'first_name' },
                  { label: 'Nama Belakang', key: 'last_name' },
                  { label: 'Email', key: 'email' },
                  { label: 'Tanggal Masuk', key: 'hire_date' },
                  { label: 'Dept ID', key: 'department_id' },
                ]}
              >
                {sortedEmployees.map((row, idx) => (
                  <tr key={row.employee_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{row.employee_id}</td>
                    <td className="px-4 py-3">{row.first_name}</td>
                    <td className="px-4 py-3 font-medium">{row.last_name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.hire_date}</td>
                    <td className="px-4 py-3">{row.department_id}</td>
                  </tr>
                ))}
              </Table>
            )}
          </div>

          {/* Hasil EXPLAIN Compare */}
          <div className="mt-8">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Perbandingan EXPLAIN Sebelum dan Sesudah Index
            </h3>

            {!explainCompare && hasSearched && !loadingSearch && (
              <p className="text-sm text-gray-500">Tidak ada data perbandingan EXPLAIN.</p>
            )}

            {explainCompare && (
              <>
                <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <p className="font-semibold">Query yang diuji:</p>
                  <code className="mt-1 block rounded bg-white/70 p-2 text-xs">
                    SELECT employee_id, first_name, last_name, email, hire_date, department_id
                    FROM employees WHERE last_name LIKE "{explainCompare.keyword}%";
                  </code>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <ExplainTable
                    title="Sebelum Index / Simulasi Tanpa Index"
                    description={`Menggunakan IGNORE INDEX (${explainCompare.indexName}) untuk membuktikan kondisi tanpa index. Target bukti: type = ALL dan key = NULL.`}
                    rows={explainCompare.beforeIndex?.explain || []}
                    executionTimeMs={explainCompare.beforeIndex?.executionTimeMs || 0}
                  />

                  <ExplainTable
                    title="Sesudah Index"
                    description={`Query normal setelah index ${explainCompare.indexName} dibuat. Target bukti: type = range/ref dan key = ${explainCompare.indexName}.`}
                    rows={explainCompare.afterIndex?.explain || []}
                    executionTimeMs={explainCompare.afterIndex?.executionTimeMs || 0}
                  />
                </div>

                <ExplainConclusion compare={explainCompare} />
              </>
            )}
          </div>
        </Section>

        {/* Bagian A: Laporan Manajer dari View */}
        <Section
          title="Laporan Profil Manajer"
          sub={`Data diambil dari view v_manager_profile. Total data: ${managers.length} baris.`}
        >
          {loadingManagers ? (
            <p className="text-sm text-gray-500">Memuat data manajer...</p>
          ) : managers.length === 0 ? (
            <p className="text-sm text-gray-500">Tidak ada data manajer.</p>
          ) : (
            <Table
              sortable
              sortBy={mgrSortBy}
              sortDir={mgrSortDir}
              onSort={toggleMgrSort}
              headers={[
                { label: 'No', key: '__no' },
                { label: 'History ID', key: 'history_id' },
                { label: 'Nama Lengkap', key: 'manager_full_name' },
                { label: 'Departemen', key: 'department_name' },
                { label: 'Lokasi', key: 'location' },
                { label: 'Periode Jabatan', key: 'periode_jabatan' },
                { label: 'Status', key: 'status_jabatan' },
              ]}
            >
              {sortedManagers.map((m, idx) => (
                <tr key={m.history_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{m.history_id}</td>
                  <td className="px-4 py-3 font-medium">{m.manager_full_name}</td>
                  <td className="px-4 py-3">{m.department_name}</td>
                  <td className="px-4 py-3">{m.location}</td>
                  <td className="px-4 py-3">{m.periode_jabatan}</td>
                  <td className="px-4 py-3">
                    <Badge status={m.status_jabatan} />
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        {/* Footer info */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
          <p className="font-semibold text-gray-800">Keterangan Teknis:</p>

          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>View:</strong> <code>v_manager_profile</code> menggabungkan tabel{' '}
              <code>employees</code>, <code>departments</code>, dan{' '}
              <code>manager_history</code>.
            </li>
            <li>
              <strong>Index:</strong> <code>idx_employees_last_name</code> dibangun pada kolom{' '}
              <code>last_name</code> agar pencarian nama belakang lebih cepat.
            </li>
            <li>
              <strong>Perbandingan EXPLAIN:</strong> bagian sebelum index menggunakan{' '}
              <code>IGNORE INDEX</code> untuk mensimulasikan kondisi tanpa index, sedangkan bagian
              sesudah index menjalankan query normal.
            </li>
            <li>
              <strong>Bukti Full Table Scan:</strong> jika <code>type = ALL</code> dan{' '}
              <code>key = NULL</code>, berarti database melakukan Full Table Scan.
            </li>
            <li>
              <strong>Bukti index digunakan:</strong> jika <code>key = idx_employees_last_name</code>{' '}
              dan <code>type</code> bukan <code>ALL</code>, berarti database sudah menggunakan index.
            </li>
            <li>
              <strong>Keamanan:</strong> backend menggunakan parameterized query untuk mengurangi
              risiko SQL Injection.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}