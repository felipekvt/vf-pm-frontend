'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || '';
  const [assets, setAssets] = useState<any[]>([]);
  const [wos, setWos] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [assetLocation, setAssetLocation] = useState(''); // <- renomeado
  const [woTitle, setWoTitle] = useState('');
  const [woAsset, setWoAsset] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  function token() {
    return localStorage.getItem('vfpm_token') || '';
  }
  function headers() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` };
  }

  async function load() {
    const A = await fetch(`${apiBase}/api/assets`, { headers: headers() }).then((r) => r.json());
    setAssets(A);
    const W = await fetch(`${apiBase}/api/workorders`, { headers: headers() }).then((r) => r.json());
    setWos(W);
  }

  useEffect(() => {
    if (!token()) window.location.href = '/'; // <- usa window.location
    else load();
  }, []);

  async function createAsset(e: any) {
    e.preventDefault();
    setMsg(null);
    try {
      await fetch(`${apiBase}/api/assets`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ name, location: assetLocation }), // <- usa assetLocation
      });
      setName('');
      setAssetLocation('');
      await load();
    } catch (err: any) {
      setMsg(err.message || 'Erro');
    }
  }

  async function createWO(e: any) {
    e.preventDefault();
    setMsg(null);
    try {
      await fetch(`${apiBase}/api/workorders`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ assetId: woAsset, title: woTitle }),
      });
      setWoTitle('');
      await load();
    } catch (err: any) {
      setMsg(err.message || 'Erro');
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl p-4 flex justify-between">
          <a href="/" className="font-semibold">
            VF PM — Dashboard
          </a>
          <button
            onClick={() => {
              localStorage.removeItem('vfpm_token');
              window.location.href = '/'; // <- usa window.location
            }}
            className="text-sm"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6 grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="font-semibold mb-2">Ativos</h2>
          <form className="flex gap-2 mb-3" onSubmit={createAsset}>
            <input
              className="border rounded px-2 py-1"
              placeholder="Nome do ativo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border rounded px-2 py-1"
              placeholder="Local"
              value={assetLocation}
              onChange={(e) => setAssetLocation(e.target.value)}
            />
            <button className="px-3 py-1 rounded bg-slate-900 text-white">+ Ativo</button>
          </form>
          <ul className="space-y-2">
            {assets.map((a) => (
              <li key={a.id} className="border rounded p-2">
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-slate-500">{a.location || '-'}</div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Ordens de Serviço</h2>
          <form className="flex gap-2 mb-3" onSubmit={createWO}>
            <select
              className="border rounded px-2 py-1"
              value={woAsset}
              onChange={(e) => setWoAsset(e.target.value)}
            >
              <option value="">-- ativo --</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <input
              className="border rounded px-2 py-1"
              placeholder="Título"
              value={woTitle}
              onChange={(e) => setWoTitle(e.target.value)}
            />
            <button className="px-3 py-1 rounded bg-slate-900 text-white">+ OS</button>
          </form>

          <ul className="space-y-2">
            {wos.map((w) => (
              <li key={w.id} className="border rounded p-2">
                <div className="font-medium">{w.title}</div>
                <div className="text-xs text-slate-500">{w.asset?.name}</div>
                <div className="text-xs">{w.status}</div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {msg && (
        <div className="mx-auto max-w-6xl p-4 text-sm text-red-600">{msg}</div>
      )}
    </div>
  );
}
