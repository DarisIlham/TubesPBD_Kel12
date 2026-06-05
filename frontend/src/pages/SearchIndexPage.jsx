import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Section from '../components/Section';
import Table from '../components/Table';
import TypeBadge from '../components/TypeBadge';
import ExplainTable from '../components/ExplainTable';
import ExplainConclusion from '../components/ExplainConclusion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function SearchIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [searchTime, setSearchTime] = useState(0);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [explainCompare, setExplainCompare] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Manager suggestions
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  // Sorting state for employees
  const [empSortBy, setEmpSortBy] = useState('employee_id');
  const [empSortDir, setEmpSortDir] = useState('asc');

  const explainBeforeTime = explainCompare?.beforeIndex?.executionTimeMs || 0;
  const explainAfterTime = explainCompare?.afterIndex?.executionTimeMs || 0;
  const totalTime = searchTime + explainBeforeTime + explainAfterTime;

  function toggleEmpSort(key) {
    if (!key || key === '__no') return;
    if (empSortBy === key) {
      setEmpSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setEmpSortBy(key);
      setEmpSortDir('asc');
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

  // Load managers for suggestions
  useEffect(() => {
    async function fetchManagers() {
      try {
        const res = await fetch(`${API_BASE}/managers`);
        const json = await res.json();
        if (json.success) {
          setManagers(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load managers:', err);
      } finally {
        setLoadingManagers(false);
      }
    }
    fetchManagers();
  }, []);

  // Real-time search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length === 0) {
        setEmployees([]);
        setExplainCompare(null);
        setHasSearched(false);
        return;
      }

      performSearch(searchQuery.trim());
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  async function performSearch(query) {
    setLoadingSearch(true);
    setHasSearched(true);
    setErrorMessage('');
    setSearchTime(0);

    try {
      const [resSearch, resCompare] = await Promise.all([
        fetch(`${API_BASE}/employees/search?lastName=${encodeURIComponent(query)}`),
        fetch(`${API_BASE}/explain/compare?lastName=${encodeURIComponent(query)}`),
      ]);

      const jsonSearch = await resSearch.json();
      const jsonCompare = await resCompare.json();

      if (jsonSearch.success) {
        setEmployees(jsonSearch.data || []);
        setSearchTime(jsonSearch.executionTimeMs || 0);
      } else {
        setEmployees([]);
      }

      if (jsonCompare.success) {
        setExplainCompare(jsonCompare);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal terhubung ke backend saat melakukan pencarian.');
    } finally {
      setLoadingSearch(false);
    }
  }

  // Get unique last names from managers
  const uniqueManagerLastNames = useMemo(() => {
    const lastNames = managers.map(m => m.manager_full_name?.split(' ').pop()).filter(Boolean);
    return [...new Set(lastNames)].sort();
  }, [managers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100">
      {/* Hero Header */}
      <header className="border-b border-emerald-200/50 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-24"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          {/* Main title with icon */}
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">🔍</div>
            <div className="flex-1">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
                Pencarian & Index Analysis
              </h1>
              <p className="mt-2 text-base text-emerald-50 font-semibold">
                Optimasi Query Performance dengan Database Index
              </p>
            </div>
          </div>

          {/* Description grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-widest">🎯 Tujuan</p>
              <p className="mt-1 text-sm text-white">Membandingkan performa query dengan dan tanpa index</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-widest">⚡ Fitur</p>
              <p className="mt-1 text-sm text-white">Real-time search dengan EXPLAIN analysis</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-xs font-semibold text-emerald-100 uppercase tracking-widest">📊 Metrik</p>
              <p className="mt-1 text-sm text-white">Waktu query, rows scanned, index usage</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-8 flex items-start gap-4 rounded-lg border border-red-300 bg-red-50 p-4 shadow-sm">
            <span className="text-2xl flex-shrink-0">❌</span>
            <div>
              <p className="font-semibold text-red-900">Terjadi Kesalahan</p>
              <p className="mt-1 text-sm text-red-800">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Performance Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            title="Waktu Pencarian"
            value={loadingSearch ? '...' : searchTime.toFixed(4)}
            unit="ms"
            color="emerald"
            icon="🔍"
          />
          <Card
            title="Waktu EXPLAIN"
            value={loadingSearch ? '...' : (explainBeforeTime + explainAfterTime).toFixed(4)}
            unit="ms"
            color="amber"
            icon="📊"
          />
          <Card
            title="Total Waktu"
            value={loadingSearch ? '...' : totalTime.toFixed(4)}
            unit="ms"
            color="purple"
            icon="⚡"
          />
          <Card
            title="Status Index"
            value={explainCompare?.afterIndex?.summary?.isUsingLastNameIndex ? 'Aktif' : 'N/A'}
            unit="✅"
            color="indigo"
            icon="🔑"
          />
        </div>

        {/* Search Section */}
        <Section
          title="Pencarian Pegawai Berdasarkan Nama Belakang"
          sub="Ketik nama belakang untuk mencari secara real-time. Index akan secara otomatis mengoptimalkan query Anda."
          icon="🔎"
        >
          {/* Search Input - Real-time */}
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-6 border border-emerald-200">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Cari Nama Belakang
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mulai ketik untuk mencari... (contoh: wi, ka, su)"
                  className="w-full rounded-lg border-2 border-emerald-300 px-4 py-3 text-sm shadow-md outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
                />
                <div className="absolute right-3 top-3 text-2xl">
                  {loadingSearch ? '⏳' : '✨'}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                ℹ️ Hasil muncul otomatis saat Anda mengetik. Pencarian menggunakan index <code className="bg-emerald-100 px-1.5 py-0.5 rounded">idx_employees_last_name</code>
              </p>
            </div>
          </div>

          {/* Quick Manager Suggestions */}
          {!loadingManagers && uniqueManagerLastNames.length > 0 && (
            <div className="mb-8">
              
            </div>
          )}

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-900 tracking-wide">
                  Query yang Diuji:
                </p>
                <code className="mt-2 block rounded bg-white p-3 text-xs font-mono text-gray-700 overflow-x-auto border border-emerald-100">
                  SELECT * FROM employees WHERE last_name LIKE "{explainCompare?.keyword || searchQuery}%";
                </code>
              </div>

              {/* Search Results Table */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Hasil Pencarian Pegawai
                </h3>

                {employees.length === 0 && !loadingSearch && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-amber-900">Tidak ada hasil</p>
                      <p className="text-sm text-amber-800">Tidak ada pegawai ditemukan dengan nama belakang "{searchQuery}". Coba nama lain atau gunakan saran di atas.</p>
                    </div>
                  </div>
                )}

                {employees.length > 0 && (
                  <>
                    <p className="mb-4 text-sm font-medium text-gray-700">
                      <span className="text-emerald-600 font-bold">{employees.length}</span> hasil ditemukan
                    </p>
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
                        <tr key={row.employee_id} className="transition-colors hover:bg-emerald-50">
                          <td className="px-6 py-4 text-gray-700">{idx + 1}</td>
                          <td className="px-6 py-4 font-semibold text-teal-700">{row.employee_id}</td>
                          <td className="px-6 py-4 text-gray-700">{row.first_name}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">{row.last_name}</td>
                          <td className="px-6 py-4 text-gray-700">{row.email}</td>
                          <td className="px-6 py-4 text-gray-700">{row.hire_date}</td>
                          <td className="px-6 py-4 text-gray-700">{row.department_id}</td>
                        </tr>
                      ))}
                    </Table>
                  </>
                )}
              </div>

              {/* EXPLAIN Comparison */}
              {explainCompare && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Perbandingan EXPLAIN: Sebelum vs Sesudah Index
                  </h3>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ExplainTable
                      title="❌ Sebelum Index (Full Table Scan)"
                      description={`Simulasi tanpa index menggunakan IGNORE INDEX. Type: ALL, Key: NULL`}
                      rows={explainCompare.beforeIndex?.explain || []}
                      executionTimeMs={explainCompare.beforeIndex?.executionTimeMs || 0}
                    />

                    <ExplainTable
                      title="✅ Sesudah Index (Optimized)"
                      description={`Query normal dengan index. Type: range/ref, Key: idx_employees_last_name`}
                      rows={explainCompare.afterIndex?.explain || []}
                      executionTimeMs={explainCompare.afterIndex?.executionTimeMs || 0}
                    />
                  </div>

                  <ExplainConclusion compare={explainCompare} />
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Info Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            🔑 Keterangan Database Index
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
              <p className="font-semibold text-emerald-700 text-sm uppercase tracking-wide">📌 Nama Index</p>
              <p className="mt-2 text-sm text-gray-700">
                <code className="font-mono bg-white px-2 py-1 rounded text-emerald-600">idx_employees_last_name</code>
              </p>
            </div>

            <div className="rounded-lg border border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 p-4">
              <p className="font-semibold text-teal-700 text-sm uppercase tracking-wide">🎯 Kolom yang Di-index</p>
              <p className="mt-2 text-sm text-gray-700">
                <code className="font-mono">employees.last_name</code> - Optimasi pencarian by last name
              </p>
            </div>

            <div className="rounded-lg border border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 p-4">
              <p className="font-semibold text-cyan-700 text-sm uppercase tracking-wide">✨ Tipe Query</p>
              <p className="mt-2 text-sm text-gray-700">
                <code className="font-mono">LIKE 'keyword%'</code> - Pattern matching dengan prefix
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4">
              <p className="font-semibold text-green-700 text-sm uppercase tracking-wide">⚡ Impact</p>
              <p className="mt-2 text-sm text-gray-700">
                Mengurangi Full Table Scan menjadi Index Range Scan untuk performa lebih baik
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="font-semibold text-gray-700">
            📚 Tugas Besar Pemrograman Basis Data
          </p>
          <p className="mt-1 text-sm text-gray-600">Pencarian & Analisis Index - Optimasi Query Performance</p>
          <p className="mt-3 text-xs text-gray-500">
            © 2026 - Aplikasi Profil Manajer SDM
          </p>
        </footer>
      </main>
    </div>
  );
}
