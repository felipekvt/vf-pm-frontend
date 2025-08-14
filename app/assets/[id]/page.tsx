'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';

export default function AssetDetail() {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<any>(null);
  const [wos, setWos] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('vfpm_token') || '' : '');
  const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

  async function load() {
    // tenta GET /api/assets/:id; se não houver, pega a lista e filtra
    const aRes = await fetch(`${api}/api/assets/${id}`, { headers: headers() });
    if (aRes.ok) setAsset(await aRes.json());
    else {
      const list = await fetch(`${api}/api/assets`, { headers: headers() }).then(r=>r.json());
      setAsset(list.find((x:any)=>x.id===id) || null);
    }
    // lista de OS e filtra por assetId
    const wList = await fetch(`${api}/api/workorders`, { headers: headers() }).then(r=>r.json());
    setWos(wList.filter((w:any)=> w.asset?.id===id || w.assetId===id));
  }

  useEffect(() => {
    if (!token()) { window.location.href = '/'; return; }
    load().finally(()=>setLoading(false));
  }, [id]);

  async function openWO(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!title) { setMsg('Informe o título.'); return; }
    try {
      await fetch(`${api}/api/workorders`, { method:'POST', headers: headers(), body: JSON.stringify({ assetId: id, title }) });
      setTitle(''); await load();
    } catch (err:any) { setMsg(err.message || 'Erro ao abrir OS'); }
  }

  if (loading) return <div className="space-y-3"><div className="h-10 bg-gray-100 rounded-xl animate-pulse" /><div className="h-40 bg-gray-100 rounded-xl animate-pulse" /></div>;
  if (!asset) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-gray-600">Ativo #{asset.id?.slice(0,6)}</div>
          <h1 className="text-2xl font-bold">{asset.name}</h1>
          <div className="text-sm text-gray-600">Local: <span className="font-medium">{asset.location ?? '-'}</span></div>
        </div>
      </div>

      {/* Abrir OS para este ativo */}
      <div className="card p-4">
        <div className="font-semibold mb-2">Abrir OS</div>
        <form className="flex gap-2" onSubmit={openWO}>
          <input className="input flex-1" placeholder="Título da OS" value={title} onChange={e=>setTitle(e.target.value)} />
          <button className="btn-primary">+ Criar</button>
        </form>
        {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </div>

      {/* OS do ativo */}
      <div className="card p-4">
        <div className="font-semibold mb-2">Ordens deste ativo</div>
        {wos.length ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr><Th>Título</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {wos.map((w:any)=>(
                  <tr key={w.id} className="border-t border-gray-200 hover:bg-gray-50/60">
                    <Td className="font-medium"><Link href={`/workorders/${w.id}`} className="hover:underline">{w.title}</Link></Td>
                    <Td><span className={`badge ${badge(w.status)}`}>{w.status}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="text-sm text-gray-600">Nenhuma OS ainda para este ativo.</div>}
      </div>
    </div>
  );
}

function Th({ children }: any) { return <th className="text-left font-medium px-3 py-2">{children}</th>; }
function Td({ children, className="" }: any) { return <td className={`px-3 py-2 ${className}`}>{children}</td>; }
function badge(s: string) { return s==='DONE'?'border-green-500 text-green-600':s==='IN_PROGRESS'?'border-amber-500 text-amber-600':'border-gray-400 text-gray-700'; }
