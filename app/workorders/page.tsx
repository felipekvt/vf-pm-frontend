'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type WO = { id: string; title: string; status: string; asset?: { name?: string } };

export default function WorkOrdersPage() {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const [wos, setWos] = useState<WO[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [woTitle, setWoTitle] = useState('');
  const [woAsset, setWoAsset] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('vfpm_token') || '' : '');
  const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

  async function load() {
    const [A, W] = await Promise.all([
      fetch(`${api}/api/assets`, { headers: headers() }).then(r => r.json()),
      fetch(`${api}/api/workorders`, { headers: headers() }).then(r => r.json()),
    ]);
    setAssets(A);
    setWos(W);
  }

  useEffect(() => {
    if (!token()) { window.location.href = '/'; return; }
    load().finally(() => setLoading(false));
  }, []);

  async function createWO(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!woAsset || !woTitle) { setMsg('Selecione um ativo e preencha o título.'); return; }
    try {
      await fetch(`${api}/api/workorders`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ assetId: woAsset, title: woTitle }),
      });
      setWoTitle('');
      await load();
    } catch (err: any) { setMsg(err.message || 'Erro ao criar OS'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
          <p className="text-sm text-gray-600">Abra, acompanhe e feche suas OS.</p>
        </div>
      </div>

      <div className="card p-4">
        <form className="flex flex-col md:flex-row gap-2" onSubmit={createWO}>
          <select className="input max-w-xs" value={woAsset} onChange={(e) => setWoAsset(e.target.value)}>
            <option value="">-- selecione o ativo --</option>
            {assets.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        <input className="input flex-1" placeholder="Título da OS" value={woTitle} onChange={(e)=>setWoTitle(e.target.value)} />
          <button className="btn-primary">+ Criar OS</button>
        </form>
        {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </div>

      <div className="card p-4">
        {loading ? <SkeletonList /> : wos.length ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr><Th>Título</Th><Th>Ativo</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {wos.map((w) => (
                  <tr key={w.id} className="border-t border-gray-200 hover:bg-gray-50/60">
                    <Td className="font-medium">
                      <Link href={`/workorders/${w.id}`} className="hover:underline">{w.title}</Link>
                    </Td>
                    <Td>{w.asset?.name ?? '-'}</Td>
                    <Td><span className={`badge ${badge(w.status)}`}>{w.status}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState text="Nenhuma OS cadastrada ainda" />}
      </div>
    </div>
  );
}

function Th({ children }: any) { return <th className="text-left font-medium px-3 py-2">{children}</th>; }
function Td({ children, className="" }: any) { return <td className={`px-3 py-2 ${className}`}>{children}</td>; }
function SkeletonList() { return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>; }
function EmptyState({ text }: { text: string }) { return <div className="p-6 text-center text-gray-600">{text}</div>; }
function badge(s: string) { return s==='DONE'?'border-green-500 text-green-600':s==='IN_PROGRESS'?'border-amber-500 text-amber-600':'border-gray-400 text-gray-700'; }
