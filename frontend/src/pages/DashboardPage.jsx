import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Section from '../components/Section';
import Table from '../components/Table';
import Badge from '../components/Badge';
import TechBadge from '../components/TechBadge';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function DashboardPage() {
  const [managers, setManagers] = useState([]);
  const [managerTime, setManagerTime] = useState(0);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Sorting state
  const [mgrSortBy, setMgrSortBy] = useState('history_id');
  const [mgrSortDir, setMgrSortDir] = useState('asc');

  function toggleMgrSort(key) {
    if (!key || key === '__no') return;
    if (mgrSortBy === key) {
      setMgrSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setMgrSortBy(key);
      setMgrSortDir('asc');
    }
  }

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
    setErrorMessage('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      {/* Hero Header */}
      <header className="border-b border-blue-200/50 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-2xl relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-24"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          {/* Main title with icon */}
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">📊</div>
            <div className="flex-1">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
                Dashboard Laporan Manajer
              </h1>
              <p className="mt-2 text-base text-blue-50 font-semibold">
                Visualisasi Profil Lengkap dari Database View
              </p>
            </div>
          </div>

          {/* Description grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest">📋 Sumber Data</p>
              <p className="mt-1 text-sm text-white">View <code className="bg-white/20 px-1.5 py-0.5 rounded">v_manager_profile</code></p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest">🎯 Konten</p>
              <p className="mt-1 text-sm text-white">Profil, departemen, lokasi, dan status jabatan</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest">⚙️ Integrasi</p>
              <p className="mt-1 text-sm text-white">Real-time data dari 3 tabel utama</p>
            </div>
          </div>

          {/* Technology Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            <TechBadge text="MySQL Connected" color="emerald" />
            <TechBadge text="Node.js + Express" color="blue" />
            <TechBadge text="React + Tailwind" color="purple" />
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
            title="Total Manajer"
            value={loadingManagers ? '...' : managers.length}
            unit="orang"
            color="blue"
            icon="👨‍💼"
          />
          <Card
            title="Total Riwayat"
            value={loadingManagers ? '...' : managers.filter(m => m.status_jabatan === 'Aktif').length}
            unit="aktif"
            color="emerald"
            icon="✅"
          />
          <Card
            title="Waktu Laporan"
            value={loadingManagers ? '...' : managerTime.toFixed(4)}
            unit="ms"
            color="amber"
            icon="⏱️"
          />
          <Card
            title="Status"
            value={loadingManagers ? '...' : 'Siap'}
            unit="View OK"
            color="purple"
            icon="💾"
          />
        </div>

        {/* Manager Report Section */}
        <Section
          title="Laporan Profil Manajer dari View"
          sub="Data dari view v_manager_profile yang menggabungkan data employees, departments, dan manager_history."
          icon="📈"
        >
          {loadingManagers ? (
            <div className="flex items-center justify-center gap-3 rounded-lg border border-blue-200 bg-blue-50 py-10">
              <span className="text-2xl">⏳</span>
              <p className="font-semibold text-blue-900">Memuat data...</p>
            </div>
          ) : managers.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
              <p className="text-amber-900">Tidak ada data manajer ditemukan.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-lg bg-blue-50 px-4 py-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">Total:</span> {managers.length} riwayat jabatan
                  <span className="text-gray-500 ml-4">• Waktu: {managerTime.toFixed(4)} ms</span>
                </p>
              </div>

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
                  <tr key={m.history_id} className="transition-colors hover:bg-indigo-50">
                    <td className="px-6 py-4 text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-indigo-700">{m.history_id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{m.manager_full_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        {m.department_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{m.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{m.periode_jabatan}</td>
                    <td className="px-6 py-4">
                      <Badge status={m.status_jabatan} />
                    </td>
                  </tr>
                ))}
              </Table>
            </>
          )}
        </Section>

        {/* Info Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            📌 Keterangan Database View
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <p className="font-semibold text-blue-700 text-sm uppercase tracking-wide">📊 Nama View</p>
              <p className="mt-2 text-sm text-gray-700">
                <code className="font-mono bg-white px-2 py-1 rounded text-blue-600">v_manager_profile</code>
              </p>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
              <p className="font-semibold text-emerald-700 text-sm uppercase tracking-wide">📋 Tabel Sumber</p>
              <p className="mt-2 text-sm text-gray-700">
                Menggabungkan: <code className="font-mono">employees</code>, <code className="font-mono">departments</code>, <code className="font-mono">manager_history</code>
              </p>
            </div>

            <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4">
              <p className="font-semibold text-amber-700 text-sm uppercase tracking-wide">🎯 Kolom Utama</p>
              <p className="mt-2 text-sm text-gray-700">
                manager_full_name, department_name, location, periode_jabatan, status_jabatan
              </p>
            </div>

            <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
              <p className="font-semibold text-purple-700 text-sm uppercase tracking-wide">✨ Fungsi View</p>
              <p className="mt-2 text-sm text-gray-700">
                Memberikan laporan komprehensif profil manajer dengan data lengkap untuk analisis SDM
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="font-semibold text-gray-700">
            📚 Tugas Besar Pemrograman Basis Data
          </p>
          <p className="mt-1 text-sm text-gray-600">Dashboard View - Laporan Profil Manajer</p>
          <p className="mt-3 text-xs text-gray-500">
            © 2026 - Aplikasi Profil Manajer SDM
          </p>
        </footer>
      </main>
    </div>
  );
}
